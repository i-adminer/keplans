"use client";

import React, { useState, useEffect } from "react";
import { X, Trash2, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/cart";
import { toast } from "sonner";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { cartItems, removeFromCart, clearCart } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-background shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <ShoppingBag className="size-5" />
            <h2 className="text-lg font-semibold">
              Cart ({mounted ? cartItems.length : 0})
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {mounted && cartItems.length > 0 && (
              <button
                onClick={clearCart}
                className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1"
              >
                <Trash2 className="size-4" />
                <span className="hidden sm:inline">Clear all</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 hover:bg-muted-foreground/10 cursor-pointer rounded-full transition-colors"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        <div
          className="flex-1 overflow-y-auto p-4 space-y-4"
          style={{ maxHeight: "calc(100vh - 200px)" }}
        >
          {!mounted || cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64">
              <ShoppingBag className="size-16 mb-4" />
              <p>Your cart is empty</p>
              <Link
                href="/plans"
                onClick={onClose}
                className="text-muted-foreground hover:underline mt-2"
              >
                Start exploring plans
              </Link>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.id}
                className="flex gap-3 p-3 dark:bg-gray-50/10 bg-gray-50 shadow-2xl rounded-lg group"
              >
                <Link
                  href={`/product/${item.slug || item.id}`}
                  onClick={onClose}
                >
                  <div className="h-16 w-20">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={60}
                      height={100}
                      className="object-cover shrink-0 h-full w-full"
                      unoptimized
                    />
                  </div>
                </Link>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/product/${item.slug || item.id}`}
                    onClick={onClose}
                    className="font-medium transition-colors line-clamp-2"
                  >
                    {item.name}
                  </Link>
                  <p className="text-muted-foreground font-semibold mt-1">
                    KES {item.price.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="ml-auto p-1 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {mounted && cartItems.length > 0 && (
          <div className="border-t p-4 space-y-3">
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>KES {total.toLocaleString()}</span>
            </div>
            <Link
              href="/checkout"
              onClick={onClose}
              className="w-full py-3 bg-primary cursor-pointer text-white rounded-full font-semibold hover:bg-primary/90 transition-colors text-center block"
            >
              Checkout
            </Link>
            <button
              onClick={onClose}
              className="w-full py-2 text-sm cursor-pointer text-muted-foreground transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
