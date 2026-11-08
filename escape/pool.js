// FRS Escape Rooms: gemeinsamer Rätsel-Pool (wird vom Vulkan und von den Woodlands benutzt).
// Aufruf: const POOL = FRSPool({ esc, rolePieces, existing, fb, img, SHAPES, shuffled, rngFor, beep, nums, penTry });
(function (root) {
"use strict";
root.FRSPool=function(c){
const esc=c.esc,rolePieces=c.rolePieces,existing=c.existing,fb=c.fb,img=c.img,SHAPES=c.SHAPES,shuffled=c.shuffled,rngFor=c.rngFor,beep=c.beep,nums=c.nums,penTry=c.penTry;
/* ---------- Rätsel-Pool: abwechslungsreiche Kammern ---------- */
const INFO=['research','decode','cartographer','radio'];
const WORDS={3:['GAS','ERZ','TAL'],4:['LAVA','GLUT','BERG','RISS'],5:['ASCHE','MAGMA','FEUER','STEIN','FUNKE','BEBEN'],6:['KRATER','VULKAN','SCHLOT','FLAMME']};
const MORSE={A:'.-',B:'-...',C:'-.-.',D:'-..',E:'.',F:'..-.',G:'--.',H:'....',I:'..',J:'.---',K:'-.-',L:'.-..',M:'--',N:'-.',O:'---',P:'.--.',Q:'--.-',R:'.-.',S:'...',T:'-',U:'..-',V:'...-',W:'.--',X:'-..-',Y:'-.--',Z:'--..'};
const ALPHA='ABCDEFGHIJKLMNOPQRSTUVWXYZ';
function morseHtml(c){return '<span class="mo">'+MORSE[c].split('').map(x=>x==='.'?'<i class="dot"></i>':'<i class="dash"></i>').join('')+'</span>'}
function alphaStrip(){return '<div class="alpha">'+ALPHA.split('').map((c,i)=>'<span><b>'+c+'</b>'+(i+1)+'</span>').join('')+'</div>'}
function pick(arr,rnd){return arr[Math.floor(rnd()*arr.length)]}
function xdials(u){
  return '<div class="dials">'+u.vals.map((v,i)=>'<div>'+(u.labels&&u.labels[i]?'<div class="small" style="text-align:center;margin-bottom:4px">'+u.labels[i]+'</div>':'')
    +'<div class="dial"><button data-act="xup" data-i="'+i+'" aria-label="erhöhen">▲</button><div class="dg" id="xd'+i+'">'+esc(u.show(i,v))+'</div><button data-act="xdn" data-i="'+i+'" aria-label="verringern">▼</button></div></div>').join('')+'</div>';
}
function wordInit(len){return {vals:new Array(len).fill(0),mods:new Array(len).fill(26),show:(i,v)=>ALPHA[v]}}
function wordSub(word){
  return function(d,u,a){
    if(a.op!=='sub'||!nums(a.vals,word.length))return null;
    let ok=0;for(let i=0;i<word.length;i++)if(a.vals[i]===ALPHA.indexOf(word[i]))ok++;
    return ok===word.length?{ok:true}:{wrong:ok+' von '+word.length+' Buchstaben stimmen.'};
  };
}
function mechWord(u,lead,btn){return '<p class="lead">'+lead+'</p>'+xdials(u)+'<div><button class="btn primary" data-act="xsub">'+(btn||'Schloss prüfen')+'</button></div>'+fb()+'<p class="small">Ein Fehlversuch kostet '+penTry()+' Sekunden.</p>'}
function noPiece(){return '<p class="lead">In dieser Kammer hast du keinen eigenen Hinweis. Hilf mit, die Hinweise der anderen zusammenzusetzen.</p>'}
const PZ={};

/* 1. Geheimschrift (Caesar) */
PZ.cipher={name:'Die Geheimschrift',atm:'side',
  gen(rnd,st){const len=st<=2?4:(st<=4?5:6),word=pick(WORDS[len],rnd),shift=2+Math.floor(rnd()*(st<=2?5:(st<=4?10:22)));
    return {word,shift,cipher:word.split('').map(c=>ALPHA[(ALPHA.indexOf(c)+shift)%26]).join('')}},
  init(d){return wordInit(d.word.length)},
  role(r,d,u){
    if(r==='mechanic')return mechWord(u,'Du stellst das geheime Wort ein. Es hat '+d.word.length+' Buchstaben. Deine Gruppe entschlüsselt es für dich.');
    if(r==='research'||r==='cartographer'){
      const p=rolePieces(r,d.word.length,['research','cartographer']);
      if(!p.length)return noPiece();
      return '<p class="lead">Das ist ein Teil der verschlüsselten Nachricht. Sag deiner Gruppe die Buchstaben in dieser Reihenfolge.</p><ul class="list">'+p.map(i=>'<li><span class="k">BUCHSTABE '+(i+1)+'</span><span class="v">'+d.cipher[i]+'</span></li>').join('')+'</ul>';
    }
    if(r==='decode')return '<p class="lead">Du kennst den Schlüssel: Der Absender hat jeden Buchstaben um <b>'+d.shift+'</b> Stellen im Alphabet nach vorne geschoben. Zum Entschlüsseln musst du so viele Stellen zurückzählen. Nach A geht es bei Z weiter.</p>'+(existing(['radio']).length?'':'<h3 class="sub">Alphabet</h3>'+alphaStrip());
    if(r==='radio')return '<p class="lead">Du hast das Alphabet mit Nummern. Damit kann man leicht vor- und zurückzählen.</p>'+alphaStrip();
    return noPiece();
  },
  explain(d){return ['Ein geheimes Wort mit '+d.word.length+' Buchstaben öffnet diese Kammer. Es wurde in Geheimschrift verschlüsselt.','Wer die Nachricht hat (Forscher/in), liest die verschlüsselten Buchstaben vor.','Die Entschlüsseler/in kennt den Schlüssel: um wie viele Stellen die Buchstaben verschoben wurden. Zurückzählen im Alphabet ergibt das echte Wort.','Die Mechaniker/in stellt das Wort am Schloss ein.']},
  hint(d,n){if(n===1)return 'Zählt vom verschlüsselten Buchstaben so viele Stellen im Alphabet zurück, wie der Schlüssel sagt.';if(n===2)return 'Der erste Buchstabe des Wortes ist '+d.word[0]+'.';return 'Die ersten beiden Buchstaben sind '+d.word.slice(0,2)+'.'},
  act(d,u,a){return wordSub(d.word)(d,u,a)}
};

/* 2. Kabel-Logik */
const WCOL=[{n:'Rot',c:'#ff5468'},{n:'Blau',c:'#5aa0ff'},{n:'Grün',c:'#4be39a'},{n:'Gelb',c:'#ffd23c'},{n:'Lila',c:'#b57bff'},{n:'Orange',c:'#ff9a3c'}];
function perms(n){const out=[];(function rec(a,rest){if(!rest.length){out.push(a);return}for(let i=0;i<rest.length;i++)rec(a.concat(rest[i]),rest.slice(0,i).concat(rest.slice(i+1)))})([],Array.from({length:n},(_,i)=>i+1));return out}
PZ.wires={name:'Die Schaltwand',atm:'valves',
  gen(rnd,st){
    const N=st<=2?4:(st<=4?5:6),cols=shuffled(WCOL,rnd).slice(0,N),pos=shuffled(Array.from({length:N},(_,i)=>i+1),rnd);
    const pool=[];
    for(let c=0;c<N;c++){
      pool.push({abs:1,t:cols[c].n+' steckt an Anschluss '+pos[c]+'.',f:p=>p[c]===pos[c]});
      for(let k=1;k<=N;k++)if(k!==pos[c])pool.push({abs:1,t:cols[c].n+' steckt nicht an Anschluss '+k+'.',f:p=>p[c]!==k});
      for(let e=0;e<N;e++){if(e===c)continue;const df=Math.abs(pos[c]-pos[e]);
        if(pos[c]<pos[e])pool.push({t:cols[c].n+' steckt links von '+cols[e].n+'.',f:p=>p[c]<p[e]});
        if(c<e){
          if(df===1)pool.push({t:cols[c].n+' und '+cols[e].n+' stecken direkt nebeneinander.',f:p=>Math.abs(p[c]-p[e])===1});
          else pool.push({t:cols[c].n+' und '+cols[e].n+' stecken nicht nebeneinander.',f:p=>Math.abs(p[c]-p[e])!==1});
          if(df===2)pool.push({t:'Zwischen '+cols[c].n+' und '+cols[e].n+' liegt genau ein Anschluss.',f:p=>Math.abs(p[c]-p[e])===2});
        }}
    }
    const list=shuffled(pool,rnd);
    let cand=perms(N);const used=[];
    while(cand.length>1){
      const rel=list.filter(x=>!x.abs&&used.indexOf(x.t)<0),ab=list.filter(x=>x.abs&&used.indexOf(x.t)<0);
      let src=(st>2?rel:rel.concat(ab)).slice(0,30),best=null,bn=cand.length;
      src.forEach(cl=>{const nx=cand.filter(cl.f);if(nx.length<bn){bn=nx.length;best={cl,nx}}});
      if(!best){src=ab.slice(0,30);src.forEach(cl=>{const nx=cand.filter(cl.f);if(nx.length<bn){bn=nx.length;best={cl,nx}}})}
      if(!best)break;
      used.push(best.cl.t);cand=best.nx;
    }
    return {N,cols,pos,clues:used,uc:cand.length};
  },
  init(d){return {vals:new Array(d.N).fill(1),mods:new Array(d.N).fill(d.N),mins:new Array(d.N).fill(1),show:(i,v)=>String(v),labels:d.cols.map(c=>'<span style="color:'+c.c+';font-weight:800">'+c.n+'</span>')}},
  role(r,d,u){
    if(r==='mechanic')return mechWord(u,'Du steckst die Kabel an der Schaltwand ein. Jede Farbe gehört an einen eigenen Anschluss von 1 bis '+d.N+' (von links nach rechts). Deine Gruppe findet heraus, wohin welches Kabel gehört.','Schaltwand prüfen');
    const p=rolePieces(r,d.clues.length,INFO);if(!p.length)return noPiece();
    return '<p class="lead">Das sind deine Hinweise zur Schaltwand. Die Hinweise der anderen brauchst du auch. Nur zusammen passt alles.</p><ul class="list">'+p.map(i=>'<li><span>'+esc(d.clues[i])+'</span></li>').join('')+'</ul>';
  },
  explain(d){return ['An der Schaltwand müssen '+d.N+' farbige Kabel an den richtigen Anschlüssen stecken (1 bis '+d.N+' von links nach rechts).','Jede Person kennt ein paar Hinweise, wo welches Kabel steckt oder in welcher Beziehung Kabel zueinander stehen.','Sammelt alle Hinweise und schließt Möglichkeiten aus, bis genau eine Anordnung übrig ist.','Die Mechaniker/in stellt die Anschlüsse ein und prüft.']},
  hint(d,n){if(n===1)return 'Schreibt die Anschlüsse 1 bis '+d.N+' auf und tragt Hinweis für Hinweis die Farben ein.';if(n===2)return d.cols[0].n+' steckt an Anschluss '+d.pos[0]+'.';return d.cols[0].n+' steckt an Anschluss '+d.pos[0]+' und '+d.cols[1].n+' an Anschluss '+d.pos[1]+'.'},
  act(d,u,a){
    if(a.op!=='sub'||!nums(a.vals,d.N))return null;
    if(new Set(a.vals).size!==d.N)return {wrong:'Jeder Anschluss darf nur einmal vorkommen.'};
    let ok=0;for(let i=0;i<d.N;i++)if(a.vals[i]===d.pos[i])ok++;
    return ok===d.N?{ok:true}:{wrong:ok+' von '+d.N+' Kabeln stecken richtig.'};
  }
};

/* 3. Waage */
const SL='ABCDEFGHI';
PZ.scales={name:'Die Waage',atm:'meta',
  gen(rnd,st){
    const N=st<=2?6:(st<=4?8:9),h=Math.floor(rnd()*N),light=st>=5&&rnd()<.5;
    let cand=Array.from({length:N},(_,i)=>i),ws=[];
    for(let t=0;t<120&&!(cand.length===1&&ws.length>=3+(st>=4?1:0));t++){
      const k=1+Math.floor(rnd()*Math.min(3,Math.floor(N/2))),sh=shuffled(Array.from({length:N},(_,i)=>i),rnd),L=sh.slice(0,k).sort((a,b)=>a-b),R=sh.slice(k,2*k).sort((a,b)=>a-b);
      let res='E';if(L.indexOf(h)>=0)res=light?'R':'L';else if(R.indexOf(h)>=0)res=light?'L':'R';  // welche Schale sinkt
      let nx;
      if(res==='E')nx=cand.filter(x=>L.indexOf(x)<0&&R.indexOf(x)<0);
      else{const side=(res==='L')===!light?L:R;nx=cand.filter(x=>side.indexOf(x)>=0)}
      if(cand.length>1&&nx.length>=cand.length)continue;
      ws.push({L,R,res});cand=nx;
    }
    return {N,h,light,ws,uc:cand.length};
  },
  init(d){return {sel:null}},
  wtext(d,w){return w.L.map(i=>SL[i]).join(' + ')+'  gegen  '+w.R.map(i=>SL[i]).join(' + ')+'  →  '+(w.res==='E'?'Gleichgewicht':(w.res==='L'?'linke':'rechte')+' Schale sinkt')},
  role(r,d,u){
    if(r==='mechanic'){
      return '<p class="lead">Du zeigst auf den Stein, den deine Gruppe für den Besonderen hält. Tippe ihn an und bestätige.</p>'
        +'<div class="keys" style="grid-template-columns:repeat(3,1fr)">'+Array.from({length:d.N},(_,i)=>'<button class="key" data-act="xpick" data-i="'+i+'" aria-pressed="'+(u.sel===i)+'"'+(u.sel===i?' style="border-color:var(--lava);background:#3a1d12"':'')+'>'+SL[i]+'</button>').join('')+'</div>'
        +'<div><button class="btn primary" data-act="xsubsel"'+(u.sel==null?' disabled':'')+'>'+(u.sel==null?'Wähle einen Stein':'Stein '+SL[u.sel]+' melden')+'</button></div>'+fb();
    }
    if(r==='decode')return '<p class="lead">Du kennst die Regel der Waage: Unter den '+d.N+' Steinen (A bis '+SL[d.N-1]+') ist genau einer <b>'+(d.light?'leichter':'schwerer')+'</b> als die anderen. Die Schale, in der er liegt, '+(d.light?'steigt':'sinkt')+'. Die Wägungen haben andere in deiner Gruppe.</p>';
    const p=rolePieces(r,d.ws.length,['research','cartographer','radio']);if(!p.length)return noPiece();
    return '<p class="lead">Das sind Ergebnisse von Wägungen. Wer die Regel kennt, sagt dir, was sie bedeuten.</p><ul class="list">'+p.map(i=>'<li><span class="k">WÄGUNG '+(i+1)+'</span><span>'+esc(PZ.scales.wtext(d,d.ws[i]))+'</span></li>').join('')+'</ul>';
  },
  explain(d){return ['Unter '+d.N+' Steinen ist einer '+(d.light?'leichter':'schwerer')+' als die anderen. Ihr müsst ihn finden.','Mehrere Wägungen sind schon gemacht. Die Ergebnisse liegen bei den Personen mit Karten.','Die Entschlüsseler/in kennt die Regel: Ist der besondere Stein schwerer oder leichter, und was bedeutet das für die Schalen?','Die Mechaniker/in meldet den Stein.']},
  hint(d,n){const o=(d.h+1)%d.N;if(n===1)return 'Steine, die in einer Wägung mit Gleichgewicht vorkommen, sind unverdächtig.';if(n===2)return 'Der gesuchte Stein ist nicht '+SL[o]+'.';return 'Der gesuchte Stein ist '+SL[d.h]+' oder '+SL[o]+'.'},
  act(d,u,a){if(a.op!=='sub'||typeof a.i!=='number')return null;return a.i===d.h?{ok:true}:{wrong:'Das ist nicht der gesuchte Stein.'}}
};

/* 4. Schatzkarte */
PZ.map={name:'Die Schatzkarte',atm:'lava',
  gen(rnd,st){
    const N=st<=2?5:(st<=4?6:7),steps=st<=2?2:(st<=4?3:4),cells=shuffled(Array.from({length:N*N},(_,i)=>i),rnd),lm=[];
    for(let s=0;s<6;s++)lm.push({s,x:cells[s]%N,y:Math.floor(cells[s]/N)});
    for(let tries=0;tries<200;tries++){
      const st0=lm[Math.floor(rnd()*6)];let x=st0.x,y=st0.y;const mv=[];let okk=true;
      for(let k=0;k<steps&&okk;k++){
        const opts=[];[['rechts',1,0],['links',-1,0],['oben',0,-1],['unten',0,1]].forEach(o=>{for(let n=1;n<=3;n++){const nx=x+o[1]*n,ny=y+o[2]*n;if(nx>=0&&nx<N&&ny>=0&&ny<N&&(!mv.length||mv[mv.length-1].dir!==o[0]))opts.push({dir:o[0],n,nx,ny})}});
        if(!opts.length){okk=false;break}
        const o=pick(opts,rnd);mv.push(o);x=o.nx;y=o.ny;
      }
      if(okk&&!(x===st0.x&&y===st0.y))return {N,lm,start:st0.s,mv,ans:[x,y]};
    }
    return {N,lm,start:lm[0].s,mv:[{dir:'rechts',n:1,nx:lm[0].x+1,ny:lm[0].y}],ans:[lm[0].x+1,lm[0].y]};
  },
  init(d){return {vals:[0,0],mods:[d.N,d.N],show:(i,v)=>i===0?ALPHA[v]:String(v+1),labels:['Spalte','Zeile']}},
  steps(d){const a=['Starte bei dem Zeichen '+SHAPES[d.start]+'.'];d.mv.forEach(m=>a.push('Gehe '+m.n+' Feld'+(m.n>1?'er':'')+' nach '+m.dir+'.'));a.push('Dort liegt der Schatz.');return a},
  role(r,d,u){
    if(r==='mechanic')return mechWord(u,'Du gibst das Feld ein, auf dem der Schatz liegt: erst die Spalte (Buchstabe), dann die Zeile (Zahl).','Schatz melden');
    if(r==='research'){
      let t='<table class="map"><tr><th></th>'+Array.from({length:d.N},(_,i)=>'<th>'+ALPHA[i]+'</th>').join('')+'</tr>';
      for(let y=0;y<d.N;y++){t+='<tr><th>'+(y+1)+'</th>';for(let x=0;x<d.N;x++){const m=d.lm.find(q=>q.x===x&&q.y===y);t+='<td>'+(m?img(m.s):'')+'</td>'}t+='</tr>'}
      return '<p class="lead">Du hast die Karte. Die Wegbeschreibung hat jemand anderes. Hilf, den Weg auf der Karte zu verfolgen und das Zielfeld zu nennen.</p>'+t+'</table>';
    }
    const st=PZ.map.steps(d),p=rolePieces(r,st.length,['decode','cartographer','radio']);if(!p.length)return noPiece();
    return '<p class="lead">Das ist ein Teil der Wegbeschreibung zum Schatz. Die Karte hat jemand anderes.</p><ul class="list">'+p.map(i=>'<li><span class="k">SCHRITT '+(i+1)+'</span><span>'+esc(st[i])+'</span></li>').join('')+'</ul>';
  },
  explain(d){return ['Der Schatz liegt auf einem Feld der Karte. Spalten sind Buchstaben, Zeilen sind Zahlen (Zeile 1 ist oben).','Die Forscher/in hat die Karte mit den Zeichen.','Die anderen haben die Wegbeschreibung: Start-Zeichen, dann Schritt für Schritt Richtungen.','Die Mechaniker/in gibt Spalte und Zeile des Ziels ein.']},
  hint(d,n){if(n===1)return 'Fangt bei dem Zeichen an und zählt die Felder einzeln auf der Karte ab.';if(n===2)return 'Das Ziel liegt in Spalte '+ALPHA[d.ans[0]]+'.';return 'Das Ziel liegt in Spalte '+ALPHA[d.ans[0]]+' und in der '+(d.ans[1]<d.N/2?'oberen':'unteren')+' Hälfte der Karte.'},
  act(d,u,a){if(a.op!=='sub'||!nums(a.vals,2))return null;return a.vals[0]===d.ans[0]&&a.vals[1]===d.ans[1]?{ok:true}:{wrong:'Das ist nicht das Zielfeld.'}}
};

/* 5. Zahlenreihe */
PZ.sequence={name:'Die Zahlenreihe',atm:'crystal',
  gen(rnd,st){
    const kinds=st<=2?['add']:(st<=4?['add','quad','mul']:['quad','fib','mulp','alt']);
    for(let t=0;t<100;t++){
      const kind=pick(kinds,rnd);let a=[];
      if(kind==='add'){const d=2+Math.floor(rnd()*8),s=1+Math.floor(rnd()*20);for(let i=0;i<8;i++)a.push(s+d*i)}
      else if(kind==='quad'){const d=1+Math.floor(rnd()*3),e=1+Math.floor(rnd()*3),s=Math.floor(rnd()*10);let v=s,df=d;for(let i=0;i<8;i++){a.push(v);v+=df;df+=e}}
      else if(kind==='mul'){const m=2+Math.floor(rnd()*2),s=1+Math.floor(rnd()*3);for(let i=0;i<8;i++)a.push(s*Math.pow(m,i))}
      else if(kind==='fib'){const x=1+Math.floor(rnd()*4),y=1+Math.floor(rnd()*5);a=[x,y];for(let i=2;i<8;i++)a.push(a[i-1]+a[i-2])}
      else if(kind==='mulp'){const m=2,c=Math.floor(rnd()*3)-1||1,s=1+Math.floor(rnd()*3);a=[s];for(let i=1;i<8;i++)a.push(a[i-1]*m+c)}
      else{const p=3+Math.floor(rnd()*6),q=1+Math.floor(rnd()*(p-1)),s=5+Math.floor(rnd()*20);a=[s];for(let i=1;i<8;i++)a.push(a[i-1]+(i%2?p:-q))}
      if(a.every(v=>v>=0&&v<1000)&&new Set(a).size>=6)return {kind,terms:a.slice(0,7),ans:a[7]};
    }
    return {kind:'add',terms:[2,4,6,8,10,12,14],ans:16};
  },
  tip(k){return {add:'Schaut auf den Abstand zwischen zwei Nachbarn. Er bleibt immer gleich.',quad:'Der Abstand zwischen den Nachbarn bleibt nicht gleich. Er ändert sich selbst regelmäßig.',mul:'Vergleicht jede Zahl mit der davor: Sie wird jedes Mal vervielfacht.',fib:'Zwei Zahlen nebeneinander ergeben zusammen die nächste.',mulp:'Erst wird vervielfacht, dann kommt immer dieselbe kleine Zahl dazu oder weg.',alt:'Abwechselnd wird etwas addiert und etwas abgezogen.'}[k]},
  init(d){return {vals:[0,0,0],mods:[10,10,10],show:(i,v)=>String(v)}},
  role(r,d,u){
    if(r==='mechanic'){const x=u.vals;return mechWord(u,'Du stellst die nächste Zahl der Reihe ein (bis zu drei Stellen). Deine Gruppe findet die Regel und rechnet sie aus.','Zahl melden')}
    const p=rolePieces(r,d.terms.length,INFO),tip=r==='decode'?'<div class="hint">'+esc(PZ.sequence.tip(d.kind))+'</div>':'';
    if(!p.length&&!tip)return noPiece();
    return '<p class="lead">Eine Zahlenreihe hat eine Regel. Ihr kennt jeweils nur einzelne Zahlen. Gesucht ist das 8. Glied.</p>'+(p.length?'<ul class="list">'+p.map(i=>'<li><span class="k">GLIED '+(i+1)+'</span><span class="v">'+d.terms[i]+'</span></li>').join('')+'</ul>':'')+tip;
  },
  explain(d){return ['Eine Zahlenreihe folgt einer Regel. Gesucht ist die 8. Zahl.','Jede Person kennt nur einzelne Zahlen der Reihe. Nennt sie euch der Reihe nach.','Die Entschlüsseler/in hat einen Tipp zur Art der Regel.','Die Mechaniker/in stellt die gesuchte Zahl ein.']},
  hint(d,n){if(n===1)return PZ.sequence.tip(d.kind);if(n===2)return 'Die gesuchte Zahl hat '+(d.ans>=100?'drei':(d.ans>=10?'zwei':'eine'))+' Stelle'+(d.ans>=10?'n':'')+'.';return 'Die gesuchte Zahl ist '+(d.ans%2?'ungerade':'gerade')+' und liegt zwischen '+Math.max(0,d.ans-6)+' und '+(d.ans+6)+'.'},
  act(d,u,a){if(a.op!=='sub'||!nums(a.vals,3))return null;return a.vals[0]*100+a.vals[1]*10+a.vals[2]===d.ans?{ok:true}:{wrong:'Das ist nicht die nächste Zahl.'}}
};

/* 6. Schalter-Rätsel */
PZ.switches={name:'Die Schalttafel',atm:'core',
  gen(rnd,st){
    const S=st<=2?3:(st<=4?4:5),rules=[];
    for(let i=0;i<S;i++){const k=1+Math.floor(rnd()*(st<=2?2:3));rules.push(shuffled(Array.from({length:S},(_,j)=>j),rnd).slice(0,k).sort((a,b)=>a-b))}
    for(let t=0;t<50;t++){
      const sol=Array.from({length:S},()=>rnd()<.5?1:0),sn=sol.reduce((a,b)=>a+b,0);if(sn<(st<=2?1:2)||(st<=2&&sn>2))continue;
      const lamps=new Array(S).fill(1);sol.forEach((p,i)=>{if(p)rules[i].forEach(j=>{lamps[j]^=1})});
      if(lamps.some(x=>!x))return {S,rules,start:lamps,sol,max:2*S+2};
    }
    return {S,rules:Array.from({length:S},(_,i)=>[i]),start:[0,1,1,1,1,1].slice(0,S),sol:[1,0,0,0,0,0].slice(0,S),max:2*S+2};
  },
  init(d){return {lamps:d.start.slice(),presses:0}},
  lampRow(d,u){return '<div class="lamps" aria-label="Lampen">'+u.lamps.map((v,i)=>'<span class="lamp '+(v?'on':'')+'" aria-label="Lampe '+(i+1)+(v?' an':' aus')+'">'+(i+1)+'</span>').join('')+'</div><p class="small">Schaltungen: '+u.presses+' von '+d.max+'</p>'},
  role(r,d,u){
    const row=PZ.switches.lampRow(d,u);
    if(r==='mechanic')return '<p class="lead">Du bedienst die Schalter. Alle Lampen sollen leuchten. Jeder Schalter schaltet bestimmte Lampen um. Welche, wissen die anderen.</p>'+row+'<div class="keys" style="grid-template-columns:repeat(3,1fr)">'+Array.from({length:d.S},(_,i)=>'<button class="key" data-act="xpress" data-i="'+i+'">'+(i+1)+'</button>').join('')+'</div>'+fb();
    const p=rolePieces(r,d.rules.length,INFO);if(!p.length)return '<p class="lead">Du siehst die Lampen und hilfst beim Planen.</p>'+row;
    return '<p class="lead">Das sind die Regeln einiger Schalter. Die anderen kennen die übrigen.</p><ul class="list">'+p.map(i=>'<li><span class="k">SCHALTER '+(i+1)+'</span><span>schaltet Lampe '+d.rules[i].map(j=>j+1).join(' und ')+' um</span></li>').join('')+'</ul>'+row;
  },
  explain(d){return ['Alle '+d.S+' Lampen sollen gleichzeitig leuchten. Die Mechaniker/in bedient die Schalter, höchstens '+d.max+'-mal, sonst beginnt alles von vorn.','Jeder Schalter schaltet immer dieselben Lampen um: An wird aus, aus wird an. Beispiel: Schalter 2 schaltet Lampe 1 und 3 um. Ist Lampe 1 aus und Lampe 3 an, ist danach Lampe 1 an und Lampe 3 aus.','Die Regeln der Schalter sind auf alle Personen verteilt. Sagt sie euch und plant, welche Schalter gedrückt werden.']},
  hint(d,n){const first=d.sol.indexOf(1);if(n===1)return 'Ein Schalter, den ihr zweimal drückt, hebt sich selbst auf. Jeder Schalter wird höchstens einmal gebraucht.';if(n===2)return 'Schaut zuerst, welche Lampen noch aus sind, und welche Schalter diese Lampen umschalten.';return 'Schalter '+(first+1)+' gehört zur Lösung.'},
  act(d,u,a){
    if(a.op!=='press'||typeof a.i!=='number'||a.i<0||a.i>=d.S)return null;
    d.rules[a.i].forEach(j=>{u.lamps[j]^=1});u.presses++;beep(260+a.i*40,.08,'triangle',.06);
    if(u.lamps.every(Boolean))return {ok:true};
    if(u.presses>=d.max){u.lamps=d.start.slice();u.presses=0;return {wrong:'Zu viele Schaltungen. Alle Lampen sind wieder wie am Anfang.'}}
    return {render:true};
  }
};

/* 7. Lichtsignale (Morse) */
PZ.morse={name:'Die Lichtsignale',atm:'gate',
  gen(rnd,st){const len=st<=2?3:(st<=4?4:5);return {word:pick(WORDS[len],rnd)}},
  init(d){return wordInit(d.word.length)},
  role(r,d,u){
    if(r==='mechanic')return mechWord(u,'Du stellst das Wort ein, das deine Gruppe aus den Lichtsignalen entschlüsselt. Es hat '+d.word.length+' Buchstaben.');
    if(r==='research')return '<p class="lead">Du siehst die Lichtsignale. Jeder Block ist ein Buchstabe. Ein Punkt ist ein kurzes Signal, ein Strich ein langes. Beschreibe sie deiner Gruppe der Reihe nach.</p><ul class="list">'+d.word.split('').map((c,i)=>'<li><span class="k">BUCHSTABE '+(i+1)+'</span>'+morseHtml(c)+'</li>').join('')+'</ul>';
    const p=rolePieces(r,26,['decode','cartographer','radio']);if(!p.length)return noPiece();
    return '<p class="lead">Du hast einen Teil der Morse-Tabelle. Sag deiner Gruppe, welcher Buchstabe zu welchem Signal gehört.</p><ul class="list">'+p.map(i=>'<li><b class="v" style="min-width:28px">'+ALPHA[i]+'</b>'+morseHtml(ALPHA[i])+'</li>').join('')+'</ul>';
  },
  explain(d){return ['Ein Wort mit '+d.word.length+' Buchstaben wird als Morse-Lichtsignal gezeigt: kurz und lang.','Die Forscher/in sieht die Signale und beschreibt sie.','Die Tabelle, welches Signal welcher Buchstabe ist, ist auf die anderen verteilt.','Die Mechaniker/in stellt das Wort ein.']},
  hint(d,n){if(n===1)return 'Ein Punkt ist kurz, ein Strich ist lang. Jeder Block ist ein Buchstabe. Vergleicht jedes Signal mit der Tabelle.';if(n===2)return 'Der erste Buchstabe des Wortes ist '+d.word[0]+'.';return 'Die ersten beiden Buchstaben sind '+d.word.slice(0,2)+'.'},
  act(d,u,a){return wordSub(d.word)(d,u,a)}
};

function px(id){return typeof id==='string'&&id.indexOf('x:')===0?id.slice(2):null}
function expandOrder(tpl,seed){const types=shuffled(Object.keys(PZ),rngFor(seed,500));let k=0;return tpl.map(id=>id==='X'?'x:'+types[(k++)%types.length]:id)}
return {PZ:PZ,px:px,expandOrder:expandOrder,morseHtml:morseHtml,alphaStrip:alphaStrip};
};
})(window);
