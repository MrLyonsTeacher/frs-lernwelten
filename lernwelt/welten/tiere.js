/* FRS Lernwelten – Tiere aus Klötzchen.
   Jedes Tier schaut in +x-Richtung, y ist oben. Es besteht aus Teilen (parts) mit Drehpunkt (pivot) und Bewegung (rot: [Achse, Ausschlag, Tempo, Phase, Grundwinkel]).
   Die Welten setzen sie mit orbit (Kreisbahn) oder at (fester Platz) in world.creatures ein. */

export function M(){
  const c = new Map();
  const put = (x,y,z,col,em) => { x=Math.round(x); y=Math.round(y); z=Math.round(z); if(col===null||col===undefined){ c.delete(`${x},${y},${z}`); return m; } c.set(`${x},${y},${z}`, [x,y,z,col,em?1:0]); return m; };
  const C = (col,x,y,z) => typeof col==="function" ? col(x,y,z) : col;
  const m = {
    put,
    box(x0,y0,z0,x1,y1,z1,col,em){ for(let x=Math.min(x0,x1);x<=Math.max(x0,x1);x++) for(let y=Math.min(y0,y1);y<=Math.max(y0,y1);y++) for(let z=Math.min(z0,z1);z<=Math.max(z0,z1);z++) put(x,y,z,C(col,x,y,z),em); return m; },
    ell(cx,cy,cz,rx,ry,rz,col,em){ for(let x=Math.floor(cx-rx-1);x<=Math.ceil(cx+rx+1);x++) for(let y=Math.floor(cy-ry-1);y<=Math.ceil(cy+ry+1);y++) for(let z=Math.floor(cz-rz-1);z<=Math.ceil(cz+rz+1);z++)
      if(((x-cx)/(rx+.35))**2+((y-cy)/(ry+.35))**2+((z-cz)/(rz+.35))**2<=1) put(x,y,z,C(col,x,y,z),em); return m; },
    // Glieder: Kette von Kugeln entlang einer Linie, Radius von r0 nach r1
    seg(p0,p1,r0,r1,col,em){ const n=Math.ceil(Math.hypot(p1[0]-p0[0],p1[1]-p0[1],p1[2]-p0[2])*1.5)||1;
      for(let i=0;i<=n;i++){ const f=i/n, r=r0+(r1-r0)*f; m.ell(p0[0]+(p1[0]-p0[0])*f, p0[1]+(p1[1]-p0[1])*f, p0[2]+(p1[2]-p0[2])*f, r, r, r, col, em); } return m; },
    // Fläche (Flügel, Flossen): Vieleck in der x-z-Ebene, y aus Funktion
    poly(pts, yf, col, em){ const xs=pts.map(p=>p[0]), zs=pts.map(p=>p[1]);
      for(let x=Math.floor(Math.min(...xs));x<=Math.ceil(Math.max(...xs));x++) for(let z=Math.floor(Math.min(...zs));z<=Math.ceil(Math.max(...zs));z++){
        let inside=false; for(let i=0,j=pts.length-1;i<pts.length;j=i++){ const [xi,zi]=pts[i], [xj,zj]=pts[j]; if(((zi>z)!==(zj>z)) && (x < (xj-xi)*(z-zi)/(zj-zi)+xi)) inside=!inside; }
        if(inside) put(x, yf(x,z), z, C(col,x,yf(x,z),z), em); } return m; },
    line(p0,p1,col,em){ const n=Math.ceil(Math.max(...[0,1,2].map(i=>Math.abs(p1[i]-p0[i]))))*2||1; for(let i=0;i<=n;i++){ const f=i/n; put(p0[0]+(p1[0]-p0[0])*f, p0[1]+(p1[1]-p0[1])*f, p0[2]+(p1[2]-p0[2])*f, C(col,0,0,0), em); } return m; },
    list(){ return [...c.values()]; },
    mirrorZ(){ const n=M(); for(const [x,y,z,col,em] of c.values()) n.put(x,y,-z,col,em); return n; }
  };
  return m;
}
const part = (m, pivot, rot, extra) => ({ cubes: m.list(), pivot, rot, ...(extra||{}) });

