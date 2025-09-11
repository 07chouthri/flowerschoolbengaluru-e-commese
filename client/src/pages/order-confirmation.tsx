import { useState, useEffect } from 'react';
import { useRoute } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Package, Truck, Clock, Download, Home, ShoppingBag } from 'lucide-react';
import { Link } from 'wouter';
import type { Order } from '@shared/schema';

export default function OrderConfirmation() {
  const [, params] = useRoute('/order-confirmation/:orderId');
  const orderId = params?.orderId;

  // Fetch order details
  const { data: order, isLoading, error } = useQuery<Order>({
    queryKey: ['/api/orders', orderId],
    enabled: !!orderId,
  });

  const formatPrice = (price: number | string) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(numPrice);
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading order details...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Order Not Found</h2>
            <p className="text-muted-foreground mb-4">
              We couldn't find the order details. Please check your order ID or contact support.
            </p>
            <Link href="/my-account">
              <Button variant="outline" className="w-full">
                <Home className="w-4 h-4 mr-2" />
                Go to My Account
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Success Header */}
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-green-800 mb-2" data-testid="text-order-success">
              Order Placed Successfully!
            </h1>
            <p className="text-green-700 text-lg mb-4">
              Thank you for your order. We've received your request and will process it shortly.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-green-600">
              <span>Order Number: <strong>{order.orderNumber}</strong></span>
              <span>•</span>
              <span>Order ID: <strong>{order.id}</strong></span>
            </div>
          </CardContent>
        </Card>

        {/* Order Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="w-5 h-5" />
              Order Status & Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <Badge className={getStatusColor(order.status || '')} data-testid="badge-order-status">
                {order.status || 'Pending'}
              </Badge>
              <span className="text-sm text-muted-foreground">
                Placed on {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                }) : 'N/A'}
              </span>
            </div>
            
            {order.estimatedDeliveryDate && (
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span>Estimated Delivery: {new Date(order.estimatedDeliveryDate).toLocaleDateString('en-IN')}</span>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {(Array.isArray(order.items) ? order.items : JSON.parse(order.items || '[]')).map((item: any, index: number) => (
                <div key={index} className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{item.productName}</h4>
                    <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatPrice(item.unitPrice)} × {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatPrice(item.totalPrice)}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Delivery & Payment */}
          <Card>
            <CardHeader>
              <CardTitle>Delivery & Payment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Delivery Address */}
              <div>
                <h4 className="font-medium mb-2">Delivery Address</h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>{order.customerName}</p>
                  <p>{order.phone}</p>
                  {order.email && <p>{order.email}</p>}
                  <p>{order.deliveryAddress}</p>
                </div>
              </div>

              <Separator />

              {/* Payment Method */}
              <div>
                <h4 className="font-medium mb-2">Payment Method</h4>
                <p className="text-sm text-muted-foreground">{order.paymentMethod || 'Cash on Delivery'}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              {parseFloat(order.deliveryCharge?.toString() || '0') > 0 && (
                <div className="flex justify-between">
                  <span>Delivery Charges</span>
                  <span>{formatPrice(order.deliveryCharge || 0)}</span>
                </div>
              )}
              {parseFloat(order.discountAmount?.toString() || '0') > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount Applied</span>
                  <span>-{formatPrice(order.discountAmount || 0)}</span>
                </div>
              )}
              {parseFloat(order.paymentCharges?.toString() || '0') > 0 && (
                <div className="flex justify-between">
                  <span>Payment Charges</span>
                  <span>{formatPrice(order.paymentCharges || 0)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total Amount</span>
                <span data-testid="text-total-amount">{formatPrice(order.total || order.subtotal || 0)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SMS/WhatsApp Confirmation Notice */}
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Package className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-blue-800 mb-1">Confirmation Sent</h4>
                <p className="text-blue-700 text-sm">
                  We've sent order confirmation details to your mobile number <strong>{order.phone}</strong> via SMS and WhatsApp. 
                  You'll also receive updates about your order status.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <Link href="/shop">
            <Button variant="outline" data-testid="button-continue-shopping">
              <ShoppingBag className="w-4 h-4 mr-2" />
              Continue Shopping
            </Button>
          </Link>
          <Link href="/my-account">
            <Button data-testid="button-track-order">
              <Package className="w-4 h-4 mr-2" />
              Track Your Orders
            </Button>
          </Link>
        </div>

        {/* Support Note */}
        <Card className="border-gray-200">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">
              Need help? Contact us at <strong>support@bouquetbar.com</strong> or call <strong>+91 9876543210</strong>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}