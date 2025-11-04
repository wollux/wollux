// AI Integration für Bundesländer-Informationen
// Verwendet Claude AI API (oder simuliert AI-Antworten wenn keine API verfügbar)

class AIAssistant {
    constructor() {
        this.apiKey = null; // Wird vom Benutzer gesetzt oder aus localStorage geladen
        this.useSimulation = true; // Falls keine API vorhanden, nutze Simulation
        this.loadApiKey();
    }

    // Lädt API Key aus localStorage
    loadApiKey() {
        this.apiKey = localStorage.getItem('claude_api_key');
        if (this.apiKey) {
            this.useSimulation = false;
        }
    }

    // Setzt API Key
    setApiKey(key) {
        this.apiKey = key;
        this.useSimulation = !key;
        if (key) {
            localStorage.setItem('claude_api_key', key);
        } else {
            localStorage.removeItem('claude_api_key');
        }
    }

    // Holt interessante Fakten über ein Bundesland
    async getFacts(bundeslandName) {
        if (this.useSimulation) {
            return this.simulateFacts(bundeslandName);
        }

        try {
            const response = await this.callClaudeAPI(
                `Erzähle mir 3 interessante, weniger bekannte Fakten über ${bundeslandName} in Deutschland.
                Mach es spannend und lehrreich! Jeder Fakt sollte 1-2 Sätze lang sein.`
            );
            return this.parseFacts(response);
        } catch (error) {
            console.error('AI API Error:', error);
            return this.simulateFacts(bundeslandName);
        }
    }

    // Holt eine detaillierte Beschreibung
    async getDescription(bundeslandName) {
        if (this.useSimulation) {
            return this.simulateDescription(bundeslandName);
        }

        try {
            const response = await this.callClaudeAPI(
                `Beschreibe ${bundeslandName} in Deutschland in 2-3 spannenden Sätzen.
                Fokussiere dich auf Besonderheiten, Kultur und interessante Aspekte.`
            );
            return response;
        } catch (error) {
            console.error('AI API Error:', error);
            return this.simulateDescription(bundeslandName);
        }
    }

    // Generiert eine Quiz-Frage
    async generateQuizQuestion(bundeslandName) {
        if (this.useSimulation) {
            return this.simulateQuizQuestion(bundeslandName);
        }

        try {
            const response = await this.callClaudeAPI(
                `Erstelle eine interessante Multiple-Choice-Frage über ${bundeslandName}.
                Format:
                Frage: [Die Frage]
                A) [Option 1]
                B) [Option 2]
                C) [Option 3]
                D) [Option 4]
                Richtig: [A, B, C oder D]`
            );
            return this.parseQuizQuestion(response);
        } catch (error) {
            console.error('AI API Error:', error);
            return this.simulateQuizQuestion(bundeslandName);
        }
    }