/* ---------- Drache (Feuerwelt) – feiner gebaut (doppelte Auflösung, im Spiel mit scale ≈ .55) ---------- */
export function dragon(){
  const R1=0xA4241A, R2=0x7E1912, R3=0xC43A22, BEL=0xE8B050, BEL2=0xC88E34, SP=0x2A0E0A, HORN=0xF0E6CC, HORN2=0xC8B890, EYE=0xFFE860, MEM=0xD8562A, MEM2=0xB8401E, VEIN=0x7A1E12, BONE=0x5A1410;
  const scale = (x,y,z) => { if(y < -2.6) return (Math.round(x)%3===0) ? BEL2 : BEL; const k=((Math.round(x)+2*Math.round(z)+Math.round(y))%5+5)%5; return k===0 ? R2 : k===3 ? R3 : R1; };
  const body = M();
  body.ell(0,0,0,13,6,6.5,scale);
  body.ell(9,1,0,5,5.5,5.8,scale);                                   // Brust
  for(let x=-12;x<=12;x+=3){ const h = 3 + (x>-6 && x<8 ? 1 : 0); for(let k=1;k<=h;k++) body.put(x,6+k,0,SP).put(x-1,6+k-1,0,SP); }
  // Hals
  body.seg([11,3,0],[17,8,0],4.6,3.8,scale).seg([17,8,0],[22,12,0],3.8,3.2,scale);
  for(let i=0;i<4;i++){ const x=13+i*3, y=8+i*1.6; body.put(x,y+4,0,SP).put(x,y+5,0,SP); }
  // Kopf: Schädel, Schnauze, Kiefer, Zähne, Augen, Hörner, Nüstern
  const head = M();
  head.ell(25,13,0,4.6,3.4,3.6,scale);
  for(let x=27;x<=34;x++){ const w = x<31 ? 2 : 1, t = x<32 ? 3 : 2; head.box(x,11,-w,x,11+t-1,w,(xx,yy,zz)=> yy===11 ? BEL : scale(xx,yy,zz)); }
  head.box(26,8,-2,33,9,2,(x,y,z)=> y===9 ? BEL2 : R2);                       // Unterkiefer
  for(let x=27;x<=33;x+=2){ head.put(x,10,-2,0xFFFFFF).put(x,10,2,0xFFFFFF); }       // Zähne
  head.box(27,10,-1,32,10,1,0xFF9A30,1);                                            // Glut im Maul
  head.put(34,13,-1,0x140404).put(34,13,1,0x140404);                                // Nüstern
  head.box(28,14,-4,29,14,-4,EYE,1).box(28,14,4,29,14,4,EYE,1).put(29,14,-4,0x220000).put(29,14,4,0x220000);
  head.box(27,15,-4,30,15,-3,SP).box(27,15,3,30,15,4,SP);                           // Brauenwulst
  for(const s of [-1,1]){ head.line([24,15,2*s],[20,19,4*s],HORN).line([20,19,4*s],[16,20,5*s],HORN2).line([16,20,5*s],[14,19,5*s],HORN2);
    head.line([23,10,4*s],[20,9,6*s],SP).line([22,12,4*s],[19,12,6*s],SP); }
  // Beine mit Krallen
  for(const s of [-1,1]){
    body.seg([8,-4,5*s],[10,-9,6*s],2.4,1.8,scale).seg([10,-9,6*s],[13,-12,6*s],1.8,1.4,scale);
    for(const dz of [-1,0,1]) body.line([13,-12,6*s+dz],[15,-13,6*s+dz*1.5],HORN);
    body.ell(-8,-3,5.5*s,4,4,3,scale).seg([-8,-6,6*s],[-6,-11,6.5*s],2.2,1.6,scale);
    for(const dz of [-1,0,1]) body.line([-6,-11,6.5*s+dz],[-3,-12,6.5*s+dz*1.5],HORN); }
  // Schwanz in zwei Gliedern (wellt sich)
  const tail1 = M(), tail2 = M();
  tail1.seg([-12,0,0],[-20,-1,0],5,4,scale).seg([-20,-1,0],[-28,-3,0],4,3,scale);
  for(let x=-14;x>=-28;x-=3) tail1.put(x,4-(x+14)*-.05,0,SP).put(x,5-(x+14)*-.05,0,SP);
  tail2.seg([-28,-3,0],[-36,-4,0],3,2,scale).seg([-36,-4,0],[-44,-4,0],2,1.2,scale);
  for(let x=-30;x>=-42;x-=3) tail2.put(x,-1,0,SP);
  tail2.poly([[-44,0],[-48,-4],[-54,0],[-48,4]], ()=>-4, SP).poly([[-46,0],[-48,-2],[-51,0],[-48,2]], ()=>-3, R2);
  // Flügel: Knochen, Haut mit Adern, gezackter Hinterrand; Außenflügel schwingt nach
  const inner = M(), outer = M();
  const shape = [[6,6],[3,18],[-1,30],[-3,34],[-17,24],[-14,14],[-6,6]];
  const shapeO = [[-1,30],[-6,46],[-9,40],[-16,40],[-15,32],[-24,30],[-17,24],[-3,34]];
  const memCol = (x,y,z) => { const r = Math.abs(Math.sin(x*.5+z*.18)); return r>.93 ? VEIN : ((Math.round(x)+Math.round(z))%5===0 ? MEM2 : MEM); };
  const wy = (x,z) => 8 + Math.round(z*.12);
  inner.poly(shape, wy, memCol); outer.poly(shapeO, wy, memCol);
  const bone = (m,a,b,r) => m.seg(a,b,r,r*.8,BONE);
  bone(inner,[6,9,6],[2,10,20],1.2); bone(inner,[2,10,20],[-1,12,30],1); inner.line([2,10,20],[-14,10,14],BONE).line([-1,12,30],[-17,11,24],BONE);
  bone(outer,[-1,12,30],[-2,12,34],1); outer.line([-2,12,34],[-6,12,46],BONE).line([-2,12,34],[-16,11,40],BONE).line([-2,12,34],[-24,10,30],BONE);
  outer.put(-2,13,34,HORN).put(-3,14,35,HORN).put(-6,13,46,HORN);
  const innerR = inner.mirrorZ(), outerR = outer.mirrorZ();
  return { parts:[ part(body,[0,0,0]), part(head,[22,12,0],["z",.08,1.1,0]), part(tail1,[-12,0,0],["y",.16,1.1,0]), {...part(tail2,[-28,-3,0],["y",.28,1.1,-.8]), parent:2},
    part(inner,[4,8,5],["x",.55,2.0,0,-.05]), {...part(outer,[-1,12,30],["x",.35,2.0,-.6]), parent:4},
    part(innerR,[4,8,-5],["x",-.55,2.0,0,.05]), {...part(outerR,[-1,12,-30],["x",-.35,2.0,-.6]), parent:6} ] };
}

