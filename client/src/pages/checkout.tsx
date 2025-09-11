import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  ShoppingBag, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowLeft,
  ShoppingCart,
  AlertCircle,
  Tag,
  X 
} from "lucide-react";
import { useCart } from "@/hooks/cart-context";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import AddressManager from "@/components/address-manager";
import DeliveryOptions from "@/components/delivery-options";
import bouquetBarLogo from "@assets/E_Commerce_Bouquet_Bar_Logo_1757433847861.png";

export default function Checkout() {
  const { 
    items, 
    totalPrice,
    appliedCoupon,
    discountAmount,
    finalAmount,
    deliveryCharge,
    shippingAddress,
    deliveryOption,
    isLoading, 
    error,
    couponError,
    updateQuantity, 
    removeFromCart, 
    clearCart,
    applyCoupon,
    removeCoupon,
    clearCouponError
  } = useCart();
  const { toast } = useToast();
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());
  const [couponCode, setCouponCode] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await apiRequest('/api/auth/user');
        setUser(userData);
      } catch (error) {
        // User not authenticated, continue as guest
        setUser(null);
      } finally {
        setIsLoadingUser(false);
      }
    };
    checkAuth();
  }, []);

  // Format price in INR currency
  const formatPrice = (price: number | string) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(numPrice);
  };

  // Handle quantity change with loading state
  const handleQuantityChange = async (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setUpdatingItems(prev => new Set(prev).add(productId));
    try {
      await updateQuantity(productId, newQuantity);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update quantity",
        variant: "destructive",
      });
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  // Handle item removal with confirmation
  const handleRemoveItem = async (productId: string, productName: string) => {
    try {
      await removeFromCart(productId);
      toast({
        title: "Item Removed",
        description: `${productName} has been removed from your cart.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove item from cart",
        variant: "destructive",
      });
    }
  };

  // Handle clear cart with confirmation
  const handleClearCart = async () => {
    if (window.confirm("Are you sure you want to clear your entire cart?")) {
      try {
        await clearCart();
        toast({
          title: "Cart Cleared",
          description: "All items have been removed from your cart.",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to clear cart",
          variant: "destructive",
        });
      }
    }
  };

  // Handle coupon application
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter a coupon code",
        variant: "destructive",
      });
      return;
    }

    setIsApplyingCoupon(true);
    clearCouponError();

    try {
      const result = await applyCoupon(couponCode);
      if (result.success && result.discountAmount !== undefined) {
        toast({
          title: "Coupon Applied!",
          description: `You saved ${formatPrice(result.discountAmount)} with code ${couponCode.toUpperCase()}`,
        });
        setCouponCode("");
      }
    } catch (error) {
      console.error('Error applying coupon:', error);
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  // Handle coupon removal
  const handleRemoveCoupon = () => {
    removeCoupon();
    toast({
      title: "Coupon Removed",
      description: "The discount has been removed from your order",
    });
  };

  // Loading skeleton component
  const SkeletonRow = () => (
    <TableRow>
      <TableCell>
        <div className="flex items-center space-x-4">
          <Skeleton className="h-16 w-16 rounded" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-16" />
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-2">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-8" />
        </div>
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-16" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-8 w-8" />
      </TableCell>
    </TableRow>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" data-testid="link-home">
              <img 
                src={bouquetBarLogo} 
                alt="Bouquet Bar" 
                className="h-10 w-auto"
              />
            </Link>
            <h1 className="text-2xl font-bold text-foreground">Shopping Cart</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6" data-testid="alert-error">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Empty Cart State */}
        {!isLoading && items.length === 0 && (
          <Card className="text-center py-12" data-testid="card-empty-cart">
            <CardContent className="space-y-4">
              <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground" />
              <h2 className="text-2xl font-semibold">Your cart is empty</h2>
              <p className="text-muted-foreground">
                Looks like you haven't added any items to your cart yet.
              </p>
              <Link to="/shop" data-testid="link-continue-shopping">
                <Button size="lg" className="mt-4">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Continue Shopping
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Cart Items */}
        {(isLoading || items.length > 0) && (
          <div className="grid gap-8 xl:grid-cols-3 lg:grid-cols-2">
            {/* Left Column - Cart Items and Shipping */}
            <div className="xl:col-span-2 lg:col-span-1 space-y-8">
              {/* Cart Items Table */}
              <Card data-testid="card-cart-items">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Cart Items ({isLoading ? "..." : items.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Subtotal</TableHead>
                        <TableHead className="w-12"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        <>
                          <SkeletonRow />
                          <SkeletonRow />
                          <SkeletonRow />
                        </>
                      ) : (
                        items.map((item) => {
                          const isUpdating = updatingItems.has(item.id);
                          const lineTotal = parseFloat(item.price) * item.quantity;
                          
                          return (
                            <TableRow key={item.id} data-testid={`row-cart-item-${item.id}`}>
                              {/* Product Info */}
                              <TableCell>
                                <div className="flex items-center space-x-4">
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="h-16 w-16 rounded object-cover"
                                    data-testid={`img-product-${item.id}`}
                                  />
                                  <div>
                                    <h3 className="font-medium text-foreground" data-testid={`text-product-name-${item.id}`}>
                                      {item.name}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                      {item.category}
                                    </p>
                                  </div>
                                </div>
                              </TableCell>

                              {/* Unit Price */}
                              <TableCell data-testid={`text-unit-price-${item.id}`}>
                                {formatPrice(item.price)}
                              </TableCell>

                              {/* Quantity Controls */}
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                    disabled={isUpdating || item.quantity <= 1}
                                    data-testid={`button-decrease-${item.id}`}
                                  >
                                    <Minus className="h-3 w-3" />
                                  </Button>
                                  
                                  <Input
                                    type="number"
                                    min="1"
                                    max="99"
                                    value={item.quantity}
                                    onChange={(e) => {
                                      const newQuantity = parseInt(e.target.value);
                                      if (newQuantity >= 1 && newQuantity <= 99) {
                                        handleQuantityChange(item.id, newQuantity);
                                      }
                                    }}
                                    className="w-16 text-center"
                                    disabled={isUpdating}
                                    data-testid={`input-quantity-${item.id}`}
                                  />
                                  
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                    disabled={isUpdating || item.quantity >= 99}
                                    data-testid={`button-increase-${item.id}`}
                                  >
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                </div>
                              </TableCell>

                              {/* Line Subtotal */}
                              <TableCell className="font-medium" data-testid={`text-line-total-${item.id}`}>
                                {formatPrice(lineTotal)}
                              </TableCell>

                              {/* Remove Button */}
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleRemoveItem(item.id, item.name)}
                                  disabled={isUpdating}
                                  data-testid={`button-remove-${item.id}`}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>

                  {/* Cart Actions */}
                  {!isLoading && items.length > 0 && (
                    <div className="flex justify-between items-center mt-6 pt-4 border-t">
                      <Button
                        variant="outline"
                        onClick={handleClearCart}
                        data-testid="button-clear-cart"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Clear Cart
                      </Button>
                      
                      <Link to="/shop">
                        <Button variant="ghost" data-testid="link-continue-shopping-inline">
                          <ArrowLeft className="mr-2 h-4 w-4" />
                          Continue Shopping
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Shipping Address Section */}
              {!isLoadingUser && (
                <AddressManager 
                  userId={user?.id}
                  className=""
                />
              )}
              
              {/* Delivery Options Section */}
              <DeliveryOptions className="" />
            </div>

            {/* Right Column - Order Summary */}
            <div className="xl:col-span-1 lg:col-span-1">
              <Card data-testid="card-order-summary">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isLoading ? (
                    <div className="space-y-4">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ) : (
                    <>
                      {/* Coupon Application Section */}
                      <div className="space-y-3">
                        <h3 className="text-sm font-medium text-foreground">Coupon Code</h3>
                        
                        {/* Applied Coupon Display */}
                        {appliedCoupon ? (
                          <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-md border border-green-200 dark:border-green-800">
                            <div className="flex items-center space-x-2">
                              <Tag className="h-4 w-4 text-green-600 dark:text-green-400" />
                              <span className="text-sm font-medium text-green-700 dark:text-green-300">
                                {appliedCoupon.code}
                              </span>
                              <span className="text-xs text-green-600 dark:text-green-400">
                                {appliedCoupon.description || 'Discount applied'}
                              </span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={handleRemoveCoupon}
                              className="h-6 w-6 p-0 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200"
                              data-testid="button-remove-coupon"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex space-x-2">
                            <Input
                              type="text"
                              placeholder="Enter coupon code"
                              value={couponCode}
                              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleApplyCoupon();
                                }
                              }}
                              className="flex-1"
                              disabled={isApplyingCoupon}
                              data-testid="input-apply-coupon"
                            />
                            <Button
                              onClick={handleApplyCoupon}
                              disabled={isApplyingCoupon || !couponCode.trim()}
                              size="default"
                              data-testid="button-apply-coupon"
                            >
                              {isApplyingCoupon ? "Applying..." : "Apply"}
                            </Button>
                          </div>
                        )}

                        {/* Coupon Error Display */}
                        {couponError && (
                          <Alert variant="destructive" data-testid="alert-coupon-error">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{couponError}</AlertDescription>
                          </Alert>
                        )}
                      </div>

                      <Separator />

                      {/* Order Breakdown */}
                      <div className="space-y-2">
                        {/* Subtotal */}
                        <div className="flex justify-between text-base">
                          <span>Subtotal</span>
                          <span data-testid="text-subtotal">{formatPrice(totalPrice)}</span>
                        </div>

                        {/* Delivery Charge */}
                        {deliveryOption && (
                          <div className="flex justify-between text-base">
                            <span>Delivery ({deliveryOption.name})</span>
                            <span data-testid="text-delivery-charge">
                              {parseFloat(deliveryOption.price) > 0 ? formatPrice(deliveryOption.price) : 'Free'}
                            </span>
                          </div>
                        )}

                        {/* Discount Line Item */}
                        {appliedCoupon && discountAmount > 0 && (
                          <div className="flex justify-between text-base text-green-600 dark:text-green-400">
                            <span>Discount ({appliedCoupon.code})</span>
                            <span data-testid="text-discount">-{formatPrice(discountAmount)}</span>
                          </div>
                        )}
                      </div>

                      <Separator />

                      {/* Total */}
                      <div className="flex justify-between text-lg font-semibold">
                        <span>Total</span>
                        <span data-testid="text-total">
                          {formatPrice(finalAmount)}
                        </span>
                      </div>

                      {/* Checkout Button */}
                      <Link to="/checkout/review">
                        <Button 
                          size="lg" 
                          className="w-full" 
                          disabled={items.length === 0 || !shippingAddress || !deliveryOption}
                          data-testid="button-checkout"
                        >
                          {!shippingAddress ? "Add Shipping Address" : 
                           !deliveryOption ? "Select Delivery Option" : 
                           "Continue to Review"}
                        </Button>
                      </Link>
                      
                      {(!shippingAddress || !deliveryOption) && (
                        <p className="text-xs text-muted-foreground text-center">
                          {!shippingAddress && "Please add a shipping address."}
                          {!shippingAddress && !deliveryOption && " "}
                          {!deliveryOption && "Please select a delivery option."}
                        </p>
                      )}

                      <p className="text-xs text-muted-foreground text-center">
                        Secure checkout powered by Bouquet Bar
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}