import { useEffect, useState } from 'react';

// Logo-based floating petals animation
export function LogoFloatingPetals() {
  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {/* Animated flower petals based on logo colors */}
      <div className="absolute top-10 left-10 w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full blur-sm animate-float-petal delay-0"></div>
      <div className="absolute top-20 right-20 w-6 h-6 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full blur-sm animate-float-petal delay-1000"></div>
      <div className="absolute top-1/3 left-1/4 w-10 h-10 bg-gradient-to-br from-orange-300 to-orange-500 rounded-full blur-sm animate-float-petal delay-500"></div>
      <div className="absolute bottom-1/4 right-1/4 w-12 h-12 bg-gradient-to-br from-teal-300 to-teal-500 rounded-full blur-sm animate-float-petal delay-700"></div>
      <div className="absolute bottom-10 left-10 w-9 h-9 bg-gradient-to-br from-orange-500 to-orange-700 rounded-full blur-sm animate-float-petal delay-300"></div>
      <div className="absolute top-2/3 right-10 w-7 h-7 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full blur-sm animate-float-petal delay-800"></div>
    </div>
  );
}

// Logo-inspired scroll reveal animations
export function ScrollRevealElements() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {/* Logo-inspired geometric shapes that move with scroll */}
      <div 
        className="absolute top-20 left-20 w-20 h-20 bg-gradient-to-br from-orange-400/30 to-orange-600/30 rounded-2xl rotate-45 blur-sm"
        style={{ transform: `translateY(${scrollY * 0.1}px) rotate(${45 + scrollY * 0.05}deg)` }}
      ></div>
      <div 
        className="absolute top-1/3 right-32 w-16 h-16 bg-gradient-to-br from-teal-400/40 to-teal-600/40 rounded-full blur-sm"
        style={{ transform: `translateY(${scrollY * -0.08}px)` }}
      ></div>
      <div 
        className="absolute bottom-1/4 left-1/3 w-24 h-24 bg-gradient-to-br from-orange-300/25 to-orange-500/25 rounded-3xl rotate-12 blur-sm"
        style={{ transform: `translateY(${scrollY * 0.12}px) rotate(${12 + scrollY * -0.03}deg)` }}
      ></div>
      <div 
        className="absolute bottom-32 right-20 w-18 h-18 bg-gradient-to-br from-teal-300/35 to-teal-500/35 rounded-xl blur-sm"
        style={{ transform: `translateY(${scrollY * -0.06}px)` }}
      ></div>
    </div>
  );
}

// Enhanced logo-based scroll indicator
export function LogoScrollIndicator() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Main scroll progress bar */}
      <div className="fixed top-0 left-0 w-full h-2 bg-gradient-to-r from-gray-100 to-gray-200 z-50">
        <div 
          className="h-full bg-gradient-to-r from-orange-500 via-orange-400 to-teal-500 transition-all duration-300 relative overflow-hidden"
          style={{ width: `${scrollProgress}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
        </div>
      </div>
      
      {/* Floating scroll progress circle */}
      <div className="fixed bottom-8 right-8 z-50">
        <div className="relative w-16 h-16">
          <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              className="text-gray-200"
            />
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 28}`}
              strokeDashoffset={`${2 * Math.PI * 28 * (1 - scrollProgress / 100)}`}
              className="text-orange-500 transition-all duration-300"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-bold text-orange-500">{Math.round(scrollProgress)}%</span>
          </div>
        </div>
      </div>
    </>
  );
}

// Logo-themed section dividers with animations
export function LogoSectionDivider({ variant = 'floral' }: { variant?: 'floral' | 'petals' | 'geometric' }) {
  const patterns = {
    floral: "M0,32L48,37.3C96,43,192,53,288,58.7C384,64,480,64,576,58.7C672,53,768,43,864,48C960,53,1056,75,1152,80C1248,85,1344,75,1392,69.3L1440,64L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z",
    petals: "M0,20L60,25C120,30,240,40,360,45C480,50,600,50,720,45C840,40,960,30,1080,25C1200,20,1320,20,1380,20L1440,20L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z",
    geometric: "M0,40L80,35C160,30,320,20,480,25C640,30,800,50,960,55C1120,60,1280,50,1360,45L1440,40L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"
  };

  return (
    <div className="relative w-full h-20 overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-50 via-teal-50 to-orange-50 animate-gradient-x"></div>
      
      {/* SVG pattern overlay */}
      <svg 
        className="absolute bottom-0 w-full h-full" 
        viewBox="0 0 1440 80" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="dividerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgb(249 115 22)" stopOpacity="0.3"/>
            <stop offset="50%" stopColor="rgb(20 184 166)" stopOpacity="0.4"/>
            <stop offset="100%" stopColor="rgb(249 115 22)" stopOpacity="0.3"/>
          </linearGradient>
        </defs>
        <path 
          fill="url(#dividerGradient)"
          d={patterns[variant]}
          className="animate-wave"
        ></path>
      </svg>
      
      {/* Floating logo-inspired elements */}
      <div className="absolute inset-0 flex items-center justify-center space-x-8">
        <div className="w-4 h-4 bg-orange-400/40 rounded-full animate-bounce delay-0"></div>
        <div className="w-3 h-3 bg-teal-400/40 rounded-full animate-bounce delay-200"></div>
        <div className="w-5 h-5 bg-orange-300/40 rounded-full animate-bounce delay-400"></div>
        <div className="w-3 h-3 bg-teal-300/40 rounded-full animate-bounce delay-600"></div>
      </div>
    </div>
  );
}

// Creative hover cards
export function CreativeCard({ 
  children, 
  className = '', 
  glowColor = 'pink' 
}: { 
  children: React.ReactNode;
  className?: string;
  glowColor?: 'pink' | 'purple' | 'blue';
}) {
  const glowClasses = {
    pink: 'hover:shadow-orange-500/25',
    purple: 'hover:shadow-teal-500/25', 
    blue: 'hover:shadow-orange-400/25'
  };

  return (
    <div className={`
      group relative overflow-hidden rounded-xl bg-white/80 backdrop-blur-sm 
      border border-gray-200/50 transition-all duration-500 hover:scale-105 
      hover:shadow-2xl ${glowClasses[glowColor]} hover:-translate-y-2 ${className}
    `}>
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

// Creative button with enhanced animations
export function CreativeButton({ 
  children, 
  onClick, 
  variant = 'primary',
  className = '',
  ...props 
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'accent';
  className?: string;
  [key: string]: any;
}) {
  const variants = {
    primary: 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white',
    secondary: 'bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white',
    accent: 'bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white'
  };

  return (
    <button 
      onClick={onClick}
      className={`
        relative px-8 py-3 rounded-xl font-semibold transition-all duration-300 
        transform hover:scale-105 hover:shadow-lg hover:-translate-y-1
        ${variants[variant]} ${className}
      `}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
    </button>
  );
}