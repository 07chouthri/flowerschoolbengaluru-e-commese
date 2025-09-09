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
    <footer className="bg-foreground text-background section-padding">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img 
                src={logoPath} 
                alt="Bouquet Bar Logo" 
                className="h-8 w-auto brightness-0 invert" 
              />
              <span className="text-xl font-bold">Bouquet Bar</span>
            </div>
            <p className="text-gray-400">India's premier floral design institute & online flower marketplace in Bengaluru.</p>
            <div className="flex space-x-4">
              <button 
                className="text-gray-400 hover:text-primary transition-colors"
                data-testid="link-instagram"
              >
                <Instagram className="w-5 h-5" />
              </button>
              <button 
                className="text-gray-400 hover:text-primary transition-colors"
                data-testid="link-youtube"
              >
                <Youtube className="w-5 h-5" />
              </button>
              <button 
                className="text-gray-400 hover:text-secondary transition-colors"
                data-testid="link-whatsapp"
              >
                <MessageCircle className="w-5 h-5" />
              </button>
              <button 
                className="text-gray-400 hover:text-primary transition-colors"
                data-testid="link-facebook"
              >
                <Facebook className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <button 
                  onClick={() => scrollToSection('home')} 
                  className="hover:text-primary transition-colors"
                  data-testid="footer-link-home"
                >
                  Home
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('shop')} 
                  className="hover:text-primary transition-colors"
                  data-testid="footer-link-shop"
                >
                  Shop
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('school')} 
                  className="hover:text-primary transition-colors"
                  data-testid="footer-link-school"
                >
                  School
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('about')} 
                  className="hover:text-primary transition-colors"
                  data-testid="footer-link-about"
                >
                  About
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('gallery')} 
                  className="hover:text-primary transition-colors"
                  data-testid="footer-link-gallery"
                >
                  Gallery
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('blog')} 
                  className="hover:text-primary transition-colors"
                  data-testid="footer-link-blog"
                >
                  Blog
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('contact')} 
                  className="hover:text-primary transition-colors"
                  data-testid="footer-link-contact"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Shop Categories */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Shop Categories</h4>
            <ul className="space-y-2 text-gray-400">
              <li><button className="hover:text-primary transition-colors" data-testid="footer-category-roses">Fresh Roses</button></li>
              <li><button className="hover:text-primary transition-colors" data-testid="footer-category-orchids">Orchids</button></li>
              <li><button className="hover:text-primary transition-colors" data-testid="footer-category-wedding">Wedding Flowers</button></li>
              <li><button className="hover:text-primary transition-colors" data-testid="footer-category-gifts">Gift Bouquets</button></li>
              <li><button className="hover:text-primary transition-colors" data-testid="footer-category-seasonal">Seasonal Collections</button></li>
              <li><button className="hover:text-primary transition-colors" data-testid="footer-category-corporate">Corporate Orders</button></li>
            </ul>
          </div>

          {/* Policies */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Policies & Info</h4>
            <ul className="space-y-2 text-gray-400">
              <li><button className="hover:text-primary transition-colors" data-testid="footer-policy-refund">Refund Policy</button></li>
              <li><button className="hover:text-primary transition-colors" data-testid="footer-policy-shipping">Shipping Info</button></li>
              <li><button className="hover:text-primary transition-colors" data-testid="footer-policy-privacy">Privacy Policy</button></li>
              <li><button className="hover:text-primary transition-colors" data-testid="footer-policy-terms">Terms of Service</button></li>
              <li><button className="hover:text-primary transition-colors" data-testid="footer-policy-course">Course Terms</button></li>
              <li><button className="hover:text-primary transition-colors" data-testid="footer-policy-career">Career Opportunities</button></li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-gray-700 pt-8 mb-8">
          <div className="max-w-md">
            <h4 className="text-lg font-semibold mb-4">Stay Updated</h4>
            <p className="text-gray-400 mb-4">Subscribe to get updates on new flowers, courses, and special offers</p>
            <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 focus:ring-primary focus:border-primary"
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
        <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Bouquet Bar Bengaluru. All rights reserved. | Designed with 💝 for flower lovers</p>
        </div>
      </div>
    </footer>
  );
}
