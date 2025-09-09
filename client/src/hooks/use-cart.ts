import { useState, useCallback } from 'react';
import type { Product } from '@shared/schema';

interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

export function useCart() {
  const [cart, setCart] = useState<CartState>({
    items: [],
    totalItems: 0,
    totalPrice: 0,
  });

  const calculateTotals = useCallback((items: CartItem[]) => {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
    return { totalItems, totalPrice };
  }, []);

  const addToCart = useCallback((product: Product, quantity: number = 1) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.items.findIndex(item => item.id === product.id);
      
      let newItems: CartItem[];
      if (existingItemIndex > -1) {
        // Update existing item quantity
        newItems = prevCart.items.map((item, index) => 
          index === existingItemIndex 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item
        newItems = [...prevCart.items, { ...product, quantity }];
      }

      const { totalItems, totalPrice } = calculateTotals(newItems);
      
      return {
        items: newItems,
        totalItems,
        totalPrice,
      };
    });
  }, [calculateTotals]);

  const removeFromCart = useCallback((productId: string) => {
    setCart(prevCart => {
      const newItems = prevCart.items.filter(item => item.id !== productId);
      const { totalItems, totalPrice } = calculateTotals(newItems);
      
      return {
        items: newItems,
        totalItems,
        totalPrice,
      };
    });
  }, [calculateTotals]);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(prevCart => {
      const newItems = prevCart.items.map(item =>
        item.id === productId ? { ...item, quantity } : item
      );
      const { totalItems, totalPrice } = calculateTotals(newItems);
      
      return {
        items: newItems,
        totalItems,
        totalPrice,
      };
    });
  }, [calculateTotals, removeFromCart]);

  const clearCart = useCallback(() => {
    setCart({
      items: [],
      totalItems: 0,
      totalPrice: 0,
    });
  }, []);

  const getItemQuantity = useCallback((productId: string): number => {
    const item = cart.items.find(item => item.id === productId);
    return item?.quantity || 0;
  }, [cart.items]);

  const isInCart = useCallback((productId: string): boolean => {
    return cart.items.some(item => item.id === productId);
  }, [cart.items]);

  return {
    items: cart.items,
    totalItems: cart.totalItems,
    totalPrice: cart.totalPrice,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getItemQuantity,
    isInCart,
  };
}
