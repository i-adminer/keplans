"use client";

import React, { useState, useRef, useEffect } from "react";
import ThemeSwitcher from "../theme-switcher";
import { Heart, ShoppingCart, User, ChevronDown } from "lucide-react";
import Logo from "../logo";
import StylesDropdown, { StylesMobileContent } from "./StylesDropdown";
import SizesDropdown, { SizesMobileContent } from "./SizesDropdown";
import BudgetDropdown, { BudgetMobileContent } from "./BudgetDropdown";
import Link from "next/link";
import CartDrawer from "../drawers/cart";
import WishlistDrawer from "../drawers/wish";
import { useCart } from "@/context/cart";

type DropdownType = "styles" | "sizes" | "budget" | null;

interface NavItem {
  label: string;
  href?: string;
  dropdown?: DropdownType;
}

const Navbar: React.FC = () => {
  const [activeDropdown, setActiveDropdown] = useState<DropdownType>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [cartOpen, setCartOpen] = useState<boolean>(false);
  const [wishlistOpen, setWishlistOpen] = useState<boolean>(false);
  const navbarRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { cartItems, wishlistItems } = useCart();

  const handleMouseEnter = (dropdown: DropdownType): void => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setActiveDropdown(dropdown);
  };

  const handleMouseLeave = (): void => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 200);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const navItems: NavItem[] = [
    { label: "Explore", href: "/plans" },
    { label: "Styles", dropdown: "styles" },
    { label: "Sizes", dropdown: "sizes" },
    { label: "Your Budget?", dropdown: "budget" },
    { label: "Reach Us", href: "/contact-us" },
  ];

  return (
    <>
      <nav className="fixed w-full top-0 z-40" ref={navbarRef}>
        <div className="w-full md:w-[75%] bg-primary text-white md:rounded-b-2xl mx-auto transition-all duration-300">
          <div className="h-20 flex justify-between items-center px-4 md:px-6">
            <Link href={"/"}>
              <Logo />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex text-white justify-between items-center gap-7 font-semibold text-sm">
              {navItems.map((item, index) => (
                <div
                  key={index}
                  className="relative"
                  onMouseEnter={() =>
                    item.dropdown && handleMouseEnter(item.dropdown)
                  }
                  onMouseLeave={handleMouseLeave}
                >
                  {item.dropdown ? (
                    <button className="flex cursor-pointer items-center gap-1 hover:text-gray-200 transition-colors py-2">
                      {item.label}
                      <ChevronDown className="size-4" />
                    </button>
                  ) : (
                    <Link
                      href={item.href!}
                      className="hover:text-gray-200 transition-colors py-2"
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* Icons */}
            <div className="flex justify-between items-center gap-3 md:gap-4">
              <button
                onClick={() => setWishlistOpen(true)}
                className="relative"
                aria-label="Open wishlist"
              >
                <Heart className="text-white cursor-pointer size-5 hover:text-gray-200 transition-colors" />
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {wishlistItems.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setCartOpen(true)}
                className="relative"
                aria-label="Open cart"
              >
                <ShoppingCart className="text-white cursor-pointer size-5 hover:text-gray-200 transition-colors" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </button>
              <Link href="/signin" aria-label="Open account sign in">
                <User className="text-white cursor-pointer size-5 hover:text-gray-200 transition-colors" />
              </Link>
              <ThemeSwitcher />

              {/* Mobile Menu Button */}
              <button
                className="lg:hidden text-white ml-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle mobile menu"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {mobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Dropdowns */}
          {activeDropdown === "styles" && (
            <div
              onMouseEnter={() => handleMouseEnter("styles")}
              onMouseLeave={handleMouseLeave}
            >
              <StylesDropdown />
            </div>
          )}
          {activeDropdown === "sizes" && (
            <div
              onMouseEnter={() => handleMouseEnter("sizes")}
              onMouseLeave={handleMouseLeave}
            >
              <SizesDropdown />
            </div>
          )}
          {activeDropdown === "budget" && (
            <div
              onMouseEnter={() => handleMouseEnter("budget")}
              onMouseLeave={handleMouseLeave}
            >
              <BudgetDropdown />
            </div>
          )}

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden bg-primary text-white px-4 pb-6">
              {navItems.map((item, index) => (
                <div key={index} className="py-3 border-b border-white/10">
                  {item.dropdown ? (
                    <MobileDropdownItem
                      label={item.label}
                      type={item.dropdown}
                    />
                  ) : (
                    <Link href={item.href!} className="block hover:text-gray-200">
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Cart Drawer */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      {/* Wishlist Drawer */}
      <WishlistDrawer
        isOpen={wishlistOpen}
        onClose={() => setWishlistOpen(false)}
      />
    </>
  );
};

// Mobile Dropdown Item Component (same as before)
interface MobileDropdownItemProps {
  label: string;
  type: DropdownType;
}

const MobileDropdownItem: React.FC<MobileDropdownItemProps> = ({
  label,
  type,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div>
      <button
        className="flex items-center justify-between w-full hover:text-gray-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        {label}
        <ChevronDown
          className={`size-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen && (
        <div className="mt-2 pl-4">
          {type === "styles" && <StylesMobileContent />}
          {type === "sizes" && <SizesMobileContent />}
          {type === "budget" && <BudgetMobileContent />}
        </div>
      )}
    </div>
  );
};

export default Navbar;
