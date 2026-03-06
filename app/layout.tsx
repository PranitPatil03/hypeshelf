import "./globals.css";
import type { Metadata } from "next";
import { ConvexClientProvider } from "@/components/convex-client-provider";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "hypeshelf",
  description: "collect and share the movies you're hyped about",
  openGraph: {
    title: "hypeshelf",
    description: "collect and share the movies you're hyped about",
    url: "https://hypeshelf.vercel.app",
    siteName: "hypeshelf",
    images: [
      {
        url: "https://hypeshelf.vercel.app/images/bg-banners/og-image.png",
        width: 1200,
        height: 630,
        alt: "hypeshelf",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexClientProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <TooltipProvider>
            {children}
          </TooltipProvider>
          <Toaster />
        </body>
      </html>
    </ConvexClientProvider>
  );
}
