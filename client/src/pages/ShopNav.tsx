import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Phone, ShoppingCart, User, LogOut } from "lucide-react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useCart } from "@/hooks/cart-context";
import logoPath from "@assets/E_Commerce_Bouquet_Bar_Logo_1757433847861.png";
import type { User as UserType } from "@shared/schema";
import FlowerCategory from "./FlowerCategory";

export default function ShopNav() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showCartModal, setShowCartModal] = useState(false);
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [animatedText, setAnimatedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(100);
  const animationRef = useRef<NodeJS.Timeout | null>(null);

  const { data: user } = useQuery<UserType>({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  const { totalItems } = useCart();

  const logoutMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("/api/auth/signout", { method: "POST" });
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/auth/user"], null);
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      queryClient.invalidateQueries({ queryKey: ["/api/auth"] });
      toast({
        title: "Logged out successfully",
        description: "You have been signed out.",
      });
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

  const handleLogout = () => logoutMutation.mutate();

  // Categories for search animation
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
  }, [animatedText, isDeleting, categoryIndex, categories, searchQuery]);

  // Clear animation when user focuses on input or starts typing
  const handleInputFocus = () => {
    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }
  };

  return (
    <>
      <nav className="bg-white shadow-md border-b border-gray-100 py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img
              src={logoPath}
              alt="Bouquet Bar Logo"
              className="w-20 h-auto"
            />
            <div className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              Bouquet Bar
            </div>
          </div>

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
          <div className="flex items-center gap-6 relative">
            {/* Cart Icon with Tooltip */}
            <div className="relative group">
              <ShoppingCart className="w-6 h-6 mr-3 cursor-pointer" />
              {/* Cart Count */}
              {totalItems > 0 && (
                <Badge className="absolute -top-2 -right-2 min-w-5 h-5 flex items-center justify-center text-xs bg-pink-600 text-white">
                  {totalItems}
                </Badge>
              )}
              {/* Tooltip */}
              <span className="absolute left-1/2 -translate-x-1/2 mt-2 text-xs text-gray-700 whitespace-nowrap opacity-0 group-hover:opacity-100 transition duration-200">
                Cart
              </span>
            </div>

            {/* Phone Icon with Tooltip */}
            <div className="relative group">
              <Phone className="w-6 h-6 mr-2 cursor-pointer" />
              {/* Tooltip */}
              <span className="absolute left-1/2 -translate-x-1/2 mt-2 text-xs text-gray-900 whitespace-nowrap opacity-0 group-hover:opacity-100 transition duration-200">
                Call Us
              </span>
            </div>

            {/* User Account / Login */}
            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700 font-medium">
                  Hello, {user.firstname || "User"}!
                </span>
                <Button
                  size="sm"
                  onClick={() => setLocation("/my-account")}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl shadow-md hover:shadow-lg hover:opacity-90 transition-all duration-200"
                >
                  <User className="w-4 h-4 mr-2" />
                  Account
                </Button>
                <Button
                  size="sm"
                  onClick={handleLogout}
                  disabled={logoutMutation.isPending}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl shadow-md hover:shadow-lg hover:opacity-90 transition-all duration-200"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  {logoutMutation.isPending ? "Logging out..." : "Log Out"}
                </Button>
              </div>
            ) : (
              <Button
                size="sm"
                onClick={() => setLocation("/signin")}
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl shadow-md hover:shadow-lg hover:opacity-90 transition-all duration-200"
              >
                <User className="w-5 h-5 mr-1" />
                Login
              </Button>
            )}
          </div>
        </div>
      </nav>
        <FlowerCategory />
      {/* Lightweight line block at the end */}
      <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent w-full"></div>
    </>
  );
}