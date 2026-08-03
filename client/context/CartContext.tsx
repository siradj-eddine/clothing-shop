'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Cart } from '@/lib/types';
import { cartApi } from '@/lib/api';
import toast from 'react-hot-toast';

interface CartContextType {
  cart: Cart | null;
  isLoading: boolean;
  addToCart: (productId: number, quantity: number, size?: string, color?: string) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  totalItems: number;
  subtotal: string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCart = async () => {
    try {
      const data = await cartApi.get();
      setCart(data);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (productId: number, quantity: number, size?: string, color?: string) => {
    console.log('CartContext.addToCart called:', { productId, quantity, size, color });
    try {
      const updatedCart = await cartApi.add(productId, quantity, size, color);
      console.log('Cart updated:', updatedCart);
      setCart(updatedCart);
      toast.success('Added to cart!');
    } catch (error: any) {
      console.error('Add to cart error:', error);
      toast.error(error.response?.data?.error || 'Failed to add to cart');
    }
  };

  const updateQuantity = async (itemId: number, quantity: number) => {
    try {
      const updatedCart = await cartApi.update(itemId, quantity);
      setCart(updatedCart);
    } catch (error) {
      toast.error('Failed to update quantity');
    }
  };

  const removeItem = async (itemId: number) => {
    try {
      const updatedCart = await cartApi.remove(itemId);
      setCart(updatedCart);
      toast.success('Item removed');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const clearCart = async () => {
    try {
      await cartApi.clear();
      await fetchCart();
      toast.success('Cart cleared');
    } catch (error) {
      toast.error('Failed to clear cart');
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const totalItems = cart?.total_items || 0;
  const subtotal = cart?.total || '0.00';

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        totalItems,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
