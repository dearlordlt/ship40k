export class DiceRoller {
    /**
     * Roll a number of dice with a specified number of sides
     * @param {number} count - Number of dice to roll
     * @param {number} sides - Number of sides on each die
     * @param {boolean} exploding - Whether dice that roll maximum value should be rerolled and added
     * @returns {Object} Result containing total and individual rolls
     */
    static roll(count = 1, sides = 6, exploding = false) {
        const rolls = [];
        let total = 0;

        for (let i = 0; i < count; i++) {
            let dieTotal = 0;
            let currentRoll = this.rollDie(sides);
            dieTotal += currentRoll;

            // Handle exploding dice
            if (exploding) {
                while (currentRoll === sides) {
                    currentRoll = this.rollDie(sides);
                    dieTotal += currentRoll;
                }
            }

            rolls.push(dieTotal);
            total += dieTotal;
        }

        return {
            total,
            rolls,
            average: total / count,
            highest: Math.max(...rolls),
            lowest: Math.min(...rolls)
        };
    }

    /**
     * Roll a single die
     * @param {number} sides - Number of sides on the die
     * @returns {number} Result of the roll
     */
    static rollDie(sides) {
        return Math.floor(Math.random() * sides) + 1;
    }

    /**
     * Roll with advantage (take highest of multiple rolls)
     * @param {number} count - Number of dice to roll
     * @param {number} sides - Number of sides on each die
     * @returns {Object} Result of the best roll
     */
    static rollWithAdvantage(count = 2, sides = 6) {
        const rolls = [];
        for (let i = 0; i < count; i++) {
            rolls.push(this.rollDie(sides));
        }
        return {
            total: Math.max(...rolls),
            rolls,
            advantage: true
        };
    }

    /**
     * Roll with disadvantage (take lowest of multiple rolls)
     * @param {number} count - Number of dice to roll
     * @param {number} sides - Number of sides on each die
     * @returns {Object} Result of the worst roll
     */
    static rollWithDisadvantage(count = 2, sides = 6) {
        const rolls = [];
        for (let i = 0; i < count; i++) {
            rolls.push(this.rollDie(sides));
        }
        return {
            total: Math.min(...rolls),
            rolls,
            disadvantage: true
        };
    }

    /**
     * Check if a roll succeeds against a target number
     * @param {number} target - Target number to beat or equal
     * @param {number} modifier - Modifier to add to the roll
     * @param {number} sides - Number of sides on the die
     * @returns {Object} Result containing success/failure and roll details
     */
    static checkRoll(target, modifier = 0, sides = 100) {
        const roll = this.rollDie(sides);
        const total = roll + modifier;
        const margin = total - target;

        return {
            success: total >= target,
            roll,
            modifier,
            total,
            target,
            margin,
            criticalSuccess: roll === sides,
            criticalFailure: roll === 1
        };
    }

    /**
     * Generate a random event based on probability weights
     * @param {Array} events - Array of event objects with name and weight properties
     * @returns {Object} Selected event
     */
    static generateRandomEvent(events) {
        const totalWeight = events.reduce((sum, event) => sum + (event.weight || 1), 0);
        let random = Math.random() * totalWeight;

        for (const event of events) {
            random -= (event.weight || 1);
            if (random <= 0) {
                return event;
            }
        }

        return events[events.length - 1]; // Fallback to last event
    }

    /**
     * Generate multiple dice roll results for complex tests
     * @param {Object} params - Test parameters
     * @returns {Object} Test results
     */
    static complexTest(params) {
        const {
            primaryDice = { count: 1, sides: 6 },
            secondaryDice = { count: 0, sides: 6 },
            target = 0,
            modifier = 0,
            criticalThreshold = primaryDice.sides
        } = params;

        const primaryRoll = this.roll(primaryDice.count, primaryDice.sides);
        const secondaryRoll = secondaryDice.count > 0 
            ? this.roll(secondaryDice.count, secondaryDice.sides)
            : null;

        const total = primaryRoll.total + (secondaryRoll?.total || 0) + modifier;
        const success = total >= target;
        const critical = primaryRoll.rolls.some(roll => roll >= criticalThreshold);

        return {
            success,
            critical,
            total,
            primaryRoll,
            secondaryRoll,
            modifier,
            target,
            margin: total - target
        };
    }

    /**
     * Generate a sequence of related rolls (e.g., for extended tests)
     * @param {Object} params - Sequence parameters
     * @returns {Array} Array of roll results
     */
    static rollSequence(params) {
        const {
            rounds = 1,
            dicePerRound = { count: 1, sides: 6 },
            target = 0,
            modifier = 0,
            successesNeeded = 1
        } = params;

        const results = [];
        let totalSuccesses = 0;

        for (let i = 0; i < rounds && totalSuccesses < successesNeeded; i++) {
            const roundRoll = this.roll(dicePerRound.count, dicePerRound.sides);
            const total = roundRoll.total + modifier;
            const success = total >= target;

            if (success) totalSuccesses++;

            results.push({
                round: i + 1,
                roll: roundRoll,
                total,
                success,
                modifier,
                target
            });
        }

        return {
            sequence: results,
            totalSuccesses,
            completed: totalSuccesses >= successesNeeded,
            roundsUsed: results.length
        };
    }
}
