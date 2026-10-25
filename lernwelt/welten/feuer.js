// Klasse 5 · Fire Island – Vulkanstadt: Terrassen am Vulkanhang, Glut-Festung, Bibliothek im Purpurgarten, Glut-Markt mit Schmiede,
// Unterstadt mit Hafen am Lavameer, zwei Lavaflüsse mit Bogenbrücken und Lavafällen, der Vulkan spuckt in Schüben Lavabrocken.
import { dragon, salamander, phoenix } from "./tiere.js";
export function build(A){
  const { rand, fbm, pick, set, get, fill, walls, disk, ring, cyl, ball, cone, line, topAt, tex, P, noise, stripes, bricks, rings, topEdge, planks, windowT } = A;
  const T = {
    netherrack: noise(["#6E2424","#7E2C2A","#5A1C1E","#8E3A34","#6A2222"]),
    blackstone: noise(["#2B2630","#35303A","#221E26","#3E3842","#2E2933"]),
    basaltS: stripes(["#56555F","#47464F","#605F6A","#4C4B55"], true, "#3A3940"),
    basaltT: rings(["#5E5D68","#4E4D57","#666571","#44434C"]),
    obsidian: noise(["#140C22","#1E1330","#0E0818","#22163A"], 10, ["#5A3496","#7A4FC2"]),
    magma: tex(g=>{ for(let x=0;x<16;x++) for(let y=0;y<16;y++) P(g,x,y,pick(["#4A140C","#5A1A10","#3E100A"]));
      for(let k=0;k<5;k++){ let x=Math.floor(rand()*16), y=Math.floor(rand()*16); for(let s=0;s<9;s++){ P(g,x,y,pick(["#FF7A1A","#FFA030","#FF5A10"])); x=(x+(rand()<.5?1:15))%16; y=(y+(rand()<.5?1:0))%16; } } }),
    lava: tex(g=>{ for(let x=0;x<16;x++) for(let y=0;y<16;y++){ const v=Math.sin(x*.9+y*.35)+Math.sin(y*.8-x*.3)+rand()*.6; P(g,x,y, v>1.2?"#FFD24A":v>.3?"#FF9A1E":v>-.6?"#FF6A0A":"#D9430A"); } }),
    lavaSea: tex(g=>{ for(let x=0;x<16;x++) for(let y=0;y<16;y++){ const v=Math.sin(x*.7+y*.45)+Math.sin(y*.9-x*.4)+rand()*.5; P(g,x,y, v>1.5?"#FF9A1E":v>.9?"#E2530A":v>0?"#7A1E08":"#4A1006"); } }),
    glow: noise(["#F8D46A","#E8B848","#FFE89A","#FFD060"], 14, ["#A8742A"]),
    brick: bricks(["#3A1418","#46191D","#401619"], "#1E080A"),
    sbrick: bricks(["#3A3540","#433E4A","#35303A"], "#1C181F"),
    chisel: tex(g=>{ for(let y=0;y<16;y++) for(let x=0;x<16;x++){ const e=x<1||y<1||x>14||y>14, i=x>3&&x<12&&y>3&&y<12; P(g,x,y, e?"#1C181F":i?"#4A4452":"#3A3540"); } }),
    flag: tex(g=>{ for(let y=0;y<16;y++) for(let x=0;x<16;x++) P(g,x,y, (x===0||y===0||(x===8&&y<8)||(y===8&&x>4)) ? "#1E1A22" : pick(["#4A4450","#423D48","#524C58"])); }),
    roof: tex(g=>{ for(let y=0;y<16;y++) for(let x=0;x<16;x++){ const r=Math.floor(y/4), off=(r%2)*2; P(g,x,y, y%4===3 ? "#3A0E0A" : ((x+off)%4===0 ? "#7A1A10" : pick(["#A8281A","#B8321E","#982214"]))); } }),
    nylT: noise(["#8E1E2E","#A82838","#7A1626","#B83A44","#951F30"]),
    nylS: topEdge(["#6E2424","#7E2C2A","#5A1C1E","#8E3A34"], ["#8E1E2E","#A82838","#7A1626"], 3),
    stemS: stripes(["#5A1E36","#6E2644","#4A162C","#7A3050"], true, "#3A1022"),
    stemT: rings(["#B85A6A","#A04A5A","#5A1E36"]),
    wart: noise(["#8A0E14","#A0161C","#740A10","#B0242A","#960F18"]),
    shroom: noise(["#FFB04A","#FFD27A","#F0902A","#FFC25A"], 8, ["#FFF0B8"]),
    gold: noise(["#F5C542","#FFE27A","#E8B030","#FFD95A"]),
    planks: planks(["#6A2A3A","#7A3244","#62263A"], "#3A1622"),
    shelf: tex(g=>{ for(let y=0;y<16;y++) for(let x=0;x<16;x++){ const band=y<2||y>13||y===7||y===8; P(g,x,y, band?pick(["#6A2A3A","#7A3244"]):(x%3===2?"#2A0E14":["#C8413A","#3E63DD","#E9A81C","#3FA34D","#7C5CFF"][((x/3|0)+(y>8?2:0))%5])); } }),
    soil: noise(["#4E3B32","#5C463B","#3E2E27","#55413A"]),
    iron: tex(g=>{ for(let x=0;x<16;x++) for(let y=0;y<16;y++) P(g,x,y,(x%4===0||y%4===0)?"#3A3A40":"rgba(0,0,0,0)"); }),
    woolR: noise(["#C8302A","#D63A32","#B8261F"]), woolY: noise(["#F2C230","#FFD24A","#E0AE20"]), woolW: noise(["#F2EBE2","#FFFFFF","#E4DCD2"]), woolP: noise(["#6A2A8A","#7A3498","#5A2078"]),
    win: windowT("#1C181F","#FFB848","#FFD27A"),
    door: tex(g=>{ for(let x=0;x<16;x++) for(let y=0;y<16;y++){ const v=y/16; P(g,x,y, rand()<.08 ? "#FFF0C0" : v<.3?"#FFE2A0":v<.7?"#FFC060":"#F09A30"); } }),
    anvil: noise(["#3A3A42","#45454E","#2E2E36"])
  };
  const blocks = {
    netherrack:{side:T.netherrack}, blackstone:{side:T.blackstone}, basalt:{side:T.basaltS, top:T.basaltT}, obsidian:{side:T.obsidian},
    magma:{side:T.magma, em:.9}, lava:{side:T.lava, em:1.25, anim:[.11,.07]}, lavaFall:{side:T.lava, em:1.3, anim:[0,-.45]},
    glow:{side:T.glow, em:1.15}, lamp:{side:T.glow, em:1.4, halo:[0xFFA040,3.4,.55]}, brick:{side:T.brick}, sbrick:{side:T.sbrick}, chisel:{side:T.chisel, top:T.sbrick},
    flag:{side:T.sbrick, top:T.flag}, roof:{side:T.roof},
    nylium:{side:T.nylS, top:T.nylT, bottom:T.netherrack}, stem:{side:T.stemS, top:T.stemT}, wart:{side:T.wart}, shroom:{side:T.shroom, em:1.1, halo:[0xFFB04A,2.6,.35]},
    gold:{side:T.gold, em:.2}, planks:{side:T.planks}, shelf:{side:T.shelf, top:T.planks}, soil:{side:T.soil},
    woolR:{side:T.woolR}, woolY:{side:T.woolY}, woolW:{side:T.woolW}, woolP:{side:T.woolP}, iron:{side:T.iron, alpha:.95, cross:true},
    win:{side:T.win, em:.95}, door:{side:T.door, em:.8}, anvil:{side:T.anvil}
  };
  const F = A.fine, fs = (x,y,z,t) => F.set(Math.round(x*2),Math.round(y*2),Math.round(z*2),t);

  // ---------- Gelände ----------
  const W=120, D=100, LL=3, L0=6, L1=13, L2=21, VX=60, VZ=4, VTOP=82, CR=8;
  const vol = (x,z) => { const r=Math.hypot(x-VX,(z-VZ)*1.1), rid = Math.sin(Math.atan2(z-VZ,x-VX)*9)*1.6; return VTOP - r*1.22 + fbm(x*.12,z*.12)*4 + rid*Math.min(1,r/14); };
  const level = z => z>=88 ? L0 : z>=66 ? L0 : z>=48 ? L1 : L2;
  const islandD = (x,z) => { const dx=(x-W/2)/(W*.5), dz=(z-46)/56; return Math.sqrt(dx*dx+dz*dz) + (fbm(x*.06,z*.06)-.5)*.22; };
  const Hm = [];
  for(let z=0; z<D; z++){ Hm.push([]); for(let x=0; x<W; x++){
    const d = islandD(x,z); let h;
    if(z>89) h = 1;
    else if(d>1.02) h = 1;
    else { h = level(z); const edge = Math.min(x, W-1-x);
      if(edge<16){ const crag = (16-edge)*1.4 + fbm(x*.25,z*.25)*8; h = Math.max(h, Math.round(L0 + crag*(z<80?1:.5))); } }
    let v = vol(x,z); if(z>=29) v = -99; else if(z>=19) v = Math.min(v, L2 + (29-z)*2.6); if(v>h) h = v;
    if(Math.hypot(x-VX,(z-VZ)*1.1)<CR) h = Math.min(h, VTOP-12);
    Hm[z].push(Math.max(1, Math.round(h))); } }

  // Lavaflüsse vom Krater durch die Stadt ins Lavameer
  const rivers = [ [[54,10],[48,22],[42,32],[38,44],[36,56],[33,68],[30,80],[28,92],[27,100]],
                   [[66,10],[72,22],[78,32],[82,44],[85,56],[88,68],[90,80],[92,92],[93,100]] ];
  const riv = new Map();
  for(const path of rivers) for(let i=0;i<path.length-1;i++){ const a=path[i], b=path[i+1], n=Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])*3);
    for(let s=0;s<=n;s++){ const t=s/n, cx=a[0]+(b[0]-a[0])*t, cz=a[1]+(b[1]-a[1])*t;
      for(let ox=-2;ox<=2;ox++){ const x=Math.round(cx+ox), z=Math.round(cz); if(x<0||z<0||x>=W||z>=D) continue; const w=Math.abs(cx+ox-x)+Math.abs(ox); if(Math.abs(ox)<=1.6) riv.set(x+","+z, Math.min(riv.get(x+","+z)??9, Math.abs(ox))); } } }
  const isRiv = (x,z) => riv.has(x+","+z);

  const city = (x,z) => z>=30 && z<89 && Math.min(x,W-1-x)>=14 && islandD(x,z)<=1.02;
  for(let z=0; z<D; z++) for(let x=0; x<W; x++){
    let h = Hm[z][x]; const volc = Math.hypot(x-VX,(z-VZ)*1.1) < 64 && h > L2+1, R = isRiv(x,z);
    for(let y=0;y<h;y++){ let t;
      if(volc) t = y>h-2 ? (rand()<.05?"magma":rand()<.2?"basalt":"blackstone") : (rand()<.12?"basalt":"blackstone");
      else if(y===h-1 && city(x,z)) t = "flag";
      else if(y===h-1) t = rand()<.1 ? "magma" : rand()<.4 ? "basalt" : "blackstone";
      else t = city(x,z) ? (y%5===0 ? "basalt" : "netherrack") : (rand()<.45 ? "basalt" : "blackstone");
      set(x,y,z,t); }
    if(R && h>LL){ const deep = volc ? 1 : 3; for(let y=h-deep;y<h;y++) set(x,y,z,null); set(x,h-deep-1,z,"lava"); }
    if(h<=LL) set(x,0,z,"blackstone"); }
  // Lavafälle: wo der Fluss über eine Stufe fällt, hängt ein glühender Vorhang
  for(const [k] of riv){ const [x,z] = k.split(",").map(Number); const h=Hm[z][x];
    for(const [dx,dz] of [[0,1],[1,0],[-1,0]]){ const nx=x+dx, nz=z+dz; if(!isRiv(nx,nz) || nz>=D || nx<0 || nx>=W) continue; const hn=Hm[nz][nx];
      if(hn < h-1){ const top = (Math.hypot(x-VX,(z-VZ)*1.1)<64 && h>L2+1) ? h-2 : h-4, bot = (Math.hypot(nx-VX,(nz-VZ)*1.1)<64 && hn>L2+1) ? hn-2 : hn-4; for(let y=Math.max(bot,0); y<=top; y++) set(nx,y,nz,"lavaFall"); } } }
  // Krater
  for(let z=VZ-9; z<=VZ+9; z++) for(let x=VX-9; x<=VX+9; x++){ const r=Math.hypot(x-VX,(z-VZ)*1.1); if(r<CR){ for(let y=VTOP-12;y<VTOP+4;y++) set(x,y,z,null); set(x,VTOP-13,z,"lava"); } else if(r<CR+1.2) set(x,Hm[z]&&Hm[z][x]!==undefined?Hm[z][x]:0,z,"magma"); }

  // Stützmauern der Terrassen mit Zinnenband und Lampennischen
  const wallZ = (zw, yLo, yHi) => { for(let x=14;x<W-14;x++){ if(!city(x,zw-1) && !city(x,zw)) continue; if(isRiv(x,zw)||isRiv(x,zw-1)) continue;
      for(let y=yLo;y<yHi;y++) set(x,y,zw, y===yHi-1 ? "chisel" : "sbrick"); if(x%2===0) set(x,yHi,zw,"sbrick");
      if(x%8===4){ set(x,yHi-3,zw,"lamp"); set(x,yHi-3,zw+1,null); } } };
  wallZ(48, L1, L2+1); wallZ(66, L0, L1+1);
  // Kaimauer zum Lavameer
  for(let x=14;x<W-14;x++){ if(!city(x,88) || isRiv(x,88)) continue; for(let y=1;y<L0;y++) set(x,y,88,"sbrick"); set(x,L0-1,88,"chisel"); if(x%3===0) set(x,L0,88,"basalt"); if(x%12===6){ set(x,L0+1,88,"lamp"); } }

  // Freitreppen in der Mitte und an den Seiten
  const stairs = (x0,x1,yFrom,zFront,steps) => { for(let i=0;i<steps;i++){ fill(x0,yFrom,zFront-i,x1,yFrom+i,zFront-i,"sbrick"); fill(x0,yFrom+i,zFront-i,x1,yFrom+i,zFront-i,"flag"); for(let y=yFrom+i+1;y<yFrom+steps+2;y++) fill(x0,y,zFront-i,x1,y,zFront-i,null); }
    for(let i=0;i<steps;i++){ set(x0-1,yFrom+i+1,zFront-i,"chisel"); set(x1+1,yFrom+i+1,zFront-i,"chisel"); }
    for(const xx of [x0-1,x1+1]){ fill(xx,yFrom,zFront+1,xx,yFrom+2,zFront+1,"chisel"); set(xx,yFrom+3,zFront+1,"lamp"); } };
  stairs(56,64,L0,73,L1-L0+1); stairs(56,64,L1,55,L2-L1+1);
  stairs(47,49,L0,73,L1-L0+1); stairs(71,73,L0,73,L1-L0+1);

  // Bogenbrücken über die Lavaflüsse
  const bridge = (cx, cz, y, len) => { const hl=Math.floor(len/2);
    for(let a=-hl;a<=hl;a++){ const x=cx+a, lift = Math.round(Math.cos(a/hl*Math.PI/2)*1.4);
      fill(x,y+lift,cz-1,x,y+lift,cz+1,"flag"); set(x,y+lift-1,cz-1,"sbrick"); set(x,y+lift-1,cz+1,"sbrick"); set(x,y+lift-1,cz,"chisel");
      for(const zz of [cz-2,cz+2]){ set(x,y+lift,zz,"chisel"); set(x,y+lift+1,zz, a%2===0 ? "sbrick" : null); } }
    for(const a of [-hl,hl]) for(const zz of [cz-2,cz+2]){ fill(cx+a,y,zz,cx+a,y+2,zz,"chisel"); set(cx+a,y+3,zz,"lamp"); }
    for(let a=-hl+1;a<hl;a++){ const d = Math.abs(a)/hl; if(d>.55) for(let yy=y-3; yy<y-1+Math.round((d-.55)*4); yy++){ set(cx+a,yy,cz-1,"sbrick"); set(cx+a,yy,cz+1,"sbrick"); } } };
  const rivX = (i,z) => { const p=rivers[i]; for(let k=0;k<p.length-1;k++){ const a=p[k], b=p[k+1]; if(z>=a[1]&&z<=b[1]) return Math.round(a[0]+(b[0]-a[0])*(z-a[1])/(b[1]-a[1])); } return p[p.length-1][0]; };
  for(const [i,z,y] of [[0,40,L2],[0,58,L1],[0,77,L0],[1,40,L2],[1,58,L1],[1,77,L0]]) bridge(rivX(i,z), z, y, 9);

  // Laternen an den Straßen
  const lantern = (x,y,z) => { fill(x,y,z,x,y+3,z,"basalt"); set(x,y+4,z,"lamp"); fs(x+.25,y+3.75,z,"chisel"); };

  // ---------- Häuser ----------
  const free = (x0,z0,x1,z1) => { for(let x=x0-1;x<=x1+1;x++) for(let z=z0-1;z<=z1+1;z++){ if(x<0||z<0||x>=W||z>=D||isRiv(x,z)||!city(x,z)) return false; } return true; };
  const house = (x0,z0,w,d,y,fl,face) => { const x1=x0+w-1, z1=z0+d-1, hgt=fl*4, wall = rand()<.5 ? "brick" : "sbrick";
    for(let yy=y; yy<y+hgt; yy++) for(let x=x0;x<=x1;x++) for(let z=z0;z<=z1;z++){ const edge = x===x0||x===x1||z===z0||z===z1; if(!edge) continue;
      const corner = (x===x0||x===x1)&&(z===z0||z===z1), band = (yy-y)%4===0;
      let t = corner ? "basalt" : band ? "chisel" : wall;
      if(!corner && !band && (yy-y)%4===2 && ((x-x0)%2===1 && (z===z0||z===z1) || (z-z0)%2===1 && (x===x0||x===x1))) t = "win";
      set(x,yy,z,t); }
    fill(x0+1,y+hgt-1,z0+1,x1-1,y+hgt-1,z1-1,"planks");
    // Satteldach entlang x
    const half = Math.ceil(d/2);
    for(let k=0;k<=half;k++){ for(let x=x0-1;x<=x1+1;x++){ set(x,y+hgt+k,z0-1+k,"roof"); set(x,y+hgt+k,z1+1-k,"roof"); }
      for(const x of [x0,x1]) for(let z=z0+k;z<=z1-k;z++) set(x,y+hgt+k,z, "brick"); }
    // Tür zur Straße
    const dz = face>0 ? z1 : z0, dx = x0 + Math.floor(w/2); set(dx,y,dz,"door"); set(dx,y+1,dz,"door"); fs(dx,y+2.25,dz+face*.75,"chisel");
    fs(dx-.75,y+1.25,dz+face*.75,"lamp");
    // Schornstein
    const cx = x0 + 1 + Math.floor(rand()*(w-2)), cz = z0 + (rand()<.5?1:d-2); fill(cx,y+hgt,cz,cx,y+hgt+half+2,cz,"sbrick"); set(cx,y+hgt+half+3,cz,"magma");
    chimneys.push([cx+.5, y+hgt+half+4, cz+.5]); };
  const chimneys = [];
  const tryHouse = (x0,z0,w,d,y,fl,face) => { if(free(x0,z0,x0+w-1,z0+d-1)){ house(x0,z0,w,d,y,fl,face); return true; } return false; };
  // Unterstadt: zwei Häuserzeilen, dazwischen die Hafenstraße
  for(let x=16; x<W-20; x+=8){ if((x>=44 && x<=72) || x>=94) continue; tryHouse(x, 67, 6+(x%3===0?1:0), 6, L0, 2+(x%16===0?1:0), 1); }
  for(let x=18; x<W-20; x+=9){ if(x>=50 && x<=66) continue; tryHouse(x, 79, 6, 5, L0, 2, -1); }
  // Häuser neben der Haupttreppe
  for(const x of [38,77]) tryHouse(x, 68, 7, 6, L0, 3, 1);
  // Mittelterrasse
  for(const x of [41,69]) tryHouse(x, 49, 7, 7, L1, 2, 1);
  // Obere Terrasse an den Seiten der Festung
  for(const x of [18,26,92,100]) tryHouse(x, 31, 6, 6, L2, 2, 1);
  // Straßenlaternen
  for(let x=18; x<W-18; x+=12){ if(!isRiv(x,76) && city(x,76) && !get(x,L0,76)) lantern(x,L0,76); }
  for(let x=20; x<W-18; x+=20){ if(!isRiv(x,86) && !get(x,L0,86)) lantern(x,L0,86); }

  const S = {
    grammar:   {x:60, z:37, col:0xB56CFF, ort:"Ember Fortress"},
    vocabulary:{x:24, z:56, col:0xFF4A6A, ort:"Crimson Library"},
    country:   {x:97, z:57, col:0xFFE14A, ort:"Ember Market"}
  };

  // ---------- Grammar: Glut-Festung ----------
  { const {x,z} = S.grammar, y=L2, x0=x-13, x1=x+13, z0=z-7, z1=z+7;
    fill(x0,y,z0,x1,y,z1,"flag");
    for(let a=x0;a<=x1;a++) for(let b=z0;b<=z1;b++){ if(a!==x0&&a!==x1&&b!==z0&&b!==z1) continue;
      fill(a,y,b,a,y+8,b,(xx,yy)=> yy===y+8 ? "chisel" : "sbrick"); if((a+b)%2===0) set(a,y+9,b,"sbrick"); if((a===x0||a===x1?b:a)%5===0 && b!==z1) set(a,y+5,b,"win"); }
    // Wehrgang innen
    for(let a=x0+1;a<x1;a++){ set(a,y+7,z0+1,"planks"); set(a,y+7,z1-1,"planks"); }
    // runde Ecktürme mit Kegeldach
    const tower = (tx,tz,r,hh) => { for(let yy=y;yy<y+hh;yy++) ring(tx,yy,tz,r,(xx,y2,zz)=> (y2-y)%6===0 ? "chisel" : ((y2-y)%6===3 && (xx+zz)%3===0 ? "win" : "sbrick"));
      disk(tx,y+hh,tz,r+1,"chisel"); for(let k=0;k<=r+2;k++) ring(tx,y+hh+1+k,tz,Math.max(.4,r+1-k*1.05),"roof"); set(tx,y+hh+r+4,tz,"gold"); set(tx,y+hh+r+5,tz,"lamp"); };
    for(const [a,b] of [[x0,z0],[x1,z0],[x0,z1],[x1,z1]]) tower(a,b,3,15);
    // Bergfried
    { const k0=x-5, k1=x+5, q0=z-4, q1=z+3, hh=26;
      for(let yy=y;yy<y+hh;yy++) for(let a=k0;a<=k1;a++) for(let b=q0;b<=q1;b++){ if(a!==k0&&a!==k1&&b!==q0&&b!==q1) continue; const corner=(a===k0||a===k1)&&(b===q0||b===q1);
        set(a,yy,b, corner ? "basalt" : (yy-y)%7===0 ? "chisel" : ((yy-y)%7===4 && (a+b)%2===0 ? "win" : "brick")); }
      fill(k0-1,y+hh,q0-1,k1+1,y+hh,q1+1,"chisel"); for(let a=k0-1;a<=k1+1;a++) for(let b=q0-1;b<=q1+1;b++) if((a===k0-1||a===k1+1||b===q0-1||b===q1+1)&&(a+b)%2===0) set(a,y+hh+1,b,"sbrick");
      // Turmhelm in der Mitte
      for(let yy=0;yy<8;yy++) ring(x,y+hh+1+yy,z,2.2,"sbrick"); for(let k=0;k<5;k++) ring(x,y+hh+9+k,z,Math.max(.4,3.2-k*.75),"roof"); set(x,y+hh+14,z,"gold"); set(x,y+hh+15,z,"lamp");
      for(const hy of [y+hh+3,y+hh+6]){ set(x,hy,z+2,"win"); set(x+2,hy,z,"win"); set(x-2,hy,z,"win"); }
      // großes Fenster vorne
      for(let a=-1;a<=1;a++) for(let b=0;b<5;b++) set(x+a,y+14+b,q1,"win");
      S.grammar.top=[x, y+hh+15, z]; }
    // Torhaus mit Fallgitter
    { for(let a=-4;a<=4;a++) fill(x+a,y,z1,x+a,y+12,z1+1,(xx,yy)=> yy===y+12 ? "chisel" : "sbrick"); for(let a=-4;a<=4;a+=2) set(x+a,y+13,z1+1,"sbrick");
      for(let a=-2;a<=2;a++) for(let b=0;b<7;b++){ if(b<5 || Math.hypot(a,b-5)<2.3){ set(x+a,y+1+b,z1,null); set(x+a,y+1+b,z1+1,b<5&&Math.abs(a)<2?"iron":null); } }
      for(const s of [-1,1]){ fill(x+3*s,y+6,z1+2,x+3*s,y+11,z1+2,"woolR"); set(x+3*s,y+8,z1+2,"woolY"); set(x+3*s,y+12,z1+2,"gold"); }
      for(const s of [-1,1]){ fill(x+6*s,y,z1+2,x+6*s,y+3,z1+2,"chisel"); set(x+6*s,y+4,z1+2,"lamp"); } }
    // Banner an den Mauern
    for(const a of [x0+5,x1-5]){ fill(a,y+3,z1+1,a,y+7,z1+1,"woolR"); set(a,y+5,z1+1,"woolY"); }
    S.grammar.base=y; S.grammar.cam={pos:[x+15,y+44,z+94], look:[x+15,y+11,z+4]}; }

  // ---------- Vocabulary: Bibliothek im Purpurgarten ----------
  const fungus = (x,y,z,hh,r) => { fill(x,y,z,x+(r>3?1:0),y+hh,z+(r>3?1:0),"stem");
    for(let a=-r;a<=r+1;a++) for(let b=-r;b<=r+1;b++){ const d=Math.hypot(a-.5,b-.5); if(d<=r+.4){ set(x+a,y+hh+1,z+b,"wart"); if(d<r-.6) set(x+a,y+hh+2,z+b,"wart"); if(d<r-1.8) set(x+a,y+hh+3,z+b,"wart"); }
      if(d>r-.8&&d<=r+.4&&rand()<.35) set(x+a,y+hh,z+b, rand()<.4?"shroom":"wart"); } };
  { const {x,z} = S.vocabulary, y=L1;
    for(let a=-12;a<=12;a++) for(let b=-8;b<=9;b++){ const xx=x+a, zz=z+b; if(get(xx,y-1,zz)==="flag" && !isRiv(xx,zz) && Math.hypot(a*.8,b)<11) set(xx,y-1,zz,"nylium"); }
    // achteckiger Bücherturm mit Kuppel
    for(let yy=y; yy<y+17; yy++) ring(x,yy,z,4.6,(xx,y2,zz)=> (y2-y)%6===0 ? "chisel" : ((y2-y)%6===3 ? ((xx+zz)%2===0?"win":"shelf") : "shelf"), 1);
    disk(x,y+17,z,5.6,"chisel"); for(let yy=0;yy<6;yy++) disk(x,y+18+yy,z,Math.sqrt(Math.max(0,25-(yy*.95)**2)),(xx,y2,zz)=> yy<1 ? "sbrick" : "woolP");
    set(x,y+24,z,"gold"); set(x,y+25,z,"lamp");
    for(let b=0;b<4;b++) for(let a=-1;a<=1;a++) set(x+a,y+b,z+5,b<3?"door":"chisel");
    // Lesepavillon und Pilze
    fungus(x-8,y,z+3,8,3); fungus(x+7,y,z-4,6,2); fungus(x+8,y,z+5,4,2); fungus(x-6,y,z-6,5,2);
    for(const [a,b] of [[-3,7],[3,7]]) lantern(x+a,y,z+b);
    S.vocabulary.top=[x, y+25, z]; S.vocabulary.base=y; S.vocabulary.cam={pos:[x+22,y+36,z+54], look:[x+12,y+8,z+2]}; }

  // ---------- Country & people: Glut-Markt mit Uhrturm und Schmiede ----------
  { const {x,z} = S.country, y=L1;
    // Pflaster mit Muster
    for(let a=-9;a<=7;a++) for(let b=-7;b<=7;b++){ const xx=x+a, zz=z+b; if(get(xx,y-1,zz)==="flag" && !isRiv(xx,zz)) set(xx,y-1,zz, (Math.abs(a+1)+Math.abs(b))%4===0 ? "chisel" : "flag"); }
    // Uhrturm hinten am Platz
    { const tx=x+1, tz=z-6, th=20;
      for(let yy=y;yy<y+th;yy++) for(let a=-2;a<=2;a++) for(let b=-2;b<=2;b++){ if(Math.abs(a)!==2&&Math.abs(b)!==2) continue; const c=Math.abs(a)===2&&Math.abs(b)===2; set(tx+a,yy,tz+b, c ? "basalt" : (yy-y)%5===0 ? "chisel" : ((yy-y)%5===2 && !c && (a===0||b===0) ? "win" : "brick")); }
      fill(tx-3,y+th,tz-3,tx+3,y+th,tz+3,"chisel");
      for(let yy=y+th+1;yy<y+th+6;yy++) for(let a=-2;a<=2;a++) for(let b=-2;b<=2;b++){ if(Math.abs(a)!==2&&Math.abs(b)!==2) continue; set(tx+a,yy,tz+b, Math.abs(a)===2&&Math.abs(b)===2 ? "basalt" : "sbrick"); }
      // Zifferblätter vorne und seitlich (fein)
      for(const [nx,nz] of [[0,1],[1,0],[-1,0]]){ const cx=tx+nx*2.75, cz=tz+nz*2.75, cy=y+th+3;
        for(let u=-2;u<=2;u+=.5) for(let v=-2;v<=2;v+=.5){ const d=Math.hypot(u,v); if(d>2.1) continue; const t = d>1.6 ? "gold" : (Math.abs(u)<.3&&v>=0&&v<1.4)||(Math.abs(v)<.3&&u>=0&&u<1.1) ? "sbrick" : "woolW";
          fs(nz ? cx+u : cx, cy+v, nz ? cz : cz+u, t); } }
      for(let k=0;k<7;k++) ring(tx,y+th+6+k,tz,Math.max(.4,3.4-k*.5),"roof"); set(tx,y+th+13,tz,"gold"); set(tx,y+th+14,tz,"lamp");
      S.country.top=[tx, y+th+14, tz]; }
    // Marktzelte und Stände rund um den Brunnen
    const tent = (cx,cz,t) => { for(let hh=0;hh<4;hh++) for(let a=-(2-Math.floor(hh/2));a<=2-Math.floor(hh/2);a++) fill(cx+a,y+hh+1,cz-2+Math.floor(hh/2),cx+a,y+hh+1,cz+2-Math.floor(hh/2), hh%2 ? "woolW" : t);
      for(const [a,b] of [[-2,-2],[2,-2],[-2,2],[2,2]]) set(cx+a,y,cz+b,"planks"); fill(cx-1,y,cz,cx+1,y,cz,"planks"); set(cx,y+1,cz,"gold"); };
    tent(x-6,z-3,"woolR"); tent(x+6,z-2,"woolY"); tent(x-6,z+4,"woolY"); tent(x+6,z+5,"woolR");
    for(const [a,b,t] of [[-2,5,"woolW"],[2,5,"woolR"]]){ fill(x+a-1,y,z+b,x+a-1,y+2,z+b,"planks"); fill(x+a+1,y,z+b,x+a+1,y+2,z+b,"planks"); fill(x+a-1,y+3,z+b-1,x+a+1,y+3,z+b+1,t); fs(x+a,y+.25,z+b,"gold"); fs(x+a-.5,y+.25,z+b,"woolY"); fs(x+a+.5,y+.25,z+b,"shroom"); }
    // Lavabrunnen in der Mitte
    { const fx=x, fz=z; ring(fx,y,fz,2.6,"chisel"); disk(fx,y,fz,1.8,"lava"); fill(fx,y,fz,fx,y+3,fz,"sbrick"); set(fx,y+4,fz,"lava"); for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]) set(fx+a,y+3,fz+b,"lavaFall");
      S.country.fountain=[fx,y+5,fz]; }
    // Schmiede seitlich mit Esse, Amboss und Schornstein
    { const sx=x-8, sz=z-8; for(const [a,b] of [[-2,-2],[2,-2],[-2,2],[2,2]]) fill(sx+a,y,sz+b,sx+a,y+4,sz+b,"basalt");
      for(let a=-3;a<=3;a++) for(let k=0;k<3;k++) fill(sx+a,y+5+k,sz-3+k,sx+a,y+5+k,sz+3-k,"roof");
      fill(sx-2,y,sz-2,sx,y+1,sz-2,"sbrick"); set(sx-1,y+1,sz-1,"magma"); set(sx-1,y+2,sz-2,"lava");
      fill(sx-1,y+2,sz-2,sx-1,y+11,sz-2,"sbrick"); set(sx-1,y+12,sz-2,"magma"); chimneys.unshift([sx-.5,y+13,sz-1.5]);
      set(sx+1,y,sz+1,"anvil"); fs(sx+1,y+1,sz+1,"anvil"); fs(sx+1.5,y+1,sz+1,"anvil"); }
    for(const [a,b] of [[-9,0],[8,0],[-3,-7],[5,-7]]) lantern(x+a,y,z+b);
    S.country.base=y; S.country.cam={pos:[x+4,y+26,z+60], look:[x+11,y+10,z-3]}; }

  // Unterer Platz: Lavabrunnen mit Drachenkopf-Speiern, zwei Obelisken mit Feuerschalen
  { const fx=60, fz=80, y=L0; ring(fx,y,fz,3.6,"chisel"); ring(fx,y+1,fz,3.6,(xx,yy,zz)=> (xx+zz)%2 ? "sbrick" : null); disk(fx,y,fz,2.8,"lava");
    fill(fx,y,fz,fx,y+4,fz,"sbrick"); disk(fx,y+5,fz,1.4,"chisel"); set(fx,y+6,fz,"lava"); for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){ set(fx+a,y+5,fz+b,"lavaFall"); fs(fx+a*1.75,y+4.5,fz+b*1.75,"gold"); }
    for(const a of [-9,9]){ fill(fx+a,y,fz-1,fx+a+1,y,fz,"chisel"); fill(fx+a,y+1,fz-1,fx+a+1,y+7,fz,(xx,yy)=> (yy-y)%3===0 ? "gold" : "obsidian"); fill(fx+a,y+8,fz-1,fx+a+1,y+8,fz,"sbrick"); fill(fx+a,y+9,fz-1,fx+a+1,y+9,fz,"lamp"); } }

  // Hafen: Stege ins Lavameer, Boote aus Obsidian
  for(const px of [40,80]){ fill(px-1,L0-1,89,px+1,L0-1,97,"basalt"); for(let zz=89;zz<=97;zz+=4){ fill(px-2,1,zz,px-2,L0-1,zz,"basalt"); fill(px+2,1,zz,px+2,L0-1,zz,"basalt"); } set(px-1,L0,97,"lamp"); set(px+1,L0,97,"lamp"); }
  const boat = (bx,bz,sail) => { for(let a=-4;a<=4;a++){ const w = Math.abs(a)>=3 ? 0 : 1; fill(bx+a,LL,bz-w,bx+a,LL,bz+w,"obsidian"); set(bx+a,LL+1,bz-w-1+(w?0:1),"obsidian"); set(bx+a,LL+1,bz+w+1-(w?0:1),"obsidian"); }
    fill(bx,LL+1,bz,bx,LL+8,bz,"planks"); for(let k=0;k<5;k++) fill(bx+1,LL+3+k,bz,bx+4-Math.floor(k/2),LL+3+k,bz,sail); };
  boat(46,95,"woolR"); boat(74,94,"woolY");

  // Serpentinenweg mit Laternen von der Festung hinauf zum Kraterschrein
  { const way = [[48,27],[38,23],[50,19],[70,17],[78,14],[66,12],[56,12]]; let k=0;
    for(let i=0;i<way.length-1;i++){ const a=way[i], b=way[i+1], n=Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1]));
      for(let s2=0;s2<=n;s2++){ const cx=a[0]+(b[0]-a[0])*s2/n, cz=a[1]+(b[1]-a[1])*s2/n;
        for(let o=-1;o<=1;o++){ const x=Math.round(cx), z=Math.round(cz+o); if(isRiv(x,z)) continue; const h=topAt(x,z,120); if(h<L2) continue; set(x,h,z,"flag"); for(let y=h+1;y<h+4;y++) set(x,y,z,null); }
        if(++k%7===0){ const x=Math.round(cx), z=Math.round(cz)+2; if(!isRiv(x,z)){ const h=topAt(x,z,120); set(x,h+1,z,"basalt"); set(x,h+2,z,"lamp"); } } } } }
  // Kraterschrein: Tor aus Obsidian am vorderen Kraterrand
  { const z=VZ+CR+2, x=VX, h=topAt(x,z,120);
    for(const a of [-3,3]) fill(x+a,h,z,x+a,h+7,z,(xx,yy)=> (yy-h)%3===2 ? "gold" : "obsidian"); fill(x-4,h+8,z,x+4,h+8,z,"obsidian"); fill(x-3,h+9,z,x+3,h+9,z,"sbrick"); set(x,h+10,z,"gold"); set(x,h+11,z,"lamp");
    for(const a of [-3,3]) set(x+a,h+8,z+1,"lamp"); }
  // glühende Risse im Vulkanhang
  for(let i=0;i<26;i++){ let x=VX+(rand()-.5)*80, z=VZ+4+rand()*22; const dx=(rand()-.5)*2, dz=.6+rand()*.8;
    for(let s2=0;s2<8+rand()*10;s2++){ const xi=Math.round(x), zi=Math.round(z); if(zi<0||zi>=29||xi<0||xi>=W) break; const h=topAt(xi,zi,120); if(h>L2+2 && !isRiv(xi,zi) && get(xi,h,zi)!=="flag") set(xi,h,zi,"magma"); x+=dx*.6+(rand()-.5); z+=dz; } }
  // Basaltsäulen-Felder auf den Klippen
  for(let i=0;i<34;i++){ const cx=rand()<.5 ? 2+rand()*12 : W-14+rand()*12, cz=10+rand()*76; const n=5+Math.floor(rand()*8);
    for(let k=0;k<n;k++){ const x=Math.round(cx+(rand()-.5)*5), z=Math.round(cz+(rand()-.5)*5); if(x<0||x>=W||z<0||z>=D||city(x,z)) continue; const h=topAt(x,z,120); if(h<=LL) continue;
      const hh=2+Math.floor(rand()*7); fill(x,h+1,z,x,h+hh,z,"basalt"); if(rand()<.2) set(x,h+hh+1,z,"magma"); } }

  // Felsnadeln und Glutspalten auf den Klippen
  for(let i=0;i<120;i++){ const x=Math.floor(rand()*W), z=Math.floor(rand()*92), h=Hm[z][x]; if(h<=LL+1 || city(x,z) || isRiv(x,z) || Math.hypot(x-VX,(z-VZ)*1.1)<20) continue;
    if(rand()<.6) fill(x,h,z,x,h+1+Math.floor(rand()*5),z,"basalt"); else set(x,h-1,z,"magma"); }

  // ---------- Landschaft bis zum Horizont ----------
  const Fr = A.far; Fr.cell = 3;
  const volcs = [[-70,-50,34,46],[190,-56,34,50],[60,-150,56,110],[-120,0,30,44],[240,-4,30,48],[-74,-140,34,68],[196,-150,34,74]];
  const away = (x,z) => Math.hypot(Math.max(0,-x,x-W), Math.max(0,-z,z-D));
  const fh = (x,z) => { const m = Math.min(1, Math.max(0,(away(x,z)-24)/40)); let h = LL-4 + (fbm(x*.03+7,z*.03)-.5)*44*m;
    const v = vol(x,z); if(v>h) h=v;
    for(const [vx,vz,r,ph] of volcs){ const d=Math.hypot(x-vx,z-vz); if(d<r){ const vv = d<r*.2 ? ph*.8 : ph*Math.pow(1-d/r,1.15); if(vv>h) h=vv; } }
    return h; };
  const inCrater = (x,z) => volcs.some(([vx,vz,r])=>Math.hypot(x-vx,z-vz)<r*.2);
  const lavaStreak = (x,z) => volcs.some(([vx,vz,r])=>{ const d=Math.hypot(x-vx,z-vz); if(d>r*.95) return false; const a=Math.atan2(z-vz,x-vx)*6+vx; return d<r*.75 && Math.abs(Math.sin(a+d*.06))>.992; });
  A.farTerrain({ x0:-260, x1:W+260, z0:-260, z1:D+60, base:0,
    skip:(x,z)=> (x>-3 && x<W+3 && z>-3 && z<D+90) || fh(x,z) < LL+1,
    h: fh,
    top:(x,z)=> inCrater(x,z) ? "lava" : lavaStreak(x,z) ? "magma" : (rand()<.7 ? "blackstone" : "basalt"),
    fill:(x,z,y,hc)=> lavaStreak(x,z) && y>=hc-2 ? "magma" : (y%3===0 ? "basalt" : "blackstone") });

  // ---------- Tiere ----------
  const creatures = [
    { ...dragon(), orbit:{c:[60,46,40], r:[74,52], speed:.11, ph:1.2, bob:2, wander:{f:.21, r:.2, y:8, eight:8, dx:12, dz:10, span:14, clear:6}}, scale:.55 },
    { ...dragon(), orbit:{c:[VX,VTOP+14,VZ+4], r:[24,18], speed:.32, ph:3, bob:1.5, wander:{f:.3, r:.15, y:3, span:6, clear:5}}, scale:.2 },
    { ...phoenix({perch:true}), at:[S.grammar.x+13.5, L2+15+3+4.4+3.1, S.grammar.z+7.5], yaw:-1.9, hover:[.12,.9], scale:.24 },
    { ...salamander({walk:true, speed:9}), orbit:{c:[60,L1,61.5], r:[6,.6], speed:.3, ph:0, bob:.05, cycle:[18,.4,2]}, scale:.11 },
    { ...salamander({walk:false}), at:[S.country.x+1.6, L1, S.country.z+3.2], yaw:2.4, scale:.11 }
  ];
  const cr = S.country.fountain;
  return {
    W, D, blocks, spots:S, exposure:1.12,
    sky:[[0,"#1E0404"],[.35,"#6A1608"],[.55,"#C2460F"],[.7,"#F08A30"],[1,"#7A1C0A"]], fog:[0x6A1E0A,110,380],
    hemi:[0xFFC8A0, 0x5A1A0E, 1.65], sun:{color:0xFFC890, int:1.9, pos:[-50,90,70]}, bloom:[.55,.4,.86],
    lights:[{pos:[VX,VTOP+6,VZ], color:0xFF6A1A, int:1400, dist:80, flicker:true},
            {pos:[S.grammar.x,L2+6,S.grammar.z+9], color:0xFF8A3A, int:180, dist:26},
            {pos:[S.country.x,L1+4,S.country.z], color:0xFF8A3A, int:140, dist:22},
            {pos:[S.vocabulary.x,L1+5,S.vocabulary.z+6], color:0xFF9A5A, int:120, dist:22},
            {pos:[60,L0+4,80], color:0xFF8A3A, int:160, dist:30}],
    planes:[{y:LL-.02, tex:T.lavaSea, repeat:450, size:900, em:.9, anim:[.033,.022]}],
    particles:[{n:1100, area:[0,W,LL,50,0,D], vy:2.4, wob:.6, color:0xFF9A3A, size:.3, add:true}, {n:500, area:[-120,W+120,LL,90,-150,0], vy:3, wob:1, color:0xFF8A2A, size:.9, add:true, soft:true}],
    puffs:[{n:16, pos:[VX,VTOP-4,VZ], dx:10, dy:34, dz:-6, s0:6, s1:22, color:0x5A5050, opacity:.6, speed:.045, spread:3},
           {n:8, pos:[VX,VTOP-6,VZ], dx:0, dy:6, dz:0, s0:12, s1:6, color:0xFF6A1A, opacity:.35, speed:.06, spread:3, add:true},
           ...chimneys.slice(0,14).map(c=>({n:3, pos:c, dx:2, dy:9, dz:-1, s0:1.2, s1:4, color:0x4A4040, opacity:.4, speed:.08, spread:.6})),
           {n:12, pos:[60,96,-150], dx:30, dy:60, dz:-10, s0:16, s1:40, color:0x4A3A36, opacity:.5, speed:.03, spread:8},
           {n:8, pos:[-70,48,-50], dx:20, dy:46, dz:-10, s0:12, s1:30, color:0x4A3A36, opacity:.45, speed:.035, spread:6},
           {n:8, pos:[190,52,-56], dx:-20, dy:46, dz:-10, s0:12, s1:30, color:0x4A3A36, opacity:.45, speed:.035, spread:6}],
    bombs:{pos:[VX,VTOP-8,VZ], n:18, period:11, burst:2, life:4.2, speed:[5,15], up:[18,28], g:-15, size:.9, color:0xFFC060, glow:0xFF6A1A, floor:LL, light:[0xFF7A2A, 1800, 120], biasZ:3},
    beams:[{pos:[S.grammar.x-13,L2+22,S.grammar.z-7], color:0xFFA060, w:5, len:70, opacity:.12, speed:.2, tilt:.5},
           {pos:[S.grammar.x+13,L2+22,S.grammar.z-7], color:0xFFA060, w:5, len:70, opacity:.12, speed:.18, ph:2, tilt:.5}],
    creatures,
    home:{pos:[W/2,62,D+84], look:[W/2,32,D/2-12]}, homePortrait:{pos:[W/2,96,D+150], look:[W/2,16,D/2-6]},
    ui:{bg:"rgba(34,8,4,.9)", border:"#FF9A4A", glow:"rgba(255,110,30,.55)", text:"#FFF1E2", sub:"#E8B48C", accent:"#FFB23A", "accent-ink":"#2A0A04", chip:"rgba(30,8,4,.8)"}
  };
}
