/* Camp Start (Profil Sport Kl. 8): gemeinsame Bausteine der Lernwelten am See.
   Wird nach lernwelt.js und sport-kit.js eingebunden. */

/* Farben der Camp-Schaubilder (dunkle Waldkarte, helle Schrift) */
const CB = "#16281F", CB2 = "#22392D", CL = "#2E4A3B", HELL = "#F3EEDF", HG = "#B9C7B6",
      GE = "#F2C14E", OR = "#E8833A", RO = "#E2574C", GR = "#7BC48E", BL = "#6FB6D9", LI = "#B79BE0", SA = "#E9DCC0";
const CK = (w, h, inner) => KARTE(w, h, inner, CB);     // Camp-Karte

/* Szenenbild (gezeichnet, als .webp in camp-bilder/). Fehlt die Datei noch, erscheint ein großes Symbol. */
const FOTO = (n, sym, alt) => `<img class="lnbild" src="camp-bilder/${n}.webp" alt="${(alt||"").replace(/"/g,"")}" loading="lazy" onerror="this.outerHTML='<span style=&quot;font-size:clamp(4rem,14vw,8rem);line-height:1&quot;>${sym||"🏕️"}</span>'">`;
const BILD = (n, alt) => `<img class="lnbild" src="camp-bilder/${n}" alt="${(alt||"").replace(/"/g,"")}" loading="lazy">`;

