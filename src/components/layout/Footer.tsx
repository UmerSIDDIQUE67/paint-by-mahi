"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, Heart, Share2, PlayCircle, Users } from "lucide-react";
import { useSettingsStore } from "@/lib/siteSettings";

export default function Footer() {
  const { instagramUrl, facebookUrl, youtubeUrl, contactPhone, contactEmail, contactAddress } =
    useSettingsStore((s) => s.settings);
  return (
    <footer suppressHydrationWarning className="bg-stone-900 text-stone-300">
      {/* Main Footer */}
      <div suppressHydrationWarning className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div suppressHydrationWarning className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div suppressHydrationWarning className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div suppressHydrationWarning className="w-9 h-9 rounded-full overflow-hidden border border-amber-700/60 shrink-0">
                <Image src="/logo.jpeg" alt="Paint by Mahi" width={36} height={36} className="w-full h-full object-cover" />
              </div>
              <div suppressHydrationWarning className="leading-none">
                <span className="block font-bold text-white text-lg">Paint by Mahi</span>
                <span className="block text-xs text-amber-400 tracking-wider uppercase">Fine Art Gallery</span>
              </div>
            </Link>
            <p className="text-sm text-stone-400 leading-relaxed mb-5">
              Handcrafted paintings, sketches, and calligraphy artwork — each piece a labour of love. Based in Pakistan, shipping worldwide.
            </p>
            <div suppressHydrationWarning className="flex gap-3">
              <a href={instagramUrl} target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-stone-800 hover:bg-amber-700 flex items-center justify-center transition-colors"
                aria-label="Instagram">
                <Share2 className="w-4 h-4" />
              </a>
              <a href={facebookUrl} target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-stone-800 hover:bg-amber-700 flex items-center justify-center transition-colors"
                aria-label="Facebook">
                <Users className="w-4 h-4" />
              </a>
              <a href={youtubeUrl} target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-stone-800 hover:bg-amber-700 flex items-center justify-center transition-colors"
                aria-label="YouTube">
                <PlayCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div suppressHydrationWarning>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Gallery</h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { href: "/gallery", label: "All Artworks" },
                { href: "/gallery?category=oil-painting", label: "Oil Paintings" },
                { href: "/gallery?category=watercolor", label: "Watercolors" },
                { href: "/gallery?category=calligraphy", label: "Calligraphy" },
                { href: "/gallery?category=portrait", label: "Portraits" },
                { href: "/gallery?category=sketch", label: "Sketches" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-stone-400 hover:text-amber-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div suppressHydrationWarning>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Company</h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { href: "/about", label: "About Mahi" },
                { href: "/custom-order", label: "Custom Orders" },
                { href: "/contact", label: "Contact" },
                { href: "/shipping", label: "Shipping Policy" },
                { href: "/returns", label: "Returns & Refunds" },
                { href: "/privacy", label: "Privacy Policy" },
                { href: "/terms", label: "Terms of Service" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-stone-400 hover:text-amber-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div suppressHydrationWarning>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Get In Touch</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                <span className="text-stone-400">{contactAddress}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                <a href={`tel:${contactPhone}`} className="text-stone-400 hover:text-amber-400 transition-colors">
                  {contactPhone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                <a href={`mailto:${contactEmail}`} className="text-stone-400 hover:text-amber-400 transition-colors">
                  {contactEmail}
                </a>
              </li>
            </ul>
            <div suppressHydrationWarning className="mt-6">
              <p className="text-xs text-stone-500 mb-2 uppercase tracking-wider">Accepted Payments</p>
              <div suppressHydrationWarning className="flex flex-wrap gap-2">
                {["Stripe", "EasyPaisa", "JazzCash", "Bank"].map((method) => (
                  <span key={method} className="px-2 py-0.5 bg-stone-800 rounded text-xs text-stone-400">
                    {method}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div suppressHydrationWarning className="border-t border-stone-800">
        <div suppressHydrationWarning className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} Paint by Mahi. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> in Pakistan
          </p>
        </div>
      </div>
    </footer>
  );
}
