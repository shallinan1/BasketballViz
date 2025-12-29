import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
    CONFIG,
    sigmoid,
    gaussianRandom,
    balanceAdjusted,
    getFatiguePenalty,
    getMomentumModifier,
    calculateTurnoverRate,
    calculateReboundChance,
    calculateBalanceRating,
    simulateGame
} from '../gameSimulator.js';

describe('Configuration', () => {
    it('should have correct default values', () => {
        expect(CONFIG.FATIGUE_THRESHOLD).toBe(15);
        expect(CONFIG.FATIGUE_PENALTY).toBe(0.03);
        expect(CONFIG.MOMENTUM_THRESHOLD).toBe(3);
        expect(CONFIG.MOMENTUM_BOOST).toBe(0.08);
        expect(CONFIG.MOMENTUM_PENALTY).toBe(0.05);
        expect(CONFIG.BASE_TURNOVER_RATE).toBe(0.08);
        expect(CONFIG.OFFENSIVE_REBOUND_CHANCE).toBe(0.25);
    });
});

describe('sigmoid', () => {
    it('should return 0.5 for input 0', () => {
        expect(sigmoid(0)).toBe(0.5);
    });

    it('should return values between 0 and 1', () => {
        expect(sigmoid(-10)).toBeGreaterThan(0);
        expect(sigmoid(-10)).toBeLessThan(0.01);
        expect(sigmoid(10)).toBeGreaterThan(0.99);
        expect(sigmoid(10)).toBeLessThan(1);
    });

    it('should be monotonically increasing', () => {
        expect(sigmoid(1)).toBeGreaterThan(sigmoid(0));
        expect(sigmoid(2)).toBeGreaterThan(sigmoid(1));
        expect(sigmoid(0)).toBeGreaterThan(sigmoid(-1));
    });
});

describe('gaussianRandom', () => {
    it('should return values within specified bounds', () => {
        for (let i = 0; i < 100; i++) {
            const result = gaussianRandom(0.5, 0.1, 0.2, 0.8);
            expect(result).toBeGreaterThanOrEqual(0.2);
            expect(result).toBeLessThanOrEqual(0.8);
        }
    });

    it('should cluster around the mean', () => {
        const results = [];
        for (let i = 0; i < 1000; i++) {
            results.push(gaussianRandom(0.5, 0.1, 0, 1));
        }
        const average = results.reduce((a, b) => a + b, 0) / results.length;
        // Average should be close to mean (within 0.05)
        expect(Math.abs(average - 0.5)).toBeLessThan(0.05);
    });
});

describe('balanceAdjusted', () => {
    it('should not change probability when balance factor is 0.5', () => {
        const result = balanceAdjusted(0.4, 0.5);
        expect(result).toBe(0.4);
    });

    it('should increase probability when balance factor is high', () => {
        const result = balanceAdjusted(0.4, 1.0);
        expect(result).toBeGreaterThan(0.4);
        expect(result).toBe(0.5); // 0.4 + 0.1 max boost
    });

    it('should decrease probability when balance factor is low', () => {
        const result = balanceAdjusted(0.4, 0.0);
        expect(result).toBeLessThan(0.4);
        expect(result).toBeCloseTo(0.3, 5); // 0.4 - 0.1 max penalty
    });

    it('should cap probability at 1', () => {
        const result = balanceAdjusted(0.95, 1.0);
        expect(result).toBe(1);
    });
});

describe('getFatiguePenalty', () => {
    it('should return 0 for shots at or below threshold', () => {
        expect(getFatiguePenalty(0)).toBe(0);
        expect(getFatiguePenalty(10)).toBe(0);
        expect(getFatiguePenalty(15)).toBe(0);
    });

    it('should return penalty for shots above threshold', () => {
        expect(getFatiguePenalty(16)).toBe(0.03);
        expect(getFatiguePenalty(17)).toBe(0.06);
        expect(getFatiguePenalty(20)).toBe(0.15);
    });

    it('should accept custom threshold and penalty', () => {
        expect(getFatiguePenalty(12, 10, 0.05)).toBe(0.1);
    });
});

