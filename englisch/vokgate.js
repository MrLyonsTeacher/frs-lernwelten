/* Entschlüsselt die Vokabel-Daten im Browser (AES-GCM, Schlüssel aus Zugangscode). */
(function(){
const KEY="frs-vk";
const b64=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
const getPass=()=>{ try{ return localStorage.getItem(KEY)||""; }catch(e){ return window.__vk||""; } };
const setPass=p=>{ try{ localStorage.setItem(KEY,p); }catch(e){ window.__vk=p; } };
async function dec(pass,o){
  const km=await crypto.subtle.importKey("raw",new TextEncoder().encode(pass),"PBKDF2",false,["deriveKey"]);
  const key=await crypto.subtle.deriveKey({name:"PBKDF2",salt:b64(o.s),iterations:o.i,hash:"SHA-256"},km,{name:"AES-GCM",length:256},false,["decrypt"]);
  return new TextDecoder().decode(await crypto.subtle.decrypt({name:"AES-GCM",iv:b64(o.v)},key,b64(o.c)));
}
function ask(msg){ return new Promise(res=>{
  const d=document.createElement("div"); d.style.cssText="position:fixed;inset:0;z-index:99;background:rgba(20,35,59,.7);display:flex;align-items:center;justify-content:center;padding:16px;font-family:Lexend,system-ui,sans-serif";
  d.innerHTML='<form style="background:#fff;border-radius:18px;padding:20px;max-width:380px;width:100%;color:#14233B"><h2 style="margin:0 0 8px;font-size:20px">🔒 Zugangscode</h2><p style="margin:0 0 10px;font-size:15px">Die Vokabeln sind geschützt. Scanne den QR-Code deiner Lehrkraft erneut oder gib den Zugangscode ein.</p><p id="vkm" style="color:#B3261E;margin:0 0 8px;font-size:14px"></p><input id="vki" type="password" autocomplete="off" style="width:100%;box-sizing:border-box;padding:12px;font:inherit;border:2px solid #C8D2E0;border-radius:10px"><button style="margin-top:10px;width:100%;padding:12px;font:inherit;font-weight:600;border:0;border-radius:10px;background:#1F5FB8;color:#fff;cursor:pointer">Öffnen</button></form>';
  document.body.appendChild(d); d.querySelector("#vkm").textContent=msg||""; const i=d.querySelector("#vki"); i.focus();
  d.querySelector("form").onsubmit=e=>{ e.preventDefault(); const v=i.value.trim(); d.remove(); res(v); };
}); }
window.VOKGATE={
  async run(file,cb){
    let o; try{ o=await (await fetch(file,{cache:"no-cache"})).json(); }catch(e){ document.body.insertAdjacentHTML("beforeend","<p style='padding:20px'>Daten konnten nicht geladen werden.</p>"); return; }
    let pass=getPass(), msg="";
    for(;;){
      if(pass){ try{ const t=await dec(pass,o); setPass(pass); (0,eval)(t); return cb(); }catch(e){ msg="Code stimmt nicht."; try{localStorage.removeItem(KEY);}catch(_){} } }
      pass=await ask(msg);
    }
  }
};
})();
