/* FRS Lernwelten – Meerestiere für die Wasserwelt (Atlantis).
   Alle in doppelter Auflösung gebaut (kleine Würfel) und im Spiel mit kleinem scale eingesetzt.
   Blickrichtung +x, y oben. rot: [Achse, Ausschlag, Tempo, Phase, Grundwinkel], pulse: [Stärke, Tempo, Phase]. */
import { M } from "./tiere.js";
const part = (m, pivot, rot, extra) => ({ cubes: m.list(), pivot, rot, ...(extra||{}) });

/* ---------- Rifffische: klein, aber mit Augen, Flossen und Musterung ---------- */
const FISH = {
  clown:  { body:(x,y,z)=> (x===1||x===-2) ? 0xFFFFFF : 0xFF7A1A,
            edge:0x1A1A1A, fin:0xFF8A2A, tail:0xFF7A1A, tailEdge:0x1A1A1A },
  tang:   { body:(x,y,z)=> (y===1 && x>-2 && x<2) || (y===0 && x===-2) ? 0x0E1E5A : 0x2A6AE8, fin:0x1E4FC0, edge:0x0E1E5A, tail:0xFFD23F, tailEdge:0xE8B020 },
  butter: { body:(x,y,z)=> x===2 ? 0x1A1A1A : x===3 ? 0xFFFFFF : 0xFFD23F, fin:0xFFE680, edge:0x1A1A1A, tail:0xFFD23F, tailEdge:0xFFFFFF },
  angel:  { body:(x,y,z)=> ((x+3)%3===0) ? 0xFFD23F : 0x2A5AD8, fin:0x2A5AD8, edge:0xFFD23F, tail:0xFFD23F, tailEdge:0x2A5AD8 },
  pink:   { body:(x,y,z)=> y>0 ? 0xFF6FA0 : 0xFFB0CC, fin:0xFF8AB8, edge:0xE84A80, tail:0xFF6FA0, tailEdge:0xFFD0E0 },
  green:  { body:(x,y,z)=> y<0 ? 0xC8F0A0 : ((x+y)%3===0 ? 0x2E9A7A : 0x3FC09A), fin:0x2E9A7A, edge:0x1E6A5A, tail:0x3FC09A, tailEdge:0xFF6FA0 }
};
export function reefFish(kind){
  const K = FISH[kind] || FISH.pink;
  const b = M();
  b.ell(0,0,0,3.2,1.9,.9,(x,y,z)=> K.body(x,y,z));
  // Clownfisch: schwarze Ränder an den weißen Bändern
  if(kind==="clown") for(const bx of [1,-2]) for(let y=-2;y<=2;y++) for(const z of [-1,0,1]){ if(b.list().some(c=>c[0]===bx+1&&c[1]===y&&c[2]===z)) b.put(bx+1,y,z,0x1A1A1A); }
  // Augen (weiß mit schwarzer Pupille), Maul
  for(const s of [-1,1]){ b.put(2,1,s,0xFFFFFF).put(3,1,s,0x0A0A0A); }
  b.put(4,0,0,K.edge);
  // Rückenflosse, Bauchflosse, Brustflossen
  for(let x=-2;x<=1;x++) b.put(x,2,0,K.fin); b.put(-1,3,0,K.edge).put(0,3,0,K.fin);
  b.put(-1,-2,0,K.fin).put(0,-2,0,K.fin);
  for(const s of [-1,1]) b.put(1,-1,2*s,K.fin).put(0,-1,2*s,K.edge);
  const t = M(); t.box(-4,-1,0,-4,1,0,K.tail).put(-5,-2,0,K.tail).put(-5,2,0,K.tail).box(-5,-1,0,-5,1,0,K.tail).put(-6,-3,0,K.tailEdge).put(-6,3,0,K.tailEdge).put(-6,-2,0,K.tailEdge).put(-6,2,0,K.tailEdge);
  return { parts:[ part(b,[0,0,0]), part(t,[-3,0,0],["y",.6,8,0]) ], noShadow:true };
}

/* ---------- Große Qualle: leuchtender Schirm mit Punkten, pulsierend; lange, wehende Fangarme ---------- */
export function bigJelly(col=0xF2F6FF, spot=0x3A7AE8, arm=0x6FA8FF){
  const bell = M();
  bell.ell(0,0,0,6,4.6,6,(x,y,z)=>{ if(y<0) return undefined; const r=Math.hypot(x,z); if(r<4.6 && y<1) return undefined;
    const sp = ((Math.round(x/2.6)+Math.round(z/2.6)+Math.round(y/2))%2===0) && ((x*x+z*z+y*y)%7<3); return sp ? spot : col; }, 1);
  bell.ell(0,0,0,4.4,3,4.4,(x,y,z)=> y<=0 || y>=1 ? undefined : 0xFFE0F0, 1);                               // innen leicht rosa
  for(let a=0;a<16;a++){ const t=a/16*Math.PI*2; bell.put(Math.cos(t)*6,0,Math.sin(t)*6,spot,1); }            // gezackter Rand
  const parts = [ part(bell,[0,0,0],null,{pulse:[.07,1.6,0]}) ];
  // Mundarme in der Mitte (gewellt) und dünne Fangarme am Rand, jeweils in 2 Gliedern
  const arms = [[0,0,3,10,0xE8F0FF],[1.6,1.6,3,9,0xE8F0FF],[-1.6,1.2,3,11,0xE8F0FF]];
  for(let i=0;i<10;i++){ const t=i/10*Math.PI*2; arms.push([Math.cos(t)*4.6, Math.sin(t)*4.6, 1, 14+(i%3)*3, arm]); }
  arms.forEach(([x,z,w,n,c],i)=>{ const a1=M(), a2=M(), half=Math.round(n/2);
    for(let k=1;k<=half;k++){ a1.put(x+Math.sin(k*.9+i)*(w>1?.8:.3), -k, z, c, 1); if(w>1) a1.put(x+1, -k, z, c, 1); }
    for(let k=half+1;k<=n;k++){ a2.put(x+Math.sin(k*.9+i)*(w>1?.8:.3), -k, z, c, 1); }
    const r1 = part(a1,[x,0,z],[i%2?"x":"z",.22,1.1,i*.7]); parts.push(r1); const idx = parts.length-1;
    parts.push(part(a2,[x,-half,z],[i%2?"z":"x",.35,1.4,i*.9],{parent:idx})); });
  return { parts, noShadow:true };
}

