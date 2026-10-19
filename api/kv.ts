import { neon } from "@neondatabase/serverless";

export default async function handler(req: any, res: any) {
  const dbUrl = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL;
  if (!dbUrl) {
    return res.status(500).json({ error: "DATABASE_URL not configured. Set it in Vercel env." });
  }
  const sql = neon(dbUrl);

  // Ensure table exists (one-time)
  await sql`CREATE TABLE IF NOT EXISTS devzard_kv (key TEXT PRIMARY KEY, value JSONB NOT NULL, updated_at TIMESTAMPTZ DEFAULT NOW())`;

  if (req.method === "GET") {
    const key = req.query.key as string;
    if (!key) return res.status(400).json({ error: "Missing key" });
    const rows = await sql`SELECT value FROM devzard_kv WHERE key = ${key} LIMIT 1`;
    if (!rows.length) return res.json({ value: null });
    return res.json({ value: rows[0].value });
  }

  if (req.method === "POST") {
    const { key, value } = req.body;
    if (!key) return res.status(400).json({ error: "Missing key" });
    await sql`INSERT INTO devzard_kv (key, value, updated_at) VALUES (${key}, ${value as any}, NOW()) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()`;
    return res.json({ ok: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
