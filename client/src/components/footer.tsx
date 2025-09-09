import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Instagram, Youtube, MessageCircle, Facebook } from "lucide-react";
import logoPath from "@assets/E_Commerce_Bouquet_Bar_Logo_1757433847861.png";

export default function Footer() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Newsletter subscription logic would go here
    console.log('Newsletter subscription submitted');
  };

  return (
    <footer className="bg-muted mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Brand Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <img 
              src={logoPath} 
              alt="Bouquet Bar Logo" 
              className="h-16 w-auto" 
            />
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            India's premier floral design institute & online flower marketplace. 
            Creating beautiful moments with fresh flowers and professional floral education.
          </p>
        </div>
        
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Social Media */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-foreground">Connect With Us</h4>
            <div className="flex space-x-4 justify-center md:justify-start">
              <button 
                className="bg-background hover:bg-accent p-3 rounded-full transition-colors"
                data-testid="link-instagram"
              >
                <Instagram className="w-5 h-5 text-muted-foreground" />
              </button>
              <button 
                className="bg-background hover:bg-accent p-3 rounded-full transition-colors"
                data-testid="link-youtube"
              >
                <Youtube className="w-5 h-5 text-muted-foreground" />
              </button>
              <button 
                className="bg-background hover:bg-accent p-3 rounded-full transition-colors"
                data-testid="link-whatsapp"
              >
                <MessageCircle className="w-5 h-5 text-muted-foreground" />
              </button>
              <button 
                className="bg-background hover:bg-accent p-3 rounded-full transition-colors"
                data-testid="link-facebook"
              >
                <Facebook className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-foreground">Quick Links</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <button 
                  onClick={() => scrollToSection('home')} 
                  className="hover:text-foreground transition-colors"
                  data-testid="footer-link-home"
                >
                  Home
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('shop')} 
                  className="hover:text-foreground transition-colors"
                  data-testid="footer-link-shop"
                >
                  Shop
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('school')} 
                  className="hover:text-foreground transition-colors"
                  data-testid="footer-link-school"
                >
                  School
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('about')} 
                  className="hover:text-foreground transition-colors"
                  data-testid="footer-link-about"
                >
                  About
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('gallery')} 
                  className="hover:text-foreground transition-colors"
                  data-testid="footer-link-gallery"
                >
                  Gallery
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('blog')} 
                  className="hover:text-foreground transition-colors"
                  data-testid="footer-link-blog"
                >
                  Blog
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('contact')} 
                  className="hover:text-foreground transition-colors"
                  data-testid="footer-link-contact"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Shop Categories */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-foreground">Shop Categories</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><button className="hover:text-foreground transition-colors" data-testid="footer-category-roses">Fresh Roses</button></li>
              <li><button className="hover:text-foreground transition-colors" data-testid="footer-category-orchids">Orchids</button></li>
              <li><button className="hover:text-foreground transition-colors" data-testid="footer-category-wedding">Wedding Flowers</button></li>
              <li><button className="hover:text-foreground transition-colors" data-testid="footer-category-gifts">Gift Bouquets</button></li>
              <li><button className="hover:text-foreground transition-colors" data-testid="footer-category-seasonal">Seasonal Collections</button></li>
              <li><button className="hover:text-foreground transition-colors" data-testid="footer-category-corporate">Corporate Orders</button></li>
            </ul>
          </div>

          {/* Policies */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-foreground">Policies & Info</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><button className="hover:text-foreground transition-colors" data-testid="footer-policy-refund">Refund Policy</button></li>
              <li><button className="hover:text-foreground transition-colors" data-testid="footer-policy-shipping">Shipping Info</button></li>
              <li><button className="hover:text-foreground transition-colors" data-testid="footer-policy-privacy">Privacy Policy</button></li>
              <li><button className="hover:text-foreground transition-colors" data-testid="footer-policy-terms">Terms of Service</button></li>
              <li><button className="hover:text-foreground transition-colors" data-testid="footer-policy-course">Course Terms</button></li>
              <li><button className="hover:text-foreground transition-colors" data-testid="footer-policy-career">Career Opportunities</button></li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-border pt-8 mb-8">
          <div className="max-w-md mx-auto text-center">
            <h4 className="text-xl font-semibold mb-4 text-foreground">Stay Updated</h4>
            <p className="text-muted-foreground mb-6">Subscribe to get updates on new flowers, courses, and special offers</p>
            <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="flex-1"
                data-testid="input-newsletter-email"
              />
              <Button 
                type="submit"
                data-testid="button-newsletter-subscribe"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-border pt-8 text-center">
          <p className="text-muted-foreground">
            &copy; 2024 <span className="text-foreground font-semibold">Bouquet Bar Bengaluru</span>. All rights reserved.
          </p>
          <p className="text-muted-foreground mt-2">Spreading beauty, one flower at a time</p>
        </div>
      </div>
    </footer>
  );
}
