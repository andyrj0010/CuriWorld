import { articles } from "@/lib/data";
import Link from "next/link";
export default async function Category({params}:{params:Promise<{category:string}>}) {
 const {category}=await params; const label=category.replaceAll("-"," ");
 const list=articles.filter(a=>a.category.toLowerCase().includes(label.toLowerCase()));
 return <main className="container section"><div className="eyebrow">Categoría</div><h1>{label}</h1><div className="grid">{(list.length?list:articles).map(a=><Link className="card" href={`/articulo/${a.slug}`} key={a.slug}><div className="thumb" style={{backgroundImage:`url("${a.image}")`}}/><div className="body"><div className="tag">{a.category}</div><h3>{a.title}</h3><p className="muted">{a.excerpt}</p></div></Link>)}</div></main>
}