/* ---------- Adler (Luftwelt) – mit einzelnen Federn (doppelte Auflösung, scale ≈ .5) ---------- */
export function eagle(){
  const B1=0x5E3A1E, B2=0x4A2C16, B3=0x7A4E28, GOLD=0xD8A84E, GOLD2=0xB8863A, LIGHT=0xF0D49A, DARK=0x24160C, BEAK=0xF2C238, BEAK2=0x8A6A20, TAL=0xE8B830;
  const fe = (x,y,z) => { const k=((Math.round(x)+(Math.round(y)%2?1:0)*2+Math.round(z))%3+3)%3; return y < -2 ? (k===0?B3:0x6A4422) : k===0 ? B2 : k===1 ? B1 : B3; };
  const body = M();
  body.ell(0,0,0,10,4.5,4.6,fe);
  body.ell(6,0,0,4.5,4.2,4.2,(x,y,z)=> y<-1 ? 0x7A5230 : fe(x,y,z));
  body.ell(10,2.5,0,3.4,3.6,3.4,(x,y,z)=> (Math.round(x+y)%3===0) ? GOLD2 : GOLD);   // Hals mit Federkrause
  body.ell(12,4,0,4,3.6,3.4,(x,y,z)=> (Math.round(x*2+z)%4===0) ? GOLD2 : (y>5 ? LIGHT : GOLD));
  body.box(15,3,-1,17,5,1,BEAK).box(18,3,0,18,5,0,BEAK).put(18,2,0,BEAK2).put(17,2,0,BEAK).put(19,4,0,BEAK2);  // Hakenschnabel
  body.box(15,5,-1,15,5,1,0xF4D060);
  for(const s of [-1,1]){ body.box(13,5,3*s,14,5,3*s,0xE89A20).put(14,5,3*s,0x101010).box(12,6,3*s,15,6,3*s,0x3A2410); }   // Augen mit Brauen
  // Schwanzfächer aus Einzelfedern
  for(let i=-5;i<=5;i++){ const len = 9 + (Math.abs(i)<2?2:0); for(let k=0;k<len;k++){ const x=-9-k, z=i*.7*(1+k/len*.8); body.put(x,0,z, k>len-3 ? DARK : (i%2? B2 : B1)); if(k>len-3 && k%2) body.put(x,0,z+.4,LIGHT); } }
  // Fänge
  for(const s of [-1,1]){ body.box(-1,-6,2*s,0,-5,2*s,TAL).box(1,-7,2*s,1,-6,2*s,TAL); for(const dz of [-1,0,1]) body.put(2,-7,2*s+dz,DARK); body.put(-2,-7,2*s,DARK); }
  // Flügel: Deckfedern, helle Vorderkante, Armschwingen als Zacken, gespreizte Handschwingen
  const wing = M(), tip = M();
  const wy = z => 1 + Math.round(z*.06);
  wing.poly([[7,4],[6,14],[4,24],[2,30],[-8,30],[-9,20],[-8,10],[-6,4]], (x,z)=>wy(z), (x,y,z)=> x>4 ? GOLD : x>1 ? ((Math.round(x)+Math.round(z))%3===0?B3:GOLD2) : fe(x,y,z));
  for(let z=4; z<=30; z+=2){ const len = 5 + (z%4===0?2:0); for(let k=0;k<len;k++) wing.put(-8-k, wy(z), z, k>len-2 ? DARK : (k%3===0?B2:B1)); }
  const fingers = [[30,0],[32,1],[34,2],[36,3],[38,4],[40,5],[42,6]];
  for(const [z0,i] of fingers){ const len = 12 + i*1.2; for(let k=0;k<len;k++){ const x = 1 - k*.95, z = z0 + k*(.25+i*.06), y = wy(z0) + Math.max(0,(z0-36))*.12 + k*.05; tip.put(x,y,z, k<3 ? B1 : DARK); } }
  tip.poly([[4,28],[2,38],[-4,36],[-6,30]], (x,z)=>wy(z), (x,y,z)=> x>2 ? GOLD : B1);
  const wingR = wing.mirrorZ(), tipR = tip.mirrorZ();
  return { parts:[ part(body,[0,0,0]), part(wing,[2,1,4],["x",.2,1.3,0,-.1]), {...part(tip,[2,2,28],["x",.16,1.3,-.5,-.04]), parent:1},
    part(wingR,[2,1,-4],["x",-.2,1.3,0,.1]), {...part(tipR,[2,2,-28],["x",-.16,1.3,-.5,.04]), parent:3} ] };
}

