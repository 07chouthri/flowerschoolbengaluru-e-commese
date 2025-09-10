import { useState, useCallback, useEffect } from 'react';
import { apiRequest } from '@/lib/queryClient';
import type { Product, Cart } from '@shared/schema';

interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  isLoading: boolean;
  error: string | null;
}

export function useCart(userId?: string) {
  const [cart, setCart] = useState<CartState>({
    items: [],
    totalItems: 0,
    totalPrice: 0,
    isLoading: false,
    error: null,
  });

  const calculateTotals = useCallback((items: CartItem[]) => {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
    return { totalItems, totalPrice };
  }, []);

  // Load cart from backend when userId is available
  const loadCart = useCallback(async () => {
    if (!userId) return;

    setCart(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const cartItems = await apiRequest(`/api/cart/${userId}`) as (Cart & { product: Product })[];
      
      const formattedItems: CartItem[] = cartItems.map(item => ({
        ...item.product,
        quantity: item.quantity
      }));
      
      const { totalItems, totalPrice } = calculateTotals(formattedItems);
      
      setCart({
        items: formattedItems,
        totalItems,
        totalPrice,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error('Error loading cart:', error);
      setCart(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: 'Failed to load cart' 
      }));
    }
  }, [userId, calculateTotals]);

  // Load cart on mount and when userId changes
  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const addToCart = useCallback(async (product: Product, quantity: number = 1) => {
    if (userId) {
      // Backend persistence
      setCart(prev => ({ ...prev, isLoading: true, error: null }));
      
      try {
        await apiRequest(`/api/cart/${userId}/add`, {
          method: 'POST',
          body: JSON.stringify({ productId: product.id, quantity }),
          headers: { 'Content-Type': 'application/json' }
        });
        
        // Reload cart after adding
        await loadCart();
      } catch (error) {
        console.error('Error adding to cart:', error);
        setCart(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: 'Failed to add item to cart' 
        }));
      }
    } else {
      // Local state fallback
      setCart(prevCart => {
        const existingItemIndex = prevCart.items.findIndex(item => item.id === product.id);
        
        let newItems: CartItem[];
        if (existingItemIndex > -1) {
          newItems = prevCart.items.map((item, index) => 
            index === existingItemIndex 
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          newItems = [...prevCart.items, { ...product, quantity }];
        }

        const { totalItems, totalPrice } = calculateTotals(newItems);
        
        return {
          ...prevCart,
          items: newItems,
          totalItems,
          totalPrice,
        };
      });
    }
  }, [userId, calculateTotals, loadCart]);

  const removeFromCart = useCallback(async (productId: string) => {
    if (userId) {
      // Backend persistence
      setCart(prev => ({ ...prev, isLoading: true, error: null }));
      
      try {
        await apiRequest(`/api/cart/${userId}/remove/${productId}`, {
          method: 'DELETE'
        });
        
        // Reload cart after removing
        await loadCart();
      } catch (error) {
        console.error('Error removing from cart:', error);
        setCart(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: 'Failed to remove item from cart' 
        }));
      }
    } else {
      // Local state fallback
      setCart(prevCart => {
        const newItems = prevCart.items.filter(item => item.id !== productId);
        const { totalItems, totalPrice } = calculateTotals(newItems);
        
        return {
          ...prevCart,
          items: newItems,
          totalItems,
          totalPrice,
        };
      });
    }
  }, [userId, calculateTotals, loadCart]);

  const updateQuantity = useCallback(async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    if (userId) {
      // Backend persistence
      setCart(prev => ({ ...prev, isLoading: true, error: null }));
      
      try {
        await apiRequest(`/api/cart/${userId}/update`, {
          method: 'PUT',
          body: JSON.stringify({ productId, quantity }),
          headers: { 'Content-Type': 'application/json' }
        });
        
        // Reload cart after updating
        await loadCart();
      } catch (error) {
        console.error('Error updating cart quantity:', error);
        setCart(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: 'Failed to update cart item' 
        }));
      }
    } else {
      // Local state fallback
      setCart(prevCart => {
        const newItems = prevCart.items.map(item =>
          item.id === productId ? { ...item, quantity } : item
        );
        const { totalItems, totalPrice } = calculateTotals(newItems);
        
        return {
          ...prevCart,
          items: newItems,
          totalItems,
          totalPrice,
        };
      });
    }
  }, [userId, calculateTotals, removeFromCart, loadCart]);

  const clearCart = useCallback(async () => {
    if (userId) {
      // Backend persistence
      setCart(prev => ({ ...prev, isLoading: true, error: null }));
      
      try {
        await apiRequest(`/api/cart/${userId}/clear`, {
          method: 'DELETE'
        });
        
        setCart(prev => ({
          ...prev,
          items: [],
          totalItems: 0,
          totalPrice: 0,
          isLoading: false,
          error: null,
        }));
      } catch (error) {
        console.error('Error clearing cart:', error);
        setCart(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: 'Failed to clear cart' 
        }));
      }
    } else {
      // Local state fallback
      setCart(prev => ({
        ...prev,
        items: [],
        totalItems: 0,
        totalPrice: 0,
      }));
    }
  }, [userId]);

  const getItemQuantity = useCallback((productId: string): number => {
    const item = cart.items.find(item => item.id === productId);
    return item?.quantity || 0;
  }, [cart.items]);

  const isInCart = useCallback((productId: string): boolean => {
    return cart.items.some(item => item.id === productId);
  }, [cart.items]);

  const clearError = useCallback(() => {
    setCart(prev => ({ ...prev, error: null }));
  }, []);

  return {
    items: cart.items,
    totalItems: cart.totalItems,
    totalPrice: cart.totalPrice,
    isLoading: cart.isLoading,
    error: cart.error,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getItemQuantity,
    isInCart,
    clearError,
    loadCart,
  };
}