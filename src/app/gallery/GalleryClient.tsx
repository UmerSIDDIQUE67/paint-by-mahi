"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, X, LayoutGrid, List, Package } from "lucide-react";
import ArtworkCard from "@/components/artwork/ArtworkCard";
import { CATEGORIES } from "@/lib/data";
import { useArtworkStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function GalleryClient() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";
  const initialSearch = searchParams.get("search") || "";

  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState("default");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 30000]);
  const [showFilters, setShowFilters] = useState(false);
  const [layout, setLayout] = useState<"grid" | "list">("grid");

  const { artworks, hydrated, hydrate } = useArtworkStore();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const filtered = useMemo(() => {
    const source = hydrated ? artworks : [];
    let result = [...source];

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q) ||
          a.tags.some((t) => t.toLowerCase().includes(q)) ||
          a.description.toLowerCase().includes(q)
      );
    }

    // Category
    if (category !== "all") {
      const catMatch = CATEGORIES.find((c) => c.slug === category);
      if (catMatch) {
        result = result.filter(
          (a) => a.category.toLowerCase() === catMatch.name.toLowerCase()
        );
      }
    }

    // Price range
    result = result.filter(
      (a) => a.price >= priceRange[0] && a.price <= priceRange[1]
    );

    // Sort
    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "oldest":
        result.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        break;
      case "featured":
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    return result;
  }, [search, category, sortBy, priceRange, artworks, hydrated]);

  const clearFilters = () => {
    setSearch("");
    setCategory("all");
    setSortBy("default");
    setPriceRange([0, 30000]);
  };

  const hasActiveFilters =
    search || category !== "all" || sortBy !== "default" || priceRange[1] < 30000;

  const source = hydrated ? artworks : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search */}
        <div className="flex-1">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search artworks, styles, tags..."
            className="w-full"
          />
        </div>

        {/* Category */}
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat.id} value={cat.slug}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sort */}
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default</SelectItem>
            <SelectItem value="featured">Featured First</SelectItem>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>

        {/* Advanced filters toggle */}
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="gap-2 shrink-0"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
        </Button>

        {/* Layout toggle */}
        <div className="flex border border-stone-300 rounded-md overflow-hidden">
          <button
            onClick={() => setLayout("grid")}
            className={`px-3 py-2 transition-colors ${
              layout === "grid"
                ? "bg-amber-800 text-white"
                : "text-stone-600 hover:bg-stone-50"
            }`}
            aria-label="Grid view"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setLayout("list")}
            className={`px-3 py-2 transition-colors border-l border-stone-300 ${
              layout === "list"
                ? "bg-amber-800 text-white"
                : "text-stone-600 hover:bg-stone-50"
            }`}
            aria-label="List view"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="mb-6 p-4 bg-stone-50 rounded-xl border border-stone-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-stone-700">Price Range</h3>
            <button
              onClick={() => setShowFilters(false)}
              className="text-stone-400 hover:text-stone-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="text-xs text-stone-500 mb-1 block">Min Price (PKR)</label>
              <Input
                type="number"
                value={priceRange[0]}
                onChange={(e) =>
                  setPriceRange([Number(e.target.value), priceRange[1]])
                }
                placeholder="0"
                min={0}
              />
            </div>
            <span className="text-stone-400 mt-4">—</span>
            <div className="flex-1">
              <label className="text-xs text-stone-500 mb-1 block">Max Price (PKR)</label>
              <Input
                type="number"
                value={priceRange[1]}
                onChange={(e) =>
                  setPriceRange([priceRange[0], Number(e.target.value)])
                }
                placeholder="30000"
                min={0}
              />
            </div>
          </div>
        </div>
      )}

      {/* Results info + Clear filters */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-stone-500 text-sm">
          Showing <span className="font-semibold text-stone-800">{filtered.length}</span>{" "}
          of {source.length} artworks
        </p>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1.5 text-sm text-amber-700 hover:text-amber-900 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            Clear filters
          </button>
        )}
      </div>

      {/* Category quick tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setCategory("all")}
          className={`px-3 py-1 rounded-full text-sm transition-colors ${
            category === "all"
              ? "bg-amber-800 text-white"
              : "bg-stone-100 text-stone-600 hover:bg-stone-200"
          }`}
        >
          All
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.slug)}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              category === cat.slug
                ? "bg-amber-800 text-white"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-24">
          <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-stone-400" />
          </div>
          <h3 className="text-xl font-semibold text-stone-700 mb-2">No artworks found</h3>
          <p className="text-stone-500 mb-6">
            Try adjusting your search or filters.
          </p>
          <Button onClick={clearFilters} variant="outline">
            Clear All Filters
          </Button>
        </div>
      ) : (
        <div
          className={
            layout === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
              : "flex flex-col gap-4"
          }
        >
          {filtered.map((artwork) => (
            <ArtworkCard key={artwork.id} artwork={artwork} />
          ))}
        </div>
      )}
    </div>
  );
}
