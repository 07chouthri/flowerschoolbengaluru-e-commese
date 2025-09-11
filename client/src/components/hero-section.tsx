import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, GraduationCap, Star, ArrowRight, Flower, Users, Award, Calendar, Truck, Gift, ShoppingCart, Plus, Minus, Trash2, X } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useCart } from "@/hooks/cart-context";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import bouquetBarLogo from "@assets/E_Commerce_Bouquet_Bar_Logo_1757433847861.png";
import flowerSchoolLogo from "@assets/Flower_School_Logo_1757484169081.png";

export default function HeroSection() {
  const [showCartModal, setShowCartModal] = useState(false);
  const [, setLocation] = useLocation();
  const { 
    totalItems, 
    totalPrice,
    items,
    isLoading,
    updateQuantity,
    removeFromCart 
  } = useCart();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="home" className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-2xl md:text-3xl text-gray-700 mb-8 font-light leading-relaxed">
            Your one-stop destination for beautiful flowers and professional floral education
          </h1>
          
          {/* Feature Badges */}
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            <Badge className="bg-pink-100 text-pink-700 border border-pink-200 px-4 py-2 text-sm font-medium">
              <Flower className="w-4 h-4 mr-2" />
              Premium Flowers
            </Badge>
            <Badge className="bg-orange-100 text-orange-700 border border-orange-200 px-4 py-2 text-sm font-medium">
              <GraduationCap className="w-4 h-4 mr-2" />
              Expert Training
            </Badge>
            <Badge className="bg-blue-100 text-blue-700 border border-blue-200 px-4 py-2 text-sm font-medium">
              <Truck className="w-4 h-4 mr-2" />
              Fast Delivery
            </Badge>
            <Badge className="bg-purple-100 text-purple-700 border border-purple-200 px-4 py-2 text-sm font-medium">
              <Gift className="w-4 h-4 mr-2" />
              Gift Packages
            </Badge>
          </div>
        </div>
        
        {/* Two Cards Layout */}
        <div className="grid lg:grid-cols-2 gap-8 items-stretch">
          {/* Online Flower Shop Card */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-pink-200 flex flex-col justify-between">
            {/* Bouquet Bar Logo */}
            <div className="text-center mb-6">
              <img 
                src={bouquetBarLogo}
                alt="Bouquet Bar Bengaluru Logo"
                className="w-32 h-auto mx-auto mb-2"
              />
            </div>
            
            <div className="text-center flex-grow">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Online Flower Shop
              </h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Browse our exclusive collection of fresh flowers, bouquets, and arrangements
              </p>
              
              <div className="flex gap-3 mb-8">
                <Link href="/shop" className="flex-1">
                  <Button 
                    size="lg"
                    className="w-full text-lg py-4 h-auto font-semibold"
                    data-testid="button-visit-shop"
                  >
                    Visit Shop Now
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="relative text-pink-600 border-pink-300 px-4 py-4 hover:bg-pink-50"
                  onClick={() => setShowCartModal(true)}
                  data-testid="button-cart-hero"
                >
                  <ShoppingCart className="w-6 h-6" />
                  {totalItems > 0 && (
                    <Badge className="absolute -top-2 -right-2 min-w-5 h-5 flex items-center justify-center text-xs bg-pink-500 text-white">
                      {totalItems}
                    </Badge>
                  )}
                </Button>
              </div>
            </div>
            
            {/* Features */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-gray-600">
                <Flower className="w-5 h-5 text-pink-500" />
                <span className="text-sm font-medium">500+ Varieties</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-5 h-5 text-pink-500" />
                <span className="text-sm font-medium">Same Day Delivery</span>
              </div>
            </div>
          </div>
          
          {/* Floral Design School Card */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-pink-200 flex flex-col justify-between">
            {/* The Flower School Logo */}
            <div className="text-center mb-6">
              <img 
                src={flowerSchoolLogo}
                alt="The Flower School Bengaluru Logo"
                className="w-24 h-24 mx-auto mb-2"
              />
            </div>
            
            <div className="text-center flex-grow">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Floral Design School
              </h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Learn professional floral design from expert instructors
              </p>
              
              <Button 
                size="lg"
                onClick={() => scrollToSection('school')}
                className="w-full text-lg py-4 h-auto font-semibold mb-8 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                data-testid="button-explore-courses"
              >
                Explore Courses
              </Button>
            </div>
            
            {/* Features */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-gray-600">
                <Award className="w-5 h-5 text-orange-500" />
                <span className="text-sm font-medium">Certified Courses</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Users className="w-5 h-5 text-orange-500" />
                <span className="text-sm font-medium">Expert Instructors</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cart Modal */}
      <Dialog open={showCartModal} onOpenChange={setShowCartModal}>
        <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
          <DialogHeader className="flex flex-row items-center justify-center gap-4 pb-4">
            {/* Bouquet Bar Logo inside Cart Modal */}
            <img 
              src={bouquetBarLogo}
              alt="Bouquet Bar Logo"
              className="w-16 h-auto"
            />
            <div className="text-center">
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Your Cart
              </DialogTitle>
              <p className="text-sm text-muted-foreground">
                {totalItems} {totalItems === 1 ? 'item' : 'items'} • ₹{Number(totalPrice).toFixed(2)}
              </p>
            </div>
          </DialogHeader>

          <div className="space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-semibold text-muted-foreground mb-2">Your cart is empty</p>
                <p className="text-sm text-muted-foreground">Add some beautiful flowers to get started!</p>
              </div>
            ) : (
              <>
                {/* Cart Items */}
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {items.map((item) => (
                    <Card key={item.id} className="p-4">
                      <div className="flex gap-3">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm truncate">{item.name}</h4>
                          <p className="text-xs text-muted-foreground">₹{Number(item.price).toFixed(2)} each</p>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                                data-testid={`button-decrease-${item.id}`}
                              >
                                <Minus className="w-3 h-3" />
                              </Button>
                              <span className="text-sm font-medium min-w-[2ch] text-center">
                                {item.quantity}
                              </span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                data-testid={`button-increase-${item.id}`}
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold">₹{(Number(item.price) * item.quantity).toFixed(2)}</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-destructive hover:text-destructive"
                                onClick={() => removeFromCart(item.id)}
                                data-testid={`button-remove-${item.id}`}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                <Separator />

                {/* Cart Total */}
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-semibold">Total:</span>
                    <span className="text-xl font-bold text-primary">₹{Number(totalPrice).toFixed(2)}</span>
                  </div>

                  {/* Proceed to Checkout Button */}
                  <div 
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-medium py-2 px-4 rounded-md cursor-pointer text-center transition-colors"
                    onClick={(e) => { 
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('Proceed to Checkout clicked from hero!'); 
                      console.log('Current URL:', window.location.href);
                      setShowCartModal(false); 
                      console.log('Calling setLocation with /checkout');
                      setLocation('/checkout'); 
                      console.log('SetLocation called, new URL should be /checkout');
                      setTimeout(() => {
                        console.log('URL after timeout:', window.location.href);
                        if (!window.location.href.includes('/checkout')) {
                          console.log('Navigation failed, forcing with window.location');
                          window.location.href = '/checkout';
                        }
                      }, 100);
                    }}
                    data-testid="button-proceed-checkout-hero"
                    role="button"
                    tabIndex={0}
                  >
                    Proceed to Checkout
                  </div>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