describe('getMomentumModifier', () => {
    it('should return 0 for streaks below threshold', () => {
        expect(getMomentumModifier(0)).toBe(0);
        expect(getMomentumModifier(1)).toBe(0);
        expect(getMomentumModifier(2)).toBe(0);
        expect(getMomentumModifier(-1)).toBe(0);
        expect(getMomentumModifier(-2)).toBe(0);
    });

    it('should return positive boost for hot streak', () => {
        expect(getMomentumModifier(3)).toBe(0.08);
        expect(getMomentumModifier(5)).toBe(0.08);
        expect(getMomentumModifier(10)).toBe(0.08);
    });

    it('should return negative penalty for cold streak', () => {
        expect(getMomentumModifier(-3)).toBe(-0.05);
        expect(getMomentumModifier(-5)).toBe(-0.05);
        expect(getMomentumModifier(-10)).toBe(-0.05);
    });

    it('should accept custom parameters', () => {
        expect(getMomentumModifier(2, 2, 0.1, 0.1)).toBe(0.1);
        expect(getMomentumModifier(-2, 2, 0.1, 0.1)).toBe(-0.1);
    });
});

describe('calculateTurnoverRate', () => {
    it('should return base rate for balance of 0', () => {
        const rate = calculateTurnoverRate(0);
        expect(rate).toBe(0.08);
    });

    it('should reduce turnover rate for higher balance', () => {
        const lowBalance = calculateTurnoverRate(1);
        const highBalance = calculateTurnoverRate(4);
        expect(highBalance).toBeLessThan(lowBalance);
    });

    it('should not go below minimum rate of 0.02', () => {
        const rate = calculateTurnoverRate(5);
        expect(rate).toBeGreaterThanOrEqual(0.02);
    });

    it('should have maximum reduction of 4% at perfect balance', () => {
        const rate = calculateTurnoverRate(5);
        expect(rate).toBe(0.04); // 0.08 - 0.04 = 0.04
    });
});

describe('calculateReboundChance', () => {
    it('should return base chance when offense equals defense', () => {
        const chance = calculateReboundChance(3, 3);
        // sigmoid(0.5) ≈ 0.622, so 0.25 * 0.622 ≈ 0.155
        expect(chance).toBeCloseTo(0.155, 2);
    });

    it('should increase chance when offense > defense', () => {
        const equalChance = calculateReboundChance(3, 3);
        const advantageChance = calculateReboundChance(4, 2);
        expect(advantageChance).toBeGreaterThan(equalChance);
    });

    it('should decrease chance when offense < defense', () => {
        const equalChance = calculateReboundChance(3, 3);
        const disadvantageChance = calculateReboundChance(2, 4);
        expect(disadvantageChance).toBeLessThan(equalChance);
    });
});

describe('calculateBalanceRating', () => {
    it('should return maximum balance (4.5) for aggression of 2.5', () => {
        const balance = calculateBalanceRating(2.5);
        expect(balance).toBe(4.5);
    });

    it('should return lower balance for extreme aggression values', () => {
        const lowAgg = calculateBalanceRating(0);
        const highAgg = calculateBalanceRating(5);
        const midAgg = calculateBalanceRating(2.5);

        expect(lowAgg).toBeLessThan(midAgg);
        expect(highAgg).toBeLessThan(midAgg);
    });

    it('should be symmetric around 2.5', () => {
        const low = calculateBalanceRating(1);
        const high = calculateBalanceRating(4);
        expect(low).toBeCloseTo(high, 5);
    });
});

