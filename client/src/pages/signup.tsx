import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema, type InsertUser } from "@shared/schema";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Loader2, User, Mail, Lock, UserCheck } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [, setLocation] = useLocation();
  const { signup } = useAuth();
  const { toast } = useToast();

  const form = useForm<InsertUser>({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      userType: "customer",
    },
  });

  const onSubmit = async (data: InsertUser) => {
    try {
      await signup.mutateAsync(data);
      toast({
        title: "Welcome to Bouquet Bar!",
        description: "Your account has been created successfully.",
      });
      setLocation("/");
    } catch (error: any) {
      const errorMessage = error?.message || "Failed to create account";
      toast({
        title: "Signup Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Join Bouquet Bar
          </h1>
          <p className="text-muted-foreground">
            Create your account to start your floral journey
          </p>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl text-center">Sign Up</CardTitle>
            <CardDescription className="text-center">
              Enter your information to create your account
            </CardDescription>
          </CardHeader>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" data-testid="label-firstName">First Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="firstName"
                      data-testid="input-firstName"
                      placeholder="John"
                      className="pl-10"
                      {...form.register("firstName")}
                    />
                  </div>
                  {form.formState.errors.firstName && (
                    <p className="text-sm text-destructive" data-testid="error-firstName">
                      {form.formState.errors.firstName.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" data-testid="label-lastName">Last Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="lastName"
                      data-testid="input-lastName"
                      placeholder="Doe"
                      className="pl-10"
                      {...form.register("lastName")}
                    />
                  </div>
                  {form.formState.errors.lastName && (
                    <p className="text-sm text-destructive" data-testid="error-lastName">
                      {form.formState.errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" data-testid="label-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="email"
                    data-testid="input-email"
                    type="email"
                    placeholder="john@example.com"
                    className="pl-10"
                    {...form.register("email")}
                  />
                </div>
                {form.formState.errors.email && (
                  <p className="text-sm text-destructive" data-testid="error-email">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>

              {/* User Type Field */}
              <div className="space-y-2">
                <Label htmlFor="userType" data-testid="label-userType">I'm interested in</Label>
                <div className="relative">
                  <UserCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 z-10" />
                  <Select 
                    defaultValue="customer" 
                    onValueChange={(value) => form.setValue("userType", value)}
                  >
                    <SelectTrigger className="pl-10" data-testid="select-userType">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="customer">Buying flowers & arrangements</SelectItem>
                      <SelectItem value="student">Learning floral design</SelectItem>
                      <SelectItem value="both">Both shopping and courses</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {form.formState.errors.userType && (
                  <p className="text-sm text-destructive" data-testid="error-userType">
                    {form.formState.errors.userType.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" data-testid="label-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="password"
                    data-testid="input-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="pl-10 pr-10"
                    {...form.register("password")}
                  />
                  <button
                    type="button"
                    data-testid="button-toggle-password"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {form.formState.errors.password && (
                  <p className="text-sm text-destructive" data-testid="error-password">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" data-testid="label-confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="confirmPassword"
                    data-testid="input-confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    className="pl-10 pr-10"
                    {...form.register("confirmPassword")}
                  />
                  <button
                    type="button"
                    data-testid="button-toggle-confirmPassword"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {form.formState.errors.confirmPassword && (
                  <p className="text-sm text-destructive" data-testid="error-confirmPassword">
                    {form.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Submit Error */}
              {signup.error && (
                <Alert variant="destructive" data-testid="alert-signup-error">
                  <AlertDescription>
                    {(signup.error as any)?.message || "Failed to create account"}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                data-testid="button-submit"
                className="w-full"
                disabled={signup.isPending}
              >
                {signup.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
              <div className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link 
                  to="/signin" 
                  className="font-medium text-primary hover:underline"
                  data-testid="link-signin"
                >
                  Sign in
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}