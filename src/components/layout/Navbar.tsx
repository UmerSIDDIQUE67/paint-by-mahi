"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  ShoppingCart,
  Heart,
  Search,
  Menu,
  X,
  Phone,
  User,
  LogOut,
  ChevronDown,
  Package,
} from "lucide-react";
import { useCartStore, useUserStore, useWishlistStore } from "@/lib/store";
import { useSettingsStore } from "@/lib/siteSettings";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/gallery", label: "Gallery" },
  { href: "/categories", label: "Categories" },
  { href: "/custom-order", label: "Custom Order" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

/** Returns up to 2 uppercase initials from a full name */
function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? "U";
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/** Pick a consistent bg colour from the name */
const AVATAR_COLORS = [
  "bg-amber-700",
  "bg-rose-700",
  "bg-emerald-700",
  "bg-violet-700",
  "bg-sky-700",
  "bg-orange-700",
];
function avatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const totalItems = useCartStore((s) => s.getTotalItems());
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const { announcementText, announcementPhone } = useSettingsStore((s) => s.settings);
  const user = useUserStore((s) => s.user);
  const hydrated = useUserStore((s) => s.hydrated);
  const logout = useUserStore((s) => s.logout);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) setMobileOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  /* Close dropdown when clicking outside */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    router.push("/");
  };

  return (
    <>
      {/* Top bar */}
      <div className="bg-amber-900 text-amber-100 text-xs py-1.5 text-center tracking-wide hidden md:block">
        {announcementText} &nbsp;|&nbsp;
        <a href={`tel:${announcementPhone}`} className="hover:text-white underline">
          {announcementPhone}
        </a>
      </div>

      {/* Main Navbar */}
      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300",
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-md"
            : "bg-white border-b border-stone-200"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="w-10 h-10 rounded-full overflow-hidden shadow-md border border-amber-200">
                <Image
                  src="/logo.jpeg"
                  alt="Paint by Mahi Logo"
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
              <div className="leading-none">
                <span className="block font-bold text-lg text-amber-900 tracking-tight">
                  Paint by Mahi
                </span>
                <span className="block text-xs text-stone-500 tracking-widest uppercase">
                  Fine Art Gallery
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    pathname === link.href
                      ? "text-amber-800 bg-amber-50"
                      : "text-stone-600 hover:text-amber-800 hover:bg-amber-50"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-1">

              {/* Search */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 rounded-md text-stone-600 hover:text-amber-800 hover:bg-amber-50 transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="relative p-2 rounded-md text-stone-600 hover:text-amber-800 hover:bg-amber-50 transition-colors"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {wishlistCount > 9 ? "9+" : wishlistCount}
                  </span>
                )}
              </Link>

              {/* ── User avatar / login button ── */}
              {hydrated && (
                user ? (
                  /* Logged-in: avatar + dropdown */
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className="flex items-center gap-1.5 p-1 rounded-md hover:bg-amber-50 transition-colors"
                      aria-label="Account menu"
                    >
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm ring-2 ring-amber-300",
                          avatarColor(user.name)
                        )}
                        title={user.name}
                      >
                        {getInitials(user.name)}
                      </div>
                      <ChevronDown
                        className={cn(
                          "w-3.5 h-3.5 text-stone-500 transition-transform duration-200 hidden sm:block",
                          dropdownOpen && "rotate-180"
                        )}
                      />
                    </button>

                    {/* Dropdown */}
                    {dropdownOpen && (
                      <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-stone-200 overflow-hidden z-50">
                        {/* User info header */}
                        <div className="px-4 py-3 border-b border-stone-100 bg-amber-50">
                          <div className="flex items-center gap-2.5">
                            <div
                              className={cn(
                                "w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0",
                                avatarColor(user.name)
                              )}
                            >
                              {getInitials(user.name)}
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-stone-800 text-sm truncate">{user.name}</p>
                              <p className="text-xs text-stone-500 truncate">{user.email}</p>
                            </div>
                          </div>
                        </div>

                        {/* Menu items */}
                        <div className="py-1">
                          <Link
                            href="/wishlist"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-stone-700 hover:bg-amber-50 hover:text-amber-800 transition-colors"
                          >
                            <Heart className="w-4 h-4" /> My Wishlist
                          </Link>
                          <Link
                            href="/cart"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-stone-700 hover:bg-amber-50 hover:text-amber-800 transition-colors"
                          >
                            <Package className="w-4 h-4" /> My Orders
                          </Link>
                        </div>

                        <div className="border-t border-stone-100 py-1">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <LogOut className="w-4 h-4" /> Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Not logged in: plain user icon → goes to login */
                  <Link
                    href="/login"
                    className="p-2 rounded-md text-stone-600 hover:text-amber-800 hover:bg-amber-50 transition-colors"
                    aria-label="Account"
                  >
                    <User className="w-5 h-5" />
                  </Link>
                )
              )}

              {/* Cart */}
              <Link
                href="/cart"
                className="relative p-2 rounded-md text-stone-600 hover:text-amber-800 hover:bg-amber-50 transition-colors"
                aria-label="Cart"
              >
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-amber-700 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {totalItems > 9 ? "9+" : totalItems}
                  </span>
                )}
              </Link>

              {/* Mobile menu toggle */}
              <button
                className="lg:hidden p-2 rounded-md text-stone-600 hover:text-amber-800 hover:bg-amber-50 transition-colors ml-1"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Search bar */}
          {searchOpen && (
            <div className="pb-3">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (searchQuery.trim()) {
                    window.location.href = `/gallery?search=${encodeURIComponent(searchQuery)}`;
                  }
                }}
                className="flex gap-2"
              >
                <input
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search artworks, categories..."
                  className="flex-1 h-10 px-4 rounded-md border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-700"
                />
                <Button type="submit" size="sm" variant="gold">
                  Search
                </Button>
              </form>
            </div>
          )}
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-stone-100 bg-white px-4 pb-4 pt-2">
            <nav className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                    pathname === link.href
                      ? "text-amber-800 bg-amber-50"
                      : "text-stone-600 hover:text-amber-800 hover:bg-amber-50"
                  )}
                >
                  {link.label}
                </Link>
              ))}

              {/* Mobile user section */}
              {hydrated && (
                user ? (
                  <div className="mt-2 pt-2 border-t border-stone-100">
                    <div className="flex items-center gap-2.5 px-3 py-2 mb-1">
                      <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0", avatarColor(user.name))}>
                        {getInitials(user.name)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-stone-800 text-sm truncate">{user.name}</p>
                        <p className="text-xs text-stone-500 truncate">{user.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="mt-2 pt-2 border-t border-stone-100 flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-amber-800 hover:bg-amber-50 rounded-md transition-colors"
                  >
                    <User className="w-4 h-4" /> Sign In / Register
                  </Link>
                )
              )}

              <div className="mt-2 pt-2 border-t border-stone-100 flex items-center gap-2 text-xs text-stone-500">
                <Phone className="w-3 h-3" />
                <a href={`tel:${announcementPhone}`}>{announcementPhone}</a>
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
