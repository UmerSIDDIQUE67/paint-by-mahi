import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ClientShell from "@/components/ClientShell";
import Footer from "@/components/layout/Footer";
import StoreHydration from "@/components/StoreHydration";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Paint by Mahi – Handmade Paintings, Custom Canvas & Calligraphy Art",
    template: "%s | Paint by Mahi",
  },
  description:
    "Discover handmade paintings, custom canvas portraits, Islamic calligraphy, and sketch artworks by Mahi. Order original art online. Shipping across Pakistan and worldwide.",
  keywords: [
    "Paint by Mahi",
    "handmade paintings Pakistan",
    "custom canvas paintings",
    "portrait sketch artist",
    "calligraphy art Pakistan",
    "Islamic calligraphy",
    "buy paintings online Pakistan",
    "original artwork",
    "custom art commission",
    "oil paintings",
    "watercolor paintings",
  ],
  authors: [{ name: "Mahi", url: "https://paintbymahi.com" }],
  creator: "Paint by Mahi",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://paintbymahi.com",
    siteName: "Paint by Mahi",
    title: "Paint by Mahi – Handmade Paintings & Custom Art",
    description:
      "Original handmade paintings, calligraphy, portraits, and custom canvas artwork by Mahi. Order online with secure payment.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Paint by Mahi – Art Gallery",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Paint by Mahi – Handmade Art Gallery",
    description: "Original handmade paintings, calligraphy & custom artwork",
    images: [
      "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=1200&q=80",
    ],
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
  alternates: {
    canonical: "https://paintbymahi.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        {/* ClientShell: Navbar + Toaster loaded client-only (ssr: false) */}
        <ClientShell>
          <main className="flex-1">{children}</main>
        </ClientShell>
        <Footer />
        <StoreHydration />
      </body>
    </html>
  );
}