/* ---------- Wal (Wasserwelt) ---------- */
export function whale(){
  const TOP=0x2E4660, TOP2=0x263C54, BELLY=0xC8D4DE, GROOVE=0x8A9AAA;
  const body = M();
  for(let x=-16;x<=14;x++){ const f=(x+1)/16, r = x>=-1 ? 4.4*Math.sqrt(Math.max(0,1-f*f*.9)) : 4.4*Math.max(.18, 1-((-x-1)/15)**1.3);
    const ry=r*.85, rz=r;
    for(let y=Math.floor(-ry-1);y<=Math.ceil(ry+1);y++) for(let z=Math.floor(-rz-1);z<=Math.ceil(rz+1);z++){
      if((y/(ry+.35))**2+(z/(rz+.35))**2>1) continue;
      let col = y < -ry*.25 ? ((x>0 && z%2===0 && y<-ry*.5) ? GROOVE : BELLY) : ((x+y+z)%4===0 ? TOP2 : TOP);
      body.put(x,y,z,col); } }
  for(const [x,z] of [[10,0],[11,-1],[11,1],[12,0],[9,-2],[9,2]]) body.put(x,Math.round(3.6*.85*Math.sqrt(Math.max(0,1-((x+1)/16)**2*.9)))+1,z,0x1E3046); // Höcker
  body.put(9,0,-4,0x0A0E14).put(9,0,4,0x0A0E14);                                  // Augen
  for(let x=7;x<=14;x++) body.put(x,-1,-3,0x1E3046), body.put(x,-1,3,0x1E3046);    // Maul
  body.box(-8,3,0,-6,4,0,TOP);                                                       // Rückenflosse
  const fin = M(); fin.poly([[6,3.5],[4,6],[-2,12],[-5,13],[-3,10],[3,4]], (x,z)=>-2-Math.round((z-3)*.25), (x,y,z)=> x>1 ? BELLY : 0xB0BEC8);
  const finR = fin.mirrorZ();
  const fluke = M(); fluke.poly([[-15,-1.5],[-18,-5],[-22,-8],[-21,-3],[-20,0],[-21,3],[-22,8],[-18,5],[-15,1.5]], ()=>0, (x,y,z)=> (x+z)%3===0 ? TOP2 : TOP);
  fluke.box(-16,0,-1,-15,0,1,TOP);
  return { parts:[ part(body,[0,0,0]), part(fin,[5,-2,3],["x",.18,.9,0]), part(finR,[5,-2,-3],["x",-.18,.9,0]), part(fluke,[-15,0,0],["z",.32,1.0,0]) ] };
}

