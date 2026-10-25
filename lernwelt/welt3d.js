/* FRS Lernwelten – 3D-Klötzchenwelten.
   Jede Welt liegt als Modul in lernwelt/welten/<name>.js und exportiert build(api).
   build() baut mit den Helfern unten die Klötzchen und liefert Himmel, Licht, Partikel und die Bauplätze der Bereiche.
   Neu: A.far ist ein zweiter, grober Baukasten (große Blöcke) für die Landschaft bis zum Horizont,
   world.creatures sind Tiere aus Klötzchen mit beweglichen Teilen (Flügel, Kopf, Schwanz).
   start() rendert die Welt, zeigt Beschriftungen und fliegt beim Antippen eines Bereichs hinein. */
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

/* ---------- Baukasten für die Welten ---------- */
function makeStore(){
  const V = new Map();
  const key = (x,y,z) => ((x+2000)*4096 + (y+2000))*4096 + (z+2000);
  const set = (x,y,z,t) => { x=Math.round(x); y=Math.round(y); z=Math.round(z); if(t) V.set(key(x,y,z), [x,y,z,t]); else V.delete(key(x,y,z)); };
  const get = (x,y,z) => { const v = V.get(key(Math.round(x),Math.round(y),Math.round(z))); return v ? v[3] : null; };
  const val = (t,x,y,z) => typeof t==="function" ? t(x,y,z) : t;
  const fill = (x0,y0,z0,x1,y1,z1,t) => { for(let x=Math.min(x0,x1);x<=Math.max(x0,x1);x++) for(let y=Math.min(y0,y1);y<=Math.max(y0,y1);y++) for(let z=Math.min(z0,z1);z<=Math.max(z0,z1);z++) set(x,y,z,val(t,x,y,z)); };
  const walls = (x0,y0,z0,x1,y1,z1,t) => { for(let x=x0;x<=x1;x++) for(let y=y0;y<=y1;y++) for(let z=z0;z<=z1;z++) if(x===x0||x===x1||z===z0||z===z1) set(x,y,z,val(t,x,y,z)); };
  const disk = (cx,y,cz,r,t) => { for(let x=Math.floor(cx-r);x<=Math.ceil(cx+r);x++) for(let z=Math.floor(cz-r);z<=Math.ceil(cz+r);z++) if(Math.hypot(x-cx,z-cz)<=r+.3) set(x,y,z,val(t,x,y,z)); };
  const ring = (cx,y,cz,r,t,w=1) => { for(let x=Math.floor(cx-r-1);x<=Math.ceil(cx+r+1);x++) for(let z=Math.floor(cz-r-1);z<=Math.ceil(cz+r+1);z++){ const d=Math.hypot(x-cx,z-cz); if(d<=r+.3 && d>r-w+.3) set(x,y,z,val(t,x,y,z)); } };
  const cyl = (cx,y0,cz,r,h,t) => { for(let y=y0;y<y0+h;y++) disk(cx,y,cz,r,t); };
  const tube = (cx,y0,cz,r,h,t,w=1) => { for(let y=y0;y<y0+h;y++) ring(cx,y,cz,r,t,w); };
  const ball = (cx,cy,cz,r,t,hollow) => { for(let x=Math.floor(cx-r);x<=Math.ceil(cx+r);x++) for(let y=Math.floor(cy-r);y<=Math.ceil(cy+r);y++) for(let z=Math.floor(cz-r);z<=Math.ceil(cz+r);z++){ const d=Math.hypot(x-cx,y-cy,z-cz); if(d<=r+.2 && (!hollow || d>r-1.1)) set(x,y,z,val(t,x,y,z)); } };
  const ellip = (cx,cy,cz,rx,ry,rz,t) => { for(let x=Math.floor(cx-rx);x<=Math.ceil(cx+rx);x++) for(let y=Math.floor(cy-ry);y<=Math.ceil(cy+ry);y++) for(let z=Math.floor(cz-rz);z<=Math.ceil(cz+rz);z++){ if(((x-cx)/(rx+.3))**2+((y-cy)/(ry+.3))**2+((z-cz)/(rz+.3))**2<=1) set(x,y,z,val(t,x,y,z)); } };
  const dome = (cx,y0,cz,r,t,hollow) => { for(let x=Math.floor(cx-r);x<=Math.ceil(cx+r);x++) for(let y=y0;y<=y0+r;y++) for(let z=Math.floor(cz-r);z<=Math.ceil(cz+r);z++){ const d=Math.hypot(x-cx,y-y0,z-cz); if(d<=r+.2 && (!hollow || d>r-1.1)) set(x,y,z,val(t,x,y,z)); } };
  const cone = (cx,y0,cz,r,h,t) => { for(let i=0;i<h;i++) disk(cx,y0+i,cz,r*(1-i/h),t); };
  const line = (x0,y0,z0,x1,y1,z1,t,th=0) => { const n=Math.ceil(Math.max(Math.abs(x1-x0),Math.abs(y1-y0),Math.abs(z1-z0)))*2||1;
    for(let i=0;i<=n;i++){ const f=i/n, x=Math.round(x0+(x1-x0)*f), y=Math.round(y0+(y1-y0)*f), z=Math.round(z0+(z1-z0)*f); if(th) fill(x-th,y,z-th,x+th,y,z+th,t); else set(x,y,z,val(t,x,y,z)); } };
  const topAt = (x,z,from=140) => { for(let y=from;y>=-60;y--) if(get(x,y,z)) return y; return -99; };
  // freie Sicht: entfernt die genannten Blocktypen entlang einer Linie (z. B. Blätter zwischen Kamera und Bauwerk)
  const clearView = (p, q, r, types) => { const n=Math.ceil(Math.hypot(q[0]-p[0],q[1]-p[1],q[2]-p[2])); for(let i=0;i<=n;i++){ const f=i/n, cx=p[0]+(q[0]-p[0])*f, cy=p[1]+(q[1]-p[1])*f, cz=p[2]+(q[2]-p[2])*f;
      for(let x=Math.floor(cx-r);x<=cx+r;x++) for(let y=Math.floor(cy-r);y<=cy+r;y++) for(let z=Math.floor(cz-r);z<=cz+r;z++) if(types.includes(get(x,y,z))) set(x,y,z,null); } };
  return { V, set, get, fill, walls, disk, ring, cyl, tube, ball, ellip, dome, cone, line, topAt, clearView };
}

