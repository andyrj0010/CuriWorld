type Row = Record<string, any>;
const base = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const dbEnabled = Boolean(base && key);

async function request(path: string, init: RequestInit = {}) {
  if (!dbEnabled) throw new Error('Supabase no está configurado');
  const res = await fetch(`${base}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: key!,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      ...(init.headers || {})
    },
    cache: 'no-store'
  });
  if (!res.ok) throw new Error(`${res.status}: ${await res.text()}`);
  return res.status === 204 ? null : res.json();
}

export async function getPublished(limit = 24): Promise<Row[]> {
  if (!dbEnabled) return [];
  return request(`articles?status=eq.published&select=*&order=published_at.desc&limit=${limit}`);
}
export async function getArticle(slug: string): Promise<Row | null> {
  if (!dbEnabled) return null;
  const rows = await request(`articles?slug=eq.${encodeURIComponent(slug)}&status=eq.published&select=*&limit=1`);
  return rows[0] || null;
}
export async function insertArticle(article: Row) {
  return request('articles', { method:'POST', headers:{Prefer:'return=representation'}, body:JSON.stringify(article) });
}
export async function updateArticle(id: string, patch: Row) {
  return request(`articles?id=eq.${encodeURIComponent(id)}`, { method:'PATCH', headers:{Prefer:'return=representation'}, body:JSON.stringify(patch) });
}
