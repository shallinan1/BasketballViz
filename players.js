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
// Each position rating includes: base weighted stats + intangibles/100 + (potential-60)/80

// PG: 0.28*S + 0.09*IS + 0.12*A + 0.38*P + 0.08*D + 0.05*R + intangibles/100 + (potential-60)/80
export const computePGRating = (stats) => {
    const s = computeShooting(stats);
    const is = computeInsideScoring(stats);
    const a = computeAthleticism(stats);
    const p = computePlaymaking(stats);
    const d = computeDefense(stats);
    const r = computeRebounding(stats);
    const base = 0.28 * s + 0.09 * is + 0.12 * a + 0.38 * p + 0.08 * d + 0.05 * r;
    return Math.round((base + stats.intangibles / 100 + (stats.potential - 60) / 80) * 10) / 10;
};

// SG: 0.35*S + 0.14*IS + 0.17*A + 0.17*P + 0.11*D + 0.06*R + intangibles/100 + (potential-60)/80
export const computeSGRating = (stats) => {
    const s = computeShooting(stats);
    const is = computeInsideScoring(stats);
    const a = computeAthleticism(stats);
    const p = computePlaymaking(stats);
    const d = computeDefense(stats);
    const r = computeRebounding(stats);
    const base = 0.35 * s + 0.14 * is + 0.17 * a + 0.17 * p + 0.11 * d + 0.06 * r;
    return Math.round((base + stats.intangibles / 100 + (stats.potential - 60) / 80) * 10) / 10;
};

// SF: 0.21*S + 0.17*IS + 0.20*A + 0.12*P + 0.20*D + 0.10*R + intangibles/100 + (potential-60)/80
export const computeSFRating = (stats) => {
    const s = computeShooting(stats);
    const is = computeInsideScoring(stats);
    const a = computeAthleticism(stats);
    const p = computePlaymaking(stats);
    const d = computeDefense(stats);
    const r = computeRebounding(stats);
    const base = 0.21 * s + 0.17 * is + 0.20 * a + 0.12 * p + 0.20 * d + 0.10 * r;
    return Math.round((base + stats.intangibles / 100 + (stats.potential - 60) / 80) * 10) / 10;
};

// PF: 0.11*S + 0.21*IS + 0.24*A + 0.05*P + 0.20*D + 0.19*R + intangibles/100 + (potential-60)/80
export const computePFRating = (stats) => {
    const s = computeShooting(stats);
    const is = computeInsideScoring(stats);
    const a = computeAthleticism(stats);
    const p = computePlaymaking(stats);
    const d = computeDefense(stats);
    const r = computeRebounding(stats);
    const base = 0.11 * s + 0.21 * is + 0.24 * a + 0.05 * p + 0.20 * d + 0.19 * r;
    return Math.round((base + stats.intangibles / 100 + (stats.potential - 60) / 80) * 10) / 10;
};

