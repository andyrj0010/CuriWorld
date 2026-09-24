import Link from 'next/link';
import { Search, Sparkles } from 'lucide-react';
import { articles as demo } from '@/lib/data';
import { getPublished, dbEnabled } from '@/lib/supabase';
import { searchArticles } from '@/lib/search';

export default async function Explore({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = '' } = await searchParams;
  const data: any[] = dbEnabled ? await getPublished(100) : demo;
  const result = searchArticles(data, q, 30);
  const list = q ? result.exact : data;
  const related = q ? result.related : [];

  return <main className="container section">
    <div className="searchHero">
      <div className="eyebrow">Biblioteca de curiosidades</div>
      <h1>{q ? `Resultados para “${q}”` : 'Explora CurioWorld'}</h1>
      <p className="muted">Busca una pregunta, un tema o incluso una palabra aproximada. CurioWorld intenta encontrar contenido relacionado aunque no uses exactamente el título del artículo.</p>
      <form className="bigSearch" action="/explorar">
        <Search size={20}/>
        <input name="q" defaultValue={q} placeholder="Ej.: agujeros negros, animales, dormir, océano..." aria-label="Buscar curiosidades" autoFocus={!!q}/>
        <button className="btn" type="submit">Buscar</button>
      </form>
    </div>

    {q && !list.length && !related.length && <div className="noResults">
      <Sparkles size={25}/><div><h2>No hemos encontrado ese tema todavía.</h2><p>Prueba con una palabra más general, por ejemplo <Link href="/explorar?q=espacio">espacio</Link>, <Link href="/explorar?q=animales">animales</Link> o <Link href="/explorar?q=cerebro">cerebro</Link>.</p></div>
    </div>}

    {!!list.length && <>
      <div className="sectionHead"><div><div className="eyebrow">Coincidencias</div><h2>{q ? `${list.length} resultado${list.length === 1 ? '' : 's'}` : 'Todo el contenido'}</h2></div></div>
      <div className="grid">{list.map((a: any) => <Link className="card" href={`/articulo/${a.slug}`} key={a.slug}><div className="thumb" style={{ backgroundImage: `url("${a.image_url || a.image}")` }} /><div className="body"><div className="tag">{a.category}</div><h3>{a.title}</h3><p className="muted">{a.excerpt}</p><span className="readMeta">Leer artículo →</span></div></Link>)}</div>
    </>}

    {!!related.length && <section className="relatedSearch">
      <div className="sectionHead"><div><div className="eyebrow">También puede interesarte</div><h2>🔎 Hemos encontrado temas parecidos</h2></div></div>
      <p className="muted">No encontramos una coincidencia exacta, pero estos artículos tratan temas relacionados con tu búsqueda.</p>
      <div className="grid">{related.map((a: any) => <Link className="card" href={`/articulo/${a.slug}`} key={a.slug}><div className="thumb" style={{ backgroundImage: `url("${a.image_url || a.image}")` }} /><div className="body"><div className="tag">{a.category}</div><h3>{a.title}</h3><p className="muted">{a.excerpt}</p><span className="readMeta">Puede interesarte →</span></div></Link>)}</div>
    </section>}
  </main>;
}
