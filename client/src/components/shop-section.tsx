import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ShoppingCart, Plus, Eye } from "lucide-react";
import { useCart } from "@/hooks/cart-context";
import { useToast } from "@/hooks/use-toast";
import type { Product, User } from "@shared/schema";

export default function ShopSection() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { toast } = useToast();

  // Cart functionality - now using context, no arguments needed
  const { addToCart } = useCart();

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ['/api/products', selectedCategory === "all" ? "" : selectedCategory],
    queryFn: async () => {
      const response = await fetch(`/api/products${selectedCategory !== "all" ? `?category=${selectedCategory}` : ""}`);
      if (!response.ok) throw new Error('Failed to fetch products');
      return response.json();
    }
  });

  const categories = [
    { id: "all", label: "All" },
    { id: "roses", label: "Roses" },
    { id: "orchids", label: "Orchids" },
    { id: "wedding", label: "Wedding" },
    { id: "gifts", label: "Gifts" },
    { id: "seasonal", label: "Seasonal" },
  ];

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1); // Explicitly pass quantity=1
    toast({
      title: "Added to Cart! 🛒",
      description: `${product.name} has been added to your cart.`,
      duration: 2000,
    });
  };

  return (
    <section id="shop" className="py-24 bg-gradient-to-b from-pink-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-8 tracking-tight">Our Flower Shop</h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto font-light">Premium fresh flowers delivered to your doorstep across Bengaluru</p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "secondary"}
              className="rounded-full"
              onClick={() => setSelectedCategory(category.id)}
              data-testid={`button-category-${category.id}`}
            >
              {category.label}
            </Button>
          ))}
        </div>

        {/* Featured Products Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="card-shadow">
                <div className="w-full h-48 bg-muted animate-pulse rounded-t-xl" />
                <CardContent className="p-6">
                  <div className="h-5 bg-muted rounded mb-2 animate-pulse" />
                  <div className="h-4 bg-muted rounded w-3/4 mb-4 animate-pulse" />
                  <div className="flex items-center justify-between">
                    <div className="h-6 bg-muted rounded w-20 animate-pulse" />
                    <div className="h-9 w-9 bg-muted rounded-lg animate-pulse" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {products.map((product) => (
              <Card 
                key={product.id} 
                className="card-shadow hover:shadow-xl transition-all group overflow-hidden card-hover-lift flower-float cursor-pointer"
                data-testid={`card-product-${product.id}`}
              >
                <Dialog>
                  <DialogTrigger className="w-full text-left">
                    <div className="relative overflow-hidden rounded-t-xl">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500" 
                      />
                      {/* Product overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      {/* View details button */}
                      <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Badge className="bg-blue-500 text-white text-xs backdrop-blur-sm">
                          <Eye className="w-3 h-3 mr-1" />
                          View Details
                        </Badge>
                      </div>
                      
                      {/* Professional badge */}
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Badge className="bg-white/90 text-black text-xs backdrop-blur-sm">Premium</Badge>
                      </div>
                      
                      {/* Shimmer effect */}
                      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700"></div>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-2" data-testid={`text-product-name-${product.id}`}>
                        {product.name}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4" data-testid={`text-product-description-${product.id}`}>
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-primary" data-testid={`text-product-price-${product.id}`}>
                          ₹{parseFloat(product.price).toLocaleString('en-IN')}
                        </span>
                        <div className="flex gap-2">
                          <Button 
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart(product);
                            }}
                            data-testid={`button-add-to-cart-${product.id}`}
                            className="hover:bg-primary/90"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </DialogTrigger>
                  
                  {/* Product Detail Dialog */}
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold">{product.name}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6">
                      <div className="relative overflow-hidden rounded-lg">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-full h-64 object-cover" 
                        />
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                          <p className="text-gray-600 leading-relaxed">{product.description}</p>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-3xl font-bold text-primary">
                              ₹{parseFloat(product.price).toLocaleString('en-IN')}
                            </span>
                            <p className="text-sm text-gray-500 mt-1">Free delivery across Bengaluru</p>
                          </div>
                          <Badge variant="secondary" className="capitalize">{product.category}</Badge>
                        </div>
                        
                        <div className="flex gap-3 pt-4">
                          <Button 
                            className="flex-1" 
                            onClick={() => handleAddToCart(product)}
                            data-testid={`button-add-to-cart-detail-${product.id}`}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add to Cart
                          </Button>
                          <Button variant="outline" className="flex-1">
                            Buy Now
                          </Button>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </Card>
            ))}
          </div>
        )}

        {/* Special Offers Banner */}
        <div className="bg-gradient-to-r from-primary to-secondary text-white p-8 rounded-2xl text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">🌸 Special Offer: 20% OFF on First Order!</h3>
          <p className="text-lg mb-6">Use code FIRSTBLOOM at checkout. Free delivery across Bengaluru.</p>
          <Button 
            variant="secondary" 
            size="lg"
            className="bg-white text-primary hover:bg-gray-100 button-glow"
            data-testid="button-special-offer"
          >
            🛒 Shop Now & Save
          </Button>
        </div>
      </div>
    </section>
  );
}
