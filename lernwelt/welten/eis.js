// Klasse 10 · Ice Citadel – nach Seáns Vorlagebild: großes Eisschloss rechts hinten auf einem Hügel, davor rechts ein vereister Wald,
// links vorne ein gefrorener See, eine Brücke vom Wald über den See zum Schloss, links hinten ein zweiter See vor verschneiten Bergen.
// Stationen: Schloss (Grammar), großer Eisbaum links vor dem Schloss (Vocabulary), Garten mit Brunnen rechts (Country & people).
import { polarBear, frostFox, stag, bird } from "./tiere.js";
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
    crackIce: tex(g=>{ for(let x=0;x<16;x++) for(let y=0;y<16;y++){ const v=Math.sin(x*.4+y*.25)+Math.sin(y*.7-x*.2)*.6+rand()*.3; P(g,x,y, v>1.3?"#CFF2FF":v>.6?"#7CC8F0":v>-.2?"#4AA6E0":"#2E84C8"); } let cy=Math.floor(rand()*16); for(let x=0;x<16;x++){ P(g,x,cy,"#1E5A96"); P(g,x,(cy+1)%16,"#E6FAFF"); if(rand()<.35) cy=(cy+(rand()<.5?1:15))%16; } }),
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
    lakeIce:{side:T.lake, em:.12}, crackIce:{side:T.crackIce, em:.12}, iceBrick:{side:T.iceBrick}, iceBrick2:{side:T.iceBrick2}, iceTrim:{side:T.iceTrim}, carved:{side:T.carved, top:T.iceBrick}, roof:{side:T.roof},
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
    const d = hillD(x,z); if(d<40){ const t=Math.min(1,(40-d)/12); h = Math.max(h, G + (HB-G)*t*t*(3-2*t) + (fbm(x*.2,z*.2)-.5)*2*t*(1-t)*4); }
    if(lakeF(x,z)<1 || lakeB(x,z)<1 || chan(x,z)) h = Math.min(h, L-1 - (1-Math.min(lakeF(x,z),lakeB(x,z),1))*2);
    else if(lakeF(x,z)<1.25 || lakeB(x,z)<1.2) h = Math.min(h, L+ (Math.min(lakeF(x,z),lakeB(x,z))-1)*12);
    return Math.round(h); };
  const Hm = {}; const hAt = (x,z) => { const k=x+","+z; if(Hm[k]===undefined) Hm[k]=H(x,z); return Hm[k]; };
  for(let z=-26; z<D+14; z++) for(let x=-34; x<W+14; x++){ const h=hAt(x,z);
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
    vocabulary:{x:-14, z:34, col:0xC8A0FF, ort:"Frost Tree"},
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
    // Bogengang (Aquädukt) nach rechts zum Garten
    S.grammar.base=y+6; S.grammar.lift=1; S.grammar.cam={pos:[x-14,y+44,z+104], look:[x+14,y+14,z]}; }

  { const k=1.2, cx=CX, cy=HB-1, cz=CZ+1, X0=CX-22, X1=CX+22, Z0=CZ-16, Z1=CZ+18, src=new Map(), key=(a,b,c)=>a+","+b+","+c; let yMax=cy;
    for(const [kk,b] of A.V){ const [x,y,z,t]=b; if(x>=X0&&x<=X1&&z>=Z0&&z<=Z1&&y>=cy){ src.set(key(x,y,z),t); if(y>yMax) yMax=y; } }
    for(const kk of src.keys()){ const [x,y,z]=kk.split(",").map(Number); set(x,y,z,null); }
    const nx0=Math.floor(cx+(X0-cx)*k), nx1=Math.ceil(cx+(X1-cx)*k), nz0=Math.floor(cz+(Z0-cz)*k), nz1=Math.ceil(cz+(Z1-cz)*k), ny1=Math.ceil(cy+(yMax-cy)*k)+1;
    for(let X=nx0;X<=nx1;X++) for(let Z=nz0;Z<=nz1;Z++) for(let Y=cy;Y<=ny1;Y++){ const t=src.get(key(Math.round(cx+(X-cx)/k),Math.round(cy+(Y-cy)/k),Math.round(cz+(Z-cz)/k))); if(t) set(X,Y,Z,t); }
    // Fundament, wo die vergrößerte Grundfläche über den Hang ragt
    for(let X=nx0;X<=nx1;X++) for(let Z=nz0;Z<=nz1;Z++){ if(!get(X,cy,Z)) continue; for(let Y=cy-1; Y>cy-14 && !get(X,Y,Z); Y--) set(X,Y,Z,"iceBrick"); }
    // feine Verzierungen (Laternen, Goldspitzen) mitverschieben
    const fine=[]; for(const [kk,b] of FN.V){ const [i,j,l,t]=b, x=i/2, y=j/2, z=l/2; if(x>=X0&&x<=X1+1&&z>=Z0&&z<=Z1+1&&y>=cy) fine.push([i,j,l,t]); }
    for(const [i,j,l] of fine) FN.set(i,j,l,null);
    for(const [i,j,l,t] of fine) FN.set(Math.round((cx+(i/2-cx)*k)*2), Math.round((cy+(j/2-cy)*k)*2), Math.round((cz+(l/2-cz)*k)*2), t);
    S.grammar.top=[S.grammar.top[0], Math.round(cy+(S.grammar.top[1]-cy)*k), Math.round(cz+(S.grammar.top[2]-cz)*k)];
    if(S.grammar.beams) S.grammar.beams=S.grammar.beams.map(([a,b,c])=>[a, Math.round(cy+(b-cy)*k), Math.round(cz+(c-cz)*k)]);
    // breiter Aufgang vom Tor zur Brücke
    for(let zz=CZ+20; zz<=CZ+29; zz++) for(let xx=CX-3; xx<=CX+3; xx++){ for(let Y=HB-1; Y<=HB+3; Y++) if(Y>HB-1) set(xx,Y,zz,null); set(xx,HB-1,zz, Math.abs(xx-CX)===3 ? "iceTrim" : "carved"); for(let Y=HB-2; Y>HB-12 && !get(xx,Y,zz); Y--) set(xx,Y,zz,"iceBrick"); }
    for(const xx of [CX-3,CX+3]) for(let zz=CZ+22; zz<=CZ+29; zz+=3){ set(xx,HB,zz,"silver"); set(xx,HB+1,zz,"lamp"); } }

  // ---------- Unterer Mauerring am Hang mit Rundtürmen, wie eine Stadt die sich den Hügel hinaufzieht ----------
  for(let i=0;i<120;i++){ const an=-Math.PI*.95 + i/120*Math.PI*1.9, wx=Math.round(CX+Math.cos(an)*31), wz=Math.round(CZ+Math.sin(an)*27);
    if(an>1.2 && an<1.75) continue; const t=hAt(wx,wz); fill(wx,t,wz,wx,t+5,wz,(a,b)=> b===t+5 ? "carved" : "iceBrick"); if(i%2===0) set(wx,t+6,wz,"carved"); }
  for(const an of [-2.6,-2.1,-1.5,-.9,-.3,.4,.9,2.0,2.5]){ const tx=Math.round(CX+Math.cos(an)*31), tz=Math.round(CZ+Math.sin(an)*27); roundTower(tx,hAt(tx,tz),tz,2.2,9+Math.round(rand()*6),7,{warm:true}); }
  // schlanke Spitztürme zwischen Mauerring und Schloss
  for(const [a,c,h] of [[-26,4,19],[26,0,21],[-19,-19,24],[19,-21,26],[-28,-7,14],[28,14,14]]){ const tx=CX+a, tz=CZ+c; roundTower(tx,hAt(tx,tz),tz,1.8,h,9); }

  // ---------- Häuschen rund um den Schlosshügel (Stadt am Hang) ----------
  const cottage = (x,z,w,d,h) => { const y=hAt(x,z); if(y<L+1 || get(x,y+1,z)) return; const hw=w>>1, hd=d>>1;
    for(let yy=y;yy<y+h;yy++) for(let a=-hw;a<=hw;a++) for(let c=-hd;c<=hd;c++){ if(Math.abs(a)!==hw&&Math.abs(c)!==hd) continue; set(x+a,yy,z+c, (yy-y)===2 && (a+c)%2===0 && Math.abs(a)!==hw ? "winW" : "iceBrick2"); }
    for(let k=0;k<=hd+1;k++) fill(x-hw-1,y+h+k,z-hd-1+k,x+hw+1,y+h+k,z+hd+1-k, k===hd+1?"snowB":"roof"); fs(x+hw,y+h+2,z,"lamp"); };
  for(const [hx,hz,w,d,h] of [[51,6,5,4,4],[49,18,5,4,5],[53,32,5,4,4],[107,4,5,4,5],[110,18,5,4,4],[61,44,5,4,4],[100,38,5,4,4],[66,-10,5,4,5],[92,-8,5,4,4]]) cottage(hx,hz,w,d,h);

  // ---------- Brücke vom Wald über den See zum Schloss ----------
  { const P = [[78,G+2,86],[56,G+3,80],[36,G+5,68],[34,G+8,52],[56,HB-5,44],[CX,HB-1,CZ+30]];
    const cr = (a,b,c,d,t) => a.map((_,i)=> .5*((2*b[i])+(-a[i]+c[i])*t+(2*a[i]-5*b[i]+4*c[i]-d[i])*t*t+(-a[i]+3*b[i]-3*c[i]+d[i])*t*t*t));
    const pts=[]; for(let i=0;i<P.length-1;i++){ const a=P[Math.max(0,i-1)], b=P[i], c=P[i+1], d=P[Math.min(P.length-1,i+2)]; for(let k=0;k<12;k++) pts.push(cr(a,b,c,d,k/12)); } pts.push(P[P.length-1]);
    let acc=0; for(let i=0;i<pts.length;i++){ const p=pts[i], q=pts[Math.min(pts.length-1,i+1)], dx=q[0]-p[0], dz=q[2]-p[2], l=Math.hypot(dx,dz)||1, nx=-dz/l, nz=dx/l, y=Math.round(p[1]);
      for(const w of [-2,-1,0,1,2]) set(Math.round(p[0]+nx*w),y,Math.round(p[2]+nz*w), w===0 ? "iceBrick2" : "carved");
      for(const w of [-3,3]){ set(Math.round(p[0]+nx*w),y,Math.round(p[2]+nz*w),"iceTrim"); fs(p[0]+nx*w,y+1,p[2]+nz*w,"silver"); fs(p[0]+nx*w,y+1.5,p[2]+nz*w,"silver"); fs(p[0]+nx*w*1.05,y-.5,p[2]+nz*w*1.05,"iceGlow"); }
      acc += l; if(acc>6){ acc=0; for(const w of [-3,3]){ const lx=Math.round(p[0]+nx*w), lz=Math.round(p[2]+nz*w); fill(lx,y+1,lz,lx,y+3,lz,"pillar"); set(lx,y+4,lz,"carved"); fs(lx,y+5,lz,"spire"); fs(lx,y+5.5,lz,"lamp"); for(let k=1;k<=3;k++) fs(lx+nx*.6*Math.sign(w),y-k*.5,lz+nz*.6*Math.sign(w),"icicle"); }
        const ground = Math.max(L-1, hAt(Math.round(p[0]),Math.round(p[2]))); for(let yy=ground; yy<y; yy++) for(const w of [-2,2]) set(Math.round(p[0]+nx*w),yy,Math.round(p[2]+nz*w), yy===L-1 ? "carved" : (yy%4===0 ? "iceTrim" : "iceBrick")); }
      else { const ground = Math.max(L-1, hAt(Math.round(p[0]),Math.round(p[2]))); const arch = y - 1 - Math.round(Math.sin(acc/6*Math.PI)*Math.max(0,(y-ground-2))*.85); for(let yy=arch; yy<y; yy++) for(const w of [-2,2]) set(Math.round(p[0]+nx*w),yy,Math.round(p[2]+nz*w),"iceBrick2"); } }
    S.bridgePts = pts; }

  // ---------- Vocabulary: großer Eisbaum links vom Kanal zwischen den Seen ----------
  { const {x,z}=S.vocabulary, y=hAt(x,z), Rp=10;
    for(let a=-Rp-3;a<=Rp+3;a++) for(let c=-Rp-3;c<=Rp+3;c++){ const d=Math.hypot(a,c); if(d>Rp+3) continue; const t=hAt(x+a,z+c); for(let yy=Math.min(t,y)-1; yy<Math.max(t,y)+4; yy++) set(x+a,yy,z+c, yy<y ? (yy===y-1 && d>Rp ? "snow" : "snowB") : null); }
    // runde Plattform mit Mosaik, Runenring, Stufen und Laternen
    for(let a=-Rp;a<=Rp;a++) for(let c=-Rp;c<=Rp;c++){ const d=Math.hypot(a,c); if(d>Rp+.3) continue; set(x+a,y,z+c, d>Rp-1 ? "carved" : (Math.round(Math.atan2(c,a)/(Math.PI/10))+Math.round(d/2))%2 ? "floorIce" : "iceBrick2"); }
    ring(x,y+1,z,Rp,(a,b,c)=> ((a+c)&1) ? "iceTrim" : null);
    for(let i=0;i<10;i++){ const an=i/10*Math.PI*2, lx=Math.round(x+Math.cos(an)*(Rp+1.5)), lz=Math.round(z+Math.sin(an)*(Rp+1.5)); fill(lx,y,lz,lx,y+3,lz,"silver"); set(lx,y+4,lz,"lamp"); }
    for(let i=0;i<16;i++){ const an=i/16*Math.PI*2; fs(x+.5+Math.cos(an)*(Rp-2.2), y+.75, z+.5+Math.sin(an)*(Rp-2.2), i%2?"crystal":"violet"); }
    // Eiskristalle wachsen aus dem Boden rund um die Plattform
    const shard = (sx,sy,sz,h,tilt,az,t) => { for(let k=0;k<h*2;k++){ const r=Math.max(.25,(1-k/(h*2))*.9), px=sx+Math.cos(az)*tilt*k*.5, pz=sz+Math.sin(az)*tilt*k*.5; for(let a=-r;a<=r;a+=.5) for(let c=-r;c<=r;c+=.5) if(a*a+c*c<=r*r) fs(px+a, sy+k*.5, pz+c, t); } };
    for(let i=0;i<14;i++){ const an=Math.PI*(1.15+rand()*1.7), r=Rp+3+rand()*3, sx=x+.5+Math.cos(an)*r, sz=z+.5+Math.sin(an)*r; const t=hAt(Math.round(sx),Math.round(sz));
      for(let j=0;j<3;j++) shard(sx+(rand()-.5)*2, t, sz+(rand()-.5)*2, 2+rand()*4, .3+rand()*.4, an+(rand()-.5), rand()<.3?"violet":(rand()<.5?"crystal":"pillar")); }
    // mächtige Wurzeln, die sich über die Plattform und in den Schnee krallen
    for(let i=0;i<12;i++){ const an=i/12*Math.PI*2+.2; let px=x+.5, pz=z+.5, py=y+3, r=1.2; for(let k=0;k<26;k++){ px+=Math.cos(an+Math.sin(k*.3)*.3)*.45; pz+=Math.sin(an+Math.sin(k*.3)*.3)*.45; py-= k<6 ? 0 : (py>y+.5 ? .22 : 0); r=Math.max(.3,r-.035);
      for(let a=-r;a<=r;a+=.5) for(let c=-r;c<=r;c+=.5) if(a*a+c*c<=r*r) fs(px+a,py,pz+c, k%5===2 && a===0 && c===0 ? "iceGlow" : "pillar"); fs(px,py+r,pz, k%3===0 ? "snowB" : "pillar"); } }
    // Stamm: dick, gedreht aus mehreren Strängen, leuchtende Adern
    const TH=26; for(let h=0; h<TH; h+=.5){ const r=3.6-h*.075; for(let s2=0;s2<5;s2++){ const a=h*.32+s2/5*Math.PI*2; for(let q=0;q<4;q++){ const rr=r*(.55+q*.15), ax=x+.5+Math.cos(a+q*.25)*rr, az=z+.5+Math.sin(a+q*.25)*rr; fs(ax, y+1+h, az, q===3 && s2%2===0 ? "iceGlow" : "pillar"); } } fs(x+.5,y+1+h,z+.5,"crystal"); }
    // Äste rekursiv, dicke Hauptäste, Kristallblätter, Schnee obenauf, hängende Eiszapfen und Kristall-Laternen
    const tips=[];
    const branch = (px,py,pz,yaw,pitch,len,depth,th) => { const n=Math.ceil(len*2);
      for(let i=0;i<n;i++){ px+=Math.cos(yaw)*Math.cos(pitch)*.5; pz+=Math.sin(yaw)*Math.cos(pitch)*.5; py+=Math.sin(pitch)*.5; const r=th*(1-i/n*.4);
        for(let a=-r;a<=r;a+=.5) for(let c=-r;c<=r;c+=.5) if(a*a+c*c<=r*r) fs(px+a,py,pz+c, depth>1 ? "pillar" : "icicle");
        if(depth>1) fs(px,py+r+.5,pz, i%3===0 ? "snowB" : "pillar");
        if(depth===2 && i===Math.floor(n/2) && rand()<.5){ for(let k=1;k<=3;k++) fs(px,py-k*.5,pz,"silver"); fs(px,py-2,pz,"lamp"); } }
      if(depth===0){ tips.push([px,py,pz]); return; }
      const kk = depth>1 ? 3 : 2; for(let j=0;j<kk;j++) branch(px,py,pz, yaw+(j-(kk-1)/2)*1.0+(rand()-.5)*.4, Math.max(-.15, pitch-.18+(rand()-.4)*.4), len*.68, depth-1, Math.max(0,th-.5)); };
    for(let i=0;i<8;i++) branch(x+.5, y+17+i*.9, z+.5, i/8*Math.PI*2+.2, .42, 9, 4, 1.5);
    branch(x+.5, y+TH, z+.5, .4, 1.35, 6, 3, 1);
    tips.forEach(([tx,ty,tz],i)=>{ const g = i%4===0 ? "violet" : "crystal";
      for(let a=-2;a<=2;a+=.5) for(let b=-.5;b<=1.5;b+=.5) for(let c=-2;c<=2;c+=.5){ const d=Math.hypot(a,b*1.4,c); if(d<=2 && rand()<.6) fs(tx+a,ty+b+.5,tz+c, d>1.5 && b>.6 ? "snowB" : (rand()<.12 ? "icicle" : g)); }
      for(let k=1;k<=1+Math.floor(rand()*5);k++) fs(tx,ty-k*.5,tz,"icicle"); });
    S.vocabulary.top=[x, y+36, z]; S.vocabulary.base=y+12; S.vocabulary.lift=1; S.vocabulary.cam={pos:[x+30,y+30,z+58], look:[x+4,y+16,z]}; }

  // ---------- Country & people: der Frozen Garden – große Lichtung im Wald mit Kristallbrunnen, Pavillon, Laubengang, Eisskulpturen ----------
  const fEll = (cx,cy,cz,rx,ry,rz,t) => { for(let i=Math.floor((cx-rx)*2);i<=Math.ceil((cx+rx)*2);i++) for(let j=Math.floor((cy-ry)*2);j<=Math.ceil((cy+ry)*2);j++) for(let k=Math.floor((cz-rz)*2);k<=Math.ceil((cz+rz)*2);k++){
      const x=i/2, y=j/2, z=k/2; if(((x-cx)/(rx+.2))**2+((y-cy)/(ry+.2))**2+((z-cz)/(rz+.2))**2<=1) FN.set(i,j,k, typeof t==="function" ? t(x,y,z) : t); } };
  const fSeg = (p,q,r0,r1,t) => { const n=Math.ceil(Math.hypot(q[0]-p[0],q[1]-p[1],q[2]-p[2])*3)||1; for(let s=0;s<=n;s++){ const f=s/n, r=r0+(r1-r0)*f; fEll(p[0]+(q[0]-p[0])*f, p[1]+(q[1]-p[1])*f, p[2]+(q[2]-p[2])*f, r, r, r, t); } };
  { const {x,z}=S.country, y=hAt(x,z), R=17;
    // Lichtung einebnen (weicher Rand)
    for(let a=-R-5;a<=R+5;a++) for(let c=-R-5;c<=R+5;c++){ const d=Math.hypot(a,c); if(d>R+5) continue; const xx=x+a, zz=z+c, t=hAt(xx,zz), tgt = d<=R+1 ? y : Math.round(y + (t-y)*(d-R-1)/4);
      for(let yy=Math.min(t,tgt)-2; yy<Math.max(t,tgt)+3; yy++) set(xx,yy,zz, yy<tgt-1 ? "snowB" : yy===tgt-1 ? "snow" : null); }
    // Wege aus Eisplatten: Kreuz, innerer und äußerer Ring; Rasen dazwischen bleibt verschneit, mit Mosaik ums Zentrum
    for(let a=-R;a<=R;a++) for(let c=-R;c<=R;c++){ const d=Math.hypot(a,c); if(d>R) continue; let t=null;
      if(Math.abs(a)<=1 || Math.abs(c)<=1 || Math.abs(d-8)<1 || Math.abs(d-14)<1) t = (Math.abs(a)===1&&Math.abs(c)>8) || (Math.abs(c)===1&&Math.abs(a)>8) ? "iceTrim" : "lakeIce";
      if(d<7.2) t = (Math.round(Math.atan2(c,a)/(Math.PI/8))+Math.round(d))%2 ? "iceBrick2" : "lakeIce";
      if(t) set(x+a,y-1,z+c,t); }
    // Heckenring mit vier Toren, verschneite Kanten, Formschnitt-Kegel an den Toren
    for(let a=-R-1;a<=R+1;a++) for(let c=-R-1;c<=R+1;c++){ const d=Math.hypot(a,c); if(d>R+.6 || d<R-.6 || Math.abs(a)<=2 || Math.abs(c)<=2) continue; set(x+a,y,z+c,"hedge"); set(x+a,y+1,z+c,"hedge"); fs(x+a,y+2,z+c,"snowB"); }
    const topiary = (tx,tz,h) => { for(let k=0;k<h*2;k++){ const r=(1.3*(1-k/(h*2))); fEll(tx+.5,y+k*.5,tz+.5,r,.3,r,(xx,yy)=> k>=h*2-2 ? "snowB" : "pine"); } fs(tx+.5,y+h+.5,tz+.5,"snowB"); };
    for(const [a,c] of [[3,R],[-3,R],[3,-R],[-3,-R],[R,3],[R,-3],[-R,3],[-R,-3]]) topiary(x+a,z+c,4);
    // Kristallblumen-Beete in den vier Vierteln: Stiele, leuchtende Blüten, Schnee dazwischen
    for(let i=0;i<70;i++){ const an=rand()*Math.PI*2, r=9.5+rand()*3.5, fx=x+.5+Math.cos(an)*r, fz=z+.5+Math.sin(an)*r; if(Math.abs(fx-x-.5)<2.5 || Math.abs(fz-z-.5)<2.5) continue;
      const c = rand()<.5 ? "flowerV" : "flowerC"; fs(fx,y,fz,c); if(rand()<.5) fs(fx+.5,y,fz,c); if(rand()<.3) fs(fx,y+.5,fz,c); }
    // kleine Kristallbäume an den Diagonalen
    for(const an of [Math.PI/4, 3*Math.PI/4, 5*Math.PI/4, 7*Math.PI/4]){ const tx=x+.5+Math.cos(an)*11, tz=z+.5+Math.sin(an)*11;
      fSeg([tx,y,tz],[tx,y+4,tz],.45,.3,"pillar");
      for(let b=0;b<5;b++){ const ba=b/5*Math.PI*2+an, ex=tx+Math.cos(ba)*2.2, ez=tz+Math.sin(ba)*2.2; fSeg([tx,y+3.5,tz],[ex,y+5.5,ez],.25,.15,"pillar"); fEll(ex,y+6,ez,.8,.6,.8,(xx,yy)=> rand()<.4?"violet":"crystal"); fs(ex,y+5,ez,"icicle"); } }
    // großer Kristallbrunnen: achteckiges Becken, zwei Schalen, gefrorene Wasservorhänge, Kristallblüte obenauf
    { const fx=x+.5, fz=z+.5;
      for(let a=-6;a<=6;a++) for(let c=-6;c<=6;c++){ const d=Math.max(Math.abs(a),Math.abs(c),(Math.abs(a)+Math.abs(c))/1.41); if(d<=6.2 && d>5.2){ set(x+a,y,z+c,"carved"); set(x+a,y+1,z+c,"iceTrim"); } else if(d<=5.2) set(x+a,y,z+c,"lakeIce"); }
      fSeg([fx,y,fz],[fx,y+4,fz],1.1,.7,"iceBrick2");
      fEll(fx,y+4.3,fz,3.6,.7,3.6,(xx,yy)=> yy>y+4.6 ? "lakeIce" : "iceTrim"); fEll(fx,y+4.9,fz,3.1,.2,3.1,"pillar");
      fSeg([fx,y+4.5,fz],[fx,y+8,fz],.6,.4,"carved");
      fEll(fx,y+8.2,fz,2,.45,2,(xx,yy)=> yy>y+8.4 ? "lakeIce" : "iceTrim"); fEll(fx,y+8.7,fz,1.6,.15,1.6,"pillar");
      // gefrorene Wasservorhänge von beiden Schalen
      for(let i=0;i<10;i++){ const an=i/10*Math.PI*2; for(let k=0;k<8;k++){ const r=3.7+k*.12, yy=y+4.4-k*.5; if(yy<y+.5) break; fs(fx+Math.cos(an)*r, yy, fz+Math.sin(an)*r, k%2 ? "pillar" : "iceBrick2"); } }
      for(let i=0;i<6;i++){ const an=(i+.5)/6*Math.PI*2; for(let k=0;k<7;k++){ const r=2.1+k*.12, yy=y+8.3-k*.5; fs(fx+Math.cos(an)*r, yy, fz+Math.sin(an)*r, k%2 ? "pillar" : "iceBrick2"); } }
      // erstarrte Fontäne in der Mitte und Kristallblüte
      for(let i=0;i<6;i++){ const an=i/6*Math.PI*2; for(let k=0;k<10;k++){ const t=k/9, r=t*1.6, yy=y+9+Math.sin(t*Math.PI)*2.2; fs(fx+Math.cos(an)*r, yy, fz+Math.sin(an)*r, "pillar"); } }
      fSeg([fx,y+8.5,fz],[fx,y+11.5,fz],.3,.2,"pillar");
      for(let i=0;i<6;i++){ const an=i/6*Math.PI*2; fSeg([fx,y+11.5,fz],[fx+Math.cos(an)*1.3,y+12.6,fz+Math.sin(an)*1.3],.28,.12, i%2?"violet":"crystal"); }
      fEll(fx,y+12,fz,.5,.5,.5,"lamp"); }
    // Pavillon hinten: sechs Eissäulen, Zwiebeldach mit Spitze, darin eine leuchtende Kristallskulptur
    { const px=x, pz=z-11, b=y;
      disk(px,b,pz,4.4,"carved"); ring(px,b,pz,4.4,"iceTrim"); for(let s=1;s<=2;s++) fill(px-2,b-1+s-1,pz+4+s,px+2,b-1+s-1,pz+4+s,"carved");
      for(let i=0;i<6;i++){ const an=i/6*Math.PI*2+Math.PI/6, cx2=px+.5+Math.cos(an)*3.4, cz2=pz+.5+Math.sin(an)*3.4; fSeg([cx2,b+1,cz2],[cx2,b+6.5,cz2],.42,.36,"pillar"); fEll(cx2,b+6.8,cz2,.6,.3,.6,"carved"); }
      for(let k=0;k<14;k++){ const t=k/13, r = t<.25 ? 4.6+t*2 : 5.1*Math.pow(Math.cos((t-.25)/.75*Math.PI/2),.7); for(let i=0;i<Math.max(6,Math.round(r*14));i++){ const an=i/Math.max(6,Math.round(r*14))*Math.PI*2; fs(px+.5+Math.cos(an)*r, b+7+k*.5, pz+.5+Math.sin(an)*r, k%3===0 ? "carved" : (k>10 ? "spire" : "lakeIce")); } }
      for(let k=0;k<6;k++) fs(px+.5,b+14+k*.5,pz+.5, k<4 ? "spire" : "gold"); fs(px+.5,b+17,pz+.5,"lamp");
      for(let i=0;i<24;i++){ const an=i/24*Math.PI*2; for(let k=1;k<=1+(i%3);k++) fs(px+.5+Math.cos(an)*4.8, b+7-k*.5, pz+.5+Math.sin(an)*4.8, "icicle"); }
      fSeg([px+.5,b+1,pz+.5],[px+.5,b+3,pz+.5],.5,.3,"carved"); for(let i=0;i<5;i++){ const an=i/5*Math.PI*2; fSeg([px+.5,b+3,pz+.5],[px+.5+Math.cos(an)*.9,b+5,pz+.5+Math.sin(an)*.9],.25,.1,"crystal"); } }
    // Laubengang mit Eiszapfen und hängenden Lichtern auf dem Weg nach rechts
    for(let k=3;k<=R-2;k+=2){ for(let s=-1;s<=1;s+=2) for(let yy=0;yy<4;yy++) fs(x+.5+k, y+yy, z+.5+s*1.8, "silver");
      for(let i=0;i<=8;i++){ const th=i/8*Math.PI; fs(x+.5+k, y+4+Math.sin(th)*1, z+.5-Math.cos(th)*1.8, i%2?"hedge":"snowB"); }
      for(let i=1;i<=3;i++) fs(x+.5+k, y+4.5-i*.5, z+.5+(i-2)*.9, "icicle"); if(k%4===3) fs(x+.5+k, y+3.5, z+.5, "lamp"); }
    // Eisskulpturen: Hirsch (rechts vorne), Schwanenpaar (links vorne), Eule auf Säule (links hinten)
    { const sx=x+9.5, sz=z+9.5; fill(sx-2,y,sz-1,sx+1,y,sz,"iceTrim");
      fEll(sx,y+3.4,sz,2.2,1.1,.9,"icicle"); fSeg([sx+1.6,y+3.8,sz],[sx+2.6,y+5.8,sz],.6,.45,"icicle"); fEll(sx+3,y+6,sz,.8,.6,.55,"icicle");
      for(const [lx,lz] of [[1.4,-.5],[1.4,.5],[-1.4,-.5],[-1.4,.5]]) fSeg([sx+lx,y+3,sz+lz],[sx+lx,y+.6,sz+lz],.3,.22,"icicle");
      for(const s of [-1,1]){ fSeg([sx+2.8,y+6.5,sz+.4*s],[sx+2.2,y+8,sz+1*s],.15,.12,"crystal"); fSeg([sx+2.2,y+8,sz+1*s],[sx+1.6,y+9,sz+1.6*s],.13,.1,"crystal"); fSeg([sx+2.2,y+8,sz+1*s],[sx+2.8,y+9,sz+1.4*s],.12,.1,"crystal"); } }
    for(const [sx,sz,s] of [[x-9.5,z+9,1],[x-8,z+10.5,-1]]){ fill(Math.floor(sx)-1,y,Math.floor(sz)-1,Math.floor(sx)+1,y,Math.floor(sz)+1,"iceTrim");
      fEll(sx,y+1.8,sz,1.3,.7,.8,"icicle"); fSeg([sx+.9*s,y+2,sz],[sx+1.1*s,y+3.6,sz],.3,.25,"icicle"); fEll(sx+.8*s,y+3.8,sz,.45,.35,.35,"icicle"); fs(sx+.4*s,y+3.6,sz,"gold"); fEll(sx-.6*s,y+2.3,sz,.8,.5,.9,"crystal"); }
    { const ox=x-10, oz=z-8; fill(ox,y,oz,ox,y+3,oz,"iceTrim"); fEll(ox+.5,y+5,oz+.5,.8,1.1,.75,"icicle"); fEll(ox+.5,y+6.2,oz+.5,.7,.6,.65,"icicle"); for(const s of [-1,1]){ fs(ox+.5+.3*s,y+6.4,oz+1.1,"gold"); fs(ox+.5+.4*s,y+6.9,oz+.5,"icicle"); } }
    // Bänke und Laternen am äußeren Weg
    for(let i=0;i<12;i++){ const an=(i+.5)/12*Math.PI*2, lx=Math.round(x+Math.cos(an)*15.6), lz=Math.round(z+Math.sin(an)*15.6); if(i%2===0){ fill(lx,y,lz,lx,y+2,lz,"silver"); set(lx,y+3,lz,"lamp"); }
      else { const bx=x+.5+Math.cos(an)*12.6, bz=z+.5+Math.sin(an)*12.6; for(let k=-1;k<=1;k++) fs(bx-Math.sin(an)*k*.5, y+.5, bz+Math.cos(an)*k*.5, "carved"); } }
    // gefrorener Wasserfall am Ende des Aquädukts und kleiner Teich mit Bogenbrücke
    { const wx=CX+31, wz=CZ+22, top=HB-3, py=y;
      ellip(wx+1,py,wz-2,4,top-py-2,3,(a,b,c)=> rand()<.35 ? "rock" : "frost");
      for(let a=-2;a<=2;a++) for(let yy=py; yy<=top; yy++){ const f=(top-yy)/(top-py); fs(wx+.5+a*.5+Math.sin(yy*.7+a)*.2, yy, wz+1.5+f*1.5, (a+yy)%3===0 ? "pillar" : "iceBrick2"); fs(wx+.5+a*.5, yy+.5, wz+1.5+f*1.5, "icicle"); }
      for(let a=-4;a<=4;a++) for(let c=0;c<=6;c++){ if(Math.hypot(a/4.5,(c-3)/3.5)<=1) set(wx+a,py-1,wz+3+c,"lakeIce"); }
      for(let i=0;i<=8;i++){ const bx=wx-4+i, by=py+Math.round(Math.sin(i/8*Math.PI)*1.6); set(bx,by,wz+6,"carved"); fs(bx+.5,by+1,wz+5.6,"silver"); fs(bx+.5,by+1,wz+7.4,"silver"); } }
    S.country.top=[x, y+19, z]; S.country.base=y+5; S.country.lift=1; S.country.cam={pos:[x-12,y+22,z+31], look:[x+9,y+5,z-4]}; }

  // ---------- Treppenweg von der Zitadelle zum Frozen Garden ----------
  { const gy = hAt(S.country.x, S.country.z), A0=[CX+22,HB-1,CZ+16], A1=[CX+30,HB-3,CZ+28], A2=[S.country.x-2,gy+2,S.country.z-26], A3=[S.country.x,gy-1,S.country.z-17];
    const segs=[[A0,A1],[A1,A2],[A2,A3]], PW=[]; for(const [a,b] of segs){ const n=Math.ceil(Math.hypot(b[0]-a[0],b[2]-a[2])*2); for(let k=0;k<n;k++){ const f=k/n; PW.push([a[0]+(b[0]-a[0])*f, a[1]+(b[1]-a[1])*f, a[2]+(b[2]-a[2])*f]); } } PW.push(A3);
    let acc=0; PW.forEach((p,i)=>{ const q=PW[Math.min(PW.length-1,i+1)], dx=q[0]-p[0], dz=q[2]-p[2], l=Math.hypot(dx,dz)||1, nx=-dz/l, nz=dx/l, y=Math.round(p[1]);
      for(let w=-2;w<=2;w++){ const X=Math.round(p[0]+nx*w), Z=Math.round(p[2]+nz*w); for(let yy=y+1; yy<y+7; yy++){ const b=get(X,yy,Z); if(b && b!=="iceTrim" && b!=="silver" && b!=="lamp") set(X,yy,Z,null); } set(X,y,Z, Math.abs(w)===2 ? "iceTrim" : "carved"); for(let yy=y-1; yy>y-14 && !get(X,yy,Z); yy--) set(X,yy,Z,"iceBrick"); }
      acc+=l*.5; if(acc>5){ acc=0; for(const w of [-2,2]){ const X=Math.round(p[0]+nx*w), Z=Math.round(p[2]+nz*w); set(X,y+1,Z,"silver"); set(X,y+2,Z,"lamp"); } } });
    S.parkPath = PW; }

  // ---------- vereister Wald rechts vorne ----------
  const pine = (x,z,h) => { const y=hAt(x,z); if(y<L+1 || get(x,y,z) || get(x,y+1,z)) return; fill(x,y,z,x,y+1,z,"bark");
    const tiers = h<7 ? 3 : 4, th = Math.ceil(h/tiers)+1; let yy = y+2;
    for(let t=0;t<tiers;t++){ const R0 = (tiers-t)*.85+.9;
      for(let k=0;k<th;k++){ const r = R0*(1-k/(th+.4)); if(r<.6){ set(x,yy+k,z,"pine"); continue; }
        disk(x,yy+k,z,r,(a,b,c)=>{ const d=Math.hypot(a-x,c-z); return (k===0 && d>r-1.1) ? "snowB" : (d<r-.9 ? "pine" : ((a*3+c*5+b)%4===0 ? "snowB" : "pine")); }); }
      for(let i=0;i<5;i++){ const an=rand()*Math.PI*2; fs(x+.5+Math.cos(an)*(R0-.2), yy+.6, z+.5+Math.sin(an)*(R0-.2), "snowB"); }
      yy += th-1; }
    set(x,yy,z,"pine"); set(x,yy+1,z,"snowB"); fs(x+.5,yy+2,z+.5,"snowB"); if(rand()<.2) fs(x+.5,yy+2.5,z+.5,"lamp"); };
  for(let i=0;i<170;i++){ const x=58+Math.floor(rand()*70), z=50+Math.floor(rand()*56); if(Math.hypot(x-S.country.x,z-S.country.z)<24 || (Math.abs(x-S.country.x+6)<14 && z>S.country.z && z<S.country.z+42)) continue;
    if(S.bridgePts.some(p=>Math.hypot(p[0]-x,p[2]-z)<6) || S.parkPath.some(p=>Math.hypot(p[0]-x,p[2]-z)<5)) continue; pine(x,z,5+Math.floor(rand()*6)); }
  // weitere Bäume am Ufer links und an den Rändern
  for(let i=0;i<70;i++){ const x=-12+Math.floor(rand()*40), z=36+Math.floor(rand()*70); if(lakeF(x,z)<1.3 || Math.hypot(x-S.vocabulary.x,z-S.vocabulary.z)<17) continue; pine(x,z,5+Math.floor(rand()*6)); }
  // Eisschollen und Lichter im See
  for(let i=0;i<40;i++){ const x=Math.floor(rand()*60), z=40+Math.floor(rand()*60); if(lakeF(x,z)>.85) continue; if(rand()<.6) disk(x,L-1,z,1+rand()*1.6,"floorIce"); else fs(x,L-.25,z,"iceGlow"); }

  for(let i=0;i<14;i++){ let cx=Math.floor(rand()*56), cz=44+Math.floor(rand()*56); if(lakeF(cx,cz)>.8) continue;
    for(let k=0;k<26;k++){ if(get(cx,L-1,cz)==="lakeIce") set(cx,L-1,cz,"crackIce"); if(rand()<.5) cx+= rand()<.5?1:-1; else cz+= rand()<.5?1:-1; if(lakeF(cx,cz)>.9) break; } }
  for(let i=0;i<22;i++){ const cx=Math.floor(rand()*60), cz=42+Math.floor(rand()*58); if(lakeF(cx,cz)>.9) continue; const r=1.5+rand()*3;
    for(let a=-r;a<=r;a+=.5) for(let c=-r*.5;c<=r*.5;c+=.5) if((a/r)**2+(c/(r*.5))**2<=1 && lakeF(cx+a,cz+c)<.95) fs(cx+a,L,cz+c,"snowB"); }
  const boulder = (bx,bz,r) => { const y=hAt(bx,bz); if(get(bx,y+1,bz)) return; ellip(bx,y,bz,r,r*.7,r*.85,"rock"); for(let a=-Math.ceil(r);a<=Math.ceil(r);a++) for(let c=-Math.ceil(r);c<=Math.ceil(r);c++){ const t=topAt(bx+a,bz+c,y+r+2); if(t>=y && get(bx+a,t,bz+c)==="rock" && rand()<.85) set(bx+a,t+1,bz+c,"snowB"); } };
  for(let i=0;i<34;i++){ const bx=-10+Math.floor(rand()*136), bz=30+Math.floor(rand()*76); if(lakeF(bx,bz)<1.15 || Math.hypot(bx-S.country.x,bz-S.country.z)<22 || Math.hypot(bx-S.vocabulary.x,bz-S.vocabulary.z)<12 || hillD(bx,bz)<36) continue;
    if(S.bridgePts.some(p=>Math.hypot(p[0]-bx,p[2]-bz)<4)) continue; boulder(bx,bz,1.2+rand()*1.6); }

  // ---------- Landschaft bis zum Horizont: See links hinten, verschneite Berge ----------
  const Fr = A.far; Fr.cell = 3;
  const peaks = [[-110,-190,80,80],[-40,-220,90,95],[30,-240,80,85],[-180,-120,60,60],[150,-230,70,70],[220,-160,50,45],[-70,-150,50,50],[90,-260,70,75]];
  // Bergkranz rundherum (links, rechts, hinten), damit man beim Drehen überall Berge sieht
  for(let i=0;i<22;i++){ const an = Math.PI*(.05 + i/21*.9), R = 230 + (i%3)*35; peaks.push([W/2 - Math.cos(an)*R*1.15, D/2 - Math.sin(an)*R*.9 + 40, 70+(i*37)%40, 85+(i*53)%70]); }
  for(const [px,pz,r,h] of [[-200,80,70,90],[-230,170,80,100],[W+200,70,70,95],[W+230,170,80,105],[-150,240,60,70],[W+150,250,60,75]]) peaks.push([px,pz,r,h]);
  const fh = (x,z) => { let h = G + (fbm(x*.03,z*.03)-.5)*6 + (x>62 && z>52 ? 1.5+fbm(x*.05,z*.05)*3 : 0);
    for(const [px,pz,r,hh] of peaks){ const d=Math.hypot(x-px,z-pz)/r; if(d<1){ const v = hh*Math.pow(1-d,1.35)*(.75+.5*fbm(x*.05,z*.05)); if(v>h) h=v; } } return h; };
  const steep = (x,z) => Math.max(Math.abs(fh(x+3,z)-fh(x-3,z)), Math.abs(fh(x,z+3)-fh(x,z-3)))/6 + (fbm(x*.04,z*.04)-.5)*.8;
  A.farTerrain({ x0:-330, x1:W+330, z0:-320, z1:D+260, base:0, skip:(x,z)=> (x>-35 && x<W+15 && z>-27 && z<D+15) || (lakeB(x,z)<1.3 && x<44),
    h: fh, top:(x,z,y,hc)=> steep(x,z) > 1.5 ? "rock" : "snowB", fill:(x,z,y,hc)=> steep(x,z) > 1.25 ? "rock" : "snowB" });

  // ferne verschneite Nadelbäume in der Ebene (grobe Blöcke)
  const fset = (x,y,z,t) => Fr.set(Math.floor(x/3),Math.floor(y/3),Math.floor(z/3),t);
  for(let i=0;i<900;i++){ const x=-200+rand()*440, z=-150+rand()*300; if(x>-15 && x<W+15 && z>-15 && z<D+15) continue; if(z>D+8) continue; if(lakeB(x,z)<1.45 && x<46) continue; if(fbm(x*.025,z*.025)<.5) continue;
    const b=fh(x,z); if(b>36) continue; const cx=Math.floor(x/3), cz=Math.floor(z/3), cy=Math.floor(b/3);
    for(const [a,c] of [[0,0],[1,0],[-1,0],[0,1],[0,-1]]) Fr.set(cx+a,cy+1,cz+c,"pine"); Fr.set(cx,cy,cz,"bark"); Fr.set(cx,cy+2,cz,"pine"); Fr.set(cx,cy+3,cz,"snowB"); }

  // ---------- Tiere ----------
  const HOLE=[5,38];
  for(let a=-9;a<=4;a++) for(let c=-5;c<=5;c++) for(let yy=L; yy<L+20; yy++){ const b=get(HOLE[0]+a,yy,HOLE[1]+c); if(b==='pine'||b==='bark'||(b==='snowB' && yy>hAt(HOLE[0]+a,HOLE[1]+c))) set(HOLE[0]+a,yy,HOLE[1]+c,null); } for(let a=-2;a<=2;a++) for(let c=-2;c<=2;c++){ const d=Math.hypot(a,c); if(d<=1.3) set(HOLE[0]+a,L-1,HOLE[1]+c,null); }
  for(let i=0;i<14;i++){ const an=i/14*Math.PI*2; fs(HOLE[0]+.5+Math.cos(an)*1.9, L-.25, HOLE[1]+.5+Math.sin(an)*1.9, i%3?"snowB":"floorIce"); }
  // Weg der Eisfüchse: über den hinteren See und hinter der Zitadelle entlang (verschwinden dort)
  const foxPath = []; for(let px=-24; px<=118; px+=2){ const pz = px<34 ? 4-(px+24)*.33 : -17 + Math.sin(px*.15)*1.5, ground = hAt(Math.round(px),Math.round(pz)); foxPath.push([px, ground<L ? L : ground, pz]); }
  const creatures = [
    { ...polarBear({fish:true}), at:[HOLE[0]-4.6, L, HOLE[1]+.5], yaw:0, scale:.36 },
    { ...frostFox({walk:true, speed:13}), path:{pts:foxPath, speed:4.2, pause:5, ph:0}, scale:.26 },
    { ...frostFox({walk:true, speed:13, col:0xF4FAFF}), path:{pts:foxPath.map(p=>[p[0],p[1],p[2]+1.6]), speed:4.6, pause:3, ph:.12}, scale:.23 },
    { ...frostFox({walk:true, speed:12}), path:{pts:foxPath.map(p=>[p[0],p[1],p[2]-1.5]), speed:3.8, pause:7, ph:.55}, scale:.24 },
    { ...frostFox({walk:false}), at:[S.vocabulary.x+6, hAt(S.vocabulary.x,S.vocabulary.z)+1, S.vocabulary.z+6], yaw:-.6, scale:.24 },
    { ...stag({graze:true, phase:0}), orbit:{c:[S.country.x-5, hAt(S.country.x-5,S.country.z+25), S.country.z+25], r:[1.6,1.2], speed:.35, ph:0, bob:0, cycle:[40,.15,6]}, scale:.24, clearR:2 },
    { ...stag({graze:true, phase:9}), orbit:{c:[S.country.x+3, hAt(S.country.x+3,S.country.z+29), S.country.z+29], r:[1.4,1.6], speed:.35, ph:2, bob:0, dir:-1, cycle:[44,.14,25]}, scale:.21, clearR:2 }
  ];
  for(let i=0;i<3;i++) creatures.push({ ...bird(0xFFFFFF), orbit:{c:[70+i*6,46+i*3,50], r:[46,30], speed:.09, ph:i*1.9, bob:1.5}, scale:.65, noShadow:true });
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
            {pos:[S.vocabulary.x,hAt(S.vocabulary.x,S.vocabulary.z)+18,S.vocabulary.z], color:0x8AD8FF, int:380, dist:40, flicker:1200},
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
