import { useState } from "react";
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
  AlertCircle 
} from "lucide-react";
import { useCart } from "@/hooks/cart-context";
import { useToast } from "@/hooks/use-toast";
import bouquetBarLogo from "@assets/E_Commerce_Bouquet_Bar_Logo_1757433847861.png";

export default function Checkout() {
  const { 
    items, 
    totalPrice, 
    isLoading, 
    error, 
    updateQuantity, 
    removeFromCart, 
    clearCart 
  } = useCart();
  const { toast } = useToast();
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());

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
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Cart Items Table */}
            <div className="lg:col-span-2">
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
            </div>

            {/* Order Summary */}
            <div>
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
                      {/* Subtotal */}
                      <div className="flex justify-between text-base">
                        <span>Subtotal</span>
                        <span data-testid="text-subtotal">{formatPrice(totalPrice)}</span>
                      </div>

                      <Separator />

                      {/* Total */}
                      <div className="flex justify-between text-lg font-semibold">
                        <span>Total</span>
                        <span data-testid="text-total">{formatPrice(totalPrice)}</span>
                      </div>

                      {/* Checkout Button */}
                      <Link to="/checkout/review">
                        <Button 
                          size="lg" 
                          className="w-full" 
                          disabled={items.length === 0}
                          data-testid="button-checkout"
                        >
                          Continue to Review
                        </Button>
                      </Link>

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