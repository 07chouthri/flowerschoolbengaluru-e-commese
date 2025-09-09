import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import logoPath from "@assets/E_Commerce_Bouquet_Bar_Logo_1757433847861.png";

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { totalItems } = useCart();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav className="fixed top-0 w-full bg-card/95 backdrop-blur-sm z-50 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-2">
            <img src={logoPath} alt="Bouquet Bar Logo" className="h-10 w-auto" />
            <span className="text-xl font-bold text-foreground">Bouquet Bar</span>
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
            <Button className="hidden md:flex items-center" data-testid="button-cart">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Cart ({totalItems})
            </Button>
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
              <Button className="w-full mt-4" data-testid="button-mobile-cart">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Cart ({totalItems})
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
