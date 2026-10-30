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
