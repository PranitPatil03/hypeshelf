import "./globals.css";
import type { Metadata } from "next";
import { ConvexClientProvider } from "@/components/convex-client-provider";
import { Geist } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ClerkProvider } from "@clerk/nextjs";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider signInForceRedirectUrl="/shelf" signUpForceRedirectUrl="/shelf">
      <html lang="en">
        <body
          className={`${geistSans.variable} antialiased`}
        >
          <ConvexClientProvider>
            <TooltipProvider>
              {children}
            </TooltipProvider>
            <Toaster />
          </ConvexClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
