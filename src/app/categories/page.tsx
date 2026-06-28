import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { CATEGORIES, ARTWORKS } from "@/lib/data";

export const metadata: Metadata = {
  title: "Art Categories – Browse by Style",
  description:
    "Browse artworks by category: Oil Paintings, Watercolor, Calligraphy, Portraits, Sketches, Acrylics, and Abstract art.",
};

const CATEGORY_IMAGES: Record<string, string> = {
  "oil-painting": "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=600&q=80",
  "watercolor": "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=600&q=80",
  "calligraphy": "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=600&q=80",
  "portrait": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&q=80",
  "sketch": "https://images.unsplash.com/photo-1589578527966-fdac0f44566c?w=600&q=80",
  "acrylic": "https://images.unsplash.com/photo-1490750967868-88df5691cc52?w=600&q=80",
  "abstract": "https://images.unsplash.com/photo-1541367777708-7905fe3296c0?w=600&q=80",
};

export default function CategoriesPage() {
  return (
    <div>
      <div className="relative bg-stone-900 py-14 overflow-hidden" suppressHydrationWarning>
        <div suppressHydrationWarning className="absolute inset-0">
          <Image
            src="/background-section-main.webp"
            alt="Art background"
            fill
            className="object-cover opacity-30"
          />
          <div suppressHydrationWarning className="absolute inset-0 bg-stone-900/70" />
        </div>
        <div suppressHydrationWarning className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-amber-400 text-sm font-medium uppercase tracking-widest">
            Explore
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mt-2 mb-3">
            Art Categories
          </h1>
          <p className="text-stone-400 max-w-md mx-auto">
            Each category represents a distinct artistic tradition and expression. 
            Find what resonates with you.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((cat) => {
            const artworks = ARTWORKS.filter(
              (a) => a.category.toLowerCase() === cat.name.toLowerCase()
            );
            const coverImage = CATEGORY_IMAGES[cat.slug] || artworks[0]?.images[0];

            return (
              <Link
                key={cat.id}
                href={`/gallery?category=${cat.slug}`}
                className="group relative overflow-hidden rounded-2xl bg-stone-100 aspect-4/3 block"
              >
                {coverImage && (
                  <Image
                    src={coverImage}
                    alt={cat.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                )}
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h2 className="text-white font-bold text-xl mb-1">{cat.name}</h2>
                  <p className="text-stone-300 text-sm mb-2">{cat.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-amber-400 text-xs font-medium">
                      {artworks.length} artwork{artworks.length !== 1 ? "s" : ""}
                    </span>
                    <span className="flex items-center gap-1 text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      Browse <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
