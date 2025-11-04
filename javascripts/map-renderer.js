// Map Renderer - Rendert die interaktive SVG-Karte
class MapRenderer {
    constructor(svgElement) {
        this.svg = svgElement;
        this.selectedState = null;
        this.onStateClick = null;
    }

    // Rendert alle Bundesländer auf der Karte
    renderMap(highlightStates = [], disabledStates = []) {
        this.svg.innerHTML = '';

        Object.entries(bundeslaenderData).forEach(([name, data]) => {
            const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            group.setAttribute('class', 'bundesland-group');
            group.setAttribute('data-name', name);

            // Pfad für das Bundesland
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', data.path);
            path.setAttribute('fill', data.color);
            path.setAttribute('stroke', '#ffffff');
            path.setAttribute('stroke-width', '2');
            path.setAttribute('class', 'bundesland-path');

            // Highlight-Klasse hinzufügen
            if (highlightStates.includes(name)) {
                path.classList.add('highlight');
            }

            // Disabled-Klasse hinzufügen
            if (disabledStates.includes(name)) {
                path.classList.add('disabled');
            } else {
                // Click-Handler nur für nicht-disabled States
                path.style.cursor = 'pointer';
                path.addEventListener('click', () => this.handleStateClick(name));
                path.addEventListener('mouseenter', () => this.handleStateHover(name, path));
                path.addEventListener('mouseleave', () => this.handleStateLeave(name, path));
            }

            group.appendChild(path);

            // Text-Label für den Namen
            const bbox = this.getPathBBox(data.path);
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', bbox.cx);
            text.setAttribute('y', bbox.cy);
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('class', 'bundesland-label');
            text.setAttribute('pointer-events', 'none');
            text.textContent = this.getShortName(name);

            group.appendChild(text);
            this.svg.appendChild(group);
        });
    }

    // Berechnet die Bounding Box eines SVG-Pfads
    getPathBBox(pathString) {
        const matches = pathString.match(/[\d.]+/g);
        if (!matches) return { cx: 0, cy: 0 };

        const coords = matches.map(Number);
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

        for (let i = 0; i < coords.length; i += 2) {
            minX = Math.min(minX, coords[i]);
            maxX = Math.max(maxX, coords[i]);
            if (i + 1 < coords.length) {
                minY = Math.min(minY, coords[i + 1]);
                maxY = Math.max(maxY, coords[i + 1]);
            }
        }

        return {
            cx: (minX + maxX) / 2,
            cy: (minY + maxY) / 2
        };
    }

    // Kürzt Namen für die Anzeige
    getShortName(name) {
        const shortNames = {
            'Baden-Württemberg': 'BW',
            'Bayern': 'BY',
            'Berlin': 'BE',
            'Brandenburg': 'BB',
            'Bremen': 'HB',
            'Hamburg': 'HH',
            'Hessen': 'HE',
            'Mecklenburg-Vorpommern': 'MV',
            'Niedersachsen': 'NI',
            'Nordrhein-Westfalen': 'NRW',
            'Rheinland-Pfalz': 'RP',
            'Saarland': 'SL',
            'Sachsen': 'SN',
            'Sachsen-Anhalt': 'ST',
            'Schleswig-Holstein': 'SH',
            'Thüringen': 'TH'
        };
        return shortNames[name] || name;
    }

    // Click-Handler
    handleStateClick(name) {
        if (this.onStateClick) {
            this.onStateClick(name);
        }
        this.highlightState(name);
    }

    // Hover-Handler
    handleStateHover(name, pathElement) {
        pathElement.style.filter = 'brightness(1.2)';
        pathElement.style.strokeWidth = '4';
        this.showTooltip(name);
    }

    // Leave-Handler
    handleStateLeave(name, pathElement) {
        if (this.selectedState !== name) {
            pathElement.style.filter = 'brightness(1)';
            pathElement.style.strokeWidth = '2';
        }
        this.hideTooltip();
    }

    // Highlight ein spezifisches Bundesland
    highlightState(name) {
        this.selectedState = name;
        const paths = this.svg.querySelectorAll('.bundesland-path');
        paths.forEach(path => {
            const group = path.closest('.bundesland-group');
            if (group.dataset.name === name) {
                path.classList.add('selected');
                path.style.strokeWidth = '4';
            } else {
                path.classList.remove('selected');
                path.style.strokeWidth = '2';
            }
        });
    }

    // Zeigt Feedback (richtig/falsch) für ein Bundesland
    showFeedback(name, isCorrect) {
        const group = this.svg.querySelector(`[data-name="${name}"]`);
        if (!group) return;

        const path = group.querySelector('path');
        if (isCorrect) {
            path.classList.add('correct');
            this.animateSuccess(path);
        } else {
            path.classList.add('wrong');
            this.animateError(path);
        }

        setTimeout(() => {
            path.classList.remove('correct', 'wrong');
        }, 2000);
    }

    // Animiert Erfolg
    animateSuccess(element) {
        element.style.transition = 'all 0.3s ease';
        element.style.transform = 'scale(1.1)';
        setTimeout(() => {
            element.style.transform = 'scale(1)';
        }, 300);
    }

    // Animiert Fehler
    animateError(element) {
        const originalTransform = element.style.transform;
        let shakeCount = 0;
        const shakeInterval = setInterval(() => {
            element.style.transform = shakeCount % 2 === 0 ? 'translateX(5px)' : 'translateX(-5px)';
            shakeCount++;
            if (shakeCount > 4) {
                clearInterval(shakeInterval);
                element.style.transform = originalTransform;
            }
        }, 100);
    }

    // Tooltip anzeigen
    showTooltip(name) {
        const data = bundeslaenderData[name];
        if (!data) return;

        let tooltip = document.getElementById('mapTooltip');
        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.id = 'mapTooltip';
            tooltip.className = 'map-tooltip';
            document.body.appendChild(tooltip);
        }

        tooltip.innerHTML = `
            <strong>${name}</strong><br>
            Hauptstadt: ${data.capital}<br>
            Einwohner: ${data.population}
        `;
        tooltip.style.display = 'block';
    }

    // Tooltip verstecken
    hideTooltip() {
        const tooltip = document.getElementById('mapTooltip');
        if (tooltip) {
            tooltip.style.display = 'none';
        }
    }

    // Setzt die Karte zurück
    reset() {
        this.selectedState = null;
        this.renderMap();
    }

    // Zeigt nur bestimmte Bundesländer an
    showOnly(stateNames) {
        const allStates = getAllBundeslaender();
        const disabled = allStates.filter(name => !stateNames.includes(name));
        this.renderMap([], disabled);
    }

    // Färbt mehrere Bundesländer ein
    colorStates(stateColors) {
        Object.entries(stateColors).forEach(([name, color]) => {
            const group = this.svg.querySelector(`[data-name="${name}"]`);
            if (group) {
                const path = group.querySelector('path');
                path.setAttribute('fill', color);
            }
        });
    }
}

// Tooltip-Positionierung mit Maus
document.addEventListener('mousemove', (e) => {
    const tooltip = document.getElementById('mapTooltip');
    if (tooltip && tooltip.style.display === 'block') {
        tooltip.style.left = (e.pageX + 15) + 'px';
        tooltip.style.top = (e.pageY + 15) + 'px';
    }
});
