import { NextResponse } from 'next/server';
import { getPublished, dbEnabled } from '@/lib/supabase';
import { articles as demo } from '@/lib/data';
import { searchArticles } from '@/lib/search';

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get('q')?.trim() || '';
  const data: any[] = dbEnabled ? await getPublished(100) : demo;
  const result = searchArticles(data, q, 30);
  return NextResponse.json({
    query: q,
    articles: result.exact,
    related: result.related,
    total: result.exact.length,
  });
}
