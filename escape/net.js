// FRS Escape Rooms: Verbindung der Geräte einer Gruppe über den Vermittlungsdienst (siehe escape/relay).
//
//   const room = await FRSNet.connect(relayAdresse, "feuer1");
//   room.on("act", m => ...);          // m = { topic, data, peer, isMe, sameTab, kind }
//   room.emit("act", { ... });         // geht an alle Geräte der Gruppe, auch zurück an dich
//   room.peers();                      // alle Geräte der Gruppe (du eingeschlossen)
//   room.onPeers(ch => ...);           // ch = { peers, joined, left }
//   room.onConnection(ok => ...);      // Verbindung steht / ist weg (wird automatisch neu aufgebaut)
//   room.ping().then(ms => ...);       // Antwortzeit
//   room.leave();
(function (root) {
  "use strict";

  function randId() {
    var a = "abcdefghijklmnopqrstuvwxyz0123456789", s = "";
    for (var i = 0; i < 10; i++) s += a.charAt(Math.floor(Math.random() * a.length));
    return s;
  }
  // Jede Seite (Tab) bekommt eine feste Kennung, damit eine Neuverbindung dieselbe Person bleibt.
  function myCid() {
    try {
      var v = sessionStorage.getItem("frs-cid");
      if (v && /^[a-z0-9]{6,16}$/.test(v)) return v;
      v = randId();
      sessionStorage.setItem("frs-cid", v);
      return v;
    } catch (e) { return randId(); }
  }
  function relayUrl() {
    var u = "";
    try { u = (root.FRS_ESCAPE && root.FRS_ESCAPE.relay) || localStorage.getItem("frs-relay") || ""; } catch (e) {}
    return String(u || "").trim();
  }
  function normalize(u) {
    u = String(u || "").trim().replace(/\/+$/, "");
    if (!u) return "";
    if (/^https:\/\//i.test(u)) u = "wss://" + u.slice(8);
    else if (/^http:\/\//i.test(u)) u = "ws://" + u.slice(7);
    else if (!/^wss?:\/\//i.test(u)) u = "wss://" + u;
    return u;
  }
  function cleanCode(c) {
    return String(c || "").trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9_.-]/g, "").slice(0, 48);
  }

  function connect(relay, code, opts) {
    opts = opts || {};
    var base = normalize(relay), name = cleanCode(code), cid = myCid();
    return new Promise(function (resolve, reject) {
      if (!base) { reject(new Error("no-relay")); return; }
      if (!name) { reject(new Error("no-code")); return; }
      if (typeof WebSocket === "undefined") { reject(new Error("no-websocket")); return; }

      var url = base + "/ws/" + encodeURIComponent(name) + "?c=" + cid;
      var ws = null, conn = false, left = false, first = true, tries = 0, retryT = 0, pingN = 0;
      var peerSet = {}, handlers = {}, peerHs = [], connHs = [], pings = {};

      function snapshot() {
        return Object.keys(peerSet).sort().map(function (id) {
          return { peer: id, by: null, isMe: id === cid, sameTab: id === cid, kind: "viewer", guest: false, presence: {}, updatedAt: 0 };
        });
      }
      function callPeers(joined, gone) {
        var snap = snapshot();
        peerHs.slice().forEach(function (h) { try { h({ peers: snap, joined: joined, left: gone, updated: [] }); } catch (e) {} });
      }
      function setConn(v) {
        if (conn === v) return;
        conn = v;
        connHs.slice().forEach(function (h) { try { h(v); } catch (e) {} });
      }
      function applyWelcome(list) {
        var old = peerSet, next = {};
        next[cid] = true;
        (list || []).forEach(function (id) { if (typeof id === "string") next[id] = true; });
        peerSet = next;
        var j = [], g = [];
        Object.keys(next).forEach(function (id) { if (!old[id]) j.push(id); });
        Object.keys(old).forEach(function (id) { if (!next[id]) g.push(id); });
        var snap = snapshot();
        callPeers(snap.filter(function (p) { return j.indexOf(p.peer) >= 0; }), g.map(function (id) { return { peer: id, isMe: false, kind: "viewer", presence: {} }; }));
      }

      var room = {
        id: cid,
        code: name,
        emit: function (topic, data) {
          if (!conn || !ws || ws.readyState !== 1) return Promise.reject({ code: "upstream_error", message: "Keine Verbindung" });
          try { ws.send(JSON.stringify({ t: "emit", topic: topic, data: data })); return Promise.resolve(); }
          catch (e) { return Promise.reject({ code: "upstream_error", message: String(e) }); }
        },
        on: function (topic, fn) {
          (handlers[topic] = handlers[topic] || []).push(fn);
          return function () { handlers[topic] = (handlers[topic] || []).filter(function (f) { return f !== fn; }); };
        },
        peers: function () { return snapshot(); },
        onPeers: function (fn) {
          peerHs.push(fn);
          setTimeout(function () { var s = snapshot(); try { fn({ peers: s, joined: s, left: [], updated: [] }); } catch (e) {} }, 0);
          return function () { peerHs = peerHs.filter(function (f) { return f !== fn; }); };
        },
        connected: function () { return conn; },
        onConnection: function (fn) {
          connHs.push(fn);
          setTimeout(function () { try { fn(conn); } catch (e) {} }, 0);
          return function () { connHs = connHs.filter(function (f) { return f !== fn; }); };
        },
        ping: function () {
          return new Promise(function (res, rej) {
            if (!conn || !ws || ws.readyState !== 1) { rej(new Error("offline")); return; }
            var n = ++pingN, t0 = Date.now();
            var to = setTimeout(function () { delete pings[n]; rej(new Error("timeout")); }, 5000);
            pings[n] = function () { clearTimeout(to); res(Date.now() - t0); };
            try { ws.send(JSON.stringify({ t: "ping", n: n })); } catch (e) { clearTimeout(to); delete pings[n]; rej(e); }
          });
        },
        leave: function () {
          left = true; clearTimeout(retryT);
          try { if (ws) ws.close(1000, "leave"); } catch (e) {}
          setConn(false);
          return Promise.resolve();
        }
      };

      var firstTimer = setTimeout(function () {
        if (first) { first = false; left = true; try { if (ws) ws.close(); } catch (e) {} reject(new Error("timeout")); }
      }, opts.timeout || 8000);

      function schedule() {
        if (left) return;
        tries++;
        retryT = setTimeout(open, Math.min(5000, 400 * Math.pow(2, Math.min(tries, 4))));
      }
      function open() {
        if (left) return;
        try { ws = new WebSocket(url); } catch (e) { if (first) { first = false; clearTimeout(firstTimer); reject(e); } else schedule(); return; }
        var mine = ws;
        mine.onmessage = function (ev) {
          var m; try { m = JSON.parse(ev.data); } catch (e) { return; }
          if (!m || typeof m !== "object") return;
          if (m.t === "welcome") {
            tries = 0; setConn(true); applyWelcome(m.peers);
            if (first) { first = false; clearTimeout(firstTimer); resolve(room); }
          } else if (m.t === "join" && typeof m.id === "string") {
            if (!peerSet[m.id]) { peerSet[m.id] = true; var s = snapshot().filter(function (p) { return p.peer === m.id; }); callPeers(s, []); }
          } else if (m.t === "leave" && typeof m.id === "string") {
            if (peerSet[m.id] && m.id !== cid) { delete peerSet[m.id]; callPeers([], [{ peer: m.id, isMe: false, kind: "viewer", presence: {} }]); }
          } else if (m.t === "msg" && typeof m.topic === "string") {
            var hs = handlers[m.topic];
            if (hs) {
              var msg = { topic: m.topic, data: m.data, peer: m.from, by: null, isMe: m.from === cid, sameTab: m.from === cid, kind: "viewer", guest: false };
              hs.slice().forEach(function (h) { try { h(msg); } catch (e) {} });
            }
          } else if (m.t === "pong") {
            var f = pings[m.n]; if (f) { delete pings[m.n]; f(); }
          }
        };
        mine.onclose = function (ev) {
          if (ws !== mine) return;
          setConn(false);
          if (first) { first = false; clearTimeout(firstTimer); left = true; reject(new Error(ev && ev.code === 1006 ? "unreachable" : "closed-" + (ev && ev.code))); }
          else if (!left && !(ev && ev.code === 4000)) schedule();
        };
        mine.onerror = function () { /* onclose folgt */ };
      }
      open();
    });
  }

  root.FRSNet = { connect: connect, relayUrl: relayUrl, normalize: normalize, cleanCode: cleanCode };
})(window);
