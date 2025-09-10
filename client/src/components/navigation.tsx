import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Menu, X, User, UserPlus, LogOut } from "lucide-react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import logoPath from "@assets/E_Commerce_Bouquet_Bar_Logo_1757433847861.png";
import type { User as UserType } from "@shared/schema";

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrollingUp, setIsScrollingUp] = useState(false);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Get current user data
  const { data: user } = useQuery<UserType>({
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

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      // Show nav when at top of page
      if (currentScrollTop <= 50) {
        setIsScrollingUp(false);
      }
      // Hide nav when scrolling up (but not at the very top)
      else if (currentScrollTop < lastScrollTop && currentScrollTop > 50) {
        setIsScrollingUp(true);
      }
      // Show nav when scrolling down
      else if (currentScrollTop > lastScrollTop) {
        setIsScrollingUp(false);
      }
      
      setLastScrollTop(currentScrollTop <= 0 ? 0 : currentScrollTop);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollTop]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav className={`fixed top-0 w-full bg-card/95 backdrop-blur-sm z-50 transition-transform duration-300 ${isScrollingUp ? '-translate-y-full' : 'translate-y-0'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3">
          <div className="flex items-center space-x-3">
            <img src={logoPath} alt="Bouquet Bar Logo" className="h-12 w-auto" />
            <span className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">Bouquet Bar</span>
          </div>
          
          {/* Search Bar - Center */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Birthday Gift"
                className="w-full px-4 py-2 border border-gray-300 rounded-full bg-white/90 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
                data-testid="search-input"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="hidden md:flex space-x-8">
            <button 
              onClick={() => scrollToSection('home')}
              className="text-muted-foreground hover:text-primary transition-colors"
              data-testid="nav-home"
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection('shop')}
              className="text-muted-foreground hover:text-primary transition-colors"
              data-testid="nav-shop"
            >
              Shop
            </button>
            <button 
              onClick={() => scrollToSection('school')}
              className="text-muted-foreground hover:text-primary transition-colors"
              data-testid="nav-school"
            >
              School
            </button>
            <button 
              onClick={() => scrollToSection('gallery')}
              className="text-muted-foreground hover:text-primary transition-colors"
              data-testid="nav-gallery"
            >
              Gallery
            </button>
            <button 
              onClick={() => scrollToSection('blog')}
              className="text-muted-foreground hover:text-primary transition-colors"
              data-testid="nav-blog"
            >
              Blog
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="text-muted-foreground hover:text-primary transition-colors"
              data-testid="nav-contact"
            >
              Contact
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-3">
              {user ? (
                <div className="flex items-center gap-3">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Welcome,</span>
                    <span className="font-semibold text-primary ml-1">
                      {user.firstName || 'User'}!
                    </span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setLocation('/shop')}
                    data-testid="button-account"
                    className="text-pink-600 border border-pink-300 rounded-full px-4 py-1 text-sm hover:bg-pink-50"
                  >
                    Account
                  </Button>
                  <Button 
                    size="sm"
                    onClick={handleLogout}
                    disabled={logoutMutation.isPending}
                    data-testid="button-logout"
                    className="bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full px-4 py-1 text-sm hover:from-pink-600 hover:to-purple-700"
                  >
                    {logoutMutation.isPending ? 'Logging out...' : 'Log Out'}
                  </Button>
                </div>
              ) : (
                <>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => scrollToSection('contact')}
                    data-testid="button-contact"
                    className="text-pink-600 border border-pink-300 rounded-full px-4 py-1 text-sm hover:bg-pink-50"
                  >
                    Contact
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => setLocation('/signin')}
                    data-testid="button-login"
                    className="bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full px-4 py-1 text-sm hover:from-pink-600 hover:to-purple-700"
                  >
                    Login
                  </Button>
                </>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4">
            <div className="flex flex-col space-y-4">
              <button 
                onClick={() => scrollToSection('home')}
                className="text-left text-muted-foreground hover:text-primary transition-colors"
                data-testid="nav-mobile-home"
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection('shop')}
                className="text-left text-muted-foreground hover:text-primary transition-colors"
                data-testid="nav-mobile-shop"
              >
                Shop
              </button>
              <button 
                onClick={() => scrollToSection('school')}
                className="text-left text-muted-foreground hover:text-primary transition-colors"
                data-testid="nav-mobile-school"
              >
                School
              </button>
              <button 
                onClick={() => scrollToSection('gallery')}
                className="text-left text-muted-foreground hover:text-primary transition-colors"
                data-testid="nav-mobile-gallery"
              >
                Gallery
              </button>
              <button 
                onClick={() => scrollToSection('blog')}
                className="text-left text-muted-foreground hover:text-primary transition-colors"
                data-testid="nav-mobile-blog"
              >
                Blog
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className="text-left text-muted-foreground hover:text-primary transition-colors"
                data-testid="nav-mobile-contact"
              >
                Contact
              </button>
              
              {/* Mobile Auth Section */}
              <div className="border-t border-border pt-4 mt-4 space-y-3">
                {user ? (
                  <div className="text-center">
                    <div className="text-sm mb-3">
                      <span className="text-muted-foreground">Welcome,</span>
                      <span className="font-semibold text-primary ml-1">
                        {user.firstName || 'User'}!
                      </span>
                    </div>
                    <div className="space-y-2">
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start" 
                        onClick={() => setLocation('/shop')}
                        data-testid="button-mobile-account"
                      >
                        <User className="w-4 h-4 mr-2" />
                        Account
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start" 
                        onClick={handleLogout}
                        disabled={logoutMutation.isPending}
                        data-testid="button-mobile-logout"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        {logoutMutation.isPending ? 'Logging out...' : 'Log Out'}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start" 
                      onClick={() => setLocation('/signin')}
                      data-testid="button-mobile-signin"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Sign In
                    </Button>
                    <Button 
                      className="w-full" 
                      onClick={() => setLocation('/signup')}
                      data-testid="button-mobile-signup"
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Sign Up
                    </Button>
                  </>
                )}
              </div>
              
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
