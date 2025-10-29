// Imposter Multiplayer Game
class ImposterGame {
    constructor() {
        this.players = [];
        this.currentPlayerIndex = 0;
        this.gamePhase = 'lobby'; // lobby, role-reveal, playing, voting, gameover
        this.imposterCount = 1;
        this.tasksPerPlayer = 5;
        this.votes = {};
        this.usedColors = new Set();
        this.totalTasks = 0;
        this.completedTasks = 0;

        this.rooms = ['cafeteria', 'medbay', 'electrical', 'storage', 'admin', 'weapons'];

        this.taskTypes = [
            { name: 'Kabel Reparieren', room: 'electrical', type: 'wire' },
            { name: 'Daten Herunterladen', room: 'admin', type: 'download' },
            { name: 'Probe Scannen', room: 'medbay', type: 'scan' },
            { name: 'Müll Entsorgen', room: 'cafeteria', type: 'trash' },
            { name: 'Treibstoff Tanken', room: 'storage', type: 'fuel' },
            { name: 'Waffen Kalibrieren', room: 'weapons', type: 'calibrate' },
            { name: 'Sauerstoff Auffüllen', room: 'admin', type: 'oxygen' },
            { name: 'Energiezellen Aufladen', room: 'electrical', type: 'power' }
        ];

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updatePlayerCount();
    }

