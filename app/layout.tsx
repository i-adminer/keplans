import type { Metadata } from "next";
import { Inter, Playfair_Display, Pacifico } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/providers/theme-provider";
import DevConsoleErrorFilter from "@/components/dev-console-error-filter";
import { CartProvider } from "@/context/cart";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const pacifico = Pacifico({
  subsets: ["latin"],
  variable: "--font-pacifico",
  weight: "400",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: {
    default: "KEPlans - Premium House Plans & Architectural Designs",
    template: "%s | KEPlans",
  },
  description: "Browse thousands of premium house plans and architectural designs. Modern, contemporary, farmhouse, and traditional styles. Customizable floor plans for your dream home.",
  keywords: ["house plans", "home designs", "floor plans", "architectural plans", "modern house plans", "custom home designs", "building plans"],
  authors: [{ name: "KEPlans" }],
  creator: "KEPlans",
  publisher: "KEPlans",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://keplans.com"),
  openGraph: {
    title: "KEPlans - Premium House Plans & Architectural Designs",
    description: "Browse thousands of premium house plans and architectural designs. Find your perfect home design today.",
    url: "https://keplans.com",
    siteName: "KEPlans",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/herobg/hbg-1.jpg",
        width: 1200,
        height: 630,
        alt: "KEPlans House Designs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "KEPlans - Premium House Plans & Architectural Designs",
    description: "Browse thousands of premium house plans and architectural designs. Find your perfect home design today.",
    images: ["/herobg/hbg-1.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} ${pacifico.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <DevConsoleErrorFilter />
        <ThemeProvider>
          <CartProvider>{children}</CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
