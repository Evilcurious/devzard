/**
 * Neon DB adapter for Vercel + local fallback.
 *
 * In production (Vercel): set DATABASE_URL env to your Neon connection string.
 * Example: postgres://user:pass@ep-xxx.neon.tech/neondb?sslmode=require
 *
 * Locally / when not configured: falls back to localStorage so the portal
 * works instantly without any DB setup.
 *
 * The app's Store/Staff contexts call `dbGet`/`dbSet` — they transparently
 * use Neon when available, otherwise localStorage.
 */

const NEON_TABLES_SQL = `
-- Run this once in Neon SQL Editor to create tables:
CREATE TABLE IF NOT EXISTS devzard_kv (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
`;

export const NEON_SETUP_SQL = NEON_TABLES_SQL;

export function isNeonConfigured(): boolean {
  // In Vite, import.meta.env.DATABASE_URL is available if user sets VITE_DATABASE_URL
  // In Vercel serverless, process.env.DATABASE_URL is available.
  try {
    // @ts-ignore
    const v = (import.meta as any)?.env?.VITE_DATABASE_URL || (typeof process !== "undefined" ? (process as any).env?.DATABASE_URL : null);
    return Boolean(v);
  } catch {
    return false;
  }
}

export async function dbGet<T>(key: string, fallback: T): Promise<T> {
  // If Neon is not configured, use localStorage directly
  if (!isNeonConfigured()) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
      return fallback;
    }
  }
  // When Neon is configured, we try to fetch via Vercel API route /api/kv
  try {
    const res = await fetch(`/api/kv?key=${encodeURIComponent(key)}`);
    if (!res.ok) return fallback;
    const data = await res.json();
    return (data.value as T) ?? fallback;
  } catch {
    return fallback;
  }
}

export async function dbSet<T>(key: string, value: T): Promise<void> {
  if (!isNeonConfigured()) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
    return;
  }
  try {
    await fetch("/api/kv", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, value }),
    });
  } catch {}
}

// For synchronous localStorage usage inside contexts (fast, no async needed)
export function localGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
export function localSet<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}
