import { 
  users, 
  products, 
  courses, 
  orders, 
  enrollments, 
  testimonials, 
  blogPosts,
  carts,
  favorites,
  coupons,
  addresses,
  deliveryOptions,
  orderStatusHistory,
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
  type InsertCart,
  type Favorite,
  type InsertFavorite,
  type Coupon,
  type InsertCoupon,
  type Address,
  type InsertAddress,
  type DeliveryOption,
  type InsertDeliveryOption,
  type OrderPlacement,
  type OrderStatusHistory,
  type InsertOrderStatusHistory
} from "@shared/schema";
import { db } from "./db";
import { eq, and, sql, inArray, lte } from "drizzle-orm";
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

  async updateUserProfile(id: string, profile: Partial<User>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ ...profile, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async deleteUser(id: string): Promise<void> {
    await db.delete(users).where(eq(users.id, id));
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

  // Inventory Management
  async updateProductStock(productId: string, quantityChange: number): Promise<Product> {
    const [updatedProduct] = await db
      .update(products)
      .set({ 
        stockQuantity: sql`${products.stockQuantity} + ${quantityChange}`,
        inStock: sql`${products.stockQuantity} + ${quantityChange} > 0`
      })
      .where(eq(products.id, productId))
      .returning();
    return updatedProduct;
  }

  async checkProductAvailability(productId: string, requiredQuantity: number): Promise<{ available: boolean; currentStock: number }> {
    const [product] = await db.select().from(products).where(eq(products.id, productId));
    if (!product) {
      return { available: false, currentStock: 0 };
    }
    return {
      available: product.stockQuantity >= requiredQuantity,
      currentStock: product.stockQuantity
    };
  }

  async validateStockAvailability(items: Array<{ productId: string; quantity: number }>): Promise<{
    isValid: boolean;
    errors?: string[];
    stockValidation?: Array<{ productId: string; productName: string; requiredQuantity: number; availableStock: number; sufficient: boolean }>;
  }> {
    const errors: string[] = [];
    const stockValidation: Array<{ productId: string; productName: string; requiredQuantity: number; availableStock: number; sufficient: boolean }> = [];

    for (const item of items) {
      const [product] = await db.select().from(products).where(eq(products.id, item.productId));
      
      if (!product) {
        errors.push(`Product ${item.productId} not found`);
        continue;
      }

      const sufficient = product.stockQuantity >= item.quantity;
      stockValidation.push({
        productId: item.productId,
        productName: product.name,
        requiredQuantity: item.quantity,
        availableStock: product.stockQuantity,
        sufficient
      });

      if (!sufficient) {
        errors.push(`Insufficient stock for ${product.name}. Required: ${item.quantity}, Available: ${product.stockQuantity}`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined,
      stockValidation
    };
  }

  async decrementProductsStock(items: Array<{ productId: string; quantity: number }>): Promise<void> {
    return await db.transaction(async (tx) => {
      for (const item of items) {
        const result = await tx
          .update(products)
          .set({ 
            stockQuantity: sql`${products.stockQuantity} - ${item.quantity}`,
            inStock: sql`${products.stockQuantity} - ${item.quantity} > 0`
          })
          .where(and(
            eq(products.id, item.productId),
            sql`${products.stockQuantity} >= ${item.quantity}`
          ));

        // Check if update affected any rows - if not, stock was insufficient
        if (!result || result.rowCount === 0) {
          const [product] = await tx.select({ name: products.name, stockQuantity: products.stockQuantity })
            .from(products)
            .where(eq(products.id, item.productId));
          const productName = product?.name || `Product ${item.productId}`;
          const currentStock = product?.stockQuantity || 0;
          throw new Error(`Insufficient stock for ${productName}. Required: ${item.quantity}, Available: ${currentStock}`);
        }
      }
    });
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
    const orderNumber = await this.generateOrderNumber();
    const [newOrder] = await db
      .insert(orders)
      .values({
        ...order,
        orderNumber,
        status: "pending",
        paymentStatus: "pending",
        updatedAt: new Date()
      })
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

  // Additional Orders methods
  async getUserOrders(userId: string): Promise<Order[]> {
    return await db.select().from(orders).where(eq(orders.userId, userId));
  }

  async getOrderByNumber(orderNumber: string): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.orderNumber, orderNumber));
    return order || undefined;
  }

  async updateOrderStatus(id: string, status: string): Promise<Order> {
    const [updatedOrder] = await db
      .update(orders)
      .set({ 
        status,
        updatedAt: new Date()
      })
      .where(eq(orders.id, id))
      .returning();
    return updatedOrder;
  }

  async updateOrderPaymentStatus(id: string, paymentStatus: string, transactionId?: string): Promise<Order> {
    const [updatedOrder] = await db
      .update(orders)
      .set({ 
        paymentStatus,
        paymentTransactionId: transactionId,
        updatedAt: new Date()
      })
      .where(eq(orders.id, id))
      .returning();
    return updatedOrder;
  }

  async generateOrderNumber(): Promise<string> {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    
    // Use a retry loop with random delays to handle concurrent conflicts
    const maxRetries = 5;
    let attempts = 0;
    
    while (attempts < maxRetries) {
      try {
        // Use a more precise approach to avoid race conditions
        // Get the maximum order number for today and increment atomically
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);
        const datePrefix = `ORD-${year}${month}-`;
        
        // Get the highest order number for today
        const [{ maxOrderNum }] = await db
          .select({ 
            maxOrderNum: sql`COALESCE(MAX(CAST(SUBSTRING(${orders.orderNumber}, ${datePrefix.length + 1}) AS INTEGER)), 0)`.as("maxOrderNum")
          })
          .from(orders)
          .where(and(
            sql`${orders.createdAt} >= ${todayStart}`,
            sql`${orders.createdAt} < ${todayEnd}`,
            sql`${orders.orderNumber} LIKE ${datePrefix + '%'}`
          ));
        
        const nextNumber = String(Number(maxOrderNum) + 1).padStart(4, '0');
        const proposedOrderNumber = `${datePrefix}${nextNumber}`;
        
        // Try to verify this order number is still unique
        const [existingOrder] = await db
          .select({ orderNumber: orders.orderNumber })
          .from(orders)
          .where(eq(orders.orderNumber, proposedOrderNumber));
          
        if (!existingOrder) {
          return proposedOrderNumber;
        }
        
        // If order number already exists, retry with backoff
        attempts++;
        if (attempts < maxRetries) {
          // Add random delay to reduce collision probability
          await new Promise(resolve => setTimeout(resolve, Math.random() * 100 + attempts * 50));
        }
        
      } catch (error) {
        attempts++;
        if (attempts >= maxRetries) {
          throw error;
        }
        // Add exponential backoff for database errors
        await new Promise(resolve => setTimeout(resolve, Math.random() * 200 + attempts * 100));
      }
    }
    
    // Fallback: use timestamp-based order number to guarantee uniqueness
    const timestamp = Date.now().toString().slice(-6); // last 6 digits of timestamp
    return `ORD-${year}${month}-${timestamp}`;
  }

  async validateCartItems(items: Array<{ productId: string; quantity: number; unitPrice: number }>): Promise<{
    isValid: boolean;
    errors?: string[];
    validatedItems?: Array<{ productId: string; productName: string; quantity: number; unitPrice: number; totalPrice: number }>;
  }> {
    const errors: string[] = [];
    const validatedItems: Array<{ productId: string; productName: string; quantity: number; unitPrice: number; totalPrice: number }> = [];

    for (const item of items) {
      const [product] = await db.select().from(products).where(eq(products.id, item.productId));
      
      if (!product) {
        errors.push(`Product with ID ${item.productId} not found`);
        continue;
      }

      if (!product.inStock) {
        errors.push(`Product ${product.name} is out of stock`);
        continue;
      }

      // Check stock quantity availability
      if (product.stockQuantity < item.quantity) {
        errors.push(`Insufficient stock for ${product.name}. Required: ${item.quantity}, Available: ${product.stockQuantity}`);
        continue;
      }

      const currentPrice = parseFloat(product.price);
      if (Math.abs(currentPrice - item.unitPrice) > 0.01) {
        errors.push(`Price mismatch for ${product.name}. Current price: ${currentPrice}, provided: ${item.unitPrice}`);
        continue;
      }

      if (item.quantity <= 0) {
        errors.push(`Invalid quantity for ${product.name}`);
        continue;
      }

      validatedItems.push({
        productId: item.productId,
        productName: product.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.unitPrice * item.quantity
      });
    }

    return {
      isValid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined,
      validatedItems: errors.length === 0 ? validatedItems : undefined
    };
  }

  async calculateOrderPricing(subtotal: number, deliveryOptionId: string, couponCode?: string, paymentMethod?: string): Promise<{
    deliveryCharge: number;
    discountAmount: number;
    paymentCharges: number;
    total: number;
  }> {
    // Get delivery charge
    const [deliveryOption] = await db.select().from(deliveryOptions).where(eq(deliveryOptions.id, deliveryOptionId));
    const deliveryCharge = deliveryOption ? parseFloat(deliveryOption.price) : 0;

    // Calculate discount
    let discountAmount = 0;
    if (couponCode) {
      const [coupon] = await db.select().from(coupons).where(and(
        eq(coupons.code, couponCode),
        eq(coupons.isActive, true)
      ));
      
      if (coupon) {
        if (coupon.type === "percentage") {
          discountAmount = (subtotal * parseFloat(coupon.value)) / 100;
          if (coupon.maxDiscount) {
            discountAmount = Math.min(discountAmount, parseFloat(coupon.maxDiscount));
          }
        } else if (coupon.type === "fixed") {
          discountAmount = parseFloat(coupon.value);
        }
      }
    }

    // Calculate payment charges
    let paymentCharges = 0;
    if (paymentMethod === "Card" || paymentMethod === "Online") {
      paymentCharges = Math.max((subtotal + deliveryCharge - discountAmount) * 0.02, 5); // 2% or minimum ₹5
    }

    const total = subtotal + deliveryCharge - discountAmount + paymentCharges;

    return {
      deliveryCharge,
      discountAmount,
      paymentCharges,
      total
    };
  }

  async validateAndProcessOrder(orderData: OrderPlacement): Promise<{
    isValid: boolean;
    errors?: string[];
    validatedOrder?: InsertOrder;
    calculatedPricing?: {
      subtotal: number;
      deliveryCharge: number;
      discountAmount: number;
      paymentCharges: number;
      total: number;
    };
  }> {
    const errors: string[] = [];

    // Validate cart items
    const cartValidation = await this.validateCartItems(orderData.items);
    if (!cartValidation.isValid) {
      errors.push(...(cartValidation.errors || []));
    }

    // Validate delivery option
    const [deliveryOption] = await db.select().from(deliveryOptions).where(eq(deliveryOptions.id, orderData.deliveryOptionId));
    if (!deliveryOption) {
      errors.push("Invalid delivery option");
    }

    // Validate address if user is authenticated
    if (orderData.userId && orderData.shippingAddressId) {
      const [address] = await db.select().from(addresses).where(and(
        eq(addresses.id, orderData.shippingAddressId),
        eq(addresses.userId, orderData.userId)
      ));
      if (!address) {
        errors.push("Invalid shipping address");
      }
    }

    if (errors.length > 0) {
      return { isValid: false, errors };
    }

    // Calculate server-side pricing
    const calculatedPricing = await this.calculateOrderPricing(
      orderData.subtotal,
      orderData.deliveryOptionId,
      orderData.couponCode,
      orderData.paymentMethod
    );

    // Validate pricing
    const pricingTolerance = 0.01;
    if (Math.abs(calculatedPricing.deliveryCharge - orderData.deliveryCharge) > pricingTolerance) {
      errors.push("Delivery charge mismatch");
    }
    if (Math.abs(calculatedPricing.discountAmount - orderData.discountAmount) > pricingTolerance) {
      errors.push("Discount amount mismatch");
    }
    if (Math.abs(calculatedPricing.total - orderData.total) > pricingTolerance) {
      errors.push("Total amount mismatch");
    }

    if (errors.length > 0) {
      return { isValid: false, errors };
    }

    // Create validated order object
    const validatedOrder: InsertOrder = {
      userId: orderData.userId,
      customerName: orderData.customerName,
      email: orderData.email,
      phone: orderData.phone,
      occasion: orderData.occasion,
      requirements: orderData.requirements,
      items: cartValidation.validatedItems!,
      subtotal: orderData.subtotal.toString(),
      deliveryOptionId: orderData.deliveryOptionId,
      deliveryCharge: calculatedPricing.deliveryCharge.toString(),
      couponCode: orderData.couponCode,
      discountAmount: calculatedPricing.discountAmount.toString(),
      paymentMethod: orderData.paymentMethod,
      paymentCharges: calculatedPricing.paymentCharges.toString(),
      total: calculatedPricing.total.toString(),
      shippingAddressId: orderData.shippingAddressId,
      deliveryAddress: orderData.deliveryAddress,
      deliveryDate: orderData.deliveryDate ? new Date(orderData.deliveryDate) : undefined,
      estimatedDeliveryDate: deliveryOption ? 
        new Date(Date.now() + parseInt(deliveryOption.estimatedDays.split('-')[0]) * 24 * 60 * 60 * 1000) : 
        undefined
    };

    return {
      isValid: true,
      validatedOrder,
      calculatedPricing
    };
  }

  // Favorites methods
  async getUserFavorites(userId: string): Promise<(Favorite & { product: Product })[]> {
    const favoriteItems = await db
      .select({
        id: favorites.id,
        userId: favorites.userId,
        productId: favorites.productId,
        createdAt: favorites.createdAt,
        product: products
      })
      .from(favorites)
      .innerJoin(products, eq(favorites.productId, products.id))
      .where(eq(favorites.userId, userId));
    return favoriteItems;
  }

  async addToFavorites(userId: string, productId: string): Promise<Favorite> {
    const [newFavorite] = await db
      .insert(favorites)
      .values({
        userId,
        productId
      })
      .returning();
    return newFavorite;
  }

  async removeFromFavorites(userId: string, productId: string): Promise<void> {
    await db
      .delete(favorites)
      .where(and(eq(favorites.userId, userId), eq(favorites.productId, productId)));
  }

  async isProductFavorited(userId: string, productId: string): Promise<boolean> {
    const [favorite] = await db
      .select()
      .from(favorites)
      .where(and(eq(favorites.userId, userId), eq(favorites.productId, productId)));
    return !!favorite;
  }

  // Coupon Operations
  async getCouponByCode(code: string): Promise<Coupon | undefined> {
    const [coupon] = await db.select().from(coupons).where(eq(coupons.code, code));
    return coupon || undefined;
  }

  async getAllCoupons(): Promise<Coupon[]> {
    return await db.select().from(coupons);
  }

  async createCoupon(coupon: InsertCoupon): Promise<Coupon> {
    const [newCoupon] = await db
      .insert(coupons)
      .values(coupon)
      .returning();
    return newCoupon;
  }

  async updateCoupon(id: string, updates: Partial<Coupon>): Promise<Coupon> {
    const [updatedCoupon] = await db
      .update(coupons)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(coupons.id, id))
      .returning();
    return updatedCoupon;
  }

  async incrementCouponUsage(code: string): Promise<Coupon> {
    const [updatedCoupon] = await db
      .update(coupons)
      .set({ 
        timesUsed: sql`${coupons.timesUsed} + 1`,
        updatedAt: new Date()
      })
      .where(eq(coupons.code, code))
      .returning();
    return updatedCoupon;
  }

  async deleteCoupon(id: string): Promise<void> {
    await db.delete(coupons).where(eq(coupons.id, id));
  }

  // Address Management Methods
  async getUserAddresses(userId: string): Promise<Address[]> {
    return await db
      .select()
      .from(addresses)
      .where(eq(addresses.userId, userId))
      .orderBy(sql`${addresses.isDefault} DESC, ${addresses.createdAt} DESC`);
  }

  async getAddress(id: string): Promise<Address | undefined> {
    const [address] = await db.select().from(addresses).where(eq(addresses.id, id));
    return address || undefined;
  }

  async createAddress(address: InsertAddress): Promise<Address> {
    return await db.transaction(async (tx) => {
      // If this is marked as default, remove default from other addresses
      if (address.isDefault) {
        await tx
          .update(addresses)
          .set({ isDefault: false, updatedAt: new Date() })
          .where(and(eq(addresses.userId, address.userId), eq(addresses.isDefault, true)));
      }

      const [newAddress] = await tx
        .insert(addresses)
        .values({
          ...address,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      return newAddress;
    });
  }

  async updateAddress(id: string, updates: Partial<Address>): Promise<Address> {
    return await db.transaction(async (tx) => {
      const [existingAddress] = await tx
        .select()
        .from(addresses)
        .where(eq(addresses.id, id));

      if (!existingAddress) {
        throw new Error("Address not found");
      }

      // If this is being set as default, remove default from other addresses
      if (updates.isDefault && existingAddress.userId) {
        await tx
          .update(addresses)
          .set({ isDefault: false, updatedAt: new Date() })
          .where(and(
            eq(addresses.userId, existingAddress.userId), 
            eq(addresses.isDefault, true)
          ));
      }

      const [updatedAddress] = await tx
        .update(addresses)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(addresses.id, id))
        .returning();

      return updatedAddress;
    });
  }

  async deleteAddress(id: string): Promise<void> {
    await db.delete(addresses).where(eq(addresses.id, id));
  }

  async setDefaultAddress(userId: string, addressId: string): Promise<void> {
    await db.transaction(async (tx) => {
      // Remove default from all user's addresses
      await tx
        .update(addresses)
        .set({ isDefault: false, updatedAt: new Date() })
        .where(and(eq(addresses.userId, userId), eq(addresses.isDefault, true)));

      // Set the new default address
      await tx
        .update(addresses)
        .set({ isDefault: true, updatedAt: new Date() })
        .where(and(eq(addresses.id, addressId), eq(addresses.userId, userId)));
    });
  }

  // Delivery Options Methods
  async getAllDeliveryOptions(): Promise<DeliveryOption[]> {
    return await db
      .select()
      .from(deliveryOptions)
      .orderBy(deliveryOptions.sortOrder);
  }

  async getActiveDeliveryOptions(): Promise<DeliveryOption[]> {
    return await db
      .select()
      .from(deliveryOptions)
      .where(eq(deliveryOptions.isActive, true))
      .orderBy(deliveryOptions.sortOrder);
  }

  async getDeliveryOption(id: string): Promise<DeliveryOption | undefined> {
    const [deliveryOption] = await db.select().from(deliveryOptions).where(eq(deliveryOptions.id, id));
    return deliveryOption || undefined;
  }

  async createDeliveryOption(deliveryOption: InsertDeliveryOption): Promise<DeliveryOption> {
    const [newDeliveryOption] = await db
      .insert(deliveryOptions)
      .values({
        ...deliveryOption,
        createdAt: new Date(),
      })
      .returning();
    return newDeliveryOption;
  }

  // Comprehensive transactional order processing method
  async createOrderWithTransaction(
    validatedOrder: InsertOrder, 
    couponCode?: string, 
    userId?: string
  ): Promise<Order> {
    return await db.transaction(async (tx) => {
      try {
        // 1. Generate order number atomically
        const orderNumber = await this.generateOrderNumber();
        
        // 2. Create the order
        const [createdOrder] = await tx
          .insert(orders)
          .values({
            ...validatedOrder,
            orderNumber,
            status: "pending",
            paymentStatus: "pending",
            updatedAt: new Date()
          })
          .returning();

        // 3. Decrement product stock for all ordered items with atomic constraints
        const orderItems = validatedOrder.items as Array<{ productId: string; quantity: number }>;
        for (const item of orderItems) {
          const result = await tx
            .update(products)
            .set({ 
              stockQuantity: sql`${products.stockQuantity} - ${item.quantity}`,
              inStock: sql`${products.stockQuantity} - ${item.quantity} > 0`
            })
            .where(and(
              eq(products.id, item.productId),
              sql`${products.stockQuantity} >= ${item.quantity}`
            ));

          // Check if update affected any rows - if not, stock was insufficient at commit time
          if (!result || result.rowCount === 0) {
            const [product] = await tx.select({ name: products.name, stockQuantity: products.stockQuantity })
              .from(products)
              .where(eq(products.id, item.productId));
            const productName = product?.name || `Product ${item.productId}`;
            const currentStock = product?.stockQuantity || 0;
            throw new Error(`Insufficient stock for ${productName}. Required: ${item.quantity}, Available: ${currentStock}`);
          }
        }

        // 4. Increment coupon usage if coupon was applied
        if (couponCode) {
          await tx
            .update(coupons)
            .set({ 
              timesUsed: sql`${coupons.timesUsed} + 1`,
              updatedAt: new Date()
            })
            .where(eq(coupons.code, couponCode));
        }

        // 4. Clear user cart if this was an authenticated user
        if (userId) {
          await tx
            .delete(carts)
            .where(eq(carts.userId, userId));
        }

        return createdOrder;
      } catch (error) {
        // Transaction will be automatically rolled back on any error
        console.error("[TRANSACTION ERROR] Order creation failed:", error);
        throw error;
      }
    });
  }

  // Enhanced order processing with validation and transaction
  async processOrderPlacement(orderData: OrderPlacement, userId?: string): Promise<{
    isValid: boolean;
    errors?: string[];
    order?: Order;
    calculatedPricing?: {
      subtotal: number;
      deliveryCharge: number;
      discountAmount: number;
      paymentCharges: number;
      total: number;
    };
  }> {
    try {
      // First validate the order
      const validation = await this.validateAndProcessOrder(orderData);
      if (!validation.isValid) {
        return {
          isValid: false,
          errors: validation.errors
        };
      }

      // If validation passes, create order with transaction
      const createdOrder = await this.createOrderWithTransaction(
        validation.validatedOrder!,
        orderData.couponCode,
        userId
      );

      return {
        isValid: true,
        order: createdOrder,
        calculatedPricing: validation.calculatedPricing
      };
    } catch (error) {
      console.error("[ORDER PROCESSING ERROR]:", error);
      return {
        isValid: false,
        errors: ["Failed to process order placement"]
      };
    }
  }

  // Order cancellation and tracking methods
  async cancelOrder(orderId: string, userId: string): Promise<Order> {
    // Get the order first
    const [order] = await db.select().from(orders).where(eq(orders.id, orderId));
    if (!order) {
      throw new Error("Order not found");
    }
    if (order.userId !== userId) {
      throw new Error("Unauthorized to cancel this order");
    }
    if (!["pending", "confirmed", "processing"].includes(order.status || "")) {
      throw new Error("Order cannot be cancelled in current status");
    }

    // Update order status
    const [updatedOrder] = await db
      .update(orders)
      .set({
        status: "cancelled",
        statusUpdatedAt: new Date(),
        updatedAt: new Date()
      })
      .where(eq(orders.id, orderId))
      .returning();

    // Add status history entry
    await this.addOrderStatusHistory(orderId, "cancelled", "Order cancelled by customer");

    // TODO: Restore product stock (will be implemented when needed)
    
    return updatedOrder;
  }

  async getOrderStatusHistory(orderId: string): Promise<OrderStatusHistory[]> {
    const history = await db
      .select()
      .from(orderStatusHistory)
      .where(eq(orderStatusHistory.orderId, orderId))
      .orderBy(orderStatusHistory.changedAt);
    return history;
  }

  async addOrderStatusHistory(orderId: string, status: string, note?: string): Promise<void> {
    await db.insert(orderStatusHistory).values({
      orderId,
      status,
      note: note || null,
      changedAt: new Date()
    });
  }

  async awardUserPoints(userId: string, points: number): Promise<void> {
    await db
      .update(users)
      .set({
        points: sql`COALESCE(${users.points}, 0) + ${points}`,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId));
    
    console.log(`[POINTS] Awarded ${points} points to user ${userId}`);
  }

  async listAdvancableOrders(cutoffDate: Date, statuses: string[]): Promise<Order[]> {
    const ordersToAdvance = await db
      .select()
      .from(orders)
      .where(
        and(
          inArray(orders.status, statuses),
          lte(orders.statusUpdatedAt, cutoffDate)
        )
      );
    return ordersToAdvance;
  }

  async advanceOrderStatus(orderId: string, nextStatus: string): Promise<Order> {
    // Get the order first
    const [order] = await db.select().from(orders).where(eq(orders.id, orderId));
    if (!order) {
      throw new Error("Order not found");
    }

    const now = new Date();

    // Update order status
    const [updatedOrder] = await db
      .update(orders)
      .set({
        status: nextStatus,
        statusUpdatedAt: now,
        updatedAt: now,
        // Award points when order reaches processing status
        pointsAwarded: nextStatus === "processing" && !order.pointsAwarded ? true : order.pointsAwarded
      })
      .where(eq(orders.id, orderId))
      .returning();

    // Award points when order reaches processing status
    if (nextStatus === "processing" && !order.pointsAwarded && order.userId) {
      await this.awardUserPoints(order.userId, 50);
    }

    await this.addOrderStatusHistory(orderId, nextStatus, "Status automatically updated");
    
    return updatedOrder;
  }

  async updateOrderAddress(orderId: string, deliveryAddress: string, deliveryPhone?: string): Promise<Order> {
    const updateData: any = {
      deliveryAddress,
      updatedAt: new Date()
    };

    if (deliveryPhone) {
      updateData.phone = deliveryPhone;
    }

    const [updatedOrder] = await db
      .update(orders)
      .set(updateData)
      .where(eq(orders.id, orderId))
      .returning();

    if (!updatedOrder) {
      throw new Error("Order not found");
    }

    return updatedOrder;
  }
}