/* ---------- Krake: sitzt auf einem Felsen, acht Arme bewegen sich langsam und rollen sich ein ---------- */
export function octopus(){
  const C1=0xD8553A, C2=0xE8785A, C3=0xB03A28, SUCK=0xFFD8C0;
  const skin = (x,y,z) => ((x*3+y*5+z*7)%11===0) ? C3 : ((x+y+z)%4===0 ? C2 : C1);
  const body = M();
  body.ell(-1.5,7,0,3.6,4.4,3.4,skin); body.ell(.6,3.8,0,3,2.6,3,skin);                            // Mantel (nach hinten geneigt), Kopf
  for(const s of [-1,1]){ body.box(2,4,2.6*s,3,5,2.6*s,0xFFF4D8).put(3,5,2.8*s,0x101010).put(3,4,2.8*s,0x101010); body.put(1,6,2.4*s,C3).put(2,6,2.4*s,C3); }  // Augen mit Brauen
  body.put(3,3,0,C3);
  const parts = [ part(body,[0,0,0]) ];
  for(let i=0;i<8;i++){ const yaw = (i+.5)/8*Math.PI*2, ph = i*.8, L=3, N=5;
    let prev = null;
    for(let k=0;k<N;k++){ const seg = M(), r = 1.5*(1-k/N)+.45, x0 = 2+k*L;
      for(let s=0;s<=L;s++){ const x=x0+s, rr = r - s*.06; seg.ell(x,1,0,.55,rr,rr,(xx,yy,zz)=> yy<.5 ? SUCK : skin(xx,yy,zz)); }
      const base = k===0 ? -.05 : (k<3 ? -.12 : .55), amp = .12 + k*.07;
      const rot = k===0 ? ["y",.12,.35,ph,yaw] : ["z", amp, .6, ph + k*.6, base];
      parts.push(part(seg,[x0,1,0],rot, prev===null ? {} : {parent:prev}));
      prev = parts.length-1; } }
  return { parts };
}

/* ---------- Mantarochen: flacher Körper, Flügel schlagen langsam ---------- */
export function manta(){
  const TOP=0x2A3440, TOP2=0x36424E, BELLY=0xEEF2F6;
  const body = M(); body.ell(0,0,0,5,1.2,3,(x,y,z)=> y<0 ? BELLY : ((x+z)%5===0 ? TOP2 : TOP));
  for(const s of [-1,1]) body.box(5,0,1.5*s,7,0,2*s,TOP).put(7,0,2*s,TOP2);                       // Kopflappen
  body.line([-5,0,0],[-14,.5,0],()=>TOP);                                                           // Schwanz
  const wing = s => { const w = M(); w.poly([[3,2*s],[-4,2*s],[-1,13*s],[1,12*s]], (x,z)=>0, (x,y,z)=> (x+z)%6===0 ? TOP2 : TOP);
    w.poly([[2,3*s],[-3,3*s],[-1,10*s]], (x,z)=>-1, ()=>BELLY); return w; };
  return { parts:[ part(body,[0,0,0]), part(wing(1),[0,0,2],["x",.42,1.3,0]), part(wing(-1),[0,0,-2],["x",.42,1.3,Math.PI]) ] };
}

/* ---------- Meeresschildkröte: gemustertes Panzerschild, rudernde Flossen ---------- */
export function turtle(){
  const SH=0x7A5A2A, SH2=0xA8843A, SH3=0x4E3A1A, SK=0x8AA86A, SK2=0x6A8A4A;
  const body = M(); body.ell(0,0,0,6,2.6,4.6,(x,y,z)=> y<0 ? 0xE8DCA8 : (((x+20)%4===0||(z+20)%4===0) ? SH3 : ((x+z)%3===0 ? SH2 : SH)));
  const head = M(); head.ell(8,0,0,2.2,1.6,1.6,(x,y,z)=> (x+y+z)%3===0 ? SK2 : SK); for(const s of [-1,1]) head.put(9,1,s*2,0x101010);
  const fl = (s, front) => { const f = M(); const x0 = front ? 3 : -4; f.poly(front ? [[x0+1,4*s],[x0-1,4*s],[x0-4,11*s],[x0-2,11*s]] : [[x0+1,3.5*s],[x0-1,3.5*s],[x0-3,7*s]], ()=>-1, (x,y,z)=> (x+z)%3===0 ? SK2 : SK); return f; };
  return { parts:[ part(body,[0,0,0]), part(head,[6,0,0],["y",.15,.6,0]),
    part(fl(1,true),[3,-1,4],["x",.5,1.2,0]), part(fl(-1,true),[3,-1,-4],["x",.5,1.2,Math.PI]),
    part(fl(1,false),[-4,-1,3.5],["x",.3,1.2,1]), part(fl(-1,false),[-4,-1,-3.5],["x",.3,1.2,1+Math.PI]) ] };
}

/* ---------- Seepferdchen: aufrecht, eingerollter Schwanz, flatternde Rückenflosse ---------- */
export function seahorse(col=0xFFB03A, col2=0xFFD27A){
  const c = (x,y,z) => (y%2===0 ? col : col2);
  const b = M();
  b.seg([0,6,0],[1,2,0],1.4,1.1,c); b.seg([1,2,0],[0,-2,0],1.1,.8,c);                          // Brust, Bauch
  b.seg([0,-2,0],[-1,-5,0],.8,.5,c); b.seg([-1,-5,0],[0,-7,0],.5,.4,c); b.seg([0,-7,0],[1,-6,0],.4,.4,c);   // eingerollter Schwanz
  b.seg([0,7,0],[1,9,0],1.2,1,c); b.seg([1,9,0],[4,8,0],.6,.5,c);                              // Kopf, Schnauze
  for(const s of [-1,1]) b.put(1,9,s,0x101010);
  b.put(0,11,0,col2).put(-1,10,0,col2);                                                          // Krönchen
  const fin = M(); fin.box(-2,1,0,-2,3,0,0xFFF0C0).put(-3,2,0,0xFFF0C0);
  return { parts:[ part(b,[0,0,0]), part(fin,[-1,2,0],["y",.5,7,0]) ], noShadow:true };
}

