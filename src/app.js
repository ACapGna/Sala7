import { createClient } from '@supabase/supabase-js';
import { CFG } from './config.js';

const $=s=>document.querySelector(s);
const IMG='https://image.tmdb.org/t/p/';
const UK=['lists2','hist','prog','mylist','avatar'];
let USER='';try{USER=localStorage.getItem('sala_user')||''}catch(e){}
const kk=k=>USER&&UK.includes(k)?'u:'+USER+':'+k:k;
const store={
  get(k,d){try{const v=localStorage.getItem(kk(k));return v?JSON.parse(v):d}catch(e){return d}},
  set(k,v){try{localStorage.setItem(kk(k),JSON.stringify(v))}catch(e){}try{if(USER&&UK.includes(k))schedulePush()}catch(e){}}
};
const esc=v=>String(v==null?'':v).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
let key='',keyOk=null;
const MOB=matchMedia('(max-width:760px)').matches;
const ICON={"film": "<svg class=\"i\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><rect x=\"3\" y=\"4\" width=\"18\" height=\"16\" rx=\"3\"/><path d=\"M8 4v16M16 4v16M3 9h5M3 15h5M16 9h5M16 15h5\"/></svg>", "tv": "<svg class=\"i\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><rect x=\"3\" y=\"5\" width=\"18\" height=\"13\" rx=\"3\"/><path d=\"M8 21h8M9 2.5l3 2.5 3-2.5\"/></svg>", "anime": "<svg class=\"i\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M11 3l1.9 5.1L18 10l-5.1 1.9L11 17l-1.9-5.1L4 10l5.1-1.9z\"/><path d=\"M19 15l.8 2.2 2.2.8-2.2.8L19 21l-.8-2.2-2.2-.8 2.2-.8z\"/></svg>", "manga": "<svg class=\"i\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M12 6.5C10.5 5 8 4.5 4 4.5v13c4 0 6.5.5 8 2 1.5-1.5 4-2 8-2v-13c-4 0-6.5.5-8 2z\"/><path d=\"M12 6.5v13\"/></svg>", "cont": "<svg class=\"i\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M10 8.7l5 3.3-5 3.3z\"/></svg>", "list": "<svg class=\"i\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M7 3.5h10A1.5 1.5 0 0118.5 5v15.5L12 16.5l-6.5 4V5A1.5 1.5 0 017 3.5z\"/></svg>", "search": "<svg class=\"i\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><circle cx=\"11\" cy=\"11\" r=\"7\"/><path d=\"M20 20l-3.5-3.5\"/></svg>", "edit": "<svg class=\"i\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M4 20h4L19 9l-4-4L4 16z\"/><path d=\"M13.5 6.5l4 4\"/></svg>", "trash": "<svg class=\"i\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13\"/></svg>", "plus": "<svg class=\"i\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M12 5v14M5 12h14\"/></svg>", "clear": "<svg class=\"i\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M6 6l12 12M18 6L6 18\"/></svg>"};
ICON.search='<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>';
let tab='home',mode='rails',q='',f={g:'',y:'',r:'',s:'pop'},gv=0,cur=null;
const sleep=ms=>new Promise(r=>setTimeout(r,ms));

async function tmdb(path,params={}){
  const u=new URL('https://api.themoviedb.org/3'+path);
  u.searchParams.set('language','es-ES');
  for(const[k,v]of Object.entries(params))u.searchParams.set(k,v);
  const h={};
  if(key.length>60)h.Authorization='Bearer '+key;else u.searchParams.set('api_key',key);
  const r=await fetch(u,{headers:h});
  if(!r.ok)throw new Error('TMDB '+r.status);
  return r.json();
}

/* ---------- Catálogo básico de emergencia (si Cinemeta no responde) ---------- */
const FB={
 movie:[[550,'El club de la lucha',1999,'tt0137523'],[27205,'Origen',2010,'tt1375666'],[157336,'Interstellar',2014,'tt0816692'],[603,'Matrix',1999,'tt0133093'],[238,'El padrino',1972,'tt0068646'],[155,'El caballero oscuro',2008,'tt0468569'],[680,'Pulp Fiction',1994,'tt0110912'],[13,'Forrest Gump',1994,'tt0109830'],[278,'Cadena perpetua',1994,'tt0111161'],[424,'La lista de Schindler',1993,'tt0108052'],[769,'Uno de los nuestros',1990,'tt0099685'],[122,'El retorno del rey',2003,'tt0167260'],[120,'La comunidad del anillo',2001,'tt0120737'],[121,'Las dos torres',2002,'tt0167261'],[497,'La milla verde',1999,'tt0120689'],[129,'El viaje de Chihiro',2001,'tt0245429'],[98,'Gladiator',2000,'tt0172495'],[244786,'Whiplash',2014,'tt2582802'],[807,'Seven',1995,'tt0114369'],[105,'Regreso al futuro',1985,'tt0088763'],[11,'Star Wars',1977,'tt0076759'],[862,'Toy Story',1995,'tt0114709'],[299536,'Vengadores: Infinity War',2018,'tt4154756'],[299534,'Vengadores: Endgame',2019,'tt4154796'],[76341,'Mad Max: Furia en la carretera',2015,'tt1392190'],[496243,'Parásitos',2019,'tt6751668'],[475557,'Joker',2019,'tt7286456'],[372058,'Your Name',2016,'tt5311514'],[438631,'Dune',2021,'tt1160419'],[872585,'Oppenheimer',2023,'tt15398776'],[329,'Parque Jurásico',1993,'tt0107290'],[218,'Terminator',1984,'tt0088247'],[348,'Alien',1979,'tt0078748']],
 tv:[[1396,'Breaking Bad',2008,'tt0903747'],[1399,'Juego de tronos',2011,'tt0944947'],[66732,'Stranger Things',2016,'tt4574334'],[1668,'Friends',1994,'tt0108778'],[60574,'Peaky Blinders',2013,'tt2442560'],[1402,'The Walking Dead',2010,'tt1520211'],[1418,'The Big Bang Theory',2007,'tt0898266'],[2316,'The Office',2005,'tt0386676'],[456,'Los Simpson',1989,'tt0096697'],[1434,'Padre de familia',1999,'tt0182576'],[60625,'Rick y Morty',2013,'tt2861424'],[76479,'The Boys',2019,'tt1190634'],[94605,'Arcane',2021,'tt11126994'],[100088,'The Last of Us',2023,'tt3581920'],[82856,'The Mandalorian',2019,'tt8111088'],[87108,'Chernobyl',2019,'tt7366338'],[4607,'Perdidos',2004,'tt0411008'],[1405,'Dexter',2006,'tt0773262'],[1622,'Sobrenatural',2005,'tt0460681'],[1408,'House',2004,'tt0412142'],[63174,'Lucifer',2016,'tt4052886']]
};

/* ---------- Filas TMDB (con clave) ---------- */
const D=(path,g)=>[path,{with_genres:g,sort_by:'popularity.desc','vote_count.gte':100}];
const ROWS={
 movie:[['Tendencias esta semana','/trending/movie/week',{}],['Mejor valoradas','/movie/top_rated',{},3],['Populares','/movie/popular',{},2],['Acción',...D('/discover/movie',28)],['Comedia',...D('/discover/movie',35)],['Terror',...D('/discover/movie',27)],['Ciencia ficción',...D('/discover/movie',878)],['Animación',...D('/discover/movie',16)],['Drama',...D('/discover/movie',18)],['Romance',...D('/discover/movie',10749)],['Suspense',...D('/discover/movie',53)]],
 tv:[['Tendencias esta semana','/trending/tv/week',{}],['Mejor valoradas','/tv/top_rated',{},3],['Populares','/tv/popular',{},2],['Drama',...D('/discover/tv',18)],['Comedia',...D('/discover/tv',35)],['Ciencia ficción y fantasía',...D('/discover/tv',10765)],['Crimen',...D('/discover/tv',80)],['Misterio',...D('/discover/tv',9648)],['Documentales',...D('/discover/tv',99)]]
};
const GENRES={
 movie:[[28,'Acción'],[12,'Aventura'],[16,'Animación'],[35,'Comedia'],[80,'Crimen'],[99,'Documental'],[18,'Drama'],[10751,'Familia'],[14,'Fantasía'],[27,'Terror'],[9648,'Misterio'],[10749,'Romance'],[878,'Ciencia ficción'],[53,'Suspense'],[10752,'Bélica'],[37,'Western']],
 tv:[[10759,'Acción y aventura'],[16,'Animación'],[35,'Comedia'],[80,'Crimen'],[99,'Documental'],[18,'Drama'],[10751,'Familia'],[9648,'Misterio'],[10765,'Ciencia ficción y fantasía'],[10768,'Bélica y política'],[37,'Western']]
};
const TXT={home:['Inicio','Un poco de todo: películas, series, anime y manga.'],manga:['Manga','Catálogo de manga, manhwa y manhua de AniList, con enlaces para leerlos.'],movie:['Películas','Tendencias, grandes éxitos y colecciones por género.'],tv:['Series','Las series del momento y las que no pasan de moda.'],anime:['Anime','Series y películas de anime del catálogo de AniList.']};

const kid=it=>it.src==='al'?'al'+it.kind+it.al:it.src==='km'?'km'+it.kt:it.src==='kt'?'kt'+it.kt:it.src==='md'?'md'+it.id:it.src==='cm'?it.imdb:String(it.id);

/* ---------- Cinemeta (películas y series sin clave) ---------- */
const CM='https://v3-cinemeta.strem.io';
let cmOk=null;
async function cmCat(ty,id,ex){
  const e=Object.entries(ex||{}).filter(([k,v])=>v!==''&&v!=null&&!(k==='skip'&&!v)).map(([k,v])=>k+'='+encodeURIComponent(v)).join('&');
  try{const r=await fetch(`${CM}/catalog/${ty}/${id}${e?'/'+e:''}.json`);if(!r.ok)return[];return (await r.json()).metas||[]}catch(x){return[]}
}
const cm2it=(m,ty)=>{const y=String(m.year||m.releaseInfo||'').slice(0,4),d=y?y+'-01-01':'';return{src:'cm',imdb:m.imdb_id||m.id,media_type:ty==='series'?'tv':'movie',title:m.name,name:m.name,_img:(m.poster||'').replace('/small/','/medium/'),vote_average:parseFloat(m.imdbRating)||0,release_date:d,first_air_date:d,overview:m.description||'',genres_s:m.genres||[],bg:m.background||''}};
const RP={};
function cmRatePool(ty){
  const k=ty+'|'+(f.g||'');
  if(!RP[k])RP[k]=Promise.all(Array.from({length:10},(_,i)=>cmCat(ty,'top',{genre:f.g,skip:i*100}))).then(a=>{
    const seen=new Set(),out=[];
    a.flat().forEach(m=>{const id=m.imdb_id||m.id;if(seen.has(id))return;seen.add(id);if((parseFloat(m.imdbRating)||0)>0)out.push(m)});
    out.sort((x,y)=>(parseFloat(y.imdbRating)||0)-(parseFloat(x.imdbRating)||0));
    return out;
  });
  return RP[k];
}
async function cmList(ty,p){
  if(f.s==='rate'){
    const pool=await cmRatePool(ty);
    return pool.filter(x=>!f.r||(parseFloat(x.imdbRating)||0)>=+f.r).slice((p-1)*30,p*30).map(x=>cm2it(x,ty));
  }
  const skip=(p-1)*100,yy=f.s==='new'?String(new Date().getFullYear()):'';
  let m;
  if(yy)m=await cmCat(ty,'year',{genre:yy,skip});
  else m=await cmCat(ty,'top',{genre:f.g,skip});
  if(!m.length&&p===1&&!yy)m=await cmCat(ty,'top',{genre:f.g,skip});
  m=m.filter(x=>(!f.g||(x.genres||[]).includes(f.g))&&(!f.r||(parseFloat(x.imdbRating)||0)>=+f.r));
  return m.map(x=>cm2it(x,ty));
}
const CM_G=[['Action','Acción'],['Adventure','Aventura'],['Animation','Animación'],['Biography','Biografía'],['Comedy','Comedia'],['Crime','Crimen'],['Documentary','Documental'],['Drama','Drama'],['Family','Familia'],['Fantasy','Fantasía'],['History','Historia'],['Horror','Terror'],['Music','Música'],['Mystery','Misterio'],['Romance','Romance'],['Sci-Fi','Ciencia ficción'],['Sport','Deporte'],['Thriller','Suspense'],['War','Bélica'],['Western','Western']];
const CMROWS=[['Populares','top',''],['Mejor valoradas','imdbRating',''],['Acción','top','Action'],['Comedia','top','Comedy'],['Terror','top','Horror'],['Ciencia ficción','top','Sci-Fi'],['Animación','top','Animation'],['Drama','top','Drama'],['Romance','top','Romance'],['Suspense','top','Thriller'],['Aventura','top','Adventure'],['Fantasía','top','Fantasy'],['Crimen','top','Crime'],['Misterio','top','Mystery'],['Familia','top','Family'],['Bélica','top','War'],['Western','top','Western'],['Documentales','top','Documentary'],['Biografías','top','Biography'],['Historia','top','History']];

