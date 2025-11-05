// Bestellungs-Visualisierung mit OpenStreetMap
class OrderVisualization {
    constructor() {
        // Versandzentrum (Frankfurt)
        this.warehouse = {
            name: 'Frankfurt Versandzentrum',
            lat: 50.110924,
            lon: 8.682127
        };

        // Deutsche Städte (für 70% Inland-Bestellungen)
        this.germanCities = {
            'Berlin': { lat: 52.520008, lon: 13.404954, name: 'Berlin' },
            'Hamburg': { lat: 53.551086, lon: 9.993682, name: 'Hamburg' },
            'München': { lat: 48.135124, lon: 11.581981, name: 'München' },
            'Köln': { lat: 50.937531, lon: 6.960279, name: 'Köln' },
            'Stuttgart': { lat: 48.775845, lon: 9.182932, name: 'Stuttgart' },
            'Düsseldorf': { lat: 51.227741, lon: 6.773456, name: 'Düsseldorf' },
            'Dortmund': { lat: 51.513587, lon: 7.465298, name: 'Dortmund' },
            'Essen': { lat: 51.455643, lon: 7.011555, name: 'Essen' },
            'Leipzig': { lat: 51.339695, lon: 12.373075, name: 'Leipzig' },
            'Bremen': { lat: 53.079296, lon: 8.801694, name: 'Bremen' },
            'Dresden': { lat: 51.050407, lon: 13.737262, name: 'Dresden' },
            'Hannover': { lat: 52.375892, lon: 9.732010, name: 'Hannover' },
            'Nürnberg': { lat: 49.452030, lon: 11.076750, name: 'Nürnberg' },
            'Duisburg': { lat: 51.434471, lon: 6.762329, name: 'Duisburg' },
            'Bochum': { lat: 51.481845, lon: 7.216236, name: 'Bochum' },
            'Wuppertal': { lat: 51.264732, lon: 7.176759, name: 'Wuppertal' },
            'Bielefeld': { lat: 52.020736, lon: 8.535517, name: 'Bielefeld' },
            'Bonn': { lat: 50.733992, lon: 7.099814, name: 'Bonn' },
            'Münster': { lat: 51.960665, lon: 7.626135, name: 'Münster' },
            'Karlsruhe': { lat: 49.006890, lon: 8.403653, name: 'Karlsruhe' },
            'Mannheim': { lat: 49.487459, lon: 8.466039, name: 'Mannheim' },
            'Augsburg': { lat: 48.371582, lon: 10.898329, name: 'Augsburg' },
            'Wiesbaden': { lat: 50.082730, lon: 8.239761, name: 'Wiesbaden' },
            'Mönchengladbach': { lat: 51.194668, lon: 6.432293, name: 'Mönchengladbach' },
            'Gelsenkirchen': { lat: 51.517744, lon: 7.085713, name: 'Gelsenkirchen' },
            'Braunschweig': { lat: 52.269167, lon: 10.521683, name: 'Braunschweig' },
            'Kiel': { lat: 54.323293, lon: 10.122765, name: 'Kiel' },
            'Chemnitz': { lat: 50.827845, lon: 12.921811, name: 'Chemnitz' },
            'Aachen': { lat: 50.776351, lon: 6.083862, name: 'Aachen' },
            'Halle': { lat: 51.482845, lon: 11.970079, name: 'Halle' },
            'Magdeburg': { lat: 52.120533, lon: 11.627624, name: 'Magdeburg' },
            'Freiburg': { lat: 47.999073, lon: 7.842104, name: 'Freiburg' },
            'Krefeld': { lat: 51.338079, lon: 6.585249, name: 'Krefeld' },
            'Lübeck': { lat: 53.865467, lon: 10.686559, name: 'Lübeck' },
            'Oberhausen': { lat: 51.469873, lon: 6.851788, name: 'Oberhausen' },
            'Erfurt': { lat: 50.984768, lon: 11.029610, name: 'Erfurt' },
            'Mainz': { lat: 49.998866, lon: 8.273644, name: 'Mainz' },
            'Rostock': { lat: 54.092410, lon: 12.099147, name: 'Rostock' },
            'Kassel': { lat: 51.316792, lon: 9.497347, name: 'Kassel' },
            'Hagen': { lat: 51.360523, lon: 7.479287, name: 'Hagen' }
        };

        // Internationale Städte (für 30% International-Bestellungen)
        this.internationalCities = {
            'London': { lat: 51.507351, lon: -0.127758, name: 'London' },
            'Paris': { lat: 48.856614, lon: 2.352222, name: 'Paris' },
            'Amsterdam': { lat: 52.370216, lon: 4.895168, name: 'Amsterdam' },
            'Brüssel': { lat: 50.850340, lon: 4.351721, name: 'Brüssel' },
            'Wien': { lat: 48.208176, lon: 16.373819, name: 'Wien' },
            'Zürich': { lat: 47.376888, lon: 8.541694, name: 'Zürich' },
            'Rom': { lat: 41.902782, lon: 12.496366, name: 'Rom' },
            'Madrid': { lat: 40.416775, lon: -3.703790, name: 'Madrid' },
            'Barcelona': { lat: 41.385064, lon: 2.173404, name: 'Barcelona' },
            'Kopenhagen': { lat: 55.676098, lon: 12.568337, name: 'Kopenhagen' },
            'Stockholm': { lat: 59.329323, lon: 18.068581, name: 'Stockholm' },
            'Oslo': { lat: 59.913868, lon: 10.752245, name: 'Oslo' },
            'Warschau': { lat: 52.237049, lon: 21.017532, name: 'Warschau' },
            'Prag': { lat: 50.075538, lon: 14.437800, name: 'Prag' },
            'Budapest': { lat: 47.497912, lon: 19.040235, name: 'Budapest' },
            'Lissabon': { lat: 38.736946, lon: -9.142685, name: 'Lissabon' },
            'Athen': { lat: 37.983810, lon: 23.727539, name: 'Athen' },
            'Dublin': { lat: 53.349805, lon: -6.260310, name: 'Dublin' }
        };

        this.map = null;
        this.warehouseMarker = null;
        this.cityMarkers = {};
        this.orderData = {};
        this.currentDate = new Date('2024-01-01');
        this.connectionLayer = null;
        this.activeConnections = [];
        this.animationId = null;

        this.init();
    }

