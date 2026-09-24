export type GeneratedArticle = {
  title:string; slug:string; excerpt:string; category:string; language:string;
  body:string[]; sources:{name:string;url:string}[]; image_query:string;
};

export async function generateArticle(): Promise<GeneratedArticle> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error('Falta OPENAI_API_KEY');
  const model = process.env.OPENAI_MODEL || 'gpt-5.5';
  const topics = ['espacio','ciencia','historia','animales','tecnología','cuerpo humano','psicología','planeta','misterios históricos','¿qué pasaría si...?'];
  const topic = topics[Math.floor(Math.random()*topics.length)];
  const prompt = `Eres editor jefe de CurioWorld, una revista internacional de curiosidades. Investiga un dato o pregunta fascinante sobre ${topic}. Usa web search para comprobar hechos actuales o históricos. No inventes datos. Elige un tema evergreen o verificable y apto para publicidad. Devuelve SOLO JSON con: title, slug, excerpt, category, language, body (6-9 párrafos), sources (3-6 objetos name/url), image_query. El artículo debe ser original, divulgativo y explicar contexto, evitando clickbait engañoso, pseudociencia y afirmaciones médicas sin respaldo. language=es. category debe ser una de: Ciencia, Espacio, Historia, Animales, Tecnología, Cuerpo y mente, Planeta, Misterios, ¿Qué pasaría si...?`;
  const res = await fetch('https://api.openai.com/v1/responses', {
    method:'POST', headers:{'Authorization':`Bearer ${key}`,'Content-Type':'application/json'},
    body: JSON.stringify({
      model,
      tools:[{type:'web_search'}],
      input: prompt,
      text:{format:{type:'json_schema',name:'curioworld_article',strict:true,schema:{type:'object',properties:{title:{type:'string'},slug:{type:'string'},excerpt:{type:'string'},category:{type:'string'},language:{type:'string'},body:{type:'array',items:{type:'string'}},sources:{type:'array',items:{type:'object',properties:{name:{type:'string'},url:{type:'string'}},required:['name','url'],additionalProperties:false}},image_query:{type:'string'}},required:['title','slug','excerpt','category','language','body','sources','image_query'],additionalProperties:false}}}
    })
  });
  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  const text = data.output_text;
  if (!text) throw new Error('La API no devolvió contenido');
  return JSON.parse(text);
}
