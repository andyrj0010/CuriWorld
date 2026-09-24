import { NextResponse } from "next/server";
import { articles } from "@/lib/data";
export async function GET(){return NextResponse.json({articles});}
export async function POST(req:Request){
  const body=await req.json();
  if(!body?.title||!body?.slug) return NextResponse.json({error:"title y slug son obligatorios"},{status:400});
  // Demo: aquí se conectará PostgreSQL/Supabase en producción.
  return NextResponse.json({ok:true,message:"Artículo recibido. Conecta una base de datos persistente para guardar publicaciones.",article:body},{status:201});
}