/**
 * FTL: Faster Than Light - Web Edition
 * Main Game Logic
 */

// ============================================================================
// GAME STATE
// ============================================================================

const GameState = {
    screen: 'start',
    paused: false,
    gameLoop: null,
    selectedShip: 'kestrel',

    // Resources
    scrap: 0,
    fuel: 16,
    missiles: 8,
    droneParts: 2,

    // Ship Stats
    hull: 30,
    maxHull: 30,

    // Power System
    powerMax: 8,
    powerUsed: 0,

    // Systems
    systems: {
        shields: { level: 2, maxLevel: 4, power: 0, maxPower: 4, damaged: 0 },
        weapons: { level: 3, maxLevel: 4, power: 0, maxPower: 4, damaged: 0 },
        engines: { level: 2, maxLevel: 3, power: 0, maxPower: 3, damaged: 0 },
        medbay: { level: 1, maxLevel: 3, power: 0, maxPower: 3, damaged: 0 },
        oxygen: { level: 1, maxLevel: 2, power: 1, maxPower: 2, damaged: 0 },
        pilot: { level: 1, maxLevel: 3, manned: false },
        sensors: { level: 1, maxLevel: 3, manned: false },
        doors: { level: 1, maxLevel: 3, manned: false }
    },

    // Shields
    shieldLayers: 0,
    maxShieldLayers: 2,
    shieldRechargeTimer: 0,

    // Weapons
    weapons: [],
    selectedWeapon: null,
    targetRoom: null,
    autofire: false,

    // Crew
    crew: [],
    selectedCrew: null,

    // Combat
    inCombat: false,
    enemy: null,

    // Sector
    currentSector: 1,
    totalSectors: 8,
    sectorMap: null,
    currentNode: null,
    visitedNodes: [],
    rebelProgress: 0,

    // Stats
    totalScrap: 0,
    shipsDestroyed: 0
};

// ============================================================================
// SHIP CONFIGURATIONS
// ============================================================================

const ShipConfigs = {
    kestrel: {
        name: 'The Kestrel',
        hull: 30,
        weapons: [
            { name: 'Burst Laser II', type: 'laser', damage: 1, shots: 3, chargeTime: 12, powerCost: 2, charge: 0 }
        ],
        systems: {
            shields: { level: 2, power: 2 },
            weapons: { level: 3, power: 2 },
            engines: { level: 2, power: 1 },
            medbay: { level: 1, power: 0 },
            oxygen: { level: 1, power: 1 },
            pilot: { level: 1 },
            sensors: { level: 1 },
            doors: { level: 1 }
        },
        crew: [
            { name: 'Smith', race: 'human', health: 100, room: 'pilot', skills: { pilot: 0, engines: 0, shields: 0, weapons: 0, repair: 0, combat: 0 } },
            { name: 'Jones', race: 'human', health: 100, room: 'weapons', skills: { pilot: 0, engines: 0, shields: 0, weapons: 0, repair: 0, combat: 0 } },
            { name: 'Williams', race: 'human', health: 100, room: 'shields', skills: { pilot: 0, engines: 0, shields: 0, weapons: 0, repair: 0, combat: 0 } }
        ]
    },
    engi: {
        name: 'The Torus',
        hull: 30,
        weapons: [
            { name: 'Ion Blaster', type: 'ion', damage: 0, ionDamage: 1, shots: 1, chargeTime: 8, powerCost: 1, charge: 0 }
        ],
        systems: {
            shields: { level: 2, power: 2 },
            weapons: { level: 2, power: 1 },
            engines: { level: 2, power: 1 },
            medbay: { level: 1, power: 0 },
            oxygen: { level: 1, power: 1 },
            pilot: { level: 1 },
            sensors: { level: 1 },
            doors: { level: 1 }
        },
        crew: [
            { name: 'Virus', race: 'engi', health: 100, room: 'pilot', skills: { pilot: 0, engines: 0, shields: 0, weapons: 0, repair: 2, combat: 0 } },
            { name: 'Malware', race: 'engi', health: 100, room: 'engines', skills: { pilot: 0, engines: 0, shields: 0, weapons: 0, repair: 2, combat: 0 } }
        ]
    },
    stealth: {
        name: 'The Nesasio',
        hull: 25,
        weapons: [
            { name: 'Dual Laser', type: 'laser', damage: 1, shots: 2, chargeTime: 10, powerCost: 1, charge: 0 },
            { name: 'Mini Beam', type: 'beam', damage: 1, beamLength: 2, chargeTime: 12, powerCost: 1, charge: 0 }
        ],
        systems: {
            shields: { level: 0, power: 0 },
            weapons: { level: 3, power: 2 },
            engines: { level: 2, power: 2 },
            medbay: { level: 1, power: 0 },
            oxygen: { level: 1, power: 1 },
            pilot: { level: 1 },
            sensors: { level: 1 },
            doors: { level: 1 }
        },
        crew: [
            { name: 'Shadow', race: 'human', health: 100, room: 'pilot', skills: { pilot: 1, engines: 0, shields: 0, weapons: 0, repair: 0, combat: 0 } },
            { name: 'Ghost', race: 'human', health: 100, room: 'weapons', skills: { pilot: 0, engines: 0, shields: 0, weapons: 1, repair: 0, combat: 0 } },
            { name: 'Phantom', race: 'slug', health: 100, room: 'engines', skills: { pilot: 0, engines: 0, shields: 0, weapons: 0, repair: 0, combat: 1 } }
        ]
    }
};

// ============================================================================
// ENEMY CONFIGURATIONS
// ============================================================================

