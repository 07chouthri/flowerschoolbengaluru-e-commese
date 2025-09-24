import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

// Import images for each category
import BirthdayImg from "../CategoryImages/BoxArrangements.jpg";
import BouquetImg from "../CategoryImages/DoorFlower.jpg";
import TulipsImg from "../CategoryImages/Teddy.jpg";
import GiftComboImg from "../CategoryImages/Vase&Bowl Arrangements.jpg";
import WeddingDecorImg from "../CategoryImages/Special&CreativePieces.jpg";
import SameDayDeliveryImg from "../CategoryImages/LilyArrangements.jpg";
import MemorialImg from "../CategoryImages/MixedFlower.jpg";
import CorporateImg from "../CategoryImages/Roses.jpg";
import PostFile from "./PostFileProps";
import { useLocation } from "wouter";

interface SubCategoryGroup {
  title: string;
  items: string[];
}

interface Category {
  id: string;
  name: string;
  groups: SubCategoryGroup[];
  image: string;
  imageAlt: string;
}

const allCategories: Category[] = [
  {
    id: "occasion",
    name: "Occasion",
    image: BirthdayImg,
    imageAlt: "Birthday Flowers",
    groups: [
      {
        title: "Celebration Flowers",
        items: [
          "Birthday Flowers",
          "Anniversary Flowers",
          "Wedding Flowers",
          "Valentine's Day Flowers",
          "Mother's Day Flowers",
          "Get Well Soon Flowers",
          "Congratulations Flowers",
        ]
      },
      {
        title: "Special Occasions",
        items: [
          "Sympathy & Funeral Flowers",
          "New Baby Flowers",
          "Graduation Flowers",
          "Housewarming Flowers",
          "Retirement Flowers",
          "Christmas Flowers",
          "New Year Flowers",
        ]
      }
    ]
  },
  {
    id: "arrangements",
    name: "Arrangement",
    image: BouquetImg,
    imageAlt: "Bouquets",
    groups: [
      {
        title: "Popular Arrangements",
        items: [
          "Bouquets (hand-tied, wrapped)",
          "Flower Baskets",
          "Flower Boxes",
          "Vase Arrangements",
          "Floral Centerpieces",
          "Flower Garlands",
          "Lobby Arrangements",
        ]
      },
      {
        title: "Specialty Arrangements",
        items: [
          "Exotic Arrangements",
          "Floral Cross Arrangement",
          "Baby's Breath Arrangement",
          "Gladiolus Arrangement",
          "Wine Bottle Arrangements",
          "Floral Wreaths",
          "Custom Arrangements",
        ]
      }
    ]
  },
  {
    id: "flower-types",
    name: "Flowers",
    image: TulipsImg,
    imageAlt: "Tulips",
    groups: [
      {
        title: "Popular Flowers",
        items: [
          "Tulips",
          "Lilies",
          "Carnations",
          "Orchids",
          "Sunflowers",
          "Mixed Flowers",
          "Roses",
        ]
      },
      {
        title: "Specialty Flowers",
        items: [
          "Baby's Breath",
          "Chrysanthemum",
          "Hydrangea",
          "Anthurium",
          "Calla Lilies",
          "Gerberas",
          "Peonies",
        ]
      }
    ]
  },
  {
    id: "gift-combo",
    name: "Gifts",
    image: GiftComboImg,
    imageAlt: "Gift Combos",
    groups: [
      {
        title: "Flower Combos",
        items: [
          "Flowers with Greeting Cards",
          "Flower with Fruits",
          "Floral Gift Hampers",
          "Flower with Chocolates",
          "Flower with Cakes",
          "Flowers with Cheese",
          "Flowers with Nuts",
        ]
      },
      {
        title: "Special Gift Sets",
        items: [
          "Flowers with Customized Gifts",
          "Flowers with Wine",
          "Flowers with Perfume",
          "Flowers with Jewelry",
          "Flowers with Teddy Bears",
          "Flowers with Scented Candles",
          "Flowers with Personalized Items",
        ]
      }
    ]
  },
  {
    id: "event-decoration",
    name: "Event/Venue ",
    image: WeddingDecorImg,
    imageAlt: "Wedding Decor",
    groups: [
      {
        title: "Event Decorations",
        items: [
          "Wedding Floral Decor",
          "Corporate Event Flowers",
          "Party Flower Decorations",
          "Stage & Backdrop Flowers",
          "Car Decoration Flowers",
          "Temple / Pooja Flowers",
          "Birthday Decorations",
        ]
      },
      {
        title: "Venue Arrangements",
        items: [
          "Entrance Arrangements",
          "Table Centerpieces",
          "Aisle Decorations",
          "Archway Flowers",
          "Ceiling Installations",
          "Wall Decorations",
          "Outdoor Event Flowers",
        ]
      }
    ]
  },
  {
    id: "services",
    name: "Services",
    image: SameDayDeliveryImg,
    imageAlt: "Same Day Delivery",
    groups: [
      {
        title: "Delivery Services",
        items: [
          "Same-Day Flower Delivery",
          "Next Day Delivery",
          "Customized Message Cards",
          "Floral Subscriptions Weekly/monthly",
          "International Delivery",
          "Express Delivery",
          "Scheduled Delivery",
        ]
      },
      {
        title: "Additional Services",
        items: [
          "Flower Arrangement Workshops",
          "Custom Bouquet Design",
          "Event Florist Services",
          "Floral Consultation",
          "Wedding Florist Services",
          "Corporate Account Services",
          "Subscription Services",
        ]
      }
    ]
  },
  {
    id: "memorial",
    name: "Memorial/Sympathy",
    image: MemorialImg,
    imageAlt: "Memorial Flowers",
    groups: [
      {
        title: "Sympathy Arrangements",
        items: [
          "Pet Memorial Flowers",
          "Funeral Wreaths",
          "Condolence Bouquets",
          "Remembrance Flowers",
          "Memorial Sprays",
          "Casket Arrangements",
          "Sympathy Hearts",
        ]
      },
      {
        title: "Memorial Services",
        items: [
          "Funeral Home Delivery",
          "Church Arrangements",
          "Graveside Flowers",
          "Memorial Service Flowers",
          "Sympathy Gift Baskets",
          "Living Tributes",
          "Memorial Donations",
        ]
      }
    ]
  },
  {
    id: "corporate",
    name: "Corporate",
    image: CorporateImg,
    imageAlt: "Corporate Flowers",
    groups: [
      {
        title: "Office Arrangements",
        items: [
          "Office Desk Flowers",
          "Reception Area Flowers",
          "Corporate Gifting Flowers",
          "Brand-Themed Floral Arrangements",
          "Conference Room Flowers",
          "Executive Office Arrangements",
          "Lobby Displays",
        ]
      },
      {
        title: "Corporate Services",
        items: [
          "Corporate Accounts",
          "Volume Discounts",
          "Regular Maintenance",
          "Custom Corporate Designs",
          "Event Floristry Services",
          "Branded Arrangements",
          "Long-term Contracts",
        ]
      }
    ]
  }
];