/* ---------- Fische ---------- */
export function fish(kind){
  const K = { clown:[0xFF7A1A,0xFFFFFF,0x1A1A1A], tang:[0x2A6AE8,0x0E2A6A,0xFFD23F], yellow:[0xFFD23F,0xFFE680,0xFFB000], pink:[0xFF6FA0,0xFFB0CC,0xE84A80] }[kind] || [0xFF8A3A,0xFFFFFF,0x222222];
  const b = M(); b.ell(0,0,0,2.4,1.4,.6,(x,y,z)=> kind==="clown" ? (x===1||x===-1 ? K[1] : K[0]) : kind==="tang" ? (y>0 ? K[1] : K[0]) : ((x+y)%2 ? K[1] : K[0]));
  b.put(2,1,-1,0x0A0A0A).put(2,1,1,0x0A0A0A).put(0,2,0,K[2]).put(-1,2,0,K[2]);
  const t = M(); t.box(-3,-1,0,-3,1,0,K[2]).box(-4,-2,0,-4,2,0,K[2]);
  return { parts:[ part(b,[0,0,0]), part(t,[-2,0,0],["y",.55,7,0]) ] };
}
export function jelly(col){
  const m = M(); m.ell(0,0,0,2.4,1.8,2.4,(x,y,z)=> y<0 ? undefined : (y===0 ? 0xFFFFFF : col), 1);
  for(const [x,z,n] of [[-2,0,6],[2,0,5],[0,-2,7],[0,2,5],[-1,-1,4],[1,1,6]]) for(let k=1;k<=n;k++) m.put(x+(k%3===0?1:0),-k,z,col,1);
  return { parts:[{cubes:m.list()}], noShadow:true };
}
/* ---------- Einhorn (Waldwelt) ---------- */
export function unicorn(){
  const W=0xF6F6FF, W2=0xE6E8F6, MANE=0xA8C8FF, MANE2=0xD8B8FF, GOLD=0xE8C24A;
  const body = M();
  body.ell(0,6,0,4,2.2,1.8,(x,y,z)=> (x+y+z)%5===0 ? W2 : W);
  for(const [lx,lz] of [[2.5,-1],[2.5,1],[-2.5,-1],[-2.5,1]]){ body.box(lx,1,lz,lx,4,lz,W); body.put(lx,0,lz,GOLD); }
  body.seg([3,7,0],[5,10,0],1.4,1.1,W);
  for(let i=0;i<6;i++) body.put(2+i*.6, 9+i*.6, 0, i%2?MANE:MANE2), body.put(1.6+i*.6, 8+i*.6, 0, MANE);
  const head = M(); head.box(5,9,-1,8,11,1,W).box(8,9,-1,9,10,1,0xF0DCEA).put(9,10,-1,0x8A6A8A).put(9,10,1,0x8A6A8A);
  head.put(7,11,-2,0x2A2A4A).put(7,11,2,0x2A2A4A).put(5,12,-1,W).put(5,12,1,W);   // Augen, Ohren
  head.line([6,12,0],[8,16,0],(x,y,z)=>0xFFFFFF,1); head.put(7,13,0,0xFFE680,1).put(8,15,0,0xFFE680,1);  // Horn
  head.put(5,11,0,MANE).put(4,11,0,MANE2).put(6,12,-1,MANE2);
  const tail = M(); tail.seg([-4,7,0],[-6,4,0],.8,1,MANE).seg([-6,4,0],[-6,1,0],1,.6,MANE2);
  return { parts:[ part(body,[0,0,0]), part(head,[5,9,0],["z",.22,.8,0,-.2]), part(tail,[-4,7,0],["y",.35,1.6,0]) ] };
}

