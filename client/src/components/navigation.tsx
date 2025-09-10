import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Menu, X, User, UserPlus } from "lucide-react";
import { Link } from "wouter";
import logoPath from "@assets/E_Commerce_Bouquet_Bar_Logo_1757433847861.png";

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrollingUp, setIsScrollingUp] = useState(false);
  const [lastScrollTop, setLastScrollTop] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      if (currentScrollTop > lastScrollTop && currentScrollTop > 100) {
        // Scrolling down
        setIsScrollingUp(false);
      } else if (currentScrollTop < lastScrollTop) {
        // Scrolling up
        setIsScrollingUp(true);
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
    <nav className={`fixed top-0 w-full bg-card/95 backdrop-blur-sm z-50 border-b border-border transition-transform duration-300 ${isScrollingUp ? '-translate-y-full' : 'translate-y-0'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-3">
            <img src={logoPath} alt="Bouquet Bar Logo" className="h-14 w-auto logo-pulse flower-float" />
            <span className="text-2xl font-bold gradient-text">Bouquet Bar</span>
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
              <Link href="/signin">
                <Button variant="ghost" className="text-sm" data-testid="button-signin">
                  <User className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="text-sm button-glow bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-500 hover:to-pink-600" data-testid="button-signup">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Sign Up
                </Button>
              </Link>
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
          <div className="md:hidden py-4 border-t border-border">
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
              
              {/* Mobile Auth Buttons */}
              <div className="border-t border-border pt-4 mt-4 space-y-3">
                <Link href="/signin">
                  <Button variant="ghost" className="w-full justify-start" data-testid="button-mobile-signin">
                    <User className="w-4 h-4 mr-2" />
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="w-full button-glow bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-500 hover:to-pink-600" data-testid="button-mobile-signup">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Sign Up
                  </Button>
                </Link>
              </div>
              
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
