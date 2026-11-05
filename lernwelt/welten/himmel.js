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
    glowB: tex(g=>{ for(let y=0;y<16;y++) for(let x=0;x<16;x++){ const d=Math.hypot(x-7.5,(y-4)*.7); P(g,x,y, d<3?"#E8F6FF":d<6?"#9CD0FF":"#6AA6F0"); } }),
    marble: tex(g=>{ for(let y=0;y<16;y++) for(let x=0;x<16;x++){ const r=Math.floor(y/4), off=(r%2)*4, seam=(y%4===3)||(((x+off)%8)===7); P(g,x,y, seam?"#B9C0CC":(rand()<.15?"#F3F6FA":"#E4E9F0")); } }),
    pcol: tex(g=>{ for(let y=0;y<16;y++) for(let x=0;x<16;x++){ const c=x%8; P(g,x,y, c<2?"#FFF8E6":(c<6?"#EBD9B0":"#B99B66")); } }),
    ptrim: tex(g=>{ for(let y=0;y<16;y++) for(let x=0;x<16;x++) P(g,x,y, y<2?"#F6E3B0":(y>12?"#8E6F42":"#C9A765")); }),
    twood: tex(g=>{ for(let y=0;y<16;y++) for(let x=0;x<16;x++){ const c=x%5; P(g,x,y, c===4?"#8A6A3E":(rand()<.12?"#E0BC86":(y%8===7?"#A27C48":["#C9A068","#D2AB74","#BE9760","#C9A068"][c]))); } }),
    tstone: tex(g=>{ for(let y=0;y<16;y++) for(let x=0;x<16;x++){ const r=Math.floor(y/4), off=(r%2)*4, seam=(y%4===3)||(((x+off)%8)===7); P(g,x,y, seam?"#5F6C86":(rand()<.2?"#A9B5CC":(rand()<.5?"#8C9AB8":"#7D8CA8"))); } }),
    tstoneD: tex(g=>{ for(let y=0;y<16;y++) for(let x=0;x<16;x++){ const band=Math.floor((x+y*.6)/5)%3; P(g,x,y, rand()<.1?"#4E5869":["#6F7C92","#8A96AB","#5F6B80"][band]); } }),
    pbase: tex(g=>{ for(let y=0;y<16;y++) for(let x=0;x<16;x++) P(g,x,y,(Math.floor(y/4)+Math.floor(x/8))%2?"#9AA3B5":"#AEB7C8"); }),
    cliff: tex(g=>{ for(let y=0;y<16;y++){ const band=["#C79F78","#B88A62","#D2AE88","#A9794E","#BF9468"][Math.floor(y/3)%5]; for(let x=0;x<16;x++) P(g,x,y, rand()<.14?"#E0C2A0":(rand()<.1?"#8F6644":band)); } }),
    cliffD: tex(g=>{ for(let y=0;y<16;y++){ const band=["#8C6B55","#7B5D49","#94745E","#6E5442"][Math.floor(y/4)%4]; for(let x=0;x<16;x++) P(g,x,y, rand()<.1?"#9A9AA2":(rand()<.08?"#5A4636":band)); } }),
    slate: tex(g=>{ for(let y=0;y<16;y++) for(let x=0;x<16;x++){ const r=Math.floor(y/4), off=(r%2)*4; P(g,x,y, y%4===3?"#262D42":(((x+off)%8)<1?"#2E3750":(((x+off)%8)<4?"#4F5F86":"#3F4D72"))); } }),
    slateT: tex(g=>{ for(let y=0;y<16;y++) for(let x=0;x<16;x++) P(g,x,y,(x+y)%8<4?"#58627C":"#66728E"); }),
    stone: bricks(["#F2EFE6","#E8E4D8","#F8F6F0","#ECE8DE"], "#C8C2B2", 4, 8), stoneB: bricks(["#DCD6C6","#D0CAB8","#E4DED0"], "#A8A08C", 4, 8),
    trim: tex(g=>{ for(let y=0;y<16;y++) for(let x=0;x<16;x++) P(g,x,y, y<2||y>13 ? "#C8C0A8" : (x%4===0 ? "#E8E2D2" : "#FBF9F2")); }),
    pillar: stripes(["#F4F2EC","#E6E4DA","#FAF8F2"], true),
    roof: tex(g=>{ for(let y=0;y<16;y++) for(let x=0;x<16;x++){ const r=Math.floor(y/4), off=(r%2)*4; P(g,x,y, y%4===3?"#1A428E":(((x+off)%8)<1?"#1E4FA8":(((x+off)%8)<4?"#3A78E0":"#2E66CC"))); } }),
    roofT: tex(g=>{ for(let y=0;y<16;y++) for(let x=0;x<16;x++) P(g,x,y, (x+y)%8<4 ? "#2A62C8" : "#3672D8"); }),
    gold: noise(["#F5C542","#FFE27A","#E8B030","#FFD95A"]),
    win: tex(g=>{ for(let x=0;x<16;x++) for(let y=0;y<16;y++){ const arch = y<5 && Math.abs(x-7.5) > Math.sqrt(Math.max(0,25-(5-y)**2))+1.5; const fr = x<2||x>13||y>14||x===7||x===8||y===9||arch; P(g,x,y, fr ? "#C8C0A8" : (y<9 ? pick(["#FFE9A0","#FFDC80"]) : pick(["#9AD0F8","#7ABCEC"]))); } }),
    door: tex(g=>{ for(let x=0;x<16;x++) for(let y=0;y<16;y++){ P(g,x,y, x%5===0 ? "#4A2E14" : (y%6===0 ? "#3A2410" : pick(["#7A4E28","#6E4424"]))); } }),
    // Wasser: nahtlose, weich gefilterte Texturen (64×64) mit Strömungsstreifen, Schaum und Glitzern – wirken beim Scrollen wie fließendes Wasser
    water: tex(g=>{ const N=64, id=g.createImageData(N,N), d=id.data, TP=Math.PI*2, stops=[[0,[52,140,222]],[.32,[98,186,246]],[.58,[176,228,255]],[.82,[236,250,255]],[1,[255,255,255]]];
      const ramp = s2 => { for(let k=1;k<stops.length;k++) if(s2<=stops[k][0]){ const a=stops[k-1], b=stops[k], f=(s2-a[0])/(b[0]-a[0]); return a[1].map((v,q)=>v+(b[1][q]-v)*f); } return [255,255,255]; };
      for(let y=0;y<N;y++) for(let x=0;x<N;x++){ const u=x/N*TP, v=y/N*TP;
        const a=Math.sin(u*3+1.6*Math.sin(v*2)), b=Math.sin(u*7-2+1.1*Math.sin(v*3+1)), c=Math.sin(u*13+.8*Math.sin(v*5+2)), f=Math.sin(v*4+u*2+Math.sin(u*3)*1.4);
        let s2=.5+.2*a+.14*b+.08*c+Math.max(0,f-.5)*.9*(.5+.5*b); s2=Math.max(0,Math.min(1,s2)); const col=ramp(s2), o=(y*N+x)*4;
        d[o]=col[0]; d[o+1]=col[1]; d[o+2]=col[2]; d[o+3]=Math.round(120+135*Math.pow(s2,.8)); }
      g.putImageData(id,0,0); }, 64, true),
    cascade: tex(g=>{ const N=64, id=g.createImageData(N,N), d=id.data, TP=Math.PI*2, stops=[[0,[22,86,186]],[.35,[44,128,222]],[.65,[96,176,246]],[.88,[168,218,255]],[1,[246,252,255]]];
      const ramp = s2 => { for(let k=1;k<stops.length;k++) if(s2<=stops[k][0]){ const a=stops[k-1], b=stops[k], f=(s2-a[0])/(b[0]-a[0]); return a[1].map((v,q)=>v+(b[1][q]-v)*f); } return [246,252,255]; };
      for(let y=0;y<N;y++) for(let x=0;x<N;x++){ const u=x/N*TP, v=y/N*TP;
        const a=Math.sin(u*5+1.2*Math.sin(v*2)), b=Math.sin(u*11+2*Math.sin(v*3+1)), c=Math.sin(u*23+Math.sin(v*5+2)), r=Math.sin(u*7+v*3+Math.sin(u*2)*1.5);
        const foam=Math.pow(Math.max(0,Math.sin(u*9+Math.sin(v*4)*1.4)),7)*.9 + Math.pow(Math.max(0,r),9)*.5;
        let s2=.42+.2*a+.14*b+.07*c+foam*.55; s2=Math.max(0,Math.min(1,s2)); const col=ramp(s2), o=(y*N+x)*4;
        d[o]=col[0]; d[o+1]=col[1]; d[o+2]=col[2]; d[o+3]=Math.round(165+90*Math.pow(s2,.7)); }
      g.putImageData(id,0,0); }, 64, true),
    spray: noise(["#E2F2FF","#CFE7FF","#BEDCFF","#F0F8FF"]),
    pool: tex(g=>{ const N=64, id=g.createImageData(N,N), d=id.data, TP=Math.PI*2;
      for(let y=0;y<N;y++) for(let x=0;x<N;x++){ const u=x/N*TP, v=y/N*TP;
        const hgt=.35*Math.sin(2*u+v+1.3*Math.sin(3*v))+.3*Math.sin(3*u-2*v+Math.sin(2*u))+.2*Math.sin(4*u+3*v+2)+.15*Math.sin(5*v-3*u);
        const l1=1-Math.abs(Math.sin(u*2+v+.9*Math.sin(2*v+u))), l2=1-Math.abs(Math.sin(v*3-u+.7*Math.sin(3*u)));
        const caus=Math.pow(l1,10)*.8+Math.pow(l2,12)*.55, t=.5+.5*hgt;
        let r=48+40*t, gg=140+50*t, bb=214+26*t; const gl=Math.max(0,hgt-.62)*3.2+caus; r+=gl*170; gg+=gl*100; bb+=gl*40;
        const o=(y*N+x)*4; d[o]=Math.min(255,r); d[o+1]=Math.min(255,gg); d[o+2]=Math.min(255,bb); d[o+3]=235; }
      g.putImageData(id,0,0); }, 64, true),
    cloud: noise(["#FFFFFF","#F4F8FF","#EAF2FF"]), blossom: noise(["#FFB8D8","#FF9AC8","#FFD2E6","#F286B8"], 10, ["#FFFFFF","#FFE6F0"]),
    leavesL: noise(["#6CC24E","#7ACF58","#62B848"],10,["#A8F07A"]), leavesD: noise(["#3A8A2C","#348026","#2E7424"],8,["#58B040"]), needle: noise(["#2F6B4A","#285E40","#357A52","#245438"],10,["#5AA878"]),
    birch: tex(g=>{ for(let y=0;y<16;y++) for(let x=0;x<16;x++) P(g,x,y, rand()<.1?"#2C2C2C":(rand()<.5?"#EFEDE6":"#DCD9CF")); }),
    blossomL: noise(["#FFD2E6","#FFE0EE","#FFC4DC"],8,["#FFFFFF"]), blossomD: noise(["#E878AE","#DE6AA4","#F08CBC"]),
    moss: noise(["#4E7F30","#5A8C36","#46722B","#62973C"],10,["#7FB04A"]), mossSide: topEdge(["#6B5238","#5E4630","#74583C"],["#4E7F30","#5A8C36","#46722B"],5), mossD: noise(["#6B5238","#5E4630","#74583C","#56402B"]),
    wRock: tex(g=>{ for(let y=0;y<16;y++){ const band=["#8C8A84","#7C7A74","#9A988F"][Math.floor(y/3)%3]; for(let x=0;x<16;x++) P(g,x,y, rand()<.1?"#5E7A3E":(rand()<.12?"#AEACA2":band)); } }),
    wRockD: tex(g=>{ for(let y=0;y<16;y++){ const band=["#6A5A4A","#5A4C3E","#76664F","#645444"][Math.floor(y/3)%4]; for(let x=0;x<16;x++) P(g,x,y, rand()<.1?"#4E6A34":band); } }),
    wBark: stripes(["#5A3E2A","#4A3222","#68482F","#523826"],true), wLeaf: noise(["#3F7A32","#376E2C","#468536","#2F6226"],10,["#6AA84A"]), wLeafL: noise(["#5E9A3E","#6AA845","#52903A"],10,["#9AD070"]),
    wVine: noise(["#3E7A30","#2F6226","#4A8A38"]), sandP: noise(["#E8CC82","#DDBF73","#F0D894","#D2B468"]), pinkP: noise(["#E060B8","#F078CC","#CC48A4"]), yellowP: noise(["#F0C838","#FFD84A","#E0B020"]), wPond: noise(["#2A4A5A","#243F4E","#31566A"]),
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
    marble:{side:T.marble}, glowB:{side:T.glowB, em:1.1, alpha:.85, anim:[.05,.03]}, pcol:{side:T.pcol}, ptrim:{side:T.ptrim}, pbase:{side:T.pbase}, twood:{side:T.twood}, tstone:{side:T.tstone}, tstoneD:{side:T.tstoneD}, cliff:{side:T.cliff}, cliffD:{side:T.cliffD}, slate:{side:T.slate}, slateT:{side:T.slateT},
    stone:{side:T.stone}, stoneB:{side:T.stoneB}, trim:{side:T.trim, top:T.stone}, pillar:{side:T.pillar, top:T.stone}, roof:{side:T.roof}, roofT:{side:T.roofT},
    gold:{side:T.gold, em:.25}, win:{side:T.win, em:.55}, door:{side:T.door},
    water:{side:T.water, alpha:.88, anim:[.012,4.2], em:.34}, pool:{side:T.pool, alpha:.9, anim:[.06,.035], em:.24},
    cascade:{side:T.cascade, alpha:.9, anim:[.004,3.6], em:.3}, spray:{side:T.spray, alpha:.5, em:.35, soft:true},
    cloud:{side:T.cloud, alpha:.92, em:.15, soft:true}, cloudS:{side:T.cloud, em:.3, soft:true},
    leavesL:{side:T.leavesL}, leavesD:{side:T.leavesD}, needle:{side:T.needle}, birch:{side:T.birch}, blossomL:{side:T.blossomL}, blossomD:{side:T.blossomD},
    moss:{side:T.mossSide, top:T.moss, bottom:T.mossD}, mossD:{side:T.mossD}, wRock:{side:T.wRock}, wRockD:{side:T.wRockD}, wBark:{side:T.wBark, top:T.wBark}, wLeaf:{side:T.wLeaf}, wLeafL:{side:T.wLeafL}, wVine:{side:T.wVine},
    sandP:{side:T.sandP}, pinkP:{side:T.pinkP, em:.7}, yellowP:{side:T.yellowP, em:.6}, wPond:{side:T.wPond, alpha:.9, anim:[.02,.01], em:.1},
    blossom:{side:T.blossom}, leaves:{side:T.leaves}, hedge:{side:T.hedge}, log:{side:T.log, top:T.logTop}, planks:{side:T.planks}, planksD:{side:T.planksD},
    hull:{side:T.hull}, canvas:{side:T.canvas}, canvasR:{side:T.canvasR}, brass:{side:T.brass, em:.15}, iron:{side:T.iron}, rope:{side:T.rope},
    woolR:{side:T.woolR}, woolB:{side:T.woolB}, woolY:{side:T.woolY},
    flowerR:{side:T.flowerR}, flowerY:{side:T.flowerY}, flowerB:{side:T.flowerB}, flowerP:{side:T.flowerP}, path:{side:T.path},
    crystal:{side:T.crystal, em:1.0}, portal:{side:T.portal, em:.5, alpha:.8, anim:[.12,.07]}, ancient:{side:T.ancient}, rune:{side:T.rune, em:.6}, mist:{side:T.mist, alpha:.45, em:.4, soft:true}, snowP:{side:T.snowP}, lamp:{side:T.lamp, em:1.1, scale:.6, halo:[0xFFE6A8,3.4,.75]}
  };
  const W=92, D=70;

  // ---------- Schwebende Insel: Rasen oben, geschichteter Fels darunter, Wurzeln, Felsspitzen ----------
  const island = (cx,cz,r,yt,o={}) => { const RK=o.rk?o.rk[0]:"rock", RD=o.rk?o.rk[1]:"rockD";
    for(let z=Math.floor(cz-r-4); z<=cz+r+4; z++) for(let x=Math.floor(cx-r-4); x<=cx+r+4; x++){
      const a=Math.atan2(z-cz,x-cx), rr=r*(.86+.24*vn(Math.cos(a)*1.6+cx*.1, Math.sin(a)*1.6+cz*.1)), d=Math.hypot(x-cx,z-cz); if(d>rr) continue;
      const f=1-d/rr, top=yt+(o.flat&&f>.25?0:Math.round(fbm(x*.15+cx,z*.15)*1.2*f)), depth = Math.round(3 + Math.pow(f,1.6)*rr*(o.deep||1.25)*(.7+.6*fbm(x*.25,z*.25)));
      for(let y=top-depth;y<=top;y++) set(x,y,z, y===top?"grass": y>top-3?"dirt": (y<top-depth+3 && rand()<.3 ? RD : (rand()<.04?"crystal":RK)));
      if(f<.25 && rand()<.12){ const l=2+Math.floor(rand()*5); for(let k=1;k<=l;k++) set(x,top-2-k,z,"root"); }   // Wurzeln hängen am Rand
      if(f>.1 && f<.7 && rand()<.02){ const l=3+Math.floor(rand()*6); for(let k=1;k<=l;k++) set(x,top-depth-k,z, k===l?"crystal":RD); } }
    // Grasbüschel und kleine Blumen (fein)
    if(!o.bare) for(let i=0;i<r*r*.5;i++){ const a=rand()*Math.PI*2, d=rand()*r*.9, x=cx+Math.cos(a)*d, z=cz+Math.sin(a)*d, t=topAt(Math.round(x),Math.round(z),yt+4);
      if(t>=yt-1 && get(Math.round(x),t,Math.round(z))==="grass" && !get(Math.round(x),t+1,Math.round(z))) fs(x,t+1,z, rand()<.25 ? pick(["flowerR","flowerY","flowerB","flowerP"]) : "leaves"); } };
  const level = (cx,cz,r,y) => { for(let z=Math.floor(cz-r); z<=cz+r; z++) for(let x=Math.floor(cx-r); x<=cx+r; x++) if(Math.hypot(x-cx,z-cz)<=r){ for(let yy=y+1;yy<y+6;yy++) set(x,yy,z,null); set(x,y,z,"grass"); set(x,y-1,z,"dirt"); } };
  const tree = (x,y,z,h,r,leaf="leaves") => { const bl = leaf==="blossom";
    const L = () => bl ? (rand()<.22?"blossomL":rand()<.14?"blossomD":"blossom") : (rand()<.24?"leavesL":rand()<.18?"leavesD":"leaves");
    const blob = (cx,cy,cz,rx,ry,rz) => ellip(cx,cy,cz,rx,ry,rz,()=>L());
    const hang = (cx,cy,cz,rad,n,len,m) => { for(let i=0;i<n;i++){ const a=rand()*6.283, d=rad*(.5+.5*rand()), vx=Math.round(cx+Math.cos(a)*d), vz=Math.round(cz+Math.sin(a)*d), l=2+Math.floor(rand()*len); for(let k=0;k<l;k++){ if(get(vx,cy-k,vz)) continue; set(vx,cy-k,vz,m); } } };
    const kind = bl ? pick(["cherry","cherry","weep"]) : pick(["oak","oak","birch","pine","willow","acacia","round"]);
    for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]) if(rand()<.55 && !get(x+dx,y,z+dz)) set(x+dx,y,z+dz,"log");
    if(kind==="oak"){ fill(x,y,z,x,y+h,z,"log");
      for(let i=0;i<3;i++){ const a=i*2.1+rand(), ex=x+Math.cos(a)*r*.9, ez=z+Math.sin(a)*r*.9, ey=y+h-1+rand()*2; line(x,y+h-3,z,ex,ey,ez,"log"); blob(ex,ey+1,ez,r*.65,r*.5,r*.65); }
      blob(x,y+h+1,z,r,r*.75,r); }
    else if(kind==="birch"){ fill(x,y,z,x,y+h+2,z,"birch"); set(x+1,y+h-2,z,"birch");
      blob(x,y+h+1,z,r*.7,r*.7,r*.7); blob(x,y+h+3.2,z,r*.5,r*.6,r*.5); blob(x+r*.4,y+h-1,z-r*.3,r*.5,r*.4,r*.5); }
    else if(kind==="pine"){ fill(x,y,z,x,y+h+3,z,"log"); const top=y+h+4, b0=y+2;
      for(let yy=b0;yy<=top;yy++){ const f=(yy-b0)/(top-b0), rad=(1-f)*r*1.25+(yy%2?0:.9); if(rad>.4) disk(x,yy,z,rad,()=>rand()<.2?"leavesD":"needle"); } set(x,top+1,z,"needle"); }
    else if(kind==="willow"){ fill(x,y,z,x,y+h,z,"log"); blob(x,y+h+1,z,r*1.1,r*.6,r*1.1); hang(x,y+h,z,r*1.1,Math.round(r*7),6,"leavesD"); }
    else if(kind==="acacia"){ line(x,y,z,x+1.5,y+h,z+1,"log"); blob(x+2,y+h+1,z+1,r*1.5,r*.35,r*1.5); blob(x+2,y+h+1.7,z+1,r*1.1,r*.3,r*1.1); }
    else if(kind==="round"){ fill(x,y,z,x,y+h-1,z,"log"); blob(x,y+h+r*.5,z,r*1.1,r,r*1.1); }
    else { line(x,y,z,x+1,y+h-1,z,"log"); fill(x+1,y+h-1,z,x+1,y+h,z,"log");
      for(let i=0;i<2;i++){ const a=i*3.14+rand(); line(x+1,y+h-2,z,x+1+Math.cos(a)*3,y+h+1,z+Math.sin(a)*3,"log"); }
      blob(x+1,y+h+1.5,z,r*1.3,r*.6,r*1.3); blob(x+1+r*.9,y+h+.8,z+r*.4,r*.7,r*.45,r*.7); blob(x+1-r*.9,y+h+.8,z-r*.4,r*.7,r*.45,r*.7);
      if(kind==="weep") hang(x+1,y+h,z,r*1.3,Math.round(r*6),5,"blossomL"); } };
  const lampPost = (x,y,z,h=4) => { fill(x,y,z,x,y+h-1,z,"pillar"); fs(x,y+h,z,"gold"); set(x,y+h,z,"lamp"); };

  const GD = {x:14, z:48, r:12, y:18};   // Floating Gardens: nur noch Kulisse
  const S = {
    grammar:   {x:46, z:26, r:20, y:24, col:0x6AA8FF, ort:"Sky Castle"},
    vocabulary:{col:0xFF9AC8, ort:"Sky Library"},
    country:   {x:78, z:50, r:11, y:16, col:0xFFC24A, ort:"Airship Dock"}
  };
  island(S.grammar.x,S.grammar.z,S.grammar.r,S.grammar.y,{deep:1.4}); level(S.grammar.x,S.grammar.z,S.grammar.r-3,S.grammar.y);
  island(GD.x,GD.z,GD.r,GD.y); level(GD.x,GD.z,GD.r-3,GD.y);
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
  { const {x,y,z} = GD;
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
    for(let i=0;i<70;i++){ const a=rand()*Math.PI*2, d=3+rand()*(GD.r-5), px=Math.round(x+Math.cos(a)*d), pz=Math.round(z+Math.sin(a)*d);
      if(get(px,y+1,pz) || get(px,y,pz)==="path" || Math.hypot(px-fx,pz-fz)<4) continue; set(px,y+1,pz,pick(["flowerR","flowerY","flowerB","flowerP"])); }
    // Bänke und Laternen
    for(const [bx,bz] of [[x-6,z+5],[x+8,z]]){ fill(bx,y+1,bz,bx+2,y+1,bz,"planks"); fs(bx+.5,y+.5,bz+.5,"iron"); fs(bx+2.5,y+.5,bz+.5,"iron"); }
    for(const [lx,lz] of [[x-8,z+2],[x+2,z-8],[x+9,z+5],[x-3,z+9]]) lampPost(lx,y+1,lz,4);
  }

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
      for(let j=-ww;j<=ww;j+=.5){ if(f>.65 && rand()<(f-.65)*2.4) continue; const x=ex+.5+dx*off-dz*j, z=ez+.5+dz*off+dx*j; if(get(Math.floor(x),Math.floor(y),Math.floor(z))) continue; fs(x,y,z, f>.8 && rand()<.5 ? "spray" : "cascade"); } }
    MIST.push([ex+dx*2.5, top-len*.85, ez+dz*2.5, w]); };
  for(const [isl,ans] of [["grammar",[2.3,.85]],["vocabulary",[3.0,1.9]],["country",[.3,1.3]]]){ const s0=isl==="vocabulary"?GD:S[isl]; for(const an of ans) fall(s0.x,s0.z,s0.y,an,isl==="grammar"?3:2,isl==="grammar"?34:26); }
  // Bogenbrücken aus Stein zwischen den Inseln
  const bridge = (x0,z0,x1,z1,y0,y1) => { const n=Math.ceil(Math.hypot(x1-x0,z1-z0)), nx=-(z1-z0)/n, nz=(x1-x0)/n;
    for(let i=0;i<=n;i++){ const f=i/n, x=x0+(x1-x0)*f, z=z0+(z1-z0)*f, y=Math.round(y0+(y1-y0)*f + Math.sin(f*Math.PI)*1.5);
      for(const w of [-1,0,1]) set(x+nx*w,y,z+nz*w,"stone"); for(const w of [-2,2]){ set(x+nx*w,y,z+nz*w,"trim"); if(i%2===0) fs(x+nx*w+.5,y+1,z+nz*w+.5,"pillar"); }
      const under = Math.round(Math.sin(f*Math.PI)*3); for(let k=1;k<=under;k++) set(x,y-k,z,"stoneB");
      if(i%6===3){ fs(x+nx*2+.5,y+1.5,z+nz*2+.5,"pillar"); set(x+nx*2,y+2,z+nz*2,"lamp"); } } };
  bridge(30,36,22,44,24,18); bridge(62,36,70,44,24,16);
  // ---------- Sky Library: große Palast-Insel (Kuppelpalast, Spitztürme, Torbogen, Terrassen, lange Wasserfälle) ----------
  { const PX=-8, PZ=-54, PY=34, KR=["cliff","cliffD"], MB="marble";
    // Inselkörper aus mehreren Teilen: Mitte, linke Baum-Terrasse, rechtes Plateau, abgesetzte Insel rechts, Absätze an der Unterseite
    island(PX,PZ,21,PY,{deep:1.2, rk:KR, flat:true}); level(PX,PZ,17,PY);
    island(PX-27,PZ+5,14,PY-3,{deep:1.0, rk:KR});
    island(PX+27,PZ-2,13,PY-1,{deep:1.05, rk:KR, flat:true}); level(PX+27,PZ-2,9,PY-1);
    island(PX+53,PZ-12,6,PY+7,{deep:1.2, rk:KR, bare:true}); level(PX+53,PZ-12,4,PY+7);
    for(const [dx,dz,r,dy] of [[-12,16,7,-6],[12,15,8,-9],[-31,17,6,-9],[34,10,6,-8],[1,20,5,-12],[-22,-14,7,-8]]){ island(PX+dx,PZ+dz,r,PY+dy,{deep:1.2, rk:KR}); const t=topAt(PX+dx,PZ+dz,PY+dy+4); tree(PX+dx,t+1,PZ+dz,4,2.3,rand()<.4?"blossom":"leaves"); }

    // --- Baukasten
    const gnd = (x,z) => topAt(Math.round(x),Math.round(z),PY+10);
    const block = (x0,z0,x1,z1,y0,h) => { fill(x0,y0,z0,x1,y0+h,z1,(a,b,c)=> ((b-y0)%5===4 || b===y0+h) ? "ptrim" : MB);
      for(let a=x0+2;a<x1-1;a+=3) for(const c of [z0,z1]) for(let k=1;k<=3;k++) set(a,y0+k+(h>7?1:0),c,"win");
      for(let c=z0+2;c<z1-1;c+=3) for(const a of [x0,x1]) for(let k=1;k<=3;k++) set(a,y0+k+(h>7?1:0),c,"win");
      for(let a=x0;a<=x1;a++) for(const c of [z0,z1]) set(a,y0+h+1,c,(a-x0)%2?"ptrim":"pcol");
      for(let c=z0;c<=z1;c++) for(const a of [x0,x1]) set(a,y0+h+1,c,(c-z0)%2?"ptrim":"pcol");
      for(let a=x0+1;a<x1;a+=3) fill(a,y0,z1+1,a,y0+h-1,z1+1,"pcol"); };                 // Pilaster an der Front
    const finial = (x,y,z,n) => { for(let k=0;k<n;k++) fs(x+.5,y+k*.5,z+.5,"gold"); };
    const smallDome = (cx,cz,y0,r,h) => { cyl(cx,y0,cz,r,h,(a,b,c)=> (b-y0)%4===3 ? "ptrim" : MB);
      for(let i=0;i<6;i++){ const an=i/6*Math.PI*2+.3; for(let k=1;k<=Math.min(3,h-1);k++) set(Math.round(cx+Math.cos(an)*r),y0+k,Math.round(cz+Math.sin(an)*r),"win"); }
      ring(cx,y0+h,cz,r+.8,"ptrim"); dome(cx,y0+h+1,cz,r+.3,"slate",true); finial(cx,y0+h+r+1.2,cz,7); };
    const spire = (tx,tz,y0,r,h,roofH) => { cyl(tx,y0,tz,r,h,(a,b,c)=> (b-y0)%6===5 ? "ptrim" : MB);
      for(let hh=3; hh<h-2; hh+=6) for(let i=0;i<4;i++){ const an=i/4*Math.PI*2+.4; set(Math.round(tx+Math.cos(an)*r),y0+hh,Math.round(tz+Math.sin(an)*r),"win"); set(Math.round(tx+Math.cos(an)*r),y0+hh+1,Math.round(tz+Math.sin(an)*r),"win"); }
      ring(tx,y0+h,tz,r+1,"ptrim"); for(let i=0;i<4;i++){ const an=i/4*Math.PI*2+.8, ox=Math.round(tx+Math.cos(an)*(r+1.6)), oz=Math.round(tz+Math.sin(an)*(r+1.6)); fill(ox,y0+h-6,oz,ox,y0+h-1,oz,MB); cone(ox,y0+h,oz,1.2,4,"slate"); }
      cone(tx,y0+h+1,tz,r+.9,roofH,(a,b,c)=> (b-y0-h)%4===0 ? "slateT" : "slate"); finial(tx,y0+h+roofH+1,tz,8); };
    // Holz-Stein-Turm (Glockenturm) nach Vorlage: Fachwerk, offene Glockenstube, steiles Holzdach
    const bellTower = (tx,tz,y0) => { const W=3, sq=(h,w,m)=>fill(tx-w,h,tz-w,tx+w,h,tz+w,m);
      for(let y=y0;y<y0+13;y++) for(let a=-W;a<=W;a++) for(let c=-W;c<=W;c++){ if(Math.abs(a)<W && Math.abs(c)<W) continue; const corner=Math.abs(a)===W&&Math.abs(c)===W;
        set(tx+a,y,tz+c, corner?"tstone": ((y-y0)%6===5?"tstone": ((Math.abs(a)===W?c:a)%3===0 && (y-y0)%6>=2 && (y-y0)%6<=4)?"win":"twood")); }
      sq(y0+13,W+1,"ptrim");
      for(const [a,c] of [[-W,-W],[W,-W],[-W,W],[W,W]]) for(let y=y0+14;y<y0+21;y++){ set(tx+a,y,tz+c,"tstone"); set(tx+a+Math.sign(a)*0,y,tz+c,"tstone"); }
      for(const a of [-W,W]) for(const c of [-1,0,1]){ set(tx+a,y0+16,tz+c,"twood"); set(tx+c,y0+16,tz+a,"twood"); }
      for(let y=y0+14;y<y0+20;y++) fill(tx,y,tz,tx,y,tz,"pcol"); fs(tx+.5,y0+17.5,tz+.5,"gold"); fs(tx+.5,y0+17,tz+.5,"gold");
      sq(y0+21,W+1,"ptrim");
      for(const [a,c] of [[-W-1,-W-1],[W+1,-W-1],[-W-1,W+1],[W+1,W+1]]){ fill(tx+a,y0+21,tz+c,tx+a,y0+23,tz+c,"tstone"); fs(tx+a+.5,y0+24,tz+c+.5,"gold"); }
      for(let i=0;i<9;i++){ const h=Math.round(4-i*.5); if(h<0) break; sq(y0+22+i,h,i%3===2?"ptrim":"twood"); }
      for(let y=y0+31;y<y0+36;y++) set(tx,y,tz,"twood"); finial(tx,y0+36,tz,8); };
    const gate = (cx,cz,y0,R,thick,planeX) => { const P=4; for(let a=-R-2;a<=R+2;a++) for(let b=0;b<=P+R+2;b++){ let solid;
        if(b<=P) solid = Math.abs(a)>=R && Math.abs(a)<=R+2; else { const d=Math.hypot(a,b-P); solid = d>=R && d<=R+2; }
        if(solid) for(let t=0;t<thick;t++) set(planeX?cx+t:cx+a, y0+b, planeX?cz+a:cz+t, b>P+R-1 && Math.abs(a)<2 ? "gold" : (b%5===4?"ptrim":MB)); }
      for(let t=0;t<thick;t++) for(let a=-R-2;a<=R+2;a+=2) set(planeX?cx+t:cx+a, y0+P+R+3, planeX?cz+a:cz+t, "pcol"); };

    // --- Hauptpalast
    const BX=PX+4, BZ=PZ, B=PY+4;
    for(let s=0;s<3;s++){ disk(BX,PY+1+s,BZ,18-s*1.6,"pbase"); ring(BX,PY+1+s,BZ,18-s*1.6,"ptrim"); }          // Stufensockel
    block(BX-15,BZ-10,BX+15,BZ+10,B,8);
    // Säulenvorbau (Portikus) mit Giebel an der Südseite
    for(let a=-6;a<=6;a+=3) fill(BX+a,B,BZ+12,BX+a,B+9,BZ+12,"pcol");
    fill(BX-7,B+10,BZ+11,BX+7,B+10,BZ+13,"ptrim"); for(let i=0;i<5;i++) fill(BX-6+i,B+11+i,BZ+11,BX+6-i,B+11+i,BZ+13,i%2?MB:"ptrim");
    for(let s=0;s<3;s++) fill(BX-6,PY+4-s,BZ+14+s,BX+6,PY+4-s,BZ+14+s,MB);
    // große Haupttrommel mit Säulenumgang
    const D0=B+9;
    cyl(BX,D0,BZ,9,9,(a,b,c)=> (b-D0)%5===4 ? "ptrim" : MB);
    for(let i=0;i<12;i++){ const an=i/12*Math.PI*2+.26; for(let kk=2;kk<=6;kk++) set(Math.round(BX+Math.cos(an)*9),D0+kk,Math.round(BZ+Math.sin(an)*9),"win"); }
    for(let i=0;i<24;i++){ const an=i/24*Math.PI*2, px=Math.round(BX+Math.cos(an)*11), pz=Math.round(BZ+Math.sin(an)*11); fill(px,B+9,pz,px,D0+6,pz,"pcol"); }
    for(let r=9.4;r<=12;r+=.6) ring(BX,D0+7,BZ,r,MB); ring(BX,D0+8,BZ,12,"ptrim"); ring(BX,D0+8,BZ,11.2,"pcol");
    // Obertrommel und große Kuppel mit Rippen, Laterne und goldener Spitze
    cyl(BX,D0+8,BZ,8,5,(a,b,c)=> (b-D0-8)%5===4 ? "ptrim" : MB);
    for(let i=0;i<10;i++){ const an=i/10*Math.PI*2; for(let kk=1;kk<=3;kk++) set(Math.round(BX+Math.cos(an)*8),D0+8+kk,Math.round(BZ+Math.sin(an)*8),"win"); }
    ring(BX,D0+13,BZ,9,"ptrim");
    const DY=D0+14; dome(BX,DY,BZ,8,"slate",true);
    for(let i=0;i<12;i++){ const an=i/12*Math.PI*2; for(let t=0;t<=1;t+=.04){ const rr=8.6*Math.cos(t*Math.PI/2), py=DY+8.6*Math.sin(t*Math.PI/2); fs(BX+.5+Math.cos(an)*rr,py+.25,BZ+.5+Math.sin(an)*rr,"ptrim"); } }
    for(let i=0;i<10;i++){ const an=i/10*Math.PI*2+.3; fs(BX+.5+Math.cos(an)*8.4,DY+3,BZ+.5+Math.sin(an)*8.4,"win"); }   // Dachgauben
    cyl(BX,DY+8,BZ,1.8,4,(a,b)=> (b-DY-8)%2 ? "pcol" : "ptrim"); ring(BX,DY+12,BZ,2.4,"ptrim"); dome(BX,DY+12,BZ,2.2,"slate",true); finial(BX,DY+14.5,BZ,12);
    for(const [a,c] of [[-12.5,-7.5],[12.5,-7.5],[-12.5,7.5],[12.5,7.5]]) smallDome(BX+a,BZ+c,B+9,3.6,5);
    for(const [a,c,h] of [[-15,-10,14],[15,-10,14],[-15,10,12],[15,10,12]]) spire(BX+a,BZ+c,B,1.8,h,8);
    // leuchtender Eingang (leicht blau) in der Hauptfassade
    { const dz=BZ+10; for(let a=-2;a<=2;a++) for(let k=1;k<=5;k++) if(!(k===5&&Math.abs(a)===2)) { set(BX+a,B+k,dz,"glowB"); set(BX+a,B+k,dz-1,"glowB"); }
      for(let a=-3;a<=3;a++) set(BX+a,B+6,dz,"ptrim"); for(const a of [-3,3]) for(let k=1;k<=5;k++) set(BX+a,B+k,dz,"pcol"); }
    lampPost(BX-3,PY+4,BZ+19,3); lampPost(BX+3,PY+4,BZ+19,3);

    // --- Linke Seite: hoher Spitzturm, Kuppelhalle auf der Baum-Terrasse, Torbogen
    bellTower(PX-16,PZ-5,PY+1);
    for(const [dx,dz,h] of [[-12,-12,12],[-20,-12,10]]) spire(PX+dx,PZ+dz,PY+1,1.7,h,8);
    { const LX=PX-24, LZ=PZ+5, t=gnd(LX,LZ); block(LX-6,LZ-5,LX+6,LZ+5,t+1,5); cyl(LX,t+7,LZ,5,4,(a,b)=> (b-t-7)%4===3?"ptrim":MB); ring(LX,t+11,LZ,5.8,"ptrim"); dome(LX,t+12,LZ,5.4,"slate",true); finial(LX,t+18,LZ,8); }
    gate(PX-17,PZ+14,PY+1,5,3,true);
    // --- Rechte Seite: Säulenhalle mit kleiner Kuppel und zwei schlanken Spitztürmen
    { const RX=PX+27, RZ=PZ-2, t=gnd(RX,RZ); block(RX-6,RZ-6,RX+6,RZ+4,t+1,7); for(let a=-4;a<=4;a+=2) fill(RX+a,t+1,RZ+6,RX+a,t+7,RZ+6,"pcol"); fill(RX-5,t+8,RZ+5,RX+5,t+8,RZ+7,"ptrim"); smallDome(RX,RZ-1,t+9,3.2,4); }
    spire(PX+22,PZ-11,gnd(PX+22,PZ-11)+1,2,20,11); spire(PX+34,PZ+4,gnd(PX+34,PZ+4)+1,2.2,28,13);
    // abgesetzte Insel ganz rechts mit Turm
    { const t=gnd(PX+53,PZ-12); spire(PX+53,PZ-12,t+1,1.9,13,9); tree(PX+56,t+1,PZ-10,4,2.4,"leaves"); }

    // --- Bewuchs: dichte Baumgruppen links und am Rand, überhängende Bäume, Büsche
    const grove = (cx,cz,rmin,rmax,n,big) => { for(let i=0;i<n;i++){ const a=rand()*Math.PI*2, d=rmin+rand()*(rmax-rmin), x=Math.round(cx+Math.cos(a)*d), z=Math.round(cz+Math.sin(a)*d), t=gnd(x,z);
        if(get(x,t,z)==="grass" && !get(x,t+1,z) && !(Math.abs(x-BX)<9 && z>BZ+11)) tree(x,t+1,z,(big?5:4)+Math.floor(rand()*4),(big?3.2:2.4)+rand()*1.4, rand()<.22?"blossom":"leaves"); } };
    grove(PX-28,PZ+5,2,12,12,true); grove(BX,BZ,18.5,22,18,false); grove(PX+27,PZ-2,9,12,6,false); grove(PX-14,PZ-14,2,5,3,true);

    // --- Unterseite: lange Felszapfen und hängende Spitzen (wie umgedrehte Türmchen)
    const lowest = (x,z) => { let y=PY+8; while(y>-30 && !get(x,y,z)) y--; while(y>-30 && get(x,y-1,z)) y--; return y; };
    const stalac = (x,z,len,r0,m1="cliffD",m2="cliff") => { const y=lowest(x,z), R=Math.ceil(r0)+1; for(let k=0;k<len;k++){ const rr=r0*(1-k/len); if(rr<.35) break; for(let a=-R;a<=R;a++) for(let c=-R;c<=R;c++) if(Math.hypot(a,c)<=rr+.2 && rand()<.92) set(x+a,y-1-k,z+c,k%7===6?m2:m1); } };
    const pend = (x,z) => { const y=lowest(x,z); for(let k=0;k<9;k++){ const rr=1.9*(1-k/9.5); if(rr<.4) break; for(let a=-2;a<=2;a++) for(let c=-2;c<=2;c++) if(Math.hypot(a,c)<=rr) set(x+a,y-1-k,z+c,k%3===0?"ptrim":MB); } for(let k=0;k<5;k++) fs(x+.5,y-9.5-k*.5,z+.5,"gold"); };
    stalac(PX-16,PZ-5,40,5.2,"tstoneD","tstone"); stalac(PX+2,PZ+3,30,2.6); stalac(PX-12,PZ+8,18,2); stalac(PX+16,PZ+6,22,2.2); stalac(PX-28,PZ+8,14,1.8); stalac(PX+30,PZ,16,1.8);
    for(const [dx,dz] of [[-8,6],[10,4],[-24,12],[30,3],[2,-10],[-18,-2]]) pend(PX+dx,PZ+dz);

    // --- Lange, dünne Wasserfälle von den Terrassen
    for(const [x,z,y,an,w,len] of [[PX-27,PZ+5,PY-3,Math.PI*.55,2,58],[PX-27,PZ+5,PY-3,Math.PI*.95,1,50],[PX+2,PZ+4,PY,Math.PI*.5,2,60],[PX+12,PZ+15,PY-9,Math.PI*.45,1,50],[PX+27,PZ-2,PY-1,Math.PI*.3,2,56],[PX+27,PZ-2,PY-1,Math.PI*.05,1,52],[PX+53,PZ-12,PY+7,Math.PI*.5,1,46],[PX-31,PZ+17,PY-9,Math.PI*.6,1,46]]) fall(x,z,y,an,w,len);

    Object.assign(S.vocabulary,{x:BX, z:BZ, r:21, y:PY, top:[BX-16,PY+26,BZ+8], base:PY+6, cam:{pos:[BX-14,PY+40,BZ+68], look:[BX,PY+9,BZ+9]}});
  }
  // kleine Inseln nahe am Bild
  for(const [cx,cz,r,y,d] of [[34,62,4,10,"tree"],[60,64,5,8,"tree"],[118,44,3,24,"rock"],[2,30,3,22,"tree"],[26,8,4,36,"tree"],[68,6,4,38,"rock"]]){ island(cx,cz,r,y,{deep:1.1});
    const t=topAt(cx,cz,y+4); if(d==="tree") tree(cx,t+1,cz,4,2.2, rand()<.5?"blossom":"leaves"); else for(let k=1;k<=3;k++) set(cx,t+k,cz,"crystal"); }
  for(const [cx,cz,y] of [[34,62,10],[60,64,8],[2,30,22],[26,8,36]]) fall(cx,cz,y,Math.PI/2,1,14);
  // ---------- Portal-Insel: uralter Torbogen mit wirbelndem Portal, Steintreppe, Felsbrocken, Palmen ----------
  { const cx=94, cz=14, y=28, r=9; island(cx,cz,r,y,{deep:1.5}); level(cx,cz,r-2,y);
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

  // ---------- Weltenbaum-Insel (hinter dem Portal): riesiger Baum, Moosterrassen, Teich, Felshöhle, Pfade, Korallenpflanzen ----------
  { const CX=116, CZ=-50, YT=30, WR=["wRock","wRockD"];
    const lobes=[[-12,23,5,-5,1],[-2,27,5,-6,1],[9,24,5,-6,1],[17,17,5,-5,1],[-14,-16,7,-1,.9],[12,-18,7,-2,.9],[-14,7,5,-2,.9],[17,3,6,-2,.9],[-21,12,9,-4,1],[24,6,10,-3,.9],[0,0,15,0,.95]];
    for(const [dx,dz,r,dy,dp] of lobes) island(CX+dx,CZ+dz,r,YT+dy,{deep:dp, rk:WR, bare:true, flat:true});
    island(CX-42,CZ-6,3.8,YT+6,{deep:1.2, rk:WR, bare:true});
    for(const [dx,dz,r,dy] of [[2,13,2,-15],[-30,22,2.5,-10],[34,16,3,-11],[8,-30,3,-5],[-8,-4,2,-20]]) island(CX+dx,CZ+dz,r,YT+dy,{deep:1.4, rk:WR, bare:true});
    for(let z=CZ-45;z<=CZ+42;z++) for(let x=CX-55;x<=CX+48;x++) for(let y=YT-46;y<=YT+8;y++){ const t=get(x,y,z); if(t==="grass") set(x,y,z,"moss"); else if(t==="dirt") set(x,y,z,"mossD"); }
    const mossify=(x0,x1,y0,y1,z0,z1)=>{ for(let x=x0;x<=x1;x++) for(let z=z0;z<=z1;z++) for(let y=y0;y<=y1;y++) if(get(x,y,z)==="wRock" && !get(x,y+1,z) && rand()<.75) set(x,y,z,"moss"); };
    // Mooshügel mit Steinmauer (zwei Stufen) um den Baum
    for(let z=CZ-13;z<=CZ+13;z++) for(let x=CX-13;x<=CX+13;x++){ const d=Math.hypot(x-CX,z-CZ), an=Math.atan2(z-CZ,x-CX), gap=a0=>Math.abs(Math.atan2(Math.sin(an-a0),Math.cos(an-a0)))<.2;
      if(d<=9.6) fill(x,YT+1,z,x,YT+3,z,(a,b)=>b===YT+3?"moss":"mossD");
      else if(d<=11.6){ const g=gap(2.7)||gap(.35), h=g?Math.max(0,Math.round(3-(d-9.6)*1.5)):2+Math.floor(rand()*3); for(let y=YT+1;y<=YT+h;y++) set(x,y,z,g?(y===YT+h?"sandP":"mossD"):"wRock"); }
      if(d<=6) set(x,YT+4,z,"moss"); else if(d<=7.4 && rand()<.85) set(x,YT+4,z,"wRock"); }
    mossify(CX-13,CX+13,YT,YT+5,CZ-13,CZ+13);
    // Teich links vorne mit Steinrand
    { const px=CX-21, pz=CZ+13; for(let z=pz-6;z<=pz+6;z++) for(let x=px-6;x<=px+6;x++){ const d=Math.hypot(x-px,z-pz); if(d<=3.3){ set(x,YT-4,z,"wPond"); set(x,YT-5,z,"wPond"); } else if(d<=4.7 && rand()<.85 && get(x,YT-4,z)) set(x,YT-3,z,"wRock"); } mossify(px-6,px+6,YT-4,YT-3,pz-6,pz+6); }
    // Felsformation mit Höhle rechts
    { const rx=CX+30, rz=CZ+4, b=YT-3;
      ellip(rx,b+4,rz,7,5,6,"wRock"); ellip(rx+4,b+7,rz+2,4,4,4,"wRock"); ellip(rx-3,b+3,rz-4,4,3,3,"wRock"); ellip(rx+1,b+10,rz-1,2.6,2.6,2.6,"wRock");
      ellip(rx-2,b+3,rz+5,2.4,2.8,2.6,null); ellip(rx-2,b+3,rz+3,2.2,2.4,1.6,"wRockD"); ellip(rx-2,b+2.5,rz+3.4,1.6,1.8,1,null);
      mossify(rx-8,rx+9,b,b+14,rz-8,rz+8); }
    // Ruinen: Säulenpaare links und hinten
    const ruin=(x,z,hs)=>{ hs.forEach((h,i)=>{ const t=topAt(x+i*3,z,YT+8); if(t<-50) return; fill(x+i*3,t+1,z,x+i*3,t+h,z,"wRock"); }); const t=topAt(x,z,YT+8); if(t>-50) fill(x,t+hs[0]+1,z,x+3*(hs.length-1),t+hs[0]+1,z,"wRock"); };
    ruin(CX-31,CZ+8,[5,4]); ruin(CX-25,CZ-15,[6,6]); ruin(CX+14,CZ-20,[4,5]);
    // Moosvorhänge: Ranken an den Inselkanten
    for(let z=CZ-45;z<=CZ+42;z++) for(let x=CX-48;x<=CX+48;x++){ const t=topAt(x,z,YT+8); if(t<-50||t>YT||get(x,t,z)!=="moss") continue;
      for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]) if(!get(x+dx,t,z+dz) && !get(x+dx,t-1,z+dz) && rand()<.16){ const len=3+Math.floor(rand()*9); for(let k=0;k<len;k++){ if(get(x+dx,t-k,z+dz)) break; set(x+dx,t-k,z+dz,"wVine"); } } }
    // Wege (goldener Sand), über die Treppen durch die Mauer
    const route=[[[-27,14],[-21,10],[-15,7],[-11,5],[-7,3],[-3,1]],[[3,0],[8,1],[11,3],[17,5],[23,6],[28,4]],[[-20,13],[-13,22],[-3,27],[8,25],[16,18],[21,9]]];
    for(const pts of route) for(let i=0;i<pts.length-1;i++){ const [x0,z0]=pts[i],[x1,z1]=pts[i+1], n=Math.ceil(Math.hypot(x1-x0,z1-z0)*2); for(let k=0;k<=n;k++){ const f=k/n, x=Math.round(CX+x0+(x1-x0)*f+Math.sin(k*.5)*.4), z=Math.round(CZ+z0+(z1-z0)*f);
      for(const [ox,oz] of [[0,0],[1,0],[0,1]]){ const t=topAt(x+ox,z+oz,YT+9), g=get(x+ox,t,z+oz); if(t>-50 && (g==="moss"||g==="sandP")) set(x+ox,t,z+oz,"sandP"); } } }
    // Korallenpflanzen (pink/gelb), Büsche, Felsbrocken, kleine Bäume
    const spots=[]; for(const [dx,dz,r] of lobes) spots.push([CX+dx,CZ+dz,r]);
    const onMoss=(x,z)=>{ const t=topAt(x,z,YT+9); return t>-50 && get(x,t,z)==="moss" ? t : null; };
    const plant=(x,z,col)=>{ const t=onMoss(x,z); if(t===null) return; const h=3+Math.floor(rand()*4); let ox=x+.5; const oz=z+.5, lean=(rand()-.5)*.4;
      for(let k=0;k<h*2;k++){ fs(ox,t+1+k*.5,oz,col); ox+=lean*.4; }
      for(let br=0;br<3;br++){ const a=rand()*6.283, hy=t+1+h*(.5+br*.17); for(let k=1;k<=4;k++) fs(ox+Math.cos(a)*k*.45, hy+k*.4, oz+Math.sin(a)*k*.45, col); fs(ox+Math.cos(a)*2.4, hy+2.1, oz+Math.sin(a)*2.4, col); } };
    for(let i=0;i<22;i++){ const [sx,sz,r]=spots[Math.floor(rand()*spots.length)], a=rand()*6.283, d=r*(.3+.6*rand()); plant(Math.round(sx+Math.cos(a)*d),Math.round(sz+Math.sin(a)*d), i%2?"pinkP":"yellowP"); }
    for(let i=0;i<26;i++){ const [sx,sz,r]=spots[Math.floor(rand()*spots.length)], a=rand()*6.283, d=r*(.3+.65*rand()), x=Math.round(sx+Math.cos(a)*d), z=Math.round(sz+Math.sin(a)*d), t=onMoss(x,z); if(t===null) continue;
      if(rand()<.55) ellip(x,t+1.3,z,1.2+rand()*1.2,1+rand()*.6,1.2+rand()*1.2,()=>rand()<.3?"leavesL":"hedge"); else { ellip(x,t+1,z,1.6+rand(),1.2,1.6+rand(),"wRock"); mossify(x-3,x+3,t,t+3,z-3,z+3); } }
    for(let i=0;i<20;i++){ const [sx,sz,r]=spots[Math.floor(rand()*spots.length)], a=rand()*6.283, d=r*(.35+.55*rand()), x=Math.round(sx+Math.cos(a)*d), z=Math.round(sz+Math.sin(a)*d), t=onMoss(x,z); if(t===null||Math.hypot(x-CX,z-CZ)<12.5) continue; tree(x,t+1,z,4+Math.floor(rand()*4),2.2+rand()*1.2, rand()<.2?"blossom":"leaves"); }
    { const t=topAt(CX-42,CZ-6,YT+12); tree(CX-42,t+1,CZ-6,5,2.6,"leaves"); }
    // Der Weltenbaum: gewundener Stamm, Wurzeln, fünf Hauptäste mit mächtigen Kronen und Ranken
    const TB=YT+5, TH=18, tx=t=>CX+Math.sin(t*5)*1.3*t, tz=t=>CZ+Math.cos(t*5)*1.3*t;
    for(let k=0;k<=TH;k++){ const t=k/TH, r=k<5?4.6-k*.25:3.4-t*1.2; disk(tx(t),TB+k,tz(t),Math.max(1.9,r),"wBark"); }
    for(let i=0;i<8;i++){ const a=i/8*6.283+.3, len=8+rand()*5; line(CX+Math.cos(a)*3,TB+1,CZ+Math.sin(a)*3,CX+Math.cos(a)*len,YT+3,CZ+Math.sin(a)*len,"wBark",1); }
    const F=[tx(1),TB+TH,tz(1)];
    const shell=(cx,cy,cz,rx,ry,rz)=>{ for(let x=Math.floor(cx-rx-1);x<=cx+rx+1;x++) for(let y=Math.floor(cy-ry-1);y<=cy+ry+1;y++) for(let z=Math.floor(cz-rz-1);z<=cz+rz+1;z++){ const q=((x-cx)/rx)**2+((y-cy)/ry)**2+((z-cz)/rz)**2; if(q<=1+(rand()-.5)*.35 && q>=.45){ set(x,y,z,rand()<.3?"wLeafL":"wLeaf"); if(y<cy-ry*.45 && rand()<.03){ const l=3+Math.floor(rand()*10); for(let k=1;k<=l;k++){ if(get(x,y-k,z)) break; set(x,y-k,z,"wVine"); } } } } };
    for(const [dx,dy,dz,rr] of [[-17,8,-5,9.5],[18,7,4,9.5],[-4,12,13,9],[6,13,-13,9],[-1,18,1,8]]){
      const P1=[F[0]+dx*.4,F[1]+dy*.55,F[2]+dz*.4], P2=[F[0]+dx,F[1]+dy,F[2]+dz];
      line(F[0],F[1],F[2],P1[0],P1[1],P1[2],"wBark",1); line(P1[0],P1[1],P1[2],P2[0],P2[1],P2[2],"wBark",0);
      shell(P2[0],P2[1]+2,P2[2],rr,rr*.5,rr); shell(P2[0]+rr*.6,P2[1]+.5,P2[2]-rr*.5,rr*.6,rr*.38,rr*.6); shell(P2[0]-rr*.55,P2[1]+.5,P2[2]+rr*.55,rr*.6,rr*.38,rr*.6); }
  }

  // ---------- Hintergrund: echte schwebende Inseln (normale Blöcke) mit Bäumen, Türmen, Wasserfällen ----------
  const farIsle = (cx,cz,r,y,deco) => { island(cx,cz,r,y,{deep:1.3, bare:true}); const t=topAt(cx,cz,y+4)+1;
    if(deco==="tree"){ tree(cx-1,t,cz,5,3,"leaves"); tree(cx+r*.5,t,cz+1,4,2.4,"blossom"); }
    if(deco==="tower"){ cyl(cx,t,cz,2,12,(a,b,c)=>(b-t)%5===0?"trim":"stone"); cone(cx,t+12,cz,2.8,8,"roof"); set(cx+2,t+6,cz,"win"); tree(cx+r*.55,t,cz-1,3,2,"leaves"); }
    if(deco==="ruin"){ for(const a of [-3,0,3]) fill(cx+a,t,cz-1,cx+a,t+3+Math.floor(rand()*6),cz-1,"pillar"); fill(cx-3,t+6,cz-1,cx+3,t+6,cz-1,"stone"); }
    if(deco!=="ruin") fall(cx,cz,y,Math.PI*.15,2,30); };
  for(const [cx,cz,r,y,d] of [[-40,24,6,22,"tree"],[132,30,7,26,"ruin"],[-74,-30,9,40,"tower"]]) farIsle(cx,cz,r,y,d);

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
    lights:[{pos:[S.vocabulary.x,S.vocabulary.y+8,S.vocabulary.z+14], color:0x7FB8FF, int:170, dist:26}, {pos:[S.grammar.x,S.grammar.y+14,S.grammar.z+16], color:0xFFE6A8, int:140, dist:34}, {pos:[S.vocabulary.x,S.vocabulary.y+14,S.vocabulary.z+22], color:0xFFE6A8, int:150, dist:40}, {pos:[94,42,17], color:0xC88AFF, int:260, dist:30, flicker:1400}],
    planes:[{y:-30, size:1400, color:0xB8CCE6, em:0}],
    // unter der Festung: Nebel und ein Wolkenmeer, dazu einige große Haufenwolken mit Detail
    puffs:[{n:16, pos:[0,-2,10], dx:W, dy:1, dz:0, s0:26, s1:30, color:0xF2F6FC, opacity:.45, speed:.006, spread:26, flat:.35},
           {n:14, pos:[10,6,D/2], dx:W-20, dy:2, dz:0, s0:14, s1:18, color:0xFFFFFF, opacity:.35, speed:.01, spread:20, flat:.4},
           ...MIST.map(([x,y,z,w])=>({n:10, pos:[x,y-2,z], dx:0, dy:6, dz:0, s0:8+w*2, s1:14+w*3, color:0xCFE6FF, opacity:.8, speed:.04, spread:3+w}))],
    clouds:[
      // Wolkenmeer weit unten
      ...[[-160,-14,-120],[-40,-16,-140],[90,-14,-150],[220,-16,-120],[-180,-15,0],[260,-14,10],[-120,-12,110],[200,-12,120],[46,-18,150],[-30,-14,-30],[130,-15,-40]].map(p=>({pos:p, r:46, n:28, sx:1.8, sy:.35, sz:1.4, flat:true, lo:0xC8D6EA, opacity:.95})),
      // Nebelbänke direkt unter den Inseln
      ...[[20,-2,30],[70,-3,26],[46,-4,64],[-6,-6,10],[100,-5,0]].map(p=>({pos:p, r:20, n:16, sx:1.6, sy:.35, sz:1.2, flat:true, lo:0xDCE6F4, opacity:.6})),
      // Haufenwolken mit Detail (in die der Adler hineinfliegen kann)
      {pos:[-70,52,-14], r:13, n:46, sx:1.5, sy:.8, sz:1.1, drift:.6},
      {pos:[150,54,-30], r:14, n:50, sx:1.6, sy:.85, sz:1.1, drift:.5},
      {pos:[30,58,-46], r:11, n:38, sx:1.5, sy:.75, sz:1, drift:.4},
      {pos:[150,30,-80], r:20, n:44, sx:1.7, sy:.8, sz:1.2},
      {pos:[-90,36,-70], r:18, n:40, sx:1.6, sy:.8, sz:1.2}
    ],
    particles:[...MIST.map(([x,y,z,w])=>({n:36, area:[x-w-1,x+w+1,y-3,y+6,z-w-1,z+w+1], vy:1.7, wob:1.2, color:0xCFE6FF, size:.36, opacity:.7, add:true})),
               {n:160, area:[86,102,34,54,8,20], vy:.8, wob:1.4, color:0xE6A8FF, size:.4, blink:2, add:true},
               {n:90, area:[GD.x-8,GD.x+8,GD.y+2,GD.y+16,GD.z-8,GD.z+8], vy:-1, wob:1.2, color:0xFFB8D8, size:.35, opacity:.9}],
    creatures,
    home:{pos:[W/2,66,D+96], look:[W/2,36,D/2-6]}, homePortrait:{pos:[W/2,84,D+150], look:[W/2,30,D/2-6]},
    ui:{bg:"rgba(255,255,255,.9)", border:"#6AA8FF", glow:"rgba(106,168,255,.45)", text:"#16305A", sub:"#4A6A98", accent:"#FFC24A", "accent-ink":"#2A1E06", chip:"rgba(255,255,255,.85)"}
  };
}
