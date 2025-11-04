# 🇩🇪 Bundesländer Meister

Das ultimative interaktive Lernspiel für deutsche Bundesländer mit AI-Integration!

## ✨ Features

### 🎮 4 Spannende Spielmodi

1. **Quiz-Modus** 🗺️
   - Finde Bundesländer auf der interaktiven Karte
   - Klicke auf die richtige Region
   - Visuelles Lernen durch interaktive Karte

2. **Hauptstädte** 🏛️
   - Ordne Hauptstädte den richtigen Bundesländern zu
   - Multiple-Choice-Format
   - Perfekt zum Auswendiglernen

3. **Fakten-Challenge** 🧠
   - Teste dein Wissen über Deutschland
   - Spannende Fragen zu Größe, Bevölkerung, Besonderheiten
   - Werde zum echten Deutschland-Experten

4. **AI Explorer** 🤖
   - Entdecke Bundesländer mit AI-Unterstützung
   - Lerne interessante Fakten
   - Optional: Echte Claude AI-Integration

### 🌟 Highlights

- ✅ **Interaktive SVG-Karte** - Alle 16 Bundesländer zum Anklicken
- ✅ **AI-Integration** - Optional Claude API für echte KI-Antworten
- ✅ **Score-System** - Punkte basierend auf Geschwindigkeit und Genauigkeit
- ✅ **Timer** - Miss deine Zeit und verbessere dich
- ✅ **Highscore-System** - Speichere deine besten Ergebnisse
- ✅ **Animationen** - Smooth Animationen und Feedback
- ✅ **Responsive Design** - Funktioniert auf Desktop und Mobile
- ✅ **Keyboard Shortcuts** - Schnellere Navigation
- ✅ **Offline-fähig** - Funktioniert auch ohne AI-API

## 🚀 Schnellstart

1. Öffne einfach `index.html` in deinem Browser
2. Wähle einen Spielmodus
3. Spiele und lerne!

## 🤖 AI-Integration (Optional)

Das Spiel funktioniert perfekt auch ohne AI-API. Für noch bessere Lerninhalte:

1. Klicke auf "⚙️ Einstellungen" im Hauptmenü
2. Gib deinen Claude API Key ein
3. Genieße echte AI-generierte Fakten und Beschreibungen!

**Hinweis:** Ohne API Key werden qualitativ hochwertige vordefinierte Daten verwendet.

## 🎯 Spielanleitung

### Quiz-Modus
- Lese den Namen des Bundeslandes
- Klicke auf die richtige Region auf der Karte
- Je schneller du bist, desto mehr Punkte bekommst du!

### Hauptstädte-Modus
- Wähle die richtige Hauptstadt aus 4 Optionen
- Das gesuchte Bundesland wird auf der Karte hervorgehoben
- Nutze Tastatur (1-4) für noch schnellere Antworten!

### Fakten-Challenge
- Beantworte Fragen über deutsche Bundesländer
- Lerne spannende Fakten
- Teste dein Deutschland-Wissen

### AI Explorer
- Erforsche Bundesländer mit AI-Hilfe
- Lese interessante Informationen
- Finde dann das Bundesland auf der Karte

## ⌨️ Keyboard Shortcuts

- **1-4** - Antwortoption auswählen (bei Multiple-Choice)
- **ESC** - Spiel beenden
- **R** - Spiel wiederholen (auf Ergebnis-Screen)
- **H** - Zurück zum Hauptmenü (auf Ergebnis-Screen)

## 📊 Punkte-System

- **Basis-Punkte:** 100 Punkte pro richtiger Antwort
- **Zeit-Bonus:** Bis zu 50 Extra-Punkte für schnelle Antworten
- **Maximum:** 150 Punkte pro Frage
- **Gesamt:** Bis zu 2.400 Punkte möglich (16 Bundesländer × 150)

## 🏆 Highscore-System

- Automatische Speicherung deiner Top 10 Scores
- Nach Modus getrennt
- Lokale Speicherung im Browser
- Export/Import-Funktion (geplant)

## 🎨 Technologie

- **Frontend:** Vanilla JavaScript (ES6+)
- **Styling:** CSS3 mit Animationen
- **Karte:** SVG für perfekte Skalierung
- **Speicherung:** LocalStorage für Highscores
- **AI:** Optional Claude API-Integration

## 📱 Browser-Kompatibilität

- ✅ Chrome (empfohlen)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile Browser

## 📂 Projekt-Struktur

```
wollux/
├── index.html                          # Haupt-HTML-Datei
├── stylesheets/
│   └── game.css                        # Styling & Animationen
├── javascripts/
│   ├── bundeslaender-data.js          # Bundesländer-Daten & Fakten
│   ├── map-renderer.js                 # SVG-Karten-Renderer
│   ├── ai-integration.js               # AI/API-Integration
│   ├── game-logic.js                   # Spiel-Logik
│   └── main.js                         # Event-Handler
└── README.md                           # Diese Datei
```

## 🔧 Entwicklung

### Neue Fakten hinzufügen

Bearbeite `javascripts/bundeslaender-data.js`:

```javascript
facts: [
    'Dein neuer spannender Fakt',
    // ...
]
```

### Neue Quiz-Fragen hinzufügen

In `bundeslaender-data.js`:

```javascript
const quizQuestions = [
    {
        question: 'Deine Frage?',
        options: ['A', 'B', 'C', 'D'],
        correct: 'A'
    },
    // ...
];
```

## 🎓 Lernziele

Mit diesem Spiel lernst du:

- ✅ Alle 16 deutschen Bundesländer
- ✅ Hauptstädte auswendig
- ✅ Geografische Lage
- ✅ Größe und Einwohnerzahl
- ✅ Besonderheiten und Sehenswürdigkeiten
- ✅ Gründungsjahre
- ✅ Wirtschaft und Kultur

## 🌈 Features für die Zukunft

- [ ] Schwierigkeitsgrade
- [ ] Mehrspieler-Modus
- [ ] Tägliche Challenges
- [ ] Achievements/Trophäen
- [ ] Mehr Quiz-Kategorien
- [ ] Österreich & Schweiz Modi
- [ ] Sprachauswahl (EN, FR, etc.)
- [ ] Sound-Effekte

## 🤝 Beitragen

Ideen für Verbesserungen? Öffne ein Issue oder Pull Request!

## 📜 Lizenz

MIT License - Frei verwendbar für Bildungszwecke!

## 🙏 Credits

- Entwickelt mit ❤️ für besseres Lernen
- SVG-Karten-Pfade approximiert
- Bundesländer-Daten basierend auf öffentlichen Quellen
- AI-Integration powered by Claude (Anthropic)

## 📞 Support

Bei Fragen oder Problemen:
- Öffne ein GitHub Issue
- Schau in die Code-Kommentare für Details

---

**Viel Spaß beim Lernen! 🎉**

Made with 🇩🇪 in Deutschland
