/* FRS Escape Room: Die Woodlands (2D, Draufsicht). Nutzt FRSNet (net.js) und FRSPool (pool.js). */
(function(){
'use strict';
const $=s=>document.querySelector(s);
const QS=new URLSearchParams(location.search),DEV=QS.has('dev');
let PEN_TRY=15,PEN_HINT=30;
const BONUS=30;
const STAGES=[null,{pt:10,ph:20,tm:1.2},{pt:12,ph:25,tm:1.1},{pt:15,ph:30,tm:1.0},{pt:18,ph:35,tm:1.0},{pt:20,ph:40,tm:.95},{pt:22,ph:45,tm:.9}];
const DIFFS=[{id:1,label:'Einfach',stage:1,info:'Mehr Zeit, kürzere Rätsel, kleine Strafen.'},{id:2,label:'Normal',stage:3,info:'Die Standardstufe für eine gute Gruppe.'},{id:3,label:'Schwer',stage:5,info:'Längere Rätsel, weniger Zeit, härtere Strafen.'},{id:4,label:'Sehr schwer',stage:6,info:'Die größte Herausforderung, knappe Zeit.'}];
function stageFor(d){const x=DIFFS.find(q=>q.id===(d|0));return x?x.stage:3}
function applyStage(st){PEN_TRY=STAGES[st].pt;PEN_HINT=STAGES[st].ph}
const D0=(function(){const d=parseInt(QS.get('d'),10);return(d>=1&&d<=4)?d:2})();
const SHAPES=['Kreis','Dreieck','Quadrat','Raute','Kreuz','Stern'];
const ROLE_NAME={research:'Forscher/in',decode:'Entschlüsseler/in',mechanic:'Mechaniker/in',guard:'Wächter/in',cartographer:'Kartograf/in',radio:'Funker/in'};
const ROLE_SHORT={research:'Forscher',decode:'Entschlüsseler',mechanic:'Mechaniker',guard:'Wächter',cartographer:'Kartograf',radio:'Funker'};
const ROLE_SETS={
  1:[['research','decode','mechanic','guard']],
  2:[['mechanic','guard'],['research','decode']],
  3:[['research'],['decode','guard'],['mechanic']],
  4:[['research'],['decode'],['mechanic'],['guard']],
  5:[['research'],['decode'],['mechanic'],['guard'],['cartographer']],
  6:[['research'],['decode'],['mechanic'],['guard'],['cartographer'],['radio']]
};
const MODES={
  short:{label:'Kurz',min:35,n:6,info:'6 Runensteine und der Weltenbaum, etwa 35 Minuten.'},
  long:{label:'Lang',min:70,n:10,info:'10 Runensteine und der Weltenbaum, etwa 70 Minuten (Doppelstunde).'},
  test:{label:'Schnelltest',min:12,n:3,info:'3 Runensteine mit nur 12 Minuten, zum Ausprobieren.'}
};
const PCOL=['green','blue','red','yellow','purple','orange'];
const PHEX=['#59d36f','#5aa0ff','#ff6a6a','#ffd23f','#b57bff','#ff9a3c'];

/* ---------- Helfer ---------- */
function mulberry(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function rngFor(seed,k){return mulberry(((seed>>>0)+k*7919)>>>0)}
function shuffled(arr,rnd){const a=arr.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(rnd()*(i+1));const t=a[i];a[i]=a[j];a[j]=t}return a}
function esc(s){return String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}
function fmt(s){s=Math.max(0,Math.ceil(s));return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')}
function nums(a,n){return Array.isArray(a)&&a.length===n&&a.every(x=>typeof x==='number'&&isFinite(x))}
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const lerp=(a,b,t)=>a+(b-a)*t;

const G={phase:'lobby',solo:false,spectator:false,epoch:0,seed:0,total:480,deadline:0,endRemaining:0,mode:'short',order:[],ci:0,cur:'',data:{},P:1,me:0,sets:ROLE_SETS[1],roster:[],roles:[],tab:null,chHints:0,hintsTotal:0,attempts:0,pu:null,feedback:'',fbBad:false,found:[],stage:3,hostPeer:null,locked:false,world:null,modal:false};
const RM={named:null,offs:[],count:0,mode:'short',d:D0};
function remaining(){return G.phase==='play'?Math.max(0,(G.deadline-performance.now())/1000):G.endRemaining}
function progress(){return G.phase==='play'?clamp(1-remaining()/G.total,0,1):(G.phase==='lost'?1:0)}
function existing(list){return list.filter(r=>G.sets.some(s=>s.indexOf(r)>=0))}
function rolePieces(r,n,list){
  const ex=existing(list),k=ex.indexOf(r);
  if(k<0)return [];
  const per=Math.ceil(n/ex.length),out=[];
  for(let i=k*per;i<Math.min(n,(k+1)*per);i++)out.push(i);
  return out;
}
const toastEl=$('#toast');let toastT=0;
function toast(msg,ms){toastEl.textContent=msg;toastEl.classList.add('show');clearTimeout(toastT);toastT=setTimeout(()=>toastEl.classList.remove('show'),ms||3200)}

/* ---------- Symbole als Bilder (für die Rätsel) ---------- */
function drawShape(ctx,i,s,col){
  const c=s/2,r=s*.36;ctx.fillStyle=col;ctx.beginPath();
  if(i===0){ctx.arc(c,c,r,0,6.2832)}
  else if(i===1){ctx.moveTo(c,c-r);ctx.lineTo(c+r*1.05,c+r*.8);ctx.lineTo(c-r*1.05,c+r*.8);ctx.closePath()}
  else if(i===2){ctx.rect(c-r*.85,c-r*.85,r*1.7,r*1.7)}
  else if(i===3){ctx.moveTo(c,c-r*1.1);ctx.lineTo(c+r*.8,c);ctx.lineTo(c,c+r*1.1);ctx.lineTo(c-r*.8,c);ctx.closePath()}
  else if(i===4){const a=r*.32;ctx.moveTo(c-a,c-r);ctx.lineTo(c+a,c-r);ctx.lineTo(c+a,c-a);ctx.lineTo(c+r,c-a);ctx.lineTo(c+r,c+a);ctx.lineTo(c+a,c+a);ctx.lineTo(c+a,c+r);ctx.lineTo(c-a,c+r);ctx.lineTo(c-a,c+a);ctx.lineTo(c-r,c+a);ctx.lineTo(c-r,c-a);ctx.lineTo(c-a,c-a);ctx.closePath()}
  else{for(let k=0;k<10;k++){const rr=k%2?r*.45:r*1.05,a=-Math.PI/2+k*Math.PI/5;if(k)ctx.lineTo(c+Math.cos(a)*rr,c+Math.sin(a)*rr);else ctx.moveTo(c+Math.cos(a)*rr,c+Math.sin(a)*rr)}ctx.closePath()}
  ctx.fill();
}
const SHURL=[];
function shapeURL(i){
  if(SHURL[i])return SHURL[i];
  const c=document.createElement('canvas');c.width=c.height=96;
  drawShape(c.getContext('2d'),i,96,'#d8ffe9');
  return SHURL[i]=c.toDataURL('image/png');
}
function img(i){return '<img alt="" src="'+shapeURL(i)+'">'}

/* ---------- Ton ---------- */
const AU={ctx:null,on:false};
function initAudio(){
  if(AU.ctx){if(AU.ctx.resume)AU.ctx.resume();return}
  try{const C=window.AudioContext||window.webkitAudioContext;if(C)AU.ctx=new C()}catch(e){}
}
function beep(f,d,type,v){
  if(!AU.ctx||!AU.on)return;
  try{
    const o=AU.ctx.createOscillator(),g=AU.ctx.createGain(),t=AU.ctx.currentTime;
    o.type=type||'sine';o.frequency.value=f;
    g.gain.setValueAtTime(v||.12,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);
    o.connect(g);g.connect(AU.ctx.destination);o.start(t);o.stop(t+d+.02);
  }catch(e){}
}
$('#snd').addEventListener('click',()=>{
  initAudio();AU.on=!AU.on;
  $('#snd').textContent=AU.on?'Ton an':'Ton aus';$('#snd').setAttribute('aria-pressed',String(AU.on));
  if(AU.on)beep(440,.2,'sine');
});

/* ---------- Rätsel-Pool ---------- */
function fb(){return '<p class="fb'+(G.fbBad?' bad':'')+'" id="fb" aria-live="polite">'+esc(G.feedback)+'</p>'}
const POOL=FRSPool({esc:esc,rolePieces:rolePieces,existing:existing,fb:fb,img:img,SHAPES:SHAPES,shuffled:shuffled,rngFor:rngFor,beep:beep,nums:nums,penTry:()=>PEN_TRY});
const PZ=POOL.PZ,px=POOL.px,expandOrder=POOL.expandOrder;

/* ---------- Bilder ---------- */
const ASSET='woodlands/assets/';
const IM={ground:null,players:{},obj:{},big:{},int:{}};
const INTN='rune_off rune_on plate_off plate_on gate_closed gate_open'.split(' ');
const BIGN='oak round spruce dead stumphouse hut treehouse cottage worldtree_dead worldtree_alive arch'.split(' ');
const HOUSES=['cottage','treehouse','hut','stumphouse'],HOUSE_W={cottage:2.1,treehouse:2.7,hut:2.1,stumphouse:2.5};
const OBJN='bush berrybush rock mossrock stump log fern mushblue mushviolet flowers grass reeds sign lamp fenceh fencev fencecorner barrel crate firering campfire statue bench post'.split(' ');
function loadImg(src){return new Promise(res=>{const i=new Image();i.onload=()=>res(i);i.onerror=()=>res(null);i.src=src})}
let TILE=[];            /* 24 Bodenkacheln auf 64x64 verkleinert */
const TILE_FALL=['#2d6a3f','#1b3a4e','#2f7a45','#4a6a2f','#3a2a1a','#3f8a2f','#8a5a32','#8a5a32','#6a6a80','#5a7a50','#8a5a2a','#8a5a2a','#1c4a8a','#1c4a8a','#0a1a3a','#2a3a22','#8a5a3a','#3a3a4a','#6a6a80','#5a7a50','#8a5a2a','#8a5a2a','#cdb583','#2a4a5a'];
function buildTiles(){
  TILE=[];
  for(let i=0;i<24;i++){
    const c=document.createElement('canvas');c.width=c.height=64;const g=c.getContext('2d');
    if(IM.ground){
      const cx=(i%6)*256,cy=Math.floor(i/6)*256,m=10;
      g.imageSmoothingEnabled=true;g.imageSmoothingQuality='high';
      g.drawImage(IM.ground,cx+m,cy+m,256-2*m,256-2*m,0,0,64,64);
    }else{g.fillStyle=TILE_FALL[i];g.fillRect(0,0,64,64)}
    TILE.push(c);
  }
}
let ASSETS_READY=false;
const assetsP=(async()=>{
  IM.ground=await loadImg(ASSET+'tiles_ground.png');
  await Promise.all(PCOL.map(async c=>{IM.players[c]=await loadImg(ASSET+'player_'+c+'.png')}));
  await Promise.all(OBJN.map(async n=>{IM.obj[n]=await loadImg(ASSET+'obj_'+n+'.png')}));
  await Promise.all(BIGN.map(async n=>{IM.big[n]=await loadImg(ASSET+'big_'+n+'.png')}));
  await Promise.all(INTN.map(async n=>{IM.int[n]=await loadImg(ASSET+'int_'+n+'.png')}));
  buildTiles();buildSprites();ASSETS_READY=true;
})();

/* ---------- Platzhalter-Sprites (werden später durch echte Grafik ersetzt) ---------- */
const SPR={};
function mk(w,h,fn){const c=document.createElement('canvas');c.width=w;c.height=h;fn(c.getContext('2d'));return c}
function circ(g,x,y,r,col){g.fillStyle=col;g.beginPath();g.arc(x,y,r,0,6.2832);g.fill()}
function buildSprites(){
  const pal=[['#1c5a45','#2a8a5f','#4fc08a'],['#1d4f6b','#2a7090','#55aac4'],['#3c3c46','#5a5a64','#7c7c86']];
  SPR.tree=pal.map((p,v)=>mk(64,112,g=>{
    g.fillStyle='#3a2416';g.fillRect(26,66,12,44);g.fillStyle='#5a3a22';g.fillRect(26,66,5,44);
    if(v===2){g.strokeStyle='#4a4a54';g.lineWidth=4;g.beginPath();g.moveTo(32,70);g.lineTo(32,30);g.moveTo(32,56);g.lineTo(14,36);g.moveTo(32,48);g.lineTo(52,26);g.moveTo(32,40);g.lineTo(20,14);g.stroke();circ(g,32,32,14,p[0]);circ(g,26,28,8,p[1]);return}
    circ(g,32,60,24,p[0]);circ(g,18,50,18,p[0]);circ(g,46,50,18,p[0]);circ(g,32,32,24,p[1]);circ(g,22,40,14,p[1]);circ(g,42,40,14,p[1]);
    circ(g,26,26,12,p[2]);circ(g,20,38,7,p[2]);
  }));
  SPR.bush=mk(64,64,g=>{circ(g,32,44,18,'#1c5a45');circ(g,20,46,12,'#1c5a45');circ(g,44,46,12,'#1c5a45');circ(g,30,38,12,'#2a8a5f');circ(g,24,36,6,'#4fc08a')});
  SPR.rock=mk(64,64,g=>{g.fillStyle='#4a5260';g.beginPath();g.ellipse(32,46,22,14,0,0,6.2832);g.fill();g.fillStyle='#7a8494';g.beginPath();g.ellipse(26,40,12,7,0,0,6.2832);g.fill();g.fillStyle='#2d4a2d';g.fillRect(40,46,10,4)});
  SPR.stump=mk(64,64,g=>{g.fillStyle='#3a2416';g.fillRect(16,30,32,26);g.fillStyle='#6a4a2a';g.beginPath();g.ellipse(32,30,16,8,0,0,6.2832);g.fill();g.strokeStyle='#4a2e1a';g.lineWidth=2;g.beginPath();g.ellipse(32,30,9,4,0,0,6.2832);g.stroke()});
  SPR.mush=mk(64,64,g=>{g.fillStyle='#e8f0e0';g.fillRect(29,40,6,14);circ(g,32,38,13,'#7a5cff');circ(g,27,34,3,'#d8ccff');circ(g,38,40,2.5,'#d8ccff')});
}

/* ---------- Welt ---------- */
const CW=14,CH=12,RW=9,RH=7;
const OBST=['bush','berrybush','rock','mossrock','stump','log','mushblue','mushviolet','barrel','crate','bench','statue','bush','rock'];
const OBJ_W={bush:1,berrybush:1,rock:1,mossrock:1,stump:1,log:1.1,mushblue:1,mushviolet:1,barrel:.85,crate:.9,bench:1.1,statue:1,campfire:1,lamp:.9,firering:1,fern:1,flowers:.9,grass:.9,reeds:.9,sign:.9,post:.9};
function buildWorld(seed,M,P){
  const rnd=rngFor(seed,900);
  const cols=Math.min(4,M),rows=Math.ceil(M/cols),W=cols*CW,H=rows*CH;
  const block=new Uint8Array(W*H).fill(1),forest=new Uint8Array(W*H).fill(1),ground=new Uint8Array(W*H).fill(1);
  const clear=[],gates=[],objs=[],plates=[],wisps=[];
  const idx=(x,y)=>y*W+x;
  for(let k=0;k<M;k++){
    const row=Math.floor(k/cols);let c=k%cols;if(row%2)c=cols-1-c;
    const x0=c*CW+((CW-RW)>>1),y0=row*CH+((CH-RH)>>1);
    clear.push({k:k,x:x0,y:y0,w:RW,h:RH,cx:x0+(RW>>1),cy:y0+(RH>>1)});
  }
  function pickGround(k,wr){
    const w=M>1?k/(M-1):0,r=wr();
    if(r<w*.55)return wr()<(k===M-1?.55:.2)?17:16;
    if(w>.5&&r<w*.8)return 4;
    const q=wr();if(q<.5)return 0;if(q<.68)return 2;if(q<.84)return 3;if(q<.92)return 5;return 1;
  }
  function openTile(x,y,g){const i=idx(x,y);block[i]=0;forest[i]=0;ground[i]=g}
  clear.forEach(r=>{
    for(let y=r.y;y<r.y+r.h;y++)for(let x=r.x;x<r.x+r.w;x++)openTile(x,y,pickGround(r.k,rnd));
  });
  for(let k=0;k<M-1;k++){
    const a=clear[k],b=clear[k+1],pg=()=>rnd()<.5?6:7;
    if(a.y===b.y){
      const dx=b.x>a.x?1:-1,xs=dx>0?a.x+RW:b.x+RW,xe=dx>0?b.x-1:a.x-1;
      for(let x=Math.min(xs,xe);x<=Math.max(xs,xe);x++)for(let y=a.cy-1;y<=a.cy+1;y++)openTile(x,y,pg());
      const gx=dx>0?a.x+RW:a.x-1;gates.push({k:k,tiles:[0,1,2].map(i=>({x:gx,y:a.cy-1+i})),anim:0});
    }else{
      for(let y=a.y+RH;y<=b.y-1;y++)for(let x=a.cx-1;x<=a.cx+1;x++)openTile(x,y,pg());
      gates.push({k:k,tiles:[0,1,2].map(i=>({x:a.cx-1+i,y:a.y+RH})),anim:0});
    }
  }
  const sub=(r,k)=>{ /* Hindernisse in einer Lichtung */
    const n=k===M-1?0:4+Math.floor(rnd()*4);
    for(let t=0,placed=0;t<60&&placed<n;t++){
      const x=r.x+Math.floor(rnd()*r.w),y=r.y+Math.floor(rnd()*r.h);
      if(Math.abs(x-r.cx)<=1||Math.abs(y-r.cy)<=1)continue;
      if(k===0&&y===r.cy+2)continue;
      if(block[idx(x,y)])continue;
      const kind=OBST[Math.floor(rnd()*OBST.length)];
      block[idx(x,y)]=1;objs.push({t:kind,x:x,y:y});placed++;
    }
    if(k!==M-1&&k>0&&rnd()<.5){ /* kleiner Teich in einer Ecke */
      const px0=rnd()<.5?r.x:r.x+r.w-2,py0=rnd()<.5?r.y:r.y+r.h-2;
      let okp=true;for(let y=py0;y<py0+2;y++)for(let x=px0;x<px0+2;x++)if(block[idx(x,y)]||Math.abs(x-r.cx)<=1||Math.abs(y-r.cy)<=1)okp=false;
      if(okp)for(let y=py0;y<py0+2;y++)for(let x=px0;x<px0+2;x++){block[idx(x,y)]=1;ground[idx(x,y)]=(x+y)%2?13:12}
    }
  };
  for(let k=1;k<M-1;k++){const r=clear[k],t=HOUSES[(k-1)%HOUSES.length],hx=r.x+1,hy=r.y+1;if(!block[idx(hx,hy)]&&!block[idx(hx+1,hy)]){block[idx(hx,hy)]=1;block[idx(hx+1,hy)]=1;objs.push({t:t,x:hx,y:hy,house:1})}}
  clear.forEach(sub);
  clear.forEach(r=>{
    for(let t=0;t<10;t++){const x=r.x+Math.floor(rnd()*r.w),y=r.y+Math.floor(rnd()*r.h);if(block[idx(x,y)]||objs.some(o=>o.x===x&&o.y===y))continue;objs.push({t:['fern','flowers','grass','grass','reeds'][Math.floor(rnd()*5)],x:x,y:y,deco:1})}
    [[r.x,r.y],[r.x+r.w-1,r.y]].forEach(p=>{if(r.k!==M-1&&!block[idx(p[0],p[1])]&&!objs.some(o=>o.x===p[0]&&o.y===p[1])){block[idx(p[0],p[1])]=1;objs.push({t:'lamp',x:p[0],y:p[1]})}});
  });
  {const r0=clear[0],fx=r0.cx+3,fy=r0.cy;if(!block[idx(fx,fy)]){block[idx(fx,fy)]=1;objs.push({t:'campfire',x:fx,y:fy})}}
  const last=clear[M-1];
  /* Stationen */
  for(let k=0;k<M-1;k++){const r=clear[k];block[idx(r.cx,r.cy)]=1;objs.push({t:'station',x:r.cx,y:r.cy,k:k});ground[idx(r.cx,r.cy)]=9}
  /* Eule */
  {const r=clear[0],ox=r.cx-3,oy=r.cy;block[idx(ox,oy)]=1;objs.push({t:'owl',x:ox,y:oy})}
  /* Weltenbaum und Platten */
  for(let y=last.cy-2;y<=last.cy;y++)for(let x=last.cx-1;x<=last.cx+1;x++){block[idx(x,y)]=1;ground[idx(x,y)]=5}
  const PP=[[-1,2],[1,2],[-3,2],[3,2],[-2,3],[2,3]];
  for(let i=0;i<P;i++){const p=PP[i],x=last.cx+p[0],y=last.cy+p[1];plates.push({x:x,y:y});ground[idx(x,y)]=23}
  objs.push({t:'worldtree',x:last.cx,y:last.cy});
  /* Irrlichter */
  clear.forEach(r=>{const n=2+Math.floor(rnd()*2);for(let i=0;i<n;i++)wisps.push({x:r.x+rnd()*r.w,y:r.y+rnd()*r.h,ph:rnd()*6.28,sp:.4+rnd()*.5,k:r.k})});
  for(let i=objs.length-1;i>=0;i--){const o=objs[i];if(o.deco&&(block[idx(o.x,o.y)]||ground[idx(o.x,o.y)]===23||objs.some(q=>q!==o&&q.x===o.x&&q.y===o.y&&!q.deco)))objs.splice(i,1)}
  return {W:W,H:H,block:block,forest:forest,ground:ground,clear:clear,gates:gates,objs:objs,plates:plates,wisps:wisps,M:M,cols:cols};
}
function zoneK(world,x,y){
  const row=clamp(Math.floor(y/CH),0,Math.ceil(world.M/world.cols)-1);let c=clamp(Math.floor(x/CW),0,world.cols-1);if(row%2)c=world.cols-1-c;
  return clamp(row*world.cols+c,0,world.M-1);
}
function hash2(x,y){let h=(x*374761393+y*668265263)|0;h=(h^(h>>>13))*1274126177|0;return((h^(h>>>16))>>>0)/4294967296}
function gateAt(x,y){const w=G.world;if(!w)return null;for(const g of w.gates)for(const t of g.tiles)if(t.x===x&&t.y===y)return g;return null}
function gateOpen(g){return G.found[g.k]||G.ci>g.k}
function walkable(x,y){
  const w=G.world;if(!w||x<0||y<0||x>=w.W||y>=w.H)return false;
  if(w.block[y*w.W+x])return false;
  const g=gateAt(x,y);if(g&&!gateOpen(g))return false;
  return true;
}

/* ---------- Spieler ---------- */
let ents=[];       /* Spieler-Objekte nach Rosterindex */
function newEnt(i,x,y){return {i:i,x:x,y:y,rx:x,ry:y,dir:0,anim:0,moving:false}}
function spawnFor(world,ci,i){
  const r=world.clear[clamp(ci,0,world.M-1)];
  if(ci>=world.M-1)return {x:r.cx-3+i%5,y:r.cy+4-1-Math.floor(i/5)*0};
  const off=[0,-1,1,-2,2,-3][i]||0;
  return {x:r.cx+off,y:r.cy+2};
}
function meEnt(){return ents[G.me]||null}

/* ---------- Spielstart ---------- */
const lobby=$('#lobby'),endEl=$('#end'),hud=$('#hud'),pad=$('#pad'),abtn=$('#abtn');
function myPeer(){
  if(!RM.named)return null;
  const ps=RM.named.peers();
  for(let i=0;i<ps.length;i++)if(ps[i].isMe&&ps[i].sameTab)return ps[i].peer;
  return null;
}
function genData(seed,P,order,st){
  const D={};
  order.forEach((id,k)=>{if(px(id)&&PZ[px(id)])D[id]=PZ[px(id)].gen(rngFor(seed,k+1),st,P)});
  return D;
}
function beginGame(sp){
  closeModal(true);closeDialog();
  const mode=MODES[sp.mode]?sp.mode:'short';
  G.mode=mode;G.order=expandOrder(Array(MODES[mode].n).fill('X').concat('finale'),sp.seed);
  const P=sp.roster?clamp(sp.roster.length,1,6):1;
  G.P=P;G.epoch=sp.epoch;G.seed=sp.seed;G.total=sp.total;G.roster=sp.roster||[];G.solo=!sp.roster;G.hostPeer=sp.host||null;
  G.sets=ROLE_SETS[P];G.stage=clamp(sp.stage|0||3,1,6);applyStage(G.stage);
  G.data=genData(sp.seed,P,G.order,G.stage);
  G.world=buildWorld(sp.seed,G.order.length,P);
  const my=sp.roster?G.roster.indexOf(myPeer()):0;
  G.me=my;G.spectator=!G.solo&&my<0;
  G.roles=G.solo?ROLE_SETS[1][0].slice():(my>=0?G.sets[my]:[]);
  G.found=new Array(G.order.length).fill(false);G.hintsTotal=0;G.attempts=0;G.locked=false;
  G.phase='play';G.deadline=performance.now()+sp.total*1000;G.endRemaining=0;
  ents=[];for(let i=0;i<P;i++){const s=spawnFor(G.world,0,i);ents.push(newEnt(i,s.x,s.y))}
  parts.length=0;
  setCi(0,true);
  lobby.hidden=true;endEl.hidden=true;hud.hidden=false;pad.hidden=false;abtn.hidden=false;
  if(G.spectator){const r=G.world.clear[0];cam.x=r.cx;cam.y=r.cy;toast('Du schaust zu. In der nächsten Runde bist du dabei.')}
  else if(!G.solo&&G.roles.length)toast('Deine Rolle: '+G.roles.map(r=>ROLE_NAME[r]).join(' und '),4200);
  if(!G.spectator)showDialog([{who:'Eule Ilmara',text:'Willkommen, Wanderer! Der Weltenbaum welkt, und mit ihm das Licht des Waldes. Nur die Runensteine können ihn retten.'},{who:'Eule Ilmara',text:'Jeder von euch sieht andere Hinweise. Sprecht miteinander und löst die Runen der Reihe nach. Ich warte hier auf euch.'},{who:'Eule Ilmara',text:'Der Pfeil zeigt euch den Weg. Mit der A-Taste sprecht ihr mit Dingen und öffnet die Runensteine. Viel Glück!'}]);
}
function setCi(i,first){
  G.ci=i;G.cur=G.order[i];G.chHints=0;G.feedback='';G.fbBad=false;G.locked=false;
  G.pu=(px(G.cur)&&PZ[px(G.cur)])?PZ[px(G.cur)].init(G.data[G.cur]):null;
  G.tab=G.roles[0]||null;
  paintHud();
  if(!first)toast(G.cur==='finale'?'Der Weg zum Weltenbaum ist frei!':'Rune '+(i+1)+' von '+(G.order.length-1)+': Folgt dem Pfeil.',3200);
}
function startSolo(){
  initAudio();
  const st=stageFor(RM.d);
  beginGame({epoch:Date.now(),seed:(Math.random()*1e9)|0,total:Math.round(MODES[RM.mode].min*60*STAGES[st].tm),mode:RM.mode,roster:null,host:null,stage:st});
}
function send(topic,data){
  if(!RM.named)return;
  RM.named.emit(topic,data).catch(()=>{});
}
function startRoom(){
  initAudio();
  if(!RM.named)return;
  const me=myPeer();
  const others=RM.named.peers().filter(p=>p.kind==='viewer'&&p.peer!==me).map(p=>p.peer).sort();
  const roster=(me?[me]:[]).concat(others).slice(0,6);
  if(!roster.length){toast('Noch niemand in der Gruppe sichtbar. Kurz warten und nochmal tippen.');return}
  const st=stageFor(RM.d);
  send('start',{epoch:Date.now(),seed:(Math.random()*1e9)|0,total:Math.round(MODES[RM.mode].min*60*STAGES[st].tm),mode:RM.mode,roster:roster,stage:st});
}
function newRound(){if(G.solo||!RM.named)startSolo();else startRoom()}

/* ---------- Aktionen ---------- */
function act(d){
  if(G.phase!=='play')return;
  d.epoch=G.epoch;d.ci=G.ci;
  if(G.solo)handleAct(d,true);else send('act',d);
}
function handleAct(d,mineAct){
  if(!d||d.epoch!==G.epoch||G.phase!=='play'||d.ci!==G.ci||G.locked)return;
  const id=G.cur;
  if(d.type==='hint'){
    if(d.n===G.chHints+1&&d.n<=3){G.chHints=d.n;G.hintsTotal++;G.deadline-=PEN_HINT*1000;renderModal()}
  }else if(d.type==='x'&&px(id)&&PZ[px(id)]){
    const r=PZ[px(id)].act(G.data[id],G.pu,d,mineAct);
    if(!r)return;
    if(r.ok)chamberDone();
    else if(r.wrong)wrong(mineAct,r.wrong);
    else if(r.render)renderModal();
  }else if(d.type==='done'&&id==='finale'){
    finish('won');
  }
}
function wrong(mineAct,msg){
  G.attempts++;G.deadline-=PEN_TRY*1000;beep(160,.3,'sawtooth',.1);
  if(mineAct){G.feedback=msg+' Das hat '+PEN_TRY+' Sekunden gekostet.';G.fbBad=true;const f=$('#fb');if(f){f.textContent=G.feedback;f.className='fb bad'}}
  else toast('Fehlversuch bei den anderen (−'+PEN_TRY+' s).');
  renderModal();
}
function chamberDone(){
  if(G.phase!=='play'||G.locked)return;
  const k=G.ci;
  G.found[k]=true;G.deadline=Math.min(G.deadline+BONUS*1000,performance.now()+G.total*1000);
  closeModal(true);
  beep(523,.2,'sine');setTimeout(()=>beep(784,.35,'sine'),160);
  const r=G.world.clear[k];burst(r.cx+.5,r.cy+.5,46,'#9dffd6');burst(r.cx+.5,r.cy+.5,20,'#ffe08a');
  G.world.gates[k].anim=.0001;
  const g=G.world.gates[k];g.tiles.forEach(t=>burst(t.x+.5,t.y+.5,10,'#c9ffe6'));
  toast('Rune '+(k+1)+' gelöst! +'+BONUS+' Sekunden. Die Wurzeln weichen zurück.',3400);
  setCi(k+1,false);
}
function finish(phase){
  if(G.phase!=='play')return;
  G.endRemaining=remaining();G.phase=phase;closeModal(true);closeDialog();
  if(phase==='won'){
    for(let i=0;i<6;i++)setTimeout(()=>{const t=G.world.clear[G.world.M-1];burst(t.cx+.5+(Math.random()*4-2),t.cy-1+(Math.random()*2-1),40,i%2?'#9dffd6':'#ffe08a')},i*260);
    beep(523,.25,'sine');setTimeout(()=>beep(659,.25,'sine'),180);setTimeout(()=>beep(784,.5,'sine'),360);
  }else beep(110,.8,'sawtooth',.14);
  const ep=G.epoch;
  setTimeout(()=>{if(G.epoch===ep&&G.phase===phase)showEnd()},phase==='won'?2600:1200);
}
function showEnd(){
  const won=G.phase==='won',n=G.found.filter(Boolean).length;
  $('#endEye').textContent=won?'Weltenbaum gerettet':'Das Licht ist erloschen';
  $('#endTitle').textContent=won?'Der Wald erstrahlt wieder!':'Die Dunkelheit war schneller.';
  $('#endText').textContent=won?'Der Weltenbaum treibt frische Blätter. Gute Teamarbeit.':'Kein Problem. Mit neuen Rätseln und einer neuen Runde klappt es bestimmt.';
  $('#endSum').innerHTML='<span>Runen <b>'+n+' von '+(G.order.length-1)+'</b></span><span>Zeit übrig <b>'+fmt(G.endRemaining)+'</b></span><span>Fehlversuche <b>'+G.attempts+'</b></span><span>Hinweise <b>'+G.hintsTotal+'</b></span>';
  endEl.hidden=false;pad.hidden=true;abtn.hidden=true;
}

/* ---------- Rollenkarte im Runenstein ---------- */
function guardBody(){
  const hs=[];for(let i=1;i<=G.chHints;i++)hs.push('<div class="hint">'+esc(PZ[px(G.cur)].hint(G.data[G.cur],i))+'</div>');
  return '<p class="lead">Du bist für die Erklärungen zuständig. Sag der Gruppe zu Beginn, wie die Rune funktioniert, und hilf allen weiter, wenn sie nicht mehr wissen, was zu tun ist. Du siehst keine Rätselteile, dafür kennst du die Regeln.</p>'
    +'<h3 class="sub">Das erklärst du bei dieser Rune</h3>'
    +'<ul class="log">'+PZ[px(G.cur)].explain(G.data[G.cur]).map(t=>'<li>'+esc(t)+'</li>').join('')+'</ul>'
    +'<h3 class="sub">Allgemein</h3>'
    +'<ul class="log"><li>Jede Person hat eine andere Rolle und sieht andere Hinweise. Sprecht miteinander, zeigt nichts auf dem Bildschirm.</li><li>Um eine Rune zu lesen, muss man am Runenstein stehen. Kommt alle dorthin.</li><li>Ein Fehlversuch kostet '+PEN_TRY+' Sekunden, eine gelöste Rune bringt '+BONUS+' Sekunden. Das Licht des Waldes zeigt, wie viel Zeit bleibt.</li></ul>'
    +'<h3 class="sub">Wenn ihr nicht weiterkommt</h3>'
    +'<p class="small">Frag zuerst nach: Wer sieht was? Hilft das nicht, fordere unten einen Hinweis an.</p>'
    +'<div><button class="btn" data-act="hint"'+(G.chHints>=3?' disabled':'')+'>'+(G.chHints>=3?'Keine Hinweise mehr':'Hinweis anfordern (−'+PEN_HINT+' s)')+'</button></div>'
    +(hs.length?'<div class="hints">'+hs.join('')+'</div>':'');
}
function roleBody(r){
  if(r==='guard')return guardBody();
  return PZ[px(G.cur)].role(r,G.data[G.cur],G.pu);
}
const modalEl=$('#modal');
function openModal(){
  if(G.phase!=='play'||!px(G.cur)||G.spectator&&false)return;
  G.modal=true;modalEl.hidden=false;renderModal();
}
function closeModal(silent){G.modal=false;modalEl.hidden=true;modalEl.innerHTML='';pad.classList.remove('off')}
function renderModal(){
  if(!G.modal)return;
  if(G.phase!=='play'||!px(G.cur)){closeModal(true);return}
  let h='<div class="box"><div class="mhead"><div><span class="eyebrow">Rune '+(G.ci+1)+' von '+(G.order.length-1)+'</span><h2>'+esc(PZ[px(G.cur)].name)+'</h2></div><button class="btn" data-act="close">Schließen</button></div>';
  if(G.spectator){
    h+='<p class="lead">Du schaust in dieser Runde zu und hast keine Aufgabe.</p>';
  }else{
    if(G.roles.length>1)h+='<div><p class="small">Du hast mehrere Rollen:</p><div class="tabs" role="tablist">'+G.roles.map(r=>'<button class="chip" role="tab" data-act="tab" data-role="'+r+'" aria-pressed="'+(r===G.tab)+'" aria-selected="'+(r===G.tab)+'">'+ROLE_NAME[r]+'</button>').join('')+'</div></div>';
    h+='<div><span class="eyebrow">Deine Rolle</span><h3 class="sub" style="margin:2px 0 0;font-size:20px">'+ROLE_NAME[G.tab]+'</h3></div>'+roleBody(G.tab);
  }
  h+='</div>';
  const keep=modalEl.querySelector('.box');const sc=keep?keep.scrollTop:0;
  modalEl.innerHTML=h;const nb=modalEl.querySelector('.box');if(nb)nb.scrollTop=sc;
}
modalEl.addEventListener('click',e=>{
  const b=e.target.closest('[data-act]');
  if(!b){if(e.target===modalEl)closeModal();return}
  const a=b.dataset.act;
  if(a==='close')closeModal();
  else if(a==='tab'){G.tab=b.dataset.role;renderModal()}
  else if(a==='xup'||a==='xdn'){const u=G.pu;if(!u||!u.vals)return;const i=Number(b.dataset.i),m=u.mods[i],mn=u.mins?u.mins[i]:0;u.vals[i]=((u.vals[i]-mn+(a==='xup'?1:-1)+m)%m)+mn;const el=$('#xd'+i);if(el)el.textContent=u.show(i,u.vals[i])}
  else if(a==='xsub'){if(G.pu&&G.pu.vals)act({type:'x',op:'sub',vals:G.pu.vals.slice()})}
  else if(a==='xsubsel'){if(G.pu&&G.pu.sel!=null)act({type:'x',op:'sub',i:G.pu.sel})}
  else if(a==='xpick'){if(G.pu){G.pu.sel=Number(b.dataset.i);renderModal()}}
  else if(a==='xpress')act({type:'x',op:'press',i:Number(b.dataset.i)});
  else if(a==='hint'){if(G.chHints<3)act({type:'hint',n:G.chHints+1})}
});

/* ---------- Dialog ---------- */
const dlgEl=$('#dlg');let dlgQ=[];
function showDialog(lines){dlgQ=lines.slice();nextDialog()}
function nextDialog(){
  if(!dlgQ.length){closeDialog();return}
  const l=dlgQ.shift();
  dlgEl.hidden=false;dlgEl.innerHTML='<div class="who">'+esc(l.who)+'</div><div class="txt">'+esc(l.text)+'</div><div class="nx">'+(dlgQ.length?'A: weiter ▶':'A: schließen ✕')+'</div>';
}
function closeDialog(){dlgQ=[];dlgEl.hidden=true;dlgEl.innerHTML=''}
dlgEl.addEventListener('click',nextDialog);
function dialogOpen(){return !dlgEl.hidden}

/* ---------- Interaktion ---------- */
const DIRS=[[0,1],[-1,0],[1,0],[0,-1]]; /* unten, links, rechts, oben */
function interact(){
  if(G.phase!=='play')return;
  if(dialogOpen()){nextDialog();return}
  if(G.modal)return;
  const m=meEnt();if(!m||G.spectator)return;
  const w=G.world,cands=[];
  const f=DIRS[m.dir];cands.push([m.x+f[0],m.y+f[1]]);
  DIRS.forEach(d=>cands.push([m.x+d[0],m.y+d[1]]));
  for(const c of cands){
    const o=w.objs.find(q=>q.x===c[0]&&q.y===c[1]&&(q.t==='station'||q.t==='owl'));
    if(o){
      if(o.t==='station'){
        if(o.k===G.ci)openModal();
        else if(o.k<G.ci)showDialog([{who:'Runenstein',text:'Diese Rune leuchtet bereits. Hier ist alles getan.'}]);
        else showDialog([{who:'Runenstein',text:'Der Stein schlummert noch. Löst zuerst die vorherige Rune (Pfeil folgen).'}]);
      }else owlTalk();
      return;
    }
    const wt=w.objs.find(q=>q.t==='worldtree');
    if(Math.abs(c[0]-wt.x)<=1&&c[1]>=wt.y-2&&c[1]<=wt.y&&block(w,c[0],c[1])){
      showDialog(G.cur==='finale'?[{who:'Weltenbaum',text:'Ich spüre euch. Stellt euch alle gleichzeitig auf die leuchtenden Runenplatten vor mir, dann erwache ich.'}]:[{who:'Weltenbaum',text:'Meine Blätter sind grau und müde. Bringt mir das Licht der Runen.'}]);return;
    }
    const g=gateAt(c[0],c[1]);
    if(g&&!gateOpen(g)){showDialog([{who:'Wurzelsperre',text:'Dichte, dornige Wurzeln versperren den Weg. Löst zuerst den Runenstein, dann weichen sie zurück.'}]);return}
  }
}
function block(w,x,y){return w.block[y*w.W+x]===1}
function owlTalk(){
  const left=G.order.length-1-G.ci;
  const lines=G.cur==='finale'
    ?[{who:'Eule Ilmara',text:'Alle Runen leuchten! Geht zum Weltenbaum und stellt euch zusammen auf die Platten.'}]
    :[{who:'Eule Ilmara',text:left+(left===1?' Rune fehlt noch. ':' Runen fehlen noch. ')+'Folgt dem Pfeil zum nächsten Runenstein. Dort sieht jeder etwas anderes.'},{who:'Eule Ilmara',text:'Tipp: Die Wächter/in kennt die Regeln jeder Rune und kann euch Hinweise geben.'}];
  showDialog(lines);
}

/* ---------- Eingabe ---------- */
const held=[];
function holdDir(d,on){const i=held.indexOf(d);if(i>=0)held.splice(i,1);if(on)held.push(d)}
const KEYDIR={ArrowDown:0,s:0,S:0,ArrowLeft:1,a:1,A:1,ArrowRight:2,d:2,D:2,ArrowUp:3,w:3,W:3};
addEventListener('keydown',e=>{
  if(G.phase==='lobby'&&!lobby.hidden)return;
  const t=e.target;if(t&&(t.tagName==='INPUT'||t.tagName==='TEXTAREA'))return;
  if(e.key in KEYDIR){if(!G.modal&&!dialogOpen()){holdDir(KEYDIR[e.key],true);e.preventDefault()}}
  else if(e.key==='Enter'||e.key===' '||e.key==='e'||e.key==='E'){if(t&&t.tagName==='BUTTON'&&G.modal)return;interact();e.preventDefault()}
  else if(e.key==='Escape'){if(G.modal)closeModal();else if(dialogOpen())closeDialog()}
});
addEventListener('keyup',e=>{if(e.key in KEYDIR)holdDir(KEYDIR[e.key],false)});
addEventListener('blur',()=>{held.length=0});
pad.addEventListener('pointerdown',e=>{
  const b=e.target.closest('[data-dir]');if(!b)return;
  e.preventDefault();b.setPointerCapture&&b.setPointerCapture(e.pointerId);
  holdDir(+b.dataset.dir,true);b.classList.add('dn');
});
['pointerup','pointercancel','lostpointercapture'].forEach(ev=>pad.addEventListener(ev,e=>{
  const b=e.target.closest('[data-dir]');if(!b)return;holdDir(+b.dataset.dir,false);b.classList.remove('dn');
}));
abtn.addEventListener('pointerdown',e=>{e.preventDefault();interact()});

/* ---------- Bewegung ---------- */
const SPEED=6.2;
let lastPosSend=0;
function stepLocal(dt){
  const m=meEnt();if(!m||G.spectator)return;
  const busy=G.modal||dialogOpen()||G.phase!=='play';
  const d=m.x-m.rx,e2=m.y-m.ry,dist=Math.hypot(d,e2);
  if(dist>0.001){
    const s=Math.min(dist,SPEED*dt);m.rx+=d/dist*s;m.ry+=e2/dist*s;m.anim+=dt*9;m.moving=true;
  }else{m.rx=m.x;m.ry=m.y;m.moving=false}
  if(busy||dist>0.35||!held.length)return;
  const dir=held[held.length-1],v=DIRS[dir];m.dir=dir;
  const nx=m.x+v[0],ny=m.y+v[1];
  if(walkable(nx,ny)){m.x=nx;m.y=ny;sendPos();}
}
function sendPos(){
  const m=meEnt();if(!m||G.solo||!RM.named)return;
  lastPosSend=performance.now();
  send('pos',{e:G.epoch,x:m.x,y:m.y,d:m.dir});
}
function stepRemote(dt){
  ents.forEach((m,i)=>{
    if(i===G.me&&!G.spectator)return;
    const d=m.x-m.rx,e2=m.y-m.ry,dist=Math.hypot(d,e2);
    if(dist>4){m.rx=m.x;m.ry=m.y;m.moving=false;return}
    if(dist>0.001){const s=Math.min(dist,SPEED*1.15*dt);m.rx+=d/dist*s;m.ry+=e2/dist*s;m.anim+=dt*9;m.moving=true}else m.moving=false;
  });
}
function onPos(m){
  const d=m.data;
  if(!d||d.e!==G.epoch||G.phase==='lobby'||(m.isMe&&m.sameTab))return;
  const i=G.roster.indexOf(m.peer);if(i<0||!ents[i]||i===G.me)return;
  if(typeof d.x!=='number'||typeof d.y!=='number'||!G.world)return;
  const x=Math.round(d.x),y=Math.round(d.y);
  if(x<0||y<0||x>=G.world.W||y>=G.world.H)return;
  const e=ents[i];e.x=x;e.y=y;if(d.d>=0&&d.d<4)e.dir=d.d|0;
}

/* ---------- Finale: alle Platten gleichzeitig ---------- */
let plateT=0;
function checkPlates(dt){
  if(G.phase!=='play'||G.cur!=='finale'||G.spectator){plateT=0;return}
  const w=G.world;let n=0;
  w.plates.forEach(p=>{if(ents.some(e=>Math.round(e.x)===p.x&&Math.round(e.y)===p.y&&(e.rx===e.x||Math.abs(e.rx-e.x)<.3)))n++});
  G.plateN=n;
  if(n>=w.plates.length)plateT+=dt;else plateT=0;
  if(plateT>1.2){plateT=-999;act({type:'done'})}
}

/* ---------- Partikel ---------- */
const parts=[];
function burst(x,y,n,col){
  for(let i=0;i<n;i++){const a=Math.random()*6.283,s=1+Math.random()*4;parts.push({x:x,y:y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-1,life:.7+Math.random()*.9,t:0,col:col,sz:2+Math.random()*3})}
}
function stepParts(dt){for(let i=parts.length-1;i>=0;i--){const p=parts[i];p.t+=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=1.4*dt;if(p.t>p.life)parts.splice(i,1)}}

/* ---------- Zeichnen ---------- */
const cv=$('#cv'),ctx=cv.getContext('2d');
let VW=0,VH=0,DPR=1,T=64;
const cam={x:10,y:10};
const dark=document.createElement('canvas'),dg=dark.getContext('2d');
function resize(){
  DPR=Math.min(window.devicePixelRatio||1,2);
  VW=cv.clientWidth;VH=cv.clientHeight;
  cv.width=Math.round(VW*DPR);cv.height=Math.round(VH*DPR);
  dark.width=cv.width;dark.height=cv.height;
  T=Math.round(clamp(Math.min(VW/12,VH/8.5),44,92));
}
addEventListener('resize',resize);
let demo=null;
function frameSprite(e,col){
  const im=IM.players[PCOL[e.i%6]];if(!im)return;
  const fc=e.moving?(Math.floor(e.anim)%2===0?0:2):1;
  const sw=66,sh=96,dw=T*.92,dh=dw*sh/sw;
  const sx=(e.rx-cam.x)*T+VW/2,sy=(e.ry-cam.y)*T+VH/2;
  ctx.fillStyle='rgba(0,0,0,.3)';ctx.beginPath();ctx.ellipse(sx+T/2,sy+T*.88,T*.3,T*.11,0,0,6.2832);ctx.fill();
  ctx.imageSmoothingEnabled=false;
  ctx.drawImage(im,fc*sw,e.dir*sh,sw,sh,sx+T/2-dw/2,sy+T*.92-dh,dw,dh);
}
function drawTree(x,y,v,sx,sy){
  const im=IM.big[['oak','round','spruce','dead'][v===2?3:(hash2(y,x)*3|0)]];if(!im)return;
  const ww=T*1.7,hh=ww*im.height/im.width;
  ctx.imageSmoothingEnabled=false;ctx.drawImage(im,sx+T/2-ww/2,sy+T*1.02-hh,ww,hh);ctx.imageSmoothingEnabled=true;
}
function drawStation(o,sx,sy,t){
  const state=o.k<G.ci?2:(o.k===G.ci?1:0);
  const im=IM.int[state?'rune_on':'rune_off'];
  ctx.fillStyle='rgba(0,0,0,.35)';ctx.beginPath();ctx.ellipse(sx+T/2,sy+T*.92,T*.42,T*.12,0,0,6.2832);ctx.fill();
  if(!im)return;
  const ww=T*1.15,hh=ww*im.height/im.width,bob=state===1?Math.sin(t*3)*T*.02:0;
  ctx.imageSmoothingEnabled=false;
  if(state===2){ctx.save();ctx.filter='brightness(1.15)';ctx.drawImage(im,sx+T/2-ww/2,sy+T*.98-hh+bob,ww,hh);ctx.restore()}
  else ctx.drawImage(im,sx+T/2-ww/2,sy+T*.98-hh+bob,ww,hh);
  ctx.imageSmoothingEnabled=true;
}
function drawOwl(sx,sy,t){
  const b=Math.sin(t*2)*T*.02;
  ctx.fillStyle='rgba(0,0,0,.3)';ctx.beginPath();ctx.ellipse(sx+T/2,sy+T*.9,T*.3,T*.1,0,0,6.2832);ctx.fill();
  ctx.fillStyle='#3a2416';ctx.fillRect(sx+T*.25,sy+T*.62,T*.5,T*.28);
  ctx.fillStyle='#8a6a4a';ctx.beginPath();ctx.ellipse(sx+T/2,sy+T*.45+b,T*.3,T*.34,0,0,6.2832);ctx.fill();
  ctx.fillStyle='#b89a74';ctx.beginPath();ctx.ellipse(sx+T/2,sy+T*.55+b,T*.17,T*.2,0,0,6.2832);ctx.fill();
  ctx.fillStyle='#8a6a4a';ctx.beginPath();ctx.moveTo(sx+T*.22,sy+T*.2+b);ctx.lineTo(sx+T*.3,sy+T*.02+b);ctx.lineTo(sx+T*.4,sy+T*.18+b);ctx.fill();
  ctx.beginPath();ctx.moveTo(sx+T*.78,sy+T*.2+b);ctx.lineTo(sx+T*.7,sy+T*.02+b);ctx.lineTo(sx+T*.6,sy+T*.18+b);ctx.fill();
  ctx.fillStyle='#fff3b0';ctx.beginPath();ctx.arc(sx+T*.4,sy+T*.36+b,T*.09,0,6.2832);ctx.arc(sx+T*.6,sy+T*.36+b,T*.09,0,6.2832);ctx.fill();
  ctx.fillStyle='#111';ctx.beginPath();ctx.arc(sx+T*.4,sy+T*.37+b,T*.04,0,6.2832);ctx.arc(sx+T*.6,sy+T*.37+b,T*.04,0,6.2832);ctx.fill();
  ctx.fillStyle='#e8a33c';ctx.beginPath();ctx.moveTo(sx+T*.46,sy+T*.45+b);ctx.lineTo(sx+T*.54,sy+T*.45+b);ctx.lineTo(sx+T*.5,sy+T*.54+b);ctx.fill();
}
function drawWorldTree(o,sx,sy,t){
  const solved=G.found.filter(Boolean).length,total=Math.max(1,G.order.length-1),heal=G.phase==='won'?1:solved/total;
  const d=IM.big.worldtree_dead,al=IM.big.worldtree_alive;if(!d||!al)return;
  const ww=T*4.6,cx=sx+T/2,by=sy+T*1.05;
  ctx.fillStyle='rgba(0,0,0,.35)';ctx.beginPath();ctx.ellipse(cx,by-T*.1,T*1.9,T*.3,0,0,6.2832);ctx.fill();
  ctx.imageSmoothingEnabled=false;
  ctx.globalAlpha=1;ctx.drawImage(d,cx-ww/2,by-ww*d.height/d.width,ww,ww*d.height/d.width);
  ctx.globalAlpha=heal;const wa=ww*1.08;ctx.drawImage(al,cx-wa/2,by-wa*al.height/al.width,wa,wa*al.height/al.width);
  ctx.globalAlpha=1;ctx.imageSmoothingEnabled=true;
}
function drawGate(g,sx,sy,t,tl){
  if(tl!==g.tiles[1])return;
  const open=g.anim>=1,a=g.anim;
  const im=IM.int[open?'gate_open':'gate_closed'];if(!im)return;
  const ww=T*2.7,hh=ww*im.height/im.width;
  ctx.imageSmoothingEnabled=false;
  ctx.drawImage(im,sx+T/2-ww/2,sy+T*1.05-hh,ww,hh);
  if(a>0&&a<1){ctx.globalAlpha=a;ctx.drawImage(IM.int.gate_open,sx+T/2-ww/2,sy+T*1.05-hh,ww,hh);ctx.globalAlpha=1}
  ctx.imageSmoothingEnabled=true;
}
function lightHole(x,y,r,a){
  const g=dg.createRadialGradient(x,y,0,x,y,r);
  g.addColorStop(0,'rgba(0,0,0,'+a+')');g.addColorStop(.55,'rgba(0,0,0,'+(a*.8)+')');g.addColorStop(1,'rgba(0,0,0,0)');
  dg.fillStyle=g;dg.fillRect(x-r,y-r,r*2,r*2);
}
function wx(x){return (x-cam.x)*T+VW/2}
function wy(y){return (y-cam.y)*T+VH/2}
let tAnim=0;
function render(dt){
  tAnim+=dt;
  const t=tAnim,w=G.world||demo;
  ctx.setTransform(DPR,0,0,DPR,0,0);
  ctx.fillStyle='#050c10';ctx.fillRect(0,0,VW,VH);
  if(!w||!ASSETS_READY)return;
  /* Kamera */
  const m=meEnt();
  let tx=cam.x,ty=cam.y;
  if(G.phase!=='lobby'&&m&&!G.spectator){tx=m.rx;ty=m.ry}
  else if(G.phase==='lobby'||!G.world){tx=w.clear[0].cx+Math.sin(t*.1)*3;ty=w.clear[0].cy+Math.cos(t*.13)*2}
  else if(G.spectator){const r=w.clear[Math.min(G.ci,w.M-1)];tx=r.cx;ty=r.cy}
  const k=1-Math.exp(-dt*8);cam.x+=(tx-cam.x)*k;cam.y+=(ty-cam.y)*k;
  const x0=Math.max(0,Math.floor(cam.x-VW/2/T)-1),x1=Math.min(w.W-1,Math.ceil(cam.x+VW/2/T)+1);
  const y0=Math.max(0,Math.floor(cam.y-VH/2/T)-1),y1=Math.min(w.H-1,Math.ceil(cam.y+VH/2/T)+3);
  ctx.imageSmoothingEnabled=true;
  for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){
    const g=w.forest[y*w.W+x]?1:w.ground[y*w.W+x];
    ctx.drawImage(TILE[g],Math.floor(wx(x)),Math.floor(wy(y)),T+1,T+1);
  }
  /* Platten-Glühen */
  w.plates.forEach(p=>{
    const on=G.cur==='finale'&&G.phase==='play',occ=ents.some(e=>Math.round(e.x)===p.x&&Math.round(e.y)===p.y);
    ctx.save();ctx.globalCompositeOperation='lighter';
    ctx.fillStyle=occ?'rgba(255,224,138,.5)':(on?'rgba(75,227,168,'+(.2+.15*Math.sin(t*3))+')':'rgba(75,227,168,.08)');
    ctx.fillRect(wx(p.x),wy(p.y),T,T);ctx.restore();
    {const im=IM.int[occ||on?'plate_on':'plate_off'];if(im){const ww=T*.95,hh=ww*im.height/im.width;ctx.imageSmoothingEnabled=false;ctx.drawImage(im,wx(p.x)+T/2-ww/2,wy(p.y)+T*.9-hh,ww,hh);ctx.imageSmoothingEnabled=true}}
  });
  /* Objekte nach Zeile sortiert */
  const rowObjs=new Map();
  w.objs.forEach(o=>{if(o.y>=y0&&o.y<=y1){if(!rowObjs.has(o.y))rowObjs.set(o.y,[]);rowObjs.get(o.y).push(o)}});
  const gateByRow=new Map();
  w.gates.forEach(g=>g.tiles.forEach(tl=>{if(!gateByRow.has(tl.y))gateByRow.set(tl.y,[]);gateByRow.get(tl.y).push({g:g,tl:tl})}));
  const pl=ents.slice().sort((a,b)=>a.ry-b.ry);let pi=0;
  const lights=[];
  for(let y=y0;y<=y1;y++){
    for(let x=x0;x<=x1;x++){
      if(w.forest[y*w.W+x]){
        const kz=zoneK(w,x,y),wr=w.M>1?kz/(w.M-1):0,h=hash2(x,y);
        const v=h<wr*.8?2:(h<.55?0:1);
        drawTree(x,y,v,wx(x),wy(y));
      }
    }
    (gateByRow.get(y)||[]).forEach(q=>drawGate(q.g,wx(q.tl.x),wy(q.tl.y),t,q.tl));
    (rowObjs.get(y)||[]).forEach(o=>{
      const sx=wx(o.x),sy=wy(o.y);
      if(o.t==='station'){drawStation(o,sx,sy,t);if(o.k===G.ci&&G.phase==='play')lights.push([o.x+.5,o.y+.5,2.6,.9]);else if(o.k<G.ci)lights.push([o.x+.5,o.y+.5,1.8,.7])}
      else if(o.house){const im=IM.big[o.t],ww=T*HOUSE_W[o.t],hh=ww*im.height/im.width;ctx.imageSmoothingEnabled=false;ctx.drawImage(im,sx+T-ww/2,sy+T*1.0-hh,ww,hh);ctx.imageSmoothingEnabled=true;lights.push([o.x+1,o.y-.2,1.8,.6])}
      else if(o.t==='owl')drawOwl(sx,sy,t);
      else if(o.t==='worldtree'){drawWorldTree(o,sx,sy,t);const solved=G.found.filter(Boolean).length;lights.push([o.x+.5,o.y-1,2+solved*.5,.8])}
      else if(IM.obj[o.t]){const im=IM.obj[o.t],ww=T*(OBJ_W[o.t]||1)*.95,hh=ww*im.height/im.width;ctx.imageSmoothingEnabled=false;ctx.fillStyle='rgba(0,0,0,.25)';ctx.beginPath();ctx.ellipse(sx+T/2,sy+T*.92,ww*.4,T*.1,0,0,6.2832);ctx.fill();ctx.drawImage(im,sx+T/2-ww/2,sy+T*.97-hh,ww,hh);ctx.imageSmoothingEnabled=true;if(o.t==='campfire'||o.t==='lamp')lights.push([o.x+.5,o.y+.3,2.2,.8])}
      else if(SPR[o.t])ctx.drawImage(SPR[o.t],sx,sy-T*.1,T,T*1.0);
    });
    while(pi<pl.length&&Math.round(pl[pi].ry)<=y){frameSprite(pl[pi]);pi++}
  }
  while(pi<pl.length){frameSprite(pl[pi]);pi++}
  /* Namensschilder */
  ctx.font='700 '+Math.round(T*.2)+'px sans-serif';ctx.textAlign='center';
  ents.forEach((e,i)=>{
    if(G.solo)return;
    const rl=G.sets[i]?ROLE_SHORT[G.sets[i][0]]+(G.sets[i].length>1?' +':''):'';
    const sx=wx(e.rx)+T/2,sy=wy(e.ry)-T*.35;
    const wd=ctx.measureText(rl).width+10;
    ctx.fillStyle='rgba(5,14,12,.75)';ctx.fillRect(sx-wd/2,sy-T*.2,wd,T*.26);
    ctx.fillStyle=PHEX[i%6];ctx.fillText(rl,sx,sy);
  });
  /* Irrlichter */
  w.wisps.forEach(q=>{
    const x=q.x+Math.sin(t*q.sp+q.ph)*.9,y=q.y+Math.cos(t*q.sp*1.3+q.ph)*.6-.3;
    const sx=wx(x),sy=wy(y);if(sx<-40||sx>VW+40||sy<-40||sy>VH+40)return;
    const gr=ctx.createRadialGradient(sx,sy,0,sx,sy,T*.35);gr.addColorStop(0,'rgba(220,255,250,.95)');gr.addColorStop(.3,'rgba(120,230,255,.5)');gr.addColorStop(1,'rgba(120,230,255,0)');
    ctx.fillStyle=gr;ctx.fillRect(sx-T*.35,sy-T*.35,T*.7,T*.7);
    lights.push([x,y,1.2,.55]);
  });
  /* Partikel (Weltkoordinaten) */
  parts.forEach(p=>{ctx.globalAlpha=1-p.t/p.life;ctx.fillStyle=p.col;ctx.fillRect(wx(p.x),wy(p.y),p.sz,p.sz)});ctx.globalAlpha=1;
  /* Tor-Animation */
  w.gates.forEach(g=>{if(g.anim>0&&g.anim<1)g.anim=Math.min(1,g.anim+dt*.8);else if(g.anim===0&&gateOpen(g))g.anim=1});
  /* Dunkelheit */
  const pr=progress();
  const A=G.phase==='lobby'?.5:.5+.4*pr;
  const R=T*(G.phase==='lobby'?7:lerp(9,3.2,Math.pow(pr,1.15)));
  dg.setTransform(DPR,0,0,DPR,0,0);dg.globalCompositeOperation='source-over';dg.clearRect(0,0,VW,VH);
  dg.fillStyle='rgba(3,10,20,'+A.toFixed(3)+')';dg.fillRect(0,0,VW,VH);
  dg.globalCompositeOperation='destination-out';
  ents.forEach((e,i)=>{lightHole(wx(e.rx)+T/2,wy(e.ry)+T/2,i===G.me?R:R*.55,1)});
  if(G.phase==='lobby'||!ents.length)lightHole(VW/2,VH/2,R,1);
  lights.forEach(l=>lightHole(wx(l[0]),wy(l[1]),T*l[2],l[3]));
  dg.globalCompositeOperation='source-over';
  ctx.setTransform(1,0,0,1,0,0);ctx.drawImage(dark,0,0);ctx.setTransform(DPR,0,0,DPR,0,0);
  /* Pfeil zum Ziel */
  if(G.phase==='play'&&m&&!G.spectator&&!G.modal){
    let gx,gy;
    if(G.cur==='finale'){gx=w.clear[w.M-1].cx;gy=w.clear[w.M-1].cy+2}
    else{const c=w.clear[G.ci];gx=c.cx;gy=c.cy}
    const dx=gx-m.rx,dy=gy-m.ry,dist=Math.hypot(dx,dy);
    if(dist>3.2){
      const a=Math.atan2(dy,dx),rr=T*(2.1+.12*Math.sin(t*5)),cx=wx(m.rx)+T/2+Math.cos(a)*rr,cy=wy(m.ry)+T/2+Math.sin(a)*rr;
      ctx.save();ctx.translate(cx,cy);ctx.rotate(a);ctx.fillStyle='rgba(125,255,200,.9)';ctx.shadowColor='#4be3a8';ctx.shadowBlur=10;
      ctx.beginPath();ctx.moveTo(T*.3,0);ctx.lineTo(-T*.14,-T*.2);ctx.lineTo(-T*.02,0);ctx.lineTo(-T*.14,T*.2);ctx.closePath();ctx.fill();ctx.restore();
    }
  }
  /* Glühwürmchen / Staubflocken */
  for(let i=0;i<18;i++){
    const px0=((i*97.3+t*(8+i%5))%VW),py0=((i*53.1+Math.sin(t*.7+i)*30+t*(3+i%3))%VH);
    ctx.fillStyle='rgba(180,255,220,'+(.25+.25*Math.sin(t*2+i))+')';ctx.fillRect(px0,py0,2,2);
  }
  /* Finale-Fortschritt */
  if(G.cur==='finale'&&G.phase==='play'&&G.world){
    const n=G.plateN|0,tot=G.world.plates.length,msg='Platten besetzt: '+n+' von '+tot;
    ctx.font='700 '+Math.round(T*.26)+'px sans-serif';ctx.textAlign='center';
    const wd=ctx.measureText(msg).width+24;ctx.fillStyle='rgba(5,14,12,.8)';ctx.fillRect(VW/2-wd/2,VH-T*1.25,wd,T*.5);
    ctx.fillStyle=n>=tot?'#ffe08a':'#9dffd6';ctx.fillText(msg,VW/2,VH-T*.9);
  }
}

/* ---------- HUD ---------- */
const timerEl=$('#timer'),barEl=$('#bar');
function paintHud(){
  const rem=remaining();
  timerEl.textContent=fmt(rem);timerEl.classList.toggle('low',G.phase==='play'&&rem<60);
  barEl.style.width=((1-progress())*100).toFixed(1)+'%';
  if(G.order.length){
    $('#chEye').textContent=G.cur==='finale'?'Weltenbaum':'Rune '+Math.min(G.ci+1,G.order.length-1)+' von '+(G.order.length-1);
    $('#chName').textContent=G.cur==='finale'?'Alle auf die Platten':(px(G.cur)&&PZ[px(G.cur)]?PZ[px(G.cur)].name:'');
  }
  $('#roleLbl').textContent=G.spectator?'Zuschauer':(G.roles.length?G.roles.map(r=>ROLE_SHORT[r]).join(' + '):'');
}
setInterval(()=>{
  if(G.phase==='play'&&remaining()<=0)finish('lost');
  paintHud();
},250);

/* ---------- Hauptschleife ---------- */
let lastT=performance.now();
function loop(now){
  const dt=Math.min(.05,(now-lastT)/1000);lastT=now;
  stepLocal(dt);stepRemote(dt);stepParts(dt);checkPlates(dt);
  if(!G.spectator&&G.phase==='play'&&!G.solo&&RM.named&&now-lastPosSend>2500)sendPos();
  render(dt);
  requestAnimationFrame(loop);
}

/* ---------- Gruppenraum ---------- */
function paintStage(){
  $('#diff').innerHTML=DIFFS.map(x=>'<button class="chip" data-d="'+x.id+'" aria-pressed="'+(RM.d===x.id)+'">'+x.label+'</button>').join('');
  const cur=DIFFS.find(x=>x.id===RM.d);
  $('#stageInfo').textContent=cur.info+' Wer die Runde startet, bestimmt die Schwierigkeit für die ganze Gruppe.';
}
$('#diff').addEventListener('click',e=>{const b=e.target.closest('[data-d]');if(!b)return;RM.d=+b.dataset.d;paintStage()});
function paintMode(){
  $('#mode').innerHTML=Object.keys(MODES).map(k=>'<button class="chip" data-mode="'+k+'" aria-pressed="'+(RM.mode===k)+'">'+MODES[k].label+' · '+MODES[k].min+' Min.</button>').join('');
  $('#modeInfo').textContent=MODES[RM.mode].info;
}
$('#mode').addEventListener('click',e=>{const b=e.target.closest('[data-mode]');if(!b)return;RM.mode=b.dataset.mode;paintMode()});
function paintCount(){
  const n=RM.count;
  $('#groupCount').textContent=n<=1?'Du bist allein in der Gruppe. Warte auf die anderen oder starte schon.':n+' Personen sind in der Gruppe.'+(n>6?' Die ersten 6 spielen mit, die anderen schauen zu.':'');
}
async function joinGroup(){
  initAudio();
  const clean=$('#code').value.trim().toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9_.-]/g,'').slice(0,24);
  if(!clean){toast('Bitte gib einen Gruppencode ein.');return}
  try{
    if(!window.FRSNet||!FRSNet.relayUrl()){toast('Der Gruppenraum ist hier nicht eingerichtet. Der Testmodus funktioniert trotzdem.',4500);return}
    leaveGroup(true);
    RM.named=await FRSNet.connect(FRSNet.relayUrl(),'wl-'+clean);
    RM.offs.push(RM.named.on('start',m=>{
      const d=m.data;
      if(!d||typeof d.epoch!=='number'||d.epoch<=G.epoch||typeof d.seed!=='number'||!Array.isArray(d.roster)||d.roster.length<1||d.roster.length>6||typeof d.total!=='number'||d.total<60||d.total>6000||!MODES[d.mode])return;
      beginGame({epoch:d.epoch,seed:d.seed,total:d.total,mode:d.mode,roster:d.roster.map(String),host:m.peer,stage:d.stage});
    }));
    RM.offs.push(RM.named.on('act',m=>handleAct(m.data,m.isMe&&m.sameTab)));
    RM.offs.push(RM.named.on('state',onState));
    RM.offs.push(RM.named.on('pos',onPos));
    RM.offs.push(RM.named.onPeers(ch=>{RM.count=ch.peers.filter(p=>p.kind==='viewer').length;paintCount()}));
    $('#groupName').textContent='Gruppe '+clean;
    $('#joinBox').hidden=true;$('#joinedBox').hidden=false;paintCount();
  }catch(e){console.error('join',e);toast('Beitreten hat nicht geklappt. Versuche es nochmal oder nutze den Testmodus.',4500)}
}
function leaveGroup(silent){
  RM.offs.forEach(f=>{try{f()}catch(e){}});RM.offs=[];
  if(RM.named){const n=RM.named;RM.named=null;n.leave().catch(()=>{})}
  RM.count=0;
  if(!silent){$('#joinBox').hidden=false;$('#joinedBox').hidden=true}
}
function onState(m){
  const d=m.data;
  if(!d||(m.isMe&&m.sameTab)||typeof d.epoch!=='number')return;
  if(d.epoch>G.epoch){
    if(d.phase==='play'&&MODES[d.mode]&&Array.isArray(d.roster)&&d.roster.length>=1&&d.roster.length<=6&&typeof d.seed==='number'&&typeof d.total==='number'&&typeof d.remaining==='number'){
      beginGame({epoch:d.epoch,seed:d.seed,total:d.total,mode:d.mode,roster:d.roster.map(String),host:m.peer,stage:d.stage});
      closeDialog();
      G.deadline=performance.now()+d.remaining*1000;G.attempts=d.attempts|0;G.hintsTotal=d.hints|0;
      const ci=clamp(d.ci|0,0,G.order.length-1);
      for(let k=0;k<ci;k++){G.found[k]=true;G.world.gates[k]&&(G.world.gates[k].anim=1)}
      if(ci>0){setCi(ci,true);ents.forEach((e,i)=>{const s=spawnFor(G.world,ci,i);e.x=e.rx=s.x;e.y=e.ry=s.y})}
    }
    return;
  }
  if(d.epoch===G.epoch&&G.phase==='play'){
    if(d.phase==='play'){
      if(Math.abs(remaining()-d.remaining)>2.5)G.deadline=performance.now()+d.remaining*1000;
      const ci=d.ci|0;
      if(ci>G.ci&&ci<G.order.length){for(let k=G.ci;k<ci;k++){G.found[k]=true;if(G.world.gates[k])G.world.gates[k].anim=1}setCi(ci,false)}
    }else if(d.phase==='won'||d.phase==='lost')finish(d.phase);
  }
}
setInterval(()=>{
  if(!RM.named||G.solo||G.phase==='lobby'||!G.hostPeer||G.hostPeer!==myPeer())return;
  send('state',{epoch:G.epoch,phase:G.phase,seed:G.seed,total:G.total,mode:G.mode,stage:G.stage,remaining:remaining(),roster:G.roster,ci:G.ci,hints:G.hintsTotal,attempts:G.attempts});
},4000);

