/* FRS Lernwelten – Freigabe: Lehrkraft entscheidet, welche Bereiche (Rubriken) und einzelnen Themen pro Klasse offen sind (x = gesperrte Themen-IDs).
   Ablauf: Lehrkraft gibt in der Weltübersicht (🔑) das Passwort ein, wählt Bereiche und erzeugt einen QR-/Link-Code.
   Schüler scannen ihn mit der iPad-Kamera (oder tippen den Code ein) – die Auswahl wird auf ihrem Gerät gespeichert.
   Ohne Code gilt STANDARD_GESPERRT (Klasse → gesperrte Bereiche). Hinweis: reiner Browser-Schutz ohne Server – hält Schüler fern, ist aber kein Hochsicherheitsschutz.
   Passwort ändern: neuen SHA-256 von "frs-lernwelten:<Passwort>" bei PWHASH eintragen (Claude übernimmt das). */
(function(){
  /* Zugangscode für die verschlüsselten Vokabeln: kommt im QR-Link nach dem # (wird nie an den Server gesendet) und wird auf dem Gerät gespeichert. */
  try{ const m=(location.hash||"").match(/[#&]k=([^&]+)/); if(m){ localStorage.setItem("frs-vk", decodeURIComponent(m[1])); history.replaceState(null,"",location.pathname+location.search); } }catch(e){}
  const PWHASH = "0611c7aebf739bf54950c8a449d1b58ca01d3cbe4a3bb2acd4bfe9a9384610a9";
  const STANDARD_GESPERRT = {};            // z. B. { 6:["vocabulary"] } – dann sind diese Bereiche ohne Code gesperrt
  const KEY = k => "frs-frei-" + k;
  const hex = buf => [...new Uint8Array(buf)].map(b=>b.toString(16).padStart(2,"0")).join("");
  const sha = async s => hex(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s)));
  const b64 = s => btoa(unescape(encodeURIComponent(s))).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");
  const unb64 = s => decodeURIComponent(escape(atob(s.replace(/-/g,"+").replace(/_/g,"/"))));
  function state(k){ try{ const v = JSON.parse(localStorage.getItem(KEY(k)) || "null"); return v && Array.isArray(v.open) ? v : null; }catch(e){ return null; } }
  function lockedThema(k, id){ const s = state(k); return !!(s && Array.isArray(s.x) && s.x.includes(id)); }
  function locked(k, kat){ const s = state(k); return s ? !s.open.includes(kat) : (STANDARD_GESPERRT[k]||[]).includes(kat); }
  /* Freigabe (🔑) öffnet mit dem bisherigen Freigabe-Passwort ODER mit dem Startseiten-Passwort (ein Passwort für alles).
     PWHASH bleibt unverändert, weil damit die QR-Codes unterschrieben sind – so bleiben alle alten Codes gültig. */
  async function checkPw(pw){ try{ const v = String(pw).trim();
    return (await sha("frs-lernwelten:" + v)) === PWHASH || (await sha("frs-start:" + v.toLowerCase())) === START_HASH; }catch(e){ return false; } }
  async function makeCode(k, open, x, r){ const o = { k:+k, o:open, t:Date.now() }; if(x && x.length) o.x = x; if(r>0) o.r = +r; const payload = JSON.stringify(o); return b64(payload) + "." + (await sha(PWHASH + payload)).slice(0,14); }
  async function apply(code){
    try{ const [p, sig] = String(code).trim().split("."); const payload = unb64(p);
      if(!sig || (await sha(PWHASH + payload)).slice(0,14) !== sig) return null;
      const o = JSON.parse(payload); if(!o || !Array.isArray(o.o) || !o.k) return null;
      const prev = state(o.k), sameCode = !!(prev && prev.ts === o.t), running = +localStorage.getItem(RKEY) > Date.now();
      localStorage.setItem(KEY(o.k), JSON.stringify({ open:o.o, x:Array.isArray(o.x)?o.x:[], ts:o.t, r:o.r>0?o.r:0 }));
      /* Auto-Reset: in o.r Minuten ab dem ersten Scan. Wird derselbe Code erneut gescannt, während die Uhr läuft, bleibt sie unverändert
         (keine Verlängerung). Ist die Uhr abgelaufen (Gerät wurde zurückgesetzt) oder ist es ein neuer Code, startet sie neu. */
      if(o.r>0){ if(!(sameCode && running)) localStorage.setItem(RKEY, String(Date.now() + o.r*60000)); }
      else localStorage.removeItem(RKEY);
      return o;
    }catch(e){ return null; } }
  function clear(k){ try{ localStorage.removeItem(KEY(k)); }catch(e){} }
  /* Alles zurücksetzen (Leih-iPads): Fortschritt, Namen/Kürzel, Tageszähler und Vokabeltrainer-Daten löschen.
     Niveau geht zurück auf M, ♀/♂ auf Standard. Bleibt: nur die Freigabe (Sperren). */
  function wipe(){
    try{ for(const k of Object.keys(localStorage)){
      if(/^lw-/.test(k) || /^insel-.*-name$/.test(k) || /^frs-day-k/.test(k) || /^vt8-/.test(k) || k==="frs-niveau" || k==="frs-gender" || k==="frs-tab") localStorage.removeItem(k);
    } }catch(e){}
  }
  /* Automatischer Reset: der Code der Lehrkraft kann „nach r Minuten zurücksetzen“ enthalten. Geprüft beim Laden jeder Seite,
     alle 20 s und wenn der iPad-Bildschirm wieder aktiv wird. Einmalig – beim nächsten Scannen startet die Uhr neu. */
  const RKEY = "frs-reset-at";
  function sweep(){ try{ const t = +localStorage.getItem(RKEY); if(t && Date.now() >= t){ localStorage.removeItem(RKEY); wipe(); return true; } }catch(e){} return false; }
  /* Tab schließen: Browser erlauben window.close() nur für per Skript geöffnete Tabs – sonst erscheint eine Abschlussseite. */
  function closeTab(){
    try{ window.close(); }catch(e){}
    setTimeout(()=>{ document.open(); document.write('<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><body style="margin:0;display:grid;place-items:center;min-height:100vh;background:#111;color:#fff;font:700 22px/1.4 system-ui;text-align:center;padding:24px"><div>✅ Reset done.<br>Please close this tab now.<br><small style="font-weight:400;opacity:.7">Zurückgesetzt. Bitte schließe diesen Tab.</small></div>'); document.close(); }, 250);
  }
  if(sweep()) setTimeout(closeTab, 0);
  const tick = () => { if(sweep()) closeTab(); };
  setInterval(tick, 20000); document.addEventListener("visibilitychange", () => { if(!document.hidden) tick(); });
  /* Mehrere Tabs auf Leih-iPads: Ein alter, noch offener Tab zeigt sonst die Freigabe vom Zeitpunkt seines Ladens
     (oder alles offen), auch wenn inzwischen ein neuer QR-Code gescannt wurde. Daher: Ändert sich die Freigabe
     (in einem anderen Tab, oder während der Tab im Hintergrund war), lädt sich die Seite selbst neu. */
  const snap = () => { try{ return Object.keys(localStorage).filter(k=>/^frs-frei-/.test(k)).sort().map(k=>k+"="+localStorage.getItem(k)).join("|"); }catch(e){ return ""; } };
  let SNAP = snap();
  const recheck = () => { if(snap() !== SNAP){ SNAP = snap(); location.reload(); } };
  window.addEventListener("storage", e => { if(!e.key || /^frs-frei-/.test(e.key)) recheck(); });
  window.addEventListener("pageshow", e => { if(e.persisted) recheck(); });
  window.addEventListener("focus", recheck);
  document.addEventListener("visibilitychange", () => { if(!document.hidden) recheck(); });
  const _apply = apply, _clear = clear;
  apply = async code => { const o = await _apply(code); SNAP = snap(); return o; };   // eigene Änderung: kein Neuladen nötig
  clear = k => { _clear(k); SNAP = snap(); };
  /* Zugangsschutz der Klassenwelten: Wer im Link nur die Klasse ändert (k=9 → k=10), kommt nicht mehr hinein.
     Offen ist eine Klassenwelt, wenn auf dem Gerät ein Freigabe-Code oder der normale Klassen-QR-Code (mit Zugangszeichen z=…)
     dieser Klasse gescannt wurde, wenn man von der (passwortgeschützten) Startseite kommt oder das Startseiten-Passwort eingibt. */
  const START_HASH = "6ea733fee097b492ca9a8b4ffb2674ded74ed52bc508f02e6c619bf78dd9ae6d";   // = HASH in startgate.js (Passwort der Startseite)
  const ZKEY = k => "frs-zugang-" + k;
  const zToken = async k => (await sha(PWHASH + "zugang:" + k)).slice(0, 14);
  const startOk = () => { try{ return localStorage.getItem("frs-start-ok") === START_HASH || sessionStorage.getItem("frs-start-ok") === START_HASH; }catch(e){ return false; } };
  const fromStart = () => { try{ const r = new URL(document.referrer); return r.origin === location.origin && /\/(index\.html)?$/.test(r.pathname); }catch(e){ return false; } };
  async function allowed(k){
    try{ const u = new URL(location.href), z = u.searchParams.get("z");
      if(z){ if(z === await zToken(k)) localStorage.setItem(ZKEY(k), "1"); u.searchParams.delete("z"); history.replaceState(null, "", u); } }catch(e){}
    let has = false; try{ has = !!state(k) || localStorage.getItem(ZKEY(k)) === "1"; }catch(e){}
    return has || startOk() || fromStart();
  }
  async function gate(k){
    if(await allowed(k)) return true;
    return new Promise(resolve => {
      const g = document.createElement("div"); g.id = "zgate";
      g.setAttribute("style", "position:fixed;inset:0;z-index:99999;display:grid;place-items:center;background:rgba(10,20,40,.96);padding:20px;font-family:system-ui,-apple-system,sans-serif");
      g.innerHTML = `<form autocomplete="off" style="background:#fff;color:#13294B;border-radius:18px;padding:26px 22px;width:min(380px,100%);text-align:center;box-shadow:0 20px 60px rgba(0,0,0,.4)">
        <div style="font-size:2.4rem">🔒</div><h2 style="margin:.2em 0 .3em;font-size:1.3rem">Please scan your class QR code</h2>
        <p style="margin:0 0 16px;opacity:.75;font-size:.95rem">Bitte scanne den QR-Code deiner Lehrkraft, um in diese Welt zu kommen.</p>
        <input type="password" id="zgpw" placeholder="Passwort (Lehrkraft)" autocapitalize="off" spellcheck="false" style="width:100%;box-sizing:border-box;min-height:44px;padding:0 12px;border:2px solid #C8D2E0;border-radius:12px;font-size:1rem">
        <button type="submit" style="margin-top:10px;width:100%;min-height:44px;border:0;border-radius:12px;background:#13294B;color:#fff;font-size:1rem;font-weight:700">Öffnen</button>
        <p id="zgerr" style="color:#C0392B;min-height:1.2em;margin:8px 0 0;font-size:.9rem"></p></form>`;
      document.body.appendChild(g);
      g.querySelector("form").addEventListener("submit", async e => {
        e.preventDefault(); const pw = g.querySelector("#zgpw");
        let h = ""; try{ h = await sha("frs-start:" + pw.value.trim().toLowerCase()); }catch(err){}
        if(h !== START_HASH){ g.querySelector("#zgerr").textContent = "Passwort falsch."; pw.select(); return; }
        try{ sessionStorage.setItem("frs-start-ok", START_HASH); }catch(err){}
        g.remove(); resolve(true);
      });
    });
  }
  const resetIn = () => { try{ const t = +localStorage.getItem(RKEY); return t ? Math.max(0, t - Date.now()) : 0; }catch(e){ return 0; } };
  window.FREI = { gate, allowed, zToken, wipe, closeTab, resetIn, state, locked, lockedThema, checkPw, makeCode, apply, clear, standard:()=>STANDARD_GESPERRT };
})();
