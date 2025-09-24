import React, { useRef } from "react";
import { useLocation } from "wouter";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Import post images
import Post1 from "../CategoryImages/Flower5.jpg";
import Post2 from "../CategoryImages/Post2.png";
import Post3 from "../CategoryImages/Post3.png";
import Post4 from "../CategoryImages/Post4.png";
import Post5 from "../CategoryImages/Post5.png";

interface PostFileProps {
  // You can add props here if needed in the future
}

const PostFile: React.FC<PostFileProps> = () => {
  const [, setLocation] = useLocation();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const posts = [
    { 
      id: 1, 
      image: Post1, 
      alt: "Beautiful Flower Arrangement",
      category: "Premium Arrangements",
      subcategory: "Luxury Bouquets"
    },
    { 
      id: 2, 
      image: Post2, 
      alt: "Elegant Bouquet",
      category: "Bouquets",
      subcategory: "Elegant Designs"
    },
    { 
      id: 3, 
      image: Post3, 
      alt: "Colorful Floral Display",
      category: "Colorful Flowers",
      subcategory: "Vibrant Arrangements"
    },
    { 
      id: 4, 
      image: Post4, 
      alt: "Modern Flower Design",
      category: "Modern Arrangements",
      subcategory: "Contemporary Designs"
    },
    { 
      id: 5, 
      image: Post5, 
      alt: "Seasonal Flower Collection",
      category: "Seasonal Flowers",
      subcategory: "Current Season"
    },
  ];

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -400, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 400, behavior: 'smooth' });
    }
  };

  const handlePostClick = (post: typeof posts[0]) => {
    // Navigate to ProductsListing with category and subcategory parameters
    setLocation(`/products?category=${encodeURIComponent(post.category)}&subcategory=${encodeURIComponent(post.subcategory)}`);
  };

  return (
    <div className="relative">
      {/* Left scroll button */}
      <button 
        onClick={scrollLeft}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
        aria-label="Scroll left"
      >
        <ChevronLeft className="w-5 h-5 text-gray-700" />
      </button>
      
      {/* Scroll container */}
      <div 
        ref={scrollContainerRef}
        className="flex overflow-x-auto scrollbar-hide space-x-6 py-6 px-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {posts.map((post) => (
          <div 
            key={post.id} 
            className="flex-shrink-0 w-[550px] h-[300px] rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
            onClick={() => handlePostClick(post)}
          >
            <img 
              src={post.image} 
              alt={post.alt}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        ))}
      </div>
      
      {/* Right scroll button */}
      <button 
        onClick={scrollRight}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
        aria-label="Scroll right"
      >
        <ChevronRight className="w-5 h-5 text-gray-700" />
      </button>

      {/* CSS for scrollbar hiding */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default PostFile;