/* FRS Lernwelten – Freigabe: Lehrkraft entscheidet, welche Bereiche (Rubriken) pro Klasse offen sind.
   Ablauf: Lehrkraft gibt in der Weltübersicht (🔑) das Passwort ein, wählt Bereiche und erzeugt einen QR-/Link-Code.
   Schüler scannen ihn mit der iPad-Kamera (oder tippen den Code ein) – die Auswahl wird auf ihrem Gerät gespeichert.
   Ohne Code gilt STANDARD_GESPERRT (Klasse → gesperrte Bereiche). Hinweis: reiner Browser-Schutz ohne Server – hält Schüler fern, ist aber kein Hochsicherheitsschutz.
   Passwort ändern: neuen SHA-256 von "frs-lernwelten:<Passwort>" bei PWHASH eintragen (Claude übernimmt das). */
(function(){
  const PWHASH = "2abde59c607515f84e7a6e9c99f52543a19d33ae4f2bf6a6f9d8e7866b81b3a8";
  const STANDARD_GESPERRT = {};            // z. B. { 6:["vocabulary"] } – dann sind diese Bereiche ohne Code gesperrt
  const KEY = k => "frs-frei-" + k;
  const hex = buf => [...new Uint8Array(buf)].map(b=>b.toString(16).padStart(2,"0")).join("");
  const sha = async s => hex(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s)));
  const b64 = s => btoa(unescape(encodeURIComponent(s))).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");
  const unb64 = s => decodeURIComponent(escape(atob(s.replace(/-/g,"+").replace(/_/g,"/"))));
  function state(k){ try{ const v = JSON.parse(localStorage.getItem(KEY(k)) || "null"); return v && Array.isArray(v.open) ? v : null; }catch(e){ return null; } }
  function locked(k, kat){ const s = state(k); return s ? !s.open.includes(kat) : (STANDARD_GESPERRT[k]||[]).includes(kat); }
  async function checkPw(pw){ try{ return (await sha("frs-lernwelten:" + String(pw).trim())) === PWHASH; }catch(e){ return false; } }
  async function makeCode(k, open){ const payload = JSON.stringify({ k:+k, o:open, t:Date.now() }); return b64(payload) + "." + (await sha(PWHASH + payload)).slice(0,14); }
  async function apply(code){
    try{ const [p, sig] = String(code).trim().split("."); const payload = unb64(p);
      if(!sig || (await sha(PWHASH + payload)).slice(0,14) !== sig) return null;
      const o = JSON.parse(payload); if(!o || !Array.isArray(o.o) || !o.k) return null;
      localStorage.setItem(KEY(o.k), JSON.stringify({ open:o.o, ts:o.t })); return o;
    }catch(e){ return null; } }
  function clear(k){ try{ localStorage.removeItem(KEY(k)); }catch(e){} }
  window.FREI = { state, locked, checkPw, makeCode, apply, clear, standard:()=>STANDARD_GESPERRT };
})();
