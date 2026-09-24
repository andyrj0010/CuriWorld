export async function findWikimediaImage(query:string) {
  const url = new URL('https://commons.wikimedia.org/w/api.php');
  url.searchParams.set('action','query'); url.searchParams.set('generator','search'); url.searchParams.set('gsrsearch',query);
  url.searchParams.set('gsrnamespace','6'); url.searchParams.set('gsrlimit','5'); url.searchParams.set('prop','imageinfo'); url.searchParams.set('iiprop','url|extmetadata'); url.searchParams.set('iiurlwidth','1400'); url.searchParams.set('format','json'); url.searchParams.set('origin','*');
  const r=await fetch(url,{cache:'no-store'}); if(!r.ok) return null; const j=await r.json(); const pages=Object.values(j.query?.pages||{}) as any[];
  const p=pages[0]; if(!p?.imageinfo?.[0]?.thumburl) return null;
  const m=p.imageinfo[0].extmetadata||{};
  return {url:p.imageinfo[0].thumburl,title:p.title,author:m.Artist?.value||'',license:m.LicenseShortName?.value||''};
}

export async function findYouTubeVideo(query:string) {
  const key=process.env.YOUTUBE_API_KEY; if(!key) return null;
  const u=new URL('https://www.googleapis.com/youtube/v3/search'); u.searchParams.set('part','snippet');u.searchParams.set('q',query);u.searchParams.set('type','video');u.searchParams.set('maxResults','1');u.searchParams.set('key',key);
  const r=await fetch(u,{cache:'no-store'}); if(!r.ok) return null; const j=await r.json(); const x=j.items?.[0]; if(!x) return null;
  return {id:x.id.videoId,title:x.snippet.title,channel:x.snippet.channelTitle};
}