/* ---------- Magma-Riese (eigener Entwurf): gebeugter Koloss aus Basaltbrocken mit glühenden Rissen und Lavakern ---------- */
export function magmaGiant(){
  const R1=0x1E1A1C, R2=0x2A2426, R3=0x151214, R4=0x3A3032, LAVA=0xFF7A1A, LAVA2=0xFFB040, HOT=0xFFE08A, OBS=0x2A1E3A;
  // Gestein: dunkle Platten, an „Nahtstellen“ glühende Risse
  const rock = (x,y,z) => { const cv = Math.abs(Math.sin(x*.55+y*.31)+Math.sin(z*.6-y*.27)); if(cv < .045) return [HOT,1]; if(cv < .1) return [LAVA,1];
    const k=((Math.round(x*.7)+Math.round(y*.5)*3+Math.round(z*.7)*5)%7+7)%7; return [k===0?R4:k<3?R2:k===3?R3:R1,0]; };
  const P = (m,f) => (x,y,z)=>{ const [c,e]=f(x,y,z); m.put(x,y,z,c,e); };
  const blob = (m,cx,cy,cz,rx,ry,rz) => { for(let x=Math.floor(cx-rx-1);x<=cx+rx+1;x++) for(let y=Math.floor(cy-ry-1);y<=cy+ry+1;y++) for(let z=Math.floor(cz-rz-1);z<=cz+rz+1;z++)
      if(((x-cx)/(rx+.35))**2+((y-cy)/(ry+.35))**2+((z-cz)/(rz+.35))**2<=1){ const [c,e]=rock(x,y,z); m.put(x,y,z,c,e); } };
  const limb = (m,a,b,r0,r1) => { const n=Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1],b[2]-a[2])*1.4); for(let i=0;i<=n;i++){ const f=i/n; blob(m,a[0]+(b[0]-a[0])*f,a[1]+(b[1]-a[1])*f,a[2]+(b[2]-a[2])*f,r0+(r1-r0)*f,r0+(r1-r0)*f,r0+(r1-r0)*f); } };
  const body = M();
  // Becken, mächtiger Brustkorb (nach vorn gebeugt), Buckel
  blob(body,0,20,0,6,5,7); blob(body,3,30,0,8,8,10); blob(body,-1,36,0,7,6,9); blob(body,6,27,0,5,6,7);
  // glühender Lavakern in der Brust, sichtbar durch eine Spalte
  for(let y=26;y<=33;y++) for(let z=-3;z<=3;z++){ const d=Math.abs(z)+Math.abs(y-29.5)*.6; if(d<3.4){ for(let x=9;x<=12;x++) body.put(x,y,z, d<1.5?HOT:(d<2.6?LAVA2:LAVA),1); } }
  // Obsidian-Zacken auf Rücken und Schultern
  for(const [x,y,z,h] of [[-3,42,0,6],[-6,38,4,5],[-6,38,-4,5],[0,40,6,4],[0,40,-6,4],[2,38,9,5],[2,38,-9,5],[-8,32,0,4]]){ for(let k=0;k<h;k++){ body.put(x-k*.4,y+k,z+(z>0?k*.3:z<0?-k*.3:0),OBS); if(k<h-2) body.put(x-k*.4+1,y+k,z,OBS); } body.put(x-h*.4,y+h,z,0xFF9A40,1); }
  // Beine: kurz, säulenartig
  const legs=[]; for(const s of [-1,1]){ const l=M(); limb(l,[0,20,4*s],[1,10,5*s],3.4,3); limb(l,[1,10,5*s],[2,2,5.5*s],3,3.6); blob(l,3,1,5.5*s,4.4,1.6,3.6); legs.push([l,[0,19,4*s],s]); }
  // Kopf: tief zwischen den Schultern, Steinkiefer, Augen-Schlitze, Glut im Maul
  const head = M(); blob(head,11,36,0,3.6,3.2,3.6); blob(head,13,33,0,3,1.6,3.2);
  for(const s of [-1,1]){ head.box(14,37,1.5*s,15,37,2.6*s,HOT,1); head.put(13,38,2*s,LAVA,1); head.box(13,38,1*s,15,39,3*s,R3); }
  for(let z=-2;z<=2;z++) head.put(15,34,z,LAVA2,1); for(const z of [-2,0,2]) head.put(15,35,z,0xEDE2CC);
  // Arme: lang, Fäuste bis fast zum Boden, Lava tropft von den Fingern
  const arms=[]; for(const s of [-1,1]){ const a=M(); blob(a,4,36,9*s,4.4,4,4); limb(a,[4,35,10*s],[7,25,12*s],3.6,3.2); limb(a,[7,25,12*s],[10,14,11*s],3.2,3);
    blob(a,11,10,11*s,4,3.6,3.8); for(const dz of [-2,0,2]){ limb(a,[13,10,11*s+dz],[15,7,11*s+dz],1.3,1.1); a.put(15,5,11*s+dz,LAVA2,1); a.put(15,4,11*s+dz,LAVA,1); }
    arms.push([a,[4,36,9*s],s]); }
  return { parts:[ {cubes:body.list(), pivot:[0,20,0]}, {cubes:head.list(), pivot:[9,35,0], parent:0},
    ...arms.map(([a,pv])=>({cubes:a.list(), pivot:pv, parent:0})), ...legs.map(([l,pv])=>({cubes:l.list(), pivot:pv})) ] };
}

