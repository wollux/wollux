// Bundesländer-Daten mit SVG-Pfaden und Informationen
const bundeslaenderData = {
    'Baden-Württemberg': {
        name: 'Baden-Württemberg',
        capital: 'Stuttgart',
        population: '11,1 Millionen',
        area: '35.751 km²',
        founded: '1952',
        facts: [
            'Heimat von Mercedes-Benz und Porsche',
            'Zweitgrößter Flächenstaat Deutschlands',
            'Schwarzwald und Bodensee sind hier',
            'Stärkste Wirtschaftsregion in Deutschland'
        ],
        color: '#FF6B6B',
        path: 'M 250,950 L 200,900 L 180,850 L 200,800 L 250,750 L 280,720 L 320,720 L 350,750 L 380,800 L 400,850 L 420,900 L 400,950 L 350,1000 L 300,1020 L 250,1000 Z'
    },
    'Bayern': {
        name: 'Bayern',
        capital: 'München',
        population: '13,1 Millionen',
        area: '70.550 km²',
        founded: '1949',
        facts: [
            'Größtes Bundesland Deutschlands',
            'Oktoberfest in München',
            'Neuschwanstein-Schloss',
            'BMW und Audi haben hier ihren Sitz'
        ],
        color: '#4ECDC4',
        path: 'M 420,900 L 450,850 L 500,800 L 550,750 L 600,730 L 650,750 L 700,800 L 720,850 L 700,900 L 680,950 L 650,1000 L 600,1050 L 550,1080 L 500,1100 L 450,1080 L 420,1050 L 400,1000 L 400,950 Z'
    },
    'Berlin': {
        name: 'Berlin',
        capital: 'Berlin',
        population: '3,7 Millionen',
        area: '892 km²',
        founded: '1990',
        facts: [
            'Hauptstadt Deutschlands',
            'Brandenburger Tor',
            'Berliner Mauer fiel 1989',
            'Stadt- und Bundesland zugleich'
        ],
        color: '#FFE66D',
        path: 'M 650,280 L 670,270 L 690,280 L 700,300 L 690,320 L 670,330 L 650,320 L 640,300 Z'
    },
    'Brandenburg': {
        name: 'Brandenburg',
        capital: 'Potsdam',
        population: '2,5 Millionen',
        area: '29.654 km²',
        founded: '1990',
        facts: [
            'Umschließt Berlin komplett',
            'Spreewald UNESCO-Biosphärenreservat',
            'Potsdamer Schlösser und Gärten',
            'Viele Seen und Wälder'
        ],
        color: '#95E1D3',
        path: 'M 550,200 L 600,180 L 650,180 L 700,200 L 750,250 L 780,300 L 750,350 L 700,380 L 650,360 L 600,340 L 550,320 L 520,280 L 500,240 Z'
    },
    'Bremen': {
        name: 'Bremen',
        capital: 'Bremen',
        population: '0,68 Millionen',
        area: '419 km²',
        founded: '1949',
        facts: [
            'Kleinstes Bundesland',
            'Zwei Städte: Bremen und Bremerhaven',
            'Bremer Stadtmusikanten',
            'Wichtiger Hafen'
        ],
        color: '#F38181',
        path: 'M 280,250 L 295,240 L 310,250 L 315,270 L 305,285 L 290,290 L 275,280 L 270,265 Z'
    },
    'Hamburg': {
        name: 'Hamburg',
        capital: 'Hamburg',
        population: '1,85 Millionen',
        area: '755 km²',
        founded: '1949',
        facts: [
            'Zweitgrößte Stadt Deutschlands',
            'Größter Seehafen Deutschlands',
            'Elbphilharmonie',
            'Stadt- und Bundesland zugleich'
        ],
        color: '#AA96DA',
        path: 'M 350,200 L 370,190 L 390,200 L 400,220 L 390,240 L 370,250 L 350,240 L 340,220 Z'
    },
    'Hessen': {
        name: 'Hessen',
        capital: 'Wiesbaden',
        population: '6,3 Millionen',
        area: '21.115 km²',
        founded: '1949',
        facts: [
            'Frankfurt am Main - Finanzmetropole',
            'Größter Flughafen Deutschlands',
            'Europäische Zentralbank',
            'Apfelwein-Tradition'
        ],
        color: '#FCBAD3',
        path: 'M 300,500 L 320,450 L 350,420 L 380,450 L 400,500 L 420,550 L 400,600 L 370,630 L 340,620 L 310,600 L 280,550 Z'
    },
    'Mecklenburg-Vorpommern': {
        name: 'Mecklenburg-Vorpommern',
        capital: 'Schwerin',
        population: '1,6 Millionen',
        area: '23.295 km²',
        founded: '1990',
        facts: [
            'Ostseeküste mit Rügen und Usedom',
            'Mecklenburgische Seenplatte',
            'Dünn besiedelt',
            'Wichtiger Tourismusstandort'
        ],
        color: '#A8E6CF',
        path: 'M 450,80 L 520,60 L 600,60 L 680,80 L 750,120 L 780,160 L 750,180 L 680,180 L 600,160 L 520,140 L 450,120 Z'
    },
    'Niedersachsen': {
        name: 'Niedersachsen',
        capital: 'Hannover',
        population: '8,0 Millionen',
        area: '47.709 km²',
        founded: '1949',
        facts: [
            'Zweitgrößtes Bundesland',
            'Volkswagen-Stammwerk in Wolfsburg',
            'Nordseeküste und Harz',
            'Hannover Messe'
        ],
        color: '#FFD3B6',
        path: 'M 200,200 L 250,150 L 320,130 L 380,150 L 450,180 L 480,230 L 450,280 L 400,320 L 350,340 L 300,350 L 250,330 L 200,300 L 180,250 Z'
    },
    'Nordrhein-Westfalen': {
        name: 'Nordrhein-Westfalen',
        capital: 'Düsseldorf',
        population: '18,0 Millionen',
        area: '34.110 km²',
        founded: '1949',
        facts: [
            'Bevölkerungsreichstes Bundesland',
            'Ruhrgebiet - ehemalige Kohle-Region',
            'Kölner Dom',
            'Viele Großstädte: Köln, Düsseldorf, Dortmund'
        ],
        color: '#FFAAA5',
        path: 'M 150,400 L 180,350 L 220,320 L 270,320 L 310,350 L 330,400 L 320,450 L 280,500 L 240,520 L 200,510 L 160,480 L 140,440 Z'
    },
    'Rheinland-Pfalz': {
        name: 'Rheinland-Pfalz',
        capital: 'Mainz',
        population: '4,1 Millionen',
        area: '19.854 km²',
        founded: '1949',
        facts: [
            'Größtes Weinanbaugebiet Deutschlands',
            'Mosel und Rhein',
            'Mainz - Gutenberg-Stadt',
            'Mittelrheintal UNESCO-Welterbe'
        ],
        color: '#FF8B94',
        path: 'M 200,600 L 230,550 L 270,530 L 310,550 L 330,600 L 320,650 L 280,700 L 240,720 L 200,710 L 170,680 L 160,640 Z'
    },
    'Saarland': {
        name: 'Saarland',
        capital: 'Saarbrücken',
        population: '0,99 Millionen',
        area: '2.571 km²',
        founded: '1957',
        facts: [
            'Kleinstes Flächenland',
            'Grenze zu Frankreich',
            'Ehemalige Kohle- und Stahlindustrie',
            'Saarschleife'
        ],
        color: '#FFC6FF',
        path: 'M 150,700 L 170,680 L 200,680 L 220,700 L 220,730 L 200,750 L 170,750 L 150,730 Z'
    },
    'Sachsen': {
        name: 'Sachsen',
        capital: 'Dresden',
        population: '4,1 Millionen',
        area: '18.450 km²',
        founded: '1990',
        facts: [
            'Dresden - Elbflorenz',
            'Leipzig - Stadt der Musik',
            'Erzgebirge',
            'Zwinger und Semperoper'
        ],
        color: '#B4F8C8',
        path: 'M 600,400 L 650,380 L 700,400 L 750,450 L 750,500 L 720,550 L 680,580 L 640,580 L 600,550 L 580,500 L 580,450 Z'
    },
    'Sachsen-Anhalt': {
        name: 'Sachsen-Anhalt',
        capital: 'Magdeburg',
        population: '2,2 Millionen',
        area: '20.452 km²',
        founded: '1990',
        facts: [
            'Luther-Stadt Wittenberg',
            'Bauhaus Dessau',
            'Harz-Region',
            'Elbe und Saale'
        ],
        color: '#FBE7C6',
        path: 'M 480,320 L 530,300 L 580,320 L 620,370 L 620,420 L 590,470 L 550,490 L 510,490 L 470,460 L 450,410 L 450,360 Z'
    },
    'Schleswig-Holstein': {
        name: 'Schleswig-Holstein',
        capital: 'Kiel',
        population: '2,9 Millionen',
        area: '15.804 km²',
        founded: '1949',
        facts: [
            'Zwischen Nord- und Ostsee',
            'Nördlichstes Bundesland',
            'Nord-Ostsee-Kanal',
            'Wattenmeeer UNESCO-Weltnaturerbe'
        ],
        color: '#A0C4FF',
        path: 'M 300,50 L 350,30 L 420,30 L 470,50 L 480,100 L 450,140 L 400,150 L 350,140 L 310,120 L 280,90 Z'
    },
    'Thüringen': {
        name: 'Thüringen',
        capital: 'Erfurt',
        population: '2,1 Millionen',
        area: '16.202 km²',
        founded: '1990',
        facts: [
            'Grünes Herz Deutschlands',
            'Weimar - Stadt der Dichter',
            'Wartburg bei Eisenach',
            'Thüringer Wald'
        ],
        color: '#CAFFBF',
        path: 'M 400,500 L 450,480 L 500,500 L 530,550 L 520,600 L 480,630 L 440,630 L 400,600 L 380,550 Z'
    }
};

