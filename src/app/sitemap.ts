import { MetadataRoute } from "next";
import { STATUS_DB } from "./status/status-db";

// Extract all status codes from the database
const STATUS_CODES = Object.keys(STATUS_DB).map(Number);

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.httping.io";

  const statusPages: MetadataRoute.Sitemap = STATUS_CODES.map((code) => ({
    url: `${base}/status/${code}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${base}/status`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...statusPages,
  ];
}
