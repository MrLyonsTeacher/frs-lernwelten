// FRS Escape Rooms: Vermittlungsdienst (Cloudflare Worker + Durable Object)
//
// Er verbindet die iPads einer Gruppe live miteinander. Pro Gruppencode gibt es einen "Raum".
// Es werden keine Namen, keine Konten und keine Spielinhalte gespeichert, die Nachrichten werden nur
// an die anderen Geräte im selben Raum weitergereicht.
//
// Verbindung:  wss://<dienst>/ws/<gruppencode>?c=<geraete-kennung>
// Vom Gerät:   {"t":"emit","topic":"act","data":{...}}   -> geht an alle im Raum (auch zurück an den Absender)
//              {"t":"ping","n":123}                      -> Antwort {"t":"pong","n":123}
// Zum Gerät:   {"t":"welcome","id":"abc","peers":["xyz"]}
//              {"t":"join","id":"..."}  {"t":"leave","id":"..."}
//              {"t":"msg","from":"abc","topic":"act","data":{...}}

const MAX_PEERS = 12;          // mehr Geräte pro Raum werden abgelehnt
const MAX_BYTES = 4096;        // größte erlaubte Nachricht
const MAX_PER_SECOND = 60;     // Nachrichten pro Gerät und Sekunde
const ROOM_RE = /^\/ws\/([a-z0-9][a-z0-9_.-]{0,47})$/;
const TOPIC_RE = /^[a-z][a-z0-9_.-]{0,31}$/;

function allowedOrigin(request, env) {
  const list = (env.ALLOWED_ORIGINS || "").split(",").map(s => s.trim()).filter(Boolean);
  if (!list.length) return true;                       // nichts eingetragen: jede Herkunft erlaubt (zum Testen)
  const origin = request.headers.get("Origin") || "";
  return list.includes(origin);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const m = url.pathname.match(ROOM_RE);
    if (!m) {
      return new Response("FRS Escape Relay: läuft.\n", { status: 200, headers: { "content-type": "text/plain; charset=utf-8" } });
    }
    if (request.headers.get("Upgrade") !== "websocket") {
      return new Response("Erwartet eine WebSocket-Verbindung.", { status: 426 });
    }
    if (!allowedOrigin(request, env)) {
      return new Response("Herkunft nicht erlaubt.", { status: 403 });
    }
    const stub = env.ROOM.get(env.ROOM.idFromName(m[1]));
    return stub.fetch(request);
  }
};

export class Room {
  constructor(state, env) {
    this.state = state;
    this.env = env;
  }

  sockets() {
    return this.state.getWebSockets();
  }

  send(ws, obj) {
    try { ws.send(JSON.stringify(obj)); } catch (e) { /* Gerät ist weg */ }
  }

  broadcast(obj, except) {
    const text = JSON.stringify(obj);
    for (const ws of this.sockets()) {
      if (ws === except) continue;
      try { ws.send(text); } catch (e) { /* Gerät ist weg */ }
    }
  }

  async fetch(request) {
    const url = new URL(request.url);
    let id = (url.searchParams.get("c") || "").toLowerCase();
    if (!/^[a-z0-9]{6,16}$/.test(id)) id = crypto.randomUUID().replace(/-/g, "").slice(0, 10);

    // Gleiche Kennung nochmal (Neuverbindung): alte Verbindung beenden
    for (const ws of this.sockets()) {
      const a = ws.deserializeAttachment();
      if (a && a.id === id) { try { ws.close(4000, "ersetzt"); } catch (e) {} }
    }
    const others = this.sockets().filter(ws => { const a = ws.deserializeAttachment(); return a && a.id !== id; });
    if (others.length >= MAX_PEERS) return new Response("Raum ist voll.", { status: 429 });

    const pair = new WebSocketPair();
    const client = pair[0], server = pair[1];
    this.state.acceptWebSocket(server);
    server.serializeAttachment({ id, w: 0, n: 0 });

    const peers = others.map(ws => ws.deserializeAttachment().id);
    this.send(server, { t: "welcome", id, peers });
    this.broadcast({ t: "join", id }, server);
    return new Response(null, { status: 101, webSocket: client });
  }

  async webSocketMessage(ws, message) {
    if (typeof message !== "string" || message.length > MAX_BYTES) return;
    const a = ws.deserializeAttachment();
    if (!a) return;

    // einfache Mengenbegrenzung
    const now = Math.floor(Date.now() / 1000);
    if (a.w !== now) { a.w = now; a.n = 0; }
    a.n++;
    ws.serializeAttachment(a);
    if (a.n > MAX_PER_SECOND) return;

    let msg;
    try { msg = JSON.parse(message); } catch (e) { return; }
    if (!msg || typeof msg !== "object") return;

    if (msg.t === "ping") {
      this.send(ws, { t: "pong", n: typeof msg.n === "number" ? msg.n : 0 });
    } else if (msg.t === "emit") {
      if (typeof msg.topic !== "string" || !TOPIC_RE.test(msg.topic)) return;
      this.broadcast({ t: "msg", from: a.id, topic: msg.topic, data: msg.data });
    }
  }

  async webSocketClose(ws, code, reason, wasClean) {
    this.gone(ws);
    try { ws.close(code, "ok"); } catch (e) {}
  }

  async webSocketError(ws) {
    this.gone(ws);
  }

  gone(ws) {
    const a = ws.deserializeAttachment();
    if (!a) return;
    // Wurde die Kennung inzwischen von einer neueren Verbindung übernommen, kein "leave" melden
    const still = this.sockets().some(o => o !== ws && (o.deserializeAttachment() || {}).id === a.id);
    if (!still) this.broadcast({ t: "leave", id: a.id }, ws);
  }
}