/* ---------- AniList (anime y manga) ---------- */
const ALU='https://graphql.anilist.co';
let alAct=0,alErr='';const alQ=[],ALMEM=new Map();
const alSlot=()=>new Promise(r=>{const go=()=>{alAct++;r()};alAct<3?go():alQ.push(go)});
const alFree=()=>{alAct--;if(alQ.length)alQ.shift()()};
async function alGql(query,variables){
  const ck=query+JSON.stringify(variables||{});
  if(ALMEM.has(ck))return ALMEM.get(ck);
  await alSlot();
  try{
    for(let i=0;i<3;i++){
      try{
        const r=await fetch(ALU,{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify({query,variables:variables||{}})});
        if(r.status===429){const w=+(r.headers.get('Retry-After')||0);alErr='AniList pide esperar un poco (demasiadas peticiones)';await sleep(Math.min(20000,(w||5)*1000));continue}
        const j=await r.json().catch(()=>null);
        if(!r.ok||!j||(j.errors&&!j.data)){alErr='AniList respondió con el error '+r.status;return null}
        ALMEM.set(ck,j.data);return j.data;
      }catch(e){alErr='el navegador no pudo conectar con AniList'}
    }
    return null;
  }finally{alFree()}
}
const AL_F='id idMal title{romaji english native} coverImage{large extraLarge} bannerImage averageScore format status episodes chapters volumes seasonYear startDate{year month day} genres countryOfOrigin nextAiringEpisode{episode}';
const AL_FULL=AL_F+' description(asHtml:false) trailer{id site}';
const stripHtml=h=>String(h||'').replace(/~!.*?!~/gs,'').replace(/<br\s*\/?>/gi,'\n').replace(/<[^>]+>/g,'').trim();
function al2it(m,kind){
  const ti=m.title||{},name=ti.english||ti.romaji||ti.native||'';
  const sd=m.startDate||{},y=m.seasonYear||sd.year||0,date=y?`${y}-${String(sd.month||1).padStart(2,'0')}-${String(sd.day||1).padStart(2,'0')}`:'';
  const ci=m.coverImage||{};
  const b={src:'al',kind,al:m.id,mal:m.idMal||null,title:name,name,alts:[ti.romaji,ti.english,ti.native].filter(Boolean),
    _img:ci.large||ci.extraLarge||'',_big:ci.extraLarge||ci.large||'',bg:m.bannerImage||'',
    vote_average:m.averageScore?m.averageScore/10:0,release_date:date,first_air_date:date,overview:stripHtml(m.description),genres_s:m.genres||[]};
  if(kind==='anime'){
    const mv=m.format==='MOVIE';
    return{...b,media_type:mv?'movie':'tv',subtype:mv?'movie':String(m.format||'').toLowerCase(),
      eps:m.episodes||(m.nextAiringEpisode?m.nextAiringEpisode.episode-1:0),yt:m.trailer&&m.trailer.site==='youtube'?m.trailer.id:''};
  }
  return{...b,media_type:'manga',mstatus:String(m.status||'').toLowerCase(),
    demo:m.countryOfOrigin==='KR'?'Manhwa':m.countryOfOrigin==='CN'?'Manhua':'Manga',chap:m.chapters||0,vols:m.volumes||0};
}
const AL_TYPES={search:'String',sort:'[MediaSort]',genre:'String',tag:'String',ys:'FuzzyDateInt',ye:'FuzzyDateInt',status:'MediaStatus',statusNot:'MediaStatus',formatIn:'[MediaFormat]',score:'Int',pop:'Int',country:'CountryCode'};
const AL_ARG={search:'search',sort:'sort',genre:'genre',tag:'tag',ys:'startDate_greater',ye:'startDate_lesser',status:'status',statusNot:'status_not',formatIn:'format_in',score:'averageScore_greater',pop:'popularity_greater',country:'countryOfOrigin'};
function alArgs(kind,o,sx){
  const decl=[],args=[`type:${kind==='anime'?'ANIME':'MANGA'}`,'isAdult:false'],v={};
  const oo=kind==='manga'&&!o.formatIn?{...o,formatIn:['MANGA','ONE_SHOT']}:o;
  for(const k in oo){if(oo[k]===''||oo[k]==null)continue;const n=k+sx;v[n]=oo[k];decl.push(`$${n}:${AL_TYPES[k]}`);args.push(`${AL_ARG[k]}:$${n}`)}
  return{decl,args,v};
}
async function alPage(kind,o,page=1,per=24,full=false){
  const a=alArgs(kind,o,'');
  const d=await alGql(`query($page:Int,$perPage:Int${a.decl.length?','+a.decl.join(','):''}){Page(page:$page,perPage:$perPage){media(${a.args.join(',')}){${full?AL_FULL:AL_F}}}}`,{page,perPage:per,...a.v});
  return((d&&d.Page&&d.Page.media)||[]).map(m=>al2it(m,kind));
}
function alRailsLoader(kind,defs){
  const groups={};
  return d=>{
    const ix=defs.indexOf(d),gi=Math.floor(ix/4);
    if(!groups[gi]){
      const decl=[],body=[],v={};
      defs.slice(gi*4,gi*4+4).forEach((dd,j)=>{
        const k=gi*4+j,a=alArgs(kind,dd[1],'_'+k);
        decl.push(...a.decl);Object.assign(v,a.v);
        body.push(`r${k}:Page(page:1,perPage:${Math.min(dd[2]||30,MOB?20:36)}){media(${a.args.join(',')}){${AL_F}}}`);
      });
      groups[gi]=alGql(`query${decl.length?'('+decl.join(',')+')':''}{${body.join(' ')}}`,v);
    }
    return groups[gi].then(data=>((data&&data['r'+ix]&&data['r'+ix].media)||[]).map(m=>al2it(m,kind)));
  };
}
const POP=['POPULARITY_DESC'],G=(n,o)=>[n,{sort:POP,...o}];
const ALR=[
 ['Populares',{sort:POP},40],['Tendencias',{sort:['TRENDING_DESC']}],['Mejor valorados',{sort:['SCORE_DESC'],pop:20000}],
 ['En emisión',{sort:POP,status:'RELEASING'}],['Películas de anime',{sort:POP,formatIn:['MOVIE']}],
 G('Shonen',{tag:'Shounen'}),G('Seinen',{tag:'Seinen'}),G('Acción',{genre:'Action'}),G('Aventura',{genre:'Adventure'}),G('Fantasía',{genre:'Fantasy'}),
 G('Ciencia ficción',{genre:'Sci-Fi'}),G('Comedia',{genre:'Comedy'}),G('Romance',{genre:'Romance'}),G('Drama',{genre:'Drama'}),G('Sobrenatural',{genre:'Supernatural'}),
 G('Psicológico',{genre:'Psychological'}),G('Deportes',{genre:'Sports'}),G('Vida cotidiana',{genre:'Slice of Life'}),G('Mecha',{genre:'Mecha'}),G('Terror',{genre:'Horror'}),G('Misterio',{genre:'Mystery'}),G('Isekai',{tag:'Isekai'})
];
const AMR=[
 ['Populares',{sort:POP},40],['Tendencias',{sort:['TRENDING_DESC']}],['Mejor valorados',{sort:['SCORE_DESC'],pop:5000}],
 ['Publicándose ahora',{sort:POP,status:'RELEASING'}],G('Manhwa (coreano)',{country:'KR'}),G('Manhua (chino)',{country:'CN'}),
 G('Shonen',{tag:'Shounen'}),G('Seinen',{tag:'Seinen'}),G('Shojo',{tag:'Shoujo'}),G('Josei',{tag:'Josei'}),
 G('Acción',{genre:'Action'}),G('Aventura',{genre:'Adventure'}),G('Fantasía',{genre:'Fantasy'}),G('Romance',{genre:'Romance'}),G('Comedia',{genre:'Comedy'}),G('Drama',{genre:'Drama'}),
 G('Terror',{genre:'Horror'}),G('Deportes',{genre:'Sports'}),G('Vida cotidiana',{genre:'Slice of Life'}),G('Sobrenatural',{genre:'Supernatural'}),G('Psicológico',{genre:'Psychological'}),G('Misterio',{genre:'Mystery'}),G('Isekai',{tag:'Isekai'})
];
const AL_G=[['Action','Acción'],['Adventure','Aventura'],['Comedy','Comedia'],['Drama','Drama'],['Fantasy','Fantasía'],['Horror','Terror'],['Mahou Shoujo','Mahou shoujo'],['Mecha','Mecha'],['Music','Música'],['Mystery','Misterio'],['Psychological','Psicológico'],['Romance','Romance'],['Sci-Fi','Ciencia ficción'],['Slice of Life','Vida cotidiana'],['Sports','Deportes'],['Supernatural','Sobrenatural'],['Thriller','Suspense'],['Shounen','Shonen'],['Seinen','Seinen'],['Shoujo','Shojo'],['Josei','Josei'],['Isekai','Isekai']];
const AL_TAGS=['Shounen','Seinen','Shoujo','Josei','Isekai'];
function alFilters(kind){
  const o={};
  if(f.g)o[AL_TAGS.includes(f.g)?'tag':'genre']=f.g;
  if(f.y){o.ys=f.y*10000;o.ye=(+f.y+1)*10000}
  if(f.r)o.score=f.r*10-1;
  o.sort=[f.s==='rate'?'SCORE_DESC':f.s==='new'?'START_DATE_DESC':f.s==='votes'?'FAVOURITES_DESC':'POPULARITY_DESC'];
  if(f.s==='rate')o.pop=kind==='anime'?15000:3000;
  if(f.s==='new')o.statusNot='NOT_YET_RELEASED';
  return o;
}
function alContent(host,kind){
  const filtered=f.g||f.y||f.r||f.s!=='pop';
  const pg=extra=>p=>alPage(kind,extra,p,24);
  if(q)return gridView(host,pg({search:q}),10);
  if(mode==='grid'||filtered)return gridView(host,pg(alFilters(kind)),25);
  const defs=kind==='anime'?ALR:AMR;
  return railsG(host,defs,alRailsLoader(kind,defs),'No pude conectar con AniList. Revisa tu conexión o inténtalo de nuevo en un rato.'+(alErr?' Motivo: '+alErr+'.':''),'al2'+kind);
}
const animeContent=h=>alContent(h,'anime'),mangaContent=h=>alContent(h,'manga');
async function alLegacy(it){
  const kind=it.src==='km'?'manga':'anime';
  const L=await alPage(kind,{search:it.title},1,3);
  return L[0]||null;
}
async function alDetail(it){
  const d=await alGql(`query($i:Int){Media(id:$i,type:ANIME){description(asHtml:false) bannerImage trailer{id site} streamingEpisodes{title} recommendations(perPage:14,sort:RATING_DESC){nodes{mediaRecommendation{${AL_F}}}}}}`,{i:it.al});
  const m=(d&&d.Media)||{};
  let total=it.eps||0;
  if(!total)total=it.subtype==='movie'?1:12;
  const T={};
  (m.streamingEpisodes||[]).forEach(x=>{const r=/^(?:Episode|Episodio|Ep\.?)\s*(\d+)\s*[-–:.]?\s*(.*)$/i.exec(x.title||'');if(r&&r[2])T[+r[1]]=r[2]});
  const seas=[{season_number:1,episode_count:total,eps:Array.from({length:total},(_,i)=>({e:i+1,title:T[i+1]||''}))}];
  const rec=((m.recommendations&&m.recommendations.nodes)||[]).map(n=>n.mediaRecommendation).filter(Boolean).map(x=>al2it(x,'anime')).filter(x=>x._img).slice(0,14);
  const yt=m.trailer&&m.trailer.site==='youtube'?m.trailer.id:(it.yt||'');
  const bg=m.bannerImage||it.bg||'';
  const base={...it,media_type:'tv',anime:true,id:it.al,title:it.title,name:it.title,overview:stripHtml(m.description)||it.overview||'',yt,bg};
  return{base,poster:it._big||it._img,bg,rt:total+(total===1?' episodio':' episodios'),genres:it.genres_s||[],tagline:'',
    trailer:yt?'https://www.youtube.com/watch?v='+yt:'',cast:[],seas,guess:false,rec,emap:null,unresolved:false};
}
async function alMangaDetail(it){
  const d=await alGql('query($i:Int){Media(id:$i,type:MANGA){description(asHtml:false) staff(perPage:8){edges{role node{name{full}}}}}}',{i:it.al});
  const m=(d&&d.Media)||{},e=(m.staff&&m.staff.edges)||[];
  return{...it,overview:stripHtml(m.description)||it.overview||'',authors:[...new Set(e.map(x=>x.node&&x.node.name&&x.node.name.full).filter(Boolean))].slice(0,4)};
}

