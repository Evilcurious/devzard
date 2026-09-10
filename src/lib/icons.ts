import {
  Code2, Smartphone, Megaphone, Search, Music2, Clapperboard, Palette, Users, Bot, Radar,
  Server, LayoutTemplate, Sparkles, BrainCircuit, Globe, Rocket, Cpu, Star, Zap, ShieldCheck,
  Package, Camera, Film, BarChart3, ShoppingBag, Target, Layers, Wrench, Heart, Crown, type LucideIcon,
} from "lucide-react";

/** Registry of icons usable by admin-managed products & services. */
export const ICONS: Record<string, LucideIcon> = {
  Code2, Smartphone, Megaphone, Search, Music2, Clapperboard, Palette, Users, Bot, Radar,
  Server, LayoutTemplate, Sparkles, BrainCircuit, Globe, Rocket, Cpu, Star, Zap, ShieldCheck,
  Package, Camera, Film, BarChart3, ShoppingBag, Target, Layers, Wrench, Heart, Crown,
};

export const ICON_NAMES = Object.keys(ICONS);

export function getIcon(name?: string): LucideIcon {
  return (name && ICONS[name]) || Package;
}

/** Resolve a stored icon name into a component, preferring an existing component. */
export function resolveIcon(icon: unknown, iconName?: string): LucideIcon {
  if (typeof icon === "function") return icon as LucideIcon;
  return getIcon(iconName);
}

/** Convert an icon component into a stable string key for storage. */
export function nameOfIcon(icon: unknown, fallback = "Package"): string {
  if (typeof icon !== "function") return fallback;
  for (const [key, comp] of Object.entries(ICONS)) {
    if (comp === icon) return key;
  }
  const raw = String((icon as any)?.displayName ?? (icon as any)?.name ?? "").replace(/Icon$/, "");
  return ICONS[raw] ? raw : fallback;
}
