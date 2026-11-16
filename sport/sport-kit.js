/* FRS Lernwelten – Sport: gemeinsame Grafiken und eigener Spieltyp „zeigen“.
   Wird von den Körper-Lernwelten (Knochen, Gelenke …) nach lernwelt.js eingebunden. */
/* =========================================================
   Grafiken (alles selbst gezeichnet, keine fremden Bilder)
   ========================================================= */
const W2 = 240;                       // Breite der Skelett-Grafik, gespiegelt wird an x = 120
const mx = x => +(W2 - x).toFixed(1);
const ln = (x1,y1,x2,y2,w,c="s") => `<line class="${c}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke-width="${w}" stroke-linecap="round"/>`;
const ci = (cx,cy,r,c="f") => `<circle class="${c}" cx="${cx}" cy="${cy}" r="${r}"/>`;
const el = (cx,cy,rx,ry,c="f") => `<ellipse class="${c}" cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}"/>`;
const both = f => f(x=>x) + f(mx);    // linke und rechte Körperseite

function skel(hl, opt){
  hl = hl || []; opt = opt || {};
  const g = (id, inner) => `<g data-z="${id}" class="${hl.includes(id)?"z-hl":""}${opt.gelenke?" nz":""}">${inner}</g>`;
  // Wirbelsäule
  let wirbel = ""; for(let y=98, k=0; y<=292; y+=8.6, k++){ const w = k>17 ? 13 : k>6 ? 11 : 9; wirbel += `<rect class="f" x="${120-w/2}" y="${y.toFixed(1)}" width="${w}" height="6.2" rx="2"/>`; }
  wirbel += `<rect class="h" x="113" y="98" width="14" height="196" stroke-width="4"/>`;
  // Rippen
  const RW = [20,27,32,35,37,37,36,33,28,22];
  const rippen = both(X => RW.map((w,i)=>{ const y = 123 + i*7.6, x0 = 113, p = `M${X(x0)} ${y} C${X(x0-w*.55)} ${y-6} ${X(x0-w)} ${y+1} ${X(x0-w+3)} ${y+15+i*.8}`;
    return `<path class="s" d="${p}" stroke-width="3.2" stroke-linecap="round"/><path class="h" d="${p}" stroke-width="6"/>`; }).join(""));
  const schulterblatt = both(X => `<path class="f" d="M${X(63)} 119 L${X(84)} 117 L${X(82)} 168 L${X(68)} 150 Z" stroke-linejoin="round"/>`);
  const brustbein = `<rect class="f" x="115.5" y="119" width="9" height="52" rx="4"/><rect class="h" x="113" y="117" width="14" height="56" stroke-width="3"/>`;
  const schluessel = both(X => { const p = `M${X(114)} 118 Q${X(90)} 108 ${X(65)} 115`; return `<path class="s" d="${p}" stroke-width="5" stroke-linecap="round"/><path class="h" d="${p}" stroke-width="12"/>`; });
  const schaedel = `<path class="f" d="M120 8 C150 8 152 34 151 50 C150 62 146 66 144 68 L96 68 C94 66 90 62 89 50 C88 34 90 8 120 8 Z"/>`
    + el(107,46,7.5,6.5,"d") + el(133,46,7.5,6.5,"d") + `<path class="d" d="M120 51 L115.5 60 L124.5 60 Z"/>`;
  const kiefer = `<rect class="hf" x="99" y="68" width="42" height="26" rx="8"/><path class="f" d="M96 66 C97 90 108 95 120 95 C132 95 143 90 144 66 L137 68 C135 84 128 86 120 86 C112 86 105 84 103 68 Z"/>`
    + `<path class="d" d="M106 70 L134 70" stroke="#0C1B30" stroke-width="1.4" stroke-dasharray="2.4 1.6"/>`;
  const oberarm = both(X => ln(X(61),132,X(47),204,8) + ci(X(63),127,6.5) + ci(X(47),207,6) + ln(X(61),132,X(47),204,14,"h"));
  const speiche = both(X => ln(X(41),214,X(28),284,5) + ci(X(28),285,3.6) + ln(X(41),214,X(28),284,10,"h"));
  const elle = both(X => ln(X(52),213,X(41),287,5) + ci(X(53),212,3.6) + ln(X(52),213,X(41),287,10,"h"));
  const hand = both(X => el(X(35),295,9,6.5) + [[29,300,23,322],[33,301,30,327],[37,301,36,329],[41,300,42,326]].map(([a,b,c,d])=>ln(X(a),b,X(c),d,3.4)).join("")
      + [[23,325,21,343],[30,330,29,350],[36,332,37,352],[42,329,45,346]].map(([a,b,c,d])=>ln(X(a),b,X(c),d,2.8)).join("")
      + ln(X(28),297,X(17),311,3.4) + ln(X(17),313,X(12),328,2.8));
  const becken = `<path class="f" d="M120 288 C104 278 84 282 81 300 C79 318 91 334 104 341 L110 333 C104 325 105 314 113 311 L127 311 C135 314 136 325 130 333 L136 341 C149 334 161 318 159 300 C156 282 136 278 120 288 Z"/>`
    + `<path class="f" d="M112 294 L128 294 L124 318 L116 318 Z" style="opacity:.85"/>` + el(105,323,6,7,"d") + el(135,323,6,7,"d");
  const oberschenkel = both(X => ln(X(99),326,X(93),404,10) + ci(X(102),320,7.5) + ci(X(93),409,8) + ln(X(99),326,X(93),404,16,"h"));
  const knie = both(X => ci(X(93),421,6.5) + ci(X(93),421,9,"h"));
  const schienbein = both(X => ln(X(98),433,X(98),497,8.5) + el(X(96),431,9,4.5) + ln(X(98),433,X(98),497,13,"h"));
  const wadenbein = both(X => ln(X(83),432,X(85),495,4.2) + ci(X(83),431,3.4) + ln(X(83),432,X(85),495,10,"h"));
  const fuss = both(X => el(X(93),503,10,5.5) + [[86,507,82,520],[90,508,88,521],[94,508,94,521],[98,508,100,521],[102,507,106,519]].map(([a,b,c,d])=>ln(X(a),b,X(c),d,3)).join(""));
  return `<svg class="sk" viewBox="0 0 ${W2} 528" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Skelett eines Menschen">
    <rect class="sk-bg" width="${W2}" height="528" rx="18"/>
    ${g("wirbelsaeule",wirbel)}${g("schulterblatt",schulterblatt)}${g("rippen",rippen)}${g("brustbein",brustbein)}${g("schluesselbein",schluessel)}
    ${g("becken",becken)}${g("schaedel",schaedel)}${g("unterkiefer",kiefer)}${g("oberarm",oberarm)}${g("speiche",speiche)}${g("elle",elle)}${g("hand",hand)}
    ${g("oberschenkel",oberschenkel)}${g("schienbein",schienbein)}${g("wadenbein",wadenbein)}${g("kniescheibe",knie)}${g("fuss",fuss)}
    ${opt.gelenke ? GELENKPUNKTE.map(([id,pts,r]) => `<g class="jm${hl.includes(id)?" z-hl":""}" data-z="${id}">${pts.map(([x,y]) => `<circle class="jh" cx="${x}" cy="${y}" r="${r+6}"/><circle class="jr" cx="${x}" cy="${y}" r="${r}"/>`).join("")}</g>`).join("") : ""}
  </svg>`;
}


