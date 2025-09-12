import { storage } from "../storage";
import { notificationService } from "./notification-service";
import { getSMSStatusUpdateTemplate } from "../templates/sms-templates";
import { getWhatsAppStatusUpdateTemplate } from "../templates/whatsapp-templates";

export interface OrderStatusProgression {
  currentStatus: string;
  nextStatus: string;
  progressionTime: number; // minutes
}

// Define the order status progression rules
const statusProgressions: OrderStatusProgression[] = [
  { currentStatus: "pending", nextStatus: "confirmed", progressionTime: 30 },
  { currentStatus: "confirmed", nextStatus: "processing", progressionTime: 60 },
  { currentStatus: "processing", nextStatus: "shipped", progressionTime: 120 },
  { currentStatus: "shipped", nextStatus: "delivered", progressionTime: 60 }
];

export class BackgroundScheduler {
  private intervalId: NodeJS.Timeout | null = null;
  private isRunning = false;
  private inProgress = false;
  private lastRun: Date | null = null;
  private lastResult: string | null = null;

  /**
   * Start the background scheduler that runs every 30 minutes
   */
  start(): void {
    if (this.isRunning) {
      console.log("[SCHEDULER] Background scheduler is already running");
      return;
    }

    console.log("[SCHEDULER] Starting background scheduler for order status progression");
    
    // Run immediately on start
    this.processOrderStatusProgression();
    
    // Then run every 30 minutes
    this.intervalId = setInterval(() => {
      this.processOrderStatusProgression();
    }, 30 * 60 * 1000); // 30 minutes

    this.isRunning = true;
  }

  /**
   * Stop the background scheduler
   */
  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
    console.log("[SCHEDULER] Background scheduler stopped");
  }

  /**
   * Check if the scheduler is running
   */
  getStatus(): { 
    running: boolean; 
    inProgress: boolean;
    nextRun?: Date;
    lastRun?: Date;
    lastResult?: string;
  } {
    return {
      running: this.isRunning,
      inProgress: this.inProgress,
      nextRun: this.isRunning ? new Date(Date.now() + 30 * 60 * 1000) : undefined,
      lastRun: this.lastRun || undefined,
      lastResult: this.lastResult || undefined
    };
  }

  /**
   * Process order status progression for all eligible orders
   */
  private async processOrderStatusProgression(): Promise<void> {
    // Prevent overlapping runs
    if (this.inProgress) {
      console.log("[SCHEDULER] Skipping run - already in progress");
      return;
    }

    this.inProgress = true;
    this.lastRun = new Date();
    
    try {
      console.log("[SCHEDULER] Starting order status progression check");
      
      let totalAdvanced = 0;
      const now = new Date();

      for (const progression of statusProgressions) {
        const cutoffDate = new Date(now.getTime() - progression.progressionTime * 60 * 1000);
        
        console.log(`[SCHEDULER] Checking orders in status "${progression.currentStatus}" older than ${progression.progressionTime} minutes`);
        
        const ordersToAdvance = await storage.listAdvancableOrders(cutoffDate, [progression.currentStatus]);
        
        console.log(`[SCHEDULER] Found ${ordersToAdvance.length} orders to advance from "${progression.currentStatus}" to "${progression.nextStatus}"`);

        for (const order of ordersToAdvance) {
          try {
            // Advance the order status
            const updatedOrder = await storage.advanceOrderStatus(order.id, progression.nextStatus);
            
            console.log(`[SCHEDULER] Advanced order ${order.orderNumber} from ${progression.currentStatus} to ${progression.nextStatus}`);
            
            // Send status update notification
            try {
              if (order.phone) {
                await this.sendStatusUpdateNotification(updatedOrder, progression.nextStatus);
              }
            } catch (notificationError) {
              console.error(`[SCHEDULER] Failed to send notification for order ${order.orderNumber}:`, notificationError);
              // Don't fail the progression if notification fails
            }
            
            totalAdvanced++;
          } catch (error) {
            console.error(`[SCHEDULER] Failed to advance order ${order.orderNumber}:`, error);
          }
        }
      }

      console.log(`[SCHEDULER] Order status progression completed. Advanced ${totalAdvanced} orders total.`);
      this.lastResult = `Successfully advanced ${totalAdvanced} orders`;
    } catch (error) {
      console.error("[SCHEDULER] Error during order status progression:", error);
      this.lastResult = `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
    } finally {
      this.inProgress = false;
    }
  }

  /**
   * Send status update notification for an order
   */
  private async sendStatusUpdateNotification(order: any, newStatus: string): Promise<void> {
    try {
      if (!order.phone) {
        console.log(`[SCHEDULER] No phone for order ${order.orderNumber}, skipping notification`);
        return;
      }

      const customerName = order.customerName || "Valued Customer";

      // Generate notification messages
      const smsMessage = getSMSStatusUpdateTemplate(
        order.orderNumber,
        newStatus,
        customerName,
        order.estimatedDeliveryDate
      );

      const whatsappMessage = getWhatsAppStatusUpdateTemplate(
        order.orderNumber,
        newStatus,
        customerName,
        undefined, // custom message
        order.estimatedDeliveryDate
      );

      // Send notifications using the notification service's public methods
      try {
        // Use the sendRawSMS method if available
        if ((notificationService as any).sendRawSMS) {
          const smsResult = await (notificationService as any).sendRawSMS(order.phone, smsMessage);
          if (smsResult.success) {
            console.log(`[SCHEDULER] Status update SMS sent for order ${order.orderNumber}`);
          }
        }

        // Use the sendRawWhatsApp method if available
        if ((notificationService as any).sendRawWhatsApp) {
          const whatsappResult = await (notificationService as any).sendRawWhatsApp(order.phone, whatsappMessage);
          if (whatsappResult.success) {
            console.log(`[SCHEDULER] Status update WhatsApp sent for order ${order.orderNumber}`);
          }
        }
      } catch (sendError) {
        console.error(`[SCHEDULER] Failed to send notification for order ${order.orderNumber}:`, sendError);
      }

    } catch (error) {
      console.error(`[SCHEDULER] Error preparing status notification for order ${order.orderNumber}:`, error);
    }
  }

  /**
   * Manual trigger for order status progression (useful for testing)
   */
  async triggerStatusProgression(): Promise<{ success: boolean; message: string }> {
    try {
      console.log("[SCHEDULER] Manual trigger for order status progression");
      
      if (this.inProgress) {
        return { success: false, message: "Scheduler is already running, please wait" };
      }
      
      await this.processOrderStatusProgression();
      return { 
        success: true, 
        message: this.lastResult || "Order status progression completed successfully" 
      };
    } catch (error) {
      console.error("[SCHEDULER] Manual trigger failed:", error);
      return { 
        success: false, 
        message: `Order status progression failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
      };
    }
  }
}

// Export singleton instance
export const backgroundScheduler = new BackgroundScheduler();