import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Search, 
  MapPin, 
  ShoppingCart, 
  User, 
  Heart,
  Gift,
  Calendar,
  Star,
  Filter,
  ChevronDown,
  Phone
} from "lucide-react";
import { Link } from "wouter";

export default function Shop() {
  const [searchQuery, setSearchQuery] = useState("");

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
      <div className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Location and User Actions */}
          <div className="flex items-center justify-between py-3 border-b">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-6 h-4 bg-green-500 rounded-sm flex items-center justify-center">
                <div className="w-3 h-2 bg-orange-500 rounded-full"></div>
              </div>
              <span className="font-medium">Deliver to</span>
              <span className="font-bold">Tamilnadu</span>
              <ChevronDown className="w-4 h-4" />
              <span className="text-gray-600 ml-2">Salem, Tamilnadu, 636114</span>
            </div>
            
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Same Day</span>
              </div>
              <span>INR</span>
              <span>Corporate</span>
              <div className="flex items-center gap-1">
                <ShoppingCart className="w-4 h-4" />
                <span>Cart</span>
              </div>
              <span>VASU CHOU...</span>
              <span>More</span>
            </div>
          </div>
          
          {/* Main Navigation */}
          <div className="flex items-center justify-between py-4">
            <Link href="/" className="flex items-center gap-3">
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
              <Button variant="outline" size="sm" data-testid="button-contact">
                <Phone className="w-4 h-4 mr-2" />
                Contact
              </Button>
              <Button size="sm" data-testid="button-login">
                <User className="w-4 h-4 mr-2" />
                Login
              </Button>
            </div>
          </div>
          
          {/* Category Navigation */}
          <div className="flex items-center gap-8 py-4 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category}
                className="whitespace-nowrap text-gray-700 hover:text-primary font-medium flex items-center gap-1 hover-elevate px-3 py-2 rounded-md"
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
              <Card key={index} className="overflow-hidden hover-elevate" data-testid={`card-category-${index}`}>
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

      {/* Pick Their Fav Flowers */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8">Pick Their Fav Flowers</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {flowerProducts.map((product, index) => (
              <Card key={index} className="overflow-hidden hover-elevate" data-testid={`card-product-${index}`}>
                <div className="relative">
                  <img 
                    src={product.image}
                    alt={product.title}
                    className="w-full h-64 object-cover"
                  />
                  <button className="absolute top-4 right-4 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center">
                    <Heart className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">{product.title}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-primary">{product.price}</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600">{product.rating}</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4" data-testid={`button-add-cart-${index}`}>
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
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
    </div>
  );
}