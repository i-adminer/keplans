"use client";

import { useTheme } from "next-themes";
import { MoonStar, Sun } from "lucide-react";

const ThemeSwitcher = () => {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      type="button"
      className=" cursor-pointer"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
    >
      <Sun className="hidden size-5 dark:block" />
      <MoonStar className="size-5 text-white dark:hidden" />
    </button>
  );
};

export default ThemeSwitcher;