/* Gelenke im Skelett (für Gelenk-Spiele): id, Punkte [x,y] (links und rechts), Radius */
const GELENKPUNKTE = [
  ["g-kopf",       [[120,97]], 7],
  ["g-schulter",   [[63,127],[177,127]], 9],
  ["g-ellenbogen", [[47,209],[193,209]], 8],
  ["g-hand",       [[34,292],[206,292]], 7],
  ["g-daumen",     [[24,305],[216,305]], 5],
  ["g-huefte",     [[102,320],[138,320]], 9],
  ["g-knie",       [[93,418],[147,418]], 9],
  ["g-sprung",     [[96,500],[144,500]], 7]
];

/* kleine Grafiken für die Infokarten */
const svgBox = (vb, inner) => `<svg class="lnsvg" viewBox="${vb}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${inner}</svg>`;
const art = s => s.replace('<svg class="sk"', '<svg class="sk lnsvg"').replace('<svg class="rk"', '<svg class="rk lnsvg"');
const BONE = (x,y,s,col="#F4E9D2") => { const sh = (st) => `<rect x="-30" y="-7" width="60" height="14" ${st}/><circle cx="-32" cy="-9" r="11" ${st}/><circle cx="-32" cy="9" r="11" ${st}/><circle cx="32" cy="-9" r="11" ${st}/><circle cx="32" cy="9" r="11" ${st}/>`;
  return `<g transform="translate(${x} ${y}) scale(${s})">${sh('fill="#12223A" stroke="#12223A" stroke-width="6"')}${sh(`fill="${col}"`)}</g>`; };

/* =========================================================
   Eigener Spieltyp „zeigen“: Knochen antippen oder benennen
   ========================================================= */