const EnemyTypes = {
    scout: {
        name: 'Rebellenscout',
        hull: 15,
        maxHull: 15,
        shields: 1,
        maxShields: 1,
        weapons: [
            { name: 'Basic Laser', type: 'laser', damage: 1, shots: 1, chargeTime: 10, charge: 0 }
        ],
        systems: { shields: 2, weapons: 2, engines: 2, pilot: 1 },
        evasion: 15,
        reward: { scrap: [15, 25], fuel: [1, 3], missiles: [0, 2] }
    },
    fighter: {
        name: 'Rebellenjäger',
        hull: 20,
        maxHull: 20,
        shields: 2,
        maxShields: 2,
        weapons: [
            { name: 'Burst Laser I', type: 'laser', damage: 1, shots: 2, chargeTime: 11, charge: 0 }
        ],
        systems: { shields: 3, weapons: 3, engines: 2, pilot: 1 },
        evasion: 20,
        reward: { scrap: [20, 35], fuel: [1, 4], missiles: [1, 3] }
    },
    bomber: {
        name: 'Rebellenbomber',
        hull: 25,
        maxHull: 25,
        shields: 1,
        maxShields: 1,
        weapons: [
            { name: 'Artemis Missile', type: 'missile', damage: 2, shots: 1, chargeTime: 14, charge: 0 }
        ],
        systems: { shields: 2, weapons: 3, engines: 1, pilot: 1 },
        evasion: 10,
        reward: { scrap: [25, 40], fuel: [2, 4], missiles: [2, 5] }
    },
    elite: {
        name: 'Elitekreuzer',
        hull: 35,
        maxHull: 35,
        shields: 3,
        maxShields: 3,
        weapons: [
            { name: 'Burst Laser II', type: 'laser', damage: 1, shots: 3, chargeTime: 12, charge: 0 },
            { name: 'Heavy Laser', type: 'laser', damage: 2, shots: 1, chargeTime: 9, charge: 0 }
        ],
        systems: { shields: 4, weapons: 4, engines: 3, pilot: 2 },
        evasion: 25,
        reward: { scrap: [40, 60], fuel: [3, 6], missiles: [2, 5] }
    },
    flagship: {
        name: 'Rebellenflaggschiff',
        hull: 50,
        maxHull: 50,
        shields: 4,
        maxShields: 4,
        weapons: [
            { name: 'Triple Heavy Laser', type: 'laser', damage: 2, shots: 3, chargeTime: 15, charge: 0 },
            { name: 'Leto Missiles', type: 'missile', damage: 1, shots: 2, chargeTime: 12, charge: 0 },
            { name: 'Ion Blast', type: 'ion', damage: 0, ionDamage: 2, shots: 1, chargeTime: 10, charge: 0 }
        ],
        systems: { shields: 4, weapons: 4, engines: 3, pilot: 3 },
        evasion: 30,
        reward: { scrap: [100, 150], fuel: [10, 10], missiles: [10, 10] }
    }
};

// ============================================================================
// EVENTS
// ============================================================================

const Events = {
    empty: [
        {
            text: 'Du erreichst das Beacon und findest... nichts. Der Weltraum ist leer und still.',
            choices: [
                { text: 'Weiter', action: 'continue' }
            ]
        },
        {
            text: 'Ein verlassenes Trümmerfeld. Hier muss einmal eine Schlacht stattgefunden haben.',
            choices: [
                { text: 'Nach Ressourcen suchen', action: 'search', reward: { scrap: [5, 15] } },
                { text: 'Weiterreisen', action: 'continue' }
            ]
        }
    ],
    hostile: [
        {
            text: 'Ein feindliches Schiff nähert sich! Die Rebellen haben dich gefunden!',
            choices: [
                { text: 'Zum Kampf!', action: 'combat', enemy: 'random' },
                { text: 'Fliehen (1 Treibstoff)', action: 'flee', cost: { fuel: 1 } }
            ]
        }
    ],
    distress: [
        {
            text: 'Du empfängst ein Notsignal von einem nahen Planeten. Ein Händler bittet um Hilfe gegen Piraten.',
            choices: [
                { text: 'Zu Hilfe eilen', action: 'combat', enemy: 'scout', reward: { scrap: [15, 25] } },
                { text: 'Ignorieren', action: 'continue' }
            ]
        },
        {
            text: 'Eine Rettungskapsel treibt im Weltraum. Jemand überlebte einen Kampf!',
            choices: [
                { text: 'Retten (Crew +1)', action: 'crew_add', crewRace: 'random' },
                { text: 'Ignorieren', action: 'continue' }
            ]
        }
    ],
    store: [
        {
            text: 'Eine freundliche Raumstation! Der Händler begrüßt dich herzlich.',
            choices: [
                { text: 'Laden betreten', action: 'store' },
                { text: 'Weiterreisen', action: 'continue' }
            ]
        }
    ],
    quest: [
        {
            text: 'Ein Engi-Schiff kontaktiert dich. Sie bieten Treibstoff im Austausch für Scrap.',
            choices: [
                { text: 'Tauschen (20 Scrap für 5 Treibstoff)', action: 'trade', cost: { scrap: 20 }, reward: { fuel: 5 } },
                { text: 'Ablehnen', action: 'continue' }
            ]
        },
        {
            text: 'Ein Asteroid mit seltenen Mineralien! Aber der Abbau ist gefährlich.',
            choices: [
                { text: 'Abbauen (Risiko)', action: 'risk', success: { scrap: [30, 50] }, fail: { hull: -5 } },
                { text: 'Weiterfliegen', action: 'continue' }
            ]
        }
    ],
    nebula: [
        {
            text: 'Du fliegst in einen Nebel. Die Sensoren sind gestört, aber die Rebellen können dich hier schwerer finden.',
            choices: [
                { text: 'Weiter', action: 'continue' }
            ]
        }
    ]
};

// ============================================================================
// UI CONTROLLER
// ============================================================================

