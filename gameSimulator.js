// gameSimulator.js
import { players } from './players.js';

// === Configuration Constants ===
export const CONFIG = {
    FATIGUE_THRESHOLD: 15,
    FATIGUE_PENALTY: 0.03,      // 3% per shot after threshold
    MOMENTUM_THRESHOLD: 3,
    MOMENTUM_BOOST: 0.08,       // +8% for hot streak
    MOMENTUM_PENALTY: 0.05,     // -5% for cold streak
    BASE_TURNOVER_RATE: 0.08,   // 8% base
    OFFENSIVE_REBOUND_CHANCE: 0.25  // 25% chance
};

// === Pure Utility Functions (exported for testing) ===

export function sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
}

export function gaussianRandom(mean = 0, stdDev = 1, min = -Infinity, max = Infinity) {
    let result;
    do {
        let u1 = Math.random();
        let u2 = Math.random();
        let z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
        result = z0 * stdDev + mean;
    } while (result < min || result > max);
    return result;
}

export function balanceAdjusted(prob, balanceFactor) {
    const maxBoost = 0.1;
    return Math.min(1, prob + ((balanceFactor - 0.5) / 0.5 * maxBoost));
}

export function getFatiguePenalty(shots, threshold = CONFIG.FATIGUE_THRESHOLD, penalty = CONFIG.FATIGUE_PENALTY) {
    if (shots <= threshold) return 0;
    return (shots - threshold) * penalty;
}

export function getMomentumModifier(streak, threshold = CONFIG.MOMENTUM_THRESHOLD, boost = CONFIG.MOMENTUM_BOOST, penalty = CONFIG.MOMENTUM_PENALTY) {
    if (streak >= threshold) {
        return boost; // Hot streak
    } else if (streak <= -threshold) {
        return -penalty; // Cold streak
    }
    return 0;
}

export function calculateTurnoverRate(teamBalance, baseRate = CONFIG.BASE_TURNOVER_RATE) {
    // Better balanced teams have fewer turnovers
    const balanceModifier = (teamBalance / 5) * 0.04; // Up to 4% reduction
    return Math.max(0.02, baseRate - balanceModifier);
}

export function calculateReboundChance(teamOffense, opponentDefense, baseChance = CONFIG.OFFENSIVE_REBOUND_CHANCE) {
    // Team's offense vs opponent's defense affects rebound chance
    return baseChance * sigmoid((teamOffense - opponentDefense) * 0.5 + 0.5);
}

export function calculateBalanceRating(aggressive) {
    return 5 - ((Math.abs(2.5 - aggressive) + 0.25) * 2);
}

// === DOM-dependent Functions ===

export function calculateTeamRating(teamSlots) {
    let offense = 0;
    let defense = 0;
    let aggressive = 0;
    let playerCount = 0;

    teamSlots.forEach(slot => {
        const img = slot.querySelector('img');
        if (img) {
            const playerId = img.dataset.id;
            const player = players.find(p => p.image.includes(playerId));
            if (player) {
                const s = player.stats || {};
                offense += (s.offense ?? player.offense) || 0;
                defense += (s.defense ?? player.defense) || 0;
                aggressive += (s.aggression ?? player.aggressive) || 0;
                playerCount++;
            }
        }
    });

    // Only return ratings if team is complete
    if (playerCount === 5) {
        return {
            offense: offense,
            defense: defense,
            balance: calculateBalanceRating(aggressive)
        };
    }
    return null;
}

// === Game Simulation ===

