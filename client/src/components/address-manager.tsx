import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Plus, 
  Edit, 
  Trash2, 
  Home, 
  Building2, 
  User,
  AlertCircle,
  Check
} from "lucide-react";
import { useCart } from "@/hooks/cart-context";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Address, AddressValidation } from "@shared/schema";
import { z } from "zod";

// Address validation schema
const addressSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit mobile number"),
  email: z.string().email("Please enter a valid email address").optional().or(z.literal("")),
  addressLine1: z.string().min(1, "Address line 1 is required"),
  addressLine2: z.string().optional(),
  landmark: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  postalCode: z.string().regex(/^\d{6}$/, "Please enter a valid 6-digit postal code"),
  country: z.string().min(1, "Country is required"),
  addressType: z.enum(["Home", "Office", "Other"]),
});

interface AddressManagerProps {
  className?: string;
  userId?: string; // Pass user ID if authenticated
}

export default function AddressManager({ className, userId }: AddressManagerProps) {
  const { 
    shippingAddress, 
    setShippingAddress,
    clearShippingAddress
  } = useCart();
  const { toast } = useToast();

  // State management
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(!!userId);
  const [error, setError] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGuestMode, setIsGuestMode] = useState(!userId); // Track if in guest mode
  const [userProfile, setUserProfile] = useState<any>(null); // Store user profile data

  // Form state for new/edit address
  const [formData, setFormData] = useState<AddressValidation>({
    fullName: "",
    phone: "",
    email: "",
    addressLine1: "",
    addressLine2: "",
    landmark: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    addressType: "Home",
    isDefault: false,
  });

  // Form validation errors
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof AddressValidation, string>>>({});

  // Guest address persistence functions
  const saveGuestAddresses = (addressList: Address[]) => {
    try {
      localStorage.setItem('guest-addresses', JSON.stringify(addressList));
    } catch (error) {
      console.error('Error saving guest addresses:', error);
    }
  };

  const loadGuestAddresses = (): Address[] => {
    try {
      const saved = localStorage.getItem('guest-addresses');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading guest addresses:', error);
      return [];
    }
  };

  // Load addresses and user profile for authenticated users or guest addresses
  useEffect(() => {
    if (userId && !isGuestMode) {
      loadAddresses();
      loadUserProfile();
    } else {
      loadGuestAddressesFromStorage();
    }
  }, [userId, isGuestMode]);

  // Load user profile for form prefilling
  const loadUserProfile = async () => {
    if (!userId) return;
    
    try {
      const response = await apiRequest('/api/profile');
      
      // Check for authentication failure and fall back to guest mode
      if (response.status === 401) {
        console.log('Profile fetch failed, switching to guest mode');
        setIsGuestMode(true);
        return;
      }
      
      const profile = await response.json();
      setUserProfile(profile);
    } catch (err: any) {
      console.error('Error loading user profile:', err);
      
      // If it's a 401 error, switch to guest mode
      if (err.status === 401 || (err.message && err.message.includes('401'))) {
        console.log('Profile authentication error detected, switching to guest mode');
        setIsGuestMode(true);
      }
    }
  };

  const loadGuestAddressesFromStorage = () => {
    setIsLoading(true);
    const guestAddresses = loadGuestAddresses();
    setAddresses(guestAddresses);
    
    // Auto-select default address or first address
    const defaultAddress = guestAddresses.find((addr: Address) => addr.isDefault) || guestAddresses[0];
    if (defaultAddress && !shippingAddress) {
      setShippingAddress(defaultAddress);
    }
    setIsLoading(false);
  };

  const loadAddresses = async () => {
    if (!userId) return;

    try {
      setIsLoading(true);
      setError(null);
      const response = await apiRequest('/api/addresses');
      
      // Check for authentication failure (401) and fall back to guest mode
      if (response.status === 401) {
        console.log('Authentication failed, switching to guest mode');
        setIsGuestMode(true);
        loadGuestAddressesFromStorage();
        return;
      }
      
      const addresses: Address[] = await response.json();
      setAddresses(addresses);
      
      // Auto-select default address or first address
      const defaultAddress = addresses.find((addr: Address) => addr.isDefault) || addresses[0];
      if (defaultAddress && !shippingAddress) {
        setShippingAddress(defaultAddress);
      }
    } catch (err: any) {
      console.error("Error loading addresses:", err);
      
      // If it's a 401 error, switch to guest mode
      if (err.status === 401 || (err.message && err.message.includes('401'))) {
        console.log('Authentication error detected, switching to guest mode');
        setIsGuestMode(true);
        loadGuestAddressesFromStorage();
        return;
      }
      
      setError("Failed to load addresses. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Format address for display
  const formatAddress = (address: Address) => {
    const parts = [
      address.addressLine1,
      address.addressLine2,
      address.landmark,
      address.city,
      address.state,
      address.postalCode
    ].filter(Boolean);
    return parts.join(", ");
  };

  // Handle address selection
  const handleAddressSelect = (address: Address) => {
    setShippingAddress(address);
  };

  // Reset form with user profile data for new addresses
  const resetFormWithProfileData = () => {
    const fullName = userProfile 
      ? `${userProfile.firstName || ''} ${userProfile.lastName || ''}`.trim() 
      : '';
    
    setFormData({
      fullName: fullName || '',
      phone: userProfile?.phone || '',
      email: userProfile?.email || '',
      addressLine1: '',
      addressLine2: '',
      landmark: '',
      city: '',
      state: userProfile?.state || '',
      postalCode: '',
      country: userProfile?.country || 'India',
      addressType: 'Home',
      isDefault: addresses.length === 0, // Make first address default
    });
    setFormErrors({});
    setEditingAddress(null);
  };

  // Handle starting new address with prefilled data
  const handleStartNewAddress = () => {
    resetFormWithProfileData();
    setIsAddingNew(true);
  };

  // Validate form data
  const validateForm = () => {
    try {
      addressSchema.parse(formData);
      setFormErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Partial<Record<keyof AddressValidation, string>> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            errors[err.path[0] as keyof AddressValidation] = err.message;
          }
        });
        setFormErrors(errors);
      }
      return false;
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      if (userId && !isGuestMode) {
        // Authenticated user - save to backend
        let savedAddress: Address;
        
        try {
          if (editingAddress) {
            // Update existing address
            const response = await apiRequest(`/api/addresses/${editingAddress.id}`, {
              method: 'PUT',
              body: JSON.stringify(formData),
            });
            
            if (response.status === 401) {
              // Authentication failed, switch to guest mode and save locally
              setIsGuestMode(true);
              handleGuestAddressSave();
              return;
            }
            
            savedAddress = await response.json();
            toast({
              title: "Address Updated",
              description: "Your address has been updated successfully.",
            });
          } else {
            // Create new address
            const response = await apiRequest('/api/addresses', {
              method: 'POST',
              body: JSON.stringify(formData),
            });
            
            if (response.status === 401) {
              // Authentication failed, switch to guest mode and save locally
              setIsGuestMode(true);
              handleGuestAddressSave();
              return;
            }
            
            savedAddress = await response.json();
            toast({
              title: "Address Added",
              description: "Your new address has been saved successfully.",
            });
          }
          
          // Reload addresses and select the new/updated one
          await loadAddresses();
          setShippingAddress(savedAddress);
          
          // Close form
          setIsAddingNew(false);
          setEditingAddress(null);
        } catch (authError: any) {
          if (authError.status === 401 || (authError.message && authError.message.includes('401'))) {
            // Authentication failed, switch to guest mode and save locally
            setIsGuestMode(true);
            handleGuestAddressSave();
            return;
          }
          throw authError;
        }
      } else {
        // Guest user or guest mode - save locally
        handleGuestAddressSave();
      }
      
      // Reset form
      resetForm();
    } catch (error) {
      console.error("Error saving address:", error);
      toast({
        title: "Error",
        description: "Failed to save address. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGuestAddressSave = () => {
    const currentAddresses = loadGuestAddresses();
    
    let updatedAddresses: Address[];
    
    if (editingAddress) {
      // Update existing guest address
      updatedAddresses = currentAddresses.map(addr => 
        addr.id === editingAddress.id 
          ? { ...formData, id: editingAddress.id, userId: 'guest' } as Address
          : addr
      );
      toast({
        title: "Address Updated",
        description: "Your address has been updated successfully.",
      });
    } else {
      // Create new guest address
      const newAddress: Address = {
        ...formData,
        id: `guest-address-${Date.now()}`,
        userId: 'guest',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // If this is set as default, remove default from other addresses
      if (formData.isDefault) {
        currentAddresses.forEach(addr => addr.isDefault = false);
      }
      
      updatedAddresses = [...currentAddresses, newAddress];
      toast({
        title: "Address Added",
        description: "Your address has been saved successfully.",
      });
    }
    
    // Save to localStorage and update state
    saveGuestAddresses(updatedAddresses);
    setAddresses(updatedAddresses);
    
    // Select the new/updated address
    const savedAddress = editingAddress
      ? updatedAddresses.find(addr => addr.id === editingAddress.id)
      : updatedAddresses[updatedAddresses.length - 1];
    
    if (savedAddress) {
      setShippingAddress(savedAddress);
    }
    
    // Close form
    setIsAddingNew(false);
    setEditingAddress(null);
  };

  // Handle address deletion
  const handleDelete = async (addressId: string) => {
    if (!window.confirm("Are you sure you want to delete this address?")) {
      return;
    }

    try {
      if (userId && !isGuestMode) {
        // Authenticated user - delete from backend
        const response = await apiRequest(`/api/addresses/${addressId}`, {
          method: 'DELETE',
        });
        
        if (response.status === 401) {
          // Authentication failed, switch to guest mode and delete locally
          setIsGuestMode(true);
          handleGuestAddressDelete(addressId);
          return;
        }
        
        toast({
          title: "Address Deleted",
          description: "Address has been deleted successfully.",
        });
        
        // Reload addresses
        await loadAddresses();
      } else {
        // Guest user - delete from localStorage
        handleGuestAddressDelete(addressId);
      }
      
      // Clear shipping address if it was the deleted one
      if (shippingAddress?.id === addressId) {
        clearShippingAddress();
      }
    } catch (error: any) {
      if (error.status === 401 || (error.message && error.message.includes('401'))) {
        // Authentication failed, switch to guest mode and delete locally
        setIsGuestMode(true);
        handleGuestAddressDelete(addressId);
        return;
      }
      
      console.error("Error deleting address:", error);
      toast({
        title: "Error",
        description: "Failed to delete address. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleGuestAddressDelete = (addressId: string) => {
    const currentAddresses = loadGuestAddresses();
    const updatedAddresses = currentAddresses.filter(addr => addr.id !== addressId);
    
    saveGuestAddresses(updatedAddresses);
    setAddresses(updatedAddresses);
    
    toast({
      title: "Address Deleted",
      description: "Address has been deleted successfully.",
    });
  };

  // Reset form to initial state
  const resetForm = () => {
    setFormData({
      fullName: "",
      phone: "",
      email: "",
      addressLine1: "",
      addressLine2: "",
      landmark: "",
      city: "",
      state: "",
      postalCode: "",
      country: "India",
      addressType: "Home",
      isDefault: false,
    });
    setFormErrors({});
  };

  // Handle edit address
  const handleEdit = (address: Address) => {
    setFormData({
      fullName: address.fullName,
      phone: address.phone,
      email: address.email || "",
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2 || "",
      landmark: address.landmark || "",
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
      addressType: (address.addressType as "Home" | "Office" | "Other") || "Home",
      isDefault: address.isDefault || false,
    });
    setEditingAddress(address);
    setIsAddingNew(true);
  };

  // Get address type icon
  const getAddressIcon = (type: string) => {
    switch (type) {
      case "Office":
        return <Building2 className="h-4 w-4" />;
      case "Other":
        return <User className="h-4 w-4" />;
      default:
        return <Home className="h-4 w-4" />;
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <Card className={className} data-testid="card-address-manager-loading">
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="mr-2 h-5 w-5" />
            Shipping Address
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="p-4 border rounded-md space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48" />
              <Skeleton className="h-3 w-40" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className={className} data-testid="card-address-manager-error">
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="mr-2 h-5 w-5" />
            Shipping Address
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className} data-testid="card-address-manager">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center">
            <MapPin className="mr-2 h-5 w-5" />
            Shipping Address
          </span>
          {userId && addresses.length > 0 && (
            <Dialog open={isAddingNew} onOpenChange={(open) => {
              if (open) {
                handleStartNewAddress();
              } else {
                setIsAddingNew(false);
              }
            }}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" data-testid="button-add-address">
                  <Plus className="mr-2 h-4 w-4" />
                  Add New
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingAddress ? "Edit Address" : "Add New Address"}
                  </DialogTitle>
                </DialogHeader>
                <AddressForm 
                  formData={formData}
                  setFormData={setFormData}
                  formErrors={formErrors}
                  onSubmit={handleSubmit}
                  isSubmitting={isSubmitting}
                  showDefaultOption={true}
                />
              </DialogContent>
            </Dialog>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Authenticated User - Address List */}
        {userId && addresses.length > 0 ? (
          <RadioGroup
            value={shippingAddress?.id || ""}
            onValueChange={(value) => {
              const address = addresses.find(addr => addr.id === value);
              if (address) {
                handleAddressSelect(address);
              }
            }}
            className="space-y-3"
          >
            {addresses.map((address) => (
              <div key={address.id} className="flex items-start space-x-3 relative">
                <RadioGroupItem 
                  value={address.id} 
                  id={`address-${address.id}`}
                  className="mt-1"
                  data-testid={`radio-address-${address.id}`}
                />
                <div className="flex-1">
                  <Label 
                    htmlFor={`address-${address.id}`}
                    className="block p-3 border rounded-md cursor-pointer hover-elevate space-y-2"
                    data-testid={`label-address-${address.id}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-foreground">{address.fullName}</span>
                        <div className="flex items-center space-x-1">
                          {getAddressIcon(address.addressType)}
                          <span className="text-xs text-muted-foreground">{address.addressType}</span>
                        </div>
                        {address.isDefault && (
                          <Badge variant="secondary" className="text-xs">
                            Default
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatAddress(address)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Phone: {address.phone}
                    </div>
                  </Label>
                  <div className="absolute top-3 right-3 flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleEdit(address);
                      }}
                      className="h-6 w-6 p-0"
                      data-testid={`button-edit-${address.id}`}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDelete(address.id);
                      }}
                      className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                      data-testid={`button-delete-${address.id}`}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </RadioGroup>
        ) : (
          /* Guest User or No Addresses - Address Form */
          <div data-testid="address-form-container">
            {!userId && (
              <Alert className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Sign in to save addresses for faster checkout in the future.
                </AlertDescription>
              </Alert>
            )}
            <AddressForm
              formData={formData}
              setFormData={setFormData}
              formErrors={formErrors}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              showDefaultOption={!!userId}
            />
          </div>
        )}

        {/* Selected Address Summary */}
        {shippingAddress && (
          <div className="mt-4 p-3 bg-muted rounded-md">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="text-sm font-medium text-foreground">Delivering to:</div>
                <div className="text-sm text-muted-foreground mt-1">
                  {shippingAddress.fullName}<br />
                  {formatAddress(shippingAddress)}<br />
                  Phone: {shippingAddress.phone}
                </div>
              </div>
              <Check className="h-4 w-4 text-green-600 mt-1" />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Separate AddressForm component for reusability
interface AddressFormProps {
  formData: AddressValidation;
  setFormData: (data: AddressValidation) => void;
  formErrors: Partial<Record<keyof AddressValidation, string>>;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  showDefaultOption: boolean;
}

function AddressForm({ 
  formData, 
  setFormData, 
  formErrors, 
  onSubmit, 
  isSubmitting,
  showDefaultOption 
}: AddressFormProps) {
  const updateField = (field: keyof AddressValidation, value: string | boolean) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4" data-testid="form-address">
      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="fullName">Full Name *</Label>
          <Input
            id="fullName"
            value={formData.fullName}
            onChange={(e) => updateField('fullName', e.target.value)}
            placeholder="Enter your full name"
            className={formErrors.fullName ? 'border-destructive' : ''}
            data-testid="input-full-name"
          />
          {formErrors.fullName && (
            <p className="text-destructive text-sm mt-1">{formErrors.fullName}</p>
          )}
        </div>
        <div>
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => updateField('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
            placeholder="10-digit mobile number"
            className={formErrors.phone ? 'border-destructive' : ''}
            data-testid="input-phone"
          />
          {formErrors.phone && (
            <p className="text-destructive text-sm mt-1">{formErrors.phone}</p>
          )}
        </div>
      </div>

      {/* Email */}
      <div>
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => updateField('email', e.target.value)}
          placeholder="Enter your email address"
          className={formErrors.email ? 'border-destructive' : ''}
          data-testid="input-email"
        />
        {formErrors.email && (
          <p className="text-destructive text-sm mt-1">{formErrors.email}</p>
        )}
      </div>

      {/* Address Lines */}
      <div>
        <Label htmlFor="addressLine1">Address Line 1 *</Label>
        <Input
          id="addressLine1"
          value={formData.addressLine1}
          onChange={(e) => updateField('addressLine1', e.target.value)}
          placeholder="House/Flat No., Building Name, Street"
          className={formErrors.addressLine1 ? 'border-destructive' : ''}
          data-testid="input-address-line-1"
        />
        {formErrors.addressLine1 && (
          <p className="text-destructive text-sm mt-1">{formErrors.addressLine1}</p>
        )}
      </div>

      <div>
        <Label htmlFor="addressLine2">Address Line 2</Label>
        <Input
          id="addressLine2"
          value={formData.addressLine2}
          onChange={(e) => updateField('addressLine2', e.target.value)}
          placeholder="Area, Sector, Village (Optional)"
          data-testid="input-address-line-2"
        />
      </div>

      <div>
        <Label htmlFor="landmark">Landmark</Label>
        <Input
          id="landmark"
          value={formData.landmark}
          onChange={(e) => updateField('landmark', e.target.value)}
          placeholder="Near hospital, school, etc. (Optional)"
          data-testid="input-landmark"
        />
      </div>

      {/* City, State, Postal Code */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="city">City *</Label>
          <Input
            id="city"
            value={formData.city}
            onChange={(e) => updateField('city', e.target.value)}
            placeholder="City"
            className={formErrors.city ? 'border-destructive' : ''}
            data-testid="input-city"
          />
          {formErrors.city && (
            <p className="text-destructive text-sm mt-1">{formErrors.city}</p>
          )}
        </div>
        <div>
          <Label htmlFor="state">State *</Label>
          <Input
            id="state"
            value={formData.state}
            onChange={(e) => updateField('state', e.target.value)}
            placeholder="State"
            className={formErrors.state ? 'border-destructive' : ''}
            data-testid="input-state"
          />
          {formErrors.state && (
            <p className="text-destructive text-sm mt-1">{formErrors.state}</p>
          )}
        </div>
        <div>
          <Label htmlFor="postalCode">Postal Code *</Label>
          <Input
            id="postalCode"
            value={formData.postalCode}
            onChange={(e) => updateField('postalCode', e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="6-digit PIN code"
            className={formErrors.postalCode ? 'border-destructive' : ''}
            data-testid="input-postal-code"
          />
          {formErrors.postalCode && (
            <p className="text-destructive text-sm mt-1">{formErrors.postalCode}</p>
          )}
        </div>
      </div>

      {/* Address Type and Default */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="addressType">Address Type</Label>
          <Select
            value={formData.addressType}
            onValueChange={(value: "Home" | "Office" | "Other") => updateField('addressType', value)}
          >
            <SelectTrigger data-testid="select-address-type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Home">Home</SelectItem>
              <SelectItem value="Office">Office</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {showDefaultOption && (
          <div className="flex items-center space-x-2 mt-6">
            <input
              type="checkbox"
              id="isDefault"
              checked={formData.isDefault}
              onChange={(e) => updateField('isDefault', e.target.checked)}
              className="rounded border-gray-300"
              data-testid="checkbox-default-address"
            />
            <Label htmlFor="isDefault" className="text-sm">
              Set as default address
            </Label>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <Button 
        type="submit" 
        className="w-full"
        disabled={isSubmitting}
        data-testid="button-save-address"
      >
        {isSubmitting ? "Saving..." : "Save Address"}
      </Button>
    </form>
  );
}