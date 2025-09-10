import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link, useLocation } from "wouter";
import { ArrowLeft, Phone, ShoppingBag, GraduationCap, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import logoPath from "@assets/E_Commerce_Bouquet_Bar_Logo_1757433847861.png";

export default function SignIn() {
  const [formData, setFormData] = useState({
    phone: "",
    otp: ""
  });
  const [countryCode, setCountryCode] = useState("+91");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const sendOtpMutation = useMutation({
    mutationFn: async (phone: string) => {
      return await apiRequest("/api/auth/send-login-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
    },
    onSuccess: () => {
      toast({
        title: "OTP Sent! 📱",
        description: "Check your phone for the verification code.",
      });
      setStep("otp");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send OTP",
        variant: "destructive",
      });
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: async (data: { phone: string; otp: string }) => {
      return await apiRequest("/api/auth/verify-login-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    },
    onSuccess: (data) => {
      toast({
        title: "Welcome back! 🎉",
        description: "You have successfully signed in.",
      });
      setLocation("/");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Invalid OTP",
        variant: "destructive",
      });
    },
  });

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.phone) {
      toast({
        title: "Error",
        description: "Please enter your phone number",
        variant: "destructive",
      });
      return;
    }

    const fullPhone = countryCode + formData.phone;
    sendOtpMutation.mutate(fullPhone);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.otp || formData.otp.length !== 6) {
      toast({
        title: "Error",
        description: "Please enter the 6-digit OTP",
        variant: "destructive",
      });
      return;
    }

    const fullPhone = countryCode + formData.phone;
    verifyOtpMutation.mutate({
      phone: fullPhone,
      otp: formData.otp,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
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
              <img src={logoPath} alt="Bouquet Bar Logo" className="h-24 w-auto mx-auto mb-4" />
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
                  Enter your phone number to receive an OTP
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {step === "phone" ? (
                  <form onSubmit={handleSendOtp} className="space-y-5">
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
                          </SelectContent>
                        </Select>
                        <div className="relative flex-1">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            required
                            className="pl-10 border-gray-200 focus:border-primary focus:ring-primary/20"
                            placeholder="98765 43210"
                            value={formData.phone}
                            onChange={handleInputChange}
                            data-testid="input-phone"
                          />
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        We'll send you a verification code via SMS
                      </p>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full font-semibold py-3 text-lg"
                      disabled={sendOtpMutation.isPending}
                      data-testid="button-send-otp"
                    >
                      {sendOtpMutation.isPending ? "Sending OTP..." : "Send OTP"}
                    </Button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="space-y-5">
                    <div className="text-center space-y-2">
                      <h3 className="text-lg font-semibold text-gray-900">Verify Your Phone</h3>
                      <p className="text-sm text-gray-600">
                        Enter the 6-digit code sent to {countryCode} {formData.phone}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="otp" className="text-gray-700 font-medium">Verification Code</Label>
                      <Input
                        id="otp"
                        name="otp"
                        type="text"
                        maxLength={6}
                        required
                        className="text-center text-lg tracking-widest border-gray-200 focus:border-primary focus:ring-primary/20"
                        placeholder="000000"
                        value={formData.otp}
                        onChange={handleInputChange}
                        data-testid="input-otp"
                      />
                    </div>

                    <div className="space-y-3">
                      <Button 
                        type="submit" 
                        className="w-full font-semibold py-3 text-lg"
                        disabled={verifyOtpMutation.isPending}
                        data-testid="button-verify-otp"
                      >
                        {verifyOtpMutation.isPending ? "Verifying..." : "Verify & Sign In"}
                      </Button>

                      <Button 
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          setStep("phone");
                          setFormData({ phone: formData.phone, otp: "" });
                        }}
                        data-testid="button-change-phone"
                      >
                        Change Phone Number
                      </Button>
                    </div>

                    <div className="text-center">
                      <button
                        type="button"
                        className="text-sm text-primary hover:text-primary/80 font-medium"
                        onClick={() => sendOtpMutation.mutate(countryCode + formData.phone)}
                        disabled={sendOtpMutation.isPending}
                        data-testid="button-resend-otp"
                      >
                        {sendOtpMutation.isPending ? "Sending..." : "Resend OTP"}
                      </button>
                    </div>
                  </form>
                )}


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