/* ---------- MangaDex (manga) ---------- */
const MD='https://api.mangadex.org';
const mdQS=o=>{const p=new URLSearchParams();for(const[k,v]of Object.entries(o)){if(Array.isArray(v))v.forEach(x=>p.append(k+'[]',x));else if(v!==''&&v!=null)p.append(k,v)}return p.toString()};
let mdch=Promise.resolve(),mdErr='';
const MDMEM=new Map();
const enc=encodeURIComponent;
const MDP=[u=>u,u=>'https://corsproxy.io/?url='+enc(u),u=>'https://api.allorigins.win/raw?url='+enc(u),u=>'https://api.codetabs.com/v1/proxy?quest='+enc(u)];
let mdMode=Math.min(MDP.length-1,+store.get('mdmode',0)||0);
function mdq(path,o){
  const u=MD+path+'?'+mdQS(o),nc=path.startsWith('/at-home');
  if(!nc&&MDMEM.has(u))return Promise.resolve(MDMEM.get(u));
  return mdch=mdch.then(()=>sleep(150)).then(async()=>{
    for(let t=0;t<MDP.length+2;t++){
      try{
        const r=await fetch(MDP[mdMode](u));
        if(r.status===429){await sleep(1500);continue}
        if(!r.ok){
          mdErr='MangaDex respondió con el error '+r.status;
          if(mdMode<MDP.length-1){mdMode++;continue}
          break;
        }
        const j=await r.json();
        if(!nc)MDMEM.set(u,j);
        store.set('mdmode',mdMode);mdErr='';
        return j;
      }catch(e){
        mdErr='el navegador bloqueó la petición a MangaDex';
        if(mdMode<MDP.length-1){mdMode++;continue}
        break;
      }
    }
    mdMode=0;
    return{data:[]};
  });
}
const MD_BASE={'includes':['cover_art','author','artist'],contentRating:['safe','suggestive'],hasAvailableChapters:'true',availableTranslatedLanguage:['es','es-la','en']};
let mdTagMap=null;
async function mdTags(){
  if(mdTagMap)return mdTagMap;
  const j=await mdq('/manga/tag',{});const m={};
  (j.data||[]).forEach(t=>{if(t.attributes&&t.attributes.name)m[t.attributes.name.en]=t.id});
  if(Object.keys(m).length)mdTagMap=m;return m;
}
function md2it(m){
  const a=m.attributes||{},R=m.relationships||[];
  const pick=o=>o?(o.en||o.es||Object.values(o)[0]||''):'';
  const t=pick(a.title)||pick((a.altTitles||[])[0]);
  const cv=R.find(r=>r.type==='cover_art'),fn=cv&&cv.attributes&&cv.attributes.fileName;
  const auth=[...new Set(R.filter(r=>r.type==='author'||r.type==='artist').map(r=>r.attributes&&r.attributes.name).filter(Boolean))];
  const tags=(a.tags||[]).filter(x=>x.attributes&&['genre','theme'].includes(x.attributes.group)).map(x=>x.attributes.name.en);
  return{src:'md',id:m.id,media_type:'manga',title:t,name:t,
    _img:fn?`https://uploads.mangadex.org/covers/${m.id}/${fn}.512.jpg`:'',_big:fn?`https://uploads.mangadex.org/covers/${m.id}/${fn}`:'',
    vote_average:0,release_date:a.year?a.year+'-01-01':'',overview:(a.description&&(a.description.es||a.description.en))||'',
    genres_s:tags.slice(0,10),authors:auth,mstatus:a.status||'',demo:a.publicationDemographic||'',lastCh:a.lastChapter||''};
}
async function mdList(o,p=1,per=24){
  const j=await mdq('/manga',{...MD_BASE,...o,limit:per,offset:(p-1)*per});
  const items=(j.data||[]).map(md2it);
  if(items.length){
    const st=await mdq('/statistics/manga',{manga:items.map(i=>i.id)});
    const S=st.statistics||{};
    items.forEach(i=>{const s=S[i.id];if(s&&s.rating)i.vote_average=s.rating.bayesian||s.rating.average||0});
  }
  return items;
}
async function mdQuery(d,p=1,per=24){
  const o={...d};
  if(o.tag){const tm=await mdTags();if(tm[o.tag])o.includedTags=[tm[o.tag]];delete o.tag}
  return mdList(o,p,per);
}
const MT=tag=>({tag,'order[followedCount]':'desc'});
const MDR=[
 ['Más seguidos',{'order[followedCount]':'desc'}],['Mejor valorados',{'order[rating]':'desc'}],['Actualizados ahora',{'order[latestUploadedChapter]':'desc'}],
 ['Shonen',{publicationDemographic:['shounen'],'order[followedCount]':'desc'}],['Seinen',{publicationDemographic:['seinen'],'order[followedCount]':'desc'}],
 ['Shojo',{publicationDemographic:['shoujo'],'order[followedCount]':'desc'}],['Josei',{publicationDemographic:['josei'],'order[followedCount]':'desc'}],
 ['Acción',MT('Action')],['Romance',MT('Romance')],['Fantasía',MT('Fantasy')],['Comedia',MT('Comedy')],['Isekai',MT('Isekai')],['Terror',MT('Horror')],['Deportes',MT('Sports')],['Vida cotidiana',MT('Slice of Life')],['Psicológico',MT('Psychological')],['Sobrenatural',MT('Supernatural')]
];
const MD_G=[['Action','Acción'],['Adventure','Aventura'],['Comedy','Comedia'],['Drama','Drama'],['Fantasy','Fantasía'],['Horror','Terror'],['Mystery','Misterio'],['Psychological','Psicológico'],['Romance','Romance'],['Sci-Fi','Ciencia ficción'],['Slice of Life','Vida cotidiana'],['Sports','Deportes'],['Supernatural','Sobrenatural'],['Isekai','Isekai'],['Martial Arts','Artes marciales'],['Mecha','Mecha'],['School Life','Vida escolar'],['Historical','Histórico'],['Thriller','Suspense'],['Tragedy','Tragedia'],['Magic','Magia'],['Music','Música'],['Crime','Crimen'],['Reincarnation','Reencarnación'],['Survival','Supervivencia']];
function mdFilters(){
  const o={};
  if(f.g)o.tag=f.g;
  if(f.y)o.year=f.y;
  const ord={pop:'followedCount',rate:'rating',new:'latestUploadedChapter',votes:'followedCount'}[f.s]||'followedCount';
  o['order['+ord+']']='desc';
  return o;
}
async function mdFind(ts,al,mal){
  const n=x=>String(x||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
  for(const t of ts.slice(0,3)){
    const j=await mdq('/manga',{title:t,limit:8,contentRating:['safe','suggestive'],'order[relevance]':'desc'});
    const L=j.data||[],w=n(t);
    let m=L.find(x=>{const k=(x.attributes||{}).links||{};return (al&&String(k.al)===String(al))||(mal&&String(k.mal)===String(mal))});
    if(!m)m=L.find(x=>{const a=x.attributes||{};return [a.title,...(a.altTitles||[])].some(o=>o&&Object.values(o).some(v=>n(v)===w))});
    if(!m&&L[0]){const a=L[0].attributes||{},tt=n(Object.values(a.title||{})[0]);if(tt&&w&&(tt.includes(w)||w.includes(tt)))m=L[0]}
    if(m)return m.id;
  }
  return null;
}
async function mdChapters(id){
  const by={};let off=0;
  for(let i=0;i<4;i++){
    const j=await mdq(`/manga/${id}/feed`,{translatedLanguage:['es','es-la','en'],contentRating:['safe','suggestive'],'order[volume]':'asc','order[chapter]':'asc',limit:500,offset:off,includeExternalUrl:1});
    const d=j.data||[];
    d.forEach(c=>{
      const a=c.attributes||{};if(!a.chapter&&!a.title)return;
      const L=a.translatedLanguage;(by[L]=by[L]||{});
      const k=a.chapter||('x'+c.id);
      const cur0=by[L][k];
      if(!cur0||(cur0.ext&&!a.externalUrl))by[L][k]={id:c.id,ch:a.chapter,title:a.title||'',vol:a.volume,ext:a.externalUrl||''};
    });
    if(d.length<500)break;off+=500;
  }
  const out={};
  Object.keys(by).forEach(L=>{out[L]=Object.values(by[L]).sort((a,b)=>(parseFloat(a.ch)||0)-(parseFloat(b.ch)||0))});
  return out;
}

/* ---------- Filas / listas genéricas ---------- */
const genreList=()=>(tab==='manga'||tab==='anime')?AL_G:key?GENRES[tab]:CM_G;
const RC=store.get('rc3',{}),RC_TTL=6*36e5;let rcT=0;
const saveRC=()=>{clearTimeout(rcT);rcT=setTimeout(()=>store.set('rc3',RC),1500)};
const slimC=it=>{const o={};KEEP.forEach(k=>{if(it[k]!=null)o[k]=it[k]});o.overview='';delete o.alts;return o};
async function railsG(host,defs,load,failMsg,ck){
  const tk=++gv;host.innerHTML='';delete host.dataset.done;
  const secs=defs.map(d=>{const s=document.createElement('section');s.className='rail';s.innerHTML=`<h3>${esc(d[0])}</h3><div class="scroller"></div>`;host.append(s);return s});
  arrows(host);
  let total=0;
  const fill=async i=>{
    const d=defs[i],k2=ck?ck+'|'+d[0]:'',hit=k2&&RC[k2]&&Date.now()-RC[k2].t<RC_TTL?RC[k2].items:null;
    let items=hit||[];
    if(!hit){try{items=await load(d)}catch(e){}if(k2&&items.length){RC[k2]={t:Date.now(),items:items.slice(0,24).map(slimC)};saveRC()}}
    const seen=new Set(),sc=secs[i].querySelector('.scroller'),frag=document.createDocumentFragment();let n=0;
    items.forEach(it=>{if(!it||!it._img)return;const k=kid(it);if(seen.has(k))return;seen.add(k);n++;frag.append(card(it,tab==='home'?ctxOfIt(it):tab))});
    sc.append(frag);
    total+=n;if(!n)secs[i].remove();
  };
  const first=Math.min(MOB?3:5,defs.length);
  const io='IntersectionObserver' in window?new IntersectionObserver(es=>{es.forEach(en=>{if(en.isIntersecting){io.unobserve(en.target);fill(+en.target.dataset.i)}})},{rootMargin:'900px 0px'}):null;
  const firstP=[];
  defs.forEach((d,i)=>{secs[i].dataset.i=i;if(i<first||!io)firstP.push(fill(i));else io.observe(secs[i])});
  await Promise.all(firstP);
  if(tk!==gv)return;
  if(total)host.dataset.done='1';
  else if(failMsg)host.innerHTML=`<p class="note box">${esc(failMsg)}${tab==='manga'||tab==='anime'?'':''}</p>`;
}
function fbContent(host){
  gv++;
  host.innerHTML='<p class="note box">No pude conectar con el catálogo en línea (revisa tu conexión). Muestro el catálogo básico.</p><div class="grid"></div>';
  FB[tab].forEach(a=>host.querySelector('.grid').append(card(fbItem(a,tab),tab)));
}
async function keylessContent(host){
  if(cmOk===null)cmOk=(await cmCat('movie','top',{})).length>0;
  if(!cmOk)return fbContent(host);
  const ty=tab==='tv'?'series':'movie';
  const filtered=f.g||f.y||f.r||f.s!=='pop';
  if(q)return gridView(host,async p=>p>1?[]:(await cmCat(ty,'top',{search:q})).map(m=>cm2it(m,ty)),1);
  if(mode==='grid'||filtered)return gridView(host,p=>cmList(ty,p));
  return railsG(host,CMROWS,async d=>{let m=await cmCat(ty,d[1],{genre:d[2]});if(!m.length&&d[1]!=='top')m=await cmCat(ty,'top',{genre:d[2]});return m.slice(0,60).map(x=>cm2it(x,ty))},undefined,'cm'+tab);
}

/* ---------- Tarjetas ---------- */
function arrows(root){
  root.querySelectorAll('.scroller:not([data-ar])').forEach(sc=>{
    sc.dataset.ar='1';
    const w=document.createElement('div');w.className='sw';
    sc.parentNode.insertBefore(w,sc);w.append(sc);
    const mk=(c,t,d)=>{const b=document.createElement('button');b.type='button';b.className='ar '+c;b.textContent=t;b.setAttribute('aria-label',d>0?'Siguiente':'Anterior');b.onclick=()=>sc.scrollBy({left:d*sc.clientWidth*.85,behavior:'smooth'});return b};
    const L=mk('l','‹',-1),R=mk('r','›',1);w.append(L,R);
    const upd=()=>{if(sc.dataset.lp){L.hidden=R.hidden=false;return}L.hidden=sc.scrollLeft<8;R.hidden=sc.scrollLeft+sc.clientWidth>=sc.scrollWidth-8};
    /* bucle infinito: [copia][originales][copia] y se recoloca al parar */
    const setW=()=>{const o=[...sc.children].filter(c=>!c.dataset.dup);if(o.length<2)return 0;const f=sc.querySelector('[data-dup="a"]');return f?o[0].getBoundingClientRect().left-f.getBoundingClientRect().left:0};
    const loopInit=()=>{
      if(sc.dataset.lp||!sc.closest('.rail')||!sc.clientWidth)return;
      const o=[...sc.children].filter(c=>c.classList.contains('card'));
      if(o.length<3)return;
      const last=o[o.length-1],w=last.getBoundingClientRect().right-o[0].getBoundingClientRect().left+16;
      if(w<sc.clientWidth*1.05)return;
      sc.dataset.lp='1';sc.style.scrollSnapType='none';
      const cl=tag=>o.map(c=>{const n=c.cloneNode(true);n.onclick=c.onclick;n.dataset.dup=tag;n.tabIndex=-1;n.setAttribute('aria-hidden','true');return n});
      const A=cl('a'),B=cl('b');
      sc.prepend(...A);sc.append(...B);
      const sw=setW();sc.scrollLeft=sw;upd();
    };
    let tm=0;
    const norm=()=>{if(!sc.dataset.lp)return;const sw=setW();if(!sw)return;const x=sc.scrollLeft;if(x>=2*sw-2)sc.scrollLeft=x-sw;else if(x<=2)sc.scrollLeft=x+sw};
    sc.addEventListener('scroll',()=>{upd();if(sc.dataset.lp){clearTimeout(tm);tm=setTimeout(norm,140)}},{passive:true});
    try{new ResizeObserver(()=>{loopInit();upd()}).observe(sc);new MutationObserver(()=>{loopInit();upd()}).observe(sc,{childList:true})}catch(e){}
    loopInit();upd();
  });
}
function card(it,ctx){
  const type=it.media_type||(ctx==='movie'?'movie':'tv');
  const label=type==='manga'?'Manga':(ctx==='anime'||it.src==='kt'||it.kind==='anime')?'Anime':type==='tv'?'Serie':'Película';
  const t=it.title||it.name||'',y=(it.release_date||it.first_air_date||'').slice(0,4);
  const pr=store.get('prog',{})[type+kid(it)];
  const pct=pr&&pr.d?Math.min(100,pr.t/pr.d*100):0;
  const src=it.poster_path?IMG+'w342'+it.poster_path:it._img;
  const b=document.createElement('button');b.className='card';
  b.setAttribute('aria-label',(type==='manga'?'Abrir ':'Ver ')+t);
  b.innerHTML=`<div class="p">${src?`<img loading="lazy" decoding="async" alt="" data-t="${esc(t)}" src="${esc(src)}">`:`<div class="np">${esc(t)}</div>`}<span class="bd">${label}</span>${it.vote_average?`<span class="rt">★ ${(+it.vote_average).toFixed(1)}</span>`:''}${pct?`<div class="bar" style="width:${pct}%"></div>`:''}<div class="play" aria-hidden="true">▶</div></div><b>${esc(t)}</b><small>${y||'—'} • ${label}</small>`;
  b.onclick=()=>showDetail({...it,media_type:type},ctx);
  return b;
}
function fbItem(a,ctx){return {imdb:a[3],_img:'https://images.metahub.space/poster/medium/'+a[3]+'/img',id:a[0],title:a[1],name:a[1],release_date:a[2]+'-01-01',first_air_date:a[2]+'-01-01',media_type:ctx==='movie'?'movie':'tv'}}

/* ---------- Vistas ---------- */
function gridView(host,fetchPage,max=25){
  host.innerHTML='<div class="grid"></div><div class="more"><button class="btn ghost"></button></div>';
  const g=host.firstChild,btn=host.querySelector('button'),tk=++gv,seen=new Set();let page=1,n=0;
  async function more(){
    btn.disabled=true;btn.textContent='Cargando…';
    const ps=[0,1,2].map(i=>page+i).filter(p=>p<=max);
    const res=await Promise.all(ps.map(p=>fetchPage(p).catch(()=>[])));
    if(tk!==gv)return;
    page+=3;
    let added=0;res.flat().forEach(it=>{const k=kid(it);if(seen.has(k))return;seen.add(k);n++;added++;g.append(card(it,tab))});
    if(!n)host.innerHTML='<p class="empty">No hay resultados con estos filtros.</p>';
    else if(page>max||!added)btn.hidden=true;
    else{btn.disabled=false;btn.textContent='Cargar más ('+n+')'}
  }
  btn.onclick=more;more();
}
async function rails(host){
  const tk=++gv;host.innerHTML='';
  const rows=ROWS[tab];
  const sc=rows.map(([t])=>{
    const s=document.createElement('section');s.className='rail';
    s.innerHTML=`<h3>${t}</h3><div class="scroller"></div>`;host.append(s);return s;
  });
  await Promise.all(rows.map(async([t,path,params,pages=1],i)=>{
    const res=await Promise.all(Array.from({length:pages},(_,k)=>tmdb(path,{...params,page:k+1}).then(r=>r.results).catch(()=>[])));
    if(tk!==gv)return;
    const seen=new Set();let n=0;
    res.flat().forEach(it=>{if(!it.poster_path||seen.has(it.id))return;seen.add(it.id);n++;sc[i].querySelector('.scroller').append(card(it,tab))});
    if(!n)sc[i].remove();
  }));
  if(tk===gv)host.dataset.done='1';
}
function discoverParams(p){
  const mv=tab==='movie',o={page:p};
  if(f.g)o.with_genres=f.g;
  if(f.y)o[mv?'primary_release_year':'first_air_date_year']=f.y;
  if(f.r)o['vote_average.gte']=f.r;
  o['vote_count.gte']=50;
  if(f.s==='pop')o.sort_by='popularity.desc';
  if(f.s==='rate'){o.sort_by='vote_average.desc';o['vote_count.gte']=300}
  if(f.s==='votes')o.sort_by='vote_count.desc';
  if(f.s==='new'){o.sort_by=mv?'primary_release_date.desc':'first_air_date.desc';o[mv?'primary_release_date.lte':'first_air_date.lte']=new Date().toISOString().slice(0,10);o['vote_count.gte']=20}
  return o;
}
async function content(){
  const host=$('#content');
  if(tab==='manga')return mangaContent(host);
  if(tab==='anime')return animeContent(host);
  return keylessContent(host);
}
function phead(ic,t,sub,right){return `<div class="ph"><div class="pt"><span class="pic">${ICON[ic]}</span><div><h1>${t}</h1><p>${sub}</p></div></div>${right||''}</div>`}
function sel(id,opts,val){return `<select id="${id}" aria-label="${opts[0][1]}">${opts.map(([v,l])=>`<option value="${v}" ${String(v)===String(val)?'selected':''}>${l}</option>`).join('')}</select>`}
const HERO={};
const HL={movie:'Película',tv:'Serie',anime:'Anime',manga:'Manga'};
async function heroData(t){
  if(HERO[t])return HERO[t];
  let it=null;
  try{
    if(t==='anime'||t==='manga'){const L=await alPage(t,{sort:POP},1,8,true);it=L.find(x=>x.bg&&x._img)||L[0]||null}
    else{
      const ty=t==='tv'?'series':'movie',m=await cmCat(ty,'top',{});
      const x=m.find(y=>y.background&&y.poster)||m[0];
      if(x){
        it=cm2it(x,ty);it.bg=x.background||'';
        try{const n=await cmDetail(it);it={...it,overview:n.base.overview||it.overview,genres_s:(n.genres&&n.genres.length?n.genres:it.genres_s)}}catch(e){}
      }
    }
  }catch(e){}
  if(it)HERO[t]=it;
  return it;
}
async function loadHero(t){
  const it=await heroData(t),host=$('#hero');
  if(!host||(tab!==t&&tab!=='home'))return;
  if(!it){host.remove();return}
  const y=(it.release_date||'').slice(0,4),bg=it.bg||it._big||it._img||'';
  host.classList.remove('sk');
  host.style.backgroundImage='none';host.style.setProperty('--bgi',`url("${bg.replace(/"/g,'%22')}")`);
  const meta=[y,HL[t],(it.genres_s||[]).slice(0,3).join(' / ')].filter(Boolean).join(' • ');
  host.innerHTML=`<div class="hero-in"><div class="bds"><span class="chip">DESTACADO · ${HL[t].toUpperCase()}</span>${it.vote_average?`<span class="chip gold">★ ${(+it.vote_average).toFixed(1)}</span>`:''}</div><h2>${esc(it.title)}</h2><p class="hm">${esc(meta)}</p><p class="hd">${esc(it.overview||'')}</p><div class="hbtn"><button class="btn hw" id="hw">▶ ${t==='manga'?'Leer ahora':'Ver ahora'}</button><button class="btn ghost" id="hdt">ⓘ Detalles</button><button class="btn ghost" id="hsh">Compartir</button></div></div>`;
  $('#hw').onclick=()=>showDetail(it,t,{play:true});
  $('#hdt').onclick=()=>showDetail(it,t);
  $('#hsh').onclick=async()=>{try{if(navigator.share)await navigator.share({title:it.title,url:location.href});else{await navigator.clipboard.writeText((it.title||'')+' — '+location.href);$('#hsh').textContent='Copiado'}}catch(e){}};
}
function render(){
  curDH='';store.set('nav',{tab,q});navH(tab);
  document.querySelectorAll('.tb').forEach(b=>b.setAttribute('aria-pressed',b.dataset.t===tab));
  gv++;const pg=$('#page');
  $('#tq').value=tab==='search'?q:'';
  $('#tq').placeholder='Buscar películas, series, anime, manga…';
  if(tab==='search')return searchView(pg);
  if(tab==='history')return histView(pg);
  if(tab==='list')return listsView(pg);
  if(tab==='profile')return profileView(pg);
  if(tab==='home')return homeView(pg);
  const mg=tab==='manga';
  const sorts=mg?[['pop','Más seguidos'],['rate','Mejor valorados'],['new','Actualizados recientemente']]:tab==='anime'?[['pop','Más populares'],['rate','Mejor valorados'],['new','Más recientes']]:[['pop','Más populares'],['rate','Mejor valoradas'],['new','Más recientes']];
  pg.innerHTML=`<section id="hero" class="hero sk" aria-label="Destacado"></section>
   <div class="ph"><div><h1>${TXT[tab][0]}</h1><p>${TXT[tab][1]}</p></div>
</div>
   <div id="content"></div>`;
  [['fg','g'],['fr','r'],['fs','s']].forEach(([id,k])=>{const el=$('#'+id);if(el)el.onchange=e=>{f[k]=e.target.value;q='';content()}});
  loadHero(tab);
  const dflt=mode==='rails'&&!q&&!f.g&&!f.y&&!f.r&&f.s==='pop',cc=DC[tab];
  if(dflt&&cc&&Date.now()-cc.t<18e5){$('#content').replaceWith(cc.node);return}
  content();
}
const DC={};
function stashContent(){
  const c=$('#content');
  if(c&&c.dataset.done&&['anime','manga','movie','tv'].includes(tab)&&mode==='rails'&&!q&&!f.g&&!f.y&&!f.r&&f.s==='pop')DC[tab]={node:c,t:Date.now()};
}
document.querySelectorAll('.tb').forEach(b=>b.onclick=()=>{stashContent();tab=b.dataset.t;q='';f={g:'',y:'',r:'',s:'pop'};render();scrollTo(0,0)});
const SGL={movie:'Películas',tv:'Series',anime:'Anime',manga:'Manga'};
const SQ={};
async function searchAll(qs,per){
  const k=qs.toLowerCase()+'|'+per;if(SQ[k])return SQ[k];
  const [al,mv,tvs]=await Promise.all([
    alGql(`query($s:String){a:Page(perPage:${per}){media(type:ANIME,search:$s,isAdult:false,sort:SEARCH_MATCH){${AL_F}}} m:Page(perPage:${per}){media(type:MANGA,search:$s,isAdult:false,format_in:[MANGA,ONE_SHOT],sort:SEARCH_MATCH){${AL_F}}}}`,{s:qs}),
    cmCat('movie','top',{search:qs}),cmCat('series','top',{search:qs})]);
  const r={movie:(mv||[]).slice(0,per).map(x=>cm2it(x,'movie')),tv:(tvs||[]).slice(0,per).map(x=>cm2it(x,'series')),
    anime:((al&&al.a&&al.a.media)||[]).map(m=>al2it(m,'anime')),manga:((al&&al.m&&al.m.media)||[]).map(m=>al2it(m,'manga'))};
  if(r.movie.length||r.tv.length||r.anime.length||r.manga.length)SQ[k]=r;
  return r;
}
let sugT=0,sugN=0,sugR=null,sugI=-1;
function posSug(){const g=$('#sug');if(innerWidth<=760){g.style.right='';g.style.top='';return}const r=$('#tsf').getBoundingClientRect(),n=$('nav.top').getBoundingClientRect();g.style.right=(n.width-(r.right-n.left))+'px';g.style.top=(r.bottom-n.top+8)+'px'}
addEventListener('resize',()=>{if(!$('#sug').hidden)posSug()});
function closeSug(){const g=$('#sug');g.hidden=true;g.innerHTML='';sugI=-1;sugR=null}
async function updSug(){
  const v=$('#tq').value.trim();
  if(v.length<2){closeSug();return}
  const n=++sugN,g=$('#sug');g.hidden=false;posSug();
  if(!sugR)g.innerHTML='<div class="sn"><span class="spin"></span>Buscando…</div>';
  const r=await searchAll(v,5);
  if(n!==sugN)return;
  sugR=r;sugI=-1;
  const first=['movie','tv','anime','manga'].includes(tab)?tab:'anime',order=[first,...['anime','manga','movie','tv'].filter(x=>x!==first)];
  let html='',any=false;
  order.forEach(k=>{
    if(!r[k].length)return;any=true;
    html+=`<div class="sg">${SGL[k]}</div>`+r[k].map((it,i)=>{
      const y=(it.release_date||'').slice(0,4);
      return `<button type="button" class="si" data-k="${k}" data-i="${i}">${it._img?`<img loading="lazy" alt="" src="${esc(it._img)}">`:'<span class="ni"></span>'}<span class="st"><b>${esc(it.title)}</b><small>${[SGL[k].replace(/s$/,''),y,it.vote_average?'★ '+(+it.vote_average).toFixed(1):''].filter(Boolean).join(' · ')}</small></span></button>`;
    }).join('');
  });
  g.innerHTML=any?html+`<button type="button" class="sa">Ver todos los resultados de «${esc(v)}»</button>`:`<div class="sn">No encontré nada para «${esc(v)}».</div>`;
}
function goSearch(){
  const v=$('#tq').value.trim();if(!v)return;
  closeSug();stashContent();tab='search';q=v;render();scrollTo(0,0);
}
$('#tsf').onsubmit=e=>{e.preventDefault();goSearch()};
$('#tq').addEventListener('input',()=>{clearTimeout(sugT);sugT=setTimeout(updSug,300)});
$('#tq').addEventListener('focus',()=>{if($('#tq').value.trim().length>=2&&!sugR)updSug();else if(sugR){$('#sug').hidden=false;posSug()}});
$('#tq').addEventListener('keydown',e=>{
  const items=[...$('#sug').querySelectorAll('.si')];
  if(e.key==='ArrowDown'||e.key==='ArrowUp'){
    if(!items.length)return;e.preventDefault();
    sugI=(sugI+(e.key==='ArrowDown'?1:-1)+items.length)%items.length;
    items.forEach((x,i)=>x.classList.toggle('on',i===sugI));items[sugI].scrollIntoView({block:'nearest'});
  }else if(e.key==='Enter'&&sugI>=0&&items[sugI]){e.preventDefault();items[sugI].click()}
  else if(e.key==='Escape')closeSug();
});
$('#sug').onclick=e=>{
  const b=e.target.closest('.si');
  if(b&&sugR){const k=b.dataset.k,it=sugR[k][+b.dataset.i];closeSug();showDetail(it,k);return}
  if(e.target.closest('.sa'))goSearch();
};
document.addEventListener('click',e=>{if(!e.target.closest('#tsf'))closeSug()});
async function searchView(pg){
  const tk=++gv;
  pg.innerHTML=phead('search','Resultados',`Para «${esc(q)}» en películas, series, anime y manga.`,'')+'<div id="content"><p class="empty"><span class="spin"></span>Buscando…</p></div>';
  const r=await searchAll(q,24);
  if(tk!==gv)return;
  const host=$('#content');host.innerHTML='';let n=0;
  ['movie','tv','anime','manga'].forEach(k=>{
    const L=r[k];if(!L.length)return;n+=L.length;
    const sc=document.createElement('section');sc.className='rail';
    sc.innerHTML=`<h3>${SGL[k]}</h3><div class="scroller"></div>`;host.append(sc);
    L.forEach(it=>sc.querySelector('.scroller').append(card(it,k)));
  });
  arrows(host);
  if(!n)host.innerHTML=`<div class="emp"><span class="pic">${ICON.search}</span><h3>Sin resultados</h3><p>No encontré nada para «${esc(q)}». Prueba con otro título o con el nombre en inglés.</p></div>`;
}
$('#brand').onclick=()=>{stashContent();tab='home';mode='rails';q='';f={g:'',y:'',r:'',s:'pop'};render();scrollTo(0,0)};

/* ---------- Reproductor ---------- */
const pv=$('#pv'),stage=$('#stage');
let liveT=0;
$('#es').checked=store.get('es',false);
$('#safe').checked=true;
$('#mprov').value=store.get('mprov','xyz');$('#mprov').onchange=()=>{store.set('mprov',$('#mprov').value);mount()};
const epsOf=z=>z?(z.eps?z.eps:Array.from({length:z.episode_count},(_,i)=>({e:i+1}))):[];
function embedUrl(){
  if(cur.anime){
    const pr=$('#aprov').value,lang=$('#alang').value;
    if(pr==='ae'&&cur.al){
      const tot=cur.seasons&&cur.seasons[0]?cur.seasons[0].episode_count:0,sv=store.get('prog',{})[`tv${cur.k}:${cur.s}:${cur.e}`];
      const t=liveT>5?liveT:(sv&&sv.t>20&&(!sv.d||sv.t<sv.d-30)?sv.t:0);
      return `https://aniembed.se/e/${cur.al}/${cur.e}?lang=${lang}&autoplay=1&hasPrev=${cur.e>1?1:0}&hasNext=${cur.e<tot?1:0}`+(t?`&t=${Math.floor(t)}`:'');
    }
    const H=pr==='fxp'?'framextv.pro':'framextv.xyz';
    const id=pr==='fxm'?(cur.mal||cur.al):(cur.al||cur.mal);
    const p=new URLSearchParams({id,type:cur.subtype==='movie'?'movie':'tv',season:1,episode:cur.e,sub_type:lang,autoplay:1,muted:0});
    if($('#srv').value)p.set('server',$('#srv').value);
    if($('#spd').value!=='1')p.set('speed',$('#spd').value);
    return 'https://'+H+'/embed/anime?'+p;
  }
  const rm=cur.emap&&cur.emap[cur.e],rs=rm?rm[0]:cur.s,re=rm?rm[1]:cur.e;
  const base='https://'+($('#mprov').value==='pro'?'framextv.pro':'framextv.xyz')+'/embed/'+cur.id+(cur.media_type==='tv'?`/${rs}/${re}`:'');
  const p=new URLSearchParams({autoplay:1,muted:0});
  const server=$('#srv').value||($('#es').checked?'archer':'');
  if(server)p.set('server',server);
  if($('#spd').value!=='1')p.set('speed',$('#spd').value);
  const all=store.get('prog',{});
  const sv=cur.media_type==='tv'?all[`tv${cur.k}:${cur.s}:${cur.e}`]:all['movie'+cur.k];
  const t=liveT>5?liveT:(sv&&sv.t>20&&(!sv.d||sv.t<sv.d-30)?sv.t:0);
  if(t)p.set('t',Math.floor(t));
  return base+'?'+p;
}
let aeT=0,aeGot=false,aeBlocked=false,aeMuted=false;
function mount(){
  const sb=$('#safe').checked?' sandbox="allow-scripts allow-same-origin allow-forms allow-presentation"':'';
  $('#pl').innerHTML=`<iframe src="${embedUrl()}"${sb} ${cur.anime?'':'referrerpolicy="no-referrer" '}allow="autoplay *; fullscreen *; picture-in-picture *; encrypted-media *" allowfullscreen webkitallowfullscreen mozallowfullscreen title="Reproductor"></iframe>`;
  $('#prog').textContent='';
  clearTimeout(aeT);aeGot=false;
  const mt=++mountTok,ae=cur.anime&&$('#aprov').value==='ae';
  const pr=cur.anime?$('#aprov').value:'',host=ae?'aniembed.se':((cur.anime?pr==='fxp':$('#mprov').value==='pro')?'framextv.pro':'framextv.xyz');
  // Comprobación de conexión en segundo plano: si el servidor no responde, se cambia solo a otro
  (async()=>{
    if(await reach(host)||mt!==mountTok||!cur||pv.hidden)return;
    if(ae){$('#aprov').value='fx';animeUi();mount();say('AniEmbed no responde ahora mismo. Uso FrameXTV; podrás volver a elegir AniEmbed más tarde.');return}
    const alt=host==='framextv.xyz'?'framextv.pro':'framextv.xyz';
    if(!(await reach(alt))||mt!==mountTok||!cur||pv.hidden)return;
    if(cur.anime)$('#aprov').value=alt==='framextv.pro'?'fxp':'fx';else $('#mprov').value=alt==='framextv.pro'?'pro':'xyz';
    animeUi();mount();say(host+' no responde. Cambié a '+alt+' automáticamente.');
  })();
  // AniEmbed conecta pero no emite señales: cambia a FrameXTV
  if(ae){
    aeT=setTimeout(()=>{
      if(!cur||pv.hidden||aeGot||!cur.anime||$('#aprov').value!=='ae')return;
      upC['aniembed.se']={ok:false,t:Date.now()};
      $('#aprov').value='fx';animeUi();mount();
      say('AniEmbed no respondió. Uso FrameXTV; puedes volver a elegir AniEmbed.');
    },7000);
  }
}
let mountTok=0;const upC={};const say=t=>{$('#prog').textContent=t};
async function reach(host){
  const c=upC[host];if(c&&Date.now()-c.t<(c.ok?300000:120000))return c.ok;
  let ok=true;const ac=new AbortController(),t=setTimeout(()=>ac.abort(),5000);
  try{await fetch('https://'+host+'/',{mode:'no-cors',cache:'no-store',signal:ac.signal})}catch(e){ok=false}
  clearTimeout(t);upC[host]={ok,t:Date.now()};return ok;
}
function send(m){
  const fr=$('#pl iframe');if(!fr)return;
  if(cur&&cur.anime&&$('#aprov').value==='ae'){
    const a=m.action;let n,d={};
    if(a==='play'||a==='pause')n=a;
    else if(a==='seekBy'){n='seek';d={time:Math.max(0,liveT+m.seconds)}}
    else if(a==='setVolume'){n='setVolume';d={volume:m.volume}}
    else if(a==='mute'){aeMuted=!aeMuted;n='setMuted';d={muted:aeMuted}}
    else if(a==='rate'){n='setPlaybackRate';d={rate:m.rate}}
    else return;
    fr.contentWindow.postMessage({source:'aniembed',version:1,type:'command',name:n,requestId:(crypto.randomUUID?crypto.randomUUID():String(Date.now())),data:d},'https://aniembed.se');
    return;
  }
  fr.contentWindow.postMessage(m,'*');
}
function sub(){
  let s='';
  if(cur.media_type==='tv'){
    const z=cur.seasons.find(x=>x.season_number===cur.s),ep=z&&z.eps&&z.eps.find(x=>x.e===cur.e);
    const rm=cur.emap&&cur.emap[cur.e];
    s=(rm?`Episodio ${cur.e} · T${rm[0]} E${rm[1]}`:`Temporada ${cur.s} · Episodio ${cur.e}`)+(ep&&ep.title?` — ${ep.title}`:'');
  }
  $('#dsub').textContent=s;
}
function drawEps(){
  const z=cur.seasons.find(x=>x.season_number===cur.s),L=epsOf(z),big=L.length>100;
  let sl=L;
  if(big){
    const n=Math.ceil(L.length/25),r=cur._r!=null?cur._r:Math.min(n-1,Math.floor((cur.e-1)/25));
    $('#rgs').innerHTML=Array.from({length:n},(_,i)=>`<option value="${i}" ${i===r?'selected':''}>${i*25+1}–${Math.min(L.length,(i+1)*25)}</option>`).join('');
    sl=L.slice(r*25,r*25+25);
  }
  $('#rgp').hidden=!big;
  $('#eps').innerHTML=sl.map(x=>`<button data-e="${x.e}" title="${esc(x.title||'')}" ${x.e===cur.e?'aria-current="true"':''}>${x.e}</button>`).join('');
}
function syncTv(){if(curDH)pvHash(curDH+'/s'+cur.s+'e'+cur.e);cur._r=null;$('#sea').value=cur.s;drawEps();sub();const z=cur.seasons.find(x=>x.season_number===cur.s);$('#epcur').textContent=(cur.anime||cur.seasons.length<2?'':'Temporada '+cur.s+' · ')+'Episodio '+cur.e+' de '+epsOf(z).length}
function step(d){
  const l=cur.seasons.flatMap(z=>epsOf(z).map(x=>[z.season_number,x.e]));
  const i=l.findIndex(a=>a[0]===cur.s&&a[1]===cur.e),n=l[i+d];
  if(!n)return;cur.s=n[0];cur.e=n[1];liveT=0;syncTv();mount();
}
function animeUi(){
  const an=!!(cur&&cur.anime),ae=an&&$('#aprov').value==='ae';
  $('#sep').hidden=an;
  document.querySelectorAll('.nx').forEach(e=>e.hidden=false);
  $('#mpp').hidden=an;$('#alp').hidden=!an;
}
function openTitle(it,ctx){
  if(!it.id)return;
  pvPushed=false;cur={...it,k:kid(it),s:it.s||1,e:it.e||1,ctx};liveT=0;document.body.classList.add('pvo');
  {const h=dHash(it,ctx);if(h){curDH=h;if(it.media_type!=='tv')pvHash(h+'/p')}}
  $('#dt').textContent=it.title||it.name||'';
  const bg=it._bg||it.bg||it._big||it._img||'';
  $('#pvbg').style.backgroundImage=bg?`url("${bg.replace(/"/g,'%22')}")`:'none';
  $('#ov').textContent=it.overview||'';
  const tv=it.media_type==='tv';
  $('#tvbox').hidden=!tv;$('#bPrev').hidden=!tv;$('#bNext').hidden=!tv;
  if(tv){
    const seasons=it.seasons&&it.seasons.length?it.seasons:[{season_number:1,episode_count:12}];
    cur.seasons=seasons;if(!it.s)cur.s=seasons[0].season_number;
    $('#sea').innerHTML=seasons.map(x=>`<option value="${x.season_number}">Temporada ${x.season_number} (${x.episode_count})</option>`).join('');
  }
  $('#alang').value=store.get('alang','sub');$('#aprov').value=store.get('aprov2','fx');animeUi();
  pv.hidden=false;document.body.style.overflow='hidden';pv.scrollTop=0;
  if(tv)syncTv();else $('#dsub').textContent='';
  mount();
  const h=store.get('hist',[]).filter(x=>!(kid(x)===kid(it)&&x.media_type===it.media_type));
  h.unshift(slim(it,ctx));store.set('hist',h.slice(0,40));
}
function closePv(){
  document.body.classList.remove('pvo');closeEpSheet();
  if(curDH){const back=pvPushed&&!popping&&history.state&&history.state.i>0;pvPushed=false;if(back){appH=curDH;try{history.back()}catch(e){}}else navH(curDH,true)}
  if(stage.classList.contains('fake'))stage.classList.remove('fake');
  if(document.fullscreenElement||document.webkitFullscreenElement){try{(document.exitFullscreen||document.webkitExitFullscreen).call(document)}catch(e){}}
  $('#pl').innerHTML='';pv.hidden=true;document.body.style.overflow='';cur=null;
}
$('#rgs').onchange=e=>{cur._r=+e.target.value;drawEps()};
$('#sea').onchange=e=>{cur.s=+e.target.value;const z=cur.seasons.find(x=>x.season_number===cur.s),L=epsOf(z);cur.e=L.length?L[0].e:1;liveT=0;syncTv();mount()};
$('#epopen').onclick=openEpSheet;$('#es2x').onclick=closeEpSheet;$('#es2b').onclick=closeEpSheet;
$('#eps').onclick=e=>{const b=e.target.closest('button');if(!b)return;cur.e=+b.dataset.e;liveT=0;syncTv();mount()};
['srv','spd','es','alang','aprov'].forEach(i=>$('#'+i).onchange=()=>{
  if(i==='spd'&&cur&&cur.anime&&$('#aprov').value==='ae'){send({action:'rate',rate:+$('#spd').value});return}if(i==='es')store.set('es',$('#es').checked);if(i==='alang')store.set('alang',$('#alang').value);if(i==='aprov'){store.set('aprov2',$('#aprov').value);delete upC['aniembed.se'];animeUi()}mount()});

$('#vol').oninput=e=>send({action:'setVolume',volume:+e.target.value});
$('#ctl').onclick=e=>{
  const a=e.target.closest('[data-a]');a&&(()=>{
    const k=a.dataset.a;
    if(k==='play')send({action:'play'});else if(k==='pause')send({action:'pause'});
    else if(k==='back')send({action:'seekBy',seconds:-10});else if(k==='fwd')send({action:'seekBy',seconds:10});
    else if(k==='mute')send({action:'mute'});else if(k==='prev')step(-1);else if(k==='next')step(1);
  })();
};
$('#close').onclick=closePv;
$('#newtab').onclick=()=>{if(cur)window.open(embedUrl(),'_blank','noopener')};
async function castTv(){
  if(!cur)return;
  if(window.PresentationRequest){
    try{
      await new PresentationRequest([embedUrl()]).start();
      $('#prog').textContent='Enviado a la pantalla. Para parar, usa el icono de Cast del navegador.';
      return;
    }catch(e){if(e&&e.name==='NotAllowedError')return}
  }
  $('#tvh').showModal();
}
$('#tvcast').onclick=castTv;
$('#tvx').onclick=()=>$('#tvh').close();
$('#tvc').onclick=()=>$('#tvh').close();
$('#tvo').onclick=()=>{$('#tvh').close();if(cur)window.open(embedUrl(),'_blank','noopener')};
$('#tvh').addEventListener('click',e=>{if(e.target===$('#tvh'))$('#tvh').close()});

/* Pantalla completa: nativa si el navegador deja; si no, ocupa toda la ventana */
const fsEl=()=>document.fullscreenElement||document.webkitFullscreenElement;
function updFs(){$('#fs').textContent=stage.classList.contains('fake')?'⛶ Salir de pantalla completa':'⛶ Pantalla completa'}
let fsHist=false;
function fsPush(){if(!fsHist){try{history.pushState({...(history.state||{}),fs:1},'');fsHist=true}catch(e){}}}
function fsPop(){if(fsHist){fsHist=false;try{if(history.state&&history.state.fs)history.back()}catch(e){}}}
addEventListener('popstate',()=>{if(fsHist){fsHist=false;if(stage.classList.contains('fake')||fsEl())exitFs(true)}});
async function exitFs(fromPop){
  if(!fromPop)fsPop();
  stage.classList.remove('fake');
  if(fsEl()){try{await (document.exitFullscreen||document.webkitExitFullscreen).call(document)}catch(e){}}
  updFs();
}
async function toggleFs(){
  if(stage.classList.contains('fake')||fsEl())return exitFs();
  stage.classList.add('fake');fsPush();updFs();
  const el=document.documentElement,rq=el.requestFullscreen||el.webkitRequestFullscreen;
  if(rq){try{await rq.call(el)}catch(e){}}
  updFs();
}
$('#fs').onclick=toggleFs;
$('#xfs').onclick=exitFs;
const fsCh=()=>{if(!fsEl()){stage.classList.remove('fake');rstage.classList.remove('fake')}updFs();rUpd()};
document.addEventListener('fullscreenchange',fsCh);document.addEventListener('webkitfullscreenchange',fsCh);
addEventListener('keydown',e=>{
  if(!rd.hidden){
    if(e.key==='Escape'){if(rstage.classList.contains('fake')){rstage.classList.remove('fake');rUpd()}else if(!fsEl())closeRd()}
    return;
  }
  if(pv.hidden)return;
  if(e.key==='Escape'){if(!$('#es2').hidden){closeEpSheet();return}if(stage.classList.contains('fake')){stage.classList.remove('fake');updFs()}else if(!fsEl())closePv()}
  else if((e.key==='f'||e.key==='F')&&!/INPUT|SELECT|TEXTAREA/.test((document.activeElement||{}).tagName||'')){toggleFs()}
});

/* ---------- Lector de manga ---------- */
const rd=$('#rd'),rstage=$('#rstage');
let rdc=null,rdTk=0;
const SITES={plus:{n:'MANGA Plus',u:t=>'https://mangaplus.shueisha.co.jp/search_result?keyword='+encodeURIComponent(t)},lm:{n:'LectorManga',u:t=>'https://lectormanga.com/library?title='+encodeURIComponent(t)},im:{n:'InManga',u:t=>'https://inmanga.com/manga/consult?suggestion='+encodeURIComponent(t)}};
function rdLoad(){
  const c=rdc.list[rdc.i],plus=!!SITES[$('#rdSrc').value],t=rdc.it.title;
  $('#rdT').textContent=t;
  $('#rdC').textContent=c?('Capítulo '+(c.ch||'—')+(c.title?' — '+c.title:'')):'';
  $('#rdPrev').hidden=$('#rdNext').hidden=!rdc.list.length;
  $('#rdPrev').disabled=rdc.i<=0;$('#rdNext').disabled=rdc.i>=rdc.list.length-1;
  const ext=!plus&&c&&c.ext;
  $('#rdf').hidden=!(plus||ext);$('#rdp').hidden=plus||ext;
  if(ext){
    $('#rdN').textContent='Capítulo oficial enlazado desde MangaDex (se abre en la web de la editorial). Si no carga aquí, usa «↗ Pestaña nueva».';
    $('#rdf').src=c.ext;$('#rdOpen').href=c.ext;
    return;
  }
  if(plus){
    const sk=SITES[$('#rdSrc').value],url=sk.u(t);
    $('#rdN').textContent='Se abre la búsqueda de '+sk.n+' con el título; elige el capítulo dentro. Si no carga aquí (algunas webs no permiten abrirse dentro de otra), usa «↗ Pestaña nueva».';
    $('#rdf').src=url;$('#rdOpen').href=url;
    return;
  }
  $('#rdf').src='about:blank';
  $('#rdOpen').href=c&&c.id?'https://mangadex.org/chapter/'+c.id:'https://mangadex.org/search?q='+encodeURIComponent(t);
  rdPages(c);
}
async function rdPages(c){
  const tk=++rdTk,box=$('#rdp');
  $('#rdN').textContent='Lector propio con la API de MangaDex. Las páginas vienen de MangaDex@Home.';
  const sw='<button class="btn" id="rdsw">Probar con MANGA Plus</button>';
  const bindSw=()=>{const b=$('#rdsw');if(b)b.onclick=()=>{$('#rdSrc').value='plus';rdLoad()}};
  if(!c||!c.id){box.innerHTML='<div class="rdm"><span>MangaDex no tiene este capítulo para leer aquí.</span>'+sw+'</div>';bindSw();return}
  box.innerHTML='<div class="rdm"><span><span class="spin"></span>Cargando páginas…</span></div>';
  const j=await mdq('/at-home/server/'+c.id,{});
  if(tk!==rdTk)return;
  const ch=j&&j.chapter;
  if(!j||!j.baseUrl||!ch){box.innerHTML=`<div class="rdm"><span>No pude cargar las páginas (${esc(mdErr||'MangaDex no respondió')}).</span>${sw}<a href="https://mangadex.org/chapter/${esc(c.id)}" target="_blank" rel="noopener noreferrer">Abrir este capítulo en MangaDex</a></div>`;bindSw();return}
  const saver=MOB&&ch.dataSaver&&ch.dataSaver.length,files=saver?ch.dataSaver:ch.data,q=saver?'data-saver':'data';
  if(!files||!files.length){box.innerHTML='<div class="rdm"><span>Este capítulo no tiene páginas alojadas en MangaDex (es de una editorial oficial).</span>'+sw+'</div>';bindSw();return}
  box.innerHTML=files.map(f=>`<img loading="lazy" decoding="async" alt="" src="${esc(j.baseUrl+'/'+q+'/'+ch.hash+'/'+f)}">`).join('')+'<div class="rdm"><button class="btn" id="rdn2">Siguiente capítulo →</button></div>';
  box.scrollTop=0;
  const n2=$('#rdn2');if(n2){if(rdc&&rdc.i>=rdc.list.length-1)n2.remove();else n2.onclick=()=>$('#rdNext').click()}
}
function openReader(it,list,i,src){
  rdc={it,list:list||[],i:Math.max(0,i||0)};
  const c=rdc.list[rdc.i];
  $('#rdSrc').value=src||(c&&c.id?'mdx':'plus');
  rd.hidden=false;document.body.style.overflow='hidden';rdLoad();
}
function closeRd(){
  if(rstage.classList.contains('fake'))rstage.classList.remove('fake');
  if(fsEl()){try{(document.exitFullscreen||document.webkitExitFullscreen).call(document)}catch(e){}}
  $('#rdf').src='about:blank';$('#rdp').innerHTML='';rdTk++;rd.hidden=true;rdc=null;if(pv.hidden)document.body.style.overflow='';
}
const rUpd=()=>{$('#rdFs').textContent=rstage.classList.contains('fake')?'⛶ Salir de pantalla completa':'⛶ Pantalla completa'};
async function rFs(){
  if(rstage.classList.contains('fake')||fsEl()){
    rstage.classList.remove('fake');
    if(fsEl()){try{await (document.exitFullscreen||document.webkitExitFullscreen).call(document)}catch(e){}}
    rUpd();return;
  }
  rstage.classList.add('fake');rUpd();
  const el=document.documentElement,rq=el.requestFullscreen||el.webkitRequestFullscreen;
  if(rq){try{await rq.call(el)}catch(e){}}
  rUpd();
}
$('#rdClose').onclick=closeRd;$('#rdFs').onclick=rFs;
$('#rxfs').onclick=rFs;
$('#rdPrev').onclick=()=>{if(rdc&&rdc.i>0){rdc.i--;rdLoad()}};
$('#rdNext').onclick=()=>{if(rdc&&rdc.i<rdc.list.length-1){rdc.i++;rdLoad()}};
$('#rdSrc').onchange=()=>{if(rdc)rdLoad()};

let last=0;
addEventListener('message',ev=>{
  const d=ev.data;
  if(cur&&d&&d.source==='aniembed'&&ev.origin==='https://aniembed.se'){
    aeGot=true;const dd=d.data||{},ct=dd.currentTime!=null?dd.currentTime:(dd.time!=null?dd.time:dd.position),du=dd.duration||0;
    if(ct!=null&&!isNaN(+ct))liveT=+ct;
    if(['progress','pause','ended'].includes(d.name)&&ct!=null&&!isNaN(+ct)){
      const fm=x=>Math.floor(x/60)+':'+String(Math.floor(x%60)).padStart(2,'0');
      $('#prog').textContent=fm(+ct)+(du?' / '+fm(+du):'');
      if(d.name!=='progress'||Date.now()-last>=5000){last=Date.now();
      const p=store.get('prog',{}),rec={t:+ct,d:+du};
      p[`tv${cur.k}:${cur.s}:${cur.e}`]=rec;p['tv'+cur.k]=rec;store.set('prog',p)}
    }
    if(d.name==='ended'||d.name==='next')step(1);
    else if(d.name==='previous')step(-1);
    else if(d.name==='error'){upC['aniembed.se']={ok:false,t:Date.now()};$('#aprov').value='fx';animeUi();mount();setTimeout(()=>{$('#prog').textContent='AniEmbed dio un error de reproducción. Uso FrameXTV.'},50)}
    return;
  }
  if(!cur||!d||d.event!=='frameXTV:timeupdate')return;
  const fm=s=>Math.floor(s/60)+':'+String(Math.floor(s%60)).padStart(2,'0');
  liveT=d.currentTime||0;
  $('#prog').textContent=fm(d.currentTime)+' / '+fm(d.duration||0);
  if(Date.now()-last<5000)return;last=Date.now();
  const p=store.get('prog',{}),rec={t:d.currentTime,d:d.duration};
  p[cur.media_type+cur.k]=rec;
  if(cur.media_type==='tv')p[`tv${cur.k}:${cur.s}:${cur.e}`]=rec;
  store.set('prog',p);
});

/* ---------- Mi lista / historial ---------- */
const KEEP=['id','src','imdb','kt','alts','media_type','title','name','poster_path','_img','_big','bg','vote_average','release_date','first_air_date','genres_s','authors','eps','subtype','yt','mstatus','demo','lastCh','chap','vols','al','mal','anime','kind'];
const slim=(it,ctx)=>{const o={ctx};KEEP.forEach(k=>{if(it[k]!=null)o[k]=it[k]});o.overview=(it.overview||'').slice(0,500);return o};
const same=(a,b)=>kid(a)===kid(b)&&(a.src==='al'||a.media_type===b.media_type);
function getLists(){
  let L=store.get('lists2',null);
  if(!Array.isArray(L)){L=[{id:'fav',name:'Mi lista',items:store.get('mylist',[])}];store.set('lists2',L)}
  return L;
}
const saveLists=L=>store.set('lists2',L);
const listCount=it=>getLists().filter(l=>l.items.some(x=>same(x,it))).length;
let ldIt=null,ldCtx='movie',ldDone=null,ldSel=new Set(),ldNew=[];
function drawLd(){
  const row=(id,name,n,chk,pend)=>`<label class="ldi${pend?' pend':''}"><input type="checkbox" data-id="${esc(id)}" ${chk?'checked':''}><span class="nm">${esc(name)}<small>${pend?'Lista nueva':n+(n===1?' título':' títulos')}</small></span><span class="tick"></span></label>`;
  $('#ldl').innerHTML=getLists().map(l=>row(l.id,l.name,l.items.length,ldSel.has(l.id),false)).join('')+ldNew.map((x,i)=>row('n'+i,x.name,0,x.on,true)).join('');
}
function openLists(it,ctx,done){
  ldIt=it;ldCtx=ctx;ldDone=done;ldNew=[];
  ldSel=new Set(getLists().filter(l=>l.items.some(x=>same(x,it))).map(l=>l.id));
  const img=it.poster_path?IMG+'w185'+it.poster_path:(it._img||'');
  $('#ldh').innerHTML=(img?`<img alt="" src="${esc(img)}">`:'')+`<h2>${esc(it.title||it.name||'')}</h2><small>Elige en qué listas guardarlo</small>`;
  drawLd();$('#ldn').value='';$('#ld').showModal();
}
$('#ldl').onchange=e=>{
  const c=e.target.closest('input[type=checkbox]');if(!c)return;
  const id=c.dataset.id,m=/^n(\d+)$/.exec(id);
  if(m&&ldNew[+m[1]])ldNew[+m[1]].on=c.checked;else if(c.checked)ldSel.add(id);else ldSel.delete(id);
  drawLd();
};
$('#ldf').onsubmit=e=>{
  e.preventDefault();const n=$('#ldn').value.trim();if(!n)return;
  ldNew.push({name:n.slice(0,40),on:true});$('#ldn').value='';drawLd();
  const l=$('#ldl');l.scrollTop=l.scrollHeight;
};
$('#lds').onclick=()=>{
  const n=$('#ldn').value.trim();if(n)ldNew.push({name:n.slice(0,40),on:true});
  const L=getLists();
  L.forEach(l=>{
    const has=l.items.some(x=>same(x,ldIt)),want=ldSel.has(l.id);
    if(want&&!has)l.items.unshift(slim(ldIt,ldCtx));else if(!want&&has)l.items=l.items.filter(x=>!same(x,ldIt));
  });
  ldNew.filter(x=>x.on).forEach((x,i)=>L.push({id:'l'+Date.now().toString(36)+i,name:x.name,items:[slim(ldIt,ldCtx)]}));
  saveLists(L);$('#ld').close();if(ldDone)ldDone();
};
$('#ldc').onclick=()=>$('#ld').close();
$('#ldx').onclick=()=>$('#ld').close();
$('#ld').addEventListener('click',e=>{if(e.target===$('#ld'))$('#ld').close()});
function inlForm(act,val,ok,fn){
  act.innerHTML=`<form class="inl"><input maxlength="40" placeholder="Nombre de la lista" value="${esc(val)}" autocomplete="off" aria-label="Nombre de la lista"><button class="btn">${ok}</button><button type="button" class="btn ghost">Cancelar</button></form>`;
  const fm=act.firstChild,i=fm.querySelector('input');i.focus();i.select();
  fm.querySelector('.ghost').onclick=()=>{act.innerHTML=''};
  fm.onsubmit=e=>{e.preventDefault();const n=i.value.trim();if(n)fn(n.slice(0,40))};
}
function inlAsk(act,msg,ok,fn){
  act.innerHTML=`<div class="inl warn"><span class="msg">${msg}</span><button class="btn danger">${ok}</button><button class="btn ghost">Cancelar</button></div>`;
  act.querySelector('.ghost').onclick=()=>{act.innerHTML=''};
  act.querySelector('.danger').onclick=fn;
}
function bindList(btn,it,ctx){
  const upd=()=>{const n=listCount(it);btn.textContent=n?`✓ En ${n} lista${n>1?'s':''}`:'＋ Añadir a lista'};
  upd();btn.onclick=()=>openLists(it,ctx,upd);
}
function cardW(it,ctx,onRm){
  const w=document.createElement('div');w.className='cw';w.append(card(it,it.ctx||ctx));
  const x=document.createElement('button');x.type='button';x.className='rm';x.textContent='✕';x.title='Quitar';x.setAttribute('aria-label','Quitar '+(it.title||it.name||''));
  x.onclick=e=>{e.stopPropagation();onRm(it,w)};w.append(x);return w;
}
function forgetProg(it){
  const p=store.get('prog',{}),k=kid(it);
  Object.keys(p).forEach(n=>{if(n===it.media_type+k||n==='tv'+k||n==='movie'+k||n.startsWith('tv'+k+':'))delete p[n]});
  store.set('prog',p);
}
function histView(pg){
  const has=store.get('hist',[]).length;
  pg.innerHTML=phead('cont','Seguir viendo','Lo último que abriste. Pulsa ✕ en un cartel para quitarlo.',has?`<button class="btn ghost ic-b" id="hclr">${ICON.trash}Vaciar historial</button>`:'')+'<div id="hact"></div><div id="content"></div>';
  const host=$('#content');
  const empty=()=>{host.innerHTML=`<div class="emp"><span class="pic">${ICON.cont}</span><h3>Aún no has empezado nada</h3><p>Lo que abras aparecerá aquí para que puedas retomarlo cuando quieras.</p><button class="btn" id="goex">Explorar películas</button></div>`;$('#goex').onclick=()=>{tab='movie';render();scrollTo(0,0)};const hb=$('#hclr');if(hb)hb.remove()};
  const paint=()=>{
    const h=store.get('hist',[]);
    if(!h.length)return empty();
    host.innerHTML='<div class="grid"></div>';const g=host.firstChild;
    h.forEach(it=>g.append(cardW(it,'movie',(x,w)=>{store.set('hist',store.get('hist',[]).filter(y=>!same(y,x)));forgetProg(x);w.remove();if(!g.children.length)paint()})));
  };
  paint();
  const hb=$('#hclr');if(hb)hb.onclick=()=>inlAsk($('#hact'),'¿Vaciar todo el historial de «Seguir viendo»?','Vaciar historial',()=>{store.set('hist',[]);store.set('prog',{});$('#hact').innerHTML='';paint()});
}
let curList='fav';
function listsView(pg){
  const L=getLists();
  if(!L.length){
    pg.innerHTML=phead('list','Mis listas','Crea listas y guarda lo que quieras ver. Añade títulos desde su ficha con «Añadir a lista».',`<button class="btn ic-b" id="nl">${ICON.plus}Nueva lista</button>`)+`<div id="lact"></div><div class="emp"><span class="pic">${ICON.list}</span><h3>No tienes listas</h3><p>Crea una lista para empezar a guardar películas, series, anime y manga.</p></div>`;
    $('#nl').onclick=()=>inlForm($('#lact'),'','Crear lista',n=>{const A=getLists(),id='l'+Date.now().toString(36);A.push({id,name:n,items:[]});saveLists(A);curList=id;render()});
    return;
  }
  if(!L.some(l=>l.id===curList))curList=L[0].id;
  const cl=L.find(l=>l.id===curList);
  pg.innerHTML=phead('list','Mis listas','Crea listas y guarda lo que quieras ver. Añade títulos desde su ficha con «Añadir a lista».',`<button class="btn ic-b" id="nl">${ICON.plus}Nueva lista</button>`)+`
   <div class="ss" id="lt" style="margin-top:20px">${L.map(l=>`<button data-id="${esc(l.id)}" aria-pressed="${l.id===curList}">${esc(l.name)}<i>(${l.items.length})</i></button>`).join('')}</div>
   <div class="row lbar"><button class="btn ghost sm ic-b" id="lrn">${ICON.edit}Renombrar</button><button class="btn ghost sm ic-b" id="ldel">${ICON.trash}Eliminar lista</button>${cl.items.length?`<button class="btn ghost sm ic-b" id="lemp">${ICON.clear}Vaciar lista</button>`:''}</div>
   <div id="lact"></div>
   <div id="content"></div>`;
  $('#lt').onclick=e=>{const b=e.target.closest('button');if(!b)return;curList=b.dataset.id;render()};
  const act=$('#lact');
  $('#nl').onclick=()=>inlForm(act,'','Crear lista',n=>{const A=getLists(),id='l'+Date.now().toString(36);A.push({id,name:n,items:[]});saveLists(A);curList=id;render()});
  $('#lrn').onclick=()=>inlForm(act,cl.name,'Guardar',n=>{const A=getLists();A.find(l=>l.id===cl.id).name=n;saveLists(A);render()});
  const dl=$('#ldel');if(dl)dl.onclick=()=>inlAsk(act,`¿Eliminar la lista <b>${esc(cl.name)}</b>? Se quitarán sus ${cl.items.length} títulos.`,'Eliminar lista',()=>{saveLists(getLists().filter(l=>l.id!==cl.id));curList='';render()});
  const em=$('#lemp');if(em)em.onclick=()=>inlAsk(act,`¿Quitar todos los títulos de <b>${esc(cl.name)}</b>?`,'Vaciar lista',()=>{const A=getLists();A.find(l=>l.id===cl.id).items=[];saveLists(A);render()});
  const host=$('#content');
  const paint=()=>{
    const cur_=getLists().find(l=>l.id===curList);
    if(!cur_||!cur_.items.length){host.innerHTML=`<div class="emp"><span class="pic">${ICON.list}</span><h3>Esta lista está vacía</h3><p>Abre una película, serie, anime o manga y pulsa «Añadir a lista» para guardarla aquí.</p><button class="btn" id="goex">Explorar</button></div>`;$('#goex').onclick=()=>{tab='movie';render();scrollTo(0,0)};return}
    host.innerHTML='<div class="grid"></div>';const g=host.firstChild;
    cur_.items.forEach(it=>g.append(cardW(it,'movie',(x,w)=>{
      const A=getLists(),l=A.find(y=>y.id===curList);l.items=l.items.filter(y=>!same(y,x));saveLists(A);w.remove();
      const ch=$('#lt button[aria-pressed=true] i');if(ch)ch.textContent='('+l.items.length+')';
      if(!g.children.length)paint();
    })));
  };
  paint();
}
const fmtRt=m=>(m>=60?Math.floor(m/60)+'h ':'')+(m%60)+'m';
const DEFSEAS=()=>Array.from({length:10},(_,i)=>({season_number:i+1,episode_count:24}));
let backFn=()=>render();

/* ---------- Fichas ---------- */
let curDH='';
function dHash(it,ctx){if(it.src==='al'&&it.al)return `${ctx}/al/${it.kind}/${it.al}`;if(it.src==='cm'&&it.imdb)return `${ctx}/cm/${it.media_type}/${it.imdb}`;return ''}
/* Historial del navegador: cada pantalla (pestaña, ficha, reproductor) es una entrada; "atrás" vuelve a la anterior */
let appH='',popping=false,pvPushed=false;
function navH(h,replace){
  appH=h;if(popping)return;
  const u='#'+h;if(location.hash===u)return;
  try{
    const st=history.state||{},i=st.i||0;
    if(replace)history.replaceState({...st,i},'',u);
    else{history.replaceState({...st,i,y:scrollY},'');history.pushState({i:i+1},'',u)}
  }catch(e){}
}
const setHash=h=>navH(h);
function pvHash(h){navH(h,pvPushed);pvPushed=true}
async function showDetail(it,ctx,opts){
  {const h=dHash(it,ctx);if(h){curDH=h;setHash(h)}}
  stashContent();const sy=scrollY;backFn=()=>{if(history.state&&history.state.i>0)history.back();else{render();setTimeout(()=>scrollTo(0,sy),600)}};
  const tk=++gv;scrollTo(0,0);
  if(it.src==='kt'||it.src==='km'){
    $('#page').innerHTML='<p class="empty">Cargando…</p>';
    const nx=await alLegacy(it);
    if(tk!==gv)return;
    if(!nx){$('#page').innerHTML='<p class="note box">No pude cargar esta ficha. <button class="btn ghost" id="bk">← Volver</button></p>';$('#bk').onclick=()=>backFn();return}
    it=nx;
  }
  if(it.src==='al'&&it.kind==='manga'){
    $('#page').innerHTML='<p class="empty">Cargando…</p>';
    const mm=await alMangaDetail(it);
    if(tk!==gv)return;
    drawManga(mm,opts);return;
  }
  if(it.src==='md'){drawManga(it);return}
  $('#page').innerHTML='<p class="empty">Cargando…</p>';
  let N;
  try{N=it.src==='al'?await alDetail(it):it.src==='cm'?await cmDetail(it):await tmdbDetail(it)}
  catch(e){try{N=await tmdbDetail({...it,id:it.id||it.imdb})}catch(x){N=null}}
  if(tk!==gv)return;
  if(!N){$('#page').innerHTML='<p class="note box">No pude cargar esta ficha. <button class="btn ghost" id="bk">← Volver</button></p>';$('#bk').onclick=()=>backFn();return}
  drawDetail(it,N,ctx,opts);
}
async function tmdbDetail(it){
  let d=null;
  if(key&&/^\d+$/.test(String(it.id))){try{d=await tmdb(`/${it.media_type}/${it.id}`,{append_to_response:'credits,recommendations,videos',include_video_language:'es,en,null'})}catch(e){}}
  const tv=it.media_type==='tv',b={...it,...(d||{}),media_type:it.media_type};
  const vids=(d&&d.videos&&d.videos.results)||[];
  const vid=vids.find(v=>v.site==='YouTube'&&v.type==='Trailer')||vids.find(v=>v.site==='YouTube');
  const real=tv&&d?(d.seasons||[]).filter(z=>z.season_number>0&&z.episode_count):[];
  return{base:b,poster:b.poster_path?IMG+'w500'+b.poster_path:(it._img||'').replace('/medium/','/large/'),bg:b.backdrop_path?IMG+'w1280'+b.backdrop_path:'',
    rt:tv?(d&&d.number_of_seasons?d.number_of_seasons+(d.number_of_seasons>1?' temporadas':' temporada'):''):(d&&d.runtime?fmtRt(d.runtime):''),
    genres:(b.genres||[]).map(g=>g.name),tagline:b.tagline||'',trailer:vid?'https://www.youtube.com/watch?v='+vid.key:'',
    cast:((d&&d.credits&&d.credits.cast)||[]).filter(c=>c.profile_path).slice(0,16).map(c=>({name:c.name,character:c.character,img:IMG+'w185'+c.profile_path})),
    seas:tv?(real.length?real:DEFSEAS()):[],guess:tv&&!real.length,
    rec:((d&&d.recommendations&&d.recommendations.results)||[]).filter(x=>x.poster_path).slice(0,12)};
}
async function cmDetail(it){
  const ty=it.media_type==='tv'?'series':'movie',tv=ty==='series';let m=null;
  try{m=(await(await fetch(`${CM}/meta/${ty}/${it.imdb}.json`)).json()).meta}catch(e){}
  m=m||{};const gens=m.genres||it.genres_s||[];
  const by={};(m.videos||[]).filter(v=>v.season>0&&v.episode>0).forEach(v=>{(by[v.season]=by[v.season]||[]).push({e:v.episode,title:v.title||v.name||'',rel:v.released||'',thumb:v.thumbnail||''})});
  const seas=Object.keys(by).map(Number).sort((a,b)=>a-b).map(n=>{const eps=by[n].sort((a,b)=>a.e-b.e);const ds=eps.map(x=>x.rel).filter(Boolean).sort();return{season_number:n,episode_count:eps.length,eps,air_date:(ds[0]||'').slice(0,10)}});
  const yr=String(m.year||m.releaseInfo||it.release_date||'').slice(0,4),dt=yr?yr+'-01-01':'';
  const base={...it,id:m.moviedb_id||it.imdb,title:m.name||it.title,name:m.name||it.name,overview:m.description||it.overview,vote_average:parseFloat(m.imdbRating)||it.vote_average,release_date:dt,first_air_date:dt,genres_s:gens};
  const tr=(m.trailers&&m.trailers[0]&&m.trailers[0].source)||(m.trailerStreams&&m.trailerStreams[0]&&m.trailerStreams[0].ytId)||'';
  const rec=(await cmCat(ty,'top',{genre:gens[0]||''})).filter(x=>(x.imdb_id||x.id)!==it.imdb).slice(0,14).map(x=>cm2it(x,ty));
  const mins=parseInt(m.runtime);
  return{base,poster:(m.poster||it._img||'').replace('/small/','/large/').replace('/medium/','/large/'),bg:m.background||'',
    rt:tv?(seas.length?seas.length+(seas.length>1?' temporadas':' temporada'):''):(mins?fmtRt(mins):''),genres:gens,tagline:'',
    trailer:tr?'https://www.youtube.com/watch?v='+tr:'',cast:(m.cast||[]).slice(0,16).map(n=>({name:n})),
    seas:tv?(seas.length?seas:DEFSEAS()):[],guess:tv&&!seas.length,rec};
}
/* ---------- Lista de episodios (buscar + ordenar) ---------- */
const ICO_SRCH='<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>';
const ICO_SORT='<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18M6 12h12M10 18h4"/></svg>';
function epList(host,o){
  let q='',asc=true,R=null;
  host.classList.add('epl');if(o.sheet)host.classList.add('sheet');
  host.innerHTML=`<div class="epl-bar"><label class="epl-s">${ICO_SRCH}<input type="search" placeholder="Buscar episodio (número o título)" aria-label="Buscar episodio" autocomplete="off"></label><button type="button" class="epl-o">${ICO_SORT}<span></span></button></div><div class="epl-r"></div><div class="epl-l"></div>`;
  const inp=host.querySelector('input'),ob=host.querySelector('.epl-o'),rh=host.querySelector('.epl-r'),lh=host.querySelector('.epl-l');
  const pad=n=>String(n).padStart(2,'0');
  function draw(keep){
    const E=o.eps(),ce=o.cur?o.cur():null;
    const L=asc?E.slice():E.slice().reverse(),qq=q.trim().toLowerCase();
    let shown,big=false;
    if(qq){
      const num=/^\d+$/.test(qq);
      shown=L.filter(x=>(num&&String(x.e).startsWith(qq))||(x.title||'').toLowerCase().includes(qq)).slice(0,100);
    }else if(L.length>100){
      big=true;const nR=Math.ceil(L.length/25);
      if(R==null||R>=nR){const i=L.findIndex(x=>x.e===ce);R=i>=0?Math.floor(i/25):0}
      shown=L.slice(R*25,R*25+25);
      rh.innerHTML=Array.from({length:nR},(_,i)=>{const a=L[i*25],b=L[Math.min(L.length,i*25+25)-1];return `<button type="button" data-r="${i}" aria-pressed="${i===R}">${a.e}–${b.e}</button>`}).join('');
    }else shown=L;
    rh.hidden=!big;if(!big)rh.innerHTML='';
    ob.querySelector('span').textContent=asc?'Más antiguo':'Más nuevo';
    lh.innerHTML=shown.length?shown.map(x=>{
      const on=ce===x.e,p=o.prog?o.prog(x.e):0,th=x.thumb||o.fallback||'';
      return `<button type="button" class="epl-i${on?' on':''}" data-e="${x.e}"><span class="th">${th?`<img loading="lazy" alt="" src="${esc(th)}" onerror="this.remove()">`:''}${p>0?`<span class="pb"><i style="width:${Math.min(100,Math.round(p*100))}%"></i></span>`:''}</span><span class="tx"><small>Episodio ${pad(x.e)}${o.tag?' · '+o.tag:''}</small><strong>${esc(x.title||'Episodio '+x.e)}</strong>${on?'<em>Reproduciendo</em>':''}</span></button>`;
    }).join(''):`<p class="epl-n">${qq?'No hay episodios que coincidan.':'Sin episodios.'}</p>`;
    if(keep!==false){const on=lh.querySelector('.on');if(on&&o.sheet&&!qq)setTimeout(()=>on.scrollIntoView({block:'center'}),30)}
  }
  rh.addEventListener('wheel',e=>{if(Math.abs(e.deltaY)>Math.abs(e.deltaX)&&rh.scrollWidth>rh.clientWidth){rh.scrollLeft+=e.deltaY;e.preventDefault()}},{passive:false});
  inp.oninput=()=>{q=inp.value;draw(false)};
  ob.onclick=()=>{asc=!asc;R=null;draw()};
  rh.onclick=e=>{const b=e.target.closest('button');if(!b)return;R=+b.dataset.r;draw(false);lh.scrollTop=0};
  lh.onclick=e=>{const b=e.target.closest('.epl-i');if(b)o.onPick(+b.dataset.e)};
  draw();
  return{redraw:draw};
}
function epRows(z,fb){return epsOf(z).map(x=>({e:x.e,title:x.title||'',thumb:x.thumb||fb||''}))}
function progOf(k,s){const all=store.get('prog',{});return e=>{const r=all[`tv${k}:${s}:${e}`];return r&&r.d?r.t/r.d:0}}
let esSel=1;
function openEpSheet(){
  if(!cur||cur.media_type!=='tv')return;
  esSel=cur.s;const an=!!cur.anime;
  const sh=$('#es2');sh.hidden=false;
  const multi=!an&&cur.seasons.length>1;
  $('#es2sea').hidden=!multi;
  if(multi){$('#es2sel').innerHTML=cur.seasons.map(x=>`<option value="${x.season_number}" ${x.season_number===esSel?'selected':''}>Temporada ${x.season_number} (${x.episode_count})</option>`).join('')}
  const build=()=>{
    const z=cur.seasons.find(x=>x.season_number===esSel);
    $('#es2s').textContent=(multi?'Temporada '+esSel+' · ':'')+'Episodio '+(esSel===cur.s?cur.e:'–')+' de '+epsOf(z).length;
    epList($('#es2l'),{sheet:true,eps:()=>epRows(z,cur._pst||cur._bg||''),cur:()=>esSel===cur.s?cur.e:null,prog:progOf(cur.k,esSel),tag:an?($('#alang').value||'sub').toUpperCase():'',fallback:cur._pst||cur._bg||'',
      onPick:e=>{cur.s=esSel;cur.e=e;liveT=0;syncTv();mount();closeEpSheet()}});
  };
  $('#es2sel').onchange=e=>{esSel=+e.target.value;build()};
  build();
}
function closeEpSheet(){const s=$('#es2');if(s)s.hidden=true}
function drawDetail(it,N,ctx,opts){
  const b=N.base,tv=b.media_type==='tv',t=esc(b.title||b.name),y=(b.release_date||b.first_air_date||'').slice(0,4);
  const label=(ctx==='anime'||b.src==='kt'||b.kind==='anime')?'Anime':tv?'Serie':'Película',seas=N.seas;
  const noPlay=!b.id,bgU=N.bg||N.poster||'';
  let S=seas.length?seas[0].season_number:1;
  const firstE=n=>{const z=epsOf(seas.find(x=>x.season_number===n));return z.length?z[0].e:1};
  const ov=b.overview||'Sin sinopsis disponible.';
  const tabs=[];if(tv)tabs.push(['eps','Episodios']);if(N.cast.length)tabs.push(['cast','Reparto']);if(N.rec.length)tabs.push(['rec','Más como esto']);
  const meta=[b.vote_average?`<span class="g">★ ${(+b.vote_average).toFixed(1)}</span>`:'',y?`<span>${y}</span>`:'',`<span>${label}</span>`,N.rt?`<span>${esc(N.rt)}</span>`:''].filter(Boolean).join('<i></i>');
  $('#page').innerHTML=`<div class="dtx"><div class="dtx-hero"><div class="dtx-img" style="background-image:${bgU?`url(${esc(bgU)})`:'none'}"></div>
   <button class="dtx-bk" id="bk" aria-label="Volver">←</button>
   <div class="dtx-in"><h1>${t}</h1>${N.tagline?`<p class="tag">“${esc(N.tagline)}”</p>`:''}
    <div class="dtx-meta">${meta}</div>
    ${N.genres.length?`<div class="bds">${N.genres.slice(0,5).map(g=>`<span class="chip">${esc(g)}</span>`).join('')}</div>`:''}
    <p class="dtx-ov clamp" id="ov2">${esc(ov)}</p>${ov.length>150?'<button class="dtx-more" id="mo" type="button">Más ⌄</button>':''}
    ${b.anime?`<div class="seg" id="alseg" style="width:max-content"><button data-l="sub">Subtitulado</button><button data-l="dub">Doblado</button></div>`:''}
    <div class="dtx-acts"><button class="act main" id="w" ${noPlay?'disabled':''}>${noPlay?'No disponible':'▶ Ver'}</button><button class="act" id="ml"></button>
     <div class="dtx-menu"><button class="act rnd" id="mm" type="button" aria-label="Más opciones">⋯</button><div class="pop" id="pop" hidden><button id="tr" ${N.trailer?'':'disabled'}>${N.trailer?'Ver tráiler':'Sin tráiler'}</button><button id="sh" ${noPlay?'disabled':''}>Compartir</button></div></div></div>
   </div></div>
   <div class="dtx-body">
    <div class="dtx-ss" id="sss" hidden><span>Temporada</span><select id="ssel"></select></div>
    ${tabs.length?`<div class="dtx-tabs" id="dtabs">${tabs.map((x,i)=>`<button data-p="${x[0]}" aria-pressed="${i===0}">${x[1]}</button>`).join('')}</div>`:''}
    <div class="pn" id="pn-eps" ${tabs.length&&tabs[0][0]==='eps'?'':'hidden'}><div id="tvsec"></div></div>
    <div class="pn" id="pn-cast" ${tabs.length&&tabs[0][0]==='cast'?'':'hidden'}>${N.cast.length?`<div class="scroller">${N.cast.map(c=>`<div class="cm">${c.img?`<img loading="lazy" alt="" src="${esc(c.img)}">`:`<div class="ini">${esc((c.name||'?')[0])}</div>`}<b>${esc(c.name)}</b><small>${esc(c.character||'')}</small></div>`).join('')}</div>`:''}</div>
    <div class="pn" id="pn-rec" ${tabs.length&&tabs[0][0]==='rec'?'':'hidden'} style="margin-bottom:50px"><div class="scroller" id="recs"></div></div>
   </div></div>`;
  const play=(s,e)=>{if(noPlay)return;openTitle({...b,seasons:tv?seas:undefined,emap:N.emap||null,s,e,_bg:N.bg||N.poster,_pst:N.poster},ctx)};
  $('#bk').onclick=()=>backFn();
  $('#w').onclick=()=>play(S,firstE(S));
  const mo=$('#mo');if(mo)mo.onclick=()=>{const c=$('#ov2').classList.toggle('clamp');mo.textContent=c?'Más ⌄':'Menos ⌃'};
  const pop=$('#pop');$('#mm').onclick=e=>{e.stopPropagation();pop.hidden=!pop.hidden};
  document.addEventListener('click',function cl(e){if(!document.body.contains(pop)){document.removeEventListener('click',cl);return}if(!e.target.closest('.dtx-menu'))pop.hidden=true});
  if(b.anime){
    const sg=$('#alseg'),pr=()=>sg.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',x.dataset.l===store.get('alang','sub')));
    sg.onclick=e=>{const x=e.target.closest('button');if(!x)return;store.set('alang',x.dataset.l);pr();if(tv)drawEpl()};pr();
  }
  bindList($('#ml'),b,ctx);
  $('#tr').onclick=()=>{if(N.trailer)window.open(N.trailer,'_blank','noopener')};
  $('#sh').onclick=async()=>{const m0=N.emap&&N.emap[firstE(S)],url=b.anime?(store.get('aprov2','fx')==='ae'&&b.al?'https://aniembed.se/e/'+b.al+'/'+firstE(S):'https://framextv.xyz/embed/anime?id='+(store.get('aprov2','fx')==='fxm'?(b.mal||b.al):(b.al||b.mal))+'&type=tv&season=1&episode='+firstE(S)+'&sub_type='+store.get('alang','sub')):'https://framextv.xyz/embed/'+b.id+(tv?`/${m0?m0[0]:S}/${m0?m0[1]:firstE(S)}`:'');try{if(navigator.share)await navigator.share({title:b.title||b.name,url});else{await navigator.clipboard.writeText(url);$('#sh').textContent='Enlace copiado'}}catch(e){}};
  let drawEpl=()=>{};
  if(tv){
    const box=$('#tvsec');
    box.innerHTML=`<div id="eplh"></div><div id="eplnotes"></div>`;
    $('#eplnotes').innerHTML=`${N.emap?'<p class="note">Numeración continua del anime: cada capítulo se abre en su temporada y episodio reales del reproductor.</p>':''}${N.guess?'<p class="note">No pude obtener las temporadas reales de esta serie: se muestran 10 de 24 episodios.</p>':''}${noPlay?'<p class="note">No encontré este anime en el reproductor (no pude obtener su ID de AniList), así que solo puedo mostrar su ficha.</p>':''}`;
    drawEpl=()=>{
      epList($('#eplh'),{eps:()=>epRows(seas.find(z=>z.season_number===S),N.poster),cur:()=>null,prog:progOf(kid(b),S),tag:b.anime?(store.get('alang','sub')).toUpperCase():'',fallback:N.poster,onPick:e=>play(S,e)});
    };
    if(!b.anime&&seas.length>1){
      $('#sss').hidden=false;$('#ssel').innerHTML=seas.map(z=>`<option value="${z.season_number}">Temporada ${z.season_number} (${z.episode_count})</option>`).join('');
      $('#ssel').onchange=e=>{S=+e.target.value;drawEpl()};
    }
    drawEpl();
  }else if(noPlay){
    $('#pn-eps').hidden=false;$('#tvsec').innerHTML='<p class="note">No encontré esta película de anime en el catálogo del reproductor, así que solo puedo mostrar su ficha.</p>';
  }
  if(N.rec.length)N.rec.forEach(x=>$('#recs').append(card(x,ctx)));
  const dt=$('#dtabs');
  if(dt)dt.onclick=e=>{const bt=e.target.closest('button');if(!bt)return;dt.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',x===bt));['eps','cast','rec'].forEach(p=>{const el=$('#pn-'+p);if(el)el.hidden=p!==bt.dataset.p});$('#sss').hidden=!(bt.dataset.p==='eps'&&!b.anime&&seas.length>1&&tv);arrows($('#page'))};
  arrows($('#page'));
  if(opts&&opts.start&&!noPlay)setTimeout(()=>play(opts.start.s,opts.start.e),0);
  else if(opts&&opts.play&&!noPlay)setTimeout(()=>$('#w').click(),0);
}
const LANG={es:'Español (España)','es-la':'Español (Latinoamérica)',en:'Inglés'};
function drawManga(it,opts){
  const t=esc(it.title),y=(it.release_date||'').slice(0,4);
  const big=it._big||it._img,ST={releasing:'En publicación',not_yet_released:'Próximamente',ongoing:'En publicación',completed:'Finalizado',hiatus:'En pausa',cancelled:'Cancelado',current:'En publicación',finished:'Finalizado',upcoming:'Próximamente',tba:'Por anunciar'};
  $('#page').innerHTML=`<div class="dt"><div class="dt-bg" style="background-image:${it._img?`url(${esc(it._img)})`:'none'}"></div>
   <button class="btn ghost" id="bk">← Volver</button>
   <div class="dt-grid"><div class="dt-poster">${big?`<img alt="" data-t="${t}" src="${esc(big)}">`:`<div class="np">${t}</div>`}</div>
   <div><div class="bds"><span class="chip">MANGA</span>${y?`<span class="chip">${y}</span>`:''}${it.vote_average?`<span class="chip gold">★ ${(+it.vote_average).toFixed(1)}</span>`:''}${(it.lastCh||it.chap)?`<span class="chip">${esc(it.lastCh||it.chap)} capítulos</span>`:''}${it.vols?`<span class="chip">${it.vols} tomos</span>`:''}${it.mstatus?`<span class="chip">${esc(ST[it.mstatus]||it.mstatus)}</span>`:''}${it.demo?`<span class="chip">${esc(it.demo)}</span>`:''}</div>
   <h1>${t}</h1>${it.authors&&it.authors.length?`<p class="tag">${esc(it.authors.join(', '))}</p>`:''}
   <div class="bds" style="margin-top:12px">${(it.genres_s||[]).map(g=>`<span class="chip">${esc(g)}</span>`).join('')}</div>
   <p class="ov">${esc(it.overview||'Sin sinopsis disponible.')}</p>
   <div class="acts"><button class="act main" id="rdb">Leer aquí</button><button class="act" id="rdplus">Leer en MANGA Plus</button><button class="act" id="rdlm">Leer en LectorManga</button><button class="act" id="rdim">Leer en InManga</button><a class="act" style="text-decoration:none" href="https://mangadex.org/search?q=${encodeURIComponent(it.title)}" target="_blank" rel="noopener noreferrer">Buscar en MangaDex</a><a class="act" style="text-decoration:none" href="https://www.viz.com/search?search=${encodeURIComponent(it.title)}" target="_blank" rel="noopener noreferrer">Buscar en VIZ</a><button class="act" id="ml"></button></div>
   <p class="note">Un manga no es vídeo: «Leer aquí» abre el lector con los capítulos de MangaDex; si no están, usa MANGA Plus.</p></div></div>
   <section class="sec" style="margin-bottom:50px"><div class="sec-h"><h3>Capítulos</h3><span id="chn">Cargando…</span></div><div class="ss" id="chl"></div><div id="chr" style="margin-top:12px"></div><div class="chg" id="chg" style="margin-top:14px"></div></section></div>`;
  $('#bk').onclick=()=>backFn();
  bindList($('#ml'),it,'manga');
  const tk=gv;let chList=[];
  $('#rdb').onclick=()=>openReader(it,chList,0,chList[0]&&chList[0].id?'mdx':'plus');
  $('#rdplus').onclick=()=>openReader(it,chList,0,'plus');
  $('#rdlm').onclick=()=>openReader(it,chList,0,'lm');
  $('#rdim').onclick=()=>openReader(it,chList,0,'im');
  arrows($('#page'));
  (async()=>{
    let by={};
    try{
      const id=it.src==='md'?it.id:await mdFind([...new Set([it.title,...(it.alts||[])])].filter(Boolean),it.al,it.mal);
      if(id)by=await mdChapters(id);
    }catch(e){}
    if(tk!==gv||!$('#chg'))return;
    let langs=['es','es-la','en'].filter(L=>by[L]&&by[L].length),virtual=false;
    if(!langs.length&&it.chap){by={'':Array.from({length:it.chap},(_,i)=>({id:'',ch:String(i+1),title:''}))};langs=[''];virtual=true}
    if(!langs.length){
      $('#chn').textContent='';
      $('#chg').innerHTML=`<p class="note">No pude cargar la lista de capítulos${mdErr?' ('+esc(mdErr)+')':''}. Usa «Leer en MANGA Plus» o «Buscar en MangaDex».</p>`;
      if(opts&&opts.play)$('#rdb').click();
      return;
    }
    let cl=langs[0],R=0;
    const draw=()=>{
      const all=by[cl];chList=all;
      const big=all.length>100,nR=Math.ceil(all.length/25);if(R>=nR)R=0;
      const sl=big?all.slice(R*25,R*25+25):all,off=big?R*25:0;
      $('#chl').innerHTML=langs.length>1?langs.map(L=>`<button data-l="${L}" aria-pressed="${L===cl}">${LANG[L]||'Capítulos'}<i>(${by[L].length})</i></button>`).join(''):'';
      $('#chn').textContent=all.length+' capítulos'+(virtual?' (según AniList)':'');
      const lb=i=>(all[i]&&all[i].ch)||(i+1);
      $('#chr').innerHTML=big?`<div class="scroller rg">${Array.from({length:nR},(_,i)=>`<button data-r="${i}" aria-pressed="${i===R}">${lb(i*25)}–${lb(Math.min(all.length,(i+1)*25)-1)}</button>`).join('')}</div>`:'';
      $('#chg').innerHTML=sl.map((c,j)=>`<button data-i="${off+j}" title="${esc((c.vol?'Tomo '+c.vol+' · ':'')+(c.title||''))}">Cap. ${esc(c.ch||'—')}</button>`).join('');
      const rg=$('#chr .rg');
      if(rg){arrows($('#chr'));const a=rg.querySelector('[aria-pressed=true]');if(a)rg.scrollLeft=Math.max(0,a.offsetLeft-rg.clientWidth/2+a.offsetWidth/2)}
    };
    $('#chl').onclick=e=>{const b=e.target.closest('button');if(!b)return;cl=b.dataset.l;R=0;draw()};
    $('#chr').onclick=e=>{const b=e.target.closest('button[data-r]');if(!b)return;R=+b.dataset.r;draw()};
    $('#chg').onclick=e=>{const b=e.target.closest('button');if(!b)return;const i=+b.dataset.i;openReader(it,by[cl],i,by[cl][i]&&by[cl][i].id?'mdx':'plus')};
    draw();
    if(opts&&opts.play)$('#rdb').click();
  })();
}
addEventListener('error',e=>{const i=e.target;if(i&&i.tagName==='IMG'&&i.dataset&&i.dataset.t!==undefined){const d=document.createElement('div');d.className='np';d.textContent=i.dataset.t;i.replaceWith(d)}},true);

/* ---------- Página de inicio (un poco de todo) ---------- */
const ctxOfIt=it=>it.src==='al'?it.kind:(it.media_type==='tv'?'tv':'movie');
const HOMER=[
 ['Películas en tendencia','cm','movie','top'],
 ['Series populares','cm','series','top'],
 ['Anime en tendencia','al','anime',{sort:['TRENDING_DESC']}],
 ['Películas mejor valoradas','cm','movie','imdbRating'],
 ['Manga popular','al','manga',{sort:POP}],
 ['Anime en emisión','al','anime',{sort:POP,status:'RELEASING'}],
 ['Series mejor valoradas','cm','series','imdbRating'],
 ['Anime mejor valorado','al','anime',{sort:['SCORE_DESC'],pop:20000}],
 ['Acción y aventura','cm','movie','top','Action'],
 ['Series de comedia','cm','series','top','Comedy'],
 ['Manhwa y manhua','al','manga',{sort:POP,country:'KR'}],
 ['Terror para esta noche','cm','movie','top','Horror']
];
function homeView(pg){
  pg.innerHTML=`<section id="hero" class="hero sk" aria-label="Destacado"></section><div class="ph"><div><h1>Inicio</h1><p>${TXT.home[1]}</p></div></div><div id="hrow"></div><div id="content"></div>`;
  loadHero(['movie','tv','anime'][Math.floor(Math.random()*3)]);
  const row=$('#hrow'),mk=(title,items)=>{
    const s=document.createElement('section');s.className='rail';
    s.innerHTML=`<h3>${esc(title)}</h3><div class="scroller"></div>`;
    const sc=s.querySelector('.scroller');items.forEach(it=>sc.append(card(it,ctxOfIt(it))));row.append(s);
  };
  const h=store.get('hist',[]).filter(x=>x&&x._img).slice(0,20);
  if(h.length)mk('Seguir viendo',h);
  arrows(row);
  railsG($('#content'),HOMER,async d=>{
    if(d[1]==='cm'){const m=await cmCat(d[2],d[3],{genre:d[4]||''});return m.slice(0,40).map(x=>cm2it(x,d[2]))}
    return alPage(d[2],d[3],1,30);
  },'No pude cargar el catálogo. Revisa tu conexión.','home');
}
/* ---------- Página de perfil ---------- */
const avatarSrc=()=>store.get('avatar','')||acMeta().avatar_url||acMeta().picture||'';
function imgToAvatar(file){return new Promise((res,rej)=>{const im=new Image(),u=URL.createObjectURL(file);
  im.onload=()=>{const S=192,c=document.createElement('canvas');c.width=c.height=S;const m=Math.min(im.width,im.height);
    c.getContext('2d').drawImage(im,(im.width-m)/2,(im.height-m)/2,m,m,0,0,S,S);URL.revokeObjectURL(u);res(c.toDataURL('image/jpeg',.85))};
  im.onerror=()=>{URL.revokeObjectURL(u);rej(new Error('img'))};im.src=u})}
function profileView(pg){
  if(!SBU){
    if(USER){pg.innerHTML='<p class="empty">Cargando tu perfil…</p>';return}
    tab='home';return render();
  }
  const n=acName(),av=avatarSrc(),L=getLists(),items=L.reduce((s,l)=>s+l.items.length,0),hist=store.get('hist',[]).length,prog=Object.keys(store.get('prog',{})).length;
  const prov=(SBU.app_metadata&&SBU.app_metadata.provider)||'email',gOnly=prov==='google';
  pg.innerHTML=`<div class="pf">
   <div class="pf-top"><div class="pf-av" id="pfav">${av?`<img alt="" referrerpolicy="no-referrer" src="${esc(av)}">`:esc(n[0].toUpperCase())}</div>
    <div class="pf-id"><h1>${esc(n)}</h1><p>${esc(SBU.email||'')}</p><span class="chip">${gOnly?'Cuenta de Google':'Correo y contraseña'}</span></div><button class="btn ghost" id="pfout" type="button">Cerrar sesión</button></div>
   <div class="pf-stats"><div><b>${L.length}</b><span>${L.length===1?'Lista':'Listas'}</span></div><div><b>${items}</b><span>Guardados</span></div><div><b>${hist}</b><span>En historial</span></div><div><b>${prog}</b><span>Episodios con progreso</span></div></div>
   <div class="pf-grid">
    <section class="pf-c"><h2>Foto de perfil</h2><p class="nt">Se recorta en cuadrado. Se guarda en tu cuenta.</p>
     <div class="pf-row"><label class="btn" for="pff">Subir foto</label><input type="file" id="pff" accept="image/*" hidden><button class="btn ghost" id="pfrm" ${store.get('avatar','')?'':'disabled'}>Quitar foto</button></div><div class="pf-m" id="pfm1"></div></section>
    <section class="pf-c"><h2>Nombre</h2><p class="nt">Es el que se muestra en la app.</p>
     <form id="pfnf" class="pf-f"><input id="pfn" maxlength="30" value="${esc(n)}" placeholder="Tu nombre" required><button class="btn">Guardar nombre</button></form><div class="pf-m" id="pfm2"></div></section>
    <section class="pf-c"><h2>${gOnly?'Crear contraseña':'Cambiar contraseña'}</h2><p class="nt">${gOnly?'Entras con Google. Si quieres, añade una contraseña para entrar también con tu correo.':'Mínimo 6 caracteres.'}</p>
     <form id="pfpf" class="pf-f"><input id="pfp1" type="password" placeholder="Nueva contraseña" autocomplete="new-password" required><input id="pfp2" type="password" placeholder="Repite la contraseña" autocomplete="new-password" required><button class="btn">Guardar contraseña</button></form><div class="pf-m" id="pfm3"></div></section>
    <section class="pf-c"><h2>Sincronización</h2><p class="nt" id="pfsy">${esc(syncMsg||'Tus listas, historial y progreso se guardan en tu cuenta y se sincronizan entre dispositivos.')}</p>
     <div class="pf-row"><button class="btn" id="pfsync">Sincronizar ahora</button><button class="btn ghost" id="pfcl">Borrar datos de la nube</button></div><div id="pfask"></div></section>
    <section class="pf-c"><h2>Accesos</h2><div class="pf-row"><button class="btn ghost" id="pfl">Mis listas</button><button class="btn ghost" id="pfh">Seguir viendo</button></div>
     </section>
   </div></div>`;
  const msg=(id,t,ok)=>{const e=$('#'+id);e.textContent=t;e.className='pf-m '+(ok?'ok':'bad')};
  $('#pff').onchange=async e=>{const f=e.target.files[0];if(!f)return;
    try{store.set('avatar',await imgToAvatar(f));paintAcb();profileView(pg)}catch(x){msg('pfm1','No se pudo leer esa imagen.',false)}};
  $('#pfrm').onclick=()=>{store.set('avatar','');paintAcb();profileView(pg)};
  $('#pfnf').onsubmit=async e=>{e.preventDefault();const v=$('#pfn').value.trim();if(!v)return;
    const{data,error}=await sb.auth.updateUser({data:{full_name:v}});
    if(error){msg('pfm2',acErr(error.message),false);return}
    if(data&&data.user)SBU=data.user;paintAcb();profileView(pg);msg('pfm2','Nombre guardado.',true)};
  $('#pfpf').onsubmit=async e=>{e.preventDefault();const a=$('#pfp1').value,b=$('#pfp2').value;
    if(a.length<6){msg('pfm3','Mínimo 6 caracteres.',false);return}
    if(a!==b){msg('pfm3','Las contraseñas no coinciden.',false);return}
    const{error}=await sb.auth.updateUser({password:a});
    if(error){msg('pfm3',acErr(error.message),false);return}
    $('#pfp1').value=$('#pfp2').value='';msg('pfm3','Contraseña guardada.',true)};
  $('#pfsync').onclick=async()=>{$('#pfsy').textContent='Sincronizando…';const ch=await pullNow();await pushNow();if(ch){profileView(pg)}$('#pfsy').textContent=syncMsg};
  $('#pfcl').onclick=()=>inlAsk($('#pfask'),'¿Borrar tus listas, historial y progreso guardados en la nube? (en este dispositivo se mantienen)','Borrar datos',async()=>{
    const{error}=await sb.from('user_data').delete().eq('user_id',USER);syncMsg=error?'No se pudo borrar':'Datos de la nube borrados';$('#pfsy').textContent=syncMsg});
  $('#pfl').onclick=()=>{tab='list';render()};$('#pfh').onclick=()=>{tab='history';render()};
  $('#pfout').onclick=doSignOut;
}
/* ---------- Cuentas con Supabase (correo + Google) y sincronización ---------- */
const SB_URL=CFG.supabaseUrl,SB_KEY=CFG.supabaseKey;
let sb=null,SBU=null,syncT=null,syncMsg='';
try{if(SB_URL&&SB_KEY)sb=createClient(SB_URL,SB_KEY,{auth:{flowType:'pkce',persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}})}catch(e){sb=null}
const tsKey=()=>'u:'+USER+':_ts';
const collect=()=>{const d={};UK.forEach(k=>{const v=store.get(k,undefined);if(v!==undefined)d[k]=v});return d};
function schedulePush(){if(!sb||!USER)return;clearTimeout(syncT);syncT=setTimeout(pushNow,1500)}
async function pushNow(){
  if(!sb||!USER)return false;clearTimeout(syncT);const ts=Date.now();
  try{
    const{error}=await sb.from('user_data').upsert({user_id:USER,data:collect(),updated_at:new Date(ts).toISOString()});
    if(error){syncMsg='No se pudo sincronizar';return false}
    try{localStorage.setItem(tsKey(),String(ts))}catch(e){}
    syncMsg='Sincronizado';return true;
  }catch(e){syncMsg='Sin conexión';return false}
}
async function pullNow(){
  if(!sb||!USER)return false;
  try{
    const{data,error}=await sb.from('user_data').select('data,updated_at').eq('user_id',USER).maybeSingle();
    if(error){syncMsg='No se pudo sincronizar';return false}
    const lts=+(localStorage.getItem(tsKey())||0);
    if(data){
      const cts=Date.parse(data.updated_at)||0;
      if(cts>lts){
        UK.forEach(k=>{if(data.data&&k in data.data){try{localStorage.setItem(kk(k),JSON.stringify(data.data[k]))}catch(e){}}});
        try{localStorage.setItem(tsKey(),String(cts))}catch(e){}
        syncMsg='Sincronizado';return true;
      }
      if(lts>cts)await pushNow();else syncMsg='Sincronizado';
      return false;
    }
    UK.forEach(k=>{if(localStorage.getItem(kk(k))==null){const g=localStorage.getItem(k);if(g!=null){try{localStorage.setItem(kk(k),g)}catch(e){}}}});
    await pushNow();return true;
  }catch(e){syncMsg='Sin conexión';return false}
}
const acMeta=()=>(SBU&&SBU.user_metadata)||{};
const acName=()=>SBU?(acMeta().full_name||acMeta().name||(SBU.email||'').split('@')[0]||'Cuenta'):'';
function paintAcb(){
  const b=$('#acb'),n=acName(),av=avatarSrc();
  b.classList.toggle('on',!!n);
  b.innerHTML=n?(av?`<img alt="" referrerpolicy="no-referrer" src="${esc(av)}" style="width:100%;height:100%;border-radius:50%;object-fit:cover" onerror="this.replaceWith(document.createTextNode('${esc(n[0].toUpperCase())}'))">`:esc(n[0].toUpperCase())):'<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/></svg>';
  b.title=n?'Cuenta: '+n:'Iniciar sesión o crear cuenta';
}
const GOOGLE_SVG='<svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.3l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z"/><path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.4c-.5 2.9-2.2 5.3-4.6 7l7.4 5.7c4.3-4 6.9-9.9 6.9-17.2z"/><path fill="#FBBC05" d="M10.5 28.6A14.5 14.5 0 0 1 9.5 24c0-1.6.3-3.1.8-4.6l-7.9-6.1A24 24 0 0 0 0 24c0 3.9.9 7.5 2.6 10.7l7.9-6.1z"/><path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.4-5.7c-2 1.4-4.9 2.3-8.5 2.3-6.3 0-11.6-4.1-13.5-9.9l-7.9 6.1C6.5 42.6 14.6 48 24 48z"/></svg>';
let acMode='in';
const acErr=m=>{const t=String(m||'');
  if(/Invalid login/i.test(t))return 'Correo o contraseña incorrectos.';
  if(/already registered|already been registered/i.test(t))return 'Ese correo ya tiene cuenta. Prueba a entrar.';
  if(/not confirmed/i.test(t))return 'Confirma tu correo antes de entrar (revisa tu bandeja).';
  if(/at least 6/i.test(t))return 'La contraseña debe tener al menos 6 caracteres.';
  if(/rate limit|too many/i.test(t))return 'Demasiados intentos. Espera un momento.';
  if(/network|fetch/i.test(t))return 'Sin conexión con el servicio de cuentas.';
  return t||'Algo salió mal.'};
function drawAcc(){
  const w=$('#acw');
  if(!sb){w.innerHTML='<h2>Cuenta</h2><p class="nt">No se pudo cargar el servicio de cuentas. Comprueba tu conexión y recarga la página. Mientras tanto la app funciona sin cuenta.</p><button class="btn ghost" id="accl">Cerrar</button>';$('#accl').onclick=()=>$('#acd').close();return}
  if(acMode==='new'){
    w.innerHTML=`<h2>Nueva contraseña</h2><form id="acf" style="display:grid;gap:12px"><input id="acp" type="password" placeholder="Nueva contraseña" autocomplete="new-password" required><div class="er" id="acer"></div><button class="btn">Guardar</button></form>`;
    $('#acf').onsubmit=async e=>{e.preventDefault();const p=$('#acp').value;if(p.length<6){$('#acer').textContent='Mínimo 6 caracteres.';return}
      const{error}=await sb.auth.updateUser({password:p});if(error){$('#acer').textContent=acErr(error.message);return}$('#acd').close();acMode='in'};
    return;
  }
  if(SBU){
    const n=acName(),L=getLists(),cnt=L.reduce((s,l)=>s+l.items.length,0),av=acMeta().avatar_url||acMeta().picture;
    w.innerHTML=`<div class="av">${av?`<img alt="" referrerpolicy="no-referrer" src="${esc(av)}" style="width:100%;height:100%;border-radius:50%;object-fit:cover">`:esc(n[0].toUpperCase())}</div><div class="who"><h2>${esc(n)}</h2><p class="nt">${esc(SBU.email||'')}</p><p class="nt">${L.length} ${L.length===1?'lista':'listas'} · ${cnt} ${cnt===1?'título guardado':'títulos guardados'}</p><p class="nt" id="acsy">${esc(syncMsg||'')}</p></div>
     <button class="btn" id="acsync">Sincronizar ahora</button><button class="btn ghost" id="aclo">Cerrar sesión</button><button class="btn ghost" id="acdel">Borrar mis datos de la nube</button><div id="acask"></div><button class="btn ghost" id="accl">Cerrar</button>
     <p class="nt">Tus listas, historial y progreso se guardan en tu cuenta y se sincronizan entre dispositivos.</p>`;
    $('#accl').onclick=()=>$('#acd').close();
    $('#acsync').onclick=async()=>{$('#acsy').textContent='Sincronizando…';const ch=await pullNow();await pushNow();$('#acsy').textContent=syncMsg;if(ch)afterAcc()};
    $('#aclo').onclick=doSignOut;
    $('#acdel').onclick=()=>inlAsk($('#acask'),'¿Borrar tus listas, historial y progreso guardados en la nube? (en este dispositivo se mantienen)','Borrar datos',async()=>{
      const{error}=await sb.from('user_data').delete().eq('user_id',USER);syncMsg=error?'No se pudo borrar':'Datos de la nube borrados';$('#acsy').textContent=syncMsg});
    return;
  }
  const cr=acMode==='up';
  w.innerHTML=`<h2>${cr?'Crear cuenta':'Iniciar sesión'}</h2>
   <button class="btn" id="acg" type="button" style="background:#fff;color:#1f1f1f;display:flex;gap:10px;align-items:center;justify-content:center">${GOOGLE_SVG}Continuar con Google</button>
   <div class="nt" style="text-align:center">o con tu correo</div>
   <div class="seg"><button type="button" data-m="in" aria-pressed="${!cr}">Entrar</button><button type="button" data-m="up" aria-pressed="${cr}">Crear cuenta</button></div>
   <form id="acf" style="display:grid;gap:12px"><input id="acu" type="email" placeholder="Correo electrónico" autocomplete="email" required><input id="acp" type="password" placeholder="Contraseña" autocomplete="${cr?'new-password':'current-password'}" required>${cr?'<input id="acp2" type="password" placeholder="Repite la contraseña" autocomplete="new-password" required>':''}
   <div class="er" id="acer"></div><button class="btn" id="acs">${cr?'Crear cuenta':'Entrar'}</button></form>
   ${cr?'':'<button class="btn ghost sm" id="acfg" type="button">¿Olvidaste la contraseña?</button>'}
   <p class="nt">Con una cuenta tus listas, historial y progreso se sincronizan entre dispositivos. Sin cuenta puedes usar la app igualmente.</p>
   <button class="btn ghost" id="accl">Cerrar</button>`;
  w.querySelector('.seg').onclick=e=>{const b=e.target.closest('button');if(!b)return;acMode=b.dataset.m;drawAcc()};
  $('#accl').onclick=()=>$('#acd').close();
  $('#acg').onclick=async()=>{const{error}=await sb.auth.signInWithOAuth({provider:'google',options:{redirectTo:location.origin+location.pathname}});if(error)$('#acer').textContent=acErr(error.message)};
  const fg=$('#acfg');if(fg)fg.onclick=async()=>{const em=$('#acu').value.trim(),er=$('#acer');if(!em){er.textContent='Escribe tu correo arriba y pulsa de nuevo.';return}
    const{error}=await sb.auth.resetPasswordForEmail(em,{redirectTo:location.origin+location.pathname});er.style.color=error?'':'#6fdc9a';er.textContent=error?acErr(error.message):'Te enviamos un correo para cambiar la contraseña.'};
  $('#acf').onsubmit=async e=>{
    e.preventDefault();const em=$('#acu').value.trim(),p=$('#acp').value,er=$('#acer'),bt=$('#acs');er.style.color='';er.textContent='';
    if(p.length<6){er.textContent='La contraseña debe tener al menos 6 caracteres.';return}
    bt.disabled=true;
    try{
      if(cr){
        if(p!==$('#acp2').value){er.textContent='Las contraseñas no coinciden.';return}
        const{data,error}=await sb.auth.signUp({email:em,password:p,options:{emailRedirectTo:location.origin+location.pathname}});
        if(error){er.textContent=acErr(error.message);return}
        if(!data.session){if(data.user&&data.user.identities&&!data.user.identities.length){er.textContent='Ese correo ya tiene cuenta. Prueba a entrar.';return}er.style.color='#6fdc9a';er.textContent='Te enviamos un correo para confirmar la cuenta. Después podrás entrar.';return}
      }else{
        const{error}=await sb.auth.signInWithPassword({email:em,password:p});
        if(error){er.textContent=acErr(error.message);return}
      }
      $('#acd').close();
    }catch(x){er.textContent=acErr(x&&x.message)}finally{bt.disabled=false}
  };
}
function afterAcc(){paintAcb();curList='';stashContent();render()}
async function doSignOut(){
  try{await Promise.race([pushNow(),new Promise(r=>setTimeout(r,1500))])}catch(e){}
  try{await sb.auth.signOut({scope:'local'})}catch(e){}
  try{$('#acd').close()}catch(e){}
  await applySession(null,'SIGNED_OUT');
}
async function applySession(sess,evt){
  const u=(sess&&sess.user)||null,id=u?u.id:'',was=USER;
  SBU=u;
  if(id!==USER){USER=id;try{id?localStorage.setItem('sala_user',id):localStorage.removeItem('sala_user')}catch(e){}}
  paintAcb();
  if(u){const ch=await pullNow();if(ch||id!==was||tab==='profile')afterAcc()}
  else if(was)afterAcc();
}
if(sb)sb.auth.onAuthStateChange((evt,sess)=>{
  setTimeout(()=>{
    if(evt==='PASSWORD_RECOVERY'){acMode='new';SBU=sess&&sess.user;drawAcc();try{$('#acd').showModal()}catch(e){}return}
    if(evt==='INITIAL_SESSION'||evt==='SIGNED_IN'||evt==='SIGNED_OUT'||evt==='USER_UPDATED')applySession(sess,evt);
  },0);
});
$('#acb').onclick=()=>{if(SBU){tab='profile';stashContent();render();scrollTo(0,0);return}acMode=SBU?'in':acMode==='new'?'in':acMode;drawAcc();$('#acd').showModal()};
$('#acd').addEventListener('click',e=>{if(e.target===$('#acd'))$('#acd').close()});
paintAcb();
/* arrastrar con el ratón en filas horizontales */
(function(){
  const SEL='.scroller,.epl-r,.dtx-tabs,.rg';let el=null,x0=0,s0=0,moved=false;
  document.addEventListener('pointerdown',e=>{
    if(e.pointerType!=='mouse'||e.button!==0)return;
    const t=e.target.closest(SEL);if(!t||t.scrollWidth<=t.clientWidth||e.target.closest('input,select,textarea'))return;
    el=t;x0=e.clientX;s0=t.scrollLeft;moved=false;
  });
  document.addEventListener('pointermove',e=>{
    if(!el)return;const dx=e.clientX-x0;
    if(!moved&&Math.abs(dx)>5){moved=true;el.classList.add('dragging')}
    if(moved){el.scrollLeft=s0-dx;e.preventDefault()}
  });
  const end=()=>{if(el){const t=el;el=null;if(moved)setTimeout(()=>t.classList.remove('dragging'),0)}};
  document.addEventListener('pointerup',end);document.addEventListener('pointercancel',end);
  document.addEventListener('click',e=>{if(moved){e.preventDefault();e.stopPropagation();moved=false}},true);
  document.addEventListener('dragstart',e=>{if(e.target.closest(SEL))e.preventDefault()});
})();
/* animaciones de entrada con Animate.css (se limpian al terminar para no pisar los efectos hover) */
(function(){
  if(matchMedia('(prefers-reduced-motion:reduce)').matches)return;
  const MAP=[['.hero','fadeIn',0,'.8s'],['.hero-in > *','fadeInUp',80,'.6s'],['.ph','fadeInUp',60,'.55s'],['.rail','fadeInUp',0,'.65s'],
    ['.dtx-in > *','fadeInUp',0,'.6s'],['.dtx-tabs','fadeIn',250,'.6s'],['.epl-i','fadeInUp',0,'.45s'],['.epl-bar','fadeInDown',0,'.5s'],
    ['.pf-top','fadeInUp',0,'.6s'],['.pf-stats div','zoomIn',0,'.5s'],['.pf-c','fadeInUp',120,'.55s'],['.emp','zoomIn',0,'.5s'],['.cm','fadeInUp',0,'.5s'],['.acw > *','fadeInUp',0,'.4s']];
  const go=(el,name,delay,dur)=>{
    if(el.dataset.an)return;el.dataset.an='1';
    el.classList.add('animate__animated','animate__'+name);
    el.style.setProperty('--animate-duration',dur);el.style.animationDelay=delay+'ms';
    el.addEventListener('animationend',function f(e){if(e.target!==el)return;el.removeEventListener('animationend',f);
      el.classList.remove('animate__animated','animate__'+name);el.style.animationDelay='';el.style.removeProperty('--animate-duration');delete el.dataset.an},{once:false});
  };
  new MutationObserver(ms=>{
    const cnt={};
    for(const m of ms)for(const n of m.addedNodes){
      if(n.nodeType!==1)continue;
      MAP.forEach(([sel,name,base,dur],k)=>{
        const L=[];if(n.matches&&n.matches(sel))L.push(n);n.querySelectorAll&&n.querySelectorAll(sel).forEach(x=>L.push(x));
        L.forEach(el=>{cnt[k]=(cnt[k]||0)+1;go(el,name,base+Math.min(cnt[k]-1,10)*55,dur)});
      });
    }
  }).observe(document.body,{childList:true,subtree:true});
  document.querySelectorAll('dialog').forEach(d=>new MutationObserver(()=>{if(d.open)go(d,'zoomIn',0,'.35s')}).observe(d,{attributes:true,attributeFilter:['open']}));
})();
async function routeHash(h,boot){
  const nv=store.get('nav',null),ok=['home','movie','tv','anime','manga','list','history','search','profile'];
  const P=h.split('/');
  appH=h;
  if(P.length>=4&&['movie','tv','anime','manga'].includes(P[0])&&(P[1]==='al'||P[1]==='cm')){
    const m=/^s(\d+)e(\d+)$/.exec(P[4]||''),st=m?{s:+m[1],e:+m[2]}:(P[4]==='p'?{s:1,e:1}:null);
    if(!boot&&curDH===P.slice(0,4).join('/')){
      if(!st){if(cur&&!pv.hidden){popping=true;closePv();popping=false}return}
    }
    tab=P[0];
    document.querySelectorAll('.tb').forEach(b=>b.setAttribute('aria-pressed',b.dataset.t===tab));
    if(!boot&&cur&&!pv.hidden){popping=true;closePv();popping=false}
    $('#page').innerHTML='<p class="empty"><span class="spin"></span>Cargando…</p>';
    let it=null;
    try{
      if(P[1]==='al'){
        const d=await alGql('query($i:Int,$t:MediaType){Media(id:$i,type:$t){'+AL_F+'}}',{i:+P[3],t:P[2]==='manga'?'MANGA':'ANIME'});
        if(d&&d.Media)it=al2it(d.Media,P[2]);
      }else it={src:'cm',imdb:P[3],media_type:P[2],title:'',name:''};
    }catch(e){}
    if(it&&appH===h){popping=true;showDetail(it,P[0],st?{start:st}:undefined);popping=false;return}
    if(appH!==h)return;
  }
  if(!boot&&cur&&!pv.hidden){popping=true;closePv();popping=false}
  const t=ok.includes(h)?h:(boot&&nv&&ok.includes(nv.tab)?nv.tab:'home');
  tab=t;if(t==='search'&&nv&&nv.q)q=nv.q;
  if(boot){try{history.replaceState({i:0},'','#'+t)}catch(e){}}
  appH=t;popping=true;render();popping=false;
}
(function boot(){
  try{history.replaceState({i:0,...(history.state||{})},'')}catch(e){}
  routeHash((location.hash||'').slice(1),true);
  addEventListener('popstate',e=>{
    const h=(location.hash||'').slice(1);if(h===appH)return;
    const y=e.state&&e.state.y;
    routeHash(h,false).then(()=>{if(y)[400,1000,1800].forEach(t=>setTimeout(()=>scrollTo(0,y),t))});
  });
})();
