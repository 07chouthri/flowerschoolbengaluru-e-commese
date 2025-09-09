import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShoppingCart, Heart, Search, Filter, Star } from "lucide-react";
import type { Product } from "@shared/schema";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

export default function ShopPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cart, setCart] = useState<string[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const { toast } = useToast();

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products", selectedCategory !== "all" ? selectedCategory : ""],
    staleTime: 5 * 60 * 1000,
  });

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = [
    { value: "all", label: "All Flowers" },
    { value: "roses", label: "Roses" },
    { value: "orchids", label: "Orchids" },
    { value: "wedding", label: "Wedding" },
    { value: "seasonal", label: "Seasonal" },
  ];

  const addToCart = (productId: string, productName: string) => {
    if (!cart.includes(productId)) {
      setCart([...cart, productId]);
      toast({
        title: "Added to Cart",
        description: `${productName} has been added to your cart.`,
      });
    }
  };

  const toggleWishlist = (productId: string, productName: string) => {
    if (wishlist.includes(productId)) {
      setWishlist(wishlist.filter(id => id !== productId));
      toast({
        title: "Removed from Wishlist",
        description: `${productName} has been removed from your wishlist.`,
      });
    } else {
      setWishlist([...wishlist, productId]);
      toast({
        title: "Added to Wishlist",
        description: `${productName} has been added to your wishlist.`,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-rose-50/20 to-emerald-50/20">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="aspect-square bg-muted rounded-t-lg"></div>
                <CardContent className="p-4 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-full"></div>
                  <div className="h-6 bg-muted rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-rose-50/20 to-emerald-50/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Flower Shop
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our collection of fresh, beautiful flowers perfect for every occasion. 
            From romantic roses to elegant orchids, we have everything to brighten your day.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-4 mb-8"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search flowers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              data-testid="input-search"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="text-muted-foreground h-4 w-4" />
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px]" data-testid="select-category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" data-testid="badge-cart-count">
              Cart: {cart.length}
            </Badge>
            <Badge variant="outline" data-testid="badge-wishlist-count">
              <Heart className="h-3 w-3 mr-1" />
              {wishlist.length}
            </Badge>
          </div>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="group hover:shadow-lg transition-all duration-300 hover-elevate">
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="aspect-square object-cover w-full group-hover:scale-105 transition-transform duration-300"
                    data-testid={`img-product-${product.id}`}
                  />
                  {product.featured && (
                    <Badge className="absolute top-2 left-2 bg-primary">
                      Featured
                    </Badge>
                  )}
                  <button
                    onClick={() => toggleWishlist(product.id, product.name)}
                    data-testid={`button-wishlist-${product.id}`}
                    className={`absolute top-2 right-2 p-2 rounded-full transition-colors ${
                      wishlist.includes(product.id)
                        ? "bg-rose-500 text-white"
                        : "bg-white/80 text-foreground hover:bg-white"
                    }`}
                  >
                    <Heart className="h-4 w-4" />
                  </button>
                </div>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg" data-testid={`text-name-${product.id}`}>
                        {product.name}
                      </CardTitle>
                      <div className="flex items-center gap-1 mt-1">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className="h-3 w-3 fill-yellow-400 text-yellow-400"
                            />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">(4.8)</span>
                      </div>
                    </div>
                    <Badge 
                      variant={product.inStock ? "secondary" : "destructive"}
                      data-testid={`badge-stock-${product.id}`}
                    >
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="mb-3" data-testid={`text-description-${product.id}`}>
                    {product.description}
                  </CardDescription>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary" data-testid={`text-price-${product.id}`}>
                      ₹{parseFloat(product.price).toLocaleString()}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {product.category}
                    </Badge>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button
                    className="w-full"
                    disabled={!product.inStock || cart.includes(product.id)}
                    onClick={() => addToCart(product.id, product.name)}
                    data-testid={`button-add-to-cart-${product.id}`}
                  >
                    {cart.includes(product.id) ? (
                      "Added to Cart"
                    ) : (
                      <>
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-muted-foreground text-lg" data-testid="text-no-products">
              No products found matching your criteria.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}