const UI = {
    screens: {},

    init() {
        this.screens = {
            start: document.getElementById('start-screen'),
            shipSelect: document.getElementById('ship-select-screen'),
            howToPlay: document.getElementById('how-to-play-screen'),
            game: document.getElementById('game-screen'),
            sectorMap: document.getElementById('sector-map-screen'),
            store: document.getElementById('store-screen'),
            gameOver: document.getElementById('game-over-screen'),
            victory: document.getElementById('victory-screen')
        };

        this.bindEvents();
    },

    bindEvents() {
        // Start screen
        document.getElementById('new-game-btn').addEventListener('click', () => this.showScreen('shipSelect'));
        document.getElementById('continue-btn').addEventListener('click', () => Game.loadGame());
        document.getElementById('how-to-play-btn').addEventListener('click', () => this.showScreen('howToPlay'));

        // Ship select screen
        document.querySelectorAll('.ship-option').forEach(option => {
            option.addEventListener('click', () => {
                document.querySelectorAll('.ship-option').forEach(o => o.classList.remove('selected'));
                option.classList.add('selected');
                GameState.selectedShip = option.dataset.ship;
            });
        });
        document.getElementById('start-game-btn').addEventListener('click', () => Game.startNewGame());
        document.getElementById('back-to-menu-btn').addEventListener('click', () => this.showScreen('start'));

        // How to play screen
        document.getElementById('back-from-help-btn').addEventListener('click', () => this.showScreen('start'));

        // Game screen
        document.getElementById('jump-btn').addEventListener('click', () => Game.openSectorMap());
        document.getElementById('pause-btn').addEventListener('click', () => Game.togglePause());
        document.getElementById('autofire-btn').addEventListener('click', () => Game.toggleAutofire());

        // Power buttons
        document.querySelectorAll('.power-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const system = e.target.closest('.power-system').dataset.system;
                const action = e.target.dataset.action;
                Game.adjustPower(system, action);
            });
        });

        // Ship rooms - player
        document.querySelectorAll('#player-ship .ship-room').forEach(room => {
            room.addEventListener('click', () => {
                if (GameState.selectedCrew) {
                    Game.moveCrewToRoom(GameState.selectedCrew, room.dataset.room);
                }
            });
        });

        // Ship rooms - enemy targeting
        document.querySelectorAll('#enemy-ship .enemy-room').forEach(room => {
            room.addEventListener('click', () => {
                if (GameState.selectedWeapon !== null && GameState.inCombat) {
                    Game.setTarget(room.dataset.room);
                }
            });
        });

        // Sector map
        document.getElementById('close-map-btn').addEventListener('click', () => this.showScreen('game'));

        // Store
        document.getElementById('leave-store-btn').addEventListener('click', () => this.showScreen('game'));
        document.getElementById('repair-hull-btn').addEventListener('click', () => Game.repairHull(1));
        document.getElementById('repair-all-btn').addEventListener('click', () => Game.repairHull(GameState.maxHull - GameState.hull));
        document.querySelectorAll('[data-buy]').forEach(btn => {
            btn.addEventListener('click', () => Game.buyResource(btn.dataset.buy));
        });

        // Game over
        document.getElementById('restart-btn').addEventListener('click', () => this.showScreen('shipSelect'));
        document.getElementById('main-menu-btn').addEventListener('click', () => this.showScreen('start'));

        // Victory
        document.getElementById('victory-restart-btn').addEventListener('click', () => this.showScreen('shipSelect'));
        document.getElementById('victory-menu-btn').addEventListener('click', () => this.showScreen('start'));

        // Pause overlay
        document.getElementById('resume-btn').addEventListener('click', () => Game.togglePause());
        document.getElementById('save-quit-btn').addEventListener('click', () => {
            Game.saveGame();
            this.showScreen('start');
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (GameState.screen === 'game') {
                if (e.code === 'Space') {
                    Game.togglePause();
                } else if (e.code === 'KeyM') {
                    Game.openSectorMap();
                } else if (e.code === 'KeyA') {
                    Game.toggleAutofire();
                } else if (e.key >= '1' && e.key <= '4') {
                    const index = parseInt(e.key) - 1;
                    if (GameState.weapons[index]) {
                        Game.selectWeapon(index);
                    }
                }
            }
        });
    },

    showScreen(screenName) {
        Object.values(this.screens).forEach(screen => {
            if (screen) screen.classList.remove('active');
        });

        if (this.screens[screenName]) {
            this.screens[screenName].classList.add('active');
            GameState.screen = screenName;
        }

        // Hide pause overlay when switching screens
        document.getElementById('pause-overlay').classList.add('hidden');
    },

    updateResources() {
        document.getElementById('hull-value').textContent = `${GameState.hull}/${GameState.maxHull}`;
        document.getElementById('hull-fill').style.width = `${(GameState.hull / GameState.maxHull) * 100}%`;
        document.getElementById('scrap-value').textContent = GameState.scrap;
        document.getElementById('fuel-value').textContent = GameState.fuel;
        document.getElementById('missiles-value').textContent = GameState.missiles;
        document.getElementById('drones-value').textContent = GameState.droneParts;
        document.getElementById('sector-value').textContent = GameState.currentSector;

        // Store screen
        if (document.getElementById('store-scrap')) {
            document.getElementById('store-scrap').textContent = GameState.scrap;
        }
    },

    updatePowerBars() {
        document.getElementById('power-available').textContent = GameState.powerMax - GameState.powerUsed;
        document.getElementById('power-max').textContent = GameState.powerMax;

        Object.entries(GameState.systems).forEach(([name, system]) => {
            if (system.power !== undefined) {
                const container = document.querySelector(`.power-system[data-system="${name}"] .power-bar`);
                if (container) {
                    container.innerHTML = '';
                    for (let i = 0; i < system.maxLevel; i++) {
                        const pip = document.createElement('div');
                        pip.className = 'pip';
                        if (i < system.power) pip.classList.add('filled');
                        if (i >= system.level - system.damaged) pip.classList.add('damaged');
                        container.appendChild(pip);
                    }
                }
            }
        });
    },

    updateShields() {
        // Player shields
        GameState.shieldLayers = Math.floor(GameState.systems.shields.power / 2);
        document.getElementById('player-shields-count').textContent = GameState.shieldLayers;

        // Enemy shields
        if (GameState.enemy) {
            document.getElementById('enemy-shields-count').textContent = GameState.enemy.shields;
        }
    },

    updateShipRooms() {
        // Update player ship rooms
        Object.entries(GameState.systems).forEach(([name, system]) => {
            const room = document.getElementById(`room-${name}`);
            if (room) {
                const levelDisplay = room.querySelector('.room-system-level');
                if (levelDisplay && system.power !== undefined) {
                    levelDisplay.innerHTML = '';
                    for (let i = 0; i < system.level; i++) {
                        const pip = document.createElement('div');
                        pip.className = 'power-pip';
                        if (i < system.power) pip.classList.add('active');
                        if (i >= system.level - system.damaged) pip.classList.add('damaged');
                        levelDisplay.appendChild(pip);
                    }
                }

                // Show crew in room
                const crewInRoom = GameState.crew.filter(c => c.room === name);
                let crewDisplay = room.querySelector('.crew-in-room');
                if (!crewDisplay) {
                    crewDisplay = document.createElement('div');
                    crewDisplay.className = 'crew-in-room';
                    room.appendChild(crewDisplay);
                }
                crewDisplay.innerHTML = '';
                crewInRoom.forEach(c => {
                    const dot = document.createElement('div');
                    dot.className = `crew-dot ${c.race}`;
                    crewDisplay.appendChild(dot);
                });
            }
        });
    },

    updateWeapons() {
        const weaponsList = document.getElementById('weapons-list');
        weaponsList.innerHTML = '';

        GameState.weapons.forEach((weapon, index) => {
            const slot = document.createElement('div');
            slot.className = 'weapon-slot';
            if (weapon.powered) slot.classList.add('powered');
            if (GameState.selectedWeapon === index) slot.classList.add('selected');

            slot.innerHTML = `
                <div class="weapon-name">${weapon.name}</div>
                <div class="weapon-info">${weapon.type} | ${weapon.powerCost} Energie</div>
            `;

            slot.addEventListener('click', () => Game.selectWeapon(index));
            weaponsList.appendChild(slot);
        });

        // Update combat charge bars
        if (GameState.inCombat) {
            const chargeContainer = document.getElementById('weapon-charge-bars');
            chargeContainer.innerHTML = '';

            GameState.weapons.forEach((weapon, index) => {
                if (weapon.powered) {
                    const chargeBar = document.createElement('div');
                    chargeBar.className = 'weapon-charge';
                    if (weapon.charge >= weapon.chargeTime) chargeBar.classList.add('ready');

                    const percentage = Math.min((weapon.charge / weapon.chargeTime) * 100, 100);
                    chargeBar.innerHTML = `
                        <span class="weapon-name">${weapon.name}</span>
                        <div class="charge-bar">
                            <div class="charge-fill" style="width: ${percentage}%"></div>
                        </div>
                    `;

                    chargeBar.addEventListener('click', () => Game.selectWeapon(index));
                    chargeContainer.appendChild(chargeBar);
                }
            });
        }
    },

    updateCrew() {
        const crewList = document.getElementById('crew-list');
        crewList.innerHTML = '';

        GameState.crew.forEach((member, index) => {
            const crewDiv = document.createElement('div');
            crewDiv.className = 'crew-member';
            if (GameState.selectedCrew === index) crewDiv.classList.add('selected');

            const healthPercent = (member.health / 100) * 100;
            const healthClass = healthPercent < 30 ? 'low' : '';

            crewDiv.innerHTML = `
                <div class="crew-avatar ${member.race}"></div>
                <div class="crew-info">
                    <div class="crew-name">${member.name}</div>
                    <div class="crew-health-bar">
                        <div class="crew-health-fill ${healthClass}" style="width: ${healthPercent}%"></div>
                    </div>
                </div>
            `;

            crewDiv.addEventListener('click', () => Game.selectCrew(index));
            crewList.appendChild(crewDiv);
        });
    },

    updateEnemy() {
        const container = document.getElementById('enemy-ship-container');
        if (GameState.inCombat && GameState.enemy) {
            container.classList.remove('hidden');
            document.getElementById('enemy-name').textContent = GameState.enemy.name;
            document.getElementById('enemy-hull-value').textContent = `${GameState.enemy.hull}/${GameState.enemy.maxHull}`;
            document.getElementById('enemy-hull-fill').style.width = `${(GameState.enemy.hull / GameState.enemy.maxHull) * 100}%`;
            document.getElementById('enemy-shields-count').textContent = GameState.enemy.shields;

            // Update target highlight
            document.querySelectorAll('.enemy-room').forEach(room => {
                room.classList.remove('targeted');
                if (GameState.targetRoom === room.dataset.room) {
                    room.classList.add('targeted');
                }
            });
        } else {
            container.classList.add('hidden');
        }
    },

    updateCombatArea() {
        const combatArea = document.getElementById('combat-area');
        const eventArea = document.getElementById('event-area');

        if (GameState.inCombat) {
            combatArea.classList.remove('hidden');
            eventArea.style.display = 'none';
        } else {
            combatArea.classList.add('hidden');
            eventArea.style.display = 'block';
        }
    },

    showEvent(event) {
        const eventText = document.getElementById('event-text');
        const eventChoices = document.getElementById('event-choices');

        eventText.textContent = event.text;
        eventChoices.innerHTML = '';

        event.choices.forEach((choice, index) => {
            const btn = document.createElement('button');
            btn.className = 'event-choice';
            btn.textContent = choice.text;

            // Check if choice is affordable
            let canAfford = true;
            if (choice.cost) {
                Object.entries(choice.cost).forEach(([resource, amount]) => {
                    if (GameState[resource] < amount) canAfford = false;
                });
            }

            if (!canAfford) {
                btn.classList.add('disabled');
                const req = document.createElement('div');
                req.className = 'requirement';
                req.textContent = 'Nicht genug Ressourcen';
                btn.appendChild(req);
            }

            btn.addEventListener('click', () => {
                if (canAfford) Game.handleEventChoice(choice);
            });

            eventChoices.appendChild(btn);
        });
    },

    addCombatLog(message, type = '') {
        const log = document.getElementById('combat-log');
        const entry = document.createElement('div');
        entry.className = `log-entry ${type}`;
        entry.textContent = message;
        log.appendChild(entry);
        log.scrollTop = log.scrollHeight;

        // Keep log manageable
        while (log.children.length > 50) {
            log.removeChild(log.firstChild);
        }
    },

    clearCombatLog() {
        document.getElementById('combat-log').innerHTML = '';
    },

    showGameOver() {
        document.getElementById('final-sectors').textContent = GameState.currentSector;
        document.getElementById('final-kills').textContent = GameState.shipsDestroyed;
        document.getElementById('final-scrap').textContent = GameState.totalScrap;
        this.showScreen('gameOver');
    },

    showVictory() {
        document.getElementById('victory-crew').textContent = GameState.crew.length;
        document.getElementById('victory-kills').textContent = GameState.shipsDestroyed;
        document.getElementById('victory-scrap').textContent = GameState.totalScrap;
        this.showScreen('victory');
    }
};

