import { Switch, Route, Link } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import SignupPage from "@/pages/signup";
import SigninPage from "@/pages/signin";
import ShopPage from "@/pages/shop";
import SchoolPage from "@/pages/school";
import { useAuth } from "@/hooks/useAuth";
import { User, LogOut, ShoppingBag, GraduationCap, Home as HomeIcon } from "lucide-react";

function Navigation() {
  const { user, signout } = useAuth();

  return (
    <nav className="bg-background/80 backdrop-blur-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2" data-testid="link-home">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">BB</span>
            </div>
            <span className="font-bold text-lg">Bouquet Bar</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="flex items-center space-x-2 hover:text-primary transition-colors" data-testid="nav-home">
              <HomeIcon className="h-4 w-4" />
              <span>Home</span>
            </Link>
            <Link to="/shop" className="flex items-center space-x-2 hover:text-primary transition-colors" data-testid="nav-shop">
              <ShoppingBag className="h-4 w-4" />
              <span>Shop</span>
            </Link>
            <Link to="/school" className="flex items-center space-x-2 hover:text-primary transition-colors" data-testid="nav-school">
              <GraduationCap className="h-4 w-4" />
              <span>School</span>
            </Link>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium" data-testid="text-user-name">
                    {user.firstName || 'User'}
                  </span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => signout.mutate()}
                  data-testid="button-signout"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/signin">
                  <Button variant="ghost" size="sm" data-testid="button-signin">
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm" data-testid="button-signup">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

function Router() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/signin" component={SigninPage} />
          <Route path="/signup" component={SignupPage} />
          <Route path="/shop" component={ShopPage} />
          <Route path="/school" component={SchoolPage} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
