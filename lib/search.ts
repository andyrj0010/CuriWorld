import type { Article } from './data';

type Searchable = Article & Record<string, any>;

const aliases: Record<string, string[]> = {
  espacio: ['espacio', 'universo', 'planeta', 'planetas', 'luna', 'sol', 'astronomia', 'astronomía', 'estrellas', 'agujero negro', 'venus', 'marte'],
  ciencia: ['ciencia', 'cientifico', 'científica', 'científica', 'fisica', 'física', 'biologia', 'biología', 'quimica', 'química'],
  animales: ['animal', 'animales', 'fauna', 'tiburon', 'tiburón', 'pulpo', 'salamandra', 'especies'],
  historia: ['historia', 'historico', 'histórico', 'antiguo', 'civilizacion', 'civilización'],
  misterios: ['misterio', 'misterios', 'extraño', 'extrano', 'inexplicable', 'enigmas'],
  tecnologia: ['tecnologia', 'tecnología', 'ia', 'inteligencia artificial', 'internet', 'robot'],
  'cuerpo y mente': ['cuerpo', 'mente', 'cerebro', 'sueño', 'sueños', 'dormir', 'psicologia', 'psicología'],
  planeta: ['tierra', 'planeta', 'oceano', 'océano', 'mar', 'clima', 'naturaleza'],
  'qué pasaría si': ['que pasaria si', 'qué pasaría si', 'hipotetico', 'hipotético', 'y si', 'imagina que'],
};

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokens(value: string) {
  return normalize(value).split(' ').filter(Boolean);
}

function distance(a: string, b: string) {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  const prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let current = i;
    for (let j = 1; j <= b.length; j++) {
      const next = Math.min(
        current + 1,
        prev[j] + 1,
        prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
      prev[j - 1] = current;
      current = next;
    }
    prev[b.length] = current;
  }
  return prev[b.length];
}

function wordSimilarity(query: string, word: string) {
  if (word.includes(query) || query.includes(word)) return 1;
  if (query.length < 4 || word.length < 4) return 0;
  const d = distance(query, word);
  return d <= 2 || (query.length >= 7 && d <= 3) ? 1 - d / Math.max(query.length, word.length) : 0;
}

function scoreArticle(article: Searchable, query: string) {
  const q = normalize(query);
  if (!q) return 0;

  const title = normalize(article.title || '');
  const excerpt = normalize(article.excerpt || '');
  const category = normalize(article.category || '');
  const body = normalize([...(article.body || [])].join(' '));
  const text = `${title} ${excerpt} ${category} ${body}`;
  const qTokens = tokens(q);
  let score = 0;

  if (title.includes(q)) score += 120;
  if (excerpt.includes(q)) score += 55;
  if (category.includes(q)) score += 65;
  if (text.includes(q)) score += 20;

  const categoryAliases = aliases[category] || [];
  if (categoryAliases.some(alias => normalize(alias).includes(q) || q.includes(normalize(alias)))) score += 50;

  for (const qt of qTokens) {
    const allWords = tokens(`${title} ${excerpt} ${category}`);
    let best = 0;
    for (const word of allWords) best = Math.max(best, wordSimilarity(qt, word));
    score += best * 35;

    for (const [key, values] of Object.entries(aliases)) {
      if (key === category || values.some(v => wordSimilarity(qt, normalize(v)) > 0.7)) {
        if (category === key || values.some(v => normalize(v) === qt || normalize(v).includes(qt))) score += 28;
      }
    }
  }

  return score;
}

export function searchArticles(data: Searchable[], query: string, limit = 30) {
  const q = query.trim();
  if (!q) return { exact: data.slice(0, limit), related: [], scores: new Map<string, number>() };

  const ranked = data
    .map(article => ({ article, score: scoreArticle(article, q) }))
    .filter(x => x.score >= 18)
    .sort((a, b) => b.score - a.score);

  const exact = ranked.filter(x => x.score >= 50).slice(0, limit).map(x => x.article);
  const related = ranked.filter(x => x.score < 50).slice(0, limit).map(x => x.article);

  return { exact, related, scores: new Map(ranked.map(x => [x.article.slug, x.score])) };
}
