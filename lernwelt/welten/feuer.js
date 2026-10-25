// Klasse 5 · Fire Island – Stadt auf Felssäulen im Lavameer (nach Seáns Vorlagebild):
// vorne der große Kuppelpalast (Grammar), links der Kuppelturm (Vocabulary), rechts der Turm mit Spitztürmchen (Country & people),
// dahinter die gotische Burg vor dem Vulkan, Brücken zwischen den Säulen, Lavafälle, schwebende Inseln mit Rauch, Drache, Menschen und Orks.
import { dragon, person } from "./tiere.js";
export function build(A){
  const { rand, fbm, pick, set, get, fill, walls, disk, ring, cyl, ball, cone, line, topAt, tex, P, noise, stripes, bricks, rings, planks } = A;
  const T = {
    rock: noise(["#2A2224","#33292A","#241C1E","#3C302E","#2E2526"], 8, ["#4A3A36"]),
    rock2: noise(["#3A2E2C","#45383A","#30262A","#4E4040"], 6, ["#5A4844"]),
    basaltS: stripes(["#3E3A40","#35323A","#46424A","#3A363E"], true, "#2A2830"),
    basaltT: rings(["#46424A","#3A363E","#4E4A52","#34303A"]),
    magma: tex(g=>{ for(let x=0;x<16;x++) for(let y=0;y<16;y++) P(g,x,y,pick(["#3A100A","#4A160C","#300C08"]));
      for(let k=0;k<5;k++){ let x=Math.floor(rand()*16), y=Math.floor(rand()*16); for(let s=0;s<9;s++){ P(g,x,y,pick(["#FF7A1A","#FFA030","#FF5A10"])); x=(x+(rand()<.5?1:15))%16; y=(y+(rand()<.5?1:0))%16; } } }),
    lava: tex(g=>{ for(let x=0;x<16;x++) for(let y=0;y<16;y++){ const v=Math.sin(x*.9+y*.35)+Math.sin(y*.8-x*.3)+rand()*.6; P(g,x,y, v>1.2?"#FFE06A":v>.3?"#FFA82A":v>-.6?"#FF6A0A":"#E0480A"); } }),
    lavaSea: tex(g=>{ for(let x=0;x<16;x++) for(let y=0;y<16;y++){ const v=Math.sin(x*.7+y*.45)+Math.sin(y*.9-x*.4)+rand()*.5; P(g,x,y, v>1.5?"#FFB02E":v>.9?"#F0600E":v>0?"#8A2408":"#4A1006"); } }),
    stone: bricks(["#4A3C38","#544440","#42363A","#5A4A44"], "#241A1A", 4, 8),
    stoneD: bricks(["#3A302E","#443836","#342A2A"], "#1A1212", 4, 8),
    trim: tex(g=>{ for(let y=0;y<16;y++) for(let x=0;x<16;x++){ const e=y<2||y>13; P(g,x,y, e?"#2A1E1C":(x%4===0?"#5A4844":"#6A5650")); } }),
    slate: tex(g=>{ for(let y=0;y<16;y++) for(let x=0;x<16;x++){ const r=Math.floor(y/3), off=(r%2)*2; P(g,x,y, y%3===2 ? "#141418" : ((x+off)%4===0 ? "#24242C" : pick(["#2E2E38","#34343E","#2A2A32"]))); } }),
    dome: tex(g=>{ for(let y=0;y<16;y++) for(let x=0;x<16;x++) P(g,x,y, x%5===0 ? "#4A4A56" : pick(["#24242E","#2A2A34","#20202A"])); }),
    gold: noise(["#E8B040","#FFD060","#D89A30","#F5C24A"]),
    win: tex(g=>{ for(let x=0;x<16;x++) for(let y=0;y<16;y++){ const arch = y<6 && Math.hypot(x-7.5,6-y)>5.6; const fr = arch || x<2||x>13||y>13||x===7||x===8||y===9; P(g,x,y, fr?"#2A1E1C":pick(["#FFC05A","#FFD27A","#FFB040","#FFCA6A"])); } }),
    winS: tex(g=>{ for(let x=0;x<16;x++) for(let y=0;y<16;y++){ const fr = x<4||x>11||y<3||y>12||y===7; P(g,x,y, fr?"#3A2C28":pick(["#FFB848","#FFD27A"])); } }),
    door: tex(g=>{ for(let x=0;x<16;x++) for(let y=0;y<16;y++){ const v=y/16; P(g,x,y, rand()<.08 ? "#FFF0C0" : v<.3?"#FFE2A0":v<.7?"#FFC060":"#F09A30"); } }),
    glow: noise(["#FFD27A","#FFB84A","#FFE6A8","#F0A030"], 10, ["#A8642A"]),
    wood: planks(["#5A3A26","#6A4630","#4E3220"], "#2A1A10"), beam: stripes(["#3A2618","#45301E","#2E1E12"], true),
    iron: noise(["#2A2A30","#34343A","#24242A"]),
    rail: tex(g=>{ for(let x=0;x<16;x++) for(let y=0;y<16;y++) P(g,x,y,(y<3||x%5===0)?"#2A2A30":"rgba(0,0,0,0)"); }),
    banner: noise(["#9A1E14","#AA2618","#8A1A10"]),
    winV: tex(g=>{ for(let x=0;x<16;x++) for(let y=0;y<16;y++){ const arch = y<6 && Math.hypot(x-7.5,6-y)>5.6; const fr = arch || x<2||x>13||y>13||x===7||x===8||y===9; P(g,x,y, fr?"#2A1E1C":pick(["#C890FF","#E0B0FF","#B070FF","#D8A0FF"])); } }),
    winR: tex(g=>{ for(let x=0;x<16;x++) for(let y=0;y<16;y++){ const arch = y<6 && Math.hypot(x-7.5,6-y)>5.6; const fr = arch || x<2||x>13||y>13||x===7||x===8||y===9; P(g,x,y, fr?"#2A1E1C":pick(["#FF7A8A","#FF9AA6","#FF5A70","#FFB0B8"])); } }),
    copper: tex(g=>{ for(let y=0;y<16;y++) for(let x=0;x<16;x++) P(g,x,y, x%4===0 ? "#5A1A1A" : pick(["#8A2A22","#9A3428","#7A2018"])); }),
    goldDome: tex(g=>{ for(let y=0;y<16;y++) for(let x=0;x<16;x++) P(g,x,y, x%4===0 ? "#8A5A18" : pick(["#D8A030","#E8B840","#C89028"])); }),
    shelf: tex(g=>{ for(let y=0;y<16;y++) for(let x=0;x<16;x++){ const band=y<2||y>13||y===7||y===8; P(g,x,y, band?pick(["#4A2A1A","#5A3420"]):(x%3===2?"#1A0E08":["#C8413A","#3E63DD","#E9A81C","#3FA34D","#7C5CFF"][((x/3|0)+(y>8?2:0))%5])); } }),
    crystal: tex(g=>{ for(let x=0;x<16;x++) for(let y=0;y<16;y++){ const d=(x+y)%6; P(g,x,y, d===0?"#FFE0F0":d<3?"#FF6AA0":"#C0306A"); } }),
    stem: stripes(["#5A1E36","#6E2644","#4A162C","#7A3050"], true, "#3A1022"), wart: noise(["#8A0E14","#A0161C","#740A10","#B0242A","#960F18"]),
    tentR: tex(g=>{ for(let y=0;y<16;y++) for(let x=0;x<16;x++) P(g,x,y, (Math.floor(x/4)%2) ? "#F2EBE2" : "#C8302A"); }),
    tentY: tex(g=>{ for(let y=0;y<16;y++) for(let x=0;x<16;x++) P(g,x,y, (Math.floor(x/4)%2) ? "#F2EBE2" : "#E8A81C"); }),
    clock: tex(g=>{ for(let x=0;x<16;x++) for(let y=0;y<16;y++){ const d=Math.hypot(x-7.5,y-7.5); P(g,x,y, d>7.4?"rgba(0,0,0,0)": d>6.3?"#C89028":(Math.abs(x-7.5)<.8&&y<8&&y>2)||(Math.abs(y-7.5)<.8&&x>7&&x<12)?"#1A1A1A":"#FFF2D0"); } })
  };
  const blocks = {
    rock:{side:T.rock}, rock2:{side:T.rock2}, basalt:{side:T.basaltS, top:T.basaltT}, magma:{side:T.magma, em:.9},
    lava:{side:T.lava, em:1.3, anim:[.11,.07]}, lavaFall:{side:T.lava, em:1.45, anim:[0,-.5], soft:true},
    stone:{side:T.stone}, stoneD:{side:T.stoneD}, trim:{side:T.trim, top:T.stoneD}, slate:{side:T.slate}, dome:{side:T.dome},
    gold:{side:T.gold, em:.35}, win:{side:T.win, em:1.05}, winS:{side:T.winS, em:.95}, door:{side:T.door, em:.85},
    glow:{side:T.glow, em:1.3}, lamp:{side:T.glow, em:1.5, halo:[0xFFA040,3.2,.55]}, wood:{side:T.wood}, beam:{side:T.beam, top:T.wood},
    iron:{side:T.iron}, rail:{side:T.rail, alpha:.98, cross:true}, banner:{side:T.banner},
    winV:{side:T.winV, em:1.1}, winR:{side:T.winR, em:1.05}, copper:{side:T.copper}, goldDome:{side:T.goldDome, em:.25}, shelf:{side:T.shelf, em:.25},
    crystal:{side:T.crystal, em:1.2, halo:[0xFF5A9A,3,.5]}, stem:{side:T.stem}, wart:{side:T.wart}, tentR:{side:T.tentR}, tentY:{side:T.tentY}, clock:{side:T.clock, em:.5, alpha:.99},
    vlamp:{side:T.glow, em:1.5, halo:[0xB070FF,3.4,.6]}, ylamp:{side:T.glow, em:1.5, halo:[0xFFD040,3.6,.6]}
  };
  const F = A.fine, fs = (x,y,z,t) => F.set(Math.round(x*2),Math.round(y*2),Math.round(z*2),t);
  const W=120, D=96, SEA=0;

  // ---------- Felssäulen ----------
  // Säule: unten schmaler, oben breit wie ein Tafelberg, mit Glutadern und einem Lavafall
  const pillar = (cx,cz,top,r,o={}) => { const bot = o.bot ?? SEA-2;
    for(let y=bot; y<top; y++){ const t=(y-bot)/(top-bot), rr = r*(o.taper ?? (.62+.38*Math.pow(t,.7)));
      for(let x=Math.floor(cx-rr-3); x<=cx+rr+3; x++) for(let z=Math.floor(cz-rr-3); z<=cz+rr+3; z++){
        const a=Math.atan2(z-cz,x-cx), wob = 1 + .18*Math.sin(a*5+cx) + .12*Math.sin(a*11+y*.35+cz) + (fbm(x*.2+y*.07,z*.2)-.5)*.35;
        const d=Math.hypot(x-cx,z-cz); if(d<=rr*wob){ const edge = d>rr*wob-1.3; set(x,y,z, edge && rand()<.05 ? "magma" : (y%6===0 && edge ? "rock2" : (rand()<.25?"rock2":"rock"))); } } }
    // Plattform oben
    for(let x=Math.floor(cx-r-2); x<=cx+r+2; x++) for(let z=Math.floor(cz-r-2); z<=cz+r+2; z++){ if(get(x,top-1,z)) set(x,top-1,z, "stoneD"); }
    // Lavafälle
    for(const [ang, w] of (o.falls||[])){ const fx = Math.round(cx + Math.cos(ang)*(r+.6)), fz = Math.round(cz + Math.sin(ang)*(r+.6));
      for(let y=SEA; y<top-(o.fallDrop??3); y++) for(let k=0;k<w;k++){ const xx=fx+Math.round(-Math.sin(ang)*k), zz=fz+Math.round(Math.cos(ang)*k);
        // an der Wand entlang nach außen schieben, bis Luft ist
        let px=xx, pz=zz; for(let s=0;s<4 && get(px,y,pz) && get(px,y,pz)!=="lavaFall"; s++){ px=Math.round(px+Math.cos(ang)); pz=Math.round(pz+Math.sin(ang)); } set(px,y,pz,"lavaFall"); }
      fallFoot.push([fx,fz]); } };
  const fallFoot = [];

  // ---------- Bausteine ----------
  const windowsRing = (cx,y,cz,r,step=2,wt="win") => { for(let x=Math.floor(cx-r-1);x<=cx+r+1;x++) for(let z=Math.floor(cz-r-1);z<=cz+r+1;z++){ const d=Math.hypot(x-cx,z-cz); if(d<=r+.3 && d>r-.7){ const a=Math.atan2(z-cz,x-cx); if(Math.round(a*r/step*1.0)%2===0){ set(x,y,z,wt); set(x,y+1,z,wt); } } } };
  const towerRound = (cx,y0,cz,r,h,o={}) => { for(let y=y0;y<y0+h;y++) ring(cx,y,cz,r,(xx,yy)=> (yy-y0)%5===4 ? "trim" : "stone");
      for(let y=y0+1;y<y0+h-1;y+=5) windowsRing(cx,y,cz,r,o.wstep||2,o.win||"win");
      disk(cx,y0+h-1,cz,r,"stoneD"); return y0+h; };
  // Kuppel aus Blöcken, mit Rippen und Laterne
  const domeAt = (cx,y0,cz,r,o={}) => { const rib = o.ribs ?? 8;
    for(let yy=0; yy<=r; yy++){ const rr = Math.sqrt(Math.max(0,r*r-yy*yy))*(o.squash||1);
      for(let x=Math.floor(cx-rr-1);x<=cx+rr+1;x++) for(let z=Math.floor(cz-rr-1);z<=cz+rr+1;z++){ const d=Math.hypot(x-cx,z-cz); if(d<=rr+.3 && d>rr-1.3){ const a=Math.atan2(z-cz,x-cx); set(x,y0+yy,z, yy===0 ? "trim" : (Math.abs(Math.sin(a*rib/2))<.05 && yy>1 && yy<r-1 ? (o.rib||"trim") : (o.mat||"dome"))); } } }
    const ty = y0 + Math.round(r*(o.squash||1)) + 1;
    // Laterne obendrauf
    if(o.lantern!==false){ for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]) set(cx+a,ty,cz+b,o.win||"win"); set(cx,ty,cz,"glow"); set(cx,ty+1,cz,o.mat||"dome"); set(cx,ty+2,cz,"gold"); fs(cx,ty+3,cz,"gold"); fs(cx,ty+3.5,cz,o.lamp||"lamp"); return ty+4; }
    return ty; };
  // Spitzturm (gotisch): quadratischer Schaft, spitzer Helm
  const spire = (cx,y0,cz,s,h,helm) => { for(let y=y0;y<y0+h;y++) for(let a=-s;a<=s;a++) for(let b=-s;b<=s;b++){ if(Math.abs(a)!==s&&Math.abs(b)!==s) continue; const c=Math.abs(a)===s&&Math.abs(b)===s;
      set(cx+a,y,cz+b, c ? "stoneD" : ((y-y0)%4===2 && (a===0||b===0) ? "winS" : "stone")); }
    for(let k=0;k<helm;k++){ const rr = Math.max(0, s+1 - k*(s+1)/helm); for(let a=-Math.ceil(rr);a<=Math.ceil(rr);a++) for(let b=-Math.ceil(rr);b<=Math.ceil(rr);b++) if(Math.max(Math.abs(a),Math.abs(b))<=rr+.2 && (Math.max(Math.abs(a),Math.abs(b))>rr-1)) set(cx+a,y0+h+k,cz+b,"slate"); }
    set(cx,y0+h+helm,cz,"gold"); return y0+h+helm; };
  // Mehrgeschossiger Bau mit Arkadenfenstern, Gesimsen und Satteldach
  const hall = (x0,y0,z0,w,d,fl,o={}) => { const x1=x0+w-1, z1=z0+d-1, fh=o.fh||4;
    for(let f=0; f<fl; f++){ const y=y0+f*fh;
      for(let yy=y; yy<y+fh; yy++) for(let x=x0;x<=x1;x++) for(let z=z0;z<=z1;z++){ if(x!==x0&&x!==x1&&z!==z0&&z!==z1) continue;
        const corner=(x===x0||x===x1)&&(z===z0||z===z1), band=yy===y+fh-1;
        let t = corner ? "stoneD" : band ? "trim" : "stone";
        if(!corner && !band && yy>y && yy<y+fh-1){ const along = (z===z0||z===z1) ? x-x0 : z-z0; if(along%3!==0) t = (o.win && f===fl-1) ? o.win : "win"; }
        set(x,yy,z,t); }
      // Balkon-Gesims
      if(f>0) for(let x=x0-1;x<=x1+1;x++){ set(x,y-1,z1+1,"trim"); if(x%2===0) fs(x+.25,y-.25,z1+1.25,"iron"); } }
    const yt=y0+fl*fh; fill(x0,yt-1,z0,x1,yt-1,z1,"stoneD");
    if(o.roof!==false){ const half=Math.ceil(d/2); for(let k=0;k<=half;k++){ for(let x=x0-1;x<=x1+1;x++){ set(x,yt+k,z0-1+k,"slate"); set(x,yt+k,z1+1-k,"slate"); } for(const x of [x0-1,x1+1]) for(let z=z0+k;z<=z1-k;z++) set(x,yt+k,z,"stone"); }
      // Gauben
      for(let x=x0+2;x<x1-1;x+=4){ set(x,yt+1,z1,"winS"); set(x,yt+2,z1-1,"slate"); } }
    return yt; };
  const door = (x,y,z,dz=1) => { set(x,y,z,"door"); set(x,y+1,z,"door"); set(x+1,y,z,"door"); set(x+1,y+1,z,"door"); fs(x+.5,y+2.25,z+dz*.75,"gold"); };
  const lantern = (x,y,z) => { fill(x,y,z,x,y+2,z,"iron"); set(x,y+3,z,"lamp"); };
  const banner = (x,y,z,h) => { for(let k=0;k<h;k++) fs(x,y-k*.5,z,"banner"); fs(x,y-h*.5,z,"gold"); };

  const S = {
    grammar:   {x:60, z:52, col:0xB56CFF, ort:"Ember Palace"},
    vocabulary:{x:24, z:60, col:0xFF4A6A, ort:"Dome Library"},
    country:   {x:98, z:58, col:0xFFE14A, ort:"Ember Market Tower"}
  };

  // ---------- Grammar: großer Kuppelpalast (Gold-Violett) ----------
  { const {x,z}=S.grammar, top=26; pillar(x,z,top,14,{falls:[[Math.PI/2+.25,3],[Math.PI*.15,2],[Math.PI*.85,2]]});
    const y=top; fill(x-12,y-1,z-10,x+12,y-1,z+11,"stoneD");
    hall(x-12,y,z-7,8,11,3,{win:"winV"}); hall(x+5,y,z-7,8,11,3,{win:"winV"});          // Flügel, 3 Geschosse
    const yt = hall(x-5,y,z-8,11,13,4,{roof:false, win:"winV"});                           // Mittelbau, 4 Geschosse
    for(let k=0;k<3;k++) fill(x-3,y-1,z+5+k,x+3,y-1,z+5+k,"stoneD");
    door(x-1,y,z+4); for(const a of [-3,3]){ fill(x+a,y,z+5,x+a,y+3,z+5,"trim"); set(x+a,y+4,z+5,"vlamp"); }
    // Balkone rund um den Mittelbau
    for(const yy of [y+4,y+8,y+12]) for(let a=-6;a<=6;a++){ set(x+a,yy-1,z+5,"trim"); fs(x+a,yy+.25,z+5.75,"iron"); }
    const ty = towerRound(x,yt,z-1.5,4.5,6,{wstep:1.3, win:"winV"}); S.grammar.top=[x, domeAt(x,ty,z-1.5,6,{ribs:12, rib:"gold", win:"winV", lamp:"vlamp"}), z-1.5];
    for(const [a,b] of [[-5,-8],[5,-8],[-5,4],[5,4]]){ const t2 = towerRound(x+a,yt,z+b,1.6,4,{wstep:3, win:"winV"}); domeAt(x+a,t2,z+b,2,{ribs:4, lamp:"vlamp"}); }
    for(const a of [-8,8]) spire(x+a,y+12+3,z-2,1,5,6);
    for(const a of [-10,-6,6,10]) banner(x+a,y+9,z+4.75,8);
    for(const [a,b] of [[-11,9],[11,9],[-6,10],[6,10]]) { fill(x+a,y,z+b,x+a,y+2,z+b,"iron"); set(x+a,y+3,z+b,"vlamp"); }
    S.grammar.base=y; S.grammar.lift=1; S.grammar.cam={pos:[x+20,y+22,z+84], look:[x+15,y+16,z-2]}; }

  // ---------- Vocabulary: schlanker Bibliotheksturm mit Kupferkuppel, rosa Kristallen und Purpurpilzen ----------
  { const {x,z}=S.vocabulary, top=26; pillar(x,z,top,8,{falls:[[Math.PI/2-.2,2]]});
    const y=top; ring(x,y,z,7.5,"trim");
    // Riesenpilze am Rand der Säule
    const fungus = (fx,fy,fz,hh,r) => { fill(fx,fy,fz,fx,fy+hh,fz,"stem"); for(let a=-r;a<=r;a++) for(let b=-r;b<=r;b++){ const d=Math.hypot(a,b); if(d<=r+.3){ set(fx+a,fy+hh+1,fz+b,"wart"); if(d<r-.8) set(fx+a,fy+hh+2,fz+b,"wart"); if(d>r-.8 && rand()<.3) set(fx+a,fy+hh,fz+b,"crystal"); } } };
    fungus(x-6,y,z+3,6,2); fungus(x+6,y,z-4,8,3); fungus(x+5,y,z+5,4,2);
    let t = y;
    for(let k=0;k<3;k++){ for(let yy=t;yy<t+6;yy++) ring(x,yy,z,4.6-k*.5,(xx,y2)=> (y2-t)===5 ? "trim" : ((y2-t)%3===1 ? "shelf" : "stone")); windowsRing(x,t+2,z,4.6-k*.5,1.4,"winR"); t+=6;
      ring(x,t,z,5.8-k*.5,"trim"); for(let a=0;a<18;a++){ const an=a/18*Math.PI*2; fs(x+Math.cos(an)*(6-k*.5),t+.75,z+Math.sin(an)*(6-k*.5),"iron"); } }   // drei Galerien
    S.vocabulary.top=[x, domeAt(x,t,z,4,{ribs:8, mat:"copper", rib:"gold", win:"winR"}), z];
    // schwebende Bücher und Kristalle rund um den Turm
    for(let i=0;i<14;i++){ const an=i/14*Math.PI*2+.3, rr=7+rand()*2, hy=y+6+rand()*14; fs(x+Math.cos(an)*rr,hy,z+Math.sin(an)*rr, i%3===0?"crystal":"shelf"); fs(x+Math.cos(an)*rr+.5,hy,z+Math.sin(an)*rr,"shelf"); }
    door(x-1,y,z+5); for(const a of [-3,3]){ fill(x+a,y,z+6,x+a,y+2,z+6,"iron"); set(x+a,y+3,z+6,"crystal"); }
    S.vocabulary.base=y; S.vocabulary.lift=1; S.vocabulary.cam={pos:[x+30,y+20,z+66], look:[x+15,y+14,z]}; }

  // ---------- Country & people: Markt-Turm mit goldener Kuppel, Uhr, Spitztürmen und bunten Zelten ----------
  { const {x,z}=S.country, top=26; pillar(x,z,top,10,{falls:[[Math.PI/2+.35,3]]});
    const y=top; ring(x,y,z,9.5,"trim");
    // quadratischer Turm
    const s0=4; let t=y;
    for(let yy=y;yy<y+16;yy++) for(let a=-s0;a<=s0;a++) for(let b=-s0;b<=s0;b++){ if(Math.abs(a)!==s0&&Math.abs(b)!==s0) continue; const c=Math.abs(a)===s0&&Math.abs(b)===s0;
      set(x+a,yy,z+b, c ? "stoneD" : (yy-y)%4===3 ? "trim" : ((yy-y)%4===1 && (a+b)%2===0 ? "win" : "stone")); }
    t=y+16; fill(x-s0-1,t,z-s0-1,x+s0+1,t,z+s0+1,"trim");
    // Uhr vorne
    for(let u=-1.5;u<=1.5;u+=.5) for(let v=-1.5;v<=1.5;v+=.5){ if(Math.hypot(u,v)<=1.8) fs(x+u,t-3+v,z+s0+.75, Math.hypot(u,v)>1.4 ? "gold" : (Math.abs(u)<.3&&v>=0)||(Math.abs(v)<.3&&u>=0&&u<1.1) ? "iron" : "glow"); }
    for(const [a,b] of [[-s0,-s0],[s0,-s0],[-s0,s0],[s0,s0]]) spire(x+a,t+1,z+b,0,3,6);
    t = towerRound(x,t+1,z,3,5,{wstep:1.2});
    S.country.top=[x, domeAt(x,t,z,3.6,{ribs:8, mat:"goldDome", rib:"trim", lamp:"ylamp"}), z];
    // bunte Marktzelte rund um den Turm
    const tent = (cx,cz,tt) => { for(let hh=0;hh<3;hh++) for(let a=-(2-hh);a<=2-hh;a++) fill(cx+a,y+2+hh,cz-1,cx+a,y+2+hh,cz+1,tt); for(const [a,b] of [[-2,-1],[2,-1],[-2,1],[2,1]]) fill(cx+a,y,cz+b,cx+a,y+1,cz+b,"beam"); fs(cx,y+.25,cz,"gold"); fs(cx+.5,y+.25,cz,"banner"); };
    tent(x-7,z+3,"tentR"); tent(x+7,z+3,"tentY"); tent(x-6,z-6,"tentY"); tent(x+7,z-5,"tentR");
    // Wimpelketten
    for(const [a0,a1] of [[-7,0],[0,7]]) for(let k=0;k<=8;k++){ const fx=x+a0+(a1-a0)*k/8, fy=y+6-Math.sin(k/8*Math.PI)*1.2; fs(fx,fy,z+6.5, k%2?"tentY":"banner"); }
    for(const a of [-4,4]){ fill(x+a,y,z+8,x+a,y+2,z+8,"iron"); set(x+a,y+3,z+8,"ylamp"); }
    S.country.base=y; S.country.lift=1; S.country.cam={pos:[x+2,y+20,z+70], look:[x+15,y+14,z]}; }

  // ---------- Brücken ----------
  // Brücke von a nach b (Deck + Geländer, darunter Bögen/Streben), sanft durchhängend
  const bridge = (a,b,o={}) => { const n=Math.ceil(Math.hypot(b[0]-a[0],b[2]-a[2])), dx=(b[0]-a[0])/n, dz=(b[2]-a[2])/n, nx=-dz, nz=dx, l=Math.hypot(nx,nz); const px=nx/l, pz=nz/l;
    for(let i=0;i<=n;i++){ const t=i/n, sag = o.arch ? -Math.sin(t*Math.PI)*o.arch : 0, x=a[0]+dx*i, z=a[2]+dz*i, y=Math.round(a[1]+(b[1]-a[1])*t - sag);
      for(const s of [-1,0,1]) set(Math.round(x+px*s), y, Math.round(z+pz*s), o.deck||"wood");
      for(const s of [-1.6,1.6]){ fs(x+px*s, y+1, z+pz*s, "iron"); fs(x+px*s, y+1.5, z+pz*s, "iron"); if(i%2===0) fs(x+px*s, y+.5, z+pz*s, "iron"); }
      if(o.truss && i%3===0){ for(let k=1;k<=o.truss;k++) for(const s of [-1,1]) fs(x+px*s*1.2, y-k*.5, z+pz*s*1.2, "iron"); }
      if(i%6===3 && o.lamps!==false) fs(x+px*1.6, y+2, z+pz*1.6, "lamp"); } };
  const BR = { r:[[S.grammar.x+12,25,S.grammar.z+4],[S.country.x-9,25,S.country.z+4]], l:[[S.vocabulary.x+8,25,S.vocabulary.z+2],[S.grammar.x-12,25,S.grammar.z+5]], f:[[6,11,90],[S.grammar.x-10,25,S.grammar.z+10]] };
  bridge(...BR.r,{truss:5}); bridge(...BR.l,{truss:4}); bridge(...BR.f,{truss:5});
  // Bogen unter den Brücken
  for(const k of ["r","l"]){ const [a,b]=BR[k]; for(let i=0;i<=20;i++){ const t=i/20, x=a[0]+(b[0]-a[0])*t, z=a[2]+(b[2]-a[2])*t, dy=Math.round(Math.sin(t*Math.PI)*5); for(let y=a[1]-6; y<a[1]-6+dy; y++) if(Math.abs(t-.5)<.46) set(Math.round(x),y,Math.round(z),"stoneD"); } }

  // ---------- Vordergrund: Felskante mit Holzhütten (links), Felsen (rechts) ----------
  const ledge = (cx,cz,top,r) => { for(let y=SEA-2;y<top;y++){ const rr=r*(.8+.2*(y-SEA)/(top-SEA)); for(let x=Math.floor(cx-rr-2);x<=cx+rr+2;x++) for(let z=Math.floor(cz-rr-2);z<=cz+rr+2;z++){ const a=Math.atan2(z-cz,x-cx); if(Math.hypot(x-cx,z-cz)<=rr*(1+.2*Math.sin(a*4+y*.3))) set(x,y,z, rand()<.3?"rock2":"rock"); } } };
  ledge(4,92,12,10); ledge(118,90,10,9); ledge(-6,74,16,7);
  const crag = (cx,cz,h,r) => { for(let y=SEA-2;y<h;y++){ const t=(y-SEA)/(h-SEA), rr=r*(1-t*.75); for(let x=Math.floor(cx-rr-2);x<=cx+rr+2;x++) for(let z=Math.floor(cz-rr-2);z<=cz+rr+2;z++){ const an=Math.atan2(z-cz,x-cx); if(Math.hypot(x-cx,z-cz)<=rr*(1+.25*Math.sin(an*3+y*.4+cx))) set(x,y,z, rand()<.04?"magma":rand()<.3?"rock2":"rock"); } } };
  crag(-14,104,26,9); crag(134,102,30,10); crag(126,86,18,6); crag(-18,90,20,6);
  const hut = (x0,y,z0,w,d) => { for(let yy=y;yy<y+4;yy++) for(let x=x0;x<x0+w;x++) for(let z=z0;z<z0+d;z++){ if(x!==x0&&x!==x0+w-1&&z!==z0&&z!==z0+d-1) continue; const c=(x===x0||x===x0+w-1)&&(z===z0||z===z0+d-1); set(x,yy,z, c?"beam":(yy===y+2&&(x+z)%3===0?"winS":"wood")); }
    const half=Math.ceil(d/2)+1; for(let k=0;k<half;k++) for(let x=x0-1;x<=x0+w;x++){ set(x,y+4+k,z0-1+k,"slate"); set(x,y+4+k,z0+d-k,"slate"); } set(x0+1,y,z0+d-1,"door"); set(x0+1,y+1,z0+d-1,"door"); };
  hut(-2,12,88,6,5); hut(6,12,94,5,4);
  lantern(9,12,90);

  // ---------- Burg vor dem Vulkan (Kulisse) ----------
  { const x=60, z=-6, top=50; pillar(x,z,top,22,{taper:1, falls:[[Math.PI/2-.6,2],[Math.PI/2+.7,2]], fallDrop:2});
    const y=top;
    // Kathedrale: langes Schiff mit Strebepfeilern, Querhaus, Fassade mit Rosette, viele Spitztürme
    hall(x-6,y,z-8,13,16,3,{fh:5});
    for(let k=-6;k<=6;k+=3) for(const s of [-1,1]){ const sx=x+s*8; fill(sx,y,z+k,sx,y+10,z+k,"stoneD"); spire(sx,y+11,z+k,0,1,3); }
    spire(x-5,y+15,z+6,2,14,12); spire(x+5,y+15,z+6,2,14,12);                  // Westtürme
    spire(x,y+15,z-2,2,20,16);                                                  // Vierungsturm
    for(const [a,b,h] of [[-12,0,16],[12,0,16],[-16,-8,12],[16,-8,12],[-10,10,10],[10,10,10],[-18,6,9],[18,6,9],[-6,-10,14],[6,-10,14]]) spire(x+a,y,z+b,1,h,6);
    // Rosette in der Fassade
    for(let a=-3;a<=3;a++) for(let b=-3;b<=3;b++){ const d=Math.hypot(a,b); if(d<=3.2) set(x+a,y+11+b,z+8, d>2.4 ? "gold" : (Math.abs(a)===Math.abs(b)||a===0||b===0) ? "stoneD" : "win"); }
    door(x-1,y,z+8); fill(x-1,y,z+8,x+1,y+3,z+8,"door");
    // Mauerring mit Türmen
    for(let a=0;a<48;a++){ const an=a/48*Math.PI*2, wx=Math.round(x+Math.cos(an)*19), wz=Math.round(z+Math.sin(an)*12); if(wz>z+10) continue; fill(wx,y,wz,wx,y+4,wz,"stoneD"); if(a%2===0) set(wx,y+5,wz,"stoneD"); }
    S.castleTop=[x,y+29,z-2]; }
  // Häuser mit Lichtern rund um die Burg (wie im Bild: die Stadt zieht sich den Hang hinauf)
  { const cx=60, cz=-6, y=50; const house = (hx,hz,w,d,fl) => { if(get(hx,y,hz)||get(hx+w-1,y,hz+d-1)) return; hall(hx,y,hz,w,d,fl,{}); };
    for(const [hx,hz,w,d,fl] of [[38,4,5,4,2],[44,10,5,4,2],[73,4,5,4,2],[69,10,5,4,1],[36,-10,4,5,3],[80,-10,4,5,3],[46,-16,5,4,2],[70,-18,5,4,2],[40,-2,4,4,1],[78,-2,4,4,2]]) house(hx,hz,w,d,fl);
    for(let k=0;k<26;k++){ const an=k/26*Math.PI*2, lx=Math.round(cx+Math.cos(an)*20), lz=Math.round(cz+Math.sin(an)*13); if(get(lx,y-1,lz) && !get(lx,y,lz)){ set(lx,y,lz,"iron"); set(lx,y+1,lz,"lamp"); } } }
  // Säulen mit Bauten im Mittelgrund links und rechts, mit Brücken zur Burg
  { pillar(14,10,40,8,{falls:[[Math.PI/2,2]]}); const t1=hall(9,40,6,10,8,3,{}); spire(14,t1+2,10,1,3,6); domeAt(10,40+12,6,2,{ribs:4});
    pillar(108,8,38,8,{falls:[[Math.PI/2+.3,2]]}); const t2=towerRound(108,38,8,4,11,{wstep:1.6}); domeAt(108,t2,8,4.5,{ribs:8});
    bridge([22,39,10],[39,49,0],{truss:4, lamps:true}); bridge([99,37,8],[81,49,0],{truss:4, lamps:true}); }

  // ---------- weitere Säulen mit Bauten an den Seiten ----------
  { pillar(-8,40,30,7,{falls:[[Math.PI/2,2]]}); const t=towerRound(-8,30,40,4,9,{wstep:1.6}); domeAt(-8,t,40,4.2,{ribs:6});
    pillar(128,36,28,7,{falls:[[Math.PI/2+.4,2]]}); hall(123,28,32,10,8,3,{}); spire(128,40,36,1,5,6);
    bridge([-1,30,40],[S.vocabulary.x-8,22,S.vocabulary.z-2],{arch:-2, truss:3, lamps:false});
    bridge([121,28,38],[S.country.x+9,24,S.country.z-2],{arch:-2, truss:3, lamps:false}); }

  // ---------- schwebende Inseln mit Bauten und Rauch ----------
  const smokes = [], flames = [];
  const floater = (cx,cy,cz,r,kind) => { for(let k=0;k<r*2.6;k++){ const rr=(r+1)*Math.pow(1-k/(r*2.6),1.15); disk(cx,cy-k,cz,rr*(1+.15*Math.sin(k*1.7+cx)),(xx,yy,zz)=> rand()<.06 ? "magma" : rand()<.3 ? "rock2" : "rock"); }
    disk(cx,cy,cz,r,"stoneD");
    if(kind==="tower"){ const t=towerRound(cx,cy+1,cz,Math.max(2,r-2.5),8,{wstep:1.5}); spire(cx,t,cz,1,2,6); fill(cx+2,cy+1,cz-2,cx+2,t+4,cz-2,"stoneD"); set(cx+2,t+5,cz-2,"lava"); smokes.push([cx+2.5,t+6,cz-1.5]); flames.push([cx+2.5,t+6,cz-1.5]); }
    else { hall(cx-3,cy+1,cz-2,7,5,2,{}); fill(cx+2,cy+1,cz+1,cx+2,cy+14,cz+1,"stoneD"); set(cx+2,cy+15,cz+1,"lava"); smokes.push([cx+2.5,cy+16,cz+1.5]); flames.push([cx+2.5,cy+16,cz+1.5]); }
    // dünner Lavastrahl nach unten
    for(let y=cy-Math.round(r*2.6); y>cy-r*2.6-18; y--) fs(cx+.25,y,cz+.25,"lavaFall"); };
  floater(-4,62,14,6,"tower"); floater(12,74,-6,5,"hall"); floater(106,68,2,6,"tower"); floater(128,58,18,5,"hall"); floater(-26,52,30,4,"tower");

  // ---------- Vulkan und Landschaft bis zum Horizont ----------
  const Fr = A.far; Fr.cell = 3;
  const VX=60, VZ=-110, VH=112, VR=125;
  const volc = (x,z) => { const d=Math.hypot(x-VX,(z-VZ)*1.05); if(d>VR) return -99; const ridge = Math.sin(Math.atan2(z-VZ,x-VX)*7)*4*Math.min(1,d/30);
    let h = VH*Math.pow(1-d/VR,1.25) + ridge + (fbm(x*.04,z*.04)-.5)*10; if(d<14) h = Math.min(h, VH*Math.pow(1-14/VR,1.25)-6); return h; };
  const crater = (x,z) => Math.hypot(x-VX,(z-VZ)*1.05) < 14;
  const lavaRiv = (x,z) => { const d=Math.hypot(x-VX,z-VZ); if(d<14 || d>VR*.9) return false; const a=Math.atan2(z-VZ,x-VX); return [1.02,1.28,1.45,1.72,1.9,2.12].some(c=>Math.abs(a-c-Math.sin(d*.05)*.06)*d < 2.8); };
  const mts = [[-150,-120,60,70],[270,-120,60,80],[-90,-200,50,60],[220,-210,60,70]];
  A.farTerrain({ x0:-300, x1:W+300, z0:-260, z1:-28, base:-3,
    h:(x,z)=>{ let h = volc(x,z); for(const [mx,mz,r,mh] of mts){ const d=Math.hypot(x-mx,z-mz); if(d<r){ const v=mh*Math.pow(1-d/r,1.2)+(fbm(x*.05,z*.05)-.5)*8; if(v>h) h=v; } } return h; },
    skip:(x,z)=> false,
    top:(x,z)=> crater(x,z) ? "lava" : lavaRiv(x,z) ? (Math.hypot(x-VX,z-VZ)<VR*.6 ? "lava" : "magma") : (rand()<.65 ? "rock" : "basalt"),
    fill:(x,z,y,hc)=> lavaRiv(x,z) && y>=hc-2 ? "magma" : (y%3===0 ? "basalt" : "rock") });
  // Felsrücken links und rechts im Mittelgrund
  A.farTerrain({ x0:-200, x1:W+200, z0:-30, z1:D+40, base:-3,
    skip:(x,z)=> x>-36 && x<W+36,
    h:(x,z)=>{ const e = x<0 ? -x : x-W; return 6 + Math.min(60, e*.35) + (fbm(x*.05,z*.05)-.5)*30; },
    top:()=> rand()<.6 ? "rock" : "basalt", fill:()=> "rock" });

  // ---------- Menschen und Orks ----------
  const cols = [0x8A2A1E,0x2F4A8A,0x5A6A2A,0x6A3A6A,0x9A6A2A];
  const creatures = [
    { ...dragon(), orbit:{c:[60,70,20], r:[86,60], speed:.1, ph:1.2, bob:2, wander:{f:.21, r:.2, y:8, eight:8, dx:12, dz:10, span:14, clear:8}}, scale:.55 }
  ];
  const walkLine = (a,b,o) => { const cx=(a[0]+b[0])/2, cz=(a[2]+b[2])/2, len=Math.hypot(b[0]-a[0],b[2]-a[2])/2-1.5;
    creatures.push({ ...person(o.p), orbit:{c:[cx,(a[1]+b[1])/2+1,cz], r:[len,.001], rot:Math.atan2(b[2]-a[2],b[0]-a[0]), slope:(b[1]-a[1])/(2*len+3), speed:o.speed||.16, ph:o.ph||0, bob:.03, cycle:o.cycle||[22,.6,0]}, scale:o.scale||.17, clearR:0 }); };
  walkLine(...BR.r, {p:{walk:true, shirt:0x8A2A1E}, ph:0});
  walkLine(...BR.r, {p:{walk:true, orc:true, shirt:0x4A3A2A, helm:0x5A5E66}, ph:Math.PI, cycle:[26,.55,6], scale:.19});
  walkLine(...BR.l, {p:{walk:true, shirt:0x2F4A8A, cape:0x6A1A12}, ph:1});
  walkLine(...BR.f, {p:{walk:true, orc:true, shirt:0x3A2A1E}, ph:.4, speed:.08, cycle:[40,.7,3], scale:.19});
  walkLine(...BR.f, {p:{walk:true, shirt:0x5A6A2A}, ph:2.6, speed:.08, cycle:[36,.7,12]});
  walkLine([S.grammar.x-8,25,S.grammar.z+9],[S.grammar.x+8,25,S.grammar.z+9], {p:{walk:true, shirt:0x6A3A6A}, ph:1.5, cycle:[18,.5,4]});
  walkLine([S.country.x-5,25,S.country.z+8],[S.country.x+5,25,S.country.z+8], {p:{walk:true, orc:true, shirt:0x2A3A4A}, ph:.2, cycle:[17,.5,8], scale:.19});
  creatures.push({ ...person({orc:true, tool:true, shirt:0x3A2A1E}), at:[S.grammar.x-9,26,S.grammar.z+7.5], yaw:.4, scale:.19 },
                 { ...person({shirt:0x9A6A2A}), at:[S.country.x-7,26,S.country.z+4.6], yaw:-.6, scale:.17 },
                 { ...person({shirt:0x8A2A1E, hair:0xD8A040}), at:[S.vocabulary.x+2.5,26,S.vocabulary.z+6.5], yaw:-1.4, scale:.17 },
                 { ...person({shirt:0x2A2A30}), at:[2,12,93.5], yaw:-.3, scale:.17 });
  const ft = S.grammar.top;
  return {
    W, D, blocks, spots:S, exposure:1.1, fov:40,
    sky:[[0,"#140404"],[.3,"#3A0E06"],[.55,"#8A2A0C"],[.72,"#E07A2A"],[.86,"#F0A040"],[1,"#5A1606"]], fog:[0x9A3A16,100,400],
    hemi:[0xFFB888, 0x5A1E10, 1.85], sun:{color:0xFFB070, int:1.7, pos:[0,90,-120]}, bloom:[.6,.45,.84],
    lights:[{pos:[VX,VH+10,VZ], color:0xFF6A1A, int:9000, dist:260, flicker:true},
            {pos:[S.grammar.x,30,S.grammar.z+10], color:0xFF9A4A, int:260, dist:30},
            {pos:[S.vocabulary.x,26,S.vocabulary.z+7], color:0xFF9A4A, int:150, dist:22},
            {pos:[S.country.x,28,S.country.z+8], color:0xFF9A4A, int:160, dist:24},
            {pos:[60,4,70], color:0xFF6A1A, int:600, dist:70}],
    planes:[{y:SEA+.98, tex:T.lavaSea, repeat:500, size:1000, em:1.0, anim:[.03,.02]}],
    particles:[{n:1200, area:[-40,W+40,SEA,60,-20,D+20], vy:2.2, wob:.7, color:0xFF9A3A, size:.3, add:true},
               {n:500, area:[-160,W+160,10,140,-200,-30], vy:3, wob:1, color:0xFF8A2A, size:1, add:true}],
    puffs:[{n:18, pos:[VX,VH-4,VZ], dx:30, dy:80, dz:-10, s0:20, s1:60, color:0x4A3A36, opacity:.6, speed:.03, spread:8},
           {n:10, pos:[VX,VH-6,VZ], dx:0, dy:8, dz:0, s0:40, s1:20, color:0xFF6A1A, opacity:.45, speed:.05, spread:6, add:true},
           ...smokes.map(c=>({n:6, pos:c, dx:8, dy:26, dz:-4, s0:2, s1:10, color:0x3A3030, opacity:.55, speed:.06, spread:1.2})),
           ...flames.map(c=>({n:4, pos:c, dx:0, dy:2.5, dz:0, s0:2.2, s1:1, color:0xFF7A1A, opacity:.7, speed:.6, spread:.3, add:true})),
           ...fallFoot.map(([x,z])=>({n:3, pos:[x,SEA+1,z], dx:2, dy:8, dz:1, s0:3, s1:7, color:0x6A5A54, opacity:.28, speed:.08, spread:2})),
           {n:14, pos:[-20,3,60], dx:150, dy:2, dz:0, s0:16, s1:20, color:0x6A4A40, opacity:.22, speed:.01, spread:30, sz:.6, flat:.35}],
    bombs:{pos:[VX,VH-10,VZ], n:20, period:12, burst:2.4, life:6, speed:[10,26], up:[30,44], g:-18, size:2.2, glowSize:3.4, color:0xFFC060, glow:0xFF6A1A, floor:20, light:[0xFF7A2A, 4000, 220], biasZ:4},
    creatures,
    home:{pos:[62,84,196], look:[60,46,26]}, homePortrait:{pos:[62,96,236], look:[60,32,30]},
    ui:{bg:"rgba(34,8,4,.9)", border:"#FF9A4A", glow:"rgba(255,110,30,.55)", text:"#FFF1E2", sub:"#E8B48C", accent:"#FFB23A", "accent-ink":"#2A0A04", chip:"rgba(30,8,4,.8)"}
  };
}
