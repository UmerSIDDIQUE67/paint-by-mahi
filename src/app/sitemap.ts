import { MetadataRoute } from "next";
import { CATEGORIES } from "@/lib/data";
import { readArtworks } from "@/lib/serverData";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://paintbymahi.com";
  const artworks = await readArtworks();

  const artworkUrls = artworks.map((artwork) => ({
    url: `${baseUrl}/artwork/${artwork.id}`,
    lastModified: new Date(artwork.createdAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const categoryUrls = CATEGORIES.map((cat) => ({
    url: `${baseUrl}/gallery?category=${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/gallery`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/categories`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/custom-order`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    ...artworkUrls,
    ...categoryUrls,
  ];
}