/* ---------- Obsidian-Dämon (eigener Entwurf): schlank, Rabenschwingen aus Knochenfedern, Schnabelschädel mit drei Augen, violettes Seelenfeuer ---------- */
export function shadeDemon(){
  const OB=0x141018, OB2=0x221A28, OB3=0x302438, BONE=0xE8E4DC, BONE2=0xC8C2B8, VI=0xB040FF, VI2=0xE090FF, VI3=0x6A1AB0, CY=0x7FF0FF;
  const skin = (x,y,z) => ((x*3+y*5+z*7)%9===0) ? OB3 : ((x+y+z)%3===0 ? OB2 : OB);
  const body = M();
  // Becken, schmale Taille, Brustkorb mit glühenden Rippenspalten
  body.ell(0,20,0,3,2.4,3.4,skin); body.seg([0,21,0],[0,26,0],2.2,2.6,skin); body.ell(.5,30,0,3.6,4,4.6,skin);
  for(const y of [27,29,31,33]) for(let z=-3;z<=3;z++){ if(Math.abs(z)<1) continue; body.put(4,y,z,VI,1); body.put(3,y,z, Math.abs(z)>2?VI3:VI2,1); }
  body.ell(4.2,30,0,.8,2.6,.8,VI2,1);                                                   // Brustbein glüht
  // Schultern mit Knochenplatten
  for(const s of [-1,1]){ body.ell(0,34,5*s,2.4,2,2.2,skin); body.box(-1,36,4*s,2,36,6*s,BONE2); body.put(0,37,5*s,BONE); }
  // Hals
  body.seg([1,34,0],[3,38,0],1.6,1.3,skin);
  // Kopf: langer Schnabelschädel, drei Augen, nach hinten gerichtete Kristallkrone
  const head = M();
  head.ell(4,40,0,2.6,2.4,2.2,BONE); head.seg([5,39.5,0],[12,37,0],1.8,.5,BONE); head.seg([5,38,0],[11,36.4,0],1.1,.35,BONE2);
  head.put(10,37,0,OB).put(9,37,0,OB);
  for(const z of [-1,1]) head.box(6,40,z*1.6,6,40,z*1.6,VI2,1); head.put(6,41,0,CY,1).put(5,41,0,CY,1);
  for(let i=0;i<7;i++){ const a=(i-3)*.42; head.seg([3,42,0],[-4,45+Math.cos(a)*3,Math.sin(a)*6],.6,.25,OB3); head.put(-4,46+Math.cos(a)*3,Math.sin(a)*6,VI2,1); }
  // Arme: lang, dünn, Krallen
  const arms=[]; for(const s of [-1,1]){ const a=M(); a.seg([0,34,6*s],[3,28,8*s],1.3,1.1,skin).seg([3,28,8*s],[7,22,8*s],1.1,.9,skin);
    for(const dz of [-.8,0,.8]) a.line([7,22,8*s+dz],[9,19,8*s+dz*1.6],BONE); a.put(9,19,8*s,VI2,1); arms.push([a,[0,34,6*s]]); }
  // Beine: rückwärts geknickt, Klauen
  const legs=[]; for(const s of [-1,1]){ const l=M(); l.seg([0,19,2.4*s],[2,13,2.8*s],1.6,1.2,skin).seg([2,13,2.8*s],[-1,6,2.8*s],1.2,.9,skin).seg([-1,6,2.8*s],[1,1,2.8*s],.9,.8,skin);
    for(const dz of [-.9,0,.9]) l.line([1,1,2.8*s+dz],[4,0,2.8*s+dz*1.8],BONE); l.line([1,1,2.8*s],[-1,0,2.8*s],BONE); legs.push([l,[0,19,2.4*s]]); }
  // Schwanz mit Kristallstachel
  const tail = M(); tail.seg([-2,20,0],[-8,16,0],1.4,1,skin).seg([-8,16,0],[-14,14,0],1,.6,skin).seg([-14,14,0],[-18,15,0],.6,.4,skin); tail.line([-18,15,0],[-21,17,0],VI2,1); tail.put(-21,17,0,CY,1);
  // Schwingen: Knochenarm, lange Federklingen (dunkel, Kanten violett glühend), Ober- und Unterflügel
  const wing = s => { const w=M(), o=M();
    w.seg([-1,35,3*s],[-3,40,10*s],.9,.7,BONE2).seg([-3,40,10*s],[-2,44,17*s],.7,.5,BONE2);
    for(let i=0;i<9;i++){ const bx=-3+(i*.2), bz=(5+i*1.4)*s, by=37+i*.8; for(let k=0;k<14+i;k++){ const y=by-k*.9, x=bx-k*.55; w.put(x,y,bz, k>=12+i ? VI2 : (k%3===0 ? OB3 : OB2), k>=12+i ? 1 : 0); w.put(x,y,bz+(s*.6), OB); } }
    o.seg([-2,44,17*s],[1,49,29*s],.6,.35,BONE);
    for(let i=0;i<10;i++){ const bz=(17+i*1.2)*s, by=44+i*.5, bx=-2+i*.3; for(let k=0;k<18+i*.6;k++){ const y=by-k*.95, x=bx-k*.6; o.put(x,y,bz, k>=16+i*.6 ? VI2 : (k%3===1 ? OB3 : OB2), k>=16+i*.6 ? 1 : 0); } o.put(bx+.6,by+1,bz,VI,1); }
    return [w,o]; };
  const [wL,oL]=wing(1), [wR,oR]=wing(-1);
  return { parts:[ {cubes:body.list(), pivot:[0,20,0]}, {cubes:head.list(), pivot:[3,38,0], parent:0},
    ...arms.map(([a,pv])=>({cubes:a.list(), pivot:pv, parent:0})), ...legs.map(([l,pv])=>({cubes:l.list(), pivot:pv})),
    {cubes:tail.list(), pivot:[-2,20,0]},
    {cubes:wL.list(), pivot:[-1,35,3], parent:0, rot:["x",.2,1.2,0,-.15]}, {cubes:oL.list(), pivot:[-2,44,17], parent:7, rot:["x",.15,1.2,-.5]},
    {cubes:wR.list(), pivot:[-1,35,-3], parent:0, rot:["x",-.2,1.2,0,.15]}, {cubes:oR.list(), pivot:[-2,44,-17], parent:9, rot:["x",-.15,1.2,-.5]} ] };
}

