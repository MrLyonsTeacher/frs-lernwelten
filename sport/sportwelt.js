/* FRS Lernwelten – Sport-Klassenwelten (gemalte Welten mit Kameraflug).
   Eine Klassenwelt ruft SPORTWELT.start({...}) mit ihren Orten auf (siehe sport/klasse8.html, klasse9.html).
   Ebenen: Übersicht → Ort (Nahbild) → optional Gebäude (Nahbild). Antippen = Kameraflug, Ziehen = umschauen.
   Freigabe: Lehrkraft erzeugt auf der Startseite (🔑) einen QR-Code; Schlüssel der Klasse = 100 + Klassenstufe (z. B. 109).
   Ohne Freigabe-Code gilt „offen:true“ aus der Konfiguration. Vorschau für Lehrkräfte: ?alle=1 öffnet alles. */
(function(){
const W = 1536, H = 1024;
const $ = s => document.querySelector(s), ALLE = /[?&]alle=1/.test(location.search);
const pct = (v, n) => (v / n * 100).toFixed(2) + "%", rnd = (a, b) => a + Math.random() * (b - a);
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const esc = v => String(v ?? "").replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
let C, K, ORTE;

/* ---------- Freigabe ---------- */
const frei = () => !!(window.FREI && FREI.state(K));
const offen = o => ALLE || (frei() ? !FREI.locked(K, o.id) : !!o.offen);
const tOffen = t => ALLE || (!!t.pfad && !(frei() && FREI.lockedThema(K, t.id)));

/* ---------- Effekte (SVG über dem Bild) ---------- */
let gid = 0;
function fxSVG(list, veils){
  let defs = "", out = "";
  const grad = (col, o=1) => { const id = "g" + (++gid); defs += `<radialGradient id="${id}"><stop offset="0" stop-color="${col}" stop-opacity="${o}"/><stop offset="1" stop-color="${col}" stop-opacity="0"/></radialGradient>`; return id; };
  (list || []).forEach(f => { const k = f[0];
    if(k === "glow") out += `<circle class="${f[5]}" cx="${f[1]}" cy="${f[2]}" r="${f[3]}" fill="url(#${grad(f[4],.9)})"/>`;
    if(k === "sun"){ out += `<circle class="sunr" cx="${f[1]}" cy="${f[2]}" r="170" fill="url(#${grad("#FFD9A0",.85)})"/><circle class="sunr" cx="${f[1]}" cy="${f[2]}" r="60" fill="url(#${grad("#FFF4D6",.9)})" style="animation-duration:4s"/>`;
      if(f[3] !== false) for(let i=0;i<9;i++) out += `<ellipse class="gl" cx="${(f[1]+rnd(-30,30)).toFixed(0)}" cy="${(f[2]+24+i*17+rnd(-4,4)).toFixed(0)}" rx="${rnd(14,34).toFixed(0)}" ry="2.6" fill="#FFE2B0" style="animation-delay:${rnd(0,4).toFixed(2)}s;animation-duration:${rnd(2.6,4.2).toFixed(2)}s"/>`; }
    if(k === "clouds") for(let i=0;i<5;i++) out += `<ellipse class="cl" cx="${rnd(150,1400).toFixed(0)}" cy="${rnd(14,f[1]).toFixed(0)}" rx="${rnd(120,230).toFixed(0)}" ry="${rnd(14,26).toFixed(0)}" fill="url(#${grad(i%2?"#FFB8C8":"#C9A6FF",.55)})" style="animation-duration:${rnd(30,55).toFixed(0)}s;animation-delay:-${rnd(0,30).toFixed(0)}s"/>`;
    if(k === "smoke") for(let i=0;i<4;i++) out += `<circle class="puff" cx="${f[1]}" cy="${f[2]}" r="${f[3]||18}" fill="url(#${grad("#FFFFFF",.75)})" style="animation-delay:${(i*1.25).toFixed(2)}s"/>`;
    if(k === "blink") out += `<circle class="blink" cx="${f[1]}" cy="${f[2]}" r="7" fill="#FF3B3B"/><circle class="blink" cx="${f[1]}" cy="${f[2]}" r="26" fill="url(#${grad("#FF3B3B",.8)})"/>`;
    if(k === "sparks") for(let i=0;i<f[2];i++) out += `<circle class="tw" cx="${rnd(f[1][0],f[1][2]).toFixed(0)}" cy="${rnd(f[1][1],f[1][3]).toFixed(0)}" r="${rnd(2,4.5).toFixed(1)}" fill="${f[3]}" style="animation-delay:${rnd(0,2.6).toFixed(2)}s;animation-duration:${rnd(.7,1.6).toFixed(2)}s"/>`;
    if(k === "water") for(let i=0;i<f[2];i++) out += `<ellipse class="gl" cx="${rnd(f[1][0],f[1][2]).toFixed(0)}" cy="${rnd(f[1][1],f[1][3]).toFixed(0)}" rx="${rnd(9,22).toFixed(0)}" ry="2.2" fill="#FFE9C9" style="animation-delay:${rnd(0,4).toFixed(2)}s;animation-duration:${rnd(2.4,4.5).toFixed(2)}s"/>`;
    if(k === "flies") for(let i=0;i<f[2];i++) out += `<circle class="fly" cx="${rnd(f[1][0],f[1][2]).toFixed(0)}" cy="${rnd(f[1][1],f[1][3]).toFixed(0)}" r="3" fill="#FFF2B0" style="animation-delay:${rnd(0,9).toFixed(2)}s;animation-duration:${rnd(6,11).toFixed(2)}s"/>`;
    if(k === "fire"){ const [x,y,r] = [f[1],f[2],f[3]||60]; out += `<circle class="flick" cx="${x}" cy="${y}" r="${r*2.2}" fill="url(#${grad("#FF9A3C",.85)})" style="animation-duration:.9s"/><circle class="beat" cx="${x}" cy="${y}" r="${r}" fill="url(#${grad("#FFD36A",.9)})" style="animation-duration:1.4s"/>`;
      for(let i=0;i<7;i++) out += `<circle class="ember" cx="${(x+rnd(-r*.4,r*.4)).toFixed(0)}" cy="${(y-r*.2).toFixed(0)}" r="${rnd(1.6,3.2).toFixed(1)}" fill="#FFB347" style="animation-delay:${rnd(0,2.4).toFixed(2)}s;animation-duration:${rnd(1.6,2.8).toFixed(2)}s"/>`; }
    if(k === "beam"){ const [x,y,len] = [f[1],f[2],f[3]||420]; out += `<path class="beam" d="M${x} ${y} L${x-len} ${y-len*.22} L${x-len} ${y+len*.22} Z" fill="url(#${grad("#FFF1B8",.8)})" style="transform-box:view-box;transform-origin:${x}px ${y}px"/><circle class="beat" cx="${x}" cy="${y}" r="${len*.16}" fill="url(#${grad("#FFF1B8",.95)})" style="animation-duration:3s"/>`; }
  });
  let v = "";
  (veils || []).forEach(([x,y,rx,ry]) => { if(rx) v += `<ellipse class="fog" cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="url(#${grad(C.nebel||"#241A4A",1)})"/><ellipse cx="${x}" cy="${y}" rx="${rx*.8}" ry="${ry*.8}" fill="url(#${grad(C.nebel||"#241A4A",.9)})"/>`; });
  return `<svg class="veil" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" aria-hidden="true"><defs>${defs}</defs>${v}</svg>
          <svg class="fx" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" aria-hidden="true" style="mix-blend-mode:screen"><defs>${defs}</defs>${out}</svg>`;
}
const spotHTML = (id, x, y, icon, name, sub, zu) => `<button class="spot${zu?" zu":""}" data-id="${id}" style="left:${pct(x,W)};top:${pct(y,H)}"><span class="pin" aria-hidden="true">${zu?"🔒":icon}</span><span class="lbl">${esc(name)}${sub?`<small>${esc(sub)}</small>`:""}</span></button>`;
function toast(t, ms){ const el = $("#toast"); el.textContent = t; el.classList.add("on"); clearTimeout(toast.t); toast.t = setTimeout(() => el.classList.remove("on"), ms || 2200); }
const img = (n, alt) => `<img src="${C.dir}/${n}.webp" alt="${esc(alt)}" draggable="false">`;

/* ---------- Gerüst ---------- */
function geruest(){
  document.body.innerHTML = `
<div class="top">
  <button class="tb" id="back" hidden></button>
  <a class="tb" id="home" href="../index.html" aria-label="Zur Startseite">🏠</a>
  <div><h1 id="ttl"></h1></div><span class="sub" id="sub"></span>
  <span class="sp"></span>
</div>
<div class="stage" id="stage">
  <div class="frame" id="fOver"><div class="pan"><div class="cam"><div class="drift" id="dOver"></div></div></div></div>
  <div class="frame" id="fDet" hidden><div class="pan"><div class="cam"><div class="drift" id="dDet"></div></div></div></div>
  <div class="frame" id="fSub" hidden><div class="pan"><div class="cam"><div class="drift" id="dSub"></div></div></div></div>
  <div class="dock" id="dock"></div>
  <div class="card" id="card" hidden></div>
</div>
<div class="toast" id="toast" role="status"></div>
<div class="fade" id="fade"></div>`;
}
const START = () => `${C.untertitel} · Ziehen = umschauen · Tippen = hinfliegen`;

/* ---------- Übersicht ---------- */
function drawOver(){
  $("#dOver").innerHTML = img(C.uebersicht, C.name) +
    fxSVG(C.fx, ORTE.filter(o => !offen(o)).map(o => [o.x, o.y - 10, (o.veil||[150,100])[0], (o.veil||[150,100])[1]])) +
    ORTE.map(o => spotHTML(o.id, o.x, o.y, o.icon, o.name, (o.einheit||"").split(" · ")[0], !offen(o))).join("");
  $("#dock").innerHTML = ORTE.map(o => `<button class="th${offen(o)?"":" zu"}" data-id="${o.id}"><span class="i">${offen(o)?o.icon:"🔒"}</span><span><b>${esc(o.name)}</b><span class="s">${esc(o.einheit||"")}</span></span></button>`).join("");
}
/* ---------- Ort und Gebäude ---------- */
let cur = null, sub = null, busy = false;
const org = o => `${pct(o.x,W)} ${pct(o.y,H)}`;
function drawDet(o){
  const spots = o.themen.filter(t => t.x);
  $("#dDet").innerHTML = img(o.bild || o.id, o.name) +
    fxSVG(o.fx, spots.filter(t => !tOffen(t) && t.veil).map(t => [t.x, t.y, t.veil[0], t.veil[1]])) +
    spots.map(t => spotHTML("t" + o.themen.indexOf(t), t.x, t.y, t.i, t.s, "", !tOffen(t))).join("");
}
function cardDet(o){
  $("#card").innerHTML = `<h2>${o.icon} ${esc(o.name)}</h2><p class="e">${esc(o.einheit||"")}</p><p>${esc(o.text||"")}</p>` +
    o.themen.map((t, i) => `<button class="th${tOffen(t)?"":" zu"}" data-id="t${i}"><span class="i">${tOffen(t)?t.i:"🔒"}</span><span><b>${esc(t.t)}</b><span class="s">${t.pfad && tOffen(t) ? esc(t.s || "Lernwelt öffnen") : t.pfad ? "noch gesperrt" : "kommt bald"}</span></span></button>`).join("");
}
function cardSub(t){
  $("#card").innerHTML = `<h2>${t.i} ${esc(t.s)}</h2><p class="e">${esc(t.t)}</p><p>${esc(t.text||"")}</p>` +
    (t.pfad ? `<button class="th go" data-go="1"><span class="i">▶</span><span><b>Lernwelt starten</b><span class="s">Infokarten und Spiele</span></span></button>` : `<div class="th zu"><span class="i">🔒</span><span><b>Kommt bald</b><span class="s">Diese Lernwelt wird noch gebaut.</span></span></div>`);
}
function head(back, ttl, subt){ $("#back").hidden = !back; $("#back").textContent = back ? "← " + back : ""; $("#home").hidden = !!back; $("#ttl").textContent = ttl; $("#sub").textContent = subt; }
function anim(el, cls, origin){ const c = el.querySelector(".cam"); c.style.transformOrigin = origin || "50% 50%"; c.classList.remove("fly-out","fly-in","back-out","back-in"); void c.offsetWidth; c.classList.add(cls); return c; }
function flug(von, nach, origin, instant, fertig){
  nach.hidden = false; zeige(nach, null); const done = () => { von.hidden = true; busy = false; fertig(); };
  if(instant || reduced){ done(); return; } busy = true; anim(von, "fly-out", origin); anim(nach, "fly-in"); setTimeout(done, 700);
}
function rueck(von, nach, origin, fertig){
  nach.hidden = false; const done = () => { von.hidden = true; busy = false; nach.querySelector(".cam").classList.remove("back-in","fly-out"); };
  fertig(); if(reduced){ nach.querySelector(".cam").classList.remove("fly-out"); done(); return; } busy = true; anim(von, "back-out"); anim(nach, "back-in", origin); setTimeout(done, 680);
}
function enter(o, instant){
  if(busy) return; if(!offen(o)){ toast(`🔒 ${o.name} ist noch gesperrt – kommt bald!`); return; }
  cur = o; drawDet(o);
  flug($("#fOver"), $("#fDet"), org(o), instant, () => { cardDet(o); $("#card").hidden = false; $("#dock").hidden = true; head(C.zurueck, o.name, o.einheit || ""); history.replaceState(null, "", location.pathname + location.search + "#o=" + o.id); });
}
function enterSub(t, instant){
  sub = t; $("#dSub").innerHTML = img(t.bild, t.s) + fxSVG(t.fx || [], []);
  $("#card").hidden = true;
  flug($("#fDet"), $("#fSub"), org(t), instant, () => { cardSub(t); $("#card").hidden = false; head(cur.name, t.s, t.t); history.replaceState(null, "", location.pathname + location.search + "#o=" + cur.id + "&t=" + cur.themen.indexOf(t)); });
}
function leave(){
  if(busy || !cur) return;
  if(sub){ const t = sub; sub = null; $("#card").hidden = true;
    rueck($("#fSub"), $("#fDet"), org(t), () => { cardDet(cur); $("#card").hidden = false; head(C.zurueck, cur.name, cur.einheit || ""); history.replaceState(null, "", location.pathname + location.search + "#o=" + cur.id); }); return; }
  const o = cur; cur = null;
  rueck($("#fDet"), $("#fOver"), org(o), () => { $("#card").hidden = true; $("#dock").hidden = false; head("", C.name, START()); history.replaceState(null, "", location.pathname + location.search); });
}
function openThema(i){
  const t = cur.themen[i]; if(!t || busy) return;
  if(!tOffen(t)){ toast(t.pfad ? `🔒 „${t.t}“ ist noch gesperrt.` : `🔒 „${t.t}“ kommt bald!`); return; }
  if(t.bild) enterSub(t); else start(t);
}
function start(t){
  if(busy || !t || !t.pfad) return; busy = true;
  if(!reduced) anim(sub ? $("#fSub") : $("#fDet"), "fly-out", sub ? "50% 55%" : (t.x ? org(t) : "50% 50%"));
  $("#fade").classList.add("on"); setTimeout(() => { location.href = t.pfad; }, reduced ? 0 : 430);
}

/* ---------- Umschauen: Bild mit Finger oder gedrückter Maustaste verschieben ---------- */
const POS = new WeakMap();
function setPan(frame, x, y){
  const pan = frame.querySelector(".pan"), mx = Math.max(0, (pan.offsetWidth - frame.clientWidth) / 2), my = Math.max(0, (pan.offsetHeight - frame.clientHeight) / 2);
  x = Math.max(-mx, Math.min(mx, x)); y = Math.max(-my, Math.min(my, y)); POS.set(frame, [x, y]);
  pan.style.transform = `translate(calc(-50% + ${x.toFixed(1)}px), calc(-50% + ${y.toFixed(1)}px))`;
}
function zeige(frame, o){ const pan = frame.querySelector(".pan"); setPan(frame, o ? (0.5 - o.x/W) * pan.offsetWidth : 0, o ? (0.5 - o.y/H) * pan.offsetHeight : 0); }
let dragged = false;
function panEvents(){
  document.querySelectorAll(".frame").forEach(frame => {
    let st = null;
    frame.addEventListener("pointerdown", e => { if(busy || (e.pointerType === "mouse" && e.button)) return; const p = POS.get(frame) || [0,0]; st = {x:e.clientX, y:e.clientY, px:p[0], py:p[1], id:e.pointerId, on:false}; dragged = false; });
    frame.addEventListener("pointermove", e => { if(!st || e.pointerId !== st.id) return; const dx = e.clientX - st.x, dy = e.clientY - st.y;
      if(!st.on){ if(Math.hypot(dx, dy) < 8) return; st.on = true; dragged = true; frame.classList.add("drag"); try{ frame.setPointerCapture(st.id); }catch(_){} }
      setPan(frame, st.px + dx, st.py + dy); });
    const end = e => { if(st && e.pointerId === st.id){ frame.classList.remove("drag"); st = null; setTimeout(() => { dragged = false; }, 60); } };
    frame.addEventListener("pointerup", end); frame.addEventListener("pointercancel", end);
    frame.addEventListener("wheel", e => { if(matchMedia("(orientation:portrait)").matches) return; e.preventDefault(); const p = POS.get(frame) || [0,0]; setPan(frame, p[0] - e.deltaX, p[1] - e.deltaY); }, {passive:false});
  });
  addEventListener("resize", () => document.querySelectorAll(".frame").forEach(f => { if(!f.hidden){ const p = POS.get(f) || [0,0]; setPan(f, p[0], p[1]); } }));
}

/* ---------- Start ---------- */
async function startWelt(cfg){
  C = cfg; K = 100 + cfg.k; ORTE = cfg.orte;
  ORTE.forEach(o => o.themen.forEach((t, i) => { if(!t.id) t.id = o.id + "-" + i; }));
  document.title = `${C.name} – Sport Klasse ${C.k} – FRS Lernwelten`;
  if(C.farben) Object.entries(C.farben).forEach(([k, v]) => document.documentElement.style.setProperty("--" + k, v));
  geruest(); head("", C.name, START());
  let msg = "";
  { const fp = new URLSearchParams(location.search).get("frei");
    if(fp && window.FREI){ const o = await FREI.apply(fp); const u = new URL(location.href); u.searchParams.delete("frei"); history.replaceState(null, "", u);
      msg = o ? (o.k === K ? "🔓 Orte freigeschaltet!" : "🔓 Code gespeichert (andere Klasse)") : "⚠️ Code ungültig"; } }
  drawOver(); panEvents(); zeige($("#fOver"), C.startBlick || null);
  document.addEventListener("click", e => {
    if(dragged){ e.preventDefault(); return; }
    if(e.target.closest("#back")){ leave(); return; } if(e.target.closest("[data-go]")){ start(sub); return; }
    const b = e.target.closest("[data-id]"); if(!b) return;
    const id = b.dataset.id; if(/^t\d+$/.test(id)) openThema(+id.slice(1)); else enter(ORTE.find(o => o.id === id));
  });
  addEventListener("pageshow", e => { if(e.persisted){ busy = false; $("#fade").classList.remove("on"); document.querySelectorAll(".cam").forEach(c => c.classList.remove("fly-out")); } });
  ORTE.forEach(o => { new Image().src = `${C.dir}/${o.bild || o.id}.webp`; o.themen.forEach(t => { if(t.bild) new Image().src = `${C.dir}/${t.bild}.webp`; }); });
  { const m = location.hash.match(/o=([a-z0-9]+)/), o = m && ORTE.find(x => x.id === m[1]), n = location.hash.match(/t=(\d+)/);
    if(o && offen(o)){ enter(o, true); const t = n && o.themen[+n[1]]; if(t && t.bild && tOffen(t)) enterSub(t, true); } }
  if(msg) toast(msg, 3500);
}
window.SPORTWELT = { start: startWelt };
})();
