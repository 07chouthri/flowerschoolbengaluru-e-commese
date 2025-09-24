import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { 
  Search, 
  MapPin, 
  ShoppingCart, 
  UserIcon, 
  Heart,
  Gift,
  Calendar,
  Star,
  Filter,
  ChevronDown,
  Phone,
  LogOut,
  X,
  Plus,
  Minus,
  Trash2
} from "lucide-react";
import { Link, useLocation } from "wouter";
import Footer from "@/components/footer";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import bouquetBarLogo from "@assets/E_Commerce_Bouquet_Bar_Logo_1757433847861.png";
import { type Product, type User } from "@shared/schema";
import { useCart } from "@/hooks/cart-context";
import FlowerCategory from "./FlowerCategory";
import PostFile from "./PostFileProps";
import SmallImages from "./SmallImages";
import PostFileOne from "./PostFileOne";
import PostFileTwo from "./PostFileTwo";
import PostThree from "./PostThree";
import PostFileFour from "./PostFileFour";
import VideoFile from "./VideoFile";
import PostFileFive from "./PostFileFive";
import PostFileSix from "./PostFileSix";

export default function Shop() {
    const [animatedText, setAnimatedText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [showInStockOnly, setShowInStockOnly] = useState(false);
  
const [isVisible, setIsVisible] = useState(true);

    const [showCartModal, setShowCartModal] = useState(false);
    const [location, setLocation] = useLocation();
    const { toast } = useToast();
    const queryClient = useQueryClient();
  
    const [isDeleting, setIsDeleting] = useState(false);
    const [categoryIndex, setCategoryIndex] = useState(0);
    const [typingSpeed, setTypingSpeed] = useState(100);
    const animationRef = useRef<NodeJS.Timeout | null>(null);
  

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);


  // Add this useEffect to your Shop component (after your existing useEffects):

useEffect(() => {
  // Handle hash navigation when component loads
  const hash = window.location.hash.substring(1);
  if (hash) {
    // Wait a bit for components to render
    setTimeout(() => {
      const element = document.getElementById(hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 500);
  }
}, []);

// Also update your existing scrollToSection function to be more robust:
const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (element) {
    // Add some offset to account for sticky header
    const headerOffset = 100;
    const elementPosition = element.offsetTop;
    const offsetPosition = elementPosition - headerOffset;
    
    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth"
    });
  }
};

  // Get current user data first
  const { data: user } = useQuery<User>({
    queryKey: ["/api/auth/user"],
    retry: false,
  });


  
  
  const { 
    addToCart, 
    totalItems, 
    totalPrice,
    items,
    isLoading,
    isInCart, 
    getItemQuantity,
    updateQuantity,
    removeFromCart 
  } = useCart();
  
  // Get products data
  const { data: products = [], isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });
  
  // Filter and sort products based on search, category, price, and stock
  const filteredProducts = products
    .filter((product: Product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (product.description?.toLowerCase() || '').includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "all" || 
                             (product.category?.toLowerCase() || '') === selectedCategory.toLowerCase();
      // Convert price to number to ensure type safety
      const productPrice = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
      const matchesPrice = !isNaN(productPrice) && 
                          productPrice >= priceRange[0] && 
                          productPrice <= priceRange[1];
      const matchesStock = !showInStockOnly || product.inStock === true;
      return matchesSearch && matchesCategory && matchesPrice && matchesStock;
    })
    .sort((a, b) => {
      // Convert prices to numbers for comparison
      const priceA = typeof a.price === 'string' ? parseFloat(a.price) : a.price;
      const priceB = typeof b.price === 'string' ? parseFloat(b.price) : b.price;
      
      switch (sortBy) {
        case "price-low":
          return priceA - priceB;
        case "price-high":
          return priceB - priceA;
        case "name":
        default:
          return a.name.localeCompare(b.name);
      }
    });

  // Handle add to cart with toast notification
  const handleAddToCart = (product: Product) => {
    addToCart(product, 1); // Explicitly pass quantity=1
    toast({
      title: "Added to Cart! 🛒",
      description: `${product.name} has been added to your cart.`,
      duration: 2000,
    });
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSortBy("name");
    setPriceRange([0, 2000]);
    setShowInStockOnly(false);
  };

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("/api/auth/signout", {
        method: "POST",
      });
    },
    onSuccess: () => {
      // Clear user data from cache
      queryClient.setQueryData(["/api/auth/user"], null);
      toast({
        title: "Logged out successfully",
        description: "You have been signed out.",
      });
      // Navigate to home page
      setLocation("/");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to log out",
        variant: "destructive",
      });
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  // Favorites mutations
  const addToFavoritesMutation = useMutation({
    mutationFn: async (productId: string) => {
      return apiRequest("/api/favorites", {
        method: "POST",
        body: JSON.stringify({ productId }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/favorites"] });
      toast({
        title: "Added to Favorites",
        description: "Product saved to your favorites list.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add to favorites",
        variant: "destructive",
      });
    },
  });


   // Typing animation effect
    useEffect(() => {
      if (searchQuery) return; // Stop animation if user is typing
      
      const currentCategory = categories[categoryIndex];
      
      const handleTyping = () => {
        if (isDeleting) {
          // Backspace effect
          setAnimatedText(currentCategory.substring(0, animatedText.length - 1));
          setTypingSpeed(50);
        } else {
          // Typing effect
          setAnimatedText(currentCategory.substring(0, animatedText.length + 1));
          setTypingSpeed(100);
        }
        
        // Check if we've finished typing a word
        if (!isDeleting && animatedText === currentCategory) {
          // Pause at the end of typing
          setTimeout(() => setIsDeleting(true), 1000);
        } else if (isDeleting && animatedText === "") {
          // Move to next category after deleting
          setIsDeleting(false);
          setCategoryIndex((prev) => (prev + 1) % categories.length);
        }
      };
      
      animationRef.current = setTimeout(handleTyping, typingSpeed);
      
      return () => {
        if (animationRef.current) {
          clearTimeout(animationRef.current);
        }
      };
    }, [animatedText, isDeleting, categoryIndex, searchQuery]);
  

    const handleInputFocus = () => {
    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }
  };

  const removeFromFavoritesMutation = useMutation({
    mutationFn: async (productId: string) => {
      return apiRequest(`/api/favorites/${productId}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/favorites"] });
      toast({
        title: "Removed from Favorites",
        description: "Product removed from your favorites list.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to remove from favorites",
        variant: "destructive",
      });
    },
  });

  // Get user favorites to check status
  const { data: userFavorites = [] } = useQuery({
    queryKey: ["/api/favorites"],
    enabled: !!user,
  });

  // Check if product is favorited
  const isProductFavorited = (productId: string) => {
    return Array.isArray(userFavorites) && userFavorites.some((fav: any) => fav.productId === productId);
  };

  // Handle toggle favorites
  const handleToggleFavorite = (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to save favorites.",
        variant: "destructive",
      });
      return;
    }

    if (isProductFavorited(productId)) {
      removeFromFavoritesMutation.mutate(productId);
    } else {
      addToFavoritesMutation.mutate(productId);
    }
  };

  const categories = [
    "Birthday Flowers",
    "Anniversary Flowers",
    "Wedding Flowers",
    "Valentine's Day Flowers",
    "Roses",
    "Tulips",
    "Lilies",
    "Orchids",
    "Sympathy Flowers",
    "Get Well Soon Flowers",
    "Congratulations Flowers",
    "Flower Bouquets",
    "Flower Baskets",
    "Vase Arrangements",
    "Floral Centerpieces",
    "Dried Flower Arrangements",
    "Floral Gift Hampers",
    "Flower with Chocolates",
    "Wedding Floral Decor",
    "Corporate Event Flowers",
    "Garlands",
    "Luxury Rose Boxes",
    "Same-Day Flower Delivery",
    "Customized Message Cards"
  ];



  return (
    <div className="min-h-screen ">
      {/* Top Bar */}
      <div className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Main Navigation */}
          <div className="flex items-center justify-between py-4">
            <Link href="/" className="flex items-center gap-3">
              <img 
                src={bouquetBarLogo}
                alt="Bouquet Bar Logo"
                className="w-20 h-auto"
              />
              <div className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                Bouquet Bar
              </div>
            </Link>
            
          {/* Search Bar */}
<div className="flex-1 max-w-xl mx-4 md:mx-6">
  <div className="relative">
    <Input
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      onFocus={handleInputFocus}
      className="pl-4 pr-10 py-2.5 w-full rounded-xl border border-gray-300 focus:border-gray-400 focus:ring-1 focus:ring-gray-200 shadow-sm transition-all duration-200 font-sans text-sm md:text-base h-10 md:h-11"
    />
    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none w-3/4">
      <span className="text-gray-500 font-medium text-xs md:text-sm truncate">
        {!searchQuery ? `Searching for ${animatedText}` : ""}
        {!searchQuery && <span className="animate-pulse font-bold">|</span>}
      </span>
    </div>
    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
  </div>
</div>
            
<div className="flex items-center gap-3 md:gap-1 relative">
  {/* Cart Button with Hover Text */}
  <div className="relative group">
    <Button 
      variant="ghost" 
      size="icon" 
      className="relative h-12 w-12 rounded-full" 
      onClick={() => setShowCartModal(true)}
      data-testid="button-cart"
    >
      <ShoppingCart className="w-7 h-7" />
       {totalItems > 0 && (
    <span className="absolute -right-1 flex items-center justify-center h-4 min-w-[1rem] px-1 text-[10px] font-semibold rounded-full bg-pink-600 text-white">
      {totalItems}
    </span>
  )}
    </Button>
     <div className="absolute top-full left-1/2 -translate-x-1/2 opacity-0  duration-200 pointer-events-none   py-1 rounded">
    Cart
  </div>
  </div>

  {/* Contact Button with Hover Text */}
  <div className="relative group">
    <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full" data-testid="button-contact">
      <Phone className="w-6 h-6" />
    </Button>
    <div className="absolute top-full left-1/2 transform -translate-x-1/2 opacity-0  transition-opacity duration-200 pointer-events-none mt-1 bg-black text-white text-xs px-2 py-1 rounded">
      Contact
    </div>
  </div>

  {user ? (
    <>
      {/* Account Button with Hover Text */}
      <div className="relative group">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-12 w-12 rounded-full"
          onClick={() => setLocation("/my-account")}
          data-testid="button-account"
        >
          <UserIcon className="w-6 h-6" />
        </Button>
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 opacity-0 transition-opacity duration-200 pointer-events-none mt-1 bg-black text-white text-xs px-2 py-1 rounded">
          Account
        </div>
      </div>
      
    {/* User greeting and Logout Button */}
<div className="flex items-center gap-4">
  <span className="text-sm text-gray-700 font-medium hidden md:block">
    Hello, {user.firstname || 'User'}!
  </span>

  <Button 
    variant="outline" 
    size="sm"
    onClick={handleLogout}
    disabled={logoutMutation.isPending}
    data-testid="button-logout"
    className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-pink-700 text-white border-0 transition-all duration-300"
  >
    {logoutMutation.isPending ? 'Logging out...' : 'Log Out'}
  </Button>
</div>

    </>
  ) : (
  <Button 
  size="sm" 
  onClick={() => setLocation("/signin")}
  data-testid="button-login"
  className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white transition-all duration-300"
>
  <UserIcon className="w-4 h-4 mr-2" />
  Login
</Button>
  )}
</div>
</div>

</div>
<FlowerCategory />
 </div>

      <div>
        
        <PostFile />
      <section id="flower-categories">
      <SmallImages/>
    </section>
       <section id="fresh-flowers">
      <PostFileOne/>
    </section>
        {/* <PostFileTwo/> */}
    <section id="premium">
      <PostThree/>
    </section>
     <section id="wedding">
      <PostFileFour/>
    </section>
    <VideoFile/>  
       <section id="corporate">
      <PostFileFive/>
    </section>
 <section id="floral-design-courses">
      <PostFileSix/>
    </section>
      </div>
    

      {/* Products Section */}
      <section id="products-section" className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
           <h2 className="text-3xl font-bold">
  {searchQuery 
    ? `Search Results for "${searchQuery}"` 
    : selectedCategory === "all" 
      ? "All Products" 
      : `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Products`}
</h2>

            <div className="text-sm text-gray-600">
              {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
            </div>
          </div>
          
          {productsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <Card key={index} className="overflow-hidden">
                  <div className="w-full h-64 bg-gray-200 animate-pulse"></div>
                  <CardContent className="p-4">
                    <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <Gift className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchQuery ? 'No products found' : 'No products in this category'}
              </h3>
              <p className="text-gray-600 mb-4">
                {searchQuery ? 'Try searching with different keywords' : 'Please select a different category'}
              </p>
              {searchQuery && (
                <Button 
                  variant="outline" 
                  onClick={() => setSearchQuery("")}
                  data-testid="button-clear-search"
                >
                  Clear Search
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product, index) => (
                <Card key={product.id} className="overflow-hidden hover-elevate" data-testid={`card-product-${product.id}`}>
                  <div className="relative">
                    <img 
                      src={`data:image/jpeg;base64,${product.image}`}
                      alt={product.name}
                      className="w-full h-64 object-cover cursor-pointer"
                      onClick={() => setLocation(`/product/${product.id}`)}
                    />
                    <button 
                      className="absolute top-4 right-4 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover-elevate"
                      onClick={(e) => handleToggleFavorite(product.id, e)}
                      disabled={addToFavoritesMutation.isPending || removeFromFavoritesMutation.isPending}
                      data-testid={`button-favorite-${product.id}`}
                    >
                      <Heart 
                        className={`w-4 h-4 ${isProductFavorited(product.id) 
                          ? 'fill-pink-500 text-pink-500' 
                          : 'text-gray-600'
                        }`} 
                      />
                    </button>
                    {!product.inStock && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Badge variant="secondary" className="bg-white text-black">
                          Out of Stock
                        </Badge>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 
                      className="font-semibold text-gray-900 mb-2 cursor-pointer hover:text-pink-600 transition-colors"
                      onClick={() => setLocation(`/product/${product.id}`)}
                    >
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xl font-bold text-primary">₹{product.price}</span>
                      <Badge variant="outline" className="text-xs">
                        {product.category}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1 flex-1">
                        <Button 
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={() => setLocation(`/product/${product.id}`)}
                          data-testid={`button-view-details-${product.id}`}
                        >
                          View Details
                        </Button>
                        <Button 
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault();
                            handleAddToCart(product);
                          }}
                          disabled={!product.inStock}
                          className="flex-1"
                          data-testid={`button-add-cart-${product.id}`}
                        >
                          {isInCart(product.id) ? 
                            `+${getItemQuantity(product.id)}` : 
                            (product.inStock ? 'Add to Cart' : 'Out of Stock')
                          }
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Celebrations Calendar */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8">Celebrations Calendar</h2>
          <div className="text-gray-600">
            <p>Stay updated with upcoming festivals and occasions to never miss a celebration!</p>
          </div>
        </div>
      </section>

      {/* Cart Modal */}
      {/* Cart Modal - Updated styling */}
      <Dialog open={showCartModal} onOpenChange={setShowCartModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-white border border-pink-100">
          <DialogHeader className="bg-pink-25 -m-6 mb-4 p-6 border-b border-pink-100">
            <DialogTitle className="flex items-center gap-2 text-gray-900">
              <ShoppingCart className="h-5 w-5 text-pink-600" />
              Shopping Cart ({totalItems} {totalItems === 1 ? 'item' : 'items'})
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Review your items and proceed to checkout
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="h-16 w-16 mx-auto text-pink-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
                <p className="text-gray-500 mb-4">Start shopping to add items to your cart</p>
                <Button 
                  onClick={() => setShowCartModal(false)}
                  className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
                >
                  Continue Shopping
                </Button>
              </div>
            ) : (
              <>
                {/* Cart Items */}
                <div className="space-y-3">
                  {items.map((item: any) => (
                    <div key={item.id} className="flex items-center gap-4 p-4 border border-pink-100 rounded-lg bg-white hover:bg-pink-25 transition-colors">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded border border-pink-100"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.name}</h4>
                        <p className="text-sm text-gray-500 line-clamp-1">{item.description}</p>
                        <p className="text-lg font-bold text-pink-600">₹{parseFloat(item.price).toLocaleString()}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={isLoading}
                          className="border-pink-200 hover:bg-pink-50"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center font-medium bg-pink-50 py-1 rounded">{item.quantity}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={isLoading}
                          className="border-pink-200 hover:bg-pink-50"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeFromCart(item.id)}
                          disabled={isLoading}
                          className="ml-2 text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="border-pink-100" />

                {/* Cart Summary */}
                <div className="space-y-2 bg-pink-25 p-4 rounded-lg border border-pink-100">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'items'})</span>
                    <span>₹{totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Delivery</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <Separator className="border-pink-100" />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-pink-600">₹{totalPrice.toLocaleString()}</span>
                  </div>
                </div>

                <DialogFooter className="flex-col gap-2">
                  {/* Always show Checkout button - behavior changes based on login status */}
                  <Button 
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                    onClick={() => {
                      setShowCartModal(false);
                      if (user) {
                        // User is logged in - go to checkout
                        setLocation('/checkout');
                      } else {
                        // User is not logged in - go to signin
                        setLocation('/signin');
                      }
                    }}
                    data-testid="button-checkout"
                  >
                    Checkout
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowCartModal(false)} 
                    className="w-full border-pink-200 text-pink-700 hover:bg-pink-50"
                  >
                    Continue Shopping
                  </Button>
                </DialogFooter>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <Footer />
    </div>
  );
}