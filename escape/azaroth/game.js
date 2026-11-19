/* FRS Escape Room: Die Hallen von Azaroth (2D, Draufsicht, Zwergenmine).
   Eigene Welt-Rätsel (Felsbrocken, Kristallstrahl, Lorenbahn, dunkle Stollen, Schmiede) plus Rätsel aus dem Pool (Familie „Sehen & Raum“).
   Nutzt FRSNet (net.js), FRSSound (sound.js) und FRSPool (pool.js). */
(function(){
'use strict';
const $=s=>document.querySelector(s);
const QS=new URLSearchParams(location.search),DEV=QS.has('dev');
let PEN_TRY=15,PEN_HINT=30,PEN_CAUGHT=12;
const BONUS=30;
const STAGES=[null,{pt:10,ph:20,tm:1.2},{pt:12,ph:25,tm:1.1},{pt:15,ph:30,tm:1.0},{pt:18,ph:35,tm:1.0},{pt:20,ph:40,tm:.95},{pt:22,ph:45,tm:.9}];
const DIFFS=[{id:1,label:'Einfach',stage:1,info:'Mehr Zeit, kürzere Rätsel, kleine Strafen, der Drache schläft fester.'},{id:2,label:'Normal',stage:3,info:'Die Standardstufe.'},{id:3,label:'Schwer',stage:5,info:'Längere Rätsel, weniger Zeit, härtere Strafen, der Drache ist wachsam.'}];
function stageFor(d){const x=DIFFS.find(q=>q.id===(d|0));return x?x.stage:3}
function applyStage(st){PEN_TRY=STAGES[st].pt;PEN_HINT=STAGES[st].ph;PEN_CAUGHT=Math.round(STAGES[st].pt*.8)}
const D0=(function(){const d=parseInt(QS.get('d'),10);return(d>=1&&d<=3)?d:2})();
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
/* Ablauf: X = Rätsel aus dem Pool an einer Runentafel, W = Welt-Rätsel (wird je Runde gemischt), dann Schmiede und Drache */
const MODES={
  short:{label:'Kurz',min:35,tpl:['X','W','X','W','w:forge','finale'],info:'5 Hallen, die Schmiede und der Drache, etwa 35 Minuten.'},
  long:{label:'Lang',min:70,tpl:['X','W','X','W','X','W','X','W','w:forge','finale'],info:'9 Hallen mit allen vier Welt-Rätseln, die Schmiede und der Drache, etwa 70 Minuten (Doppelstunde).'},
  test:{label:'Schnelltest',min:12,tpl:['X','W','w:forge','finale'],info:'3 Hallen und der Drache in 12 Minuten, zum Ausprobieren.'}
};
const WORLD_TYPES=['w:boulder','w:beam','w:rails','w:dark'];
const PCOL=['green','blue','red','yellow','purple','orange'];
const PHEX=['#6fdc72','#6aaaff','#ff7a6a','#ffd23f','#c08bff','#ffa040'];
const PETS=[{id:'flame',label:'Lebendige Flamme',cols:4},{id:'salamander',label:'Funkenmolch',cols:3}];

/* ---------- Helfer ---------- */
function mulberry(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function rngFor(seed,k){return mulberry(((seed>>>0)+k*7919)>>>0)}
function shuffled(arr,rnd){const a=arr.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(rnd()*(i+1));const t=a[i];a[i]=a[j];a[j]=t}return a}
function esc(s){return String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}
function fmt(s){s=Math.max(0,Math.ceil(s));return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')}
function nums(a,n){return Array.isArray(a)&&a.length===n&&a.every(x=>typeof x==='number'&&isFinite(x))}
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const lerp=(a,b,t)=>a+(b-a)*t;
function hash2(x,y){let h=(x*374761393+y*668265263)|0;h=(h^(h>>>13))*1274126177|0;return((h^(h>>>16))>>>0)/4294967296}

const G={phase:'lobby',solo:false,spectator:false,epoch:0,seed:0,total:480,deadline:0,endRemaining:0,mode:'short',order:[],ci:0,cur:'',data:{},P:1,me:0,sets:ROLE_SETS[1],roster:[],roles:[],tab:null,chHints:0,hintsTotal:0,attempts:0,caught:0,pu:null,feedback:'',fbBad:false,found:[],stage:3,hostPeer:null,locked:false,world:null,modal:false,sub:null,subV:0};
const RM={rot:1,named:null,offs:[],count:0,mode:'short',d:D0,pet:(function(){try{return localStorage.getItem('az-pet')||'flame'}catch(e){return 'flame'}})()};
function remaining(){return G.phase==='play'?Math.max(0,(G.deadline-performance.now())/1000):G.endRemaining}
function progress(){return G.phase==='play'?clamp(1-remaining()/G.total,0,1):(G.phase==='lost'?1:0)}
function existing(list){return list.filter(r=>G.sets.some(s=>s.indexOf(r)>=0))}
function rolePieces(r,n,list){
  const ex=existing(list),k=ex.indexOf(r);
  if(k<0)return [];
  const m=ex.length;if(n<=0)return [];
  if(n<m)return [k%n];
  const out=[],a=Math.floor(k*n/m),b=Math.floor((k+1)*n/m);
  for(let i=a;i<b;i++)out.push(i);
  return out;
}
const toastEl=$('#toast');let toastT=0;
function toast(msg,ms){toastEl.textContent=msg;toastEl.classList.add('show');clearTimeout(toastT);toastT=setTimeout(()=>toastEl.classList.remove('show'),ms||3200)}

/* ---------- Symbole als Bilder (für die Pool-Rätsel) ---------- */
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
  drawShape(c.getContext('2d'),i,96,'#ffe2b8');
  return SHURL[i]=c.toDataURL('image/png');
}
function img(i){return '<img alt="" src="'+shapeURL(i)+'">'}

/* ---------- Ton ---------- */
const AU={ctx:null,on:false};
/* Aufnahmen aus ElevenLabs: werden früh geladen, beim ersten Tippen entschlüsselt */
const SFXN=['az-amb-halle','az-amb-felsen','az-amb-kristall','az-amb-mine','az-amb-stollen','az-amb-schmiede','az-amb-hort','az-grollen','az-bruellen','az-auge-auf','az-atem','az-gitter','az-geroell','az-felsen-schieben','az-felsen-platte','az-weiche','az-lore-fahrt','az-lore-ziel','az-kristall-drehen','az-strahl-treffer','az-laterne','az-erz','az-amboss','az-schluessel','az-tor','az-richtig','az-falsch','az-hinweis','az-sieg','az-niederlage'];
const SFX={raw:{},buf:{},out:null,amb:null,ambName:null};
const SNDO={room:'azaroth-dateien',phase:()=>G.phase,progress:()=>progress()};
SFXN.forEach(n=>{fetch('azaroth/sfx/'+n+'.mp3').then(r=>r.ok?r.arrayBuffer():null).then(b=>{if(b){SFX.raw[n]=b;sfxDecode()}}).catch(()=>{})});
setTimeout(()=>{if(!SFX.raw['az-amb-halle'])SNDO.room='azaroth'},9000); /* ohne Dateien: künstliche Atmosphäre */
function sfxDecode(){
  if(!AU.ctx)return;
  if(!SFX.out){SFX.out=AU.ctx.createGain();SFX.out.gain.value=.9;SFX.out.connect(AU.ctx.destination)}
  Object.keys(SFX.raw).forEach(n=>{if(SFX.buf[n]||SFX.raw[n]===1)return;const b=SFX.raw[n];SFX.raw[n]=1;try{AU.ctx.decodeAudioData(b,d=>{SFX.buf[n]=d},()=>{})}catch(e){}});
}
function sfx(n,vol,delay){
  if(!AU.ctx||!AU.on||!SFX.buf[n])return null;
  try{const s=AU.ctx.createBufferSource(),g=AU.ctx.createGain();s.buffer=SFX.buf[n];g.gain.value=vol==null?1:vol;s.connect(g);g.connect(SFX.out);s.start(AU.ctx.currentTime+(delay||0));return {s:s,g:g}}catch(e){return null}
}
function sfxStop(h,fade){if(!h)return;try{const t=AU.ctx.currentTime;h.g.gain.setValueAtTime(h.g.gain.value,t);h.g.gain.linearRampToValueAtTime(0,t+(fade||.3));h.s.stop(t+(fade||.3)+.05)}catch(e){}}
/* Atmosphäre je Hallenart, weich überblendet */
const AMBOF={pool:'az-amb-halle',boulder:'az-amb-felsen',beam:'az-amb-kristall',rails:'az-amb-mine',dark:'az-amb-stollen',forge:'az-amb-schmiede',finale:'az-amb-hort'};
const AMBVOL={'az-amb-hort':.75,'az-amb-stollen':.75};
function ambTick(){
  if(!AU.ctx||!SFX.out)return;
  let want=null;
  if(AU.on&&G.phase==='play'&&G.world){const m=meEnt(),z=m?zoneAt(m.x,m.y):-1;want=z>=0?AMBOF[G.world.ch[z].type]:(SFX.ambName||AMBOF[chCur().type])}
  if(want&&!SFX.buf[want])want=SFX.ambName&&SFX.buf[SFX.ambName]?SFX.ambName:null;
  if(want===SFX.ambName)return;
  const t=AU.ctx.currentTime;
  if(SFX.amb){const o=SFX.amb;o.g.gain.cancelScheduledValues(t);o.g.gain.setValueAtTime(o.g.gain.value,t);o.g.gain.linearRampToValueAtTime(0,t+1.6);try{o.s.stop(t+1.7)}catch(e){}SFX.amb=null}
  SFX.ambName=want;
  if(want){const s=AU.ctx.createBufferSource(),g=AU.ctx.createGain();s.buffer=SFX.buf[want];s.loop=true;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(AMBVOL[want]||.6,t+2.2);s.connect(g);g.connect(SFX.out);s.start(t,Math.random()*Math.max(0,SFX.buf[want].duration-1));SFX.amb={s:s,g:g}}
}
setInterval(ambTick,500);
function initAudio(){
  if(AU.ctx){if(AU.ctx.resume)AU.ctx.resume();sfxDecode();return}
  try{const C=window.AudioContext||window.webkitAudioContext;if(C){AU.ctx=new C();window.__snd=window.FRSSound?FRSSound(AU,SNDO):null;sfxDecode()}}catch(e){}
}
function beep(f,d,type,v){
  if(!AU.ctx||!AU.on)return;
  if(window.__snd){try{window.__snd.beep(f,d,type,v)}catch(e){}return}
  try{
    const o=AU.ctx.createOscillator(),g=AU.ctx.createGain(),t=AU.ctx.currentTime;
    o.type=type||'sine';o.frequency.value=f;
    g.gain.setValueAtTime(v||.12,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);
    o.connect(g);g.connect(AU.ctx.destination);o.start(t);o.stop(t+d+.02);
  }catch(e){}
}
/* tiefes Drachengrollen */
function rumble(strength){
  if(!AU.ctx||!AU.on)return;
  if(sfx('az-grollen',Math.min(1,.45+strength*.5)))return;
  try{
    const a=AU.ctx,t=a.currentTime,len=a.sampleRate*2.4,b=a.createBuffer(1,len,a.sampleRate),d=b.getChannelData(0);let l=0;
    for(let i=0;i<len;i++){const w=Math.random()*2-1;l=(l+.03*w)/1.03;d[i]=l*6}
    const s=a.createBufferSource();s.buffer=b;const lp=a.createBiquadFilter();lp.type='lowpass';lp.frequency.value=140;
    const g=a.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.5*strength,t+.5);g.gain.exponentialRampToValueAtTime(.0001,t+2.3);
    s.connect(lp);lp.connect(g);g.connect(a.destination);s.start(t);s.stop(t+2.4);
    const o=a.createOscillator(),og=a.createGain();o.type='sawtooth';o.frequency.setValueAtTime(48,t);o.frequency.linearRampToValueAtTime(38,t+1.8);
    const ol=a.createBiquadFilter();ol.type='lowpass';ol.frequency.value=110;og.gain.setValueAtTime(0,t);og.gain.linearRampToValueAtTime(.08*strength,t+.4);og.gain.exponentialRampToValueAtTime(.0001,t+2);
    o.connect(ol);ol.connect(og);og.connect(a.destination);o.start(t);o.stop(t+2.1);
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
const ASSET='azaroth/assets/';
const IM={};
const IMGN=('obj_rock obj_copper obj_silver obj_stalagmite obj_crystals obj_mushroom obj_barrel obj_crate obj_crates obj_pickaxe obj_shovel obj_sack obj_brazier obj_lantern obj_statue obj_bones obj_table obj_stool obj_bench obj_brokencart obj_rope obj_tankard obj_chain obj_coins '
 +'int_boulder int_boulder_moss int_plate_off int_plate_on int_hole int_hole_full int_crystal int_sun int_target_off int_target_on int_lever_up int_lever_down int_gate_closed int_gate_open int_door int_chest int_chest_open int_tablet int_lectern int_lantern int_bell '
 +'rail_buffer sw_left sw_right cart_r cart_d cart_full_r cart_full_d cart_crystal chute flag sign_stop sign_go '
 +'ore_iron ore_copper ore_silver ore_gold ore_star ore_coal anvil anvil_hot hammer bellows quench crucible rune_off rune_fire rune_water rune_leaf rune_sun rune_key '
 +'big_pillar big_pillar_cracked big_statue big_forge big_elevator big_crystal big_waterfall big_hoard big_gate_closed big_gate_open dragon_0 dragon_1 dragon_2 eyes_0 eyes_1 eyes_2 eyes_3 '
 +'player_green player_blue player_red player_yellow player_purple player_orange npc_gatekeeper npc_smith pet_flame pet_salamander').split(' ');
function loadImg(src){return new Promise(res=>{const i=new Image();i.onload=()=>res(i);i.onerror=()=>res(null);i.src=src})}
let TILE=[],WALL=[];
function sliceSheet(im){
  const out=[];
  for(let i=0;i<24;i++){
    const c=document.createElement('canvas');c.width=c.height=64;const g=c.getContext('2d');
    if(im){g.imageSmoothingEnabled=true;g.imageSmoothingQuality='high';g.drawImage(im,(i%6)*128,Math.floor(i/6)*128,128,128,0,0,64,64)}
    else{g.fillStyle='#3a3540';g.fillRect(0,0,64,64)}
    out.push(c);
  }
  return out;
}
let ASSETS_READY=false;
const assetsP=(async()=>{
  const g=await loadImg(ASSET+'tiles_ground.png'),w=await loadImg(ASSET+'tiles_walls.png');
  await Promise.all(IMGN.map(async n=>{IM[n]=await loadImg(ASSET+n+'.png')}));
  TILE=sliceSheet(g);WALL=sliceSheet(w);buildRailTiles();buildFlames();buildPetIcons();ASSETS_READY=true;
})();
function drawImg(name,cx,by,w,opts){
  /* zeichnet ein Bild mittig über cx, unten bei by, mit Breite w (Bildschirmpixel) */
  const im=IM[name];if(!im)return 0;
  const h=w*im.height/im.width;
  ctx.imageSmoothingEnabled=false;
  if(opts&&opts.alpha!=null)ctx.globalAlpha=opts.alpha;
  ctx.drawImage(im,cx-w/2,by-h,w,h);
  ctx.globalAlpha=1;ctx.imageSmoothingEnabled=true;
  return h;
}
function shadow(cx,cy,rx,ry,a){ctx.fillStyle='rgba(0,0,0,'+(a||.3)+')';ctx.beginPath();ctx.ellipse(cx,cy,rx,ry,0,0,6.2832);ctx.fill()}

/* ---------- Gleise: als Pixel-Kacheln selbst gezeichnet (Verbindungen N=1 O=2 S=4 W=8) ---------- */
const RAIL={};
function railCanvas(mask,dim){
  const c=document.createElement('canvas');c.width=c.height=32;const g=c.getContext('2d');
  const wood=dim?'#5a3a24':'#7a4a28',woodHi=dim?'#6a4830':'#9a6236',steel=dim?'#5d6470':'#b9c2cc',steelHi=dim?'#6e7682':'#e9eef2',steelLo=dim?'#3a3e46':'#6b7480';
  const dirs=[];if(mask&1)dirs.push('N');if(mask&2)dirs.push('E');if(mask&4)dirs.push('S');if(mask&8)dirs.push('W');
  function straight(vert){
    for(let i=0;i<4;i++){const p=2+i*8;g.fillStyle=wood;if(vert)g.fillRect(6,p,20,4);else g.fillRect(p,6,4,20);g.fillStyle=woodHi;if(vert)g.fillRect(6,p,20,1);else g.fillRect(p,6,1,20)}
    [10,20].forEach(o=>{g.fillStyle=steelLo;if(vert)g.fillRect(o,0,3,32);else g.fillRect(0,o,32,3);g.fillStyle=steel;if(vert)g.fillRect(o,0,2,32);else g.fillRect(0,o,32,2);g.fillStyle=steelHi;if(vert)g.fillRect(o,0,1,32);else g.fillRect(0,o,32,1)});
  }
  function stub(d){ /* halbes Gleis von der Mitte zur Kante */
    g.save();g.translate(16,16);g.rotate({N:-Math.PI/2,E:0,S:Math.PI/2,W:Math.PI}[d]);g.translate(-16,-16);
    for(let i=0;i<2;i++){const p=18+i*8;g.fillStyle=wood;g.fillRect(p,6,4,20);g.fillStyle=woodHi;g.fillRect(p,6,1,20)}
    g.fillStyle=wood;g.fillRect(12,6,4,20);
    g.fillStyle='#3b2a20';g.fillRect(9,7,4,18);g.fillStyle='#a33a2a';g.fillRect(10,8,2,16); /* Prellbock */
    [10,20].forEach(o=>{g.fillStyle=steelLo;g.fillRect(13,o,19,3);g.fillStyle=steel;g.fillRect(13,o,19,2);g.fillStyle=steelHi;g.fillRect(13,o,19,1)});
    g.restore();
  }
  function curve(a,b){
    const corner={NE:[32,0],EN:[32,0],ES:[32,32],SE:[32,32],SW:[0,32],WS:[0,32],WN:[0,0],NW:[0,0]}[a+b];
    const [cx,cy]=corner,a0={'32,0':Math.PI/2,'32,32':Math.PI,'0,32':-Math.PI/2,'0,0':0}[cx+','+cy];
    for(let i=0;i<4;i++){const an=a0+(i+.5)*Math.PI/8;g.save();g.translate(cx,cy);g.rotate(an);g.fillStyle=wood;g.fillRect(6,-2,20,4);g.fillStyle=woodHi;g.fillRect(6,-2,20,1);g.restore()}
    [[10.5,steelLo,3],[10.5,steel,2],[21.5,steelLo,3],[21.5,steel,2]].forEach(([r,col,lw])=>{g.strokeStyle=col;g.lineWidth=lw;g.beginPath();g.arc(cx,cy,r,a0,a0+Math.PI/2);g.stroke()});
  }
  if(dirs.length===1)stub(dirs[0]);
  else if(dirs.length===2){const s=dirs.join('');if(s==='NS')straight(true);else if(s==='EW')straight(false);else curve(dirs[0],dirs[1])}
  return c;
}
function buildRailTiles(){[1,2,4,8,3,5,6,9,10,12].forEach(m=>{RAIL[m]=railCanvas(m,false);RAIL['d'+m]=railCanvas(m,true)})}

/* ---------- Flammen: kleine Pixel-Feuer, selbst berechnet (wie ein Lagerfeuer im Retro-Spiel) ---------- */
const FLAME=[];
function buildFlames(){
  /* Schichten wie in Pixel-Spielen: rot außen, dann orange, gelb, heller Kern; Ränder und Spitzen bewegen sich */
  const W=18,H=24,N=12,PAL=['#7a1c12','#c8361a','#f07022','#ffb030','#ffe27a','#fff8d8'];
  for(let f=0;f<N;f++){
    const t=f/N*Math.PI*2,c=document.createElement('canvas');c.width=W;c.height=H;const g=c.getContext('2d');
    for(let y=0;y<H;y++)for(let x=0;x<W;x++){
      const u=y/(H-1);
      const sway=Math.sin(t+u*2.6)*1.3*(1-u)*(1-u);
      const cx=(W-1)/2+sway;
      const tip=.1*Math.sin(x*1.25+t*2)+.07*Math.sin(x*2.3-t*3);
      const uu=u+tip*(1-u);
      if(uu<.02)continue;
      const prof=uu<.78?Math.pow(uu/.78,.72):1-Math.pow((uu-.78)/.22,2)*.28;
      const half=7.6*prof+Math.sin(y*1.1+t*2)*.55*uu;
      const r=1-Math.abs(x-cx)/Math.max(.5,half);
      if(r<=0)continue;
      let k=0;
      if(r>.22&&uu>.22)k=1;
      if(r>.4&&uu>.34)k=2;
      if(r>.56&&uu>.48)k=3;
      if(r>.7&&uu>.62)k=4;
      if(r>.82&&uu>.74)k=5;
      g.fillStyle=PAL[k];g.fillRect(x,y,1,1);
    }
    /* zwei Funken, die nach oben steigen */
    [[.3,0],[.7,.5]].forEach(q=>{const ph=(f/N+q[1])%1,yy=Math.round(5-ph*5),xx=Math.round(W*q[0]+Math.sin(t*2+q[1]*6)*1.5);if(yy>=0){g.fillStyle=PAL[3+(f%2)];g.fillRect(xx,yy,1,1)}});
    FLAME.push(c);
  }
}
function drawFlame(cx,by,w,h,seed,t){
  if(!FLAME.length)return;
  const fr=FLAME[Math.floor(t*11+seed*7)%FLAME.length],fl=1+Math.sin(t*13+seed*5)*.04;
  ctx.imageSmoothingEnabled=false;ctx.drawImage(fr,cx-w/2,by-h*fl,w,h*fl);ctx.imageSmoothingEnabled=true;
}
const PETIC={};
function buildPetIcons(){
  PETS.forEach(p=>{const im=IM['pet_'+p.id];const c=document.createElement('canvas');c.width=c.height=80;if(im){const g=c.getContext('2d');g.imageSmoothingEnabled=false;g.drawImage(im,0,0,120,120,0,0,80,80)}PETIC[p.id]=c.toDataURL()});
  paintPets();
}

/* ---------- Die Schmiede: eigenes Rätsel mit Rollen (gleiche Schnittstelle wie der Pool) ---------- */
const ORES=[{n:'Eisen',im:'ore_iron'},{n:'Kupfer',im:'ore_copper'},{n:'Silber',im:'ore_silver'},{n:'Gold',im:'ore_gold'},{n:'Sternenerz',im:'ore_star'}];
const SHINY=[2,3,4];
function oreH(i){return '<span class="ore"><img alt="" src="'+ASSET+ORES[i].im+'.png">'+ORES[i].n+'</span>'}
const FORGE={name:'Die Schmiede',
  gen(rnd,st){
    const L=st<=2?3:(st<=4?4:5);
    const rec=shuffled([0,1,2,3,4],rnd).slice(0,L);
    const heat=rec.filter(o=>SHINY.indexOf(o)>=0).length+1;
    /* Hinweise: direkte Stellen, bei schwer zum Teil als Beziehung */
    const clues=rec.map((o,i)=>({t:'pos',i:i,o:o}));
    if(st>=5){const j=1+Math.floor(rnd()*(L-1));clues[j]={t:'after',o:rec[j],prev:rec[j-1]}}
    return {L:L,rec:rec,heat:heat,clues:shuffled(clues,rnd)};
  },
  init(d){return {vals:new Array(d.L).fill(0).concat([1]),mods:new Array(d.L).fill(5).concat([5]),mins:new Array(d.L).fill(0).concat([1]),show:(i,v)=>i<d.L?ORES[v].n:String(v),labels:Array.from({length:d.L},(_,i)=>'Stelle '+(i+1)).concat(['Glut'])}},
  role(r,d,u){
    if(r==='mechanic'){
      return '<p class="lead">Du stehst am Amboss. Lege die Erze in der richtigen Reihenfolge in den Schmelztiegel und stelle die Glutstufe ein. Die anderen kennen das Rezept.</p>'
        +'<div class="dials">'+u.vals.map((v,i)=>'<div><div class="small" style="text-align:center;margin-bottom:4px">'+u.labels[i]+'</div><div class="dial" style="width:'+(i<d.L?'96px':'58px')+'"><button data-act="xup" data-i="'+i+'" aria-label="weiter">▲</button><div class="dg" id="xd'+i+'" style="font-size:'+(i<d.L?'15px':'34px')+'">'+esc(u.show(i,v))+'</div><button data-act="xdn" data-i="'+i+'" aria-label="zurück">▼</button></div></div>').join('')+'</div>'
        +'<div><button class="btn primary" data-act="xsub">Schmieden</button></div>'+fb()+'<p class="small">Ein Fehlversuch kostet '+PEN_TRY+' Sekunden.</p>';
    }
    if(r==='decode')return '<p class="lead">Du kennst das Geheimnis der Glut:</p><div class="hint">Die Glutstufe ist die Anzahl der glänzenden Erze im Rezept plus 1. Glänzend sind '+oreH(2)+', '+oreH(3)+' und '+oreH(4)+'. '+oreH(0)+' und '+oreH(1)+' glänzen nicht.</div>'+(function(){const p=rolePieces('decode',d.clues.length,['research','cartographer','radio','guard','decode']);return p.length?'<p class="lead">Außerdem steht auf deinem Zettel:</p><ul class="list">'+p.map(i=>'<li>'+FORGE.clue(d.clues[i])+'</li>').join('')+'</ul>':''})();
    const p=rolePieces(r,d.clues.length,['research','cartographer','radio','guard','decode']);
    if(!p.length)return '<p class="lead">Du hast keinen eigenen Teil des Rezepts. Hilf mit, die Teile der anderen zu ordnen.</p>';
    return '<p class="lead">Ein Stück des alten Schmiederezepts ('+d.L+' Erze):</p><ul class="list">'+p.map(i=>'<li>'+FORGE.clue(d.clues[i])+'</li>').join('')+'</ul>';
  },
  clue(c){return c.t==='pos'?'<span class="k">STELLE '+(c.i+1)+'</span>'+oreH(c.o):'<span>'+oreH(c.o)+' kommt direkt nach '+oreH(c.prev)+'</span>'},
  explain(d){return ['Das Rezept für den Runenschlüssel besteht aus '+d.L+' Erzen in einer festen Reihenfolge und einer Glutstufe.','Die Teile des Rezepts sind auf die Gruppe verteilt. Die Entschlüsseler/in kennt die Regel für die Glut.','Die Mechaniker/in stellt alles am Amboss ein und schmiedet.']},
  hint(d,n){if(n===1)return 'Sammelt zuerst alle Stellen: Wer kennt Stelle 1, wer Stelle 2? Schreibt die Reihe auf.';if(n===2)return 'Die Glutstufe ist '+d.heat+'.';return 'Das erste Erz ist '+ORES[d.rec[0]].n+', das letzte '+ORES[d.rec[d.L-1]].n+'.'},
  act(d,u,a){if(a.op!=='sub'||!nums(a.vals,d.L+1))return null;let ok=0;for(let i=0;i<d.L;i++)if(a.vals[i]===d.rec[i])ok++;const hOk=a.vals[d.L]===d.heat;
    if(ok===d.L&&hOk)return {ok:true};return {wrong:(ok===d.L?'Die Erze stimmen, aber die Glut ist falsch.':ok+' von '+d.L+' Erzen liegen richtig.')}}
};
function pzOf(id){if(id==='w:forge')return FORGE;const p=px(id);return p&&PZ[p]?PZ[p]:null}
function isStation(id){return !!pzOf(id)}

/* ---------- Welt ---------- */
const CW=17,CH=14,RW=13,RH=9,AW=RW-2,AH=RH-2;
const SYM=['fire','water','leaf','sun'],SYMN={fire:'Flamme',water:'Wellen',leaf:'Blatt',sun:'Sonne'};
const THEME={pool:{floor:[6],wall:[8,8,8,9,10,11]},boulder:{floor:[0,1,2],ring:3,wall:[0,1,0,14]},beam:{floor:[9,9,16],ring:0,wall:[15,0,15,1]},rails:{floor:[4,3,4],ring:3,wall:[12,14,12,0]},dark:{floor:[0,2,0,1],wall:[0,1,0]},forge:{floor:[6,6,22,6],wall:[8,10,8,11]},finale:{floor:[8,6,6],wall:[8,9,10,8,11]},tunnel:{floor:[3],wall:[0,1,0,0]}};
function typeOf(id){if(id==='finale')return 'finale';if(id==='w:forge')return 'forge';if(id&&id.indexOf('w:')===0)return id.slice(2);return 'pool'}

/* Felsbrocken: rückwärts gezogen, dadurch immer lösbar */
function genBoulder(rnd,st){
  const nb=st>=5?3:2,K=st<=2?7:(st<=4?14:20),nr=st<=2?3:(st<=4?5:6);
  const EW=AW+2,EH=AH+2,inA=(x,y)=>x>=1&&y>=1&&x<=AW&&y<=AH,inE=(x,y)=>x>=0&&y>=0&&x<EW&&y<EH;
  const D=[[0,1],[-1,0],[1,0],[0,-1]];
  for(let tries=0;tries<300;tries++){
    const rock=new Set(),key=(x,y)=>x+','+y;
    for(let i=0;i<nr;i++){const x=1+Math.floor(rnd()*AW),y=1+Math.floor(rnd()*AH);rock.add(key(x,y))}
    const free=(x,y,boxes)=>inE(x,y)&&!rock.has(key(x,y))&&!boxes.some(b=>b[0]===x&&b[1]===y);
    const goals=[];
    for(let t=0;t<60&&goals.length<nb;t++){const x=2+Math.floor(rnd()*(AW-2)),y=2+Math.floor(rnd()*(AH-2));if(!rock.has(key(x,y))&&!goals.some(g=>Math.abs(g[0]-x)+Math.abs(g[1]-y)<2))goals.push([x,y])}
    if(goals.length<nb)continue;
    let boxes=goals.map(g=>g.slice());
    let pl=null;
    for(let t=0;t<40&&!pl;t++){const b=boxes[Math.floor(rnd()*nb)],d=D[Math.floor(rnd()*4)],x=b[0]+d[0],y=b[1]+d[1];if(free(x,y,boxes))pl=[x,y]}
    if(!pl)continue;
    let pulls=0;
    for(let step=0;step<K*6&&(pulls<K||boxes.some(b=>goals.some(g=>g[0]===b[0]&&g[1]===b[1])));step++){
      /* erreichbare Felder */
      const seen=new Set([key(pl[0],pl[1])]),q=[pl],cand=[];
      while(q.length){const p=q.shift();
        D.forEach(d=>{const bx=p[0]+d[0],by=p[1]+d[1],bi=boxes.findIndex(b=>b[0]===bx&&b[1]===by);
          if(bi>=0){const nx=p[0]-d[0],ny=p[1]-d[1];if(inA(p[0],p[1])&&free(nx,ny,boxes))cand.push([p,d,bi])}
          else if(free(bx,by,boxes)&&!seen.has(key(bx,by))){seen.add(key(bx,by));q.push([bx,by])}});
      }
      if(!cand.length)break;
      const c=cand[Math.floor(rnd()*cand.length)],p=c[0],d=c[1];
      boxes[c[2]]=[p[0],p[1]];pl=[p[0]-d[0],p[1]-d[1]];pulls++;
    }
    if(pulls<K||boxes.some(b=>goals.some(g=>g[0]===b[0]&&g[1]===b[1])))continue;
    /* vom Rand aus erreichbar? */
    const seen=new Set(),q=[];
    for(let x=0;x<EW;x++)for(let y=0;y<EH;y++)if(!inA(x,y)&&free(x,y,boxes)){seen.add(key(x,y));q.push([x,y])}
    while(q.length){const p=q.shift();D.forEach(d=>{const x=p[0]+d[0],y=p[1]+d[1];if(free(x,y,boxes)&&!seen.has(key(x,y))){seen.add(key(x,y));q.push([x,y])}})}
    if(!seen.has(key(pl[0],pl[1])))continue;
    /* kein Brocken darf schon am Rand kleben und unbeweglich sein: mindestens ein Schub muss möglich sein (garantiert durch Rückwärtszug) */
    const out={rocks:[...rock].map(s=>s.split(',').map(Number)).map(p=>[p[0]-1,p[1]-1]),goals:goals.map(g=>[g[0]-1,g[1]-1]),boxes:boxes.map(b=>[b[0]-1,b[1]-1]),pulls:pulls};
    const need=st<=2?3:(st<=4?5:7),mn=boulderMin(out,need+8,st>=5?900:12000);
    if(mn<need&&tries<120)continue;
    out.min=mn;return out;
  }
  return {rocks:[],goals:[[5,3],[7,3]],boxes:[[3,3],[3,5]],pulls:0};
}


/* kürzeste Lösung (Anzahl Schübe) für einen Felsbrocken-Raum, Spieler startet am Rand */
function boulderMin(d,cap,lim){
  const rock=new Set(d.rocks.map(p=>p.join())),inA=(x,y)=>x>=0&&y>=0&&x<AW&&y<AH,inE=(x,y)=>x>=-1&&y>=-1&&x<=AW&&y<=AH,goal=new Set(d.goals.map(p=>p.join()));
  const D=[[1,0],[-1,0],[0,1],[0,-1]];
  function reach(bs,start){const bset=new Set(bs.map(b=>b.join())),seen=new Set(),q=[];start.forEach(s=>{const k=s.join();if(!bset.has(k)&&!rock.has(k)&&!seen.has(k)){seen.add(k);q.push(s)}});
    while(q.length){const c=q.pop();for(const [dx,dy] of D){const n=[c[0]+dx,c[1]+dy],k=n.join();if(inE(n[0],n[1])&&!seen.has(k)&&!bset.has(k)&&!rock.has(k)){seen.add(k);q.push(n)}}}return seen}
  const ring=[];for(let x=-1;x<=AW;x++){ring.push([x,-1]);ring.push([x,AH])}for(let y=0;y<AH;y++){ring.push([-1,y]);ring.push([AW,y])}
  const key=(bs,r)=>{let m='~';r.forEach(k=>{if(k<m)m=k});return bs.map(b=>b.join()).sort().join('|')+'#'+m};
  let r0=reach(d.boxes,ring),front=[{bs:d.boxes,r:r0}],seen=new Set([key(d.boxes,r0)]),depth=0;
  while(front.length&&depth<=cap){const nx=[];
    for(const st of front){if(st.bs.every(b=>goal.has(b.join())))return depth;
      st.bs.forEach((b,i)=>{for(const [dx,dy] of D){const from=(b[0]-dx)+','+(b[1]-dy),to=[b[0]+dx,b[1]+dy];if(!st.r.has(from)||!inA(to[0],to[1])||rock.has(to.join())||st.bs.some(q=>q[0]===to[0]&&q[1]===to[1]))continue;
        const bs=st.bs.map(q=>q.slice());bs[i]=to;const r=reach(bs,[b]),k=key(bs,r);if(seen.has(k))continue;seen.add(k);nx.push({bs:bs,r:r})}})}
    front=nx;depth++;if(seen.size>(lim||12000))return cap+1}
  return cap+1;
}
/* Kristallstrahl: Weg mit Spiegeln vorwärts bauen, dann Kristalle verdrehen */
const DIRV={E:[1,0],N:[0,-1],W:[-1,0],S:[0,1]};
function reflect(dx,dy,o){return o==='/'?[-dy,-dx]:[dy,dx]}
function beamTrace(d,o){
  let x=d.src[0],y=d.src[1],dx=1,dy=0;const pts=[[x,y]];
  for(let s=0;s<120;s++){
    x+=dx;y+=dy;
    if(x<0||y<0||x>=AW||y>=AH){pts.push([x-dx*.5,y-dy*.5]);return {pts:pts,hit:false}}
    if(x===d.tgt[0]&&y===d.tgt[1]){pts.push([x,y]);return {pts:pts,hit:true}}
    const m=d.mir.findIndex(q=>q.x===x&&q.y===y);
    if(m>=0){pts.push([x,y]);const r=reflect(dx,dy,o[m]);dx=r[0];dy=r[1]}
  }
  return {pts:pts,hit:false};
}
function genBeam(rnd,st){
  const turns=st<=2?2:(st<=4?3:4),decoys=st<=2?1:(st<=4?2:3);
  for(let tries=0;tries<500;tries++){
    const r=1+Math.floor(rnd()*(AH-2));
    let x=0,y=r,dx=1,dy=0;const path=new Set(['0,'+r]),cnt=new Map([['0,'+r,1]]),mir=[];let ok=true;
    for(let t=0;t<=turns&&ok;t++){
      const len=2+Math.floor(rnd()*3);
      for(let i=0;i<len;i++){x+=dx;y+=dy;const k=x+','+y;if(x<1||y<0||x>=AW||y>=AH||mir.some(m=>m.x===x&&m.y===y)){ok=false;break}path.add(k);cnt.set(k,(cnt.get(k)||0)+1)}
      if(!ok)break;
      if(t<turns){
        if(cnt.get(x+','+y)>1){ok=false;break}
        const opts=shuffled([[-dy,-dx,'/'],[dy,dx,'\\']],rnd).filter(c=>{const nx=x+c[0]*2,ny=y+c[1]*2;return nx>=1&&ny>=0&&nx<AW&&ny<AH});
        if(!opts.length){ok=false;break}
        mir.push({x:x,y:y,sol:opts[0][2]});dx=opts[0][0];dy=opts[0][1];
      }
    }
    if(!ok)continue;
    const tgt=[x,y];
    if(mir.some(m=>m.x===tgt[0]&&m.y===tgt[1])||cnt.get(x+','+y)>1)continue;
    const d={src:[0,r],tgt:tgt,mir:mir.slice()};
    /* Weg nachrechnen: führt die Lösung wirklich ans Ziel, ohne über einen Spiegel doppelt zu laufen? */
    if(!beamTrace(d,mir.map(m=>m.sol)).hit)continue;
    let placed=0;
    for(let t=0;t<200&&placed<decoys;t++){const qx=1+Math.floor(rnd()*(AW-1)),qy=Math.floor(rnd()*AH),k=qx+','+qy;
      if(path.has(k)||d.mir.some(m=>Math.abs(m.x-qx)+Math.abs(m.y-qy)<2)||(qx===tgt[0]&&qy===tgt[1]))continue;
      d.mir.push({x:qx,y:qy,sol:null});placed++}
    if(!beamTrace(d,d.mir.map(m=>m.sol||'/')).hit&&!beamTrace(d,d.mir.map(m=>m.sol||'\\')).hit)continue;
    let o=null;
    for(let t=0;t<50;t++){const c=d.mir.map(()=>rnd()<.5?'/':'\\');const wrong=d.mir.filter((m,i)=>m.sol&&m.sol!==c[i]).length;if(wrong>=Math.ceil(turns/2)&&!beamTrace(d,c).hit){o=c;break}}
    if(!o)continue;
    d.o=o;d.need=turns;return d;
  }
  return {src:[0,3],tgt:[6,1],mir:[{x:3,y:3,sol:'/'},{x:3,y:1,sol:'/'}],o:['\\','\\'],need:2};
}

/* Lorenbahn: feste Gleisanlage, je Runde gespiegelt und neu beschriftet */
function genRails(rnd,st){
  const full=st>=3,flip=rnd()<.5,fy=y=>flip?AH-1-y:y;
  const P=(arr)=>arr.map(p=>[p[0],fy(p[1])]);
  const nodes=[],sw=[];
  const node=(tiles,next,end)=>{nodes.push({tiles:P(tiles),next:next,end:end});return nodes.length-1};
  /* Enden */
  const eA=node([[5,0],[6,0],[7,0],[8,0],[9,0]],null,0),eB=node([[5,2],[6,2],[7,2],[8,2],[9,2]],null,1);
  let eC,eD,down;
  sw.push({at:[2,3],outs:[null,null],lever:[3,3]});            /* Weiche 1 */
  sw.push({at:[5,1],outs:[eA,eB],lever:[6,1]});                 /* Weiche 2 */
  const up=node([[2,2],[2,1],[3,1],[4,1]],1,null);
  if(full){
    eC=node([[5,4],[6,4],[7,4],[8,4],[9,4]],null,2);eD=node([[5,6],[6,6],[7,6],[8,6],[9,6]],null,3);
    sw.push({at:[5,5],outs:[eC,eD],lever:[6,5]});
    down=node([[2,4],[2,5],[3,5],[4,5]],2,null);
  }else{
    eC=node([[2,4],[2,5],[3,5],[4,5],[5,5],[6,5],[7,5],[8,5],[9,5]],null,2);down=eC;
  }
  sw[0].outs=[up,down];
  sw.forEach(s=>{s.at=[s.at[0],fy(s.at[1])];s.lever=[s.lever[0],fy(s.lever[1])]});
  const trunk=P([[0,3],[1,3]]);
  const ends=nodes.filter(n=>n.end!=null).sort((a,b)=>a.end-b.end);
  const syms=shuffled(SYM,rnd).slice(0,ends.length);
  ends.forEach((n,i)=>{n.sym=syms[i];const t=n.tiles[n.tiles.length-1];n.marker=[t[0]+1,t[1]]});
  const nT=st>=5?2:1,targets=shuffled(ends.map(n=>n.end),rnd).slice(0,nT);
  const s0=sw.map(()=>rnd()<.5?0:1);
  /* Startstellung darf nicht schon zum ersten Ziel führen */
  const d={trunk:trunk,nodes:nodes,sw:sw,syms:syms,targets:targets,s0:s0,chute:[0,fy(2)],go:[0,fy(4)],flip:flip};
  if(railRoute(d,s0).end===targets[0])s0[0]^=1;
  /* Verbindungsmasken für die Kacheln */
  const tiles=new Map(),K=(x,y)=>x+','+y,addC=(a,b)=>{const dx=b[0]-a[0],dy=b[1]-a[1],ma=dx===1?2:dx===-1?8:dy===1?4:1,mb=dx===1?8:dx===-1?2:dy===1?1:4;
    tiles.set(K(a[0],a[1]),(tiles.get(K(a[0],a[1]))||0)|ma);tiles.set(K(b[0],b[1]),(tiles.get(K(b[0],b[1]))||0)|mb)};
  const chain=(arr)=>{for(let i=0;i+1<arr.length;i++)addC(arr[i],arr[i+1])};
  chain(trunk.concat([sw[0].at]));
  nodes.forEach(n=>{const from=sw.find(s=>s.outs.indexOf(nodes.indexOf(n))>=0);chain([from.at].concat(n.tiles));if(n.next!=null)chain([n.tiles[n.tiles.length-1],sw[n.next].at])});
  d.mask={};tiles.forEach((m,k)=>{d.mask[k]=m});
  return d;
}
function railRoute(d,s){
  let path=d.trunk.slice(),si=0,guard=0;
  while(guard++<10){const w=d.sw[si];path.push(w.at);const n=d.nodes[w.outs[s[si]]];path=path.concat(n.tiles);if(n.end!=null)return {path:path,end:n.end,sym:n.sym};si=n.next}
  return {path:path,end:-1};
}

/* Dunkle Stollen: Labyrinth über die ganze Halle */
function genDark(rnd,st,ent,ext){
  const MW=7,MH=5,cell=(i,j)=>[i*2,j*2],open=new Set(),K=(x,y)=>x+','+y;
  for(let j=0;j<MH;j++)for(let i=0;i<MW;i++)open.add(K(i*2,j*2));
  const sideCell=s=>s==='L'?[0,2]:s==='R'?[MW-1,2]:s==='T'?[3,0]:[3,MH-1];
  const e=sideCell(ent),seen=new Set([K(e[0],e[1])]),stack=[e];
  while(stack.length){const c=stack[stack.length-1],nb=shuffled([[1,0],[-1,0],[0,1],[0,-1]],rnd).map(d=>[c[0]+d[0],c[1]+d[1]]).filter(n=>n[0]>=0&&n[1]>=0&&n[0]<MW&&n[1]<MH&&!seen.has(K(n[0],n[1])));
    if(!nb.length){stack.pop();continue}const n=nb[0];seen.add(K(n[0],n[1]));open.add(K(c[0]+n[0],c[1]+n[1]));stack.push(n)}
  /* ein paar Schleifen, damit es nicht nur Sackgassen gibt */
  const loops=st<=2?6:(st<=4?4:2);
  for(let t=0,n=0;t<200&&n<loops;t++){const i=Math.floor(rnd()*MW),j=Math.floor(rnd()*MH),h=rnd()<.5;const a=[i,j],b=h?[i+1,j]:[i,j+1];if(b[0]>=MW||b[1]>=MH)continue;const k=K(a[0]+b[0],a[1]+b[1]);if(open.has(k))continue;open.add(k);n++}
  /* Abstand vom Eingang */
  const dist=new Map([[K(e[0]*2,e[1]*2),0]]),q=[[e[0]*2,e[1]*2]];
  while(q.length){const p=q.shift();[[1,0],[-1,0],[0,1],[0,-1]].forEach(d=>{const x=p[0]+d[0],y=p[1]+d[1];if(open.has(K(x,y))&&!dist.has(K(x,y))){dist.set(K(x,y),dist.get(K(p[0],p[1]))+1);q.push([x,y])}})}
  const xc=sideCell(ext||'R'),exitK=K(xc[0]*2,xc[1]*2);
  const cells=[];for(let j=0;j<MH;j++)for(let i=0;i<MW;i++){const x=i*2,y=j*2,k=K(x,y);if(k===exitK||dist.get(k)<3)continue;const deg=[[1,0],[-1,0],[0,1],[0,-1]].filter(d=>open.has(K(x+d[0],y+d[1]))).length;cells.push({x:x,y:y,d:dist.get(k)+(deg===1?6:0)+rnd()*3})}
  cells.sort((a,b)=>b.d-a.d);
  const n=st<=2?3:(st<=4?4:5),ores=[];
  for(const c of cells){if(ores.length>=n)break;if(ores.some(o=>Math.abs(o[0]-c.x)+Math.abs(o[1]-c.y)<4))continue;ores.push([c.x,c.y])}
  return {open:[...open],ores:ores};
}

function buildWorld(seed,order,P,st){
  const rnd=rngFor(seed,900),M=order.length;
  let cols=Math.min(4,M);if(M>cols&&(M-1)%cols===0)cols=3;
  const rows=Math.ceil(M/cols),W=cols*CW,H=rows*CH;
  const block=new Uint8Array(W*H).fill(1),ground=new Uint8Array(W*H).fill(0),zone=new Int8Array(W*H).fill(-2),ring=new Uint8Array(W*H);
  const ch=[],gates=[],objs=[],lights=[];
  const idx=(x,y)=>y*W+x;
  const pickF=(arr,x,y)=>arr[Math.floor(hash2(x*3+1,y*7+5)*arr.length)];
  for(let k=0;k<M;k++){
    const row=Math.floor(k/cols);let c=k%cols;if(row%2)c=cols-1-c;
    const x0=c*CW+((CW-RW)>>1),y0=row*CH+((CH-RH)>>1);
    ch.push({k:k,id:order[k],type:typeOf(order[k]),x:x0,y:y0,cx:x0+(RW>>1),cy:y0+(RH>>1),ent:null,ext:null,side:[]});
  }
  for(let k=0;k<M-1;k++){const a=ch[k],b=ch[k+1];if(a.y===b.y){if(b.x>a.x){a.ext='R';b.ent='L'}else{a.ext='L';b.ent='R'}}else{a.ext='B';b.ent='T'}}
  function open(x,y,g,z){const i=idx(x,y);block[i]=0;ground[i]=g;zone[i]=z}
  ch.forEach(r=>{const th=THEME[r.type];
    for(let y=r.y;y<r.y+RH;y++)for(let x=r.x;x<r.x+RW;x++){
      const isRing=x===r.x||y===r.y||x===r.x+RW-1||y===r.y+RH-1;
      const g=(th.ring!=null&&isRing)?th.ring:pickF(th.floor,x,y);
      open(x,y,g,r.k);if(th.ring!=null&&isRing)ring[idx(x,y)]=1;
    }});
  /* Gänge und Tore */
  for(let k=0;k<M-1;k++){
    const a=ch[k],b=ch[k+1];
    if(a.y===b.y){
      const dx=b.x>a.x?1:-1,xs=dx>0?a.x+RW:b.x+RW,xe=dx>0?b.x-1:a.x-1;
      for(let x=Math.min(xs,xe);x<=Math.max(xs,xe);x++)for(let y=a.cy-1;y<=a.cy+1;y++)open(x,y,3,-1);
      const gx=dx>0?a.x+RW:a.x-1;gates.push({k:k,kind:'rubble',tiles:[0,1,2].map(i=>({x:gx,y:a.cy-1+i})),anim:0});
      const sx=dx>0?b.x-1:b.x+RW;b.side=[[sx,b.cy-1],[sx,b.cy+1]];
    }else{
      for(let y=a.y+RH;y<=b.y-1;y++)for(let x=a.cx-1;x<=a.cx+1;x++)open(x,y,3,-1);
      gates.push({k:k,kind:'portcullis',tiles:[0,1,2].map(i=>({x:a.cx-1+i,y:a.y+RH})),anim:0});
      b.side=[[b.cx-1,b.y-1],[b.cx+1,b.y-1]];
    }
  }
  const put=(o)=>{objs.push(o);if(o.solid!==false)(o.cells||[[o.x,o.y]]).forEach(c=>{block[idx(c[0],c[1])]=1});return o};
  const free=(x,y)=>!block[idx(x,y)]&&!objs.some(o=>o.x===x&&o.y===y);
  const deco=(r,kinds,n,avoid)=>{
    for(const kind of shuffled(kinds,rnd).slice(0,n)){
      for(let t=0;t<40;t++){const x=r.x+Math.floor(rnd()*RW),y=r.y+Math.floor(rnd()*RH);
        if(Math.abs(x-r.cx)<=1||Math.abs(y-r.cy)<=1||!free(x,y)||(avoid&&avoid(x,y)))continue;
        put({t:'obj',im:kind,x:x,y:y,w:kind==='obj_crates'||kind==='obj_table'||kind==='obj_brokencart'?1.1:.9});if(kind==='obj_brazier'||kind==='obj_lantern')lights.push([x+.5,y+.2,2.4,.8]);break}
    }
  };
  ch.forEach(r=>{
    const k=r.k,t=r.type,stR=rngFor(seed,1300+k),ax=r.x+1,ay=r.y+1;
    r.pz=null;
    if(t==='pool'){
      ground[idx(r.cx,r.cy)]=23;put({t:'station',im:'int_tablet',x:r.cx,y:r.cy,k:k,w:1});
      [[r.x+2,r.y+1],[r.x+RW-3,r.y+1],[r.x+2,r.y+RH-2],[r.x+RW-3,r.y+RH-2]].forEach((p,i)=>{if(free(p[0],p[1]))put({t:'big',im:i%3===2?'big_pillar_cracked':'big_pillar',x:p[0],y:p[1],w:.9})});
      [[r.x,r.y],[r.x+RW-1,r.y],[r.x,r.y+RH-1],[r.x+RW-1,r.y+RH-1]].forEach(p=>{if(free(p[0],p[1])&&rnd()<.7){put({t:'obj',im:'obj_brazier',x:p[0],y:p[1],w:.85});lights.push([p[0]+.5,p[1]+.2,2.6,.85])}});
      deco(r,['obj_barrel','obj_crate','obj_crates','obj_statue','obj_mushroom','obj_sack','obj_bench','obj_stalagmite','obj_tankard','obj_rope','obj_coins'],4);
      if(k===0){put({t:'npc',im:'npc_gatekeeper',x:r.cx-3,y:r.cy-2,who:'gate'});}
    }else if(t==='boulder'){
      const d=genBoulder(stR,st);r.pz=d;
      d.rocks.forEach((p,i)=>put({t:'obj',im:i%3===1?'obj_stalagmite':'obj_rock',x:ax+p[0],y:ay+p[1],w:1}));
      d.goals.forEach(p=>{ground[idx(ax+p[0],ay+p[1])]=23});
      put({t:'tablet',im:'int_tablet',x:r.side[0][0],y:r.side[0][1],k:k,w:.9});
      put({t:'reset',im:'int_lever_up',x:r.side[1][0],y:r.side[1][1],k:k,w:.9});
    }else if(t==='beam'){
      const d=genBeam(stR,st);r.pz=d;
      put({t:'sun',im:'int_sun',x:ax+d.src[0],y:ay+d.src[1],k:k,w:.9});lights.push([ax+d.src[0]+.5,ay+d.src[1],2.6,.9]);
      put({t:'target',im:'int_target_off',x:ax+d.tgt[0],y:ay+d.tgt[1],k:k,w:.9});
      d.mir.forEach((m,i)=>put({t:'crystal',im:'int_crystal',x:ax+m.x,y:ay+m.y,k:k,i:i,w:.85}));
      put({t:'tablet',im:'int_tablet',x:r.side[0][0],y:r.side[0][1],k:k,w:.9});
      [[r.x,r.y],[r.x+RW-1,r.y+RH-1]].forEach(p=>{if(free(p[0],p[1])){put({t:'big',im:'big_crystal',x:p[0],y:p[1],w:1.2});lights.push([p[0]+.5,p[1],1.8,.5])}});
    }else if(t==='rails'){
      const d=genRails(stR,st);r.pz=d;
      put({t:'chute',im:'chute',x:ax+d.chute[0],y:ay+d.chute[1],k:k,w:1.15});
      put({t:'golever',im:'int_lever_up',x:ax+d.go[0],y:ay+d.go[1],k:k,w:.9});
      d.sw.forEach((s,i)=>put({t:'swlever',im:'sw_left',x:ax+s.lever[0],y:ay+s.lever[1],k:k,i:i,w:.85}));
      d.nodes.forEach(n=>{if(n.end!=null)put({t:'marker',im:'rune_'+n.sym,x:ax+n.marker[0],y:ay+n.marker[1],k:k,sym:n.sym,w:.9})});
      put({t:'tablet',im:'int_tablet',x:r.side[0][0],y:r.side[0][1],k:k,w:.9});
      for(let y=r.y;y<r.y+RH;y++)for(let x=r.x;x<r.x+RW;x++){if(!ring[idx(x,y)]&&!d.mask[(x-ax)+','+(y-ay)]&&hash2(x,y)<.25)ground[idx(x,y)]=3}
    }else if(t==='dark'){
      const d=genDark(stR,st,r.ent,r.ext);r.pz=d;
      const op=new Set(d.open);
      for(let y=r.y;y<r.y+RH;y++)for(let x=r.x;x<r.x+RW;x++){if(!op.has((x-r.x)+','+(y-r.y))){block[idx(x,y)]=1}}
      put({t:'lectern',im:'int_lectern',x:r.side[0][0],y:r.side[0][1],k:k,w:1});
      put({t:'lanternhook',im:'int_lantern',x:r.side[1][0],y:r.side[1][1],k:k,w:.8});
    }else if(t==='forge'){
      /* Kommt der Gang von oben, rückt das Schmiedegebäude in die Ecke, damit der Eingang frei bleibt */
      const fx=r.ent==='T'?(r.ext==='L'?r.x+RW-3:r.x+2):r.cx;
      for(let y=r.y;y<=r.y+1;y++)for(let x=fx-1;x<=fx+1;x++)block[idx(x,y)]=1;
      put({t:'big',im:'big_forge',x:fx,y:r.y+1,w:3.2,solid:false});lights.push([fx+.5,r.y+1.4,3.2,1]);
      put({t:'station',im:'anvil',x:r.cx,y:r.cy,k:k,w:1});
      put({t:'npc',im:'npc_smith',x:r.cx+2,y:r.cy-2,who:'smith'});
      [['quench',fx-2,r.y+2],['bellows',fx+2,r.y+2],['crucible',r.cx-2,r.cy+2],['obj_sack',r.x+1,r.y+RH-2],['ore_coal',r.x+RW-2,r.y+RH-2],['hammer',r.cx+2,r.cy+2]].forEach(q=>{if(free(q[1],q[2]))put({t:'obj',im:q[0],x:q[1],y:q[2],w:.85})});
      [[r.x,r.y],[r.x+RW-1,r.y]].forEach(p=>{if(free(p[0],p[1])){put({t:'obj',im:'obj_brazier',x:p[0],y:p[1],w:.85});lights.push([p[0]+.5,p[1]+.2,2.4,.8])}});
    }else if(t==='finale'){
      for(let y=r.y;y<=r.y+1;y++)for(let x=r.cx-2;x<=r.cx+2;x++)block[idx(x,y)]=1;
      put({t:'gate',im:'big_gate_closed',x:r.cx,y:r.y+1,w:5.2,solid:false,k:k});
      const right=r.ent!=='R';
      const dx0=right?r.x+RW-5:r.x,dy0=r.y+RH-4;
      const cells=[];for(let y=dy0;y<dy0+4;y++)for(let x=dx0;x<dx0+5;x++)cells.push([x,y]);
      cells.forEach(c=>{ground[idx(c[0],c[1])]=17});
      put({t:'dragon',x:dx0+2,y:dy0+3,cells:cells,flip:!right,k:k});
      [[r.cx-4,r.y+1],[r.cx+4,r.y+1]].forEach(p=>{put({t:'big',im:'big_pillar',x:p[0],y:p[1],w:.9});});
      [[r.cx-3,r.y+2],[r.cx+3,r.y+2]].forEach(p=>{put({t:'obj',im:'obj_brazier',x:p[0],y:p[1],w:.85});lights.push([p[0]+.5,p[1]+.2,2.6,.9])});
      r.plates=[];const PP=[[0,2],[-1,2],[1,2],[-2,2],[2,2],[0,3]];
      for(let i=0;i<P;i++){const x=r.cx+PP[i][0],y=r.y+PP[i][1];r.plates.push({x:x,y:y});ground[idx(x,y)]=6}
      for(let i=0;i<4;i++){const x=(right?r.x+1:r.x+RW-2),y=r.y+3+i;if(free(x,y)&&i%2)put({t:'obj',im:i===1?'obj_coins':'obj_bones',x:x,y:y,w:.8,solid:false})}
    }
  });
  /* Wandkacheln wählen */
  const wallv=new Uint8Array(W*H);
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){
    const i=idx(x,y);if(!block[i])continue;
    const below=y+1<H&&!block[idx(x,y+1)];
    if(zone[i]>=-1){wallv[i]=255;continue} /* Objekt auf Boden, kein Fels */
    if(below){const z=zone[idx(x,y+1)],th=THEME[z>=0?ch[z].type:'tunnel'];const v=th.wall[Math.floor(hash2(x*5+2,y*3+1)*th.wall.length)];wallv[i]=v;if(v===10)lights.push([x+.5,y+.9,2.2,.75])}
    else{const below2=y+2<H&&!block[idx(x,y+2)]&&block[idx(x,y+1)]&&zone[idx(x,y+1)]<-1;wallv[i]=below2?3:2}
  }
  /* Labyrinth-Wände in den dunklen Stollen sind echter Fels */
  ch.forEach(r=>{if(r.type!=='dark')return;for(let y=r.y;y<r.y+RH;y++)for(let x=r.x;x<r.x+RW;x++){const i=idx(x,y);if(block[i]&&!objs.some(o=>o.x===x&&o.y===y)){const below=y+1<H&&!block[idx(x,y+1)];wallv[i]=below?[0,1,0,14][Math.floor(hash2(x,y)*4)]:2}}});
  return {W:W,H:H,block:block,ground:ground,zone:zone,ring:ring,wallv:wallv,ch:ch,gates:gates,objs:objs,lights:lights,M:M,cols:cols};
}
function gateAt(x,y){const w=G.world;if(!w)return null;for(const g of w.gates)for(const t of g.tiles)if(t.x===x&&t.y===y)return g;return null}
function gateOpen(g){return G.found[g.k]||G.ci>g.k}
function zoneAt(x,y){const w=G.world;if(!w||x<0||y<0||x>=w.W||y>=w.H)return -2;return w.zone[y*w.W+x]}

/* ---------- Zustand der Welt-Rätsel ---------- */
function chCur(){return G.world?G.world.ch[Math.min(G.ci,G.world.M-1)]:null}
function initSub(r){
  if(!r||!r.pz)return {};
  if(r.type==='boulder')return {b:r.pz.boxes.map(p=>p.slice())};
  if(r.type==='beam')return {o:r.pz.o.slice()};
  if(r.type==='rails')return {s:r.pz.s0.slice(),del:0};
  if(r.type==='dark')return {got:r.pz.ores.map(()=>false),holder:-1};
  return {};
}
/* Stand eines Raums zum Zeichnen: aktuell, gelöst oder unberührt */
function viewSub(r){
  if(r.k===G.ci&&G.sub)return G.sub;
  if(r.k<G.ci||G.phase==='won'){
    if(r.type==='boulder')return {b:r.pz.goals.map(p=>p.slice())};
    if(r.type==='beam')return {o:r.pz.mir.map((m,i)=>m.sol||r.pz.o[i])};
    if(r.type==='rails'){const s=r.pz.s0.slice();return {s:s,del:r.pz.targets.length,doneEnd:r.pz.targets[r.pz.targets.length-1]}}
    if(r.type==='dark')return {got:r.pz.ores.map(()=>true),holder:-1};
    return {};
  }
  return r._init||(r._init=initSub(r));
}
function boulderAt(x,y){
  const w=G.world;if(!w)return null;const z=zoneAt(x,y);if(z<0)return null;const r=w.ch[z];if(r.type!=='boulder')return null;
  const v=viewSub(r),ax=r.x+1,ay=r.y+1;const i=v.b.findIndex(p=>p[0]+ax===x&&p[1]+ay===y);return i>=0?{r:r,i:i}:null;
}
function walkable(x,y){
  const w=G.world;if(!w||x<0||y<0||x>=w.W||y>=w.H)return false;
  if(w.block[y*w.W+x])return false;
  const g=gateAt(x,y);if(g&&!gateOpen(g))return false;
  if(boulderAt(x,y))return false;
  return true;
}

/* ---------- Spieler ---------- */
let ents=[];
function newEnt(i,x,y){return {i:i,x:x,y:y,rx:x,ry:y,dir:0,anim:0,moving:false,lastStep:0}}
function spawnFor(world,ci,i){
  const r=world.ch[clamp(ci,0,world.M-1)],off=[0,-1,1,-2,2,-3][i]||0;
  let p;
  if(ci===0)p=[r.cx+off,r.cy+2];
  else if(r.type==='dark')p=r.ent==='L'?[r.x,r.cy]:r.ent==='R'?[r.x+RW-1,r.cy]:[r.cx,r.y];
  else if(r.ent==='L')p=[r.x+(r.type==='finale'?1:0),r.cy+off];
  else if(r.ent==='R')p=[r.x+RW-1-(r.type==='finale'?1:0),r.cy+off];
  else p=[r.cx+off,r.y];
  return {x:p[0],y:p[1]};
}
function meEnt(){return ents[G.me]||null}

/* ---------- Drachenauge (gemeinsamer Takt über die Startzeit der Runde) ---------- */
let EYE=[];
function buildEye(seed,st){
  const rnd=rngFor(seed,4242);EYE=[];let t=0;
  const C=st<=2?[5,8.5]:(st<=4?[3.6,6.5]:[2.6,5]),Wn=st<=2?1.6:(st<=4?1.2:.95),O=st<=2?[2,3]:(st<=4?[2.2,3.4]:[2.5,4]);
  for(let i=0;i<1500;i++){const c=lerp(C[0],C[1],rnd()),o=lerp(O[0],O[1],rnd());EYE.push({c0:t,w0:t+c,o0:t+c+Wn,end:t+c+Wn+o});t+=c+Wn+o}
}
function eyeState(){
  if(!EYE.length)return {st:'closed',i:-1,since:0};
  const t=(Date.now()-G.epoch)/1000;
  let lo=0,hi=EYE.length-1;while(lo<hi){const m=(lo+hi)>>1;if(EYE[m].end<=t)lo=m+1;else hi=m}
  const e=EYE[lo];
  if(t<e.w0)return {st:'closed',i:lo,since:t-e.c0,left:e.w0-t};
  if(t<e.o0)return {st:'warn',i:lo,since:t-e.w0,left:e.o0-t};
  return {st:'open',i:lo,since:t-e.o0,openAt:G.epoch+e.o0*1000,left:e.end-t};
}

/* ---------- Spielstart ---------- */
const lobby=$('#lobby'),endEl=$('#end'),hud=$('#hud'),pad=$('#pad'),abtn=$('#abtn');
function myPeer(){
  if(!RM.named)return null;
  const ps=RM.named.peers();
  for(let i=0;i<ps.length;i++)if(ps[i].isMe&&ps[i].sameTab)return ps[i].peer;
  return null;
}
function makeOrder(mode,seed){
  const rnd=rngFor(seed,77),wt=shuffled(WORLD_TYPES,rnd);let k=0;
  const tpl=MODES[mode].tpl.map(id=>id==='W'?wt[(k++)%wt.length]:id);
  return expandOrder(tpl,seed,'raum');
}
function genData(seed,P,order,st){
  const D={};
  order.forEach((id,k)=>{const p=pzOf(id);if(p)D[id]=p.gen(rngFor(seed,k+1),st,P)});
  return D;
}
function beginGame(sp){
  G.rot=sp.rot===undefined?1:(sp.rot|0);
  closeModal(true);closeDialog();
  const mode=MODES[sp.mode]?sp.mode:'short';
  G.mode=mode;G.order=makeOrder(mode,sp.seed);
  const P=sp.roster?clamp(sp.roster.length,1,6):1;
  G.P=P;G.epoch=sp.epoch;G.seed=sp.seed;G.total=sp.total;G.roster=sp.roster||[];G.solo=!sp.roster;G.hostPeer=sp.host||null;
  G.sets=ROLE_SETS[P];G.stage=clamp(sp.stage|0||3,1,6);applyStage(G.stage);
  G.genP=(sp.genP|0)||P;G.data=genData(sp.seed,G.genP,G.order,G.stage);
  G.world=buildWorld(sp.seed,G.order,G.genP,G.stage);buildEye(sp.seed,G.stage);
  const my=sp.roster?G.roster.indexOf(myPeer()):0;
  G.me=my;G.spectator=!G.solo&&my<0;
  G.roles=G.solo?ROLE_SETS[1][0].slice():(my>=0?G.sets[my]:[]);
  G.found=new Array(G.order.length).fill(false);G.hintsTotal=0;G.attempts=0;G.caught=0;G.locked=false;
  G.phase='play';G.deadline=performance.now()+sp.total*1000;G.endRemaining=0;
  ents=[];for(let i=0;i<P;i++){const s=spawnFor(G.world,0,i);ents.push(newEnt(i,s.x,s.y))}
  parts.length=0;pet.x=null;nextRumble=performance.now()+25000;
  setCi(0,true);
  lobby.hidden=true;endEl.hidden=true;hud.hidden=false;pad.hidden=false;abtn.hidden=false;$('#lobbybg').hidden=true;playIntro();
  if(G.spectator){const r=G.world.ch[0];cam.x=r.cx;cam.y=r.cy;toast('Du bist gerade dazugekommen und wirst gleich in die Gruppe aufgenommen.')}
  else if(!G.solo&&G.roles.length)toast('Deine Rolle: '+G.roles.map(r=>ROLE_NAME[r]).join(' und '),4200);
  if(!G.spectator)showDialog([{who:'Torwächter Odvar',text:'Ihr Lehrlinge! Ihr habt beim Graben die Höhle des alten Drachen geöffnet. Hört ihr das Grollen? Er wacht langsam auf.'},{who:'Torwächter Odvar',text:'Das Runentor nach draußen öffnet nur ein Runenschlüssel aus der Schmiede. Der Weg dorthin führt durch '+(G.order.length-2)+' Hallen, und in jeder wartet eine Aufgabe.'},{who:'Torwächter Odvar',text:'Der Pfeil zeigt euch den Weg. Mit A sprecht ihr mit Leuten und benutzt Dinge. Lest die Steintafeln, dort steht, was zu tun ist. Und redet miteinander!'}]);
}
let introT=0;
function playIntro(){
  const el=$('#intro');if(!el||G.spectator)return;
  clearTimeout(introT);el.hidden=false;el.classList.remove('out');
  const end=()=>{clearTimeout(introT);el.classList.add('out');setTimeout(()=>{el.hidden=true},1500)};
  el.onclick=end;introT=setTimeout(end,16000);
}
function setCi(i,first){
  G.ci=i;G.cur=G.order[i];G.chHints=0;G.feedback='';G.fbBad=false;G.locked=false;G.doneSched=-1;
  if(!G.solo&&!G.spectator&&G.me>=0&&G.P>1){const nr=G.sets[(G.me+(G.rot?G.ci:0))%G.P];const ch=G.ci>0&&nr.join()!==G.roles.join();G.roles=nr.slice();if(ch)setTimeout(()=>{if(G.phase==='play')toast('Rollenwechsel! Du bist jetzt '+G.roles.map(r=>ROLE_NAME[r]).join(' und ')+'.',5000)},3400)}
  G.tab=G.roles[0]||null;
  const p=pzOf(G.cur);G.pu=p?p.init(G.data[G.cur]):null;
  G.sub=initSub(G.world.ch[i]);G.subV=0;rail.run=null;pendingPick={};
  paintHud();
  if(!first)toast(G.cur==='finale'?'Der Runenschlüssel glüht! Auf zum Runentor, aber leise ...':'Halle '+(i+1)+': '+chName(i)+'. Folgt dem Pfeil.',3600);
}
function chName(i){const id=G.order[i],t=typeOf(id),p=pzOf(id);
  return t==='pool'?(p?p.name:''):({boulder:'Die Felsbrocken',beam:'Der Kristallstrahl',rails:'Die Lorenbahn',dark:'Die dunklen Stollen',forge:'Die Schmiede',finale:'Am Drachen vorbei'})[t]}
function startSolo(){
  initAudio();
  const st=stageFor(RM.d);
  beginGame({epoch:Date.now(),seed:(Math.random()*1e9)|0,total:Math.round(MODES[RM.mode].min*60*STAGES[st].tm),mode:RM.mode,roster:null,host:null,stage:st,rot:RM.rot});
}
function send(topic,data){if(!RM.named)return;RM.named.emit(topic,data).catch(()=>{})}
function startRoom(){
  initAudio();
  if(!RM.named)return;
  const me=myPeer();
  const others=RM.named.peers().filter(p=>p.kind==='viewer'&&p.peer!==me).map(p=>p.peer).sort();
  const roster=(me?[me]:[]).concat(others).slice(0,6);
  if(!roster.length){toast('Noch niemand in der Gruppe sichtbar. Kurz warten und nochmal tippen.');return}
  const st=stageFor(RM.d);
  send('start',{epoch:Date.now(),seed:(Math.random()*1e9)|0,total:Math.round(MODES[RM.mode].min*60*STAGES[st].tm),mode:RM.mode,roster:roster,stage:st,rot:RM.rot,genP:roster.length});
}
function newRound(){if(G.solo||!RM.named)startSolo();else startRoom()}

/* ---------- Aktionen ---------- */
function act(d){
  if(G.phase!=='play')return;
  d.epoch=G.epoch;d.ci=G.ci;
  if(G.solo)handleAct(d,true);else send('act',d);
}
const rail={run:null};
let pendingPick={};
function bump(){G.subV++}
function scheduleDone(){
  if(G.doneSched===G.ci)return;G.doneSched=G.ci;
  const ep=G.epoch,ci=G.ci;
  setTimeout(()=>{if(G.epoch===ep&&G.ci===ci&&G.phase==='play')chamberDone()},1000);
}
function handleAct(d,mineAct){
  if(!d||d.epoch!==G.epoch||G.phase!=='play'||d.ci!==G.ci||G.locked)return;
  const id=G.cur,r=chCur(),S=G.sub,pz=r&&r.pz;
  const meP=G.solo?0:G.me;
  if(d.type==='hint'){
    if(d.n===G.chHints+1&&d.n<=3){G.chHints=d.n;G.hintsTotal++;G.deadline-=PEN_HINT*1000;sfx('az-hinweis',.8);renderModal()}
  }else if(d.type==='x'&&pzOf(id)){
    const p=pzOf(id),res=p.act(G.data[id],G.pu,d,mineAct);
    if(!res)return;
    if(res.ok)chamberDone();
    else if(res.wrong)wrong(mineAct,res.wrong);
    else if(res.render)renderModal();
  }else if(d.type==='push'&&r.type==='boulder'){
    const i=d.i|0,b=S.b[i];if(!b||Math.abs(d.dx)+Math.abs(d.dy)!==1||b[0]!==d.bx||b[1]!==d.by)return;
    const nx=b[0]+d.dx,ny=b[1]+d.dy,ax=r.x+1,ay=r.y+1;
    if(nx<0||ny<0||nx>=AW||ny>=AH||G.world.block[(ny+ay)*G.world.W+nx+ax]||S.b.some(q=>q[0]===nx&&q[1]===ny))return;
    const ox=b[0],oy=b[1];S.b[i]=[nx,ny];bump();if(!sfx('az-felsen-schieben',.9))beep(90,.18,'square',.06);
    if(d.p===meP){const m=meEnt();if(m){m.x=ox+ax;m.y=oy+ay;m.lastStep=Date.now();sendPos()}}
    const onG=pz.goals.some(g=>g[0]===nx&&g[1]===ny);if(onG&&!sfx('az-felsen-platte',1,.25))beep(523,.2,'sine');
    if(pz.goals.every(g=>S.b.some(q=>q[0]===g[0]&&q[1]===g[1])))scheduleDone();
  }else if(d.type==='reset'&&r.type==='boulder'){
    S.b=pz.boxes.map(p=>p.slice());bump();const pen=Math.round(PEN_TRY*.6);G.deadline-=pen*1000;
    ents.forEach(e=>{if(boulderAt(e.x,e.y)){const s=spawnFor(G.world,G.ci,e.i);e.x=e.rx=s.x;e.y=e.ry=s.y}});
    toast('Die Felsbrocken rollen zurück an ihren Platz (−'+pen+' s).');rumble(.5);shake(.6);
  }else if(d.type==='rot'&&r.type==='beam'){
    const i=d.i|0;if(i<0||i>=S.o.length)return;S.o[i]=S.o[i]==='/'?'\\':'/';bump();if(!sfx('az-kristall-drehen',.9))beep(880,.12,'sine',.05);
    if(beamTrace(pz,S.o).hit){if(!sfx('az-strahl-treffer',1,.15))beep(784,.4,'sine');scheduleDone()}
  }else if(d.type==='sw'&&r.type==='rails'){
    if(rail.run)return;const i=d.i|0;if(i<0||i>=S.s.length)return;S.s[i]^=1;bump();if(!sfx('az-weiche',.9))beep(300,.1,'square',.05);
  }else if(d.type==='go'&&r.type==='rails'){
    if(rail.run)return;
    const rt=railRoute(pz,S.s),target=pz.targets[S.del],ok=rt.end===target,dur=rt.path.length*.26+.3;
    rail.run={path:rt.path,t0:performance.now(),dur:dur,ok:ok,end:rt.end,mine:d.p===meP};
    const ep=G.epoch,ci=G.ci,snd=sfx('az-lore-fahrt',.85);if(!snd)beep(140,.4,'sawtooth',.06);
    setTimeout(()=>{sfxStop(snd,.35);if(G.epoch!==ep||G.ci!==ci||G.phase!=='play')return;sfx('az-lore-ziel',1);
      if(ok){S.del++;bump();burstEnd(r,rt.end);
        if(S.del>=pz.targets.length){toast('Die Lore ist angekommen! Das Erz ist geliefert.',3200);chamberDone()}
        else{toast('Richtig geliefert! Jetzt die zweite Fuhre laut Frachtbrief.',4000);setTimeout(()=>{if(G.ci===ci)rail.run=null},1400)}}
      else{wrong(rail.run&&rail.run.mine,'Die Lore ist am falschen Ziel angekommen.');setTimeout(()=>{if(G.ci===ci)rail.run=null},1400)}
    },dur*1000);
  }else if(d.type==='lantern'&&r.type==='dark'){
    S.holder=d.p|0;bump();if(!sfx('az-laterne',.9))beep(660,.15,'sine',.05);
    if(d.p===meP)toast('Du trägst jetzt die Laterne. Die anderen sehen fast nichts, lotst euch gegenseitig!',4500);
    else toast('Jemand anderes trägt jetzt die Laterne.',2500);
  }else if(d.type==='pick'&&r.type==='dark'){
    const i=d.i|0;if(i<0||i>=S.got.length||S.got[i])return;S.got[i]=true;bump();if(!sfx('az-erz',.9))beep(1046,.3,'sine',.07);
    const o=pz.ores[i];burst(r.x+o[0]+.5,r.y+o[1]+.5,26,'#9fd8ff');
    const n=S.got.filter(Boolean).length;toast('Sternenerz gefunden! '+n+' von '+S.got.length+'.',2600);
    if(n>=S.got.length)scheduleDone();
  }else if(d.type==='caught'&&id==='finale'){
    G.caught++;G.deadline-=PEN_CAUGHT*1000;if(!sfx('az-bruellen',1))rumble(1);shake(1);eyeFlash=performance.now();
    if(d.p===meP){const m=meEnt(),s=spawnFor(G.world,G.ci,d.p|0);if(m){m.x=m.rx=s.x;m.y=m.ry=s.y;sendPos()}toast('Der Drache hat dich gesehen! Zurück zum Eingang (−'+PEN_CAUGHT+' s).',4000)}
    else toast('Der Drache hat jemanden erwischt! (−'+PEN_CAUGHT+' s)',3000);
  }else if(d.type==='done'&&id==='finale'){
    finish('won');
  }
}
function wrong(mineAct,msg){
  G.attempts++;G.deadline-=PEN_TRY*1000;if(!sfx('az-falsch',.9))beep(160,.3,'sawtooth',.1);
  if(mineAct){G.feedback=msg+' Das hat '+PEN_TRY+' Sekunden gekostet.';G.fbBad=true;const f=$('#fb');if(f){f.textContent=G.feedback;f.className='fb bad'}if(!G.modal)toast(G.feedback,4000)}
  else toast('Fehlversuch bei den anderen (−'+PEN_TRY+' s).');
  renderModal();
}
function chamberDone(){
  if(G.phase!=='play'||G.locked)return;
  const k=G.ci;
  G.found[k]=true;G.deadline=Math.min(G.deadline+BONUS*1000,performance.now()+G.total*1000);
  closeModal(true);
  if(G.order[k]==='w:forge'){if(!sfx('az-amboss',1)){beep(523,.2,'sine')}sfx('az-schluessel',.9,2.4)}
  else if(!sfx('az-richtig',.9)){beep(523,.2,'sine');setTimeout(()=>beep(784,.35,'sine'),160)}
  const r=G.world.ch[k];burst(r.cx+.5,r.cy+.5,46,'#ffd59a');burst(r.cx+.5,r.cy+.5,20,'#9fe4ff');
  const g=G.world.gates[k];
  if(g){g.anim=.0001;g.tiles.forEach(t=>burst(t.x+.5,t.y+.5,14,g.kind==='rubble'?'#9a8f88':'#ffd59a'));if(g.kind==='rubble'){if(!sfx('az-geroell',1,.6))rumble(.6);shake(.5)}else sfx('az-gitter',.8,.6)}
  const msg=G.order[k]==='w:forge'?'Der Runenschlüssel ist geschmiedet! +'+BONUS+' Sekunden.':'Halle '+(k+1)+' geschafft! +'+BONUS+' Sekunden. '+(g&&g.kind==='rubble'?'Das Geröll bricht weg.':'Das Gitter hebt sich.');
  toast(msg,3600);
  setCi(k+1,false);
}
function finish(phase){
  if(G.phase!=='play')return;
  G.endRemaining=remaining();G.phase=phase;closeModal(true);closeDialog();
  if(phase==='won'){
    gateOpenT=performance.now();
    const r=G.world.ch[G.world.M-1];
    for(let i=0;i<7;i++)setTimeout(()=>{burst(r.cx+.5+(Math.random()*4-2),r.y+1+(Math.random()*1.5),40,i%2?'#ffd59a':'#ffffff')},i*260);
    if(sfx('az-tor',1)){sfx('az-sieg',.9,2.2)}else{beep(523,.25,'sine');setTimeout(()=>beep(659,.25,'sine'),180);setTimeout(()=>beep(784,.5,'sine'),360)}
  }else{if(!sfx('az-niederlage',1)){beep(110,.8,'sawtooth',.14);rumble(1.2)}shake(1.4);eyeFlash=performance.now()}
  const ep=G.epoch;
  setTimeout(()=>{if(G.epoch===ep&&G.phase===phase)showEnd()},phase==='won'?3000:1600);
}
function showEnd(){
  const won=G.phase==='won',n=G.found.filter(Boolean).length;
  $('#endEye').textContent=won?'Entkommen!':'Der Drache ist erwacht';
  $('#endTitle').textContent=won?'Das Runentor ist offen!':'Die Zeit ist abgelaufen.';
  $('#endText').textContent=won?'Ihr seid am Drachen vorbei ins Tageslicht geschlüpft. Torwächter Odvar ist stolz auf euch.':'Der Drache hat die Augen geöffnet und lässt niemanden mehr vorbei. Mit neuen Rätseln klappt es beim nächsten Mal bestimmt.';
  $('#endSum').innerHTML='<span>Hallen <b>'+Math.min(n,G.order.length-1)+' von '+(G.order.length-1)+'</b></span><span>Zeit übrig <b>'+fmt(G.endRemaining)+'</b></span><span>Fehlversuche <b>'+G.attempts+'</b></span><span>Hinweise <b>'+G.hintsTotal+'</b></span><span>Erwischt <b>'+G.caught+'</b></span>';
  endEl.hidden=false;pad.hidden=true;abtn.hidden=true;$('#eyebar').hidden=true;
}

/* ---------- Fenster (Modal) ---------- */
const modalEl=$('#modal');
function openModal(kind){
  if(G.phase!=='play')return;
  G.modal=kind||'station';modalEl.hidden=false;held.length=0;renderModal();
}
function closeModal(silent){G.modal=false;modalEl.hidden=true;modalEl.innerHTML=''}
function guardBody(p){
  const hs=[];for(let i=1;i<=G.chHints;i++)hs.push('<div class="hint">'+esc(p.hint(G.data[G.cur],i))+'</div>');
  return '<p class="lead">Du bist für die Erklärungen zuständig. Sag der Gruppe zu Beginn, wie die Aufgabe funktioniert, und hilf allen weiter, wenn sie nicht mehr wissen, was zu tun ist.</p>'
    +'<h3 class="sub">Das erklärst du hier</h3><ul class="log">'+p.explain(G.data[G.cur]).map(t=>'<li>'+esc(t)+'</li>').join('')+'</ul>'
    +'<h3 class="sub">Allgemein</h3><ul class="log"><li>Jede Person hat eine andere Rolle und sieht andere Hinweise. Sprecht miteinander, zeigt nichts auf dem Bildschirm.</li><li>Ein Fehlversuch kostet '+PEN_TRY+' Sekunden, eine geschaffte Halle bringt '+BONUS+' Sekunden.</li></ul>'
    +hintBlock(hs);
}
function hintBlock(hs){
  return '<h3 class="sub">Wenn ihr nicht weiterkommt</h3><p class="small">Frag zuerst nach: Wer sieht was? Hilft das nicht, gibt es einen Hinweis.</p>'
    +'<div><button class="btn" data-act="hint"'+(G.chHints>=3?' disabled':'')+'>'+(G.chHints>=3?'Keine Hinweise mehr':'Hinweis anfordern (−'+PEN_HINT+' s)')+'</button></div>'
    +(hs.length?'<div class="hints">'+hs.join('')+'</div>':'');
}
function roleBody(r){
  const p=pzOf(G.cur);
  if(r==='guard'){let own='';try{own=p.role('guard',G.data[G.cur],G.pu)}catch(e){own=''}
    if(own&&own.indexOf('keinen eigenen')<0&&own.indexOf('Hilf mit')<0)own='<h3 class="sub">Deine Hinweise</h3>'+own+'<h3 class="sub">Deine Aufgabe als Wächter/in</h3>';else own='';
    return own+guardBody(p)}
  return p.role(r,G.data[G.cur],G.pu);
}
const WORLD_INFO={
  boulder:{title:'Die Felsbrocken',lines:d=>['Schiebt jeden Felsbrocken auf eine der leuchtenden Runenplatten. Erst wenn auf allen '+d.goals.length+' Platten ein Brocken liegt, bricht das Geröll am Ausgang weg.','Ihr schiebt, indem ihr gegen einen Brocken lauft. Ziehen geht nicht! Ein Brocken in einer Ecke oder an der Wand kommt dort nicht mehr weg.','Steckt ihr fest, setzt der Hebel am Eingang alles zurück. Das kostet aber Zeit.'],
    hint:(d,n)=>n===1?'Bevor ihr schiebt: Überlegt gemeinsam, welcher Brocken auf welche Platte soll, und von welcher Seite ihr ihn anschieben müsst.':n===2?'Schiebt keinen Brocken direkt an die Felswand der Halle. Von dort bekommt ihr ihn nicht mehr zurück.':'Oft muss ein Brocken zuerst ein Stück in die falsche Richtung, damit ihr hinter ihn kommt. Im Notfall: Hebel ziehen und neu planen.'},
  beam:{title:'Der Kristallstrahl',lines:d=>['Der Sonnenkristall schickt einen Lichtstrahl in die Halle. Er muss den dunklen Zielkristall treffen.','Die anderen Kristalle lenken den Strahl um. Mit A dreht ihr einen Kristall: Die helle Kante zeigt, wie er steht (/ oder \\).','Verteilt euch auf mehrere Kristalle und sagt euch gegenseitig, was ihr seht.'],
    hint:(d,n)=>n===1?'Folgt dem Strahl vom Sonnenkristall aus. Wo er gegen eine Wand läuft, muss der Kristall davor anders stehen.':n===2?'Nicht jeder Kristall wird gebraucht. Der richtige Weg führt über genau '+d.need+' Kristalle.':'Arbeitet rückwärts: Von welcher Seite kann der Strahl den Zielkristall überhaupt erreichen?'},
  rails:{title:'Die Lorenbahn',lines:d=>['Die Lore muss das Erz zu der richtigen Rune am Ende der Gleise bringen. Wohin, steht auf dem Frachtbrief am Erzlager.','Mit den Hebeln neben den Weichen stellt ihr die Weichen um. Das helle Gleis zeigt, wohin es geht.','Wenn alles stimmt, zieht jemand den Abfahrtshebel neben der Lore. Eine falsche Fahrt kostet Zeit.'+(d.targets.length>1?' Es gibt zwei Fuhren nacheinander.':'')],
    hint:(d,n)=>n===1?'Den Frachtbrief kann nur die Forscher/in lesen. Fragt sie, welche Rune das Ziel ist.':n===2?'Fahrt den Weg vom Ziel rückwärts bis zur Lore. An jeder Weiche seht ihr dann, wie sie stehen muss.':'Die erste Weiche muss nach '+((function(){const r=chCur();const rt=[0,1].map(v=>{const s=(G.sub&&G.sub.s?G.sub.s.slice():d.s0.slice());s[0]=v;return railRoute(d,s)});const want=d.targets[G.sub?G.sub.del:0];const okv=[0,1].find(v=>{for(let a=0;a<2;a++)for(let b=0;b<2;b++){const s=[v,a,b].slice(0,d.sw.length);if(railRoute(d,s).end===want)return true}return false});const nb=d.nodes[d.sw[0].outs[okv]].tiles[0],at=d.sw[0].at;return nb[1]<at[1]?'oben':'unten'})())+' zeigen.'},
  dark:{title:'Die dunklen Stollen',lines:d=>['In diesen Stollen ist es stockdunkel. Irgendwo liegen '+d.ores.length+' Brocken Sternenerz. Ihr braucht sie alle für den Runenschlüssel.','Am Eingang hängt eine Laterne. Wer sie nimmt, sieht mehr als alle anderen. Am Kartenpult sieht man, wo das Erz liegt und wo alle gerade sind.','Ein Erzbrocken wird eingesammelt, wenn jemand darauf tritt.'],
    hint:(d,n)=>n===1?'Teilt euch auf: Eine Person liest am Kartenpult die Karte vor, eine trägt die Laterne, die anderen suchen mit.':n===2?'Auf der Karte sind die Erzbrocken blaue Sterne. Die Person an der Karte sagt den Suchenden, wann sie abbiegen müssen.':'Das Erz liegt meist am Ende von Sackgassen, möglichst weit weg vom Eingang.'}
};
function worldBody(){
  const r=chCur(),wi=WORLD_INFO[r.type],d=r.pz;
  const hs=[];for(let i=1;i<=G.chHints;i++)hs.push('<div class="hint">'+esc(wi.hint(d,i))+'</div>');
  return '<ul class="log">'+wi.lines(d).map(t=>'<li>'+esc(t)+'</li>').join('')+'</ul>'+hintBlock(hs);
}
function chuteBody(){
  const r=chCur(),d=r.pz,canRead=G.roles.indexOf('research')>=0||G.spectator&&false;
  let h='<p class="lead">Am Erzlager hängt der Frachtbrief für die Lore.</p>';
  if(canRead){
    h+='<div class="card2"><h3>Frachtbrief</h3>'+d.targets.map((t,i)=>{const n=d.nodes.find(q=>q.end===t);const done=G.sub&&G.sub.del>i;return '<p>'+(d.targets.length>1?'<b>'+(i+1)+'. Fuhre:</b> ':'')+'Liefert das Erz zur Rune <img class="runeimg" alt="" src="'+ASSET+'rune_'+n.sym+'.png"> <b>'+SYMN[n.sym]+'</b>'+(done?' <span class="ok">✓ geliefert</span>':'')+'</p>'}).join('')+'</div><p class="small">Nur du kannst den Frachtbrief lesen. Sag den anderen, wohin die Lore muss.</p>';
  }else{
    h+='<p>Der Frachtbrief ist in alter Zwergenschrift geschrieben. Nur die <b>Forscher/in</b> kann ihn lesen. Fragt nach, wohin die Lore soll!</p>';
    if(G.roles.indexOf('mechanic')>=0)h+='<div class="hint">Als Mechaniker/in kennst du die Bahn: Jeder Hebel neben einer Weiche schaltet sie um. Der Hebel neben der Lore lässt sie losfahren.</div>';
    if(G.roles.indexOf('decode')>=0)h+='<div class="hint">Auf den Runensteinen am Ende der Gleise sind Zeichen eingeritzt: Flamme, Wellen, Blatt und Sonne.</div>';
  }
  return h;
}
function mapBody(){return '<p class="lead">Die alte Karte der Stollen. Blaue Sterne zeigen das Sternenerz, die Punkte zeigen, wo ihr gerade seid. Die Laterne ist gelb umrandet.</p><canvas class="mapcv" id="mapcv" width="390" height="270"></canvas><p class="small">Bleib am Pult und lotse die anderen. Sobald du losläufst, schließt sich die Karte.</p>'}
function drawMap(){
  const c=$('#mapcv');if(!c)return;const g=c.getContext('2d'),r=chCur();if(!r||r.type!=='dark')return;
  const s=30,ox=0,oy=0;g.fillStyle='#050407';g.fillRect(0,0,c.width,c.height);
  const op=new Set(r.pz.open);
  for(let y=0;y<RH;y++)for(let x=0;x<RW;x++){if(op.has(x+','+y)){g.fillStyle='#6b5a46';g.fillRect(ox+x*s,oy+y*s,s,s);g.fillStyle='#57493a';g.fillRect(ox+x*s,oy+y*s+s-3,s,3)}}
  g.fillStyle='#ffd59a';g.font='bold 13px sans-serif';g.textAlign='center';
  g.fillText(r.ent==='L'?'▶':r.ent==='R'?'◀':'▼',ox+(r.ent==='L'?.5:r.ent==='R'?RW-.5:6.5)*s,oy+(r.ent==='T'?.7:4.6)*s);
  const S=viewSub(r);
  r.pz.ores.forEach((o,i)=>{if(S.got[i])return;const cx=ox+(o[0]+.5)*s,cy=oy+(o[1]+.5)*s;g.fillStyle='#7fd0ff';g.beginPath();for(let k=0;k<10;k++){const rr=k%2?5:12,a=-Math.PI/2+k*Math.PI/5;g.lineTo(cx+Math.cos(a)*rr,cy+Math.sin(a)*rr)}g.closePath();g.fill()});
  ents.forEach((e,i)=>{const lx=e.rx-r.x,ly=e.ry-r.y;if(lx<-1||ly<-1||lx>RW||ly>RH)return;const cx=ox+(lx+.5)*s,cy=oy+(ly+.5)*s;g.fillStyle=PHEX[i%6];g.beginPath();g.arc(cx,cy,7,0,6.3);g.fill();if(S.holder===i){g.strokeStyle='#ffe066';g.lineWidth=3;g.beginPath();g.arc(cx,cy,11,0,6.3);g.stroke()}});
}
setInterval(()=>{if(G.modal==='map')drawMap()},400);
function renderModal(){
  if(!G.modal)return;
  if(G.phase!=='play'){closeModal(true);return}
  const r=chCur();let h='<div class="box"><div class="mhead"><div><span class="eyebrow">Halle '+(G.ci+1)+' von '+(G.order.length-1)+'</span><h2>';
  if(G.modal==='station'){
    const p=pzOf(G.cur);if(!p){closeModal(true);return}
    h+=esc(p.name)+'</h2></div><button class="btn" data-act="close">Schließen</button></div>';
    if(G.spectator)h+='<p class="lead">Du schaust in dieser Runde zu und hast keine Aufgabe.</p>';
    else{
      if(G.roles.length>1)h+='<div><p class="small">Du hast mehrere Rollen:</p><div class="tabs" role="tablist">'+G.roles.map(x=>'<button class="chip" role="tab" data-act="tab" data-role="'+x+'" aria-pressed="'+(x===G.tab)+'" aria-selected="'+(x===G.tab)+'">'+ROLE_NAME[x]+'</button>').join('')+'</div></div>';
      h+='<div><span class="eyebrow">Deine Rolle</span><h3 class="sub" style="margin:2px 0 0;font-size:20px">'+ROLE_NAME[G.tab]+'</h3></div>'+roleBody(G.tab);
    }
  }else if(G.modal==='tablet'){h+=esc(WORLD_INFO[r.type].title)+'</h2></div><button class="btn" data-act="close">Schließen</button></div>'+worldBody()}
  else if(G.modal==='chute'){h+='Das Erzlager</h2></div><button class="btn" data-act="close">Schließen</button></div>'+chuteBody()}
  else if(G.modal==='map'){h+='Das Kartenpult</h2></div><button class="btn" data-act="close">Schließen</button></div>'+mapBody()}
  h+='</div>';
  const keep=modalEl.querySelector('.box');const sc=keep?keep.scrollTop:0;
  modalEl.innerHTML=h;const nb=modalEl.querySelector('.box');if(nb)nb.scrollTop=sc;
  if(G.modal==='map')drawMap();
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
const DIRS=[[0,1],[-1,0],[1,0],[0,-1]];
function objAt(x,y){const w=G.world;return w.objs.find(o=>o.x===x&&o.y===y&&o.t!=='obj'&&o.t!=='big')||w.objs.find(o=>o.cells&&o.cells.some(c=>c[0]===x&&c[1]===y))||(function(){const g=w.objs.find(o=>o.t==='gate');if(g){const r=w.ch[g.k];if(y>=r.y&&y<=r.y+1&&Math.abs(x-r.cx)<=2)return g}return null})()}
function interact(){
  if(G.phase!=='play')return;
  if(dialogOpen()){nextDialog();return}
  if(G.modal)return;
  const m=meEnt();if(!m||G.spectator)return;
  const w=G.world,f=DIRS[m.dir],cands=[[m.x+f[0],m.y+f[1]]];
  DIRS.forEach(d=>cands.push([m.x+d[0],m.y+d[1]]));
  for(const c of cands){
    const o=objAt(c[0],c[1]);
    if(o){use(o);return}
    const g=gateAt(c[0],c[1]);
    if(g&&!gateOpen(g)){showDialog([{who:g.kind==='rubble'?'Geröll':'Eisengitter',text:g.kind==='rubble'?'Ein Haufen Geröll versperrt den Gang. Wenn ihr die Aufgabe dieser Halle schafft, bricht er weg.':'Ein schweres Eisengitter. Es hebt sich, sobald ihr die Aufgabe dieser Halle geschafft habt.'}]);return}
  }
}
function here(o){return o.k===G.ci}
function use(o){
  const meP=G.solo?0:G.me,notYet=()=>showDialog([{who:'Torwächter Odvar (Erinnerung)',text:'Das kommt später dran. Folgt dem Pfeil zur aktuellen Halle.'}]),done=()=>showDialog([{who:'Zwergenrune',text:'Hier ist schon alles erledigt.'}]);
  const pending=()=>o.k<G.ci?done():notYet();
  switch(o.t){
    case 'station':if(here(o))openModal('station');else pending();break;
    case 'tablet':if(here(o))openModal('tablet');else pending();break;
    case 'chute':if(here(o))openModal('chute');else pending();break;
    case 'lectern':if(here(o))openModal('map');else pending();break;
    case 'reset':if(here(o)){if(G.sub.b.some((p,i)=>p[0]!==chCur().pz.boxes[i][0]||p[1]!==chCur().pz.boxes[i][1]))act({type:'reset'});else toast('Die Brocken liegen schon an ihrem Startplatz.')}else pending();break;
    case 'crystal':if(here(o))act({type:'rot',i:o.i});else pending();break;
    case 'swlever':if(here(o)){if(rail.run)toast('Warte, bis die Lore angekommen ist.');else act({type:'sw',i:o.i})}else pending();break;
    case 'golever':if(here(o)){if(rail.run)toast('Die Lore fährt schon.');else act({type:'go',p:meP})}else pending();break;
    case 'lanternhook':if(here(o)){if(G.sub.holder===meP)toast('Du trägst die Laterne schon.');else act({type:'lantern',p:meP})}else pending();break;
    case 'marker':showDialog([{who:'Runenstein',text:'In den Stein ist das Zeichen „'+SYMN[o.sym]+'“ geritzt. Hier endet ein Gleis.'}]);break;
    case 'sun':showDialog([{who:'Sonnenkristall',text:'Er glüht warm und schickt einen Lichtstrahl nach rechts in die Halle.'}]);break;
    case 'target':showDialog([{who:'Zielkristall',text:here(o)?'Noch dunkel. Der Lichtstrahl muss genau diesen Kristall treffen.':'Er leuchtet hell.'}]);break;
    case 'npc':npcTalk(o.who);break;
    case 'dragon':showDialog(G.cur==='finale'?[{who:'Der Drache',text:'Ein tiefes, langsames Atmen. Zwischen den Schuppen glüht es. Besser nicht wecken ...'}]:[{who:'Der Drache',text:'Er schläft. Noch.'}]);break;
    case 'gate':showDialog(G.cur==='finale'?[{who:'Das Runentor',text:'Der Runenschlüssel in eurer Tasche glüht. Stellt euch alle gleichzeitig auf die Platten vor dem Tor, dann öffnet es sich.'},{who:'Das Runentor',text:'Aber Vorsicht: Bewegt euch nur, wenn der Drache die Augen geschlossen hat!'}]:[{who:'Das Runentor',text:'Verschlossen. Ohne Runenschlüssel bewegt es sich keinen Millimeter.'}]);break;
  }
}
function npcTalk(who){
  const left=G.order.length-1-G.ci;
  if(who==='gate')showDialog(G.cur==='finale'?[{who:'Torwächter Odvar',text:'Ihr habt den Schlüssel! Jetzt nur noch am Drachen vorbei zum Tor.'}]:[{who:'Torwächter Odvar',text:'Noch '+left+(left===1?' Halle':' Hallen')+' bis zum Runentor. Folgt dem Pfeil.'},{who:'Torwächter Odvar',text:'In jeder Halle steht eine Steintafel. Lest sie, bevor ihr loslegt. Und die Wächter/in kennt die Regeln der Runentafeln.'}]);
  else showDialog(G.cur==='w:forge'?[{who:'Schmied Brokk',text:'Ah, Lehrlinge! Ihr wollt den Runenschlüssel schmieden? Das Rezept kennt keiner allein. Jeder von euch hat ein Stück davon im Kopf.'},{who:'Schmied Brokk',text:'Wer am Amboss steht, legt die Erze in den Tiegel. Die richtige Glut ist das Geheimnis der Entschlüsseler/in.'}]:[{who:'Schmied Brokk',text:'Der Schlüssel ist fertig. Jetzt geht, bevor der Drache ganz wach ist!'}]);
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
const SPEED=6;
let lastPosSend=0,pushT=0;
function stepLocal(dt){
  const m=meEnt();if(!m||G.spectator)return;
  const busy=G.modal||dialogOpen()||G.phase!=='play';
  const d=m.x-m.rx,e2=m.y-m.ry,dist=Math.hypot(d,e2);
  if(dist>0.001){const s=Math.min(dist,SPEED*dt);m.rx+=d/dist*s;m.ry+=e2/dist*s;m.anim+=dt*9;m.moving=true}
  else{m.rx=m.x;m.ry=m.y;m.moving=false}
  if(busy||dist>0.35||!held.length)return;
  const dir=held[held.length-1],v=DIRS[dir];m.dir=dir;
  const nx=m.x+v[0],ny=m.y+v[1];
  const bo=boulderAt(nx,ny);
  if(bo&&bo.r.k===G.ci){
    if(performance.now()-pushT<260)return;pushT=performance.now();
    const S=G.sub,b=S.b[bo.i],tx=b[0]+v[0],ty=b[1]+v[1],ax=bo.r.x+1,ay=bo.r.y+1;
    if(tx<0||ty<0||tx>=AW||ty>=AH||G.world.block[(ty+ay)*G.world.W+tx+ax]||S.b.some(q=>q[0]===tx&&q[1]===ty)){if(performance.now()-(m.bonk||0)>1500){m.bonk=performance.now();beep(110,.12,'square',.04)}return}
    act({type:'push',i:bo.i,bx:b[0],by:b[1],dx:v[0],dy:v[1],p:G.solo?0:G.me});
    return;
  }
  if(walkable(nx,ny)){m.x=nx;m.y=ny;m.lastStep=Date.now();sendPos();afterStep(m)}
}
function afterStep(m){
  const r=chCur();if(!r||r.type!=='dark'||G.phase!=='play')return;
  const lx=m.x-r.x,ly=m.y-r.y;
  r.pz.ores.forEach((o,i)=>{if(o[0]===lx&&o[1]===ly&&!G.sub.got[i]&&!pendingPick[i]){pendingPick[i]=1;act({type:'pick',i:i,p:G.solo?0:G.me});setTimeout(()=>{delete pendingPick[i]},2500)}});
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

/* ---------- Finale: Platten und Drachenauge ---------- */
let plateT=0,caughtI=-1,eyeFlash=0,gateOpenT=0;
function checkFinale(dt){
  const bar=$('#eyebar');
  if(G.phase!=='play'||G.cur!=='finale'||G.spectator){plateT=0;if(G.phase!=='won')bar.hidden=true;return}
  const r=G.world.ch[G.world.M-1],m=meEnt();
  const inHall=m&&zoneAt(m.x,m.y)===r.k;
  const es=eyeState();
  bar.hidden=!inHall;
  if(inHall){
    const red=performance.now()-eyeFlash<1500,img=red?'eyes_3':es.st==='open'?'eyes_0':es.st==='warn'?'eyes_1':'eyes_2';
    const ei=$('#eyeimg');if(ei.dataset.n!==img){ei.src=ASSET+img+'.png';ei.dataset.n=img}
    const tx=$('#eyetxt'),cl=es.st==='open'?'stop':es.st==='warn'?'warn':'go',txt=es.st==='open'?'STOPP! Nicht bewegen!':es.st==='warn'?'Achtung, das Auge öffnet sich ...':'Augen zu, jetzt gehen!';
    if(tx.textContent!==txt){tx.textContent=txt;tx.className=cl;if(cl==='stop'){if(!sfx('az-auge-auf',1))beep(220,.25,'sawtooth',.06)}else if(cl==='warn')beep(392,.15,'sine',.05)}
    if(es.st==='open'&&es.since>.35&&caughtI!==es.i&&m.lastStep>es.openAt+350){caughtI=es.i;act({type:'caught',p:G.solo?0:G.me})}
  }
  let n=0;
  r.plates.forEach(p=>{if(ents.some(e=>e.x===p.x&&e.y===p.y&&Math.abs(e.rx-e.x)<.3&&Math.abs(e.ry-e.y)<.3))n++});
  G.plateN=n;
  if(n>=r.plates.length)plateT+=dt;else plateT=0;
  if(plateT>1.2){plateT=-999;act({type:'done'})}
}

/* ---------- Partikel, Beben ---------- */
const parts=[];
function burst(x,y,n,col){for(let i=0;i<n;i++){const a=Math.random()*6.283,s=1+Math.random()*4;parts.push({x:x,y:y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-1,life:.7+Math.random()*.9,t:0,col:col,sz:2+Math.random()*3})}}
function burstEnd(r,end){const n=r.pz.nodes.find(q=>q.end===end);if(!n)return;const t=n.tiles[n.tiles.length-1];burst(r.x+1+t[0]+.5,r.y+1+t[1]+.5,40,'#ffd59a')}
function stepParts(dt){for(let i=parts.length-1;i>=0;i--){const p=parts[i];p.t+=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=(p.g!=null?p.g:1.4)*dt;if(p.t>p.life)parts.splice(i,1)}}
let shakeT=0,shakeA=0,nextRumble=0;
function shake(a){shakeT=performance.now();shakeA=Math.max(.2,a)}
function dragonTick(){
  if(G.phase!=='play'||!G.world)return;
  const now=performance.now();if(now<nextRumble)return;
  const p=progress();nextRumble=now+lerp(42000,13000,p)*(.7+Math.random()*.6);
  if(G.cur==='finale')return;
  rumble(.4+p*.7);shake(.35+p*.8);
  const m=meEnt();if(m)for(let i=0;i<26;i++)parts.push({x:m.rx+(Math.random()*14-7),y:m.ry-6+Math.random()*2,vx:(Math.random()-.5)*.3,vy:.5+Math.random(),g:2.2,life:2+Math.random()*1.5,t:0,col:Math.random()<.5?'#8a7f78':'#b3a89c',sz:1.5+Math.random()*2.5});
  if(p>.35&&Math.random()<.6)toast(['Der Boden bebt. Der Drache dreht sich im Schlaf um.','Ein tiefes Grollen rollt durch die Hallen.','Staub rieselt von der Decke. Der Drache wird unruhig.'][Math.floor(Math.random()*3)],2600);
}
/* Begleiter */
const pet={x:null,y:null,dir:0,anim:0,trail:[]};
function stepPet(dt){
  const m=meEnt();if(!m||G.spectator||G.phase==='lobby'){pet.x=null;return}
  const last=pet.trail[pet.trail.length-1];
  if(!last||last[0]!==m.x||last[1]!==m.y){pet.trail.push([m.x,m.y]);if(pet.trail.length>4)pet.trail.shift()}
  const tgt=pet.trail.length>1?pet.trail[pet.trail.length-2]:[m.x,m.y];
  if(pet.x==null){pet.trail=[];const o=[[-1,0],[1,0],[0,1],[0,-1]].find(d=>walkable(m.x+d[0],m.y+d[1]))||[0,0];pet.x=m.x+o[0];pet.y=m.y+o[1];pet.trail.push([pet.x,pet.y],[m.x,m.y])}
  const dx=tgt[0]-pet.x,dy=tgt[1]-pet.y,dist=Math.hypot(dx,dy);
  if(dist>3){pet.x=tgt[0];pet.y=tgt[1]}
  else if(dist>.02){const s=Math.min(dist,SPEED*.95*dt);pet.x+=dx/dist*s;pet.y+=dy/dist*s;pet.dir=Math.abs(dx)>Math.abs(dy)?(dx<0?1:2):(dy<0?3:0);pet.anim+=dt*8}
  else pet.anim+=dt*4;
}

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
function wx(x){return (x-cam.x)*T+VW/2}
function wy(y){return (y-cam.y)*T+VH/2}
function charSprite(name,e,dirOverride){
  const im=IM[name];if(!im)return;
  const fc=e.moving?(Math.floor(e.anim)%2===0?0:2):1,dir=dirOverride!=null?dirOverride:e.dir;
  const sw=132,sh=192,dw=T*1.02,dh=dw*sh/sw;
  const sx=wx(e.rx),sy=wy(e.ry);
  shadow(sx+T/2,sy+T*.9,T*.3,T*.11,.35);
  ctx.imageSmoothingEnabled=false;ctx.drawImage(im,fc*sw,dir*sh,sw,sh,sx+T/2-dw/2,sy+T*.97-dh,dw,dh);ctx.imageSmoothingEnabled=true;
}
function drawPet(t){
  if(pet.x==null)return;const p=PETS.find(q=>q.id===RM.pet)||PETS[0],im=IM['pet_'+p.id];if(!im)return;
  const fr=p.cols===4?Math.floor(pet.anim*1.2)%4:[0,1,2,1][Math.floor(pet.anim)%4];
  const sz=T*(p.id==='flame'?.62:.72),sx=wx(pet.x)+T/2,sy=wy(pet.y)+T*.92+(p.id==='flame'?-T*.18+Math.sin(t*4)*T*.04:0);
  if(p.id!=='flame')shadow(sx,sy-T*.04,T*.2,T*.07,.3);
  ctx.imageSmoothingEnabled=false;ctx.drawImage(im,fr*120,pet.dir*120,120,120,sx-sz/2,sy-sz,sz,sz);ctx.imageSmoothingEnabled=true;
}
function npcSprite(o){
  const nr=nearestEnt(o);let dir=0;
  if(nr.e&&nr.d<6){const dx=nr.e.rx-o.x,dy=nr.e.ry-o.y;dir=Math.abs(dx)>Math.abs(dy)?(dx<0?1:2):(dy<0?3:0)}
  charSprite(o.im,{rx:o.x,ry:o.y,moving:false,anim:0,dir:dir});
}
function nearestEnt(o){let b=null,bd=1e9;ents.forEach(e=>{const d=Math.hypot(e.rx-o.x,e.ry-o.y);if(d<bd){bd=d;b=e}});return {e:b,d:bd}}
function drawRails(r,t){
  const d=r.pz,S=viewSub(r),ax=r.x+1,ay=r.y+1;
  const route=railRoute(d,S.s),on=new Set(route.path.map(p=>p[0]+','+p[1]));
  ctx.imageSmoothingEnabled=false;
  Object.keys(d.mask).forEach(k=>{
    const [x,y]=k.split(',').map(Number),m=d.mask[k],sx=wx(ax+x),sy=wy(ay+y);
    if(sx<-T||sy<-T||sx>VW+T||sy>VH+T)return;
    const si=d.sw.findIndex(s=>s.at[0]===x&&s.at[1]===y);
    if(si>=0){
      const outs=d.sw[si].outs.map(ni=>{const nt=d.nodes[ni].tiles[0];return nt[1]<y?1:4});
      const inn=m&~(outs[0]|outs[1]);
      const act=outs[S.s[si]],oth=outs[1-S.s[si]];
      ctx.drawImage(RAIL['d'+(inn|oth)],sx,sy,T+1,T+1);ctx.drawImage(RAIL[inn|act],sx,sy,T+1,T+1);
    }else ctx.drawImage(RAIL[(on.has(k)?'':'d')+m]||RAIL[m],sx,sy,T+1,T+1);
  });
  ctx.imageSmoothingEnabled=true;
}
function cartPos(r,t){
  const d=r.pz,ax=r.x+1,ay=r.y+1,S=viewSub(r);
  if(r.k===G.ci&&rail.run){
    const run=rail.run,u=clamp((performance.now()-run.t0)/1000/run.dur,0,1),f=u*(run.path.length-1),i=Math.floor(f),fr=f-i,a=run.path[i],b=run.path[Math.min(i+1,run.path.length-1)];
    return {x:ax+lerp(a[0],b[0],fr),y:ay+lerp(a[1],b[1],fr),vert:a[0]===b[0]&&a[1]!==b[1],full:true};
  }
  if(r.k<G.ci||G.phase==='won'){const n=d.nodes.find(q=>q.end===d.targets[d.targets.length-1]),tl=n.tiles[n.tiles.length-1];return {x:ax+tl[0],y:ay+tl[1],vert:false,full:false}}
  return {x:ax+d.trunk[0][0],y:ay+d.trunk[0][1],vert:false,full:true};
}
function drawBeam(r,t){
  const d=r.pz,S=viewSub(r),ax=r.x+1,ay=r.y+1,tr=beamTrace(d,S.o);
  ctx.save();ctx.globalCompositeOperation='lighter';ctx.lineCap='round';ctx.lineJoin='round';
  const P=tr.pts.map(p=>[wx(ax+p[0])+T/2,wy(ay+p[1])+T*.45]);
  [[T*.36,'rgba(255,190,90,.16)'],[T*.18,'rgba(255,220,140,.4)'],[T*.06,'rgba(255,250,220,.95)']].forEach(([lw,col])=>{
    ctx.strokeStyle=col;ctx.lineWidth=lw*(1+.08*Math.sin(t*9));ctx.beginPath();P.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.stroke()});
  if(tr.hit){const q=P[P.length-1],g=ctx.createRadialGradient(q[0],q[1],0,q[0],q[1],T*1.4);g.addColorStop(0,'rgba(160,220,255,.8)');g.addColorStop(1,'rgba(160,220,255,0)');ctx.fillStyle=g;ctx.fillRect(q[0]-T*1.4,q[1]-T*1.4,T*2.8,T*2.8)}
  ctx.restore();
  return tr;
}
function drawObj(o,sx,sy,t){
  const cx=sx+T/2,by=sy+T*.97,r=o.k!=null?G.world.ch[o.k]:null;
  switch(o.t){
    case 'npc':npcSprite(o);return;
    case 'station':{const cur=here(o)&&G.phase==='play';shadow(cx,sy+T*.9,T*.4,T*.12,.35);drawImg(o.im==='anvil'&&(cur||o.k<G.ci)?'anvil_hot':o.im,cx,by+(cur?Math.sin(t*3)*T*.02:0),T*(o.w||1));return}
    case 'crystal':{const S=viewSub(r),ori=S.o[o.i];shadow(cx,sy+T*.9,T*.3,T*.1,.3);const h=drawImg('int_crystal',cx,by,T*.8);
      /* helle Kante zeigt die Stellung */
      ctx.save();ctx.globalCompositeOperation='lighter';ctx.strokeStyle='rgba(220,250,255,.95)';ctx.lineWidth=T*.07;ctx.lineCap='round';const yc=by-h*.62,ex=T*.2;ctx.beginPath();if(ori==='/'){ctx.moveTo(cx-ex,yc+ex);ctx.lineTo(cx+ex,yc-ex)}else{ctx.moveTo(cx-ex,yc-ex);ctx.lineTo(cx+ex,yc+ex)}ctx.stroke();ctx.restore();
      if(here(o)&&G.phase==='play'&&meEnt()&&Math.abs(meEnt().x-o.x)+Math.abs(meEnt().y-o.y)===1){ctx.fillStyle='rgba(255,230,160,.9)';ctx.font='700 '+Math.round(T*.22)+'px sans-serif';ctx.textAlign='center';ctx.fillText('A: drehen',cx,by-h-T*.08)}
      return}
    case 'target':{const S=viewSub(r),hit=beamTrace(r.pz,S.o).hit;shadow(cx,sy+T*.9,T*.3,T*.1,.3);drawImg(hit?'int_target_on':'int_target_off',cx,by,T*.85);return}
    case 'swlever':{const S=viewSub(r);shadow(cx,sy+T*.85,T*.3,T*.1,.3);drawImg(S.s[o.i]?'sw_right':'sw_left',cx,by,T*.8);return}
    case 'golever':{const run=r.k===G.ci&&rail.run;drawImg(run?'int_lever_down':'int_lever_up',cx,by,T*.85);return}
    case 'reset':{drawImg('int_lever_up',cx,by,T*.85);return}
    case 'marker':{const S=viewSub(r),n=r.pz.nodes.find(q=>q.end!=null&&q.sym===o.sym),tg=r.pz.targets.indexOf(n.end),lit=tg>=0&&S.del>tg;
      if(lit){ctx.save();ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(cx,by-T*.4,0,cx,by-T*.4,T);g.addColorStop(0,'rgba(255,220,140,.6)');g.addColorStop(1,'rgba(255,220,140,0)');ctx.fillStyle=g;ctx.fillRect(cx-T,by-T*1.4,T*2,T*2);ctx.restore()}
      shadow(cx,sy+T*.9,T*.32,T*.1,.3);drawImg(o.im,cx,by,T*.85);return}
    case 'lanternhook':{const S=viewSub(r);if(S.holder>=0&&r.k===G.ci)drawImg('flag',cx,by,T*.5);else drawImg('int_lantern',cx,by,T*.75);return}
    case 'dragon':return;
    case 'gate':{const op=G.phase==='won'?clamp((performance.now()-gateOpenT)/1600,0,1):0;const w=T*o.w;drawImg('big_gate_closed',cx,sy+T*1.02,w);if(op>0)drawImg('big_gate_open',cx,sy+T*1.02,w,{alpha:op});
      /* Runen in den Fassungen */
      if(op<1){const im=IM.big_gate_closed,h=w*im.height/im.width,x0=cx-w/2,y0=sy+T*1.02-h,solved=G.found.filter(Boolean).length,tot=Math.max(1,G.order.length-1),n=G.cur==='finale'||G.phase==='won'?4:Math.floor(4*solved/tot);
        const SO=[[.497,.26,'rune_fire'],[.335,.47,'rune_water'],[.66,.47,'rune_leaf'],[.497,.69,'rune_sun']];
        for(let i=0;i<n;i++){const s=SO[i],ri=IM[s[2]];if(!ri)continue;const rw=w*.1,rh=rw*ri.height/ri.width;ctx.imageSmoothingEnabled=false;ctx.globalAlpha=1-op;ctx.drawImage(ri,x0+w*s[0]-rw/2,y0+h*s[1]-rh/2,rw,rh);ctx.globalAlpha=1;ctx.imageSmoothingEnabled=true}}
      return}
    case 'big':{shadow(cx,sy+T*.92,T*.42*o.w,T*.12,.3);drawImg(o.im,cx,sy+T*1.02,T*o.w);return}
    case 'obj':{shadow(cx,sy+T*.9,T*.34*(o.w||1),T*.1,.25);if(o.im==='obj_brazier'){drawBrazier(o,cx,by,t);return}drawImg(o.im,cx,by,T*(o.w||.9)*.95);return}
    default:{if(o.im)drawImg(o.im,cx,by,T*(o.w||.9))}
  }
}

/* Feuerschale: Schale aus dem Bild, Flamme animiert darüber */
function drawBrazier(o,cx,by,t){
  const im=IM.obj_brazier;if(!im)return;
  const w=T*(o.w||.9)*.95,h=w*im.height/im.width,top=by-h,cut=Math.round(im.height*.44),seed=hash2(o.x,o.y);
  drawFlame(cx,top+h*.52,w*.92,h*.62,seed,tAnim);
  ctx.imageSmoothingEnabled=false;ctx.drawImage(im,0,cut,im.width,im.height-cut,cx-w/2,top+h*cut/im.height,w,h*(im.height-cut)/im.height);ctx.imageSmoothingEnabled=true;
  /* Glut-Schein und ab und zu ein Funke */
  ctx.save();ctx.globalCompositeOperation='lighter';const gy=top+h*.3,gr=w*(1.1+.12*Math.sin(t*9+seed*6));const g=ctx.createRadialGradient(cx,gy,0,cx,gy,gr);g.addColorStop(0,'rgba(255,150,60,.22)');g.addColorStop(1,'rgba(255,120,40,0)');ctx.fillStyle=g;ctx.fillRect(cx-gr,gy-gr,gr*2,gr*2);ctx.restore();
  if(Math.random()<.035){const wx0=(cx-VW/2)/T+cam.x,wy0=(top+h*.15-VH/2)/T+cam.y;parts.push({x:wx0+(Math.random()-.5)*.3,y:wy0,vx:(Math.random()-.5)*.4,vy:-.8-Math.random()*.8,g:-.2,life:.8+Math.random()*.7,t:0,col:Math.random()<.5?'#ffb347':'#ff7a2a',sz:1.5+Math.random()*1.5})}
}
function drawDragon(o,t){
  const es=eyeState(),fin=G.cur==='finale'&&G.phase==='play',im=fin?(es.st==='open'?'dragon_2':es.st==='warn'?'dragon_1':'dragon_0'):(G.phase==='lost'?'dragon_2':'dragon_0');
  const sx=wx(o.x)+T/2,by=wy(o.y)+T*1.05,w=T*5.4,ih=IM.big_hoard,id=IM[im];if(!ih||!id)return;
  ctx.imageSmoothingEnabled=false;
  const hh=w*1.05*ih.height/ih.width;ctx.drawImage(ih,sx-w*.52,by-hh,w*1.05,hh);
  const breathe=1+Math.sin(t*1.3)*.012,dw=w*.95,dh=dw*id.height/id.width*breathe;
  ctx.save();if(o.flip){ctx.translate(sx,0);ctx.scale(-1,1);ctx.translate(-sx,0)}
  ctx.drawImage(id,sx-dw/2,by-hh*.45-dh,dw,dh);ctx.restore();ctx.imageSmoothingEnabled=true;
  return [sx,by-hh*.45-dh*.45];
}
const pseudo={};
function lightHole(x,y,r,a){
  const g=dg.createRadialGradient(x,y,0,x,y,r);
  g.addColorStop(0,'rgba(0,0,0,'+a+')');g.addColorStop(.55,'rgba(0,0,0,'+(a*.8)+')');g.addColorStop(1,'rgba(0,0,0,0)');
  dg.fillStyle=g;dg.fillRect(x-r,y-r,r*2,r*2);
}
let tAnim=0,eyesDark=null;
function render(dt){
  tAnim+=dt;
  const t=tAnim,w=G.world||demo;
  ctx.setTransform(DPR,0,0,DPR,0,0);
  if(G.phase==='lobby'){ctx.clearRect(0,0,VW,VH);return}
  ctx.fillStyle='#07060a';ctx.fillRect(0,0,VW,VH);
  if(!w||!ASSETS_READY)return;
  const m=meEnt();
  let tx=cam.x,ty=cam.y;
  if(m&&!G.spectator){tx=m.rx;ty=m.ry}
  else if(G.spectator){const r=w.ch[Math.min(G.ci,w.M-1)];tx=r.cx;ty=r.cy}
  const k=1-Math.exp(-dt*8);cam.x+=(tx-cam.x)*k;cam.y+=(ty-cam.y)*k;
  /* Beben */
  const se=(performance.now()-shakeT)/1000,sa=se<1.4?shakeA*(1-se/1.4):0;
  if(sa>0)ctx.translate(Math.sin(t*61)*T*.07*sa,Math.cos(t*53)*T*.05*sa);
  const x0=Math.max(0,Math.floor(cam.x-VW/2/T)-1),x1=Math.min(w.W-1,Math.ceil(cam.x+VW/2/T)+1);
  const y0=Math.max(0,Math.floor(cam.y-VH/2/T)-1),y1=Math.min(w.H-1,Math.ceil(cam.y+VH/2/T)+4);
  /* Boden und Fels */
  const torches=[];
  for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){
    const i=y*w.W+x,px0=Math.floor(wx(x)),py0=Math.floor(wy(y));
    if(w.block[i]&&w.wallv[i]!==255){ctx.drawImage(WALL[w.wallv[i]],px0,py0,T+1,T+1);if(w.wallv[i]===10)torches.push([px0,py0,hash2(x,y)]);continue}
    ctx.drawImage(TILE[w.ground[i]],px0,py0,T+1,T+1);
  }
  torches.forEach(q=>{const cx=q[0]+T*.5,by=q[1]+T*.37;ctx.fillStyle='#3a2a1e';drawFlame(cx,by,T*.26,T*.32,q[2],t)});
  /* Gleise, Platten */
  w.ch.forEach(r=>{
    if(r.cx<x0-RW||r.cx>x1+RW||r.cy<y0-RH||r.cy>y1+RH)return;
    if(r.type==='rails')drawRails(r,t);
    if(r.type==='boulder'){r.pz.goals.forEach(g=>{const S=viewSub(r),on=S.b.some(q=>q[0]===g[0]&&q[1]===g[1]);const sx=wx(r.x+1+g[0]),sy=wy(r.y+1+g[1]);drawImg(on?'int_plate_on':'int_plate_off',sx+T/2,sy+T*.95,T*.95)})}
    if(r.type==='finale'&&r.plates){const on=G.cur==='finale'&&G.phase==='play';r.plates.forEach(p=>{const occ=ents.some(e=>e.x===p.x&&e.y===p.y);const sx=wx(p.x),sy=wy(p.y);
      if(on){ctx.save();ctx.globalCompositeOperation='lighter';ctx.fillStyle=occ?'rgba(255,214,120,.45)':'rgba(255,170,70,'+(.15+.12*Math.sin(t*3))+')';ctx.fillRect(sx,sy,T,T);ctx.restore()}
      drawImg(occ||on?'int_plate_on':'int_plate_off',sx+T/2,sy+T*.95,T*.95)})}
    if(r.type==='dark'){const S=viewSub(r);r.pz.ores.forEach((o,i)=>{if(S.got[i])return;const sx=wx(r.x+o[0])+T/2,sy=wy(r.y+o[1])+T*.92;drawImg('ore_star',sx,sy+Math.sin(t*2+i)*T*.03,T*.62)})}
  });
  /* Objekte, Brocken, Figuren nach Zeilen */
  const rowObjs=new Map();
  w.objs.forEach(o=>{if(o.y>=y0&&o.y<=y1+3){if(!rowObjs.has(o.y))rowObjs.set(o.y,[]);rowObjs.get(o.y).push(o)}});
  const rowB=new Map();
  w.ch.forEach(r=>{if(r.type!=='boulder')return;const S=viewSub(r);S.b.forEach((b,i)=>{const y=r.y+1+b[1];if(!rowB.has(y))rowB.set(y,[]);rowB.get(y).push({x:r.x+1+b[0],y:y,i:i})})});
  const gateByRow=new Map();
  w.gates.forEach(g=>{const tl=g.kind==='rubble'?g.tiles:[g.tiles[1]];tl.forEach(q=>{if(!gateByRow.has(q.y))gateByRow.set(q.y,[]);gateByRow.get(q.y).push({g:g,tl:q})})});
  const pl=ents.slice().sort((a,b)=>a.ry-b.ry);let pi=0,petDone=false;
  const lights=w.lights.slice();let dragonEye=null;
  for(let y=y0;y<=y1;y++){
    (gateByRow.get(y)||[]).forEach(q=>{const g=q.g,sx=wx(q.tl.x),sy=wy(q.tl.y);
      if(g.kind==='rubble'){const a=(g.anim>=1||(gateOpen(g)&&g.anim===0))?0:1-g.anim;if(a>0&&WALL[23]){ctx.globalAlpha=a;ctx.drawImage(WALL[23],sx,sy,T+1,T+1);ctx.globalAlpha=1}}
      else{const op=gateOpen(g),a=g.anim>0&&g.anim<1?g.anim:(op?1:0);drawImg('int_gate_closed',sx+T/2,sy+T*1.04,T*2.9,{alpha:1-a});if(a>0)drawImg('int_gate_open',sx+T/2,sy+T*1.04,T*2.9,{alpha:a})}});
    (rowObjs.get(y)||[]).forEach(o=>{
      if(o.t==='dragon'){dragonEye=drawDragon(o,t);return}
      drawObj(o,wx(o.x),wy(o.y),t);
      if(o.t==='station'&&o.k===G.ci&&G.phase==='play')lights.push([o.x+.5,o.y+.4,2.6,.9]);
      if(o.t==='target'&&beamTrace(G.world.ch[o.k].pz,viewSub(G.world.ch[o.k]).o).hit)lights.push([o.x+.5,o.y+.2,2.6,.9]);
    });
    (rowB.get(y)||[]).forEach(b=>{const sx=wx(b.x),sy=wy(b.y);shadow(sx+T/2,sy+T*.88,T*.4,T*.12,.4);drawImg(b.i%2?'int_boulder_moss':'int_boulder',sx+T/2,sy+T*.98,T*.92)});
    /* Lore */
    w.ch.forEach(r=>{if(r.type!=='rails')return;const c=cartPos(r,t);if(Math.round(c.y)!==y)return;const sx=wx(c.x)+T/2,sy=wy(c.y)+T*.95;shadow(sx,sy-T*.05,T*.38,T*.1,.35);drawImg(c.vert?(c.full?'cart_full_d':'cart_d'):(c.full?'cart_full_r':'cart_r'),sx,sy,T*.95)});
    while(pi<pl.length&&Math.round(pl[pi].ry)<=y){charSprite('player_'+PCOL[pl[pi].i%6],pl[pi]);pi++}
    if(!petDone&&pet.x!=null&&Math.round(pet.y)<=y){drawPet(t);petDone=true}
  }
  while(pi<pl.length){charSprite('player_'+PCOL[pl[pi].i%6],pl[pi]);pi++}
  if(!petDone)drawPet(t);
  /* Namensschilder */
  ctx.font='700 '+Math.round(T*.2)+'px sans-serif';ctx.textAlign='center';
  ents.forEach((e,i)=>{
    if(G.solo)return;
    const rl=G.sets[i]?ROLE_SHORT[G.sets[(i+(G.rot?G.ci:0))%G.P][0]]+(G.sets[(i+(G.rot?G.ci:0))%G.P].length>1?' +':''):'';
    const sx=wx(e.rx)+T/2,sy=wy(e.ry)-T*.42;const wd=ctx.measureText(rl).width+10;
    ctx.fillStyle='rgba(12,8,14,.78)';ctx.fillRect(sx-wd/2,sy-T*.2,wd,T*.26);ctx.fillStyle=PHEX[i%6];ctx.fillText(rl,sx,sy);
  });
  /* Partikel */
  parts.forEach(p=>{ctx.globalAlpha=Math.max(0,1-p.t/p.life);ctx.fillStyle=p.col;ctx.fillRect(wx(p.x),wy(p.y),p.sz,p.sz)});ctx.globalAlpha=1;
  w.gates.forEach(g=>{if(g.anim>0&&g.anim<1)g.anim=Math.min(1,g.anim+dt*.9);else if(g.anim===0&&gateOpen(g))g.anim=1});
  /* Dunkelheit */
  const pr=progress(),mz=m?zoneAt(m.x,m.y):-1,inDark=mz>=0&&w.ch[mz].type==='dark';
  const A=inDark?.965:(.42+.38*pr);
  const R=T*lerp(8.5,3.6,Math.pow(pr,1.1));
  dg.setTransform(DPR,0,0,DPR,0,0);dg.globalCompositeOperation='source-over';dg.clearRect(0,0,VW,VH);
  dg.fillStyle='rgba(6,4,10,'+A.toFixed(3)+')';dg.fillRect(0,0,VW,VH);
  dg.globalCompositeOperation='destination-out';
  const darkR=inDark?w.ch[mz]:null,holder=darkR?viewSub(darkR).holder:-1;
  ents.forEach((e,i)=>{let rr=i===G.me?R:R*.55;if(inDark)rr=i===holder?T*3.3:(i===G.me?T*.95:T*.6);lightHole(wx(e.rx)+T/2,wy(e.ry)+T/2,rr,1)});
  if(pet.x!=null)lightHole(wx(pet.x)+T/2,wy(pet.y)+T/2,T*(inDark?1.1:1.6),inDark?.75:.6);
  if(G.spectator)lightHole(VW/2,VH/2,R,1);
  if(!inDark)lights.forEach(l=>{const f=1+.06*Math.sin(t*11+l[0]*3.1)+.04*Math.sin(t*17.3+l[1]*1.7);lightHole(wx(l[0]),wy(l[1]),T*l[2]*f,l[3])});
  dg.globalCompositeOperation='source-over';
  ctx.setTransform(1,0,0,1,0,0);ctx.drawImage(dark,0,0);ctx.setTransform(DPR,0,0,DPR,0,0);
  if(sa>0)ctx.translate(Math.sin(t*61)*T*.07*sa,Math.cos(t*53)*T*.05*sa);
  /* Kristallstrahl leuchtet über der Dunkelheit */
  w.ch.forEach(r=>{if(r.type==='beam'&&Math.abs(r.cx-cam.x)<RW+8&&Math.abs(r.cy-cam.y)<RH+8)drawBeam(r,t)});
  /* rote Ränder, solange das Drachenauge offen ist */
  if(G.cur==='finale'&&G.phase==='play'&&mz===w.M-1){const es=eyeState();if(es.st!=='closed'){const a=es.st==='open'?.38:.16,g=ctx.createRadialGradient(VW/2,VH/2,Math.min(VW,VH)*.35,VW/2,VH/2,Math.max(VW,VH)*.75);g.addColorStop(0,'rgba(255,40,10,0)');g.addColorStop(1,'rgba(255,40,10,'+a+')');ctx.fillStyle=g;ctx.fillRect(-20,-20,VW+40,VH+40)}}
  /* Drachenaugen im Dunkeln */
  drawDarkEyes(t,inDark,m);
  ctx.setTransform(DPR,0,0,DPR,0,0);
  /* Pfeil zum Ziel */
  if(G.phase==='play'&&m&&!G.spectator&&!G.modal){
    const r=w.ch[Math.min(G.ci,w.M-1)];let gx=r.cx,gy=r.cy;
    if(G.cur==='finale'){gx=r.cx;gy=r.y+2}
    else if(r.type!=='pool'&&r.type!=='forge'&&mz!==r.k){const s=spawnFor(w,G.ci,0);gx=s.x;gy=s.y}
    const dx=gx-m.rx,dy=gy-m.ry,dist=Math.hypot(dx,dy);
    if(dist>3.2&&!(inDark&&mz===G.ci)){
      const a=Math.atan2(dy,dx),rr=T*(2.1+.12*Math.sin(t*5)),cx=wx(m.rx)+T/2+Math.cos(a)*rr,cy=wy(m.ry)+T/2+Math.sin(a)*rr;
      ctx.save();ctx.translate(cx,cy);ctx.rotate(a);ctx.fillStyle='rgba(255,200,120,.92)';ctx.shadowColor='#ff8a2a';ctx.shadowBlur=10;
      ctx.beginPath();ctx.moveTo(T*.3,0);ctx.lineTo(-T*.14,-T*.2);ctx.lineTo(-T*.02,0);ctx.lineTo(-T*.14,T*.2);ctx.closePath();ctx.fill();ctx.restore();
    }
  }
  /* schwebender Staub */
  for(let i=0;i<16;i++){
    const px0=((i*97.3+t*(5+i%5))%VW),py0=((i*53.1+Math.sin(t*.6+i)*30+t*(2+i%3))%VH);
    ctx.fillStyle='rgba(255,210,160,'+(.12+.12*Math.sin(t*2+i))+')';ctx.fillRect(px0,py0,2,2);
  }
  /* Fortschrittsanzeigen */
  const msg=(function(){
    if(G.phase!=='play')return '';const r=chCur();if(!r||mz!==r.k)return '';
    if(G.cur==='finale')return 'Platten besetzt: '+(G.plateN|0)+' von '+r.plates.length;
    if(r.type==='boulder'){const S=G.sub;return 'Platten belegt: '+r.pz.goals.filter(g=>S.b.some(q=>q[0]===g[0]&&q[1]===g[1])).length+' von '+r.pz.goals.length}
    if(r.type==='dark')return 'Sternenerz: '+G.sub.got.filter(Boolean).length+' von '+G.sub.got.length+(G.sub.holder<0?' · Laterne hängt am Eingang':'');
    if(r.type==='rails'&&r.pz.targets.length>1)return 'Fuhren geliefert: '+G.sub.del+' von 2';
    return '';
  })();
  if(msg){ctx.font='700 '+Math.round(T*.26)+'px sans-serif';ctx.textAlign='center';const wd=ctx.measureText(msg).width+24;ctx.fillStyle='rgba(12,8,14,.82)';ctx.fillRect(VW/2-wd/2,VH-T*1.25,wd,T*.5);ctx.fillStyle='#ffd59a';ctx.fillText(msg,VW/2,VH-T*.9)}
}
function drawDarkEyes(t,inDark,m){
  const now=performance.now(),low=G.phase==='play'&&remaining()<90;
  if(!(inDark||low)||!m||G.cur==='finale'){eyesDark=null;return}
  if(!eyesDark||now>eyesDark.end+((inDark?5000:9000)+Math.random()*6000)){
    const a=Math.random()*6.28,d=inDark?3.6+Math.random()*2:5+Math.random()*2.5;
    eyesDark={x:m.rx+Math.cos(a)*d,y:m.ry+Math.sin(a)*d*.7,t0:now,end:now+2600,red:low&&Math.random()<.6};
    if(AU.on&&!sfx('az-atem',inDark?.7:.5))beep(65,1.1,'sawtooth',.05);
  }
  const e=eyesDark;if(now>e.end)return;
  const u=(now-e.t0)/(e.end-e.t0),al=u<.2?u/.2:u>.8?(1-u)/.2:1,blink=u>.45&&u<.52;
  const im=IM[blink?'eyes_2':e.red?'eyes_3':'eyes_0'];if(!im)return;
  const w=T*2.4,h=w*im.height/im.width,sx=wx(e.x)+T/2,sy=wy(e.y)+T/2;
  ctx.save();ctx.globalAlpha=al*.9;ctx.globalCompositeOperation='screen';ctx.imageSmoothingEnabled=false;ctx.drawImage(im,sx-w/2,sy-h/2,w,h);ctx.restore();ctx.imageSmoothingEnabled=true;
}

/* ---------- HUD ---------- */
const timerEl=$('#timer'),barEl=$('#bar');
function paintHud(){
  const rem=remaining();
  timerEl.textContent=fmt(rem);timerEl.classList.toggle('low',G.phase==='play'&&rem<60);
  barEl.style.width=((1-progress())*100).toFixed(1)+'%';
  if(G.order.length){
    $('#chEye').textContent=G.cur==='finale'?'Der Drachenhort':'Halle '+Math.min(G.ci+1,G.order.length-1)+' von '+(G.order.length-1);
    $('#chName').textContent=chName(G.ci);
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
  if(G.phase!=='lobby'){stepLocal(dt);stepRemote(dt);stepPet(dt);checkFinale(dt);dragonTick()}
  stepParts(dt);
  if(!G.spectator&&G.phase==='play'&&!G.solo&&RM.named&&now-lastPosSend>2500)sendPos();
  render(dt);
  requestAnimationFrame(loop);
}

/* ---------- Gruppenraum ---------- */
const ROTS=[{id:0,label:'Fest',info:'Jede Person behält ihre Rolle das ganze Spiel über.'},{id:1,label:'Wechseln',info:'Die Rollen wechseln reihum mit jeder neuen Halle. So lernt jede Person mehrere Rollen kennen.'}];
function paintRot(){const el=$('#rotSel');if(!el)return;el.innerHTML=ROTS.map(x=>'<button class="chip" data-rot="'+x.id+'" aria-pressed="'+(RM.rot===x.id)+'">'+x.label+'</button>').join('');$('#rotInfo').textContent=ROTS[RM.rot].info+' Gilt nur, wenn ihr zu zweit oder mehr spielt.'}
function paintStage(){
  $('#diff').innerHTML=DIFFS.map(x=>'<button class="chip" data-d="'+x.id+'" aria-pressed="'+(RM.d===x.id)+'">'+x.label+'</button>').join('');
  const cur=DIFFS.find(x=>x.id===RM.d);
  $('#stageInfo').textContent=cur.info+' Wer die Runde startet, bestimmt die Schwierigkeit für die ganze Gruppe.';paintRot();
}
function paintPets(){
  const el=$('#petSel');if(!el)return;
  el.innerHTML=PETS.map(p=>'<button class="chip" data-pet="'+p.id+'" aria-pressed="'+(RM.pet===p.id)+'">'+(PETIC[p.id]?'<img alt="" src="'+PETIC[p.id]+'" style="width:40px;height:40px;image-rendering:pixelated">':'')+p.label+'</button>').join('');
}
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-rot]');if(!b)return;RM.rot=+b.dataset.rot;paintRot()});
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-pet]');if(!b)return;RM.pet=b.dataset.pet;try{localStorage.setItem('az-pet',RM.pet)}catch(x){}paintPets()});
$('#diff').addEventListener('click',e=>{const b=e.target.closest('[data-d]');if(!b)return;RM.d=+b.dataset.d;paintStage()});
function paintMode(){
  $('#mode').innerHTML=Object.keys(MODES).map(k=>'<button class="chip" data-mode="'+k+'" aria-pressed="'+(RM.mode===k)+'">'+MODES[k].label+' · '+MODES[k].min+' Min.</button>').join('');
  $('#modeInfo').textContent=MODES[RM.mode].info;
}
$('#mode').addEventListener('click',e=>{const b=e.target.closest('[data-mode]');if(!b)return;RM.mode=b.dataset.mode;paintMode()});
function paintCount(){
  const n=RM.count;
  $('#groupCount').textContent=n<=1?'Du bist allein in der Gruppe. Warte auf die anderen oder starte schon.':n+' Personen sind in der Gruppe.'+(n>6?' Die ersten 6 spielen mit, die anderen schauen zu.':'');
  const sb=$('#startBtn');if(sb)sb.textContent=n>1?'Spiel starten ('+Math.min(n,6)+' Geräte)':'Spiel starten';
}
async function joinGroup(){
  initAudio();
  const clean=$('#code').value.trim().toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9_.-]/g,'').slice(0,24);
  if(!clean){toast('Bitte gib einen Gruppencode ein.');return}
  try{
    if(!window.FRSNet||!FRSNet.relayUrl()){toast('Der Gruppenraum ist hier nicht eingerichtet. Der Testmodus funktioniert trotzdem.',4500);return}
    leaveGroup(true);
    RM.named=await FRSNet.connect(FRSNet.relayUrl(),'az-'+clean);
    RM.offs.push(RM.named.on('start',m=>{
      const d=m.data;
      if(!d||typeof d.epoch!=='number'||d.epoch<=G.epoch||typeof d.seed!=='number'||!Array.isArray(d.roster)||d.roster.length<1||d.roster.length>6||typeof d.total!=='number'||d.total<60||d.total>6000||!MODES[d.mode])return;
      beginGame({epoch:d.epoch,seed:d.seed,total:d.total,mode:d.mode,roster:d.roster.map(String),host:m.peer,stage:d.stage,rot:d.rot,genP:d.genP});
    }));
    RM.offs.push(RM.named.on('act',m=>handleAct(m.data,m.isMe&&m.sameTab)));
    RM.offs.push(RM.named.on('state',onState));
    RM.offs.push(RM.named.on('roster',m=>{const d=m.data;if(!d||d.epoch!==G.epoch||G.phase!=='play'||m.peer!==G.hostPeer||!Array.isArray(d.roster)||d.roster.length<1||d.roster.length>6)return;applyRoster(d.roster.map(String))}));
    RM.offs.push(RM.named.on('pos',onPos));
    RM.offs.push(RM.named.onPeers(ch=>{RM.count=ch.peers.filter(p=>p.kind==='viewer').length;paintCount();if(G.phase==='play'&&!G.solo&&G.hostPeer===myPeer()&&ch.joined&&ch.joined.length)setTimeout(hostTick,300)}));
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
function validSub(s){try{return s&&typeof s==='object'&&JSON.stringify(s).length<4000}catch(e){return false}}
function onState(m){
  const d=m.data;
  if(!d||(m.isMe&&m.sameTab)||typeof d.epoch!=='number')return;
  if(d.epoch>G.epoch){
    if(d.phase==='play'&&MODES[d.mode]&&Array.isArray(d.roster)&&d.roster.length>=1&&d.roster.length<=6&&typeof d.seed==='number'&&typeof d.total==='number'&&typeof d.remaining==='number'){
      beginGame({epoch:d.epoch,seed:d.seed,total:d.total,mode:d.mode,roster:d.roster.map(String),host:m.peer,stage:d.stage,rot:d.rot,genP:d.genP});
      closeDialog();
      G.deadline=performance.now()+d.remaining*1000;G.attempts=d.attempts|0;G.hintsTotal=d.hints|0;G.caught=d.caught|0;
      const ci=clamp(d.ci|0,0,G.order.length-1);
      for(let k=0;k<ci;k++){G.found[k]=true;G.world.gates[k]&&(G.world.gates[k].anim=1)}
      if(ci>0){setCi(ci,true);ents.forEach((e,i)=>{const s=spawnFor(G.world,ci,i);e.x=e.rx=s.x;e.y=e.ry=s.y})}
      if(d.ci===G.ci&&validSub(d.sub)){G.sub=JSON.parse(JSON.stringify(d.sub));G.subV=d.subV|0}
    }
    return;
  }
  if(d.epoch===G.epoch&&G.phase==='play'){
    if(d.phase==='play'&&m.peer===G.hostPeer&&Array.isArray(d.roster)&&d.roster.length>=1&&d.roster.length<=6&&d.roster.join()!==G.roster.join())applyRoster(d.roster.map(String));
    if(d.phase==='play'){
      if(Math.abs(remaining()-d.remaining)>2.5)G.deadline=performance.now()+d.remaining*1000;
      const ci=d.ci|0;
      if(ci>G.ci&&ci<G.order.length){for(let k=G.ci;k<ci;k++){G.found[k]=true;if(G.world.gates[k])G.world.gates[k].anim=1}setCi(ci,false)}
      if(ci===G.ci&&m.peer===G.hostPeer&&(d.subV|0)>G.subV&&validSub(d.sub)&&!rail.run){G.sub=JSON.parse(JSON.stringify(d.sub));G.subV=d.subV|0}
    }else if(d.phase==='won'||d.phase==='lost')finish(d.phase);
  }
}
function applyRoster(list){
  if(G.solo||!Array.isArray(list)||!list.length)return;
  const oldRoster=G.roster.slice(),oldRoles=(G.roles||[]).join(),wasSpec=G.spectator;
  G.roster=list.slice(0,6);G.P=G.roster.length;G.sets=ROLE_SETS[G.P];
  const my=G.roster.indexOf(myPeer());G.me=my;G.spectator=my<0;
  G.roles=my>=0?G.sets[(my+(G.rot?G.ci:0))%G.P].slice():[];
  {const old=oldRoster;ents=G.roster.map((p,i)=>{const oi=old.indexOf(p);let e=oi>=0?ents[oi]:null;if(!e){const sp0=spawnFor(G.world,G.ci,i);e=newEnt(i,sp0.x,sp0.y)}e.i=i;return e})}
  const names=G.roles.map(r=>ROLE_NAME[r]).join(' und ');
  if(my>=0&&wasSpec)toast('Du spielst jetzt mit! Deine Rolle: '+names+'.',5000);
  else if(my>=0&&G.roles.join()!==oldRoles)toast('Die Gruppe hat sich verändert ('+G.P+' Personen). Deine Rolle jetzt: '+names+'.',5000);
  if(G.modal)try{renderModal()}catch(e){};try{paintHud()}catch(e){}
}
function syncRoster(){
  const now=Date.now(),live=RM.named.peers().filter(p=>p.kind==='viewer').map(p=>p.peer);
  RM.seen=RM.seen||{};live.forEach(p=>{RM.seen[p]=now});
  const r=G.roster.filter(p=>live.indexOf(p)>=0||now-(RM.seen[p]||G.epoch)<25000);
  live.forEach(p=>{if(r.indexOf(p)<0&&r.length<6)r.push(p)});
  if(r.indexOf(myPeer())<0)return;
  if(r.join()!==G.roster.join()){applyRoster(r);send('roster',{epoch:G.epoch,roster:r})}
}
function hostTick(){
  if(!RM.named||G.solo||G.phase==='lobby'||!G.hostPeer||G.hostPeer!==myPeer())return;
  if(G.phase==='play')syncRoster();
  send('state',{epoch:G.epoch,phase:G.phase,seed:G.seed,total:G.total,mode:G.mode,stage:G.stage,rot:G.rot,genP:G.genP,remaining:remaining(),roster:G.roster,ci:G.ci,hints:G.hintsTotal,attempts:G.attempts,caught:G.caught,sub:G.sub,subV:G.subV});
}
setInterval(hostTick,4000);

$('#joinBtn').addEventListener('click',joinGroup);
$('#code').addEventListener('keydown',e=>{if(e.key==='Enter')joinGroup()});
$('#leaveBtn').addEventListener('click',()=>leaveGroup(false));
$('#startBtn').addEventListener('click',startRoom);
$('#soloBtn').addEventListener('click',startSolo);
$('#againBtn').addEventListener('click',newRound);
$('#homeBtn').addEventListener('click',()=>{
  G.phase='lobby';G.solo=false;G.world=null;ents=[];closeModal(true);closeDialog();$('#eyebar').hidden=true;
  endEl.hidden=true;hud.hidden=true;pad.hidden=true;abtn.hidden=true;lobby.hidden=false;$('#lobbybg').hidden=false;
});

/* ---------- Start ---------- */
resize();
paintMode();paintStage();paintPets();
pad.hidden=true;abtn.hidden=true;
requestAnimationFrame(loop);
if(DEV)window.__az={G:G,RM:RM,genData:genData,ents:()=>ents,world:()=>G.world,walkable:walkable,chamberDone:chamberDone,handleAct:handleAct,act:act,PZ:PZ,pzOf:pzOf,beginGame:beginGame,setCi:setCi,
  tp:(x,y)=>{const m=meEnt();m.x=m.rx=x;m.y=m.ry=y;cam.x=x;cam.y=y},held:held,interact:interact,buildWorld:buildWorld,genBoulder:genBoulder,genBeam:genBeam,genRails:genRails,genDark:genDark,railRoute:railRoute,beamTrace:beamTrace,
  ready:()=>ASSETS_READY,snd:()=>({n:Object.keys(SFX.buf).length,amb:SFX.ambName,on:AU.on,room:SNDO.room}),flames:()=>FLAME.map(c=>c.toDataURL()),eyeState:eyeState,makeOrder:makeOrder,use:use,openModal:openModal,rail:rail,spawnFor:spawnFor};
/* ---------- Vorschau für die Lehrkraft: Adresse mit ?vorschau öffnen ---------- */
(function(){if(!/[?&]vorschau\b/.test(location.search))return;
  setTimeout(function(){try{startSolo()}catch(e){}
    setTimeout(function(){const it=document.getElementById('intro');if(it&&!it.hidden)it.click()},700);
    const box=document.createElement('div');
    box.style.cssText='position:fixed;left:12px;bottom:12px;z-index:60;background:rgba(14,10,18,.92);border:1px solid rgba(255,255,255,.3);border-radius:14px;padding:10px 12px;color:#fff;font:600 14px system-ui,sans-serif;display:flex;flex-wrap:wrap;gap:6px;align-items:center;max-width:min(640px,94vw)';
    const B=(l,f)=>{const b=document.createElement('button');b.textContent=l;b.className='chip';b.addEventListener('click',f);box.appendChild(b);return b};
    const t=document.createElement('b');t.textContent='VORSCHAU';t.style.marginRight='6px';box.appendChild(t);
    B('⏭ Halle überspringen',function(){if(G.phase==='play'&&!G.locked&&G.cur!=='finale'){try{chamberDone();const m=meEnt(),s=spawnFor(G.world,G.ci,0);if(m){m.x=m.rx=s.x;m.y=m.ry=s.y}}catch(e){}}});
    const sb=B('🔇 Ton aus',function(){initAudio();AU.on=!AU.on;if(AU.ctx&&AU.ctx.resume)AU.ctx.resume();sb.textContent=AU.on?'🔊 Ton an':'🔇 Ton aus'});
    B('⏳ Zeit fast um',function(){if(G.phase==='play')G.deadline=performance.now()+45000});
    B('🐉 Grollen',function(){nextRumble=0});
    B('🏆 Sieg',function(){if(G.phase==='play')finish('won')});
    B('💥 Niederlage',function(){if(G.phase==='play')finish('lost')});
    B('↻ Neu',function(){location.reload()});
    const hide=B('Ausblenden',function(){box.style.display='none';show.style.display='block'});
    const show=document.createElement('button');show.textContent='Vorschau';show.className='chip';show.style.cssText='position:fixed;left:12px;bottom:12px;z-index:60;display:none';show.addEventListener('click',function(){box.style.display='flex';show.style.display='none'});
    document.body.appendChild(box);document.body.appendChild(show);
  },800);
})();
})();
