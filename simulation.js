export let scoreA = 0;
export let scoreB = 0;
let gameActive = false;
let gameSpeed = 100;
let inOvertime = false;

export function getTeamStats(team) {
    let offenseSum = 0, defenseSum = 0, balanceSum = 0;
    const teamSlots = document.querySelectorAll(`[data-slot^="${team}"] img`);

    teamSlots.forEach(img => {
        const player = players.find(p => p.image.includes(img.dataset.id));
        if (player) {
            offenseSum += player.offense || 0;
            defenseSum += player.defense || 0;
            balanceSum += player.aggressive || 0;
        }
    });
    return { 
        offense: offenseSum, 
        defense: defenseSum, 
        balance: balanceSum / 5  // Normalize to 0-5 scale
    };
}

export function simulateGame() {
    if (gameActive) return;
    gameActive = true;
    inOvertime = false;
    scoreA = 0;
    scoreB = 0;
    document.getElementById('result').innerText = 'Game started!';
    document.getElementById('overtime').style.display = 'none';

    const teamAStats = getTeamStats('team1');
    const teamBStats = getTeamStats('team2');

    simulatePossession(teamAStats, teamBStats);
}

function simulatePossession(teamA, teamB) {
    if ((scoreA >= 15 || scoreB >= 15) && Math.abs(scoreA - scoreB) >= 2) {
        announceResult();
        return;
    }

    if ((scoreA >= 15 || scoreB >= 15) && Math.abs(scoreA - scoreB) < 2) {
        inOvertime = true;
        document.getElementById('overtime').style.display = 'block';
    }

    scoreA += simulateShot(teamA, teamB);
    scoreB += simulateShot(teamB, teamA);

    document.getElementById('result').innerText = `Ringers: ${scoreA} - Ballers: ${scoreB}`;
    setTimeout(() => simulatePossession(teamA, teamB), gameSpeed);
}

function simulateShot(team, opponent) {
    const shoot2ptProb = 0.4;
    const baseMake2ptProb = 0.35;
    const baseMake1ptProb = 0.7;

    let make2ptProb = baseMake2ptProb + (team.offense - opponent.defense) * 0.05;
    let make1ptProb = baseMake1ptProb + (team.offense - opponent.defense) * 0.05;

    const balanceFactor = team.balance;
    make2ptProb = balanceAdjusted(make2ptProb, balanceFactor);
    make1ptProb = balanceAdjusted(make1ptProb, balanceFactor);

    return Math.random() < shoot2ptProb ? (Math.random() < make2ptProb ? 2 : 0) : (Math.random() < make1ptProb ? 1 : 0);
}

function balanceAdjusted(prob, balanceFactor) {
    const average = 0.5;
    return prob * balanceFactor + average * (1 - balanceFactor);
}

function announceResult() {
    if (scoreA > scoreB) {
        document.getElementById('result').innerText += '\nRingers win!';
    } else {
        document.getElementById('result').innerText += '\nBallers win!';
    }
    gameActive = false;
}
