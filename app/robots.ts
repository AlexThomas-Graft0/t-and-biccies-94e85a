import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://t-and-biccies-94e85a.duckbyte.co/sitemap.xml",
  };
}
