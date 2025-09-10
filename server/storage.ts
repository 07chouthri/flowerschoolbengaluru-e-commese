import { type User, type InsertUser, type Product, type InsertProduct, type Course, type InsertCourse, type Order, type InsertOrder, type Enrollment, type InsertEnrollment, type Testimonial, type InsertTestimonial, type BlogPost, type InsertBlogPost } from "@shared/schema";
import { randomUUID } from "crypto";
import { DatabaseStorage } from "./database-storage";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
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

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private products: Map<string, Product> = new Map();
  private courses: Map<string, Course> = new Map();
  private orders: Map<string, Order> = new Map();
  private enrollments: Map<string, Enrollment> = new Map();
  private testimonials: Map<string, Testimonial> = new Map();
  private blogPosts: Map<string, BlogPost> = new Map();

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    // Initialize products
    const sampleProducts: Product[] = [
      {
        id: "1",
        name: "Premium Red Roses",
        description: "12 fresh red roses with premium wrapping",
        price: "1299.00",
        category: "roses",
        image: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        inStock: true,
        featured: true,
        createdAt: new Date(),
      },
      {
        id: "2",
        name: "White Orchid Elegance",
        description: "Pristine white orchids in ceramic pot",
        price: "2499.00",
        category: "orchids",
        image: "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        inStock: true,
        featured: true,
        createdAt: new Date(),
      },
      {
        id: "3",
        name: "Bridal Bliss Bouquet",
        description: "Mixed roses and lilies for your special day",
        price: "3999.00",
        category: "wedding",
        image: "https://images.unsplash.com/photo-1606800052052-a08af7148866?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        inStock: true,
        featured: true,
        createdAt: new Date(),
      },
      {
        id: "4",
        name: "Seasonal Surprise",
        description: "Sunflowers and seasonal mix bouquet",
        price: "899.00",
        category: "seasonal",
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        inStock: true,
        featured: true,
        createdAt: new Date(),
      },
    ];

    sampleProducts.forEach(product => this.products.set(product.id, product));

    // Initialize courses
    const sampleCourses: Course[] = [
      {
        id: "1",
        title: "Floral Design Basics",
        description: "Perfect for beginners to learn fundamental techniques",
        price: "8999.00",
        duration: "4 weeks",
        sessions: 16,
        features: ["Color theory & composition", "Basic arrangement techniques", "Flower care & preservation", "5 take-home arrangements"],
        popular: false,
        nextBatch: "March 15, 2024",
        createdAt: new Date(),
      },
      {
        id: "2",
        title: "Professional Bouquet Making",
        description: "Advanced techniques for commercial arrangements",
        price: "15999.00",
        duration: "8 weeks",
        sessions: 32,
        features: ["Wedding & event designs", "Business setup guidance", "Advanced wrapping techniques", "10 professional arrangements"],
        popular: true,
        nextBatch: "March 20, 2024",
        createdAt: new Date(),
      },
      {
        id: "3",
        title: "Garden Design & Care",
        description: "Learn indoor & outdoor gardening essentials",
        price: "12999.00",
        duration: "6 weeks",
        sessions: 24,
        features: ["Plant selection & care", "Garden layout design", "Seasonal maintenance", "Indoor plant mastery"],
        popular: false,
        nextBatch: "March 25, 2024",
        createdAt: new Date(),
      },
    ];

    sampleCourses.forEach(course => this.courses.set(course.id, course));

    // Initialize testimonials
    const sampleTestimonials: Testimonial[] = [
      {
        id: "1",
        name: "Priya Sharma",
        location: "Bengaluru",
        rating: 5,
        comment: "Absolutely stunning arrangements! The roses I ordered for my anniversary were fresh and beautifully wrapped. The delivery was prompt and the flowers lasted for over a week.",
        type: "shop",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
        createdAt: new Date(),
      },
      {
        id: "2",
        name: "Rajesh Kumar",
        location: "Course Graduate",
        rating: 5,
        comment: "The Professional Bouquet Making course transformed my passion into a career! The instructors are amazing and the hands-on practice sessions were invaluable. Now I run my own floral business.",
        type: "school",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
        createdAt: new Date(),
      },
      {
        id: "3",
        name: "Ananya Reddy",
        location: "Bride",
        rating: 5,
        comment: "Bouquet Bar made our wedding absolutely magical! From bridal bouquets to venue decorations, everything was perfect. The team understood our vision and executed it flawlessly.",
        type: "shop",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
        createdAt: new Date(),
      },
    ];

    sampleTestimonials.forEach(testimonial => this.testimonials.set(testimonial.id, testimonial));

    // Initialize blog posts
    const sampleBlogPosts: BlogPost[] = [
      {
        id: "1",
        title: "How to Keep Flowers Fresh for Longer",
        excerpt: "Learn professional techniques to extend the life of your beautiful arrangements with these simple care tips.",
        content: "Detailed care instructions...",
        category: "CARE TIPS",
        image: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        publishedAt: new Date("2024-03-10"),
        createdAt: new Date(),
      },
      {
        id: "2",
        title: "Top 10 Floral Design Trends for 2024",
        excerpt: "Discover the latest trends shaping the floral industry this year, from minimalist designs to bold color combinations.",
        content: "Trend analysis content...",
        category: "TRENDS",
        image: "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        publishedAt: new Date("2024-03-08"),
        createdAt: new Date(),
      },
      {
        id: "3",
        title: "Wedding Flowers: A Complete Planning Guide",
        excerpt: "Everything you need to know about choosing perfect flowers for your special day, from bouquets to venue decorations.",
        content: "Wedding planning guide content...",
        category: "WEDDING GUIDE",
        image: "https://images.unsplash.com/photo-1606800052052-a08af7148866?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        publishedAt: new Date("2024-03-05"),
        createdAt: new Date(),
      },
    ];

    sampleBlogPosts.forEach(post => this.blogPosts.set(post.id, post));
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    // Note: username field no longer exists, this method kept for interface compatibility
    return undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(product => product.featured);
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    if (category === "all") return this.getAllProducts();
    return Array.from(this.products.values()).filter(product => product.category === category);
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const product: Product = { ...insertProduct, id, createdAt: new Date() };
    this.products.set(id, product);
    return product;
  }

  async getAllCourses(): Promise<Course[]> {
    return Array.from(this.courses.values());
  }

  async getCourse(id: string): Promise<Course | undefined> {
    return this.courses.get(id);
  }

  async createCourse(insertCourse: InsertCourse): Promise<Course> {
    const id = randomUUID();
    const course: Course = { ...insertCourse, id, createdAt: new Date() };
    this.courses.set(id, course);
    return course;
  }

  async getAllOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }

  async getOrder(id: string): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = randomUUID();
    const order: Order = { ...insertOrder, id, status: "pending", createdAt: new Date() };
    this.orders.set(id, order);
    return order;
  }

  async getAllEnrollments(): Promise<Enrollment[]> {
    return Array.from(this.enrollments.values());
  }

  async getEnrollment(id: string): Promise<Enrollment | undefined> {
    return this.enrollments.get(id);
  }

  async createEnrollment(insertEnrollment: InsertEnrollment): Promise<Enrollment> {
    const id = randomUUID();
    const enrollment: Enrollment = { ...insertEnrollment, id, status: "pending", createdAt: new Date() };
    this.enrollments.set(id, enrollment);
    return enrollment;
  }

  async getAllTestimonials(): Promise<Testimonial[]> {
    return Array.from(this.testimonials.values());
  }

  async getTestimonialsByType(type: string): Promise<Testimonial[]> {
    return Array.from(this.testimonials.values()).filter(testimonial => testimonial.type === type);
  }

  async createTestimonial(insertTestimonial: InsertTestimonial): Promise<Testimonial> {
    const id = randomUUID();
    const testimonial: Testimonial = { ...insertTestimonial, id, createdAt: new Date() };
    this.testimonials.set(id, testimonial);
    return testimonial;
  }

  async getAllBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values()).sort((a, b) => 
      new Date(b.publishedAt!).getTime() - new Date(a.publishedAt!).getTime()
    );
  }

  async getBlogPost(id: string): Promise<BlogPost | undefined> {
    return this.blogPosts.get(id);
  }

  async createBlogPost(insertBlogPost: InsertBlogPost): Promise<BlogPost> {
    const id = randomUUID();
    const post: BlogPost = { 
      ...insertBlogPost, 
      id, 
      publishedAt: new Date(), 
      createdAt: new Date() 
    };
    this.blogPosts.set(id, post);
    return post;
  }
}

export const storage = new DatabaseStorage();
