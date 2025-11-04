// Game Logic - Hauptspiel-Logik
class BundeslaenderGame {
    constructor() {
        this.mode = null;
        this.score = 0;
        this.round = 0;
        this.totalRounds = 16;
        this.timeStarted = null;
        this.timerInterval = null;
        this.answers = [];
        this.currentQuestion = null;
        this.mapRenderer = null;
        this.usedQuestions = [];
    }

    // Startet das Spiel
    start(mode) {
        this.mode = mode;
        this.score = 0;
        this.round = 0;
        this.answers = [];
        this.usedQuestions = [];
        this.timeStarted = Date.now();

        // Initialize map renderer
        const svg = document.getElementById('germanyMap');
        this.mapRenderer = new MapRenderer(svg);

        // Setup screens
        this.showScreen('gameScreen');
        document.getElementById('currentMode').textContent = this.getModeName();

        // Start timer
        this.startTimer();

        // Setup map click handler
        this.mapRenderer.onStateClick = (name) => this.handleMapClick(name);

        // Load first question
        this.nextRound();
    }

    // Startet den Timer
    startTimer() {
        this.timerInterval = setInterval(() => {
            const elapsed = Date.now() - this.timeStarted;
            const seconds = Math.floor(elapsed / 1000);
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            document.getElementById('timer').textContent =
                `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
        }, 1000);
    }

    // Stoppt den Timer
    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
    }

    // Nächste Runde
    nextRound() {
        this.round++;
        if (this.round > this.totalRounds) {
            this.endGame();
            return;
        }

        document.getElementById('round').textContent = `${this.round}/${this.totalRounds}`;
        this.hideFeedback();

        switch (this.mode) {
            case 'quiz':
                this.loadQuizQuestion();
                break;
            case 'capitals':
                this.loadCapitalQuestion();
                break;
            case 'facts':
                this.loadFactsQuestion();
                break;
            case 'explorer':
                this.loadExplorerQuestion();
                break;
        }
    }

    // Quiz-Modus: Finde das Bundesland
    loadQuizQuestion() {
        const bundesland = this.getRandomUnusedBundesland();
        this.currentQuestion = {
            type: 'quiz',
            correctAnswer: bundesland,
            askedAt: Date.now()
        };

        document.getElementById('question').textContent =
            `Wo liegt ${bundesland}?`;
        document.getElementById('questionOptions').innerHTML =
            '<p class="instruction">👆 Klicke auf das richtige Bundesland auf der Karte</p>';
        document.getElementById('aiInfo').innerHTML = '';

        this.mapRenderer.renderMap();
    }

    // Hauptstädte-Modus
    loadCapitalQuestion() {
        const bundesland = this.getRandomUnusedBundesland();
        const correctCapital = bundeslaenderData[bundesland].capital;

        // Generate wrong answers
        const allCapitals = Object.keys(capitals);
        const wrongCapitals = allCapitals
            .filter(cap => cap !== correctCapital)
            .sort(() => Math.random() - 0.5)
            .slice(0, 3);

        const options = shuffleArray([correctCapital, ...wrongCapitals]);

        this.currentQuestion = {
            type: 'capitals',
            correctAnswer: correctCapital,
            askedAt: Date.now()
        };

        document.getElementById('question').textContent =
            `Was ist die Hauptstadt von ${bundesland}?`;

        const optionsHtml = options.map(option => `
            <button class="option-btn" onclick="game.checkAnswer('${option}')">
                ${option}
            </button>
        `).join('');

        document.getElementById('questionOptions').innerHTML = optionsHtml;
        document.getElementById('aiInfo').innerHTML = '';

        // Highlight the bundesland on map
        this.mapRenderer.renderMap([bundesland]);
        this.mapRenderer.highlightState(bundesland);
    }

    // Fakten-Challenge Modus
    loadFactsQuestion() {
        const availableQuestions = quizQuestions.filter(q =>
            !this.usedQuestions.includes(q.question)
        );

        if (availableQuestions.length === 0) {
            // Reset if all used
            this.usedQuestions = [];
        }

        const question = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
        this.usedQuestions.push(question.question);

        this.currentQuestion = {
            type: 'facts',
            correctAnswer: question.correct,
            askedAt: Date.now()
        };

        document.getElementById('question').textContent = question.question;

        const optionsHtml = question.options.map(option => `
            <button class="option-btn" onclick="game.checkAnswer('${option}')">
                ${option}
            </button>
        `).join('');

        document.getElementById('questionOptions').innerHTML = optionsHtml;
        document.getElementById('aiInfo').innerHTML = '';

        this.mapRenderer.renderMap();
    }

    // Explorer-Modus mit AI
    async loadExplorerQuestion() {
        const bundesland = this.getRandomUnusedBundesland();

        this.currentQuestion = {
            type: 'explorer',
            correctAnswer: bundesland,
            askedAt: Date.now()
        };

        document.getElementById('question').textContent =
            `Erforsche ${bundesland}!`;
        document.getElementById('questionOptions').innerHTML =
            '<p class="instruction">👆 Klicke auf das Bundesland, um mehr zu erfahren</p>';

        // Load AI info
        const aiContainer = document.getElementById('aiInfo');
        await aiAssistant.displayInfo(bundesland, aiContainer);

        // After showing info, ask to find it
        setTimeout(() => {
            document.getElementById('question').textContent =
                `Jetzt finde ${bundesland} auf der Karte!`;
        }, 3000);

        this.mapRenderer.renderMap();
    }

    // Behandelt Karten-Klicks
    handleMapClick(bundeslandName) {
        if (this.mode === 'quiz' || this.mode === 'explorer') {
            this.checkAnswer(bundeslandName);
        }
    }

    // Überprüft die Antwort
    checkAnswer(answer) {
        if (!this.currentQuestion) return;

        const isCorrect = answer === this.currentQuestion.correctAnswer;
        const timeSpent = Date.now() - this.currentQuestion.askedAt;

        // Calculate points (faster = more points)
        let points = 0;
        if (isCorrect) {
            const basePoints = 100;
            const timeBonus = Math.max(0, 50 - Math.floor(timeSpent / 1000));
            points = basePoints + timeBonus;
            this.score += points;
        }

        // Record answer
        this.answers.push({
            question: this.getQuestionText(),
            userAnswer: answer,
            correctAnswer: this.currentQuestion.correctAnswer,
            isCorrect: isCorrect,
            points: points,
            timeSpent: timeSpent
        });

        // Update score display
        document.getElementById('score').textContent = this.score;

        // Show feedback
        this.showFeedback(isCorrect, points, this.currentQuestion.correctAnswer);

        // Highlight on map if applicable
        if (this.mode === 'quiz' || this.mode === 'explorer') {
            this.mapRenderer.showFeedback(this.currentQuestion.correctAnswer, isCorrect);
        }

        // Move to next round after delay
        setTimeout(() => {
            this.nextRound();
        }, 2500);
    }

    // Zeigt Feedback
    showFeedback(isCorrect, points, correctAnswer) {
        const feedbackArea = document.getElementById('feedbackArea');
        feedbackArea.className = 'feedback-area ' + (isCorrect ? 'correct' : 'wrong');

        if (isCorrect) {
            feedbackArea.innerHTML = `
                <div class="feedback-content">
                    <div class="feedback-icon">✅</div>
                    <div class="feedback-text">
                        <h3>Richtig!</h3>
                        <p>+${points} Punkte</p>
                    </div>
                </div>
            `;
        } else {
            feedbackArea.innerHTML = `
                <div class="feedback-content">
                    <div class="feedback-icon">❌</div>
                    <div class="feedback-text">
                        <h3>Leider falsch!</h3>
                        <p>Die richtige Antwort: ${correctAnswer}</p>
                    </div>
                </div>
            `;
        }

        feedbackArea.style.display = 'block';
    }

    // Versteckt Feedback
    hideFeedback() {
        const feedbackArea = document.getElementById('feedbackArea');
        feedbackArea.style.display = 'none';
    }

    // Holt ein zufälliges, noch nicht genutztes Bundesland
    getRandomUnusedBundesland() {
        const all = getAllBundeslaender();
        const used = this.answers.map(a => a.correctAnswer);
        const available = all.filter(name => !used.includes(name));

        if (available.length === 0) {
            return all[Math.floor(Math.random() * all.length)];
        }

        return available[Math.floor(Math.random() * available.length)];
    }

    // Holt den aktuellen Frage-Text
    getQuestionText() {
        return document.getElementById('question').textContent;
    }

    // Holt den Modus-Namen
    getModeName() {
        const names = {
            'quiz': 'Quiz-Modus',
            'capitals': 'Hauptstädte',
            'facts': 'Fakten-Challenge',
            'explorer': 'AI Explorer'
        };
        return names[this.mode] || 'Spiel';
    }

    // Beendet das Spiel
    endGame() {
        this.stopTimer();

        const totalTime = Date.now() - this.timeStarted;
        const correctAnswers = this.answers.filter(a => a.isCorrect).length;
        const accuracy = Math.round((correctAnswers / this.answers.length) * 100);

        // Show result screen
        this.showScreen('resultScreen');

        document.getElementById('finalScore').textContent = this.score;
        const minutes = Math.floor(totalTime / 60000);
        const seconds = Math.floor((totalTime % 60000) / 1000);
        document.getElementById('finalTime').textContent =
            `${minutes}:${seconds.toString().padStart(2, '0')}`;
        document.getElementById('accuracy').textContent = accuracy + '%';

        // Result message
        const message = this.getResultMessage(accuracy);
        document.getElementById('resultMessage').innerHTML = `<p>${message}</p>`;

        // Show answers list
        const answersList = document.getElementById('answersList');
        answersList.innerHTML = this.answers.map((answer, i) => `
            <div class="answer-item ${answer.isCorrect ? 'correct' : 'wrong'}">
                <div class="answer-number">${i + 1}</div>
                <div class="answer-details">
                    <div class="answer-question">${answer.question}</div>
                    <div class="answer-result">
                        ${answer.isCorrect ? '✅' : '❌'}
                        ${answer.isCorrect ?
                            `Richtig! (+${answer.points} Punkte)` :
                            `Falsch! Richtig: ${answer.correctAnswer}`
                        }
                    </div>
                </div>
            </div>
        `).join('');

        // Save highscore
        this.saveHighscore();
    }

    // Holt die Ergebnis-Nachricht
    getResultMessage(accuracy) {
        if (accuracy === 100) {
            return '🎉 Perfekt! Du bist ein echter Bundesländer-Meister!';
        } else if (accuracy >= 80) {
            return '🌟 Hervorragend! Du kennst dich sehr gut aus!';
        } else if (accuracy >= 60) {
            return '👍 Gut gemacht! Mit etwas Übung wirst du noch besser!';
        } else if (accuracy >= 40) {
            return '💪 Nicht schlecht! Probier es nochmal!';
        } else {
            return '📚 Übung macht den Meister! Versuch es nochmal!';
        }
    }

    // Speichert Highscore
    saveHighscore() {
        const highscores = this.getHighscores();
        highscores.push({
            mode: this.mode,
            score: this.score,
            date: new Date().toISOString(),
            accuracy: Math.round((this.answers.filter(a => a.isCorrect).length / this.answers.length) * 100)
        });

        // Keep only top 10
        highscores.sort((a, b) => b.score - a.score);
        const top10 = highscores.slice(0, 10);

        localStorage.setItem('bundeslaender_highscores', JSON.stringify(top10));
    }

    // Holt Highscores
    getHighscores() {
        const stored = localStorage.getItem('bundeslaender_highscores');
        return stored ? JSON.parse(stored) : [];
    }

    // Zeigt einen Screen
    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
    }

    // Beendet das Spiel vorzeitig
    exit() {
        this.stopTimer();
        this.showScreen('startScreen');
        this.loadHighscores();
    }

    // Startet das Spiel neu
    restart() {
        this.start(this.mode);
    }

    // Lädt Highscores im Hauptmenü
    loadHighscores() {
        const highscores = this.getHighscores();
        const container = document.getElementById('highscoresList');

        if (highscores.length === 0) {
            container.innerHTML = '<p class="no-scores">Noch keine Highscores. Spiele dein erstes Spiel!</p>';
            return;
        }

        container.innerHTML = highscores.map((score, i) => `
            <div class="highscore-item">
                <div class="highscore-rank">${i + 1}</div>
                <div class="highscore-details">
                    <div class="highscore-mode">${this.getModeIcon(score.mode)} ${this.getModeName2(score.mode)}</div>
                    <div class="highscore-score">${score.score} Punkte • ${score.accuracy}%</div>
                </div>
                <div class="highscore-date">${this.formatDate(score.date)}</div>
            </div>
        `).join('');
    }

    getModeIcon(mode) {
        const icons = {
            'quiz': '🗺️',
            'capitals': '🏛️',
            'facts': '🧠',
            'explorer': '🤖'
        };
        return icons[mode] || '🎮';
    }

    getModeName2(mode) {
        const names = {
            'quiz': 'Quiz',
            'capitals': 'Hauptstädte',
            'facts': 'Fakten',
            'explorer': 'Explorer'
        };
        return names[mode] || mode;
    }

    formatDate(isoString) {
        const date = new Date(isoString);
        return date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }
}

// Global game instance
const game = new BundeslaenderGame();
