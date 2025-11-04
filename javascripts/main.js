// Main JavaScript - Globale Event Handler und Initialisierung

// Document Ready
document.addEventListener('DOMContentLoaded', function() {
    // Load highscores on start
    game.loadHighscores();

    // Add keyboard shortcuts
    document.addEventListener('keydown', handleKeyboard);

    // Check for saved API key and show info
    if (!aiAssistant.apiKey) {
        showWelcomeMessage();
    }

    // Add settings button for API key
    addSettingsButton();
});

// Startet ein neues Spiel
function startGame(mode) {
    game.start(mode);
}

// Beendet das Spiel
function exitGame() {
    if (confirm('Willst du das Spiel wirklich beenden? Dein Fortschritt geht verloren!')) {
        game.exit();
    }
}

// Startet das Spiel neu
function restartGame() {
    game.restart();
}

// Zurück zum Hauptmenü
function backToMenu() {
    game.exit();
}

// Keyboard Shortcuts
function handleKeyboard(event) {
    // ESC to exit game
    if (event.key === 'Escape') {
        const gameScreen = document.getElementById('gameScreen');
        if (gameScreen.classList.contains('active')) {
            exitGame();
        }
    }

    // Number keys 1-4 for options
    if (event.key >= '1' && event.key <= '4') {
        const options = document.querySelectorAll('.option-btn');
        const index = parseInt(event.key) - 1;
        if (options[index]) {
            options[index].click();
        }
    }

    // R to restart
    if (event.key === 'r' || event.key === 'R') {
        const resultScreen = document.getElementById('resultScreen');
        if (resultScreen.classList.contains('active')) {
            restartGame();
        }
    }

    // H to go home
    if (event.key === 'h' || event.key === 'H') {
        const resultScreen = document.getElementById('resultScreen');
        if (resultScreen.classList.contains('active')) {
            backToMenu();
        }
    }
}

// Zeigt Willkommensnachricht
function showWelcomeMessage() {
    // Check if already shown
    if (localStorage.getItem('welcome_shown')) {
        return;
    }

    setTimeout(() => {
        const message = `
Willkommen beim Bundesländer Meister! 🇩🇪

Dieses Spiel bietet 4 spannende Modi:
🗺️ Quiz: Finde Bundesländer auf der Karte
🏛️ Hauptstädte: Ordne Hauptstädte zu
🧠 Fakten: Teste dein Wissen
🤖 AI Explorer: Lerne mit KI-Unterstützung

Tipp: Für noch bessere AI-Infos kannst du deinen Claude API Key in den Einstellungen hinterlegen!

Viel Spaß beim Lernen!
        `;

        alert(message);
        localStorage.setItem('welcome_shown', 'true');
    }, 500);
}

// Fügt Settings-Button hinzu
function addSettingsButton() {
    const startScreen = document.getElementById('startScreen');
    const container = startScreen.querySelector('.container');

    const settingsBtn = document.createElement('div');
    settingsBtn.className = 'settings-button';
    settingsBtn.innerHTML = '⚙️ Einstellungen';
    settingsBtn.onclick = showSettings;

    container.appendChild(settingsBtn);
}

// Zeigt Einstellungen
function showSettings() {
    const currentKey = aiAssistant.apiKey || '';
    const message = currentKey
        ? 'API Key ist gesetzt. Neuen Key eingeben oder leer lassen zum Entfernen:'
        : 'Claude API Key eingeben (optional):';

    const newKey = prompt(message, '');

    if (newKey !== null) {
        aiAssistant.setApiKey(newKey || null);

        if (newKey) {
            alert('✅ API Key gespeichert! Das Spiel nutzt jetzt echte AI-Antworten.');
        } else {
            alert('ℹ️ API Key entfernt. Das Spiel nutzt simulierte Daten.');
        }
    }
}

// Utility: Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Utility: Format time
function formatTime(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Utility: Get random item from array
function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// Add animations to mode cards on hover
document.addEventListener('DOMContentLoaded', function() {
    const modeCards = document.querySelectorAll('.mode-card');

    modeCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.05)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Confetti animation for perfect score
function celebratePerfectScore() {
    const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#F38181'];

    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            createConfetti(colors[Math.floor(Math.random() * colors.length)]);
        }, i * 30);
    }
}

function createConfetti(color) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = Math.random() * window.innerWidth + 'px';
    confetti.style.backgroundColor = color;
    confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';

    document.body.appendChild(confetti);

    setTimeout(() => {
        confetti.remove();
    }, 5000);
}

// Check for perfect score and celebrate
const originalEndGame = game.endGame.bind(game);
game.endGame = function() {
    originalEndGame();

    const correctAnswers = this.answers.filter(a => a.isCorrect).length;
    const accuracy = Math.round((correctAnswers / this.answers.length) * 100);

    if (accuracy === 100) {
        setTimeout(celebratePerfectScore, 500);
    }
};

// Service Worker for offline support (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Disabled for now, can be enabled later
        // navigator.serviceWorker.register('/sw.js');
    });
}

// Analytics (optional - disabled by default)
function trackGameStart(mode) {
    // Add your analytics code here
    console.log('Game started:', mode);
}

function trackGameEnd(score, mode, accuracy) {
    // Add your analytics code here
    console.log('Game ended:', { score, mode, accuracy });
}

// Share score on social media (optional)
function shareScore(score, mode) {
    const text = `Ich habe ${score} Punkte im Bundesländer Meister (${game.getModeName2(mode)}) erreicht! 🇩🇪 Kannst du mich schlagen?`;

    if (navigator.share) {
        navigator.share({
            title: 'Bundesländer Meister',
            text: text,
            url: window.location.href
        }).catch(err => console.log('Share failed:', err));
    } else {
        // Fallback: Copy to clipboard
        navigator.clipboard.writeText(text + ' ' + window.location.href)
            .then(() => showNotification('Score in Zwischenablage kopiert!', 'success'))
            .catch(err => console.log('Copy failed:', err));
    }
}

// Export/Import highscores
function exportHighscores() {
    const highscores = game.getHighscores();
    const dataStr = JSON.stringify(highscores, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });

    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'bundeslaender-highscores.json';
    link.click();

    URL.revokeObjectURL(url);
    showNotification('Highscores exportiert!', 'success');
}

function importHighscores() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';

    input.onchange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = (event) => {
            try {
                const highscores = JSON.parse(event.target.result);
                localStorage.setItem('bundeslaender_highscores', JSON.stringify(highscores));
                game.loadHighscores();
                showNotification('Highscores importiert!', 'success');
            } catch (error) {
                showNotification('Fehler beim Importieren!', 'error');
            }
        };

        reader.readAsText(file);
    };

    input.click();
}

// Reset all data
function resetAllData() {
    if (confirm('Wirklich alle Daten (Highscores, API Key, etc.) löschen?')) {
        localStorage.clear();
        game.loadHighscores();
        showNotification('Alle Daten gelöscht!', 'info');
    }
}

console.log('🇩🇪 Bundesländer Meister geladen! Viel Spaß beim Spielen!');
