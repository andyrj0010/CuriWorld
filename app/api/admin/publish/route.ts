import {NextResponse} from 'next/server'; import {updateArticle,dbEnabled} from '@/lib/supabase';
export async function POST(req:Request){
 const key=req.headers.get('x-admin-key'); if(!process.env.ADMIN_KEY || key!==process.env.ADMIN_KEY) return NextResponse.json({error:'Unauthorized'},{status:401});
 if(!dbEnabled) return NextResponse.json({error:'Supabase no configurado'},{status:503});
 const {id}=await req.json(); if(!id) return NextResponse.json({error:'id requerido'},{status:400});
 const r=await updateArticle(id,{status:'published',published_at:new Date().toISOString()}); return NextResponse.json({ok:true,article:r});
}