// ============================================================================
// SECTOR MAP
// ============================================================================

const SectorMap = {
    canvas: null,
    ctx: null,
    nodes: [],
    connections: [],

    init() {
        this.canvas = document.getElementById('sector-canvas');
        this.ctx = this.canvas.getContext('2d');
    },

    generate() {
        const nodeContainer = document.getElementById('map-nodes');
        nodeContainer.innerHTML = '';

        this.nodes = [];
        this.connections = [];

        // Generate nodes in columns
        const columns = 6;
        const nodesPerColumn = [1, 2, 3, 3, 2, 1];
        const width = 700;
        const height = 450;

        let nodeId = 0;
        for (let col = 0; col < columns; col++) {
            const numNodes = nodesPerColumn[col];
            const x = 50 + (col * (width / (columns - 1)));

            for (let i = 0; i < numNodes; i++) {
                const ySpacing = height / (numNodes + 1);
                const y = 25 + ySpacing * (i + 1);

                let type = 'empty';
                const rand = Math.random();
                if (col === 0) {
                    type = 'current';
                } else if (col === columns - 1) {
                    type = 'exit';
                } else if (rand < 0.3) {
                    type = 'hostile';
                } else if (rand < 0.4) {
                    type = 'store';
                } else if (rand < 0.5) {
                    type = 'distress';
                } else if (rand < 0.6) {
                    type = 'danger';
                }

                this.nodes.push({
                    id: nodeId++,
                    x, y, type,
                    column: col,
                    visited: col === 0
                });
            }
        }

        // Generate connections
        for (let col = 0; col < columns - 1; col++) {
            const currentColNodes = this.nodes.filter(n => n.column === col);
            const nextColNodes = this.nodes.filter(n => n.column === col + 1);

            currentColNodes.forEach(node => {
                // Connect to 1-2 nodes in next column
                const numConnections = Math.min(Math.floor(Math.random() * 2) + 1, nextColNodes.length);
                const shuffled = [...nextColNodes].sort(() => Math.random() - 0.5);

                for (let i = 0; i < numConnections; i++) {
                    this.connections.push({
                        from: node.id,
                        to: shuffled[i].id
                    });
                }
            });
        }

        // Ensure all nodes have at least one incoming connection
        for (let col = 1; col < columns; col++) {
            const colNodes = this.nodes.filter(n => n.column === col);
            colNodes.forEach(node => {
                const hasConnection = this.connections.some(c => c.to === node.id);
                if (!hasConnection) {
                    const prevColNodes = this.nodes.filter(n => n.column === col - 1);
                    const randomPrev = prevColNodes[Math.floor(Math.random() * prevColNodes.length)];
                    this.connections.push({
                        from: randomPrev.id,
                        to: node.id
                    });
                }
            });
        }

        GameState.currentNode = this.nodes.find(n => n.type === 'current');
        GameState.visitedNodes = [GameState.currentNode.id];
    },

    render() {
        // Set canvas size
        this.canvas.width = 800;
        this.canvas.height = 500;

        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw connections
        ctx.strokeStyle = '#3a5a7a';
        ctx.lineWidth = 2;

        this.connections.forEach(conn => {
            const fromNode = this.nodes.find(n => n.id === conn.from);
            const toNode = this.nodes.find(n => n.id === conn.to);

            ctx.beginPath();
            ctx.moveTo(fromNode.x, fromNode.y);
            ctx.lineTo(toNode.x, toNode.y);
            ctx.stroke();
        });

        // Draw rebel progress zone
        const rebelX = 50 + (GameState.rebelProgress / 100) * 650;
        ctx.fillStyle = 'rgba(170, 51, 51, 0.3)';
        ctx.fillRect(0, 0, rebelX, this.canvas.height);

        // Update rebel bar
        document.getElementById('rebel-fill').style.width = `${GameState.rebelProgress}%`;

        // Create node elements
        const nodeContainer = document.getElementById('map-nodes');
        nodeContainer.innerHTML = '';

        this.nodes.forEach(node => {
            const el = document.createElement('div');
            el.className = 'map-node';
            el.style.left = `${node.x}px`;
            el.style.top = `${node.y}px`;

            // Determine node state
            if (node.id === GameState.currentNode?.id) {
                el.classList.add('current');
            } else if (GameState.visitedNodes.includes(node.id)) {
                el.classList.add('visited');
            } else if (this.isNodeReachable(node)) {
                el.classList.add('available');
                el.classList.add(node.type);
                el.addEventListener('click', () => this.travelToNode(node));
            } else {
                el.classList.add(node.type);
                el.style.opacity = '0.5';
            }

            // Check if rebel-controlled
            if (node.x < rebelX && !GameState.visitedNodes.includes(node.id)) {
                el.classList.add('rebel-controlled');
            }

            nodeContainer.appendChild(el);
        });

        document.getElementById('map-sector-num').textContent = GameState.currentSector;
    },

    isNodeReachable(node) {
        return this.connections.some(c =>
            c.from === GameState.currentNode?.id && c.to === node.id
        );
    },

    travelToNode(node) {
        if (GameState.fuel < 1) {
            UI.showEvent({
                text: 'Nicht genug Treibstoff zum Reisen!',
                choices: [{ text: 'OK', action: 'continue' }]
            });
            return;
        }

        GameState.fuel--;
        GameState.currentNode = node;
        GameState.visitedNodes.push(node.id);
        GameState.rebelProgress += 8 + Math.random() * 5;

        UI.showScreen('game');
        UI.updateResources();

        // Trigger event based on node type
        Game.triggerNodeEvent(node.type);

        // Check if exit node
        if (node.type === 'exit') {
            if (GameState.currentSector >= GameState.totalSectors) {
                // Final battle
                Game.startFinalBattle();
            } else {
                GameState.currentSector++;
                GameState.rebelProgress = Math.max(0, GameState.rebelProgress - 20);
                SectorMap.generate();
                UI.updateResources();
                UI.showEvent({
                    text: `Du erreichst Sektor ${GameState.currentSector}. Die Reise geht weiter...`,
                    choices: [{ text: 'Weiter', action: 'continue' }]
                });
            }
        }
    }
};

