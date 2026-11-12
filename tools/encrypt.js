// Verschlüsselt die Vokabel-Daten (quelle/*.js) zu englisch/daten/*.enc
// Aufruf:  ZUGANG='dein-code' node tools/encrypt.js
const fs=require('fs'),c=require('crypto'),path=require('path');
const pass=process.env.ZUGANG; if(!pass||pass.length<8){console.error('ZUGANG (min. 8 Zeichen) fehlt');process.exit(1)}
const R=path.join(__dirname,'..'), Q=f=>fs.readFileSync(path.join(R,'quelle',f),'utf8');
const bundles={ 'vok6.enc':['saetze.js','vokabeln6.js','gruppen6.js'], 'vok8.enc':['saetze.js','vokabeln8a.js','vokabeln8b.js','gruppen8.js'] };
fs.mkdirSync(path.join(R,'englisch/daten'),{recursive:true});
for(const [out,files] of Object.entries(bundles)){
  const salt=c.randomBytes(16), iv=c.randomBytes(12), it=200000;
  const key=c.pbkdf2Sync(pass,salt,it,32,'sha256');
  const ci=c.createCipheriv('aes-256-gcm',key,iv);
  const ct=Buffer.concat([ci.update(files.map(Q).join('\n;\n'),'utf8'),ci.final(),ci.getAuthTag()]);
  fs.writeFileSync(path.join(R,'englisch/daten',out),JSON.stringify({s:salt.toString('base64'),v:iv.toString('base64'),i:it,c:ct.toString('base64')}));
  console.log(out,ct.length,'Bytes');
}
