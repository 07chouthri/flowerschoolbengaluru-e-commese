import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
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
  LogOut
} from "lucide-react";
import { Link } from "wouter";
import Footer from "@/components/footer";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import bouquetBarLogo from "@assets/E_Commerce_Bouquet_Bar_Logo_1757433847861.png";
import { type Product, type User } from "@shared/schema";
import { useCart } from "@/hooks/use-cart";

export default function Shop() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [showInStockOnly, setShowInStockOnly] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { addToCart, totalItems, isInCart, getItemQuantity } = useCart();
  
  // Get products data
  const { data: products = [], isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });
  
  // Filter and sort products based on search, category, price, and stock
  const filteredProducts = products
    .filter((product: Product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "all" || 
                             product.category.toLowerCase() === selectedCategory.toLowerCase();
      const productPrice = parseFloat(product.price);
      const matchesPrice = productPrice >= priceRange[0] && productPrice <= priceRange[1];
      const matchesStock = !showInStockOnly || product.inStock;
      return matchesSearch && matchesCategory && matchesPrice && matchesStock;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return parseFloat(a.price) - parseFloat(b.price);
        case "price-high":
          return parseFloat(b.price) - parseFloat(a.price);
        case "name":
        default:
          return a.name.localeCompare(b.name);
      }
    });

  // Handle add to cart with toast notification
  const handleAddToCart = (product: Product) => {
    addToCart(product);
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
  
  // Get current user data
  const { data: user } = useQuery<User>({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

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
      window.location.href = "/";
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

  const categories = [
    "Birthday", "Occasions", "Anniversary", "Flowers", "Cakes", 
    "Personalised", "Plants", "Chocolates", "Luxe", "Combos", 
    "Lifestyle", "International", "On Trend"
  ];

  const heroSections = [
    {
      title: "Make Birthdays Unforgettable",
      subtitle: "Surprise them with thoughtful gifts",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      buttonText: "ORDER NOW",
      bgColor: "from-purple-900 to-purple-700"
    },
    {
      title: "Floral Gifts in Full Bloom",
      subtitle: "Fabulous arrangements for life's special moments",
      image: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      buttonText: "ORDER NOW",
      bgColor: "from-pink-50 to-white"
    },
    {
      title: "Send Gifts 'I Miss You'",
      subtitle: "Make them feel loved from miles away",
      image: "https://images.unsplash.com/photo-1606041008023-472dfb5e530f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      buttonText: "ORDER NOW",
      bgColor: "from-green-100 to-white"
    }
  ];

  const giftCategories = [
    {
      title: "PERSONALISED MUGS",
      image: "https://images.unsplash.com/photo-1514228742587-6b1558fcf93d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
      color: "bg-blue-500"
    },
    {
      title: "GIFT JEWELLERY", 
      image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
      color: "bg-amber-500"
    },
    {
      title: "GIFT LOVE",
      image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200", 
      color: "bg-red-500"
    },
    {
      title: "BIRTHDAY GIFTS",
      image: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
      color: "bg-purple-500"
    },
    {
      title: "ANNIVERSARY GIFTS",
      image: "https://images.unsplash.com/photo-1511988617509-a57c8a288659?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
      color: "bg-green-500"
    },
    {
      title: "SEND CAKES",
      image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
      color: "bg-orange-500"
    }
  ];

  const flowerProducts = [
    {
      title: "Red Roses Bouquet",
      image: "https://images.unsplash.com/photo-1455659817273-f2fd8e6c4787?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
      price: "₹899",
      rating: 4.8
    },
    {
      title: "Mixed Flower Arrangement",
      image: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
      price: "₹1,299",
      rating: 4.9
    },
    {
      title: "Elegant White Lilies",
      image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
      price: "₹1,099",
      rating: 4.7
    },
    {
      title: "Colorful Gerbera Mix",
      image: "https://images.unsplash.com/photo-1587814962239-f38e37d8bbf8?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
      price: "₹799",
      rating: 4.6
    },
    {
      title: "Premium Orchid Basket",
      image: "https://images.unsplash.com/photo-1606041008023-472dfb5e530f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
      price: "₹1,599",
      rating: 4.9
    },
    {
      title: "Purple Flower Bouquet",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
      price: "₹999",
      rating: 4.8
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
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
            
            <div className="flex-1 max-w-lg mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Birthday Gift"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-3 w-full border-2 border-gray-200 rounded-lg focus:border-primary"
                  data-testid="input-search"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" className="relative" data-testid="button-cart">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Cart
                {totalItems > 0 && (
                  <Badge className="absolute -top-2 -right-2 min-w-5 h-5 flex items-center justify-center text-xs">
                    {totalItems}
                  </Badge>
                )}
              </Button>
              <Button variant="outline" size="sm" data-testid="button-contact">
                <Phone className="w-4 h-4 mr-2" />
                Contact
              </Button>
              {user ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700 font-medium">
                    Hello, {user.firstName || 'User'}!
                  </span>
                  <Button variant="outline" size="sm" data-testid="button-account">
                    <UserIcon className="w-4 h-4 mr-2" />
                    Account
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleLogout}
                    disabled={logoutMutation.isPending}
                    data-testid="button-logout"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    {logoutMutation.isPending ? 'Logging out...' : 'Log Out'}
                  </Button>
                </div>
              ) : (
                <Link href="/signin">
                  <Button size="sm" data-testid="button-login">
                    <UserIcon className="w-4 h-4 mr-2" />
                    Login
                  </Button>
                </Link>
              )}
            </div>
          </div>
          
          {/* Category Navigation */}
          <div className="flex items-center gap-8 py-4 overflow-x-auto">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`whitespace-nowrap font-medium flex items-center gap-1 hover-elevate px-3 py-2 rounded-md ${
                selectedCategory === "all" ? "text-primary bg-primary/10" : "text-gray-700 hover:text-primary"
              }`}
              data-testid="button-category-all"
            >
              All Categories
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category.toLowerCase())}
                className={`whitespace-nowrap font-medium flex items-center gap-1 hover-elevate px-3 py-2 rounded-md ${
                  selectedCategory === category.toLowerCase() ? "text-primary bg-primary/10" : "text-gray-700 hover:text-primary"
                }`}
                data-testid={`button-category-${category.toLowerCase()}`}
              >
                {category}
                <ChevronDown className="w-4 h-4" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Hero Section with 3 Promotional Banners */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-6">
            {heroSections.map((section, index) => (
              <Card key={index} className="overflow-hidden hover-elevate">
                <div className={`bg-gradient-to-r ${section.bgColor} p-8 text-center relative`}>
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold mb-2 text-gray-900">
                      {section.title}
                    </h3>
                    <p className="text-gray-600 mb-6">{section.subtitle}</p>
                    <Button 
                      className="font-semibold"
                      onClick={() => {
                        // Scroll to products section
                        document.querySelector('#products-section')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      data-testid={`button-hero-${index}`}
                    >
                      {section.buttonText}
                    </Button>
                  </div>
                  <div className="absolute inset-0 opacity-20">
                    <img 
                      src={section.image} 
                      alt={section.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Advanced Filters */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-900">Filters:</span>
              </div>
              
              {/* Sort By */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Sort by:</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40" data-testid="select-sort">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name A-Z</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Price Range:</label>
                <div className="flex items-center gap-3 w-48">
                  <span className="text-sm text-gray-600">₹{priceRange[0]}</span>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={2000}
                    step={50}
                    className="flex-1"
                    data-testid="slider-price-range"
                  />
                  <span className="text-sm text-gray-600">₹{priceRange[1]}</span>
                </div>
              </div>

              {/* In Stock Only */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="inStock"
                  checked={showInStockOnly}
                  onChange={(e) => setShowInStockOnly(e.target.checked)}
                  className="rounded border-gray-300"
                  data-testid="checkbox-in-stock"
                />
                <label htmlFor="inStock" className="text-sm font-medium text-gray-700">
                  In Stock Only
                </label>
              </div>

              {/* Clear Filters */}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearFilters}
                data-testid="button-clear-filters"
              >
                Clear All
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Search Gifts Quicker Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-1">
              <h2 className="text-3xl font-bold mb-8 flex items-center gap-2">
                Search Gifts Quicker ⚡
              </h2>
              
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-6 text-center hover-elevate" data-testid="card-occasion">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-lg bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
                    <img 
                      src="https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
                      alt="Party"
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                  </div>
                  <p className="font-medium text-gray-700">Occasion</p>
                </Card>
                
                <Card className="p-6 text-center hover-elevate" data-testid="card-gift-type">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                    <img 
                      src="https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
                      alt="Gift"
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                  </div>
                  <p className="font-medium text-gray-700">Gift Type</p>
                </Card>
              </div>
            </div>
            
            <div className="lg:col-span-2">
              <div className="relative rounded-full bg-gradient-to-r from-green-100 to-blue-100 p-8">
                <img 
                  src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"
                  alt="Gift searching illustration"
                  className="w-full h-72 object-cover rounded-full"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl text-center">
                    <Gift className="w-12 h-12 mx-auto mb-4 text-primary" />
                    <h3 className="text-xl font-bold text-gray-900">Find Perfect Gifts</h3>
                    <p className="text-gray-600">Quick & Easy Search</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gift Categories */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {giftCategories.map((category, index) => (
              <Card 
                key={index} 
                className="overflow-hidden hover-elevate cursor-pointer" 
                onClick={() => {
                  // Set search query based on category title
                  const searchTerm = category.title.toLowerCase().includes('gift') ? 'gift' : 
                                   category.title.toLowerCase().includes('birthday') ? 'birthday' :
                                   category.title.toLowerCase().includes('anniversary') ? 'anniversary' :
                                   category.title.toLowerCase().includes('cake') ? 'cake' : '';
                  setSearchQuery(searchTerm);
                  document.querySelector('#products-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                data-testid={`card-category-${index}`}
              >
                <div className="relative h-32">
                  <img 
                    src={category.image}
                    alt={category.title}
                    className="w-full h-full object-cover"
                  />
                  <div className={`absolute inset-0 ${category.color} opacity-80 flex items-end`}>
                    <div className="p-3 text-white">
                      <h4 className="font-bold text-sm">{category.title}</h4>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products-section" className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">
              {searchQuery ? `Search Results for "${searchQuery}"` : 
               selectedCategory === "all" ? "All Products" : 
               `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Products`}
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
                      src={product.image}
                      alt={product.name}
                      className="w-full h-64 object-cover"
                    />
                    <button className="absolute top-4 right-4 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover-elevate">
                      <Heart className="w-4 h-4 text-gray-600" />
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
                    <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xl font-bold text-primary">₹{product.price}</span>
                      <Badge variant="outline" className="text-xs">
                        {product.category}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      {isInCart(product.id) ? (
                        <div className="flex items-center justify-between w-full">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleAddToCart(product)}
                            disabled={!product.inStock}
                            className="flex-1"
                            data-testid={`button-add-more-${product.id}`}
                          >
                            Add More ({getItemQuantity(product.id)})
                          </Button>
                          <Badge variant="secondary" className="ml-2">
                            In Cart
                          </Badge>
                        </div>
                      ) : (
                        <Button 
                          className="w-full" 
                          onClick={() => handleAddToCart(product)}
                          disabled={!product.inStock}
                          data-testid={`button-add-cart-${product.id}`}
                        >
                          {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                        </Button>
                      )}
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

      {/* Footer */}
      <Footer />
    </div>
  );
}