import { 
  users, 
  products, 
  courses, 
  orders, 
  enrollments, 
  testimonials, 
  blogPosts,
  carts,
  type User, 
  type InsertUser, 
  type Product, 
  type InsertProduct, 
  type Course, 
  type InsertCourse, 
  type Order, 
  type InsertOrder, 
  type Enrollment, 
  type InsertEnrollment, 
  type Testimonial, 
  type InsertTestimonial, 
  type BlogPost, 
  type InsertBlogPost,
  type Cart,
  type InsertCart 
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";
import { IStorage } from "./storage";

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    // Note: username field no longer exists, this method kept for interface compatibility
    return undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async getUserByPhone(phone: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.phone, phone));
    return user || undefined;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const [user] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Products
  async getAllProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.featured, true));
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.category, category));
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product || undefined;
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db
      .insert(products)
      .values(product)
      .returning();
    return newProduct;
  }

  // Courses
  async getAllCourses(): Promise<Course[]> {
    return await db.select().from(courses);
  }

  async getCourse(id: string): Promise<Course | undefined> {
    const [course] = await db.select().from(courses).where(eq(courses.id, id));
    return course || undefined;
  }

  async createCourse(course: InsertCourse): Promise<Course> {
    const [newCourse] = await db
      .insert(courses)
      .values(course)
      .returning();
    return newCourse;
  }

  // Orders
  async getAllOrders(): Promise<Order[]> {
    return await db.select().from(orders);
  }

  async getOrder(id: string): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order || undefined;
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const [newOrder] = await db
      .insert(orders)
      .values(order)
      .returning();
    return newOrder;
  }

  // Enrollments
  async getAllEnrollments(): Promise<Enrollment[]> {
    return await db.select().from(enrollments);
  }

  async getEnrollment(id: string): Promise<Enrollment | undefined> {
    const [enrollment] = await db.select().from(enrollments).where(eq(enrollments.id, id));
    return enrollment || undefined;
  }

  async createEnrollment(enrollment: InsertEnrollment): Promise<Enrollment> {
    const [newEnrollment] = await db
      .insert(enrollments)
      .values(enrollment)
      .returning();
    return newEnrollment;
  }

  // Testimonials
  async getAllTestimonials(): Promise<Testimonial[]> {
    return await db.select().from(testimonials);
  }

  async getTestimonialsByType(type: string): Promise<Testimonial[]> {
    return await db.select().from(testimonials).where(eq(testimonials.type, type));
  }

  async createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial> {
    const [newTestimonial] = await db
      .insert(testimonials)
      .values(testimonial)
      .returning();
    return newTestimonial;
  }

  // Blog Posts
  async getAllBlogPosts(): Promise<BlogPost[]> {
    return await db.select().from(blogPosts);
  }

  async getBlogPost(id: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return post || undefined;
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const [newPost] = await db
      .insert(blogPosts)
      .values(post)
      .returning();
    return newPost;
  }

  // Cart Operations
  async getUserCart(userId: string): Promise<(Cart & { product: Product })[]> {
    const cartItems = await db
      .select({
        id: carts.id,
        userId: carts.userId,
        productId: carts.productId,
        quantity: carts.quantity,
        createdAt: carts.createdAt,
        updatedAt: carts.updatedAt,
        product: products
      })
      .from(carts)
      .innerJoin(products, eq(carts.productId, products.id))
      .where(eq(carts.userId, userId));
    return cartItems;
  }

  async addToCart(userId: string, productId: string, quantity: number): Promise<Cart> {
    // Check if item already exists in cart
    const [existingItem] = await db
      .select()
      .from(carts)
      .where(and(eq(carts.userId, userId), eq(carts.productId, productId)));

    if (existingItem) {
      // Update quantity if item exists
      const [updatedItem] = await db
        .update(carts)
        .set({ 
          quantity: existingItem.quantity + quantity,
          updatedAt: new Date()
        })
        .where(and(eq(carts.userId, userId), eq(carts.productId, productId)))
        .returning();
      return updatedItem;
    } else {
      // Add new item to cart
      const [newItem] = await db
        .insert(carts)
        .values({
          userId,
          productId,
          quantity
        })
        .returning();
      return newItem;
    }
  }

  async updateCartItemQuantity(userId: string, productId: string, quantity: number): Promise<Cart> {
    const [updatedItem] = await db
      .update(carts)
      .set({ 
        quantity,
        updatedAt: new Date()
      })
      .where(and(eq(carts.userId, userId), eq(carts.productId, productId)))
      .returning();
    return updatedItem;
  }

  async removeFromCart(userId: string, productId: string): Promise<void> {
    await db
      .delete(carts)
      .where(and(eq(carts.userId, userId), eq(carts.productId, productId)));
  }

  async clearUserCart(userId: string): Promise<void> {
    await db
      .delete(carts)
      .where(eq(carts.userId, userId));
  }
}