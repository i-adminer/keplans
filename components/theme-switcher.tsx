"use client";

import { useTheme } from "next-themes";
import { MoonStar, Sun } from "lucide-react";

const ThemeSwitcher = ({ col }: { col?: string }) => {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      type="button"
      className="cursor-pointer transition-colors "
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
    >
      <Sun className="hidden size-5 text-white dark:block" />
      <MoonStar className={`size-5  ${col ? col : "text-white"} dark:hidden`} />
    </button>
  );
};

export default ThemeSwitcher;
