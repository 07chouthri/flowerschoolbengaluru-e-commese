import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertOrderSchema, insertEnrollmentSchema, insertUserSchema, updateUserProfileSchema, validateCouponSchema } from "@shared/schema";
import { z } from "zod";
import bcrypt from "bcryptjs";
import twilio from "twilio";

// Simple in-memory session storage
const sessions: Map<string, { userId: string; expires: number }> = new Map();

// Simple in-memory OTP storage
const otpStorage: Map<string, { otp: string; expires: number; verified: boolean }> = new Map();

// Initialize Twilio client for Verify service
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Helper function to generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Helper function to send OTP via Twilio Verify
const sendVerificationCode = async (phone: string) => {
  try {
    console.log(`[VERIFY DEBUG] Attempting to send verification code:`);
    console.log(`[VERIFY DEBUG] TO: ${phone}`);
    console.log(`[VERIFY DEBUG] Service SID: ${process.env.TWILIO_VERIFY_SERVICE_SID}`);
    
    const verification = await twilioClient.verify.v2.services(process.env.TWILIO_VERIFY_SERVICE_SID!)
      .verifications
      .create({
        to: phone,
        channel: 'sms'
      });
    
    console.log(`[VERIFY SUCCESS] Verification sent successfully to ${phone}, Status: ${verification.status}`);
    return true;
  } catch (error) {
    console.error("Verification sending error:", error);
    return false;
  }
};

// Helper function to verify OTP
const verifyCode = async (phone: string, code: string) => {
  try {
    console.log(`[VERIFY DEBUG] Attempting to verify code:`);
    console.log(`[VERIFY DEBUG] Phone: ${phone}, Code: ${code}`);
    
    const verificationCheck = await twilioClient.verify.v2.services(process.env.TWILIO_VERIFY_SERVICE_SID!)
      .verificationChecks
      .create({
        to: phone,
        code: code
      });
    
    console.log(`[VERIFY SUCCESS] Verification status: ${verificationCheck.status}`);
    return verificationCheck.status === 'approved';
  } catch (error) {
    console.error("Verification check error:", error);
    return false;
  }
};

// Helper function to send email (mock implementation)
const sendEmail = async (email: string, subject: string, message: string) => {
  // For testing purposes, we'll log the email and always return success
  // In production, you would integrate with an email service like SendGrid, AWS SES, etc.
  console.log(`[EMAIL SENT] To: ${email}`);
  console.log(`[EMAIL SENT] Subject: ${subject}`);
  console.log(`[EMAIL SENT] Message: ${message}`);
  console.log('--- EMAIL SENT SUCCESSFULLY ---');
  return true;
};

// Helper function to generate session token
const generateSessionToken = () => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

// Helper function to clean expired sessions
const cleanExpiredSessions = () => {
  const now = Date.now();
  sessions.forEach((session, token) => {
    if (session.expires < now) {
      sessions.delete(token);
    }
  });
};