    // Ruft die Claude API auf
    async callClaudeAPI(prompt) {
        if (!this.apiKey) {
            throw new Error('No API key set');
        }

        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': this.apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-3-sonnet-20240229',
                max_tokens: 1024,
                messages: [{
                    role: 'user',
                    content: prompt
                }]
            })
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }

        const data = await response.json();
        return data.content[0].text;
    }

    // Simuliert AI-Fakten (Fallback)
    simulateFacts(bundeslandName) {
        const data = bundeslaenderData[bundeslandName];
        if (!data) return [];

        const additionalFacts = {
            'Bayern': [
                'Bayern hat mehr als 40.000 Burgen, Schlösser und Ruinen - mehr als jedes andere Bundesland.',
                'In Bayern wird jährlich etwa 25% des gesamten deutschen Biers gebraut.',
                'Der höchste Berg Deutschlands, die Zugspitze (2.962m), liegt in Bayern.'
            ],
            'Baden-Württemberg': [
                'Baden-Württemberg ist das Bundesland mit den meisten Weltmarktführern - den "Hidden Champions".',
                'Der erste Computer der Welt wurde 1941 von Konrad Zuse in Berlin entwickelt, aber viele IT-Innovationen kommen aus BW.',
                'Die Region hat die höchste Dichte an Michelin-Sternen in Deutschland.'
            ],
            'Berlin': [
                'Berlin hat mehr Brücken als Venedig - über 1.700 Brücken.',
                'Die Currywurst wurde 1949 in Berlin erfunden und es werden täglich über 70 Millionen verkauft.',
                'Berlin ist die größte Stadt der EU und wächst jährlich um etwa 40.000 Einwohner.'
            ]
        };

        return additionalFacts[bundeslandName] || data.facts;
    }

    // Simuliert Beschreibungen
    simulateDescription(bundeslandName) {
        const data = bundeslaenderData[bundeslandName];
        if (!data) return '';

        return `${bundeslandName} mit der Hauptstadt ${data.capital} ist ein faszinierendes Bundesland.
                Mit ${data.population} Einwohnern auf ${data.area} bietet es eine einzigartige Mischung aus
                Tradition und Moderne. Besonders bekannt ist ${bundeslandName} für: ${data.facts[0]}.`;
    }

    // Simuliert Quiz-Fragen
    simulateQuizQuestion(bundeslandName) {
        const data = bundeslaenderData[bundeslandName];
        const allCapitals = Object.keys(capitals);
        const correctCapital = data.capital;

        // Wähle 3 falsche Hauptstädte
        const wrongCapitals = allCapitals
            .filter(cap => cap !== correctCapital)
            .sort(() => Math.random() - 0.5)
            .slice(0, 3);

        const options = shuffleArray([correctCapital, ...wrongCapitals]);

        return {
            question: `Was ist die Hauptstadt von ${bundeslandName}?`,
            options: options,
            correct: correctCapital
        };
    }

    // Parst Fakten aus AI-Antwort
    parseFacts(response) {
        const lines = response.split('\n').filter(line => line.trim());
        return lines.slice(0, 3);
    }

    // Parst Quiz-Frage aus AI-Antwort
    parseQuizQuestion(response) {
        const lines = response.split('\n');
        const question = lines.find(l => l.startsWith('Frage:'))?.replace('Frage:', '').trim();
        const options = lines
            .filter(l => /^[A-D]\)/.test(l))
            .map(l => l.replace(/^[A-D]\)\s*/, '').trim());
        const correctLine = lines.find(l => l.startsWith('Richtig:'));
        const correctLetter = correctLine?.match(/[A-D]/)?.[0];
        const correctIndex = correctLetter ? correctLetter.charCodeAt(0) - 65 : 0;

        return {
            question: question || 'Frage konnte nicht geladen werden',
            options: options.length === 4 ? options : ['?', '?', '?', '?'],
            correct: options[correctIndex] || options[0]
        };
    }

    // Zeigt Loading-Indicator
    showLoading() {
        const indicator = document.getElementById('loadingIndicator');
        if (indicator) {
            indicator.style.display = 'flex';
        }
    }

    // Versteckt Loading-Indicator
    hideLoading() {
        const indicator = document.getElementById('loadingIndicator');
        if (indicator) {
            indicator.style.display = 'none';
        }
    }

    // Zeigt AI-Informationen im Spiel an
    async displayInfo(bundeslandName, container) {
        this.showLoading();

        try {
            const facts = await this.getFacts(bundeslandName);
            const description = await this.getDescription(bundeslandName);

            container.innerHTML = `
                <div class="ai-content">
                    <h3>🤖 AI-Informationen über ${bundeslandName}</h3>
                    <p class="ai-description">${description}</p>
                    <div class="ai-facts">
                        <h4>Interessante Fakten:</h4>
                        <ul>
                            ${facts.map(fact => `<li>${fact}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            `;
        } catch (error) {
            container.innerHTML = `
                <div class="ai-error">
                    <p>⚠️ Informationen konnten nicht geladen werden.</p>
                </div>
            `;
        } finally {
            this.hideLoading();
        }
    }
}

// Globale AI-Instanz
const aiAssistant = new AIAssistant();

// API Key Setup Dialog
function showAPIKeyDialog() {
    const key = prompt('Bitte gib deinen Claude API Key ein (optional):\n\nOhne API Key werden simulierte Daten verwendet.');
    if (key) {
        aiAssistant.setApiKey(key);
        alert('API Key gespeichert! Das Spiel nutzt jetzt echte AI-Antworten.');
    }
}
