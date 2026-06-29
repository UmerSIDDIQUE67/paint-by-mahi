"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, ShoppingCart, Eye, Star } from "lucide-react";
import { Artwork } from "@/lib/data";
import { useCartStore, useWishlistStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";

interface ArtworkCardProps {
  artwork: Artwork;
}

export default function ArtworkCard({ artwork }: ArtworkCardProps) {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const toggleWishlist = useWishlistStore((s) => s.toggleWishlist);
  const isWishlisted = useWishlistStore((s) => s.isWishlisted);

  // Defer wishlist read to client-only to avoid SSR/client mismatch
  const [wishlisted, setWishlisted] = useState(false);
  useEffect(() => {
    setWishlisted(isWishlisted(artwork.id));
  }, [artwork.id, isWishlisted]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (artwork.stock === 0) return;
    addItem({
      id: artwork.id,
      title: artwork.title,
      price: artwork.price,
      image: artwork.images[0],
      quantity: 1,
      category: artwork.category,
    });
    toast.success(`"${artwork.title}" added to cart!`, {
      style: { background: "#1c0a00", color: "#fef3c7" },
    });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(artwork.id);
    const nowWishlisted = !wishlisted;
    setWishlisted(nowWishlisted);
    toast(nowWishlisted ? "Added to wishlist" : "Removed from wishlist", {
      style: { background: "#1c0a00", color: "#fef3c7" },
    });
  };

  const href = `/artwork/${artwork.id}`;

  return (
    <div className="artwork-card group relative bg-white rounded-2xl overflow-hidden border border-[#e8d0cc] shadow-sm hover:border-[#c9858f]/40">
      {/* Image */}
      <Link href={href} className="block relative">
        <div className="relative aspect-4/5 overflow-hidden bg-[#faf0e6]">
          <Image
            src={artwork.images[0]} alt={artwork.title} fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-[#1a0d10]/0 group-hover:bg-[#1a0d10]/15 transition-all duration-300" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {artwork.featured && <Badge variant="gold" className="text-[10px] shadow-sm">Featured</Badge>}
            {artwork.stock === 0 && <Badge variant="destructive" className="text-[10px]">Sold Out</Badge>}
            {artwork.stock === 1 && <Badge variant="warning" className="text-[10px]">Last One!</Badge>}
          </div>

          {/* Wishlist */}
          <button onClick={handleWishlist}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-sm transition-all hover:scale-110"
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}>
            <Heart className={`w-4 h-4 transition-colors ${wishlisted ? "fill-[#b76e79] text-[#b76e79]" : "text-[#2d1a1f]/30"}`} />
          </button>

          {/* Quick view */}
          <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <div role="button" tabIndex={0}
              onClick={(e) => { e.preventDefault(); router.push(href); }}
              onKeyDown={(e) => e.key === "Enter" && router.push(href)}
              className="flex items-center justify-center gap-2 w-full bg-white/95 hover:bg-white text-[#1a0d10] text-xs font-medium py-2 rounded-xl shadow-sm cursor-pointer">
              <Eye className="w-3.5 h-3.5" /> Quick View
            </div>
          </div>
        </div>
      </Link>

      {/* Info */}
      <div className="p-4 bg-white">
        <div className="mb-1">
          <Link href={href}
            className="font-semibold text-[#1a0d10] text-sm leading-tight hover:text-[#b76e79] transition-colors line-clamp-2 block">
            {artwork.title}
          </Link>
        </div>
        <p className="text-xs text-[#b76e79]/70 mb-2">{artwork.category}</p>
        <div className="flex items-center gap-0.5 mb-3">
          {[1,2,3,4,5].map((star) => (
            <Star key={star} className="w-3 h-3 fill-[#e8b4b8] text-[#e8b4b8]" />
          ))}
          <span className="text-xs text-[#2d1a1f]/40 ml-1">(5.0)</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-base font-bold text-[#1a0d10]">{formatPrice(artwork.price)}</span>
            {artwork.dimensions && <p className="text-xs text-[#2d1a1f]/40 mt-0.5">{artwork.dimensions}</p>}
          </div>
          <button onClick={handleAddToCart} disabled={artwork.stock === 0}
            className="w-9 h-9 rounded-full disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center shadow-sm transition-all hover:scale-105 active:scale-95"
            style={{background:'linear-gradient(135deg, #b76e79, #d4a0a8)'}}
            aria-label="Add to cart">
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
