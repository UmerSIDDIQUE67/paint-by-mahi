import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArtworkDetailClient from "./ArtworkDetailClient";
import { readArtworks } from "@/lib/serverData";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const artworks = await readArtworks();
  const artwork = artworks.find((a) => a.id === id);
  if (!artwork) return { title: "Artwork Not Found" };

  return {
    title: `${artwork.title} – ${artwork.category}`,
    description: artwork.description.slice(0, 155),
    openGraph: {
      title: artwork.title,
      description: artwork.description.slice(0, 155),
      images: [{ url: artwork.images[0], width: 800, height: 1000 }],
    },
  };
}

export default async function ArtworkPage({ params }: Props) {
  const { id } = await params;
  const artworks = await readArtworks();
  const artwork = artworks.find((a) => a.id === id);
  if (!artwork) notFound();

  const related = artworks
    .filter((a) => a.category === artwork.category && a.id !== artwork.id)
    .slice(0, 4);

  return <ArtworkDetailClient artwork={artwork} related={related} />;
}
