"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Heart, ArrowRight } from "lucide-react";
import { useWishlistStore, useArtworkStore } from "@/lib/store";
import ArtworkCard from "@/components/artwork/ArtworkCard";
import { Button } from "@/components/ui/button";

export default function WishlistPage() {
  const { items } = useWishlistStore();
  const { artworks, hydrated, hydrate } = useArtworkStore();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const source = hydrated ? artworks : [];
  const wishlisted = source.filter((a) => items.includes(a.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-3 mb-8">
        <Heart className="w-7 h-7 text-red-500 fill-red-500" />
        <h1 className="text-3xl font-bold text-stone-800">My Wishlist</h1>
        {wishlisted.length > 0 && (
          <span className="ml-auto text-stone-500 text-sm">
            {wishlisted.length} {wishlisted.length === 1 ? "item" : "items"}
          </span>
        )}
      </div>

      {wishlisted.length === 0 ? (
        <div className="text-center py-24">
          <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-6">
            <Heart className="w-10 h-10 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-stone-800 mb-2">
            Your wishlist is empty
          </h2>
          <p className="text-stone-500 mb-8">
            Browse the gallery and click the heart icon to save artworks you love.
          </p>
          <Button asChild variant="gold" size="lg">
            <Link href="/gallery">
              Browse Gallery <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {wishlisted.map((artwork) => (
            <ArtworkCard key={artwork.id} artwork={artwork} />
          ))}
        </div>
      )}
    </div>
  );
}
