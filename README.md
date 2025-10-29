# Imposter Multiplayer Game

Ein browserbasiertes Multiplayer-Spiel im Stil von Among Us, bei dem Spieler als Crewmates oder Imposter spielen.

## Spielanleitung

### Spielstart
1. Öffne `index.html` in deinem Browser
2. Füge Spieler hinzu (mindestens 4 Spieler erforderlich)
3. Wähle die Anzahl der Imposter und Aufgaben
4. Klicke auf "Spiel Starten"

### Spielablauf

#### Für Crewmates:
- **Ziel**: Alle Aufgaben erledigen ODER alle Imposter identifizieren und eliminieren
- Bewege dich durch verschiedene Räume
- Erledige Aufgaben in den Räumen (gelb markiert)
- Rufe ein Notfall-Meeting ein, wenn du einen Imposter vermutest
- Stimme in Meetings ab, um verdächtige Spieler zu eliminieren

#### Für Imposter:
- **Ziel**: Eliminiere genug Crewmates, bis die Imposter in der Mehrheit sind
- Bewege dich durch die Räume
- Eliminiere Crewmates, wenn ihr alleine in einem Raum seid
- Sabotiere die Crewmates, indem du falsche Beschuldigungen machst
- Nutze die Kill-Cooldown-Zeit weise

### Räume
- ☕ Cafeteria
- 🏥 Krankenstation
- ⚡ Elektro
- 📦 Lager
- 💼 Admin
- 🔫 Waffen

### Spielmechaniken

#### Aufgaben
Crewmates müssen verschiedene Aufgaben erledigen:
- Kabel Reparieren
- Daten Herunterladen
- Probe Scannen
- Müll Entsorgen
- Treibstoff Tanken
- Waffen Kalibrieren
- Sauerstoff Auffüllen
- Energiezellen Aufladen

#### Meetings & Abstimmung
- Jeder lebende Spieler kann ein Notfall-Meeting einberufen
- Spieler diskutieren und stimmen ab
- Der Spieler mit den meisten Stimmen wird eliminiert
- Bei Gleichstand wird niemand eliminiert
- Nach der Eliminierung wird die Rolle des Spielers enthüllt

#### Siegbedingungen
**Crewmates gewinnen wenn:**
- Alle Aufgaben erledigt wurden
- Alle Imposter eliminiert wurden

**Imposter gewinnen wenn:**
- Die Anzahl der Imposter gleich oder größer als die Anzahl der Crewmates ist

## Features

- **Hot-Seat Multiplayer**: Spieler wechseln sich am selben Gerät ab
- **Rollenzuweisung**: Zufällige Zuweisung von Crewmate und Imposter Rollen
- **Aufgabensystem**: Verschiedene interaktive Aufgaben für Crewmates
- **Abstimmungssystem**: Demokratische Eliminierung verdächtiger Spieler
- **Raumbasierte Bewegung**: Navigiere durch 6 verschiedene Räume
- **Spieler-Farben**: 8 verschiedene Farben zur Unterscheidung
- **Kill-Cooldown**: Imposter müssen strategisch vorgehen

## Technische Details

- **HTML5** für die Struktur
- **Vanilla JavaScript** für die Spiellogik
- **CSS3** mit modernen Animationen und Gradients
- Keine externen Abhängigkeiten erforderlich
- Responsive Design für verschiedene Bildschirmgrößen

## Spieleinstellungen

- **Spieleranzahl**: 4-8 Spieler
- **Imposter**: 1-2
- **Aufgaben pro Crewmate**: 3, 5 oder 7

## Installation

Keine Installation erforderlich! Einfach die `index.html` Datei in einem modernen Webbrowser öffnen.

## Browser-Kompatibilität

- Chrome (empfohlen)
- Firefox
- Safari
- Edge

## Entwickelt mit

- JavaScript ES6+
- CSS Grid & Flexbox
- CSS Animations
- Local Storage (optional für zukünftige Features)

## Zukünftige Verbesserungen

- Online Multiplayer mit WebSockets
- Mehr Räume und Aufgaben
- Sabotage-Mechaniken
- Audio-Effekte
- Chat-System
- Spielstatistiken

## Lizenz

MIT License - Frei nutzbar für private und kommerzielle Zwecke.

---

Viel Spaß beim Spielen! 🎮
