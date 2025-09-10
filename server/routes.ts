import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertOrderSchema, insertEnrollmentSchema, insertUserSchema, insertPhoneUserSchema } from "@shared/schema";
import { z } from "zod";
import bcrypt from "bcryptjs";
import twilio from "twilio";

// Simple in-memory session storage
const sessions: Map<string, { userId: string; expires: number }> = new Map();

// Simple in-memory OTP storage
const otpStorage: Map<string, { 
  otp: string; 
  expires: number; 
  verified: boolean;
  userData?: { firstName: string; lastName: string; phone: string };
  userId?: string;
}> = new Map();

// Initialize Twilio client
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Helper function to generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Helper function to send SMS
const sendSMS = async (phone: string, message: string) => {
  try {
    // Ensure the Twilio phone number has proper country code format
    const fromNumber = process.env.TWILIO_PHONE_NUMBER?.startsWith('+') 
      ? process.env.TWILIO_PHONE_NUMBER 
      : `+1${process.env.TWILIO_PHONE_NUMBER}`;
    
    await twilioClient.messages.create({
      body: message,
      from: fromNumber,
      to: phone,
    });
    return true;
  } catch (error) {
    console.error("SMS sending error:", error);
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
  // Authentication Routes
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
      }

      // Hash password if provided
      const hashedPassword = userData.password ? await bcrypt.hash(userData.password!, 10) : "";
      
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

      // Verify password if user has one
      if (!user.password) {
        return res.status(401).json({ message: "This account uses phone verification. Please use phone login." });
      }
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

  // Phone-Only Authentication Routes

  // Send OTP for new user signup
  app.post("/api/auth/send-signup-otp", async (req, res) => {
    try {
      const { firstName, lastName, phone } = req.body;
      
      if (!firstName || !lastName || !phone) {
        return res.status(400).json({ message: "First name, last name, and phone are required" });
      }

      // Check if user already exists
      const existingUser = await storage.getUserByPhone(phone);
      if (existingUser) {
        return res.status(400).json({ message: "Phone number already registered" });
      }

      // Generate OTP
      const otp = generateOTP();
      const expiresAt = Date.now() + (10 * 60 * 1000); // 10 minutes

      // Store OTP with user data
      otpStorage.set(phone, {
        otp,
        expires: expiresAt,
        verified: false,
        userData: { firstName, lastName, phone }
      });

      // Send SMS
      const sent = await sendSMS(
        phone,
        `Welcome to Bouquet Bar! Your verification code is: ${otp}. Expires in 10 minutes.`
      );

      if (!sent) {
        return res.status(500).json({ message: "Failed to send OTP" });
      }

      res.json({ message: "OTP sent to your phone" });
    } catch (error) {
      console.error("Send signup OTP error:", error);
      res.status(500).json({ message: "Failed to send OTP" });
    }
  });

  // Verify OTP and create user account
  app.post("/api/auth/verify-signup-otp", async (req, res) => {
    try {
      const { firstName, lastName, phone, otp } = req.body;
      
      if (!firstName || !lastName || !phone || !otp) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const storedOtp = otpStorage.get(phone);
      if (!storedOtp) {
        return res.status(400).json({ message: "No OTP found for this phone number" });
      }

      if (storedOtp.expires < Date.now()) {
        otpStorage.delete(phone);
        return res.status(400).json({ message: "OTP has expired" });
      }

      if (storedOtp.otp !== otp) {
        return res.status(400).json({ message: "Invalid OTP" });
      }

      // Create user without password
      const userData = insertPhoneUserSchema.parse({
        firstName,
        lastName,
        phone,
        password: "" // No password for phone-only auth
      });
      const user = await storage.createUser(userData);

      // Clean up OTP
      otpStorage.delete(phone);

      // Return success
      res.status(201).json({ 
        user: { id: user.id, firstName: user.firstName, lastName: user.lastName, phone: user.phone }, 
        message: "Account created successfully" 
      });
    } catch (error) {
      console.error("Verify signup OTP error:", error);
      res.status(500).json({ message: "Failed to create account" });
    }
  });

  // Send OTP for login
  app.post("/api/auth/send-login-otp", async (req, res) => {
    try {
      const { phone } = req.body;
      
      if (!phone) {
        return res.status(400).json({ message: "Phone number is required" });
      }

      // Check if user exists
      const user = await storage.getUserByPhone(phone);
      if (!user) {
        return res.status(404).json({ message: "Phone number not registered" });
      }

      // Generate OTP
      const otp = generateOTP();
      const expiresAt = Date.now() + (10 * 60 * 1000); // 10 minutes

      // Store OTP
      otpStorage.set(phone, {
        otp,
        expires: expiresAt,
        verified: false,
        userId: user.id
      });

      // Send SMS
      const sent = await sendSMS(
        phone,
        `Your Bouquet Bar login code is: ${otp}. Expires in 10 minutes.`
      );

      if (!sent) {
        return res.status(500).json({ message: "Failed to send OTP" });
      }

      res.json({ message: "OTP sent to your phone" });
    } catch (error) {
      console.error("Send login OTP error:", error);
      res.status(500).json({ message: "Failed to send OTP" });
    }
  });

  // Verify OTP and log user in
  app.post("/api/auth/verify-login-otp", async (req, res) => {
    try {
      const { phone, otp } = req.body;
      
      if (!phone || !otp) {
        return res.status(400).json({ message: "Phone number and OTP are required" });
      }

      const storedOtp = otpStorage.get(phone);
      if (!storedOtp) {
        return res.status(400).json({ message: "No OTP found for this phone number" });
      }

      if (storedOtp.expires < Date.now()) {
        otpStorage.delete(phone);
        return res.status(400).json({ message: "OTP has expired" });
      }

      if (storedOtp.otp !== otp) {
        return res.status(400).json({ message: "Invalid OTP" });
      }

      // Get user
      const userId = storedOtp.userId;
      if (!userId) {
        return res.status(400).json({ message: "Invalid OTP session" });
      }
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Create session
      const sessionToken = generateSessionToken();
      const sessionExpiresAt = Date.now() + (7 * 24 * 60 * 60 * 1000); // 7 days
      sessions.set(sessionToken, { userId: user.id, expires: sessionExpiresAt });

      // Set cookie
      res.cookie('sessionToken', sessionToken, { 
        httpOnly: true, 
        secure: false, // set to true in production with HTTPS
        maxAge: 7 * 24 * 60 * 60 * 1000 
      });

      // Clean up OTP
      otpStorage.delete(phone);

      // Return user without password
      res.json({ 
        user: { id: user.id, firstName: user.firstName, lastName: user.lastName, phone: user.phone }, 
        message: "Signed in successfully", 
        sessionToken 
      });
    } catch (error) {
      console.error("Verify login OTP error:", error);
      res.status(500).json({ message: "Failed to verify OTP" });
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
        // Format phone number for SMS
        const formattedPhone = contact.startsWith('+') ? contact : `+91${contact}`;
        sent = await sendSMS(
          formattedPhone,
          `Your Bouquet Bar verification code is: ${otp}. Expires in 10 minutes.`
        );
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

      const storedOtp = otpStorage.get(contact);
      if (!storedOtp || !storedOtp.verified) {
        return res.status(400).json({ message: "OTP not verified" });
      }

      if (storedOtp.expires < Date.now()) {
        otpStorage.delete(contact);
        return res.status(400).json({ message: "OTP has expired" });
      }

      // Find user
      let user;
      if (contactType === "email") {
        user = await storage.getUserByEmail(contact);
      } else {
        user = await storage.getUserByPhone(contact);
      }

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      
      // Update password
      await storage.updateUser(user.id, { password: hashedPassword });

      // Clean up OTP
      otpStorage.delete(contact);

      res.json({ message: "Password reset successfully" });
    } catch (error) {
      console.error("Reset password error:", error);
      res.status(500).json({ message: "Failed to reset password" });
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

  const httpServer = createServer(app);
  return httpServer;
}