/* ---------- Startbild ---------- */
const LANDSCHAFT = (() => {
  const berge = (pts, f, o) => `<path d="M0 ${pts[0][1]} ${pts.map(([x,y]) => `L${x} ${y}`).join(" ")} L1000 240 L0 240 Z" fill="${f}" opacity="${o}"/>`;
  const tanne = (x, y, s) => `<path transform="translate(${x} ${y}) scale(${s})" d="M0 0 L-10 0 L-3 -10 L-8 -10 L-1 -20 L-6 -20 L0 -32 L6 -20 L1 -20 L8 -10 L3 -10 L10 0 Z" fill="#1A2E27"/><rect x="${x-1.4*s}" y="${y}" width="${2.8*s}" height="${4*s}" fill="#1A2E27"/>`;
  const T = [[12,214,1],[34,208,1.3],[58,216,.9],[82,210,1.15],[128,214,.85],[470,212,.8],[492,207,1.05],[512,214,.85],[640,210,.9],[662,205,1.2],[930,208,1.1],[952,214,.9],[976,206,1.3]];
  return `<circle cx="700" cy="70" r="26" fill="#FBE7B0" opacity=".9"/>
  ${berge([[0,180],[60,150],[120,168],[190,112],[250,156],[320,132],[390,170],[470,120],[540,160],[610,126],[690,164],[760,118],[830,156],[900,130],[1000,160]], "#3A5560", .7)}
  ${berge([[0,204],[70,186],[150,200],[230,172],[310,196],[400,180],[480,200],[560,176],[650,198],[740,178],[820,198],[900,182],[1000,196]], "#26403F", 1)}
  ${T.map(([x,y,s]) => tanne(x, y, s)).join("")}
  <rect x="0" y="222" width="1000" height="78" fill="url(#seeG)"/>
  <g class="welle" stroke="#F3C77A" stroke-opacity=".5" stroke-width="2" stroke-linecap="round">
    <path d="M60 240 h46 M190 254 h60 M330 238 h40 M430 266 h54 M120 280 h38 M560 246 h50 M640 276 h44 M760 240 h36 M300 288 h46"/></g>`;
})();
const SYMBOLE = {
  feuer: `<g class="sym" transform="translate(300 212)">
    ${[-52,-30,-8,14,36,52].map((x,k)=>`<ellipse cx="${x}" cy="${6+(k%2)*3}" rx="11" ry="7" fill="#6E6A63" stroke="#3C3A36" stroke-width="2"/>`).join("")}
    <path d="M-44 4 L40 -22" stroke="#5B3A22" stroke-width="12" stroke-linecap="round"/><path d="M-40 -22 L44 4" stroke="#6B4528" stroke-width="12" stroke-linecap="round"/>
    <path d="M-44 4 L40 -22 M-40 -22 L44 4" stroke="#8A5C34" stroke-width="3" stroke-linecap="round" opacity=".6"/>
    <path class="flamme" d="M0 -6 C-30 -26 -18 -60 -4 -92 C2 -70 22 -64 18 -40 C30 -52 30 -30 24 -18 C18 -8 10 -4 0 -6 Z" fill="#E8833A"/>
    <path class="flamme b" d="M0 -8 C-16 -22 -10 -44 0 -62 C4 -48 16 -42 12 -26 C10 -14 6 -9 0 -8 Z" fill="#F2C14E"/>
    ${[[-18,-96],[14,-110],[2,-126],[26,-92]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="2.4" fill="#F7D98C"/>`).join("")}</g>`,
  turm: `<g class="sym" transform="translate(296 236)" stroke-linecap="round">
    <path d="M-34 0 L-22 -110 M34 0 L22 -110" stroke="#C9B48E" stroke-width="7"/>
    ${[-20,-44,-68,-92].map(y=>`<path d="M${-34+(-y)*.11} ${y} H${34-(-y)*.11}" stroke="#A8936E" stroke-width="5"/>`).join("")}
    <rect x="-30" y="-130" width="60" height="22" rx="4" fill="#2F6B4F" stroke="#1C4232" stroke-width="3"/>
    <path d="M-30 -130 V-152 H30 V-130" fill="none" stroke="#C9B48E" stroke-width="5"/>
    <circle cx="0" cy="-168" r="11" fill="#F2D2B3"/><path d="M-14 -152 C-14 -160 14 -160 14 -152 Z" fill="#1E1E1E"/>
    <path d="M-12 -150 h24 v18 h-24 z" fill="#FFFFFF"/><path d="M-12 -150 v18 M-4 -150 v18 M4 -150 v18 M12 -150 v18" stroke="#1E1E1E" stroke-width="3"/>
    <path d="M10 -164 l16 -6" stroke="#B8BEC4" stroke-width="4"/><circle cx="29" cy="-171" r="4" fill="#B8BEC4"/>
    <path d="M70 0 V-120" stroke="#9AA3AA" stroke-width="7"/><rect x="58" y="-150" width="46" height="32" rx="3" fill="#FFFFFF" stroke="#9AA3AA" stroke-width="3"/>
    <rect x="72" y="-140" width="18" height="14" fill="none" stroke="#E2574C" stroke-width="3"/><path d="M64 -116 h30" stroke="#E8833A" stroke-width="4"/>
    <path d="M66 -116 l4 18 l6 -18 l4 18 l6 -18 l4 18 l4 -18" fill="none" stroke="#F4F1E6" stroke-width="1.6"/></g>`,
  sonne: `<g class="sym">
    <g class="glimm">${Array.from({length:12},(_,k)=>{const a=k*Math.PI/6;return `<path d="M${320+Math.cos(a)*58} ${150+Math.sin(a)*58} L${320+Math.cos(a)*80} ${150+Math.sin(a)*80}" stroke="#F7D98C" stroke-width="5" stroke-linecap="round"/>`;}).join("")}</g>
    <circle cx="320" cy="150" r="46" fill="#F2C14E"/><circle cx="320" cy="150" r="46" fill="none" stroke="#F7D98C" stroke-width="6" opacity=".6"/>
    <path d="M210 214 C260 196 330 190 400 202 V222 H210 Z" fill="#5E8C4A"/><path d="M200 222 C260 206 340 204 400 214 V226 H200 Z" fill="#4B7A3C"/>
    <g transform="translate(278 210)" stroke="#1A2E27" stroke-width="5" stroke-linecap="round" fill="none">
      <circle cx="0" cy="-58" r="7" fill="#1A2E27"/><path d="M0 -50 L-2 -24 L-14 0 M-2 -24 L12 0 M0 -46 L-22 -64 M0 -46 L20 -66"/></g></g>`,
  muehle: `<g class="sym" transform="translate(306 214)">
    <path d="M-60 0 V-66 L-24 -96 L12 -66 V0 Z" fill="#C9B48E" stroke="#6B5638" stroke-width="3"/>
    <path d="M-66 -64 L-24 -102 L18 -64" fill="none" stroke="#7A3E2A" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
    <rect x="-34" y="-40" width="16" height="22" fill="#F2C14E" stroke="#6B5638" stroke-width="2"/><rect x="-54" y="-54" width="12" height="12" fill="#F2C14E" stroke="#6B5638" stroke-width="2"/>
    ${[[34,-34,1],[74,-30,0]].map(([cx,cy,r])=>`<g class="rad${r?"":" rueck"}"><circle cx="${cx}" cy="${cy}" r="26" fill="none" stroke="#6B4528" stroke-width="5"/>
      <circle cx="${cx}" cy="${cy}" r="6" fill="#6B4528"/>${Array.from({length:8},(_,k)=>{const a=k*Math.PI/4;return `<path d="M${cx} ${cy} L${cx+Math.cos(a)*26} ${cy+Math.sin(a)*26}" stroke="#6B4528" stroke-width="3"/><rect x="${cx+Math.cos(a)*26-5}" y="${cy+Math.sin(a)*26-5}" width="10" height="10" fill="#8A5C34" transform="rotate(${k*45} ${cx+Math.cos(a)*26} ${cy+Math.sin(a)*26})"/>`;}).join("")}</g>`).join("")}
    <path d="M14 8 q20 -8 40 0 t40 0" stroke="#9FD8E8" stroke-width="3" fill="none"/></g>`,
  parcours: `<g class="sym" transform="translate(300 222)" stroke-linecap="round">
    <path d="M-60 0 V-130 M40 0 V-130 M-66 -130 H46" stroke="#8A5C34" stroke-width="8"/>
    ${[0,1,2,3,4].map(k=>`<path d="M${-56+k*22} -126 C${-58+k*22} -90 ${-50+k*22} -50 ${-54+k*22} -8" stroke="#E9DCC0" stroke-width="2.4" fill="none"/>`).join("")}
    ${[0,1,2,3,4].map(k=>`<path d="M-58 ${-112+k*24} C-30 ${-108+k*24} 10 ${-116+k*24} 36 ${-110+k*24}" stroke="#E9DCC0" stroke-width="2.4" fill="none"/>`).join("")}
    <path d="M60 -6 h80" stroke="#A8724A" stroke-width="10"/><path d="M68 -6 v6 M132 -6 v6" stroke="#6B4528" stroke-width="6"/>
    <circle cx="100" cy="-58" r="7" fill="#1A2E27"/><path d="M100 -50 L100 -26 L92 -8 M100 -26 L110 -8 M100 -44 L78 -48 M100 -44 L124 -50" stroke="#1A2E27" stroke-width="5" fill="none"/></g>`,
  leuchtturm: `<g class="sym">
    <path class="strahl" d="M322 92 L560 40 L560 150 Z" fill="#FFF3C4" opacity=".35"/>
    <path d="M300 232 L308 108 H336 L344 232 Z" fill="#F4F1E6" stroke="#3A3A3A" stroke-width="2"/>
    <path d="M303 196 L341 196 L342 214 L302 214 Z M305 156 L339 156 L340 174 L304 174 Z M307 120 L337 120 L338 136 L306 136 Z" fill="#E2574C"/>
    <rect x="304" y="96" width="36" height="14" fill="#2B2B2B"/><rect x="309" y="78" width="26" height="18" fill="#F2C14E" class="glimm"/><path d="M304 78 L322 62 L340 78 Z" fill="#E2574C" stroke="#2B2B2B" stroke-width="2"/>
    <path d="M296 110 H348" stroke="#2B2B2B" stroke-width="3"/><rect x="316" y="212" width="12" height="20" rx="5" fill="#5B3A22"/>
    <path d="M270 232 C290 222 360 222 380 232 Z" fill="#4A4A44"/></g>`,
  huette: `<g class="sym" transform="translate(300 222)">
    <path d="M-70 0 V-62 H70 V0 Z" fill="#8A5C34"/>${[0,1,2,3,4,5].map(k=>`<path d="M-70 ${-6-k*11} H70" stroke="#5B3A22" stroke-width="2.5"/>`).join("")}
    <path d="M-84 -58 L0 -116 L84 -58" fill="#7A3E2A" stroke="#4C2416" stroke-width="5" stroke-linejoin="round"/>
    <rect x="34" y="-108" width="14" height="30" fill="#6E6A63"/><path d="M41 -112 c-6 -12 8 -18 2 -30" stroke="#D9D4C7" stroke-width="3" fill="none" opacity=".7"/>
    <rect x="-50" y="-46" width="30" height="24" fill="#F2C14E" class="glimm" stroke="#4C2416" stroke-width="3"/><path d="M-35 -46 v24 M-50 -34 h30" stroke="#4C2416" stroke-width="2.5"/>
    <rect x="6" y="-44" width="26" height="44" fill="#5B3A22" stroke="#4C2416" stroke-width="3"/><circle cx="26" cy="-22" r="2.5" fill="#F2C14E"/>
    <g transform="translate(-60 -4)"><path d="M0 0 L24 -8 L48 0 V14 L24 6 L0 14 Z" fill="#F4F1E6" stroke="#2F6B4F" stroke-width="2.5"/><path d="M24 -8 V6" stroke="#2F6B4F" stroke-width="2"/></g></g>`
};
function campHero(o){
  return `<div class="camp-hero">
  <a class="welt-back" href="klasse8.html#o=${o.ort}">🏕️ Camp Start</a>
  <svg class="hero-art" viewBox="0 0 1000 300" preserveAspectRatio="xMaxYMax slice" aria-hidden="true"><defs><linearGradient id="seeG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2D5F6E"/><stop offset="1" stop-color="#173845"/></linearGradient></defs>${LANDSCHAFT}<g transform="translate(590 0)">${SYMBOLE[o.symbol] || ""}</g></svg>
  <p class="kicker">Profil Sport · Klasse 8 · ${o.etappe}</p>
  <h1>${o.titel}</h1>
  <p>${o.text}</p>
