'use client';
import {useState} from 'react';
import {Sparkles} from 'lucide-react';
export default function DailyFact({facts}:{facts:string[]}){
 const [i,setI]=useState(()=>new Date().getDate()%facts.length);
 return <div className="dailyFact"><div className="factIcon"><Sparkles size={18}/></div><div><div className="factLabel">DATO RÁPIDO · HOY</div><strong>{facts[i]}</strong></div><button onClick={()=>setI((i+1)%facts.length)} aria-label="Otro dato">Otro dato</button></div>
}
