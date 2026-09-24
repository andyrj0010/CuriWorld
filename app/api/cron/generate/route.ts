import { NextResponse } from 'next/server';
import { generateArticle } from '@/lib/ai';
import { findWikimediaImage, findYouTubeVideo } from '@/lib/media';
import { dbEnabled, insertArticle } from '@/lib/supabase';

export const runtime='nodejs';
export async function POST(req:Request){
  const secret=process.env.CRON_SECRET;
  const auth=req.headers.get('authorization');
  if(secret && auth!==`Bearer ${secret}`) return NextResponse.json({error:'Unauthorized'},{status:401});
  if(!process.env.OPENAI_API_KEY) return NextResponse.json({error:'OPENAI_API_KEY no configurada'},{status:503});
  try {
    const article=await generateArticle();
    const media=await findWikimediaImage(article.image_query);
    const video=await findYouTubeVideo(article.title);
    const row={...article,body:article.body,sources:article.sources,image_url:media?.url||null,image_credit:media?`${media.title} · ${media.author} · ${media.license}`:null,video_id:video?.id||null,status:'draft'};
    if(dbEnabled){ const saved=await insertArticle(row); return NextResponse.json({ok:true,status:'draft',article:saved?.[0]||row}); }
    return NextResponse.json({ok:true,status:'preview',article:row,note:'Configura Supabase para guardar el artículo.'});
  } catch(e:any){ return NextResponse.json({error:e.message||'Generation failed'},{status:500}); }
}
