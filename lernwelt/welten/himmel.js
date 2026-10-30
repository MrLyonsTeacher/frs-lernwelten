// Klasse 8 · Sky Castle – Märchenschloss auf einer schwebenden Insel, Gärten- und Hafeninsel, ferne Inseln mit Wasserfällen, Gipfel über dem Wolkenmeer
import { eagle, bird } from "./tiere.js";
export function build(A){
  const { rand, fbm, vn, pick, set, get, fill, walls, disk, ring, cyl, tube, ball, ellip, dome, cone, line, topAt, tex, P, noise, stripes, bricks, rings, topEdge, planks, glassT, windowT } = A;
  const FN = A.fine;                                   // halbe Blöcke für Verzierungen
  const fs = (x,y,z,t) => FN.set(Math.round(x*2),Math.round(y*2),Math.round(z*2),t);
  const T = {
    grass: noise(["#6BCB4A","#7AD858","#5FBE40","#86E063"], 10, ["#A8F07A"]), grassSide: topEdge(["#8A6A44","#7C5E3A","#96744C"], ["#6BCB4A","#7AD858"], 4),
    dirt: noise(["#8A6A44","#7C5E3A","#96744C","#6E5232"]),
    rock: tex(g=>{ for(let y=0;y<16;y++){ const band=["#A4A8B4","#9498A4","#B2B6C0","#8A8E9A","#9CA0AC"][Math.floor(y/3)%5]; for(let x=0;x<16;x++) P(g,x,y, rand()<.15?"#C8CCD4":(rand()<.1?"#7A7E8A":band)); } }),
    rockD: tex(g=>{ for(let y=0;y<16;y++){ const band=["#6E7280","#62666E","#7A7E8A","#585C66"][Math.floor(y/4)%4]; for(let x=0;x<16;x++) P(g,x,y, rand()<.12?"#8A8E9A":band); } }),
    root: stripes(["#6A4A2C","#5A3E24","#7A5634"], true),
    stone: bricks(["#F2EFE6","#E8E4D8","#F8F6F0","#ECE8DE"], "#C8C2B2", 4, 8), stoneB: bricks(["#DCD6C6","#D0CAB8","#E4DED0"], "#A8A08C", 4, 8),
    trim: tex(g=>{ for(let y=0;y<16;y++) for(let x=0;x<16;x++) P(g,x,y, y<2||y>13 ? "#C8C0A8" : (x%4===0 ? "#E8E2D2" : "#FBF9F2")); }),
    pillar: stripes(["#F4F2EC","#E6E4DA","#FAF8F2"], true),
    roof: tex(g=>{ for(let y=0;y<16;y++) for(let x=0;x<16;x++){ const r=Math.floor(y/4), off=(r%2)*4; P(g,x,y, y%4===3?"#1A428E":(((x+off)%8)<1?"#1E4FA8":(((x+off)%8)<4?"#3A78E0":"#2E66CC"))); } }),
    roofT: tex(g=>{ for(let y=0;y<16;y++) for(let x=0;x<16;x++) P(g,x,y, (x+y)%8<4 ? "#2A62C8" : "#3672D8"); }),
    gold: noise(["#F5C542","#FFE27A","#E8B030","#FFD95A"]),
    win: tex(g=>{ for(let x=0;x<16;x++) for(let y=0;y<16;y++){ const arch = y<5 && Math.abs(x-7.5) > Math.sqrt(Math.max(0,25-(5-y)**2))+1.5; const fr = x<2||x>13||y>14||x===7||x===8||y===9||arch; P(g,x,y, fr ? "#C8C0A8" : (y<9 ? pick(["#FFE9A0","#FFDC80"]) : pick(["#9AD0F8","#7ABCEC"]))); } }),
    door: tex(g=>{ for(let x=0;x<16;x++) for(let y=0;y<16;y++){ P(g,x,y, x%5===0 ? "#4A2E14" : (y%6===0 ? "#3A2410" : pick(["#7A4E28","#6E4424"]))); } }),
    water: tex(g=>{ for(let x=0;x<16;x++){ const ph=rand()*16, sp=.6+rand()*.6; for(let y=0;y<16;y++){ const v=Math.sin((y+ph)*sp*.8)+rand()*.5; P(g,x,y, v>1.05?"#FFFFFF":v>.45?"#CFF2FF":v>-.3?"#8AD4FA":"#5AB8F0"); } } }),
    pool: tex(g=>{ for(let x=0;x<16;x++) for(let y=0;y<16;y++){ const v=Math.sin(x*.7+y*.4)+rand()*.5; P(g,x,y, v>1.1?"#DFF6FF":v>.2?"#6CC8F0":"#4AA8E0"); } }),
    cloud: noise(["#FFFFFF","#F4F8FF","#EAF2FF"]), blossom: noise(["#FFB8D8","#FF9AC8","#FFD2E6","#F286B8"], 10, ["#FFFFFF","#FFE6F0"]),
    leaves: noise(["#4FAE3A","#5CBE44","#449E30","#3E9A2E"], 10, ["#78D458"]), hedge: noise(["#3E8A30","#468E36","#367A2A"], 8, ["#5AA848"]),
    log: stripes(["#7A5532","#8A6238","#6A4828"], true), logTop: rings(["#B8894E","#A47840","#8A6236"]),
    planks: planks(["#C08A50","#CC965C","#B07C44"], "#7A5530"), planksD: planks(["#8A5A30","#7A4E28","#946436"], "#4A3018"),
    hull: tex(g=>{ for(let y=0;y<16;y++) for(let x=0;x<16;x++) P(g,x,y, y%4===3 ? "#4A2E16" : (x%8===0 ? "#6A4424" : pick(["#8A5A30","#7E5028","#946436"]))); }),
    canvas: tex(g=>{ for(let y=0;y<16;y++) for(let x=0;x<16;x++) P(g,x,y, x%5===0 ? "#D8D0BC" : pick(["#F4EEDC","#FAF6EA","#EEE6D2"])); }),
    canvasR: tex(g=>{ for(let y=0;y<16;y++) for(let x=0;x<16;x++) P(g,x,y, x%5===0 ? "#A02828" : pick(["#D83A3A","#E04848","#CC3434"])); }),
    brass: noise(["#D8A848","#E8BC5A","#C8963A"], 6, ["#FFE08A"]), iron: noise(["#7A7E88","#6A6E78","#8A8E98"]),
    rope: stripes(["#C8A878","#B8986A","#D4B484"], false), woolR: noise(["#D83A3A","#E04848"]), woolB: noise(["#2E5EC8","#3A6AD4"]), woolY: noise(["#F5C542","#FFD95A"]),
    flowerR: noise(["#FF4A6A","#FF6A80"], 6, ["#FFE27A"]), flowerY: noise(["#FFE27A","#FFD24A"], 6, ["#FF9A3A"]), flowerB: noise(["#7AA8FF","#9AC0FF"], 6, ["#FFFFFF"]), flowerP: noise(["#C88AFF","#B070F0"], 6, ["#FFFFFF"]),
    portal: tex(g=>{ for(let x=0;x<16;x++) for(let y=0;y<16;y++){ const a=Math.atan2(y-7.5,x-7.5), r=Math.hypot(x-7.5,y-7.5), v=Math.sin(a*2+r*.9); P(g,x,y, v>.6 ? "#F2A8FF" : v>.1 ? "#C060F0" : v>-.4 ? "#6A3ADC" : "#2A9AE8"); } }),
    ancient: tex(g=>{ for(let y=0;y<16;y++) for(let x=0;x<16;x++) P(g,x,y, (y%8===7 || (x+(y>7?4:0))%8===7) ? "#2A3442" : pick(["#4A5666","#52606E","#44505E","#3E4A58"])); }),
    rune: tex(g=>{ for(let y=0;y<16;y++) for(let x=0;x<16;x++) P(g,x,y, pick(["#4A5666","#52606E","#44505E"])); for(const [a,b] of [[4,3],[5,4],[6,5],[7,6],[8,6],[9,5],[10,4],[7,7],[7,8],[7,9],[7,10],[6,11],[8,11],[4,12],[10,12]]) P(g,a,b,"#7FF0FF"); }),
    mist: noise(["#FFFFFF","#F0FAFF","#E6F6FF"]),
    path: noise(["#E8E0CC","#DCD2BA","#F0E8D6"], 8, ["#C8BEA6"]),
    snowP: noise(["#F4F8FF","#E6EEF8","#FFFFFF"], 6, ["#C8D4E4"]), crystal: noise(["#BFF8FF","#8AEAFF","#E6FFFF"], 6, ["#FFFFFF"]), lamp: noise(["#FFE6A8","#FFD27A","#FFF2CC"])
  };
  const blocks = {
    grass:{side:T.grassSide, top:T.grass, bottom:T.dirt}, dirt:{side:T.dirt}, rock:{side:T.rock}, rockD:{side:T.rockD}, root:{side:T.root},
    stone:{side:T.stone}, stoneB:{side:T.stoneB}, trim:{side:T.trim, top:T.stone}, pillar:{side:T.pillar, top:T.stone}, roof:{side:T.roof}, roofT:{side:T.roofT},
    gold:{side:T.gold, em:.25}, win:{side:T.win, em:.55}, door:{side:T.door},
    water:{side:T.water, alpha:.8, anim:[0,1.8], em:.3}, pool:{side:T.pool, alpha:.85, anim:[.05,.03], em:.2},
    cloud:{side:T.cloud, alpha:.92, em:.15, soft:true}, cloudS:{side:T.cloud, em:.3, soft:true},
    blossom:{side:T.blossom}, leaves:{side:T.leaves}, hedge:{side:T.hedge}, log:{side:T.log, top:T.logTop}, planks:{side:T.planks}, planksD:{side:T.planksD},
    hull:{side:T.hull}, canvas:{side:T.canvas}, canvasR:{side:T.canvasR}, brass:{side:T.brass, em:.15}, iron:{side:T.iron}, rope:{side:T.rope},
    woolR:{side:T.woolR}, woolB:{side:T.woolB}, woolY:{side:T.woolY},
    flowerR:{side:T.flowerR}, flowerY:{side:T.flowerY}, flowerB:{side:T.flowerB}, flowerP:{side:T.flowerP}, path:{side:T.path},
    crystal:{side:T.crystal, em:1.0}, portal:{side:T.portal, em:.5, alpha:.8, anim:[.12,.07]}, ancient:{side:T.ancient}, rune:{side:T.rune, em:.6}, mist:{side:T.mist, alpha:.45, em:.4, soft:true}, snowP:{side:T.snowP}, lamp:{side:T.lamp, em:1.1, scale:.6, halo:[0xFFE6A8,3.4,.75]}
  };
  const W=92, D=70;

  // ---------- Schwebende Insel: Rasen oben, geschichteter Fels darunter, Wurzeln, Felsspitzen ----------
  const island = (cx,cz,r,yt,o={}) => {
    for(let z=Math.floor(cz-r-4); z<=cz+r+4; z++) for(let x=Math.floor(cx-r-4); x<=cx+r+4; x++){
      const a=Math.atan2(z-cz,x-cx), rr=r*(.86+.24*vn(Math.cos(a)*1.6+cx*.1, Math.sin(a)*1.6+cz*.1)), d=Math.hypot(x-cx,z-cz); if(d>rr) continue;
      const f=1-d/rr, top=yt+(o.flat&&f>.25?0:Math.round(fbm(x*.15+cx,z*.15)*1.2*f)), depth = Math.round(3 + Math.pow(f,1.6)*rr*(o.deep||1.25)*(.7+.6*fbm(x*.25,z*.25)));
      for(let y=top-depth;y<=top;y++) set(x,y,z, y===top?"grass": y>top-3?"dirt": (y<top-depth+3 && rand()<.3 ? "rockD" : (rand()<.04?"crystal":"rock")));
      if(f<.25 && rand()<.12){ const l=2+Math.floor(rand()*5); for(let k=1;k<=l;k++) set(x,top-2-k,z,"root"); }   // Wurzeln hängen am Rand
      if(f>.1 && f<.7 && rand()<.02){ const l=3+Math.floor(rand()*6); for(let k=1;k<=l;k++) set(x,top-depth-k,z, k===l?"crystal":"rockD"); } }
    // Grasbüschel und kleine Blumen (fein)
    if(!o.bare) for(let i=0;i<r*r*.5;i++){ const a=rand()*Math.PI*2, d=rand()*r*.9, x=cx+Math.cos(a)*d, z=cz+Math.sin(a)*d, t=topAt(Math.round(x),Math.round(z),yt+4);
      if(t>=yt-1 && get(Math.round(x),t,Math.round(z))==="grass" && !get(Math.round(x),t+1,Math.round(z))) fs(x,t+1,z, rand()<.25 ? pick(["flowerR","flowerY","flowerB","flowerP"]) : "leaves"); } };
  const level = (cx,cz,r,y) => { for(let z=Math.floor(cz-r); z<=cz+r; z++) for(let x=Math.floor(cx-r); x<=cx+r; x++) if(Math.hypot(x-cx,z-cz)<=r){ for(let yy=y+1;yy<y+6;yy++) set(x,yy,z,null); set(x,y,z,"grass"); set(x,y-1,z,"dirt"); } };
  const tree = (x,y,z,h,r,leaf="leaves") => { fill(x,y,z,x,y+h,z,"log"); line(x,y+h-2,z,x-2,y+h,z-1,"log"); line(x,y+h-2,z,x+2,y+h+1,z+1,"log");
    ellip(x,y+h+1,z,r,r*.75,r,leaf); ellip(x-r*.6,y+h,z-r*.3,r*.6,r*.5,r*.6,leaf); ellip(x+r*.6,y+h+.5,z+r*.4,r*.6,r*.5,r*.6,leaf); };
  const lampPost = (x,y,z,h=4) => { fill(x,y,z,x,y+h-1,z,"pillar"); fs(x,y+h,z,"gold"); set(x,y+h,z,"lamp"); };

  const S = {
    grammar:   {x:46, z:26, r:20, y:24, col:0x6AA8FF, ort:"Sky Castle"},
    vocabulary:{x:14, z:48, r:12, y:18, col:0xFF9AC8, ort:"Floating Gardens"},
    country:   {x:78, z:50, r:11, y:16, col:0xFFC24A, ort:"Airship Dock"}
  };
  island(S.grammar.x,S.grammar.z,S.grammar.r,S.grammar.y,{deep:1.4}); level(S.grammar.x,S.grammar.z,S.grammar.r-3,S.grammar.y);
  island(S.vocabulary.x,S.vocabulary.z,S.vocabulary.r,S.vocabulary.y); level(S.vocabulary.x,S.vocabulary.z,S.vocabulary.r-3,S.vocabulary.y);
  island(S.country.x,S.country.z,S.country.r,S.country.y); level(S.country.x,S.country.z,S.country.r-3,S.country.y);

  // ---------- Grammar: Märchenschloss ----------
  { const {x,y,z} = S.grammar;
    // runder Turm mit Fenstern, Gesims, Spitzhelm und Fahne
    const tower = (tx,tz,y0,r,h,roofH,flag) => {
      cyl(tx,y0,tz,r,h,(a,b,c)=> (b-y0)%7===0 ? "trim" : "stone");
      for(let hh=4; hh<h-1; hh+=7) for(let i=0;i<4;i++){ const an=i/4*Math.PI*2+.4; set(Math.round(tx+Math.cos(an)*r),y0+hh,Math.round(tz+Math.sin(an)*r),"win"); set(Math.round(tx+Math.cos(an)*r),y0+hh+1,Math.round(tz+Math.sin(an)*r),"win"); }
      ring(tx,y0+h,tz,r+1,"trim"); for(let i=0;i<14;i++){ const an=i/14*Math.PI*2; if(i%2===0) set(Math.round(tx+Math.cos(an)*(r+1)),y0+h+1,Math.round(tz+Math.sin(an)*(r+1)),"stone"); }
      for(let i=0;i<10;i++){ const an=i/10*Math.PI*2; fs(tx+.5+Math.cos(an)*(r+.9),y0+h-.5,tz+.5+Math.sin(an)*(r+.9),"stoneB"); }   // Konsolen
      cone(tx,y0+h+1,tz,r+.7,roofH,(a,b,c)=> (b-y0-h)%4===0 ? "roofT" : "roof");
      for(let i=0;i<8;i++){ const an=i/8*Math.PI*2; fs(tx+.5+Math.cos(an)*(r+.8),y0+h+1.5,tz+.5+Math.sin(an)*(r+.8),"gold"); }
      const ty=y0+h+roofH+1; fs(tx+.5,ty,tz+.5,"gold"); fs(tx+.5,ty+.5,tz+.5,"gold");
      if(false && flag){ for(let k=0;k<6;k++) fs(tx+.5,ty+1+k*.5,tz+.5,"iron"); for(let a=0;a<4;a++) for(let b=0;b<2.5;b+=.5) fs(tx+1+a*.5,ty+3.5-b-(a%2)*.5*0,tz+.5, b<1?flag:"woolY"); } };
    // Gebäude mit Satteldach und Gauben
    const hall = (x0,z0,x1,z1,y0,h,ridgeX=true) => {
      fill(x0,y0,z0,x1,y0+h,z1,(a,b,c)=> (b-y0)%6===0 ? "trim" : "stone");
      for(let a=x0+2;a<x1-1;a+=3){ set(a,y0+3,z1,"win"); set(a,y0+4,z1,"win"); set(a,y0+3,z0,"win"); set(a,y0+4,z0,"win"); }
      for(let c=z0+2;c<z1-1;c+=3){ set(x0,y0+3,c,"win"); set(x0,y0+4,c,"win"); set(x1,y0+3,c,"win"); set(x1,y0+4,c,"win"); }
      const half = ridgeX ? Math.ceil((z1-z0)/2)+1 : Math.ceil((x1-x0)/2)+1;
      for(let i=0;i<=half;i++){ if(ridgeX) fill(x0-1,y0+h+1+i,z0-1+i,x1+1,y0+h+1+i,z1+1-i,(a,b,c)=> (c===z0-1+i||c===z1+1-i) ? "roof" : "stone");
        else fill(x0-1+i,y0+h+1+i,z0-1,x1+1-i,y0+h+1+i,z1+1,(a,b,c)=> (a===x0-1+i||a===x1+1-i) ? "roof" : "stone"); }
      if(ridgeX) for(let a=x0;a<=x1;a+=2) fs(a+.5,y0+h+half+2,(z0+z1)/2+.5,"gold"); else for(let c=z0;c<=z1;c+=2) fs((x0+x1)/2+.5,y0+h+half+2,c+.5,"gold"); };
    // Ringmauer mit Zinnen und Wehrgang
    const RW=15, RZ=12;
    for(let a=-RW;a<=RW;a++) for(let c=-RZ;c<=RZ;c++){ if(Math.abs(a)!==RW && Math.abs(c)!==RZ) continue;
      fill(x+a,y+1,z+c,x+a,y+7,z+c,(xx,b)=> b===y+7 ? "trim" : (b===y+1 ? "stoneB" : "stone"));
      if((a+c)%2===0) set(x+a,y+8,z+c,"stone"); }
    for(let a=-RW+1;a<RW;a++){ set(x+a,y+7,z-RZ+1,"stone"); set(x+a,y+7,z+RZ-1,"stone"); }
    for(let a=-RW+3;a<RW-2;a+=4){ set(x+a,y+4,z+RZ,"win"); }
    // Torhaus mit zwei Türmen und Fallgitter
    fill(x-4,y+1,z+RZ-1,x+4,y+11,z+RZ+2,(a,b)=> (b-y)%5===0 ? "trim" : "stone");
    for(let a=-2;a<=2;a++) for(let b=1;b<=7;b++) if(b<=5 || Math.hypot(a,b-5)<2.6){ set(x+a,y+b,z+RZ+2,"door"); for(let c=z+RZ-1;c<=z+RZ+1;c++) set(x+a,y+b,c,null); }
    for(let a=-2;a<=2;a++) for(let b=0;b<5;b++) fs(x+a+.5,y+6.5-b*.5,z+RZ+2.6,(a+b)%2? "iron":"iron");
    for(let a=-4;a<=4;a+=2) set(x+a,y+12,z+RZ+2,"stone");
    tower(x-6,z+RZ+1,y+1,2.4,14,8,"woolR"); tower(x+6,z+RZ+1,y+1,2.4,14,8,"woolB");
    // Weg mit Treppe zum Tor und Laternen
    for(let s=0;s<8;s++){ fill(x-3,y,z+RZ+3+s,x+3,y,z+RZ+3+s,"path"); }
    for(const a of [-4,4]) for(let s=1;s<8;s+=3) lampPost(x+a,y+1,z+RZ+3+s,3);
    // Hauptgebäude, Bergfried, Ecktürme
    hall(x-11,z-9,x+11,z+3,y+1,10,true);
    fill(x-6,y+1,z-6,x+6,y+26,z+2,(a,b,c)=> (b-y)%6===0 ? "trim" : "stone");
    for(let hh=13; hh<=24; hh+=4) for(let a=-4;a<=4;a+=4){ set(x+a,y+hh,z+2,"win"); set(x+a,y+hh+1,z+2,"win"); }
    for(const [a,c] of [[-6,-6],[6,-6],[-6,2],[6,2]]) tower(x+a,z+c,y+27,1.6,4,6,null);
    for(let i=0;i<9;i++){ const w=6.5-i*.7; if(w<.6) break; fill(Math.round(x-w),y+27+i,Math.round(z-2-w),Math.round(x+w),y+27+i,Math.round(z-2+w),"roof"); }
    tower(x,z-2,y+27,2.6,10,12,"woolR");
    for(const [a,c,h] of [[-RW,-RZ,18],[RW,-RZ,18],[-RW,RZ,15],[RW,RZ,15]]) tower(x+a,z+c,y+1,3,h,10,(a<0)?"woolB":"woolR");
    for(const [a,c] of [[-10,-11],[10,-11]]) tower(x+a,z+c,y+11,1.8,8,7,null);
    // Balkon und Banner an der Front
    for(let a=-4;a<=4;a++){ set(x+a,y+12,z+3,"trim"); fs(x+a+.5,y+13,z+3.75,"iron"); }
    for(const a of [-9,9]) for(let b=0;b<10;b++) for(let w=0;w<3;w++) fs(x+a+.5+w*.5-.5,y+9.5-b*.5,z+3.6,(b===0)?"gold":(b>7?"woolY":"woolB"));
    // Schlossgarten innen
    for(const [a,c] of [[-12,8],[12,8],[-12,-10],[12,-10]]) tree(x+a,y+1,z+c,3,1.6,"blossom");
    for(let a=-12;a<=12;a+=2){ fs(x+a+.5,y+1,z+RZ-2.5,"hedge"); }
    S.grammar.top=[x, y+48, z-2]; S.grammar.base=y+16; S.grammar.cam={pos:[x-30,y+34,z+78], look:[x+20,y+20,z]}; }

  // ---------- Vocabulary: Schwebende Gärten ----------
  { const {x,y,z} = S.vocabulary;
    // großer Kirschbaum
    const tx=x-3, tz=z-3;
    for(let hh=1;hh<=9;hh++) fill(tx,y+hh,tz,tx+1,y+hh,tz+1,"log");
    line(tx,y+6,tz,tx-5,y+10,tz-2,"log"); line(tx+1,y+7,tz+1,tx+6,y+10,tz+3,"log"); line(tx,y+8,tz+1,tx-2,y+12,tz+5,"log");
    ellip(tx,y+12,tz,5.5,3.6,5.5,"blossom"); ellip(tx-5,y+11,tz-2,3.4,2.4,3.4,"blossom"); ellip(tx+6,y+11,tz+3,3.6,2.4,3.6,"blossom"); ellip(tx-2,y+13,tz+5,3,2,3,"blossom");
    for(let i=0;i<40;i++) fs(tx+(rand()-.5)*14, y+1, tz+(rand()-.5)*12, "blossom");      // Blüten am Boden
    // Pavillon mit Kuppel
    { const px=x+5, pz=z-4; disk(px,y,pz,3.2,"path"); for(let i=0;i<6;i++){ const a=i/6*Math.PI*2; fill(Math.round(px+Math.cos(a)*2.6),y+1,Math.round(pz+Math.sin(a)*2.6),Math.round(px+Math.cos(a)*2.6),y+5,Math.round(pz+Math.sin(a)*2.6),"pillar"); }
      ring(px,y+6,pz,3.2,"trim"); dome(px,y+6,pz,3.2,"roof",true); fs(px+.5,y+10,pz+.5,"gold"); fs(px+.5,y+10.5,pz+.5,"gold"); }
    // Brunnen mit Wasserspiel
    const fx=x+4, fz=z+4; ring(fx,y+1,fz,3.2,"trim"); disk(fx,y+1,fz,2.2,"pool"); fill(fx,y+1,fz,fx,y+4,fz,"pillar"); disk(fx,y+5,fz,1.4,"trim"); set(fx,y+6,fz,"pool");
    for(let i=0;i<8;i++){ const a=i/8*Math.PI*2; fs(fx+.5+Math.cos(a)*1.6,y+5.5,fz+.5+Math.sin(a)*1.6,"water"); fs(fx+.5+Math.cos(a)*2.1,y+4.5,fz+.5+Math.sin(a)*2.1,"water"); }
    // Wege, Hecken und Beete
    for(let a=-9;a<=9;a++){ set(x+a,y,z+1,"path"); } for(let c=-8;c<=9;c++) set(x-1,y,z+c,"path");
    for(let a=-9;a<=9;a++) for(const c of [-1,3]) if(Math.abs(a+1)>1 && !get(x+a,y+1,z+c)) set(x+a,y+1,z+c,"hedge");
    for(let i=0;i<70;i++){ const a=rand()*Math.PI*2, d=3+rand()*(S.vocabulary.r-5), px=Math.round(x+Math.cos(a)*d), pz=Math.round(z+Math.sin(a)*d);
      if(get(px,y+1,pz) || get(px,y,pz)==="path" || Math.hypot(px-fx,pz-fz)<4) continue; set(px,y+1,pz,pick(["flowerR","flowerY","flowerB","flowerP"])); }
    // Bänke und Laternen
    for(const [bx,bz] of [[x-6,z+5],[x+8,z]]){ fill(bx,y+1,bz,bx+2,y+1,bz,"planks"); fs(bx+.5,y+.5,bz+.5,"iron"); fs(bx+2.5,y+.5,bz+.5,"iron"); }
    for(const [lx,lz] of [[x-8,z+2],[x+2,z-8],[x+9,z+5],[x-3,z+9]]) lampPost(lx,y+1,lz,4);
    S.vocabulary.top=[x,y+19,z]; S.vocabulary.base=y+6; S.vocabulary.cam={pos:[x-30,y+30,z+56], look:[x+24,y+4,z-6]}; }

  // ---------- Country & people: Luftschiff-Hafen ----------
  { const {x,y,z} = S.country;
    // Steg mit Geländer
    for(let a=0;a<18;a++){ fill(x+3+a,y,z-1,x+3+a,y,z+1,"planksD"); if(a%3===0){ fill(x+3+a,y-3,z,x+3+a,y-1,z,"log"); } fs(x+3.5+a,y+1,z-1.25,"rope"); fs(x+3.5+a,y+1,z+1.75,"rope"); if(a%3===0){ fs(x+3.5+a,y+.5,z-1.25,"log"); fs(x+3.5+a,y+.5,z+1.75,"log"); } }
    // Hafenmeisterhaus mit Fachwerk und Uhr
    fill(x-7,y+1,z-6,x-1,y+6,z-1,(a,b,c)=> (a===x-7||a===x-1||c===z-6||c===z-1) && ((a+b)%3===0||b===y+3) ? "planksD" : "stone");
    set(x-4,y+1,z-1,"door"); set(x-4,y+2,z-1,"door"); set(x-6,y+4,z-1,"win"); set(x-2,y+4,z-1,"win"); set(x-7,y+4,z-3,"win");
    for(let i=0;i<4;i++) fill(x-8,y+7+i,z-7+i,x,y+7+i,z-i,(a,b,c)=> (c===z-7+i||c===z-i) ? "roof" : "stone");
    fill(x-4,y+11,z-4,x-4,y+13,z-4,"stone"); fs(x-3.5,y+12.5,z-3.25,"gold"); fs(x-3.5,y+14,z-3.5,"gold");
    // Lagerkräne, Kisten und Fässer
    fill(x+1,y+1,z-7,x+1,y+10,z-7,"log"); line(x+1,y+10,z-7,x+7,y+10,z-7,"log"); for(let k=0;k<5;k++) fs(x+7.5,y+9.5-k*.5,z-6.5,"rope"); fill(x+7,y+6,z-7,x+7,y+6,z-7,"planks");
    for(const [bx,bz,h] of [[x+1,z+4,2],[x+2,z+4,1],[x+1,z+5,1],[x-3,z+4,1],[x-2,z+6,1]]) fill(bx,y+1,bz,bx,y+h,bz,"planks");
    for(const [bx,bz] of [[x-6,z+3],[x-5,z+5],[x+4,z+6]]){ fs(bx+.5,y+1,bz+.5,"planksD"); fs(bx+.5,y+1.5,bz+.5,"brass"); fs(bx+.5,y+2,bz+.5,"planksD"); }
    for(const [lx,lz] of [[x+3,z-3],[x+3,z+3],[x+12,z-2],[x+18,z+2]]) lampPost(lx,y+1,lz,3);
    // Luftschiff: Rumpf mit Kiel und Reling, Kabine, Ballon mit Rippen, Leitwerk, Propeller, Takelage
    const ax=x+14, ay=y+3, az=z+5;
    for(let a=-9;a<=9;a++){ const f=a/10, r = 2.8*Math.sqrt(Math.max(0,1-f*f)), d = Math.round(2.2*Math.sqrt(Math.max(0,1-f*f*.9)));
      for(let b=-Math.ceil(r);b<=Math.ceil(r);b++){ if(Math.abs(b)>r+.3) continue; const depth = Math.round(d*(1-(b/(r+.5))**2)); for(let k=0;k<=depth;k++) set(ax+a,ay-k,az+b, k===depth ? "planksD" : "hull"); }
      set(ax+a,ay-d-1,az,"brass");                                                 // Kiel
      if(Math.abs(a)<9){ fs(ax+a+.5,ay+1,az-Math.ceil(r)+.25,"planksD"); fs(ax+a+.5,ay+1,az+Math.ceil(r)+.75,"planksD"); } }
    fill(ax-8,ay,az-2,ax+8,ay,az+2,"planks");                                      // Deck
    fill(ax-3,ay+1,az-1,ax+1,ay+3,az+1,"planksD"); set(ax-1,ay+2,az+1,"win"); set(ax-3,ay+2,az,"win"); fill(ax-4,ay+4,az-2,ax+2,ay+4,az+2,"roof");   // Kabine
    fill(ax+10,ay,az,ax+12,ay,az,"planksD"); fs(ax+13,ay+.5,az+.5,"gold");          // Bugspriet
    // Ballon
    for(let a=-12;a<=12;a++) for(let b=-5;b<=5;b++) for(let c=-5;c<=5;c++){ const e=(a/12.5)**2+(b/5.4)**2+(c/5.4)**2; if(e<=1 && e>.62) set(ax+a,ay+12+b,az+c, (a%4===0) ? "canvasR" : "canvas"); }
    for(let b=-5;b<=5;b++) for(let a=-12;a<=12;a+=4){ const rr=5.4*Math.sqrt(Math.max(0,1-(a/12.5)**2)); for(let k=0;k<12;k++){ const an=k/12*Math.PI*2; fs(ax+a+.5,ay+12+.5+Math.sin(an)*rr,az+.5+Math.cos(an)*rr,"rope"); } }
    for(const [a,dir] of [[-12,1]]) { fill(ax-14,ay+12,az-4,ax-12,ay+12,az+4,"canvasR"); fill(ax-14,ay+8,az,ax-12,ay+16,az,"canvasR"); }   // Leitwerk
    for(const s of [-1,1]){ for(let k=0;k<6;k++) line(ax-6+k*2.4,ay+1,az+2*s,ax-8+k*3,ay+7,az+4*s,"rope");                                   // Takelage
      fill(ax-6,ay+1,az+4*s,ax-6,ay+3,az+4*s,"iron"); for(const [p,q] of [[0,1],[0,-1],[1,0],[-1,0]]) fs(ax-6.5+p*1.5,ay+2.5+q*1.5,az+4*s+(s>0?.75:.25),"brass"); }  // Propeller
    S.country.top=[x+4,y+22,z+2]; S.country.base=y+8; S.country.cam={pos:[x-22,y+32,z+70], look:[x+32,y+8,z+2]}; }

  // ---------- Wasserfälle: Quelle auf der Insel, Bach zum Rand, Fall an der Felswand entlang, unten Gischt ----------
  const MIST = [];
  const fall = (cx,cz,yt,an,w,len) => { const dx=Math.cos(an), dz=Math.sin(an); let px=cx+.5, pz=cz+.5, d=0;
    // vom Inneren nach außen bis zur Kante: Bachbett aus Wasser in der Grasfläche
    let ex=Math.round(px), ez=Math.round(pz);
    for(d=0; d<60; d+=.5){ const x=Math.round(cx+.5+dx*d), z=Math.round(cz+.5+dz*d), t=topAt(x,z,yt+3); if(t<yt-3) break; ex=x; ez=z; if(d>3 && get(x,t,z)==="grass"){ for(let k=-Math.floor(w/2);k<=Math.floor(w/2);k++){ const X=Math.round(x-dz*k), Z=Math.round(z+dx*k); if(get(X,t,Z)==="grass"){ set(X,t,Z,"pool"); set(X,t+1,Z,null); } } } }
    const top = topAt(ex,ez,yt+3); if(top<0) return;
    // Fall: dicht an der Wand, wird nach unten breiter und löst sich auf
    for(let k=0;k<len*2;k++){ const y=top-k*.5, f=k/(len*2), ww=w*.5+f*2.2, off=1+f*1.6;
      for(let j=-ww;j<=ww;j+=.5){ if(f>.65 && rand()<(f-.65)*2.4) continue; const x=ex+.5+dx*off-dz*j, z=ez+.5+dz*off+dx*j; if(get(Math.floor(x),Math.floor(y),Math.floor(z))) continue; fs(x,y,z, f>.8 && rand()<.5 ? "mist" : "water"); } }
    MIST.push([ex+dx*2.5, top-len*.85, ez+dz*2.5, w]); };
  for(const [isl,ans] of [["grammar",[2.3,.85]],["vocabulary",[3.0,1.9]],["country",[.3,1.3]]]){ const s0=S[isl]; for(const an of ans) fall(s0.x,s0.z,s0.y,an,isl==="grammar"?3:2,isl==="grammar"?34:26); }
  // Bogenbrücken aus Stein zwischen den Inseln
  const bridge = (x0,z0,x1,z1,y0,y1) => { const n=Math.ceil(Math.hypot(x1-x0,z1-z0)), nx=-(z1-z0)/n, nz=(x1-x0)/n;
    for(let i=0;i<=n;i++){ const f=i/n, x=x0+(x1-x0)*f, z=z0+(z1-z0)*f, y=Math.round(y0+(y1-y0)*f + Math.sin(f*Math.PI)*1.5);
      for(const w of [-1,0,1]) set(x+nx*w,y,z+nz*w,"stone"); for(const w of [-2,2]){ set(x+nx*w,y,z+nz*w,"trim"); if(i%2===0) fs(x+nx*w+.5,y+1,z+nz*w+.5,"pillar"); }
      const under = Math.round(Math.sin(f*Math.PI)*3); for(let k=1;k<=under;k++) set(x,y-k,z,"stoneB");
      if(i%6===3){ fs(x+nx*2+.5,y+1.5,z+nz*2+.5,"pillar"); set(x+nx*2,y+2,z+nz*2,"lamp"); } } };
  bridge(30,36,22,44,24,18); bridge(62,36,70,44,24,16);
  // kleine Inseln nahe am Bild
  for(const [cx,cz,r,y,d] of [[34,62,4,10,"tree"],[60,64,5,8,"tree"],[118,44,3,24,"rock"],[2,30,3,22,"tree"],[26,8,4,36,"tree"],[68,6,4,38,"rock"]]){ island(cx,cz,r,y,{deep:1.1});
    const t=topAt(cx,cz,y+4); if(d==="tree") tree(cx,t+1,cz,4,2.2, rand()<.5?"blossom":"leaves"); else for(let k=1;k<=3;k++) set(cx,t+k,cz,"crystal"); }
  for(const [cx,cz,y] of [[34,62,10],[60,64,8],[2,30,22],[26,8,36]]) fall(cx,cz,y,Math.PI/2,1,14);
  // ---------- Portal-Insel: uralter Torbogen mit wirbelndem Portal, Steintreppe, Felsbrocken, Palmen ----------
  { const cx=94, cz=14, y=34, r=9; island(cx,cz,r,y,{deep:1.5}); level(cx,cz,r-2,y);
    const px=cx, pz=cz-1, H=15, half=4;
    for(const sg of [-1,1]){ const x=px+sg*half; fill(x-1,y+1,pz-1,x+1,y+2,pz+1,"ancient"); fill(x,y+3,pz,x,y+H,pz,(a,b)=> (b-y)%4===0 ? "rune" : "ancient"); for(const dz of [-1,1]) fill(x,y+3,pz+dz,x,y+H-2,pz+dz,(a,b)=> (b-y)%3===1 ? "rune" : "ancient"); set(x+sg,y+H-3,pz,"ancient"); }
    for(let i=0;i<=24;i++){ const th=i/24*Math.PI, ax=px+.5+Math.cos(th)*(half+.6), ay=y+H+Math.sin(th)*4; for(let dz=-1;dz<=1;dz+=.5) fs(ax,ay,pz+.5+dz, i%4===0 ? "rune" : "ancient"); fs(px+.5+Math.cos(th)*(half+1.3), y+H+Math.sin(th)*4.7, pz+.5, "ancient"); }
    fs(px+.5,y+H+5,pz+.5,"crystal"); fs(px+.5,y+H+5.5,pz+.5,"crystal");
    // Portalfläche (wirbelt durch bewegte Textur)
    for(let x=-half+.5;x<=half-.5;x+=.5) for(let yy=y+1;yy<=y+H+4;yy+=.5){ const dx=x, dy=yy-(y+H); if(yy>y+H && dx*dx+(dy*dy)*(half*half/16) > (half-.4)*(half-.4)) continue; fs(px+.5+x, yy, pz+.5, "portal"); }
    // Treppe an der Inselkante hinunter, Felsbrocken, Palmen
    for(let k=0;k<9;k++){ const sx=cx+r-2+k, sy=y-k; fill(sx,sy,cz+3,sx,sy,cz+5,"ancient"); for(let yy=sy-1;yy>sy-4;yy--) for(let zz=cz+3;zz<=cz+5;zz++) if(!get(sx,yy,zz)) set(sx,yy,zz,"rock"); }
    const palm = (x,z,h,lean) => { const t=topAt(x,z,y+3)+1; let ox=x+.5, oz=z+.5; for(let k=0;k<h*2;k++){ fs(ox,t+k*.5,oz,"log"); ox+=lean*.12; }
      const tx=ox, ty=t+h; for(let i=0;i<7;i++){ const a=i/7*Math.PI*2; for(let k=1;k<=7;k++){ const rr=k*.5; fs(tx+Math.cos(a)*rr, ty+Math.sin(k/7*Math.PI)*1.2-k*.2, oz+Math.sin(a)*rr, "leaves"); } } };
    palm(cx+5,cz-4,8,1); palm(cx+6,cz+2,6,-1); palm(cx-6,cz+3,7,.6);
    for(const [ox,oy,oz,rr] of [[-14,8,-4,1.6],[14,-2,-8,2],[-10,-6,8,1.2],[12,12,6,1.1]]) ellip(cx+ox,y+oy,cz+oz,rr,rr*.8,rr,(a,b,c)=> b>y+oy+rr*.4 ? "grass" : "rock");
    S.portal=[px+.5,y+1+(H+4)/2,pz+.5,half*2-.6,H+3.6]; }

  // ---------- Hintergrund: echte schwebende Inseln (normale Blöcke) mit Bäumen, Türmen, Wasserfällen ----------
  const farIsle = (cx,cz,r,y,deco) => { island(cx,cz,r,y,{deep:1.3, bare:true}); const t=topAt(cx,cz,y+4)+1;
    if(deco==="tree"){ tree(cx-1,t,cz,5,3,"leaves"); tree(cx+r*.5,t,cz+1,4,2.4,"blossom"); }
    if(deco==="tower"){ cyl(cx,t,cz,2,12,(a,b,c)=>(b-t)%5===0?"trim":"stone"); cone(cx,t+12,cz,2.8,8,"roof"); set(cx+2,t+6,cz,"win"); tree(cx+r*.55,t,cz-1,3,2,"leaves"); }
    if(deco==="ruin"){ for(const a of [-3,0,3]) fill(cx+a,t,cz-1,cx+a,t+3+Math.floor(rand()*6),cz-1,"pillar"); fill(cx-3,t+6,cz-1,cx+3,t+6,cz-1,"stone"); }
    if(deco!=="ruin") fall(cx,cz,y,Math.PI*.15,2,30); };
  for(const [cx,cz,r,y,d] of [[-22,-12,8,32,"tree"],[150,-34,9,40,"tower"],[96,-46,10,48,"tree"],[-6,-50,7,42,"ruin"],[46,-70,11,56,"tower"],[-40,24,6,22,"tree"],[132,30,7,26,"ruin"],[150,-40,8,44,"tree"],[-56,-34,9,40,"tower"]]) farIsle(cx,cz,r,y,d);

  // ---------- Gipfel über dem Wolkenmeer (weit weg, grob) ----------
  const F = A.far; F.cell = 3;
  const peaks = [[-120,-110,60,80],[220,-120,66,92],[46,-230,80,130],[-200,-20,48,56],[290,-10,52,62],[-80,-220,56,96],[170,-230,60,104]];
  const ph = (x,z) => { let h = -10; for(const [px,pz,r,hh] of peaks){ const d=Math.hypot(x-px,z-pz)/r; if(d<1){ const v = hh*Math.pow(1-d,1.4)*(.8+.4*fbm(x*.06,z*.06)); if(v>h) h=v; } } return h; };
  A.farTerrain({ x0:-300, x1:W+300, z0:-320, z1:D+40, base:0, skip:(x,z)=> ph(x,z) < 4, h: ph,
    top:(x,z,y,hc)=> y*3 > 36 ? "snowP" : (y*3 > 20 && rand()<.4 ? "snowP" : "rock"), fill:(x,z,y,hc)=> y*3 > 40 ? "snowP" : "rock" });

  // ---------- Tiere ----------
  const creatures = [{ ...eagle(), orbit:{c:[46,46,24], r:[58,44], speed:.09, ph:3.6, bob:2, wander:{f:.27, r:.18, y:6, eight:6, dx:10, dz:10, span:10, clear:5}}, scale:.42 }];
  for(let i=0;i<9;i++) creatures.push({ ...bird(i%3?0xFFFFFF:0xE8EEF8), orbit:{c:[46+(i%3)*2,34+(i%4),30+(i%2)*3], r:[40,24], speed:.12, ph:i*.1, bob:1}, scale:.5, noShadow:true });

  return {
    W, D, blocks, spots:S, exposure:1.1, fov:40,
    sky:[[0,"#1E62D0"],[.45,"#6AB0FA"],[.72,"#FFD2B4"],[1,"#F4E8E0"]], fog:[0xC8DCF4, 170, 560],
    hemi:[0xDDEBFF, 0x8A9AB0, 1.7], sun:{color:0xFFF4E0, int:2.1, pos:[60,120,90]}, bloom:[.3,.5,.9],
    portalFx:{pos:S.portal.slice(0,3), w:S.portal[3], h:S.portal[4], yaw:0, color:0xD08AFF, period:120, off:20, dur:10, light:1400},
    lights:[{pos:[S.grammar.x,S.grammar.y+14,S.grammar.z+16], color:0xFFE6A8, int:140, dist:34}, {pos:[94,42,17], color:0xC88AFF, int:260, dist:30, flicker:1400}],
    planes:[{y:-30, size:1400, color:0xB8CCE6, em:0}],
    // unter der Festung: Nebel und ein Wolkenmeer, dazu einige große Haufenwolken mit Detail
    puffs:[{n:16, pos:[0,-2,10], dx:W, dy:1, dz:0, s0:26, s1:30, color:0xF2F6FC, opacity:.45, speed:.006, spread:26, flat:.35},
           {n:14, pos:[10,6,D/2], dx:W-20, dy:2, dz:0, s0:14, s1:18, color:0xFFFFFF, opacity:.35, speed:.01, spread:20, flat:.4},
           ...MIST.map(([x,y,z,w])=>({n:10, pos:[x,y-2,z], dx:0, dy:6, dz:0, s0:8+w*2, s1:14+w*3, color:0xFFFFFF, opacity:.85, speed:.04, spread:3+w}))],
    clouds:[
      // Wolkenmeer weit unten
      ...[[-160,-14,-120],[-40,-16,-140],[90,-14,-150],[220,-16,-120],[-180,-15,0],[260,-14,10],[-120,-12,110],[200,-12,120],[46,-18,150],[-30,-14,-30],[130,-15,-40]].map(p=>({pos:p, r:46, n:28, sx:1.8, sy:.35, sz:1.4, flat:true, lo:0xC8D6EA, opacity:.95})),
      // Nebelbänke direkt unter den Inseln
      ...[[20,-2,30],[70,-3,26],[46,-4,64],[-6,-6,10],[100,-5,0]].map(p=>({pos:p, r:20, n:16, sx:1.6, sy:.35, sz:1.2, flat:true, lo:0xDCE6F4, opacity:.6})),
      // Haufenwolken mit Detail (in die der Adler hineinfliegen kann)
      {pos:[-18,44,-8], r:13, n:46, sx:1.5, sy:.8, sz:1.1, drift:.6},
      {pos:[150,54,-30], r:14, n:50, sx:1.6, sy:.85, sz:1.1, drift:.5},
      {pos:[30,58,-46], r:11, n:38, sx:1.5, sy:.75, sz:1, drift:.4},
      {pos:[150,30,-80], r:20, n:44, sx:1.7, sy:.8, sz:1.2},
      {pos:[-90,36,-70], r:18, n:40, sx:1.6, sy:.8, sz:1.2}
    ],
    particles:[{n:160, area:[86,102,34,54,8,20], vy:.8, wob:1.4, color:0xE6A8FF, size:.4, blink:2, add:true},
               {n:90, area:[S.vocabulary.x-8,S.vocabulary.x+8,S.vocabulary.y+2,S.vocabulary.y+16,S.vocabulary.z-8,S.vocabulary.z+8], vy:-1, wob:1.2, color:0xFFB8D8, size:.35, opacity:.9}],
    creatures,
    home:{pos:[W/2,64,D+96], look:[W/2,28,D/2-6]}, homePortrait:{pos:[W/2,84,D+150], look:[W/2,30,D/2-6]},
    ui:{bg:"rgba(255,255,255,.9)", border:"#6AA8FF", glow:"rgba(106,168,255,.45)", text:"#16305A", sub:"#4A6A98", accent:"#FFC24A", "accent-ink":"#2A1E06", chip:"rgba(255,255,255,.85)"}
  };
}
