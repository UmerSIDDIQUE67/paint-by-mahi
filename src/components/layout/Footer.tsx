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
    <footer suppressHydrationWarning className="text-[#f5e6da]" style={{background: 'linear-gradient(135deg, #1a0d10 0%, #2d1219 50%, #1a0d10 100%)'}}>
      {/* Rose gold top border */}
      <div className="h-0.5 w-full" style={{background:'linear-gradient(90deg, transparent, #b76e79, #e8b4b8, #b76e79, transparent)'}} />

      <div suppressHydrationWarning className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div suppressHydrationWarning className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div suppressHydrationWarning className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-5">
              <div suppressHydrationWarning className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#b76e79]/60 shrink-0">
                <Image src="/logo.jpeg" alt="Paint by Mahi" width={40} height={40} className="w-full h-full object-cover" />
              </div>
              <div suppressHydrationWarning className="leading-none">
                <span className="block font-bold text-white text-lg">Paint by Mahi</span>
                <span className="block text-xs text-[#e8b4b8] tracking-wider uppercase">Fine Art Gallery</span>
              </div>
            </Link>
            <p className="text-sm text-[#f5e6da]/60 leading-relaxed mb-5">
              Handcrafted paintings, sketches, and calligraphy artwork — each piece a labour of love. Based in Pakistan, shipping worldwide.
            </p>
            <div suppressHydrationWarning className="flex gap-3">
              {[
                { href: instagramUrl, icon: Share2, label: "Instagram" },
                { href: facebookUrl,  icon: Users,  label: "Facebook" },
                { href: youtubeUrl,   icon: PlayCircle, label: "YouTube" },
              ].map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full border border-[#b76e79]/40 hover:border-[#b76e79] hover:bg-[#b76e79]/20 flex items-center justify-center transition-all"
                  aria-label={s.label}>
                  <s.icon className="w-4 h-4 text-[#e8b4b8]" />
                </a>
              ))}
            </div>
          </div>

          {/* Gallery Links */}
          <div suppressHydrationWarning>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Gallery</h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { href: "/gallery",                        label: "All Artworks" },
                { href: "/gallery?category=oil-painting",  label: "Oil Paintings" },
                { href: "/gallery?category=watercolor",    label: "Watercolors" },
                { href: "/gallery?category=calligraphy",   label: "Calligraphy" },
                { href: "/gallery?category=portrait",      label: "Portraits" },
                { href: "/gallery?category=sketch",        label: "Sketches" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[#f5e6da]/60 hover:text-[#e8b4b8] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div suppressHydrationWarning>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Company</h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { href: "/about",        label: "About Mahi" },
                { href: "/custom-order", label: "Custom Orders" },
                { href: "/contact",      label: "Contact" },
                { href: "/shipping",     label: "Shipping Policy" },
                { href: "/returns",      label: "Returns & Refunds" },
                { href: "/privacy",      label: "Privacy Policy" },
                { href: "/terms",        label: "Terms of Service" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[#f5e6da]/60 hover:text-[#e8b4b8] transition-colors">
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
                <MapPin className="w-4 h-4 text-[#e8b4b8] mt-0.5 shrink-0" />
                <span className="text-[#f5e6da]/60">{contactAddress}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#e8b4b8] shrink-0" />
                <a href={`tel:${contactPhone}`} className="text-[#f5e6da]/60 hover:text-[#e8b4b8] transition-colors">{contactPhone}</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#e8b4b8] shrink-0" />
                <a href={`mailto:${contactEmail}`} className="text-[#f5e6da]/60 hover:text-[#e8b4b8] transition-colors">{contactEmail}</a>
              </li>
            </ul>
            <div suppressHydrationWarning className="mt-6">
              <p className="text-xs text-[#f5e6da]/40 mb-2 uppercase tracking-wider">Accepted Payments</p>
              <div suppressHydrationWarning className="flex flex-wrap gap-2">
                {["Stripe","EasyPaisa","JazzCash","Bank","COD"].map((m) => (
                  <span key={m} className="px-2 py-0.5 rounded-full border border-[#b76e79]/30 text-xs text-[#e8b4b8]/70">{m}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div suppressHydrationWarning className="border-t border-[#b76e79]/20">
        <div suppressHydrationWarning className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#f5e6da]/40">
          <p>© {new Date().getFullYear()} Paint by Mahi. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-[#b76e79] fill-[#b76e79]" /> in Pakistan
          </p>
        </div>
      </div>
    </footer>
  );
}