// C: 0.03*S + 0.24*IS + 0.20*A + 0.03*P + 0.25*D + 0.25*R + intangibles/100 + (potential-60)/80
export const computeCRating = (stats) => {
    const s = computeShooting(stats);
    const is = computeInsideScoring(stats);
    const a = computeAthleticism(stats);
    const p = computePlaymaking(stats);
    const d = computeDefense(stats);
    const r = computeRebounding(stats);
    const base = 0.03 * s + 0.24 * is + 0.20 * a + 0.03 * p + 0.25 * d + 0.25 * r;
    return Math.round((base + stats.intangibles / 100 + (stats.potential - 60) / 80) * 10) / 10;
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
// Uses a budget system: primary position is free, secondary positions cost (maxRating - theirRating)
// Total budget for secondary positions is 1.0
// e.g., 95/94.9/94.9 = 3 positions (costs 0.1 + 0.1 = 0.2)
// e.g., 95/94.5/94.1 = 2 positions (94.5 costs 0.5, 94.1 would cost 0.9, total would exceed 1.0)
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

    // Budget system: start with primary position, add others while budget allows
    const BUDGET = 1.0;
    let budgetUsed = 0;
    const validPositions = [positions[0]]; // Primary position is always included

    for (let i = 1; i < positions.length; i++) {
        const cost = maxRating - positions[i].rating;
        if (budgetUsed + cost <= BUDGET) {
            validPositions.push(positions[i]);
            budgetUsed += cost;
        } else {
            break; // No point checking lower-rated positions
        }
    }

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
            shotClose: 74,
            shotMid: 66,
            shot3pt: 76,
            shotIQ: 70,
            freeThrow: 67,
            offensiveConsistency: 78,
            // Inside Scoring
            drivingLayup: 68,
            standingDunk: 15,
            drivingDunk: 15,
            drawFoul: 55,
            postMoves: 70.7,
            postHook: 70.7,
            postFade: 40,
            hands: 68,
            // Athleticism
            speed: 78,
            acceleration: 78,
            vertical: 66,
            strength: 80,
            stamina: 92,
            hustle: 94,
            // Playmaking
            speedWithBall: 73,
            ballHandle: 64,
            passingAccuracy: 74,
            passingVision: 66,
            passingIQ: 85,
            // Defense
            interiorDefense: 74,
            perimeterDefense: 70,
            helpDefenseIQ: 68,
            lateralQuickness: 68,
            passPerception: 80,
            steal: 64,
            block: 77,
            defensiveConsistency: 83,
            // Rebounding
            offensiveRebounding: 73,
            defensiveRebounding: 80,
            // Mental
            intangibles: 80,
            potential: 88
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
            shotClose: 83,
            shotMid: 84,
            shot3pt: 88,
            shotIQ: 88,
            freeThrow: 88,
            offensiveConsistency: 84,
            // Inside Scoring
            drivingLayup: 92,
            standingDunk: 25,
            drivingDunk: 45,
            drawFoul: 72,
            postMoves: 75,
            postHook: 77,
            postFade: 82,
            hands: 85,
            // Athleticism
            speed: 90,
            acceleration: 84,
            vertical: 84,
            strength: 81,
            stamina: 92,
            hustle: 88,
            // Playmaking
            speedWithBall: 86,
            ballHandle: 86,
            passingAccuracy: 82,
            passingVision: 86,
            passingIQ: 85,
            // Defense
            interiorDefense: 85,
            perimeterDefense: 96,
            helpDefenseIQ: 80,
            lateralQuickness: 91,
            passPerception: 83,
            steal: 96,
            block: 80,
            defensiveConsistency: 96,
            // Rebounding
            offensiveRebounding: 62,
            defensiveRebounding: 74,
            // Mental
            intangibles: 90,
            potential: 99
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
            shotClose: 74,
            shotMid: 77,
            shot3pt: 74,
            shotIQ: 83,
            freeThrow: 74,
            offensiveConsistency: 84,
            // Inside Scoring
            drivingLayup: 82,
            standingDunk: 15,
            drivingDunk: 15,
            drawFoul: 73,
            postMoves: 61,
            postHook: 64,
            postFade: 61,
            hands: 87,
            // Athleticism
            speed: 79,
            acceleration: 84,
            vertical: 72,
            strength: 81,
            stamina: 91,
            hustle: 93,
            // Playmaking
            speedWithBall: 82,
            ballHandle: 77,
            passingAccuracy: 82,
            passingVision: 89,
            passingIQ: 80,
            // Defense
            interiorDefense: 75,
            perimeterDefense: 73,
            helpDefenseIQ: 77,
            lateralQuickness: 73,
            passPerception: 80,
            steal: 86,
            block: 82,
            defensiveConsistency: 90,
            // Rebounding
            offensiveRebounding: 90,
            defensiveRebounding: 94,
            // Mental
            intangibles: 92,
            potential: 91
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
            shotClose: 73,
            shotMid: 77,
            shot3pt: 73,
            shotIQ: 70,
            freeThrow: 77,
            offensiveConsistency: 82,
            // Inside Scoring
            drivingLayup: 79,
            standingDunk: 10,
            drivingDunk: 10,
            drawFoul: 80,
            postMoves: 61,
            postHook: 64,
            postFade: 61,
            hands: 78,
            // Athleticism
            speed: 87,
            acceleration: 85,
            vertical: 71,
            strength: 70,
            stamina: 96,
            hustle: 95,
            // Playmaking
            speedWithBall: 83,
            ballHandle: 77,
            passingAccuracy: 78,
            passingVision: 73,
            passingIQ: 76,
            // Defense
            interiorDefense: 74,
            perimeterDefense: 87,
            helpDefenseIQ: 82,
            lateralQuickness: 84,
            passPerception: 84,
            steal: 92,
            block: 71,
            defensiveConsistency: 93,
            // Rebounding
            offensiveRebounding: 63,
            defensiveRebounding: 66,
            // Mental
            intangibles: 87,
            potential: 87
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
            shotClose: 77,
            shotMid: 80,
            shot3pt: 83,
            shotIQ: 81,
            freeThrow: 84,
            offensiveConsistency: 94,
            // Inside Scoring
            drivingLayup: 85,
            standingDunk: 15,
            drivingDunk: 20,
            drawFoul: 81,
            postMoves: 62,
            postHook: 76,
            postFade: 70,
            hands: 86,
            // Athleticism
            speed: 86,
            acceleration: 85,
            vertical: 69,
            strength: 67,
            stamina: 91,
            hustle: 91,
            // Playmaking
            speedWithBall: 80,
            ballHandle: 85,
            passingAccuracy: 85,
            passingVision: 85,
            passingIQ: 93,
            // Defense
            interiorDefense: 81,
            perimeterDefense: 84,
            helpDefenseIQ: 84,
            lateralQuickness: 79,
            passPerception: 80,
            steal: 80,
            block: 84,
            defensiveConsistency: 85,
            // Rebounding
            offensiveRebounding: 71,
            defensiveRebounding: 80,
            // Mental
            intangibles: 89,
            potential: 93
        }
    },
    {
        number: 3,
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
            shotClose: 77,
            shotMid: 75,
            shot3pt: 79,
            shotIQ: 85,
            freeThrow: 83,
            offensiveConsistency: 92,
            // Inside Scoring
            drivingLayup: 81,
            standingDunk: 10,
            drivingDunk: 10,
            drawFoul: 85,
            postMoves: 60,
            postHook: 76,
            postFade: 50,
            hands: 86,
            // Athleticism
            speed: 93,
            acceleration: 91,
            vertical: 70,
            strength: 67,
            stamina: 99,
            hustle: 95,
            // Playmaking
            speedWithBall: 88,
            ballHandle: 76,
            passingAccuracy: 79,
            passingVision: 87,
            passingIQ: 84,
            // Defense
            interiorDefense: 73,
            perimeterDefense: 80,
            helpDefenseIQ: 83,
            lateralQuickness: 85,
            passPerception: 82,
            steal: 75,
            block: 60,
            defensiveConsistency: 94,
            // Rebounding
            offensiveRebounding: 68,
            defensiveRebounding: 78,
            // Mental
            intangibles: 92,
            potential: 86
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
            shotClose: 66,
            shotMid: 72,
            shot3pt: 68,
            shotIQ: 25,
            freeThrow: 72,
            offensiveConsistency: 94,
            // Inside Scoring
            drivingLayup: 66,
            standingDunk: 15,
            drivingDunk: 15,
            drawFoul: 78,
            postMoves: 40,
            postHook: 55,
            postFade: 45,
            hands: 73,
            // Athleticism
            speed: 87,
            acceleration: 84,
            vertical: 55,
            strength: 77,
            stamina: 90,
            hustle: 99,
            // Playmaking
            speedWithBall: 83,
            ballHandle: 55,
            passingAccuracy: 55,
            passingVision: 60,
            passingIQ: 25,
            // Defense
            interiorDefense: 81,
            perimeterDefense: 81,
            helpDefenseIQ: 69,
            lateralQuickness: 79,
            passPerception: 73,
            steal: 67,
            block: 68,
            defensiveConsistency: 99,
            // Rebounding
            offensiveRebounding: 69,
            defensiveRebounding: 68,
            // Mental
            intangibles: 83,
            potential: 89,
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
            passingAccuracy: 81,
            passingVision: 78,
            passingIQ: 75,
            // Defense
            interiorDefense: 87,
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
            shotClose: 72,
            shotMid: 64,
            shot3pt: 70,
            shotIQ: 84,
            freeThrow: 80,
            offensiveConsistency: 90,
            // Inside Scoring
            drivingLayup: 80,
            standingDunk: 10,
            drivingDunk: 10,
            drawFoul: 83,
            postMoves: 68,
            postHook: 68,
            postFade: 63,
            hands: 87,
            // Athleticism
            speed: 76,
            acceleration: 84,
            vertical: 73,
            strength: 92,
            stamina: 78,
            hustle: 85,
            // Playmaking
            speedWithBall: 76,
            ballHandle: 68,
            passingAccuracy: 82,
            passingVision: 71,
            passingIQ: 83,
            // Defense
            interiorDefense: 84,
            perimeterDefense: 68,
            helpDefenseIQ: 80,
            lateralQuickness: 70,
            passPerception: 70,
            steal: 68,
            block: 82,
            defensiveConsistency: 92,
            // Rebounding
            offensiveRebounding: 74,
            defensiveRebounding: 81,
            // Mental
            intangibles: 79,
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
            shotClose: 83,
            shotMid: 83,
            shot3pt: 84,
            shotIQ: 85,
            freeThrow: 86,
            offensiveConsistency: 87,
            // Inside Scoring
            drivingLayup: 85,
            standingDunk: 15,
            drivingDunk: 20,
            drawFoul: 87,
            postMoves: 66,
            postHook: 68,
            postFade: 68,
            hands: 86,
            // Athleticism
            speed: 86,
            acceleration: 87,
            vertical: 71,
            strength: 70,
            stamina: 86,
            hustle: 84,
            // Playmaking
            speedWithBall: 84,
            ballHandle: 86,
            passingAccuracy: 82,
            passingVision: 75,
            passingIQ: 80,
            // Defense
            interiorDefense: 72,
            perimeterDefense: 69,
            helpDefenseIQ: 67,
            lateralQuickness: 70,
            passPerception: 72,
            steal: 80,
            block: 77,
            defensiveConsistency: 83,
            // Rebounding
            offensiveRebounding: 66,
            defensiveRebounding: 76,
            // Mental
            intangibles: 78,
            potential: 79
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
            shotClose: 80,
            shotMid: 82,
            shot3pt: 84,
            shotIQ: 76,
            freeThrow: 85,
            offensiveConsistency: 86,
            // Inside Scoring
            drivingLayup: 82,
            standingDunk: 20,
            drivingDunk: 25,
            drawFoul: 94,
            postMoves: 66,
            postHook: 74,
            postFade: 69,
            hands: 86,
            // Athleticism
            speed: 85,
            acceleration: 82,
            vertical: 84,
            strength: 78,
            stamina: 84,
            hustle: 82,
            // Playmaking
            speedWithBall: 85,
            ballHandle: 77,
            passingAccuracy: 81,
            passingVision: 74,
            passingIQ: 79,
            // Defense
            interiorDefense: 79,
            perimeterDefense: 77,
            helpDefenseIQ: 82,
            lateralQuickness: 78,
            passPerception: 77,
            steal: 82,
            block: 85,
            defensiveConsistency: 85,
            // Rebounding
            offensiveRebounding: 72,
            defensiveRebounding: 77,
            // Mental
            intangibles: 83,
            potential: 76
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
            shotClose: 82,
            shotMid: 81,
            shot3pt: 74,
            shotIQ: 78,
            freeThrow: 80,
            offensiveConsistency: 95,
            // Inside Scoring
            drivingLayup: 92,
            standingDunk: 15,
            drivingDunk: 15,
            drawFoul: 88,
            postMoves: 70,
            postHook: 55,
            postFade: 55,
            hands: 82,
            // Athleticism
            speed: 92,
            acceleration: 88,
            vertical: 74,
            strength: 75,
            stamina: 96,
            hustle: 99,
            // Playmaking
            speedWithBall: 89,
            ballHandle: 80,
            passingAccuracy: 80,
            passingVision: 73,
            passingIQ: 74,
            // Defense
            interiorDefense: 82,
            perimeterDefense: 93,
            helpDefenseIQ: 87,
            lateralQuickness: 87,
            passPerception: 79,
            steal: 80,
            block: 82,
            defensiveConsistency: 98,
            // Rebounding
            offensiveRebounding: 78,
            defensiveRebounding: 74,
            // Mental
            intangibles: 95,
            potential: 90
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
            shotClose: 77,
            shotMid: 81,
            shot3pt: 83,
            shotIQ: 85,
            freeThrow: 86,
            offensiveConsistency: 84,
            // Inside Scoring
            drivingLayup: 81,
            standingDunk: 10,
            drivingDunk: 10,
            drawFoul: 64,
            postMoves: 60,
            postHook: 69,
            postFade: 60,
            hands: 70,
            // Athleticism
            speed: 82,
            acceleration: 80,
            vertical: 52,
            strength: 54,
            stamina: 84,
            hustle: 62,
            // Playmaking
            speedWithBall: 80,
            ballHandle: 80,
            passingAccuracy: 74,
            passingVision: 70,
            passingIQ: 83,
            // Defense
            interiorDefense: 54,
            perimeterDefense: 61,
            helpDefenseIQ: 61,
            lateralQuickness: 62,
            passPerception: 68,
            steal: 72,
            block: 68,
            defensiveConsistency: 60,
            // Rebounding
            offensiveRebounding: 60,
            defensiveRebounding: 56,
            // Mental
            intangibles: 68,
            potential: 86
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
            intangibles: 62,
            potential: 82
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
            shotClose: 78,
            shotMid: 84,
            shot3pt: 58,
            shotIQ: 84,
            freeThrow: 86,
            offensiveConsistency: 84,
            // Inside Scoring
            drivingLayup: 77,
            standingDunk: 25,
            drivingDunk: 25,
            drawFoul: 72,
            postMoves: 69,
            postHook: 66,
            postFade: 58,
            hands: 87,
            // Athleticism
            speed: 81,
            acceleration: 76,
            vertical: 75,
            strength: 86,
            stamina: 84,
            hustle: 92,
            // Playmaking
            speedWithBall: 77,
            ballHandle: 64,
            passingAccuracy: 77,
            passingVision: 70,
            passingIQ: 79,
            // Defense
            interiorDefense: 87,
            perimeterDefense: 80,
            helpDefenseIQ: 86,
            lateralQuickness: 80,
            passPerception: 70,
            steal: 73,
            block: 85,
            defensiveConsistency: 93,
            // Rebounding
            offensiveRebounding: 82,
            defensiveRebounding: 88,
            // Mental
            intangibles: 85,
            potential: 83
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
            shotClose: 79,
            shotMid: 82,
            shot3pt: 85,
            shotIQ: 79,
            freeThrow: 86,
            offensiveConsistency: 80,
            // Inside Scoring
            drivingLayup: 88,
            standingDunk: 15,
            drivingDunk: 20,
            drawFoul: 84,
            postMoves: 70,
            postHook: 60,
            postFade: 62,
            hands: 85,
            // Athleticism
            speed: 90,
            acceleration: 94,
            vertical: 71,
            strength: 72,
            stamina: 85,
            hustle: 84,
            // Playmaking
            speedWithBall: 89,
            ballHandle: 84,
            passingAccuracy: 83,
            passingVision: 70,
            passingIQ: 78,
            // Defense
            interiorDefense: 74,
            perimeterDefense: 84,
            helpDefenseIQ: 77,
            lateralQuickness: 86,
            passPerception: 85,
            steal: 82,
            block: 54,
            defensiveConsistency: 96,
            // Rebounding
            offensiveRebounding: 70,
            defensiveRebounding: 80,
            // Mental
            intangibles: 89,
            potential: 70
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
            standingDunk: 15,
            drivingDunk: 15,
            drawFoul: 70,
            postMoves: 60,
            postHook: 40,
            postFade: 40,
            hands: 78,
            // Athleticism
            speed: 88,
            acceleration: 90,
            vertical: 78,
            strength: 73,
            stamina: 99,
            hustle: 90,
            // Playmaking
            speedWithBall: 86,
            ballHandle: 77,
            passingAccuracy: 78,
            passingVision: 73,
            passingIQ: 76,
            // Defense
            interiorDefense: 70,
            perimeterDefense: 80,
            helpDefenseIQ: 67,
            lateralQuickness: 75,
            passPerception: 77,
            steal: 71,
            block: 66,
            defensiveConsistency: 90,
            // Rebounding
            offensiveRebounding: 61,
            defensiveRebounding: 66,
            // Mental
            intangibles: 60,
            potential: 87
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
            shotClose: 81,
            shotMid: 77,
            shot3pt: 71,
            shotIQ: 83,
            freeThrow: 80,
            offensiveConsistency: 80,
            // Inside Scoring
            drivingLayup: 85,
            standingDunk: 10,
            drivingDunk: 10,
            drawFoul: 85,
            postMoves: 90,
            postHook: 74,
            postFade: 58,
            hands: 65,
            // Athleticism
            speed: 80,
            acceleration: 83,
            vertical: 70,
            strength: 86,
            stamina: 80,
            hustle: 76,
            // Playmaking
            speedWithBall: 78,
            ballHandle: 77,
            passingAccuracy: 87,
            passingVision: 88,
            passingIQ: 83,
            // Defense
            interiorDefense: 83,
            perimeterDefense: 77,
            helpDefenseIQ: 72,
            lateralQuickness: 76,
            passPerception: 77,
            steal: 85,
            block: 64,
            defensiveConsistency: 83,
            // Rebounding
            offensiveRebounding: 70,
            defensiveRebounding: 80,
            // Mental
            intangibles: 75,
            potential: 78
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
            shotClose: 74,
            shotMid: 84,
            shot3pt: 92,
            shotIQ: 93,
            freeThrow: 96,
            offensiveConsistency: 90,
            // Inside Scoring
            drivingLayup: 85,
            standingDunk: 10,
            drivingDunk: 10,
            drawFoul: 75,
            postMoves: 73,
            postHook: 77,
            postFade: 75,
            hands: 80,
            // Athleticism
            speed: 84,
            acceleration: 82,
            vertical: 61,
            strength: 78,
            stamina: 82,
            hustle: 84,
            // Playmaking
            speedWithBall: 83,
            ballHandle: 77,
            passingAccuracy: 83,
            passingVision: 79,
            passingIQ: 80,
            // Defense
            interiorDefense: 82,
            perimeterDefense: 79,
            helpDefenseIQ: 80,
            lateralQuickness: 76,
            passPerception: 73,
            steal: 76,
            block: 70,
            defensiveConsistency: 89,
            // Rebounding
            offensiveRebounding: 70,
            defensiveRebounding: 80,
            // Mental
            intangibles: 89,
            potential: 62
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
            lateralQuickness: 70.7,
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
            shotClose: 79,
            shotMid: 80,
            shot3pt: 81,
            shotIQ: 83,
            freeThrow: 85,
            offensiveConsistency: 88,
            // Inside Scoring
            drivingLayup: 84,
            standingDunk: 20,
            drivingDunk: 25,
            drawFoul: 87,
            postMoves: 72,
            postHook: 77,
            postFade: 77,
            hands: 87,
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
            passPerception: 80,
            steal: 75,
            block: 66,
            defensiveConsistency: 84,
            // Rebounding
            offensiveRebounding: 64,
            defensiveRebounding: 66,
            // Mental
            intangibles: 97,
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
            freeThrow: 84,
            offensiveConsistency: 88,
            // Inside Scoring
            drivingLayup: 85,
            standingDunk: 20,
            drivingDunk: 20,
            drawFoul: 86,
            postMoves: 65,
            postHook: 80,
            postFade: 72,
            hands: 86,
            // Athleticism
            speed: 85,
            acceleration: 90,
            vertical: 83,
            strength: 71,
            stamina: 90,
            hustle: 86,
            // Playmaking
            speedWithBall: 84,
            ballHandle: 76,
            passingAccuracy: 83,
            passingVision: 70,
            passingIQ: 81,
            // Defense
            interiorDefense: 75,
            perimeterDefense: 80,
            helpDefenseIQ: 80,
            lateralQuickness: 73,
            passPerception: 79,
            steal: 80,
            block: 80,
            defensiveConsistency: 70.7070707,
            // Rebounding
            offensiveRebounding: 81,
            defensiveRebounding: 84,
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
            shotMid: 79,
            shot3pt: 79,
            shotIQ: 88,
            freeThrow: 79,
            offensiveConsistency: 85,
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
            speed: 88,
            acceleration: 90,
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
        number: 4,
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
            shotClose: 72,
            shotMid: 68,
            shot3pt: 66,
            shotIQ: 70,
            freeThrow: 69,
            offensiveConsistency: 92,
            // Inside Scoring
            drivingLayup: 74,
            standingDunk: 10,
            drivingDunk: 15,
            drawFoul: 80,
            postMoves: 68,
            postHook: 58,
            postFade: 64,
            hands: 90,
            // Athleticism
            speed: 86,
            acceleration: 80,
            vertical: 64,
            strength: 84,
            stamina: 80,
            hustle: 92,
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
            steal: 65,
            block: 60,
            defensiveConsistency: 77,
            // Rebounding
            offensiveRebounding: 74,
            defensiveRebounding: 74,
            // Mental
            intangibles: 89,
            potential: 70.7070707
        }
    },
    {
        number: 2.91,
        name: "Zachary Fitzgerald",
        team: "Unknown",
        position: "Forward",
        height: "5'11\"",
        weight: "185 lbs",
        age: 24,
        season: 1,
        image: "images/zach.png",
        description: "<b>Physical rebounder</b> who crashes the boards and knocks down open shots.",
        icons: ["Rebounding", "Spacer"],
        shades_of: ["Dwight Howard"],
        offense: 0.76,
        defense: 0.75,
        aggressive: 0.5,
        stats: {
            // Shooting (slightly better than Mingma)
            shotClose: 78,
            shotMid: 81,
            shot3pt: 78,
            shotIQ: 83,
            freeThrow: 78,
            offensiveConsistency: 84,
            // Inside Scoring
            drivingLayup: 80,
            standingDunk: 15,
            drivingDunk: 15,
            drawFoul: 84,
            postMoves: 61,
            postHook: 64,
            postFade: 61,
            hands: 87,
            // Athleticism
            speed: 77,
            acceleration: 82,
            vertical: 72,
            strength: 85,
            stamina: 90,
            hustle: 93,
            // Playmaking (worse than Mingma)
            speedWithBall: 74,
            ballHandle: 70,
            passingAccuracy: 74,
            passingVision: 76,
            passingIQ: 72,
            // Defense
            interiorDefense: 76,
            perimeterDefense: 73,
            helpDefenseIQ: 77,
            lateralQuickness: 72,
            passPerception: 78,
            steal: 82,
            block: 82,
            defensiveConsistency: 90,
            // Rebounding (slightly better than Mingma)
            offensiveRebounding: 95,
            defensiveRebounding: 94,
            // Mental
            intangibles: 88,
            potential: 85
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