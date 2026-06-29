import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Brush, Droplets, PenLine, User, Pencil, Layers, Shapes, Star, Shield, Truck, Palette, Users, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import ArtworkCard from "@/components/artwork/ArtworkCard";
import ArtistStats from "@/components/ArtistStats";
import { ARTWORKS, CATEGORIES, REVIEWS } from "@/lib/data";
import { formatDate } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  "oil-painting": Brush,
  "watercolor":   Droplets,
  "calligraphy":  PenLine,
  "portrait":     User,
  "sketch":       Pencil,
  "acrylic":      Layers,
  "abstract":     Shapes,
};

export const metadata: Metadata = {
  title: "Paint by Mahi – Handmade Paintings, Custom Canvas & Calligraphy Art",
  description:
    "Original handmade paintings, Islamic calligraphy, custom portraits and canvas art by Mahi. Browse the gallery, order online. Based in Pakistan, shipping worldwide.",
};

export default function HomePage() {
  const featuredArtworks = ARTWORKS.filter((a) => a.featured).slice(0, 6);
  const recentArtworks = [...ARTWORKS].slice(0, 8);

  return (
    <div suppressHydrationWarning>
      {/* ─── Hero Section ─── */}
      <section className="hero-pattern relative overflow-hidden min-h-[85vh] flex items-center">
        <div className="absolute inset-0">
          <Image src="/colorful-paint-brushes-stockcake.jpg" alt="Bright art studio background" fill
            className="object-cover opacity-45" priority />
          <div className="absolute inset-0 bg-linear-to-r from-[#1a0d10]/40 via-[#1a0d10]/20 to-[#1a0d10]/05" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-2xl bg-black/20 backdrop-blur-xl border border-white/10 rounded-4xl p-8 sm:p-10 shadow-2xl shadow-black/20">
            <div className="inline-flex items-center gap-2 border border-[#b76e79]/40 bg-[#b76e79]/15 rounded-full px-4 py-1.5 text-[#e8b4b8] text-sm mb-6">
              <Palette className="w-4 h-4" /> Handcrafted Original Artwork
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 drop-shadow-[0_20px_30px_rgba(0,0,0,0.35)]">
              Art That Speaks
              <span className="block text-gradient-rose">To Your Soul</span>
            </h1>
            <p className="text-white text-lg leading-relaxed mb-8 max-w-lg drop-shadow-[0_12px_20px_rgba(0,0,0,0.25)]">
              Discover original handmade paintings, Islamic calligraphy, custom portraits,
              and canvas masterpieces — each crafted with passion and precision.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild variant="gold" size="lg">
                <Link href="/gallery">Explore Gallery <ArrowRight className="w-5 h-5" /></Link>
              </Button>
              <Button asChild variant="outline" size="lg"
                className="border-[#e8b4b8]/50 text-[#e8b4b8] hover:bg-[#b76e79]/20 hover:border-[#e8b4b8]">
                <Link href="/custom-order">Commission Custom Art</Link>
              </Button>
            </div>
            <ArtistStats />
          </div>
        </div>
      </section>

      {/* ─── Features Bar ─── */}
      <section className="text-white py-8" style={{background:'linear-gradient(135deg, #1a0d10, #2d1219, #1a0d10)'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Truck,   title: "Free Shipping",  desc: "Orders over PKR 5,000" },
              { icon: Shield,  title: "100% Original",  desc: "Certificate of authenticity" },
              { icon: Palette, title: "Custom Orders",  desc: "Bespoke commissions" },
              { icon: Award,   title: "5-Star Quality", desc: "Trusted by 500+ buyers" },
            ].map((feature) => (
              <div key={feature.title} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#b76e79]/20 border border-[#b76e79]/40 flex items-center justify-center shrink-0">
                  <feature.icon className="w-5 h-5 text-[#e8b4b8]" />
                </div>
                <div>
                  <div className="font-semibold text-sm text-white">{feature.title}</div>
                  <div className="text-xs text-[#e8b4b8]/70">{feature.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Featured Artworks ─── */}
      <section className="py-16 bg-[#fdf6f0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[#b76e79] text-sm font-medium uppercase tracking-widest">Handpicked Collection</span>
            <div className="rose-divider-center mt-3 mb-4" />
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1a0d10] mt-2">Featured Artworks</h2>
            <p className="text-[#2d1a1f]/60 mt-3 max-w-xl mx-auto">Each piece is a unique original — no prints, no reproductions. Own a true work of art.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredArtworks.map((artwork) => (<ArtworkCard key={artwork.id} artwork={artwork} />))}
          </div>
          <div className="text-center mt-10">
            <Button asChild variant="outline" size="lg">
              <Link href="/gallery">View All Artworks <ArrowRight className="w-4 h-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ─── Categories ─── */}
      <section className="py-16 bg-[#faf0e6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[#b76e79] text-sm font-medium uppercase tracking-widest">Browse By Style</span>
            <div className="rose-divider-center mt-3 mb-4" />
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1a0d10] mt-2">Art Categories</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {CATEGORIES.map((cat) => {
              const Icon = CATEGORY_ICONS[cat.slug] ?? Palette;
              return (
                <Link key={cat.id} href={`/gallery?category=${cat.slug}`}
                  className="group relative overflow-hidden rounded-2xl bg-white p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-[#e8d0cc] hover:border-[#c9858f]/50">
                  <div className="w-12 h-12 rounded-full bg-[#f5e6da] group-hover:bg-[#e8d0cc] transition-colors flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-6 h-6 text-[#b76e79]" />
                  </div>
                  <h3 className="font-semibold text-[#1a0d10] text-sm">{cat.name}</h3>
                  <p className="text-xs text-[#2d1a1f]/50 mt-1">{cat.count} works</p>
                  <span className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="w-4 h-4 text-[#b76e79]" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Custom Order CTA ─── */}
      <section className="py-16 relative overflow-hidden" style={{background:'linear-gradient(135deg, #1a0d10 0%, #2d1219 50%, #1a0d10 100%)'}}>
        <div className="absolute inset-0">
          <Image src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=1600&q=80"
            alt="Artist painting on canvas" fill className="object-cover opacity-15" />
        </div>
        {/* Rose gold glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-[#b76e79]/15 blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-[#e8b4b8] text-sm font-medium uppercase tracking-widest">Bespoke Commissions</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mt-3 mb-4">
            Want Something Made <span className="text-gradient-rose">Just For You?</span>
          </h2>
          <p className="text-[#f5e6da]/70 text-lg mb-8 max-w-2xl mx-auto">
            Commission a custom painting — portraits, calligraphy, landscapes, or anything your imagination desires.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button asChild variant="gold" size="lg">
              <Link href="/custom-order">Request Custom Art <ArrowRight className="w-5 h-5" /></Link>
            </Button>
            <Button asChild variant="outline" size="lg"
              className="border-[#e8b4b8]/40 text-[#e8b4b8] hover:bg-[#b76e79]/20">
              <Link href="/contact">Contact Artist</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ─── New Arrivals ─── */}
      <section className="py-16 bg-[#fdf6f0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <span className="text-[#b76e79] text-sm font-medium uppercase tracking-widest">Fresh From the Studio</span>
              <h2 className="text-3xl font-bold text-[#1a0d10] mt-1">New Arrivals</h2>
            </div>
            <Button asChild variant="outline"><Link href="/gallery">View All <ArrowRight className="w-4 h-4" /></Link></Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {recentArtworks.slice(0, 4).map((artwork) => (<ArtworkCard key={artwork.id} artwork={artwork} />))}
          </div>
        </div>
      </section>

      {/* ─── Process Section ─── */}
      <section className="py-16 bg-[#faf0e6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[#b76e79] text-sm font-medium uppercase tracking-widest">How It Works</span>
            <div className="rose-divider-center mt-3 mb-4" />
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1a0d10] mt-2">Your Art Journey</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step:"01", title:"Browse & Discover", desc:"Explore the gallery and find artwork that resonates with you, or request something custom." },
              { step:"02", title:"Place Your Order",  desc:"Add to cart and checkout securely with multiple payment options available." },
              { step:"03", title:"Art is Created",    desc:"For custom orders, Mahi crafts your artwork with care. Track progress via updates." },
              { step:"04", title:"Delivered to You",  desc:"Artwork is carefully packed and shipped to your door, anywhere in Pakistan." },
            ].map((item) => (
              <div key={item.step} className="text-center relative">
                <div className="text-6xl font-bold text-[#e8d0cc] mb-4 select-none">{item.step}</div>
                <h3 className="font-bold text-[#1a0d10] text-lg mb-2">{item.title}</h3>
                <p className="text-[#2d1a1f]/60 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Testimonials ─── */}
      <section className="py-16 bg-[#fdf6f0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[#b76e79] text-sm font-medium uppercase tracking-widest">What Collectors Say</span>
            <div className="rose-divider-center mt-3 mb-4" />
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1a0d10] mt-2">Customer Reviews</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {REVIEWS.slice(0, 6).map((review) => (
              <div key={review.id} className="bg-white rounded-2xl p-6 shadow-sm border border-[#e8d0cc]">
                <div className="flex items-center gap-0.5 mb-3">
                  {[1,2,3,4,5].map((star) => (
                    <Star key={star} className={`w-4 h-4 ${star <= review.rating ? "fill-[#e8b4b8] text-[#e8b4b8]" : "text-[#e8d0cc]"}`} />
                  ))}
                </div>
                <p className="text-[#2d1a1f]/70 text-sm leading-relaxed mb-4 line-clamp-3">&quot;{review.comment}&quot;</p>
                <div className="flex items-center gap-3 pt-3 border-t border-[#f0ddd5]">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                    style={{background:'linear-gradient(135deg, #b76e79, #d4a0a8)'}}>
                    {review.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-[#1a0d10]">{review.customerName}</div>
                    <div className="text-xs text-[#2d1a1f]/40">{formatDate(review.date)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Artist Section ─── */}
      <section className="py-16 bg-[#faf0e6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="aspect-square rounded-3xl overflow-hidden border-2 border-[#e8d0cc]">
                <Image src="https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&q=80"
                  alt="Artist Mahi at work" width={600} height={600} className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-4 -right-4 text-white rounded-2xl px-5 py-3 shadow-lg"
                style={{background:'linear-gradient(135deg,#1a0d10,#2d1219)'}}>
                <div className="text-2xl font-bold text-[#e8b4b8]">5+</div>
                <div className="text-xs text-[#f5e6da]/70">Years of Art</div>
              </div>
            </div>
            <div>
              <span className="text-[#b76e79] text-sm font-medium uppercase tracking-widest">Meet the Artist</span>
              <div className="rose-divider mt-3 mb-5" />
              <h2 className="text-3xl sm:text-4xl font-bold text-[#1a0d10] mb-5">The Person Behind Every Brushstroke</h2>
              <p className="text-[#2d1a1f]/70 leading-relaxed mb-4">
                Mahi is a passionate self-taught artist from Lahore, Pakistan, with over five years of experience creating original works in oil, watercolor, acrylic, and traditional calligraphy.
              </p>
              <p className="text-[#2d1a1f]/70 leading-relaxed mb-6">
                Every painting is approached as a deeply personal expression — not just an image, but an experience. Each work carries a piece of Mahi&apos;s soul.
              </p>
              <div className="flex flex-wrap gap-3 mb-8">
                {["Oil Painting","Watercolor","Calligraphy","Portrait","Sketch"].map((skill) => (
                  <span key={skill} className="px-3 py-1 bg-white border border-[#e8d0cc] rounded-full text-sm text-[#b76e79]">{skill}</span>
                ))}
              </div>
              <div className="flex gap-4">
                <Button asChild variant="gold" size="lg"><Link href="/about">Read Full Story</Link></Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/contact"><Users className="w-4 h-4" /> Get In Touch</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