/* ---------- Magma-Drache (eigener Entwurf): zweibeiniger Drache aus Basaltplatten mit Lavarissen, sehr fein gebaut ---------- */
export function magmaDrake(){
  const K=1.5;
  const B1=0x1C1718, B2=0x2A2224, B3=0x3A2E2C, B4=0x121010, L1=0xFF6A10, L2=0xFFA030, L3=0xFFE08A, HORN=0x0E0B0C, HORN2=0x3A302E, TOOTH=0xF2E8D2, MEM=0x2A1210, MEM2=0x3E1A12;
  // Panzerplatten: dunkle Basaltschollen, dazwischen glühende Fugen; Bauch heller mit Lavaquerrillen
  const plate = (x,y,z) => { const X=x/K, Y=y/K, Z=z/K, v=Math.abs(Math.sin(X*.9+Y*.35)+Math.sin(Z*1.1-Y*.4)+.5*Math.sin(X*.4-Z*.7));
    if(v<.07) return [L3,1]; if(v<.17) return [L1,1]; const k=((Math.round(x*.6)+Math.round(y*.45)*3+Math.round(z*.6)*5)%9+9)%9; return [k===0?B3:k<3?B2:k===4?B4:B1,0]; };
  const belly = (x,y,z) => { const Y=y/K; return (Math.round(Y*1.4)%3===0) ? [L2,1] : [B3,0]; };
  const E = (m,cx,cy,cz,rx,ry,rz,f) => { cx*=K; cy*=K; cz*=K; rx*=K; ry*=K; rz*=K; for(let x=Math.floor(cx-rx-1);x<=cx+rx+1;x++) for(let y=Math.floor(cy-ry-1);y<=cy+ry+1;y++) for(let z=Math.floor(cz-rz-1);z<=cz+rz+1;z++)
      if(((x-cx)/(rx+.35))**2+((y-cy)/(ry+.35))**2+((z-cz)/(rz+.35))**2<=1){ const [c,e]=(typeof f==="function")?f(x,y,z):[f,0]; m.put(x,y,z,c,e); } };
  const G = (m,a,b,r0,r1,f) => { const n=Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1],b[2]-a[2])*2)||1; for(let i=0;i<=n;i++){ const t=i/n, r=r0+(r1-r0)*t; E(m,a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t,r,r,r,f); } };
  const glow = c => [c,1];
  const body = M();
  // Rumpf: aufrecht, leicht nach vorn geneigt; breiter Brustkorb, schmaleres Becken
  E(body,0,19,0,4.2,3.4,3.6,plate); G(body,[0,20,0],[1.6,26,0],3.8,4.6,plate); E(body,2.2,28.5,0,4.6,4.4,4.8,plate);
  E(body,4.6,27,0,1.6,4.6,2.6,belly); E(body,3.8,21.5,0,1.4,3,2.3,belly);
  // Lavakern in der Brust (Spalte zwischen den Platten)
  for(let y=25;y<=31;y+=.5) for(let z=-1.6;z<=1.6;z+=.5){ const d=Math.abs(z)+Math.abs(y-28)*.45; if(d<1.9) body.put(Math.round(6.1*K),Math.round(y*K),Math.round(z*K), d<.8?L3:L2,1); }
  // Rückenstacheln in einer Reihe, Schulterdornen
  for(let i=0;i<8;i++){ const y=18+i*2.1, x=-3.6+i*.55-(i>5?(i-5)*.3:0), h=1.6+Math.sin(i/7*Math.PI)*2.4; G(body,[x,y,0],[x-h*.9,y+h*.6,0],.55,.12,HORN); body.put(Math.round((x-h*.9)*K),Math.round((y+h*.6)*K),0,L1,1); }
  for(const s of [-1,1]){ E(body,1,31,4.4*s,2.6,2.2,2.2,plate); G(body,[0,32.5,4.6*s],[-1.6,35.5,6.4*s],.6,.15,HORN); G(body,[1.6,32.2,5*s],[1.2,34.6,7*s],.45,.12,HORN2); }
  // Hals: S-Kurve nach vorn oben, Kehlplatten glühen
  const neck = [[3,31,0,2.6],[5,34,0,2.2],[6.4,37,0,1.9],[8,39,0,1.7]]; for(let i=1;i<neck.length;i++) G(body,neck[i-1].slice(0,3),neck[i].slice(0,3),neck[i-1][3],neck[i][3],plate);
  for(let i=0;i<4;i++) E(body,5.4+i*.9,32.5+i*1.9,0,.6,.5,1.2,glow(L2));
  for(let i=0;i<4;i++){ const p=neck[Math.min(3,i)]; G(body,[p[0]-1.2,p[1]+1,0],[p[0]-2.4,p[1]+2.6,0],.4,.1,HORN); }
  // Kopf: Drachenschädel mit Schnauze, Unterkiefer (öffnet sich), Zähne, glühende Augen, geschwungene Hörner, Wangendornen
  const head = M();
  E(head,10,40.5,0,2.6,2.1,2.2,plate); G(head,[11,40.4,0],[15.6,39.6,0],1.7,1.1,plate); E(head,15.8,39.8,0,1.1,.9,1,plate);
  for(const s of [-1,1]){ E(head,11.6,41.6,1.5*s,.55,.35,.3,glow(L3)); E(head,11.3,42.1,1.6*s,.8,.25,.45,HORN); head.put(Math.round(16.6*K),Math.round(40.2*K),Math.round(.5*s*K),L2,1);
    G(head,[9.4,42,1.4*s],[7,44.5,2.6*s],.55,.38,HORN); G(head,[7,44.5,2.6*s],[4.6,45.2,3*s],.38,.2,HORN2); G(head,[4.6,45.2,3*s],[3.6,44.4,3.2*s],.2,.1,HORN2);
    G(head,[9.6,39,2*s],[8,38,3.2*s],.35,.1,HORN); G(head,[10.6,39.2,2*s],[9.6,37.8,3*s],.3,.1,HORN); }
  for(let x=11.5;x<=15.5;x+=.8) for(const s of [-1,1]) head.put(Math.round(x*K),Math.round(38.9*K),Math.round(.85*s*K),TOOTH);
  const jaw = M(); G(jaw,[10.4,39.2,0],[15,38.2,0],1.1,.75,plate); E(jaw,13,38.6,0,1.6,.3,.7,glow(L1));
  for(let x=11.5;x<=14.5;x+=.8) for(const s of [-1,1]) jaw.put(Math.round(x*K),Math.round(39.2*K),Math.round(.7*s*K),TOOTH);
  // Arme: kurze, kräftige Vorderarme mit Krallen
  const arms=[]; for(const s of [-1,1]){ const a=M(); G(a,[3,29,4.4*s],[5.4,25.2,5*s],1.3,1.05,plate); G(a,[5.4,25.2,5*s],[8,23.4,4.4*s],1.05,.85,plate); E(a,5.4,25.2,5*s,1.1,1,1,plate);
    for(const dz of [-.6,0,.6]){ G(a,[8,23.4,4.4*s+dz],[9.4,22.4,4.4*s+dz*1.4],.32,.12,HORN); a.put(Math.round(9.5*K),Math.round(22.3*K),Math.round((4.4*s+dz*1.4)*K),L2,1); } arms.push([a,[3,29,4.4*s].map(v=>v*K)]); }
  // Beine: mächtige Oberschenkel, Fersengelenk hinten, Zehen mit Krallen (Vogel-/Drachenbein)
  const legs=[]; for(const s of [-1,1]){ const l=M(); E(l,.4,17,3.2*s,2.6,3.4,2.2,plate); G(l,[.6,15,3.4*s],[2.6,10,3.8*s],2,1.5,plate); G(l,[2.6,10,3.8*s],[-.6,5,3.8*s],1.4,1.1,plate); G(l,[-.6,5,3.8*s],[.6,1.2,3.8*s],1.1,.9,plate);
    E(l,2.6,10,3.8*s,1.3,1.3,1.3,glow(L1)); E(l,2.6,10,3.8*s,1.6,1.1,1.2,plate);
    for(const dz of [-1,0,1]){ G(l,[.6,1,3.8*s+dz*.5],[3.4,.4,3.8*s+dz*1.5],.5,.35,plate); G(l,[3.4,.4,3.8*s+dz*1.5],[4.4,0,3.8*s+dz*1.7],.3,.12,HORN); } G(l,[.4,1,3.8*s],[-1.4,.3,3.8*s],.45,.15,HORN);
    legs.push([l,[.4,18,3.2*s].map(v=>v*K)]); }
  // Schwanz in drei Gliedern mit Stachelreihe und glühender Keule
  const t1=M(), t2=M(), t3=M();
  G(t1,[-3,18,0],[-8,14,0],2.6,2,plate); G(t2,[-8,14,0],[-14,10.5,0],2,1.4,plate); G(t3,[-14,10.5,0],[-20,9,0],1.4,.7,plate);
  for(let i=0;i<5;i++){ const m=[t1,t2,t2,t3,t3][i], x=-6-i*3, y=17-i*1.7; G(m,[x,y,0],[x-1.2,y+1.6,0],.4,.1,HORN); }
  E(t3,-20.5,9,0,1.1,.9,.9,glow(L2)); for(const s of [-1,1]) G(t3,[-20,9,0],[-22.4,9.6,1.4*s],.35,.1,HORN);
  // Schwingen: groß und dämonisch – kräftiger Knochenarm mit Dornen, Daumenkralle, vier lange Finger mit Hakenkrallen,
  // Haut mit Lavaadern, Rissen und Löchern, zerfetzter glühender Hinterrand
  const wings=[]; for(const s of [-1,1]){ const w=M(), o=M(), WS=1.55;
    const sh=[-.4,32,3.6*s], el=[-2.6,38.5,11*s], wr=[-1,44,20*s];
    G(w,sh,el,1.1,.85,plate); G(w,el,wr,.85,.6,plate); E(w,el[0],el[1],el[2],1.1,1.1,1.1,plate);
    for(let k=1;k<=4;k++){ const t=k/5, p=[0,1,2].map(i=>sh[i]+(el[i]-sh[i])*t); G(w,[p[0],p[1]+.6,p[2]],[p[0]-.4,p[1]+2,p[2]+.2*s],.35,.1,HORN); }
    // innere Haut: Schulter, Ellbogen bis zur Hüfte
    for(let u=0;u<=1;u+=.02) for(let v=0;v<=1;v+=.025){ const A=sh, Bp=el, C=[-5,19,4*s], D=[-8,22,12*s];
      const p=[0,1,2].map(i=> (1-u)*(1-v)*A[i]+u*(1-v)*Bp[i]+(1-u)*v*C[i]+u*v*D[i]); const vein = Math.abs(Math.sin(u*11+v*3))<.1, hole=((Math.round(u*14)*7+Math.round(v*12)*3)%23===0);
      if(hole) continue; w.put(Math.round(p[0]*K),Math.round(p[1]*K),Math.round(p[2]*K), vein?L1:(((u*24+v*15)|0)%4===0?MEM2:MEM), vein?1:0); }
    // äußere Schwinge
    const tips=[[-.5,55,30*s],[-7,47,36*s],[-13,36,34*s],[-15,26,27*s],[-11,20,18*s]];
    G(o,el,wr,.85,.6,plate);
    G(o,wr,[1.2,47,21*s],.45,.25,HORN); G(o,[1.2,47,21*s],[2.4,46.2,22*s],.25,.1,HORN2);                       // Daumenkralle
    for(const tp of tips.slice(0,4)){ G(o,wr,tp,.55,.22,plate); const d=[0,1,2].map(i=>tp[i]-wr[i]), l=Math.hypot(...d), u=d.map(v=>v/l);
      G(o,tp,[tp[0]+u[0]*2.2-.8,tp[1]+u[1]*2.2-1.2,tp[2]+u[2]*2.2],.3,.08,HORN);                                // Hakenkralle
      for(let k=1;k<=3;k++){ const q=[0,1,2].map(i=>wr[i]+d[i]*k/4); G(o,q,[q[0]-.3,q[1]+1.2,q[2]],.22,.06,HORN2); } }   // Dornen an den Fingern
    for(let k=0;k<tips.length-1;k++) for(let u=0;u<=1;u+=.018) for(let v=0;v<=1;v+=.018){ if(u+v>1) continue; const a=tips[k], b=tips[k+1];
      // Hinterrand zwischen den Fingerspitzen nach innen gewölbt (Bogen), zerfetzt
      const sag = (u+v>.0) ? Math.sin(Math.PI*(v/(u+v||1)))*.22*(u+v) : 0, f = 1-sag;
      const p=[0,1,2].map(i=> wr[i]+((a[i]-wr[i])*u+(b[i]-wr[i])*v)*f);
      const edge=u+v>.92, vein=Math.abs(u-v*1.25)<.03||Math.abs(u*.65-v)<.028||Math.abs(Math.sin((u+v)*14))<.06;
      const tear = ((Math.round(u*30)*11+Math.round(v*30)*7+k*5)%37===0) || (edge && ((Math.round(u*50)+k)%4===0));
      if(tear) continue; o.put(Math.round(p[0]*K),Math.round(p[1]*K),Math.round(p[2]*K), vein?L2:(edge?L1:(((u*37+v*19)|0)%5===0?MEM2:MEM)), (vein||edge)?1:0); }
    wings.push([w,sh.map(v=>v*K),o,el.map(v=>v*K),s]); }
  const parts = [ {cubes:body.list(), pivot:[0,19*K,0]},
    {cubes:head.list(), pivot:[8*K,39*K,0], parent:0, rot:["z",.06,.9,0]}, {cubes:jaw.list(), pivot:[10.4*K,39.2*K,0], parent:1, rot:["z",.08,1.6,0,-.05]} ];
  arms.forEach(([a,pv],i)=>parts.push({cubes:a.list(), pivot:pv, parent:0, rot:["z",.12,1.1,i*1.3]}));
  legs.forEach(([l,pv])=>parts.push({cubes:l.list(), pivot:pv}));
  parts.push({cubes:t1.list(), pivot:[-3*K,18*K,0], rot:["y",.12,.8,0]}); const ti=parts.length-1; parts.push({cubes:t2.list(), pivot:[-8*K,14*K,0], parent:ti, rot:["y",.18,.8,-.6]}); parts.push({cubes:t3.list(), pivot:[-14*K,10.5*K,0], parent:ti+1, rot:["y",.25,.8,-1.2]});
  wings.forEach(([w,pv,o,pv2,s])=>{ parts.push({cubes:w.list(), pivot:pv, parent:0, rot:["x",.18*s,.9,0,-.05*s]}); const wi=parts.length-1; parts.push({cubes:o.list(), pivot:pv2, parent:wi, rot:["x",.14*s,.9,-.5]}); });
  return { parts };
}

