// players.js
// Default stat value - stats with this exact value were not from CSV
export const DEFAULT_STAT = 70.7070707;

// Helper to check if a stat is a default value
export const isDefaultStat = (value) => value === DEFAULT_STAT;

// Category formulas from spreadsheet:

// Shooting: (0.8 + offensiveConsistency/500) * 0.5*top1 + 0.35*avg(2nd,3rd) + 0.1*shotIQ + 0.05*freeThrow
export const computeShooting = (stats) => {
    const shots = [stats.shotClose, stats.shotMid, stats.shot3pt].sort((a, b) => b - a);
    const consistencyMult = 0.8 + stats.offensiveConsistency / 500;
    return Math.round(
        consistencyMult * 0.5 * shots[0] +
        0.35 * (shots[1] + shots[2]) / 2 +
        0.1 * stats.shotIQ +
        0.05 * stats.freeThrow
    );
};

// Inside Scoring: 0.65*top1 + 0.2*avg(2nd,3rd) + 0.05*avg(4th,5th,6th) + 0.05*hands + 0.05*drawFoul
export const computeInsideScoring = (stats) => {
    const moves = [
        stats.drivingLayup, stats.standingDunk, stats.drivingDunk,
        stats.postMoves, stats.postHook, stats.postFade
    ].sort((a, b) => b - a);
    return Math.round(
        0.65 * moves[0] +
        0.2 * (moves[1] + moves[2]) / 2 +
        0.05 * (moves[3] + moves[4] + moves[5]) / 3 +
        0.05 * stats.hands +
        0.05 * stats.drawFoul
    );
};

// Athleticism: 0.21*speed + 0.21*accel + 0.21*vertical + 0.21*strength + 0.08*stamina + 0.08*hustle
export const computeAthleticism = (stats) => {
    return Math.round(
        0.21 * stats.speed +
        0.21 * stats.acceleration +
        0.21 * stats.vertical +
        0.21 * stats.strength +
        0.08 * stats.stamina +
        0.08 * stats.hustle
    );
};

// Playmaking: 0.23*speedWithBall + 0.23*ballHandle + 0.23*passAccuracy + 0.23*passVision + 0.08*passIQ
export const computePlaymaking = (stats) => {
    return Math.round(
        0.23 * stats.speedWithBall +
        0.23 * stats.ballHandle +
        0.23 * stats.passingAccuracy +
        0.23 * stats.passingVision +
        0.08 * stats.passingIQ
    );
};

// Defense: (0.8 + defConsistency/500) * weighted formula
export const computeDefense = (stats) => {
    const consistencyMult = 0.8 + stats.defensiveConsistency / 500;
    return Math.round(
        consistencyMult * (
            0.37 * Math.max(stats.interiorDefense, stats.perimeterDefense) +
            0.15 * Math.min(stats.interiorDefense, stats.perimeterDefense) +
            0.1 * Math.max(stats.steal, stats.block) +
            0.08 * Math.min(stats.steal, stats.block) +
            0.1 * stats.helpDefenseIQ +
            0.1 * stats.lateralQuickness +
            0.1 * stats.passPerception
        )
    );
};

// Rebounding: average(offReb, defReb)
export const computeRebounding = (stats) => {
    return Math.round((stats.offensiveRebounding + stats.defensiveRebounding) / 2);
};

// Position Ratings - computed from aggregate stats + intangibles/potential
// Each position rating includes: base weighted stats + intangibles/100 + potential/200

// PG: 0.28*S + 0.09*IS + 0.12*A + 0.38*P + 0.08*D + 0.05*R + intangibles/100 + potential/200
export const computePGRating = (stats) => {
    const s = computeShooting(stats);
    const is = computeInsideScoring(stats);
    const a = computeAthleticism(stats);
    const p = computePlaymaking(stats);
    const d = computeDefense(stats);
    const r = computeRebounding(stats);
    const base = 0.28 * s + 0.09 * is + 0.12 * a + 0.38 * p + 0.08 * d + 0.05 * r;
    return Math.round((base + stats.intangibles / 100 + stats.potential / 200) * 10) / 10;
};

// SG: 0.35*S + 0.14*IS + 0.17*A + 0.17*P + 0.11*D + 0.06*R + intangibles/100 + potential/200
export const computeSGRating = (stats) => {
    const s = computeShooting(stats);
    const is = computeInsideScoring(stats);
    const a = computeAthleticism(stats);
    const p = computePlaymaking(stats);
    const d = computeDefense(stats);
    const r = computeRebounding(stats);
    const base = 0.35 * s + 0.14 * is + 0.17 * a + 0.17 * p + 0.11 * d + 0.06 * r;
    return Math.round((base + stats.intangibles / 100 + stats.potential / 200) * 10) / 10;
};

// SF: 0.21*S + 0.17*IS + 0.20*A + 0.12*P + 0.20*D + 0.10*R + intangibles/100 + potential/200
export const computeSFRating = (stats) => {
    const s = computeShooting(stats);
    const is = computeInsideScoring(stats);
    const a = computeAthleticism(stats);
    const p = computePlaymaking(stats);
    const d = computeDefense(stats);
    const r = computeRebounding(stats);
    const base = 0.21 * s + 0.17 * is + 0.20 * a + 0.12 * p + 0.20 * d + 0.10 * r;
    return Math.round((base + stats.intangibles / 100 + stats.potential / 200) * 10) / 10;
};

// PF: 0.11*S + 0.21*IS + 0.24*A + 0.05*P + 0.20*D + 0.19*R + intangibles/100 + potential/200
export const computePFRating = (stats) => {
    const s = computeShooting(stats);
    const is = computeInsideScoring(stats);
    const a = computeAthleticism(stats);
    const p = computePlaymaking(stats);
    const d = computeDefense(stats);
    const r = computeRebounding(stats);
    const base = 0.11 * s + 0.21 * is + 0.24 * a + 0.05 * p + 0.20 * d + 0.19 * r;
    return Math.round((base + stats.intangibles / 100 + stats.potential / 200) * 10) / 10;
};

// C: 0.03*S + 0.24*IS + 0.20*A + 0.03*P + 0.25*D + 0.25*R + intangibles/100 + potential/200
export const computeCRating = (stats) => {
    const s = computeShooting(stats);
    const is = computeInsideScoring(stats);
    const a = computeAthleticism(stats);
    const p = computePlaymaking(stats);
    const d = computeDefense(stats);
    const r = computeRebounding(stats);
    const base = 0.03 * s + 0.24 * is + 0.20 * a + 0.03 * p + 0.25 * d + 0.25 * r;
    return Math.round((base + stats.intangibles / 100 + stats.potential / 200) * 10) / 10;
};

// Overall rating: simply the max of all position ratings
export const computeOverallRating = (stats) => {
    return Math.round(Math.max(
        computePGRating(stats),
        computeSGRating(stats),
        computeSFRating(stats),
        computePFRating(stats),
        computeCRating(stats)
    ));
};

// Compute position string based on ratings (e.g., "PG/SG", "SF", "PF/C")
// Primary position is the max rating, co-positions are within 1 point of max
export const computePosition = (stats) => {
    const positions = [
        { pos: 'PG', rating: computePGRating(stats) },
        { pos: 'SG', rating: computeSGRating(stats) },
        { pos: 'SF', rating: computeSFRating(stats) },
        { pos: 'PF', rating: computePFRating(stats) },
        { pos: 'C', rating: computeCRating(stats) }
    ];

    // Sort by rating descending
    positions.sort((a, b) => b.rating - a.rating);
    const maxRating = positions[0].rating;

    // Get all positions within 1 point of max
    const validPositions = positions.filter(p => maxRating - p.rating <= 1);

    return validPositions.map(p => p.pos).join('/');
};

