// gameSimulator.js
import { players } from './players.js';  // Add this import at the top

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
                offense += player.offense || 0;
                defense += player.defense || 0;
                aggressive += player.aggressive || 0;
                playerCount++;
            }
        }
    });

    // Only return ratings if team is complete
    if (playerCount === 5) {
        return {
            offense: offense,
            defense: defense,
            balance: 5 - ((Math.abs(2.5 - aggressive) + 0.25) * 2)
        };
    }
    return null;
}

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
    
    function gaussianRandom(mean = 0, stdDev = 1, min = -Infinity, max = Infinity) {
        let result;
        do {
            let u1 = Math.random();
            let u2 = Math.random();
            let z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
            result = z0 * stdDev + mean;
        } while (result < min || result > max);
        
        return result;
    }

    function sigmoid(x) {
        return 1 / (1 + Math.exp(-x));
    }
    
    function simulateShot(team, opponent) {
        console.log(team)
        const shoot2ptProb = 0.4;
        const baseMake2ptProb = 0.2;
        const baseMake1ptProb = 0.4;

        let make2ptProb = gaussianRandom(baseMake2ptProb, 0.025, 0.1, 0.5);
        let make1ptProb = gaussianRandom(baseMake1ptProb, 0.05, 0.1, 0.6);
        
        console.log("old 1pt prob", make1ptProb)
        console.log("old 2pt prob", make2ptProb)
        console.log("\n")
 
        make2ptProb = make2ptProb * 2 * sigmoid(team.offense - opponent.defense)
        make1ptProb = make1ptProb * 2 * sigmoid(team.offense - opponent.defense)
        console.log("1pt prob", make1ptProb)
        console.log("2pt prob", make2ptProb)
        console.log("\n")

        const balanceFactor = team.balance / 5;
        make2ptProb = balanceAdjusted(make2ptProb, balanceFactor);
        make1ptProb = balanceAdjusted(make1ptProb, balanceFactor);
       
        console.log("final 1pt prob", make1ptProb)
        console.log("final 2pt prob", make2ptProb)
        console.log("\n")
        if (Math.random() < shoot2ptProb) {
            return Math.random() < make2ptProb ? 2 : 0;
        }
        return Math.random() < make1ptProb ? 1 : 0;
    }

    function balanceAdjusted(prob, balanceFactor) {
        const average = 0.5;
        return Math.min(1, prob * (average + balanceFactor));
    }

    function simulatePossession() {
        if ((scoreA >= pointLimit || scoreB >= pointLimit) && Math.abs(scoreA - scoreB) < 2) {
            if (!inOvertime) {
                inOvertime = true;
                onOvertimeStart();
            }
        }
        console.log("114")
        console.log(scoreA)
        console.log(scoreB)
        console.log(scoreA >= pointLimit)
        console.log(scoreB >= pointLimit)
        console.log( Math.abs(scoreA - scoreB))
        if ((scoreA >= pointLimit || scoreB >= pointLimit) && Math.abs(scoreA - scoreB) >= 2) {
            console.log(`Game Over: ${scoreA} - ${scoreB}`);
            onGameOver({
                scoreA,
                scoreB,
                winner: scoreA > scoreB ? 'A' : 'B'
            });
            return;
        }
        console.log("123")

        scoreA += simulateShot(teamA, teamB);
        scoreB += simulateShot(teamB, teamA);

        onScoreUpdate({
            scoreA,
            scoreB,
            inOvertime
        });

        setTimeout(simulatePossession, gameSpeed);
    }

    simulatePossession();
}