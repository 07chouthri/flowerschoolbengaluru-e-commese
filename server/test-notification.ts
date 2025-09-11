/**
 * Simple test script to verify notification service functionality
 * This is a test file and can be deleted after verification
 */

import { notificationService } from "./services/notification-service";
import { type Order } from "@shared/schema";

// Mock order data for testing
const mockOrder: Order = {
  id: "test-order-123",
  orderNumber: "ORD-2024-001234",
  userId: null,
  customerName: "Test Customer",
  email: "test@example.com",
  phone: "+919876543210", // Valid Indian phone number
  occasion: "Birthday",
  requirements: "Please deliver before 6 PM",
  status: "confirmed",
  items: [
    {
      productId: "prod1",
      name: "Premium Red Roses",
      quantity: 2,
      price: "1500"
    },
    {
      productId: "prod2", 
      name: "White Lilies",
      quantity: 1,
      price: "800"
    }
  ],
  subtotal: "2300",
  deliveryOptionId: "delivery1",
  deliveryCharge: "100",
  couponCode: null,
  discountAmount: "0",
  paymentMethod: "COD",
  paymentCharges: "0",
  paymentStatus: "pending",
  paymentTransactionId: null,
  total: "2400",
  shippingAddressId: null,
  deliveryAddress: "123 Test Street, Test Area, Mumbai, Maharashtra 400001",
  deliveryDate: null,
  estimatedDeliveryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
  createdAt: new Date(),
  updatedAt: new Date(),
};

async function testNotificationService() {
  console.log("🧪 TESTING NOTIFICATION SERVICE");
  console.log("===============================");
  
  try {
    // Test the notification service
    console.log("📱 Testing notification service with mock order...");
    console.log("Order Number:", mockOrder.orderNumber);
    console.log("Customer:", mockOrder.customerName);
    console.log("Phone:", mockOrder.phone);
    console.log("Total:", mockOrder.total);
    
    // Check environment variables
    console.log("\n🔧 ENVIRONMENT VARIABLES CHECK:");
    console.log("TWILIO_ACCOUNT_SID:", process.env.TWILIO_ACCOUNT_SID ? "✅ Set" : "❌ Not set");
    console.log("TWILIO_AUTH_TOKEN:", process.env.TWILIO_AUTH_TOKEN ? "✅ Set" : "❌ Not set");
    console.log("TWILIO_SMS_FROM:", process.env.TWILIO_SMS_FROM ? "✅ Set" : "❌ Not set");
    console.log("TWILIO_WHATSAPP_FROM:", process.env.TWILIO_WHATSAPP_FROM ? "✅ Set" : "❌ Not set");
    
    // Test SMS only (safer for testing)
    console.log("\n📨 Testing SMS notification...");
    const smsResult = await notificationService.sendSMSOnly(mockOrder);
    
    if (smsResult.success) {
      console.log("✅ SMS test successful!");
      console.log("   Message ID:", smsResult.messageId);
    } else {
      console.log("❌ SMS test failed:", smsResult.error);
    }
    
    // Test WhatsApp only
    console.log("\n💬 Testing WhatsApp notification...");
    const whatsappResult = await notificationService.sendWhatsAppOnly(mockOrder);
    
    if (whatsappResult.success) {
      console.log("✅ WhatsApp test successful!");
      console.log("   Message ID:", whatsappResult.messageId);
    } else {
      console.log("❌ WhatsApp test failed:", whatsappResult.error);
    }
    
    console.log("\n🎉 NOTIFICATION TESTING COMPLETE!");
    
  } catch (error) {
    console.error("❌ CRITICAL ERROR during notification testing:", error);
  }
}

// Export for potential use in other test files
export { testNotificationService, mockOrder };

// Run test if this file is executed directly
if (require.main === module) {
  testNotificationService().catch(console.error);
}