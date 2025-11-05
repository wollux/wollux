// Weltkarte mit OpenStreetMap und Städteverbindungen
class WorldMap {
    constructor() {
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

        this.map = null;
        this.markers = {};
        this.activeConnections = [];
        this.connectionLayer = null;
        this.animationId = null;

        this.init();
    }

    // Initialisiert die Leaflet-Karte mit OpenStreetMap
    initMap() {
        // Leaflet-Karte erstellen
        this.map = L.map('worldMap', {
            center: [20, 0],
            zoom: 2,
            minZoom: 2,
            maxZoom: 6,
            worldCopyJump: true
        });

        // OpenStreetMap Tile Layer hinzufügen
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
        }).addTo(this.map);

        // Layer für Verbindungen
        this.connectionLayer = L.layerGroup().addTo(this.map);
    }

    // Städte-Marker hinzufügen
    addCityMarkers() {
        // Custom Icon für Städte
        const cityIcon = L.divIcon({
            className: 'city-marker',
            html: '<div style="background: #e74c3c; width: 12px; height: 12px; border-radius: 50%; border: 3px solid #fff; box-shadow: 0 0 10px rgba(231, 76, 60, 0.8);"></div>',
            iconSize: [18, 18],
            iconAnchor: [9, 9]
        });

        Object.entries(this.cities).forEach(([name, city]) => {
            const marker = L.marker([city.lat, city.lon], {
                icon: cityIcon,
                title: city.name
            }).addTo(this.map);

            // Popup mit Stadt-Namen
            marker.bindPopup(`<b>${city.name}</b>`, {
                closeButton: false,
                offset: [0, -5]
            });

            // Tooltip immer anzeigen
            marker.bindTooltip(city.name, {
                permanent: false,
                direction: 'top',
                className: 'city-tooltip'
            });

            this.markers[name] = marker;
        });
    }

    // Berechnet Zwischenpunkte für eine gebogene Linie
    calculateCurvePoints(start, end, numPoints = 100) {
        const points = [];

        // Berechne Distanz zwischen Punkten
        const latDiff = end[0] - start[0];
        const lonDiff = end[1] - start[1];
        const distance = Math.sqrt(latDiff * latDiff + lonDiff * lonDiff);

        // Stärke der Biegung basierend auf Distanz
        const curvature = distance * 0.3;

        // Richtung der Biegung (nach oben)
        const perpLat = -lonDiff / distance * curvature;
        const perpLon = latDiff / distance * curvature;

        for (let i = 0; i <= numPoints; i++) {
            const t = i / numPoints;

            // Quadratic Bezier Curve
            const midLat = (start[0] + end[0]) / 2 + perpLat;
            const midLon = (start[1] + end[1]) / 2 + perpLon;

            const lat = (1 - t) * (1 - t) * start[0] +
                       2 * (1 - t) * t * midLat +
                       t * t * end[0];
            const lon = (1 - t) * (1 - t) * start[1] +
                       2 * (1 - t) * t * midLon +
                       t * t * end[1];

            points.push([lat, lon]);
        }

        return points;
    }

    // Erstellt eine animierte Verbindung zwischen zwei Städten
    addConnection(city1Name, city2Name) {
        const city1 = this.cities[city1Name];
        const city2 = this.cities[city2Name];

        if (!city1 || !city2) return;

        const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#ff6b6b', '#4ecdc4'];
        const color = colors[Math.floor(Math.random() * colors.length)];

        // Berechne alle Punkte der gebogenen Linie
        const start = [city1.lat, city1.lon];
        const end = [city2.lat, city2.lon];
        const allPoints = this.calculateCurvePoints(start, end);

        const connection = {
            city1,
            city2,
            allPoints,
            currentIndex: 0,
            color,
            speed: 2, // Punkte pro Frame
            polyline: null,
            marker: null
        };

        // Erstelle die Polyline (zunächst leer)
        connection.polyline = L.polyline([], {
            color: color,
            weight: 3,
            opacity: 0.8,
            smoothFactor: 1
        }).addTo(this.connectionLayer);

        // Animierter Marker am Ende der Linie
        const movingIcon = L.divIcon({
            className: 'moving-marker',
            html: `<div style="background: ${color}; width: 10px; height: 10px; border-radius: 50%; box-shadow: 0 0 15px ${color};"></div>`,
            iconSize: [10, 10],
            iconAnchor: [5, 5]
        });

        connection.marker = L.marker([city1.lat, city1.lon], {
            icon: movingIcon
        }).addTo(this.connectionLayer);

        this.activeConnections.push(connection);
    }

    // Animiert alle aktiven Verbindungen
    animateConnections() {
        this.activeConnections = this.activeConnections.filter(connection => {
            // Erhöhe den Index
            connection.currentIndex += connection.speed;
            const index = Math.floor(connection.currentIndex);

            if (index < connection.allPoints.length) {
                // Aktualisiere die Polyline mit den Punkten bis zum aktuellen Index
                const visiblePoints = connection.allPoints.slice(0, index + 1);
                connection.polyline.setLatLngs(visiblePoints);

                // Bewege den Marker
                if (visiblePoints.length > 0) {
                    connection.marker.setLatLng(visiblePoints[visiblePoints.length - 1]);
                }

                return true; // Behalte die Verbindung
            } else {
                // Animation abgeschlossen, entferne den Marker nach kurzer Zeit
                setTimeout(() => {
                    if (connection.marker) {
                        this.connectionLayer.removeLayer(connection.marker);
                    }
                }, 1000);

                // Lasse die Linie noch für 3 Sekunden stehen, dann entfernen
                setTimeout(() => {
                    if (connection.polyline) {
                        this.connectionLayer.removeLayer(connection.polyline);
                    }
                }, 3000);

                return false; // Entferne aus aktiven Verbindungen
            }
        });

        // Weiter animieren
        this.animationId = requestAnimationFrame(() => this.animateConnections());
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
        this.activeConnections.forEach(connection => {
            if (connection.polyline) {
                this.connectionLayer.removeLayer(connection.polyline);
            }
            if (connection.marker) {
                this.connectionLayer.removeLayer(connection.marker);
            }
        });
        this.activeConnections = [];
        this.connectionLayer.clearLayers();

        // Marker wieder hinzufügen
        Object.values(this.markers).forEach(marker => {
            marker.addTo(this.map);
        });
    }

    // Initialisierung
    init() {
        // Warte bis Leaflet geladen ist
        if (typeof L === 'undefined') {
            setTimeout(() => this.init(), 100);
            return;
        }

        this.initMap();
        this.addCityMarkers();
        this.animateConnections();

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

        // Automatische zufällige Verbindungen alle 4 Sekunden
        setInterval(() => {
            if (Math.random() > 0.6 && this.activeConnections.length < 3) {
                this.connectRandom();
            }
        }, 4000);
    }
}

// App starten wenn die Seite geladen ist
window.addEventListener('DOMContentLoaded', () => {
    new WorldMap();
});