    setupEventListeners() {
        // Lobby events
        document.getElementById('add-player-btn').addEventListener('click', () => this.addPlayer());
        document.getElementById('start-game-btn').addEventListener('click', () => this.startGame());
        document.getElementById('player-name').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addPlayer();
        });

        // Role reveal
        document.getElementById('continue-btn').addEventListener('click', () => this.continueFromRoleReveal());

        // Game events
        document.getElementById('emergency-meeting-btn').addEventListener('click', () => this.startVoting('emergency'));
        document.getElementById('next-player-btn').addEventListener('click', () => this.nextPlayer());

        // Move buttons
        document.querySelectorAll('.move-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.movePlayer(e.target.dataset.room));
        });

        // Voting events
        document.getElementById('skip-vote-btn').addEventListener('click', () => this.vote('skip'));
        document.getElementById('end-voting-btn').addEventListener('click', () => this.endVoting());

        // Game over
        document.getElementById('play-again-btn').addEventListener('click', () => this.resetGame());

        // Task modal
        document.getElementById('complete-task-btn').addEventListener('click', () => this.completeTask());
        document.getElementById('cancel-task-btn').addEventListener('click', () => this.closeTaskModal());
    }

    addPlayer() {
        const nameInput = document.getElementById('player-name');
        const colorSelect = document.getElementById('player-color');
        const name = nameInput.value.trim();
        const color = colorSelect.value;

        if (!name) {
            alert('Bitte gib einen Namen ein!');
            return;
        }

        if (this.usedColors.has(color)) {
            alert('Diese Farbe wird bereits verwendet!');
            return;
        }

        if (this.players.some(p => p.name === name)) {
            alert('Dieser Name wird bereits verwendet!');
            return;
        }

        const player = {
            id: Date.now(),
            name: name,
            color: color,
            role: null,
            isAlive: true,
            currentRoom: 'cafeteria',
            tasks: [],
            completedTaskCount: 0,
            hasVoted: false,
            canCallMeeting: true,
            killCooldown: 0
        };

        this.players.push(player);
        this.usedColors.add(color);
        this.updateLobby();

        nameInput.value = '';
        this.findNextAvailableColor(colorSelect);
    }

    findNextAvailableColor(selectElement) {
        const options = selectElement.options;
        for (let i = 0; i < options.length; i++) {
            if (!this.usedColors.has(options[i].value)) {
                selectElement.selectedIndex = i;
                return;
            }
        }
    }

    updateLobby() {
        const container = document.getElementById('players-container');
        container.innerHTML = '';

        this.players.forEach((player, index) => {
            const playerCard = document.createElement('div');
            playerCard.className = 'player-card';
            playerCard.innerHTML = `
                <div class="player-avatar" style="background-color: var(--color-${player.color})"></div>
                <span class="player-name">${player.name}</span>
                <button class="btn-remove" onclick="game.removePlayer(${index})">×</button>
            `;
            container.appendChild(playerCard);
        });

        this.updatePlayerCount();
    }

    removePlayer(index) {
        const player = this.players[index];
        this.usedColors.delete(player.color);
        this.players.splice(index, 1);
        this.updateLobby();
    }

    updatePlayerCount() {
        document.getElementById('player-count').textContent = this.players.length;
        const startBtn = document.getElementById('start-game-btn');
        startBtn.disabled = this.players.length < 4;
    }

    startGame() {
        if (this.players.length < 4) {
            alert('Mindestens 4 Spieler werden benötigt!');
            return;
        }

        this.imposterCount = parseInt(document.getElementById('imposter-count').value);
        this.tasksPerPlayer = parseInt(document.getElementById('tasks-count').value);

        // Assign roles
        this.assignRoles();

        // Assign tasks to crewmates
        this.assignTasks();

        // Show role to first player
        this.currentPlayerIndex = 0;
        this.gamePhase = 'role-reveal';
        this.showRoleReveal();
    }

    assignRoles() {
        // Shuffle players
        const shuffled = [...this.players].sort(() => Math.random() - 0.5);

        // Assign imposters
        for (let i = 0; i < this.imposterCount; i++) {
            shuffled[i].role = 'imposter';
        }

        // Rest are crewmates
        for (let i = this.imposterCount; i < shuffled.length; i++) {
            shuffled[i].role = 'crewmate';
        }
    }

    assignTasks() {
        this.totalTasks = 0;
        this.players.forEach(player => {
            if (player.role === 'crewmate') {
                player.tasks = [];
                for (let i = 0; i < this.tasksPerPlayer; i++) {
                    const task = { ...this.taskTypes[Math.floor(Math.random() * this.taskTypes.length)] };
                    task.id = Date.now() + Math.random();
                    task.completed = false;
                    player.tasks.push(task);
                    this.totalTasks++;
                }
            }
        });
    }

    showRoleReveal() {
        const player = this.players[this.currentPlayerIndex];
        const screen = document.getElementById('role-screen');

        document.getElementById('role-title').textContent =
            player.role === 'imposter' ? '🔴 DU BIST EIN IMPOSTER!' : '🔵 DU BIST EIN CREWMATE!';

        const roleIcon = document.getElementById('role-icon');
        roleIcon.textContent = player.role === 'imposter' ? '🗡️' : '👷';
        roleIcon.className = `role-icon ${player.role}`;

        const description = player.role === 'imposter'
            ? 'Eliminiere die Crewmates, ohne erwischt zu werden!'
            : 'Erledige deine Aufgaben und finde die Imposter!';
        document.getElementById('role-description').textContent = description;

        // Show other imposters if player is imposter
        const teammates = document.getElementById('role-teammates');
        if (player.role === 'imposter') {
            const otherImposters = this.players.filter(p => p.role === 'imposter' && p.id !== player.id);
            if (otherImposters.length > 0) {
                teammates.innerHTML = '<p>Andere Imposter: ' + otherImposters.map(p => p.name).join(', ') + '</p>';
            } else {
                teammates.innerHTML = '';
            }
        } else {
            teammates.innerHTML = '';
        }

        this.switchScreen('role-screen');
    }

    continueFromRoleReveal() {
        this.currentPlayerIndex++;

        if (this.currentPlayerIndex < this.players.length) {
            this.showRoleReveal();
        } else {
            // All players have seen their roles, start the game
            this.currentPlayerIndex = 0;
            this.gamePhase = 'playing';
            this.updateGameScreen();
            this.switchScreen('game-screen');
        }
    }

    updateGameScreen() {
        const player = this.players[this.currentPlayerIndex];

        // Update player info
        document.getElementById('current-player-name').textContent = player.name;
        document.getElementById('current-player-role').textContent =
            player.role === 'imposter' ? '🔴 IMPOSTER' : '🔵 CREWMATE';
        document.getElementById('current-player-role').className =
            `role-badge ${player.role}`;

        // Update stats
        const aliveCount = this.players.filter(p => p.isAlive).length;
        document.getElementById('alive-count').textContent = `👥 Alive: ${aliveCount}`;
        document.getElementById('task-progress').textContent =
            `📋 Tasks: ${this.completedTasks}/${this.totalTasks}`;

        // Update current room
        document.getElementById('current-room').textContent = this.getRoomName(player.currentRoom);

        // Update room displays
        this.updateRoomDisplays();

        // Update action panel
        this.updateActionPanel();
    }

    getRoomName(roomId) {
        const names = {
            cafeteria: 'Cafeteria',
            medbay: 'Krankenstation',
            electrical: 'Elektro',
            storage: 'Lager',
            admin: 'Admin',
            weapons: 'Waffen'
        };
        return names[roomId] || roomId;
    }

    updateRoomDisplays() {
        // Clear all rooms
        document.querySelectorAll('.room-players').forEach(el => el.innerHTML = '');

        // Add players to their rooms
        this.players.forEach(player => {
            if (!player.isAlive) return;

            const room = document.querySelector(`[data-room="${player.currentRoom}"] .room-players`);
            if (room) {
                const playerBadge = document.createElement('div');
                playerBadge.className = 'room-player-badge';
                playerBadge.style.backgroundColor = `var(--color-${player.color})`;
                playerBadge.title = player.name;
                playerBadge.textContent = player.name.charAt(0).toUpperCase();
                room.appendChild(playerBadge);
            }
        });

        // Show tasks in rooms for current player
        const currentPlayer = this.players[this.currentPlayerIndex];
        document.querySelectorAll('.room-tasks').forEach(el => el.innerHTML = '');

        if (currentPlayer.role === 'crewmate') {
            currentPlayer.tasks.forEach(task => {
                if (!task.completed) {
                    const room = document.querySelector(`[data-room="${task.room}"] .room-tasks`);
                    if (room) {
                        const taskIndicator = document.createElement('div');
                        taskIndicator.className = 'task-indicator';
                        taskIndicator.textContent = '!';
                        room.appendChild(taskIndicator);
                    }
                }
            });
        }
    }

    updateActionPanel() {
        const player = this.players[this.currentPlayerIndex];
        const taskActions = document.getElementById('task-actions');
        const imposterActions = document.getElementById('imposter-actions');

        taskActions.innerHTML = '';
        imposterActions.innerHTML = '';

        if (player.role === 'crewmate') {
            // Show available tasks in current room
            const tasksInRoom = player.tasks.filter(t => t.room === player.currentRoom && !t.completed);

            if (tasksInRoom.length > 0) {
                const tasksHTML = tasksInRoom.map(task =>
                    `<button class="btn btn-task" onclick="game.startTask('${task.id}')">${task.name}</button>`
                ).join('');
                taskActions.innerHTML = '<h4>Verfügbare Aufgaben:</h4>' + tasksHTML;
            }
        } else {
            // Imposter actions
            const playersInRoom = this.players.filter(p =>
                p.isAlive && p.id !== player.id && p.currentRoom === player.currentRoom
            );

            if (playersInRoom.length > 0 && player.killCooldown === 0) {
                const killButtons = playersInRoom.map(p =>
                    `<button class="btn btn-kill" onclick="game.killPlayer('${p.id}')">🔪 ${p.name} Eliminieren</button>`
                ).join('');
                imposterActions.innerHTML = '<h4>Imposter Aktionen:</h4>' + killButtons;
            } else if (player.killCooldown > 0) {
                imposterActions.innerHTML = `<p>Kill Cooldown: ${player.killCooldown} Runden</p>`;
            }
        }
    }

    movePlayer(room) {
        const player = this.players[this.currentPlayerIndex];
        player.currentRoom = room;
        this.updateGameScreen();
    }

    startTask(taskId) {
        const player = this.players[this.currentPlayerIndex];
        const task = player.tasks.find(t => t.id == taskId);

        if (!task) return;

        this.currentTask = task;
        this.showTaskModal(task);
    }

    showTaskModal(task) {
        document.getElementById('task-title').textContent = task.name;
        document.getElementById('task-description').textContent =
            'Führe die Aufgabe aus, um sie abzuschließen.';

        const taskInterface = document.getElementById('task-interface');
        taskInterface.innerHTML = this.getTaskInterface(task);

        document.getElementById('task-modal').style.display = 'flex';
    }

    getTaskInterface(task) {
        switch (task.type) {
            case 'wire':
                return `
                    <div class="task-wires">
                        <p>Verbinde die farbigen Kabel:</p>
                        <div class="wire-game">
                            ${['🔴', '🔵', '🟢', '🟡'].map(color =>
                                `<div class="wire-pair"><span>${color}</span> ➡️ <span>${color}</span></div>`
                            ).join('')}
                        </div>
                    </div>
                `;
            case 'download':
                return `
                    <div class="task-download">
                        <p>Daten werden heruntergeladen...</p>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: 100%"></div>
                        </div>
                    </div>
                `;
            case 'scan':
                return `
                    <div class="task-scan">
                        <p>Bitte still stehen für Scan...</p>
                        <div class="scan-animation">🔍</div>
                    </div>
                `;
            default:
                return `<p>Aufgabe durchführen...</p>`;
        }
    }

    completeTask() {
        if (!this.currentTask) return;

        const player = this.players[this.currentPlayerIndex];
        const task = player.tasks.find(t => t.id === this.currentTask.id);

        if (task) {
            task.completed = true;
            player.completedTaskCount++;
            this.completedTasks++;
        }

        this.closeTaskModal();
        this.updateGameScreen();
        this.checkWinCondition();
    }

    closeTaskModal() {
        document.getElementById('task-modal').style.display = 'none';
        this.currentTask = null;
    }

    killPlayer(targetId) {
        const player = this.players[this.currentPlayerIndex];
        const target = this.players.find(p => p.id == targetId);

        if (!target || !target.isAlive) return;

        target.isAlive = false;
        player.killCooldown = 3;

        alert(`${player.name} hat ${target.name} eliminiert!`);

        this.updateGameScreen();
        this.checkWinCondition();
    }

    nextPlayer() {
        const currentPlayer = this.players[this.currentPlayerIndex];
        if (currentPlayer.killCooldown > 0) {
            currentPlayer.killCooldown--;
        }

        do {
            this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
        } while (!this.players[this.currentPlayerIndex].isAlive && this.players.some(p => p.isAlive));

        this.updateGameScreen();
    }

    startVoting(reason) {
        this.gamePhase = 'voting';
        this.votes = {};

        const reasonText = reason === 'emergency'
            ? '🚨 Notfall-Meeting wurde einberufen!'
            : `💀 ${reason} wurde tot aufgefunden!`;

        document.getElementById('voting-reason').textContent = reasonText;

        // Reset vote status
        this.players.forEach(p => p.hasVoted = false);

        this.updateVotingScreen();
        this.switchScreen('voting-screen');
    }

    updateVotingScreen() {
        const voteOptions = document.getElementById('vote-options');
        voteOptions.innerHTML = '';

        this.players.forEach(player => {
            if (player.isAlive) {
                const option = document.createElement('button');
                option.className = 'vote-option';
                option.innerHTML = `
                    <div class="player-avatar" style="background-color: var(--color-${player.color})"></div>
                    <span>${player.name}</span>
                `;
                option.addEventListener('click', () => this.vote(player.id));
                voteOptions.appendChild(option);
            }
        });

        // Update votes display
        this.updateVotesDisplay();
    }

    vote(target) {
        const currentPlayer = this.players[this.currentPlayerIndex];

        if (currentPlayer.hasVoted) {
            alert('Du hast bereits abgestimmt!');
            return;
        }

        currentPlayer.hasVoted = true;

        if (target === 'skip') {
            this.votes['skip'] = (this.votes['skip'] || 0) + 1;
        } else {
            this.votes[target] = (this.votes[target] || 0) + 1;
        }

        this.updateVotesDisplay();

        // Check if all alive players have voted
        const allVoted = this.players.filter(p => p.isAlive).every(p => p.hasVoted);
        if (allVoted) {
            document.getElementById('end-voting-btn').style.display = 'block';
        } else {
            // Move to next player
            setTimeout(() => {
                this.nextPlayerVote();
            }, 1000);
        }
    }

    nextPlayerVote() {
        do {
            this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
        } while (!this.players[this.currentPlayerIndex].isAlive);

        const currentName = this.players[this.currentPlayerIndex].name;
        alert(`${currentName}, du bist an der Reihe zu wählen!`);
    }

    updateVotesDisplay() {
        const votesList = document.getElementById('votes-list');
        votesList.innerHTML = '';

        const votedCount = this.players.filter(p => p.hasVoted).length;
        const totalAlive = this.players.filter(p => p.isAlive).length;

        votesList.innerHTML = `<p>Abgestimmt: ${votedCount}/${totalAlive}</p>`;
    }

    endVoting() {
        // Find player with most votes
        let maxVotes = 0;
        let ejectedId = null;
        let tie = false;

        Object.entries(this.votes).forEach(([id, count]) => {
            if (count > maxVotes) {
                maxVotes = count;
                ejectedId = id;
                tie = false;
            } else if (count === maxVotes && maxVotes > 0) {
                tie = true;
            }
        });

        if (tie || ejectedId === 'skip' || maxVotes === 0) {
            alert('Keine Einigung! Niemand wurde eliminiert.');
        } else {
            const ejected = this.players.find(p => p.id == ejectedId);
            ejected.isAlive = false;
            alert(`${ejected.name} wurde eliminiert! Sie waren ein ${ejected.role === 'imposter' ? 'IMPOSTER' : 'CREWMATE'}!`);
        }

        // Reset votes
        this.players.forEach(p => p.hasVoted = false);
        this.votes = {};
        document.getElementById('end-voting-btn').style.display = 'none';

        this.checkWinCondition();

        if (this.gamePhase === 'playing') {
            this.gamePhase = 'playing';
            this.updateGameScreen();
            this.switchScreen('game-screen');
        }
    }

    checkWinCondition() {
        const aliveCrewmates = this.players.filter(p => p.isAlive && p.role === 'crewmate').length;
        const aliveImposters = this.players.filter(p => p.isAlive && p.role === 'imposter').length;

        if (aliveImposters === 0) {
            this.endGame('crewmates', 'Alle Imposter wurden eliminiert!');
        } else if (aliveImposters >= aliveCrewmates) {
            this.endGame('imposters', 'Die Imposter haben die Mehrheit!');
        } else if (this.completedTasks >= this.totalTasks) {
            this.endGame('crewmates', 'Alle Aufgaben wurden erledigt!');
        }
    }

    endGame(winner, reason) {
        this.gamePhase = 'gameover';

        const title = winner === 'crewmates' ? '🔵 CREWMATES GEWINNEN!' : '🔴 IMPOSTERS GEWINNEN!';
        document.getElementById('winner-title').textContent = title;

        const icon = winner === 'crewmates' ? '👷‍♂️' : '🗡️';
        document.getElementById('winner-icon').textContent = icon;

        document.getElementById('winner-message').textContent = reason;

        // Show all players and their roles
        const finalPlayers = document.getElementById('final-players');
        finalPlayers.innerHTML = '<h3>Spieler Rollen:</h3>';

        this.players.forEach(player => {
            const playerDiv = document.createElement('div');
            playerDiv.className = 'final-player';
            playerDiv.innerHTML = `
                <div class="player-avatar" style="background-color: var(--color-${player.color})"></div>
                <span>${player.name}</span>
                <span class="role-badge ${player.role}">${player.role === 'imposter' ? '🔴 IMPOSTER' : '🔵 CREWMATE'}</span>
                <span>${player.isAlive ? '✅ Alive' : '💀 Dead'}</span>
            `;
            finalPlayers.appendChild(playerDiv);
        });

        this.switchScreen('gameover-screen');
    }

    resetGame() {
        this.players = [];
        this.currentPlayerIndex = 0;
        this.gamePhase = 'lobby';
        this.votes = {};
        this.usedColors.clear();
        this.totalTasks = 0;
        this.completedTasks = 0;

        this.updateLobby();
        this.switchScreen('lobby-screen');
    }

    switchScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
    }
}

// Initialize game
const game = new ImposterGame();
