// Weltkarte mit Städteverbindungen
class WorldMap {
    constructor() {
        this.canvas = document.getElementById('worldMap');
        this.ctx = this.canvas.getContext('2d');

        // Canvas Größe
        this.width = 1200;
        this.height = 600;
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        // Wichtige Städte mit Koordinaten (Latitude, Longitude)
        this.cities = {
            'Berlin': { lat: 52.520008, lon: 13.404954, name: 'Berlin' },
            'London': { lat: 51.507351, lon: -0.127758, name: 'London' },
            'Paris': { lat: 48.856614, lon: 2.352222, name: 'Paris' },
            'New York': { lat: 40.712776, lon: -74.005974, name: 'New York' },
            'Tokyo': { lat: 35.689487, lon: 139.691711, name: 'Tokyo' },
            'Sydney': { lat: -33.868820, lon: 151.209296, name: 'Sydney' },
            'Dubai': { lat: 25.204849, lon: 55.270783, name: 'Dubai' },
            'Singapur': { lat: 1.352083, lon: 103.819839, name: 'Singapur' },
            'Moskau': { lat: 55.755825, lon: 37.617298, name: 'Moskau' },
            'Peking': { lat: 39.904202, lon: 116.407394, name: 'Peking' },
            'Mumbai': { lat: 19.075983, lon: 72.877655, name: 'Mumbai' },
            'São Paulo': { lat: -23.550520, lon: -46.633308, name: 'São Paulo' },
            'Kairo': { lat: 30.044420, lon: 31.235712, name: 'Kairo' },
            'Los Angeles': { lat: 34.052235, lon: -118.243683, name: 'Los Angeles' },
            'Toronto': { lat: 43.651070, lon: -79.347015, name: 'Toronto' },
            'Rom': { lat: 41.902782, lon: 12.496366, name: 'Rom' },
            'Madrid': { lat: 40.416775, lon: -3.703790, name: 'Madrid' },
            'Bangkok': { lat: 13.756331, lon: 100.501762, name: 'Bangkok' },
            'Istanbul': { lat: 41.008240, lon: 28.978359, name: 'Istanbul' },
            'Seoul': { lat: 37.566536, lon: 126.977966, name: 'Seoul' },
            'Mexico City': { lat: 19.432608, lon: -99.133209, name: 'Mexico City' },
            'Jakarta': { lat: -6.208763, lon: 106.845599, name: 'Jakarta' },
            'Lagos': { lat: 6.524379, lon: 3.379206, name: 'Lagos' },
            'Buenos Aires': { lat: -34.603722, lon: -58.381592, name: 'Buenos Aires' },
            'Kapstadt': { lat: -33.924870, lon: 18.424055, name: 'Kapstadt' },
            'Melbourne': { lat: -37.813629, lon: 144.963058, name: 'Melbourne' },
            'Shanghai': { lat: 31.230391, lon: 121.473701, name: 'Shanghai' },
            'Hongkong': { lat: 22.319304, lon: 114.169361, name: 'Hongkong' },
            'Amsterdam': { lat: 52.370216, lon: 4.895168, name: 'Amsterdam' },
            'Zürich': { lat: 47.376888, lon: 8.541694, name: 'Zürich' }
        };

        this.activeConnections = [];
        this.animationId = null;

        this.init();
    }

    // Lat/Lon zu Canvas-Koordinaten konvertieren
    latLonToXY(lat, lon) {
        // Equirectangular Projektion
        const x = (lon + 180) * (this.width / 360);
        const y = (90 - lat) * (this.height / 180);
        return { x, y };
    }

    // Zeichnet die Weltkarte
    drawMap() {
        // Hintergrund
        this.ctx.fillStyle = '#0f3460';
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Gitternetz
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.lineWidth = 0.5;

        // Breitengrade
        for (let lat = -90; lat <= 90; lat += 15) {
            this.ctx.beginPath();
            const y = (90 - lat) * (this.height / 180);
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.width, y);
            this.ctx.stroke();
        }

