import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Link } from "wouter";
import { ArrowLeft, Mail, Lock, ShoppingBag, GraduationCap, Star } from "lucide-react";
import logoPath from "@assets/E_Commerce_Bouquet_Bar_Logo_1757433847861.png";

export default function SignIn() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle signin logic here
    console.log("Sign in form submitted:", formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-pink-50/20 to-green-50/20">
      <div className="flex min-h-screen">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/10 to-secondary/10 relative overflow-hidden">
          <div className="flex flex-col justify-center px-12 relative z-10">
            <div className="mb-8">
              <img src={logoPath} alt="Bouquet Bar Logo" className="h-20 w-auto mb-6" />
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Welcome Back
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Access your account to continue your floral journey with premium courses and flower collections.
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Shop Premium Flowers</h3>
                  <p className="text-gray-600">Fresh flowers delivered to your door</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Continue Learning</h3>
                  <p className="text-gray-600">Access your enrolled courses</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                  <Star className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Track Progress</h3>
                  <p className="text-gray-600">Monitor your learning journey</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 py-12 lg:px-12">
          <div className="w-full max-w-md mx-auto">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8">
              <img src={logoPath} alt="Bouquet Bar Logo" className="h-16 w-auto mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
            </div>

            {/* Back Button */}
            <Link href="/">
              <Button variant="ghost" className="mb-6 text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>

            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold text-gray-900">Sign In</CardTitle>
                <CardDescription className="text-gray-600">
                  Enter your credentials to access your account
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700 font-medium">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        className="pl-10 border-gray-200 focus:border-primary focus:ring-primary/20"
                        placeholder="your.email@example.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        data-testid="input-email"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        required
                        className="pl-10 border-gray-200 focus:border-primary focus:ring-primary/20"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleInputChange}
                        data-testid="input-password"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 text-primary focus:ring-primary/20 border-gray-300 rounded"
                        data-testid="checkbox-remember"
                      />
                      <Label htmlFor="remember-me" className="ml-2 text-sm text-gray-700">
                        Remember me
                      </Label>
                    </div>

                    <div className="text-sm">
                      <button
                        type="button"
                        className="text-primary hover:text-primary/80 font-medium"
                        data-testid="link-forgot-password"
                      >
                        Forgot password?
                      </button>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3"
                    data-testid="button-signin"
                  >
                    Sign In
                  </Button>
                </form>

                <div className="text-center pt-4 border-t border-gray-100">
                  <p className="text-gray-600">
                    Don't have an account?{" "}
                    <Link href="/signup" className="text-primary hover:text-primary/80 font-semibold">
                      Create account
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}