const FIG = window.FIG = window.FIG || {};
FIG.skelett = FIG.skelett || (() => skel());
FIG.gelenke = FIG.gelenke || (() => skel([], {gelenke:true}));
LW.addGame("zeigen", (l, A, done, K) => {
  const T = K.T(), P = l.punkte || 1, Z = l.ziele, POOL = l.pool || Z, qs = l.mischen === false ? Z.slice() : K.shuffle(Z), res = [], hist = [], found = new Set();
  let i = 0, pts = 0, locked = false;
  const nameMode = l.modus === "name" || l.modus === "typ", typMode = l.modus === "typ";
  function fitFig(){ const s = A.querySelector(".zfig svg"); if(!s) return; const top = s.getBoundingClientRect().top; s.style.height = Math.max(260, Math.min(760, innerHeight - top - 26)) + "px"; }
  function options(q){
    if(typMode){ const all = l.typen.slice(), order = K.orderFor(all.length, all.findIndex(t => t.id === q.typ), hist); return order.map(j => all[j]); }
    const near = (q.nah || []).map(id => POOL.find(b => b.id === id)).filter(Boolean).slice(0, 1);
    const rest = K.shuffle(POOL.filter(b => b.id !== q.id && !near.includes(b))).slice(0, 3 - near.length);
    const all = [q].concat(near, rest), order = K.orderFor(all.length, 0, hist);
    return order.map(j => all[j]);
  }
  function show(){
    K.closeSheet(); locked = false; const q = qs[i];
    A.innerHTML = K.progressBar(K.fill(res, qs.length), i) + `<div class="zg">
      <div class="panel zq">${nameMode
        ? `<p class="zk">${K.esc(l.frage || (typMode ? "Welche Gelenkart leuchtet?" : "Wie heißt der leuchtende Knochen?"))}</p><div class="opts zopts">${options(q).map(o => `<button class="opt" data-o="${o.id}">${K.esc(o.name)}</button>`).join("")}</div>`
        : `<p class="zk">${K.esc(l.frage || "Tippe auf:")}</p><p class="ztarget">${K.esc(q.name)}</p>${q.tipp ? `<p class="hint">💡 ${K.rich(q.tipp)}</p>` : ""}`}
        ${found.size ? `<div class="zfound"><p class="zk">Schon gefunden · ${found.size}/${qs.length}</p><div class="zchips">${[...found].map(id => `<span>✓ ${K.esc((Z.find(b => b.id === id) || {}).name || "")}</span>`).join("")}</div></div>` : ""}</div>
      <div class="zfig">${FIG[l.bild]()}</div></div>`;
    const svg = A.querySelector(".zfig svg");
    found.forEach(id => { const g = svg.querySelector(`[data-z="${id}"]`); if(g) g.classList.add("z-done"); });
    if(nameMode) svg.querySelector(`[data-z="${q.id}"]`).classList.add("z-glow");
    requestAnimationFrame(fitFig);
  }
  function answer(id, from){
    if(locked) return; locked = true;
    const q = qs[i], ok = typMode ? id === q.typ : id === q.id, svg = A.querySelector(".zfig svg"), tg = svg.querySelector(`[data-z="${q.id}"]`);
    tg.classList.remove("z-glow", "z-done"); tg.classList.add(ok ? "z-ok" : "z-show");
    if(!ok && !nameMode){ const w = svg.querySelector(`[data-z="${id}"]`); if(w){ w.classList.remove("z-done"); w.classList.add("z-no"); } }
    if(nameMode) A.querySelectorAll("[data-o]").forEach(b => { b.disabled = true; if(b.dataset.o === (typMode ? q.typ : q.id)) b.classList.add("right"); else if(b === from) b.classList.add("wrong"); });
    res.push(ok);
    const hit = POOL.find(b => b.id === id) || Z.find(b => b.id === id);
    const tn = typMode ? (l.typen.find(t => t.id === q.typ) || {}).name : "";
    if(ok){ pts += P; found.add(q.id); K.award([["z" + Z.indexOf(q), P]], from); }
    else { A.querySelector(".zq").classList.add("shake"); K.miss(typMode ? `Gelenkart: ${q.name}` : nameMode ? "Welcher Knochen leuchtet?" : `Tippe auf: ${q.name}`, typMode ? tn || q.typ : q.name, q.e); }
    const head = typMode ? (ok ? `${T.right} ${q.name} = ${tn} +${P}` : `${T.wrong} ${q.name} = ${tn}`) : ok ? `${l.richtigText || T.right} +${P}` : nameMode ? `${T.wrong} ${T.correctIs} „${q.name}“` : `Daneben – das war ${hit ? "„" + hit.name + "“" : "nicht das Gesuchte"}. Gelb leuchtet: „${q.name}“`;
    K.sheet(ok ? "ok" : "no", K.esc(head), K.rich(q.e || ""), i < qs.length - 1 ? T.next : T.result,
      () => { i++; if(i < qs.length) show(); else done(pts, T.correctN(res.filter(Boolean).length) + " / " + qs.length); });
  }
  A.onclick = e => {
    if(nameMode){ const b = e.target.closest("[data-o]"); if(b) answer(b.dataset.o, b); return; }
    const g = e.target.closest("[data-z]"); if(g) answer(g.dataset.z, g);
  };
  const onR = () => fitFig(); addEventListener("resize", onR); K.onCleanup(() => removeEventListener("resize", onR));
  show();
}, l => l.ziele.length * (l.punkte || 1));

