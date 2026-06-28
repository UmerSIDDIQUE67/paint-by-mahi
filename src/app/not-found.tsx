import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Palette } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mb-6">
        <Palette className="w-10 h-10 text-amber-700" />
      </div>
      <h1 className="text-6xl font-bold text-stone-800 mb-2">404</h1>
      <h2 className="text-2xl font-bold text-stone-700 mb-3">Page Not Found</h2>
      <p className="text-stone-500 mb-8 max-w-md">
        This page seems to have wandered off the canvas. Let&apos;s get you back to the gallery.
      </p>
      <div className="flex gap-4">
        <Button asChild variant="gold" size="lg">
          <Link href="/">Back to Home</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/gallery">View Gallery</Link>
        </Button>
      </div>
    </div>
  );
}
