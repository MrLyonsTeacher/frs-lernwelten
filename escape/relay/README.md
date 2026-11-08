# FRS Escape Rooms · Vermittlungsdienst

Kleiner Dienst auf Cloudflare (Worker mit Durable Object), der die iPads einer Gruppe live verbindet.
Er speichert nichts und kennt keine Namen. Pro Gruppencode gibt es einen Raum mit höchstens 12 Geräten,
die Nachrichten werden nur an die anderen Geräte im selben Raum weitergegeben.

## Einrichten (einmalig, etwa 10 Minuten)

Die Bezeichnungen im Cloudflare-Menü ändern sich gelegentlich. Sinngemäß:

1. Im Cloudflare-Dashboard unter **Workers & Pages** einen neuen Worker aus einem **Git-Repository** erstellen
   und `MrLyonsTeacher/frs-lernwelten` auswählen.
2. Als **Root-Verzeichnis** `escape/relay` angeben. Der Name darf `frs-escape-relay` bleiben.
3. Build-Befehl leer lassen, Deploy-Befehl `npx wrangler deploy`. Dann bereitstellen.
4. Cloudflare zeigt danach die Adresse, etwa `https://frs-escape-relay.dein-name.workers.dev`.
   Öffne sie im Browser: Es sollte „FRS Escape Relay: läuft.“ erscheinen.
5. Diese Adresse auf der Testseite `escape/test.html` eintragen (dort mit `wss://` statt `https://`, die Seite
   wandelt `https://` aber auch selbst um) oder in `escape/config.js` festschreiben.

## Absichern (empfohlen, wenn alles läuft)

In `wrangler.toml` unten `[vars]` mit `ALLOWED_ORIGINS` eintragen, zum Beispiel die Adresse deiner Lernwelten-Seite.
Dann dürfen sich nur noch Seiten von dort verbinden.

## Kosten

Im kostenlosen Cloudflare-Tarif reicht das für den Unterricht. Gruppen mit ein paar Nachrichten pro Sekunde
brauchen nur einen winzigen Teil des Kontingents.

## Lokal ausprobieren

```
cd escape/relay
npm install
npx wrangler dev
```

Der Dienst läuft dann unter `ws://localhost:8787`.

## Protokoll (für Entwickler)

Verbindung: `wss://<dienst>/ws/<gruppencode>?c=<geraete-kennung>`

| Vom Gerät | Wirkung |
|---|---|
| `{"t":"emit","topic":"act","data":{…}}` | geht an alle im Raum, auch zurück an den Absender |
| `{"t":"ping","n":1}` | Antwort `{"t":"pong","n":1}` |

| Zum Gerät | Bedeutung |
|---|---|
| `{"t":"welcome","id":"…","peers":["…"]}` | Verbindung steht, Liste der anderen Geräte |
| `{"t":"join","id":"…"}` / `{"t":"leave","id":"…"}` | Gerät kommt dazu / geht |
| `{"t":"msg","from":"…","topic":"…","data":{…}}` | Nachricht eines Geräts |

Grenzen: 4 KB pro Nachricht, 60 Nachrichten pro Sekunde und Gerät, 12 Geräte pro Raum.
