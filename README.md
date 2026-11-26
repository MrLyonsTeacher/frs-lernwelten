# FRS Lernwelten

Interaktive Lernwelten für iPads – ohne Anmeldung, über QR-Codes.

- **Startseite für Lehrkräfte:** `index.html` – Klasse wählen, QR-Code zeigen
- **Ergebnisse einsammeln:** `ergebnisse.html` – Ergebnis-Codes scannen, Klassenübersicht
- **Englisch-Klasseninseln:** `englisch/insel.html?k=5` … `?k=10`
- **Katalog aller Lernwelten:** `katalog.js`
- **Escape Rooms:** Ordner `escape/` (Vulkan `escape/vulkan.html`, Der Schwarm `escape/schwarm.html`, Die Hallen von Azaroth `escape/azaroth.html`, Verbindungstest `escape/test.html`, Vermittlungsdienst `escape/relay/`, Einrichtung siehe dort)

Alle Ergebnisse werden nur lokal auf den Geräten gespeichert.


**Rätselfamilien der Escape Rooms** (`escape/pool.js`, `FAMILIES`): Zahlen & Codes (Vulkan, Der Schwarm), Logik & Detektiv (Bibliothek, später Eiswelt), Sehen & Raum (Wrack, Die Hallen von Azaroth), Team & Sinne (Finlorién, ein weiterer Raum). Jeder Raum zieht etwa drei Viertel seiner Rätsel aus seiner Familie.

**Camp Start (Sport Kl. 8)** – `sport/klasse8.html`, je Etappe des Camp-Logbuchs eine Lernwelt: `camp-sport.html` (1), `basketball.html` (2), `camp-aufwaermen.html` (3), `camp-muskeln.html` (4), `camp-faehigkeiten.html` (5), `camp-fairplay.html` (6), `camp-rueckblick.html` (7). Gemeinsame Bausteine in `sport/camp-kit.js/.css`; Szenenbilder kommen nach `sport/camp-bilder/` (bis dahin erscheint ein Symbol). Spiele können mit `ab:"…"` nach dem Ergebnis auf die passende Logbuch-Aufgabe verweisen.