export function simulateGame(teamA, teamB, options = {}) {
    const {
        pointLimit = 15,
        gameSpeed = 100,
        onScoreUpdate = () => {},
        onGameOver = () => {},
        onOvertimeStart = () => {}
    } = options;

    let scoreA = 0;
    let scoreB = 0;
    let inOvertime = false;

    // Fatigue tracking - shots taken per team
    let shotsA = 0;
    let shotsB = 0;

    // Momentum tracking - consecutive makes/misses
    let streakA = 0; // positive = makes, negative = misses
    let streakB = 0;

    function checkTurnover(team) {
        const turnoverRate = calculateTurnoverRate(team.balance);
        return Math.random() < turnoverRate;
    }

    function checkOffensiveRebound(team, opponent) {
        const reboundChance = calculateReboundChance(team.offense, opponent.defense);
        return Math.random() < reboundChance;
    }

    function simulateShot(team, opponent, shots, streak) {
        const shoot2ptProb = 0.4;
        const baseMake2ptProb = 0.2;
        const baseMake1ptProb = 0.4;

        let make2ptProb = gaussianRandom(baseMake2ptProb, 0.025, 0.1, 0.5);
        let make1ptProb = gaussianRandom(baseMake1ptProb, 0.05, 0.1, 0.6);

        // Apply offense vs defense
        make2ptProb = make2ptProb * 2 * sigmoid(team.offense - opponent.defense);
        make1ptProb = make1ptProb * 2 * sigmoid(team.offense - opponent.defense);

        // Apply balance factor
        const balanceFactor = team.balance / 5;
        make2ptProb = balanceAdjusted(make2ptProb, balanceFactor);
        make1ptProb = balanceAdjusted(make1ptProb, balanceFactor);

        // Apply fatigue penalty
        const fatiguePenalty = getFatiguePenalty(shots);
        make2ptProb = Math.max(0.05, make2ptProb - fatiguePenalty);
        make1ptProb = Math.max(0.1, make1ptProb - fatiguePenalty);

        // Apply momentum modifier
        const momentumMod = getMomentumModifier(streak);
        make2ptProb = Math.min(0.95, Math.max(0.05, make2ptProb + momentumMod));
        make1ptProb = Math.min(0.95, Math.max(0.1, make1ptProb + momentumMod));

        if (Math.random() < shoot2ptProb) {
            const made = Math.random() < make2ptProb;
            return { points: made ? 2 : 0, made, attempted: 2 };
        }
        const made = Math.random() < make1ptProb;
        return { points: made ? 1 : 0, made, attempted: 1 };
    }

    function simulatePossession() {
        // Check for game end conditions
        if ((scoreA >= pointLimit || scoreB >= pointLimit) && Math.abs(scoreA - scoreB) < 2) {
            if (!inOvertime) {
                inOvertime = true;
                onOvertimeStart();
            }
        }

        if ((scoreA >= pointLimit || scoreB >= pointLimit) && Math.abs(scoreA - scoreB) >= 2) {
            onGameOver({
                scoreA,
                scoreB,
                winner: scoreA > scoreB ? 'A' : 'B'
            });
            return;
        }

        // Team A possession
        if (!checkTurnover(teamA)) {
            const resultA = simulateShot(teamA, teamB, shotsA, streakA);
            shotsA++;

            if (resultA.made) {
                scoreA += resultA.points;
                streakA = Math.max(1, streakA + 1);
            } else {
                streakA = Math.min(-1, streakA - 1);
                // Check for offensive rebound
                if (checkOffensiveRebound(teamA, teamB)) {
                    // Extra possession - take another shot
                    const reboundShot = simulateShot(teamA, teamB, shotsA, streakA);
                    shotsA++;
                    if (reboundShot.made) {
                        scoreA += reboundShot.points;
                        streakA = Math.max(1, streakA + 1);
                    } else {
                        streakA = Math.min(-1, streakA - 1);
                    }
                }
            }
        } else {
            // Turnover - streak reset towards negative
            streakA = Math.min(0, streakA - 1);
        }

        // Team B possession
        if (!checkTurnover(teamB)) {
            const resultB = simulateShot(teamB, teamA, shotsB, streakB);
            shotsB++;

            if (resultB.made) {
                scoreB += resultB.points;
                streakB = Math.max(1, streakB + 1);
            } else {
                streakB = Math.min(-1, streakB - 1);
                // Check for offensive rebound
                if (checkOffensiveRebound(teamB, teamA)) {
                    // Extra possession - take another shot
                    const reboundShot = simulateShot(teamB, teamA, shotsB, streakB);
                    shotsB++;
                    if (reboundShot.made) {
                        scoreB += reboundShot.points;
                        streakB = Math.max(1, streakB + 1);
                    } else {
                        streakB = Math.min(-1, streakB - 1);
                    }
                }
            }
        } else {
            // Turnover - streak reset towards negative
            streakB = Math.min(0, streakB - 1);
        }

        onScoreUpdate({
            scoreA,
            scoreB,
            inOvertime
        });

        setTimeout(simulatePossession, gameSpeed);
    }

    simulatePossession();
}
