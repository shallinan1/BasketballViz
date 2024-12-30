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
    
    function simulateShot(team, opponent) {
        const shoot2ptProb = 0.4;
        const baseMake2ptProb = 0.35;
        const baseMake1ptProb = 0.7;

        let make2ptProb = baseMake2ptProb + (team.offense - opponent.defense) * 0.05;
        let make1ptProb = baseMake1ptProb + (team.offense - opponent.defense) * 0.05;

        const balanceFactor = team.balance / 5;
        make2ptProb = balanceAdjusted(make2ptProb, balanceFactor);
        make1ptProb = balanceAdjusted(make1ptProb, balanceFactor);

        if (Math.random() < shoot2ptProb) {
            return Math.random() < make2ptProb ? 2 : 0;
        }
        return Math.random() < make1ptProb ? 1 : 0;
    }

    function balanceAdjusted(prob, balanceFactor) {
        const average = 0.5;
        return prob * balanceFactor + average * (1 - balanceFactor);
    }

    function simulatePossession() {
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