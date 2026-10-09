"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";

/**
 * Liquid glass, after dashersw/liquid-glass-js: a displacement map that bends the backdrop
 * hardest at the rim of a rounded rect, fed to backdrop-filter through an SVG filter.
 * Browsers that can't use url() in backdrop-filter keep the plain blur declared before it.
 */
export function LiquidGlass({ children, className = "", radius = 999 }: { children: ReactNode; className?: string; radius?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const id = useId().replace(/:/g, "");
  const [map, setMap] = useState<{ url: string; w: number; h: number } | null>(null);

  useEffect(() => {
    const el = ref.current;
    // Only Chromium applies an SVG filter as a backdrop; elsewhere the CSS blur stays.
    const brands = (navigator as Navigator & { userAgentData?: { brands: { brand: string }[] } }).userAgentData?.brands;
    if (!el || !brands?.some((b) => b.brand === "Chromium")) return;
    const build = () => {
      const w = Math.round(el.offsetWidth);
      const h = Math.round(el.offsetHeight);
      if (!w || !h) return;
      setMap({ url: displacementMap(w, h, Math.min(radius, h / 2)), w, h });
    };
    build();
    const ro = new ResizeObserver(build);
    ro.observe(el);
    return () => ro.disconnect();
  }, [radius]);

  return (
    <div
      ref={ref}
      className={`liquid-glass ${className}`}
      style={{
        borderRadius: radius,
        ...(map && { backdropFilter: `url(#${id}) blur(1.5px) saturate(1.8)` }),
      }}
    >
      {map && (
        <svg width="0" height="0" className="absolute" aria-hidden>
          <filter id={id} x="0" y="0" width={map.w} height={map.h} filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feImage href={map.url} x="0" y="0" width={map.w} height={map.h} result="map" />
            <feDisplacementMap in="SourceGraphic" in2="map" scale="38" xChannelSelector="R" yChannelSelector="G" result="bent" />
            <feGaussianBlur in="bent" stdDeviation="0.6" />
          </filter>
        </svg>
      )}
      {children}
    </div>
  );
}

/** Red/green encode x/y displacement (128 = none). Pixels near the rim pull toward the center. */
function displacementMap(w: number, h: number, r: number) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d")!;
  const img = ctx.createImageData(w, h);
  const rim = Math.min(18, h / 2);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      // Signed distance to the rounded rect's edge (negative inside).
      const qx = Math.abs(x + 0.5 - w / 2) - (w / 2 - r);
      const qy = Math.abs(y + 0.5 - h / 2) - (h / 2 - r);
      const outside = Math.hypot(Math.max(qx, 0), Math.max(qy, 0));
      const sd = outside + Math.min(Math.max(qx, qy), 0) - r;
      const depth = Math.max(0, Math.min(1, -sd / rim));
      const k = Math.pow(1 - depth, 2.2); // strongest bend right at the rim
      // Direction toward the nearest edge.
      const nx = qx > 0 || qy > 0 ? Math.max(qx, 0) / (outside || 1) : qx > qy ? 1 : 0;
      const ny = qx > 0 || qy > 0 ? Math.max(qy, 0) / (outside || 1) : qy >= qx ? 1 : 0;
      const sx = Math.sign(x + 0.5 - w / 2);
      const sy = Math.sign(y + 0.5 - h / 2);
      const i = (y * w + x) * 4;
      img.data[i] = 128 + sx * nx * k * 127;
      img.data[i + 1] = 128 + sy * ny * k * 127;
      img.data[i + 2] = 128;
      img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return c.toDataURL();
}