/* ---------- Eisbär (Eiswelt) – detailliert (doppelte Auflösung, scale ≈ .45) ---------- */
export function polarBear(o={}){
  const F=0xF4F0E2, F2=0xE6DFCA, F3=0xD8D0B8, DARK=0x16181C, PAD=0x2A2A30, step=o.walk ? (o.speed||5) : 0;
  const fur = (x,y,z) => { const k=((Math.round(x*1.3)+Math.round(y)*2+Math.round(z))%5+5)%5; return y < 2 ? F3 : k===0 ? F2 : F; };
  const body = M();
  body.ell(0,12,0,10,6,5.6,fur); body.ell(5,13,0,5,6.4,5.4,fur); body.ell(-6,12,0,5,6,5.4,fur);   // Rumpf, Schulterbuckel, Hinterteil
  body.ell(-10,13,0,1.4,1.4,1.2,F2);                                                                   // Stummelschwanz
  const head = M();
  head.ell(12,14,0,3.6,3.4,3.2,fur).ell(15,13,0,2.6,2.2,2.1,fur).box(17,12,-1,18,13,1,F2);              // Kopf, Schnauze
  head.box(19,13,-1,19,13,1,DARK).put(19,12,0,DARK).box(16,11,-1,17,11,1,0x8A8070);                     // Nase, Maul
  head.put(14,16,-3,DARK).put(14,16,3,DARK);                                                             // Augen
  head.box(10,17,-3,11,18,-2,F2).box(10,17,2,11,18,3,F2).put(10,17,-3,F3).put(10,17,3,F3);               // Ohren
  const parts = [ part(body,[0,0,0]), part(head,[9,14,0],["y",.42,.5,0]) ];
  [[5,-3,0],[5,3,Math.PI],[-6,-3,Math.PI],[-6,3,0]].forEach(([lx,lz,ph])=>{ const l=M();
    l.ell(lx,6,lz,2.4,4,2.2,fur).box(lx-1,0,lz-1,lx+2,2,lz+1,fur).box(lx+2,0,lz-1,lx+2,0,lz+1,PAD).put(lx+3,0,lz,F3);
    parts.push({...part(l,[lx,9,lz], step?["z",.42,step,ph]:null), gait:true}); });
  return { parts };
}

/* ---------- Hirsch (Waldwelt) ---------- */
export function stag(){
  const BR=0x8A5A32, BR2=0x7A4E2A, LIGHT=0xD8B88A, WHITE=0xF4EEE2, ANT=0xE8D6B0, DARK=0x2A1A10;
  const body = M(); body.ell(0,7,0,4,2,1.7,(x,y,z)=> y<6 ? LIGHT : ((x+y+z)%4===0?BR2:BR));
  for(const [lx,lz] of [[2.6,-1],[2.6,1],[-2.6,-1],[-2.6,1]]){ body.box(lx,1,lz,lx,5,lz,BR2); body.put(lx,0,lz,DARK); }
  body.put(-4,8,0,WHITE).put(-5,8,0,WHITE).put(-5,9,0,BR);
  body.seg([3,8,0],[5,11,0],1.3,1,BR);
  const head = M(); head.box(5,11,-1,7,13,1,BR).box(8,11,-1,9,12,1,BR2).put(10,11,0,DARK).put(8,13,-1,DARK).put(8,13,1,DARK).put(7,13,-2,LIGHT).put(7,13,2,LIGHT);
  head.put(6,14,-2,BR).put(6,14,2,BR);
  for(const s of [-1,1]){ head.line([6,14,s],[5,18,3*s],ANT).line([5,18,3*s],[4,22,4*s],ANT).line([5,16,2*s],[8,18,2*s],ANT).line([5,19,3*s],[7,21,4*s],ANT).line([4,20,4*s],[2,22,5*s],ANT).line([4,22,4*s],[5,24,4*s],ANT); }
  const tail = M().put(-5,9,0,BR).put(-5,8,0,WHITE);
  return { parts:[ part(body,[0,0,0]), part(head,[5,11,0],["z",.28,.7,0,-.25]), part(tail,[-4,9,0],["y",.5,3,0]) ] };
}