    // Initialisiert die Leaflet-Karte
    initMap() {
        this.map = L.map('worldMap', {
            center: [51.0, 10.0],
            zoom: 5,
            minZoom: 3,
            maxZoom: 8
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
        }).addTo(this.map);

        this.connectionLayer = L.layerGroup().addTo(this.map);
    }

    // Fügt Versandzentrum-Marker hinzu
    addWarehouseMarker() {
        const icon = L.divIcon({
            className: 'warehouse-marker-icon',
            html: '<div style="background: #3b82f6; width: 20px; height: 20px; border-radius: 50%; border: 4px solid #fff; box-shadow: 0 0 20px rgba(59, 130, 246, 1);"></div>',
            iconSize: [28, 28],
            iconAnchor: [14, 14]
        });

        this.warehouseMarker = L.marker([this.warehouse.lat, this.warehouse.lon], {
            icon: icon,
            title: this.warehouse.name
        }).addTo(this.map);

        this.warehouseMarker.bindPopup(`<b>${this.warehouse.name}</b><br>Zentrale Distribution`);
    }

    // Generiert Demo-Bestellungsdaten für 30 Tage
    generateOrderData() {
        const startDate = new Date('2024-01-01');

        for (let day = 0; day < 30; day++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + day);
            const dateStr = this.formatDate(date);

            // 20-40 Bestellungen pro Tag
            const orderCount = Math.floor(Math.random() * 21) + 20; // 20-40
            const orders = [];

            for (let i = 0; i < orderCount; i++) {
                // 70% Inland, 30% International
                const isDomestic = Math.random() < 0.7;

                let destination;
                if (isDomestic) {
                    const cities = Object.values(this.germanCities);
                    destination = cities[Math.floor(Math.random() * cities.length)];
                } else {
                    const cities = Object.values(this.internationalCities);
                    destination = cities[Math.floor(Math.random() * cities.length)];
                }

                orders.push({
                    id: `ORD-${dateStr}-${String(i + 1).padStart(3, '0')}`,
                    destination: destination,
                    isDomestic: isDomestic,
                    timestamp: new Date(date.getTime() + Math.random() * 86400000)
                });
            }

            this.orderData[dateStr] = orders;
        }
    }

    // Formatiert Datum als DD.MM.YYYY
    formatDate(date) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    }

    // Aktualisiert die Datumsanzeige
    updateDateDisplay() {
        document.getElementById('currentDate').textContent = this.formatDate(this.currentDate);
    }

    // Lädt Bestellungen für das aktuelle Datum
    loadOrdersForCurrentDate() {
        this.clearConnections();
        const dateStr = this.formatDate(this.currentDate);
        const orders = this.orderData[dateStr] || [];

        // Statistiken aktualisieren
        const domesticCount = orders.filter(o => o.isDomestic).length;
        const internationalCount = orders.filter(o => !o.isDomestic).length;

        document.getElementById('totalOrders').textContent = orders.length;
        document.getElementById('domesticOrders').textContent = domesticCount;
        document.getElementById('internationalOrders').textContent = internationalCount;

        return orders;
    }

    // Berechnet Punkte für gebogene Linie
    calculateCurvePoints(start, end, numPoints = 100) {
        const points = [];
        const latDiff = end[0] - start[0];
        const lonDiff = end[1] - start[1];
        const distance = Math.sqrt(latDiff * latDiff + lonDiff * lonDiff);

        // Stärke der Biegung
        const curvature = distance * 0.25;
        const perpLat = -lonDiff / distance * curvature;
        const perpLon = latDiff / distance * curvature;

        for (let i = 0; i <= numPoints; i++) {
            const t = i / numPoints;
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

    // Erstellt eine Bestellungs-Verbindung
    createOrderConnection(order, animate = true) {
        const start = [this.warehouse.lat, this.warehouse.lon];
        const end = [order.destination.lat, order.destination.lon];
        const color = order.isDomestic ? '#4ade80' : '#fb923c';
        const allPoints = this.calculateCurvePoints(start, end);

        if (animate) {
            const connection = {
                order,
                allPoints,
                currentIndex: 0,
                color,
                speed: 3,
                polyline: null,
                marker: null
            };

            connection.polyline = L.polyline([], {
                color: color,
                weight: 2,
                opacity: 0.7,
                smoothFactor: 1
            }).addTo(this.connectionLayer);

            const movingIcon = L.divIcon({
                className: 'moving-marker',
                html: `<div style="background: ${color}; width: 8px; height: 8px; border-radius: 50%; box-shadow: 0 0 10px ${color};"></div>`,
                iconSize: [8, 8],
                iconAnchor: [4, 4]
            });

            connection.marker = L.marker(start, {
                icon: movingIcon
            }).addTo(this.connectionLayer);

            this.activeConnections.push(connection);
        } else {
            // Zeige sofort die komplette Linie
            L.polyline(allPoints, {
                color: color,
                weight: 2,
                opacity: 0.5,
                smoothFactor: 1
            }).addTo(this.connectionLayer);

            // Ziel-Marker
            const destIcon = L.divIcon({
                className: 'dest-marker',
                html: `<div style="background: ${color}; width: 6px; height: 6px; border-radius: 50%;"></div>`,
                iconSize: [6, 6],
                iconAnchor: [3, 3]
            });

            L.marker(end, {
                icon: destIcon
            }).addTo(this.connectionLayer);
        }
    }

    // Animiert alle Verbindungen
    animateConnections() {
        this.activeConnections = this.activeConnections.filter(connection => {
            connection.currentIndex += connection.speed;
            const index = Math.floor(connection.currentIndex);

            if (index < connection.allPoints.length) {
                const visiblePoints = connection.allPoints.slice(0, index + 1);
                connection.polyline.setLatLngs(visiblePoints);

                if (visiblePoints.length > 0) {
                    connection.marker.setLatLng(visiblePoints[visiblePoints.length - 1]);
                }

                return true;
            } else {
                // Animation beendet
                if (connection.marker) {
                    setTimeout(() => {
                        this.connectionLayer.removeLayer(connection.marker);
                    }, 500);
                }
                return false;
            }
        });

        this.animationId = requestAnimationFrame(() => this.animateConnections());
    }

    // Animiert Bestellungen nacheinander
    animateOrders() {
        const orders = this.loadOrdersForCurrentDate();
        let index = 0;

        const animateNext = () => {
            if (index < orders.length) {
                this.createOrderConnection(orders[index], true);
                index++;
                setTimeout(animateNext, 150); // 150ms zwischen Bestellungen
            }
        };

        animateNext();
    }

    // Zeigt alle Bestellungen sofort
    showAllOrders() {
        const orders = this.loadOrdersForCurrentDate();
        orders.forEach(order => {
            this.createOrderConnection(order, false);
        });
    }

    // Löscht alle Verbindungen
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
    }

    // Tag zurück
    previousDay() {
        this.currentDate.setDate(this.currentDate.getDate() - 1);
        this.updateDateDisplay();
        this.loadOrdersForCurrentDate();
    }

    // Tag vor
    nextDay() {
        this.currentDate.setDate(this.currentDate.getDate() + 1);
        this.updateDateDisplay();
        this.loadOrdersForCurrentDate();
    }

    // Initialisierung
    init() {
        if (typeof L === 'undefined') {
            setTimeout(() => this.init(), 100);
            return;
        }

        this.initMap();
        this.addWarehouseMarker();
        this.generateOrderData();
        this.updateDateDisplay();
        this.loadOrdersForCurrentDate();
        this.animateConnections();

        // Event Listener
        document.getElementById('prevDayBtn').addEventListener('click', () => {
            this.previousDay();
        });

        document.getElementById('nextDayBtn').addEventListener('click', () => {
            this.nextDay();
        });

        document.getElementById('animateBtn').addEventListener('click', () => {
            this.clearConnections();
            this.animateOrders();
        });

        document.getElementById('showAllBtn').addEventListener('click', () => {
            this.clearConnections();
            this.showAllOrders();
        });

        document.getElementById('clearBtn').addEventListener('click', () => {
            this.clearConnections();
            this.loadOrdersForCurrentDate();
        });

        // Automatisch beim Start animieren
        setTimeout(() => {
            this.animateOrders();
        }, 500);
    }
}

// App starten
window.addEventListener('DOMContentLoaded', () => {
    new OrderVisualization();
});