export function makeApi(seedNum){
  let seed = seedNum|0;
  const rand = () => { seed|=0; seed=seed+0x6D2B79F5|0; let t=Math.imul(seed^seed>>>15,1|seed); t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296; };
  const G = 32, grid = Array.from({length:G*G}, rand);
  const vn = (x,y) => { const xi=Math.floor(x), yi=Math.floor(y), xf=x-xi, yf=y-yi, s=t=>t*t*(3-2*t), g=(a,b)=>grid[((a%G+G)%G)+((b%G+G)%G)*G];
    const a=g(xi,yi), b=g(xi+1,yi), c=g(xi,yi+1), d=g(xi+1,yi+1); return a+(b-a)*s(xf)+(c-a)*s(yf)+(a-b-c+d)*s(xf)*s(yf); };
  const fbm = (x,y) => vn(x,y)*.55 + vn(x*2.1,y*2.1)*.3 + vn(x*4.3,y*4.3)*.15;
  const pick = a => a[Math.floor(rand()*a.length)];

  const near = makeStore(), far = makeStore(), fine = makeStore();
  far.cell = 4; fine.cell = .5;   // fine: halbe Blockgröße für Verzierungen (Koordinaten doppelt)
  const terrain = (W,D,hf,layer) => { for(let z=0;z<D;z++) for(let x=0;x<W;x++){ const h=Math.round(hf(x,z)); for(let y=0;y<h;y++){ const t=layer(x,y,z,h); if(t) near.set(x,y,z,t); } } };
  /* Landschaft bis zum Horizont in groben Blöcken.
     o: { x0,x1,z0,z1 (Weltkoordinaten), h:(x,z)=>Höhe in Welt-Einheiten, top:(x,z,y,hc)=>Typ der obersten Lage, fill:(x,z,y,hc)=>Typ darunter, skip:(x,z)=>true }
     y und hc sind in Zellen gezählt (Zelle = far.cell Welt-Einheiten). */
  const farTerrain = o => { const c=far.cell, X0=Math.floor(o.x0/c), X1=Math.ceil(o.x1/c), Z0=Math.floor(o.z0/c), Z1=Math.ceil(o.z1/c), Hc=new Map(), k=(a,b)=>a*10000+b;
    const hAt = (cx,cz) => { const kk=k(cx,cz); if(Hc.has(kk)) return Hc.get(kk); const x=(cx+.5)*c, z=(cz+.5)*c; const v = (o.skip && o.skip(x,z)) ? null : Math.round(o.h(x,z)/c); Hc.set(kk,v); return v; };
    for(let cz=Z0; cz<=Z1; cz++) for(let cx=X0; cx<=X1; cx++){ const h=hAt(cx,cz); if(h===null) continue; const x=(cx+.5)*c, z=(cz+.5)*c;
      let lo = h-1; for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){ const n=hAt(cx+a,cz+b); if(n!==null) lo=Math.min(lo,n-1); else lo=Math.min(lo,(o.base??0)); }
      lo = Math.max(lo, o.base ?? -4);
      for(let y=lo; y<h; y++){ const t = y===h-1 ? o.top(x,z,y,h) : (o.fill ? o.fill(x,z,y,h) : o.top(x,z,y,h)); if(t) far.set(cx,y,cz,t); } } };

  // 16×16-Pixeltexturen (eigene, im Klötzchen-Stil)
  const tex = draw => { const c=document.createElement("canvas"); c.width=c.height=16; const g=c.getContext("2d"); draw(g);
    const t=new THREE.CanvasTexture(c); t.magFilter=t.minFilter=THREE.NearestFilter; t.colorSpace=THREE.SRGBColorSpace; t.wrapS=t.wrapT=THREE.RepeatWrapping; t.generateMipmaps=false; return t; };
  const P = (g,x,y,c) => { g.fillStyle=c; g.fillRect(x,y,1,1); };
  const noise = (cols, dots, dotCols) => tex(g=>{ for(let x=0;x<16;x++) for(let y=0;y<16;y++) P(g,x,y,pick(cols)); for(let i=0;i<(dots||0);i++) P(g,Math.floor(rand()*16),Math.floor(rand()*16),pick(dotCols)); });
  const stripes = (cols, vertical=true, speck) => tex(g=>{ for(let a=0;a<16;a++){ const c=pick(cols); for(let b=0;b<16;b++) P(g, vertical?a:b, vertical?b:a, speck&&rand()<.15?speck:c); } });
  const bricks = (cols, mortar, bh=4, bw=8) => tex(g=>{ for(let y=0;y<16;y++) for(let x=0;x<16;x++){ const row=Math.floor(y/bh), off=(row%2)*(bw/2); P(g,x,y, (y%bh===bh-1 || (x+off)%bw===bw-1) ? mortar : pick(cols)); } });
  const rings = cols => tex(g=>{ for(let x=0;x<16;x++) for(let y=0;y<16;y++){ const r=Math.max(Math.abs(x-7.5),Math.abs(y-7.5)); P(g,x,y, cols[Math.floor(r/2)%cols.length]); } });
  const topEdge = (base, topCols, depth=3) => tex(g=>{ for(let x=0;x<16;x++) for(let y=0;y<16;y++) P(g,x,y,pick(base)); for(let x=0;x<16;x++){ const d=depth-1+Math.floor(rand()*2); for(let y=0;y<d;y++) P(g,x,y,pick(topCols)); } });
  const planks = (cols, seam) => tex(g=>{ for(let y=0;y<16;y++) for(let x=0;x<16;x++) P(g,x,y, y%4===3 || (x===(Math.floor(y/4)*5)%16) ? seam : pick(cols)); });
  const glassT = (frame, fill) => tex(g=>{ for(let x=0;x<16;x++) for(let y=0;y<16;y++) P(g,x,y, (x===0||y===0||x===15||y===15) ? frame : fill); P(g,3,3,"#ffffff"); P(g,4,3,"#ffffff"); P(g,3,4,"#ffffff"); });
  // Fenster mit Rahmen und Sprossen, warm leuchtend
  const windowT = (frame, glow, glow2) => tex(g=>{ for(let x=0;x<16;x++) for(let y=0;y<16;y++){ const fr = x<2||y<2||x>13||y>13||x===7||x===8||y===7||y===8; P(g,x,y, fr?frame:(rand()<.25?glow2:glow)); } });
  return { rand, vn, fbm, pick, ...near, near, far, fine, terrain, farTerrain,
           tex, P, noise, stripes, bricks, rings, topEdge, planks, glassT, windowT };
}

/* ---------- Tiere: Klötzchen zu einem Netz zusammenfassen ---------- */
const FACES = [
  { n:[ 1,0,0], c:[[1,0,0],[1,1,0],[1,1,1],[1,0,1]] }, { n:[-1,0,0], c:[[0,0,1],[0,1,1],[0,1,0],[0,0,0]] },
  { n:[0, 1,0], c:[[0,1,1],[1,1,1],[1,1,0],[0,1,0]] }, { n:[0,-1,0], c:[[0,0,0],[1,0,0],[1,0,1],[0,0,1]] },
  { n:[0,0, 1], c:[[1,0,1],[1,1,1],[0,1,1],[0,0,1]] }, { n:[0,0,-1], c:[[0,0,0],[0,1,0],[1,1,0],[1,0,0]] } ];
