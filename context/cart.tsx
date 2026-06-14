"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { ProductItem, CartItem } from "@/types/cart";

interface CartContextType {
  cartItems: CartItem[];
  wishlistItems: ProductItem[];
  addToCart: (product: ProductItem) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  updateQuantity: (productId: string, quantity: number) => void;
  addToWishlist: (product: ProductItem) => void;
  removeFromWishlist: (productId: string) => void;
  clearWishlist: () => void;
  moveToCart: (productId: string) => void;
  isInCart: (productId: string) => boolean;
  isInWishlist: (productId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Mock initial products for demonstration
const mockCart: CartItem[] = [
  {
    id: "1",
    name: "Modern Farmhouse Plan",
    image: "/herobg/hbg-2.jpg",
    price: 199.99,
    quantity: 1,
  },
  {
    id: "2",
    name: "Contemporary Villa Design",
    image: "/herobg/hbg-2.jpg",
    price: 249.99,
    quantity: 1,
  },
];

const mockWishlist: ProductItem[] = [
  {
    id: "3",
    name: "Traditional Bungalow Blueprint",
    image: "/herobg/hbg-2.jpg",
    price: 179.99,
  },
];

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>(mockCart);
  const [wishlistItems, setWishlistItems] =
    useState<ProductItem[]>(mockWishlist);

  const addToCart = useCallback((product: ProductItem) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      if (quantity < 1) {
        removeFromCart(productId);
        return;
      }
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === productId ? { ...item, quantity } : item,
        ),
      );
    },
    [removeFromCart],
  );

  const addToWishlist = useCallback((product: ProductItem) => {
    setWishlistItems((prev) => {
      if (prev.some((item) => item.id === product.id)) return prev;
      return [...prev, product];
    });
  }, []);

  const removeFromWishlist = useCallback((productId: string) => {
    setWishlistItems((prev) => prev.filter((item) => item.id !== productId));
  }, []);

  const clearWishlist = useCallback(() => {
    setWishlistItems([]);
  }, []);

  const moveToCart = useCallback(
    (productId: string) => {
      setWishlistItems((prev) => {
        const product = prev.find((item) => item.id === productId);
        if (product) {
          addToCart(product);
          return prev.filter((item) => item.id !== productId);
        }
        return prev;
      });
    },
    [addToCart],
  );

  const isInCart = useCallback(
    (productId: string) => cartItems.some((item) => item.id === productId),
    [cartItems],
  );

  const isInWishlist = useCallback(
    (productId: string) => wishlistItems.some((item) => item.id === productId),
    [wishlistItems],
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        wishlistItems,
        addToCart,
        removeFromCart,
        clearCart,
        updateQuantity,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
        moveToCart,
        isInCart,
        isInWishlist,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
