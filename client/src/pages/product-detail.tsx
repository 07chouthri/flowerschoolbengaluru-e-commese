import { useRoute, Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useCart } from "@/hooks/cart-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Heart, Share2, ShoppingCart, Star, Truck, Shield, RotateCcw } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Product } from "@shared/schema";
import ShopNav from './ShopNav';
import Footer from '@/components/footer';
import { useState } from "react";

export default function ProductDetail() {
  const [match, params] = useRoute("/product/:id");
  const productId = params?.id;
  
  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: ["/api/products", productId],
    enabled: !!productId,
  });
  
  const { data: allProducts } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });
  
  const cart = useCart();
  const { toast } = useToast();

  // Add this state at the top of your component
  const [selectedImage, setSelectedImage] = useState(product?.image);

  // Check if user is authenticated
  const { data: user } = useQuery({
    queryKey: ["/api/auth/user"],
  });

  // Check if product is favorited
  const { data: favoriteStatus } = useQuery<{ isFavorited: boolean }>({
    queryKey: ["/api/favorites", productId, "status"],
    queryFn: async () => {
      const response = await apiRequest(`/api/favorites/${productId}/status`);
      return response.json();
    },
    enabled: !!user && !!productId,
  });

  // Add to favorites mutation
  const addToFavoritesMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("/api/favorites", {
        method: "POST",
        body: JSON.stringify({ productId }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/favorites"] });
      queryClient.invalidateQueries({ queryKey: ["/api/favorites", productId, "status"] });
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

  // Remove from favorites mutation
  const removeFromFavoritesMutation = useMutation({
    mutationFn: async () => {
      return apiRequest(`/api/favorites/${productId}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/favorites"] });
      queryClient.invalidateQueries({ queryKey: ["/api/favorites", productId, "status"] });
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

  if (!match || !productId) {
    return <div>Product not found</div>;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
          <Link href="/shop">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Shop
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Enhanced related products algorithm
  const getRelatedProducts = () => {
    if (!allProducts || allProducts.length === 0) return [];
    
    const currentPrice = parseFloat(product.price);
    const priceRange = currentPrice * 0.3; // 30% price tolerance
    
    // Score products based on multiple factors
    const scoredProducts = allProducts
      .filter(p => p.id !== product.id && p.inStock) // Exclude current product and out-of-stock items
      .map(p => {
        let score = 0;
        const productPrice = parseFloat(p.price);
        
        // Factor 1: Same category (highest priority) - 100 points
        if (p.category === product.category) {
          score += 100;
        }
        
        // Factor 2: Similar price range - up to 50 points
        const priceDiff = Math.abs(productPrice - currentPrice);
        if (priceDiff <= priceRange) {
          score += 50 - (priceDiff / priceRange) * 25; // Closer price = higher score
        }
        
        // Factor 3: Featured products get bonus - 25 points
        if (p.featured) {
          score += 25;
        }
        
        // Factor 4: Price tier similarity - 20 points
        const currentTier = currentPrice < 1000 ? 'budget' : currentPrice < 3000 ? 'mid' : 'premium';
        const productTier = productPrice < 1000 ? 'budget' : productPrice < 3000 ? 'mid' : 'premium';
        if (currentTier === productTier) {
          score += 20;
        }
        
        // Factor 5: Alphabetical tiebreaker - small score based on name similarity
        const nameSimilarity = product.name.toLowerCase().split(' ').some(word => 
          p.name.toLowerCase().includes(word) || p.description.toLowerCase().includes(word)
        );
        if (nameSimilarity) {
          score += 10;
        }
        
        return { product: p, score };
      })
      .sort((a, b) => {
        // Primary sort by score (descending)
        if (b.score !== a.score) {
          return b.score - a.score;
        }
        // Secondary sort by price (ascending) for tiebreaker
        return parseFloat(a.product.price) - parseFloat(b.product.price);
      })
      .slice(0, 8) // Get top 8 candidates
      .map(item => item.product);

    // If we don't have enough same-category products, fill with other categories
    if (scoredProducts.length < 4) {
      const additionalProducts = allProducts
        .filter(p => 
          p.id !== product.id && 
          p.inStock && 
          !scoredProducts.find(sp => sp.id === p.id) // Not already included
        )
        .sort((a, b) => {
          // Prefer featured products
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          // Then sort by price similarity
          const aPriceDiff = Math.abs(parseFloat(a.price) - currentPrice);
          const bPriceDiff = Math.abs(parseFloat(b.price) - currentPrice);
          return aPriceDiff - bPriceDiff;
        })
        .slice(0, 4 - scoredProducts.length);
      
      scoredProducts.push(...additionalProducts);
    }
    
    return scoredProducts.slice(0, 4); // Return max 4 products
  };

  const relatedProducts = getRelatedProducts();

  const isInCart = cart.isInCart(product.id);
  const quantity = cart.getItemQuantity(product.id);

  const handleAddToCart = () => {
    cart.addToCart(product, 1);
  };

  const handleSaveForLater = () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save products to your favorites.",
        variant: "destructive",
      });
      return;
    }

    const isFavorited = favoriteStatus?.isFavorited;
    
    if (isFavorited) {
      removeFromFavoritesMutation.mutate();
    } else {
      addToFavoritesMutation.mutate();
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    const title = product.name;
    const text = `Check out this beautiful ${product.name} - ${product.description.slice(0, 100)}...`;

    // Try Web Share API first (mobile/modern browsers)
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url,
        });
        toast({
          title: "Shared successfully",
          description: "Product shared via device sharing options.",
        });
      } catch (error) {
        // User cancelled sharing, don't show error
        console.log("Share cancelled");
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(url);
        toast({
          title: "Link copied",
          description: "Product link copied to clipboard.",
        });
      } catch (error) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        toast({
          title: "Link copied",
          description: "Product link copied to clipboard.",
        });
      }
    }
  };

  const features = [
    "Fresh, hand-picked flowers",
    "Premium quality guarantee", 
    "Expert floral arrangement",
    "Same-day delivery available",
    "Care instructions included",
    "Satisfaction guaranteed"
  ];

  return (
    <>
      <ShopNav />
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
        {/* Navigation */}
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
            <Link href="/" className="hover:text-pink-600">Home</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-pink-600">Shop</Link>
            <span>/</span>
            <span className="text-gray-900">{product.name}</span>
          </div>

          <Button variant="ghost" asChild className="mb-6">
            <Link href="/shop">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Shop
            </Link>
          </Button>
        </div>

        {/* Product Details */}
        <div className="container mx-auto px-4 pb-12">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Product Images Section */}
            <div className="space-y-4">
              <div className="flex gap-4">
                {/* Thumbnail Gallery - Left Side */}
                <div className="w-24 space-y-2">
                  <button
                    onClick={() => setSelectedImage(product.image)}
                    className={`w-full aspect-square rounded-lg overflow-hidden ${
                      selectedImage === product.image ? 'ring-2 ring-pink-500' : 'ring-1 ring-gray-200'
                    }`}
                  >
                    <img
                      src={`data:image/jpeg;base64,${product.image}`}
                      alt={`${product.name} main`}
                      className="w-full h-full object-cover hover:opacity-80 transition-opacity"
                    />
                  </button>
                  
                  {/* Additional Images */}
                  {[
                    product.imagefirst,
                    product.imagesecond,
                    product.imagethirder,
                    product.imagefoure,
                    product.imagefive
                  ].filter(Boolean).map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(image)}
                      className={`w-full aspect-square rounded-lg overflow-hidden ${
                        selectedImage === image ? 'ring-2 ring-pink-500' : 'ring-1 ring-gray-200'
                      }`}
                    >
                      <img
                        src={`data:image/jpeg;base64,${image}`}
                        alt={`${product.name} view ${index + 1}`}
                        className="w-full h-full object-cover hover:opacity-80 transition-opacity"
                      />
                    </button>
                  ))}
                </div>

                {/* Main Image - Right Side */}
                <div className="flex-1 aspect-square rounded-lg overflow-hidden bg-white shadow-lg">
                  <img
                    src={`data:image/jpeg;base64,${product.image||selectedImage}`}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    data-testid="img-product-main"
                  />
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="text-xs">
                    {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                  </Badge>
                  {product.featured && (
                    <Badge className="bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs">
                      Featured
                    </Badge>
                  )}
                </div>
                
                <h1 className="text-3xl font-bold text-gray-900 mb-2" data-testid="text-product-name">
                  {product.name}
                </h1>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="text-sm text-gray-600 ml-2">(127 reviews)</span>
                  </div>
                </div>

                <p className="text-4xl font-bold text-pink-600 mb-6" data-testid="text-product-price">
                  ₹{parseFloat(product.price).toLocaleString()}
                </p>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-700 leading-relaxed" data-testid="text-product-description">
                  {product.description}
                </p>
              </div>

              <Separator />

              {/* Features */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">What's Included</h3>
                <ul className="space-y-2">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-gray-700">
                      <div className="w-1.5 h-1.5 bg-pink-500 rounded-full"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <Separator />

              {/* Actions */}
              <div className="space-y-4">
                {isInCart && quantity > 0 ? (
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => cart.updateQuantity(product.id, quantity - 1)}
                      data-testid="button-decrease-quantity"
                    >
                      -
                    </Button>
                    <span className="font-medium" data-testid="text-quantity">{quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => cart.updateQuantity(product.id, quantity + 1)}
                      data-testid="button-increase-quantity"
                    >
                      +
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => cart.removeFromCart(product.id)}
                      data-testid="button-remove-from-cart"
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <Button
                    size="lg"
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                    data-testid="button-add-to-cart"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    {product.inStock ? "Add to Cart" : "Out of Stock"}
                  </Button>
                )}

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1" 
                    onClick={handleSaveForLater}
                    disabled={addToFavoritesMutation.isPending || removeFromFavoritesMutation.isPending}
                    data-testid="button-save-for-later"
                  >
                    <Heart 
                      className={`w-4 h-4 mr-2 ${favoriteStatus?.isFavorited ? 'fill-pink-500 text-pink-500' : ''}`} 
                    />
                    {favoriteStatus?.isFavorited ? 'Saved' : 'Save for Later'}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1" 
                    onClick={handleShare}
                    data-testid="button-share"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Trust Indicators */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="flex flex-col items-center gap-2">
                  <Truck className="w-6 h-6 text-green-600" />
                  <span className="text-xs text-gray-600">Free Delivery</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Shield className="w-6 h-6 text-blue-600" />
                  <span className="text-xs text-gray-600">Quality Assured</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <RotateCcw className="w-6 h-6 text-purple-600" />
                  <span className="text-xs text-gray-600">Easy Returns</span>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="container mx-auto px-4 pb-16">
              <div className="mt-16">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">You Might Also Like</h2>
                <div className="grid grid-cols-5 gap-4">
                  {relatedProducts.slice(0, 100).map((relatedProduct) => (
                    <Card key={relatedProduct.id} className="group cursor-pointer hover:shadow-lg transition-shadow">
                      <Link href={`/product/${relatedProduct.id}`}>
                        <CardContent className="p-0">
                          <div className="aspect-square overflow-hidden rounded-t-lg">
                            <img
                              src={`data:image/jpeg;base64,${relatedProduct.image}`}
                              alt={relatedProduct.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              loading="lazy"
                            />
                          </div>
                          <div className="p-3">
                            <h3 className="font-medium text-sm text-gray-900 line-clamp-2 min-h-[2.5rem]">
                              {relatedProduct.name}
                            </h3>
                            <p className="text-sm font-bold text-pink-600 mt-1">
                              ₹{parseFloat(relatedProduct.price).toLocaleString()}
                            </p>
                          </div>
                        </CardContent>
                      </Link>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}