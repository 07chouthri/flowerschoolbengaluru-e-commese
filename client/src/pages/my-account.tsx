import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { User, Edit3, Trash2, Camera, MapPin, Phone, Mail, Globe, Save, X, Settings, Shield, Heart, ShoppingBag, HelpCircle, MessageCircle, Package, Calendar, Truck } from "lucide-react";
import { Link } from "wouter";
import AddressManager from "@/components/address-manager";

// Profile form schema
const profileFormSchema = z.object({
  firstName: z.string().min(1, "First name is required").optional(),
  lastName: z.string().min(1, "Last name is required").optional(),
  phone: z.string().min(10, "Phone number must be at least 10 digits").optional(),
  defaultAddress: z.string().optional(),
  deliveryAddress: z.string().optional(),
  country: z.string().optional(),
  state: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileFormSchema>;

// Password change form schema
const passwordFormSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Please confirm your new password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "New passwords don't match",
  path: ["confirmPassword"],
});

type PasswordFormData = z.infer<typeof passwordFormSchema>;

interface UserProfile {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  profileImageUrl: string | null;
  defaultAddress: string | null;
  deliveryAddress: string | null;
  country: string | null;
  state: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

interface Order {
  id: string;
  userId: string;
  customerName: string;
  email: string;
  phone: string;
  deliveryAddress: string;
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  status: string;
  deliveryDate: string | null;
  deliveryTime: string | null;
  specialInstructions: string | null;
  createdAt: string | null;
}

export default function MyAccount() {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const { toast } = useToast();

  // Fetch user profile
  const { data: profile, isLoading, error } = useQuery<UserProfile>({
    queryKey: ["/api/profile"],
  });

  // Fetch user orders
  const { data: orders = [], isLoading: ordersLoading } = useQuery<Order[]>({
    queryKey: ["/api/orders/user"],
    enabled: !!profile, // Only fetch when profile is available
  });

  // Fetch user favorites
  const { data: favorites = [], isLoading: favoritesLoading } = useQuery<any[]>({
    queryKey: ["/api/favorites"],
    enabled: !!profile, // Only fetch when profile is available
  });

  // Initialize form with profile data
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      defaultAddress: "",
      deliveryAddress: "",
      country: "",
      state: "",
    },
  });

  // Reset form when profile data loads
  useEffect(() => {
    if (profile) {
      reset({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        phone: profile.phone || "",
        defaultAddress: profile.defaultAddress || "",
        deliveryAddress: profile.deliveryAddress || "",
        country: profile.country || "",
        state: profile.state || "",
      });
    }
  }, [profile, reset]);

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileFormData) => {
      return apiRequest("/api/profile", {
        method: "PUT",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      setIsEditing(false);
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    },
  });

  // Delete account mutation
  const deleteAccountMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("/api/profile", {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.clear();
      toast({
        title: "Account deleted",
        description: "Your account has been deleted successfully.",
      });
      // Redirect to home page
      window.location.href = "/";
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete account",
        variant: "destructive",
      });
    },
  });

  // Remove from favorites mutation
  const removeFromFavoritesMutation = useMutation({
    mutationFn: async (productId: string) => {
      return apiRequest(`/api/favorites/${productId}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/favorites"] });
      toast({
        title: "Removed from Favorites",
        description: "Product removed from your favorites list.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to remove from favorites",
        variant: "destructive",
      });
    },
  });

  // Password change form
  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: async (data: PasswordFormData) => {
      return apiRequest("/api/profile/change-password", {
        method: "PUT",
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        }),
      });
    },
    onSuccess: () => {
      toast({
        title: "Password Changed",
        description: "Your password has been updated successfully.",
      });
      passwordForm.reset();
      setShowPasswordForm(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to change password",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ProfileFormData) => {
    updateProfileMutation.mutate(data);
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  const onPasswordSubmit = (data: PasswordFormData) => {
    changePasswordMutation.mutate(data);
  };

  const handleDeleteAccount = () => {
    deleteAccountMutation.mutate();
    setShowDeleteDialog(false);
  };

  const getInitials = () => {
    if (profile?.firstName && profile?.lastName) {
      return `${profile.firstName[0]}${profile.lastName[0]}`.toUpperCase();
    }
    return profile?.email?.[0]?.toUpperCase() || "U";
  };

  const getFullName = () => {
    if (profile?.firstName && profile?.lastName) {
      return `${profile.firstName} ${profile.lastName}`;
    }
    return profile?.firstName || profile?.lastName || "User";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <div className="text-red-500 mb-4">
              <User className="h-16 w-16 mx-auto" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Unable to load profile</h2>
            <p className="text-gray-600 mb-4">Please sign in to access your account.</p>
            <Link href="/signin">
              <Button className="w-full">Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <Link href="/" className="text-pink-600 hover:text-pink-700 flex items-center gap-2">
              ← Back to Home
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
          <p className="text-gray-600">Manage your profile and preferences</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader className="text-center">
                <div className="relative mx-auto mb-4">
                  <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                    <AvatarImage src={profile?.profileImageUrl || ""} alt={getFullName()} />
                    <AvatarFallback className="text-xl font-bold bg-gradient-to-br from-pink-500 to-purple-500 text-white">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="icon"
                    variant="outline"
                    className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-white border-2 border-pink-200 hover:border-pink-300"
                    data-testid="button-upload-photo"
                  >
                    <Camera className="h-4 w-4 text-pink-600" />
                  </Button>
                </div>
                <CardTitle className="text-lg">{getFullName()}</CardTitle>
                <CardDescription>{profile?.email}</CardDescription>
                <Badge variant="secondary" className="bg-green-100 text-green-700 w-fit mx-auto">
                  Active Account
                </Badge>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  variant={activeTab === "profile" ? "secondary" : "ghost"} 
                  className="w-full justify-start" 
                  onClick={() => setActiveTab("profile")}
                  data-testid="button-nav-account"
                >
                  <User className="h-4 w-4 mr-3" />
                  Account Details
                </Button>
                <Button 
                  variant={activeTab === "orders" ? "secondary" : "ghost"} 
                  className="w-full justify-start" 
                  onClick={() => setActiveTab("orders")}
                  data-testid="button-nav-orders"
                >
                  <ShoppingBag className="h-4 w-4 mr-3" />
                  My Orders
                </Button>
                <Button 
                  variant={activeTab === "addresses" ? "secondary" : "ghost"} 
                  className="w-full justify-start" 
                  onClick={() => setActiveTab("addresses")}
                  data-testid="button-nav-addresses"
                >
                  <MapPin className="h-4 w-4 mr-3" />
                  My Addresses
                </Button>
                <Button 
                  variant={activeTab === "favorites" ? "secondary" : "ghost"} 
                  className="w-full justify-start" 
                  onClick={() => setActiveTab("favorites")}
                  data-testid="button-nav-favorites"
                >
                  <Heart className="h-4 w-4 mr-3" />
                  Favorites
                </Button>
                <Button 
                  variant={activeTab === "settings" ? "secondary" : "ghost"} 
                  className="w-full justify-start" 
                  onClick={() => setActiveTab("settings")}
                  data-testid="button-nav-settings"
                >
                  <Settings className="h-4 w-4 mr-3" />
                  Settings
                </Button>
                <Separator className="my-4" />
                <Button variant="ghost" className="w-full justify-start" data-testid="button-nav-help">
                  <HelpCircle className="h-4 w-4 mr-3" />
                  Help & Support
                </Button>
                <Button variant="ghost" className="w-full justify-start" data-testid="button-nav-contact">
                  <MessageCircle className="h-4 w-4 mr-3" />
                  Contact Us
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="space-y-6">

              {/* Profile Tab */}
              {activeTab === "profile" && (
                <div className="space-y-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Personal Information
                      </CardTitle>
                      <CardDescription>
                        Update your personal details and contact information
                      </CardDescription>
                    </div>
                    {!isEditing && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditing(true)}
                        data-testid="button-edit-profile"
                      >
                        <Edit3 className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    )}
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        {/* First Name */}
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            {...register("firstName")}
                            disabled={!isEditing}
                            className={!isEditing ? "bg-gray-50" : ""}
                            data-testid="input-first-name"
                          />
                          {errors.firstName && (
                            <p className="text-sm text-red-600">{errors.firstName.message}</p>
                          )}
                        </div>

                        {/* Last Name */}
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            {...register("lastName")}
                            disabled={!isEditing}
                            className={!isEditing ? "bg-gray-50" : ""}
                            data-testid="input-last-name"
                          />
                          {errors.lastName && (
                            <p className="text-sm text-red-600">{errors.lastName.message}</p>
                          )}
                        </div>

                        {/* Email (Read-only) */}
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              id="email"
                              value={profile?.email || ""}
                              disabled
                              className="pl-10 bg-gray-50"
                              data-testid="input-email"
                            />
                          </div>
                          <p className="text-xs text-gray-500">Email cannot be changed</p>
                        </div>

                        {/* Phone */}
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              id="phone"
                              {...register("phone")}
                              disabled={!isEditing}
                              className={`pl-10 ${!isEditing ? "bg-gray-50" : ""}`}
                              placeholder="+91 98765 43210"
                              data-testid="input-phone"
                            />
                          </div>
                          {errors.phone && (
                            <p className="text-sm text-red-600">{errors.phone.message}</p>
                          )}
                        </div>

                        {/* Country */}
                        <div className="space-y-2">
                          <Label htmlFor="country">Country</Label>
                          <div className="relative">
                            <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              id="country"
                              {...register("country")}
                              disabled={!isEditing}
                              className={`pl-10 ${!isEditing ? "bg-gray-50" : ""}`}
                              placeholder="India"
                              data-testid="input-country"
                            />
                          </div>
                        </div>

                        {/* State */}
                        <div className="space-y-2">
                          <Label htmlFor="state">State</Label>
                          <Input
                            id="state"
                            {...register("state")}
                            disabled={!isEditing}
                            className={!isEditing ? "bg-gray-50" : ""}
                            placeholder="Maharashtra"
                            data-testid="input-state"
                          />
                        </div>
                      </div>

                      {/* Addresses */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          <MapPin className="h-5 w-5" />
                          Address Information
                        </h3>
                        
                        <div className="grid md:grid-cols-2 gap-6">
                          {/* Default Address */}
                          <div className="space-y-2">
                            <Label htmlFor="defaultAddress">Default Address</Label>
                            <textarea
                              id="defaultAddress"
                              {...register("defaultAddress")}
                              disabled={!isEditing}
                              className={`w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-vertical ${!isEditing ? "bg-gray-50" : ""}`}
                              placeholder="Enter your default address"
                              data-testid="textarea-default-address"
                            />
                          </div>

                          {/* Delivery Address */}
                          <div className="space-y-2">
                            <Label htmlFor="deliveryAddress">Delivery Address</Label>
                            <textarea
                              id="deliveryAddress"
                              {...register("deliveryAddress")}
                              disabled={!isEditing}
                              className={`w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-vertical ${!isEditing ? "bg-gray-50" : ""}`}
                              placeholder="Enter your delivery address"
                              data-testid="textarea-delivery-address"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Form Actions */}
                      {isEditing && (
                        <div className="flex gap-4 pt-4 border-t">
                          <Button
                            type="submit"
                            disabled={updateProfileMutation.isPending || !isDirty}
                            className="flex items-center gap-2"
                            data-testid="button-save-profile"
                          >
                            <Save className="h-4 w-4" />
                            {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={handleCancel}
                            className="flex items-center gap-2"
                            data-testid="button-cancel-edit"
                          >
                            <X className="h-4 w-4" />
                            Cancel
                          </Button>
                        </div>
                      )}
                    </form>
                  </CardContent>
                </Card>

                {/* Account Actions */}
                <Card className="border-red-200">
                  <CardHeader>
                    <CardTitle className="text-red-600 flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Account Actions
                    </CardTitle>
                    <CardDescription>
                      Manage your account settings and data
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="flex items-center gap-2" data-testid="button-delete-account">
                          <Trash2 className="h-4 w-4" />
                          Delete Account
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your account
                            and remove your data from our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDeleteAccount}
                            className="bg-red-600 hover:bg-red-700"
                            disabled={deleteAccountMutation.isPending}
                          >
                            {deleteAccountMutation.isPending ? "Deleting..." : "Delete Account"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </CardContent>
                </Card>
                </div>
              )}

              {/* Settings Tab - combines Security and Preferences */}
              {activeTab === "settings" && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Security Settings
                      </CardTitle>
                      <CardDescription>
                        Manage your password and security preferences
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <h3 className="font-semibold mb-2">Password</h3>
                          <p className="text-sm text-gray-600 mb-4">
                            Last updated: {profile?.updatedAt ? new Date(profile.updatedAt).toLocaleDateString() : "Never"}
                          </p>
                          
                          {!showPasswordForm ? (
                            <Button 
                              variant="outline" 
                              onClick={() => setShowPasswordForm(true)}
                              data-testid="button-change-password"
                            >
                              Change Password
                            </Button>
                          ) : (
                            <Form {...passwordForm}>
                              <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                                <FormField
                                  control={passwordForm.control}
                                  name="currentPassword"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Current Password</FormLabel>
                                      <FormControl>
                                        <Input 
                                          type="password" 
                                          placeholder="Enter current password"
                                          data-testid="input-current-password"
                                          {...field} 
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                
                                <FormField
                                  control={passwordForm.control}
                                  name="newPassword"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>New Password</FormLabel>
                                      <FormControl>
                                        <Input 
                                          type="password" 
                                          placeholder="Enter new password (min 6 characters)"
                                          data-testid="input-new-password"
                                          {...field} 
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                
                                <FormField
                                  control={passwordForm.control}
                                  name="confirmPassword"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Confirm New Password</FormLabel>
                                      <FormControl>
                                        <Input 
                                          type="password" 
                                          placeholder="Confirm new password"
                                          data-testid="input-confirm-password"
                                          {...field} 
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                
                                <div className="flex gap-2">
                                  <Button 
                                    type="submit" 
                                    disabled={changePasswordMutation.isPending}
                                    data-testid="button-submit-password"
                                  >
                                    {changePasswordMutation.isPending ? "Updating..." : "Update Password"}
                                  </Button>
                                  <Button 
                                    type="button" 
                                    variant="outline" 
                                    onClick={() => {
                                      setShowPasswordForm(false);
                                      passwordForm.reset();
                                    }}
                                    disabled={changePasswordMutation.isPending}
                                    data-testid="button-cancel-password"
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </form>
                            </Form>
                          )}
                        </div>
                        
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <h3 className="font-semibold mb-2">Two-Factor Authentication</h3>
                          <p className="text-sm text-gray-600 mb-4">
                            Add an extra layer of security to your account
                          </p>
                          <Button variant="outline" disabled>
                            Enable 2FA <Badge variant="secondary" className="ml-2">Coming Soon</Badge>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Preferences
                    </CardTitle>
                    <CardDescription>
                      Customize your experience and notifications
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h3 className="font-semibold mb-2">Email Notifications</h3>
                        <p className="text-sm text-gray-600 mb-4">
                          Choose which emails you'd like to receive
                        </p>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="order-updates" defaultChecked />
                            <label htmlFor="order-updates" className="text-sm">Order updates and shipping notifications</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="promotions" defaultChecked />
                            <label htmlFor="promotions" className="text-sm">Promotions and special offers</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="newsletter" />
                            <label htmlFor="newsletter" className="text-sm">Weekly newsletter</label>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h3 className="font-semibold mb-2">Language & Region</h3>
                        <p className="text-sm text-gray-600 mb-4">
                          Set your preferred language and region
                        </p>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="language">Language</Label>
                            <select id="language" className="w-full mt-1 p-2 border border-gray-300 rounded-md">
                              <option value="en">English</option>
                              <option value="hi">Hindi</option>
                            </select>
                          </div>
                          <div>
                            <Label htmlFor="currency">Currency</Label>
                            <select id="currency" className="w-full mt-1 p-2 border border-gray-300 rounded-md">
                              <option value="inr">Indian Rupee (₹)</option>
                              <option value="usd">US Dollar ($)</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === "orders" && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        Order History
                      </CardTitle>
                      <CardDescription>
                        View and track your recent orders
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {ordersLoading ? (
                        <div className="space-y-4">
                          {[...Array(3)].map((_, i) => (
                            <div key={i} className="p-4 border rounded-lg animate-pulse">
                              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                            </div>
                          ))}
                        </div>
                      ) : orders.length === 0 ? (
                        <div className="text-center py-8">
                          <ShoppingBag className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h3>
                          <p className="text-gray-600 mb-4">Start shopping to see your orders here</p>
                          <Link href="/shop">
                            <Button>Start Shopping</Button>
                          </Link>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {orders.map((order) => (
                            <div key={order.id} className="p-4 border rounded-lg hover-elevate" data-testid={`order-${order.id}`}>
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <h3 className="font-semibold">Order #{order.id.slice(-8)}</h3>
                                  <p className="text-sm text-gray-600">
                                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                                  </p>
                                </div>
                                <Badge 
                                  variant={order.status === 'delivered' ? 'default' : 'secondary'}
                                  className={order.status === 'delivered' ? 'bg-green-100 text-green-700' : ''}
                                >
                                  {order.status}
                                </Badge>
                              </div>
                              <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm font-medium">Items: {order.items.length}</p>
                                  <p className="text-sm text-gray-600">Total: ₹{order.totalAmount}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-600 flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    {order.deliveryAddress}
                                  </p>
                                  {order.deliveryDate && (
                                    <p className="text-sm text-gray-600 flex items-center gap-1">
                                      <Truck className="h-3 w-3" />
                                      {new Date(order.deliveryDate).toLocaleDateString()}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Favorites Tab */}
              {activeTab === "favorites" && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Heart className="h-5 w-5" />
                        My Favorites
                      </CardTitle>
                      <CardDescription>
                        Your saved and favorite items
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {favoritesLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {[...Array(6)].map((_, index) => (
                            <Card key={index} className="overflow-hidden">
                              <div className="w-full h-48 bg-gray-200 animate-pulse"></div>
                              <CardContent className="p-4">
                                <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                                <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : favorites.length === 0 ? (
                        <div className="text-center py-8">
                          <Heart className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">No favorites yet</h3>
                          <p className="text-gray-600 mb-4">Save items you love to see them here</p>
                          <Button onClick={() => window.location.href = "/shop"}>
                            Browse Products
                          </Button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {favorites.map((favorite: any) => (
                            <Card key={favorite.id} className="overflow-hidden hover-elevate" data-testid={`card-favorite-${favorite.productId}`}>
                              <div className="relative">
                                <img 
                                  src={favorite.product?.image || "/placeholder-image.jpg"}
                                  alt={favorite.product?.name || "Product"}
                                  className="w-full h-48 object-cover cursor-pointer"
                                  onClick={() => window.location.href = `/product/${favorite.productId}`}
                                />
                                <button 
                                  className="absolute top-2 right-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover-elevate"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeFromFavoritesMutation.mutate(favorite.productId);
                                  }}
                                  disabled={removeFromFavoritesMutation.isPending}
                                  data-testid={`button-remove-favorite-${favorite.productId}`}
                                >
                                  <Heart className="w-4 h-4 fill-pink-500 text-pink-500" />
                                </button>
                                {favorite.product && !favorite.product.inStock && (
                                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                    <Badge variant="secondary" className="bg-white text-black">
                                      Out of Stock
                                    </Badge>
                                  </div>
                                )}
                              </div>
                              <CardContent className="p-4">
                                <h3 
                                  className="font-semibold text-gray-900 mb-2 cursor-pointer hover:text-pink-600 transition-colors"
                                  onClick={() => window.location.href = `/product/${favorite.productId}`}
                                >
                                  {favorite.product?.name || "Product Name"}
                                </h3>
                                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                  {favorite.product?.description || "Product description"}
                                </p>
                                <div className="flex items-center justify-between mb-4">
                                  <span className="text-xl font-bold text-primary">
                                    ₹{favorite.product?.price || "0"}
                                  </span>
                                  <Badge variant="outline" className="text-xs">
                                    {favorite.product?.category || "Category"}
                                  </Badge>
                                </div>
                                <div className="flex gap-2">
                                  <Button 
                                    size="sm"
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => window.location.href = `/product/${favorite.productId}`}
                                    data-testid={`button-view-product-${favorite.productId}`}
                                  >
                                    View Product
                                  </Button>
                                  <Button 
                                    size="sm"
                                    className="flex-1"
                                    onClick={() => {
                                      // Add to cart functionality would go here
                                      toast({
                                        title: "Add to Cart",
                                        description: "Visit the product page to add to cart.",
                                      });
                                    }}
                                    disabled={favorite.product && !favorite.product.inStock}
                                    data-testid={`button-add-cart-${favorite.productId}`}
                                  >
                                    {favorite.product && !favorite.product.inStock ? "Out of Stock" : "Add to Cart"}
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Addresses Tab */}
              {activeTab === "addresses" && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        My Addresses
                      </CardTitle>
                      <CardDescription>
                        Manage your delivery addresses for easy checkout
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <AddressManager userId={profile?.id} className="border-0 shadow-none p-0" />
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}