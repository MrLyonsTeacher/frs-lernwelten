// Klasse 6 · Water World – Korallenpalast auf einer Riffterrasse, Kelpgarten mit Riesenmuschel, gesunkene Galeone; ringsum Riffe, Felsen und ein altes Wrack
import { whale, fish, dolphin } from "./tiere.js";
export function build(A){
  const { rand, fbm, vn, pick, set, get, fill, walls, disk, ring, cyl, tube, ball, ellip, dome, cone, line, topAt, tex, P, noise, stripes, bricks, rings, planks, glassT } = A;
  const FN = A.fine, fs = (x,y,z,t) => FN.set(Math.round(x*2),Math.round(y*2),Math.round(z*2),t), fget = (x,y,z) => FN.get(Math.round(x*2),Math.round(y*2),Math.round(z*2));
  const T = {
    sand: tex(g=>{ for(let x=0;x<16;x++) for(let y=0;y<16;y++){ const v=Math.sin(y*.9+Math.sin(x*.5)*1.2); P(g,x,y, v>.6 ? pick(["#F0E2B4","#EADCAA"]) : pick(["#E2D19B","#DCCB92","#E7D7A2"])); } P(g,5,5,"#C8B482"); P(g,11,9,"#FFF4D0"); }),
    sandstone: stripes(["#D9C28A","#CDB57C","#E2CC96"], false),
    rock: tex(g=>{ for(let x=0;x<16;x++) for(let y=0;y<16;y++) P(g,x,y, pick(["#5E6F7A","#6B7C86","#53636D","#61727D"])); for(let i=0;i<10;i++) P(g,Math.floor(rand()*16),Math.floor(rand()*16),pick(["#4E8A6A","#6A9A7A"])); }),
    rockD: noise(["#3E4E58","#46565E","#38464E"], 6, ["#2E3A42"]),
    prism: noise(["#5FB3A2","#4FA595","#6DC1AE","#3E8F82"], 6, ["#8ADCCA"]),
    pbrick: bricks(["#7ACCB8","#6FC3B0","#84D4C0"], "#3E8F82"), pbrickD: bricks(["#4E9E8C","#459482","#56A894"], "#2E6E62"),
    trim: tex(g=>{ for(let y=0;y<16;y++) for(let x=0;x<16;x++) P(g,x,y, y<2||y>13 ? "#E8C860" : (x%4===0 ? "#9AE6D6" : "#C8F4EA")); }),
    col: tex(g=>{ for(let x=0;x<16;x++){ const c = x%4===0 ? "#5FB3A2" : x%4===1 ? "#9AE6D6" : "#C8F4EA"; for(let y=0;y<16;y++) P(g,x,y,c); } }),
    lantern: tex(g=>{ for(let x=0;x<16;x++) for(let y=0;y<16;y++){ const e=x<2||y<2||x>13||y>13; P(g,x,y, e?pick(["#8EDCE0","#A6E6EA"]):pick(["#F2FFFF","#DFFAFF","#FFFFFF"])); } }),
    arch: tex(g=>{ for(let x=0;x<16;x++) for(let y=0;y<16;y++){ const a = y<6 && Math.abs(x-7.5) > Math.sqrt(Math.max(0,36-(6-y)**2)); P(g,x,y, (x<2||x>13||y>14||a) ? "#6FC3B0" : (x===7||x===8 ? "#8EDCE0" : pick(["#BFF4FF","#9AE8FA"]))); } }),
    glass: glassT("#CFF6FF","#8FDCF0"),
    coralP: noise(["#FF6FA0","#FF8AB3","#E85A8C","#FF9DC0"], 8, ["#FFD0E0"]), coralO: noise(["#FF8A3A","#FFA15A","#E8742A"], 8, ["#FFD0A0"]),
    coralV: noise(["#9A6CFF","#B08AFF","#7F52E8"], 8, ["#E0D0FF"]), coralY: noise(["#FFD23F","#FFE06A","#E8BC2A"], 8, ["#FFF4B0"]), coralB: noise(["#3FA0FF","#5AB4FF","#2A86E8"], 8, ["#C0E4FF"]),
    brain: tex(g=>{ for(let x=0;x<16;x++) for(let y=0;y<16;y++){ const v=Math.sin(x*1.3+Math.sin(y*.9)*2.2); P(g,x,y, v>.3 ? "#E8A86A" : v>-.4 ? "#D08850" : "#A86A3A"); } }),
    sponge: tex(g=>{ for(let x=0;x<16;x++) for(let y=0;y<16;y++) P(g,x,y, (x%4===1&&y%4===1) ? "#7A3A10" : pick(["#E8A030","#F0B040","#D89020"])); }),
    kelp: stripes(["#2F7A3A","#3A8F45","#27693A","#45A050"], true), kelpL: noise(["#4A9A3A","#5AAA44","#3E8A30","#6AB84A"], 6, ["#8ACC60"]),
    grassS: stripes(["#5AA848","#4E9A3E","#6ABA54"], true),
    planks: planks(["#7A5A3A","#866444","#6E5032"], "#4A3420"), planksD: planks(["#5A4028","#4E3620","#664A30"], "#2E2014"),
    hull: tex(g=>{ for(let y=0;y<16;y++) for(let x=0;x<16;x++) P(g,x,y, y%4===3 ? "#3A2818" : (rand()<.06 ? "#5E8A6A" : pick(["#6E5032","#7A5A3A","#634830"]))); }),
    sail: tex(g=>{ for(let y=0;y<16;y++) for(let x=0;x<16;x++) P(g,x,y, rand()<.08 ? "#B8B09A" : (x%6===0 ? "#CFC8B4" : pick(["#E8E4D8","#DAD5C6","#F2EFE6"]))); }),
    gold: noise(["#F5C542","#FFE27A","#E8B030","#FFD95A"]), pearl: noise(["#FFFFFF","#F2F6FF","#E6EEFF"]),
    shell: tex(g=>{ for(let x=0;x<16;x++) for(let y=0;y<16;y++) P(g,x,y, x%4===0 ? "#D8A898" : pick(["#F2D5C8","#E8C2B4","#FBE6DC"])); }), shellIn: noise(["#FFE8F0","#F8DCE8","#FFF2F6"]),
    iron: noise(["#6A6E74","#5E6268","#767A80"], 6, ["#8A5A3A"]), dark: noise(["#1E3E3A","#224844","#1A3634"]),
    surface: tex(g=>{ for(let x=0;x<16;x++) for(let y=0;y<16;y++){ const v=Math.sin(x*.8+y*.3)+Math.sin(y*.7-x*.5); P(g,x,y, v>1?"#BFF4FF":v>0?"#6FD3F0":"#3FB0DD"); } }),
    star: noise(["#FF7A4A","#FF8A5A","#E86A3A"], 6, ["#FFD0A0"]), urchin: noise(["#3A2A5A","#4A3A6A","#2E2048"])
  };
  const blocks = {
    sand:{side:T.sand}, sandstone:{side:T.sandstone, top:T.sand}, rock:{side:T.rock}, rockD:{side:T.rockD}, prism:{side:T.prism}, pbrick:{side:T.pbrick}, pbrickD:{side:T.pbrickD},
    trim:{side:T.trim, top:T.pbrick}, col:{side:T.col, top:T.pbrick}, dark:{side:T.dark},
    lantern:{side:T.lantern, em:.75, halo:[0xBFF8FF,3.6,.6]}, arch:{side:T.arch, em:.6}, glass:{side:T.glass, alpha:.24},
    coralP:{side:T.coralP, em:.12}, coralO:{side:T.coralO, em:.12}, coralV:{side:T.coralV, em:.18}, coralY:{side:T.coralY, em:.12}, coralB:{side:T.coralB, em:.15},
    brain:{side:T.brain}, sponge:{side:T.sponge}, kelp:{side:T.kelp}, kelpL:{side:T.kelpL}, grassS:{side:T.grassS},
    planks:{side:T.planks}, planksD:{side:T.planksD}, hull:{side:T.hull}, sail:{side:T.sail},
    gold:{side:T.gold, em:.35}, pearl:{side:T.pearl, em:.45, halo:[0xFFFFFF,1.6,.3]}, shell:{side:T.shell}, shellIn:{side:T.shellIn, em:.1}, iron:{side:T.iron},
    star:{side:T.star}, urchin:{side:T.urchin}
  };
  const W=88, D=66, G=5;
  const S = {
    grammar:   {x:44, z:26, r:14, col:0x7FE3FF, ort:"Coral Palace"},
    vocabulary:{x:15, z:46, r:9,  col:0x7CFF9A, ort:"Kelp Garden"},
    country:   {x:71, z:47, r:10, col:0xFFC44A, ort:"Sunken Ship"}
  };
  const near = (x,z,r) => Object.values(S).some(s=>Math.hypot(s.x-x,s.z-z) < s.r + r);

  // ---------- Meeresboden: unregelmäßige Fläche, Dünen, Riffrücken, Felsen; Rand geht weich in die Ferne über ----------
  const X0=-30, X1=W+30, Z0=-24, Z1=D+30;
  const edge = (x,z) => { const cx=W/2, cz=D/2+2, a=Math.atan2(z-cz,(x-cx)*.78), r=Math.hypot((x-cx)*.78, z-cz), R = 52 + vn(Math.cos(a)*2+3, Math.sin(a)*2+7)*16; return r/R; };
  const H = (x,z) => { const e = edge(x,z); let h = G - .4 + fbm(x*.07,z*.07)*2.2 + Math.sin(x*.35+Math.sin(z*.2)*2)*.35;
    const back = Math.max(0, (14 - z)/14) * (.5+fbm(x*.08+5,z*.1)); h += back*16;                              // Felsrücken hinten, unregelmäßig
    const reef = Math.max(0, fbm(x*.06+9,z*.06+2)-.62)*26*Math.max(0,Math.min(1,(D-6-z)/16)); h += reef;
    for(const s of Object.values(S)){ const d=Math.hypot(x-s.x,z-s.z); if(d < s.r+3) h = G + (d>s.r ? (d-s.r)*.6 : 0); }
    if(e > .85) h = h + (G - h)*Math.min(1,(e-.85)/.15);                                                       // weicher Übergang zum Rand
    return Math.max(1,h); };
  for(let z=Z0; z<=Z1; z++) for(let x=X0; x<=X1; x++){ if(edge(x,z)>1) continue; const h=Math.round(H(x,z));
    for(let y=Math.max(0,h-4); y<h; y++){ const top = y===h-1; set(x,y,z, top ? (h>G+3 ? (rand()<.25?"prism":"rock") : "sand") : (y>h-3 && h<=G+3 ? "sandstone" : (rand()<.3?"rockD":"rock"))); } }

  // ---------- Riffbausteine ----------
  const CC = ["coralP","coralO","coralV","coralY","coralB"];
  const branch = (x,y,z,t,h=4,spread=2) => { const go=(px,py,pz,len,depth)=>{ if(depth>3||len<1) return; const a=rand()*Math.PI*2, el=.55+rand()*.4, ex=px+Math.cos(a)*len*(1-el)*1.2, ez=pz+Math.sin(a)*len*(1-el)*1.2, ey=py+len*el;
      line(px,py,pz,ex,ey,ez,t); fs(ex,ey+.5,ez,t); go(ex,ey,ez,len*.7,depth+1); if(rand()<.7) go(ex,ey,ez,len*.6,depth+1); };
    for(let i=0;i<spread;i++) go(x,y,z,h*.6,0); };
  const brain = (x,y,z,r) => { dome(x,y,z,r,"brain"); };
  const fan = (x,y,z,t,h=4) => { const a = rand()*Math.PI, dx=Math.cos(a), dz=Math.sin(a);
    for(let i=-h;i<=h;i++) for(let j=0;j<=h*1.6;j++){ const w = h*Math.sqrt(Math.max(0,1-(j/(h*1.6+.5))**2))*1.1; if(Math.abs(i)>w*2) continue; if((i+j)%3===0 || Math.abs(i)===Math.floor(w*2)) fs(x+.5+dx*i*.5, y+j*.5, z+.5+dz*i*.5, t); }
    fs(x+.5,y,z+.5,t); };
  const tubes = (x,y,z) => { for(let i=0;i<4;i++){ const ox=x+Math.round((rand()-.5)*3), oz=z+Math.round((rand()-.5)*3), h=2+Math.floor(rand()*4);
      for(let k=0;k<h;k++) set(ox,y+k,oz,"sponge"); fs(ox+.5,y+h,oz+.5,"sponge"); } };
  const anemone = (x,y,z,t) => { fs(x+.5,y,z+.5,t); for(let i=0;i<10;i++){ const a=i/10*Math.PI*2; for(let k=1;k<=3;k++) fs(x+.5+Math.cos(a)*k*.35, y+k*.5, z+.5+Math.sin(a)*k*.35, t); } };
  const kelp = (x,y,z,hh) => { let cx=x+.5, cz=z+.5; for(let i=0;i<hh;i++){ fs(cx,y+i*.5,cz,"kelp"); fs(cx,y+i*.5+.25,cz,"kelp");
      if(i%3===1){ const s=(i%6===1)?1:-1; fs(cx+.5*s,y+i*.5,cz,"kelpL"); fs(cx+1*s,y+i*.5+.5,cz,"kelpL"); fs(cx+.5*s,y+i*.5+.5,cz+.5,"kelpL"); }
      if(i%8===7) cx += (rand()<.5?.5:-.5); } };
  const seagrass = (x,y,z) => { for(let i=0;i<5;i++){ const ox=x+(rand()-.5)*1.6, oz=z+(rand()-.5)*1.6, h=2+Math.floor(rand()*4); for(let k=0;k<h;k++) fs(ox,y+k*.5,oz,"grassS"); } };
  const starfish = (x,y,z) => { const c=pick(["star","coralP","coralY"]); fs(x+.5,y,z+.5,c); for(let i=0;i<5;i++){ const a=i/5*Math.PI*2; fs(x+.5+Math.cos(a)*.5,y,z+.5+Math.sin(a)*.5,c); fs(x+.5+Math.cos(a),y,z+.5+Math.sin(a),c); } };
  const urchin = (x,y,z) => { fs(x+.5,y,z+.5,"urchin"); for(const [a,b,c] of [[1,0,0],[-1,0,0],[0,1,0],[0,0,1],[0,0,-1],[.5,.5,.5],[-.5,.5,-.5]]) fs(x+.5+a*.5,y+b*.5,z+.5+c*.5,"urchin"); };

  // ---------- Grammar: Korallenpalast ----------
  { const {x,z} = S.grammar, y=G;
    // dreistufige runde Terrasse mit Goldkante und Treppen
    for(const [r,dy] of [[13.5,0],[11.5,1],[9.6,2]]){ disk(x,y+dy,z,r,"pbrickD"); ring(x,y+dy,z,r,"trim"); }
    for(const dir of [[0,1],[0,-1],[1,0],[-1,0]]) for(let s=0;s<4;s++){ const d=13.5+1-s; for(let w=-2;w<=2;w++) set(x+dir[0]*d+dir[1]*w, y+Math.min(2,s)-1+ (s>2?1:0), z+dir[1]*d+dir[0]*w, "pbrick"); }
    // Säulenhalle: 16 kannelierte Säulen, Architrav mit Perlen
    for(let i=0;i<16;i++){ const a=i/16*Math.PI*2, px=Math.round(x+Math.cos(a)*8.6), pz=Math.round(z+Math.sin(a)*8.6); fill(px,y+3,pz,px,y+10,pz,"col"); set(px,y+3,pz,"trim"); set(px,y+11,pz,"trim"); }
    ring(x,y+12,z,9.2,"trim",2); ring(x,y+13,z,9.2,(a,b,c)=>((a+c)%2?"pbrick":null));
    for(let i=0;i<32;i++){ const a=i/32*Math.PI*2; fs(x+.5+Math.cos(a)*9.6,y+12,z+.5+Math.sin(a)*9.6,"pearl"); }
    // Rotunde mit Bogenfenstern
    cyl(x,y+3,z,6,16,(a,b,c)=> (b-y)%5===0 ? "trim" : "pbrick");
    for(let k=0;k<8;k++){ const an=k/8*Math.PI*2; for(const hh of [5,6,11,12]){ set(Math.round(x+Math.cos(an)*6),y+hh,Math.round(z+Math.sin(an)*6),"arch"); } }
    // Glaskuppel mit Rippen und Krone
    dome(x,y+19,z,6.5,"glass",true); for(let k=0;k<8;k++){ const an=k/8*Math.PI*2; for(let t=0;t<=10;t++){ const th=t/10*Math.PI/2; set(Math.round(x+Math.cos(an)*6.5*Math.cos(th)),Math.round(y+19+6.5*Math.sin(th)),Math.round(z+Math.sin(an)*6.5*Math.cos(th)),"trim"); } }
    ring(x,y+19,z,6.8,"trim"); cone(x,y+26,z,2,9,"prism"); fs(x+.5,y+35,z+.5,"gold"); set(x,y+36,z,"pearl"); for(let i=0;i<8;i++){ const a=i/8*Math.PI*2; fs(x+.5+Math.cos(a)*2.2,y+26,z+.5+Math.sin(a)*2.2,"gold"); }
    // vier Minarette mit Balkonen und Zwiebelkuppeln
    for(const [a,c] of [[-11,-9],[11,-9],[-11,9],[11,9]]){ const tx=x+a, tz=z+c, b=y+(Math.abs(c)===9?1:1);
      cyl(tx,b,tz,1.7,20,(xx,yy,zz)=> (yy-b)%4===0 ? "trim" : "pbrick"); for(const hh of [7,14]){ ring(tx,b+hh,tz,2.6,"trim"); for(let i=0;i<10;i++){ const an=i/10*Math.PI*2; fs(tx+.5+Math.cos(an)*2.6,b+hh+1,tz+.5+Math.sin(an)*2.6,"gold"); } }
      for(const hh of [4,10,17]) set(tx+(a>0?-2:2),b+hh,tz,"arch");
      ellip(tx,b+22,tz,2.6,2.4,2.6,"prism"); cone(tx,b+24,tz,1.4,4,"prism"); set(tx,b+28,tz,"pearl"); fs(tx+.5,b+29,tz+.5,"gold"); }
    // Eingangstor mit Muschelbogen, Laternen und Wächterstatuen
    for(let a=-3;a<=3;a++) for(let b=0;b<9;b++){ const inside = b<6 || Math.hypot(a,b-6)<2.6; if(inside){ set(x+a,y+3+b,z+6,"dark"); set(x+a,y+3+b,z+7,null); } }
    for(let i=0;i<=12;i++){ const th=i/12*Math.PI, ax=x+Math.cos(th)*3.6, ay=y+9+Math.sin(th)*3.6; fs(ax+.5,ay,z+7.75,"shell"); fs(ax+.5,ay+.5,z+7.75,"shellIn"); }
    for(const a of [-5,5]){ fill(x+a,y+3,z+8,x+a,y+8,z+8,"col"); set(x+a,y+9,z+8,"lantern");
      fill(x+a,y+3,z+12,x+a,y+4,z+12,"trim"); ellip(x+a,y+6,z+12,1,1.6,1,"prism"); set(x+a,y+8,z+12,"prism"); fs(x+a+.5,y+9,z+12.5,"gold"); for(let k=0;k<6;k++) fs(x+a+(a>0?-.5:1.5),y+5+k*.5,z+12.5,"gold"); }   // Wächter mit Dreizack
    for(let b=14;b<=20;b++){ fill(x-2,y-1,z+b,x+2,y-1,z+b,"pbrick"); if(b%3===0){ set(x-3,y,z+b,"trim"); set(x-3,y+1,z+b,"lantern"); set(x+3,y,z+b,"trim"); set(x+3,y+1,z+b,"lantern"); } }
    // Korallen im Palastgarten
    for(let i=0;i<14;i++){ const a=i/14*Math.PI*2+.2, r=11+rand()*1.5; const px=Math.round(x+Math.cos(a)*r), pz=Math.round(z+Math.sin(a)*r); if(pz>z+9 && Math.abs(px-x)<4) continue;
      const t=topAt(px,pz,40)+1; if(i%3===0) fan(px,t,pz,pick(CC),2); else if(i%3===1) anemone(px,t,pz,pick(["coralP","coralV"])); else seagrass(px,t,pz); }
    S.grammar.top=[x,y+38,z]; S.grammar.base=y+16; S.grammar.cam={pos:[x-22,y+20,z+56], look:[x+18,y+14,z]}; }

  // ---------- Vocabulary: Kelpgarten mit Riesenmuschel ----------
  { const {x,z} = S.vocabulary, y=G;
    // Riesenmuschel mit Rippen, rosa Innenseite und leuchtender Perle
    for(let a=-5;a<=5;a++) for(let b=-4;b<=4;b++){ const d=Math.hypot(a/5,b/4); if(d<=1){ set(x+a,y,z+b, d>.82 ? "shell" : "shellIn"); if(d>.82) set(x+a,y+1,z+b,"shell"); } }
    for(let a=-5;a<=5;a++) for(let hh=1;hh<=8;hh++){ const d=Math.hypot(a/5,(hh-1)/7); if(d<=1 && d>.74){ set(x+a,y+hh,z-4,"shell"); set(x+a,y+hh,z-3, d>.86 ? "shell" : "shellIn"); } }
    for(let a=-5;a<=5;a+=2) for(let hh=1;hh<=8;hh++){ const d=Math.hypot(a/5,(hh-1)/7); if(d<=1) fs(x+a+.5,y+hh,z-4.25,"shell"); }
    ball(x,y+2,z,1.4,"pearl");
    // Kelpwald: hohe Stängel mit Blättern
    for(let i=0;i<22;i++){ const a=rand()*Math.PI*2, r=5.5+rand()*4; const kx=Math.round(x+Math.cos(a)*r), kz=Math.round(z+Math.sin(a)*r*.8); if(kz>z+1 && Math.abs(kx-x)<7) continue; kelp(kx, topAt(kx,kz,30)+1, kz, 18+Math.floor(rand()*18)); }
    // Korallen ringsum
    for(let i=0;i<12;i++){ const a=rand()*Math.PI*2, r=5+rand()*4, px=Math.round(x+Math.cos(a)*r), pz=Math.round(z+Math.sin(a)*r), t=topAt(px,pz,30)+1;
      [()=>branch(px,t,pz,pick(CC),4,2), ()=>brain(px,t-1,pz,1.6+rand()), ()=>fan(px,t,pz,pick(CC),3), ()=>tubes(px,t,pz), ()=>anemone(px,t,pz,pick(CC))][i%5](); }
    for(let i=0;i<8;i++) starfish(x-6+Math.floor(rand()*13), y, z+4+Math.floor(rand()*4));
    S.vocabulary.top=[x,y+14,z]; S.vocabulary.base=y+3; S.vocabulary.cam={pos:[x+2,y+34,z+50], look:[x+18,y+2,z-6]}; }

  // ---------- Country & people: gesunkene Galeone mit Schatz ----------
  { const {x,z} = S.country, y=G, L=13;
    const tiltZ = zz => Math.round((zz-z)*.18);                                   // liegt leicht schief
    for(let a=-L;a<=L;a++){ const f=a/(L+1), w = 4.2*Math.sqrt(Math.max(0,1-f*f)) + (a<-L+4 ? .6 : 0), hgt = 6 + (a<-L+5 ? 3 : 0) + (a>L-3 ? 1 : 0);
      for(let hh=0; hh<=hgt; hh++){ const ww = Math.round(w*(.55+Math.min(hh,5)*.09)); for(let b=-ww;b<=ww;b++){ if(hh===0 || Math.abs(b)===ww) set(x+a,y+hh+tiltZ(z+b),z+b, hh===0 ? "planksD" : (hh===4 ? "planksD" : "hull")); } }
      if(a>-L+4 && a<L-2 && (a<-2 || a>2)) { const ww=Math.round(w*1); fill(x+a,y+5+tiltZ(z),z-ww+1,x+a,y+5+tiltZ(z),z+ww-1,"planks"); }   // Deck mit Loch in der Mitte
      if(a%3===0 && Math.abs(a)<L-2) for(const s of [-1,1]){ const ww=Math.round(w*(.55+3*.09)); set(x+a,y+3+tiltZ(z+ww*s),z+ww*s,"dark"); fs(x+a+.5,y+3.25+tiltZ(z+ww*s),z+ww*s+(s>0?1:-.5),"iron"); }   // Kanonen
      fs(x+a+.5,y-.5,z+.5,"planksD"); }
    // Achterkastell mit Fenstern, Ruder, Bug mit Galionsfigur
    for(let b=-3;b<=3;b++) for(let hh=6;hh<=9;hh++) set(x-L,y+hh+tiltZ(z+b),z+b, (hh===7 && b%2===0) ? "lantern" : "hull");
    fill(x-L-1,y+1,z,x-L-1,y+7,z,"planksD"); fill(x+L+1,y+5,z,x+L+4,y+7,z,"planks"); fs(x+L+5,y+6.5,z+.5,"gold"); fs(x+L+5,y+7,z+.5,"gold");
    // Masten: einer steht mit zerrissenem Segel und Ausguck, einer ist umgestürzt
    const m1=x-4; for(let hh=5;hh<24;hh++) set(m1,y+hh+tiltZ(z),z,"planksD");
    fill(m1,y+20+tiltZ(z),z-6,m1,y+20+tiltZ(z),z+6,"planksD"); fill(m1,y+13+tiltZ(z),z-7,m1,y+13+tiltZ(z),z+7,"planksD");
    for(let hh=0;hh<6;hh++) for(let b=-6;b<=6;b++) if(rand()< (hh<3?.9:.55)) fs(m1+.75,y+19.5-hh,z+b+.5,"sail");
    for(let hh=0;hh<7;hh++) for(let b=-6;b<=6;b++) if(rand()<.7) for(const dd of [0,.5]) fs(m1+.75,y+12.5-hh-dd,z+b+.5,"sail");
    ring(m1,y+24+tiltZ(z),z,1.6,"planks"); fs(m1+.5,y+25+tiltZ(z),z+.5,"iron");
    for(const s of [-1,1]) for(let k=0;k<18;k++){ fs(m1+.5-k*.5, y+20-k*.8+tiltZ(z), z+.5+s*(6-k*.2), "iron"); }    // Wanten
    line(x+5,y+6,z+1,x+18,y+1,z+6,"planksD"); for(let k=0;k<10;k++) fs(x+8+k*.8,y+5-k*.35,z+2+k*.25,"sail");
    // Schatztruhe offen mit Münzen, Fässer, Anker mit Kette
    const cx=x+6, cz=z-8; fill(cx,y,cz,cx+2,y+1,cz+1,"planksD"); fs(cx+.5,y+2,cz+.5,"gold"); fs(cx+1.5,y+2,cz+.5,"gold"); fs(cx+2.5,y+2,cz+.5,"gold"); fill(cx,y+2,cz-1,cx+2,y+2,cz-1,"planksD");
    for(let i=0;i<30;i++) fs(cx+1.5+(rand()-.5)*6, y, cz+1+(rand()-.5)*4, rand()<.85?"gold":"pearl");
    for(const [bx,bz] of [[x+9,z+7],[x-9,z+8],[x+11,z+8]]){ fill(bx,y,bz,bx,y+1,bz,"planks"); fs(bx+.5,y+.5,bz+1,"iron"); }
    const ax=x+14, az=z+3; fill(ax,y,az,ax,y+6,az,"iron"); fill(ax-2,y+5,az,ax+2,y+5,az,"iron"); set(ax-2,y+1,az,"iron"); set(ax+2,y+1,az,"iron"); fill(ax-1,y,az,ax+1,y,az,"iron");
    for(let k=0;k<20;k++) fs(ax+.5-k*.45, y+6.5-Math.sin(k/20*Math.PI)*2-k*.05, az+.5-k*.1, "iron");
    // Bewuchs: Korallen, Seegras und Schwämme am Rumpf
    for(let i=0;i<26;i++){ const a=-L+Math.floor(rand()*L*2), b=(rand()<.5?-1:1)*Math.round(4.5*Math.sqrt(Math.max(0,1-(a/(L+1))**2))+1), t=topAt(x+a,z+b,30)+1;
      [()=>seagrass(x+a,t,z+b), ()=>branch(x+a,t,z+b,pick(CC),3,1), ()=>anemone(x+a,t,z+b,pick(CC)), ()=>fan(x+a,t,z+b,pick(CC),2)][i%4](); }
    S.country.top=[x,y+27,z]; S.country.base=y+8; S.country.cam={pos:[x-26,y+18,z+40], look:[x+18,y+6,z-2]}; }

  // ---------- Riff ringsum und Vordergrund ----------
  for(let i=0;i<340;i++){ const x=Math.floor(X0+rand()*(X1-X0)), z=Math.floor(Z0+rand()*(Z1-Z0)); if(near(x,z,2) || edge(x,z)>.95) continue; const t=topAt(x,z,60)+1; if(t<2||t>26) continue;
    if(Math.abs(x-44)<3 && z>S.grammar.z+12) continue;
    if(z>D+2 && rand()<.5) continue;
    const r=rand();
    if(r<.16) branch(x,t,z,pick(CC),3+Math.floor(rand()*3),2);
    else if(r<.26) brain(x,t-1,z,1.2+rand()*1.4);
    else if(r<.38) fan(x,t,z,pick(CC),2+Math.floor(rand()*2));
    else if(r<.46) tubes(x,t,z);
    else if(r<.56) anemone(x,t,z,pick(CC));
    else if(r<.72) seagrass(x,t,z);
    else if(r<.8){ if(z<D-4) kelp(x,t,z,10+Math.floor(rand()*20)); else seagrass(x,t,z); }
    else if(r<.88) starfish(x,t,z);
    else if(r<.93) urchin(x,t,z);
    else ellip(x,t,z,1+rand()*1.5,1+rand(),1+rand()*1.5,"rock"); }
  // eingestürzte Säulenbögen und Laternen am Weg
  for(const [bx,bz] of [[28,58],[60,60],[6,22],[84,22]]){ const t=topAt(bx,bz,60)+1; fill(bx,t,bz,bx,t+7,bz,"col"); set(bx,t+8,bz,"trim"); fill(bx+5,t,bz,bx+5,t+4,bz,"col"); line(bx,t+8,bz,bx+3,t+9,bz,"pbrick"); set(bx,t+9,bz,"lantern"); seagrass(bx+2,t,bz+1); }
  for(let z=S.grammar.z+22; z<D+20; z+=6) for(const lx of [40,48]){ const t=topAt(lx,z,40)+1; fill(lx,t,z,lx,t+2,z,"trim"); set(lx,t+3,z,"lantern"); }

  // ---------- Großes altes Wrack hinten links ----------
  { const gx=-24, gz=6, gy=3, L=17;
    for(let a=-L;a<=L;a++){ if(a>3 && a<7) continue; const w=Math.round(5*Math.sqrt(Math.max(0,1-(a/(L+1))**2))), tilt = a>5 ? 2 : 0;
      for(let hh=0;hh<=8;hh++){ const ww=Math.round(w*(.55+hh*.06)); for(let b=-ww;b<=ww;b++){ if(hh===0 || Math.abs(b)===ww) set(gx+a,gy+hh+tilt,gz+b, hh===5?"planksD":"hull"); } } }
    for(let hh=0;hh<16;hh++) set(gx-6,gy+9+hh,gz,"planksD"); for(let hh=0;hh<8;hh++) for(let b=-4;b<=4;b++) if(rand()<.6) set(gx-5,gy+12+hh,gz+b,"sail");
    for(let i=0;i<20;i++){ const x=gx-L+Math.floor(rand()*L*2), z=gz-5+Math.floor(rand()*10), t=topAt(x,z,40)+1; if(t>2) (i%2?seagrass:anemone)(x,t,z,pick(CC)); } }

  // ---------- Ferne: Riffrücken, Felsbogen, Felsnadel, Kelpwälder (grob, im Dunst) ----------
  const F = A.far; F.cell = 3;
  const fh = (x,z) => { let h = 4.5 + fbm(x*.05,z*.05)*3; const fade = Math.min(1, Math.max(0,(edge(x,z)-1.05)*2.5)) * (z>D ? Math.max(0,1-(z-D)/20) : 1); const ridge = Math.max(0, fbm(x*.022+11,z*.022+4)-.5)*90*fade; h += ridge; if(z<0) h += Math.min(16, -z*.12) * (.5+fbm(x*.04,z*.04)); return h; };
  A.farTerrain({ x0:-170, x1:W+170, z0:-190, z1:D+100, base:1, skip:(x,z)=> edge(x,z)<1.02 || fh(x,z) < 7, h: fh,
    top:(x,z,y,hc)=> y*3>14 ? (rand()<.25?"prism":"rock") : "sand", fill:(x,z,y,hc)=> y*3>10 ? (rand()<.3?"rockD":"rock") : "sandstone" });
  const fset = (x,y,z,t) => F.set(Math.floor(x/3),Math.floor(y/3),Math.floor(z/3),t);
  { const cx=140, cz=-10, cy=4; for(let a=0;a<=Math.PI;a+=.04){ const x=cx+Math.cos(a)*22, y=cy+Math.sin(a)*30; for(let k=-2;k<=2;k++) for(let t=-3;t<=3;t+=3) fset(x+t,y,cz+k*3, (k+t)%3?"rock":"prism"); } }
  { const cx=30, cz=-70; for(let y=0;y<70;y+=3){ const r=12*(1-y/80)+fbm(y*.1,3)*3; for(let a=-r;a<=r;a+=3) for(let b=-r;b<=r;b+=3) if(a*a+b*b<=r*r) fset(cx+a,y,cz+b, y>50?"prism":"rock"); } }
  for(let i=0;i<90;i++){ const x=-170+rand()*(W+340), z=-190+rand()*(D+250); if(edge(x,z)<1.1) continue; const t=fh(x,z); if(t>12) continue; const hh=6+rand()*18; for(let y=t;y<t+hh;y+=3) fset(x,y,z,"kelp"); }

  // ---------- Tiere ----------
  const creatures = [];
  [["clown",[44,16,40],[26,16],.25,0],["yellow",[28,12,50],[14,10],.32,1.5],["tang",[62,14,30],[18,12],.28,3],["pink",[48,22,48],[30,16],.2,4.2],["tang",[-10,14,20],[18,12],.22,2],["yellow",[100,12,24],[18,12],.26,5]].forEach(([k,ctr,rad,sp,ph])=>{
    for(let i=0;i<7;i++) creatures.push({ ...fish(k), orbit:{c:[ctr[0]+((i*3)%5)-2, ctr[1]+(i%3)*1.4, ctr[2]+((i*7)%5)-2], r:rad, speed:sp, ph:ph+i*.12, bob:.5}, scale:.36, noShadow:true }); });
  creatures.push({ ...dolphin(), orbit:{c:[44,20,24], r:[78,52], speed:.1, ph:.6, bob:3.5, bank:.2}, scale:.2 });
  creatures.push({ ...dolphin(), orbit:{c:[44,20,24], r:[78,52], speed:.1, ph:.72, bob:3.5, bank:.2}, scale:.18 });
  creatures.push({ ...whale(), orbit:{c:[44,34,-18], r:[80,28], speed:.045, ph:2.6, bob:1.4, bank:.1, dir:-1}, scale:.55 });

  return {
    W, D, blocks, spots:S, exposure:1.2, fov:40,
    sky:[[0,"#5FD3F2"],[.3,"#2E9BD0"],[.6,"#0E5C8C"],[1,"#062A46"]], fog:[0x0E5C8C, 70, 260],
    hemi:[0x9FEFFF, 0x1A4A6A, 1.9], sun:{color:0xDFFBFF, int:1.6, pos:[-30,90,40]}, bloom:[.36,.45,.9],
    lights:[{pos:[S.grammar.x,G+22,S.grammar.z], color:0x7FE3FF, int:280, dist:36}, {pos:[S.vocabulary.x,G+3,S.vocabulary.z], color:0xFFFFFF, int:70, dist:14}],
    planes:[{y:G-.6, tex:T.sand, repeat:400, size:1000}, {y:150, tex:T.surface, repeat:60, size:400, em:.4, opacity:.35, anim:[.02,.01]}],
    rays:{n:28, color:0xBFF4FF, area:[-60,W+60,-60,D+20]},
    particles:[{n:520, area:[-20,W+20,2,70,-10,D+40], vy:2.2, wob:.8, color:0xE6FBFF, size:.34, opacity:.8},
               {n:380, area:[0,W,2,30,0,D], vy:0, wob:.3, color:0xA8F0D8, size:.18, opacity:.7, add:true, twinkle:true}],
    creatures,
    home:{pos:[W/2,30,D+58], look:[W/2,12,D/2-6]}, homePortrait:{pos:[W/2,48,D+108], look:[W/2,12,D/2-8]},
    ui:{bg:"rgba(4,34,58,.88)", border:"#7FE3FF", glow:"rgba(80,210,255,.5)", text:"#E8FBFF", sub:"#9FD7EA", accent:"#FF8A5A", "accent-ink":"#1A0E08", chip:"rgba(4,30,52,.8)"}
  };
}
