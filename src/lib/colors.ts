/* ================= Color utilities for dynamic theming ================= */

function hexToRgb(hex: string): [number, number, number] {
  let h = hex.replace("#", "").trim();
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const num = parseInt(h || "2563eb", 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

function rgbToHex(r: number, g: number, b: number): string {
  const to = (v: number) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0");
  return `#${to(r)}${to(g)}${to(b)}`;
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0;
  const l = (max + min) / 2;
  const d = max - min;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  return [h, s * 100, l * 100];
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  s /= 100; l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let rgb: [number, number, number] = [0, 0, 0];
  if (h < 60) rgb = [c, x, 0];
  else if (h < 120) rgb = [x, c, 0];
  else if (h < 180) rgb = [0, c, x];
  else if (h < 240) rgb = [0, x, c];
  else if (h < 300) rgb = [x, 0, c];
  else rgb = [c, 0, x];
  return [(rgb[0] + m) * 255, (rgb[1] + m) * 255, (rgb[2] + m) * 255];
}

function mix(hex: string, lightness: number, satBoost = 1): string {
  const [r, g, b] = hexToRgb(hex);
  const [h, s] = rgbToHsl(r, g, b);
  const [nr, ng, nb] = hslToRgb(h, Math.min(100, s * satBoost), lightness);
  return rgbToHex(nr, ng, nb);
}

/** Generate a full Tailwind-like 50–950 scale from a single base hex (used as the 600 shade). */
export function generateShades(base: string): Record<string, string> {
  const scale: [string, number, number][] = [
    ["50", 97, 0.5],
    ["100", 94, 0.7],
    ["200", 86, 0.85],
    ["300", 77, 1.0],
    ["400", 66, 1.1],
    ["500", 58, 1.15],
    ["600", 50, 1.0],
    ["700", 42, 1.05],
    ["800", 35, 1.0],
    ["900", 30, 0.9],
    ["950", 20, 0.85],
  ];
  const out: Record<string, string> = {};
  for (const [key, l, sb] of scale) out[key] = mix(base, l, sb);
  return out;
}

export function isLight(hex: string): boolean {
  const [r, g, b] = hexToRgb(hex);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.65;
}

export function isValidHex(hex: string): boolean {
  return /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(hex.trim());
}