/* ---------- Frostfuchs (Eiswelt) – detailliert (doppelte Auflösung, scale ≈ .25) ---------- */
export function frostFox(o={}){
  const F=o.col||0xF2F8FF, F2=0xD6E6F6, F3=0xB8D2EC, BLUE=0x5AB8F0, DARK=0x141C28, step=o.walk ? (o.speed||9) : 0;
  const fur = (x,y,z) => { const k=((Math.round(x)+Math.round(y)*2+Math.round(z))%4+4)%4; return y > 11 && k===0 ? F3 : k===1 ? F2 : F; };
  const body = M(); body.ell(0,9,0,6,3,2.7,fur); body.ell(5,8.5,0,2.8,3.2,2.6,(x,y,z)=> y<8 ? 0xFFFFFF : fur(x,y,z));   // Rumpf, flauschige Brust
  const head = M();
  head.ell(9,12,0,3,2.6,2.4,fur);
  for(let x=11;x<=14;x++){ const w = x<13 ? 1 : 0; head.box(x,10,-w,x,11 - (x>13?1:0),w,F); }
  head.put(15,10,0,DARK);                                                                             // Nase
  for(const s of [-1,1]){ head.put(11,13,2*s,BLUE).put(11,13,2*s+(s>0?.6:-.6),DARK).put(10,14,2*s,F2);
    head.box(8,14,1.6*s,9,15,1.6*s,F).box(8,16,1.8*s,8,17,1.8*s,F2).put(8,18,1.8*s,F3).put(9,15,1.2*s,0xCFE6FF); // Ohren
    head.put(9,10,2.6*s,0xFFFFFF).put(8,9,2.4*s,0xFFFFFF); }                                          // Wangenfell
  const tail = M(); tail.seg([-6,10,0],[-11,11,0],1.8,2.6,fur).seg([-11,11,0],[-16,10,0],2.6,2.8,fur).seg([-16,10,0],[-19,8,0],2.6,1.4,(x,y,z)=> x<-17 ? 0xE6F4FF : fur(x,y,z));
  const parts = [ part(body,[0,0,0]), part(head,[7,11,0],["y",.5,.65,0]), part(tail,[-6,10,0],["y",.3,1.6,0]) ];
  [[4,-1.5,0],[4,1.5,Math.PI],[-4,-1.5,Math.PI],[-4,1.5,0]].forEach(([lx,lz,ph])=>{ const l=M().box(lx,1,lz,lx+1,7,lz+(lz>0?-.5:.5),F2).box(lx,0,lz,lx+2,0,lz,F3); parts.push({...part(l,[lx,7,lz], step?["z",.75,step,ph]:null), gait:true}); });
  return { parts };
}

/* ---------- Zwerge (Steinwelt) ---------- */
export function dwarf(o={}){
  const TUNIC=o.tunic||0x2F5DA8, BEARD=o.beard||0xC86A2A, SKIN=0xF0C09A, BOOT=0x4A3020, HELM=o.helm||0x9A9EA8, BELT=0xE8B030;
  const body = M();
  body.box(-1,3,-1,1,6,1,TUNIC).box(-1,4,-1,1,4,1,BELT);            // Rumpf mit Gürtel
  body.box(-1,7,-1,1,8,1,SKIN).box(2,6,-1,2,8,1,BEARD).box(2,4,0,2,5,0,BEARD).box(1,5,-1,1,6,1,BEARD);
  body.put(2,8,-1,0x1A1A1A).put(2,8,1,0x1A1A1A).put(2,7,0,0xE0A080);
  body.box(-1,9,-1,1,9,1,HELM).put(0,10,0,HELM).box(2,9,-1,2,9,1,HELM);
  const legL = M().box(0,0,-1,0,2,-1,BOOT), legR = M().box(0,0,1,0,2,1,BOOT);
  const armL = M().box(0,4,-2,0,6,-2,TUNIC).put(0,3,-2,SKIN), armR = M().box(0,4,2,0,6,2,TUNIC).put(0,3,2,SKIN);
  const walk = o.walk ? 7 : 0;
  const parts = [ part(body,[0,0,0]), part(legL,[0,2,-1], walk?["z",.5,walk,0]:null), part(legR,[0,2,1], walk?["z",-.5,walk,0]:null) ];
  if(o.hammer){ const a = M().box(0,4,2,0,6,2,TUNIC).put(0,3,2,SKIN).box(1,3,2,4,3,2,0x6A4A2A).box(4,2,1,5,4,3,0x5A5E66);
    parts.push(part(armL,[0,6,-2]), part(a,[0,6,2],["z",.9,4.5,0,-.4])); }
  else parts.push(part(armL,[0,6,-2], walk?["z",-.4,walk,0]:null), part(armR,[0,6,2], walk?["z",.4,walk,0]:null));
  return { parts };
}

