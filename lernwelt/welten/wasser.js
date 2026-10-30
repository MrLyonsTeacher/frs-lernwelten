// Klasse 6 · Water World – das versunkene Atlantis: Palast mit großer Rippenkuppel auf einer Insel inmitten von Ringkanälen und Ringmauern,
// Pavillons, Statue des Meerkönigs mit goldenem Dreizack, weißer Säulenturm, Kelpgarten mit Riesenmuschel, zerbrochene Galeone mit Krake
import { whale, dolphin } from "./tiere.js";
import { reefFish, bigJelly, octopus, manta, turtle, seahorse } from "./meer.js";
export function build(A){
  const { rand, fbm, vn, pick, set, get, fill, walls, disk, ring, cyl, tube, ball, ellip, dome, cone, line, topAt, tex, P, noise, stripes, bricks, rings, planks, glassT } = A;
  const FN = A.fine, fs = (x,y,z,t) => FN.set(Math.round(x*2),Math.round(y*2),Math.round(z*2),t);
  // feine Formen (halbe Blockgröße) für Statue und Verzierungen
  const fEll = (cx,cy,cz,rx,ry,rz,t) => { for(let i=Math.floor((cx-rx)*2);i<=Math.ceil((cx+rx)*2);i++) for(let j=Math.floor((cy-ry)*2);j<=Math.ceil((cy+ry)*2);j++) for(let k=Math.floor((cz-rz)*2);k<=Math.ceil((cz+rz)*2);k++){
      const x=i/2, y=j/2, z=k/2; if(((x-cx)/(rx+.2))**2+((y-cy)/(ry+.2))**2+((z-cz)/(rz+.2))**2<=1) FN.set(i,j,k, typeof t==="function" ? t(x,y,z) : t); } };
  const fSeg = (p,q,r0,r1,t) => { const n=Math.ceil(Math.hypot(q[0]-p[0],q[1]-p[1],q[2]-p[2])*3)||1; for(let s=0;s<=n;s++){ const f=s/n, r=r0+(r1-r0)*f; fEll(p[0]+(q[0]-p[0])*f, p[1]+(q[1]-p[1])*f, p[2]+(q[2]-p[2])*f, r, r, r, t); } };

  const T = {
    sand: tex(g=>{ for(let x=0;x<16;x++) for(let y=0;y<16;y++){ const v=Math.sin(y*.9+Math.sin(x*.5)*1.2); P(g,x,y, v>.6 ? pick(["#F0E2B4","#EADCAA"]) : pick(["#E2D19B","#DCCB92","#E7D7A2"])); } P(g,5,5,"#C8B482"); P(g,11,9,"#FFF4D0"); }),
    sandstone: stripes(["#D9C28A","#CDB57C","#E2CC96"], false),
    rock: tex(g=>{ for(let x=0;x<16;x++) for(let y=0;y<16;y++) P(g,x,y, pick(["#5E6F7A","#6B7C86","#53636D","#61727D"])); for(let i=0;i<10;i++) P(g,Math.floor(rand()*16),Math.floor(rand()*16),pick(["#4E8A6A","#6A9A7A"])); }),
    rockD: noise(["#3E4E58","#46565E","#38464E"], 6, ["#2E3A42"]),
    prism: noise(["#5FB3A2","#4FA595","#6DC1AE","#3E8F82"], 6, ["#8ADCCA"]),
    // heller Marmor des Palastes
    marble: tex(g=>{ for(let x=0;x<16;x++) for(let y=0;y<16;y++) P(g,x,y, pick(["#F4F1EA","#EEEAE0","#F8F6F0","#E8E3D8"])); for(let i=0;i<5;i++){ let x=Math.floor(rand()*16), y=Math.floor(rand()*16); for(let k=0;k<5;k++){ P(g,x,y,"#D6D0C4"); x=(x+1)%16; y=(y+(rand()<.5?1:0))%16; } } }),
    marbleB: bricks(["#EEEAE0","#F4F1EA","#E6E1D6"], "#C9C2B2", 4, 8),
    skinF: noise(["#EBD6BE","#E6CFB4","#F0DCC6","#E2C9AE"], 4, ["#D4BA9C"]),
    skinB: noise(["#F6F2EA","#F0ECE2","#FAF7F0","#EAE5DA"], 6, ["#DCD6C8"]),
    beard: tex(g=>{ for(let x=0;x<16;x++) for(let y=0;y<16;y++){ const w=Math.sin(x*1.1+y*.5)>.2; P(g,x,y, w ? pick(["#C6BCAA","#CEC4B2"]) : pick(["#A89E8C","#B2A896","#9E9482"])); } }),
    scales: tex(g=>{ for(let y=0;y<16;y++) for(let x=0;x<16;x++){ const yy=y%4, xx=(x+(Math.floor(y/4)%2)*2)%4; P(g,x,y, yy===3 || (yy===2 && (xx===0||xx===3)) ? "#86B4A8" : (yy===0 ? pick(["#E6F4EE","#DCEEE6"]) : pick(["#BCDCD0","#C6E2D8","#B2D4C8"]))); } }),
    marbleD: noise(["#DCD5C6","#D2CBBB","#E2DCCF"], 6, ["#BDB5A4"]),
    marbleS: tex(g=>{ for(let y=0;y<16;y++) for(let x=0;x<16;x++){ const yy=y%4, xx=(x+(Math.floor(y/4)%2)*2)%4; P(g,x,y, yy===3 || (yy===2 && (xx===0||xx===3)) ? "#B8D8D4" : pick(["#E8F4F0","#DCEEEA","#F2FAF8"])); } }),
    pillar: tex(g=>{ for(let x=0;x<16;x++){ const c = x%4===0 ? "#CFC8BA" : x%4===1 ? "#F8F6F0" : x%4===2 ? "#EEEAE0" : "#E2DDD0"; for(let y=0;y<16;y++) P(g,x,y,c); } }),
    trim: tex(g=>{ for(let y=0;y<16;y++) for(let x=0;x<16;x++) P(g,x,y, y<2||y>13 ? "#E8C860" : (x%4===0 ? "#E0DACB" : "#F6F3EC")); }),
    domeD: tex(g=>{ for(let y=0;y<16;y++) for(let x=0;x<16;x++) P(g,x,y, (y%8===7) ? "#102A60" : pick(["#173F8F","#1A4699","#143882"])); }),
    domeA: tex(g=>{ for(let y=0;y<16;y++) for(let x=0;x<16;x++){ const sc = (y%4===3) || ((x+(Math.floor(y/4)%2)*4)%8===0); P(g,x,y, sc ? "#1E4FA8" : pick(["#2A66CC","#2E6ED6","#275EC0"])); } }),
    domeL: tex(g=>{ for(let y=0;y<16;y++) for(let x=0;x<16;x++){ const sc = (y%4===3) || ((x+(Math.floor(y/4)%2)*4)%8===0); P(g,x,y, sc ? "#2E7AD0" : pick(["#4A94E4","#5299E8","#4389DC"])); } }),
    rib: tex(g=>{ for(let y=0;y<16;y++) for(let x=0;x<16;x++) P(g,x,y, x<2||x>13 ? "#C8C0B0" : (y%4===0 ? "#E8C860" : pick(["#F6F3EC","#EEEAE0"]))); }),
    win: tex(g=>{ for(let x=0;x<16;x++) for(let y=0;y<16;y++) P(g,x,y, (x+y)%5===0 ? "#FFFFFF" : pick(["#7FE8FF","#9AF0FF","#5FD8F8"])); }),
    glowB: tex(g=>{ for(let x=0;x<16;x++) for(let y=0;y<16;y++){ const e=x<2||y<2||x>13||y>13; P(g,x,y, e ? "#E8E3D8" : (x===7||x===8||y===8) ? "#7FD8F0" : pick(["#C8FAFF","#B0F2FF","#E0FFFF"])); } }),
    canal: tex(g=>{ for(let x=0;x<16;x++) for(let y=0;y<16;y++){ const v=Math.sin(x*.7+y*.4)+Math.sin(y*.9-x*.3); P(g,x,y, v>1.3 ? "#7FE3FF" : v>.3 ? "#1A6AA8" : "#0E4E86"); } }),
    lantern: tex(g=>{ for(let x=0;x<16;x++) for(let y=0;y<16;y++){ const e=x<2||y<2||x>13||y>13; P(g,x,y, e?pick(["#8EDCE0","#A6E6EA"]):pick(["#F2FFFF","#DFFAFF","#FFFFFF"])); } }),
    crystal: noise(["#9AF4FF","#BFFAFF","#7FE8FF","#E0FFFF"], 6, ["#FFFFFF"]),
    coralP: noise(["#FF6FA0","#FF8AB3","#E85A8C","#FF9DC0"], 8, ["#FFD0E0"]), coralO: noise(["#FF8A3A","#FFA15A","#E8742A"], 8, ["#FFD0A0"]),
    coralV: noise(["#9A6CFF","#B08AFF","#7F52E8"], 8, ["#E0D0FF"]), coralY: noise(["#FFD23F","#FFE06A","#E8BC2A"], 8, ["#FFF4B0"]), coralB: noise(["#3FA0FF","#5AB4FF","#2A86E8"], 8, ["#C0E4FF"]),
    coralR: noise(["#E8404A","#F05A5A","#D02E3A","#FF6A6A"], 8, ["#FFB0B0"]),
    brain: tex(g=>{ for(let x=0;x<16;x++) for(let y=0;y<16;y++){ const v=Math.sin(x*1.3+Math.sin(y*.9)*2.2); P(g,x,y, v>.3 ? "#E8A86A" : v>-.4 ? "#D08850" : "#A86A3A"); } }),
    sponge: tex(g=>{ for(let x=0;x<16;x++) for(let y=0;y<16;y++) P(g,x,y, (x%4===1&&y%4===1) ? "#7A3A10" : pick(["#E8A030","#F0B040","#D89020"])); }),
    kelp: stripes(["#2F7A3A","#3A8F45","#27693A","#45A050"], true), kelpL: noise(["#4A9A3A","#5AAA44","#3E8A30","#6AB84A"], 6, ["#8ACC60"]),
    grassS: stripes(["#5AA848","#4E9A3E","#6ABA54"], true),
    planks: planks(["#7A5A3A","#866444","#6E5032"], "#4A3420"), planksD: planks(["#5A4028","#4E3620","#664A30"], "#2E2014"),
    hull: tex(g=>{ for(let y=0;y<16;y++) for(let x=0;x<16;x++) P(g,x,y, y%4===3 ? "#3A2818" : (rand()<.06 ? "#5E8A6A" : pick(["#6E5032","#7A5A3A","#634830"]))); }),
    sail: tex(g=>{ for(let y=0;y<16;y++) for(let x=0;x<16;x++) P(g,x,y, rand()<.08 ? "#B8B09A" : (x%6===0 ? "#CFC8B4" : pick(["#E8E4D8","#DAD5C6","#F2EFE6"]))); }),
    gold: noise(["#F5C542","#FFE27A","#E8B030","#FFD95A"]), pearl: noise(["#FFFFFF","#F2F6FF","#E6EEFF"]),
    shell: tex(g=>{ for(let x=0;x<16;x++) for(let y=0;y<16;y++) P(g,x,y, x%4===0 ? "#D8A898" : pick(["#F2D5C8","#E8C2B4","#FBE6DC"])); }), shellIn: noise(["#FFE8F0","#F8DCE8","#FFF2F6"]),
    iron: noise(["#6A6E74","#5E6268","#767A80"], 6, ["#8A5A3A"]), dark: noise(["#0E2A3A","#123244","#0A2230"]),
    surface: tex(g=>{ for(let x=0;x<16;x++) for(let y=0;y<16;y++){ const v=Math.sin(x*.8+y*.3)+Math.sin(y*.7-x*.5); P(g,x,y, v>1?"#BFF4FF":v>0?"#6FD3F0":"#3FB0DD"); } }),
    caust: tex(g=>{ for(let x=0;x<16;x++) for(let y=0;y<16;y++){ const v=Math.abs(Math.sin(x*.9+Math.sin(y*.6)*2)+Math.sin(y*.8-Math.cos(x*.5)*2)); P(g,x,y, v<.25 ? "rgba(255,255,255,.9)" : v<.5 ? "rgba(200,250,255,.35)" : "rgba(0,0,0,0)"); } }),
    star: noise(["#FF7A4A","#FF8A5A","#E86A3A"], 6, ["#FFD0A0"]), urchin: noise(["#3A2A5A","#4A3A6A","#2E2048"]),
    glowPl: noise(["#7CFFD8","#5AF0C8","#A0FFE6"], 4, ["#FFFFFF"])
  };
  const blocks = {
    sand:{side:T.sand}, sandstone:{side:T.sandstone, top:T.sand}, rock:{side:T.rock}, rockD:{side:T.rockD}, prism:{side:T.prism},
    marble:{side:T.marble}, marbleB:{side:T.marbleB, top:T.marble}, marbleD:{side:T.marbleD}, marbleS:{side:T.marbleS, em:.06}, pillar:{side:T.pillar, top:T.marble}, trim:{side:T.trim, top:T.marble},
    statue:{side:T.skinB, em:.05}, statueD:{side:T.beard, em:.03}, statueF:{side:T.skinF, em:.06}, statueT:{side:T.scales, em:.06},
    domeD:{side:T.domeD}, domeA:{side:T.domeA, em:.05}, domeL:{side:T.domeL, em:.08}, rib:{side:T.rib},
    glowB:{side:T.glowB, em:.7}, win:{side:T.win, em:.5}, canal:{side:T.canal, em:.3}, crystal:{side:T.crystal, em:.9, halo:[0xBFF8FF,7,.5]}, dark:{side:T.dark},
    lantern:{side:T.lantern, em:.75, halo:[0xBFF8FF,3.6,.6]},
    coralP:{side:T.coralP, em:.12}, coralO:{side:T.coralO, em:.12}, coralV:{side:T.coralV, em:.18}, coralY:{side:T.coralY, em:.12}, coralB:{side:T.coralB, em:.15}, coralR:{side:T.coralR, em:.12},
    brain:{side:T.brain}, sponge:{side:T.sponge}, kelp:{side:T.kelp}, kelpL:{side:T.kelpL}, grassS:{side:T.grassS}, glowPl:{side:T.glowPl, em:.8},
    planks:{side:T.planks}, planksD:{side:T.planksD}, hull:{side:T.hull}, sail:{side:T.sail},
    gold:{side:T.gold, em:.35}, goldG:{side:T.gold, em:.6, halo:[0xFFE27A,1.4,.25]}, pearl:{side:T.pearl, em:.45, halo:[0xFFFFFF,1.6,.3]}, shell:{side:T.shell}, shellIn:{side:T.shellIn, em:.1}, iron:{side:T.iron},
    star:{side:T.star}, urchin:{side:T.urchin}
  };
  const W=124, D=96, G=5;
  const PX=62, PZ=34;                                     // Mitte von Atlantis
  const S = {
    grammar:   {x:PX, z:PZ, r:26, col:0x7FE3FF, ort:"Palace of Atlantis"},
    vocabulary:{x:100,z:20, r:9,  col:0x7CFF9A, ort:"Kelp Garden"},
    country:   {x:104,z:70, r:11, col:0xFFC44A, ort:"Sunken Ship"}
  };
  const STATUE = [30, 80], TOWER = [18, 16], OCTO = [84, 90];
  const sx = v => PX+(v-44)*1.4, sz = v => PZ+(v-24)*1.4;          // Positionen der Tiere: weiträumig um den Palast verteilt
  const blocked = (x,z,r=0) => Object.values(S).some(s=>Math.hypot(s.x-x,s.z-z) < s.r + r) || Math.hypot(x-STATUE[0],z-STATUE[1]) < 9+r
    || Math.hypot(x-TOWER[0],z-TOWER[1]) < 6+r || Math.hypot(x-OCTO[0],z-OCTO[1]) < 5+r || (Math.abs(x-PX) < 5+r && z > PZ+20 && z < D+24);

  // ---------- Meeresboden ----------
  const X0=-34, X1=W+34, Z0=-26, Z1=D+30;
  const edge = (x,z) => { const cx=W/2, cz=D/2+2, a=Math.atan2(z-cz,(x-cx)*.74), r=Math.hypot((x-cx)*.74, z-cz), R = 76 + vn(Math.cos(a)*2+3, Math.sin(a)*2+7)*18; return r/R; };
  const H = (x,z) => { const e = edge(x,z); let h = G - .4 + fbm(x*.07,z*.07)*2.2 + Math.sin(x*.35+Math.sin(z*.2)*2)*.35;
    const back = Math.max(0, (8 - z)/14) * (.5+fbm(x*.08+5,z*.1)); h += back*18;
    const reef = Math.max(0, fbm(x*.06+9,z*.06+2)-.62)*26*Math.max(0,Math.min(1,(D-6-z)/16)); h += reef;
    for(const s of Object.values(S)){ const d=Math.hypot(x-s.x,z-s.z); if(d < s.r+3) h = G + (d>s.r ? (d-s.r)*.6 : 0); }
    for(const [sx,sz,r] of [[STATUE[0],STATUE[1],8],[TOWER[0],TOWER[1],6]]){ const d=Math.hypot(x-sx,z-sz); if(d<r+2) h = Math.min(h, G + Math.max(0,d-r)*.6); }
    if(Math.abs(x-PX) < 6 && z > PZ+20) h = G;
    if(e > .85) h = h + (G - h)*Math.min(1,(e-.85)/.15);
    return Math.max(1,h); };
  for(let z=Z0; z<=Z1; z++) for(let x=X0; x<=X1; x++){ if(edge(x,z)>1) continue; const h=Math.round(H(x,z));
    for(let y=Math.max(0,h-4); y<h; y++){ const top = y===h-1; set(x,y,z, top ? (h>G+3 ? (rand()<.25?"prism":"rock") : "sand") : (y>h-3 && h<=G+3 ? "sandstone" : (rand()<.3?"rockD":"rock"))); } }

  // ---------- Riffbausteine ----------
  const CC = ["coralP","coralO","coralV","coralY","coralB","coralR"];
  // Korallen aus halben Blöcken: Äste werden zur Spitze dünner, mit kleinen Knospen
  const branch = (x,y,z,t,h=4,spread=2) => { const go=(px,py,pz,len,depth,r)=>{ if(depth>3||len<.8) return; const a=rand()*Math.PI*2, el=.55+rand()*.4, ex=px+Math.cos(a)*len*(1-el)*1.2, ez=pz+Math.sin(a)*len*(1-el)*1.2, ey=py+len*el;
      fSeg([px,py,pz],[ex,ey,ez],r,r*.75,t); fEll(ex,ey+.2,ez,r*.9,r*.9,r*.9,t); go(ex,ey,ez,len*.7,depth+1,r*.75); if(rand()<.7) go(ex,ey,ez,len*.6,depth+1,r*.7); };
    for(let i=0;i<spread;i++) go(x+.5,y,z+.5,h*.6,0,.36); };
  // große Korallenbäume (Geweih- und Fächerkorallen)
  const coralTree = (x,y,z,t,h=10) => { const go=(px,py,pz,len,depth,r)=>{ if(depth>4||len<1) return; const a=rand()*Math.PI*2, el=.6+rand()*.32, ex=px+Math.cos(a)*len*(1-el)*1.4, ez=pz+Math.sin(a)*len*(1-el)*1.4, ey=py+len*el;
      fSeg([px,py,pz],[ex,ey,ez],r,r*.72,t);
      if(depth>=2) for(let k=0;k<2;k++) fEll(ex+(rand()-.5)*.8, ey+.3+rand()*.5, ez+(rand()-.5)*.8, .3,.3,.3, t);
      const n = depth<2 ? 3 : 2; for(let i=0;i<n;i++) go(ex,ey,ez,len*(.64+rand()*.12),depth+1, r*.72); };
    const r0 = h>=11 ? .5 : .42; go(x+.5,y,z+.5,h*.42,0,r0); go(x+.5,y,z+.5,h*.34,1,r0*.8); };
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
  const glowPlant = (x,y,z) => { for(let i=0;i<3;i++){ const ox=x+(rand()-.5)*1.4, oz=z+(rand()-.5)*1.4, h=2+Math.floor(rand()*3); for(let k=0;k<h;k++) fs(ox,y+k*.5,oz,"grassS"); fs(ox,y+h*.5,oz,"glowPl"); } };
  const starfish = (x,y,z) => { const c=pick(["star","coralP","coralY"]); fs(x+.5,y,z+.5,c); for(let i=0;i<5;i++){ const a=i/5*Math.PI*2; fs(x+.5+Math.cos(a)*.5,y,z+.5+Math.sin(a)*.5,c); fs(x+.5+Math.cos(a),y,z+.5+Math.sin(a),c); } };
  const urchin = (x,y,z) => { fs(x+.5,y,z+.5,"urchin"); for(const [a,b,c] of [[1,0,0],[-1,0,0],[0,1,0],[0,0,1],[0,0,-1],[.5,.5,.5],[-.5,.5,-.5]]) fs(x+.5+a*.5,y+b*.5,z+.5+c*.5,"urchin"); };

  // ---------- Bauteile von Atlantis ----------
  // Zwiebel-/Rippenkuppel: Profil wird erst breiter, dann rund zur Spitze; Rippen, Farbbänder, runde Fenster
  const onion = (cx,y0,cz,R,Hd,ribs=16,win=true) => {
    // in halber Blockgröße gebaut: viel rundere Form; Rippen, Zierbänder, abwechselnd helle/dunkle Bahnen, runde Fenster
    const rAt = u => R*(u<.16 ? .9+.1*Math.sin(u/.16*Math.PI/2) : Math.pow(Math.max(0,Math.cos((u-.16)/.84*Math.PI/2)),.58));
    const bands = R>6 ? [.3,.62] : [.5], c0x = cx+.5, c0z = cz+.5;
    for(let j=Math.round(y0*2); j<=Math.round((y0+Hd)*2); j++){ const yc=j/2+.25, u=Math.max(0,(yc-y0)/Hd), r=rAt(u), r2=rAt(Math.min(1,u+.5/Hd)), th=Math.max(1.05, Math.abs(r-r2)+.6);
      if(r < .5){ FN.set(Math.floor(c0x*2),j,Math.floor(c0z*2),"rib"); continue; }
      for(let i=Math.floor((c0x-r-1)*2); i<=Math.ceil((c0x+r+1)*2); i++) for(let k=Math.floor((c0z-r-1)*2); k<=Math.ceil((c0z+r+1)*2); k++){
        const xc=i/2+.25, zc=k/2+.25, d=Math.hypot(xc-c0x,zc-c0z); if(d>r || d<=r-th) continue;
        const a=Math.atan2(zc-c0z,xc-c0x), q=(a/(Math.PI*2))*ribs+ribs, f=(q+.5)%1, sec=Math.floor(q+.5)%ribs, ad=Math.abs(f-.5)*Math.PI*2*Math.max(d,1)/ribs;
        let t;
        if(ad < .3) t = "rib";
        else if(bands.some(b=>Math.abs(u-b)<.36/Hd)) t = "rib";
        else if(win && u>.38 && u<.5 && ad>1.5) t = "win";
        else if(u<.08) t = "domeD";
        else t = sec%2 ? "domeA" : "domeL";
        FN.set(i,j,k,t); } }
    ring(cx,y0,cz,rAt(0)+.4,"trim"); return y0+Hd; };
  // runder Pavillon mit Säulen und kleiner blauer Kuppel
  const gazebo = (x,y,z,r=2.5,h=5) => { disk(x,y,z,r+.6,"marbleB"); ring(x,y,z,r+.6,"trim");
    const n = r>3 ? 8 : 6; for(let i=0;i<n;i++){ const a=i/n*Math.PI*2, px=Math.round(x+Math.cos(a)*r), pz=Math.round(z+Math.sin(a)*r); fill(px,y+1,pz,px,y+h,pz,"pillar"); }
    ring(x,y+h+1,z,r+.6,"trim",2); const top = onion(x,y+h+2,z,r+.4,Math.round(r*1.9),8,false); fs(x+.5,top+1,z+.5,"goldG"); fs(x+.5,top+1.5,z+.5,"goldG"); set(x,y+1,z,"lantern"); return top; };
  // Säulenturm (kanneliert), optional abgebrochen
  const column = (x,y,z,h,r=1) => { if(r>1) cyl(x,y,z,r,h,"pillar"); else fill(x,y,z,x,y+h-1,z,"pillar"); set(x,y,z,"trim"); if(r>1) ring(x,y,z,r+.5,"trim"); };

  // ---------- Grammar: Palast von Atlantis auf der Insel inmitten der Ringe ----------
  { const x=PX, z=PZ, y=G;
    const R1=13.5, C1=16.5, R2=20.5, C2=23.5, R3=25.5;
    // Ringe ausheben/aufschütten: Insel, Kanal, Ringinsel, Kanal, Ringmauer
    for(let a=-28;a<=28;a++) for(let b=-28;b<=28;b++){ const d=Math.hypot(a,b); if(d>R3+.5) continue; const X=x+a, Z=z+b;
      for(let yy=y-3; yy<y+14; yy++) set(X,yy,Z,null);
      if(d<=R1){ for(let yy=y-3; yy<y+4; yy++) set(X,yy,Z, yy===y+3 ? "marble" : "marbleB"); }
      else if(d<=C1 || (d>R2 && d<=C2)){ set(X,y-4,Z,"canal"); if(Math.abs(d-C1)<.6 || Math.abs(d-R2)<.6 || Math.abs(d-R1)<.6 || Math.abs(d-C2)<.6) for(let yy=y-3; yy<y; yy++) set(X,yy,Z,"marbleB"); }
      else if(d<=R2){ for(let yy=y-3; yy<y+1; yy++) set(X,yy,Z, yy===y ? "marble" : "marbleB"); }
      else { for(let yy=y-3; yy<y; yy++) set(X,yy,Z,"marbleB"); } }
    // Kanten der Insel mit Goldband und Bogenfenstern
    ring(x,y+3,z,R1,"trim"); ring(x,y,z,R2,"trim"); ring(x,y,z,C1+.2,"trim");
    for(let i=0;i<24;i++){ const a=i/24*Math.PI*2; set(Math.round(x+Math.cos(a)*R1),y+1,Math.round(z+Math.sin(a)*R1),"glowB"); }
    // äußere Ringmauer mit Zinnen, Bögen und Tortürmen
    for(let h=0;h<6;h++) ring(x,y+h,z,R3,(X,Y,Z)=> h===5 ? ((X+Z)%2 ? "trim" : null) : (h>=2 && h<=3 && (X*7+Z*3)%5===0 ? "glowB" : "marbleB"), 2);
    const dirs = [[0,1],[1,0],[-1,0],[0,-1]];
    for(const [dx,dz] of dirs){ const gx=x+dx*R3, gz=z+dz*R3, px=dz, pz=dx;
      for(let w=-2;w<=2;w++) for(let h=0;h<5;h++) for(let k=-1;k<=1;k++) set(gx+px*w+dx*k, y+h, gz+pz*w+dz*k, (Math.abs(w)<2 || h<4) && h<4+(Math.abs(w)<1?1:0) ? null : "marbleB");
      for(const s of [-1,1]) gazebo(gx+px*s*4, y+5, gz+pz*s*4, 1.6, 4); }
    for(const [dx,dz] of [[.707,.707],[-.707,.707],[.707,-.707],[-.707,-.707]]) gazebo(Math.round(x+dx*R3), y+6, Math.round(z+dz*R3), 2, 4);
    // Brücken über die Kanäle (vorne breit mit Laternen)
    for(const [dx,dz] of dirs){ const wide = dz===1 ? 3 : 2;
      for(let r=R1-1; r<=R3+1; r++) for(let w=-wide; w<=wide; w++){ const X=x+dx*r+dz*w, Z=z+dz*r+dx*w, d=Math.hypot(X-x,Z-z);
        if(d>R1+.3){ set(X,y,Z, Math.abs(w)===wide ? "trim" : "marble"); set(X,y-1,Z,"marbleB"); if(Math.abs(w)===wide && r%3===0 && (d<C1+.5 || d>R2)){ set(X,y+1,Z,"pillar"); set(X,y+2,Z,"lantern"); } } }
      // Treppe hinauf zur Insel
      for(let s=0;s<3;s++) for(let w=-wide; w<=wide; w++){ const r=R1-s, X=x+dx*r+dz*w, Z=z+dz*r+dx*w; for(let yy=y; yy<=y+s+1; yy++) set(X,yy,Z, yy===y+s+1 ? "marble" : "marbleB"); set(X,y+s+2,Z,null); set(X,y+s+3,Z,null); } }
    // Ringinsel: Säulengang mit Pavillons und Korallengärten
    for(let i=0;i<48;i++){ const a=i/48*Math.PI*2; if(Math.abs(Math.sin(a*2))<.12 || Math.abs(Math.abs(Math.sin(a*2))-1)<.03) continue; const px=Math.round(x+Math.cos(a)*(R2-1)), pz=Math.round(z+Math.sin(a)*(R2-1)); if(i%2===0) fill(px,y+1,pz,px,y+4,pz,"pillar"); }
    for(let i=0;i<96;i++){ const a=i/96*Math.PI*2; if(Math.abs(Math.sin(a*2))<.12) continue; set(Math.round(x+Math.cos(a)*(R2-1)),y+5,Math.round(z+Math.sin(a)*(R2-1)),"trim"); }
    for(let i=0;i<8;i++){ const a=(i+.5)/8*Math.PI*2; gazebo(Math.round(x+Math.cos(a)*(C1+2)), y+1, Math.round(z+Math.sin(a)*(C1+2)), 1.6, 3); }
    // Inselplateau: Säulenhalle ringsum
    const y0 = y+4;
    for(let i=0;i<32;i++){ const a=i/32*Math.PI*2, px=Math.round(x+Math.cos(a)*12), pz=Math.round(z+Math.sin(a)*12); if(pz>z+9 && Math.abs(px-x)<5) continue; if(Math.abs(Math.abs(Math.sin(2*a))-1)<.1) continue; fill(px,y0,pz,px,y0+7,pz,"pillar"); }
    ring(x,y0+8,z,12.4,"trim",2); ring(x,y0+9,z,12.4,(a,b,c)=>((a+c)%2?"marbleB":null));
    for(let i=0;i<44;i++){ const a=i/44*Math.PI*2; fs(x+.5+Math.cos(a)*13,y0+8,z+.5+Math.sin(a)*13,"pearl"); }
    // Rundbau (Trommel) mit zwei Reihen leuchtender Bogenfenster
    tube(x,y0,z,10,15,(a,b,c)=> (b-y0)%7===0 ? "trim" : "marbleB", 2);
    for(let k=0;k<14;k++){ const an=(k+.5)/14*Math.PI*2; for(const hh of [2,3,4,9,10,11,12]) set(Math.round(x+Math.cos(an)*10),y0+hh,Math.round(z+Math.sin(an)*10),"glowB"); }
    for(let k=0;k<28;k++){ const an=k/28*Math.PI*2; if(k%2) fill(Math.round(x+Math.cos(an)*10.6),y0+8,Math.round(z+Math.sin(an)*10.6),Math.round(x+Math.cos(an)*10.6),y0+14,Math.round(z+Math.sin(an)*10.6),"pillar"); }
    // große Rippenkuppel
    const domeTop = onion(x,y0+15,z,13.5,18,16);
    // Laterne auf der Kuppel mit Kristall und goldener Spitze
    const ly = domeTop - 1; disk(x,ly,z,2.4,"marbleB"); for(let i=0;i<6;i++){ const a=i/6*Math.PI*2; fill(Math.round(x+Math.cos(a)*2),ly+1,Math.round(z+Math.sin(a)*2),Math.round(x+Math.cos(a)*2),ly+3,Math.round(z+Math.sin(a)*2),"pillar"); }
    fill(x,ly+1,z,x,ly+3,z,"crystal"); const lt = onion(x,ly+4,z,2.8,5,8,false); for(let k=1;k<=6;k++) fs(x+.5,lt+k*.5,z+.5,"goldG"); fs(x+.5,lt+3.5,z+.5,"pearl");
    // vier Ecktürme mit eigenen Kuppeln, Balkonen und Fenstern
    for(const [a,c] of [[-13,-13],[13,-13],[-13,13],[13,13]]){ const tx=Math.round(x+a), tz=Math.round(z+c), b=y+1;
      cyl(tx,b,tz,2.4,26,(xx,yy,zz)=> (yy-b)%5===0 ? "trim" : "marbleB");
      for(const hh of [4,9,14,19,23]) for(const [ox,oz] of [[2,0],[-2,0],[0,2],[0,-2]]) set(tx+ox,b+hh,tz+oz,"glowB");
      for(const hh of [12,26]){ ring(tx,b+hh,tz,3.2,"trim"); for(let i=0;i<12;i++){ const an=i/12*Math.PI*2; fs(tx+.5+Math.cos(an)*3.2,b+hh+1,tz+.5+Math.sin(an)*3.2,"gold"); } }
      const tt = onion(tx,b+26,tz,3.4,7,10,false); for(let k=1;k<=4;k++) fs(tx+.5,tt+k*.5,tz+.5,"goldG"); }
    // Haupttor vorne: hohe Bogenhalle mit Muschelbogen, leuchtender Durchgang
    { const gz = z+10; for(let a=-4;a<=4;a++) for(let b=0;b<15;b++) for(let c=0;c<=4;c++){ const inside = Math.abs(a)<=2 && (b<9 || Math.hypot(a,b-9)<2.6);
        set(x+a, y0+b, gz+c, inside ? (c===0 ? ((Math.abs(a)===2||b===8) ? "glowB" : "dark") : null) : (b===14||b===0 ? "trim" : (Math.abs(a)===4 ? "pillar" : "marbleB"))); }
      for(let i=0;i<=16;i++){ const th=i/16*Math.PI, ax=x+Math.cos(th)*3.2, ay=y0+9+Math.sin(th)*3.2; fs(ax+.5,ay,gz+5,"shell"); fs(ax+.5,ay+.5,gz+5,"shellIn"); }
      onion(x,y0+15,gz+2,4.4,7,10,false); fs(x+.5,y0+23,gz+2.5,"goldG");
      for(const s of [-1,1]) gazebo(x+s*7, y0, gz+4, 1.6, 4); }
    // Korallengärten auf der Ringinsel und am Plateaurand
    for(let i=0;i<16;i++){ const a=(i+.25)/16*Math.PI*2, r=C1+1.4+rand()*2; const px=Math.round(x+Math.cos(a)*r), pz=Math.round(z+Math.sin(a)*r); if(Math.abs(Math.sin(a*2))<.2) continue;
      const t=topAt(px,pz,y+3)+1; if(i%4===0) coralTree(px,t,pz,pick(["coralR","coralP","coralB"]),8); else if(i%4===1) fan(px,t,pz,pick(CC),2); else if(i%4===2) anemone(px,t,pz,pick(["coralP","coralV"])); else glowPlant(px,t,pz); }
    S.grammar.top=[x,lt+4,z]; S.grammar.base=y0+14; S.grammar.lift=2; S.grammar.cam={pos:[x-10,y+34,z+66], look:[x+20,y+18,z]}; }

  // ---------- Statue des Meerkönigs mit goldenem Dreizack (eigener Entwurf) ----------
  { const [sx,sz] = STATUE, K=1.18, base=G+3;
    // Felssockel mit Marmorstufe
    ellip(sx,G,sz,7.5,2.5,6.5,(X,Y,Z)=> rand()<.3 ? "rockD" : "rock"); cyl(sx,G+1,sz,5.2,2,"marbleB"); ring(sx,G+2,sz,5.2,"trim");
    const L = (x,y,z) => [sx+.5+x*K, base-2.2*K+y*K, sz+.5+z*K];
    const E = (x,y,z,rx,ry,rz,t) => { const p=L(x,y,z); fEll(p[0],p[1],p[2],rx*K,ry*K,rz*K,t); };
    const Sg = (a,b,r0,r1,t) => fSeg(L(...a),L(...b),r0*K,r1*K,t);
    // Fischschwanz, der sich über den Sockel windet, mit Schwanzflosse
    const tail = [[0,12,0,2.4],[.4,9.6,.5,2.25],[.6,7.2,1.3,2],[0,5,2.3,1.7],[-1.8,3.7,2.7,1.4],[-3.6,3.6,1.8,1.12],[-4.7,4.5,.3,.9],[-4.9,6,-1.1,.72]];
    for(let i=1;i<tail.length;i++) Sg(tail[i-1].slice(0,3), tail[i].slice(0,3), tail[i-1][3], tail[i][3], "statueT");
    for(const [dx,dz] of [[-1.4,-.6],[1.1,-.9]]){ Sg([-4.9,6,-1.1],[-4.9+dx,8.2,-1.1+dz],.6,.22,"statueT"); E(-4.9+dx*.6,7.4,-1.1+dz*.6,.75,.9,.25,"statueT"); }
    for(const s of [-1,1]) Sg([1.6*s,10.6,.6],[2.6*s,9.2,1.2],.45,.15,"statueT");      // Seitenflossen an der Hüfte
    // Gürtel, Bauch, Brust, Schultern
    E(0,12.1,0,2.6,.7,2,"gold");
    E(0,13.6,.3,2.2,1.6,1.5,"statue"); E(0,15.6,0,2.9,2.6,1.9,"statue");
    for(const s of [-1,1]){ E(1.25*s,16.6,.75,1.45,1.25,.95,"statue"); E(3*s,17.6,0,1.35,1.2,1.25,"statue"); }
    // Hals, Kopf, Bart, Haar, Krone
    Sg([0,18.3,0],[0,19.6,.2],1.05,1,"statue"); E(0,20.9,.25,1.5,1.8,1.6,"statueF");
    E(0,19.2,1.05,1.45,1.7,.95,"statueD"); Sg([0,18.2,1.3],[0,15.9,1.7],1.05,.3,"statueD");
    E(0,21,-.75,1.75,2,1.45,"statueD"); Sg([0,20.2,-1],[0,16.6,-1.7],1.45,.55,"statueD");
    for(const s of [-1,1]){ const p=L(.55*s,21.1,1.55); fEll(p[0],p[1],p[2],.28,.22,.22,"marbleD"); }       // Augen
    E(0,22.6,.15,1.55,.35,1.55,"gold");
    for(let i=0;i<10;i++){ const a=i/10*Math.PI*2, hh = i%2 ? 1.6 : .9; Sg([Math.cos(a)*1.45,22.7,.15+Math.sin(a)*1.45],[Math.cos(a)*1.55,22.7+hh,.15+Math.sin(a)*1.55],.32,.14,"gold"); }
    { const p=L(0,23.7,1.55); fEll(p[0],p[1],p[2],.4,.4,.4,"pearl"); }
    // rechter Arm hoch mit Dreizack, linker Arm in die Hüfte gestützt
    Sg([3.2,17.7,0],[4.6,20.1,.4],1.05,.92,"statue"); E(4,19.1,.25,1.05,1.25,1.05,"statue"); Sg([4.6,20.1,.4],[4.9,22.9,.8],.92,.72,"statue"); E(4.9,23.4,.8,.8,.85,.8,"statue");
    Sg([-3.2,17.7,0],[-4.5,15,.4],1.05,.9,"statue"); Sg([-4.5,15,.4],[-3.5,12.9,1.6],.9,.72,"statue"); E(-3.2,12.6,1.8,.8,.7,.8,"statue");
    // goldener Dreizack
    const tx=4.9, tz=.8; Sg([tx,4.5,tz],[tx,31,tz],.36,.36,"goldG");
    Sg([tx-1.9,30.2,tz],[tx+1.9,30.2,tz],.42,.42,"goldG"); E(tx,30.2,tz,.7,.55,.7,"goldG");
    Sg([tx,30.2,tz],[tx,35.4,tz],.38,.14,"goldG");
    for(const s of [-1,1]){ Sg([tx+1.9*s,30.2,tz],[tx+1.9*s,34,tz],.34,.14,"goldG"); Sg([tx+1.9*s,33.4,tz],[tx+1.3*s,32.6,tz],.2,.12,"goldG"); }
    Sg([tx,34.6,tz],[tx-.6,33.8,tz],.2,.12,"goldG"); Sg([tx,34.6,tz],[tx+.6,33.8,tz],.2,.12,"goldG");
    // Bewuchs am Sockel
    for(let i=0;i<14;i++){ const a=rand()*Math.PI*2, r=5.5+rand()*2.2, px=Math.round(sx+Math.cos(a)*r), pz=Math.round(sz+Math.sin(a)*r), t=topAt(px,pz,G+6)+1; [()=>anemone(px,t,pz,pick(CC)), ()=>seagrass(px,t,pz), ()=>fan(px,t,pz,pick(CC),2), ()=>glowPlant(px,t,pz)][i%4](); }
    coralTree(sx-6,G+1,sz-4,"coralR",11); coralTree(sx+6,G+1,sz-3,"coralB",9); }

  // ---------- Weißer Säulenturm (abgebrochen) mit Korallen obendrauf ----------
  { const [tx,tz] = TOWER, y=G;
    cyl(tx,y,tz,4.2,2,"marbleB"); ring(tx,y+1,tz,4.2,"trim");
    for(let h=2;h<30;h++){ const broken = h>24 && ((h-24)*2 > (Math.atan2(0,1)+3)) ; ring(tx,y+h,tz,3.2,(X,Y,Z)=>{ const a=Math.atan2(Z-tz,X-tx); if(h>24 && Math.sin(a*2+1)*3+27 < h) return null; return (Math.round((a+Math.PI)/(Math.PI*2)*16))%2 ? "pillar" : "marble"; }, 1.6); }
    for(const hh of [9,18]) ring(tx,y+hh,tz,3.8,"trim");
    for(let i=0;i<8;i++){ const a=i/8*Math.PI*2; set(Math.round(tx+Math.cos(a)*3.2),y+14,Math.round(tz+Math.sin(a)*3.2),"glowB"); }
    coralTree(tx,y+26,tz,"coralR",9); coralTree(tx+1,y+26,tz-1,"coralP",7); kelp(tx-2,y+26,tz+1,16); kelp(tx+2,y+26,tz+2,12);
    // umgestürzte Säulentrommeln
    for(const [ox,oz,len] of [[7,4,6],[-6,6,4]]){ for(let k=0;k<len;k++) ellip(tx+ox+k,y+1,tz+oz,0,1.6,1.6,"pillar"); }
    gazebo(tx-9, y, tz+6, 2.2, 5); }

  // ---------- Vocabulary: Kelpgarten mit Riesenmuschel ----------
  { const {x,z} = S.vocabulary, y=G, k=1.3;
    for(let a=-7;a<=7;a++) for(let b=-5;b<=5;b++){ const d=Math.hypot(a/(5*k),b/(4*k)); if(d<=1){ set(x+a,y,z+b, d>.82 ? "shell" : "shellIn"); if(d>.82) set(x+a,y+1,z+b,"shell"); } }
    for(let a=-7;a<=7;a++) for(let hh=1;hh<=10;hh++){ const d=Math.hypot(a/(5*k),(hh-1)/(7*k)); if(d<=1 && d>.74){ set(x+a,y+hh,z-5,"shell"); set(x+a,y+hh,z-4, d>.86 ? "shell" : "shellIn"); } }
    for(let a=-6;a<=6;a+=2) for(let hh=1;hh<=10;hh++){ const d=Math.hypot(a/(5*k),(hh-1)/(7*k)); if(d<=1) fs(x+a+.5,y+hh,z-5.25,"shell"); }
    ball(x,y+2,z,1.8,"pearl");
    for(let i=0;i<26;i++){ const a=rand()*Math.PI*2, r=7+rand()*4; const kx=Math.round(x+Math.cos(a)*r), kz=Math.round(z+Math.sin(a)*r*.8); if(kz>z+1 && Math.abs(kx-x)<8) continue; kelp(kx, topAt(kx,kz,30)+1, kz, 22+Math.floor(rand()*22)); }
    for(let i=0;i<14;i++){ const a=rand()*Math.PI*2, r=6+rand()*4, px=Math.round(x+Math.cos(a)*r), pz=Math.round(z+Math.sin(a)*r), t=topAt(px,pz,30)+1;
      [()=>branch(px,t,pz,pick(CC),4,2), ()=>brain(px,t-1,pz,1.6+rand()), ()=>fan(px,t,pz,pick(CC),3), ()=>tubes(px,t,pz), ()=>anemone(px,t,pz,pick(CC)), ()=>glowPlant(px,t,pz)][i%6](); }
    for(let i=0;i<8;i++) starfish(x-6+Math.floor(rand()*13), y, z+5+Math.floor(rand()*3));
    S.vocabulary.top=[x,y+16,z]; S.vocabulary.base=y+3; S.vocabulary.cam={pos:[x+18,y+30,z+50], look:[x+16,y+4,z-6]}; }

  // ---------- Country & people: zerbrochene Galeone mit Schatz ----------
  { const {x,z} = S.country, y=G, L=17;
    // Heck (links) liegt gerade, Bug (rechts) ist abgebrochen, abgesackt und verdreht
    const off = a => a > 1 ? { dy: -Math.round((a-1)*.12), dz: Math.round((a-1)*.18), tilt: .32 } : { dy:0, dz:0, tilt:.14 };
    for(let a=-L;a<=L;a++){ if(a>=0 && a<=2) continue; const o=off(a), f=a/(L+1), w = 5*Math.sqrt(Math.max(0,1-f*f)) + (a<-L+4 ? .7 : 0), hgt = 7 + (a<-L+5 ? 4 : 0) + (a>L-3 ? 1 : 0);
      const tz = zz => Math.round((zz-z)*o.tilt);
      for(let hh=0; hh<=hgt; hh++){ const ww = Math.round(w*(.55+Math.min(hh,6)*.075)); for(let b=-ww;b<=ww;b++){ if(hh===0 || Math.abs(b)===ww){
        if((a===-1||a===3) && hh>2 && rand()<.45) continue;                                                         // ausgefranste Bruchkante
        set(x+a,y+hh+tz(z+b)+o.dy,z+b+o.dz, hh===0 ? "planksD" : (hh===5 ? "planksD" : "hull")); } } }
      if(a>-L+4 && a<L-2 && a!==-1 && a!==3){ const ww=Math.round(w); fill(x+a,y+6+tz(z)+o.dy,z-ww+1+o.dz,x+a,y+6+tz(z)+o.dy,z+ww-1+o.dz,"planks"); }
      if(a%3===0 && Math.abs(a)<L-2) for(const s of [-1,1]){ const ww=Math.round(w*(.55+3*.075)); set(x+a,y+3+tz(z+ww*s)+o.dy,z+ww*s+o.dz,"dark"); fs(x+a+.5,y+3.25+tz(z+ww*s)+o.dy,z+ww*s+o.dz+(s>0?1:-.5),"iron"); } }
    // Achterkastell mit leuchtenden Fenstern, Laterne am Heck
    for(let b=-4;b<=4;b++) for(let hh=7;hh<=11;hh++) set(x-L,y+hh+Math.round(b*.14),z+b, (hh===8 && b%2===0) ? "lantern" : "hull");
    fill(x-L-1,y+1,z,x-L-1,y+8,z,"planksD"); set(x-L-1,y+12,z,"lantern");
    // Bugspriet mit goldener Galionsfigur
    fill(x+L+1,y+4,z+3,x+L+5,y+6,z+3,"planks"); fs(x+L+6,y+5.5,z+3.5,"gold"); fs(x+L+6,y+6,z+3.5,"gold");
    // Hauptmast mit zerrissenem Segel und Ausguck, zweiter Mast umgestürzt
    const m1=x-6; for(let hh=6;hh<28;hh++) set(m1,y+hh,z,"planksD");
    fill(m1,y+24,z-7,m1,y+24,z+7,"planksD"); fill(m1,y+15,z-8,m1,y+15,z+8,"planksD");
    for(let hh=0;hh<7;hh++) for(let b=-7;b<=7;b++) if(rand()< (hh<3?.92:.55)) fs(m1+.75,y+23.5-hh,z+b+.5,"sail");
    for(let hh=0;hh<8;hh++) for(let b=-7;b<=7;b++) if(rand()<.72) for(const dd of [0,.5]) fs(m1+.75,y+14.5-hh-dd,z+b+.5,"sail");
    ring(m1,y+28,z,1.8,"planks"); fs(m1+.5,y+29,z+.5,"iron");
    for(const s of [-1,1]) for(let k=0;k<22;k++){ fs(m1+.5-k*.5, y+24-k*.85, z+.5+s*(7-k*.2), "iron"); }
    line(x+6,y+5,z+3,x+20,y+1,z+9,"planksD"); for(let k=0;k<12;k++) fs(x+9+k*.8,y+4-k*.25,z+4+k*.3,"sail");
    // Schatz quillt aus der Bruchstelle, offene Truhe, Fässer, Anker
    for(let i=0;i<70;i++) fs(x+1+(rand()-.5)*7, y+(rand()<.3?.5:0), z+(rand()-.5)*9, rand()<.85?"gold":"pearl");
    const cx=x+2, cz=z-9; fill(cx,y,cz,cx+2,y+1,cz+1,"planksD"); fs(cx+.5,y+2,cz+.5,"goldG"); fs(cx+1.5,y+2,cz+.5,"goldG"); fs(cx+2.5,y+2,cz+.5,"goldG"); fill(cx,y+2,cz-1,cx+2,y+2,cz-1,"planksD");
    for(const [bx,bz] of [[x+10,z+8],[x-10,z+9],[x+12,z+9],[x-4,z+9]]){ fill(bx,y,bz,bx,y+1,bz,"planks"); fs(bx+.5,y+.5,bz+1,"iron"); }
    const ax=x+16, az=z-6; fill(ax,y,az,ax,y+6,az,"iron"); fill(ax-2,y+5,az,ax+2,y+5,az,"iron"); set(ax-2,y+1,az,"iron"); set(ax+2,y+1,az,"iron"); fill(ax-1,y,az,ax+1,y,az,"iron");
    for(let k=0;k<20;k++) fs(ax+.5-k*.45, y+6.5-Math.sin(k/20*Math.PI)*2-k*.05, az+.5+k*.1, "iron");
    for(let i=0;i<30;i++){ const a=-L+Math.floor(rand()*L*2), b=(rand()<.5?-1:1)*Math.round(5.5*Math.sqrt(Math.max(0,1-(a/(L+1))**2))+1), t=topAt(x+a,z+b,30)+1;
      [()=>seagrass(x+a,t,z+b), ()=>branch(x+a,t,z+b,pick(CC),3,1), ()=>anemone(x+a,t,z+b,pick(CC)), ()=>fan(x+a,t,z+b,pick(CC),2), ()=>glowPlant(x+a,t,z+b)][i%5](); }
    S.country.top=[x,y+31,z]; S.country.base=y+8; S.country.cam={pos:[x-6,y+30,z+54], look:[x+10,y+8,z]}; }

  // ---------- Felsen der Krake ----------
  { const [ox,oz] = OCTO; ellip(ox,G,oz,4.5,3.2,3.8,(X,Y,Z)=> Y>G+1 && rand()<.3 ? "prism" : (rand()<.3 ? "rockD" : "rock")); ellip(ox+3,G,oz+2,2.5,2,2.2,"rock");
    for(let i=0;i<6;i++){ const a=rand()*Math.PI*2, px=Math.round(ox+Math.cos(a)*5.5), pz=Math.round(oz+Math.sin(a)*4.8), t=topAt(px,pz,G+4)+1; [()=>anemone(px,t,pz,pick(CC)), ()=>seagrass(px,t,pz), ()=>urchin(px,t,pz)][i%3](); } }

  // ---------- Riff ringsum, Ruinen und Prachtstraße ----------
  for(let i=0;i<520;i++){ const x=Math.floor(X0+rand()*(X1-X0)), z=Math.floor(Z0+rand()*(Z1-Z0)); if(blocked(x,z,6) || edge(x,z)>.95) continue; const t=topAt(x,z,60)+1; if(t<2||t>28) continue;
    if(z>D+2 && rand()<.5) continue;
    const r=rand();
    if(r<.05) coralTree(x,t,z,pick(["coralR","coralP","coralB","coralO"]),8+Math.floor(rand()*6));
    else if(r<.18) branch(x,t,z,pick(CC),3+Math.floor(rand()*3),2);
    else if(r<.26) brain(x,t-1,z,1.2+rand()*1.4);
    else if(r<.37) fan(x,t,z,pick(CC),2+Math.floor(rand()*2));
    else if(r<.43) tubes(x,t,z);
    else if(r<.52) anemone(x,t,z,pick(CC));
    else if(r<.64) seagrass(x,t,z);
    else if(r<.7) glowPlant(x,t,z);
    else if(r<.79){ if(z<D-4) kelp(x,t,z,12+Math.floor(rand()*22)); else seagrass(x,t,z); }
    else if(r<.86) starfish(x,t,z);
    else if(r<.91) urchin(x,t,z);
    else ellip(x,t,z,1+rand()*1.5,1+rand(),1+rand()*1.5,"rock"); }
  // Prachtstraße vom Haupttor nach vorne: Platten, Säulenpaare mit Laternen, kleine Pavillons
  for(let z=PZ+26; z<D+22; z++) for(let w=-3; w<=3; w++){ const t=topAt(PX+w,z,G+2); if(t<=G) set(PX+w,G-1,z, Math.abs(w)===3 ? "trim" : ((z+w)%2 ? "marble" : "marbleD")); }
  // verzierte Laternenpfosten: Sockel, kannelierte Säule mit Goldringen, Kapitell, Leuchtkugel im goldenen Käfig, kleine blaue Kuppel
  const lampPost = (lx,lz) => { const y=G; fill(lx,y,lz,lx,y,lz,"marbleB"); for(const [a,c] of [[1,0],[-1,0],[0,1],[0,-1]]) fs(lx+.5+a*.75,y+.25,lz+.5+c*.75,"trim");
    fill(lx,y+1,lz,lx,y+5,lz,"pillar"); for(const hh of [1.5,3.5]) for(let i=0;i<8;i++){ const a=i/8*Math.PI*2; fs(lx+.5+Math.cos(a)*.6,y+hh,lz+.5+Math.sin(a)*.6,"gold"); }
    set(lx,y+6,lz,"trim"); for(const [a,c] of [[1,0],[-1,0],[0,1],[0,-1]]){ fs(lx+.5+a*.8,y+6,lz+.5+c*.8,"trim"); fs(lx+.5+a*.8,y+6.5,lz+.5+c*.8,"goldG"); }
    fs(lx+.5,y+7.25,lz+.5,"lantern"); for(let i=0;i<8;i++){ const a=i/8*Math.PI*2; for(const hh of [7,7.5]) fs(lx+.5+Math.cos(a)*.9,y+hh,lz+.5+Math.sin(a)*.9,"gold"); }
    for(let k=0;k<3;k++){ const r=.9*(1-k/3); for(let i=0;i<10;i++){ const a=i/10*Math.PI*2; fs(lx+.5+Math.cos(a)*r,y+8+k*.5,lz+.5+Math.sin(a)*r, k%2?"domeL":"domeA"); } } fs(lx+.5,y+9.5,lz+.5,"goldG"); };
  for(let z=PZ+31; z<D+8; z+=10) for(const lx of [PX-5,PX+5]) lampPost(lx,z);
  // großes Stadttor am Anfang der Prachtstraße
  { const gz=D+16, y=G, half=8, R=8;
    for(let z=gz-2; z<=gz+2; z++) for(let x=PX-half-4; x<=PX+half+4; x++) for(let yy=y; yy<y+30; yy++){ const b=get(x,yy,z); if(b && !["sand","sandstone","rock","rockD","prism","marble","marbleD","trim"].includes(b)) set(x,yy,z,null); }
    for(let i=-(2*half+4)*2;i<=(2*half+4)*2;i++) for(let j=-8;j<=8;j++) for(let k=0;k<70;k++) FN.set(PX*2+i,k,gz*2+j,null);
    const PH=12;
    for(const sgn of [-1,1]){ const cx=PX+sgn*(half+2);
      fill(cx-2,y,gz-2,cx+2,y+1,gz+2,"marbleB"); ring(cx,y+2,gz,2.6,"trim");
      fill(cx-1,y+2,gz-1,cx+1,y+PH+9,gz+1,(X,Y,Z)=> (Y-y)%5===0 ? "trim" : "marbleB");
      for(const dz of [-2,2]) fill(cx,y+2,gz+dz,cx,y+PH,gz+dz,"pillar");
      for(const hh of [5,9]) set(cx+(sgn>0?-2:2),y+hh,gz,"glowB");
      fill(cx-2,y+PH+10,gz-2,cx+2,y+PH+10,gz+2,"trim");
      for(let i=0;i<12;i++){ const a=i/12*Math.PI*2; fs(cx+.5+Math.cos(a)*2.4,y+PH+11,gz+.5+Math.sin(a)*2.4,"gold"); }
      const R0=1.9, H=4; let top=0; for(let k=0;k<=H*2;k++){ const u=k/(H*2), r=R0*(u<.2 ? .9+.5*u : Math.pow(Math.cos((u-.2)/.8*Math.PI/2),.6)); const n=Math.max(6,Math.round(r*14)); for(let i=0;i<n;i++){ const a=i/n*Math.PI*2; fs(cx+.5+Math.cos(a)*r, y+PH+11.5+k*.5, gz+.5+Math.sin(a)*r, (Math.round(a/(Math.PI/4))%2) ? "domeA" : "domeL"); } top=y+PH+11.5+k*.5; }
      fs(cx+.5,top+.5,gz+.5,"goldG"); fs(cx+.5,top+1,gz+.5,"pearl");
      fs(cx+.5+sgn*2.4,y+8,gz+.5,"lantern"); }
    // Halbkreisbogen (offen), dicke Bogenleibung mit Goldkante
    for(let i=0;i<=60;i++){ const th=i/60*Math.PI, c=Math.cos(th), sn=Math.sin(th);
      for(let r=R; r<=R+1.6; r+=.5) for(let dz=-1.5; dz<=1.5; dz+=.5) fs(PX+.5+c*r, y+PH+sn*r, gz+.5+dz, (r<R+.2) ? "trim" : "marbleB");
      for(const dz of [-1.75,1.75]) fs(PX+.5+c*(R+1.8), y+PH+sn*(R+1.8), gz+.5+dz, "goldG"); }
    // Aufsatz über dem Bogen mit leuchtendem Band, Muschel-Schlussstein und Perle
    fill(PX-half-3,y+PH+10,gz-1,PX+half+3,y+PH+10,gz+1,"trim");
    for(let x=PX-half+1;x<=PX+half-1;x++){ set(x,y+PH+11,gz, "marbleB"); set(x,y+PH+11,gz+1, x%2 ? "glowB" : "trim"); }
    for(let i=0;i<=12;i++){ const th=i/12*Math.PI; fs(PX+.5+Math.cos(th)*2.2, y+PH+12+Math.sin(th)*2, gz+1.5, "shell"); fs(PX+.5+Math.cos(th)*1.6, y+PH+12+Math.sin(th)*1.4, gz+1.5, "shellIn"); }
    fs(PX+.5,y+PH+12.5,gz+1.75,"pearl");
    // Korallen und Kelp am Fuß der Pfeiler
    for(const sgn of [-1,1]){ coralTree(PX+sgn*(half+6), y, gz-1, sgn>0?"coralR":"coralB", 9); kelp(PX+sgn*(half+5), y, gz+2, 24); anemone(PX+sgn*(half-1), y, gz+3, "coralP"); } }
  // eingestürzte Tempelreste
  for(const [bx,bz] of [[4,44],[122,44],[34,0],[84,2],[0,78],[126,92]]){ if(edge(bx,bz)>.95) continue; const t=topAt(bx,bz,60)+1;
    for(const [ox,h] of [[0,8],[4,5],[8,9]]) fill(bx+ox,t,bz,bx+ox,t+h,bz,"pillar");
    fill(bx,t+9,bz,bx+8,t+9,bz,(X)=> X===bx+4 ? null : "trim"); set(bx,t+10,bz,"lantern"); for(let k=0;k<3;k++) ellip(bx+2+k*2,t,bz+3,0,1,1,"pillar"); glowPlant(bx+2,t,bz-2); }

  // ---------- Ferne: Riffrücken, Felsbogen, Felsnadel, Kelpwälder ----------
  const F = A.far; F.cell = 3;
  const fh = (x,z) => { let h = 4.5 + fbm(x*.05,z*.05)*3; const fade = Math.min(1, Math.max(0,(edge(x,z)-1.05)*2.5)) * (z>D ? Math.max(0,1-(z-D)/20) : 1); const ridge = Math.max(0, fbm(x*.022+11,z*.022+4)-.5)*90*fade; h += ridge; if(z<0) h += Math.min(16, -z*.12) * (.5+fbm(x*.04,z*.04)); return h; };
  A.farTerrain({ x0:-180, x1:W+180, z0:-200, z1:D+100, base:1, skip:(x,z)=> edge(x,z)<1.02 || fh(x,z) < 7, h: fh,
    top:(x,z,y,hc)=> y*3>14 ? (rand()<.25?"prism":"rock") : "sand", fill:(x,z,y,hc)=> y*3>10 ? (rand()<.3?"rockD":"rock") : "sandstone" });
  const fset = (x,y,z,t) => F.set(Math.floor(x/3),Math.floor(y/3),Math.floor(z/3),t);
  { const cx=190, cz=-10, cy=4; for(let a=0;a<=Math.PI;a+=.04){ const x=cx+Math.cos(a)*22, y=cy+Math.sin(a)*30; for(let k=-2;k<=2;k++) for(let t=-3;t<=3;t+=3) fset(x+t,y,cz+k*3, (k+t)%3?"rock":"prism"); } }
  { const cx=40, cz=-90; for(let y=0;y<70;y+=3){ const r=12*(1-y/80)+fbm(y*.1,3)*3; for(let a=-r;a<=r;a+=3) for(let b=-r;b<=r;b+=3) if(a*a+b*b<=r*r) fset(cx+a,y,cz+b, y>50?"prism":"rock"); } }
  // ferne Ruinen von Atlantis im Dunst: Säulen und eine zweite Kuppel
  for(const [cx,cz] of [[-70,-40],[120,-60],[-40,-110]]){ for(let i=0;i<8;i++){ const a=i/8*Math.PI*2; for(let y=0;y<24;y+=3) fset(cx+Math.cos(a)*14,y,cz+Math.sin(a)*14,"marble"); }
    for(let y=24;y<40;y+=3){ const r=14*Math.cos((y-24)/16*Math.PI/2); for(let a=-r;a<=r;a+=3) for(let b=-r;b<=r;b+=3) if(a*a+b*b<=r*r && a*a+b*b>(r-4)*(r-4)) fset(cx+a,y,cz+b,"domeA"); } }
  for(let i=0;i<90;i++){ const x=-180+rand()*(W+360), z=-200+rand()*(D+260); if(edge(x,z)<1.1) continue; const t=fh(x,z); if(t>12) continue; const hh=6+rand()*18; for(let y=t;y<t+hh;y+=3) fset(x,y,z,"kelp"); }

  // ---------- Tiere ----------
  const creatures = [];
  // Fischschwärme: klein und detailliert, ziehen in Schleifen
  [["clown",[44,15,46],[22,10],.24,0],["tang",[30,20,30],[26,18],.2,1.5],["butter",[60,13,36],[16,10],.3,3],["pink",[44,30,24],[30,20],.16,4.2],
   ["angel",[12,12,40],[12,9],.26,2],["green",[80,14,40],[16,10],.22,5],["clown",[66,24,14],[18,12],.2,.8],["tang",[22,14,58],[14,8],.3,2.4],
   ["butter",[44,38,20],[22,16],.14,3.7],["pink",[90,20,56],[14,10],.24,1.1]].forEach(([k,ctr0,rad,sp,ph],si)=>{ const ctr=[sx(ctr0[0]), ctr0[1], sz(ctr0[2])];
    for(let i=0;i<7;i++) creatures.push({ ...reefFish(k), orbit:{c:[ctr[0]+((i*3)%5)-2, ctr[1]+(i%3)*1.2-1, ctr[2]+((i*7)%5)-2], r:[rad[0]+(i%3), rad[1]+((i*2)%3)], speed:sp, ph:ph+i*.09, bob:.8+(i%2)*.4, dir: si%2 ? -1 : 1, wander:{f:.25, r:.1, y:1.5, eight:2, dx:2, dz:2, span:3, clear:2.5}}, scale:.2, noShadow:true }); });
  // große Quallen, die langsam treiben und pulsieren
  [[PX-34,40,PZ-8,0xF2F6FF,0x3A7AE8,0x6FA8FF],[PX+40,50,PZ-14,0xFFF0F6,0xE85A9A,0xFF9AC8],[PX-20,54,PZ+40,0xF0FFF8,0x2AB89A,0x7FE8D0],[PX-46,44,PZ+18,0xFFF0F6,0xE85A9A,0xFF9AC8]]
    .forEach(([x,y,z,c1,c2,c3],i)=> creatures.push({ ...bigJelly(c1,c2,c3), orbit:{c:[x,y,z], r:[4+i,3+i%2], speed:.05+i*.008, ph:i*1.57, bob:2.4, route:{span:6, clear:11, climb:6}}, scale:.55, noShadow:true }));
  // Krake auf dem Felsen
  creatures.push({ ...octopus(), at:[OCTO[0]+.5, topAt(OCTO[0],OCTO[1],G+8)+.6, OCTO[1]+.5], yaw:-.9, scale:.62 });
  // Mantarochen, Schildkröten, Seepferdchen im Kelp, Delfine und Wal
  creatures.push({ ...manta(), orbit:{c:[PX,36,PZ], r:[72,48], speed:.06, ph:0, bob:3, bank:.15, route:{span:9, clear:3, climb:6, eight:5}}, scale:.55 });
  creatures.push({ ...manta(), orbit:{c:[PX+8,28,PZ+10], r:[56,42], speed:.07, ph:3.14, bob:2, bank:.15, dir:-1, route:{span:8, clear:3, climb:6, eight:4}}, scale:.42 });
  creatures.push({ ...turtle(), orbit:{c:[PX-6,24,PZ+22], r:[48,30], speed:.05, ph:1.57, bob:1.5, bank:.1, route:{span:5, clear:3, climb:5, eight:3}}, scale:.5 });
  creatures.push({ ...turtle(), orbit:{c:[PX+22,18,PZ-6], r:[42,34], speed:.045, ph:4.7, bob:1.2, bank:.1, dir:-1, route:{span:5, clear:3, climb:5, eight:3}}, scale:.42 });
  for(const [dx,dz,dy,c1,c2] of [[-4,7,6,0xFFB03A,0xFFD27A],[5,6,9,0xFF6FA0,0xFFB0CC],[7,-2,7,0xFFD23F,0xFFF0A0],[-6,-3,10,0xFF8A3A,0xFFC090]])
    creatures.push({ ...seahorse(c1,c2), at:[S.vocabulary.x+dx, G+dy, S.vocabulary.z+dz], yaw:Math.PI/2*(dx>0?1:-1), hover:[.6,.8+Math.abs(dx)*.05], scale:.3 });
  creatures.push({ ...dolphin(), orbit:{c:[PX,26,PZ], r:[118,80], speed:.1, ph:2.4, bob:3.5, bank:.2, route:{span:4, clear:3, climb:5, eight:4}}, scale:.2 });
  creatures.push({ ...dolphin(), orbit:{c:[PX,26,PZ], r:[118,80], speed:.1, ph:2.52, bob:3.5, bank:.2, route:{span:4, clear:3, climb:5, eight:4}}, scale:.18 });
  creatures.push({ ...whale(), orbit:{c:[PX,48,-30], r:[120,36], speed:.04, ph:5.5, bob:.3, bank:.1, dir:-1, route:{span:12, clear:7, climb:10, slope:.05}}, scale:.6 });

  return {
    W, D, blocks, spots:S, exposure:1.18, fov:42,
    sky:[[0,"#5FD3F2"],[.3,"#2E9BD0"],[.6,"#0E5C8C"],[1,"#062A46"]], fog:[0x0E5C8C, 105, 340],
    hemi:[0x9FEFFF, 0x1A4A6A, 1.85], sun:{color:0xDFFBFF, int:1.55, pos:[-30,90,40]}, bloom:[.32,.45,.9],
    lights:[{pos:[PX,G+40,PZ], color:0x7FE3FF, int:420, dist:48}, {pos:[PX,G+12,PZ+16], color:0xBFF8FF, int:120, dist:22}, {pos:[S.vocabulary.x,G+4,S.vocabulary.z], color:0xFFFFFF, int:80, dist:16},
            {pos:[STATUE[0]+6,G+44,STATUE[1]+1], color:0xFFE27A, int:90, dist:16}],
    planes:[{y:G-3.6, tex:T.sand, repeat:400, size:1000}, {y:G+.05, tex:T.caust, repeat:120, size:300, em:.5, opacity:.2, anim:[.018,.009]}, {y:G+.08, tex:T.caust, repeat:85, size:300, em:.45, opacity:.16, anim:[-.012,.016]}, {y:150, tex:T.surface, repeat:60, size:400, em:.4, opacity:.35, anim:[.02,.01]}],
    rays:{n:46, color:0xCFF8FF, area:[-60,W+60,-60,D+20], y:G+74, len:150, w:[3,8], drift:12, op:.075, tilt:.16},
    particles:[{n:720, area:[-20,W+20,2,70,-10,D+40], vy:2.2, wob:.8, color:0xE6FBFF, size:.34, opacity:.8},
               {n:520, area:[0,W,2,34,0,D], vy:0, wob:.3, color:0xA8F0D8, size:.18, opacity:.7, add:true, twinkle:true}],
    creatures,
    home:{pos:[PX,52,D+64], look:[PX,15,PZ+8]}, homePortrait:{pos:[PX,80,D+132], look:[PX,14,PZ+2]},
    ui:{bg:"rgba(4,34,58,.88)", border:"#7FE3FF", glow:"rgba(80,210,255,.5)", text:"#E8FBFF", sub:"#9FD7EA", accent:"#FF8A5A", "accent-ink":"#1A0E08", chip:"rgba(4,30,52,.8)"}
  };
}