export const players = [

    {
        old_number: 8.5,
        number: 8,
        name: "Isaac Araki",
        team: "Unknown",
        position: "Big",
        height: "6'3\"",
        weight: "220lbs",
        age: 21,
        season: 3,
        image: "images/isaac.png", 
        description: "<b>A raw, floor-stretching big with boundless hustle</b>, still finding his footing and defensive identity.",
        icons: ["Spacer", "Ridiculous Upside"],
        shades_of: ["Karl-Anthony Towns", "Mo Bamba"],
        offense: 0.70,
        defense: 0.70,
        aggressive: 0.5,
        stats: {
            // Shooting
            shotClose: 70.7070707,
            shotMid: 70.7070707,
            shot3pt: 76,
            shotIQ: 70,
            freeThrow: 70.7070707,
            offensiveConsistency: 70.7070707,
            // Inside Scoring
            drivingLayup: 70.7070707,
            standingDunk: 15,
            drivingDunk: 15,
            drawFoul: 40,
            postMoves: 70.7070707,
            postHook: 70.7070707,
            postFade: 70.7070707,
            hands: 70.7070707,
            // Athleticism
            speed: 70.7070707,
            acceleration: 70.7070707,
            vertical: 70.7070707,
            strength: 70.7070707,
            stamina: 70.7070707,
            hustle: 70.7070707,
            // Playmaking
            speedWithBall: 70.7070707,
            ballHandle: 70.7070707,
            passingAccuracy: 70.7070707,
            passingVision: 70.7070707,
            passingIQ: 70.7070707,
            // Defense
            interiorDefense: 70.7070707,
            perimeterDefense: 70.7070707,
            helpDefenseIQ: 70.7070707,
            lateralQuickness: 70.7070707,
            passPerception: 70.7070707,
            steal: 70.7070707,
            block: 70.7070707,
            defensiveConsistency: 70.7070707,
            // Rebounding
            offensiveRebounding: 70.7070707,
            defensiveRebounding: 70.7070707,
            // Mental
            intangibles: 70.7070707,
            potential: 70.7070707
        }
    },
    {
        number: 1,
        name: "Paul Rosiak",
        team: "Golden State Warriors",
        position: "Forward",
        height: "6'0\"",
        weight: "175 lbs",
        age: 32,
        season: 3,
        image: "images/paul.png", 
        description: "<b>An on-ball menace with elite instincts</b>, paired with smooth offense that prizes efficiency over flair.",
        icons: ["Positional Versatility", "Finisher", "On-Ball Defense", "Injury Concerns"],
        shades_of: ["Dyson Daniels", "Trey Murphy"],
        offense: 0.83,
        defense: 0.87,
        aggressive: 0.5,
        stats: {
            // Shooting
            shotClose: 83.0,
            shotMid: 82.0,
            shot3pt: 80.0,
            shotIQ: 83.0,
            freeThrow: 84.0,
            offensiveConsistency: 84.0,
            // Inside Scoring
            drivingLayup: 88.0,
            standingDunk: 25.0,
            drivingDunk: 45.0,
            drawFoul: 72.0,
            postMoves: 75.0,
            postHook: 77.0,
            postFade: 82.0,
            hands: 85.0,
            // Athleticism
            speed: 87.0,
            acceleration: 84.0,
            vertical: 82.0,
            strength: 81.0,
            stamina: 92.0,
            hustle: 88.0,
            // Playmaking
            speedWithBall: 86.0,
            ballHandle: 83.0,
            passingAccuracy: 82.0,
            passingVision: 86.0,
            passingIQ: 85.0,
            // Defense
            interiorDefense: 85.0,
            perimeterDefense: 94.0,
            helpDefenseIQ: 80.0,
            lateralQuickness: 91.0,
            passPerception: 83.0,
            steal: 93.0,
            block: 80.0,
            defensiveConsistency: 91.0,
            // Rebounding
            offensiveRebounding: 62.0,
            defensiveRebounding: 70.0,
            // Mental
            intangibles: 90.0,
            potential: 70.0
        }
    },
    {
        number: 2.9,
        name: "Mingma Sherpa",
        team: "Los Angeles Lakers",
        position: "Forward",
        height: "5'9\"",
        weight: "180 lbs",
        age: 24,
        season: 4,
        image: "images/ming.png", 
        description: "<b>Elite rebounder</b> with a knack for bold, clever passes that keep defenses guessing -- and fellow teammates too.",
        icons: ["Rebounding", "Clutch Gene", "Passing Virtuoso", "Feel For the Game" ],
        shades_of: ["Josh Hart", "Scottie Barnes"],
        offense: 0.77,
        defense: 0.75,
        aggressive: 0.5,
        stats: {
            // Shooting
            shotClose: 74.0,
            shotMid: 77.0,
            shot3pt: 74.0,
            shotIQ: 83.0,
            freeThrow: 74.0,
            offensiveConsistency: 84.0,
            // Inside Scoring
            drivingLayup: 82.0,
            standingDunk: 15.0,
            drivingDunk: 15.0,
            drawFoul: 73.0,
            postMoves: 61.0,
            postHook: 64.0,
            postFade: 61.0,
            hands: 87.0,
            // Athleticism
            speed: 79.0,
            acceleration: 84.0,
            vertical: 72.0,
            strength: 81.0,
            stamina: 91.0,
            hustle: 93.0,
            // Playmaking
            speedWithBall: 82.0,
            ballHandle: 77.0,
            passingAccuracy: 82.0,
            passingVision: 89.0,
            passingIQ: 80.0,
            // Defense
            interiorDefense: 75.0,
            perimeterDefense: 73.0,
            helpDefenseIQ: 77.0,
            lateralQuickness: 73.0,
            passPerception: 80.0,
            steal: 86.0,
            block: 82.0,
            defensiveConsistency: 90.0,
            // Rebounding
            offensiveRebounding: 90.0,
            defensiveRebounding: 92.0,
            // Mental
            intangibles: 92.0,
            potential: 86.0
        },
        clips: [
            { title: "Three-ball on Skyler", url: "https://youtube.com/clip/UgkxXafIb3WPrKtk8CRgbhopqngn0h6Jmznb?si=kHateymgvNyM7n0J" }
        ]
    },
    {
        number: 2.99,
        name: "Lance Muchina",
        team: "Los Angeles Lakers",
        position: "Guard",
        height: "5'5\"",
        weight: "150 lbs",
        age: 24,
        season: 4,
        image: "images/lance.png", 
        description: "<b>Relentless on-ball defender</b> a consistent offense away from superstardom.",
        icons: ["On-Ball Defense", "Hustle", "Off-Ball Defense", "Got That Dog in Him"],
        shades_of: ["Dennis Schroeder", "Gary Payton II","Jose Alvarado", ],
        offense: 0.75,
        defense: 0.82,
        aggressive: 0.5,
        stats: {
            // Shooting
            shotClose: 73.0,
            shotMid: 77.0,
            shot3pt: 73.0,
            shotIQ: 80.0,
            freeThrow: 77.0,
            offensiveConsistency: 82.0,
            // Inside Scoring
            drivingLayup: 79.0,
            standingDunk: 10.0,
            drivingDunk: 10.0,
            drawFoul: 80.0,
            postMoves: 61.0,
            postHook: 64.0,
            postFade: 61.0,
            hands: 78.0,
            // Athleticism
            speed: 87.0,
            acceleration: 85.0,
            vertical: 71.0,
            strength: 70.0,
            stamina: 96.0,
            hustle: 95.0,
            // Playmaking
            speedWithBall: 83.0,
            ballHandle: 77.0,
            passingAccuracy: 78.0,
            passingVision: 73.0,
            passingIQ: 76.0,
            // Defense
            interiorDefense: 74.0,
            perimeterDefense: 87.0,
            helpDefenseIQ: 82.0,
            lateralQuickness: 84.0,
            passPerception: 84.0,
            steal: 92.0,
            block: 71.0,
            defensiveConsistency: 93.0,
            // Rebounding
            offensiveRebounding: 63.0,
            defensiveRebounding: 66.0,
            // Mental
            intangibles: 87.0,
            potential: 84.0
        }
    },
    {
        number: 2,
        name: "Gavin Pereira",
        team: "Golden State Warriors",
        position: "Guard",
        height: "6'2\"",
        weight: "175 lbs",
        age: 24,
        season: "4 (Retired)",
        image: "images/gavin.png", 
        description: "<b>Crafty playmaker</b> sporting a silky crossover, with a knack for defending the perimeter.",
        icons: ["Passing Virtuoso", "Ballhandling", "Shot Blocking", "Pull-Up Threat"],
        shades_of: ["Kevin Durant"],
        offense: 0.53,
        defense: 0.20,
        aggressive: 0.5,
        stats: {
            // Shooting
            shotClose: 75.0,
            shotMid: 80.0,
            shot3pt: 83.0,
            shotIQ: 81.0,
            freeThrow: 84.0,
            offensiveConsistency: 94.0,
            // Inside Scoring
            drivingLayup: 85.0,
            standingDunk: 15.0,
            drivingDunk: 20.0,
            drawFoul: 81.0,
            postMoves: 62.0,
            postHook: 70.0,
            postFade: 70.0,
            hands: 86.0,
            // Athleticism
            speed: 86.0,
            acceleration: 85.0,
            vertical: 69.0,
            strength: 67.0,
            stamina: 91.0,
            hustle: 91.0,
            // Playmaking
            speedWithBall: 70.7070707,
            ballHandle: 70.7070707,
            passingAccuracy: 70.7070707,
            passingVision: 70.7070707,
            passingIQ: 70.7070707,
            // Defense
            interiorDefense: 70.7070707,
            perimeterDefense: 70.7070707,
            helpDefenseIQ: 70.7070707,
            lateralQuickness: 70.7070707,
            passPerception: 71.0,
            steal: 82.0,
            block: 66.0,
            defensiveConsistency: 85.0,
            // Rebounding
            offensiveRebounding: 75.0,
            defensiveRebounding: 80.0,
            // Mental
            intangibles: 89.0,
            potential: 70.7070707
        }
    },
    {
        number: 3.0,
        name: "Declan Edgecombe",
        team: "Golden State Warriors",
        position: "Guard",
        height: "5'9\"",
        weight: "150 lbs",
        age: 25,
        season: 5,
        image: "images/declan.png", 
        description: "<b>High-energy point guard</b> who thrives on speed, constant movement, and creative shot-making.",
        icons: ["Lightning Rod", "Speed Demon", "Fast and Loose", "Floor General"],
        shades_of: ["Trae Young", "Tyus Jones"],
        offense: 0.79,
        defense: 0.77,
        aggressive: 0.5,
        stats: {
            // Shooting
            shotClose: 77.0,
            shotMid: 75.0,
            shot3pt: 79.0,
            shotIQ: 85.0,
            freeThrow: 83.0,
            offensiveConsistency: 92.0,
            // Inside Scoring
            drivingLayup: 81.0,
            standingDunk: 10.0,
            drivingDunk: 10.0,
            drawFoul: 85.0,
            postMoves: 60.0,
            postHook: 76.0,
            postFade: 50.0,
            hands: 86.0,
            // Athleticism
            speed: 91.0,
            acceleration: 91.0,
            vertical: 70.0,
            strength: 67.0,
            stamina: 99.0,
            hustle: 95.0,
            // Playmaking
            speedWithBall: 88.0,
            ballHandle: 76.0,
            passingAccuracy: 79.0,
            passingVision: 87.0,
            passingIQ: 84.0,
            // Defense
            interiorDefense: 73.0,
            perimeterDefense: 80.0,
            helpDefenseIQ: 83.0,
            lateralQuickness: 85.0,
            passPerception: 82.0,
            steal: 75.0,
            block: 60.0,
            defensiveConsistency: 94.0,
            // Rebounding
            offensiveRebounding: 68.0,
            defensiveRebounding: 78.0,
            // Mental
            intangibles: 92.0,
            potential: 72.0
        },
        clips: [
            { title: "Three", url: "https://youtube.com/clip/UgkxpJ6BWfNVfjXVfu6psoPj0TLOsWTdrqPG?si=BY5-r299-FafZAbo" }
        ]
    },

    {
        number: 8.4,
        name: "Byron Shirley",
        team: "LA Clippers",
        position: "Forward",
        height: "5'10\"",
        weight: "180 lbs",
        age: 40,
        season: 3,
        image: "images/byron.png", 
        description: "<b>Ageless hustle machine</b> defying father time with relentless effort, scrappy defense, and fearless dives.",
        icons: ["Hustle", "Ridiculous Upside", "Injury Concerns", "Sh*t Stirrer"],
        shades_of: ["Killian Hayes", "Udonis Haslem", "Rudy Gobert (offense)"],
        offense: 0.69,
        defense: 0.76,
        aggressive: 0.5,
        stats: {
            // Shooting
            shotClose: 66.0,
            shotMid: 72.0,
            shot3pt: 68.0,
            shotIQ: 70.0,
            freeThrow: 72.0,
            offensiveConsistency: 94.0,
            // Inside Scoring
            drivingLayup: 70.0,
            standingDunk: 15.0,
            drivingDunk: 15.0,
            drawFoul: 78.0,
            postMoves: 40.0,
            postHook: 55.0,
            postFade: 45.0,
            hands: 73.0,
            // Athleticism
            speed: 87.0,
            acceleration: 84.0,
            vertical: 60.0,
            strength: 77.0,
            stamina: 90.0,
            hustle: 99.0,
            // Playmaking
            speedWithBall: 86.0,
            ballHandle: 60.0,
            passingAccuracy: 68.0,
            passingVision: 66.0,
            passingIQ: 55,
            // Defense
            interiorDefense: 81.0,
            perimeterDefense: 81.0,
            helpDefenseIQ: 69.0,
            lateralQuickness: 79.0,
            passPerception: 73.0,
            steal: 67.0,
            block: 68.0,
            defensiveConsistency: 99.0,
            // Rebounding
            offensiveRebounding: 69.0,
            defensiveRebounding: 68.0,
            // Mental
            intangibles: 83.0,
            potential: 89.0
        }
    },

    {
        number: 0,
        old_number: 1.5, 
        name: "Elliot Rosenberg",
        team: "Los Angeles Lakers",
        position: "Forward",
        height: "5'11\"",
        weight: "190 lbs",
        age: 33,
        season: 3,
        image: "images/elliot.png",
        description: "<b>High-usage scorer</b> whose strength and deliberate pace enable a versatile scoring package.",
        icons: ["Pull-up Threat", "Off-Ball Defense", "Post Moves", "Got That Dog In Him"],
        shades_of: ["Julius Randle", "LeBron James",],
        offense: 0.70,
        defense: 0.70,
        aggressive: 0.5,
        stats: {
            // Shooting
            shotClose: 85,
            shotMid: 84,
            shot3pt: 84,
            shotIQ: 74,
            freeThrow: 86,
            offensiveConsistency: 88,
            // Inside Scoring
            drivingLayup: 70,
            standingDunk: 25,
            drivingDunk: 25,
            drawFoul: 70,
            postMoves: 50,
            postHook: 50,
            postFade: 50,
            hands: 70,
            // Athleticism
            speed: 70,
            acceleration: 70,
            vertical: 65,
            strength: 70,
            stamina: 75,
            hustle: 75,
            // Playmaking
            speedWithBall: 70,
            ballHandle: 70,
            passingAccuracy: 70,
            passingVision: 70,
            passingIQ: 70,
            // Defense
            interiorDefense: 70,
            perimeterDefense: 70,
            helpDefenseIQ: 70,
            lateralQuickness: 70,
            passPerception: 81,
            steal: 76,
            block: 82,
            defensiveConsistency: 85,
            // Rebounding
            offensiveRebounding: 65,
            defensiveRebounding: 70,
            // Mental
            intangibles: 94,
            potential: 70
        }
    },

    {
        number: 7.01,
        name: "Robby",
        team: "Los Angeles Lakers",
        position: "Big",
        height: "5'10\"",
        weight: "190 lbs",
        age: 31,
        season: 2,
        image: "images/robby.png", 
        description: "<b>An old-school center</b> whose strength and spacing make up for a lack of size.",
        icons: ["Spacer", "Shot Blocking"],
        shades_of: ["Chuck Hayes", "Kevon Looney"],
        offense: 0.74,
        defense: 0.76,
        aggressive: 0.5,
        stats: {
            // Shooting
            shotClose: 72.0,
            shotMid: 64.0,
            shot3pt: 70.0,
            shotIQ: 84.0,
            freeThrow: 80.0,
            offensiveConsistency: 90.0,
            // Inside Scoring
            drivingLayup: 80.0,
            standingDunk: 10.0,
            drivingDunk: 10.0,
            drawFoul: 83.0,
            postMoves: 68.0,
            postHook: 68.0,
            postFade: 63.0,
            hands: 87.0,
            // Athleticism
            speed: 76.0,
            acceleration: 84.0,
            vertical: 73.0,
            strength: 92.0,
            stamina: 78.0,
            hustle: 85.0,
            // Playmaking
            speedWithBall: 76.0,
            ballHandle: 68.0,
            passingAccuracy: 82.0,
            passingVision: 71.0,
            passingIQ: 83.0,
            // Defense
            interiorDefense: 84.0,
            perimeterDefense: 68.0,
            helpDefenseIQ: 80.0,
            lateralQuickness: 70.0,
            passPerception: 70.0,
            steal: 68.0,
            block: 82.0,
            defensiveConsistency: 92.0,
            // Rebounding
            offensiveRebounding: 74.0,
            defensiveRebounding: 84.0,
            // Mental
            intangibles: 79.0,
            potential: 86
        }
    },

    {
        number: 2.71,
        name: "Victor Hyunh",
        team: "Los Angeles Lakers",
        position: "Guard",
        height: "5'10\"",
        weight: "170 lbs",
        age: 28,
        season: 5,
        image: "images/victor.png", 
        description: "<b>Fierce competitor</b> who excels at creating his own shot off-the-dribble.",
        icons: ["Pull-up Threat", "Clutch Gene", "Float Game", "Got That Dog in Him"],
        shades_of: ["Tyler Herro", "Kobe Bryant", ],
        offense: 0.81,
        defense: 0.70,
        aggressive: 0.5,
        stats: {
            // Shooting
            shotClose: 83.0,
            shotMid: 83.0,
            shot3pt: 84.0,
            shotIQ: 85.0,
            freeThrow: 86.0,
            offensiveConsistency: 87.0,
            // Inside Scoring
            drivingLayup: 85.0,
            standingDunk: 15.0,
            drivingDunk: 20.0,
            drawFoul: 87.0,
            postMoves: 66.0,
            postHook: 68.0,
            postFade: 68.0,
            hands: 86.0,
            // Athleticism
            speed: 86.0,
            acceleration: 87.0,
            vertical: 71.0,
            strength: 70.0,
            stamina: 86.0,
            hustle: 84.0,
            // Playmaking
            speedWithBall: 84.0,
            ballHandle: 86.0,
            passingAccuracy: 82.0,
            passingVision: 75.0,
            passingIQ: 80.0,
            // Defense
            interiorDefense: 72.0,
            perimeterDefense: 69.0,
            helpDefenseIQ: 67.0,
            lateralQuickness: 70.0,
            passPerception: 72.0,
            steal: 80.0,
            block: 77.0,
            defensiveConsistency: 83.0,
            // Rebounding
            offensiveRebounding: 66.0,
            defensiveRebounding: 76.0,
            // Mental
            intangibles: 78.0,
            potential: 79.0
        },
        clips: [
            { title: "And-1", url: "https://youtube.com/clip/Ugkx6VimGhj3mVJmHvB4Jh348aWp_0QOAY1e?si=WHox66PMT5pthI5h" }
        ]
    },

    {
        number: 1.91,
        old_number: 1.6,
        name: "Tyler Baldwin",
        team: "San Antonio Spurs",
        position: "Forward",
        height: "5'10\"",
        weight: "185 lbs",
        age: 22,
        season: 3,
        image: "images/tyler.png",
        description: "<b>The prototypical modern power forward</b>, blending perimeter-stifling lateral quickness and strength with a dependable stroke from deep.",
        icons: ["On-Ball Defense", "Positional Versatility", "Spacer", "Hustle"],
        shades_of: ["OG Anunoby", "Kawhi Leonard", "Miles Bridges", "Aaron Gordon"],
        offense: 0.70,
        defense: 0.70,
        aggressive: 0.5,
        stats: {
            // Shooting
            shotClose: 83,
            shotMid: 80,
            shot3pt: 82,
            shotIQ: 83,
            freeThrow: 82,
            offensiveConsistency: 84,
            // Inside Scoring
            drivingLayup: 73,
            standingDunk: 35,
            drivingDunk: 35,
            drawFoul: 75,
            postMoves: 78,
            postHook: 63,
            postFade: 82,
            hands: 84,
            // Athleticism
            speed: 85,
            acceleration: 88,
            vertical: 84,
            strength: 91,
            stamina: 94,
            hustle: 94,
            // Playmaking
            speedWithBall: 79,
            ballHandle: 76,
            passingAccuracy: 80,
            passingVision: 80,
            passingIQ: 86,
            // Defense
            interiorDefense: 92,
            perimeterDefense: 89,
            helpDefenseIQ: 89,
            lateralQuickness: 84,
            passPerception: 80,
            steal: 78,
            block: 83,
            defensiveConsistency: 97,
            // Rebounding
            offensiveRebounding: 83,
            defensiveRebounding: 87,
            // Mental
            intangibles: 85,
            potential: 96
        }
    },

    {
        number: 3,
        name: "Kevin Zhou",
        team: "Golden State Warriors",
        position: "Forward",
        height: "6'0\"",
        weight: "175 lbs",
        age: 31,
        season: 4,
        image: "images/kevinjr.png", 
        description: "<b>Unpredictable, athletic spark plug</b> whose shooting streaks can ignite a team.",
        icons: ["Athleticism", "Pull-up Threat", "Spacer", "Lightning Rod"],
        shades_of: ["Michael Porter Jr.", "Klay Thompson"],
        offense: 0.79,
        defense: 0.77,
        aggressive: 0.5,
        stats: {
            // Shooting
            shotClose: 80.0,
            shotMid: 82.0,
            shot3pt: 84.0,
            shotIQ: 76.0,
            freeThrow: 85.0,
            offensiveConsistency: 86.0,
            // Inside Scoring
            drivingLayup: 82.0,
            standingDunk: 20.0,
            drivingDunk: 25.0,
            drawFoul: 94.0,
            postMoves: 66.0,
            postHook: 74.0,
            postFade: 69.0,
            hands: 86.0,
            // Athleticism
            speed: 85.0,
            acceleration: 82.0,
            vertical: 84.0,
            strength: 78.0,
            stamina: 84.0,
            hustle: 82.0,
            // Playmaking
            speedWithBall: 85.0,
            ballHandle: 77.0,
            passingAccuracy: 81.0,
            passingVision: 74.0,
            passingIQ: 79.0,
            // Defense
            interiorDefense: 79.0,
            perimeterDefense: 77.0,
            helpDefenseIQ: 82.0,
            lateralQuickness: 78.0,
            passPerception: 77.0,
            steal: 82.0,
            block: 85.0,
            defensiveConsistency: 85.0,
            // Rebounding
            offensiveRebounding: 72.0,
            defensiveRebounding: 82.0,
            // Mental
            intangibles: 83.0,
            potential: 76.0
        }
    },

    {
        number: 1.9,
        name: "Jason Roberts",
        team: "Golden State Warriors",
        position: "Forward",
        height: "5'7\"",
        weight: "165 lbs",
        age: 26,
        season: 3,
        image: "images/jason.png", 
        description: "<b>Jack-of-all-trades</b> guard who attacks the rim at will and can lock your favorite player up.",  // on a meteoric rise
        icons: ["On-Ball Defense", "Finisher", "Hustle", "Speed Demon"],
        shades_of: ["T.J. McConnell", "Alex Caruso"],
        offense: 0.80,
        defense: 0.85,
        aggressive: 0.5,
        stats: {
            // Shooting
            shotClose: 82.0,
            shotMid: 80.0,
            shot3pt: 72.0,
            shotIQ: 78.0,
            freeThrow: 77.0,
            offensiveConsistency: 94.0,
            // Inside Scoring
            drivingLayup: 92.0,
            standingDunk: 15.0,
            drivingDunk: 15.0,
            drawFoul: 88.0,
            postMoves: 70.0,
            postHook: 55.0,
            postFade: 55.0,
            hands: 82.0,
            // Athleticism
            speed: 89.0,
            acceleration: 88.0,
            vertical: 74.0,
            strength: 75.0,
            stamina: 96.0,
            hustle: 98.0,
            // Playmaking
            speedWithBall: 88.0,
            ballHandle: 78.0,
            passingAccuracy: 80.0,
            passingVision: 73.0,
            passingIQ: 74.0,
            // Defense
            interiorDefense: 82.0,
            perimeterDefense: 91.0,
            helpDefenseIQ: 83.0,
            lateralQuickness: 87.0,
            passPerception: 79.0,
            steal: 80.0,
            block: 79.0,
            defensiveConsistency: 98.0,
            // Rebounding
            offensiveRebounding: 72.0,
            defensiveRebounding: 74.0,
            // Mental
            intangibles: 95.0,
            potential: 85.0
        },
        clips: [
            { title: "Drive + Layup", url: "https://youtube.com/clip/UgkxskyBi7g8tjskUsv6RFlfV0fSQ-q_aCyQ?si=7cYp7Fei9NE-j_Xs" }
        ]
    },
    {
        number: 7,
        name: "Logan Mar",
        team: "Boston Celtics",
        position: "Guard",
        height: "5'7\"",
        weight: "165 lbs",
        age: 23,
        season: 3,
        image: "images/logan.png", 
        description: "<b>Silent scoring option</b> with an arsenal of moves.",
        icons: ["Spacer", "Float Game"],
        shades_of: ["Kyle Anderson"],
        offense: 0.78,
        defense: 0.64,
        aggressive: 0.5,
        stats: {
            // Shooting
            shotClose: 77.0,
            shotMid: 81.0,
            shot3pt: 81.0,
            shotIQ: 85.0,
            freeThrow: 86.0,
            offensiveConsistency: 84.0,
            // Inside Scoring
            drivingLayup: 81.0,
            standingDunk: 10.0,
            drivingDunk: 10.0,
            drawFoul: 80.0,
            postMoves: 64.0,
            postHook: 69.0,
            postFade: 60.0,
            hands: 85.0,
            // Athleticism
            speed: 82.0,
            acceleration: 84.0,
            vertical: 66.0,
            strength: 65.0,
            stamina: 84.0,
            hustle: 70.0,
            // Playmaking
            speedWithBall: 81.0,
            ballHandle: 77.0,
            passingAccuracy: 80.0,
            passingVision: 75.0,
            passingIQ: 83.0,
            // Defense
            interiorDefense: 63.0,
            perimeterDefense: 67.0,
            helpDefenseIQ: 65.0,
            lateralQuickness: 62.0,
            passPerception: 73.0,
            steal: 72.0,
            block: 68.0,
            defensiveConsistency: 75.0,
            // Rebounding
            offensiveRebounding: 60.0,
            defensiveRebounding: 56.0,
            // Mental
            intangibles: 68.0,
            potential: 86.0
        },
        clips: [
            { title: "And-1 on GOMC", url: "https://youtube.com/clip/Ugkx5jlQcenBDyayuhBefPz3CNYnT2Bse5p4?si=O-aftAzvXTXlma5m" }
        ]
    },

    {
        number: 1000,
        name: "Chris White",
        team: "Washington Wizards",
        position: "Guard",
        height: "5'9\"",
        weight: "200 lbs",
        age: 25,
        season: "2 (Retired)",
        image: "images/chris.png", 
        description: "<b>Unpredictable loose cannon</b> whose creativity hurts as much as it helps.",
        icons: ["Fast and Loose", "Human Highlight"],
        shades_of: ["Kevin Porter Jr."],
        offense: 0.70,
        defense: 0.70,
        aggressive: 0.5,
        stats: {
            // Shooting
            shotClose: 70.7070707,
            shotMid: 70.7070707,
            shot3pt: 70.7070707,
            shotIQ: 70.7070707,
            freeThrow: 70.7070707,
            offensiveConsistency: 70.7070707,
            // Inside Scoring
            drivingLayup: 70.7070707,
            standingDunk: 70.7070707,
            drivingDunk: 70.7070707,
            drawFoul: 70.7070707,
            postMoves: 70.7070707,
            postHook: 70.7070707,
            postFade: 70.7070707,
            hands: 70.7070707,
            // Athleticism
            speed: 70.7070707,
            acceleration: 70.7070707,
            vertical: 70.7070707,
            strength: 70.7070707,
            stamina: 70.7070707,
            hustle: 70.7070707,
            // Playmaking
            speedWithBall: 70.7070707,
            ballHandle: 70.7070707,
            passingAccuracy: 70.7070707,
            passingVision: 70.7070707,
            passingIQ: 70.7070707,
            // Defense
            interiorDefense: 70.7070707,
            perimeterDefense: 70.7070707,
            helpDefenseIQ: 70.7070707,
            lateralQuickness: 70.7070707,
            passPerception: 70.7070707,
            steal: 70.7070707,
            block: 70.7070707,
            defensiveConsistency: 70.7070707,
            // Rebounding
            offensiveRebounding: 70.7070707,
            defensiveRebounding: 70.7070707,
            // Mental
            intangibles: 70.7070707,
            potential: 70.7070707
        }
    },
    {
        number: 6.9,
        name: "Justine",
        team: "Los Angeles Lakers",
        position: "Guard",
        height: "5'9\"",
        weight: "190 lbs",
        age: 28,
        season: "2",
        image: "images/justine.png",
        description: "<b>Offensive talent</b> with the size to take it inside and the skill to shoot from way outside.",
        icons: ["Ballhandling", "Pull-up Threat", "Spacer", "Finisher"],
        shades_of: ["David Roddy"],
        offense: 0.70,
        defense: 0.70,
        aggressive: 0.5,
        stats: {
            // Shooting
            shotClose: 78,
            shotMid: 78,
            shot3pt: 78,
            shotIQ: 78,
            freeThrow: 78,
            offensiveConsistency: 78,
            // Inside Scoring
            drivingLayup: 70.7070707,
            standingDunk: 70.7070707,
            drivingDunk: 70.7070707,
            drawFoul: 70.7070707,
            postMoves: 70.7070707,
            postHook: 70.7070707,
            postFade: 70.7070707,
            hands: 70.7070707,
            // Athleticism
            speed: 70.7070707,
            acceleration: 70.7070707,
            vertical: 70.7070707,
            strength: 70.7070707,
            stamina: 70.7070707,
            hustle: 70.7070707,
            // Playmaking
            speedWithBall: 70.7070707,
            ballHandle: 70.7070707,
            passingAccuracy: 70.7070707,
            passingVision: 70.7070707,
            passingIQ: 70.7070707,
            // Defense
            interiorDefense: 70.7070707,
            perimeterDefense: 70.7070707,
            helpDefenseIQ: 70.7070707,
            lateralQuickness: 70.7070707,
            passPerception: 71,
            steal: 74,
            block: 65,
            defensiveConsistency: 90,
            // Rebounding
            offensiveRebounding: 70.7070707,
            defensiveRebounding: 70.7070707,
            // Mental
            intangibles: 70.7070707,
            potential: 70.7070707
        }
    },
    {
        number: 2.8999,
        name: "Allen",
        team: "Unknown",
        position: "Center",
        height: "6'0\"",
        weight: "220 lbs",
        age: 27,
        season: "2",
        image: "images/allen.png", 
        description: "<b>Relentless enforcer</b> with elite help instincts and a smooth touch to match his grit.",
        icons: ["Shot Blocking", "Off-Ball Defense", "Sh*t Stirrer", "Ridiculous Upside"],
        shades_of: ["Brook Lopez", 'Myles Turner'],
        offense: 0.74,
        defense: 0.81,
        aggressive: 0.5,
        stats: {
            // Shooting
            shotClose: 78.0,
            shotMid: 84.0,
            shot3pt: 58.0,
            shotIQ: 84.0,
            freeThrow: 86.0,
            offensiveConsistency: 84.0,
            // Inside Scoring
            drivingLayup: 77.0,
            standingDunk: 25.0,
            drivingDunk: 25.0,
            drawFoul: 72.0,
            postMoves: 69.0,
            postHook: 66.0,
            postFade: 58.0,
            hands: 87.0,
            // Athleticism
            speed: 81.0,
            acceleration: 76.0,
            vertical: 75.0,
            strength: 86.0,
            stamina: 84.0,
            hustle: 92.0,
            // Playmaking
            speedWithBall: 77.0,
            ballHandle: 64.0,
            passingAccuracy: 77.0,
            passingVision: 70.0,
            passingIQ: 79.0,
            // Defense
            interiorDefense: 87.0,
            perimeterDefense: 80.0,
            helpDefenseIQ: 86.0,
            lateralQuickness: 80.0,
            passPerception: 70.0,
            steal: 73.0,
            block: 85.0,
            defensiveConsistency: 93.0,
            // Rebounding
            offensiveRebounding: 82.0,
            defensiveRebounding: 88.0,
            // Mental
            intangibles: 85.0,
            potential: 83.0
        }
    },
    {
        number: 2.6,
        name: "Josh Lee",
        team: "Washington Wizards",
        position: "Guard",
        height: "5'7\"",
        weight: "155 lbs",
        age: 25,
        season: "4",
        image: "images/josh.png", 
        description: "<b>Blistering guard</b> who thrives in transition and punishes defenses from deep.",
        icons: ["Speed Demon", "Pull-up Threat", "Fast and Loose", "Human Highlight"],
        shades_of: ["Tyrese Maxey", "Immanuel Quickley"],
        offense: 0.81,
        defense: 0.79,
        aggressive: 0.5,
        stats: {
            // Shooting
            shotClose: 79.0,
            shotMid: 82.0,
            shot3pt: 85.0,
            shotIQ: 79.0,
            freeThrow: 86.0,
            offensiveConsistency: 80.0,
            // Inside Scoring
            drivingLayup: 88.0,
            standingDunk: 15.0,
            drivingDunk: 20.0,
            drawFoul: 84.0,
            postMoves: 70.0,
            postHook: 60.0,
            postFade: 62.0,
            hands: 85.0,
            // Athleticism
            speed: 90.0,
            acceleration: 94.0,
            vertical: 71.0,
            strength: 72.0,
            stamina: 85.0,
            hustle: 84.0,
            // Playmaking
            speedWithBall: 89.0,
            ballHandle: 84.0,
            passingAccuracy: 83.0,
            passingVision: 70.0,
            passingIQ: 78.0,
            // Defense
            interiorDefense: 74.0,
            perimeterDefense: 84.0,
            helpDefenseIQ: 77.0,
            lateralQuickness: 86.0,
            passPerception: 85.0,
            steal: 82.0,
            block: 54.0,
            defensiveConsistency: 96.0,
            // Rebounding
            offensiveRebounding: 70.0,
            defensiveRebounding: 80.0,
            // Mental
            intangibles: 89.0,
            potential: 70.0
        }
    },
    {
        number: 6.91,
        name: "Anup Rao",
        team: "Unknown",
        position: "Guard",
        height: "5'9\"",
        weight: "155 lbs",
        age: 43,
        season: "2",
        image: "images/anup.png",
        description: "<b>Confident shooter</b> whose endurance is unmatched.",
        icons: ["Pull-up Threat", "Spacer", "Movement Shooter"],
        shades_of: ["Kevin Huerter", "Joe Harris"],
        offense: 0.70,
        defense: 0.70,
        aggressive: 0.5,
        stats: {
            // Shooting
            shotClose: 79,
            shotMid: 82,
            shot3pt: 82,
            shotIQ: 86,
            freeThrow: 82,
            offensiveConsistency: 93,
            // Inside Scoring
            drivingLayup: 81,
            standingDunk: 64,
            drivingDunk: 70.7070707,
            drawFoul: 70.7070707,
            postMoves: 70.7070707,
            postHook: 70.7070707,
            postFade: 70.7070707,
            hands: 70.7070707,
            // Athleticism
            speed: 70.7070707,
            acceleration: 70.7070707,
            vertical: 70.7070707,
            strength: 70.7070707,
            stamina: 70.7070707,
            hustle: 70.7070707,
            // Playmaking
            speedWithBall: 70.7070707,
            ballHandle: 70.7070707,
            passingAccuracy: 70.7070707,
            passingVision: 70.7070707,
            passingIQ: 70.7070707,
            // Defense
            interiorDefense: 70.7070707,
            perimeterDefense: 70.7070707,
            helpDefenseIQ: 70.7070707,
            lateralQuickness: 70.7070707,
            passPerception: 70.7070707,
            steal: 70.7070707,
            block: 66,
            defensiveConsistency: 70.7070707,
            // Rebounding
            offensiveRebounding: 70.7070707,
            defensiveRebounding: 70.7070707,
            // Mental
            intangibles: 70.7070707,
            potential: 70.7070707
        }
    },
    {
        number: 3.51,
        name: "Sean Ly",
        team: "Golden State Warriors",
        position: "Guard",
        height: "5'6\"",
        weight: "160 lbs",
        age: 29,
        season: "3",
        image: "images/sean.png",
        description: "<b>Steady small guard</b> who quietly cashes in from mid-range and beyond.",
        icons: ["Spacer", "Feel For the Game"],
        shades_of: ["De'Anthony Melton"],
        offense: 0.70,
        defense: 0.70,
        aggressive: 0.5,
        stats: {
            // Shooting
            shotClose: 64,
            shotMid: 86,
            shot3pt: 85,
            shotIQ: 87,
            freeThrow: 89,
            offensiveConsistency: 87,
            // Inside Scoring
            drivingLayup: 70.7070707,
            standingDunk: 10,
            drivingDunk: 10,
            drawFoul: 70.7070707,
            postMoves: 70.7070707,
            postHook: 70.7070707,
            postFade: 70.7070707,
            hands: 70.7070707,
            // Athleticism
            speed: 70.7070707,
            acceleration: 70.7070707,
            vertical: 70.7070707,
            strength: 70.7070707,
            stamina: 70.7070707,
            hustle: 70.7070707,
            // Playmaking
            speedWithBall: 70.7070707,
            ballHandle: 70.7070707,
            passingAccuracy: 70.7070707,
            passingVision: 70.7070707,
            passingIQ: 70.7070707,
            // Defense
            interiorDefense: 70.7070707,
            perimeterDefense: 70.7070707,
            helpDefenseIQ: 70.7070707,
            lateralQuickness: 70.7070707,
            passPerception: 72,
            steal: 63,
            block: 47,
            defensiveConsistency: 95,
            // Rebounding
            offensiveRebounding: 70.7070707,
            defensiveRebounding: 70.7070707,
            // Mental
            intangibles: 90,
            potential: 87
        }
    },
    {
        number: 8.5,
        name: "Daniel",
        team: "Unknown",
        position: "Guard",
        height: "5'9\"",
        weight: "160lbs",
        age: 23,
        season: "4 (Retired)",
        image: "images/daniel.png", 
        description: "<b>Decisive driver</b> still searching for a rhythm from beyond the arc.",
        icons: ["Fast and Loose", "Ridiculous Upside"],
        shades_of: ["Russell Westbrook"],
        offense: 0.70,
        defense: 0.70,
        aggressive: 0.5,
        stats: {
            // Shooting
            shotClose: 70.7070707,
            shotMid: 70.7070707,
            shot3pt: 70.7070707,
            shotIQ: 70.7070707,
            freeThrow: 70.7070707,
            offensiveConsistency: 70.7070707,
            // Inside Scoring
            drivingLayup: 70.7070707,
            standingDunk: 70.7070707,
            drivingDunk: 70.7070707,
            drawFoul: 70.7070707,
            postMoves: 70.7070707,
            postHook: 70.7070707,
            postFade: 70.7070707,
            hands: 70.7070707,
            // Athleticism
            speed: 70.7070707,
            acceleration: 70.7070707,
            vertical: 70.7070707,
            strength: 70.7070707,
            stamina: 70.7070707,
            hustle: 70.7070707,
            // Playmaking
            speedWithBall: 70.7070707,
            ballHandle: 70.7070707,
            passingAccuracy: 70.7070707,
            passingVision: 70.7070707,
            passingIQ: 70.7070707,
            // Defense
            interiorDefense: 70.7070707,
            perimeterDefense: 70.7070707,
            helpDefenseIQ: 70.7070707,
            lateralQuickness: 70.7070707,
            passPerception: 70.7070707,
            steal: 70.7070707,
            block: 70.7070707,
            defensiveConsistency: 70.7070707,
            // Rebounding
            offensiveRebounding: 70.7070707,
            defensiveRebounding: 70.7070707,
            // Mental
            intangibles: 70.7070707,
            potential: 70.7070707
        }
    },
    {
        number: 1.1,
        name: "Alexis Dominguez",
        team: "Unknown",
        position: "Guard",
        height: "5'11\"",
        weight: "170lbs",
        age: 25,
        season: "4 (Retired)",
        image: "images/alexis.png", 
        description: "<b>A highly coveted two-way wing</b>, equally gifted at playmaking on offense and on defense.",
        icons: ["Pull-up Threat", "Passing Virtuoso", "Positional Versatility", "On-Ball Defense"],
        shades_of: ["Paul George", "D'Angelo Russell"],
        offense: 0.70,
        defense: 0.70,
        aggressive: 0.5,
        stats: {
            // Shooting
            shotClose: 70.7070707,
            shotMid: 70.7070707,
            shot3pt: 70.7070707,
            shotIQ: 70.7070707,
            freeThrow: 70.7070707,
            offensiveConsistency: 70.7070707,
            // Inside Scoring
            drivingLayup: 70.7070707,
            standingDunk: 70.7070707,
            drivingDunk: 70.7070707,
            drawFoul: 70.7070707,
            postMoves: 70.7070707,
            postHook: 70.7070707,
            postFade: 70.7070707,
            hands: 70.7070707,
            // Athleticism
            speed: 70.7070707,
            acceleration: 70.7070707,
            vertical: 70.7070707,
            strength: 70.7070707,
            stamina: 70.7070707,
            hustle: 70.7070707,
            // Playmaking
            speedWithBall: 70.7070707,
            ballHandle: 70.7070707,
            passingAccuracy: 70.7070707,
            passingVision: 70.7070707,
            passingIQ: 70.7070707,
            // Defense
            interiorDefense: 70.7070707,
            perimeterDefense: 70.7070707,
            helpDefenseIQ: 92,
            lateralQuickness: 70.7070707,
            passPerception: 70.7070707,
            steal: 92,
            block: 85,
            defensiveConsistency: 70.7070707,
            // Rebounding
            offensiveRebounding: 70.7070707,
            defensiveRebounding: 70.7070707,
            // Mental
            intangibles: 99,
            potential: 92
        }
    },

    {
        old_number: 3.01,
        number: 2.9,
        name: "Mo",
        team: "Unknown",
        position: "Guard",
        height: "5'10\"",
        weight: "170lbs",
        age: 23,
        season: "3 (Retired)",
        image: "images/mo.png", 
        description: "<b>Unabashed tough-shot maker</b> able to take over a game", // whether he's hot or not
        icons: ["Movement Shooter", "Pull-up Threat", "Spacer", "Fast and Loose"],
        shades_of: ["Norman Powell"],
        offense: 0.70,
        defense: 0.70,
        aggressive: 0.5,
        stats: {
            // Shooting
            shotClose: 70.7070707,
            shotMid: 70.7070707,
            shot3pt: 70.7070707,
            shotIQ: 70.7070707,
            freeThrow: 70.7070707,
            offensiveConsistency: 70.7070707,
            // Inside Scoring
            drivingLayup: 70.7070707,
            standingDunk: 70.7070707,
            drivingDunk: 70.7070707,
            drawFoul: 70.7070707,
            postMoves: 70.7070707,
            postHook: 70.7070707,
            postFade: 70.7070707,
            hands: 70.7070707,
            // Athleticism
            speed: 70.7070707,
            acceleration: 70.7070707,
            vertical: 70.7070707,
            strength: 70.7070707,
            stamina: 70.7070707,
            hustle: 70.7070707,
            // Playmaking
            speedWithBall: 70.7070707,
            ballHandle: 70.7070707,
            passingAccuracy: 70.7070707,
            passingVision: 70.7070707,
            passingIQ: 70.7070707,
            // Defense
            interiorDefense: 70.7070707,
            perimeterDefense: 70.7070707,
            helpDefenseIQ: 70.7070707,
            lateralQuickness: 70.7070707,
            passPerception: 70.7070707,
            steal: 70.7070707,
            block: 70.7070707,
            defensiveConsistency: 70.7070707,
            // Rebounding
            offensiveRebounding: 70.7070707,
            defensiveRebounding: 70.7070707,
            // Mental
            intangibles: 70.7070707,
            potential: 70.7070707
        }
    },

    {
        number: 2.86,
        name: "Minghui \"Lu\"",
        team: "Rockets",
        position: "Center",
        height: "5'10\"",
        weight: "185 lbs",
        age: 32,
        season: "5 (Semi-Retired)",
        image: "images/lu.png", 
        description: "<b>Creative offensive playmaker</b> who dominates the post with savvy veteran moves.", // whether he's hot or not
        icons: ["Post Moves", "Passing Virtuoso", "Feel For the Game", "Floor General"],
        shades_of: ["Alperen Sengun", "Nikola Jokic", "Domantis Sabonis"],
        offense: 0.81,
        defense: 0.76,
        aggressive: 0.5,
        stats: {
            // Shooting
            shotClose: 81.0,
            shotMid: 77.0,
            shot3pt: 71.0,
            shotIQ: 83.0,
            freeThrow: 80.0,
            offensiveConsistency: 80.0,
            // Inside Scoring
            drivingLayup: 85.0,
            standingDunk: 10.0,
            drivingDunk: 10.0,
            drawFoul: 85.0,
            postMoves: 90.0,
            postHook: 74.0,
            postFade: 58.0,
            hands: 65.0,
            // Athleticism
            speed: 80.0,
            acceleration: 83.0,
            vertical: 70.0,
            strength: 86.0,
            stamina: 80.0,
            hustle: 76.0,
            // Playmaking
            speedWithBall: 78.0,
            ballHandle: 77.0,
            passingAccuracy: 87.0,
            passingVision: 88.0,
            passingIQ: 83.0,
            // Defense
            interiorDefense: 83.0,
            perimeterDefense: 77.0,
            helpDefenseIQ: 72.0,
            lateralQuickness: 76.0,
            passPerception: 77.0,
            steal: 85.0,
            block: 64.0,
            defensiveConsistency: 83.0,
            // Rebounding
            offensiveRebounding: 70.0,
            defensiveRebounding: 80.0,
            // Mental
            intangibles: 75.0,
            potential: 78.0
        }
    },

    {
        number: 2.85,
        name: "Kevin Ly",
        team: "Unknown",
        position: "Guard",
        height: "5'8\"",
        weight: "185 lbs",
        age: 32,
        season: "5 (Retired)",
        image: "images/ogkevin.png", 
        description: "<b>An almost unfathomably accurate shooter</b>, making him an unquestionably valuable addition for any team.",
        icons: ["Clutch Gene", "Spacer", "Feel For the Game"],
        shades_of: ["Eric Gordon",],
        offense: 0.82,
        defense: 0.77,
        aggressive: 0.5,
        stats: {
            // Shooting
            shotClose: 74.0,
            shotMid: 84.0,
            shot3pt: 92.0,
            shotIQ: 93.0,
            freeThrow: 96.0,
            offensiveConsistency: 90.0,
            // Inside Scoring
            drivingLayup: 85.0,
            standingDunk: 10.0,
            drivingDunk: 10.0,
            drawFoul: 75.0,
            postMoves: 73.0,
            postHook: 77.0,
            postFade: 75.0,
            hands: 80.0,
            // Athleticism
            speed: 84.0,
            acceleration: 82.0,
            vertical: 61.0,
            strength: 78.0,
            stamina: 82.0,
            hustle: 84.0,
            // Playmaking
            speedWithBall: 83.0,
            ballHandle: 77.0,
            passingAccuracy: 83.0,
            passingVision: 79.0,
            passingIQ: 80.0,
            // Defense
            interiorDefense: 82.0,
            perimeterDefense: 79.0,
            helpDefenseIQ: 80.0,
            lateralQuickness: 76.0,
            passPerception: 73.0,
            steal: 76.0,
            block: 70.0,
            defensiveConsistency: 89.0,
            // Rebounding
            offensiveRebounding: 70.0,
            defensiveRebounding: 80.0,
            // Mental
            intangibles: 89.0,
            potential: 62.0
        }
    },
    {
        number: 2.5999,
        name: "Mitch Ly",
        team: "Golden State Warriors",
        position: "Guard",
        height: "5'8\"",
        weight: "170 lbs",
        age: 22,
        season: "2 (Retired)",
        image: "images/mitch.png",
        description: "<b>A dynamic sharpshooter</b> with slick footwork and crafty finishes at the rim—when his shoulder lets him play. ",
        icons: ["Ballhandling", "Pull-up Threat", "Finisher",  "Injury Concerns"],
        shades_of: ["Ty Jerome", "Payton Pritchard"],
        offense: 0.70,
        defense: 0.70,
        aggressive: 0.5,
        stats: {
            // Shooting
            shotClose: 82,
            shotMid: 84,
            shot3pt: 85,
            shotIQ: 87,
            freeThrow: 90,
            offensiveConsistency: 84,
            // Inside Scoring
            drivingLayup: 70.7070707,
            standingDunk: 70.7070707,
            drivingDunk: 70.7070707,
            drawFoul: 70.7070707,
            postMoves: 70.7070707,
            postHook: 70.7070707,
            postFade: 70.7070707,
            hands: 70.7070707,
            // Athleticism
            speed: 70.7070707,
            acceleration: 70.7070707,
            vertical: 70.7070707,
            strength: 70.7070707,
            stamina: 70.7070707,
            hustle: 70.7070707,
            // Playmaking
            speedWithBall: 70.7070707,
            ballHandle: 70.7070707,
            passingAccuracy: 70.7070707,
            passingVision: 70.7070707,
            passingIQ: 70.7070707,
            // Defense
            interiorDefense: 70.7070707,
            perimeterDefense: 70.7070707,
            helpDefenseIQ: 70.7070707,
            lateralQuickness: 70.7070707,
            passPerception: 72,
            steal: 78,
            block: 41,
            defensiveConsistency: 92,
            // Rebounding
            offensiveRebounding: 52,
            defensiveRebounding: 66,
            // Mental
            intangibles: 80,
            potential: 70.7070707
        }
    },
    {
        number: 2.88,
        name: "Eric Pham",
        team: "Unknown",
        position: "Guard",
        height: "5'9\"",
        weight: "185 lbs",
        age: 21,
        season: "3",
        image: "images/eric.png", 
        description: "<b>Outspoken floor general</b> who leverages his muscle on both ends.",
        icons: ["Floor General", "Pull-up Threat", "Sh*t Stirrer", "Injury Concerns"],
        shades_of: ["Eric Bledsoe"],
        offense: 0.77,
        defense: 0.71,
        aggressive: 0.5,
        stats: {
            // Shooting
            shotClose: 79.0,
            shotMid: 80.0,
            shot3pt: 81.0,
            shotIQ: 83.0,
            freeThrow: 85.0,
            offensiveConsistency: 88.0,
            // Inside Scoring
            drivingLayup: 84.0,
            standingDunk: 20.0,
            drivingDunk: 25.0,
            drawFoul: 87.0,
            postMoves: 72.0,
            postHook: 77.0,
            postFade: 77.0,
            hands: 87.0,
            // Athleticism
            speed: 70.7070707,
            acceleration: 70.7070707,
            vertical: 70.7070707,
            strength: 70.7070707,
            stamina: 70.7070707,
            hustle: 70.7070707,
            // Playmaking
            speedWithBall: 70.7070707,
            ballHandle: 70.7070707,
            passingAccuracy: 70.7070707,
            passingVision: 70.7070707,
            passingIQ: 70.7070707,
            // Defense
            interiorDefense: 70.7070707,
            perimeterDefense: 70.7070707,
            helpDefenseIQ: 70.7070707,
            lateralQuickness: 70.7070707,
            passPerception: 80.0,
            steal: 75.0,
            block: 66.0,
            defensiveConsistency: 84.0,
            // Rebounding
            offensiveRebounding: 70.7070707,
            defensiveRebounding: 70.7070707,
            // Mental
            intangibles: 97.0,
            potential: 70.7070707
        },
        clips: [
            { title: "Clip 1", url: "https://youtube.com/clip/UgkxKskD7Qk4ayvJaEAvcdqC7ml5KLAOkaIH?si=50cnv40v-EpXOjwv" }
        ]
    },
    {
        number: 7.01,
        old_number: 6.911,
        name: "Phil",
        team: "Unknown",
        position: "Guard",
        height: "6'1\"",
        weight: "175 lbs",
        age: 60,
        season: "Unknown",
        image: "images/phil.png", 
        description: "<b>Veteran sharpshooter</b> who haunts the perimeter, but is too often a ghost on defense.",
        icons: ["Pull-up Threat", "Spacer", "Artist"],
        shades_of: [""],
        offense: 0.70,
        defense: 0.70,
        aggressive: 0.5,
        stats: {
            // Shooting
            shotClose: 70,
            shotMid: 70,
            shot3pt: 70,
            shotIQ: 70,
            freeThrow: 70,
            offensiveConsistency: 70,
            // Inside Scoring
            drivingLayup: 70,
            standingDunk: 25,
            drivingDunk: 25,
            drawFoul: 70,
            postMoves: 50,
            postHook: 50,
            postFade: 50,
            hands: 70,
            // Athleticism
            speed: 70,
            acceleration: 70,
            vertical: 65,
            strength: 70,
            stamina: 75,
            hustle: 75,
            // Playmaking
            speedWithBall: 70,
            ballHandle: 70,
            passingAccuracy: 70,
            passingVision: 70,
            passingIQ: 70,
            // Defense
            interiorDefense: 70,
            perimeterDefense: 70,
            helpDefenseIQ: 70,
            lateralQuickness: 70,
            passPerception: 70,
            steal: 70,
            block: 70,
            defensiveConsistency: 70,
            // Rebounding
            offensiveRebounding: 65,
            defensiveRebounding: 70,
            // Mental
            intangibles: 75,
            potential: 70
        },
        clips: [
            { title: "Clip 1", url: "https://www.youtube.com/watch?v=ibfmYPpgl5w" }
        ]
    },
    {
        number: 1.999,
        name: "Lorne (Loren?)",
        team: "Unknown",
        position: "Guard",
        height: "5'10\"",
        weight: "160 lbs",
        age: 50,
        season: "Unknown",
        image: "images/lorne.png", 
        description: "<b>Unlikely scoring savant</b> equipped with surprising athleticism and timely outside shooting.",
        icons: ["Pull-up Threat", "Feel For the Game", "Clutch Gene", "Movement Shooter"],
        shades_of: ["Stephen Curry"],
        offense: 0.70,
        defense: 0.70,
        aggressive: 0.5,
        stats: {
            // Shooting
            shotClose: 84,
            shotMid: 84,
            shot3pt: 86,
            shotIQ: 85,
            freeThrow: 70.7070707,
            offensiveConsistency: 70.7070707,
            // Inside Scoring
            drivingLayup: 70.7070707,
            standingDunk: 70.7070707,
            drivingDunk: 70.7070707,
            drawFoul: 70.7070707,
            postMoves: 70.7070707,
            postHook: 70.7070707,
            postFade: 70.7070707,
            hands: 70.7070707,
            // Athleticism
            speed: 70.7070707,
            acceleration: 70.7070707,
            vertical: 70.7070707,
            strength: 70.7070707,
            stamina: 90,
            hustle: 86,
            // Playmaking
            speedWithBall: 70.7070707,
            ballHandle: 75,
            passingAccuracy: 75,
            passingVision: 70,
            passingIQ: 70,
            // Defense
            interiorDefense: 70.7070707,
            perimeterDefense: 70.7070707,
            helpDefenseIQ: 70.7070707,
            lateralQuickness: 70.7070707,
            passPerception: 70.7070707,
            steal: 70.7070707,
            block: 70.7070707,
            defensiveConsistency: 70.7070707,
            // Rebounding
            offensiveRebounding: 70.7070707,
            defensiveRebounding: 70.7070707,
            // Mental
            intangibles: 95,
            potential: 92
        }
    },
    {
        number: 3.51,
        name: "Steve",
        team: "Unknown",
        position: "Center",
        height: "6'2\"",
        weight: "190 lbs",
        age: 50,
        season: "Unknown",
        image: "images/steve.png", 
        description: "<b>Bruising backdown punisher</b> who also makes the right reads in the two-man game.",
        icons: ["Post Moves", "Shot Blocking"],
        shades_of: ["Bobby Portis", "Aaron Gordon"],
        offense: 0.70,
        defense: 0.70,
        aggressive: 0.5,
        stats: {
            // Shooting
            shotClose: 70.7070707,
            shotMid: 70.7070707,
            shot3pt: 70.7070707,
            shotIQ: 70.7070707,
            freeThrow: 70.7070707,
            offensiveConsistency: 70.7070707,
            // Inside Scoring
            drivingLayup: 70.7070707,
            standingDunk: 70.7070707,
            drivingDunk: 70.7070707,
            drawFoul: 70.7070707,
            postMoves: 70.7070707,
            postHook: 70.7070707,
            postFade: 70.7070707,
            hands: 70.7070707,
            // Athleticism
            speed: 70.7070707,
            acceleration: 70.7070707,
            vertical: 70.7070707,
            strength: 70.7070707,
            stamina: 70.7070707,
            hustle: 70.7070707,
            // Playmaking
            speedWithBall: 70.7070707,
            ballHandle: 70.7070707,
            passingAccuracy: 70.7070707,
            passingVision: 70.7070707,
            passingIQ: 70.7070707,
            // Defense
            interiorDefense: 70.7070707,
            perimeterDefense: 70.7070707,
            helpDefenseIQ: 70.7070707,
            lateralQuickness: 70.7070707,
            passPerception: 70.7070707,
            steal: 70.7070707,
            block: 70.7070707,
            defensiveConsistency: 70.7070707,
            // Rebounding
            offensiveRebounding: 70.7070707,
            defensiveRebounding: 70.7070707,
            // Mental
            intangibles: 70.7070707,
            potential: 70.7070707
        }
    },

    {
        number: 2.65,
        name: "Skyler Hallinan",
        team: "LA Clippers",
        position: "Wing",
        height: "5'11\"",
        weight: "160 lbs",
        age: 24,
        season: "6",
        image: "images/skyler.png", 
        description: "<b>Veteran sharpshooter whose athletic finishes and foul-baiting tactics are perpetually threatened by nagging injuries.</b>",
        icons: ["Spacer", "Injury Concerns"],
        shades_of: ["Mikal Bridges"],
        offense: 0.70,
        defense: 0.70,
        aggressive: 0.5,
        stats: {
            // Shooting
            shotClose: 79,
            shotMid: 84,
            shot3pt: 84,
            shotIQ: 88,
            freeThrow: 84,
            offensiveConsistency: 90,
            // Inside Scoring
            drivingLayup: 70.7070707,
            standingDunk: 70.7070707,
            drivingDunk: 70.7070707,
            drawFoul: 70.7070707,
            postMoves: 70.7070707,
            postHook: 70.7070707,
            postFade: 70.7070707,
            hands: 70.7070707,
            // Athleticism
            speed: 70.7070707,
            acceleration: 70.7070707,
            vertical: 70.7070707,
            strength: 70.7070707,
            stamina: 70.7070707,
            hustle: 70.7070707,
            // Playmaking
            speedWithBall: 70.7070707,
            ballHandle: 70.7070707,
            passingAccuracy: 70.7070707,
            passingVision: 70.7070707,
            passingIQ: 70.7070707,
            // Defense
            interiorDefense: 70.7070707,
            perimeterDefense: 70.7070707,
            helpDefenseIQ: 70.7070707,
            lateralQuickness: 70.7070707,
            passPerception: 70,
            steal: 72,
            block: 83,
            defensiveConsistency: 88,
            // Rebounding
            offensiveRebounding: 70.7070707,
            defensiveRebounding: 70.7070707,
            // Mental
            intangibles: 80,
            potential: 70.7070707
        }
    },
    {
        number: 4.0,
        name: "Christian",
        team: "Unknown",
        position: "Forward",
        height: "5'10\"",
        weight: "180 lbs",
        age: 28,
        season: "4 (Retired)",
        image: "images/christian.png",
        description: "<b>Hustle-first veteran</b> whose motor and hands make up for defensive limitations.",
        icons: ["Hustle", "Hands"],
        shades_of: ["PJ Tucker"],
        offense: 0.69,
        defense: 0.17,
        aggressive: 0.5,
        stats: {
            // Shooting
            shotClose: 72.0,
            shotMid: 68.0,
            shot3pt: 66.0,
            shotIQ: 70.0,
            freeThrow: 69.0,
            offensiveConsistency: 92.0,
            // Inside Scoring
            drivingLayup: 74.0,
            standingDunk: 10.0,
            drivingDunk: 15.0,
            drawFoul: 80.0,
            postMoves: 68.0,
            postHook: 58.0,
            postFade: 64.0,
            hands: 90.0,
            // Athleticism
            speed: 86.0,
            acceleration: 80.0,
            vertical: 64.0,
            strength: 84.0,
            stamina: 80.0,
            hustle: 92.0,
            // Playmaking
            speedWithBall: 70.7070707,
            ballHandle: 70.7070707,
            passingAccuracy: 70.7070707,
            passingVision: 70.7070707,
            passingIQ: 70.7070707,
            // Defense
            interiorDefense: 70.7070707,
            perimeterDefense: 70.7070707,
            helpDefenseIQ: 70.7070707,
            lateralQuickness: 70.7070707,
            passPerception: 70.0,
            steal: 65.0,
            block: 60.0,
            defensiveConsistency: 77.0,
            // Rebounding
            offensiveRebounding: 74.0,
            defensiveRebounding: 81.0,
            // Mental
            intangibles: 89.0,
            potential: 70.7070707
        }
    },
    // {
    //     number: 8.6,
    //     name: "Leonard",
    //     team: "Unknown",
    //     position: "Guard",
    //     height: "5'10\"",
    //     weight: "180 lbs",
    //     age: 55,
    //     season: "Unknown",
    //     image: "images/leonard.png", 
    //     description: "",
    //     icons: [""],
    //     shades_of: []
    // },
    // {
    //     number: 6.9101,
    //     name: "Anish",
    //     team: "Unknown",
    //     position: "Guard",
    //     height: "5'9\"",
    //     weight: "175 lbs",
    //     age: 21,
    //     season: "Unknown",
    //     image: "images/anish.png", 
    //     description: "",
    //     icons: [""],
    //     shades_of: []
    // },
];