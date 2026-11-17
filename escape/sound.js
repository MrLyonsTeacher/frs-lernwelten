// FRS Escape Rooms: gemeinsame Klangwelt (Hall, weichere Signaltöne, Atmosphäre je Raum).
// Einbinden: <script src="sound.js"></script>, dann nach dem Anlegen des AudioContext:
//   window.__snd=FRSSound(AU,{room:'vulkan',phase:()=>G.phase,progress:()=>progress()});
// Optionale Aufnahmen: Datei als escape/sfx/<raum>-amb.mp3 ablegen und den Raum unten in FILES eintragen.
(function(root){
'use strict';
const FILES={vulkan:true,wrack:true,bibliothek:true,woodlands:true};
root.FRSSound=function(AU,o){
  const a=AU.ctx;if(!a)return null;
  const S={amb:null,next:0};
  const comp=a.createDynamicsCompressor();comp.threshold.value=-16;comp.ratio.value=4;comp.connect(a.destination);
  const bus=a.createGain();bus.gain.value=1;bus.connect(comp);
  const len=a.sampleRate*2.6,ir=a.createBuffer(2,len,a.sampleRate);
  for(let ch=0;ch<2;ch++){const d=ir.getChannelData(ch);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,2.8)}
  const rev=a.createConvolver();rev.buffer=ir;const rg=a.createGain();rg.gain.value=.45;rev.connect(rg);rg.connect(comp);
  const nl=a.sampleRate*4,white=a.createBuffer(1,nl,a.sampleRate),brown=a.createBuffer(1,nl,a.sampleRate);let last=0;
  const wd=white.getChannelData(0),bd=brown.getChannelData(0);for(let i=0;i<nl;i++){const w=Math.random()*2-1;wd[i]=w;last=(last+.02*w)/1.02;bd[i]=last*3.5}
  function send(node,dry,wet){if(dry){const g=a.createGain();g.gain.value=dry;node.connect(g);g.connect(bus)}if(wet){const g=a.createGain();g.gain.value=wet;node.connect(g);g.connect(rev)}}
  function noise(b){const s=a.createBufferSource();s.buffer=b?brown:white;s.loop=true;return s}
  function env(g,t,at,peak,hold,rel){g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(peak,t+at);g.gain.setValueAtTime(peak,t+at+hold);g.gain.exponentialRampToValueAtTime(.0001,t+at+hold+rel)}
  function bell(f,t,d,v,wet){const g=a.createGain();env(g,t,.008,v,0,d);[[1,'sine',1],[2,'sine',.25],[3.01,'triangle',.08]].forEach(([m,ty,amp])=>{const os=a.createOscillator(),og=a.createGain();os.type=ty;os.frequency.value=f*m;og.gain.value=amp;os.connect(og);og.connect(g);os.start(t);os.stop(t+d+.1)});send(g,1,wet)}

  /* Ersatz für die alten Piepser: gleiche Aufrufe, aber weicher, wärmer und mit Raumklang */
  function beep(f,d,type,v){
    const t=a.currentTime;v=v||.12;
    if(!type||type==='sine'||type==='triangle'){bell(f,t,Math.max(d,.35),v*.9,.35);return}
    // tiefe Säge/Rechteck = Fehler oder Warnung: gefiltert und doppelt, statt schrill
    const lp=a.createBiquadFilter();lp.type='lowpass';lp.frequency.setValueAtTime(Math.min(2400,f*8),t);lp.frequency.exponentialRampToValueAtTime(Math.max(200,f*2),t+d);lp.Q.value=2;
    const g=a.createGain();env(g,t,.01,v*1.1,d*.2,d);
    [-6,6].forEach(c=>{const os=a.createOscillator();os.type=type;os.frequency.value=f;os.detune.value=c;os.connect(lp);os.start(t);os.stop(t+d*1.3+.1)});
    lp.connect(g);send(g,1,.2);
  }

  /* Atmosphäre je Raum */
  function stopAmb(){if(!S.amb)return;const x=S.amb;x.g.gain.setTargetAtTime(0,a.currentTime,.7);setTimeout(()=>x.nodes.forEach(n=>{try{n.stop()}catch(e){}}),3500);S.amb=null}
  function startAmb(){if(S.amb)return;const t=a.currentTime,g=a.createGain(),nodes=[];g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(1,t+3);send(g,1,.25);S.amb={g:g,nodes:nodes};
    if(S.file){const s=a.createBufferSource();s.buffer=S.file;s.loop=true;s.loopStart=.06;s.loopEnd=S.file.duration-.06;const v=a.createGain();v.gain.value=1.8;s.connect(v);v.connect(g);s.start(t,.06);nodes.push(s);S.amb.file=true;return}
    const lfo=(rate,depth,target)=>{const os=a.createOscillator(),d=a.createGain();os.frequency.value=rate;d.gain.value=depth;os.connect(d);d.connect(target);os.start();nodes.push(os)};
    const band=(fc,q,v,lr,ld,b)=>{const n=noise(b!==false),bp=a.createBiquadFilter(),vg=a.createGain();bp.type='bandpass';bp.frequency.value=fc;bp.Q.value=q;vg.gain.value=v;n.connect(bp);bp.connect(vg);vg.connect(g);n.start();nodes.push(n);if(lr){lfo(lr,ld,bp.frequency);lfo(lr*.7,v*.5,vg.gain)}};
    const drone=(f,ty,v,lp)=>{const os=a.createOscillator(),fl=a.createBiquadFilter(),vg=a.createGain();os.type=ty;os.frequency.value=f;fl.type='lowpass';fl.frequency.value=lp||400;vg.gain.value=v;os.connect(fl);fl.connect(vg);vg.connect(g);os.start();nodes.push(os)};
    const r=o.room;
    if(r==='vulkan'){band(70,.7,.45,.05,25);band(260,1,.12,.09,90);drone(41,'sawtooth',.03,120)}
    if(r==='wrack'){band(160,.8,.3,.04,60);drone(55,'sine',.05);drone(82.4,'sine',.025);band(500,3,.03,.07,150)}
    if(r==='bibliothek'){drone(220,'sine',.012);drone(277.2,'sine',.008);drone(329.6,'sine',.008);band(1200,.8,.03,.05,500,false)}
    if(r==='woodlands'){band(700,.6,.12,.08,350,false);band(2200,1.5,.02,.11,800,false);drone(65.4,'sine',.02)}
  }
  /* zufällige Einzelgeräusche */
  function events(){const t=a.currentTime;if(t<S.next||S.amb&&S.amb.file)return;const r=o.room;
    if(r==='vulkan'){ // Lava-Blubbern
      for(let i=0;i<1+Math.floor(Math.random()*3);i++){const tt=t+i*.18,os=a.createOscillator(),g=a.createGain(),f=60+Math.random()*70;os.type='sine';os.frequency.setValueAtTime(f,tt);os.frequency.exponentialRampToValueAtTime(f*2.6,tt+.12);env(g,tt,.005,.18,0,.16);os.connect(g);send(g,1,.3);os.start(tt);os.stop(tt+.3)}
      S.next=t+1.5+Math.random()*3}
    else if(r==='wrack'){ // Luftblasen und Ächzen des Schiffs
      if(Math.random()<.7){for(let i=0;i<2+Math.floor(Math.random()*4);i++){const tt=t+i*.09,os=a.createOscillator(),g=a.createGain(),f=300+Math.random()*500;os.frequency.setValueAtTime(f,tt);os.frequency.exponentialRampToValueAtTime(f*2.2,tt+.07);env(g,tt,.004,.07,0,.08);os.connect(g);send(g,1,.5);os.start(tt);os.stop(tt+.2)}}
      else{const os=a.createOscillator(),lp=a.createBiquadFilter(),g=a.createGain();os.type='sawtooth';os.frequency.setValueAtTime(70,t);os.frequency.linearRampToValueAtTime(52,t+1.6);lp.type='lowpass';lp.frequency.value=380;lp.Q.value=8;env(g,t,.4,.08,.6,1);os.connect(lp);lp.connect(g);send(g,1,.5);os.start(t);os.stop(t+2.2)}
      S.next=t+2+Math.random()*4}
    else if(r==='bibliothek'){ // Tintentropfen und Seitenrascheln
      if(Math.random()<.6){const f=[1046.5,1174.7,1318.5,1568,1760][Math.floor(Math.random()*5)];bell(f,t,1.4,.03,.8)}
      else{const n=noise(),bp=a.createBiquadFilter(),g=a.createGain();bp.type='bandpass';bp.frequency.value=3500;bp.Q.value=.7;env(g,t,.05,.05,.15,.25);n.connect(bp);bp.connect(g);send(g,1,.2);n.start(t);n.stop(t+.6)}
      S.next=t+2.5+Math.random()*4}
    else if(r==='woodlands'){ // Grillen, Eule, Elfenglöckchen
      const x=Math.random();
      if(x<.5){for(let i=0;i<6;i++){const tt=t+i*.07,os=a.createOscillator(),g=a.createGain();os.frequency.value=4300+Math.random()*200;env(g,tt,.005,.015,.02,.03);os.connect(g);send(g,1,.1);os.start(tt);os.stop(tt+.1)}S.next=t+.8+Math.random()*1.5}
      else if(x<.65){[[0,392],[.45,349.2],[.62,349.2]].forEach(([dt,f])=>{const tt=t+dt,os=a.createOscillator(),g=a.createGain();os.frequency.setValueAtTime(f,tt);os.frequency.linearRampToValueAtTime(f*.93,tt+.3);env(g,tt,.05,.05,.12,.2);os.connect(g);send(g,1,.6);os.start(tt);os.stop(tt+.5)});S.next=t+5+Math.random()*6}
      else{[2093,2637,3136].forEach((f,i)=>bell(f,t+i*.11,1.2,.015,.9));S.next=t+4+Math.random()*5}}
  }
  function tick(){const play=AU.on&&o.phase()==='play';if(play){startAmb();events()}else stopAmb()}
  setInterval(tick,400);
  if(FILES[o.room])fetch('sfx/'+o.room+'-amb.mp3').then(r=>r.ok?r.arrayBuffer():null).then(b=>b&&new Promise((ok,no)=>a.decodeAudioData(b,ok,no))).then(buf=>{if(buf){S.file=buf;stopAmb()}}).catch(()=>{});
  return {beep:beep,bell:bell};
};
})(window);
