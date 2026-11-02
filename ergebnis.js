// Gemeinsame Funktionen für Ergebnis-Codes (von allen Materialien und der Einsammel-Seite genutzt).
// Format: UH1|materialId|name|punkte|max|teilpunkte|zeit|pruefziffer
// Der QR-Code enthält einen Link auf ergebnisse.html#c=<Code>. So öffnet die normale iPad-Kamera
// direkt die Einsammel-Seite, und das Ergebnis wird automatisch eingetragen.
(function(){
  const SALT = "uh-2026-sport-englisch";
  const SCRIPT_URL = (document.currentScript && document.currentScript.src) || location.href;
  function hash(s){
    let x = 2166136261;
    for(let i=0;i<s.length;i++){ x ^= s.charCodeAt(i); x = Math.imul(x, 16777619); }
    x ^= x >>> 13; x = Math.imul(x, 2246822507); x ^= x >>> 16;
    return (x >>> 0).toString(36).toUpperCase().padStart(7,"0").slice(-5);
  }
  function stamp(){
    const d = new Date(), p = n => String(n).padStart(2,"0");
    return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
  }
  function make(id, name, pts, max, parts){
    const body = ["UH1", id, encodeURIComponent(String(name).replace(/[|!]/g,"").trim()), pts, max, (parts||[]).join("."), stamp()].join("|");
    return body + "|" + hash(SALT + body);
  }
  // Link zur Einsammel-Seite (liegt im Hauptordner neben dieser Datei)
  function link(code){
    // "|" wird im Link zu "!" – das hält den QR-Code klein und damit schnell scannbar
    return new URL("ergebnisse.html", SCRIPT_URL).href + "#c=" + code.replace(/\|/g, "!");
  }
  // Nimmt einen reinen Code oder einen Link mit #c=… entgegen
  function extract(input){
    let s = String(input || "").trim();
    const k = s.indexOf("c=");
    if(!s.startsWith("UH1|") && k >= 0){
      s = s.slice(k + 2);
      if(!/^UH1[|!]/.test(s)){ try{ s = decodeURIComponent(s); }catch(e){} }
      s = s.replace(/!/g, "|");
    }
    return s;
  }
  function parse(input){
    const s = extract(input);
    const f = s.split("|");
    if(f.length !== 8 || f[0] !== "UH1") return null;
    const body = f.slice(0,7).join("|");
    let name; try{ name = decodeURIComponent(f[2]); }catch(e){ name = f[2]; }
    return {
      id: f[1], name, pts: +f[3], max: +f[4],
      parts: f[5] ? f[5].split(".").filter(x=>x && !x.includes("-") && x[0]!=="~").map(Number) : [],
      // Klassenwelt: "thema-punkte" (alt) oder "thema-punkte-maxGespielt-spiele" (neu)
      topics: f[5] ? Object.fromEntries(f[5].split(".").filter(x=>x.includes("-")).map(x=>{ const a=x.split("-"); return [a[0], +a[1]]; })) : {},
      tinfo: f[5] ? Object.fromEntries(f[5].split(".").filter(x=>x.includes("-")).map(x=>{ const a=x.split("-"); return [a[0], {pts:+a[1], pmax:a[2]!==undefined?+a[2]:null, games:a[3]!==undefined?+a[3]:null}]; })) : {},
      today: f[5] && f[5].split(".").find(x=>x[0]==="~") ? +f[5].split(".").find(x=>x[0]==="~").slice(1) : null,
      time: f[6], valid: hash(SALT + body) === f[7], raw: s
    };
  }
  function qrImage(text, size){
    if(typeof qrcode === "undefined") return "";
    const q = qrcode(0, "L"); q.addData(text, "Byte"); q.make();
    return q.createDataURL(size || 8, 2);
  }

  /* ---------- Ränge der Klassenwelten (pro Stunde, nach heute gesammelten Flaggen) ---------- */
  // Bilder liegen in lernwelt/raenge/<datei>.webp – der Pfad wird vom Ort dieser Datei aus bestimmt
  const BASE = (()=>{ try{ const s = document.currentScript && document.currentScript.src; return s ? s.replace(/[^/]*$/,"") : ""; }catch(e){ return ""; } })();
  const RANK_AT = [0, 30, 70, 120, 180, 250];
  // Geheimer Rang: ab 350 Flaggen an einem Tag, erscheint erst nach dem Freischalten in der Rangliste
  const HIDDEN_AT = 350, GODS = {5:["fire","Fire God","Fire Goddess"],6:["ocean","Ocean God","Ocean Goddess"],7:["mountain","Mountain God","Mountain Goddess"],8:["sky","Sky God","Sky Goddess"],9:["forest","Forest God","Forest Goddess"],10:["ice","Ice God","Ice Goddess"]};
  const LS = (k,d) => { try{ return localStorage.getItem(k) || d; }catch(e){ return d; } }, LSset = (k,v) => { try{ localStorage.setItem(k,v); }catch(e){} };
  const gender = () => LS("frs-gender","m"), niv = () => LS("frs-niveau","M");
  const rName = r => (gender()==="f" && r[2]) ? r[2] : r[1], rFile = r => (gender()==="f" && r[3]) ? r[3] : r[0];
  const godImg = k => BASE + "lernwelt/raenge/god-" + (GODS[k]||GODS[5])[0] + "-" + gender() + ".webp", godName = k => { const g=GODS[k]||GODS[5]; return gender()==="f" ? g[2] : g[1]; };
  const RANKS = {
    5:  [["spark","Spark"],["ashmaster","Ash Master","Ash Mistress"],["flamekeeper","Flame Keeper"],["fireknight","Fire Knight"],["dragonrider","Dragon Rider"],["firelord","Fire Lord","Fire Queen"]],
    6:  [["droplet","Droplet"],["shellseeker","Shell Seeker"],["reefdiver","Reef Diver"],["seacaptain","Sea Captain","Sea Captain","seacaptain-f"],["tidelord","Tide Lord","Tide Lady"],["oceanruler","Ocean Ruler"]],
    7:  [["pebble","Pebble Picker"],["miner","Miner"],["blacksmith","Blacksmith"],["gemmaster","Gem Master","Gem Mistress"],["dwarfchampion","Dwarf Champion"],["mountainking","Mountain King","Mountain Queen"]],
    8:  [["leafrider","Leaf Rider"],["kiteflyer","Kite Flyer"],["windwalker","Wind Walker"],["cloudsage","Cloud Sage"],["skyguardian","Sky Guardian"],["airmonk","Air Monk","Air Priestess"]],
    9:  [["acorn","Acorn"],["mushroom","Mushroom"],["pathfinder","Pathfinder"],["ranger","Ranger"],["woodelf-m","Wood Elf","Wood Elf","woodelf"],["forestmaster","Forestmaster","Forest Queen","forestmaster-f"]],
    10: [["snowflake","Snowflake"],["snowman","Snowman"],["icefox","Ice Fox"],["polarbear","Polar Bear"],["frostgolem","Frost Golem"],["frostwizard","Frost Wizard","Frost Witch","frostwizard-f"]]
  };
  const rankImgUrl = f => BASE + "lernwelt/raenge/" + f + ".webp";
  const rankImg = (f, cls) => `<img class="${cls||"rk-img"}" src="${rankImgUrl(f)}" alt="" draggable="false">`;
  const worldImg = k => rankImgUrl("world-k"+k);
  function rank(k, n){
    if(n >= HIDDEN_AT){ const g = GODS[k]||GODS[5];
      return { i:RANK_AT.length, icon:`<img class="rk-img rk-god" src="${godImg(k)}" alt="" draggable="false">`, img:godImg(k), name:godName(k), at:HIDDEN_AT, next:null, nextName:null, nextIcon:"", toNext:0, pct:1, top:true, hidden:true, count:RANK_AT.length+1 }; }
    const R = RANKS[k] || RANKS[5]; let i = 0; RANK_AT.forEach((t,j)=>{ if(n >= t) i = j; });
    const nx = i < RANK_AT.length-1 ? RANK_AT[i+1] : null;
    return { i, icon:rankImg(rFile(R[i])), img:rankImgUrl(rFile(R[i])), name:rName(R[i]), at:RANK_AT[i], next:nx, nextName: nx!==null ? rName(R[i+1]) : null, nextIcon: nx!==null ? rankImg(rFile(R[i+1])) : "",
             toNext: nx!==null ? nx-n : 0, pct: nx!==null ? (n-RANK_AT[i])/(nx-RANK_AT[i]) : 1, top: nx===null, count: RANK_AT.length };
  }
  function rkStyle(){ if(document.getElementById("rk-style") || !document.head) return; const st=document.createElement("style"); st.id="rk-style"; st.textContent = `
      .rk-img{height:1.35em;width:1.35em;object-fit:contain;vertical-align:-.32em;display:inline-block}
      .rkl-bg{position:fixed;inset:0;z-index:90;background:rgba(6,10,20,.55);display:grid;place-items:center;padding:12px;animation:rkl-in .2s ease-out}
      .rkl{width:min(440px,100%);max-height:calc(100dvh - 24px);overflow:auto;background:rgba(18,22,36,.96);color:#fff;border:2px solid rgba(255,255,255,.7);border-radius:20px;padding:16px 16px 12px;box-shadow:0 0 30px rgba(255,255,255,.25),0 20px 50px rgba(0,0,0,.5);font-family:Lexend,system-ui,sans-serif;position:relative}
      .rkl h2{margin:0 2.4rem .2rem 0;font:700 1.45rem Fredoka,system-ui,sans-serif}
      .rkl .sub{margin:0 0 .7rem;color:#C8CCD8;font-size:.92rem}
      .rkl ol{list-style:none;margin:0;padding:0;display:flex;flex-direction:column-reverse;gap:6px}
      .rkl li{display:grid;grid-template-columns:52px 1fr auto;align-items:center;gap:10px;padding:6px 10px;border-radius:14px;background:rgba(255,255,255,.07);border:2px solid transparent}
      .rkl li img{width:52px;height:52px;object-fit:contain}
      .rkl li b{font:700 1.1rem Fredoka,system-ui,sans-serif;display:block}
      .rkl li small{color:#C8CCD8}
      .rkl li.cur{border-color:#FFC24A;background:rgba(255,194,74,.18)}
      .rkl li.cur .tag{background:#FFC24A;color:#2A1A06;border-radius:999px;padding:2px 9px;font:700 .8rem Fredoka,system-ui,sans-serif}
      .rkl li.no{opacity:.5} .rkl li.no img{filter:grayscale(.6)}
.rk-god{object-fit:cover;border-radius:6px}
      .rk-hid{display:flex;gap:12px;align-items:center;margin:0 0 8px;padding:8px;border-radius:16px;border:2px solid #FFD95A;background:linear-gradient(135deg,rgba(255,217,90,.25),rgba(180,120,255,.2));box-shadow:0 0 18px rgba(255,217,90,.4)}
      .rk-hid img{width:96px;height:auto;border-radius:10px;filter:drop-shadow(0 4px 8px rgba(0,0,0,.5))}
      .rk-hid b{display:block;font:700 1.35rem Fredoka,system-ui,sans-serif;color:#FFE27A}
      .rk-hid small{display:block;color:#E8E0C8}
      .rkl .x{position:absolute;right:10px;top:10px;width:40px;height:40px;border-radius:12px;border:2px solid rgba(255,255,255,.6);background:transparent;color:#fff;font-size:1.4rem;cursor:pointer}
      .xp{position:relative;display:grid;grid-template-columns:58px 1fr;gap:8px;height:min(540px,calc(100dvh - 190px));min-height:430px;margin:10px 0 4px}
      .xp-col{position:relative}
      .xp-track{position:absolute;left:50%;top:0;bottom:0;width:20px;transform:translateX(-50%);border-radius:12px;background:rgba(255,255,255,.08);border:2px solid rgba(255,255,255,.35);overflow:hidden;box-shadow:inset 0 0 10px rgba(0,0,0,.6)}
      .xp-fill{position:absolute;left:0;right:0;bottom:0;border-radius:10px;background:linear-gradient(to top,#E8430A,#FF8A2A 40%,#FFC24A 75%,#FFF2B0);box-shadow:0 0 16px rgba(255,194,74,.8);transition:height 1.4s cubic-bezier(.2,.8,.2,1)}
      .xp-fill::after{content:"";position:absolute;inset:0;background:linear-gradient(to top,transparent 0,rgba(255,255,255,.35) 50%,transparent 100%);background-size:100% 60px;animation:xp-run 1.6s linear infinite;opacity:.6}
      .xp-tick{position:absolute;left:50%;width:30px;height:4px;margin:0 0 -2px -15px;border-radius:2px;background:rgba(255,255,255,.35)}
      .xp-tick.on{background:#FFE27A;box-shadow:0 0 8px #FFC24A}
      .xp-knob{position:absolute;left:50%;transform:translate(-50%,50%);transition:bottom 1.4s cubic-bezier(.2,.8,.2,1);z-index:2}
      .xp-knob span{display:block;min-width:34px;padding:2px 6px;border-radius:999px;background:#FFF2B0;color:#3A1A04;font:700 .85rem Fredoka,system-ui,sans-serif;text-align:center;border:2px solid #FFC24A;box-shadow:0 0 12px rgba(255,194,74,.9)}
      .xp-rows{position:relative}
      .xp-row{position:absolute;left:0;right:0;transform:translateY(50%);display:grid;grid-template-columns:46px 1fr auto;align-items:center;gap:8px;padding:3px 8px;border-radius:14px;background:rgba(255,255,255,.07);border:2px solid transparent}
      .xp-row img{width:46px;height:46px;object-fit:contain}
      .xp-row b{display:block;font:700 1.02rem Fredoka,system-ui,sans-serif;line-height:1.1}
      .xp-row small{color:#C8CCD8;font-size:.8rem}
      .xp-row.cur{border-color:#FFC24A;background:rgba(255,194,74,.2);box-shadow:0 0 14px rgba(255,194,74,.35)}
      .xp-row.cur .tag{background:#FFC24A;color:#2A1A06;border-radius:999px;padding:2px 9px;font:700 .8rem Fredoka,system-ui,sans-serif}
      .xp-row.nx{border:2px dashed rgba(255,226,122,.7)} .xp-row.nx small{color:#FFE27A}
      .xp-row.no{opacity:.45} .xp-row.no img{filter:grayscale(.7) brightness(.8)}
      .xp-row .ck{color:#7CE08A;font-weight:700}
      .xp-zone{position:absolute;left:0;right:0;top:0;background:repeating-linear-gradient(45deg,rgba(180,120,255,.18) 0 6px,transparent 6px 12px);pointer-events:none;mix-blend-mode:screen}
      .xp-tick.sec{background:rgba(200,160,255,.6)} .xp-tick.sec.on{background:#E8C8FF;box-shadow:0 0 10px #B478FF}
      .xp-row.xp-secret{background:linear-gradient(135deg,rgba(180,120,255,.18),rgba(255,217,90,.12));border-color:rgba(200,160,255,.55)}
      .xp-row.xp-secret.no,.xp-row.xp-secret.nx{opacity:1}
      .xp-row.xp-secret b{color:#E8D2FF;letter-spacing:.08em}
      .xp-row.xp-secret.cur{border-color:#FFD95A;background:linear-gradient(135deg,rgba(255,217,90,.3),rgba(180,120,255,.25));box-shadow:0 0 18px rgba(255,217,90,.5)}
      .xp-row.xp-secret.cur b{color:#FFE27A;letter-spacing:0}
      .xp-row img.xp-sil{filter:brightness(0) drop-shadow(0 0 6px rgba(200,160,255,.9));opacity:.85}
      .xp-row img.rk-god{object-fit:cover}
      .xp-row .lock{font-size:1.1rem}
      .xp-row,.xp-tick,.xp-zone{transition:bottom 1s cubic-bezier(.3,.7,.2,1)}
      .xp.xp-pre .xp-row.xp-secret{opacity:0;transform:translateY(50%) scale(.3)}
      .xp-pre .xp-zone{opacity:0}
      .xp-pre .xp-tick.sec{opacity:0}
      .xp.xp-pop .xp-row.xp-secret{opacity:1;animation:xp-pop .9s cubic-bezier(.2,1.6,.4,1) both, xp-glow 1.6s ease-out .5s 2}
      .xp-pop .xp-zone,.xp-pop .xp-tick.sec{opacity:1;transition:opacity .8s,bottom 1s}
      .xp-pop .xp-secret b{animation:xp-q 1.2s ease-in-out .3s 3}
      @keyframes xp-pop{0%{opacity:0;transform:translateY(50%) scale(.3) rotate(-6deg)}60%{opacity:1;transform:translateY(50%) scale(1.12) rotate(2deg)}100%{opacity:1;transform:translateY(50%) scale(1) rotate(0)}}
      @keyframes xp-glow{0%{box-shadow:0 0 0 0 rgba(200,160,255,.9)}100%{box-shadow:0 0 0 22px rgba(200,160,255,0)}}
      @keyframes xp-q{0%,100%{text-shadow:none}50%{text-shadow:0 0 12px #E8C8FF,0 0 24px #B478FF}}
      @media (prefers-reduced-motion:reduce){.xp-row,.xp-tick,.xp-zone{transition:none}.xp-pop .xp-secret{animation:none}}
      @keyframes xp-run{from{background-position:0 100%}to{background-position:0 -60px}}
      @media (prefers-reduced-motion:reduce){.xp-fill,.xp-knob{transition:none}.xp-fill::after{animation:none}}
      @keyframes rkl-in{from{opacity:0}to{opacity:1}}`; document.head.appendChild(st); }
  try{ rkStyle(); }catch(e){}
  // Fenster mit allen Rängen einer Welt (beim Antippen des Rangs)
  function rankSheet(k, n, en, opts){
    const R = RANKS[k] || RANKS[5], cur = rank(k, n).i;
    rkStyle();
    const flagsTxt = en===false ? "Flaggen" : "flags";
    const d = document.createElement("div"); d.className = "rkl-bg";
    d.innerHTML = `<div class="rkl" role="dialog" aria-modal="true" aria-label="Ranks"><button class="x" aria-label="Close">×</button>
      <h2>${en===false?"Alle Ränge":"All ranks"}</h2><p class="sub">${en===false?`Heute gesammelt: ${n} ${flagsTxt}`:`Collected today: ${n} ${flagsTxt}`}</p>
      ${xpBar(R, n, cur, en, flagsTxt, k)}</div>`;
    const close = () => d.remove();
    d.addEventListener("click", e=>{ if(e.target===d || e.target.closest(".x")) close(); });
    document.addEventListener("keydown", function esc(e){ if(e.key==="Escape"){ close(); document.removeEventListener("keydown", esc); } });
    document.body.appendChild(d); d.querySelector(".x").focus({preventScroll:true});
    // Balken von unten hochfüllen; beim ersten Öffnen ab 250 Flaggen (am Tag) erweitert er sich und der geheime Rang ploppt auf
    const f = d.querySelector(".xp-fill"), kb = d.querySelector(".xp-knob"), sec = d.querySelector(".xp-secret");
    const revKey = "frs-xp-rev-k"+k, reveal = !!sec && n < HIDDEN_AT && ((opts && opts.reveal) || LS(revKey,"") !== dayStr());
    if(f){ const go = h => { f.style.height=h; kb.style.bottom=h; };
      if(!reveal) requestAnimationFrame(()=>requestAnimationFrame(()=>go(f.dataset.h)));
      else { LSset(revKey, dayStr()); const xp = d.querySelector(".xp"), moving = d.querySelectorAll("[data-p0]");
        xp.classList.add("xp-pre"); moving.forEach(e=>e.style.bottom=e.dataset.p0);
        requestAnimationFrame(()=>requestAnimationFrame(()=>go(f.dataset.h0)));
        setTimeout(()=>{ xp.classList.add("xp-grow"); moving.forEach(e=>e.style.bottom=e.dataset.p1); go(f.dataset.hm); }, 1600);
        setTimeout(()=>{ xp.classList.add("xp-pop"); }, 2300);
        setTimeout(()=>{ go(f.dataset.h); xp.classList.remove("xp-pre"); }, 3100); } }
  }
  // Erfahrungsbalken: Ränge in gleichen Abständen, der Balken füllt sich mit den heute gesammelten Flaggen
  function xpBar(R, n, cur, en, flagsTxt, k){
    // unter 250 Flaggen: nur die sechs Ränge; ab 250 kommt oben der geheime Rang „???“ dazu (ab 350 die Gottheit)
    const sec = n >= RANK_AT[RANK_AT.length-1], AT = sec ? RANK_AT.concat(HIDDEN_AT) : RANK_AT.slice(), N = AT.length;
    const p6 = j => 5 + j/5*90, p7 = j => 4 + j/6*92, pos = sec ? p7 : p6;
    const fillAt = (P, M) => { const A = M===7 ? RANK_AT.concat(HIDDEN_AT) : RANK_AT; let f; if(n >= A[A.length-1]) f = 1; else { let i=0; A.forEach((t,j)=>{ if(n>=t) i=j; }); f = (i + (n-A[i])/(A[i+1]-A[i]))/(A.length-1); }
      return (P(0) + f*(P(A.length-1)-P(0))).toFixed(1)+"%"; };
    const h1 = fillAt(pos, N), h0 = sec ? fillAt(p6, 6) : h1, nx = cur < N-1 ? cur+1 : null, god = n >= HIDDEN_AT;
    const row = (j, img, name, extra) => { const st = j===cur ? "cur" : j<cur ? "ok" : j===nx ? "nx" : "no", b0 = j<6 ? p6(j) : 100;
      return `<div class="xp-row ${st}${extra||""}" data-p0="${b0}%" data-p1="${pos(j)}%" style="bottom:${pos(j)}%">${img}<span><b>${name}</b><small>${AT[j]} ${flagsTxt}${j===nx?` · ${en===false?"noch":"still"} ${AT[j]-n}`:""}</small></span>${j===cur?`<span class="tag">${en===false?"Du":"You"}</span>`:j<cur?`<span class="ck">✔</span>`:j===N-1&&sec?`<span class="lock">🔒</span>`:""}</div>`; };
    let rows = R.map((r,j)=>row(j, rankImg(rFile(r),""), rName(r))).join("");
    if(sec) rows += row(N-1, `<img class="${god?"rk-god":"xp-sil"}" src="${godImg(k)}" alt="" draggable="false">`, god ? godName(k) : "???", " xp-secret");
    const ticks = AT.map((t,j)=>`<i class="xp-tick${j<=cur?" on":""}${j===6?" sec":""}" data-p0="${j<6?p6(j):100}%" data-p1="${pos(j)}%" style="bottom:${pos(j)}%"></i>`).join("");
    return `<div class="xp"><div class="xp-col"><div class="xp-track"><div class="xp-fill" data-h0="${h0}" data-hm="${sec ? pos(N-2) : 0}%" data-h="${h1}" style="height:0%"></div>${sec?`<div class="xp-zone" data-p0="100%" data-p1="${pos(N-2)}%" style="bottom:${pos(N-2)}%"></div>`:""}</div>${ticks}<div class="xp-knob" style="bottom:0%"><span>${n}</span></div></div><div class="xp-rows">${rows}</div></div>`;
  }


  // "Heute gesammelt": Zähler pro Klasse und Tag
  const dayStr = () => { const d=new Date(), p=n=>String(n).padStart(2,"0"); return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}`; };
  function today(k){ try{ const r = JSON.parse(localStorage.getItem("frs-day-k"+k) || "null"); return r && r.d===dayStr() ? r.n : 0; }catch(e){ return 0; } }
  function addToday(k, n){ const v = today(k) + n; try{ localStorage.setItem("frs-day-k"+k, JSON.stringify({d:dayStr(), n:v})); }catch(e){} return v; }
  // Alles zurücksetzen (Leih-iPads): Fortschritt aller Themen einer Klasse, Kürzel und Tageszähler löschen
  function resetClass(k, topicIds, klasseId){
    try{
      topicIds.forEach(id=>localStorage.removeItem("lw-"+id+"-v1"));
      localStorage.removeItem("frs-day-k"+k);
      if(klasseId) localStorage.removeItem("insel-"+klasseId+"-name");
    }catch(e){}
  }
  /* ---------- Niveau (G/M/E) und weiblich/männlich ---------- */
  const NIV = { G:["G-Niveau","Basic","Grundlegendes Niveau – kürzer, mit mehr Hilfen"], M:["M-Niveau","Medium","Mittleres Niveau"], E:["E-Niveau","Expert","Erweitertes Niveau – schwieriger, mehr selbst formulieren"] };
  function prefsHTML(){ const n=niv(), g=gender();
    return `<span class="frs-pref"><button type="button" class="frs-niv" data-niv-open aria-label="Niveau wählen">${NIV[n][0]} <span aria-hidden="true">▾</span></button>`+
      `<button type="button" class="frs-gen" data-gen-toggle aria-label="${g==="f"?"weiblich":"männlich"} – umschalten" title="weiblich / männlich"><span class="${g==="f"?"on":""}">♀</span><span class="${g==="m"?"on":""}">♂</span></button></span>`; }
  function prefStyle(){ if(document.getElementById("frs-pref-style") || !document.head) return; const st=document.createElement("style"); st.id="frs-pref-style"; st.textContent=`
    .frs-pref{display:inline-flex;align-items:center;gap:6px;flex:0 0 auto}
    .frs-niv{min-height:40px;padding:0 12px;border-radius:12px;border:2px solid currentColor;background:rgba(0,0,0,.18);color:inherit;font:700 15px Fredoka,system-ui,sans-serif;white-space:nowrap;cursor:pointer}
    .frs-gen{display:inline-flex;min-height:40px;padding:2px;border-radius:12px;border:2px solid currentColor;background:rgba(0,0,0,.18);color:inherit;cursor:pointer}
    .frs-gen span{display:grid;place-items:center;width:28px;border-radius:9px;font:700 16px system-ui;opacity:.5}
    .frs-gen span.on{opacity:1;background:#FFC24A;color:#2A1A06}
    .frs-nivpop{position:fixed;inset:0;z-index:95;background:rgba(6,10,20,.55);display:grid;place-items:center;padding:12px}
    .frs-nivpop .box{width:min(420px,100%);background:rgba(18,22,36,.97);color:#fff;border:2px solid rgba(255,255,255,.7);border-radius:20px;padding:16px;font-family:Lexend,system-ui,sans-serif}
    .frs-nivpop h2{margin:0 0 .6rem;font:700 1.4rem Fredoka,system-ui,sans-serif}
    .frs-nivpop button.o{display:block;width:100%;text-align:left;margin:6px 0;padding:10px 12px;border-radius:14px;border:2px solid rgba(255,255,255,.25);background:rgba(255,255,255,.07);color:#fff;cursor:pointer;font:inherit}
    .frs-nivpop button.o b{display:block;font:700 1.15rem Fredoka,system-ui,sans-serif}
    .frs-nivpop button.o small{color:#C8CCD8}
    .frs-nivpop button.o.cur{border-color:#FFC24A;background:rgba(255,194,74,.18)}
    @media (max-width:560px){ .frs-niv{font-size:13px;padding:0 8px;min-height:36px} .frs-gen{min-height:36px} .frs-gen span{width:22px;font-size:14px} }`; document.head.appendChild(st); }
  try{ prefStyle(); }catch(e){}
  let prefBound = false;
  function bindPrefs(onChange){ if(prefBound) return; prefBound = true;
    document.addEventListener("click", e=>{
      if(e.target.closest("[data-gen-toggle]")){ LSset("frs-gender", gender()==="f" ? "m" : "f"); onChange ? onChange("gender") : location.reload(); return; }
      if(e.target.closest("[data-niv-open]")){ prefStyle(); const d=document.createElement("div"); d.className="frs-nivpop";
        d.innerHTML = `<div class="box" role="dialog" aria-modal="true"><h2>Choose your level</h2>${Object.keys(NIV).map(k=>`<button class="o${k===niv()?" cur":""}" data-niv="${k}"><b>${NIV[k][0]} · ${NIV[k][1]}</b><small>${NIV[k][2]}</small></button>`).join("")}</div>`;
        d.addEventListener("click", ev=>{ const b=ev.target.closest("[data-niv]"); if(b){ LSset("frs-niveau", b.dataset.niv); d.remove(); onChange ? onChange("niveau") : location.reload(); return; } if(ev.target===d) d.remove(); });
        document.body.appendChild(d); } }); }
  window.UH = { make, link, parse, qrImage, rank, rankSheet, prefsHTML, bindPrefs, niv, gender, NIV, rankImg, worldImg, RANK_AT, RANKS, today, addToday, resetClass };
})();