// Middleware to get user from session
const getUserFromSession = async (req: any) => {
  cleanExpiredSessions();
  const sessionToken = req.headers.authorization?.replace('Bearer ', '') || req.cookies?.sessionToken;
  if (!sessionToken) return null;
  
  const session = sessions.get(sessionToken);
  if (!session || session.expires < Date.now()) {
    sessions.delete(sessionToken);
    return null;
  }
  
  return await storage.getUser(session.userId);
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Coupon validation endpoint
  app.post("/api/coupons/validate", async (req, res) => {
    try {
      const validationData = validateCouponSchema.parse(req.body);
      const { code, cartSubtotal, userId } = validationData;
      
      // Normalize coupon code to uppercase for case-insensitive matching
      const normalizedCode = code.trim().toUpperCase();
      
      console.log(`[COUPON] Validating coupon: ${normalizedCode} for cart subtotal: ${cartSubtotal}`);
      
      // Find the coupon
      const coupon = await storage.getCouponByCode(normalizedCode);
      if (!coupon) {
        return res.status(404).json({ 
          valid: false, 
          error: "Invalid coupon code" 
        });
      }
      
      console.log(`[COUPON] Found coupon: ${JSON.stringify(coupon)}`);
      
      // Check if coupon is active
      if (!coupon.isActive) {
        return res.status(400).json({ 
          valid: false, 
          error: "This coupon is no longer active" 
        });
      }
      
      // Check date validity
      const now = new Date();
      if (coupon.startsAt && new Date(coupon.startsAt) > now) {
        return res.status(400).json({ 
          valid: false, 
          error: "This coupon is not yet valid" 
        });
      }
      
      if (coupon.expiresAt && new Date(coupon.expiresAt) < now) {
        return res.status(400).json({ 
          valid: false, 
          error: "This coupon has expired" 
        });
      }
      
      // Check usage limit
      if (coupon.usageLimit !== null && (coupon.timesUsed ?? 0) >= coupon.usageLimit) {
        return res.status(400).json({ 
          valid: false, 
          error: "This coupon has reached its usage limit" 
        });
      }
      
      // Check minimum order amount
      const minOrderAmount = parseFloat(coupon.minOrderAmount || "0");
      if (cartSubtotal < minOrderAmount) {
        return res.status(400).json({ 
          valid: false, 
          error: `Minimum order amount of ₹${minOrderAmount.toLocaleString('en-IN')} is required for this coupon` 
        });
      }
      
      // Calculate discount
      let discountAmount = 0;
      const couponValue = parseFloat(coupon.value);
      
      if (coupon.type === "fixed") {
        discountAmount = couponValue;
      } else if (coupon.type === "percentage") {
        discountAmount = (cartSubtotal * couponValue) / 100;
        
        // Apply maximum discount cap if specified
        if (coupon.maxDiscount) {
          const maxDiscount = parseFloat(coupon.maxDiscount);
          discountAmount = Math.min(discountAmount, maxDiscount);
        }
      }
      
      // Ensure discount doesn't exceed cart subtotal
      discountAmount = Math.min(discountAmount, cartSubtotal);
      
      console.log(`[COUPON] Valid coupon applied. Discount: ${discountAmount}`);
      
      res.json({
        valid: true,
        coupon: {
          id: coupon.id,
          code: coupon.code,
          type: coupon.type,
          value: couponValue,
          description: coupon.description
        },
        discountAmount,
        finalAmount: cartSubtotal - discountAmount
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          valid: false, 
          error: "Invalid request data", 
          details: error.errors 
        });
      }
      console.error("Coupon validation error:", error);
      res.status(500).json({ 
        valid: false, 
        error: "Failed to validate coupon" 
      });
    }
  });
  
  // Authentication Routes
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      // Create user
      const user = await storage.createUser({
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone,
        password: hashedPassword,
      });

      // Return user without password
      const { password, ...userWithoutPassword } = user;
      res.status(201).json({ user: userWithoutPassword, message: "User created successfully" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      console.error("Signup error:", error);
      res.status(500).json({ message: "Failed to create user" });
    }
  });

  app.post("/api/auth/signin", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      // Find user
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Create session
      const sessionToken = generateSessionToken();
      const expiresAt = Date.now() + (7 * 24 * 60 * 60 * 1000); // 7 days
      sessions.set(sessionToken, { userId: user.id, expires: expiresAt });

      // Set cookie
      res.cookie('sessionToken', sessionToken, { 
        httpOnly: true, 
        secure: false, // set to true in production with HTTPS
        maxAge: 7 * 24 * 60 * 60 * 1000 
      });

      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword, message: "Signed in successfully", sessionToken });
    } catch (error) {
      console.error("Signin error:", error);
      res.status(500).json({ message: "Failed to sign in" });
    }
  });

  app.get("/api/auth/user", async (req, res) => {
    try {
      const user = await getUserFromSession(req);
      if (!user) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  app.post("/api/auth/signout", async (req, res) => {
    try {
      const sessionToken = req.headers.authorization?.replace('Bearer ', '') || req.cookies?.sessionToken;
      if (sessionToken) {
        sessions.delete(sessionToken);
      }
      res.clearCookie('sessionToken');
      res.json({ message: "Signed out successfully" });
    } catch (error) {
      console.error("Signout error:", error);
      res.status(500).json({ message: "Failed to sign out" });
    }
  });

  // Forgot Password - Send OTP
  app.post("/api/auth/forgot-password", async (req, res) => {
    try {
      const { contact, contactType } = req.body;
      
      if (!contact || !contactType) {
        return res.status(400).json({ message: "Contact and contact type are required" });
      }

      // Check if user exists
      let user;
      if (contactType === "email") {
        user = await storage.getUserByEmail(contact);
      } else {
        user = await storage.getUserByPhone(contact);
      }

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Generate OTP
      const otp = generateOTP();
      const expiresAt = Date.now() + (10 * 60 * 1000); // 10 minutes

      // Store OTP
      otpStorage.set(contact, {
        otp,
        expires: expiresAt,
        verified: false
      });

      // Send OTP
      let sent = false;
      if (contactType === "email") {
        sent = await sendEmail(
          contact,
          "Password Reset - Bouquet Bar",
          `Your verification code is: ${otp}. This code will expire in 10 minutes.`
        );
      } else {
        // Format phone number for SMS using Twilio Verify
        const formattedPhone = contact.startsWith('+') ? contact : `+91${contact}`;
        sent = await sendVerificationCode(formattedPhone);
        // Don't store OTP for phone since Twilio Verify handles it
        if (sent) {
          otpStorage.delete(contact); // Remove from local storage since Twilio handles it
        }
      }

      if (!sent) {
        return res.status(500).json({ message: `Failed to send OTP via ${contactType}` });
      }

      res.json({ message: `OTP sent to your ${contactType}` });
    } catch (error) {
      console.error("Forgot password error:", error);
      res.status(500).json({ message: "Failed to send OTP" });
    }
  });

  // Verify OTP
  app.post("/api/auth/verify-otp", async (req, res) => {
    try {
      const { contact, otp, contactType } = req.body;
      
      if (!contact || !otp || !contactType) {
        return res.status(400).json({ message: "Contact, OTP, and contact type are required" });
      }

      let isValid = false;
      
      if (contactType === "email") {
        // Use local OTP storage for email
        const storedOtp = otpStorage.get(contact);
        if (!storedOtp) {
          return res.status(400).json({ message: "No OTP found for this contact" });
        }

        if (storedOtp.expires < Date.now()) {
          otpStorage.delete(contact);
          return res.status(400).json({ message: "OTP has expired" });
        }

        if (storedOtp.otp !== otp) {
          return res.status(400).json({ message: "Invalid OTP" });
        }

        // Mark OTP as verified
        storedOtp.verified = true;
        otpStorage.set(contact, storedOtp);
        isValid = true;
      } else {
        // Use Twilio Verify for phone numbers
        const cleanPhone = contact.replace(/\s+/g, ''); // Remove spaces for consistent formatting
        const formattedPhone = cleanPhone.startsWith('+') ? cleanPhone : `+91${cleanPhone}`;
        console.log(`[VERIFY DEBUG] Clean phone: "${cleanPhone}", Formatted: "${formattedPhone}"`);
        isValid = await verifyCode(formattedPhone, otp);
        
        if (isValid) {
          // Store verification status for password reset using clean phone number
          otpStorage.set(cleanPhone, {
            otp: otp,
            expires: Date.now() + (10 * 60 * 1000), // 10 minutes
            verified: true
          });
        }
      }

      if (!isValid) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
      }

      res.json({ message: "OTP verified successfully" });
    } catch (error) {
      console.error("Verify OTP error:", error);
      res.status(500).json({ message: "Failed to verify OTP" });
    }
  });

  // Reset Password
  app.post("/api/auth/reset-password", async (req, res) => {
    try {
      const { contact, otp, newPassword, contactType } = req.body;
      
      if (!contact || !otp || !newPassword || !contactType) {
        return res.status(400).json({ message: "All fields are required" });
      }

      // Normalize phone number for OTP lookup
      const lookupKey = contactType === "phone" ? contact.replace(/\s+/g, '') : contact;
      const storedOtp = otpStorage.get(lookupKey);
      console.log(`[RESET DEBUG] Looking up OTP with key: "${lookupKey}" (original: "${contact}")`);
      if (!storedOtp || !storedOtp.verified) {
        return res.status(400).json({ message: "OTP not verified" });
      }

      if (storedOtp.expires < Date.now()) {
        otpStorage.delete(lookupKey);
        return res.status(400).json({ message: "OTP has expired" });
      }

      // Find user
      let user;
      if (contactType === "email") {
        user = await storage.getUserByEmail(contact);
      } else {
        // Normalize phone number by removing spaces and formatting consistently
        const cleanPhone = contact.replace(/\s+/g, ''); // Remove all spaces
        console.log(`[RESET DEBUG] Looking for user with phone: "${cleanPhone}" (original: "${contact}")`);
        user = await storage.getUserByPhone(cleanPhone);
      }

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      
      // Update password
      await storage.updateUser(user.id, { password: hashedPassword });

      // Clean up OTP
      otpStorage.delete(lookupKey);

      res.json({ message: "Password reset successfully" });
    } catch (error) {
      console.error("Reset password error:", error);
      res.status(500).json({ message: "Failed to reset password" });
    }
  });

  // Profile Management
  app.get("/api/profile", async (req, res) => {
    try {
      const user = await getUserFromSession(req);
      if (!user) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      // Return user profile without password
      const { password: _, ...userProfile } = user;
      res.json(userProfile);
    } catch (error) {
      console.error("Get profile error:", error);
      res.status(500).json({ message: "Failed to get profile" });
    }
  });

  app.put("/api/profile", async (req, res) => {
    try {
      const user = await getUserFromSession(req);
      if (!user) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      // Validate profile data
      const profileData = updateUserProfileSchema.parse(req.body);
      
      // Update user profile
      const updatedUser = await storage.updateUserProfile(user.id, profileData);
      
      // Return updated profile without password
      const { password: _, ...userProfile } = updatedUser;
      res.json({ user: userProfile, message: "Profile updated successfully" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid profile data", errors: error.errors });
      }
      console.error("Update profile error:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  app.delete("/api/profile", async (req, res) => {
    try {
      const user = await getUserFromSession(req);
      if (!user) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      // Delete user account
      await storage.deleteUser(user.id);
      
      // Clear session
      const sessionToken = req.headers.authorization?.replace('Bearer ', '') || req.cookies?.sessionToken;
      if (sessionToken) {
        sessions.delete(sessionToken);
      }
      res.clearCookie('sessionToken');
      
      res.json({ message: "Account deleted successfully" });
    } catch (error) {
      console.error("Delete profile error:", error);
      res.status(500).json({ message: "Failed to delete account" });
    }
  });

  // Change Password
  app.put("/api/profile/change-password", async (req, res) => {
    try {
      const user = await getUserFromSession(req);
      if (!user) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const { currentPassword, newPassword } = req.body;
      
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: "Current password and new password are required" });
      }

      // Verify current password
      const isValidPassword = await bcrypt.compare(currentPassword, user.password);
      if (!isValidPassword) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }

      // Validate new password length
      if (newPassword.length < 6) {
        return res.status(400).json({ message: "New password must be at least 6 characters long" });
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      
      // Update password
      await storage.updateUser(user.id, { password: hashedPassword });

      res.json({ message: "Password changed successfully" });
    } catch (error) {
      console.error("Change password error:", error);
      res.status(500).json({ message: "Failed to change password" });
    }
  });

  // Products
  app.get("/api/products", async (req, res) => {
    try {
      const category = req.query.category as string;
      const products = category 
        ? await storage.getProductsByCategory(category)
        : await storage.getAllProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/featured", async (req, res) => {
    try {
      const products = await storage.getFeaturedProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  // Courses
  app.get("/api/courses", async (req, res) => {
    try {
      const courses = await storage.getAllCourses();
      res.json(courses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch courses" });
    }
  });

  app.get("/api/courses/:id", async (req, res) => {
    try {
      const course = await storage.getCourse(req.params.id);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      res.json(course);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch course" });
    }
  });

  // Orders
  app.post("/api/orders", async (req, res) => {
    try {
      const orderData = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(orderData);
      res.status(201).json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid order data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  app.get("/api/orders", async (req, res) => {
    try {
      const orders = await storage.getAllOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  // Enrollments
  app.post("/api/enrollments", async (req, res) => {
    try {
      const enrollmentData = insertEnrollmentSchema.parse(req.body);
      const enrollment = await storage.createEnrollment(enrollmentData);
      res.status(201).json(enrollment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid enrollment data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create enrollment" });
    }
  });

  app.get("/api/enrollments", async (req, res) => {
    try {
      const enrollments = await storage.getAllEnrollments();
      res.json(enrollments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch enrollments" });
    }
  });

  // Testimonials
  app.get("/api/testimonials", async (req, res) => {
    try {
      const type = req.query.type as string;
      const testimonials = type
        ? await storage.getTestimonialsByType(type)
        : await storage.getAllTestimonials();
      res.json(testimonials);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch testimonials" });
    }
  });

  // Blog posts
  app.get("/api/blog", async (req, res) => {
    try {
      const posts = await storage.getAllBlogPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  app.get("/api/blog/:id", async (req, res) => {
    try {
      const post = await storage.getBlogPost(req.params.id);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });

  // Cart Operations
  app.get("/api/cart/:userId", async (req, res) => {
    try {
      const cartItems = await storage.getUserCart(req.params.userId);
      res.json(cartItems);
    } catch (error) {
      console.error("Error fetching user cart:", error);
      res.status(500).json({ message: "Failed to fetch cart" });
    }
  });

  app.post("/api/cart/:userId/add", async (req, res) => {
    try {
      const { productId, quantity } = req.body;
      const cartItem = await storage.addToCart(req.params.userId, productId, quantity);
      res.json(cartItem);
    } catch (error) {
      console.error("Error adding to cart:", error);
      res.status(500).json({ message: "Failed to add to cart" });
    }
  });

  app.put("/api/cart/:userId/update", async (req, res) => {
    try {
      const { productId, quantity } = req.body;
      const cartItem = await storage.updateCartItemQuantity(req.params.userId, productId, quantity);
      res.json(cartItem);
    } catch (error) {
      console.error("Error updating cart item:", error);
      res.status(500).json({ message: "Failed to update cart item" });
    }
  });

  app.delete("/api/cart/:userId/remove/:productId", async (req, res) => {
    try {
      await storage.removeFromCart(req.params.userId, req.params.productId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error removing from cart:", error);
      res.status(500).json({ message: "Failed to remove from cart" });
    }
  });

  app.delete("/api/cart/:userId/clear", async (req, res) => {
    try {
      await storage.clearUserCart(req.params.userId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error clearing cart:", error);
      res.status(500).json({ message: "Failed to clear cart" });
    }
  });

  // User Orders Management Routes
  app.get("/api/orders/user", async (req, res) => {
    try {
      const user = await getUserFromSession(req);
      if (!user) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const orders = await storage.getUserOrders(user.id);
      res.json(orders);
    } catch (error) {
      console.error("Error fetching user orders:", error);
      res.status(500).json({ message: "Failed to fetch user orders" });
    }
  });

  app.put("/api/orders/:id/status", async (req, res) => {
    try {
      const user = await getUserFromSession(req);
      if (!user) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const { status } = req.body;
      if (!status || typeof status !== 'string') {
        return res.status(400).json({ message: "Status is required" });
      }

      const order = await storage.updateOrderStatus(req.params.id, status);
      res.json(order);
    } catch (error) {
      console.error("Error updating order status:", error);
      res.status(500).json({ message: "Failed to update order status" });
    }
  });

  // Favorites Management Routes
  app.get("/api/favorites", async (req, res) => {
    try {
      const user = await getUserFromSession(req);
      if (!user) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const favorites = await storage.getUserFavorites(user.id);
      res.json(favorites);
    } catch (error) {
      console.error("Error fetching user favorites:", error);
      res.status(500).json({ message: "Failed to fetch favorites" });
    }
  });

  app.post("/api/favorites", async (req, res) => {
    try {
      const user = await getUserFromSession(req);
      if (!user) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const { productId } = req.body;
      if (!productId) {
        return res.status(400).json({ message: "Product ID is required" });
      }

      // Check if product exists
      const product = await storage.getProduct(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      // Check if already favorited to prevent duplicates
      const isAlreadyFavorited = await storage.isProductFavorited(user.id, productId);
      if (isAlreadyFavorited) {
        return res.status(400).json({ message: "Product already in favorites" });
      }

      const favorite = await storage.addToFavorites(user.id, productId);
      res.json(favorite);
    } catch (error) {
      console.error("Error adding to favorites:", error);
      res.status(500).json({ message: "Failed to add to favorites" });
    }
  });

  app.delete("/api/favorites/:productId", async (req, res) => {
    try {
      const user = await getUserFromSession(req);
      if (!user) {
        return res.status(401).json({ message: "Authentication required" });
      }

      await storage.removeFromFavorites(user.id, req.params.productId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error removing from favorites:", error);
      res.status(500).json({ message: "Failed to remove from favorites" });
    }
  });

  app.get("/api/favorites/:productId/status", async (req, res) => {
    try {
      const user = await getUserFromSession(req);
      if (!user) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const isFavorited = await storage.isProductFavorited(user.id, req.params.productId);
      res.json({ isFavorited });
    } catch (error) {
      console.error("Error checking favorite status:", error);
      res.status(500).json({ message: "Failed to check favorite status" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
