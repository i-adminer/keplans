// Hero.tsx
"use client";

import { Search, X, Filter, TrendingUp, Clock, Star } from "lucide-react";
import Image from "next/image";
import { DonutSelector } from "./doughnut-selector";
import { useState, useEffect, useRef } from "react";

interface SearchResult {
  id: string;
  title: string;
  category: string;
  image: string;
  price: string;
  rating: number;
}

interface SearchSuggestion {
  id: string;
  text: string;
  type: "recent" | "trending" | "category";
}

const Hero: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isClosing, setIsClosing] = useState<boolean>(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchOverlayRef = useRef<HTMLDivElement>(null);

  // Mock data
  const searchSuggestions: SearchSuggestion[] = [
    { id: "1", text: "Modern farmhouse plans", type: "trending" },
    { id: "2", text: "3 bedroom bungalow", type: "recent" },
    { id: "3", text: "Contemporary style", type: "category" },
    { id: "4", text: "Under 200 sqm", type: "trending" },
    { id: "5", text: "Budget friendly homes", type: "recent" },
  ];

  const searchResults: SearchResult[] = [
    {
      id: "1",
      title: "Modern Farmhouse",
      category: "Farmhouse",
      image: "/herobg/hbg-2.jpg",
      price: "$150,000 - $200,000",
      rating: 4.8,
    },
    {
      id: "2",
      title: "Contemporary Villa",
      category: "Contemporary",
      image: "/herobg/hbg-2.jpg",
      price: "$250,000 - $350,000",
      rating: 4.6,
    },
    {
      id: "3",
      title: "Traditional Bungalow",
      category: "Traditional",
      image: "/herobg/hbg-2.jpg",
      price: "$120,000 - $180,000",
      rating: 4.9,
    },
  ];

  const handleOpenSearch = (): void => {
    setIsSearchOpen(true);
    setIsClosing(false);
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 100);
  };

  const handleCloseSearch = (): void => {
    setIsClosing(true);
    setTimeout(() => {
      setIsSearchOpen(false);
      setIsClosing(false);
      setSearchQuery("");
    }, 300);
  };

  const handleSearchInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setSearchQuery(e.target.value);
  };

  const handleSuggestionClick = (suggestion: string): void => {
    setSearchQuery(suggestion);
  };

  const handleResultClick = (result: SearchResult): void => {
    console.log("Selected:", result);
    handleCloseSearch();
  };

  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent): void => {
      if (e.key === "Escape") {
        handleCloseSearch();
      }
    };

    const handleClickOutside = (e: MouseEvent): void => {
      if (
        searchOverlayRef.current &&
        !searchOverlayRef.current.contains(e.target as Node)
      ) {
        handleCloseSearch();
      }
    };

    if (isSearchOpen) {
      document.addEventListener("keydown", handleEscapeKey);
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isSearchOpen]);

  const filteredResults = searchQuery
    ? searchResults.filter(
        (result) =>
          result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          result.category.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : searchResults;

  const filteredSuggestions = searchQuery
    ? searchSuggestions.filter((suggestion) =>
        suggestion.text.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : searchSuggestions;

  const getSuggestionIcon = (type: SearchSuggestion["type"]) => {
    switch (type) {
      case "recent":
        return <Clock className="size-4 text-gray-400" />;
      case "trending":
        return <TrendingUp className="size-4 text-gray-400" />;
      case "category":
        return <Filter className="size-4 text-gray-400" />;
      default:
        return <Search className="size-4 text-gray-400" />;
    }
  };

  return (
    <div className="relative h-[70vh] w-full pt-20 overflow-hidden">
      <div className="h-12 w-full flex justify-center items-center">
        <div className="relative sm:w-[50%] w-[80%] rounded-full bg-primary text-white pr-2 pl-8 overflow-hidden">
          <input
            type="search"
            className="outline-0 py-1 w-full placeholder:text-sm"
            placeholder="Search for your dream house..."
            onClick={handleOpenSearch}
            readOnly
          />
          <Search className="absolute inset-y-0 left-2 m-auto size-4" />
        </div>
      </div>

      {/* Hero Image & Content */}
      <div className="relative w-full h-full">
        <Image
          src={"/herobg/hbg-2.jpg"}
          alt="Hero background image"
          fill
          priority
          className="object-cover z-0"
        />
        <div className="z-10 absolute inset-0 flex flex-col justify-center items-center gap-y-5">
          <span className="lg:text-7xl text-5xl font-realce text-white font-black text-center px-4">
            Your blueprint for smarter living!
          </span>
          <DonutSelector />
        </div>
      </div>

      {/* Full-Screen Search Overlay */}
      {isSearchOpen && (
        <div
          className={`fixed inset-0 z-50 flex items-start justify-center pt-20 transition-all duration-300 ${
            isClosing ? "opacity-0" : "opacity-100"
          }`}
        >
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-md"
            onClick={handleCloseSearch}
          />

          <div
            ref={searchOverlayRef}
            className={`relative w-full max-w-2xl mx-4 bg-background rounded-md shadow-2xl transition-all duration-300 ${
              isClosing ? "scale-95 opacity-0" : "scale-100 opacity-100"
            }`}
          >
            {/* Search Input in Dialog */}
            <div className="flex items-center gap-3 p-4 border-b ">
              <Search className="size-6 text-muted-foreground shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={handleSearchInputChange}
                placeholder="Search styles, sizes, or browse..."
                className="w-full text-lg outline-hidden bg-transparent placeholder:text-sm  placeholder:text-gray-400"
              />
              <button
                onClick={handleCloseSearch}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors shrink-0"
              >
                <X className="size-5 text-muted-foreground" />
              </button>
            </div>

            {/* Search Content */}
            <div className="max-h-[60vh] overflow-y-auto p-4">
              {!searchQuery ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                      Suggestions
                    </h3>
                    <div className="space-y-2">
                      {filteredSuggestions.map((suggestion) => (
                        <button
                          key={suggestion.id}
                          onClick={() => handleSuggestionClick(suggestion.text)}
                          className="flex items-center gap-3 w-full cursor-pointer p-3 hover:bg-gray-50/10 rounded-lg transition-colors text-left group"
                        >
                          {getSuggestionIcon(suggestion.type)}
                          <span className="  transition-colors">
                            {suggestion.text}
                          </span>
                          <Search className="size-4 text-gray-300 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                      Popular Categories
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "Modern",
                        "Traditional",
                        "Farmhouse",
                        "Bungalow",
                        "Contemporary",
                      ].map((category) => (
                        <button
                          key={category}
                          onClick={() => handleSuggestionClick(category)}
                          className="px-4 py-2 bg-gray-100/10 hover:bg-primary/10 cursor-pointer rounded-md text-sm font-medium transition-colors"
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">
                      {filteredResults.length} results
                    </span>
                  </div>

                  {filteredResults.length > 0 ? (
                    <div className="space-y-3">
                      {filteredResults.map((result) => (
                        <button
                          key={result.id}
                          onClick={() => handleResultClick(result)}
                          className="flex items-center gap-4 w-full p-3 cursor-pointer hover:bg-gray-50/10 rounded-lg transition-colors group"
                        >
                          <div className=" h-16 w-20">
                            <Image
                              src={result.image}
                              alt={result.title}
                              width={60}
                              height={100}
                              className=" object-cover shrink-0 h-full w-full"
                            />
                          </div>
                          <div className="flex-1 text-left">
                            <h4 className="font-semibold  transition-colors">
                              {result.title}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {result.category}
                            </p>
                            <p className="text-sm font-medium text-green-600 mt-1">
                              {result.price}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <Star className="size-4 text-yellow-400 fill-yellow-400" />
                            <span className="font-medium">{result.rating}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Search className="size-7 sm:size-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        No results found for &quot;{searchQuery}&quot;
                      </p>
                      <p className="text-sm text-gray-400 mt-2">
                        Try adjusting your search or browse categories
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t  p-4 flex items-center justify-between text-sm text-muted-foreground">
              <span className="max-sm:hidden">Press ESC to close</span>{" "}
              <span className="sm:hidden" />
              <button className="flex items-center gap-2  transition-colors">
                <Filter className="size-4" />
                <span>Advanced Filters</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Hero;
