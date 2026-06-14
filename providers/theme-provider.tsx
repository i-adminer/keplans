import { ThemeProvider as NextThemes } from "next-themes";

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NextThemes attribute={"class"} enableSystem defaultTheme="system">
      {children}
    </NextThemes>
  );
}
