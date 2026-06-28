import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/checkout", "/cart", "/api/"],
      },
    ],
    sitemap: "https://paintbymahi.com/sitemap.xml",
    host: "https://paintbymahi.com",
  };
}