/* ---------- Kleine Vögel ---------- */
export function bird(col=0xFFFFFF){
  const b = M().ell(0,0,0,1.2,.6,.6,col).put(2,0,0,0xF0A030);
  const w = M().poly([[1,0],[0,4],[-1,4],[-1,0]],()=>0,col); const wR = w.mirrorZ();
  return { parts:[ part(b,[0,0,0]), part(w,[0,0,1],["x",.7,6,0]), part(wR,[0,0,-1],["x",-.7,6,0]) ] };
}

/* ---------- Delfin (Wasserwelt, scale ≈ .5) ---------- */
export function dolphin(){
  const TOP=0x5A7A9A, TOP2=0x4A6888, SIDE=0x8AA4BC, BELLY=0xE2EAF2, DARK=0x18202A;
  const body = M();
  for(let x=-12;x<=10;x++){ const f=(x+1)/12, r = x>=-1 ? 3.6*Math.sqrt(Math.max(0,1-f*f*.85)) : 3.6*Math.max(.25, 1-((-x-1)/12)**1.4), ry=r*.9;
    for(let y=Math.floor(-ry-1);y<=Math.ceil(ry+1);y++) for(let z=Math.floor(-r-1);z<=Math.ceil(r+1);z++){ if((y/(ry+.35))**2+(z/(r+.35))**2>1) continue;
      body.put(x,y,z, y < -ry*.3 ? BELLY : y < ry*.2 ? SIDE : ((x+z)%4===0 ? TOP2 : TOP)); } }
  body.box(11,-1,-1,14,0,1,(x,y,z)=> y<0 ? BELLY : SIDE).put(15,0,0,SIDE);                              // Schnabel
  body.put(9,1,-3,DARK).put(9,1,3,DARK);                                                               // Augen
  body.line([-1,3,0],[-4,7,0],TOP2).line([-2,3,0],[-5,6,0],TOP2).line([0,3,0],[-3,6,0],TOP);          // Rückenflosse
  for(const s of [-1,1]) body.line([4,-2,3*s],[1,-4,6*s],SIDE).line([3,-2,3*s],[0,-4,5*s],SIDE);       // Brustflossen
  const fluke = M(); fluke.poly([[-12,-1.2],[-15,-4],[-17,-6],[-16,-2],[-15,0],[-16,2],[-17,6],[-15,4],[-12,1.2]], ()=>0, TOP2);
  return { parts:[ part(body,[0,0,0]), part(fluke,[-12,0,0],["z",.45,2.6,0]) ] };
}

/* ---------- Fledermaus (Zwergenstadt, scale ≈ .45) ---------- */
export function bat(){
  const B=0x2A2230, B2=0x3E3446, MEM=0x4A3A52, EYE=0xFF4A3A;
  const body = M().ell(0,0,0,2,1.2,1.2,B).ell(2,.5,0,1.2,1.2,1.1,B2).put(3,1,-1,EYE,1).put(3,1,1,EYE,1).put(2,2,-1,B).put(2,2,1,B).put(2,3,-1,B).put(2,3,1,B);
  const w = M().poly([[1.5,1],[0,5],[-1,8],[-2,9],[-3,6],[-3,4],[-2,1]], ()=>0, (x,y,z)=> (Math.round(z)%3===0) ? B : MEM); w.line([1,0,1],[-1,0,8],B);
  return { parts:[ part(body,[0,0,0]), part(w,[0,0,1],["x",1.0,14,0]), part(w.mirrorZ(),[0,0,-1],["x",-1.0,14,0]) ], noShadow:true };
}
