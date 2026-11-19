/* FRS Lernwelten – Passwort für die Startseite (Übersicht für die Lehrkraft).
   Schüler kommen per QR-Code direkt in ihre Welt/ihr Spiel und brauchen kein Passwort. Wer oben im Link alles hinter
   der Adresse löscht und so auf die Startseite kommt, muss das Passwort eingeben.
   Unabhängig vom Freigabe-Passwort (🔑) – alte Freigabe-QR-Codes bleiben gültig.
   Passwort ändern: SHA-256 von "frs-start:<Passwort>" bei HASH eintragen (Claude übernimmt das).
   Hinweis: reiner Browser-Schutz ohne Server – hält Schüler fern, ist aber kein Hochsicherheitsschutz. */
(function(){
  const HASH = "6ea733fee097b492ca9a8b4ffb2674ded74ed52bc508f02e6c619bf78dd9ae6d";
  const KEY = "frs-start-ok";
  const ok = () => { try{ return localStorage.getItem(KEY) === HASH || sessionStorage.getItem(KEY) === HASH; }catch(e){ return false; } };
  if(ok()) return;
  const html = document.documentElement; html.classList.add("sg-lock");
  const css = document.createElement("style");
  css.textContent = `html.sg-lock body>*:not(#sgate){display:none!important}
  #sgate{position:fixed;inset:0;display:grid;place-items:center;background:#13294B;padding:20px;z-index:99999;font-family:system-ui,-apple-system,sans-serif}
  #sgate form{background:#fff;border-radius:18px;padding:26px 22px;width:min(360px,100%);box-shadow:0 20px 60px rgba(0,0,0,.35);text-align:center;color:#13294B}
  #sgate h1{margin:0 0 6px;font-size:1.4rem} #sgate p{margin:0 0 16px;opacity:.75;font-size:.95rem}
  #sgate input[type=password]{width:100%;box-sizing:border-box;min-height:46px;padding:0 12px;border:2px solid #C8D2E0;border-radius:12px;font-size:1.05rem}
  #sgate label{display:flex;gap:8px;align-items:center;justify-content:center;margin:12px 0 4px;font-size:.9rem;opacity:.8}
  #sgate button{margin-top:12px;width:100%;min-height:46px;border:0;border-radius:12px;background:#13294B;color:#fff;font-size:1.05rem;font-weight:700}
  #sgate .err{color:#C0392B;min-height:1.2em;margin:8px 0 0;font-size:.9rem;opacity:1}`;
  document.head.appendChild(css);
  const sha = async s => [...new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s)))].map(b=>b.toString(16).padStart(2,"0")).join("");
  function show(){
    const g = document.createElement("div"); g.id = "sgate";
    g.innerHTML = `<form autocomplete="off"><h1>🔒 FRS Lernwelten</h1><p>Bitte Passwort eingeben.</p>
      <input type="password" id="sgpw" placeholder="Passwort" autocapitalize="off" spellcheck="false">
      <label><input type="checkbox" id="sgkeep"> Auf diesem Gerät merken (nur Lehrer-Gerät)</label>
      <button type="submit">Öffnen</button><p class="err" id="sgerr"></p></form>`;
    document.body.appendChild(g);
    const pw = g.querySelector("#sgpw"); setTimeout(()=>pw.focus(), 50);
    g.querySelector("form").addEventListener("submit", async e => {
      e.preventDefault();
      let h = ""; try{ h = await sha("frs-start:" + pw.value.trim().toLowerCase()); }catch(err){}
      if(h !== HASH){ g.querySelector("#sgerr").textContent = "Passwort falsch."; pw.select(); return; }
      try{ (g.querySelector("#sgkeep").checked ? localStorage : sessionStorage).setItem(KEY, HASH); }catch(err){}
      g.remove(); html.classList.remove("sg-lock");
    });
  }
  if(document.body) show(); else document.addEventListener("DOMContentLoaded", show);
})();
