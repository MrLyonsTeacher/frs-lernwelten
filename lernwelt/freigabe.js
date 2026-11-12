/* FRS Lernwelten – Freigabe: Lehrkraft entscheidet, welche Bereiche (Rubriken) und einzelnen Themen pro Klasse offen sind (x = gesperrte Themen-IDs).
   Ablauf: Lehrkraft gibt in der Weltübersicht (🔑) das Passwort ein, wählt Bereiche und erzeugt einen QR-/Link-Code.
   Schüler scannen ihn mit der iPad-Kamera (oder tippen den Code ein) – die Auswahl wird auf ihrem Gerät gespeichert.
   Ohne Code gilt STANDARD_GESPERRT (Klasse → gesperrte Bereiche). Hinweis: reiner Browser-Schutz ohne Server – hält Schüler fern, ist aber kein Hochsicherheitsschutz.
   Passwort ändern: neuen SHA-256 von "frs-lernwelten:<Passwort>" bei PWHASH eintragen (Claude übernimmt das). */
(function(){
  /* Zugangscode für die verschlüsselten Vokabeln: kommt im QR-Link nach dem # (wird nie an den Server gesendet) und wird auf dem Gerät gespeichert. */
  try{ const m=(location.hash||"").match(/[#&]k=([^&]+)/); if(m){ localStorage.setItem("frs-vk", decodeURIComponent(m[1])); history.replaceState(null,"",location.pathname+location.search); } }catch(e){}
  const PWHASH = "87b907f06e737f1dcc420a8d7f168cdccb154c7f1fae0c772e9e9441c1305092";
  const STANDARD_GESPERRT = {};            // z. B. { 6:["vocabulary"] } – dann sind diese Bereiche ohne Code gesperrt
  const KEY = k => "frs-frei-" + k;
  const hex = buf => [...new Uint8Array(buf)].map(b=>b.toString(16).padStart(2,"0")).join("");
  const sha = async s => hex(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s)));
  const b64 = s => btoa(unescape(encodeURIComponent(s))).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");
  const unb64 = s => decodeURIComponent(escape(atob(s.replace(/-/g,"+").replace(/_/g,"/"))));
  function state(k){ try{ const v = JSON.parse(localStorage.getItem(KEY(k)) || "null"); return v && Array.isArray(v.open) ? v : null; }catch(e){ return null; } }
  function lockedThema(k, id){ const s = state(k); return !!(s && Array.isArray(s.x) && s.x.includes(id)); }
  function locked(k, kat){ const s = state(k); return s ? !s.open.includes(kat) : (STANDARD_GESPERRT[k]||[]).includes(kat); }
  async function checkPw(pw){ try{ return (await sha("frs-lernwelten:" + String(pw).trim())) === PWHASH; }catch(e){ return false; } }
  async function makeCode(k, open, x, r){ const o = { k:+k, o:open, t:Date.now() }; if(x && x.length) o.x = x; if(r>0) o.r = +r; const payload = JSON.stringify(o); return b64(payload) + "." + (await sha(PWHASH + payload)).slice(0,14); }
  async function apply(code){
    try{ const [p, sig] = String(code).trim().split("."); const payload = unb64(p);
      if(!sig || (await sha(PWHASH + payload)).slice(0,14) !== sig) return null;
      const o = JSON.parse(payload); if(!o || !Array.isArray(o.o) || !o.k) return null;
      localStorage.setItem(KEY(o.k), JSON.stringify({ open:o.o, x:Array.isArray(o.x)?o.x:[], ts:o.t, r:o.r>0?o.r:0 }));
      if(o.r>0) localStorage.setItem(RKEY, String(Date.now() + o.r*60000)); else localStorage.removeItem(RKEY);   // Auto-Reset: in o.r Minuten
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
  const resetIn = () => { try{ const t = +localStorage.getItem(RKEY); return t ? Math.max(0, t - Date.now()) : 0; }catch(e){ return 0; } };
  window.FREI = { wipe, closeTab, resetIn, state, locked, lockedThema, checkPw, makeCode, apply, clear, standard:()=>STANDARD_GESPERRT };
})();
