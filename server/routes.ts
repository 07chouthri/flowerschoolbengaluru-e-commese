import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertOrderSchema, insertEnrollmentSchema, insertUserSchema, updateUserProfileSchema, validateCouponSchema, insertAddressSchema, addressValidationSchema, orderPlacementSchema } from "@shared/schema";
import { z } from "zod";
import bcrypt from "bcryptjs";
import twilio from "twilio";
import { notificationService } from "./services/notification-service";

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

  // Comprehensive order placement with validation and processing
  app.post("/api/orders/place", async (req, res) => {
    try {
      console.log("[ORDER PLACEMENT] Received order data:", JSON.stringify(req.body, null, 2));
      
      // Parse and validate order data
      const orderData = orderPlacementSchema.parse(req.body);
      console.log("[ORDER PLACEMENT] Order data validated successfully");
      
      // Get current user if authenticated
      let currentUser = null;
      try {
        currentUser = await getUserFromSession(req);
        if (currentUser) {
          console.log("[ORDER PLACEMENT] User authenticated:", currentUser.email);
        } else {
          console.log("[ORDER PLACEMENT] Processing guest order");
        }
      } catch (error) {
        console.log("[ORDER PLACEMENT] Authentication check failed, processing as guest order");
        currentUser = null;
      }
      
      // Validate and process order through comprehensive validation
      console.log("[ORDER PLACEMENT] Starting order validation and processing");
      const orderValidation = await storage.validateAndProcessOrder(orderData);
      
      if (!orderValidation.isValid) {
        console.log("[ORDER PLACEMENT] Order validation failed:", orderValidation.errors);
        return res.status(400).json({
          success: false,
          message: "Order validation failed",
          errors: orderValidation.errors
        });
      }
      
      console.log("[ORDER PLACEMENT] Order validation successful, processing order with transaction");
      
      // Process the entire order placement in a single transaction
      const orderProcessingResult = await storage.processOrderPlacement(orderData, currentUser?.id);
      
      if (!orderProcessingResult.isValid) {
        console.log("[ORDER PLACEMENT] Order processing failed:", orderProcessingResult.errors);
        return res.status(400).json({
          success: false,
          message: "Order processing failed",
          errors: orderProcessingResult.errors
        });
      }
      
      const createdOrder = orderProcessingResult.order!;
      console.log("[ORDER PLACEMENT] Order created successfully with transaction:", createdOrder.orderNumber);
      
      // Send order confirmation notifications (SMS and WhatsApp) asynchronously
      // This is fire-and-forget to avoid blocking the order response
      console.log(`[NOTIFICATION] Triggering async notifications for order: ${createdOrder.orderNumber}`);
      
      // Use setImmediate to ensure notifications run asynchronously without blocking the response
      setImmediate(async () => {
        try {
          console.log(`[NOTIFICATION] Processing async notifications for order: ${createdOrder.orderNumber}`);
          
          const notificationResults = await notificationService.sendOrderConfirmation(createdOrder);
          
          // Log overall notification status without PII
          const notificationSummary = {
            orderNumber: createdOrder.orderNumber,
            smsStatus: notificationResults.sms.success ? 'sent' : 'failed',
            whatsappStatus: notificationResults.whatsapp.success ? 'sent' : 'failed',
            smsMessageId: notificationResults.sms.messageId || null,
            whatsappMessageId: notificationResults.whatsapp.messageId || null,
            hasErrors: !notificationResults.sms.success || !notificationResults.whatsapp.success
          };
          
          console.log(`[NOTIFICATION] Summary for order ${createdOrder.orderNumber}:`, JSON.stringify(notificationSummary, null, 2));
          
        } catch (notificationError) {
          // Log error without failing the order
          console.error(`[NOTIFICATION] Async notification error for order ${createdOrder.orderNumber}:`, notificationError instanceof Error ? notificationError.message : 'Unknown error');
        }
      });
      
      // Send success response with order details
      res.status(201).json({
        success: true,
        message: "Order placed successfully",
        order: {
          id: createdOrder.id,
          orderNumber: createdOrder.orderNumber,
          status: createdOrder.status,
          paymentStatus: createdOrder.paymentStatus,
          total: createdOrder.total,
          estimatedDeliveryDate: createdOrder.estimatedDeliveryDate,
          createdAt: createdOrder.createdAt
        },
        calculatedPricing: orderProcessingResult.calculatedPricing
      });
      
    } catch (error) {
      console.error("[ORDER PLACEMENT] Error placing order:", error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Invalid order data",
          errors: error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
        });
      }
      
      res.status(500).json({
        success: false,
        message: "Failed to place order",
        errors: ["Internal server error. Please try again."]
      });
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

  // Get order by order number
  app.get("/api/orders/number/:orderNumber", async (req, res) => {
    try {
      const order = await storage.getOrderByNumber(req.params.orderNumber);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });

  // User Orders Management Routes - MUST come before /api/orders/:id
  app.get("/api/orders/user", async (req, res) => {
    try {
      console.log("[ORDER HISTORY] Fetching user orders...");
      const user = await getUserFromSession(req);
      if (!user) {
        console.log("[ORDER HISTORY] No user found in session");
        return res.status(401).json({ message: "Authentication required" });
      }

      console.log(`[ORDER HISTORY] User found: ${user.id} (${user.email})`);
      const orders = await storage.getUserOrders(user.id);
      console.log(`[ORDER HISTORY] Found ${orders.length} orders for user ${user.id}`);
      
      if (orders.length === 0) {
        console.log("[ORDER HISTORY] No orders found, returning empty array");
      } else {
        console.log("[ORDER HISTORY] Orders:", orders.map(o => ({ id: o.id, orderNumber: o.orderNumber, status: o.status })));
      }
      
      res.json(orders);
    } catch (error) {
      console.error("Error fetching user orders:", error);
      res.status(500).json({ message: "Failed to fetch user orders" });
    }
  });

  // Get specific order by ID - MUST come after specific routes like /user
  app.get("/api/orders/:id", async (req, res) => {
    try {
      const order = await storage.getOrder(req.params.id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });

  // Update order status
  app.patch("/api/orders/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }
      
      const order = await storage.updateOrderStatus(req.params.id, status);
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Failed to update order status" });
    }
  });

  // Update payment status
  app.patch("/api/orders/:id/payment", async (req, res) => {
    try {
      const { paymentStatus, transactionId } = req.body;
      if (!paymentStatus) {
        return res.status(400).json({ message: "Payment status is required" });
      }
      
      const order = await storage.updateOrderPaymentStatus(req.params.id, paymentStatus, transactionId);
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Failed to update payment status" });
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

  // Order cancellation route
  app.post("/api/orders/:id/cancel", async (req, res) => {
    try {
      const user = await getUserFromSession(req);
      if (!user) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const orderId = req.params.id;
      
      // Cancel the order using the storage method
      const cancelledOrder = await storage.cancelOrder(orderId, user.id);
      
      // Send cancellation notification
      try {
        await notificationService.sendOrderCancellationNotification({
          orderId: cancelledOrder.id,
          orderNumber: cancelledOrder.orderNumber,
          customerName: (user.firstName && user.lastName) ? `${user.firstName} ${user.lastName}` : user.email,
          customerPhone: cancelledOrder.phone,
          refundAmount: cancelledOrder.total,
          refundMethod: cancelledOrder.paymentMethod || "Original payment method"
        });
      } catch (notificationError) {
        console.error("Failed to send cancellation notification:", notificationError);
        // Don't fail the cancellation if notification fails
      }

      res.json({
        success: true,
        order: cancelledOrder,
        message: "Order cancelled successfully"
      });
    } catch (error) {
      console.error("Error cancelling order:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to cancel order";
      
      // Map specific error types to appropriate HTTP status codes
      if (errorMessage.includes("Order not found")) {
        return res.status(404).json({ message: "Order not found" });
      }
      if (errorMessage.includes("Unauthorized")) {
        return res.status(403).json({ message: "Access denied" });
      }
      if (errorMessage.includes("cannot be cancelled")) {
        return res.status(409).json({ message: "Order cannot be cancelled in current status" });
      }
      
      res.status(500).json({ message: "Failed to cancel order" });
    }
  });

  // Order tracking route
  app.get("/api/orders/:id/tracking", async (req, res) => {
    try {
      const user = await getUserFromSession(req);
      if (!user) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const orderId = req.params.id;
      
      // Get the order first
      const order = await storage.getOrder(orderId);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      // Check if user owns this order
      if (order.userId !== user.id) {
        return res.status(403).json({ message: "Access denied" });
      }

      // Get order status history
      const statusHistory = await storage.getOrderStatusHistory(orderId);
      
      // Define status progression steps
      const statusSteps = [
        { step: "Order Placed", status: "pending", completed: true },
        { step: "Order Confirmed", status: "confirmed", completed: false },
        { step: "Being Prepared", status: "processing", completed: false },
        { step: "Out for Delivery", status: "shipped", completed: false },
        { step: "Delivered", status: "delivered", completed: false }
      ];

      // Mark completed steps based on current order status
      const statusOrder = ["pending", "confirmed", "processing", "shipped", "delivered"];
      const currentStatus = order.status || "pending";
      const currentStatusIndex = statusOrder.indexOf(currentStatus);
      
      if (currentStatusIndex >= 0) {
        statusSteps.forEach((step, index) => {
          step.completed = index <= currentStatusIndex;
        });
      }

      // Handle cancelled orders
      if (currentStatus === "cancelled") {
        statusSteps.forEach(step => step.completed = false);
        statusSteps.push({ step: "Order Cancelled", status: "cancelled", completed: true });
      }

      res.json({
        order: {
          id: order.id,
          orderNumber: order.orderNumber,
          status: order.status,
          total: order.total,
          createdAt: order.createdAt,
          statusUpdatedAt: order.statusUpdatedAt,
          estimatedDeliveryDate: order.estimatedDeliveryDate,
          pointsAwarded: order.pointsAwarded
        },
        statusHistory,
        progressSteps: statusSteps,
        canCancel: ["pending", "confirmed", "processing"].includes(currentStatus)
      });
    } catch (error) {
      console.error("Error fetching order tracking:", error);
      res.status(500).json({ message: "Failed to fetch order tracking" });
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

  // Address Management Routes
  app.get("/api/addresses", async (req, res) => {
    try {
      const user = await getUserFromSession(req);
      if (!user) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const addresses = await storage.getUserAddresses(user.id);
      res.json(addresses);
    } catch (error) {
      console.error("Error fetching user addresses:", error);
      res.status(500).json({ message: "Failed to fetch addresses" });
    }
  });

  app.post("/api/addresses", async (req, res) => {
    try {
      const user = await getUserFromSession(req);
      if (!user) {
        return res.status(401).json({ message: "Authentication required" });
      }

      // Validate the address data
      const validatedAddress = addressValidationSchema.parse(req.body);
      
      const addressData = {
        userId: user.id,
        ...validatedAddress,
      };

      const newAddress = await storage.createAddress(addressData);
      
      // If this address is marked as default, ensure it's the only default address
      if (validatedAddress.isDefault) {
        await storage.setDefaultAddress(user.id, newAddress.id);
        // Get the updated address with correct default status
        const updatedAddress = await storage.getAddress(newAddress.id);
        return res.status(201).json(updatedAddress);
      }
      
      res.status(201).json(newAddress);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid address data", 
          errors: error.errors 
        });
      }
      console.error("Error creating address:", error);
      res.status(500).json({ message: "Failed to create address" });
    }
  });

  app.put("/api/addresses/:id", async (req, res) => {
    try {
      const user = await getUserFromSession(req);
      if (!user) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const addressId = req.params.id;
      
      // Check if address exists and belongs to user
      const existingAddress = await storage.getAddress(addressId);
      if (!existingAddress) {
        return res.status(404).json({ message: "Address not found" });
      }
      
      if (existingAddress.userId !== user.id) {
        return res.status(403).json({ message: "Access denied" });
      }

      // Validate the update data
      const validatedUpdates = addressValidationSchema.partial().parse(req.body);
      
      const updatedAddress = await storage.updateAddress(addressId, validatedUpdates);
      
      // If this address is being set as default, ensure it's the only default address
      if (validatedUpdates.isDefault === true) {
        await storage.setDefaultAddress(user.id, addressId);
        // Get the updated address with correct default status
        const finalAddress = await storage.getAddress(addressId);
        return res.json(finalAddress);
      }
      
      res.json(updatedAddress);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid address data", 
          errors: error.errors 
        });
      }
      console.error("Error updating address:", error);
      res.status(500).json({ message: "Failed to update address" });
    }
  });

  app.delete("/api/addresses/:id", async (req, res) => {
    try {
      const user = await getUserFromSession(req);
      if (!user) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const addressId = req.params.id;
      
      // Check if address exists and belongs to user
      const existingAddress = await storage.getAddress(addressId);
      if (!existingAddress) {
        return res.status(404).json({ message: "Address not found" });
      }
      
      if (existingAddress.userId !== user.id) {
        return res.status(403).json({ message: "Access denied" });
      }

      await storage.deleteAddress(addressId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting address:", error);
      res.status(500).json({ message: "Failed to delete address" });
    }
  });

  app.put("/api/addresses/:id/default", async (req, res) => {
    try {
      const user = await getUserFromSession(req);
      if (!user) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const addressId = req.params.id;
      
      // Check if address exists and belongs to user
      const existingAddress = await storage.getAddress(addressId);
      if (!existingAddress) {
        return res.status(404).json({ message: "Address not found" });
      }
      
      if (existingAddress.userId !== user.id) {
        return res.status(403).json({ message: "Access denied" });
      }

      await storage.setDefaultAddress(user.id, addressId);
      res.json({ success: true, message: "Default address updated" });
    } catch (error) {
      console.error("Error setting default address:", error);
      res.status(500).json({ message: "Failed to set default address" });
    }
  });

  // Delivery Options Routes
  app.get("/api/delivery-options", async (req, res) => {
    try {
      let deliveryOptions = await storage.getActiveDeliveryOptions();
      
      // Auto-seed delivery options if none exist
      if (deliveryOptions.length === 0) {
        console.log("No delivery options found, bootstrapping default options...");
        
        const defaultOptions = [
          {
            name: "Standard Delivery",
            description: "3-5 business days delivery",
            estimatedDays: "3-5 business days",
            price: "50.00",
            isActive: true,
            sortOrder: 1,
          },
          {
            name: "Express Delivery", 
            description: "Next day delivery",
            estimatedDays: "1 business day",
            price: "150.00",
            isActive: true,
            sortOrder: 2,
          },
          {
            name: "Same Day Delivery",
            description: "Same day delivery within city",
            estimatedDays: "Same day",
            price: "250.00", 
            isActive: true,
            sortOrder: 3,
          },
        ];
        
        // Create default delivery options
        for (const option of defaultOptions) {
          await storage.createDeliveryOption(option);
        }
        
        // Fetch the newly created options
        deliveryOptions = await storage.getActiveDeliveryOptions();
        console.log(`Bootstrapped ${deliveryOptions.length} delivery options`);
      }
      
      res.json(deliveryOptions);
    } catch (error) {
      console.error("Error fetching delivery options:", error);
      res.status(500).json({ message: "Failed to fetch delivery options" });
    }
  });

  // Twilio status webhook endpoint
  app.post("/api/twilio/status", (req, res) => {
    const { MessageSid, MessageStatus, To, ErrorCode, ErrorMessage } = req.body;
    
    console.log(`[TWILIO WEBHOOK] Message ${MessageSid} to ${To}: ${MessageStatus}`);
    if (ErrorCode) {
      console.log(`[TWILIO WEBHOOK] Error ${ErrorCode}: ${ErrorMessage}`);
    }
    
    // Respond with 200 to acknowledge receipt
    res.status(200).send('OK');
  });

  const httpServer = createServer(app);
  return httpServer;
}
