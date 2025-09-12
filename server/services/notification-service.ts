import twilio from "twilio";
import { type Order, type OrderNotificationData } from "@shared/schema";
import { getSMSOrderConfirmationTemplate } from "../templates/sms-templates.js";
import { getWhatsAppOrderConfirmationTemplate } from "../templates/whatsapp-templates.js";

export interface NotificationResult {
  success: boolean;
  channel: 'sms' | 'whatsapp';
  messageId?: string;
  error?: string;
}

export class NotificationService {
  private twilioClient: twilio.Twilio;
  private whatsappFromNumber: string;
  private smsFromNumber: string;

  /**
   * Mask phone number for privacy-safe logging
   */
  private maskPhoneNumber(phone: string): string {
    if (!phone || phone.length < 7) return '***';
    // For +91XXXXXXXXXX, show +91******last4
    if (phone.startsWith('+91') && phone.length === 13) {
      return `+91******${phone.slice(-4)}`;
    }
    // For other formats, show first 3 and last 4 with stars in between
    if (phone.length >= 7) {
      return `${phone.slice(0, 3)}******${phone.slice(-4)}`;
    }
    return '***';
  }

  constructor() {
    this.twilioClient = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
    
    // Twilio WhatsApp Business number (sandbox or verified number)
    const rawWhatsAppNumber = process.env.TWILIO_WHATSAPP_FROM || '+14155238886';
    // Ensure WhatsApp number has the whatsapp: prefix
    this.whatsappFromNumber = rawWhatsAppNumber.startsWith('whatsapp:') 
      ? rawWhatsAppNumber 
      : `whatsapp:${rawWhatsAppNumber}`;
    
    // Twilio SMS number - ensure it's properly formatted with country code
    const rawSmsNumber = process.env.TWILIO_SMS_FROM || process.env.TWILIO_PHONE_NUMBER || '';
    this.smsFromNumber = rawSmsNumber.startsWith('+') ? rawSmsNumber : (rawSmsNumber ? `+${rawSmsNumber}` : '');
  }

  /**
   * Validate and format phone number for Indian market
   */
  private formatPhoneNumber(phone: string): string | null {
    if (!phone) return null;

    // Remove all non-digit characters except +
    const cleaned = phone.replace(/[^\d+]/g, '');
    
    // Extract only digits for validation
    const digitsOnly = cleaned.replace(/\D/g, '');
    
    // Handle Indian numbers - mobile numbers start with 6, 7, 8, or 9
    if (digitsOnly.length === 10 && /^[6-9]/.test(digitsOnly)) {
      // Indian mobile number without country code
      return `+91${digitsOnly}`;
    } else if (digitsOnly.length === 12 && digitsOnly.startsWith('91') && /^91[6-9]/.test(digitsOnly)) {
      // Indian number with country code (91XXXXXXXXXX)
      return `+${digitsOnly}`;
    } else if (phone.startsWith('+91') && digitsOnly.length === 12 && /^91[6-9]/.test(digitsOnly)) {
      // Already formatted Indian number (+91XXXXXXXXXX)
      return phone;
    } else if (phone.startsWith('+') && digitsOnly.length >= 10) {
      // International number with + prefix
      return cleaned;
    } else if (digitsOnly.length >= 10) {
      // International number without + prefix
      return `+${digitsOnly}`;
    }
    
    return null;
  }

  /**
   * Extract phone number from order data
   */
  private extractPhoneFromOrder(order: Order): string | null {
    // Try to get phone from the order's phone field first
    if (order.phone) {
      return this.formatPhoneNumber(order.phone);
    }
    
    // Try to extract from delivery address if it contains phone info
    if (order.deliveryAddress) {
      // Look for phone patterns in delivery address string
      const phoneMatch = order.deliveryAddress.match(/\+?[\d\s\-\(\)]{10,}/);
      if (phoneMatch) {
        return this.formatPhoneNumber(phoneMatch[0]);
      }
    }
    
    return null;
  }

  /**
   * Prepare order notification data from order object
   */
  private prepareOrderNotificationData(order: Order): OrderNotificationData | null {
    const phone = this.extractPhoneFromOrder(order);
    if (!phone) {
      console.error(`[NOTIFICATION] No valid phone number found for order: ${order.orderNumber}`);
      return null;
    }

    // Parse items from order.items jsonb field
    const orderItems = Array.isArray(order.items) ? order.items : [];
    
    return {
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      phone,
      total: `₹${parseFloat(order.total).toLocaleString('en-IN')}`,
      estimatedDeliveryDate: order.estimatedDeliveryDate || undefined,
      items: orderItems.map((item: any) => ({
        name: item.name || 'Unknown Item',
        quantity: item.quantity || 1,
        price: `₹${parseFloat(item.price || '0').toLocaleString('en-IN')}`
      })),
      deliveryAddress: order.deliveryAddress || 'Address not provided',
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus || 'pending'
    };
  }