// ============================================================================
// GAME CONTROLLER
// ============================================================================

const Game = {
    init() {
        UI.init();
        SectorMap.init();

        // Check for saved game
        if (localStorage.getItem('ftl_save')) {
            document.getElementById('continue-btn').disabled = false;
        }

        // Select first ship by default
        document.querySelector('.ship-option').classList.add('selected');
    },

    startNewGame() {
        // Reset state
        const config = ShipConfigs[GameState.selectedShip];

        GameState.hull = config.hull;
        GameState.maxHull = config.hull;
        GameState.scrap = 0;
        GameState.fuel = 16;
        GameState.missiles = 8;
        GameState.droneParts = 2;
        GameState.currentSector = 1;
        GameState.rebelProgress = 0;
        GameState.shipsDestroyed = 0;
        GameState.totalScrap = 0;
        GameState.inCombat = false;
        GameState.paused = false;
        GameState.autofire = false;

        // Setup systems
        GameState.systems = JSON.parse(JSON.stringify(ShipConfigs.kestrel.systems));
        Object.entries(config.systems).forEach(([name, sys]) => {
            if (GameState.systems[name]) {
                GameState.systems[name].level = sys.level;
                GameState.systems[name].power = sys.power || 0;
            }
        });

        // Calculate initial power used
        GameState.powerUsed = 0;
        Object.values(GameState.systems).forEach(sys => {
            if (sys.power) GameState.powerUsed += sys.power;
        });

        // Setup weapons
        GameState.weapons = config.weapons.map(w => ({
            ...w,
            powered: false,
            charge: 0
        }));

        // Power first weapon if possible
        if (GameState.weapons.length > 0) {
            const firstWeapon = GameState.weapons[0];
            if (GameState.powerUsed + firstWeapon.powerCost <= GameState.powerMax) {
                firstWeapon.powered = true;
                GameState.powerUsed += firstWeapon.powerCost;
            }
        }

        // Setup crew
        GameState.crew = config.crew.map(c => ({...c}));

        // Generate sector map
        SectorMap.generate();

        // Show game screen
        UI.showScreen('game');
        this.updateUI();

        // Show initial event
        UI.showEvent({
            text: `Die Föderation ist in Gefahr! Du musst die wichtigen Daten zum Hauptquartier bringen. Dein Schiff, die ${config.name}, ist bereit. Fliege durch 8 Sektoren und besiege das Flaggschiff der Rebellen!`,
            choices: [{ text: 'Für die Föderation!', action: 'continue' }]
        });

        // Start game loop
        this.startGameLoop();
    },

    startGameLoop() {
        if (GameState.gameLoop) cancelAnimationFrame(GameState.gameLoop);

        let lastTime = 0;
        const loop = (timestamp) => {
            if (!GameState.paused && GameState.screen === 'game') {
                const delta = (timestamp - lastTime) / 1000;
                lastTime = timestamp;

                this.update(delta);
            }
            GameState.gameLoop = requestAnimationFrame(loop);
        };

        GameState.gameLoop = requestAnimationFrame(loop);
    },

    update(delta) {
        if (!GameState.inCombat) return;

        // Update weapon charges
        GameState.weapons.forEach((weapon, index) => {
            if (weapon.powered && weapon.charge < weapon.chargeTime) {
                weapon.charge += delta;

                // Autofire
                if (GameState.autofire && weapon.charge >= weapon.chargeTime && GameState.targetRoom) {
                    this.fireWeapon(index);
                }
            }
        });

        // Update enemy weapons
        if (GameState.enemy) {
            GameState.enemy.weapons.forEach((weapon, index) => {
                if (weapon.charge < weapon.chargeTime) {
                    weapon.charge += delta;

                    if (weapon.charge >= weapon.chargeTime) {
                        this.enemyFire(weapon);
                        weapon.charge = 0;
                    }
                }
            });

            // Enemy shield recharge
            if (GameState.enemy.shields < GameState.enemy.maxShields) {
                GameState.enemy.shieldRecharge = (GameState.enemy.shieldRecharge || 0) + delta;
                if (GameState.enemy.shieldRecharge >= 3) {
                    GameState.enemy.shields++;
                    GameState.enemy.shieldRecharge = 0;
                }
            }
        }

        // Player shield recharge
        const maxShields = Math.floor(GameState.systems.shields.power / 2);
        if (GameState.shieldLayers < maxShields) {
            GameState.shieldRechargeTimer += delta;
            if (GameState.shieldRechargeTimer >= 2) {
                GameState.shieldLayers++;
                GameState.shieldRechargeTimer = 0;
            }
        }

        // Heal crew in medbay
        if (GameState.systems.medbay.power > 0) {
            GameState.crew.forEach(member => {
                if (member.room === 'medbay' && member.health < 100) {
                    member.health = Math.min(100, member.health + delta * 5 * GameState.systems.medbay.power);
                }
            });
        }

        this.updateUI();
    },

    updateUI() {
        UI.updateResources();
        UI.updatePowerBars();
        UI.updateShields();
        UI.updateShipRooms();
        UI.updateWeapons();
        UI.updateCrew();
        UI.updateEnemy();
        UI.updateCombatArea();
    },

    togglePause() {
        GameState.paused = !GameState.paused;
        document.getElementById('pause-overlay').classList.toggle('hidden', !GameState.paused);
    },

    toggleAutofire() {
        GameState.autofire = !GameState.autofire;
        document.getElementById('autofire-btn').textContent = `Autofeuer: ${GameState.autofire ? 'AN' : 'AUS'}`;
        document.getElementById('autofire-btn').classList.toggle('active', GameState.autofire);
    },

    adjustPower(system, action) {
        const sys = GameState.systems[system];
        if (!sys || sys.power === undefined) return;

        if (action === 'increase') {
            const maxUsable = sys.level - sys.damaged;
            if (sys.power < maxUsable && GameState.powerUsed < GameState.powerMax) {
                sys.power++;
                GameState.powerUsed++;
            }
        } else if (action === 'decrease') {
            if (sys.power > 0) {
                sys.power--;
                GameState.powerUsed--;
            }
        }

        this.updateUI();
    },

    selectWeapon(index) {
        if (GameState.selectedWeapon === index) {
            // Toggle weapon power
            const weapon = GameState.weapons[index];
            if (weapon.powered) {
                weapon.powered = false;
                GameState.powerUsed -= weapon.powerCost;
                weapon.charge = 0;
            } else {
                if (GameState.powerUsed + weapon.powerCost <= GameState.powerMax) {
                    weapon.powered = true;
                    GameState.powerUsed += weapon.powerCost;
                }
            }
            GameState.selectedWeapon = null;
        } else {
            GameState.selectedWeapon = index;
        }
        this.updateUI();
    },

    setTarget(room) {
        GameState.targetRoom = room;

        // If weapon is ready, fire immediately (unless autofire is on)
        if (GameState.selectedWeapon !== null && !GameState.autofire) {
            const weapon = GameState.weapons[GameState.selectedWeapon];
            if (weapon && weapon.charge >= weapon.chargeTime) {
                this.fireWeapon(GameState.selectedWeapon);
            }
        }

        this.updateUI();
    },

    fireWeapon(weaponIndex) {
        const weapon = GameState.weapons[weaponIndex];
        if (!weapon || !weapon.powered || weapon.charge < weapon.chargeTime) return;
        if (!GameState.targetRoom || !GameState.enemy) return;

        // Check missile ammo
        if (weapon.type === 'missile' && GameState.missiles < 1) {
            UI.addCombatLog('Keine Raketen mehr!', 'damage');
            return;
        }

        if (weapon.type === 'missile') {
            GameState.missiles--;
        }

        weapon.charge = 0;

        // Calculate hits
        const evasion = GameState.enemy.evasion || 0;
        const shots = weapon.shots || 1;
        let hits = 0;
        let shieldBlocked = 0;

        for (let i = 0; i < shots; i++) {
            // Missiles ignore shields and have lower evasion penalty
            const effectiveEvasion = weapon.type === 'missile' ? evasion * 0.5 : evasion;

            if (Math.random() * 100 > effectiveEvasion) {
                if (weapon.type !== 'missile' && GameState.enemy.shields > 0) {
                    GameState.enemy.shields--;
                    shieldBlocked++;
                } else {
                    hits++;
                }
            }
        }

        if (shieldBlocked > 0) {
            UI.addCombatLog(`${weapon.name}: ${shieldBlocked} Schuss von Schilden blockiert`, 'event');
        }

        if (hits > 0) {
            const damage = hits * weapon.damage;
            GameState.enemy.hull -= damage;
            UI.addCombatLog(`${weapon.name} trifft ${GameState.targetRoom}! ${damage} Schaden!`, 'damage');

            // Ion damage
            if (weapon.ionDamage) {
                UI.addCombatLog(`Ion-Schaden deaktiviert feindliches ${GameState.targetRoom}!`, 'event');
            }

            // Check if enemy destroyed
            if (GameState.enemy.hull <= 0) {
                this.enemyDestroyed();
            }
        } else if (hits === 0 && shieldBlocked === 0) {
            UI.addCombatLog(`${weapon.name} verfehlt!`, 'event');
        }

        this.updateUI();
    },

    enemyFire(weapon) {
        if (!GameState.inCombat) return;

        // Random target room
        const rooms = ['shields', 'weapons', 'engines', 'medbay', 'oxygen', 'pilot'];
        const targetRoom = rooms[Math.floor(Math.random() * rooms.length)];

        // Calculate evasion
        const baseEvasion = GameState.systems.engines.power * 5;
        const pilotBonus = GameState.crew.some(c => c.room === 'pilot') ? 10 : 0;
        const evasion = baseEvasion + pilotBonus;

        const shots = weapon.shots || 1;
        let hits = 0;
        let shieldBlocked = 0;

        for (let i = 0; i < shots; i++) {
            const effectiveEvasion = weapon.type === 'missile' ? evasion * 0.5 : evasion;

            if (Math.random() * 100 > effectiveEvasion) {
                if (weapon.type !== 'missile' && GameState.shieldLayers > 0) {
                    GameState.shieldLayers--;
                    shieldBlocked++;
                } else {
                    hits++;
                }
            }
        }

        if (shieldBlocked > 0) {
            UI.addCombatLog(`Feind: ${shieldBlocked} Schuss blockiert von Schilden`, 'event');
        }

        if (hits > 0) {
            const damage = hits * weapon.damage;
            GameState.hull -= damage;
            UI.addCombatLog(`Feind trifft ${targetRoom}! ${damage} Schaden!`, 'damage');

            // System damage
            if (GameState.systems[targetRoom] && Math.random() < 0.3) {
                GameState.systems[targetRoom].damaged = Math.min(
                    GameState.systems[targetRoom].damaged + 1,
                    GameState.systems[targetRoom].level
                );
                UI.addCombatLog(`${targetRoom} beschädigt!`, 'damage');
            }

            // Crew damage
            const crewInRoom = GameState.crew.filter(c => c.room === targetRoom);
            crewInRoom.forEach(member => {
                member.health -= 15 + Math.random() * 10;
                if (member.health <= 0) {
                    UI.addCombatLog(`${member.name} ist gestorben!`, 'damage');
                }
            });
            GameState.crew = GameState.crew.filter(c => c.health > 0);

            // Check game over
            if (GameState.hull <= 0) {
                this.gameOver();
            }
        } else {
            UI.addCombatLog(`Feindlicher ${weapon.name} verfehlt!`, 'event');
        }

        this.updateUI();
    },

    enemyDestroyed() {
        GameState.inCombat = false;
        GameState.shipsDestroyed++;

        // Calculate rewards
        const reward = GameState.enemy.reward;
        const scrap = Math.floor(Math.random() * (reward.scrap[1] - reward.scrap[0] + 1)) + reward.scrap[0];
        const fuel = Math.floor(Math.random() * (reward.fuel[1] - reward.fuel[0] + 1)) + reward.fuel[0];
        const missiles = Math.floor(Math.random() * (reward.missiles[1] - reward.missiles[0] + 1)) + reward.missiles[0];

        GameState.scrap += scrap;
        GameState.totalScrap += scrap;
        GameState.fuel += fuel;
        GameState.missiles += missiles;

        UI.addCombatLog('Feind zerstört!', 'heal');

        // Check if flagship (victory)
        if (GameState.enemy.name === 'Rebellenflaggschiff') {
            UI.showVictory();
            return;
        }

        UI.showEvent({
            text: `Der Feind wurde zerstört! Du erhältst ${scrap} Scrap, ${fuel} Treibstoff und ${missiles} Raketen.`,
            choices: [{ text: 'Weiter', action: 'continue' }]
        });

        GameState.enemy = null;
        this.updateUI();
    },

    startCombat(enemyType) {
        const enemyTemplate = EnemyTypes[enemyType];
        GameState.enemy = {
            ...JSON.parse(JSON.stringify(enemyTemplate)),
            weapons: enemyTemplate.weapons.map(w => ({...w, charge: Math.random() * 5}))
        };

        GameState.inCombat = true;
        GameState.targetRoom = null;

        // Reset weapon charges
        GameState.weapons.forEach(w => w.charge = 0);

        UI.clearCombatLog();
        UI.addCombatLog(`${GameState.enemy.name} greift an!`, 'event');

        this.updateUI();
    },

    startFinalBattle() {
        UI.showEvent({
            text: 'Das Flaggschiff der Rebellen! Dies ist der finale Kampf um die Zukunft der Föderation!',
            choices: [
                { text: 'Für die Föderation!', action: 'combat', enemy: 'flagship' }
            ]
        });
    },

    selectCrew(index) {
        if (GameState.selectedCrew === index) {
            GameState.selectedCrew = null;
        } else {
            GameState.selectedCrew = index;
        }
        this.updateUI();
    },

    moveCrewToRoom(crewIndex, room) {
        if (GameState.crew[crewIndex]) {
            GameState.crew[crewIndex].room = room;
            GameState.selectedCrew = null;
            this.updateUI();
        }
    },

    openSectorMap() {
        if (GameState.inCombat) {
            UI.showEvent({
                text: 'Du kannst während eines Kampfes nicht springen!',
                choices: [{ text: 'OK', action: 'continue' }]
            });
            return;
        }

        SectorMap.render();
        UI.showScreen('sectorMap');
    },

    triggerNodeEvent(nodeType) {
        let eventPool;

        switch (nodeType) {
            case 'hostile':
            case 'danger':
                eventPool = Events.hostile;
                break;
            case 'store':
                eventPool = Events.store;
                break;
            case 'distress':
                eventPool = Events.distress;
                break;
            case 'nebula':
                eventPool = Events.nebula;
                break;
            default:
                eventPool = Events.empty;
        }

        const event = eventPool[Math.floor(Math.random() * eventPool.length)];
        UI.showEvent(event);
    },

    handleEventChoice(choice) {
        // Handle costs
        if (choice.cost) {
            Object.entries(choice.cost).forEach(([resource, amount]) => {
                GameState[resource] -= amount;
            });
        }

        // Handle rewards
        if (choice.reward) {
            Object.entries(choice.reward).forEach(([resource, value]) => {
                if (Array.isArray(value)) {
                    const amount = Math.floor(Math.random() * (value[1] - value[0] + 1)) + value[0];
                    GameState[resource] += amount;
                    if (resource === 'scrap') GameState.totalScrap += amount;
                } else {
                    GameState[resource] += value;
                    if (resource === 'scrap') GameState.totalScrap += value;
                }
            });
        }

        // Handle action
        switch (choice.action) {
            case 'continue':
                UI.showEvent({
                    text: 'Du wartest auf deinen nächsten Sprung.',
                    choices: [{ text: 'Sektorkarte öffnen', action: 'map' }]
                });
                break;

            case 'map':
                this.openSectorMap();
                break;

            case 'combat':
                let enemyType = choice.enemy;
                if (enemyType === 'random') {
                    const types = ['scout', 'fighter', 'bomber'];
                    if (GameState.currentSector > 4) types.push('elite');
                    enemyType = types[Math.floor(Math.random() * types.length)];
                }
                this.startCombat(enemyType);
                break;

            case 'flee':
                UI.showEvent({
                    text: 'Du entkommst knapp! Das war gefährlich...',
                    choices: [{ text: 'Puh!', action: 'continue' }]
                });
                break;

            case 'store':
                this.openStore();
                break;

            case 'trade':
                UI.showEvent({
                    text: 'Der Handel war erfolgreich!',
                    choices: [{ text: 'Weiter', action: 'continue' }]
                });
                break;

            case 'risk':
                if (Math.random() > 0.4) {
                    const scrap = Math.floor(Math.random() * (choice.success.scrap[1] - choice.success.scrap[0] + 1)) + choice.success.scrap[0];
                    GameState.scrap += scrap;
                    GameState.totalScrap += scrap;
                    UI.showEvent({
                        text: `Der Abbau war erfolgreich! Du erhältst ${scrap} Scrap.`,
                        choices: [{ text: 'Ausgezeichnet!', action: 'continue' }]
                    });
                } else {
                    GameState.hull += choice.fail.hull;
                    UI.showEvent({
                        text: `Ein Asteroid trifft dein Schiff! ${Math.abs(choice.fail.hull)} Schaden erlitten.`,
                        choices: [{ text: 'Autsch!', action: 'continue' }]
                    });
                }
                break;

            case 'crew_add':
                const races = ['human', 'engi', 'mantis', 'rockman', 'zoltan', 'slug'];
                const race = choice.crewRace === 'random' ? races[Math.floor(Math.random() * races.length)] : choice.crewRace;
                const names = ['Alex', 'Max', 'Sam', 'Jordan', 'Casey', 'Riley', 'Taylor', 'Morgan'];
                const name = names[Math.floor(Math.random() * names.length)];

                GameState.crew.push({
                    name,
                    race,
                    health: 100,
                    room: 'medbay',
                    skills: { pilot: 0, engines: 0, shields: 0, weapons: 0, repair: 0, combat: 0 }
                });

                UI.showEvent({
                    text: `${name} (${race}) schließt sich deiner Crew an!`,
                    choices: [{ text: 'Willkommen an Bord!', action: 'continue' }]
                });
                break;

            case 'search':
                const searchScrap = Math.floor(Math.random() * (choice.reward.scrap[1] - choice.reward.scrap[0] + 1)) + choice.reward.scrap[0];
                GameState.scrap += searchScrap;
                GameState.totalScrap += searchScrap;
                UI.showEvent({
                    text: `Du findest ${searchScrap} Scrap in den Trümmern.`,
                    choices: [{ text: 'Weiter', action: 'continue' }]
                });
                break;
        }

        this.updateUI();
    },

    openStore() {
        UI.showScreen('store');
        this.updateUI();
    },

    repairHull(amount) {
        const cost = amount * 2;
        const actualRepair = Math.min(amount, GameState.maxHull - GameState.hull);
        const actualCost = actualRepair * 2;

        if (GameState.scrap >= actualCost && actualRepair > 0) {
            GameState.scrap -= actualCost;
            GameState.hull += actualRepair;
            this.updateUI();
        }
    },

    buyResource(type) {
        const prices = { fuel: 3, missiles: 6, drones: 8 };
        const cost = prices[type];

        if (GameState.scrap >= cost) {
            GameState.scrap -= cost;
            if (type === 'fuel') GameState.fuel += 5;
            else if (type === 'missiles') GameState.missiles += 2;
            else if (type === 'drones') GameState.droneParts += 1;
            this.updateUI();
        }
    },

    gameOver() {
        cancelAnimationFrame(GameState.gameLoop);
        GameState.inCombat = false;
        localStorage.removeItem('ftl_save');
        UI.showGameOver();
    },

    saveGame() {
        const saveData = {
            ...GameState,
            sectorMap: {
                nodes: SectorMap.nodes,
                connections: SectorMap.connections
            }
        };
        localStorage.setItem('ftl_save', JSON.stringify(saveData));
    },

    loadGame() {
        const saveData = JSON.parse(localStorage.getItem('ftl_save'));
        if (saveData) {
            Object.assign(GameState, saveData);
            SectorMap.nodes = saveData.sectorMap.nodes;
            SectorMap.connections = saveData.sectorMap.connections;

            UI.showScreen('game');
            this.startGameLoop();
            this.updateUI();

            UI.showEvent({
                text: 'Spielstand geladen. Deine Mission geht weiter!',
                choices: [{ text: 'Weiter', action: 'continue' }]
            });
        }
    }
};

// ============================================================================
// INITIALIZE
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    Game.init();
});