/* ---------- Roter Dämon (1:1 nach Vorlage des Nutzers). Maße aus dem Bild abgeleitet (≈ 0,15 Einheiten pro Bildpixel). ---------- */
export function redDemon(){
  const R=[0xA8342A,0xB43C30,0x9C2E24,0xB8402F], RD=[0x7A2219,0x84261C,0x6E1E16], IR=[0x9A9A9A,0xA6A6A6,0x8E8E8E], IRD=0x5A5A5A, BK=[0x1E1B1D,0x252123,0x18161A],
        EYE=0xF2C232, EYE2=0xFFE070, TOOTH=0xE6E0D0, MOUTH=0x2A0C08, MEM=[0xC0603E,0xC86A44,0xB45838,0xCA7048], RIB=0x8A2A1E, EDGE=0x9C2E22;
  const pk=(a,x,y,z)=>a[((x*7+y*13+z*5)%a.length+a.length)%a.length];
  const skin=(x,y,z)=> ((x*5+y*3+z*7)%13===0) ? pk(RD,x,y,z) : pk(R,x,y,z), iron=(x,y,z)=>pk(IR,x,y,z), blk=(x,y,z)=>pk(BK,x,y,z);
  // ----- Rumpf (y 21–42, Breite z ±11, Tiefe x ±7)
  const body=M();
  body.box(-7,21,-11,7,42,11,skin);
  body.box(7,33,-10,8,40,-1,skin).box(7,33,1,8,40,10,skin);                                  // Brustmuskeln
  body.box(8,33,0,8,40,0,(x,y,z)=>pk(RD,x,y,z));
  for(const y of [24,27,30]) body.box(8,y,-6,8,y,6,(x,y,z)=>pk(RD,x,y,z));                    // Bauchrillen
  for(const z of [-3,3]) body.box(8,23,z,8,31,z,(x,y,z)=>pk(RD,x,y,z));
  body.box(-7,42,-9,7,43,9,skin);                                                           // Nacken
  // Kette: von der linken Schulter diagonal zur rechten Hüfte (Glieder abwechselnd)
  for(let i=0;i<=11;i++){ const y=Math.round(42-i*1.75), z=Math.round(-8+i*1.6); if(i%2===0) body.box(8,y,z-1,9,y,z+1,iron).put(9,y,z,IRD); else body.box(8,y-1,z,9,y+1,z,iron).put(9,y,z,IRD); }
  for(let i=0;i<6;i++){ const y=Math.round(42-i*3.4), z=Math.round(-8+i*3.2); body.box(-8,y,z,-8,y,z+1,iron); }
  // Gürtel mit Schnalle, Lendenschurz
  body.box(-7,21,-11,7,23,11,iron); body.box(8,20,-2,8,24,2,IRD); body.box(9,21,-1,9,23,1,pk(IR,0,0,0));
  body.box(-6,16,-10,7,20,10,blk); body.box(8,9,-4,8,20,4,blk); body.box(-8,12,-3,-7,20,3,blk);
  // ----- Kopf (y 40–53, Breite z ±9, nach vorn versetzt)
  const head=M();
  head.box(-4,40,-9,10,53,9,skin);
  head.box(11,49,-9,11,52,9,(x,y,z)=>pk(RD,x,y,z)); for(const z of [-5,5]) head.box(12,50,z-2,12,51,z+2,(x,y,z)=>pk(RD,x,y,z));   // Brauenwulst mit zwei Höckern
  for(const s of [-1,1]){ head.box(11,47,3*s,11,48,6*s,EYE); head.put(11,48,(3+(s>0?2:1))*s,EYE2,1); }
  head.box(11,45,-1,12,46,1,(x,y,z)=>pk(RD,x,y,z));                                          // Nase
  head.box(11,40,-7,11,44,7,MOUTH);
  for(let z=-7;z<=7;z++){ if(z%2===0){ head.put(11,44,z,TOOTH).put(11,43,z,TOOTH); } else head.put(11,40,z,TOOTH).put(11,41,z,TOOTH); }
  for(const z of [-8,8]) head.box(11,40,z,11,44,z,skin);
  head.box(2,54,-1,3,56,1,iron); head.put(2,57,0,IRD);                                       // Stachel oben
  // Rillenhörner: aus den oberen Ecken, gerade schräg nach außen oben, quadratischer Querschnitt, dunkle Bänder
  for(const s of [-1,1]) for(let k=0;k<10;k++){ const y=52+k*1.05, z=(6+k*1.05)*s; for(let a=-2;a<=2;a++) for(let c=-2;c<=2;c++) for(let b=0;b<=1;b++) head.put(1+a, Math.round(y)+b, Math.round(z)+c, (k%2 && b===1) ? IRD : iron(a,k,c)); }
  // ----- Arme: massige Schulterblöcke, Bänder an Oberarm und Handgelenk, große Fäuste
  const arms=[];
  for(const s of [-1,1]){ const a=M(); const z0=11*s, z1=18*s;
    a.box(-5,30,z0,5,43,z1,skin); a.box(-5,34,z0,5,35,z1,iron); a.box(6,34,z0,6,35,z1,IRD);
    a.box(-4,17,z0+s,5,30,z1,skin); a.box(-4,20,z0+s,5,21,z1,iron);
    a.box(-4,12,z0+s,6,17,z1,skin); a.box(7,13,z0+2*s,7,16,z1-s,(x,y,z)=>pk(RD,x,y,z));          // Faust mit Fingerkante
    for(let y=13;y<=16;y+=1) a.put(7,y,Math.round((z0+z1)/2),pk(RD,0,y,0));
    arms.push([a,[0,40,14*s],s]); }
  // ----- Beine: kurz, dick, Knöchelband, Füße
  const legs=[];
  for(const s of [-1,1]){ const l=M(); l.box(-3,4,2*s,4,21,9*s,skin); l.box(-3,3,2*s,4,5,9*s,iron); l.box(5,3,2*s,5,5,9*s,IRD); l.box(-3,0,2*s,6,2,9*s,skin); l.box(7,0,3*s,7,1,8*s,(x,y,z)=>pk(RD,x,y,z)); legs.push([l,[0,20,4*s],s]); }
  // ----- Flügel: Oberkante als dunkler Knochen, Finger als dunkle Rippen, Haut hell-orange, unterer Rand gezackt
  const wings=[];
  for(const s of [-1,1]){ const w=M();
    const top = z => z<=24 ? 37+(z-8)*.55 : 46+(z-24)*.12;                                 // Oberkante (y) über z (Betrag)
    const el=[24,46], tips=[[45,33],[40,28],[33,27],[25,28],[16,31],[9,33]];               // [z,y] Fingerspitzen unten
    const bottom = z => { let best=99; for(let i=0;i+1<tips.length;i++){ const [za,ya]=tips[i], [zb,yb]=tips[i+1], lo=Math.min(za,zb), hi=Math.max(za,zb); if(z<lo||z>hi) continue; const f=(z-za)/(zb-za); best = ya+(yb-ya)*f + Math.sin(f*Math.PI)*3.2; } return best; };
    const near = (z,y) => tips.slice(0,5).some(([tz,ty])=>{ const ax=el[0], ay=el[1], dx=tz-ax, dy=ty-ay, t=Math.max(0,Math.min(1,((z-ax)*dx+(y-ay)*dy)/(dx*dx+dy*dy))); return Math.hypot(ax+dx*t-z, ay+dy*t-y) < .75; });
    for(let z=8; z<=46; z++){ const yt=Math.round(top(z)), yb=Math.round(bottom(z)); if(yb>=99) continue;
      for(let y=yb; y<=yt; y++){ const x=-8-Math.round((z-8)*.08), c = y>=yt-1 ? EDGE : near(z,y) ? RIB : (y<=yb ? EDGE : pk(MEM,x,y,z)); w.put(x,y,z*s,c); } }
    for(const [tz,ty] of tips) w.put(-8-Math.round((tz-8)*.08), Math.round(ty)-1, tz*s, EDGE);
    wings.push([w,[-8,40,8*s],s]); }
  const fly = cr => cr && (cr._ph==="land"||cr._ph==="up") ? 1-(cr._sit||0) : 0, fire = cr => cr && cr._fire || 0;
  const parts=[ {cubes:body.list(), pivot:[0,21,0]}, {cubes:head.list(), pivot:[2,41,0], parent:0, fn:(g,tt,cr)=>{ const f=fire(cr); g.rotation.z = .6*f + .03*Math.sin(tt*.8); g.rotation.y = (1-f)*.18*Math.sin(tt*.35); }} ];
  arms.forEach(([a,pv,s])=>parts.push({cubes:a.list(), pivot:pv, parent:0, fn:(g,tt,cr)=>{ const fl=fly(cr), f=fire(cr); g.rotation.z = (s>0 ? .35 : -.05)*(1-fl) - fl*.5 + .1*Math.sin(tt*.9+(s>0?0:Math.PI)) + f*1.1; g.rotation.x = s*(fl*.25 + f*.35); }}));
  legs.forEach(([l,pv,s])=>parts.push({cubes:l.list(), pivot:pv, fn:(g,tt,cr)=>{ const fl=fly(cr); g.rotation.z = (s>0 ? .18 : -.1)*(1-fl) - fl*.55 + fl*.12*Math.sin(tt*3+s); }}));
  wings.forEach(([w,pv,s])=>parts.push({cubes:w.list(), pivot:pv, parent:0, fn:(g,tt,cr)=>{ const fl=fly(cr); g.rotation.x = s*(-.36 + fl*.75*Math.sin(tt*5.5) + (1-fl)*.1*Math.sin(tt*1.3)); }}));
  return { parts };
}
