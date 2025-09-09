import { type User, type UpsertUser, type Product, type InsertProduct, type Course, type InsertCourse, type Order, type InsertOrder, type Enrollment, type InsertEnrollment, type Testimonial, type InsertTestimonial, type BlogPost, type InsertBlogPost } from "@shared/schema";
import { users, products, courses, orders, enrollments, testimonials, blogPosts } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: UpsertUser): Promise<User>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Products
  getAllProducts(): Promise<Product[]>;
  getFeaturedProducts(): Promise<Product[]>;
  getProductsByCategory(category: string): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  
  // Courses
  getAllCourses(): Promise<Course[]>;
  getCourse(id: string): Promise<Course | undefined>;
  createCourse(course: InsertCourse): Promise<Course>;
  
  // Orders
  getAllOrders(): Promise<Order[]>;
  getOrder(id: string): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  
  // Enrollments
  getAllEnrollments(): Promise<Enrollment[]>;
  getEnrollment(id: string): Promise<Enrollment | undefined>;
  createEnrollment(enrollment: InsertEnrollment): Promise<Enrollment>;
  
  // Testimonials
  getAllTestimonials(): Promise<Testimonial[]>;
  getTestimonialsByType(type: string): Promise<Testimonial[]>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  
  // Blog Posts
  getAllBlogPosts(): Promise<BlogPost[]>;
  getBlogPost(id: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
}

export class DatabaseStorage implements IStorage {
  constructor() {
    this.initializeData();
  }