  /**
   * Send SMS notification
   */
  private async sendSMS(notificationData: OrderNotificationData): Promise<NotificationResult> {
    try {
      if (!this.smsFromNumber) {
        throw new Error('SMS from number not configured');
      }

      const messageBody = getSMSOrderConfirmationTemplate(notificationData);
      
      console.log(`[SMS] Sending order confirmation to ${this.maskPhoneNumber(notificationData.phone)} for order ${notificationData.orderNumber}`);
      
      const message = await this.twilioClient.messages.create({
        body: messageBody,
        from: this.smsFromNumber,
        to: notificationData.phone,
        statusCallback: `${process.env.BASE_URL || 'http://localhost:5000'}/api/twilio/status`
      });

      console.log(`[SMS] Message sent successfully. Order: ${notificationData.orderNumber}, SID: ${message.sid}`);
      
      return {
        success: true,
        channel: 'sms',
        messageId: message.sid
      };
    } catch (error) {
      console.error(`[SMS] Failed to send SMS for order ${notificationData.orderNumber}:`, error instanceof Error ? error.message : 'Unknown SMS error');
      return {
        success: false,
        channel: 'sms',
        error: error instanceof Error ? error.message : 'Unknown SMS error'
      };
    }
  }

  /**
   * Send WhatsApp notification
   */
  private async sendWhatsApp(notificationData: OrderNotificationData): Promise<NotificationResult> {
    try {
      const messageBody = getWhatsAppOrderConfirmationTemplate(notificationData);
      const whatsappTo = `whatsapp:${notificationData.phone}`;
      
      console.log(`[WHATSAPP] Sending order confirmation to ${this.maskPhoneNumber(notificationData.phone)} for order ${notificationData.orderNumber}`);
      
      const message = await this.twilioClient.messages.create({
        body: messageBody,
        from: this.whatsappFromNumber,
        to: whatsappTo,
        statusCallback: `${process.env.BASE_URL || 'http://localhost:5000'}/api/twilio/status`
      });

      console.log(`[WHATSAPP] Message sent successfully. Order: ${notificationData.orderNumber}, SID: ${message.sid}`);
      
      return {
        success: true,
        channel: 'whatsapp',
        messageId: message.sid
      };
    } catch (error) {
      console.error(`[WHATSAPP] Failed to send WhatsApp message for order ${notificationData.orderNumber}:`, error instanceof Error ? error.message : 'Unknown WhatsApp error');
      return {
        success: false,
        channel: 'whatsapp',
        error: error instanceof Error ? error.message : 'Unknown WhatsApp error'
      };
    }
  }

  /**
   * Send order confirmation notifications via multiple channels
   */
  async sendOrderConfirmation(order: Order): Promise<{
    sms: NotificationResult;
    whatsapp: NotificationResult;
    notificationData: OrderNotificationData | null;
  }> {
    const notificationData = this.prepareOrderNotificationData(order);
    
    if (!notificationData) {
      const errorResult: NotificationResult = {
        success: false,
        channel: 'sms',
        error: 'No valid phone number found in order'
      };
      
      return {
        sms: errorResult,
        whatsapp: { ...errorResult, channel: 'whatsapp' },
        notificationData: null
      };
    }

    console.log(`[NOTIFICATION] Sending order confirmation for ${order.orderNumber} to ${this.maskPhoneNumber(notificationData.phone)}`);

    // Send both SMS and WhatsApp in parallel for better performance
    const [smsResult, whatsappResult] = await Promise.all([
      this.sendSMS(notificationData),
      this.sendWhatsApp(notificationData)
    ]);

    // Log results
    if (smsResult.success) {
      console.log(`[NOTIFICATION] SMS sent successfully for order ${order.orderNumber}, SID: ${smsResult.messageId}`);
    } else {
      console.error(`[NOTIFICATION] SMS failed for order ${order.orderNumber}:`, smsResult.error);
    }

    if (whatsappResult.success) {
      console.log(`[NOTIFICATION] WhatsApp sent successfully for order ${order.orderNumber}, SID: ${whatsappResult.messageId}`);
    } else {
      console.error(`[NOTIFICATION] WhatsApp failed for order ${order.orderNumber}:`, whatsappResult.error);
    }

    return {
      sms: smsResult,
      whatsapp: whatsappResult,
      notificationData
    };
  }

  /**
   * Send SMS only (fallback option)
   */
  async sendSMSOnly(order: Order): Promise<NotificationResult> {
    const notificationData = this.prepareOrderNotificationData(order);
    
    if (!notificationData) {
      return {
        success: false,
        channel: 'sms',
        error: 'No valid phone number found in order'
      };
    }

    return await this.sendSMS(notificationData);
  }

  /**
   * Send WhatsApp only
   */
  async sendWhatsAppOnly(order: Order): Promise<NotificationResult> {
    const notificationData = this.prepareOrderNotificationData(order);
    
    if (!notificationData) {
      return {
        success: false,
        channel: 'whatsapp',
        error: 'No valid phone number found in order'
      };
    }

    return await this.sendWhatsApp(notificationData);
  }
}

// Export singleton instance
export const notificationService = new NotificationService();