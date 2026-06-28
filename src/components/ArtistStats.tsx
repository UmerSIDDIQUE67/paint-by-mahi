"use client";

import { useSettingsStore } from "@/lib/siteSettings";

export default function ArtistStats() {
  const { artistWorksCount, artistCustomersCount, artistYears } =
    useSettingsStore((s) => s.settings);

  return (
    <div className="flex flex-wrap gap-8 mt-12 pt-8 border-t border-white/10">
      {[
        { value: artistWorksCount, label: "Artworks Created" },
        { value: artistCustomersCount, label: "Happy Customers" },
        { value: "5★", label: "Average Rating" },
        { value: artistYears, label: "Years Experience" },
      ].map((stat) => (
        <div key={stat.label}>
          <div className="text-2xl font-bold text-amber-400">{stat.value}</div>
          <div className="text-xs text-stone-400 mt-0.5">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