function cubesGeo(cubes, off){
  const has = new Set(cubes.map(c=>c[0]+","+c[1]+","+c[2]));
  const pos=[], nor=[], col=[], idx=[]; const tmp = new THREE.Color();
  for(const [x,y,z,cc] of cubes){
    tmp.set(cc); const j = 1 + ((((x*73856093)^(y*19349663)^(z*83492791))>>>0)%13 - 6)/100;
    for(const f of FACES){ if(has.has((x+f.n[0])+","+(y+f.n[1])+","+(z+f.n[2]))) continue;
      const b = pos.length/3; const sh = f.n[1]>0 ? 1 : f.n[1]<0 ? .72 : .88;
      for(const c of f.c){ pos.push(x+c[0]-.5-off[0], y+c[1]-.5-off[1], z+c[2]-.5-off[2]); nor.push(...f.n); col.push(tmp.r*j*sh, tmp.g*j*sh, tmp.b*j*sh); }
      idx.push(b,b+1,b+2, b,b+2,b+3); } }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos,3)); g.setAttribute("normal", new THREE.Float32BufferAttribute(nor,3)); g.setAttribute("color", new THREE.Float32BufferAttribute(col,3)); g.setIndex(idx);
  return g;
}

/* ---------- Darstellung ---------- */
export async function start(o){
  // o: { canvasHost, build(api), names:{kat:name}, counts:{kat:n}, icons:{kat:icon}, labelHost, onSelect(kat), lite, still }
  const api = makeApi(o.seed || 7);
  const world = o.build(api);
  const { get } = api;

  const renderer = new THREE.WebGLRenderer({antialias:!o.lite, alpha:false, powerPreference:"high-performance", preserveDrawingBuffer:!!o.still});
  const maxPR = o.lite ? 1 : (o.still ? 1 : 1.75);
  renderer.setPixelRatio(Math.min(devicePixelRatio, maxPR));
  renderer.setSize(innerWidth, innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = world.exposure || 1.15;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = !o.lite; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  o.canvasHost.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  { const c=document.createElement("canvas"); c.width=2; c.height=256; const g=c.getContext("2d"), gr=g.createLinearGradient(0,0,0,256);
    world.sky.forEach(([p,col])=>gr.addColorStop(p,col)); g.fillStyle=gr; g.fillRect(0,0,2,256);
    const bg=new THREE.CanvasTexture(c); bg.colorSpace=THREE.SRGBColorSpace; scene.background=bg; }
  if(world.fog) scene.fog = new THREE.Fog(world.fog[0], world.fog[1], world.fog[2]);
  const cam = new THREE.PerspectiveCamera(world.fov || 38, innerWidth/innerHeight, .5, 1200);

  const h = world.hemi || [0xffffff, 0x666666, 1.3];
  scene.add(new THREE.HemisphereLight(h[0], h[1], h[2]));
  const sd = world.sun || {color:0xffffff, int:2, pos:[-50,80,60]};
  const sun = new THREE.DirectionalLight(sd.color, sd.int); sun.position.set(sd.pos[0]+world.W/2, sd.pos[1], sd.pos[2]+world.D/2); sun.castShadow = !o.lite;
  const ext = Math.max(world.W, world.D) * .8;
  Object.assign(sun.shadow.camera, {left:-ext, right:ext, top:ext, bottom:-ext, near:1, far:500}); sun.shadow.mapSize.set(2048,2048); sun.shadow.bias = -.0005;
  sun.target.position.set(world.W/2, 0, world.D/2); scene.add(sun, sun.target);
  const pls = (world.lights||[]).map(l=>{ const p=new THREE.PointLight(l.color, l.int, l.dist||40, 2); p.position.set(...l.pos); p.userData=l; scene.add(p); return p; });

  // Klötzchen nach Typ gruppieren, nur sichtbare
  const B = world.blocks, box = new THREE.BoxGeometry(1,1,1), dummy = new THREE.Object3D(), anim = [], mats = {};
  const solid = t => t && !(B[t] && (B[t].alpha || B[t].cross));
  const matsFor = t => { if(mats[t]) return mats[t]; const d = B[t];
    const mk = tx => new THREE.MeshLambertMaterial({ map:tx, ...(d.em ? {emissive:0xffffff, emissiveMap:tx, emissiveIntensity:d.em} : {}),
      ...(d.alpha ? {transparent:true, opacity:d.alpha, depthWrite:false} : {}) });
    const side = mk(d.side), top = mk(d.top || d.side), bot = mk(d.bottom || d.top || d.side);
    if(d.anim) anim.push([d.side, d.anim], ...(d.top && d.top!==d.side ? [[d.top, d.anim]] : []));
    return mats[t] = [side,side,top,bot,side,side]; };
  let count = 0;
  let _halo = null; const haloTex = () => _halo || (_halo = (()=>{ const c=document.createElement("canvas"); c.width=c.height=64; const g=c.getContext("2d"), gr=g.createRadialGradient(32,32,0,32,32,32);
    gr.addColorStop(0,"rgba(255,255,255,1)"); gr.addColorStop(.18,"rgba(255,255,255,.75)"); gr.addColorStop(.5,"rgba(255,255,255,.18)"); gr.addColorStop(1,"rgba(255,255,255,0)"); g.fillStyle=gr; g.fillRect(0,0,64,64); return new THREE.CanvasTexture(c); })());
  const addStore = (store, cell, isFar) => { const groups = {}, g = store.get; let minY = 1e9; for(const [, b] of store.V) if(b[1]<minY) minY=b[1];
    for(const [, b] of store.V){ const [x,y,z,t] = b; if(!B[t]) continue;
      const vis = B[t].alpha || !solid(g(x+1,y,z)) || !solid(g(x-1,y,z)) || !solid(g(x,y+1,z)) || (y>minY && !solid(g(x,y-1,z))) || !solid(g(x,y,z+1)) || !solid(g(x,y,z-1));
      if(vis) (groups[t]=groups[t]||[]).push(b); }
    for(const t in groups){ const d = B[t];
      const mesh = new THREE.InstancedMesh(box, matsFor(t), groups[t].length);
      groups[t].forEach((b,i)=>{ dummy.position.set((b[0]+.5)*cell,(b[1]+.5)*cell,(b[2]+.5)*cell); dummy.scale.setScalar((d.scale||1)*cell); dummy.updateMatrix(); mesh.setMatrixAt(i,dummy.matrix); });
      mesh.castShadow = !isFar && !d.em && !d.alpha; mesh.receiveShadow = !isFar && !d.alpha; if(d.alpha) mesh.renderOrder = 2;
      mesh.frustumCulled = false; scene.add(mesh); count += groups[t].length;
      // runder, weicher Lichtschein um Lampen (statt harter Würfelkanten)
      if(d.halo && !isFar){ const pos = new Float32Array(groups[t].length*3); groups[t].forEach((b,i)=>{ pos[i*3]=(b[0]+.5)*cell; pos[i*3+1]=(b[1]+.5)*cell; pos[i*3+2]=(b[2]+.5)*cell; });
        const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.BufferAttribute(pos,3));
        const pm = new THREE.Points(g, new THREE.PointsMaterial({color:d.halo[0], size:d.halo[1], map:haloTex(), transparent:true, opacity:d.halo[2]||.85, depthWrite:false, blending:THREE.AdditiveBlending}));
        pm.frustumCulled = false; pm.renderOrder = 3; scene.add(pm); } } };
  addStore(api.near, 1, false);
  addStore(api.far, world.farCell || api.far.cell || 4, true);
  addStore(api.fine, .5, false);

  // Flächen (Meer, Wolken, Lava)
  for(const s of (world.planes||[])){
    const tx = s.tex ? s.tex.clone() : null; if(tx){ tx.repeat.set(s.repeat||100, s.repeat||100); tx.needsUpdate = true; if(s.anim) anim.push([tx, s.anim]); }
    const m = new THREE.Mesh(new THREE.PlaneGeometry(s.size||400, s.size||400), new THREE.MeshLambertMaterial({ color:s.color||0xffffff, map:tx,
      ...(s.em ? {emissive:0xffffff, emissiveMap:tx, emissiveIntensity:s.em} : {}), ...(s.opacity ? {transparent:true, opacity:s.opacity, depthWrite:false} : {}) }));
    m.rotation.x = -Math.PI/2; m.position.set(world.W/2 + (s.dx||0), s.y, world.D/2 + (s.dz||0)); m.receiveShadow = !s.opacity; scene.add(m);
  }
  // Lichtstrahlen (z. B. unter Wasser)
  const rays = [];
  if(world.rays){ const c=document.createElement("canvas"); c.width=8; c.height=128; const g=c.getContext("2d"), gr=g.createLinearGradient(0,0,0,128);
    gr.addColorStop(0,"rgba(255,255,255,.9)"); gr.addColorStop(1,"rgba(255,255,255,0)"); g.fillStyle=gr; g.fillRect(0,0,8,128);
    const rt = new THREE.CanvasTexture(c), ar = world.rays.area || [0,world.W,0,world.D];
    for(let i=0;i<world.rays.n;i++){ const m=new THREE.Mesh(new THREE.PlaneGeometry(2+api.rand()*4, world.rays.len||70), new THREE.MeshBasicMaterial({map:rt, color:world.rays.color, transparent:true, opacity:.16, blending:THREE.AdditiveBlending, depthWrite:false, side:THREE.DoubleSide, fog:false}));
      m.position.set(ar[0]+api.rand()*(ar[1]-ar[0]), world.rays.y||34, ar[2]+api.rand()*(ar[3]-ar[2])); m.rotation.set(0, api.rand()*Math.PI, .25); m.userData.ph = api.rand()*6; scene.add(m); rays.push(m); } }
  // Lichtkegel (Scheinwerfer an Türmen): weiche, additive Kegel, die langsam schwenken
  const beams = [];
  if(world.beams){ const c=document.createElement("canvas"); c.width=32; c.height=128; const g=c.getContext("2d");
    const gr=g.createLinearGradient(0,0,0,128); gr.addColorStop(0,"rgba(255,255,255,0)"); gr.addColorStop(.25,"rgba(255,255,255,.35)"); gr.addColorStop(1,"rgba(255,255,255,1)"); g.fillStyle=gr; g.fillRect(0,0,32,128);
    const sg=g.createLinearGradient(0,0,32,0); sg.addColorStop(0,"rgba(0,0,0,1)"); sg.addColorStop(.5,"rgba(0,0,0,0)"); sg.addColorStop(1,"rgba(0,0,0,1)"); g.globalCompositeOperation="destination-out"; g.fillStyle=sg; g.fillRect(0,0,32,128);
    const bt = new THREE.CanvasTexture(c);
    for(const b of world.beams){ const geo = new THREE.ConeGeometry(b.w||4, b.len||60, 24, 1, true); geo.translate(0, -(b.len||60)/2, 0);
      const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({map:bt, color:b.color||0xBFF8FF, transparent:true, opacity:b.opacity||.22, blending:THREE.AdditiveBlending, depthWrite:false, side:THREE.DoubleSide, fog:false}));
      const pivot = new THREE.Group(); pivot.position.set(...b.pos); pivot.add(m); m.rotation.x = Math.PI; scene.add(pivot); beams.push({b, pivot, m}); } }
  // Bänder (Polarlicht)
  const ribbons = [];
  for(const r of (world.ribbons||[])){ const m=new THREE.Mesh(new THREE.PlaneGeometry(r.w, r.h, 40, 1), new THREE.MeshBasicMaterial({color:r.color, transparent:true, opacity:r.opacity||.35, blending:THREE.AdditiveBlending, depthWrite:false, side:THREE.DoubleSide, fog:false}));
    m.position.set(...r.pos); m.rotation.y = r.rot||0; m.userData.base = m.geometry.attributes.position.array.slice(); scene.add(m); ribbons.push(m); }

  // Partikel (blink: jedes Teilchen blinkt für sich, z. B. Glühwürmchen)
  const softTex = (() => { const c=document.createElement("canvas"); c.width=c.height=32; const g=c.getContext("2d"), gr=g.createRadialGradient(16,16,0,16,16,16);
    gr.addColorStop(0,"rgba(255,255,255,1)"); gr.addColorStop(.35,"rgba(255,255,255,.75)"); gr.addColorStop(1,"rgba(255,255,255,0)"); g.fillStyle=gr; g.fillRect(0,0,32,32); return new THREE.CanvasTexture(c); })();
  const parts = [];
  for(const p of (world.particles||[])){
    const n = o.lite ? Math.floor(p.n/2) : p.n, pos = new Float32Array(n*3), sp = new Float32Array(n), ph = new Float32Array(n), [x0,x1,y0,y1,z0,z1] = p.area;
    for(let i=0;i<n;i++){ pos[i*3]=x0+api.rand()*(x1-x0); pos[i*3+1]=y0+api.rand()*(y1-y0); pos[i*3+2]=z0+api.rand()*(z1-z0); sp[i]=.5+api.rand(); ph[i]=api.rand()*6.28; }
    const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.BufferAttribute(pos,3));
    const base = new THREE.Color(p.color);
    if(p.blink){ const cc = new Float32Array(n*3); for(let i=0;i<n;i++){ cc[i*3]=base.r; cc[i*3+1]=base.g; cc[i*3+2]=base.b; } g.setAttribute("color", new THREE.BufferAttribute(cc,3)); }
    const m = new THREE.Points(g, new THREE.PointsMaterial({color:p.blink?0xffffff:p.color, vertexColors:!!p.blink, size:p.size||.3, transparent:true, opacity:p.opacity||.9, depthWrite:false,
      ...(p.square ? {} : {map:softTex}), ...(p.add||p.blink?{blending:THREE.AdditiveBlending}:{}) }));
    scene.add(m); parts.push({p, g, sp, ph, m, n, base});
  }
  // Vulkanausbruch: in Schüben fliegen glühende Lavabrocken im Bogen aus dem Krater
  const bombs = [];
  if(world.bombs){ const bw = world.bombs, mat = new THREE.MeshBasicMaterial({color:bw.color||0xFFB040}), geo = new THREE.BoxGeometry(1,1,1);
    for(let i=0;i<(bw.n||16);i++){ const g = new THREE.Group(), m = new THREE.Mesh(geo, mat); m.scale.setScalar((bw.size||1)*(.6+api.rand()*.7)); g.add(m);
      const sp = new THREE.Sprite(new THREE.SpriteMaterial({map:softTex, color:bw.glow||0xFF7A1A, transparent:true, depthWrite:false, blending:THREE.AdditiveBlending, opacity:.9})); sp.scale.setScalar((bw.size||1)*(bw.glowSize||3)); g.add(sp);
      const a = api.rand()*Math.PI*2, hs = (bw.speed||[6,14])[0] + api.rand()*((bw.speed||[6,14])[1]-(bw.speed||[6,14])[0]), vs = (bw.up||[14,22])[0] + api.rand()*((bw.up||[14,22])[1]-(bw.up||[14,22])[0]);
      g.userData = {v:[Math.cos(a)*hs, vs, Math.sin(a)*hs*.8 + (bw.biasZ||0)], off: api.rand()*(bw.burst||1.6), spin: api.rand()*4}; g.visible = false; scene.add(g); bombs.push(g); }
    if(bw.light){ const L = new THREE.PointLight(bw.light[0], 0, bw.light[2]||80, 2); L.position.set(...bw.pos); scene.add(L); bombs.light = L; } }
  // Rauch / Wolkenschwaden / Nebel
  const puffs = [];
  if(world.puffs){ const pt = softTex;
    for(const pf of world.puffs) for(let i=0;i<pf.n;i++){ const s=new THREE.Sprite(new THREE.SpriteMaterial({map:pt, color:pf.color, transparent:true, depthWrite:false, opacity:pf.opacity||.5, ...(pf.add?{blending:THREE.AdditiveBlending}:{}) }));
      s.userData = {pf, t:i/pf.n, ox:api.rand(), oz:api.rand()}; scene.add(s); puffs.push(s); } }

  // Tiere: Teile mit Drehpunkt, die sich bewegen (Flügel, Schwanz, Kopf)
  const creatures = [];
  const legacy = (world.movers||[]).map(mv=>({ parts:[{cubes:mv.cubes.map(([x,y,z,c,em])=>[x,y,z,c,em])}], orbit:{c:mv.center, r:mv.radius, speed:mv.speed, ph:mv.ph, bob:mv.bob, legacyFace:mv.face||0}, scale:mv.scale }));
  for(const cr of (world.creatures||[]).concat(legacy)){
    if(o.noFly && cr.orbit && cr.orbit.wander) continue;
    const outer = new THREE.Group(); outer.rotation.order = "YXZ"; const inner = new THREE.Group(); inner.scale.setScalar(cr.scale||1); outer.add(inner);
    const movers = [];
    for(const pt of cr.parts){ const pg = new THREE.Group(), piv = pt.pivot || [0,0,0]; pg.position.set(...piv);
      const plain = pt.cubes.filter(c=>!c[4]), glow = pt.cubes.filter(c=>c[4]);
      if(plain.length){ const m = new THREE.Mesh(cubesGeo(plain, piv), new THREE.MeshLambertMaterial({vertexColors:true})); m.castShadow = !o.lite && !cr.noShadow; pg.add(m); }
      if(glow.length){ const m = new THREE.Mesh(cubesGeo(glow, piv), new THREE.MeshBasicMaterial({vertexColors:true})); pg.add(m); }
      (pt.parent !== undefined ? movers[pt.parent].g : inner).add(pg);
      if(pt.parent !== undefined){ const pp = cr.parts[pt.parent].pivot || [0,0,0]; pg.position.set(piv[0]-pp[0], piv[1]-pp[1], piv[2]-pp[2]); }
      movers.push({g:pg, rot:pt.rot, gait:!!pt.gait}); }
    if(cr.at){ outer.position.set(...cr.at); outer.rotation.y = cr.yaw||0; }
    scene.add(outer); creatures.push({cr, outer, movers});
  }

  // Sicherheits-Höhenfeld für frei fliegende Tiere: höchster Block in der Umgebung (+ Spannweite), weich geglättet
  const safeFields = new Map();
  function safeField(R){ if(safeFields.has(R)) return safeFields.get(R);
    const pad = R+12, x0 = -pad-60, z0 = -pad-60, X = world.W+2*pad+120, Z = world.D+2*pad+120, top = new Float32Array(X*Z).fill(-50);
    const put = (x,z,y) => { const i=Math.round(x)-x0, k=Math.round(z)-z0; if(i>=0&&k>=0&&i<X&&k<Z){ const j=k*X+i; if(y>top[j]) top[j]=y; } };
    for(const [, b] of api.near.V){ if(B[b[3]] && B[b[3]].soft) continue; put(b[0], b[2], b[1]+1); }
    for(const [, b] of api.fine.V){ if(B[b[3]] && B[b[3]].soft) continue; put(b[0]/2, b[2]/2, (b[1]+1)/2); }
    const fc = world.farCell || api.far.cell || 4; for(const [, b] of api.far.V) for(let a=0;a<fc;a++) for(let c=0;c<fc;c++) put(b[0]*fc+a, b[2]*fc+c, (b[1]+1)*fc);
    const maxPass = (src, r, horiz) => { const out = new Float32Array(src.length);
      for(let k=0;k<Z;k++) for(let i=0;i<X;i++){ let m=-50; for(let d=-r; d<=r; d++){ const ii = horiz ? i+d : i, kk = horiz ? k : k+d; if(ii<0||kk<0||ii>=X||kk>=Z) continue; const v=src[kk*X+ii]; if(v>m) m=v; } out[k*X+i]=m; } return out; };
    const box = (src, r, horiz) => { const out = new Float32Array(src.length);
      for(let k=0;k<Z;k++) for(let i=0;i<X;i++){ let sum=0, n=0; for(let d=-r; d<=r; d++){ const ii = horiz ? i+d : i, kk = horiz ? k : k+d; if(ii<0||kk<0||ii>=X||kk>=Z) continue; sum+=src[kk*X+ii]; n++; } out[k*X+i]=sum/n; } return out; };
    let f = maxPass(maxPass(top, R+6, true), R+6, false); f = box(box(f, 6, true), 6, false);
    const get = (x,z) => { const i=Math.round(x)-x0, k=Math.round(z)-z0; if(i<0||k<0||i>=X||k>=Z) return -50; return f[k*X+i]; };
    safeFields.set(R, get); return get; }
  for(const c of creatures) if(c.cr.orbit && c.cr.orbit.wander) c.safe = safeField(Math.round(c.cr.orbit.wander.span || 12));

  // Prüfung (nur im Testmodus): kommt ein Bodentier mit seiner Bahn einem Block zu nahe?
  if(o.still){ window.__pathHits = [];
    creatures.forEach((c,ci)=>{ const ob=c.cr.orbit; if(!ob || !ob.cycle || ob.wander) return; const [cx,cy,cz]=ob.c, [rx,rz]=ob.r, rad=c.cr.clearR||3; let hits=0; const types={};
      for(let k=0;k<240;k++){ const t=k/240*Math.PI*2, x=cx+Math.cos(t)*rx, z=cz+Math.sin(t)*rz;
        let hit=false; for(let a=-rad;a<=rad&&!hit;a++) for(let b=-rad;b<=rad&&!hit;b++) for(let y=Math.ceil(cy);y<cy+(c.cr.clearH||5)&&!hit;y++) if(a*a+b*b<=rad*rad && api.near.get(Math.round(x+a),y,Math.round(z+b))){ hit=true; const tp=api.near.get(Math.round(x+a),y,Math.round(z+b)); types[tp]=(types[tp]||0)+1; }
        if(hit) hits++; }
      window.__pathHits.push([ci, hits, JSON.stringify(types)]); }); }

  // Leuchten
  let composer = null;
  if(world.bloom && !o.lite){ composer = new EffectComposer(renderer); composer.addPass(new RenderPass(scene, cam));
    composer.addPass(new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), world.bloom[0], world.bloom[1], world.bloom[2])); composer.addPass(new OutputPass()); }

  // Beschriftungen
  const spots = world.spots, labels = {};
  for(const k in spots){ if(!o.names[k]) continue;
    const s = spots[k], el = document.createElement("button"); el.className = "wlbl"; el.dataset.kat = k; el.type = "button";
    el.innerHTML = `<span class="wl-ic" aria-hidden="true">${o.icons[k]||""}</span><span class="wl-t">${o.names[k]}</span><span class="wl-n${o.counts[k]?"":" z"}">${o.counts[k]||0}</span>`;
    el.setAttribute("aria-label", `${o.names[k]}: ${o.counts[k]||0}`); o.labelHost.appendChild(el);
    labels[k] = {el, v:new THREE.Vector3(s.top[0]+.5, s.top[1]+ (s.lift ?? 3), s.top[2]+.5)};
    // Lichtsäule
    if(s.beam !== false){ const m=new THREE.Mesh(new THREE.CylinderGeometry(.28,.28,60,10,1,true), new THREE.MeshBasicMaterial({color:s.col||0xffffff, transparent:true, opacity:.18, depthWrite:false, blending:THREE.AdditiveBlending}));
      m.position.set(s.top[0]+.5, s.top[1]+31, s.top[2]+.5); scene.add(m); labels[k].beam = m; }
  }
  o.labelHost.addEventListener("click", e=>{ const b=e.target.closest(".wlbl"); if(b) o.onSelect(b.dataset.kat); });

  // Kamera
  const homeFor = () => (cam.aspect < 1 && world.homePortrait) ? world.homePortrait : world.home;
  const curPos = new THREE.Vector3(...homeFor().pos), curLook = new THREE.Vector3(...homeFor().look);
  let from=null, to=null, t0=0, dur=1, focus=null, running=false, frames=0;
  const ease = t => t<.5 ? 4*t*t*t : 1-Math.pow(-2*t+2,3)/2;
  const fly = (pos, look, d=1.5) => { from={pos:curPos.clone(), look:curLook.clone()}; to={pos:new THREE.Vector3(...pos), look:new THREE.Vector3(...look)}; t0=performance.now(); dur=o.still ? 1 : d*1000; wake(); };
  function focusOn(k){ const s = spots[k]; focus = k;
    const c = s.cam || {}, dist = c.dist || 26, side = c.side ?? -.3, up = c.up ?? .5, portrait = cam.aspect < 1;
    const dd = portrait ? dist*1.45 : dist, lookShift = portrait ? 0 : (o.banner ? -dist*.2 : dist*.28), drop = portrait ? dd*.32 : 0;
    if(c.pos){ const L = portrait ? [s.top[0], c.look[1]-4, s.top[2]] : o.banner ? [s.top[0]+(s.top[0]-c.look[0])*.5, c.look[1], s.top[2]+(s.top[2]-c.look[2])*.5] : c.look, f = portrait ? 1.5 : 1; fly(L.map((v,i)=>v+(c.pos[i]-c.look[i])*f), L); }
    else fly([s.top[0]+dd*side, (c.y ?? s.base ?? s.top[1]*.6) + dd*up, s.top[2]+dd], [s.top[0]+lookShift, (c.lookY ?? (s.base ?? s.top[1]*.6)+4) - drop, s.top[2]]);
    for(const j in labels) labels[j].el.classList.toggle("hide", j!==k); }
  function goHome(){ focus = null; for(const j in labels) labels[j].el.classList.remove("hide"); fly(homeFor().pos, homeFor().look); }

  const v = new THREE.Vector3(); let last = performance.now();
  const reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  const clock0 = performance.now();
  function frame(now){
    if(o.still && !to && frames > 2){ running = false; return; }
    requestAnimationFrame(frame); frames++; const dt = Math.min(.05, (now-last)/1000); perf(Math.min(.2,(now-last)/1000)); last = now;
    const tt = o.still ? (o.stillTime || 12) : (now-clock0)/1000;
    if(to){ const p=Math.min(1,(now-t0)/dur), e=ease(p); curPos.lerpVectors(from.pos,to.pos,e); curLook.lerpVectors(from.look,to.look,e); if(p>=1){ to=null; frames=0; } }
    const sway = (focus || reduce || o.still) ? 0 : Math.sin(now/5200)*2;
    cam.position.set(curPos.x+sway, curPos.y, curPos.z); cam.lookAt(curLook);
    for(const [tx,[ax,ay]] of anim) tx.offset.set(now*ax/1000, now*ay/1000);
    for(const pp of parts){ const a=pp.g.attributes.position.array, p=pp.p, [x0,x1,y0,y1,z0,z1]=p.area;
      for(let i=0;i<pp.n;i++){ const k3=i*3;
        a[k3+1] += p.vy*pp.sp[i]*dt; a[k3] += (p.wob||0)*Math.sin(now/900+i)*dt; a[k3+2] += (p.wob||0)*Math.cos(now/1100+i)*dt*.6;
        if(p.vy>0 && a[k3+1]>y1){ a[k3+1]=y0; a[k3]=x0+Math.random()*(x1-x0); a[k3+2]=z0+Math.random()*(z1-z0); }
        if(p.vy<0 && a[k3+1]<y0){ a[k3+1]=y1; a[k3]=x0+Math.random()*(x1-x0); a[k3+2]=z0+Math.random()*(z1-z0); }
        if(p.vy===0){ a[k3+1] += Math.sin(now/1300+i*1.7)*dt*.4; } }
      pp.g.attributes.position.needsUpdate = true;
      if(p.blink){ const c=pp.g.attributes.color.array; for(let i=0;i<pp.n;i++){ const b=Math.max(0, Math.sin(tt*(p.blink||1.4)*pp.sp[i]+pp.ph[i])); const f=b*b*1.2+.05; c[i*3]=pp.base.r*f; c[i*3+1]=pp.base.g*f; c[i*3+2]=pp.base.b*f; } pp.g.attributes.color.needsUpdate = true; }
      else if(p.twinkle) pp.m.material.opacity = (p.opacity||.9)*(.65+.35*Math.sin(now/400)); }
    for(const s of puffs){ const pf=s.userData.pf; s.userData.t=(s.userData.t+dt*(pf.speed||.05))%1; const t=s.userData.t;
      s.position.set(pf.pos[0]+(pf.dx||0)*t+Math.sin(t*6+s.userData.ox*9)*(pf.spread||2), pf.pos[1]+(pf.dy||0)*t + (pf.ry? (s.userData.oz-.5)*pf.ry : 0), pf.pos[2]+(pf.dz||0)*t+s.userData.ox*(pf.spread||2)*(pf.sz||1));
      const sc=(pf.s0||4)+t*(pf.s1||12); s.scale.set(sc,sc*(pf.flat||1),1); s.material.opacity=(pf.opacity||.5)*Math.sin(Math.PI*t); }
    if(bombs.length){ const bw = world.bombs, P = bw.period||10, g = bw.g||-16, life = bw.life||4; let flash = 0;
      for(const b of bombs){ const u = b.userData, ph = (tt - u.off) % P, s = ph < 0 ? ph + P : ph;
        if(s < life){ const y = bw.pos[1] + u.v[1]*s + .5*g*s*s; b.visible = y > (bw.floor ?? 0); b.position.set(bw.pos[0]+u.v[0]*s, y, bw.pos[2]+u.v[2]*s); b.children[0].rotation.set(s*u.spin, s*u.spin*.7, 0); }
        else b.visible = false; }
      { const s0 = ((tt % P) + P) % P; flash = s0 < 2.2 ? Math.sin(s0/2.2*Math.PI) : 0; }
      if(bombs.light) bombs.light.intensity = bw.light[1]*flash; }
    for(const r of rays){ r.material.opacity = .08 + .08*Math.sin(now/1500 + r.userData.ph); }
    for(const {b, pivot, m} of beams){ const tb = o.still ? (o.stillTime||12) : (now-clock0)/1000, ph=b.ph||0, sp=b.speed||.25;
      pivot.rotation.z = (b.tilt??.35)*Math.sin(tb*sp+ph); pivot.rotation.x = (b.tilt??.35)*.6*Math.cos(tb*sp*.8+ph); m.material.opacity = (b.opacity||.22)*(.75+.25*Math.sin(tb*1.3+ph*2)); }
    for(const r of ribbons){ const a=r.geometry.attributes.position.array, b=r.userData.base; for(let i=0;i<a.length;i+=3){ a[i+2]=b[i+2]+Math.sin(now/1600+b[i]*.08)*3; a[i+1]=b[i+1]+Math.sin(now/2100+b[i]*.05)*1.2; } r.geometry.attributes.position.needsUpdate=true; }
    for(const {cr, outer, movers, safe:sf} of creatures){
      let move = 1;
      if(cr.orbit){ const ob=cr.orbit, [cx,cy,cz]=ob.c, [rx,rz]=ob.r;
        // cycle: [Periode, Anteil Laufen, Versatz] – das Tier läuft nur einen Teil der Zeit und steht sonst
        let et = tt;
        if(ob.cycle){ const [P, fr, off=0] = ob.cycle, R = P*fr, x = tt + off, k = Math.floor(x/P), f = x - k*P;
          if(f < R){ const u = f/R; et = k*R + R*(u - Math.sin(2*Math.PI*u)/(2*Math.PI)); move = (1-Math.cos(2*Math.PI*u))/2; } else { et = (k+1)*R; move = 0; } }
        const t=et*(ob.speed||.1)*(ob.dir||1)+(ob.ph||0);
        if(ob.wander){
          // abwechslungsreicher Flug: Abstand, Höhe und Bahnform ändern sich langsam (Achter, Schleifen, nah heran, weit weg)
          const P = th => { const w=ob.wander, a=th*w.f, f = 1 + w.r*Math.sin(a+.7) + w.r*.5*Math.sin(a*2.3+1.9);
            const eight = w.eight ? Math.sin(th*2)*w.eight*(.5+.5*Math.sin(a*1.3)) : 0;
            return [cx + Math.cos(th)*rx*f + Math.sin(a*1.7)*(w.dx||0), cy + Math.sin(a*1.4+.3)*(w.y||0) + Math.sin(th*2)*(ob.bob??.6), cz + Math.sin(th)*rz*f + eight + Math.cos(a*1.1)*(w.dz||0)]; };
          const lift = q => { if(sf){ const m = sf(q[0], q[2]) + (ob.wander.clear ?? 10); if(q[1] < m) q[1] = m; } return q; };
          const dir = ob.dir||1, p0 = lift(P(t)), pa = lift(P(t + .09*dir)), pb = lift(P(t + .18*dir));
          // Ziele aus weiter vorausliegenden Punkten, danach weich nachgeführt – keine Ruckler bei Richtungswechseln
          const hA = Math.atan2(-(pa[2]-p0[2]), pa[0]-p0[0]), hB = Math.atan2(-(pb[2]-pa[2]), pb[0]-pa[0]);
          let turn = hB-hA; if(turn>Math.PI) turn-=2*Math.PI; if(turn<-Math.PI) turn+=2*Math.PI;
          const tBank = Math.max(-.5, Math.min(.5, -turn*2.2)), tPitch = Math.max(-.3, Math.min(.3, Math.atan2(pa[1]-p0[1], Math.hypot(pa[0]-p0[0], pa[2]-p0[2]))));
          const st = cr._s || (cr._s = {y:p0[1], yaw:hA, bank:tBank, pitch:tPitch});
          const k = o.still ? 1 : 1-Math.exp(-dt*1.6), kr = o.still ? 1 : 1-Math.exp(-dt*2.2);
          st.y += (p0[1]-st.y)*k;
          let dy = hA - st.yaw; while(dy>Math.PI) dy-=2*Math.PI; while(dy<-Math.PI) dy+=2*Math.PI; st.yaw += dy*kr;
          st.bank += (tBank-st.bank)*k; st.pitch += (tPitch-st.pitch)*k;
          outer.position.set(p0[0], st.y, p0[2]);
          outer.rotation.y = st.yaw; outer.rotation.x = st.bank; outer.rotation.z = st.pitch;
          // in Wolken ganz verschwinden: weich ausblenden, solange die Mitte in einer Wolke steckt
          if(cr.cloudHide){ const g = api.near.get, cxp=Math.round(p0[0]), cyp=Math.round(st.y), czp=Math.round(p0[2]); let n=0;
            for(let a=-2;a<=2;a+=2) for(let b=-2;b<=2;b+=2) for(let c=-2;c<=2;c+=2) if(g(cxp+a,cyp+b,czp+c)===cr.cloudHide) n++;
            const tv = n>=6 ? 0 : 1; st.op = st.op ?? 1; st.op += (tv-st.op)*(o.still?1:1-Math.exp(-dt*5));
            outer.visible = st.op > .03; outer.traverse(m=>{ if(m.material){ m.material.transparent = st.op<.99; m.material.opacity = st.op; } }); }
        } else {
        outer.position.set(cx+Math.cos(t)*rx, cy+Math.sin(t*2)*(ob.bob??.6)*move, cz+Math.sin(t)*rz);
        if(ob.legacyFace!==undefined) outer.rotation.y = -t + ob.legacyFace;
        else { const vx=-Math.sin(t)*rx*(ob.dir||1), vz=Math.cos(t)*rz*(ob.dir||1); outer.rotation.y = Math.atan2(-vz, vx); outer.rotation.x = (ob.bank||0)*(ob.dir||1)*move; outer.rotation.z = (ob.pitch||0)*Math.cos(t*2); } } }
      else if(cr.pass){ // Vorbeiflug von a nach b, nur während des Flugs sichtbar (z. B. Fledermausschwarm)
        const p=cr.pass, P=p.period||30, x=(tt+(p.ph||0))%P, u=x/p.dur;
        outer.visible = u < 1;
        if(u < 1){ const w=p.wave||[0,1], a=p.a, b=p.b, dx=b[0]-a[0], dz=b[2]-a[2];
          outer.position.set(a[0]+dx*u, a[1]+(b[1]-a[1])*u + Math.sin(u*Math.PI*2*w[1]+(p.wph||0))*w[0], a[2]+dz*u + Math.cos(u*Math.PI*2*w[1]*.7+(p.wph||0))*w[0]*.6);
          outer.rotation.y = Math.atan2(-dz, dx); } }
      else if(cr.at && cr.hover){ outer.position.y = cr.at[1] + Math.sin(tt*(cr.hover[1]||1))*cr.hover[0]; }
      for(const m of movers){ if(!m.rot) continue; const [ax,amp,spd,ph=0,base=0] = m.rot; m.g.rotation[ax] = base + amp*(m.gait?move:1)*Math.sin(tt*spd+ph); } }
    for(const l of pls) if(l.userData.flicker){ const fs = typeof l.userData.flicker==="number" ? l.userData.flicker : 120, fa = fs>300 ? .35 : .15; l.intensity = l.userData.int*(1-fa+fa*Math.sin(now/fs+l.position.x)); }
    for(const k in labels){ const L=labels[k]; if(L.beam) L.beam.material.opacity = (focus && focus!==k) ? .03 : .14 + .05*Math.sin(now/600+k.length); }
    composer ? composer.render() : renderer.render(scene, cam);
    // Beschriftungen: nicht unter Kopfleiste/Dock, nicht übereinander
    const topEl = document.querySelector(".wbar"), dockEl = document.querySelector(".wdock");
    const minY = (topEl ? topEl.getBoundingClientRect().bottom : 0) + 6, maxY = (dockEl ? dockEl.getBoundingClientRect().top : innerHeight) - 14;
    const placed = [], list = [];
    for(const k in labels){ const L=labels[k]; v.copy(L.v).project(cam); L.w = L.el.offsetWidth || L.w || 160; L.h = L.el.offsetHeight || 44;
      list.push({L, vis: v.z < 1, x: Math.min(innerWidth-L.w/2-8, Math.max(L.w/2+8, (v.x+1)/2*innerWidth)), y: (1-v.y)/2*innerHeight}); }
    list.sort((a,b)=>a.y-b.y);
    for(const it of list){ const {L} = it; let y = Math.min(maxY, Math.max(minY + L.h, it.y));
      for(let guard=0; guard<6; guard++){ const hit = placed.find(p => Math.abs(p.x-it.x) < (p.w+L.w)/2+4 && y > p.y-p.h-4 && y-L.h < p.y+4); if(!hit) break; y = hit.y + L.h + 6; if(y > maxY){ y = hit.y - hit.h - 6; } }
      if(!L.el.classList.contains("hide")) placed.push({x:it.x, y, w:L.w, h:L.h});
      L.el.style.transform = `translate(${it.x.toFixed(1)}px, ${y.toFixed(1)}px) translate(-50%,-100%)`; L.el.style.visibility = it.vis?"visible":"hidden"; }
    if(o.still && !to && frames > 2) window.__stillDone = (window.__stillDone||0) + 1;
  }
  // Läuft es auf einem älteren iPad zu langsam, schalten wir Schatten und Leuchten automatisch ab
  let perfN = 0, perfT = 0, degraded = !!o.lite;
  function perf(dt){ if(degraded || o.still) return; perfN++; if(perfN>20 && perfN<=110) perfT += dt; if(perfN===110 && perfT/90 > 1/24){ degraded = true;
      renderer.shadowMap.enabled = false; scene.traverse(m=>{ if(m.material){ (Array.isArray(m.material)?m.material:[m.material]).forEach(mt=>mt.needsUpdate=true); } });
      composer = null; renderer.setPixelRatio(1); renderer.setSize(innerWidth, innerHeight); } }
  function wake(){ if(!running){ running = true; frames = 0; requestAnimationFrame(frame); } }
  function resize(){ renderer.setSize(innerWidth, innerHeight); if(composer) composer.setSize(innerWidth, innerHeight); cam.aspect = innerWidth/innerHeight; cam.updateProjectionMatrix();
    if(!focus && !to){ curPos.set(...homeFor().pos); curLook.set(...homeFor().look); } wake(); }
  addEventListener("resize", resize); resize();
  return { focus:focusOn, home:goHome, count, renderer };
}