$('#joinBtn').addEventListener('click',joinGroup);
$('#code').addEventListener('keydown',e=>{if(e.key==='Enter')joinGroup()});
$('#leaveBtn').addEventListener('click',()=>leaveGroup(false));
$('#startBtn').addEventListener('click',startRoom);
$('#soloBtn').addEventListener('click',startSolo);
$('#againBtn').addEventListener('click',newRound);
$('#homeBtn').addEventListener('click',()=>{
  G.phase='lobby';G.solo=false;G.world=null;ents=[];closeModal(true);closeDialog();
  endEl.hidden=true;hud.hidden=true;pad.hidden=true;abtn.hidden=true;lobby.hidden=false;
});

/* ---------- Start ---------- */
resize();
paintMode();paintStage();
pad.hidden=true;abtn.hidden=true;
assetsP.then(()=>{demo=buildWorld(12345,6,1);cam.x=demo.clear[0].cx;cam.y=demo.clear[0].cy});
requestAnimationFrame(loop);
if(DEV)window.__wl={G:G,RM:RM,ents:()=>ents,world:()=>G.world,walkable:walkable,chamberDone:chamberDone,handleAct:handleAct,PZ:PZ,px:px,beginGame:beginGame,tp:(x,y)=>{const m=meEnt();m.x=m.rx=x;m.y=m.ry=y},held:held,interact:interact,buildWorld:buildWorld,ready:()=>ASSETS_READY};
})();
