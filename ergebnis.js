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
  const RANK_AT = [0, 20, 50, 90, 140, 200];
  const RANKS = {
    5:  [["spark","Spark"],["ashmaster","Ash Master"],["flamekeeper","Flame Keeper"],["fireknight","Fire Knight"],["dragonrider","Dragon Rider"],["firelord","Fire Lord"]],
    6:  [["droplet","Droplet"],["shellseeker","Shell Seeker"],["reefdiver","Reef Diver"],["seacaptain","Sea Captain"],["tidelord","Tide Lord"],["oceanruler","Ocean Ruler"]],
    7:  [["pebble","Pebble Picker"],["miner","Miner"],["blacksmith","Blacksmith"],["gemmaster","Gem Master"],["dwarfchampion","Dwarf Champion"],["mountainking","Mountain King"]],
    8:  [["leafrider","Leaf Rider"],["kiteflyer","Kite Flyer"],["windwalker","Wind Walker"],["cloudsage","Cloud Sage"],["skyguardian","Sky Guardian"],["airmonk","Air Monk"]],
    9:  [["acorn","Acorn"],["mushroom","Mushroom"],["pathfinder","Pathfinder"],["ranger","Ranger"],["woodelf","Wood Elf"],["forestmaster","Forestmaster"]],
    10: [["snowflake","Snowflake"],["snowman","Snowman"],["icefox","Ice Fox"],["polarbear","Polar Bear"],["frostgolem","Frost Golem"],["frostwizard","Frost Wizard"]]
  };
  const rankImgUrl = f => BASE + "lernwelt/raenge/" + f + ".webp";
  const rankImg = (f, cls) => `<img class="${cls||"rk-img"}" src="${rankImgUrl(f)}" alt="" draggable="false">`;
  const worldImg = k => rankImgUrl("world-k"+k);
  function rank(k, n){
    const R = RANKS[k] || RANKS[5]; let i = 0; RANK_AT.forEach((t,j)=>{ if(n >= t) i = j; });
    const nx = i < RANK_AT.length-1 ? RANK_AT[i+1] : null;
    return { i, icon:rankImg(R[i][0]), img:rankImgUrl(R[i][0]), name:R[i][1], at:RANK_AT[i], next:nx, nextName: nx!==null ? R[i+1][1] : null, nextIcon: nx!==null ? rankImg(R[i+1][0]) : "",
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
      .rkl .x{position:absolute;right:10px;top:10px;width:40px;height:40px;border-radius:12px;border:2px solid rgba(255,255,255,.6);background:transparent;color:#fff;font-size:1.4rem;cursor:pointer}
      @keyframes rkl-in{from{opacity:0}to{opacity:1}}`; document.head.appendChild(st); }
  try{ rkStyle(); }catch(e){}
  // Fenster mit allen Rängen einer Welt (beim Antippen des Rangs)
  function rankSheet(k, n, en){
    const R = RANKS[k] || RANKS[5], cur = rank(k, n).i;
    rkStyle();
    const flagsTxt = en===false ? "Flaggen" : "flags";
    const d = document.createElement("div"); d.className = "rkl-bg";
    d.innerHTML = `<div class="rkl" role="dialog" aria-modal="true" aria-label="Ranks"><button class="x" aria-label="Close">×</button>
      <h2>${en===false?"Alle Ränge":"All ranks"}</h2><p class="sub">${en===false?`Heute gesammelt: ${n} ${flagsTxt}`:`Collected today: ${n} ${flagsTxt}`}</p>
      <ol>${R.map((r,j)=>`<li class="${j===cur?"cur":j>cur?"no":""}">${rankImg(r[0],"")}<span><b>${r[1]}</b><small>${en===false?"ab":"from"} ${RANK_AT[j]} ${flagsTxt}</small></span>${j===cur?`<span class="tag">${en===false?"Du":"You"}</span>`:j<cur?"✔":""}</li>`).join("")}</ol></div>`;
    const close = () => d.remove();
    d.addEventListener("click", e=>{ if(e.target===d || e.target.closest(".x")) close(); });
    document.addEventListener("keydown", function esc(e){ if(e.key==="Escape"){ close(); document.removeEventListener("keydown", esc); } });
    document.body.appendChild(d); d.querySelector(".x").focus({preventScroll:true});
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
  window.UH = { make, link, parse, qrImage, rank, rankSheet, rankImg, worldImg, RANK_AT, RANKS, today, addToday, resetClass };
})();
