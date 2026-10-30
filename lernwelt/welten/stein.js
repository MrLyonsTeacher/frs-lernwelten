// Klasse 7 · Dwarven Caves – Zwergenstadt in einer Riesenhöhle: Terrassen mit Treppen, Tempelfassade, Zwergenstatue, Kristallmine und Schmiede
import { redDemon } from "./meer.js";
import { dwarf, bat } from "./tiere.js";
export function build(A){
  const { rand, fbm, pick, set, get, fill, walls, disk, ring, cyl, tube, ball, ellip, dome, cone, line, topAt, tex, P, noise, stripes, bricks, rings, planks } = A;
  const ore = (base, spot) => tex(g=>{ for(let x=0;x<16;x++) for(let y=0;y<16;y++) P(g,x,y,pick(base)); for(let i=0;i<5;i++){ const x=1+Math.floor(rand()*13), y=1+Math.floor(rand()*13); P(g,x,y,spot[0]); P(g,x+1,y,spot[1]); P(g,x,y+1,spot[1]); } });
  const crystal = cols => tex(g=>{ for(let x=0;x<16;x++) for(let y=0;y<16;y++){ const d=(x+y)%6; P(g,x,y, d===0?cols[0]:d<3?cols[1]:cols[2]); } });
  const STONE = ["#7A746C","#6E6862","#857F76","#645E58"];
  const T = {
    stone: noise(STONE, 6, ["#5A544E"]), deep: noise(["#5E5852","#68625A","#58524C","#6E6860"], 8, ["#4E4842"]),
    flag: tex(g=>{ for(let y=0;y<16;y++) for(let x=0;x<16;x++) P(g,x,y, (x===0||y===0||(x===8&&y<8)||(y===8&&x>4)) ? "#2E2A26" : pick(["#7A746A","#6E685E","#847E74","#6A645A"])); P(g,3,5,"#5A544E"); P(g,4,6,"#5A544E"); P(g,11,12,"#5A544E"); }),
    sbrick: bricks(["#8A847A","#7E786E","#948E84"], "#4E4842"), chisel: tex(g=>{ for(let y=0;y<16;y++) for(let x=0;x<16;x++){ const e=x<1||y<1||x>14||y>14, i=x>3&&x<12&&y>3&&y<12, k=x>5&&x<10&&y>5&&y<10; P(g,x,y, e?"#4E4842":k?"#A49E94":i?"#7A746A":"#8E887E"); } }),
    statue: noise(["#A8A49C","#B4B0A8","#9C988F","#ACA8A0"], 4, ["#8C887F"]),
    gold: noise(["#F5C542","#FFE27A","#E8B030","#FFD95A"]),
    planks: planks(["#9A6E3E","#A87A48","#8A6236"], "#5A3E22"), log: stripes(["#5E4024","#6E4C2C","#4E361E"], true),
    iron: noise(["#9A9EA6","#8A8E96","#AAAEB4"]), dark: noise(["#1A1614","#221E1A","#14100E"]),
    lava: tex(g=>{ for(let x=0;x<16;x++) for(let y=0;y<16;y++){ const v=Math.sin(x*.9+y*.35)+Math.sin(y*.8-x*.3)+rand()*.6; P(g,x,y, v>1.2?"#FFD24A":v>.3?"#FF9A1E":v>-.6?"#FF6A0A":"#D9430A"); } }),
    glow: noise(["#FFD27A","#FFB84A","#FFE6A8","#F0A030"], 10, ["#A8642A"]),
    door: tex(g=>{ for(let x=0;x<16;x++) for(let y=0;y<16;y++){ const v=y/16; P(g,x,y, rand()<.08 ? "#FFF0C0" : v<.3?"#FFE2A0":v<.7?"#FFC060":"#F09A30"); } }),
    win: tex(g=>{ for(let x=0;x<16;x++) for(let y=0;y<16;y++){ const fr = x<3||x>12||y<2||y>13||x===7||x===8; P(g,x,y, fr ? "#4E4842" : pick(["#FFC860","#FFD27A","#FFB040"])); } }),
    rune: tex(g=>{ for(let x=0;x<16;x++) for(let y=0;y<16;y++) P(g,x,y, pick(["#8A847A","#7E786E"])); for(const [a,b] of [[3,3],[4,4],[5,5],[6,6],[7,7],[8,8],[9,9],[10,10],[11,11],[12,12],[12,3],[11,4],[10,5],[5,10],[4,11],[3,12],[7,3],[7,12],[3,7],[12,7]]) P(g,a,b,"#7AE8FF"); }),
    amethyst: crystal(["#E2C8FF","#B88AFF","#8A4FE8"]), emerald: crystal(["#C8FFE2","#4AF0A0","#18B868"]),
    sapphire: crystal(["#D2E6FF","#6AA8FF","#2A62E0"]), ruby: crystal(["#FFD2DA","#FF6A80","#D2203A"]),
    goldOre: ore(STONE, ["#FFD24A","#E8A81C"]), diaOre: ore(["#3A3634","#45403C","#302C2A"], ["#8AF0FF","#3FC8E8"]),
    woolR: noise(["#B8302A","#C83A32","#A8261F"]), woolB: noise(["#2F5DA8","#3A6AC0","#244E90"]), woolY: noise(["#E8B030","#F5C542"]),
    shroom: noise(["#5AF0FF","#8AF6FF","#2AC8E8"], 6, ["#E6FFFF"]),
    copper: tex(g=>{ for(let y=0;y<16;y++) for(let x=0;x<16;x++) P(g,x,y, x%4===0 ? "#2E6A5A" : pick(["#4A9A82","#58A88E","#3E8A74"])); }),
    slate: tex(g=>{ for(let y=0;y<16;y++) for(let x=0;x<16;x++){ const r=Math.floor(y/3), off=(r%2)*2; P(g,x,y, y%3===2 ? "#1E2228" : ((x+off)%4===0 ? "#2E343C" : pick(["#3A424C","#444C56","#363E48"]))); } }),
    timber: tex(g=>{ for(let y=0;y<16;y++) for(let x=0;x<16;x++) P(g,x,y, (x<2||x>13||y<2||y>13||Math.abs(x-y)<1.2) ? "#4A2E18" : pick(["#E8DCC0","#DED0B2","#F0E4CA"])); }),
    goldT: noise(["#C8901E","#E0A830","#B07A18","#F0C040"], 10, ["#FFF0A0"]),
    gemA: tex(g=>{ for(let x=0;x<16;x++) for(let y=0;y<16;y++){ const d=(x*2+y)%7; P(g,x,y, d===0?"#F4E0FF":d<3?"#C08AFF":"#7A3AD8"); } }),
    gemE: tex(g=>{ for(let x=0;x<16;x++) for(let y=0;y<16;y++){ const d=(x*2+y)%7; P(g,x,y, d===0?"#E0FFF0":d<3?"#4AE8A0":"#12905A"); } }),
    gemS: tex(g=>{ for(let x=0;x<16;x++) for(let y=0;y<16;y++){ const d=(x*2+y)%7; P(g,x,y, d===0?"#E0F0FF":d<3?"#6AA8FF":"#2450C8"); } }),
    gemR: tex(g=>{ for(let x=0;x<16;x++) for(let y=0;y<16;y++){ const d=(x*2+y)%7; P(g,x,y, d===0?"#FFE6EA":d<3?"#FF5A78":"#B01834"); } }),
    roofD: noise(["#6A2A22","#5A2420","#7A3228"]), sbrickD: bricks(["#5E5850","#6A645A","#544E48"], "#2E2A26"), tileR: noise(["#8A3A2E","#9A4434","#7A3228"]), tileB: noise(["#2E4A6A","#36567A","#28405E"]),
    carpet: tex(g=>{ for(let y=0;y<16;y++) for(let x=0;x<16;x++) P(g,x,y, (x<2||x>13) ? "#E8B030" : ((x+y)%8===0 ? "#7A1A1A" : pick(["#A8261F","#B8302A"]))); }),
    banR: tex(g=>{ for(let y=0;y<16;y++) for(let x=0;x<16;x++) P(g,x,y, (x<2||x>13) ? "#E8B030" : (Math.abs(x-7.5)+Math.abs(y-8)<4 ? "#E8B030" : pick(["#A8261F","#B8302A"]))); }),
    banB: tex(g=>{ for(let y=0;y<16;y++) for(let x=0;x<16;x++) P(g,x,y, (x<2||x>13) ? "#E8B030" : (Math.abs(x-7.5)<1.2||Math.abs(y-8)<1.2 ? "#E8B030" : pick(["#2F5DA8","#3A6AC0"]))); }),
    gear: tex(g=>{ for(let x=0;x<16;x++) for(let y=0;y<16;y++){ const d=Math.hypot(x-7.5,y-7.5), a=Math.atan2(y-7.5,x-7.5); P(g,x,y, d<2 ? "#3A3A40" : d<5.5 || (d<7.5 && Math.sin(a*8)>0) ? pick(["#B8862A","#C8963A"]) : "rgba(0,0,0,0)"); } }), chain: tex(g=>{ for(let x=0;x<16;x++) for(let y=0;y<16;y++) P(g,x,y, (x>5&&x<10&&(y%6<4)) ? "#5A5E66" : "rgba(0,0,0,0)"); })
  };
  const blocks = {
    stone:{side:T.stone}, deep:{side:T.deep}, flag:{side:T.sbrick, top:T.flag}, sbrick:{side:T.sbrick}, chisel:{side:T.chisel, top:T.sbrick}, statue:{side:T.statue},
    gold:{side:T.gold, em:.35}, planks:{side:T.planks}, log:{side:T.log, top:T.planks}, iron:{side:T.iron}, dark:{side:T.dark},
    lava:{side:T.lava, em:1.25, anim:[.1,.06]}, glow:{side:T.glow, em:1.3, halo:[0xFFB84A,3.6,.6]}, door:{side:T.door, em:.75}, win:{side:T.win, em:1.0}, rune:{side:T.rune, top:T.sbrick, em:.6},
    amethyst:{side:T.amethyst, em:1.0}, emerald:{side:T.emerald, em:.9}, sapphire:{side:T.sapphire, em:1.0}, ruby:{side:T.ruby, em:.95},
    goldOre:{side:T.goldOre}, diaOre:{side:T.diaOre, em:.15}, woolR:{side:T.woolR}, woolB:{side:T.woolB}, woolY:{side:T.woolY}, shroom:{side:T.shroom, em:1.0},
    chain:{side:T.chain, alpha:.99, cross:true},
    sbrickD:{side:T.sbrickD}, roofD:{side:T.roofD}, copper:{side:T.copper}, slate:{side:T.slate}, timber:{side:T.timber}, goldT:{side:T.goldT, em:.25},
    gemA:{side:T.gemA, em:.28}, gemE:{side:T.gemE, em:.25}, gemS:{side:T.gemS, em:.28}, gemR:{side:T.gemR, em:.25}, spark:{side:T.glow, em:1.6, halo:[0xFFFFFF,2.2,.6]}, tileR:{side:T.tileR}, tileB:{side:T.tileB}, carpet:{side:T.carpet}, banR:{side:T.banR}, banB:{side:T.banB},
    lavaFall:{side:T.lava, em:1.4, anim:[0,-.5], soft:true}, lamp:{side:T.glow, em:1.4, halo:[0xFFB84A,3.2,.55]}, cyan:{side:T.shroom, em:1.2, halo:[0x5AF0FF,3,.5]},
    gear:{side:T.gear, alpha:.99, cross:true}
  };
  const W=88, D=68, L0=5, L1=13, L2=21, TOP=54, OPEN=40;
  // Gelände: drei Terrassen, hinten die Felswand, an den Seiten Wände (vorne offen zu weiteren Höhlen)
  const level = z => z>=44 ? L0 : z>=26 ? L1 : z>=10 ? L2 : TOP;
  for(let z=0; z<D; z++) for(let x=0; x<W; x++){
    let h = level(z); const sideD = Math.max(5-x, x-(W-6));
    if(sideD>0 && z>=OPEN) h = Math.max(h, L0 + Math.round(fbm(x*.3,z*.3)*3));
    if(z<10) h = TOP - Math.round(fbm(x*.1,1)*2);
    for(let y=0;y<h;y++){ let t = y===h-1 && h<=L2 ? "flag" : (h>=TOP && rand()<.03 ? pick(["goldOre","diaOre"]) : (rand()<.3 ? "deep" : "stone")); set(x,y,z,t); } }
  // Stützmauern der Terrassen mit Zierbändern
  for(let x=6;x<W-6;x++){ for(let y=L0;y<L1;y++) set(x,y,25+18, (y===L1-1)?"chisel":"sbrick"); for(let y=L1;y<L2;y++) set(x,y,25, (y===L2-1)?"chisel":"sbrick"); set(x,L1,43,"chisel"); set(x,L2,25,"chisel"); }
  // Treppen: Stufen nach hinten hinauf
  const stairs = (x0,x1,yFrom,zFront,steps) => { for(let i=0;i<steps;i++){ fill(x0,yFrom-1,zFront-i,x1,yFrom+i,zFront-i,"sbrick"); fill(x0,yFrom+i,zFront-i,x1,yFrom+i,zFront-i,"flag"); }
    for(let i=0;i<steps;i++){ set(x0-1,yFrom+i+1,zFront-i,"chisel"); set(x1+1,yFrom+i+1,zFront-i,"chisel"); }
    for(const xx of [x0-1,x1+1]){ fill(xx,yFrom,zFront+1,xx,yFrom+2,zFront+1,"chisel"); set(xx,yFrom+3,zFront+1,"glow"); } };
  stairs(38,50,L0,51,8); stairs(10,14,L0,51,8); stairs(60,63,L0,51,8);
  stairs(39,49,L1,33,8); stairs(18,21,L1,33,8); stairs(64,67,L1,33,8);
  // Bögen mit warmem Licht in einer Wand (Wand zeigt nach +z)
  const archZ = (x,y,z,w,h) => { const hw=Math.floor(w/2); for(let a=-hw;a<=hw;a++) for(let b=0;b<h+hw;b++){ const inside = b<h || Math.hypot(a,b-h)<hw+.3; if(inside){ set(x+a,y+b,z,null); set(x+a,y+b,z-1,"door"); } }
    for(let a=-hw-1;a<=hw+1;a++) for(let b=0;b<=h+hw+1;b++){ const on = (Math.abs(a)===hw+1 && b<=h) || (b>h && Math.abs(Math.hypot(a,b-h)-(hw+1))<.6); if(on) set(x+a,y+b,z+1,"chisel"); }
    set(x,y+h+hw+1,z+1,"gold"); };
  // Bögen in Wand mit Blick nach +x / -x
  const archX = (x,y,z,w,h,dir) => { const hw=Math.floor(w/2); for(let a=-hw;a<=hw;a++) for(let b=0;b<h+hw;b++){ if(b<h || Math.hypot(a,b-h)<hw+.3){ set(x,y+b,z+a,null); set(x-dir,y+b,z+a,"door"); } }
    for(let a=-hw-1;a<=hw+1;a++) for(let b=0;b<=h+hw+1;b++){ const on = (Math.abs(a)===hw+1 && b<=h) || (b>h && Math.abs(Math.hypot(a,b-h)-(hw+1))<.6); if(on) set(x+dir,y+b,z+a,"chisel"); } };
  // Arkaden in den Stützmauern
  for(const ax of [24,32,54,70,78]){ archZ(ax,L0,43,3,4); } for(const ax of [14,30,58,74]) archZ(ax,L1,25,3,4);

  // ---------- Grammar: Große Tempelfassade in der Rückwand ----------
  const S = {
    grammar:   {x:44, z:10, col:0xFFD24A, ort:"Great Dwarf Temple"},
    vocabulary:{x:15, z:35, col:0xB88AFF, ort:"Crystal Mine"},
    country:   {x:72, z:58, col:0xFF8A3A, ort:"Forge Market"}
  };
  { const x=44, y=L2, z=10;
    fill(x-15,y,z,x+15,y+29,z+1,"sbrick"); fill(x-16,y+29,z,x+16,y+31,z+2,"chisel"); for(let a=-16;a<=16;a+=2) set(x+a,y+30,z+3,"gold");
    for(const a of [-13,-8,-3,3,8,13]){ fill(x+a,y,z+2,x+a+1,y+26,z+3,(xx,yy)=> (yy-y)%7===0?"chisel":"statue"); fill(x+a-1,y+27,z+2,x+a+2,y+28,z+4,"chisel"); set(x+a,y+28,z+5,"gold"); set(x+a+1,y+28,z+5,"gold"); fill(x+a-1,y,z+2,x+a+2,y+1,z+4,"chisel"); }
    // großes Tor mit Licht
    for(let a=-4;a<=4;a++) for(let b=0;b<16;b++){ if(b<11 || Math.hypot(a,b-11)<4.6){ set(x+a,y+b,z,"door"); set(x+a,y+b,z+1,null); } }
    for(let a=-6;a<=6;a++) for(let b=0;b<=17;b++){ const on=(Math.abs(a)>=5&&Math.abs(a)<=6&&b<=11)||(b>11&&Math.hypot(a,b-11)>=4.6&&Math.hypot(a,b-11)<6.4); if(on) set(x+a,y+b,z+2, Math.abs(a)===5||Math.hypot(a,b-11)<5.5?"gold":"chisel"); }
    // runde Scheibe oben (Sonnenrad)
    const my=y+38; for(let a=-6;a<=6;a++) for(let b=-6;b<=6;b++){ const d=Math.hypot(a,b); if(d<=6.3) set(x+a,my+b,z+1, d>5.2?"gold":d>4.2?"chisel":d>1.5?((Math.atan2(b,a)*4/Math.PI|0)%2?"door":"glow"):"gold"); }
    for(let a=-9;a<=9;a++) for(let b=-2;b<=9;b++) if(Math.abs(a)>=7 && b<=Math.max(2, 9-(Math.abs(a)-7)*3)) set(x+a,my+b-2,z, "chisel");
    // Fries mit Runen
    for(let a=-14;a<=14;a++) set(x+a,y+28,z+2, a%3===0 ? "rune" : "chisel");
    // Pylone mit Feuerschalen vor dem Tempel
    for(const a of [-11,11]){ fill(x+a,y,z+8,x+a+1,y+5,z+9,"chisel"); fill(x+a-1,y+6,z+7,x+a+2,y+6,z+10,"iron"); fill(x+a,y+7,z+8,x+a+1,y+7,z+9,"glow"); }
    S.grammar.top=[x, y+20, z+4]; S.grammar.lift=1; S.grammar.base=y+16; S.grammar.cam={dist:54, up:.06, lookY:y+17, side:0}; }

  // ---------- Riesige Zwergenstatue (links oben) ----------
  const statue = (x,y,z) => {
    fill(x-7,y,z-6,x+7,y+3,z+6,"chisel"); fill(x-7,y+3,z-6,x+7,y+3,z+6,"sbrick"); for(let a=-6;a<=6;a+=3) set(x+a,y+2,z+7,"rune"); fill(x-7,y+4,z-6,x+7,y+4,z+6,"gold");
    const b=y+5, ST="statue";
    fill(x-4,b,z-2,x-1,b+2,z+3,ST); fill(x+1,b,z-2,x+4,b+2,z+3,ST);                 // Stiefel
    fill(x-3,b+3,z-1,x-1,b+8,z+1,ST); fill(x+1,b+3,z-1,x+3,b+8,z+1,ST);             // Beine
    fill(x-5,b+9,z-2,x+5,b+10,z+2,"gold"); fill(x-1,b+9,z+3,x+1,b+10,z+3,"gold");   // Gürtel, Schnalle
    for(let yy=b+11; yy<=b+19; yy++){ const w = yy<b+16 ? 5 : 6; fill(x-w,yy,z-2,x+w,yy,z+2,ST); }   // Rumpf
    fill(x-7,b+17,z-2,x-6,b+20,z+2,ST); fill(x+6,b+17,z-2,x+7,b+20,z+2,ST);         // Schultern
    fill(x-7,b+10,z-1,x-6,b+16,z+1,ST); fill(x+6,b+10,z-1,x+7,b+16,z+1,ST);         // Arme
    fill(x-5,b+11,z+3,x-4,b+13,z+4,ST); fill(x+4,b+11,z+3,x+5,b+13,z+4,ST);         // Hände nach vorn
    for(let yy=b+9; yy<=b+21; yy++){ const w = Math.max(1, Math.round((yy-b-9)*.35)+1); fill(x-w,yy,z+3,x+w,yy,z+3,ST); if(yy%3===0) fill(x-w,yy,z+4,x+w,yy,z+4, yy===b+12||yy===b+15 ? "gold" : ST); } // Bart
    fill(x-3,b+21,z-2,x+3,b+26,z+2,ST); set(x,b+23,z+3,ST); set(x,b+22,z+3,ST);       // Kopf, Nase
    set(x-2,b+24,z+3,"glow"); set(x+2,b+24,z+3,"glow"); fill(x-3,b+25,z+3,x-1,b+25,z+3,ST); fill(x+1,b+25,z+3,x+3,b+25,z+3,ST); // Augen, Brauen
    fill(x-4,b+27,z-3,x+4,b+27,z+3,"gold"); for(let yy=0;yy<4;yy++) fill(x-3+yy,b+28+yy,z-2+Math.floor(yy/2),x+3-yy,b+28+yy,z+2-Math.floor(yy/2),ST); // Helm
    fill(x,b+32,z-1,x,b+33,z+1,"gold"); line(x-4,b+28,z,x-7,b+31,z,"gold"); line(x+4,b+28,z,x+7,b+31,z,"gold");
    fill(x,b,z+6,x,b+14,z+6,"log"); fill(x-2,b,z+5,x+2,b+3,z+7,"iron"); fill(x-3,b+1,z+6,x+3,b+2,z+6,"iron"); // Kriegshammer vor der Statue
    fill(x-5,b+12,z+5,x+5,b+12,z+5,ST); return b+34; };
  const statueTop = statue(20,L2,16);

  // ---------- Vocabulary: Kristallmine in der linken Wand ----------
  const cluster = (cx,cy,cz,t,n,up=1) => { for(let i=0;i<n;i++){ const ang=rand()*Math.PI*2, len=2+Math.floor(rand()*3), dx=Math.cos(ang)*.45, dz=Math.sin(ang)*.45;
      for(let k=0;k<len;k++) set(Math.round(cx+dx*k), cy+k*up, Math.round(cz+dz*k), t); } };
  { const {x,z} = S.vocabulary, y=L1;
    for(let a=-3;a<=3;a++) for(let b=0;b<7;b++) for(let d=0;d<8;d++) if(b<5 || Math.abs(a)<3) set(4-d,y+b,z+a,null);
    for(let d=1;d<9;d++) for(let a=-3;a<=3;a++) set(4-d+1,y+7,z+a, d===8?null:"stone");
    for(let a=-3;a<=3;a++) for(let b=0;b<6;b++) set(-5,y+b,z+a,"dark");
    for(const zz of [z-3,z+3]) fill(5,y,zz,5,y+5,zz,"log"); fill(5,y+6,z-4,5,y+6,z+4,"log"); set(6,y+6,z,"glow");
    for(let a=-4;a<=18;a++){ set(x-10+a+3,y-1,z,"iron"); if(a%2===0){ set(x-10+a+3,y-1,z-1,"planks"); set(x-10+a+3,y-1,z+1,"planks"); } }
    // Lore voller Edelsteine
    fill(x+2,y,z-1,x+5,y+2,z+1,"iron"); fill(x+3,y+1,z,x+4,y+2,z,null); set(x+3,y+2,z,"amethyst"); set(x+4,y+2,z,"emerald"); set(x+3,y+3,z,"sapphire"); set(x+4,y+3,z,"ruby");
    for(const [t,dx,dz] of [["amethyst",-4,-6],["emerald",3,-6],["sapphire",-3,6],["ruby",6,5],["amethyst",8,-2],["sapphire",-6,4],["emerald",9,4]]) cluster(x+dx,y,z+dz,t,4);
    for(let i=0;i<40;i++){ const yy=y+2+Math.floor(rand()*24), zz=z-10+Math.floor(rand()*20); if(get(5,yy,zz) && !get(6,yy,zz)) set(6,yy,zz,pick(["amethyst","sapphire","emerald","ruby"])); }
    for(let i=0;i<6;i++) set(x-4+i*3, y, z+8, "shroom");
    for(const [lx,lz] of [[x-2,z+4],[x+7,z-4]]){ fill(lx,y,lz,lx,y+3,lz,"log"); set(lx,y+4,lz,"glow"); }
    S.vocabulary.top=[x+1,y+10,z]; S.vocabulary.base=y+3; S.vocabulary.cam={dist:36, up:.42, side:.25}; }

  // ---------- Country & people: Schmiede-Markt vorne rechts ----------
  { const {x,z} = S.country, y=L0;
    fill(x-4,y,z-8,x+4,y+7,z-4,"sbrick"); fill(x-5,y+8,z-9,x+5,y+8,z-3,"chisel"); fill(x-2,y,z-4,x+2,y+3,z-4,"lava"); fill(x-2,y+4,z-4,x+2,y+4,z-4,"glow"); fill(x-3,y,z-3,x+3,y,z-3,"chisel");
    for(let hh=9;hh<30;hh++) fill(x-1,y+hh,z-7,x+1,y+hh,z-5, hh%5===0?"chisel":"sbrick"); fill(x-1,y+30,z-7,x+1,y+30,z-5,"glow");
    for(const [ax,az] of [[x-3,z],[x+3,z+1]]){ fill(ax-1,y,az,ax+1,y,az,"dark"); set(ax,y+1,az,"dark"); fill(ax-2,y+2,az,ax+1,y+2,az,"dark"); }
    for(const [sx,sz,t] of [[x-10,z+3,"woolR"],[x+5,z+5,"woolB"],[x-9,z-5,"woolY"]]){ for(const [a,b] of [[0,0],[3,0],[0,3],[3,3]]) fill(sx+a,y,sz+b,sx+a,y+3,sz+b,"log");
      for(let a=-1;a<=4;a++) for(let b=-1;b<=4;b++) set(sx+a,y+4+((a+b)%2?0:0),sz+b, (a+b)%2 ? t : "woolY"); fill(sx,y,sz+1,sx+3,y,sz+2,"planks"); set(sx+1,y+1,sz+1,"gold"); set(sx+2,y+1,sz+2,"ruby"); set(sx+1,y+1,sz+2,"iron"); }
    for(const [bx,bz] of [[x+8,z-2],[x+9,z],[x-12,z-1],[x+7,z+9]]) fill(bx,y,bz,bx,y+1,bz,"planks");
    for(const [lx,lz] of [[x-6,z+9],[x+6,z-10],[x+10,z+6]]){ fill(lx,y,lz,lx,y+4,lz,"log"); set(lx,y+5,lz,"glow"); }
    S.country.top=[x,y+12,z]; S.country.base=y+4; S.country.cam={dist:36, up:.42, side:-.15}; }

  // Häuser auf der oberen Terrasse rechts
  { const hx=64, hz=15, y=L2; fill(hx-6,y,hz-4,hx+6,y+9,hz+3,"sbrick"); fill(hx-7,y+10,hz-5,hx+7,y+10,hz+4,"chisel"); for(let i=0;i<4;i++) fill(hx-6+i,y+11+i,hz-4,hx+6-i,y+11+i,hz+3,"sbrick");
    archZ(hx,y,hz+4,3,3); for(const a of [-4,4]){ set(hx+a,y+5,hz+4,"win"); set(hx+a,y+6,hz+4,"win"); } }
  // Laternen an Ketten von der Decke
  for(const [lx,lz,len] of [[30,20,14],[58,20,14],[44,32,10],[24,36,16],[64,36,16]]){ for(let k=0;k<len;k++) set(lx,TOP-1-k,lz,"chain"); fill(lx-1,TOP-1-len,lz-1,lx+1,TOP-2-len,lz+1,"iron"); set(lx,TOP-2-len,lz,"glow"); }
  // Steinhäuser links und rechts – damit es nach einer Stadt aussieht (Vorderseite zeigt zur Kamera)
  const chim = [];
  const stoneHouse = (x,y,z,w,d,h,opt={}) => { const hw=Math.floor(w/2), hd=Math.floor(d/2);
    fill(x-hw-1,y,z-hd-1,x+hw+1,y,z+hd+1,"flag");
    walls(x-hw,y+1,z-hd,x+hw,y+h,z+hd,(a,b,c)=> ((a===x-hw||a===x+hw)&&(c===z-hd||c===z+hd)) || b===y+h || b===y+1 ? "chisel" : "sbrick");
    for(const a of [-hw+2, hw-2]) if(Math.abs(a)>1){ set(x+a,y+3,z+hd,"win"); set(x+a,y+4,z+hd,"win"); set(x+a,y+5,z+hd+1,"chisel"); if(h>=8){ set(x+a,y+7,z+hd,"win"); } }
    if(d>=5){ set(x-hw,y+3,z,"win"); set(x+hw,y+3,z,"win"); }
    fill(x,y+1,z+hd,x,y+2,z+hd,"door"); set(x-1,y+3,z+hd,"chisel"); set(x+1,y+3,z+hd,"chisel"); set(x,y+3,z+hd,"chisel"); set(x,y+4,z+hd+1,"gold");
    set(x+(hw>2?2:1),y+3,z+hd+1,"glow");
    const R = hd+2; for(let i=0;i<=R;i++){ const zz=R-i; for(const sg of [-1,1]) fill(x-hw-1,y+h+1+i,z+sg*zz,x+hw+1,y+h+1+i,z+sg*zz, i===R ? "gold" : (i%2?"tileR":"roofD"));
      if(zz>0) for(const a of [-hw,hw]) fill(x+a,y+h+1+i,z-zz+1,x+a,y+h+1+i,z+zz-1, i===1 && zz>1 ? "win" : "sbrick"); }
    fill(x+hw-1,y+h+1,z-1,x+hw-1,y+h+R+3,z-1,"sbrick"); set(x+hw-1,y+h+R+4,z-1,"magma"); chim.push([x+hw-.5,y+h+R+5,z-.5]);
    if(opt.balcony){ for(let a=-hw;a<=hw;a++){ set(a+x,y+h-2,z+hd+1,"chisel"); if(a%2===0) set(a+x,y+h-1,z+hd+1,"iron"); } } };
  // ---------- Verschiedene Zwergenhäuser ----------
  const FH = A.fine, fh2 = (x,y,z,t) => FH.set(Math.round(x*2),Math.round(y*2),Math.round(z*2),t);
  // Turmhaus: rund, Schieferkegel, Balkonring
  const towerHouse = (x,y,z,r,h) => { fill(x-r-1,y,z-r-1,x+r+1,y,z+r+1,"flag");
    for(let yy=y+1;yy<=y+h;yy++) ring(x,yy,z,r,(a,b,c)=> (b-y)%4===0 ? "chisel" : ((b-y)%4===2 && (a+c)%3===0 ? "win" : "stone"));
    disk(x,y+h,z,r,"planks"); ring(x,y+h,z,r+1,"chisel"); for(let k=0;k<r+3;k++) ring(x,y+h+1+k,z,Math.max(.3,r+.6-k*.85),"slate"); set(x,y+h+r+4,z,"gold");
    set(x,y+1,z+r,"door"); set(x,y+2,z+r,"door"); fh2(x+1,y+3,z+r+.5,"lamp");
    chim.push([x+.5,y+h+r+5,z+.5]); };
  // Werkstatt: breit und niedrig, großes glühendes Tor, dicker Schornstein, Zahnrad an der Wand
  const workshop = (x,y,z,w,d) => { const hw=w>>1, hd=d>>1; fill(x-hw-1,y,z-hd-1,x+hw+1,y,z+hd+1,"flag");
    walls(x-hw,y+1,z-hd,x+hw,y+5,z+hd,(a,b,c)=> b===y+5 ? "chisel" : ((a===x-hw||a===x+hw)&&(c===z-hd||c===z+hd)) ? "sbrickD" : "sbrick");
    fill(x-hw,y+6,z-hd,x+hw,y+6,z+hd,"slate"); fill(x-hw+1,y+7,z-hd+1,x+hw-1,y+7,z+hd-1,"slate");
    for(let a=-1;a<=1;a++) for(let b=1;b<=3;b++) set(x+a,y+b,z+hd,"door"); fill(x-2,y+4,z+hd,x+2,y+4,z+hd,"iron");
    fill(x+hw-1,y+6,z-hd+1,x+hw,y+12,z-hd+2,"sbrickD"); fill(x+hw-1,y+13,z-hd+1,x+hw,y+13,z-hd+2,"magma"); chim.push([x+hw,y+14,z-hd+2]);
    for(let a=-1.5;a<=1.5;a+=.5) for(let b=-1.5;b<=1.5;b+=.5){ const dd=Math.hypot(a,b), an=Math.atan2(b,a); if(dd<1.4||(dd<1.9&&Math.sin(an*8)>0)) fh2(x-hw+1.5+a,y+3.5+b,z+hd+.75, dd<.4?"iron":"gold"); }
    set(x-hw-1,y+1,z+hd+1,"log"); set(x-hw-1,y+2,z+hd+1,"log"); set(x+hw+1,y+1,z+hd,"anvil"==="x"?"iron":"iron"); };
  // Wirtshaus: Fachwerk-Obergeschoss, Holzschild, Fässer
  const tavern = (x,y,z,w,d) => { const hw=w>>1, hd=d>>1; fill(x-hw-1,y,z-hd-1,x+hw+1,y,z+hd+1,"flag");
    walls(x-hw,y+1,z-hd,x+hw,y+4,z+hd,(a,b,c)=> ((a===x-hw||a===x+hw)&&(c===z-hd||c===z+hd)) ? "sbrickD" : (b===y+3 && (a+c)%3===0 ? "win" : "stone"));
    walls(x-hw-1,y+5,z-hd-1,x+hw+1,y+8,z+hd+1,(a,b,c)=> b===y+5 ? "log" : (b===y+7 && (a+c)%2===0 ? "win" : "timber"));
    for(let i=0;i<=hd+2;i++) fill(x-hw-2,y+9+i,z-hd-2+i,x+hw+2,y+9+i,z+hd+2-i, i===hd+2?"gold":"roofD");
    fill(x-1,y+1,z+hd,x+1,y+2,z+hd,"door"); fill(x+hw+1,y+4,z+hd,x+hw+3,y+4,z+hd,"log"); fill(x+hw+3,y+2,z+hd,x+hw+3,y+3,z+hd,"planks"); fh2(x+hw+3,y+1.75,z+hd+.5,"woolR");
    for(const [a,b] of [[-hw-1,hd+1],[-hw,hd+2],[hw+1,hd+2]]){ set(x+a,y+1,z+b,"log"); fh2(x+a,y+2,z+b,"planks"); } fh2(x-hw+.5,y+2.5,z+hd+1,"lamp");
    chim.push([x-hw+1,y+14,z]); fill(x-hw+1,y+9,z,x-hw+1,y+13,z,"sbrick"); };
  // Kuppelhaus: quadratisch, Kupferkuppel mit Goldspitze, Säulenvorbau
  const domeHouse = (x,y,z,r) => { fill(x-r-2,y,z-r-2,x+r+2,y,z+r+3,"flag");
    walls(x-r,y+1,z-r,x+r,y+5,z+r,(a,b,c)=> b===y+5 ? "chisel" : (b===y+3 && (a===x||c===z) ? "win" : "sbrick"));
    for(let yy=0;yy<=r;yy++) ring(x,y+6+yy,z,Math.sqrt(Math.max(0,(r+.4)**2-yy*yy)),"copper",1.4); set(x,y+7+r,z,"gold"); set(x,y+8+r,z,"gold");
    for(const a of [-2,2]){ fill(x+a,y+1,z+r+2,x+a,y+4,z+r+2,"chisel"); } fill(x-2,y+5,z+r+1,x+2,y+5,z+r+2,"chisel"); set(x,y+1,z+r,"door"); set(x,y+2,z+r,"door"); fh2(x,y+4.5,z+r+2.5,"lamp"); };
  // Stufenhaus: drei kleiner werdende Stockwerke mit Runenband und Goldkante
  const stepHouse = (x,y,z,w) => { let hw=w>>1, yy=y; fill(x-hw-1,y,z-hw-1,x+hw+1,y,z+hw+1,"flag");
    for(let k=0;k<3 && hw>=1;k++){ walls(x-hw,yy+1,z-hw,x+hw,yy+3,z+hw,(a,b,c)=> b===yy+3 ? (k===2?"goldT":"rune") : (b===yy+2 && (a+c)%2===0 && a!==x-hw && a!==x+hw ? "win" : (k%2?"sbrickD":"stone")));
      fill(x-hw,yy+4,z-hw,x+hw,yy+4,z+hw,"chisel"); yy+=4; hw-=1; } set(x,yy+1,z,"lamp");
    set(x,y+1,z+(w>>1),"door"); set(x,y+2,z+(w>>1),"door"); };
  workshop(75, L1, 30, 9, 6);
  towerHouse(29, L1, 30, 3, 8);
  tavern(20, L0, 62, 7, 4);
  domeHouse(79, L2, 18, 3);

  // ================= Erweiterung links und rechts =================
  const XL0=-46, XR1=W+45;
  // Boden: gleiche Terrassen wie in der Mitte, mit Stützmauern, Treppen und Laternen
  for(let z=10; z<D; z++) for(const [x0,x1] of [[XL0,-1],[W,XR1]]) for(let x=x0; x<=x1; x++){ const h=level(z); for(let y=0;y<h;y++) set(x,y,z, y===h-1 ? "flag" : (rand()<.3?"deep":"stone")); }
  for(const [x0,x1] of [[XL0,-1],[W,XR1]]) for(let x=x0;x<=x1;x++){ for(let y=L0;y<L1;y++) set(x,y,43,(y===L1-1)?"chisel":(y%6===0?"sbrickD":"sbrick")); for(let y=L1;y<L2;y++) set(x,y,25,(y===L2-1)?"chisel":(y%6===0?"sbrickD":"sbrick")); }
  for(const sx of [-24, W+22]){ stairs(sx-3,sx+3,L0,51,8); stairs(sx-3,sx+3,L1,33,8); }
  for(const ax of [-36,-12,W+10,W+34]){ archZ(ax,L0,43,3,4); archZ(ax,L1,25,3,4); }
  // Rückwand hinter der Erweiterung
  for(const [x0,x1] of [[XL0,-1],[W,XR1]]) for(let x=x0;x<=x1;x++) for(let z=0;z<10;z++) for(let y=0;y<TOP;y++) set(x,y,z, y>=L2 && rand()<.02 ? pick(["goldOre","diaOre"]) : (rand()<.3?"deep":"stone"));
  for(const [x0,x1] of [[XL0,-1],[W,XR1]]) for(let x=x0;x<=x1;x+=7) archZ(x+3,L2,9,3,5);

  // ---------- Links: riesige, sehr detaillierte Statue des Zwergenkönigs ----------
  const king = (x,y,z) => { const ST="statue", GD="gold", DK="deep";
    // Sockel: drei Stufen, Runenband, Goldkante, Inschrift-Tafeln
    for(let k=0;k<4;k++){ fill(x-11+k,y+k,z-9+k,x+11-k,y+k,z+9-k, k===3?"chisel":"sbrick"); }
    for(let a=-8;a<=8;a++){ set(x+a,y+2,z+7,(a%2)?"rune":"chisel"); set(x+a,y+3,z+7,GD); }
    for(const a of [-9,9]){ fill(x+a,y,z+8,x+a,y+6,z+8,"chisel"); fill(x+a-1,y+7,z+7,x+a+1,y+7,z+9,"iron"); set(x+a,y+8,z+8,"glow"); }
    const b=y+4;
    // Stiefel mit Goldkappen, Beine im Schritt
    fill(x-5,b,z-2,x-1,b+2,z+4,ST); fill(x+1,b,z-3,x+5,b+2,z+2,ST); fill(x-5,b,z+4,x-1,b,z+4,GD); fill(x+1,b,z+2,x+5,b,z+2,GD);
    fill(x-4,b+3,z-1,x-2,b+10,z+2,ST); fill(x+2,b+3,z-2,x+4,b+10,z+1,ST);
    // Kettenhemd-Rock und Gürtel mit großer Schnalle
    for(let yy=b+9; yy<=b+13; yy++){ const w=6-Math.floor((yy-b-9)*.3); fill(x-w,yy,z-3,x+w,yy,z+3,(xx,y2,zz)=> (xx+y2+zz)%2 ? "iron" : ST); }
    fill(x-6,b+14,z-3,x+6,b+15,z+4,"planks"); fill(x-2,b+14,z+4,x+2,b+15,z+5,GD); set(x,b+14,z+5,"ruby");
    // Rumpf mit Brustpanzer und Runen
    for(let yy=b+16; yy<=b+26; yy++){ const w = yy<b+21 ? 6 : 7; fill(x-w,yy,z-3,x+w,yy,z+4,ST); }
    for(let yy=b+18;yy<=b+24;yy++) for(let a=-3;a<=3;a++) if(Math.abs(a)+Math.abs(yy-b-21)<=4) set(x+a,yy,z+5, Math.abs(a)+Math.abs(yy-b-21)===4 ? GD : "iron");
    set(x,b+21,z+5,"sapphire");
    // Schulterpanzer, Umhang
    for(const s2 of [-1,1]){ ellip(x+s2*8,b+25,z,2.6,2,3.2,ST); fill(x+s2*8,b+24,z-3,x+s2*8,b+24,z+3,GD); }
    for(let yy=b+4; yy<=b+25; yy++){ const w=7+Math.floor((b+25-yy)*.12); fill(x-w,yy,z-5,x+w,yy,z-4,"woolR"); } fill(x-8,b+4,z-5,x+8,b+4,z-5,GD);
    // Arme: links auf den Schild gestützt, rechts hält die Axt hoch
    fill(x-10,b+14,z-1,x-8,b+23,z+2,ST); fill(x-10,b+12,z+1,x-8,b+13,z+3,ST);
    fill(x+8,b+19,z-1,x+10,b+24,z+2,ST); fill(x+9,b+25,z,x+11,b+32,z+2,ST); fill(x+9,b+33,z,x+11,b+34,z+2,ST);
    // Schild (rund, mit Gold und Rubin)
    for(let a=-5;a<=5;a++) for(let c=-5;c<=5;c++){ const d=Math.hypot(a,c); if(d<=5.3) set(x-12,b+8+c+5,z+3+a, d>4.5?GD:(d<1.3?"ruby":((Math.round(a)+Math.round(c))%3===0?"iron":ST))); }
    // Axt: langer Stiel, doppeltes Blatt
    fill(x+10,b+20,z+1,x+10,b+46,z+1,"log"); for(const s2 of [-1,1]) for(let k=0;k<6;k++) fill(x+10+s2*(1+k*.7|0),b+40-k*.6|0,z+1,x+10+s2*(1+k*.7|0),b+44+k*.6|0,z+1,"iron"); set(x+10,b+47,z+1,GD);
    // Kopf: Gesicht, Nase, Augen, buschige Brauen
    fill(x-4,b+27,z-2,x+4,b+34,z+3,ST); fill(x-1,b+30,z+4,x+1,b+32,z+5,ST); set(x,b+29,z+5,ST);
    for(const s2 of [-2,2]){ set(x+s2,b+32,z+4,"glow"); fill(x+s2-1,b+33,z+4,x+s2+1,b+33,z+5,ST); }
    // Bart: lang, in drei geflochtenen Zöpfen mit Goldringen
    for(let yy=b+16; yy<=b+30; yy++){ const w=Math.max(1, Math.round((yy-b-16)*.32)+1); fill(x-w,yy,z+4,x+w,yy,z+5,ST); }
    for(const a of [-3,0,3]) for(let yy=b+6; yy<b+17; yy++){ set(x+a,yy,z+5,(yy-b)%3===0?GD:ST); if((yy-b)%2) set(x+a+(yy%2?1:0),yy,z+6,ST); }
    fill(x-5,b+29,z+4,x+5,b+29,z+4,ST);  // Schnurrbart
    // Helm mit Hörnern, Krone und Edelsteinen
    fill(x-5,b+35,z-3,x+5,b+35,z+4,GD); for(let k=0;k<5;k++) fill(x-4+k,b+36+k,z-2+Math.floor(k/2),x+4-k,b+36+k,z+3-Math.floor(k/2),"iron");
    for(const a of [-4,-2,0,2,4]){ set(x+a,b+36,z+5,a===0?"emerald":"gold"); set(x+a,b+37,z+5,a%4===0?"gold":null); }
    for(const s2 of [-1,1]){ line(x+s2*5,b+36,z,x+s2*9,b+40,z+1,"statue"); line(x+s2*9,b+40,z+1,x+s2*10,b+45,z+2,"chisel"); }
    return b+47; };
  const kingTop = king(-24, L2, 17);
  // Vorplatz mit Feuerschalen und Mosaik
  for(let a=-10;a<=10;a++) for(let c=0;c<14;c++){ const xx=-24+a, zz=27+c; if(get(xx,L1-1,zz)!=="flag") continue; set(xx,L1-1,zz,(Math.abs(a)+c)%5===0?"tileB":(Math.abs(a)===10?"gold":"flag")); }
  for(const a of [-9,9]){ fill(-24+a,L1,30,-24+a,L1+2,30,"chisel"); fill(-24+a-1,L1+3,29,-24+a+1,L1+3,31,"iron"); set(-24+a,L1+4,30,"lava"); }

  // Häuser in der linken Erweiterung
  towerHouse(-10,L0,60,3,9); tavern(-36,L0,58,7,4); stepHouse(-8,L1,34,7); workshop(-38,L1,34,9,6);
  // Brücke über eine Lavaspalte (links unten)
  { for(let z=46;z<D;z++) for(let x=-34;x<=-28;x++){ for(let y=1;y<L0;y++) set(x,y,z,null); set(x,0,z,"lava"); }
    for(let x=-36;x<=-26;x++){ fill(x,L0-1,70,x,L0-1,72,"planks"); set(x,L0,70,(x%2)?"log":null); set(x,L0,72,(x%2)?"log":null); }
    for(const z of [48,60,84,94]) set(-31,1,z,"glow"); }

  // ---------- Rechts: große Königshalle (Bergkönigs-Halle) mit Schmiede-Esse und Glockenturm ----------
  { const x=W+24, z=16, y=L2;
    fill(x-15,y,z-6,x+15,y+16,z+6,(a,b,c)=> (b-y)%5===4 ? "chisel" : "sbrick");
    // Säulenportikus vorne
    fill(x-14,y,z+7,x+14,y,z+11,"flag"); for(let a=-12;a<=12;a+=4){ fill(x+a,y+1,z+10,x+a,y+14,z+10,(xx,yy)=> (yy-y)%4===0 ? "gold" : "statue"); fill(x+a-1,y+15,z+9,x+a+1,y+15,z+11,"chisel"); }
    fill(x-15,y+16,z+7,x+15,y+17,z+11,"chisel"); for(let a=-15;a<=15;a++) set(x+a,y+17,z+12,(a%3)?"rune":"gold");
    // Giebel
    for(let k=0;k<10;k++) fill(x-15+k*1.5|0,y+18+k,z-7,x+15-(k*1.5|0),y+18+k,z+12, k===9?"gold":(k%2?"roofD":"tileR"));
    for(let a=-6;a<=6;a++) for(let b=0;b<6;b++) if(Math.abs(a)<=6-b) set(x+a,y+19+b,z+13,(a===0&&b===2)?"sapphire":"chisel");
    // großes Tor mit warmem Licht
    for(let a=-3;a<=3;a++) for(let b=0;b<10;b++){ if(b<7||Math.hypot(a,b-7)<3.3){ set(x+a,y+b,z+6,"door"); } }
    for(const a of [-9,9]) for(let b=3;b<12;b+=4){ set(x+a,y+b,z+6,"win"); set(x+a,y+b+1,z+6,"win"); }
    // Esse mit rauchendem Schlot
    fill(x+12,y+17,z-4,x+15,y+34,z-1,"sbrickD"); fill(x+12,y+35,z-4,x+15,y+35,z-1,"magma"); chim.push([x+13.5,y+36,z-2.5]);
    // Glockenturm links
    for(let yy=y+17;yy<y+36;yy++) for(let a=-2;a<=2;a++) for(let c=-2;c<=2;c++){ if(Math.abs(a)!==2&&Math.abs(c)!==2) continue; set(x-12+a,yy,z+c, (yy-y)%6===0?"chisel":((yy-y)%6===3&&(a===0||c===0)?"win":"sbrick")); }
    fill(x-12,y+33,z,x-12,y+34,z,"gold"); for(let k=0;k<6;k++) fill(x-14+k*.4|0,y+36+k,z-2+(k*.4|0),x-10-(k*.4|0),y+36+k,z+2-(k*.4|0),"copper"); set(x-12,y+42,z,"gold");
    // Fahnen
    for(const a of [-6,6]){ fill(x+a,y+18,z+13,x+a,y+24,z+13,"log"); fill(x+a+1,y+21,z+13,x+a+3,y+24,z+13,a<0?"banR":"banB"); }
    S.hallTop=[x,y+28,z]; }
  // Häuser und Markt in der rechten Erweiterung
  domeHouse(W+10,L1,34,3); towerHouse(W+38,L1,32,3,10); stepHouse(W+12,L0,60,9); tavern(W+34,L0,62,7,4);
  // Mine-Lore auf Schienen am Rand
  for(let z=46;z<D-2;z++){ set(W+42,L0-1,z,"iron"); if(z%2) set(W+41,L0-1,z,"planks"); }
  fill(W+41,L0,70,W+43,L0+1,72,"iron"); set(W+42,L0+2,71,"goldOre"); set(W+42,L0+2,70,"emerald");
  // Laternen auf den Erweiterungsterrassen
  for(const [x0,x1] of [[XL0+3,-3],[W+3,XR1-3]]) for(let x=x0;x<=x1;x+=7) for(const z of [45,27]){ const L=z===45?L0:L1; if(!get(x,L,z)){ set(x,L,z,"iron"); set(x,L+1,z,"lamp"); } }
  // ---------- Unterstadt vorne: eine Ebene tiefer, Straße mit Häusern, die Stadt geht weiter ----------
  const LM = L0-8, Z0 = D, Z1 = D+34;
  for(let z=Z0; z<=Z1; z++) for(let x=-2; x<=W+2; x++){ const side = Math.max(0, Math.max(4-x, x-(W-5)));
    const h = side>0 ? LM + 10 + side*3 + Math.round(fbm(x*.2,z*.2)*4) : LM;
    for(let y=LM-4; y<h; y++) set(x,y,z, y===h-1 && side===0 ? "flag" : (rand()<.25?"deep":"stone")); }
  // Stützmauer mit Bögen und große Treppe hinunter
  for(let x=0;x<=W;x++) for(let y=LM;y<L0;y++) set(x,y,Z0,(y===L0-1)?"chisel":"sbrick");
  for(const ax of [8,18,28,60,70,80]) archZ(ax,LM,Z0,3,4);
  for(let i=0;i<8;i++) fill(38,L0-1-i,Z0+i,50,L0-1-i,Z0+i,"flag"), fill(38,LM-1,Z0+i,50,L0-2-i,Z0+i,"sbrick");
  for(const xx of [37,51]) for(let i=0;i<8;i++) set(xx,L0-i,Z0+i,"chisel");
  // Häuserzeilen links und rechts der Straße (Vorderseite zur Kamera)
  stepHouse(12,LM,Z0+12,9); towerHouse(24,LM,Z0+16,3,10); tavern(14,LM,Z0+28,7,4); workshop(66,LM,Z0+12,9,6); domeHouse(79,LM,Z0+16,3); towerHouse(70,LM,Z0+29,2,7);
  // Brunnen auf dem Platz, Laternen entlang der Straße
  // ---------- Der Edelsteinbaum: von Zwergen geschmiedet, Stamm aus gedrehtem Gold und Eisen, Blätter aus Edelsteinen ----------
  const gemTree = (cx,y0,cz) => {
    // Sockel: runde Stufen mit Runen und Goldband
    for(let k=0;k<3;k++){ disk(cx,y0+k,cz,6.5-k*1.6,k===2?"goldT":"chisel"); ring(cx,y0+k,cz,6.5-k*1.6,k===1?"rune":"sbrickD"); }
    const base = y0+3;
    // Wurzeln aus Gold, die sich über den Sockel krallen (fein)
    for(let i=0;i<7;i++){ const an=i/7*Math.PI*2+.2; let px=cx, pz=cz, py=base+.5; for(let k=0;k<12;k++){ px+=Math.cos(an)*.45; pz+=Math.sin(an)*.45; py-= k<5 ? 0 : .28; fh2(px,py,pz, k%3===0?"iron":"goldT"); fh2(px,py+.5,pz,"goldT"); } }
    // Stamm: zwei verdrehte Stränge (Gold + Eisen), oben verzweigt
    for(let h=0; h<9; h+=.5){ const a=h*.6, r=1.6-h*.08; for(let k=0;k<6;k++){ const off=k/6*Math.PI*2; fh2(cx+Math.cos(a+off)*r, base+h, cz+Math.sin(a+off)*r, k%3===1 ? "iron" : "goldT"); fh2(cx+Math.cos(a+off)*r*.5, base+h, cz+Math.sin(a+off)*r*.5, "goldT"); } fh2(cx,base+h,cz,"goldT"); if(h===4) fh2(cx+Math.cos(a)*1.9, base+h, cz+Math.sin(a)*1.9, "gemR"); }
    // Äste rekursiv, an den Spitzen Edelstein-Blätterbüschel
    const gems = ["gemA","gemE","gemS","gemR"]; const tips = [];
    const branch = (x,y,z,yaw,pitch,len,depth) => { const n=Math.ceil(len*2); let px=x,py=y,pz=z;
      for(let i=0;i<n;i++){ px+=Math.cos(yaw)*Math.cos(pitch)*.5; pz+=Math.sin(yaw)*Math.cos(pitch)*.5; py+=Math.sin(pitch)*.5; fh2(px,py,pz, depth>1 ? "goldT" : "iron"); if(depth>1 && i%2===0) fh2(px,py+.5,pz,"goldT"); }
      if(depth===0){ tips.push([px,py,pz,cur]); return; }
      const k = depth>1 ? 3 : 2; for(let j=0;j<k;j++) branch(px,py,pz, yaw+(j-(k-1)/2)*1.1+(rand()-.5)*.5, Math.max(.05, pitch-.15+(rand()-.3)*.4), len*.68, depth-1); };
    let cur = "gemE";
    for(let i=0;i<5;i++){ cur = ["gemE","gemA","gemS","gemR","gemA"][i]; branch(cx, base+7+i*.4, cz, i/5*Math.PI*2+.4, .5, 3.4, 3); }
    cur = "gemE"; branch(cx, base+9, cz, 0, 1.4, 2.2, 2);
    // Blätter: kleine Edelstein-Kristalle (je Büschel eine Farbe), dazwischen Funken
    tips.forEach(([tx,ty,tz,g],i)=>{ for(let a=-1;a<=1;a+=.5) for(let b=-.5;b<=1;b+=.5) for(let c=-1;c<=1;c+=.5){ const d=Math.hypot(a,b*1.3,c); if(d<=1.05 && rand()<.82) fh2(tx+a,ty+b+.4,tz+c, d>.8 && rand()<.06 ? "spark" : g); }
      if(i%3===0) fh2(tx,ty+1.2,tz,"spark");
      if(i%2===0){ for(let k=1;k<=Math.floor(2+rand()*3);k++) fh2(tx+.5,ty-k*.5,tz,"chain"); fh2(tx+.5,ty-2.5-rand(),tz,g); } });   // hängende Edelstein-Anhänger
    // Laternen-Ring um den Baum
    if(false) for(let i=0;i<6;i++){ const an=i/6*Math.PI*2+.5; const lx=Math.round(cx+Math.cos(an)*7.5), lz=Math.round(cz+Math.sin(an)*7.5); fill(lx,y0,lz,lx,y0+2,lz,"iron"); set(lx,y0+3,lz,"lamp"); }
    return [cx, base+20, cz]; };
  { const fx=44, fz=Z0+18; ring(fx,LM,fz,3.2,"chisel"); disk(fx,LM,fz,2.2,"lava"); fill(fx,LM,fz,fx,LM+3,fz,"sbrick"); set(fx,LM+4,fz,"lamp"); }
  for(let z=Z0+9; z<=Z1; z+=6) for(const lx of [35,53]){ fill(lx,LM,z,lx,LM+3,z,"log"); set(lx,LM+4,z,"glow"); }
  // Kleinkram: Felsbrocken, Pilze, Kisten, Laternenpfähle auf dem Vorplatz
  const busy = (x,z) => Math.abs(x-44)<9 || (Math.hypot(x-S.country.x,z-S.country.z)<15) || (x<26 && z<44 && z>24) || Math.abs(x-12)<4 || (x>58 && x<65) || (x<30 && z<24);
  for(let i=0;i<22;i++){ const x=7+Math.floor(rand()*(W-14)), z=11+Math.floor(rand()*(D-12)); if(busy(x,z)) continue; const t=topAt(x,z,40)+1; if(t>L2+1 || get(x,t,z)) continue;
    const r=rand(); if(r<.3){ ellip(x,t,z,1+rand(),1,1+rand(),"stone"); } else if(r<.5) set(x,t,z,"shroom"); else if(r<.65){ fill(x,t,z,x,t+3,z,"log"); set(x,t+4,z,"glow"); } else if(r<.75) cluster(x,t,z,pick(["amethyst","sapphire"]),2); else set(x,t,z,"planks"); }

  // ---------- Decke mit Tropfsteinen und Lichtöffnung über dem Tempel ----------
  const F = A.far; F.cell = 3;
  for(let z=-2; z<OPEN+2; z++) for(let x=-2; x<W+2; x++){ if(Math.hypot(x-44,z-18)<6.5) continue;
    const yy = TOP + Math.round(fbm(x*.09,z*.09)*3); fill(x,yy,z,x,yy+2,z,"stone");
    if(z>4 && rand()<.035){ const len=2+Math.floor(rand()*6); for(let k=1;k<=len;k++){ set(x,yy-k,z,"stone"); if(k<len-2 && len>4){ set(x+1,yy-k,z,"stone"); } } } }
  // ---------- Weitere Höhlen links und rechts bis in die Ferne: Terrassen, beleuchtete Häuser ----------
  const away = x => Math.max(0,-x, x-W);
  const fh = (x,z) => { const a=away(x); let h = level(Math.max(z,10)) + Math.floor(a/22)*6 + fbm(x*.05,z*.05)*3; if(a>90) h += (a-90)*1.6; if(z<10) h = 80; return Math.min(h,80); };
  A.farTerrain({ x0:-170, x1:W+170, z0:-12, z1:D+50, base:0, skip:(x,z)=> x>XL0-1 && x<XR1+1,
    h: fh, top:(x,z,y,hc)=> y*3 > 60 ? "stone" : (rand()<.04 ? "glow" : "flag"),
    fill:(x,z,y,hc)=> (y%2===1 && y*3<26 && rand()<.14) ? "win" : (rand()<.25 ? "deep" : "sbrick") });
  // große Höhlendecke über der ganzen erweiterten Halle, mit Tropfsteinen
  for(let cz=-4; cz<Math.ceil((OPEN+40)/3); cz++) for(let cx=Math.floor(-170/3); cx<Math.ceil((W+170)/3); cx++){ const x=cx*3, z=cz*3; if(x>XL0-3 && x<XR1+3 && z<4) continue;
    const cy = Math.round((TOP+34+fbm(x*.02,z*.02)*10 + Math.max(0,z-OPEN)*.3)/3); F.set(cx,cy,cz,"stone"); F.set(cx,cy+1,cz,"deep");
    if(rand()<.05){ const l=1+Math.floor(rand()*4); for(let k=1;k<=l;k++) F.set(cx,cy-k,cz,"deep"); } }
  // Laternen und Lichter in den Seitenhöhlen
  for(let i=0;i<80;i++){ const x = rand()<.5 ? -10-rand()*140 : W+10+rand()*140, z = 12+rand()*(D+20); const h=fh(x,z); if(h>60) continue; F.set(Math.floor(x/3),Math.ceil(h/3),Math.floor(z/3),"glow"); }
  for(let i=0;i<40;i++){ const x = rand()<.5 ? -20-rand()*120 : W+20+rand()*120, z = OPEN+rand()*(D-OPEN+40); const cx=Math.floor(x/3), cz=Math.floor(z/3), base=Math.ceil(fh(x,z)/3);
    const hh = 2+Math.floor(rand()*5); for(let k=0;k<hh;k++) F.set(cx,base+k,cz,"stone"); }

  // ================= Mehr Details =================
  const FN = A.fine, fs = (x,y,z,t) => FN.set(Math.round(x*2),Math.round(y*2),Math.round(z*2),t);
  const freeAbove = (x,y,z) => !get(x,y,z) && !get(x,y+1,z);
  // 1) Bodenmosaike auf den Plätzen (Rauten in Rot/Blau/Gold)
  for(const [cx,cz,L,r] of [[44,59,L0,8],[44,38,L1,5],[44,Z0+18,LM,7]]) for(let x=cx-r-2;x<=cx+r+2;x++) for(let z=cz-r;z<=cz+r;z++){
    if(get(x,L-1,z)!=="flag" || !freeAbove(x,L,z)) continue; const d=Math.abs(x-cx)+Math.abs(z-cz);
    if(d<=r) set(x,L-1,z, d===r ? "gold" : d===r-1 ? "chisel" : (d%3===0 ? "tileR" : d%3===1 ? "tileB" : "flag")); }
  const treeTop = gemTree(44, L0, 60);
  // 2) roter Teppich von der Treppe zum Tempeltor
  for(let z=12; z<=25; z++) for(let x=41;x<=47;x++){ if(get(x,L2-1,z) && freeAbove(x,L2,z)) set(x,L2-1,z, (x===41||x===47) ? "gold" : "carpet"); }
  // 3) Lavarinne vor der Terrassenmauer der Unterstadt, mit Brücken an den Treppen
  for(let x=7;x<W-7;x++){ const z=46; if(x>=36&&x<=52) continue; if(get(x,L0-1,z)==="flag" && freeAbove(x,L0,z) && freeAbove(x,L0,z+1)){ set(x,L0-1,z,"lava"); set(x,L0-1,z+1,"chisel"); set(x,L0-2,z,"chisel"); } }
  for(const bx of [12,61]) for(let x=bx-1;x<=bx+2;x++){ fs(x,L0+.25,46,"planks"); fs(x+.5,L0+.25,46,"planks"); }
  // 4) Lavafälle aus der Rückwand in Becken
  for(const fx of [9,79]){ for(let y=L2; y<46; y++){ set(fx,y,10,"lavaFall"); set(fx+1,y,10,"lavaFall"); } fill(fx-2,L2-1,10,fx+3,L2-1,13,"chisel"); fill(fx-1,L2-1,10,fx+2,L2-1,12,"lava");
    for(let y=44;y<50;y++) set(fx,y,9,null), set(fx+1,y,9,null); fill(fx-1,46,10,fx+2,46,10,"chisel"); }
  // 5) Mächtige Säulen von der Mittelterrasse bis zur Decke, mit Ringen, Runen und Feuerschalen
  for(const [px,pz] of [[33,31],[55,31]]){ for(let y=L1; y<TOP; y++){ const band=(y-L1)%8; disk(px,y,pz, band===0||band===7 ? 2.6 : 2, band===0||band===7 ? "chisel" : band===4 ? "rune" : (y%2?"sbrickD":"sbrick")); }
    for(const y of [L1+8, L1+24]){ ring(px,y,pz,3.3,"iron"); for(const [a,b] of [[3,0],[-3,0],[0,3],[0,-3]]) set(px+a,y+1,pz+b,"lamp"); }
    for(let k=0;k<5;k++) disk(px,TOP-1-k,pz,2.4+k*.9,"stone"); }
  // Obelisken auf dem unteren Platz
  for(const ox of [28,60]){ fill(ox-1,L0,48,ox+1,L0,50,"chisel"); for(let y=L0+1;y<L0+12;y++){ const w = y<L0+9 ? 1 : 0; fill(ox-w,y,49-w,ox+w,y,49+w, y%3===0 ? "gold" : "sbrickD"); } set(ox,L0+12,49,"gold"); fill(ox-1,L0+13,48,ox+1,L0+13,50,"iron"); set(ox,L0+14,49,"lamp"); }
  // 6) Banner an den Terrassenmauern (feine Blöcke, hängen vor der Wand)
  for(const [wz,yTop,yBot] of [[43.75+0.5,L1-1,L0+2],[25.75+0.5,L2-1,L1+2]]) for(let bx=10; bx<W-10; bx+=9){ if(Math.abs(bx-44)<8) continue; const t = (bx/9|0)%2 ? "banR" : "banB";
    for(let y=yBot; y<=yTop; y+=.5) for(let k=0;k<4;k++) fs(bx+k*.5, y, wz, y===yBot ? "gold" : t); fs(bx-.5,yTop+.5,wz,"iron"); for(let k=0;k<5;k++) fs(bx-.5+k*.5,yTop+.5,wz,"iron"); }
  // 7) Runen, Gold- und Diamantadern in den Seitenwänden
  for(let i=0;i<260;i++){ const side = rand()<.5, x = side ? 4 : W-5, z = 2+Math.floor(rand()*(OPEN-2)), y = L2+Math.floor(rand()*(TOP-L2-2));
    if(get(x,y,z) && !get(x+(side?1:-1),y,z)) set(x,y,z, pick(["goldOre","goldOre","diaOre","rune","sbrickD","sbrickD"])); }
  // 8) Tropfsteine mit leuchtenden Kristallspitzen, Kristallpilze an Wänden
  for(let i=0;i<40;i++){ const x=8+Math.floor(rand()*(W-16)), z=4+Math.floor(rand()*(OPEN-6)); if(Math.hypot(x-44,z-18)<9) continue; const top=TOP+Math.round(fbm(x*.09,z*.09)*3)-1, len=3+Math.floor(rand()*7);
    for(let k=0;k<len;k++) set(x,top-k,z, "deep"); }
  for(let i=0;i<60;i++){ const x=6+Math.floor(rand()*(W-12)), z=11+Math.floor(rand()*(D-12)); const t=topAt(x,z,60); if(t<0||t>L2+1) continue; if(get(x,t+1,z)) continue;
    const near = [[1,0],[-1,0],[0,1],[0,-1]].some(([a,b])=> get(x+a,t+1,z+b) && get(x+a,t+2,z+b)); if(!near) continue;
    set(x,t+1,z,"stem"==="x"?"log":"cyan"); if(rand()<.5) fs(x+.5,t+2.25,z,"cyan"); }
  // 9) Zahnräder und Kran an der Mine
  { const gx=8, gz=26, gy=L1+6; for(let a=-2;a<=2;a+=.5) for(let b=-2;b<=2;b+=.5){ const d=Math.hypot(a,b), an=Math.atan2(b,a); if(d<1.9 || (d<2.4 && Math.sin(an*8)>0)) fs(gx+.25, gy+b, gz+a, d<.5?"iron":"gold"); }
    fill(10,L1,30,10,L1+10,30,"log"); fill(10,L1+10,30,18,L1+10,30,"log"); for(let k=1;k<7;k++) set(18,L1+10-k,30,"chain"); fill(17,L1+2,29,19,L1+3,31,"iron"); set(18,L1+4,30,"goldOre"); }
  // 10) Laternen an den Terrassenkanten
  for(let x=9;x<W-9;x+=6){ if(Math.abs(x-44)<8) continue; for(const [z,L] of [[44,L0],[26,L1]]) if(!get(x,L,z) && get(x,L-1,z)){ set(x,L,z,"iron"); set(x,L+1,z,"lamp"); } }
  // 11) Ziegelbänder: jede 6. Lage der Mauern dunkler
  for(const [, b] of A.near.V){ if(b[3]==="sbrick" && b[1]%6===0) b[3]="sbrickD"; }

  // Zwerge: einige laufen über die Plätze, einer schmiedet, andere stehen
  const creatures = [];
  // Fledermausschwärme fliegen ab und zu quer durch die Höhle
  for(const [pa,pb,P,ph0] of [[[-14,34,30],[102,30,22],27,0],[[102,40,16],[-14,36,36],33,14]]) for(let i=0;i<9;i++){
    const o = [(i%3-1)*3 + (i*1.7)%2, ((i*5)%3-1)*2, (Math.floor(i/3)-1)*3];
    creatures.push({ ...bat(), pass:{a:[pa[0]+o[0]-i*.8,pa[1]+o[1],pa[2]+o[2]], b:[pb[0]+o[0]-i*.8,pb[1]+o[1],pb[2]+o[2]], period:P, dur:8.5, ph:ph0+i*.12, wave:[1.6,2+i%3], wph:i}, scale:.3 }); }
  const tun = [0x2F5DA8,0xA83A2A,0x3A8A4A,0x7A4AA8,0x8A6A2A], brd = [0xC86A2A,0xE8E2D8,0x6A4A2A,0xD8B060,0x2A2A2A];
  // Dämon: landet alle 3 Minuten auf dem First der Königshalle, speit Feuer nach unten und fliegt wieder fort
  { const hx=W+24, hz=16, top=L2+28; const P=[hx, top, hz+2.5];
    creatures.push({ ...redDemon(), visit:{period:180, off:120, arrive:7, stay:11, leave:6, fireAt:3, fireDur:5, yaw:-Math.PI/2+.35, pos:P,
      from:[hx+70, top+60, hz-60], c1:[hx+40, top+40, hz-10], c2:[hx+8, top+14, hz+18], c3:[hx-6, top+12, hz+10], c4:[hx-30, top+40, hz-20], to:[hx-60, top+70, hz-70]},
      scale:.3, fire:{part:1, at:[10,1,0], dir:[1,.15,0], n:160, rate:130, speed:26, life:1.3, size:1.6, light:900} }); }
  creatures.push({ ...dwarf({tunic:0x6A3A2A, beard:0xE8E2D8, hammer:true}), at:[S.country.x-4, L0, S.country.z-1], yaw:0, scale:.5 });
  for(let i=0;i<5;i++) creatures.push({ ...dwarf({tunic:tun[i], beard:brd[i], walk:true}), orbit:{c:[44, L0, 60], r:[9.5+(i%2)*.8, 6+(i%2)*.5], speed:.07+(i%3)*.012, ph:i*1.25, bob:.1, dir:i%2?1:-1}, scale:.42 });
  for(let i=0;i<3;i++) creatures.push({ ...dwarf({tunic:tun[(i+2)%5], beard:brd[(i+1)%5], walk:true}), orbit:{c:[30+i*14, L1, 36], r:[6, 2], speed:.2, ph:i*2, bob:.1, dir:i%2?1:-1}, scale:.42 });
  for(const [dx,dz,yaw,i] of [[38,18,1.6,0],[52,20,1.3,1],[9,48,.3,2],[80,40,2.6,3]]) creatures.push({ ...dwarf({tunic:tun[i], beard:brd[(i+2)%5]}), at:[dx, level(dz)>=TOP?L2:level(dz), dz], yaw, scale:.42 });

  return {
    W, D, blocks, spots:S, exposure:1.2, fov:40, creatures,
    sky:[[0,"#030204"],[.5,"#0E0A0C"],[1,"#22160E"]], fog:[0x1E140E, 70, 260],
    hemi:[0xC8B8A8, 0x2A1A0E, 1.15], sun:{color:0xFFE0B8, int:1.1, pos:[20,90,60]}, bloom:[.45,.4,.86],
    lights:[{pos:[44,L2+8,16], color:0xFFB84A, int:700, dist:46},
            {pos:[S.country.x,L0+4,S.country.z-2], color:0xFF7A2A, int:340, dist:30, flicker:true},
            {pos:[S.vocabulary.x,L1+5,S.vocabulary.z], color:0xB88AFF, int:260, dist:26},
            {pos:[44,L0+8,52], color:0xFFC870, int:300, dist:40},
            {pos:[44,L0+16,60], color:0xC8A8FF, int:260, dist:30}, {pos:[44,L0+10,64], color:0x6AF0C0, int:160, dist:22},
            {pos:[10,L2+6,12], color:0xFF7A2A, int:220, dist:26, flicker:true}, {pos:[80,L2+6,12], color:0xFF7A2A, int:220, dist:26, flicker:true},
            {pos:[33,L1+10,34], color:0xFFB050, int:140, dist:20}, {pos:[55,L1+10,34], color:0xFFB050, int:140, dist:20}],
    rays:{n:10, color:0xFFE6B8, area:[38,50,12,26], y:40, len:70},
    particles:[{n:140, area:[44-6,44+6,L0+5,L0+16,60-6,60+6], vy:.25, wob:.4, color:0xFFFFFF, size:.22, add:true, blink:2.2},
               {n:420, area:[0,W,3,TOP,0,D], vy:0, wob:.25, color:0xFFE6A8, size:.16, opacity:.8, add:true, twinkle:true},
               {n:200, area:[S.country.x-3,S.country.x+3,L0+8,L0+32,S.country.z-8,S.country.z-4], vy:3, wob:.5, color:0xFF9A3A, size:.25, add:true}],
    puffs:[{n:8, pos:[S.country.x,L0+31,S.country.z-6], dx:2, dy:14, dz:2, s0:3, s1:8, color:0x4A4040, opacity:.4, speed:.05},
           ...chim.map(c=>({n:3, pos:c, dx:1, dy:7, dz:-1, s0:1, s1:3.5, color:0x4A4440, opacity:.35, speed:.07, spread:.5})),
           ...[9,79].map(fx=>({n:5, pos:[fx+1,L2,11.5], dx:0, dy:12, dz:2, s0:2, s1:6, color:0xFF8A4A, opacity:.18, speed:.08, spread:1.5, add:true}))],
    zoomAmt:.18, zoomShift:[46,18,-16],
    home:{pos:[W/2,62,D+84], look:[W/2,12,D/2+2]}, homePortrait:{pos:[W/2,74,D+130], look:[W/2,14,D/2]},
    ui:{bg:"rgba(26,20,30,.9)", border:"#C9A6FF", glow:"rgba(184,138,255,.5)", text:"#F4EEFF", sub:"#C8BCD8", accent:"#FFC24A", "accent-ink":"#24180A", chip:"rgba(20,14,24,.82)"}
  };
}