</div>`;
}

/* gemeinsame Einstellungen aller Camp-Lernwelten */
const CAMP = { sprache:"de", sammel:"🪵", rang:{k:"s8"}, konfetti:["#2F6B4F","#F2C14E","#E8833A","#FFFFFF","#6FB6D9"], abTitel:"Jetzt ins Camp-Logbuch",
  lob:{3:"Lagerfeuer-Profi! Drei Sterne.", 2:"Starke Leistung! Schaffst du drei Sterne?", 1:"Guter Anfang – lies die Infokarten nochmal und versuch es gleich wieder.", 0:"Noch kalt am Feuer: Lies die Infokarten und probier es nochmal."} };

/* 2 × 2 Kacheln mit Symbol (z. B. vier Merkmale, vier Aufgaben von Regeln). k = hervorgehobene Kachel, −1 = alle gleich */
function KACHELN(titel, items, k, zeichen){
  zeichen = zeichen === undefined ? "ABCD" : zeichen;
  const pos = [[14,40],[196,40],[14,168],[196,168]];
  return CK(380, 296, TX(190, 26, titel, {s:17, c:HELL}) + items.map(([name, bild], i) => { const [x, y] = pos[i], an = k < 0 || k === i;
    return `<g opacity="${an ? 1 : .32}"><rect x="${x}" y="${y}" width="170" height="124" rx="16" fill="${CB2}" stroke="${k === i ? GE : CL}" stroke-width="${k === i ? 4 : 2}"/>
      <g transform="translate(${x} ${y})">${bild}</g>${TX(x + 85, y + 112, name, {s:14.5, c:k === i ? GE : HELL})}
      ${zeichen ? `<circle cx="${x + 18}" cy="${y + 18}" r="12" fill="${k === i ? GE : CL}"/>${TX(x + 18, y + 23, zeichen[i], {s:13, c:CB})}` : ""}</g>`; }).join(""));
}

/* Piktogramm-Figur wie bei Olympia: p = {k:[x,y] Kopf, h:[x,y] Hals/Schulter, b:[x,y] Becken, ea,ha (Ellbogen/Hand vorn), eb,hb (hinten), ka,fa (Knie/Fuß vorn), kb,fb (hinten)}
   s = Strichstärke, c = Farbe. Hinterer Arm/Bein etwas dunkler, damit man die Seiten unterscheidet. */
function PIKTO(p, c, s, c2){
  s = s || 9; c = c || HELL; c2 = c2 || c;
  const L = (a, b, col, w) => `<path d="M${a[0]} ${a[1]} L${b[0]} ${b[1]}" stroke="${col}" stroke-width="${w}" stroke-linecap="round"/>`;
  const glied = (a, b, d, col) => a && b ? L(a, b, col, s) + (d ? L(b, d, col, s * .9) : "") : "";
  return `<g>${glied(p.h, p.eb, p.hb, c2)}${glied(p.b, p.kb, p.fb, c2)}${L(p.h, p.b, c, s * 1.45)}${glied(p.b, p.ka, p.fa, c)}${glied(p.h, p.ea, p.ha, c)}<circle cx="${p.k[0]}" cy="${p.k[1]}" r="${s * 1.05}" fill="${c}"/></g>`;
}

/* Weiche Linie durch Punkte (Catmull-Rom → Bézier) */
function GLATT(pts, zu){
  const P = zu ? [pts[pts.length - 1], ...pts, pts[0], pts[1]] : [pts[0], ...pts, pts[pts.length - 1]];
  let d = `M${P[1][0]} ${P[1][1]}`;
  for(let i = 1; i < P.length - 2; i++){ const [p0, p1, p2, p3] = [P[i - 1], P[i], P[i + 1], P[i + 2]];
    d += ` C${(p1[0] + (p2[0] - p0[0]) / 6).toFixed(1)} ${(p1[1] + (p2[1] - p0[1]) / 6).toFixed(1)} ${(p2[0] - (p3[0] - p1[0]) / 6).toFixed(1)} ${(p2[1] - (p3[1] - p1[1]) / 6).toFixed(1)} ${p2[0]} ${p2[1]}`; }
  return d + (zu ? " Z" : "");
}
