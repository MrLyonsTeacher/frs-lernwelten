/* FRS Lernwelten – Startet ein Thema im Stil der Klassenwelt.
   Seite lädt: lernwelt.css, themes.css, qrcode.js, ergebnis.js, katalog.js, lernwelt.js, thema.js
   TH.start({ k:6, kat:"grammar", id:"pp6", titel:"…", untertitel:"Present perfect", text:"…", icon:"💎", levels:[…] }) */
(function(){
  const WELT = { 5:"feuer", 6:"wasser", 7:"stein", 8:"himmel", 9:"wald", 10:"eis" };
  const KONF = {
    feuer:["#012169","#C8102E","#FFFFFF","#FFC24A","#E8430A"], wasser:["#012169","#C8102E","#FFFFFF","#FFD23F","#7FE3FF","#FF7A59"],
    stein:["#012169","#C8102E","#FFFFFF","#FFC24A","#B88AFF","#4AF0A0"], himmel:["#012169","#C8102E","#FFFFFF","#FFC24A","#7EC0FF"],
    wald:["#012169","#C8102E","#FFFFFF","#E8C24A","#4FAE3A"], eis:["#012169","#C8102E","#FFFFFF","#8AE6FF","#C8A0FF"] };
  const KATNAME = { grammar:"Grammar", vocabulary:"Vocabulary", country:"Country & people", reading:"Reading", listening:"Listening", writing:"Writing", speaking:"Speaking", exam:"Exam" };
  const FLAGDEFS = `<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>
    <clipPath id="uk-s"><path d="M0,0 v30 h60 v-30 z"/></clipPath><clipPath id="uk-t"><path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z"/></clipPath>
    <g id="ukflag" clip-path="url(#uk-s)"><path d="M0,0 v30 h60 v-30 z" fill="#012169"/><path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" stroke-width="6"/>
    <path d="M0,0 L60,30 M60,0 L0,30" clip-path="url(#uk-t)" stroke="#C8102E" stroke-width="4"/><path d="M30,0 v30 M0,15 h60" stroke="#fff" stroke-width="10"/><path d="M30,0 v30 M0,15 h60" stroke="#C8102E" stroke-width="6"/></g><g id="usflag"><rect y="0.000" width="60" height="2.308" fill="#B22234"/><rect y="2.308" width="60" height="2.308" fill="#fff"/><rect y="4.615" width="60" height="2.308" fill="#B22234"/><rect y="6.923" width="60" height="2.308" fill="#fff"/><rect y="9.231" width="60" height="2.308" fill="#B22234"/><rect y="11.538" width="60" height="2.308" fill="#fff"/><rect y="13.846" width="60" height="2.308" fill="#B22234"/><rect y="16.154" width="60" height="2.308" fill="#fff"/><rect y="18.462" width="60" height="2.308" fill="#B22234"/><rect y="20.769" width="60" height="2.308" fill="#fff"/><rect y="23.077" width="60" height="2.308" fill="#B22234"/><rect y="25.385" width="60" height="2.308" fill="#fff"/><rect y="27.692" width="60" height="2.308" fill="#B22234"/><rect width="26" height="16.154" fill="#3C3B6E"/><circle cx="2.4" cy="1.8" r=".75" fill="#fff"/><circle cx="6.8" cy="1.8" r=".75" fill="#fff"/><circle cx="11.2" cy="1.8" r=".75" fill="#fff"/><circle cx="15.6" cy="1.8" r=".75" fill="#fff"/><circle cx="20.0" cy="1.8" r=".75" fill="#fff"/><circle cx="24.4" cy="1.8" r=".75" fill="#fff"/><circle cx="4.6" cy="4.4" r=".75" fill="#fff"/><circle cx="9.0" cy="4.4" r=".75" fill="#fff"/><circle cx="13.4" cy="4.4" r=".75" fill="#fff"/><circle cx="17.8" cy="4.4" r=".75" fill="#fff"/><circle cx="22.2" cy="4.4" r=".75" fill="#fff"/><circle cx="2.4" cy="7.0" r=".75" fill="#fff"/><circle cx="6.8" cy="7.0" r=".75" fill="#fff"/><circle cx="11.2" cy="7.0" r=".75" fill="#fff"/><circle cx="15.6" cy="7.0" r=".75" fill="#fff"/><circle cx="20.0" cy="7.0" r=".75" fill="#fff"/><circle cx="24.4" cy="7.0" r=".75" fill="#fff"/><circle cx="4.6" cy="9.6" r=".75" fill="#fff"/><circle cx="9.0" cy="9.6" r=".75" fill="#fff"/><circle cx="13.4" cy="9.6" r=".75" fill="#fff"/><circle cx="17.8" cy="9.6" r=".75" fill="#fff"/><circle cx="22.2" cy="9.6" r=".75" fill="#fff"/><circle cx="2.4" cy="12.2" r=".75" fill="#fff"/><circle cx="6.8" cy="12.2" r=".75" fill="#fff"/><circle cx="11.2" cy="12.2" r=".75" fill="#fff"/><circle cx="15.6" cy="12.2" r=".75" fill="#fff"/><circle cx="20.0" cy="12.2" r=".75" fill="#fff"/><circle cx="24.4" cy="12.2" r=".75" fill="#fff"/><circle cx="4.6" cy="14.8" r=".75" fill="#fff"/><circle cx="9.0" cy="14.8" r=".75" fill="#fff"/><circle cx="13.4" cy="14.8" r=".75" fill="#fff"/><circle cx="17.8" cy="14.8" r=".75" fill="#fff"/><circle cx="22.2" cy="14.8" r=".75" fill="#fff"/></g></defs></svg>`;
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  window.TH = {
    start(c){
      // Freigabe: ist der Bereich von der Lehrkraft gesperrt, erscheint nur ein Hinweis (Datei freigabe.js liegt neben thema.js)
      const go = () => { if(window.FREI && FREI.locked(c.k, c.kat)) return TH.gesperrt(c); TH.los(c); };
      if(window.FREI) return go();
      const sc = document.createElement("script"); sc.src = (document.currentScript && document.currentScript.src || "").replace(/thema\.js.*$/, "freigabe.js") || "../../lernwelt/freigabe.js";
      sc.onload = go; sc.onerror = () => TH.los(c); document.head.appendChild(sc);
    },
    gesperrt(c){
      const th = WELT[c.k] || "wasser"; document.body.classList.add("th-"+th);
      const app = document.getElementById("app") || document.body;
      app.innerHTML = `<div style="max-width:560px;margin:12vh auto;padding:28px 24px;text-align:center;font-family:Fredoka,system-ui,sans-serif;border-radius:22px;border:2.5px solid var(--ui-border,#fff);background:var(--ui-bg,rgba(0,0,0,.6));color:var(--ui-text,#fff)">
        <div style="font-size:64px" aria-hidden="true">🔒</div><h1 style="margin:.2em 0;font-size:30px">Not open yet</h1>
        <p style="font-size:18px;margin:.4em 0">Your teacher will open <b>${esc(KATNAME[c.kat]||c.kat)}</b> soon.<br><small>Dieser Bereich ist noch gesperrt – deine Lehrkraft schaltet ihn bald frei.</small></p>
        <p style="margin-top:1.4em"><a href="../welt.html?k=${c.k}" style="display:inline-block;padding:12px 22px;border-radius:14px;background:var(--ui-accent,#FFC24A);color:var(--ui-accent-ink,#111);font-weight:700;text-decoration:none">← Back to the island</a></p></div>`;
    },
    los(c){
      const th = WELT[c.k] || "wasser";
      document.body.classList.add("th-"+th);
      document.body.insertAdjacentHTML("afterbegin", FLAGDEFS);
      const img = c.bild || `../welten/k${c.k}-${c.kat}.jpg`;
      const hero = `<div class="whero"><div class="bgimg" style="background-image:url('${img}')"></div>
        <span class="tag">English · Class ${c.k} · ${esc(KATNAME[c.kat]||c.kat)}</span>
        <h1>${esc(c.titel)}</h1><p>${esc(c.text||"")}</p><span class="big" aria-hidden="true">${c.icon||"🎯"}</span></div>`;
      LW.start({
        id: c.id, titel: `${c.titel} – ${c.untertitel||""}`,
        insel: { k:c.k, href:`../welt.html?k=${c.k}&a=${c.kat}`, icon:"🗺️" },
        sprache: "en", hero, sammel:`<svg class="ico-flag" viewBox="0 0 60 30" aria-hidden="true"><use href="#${c.k==8?"usflag":"ukflag"}"/></svg>`,
        punkteName: "flags", kartenSymbol: c.kartenSymbol || c.icon || "⭐", konfetti: c.k==8 ? ["#B22234","#3C3B6E","#FFFFFF","#FFC24A"] : KONF[th],
        lob: c.lob || {3:"Amazing! You are a real expert.", 2:"Great job! Can you get three stars next time?", 1:"Good start – try again and you will get better.", 0:"Don’t give up! Read the tips and try again."},
        audio: `../audio/${c.id}/`, akzent: c.k==8 ? "en-US" : "en-GB",
        lernen: c.lernen, levels: c.levels, kat: c.kat, thema: c.kat==="grammar" ? (c.untertitel||"") : "", G: c.G, E: c.E
      });
    }
  };
})();