  private async initializeData() {
    // Check if data already exists
    try {
      const existingProducts = await db.select().from(products).limit(1);
      if (existingProducts.length > 0) return;
    } catch (error) {
      // Tables might not exist yet, continue with initialization
      console.log("Tables may not exist yet, proceeding with data initialization");
    }

    // Initialize sample data
    const sampleProducts: InsertProduct[] = [
      {
        name: "Premium Red Roses",
        description: "12 fresh red roses with premium wrapping",
        price: "1299.00",
        category: "roses",
        image: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        inStock: true,
        featured: true,
      },
      {
        name: "White Orchid Elegance",
        description: "Pristine white orchids in ceramic pot",
        price: "2499.00",
        category: "orchids",
        image: "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        inStock: true,
        featured: true,
      },
      {
        name: "Bridal Bliss Bouquet",
        description: "Mixed roses and lilies for your special day",
        price: "3999.00",
        category: "wedding",
        image: "https://images.unsplash.com/photo-1606800052052-a08af7148866?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        inStock: true,
        featured: true,
      },
      {
        name: "Seasonal Surprise",
        description: "Sunflowers and seasonal mix bouquet",
        price: "899.00",
        category: "seasonal",
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        inStock: true,
        featured: true,
      },
    ];

    const sampleCourses: InsertCourse[] = [
      {
        title: "Floral Design Basics",
        description: "Perfect for beginners to learn fundamental techniques",
        price: "8999.00",
        duration: "4 weeks",
        sessions: 16,
        features: ["Color theory & composition", "Basic arrangement techniques", "Flower care & preservation", "5 take-home arrangements"],
        popular: false,
        nextBatch: "March 15, 2024",
      },
      {
        title: "Professional Bouquet Making",
        description: "Advanced techniques for commercial arrangements",
        price: "15999.00",
        duration: "8 weeks",
        sessions: 32,
        features: ["Wedding & event designs", "Business setup guidance", "Advanced wrapping techniques", "10 professional arrangements"],
        popular: true,
        nextBatch: "March 20, 2024",
      },
      {
        title: "Garden Design & Care",
        description: "Learn indoor & outdoor gardening essentials",
        price: "12999.00",
        duration: "6 weeks",
        sessions: 24,
        features: ["Plant selection & care", "Garden layout design", "Seasonal maintenance", "Indoor plant mastery"],
        popular: false,
        nextBatch: "March 25, 2024",
      },
    ];

    const sampleTestimonials: InsertTestimonial[] = [
      {
        name: "Priya Sharma",
        location: "Bengaluru",
        rating: 5,
        comment: "Absolutely stunning arrangements! The roses I ordered for my anniversary were fresh and beautifully wrapped. The delivery was prompt and the flowers lasted for over a week.",
        type: "shop",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
      },
      {
        name: "Rajesh Kumar",
        location: "Course Graduate",
        rating: 5,
        comment: "The Professional Bouquet Making course transformed my passion into a career! The instructors are amazing and the hands-on practice sessions were invaluable. Now I run my own floral business.",
        type: "school",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
      },
      {
        name: "Ananya Reddy",
        location: "Bride",
        rating: 5,
        comment: "Bouquet Bar made our wedding absolutely magical! From bridal bouquets to venue decorations, everything was perfect. The team understood our vision and executed it flawlessly.",
        type: "shop",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
      },
    ];

    const sampleBlogPosts: InsertBlogPost[] = [
      {
        title: "How to Keep Flowers Fresh for Longer",
        excerpt: "Learn professional techniques to extend the life of your beautiful arrangements with these simple care tips.",
        content: "Detailed care instructions...",
        category: "CARE TIPS",
        image: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
      },
      {
        title: "Top 10 Floral Design Trends for 2024",
        excerpt: "Discover the latest trends shaping the floral industry this year, from minimalist designs to bold color combinations.",
        content: "Trend analysis content...",
        category: "TRENDS",
        image: "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
      },
      {
        title: "Wedding Flowers: A Complete Planning Guide",
        excerpt: "Everything you need to know about choosing perfect flowers for your special day, from bouquets to venue decorations.",
        content: "Wedding planning guide content...",
        category: "WEDDING GUIDE",
        image: "https://images.unsplash.com/photo-1606800052052-a08af7148866?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
      },
    ];

    // Insert sample data
    try {
      await db.insert(products).values(sampleProducts);
      await db.insert(courses).values(sampleCourses);
      await db.insert(testimonials).values(sampleTestimonials);
      await db.insert(blogPosts).values(sampleBlogPosts);
    } catch (error) {
      console.log("Sample data already exists or error inserting:", error);
    }
  }

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(userData: UpsertUser): Promise<User> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const [user] = await db
      .insert(users)
      .values({ ...userData, password: hashedPassword })
      .returning();
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async getAllProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.featured, true));
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    if (category === "all") return this.getAllProducts();
    return await db.select().from(products).where(eq(products.category, category));
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async createProduct(productData: InsertProduct): Promise<Product> {
    const [product] = await db.insert(products).values(productData).returning();
    return product;
  }

  async getAllCourses(): Promise<Course[]> {
    return await db.select().from(courses);
  }

  async getCourse(id: string): Promise<Course | undefined> {
    const [course] = await db.select().from(courses).where(eq(courses.id, id));
    return course;
  }

  async createCourse(courseData: InsertCourse): Promise<Course> {
    const [course] = await db.insert(courses).values(courseData).returning();
    return course;
  }

  async getAllOrders(): Promise<Order[]> {
    return await db.select().from(orders);
  }

  async getOrder(id: string): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order;
  }

  async createOrder(orderData: InsertOrder): Promise<Order> {
    const [order] = await db.insert(orders).values(orderData).returning();
    return order;
  }

  async getAllEnrollments(): Promise<Enrollment[]> {
    return await db.select().from(enrollments);
  }

  async getEnrollment(id: string): Promise<Enrollment | undefined> {
    const [enrollment] = await db.select().from(enrollments).where(eq(enrollments.id, id));
    return enrollment;
  }

  async createEnrollment(enrollmentData: InsertEnrollment): Promise<Enrollment> {
    const [enrollment] = await db.insert(enrollments).values(enrollmentData).returning();
    return enrollment;
  }

  async getAllTestimonials(): Promise<Testimonial[]> {
    return await db.select().from(testimonials);
  }

  async getTestimonialsByType(type: string): Promise<Testimonial[]> {
    return await db.select().from(testimonials).where(eq(testimonials.type, type));
  }

  async createTestimonial(testimonialData: InsertTestimonial): Promise<Testimonial> {
    const [testimonial] = await db.insert(testimonials).values(testimonialData).returning();
    return testimonial;
  }

  async getAllBlogPosts(): Promise<BlogPost[]> {
    return await db.select().from(blogPosts).orderBy(blogPosts.publishedAt);
  }

  async getBlogPost(id: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return post;
  }

  async createBlogPost(postData: InsertBlogPost): Promise<BlogPost> {
    const [post] = await db.insert(blogPosts).values(postData).returning();
    return post;
  }
}

export const storage = new DatabaseStorage();