        // Längengrade
        for (let lon = -180; lon <= 180; lon += 15) {
            this.ctx.beginPath();
            const x = (lon + 180) * (this.width / 360);
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.height);
            this.ctx.stroke();
        }

        // Kontinente (vereinfacht)
        this.drawContinents();
    }

    // Vereinfachte Kontinente zeichnen
    drawContinents() {
        this.ctx.fillStyle = 'rgba(46, 213, 115, 0.3)';
        this.ctx.strokeStyle = 'rgba(46, 213, 115, 0.6)';
        this.ctx.lineWidth = 1;

        // Vereinfachte Kontinentalumrisse (als Beispiel)
        const continents = [
            // Europa
            {points: [[35, 10], [71, 10], [71, 40], [35, 40]]},
            // Nordamerika
            {points: [[15, -170], [72, -170], [72, -50], [15, -50]]},
            // Südamerika
            {points: [[-55, -80], [12, -80], [12, -35], [-55, -35]]},
            // Afrika
            {points: [[-35, -20], [37, -20], [37, 52], [-35, 52]]},
            // Asien
            {points: [[10, 40], [75, 40], [75, 150], [10, 150]]},
            // Australien
            {points: [[-45, 110], [-10, 110], [-10, 155], [-45, 155]]}
        ];

        continents.forEach(continent => {
            this.ctx.beginPath();
            continent.points.forEach((point, index) => {
                const coord = this.latLonToXY(point[0], point[1]);
                if (index === 0) {
                    this.ctx.moveTo(coord.x, coord.y);
                } else {
                    this.ctx.lineTo(coord.x, coord.y);
                }
            });
            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.stroke();
        });
    }

    // Städte zeichnen
    drawCities() {
        Object.values(this.cities).forEach(city => {
            const pos = this.latLonToXY(city.lat, city.lon);

            // Stadt-Marker
            this.ctx.fillStyle = '#f39c12';
            this.ctx.beginPath();
            this.ctx.arc(pos.x, pos.y, 4, 0, Math.PI * 2);
            this.ctx.fill();

            // Äußerer Ring
            this.ctx.strokeStyle = 'rgba(243, 156, 18, 0.5)';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.arc(pos.x, pos.y, 7, 0, Math.PI * 2);
            this.ctx.stroke();

            // Stadt-Name
            this.ctx.fillStyle = 'white';
            this.ctx.font = '10px Arial';
            this.ctx.fillText(city.name, pos.x + 10, pos.y - 5);
        });
    }

    // Berechne Kontrollpunkt für gebogene Linie
    getControlPoint(start, end) {
        const midX = (start.x + end.x) / 2;
        const midY = (start.y + end.y) / 2;

        // Berechne die Distanz
        const distance = Math.sqrt(
            Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)
        );

        // Biegung basierend auf Distanz (größere Distanz = stärkere Biegung)
        const curvature = distance * 0.3;

        // Kontrollpunkt oberhalb der Mittellinie
        return {
            x: midX,
            y: midY - curvature
        };
    }

    // Zeichnet eine animierte gebogene Linie zwischen zwei Städten
    drawAnimatedConnection(city1, city2, progress, color = '#e74c3c') {
        const pos1 = this.latLonToXY(city1.lat, city1.lon);
        const pos2 = this.latLonToXY(city2.lat, city2.lon);
        const control = this.getControlPoint(pos1, pos2);

        // Zeichne die gebogene Linie mit Quadratic Bezier Curve
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 3;
        this.ctx.shadowBlur = 15;
        this.ctx.shadowColor = color;

        // Zeichne die Linie bis zum aktuellen Progress
        this.ctx.beginPath();

        for (let t = 0; t <= progress; t += 0.01) {
            // Quadratic Bezier Curve Formel
            const x = Math.pow(1 - t, 2) * pos1.x +
                     2 * (1 - t) * t * control.x +
                     Math.pow(t, 2) * pos2.x;
            const y = Math.pow(1 - t, 2) * pos1.y +
                     2 * (1 - t) * t * control.y +
                     Math.pow(t, 2) * pos2.y;

            if (t === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        }

        this.ctx.stroke();

        // Animierter Punkt am Ende der Linie
        if (progress < 1) {
            const t = progress;
            const x = Math.pow(1 - t, 2) * pos1.x +
                     2 * (1 - t) * t * control.x +
                     Math.pow(t, 2) * pos2.x;
            const y = Math.pow(1 - t, 2) * pos1.y +
                     2 * (1 - t) * t * control.y +
                     Math.pow(t, 2) * pos2.y;

            this.ctx.fillStyle = color;
            this.ctx.beginPath();
            this.ctx.arc(x, y, 5, 0, Math.PI * 2);
            this.ctx.fill();
        }

        // Reset Shadow
        this.ctx.shadowBlur = 0;
    }

    // Erstellt eine neue Verbindung
    addConnection(city1Name, city2Name) {
        const city1 = this.cities[city1Name];
        const city2 = this.cities[city2Name];

        if (!city1 || !city2) return;

        const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c'];
        const color = colors[Math.floor(Math.random() * colors.length)];

        this.activeConnections.push({
            city1,
            city2,
            progress: 0,
            color,
            speed: 0.01 + Math.random() * 0.01
        });
    }

    // Zufällige Stadt auswählen (außer der angegebenen)
    getRandomCity(excludeCity = null) {
        const cityNames = Object.keys(this.cities).filter(name => name !== excludeCity);
        return cityNames[Math.floor(Math.random() * cityNames.length)];
    }

    // Berlin mit zufälliger Stadt verbinden
    connectBerlin() {
        const targetCity = this.getRandomCity('Berlin');
        this.addConnection('Berlin', targetCity);
    }

    // Zwei zufällige Städte verbinden
    connectRandom() {
        const city1 = this.getRandomCity();
        const city2 = this.getRandomCity(city1);
        this.addConnection(city1, city2);
    }

    // Alle Verbindungen löschen
    clearConnections() {
        this.activeConnections = [];
    }

    // Animation Loop
    animate() {
        // Karte und Städte neu zeichnen
        this.drawMap();
        this.drawCities();

        // Alle aktiven Verbindungen zeichnen und animieren
        this.activeConnections = this.activeConnections.filter(connection => {
            this.drawAnimatedConnection(
                connection.city1,
                connection.city2,
                connection.progress,
                connection.color
            );

            // Progress erhöhen
            connection.progress += connection.speed;

            // Verbindung behalten bis sie komplett ist (und etwas länger)
            return connection.progress < 1.2;
        });

        // Nächster Frame
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    // Initialisierung
    init() {
        this.drawMap();
        this.drawCities();
        this.animate();

        // Event Listener für Buttons
        document.getElementById('berlinBtn').addEventListener('click', () => {
            this.connectBerlin();
        });

        document.getElementById('randomBtn').addEventListener('click', () => {
            this.connectRandom();
        });

        document.getElementById('clearBtn').addEventListener('click', () => {
            this.clearConnections();
        });

        // Automatische zufällige Verbindungen alle 3 Sekunden
        setInterval(() => {
            if (Math.random() > 0.5 && this.activeConnections.length < 5) {
                this.connectRandom();
            }
        }, 3000);
    }
}

// App starten wenn die Seite geladen ist
window.addEventListener('DOMContentLoaded', () => {
    new WorldMap();
});
