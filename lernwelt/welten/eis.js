// Klasse 10 · Ice Citadel – nach Seáns Vorlagebild: großes Eisschloss rechts hinten auf einem Hügel, davor rechts ein vereister Wald,
// links vorne ein gefrorener See, eine Brücke vom Wald über den See zum Schloss, links hinten ein zweiter See vor verschneiten Bergen.
// Stationen: Schloss (Grammar), großer Eisbaum links vor dem Schloss (Vocabulary), Garten mit Brunnen rechts (Country & people).
import { polarBear, frostFox } from "./tiere.js";
export function build(A){
  const { rand, fbm, pick, set, get, fill, walls, disk, ring, cyl, tube, ball, ellip, dome, cone, line, topAt, tex, P, noise, stripes, bricks, rings, topEdge } = A;
  const T = {
    snow: noise(["#F4F8FF","#EAF2FC","#FFFFFF","#E2ECF8"], 6, ["#D4E2F2"]), snowSide: topEdge(["#9AB8D4","#8AAAC8","#A8C4DC"], ["#F4F8FF","#EAF2FC"], 5),
    frost: noise(["#9AB8D4","#8AAAC8","#A8C4DC","#7E9EBE"], 8, ["#C8DCEE"]),
    rock: noise(["#6A7E96","#5E7290","#748AA2","#56687E"], 8, ["#9AB0C6"]),
    floorIce: tex(g=>{ for(let x=0;x<16;x++) for(let y=0;y<16;y++){ const v=Math.sin(x*.5+y*.9)+rand()*.4; P(g,x,y, (x===0||y===0) ? "#6AA8D8" : v>1.2?"#E6F8FF":v>.2?"#A8D8F4":"#8AC4EC"); } }),
    lake: tex(g=>{ for(let x=0;x<16;x++) for(let y=0;y<16;y++){ const v=Math.sin(x*.4+y*.25)+Math.sin(y*.7-x*.2)*.6+rand()*.3; P(g,x,y, v>1.3?"#CFF2FF":v>.6?"#7CC8F0":v>-.2?"#4AA6E0":"#2E84C8"); } }),
    iceBrick: bricks(["#E6F2FC","#D8EAF8","#EEF6FE","#DCEEFA"], "#8AB0D0", 4, 8),
    iceBrick2: bricks(["#C8E0F4","#BCD8F0","#D2E6F6"], "#7AA0C4", 4, 8),
    iceTrim: tex(g=>{ for(let y=0;y<16;y++) for(let x=0;x<16;x++) P(g,x,y, y<2||y>13 ? "#4A86C0" : (x+y)%7===0 ? "#BFE8FA" : pick(["#8AB8DE","#9AC4E6","#7EAED6"])); }),
    carved: tex(g=>{ for(let y=0;y<16;y++) for(let x=0;x<16;x++){ const e=x<1||y<1||x>14||y>14, i=x>3&&x<12&&y>3&&y<12; P(g,x,y, e?"#8AB2D4":i?(Math.abs(x-7.5)+Math.abs(y-7.5)<4?"#FFFFFF":"#D8ECFA"):"#EAF6FE"); } }),
    roof: tex(g=>{ for(let y=0;y<16;y++) for(let x=0;x<16;x++){ const r=Math.floor(y/3), off=(r%2)*2; P(g,x,y, y%3===2 ? "#5E8EC4" : ((x+off)%4===0 ? "#7EA8D8" : pick(["#A8CCEE","#B8D8F4","#9CC2E8"]))); } }),
    spire: tex(g=>{ for(let y=0;y<16;y++) for(let x=0;x<16;x++) P(g,x,y, x%4===0 ? "#FFFFFF" : pick(["#C8E4FA","#BCDCF6","#D4EAFC"])); }),
    pillar: tex(g=>{ for(let x=0;x<16;x++){ const c=pick(["#5AA8E8","#6AB8F0","#4A98DC","#7ACCF8","#8ADCFC"]); for(let y=0;y<16;y++) P(g,x,y, rand()<.03 ? "#F0FCFF" : (x%5===2 ? "#BFF0FF" : c)); } }),
    win: tex(g=>{ for(let x=0;x<16;x++) for(let y=0;y<16;y++){ const fr = x<2||x>13||y>14||x===7||x===8||(y<6 && Math.abs(x-7.5)>y*1.3+1); P(g,x,y, fr ? "#3A6AA8" : pick(["#9AF4FF","#7AE8FF","#CFFAFF"])); } }),
    winW: tex(g=>{ for(let x=0;x<16;x++) for(let y=0;y<16;y++){ const fr = x<2||x>13||y>14||x===7||x===8||(y<6 && Math.abs(x-7.5)>y*1.3+1); P(g,x,y, fr ? "#3A6AA8" : pick(["#FFE6B0","#FFD890","#FFF0C8"])); } }),
    door: tex(g=>{ for(let x=0;x<16;x++) for(let y=0;y<16;y++){ const v=y/16; P(g,x,y, rand()<.1 ? "#FFFFFF" : v<.4?"#DFFCFF":v<.75?"#9AEEFF":"#5AD4FF"); } }),
    icicle: noise(["#DFF8FF","#BFEFFF","#FFFFFF"], 0),
    crystal: tex(g=>{ for(let x=0;x<16;x++) for(let y=0;y<16;y++){ const d=(x+y)%6; P(g,x,y, d===0?"#E6FFFF":d<3?"#7FE6FF":"#3AB4F0"); } }),
    violet: tex(g=>{ for(let x=0;x<16;x++) for(let y=0;y<16;y++){ const d=(x+y)%6; P(g,x,y, d===0?"#F2E6FF":d<3?"#C8A0FF":"#9A6AF0"); } }),
    lamp: noise(["#DFFCFF","#BFF4FF","#FFFFFF"]), silver: noise(["#E8F0F8","#D0DCE8","#F4F8FC"]),
    pine: noise(["#5E8AA8","#6A96B4","#527E9C","#7AA4C0"], 10, ["#DCEEFA","#FFFFFF"]), bark: stripes(["#5A4A44","#4E403A","#665650"], true),
    hedge: noise(["#7EA2BE","#8AAECA","#6E94B2"], 14, ["#FFFFFF","#E8F4FE"]),
    gold: noise(["#E8C870","#F4DA90","#D8B460"])
  };
  const blocks = {
    snow:{side:T.snowSide, top:T.snow, bottom:T.frost}, snowB:{side:T.snow}, frost:{side:T.frost}, rock:{side:T.rock, top:T.snow}, floorIce:{side:T.frost, top:T.floorIce, em:.08},
    lakeIce:{side:T.lake, em:.12}, iceBrick:{side:T.iceBrick}, iceBrick2:{side:T.iceBrick2}, iceTrim:{side:T.iceTrim}, carved:{side:T.carved, top:T.iceBrick}, roof:{side:T.roof},
    spire:{side:T.spire, top:T.snow}, pillar:{side:T.pillar, em:.35}, win:{side:T.win, em:.9}, winW:{side:T.winW, em:.9}, door:{side:T.door, em:.75},
    icicle:{side:T.icicle, alpha:.85, em:.35}, crystal:{side:T.crystal, em:1.0}, violet:{side:T.violet, em:1.0}, lamp:{side:T.lamp, em:1.3, scale:.6, halo:[0xBFF4FF,3.4,.75]},
    silver:{side:T.silver}, pine:{side:T.pine}, bark:{side:T.bark, top:T.snow}, hedge:{side:T.hedge, top:T.snow}, gold:{side:T.gold, em:.3},
    iceGlow:{side:T.pillar, em:.9, halo:[0x9AE8FF,4,.45]}, flowerV:{side:T.violet, em:.8, scale:.6}, flowerC:{side:T.crystal, em:.8, scale:.6}
  };
  const FN = A.fine, fs = (x,y,z,t) => FN.set(Math.round(x*2),Math.round(y*2),Math.round(z*2),t);
  const W=120, D=96, G=6, L=4;      // G: Boden, L: Wasser/Eisoberfläche
  const CX=80, CZ=20, HB=20;         // Schlosshügel
  // ---------- Gelände ----------
  const lakeF = (x,z) => ((x-24)/32)**2 + ((z-72)/28)**2;           // See links vorne
  const lakeB = (x,z) => ((x-8)/44)**2 + ((z-2)/22)**2;             // See links hinten
  const chan  = (x,z) => Math.abs(x-6-Math.sin(z*.15)*2) < 5 && z>14 && z<50;   // Verbindung
  const hillD = (x,z) => Math.hypot(x-CX,(z-CZ)*1.15);
  const H = (x,z) => { let h = G + (fbm(x*.08,z*.08)-.5)*3;
    if(x>62 && z>52) h += 1.5 + fbm(x*.05,z*.05)*3;                  // Waldhügel
    const d = hillD(x,z); if(d<34){ const t=Math.min(1,(34-d)/12); h = Math.max(h, G + (HB-G)*t*t*(3-2*t) + (fbm(x*.2,z*.2)-.5)*2*t*(1-t)*4); }
    if(lakeF(x,z)<1 || lakeB(x,z)<1 || chan(x,z)) h = Math.min(h, L-1 - (1-Math.min(lakeF(x,z),lakeB(x,z),1))*2);
    else if(lakeF(x,z)<1.25 || lakeB(x,z)<1.2) h = Math.min(h, L+ (Math.min(lakeF(x,z),lakeB(x,z))-1)*12);
    return Math.round(h); };
  const Hm = {}; const hAt = (x,z) => { const k=x+","+z; if(Hm[k]===undefined) Hm[k]=H(x,z); return Hm[k]; };
  for(let z=-14; z<D+14; z++) for(let x=-14; x<W+14; x++){ const h=hAt(x,z);
    for(let y=Math.min(h,L-3); y<h; y++){ const top=y===h-1, cliff = hillD(x,z)<34 && hillD(x,z)>20;
      set(x,y,z, top ? (cliff && rand()<.3 ? "rock" : "snow") : (cliff || y<h-3 ? (rand()<.5?"rock":"frost") : "snowB")); }
    if(h<L){ set(x,L-1,z, lakeF(x,z)<1 || chan(x,z) ? "lakeIce" : null); } }

  // ---------- Bausteine ----------
  const pinnacle = (x,y,z,h,r=1) => { for(let i=0;i<h;i++){ const rr=r*(1-i/h); if(rr>=.5) disk(x,y+i,z,rr,"spire"); else set(x,y+i,z,"spire"); } set(x,y+h,z,"icicle"); fs(x,y+h+1,z,"lamp"); };
  const winRing = (x,y,z,r,step,t="win") => { for(let a=Math.floor(x-r-1);a<=x+r+1;a++) for(let c=Math.floor(z-r-1);c<=z+r+1;c++){ const d=Math.hypot(a-x,c-z); if(d<=r+.3 && d>r-.7 && Math.round(Math.atan2(c-z,a-x)*r/step)%2===0){ set(a,y,c,t); set(a,y+1,c,t); } } };
  // runder Turm mit kegelförmigem Dach (hell-blau), Zinnenkranz, Fenstern
  const roundTower = (x,y,z,r,h,roofH,o={}) => { for(let yy=y;yy<y+h;yy++) ring(x,yy,z,r,(a,b)=> (b-y)%6===5 ? "iceTrim" : (o.alt&&((b-y)>>2)%2 ? "iceBrick2" : "iceBrick"));
    disk(x,y+h-1,z,r,"carved"); for(let yy=y+2;yy<y+h-2;yy+=6) winRing(x,yy,z,r,1.6,o.warm&&yy%12===2?"winW":"win");
    ring(x,y+h,z,r+1,"carved"); for(let i=0;i<Math.round(r*4);i++){ const an=i/(r*4)*Math.PI*2; if(i%2===0) set(Math.round(x+Math.cos(an)*(r+1)),y+h+1,Math.round(z+Math.sin(an)*(r+1)),"carved"); }
    for(let k=0;k<roofH;k++){ const rr=(r+.6)*Math.pow(1-k/roofH,1.15); if(rr<.5){ set(x,y+h+1+k,z,"roof"); continue; } ring(x,y+h+1+k,z,rr,"roof",1.3); }
    set(x,y+h+1+roofH,z,"spire"); fs(x,y+h+2+roofH,z,"gold"); fs(x,y+h+2.5+roofH,z,"lamp"); return y+h+roofH; };
  // eckiger gotischer Bau mit Spitzbogenfenstern
  const gothic = (x,y,z,w,h,fillT) => { const hw=w/2; for(let a=-Math.floor(hw);a<=Math.floor(hw);a++) for(let b=0;b<h+w;b++){ const top = h + (hw-Math.abs(a))*1.6; if(b<top) set(x+a,y+b,z,fillT); } };
  const block = (x0,y,z0,x1,z1,h,o={}) => { for(let yy=y;yy<y+h;yy++) for(let x=x0;x<=x1;x++) for(let z=z0;z<=z1;z++){ if(x!==x0&&x!==x1&&z!==z0&&z!==z1) continue;
      const corner=(x===x0||x===x1)&&(z===z0||z===z1), band=(yy-y)%5===4; let t = corner ? "iceTrim" : band ? "carved" : "iceBrick";
      if(!corner && !band && (yy-y)%5>=1 && (yy-y)%5<=2 && ((z===z0||z===z1) ? (x-x0)%3===1 : (z-z0)%3===1)) t = (o.warm && (x+yy)%7===0) ? "winW" : "win";
      set(x,yy,z,t); }
    fill(x0+1,y+h-1,z0+1,x1-1,y+h-1,z1-1,"carved");
    if(o.roof!==false){ const half=Math.ceil((z1-z0+1)/2); for(let k=0;k<=half;k++){ for(let x=x0-1;x<=x1+1;x++){ set(x,y+h+k,z0-1+k,"roof"); set(x,y+h+k,z1+1-k,"roof"); } for(const x of [x0-1,x1+1]) for(let z=z0+k;z<=z1-k;z++) set(x,y+h+k,z,"iceBrick"); } }
    else for(let x=x0;x<=x1;x+=2){ set(x,y+h,z0,"carved"); set(x,y+h,z1,"carved"); }
    return y+h; };
  const icicles = (x0,x1,y,z0,z1,maxL) => { for(let x=x0;x<=x1;x++) for(let z=z0;z<=z1;z++){ if(rand()<.4){ const l=1+Math.floor(rand()*maxL); for(let k=1;k<=l;k++) if(!get(x,y-k,z)) set(x,y-k,z,"icicle"); } } };

  const S = {
    grammar:   {x:CX, z:CZ, col:0x7FE6FF, ort:"Ice Citadel"},
    vocabulary:{x:34, z:34, col:0xC8A0FF, ort:"Frost Tree"},
    country:   {x:104, z:64, col:0xBFF4FF, ort:"Frozen Garden"}
  };

  // ---------- Grammar: das Eisschloss ----------
  { const x=CX, z=CZ, y=HB;
    fill(x-20,y-1,z-14,x+20,y-1,z+16,"floorIce");
    // äußere Mauer mit runden Türmen
    for(let a=-18;a<=18;a++) for(const c of [-13,15]){ fill(x+a,y,z+c,x+a,y+5,z+c,(xx,yy)=> yy===y+5 ? "carved" : "iceBrick"); if(a%2===0) set(x+a,y+6,z+c,"carved"); }
    for(let c=-13;c<=15;c++) for(const a of [-18,18]){ fill(x+a,y,z+c,x+a,y+5,z+c,(xx,yy)=> yy===y+5 ? "carved" : "iceBrick"); if(c%2===0) set(x+a,y+6,z+c,"carved"); }
    for(const [a,c] of [[-18,-13],[18,-13],[-18,15],[18,15],[0,-13]]) roundTower(x+a,y,z+c,2.6,10,8,{warm:true});
    // Torhaus vorne
    { const gz=z+15; for(let a=-4;a<=4;a++) fill(x+a,y,gz,x+a,y+11,gz+1,(xx,yy)=> yy===y+11 ? "carved" : "iceBrick"); gothic(x,y,gz+1,4,6,"door"); gothic(x,y,gz,4,6,"door");
      for(const a of [-4,4]) roundTower(x+a,y,gz+1,1.8,14,7); pinnacle(x,y+12,gz+1,6,.8); }
    // Haupthaus in Stufen
    const b1 = block(x-14,y,z-9,x+14,z+8,12,{roof:false, warm:true});
    for(let a=-12;a<=12;a+=4){ gothic(x+a,y+2,z+9,2,4,"win"); }
    icicles(x-14,x+14,b1,z+9,z+9,3);
    const b2 = block(x-9,b1,z-7,x+9,z+5,11,{roof:false});
    for(let a=-7;a<=7;a+=7) gothic(x+a,b1+2,z+6,2,6,"win");
    icicles(x-9,x+9,b2,z+6,z+6,3);
    // Ecktürme am Haupthaus
    for(const [a,c] of [[-14,-9],[14,-9],[-14,8],[14,8]]) roundTower(x+a,y,z+c,2.4,18,10,{alt:true});
    for(const [a,c] of [[-9,-7],[9,-7],[-9,5],[9,5]]) roundTower(x+a,b1,z+c,1.8,14,9);
    // hoher Hauptturm mit Galerie und spitzem Helm
    { const tz=z-1; let t=b2; for(let k=0;k<3;k++){ const r=5-k*1.1, hh=k===2?10:9; for(let yy=t;yy<t+hh;yy++) ring(x,yy,tz,r,(a,bb)=> (bb-t)%5===4 ? "iceTrim" : "iceBrick"); winRing(x,t+3,tz,r,1.2); disk(x,t+hh-1,tz,r,"carved"); ring(x,t+hh,tz,r+1,"carved");
        for(let i=0;i<8;i++){ const an=i/8*Math.PI*2; pinnacle(Math.round(x+Math.cos(an)*(r+1)),t+hh+1,Math.round(tz+Math.sin(an)*(r+1)),3,.5); } t+=hh+1; }
      for(let k=0;k<20;k++){ const rr=3.2*Math.pow(1-k/20,1.1); if(rr<.5) set(x,t+k,tz,"roof"); else ring(x,t+k,tz,rr,"roof",1.3); } fs(x,t+20,tz,"gold"); fs(x,t+21,tz,"gold"); fs(x,t+22,tz,"lamp");
      S.grammar.top=[x, t+12, tz]; S.grammar.beams=[[x,t+22,tz]]; }
    // Nebentürme mit Spitzhelmen hinten
    for(const [a,c,h,r] of [[-7,-11,22,2.2],[7,-11,24,2.2],[0,-12,30,2.6]]) roundTower(x+a,b1,z+c,r,h,12,{alt:true});
    // Treppe und Rampe hinunter zum Tor (in Richtung Brücke)
    for(let s=0;s<8;s++) fill(x-3,y-1-s,z+17+s,x+3,y-1-s,z+17+s,"carved");
    // Bogengang (Aquädukt) nach rechts zum Garten
    for(let i=0;i<=12;i++){ const ax=x+19+i, az=z+10+Math.round(i*.9), top=y+2-Math.round(i*.4); fill(ax,top,az,ax,top,az+2,"carved"); set(ax,top+1,az,"iceTrim"); set(ax,top+1,az+2,"iceTrim");
      if(i%6!==3) for(let yy=topAt(ax,az+1,top-1)+1; yy<top; yy++) for(const zz of [az,az+2]) set(ax,yy,zz,"iceBrick"); }
    S.grammar.base=y+6; S.grammar.lift=1; S.grammar.cam={pos:[x-14,y+44,z+104], look:[x+14,y+14,z]}; }

  // ---------- Unterer Mauerring am Hang mit Rundtürmen, wie eine Stadt die sich den Hügel hinaufzieht ----------
  for(let i=0;i<120;i++){ const an=-Math.PI*.95 + i/120*Math.PI*1.9, wx=Math.round(CX+Math.cos(an)*27), wz=Math.round(CZ+Math.sin(an)*23);
    if(an>1.2 && an<1.75) continue; const t=hAt(wx,wz); fill(wx,t,wz,wx,t+4,wz,(a,b)=> b===t+4 ? "carved" : "iceBrick"); if(i%2===0) set(wx,t+5,wz,"carved"); }
  for(const an of [-2.6,-2.1,-1.5,-.9,-.3,.4,.9,2.0,2.5]){ const tx=Math.round(CX+Math.cos(an)*27), tz=Math.round(CZ+Math.sin(an)*23); roundTower(tx,hAt(tx,tz),tz,2.2,9+Math.round(rand()*6),7,{warm:true}); }
  // schlanke Spitztürme zwischen Mauerring und Schloss
  for(const [a,c,h] of [[-22,4,16],[22,0,18],[-16,-16,20],[16,-18,22],[-24,-6,12],[24,12,12]]){ const tx=CX+a, tz=CZ+c; roundTower(tx,hAt(tx,tz),tz,1.8,h,9); }

  // ---------- Häuschen rund um den Schlosshügel (Stadt am Hang) ----------
  const cottage = (x,z,w,d,h) => { const y=hAt(x,z); if(y<L+1 || get(x,y+1,z)) return; const hw=w>>1, hd=d>>1;
    for(let yy=y;yy<y+h;yy++) for(let a=-hw;a<=hw;a++) for(let c=-hd;c<=hd;c++){ if(Math.abs(a)!==hw&&Math.abs(c)!==hd) continue; set(x+a,yy,z+c, (yy-y)===2 && (a+c)%2===0 && Math.abs(a)!==hw ? "winW" : "iceBrick2"); }
    for(let k=0;k<=hd+1;k++) fill(x-hw-1,y+h+k,z-hd-1+k,x+hw+1,y+h+k,z+hd+1-k, k===hd+1?"snowB":"roof"); fs(x+hw,y+h+2,z,"lamp"); };
  for(const [hx,hz,w,d,h] of [[56,8,5,4,4],[54,18,5,4,5],[58,30,5,4,4],[100,6,5,4,5],[104,18,5,4,4],[64,40,5,4,4],[96,34,5,4,4],[70,-6,5,4,5],[88,-8,5,4,4]]) cottage(hx,hz,w,d,h);

  // ---------- Brücke vom Wald über den See zum Schloss ----------
  { const P = [[78,G+2,84],[60,G+3,74],[44,G+5,60],[46,G+9,46],[60,HB-6,40],[CX,HB-6,CZ+24]];
    const cr = (a,b,c,d,t) => a.map((_,i)=> .5*((2*b[i])+(-a[i]+c[i])*t+(2*a[i]-5*b[i]+4*c[i]-d[i])*t*t+(-a[i]+3*b[i]-3*c[i]+d[i])*t*t*t));
    const pts=[]; for(let i=0;i<P.length-1;i++){ const a=P[Math.max(0,i-1)], b=P[i], c=P[i+1], d=P[Math.min(P.length-1,i+2)]; for(let k=0;k<12;k++) pts.push(cr(a,b,c,d,k/12)); } pts.push(P[P.length-1]);
    let acc=0; for(let i=0;i<pts.length;i++){ const p=pts[i], q=pts[Math.min(pts.length-1,i+1)], dx=q[0]-p[0], dz=q[2]-p[2], l=Math.hypot(dx,dz)||1, nx=-dz/l, nz=dx/l, y=Math.round(p[1]);
      for(const w of [-1,0,1]) set(Math.round(p[0]+nx*w),y,Math.round(p[2]+nz*w),"carved");
      for(const w of [-2,2]){ set(Math.round(p[0]+nx*w),y,Math.round(p[2]+nz*w),"iceTrim"); fs(p[0]+nx*w,y+1,p[2]+nz*w,"silver"); }
      acc += l; if(acc>7){ acc=0; for(const w of [-2,2]){ const lx=Math.round(p[0]+nx*w), lz=Math.round(p[2]+nz*w); set(lx,y+1,lz,"silver"); set(lx,y+2,lz,"lamp"); }
        // Pfeiler bis zum Boden/Eis, mit Bogen
        const ground = Math.max(L-1, hAt(Math.round(p[0]),Math.round(p[2]))); for(let yy=ground; yy<y; yy++) for(const w of [-1,1]) set(Math.round(p[0]+nx*w),yy,Math.round(p[2]+nz*w), yy===L-1 ? "carved" : "iceBrick"); }
      else { const ground = Math.max(L-1, hAt(Math.round(p[0]),Math.round(p[2]))); const arch = y - 1 - Math.round(Math.sin(acc/7*Math.PI)*Math.max(0,(y-ground-2))*.8); for(let yy=arch; yy<y; yy++) set(Math.round(p[0]),yy,Math.round(p[2]),"iceBrick2"); } }
    S.bridgePts = pts; }

  // ---------- Vocabulary: großer Eisbaum links vor dem Schloss ----------
  { const {x,z}=S.vocabulary, y=hAt(x,z);
    disk(x,y,z,7,"floorIce"); ring(x,y,z,7,"carved"); for(let i=0;i<12;i++){ const an=i/12*Math.PI*2; if(i%3===0){ const lx=Math.round(x+Math.cos(an)*8.5), lz=Math.round(z+Math.sin(an)*8.5); fill(lx,y,lz,lx,y+2,lz,"silver"); set(lx,y+3,lz,"lamp"); } }
    // Wurzeln aus Eis, die sich über die Plattform krallen
    for(let i=0;i<9;i++){ const an=i/9*Math.PI*2+.3; let px=x, pz=z, py=y+1.5; for(let k=0;k<14;k++){ px+=Math.cos(an)*.45; pz+=Math.sin(an)*.45; py-= k<5 ? 0 : .2; fs(px,py,pz,"pillar"); fs(px,py+.5,pz, k%4===0?"iceGlow":"pillar"); } }
    // Stamm: gedreht, durchscheinend leuchtend
    for(let h=0; h<16; h+=.5){ const a=h*.45, r=2.2-h*.09; for(let k=0;k<8;k++){ const off=k/8*Math.PI*2; fs(x+Math.cos(a+off)*r, y+1+h, z+Math.sin(a+off)*r, k%4===0 ? "iceGlow" : "pillar"); fs(x+Math.cos(a+off)*r*.5, y+1+h, z+Math.sin(a+off)*r*.5, "pillar"); } }
    // Äste rekursiv mit Eiskristall-Blättern, Schnee auf den Ästen, hängende Eiszapfen
    const tips=[];
    const branch = (px,py,pz,yaw,pitch,len,depth) => { const n=Math.ceil(len*2);
      for(let i=0;i<n;i++){ px+=Math.cos(yaw)*Math.cos(pitch)*.5; pz+=Math.sin(yaw)*Math.cos(pitch)*.5; py+=Math.sin(pitch)*.5; fs(px,py,pz, depth>1 ? "pillar" : "icicle"); if(depth>1){ fs(px,py+.5,pz, i%3===0 ? "snowB" : "pillar"); } }
      if(depth===0){ tips.push([px,py,pz]); return; }
      const k = depth>1 ? 3 : 2; for(let j=0;j<k;j++) branch(px,py,pz, yaw+(j-(k-1)/2)*1.05+(rand()-.5)*.4, Math.max(-.1, pitch-.2+(rand()-.4)*.4), len*.66, depth-1); };
    for(let i=0;i<6;i++) branch(x, y+12+i*.7, z, i/6*Math.PI*2+.2, .45, 6.5, 3);
    branch(x, y+16, z, .4, 1.35, 4, 2);
    tips.forEach(([tx,ty,tz],i)=>{ const g = i%5===0 ? "violet" : "crystal";
      for(let a=-1.5;a<=1.5;a+=.5) for(let b=-.5;b<=1;b+=.5) for(let c=-1.5;c<=1.5;c+=.5){ const d=Math.hypot(a,b*1.4,c); if(d<=1.5 && rand()<.62) fs(tx+a,ty+b+.5,tz+c, d>1.1 && b>.4 ? "snowB" : (rand()<.15 ? "icicle" : g)); }
      for(let k=1;k<=1+Math.floor(rand()*4);k++) fs(tx,ty-k*.5,tz,"icicle"); });
    S.vocabulary.top=[x, y+24, z]; S.vocabulary.base=y+8; S.vocabulary.lift=1; S.vocabulary.cam={pos:[x+6,y+34,z+66], look:[x+15,y+12,z]}; }

  // ---------- Country & people: Garten mit großem Brunnen rechts ----------
  { const {x,z}=S.country, y=hAt(x,z);
    for(let a=-13;a<=13;a++) for(let c=-11;c<=11;c++){ const xx=x+a, zz=z+c; const t=hAt(xx,zz); if(Math.abs(t-y)>2) continue;
      for(let yy=t;yy<y;yy++) set(xx,yy,zz,"snowB"); for(let yy=y;yy<=t;yy++) set(xx,yy,zz,null); set(xx,y-1,zz, (Math.abs(a)<=1||Math.abs(c)<=1||Math.abs(Math.hypot(a,c)-7)<.8) ? "floorIce" : "snow"); }
    // Hecken (verschneit), Wege kreuzförmig und als Ring
    for(let a=-12;a<=12;a++) for(let c=-10;c<=10;c++){ const r=Math.hypot(a,c); const edge = (Math.abs(a)===12||Math.abs(c)===10) && Math.abs(a)>2 && Math.abs(c)>2;
      const inner = r>8.6 && r<9.6 && Math.abs(a)>2 && Math.abs(c)>2; if(edge || inner){ set(x+a,y,z+c,"hedge"); if(edge) set(x+a,y+1,z+c,"hedge"); } }
    // Rosenbögen mit gefrorenen Blüten an den Eingängen
    for(const [a,c,rot] of [[0,10,0],[0,-10,0],[12,0,1],[-12,0,1]]){ for(let k=-2;k<=2;k++){ const yy=y+4-Math.round(k*k*.5); const ax=rot? x+a : x+a+k, az=rot? z+c+k : z+c; set(ax,yy,az,"hedge"); fs(ax+.25,yy+.5,az, k%2?"flowerV":"flowerC"); }
      for(const k of [-2,2]){ const ax=rot? x+a : x+a+k, az=rot? z+c+k : z+c; fill(ax,y,az,ax,y+2,az,"hedge"); } }
    // großer Brunnen: drei Schalen, gefrorene Wasserstrahlen, leuchtendes Wasser
    ring(x,y,z,5,"carved"); ring(x,y+1,z,5,(a,b,c)=>(a+c)%2?"iceTrim":"carved"); disk(x,y,z,4.2,"lakeIce");
    cyl(x,y,z,1,5,"carved"); disk(x,y+5,z,3,"carved"); ring(x,y+6,z,3,"iceTrim"); disk(x,y+5,z,2.2,"iceGlow");
    cyl(x,y+6,z,.6,4,"carved"); disk(x,y+10,z,1.8,"carved"); ring(x,y+11,z,1.8,"iceTrim"); set(x,y+11,z,"iceGlow");
    for(let k=0;k<4;k++) fs(x,y+12+k*.5,z,"icicle"); fs(x,y+14.5,z,"lamp");
    for(let i=0;i<8;i++){ const an=i/8*Math.PI*2; for(let k=0;k<6;k++){ const r=1.8+k*.32, yy=y+10.5-k*k*.18; fs(x+Math.cos(an)*r, yy, z+Math.sin(an)*r, "icicle"); } }       // erstarrte Strahlen oben
    for(let i=0;i<12;i++){ const an=i/12*Math.PI*2; for(let k=0;k<7;k++){ const r=3+k*.3, yy=y+5.5-k*k*.12; fs(x+Math.cos(an)*r, yy, z+Math.sin(an)*r, "icicle"); } }        // unten
    // Eisfiguren: Schwan und Hirsch auf Sockeln
    { const sx=x-7, sz=z-6; fill(sx-1,y,sz-1,sx+1,y,sz+1,"carved"); ellip(sx,y+2,sz,1.6,1,1,"icicle"); line(sx+1,y+3,sz,sx+2,y+5,sz,"icicle"); fs(sx+2.5,y+5.5,sz,"icicle"); }
    { const sx=x+7, sz=z-6; fill(sx-1,y,sz-1,sx+1,y,sz+1,"carved"); fill(sx,y+1,sz,sx,y+5,sz,"pillar"); for(const [a,b] of [[-2,3],[2,3],[-1,5],[1,5]]) line(sx,y+b,sz,sx+a,y+b+2,sz,"crystal"); fs(sx,y+6.5,sz,"lamp"); }
    // Eis-Obelisk hinten im Garten
    { const px=x, pz=z-9; fill(px,y,pz,px,y+6,pz,"pillar"); set(px,y+7,pz,"iceGlow"); fs(px,y+8,pz,"lamp"); }
    // Laternen und Bänke
    for(const [a,c] of [[-4,6],[4,6],[-6,-2],[6,-2],[-10,8],[10,8]]){ fill(x+a,y,z+c,x+a,y+2,z+c,"silver"); set(x+a,y+3,z+c,"lamp"); }
    for(const [a,c] of [[-3,-5],[3,-5]]){ fs(x+a,y+.25,z+c,"carved"); fs(x+a+.5,y+.25,z+c,"carved"); fs(x+a-.5,y+.25,z+c,"carved"); }
    S.country.top=[x, y+16, z]; S.country.base=y+5; S.country.lift=1; S.country.cam={pos:[x-18,y+30,z+42], look:[x+8,y+3,z-2]}; }

  // ---------- vereister Wald rechts vorne ----------
  const pine = (x,z,h) => { const y=hAt(x,z); if(y<L+1 || get(x,y,z) || get(x,y+1,z)) return; fill(x,y,z,x,y+2,z,"bark");
    for(let k=0;k<h;k++){ const r=(h-k)*.36+.3, yy=y+2+k; if(r<.6){ set(x,yy,z,"pine"); continue; } disk(x,yy,z,r,(a,b,c)=> (k%3===0 && Math.hypot(a-x,c-z)>r-1) ? "snowB" : "pine"); }
    set(x,y+2+h,z,"snowB"); if(rand()<.25) fs(x+.5,y+2+h+.5,z,"lamp"); };
  for(let i=0;i<170;i++){ const x=58+Math.floor(rand()*70), z=50+Math.floor(rand()*56); if(Math.hypot(x-S.country.x,z-S.country.z)<17 || (Math.abs(x-S.country.x+4)<12 && z>S.country.z && z<S.country.z+34)) continue;
    if(S.bridgePts.some(p=>Math.hypot(p[0]-x,p[2]-z)<4)) continue; pine(x,z,5+Math.floor(rand()*6)); }
  // weitere Bäume am Ufer links und an den Rändern
  for(let i=0;i<70;i++){ const x=-12+Math.floor(rand()*40), z=36+Math.floor(rand()*70); if(lakeF(x,z)<1.3 || Math.hypot(x-S.vocabulary.x,z-S.vocabulary.z)<12) continue; pine(x,z,5+Math.floor(rand()*6)); }
  // Eisschollen und Lichter im See
  for(let i=0;i<40;i++){ const x=Math.floor(rand()*60), z=40+Math.floor(rand()*60); if(lakeF(x,z)>.85) continue; if(rand()<.6) disk(x,L-1,z,1+rand()*1.6,"floorIce"); else fs(x,L-.25,z,"iceGlow"); }

  // ---------- Landschaft bis zum Horizont: See links hinten, verschneite Berge ----------
  const Fr = A.far; Fr.cell = 3;
  const peaks = [[-110,-190,80,80],[-40,-220,90,95],[30,-240,80,85],[-180,-120,60,60],[150,-230,70,70],[220,-160,50,45],[-70,-150,50,50],[90,-260,70,75]];
  // Bergkranz rundherum (links, rechts, hinten), damit man beim Drehen überall Berge sieht
  for(let i=0;i<22;i++){ const an = Math.PI*(.05 + i/21*.9), R = 230 + (i%3)*35; peaks.push([W/2 - Math.cos(an)*R*1.15, D/2 - Math.sin(an)*R*.9 + 40, 70+(i*37)%40, 85+(i*53)%70]); }
  for(const [px,pz,r,h] of [[-200,80,70,90],[-230,170,80,100],[W+200,70,70,95],[W+230,170,80,105],[-150,240,60,70],[W+150,250,60,75]]) peaks.push([px,pz,r,h]);
  const fh = (x,z) => { let h = G + (fbm(x*.03,z*.03)-.5)*6 + (x>62 && z>52 ? 1.5+fbm(x*.05,z*.05)*3 : 0);
    for(const [px,pz,r,hh] of peaks){ const d=Math.hypot(x-px,z-pz)/r; if(d<1){ const v = hh*Math.pow(1-d,1.35)*(.75+.5*fbm(x*.05,z*.05)); if(v>h) h=v; } } return h; };
  A.farTerrain({ x0:-330, x1:W+330, z0:-320, z1:D+260, base:0, skip:(x,z)=> (x>-15 && x<W+15 && z>-15 && z<D+15) || (lakeB(x,z)<1.3 && x<44),
    h: fh, top:(x,z,y,hc)=> y*3 > 30 ? "snowB" : (rand()<.3 ? "rock" : "snowB"), fill:(x,z,y,hc)=> y*3 > 46 ? (rand()<.7?"snowB":"frost") : (rand()<.5 ? "rock" : "frost") });

  // ferne verschneite Nadelbäume in der Ebene (grobe Blöcke)
  const fset = (x,y,z,t) => Fr.set(Math.floor(x/3),Math.floor(y/3),Math.floor(z/3),t);
  for(let i=0;i<900;i++){ const x=-200+rand()*440, z=-150+rand()*300; if(x>-15 && x<W+15 && z>-15 && z<D+15) continue; if(z>D+8) continue; if(lakeB(x,z)<1.45 && x<46) continue; if(fbm(x*.025,z*.025)<.5) continue;
    const b=fh(x,z); if(b>36) continue; const cx=Math.floor(x/3), cz=Math.floor(z/3), cy=Math.floor(b/3);
    for(const [a,c] of [[0,0],[1,0],[-1,0],[0,1],[0,-1]]) Fr.set(cx+a,cy+1,cz+c,"pine"); Fr.set(cx,cy,cz,"bark"); Fr.set(cx,cy+2,cz,"pine"); Fr.set(cx,cy+3,cz,"snowB"); }

  // ---------- Tiere ----------
  const creatures = [
    { ...polarBear({walk:true, speed:3.4}), orbit:{c:[26,L,74], r:[8,3], speed:.12, ph:1, bob:.05, cycle:[30,.35,4]}, scale:.36, clearR:3 },
    { ...frostFox({walk:true, speed:11}), orbit:{c:[S.country.x,S.country.base-5,S.country.z], r:[7,7], speed:.25, ph:0, bob:.12, cycle:[18,.3,0]}, scale:.26, clearR:1 },
    { ...frostFox({walk:true, speed:11, col:0xF4FAFF}), orbit:{c:[S.country.x,S.country.base-5,S.country.z], r:[7,7], speed:.25, ph:.6, bob:.12, cycle:[18,.3,0]}, scale:.23, clearR:1 },
    { ...frostFox({walk:true, speed:10}), orbit:{c:[S.vocabulary.x,hAt(S.vocabulary.x,S.vocabulary.z),S.vocabulary.z], r:[10.5,10.5], speed:.2, ph:2, bob:.12, dir:-1, cycle:[22,.3,6]}, scale:.24, clearR:1 },
    { ...frostFox({walk:false}), at:[S.vocabulary.x+5, hAt(S.vocabulary.x,S.vocabulary.z)+1, S.vocabulary.z+5], yaw:-.6, scale:.24 }
  ];
  // Laufwege freiräumen
  const CLR = ["snowB","snow","frost","rock","icicle","crystal","violet","silver","lamp","pine","bark","hedge","floorIce"];
  for(const c of creatures){ const ob=c.orbit; if(!ob) continue; const rad = c.clearR; c.clearH = 6;
    for(let k=0;k<360;k++){ const t=k/360*Math.PI*2, x=ob.c[0]+Math.cos(t)*ob.r[0], z=ob.c[2]+Math.sin(t)*ob.r[1];
      for(let a=-rad;a<=rad;a++) for(let b=-rad;b<=rad;b++) if(a*a+b*b<=rad*rad) for(let y=Math.ceil(ob.c[1]);y<ob.c[1]+6;y++){ const bt=get(Math.round(x+a),y,Math.round(z+b)); if(CLR.includes(bt)) set(Math.round(x+a),y,Math.round(z+b),null); } } }

  return {
    W, D, blocks, spots:S, exposure:1.0, fov:42, creatures,
    sky:[[0,"#2A62B0"],[.4,"#5C94D6"],[.72,"#A8CCEE"],[1,"#E2EEF8"]], fog:[0xB4CCE6, 180, 620],
    hemi:[0xE6F2FF, 0x3A5A8A, 1.35], sun:{color:0xFFF6EA, int:1.6, pos:[60,110,90]}, bloom:[.4,.45,.85],
    lights:[{pos:[CX,HB+16,CZ+18], color:0x9AE8FF, int:420, dist:46, flicker:900},
            {pos:[S.vocabulary.x,hAt(S.vocabulary.x,S.vocabulary.z)+12,S.vocabulary.z], color:0x8AD8FF, int:260, dist:30, flicker:1200},
            {pos:[S.country.x,S.country.base+4,S.country.z], color:0xBFF4FF, int:200, dist:26}],
    planes:[{y:L-.08, tex:T.lake, repeat:220, size:900, em:.25, anim:[.004,.002]}],
    beams:[{pos:[CX,HB+60,CZ-1], len:90, w:7, color:0x9AE8FF, opacity:.22, tilt:.4, speed:.15}],
    ribbons:[{w:320, h:30, pos:[20,120,-150], rot:.1, color:0x9A8AFF, opacity:.16}, {w:240, h:22, pos:[-20,132,-170], rot:.3, color:0x7AD8FF, opacity:.14}],
    clouds:[...[[-220,90,40],[-240,110,160],[W+220,95,40],[W+240,115,160],[-150,130,-60],[W+150,130,-60],[-60,150,-250],[180,150,-250]].map(p=>({pos:p, r:26, n:42, sx:1.9, sy:.55, sz:1.2, drift:.3})),
            {pos:[-40,110,-120], r:20, n:44, sx:1.8, sy:.6, sz:1.1, drift:.4}, {pos:[100,120,-140], r:24, n:48, sx:1.9, sy:.6, sz:1.1, drift:.3},
            {pos:[40,140,-200], r:28, n:40, sx:2, sy:.5, sz:1}, {pos:[170,100,-60], r:18, n:36, sx:1.7, sy:.6, sz:1, drift:.5}],
    particles:[{n:1700, area:[-40,W+40,0,90,-40,D+60], vy:-2.6, wob:2.2, color:0xFFFFFF, size:.8, opacity:.95, soft:true},
               {n:500, area:[-160,W+160,0,120,-200,-40], vy:-3, wob:2.5, color:0xFFFFFF, size:1.1, opacity:.8, soft:true}],
    puffs:[{n:16, pos:[-20,L+1,60], dx:80, dy:1, dz:10, s0:16, s1:20, color:0xE8F2FC, opacity:.35, speed:.01, spread:20, flat:.3},
           {n:12, pos:[-60,L+2,0], dx:120, dy:1, dz:0, s0:24, s1:28, color:0xE8F2FC, opacity:.35, speed:.008, spread:20, flat:.3},
           {n:10, pos:[60,G+3,90], dx:70, dy:2, dz:0, s0:16, s1:20, color:0xEEF6FE, opacity:.3, speed:.01, spread:10, flat:.35}],
    home:{pos:[4,96,200], look:[52,24,36]}, homePortrait:{pos:[40,110,250], look:[62,24,36]},
    ui:{bg:"rgba(10,30,62,.86)", border:"#8AE6FF", glow:"rgba(138,230,255,.55)", text:"#EAF6FF", sub:"#A8C8E6", accent:"#8AE6FF", "accent-ink":"#06182E", chip:"rgba(8,26,54,.8)"}
  };
}
