# CurioWorld — versión ampliada

Web de curiosidades y divulgación con Next.js, SEO, RSS, sitemap, panel base, API de búsqueda y pipeline de contenido automático.

## 1. Ejecutar localmente

Requisitos: Node.js 20+.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Abrir `http://localhost:3000`.

## 2. Base de datos

Crea un proyecto Supabase y ejecuta `supabase-schema.sql` en SQL Editor. Después configura:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

La service role key solo debe estar en el servidor.

## 3. Generación diaria

Configura:

- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- `CRON_SECRET`

`POST /api/cron/generate` investiga un tema mediante web search, genera un borrador estructurado, busca una imagen en Wikimedia Commons y opcionalmente un vídeo de YouTube.

El artículo queda en estado `draft` para revisión. Esto es intencionado: publicar automáticamente contenido no verificado no es una buena estrategia editorial ni de calidad.

## 4. YouTube

Opcional: `YOUTUBE_API_KEY`. Si no está configurada, el artículo funciona sin vídeo.

## 5. Vercel

El `vercel.json` ejecuta el endpoint cada día a las 06:00 según la configuración de Vercel. Vercel Cron dispara una función HTTP programada.

Configura todas las variables de entorno en Vercel y protege el endpoint con `CRON_SECRET`.

## 6. AdSense

El proyecto contiene espacios de anuncios, pero NO activa anuncios reales hasta que tengas aprobación y el código oficial de AdSense. Añade `NEXT_PUBLIC_ADSENSE_CLIENT` cuando corresponda y conecta el snippet proporcionado por Google.

No llenes el sitio de contenido automático sin valor. Google indica que para AdSense el contenido debe ser propio, original, de calidad y útil para la audiencia, y que el contenido copiado/scrapeado puede incumplir sus políticas.

## 7. Dominio y producción

1. Compra un dominio.
2. Importa el repositorio en Vercel.
3. Configura el dominio.
4. Configura Supabase.
5. Añade variables de entorno.
6. Despliega.
7. Comprueba `/sitemap.xml` y `/feed.xml`.
8. Añade el dominio a Google Search Console.
9. Publica contenido original y revisado.
10. Solicita AdSense cuando el sitio esté listo.

## 8. Próximas mejoras

- autenticación real para admin
- editor visual
- cola de revisión
- traducción ES/EN
- newsletters
- Open Graph images automáticas
- estadísticas por artículo
- integración social
- sistema de recomendaciones
- almacenamiento CDN de imágenes