// Hauptstädte als separate Liste für Quiz
const capitals = {
    'Stuttgart': 'Baden-Württemberg',
    'München': 'Bayern',
    'Berlin': 'Berlin',
    'Potsdam': 'Brandenburg',
    'Bremen': 'Bremen',
    'Hamburg': 'Hamburg',
    'Wiesbaden': 'Hessen',
    'Schwerin': 'Mecklenburg-Vorpommern',
    'Hannover': 'Niedersachsen',
    'Düsseldorf': 'Nordrhein-Westfalen',
    'Mainz': 'Rheinland-Pfalz',
    'Saarbrücken': 'Saarland',
    'Dresden': 'Sachsen',
    'Magdeburg': 'Sachsen-Anhalt',
    'Kiel': 'Schleswig-Holstein',
    'Erfurt': 'Thüringen'
};

// Quiz-Fragen für Fakten-Challenge
const quizQuestions = [
    {
        question: 'Welches ist das größte Bundesland Deutschlands?',
        options: ['Bayern', 'Niedersachsen', 'Baden-Württemberg', 'Nordrhein-Westfalen'],
        correct: 'Bayern'
    },
    {
        question: 'Welches Bundesland hat die meisten Einwohner?',
        options: ['Bayern', 'Nordrhein-Westfalen', 'Baden-Württemberg', 'Niedersachsen'],
        correct: 'Nordrhein-Westfalen'
    },
    {
        question: 'In welchem Bundesland liegt der Schwarzwald?',
        options: ['Bayern', 'Baden-Württemberg', 'Hessen', 'Rheinland-Pfalz'],
        correct: 'Baden-Württemberg'
    },
    {
        question: 'Welches Bundesland ist ein Stadtstaat?',
        options: ['Bremen', 'Saarland', 'Brandenburg', 'Sachsen'],
        correct: 'Bremen'
    },
    {
        question: 'Wo befindet sich die Elbphilharmonie?',
        options: ['Bremen', 'Hamburg', 'Berlin', 'Dresden'],
        correct: 'Hamburg'
    },
    {
        question: 'Welches Bundesland wurde 1957 gegründet?',
        options: ['Saarland', 'Berlin', 'Brandenburg', 'Sachsen'],
        correct: 'Saarland'
    },
    {
        question: 'Wo findet das Oktoberfest statt?',
        options: ['Baden-Württemberg', 'Bayern', 'Hessen', 'Sachsen'],
        correct: 'Bayern'
    },
    {
        question: 'Welches Bundesland hat Küsten an Nord- und Ostsee?',
        options: ['Niedersachsen', 'Mecklenburg-Vorpommern', 'Schleswig-Holstein', 'Bremen'],
        correct: 'Schleswig-Holstein'
    },
    {
        question: 'In welchem Bundesland liegt Frankfurt am Main?',
        options: ['Hessen', 'Rheinland-Pfalz', 'Bayern', 'Baden-Württemberg'],
        correct: 'Hessen'
    },
    {
        question: 'Welches Bundesland umschließt Berlin?',
        options: ['Sachsen', 'Brandenburg', 'Sachsen-Anhalt', 'Mecklenburg-Vorpommern'],
        correct: 'Brandenburg'
    }
];

// Hilfsfunktionen
function getAllBundeslaender() {
    return Object.keys(bundeslaenderData);
}

function getBundeslandByCapital(capital) {
    return capitals[capital] || null;
}

function getRandomBundesland() {
    const names = getAllBundeslaender();
    return names[Math.floor(Math.random() * names.length)];
}

function getRandomCapital() {
    const capitalNames = Object.keys(capitals);
    return capitalNames[Math.floor(Math.random() * capitalNames.length)];
}

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}
