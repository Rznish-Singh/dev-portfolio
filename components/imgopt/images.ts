// ONE place to point the whole page at your own image or CDN.
// Default: a real photo on Unsplash's image CDN (it accepts width, format and quality in the URL).
// Your own image/CDN: set NEXT_PUBLIC_IMG_BASE (e.g. https://cdn.example.com/photo.jpg).
// If your CDN uses other parameter names, edit imgUrl only (Cloudinary: .../image/upload/w_{w},f_{fmt},q_{q}/photo.jpg).
export const IMG_BASE = process.env.NEXT_PUBLIC_IMG_BASE ?? "https://images.unsplash.com/photo-1506744038136-46273834b3fb";

export type Fmt = "jpg" | "webp" | "avif";

export const imgUrl = (w: number, fmt: Fmt = "jpg", q = 75) => `${IMG_BASE}?w=${w}&fm=${fmt}&q=${q}&fit=crop`;

/** CSS background: the real image on top, a colour gradient underneath as the fallback. */
export const bg = (w: number, fmt: Fmt = "jpg", q = 75, pos = "center") =>
  `url("${imgUrl(w, fmt, q)}") ${pos}/cover no-repeat, var(--io-photo)`;
