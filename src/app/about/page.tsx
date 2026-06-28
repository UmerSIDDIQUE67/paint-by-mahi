import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Award, Heart, Palette, Users, Star, ArrowRight, Brush, Droplets, PenLine, User, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About Mahi – The Artist Behind Paint by Mahi",
  description:
    "Meet Mahi, a passionate Pakistani artist specializing in oil paintings, watercolors, Islamic calligraphy, and custom portraits. Based in Lahore, available worldwide.",
};

export default function AboutPage() {
  return (
    <div suppressHydrationWarning>{/* Hero */}
      <div className="relative bg-stone-900 py-14 overflow-hidden" suppressHydrationWarning>
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
            The Artist
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mt-2">
            About Mahi
          </h1>
        </div>
      </div>

      {/* Main story */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <div className="relative">
              <div className="aspect-3/4 rounded-2xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&q=80"
                  alt="Mahi painting"
                  width={600}
                  height={800}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white border border-stone-200 rounded-xl p-5 shadow-lg">
                <div className="flex items-center gap-1 mb-1">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm font-medium text-stone-800">&quot;A true master&quot;</p>
                <p className="text-xs text-stone-500">— 500+ happy collectors</p>
              </div>
            </div>

            <div>
              <span className="text-amber-700 text-sm font-medium uppercase tracking-widest">
                My Story
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-stone-800 mt-2 mb-5">
                Passion Painted in Every Stroke
              </h2>
              <div className="space-y-4 text-stone-600 leading-relaxed">
                <p>
                  My name is Mahi, and I&apos;ve been painting since I was a child in Lahore, 
                  captivated by the rich colors of Pakistani culture, the geometric beauty of 
                  Islamic art, and the raw landscapes of my homeland.
                </p>
                <p>
                  Over five years ago, I turned my lifelong passion into a professional practice, 
                  creating original handmade works that bridge tradition and contemporary 
                  expression. Each piece I create — whether it&apos;s an oil painting, a delicate 
                  watercolor, or intricate calligraphy — carries a piece of my heart.
                </p>
                <p>
                  I believe art should be accessible and meaningful. That&apos;s why I offer works 
                  at various price points and welcome custom commissions for any occasion — 
                  from wedding gifts to corporate art installations.
                </p>
                <p>
                  My work has found homes in Pakistan, UAE, UK, and USA. Each sale isn&apos;t 
                  just a transaction — it&apos;s a connection between my vision and someone who 
                  felt something looking at what I created.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8 mb-8">
                {[
                  { value: "200+", label: "Artworks Created" },
                  { value: "500+", label: "Happy Customers" },
                  { value: "5+", label: "Years Experience" },
                  { value: "4", label: "Countries Reached" },
                ].map((stat) => (
                  <div key={stat.label} className="bg-amber-50 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-amber-800">{stat.value}</div>
                    <div className="text-xs text-stone-500 mt-0.5">{stat.label}</div>
                  </div>
                ))}
              </div>

              <div className="flex gap-4">
                <Button asChild variant="gold" size="lg">
                  <Link href="/gallery">
                    View My Work <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/custom-order">Commission a Piece</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills */}
      <section className="py-16 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-stone-800">Mediums & Specialties</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: "Oil Painting",  Icon: Brush,    desc: "Rich, textured oils" },
              { name: "Watercolor",   Icon: Droplets,  desc: "Delicate washes" },
              { name: "Calligraphy",  Icon: PenLine,   desc: "Arabic & Urdu scripts" },
              { name: "Portrait",     Icon: User,      desc: "Lifelike likenesses" },
              { name: "Sketch",       Icon: Pencil,    desc: "Graphite & charcoal" },
              { name: "Acrylic",      Icon: Palette,   desc: "Vibrant acrylics" },
            ].map((skill) => (
              <div
                key={skill.name}
                className="bg-white border border-stone-200 rounded-xl p-4 text-center hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-2">
                  <skill.Icon className="w-5 h-5 text-amber-700" />
                </div>
                <h3 className="font-semibold text-stone-800 text-sm">{skill.name}</h3>
                <p className="text-xs text-stone-500 mt-0.5">{skill.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-stone-800">My Values</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Palette,
                title: "100% Handmade",
                desc: "Every piece is created by hand — no prints, no digital reproductions. You receive an original work.",
              },
              {
                icon: Heart,
                title: "Made with Love",
                desc: "Art is personal. I pour emotion and intention into every brushstroke, creating something truly meaningful.",
              },
              {
                icon: Award,
                title: "Quality First",
                desc: "I use professional-grade materials — premium canvases, archival paints, and quality inks — built to last generations.",
              },
              {
                icon: Users,
                title: "Client-Centered",
                desc: "Custom commissions include unlimited revisions until you're completely satisfied with the result.",
              },
            ].map((value) => (
              <div
                key={value.title}
                className="text-center p-6"
              >
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-6 h-6 text-amber-700" />
                </div>
                <h3 className="font-bold text-stone-800 mb-2">{value.title}</h3>
                <p className="text-stone-500 text-sm leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-amber-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Own a Piece of My Art?
          </h2>
          <p className="text-amber-200 mb-8 text-lg">
            Browse the gallery or commission something made specifically for you.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-amber-900 hover:bg-amber-50">
              <Link href="/gallery">Browse Gallery</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-amber-300 text-amber-100 hover:bg-amber-800"
            >
              <Link href="/custom-order">Commission Custom Art</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
