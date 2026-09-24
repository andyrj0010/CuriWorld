import { notFound } from "next/navigation";
import Link from "next/link";
import {ArrowRight, Play} from "lucide-react";
import { articles, videoTopics } from "@/lib/data";
import type { Metadata } from "next";

export function generateStaticParams(){ return articles.map(a=>({slug:a.slug})); }

export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
  const {slug}=await params; const a=articles.find(x=>x.slug===slug); if(!a) return {};
  return {title:a.title,description:a.excerpt,openGraph:{title:a.title,description:a.excerpt,images:[a.image]}};
}

export default async function Article({params}:{params:Promise<{slug:string}>}) {
  const {slug}=await params; const a=articles.find(x=>x.slug===slug); if(!a) return notFound();
  const related=articles.filter(x=>x.slug!==a.slug && (x.category===a.category || x.category.includes("¿Qué")===a.category.includes("¿Qué"))).slice(0,3);
  const jsonLd={"@context":"https://schema.org","@type":"Article","headline":a.title,"description":a.excerpt,"datePublished":a.date,"dateModified":a.date,"image":a.image,"author":{"@type":"Organization","name":"CurioWorld"},"publisher":{"@type":"Organization","name":"CurioWorld"}};
  return <main className="container">
    <article className="article">
      <Link className="backLink" href="/explorar">← Volver a explorar</Link>
      <div className="tag">{a.category} · {a.date} · {a.readTime||'4 min'}</div>
      <h1>{a.title}</h1><p className="lead">{a.excerpt}</p>
      <div className="ad">ESPACIO PUBLICITARIO · preparado para AdSense</div>
      <img src={a.image} alt={a.title} />
      {a.body.map((p,i)=><p key={i}>{p}</p>)}
      <h2>Fuentes y referencias</h2>
      {a.sources.map(s=><p className="source" key={s}>{s}</p>)}
      <div className="ad">ESPACIO PUBLICITARIO · preparado para AdSense</div>
    </article>

    <section className="section relatedSection"><div className="sectionHead"><div><div className="eyebrow">Sigue descubriendo</div><h2>Te puede interesar</h2></div></div><div className="grid">{related.map(x=><Link className="card" href={`/articulo/${x.slug}`} key={x.slug}><div className="thumb" style={{backgroundImage:`url("${x.image}")`}}></div><div className="body"><div className="tag">{x.category}</div><h3>{x.title}</h3><p className="muted">{x.excerpt}</p><span className="readMeta">Leer →</span></div></Link>)}</div></section>

    <section className="section"><div className="sectionHead"><div><div className="eyebrow">Aprende también con vídeo</div><h2>🎥 Para seguir investigando</h2></div></div><div className="grid">{videoTopics.slice(0,3).map(v=><a className="card videoCard" href={`https://www.youtube.com/results?search_query=${encodeURIComponent(v.query)}`} target="_blank" rel="noreferrer" key={v.title}><div className="thumb" style={{backgroundImage:`linear-gradient(180deg,transparent,rgba(0,0,0,.65)),url("${v.image}")`}}><span className="play"><Play size={19} fill="currentColor"/></span></div><div className="body"><div className="tag">Vídeo</div><h3>{v.title}</h3><span className="readMeta">Ver resultados →</span></div></a>)}</div></section>
    <div className="sectionCta"><strong>¿Quieres descubrir otra cosa?</strong><Link className="btn" href="/explorar">Explorar curiosidades <ArrowRight size={16}/></Link></div>
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(jsonLd)}}/>
  </main>;
}