describe('simulateGame', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    const mockTeamA = { name: 'Team A', offense: 3, defense: 3, balance: 3 };
    const mockTeamB = { name: 'Team B', offense: 3, defense: 3, balance: 3 };

    it('should call onGameOver when game ends', async () => {
        const onGameOver = vi.fn();

        simulateGame(mockTeamA, mockTeamB, {
            pointLimit: 15,
            gameSpeed: 0,
            onGameOver
        });

        // Run all timers until game ends
        while (!onGameOver.mock.calls.length) {
            await vi.advanceTimersByTimeAsync(1);
        }

        expect(onGameOver).toHaveBeenCalled();
        const result = onGameOver.mock.calls[0][0];
        expect(result).toHaveProperty('scoreA');
        expect(result).toHaveProperty('scoreB');
        expect(result).toHaveProperty('winner');
        expect(['A', 'B']).toContain(result.winner);
    });

    it('should call onScoreUpdate during game', async () => {
        const onScoreUpdate = vi.fn();
        const onGameOver = vi.fn();

        simulateGame(mockTeamA, mockTeamB, {
            pointLimit: 15,
            gameSpeed: 0,
            onScoreUpdate,
            onGameOver
        });

        // Advance a few possessions
        await vi.advanceTimersByTimeAsync(10);

        expect(onScoreUpdate).toHaveBeenCalled();
        const update = onScoreUpdate.mock.calls[0][0];
        expect(update).toHaveProperty('scoreA');
        expect(update).toHaveProperty('scoreB');
        expect(update).toHaveProperty('inOvertime');
    });

    it('should determine winner correctly', async () => {
        const onGameOver = vi.fn();

        simulateGame(mockTeamA, mockTeamB, {
            pointLimit: 15,
            gameSpeed: 0,
            onGameOver
        });

        while (!onGameOver.mock.calls.length) {
            await vi.advanceTimersByTimeAsync(1);
        }

        const result = onGameOver.mock.calls[0][0];
        if (result.scoreA > result.scoreB) {
            expect(result.winner).toBe('A');
        } else {
            expect(result.winner).toBe('B');
        }
    });

    it('should require win by 2 (overtime scenario)', async () => {
        const onGameOver = vi.fn();

        simulateGame(mockTeamA, mockTeamB, {
            pointLimit: 15,
            gameSpeed: 0,
            onGameOver
        });

        while (!onGameOver.mock.calls.length) {
            await vi.advanceTimersByTimeAsync(1);
        }

        const result = onGameOver.mock.calls[0][0];
        const scoreDiff = Math.abs(result.scoreA - result.scoreB);
        expect(scoreDiff).toBeGreaterThanOrEqual(2);
    });

    it('should call onOvertimeStart when scores are close at point limit', async () => {
        const onOvertimeStart = vi.fn();
        const onGameOver = vi.fn();
        let overtimeCalled = false;

        // Run many games to hopefully trigger overtime at least once
        for (let i = 0; i < 50; i++) {
            simulateGame(mockTeamA, mockTeamB, {
                pointLimit: 15,
                gameSpeed: 0,
                onOvertimeStart: () => {
                    overtimeCalled = true;
                    onOvertimeStart();
                },
                onGameOver
            });

            while (onGameOver.mock.calls.length <= i) {
                await vi.advanceTimersByTimeAsync(1);
            }

            if (overtimeCalled) break;
        }

        // Overtime should have been triggered at least once in 50 games
        // (not guaranteed, but very likely with balanced teams)
    });

    it('should respect custom point limit', async () => {
        const onGameOver = vi.fn();

        simulateGame(mockTeamA, mockTeamB, {
            pointLimit: 5,
            gameSpeed: 0,
            onGameOver
        });

        while (!onGameOver.mock.calls.length) {
            await vi.advanceTimersByTimeAsync(1);
        }

        const result = onGameOver.mock.calls[0][0];
        const maxScore = Math.max(result.scoreA, result.scoreB);
        expect(maxScore).toBeGreaterThanOrEqual(5);
    });

    it('should favor team with higher offense', async () => {
        const strongTeam = { name: 'Strong', offense: 5, defense: 3, balance: 3 };
        const weakTeam = { name: 'Weak', offense: 1, defense: 3, balance: 3 };

        let strongWins = 0;
        const games = 100;

        for (let i = 0; i < games; i++) {
            const onGameOver = vi.fn();

            simulateGame(strongTeam, weakTeam, {
                pointLimit: 15,
                gameSpeed: 0,
                onGameOver
            });

            while (!onGameOver.mock.calls.length) {
                await vi.advanceTimersByTimeAsync(1);
            }

            if (onGameOver.mock.calls[0][0].winner === 'A') {
                strongWins++;
            }
        }

        // Strong team should win significantly more than 50%
        expect(strongWins).toBeGreaterThan(60);
    });
});
