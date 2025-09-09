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
    <nav className="bg-background border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3" data-testid="link-home">
            <img 
              src="/attached_assets/E_Commerce_Bouquet_Bar_Logo_1757433847861.png" 
              alt="Bouquet Bar Logo" 
              className="h-12 w-auto"
            />
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-muted-foreground hover:text-foreground transition-colors font-medium"
              data-testid="nav-home"
            >
              Home
            </Link>
            <Link 
              to="/shop" 
              className="text-muted-foreground hover:text-foreground transition-colors font-medium"
              data-testid="nav-shop"
            >
              Shop
            </Link>
            <Link 
              to="/school" 
              className="text-muted-foreground hover:text-foreground transition-colors font-medium"
              data-testid="nav-school"
            >
              School
            </Link>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <span className="text-sm font-medium text-foreground" data-testid="text-user-name">
                    {user.firstName || 'User'}
                  </span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => signout.mutate()}
                  data-testid="button-signout"
                >
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