const CategoryCard: React.FC<{ 
  category: Category | null; 
  isVisible: boolean;
  position: { left: number; width: number; } | null;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onItemClick: (item: string, categoryId: string) => void;
}> = ({ category, isVisible, position, onMouseEnter, onMouseLeave, onItemClick }) => {
  if (!category) return null;

  return (
    <div
      className={`
        absolute left-1/2 -translate-x-1/2 mt-2
        w-[1000px] bg-white border border-gray-200 rounded-md shadow-xl z-50 p-4
        transition-all duration-500 ease-out
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-6 pointer-events-none"}
      `}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="flex justify-center items-start gap-8">
        {/* Subcategory lists */}
        <div className="flex gap-8">
          {category.groups.map((group, i) => (
            <div
              key={i}
              className={`space-y-4 p-4 rounded-md ${
                i === 0 ? "bg-pink-50 border border-pink-200" : ""
              }`}
            >
              <h4 className="text-sm font-semibold text-gray-800 border-b border-gray-200 pb-2">
                {group.title}
              </h4>
              <ul className="space-y-3">
                {group.items.map((item, index) => (
                  <li key={index}>
                    <a
                      href="#"
                      className="block text-xs text-gray-700 hover:text-pink-600 transition-colors duration-200"
                      onClick={(e) => {
                        e.preventDefault();
                        onItemClick(item, category.id);
                      }}
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Image on the right */}
        <div className="w-80">
          <div className="relative rounded-md group/image h-full cursor-pointer border border-gray-200">
            <img
              src={category.image}
              alt={category.imageAlt}
              className="w-full h-full object-cover transition-transform duration-500 group-hover/image:scale-110"
            />
            <div className="absolute inset-0 bg-black/15 flex items-center justify-center">
              <span className="text-white text-lg font-semibold text-center px-2">
                {category.imageAlt}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


const FlowerCategory: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showCard, setShowCard] = useState(false);
  const [position, setPosition] = useState<{ left: number; width: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [, setLocation] = useLocation();
  // Find the active category data
  const activeCategoryData = allCategories.find(cat => cat.id === activeCategory) || null;


 const handleItemClick = (item: string, categoryId: string) => {
  window.location.href = `/products?category=${encodeURIComponent(categoryId)}&subcategory=${encodeURIComponent(item)}`;
};

  
  const handleCategoryClick = (categoryId: string) => {
  window.location.href = `/products?category=${encodeURIComponent(categoryId.toLowerCase())}`;
};


  const renderItems = (items: string[], categoryId: string) => {
    return items.map((item, index) => (
      <li key={index}>
        <a
          href="#"
          className="block text-xs text-gray-700 hover:text-pink-600 transition-colors duration-200"
          onClick={(e) => {
            e.preventDefault();
            handleItemClick(item, categoryId);
          }}
        >
          {item}
        </a>
      </li>
    ));
  };

  const handleMouseEnter = (categoryId: string, event: React.MouseEvent) => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    setActiveCategory(categoryId);
    setShowCard(true);
    
    // Calculate position for the card to be centered
    if (containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      setPosition({
        left: containerRect.left,
        width: containerRect.width
      });
    }
  };

  const handleMouseLeave = () => {
    // Set a timeout to hide the card after a short delay
    timeoutRef.current = setTimeout(() => {
      setShowCard(false);
      setActiveCategory(null);
      setPosition(null);
    }, 300);
  };

useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleCardMouseEnter = () => {
    // Clear the timeout when mouse enters the card
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const handleCardMouseLeave = () => {
    // Set a timeout to hide the card when mouse leaves the card
    timeoutRef.current = setTimeout(() => {
      setShowCard(false);
      setActiveCategory(null);
      setPosition(null);
    }, 300);
  };

  return (
    <div className="bg-white border-b border-gray-200 py-5 relative" ref={containerRef}>
      <div className="flex justify-center space-x-8 px-8 mx-auto max-w-7xl relative">
        {allCategories.map((category) => (
          <div
            key={category.id}
            className="relative group"
            onMouseEnter={(e) => handleMouseEnter(category.id, e)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleCategoryClick(category.id)}
          >
            {/* Main tab */}
            <button className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 hover:text-pink-600 transition-colors duration-200">
              {category.name}
              {activeCategory === category.id ? (
                <ChevronUp className="w-4 h-4 transition-transform duration-200" />
              ) : (
                <ChevronDown className="w-4 h-4 transition-transform duration-200" />
              )}
            </button>
          </div>
        ))}
      </div>
      
      {/* Common Card that appears for all categories */}
      <div className="absolute left-0 w-full" style={{ top: '100%' }}>
              {showCard && activeCategory && (
        <CategoryCard 
          category={activeCategoryData} 
          isVisible={showCard} 
          position={position} 
          onMouseEnter={handleCardMouseEnter}
          onMouseLeave={handleCardMouseLeave}
             onItemClick={handleItemClick}
        />
           )}
      </div>

    </div>
  );
};

export default FlowerCategory;