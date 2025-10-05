import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/user-auth";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link, useLocation } from "wouter";
import { ArrowLeft, User, Mail, Phone, Lock, ChevronDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { getFriendlyErrorMessage, isValidEmail, isValidPhone, validatePassword, logError } from "@/lib/error-utils";
import logoPath from "@assets/E_Commerce_Bouquet_Bar_Logo_1757484444893.png";

export default function SignUp() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });
  const [countryCode, setCountryCode] = useState("+91");
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const { login } = useAuth();

  // Helper functions for real-time validation
  const isEmailValid = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const emailDomainRegex = /\.(com|in|org|net|edu|gov|co|io)$/i;
    return emailRegex.test(email) && emailDomainRegex.test(email);
  };

  const isPhoneValid = (phone: string) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone) && !phone.startsWith('0') && !phone.startsWith('1');
  };

  const getPasswordStrength = (password: string) => {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
      noCommon: !['123456', 'password', 'qwerty', 'abc123'].some(pattern => 
        password.toLowerCase().includes(pattern)
      )
    };
    
    const score = Object.values(requirements).filter(Boolean).length;
    return { requirements, score };
  };

  const signupMutation = useMutation({
    mutationFn: async (userData: { firstName: string; lastName: string; email: string; phone: string; password: string }) => {
      try {
        const response = await apiRequest("/api/auth/signup", {
          method: "POST",
          body: JSON.stringify(userData),
        });
        
        // Check if response is ok
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw {
            status: response.status,
            message: errorData.error || errorData.message || "Signup failed"
          };
        }
        
        return response;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: async (response) => {
      try {
        const data = await response.json();
        
        // Validate response data
        if (!data.user) {
          throw new Error("Invalid response from server");
        }
        
        // Save user data in localStorage and context
        login(data.user); // This saves to cookies and sessionStorage
        
        toast({
          title: "Welcome to Bouquet Bar!",
          description: "Your account has been created successfully.",
        });
        
        setLocation("/"); // Redirect to home
      } catch (error) {
        logError(error, "signup success handler");
        toast({
          title: "Account Creation Error",
          description: "Your account was created but there was an issue signing you in. Please try signing in manually.",
          variant: "destructive",
        });
        setLocation("/signin");
      }
    },
    onError: (error: any) => {
      logError(error, "signup");
      
      const friendlyMessage = getFriendlyErrorMessage(error, "signup");
      
      toast({
        title: "Account Creation Failed",
        description: friendlyMessage,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Comprehensive form validation with friendly messages
    if (!formData.firstName.trim()) {
      toast({
        title: "First Name Required",
        description: "Please enter your first name to continue.",
        variant: "destructive",
      });
      return;
    }

    // First name validation - only letters and spaces, min 2 chars
    if (formData.firstName.trim().length < 2) {
      toast({
        title: "Invalid First Name",
        description: "First name must be at least 2 characters long.",
        variant: "destructive",
      });
      return;
    }

    if (!/^[a-zA-Z\s]+$/.test(formData.firstName.trim())) {
      toast({
        title: "Invalid First Name",
        description: "First name should only contain letters and spaces.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.lastName.trim()) {
      toast({
        title: "Last Name Required",
        description: "Please enter your last name to continue.",
        variant: "destructive",
      });
      return;
    }

    // Last name validation - only letters and spaces, min 2 chars
    if (formData.lastName.trim().length < 1) {
      toast({
        title: "Invalid Last Name",
        description: "Last name must be at least 2 characters long.",
        variant: "destructive",
      });
      return;
    }

    if (!/^[a-zA-Z\s]+$/.test(formData.lastName.trim())) {
      toast({
        title: "Invalid Last Name",
        description: "Last name should only contain letters and spaces.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.email.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter your email address to continue.",
        variant: "destructive",
      });
      return;
    }

    // Enhanced email validation - must contain @ and .com/.in/.org etc
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email.trim())) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address (e.g., you@example.com).",
        variant: "destructive",
      });
      return;
    }

    // Check if email contains .com, .in, .org, .net etc
    const emailDomainRegex = /\.(com|in|org|net|edu|gov|co|io)$/i;
    if (!emailDomainRegex.test(formData.email.trim())) {
      toast({
        title: "Invalid Email Domain",
        description: "Please use a valid email domain (e.g., .com, .in, .org).",
        variant: "destructive",
      });
      return;
    }

    if (!formData.phone.trim()) {
      toast({
        title: "Phone Number Required",
        description: "Please enter your phone number to continue.",
        variant: "destructive",
      });
      return;
    }

    // Phone validation - exactly 10 digits, no spaces or special characters
    const phoneRegex = /^[0-9]{10}$/;
    const cleanPhone = formData.phone.replace(/\s/g, ''); // Remove any spaces
    
    if (!phoneRegex.test(cleanPhone)) {
      toast({
        title: "Invalid Phone Number",
        description: "Phone number must be exactly 10 digits with no spaces or special characters.",
        variant: "destructive",
      });
      return;
    }

    // Check if phone starts with valid digits (not 0 or 1)
    if (cleanPhone.startsWith('0') || cleanPhone.startsWith('1')) {
      toast({
        title: "Invalid Phone Number",
        description: "Phone number cannot start with 0 or 1.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.password.trim()) {
      toast({
        title: "Password Required",
        description: "Please create a password to continue.",
        variant: "destructive",
      });
      return;
    }

    // Enhanced password validation
    if (formData.password.length < 8) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length > 50) {
      toast({
        title: "Password Too Long",
        description: "Password must be less than 50 characters long.",
        variant: "destructive",
      });
      return;
    }

    // Check for at least one uppercase letter
    if (!/[A-Z]/.test(formData.password)) {
      toast({
        title: "Password Too Weak",
        description: "Password must contain at least one uppercase letter (A-Z).",
        variant: "destructive",
      });
      return;
    }

    // Check for at least one lowercase letter
    if (!/[a-z]/.test(formData.password)) {
      toast({
        title: "Password Too Weak",
        description: "Password must contain at least one lowercase letter (a-z).",
        variant: "destructive",
      });
      return;
    }

    // Check for at least one number
    if (!/[0-9]/.test(formData.password)) {
      toast({
        title: "Password Too Weak",
        description: "Password must contain at least one number (0-9).",
        variant: "destructive",
      });
      return;
    }

    // Check for at least one special character
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password)) {
      toast({
        title: "Password Too Weak",
        description: "Password must contain at least one special character (!@#$%^&* etc).",
        variant: "destructive",
      });
      return;
    }

    // Check password doesn't contain common weak patterns
    const weakPatterns = ['123456', 'password', 'qwerty', 'abc123', '111111', '000000'];
    if (weakPatterns.some(pattern => formData.password.toLowerCase().includes(pattern))) {
      toast({
        title: "Password Too Weak",
        description: "Password contains common patterns. Please choose a stronger password.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.confirmPassword.trim()) {
      toast({
        title: "Confirm Password Required",
        description: "Please confirm your password.",
        variant: "destructive",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description: "Please make sure both passwords are exactly the same.",
        variant: "destructive",
      });
      return;
    }

    signupMutation.mutate({
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: countryCode + cleanPhone,
      password: formData.password,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Special handling for phone number - only allow digits
    if (name === 'phone') {
      // Remove any non-digit characters and limit to 10 digits
      const cleanValue = value.replace(/\D/g, '').slice(0, 10);
      setFormData({
        ...formData,
        [name]: cleanValue
      });
      return;
    }
    
    // Special handling for first name and last name - only allow letters and spaces
    if (name === 'firstName' || name === 'lastName') {
      // Remove any non-letter characters except spaces
      const cleanValue = value.replace(/[^a-zA-Z\s]/g, '');
      setFormData({
        ...formData,
        [name]: cleanValue
      });
      return;
    }
    
    // Special handling for email - convert to lowercase and remove spaces
    if (name === 'email') {
      const cleanValue = value.toLowerCase().replace(/\s/g, '');
      setFormData({
        ...formData,
        [name]: cleanValue
      });
      return;
    }
    
    // Default handling for other fields
    setFormData({
      ...formData,
      [name]: value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100">
      <div className="flex min-h-screen">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-pink-200/80 via-rose-200/60 to-pink-300/80 relative overflow-hidden">
          <div className="flex flex-col justify-center px-12 relative z-10">
            <div className="mb-8">
              <img src={logoPath} alt="Bouquet Bar Logo" className="h-28 w-auto mb-6" />
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Join Bouquet Bar
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Start your journey in professional floral design and access premium flower collections.
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Shop Premium Flowers</h3>
                  <p className="text-gray-600">Fresh flowers delivered to your door</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center">
                  <Lock className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Premium Access</h3>
                  <p className="text-gray-600">Exclusive courses and flower collections</p>
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
              <img src={logoPath} alt="Bouquet Bar Logo" className="h-24 w-auto mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900">Join Bouquet Bar</h2>
            </div>

            {/* Back Button */}
            <Link href="/">
              <Button variant="ghost" className="mb-6 text-gray-600 hover:text-gray-900" data-testid="button-back">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>

            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold text-gray-900">Create Account</CardTitle>
                <CardDescription className="text-gray-600">
                  Enter your details to join our floral community
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-gray-700 font-medium">First Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="firstName"
                          name="firstName"
                          type="text"
                          required
                          className="pl-10 border-gray-200 focus:border-primary focus:ring-primary/20"
                          placeholder="First name"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          data-testid="input-first-name"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-gray-700 font-medium">Last Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="lastName"
                          name="lastName"
                          type="text"
                          required
                          className="pl-10 border-gray-200 focus:border-primary focus:ring-primary/20"
                          placeholder="Last name"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          data-testid="input-last-name"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700 font-medium">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        className={`pl-10 border-gray-200 focus:border-primary focus:ring-primary/20 ${
                          formData.email && !isEmailValid(formData.email) ? 'border-red-300 focus:border-red-500' : ''
                        } ${
                          formData.email && isEmailValid(formData.email) ? 'border-green-300 focus:border-green-500' : ''
                        }`}
                        placeholder="your.email@example.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        data-testid="input-email"
                      />
                      {formData.email && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          {isEmailValid(formData.email) ? (
                            <span className="text-green-500 text-sm">✓</span>
                          ) : (
                            <span className="text-red-500 text-sm">✗</span>
                          )}
                        </div>
                      )}
                    </div>
                    {formData.email && !isEmailValid(formData.email) && (
                      <p className="text-sm text-red-600">Please enter a valid email with .com, .in, .org etc.</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-gray-700 font-medium">Phone Number</Label>
                    <div className="flex gap-2">
                      <Select value={countryCode} onValueChange={setCountryCode}>
                        <SelectTrigger className="w-[100px] border-gray-200 focus:border-primary">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="+91">+91</SelectItem>
                          <SelectItem value="+1">+1</SelectItem>
                          <SelectItem value="+44">+44</SelectItem>
                          <SelectItem value="+65">+65</SelectItem>
                          <SelectItem value="+971">+971</SelectItem>
                          <SelectItem value="+86">+86</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="relative flex-1">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          required
                          className={`pl-10 border-gray-200 focus:border-primary focus:ring-primary/20 ${
                            formData.phone && !isPhoneValid(formData.phone) ? 'border-red-300 focus:border-red-500' : ''
                          } ${
                            formData.phone && isPhoneValid(formData.phone) ? 'border-green-300 focus:border-green-500' : ''
                          }`}
                          placeholder="0000000000"
                          value={formData.phone}
                          onChange={handleInputChange}
                          data-testid="input-phone"
                          maxLength={10}
                        />
                        {formData.phone && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            {isPhoneValid(formData.phone) ? (
                              <span className="text-green-500 text-sm">✓</span>
                            ) : (
                              <span className="text-red-500 text-sm">✗</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    {formData.phone && !isPhoneValid(formData.phone) && (
                      <p className="text-sm text-red-600">
                        {formData.phone.length !== 10 ? 'Phone must be exactly 10 digits' : 'Phone cannot start with 0 or 1'}
                      </p>
                    )}
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
                        placeholder="Create a strong password"
                        value={formData.password}
                        onChange={handleInputChange}
                        onFocus={() => setShowPasswordRequirements(true)}
                        data-testid="input-password"
                      />
                    </div>
                    {showPasswordRequirements && formData.password && (
                      <div className="mt-2 p-3 bg-gray-50 rounded-lg text-sm">
                        <p className="font-medium text-gray-700 mb-2">Password Requirements:</p>
                        {(() => {
                          const { requirements } = getPasswordStrength(formData.password);
                          return (
                            <div className="space-y-1">
                              <div className={`flex items-center gap-2 ${requirements.length ? 'text-green-600' : 'text-red-600'}`}>
                                <span>{requirements.length ? '✓' : '✗'}</span>
                                <span>At least 8 characters</span>
                              </div>
                              <div className={`flex items-center gap-2 ${requirements.uppercase ? 'text-green-600' : 'text-red-600'}`}>
                                <span>{requirements.uppercase ? '✓' : '✗'}</span>
                                <span>One uppercase letter (A-Z)</span>
                              </div>
                              <div className={`flex items-center gap-2 ${requirements.lowercase ? 'text-green-600' : 'text-red-600'}`}>
                                <span>{requirements.lowercase ? '✓' : '✗'}</span>
                                <span>One lowercase letter (a-z)</span>
                              </div>
                              <div className={`flex items-center gap-2 ${requirements.number ? 'text-green-600' : 'text-red-600'}`}>
                                <span>{requirements.number ? '✓' : '✗'}</span>
                                <span>One number (0-9)</span>
                              </div>
                              <div className={`flex items-center gap-2 ${requirements.special ? 'text-green-600' : 'text-red-600'}`}>
                                <span>{requirements.special ? '✓' : '✗'}</span>
                                <span>One special character (!@#$%^&*)</span>
                              </div>
                              <div className={`flex items-center gap-2 ${requirements.noCommon ? 'text-green-600' : 'text-red-600'}`}>
                                <span>{requirements.noCommon ? '✓' : '✗'}</span>
                                <span>Not a common password</span>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        required
                        className={`pl-10 border-gray-200 focus:border-primary focus:ring-primary/20 ${
                          formData.confirmPassword && formData.password !== formData.confirmPassword ? 'border-red-300 focus:border-red-500' : ''
                        } ${
                          formData.confirmPassword && formData.password === formData.confirmPassword && formData.confirmPassword.length > 0 ? 'border-green-300 focus:border-green-500' : ''
                        }`}
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        data-testid="input-confirm-password"
                      />
                      {formData.confirmPassword && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          {formData.password === formData.confirmPassword ? (
                            <span className="text-green-500 text-sm">✓</span>
                          ) : (
                            <span className="text-red-500 text-sm">✗</span>
                          )}
                        </div>
                      )}
                    </div>
                    {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                      <p className="text-sm text-red-600">Passwords do not match</p>
                    )}
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full text-lg py-3 h-auto font-semibold"
                    disabled={signupMutation.isPending}
                    data-testid="button-signup"
                  >
                    {signupMutation.isPending ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>


                <div className="text-center pt-4 border-t border-gray-100">
                  <p className="text-gray-600">
                    Already have an account?{" "}
                    <Link href="/signin" className="text-primary hover:text-primary/80 font-semibold">
                      Sign In
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