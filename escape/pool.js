// FRS Escape Rooms: gemeinsamer Rätsel-Pool für alle Räume, eingeteilt in vier Rätselfamilien (siehe FAMILIES unten).
// Aufruf: const POOL = FRSPool({ esc, rolePieces, existing, fb, img, SHAPES, shuffled, rngFor, beep, nums, penTry });
(function (root) {
"use strict";
root.FRSPool=function(c){
const esc=c.esc,rolePieces=c.rolePieces,existing=c.existing,fb=c.fb,img=c.img,SHAPES=c.SHAPES,shuffled=c.shuffled,rngFor=c.rngFor,beep=c.beep,nums=c.nums,penTry=c.penTry;
/* ---------- Rätsel-Pool: abwechslungsreiche Kammern ---------- */
const INFO=['research','decode','cartographer','radio','guard'];
const WORDS={
  3:['ARM', 'BAD', 'BUS', 'EIS', 'FEE', 'HUT', 'KUH', 'MUT', 'OHR', 'SEE', 'TAG', 'TOR', 'UHR', 'ZUG', 'TAL', 'ELF', 'RAD', 'HAI', 'REH', 'ZOO'],
  4:['BAUM', 'BERG', 'BOOT', 'BURG', 'DACH', 'DORF', 'EULE', 'FELS', 'GOLD', 'HAUS', 'HERZ', 'KORB', 'MOND', 'PFAD', 'RING', 'ROSE', 'SAND', 'SEIL', 'STEG', 'TURM', 'WALD', 'WIND', 'WOLF', 'ZELT', 'MEER', 'NEST', 'LUFT', 'BALL'],
  5:['ANKER', 'APFEL', 'BIRKE', 'BLATT', 'BLUME', 'FUCHS', 'HAFEN', 'INSEL', 'KARTE', 'KERZE', 'KRONE', 'LAMPE', 'MUSIK', 'NEBEL', 'PERLE', 'PIRAT', 'REGEN', 'SCHAF', 'SONNE', 'STERN', 'TIGER', 'WELLE', 'ZEBRA', 'FEDER', 'KOMET', 'STEIN', 'FUNKE', 'HONIG', 'LICHT', 'WOLKE'],
  6:['DRACHE', 'GARTEN', 'SCHATZ', 'QUELLE', 'FLAMME', 'KRATER', 'FALTER', 'HIMMEL', 'PALAST', 'ORAKEL', 'ZAUBER', 'TEMPEL', 'WINTER', 'SOMMER', 'PLANET', 'ZWERGE', 'SEGLER', 'FOHLEN', 'KAEFER', 'GLOCKE'],
  7:['KOMPASS', 'LATERNE', 'MUSCHEL', 'SPIEGEL', 'FENSTER', 'SCHLOSS', 'LEUCHTE', 'BRUECKE', 'FESTUNG', 'DIAMANT', 'EINHORN', 'PINGUIN', 'FLUEGEL', 'ELEFANT', 'FLASCHE']
};
const MORSE={A:'.-',B:'-...',C:'-.-.',D:'-..',E:'.',F:'..-.',G:'--.',H:'....',I:'..',J:'.---',K:'-.-',L:'.-..',M:'--',N:'-.',O:'---',P:'.--.',Q:'--.-',R:'.-.',S:'...',T:'-',U:'..-',V:'...-',W:'.--',X:'-..-',Y:'-.--',Z:'--..'};
const ALPHA='ABCDEFGHIJKLMNOPQRSTUVWXYZ';
function morseHtml(c){return '<span class="mo">'+MORSE[c].split('').map(x=>x==='.'?'<i class="dot"></i>':'<i class="dash"></i>').join('')+'</span>'}
function alphaStrip(){return '<div class="alpha">'+ALPHA.split('').map((c,i)=>'<span><b>'+c+'</b>'+(i+1)+'</span>').join('')+'</div>'}
function pick(arr,rnd){return arr[Math.floor(rnd()*arr.length)]}
function xdials(u){
  return '<div class="dials">'+u.vals.map((v,i)=>'<div>'+(u.labels&&u.labels[i]?'<div class="small" style="text-align:center;margin-bottom:4px">'+u.labels[i]+'</div>':'')
    +'<div class="dial"><button data-act="xup" data-i="'+i+'" aria-label="erhöhen">▲</button><div class="dg" id="xd'+i+'">'+esc(u.show(i,v))+'</div><button data-act="xdn" data-i="'+i+'" aria-label="verringern">▼</button></div></div>').join('')+'</div>';
}
function wordInit(len){return {vals:new Array(len).fill(0),mods:new Array(len).fill(26),show:(i,v)=>ALPHA[v]}}
function wordSub(word){
  return function(d,u,a){
    if(a.op!=='sub'||!nums(a.vals,word.length))return null;
    let ok=0;for(let i=0;i<word.length;i++)if(a.vals[i]===ALPHA.indexOf(word[i]))ok++;
    return ok===word.length?{ok:true}:{wrong:ok+' von '+word.length+' Buchstaben stimmen.'};
  };
}
function mechWord(u,lead,btn){return '<p class="lead">'+lead+'</p>'+xdials(u)+'<div><button class="btn primary" data-act="xsub">'+(btn||'Schloss prüfen')+'</button></div>'+fb()+'<p class="small">Ein Fehlversuch kostet '+penTry()+' Sekunden.</p>'}
function noPiece(){return '<p class="lead">In dieser Kammer hast du keinen eigenen Hinweis. Hilf mit, die Hinweise der anderen zusammenzusetzen.</p>'}

/* Schaltwand: Kabel als tauschbare Farbkarten in einer Reihe (Anschluss 1..N) */
function wrowHtml(u){
  window.__wu=u;
  const css='<style>#wrow{display:flex;gap:6px;justify-content:center;flex-wrap:nowrap;margin:8px 0}#wrow .ws{flex:1 1 0;max-width:84px;min-width:0;text-align:center}#wrow .wn{font-size:12px;opacity:.75;margin-bottom:4px}#wrow button{width:100%;min-height:76px;border-radius:12px;border:3px solid rgba(255,255,255,.25);font:800 14px/1.1 inherit;color:#111;padding:4px 2px;cursor:pointer;touch-action:none;user-select:none;-webkit-user-select:none}#wrow button.drag{position:relative;z-index:5;opacity:.92;box-shadow:0 8px 22px rgba(0,0,0,.5);transition:none}#wrow button.sel{border-color:#fff;box-shadow:0 0 0 3px rgba(255,255,255,.55);transform:translateY(-6px)}</style>';
  return css+'<div id="wrow" role="group" aria-label="Schaltwand">'+u.order.map((c,p)=>'<div class="ws"><div class="wn">Anschluss '+(p+1)+'</div>'+(function(){const col=u.cols[c],ic=window.WIRE_ICONS&&window.WIRE_ICONS[col.n];
    if(ic)return '<button type="button" data-act="wpick" data-p="'+p+'" class="'+(u.sel===p?'sel':'')+'" style="background:rgba(255,255,255,.07);border-color:'+col.c+';color:inherit;padding:6px 2px" aria-label="Anschluss '+(p+1)+': '+col.n+'"><img src="'+ic+'" alt="" draggable="false" style="display:block;height:58px;max-width:100%;margin:0 auto 4px;object-fit:contain;pointer-events:none;-webkit-user-drag:none">'+col.n+'</button>';
    return '<button type="button" data-act="wpick" data-p="'+p+'" class="'+(u.sel===p?'sel':'')+'" style="background:'+col.c+'" aria-label="Anschluss '+(p+1)+': '+col.n+'">'+col.n+'</button>'})()+'</div>').join('')+'</div>';
}
let wDrag=null,wSwallow=false;
function wSwap(u,q,p){const t=u.order[q];u.order[q]=u.order[p];u.order[p]=t;u.sel=null;u.order.forEach((c,i)=>{u.vals[c]=i+1})}
function wRender(u){const w=document.getElementById('wrow');if(w){const tmp=document.createElement('div');tmp.innerHTML=wrowHtml(u);w.replaceWith(tmp.querySelector('#wrow'))}}
document.addEventListener('pointerdown',function(e){
  const b=e.target.closest&&e.target.closest('[data-act=wpick]');if(!b||(e.button&&e.button!==0))return;
  wDrag={b:b,p:Number(b.dataset.p),x:e.clientX,y:e.clientY,on:false,id:e.pointerId};
  try{b.setPointerCapture(e.pointerId)}catch(x){}
});
document.addEventListener('pointermove',function(e){
  const d=wDrag;if(!d||e.pointerId!==d.id)return;
  const dx=e.clientX-d.x,dy=e.clientY-d.y;
  if(!d.on&&Math.hypot(dx,dy)>8){d.on=true;d.b.classList.add('drag')}
  if(d.on){d.b.style.transform='translate('+dx+'px,'+dy+'px) scale(1.06)';e.preventDefault()}
});
function wEnd(e,cancel){
  const d=wDrag;if(!d||e.pointerId!==d.id)return;wDrag=null;
  try{d.b.releasePointerCapture(e.pointerId)}catch(x){}
  if(!d.on)return;
  wSwallow=true;setTimeout(()=>{wSwallow=false},80);
  const u=window.__wu;d.b.style.transform='';d.b.classList.remove('drag');
  if(cancel||!u||!u.order){wRender(u);return}
  let to=-1,best=1e9;
  document.querySelectorAll('#wrow .ws').forEach((el,i)=>{const r=el.getBoundingClientRect();if(e.clientY>r.top-30&&e.clientY<r.bottom+30){const dd=Math.abs(e.clientX-(r.left+r.width/2));if(dd<best){best=dd;to=i}}});
  if(to>=0&&to!==d.p)wSwap(u,d.p,to);
  u.sel=null;wRender(u);
}
document.addEventListener('pointerup',e=>wEnd(e,false));
document.addEventListener('pointercancel',e=>wEnd(e,true));
document.addEventListener('click',function(e){if(wSwallow&&e.target.closest&&e.target.closest('[data-act=wpick]')){e.stopPropagation();e.preventDefault()}},true);
document.addEventListener('click',function(e){
  const b=e.target.closest&&e.target.closest('[data-act=wpick]');if(!b)return;
  const u=window.__wu;if(!u||!u.order)return;
  const p=Number(b.dataset.p);
  if(u.sel==null||u.sel===undefined)u.sel=p;
  else if(u.sel===p)u.sel=null;
  else{const q=u.sel;const t=u.order[q];u.order[q]=u.order[p];u.order[p]=t;u.sel=null;u.order.forEach((c,i)=>{u.vals[c]=i+1})}
  const w=document.getElementById('wrow');if(w){const tmp=document.createElement('div');tmp.innerHTML=wrowHtml(u);w.replaceWith(tmp.querySelector('#wrow'))}
});
const PZ={};

/* 1. Geheimschrift (Caesar) */
PZ.cipher={name:'Die Geheimschrift',atm:'side',
  gen(rnd,st){const len=st<=2?5:(st<=4?6:7),word=pick(WORDS[len],rnd),shift=2+Math.floor(rnd()*(st<=2?6:(st<=4?14:22)));
    return {word,shift,cipher:word.split('').map(c=>ALPHA[(ALPHA.indexOf(c)+shift)%26]).join('')}},
  init(d){return wordInit(d.word.length)},
  role(r,d,u){
    if(r==='mechanic')return mechWord(u,'Du stellst das geheime Wort ein. Es hat '+d.word.length+' Buchstaben. Deine Gruppe entschlüsselt es für dich.');
    if(r==='research'||r==='cartographer'){
      const p=rolePieces(r,d.word.length,['research','cartographer']);
      if(!p.length)return noPiece();
      return '<p class="lead">Das ist ein Teil der verschlüsselten Nachricht. Sag deiner Gruppe die Buchstaben in dieser Reihenfolge.</p><ul class="list">'+p.map(i=>'<li><span class="k">BUCHSTABE '+(i+1)+'</span><span class="v">'+d.cipher[i]+'</span></li>').join('')+'</ul>';
    }
    if(r==='decode')return '<p class="lead">Du kennst den Schlüssel: Der Absender hat jeden Buchstaben um <b>'+d.shift+'</b> Stellen im Alphabet nach vorne geschoben. Zum Entschlüsseln musst du so viele Stellen zurückzählen. Nach A geht es bei Z weiter.</p>'+(existing(['radio']).length?'':'<h3 class="sub">Alphabet</h3>'+alphaStrip());
    if(r==='radio')return '<p class="lead">Du hast das Alphabet mit Nummern. Damit kann man leicht vor- und zurückzählen.</p>'+alphaStrip();
    return noPiece();
  },
  explain(d){return ['Ein geheimes Wort mit '+d.word.length+' Buchstaben öffnet diese Kammer. Es wurde in Geheimschrift verschlüsselt.','Wer die Nachricht hat (Forscher/in), liest die verschlüsselten Buchstaben vor.','Die Entschlüsseler/in kennt den Schlüssel: um wie viele Stellen die Buchstaben verschoben wurden. Zurückzählen im Alphabet ergibt das echte Wort.','Die Mechaniker/in stellt das Wort am Schloss ein.']},
  hint(d,n){if(n===1)return 'Zählt vom verschlüsselten Buchstaben so viele Stellen im Alphabet zurück, wie der Schlüssel sagt.';if(n===2)return 'Der erste Buchstabe des Wortes ist '+d.word[0]+'.';return 'Die ersten beiden Buchstaben sind '+d.word.slice(0,2)+'.'},
  act(d,u,a){return wordSub(d.word)(d,u,a)}
};

/* 2. Kabel-Logik */
const WCOL=[{n:'Rot',c:'#ff5468'},{n:'Blau',c:'#5aa0ff'},{n:'Grün',c:'#4be39a'},{n:'Gelb',c:'#ffd23c'},{n:'Lila',c:'#b57bff'},{n:'Orange',c:'#ff9a3c'}];
function perms(n){const out=[];(function rec(a,rest){if(!rest.length){out.push(a);return}for(let i=0;i<rest.length;i++)rec(a.concat(rest[i]),rest.slice(0,i).concat(rest.slice(i+1)))})([],Array.from({length:n},(_,i)=>i+1));return out}
PZ.wires={name:'Die Schaltwand',atm:'valves',
  gen(rnd,st){
    const N=st<=2?4:(st<=4?6:6),cols=shuffled(WCOL,rnd).slice(0,N),pos=shuffled(Array.from({length:N},(_,i)=>i+1),rnd);
    const pool=[];
    for(let c=0;c<N;c++){
      pool.push({abs:1,t:cols[c].n+' steckt an Anschluss '+pos[c]+'.',f:p=>p[c]===pos[c]});
      for(let k=1;k<=N;k++)if(k!==pos[c])pool.push({abs:1,t:cols[c].n+' steckt nicht an Anschluss '+k+'.',f:p=>p[c]!==k});
      for(let e=0;e<N;e++){if(e===c)continue;const df=Math.abs(pos[c]-pos[e]);
        if(pos[c]<pos[e])pool.push({t:cols[c].n+' steckt links von '+cols[e].n+'.',f:p=>p[c]<p[e]});
        if(c<e){
          if(df===1)pool.push({t:cols[c].n+' und '+cols[e].n+' stecken direkt nebeneinander.',f:p=>Math.abs(p[c]-p[e])===1});
          else pool.push({t:cols[c].n+' und '+cols[e].n+' stecken nicht nebeneinander.',f:p=>Math.abs(p[c]-p[e])!==1});
          if(df===2)pool.push({t:'Zwischen '+cols[c].n+' und '+cols[e].n+' liegt genau ein Anschluss.',f:p=>Math.abs(p[c]-p[e])===2});
        }}
    }
    const list=shuffled(pool,rnd);
    let cand=perms(N);const used=[];
    while(cand.length>1){
      const rel=list.filter(x=>!x.abs&&used.indexOf(x.t)<0),ab=list.filter(x=>x.abs&&used.indexOf(x.t)<0);
      let src=(st>2?rel:rel.concat(ab)).slice(0,30),best=null,bn=cand.length;
      src.forEach(cl=>{const nx=cand.filter(cl.f);if(nx.length<bn){bn=nx.length;best={cl,nx}}});
      if(!best){src=ab.slice(0,30);src.forEach(cl=>{const nx=cand.filter(cl.f);if(nx.length<bn){bn=nx.length;best={cl,nx}}})}
      if(!best)break;
      used.push(best.cl.t);cand=best.nx;
    }
    return {N,cols,pos,clues:used,uc:cand.length};
  },
  init(d){return {order:Array.from({length:d.N},(_,i)=>i),sel:null,cols:d.cols,vals:Array.from({length:d.N},(_,i)=>i+1),mods:new Array(d.N).fill(d.N),mins:new Array(d.N).fill(1),show:(i,v)=>String(v)}},
  role(r,d,u){
    if(r==='mechanic')return '<p class="lead">Du ordnest die Kabel an der Schaltwand. Zieh ein Kabel auf einen anderen Platz oder tippe zwei Kabel nacheinander an: Die beiden tauschen die Plätze. Die Anschlüsse sind von links nach rechts von 1 bis '+d.N+' nummeriert. Deine Gruppe findet heraus, wohin welches Kabel gehört.</p>'+wrowHtml(u)+'<div><button class="btn primary" data-act="xsub">Schaltwand prüfen</button></div>'+fb()+'<p class="small">Ein Fehlversuch kostet '+penTry()+' Sekunden.</p>';
    const p=rolePieces(r,d.clues.length,INFO);if(!p.length)return noPiece();
    return '<p class="lead">Das sind deine Hinweise zur Schaltwand. Die Hinweise der anderen brauchst du auch. Nur zusammen passt alles.</p><ul class="list">'+p.map(i=>'<li><span>'+esc(d.clues[i])+'</span></li>').join('')+'</ul>';
  },
  explain(d){return ['An der Schaltwand müssen '+d.N+' farbige Kabel an den richtigen Anschlüssen stecken (1 bis '+d.N+' von links nach rechts).','Jede Person kennt ein paar Hinweise, wo welches Kabel steckt oder in welcher Beziehung Kabel zueinander stehen.','Sammelt alle Hinweise und schließt Möglichkeiten aus, bis genau eine Anordnung übrig ist.','Die Mechaniker/in stellt die Anschlüsse ein und prüft.']},
  hint(d,n){if(n===1)return 'Schreibt die Anschlüsse 1 bis '+d.N+' auf und tragt Hinweis für Hinweis die Farben ein.';if(n===2)return d.cols[0].n+' steckt an Anschluss '+d.pos[0]+'.';return d.cols[0].n+' steckt an Anschluss '+d.pos[0]+' und '+d.cols[1].n+' an Anschluss '+d.pos[1]+'.'},
  act(d,u,a){
    if(a.op!=='sub'||!nums(a.vals,d.N))return null;
    if(new Set(a.vals).size!==d.N)return {wrong:'Jeder Anschluss darf nur einmal vorkommen.'};
    let ok=0;for(let i=0;i<d.N;i++)if(a.vals[i]===d.pos[i])ok++;
    return ok===d.N?{ok:true}:{wrong:ok+' von '+d.N+' Kabeln stecken richtig.'};
  }
};

/* 3. Waage */
const SL='ABCDEFGHI';
PZ.scales={name:'Die Waage',atm:'meta',
  gen(rnd,st){
    const N=st<=2?6:9,h=Math.floor(rnd()*N),light=st>=3&&rnd()<.5;
    let cand=Array.from({length:N},(_,i)=>i),ws=[];
    for(let t=0;t<120&&!(cand.length===1&&ws.length>=3+(st>=3?1:0));t++){
      const k=1+Math.floor(rnd()*Math.min(3,Math.floor(N/2))),sh=shuffled(Array.from({length:N},(_,i)=>i),rnd),L=sh.slice(0,k).sort((a,b)=>a-b),R=sh.slice(k,2*k).sort((a,b)=>a-b);
      let res='E';if(L.indexOf(h)>=0)res=light?'R':'L';else if(R.indexOf(h)>=0)res=light?'L':'R';  // welche Schale sinkt
      let nx;
      if(res==='E')nx=cand.filter(x=>L.indexOf(x)<0&&R.indexOf(x)<0);
      else{const side=(res==='L')===!light?L:R;nx=cand.filter(x=>side.indexOf(x)>=0)}
      if(cand.length>1&&nx.length>=cand.length)continue;
      ws.push({L,R,res});cand=nx;
    }
    return {N,h,light,ws,uc:cand.length};
  },
  init(d){return {sel:null}},
  wtext(d,w){return w.L.map(i=>SL[i]).join(' + ')+'  gegen  '+w.R.map(i=>SL[i]).join(' + ')+'  →  '+(w.res==='E'?'Gleichgewicht':(w.res==='L'?'linke':'rechte')+' Schale sinkt')},
  role(r,d,u){
    if(r==='mechanic'){
      return '<p class="lead">Du zeigst auf den Stein, den deine Gruppe für den Besonderen hält. Tippe ihn an und bestätige.</p>'
        +'<div class="keys" style="grid-template-columns:repeat(3,1fr)">'+Array.from({length:d.N},(_,i)=>'<button class="key" data-act="xpick" data-i="'+i+'" aria-pressed="'+(u.sel===i)+'"'+(u.sel===i?' style="border-color:var(--lava);background:#3a1d12"':'')+'>'+SL[i]+'</button>').join('')+'</div>'
        +'<div><button class="btn primary" data-act="xsubsel"'+(u.sel==null?' disabled':'')+'>'+(u.sel==null?'Wähle einen Stein':'Stein '+SL[u.sel]+' melden')+'</button></div>'+fb();
    }
    if(r==='decode')return '<p class="lead">Du kennst die Regel der Waage: Unter den '+d.N+' Steinen (A bis '+SL[d.N-1]+') ist genau einer <b>'+(d.light?'leichter':'schwerer')+'</b> als die anderen. Die Schale, in der er liegt, '+(d.light?'steigt':'sinkt')+'. Die Wägungen haben andere in deiner Gruppe.</p>';
    const p=rolePieces(r,d.ws.length,['research','cartographer','radio']);if(!p.length)return noPiece();
    return '<p class="lead">Das sind Ergebnisse von Wägungen. Wer die Regel kennt, sagt dir, was sie bedeuten.</p><ul class="list">'+p.map(i=>'<li><span class="k">WÄGUNG '+(i+1)+'</span><span>'+esc(PZ.scales.wtext(d,d.ws[i]))+'</span></li>').join('')+'</ul>';
  },
  explain(d){return ['Unter '+d.N+' Steinen ist einer '+(d.light?'leichter':'schwerer')+' als die anderen. Ihr müsst ihn finden.','Mehrere Wägungen sind schon gemacht. Die Ergebnisse liegen bei den Personen mit Karten.','Die Entschlüsseler/in kennt die Regel: Ist der besondere Stein schwerer oder leichter, und was bedeutet das für die Schalen?','Die Mechaniker/in meldet den Stein.']},
  hint(d,n){const o=(d.h+1)%d.N;if(n===1)return 'Steine, die in einer Wägung mit Gleichgewicht vorkommen, sind unverdächtig.';if(n===2)return 'Der gesuchte Stein ist nicht '+SL[o]+'.';return 'Der gesuchte Stein ist '+SL[d.h]+' oder '+SL[o]+'.'},
  act(d,u,a){if(a.op!=='sub'||typeof a.i!=='number')return null;return a.i===d.h?{ok:true}:{wrong:'Das ist nicht der gesuchte Stein.'}}
};

/* 4. Schatzkarte */
PZ.map={name:'Die Schatzkarte',atm:'lava',
  gen(rnd,st){
    const N=st<=2?5:(st<=4?7:7),steps=st<=2?3:(st<=4?4:5),cells=shuffled(Array.from({length:N*N},(_,i)=>i),rnd),lm=[];
    for(let s=0;s<6;s++)lm.push({s,x:cells[s]%N,y:Math.floor(cells[s]/N)});
    for(let tries=0;tries<200;tries++){
      const st0=lm[Math.floor(rnd()*6)];let x=st0.x,y=st0.y;const mv=[];let okk=true;
      for(let k=0;k<steps&&okk;k++){
        const opts=[];[['rechts',1,0],['links',-1,0],['oben',0,-1],['unten',0,1]].forEach(o=>{for(let n=1;n<=3;n++){const nx=x+o[1]*n,ny=y+o[2]*n;if(nx>=0&&nx<N&&ny>=0&&ny<N&&(!mv.length||mv[mv.length-1].dir!==o[0]))opts.push({dir:o[0],n,nx,ny})}});
        if(!opts.length){okk=false;break}
        const o=pick(opts,rnd);mv.push(o);x=o.nx;y=o.ny;
      }
      if(okk&&!(x===st0.x&&y===st0.y))return {N,lm,start:st0.s,mv,ans:[x,y]};
    }
    return {N,lm,start:lm[0].s,mv:[{dir:'rechts',n:1,nx:lm[0].x+1,ny:lm[0].y}],ans:[lm[0].x+1,lm[0].y]};
  },
  init(d){return {vals:[0,0],mods:[d.N,d.N],show:(i,v)=>i===0?ALPHA[v]:String(v+1),labels:['Spalte','Zeile']}},
  steps(d){const a=['Starte bei dem Zeichen '+SHAPES[d.start]+'.'];d.mv.forEach(m=>a.push('Gehe '+m.n+' Feld'+(m.n>1?'er':'')+' nach '+m.dir+'.'));a.push('Dort liegt der Schatz.');return a},
  role(r,d,u){
    if(r==='mechanic')return mechWord(u,'Du gibst das Feld ein, auf dem der Schatz liegt: erst die Spalte (Buchstabe), dann die Zeile (Zahl).','Schatz melden');
    if(r==='research'){
      let t='<table class="map"><tr><th></th>'+Array.from({length:d.N},(_,i)=>'<th>'+ALPHA[i]+'</th>').join('')+'</tr>';
      for(let y=0;y<d.N;y++){t+='<tr><th>'+(y+1)+'</th>';for(let x=0;x<d.N;x++){const m=d.lm.find(q=>q.x===x&&q.y===y);t+='<td>'+(m?img(m.s):'')+'</td>'}t+='</tr>'}
      return '<p class="lead">Du hast die Karte. Die Wegbeschreibung hat jemand anderes. Hilf, den Weg auf der Karte zu verfolgen und das Zielfeld zu nennen.</p>'+t+'</table>';
    }
    const st=PZ.map.steps(d),p=rolePieces(r,st.length,['decode','cartographer','radio']);if(!p.length)return noPiece();
    return '<p class="lead">Das ist ein Teil der Wegbeschreibung zum Schatz. Die Karte hat jemand anderes.</p><ul class="list">'+p.map(i=>'<li><span class="k">SCHRITT '+(i+1)+'</span><span>'+esc(st[i])+'</span></li>').join('')+'</ul>';
  },
  explain(d){return ['Der Schatz liegt auf einem Feld der Karte. Spalten sind Buchstaben, Zeilen sind Zahlen (Zeile 1 ist oben).','Die Forscher/in hat die Karte mit den Zeichen.','Die anderen haben die Wegbeschreibung: Start-Zeichen, dann Schritt für Schritt Richtungen.','Die Mechaniker/in gibt Spalte und Zeile des Ziels ein.']},
  hint(d,n){if(n===1)return 'Fangt bei dem Zeichen an und zählt die Felder einzeln auf der Karte ab.';if(n===2)return 'Das Ziel liegt in Spalte '+ALPHA[d.ans[0]]+'.';return 'Das Ziel liegt in Spalte '+ALPHA[d.ans[0]]+' und in der '+(d.ans[1]<d.N/2?'oberen':'unteren')+' Hälfte der Karte.'},
  act(d,u,a){if(a.op!=='sub'||!nums(a.vals,2))return null;return a.vals[0]===d.ans[0]&&a.vals[1]===d.ans[1]?{ok:true}:{wrong:'Das ist nicht das Zielfeld.'}}
};

/* 5. Zahlenreihe */
PZ.sequence={name:'Die Zahlenreihe',atm:'crystal',
  gen(rnd,st){
    const kinds=st<=2?['add','mul']:(st<=4?['quad','mul','fib','alt']:['quad','fib','mulp','alt']);
    for(let t=0;t<100;t++){
      const kind=pick(kinds,rnd);let a=[];
      if(kind==='add'){const d=2+Math.floor(rnd()*8),s=1+Math.floor(rnd()*20);for(let i=0;i<8;i++)a.push(s+d*i)}
      else if(kind==='quad'){const d=1+Math.floor(rnd()*3),e=1+Math.floor(rnd()*3),s=Math.floor(rnd()*10);let v=s,df=d;for(let i=0;i<8;i++){a.push(v);v+=df;df+=e}}
      else if(kind==='mul'){const m=2+Math.floor(rnd()*2),s=1+Math.floor(rnd()*3);for(let i=0;i<8;i++)a.push(s*Math.pow(m,i))}
      else if(kind==='fib'){const x=1+Math.floor(rnd()*4),y=1+Math.floor(rnd()*5);a=[x,y];for(let i=2;i<8;i++)a.push(a[i-1]+a[i-2])}
      else if(kind==='mulp'){const m=2,c=Math.floor(rnd()*3)-1||1,s=1+Math.floor(rnd()*3);a=[s];for(let i=1;i<8;i++)a.push(a[i-1]*m+c)}
      else{const p=3+Math.floor(rnd()*6),q=1+Math.floor(rnd()*(p-1)),s=5+Math.floor(rnd()*20);a=[s];for(let i=1;i<8;i++)a.push(a[i-1]+(i%2?p:-q))}
      if(a.every(v=>v>=0&&v<1000)&&new Set(a).size>=6)return {kind,terms:a.slice(0,7),ans:a[7]};
    }
    return {kind:'add',terms:[2,4,6,8,10,12,14],ans:16};
  },
  tip(k){return {add:'Schaut auf den Abstand zwischen zwei Nachbarn. Er bleibt immer gleich.',quad:'Der Abstand zwischen den Nachbarn bleibt nicht gleich. Er ändert sich selbst regelmäßig.',mul:'Vergleicht jede Zahl mit der davor: Sie wird jedes Mal vervielfacht.',fib:'Zwei Zahlen nebeneinander ergeben zusammen die nächste.',mulp:'Erst wird vervielfacht, dann kommt immer dieselbe kleine Zahl dazu oder weg.',alt:'Abwechselnd wird etwas addiert und etwas abgezogen.'}[k]},
  init(d){return {vals:[0,0,0],mods:[10,10,10],show:(i,v)=>String(v)}},
  role(r,d,u){
    if(r==='mechanic'){const x=u.vals;return mechWord(u,'Du stellst die nächste Zahl der Reihe ein (bis zu drei Stellen). Deine Gruppe findet die Regel und rechnet sie aus.','Zahl melden')}
    const p=rolePieces(r,d.terms.length,INFO),tip=r==='decode'?'<div class="hint">'+esc(PZ.sequence.tip(d.kind))+'</div>':'';
    if(!p.length&&!tip)return noPiece();
    return '<p class="lead">Eine Zahlenreihe hat eine Regel. Ihr kennt jeweils nur einzelne Zahlen. Gesucht ist das 8. Glied.</p>'+(p.length?'<ul class="list">'+p.map(i=>'<li><span class="k">GLIED '+(i+1)+'</span><span class="v">'+d.terms[i]+'</span></li>').join('')+'</ul>':'')+tip;
  },
  explain(d){return ['Eine Zahlenreihe folgt einer Regel. Gesucht ist die 8. Zahl.','Jede Person kennt nur einzelne Zahlen der Reihe. Nennt sie euch der Reihe nach.','Die Entschlüsseler/in hat einen Tipp zur Art der Regel.','Die Mechaniker/in stellt die gesuchte Zahl ein.']},
  hint(d,n){if(n===1)return PZ.sequence.tip(d.kind);if(n===2)return 'Die gesuchte Zahl hat '+(d.ans>=100?'drei':(d.ans>=10?'zwei':'eine'))+' Stelle'+(d.ans>=10?'n':'')+'.';return 'Die gesuchte Zahl ist '+(d.ans%2?'ungerade':'gerade')+' und liegt zwischen '+Math.max(0,d.ans-6)+' und '+(d.ans+6)+'.'},
  act(d,u,a){if(a.op!=='sub'||!nums(a.vals,3))return null;return a.vals[0]*100+a.vals[1]*10+a.vals[2]===d.ans?{ok:true}:{wrong:'Das ist nicht die nächste Zahl.'}}
};

/* 6. Schalter-Rätsel */
PZ.switches={name:'Die Schalttafel',atm:'core',
  gen(rnd,st){
    const S=st<=2?3:(st<=4?5:6),rules=[];
    for(let i=0;i<S;i++){const k=1+Math.floor(rnd()*(st<=2?2:3));rules.push(shuffled(Array.from({length:S},(_,j)=>j),rnd).slice(0,k).sort((a,b)=>a-b))}
    for(let t=0;t<50;t++){
      const sol=Array.from({length:S},()=>rnd()<.5?1:0),sn=sol.reduce((a,b)=>a+b,0);if(sn<(st<=2?1:2)||(st<=2&&sn>2))continue;
      const lamps=new Array(S).fill(1);sol.forEach((p,i)=>{if(p)rules[i].forEach(j=>{lamps[j]^=1})});
      if(lamps.some(x=>!x))return {S,rules,start:lamps,sol,max:2*S+2};
    }
    return {S,rules:Array.from({length:S},(_,i)=>[i]),start:[0,1,1,1,1,1].slice(0,S),sol:[1,0,0,0,0,0].slice(0,S),max:2*S+2};
  },
  init(d){return {lamps:d.start.slice(),presses:0}},
  lampRow(d,u){return '<div class="lamps" aria-label="Lampen">'+u.lamps.map((v,i)=>'<span class="lamp '+(v?'on':'')+'" aria-label="Lampe '+(i+1)+(v?' an':' aus')+'">'+(i+1)+'</span>').join('')+'</div><p class="small">Schaltungen: '+u.presses+' von '+d.max+'</p>'},
  role(r,d,u){
    const row=PZ.switches.lampRow(d,u);
    if(r==='mechanic')return '<p class="lead">Du bedienst die Schalter. Alle Lampen sollen leuchten. Jeder Schalter schaltet bestimmte Lampen um. Welche, wissen die anderen.</p>'+row+'<div class="keys" style="grid-template-columns:repeat(3,1fr)">'+Array.from({length:d.S},(_,i)=>'<button class="key" data-act="xpress" data-i="'+i+'">'+(i+1)+'</button>').join('')+'</div>'+fb();
    const p=rolePieces(r,d.rules.length,INFO);if(!p.length)return '<p class="lead">Du siehst die Lampen und hilfst beim Planen.</p>'+row;
    return '<p class="lead">Das sind die Regeln einiger Schalter. Die anderen kennen die übrigen.</p><ul class="list">'+p.map(i=>'<li><span class="k">SCHALTER '+(i+1)+'</span><span>schaltet Lampe '+d.rules[i].map(j=>j+1).join(' und ')+' um</span></li>').join('')+'</ul>'+row;
  },
  explain(d){return ['Alle '+d.S+' Lampen sollen gleichzeitig leuchten. Die Mechaniker/in bedient die Schalter, höchstens '+d.max+'-mal, sonst beginnt alles von vorn.','Jeder Schalter schaltet immer dieselben Lampen um: An wird aus, aus wird an. Beispiel: Schalter 2 schaltet Lampe 1 und 3 um. Ist Lampe 1 aus und Lampe 3 an, ist danach Lampe 1 an und Lampe 3 aus.','Die Regeln der Schalter sind auf alle Personen verteilt. Sagt sie euch und plant, welche Schalter gedrückt werden.']},
  hint(d,n){const first=d.sol.indexOf(1);if(n===1)return 'Ein Schalter, den ihr zweimal drückt, hebt sich selbst auf. Jeder Schalter wird höchstens einmal gebraucht.';if(n===2)return 'Schaut zuerst, welche Lampen noch aus sind, und welche Schalter diese Lampen umschalten.';return 'Schalter '+(first+1)+' gehört zur Lösung.'},
  act(d,u,a){
    if(a.op!=='press'||typeof a.i!=='number'||a.i<0||a.i>=d.S)return null;
    d.rules[a.i].forEach(j=>{u.lamps[j]^=1});u.presses++;beep(260+a.i*40,.08,'triangle',.06);
    if(u.lamps.every(Boolean))return {ok:true};
    if(u.presses>=d.max){u.lamps=d.start.slice();u.presses=0;return {wrong:'Zu viele Schaltungen. Alle Lampen sind wieder wie am Anfang.'}}
    return {render:true};
  }
};

/* 7. Lichtsignale (Morse) */
PZ.morse={name:'Die Lichtsignale',atm:'gate',
  gen(rnd,st){const len=st<=2?4:(st<=4?5:6);return {word:pick(WORDS[len],rnd)}},
  init(d){return wordInit(d.word.length)},
  role(r,d,u){
    if(r==='mechanic')return mechWord(u,'Du stellst das Wort ein, das deine Gruppe aus den Lichtsignalen entschlüsselt. Es hat '+d.word.length+' Buchstaben.');
    if(r==='research')return '<p class="lead">Du siehst die Lichtsignale. Jeder Block ist ein Buchstabe. Ein Punkt ist ein kurzes Signal, ein Strich ein langes. Beschreibe sie deiner Gruppe der Reihe nach.</p><ul class="list">'+d.word.split('').map((c,i)=>'<li><span class="k">BUCHSTABE '+(i+1)+'</span>'+morseHtml(c)+'</li>').join('')+'</ul>';
    const p=rolePieces(r,26,['decode','cartographer','radio']);if(!p.length)return noPiece();
    return '<p class="lead">Du hast einen Teil der Morse-Tabelle. Sag deiner Gruppe, welcher Buchstabe zu welchem Signal gehört.</p><ul class="list">'+p.map(i=>'<li><b class="v" style="min-width:28px">'+ALPHA[i]+'</b>'+morseHtml(ALPHA[i])+'</li>').join('')+'</ul>';
  },
  explain(d){return ['Ein Wort mit '+d.word.length+' Buchstaben wird als Morse-Lichtsignal gezeigt: kurz und lang.','Die Forscher/in sieht die Signale und beschreibt sie.','Die Tabelle, welches Signal welcher Buchstabe ist, ist auf die anderen verteilt.','Die Mechaniker/in stellt das Wort ein.']},
  hint(d,n){if(n===1)return 'Ein Punkt ist kurz, ein Strich ist lang. Jeder Block ist ein Buchstabe. Vergleicht jedes Signal mit der Tabelle.';if(n===2)return 'Der erste Buchstabe des Wortes ist '+d.word[0]+'.';return 'Die ersten beiden Buchstaben sind '+d.word.slice(0,2)+'.'},
  act(d,u,a){return wordSub(d.word)(d,u,a)}
};

/* 8. Zahlenschloss (Code knacken) */
PZ.lock={name:'Das Zahlenschloss',atm:'valves',
  fbText(a,b){if(!a&&!b)return 'keine Ziffer ist richtig';const t=[];if(a)t.push(a+' Ziffer'+(a>1?'n':'')+' richtig und am richtigen Platz');if(b)t.push(b+' Ziffer'+(b>1?'n':'')+' richtig, aber am falschen Platz');return t.join(', ')},
  score(c,g){let a=0,b=0;for(let i=0;i<c.length;i++){if(g[i]===c[i])a++;else if(c.indexOf(g[i])>=0)b++}return [a,b]},
  gen(rnd,st){
    const L=st<=2?3:4,all=[];
    (function rec(p){if(p.length===L){all.push(p.slice());return}for(let d=0;d<10;d++)if(p.indexOf(d)<0){p.push(d);rec(p);p.pop()}})([]);
    for(let t=0;t<60;t++){
      const code=all[Math.floor(rnd()*all.length)];let cand=all.slice();const gs=[];
      for(let k=0;k<400&&cand.length>1&&gs.length<7;k++){
        const g=all[Math.floor(rnd()*all.length)];if(g.join()===code.join())continue;
        const sc=PZ.lock.score(code,g),nx=cand.filter(c=>{const q=PZ.lock.score(c,g);return q[0]===sc[0]&&q[1]===sc[1]});
        if(nx.length<cand.length&&(gs.length>0||nx.length<cand.length*.6)){gs.push({g,a:sc[0],b:sc[1]});cand=nx}
      }
      if(cand.length===1&&gs.length>=(st<=2?3:4))return {L,code,gs:shuffled(gs,rnd)};
    }
    return {L:3,code:[4,1,7],gs:[{g:[4,2,9],a:1,b:0},{g:[1,7,3],a:0,b:2},{g:[6,5,8],a:0,b:0},{g:[2,0,7],a:1,b:0}]};
  },
  init(d){return {vals:new Array(d.L).fill(0),mods:new Array(d.L).fill(10),show:(i,v)=>String(v)}},
  role(r,d,u){
    if(r==='mechanic')return mechWord(u,'Du stellst den '+d.L+'-stelligen Code ein. Jede Ziffer kommt darin höchstens einmal vor. Die Versuche anderer Leute kennt deine Gruppe.','Code prüfen');
    const p=rolePieces(r,d.gs.length,INFO),rule=r==='decode'?'<div class="hint">So lest ihr die Versuche: „richtig und am richtigen Platz“ heißt, die Ziffer steht genau dort auch im Code. „Richtig, aber am falschen Platz“ heißt, die Ziffer kommt im Code vor, aber an einer anderen Stelle.</div>':'';
    if(!p.length&&!rule)return noPiece();
    return '<p class="lead">Andere haben schon versucht, das Schloss zu öffnen. Zu jedem Versuch weißt du, wie nah er dran war.</p>'+(p.length?'<ul class="list">'+p.map(i=>'<li><span class="k">VERSUCH '+(i+1)+'</span><span><b class="v">'+d.gs[i].g.join(' ')+'</b> → '+esc(PZ.lock.fbText(d.gs[i].a,d.gs[i].b))+'</span></li>').join('')+'</ul>':'')+rule;
  },
  explain(d){return ['Ein Schloss braucht einen Code mit '+d.L+' Ziffern. Keine Ziffer kommt doppelt vor.','Mehrere frühere Versuche sind auf euch verteilt. Zu jedem steht, wie viele Ziffern stimmen.','Sammelt alle Versuche und schließt Schritt für Schritt aus. Ein Versuch, bei dem keine Ziffer richtig ist, ist ein guter Anfang.','Die Mechaniker/in stellt den Code ein.']},
  hint(d,n){const z=d.gs.find(g=>!g.a&&!g.b);if(n===1)return z?'Beim Versuch '+z.g.join(' ')+' ist keine Ziffer richtig. Diese Ziffern könnt ihr überall streichen.':'Vergleicht zwei Versuche, die sich ähneln. Was ändert sich, wenn eine Ziffer anders ist?';if(n===2)return 'Die erste Ziffer des Codes ist '+d.code[0]+'.';return 'Der Code beginnt mit '+d.code[0]+' '+d.code[1]+'.'},
  act(d,u,a){if(a.op!=='sub'||!nums(a.vals,d.L))return null;let ok=0;for(let i=0;i<d.L;i++)if(a.vals[i]===d.code[i])ok++;return ok===d.L?{ok:true}:{wrong:'Das Schloss bleibt zu.'}}
};

/* 9. Symbolrechnung */
PZ.symbols={name:'Die Symbolrechnung',atm:'crystal',
  gen(rnd,st){
    const K=st<=2?3:4,sy=shuffled([0,1,2,3,4,5],rnd).slice(0,K),mx=st<=2?9:(st<=4?12:15);
    for(let t=0;t<200;t++){
      const v=sy.map(()=>1+Math.floor(rnd()*mx));if(new Set(v).size<K)continue;
      const eq=[];
      eq.push({t:[[0,'+'],[0,'+'],[0,'']],r:3*v[0]});
      eq.push({t:[[0,'+'],[1,'']],r:v[0]+v[1]});
      if(st>=3&&v[2]>v[1])eq.push({t:[[2,'−'],[1,'']],r:v[2]-v[1]});else eq.push({t:[[1,'+'],[2,'']],r:v[1]+v[2]});
      if(K===4)eq.push({t:[[3,'+'],[3,'−'],[2,'']],r:2*v[3]-v[2]});
      if(eq.some(e=>e.r<=0))continue;
      let q,ans;
      if(st<=2){q=[[0,'+'],[1,'+'],[2,'']];ans=v[0]+v[1]+v[2]}
      else if(st<=4){q=[[2,'×'],[0,'+'],[1,'']];ans=v[2]*v[0]+v[1]}
      else{q=[[3,'×'],[2,'−'],[0,'']];ans=v[3]*v[2]-v[0]}
      if(ans<=0||ans>999)continue;
      return {K,sy,v,eq:shuffled(eq,rnd),q,ans};
    }
    return {K:3,sy:[0,1,2],v:[2,3,4],eq:[{t:[[0,'+'],[0,'+'],[0,'']],r:6},{t:[[0,'+'],[1,'']],r:5},{t:[[1,'+'],[2,'']],r:7}],q:[[0,'+'],[1,'+'],[2,'']],ans:9};
  },
  init(d){return {vals:[0,0,0],mods:[10,10,10],show:(i,v)=>String(v)}},
  term(d,t){return '<span style="display:inline-flex;align-items:center;gap:6px;flex-wrap:wrap">'+t.map(x=>'<span class="symt" title="'+SHAPES[d.sy[x[0]]]+'" style="display:inline-block;width:34px;height:34px;vertical-align:middle">'+img(d.sy[x[0]]).replace('<img ','<img style="width:34px;height:34px;object-fit:contain;display:block;margin:0" ')+'</span>'+(x[1]?'<b>'+x[1]+'</b>':'')).join('')+'</span>'},
  role(r,d,u){
    const Q='<p class="lead">Gesucht ist: '+PZ.symbols.term(d,d.q)+' <b>= ?</b></p>';
    if(r==='mechanic')return Q+mechWord(u,'Du stellst das Ergebnis ein (bis zu drei Stellen). Jedes Zeichen steht für eine Zahl. Die Rechnungen dazu kennt deine Gruppe.','Ergebnis melden');
    const p=rolePieces(r,d.eq.length,INFO),tip=r==='decode'?'<div class="hint">Jedes Zeichen steht immer für dieselbe Zahl. Fangt mit der Rechnung an, in der nur ein Zeichen vorkommt. Punkt vor Strich: × wird zuerst gerechnet.</div>':'';
    if(!p.length&&!tip)return Q+noPiece();
    return Q+(p.length?'<ul class="list">'+p.map(i=>'<li><span class="k">RECHNUNG '+(i+1)+'</span><span>'+PZ.symbols.term(d,d.eq[i].t)+' <b>= '+d.eq[i].r+'</b></span></li>').join('')+'</ul>':'')+tip;
  },
  explain(d){return ['Jedes Zeichen steht für eine ganze Zahl. Gleiche Zeichen bedeuten immer dieselbe Zahl.','Die Rechnungen sind auf euch verteilt. Löst sie nacheinander: zuerst die, in der nur ein Zeichen vorkommt.','Am Ende rechnet ihr die gesuchte Aufgabe aus. Die Mechaniker/in stellt das Ergebnis ein.']},
  hint(d,n){if(n===1)return 'Ein Zeichen kommt in einer Rechnung dreimal vor. Teilt das Ergebnis durch 3.';if(n===2)return SHAPES[d.sy[0]]+' ist '+d.v[0]+'.';return SHAPES[d.sy[0]]+' ist '+d.v[0]+' und '+SHAPES[d.sy[1]]+' ist '+d.v[1]+'.'},
  act(d,u,a){if(a.op!=='sub'||!nums(a.vals,3))return null;return a.vals[0]*100+a.vals[1]*10+a.vals[2]===d.ans?{ok:true}:{wrong:'Das Ergebnis stimmt nicht.'}}
};

/* 10. Zahlenpyramide */
PZ.pyramid={name:'Die Zahlenpyramide',atm:'lava',
  gen(rnd,st){
    const B=st<=2?3:(st<=4?4:5),mx=st<=2?9:(st<=4?12:20),base=Array.from({length:B},()=>1+Math.floor(rnd()*mx));
    const rows=[base];while(rows[rows.length-1].length>1){const p=rows[rows.length-1];rows.push(p.slice(1).map((x,i)=>p[i]+x))}
    const m=Math.floor(rnd()*B),up=m===0?0:(m===B-1?B-2:(rnd()<.5?m-1:m));
    const known=[];for(let i=0;i<B;i++)if(i!==m)known.push({r:0,i});known.push({r:1,i:up});
    return {B,rows,m,known:shuffled(known,rnd),ans:rows[B-1][0]};
  },
  init(d){return {vals:[0,0,0],mods:[10,10,10],show:(i,v)=>String(v)}},
  view(d,mine){
    let h='<div style="display:flex;flex-direction:column;gap:6px;align-items:center;margin:10px 0">';
    for(let r=d.B-1;r>=0;r--){
      h+='<div style="display:flex;gap:6px">';
      for(let i=0;i<d.rows[r].length;i++){
        const k=mine.some(q=>q.r===r&&q.i===i),top=r===d.B-1;
        h+='<span style="min-width:52px;height:40px;display:grid;place-items:center;border-radius:8px;font-weight:800;font-size:18px;border:2px solid '+(top?'var(--ember)':'var(--line)')+';background:'+(k?'var(--raise)':'transparent')+'">'+(k?d.rows[r][i]:(top?'?':''))+'</span>';
      }
      h+='</div>';
    }
    return h+'</div>';
  },
  role(r,d,u){
    if(r==='mechanic')return mechWord(u,'Du stellst die Zahl für den obersten Stein der Pyramide ein (bis zu drei Stellen). Deine Gruppe kennt einzelne Steine und rechnet sie aus.','Zahl melden')+PZ.pyramid.view(d,[]);
    const p=rolePieces(r,d.known.length,INFO),mine=p.map(i=>d.known[i]),tip=r==='decode'?'<div class="hint">Die Regel der Pyramide: Jeder Stein ist die Summe der beiden Steine direkt darunter.</div>':'';
    if(!p.length&&!tip)return noPiece()+PZ.pyramid.view(d,[]);
    return '<p class="lead">Das sind die Steine der Pyramide, die du kennst. Die anderen kennen weitere. Gesucht ist der oberste Stein.</p>'+PZ.pyramid.view(d,mine)+tip;
  },
  explain(d){return ['Eine Zahlenpyramide mit '+d.B+' Steinen unten. Jeder Stein ist die Summe der beiden Steine direkt darunter.','Einzelne Steine sind auf euch verteilt. Ein Stein unten fehlt, ihr könnt ihn aber aus dem Stein darüber ausrechnen.','Rechnet Reihe für Reihe nach oben. Die Mechaniker/in stellt die oberste Zahl ein.']},
  hint(d,n){if(n===1)return 'Jeder Stein ist die Summe der beiden darunter. Fehlt unten ein Stein, rechnet ihr: Stein darüber minus Nachbarstein.';if(n===2)return 'Der fehlende Stein in der untersten Reihe ist '+d.rows[0][d.m]+'.';return 'Die Reihe unter der Spitze lautet '+d.rows[d.B-2].join(' und ')+'.'},
  act(d,u,a){if(a.op!=='sub'||!nums(a.vals,3))return null;return a.vals[0]*100+a.vals[1]*10+a.vals[2]===d.ans?{ok:true}:{wrong:'Das ist nicht die Zahl an der Spitze.'}}
};

/* 11. Labyrinth (blind geführt) */
PZ.maze={name:'Das Labyrinth',atm:'lava',
  DIRS:[['oben',0,-1,1],['rechts',1,0,2],['unten',0,1,4],['links',-1,0,8]],
  gen(rnd,st){
    const N=st<=2?5:(st<=4?6:7),open=new Array(N*N).fill(0),seen=new Array(N*N).fill(false),D=PZ.maze.DIRS,opp={1:4,2:8,4:1,8:2};
    const start=[0,N-1];const stack=[start[0]+start[1]*N];seen[stack[0]]=true;
    while(stack.length){const c=stack[stack.length-1],x=c%N,y=Math.floor(c/N);
      const nb=shuffled(D,rnd).filter(d=>{const nx=x+d[1],ny=y+d[2];return nx>=0&&ny>=0&&nx<N&&ny<N&&!seen[nx+ny*N]});
      if(!nb.length){stack.pop();continue}
      const d=nb[0],n=(x+d[1])+(y+d[2])*N;open[c]|=d[3];open[n]|=opp[d[3]];seen[n]=true;stack.push(n)}
    // Ziel: weitester Punkt vom Start
    const dist=new Array(N*N).fill(-1),q=[start[0]+start[1]*N];dist[q[0]]=0;
    while(q.length){const c=q.shift(),x=c%N,y=Math.floor(c/N);D.forEach(d=>{if(open[c]&d[3]){const n=(x+d[1])+(y+d[2])*N;if(dist[n]<0){dist[n]=dist[c]+1;q.push(n)}}})}
    let g=0;dist.forEach((v,i)=>{if(v>dist[g])g=i});
    return {N,open,start,goal:[g%N,Math.floor(g/N)],len:dist[g]};
  },
  init(d){return {pos:d.start.slice(),note:'',moves:0}},
  grid(d,u,rows,showWalls){
    const N=d.N;let h='<div style="display:grid;grid-template-columns:repeat('+N+',minmax(0,40px));justify-content:center;margin:10px 0">';
    for(let y=0;y<N;y++)for(let x=0;x<N;x++){
      const c=x+y*N,o=d.open[c],vis=showWalls&&rows.indexOf(y)>=0,b=w=>vis?((o&w)?'1px solid rgba(255,255,255,.08)':'3px solid var(--ember)'):'1px solid rgba(255,255,255,.12)';
      const isS=x===d.start[0]&&y===d.start[1],isG=x===d.goal[0]&&y===d.goal[1],isP=u&&u.pos[0]===x&&u.pos[1]===y;
      h+='<span style="aspect-ratio:1;display:grid;place-items:center;font-weight:800;border-top:'+b(1)+';border-right:'+b(2)+';border-bottom:'+b(4)+';border-left:'+b(8)+';background:'+(vis?'rgba(255,255,255,.04)':'transparent')+'">'+(isP?'●':(isG?'★':(isS?'S':'')))+'</span>';
    }
    return h+'</div>';
  },
  role(r,d,u){
    const note=u&&u.note?'<p class="fb bad">'+esc(u.note)+'</p>':'';
    if(r==='mechanic')return '<p class="lead">Du läufst blind durch ein Labyrinth: Du siehst nur, wo du gerade stehst (●), und das Ziel (★). Die Wände kennen die anderen. Lass dich Schritt für Schritt führen. Läufst du gegen eine Wand, musst du zurück zum Start.</p>'+PZ.maze.grid(d,u,[],false)+note
      +'<div style="display:grid;grid-template-columns:repeat(3,64px);gap:6px;justify-content:center"><span></span><button class="key" data-act="xpress" data-i="0" aria-label="nach oben">▲</button><span></span><button class="key" data-act="xpress" data-i="3" aria-label="nach links">◀</button><span></span><button class="key" data-act="xpress" data-i="1" aria-label="nach rechts">▶</button><span></span><button class="key" data-act="xpress" data-i="2" aria-label="nach unten">▼</button><span></span></div>'+fb();
    const p=rolePieces(r,d.N,INFO);if(!p.length)return noPiece();
    return '<p class="lead">Du kennst die Wände in einigen Reihen des Labyrinths (Reihe '+p.map(i=>i+1).join(', ')+'). Die anderen kennen die übrigen Reihen. Führt die Mechaniker/in gemeinsam von S zum Ziel ★. Der Punkt ● zeigt, wo sie gerade steht.</p>'+PZ.maze.grid(d,u,p,true)+note;
  },
  explain(d){return ['Die Mechaniker/in läuft blind durch ein Labyrinth mit '+d.N+' mal '+d.N+' Feldern vom Start S zum Ziel ★.','Die Wände sind reihenweise auf die anderen verteilt. Sagt ihr genau, wohin sie gehen soll: oben, unten, links, rechts.','Wer gegen eine Wand läuft, muss zurück zum Start. Plant den Weg also zuerst gemeinsam.']},
  hint(d,n){if(n===1)return 'Plant den ganzen Weg zuerst rückwärts vom Ziel aus, bevor die Mechaniker/in losläuft.';if(n===2)return 'Der kürzeste Weg ist '+d.len+' Schritte lang.';return 'Der erste Schritt vom Start geht nach '+(function(){const c=d.start[0]+d.start[1]*d.N;return PZ.maze.DIRS.filter(x=>d.open[c]&x[3]).map(x=>x[0]).join(' oder ')})()+'.'},
  act(d,u,a){
    if(a.op!=='press'||typeof a.i!=='number'||a.i<0||a.i>3)return null;
    const D=PZ.maze.DIRS[a.i],c=u.pos[0]+u.pos[1]*d.N;
    if(!(d.open[c]&D[3])){u.pos=d.start.slice();u.note='Gegen eine Wand! Zurück zum Start.';beep(150,.25,'sawtooth',.08);return {render:true}}
    u.pos=[u.pos[0]+D[1],u.pos[1]+D[2]];u.note='';u.moves++;beep(420,.05,'triangle',.05);
    if(u.pos[0]===d.goal[0]&&u.pos[1]===d.goal[1])return {ok:true};
    return {render:true};
  }
};

/* 12. Silbenrätsel */
const SILBEN=[['Ap|fel','Rundes Obst, das am Baum wächst.'],['Ba|na|ne','Gelbe, krumme Frucht.'],['Dra|che','Fabelwesen, das Feuer speit.'],['E|sel','Graues Tier mit langen Ohren, das „I-A“ ruft.'],['Fe|der','Davon hat ein Vogel ganz viele.'],['Gi|raf|fe','Tier mit einem sehr langen Hals.'],['Ha|se','Tier mit langen Ohren, das Möhren mag.'],['In|sel','Land, das ringsum von Wasser umgeben ist.'],['Ka|me|ra','Damit macht man Fotos.'],['Lö|we','Raubkatze mit einer großen Mähne.'],['Mu|schel','Schale am Strand, in der man das Meer rauschen hört.'],['Na|se','Damit riecht man.'],['O|ran|ge','Runde Frucht und gleichzeitig eine Farbe.'],['Pin|sel','Damit malt man mit Wasserfarben.'],['Ra|ke|te','Fliegt ins Weltall.'],['Son|ne','Stern, der uns am Tag Licht und Wärme gibt.'],['Ta|sche','Darin trägt man seine Sachen.'],['U|hu','Große Eule mit Federohren.'],['Va|se','Gefäß für Blumen.'],['Wol|ke','Schwebt am Himmel und bringt Regen.'],['Zi|tro|ne','Gelbe, sehr saure Frucht.'],['Bril|le','Hilft beim besseren Sehen.'],['Gi|tar|re','Musikinstrument mit sechs Saiten.'],['Ham|mer','Damit schlägt man Nägel in die Wand.'],['Ker|ze','Gibt Licht, wenn man ihren Docht anzündet.'],['Mo|tor','Treibt ein Auto an.'],['Pa|pa|gei','Bunter Vogel, der Wörter nachsprechen kann.'],['Re|gen|bo|gen','Bunter Bogen am Himmel nach dem Regen.'],['Schmet|ter|ling','Insekt mit großen bunten Flügeln.'],['Te|le|fon','Damit spricht man mit jemandem, der weit weg ist.'],['Ti|ger','Große Katze mit schwarzen Streifen.'],['Ei|mer','Gefäß, um Wasser zu tragen.'],['Ro|bo|ter','Maschine, die Arbeiten selbstständig erledigt.'],['Kom|pass','Seine Nadel zeigt immer nach Norden.'],['A|mei|se','Kleines Insekt, das in großen Völkern lebt.'],['E|le|fant','Großes graues Tier mit Rüssel.'],['Ig|lu','Haus aus Schnee und Eis.'],['O|fen','Darin backt man Kuchen.'],['Fahr|rad','Hat zwei Räder und Pedale.'],['Lu|pe','Damit sieht man kleine Dinge größer.'],['Wal|nuss','Harte Schale, darin steckt ein Kern, der wie ein Gehirn aussieht.'],['Bur|ger','Brötchen mit Fleisch- oder Gemüsescheibe.'],['Kro|ko|dil','Großes Reptil mit vielen Zähnen, lebt im Fluss.'],['Nu|deln','Werden in Wasser gekocht und mit Soße gegessen.'],['Pin|gu|in','Vogel, der nicht fliegen kann, aber toll schwimmt.'],['Ju|wel','Wertvoller, funkelnder Stein.'],['Kas|ta|nie','Braune Frucht im Herbst mit stacheliger Hülle.'],['Lö|ffel','Damit isst man Suppe.']];
function asc(c){return c.replace('Ä','A').replace('Ö','O').replace('Ü','U')}
PZ.syllables={name:'Das Silbenrätsel',atm:'side',
  gen(rnd,st){
    const K=st<=2?3:(st<=4?4:5),words=shuffled(SILBEN,rnd).slice(0,K).map(w=>({sy:w[0].split('|'),def:w[1],word:w[0].replace(/\|/g,'')}));
    const syl=[];words.forEach(w=>w.sy.forEach(x=>syl.push(x)));
    return {K,words,syl:shuffled(syl,rnd).map(x=>x.toUpperCase()),ans:words.map(w=>asc(w.word[0].toUpperCase())).join('')};
  },
  init(d){return wordInit(d.K)},
  role(r,d,u){
    if(r==='mechanic')return mechWord(u,'Deine Gruppe findet '+d.K+' Wörter. Die Anfangsbuchstaben der Wörter ergeben in der Reihenfolge der Beschreibungen das Kennwort. Du stellst es ein.','Kennwort prüfen');
    let h='';
    if(r==='decode')h+='<p class="lead">Du hast die Beschreibungen der gesuchten Wörter. Die Silben dazu haben die anderen.</p><ul class="list">'+d.words.map((w,i)=>'<li><span class="k">WORT '+(i+1)+'</span><span>'+esc(w.def)+' ('+w.sy.length+' Silben)</span></li>').join('')+'</ul>';
    const p=rolePieces(r,d.syl.length,['research','cartographer','radio','guard']);
    if(p.length)h+='<p class="lead">Das sind deine Silben. Setzt sie mit den Silben der anderen zu Wörtern zusammen.</p><div style="display:flex;flex-wrap:wrap;gap:8px;margin:8px 0">'+p.map(i=>'<span style="padding:8px 12px;border-radius:10px;background:var(--raise);border:1px solid var(--line);font-weight:800;letter-spacing:.06em">'+esc(d.syl[i])+'</span>').join('')+'</div>';
    return h||noPiece();
  },
  explain(d){return ['Gesucht sind '+d.K+' Wörter. Die Entschlüsseler/in hat zu jedem Wort eine Beschreibung.','Die Silben aller Wörter sind durcheinander auf die anderen verteilt. Setzt sie passend zusammen.','Die Anfangsbuchstaben der Wörter ergeben in der Reihenfolge der Beschreibungen das Kennwort. Die Mechaniker/in stellt es ein.']},
  hint(d,n){if(n===1)return 'Fangt mit der Beschreibung an, die ihr sofort erratet, und sucht dann die passenden Silben.';if(n===2)return 'Wort 1 ist „'+d.words[0].word+'“.';return 'Wort 1 ist „'+d.words[0].word+'“ und Wort 2 ist „'+d.words[1].word+'“.'},
  act(d,u,a){return wordSub(d.ans)(d,u,a)}
};

/* 13. Logikrätsel */
const LG_NAMES=['Mia','Ben','Lea','Tom'];
const LG_CATS=[
  {n:'Farbe',q:'Welche Lieblingsfarbe hat',it:['Rot','Blau','Grün','Gelb'],pos:(p,i)=>p+' mag am liebsten '+i+'.',neg:(p,i)=>p+' mag '+i+' nicht am liebsten.',subj:i=>'Wer am liebsten '+i+' mag',pp:i=>'mag am liebsten '+i,pn:i=>'mag '+i+' nicht am liebsten'},
  {n:'Tier',q:'Welches Haustier hat',it:['Katze','Hund','Hase','Pferd'],akk:['eine Katze','einen Hund','einen Hasen','ein Pferd'],nakk:['keine Katze','keinen Hund','keinen Hasen','kein Pferd'],pos:null,neg:null,subj:null,pp:null,pn:null},
  {n:'Hobby',q:'Welches Hobby hat',it:['Fußball','Malen','Lesen','Tanzen'],pos:(p,i)=>'Das Hobby von '+p+' ist '+i+'.',neg:(p,i)=>'Das Hobby von '+p+' ist nicht '+i+'.',subj:i=>'Wer als Hobby '+i+' hat',pp:i=>'hat als Hobby '+i,pn:i=>'hat nicht '+i+' als Hobby'}
];
(function(){const c=LG_CATS[1];c.pos=(p,i)=>p+' hat '+c.akk[c.it.indexOf(i)]+'.';c.neg=(p,i)=>p+' hat '+c.nakk[c.it.indexOf(i)]+'.';c.subj=i=>'Wer '+c.akk[c.it.indexOf(i)]+' hat';c.pp=i=>'hat '+c.akk[c.it.indexOf(i)];c.pn=i=>'hat '+c.nakk[c.it.indexOf(i)]})();
function permsOf(n){const out=[];(function rec(a,rest){if(!rest.length){out.push(a);return}for(let i=0;i<rest.length;i++)rec(a.concat(rest[i]),rest.slice(0,i).concat(rest.slice(i+1)))})([],Array.from({length:n},(_,i)=>i));return out}
PZ.logic={name:'Das Logikrätsel',atm:'meta',
  gen(rnd,st){
    const N=st<=2?3:4,C=st<=4?2:3,cats=shuffled([0,1,2],rnd).slice(0,C).sort(),names=shuffled(LG_NAMES,rnd).slice(0,N);
    const items=cats.map(c=>shuffled(LG_CATS[c].it,rnd).slice(0,N));
    const P=permsOf(N);let all=[[]];cats.forEach(()=>{const nx=[];all.forEach(a=>P.forEach(p=>nx.push(a.concat([p]))));all=nx});
    const sol=all[Math.floor(rnd()*all.length)];
    // sol[k][person]=Index des Gegenstands in Kategorie k
    const pool=[];
    for(let k=0;k<C;k++){const L=LG_CATS[cats[k]];
      for(let p=0;p<N;p++)for(let i=0;i<N;i++){
        if(sol[k][p]===i)pool.push({w:st<=2?3:1,t:L.pos(names[p],items[k][i]),f:a=>a[k][p]===i});
        else pool.push({w:3,t:L.neg(names[p],items[k][i]),f:a=>a[k][p]!==i});
      }
      for(let k2=0;k2<C;k2++){if(k2===k)continue;const L2=LG_CATS[cats[k2]];
        for(let i=0;i<N;i++)for(let j=0;j<N;j++){const pr=sol[k].indexOf(i),tr=sol[k2][pr]===j;
          pool.push({w:tr?2:2,t:L.subj(items[k][i])+', '+(tr?L2.pp(items[k2][j]):L2.pn(items[k2][j]))+'.',f:a=>{const q=a[k].indexOf(i);return tr?a[k2][q]===j:a[k2][q]!==j}});
        }}
    }
    let cand=all,used=[];const list=shuffled(pool,rnd);
    for(let g=0;g<40&&cand.length>1;g++){
      let best=null,bs=-1;
      list.forEach(cl=>{if(used.indexOf(cl)>=0)return;const nx=cand.filter(cl.f);if(nx.length===cand.length)return;const sc=(cand.length-nx.length)/cand.length*cl.w+(rnd()*.15);if(sc>bs){bs=sc;best={cl,nx}}});
      if(!best)break;used.push(best.cl);cand=best.nx;
    }
    const qk=Math.floor(rnd()*C),qp=Math.floor(rnd()*N);
    return {N,C,cats,names,items,sol,clues:shuffled(used.map(c=>c.t),rnd),qk,qp,ans:sol[qk][qp],uc:cand.length};
  },
  init(d){return {sel:null}},
  role(r,d,u){
    const L=LG_CATS[d.cats[d.qk]],Q='<p class="lead">Die Frage lautet: <b>'+L.q+' '+d.names[d.qp]+'?</b></p>';
    if(r==='mechanic')return Q+'<p>Deine Gruppe findet es mit ihren Hinweisen heraus. Wähle die Antwort und melde sie.</p><div class="keys" style="grid-template-columns:repeat(2,1fr)">'+d.items[d.qk].map((it,i)=>'<button class="key" data-act="xpick" data-i="'+i+'" aria-pressed="'+(u.sel===i)+'"'+(u.sel===i?' style="border-color:var(--lava)"':'')+'>'+esc(it)+'</button>').join('')+'</div><div><button class="btn primary" data-act="xsubsel"'+(u.sel==null?' disabled':'')+'>'+(u.sel==null?'Wähle eine Antwort':'„'+esc(d.items[d.qk][u.sel])+'“ melden')+'</button></div>'+fb();
    const p=rolePieces(r,d.clues.length,INFO),tab=r==='decode'?'<div class="hint">Personen: '+d.names.join(', ')+'. '+d.cats.map((c,k)=>LG_CATS[c].n+': '+d.items[k].join(', ')).join('. ')+'. Jede Person hat von jeder Sorte genau eins, und keine zwei Personen haben dasselbe.</div>':'';
    if(!p.length&&!tab)return Q+noPiece();
    return Q+(p.length?'<ul class="list">'+p.map(i=>'<li><span>'+esc(d.clues[i])+'</span></li>').join('')+'</ul>':'')+tab;
  },
  explain(d){return ['Es gibt '+d.N+' Personen: '+d.names.join(', ')+'. Jede hat '+d.cats.map(c=>'eine '+LG_CATS[c].n).join(' und ')+', und alles kommt nur einmal vor.','Die Hinweise sind auf euch verteilt. Malt eine Tabelle mit den Namen und setzt Kreuze (geht nicht) und Haken (stimmt).','Die Mechaniker/in meldet die Antwort auf die Frage.']},
  hint(d,n){const o=(d.qp+1)%d.N,L=LG_CATS[d.cats[0]];if(n===1)return 'Zeichnet eine Tabelle: Namen nach unten, Möglichkeiten nach rechts. Jeder Hinweis bringt ein Kreuz oder einen Haken.';if(n===2)return L.pos(d.names[o],d.items[0][d.sol[0][o]]);const w=d.items[d.qk].map((x,i)=>i).filter(i=>i!==d.ans);return 'Die Antwort ist nicht '+d.items[d.qk][w[0]]+' und nicht '+d.items[d.qk][w[1]]+'.'},
  act(d,u,a){if(a.op!=='sub'||typeof a.i!=='number')return null;return a.i===d.ans?{ok:true}:{wrong:'Das stimmt nicht.'}}
};

/* 14. Merkfolge */
PZ.memory={name:'Die Merkfolge',atm:'gate',
  COLS:[{n:'Rot',c:'#ff5468'},{n:'Blau',c:'#5aa0ff'},{n:'Grün',c:'#4be39a'},{n:'Gelb',c:'#ffd23c'},{n:'Lila',c:'#b57bff'},{n:'Weiß',c:'#f2f2f2'}],
  gen(rnd,st){const L=st<=2?5:(st<=4?7:9),seq=[];for(let i=0;i<L;i++){let c;do{c=Math.floor(rnd()*6)}while(seq.length&&c===seq[seq.length-1]);seq.push(c)}
    return {L,seq,map:shuffled([0,1,2,3,4,5],rnd),show:st<=2?8:(st<=4?6:5)}},
  init(d){return {inp:[]}},
  role(r,d,u){
    const C=PZ.memory.COLS;
    if(r==='mechanic')return '<p class="lead">Drücke die Zeichen in der richtigen Reihenfolge. Die Reihenfolge der Farben sieht nur die Forscher/in, und welches Zeichen zu welcher Farbe gehört, wissen die anderen. Eingegeben: '+u.inp.length+' von '+d.L+'.</p><div class="keys" style="grid-template-columns:repeat(3,1fr)">'+[0,1,2,3,4,5].map(s=>'<button class="key" data-act="xpress" data-i="'+s+'" aria-label="'+SHAPES[s]+'"><span style="display:inline-block;width:34px;height:34px">'+img(s).replace('<img ','<img style="width:34px;height:34px;object-fit:contain" ')+'</span></button>').join('')+'</div>'+fb();
    if(r==='research')return '<p class="lead">Du siehst eine Folge von '+d.L+' Farben, aber immer nur '+d.show+' Sekunden lang. Merkt sie euch gemeinsam: Wer sagt sie an, wer schreibt mit? Jedes Ansehen kostet keine Zeit, aber die Folge verschwindet wieder.</p><button class="btn primary" type="button" data-mfshow="'+d.show+'">Farbfolge zeigen</button><div class="mfseq" style="display:none;gap:6px;flex-wrap:wrap;margin:10px 0">'+d.seq.map((c,i)=>'<span style="width:40px;height:40px;border-radius:50%;display:grid;place-items:center;font-weight:800;color:#111;background:'+C[c].c+'">'+(i+1)+'</span>').join('')+'</div>';
    const p=rolePieces(r,6,['decode','cartographer','radio','guard']);if(!p.length)return noPiece();
    return '<p class="lead">Du kennst diese Zuordnungen von Farbe zu Zeichen:</p><ul class="list">'+p.map(i=>'<li><span class="k" style="color:'+C[i].c+'">'+C[i].n.toUpperCase()+'</span><span style="display:inline-block;width:30px;height:30px">'+img(d.map[i]).replace('<img ','<img style="width:30px;height:30px;object-fit:contain" ')+'</span><span>'+SHAPES[d.map[i]]+'</span></li>').join('')+'</ul>';
  },
  explain(d){return ['Die Forscher/in kann eine Folge von '+d.L+' Farben immer nur kurz ansehen. Merkt sie euch zusammen oder schreibt sie mit.','Welche Farbe zu welchem Zeichen gehört, ist auf die anderen verteilt.','Die Mechaniker/in drückt die Zeichen in der richtigen Reihenfolge. Ein falsches Zeichen setzt die Eingabe zurück.']},
  hint(d,n){const C=PZ.memory.COLS;if(n===1)return 'Teilt die Folge auf: Eine Person merkt sich die ersten Farben, eine andere den Rest.';if(n===2)return 'Die Folge beginnt mit '+C[d.seq[0]].n+'.';return 'Die Folge beginnt mit '+C[d.seq[0]].n+', '+C[d.seq[1]].n+', '+C[d.seq[2]].n+'.'},
  act(d,u,a){
    if(a.op!=='press'||typeof a.i!=='number'||a.i<0||a.i>5)return null;
    const want=d.map[d.seq[u.inp.length]];
    if(a.i!==want){u.inp=[];return {wrong:'Falsches Zeichen. Die Eingabe beginnt von vorn.'}}
    u.inp.push(a.i);beep(300+u.inp.length*40,.08,'triangle',.06);
    return u.inp.length===d.L?{ok:true}:{render:true};
  }
};
document.addEventListener('click',function(e){
  const b=e.target.closest&&e.target.closest('[data-mfshow]');if(!b)return;
  const el=b.parentNode.querySelector('.mfseq');if(!el)return;
  el.style.display='flex';b.disabled=true;let t=Number(b.dataset.mfshow);const lb=b.textContent;b.textContent='Noch '+t+' s';
  const iv=setInterval(()=>{t--;if(t<=0){clearInterval(iv);el.style.display='none';b.disabled=false;b.textContent=lb}else b.textContent='Noch '+t+' s'},1000);
});

/* 15. Buchstabengitter */
PZ.grid={name:'Das Buchstabengitter',atm:'crystal',
  gen(rnd,st){
    const N=st<=2?5:6,len=st<=2?5:(st<=4?6:7),word=pick(WORDS[len],rnd),cells=shuffled(Array.from({length:N*N},(_,i)=>i),rnd).slice(0,len);
    const g=Array.from({length:N*N},()=>ALPHA[Math.floor(rnd()*26)]);cells.forEach((c,i)=>{g[c]=word[i]});
    const ref=st>=3?Math.floor(rnd()*N*N):-1;
    return {N,word,cells,g,rel:st>=3};
  },
  init(d){return wordInit(d.word.length)},
  coord(d,c){return ALPHA[c%d.N]+(Math.floor(c/d.N)+1)},
  clue(d,i){
    const c=d.cells[i];
    if(!d.rel||i===0)return 'Buchstabe '+(i+1)+' steht im Feld '+PZ.grid.coord(d,c)+'.';
    const p=d.cells[i-1],dx=c%d.N-p%d.N,dy=Math.floor(c/d.N)-Math.floor(p/d.N),t=[];
    if(dx)t.push(Math.abs(dx)+' nach '+(dx>0?'rechts':'links'));if(dy)t.push(Math.abs(dy)+' nach '+(dy>0?'unten':'oben'));
    return 'Buchstabe '+(i+1)+': von Buchstabe '+i+' aus '+t.join(' und ')+'.';
  },
  role(r,d,u){
    if(r==='mechanic')return mechWord(u,'Du stellst das Wort ein, das im Buchstabengitter versteckt ist. Es hat '+d.word.length+' Buchstaben.');
    if(r==='research'){let t='<table class="map"><tr><th></th>'+Array.from({length:d.N},(_,i)=>'<th>'+ALPHA[i]+'</th>').join('')+'</tr>';
      for(let y=0;y<d.N;y++){t+='<tr><th>'+(y+1)+'</th>';for(let x=0;x<d.N;x++)t+='<td style="font-weight:800;font-size:18px">'+d.g[x+y*d.N]+'</td>';t+='</tr>'}
      return '<p class="lead">Du hast das Buchstabengitter. Welche Felder zum Wort gehören, wissen die anderen.</p>'+t+'</table>'}
    const p=rolePieces(r,d.word.length,['decode','cartographer','radio','guard']);if(!p.length)return noPiece();
    return '<p class="lead">Das sind deine Wegweiser durch das Gitter'+(d.rel?'. Sie bauen aufeinander auf, also braucht ihr die Reihenfolge':'')+'. Spalten sind Buchstaben, Zeilen sind Zahlen.</p><ul class="list">'+p.map(i=>'<li><span>'+esc(PZ.grid.clue(d,i))+'</span></li>').join('')+'</ul>';
  },
  explain(d){return ['In einem Gitter mit '+d.N+' mal '+d.N+' Buchstaben ist ein Wort mit '+d.word.length+' Buchstaben versteckt.','Die Forscher/in hat das Gitter. Die anderen wissen, in welchen Feldern die Buchstaben stehen'+(d.rel?', teils als Weg vom vorherigen Buchstaben aus':'')+'.','Lest die Buchstaben der Reihe nach ab. Die Mechaniker/in stellt das Wort ein.']},
  hint(d,n){if(n===1)return 'Geht die Hinweise genau in ihrer Reihenfolge durch und zeigt im Gitter mit dem Finger mit.';if(n===2)return 'Der erste Buchstabe ist '+d.word[0]+'.';return 'Die ersten beiden Buchstaben sind '+d.word.slice(0,2)+'.'},
  act(d,u,a){return wordSub(d.word)(d,u,a)}
};

/* ================= Neue Rätsel (Rätselfamilien) ================= */
const PNAMES=['Ada','Bo','Cem','Dana','Elif','Finn'];

/* 16. Wer lügt? (Logik) */
PZ.truth={name:'Wer lügt?',atm:'meta',
  gen(rnd,st){
    const N=st<=2?3:(st<=4?4:5),L=st<=4?1:2,names=shuffled(PNAMES,rnd).slice(0,N);
    for(let t=0;t<400;t++){
      const c=Math.floor(rnd()*N),stm=[];
      for(let s=0;s<N;s++){
        const opts=[];
        opts.push({t:'Ich war es nicht.',f:x=>x!==s});
        for(let o=0;o<N;o++){if(o===s)continue;opts.push({t:names[o]+' war es.',f:x=>x===o});opts.push({t:names[o]+' war es nicht.',f:x=>x!==o})}
        if(st>=3)for(let o=0;o<N;o++)for(let q=o+1;q<N;q++){if(o===s||q===s)continue;opts.push({t:'Es war '+names[o]+' oder '+names[q]+'.',f:x=>x===o||x===q})}
        stm.push(pick(opts,rnd));
      }
      const fits=[];for(let x=0;x<N;x++){const lies=stm.filter(z=>!z.f(x)).length;if(lies===L)fits.push(x)}
      if(fits.length===1&&fits[0]===c)return {N,L,names,c,stm:stm.map(z=>z.t)};
    }
    return {N:3,L:1,names:names.slice(0,3),c:1,stm:[names[1]+' war es.','Ich war es nicht.',names[1]+' war es nicht.']};
  },
  init(d){return {sel:null}},
  role(r,d,u){
    const Q='<p class="lead">Jemand hat den Schlüssel versteckt. Wer war es?</p>';
    if(r==='mechanic')return Q+'<p>Deine Gruppe kennt die Aussagen. Wähle die Person und melde sie.</p><div class="keys" style="grid-template-columns:repeat(3,1fr)">'+d.names.map((n,i)=>'<button class="key" data-act="xpick" data-i="'+i+'" aria-pressed="'+(u.sel===i)+'"'+(u.sel===i?' style="border-color:var(--lava)"':'')+'>'+esc(n)+'</button>').join('')+'</div><div><button class="btn primary" data-act="xsubsel"'+(u.sel==null?' disabled':'')+'>'+(u.sel==null?'Wähle eine Person':esc(d.names[u.sel])+' melden')+'</button></div>'+fb();
    const p=rolePieces(r,d.N,INFO),rule=r==='decode'?'<div class="hint">Die Regel: Genau <b>'+(d.L===1?'eine Person lügt':'zwei Personen lügen')+'</b>. Alle anderen sagen die Wahrheit. Nur eine Person war es.</div>':'';
    if(!p.length&&!rule)return Q+noPiece();
    return Q+(p.length?'<ul class="list">'+p.map(i=>'<li><span class="k">'+esc(d.names[i]).toUpperCase()+' SAGT</span><span>„'+esc(d.stm[i])+'“</span></li>').join('')+'</ul>':'')+rule;
  },
  explain(d){return ['Eine von '+d.N+' Personen hat den Schlüssel versteckt. Jede Person sagt einen Satz dazu.','Die Aussagen sind auf euch verteilt. Die Entschlüsseler/in kennt die Regel: '+(d.L===1?'Genau eine Person lügt.':'Genau zwei Personen lügen.'),'Probiert der Reihe nach: Wenn Person X es war, welche Sätze wären dann gelogen? Nur bei einer Person passt die Anzahl der Lügen.','Die Mechaniker/in meldet die Person.']},
  hint(d,n){const o=(d.c+1)%d.N;if(n===1)return 'Nehmt an, '+d.names[0]+' war es. Zählt, wie viele Sätze dann falsch wären. Macht das für jede Person.';if(n===2)return d.names[o]+' war es nicht.';return 'Es war weder '+d.names[o]+' noch '+d.names[(d.c+2)%d.N]+'.'},
  act(d,u,a){if(a.op!=='sub'||typeof a.i!=='number')return null;return a.i===d.c?{ok:true}:{wrong:'Das war die falsche Person.'}}
};

/* 17. Spurensuche (Logik): Ausschluss über Eigenschaften */
const SCOL=[{n:'rot',d:'roten',c:'#ff5468'},{n:'blau',d:'blauen',c:'#5aa0ff'},{n:'grün',d:'grünen',c:'#4be39a'},{n:'gelb',d:'gelben',c:'#ffd23c'},{n:'lila',d:'lila',c:'#b57bff'},{n:'orange',d:'orangen',c:'#ff9a3c'}];
PZ.suspects={name:'Die Spurensuche',atm:'side',
  gen(rnd,st){
    const n=st<=2?4:(st<=4?5:6),kinds=st<=2?['direct','color','edge']:(st<=4?['color','edge','parity','rel']:['rel','parity','edge']);
    let best=null;
    for(let t=0;t<300;t++){
      const cols=shuffled(SCOL,rnd).slice(0,n),nums=shuffled([1,2,3,4,5,6,7,8,9],rnd).slice(0,n);
      const it=cols.map((c,i)=>({pos:i,L:ALPHA[i],c,num:nums[i]})),S=it[Math.floor(rnd()*n)],pool=[];
      const add=(text,test,kind)=>{if(kinds.indexOf(kind)>=0&&test(S))pool.push({text,test})};
      const edge=q=>q.pos===0||q.pos===n-1;
      it.forEach(p=>{if(p===S)return;add('Kiste '+p.L+' ist leer.',q=>q!==p,'direct');add('Die gesuchte Kiste ist nicht '+p.c.n+'.',q=>q!==p,'color');
        if(Math.abs(p.pos-S.pos)===1)add('Die gesuchte Kiste steht direkt neben der '+p.c.d+' Kiste.',q=>Math.abs(q.pos-p.pos)===1,'rel');
        add('Die gesuchte Kiste steht '+(S.pos<p.pos?'links':'rechts')+' von der '+p.c.d+' Kiste.',q=>S.pos<p.pos?q.pos<p.pos:q.pos>p.pos,'rel');
        add('Die Zahl auf der gesuchten Kiste ist '+(S.num>p.num?'größer':'kleiner')+' als die auf der '+p.c.d+' Kiste.',q=>S.num>p.num?q.num>p.num:q.num<p.num,'rel')});
      add(edge(S)?'Die gesuchte Kiste steht ganz außen.':'Die gesuchte Kiste steht nicht ganz außen.',q=>edge(q)===edge(S),'edge');
      add('Die Zahl auf der gesuchten Kiste ist '+(S.num%2?'ungerade':'gerade')+'.',q=>q.num%2===S.num%2,'parity');
      let left=it.slice();const used=[];
      shuffled(pool,rnd).forEach(s=>{if(left.length<=1)return;const nl=left.filter(s.test);if(nl.length<left.length){used.push(s.text);left=nl}});
      if(left.length===1&&used.length>=3&&used.length<=7){best={n,it:it.map(q=>({L:q.L,c:q.c,num:q.num})),s:S.pos,clues:shuffled(used,rnd)};break}
    }
    return best||{n:4,it:[0,1,2,3].map(i=>({L:ALPHA[i],c:SCOL[i],num:i+2})),s:2,clues:['Kiste A ist leer.','Kiste B ist leer.','Kiste D ist leer.']};
  },
  init(d){return {sel:null}},
  row(d,u,pickable){return '<div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin:10px 0">'+d.it.map((q,i)=>{const s=u&&u.sel===i;const box='<span style="display:grid;place-items:center;width:52px;height:46px;border-radius:8px;background:'+q.c.c+';color:#111;font-weight:900;font-size:20px;box-shadow:inset 0 -6px 0 rgba(0,0,0,.25)">'+q.num+'</span><span style="font-weight:800">'+q.L+'</span>';
    return pickable?'<button class="key" data-act="xpick" data-i="'+i+'" aria-pressed="'+s+'" style="display:flex;flex-direction:column;align-items:center;gap:4px;padding:8px;'+(s?'border-color:var(--lava)':'')+'">'+box+'</button>':'<span style="display:flex;flex-direction:column;align-items:center;gap:4px">'+box+'</span>'}).join('')+'</div>'},
  role(r,d,u){
    const Q='<p class="lead">In genau einer der '+d.n+' Kisten liegt der Schlüssel. Welche ist es?</p>';
    if(r==='mechanic')return Q+PZ.suspects.row(d,u,true)+'<div><button class="btn primary" data-act="xsubsel"'+(u.sel==null?' disabled':'')+'>'+(u.sel==null?'Wähle eine Kiste':'Kiste '+d.it[u.sel].L+' öffnen')+'</button></div>'+fb();
    const p=rolePieces(r,d.clues.length,INFO);
    return Q+PZ.suspects.row(d,null,false)+(p.length?'<ul class="list">'+p.map(i=>'<li><span>'+esc(d.clues[i])+'</span></li>').join('')+'</ul>':noPiece());
  },
  explain(d){return ['In einer von '+d.n+' Kisten liegt der Schlüssel. Alle sehen die Kisten mit Farbe, Zahl und Buchstabe.','Die Hinweise sind auf euch verteilt. Jeder Hinweis streicht eine oder mehrere Kisten.','Streicht so lange, bis nur noch eine Kiste übrig ist. Die Mechaniker/in öffnet sie.']},
  hint(d,n){const o=(d.s+1)%d.n,o2=(d.s+2)%d.n;if(n===1)return 'Nehmt jeden Hinweis einzeln und streicht alle Kisten, die nicht dazu passen.';if(n===2)return 'Kiste '+d.it[o].L+' ist es nicht.';return 'Kiste '+d.it[o].L+' und Kiste '+d.it[o2].L+' sind es nicht.'},
  act(d,u,a){if(a.op!=='sub'||typeof a.i!=='number')return null;return a.i===d.s?{ok:true}:{wrong:'Diese Kiste ist leer.'}}
};

/* 18. Zahlenquadrat (Logik, Mini-Sudoku) */
function sdSolve(g,N,bw,bh,limit){let cnt=0,sol=null;const a=g.slice();
  (function rec(){if(cnt>=limit)return;const k=a.indexOf(0);if(k<0){cnt++;if(!sol)sol=a.slice();return}
    const x=k%N,y=(k/N)|0;for(let v=1;v<=N;v++){let ok=true;for(let i=0;i<N&&ok;i++){if(a[y*N+i]===v||a[i*N+x]===v)ok=false}
      const bx=x-x%bw,by=y-y%bh;for(let yy=by;yy<by+bh&&ok;yy++)for(let xx=bx;xx<bx+bw&&ok;xx++)if(a[yy*N+xx]===v)ok=false;
      if(ok){a[k]=v;rec();a[k]=0}}})();return {cnt,sol}}
PZ.sudoku={name:'Das Zahlenquadrat',atm:'crystal',
  gen(rnd,st){
    const N=st<=4?4:6,bw=N===4?2:3,bh=2;
    // gefülltes Quadrat: aus Muster + Zufallsumbenennung
    const base=[];for(let y=0;y<N;y++)for(let x=0;x<N;x++)base.push(((y%bh)*bw+((y/bh)|0)+x)%N+1);
    const map=shuffled(Array.from({length:N},(_,i)=>i+1),rnd);let full=base.map(v=>map[v-1]);
    const g=full.slice(),cells=shuffled(Array.from({length:N*N},(_,i)=>i),rnd),keep=st<=2?8:(st<=4?6:14);
    for(const c of cells){if(g.filter(Boolean).length<=keep)break;const v=g[c];g[c]=0;if(sdSolve(g,N,bw,bh,2).cnt!==1)g[c]=v}
    const row=Math.floor(rnd()*N);
    const givens=[];g.forEach((v,i)=>{if(v)givens.push(i)});
    // die gesuchte Zeile soll nicht schon vollständig bekannt sein
    return {N,bw,bh,full,g,row,givens:shuffled(givens,rnd)};
  },
  init(d){return {vals:new Array(d.N).fill(0),mods:new Array(d.N).fill(d.N),show:(i,v)=>String(v+1),labels:Array.from({length:d.N},(_,i)=>'Spalte '+ALPHA[i])}},
  view(d,mine){const N=d.N;let h='<table class="map" style="margin:8px auto"><tr><th></th>'+Array.from({length:N},(_,i)=>'<th>'+ALPHA[i]+'</th>').join('')+'</tr>';
    for(let y=0;y<N;y++){h+='<tr><th>'+(y+1)+'</th>';for(let x=0;x<N;x++){const c=y*N+x,k=mine.indexOf(c)>=0;
      h+='<td style="font-weight:800;font-size:18px;'+(x%d.bw===d.bw-1&&x<N-1?'border-right:3px solid var(--line);':'')+(y%d.bh===d.bh-1&&y<N-1?'border-bottom:3px solid var(--line);':'')+(y===d.row?'background:rgba(255,200,80,.12);':'')+'">'+(k?d.g[c]:'')+'</td>'}h+='</tr>'}
    return h+'</table>'},
  role(r,d,u){
    const Q='<p class="lead">Gesucht ist die komplette <b>Zeile '+(d.row+1)+'</b> des Zahlenquadrats.</p>';
    if(r==='mechanic')return Q+mechWord(u,'Du stellst die Zahlen der Zeile '+(d.row+1)+' von links nach rechts ein.','Zeile prüfen');
    const p=rolePieces(r,d.givens.length,INFO),mine=p.map(i=>d.givens[i]),rule=r==='decode'?'<div class="hint">Die Regel: In jeder Zeile, jeder Spalte und jedem dick umrandeten Kasten kommt jede Zahl von 1 bis '+d.N+' genau einmal vor.</div>':'';
    if(!p.length&&!rule)return Q+noPiece();
    return Q+'<p>Diese Felder kennst du. Die anderen kennen weitere. Tragt alles zusammen ein.</p>'+PZ.sudoku.view(d,mine)+rule;
  },
  explain(d){return ['Ein Zahlenquadrat mit '+d.N+' mal '+d.N+' Feldern. In jeder Zeile, jeder Spalte und jedem dick umrandeten Kasten steht jede Zahl von 1 bis '+d.N+' genau einmal.','Die bekannten Zahlen sind auf euch verteilt. Zeichnet das Quadrat auf und tragt sie zusammen ein.','Füllt die Lücken mit der Regel. Die Mechaniker/in stellt die gesuchte Zeile ein.']},
  hint(d,n){const N=d.N,r=d.row;if(n===1)return 'Sucht eine Zeile, Spalte oder einen Kasten, in dem nur noch ein Feld fehlt. Dort ist die Zahl klar.';if(n===2)return 'In Zeile '+(r+1)+', Spalte A steht '+d.full[r*N]+'.';return 'Zeile '+(r+1)+' beginnt mit '+d.full[r*N]+' '+d.full[r*N+1]+'.'},
  act(d,u,a){if(a.op!=='sub'||!nums(a.vals,d.N))return null;let ok=0;for(let i=0;i<d.N;i++)if(a.vals[i]+1===d.full[d.row*d.N+i])ok++;return ok===d.N?{ok:true}:{wrong:ok+' von '+d.N+' Zahlen stimmen.'}}
};

/* 19. Drehringe (Raum) */
const RSYM=['✦','☾','◆','✚','●','▲','★','◐'];
const RNAME=['äußere','mittlere','innere'];
function ringTop(d,k,r){const n=d.n;return d.rings[k][((n-(r%n))%n+n)%n]}
function ringSvg(d,u){const step=360/d.n,rad=[128,94,60],col=['#5fd4ff','#c49bff','#ffd85a'];
  return '<svg id="rsvg" viewBox="0 0 300 300" style="width:min(300px,80vw);height:auto;display:block;margin:6px auto"><circle cx="150" cy="150" r="24" fill="#c9a24a"/>'+rad.map((r,k)=>'<g style="transition:transform .45s cubic-bezier(.3,1.4,.5,1);transform-origin:150px 150px;transform:rotate('+(u.rot[k]*step)+'deg)"><circle cx="150" cy="150" r="'+r+'" fill="none" stroke="'+col[k]+'" stroke-opacity=".45" stroke-width="28"/>'+d.rings[k].map((s,i)=>{const a=(i*step-90)*Math.PI/180;return '<text x="'+(150+Math.cos(a)*r)+'" y="'+(150+Math.sin(a)*r)+'" style="transform-box:fill-box;transform-origin:center;transition:transform .45s;transform:rotate('+(-u.rot[k]*step)+'deg)" font-size="18" text-anchor="middle" dominant-baseline="central" fill="#fff">'+s+'</text>'}).join('')+'</g>').join('')+'<polygon points="138,0 162,0 150,16" fill="#fff"/></svg>'}
PZ.rings={name:'Die Drehringe',atm:'gate',
  gen(rnd,st){const n=st<=2?6:8,rings=[0,1,2].map(()=>shuffled(RSYM.slice(0,n),rnd)),tg=rings.map(r=>pick(r,rnd));
    const couple=st<=2?[[],[],[]]:(st<=4?[[],[[2,1]],[]]:[[[1,1]],[[2,-1]],[]]);
    let start;do{start=[0,1,2].map(()=>Math.floor(rnd()*n))}while([0,1,2].every(k=>rings[k][((n-start[k]%n)%n)]===tg[k]));
    return {n,rings,tg,couple,start}},
  init(d){return {rot:d.start.slice(),vals:d.start.slice(),n:d.n,couple:d.couple}},
  role(r,d,u){
    if(r==='mechanic'){window.__ru=u;window.__rd=d;return '<p class="lead">Du drehst die drei Ringe. Oben (▼) muss bei jedem Ring das richtige Zeichen stehen. Welches, weiß deine Gruppe.</p><div id="rwrap">'+ringSvg(d,u)+'</div><div class="keys" style="grid-template-columns:repeat(3,1fr)">'+RNAME.map((nm,k)=>'<button class="key" data-act="rrot" data-k="'+k+'">⟳ '+nm[0].toUpperCase()+nm.slice(1)+'r</button>').join('')+'</div><div><button class="btn primary" data-act="xsub">Ringe prüfen</button></div>'+fb()+'<p class="small">Ein Fehlversuch kostet '+penTry()+' Sekunden.</p>'}
    const n=3+(d.couple.some(c=>c.length)?1:0),p=rolePieces(r,n,INFO);if(!p.length)return noPiece();
    const note=d.couple[0].length?'Getriebeschaden: Dreht man den äußeren Ring, dreht sich der mittlere einen Schritt mit. Dreht man den mittleren, dreht sich der innere einen Schritt zurück.':'Getriebeschaden: Dreht man den mittleren Ring, dreht sich der innere einen Schritt mit.';
    return '<p class="lead">Das weißt du über die Drehringe:</p><ul class="list">'+p.map(i=>i<3?'<li><span class="k">'+(RNAME[i]+'r').toUpperCase()+' RING</span><span>muss oben <b style="font-size:22px">'+d.tg[i]+'</b> zeigen</span></li>':'<li><span>'+note+'</span></li>').join('')+'</ul>';
  },
  explain(d){return ['Drei Ringe mit Zeichen müssen so gedreht werden, dass oben bei jedem Ring das richtige Zeichen steht.','Welches Zeichen das ist, ist auf euch verteilt'+(d.couple.some(c=>c.length)?'. Achtung: Ein Hinweis verrät, dass sich manche Ringe gegenseitig mitdrehen':'')+'.','Die Mechaniker/in dreht und prüft.']},
  hint(d,n){if(n===1)return d.couple.some(c=>c.length)?'Stellt zuerst den Ring ein, der andere mitdreht. Den mitgedrehten Ring korrigiert ihr zum Schluss.':'Dreht jeden Ring einzeln, bis sein Zeichen unter dem Pfeil steht.';if(n===2)return 'Der äußere Ring muss oben '+d.tg[0]+' zeigen.';return 'Außen '+d.tg[0]+', in der Mitte '+d.tg[1]+'.'},
  act(d,u,a){if(a.op!=='sub'||!nums(a.vals,3))return null;let ok=0;for(let k=0;k<3;k++)if(ringTop(d,k,a.vals[k])===d.tg[k])ok++;return ok===3?{ok:true}:{wrong:ok+' von 3 Ringen stimmen.'}}
};
document.addEventListener('click',function(e){
  const b=e.target.closest&&e.target.closest('[data-act=rrot]');if(!b)return;const u=window.__ru,d=window.__rd;if(!u||!d)return;
  const k=Number(b.dataset.k);u.rot[k]++;(d.couple[k]||[]).forEach(c=>{u.rot[c[0]]+=c[1]});u.vals=u.rot.map(x=>((x%d.n)+d.n)%d.n);
  try{beep(300+k*120,.1,'triangle',.06)}catch(x){}
  const w=document.getElementById('rwrap');if(w){const svg=w.querySelector('svg');const tmp=document.createElement('div');tmp.innerHTML=ringSvg(d,u);const ns=tmp.firstChild;
    // sanft drehen: nur die transform-Werte übernehmen
    const g1=svg.querySelectorAll('g'),g2=ns.querySelectorAll('g');g1.forEach((g,i)=>{g.style.transform=g2[i].style.transform;const t1=g.querySelectorAll('text'),t2=g2[i].querySelectorAll('text');t1.forEach((t,j)=>{t.style.transform=t2[j].style.transform})})}
});

/* 20. Lichtstrahl (Raum) */
PZ.mirror={name:'Der Lichtstrahl',atm:'crystal',
  SIDES:['Oben','Rechts','Unten','Links'],
  run(d,ori){const N=d.N;let x=-1,y=d.entry,dx=1,dy=0,hits=0;for(let s=0;s<200;s++){x+=dx;y+=dy;if(x<0)return {side:3,pos:y,hits};if(x>=N)return {side:1,pos:y,hits};if(y<0)return {side:0,pos:x,hits};if(y>=N)return {side:2,pos:x,hits};
    const m=d.mir.indexOf(y*N+x);if(m>=0){hits++;if(ori[m]==='/'){const t=dx;dx=-dy;dy=-t}else{const t=dx;dx=dy;dy=t}}}return {side:1,pos:0,hits}},
  gen(rnd,st){const N=st<=2?4:(st<=4?5:6),M=st<=2?3:(st<=4?5:7),minH=st<=2?2:(st<=4?3:4);
    for(let t=0;t<500;t++){const mir=shuffled(Array.from({length:N*N},(_,i)=>i),rnd).slice(0,M),ori=mir.map(()=>rnd()<.5?'/':'\\'),entry=Math.floor(rnd()*N);
      const d={N,mir,ori,entry},res=PZ.mirror.run(d,ori);if(res.hits<minH)continue;
      // ohne die Ausrichtungen darf man es nicht raten können: mind. eine andere Ausrichtung ergibt einen anderen Ausgang
      d.ans=[res.side,res.pos];return d}
    return {N:4,mir:[1,5,9],ori:['\\','/','\\'],entry:0,ans:[2,1]}},
  init(d){return {vals:[0,0],mods:[4,d.N],show:(i,v)=>i===0?PZ.mirror.SIDES[v]:(v+1)+' ('+ALPHA[v]+')',labels:['Seite','Stelle']}},
  view(d,show){const N=d.N;let h='<table class="map" style="margin:8px auto"><tr><th></th>'+Array.from({length:N},(_,i)=>'<th>'+ALPHA[i]+'</th>').join('')+'</tr>';
    for(let y=0;y<N;y++){h+='<tr><th>'+(y===d.entry?'➤ ':'')+(y+1)+'</th>';for(let x=0;x<N;x++){const m=d.mir.indexOf(y*N+x);h+='<td style="font-size:22px;font-weight:900;color:#9ff3ff">'+(m>=0?(show?d.ori[m]:'◇'):'')+'</td>'}h+='</tr>'}
    return h+'</table>'},
  role(r,d,u){
    if(r==='mechanic')return mechWord(u,'Ein Lichtstrahl wird von links in Zeile '+(d.entry+1)+' in das Feld geschickt. Du gibst ein, wo er das Feld wieder verlässt: Seite und Stelle (Spalte bei oben/unten, Zeile bei links/rechts).','Ausgang melden');
    if(r==='research')return '<p class="lead">Du hast den Plan: Der Strahl kommt bei ➤ von links herein. In den Feldern mit ◇ stehen Spiegel. Wie sie schräg stehen, wissen die anderen.</p>'+PZ.mirror.view(d,false);
    const p=rolePieces(r,d.mir.length,['decode','cartographer','radio','guard']);if(!p.length)return noPiece();
    const rule=r==='decode'?'<div class="hint">So lenken die Spiegel: Bei / wird ein Strahl von links nach oben gelenkt, von unten nach rechts. Bei \\ wird ein Strahl von links nach unten gelenkt, von oben nach rechts. Ohne Spiegel geht er geradeaus.</div>':'';
    return '<p class="lead">Du weißt, wie einige Spiegel stehen:</p><ul class="list">'+p.map(i=>{const c=d.mir[i];return '<li><span class="k">FELD '+ALPHA[c%d.N]+((c/d.N|0)+1)+'</span><span style="font-size:22px;font-weight:900">'+d.ori[i]+'</span></li>'}).join('')+'</ul>'+rule;
  },
  explain(d){return ['Ein Lichtstrahl läuft durch ein Feld mit '+d.N+' mal '+d.N+' Kästchen und wird von Spiegeln umgelenkt.','Die Forscher/in hat den Plan mit den Spiegel-Feldern. Wie jeder Spiegel steht (/ oder \\), ist auf die anderen verteilt.','Verfolgt den Strahl Feld für Feld mit dem Finger. Die Mechaniker/in meldet, wo er herauskommt.']},
  hint(d,n){if(n===1)return 'Zeichnet den Plan ab und tragt die Spiegel ein. Dann Feld für Feld weiter, bei jedem Spiegel die Richtung ändern.';if(n===2)return 'Der Strahl verlässt das Feld '+(['oben','rechts','unten','links'][d.ans[0]])+'.';return 'Der Strahl kommt '+(['oben','rechts','unten','links'][d.ans[0]])+' bei Stelle '+(d.ans[1]+1)+' heraus.'},
  act(d,u,a){if(a.op!=='sub'||!nums(a.vals,2))return null;return a.vals[0]===d.ans[0]&&a.vals[1]===d.ans[1]?{ok:true}:{wrong:'Dort kommt der Strahl nicht heraus.'}}
};

/* 21. Musterbild beschreiben (Team & Sinne) */
PZ.describe={name:'Das Musterbild',atm:'side',
  gen(rnd,st){const W=st<=2?2:3,H=st<=2?2:(st<=4?3:4),cells=Array.from({length:W*H},()=>Math.floor(rnd()*SHAPES.length));return {W,H,cells}},
  init(d){return {vals:new Array(d.W*d.H).fill(0),mods:new Array(d.W*d.H).fill(SHAPES.length),show:(i,v)=>SHAPES[v],labels:Array.from({length:d.W*d.H},(_,i)=>ALPHA[i%d.W]+((i/d.W|0)+1))}},
  pic(d,mine){let h='<div style="display:grid;grid-template-columns:repeat('+d.W+',64px);gap:6px;justify-content:center;margin:10px 0">';
    d.cells.forEach((s,i)=>{const k=mine.indexOf(i)>=0;h+='<span style="width:64px;height:64px;border-radius:10px;border:1px solid var(--line);display:grid;place-items:center;background:'+(k?'var(--raise)':'transparent')+'">'+(k?img(s).replace('<img ','<img style="width:46px;height:46px;object-fit:contain" '):'<span style="opacity:.35">?</span>')+'</span>'});return h+'</div>'},
  role(r,d,u){
    if(r==='mechanic')return mechWord(u,'Deine Gruppe sieht ein Musterbild aus Zeichen. Du siehst es nicht! Lass es dir genau beschreiben und stelle jedes Feld ein (A1 ist oben links).','Bild prüfen');
    const p=rolePieces(r,d.cells.length,INFO);if(!p.length)return noPiece();
    return '<p class="lead">Du siehst einen Teil des Musterbilds. Beschreibe es der Mechaniker/in, ohne das iPad zu zeigen! Spalten sind Buchstaben, Zeilen sind Zahlen.</p>'+PZ.describe.pic(d,p);
  },
  explain(d){return ['Ein Musterbild aus '+(d.W*d.H)+' Zeichen muss nachgebaut werden. Nur die anderen sehen Teile davon, die Mechaniker/in sieht nichts.','Beschreibt eure Felder genau, zum Beispiel: „In A1 ist ein Stern.“ Zeigen gilt nicht!','Die Mechaniker/in stellt jedes Feld ein und prüft.']},
  hint(d,n){if(n===1)return 'Geht Feld für Feld vor: erst Spalte A von oben nach unten, dann B.';if(n===2)return 'In A1 ist '+SHAPES[d.cells[0]]+'.';return 'In A1 ist '+SHAPES[d.cells[0]]+', in B1 ist '+SHAPES[d.cells[1]]+'.'},
  act(d,u,a){if(a.op!=='sub'||!nums(a.vals,d.cells.length))return null;let ok=0;d.cells.forEach((s,i)=>{if(a.vals[i]===s)ok++});return ok===d.cells.length?{ok:true}:{wrong:ok+' von '+d.cells.length+' Feldern stimmen.'}}
};

/* 22. Tonfolge (Team & Sinne) */
const TFREQ=[262,330,392,494,587];
PZ.tones={name:'Die Tonfolge',atm:'gate',
  gen(rnd,st){const K=st<=2?3:(st<=4?4:5),L=st<=2?4:(st<=4?5:6),sy=shuffled([0,1,2,3,4,5],rnd).slice(0,K),fr=shuffled(TFREQ.slice(0,K),rnd);let seq;do{seq=Array.from({length:L},()=>Math.floor(rnd()*K))}while(new Set(seq).size<Math.min(K,3));return {K,L,sy,fr,seq}},
  init(d){return {inp:[]}},
  role(r,d,u){
    if(r==='mechanic')return '<p class="lead">Deine Gruppe hört eine Tonfolge mit '+d.L+' Tönen. Jeder Ton gehört zu einem Zeichen. Drücke die Zeichen in der richtigen Reihenfolge. Ein falsches Zeichen setzt die Eingabe zurück.</p><p class="small">Eingegeben: '+u.inp.length+' von '+d.L+'</p><div class="keys" style="grid-template-columns:repeat('+Math.min(d.K,3)+',1fr)">'+d.sy.map((s,i)=>'<button class="key" data-act="xpress" data-i="'+i+'" style="display:flex;flex-direction:column;align-items:center;gap:4px">'+img(s).replace('<img ','<img style="width:40px;height:40px;object-fit:contain" ')+'<span>'+SHAPES[s]+'</span></button>').join('')+'</div>'+fb();
    let h='';
    if(r==='research')h+='<p class="lead">Du hast die Tonfolge. Spielt sie ab und hört genau hin, so oft ihr wollt.</p><div><button class="btn primary" data-tplay="'+d.seq.map(i=>d.fr[i]).join(',')+'">▶ Tonfolge abspielen</button></div>';
    const p=rolePieces(r,d.K,['decode','cartographer','radio','guard']);
    if(p.length)h+='<p class="lead">Das sind deine Vergleichstöne. Spielt sie ab und vergleicht sie mit der Tonfolge.</p><div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center">'+p.map(i=>'<button class="btn" data-tone="'+d.fr[i]+'" style="display:flex;align-items:center;gap:8px">'+img(d.sy[i]).replace('<img ','<img style="width:32px;height:32px;object-fit:contain" ')+' '+SHAPES[d.sy[i]]+' ♪</button>').join('')+'</div>';
    return h||noPiece();
  },
  explain(d){return ['Eine Tonfolge aus '+d.L+' Tönen öffnet das Schloss. Die Forscher/in kann sie abspielen.','Jeder Ton gehört zu einem Zeichen. Die Vergleichstöne mit den Zeichen sind auf die anderen verteilt.','Hört genau hin und vergleicht. Tipp: Hoch oder tief? Die Mechaniker/in drückt die Zeichen in der richtigen Reihenfolge.']},
  hint(d,n){if(n===1)return 'Spielt alle Vergleichstöne nacheinander ab und ordnet sie von tief nach hoch.';if(n===2)return 'Der erste Ton ist '+SHAPES[d.sy[d.seq[0]]]+'.';return 'Die Folge beginnt mit '+SHAPES[d.sy[d.seq[0]]]+', '+SHAPES[d.sy[d.seq[1]]]+'.'},
  act(d,u,a){if(a.op!=='press'||typeof a.i!=='number'||a.i<0||a.i>=d.K)return null;
    if(a.i!==d.seq[u.inp.length]){u.inp=[];return {wrong:'Falsches Zeichen. Die Eingabe beginnt von vorn.'}}
    u.inp.push(a.i);try{beep(d.fr[a.i],.18,'sine',.08)}catch(x){}return u.inp.length===d.L?{ok:true}:{render:true}}
};
document.addEventListener('click',function(e){
  const t=e.target.closest&&e.target.closest('[data-tone],[data-tplay]');if(!t)return;
  if(t.dataset.tone){try{beep(Number(t.dataset.tone),.6,'sine',.12)}catch(x){}return}
  const fs=t.dataset.tplay.split(',').map(Number);t.disabled=true;fs.forEach((f,i)=>setTimeout(()=>{try{beep(f,.45,'sine',.12)}catch(x){}},i*650));setTimeout(()=>{t.disabled=false},fs.length*650+200);
});

/* 23. Suchbild (Team & Sinne) */
const SB_COL=[{n:'rote',c:'#ff5468'},{n:'blaue',c:'#5aa0ff'},{n:'grüne',c:'#4be39a'},{n:'gelbe',c:'#ffd23c'}];
const SB_FORM=[{n:'Kreise',p:'c'},{n:'Dreiecke',p:'t'},{n:'Quadrate',p:'s'},{n:'Sterne',p:'x'}];
function sbShape(o){const x=o.x,y=o.y,r=o.r,c=o.c;
  if(o.f==='c')return '<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="'+c+'"/>';
  if(o.f==='s')return '<rect x="'+(x-r)+'" y="'+(y-r)+'" width="'+2*r+'" height="'+2*r+'" fill="'+c+'" transform="rotate('+o.a+' '+x+' '+y+')"/>';
  if(o.f==='t')return '<polygon points="'+x+','+(y-r)+' '+(x+r)+','+(y+r*.8)+' '+(x-r)+','+(y+r*.8)+'" fill="'+c+'" transform="rotate('+o.a+' '+x+' '+y+')"/>';
  let p='';for(let i=0;i<10;i++){const a=Math.PI/5*i-Math.PI/2,rr=i%2?r*.45:r;p+=(x+Math.cos(a)*rr).toFixed(1)+','+(y+Math.sin(a)*rr).toFixed(1)+' '}return '<polygon points="'+p+'" fill="'+c+'"/>'}
PZ.spot={name:'Das Suchbild',atm:'side',
  gen(rnd,st){const Q=st<=2?3:4,tot=st<=2?26:(st<=4?40:55),objs=[],G=st<=2?6:8;const cells=shuffled(Array.from({length:G*G},(_,i)=>i),rnd).slice(0,tot);
    cells.forEach(c=>{objs.push({x:(c%G+.5)*(400/G)+(rnd()-.5)*18,y:((c/G|0)+.5)*(300/G)+(rnd()-.5)*14,r:st<=2?13:10,a:Math.floor(rnd()*60),ci:Math.floor(rnd()*4),fi:Math.floor(rnd()*4)})});
    const qs=[],seen={};
    for(let t=0;t<60&&qs.length<Q;t++){const ci=Math.floor(rnd()*4),fi=Math.floor(rnd()*4),k=ci+'-'+fi;if(seen[k])continue;
      const n=objs.filter(o=>o.ci===ci&&o.fi===fi).length;if(n<1||n>9)continue;seen[k]=1;qs.push({t:'Wie viele '+SB_COL[ci].n+' '+SB_FORM[fi].n+'?',n})}
    while(qs.length<Q){const fi=qs.length%4,n=Math.min(9,objs.filter(o=>o.fi===fi&&o.ci===0).length);qs.push({t:'Wie viele '+SB_COL[0].n+' '+SB_FORM[fi].n+'?',n})}
    return {objs:objs.map(o=>({x:+o.x.toFixed(1),y:+o.y.toFixed(1),r:o.r,a:o.a,c:SB_COL[o.ci].c,f:SB_FORM[o.fi].p})),qs,secs:st<=2?25:(st<=4?20:15)}},
  init(d){return {vals:new Array(d.qs.length).fill(0),mods:new Array(d.qs.length).fill(10),show:(i,v)=>String(v),labels:d.qs.map((q,i)=>'Frage '+(i+1))}},
  pic(d){return '<svg viewBox="0 0 400 300" style="width:100%;max-width:520px;display:block;margin:0 auto;background:rgba(255,255,255,.05);border-radius:12px">'+d.objs.map(sbShape).join('')+'</svg>'},
  role(r,d,u){
    if(r==='mechanic')return mechWord(u,'Deine Gruppe zählt im Suchbild und beantwortet '+d.qs.length+' Fragen. Jede Antwort ist eine Ziffer. Stelle sie in der Reihenfolge der Fragen ein.','Antworten prüfen');
    const p=rolePieces(r,d.qs.length,INFO);
    return '<p class="lead">Das Suchbild erscheint nur <b>'+d.secs+' Sekunden</b> lang, ihr könnt es aber mehrmals öffnen. Teilt euch das Zählen auf!</p><div style="text-align:center"><button class="btn primary" data-sbshow="'+d.secs+'">Suchbild zeigen</button><div class="sbpic" style="display:none;margin-top:8px">'+PZ.spot.pic(d)+'</div></div>'
      +(p.length?'<ul class="list">'+p.map(i=>'<li><span class="k">FRAGE '+(i+1)+'</span><span>'+esc(d.qs[i].t)+'</span></li>').join('')+'</ul>':'');
  },
  explain(d){return ['Im Suchbild sind viele bunte Formen. Es erscheint nur kurz, kann aber wieder geöffnet werden.','Die '+d.qs.length+' Fragen sind auf euch verteilt. Jede Antwort ist eine Zahl von 0 bis 9.','Teilt das Zählen auf (z. B. eine Person zählt links, eine rechts). Die Mechaniker/in stellt die Antworten in der Reihenfolge der Fragen ein.']},
  hint(d,n){if(n===1)return 'Teilt das Bild in Hälften auf und zählt jede Hälfte getrennt.';if(n===2)return 'Antwort auf Frage 1: '+d.qs[0].n+'.';return 'Frage 1: '+d.qs[0].n+', Frage 2: '+d.qs[1].n+'.'},
  act(d,u,a){if(a.op!=='sub'||!nums(a.vals,d.qs.length))return null;let ok=0;d.qs.forEach((q,i)=>{if(a.vals[i]===q.n)ok++});return ok===d.qs.length?{ok:true}:{wrong:ok+' von '+d.qs.length+' Antworten stimmen.'}}
};
document.addEventListener('click',function(e){
  const b=e.target.closest&&e.target.closest('[data-sbshow]');if(!b)return;const el=b.parentNode.querySelector('.sbpic');if(!el)return;
  el.style.display='block';b.disabled=true;let t=Number(b.dataset.sbshow);const lb=b.textContent;b.textContent='Noch '+t+' s';
  const iv=setInterval(()=>{t--;if(t<=0){clearInterval(iv);el.style.display='none';b.disabled=false;b.textContent=lb}else b.textContent='Noch '+t+' s'},1000);
});

/* ================= Rätselfamilien =================
   Jeder Escape Room gehört zu einer Familie und zieht seine Rätsel vor allem daraus.
   Zahlen & Codes: Vulkan, Der Schwarm · Logik & Detektiv: Bibliothek, Eiswelt
   Sehen & Raum: Wrack, Azaroth (Drachenhöhle) · Team & Sinne: Finlorién, neuer Raum */
const FAMILIES={
  zahlen:['symbols','pyramid','sequence','lock','scales','cipher'],
  logik:['logic','wires','switches','truth','suspects','sudoku'],
  raum:['map','maze','grid','rings','mirror'],
  team:['morse','memory','syllables','describe','tones','spot']
};

function px(id){return typeof id==='string'&&id.indexOf('x:')===0?id.slice(2):null}
function expandOrder(tpl,seed,fam){
  const R=rngFor(seed,500);
  if(!fam||!FAMILIES[fam]){const types=shuffled(Object.keys(PZ),R);let k=0;return tpl.map(id=>id==='X'?'x:'+types[(k++)%types.length]:id)}
  /* etwa drei Viertel aus der eigenen Familie, jedes vierte Rätsel als Abwechslung aus einer anderen Familie */
  const own=shuffled(FAMILIES[fam].filter(t=>PZ[t]),R),other=shuffled(Object.keys(PZ).filter(t=>own.indexOf(t)<0),rngFor(seed,600+Object.keys(FAMILIES).indexOf(fam)*37));
  let k=0,a=0,b=0,last='';
  return tpl.map(id=>{if(id!=='X')return id;let t;
    if(k%4===3)t=other[(b++)%other.length];else{t=own[(a++)%own.length];if(t===last&&own.length>1)t=own[(a++)%own.length]}
    k++;last=t;return 'x:'+t});
}
return {PZ:PZ,px:px,expandOrder:expandOrder,morseHtml:morseHtml,alphaStrip:alphaStrip,FAMILIES:FAMILIES};
};
})(window);
