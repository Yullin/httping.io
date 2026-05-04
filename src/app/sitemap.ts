import { MetadataRoute } from "next";

const STATUS_CODES = [
  100, 101, 102,
  200, 201, 202, 203, 204, 205, 206, 207, 208,
  301, 302, 303, 304, 307, 308,
  400, 401, 402, 403, 404, 405, 406, 407, 408, 409, 410,
  411, 412, 413, 414, 415, 416, 417, 418, 422, 423, 424,
  425, 426, 428, 429, 431, 451,
  500, 501, 502, 503, 504, 505, 506, 507, 508, 510, 511,
];

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
    ...statusPages,
  ];
}
