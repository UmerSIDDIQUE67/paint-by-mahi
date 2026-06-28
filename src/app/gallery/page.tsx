import React, { Suspense } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import GalleryClient from "./GalleryClient";

export const metadata: Metadata = {
  title: "Art Gallery – Browse All Artworks",
  description:
    "Browse original handmade paintings, calligraphy, portraits, sketches and more. Filter by category, price, and style. Order securely online.",
};

export default function GalleryPage() {
  return (
    <div suppressHydrationWarning>
      {/* Header */}
      <div suppressHydrationWarning className="relative bg-stone-900 py-14 overflow-hidden">
        <div suppressHydrationWarning className="absolute inset-0">
          <Image
            src="/background-section-main.webp"
            alt="Art background"
            fill
            className="object-cover opacity-30"
            priority
          />
          <div suppressHydrationWarning className="absolute inset-0 bg-stone-900/70" />
        </div>
        <div suppressHydrationWarning className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-amber-400 text-sm font-medium uppercase tracking-widest">
            The Collection
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mt-2 mb-3">
            Art Gallery
          </h1>
          <p className="text-stone-400 max-w-xl mx-auto">
            Every piece is an original — browse the full collection of paintings, calligraphy,
            portraits, and mixed media works.
          </p>
        </div>
      </div>

      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading gallery...</div>}>
        <GalleryClient />
      </Suspense>
    </div>
  );
}
