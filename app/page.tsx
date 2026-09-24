import Link from 'next/link';
import {ArrowRight,Play,Shuffle,Sparkles,TrendingUp} from 'lucide-react';
import {articles as demo, quickFacts, whatIf, videoTopics} from '@/lib/data';
import {getPublished,dbEnabled} from '@/lib/supabase';
import DailyFact from '@/components/DailyFact';

export default async function Home(){
 const live:any[]=dbEnabled?await getPublished(12):demo;
 const featured=live.find(a=>a.featured)||live[0];
 const trending=live.slice(0,5);
 const cards=live.slice(0,6);
 return <>
  <header className="nav"><div className="container navin">
   <Link className="logo" href="/">Curio<span>World</span></Link>
   <nav className="links"><Link href="/">Inicio</Link><Link href="/explorar">Explorar</Link><Link href="/categoria/ciencia">Ciencia</Link><Link href="/categoria/espacio">Espacio</Link><Link href="/categoria/historia">Historia</Link></nav>
   <form action="/explorar" className="searchform"><span className="searchIcon">⌕</span><input className="search" name="q" placeholder="Buscar curiosidades..." aria-label="Buscar"/></form>
  </div></header>

  <main>
   <section className="hero heroPro container">
    <div className="heroCopy"><div className="eyebrow">CurioWorld · conocimiento diario</div><h1>Aprende algo fascinante <em>cada día.</em></h1><p>Curiosidades verificables, ciencia, espacio, historia, tecnología y preguntas que hacen que quieras seguir leyendo.</p><div className="heroActions"><Link className="btn" href={`/articulo/${featured.slug}`}><Sparkles size={17}/> Dato del día</Link><Link className="btn alt" href="/explorar">Explorar todo <ArrowRight size={17}/></Link></div><div className="trustLine">Contenido explicado con fuentes · actualizado a diario · pensado para aprender</div></div>
    <div className="heroVisual" style={{backgroundImage:`linear-gradient(180deg,rgba(5,9,17,.05),rgba(5,9,17,.72)),url("${featured.image_url||featured.image}")`}}><div className="heroBadge">✨ DESTACADO DE HOY</div><div className="heroVisualText"><div className="tag">{featured.category}</div><h2>{featured.title}</h2><Link href={`/articulo/${featured.slug}`}>Leer en {featured.readTime||'4 min'} <ArrowRight size={16}/></Link></div></div>
   </section>

   <section className="container quickStrip"><DailyFact facts={quickFacts}/><Link className="randomBtn" href="/explorar"><Shuffle size={17}/> Sorpréndeme</Link></section>

   <section className="section container"><div className="sectionHead"><div><div className="eyebrow">Descubrimientos recientes</div><h2>🔥 Lo que deberías saber hoy</h2></div><Link href="/explorar" className="sectionLink">Ver todo <ArrowRight size={16}/></Link></div><div className="grid featuredGrid">{cards.map((a:any,i)=><Link className={`card ${i===0?'cardLarge':''}`} href={`/articulo/${a.slug}`} key={a.slug}><div className="thumb" style={{backgroundImage:`linear-gradient(180deg,transparent 40%,rgba(0,0,0,.55)),url("${a.image_url||a.image}")`}}><span className="thumbTag">{a.category}</span></div><div className="body"><h3>{a.title}</h3><p className="muted">{a.excerpt}</p><span className="readMeta">{a.readTime||'4 min'} de lectura · Descubrir →</span></div></Link>)}</div></section>

   <section className="section container"><div className="sectionHead"><div><div className="eyebrow">No te lo pierdas</div><h2><TrendingUp size={22}/> Lo más visto</h2></div></div><div className="trendList">{trending.map((a:any,i)=><Link href={`/articulo/${a.slug}`} className="trendItem" key={a.slug}><span className="trendNum">0{i+1}</span><span className="trendCat">{a.category}</span><strong>{a.title}</strong><ArrowRight size={17}/></Link>)}</div></section>

   <section className="section container"><div className="sectionHead"><div><div className="eyebrow">Ciencia de bolsillo</div><h2>🧠 Datos que parecen inventados</h2></div></div><div className="factsGrid">{quickFacts.slice(0,3).map((f,i)=><div className="factCard" key={f}><span>0{i+1}</span><p>{f}</p><small>¿Quieres saber por qué?</small></div>)}</div></section>

   <section className="section container"><div className="sectionHead"><div><div className="eyebrow">Experimenta con la imaginación</div><h2>❓ ¿Qué pasaría si...?</h2></div><Link href="/categoria/que-pasaria-si" className="sectionLink">Ver más <ArrowRight size={16}/></Link></div><div className="grid">{whatIf.map(x=><Link className="card" href="/explorar" key={x.title}><div className="thumb" style={{backgroundImage:`linear-gradient(180deg,transparent 30%,rgba(0,0,0,.75)),url("${x.image}")`}}></div><div className="body"><div className="tag">{x.category}</div><h3>{x.title}</h3><span className="readMeta">Explorar hipótesis →</span></div></Link>)}</div></section>

   <section className="section container"><div className="sectionHead"><div><div className="eyebrow">Para ver y aprender</div><h2>🎥 Vídeos curiosos</h2></div></div><div className="grid">{videoTopics.map(v=><a className="card videoCard" href={`https://www.youtube.com/results?search_query=${encodeURIComponent(v.query)}`} target="_blank" rel="noreferrer" key={v.title}><div className="thumb" style={{backgroundImage:`linear-gradient(180deg,rgba(0,0,0,.05),rgba(0,0,0,.65)),url("${v.image}")`}}><span className="play"><Play size={20} fill="currentColor"/></span></div><div className="body"><div className="tag">Vídeo</div><h3>{v.title}</h3><span className="readMeta">Buscar vídeos relacionados en YouTube →</span></div></a>)}</div></section>

   <section className="section container"><div className="categoryBox"><div><div className="eyebrow">Explora por curiosidad</div><h2>¿Qué te apetece descubrir hoy?</h2><p className="muted">Elige un tema y deja que CurioWorld te lleve de una curiosidad a otra.</p></div><div className="pillrow">{['Espacio','Ciencia','Historia','Misterios','Animales','Tecnología','Cuerpo y mente','¿Qué pasaría si...?','Planeta','Dinero'].map(x=><Link className="pill" href={`/categoria/${x.toLowerCase().replaceAll(' ','-').replaceAll('¿','').replaceAll('?','')}`} key={x}>{x}</Link>)}</div></div></section>

   <section className="newsletter container"><div><div className="eyebrow">Una curiosidad al día</div><h2>Que tu curiosidad no se quede sin alimento.</h2><p>Prepara tu newsletter para recibir un descubrimiento breve cada día. Sin ruido.</p></div><form action="/contacto" className="newsletterForm"><input placeholder="Tu email" type="email" required/><button className="btn">Quiero descubrir</button></form></section>
  </main>
  <footer className="footer"><div className="container footerGrid"><div><Link className="logo" href="/">Curio<span>World</span></Link><p>Aprende algo fascinante cada día.</p></div><div className="footerLinks"><Link href="/sobre">Sobre nosotros</Link><Link href="/contacto">Contacto</Link><Link href="/privacidad">Privacidad</Link><Link href="/terminos">Términos</Link><a href="/feed.xml">RSS</a></div></div><div className="container footerBottom">© {new Date().getFullYear()} CurioWorld · Hecho para despertar curiosidad.</div></footer>
 </>
}
