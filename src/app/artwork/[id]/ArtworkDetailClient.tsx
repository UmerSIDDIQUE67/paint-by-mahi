"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingCart,
  Heart,
  Share2,
  Star,
  ChevronLeft,
  Truck,
  Shield,
  Award,
  ZoomIn,
} from "lucide-react";
import { Artwork, REVIEWS } from "@/lib/data";
import { useCartStore, useWishlistStore } from "@/lib/store";
import { formatPrice, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ArtworkCard from "@/components/artwork/ArtworkCard";
import toast from "react-hot-toast";

interface Props {
  artwork: Artwork;
  related: Artwork[];
}

export default function ArtworkDetailClient({ artwork, related }: Props) {
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [zoomOpen, setZoomOpen] = useState(false);

  const addItem = useCartStore((s) => s.addItem);
  const { toggleWishlist, isWishlisted } = useWishlistStore();
  const wishlisted = isWishlisted(artwork.id);

  const artworkReviews = REVIEWS.filter((r) => r.artworkId === artwork.id);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: artwork.id,
        title: artwork.title,
        price: artwork.price,
        image: artwork.images[0],
        quantity: 1,
        category: artwork.category,
      });
    }
    toast.success(`Added to cart!`, {
      style: { background: "#1c0a00", color: "#fef3c7" },
    });
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: artwork.title,
        text: artwork.description.slice(0, 100),
        url: window.location.href,
      });
    } catch {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-stone-500 mb-6">
        <Link href="/" className="hover:text-amber-700">Home</Link>
        <span>/</span>
        <Link href="/gallery" className="hover:text-amber-700">Gallery</Link>
        <span>/</span>
        <span className="text-stone-800 font-medium line-clamp-1">{artwork.title}</span>
      </nav>

      {/* Back */}
      <Link
        href="/gallery"
        className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-amber-700 mb-6 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Gallery
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* ── Images ── */}
        <div>
          {/* Main image */}
          <div
            className="relative aspect-4/5 rounded-2xl overflow-hidden bg-stone-100 mb-3 cursor-zoom-in"
            onClick={() => setZoomOpen(true)}
          >
            <Image
              src={artwork.images[activeImage]}
              alt={artwork.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
            <div className="absolute top-3 right-3 bg-white/80 rounded-full p-2">
              <ZoomIn className="w-4 h-4 text-stone-600" />
            </div>
            {artwork.stock === 0 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="bg-red-500 text-white px-4 py-2 rounded-full font-bold text-lg">
                  SOLD
                </span>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {artwork.images.length > 1 && (
            <div className="flex gap-3">
              {artwork.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden shrink-0 transition-all ${
                    activeImage === idx
                      ? "ring-2 ring-amber-700 ring-offset-2"
                      : "opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${artwork.title} view ${idx + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Zoom modal */}
          {zoomOpen && (
            <div
              className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
              onClick={() => setZoomOpen(false)}
            >
              <div className="relative max-w-3xl max-h-[90vh] w-full">
                <Image
                  src={artwork.images[activeImage]}
                  alt={artwork.title}
                  width={900}
                  height={1100}
                  className="object-contain rounded-xl max-h-[85vh] w-auto mx-auto"
                />
                <button
                  onClick={() => setZoomOpen(false)}
                  className="absolute top-3 right-3 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Details ── */}
        <div>
          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge variant="secondary">{artwork.category}</Badge>
            {artwork.featured && <Badge variant="gold">Featured</Badge>}
            {artwork.stock === 0 ? (
              <Badge variant="destructive">Sold Out</Badge>
            ) : (
              <Badge variant="success">In Stock</Badge>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-stone-900 mb-3">
            {artwork.title}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-sm text-stone-500">
              ({artworkReviews.length} {artworkReviews.length === 1 ? "review" : "reviews"})
            </span>
          </div>

          {/* Price */}
          <div className="mb-6">
            <span className="text-4xl font-bold text-amber-800">
              {formatPrice(artwork.price)}
            </span>
            <p className="text-sm text-stone-500 mt-1">
              Price includes certificate of authenticity
            </p>
          </div>

          {/* Description */}
          <p className="text-stone-600 leading-relaxed mb-6">{artwork.description}</p>

          {/* Details */}
          <div className="bg-stone-50 rounded-xl p-5 mb-6 space-y-3">
            <h3 className="font-semibold text-stone-800 text-sm uppercase tracking-wide mb-3">
              Artwork Details
            </h3>
            {[
              { label: "Medium", value: artwork.medium },
              { label: "Dimensions", value: artwork.dimensions },
              { label: "Category", value: artwork.category },
              { label: "Stock", value: artwork.stock > 0 ? `${artwork.stock} available` : "Sold out" },
            ].map((detail) => (
              <div key={detail.label} className="flex justify-between text-sm">
                <span className="text-stone-500">{detail.label}</span>
                <span className="font-medium text-stone-800">{detail.value}</span>
              </div>
            ))}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {artwork.tags.map((tag) => (
              <Link
                key={tag}
                href={`/gallery?search=${encodeURIComponent(tag)}`}
                className="px-3 py-1 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-full text-xs text-amber-800 transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>

          {/* Quantity */}
          {artwork.stock > 0 && (
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm font-medium text-stone-700">Quantity</span>
              <div className="flex items-center border border-stone-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 hover:bg-stone-100 transition-colors text-stone-700"
                >
                  −
                </button>
                <span className="px-4 py-2 text-sm font-medium border-x border-stone-300">
                  {quantity}
                </span>
                <button
                  onClick={() =>
                    setQuantity(Math.min(artwork.stock, quantity + 1))
                  }
                  className="px-3 py-2 hover:bg-stone-100 transition-colors text-stone-700"
                >
                  +
                </button>
              </div>
              <span className="text-xs text-stone-400">
                Max {artwork.stock}
              </span>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <Button
              onClick={handleAddToCart}
              disabled={artwork.stock === 0}
              variant="gold"
              size="lg"
              className="flex-1"
            >
              <ShoppingCart className="w-5 h-5" />
              {artwork.stock === 0 ? "Sold Out" : "Add to Cart"}
            </Button>
            <Button
              onClick={() => toggleWishlist(artwork.id)}
              variant="outline"
              size="lg"
              className="shrink-0"
              aria-label="Wishlist"
            >
              <Heart
                className={`w-5 h-5 ${wishlisted ? "fill-red-500 text-red-500" : ""}`}
              />
            </Button>
            <Button
              onClick={handleShare}
              variant="outline"
              size="lg"
              className="shrink-0"
              aria-label="Share"
            >
              <Share2 className="w-5 h-5" />
            </Button>
          </div>

          {/* Buy Now */}
          {artwork.stock > 0 && (
            <Button
              asChild
              variant="default"
              size="lg"
              className="w-full mb-6 bg-stone-800 hover:bg-stone-900"
            >
              <Link
                href={`/checkout?artwork=${artwork.id}`}
                onClick={handleAddToCart}
              >
                Buy Now – {formatPrice(artwork.price * quantity)}
              </Link>
            </Button>
          )}

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Truck, label: "Free Shipping", sub: "PKR 5,000+" },
              { icon: Shield, label: "Secure Payment", sub: "SSL Encrypted" },
              { icon: Award, label: "Authenticity", sub: "Certificate included" },
            ].map((badge) => (
              <div
                key={badge.label}
                className="flex flex-col items-center text-center p-3 bg-stone-50 rounded-xl"
              >
                <badge.icon className="w-5 h-5 text-amber-700 mb-1" />
                <span className="text-xs font-medium text-stone-700">{badge.label}</span>
                <span className="text-[10px] text-stone-400">{badge.sub}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Reviews ── */}
      {artworkReviews.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-stone-800 mb-6">
            Customer Reviews ({artworkReviews.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {artworkReviews.map((review) => (
              <div
                key={review.id}
                className="bg-white border border-stone-200 rounded-xl p-5"
              >
                <div className="flex items-center gap-0.5 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= review.rating
                          ? "fill-amber-400 text-amber-400"
                          : "text-stone-200"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-stone-600 text-sm leading-relaxed mb-4">
                  &quot;{review.comment}&quot;
                </p>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-amber-700 text-white text-xs font-bold flex items-center justify-center">
                    {review.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-stone-800">
                      {review.customerName}
                    </div>
                    <div className="text-xs text-stone-400">{formatDate(review.date)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Related ── */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-stone-800 mb-6">
            More {artwork.category}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {related.map((a) => (
              <ArtworkCard key={a.id} artwork={a} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
