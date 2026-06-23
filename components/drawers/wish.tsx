"use client";

import React from "react";
import { X, Trash2, Heart, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/cart";

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const WishlistDrawer: React.FC<WishlistDrawerProps> = ({ isOpen, onClose }) => {
  const { wishlistItems, removeFromWishlist, clearWishlist, moveToCart } =
    useCart();

  const handleMoveToCart = (productId: string) => {
    moveToCart(productId);
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-background shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b ">
          <div className="flex items-center gap-2">
            <Heart className="size-5 text-red-500 fill-red-500" />
            <h2 className="text-lg font-semibold ">
              Wishlist ({wishlistItems.length})
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {wishlistItems.length > 0 && (
              <button
                onClick={clearWishlist}
                className="text-sm text-red-500  flex items-center gap-1 "
              >
                <Trash2 className="size-4" />
                <span className="hidden sm:inline">Clear all</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 cursor-pointer rounded-full transition-colors"
            >
              <X className="size-5 " />
            </button>
          </div>
        </div>

        {/* Items */}
        <div
          className="flex-1 overflow-y-auto p-4 space-y-4"
          style={{ maxHeight: "calc(100vh - 80px)" }}
        >
          {wishlistItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64  ">
              <Heart className="size-16 mb-4" />
              <p>Your wishlist is empty</p>
              <Link
                href="/explore"
                onClick={onClose}
                className="text-muted-foreground hover:underline mt-2"
              >
                Discover plans you&apos;ll love
              </Link>
            </div>
          ) : (
            wishlistItems.map((item) => (
              <div
                key={item.id}
                className="flex gap-3 p-3 bg-gray-50 dark:bg-gray-50/10 shadow-2xl rounded-lg group"
              >
                <Link
                  href={`/product/${item.slug || item.id}`}
                  onClick={onClose}
                >
                  <div className=" h-16 w-20">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={60}
                      height={100}
                      unoptimized
                      className=" object-cover shrink-0 h-full w-full"
                    />
                  </div>
                </Link>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/product/${item.id}`}
                    onClick={onClose}
                    className="font-medium   transition-colors line-clamp-2"
                  >
                    {item.name}
                  </Link>
                  <p className=" font-semibold mt-1">
                    KES {item.price.toFixed(2)}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => handleMoveToCart(item.id)}
                      className="flex items-center gap-1 px-3 py-1 cursor-pointer bg-primary text-white rounded-full text-sm hover:bg-primary/90 transition-colors"
                    >
                      <ShoppingCart className="size-3" />
                      <span>Move to Cart</span>
                    </button>
                    <button
                      onClick={() => removeFromWishlist(item.id)}
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
      </div>
    </>
  );
};

export default WishlistDrawer;
