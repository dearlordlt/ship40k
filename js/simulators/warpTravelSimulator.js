import { DiceRoller } from '../utils/diceRoller.js';
import { WARP_EVENTS } from '../config/constants.js';
import { WARP_RULES } from '../config/gameRules.js';

export class WarpTravelSimulator {
    constructor(ship) {
        this.ship = ship;
        this.currentJourney = null;
        this.eventLog = [];
        this.gellarFieldStatus = WARP_RULES.GELLAR_FIELD_STATUS.STABLE;
        this.navigationDifficulty = WARP_RULES.NAVIGATION_DIFFICULTY.CALM;
    }

    /**
     * Initialize a new warp journey
     * @param {Object} params Journey parameters
     * @returns {Object} Initial journey state
     */
    initializeJourney(params) {
        const {
            destination,
            estimatedDuration, // in days
            navigationModifier = 0
        } = params;

        this.currentJourney = {
            destination,
            estimatedDuration,
            actualDuration: estimatedDuration,
            navigationModifier,
            currentDay: 0,
            status: 'preparing',
            events: [],
            gellarFieldFluctuations: 0,
            crewLosses: 0,
            durationChanges: [] // Track reasons for duration changes
        };

        // Initial Gellar Field check
        const gellarFieldCheck = this.checkGellarField();
        if (!gellarFieldCheck.stable) {
            this.logEvent('gellar_field_warning', {
                message: 'Gellar Field showing signs of instability before journey',
                severity: gellarFieldCheck.severity
            });
        }

        return this.getJourneyState();
    }

    /**
     * Simulate one day of warp travel
     * @returns {Object} Results of the day's events
     */
    simulateDay() {
        if (!this.currentJourney || this.currentJourney.status === 'completed') {
            throw new Error('No active warp journey');
        }

        const dayResults = {
            day: ++this.currentJourney.currentDay,
            events: [],
            gellarFieldStatus: this.gellarFieldStatus,
            navigationStatus: this.navigationDifficulty
        };

        // Update journey status
        this.currentJourney.status = 'in_progress';

        // Check for warp events
        const warpEvent = this.generateWarpEvent();
        if (warpEvent) {
            dayResults.events.push(warpEvent);
            this.handleWarpEvent(warpEvent);
        }

        // Check Gellar Field status
        const gellarFieldCheck = this.checkGellarField();
        if (!gellarFieldCheck.stable) {
            dayResults.events.push({
                type: 'gellar_field_fluctuation',
                severity: gellarFieldCheck.severity,
                effect: gellarFieldCheck.effect
            });
            this.handleGellarFieldFluctuation(gellarFieldCheck);
        }

        // Navigation check
        const navigationCheck = this.performNavigationCheck();
        dayResults.navigationCheck = navigationCheck;
        this.handleNavigationResult(navigationCheck);

        // Check if journey should end
        if (this.shouldEndJourney()) {
            this.completeJourney();
            dayResults.journeyCompleted = true;
        }

        // Log day's events
        this.logEvent('day_summary', {
            day: this.currentJourney.currentDay,
            events: dayResults.events,
            status: this.getJourneyState()
        });

        return dayResults;
    }

    /**
     * Generate a random warp event
     * @returns {Object|null} Generated event or null
     */
    generateWarpEvent() {
        const eventRoll = DiceRoller.rollDie(100);
        const events = Object.values(WARP_EVENTS);
        let probabilitySum = 0;

        for (const event of events) {
            probabilitySum += event.probability;
            if (eventRoll <= probabilitySum) {
                return {
                    ...event,
                    severity: this.calculateEventSeverity()
                };
            }
        }

        return null;
    }

    /**
     * Calculate severity of an event
     * @returns {string} Severity level
     */
    calculateEventSeverity() {
        const roll = DiceRoller.rollDie(100);
        if (roll <= 50) return 'minor';
        if (roll <= 80) return 'moderate';
        if (roll <= 95) return 'major';
        return 'catastrophic';
    }

    /**
     * Handle a warp event's effects
     * @param {Object} event The event to handle
     */
    handleWarpEvent(event) {
        const oldDuration = this.currentJourney.actualDuration;
        
        switch (event.name) {
            case 'Calm Warp':
                this.currentJourney.actualDuration *= 0.9;
                this.currentJourney.durationChanges.push({
                    event: event.name,
                    change: 'decrease',
                    amount: Math.round(oldDuration - this.currentJourney.actualDuration)
                });
                break;
            case 'Warp Storm':
                this.currentJourney.actualDuration *= 1.2;
                this.navigationDifficulty = WARP_RULES.NAVIGATION_DIFFICULTY.STORMY;
                this.currentJourney.durationChanges.push({
                    event: event.name,
                    change: 'increase',
                    amount: Math.round(this.currentJourney.actualDuration - oldDuration)
                });
                break;
            case 'Whispers in the Void':
                this.ship.status.crewMorale -= 5;
                break;
            case 'Shadow Sighting':
                this.navigationDifficulty = WARP_RULES.NAVIGATION_DIFFICULTY.TROUBLED;
                break;
            case 'Minor Breach':
                this.handleCrewCasualties(event.severity);
                break;
        }
    }

    /**
     * Check Gellar Field status
     * @returns {Object} Gellar Field check results
     */
    checkGellarField() {
        const gellarFieldStrength = this.getGellarFieldStrength();
        const stabilityRoll = DiceRoller.rollDie(100);

        if (stabilityRoll > gellarFieldStrength) {
            const severity = this.calculateGellarFieldFailureSeverity(gellarFieldStrength - stabilityRoll);
            return {
                stable: false,
                severity,
                effect: WARP_RULES.GELLAR_FIELD_STATUS[severity.toUpperCase()].effect
            };
        }

        return {
            stable: true,
            severity: 'STABLE',
            effect: WARP_RULES.GELLAR_FIELD_STATUS.STABLE.effect
        };
    }

    /**
     * Calculate Gellar Field failure severity
     * @param {number} stabilityDifference Difference between roll and strength
     * @returns {string} Severity level
     */
    calculateGellarFieldFailureSeverity(stabilityDifference) {
        if (stabilityDifference > -10) return 'FLUCTUATING';
        if (stabilityDifference > -25) return 'UNSTABLE';
        return 'FAILING';
    }

    /**
     * Handle Gellar Field fluctuation effects
     * @param {Object} checkResult Results of Gellar Field check
     */
    handleGellarFieldFluctuation(checkResult) {
        this.currentJourney.gellarFieldFluctuations++;

        switch (checkResult.severity) {
            case 'FLUCTUATING':
                // Minor effect
                if (DiceRoller.rollDie(100) <= 10) {
                    this.handleCrewCasualties('minor');
                }
                break;
            case 'UNSTABLE':
                // Moderate effect
                this.handleCrewCasualties('moderate');
                break;
            case 'FAILING':
                // Severe effect
                this.handleCrewCasualties('major');
                this.ship.status.gellarField -= 10;
                break;
        }
    }

    /**
     * Perform navigation check
     * @returns {Object} Navigation check results
     */
    performNavigationCheck() {
        const baseSkill = 50; // Base navigation skill
        const modifier = this.currentJourney.navigationModifier;
        const difficulty = this.navigationDifficulty.difficulty;

        const checkResult = DiceRoller.checkRoll(
            baseSkill + modifier - difficulty,
            0,
            100
        );

        return {
            success: checkResult.success,
            roll: checkResult.roll,
            target: checkResult.target,
            margin: checkResult.margin,
            critical: checkResult.criticalSuccess || checkResult.criticalFailure
        };
    }

    /**
     * Handle navigation check results
     * @param {Object} navigationCheck Navigation check results
     */
    handleNavigationResult(navigationCheck) {
        const oldDuration = this.currentJourney.actualDuration;

        if (navigationCheck.success) {
            if (navigationCheck.critical) {
                // Excellent navigation reduces journey time
                this.currentJourney.actualDuration *= 0.9;
                this.currentJourney.durationChanges.push({
                    event: 'Critical Navigation Success',
                    change: 'decrease',
                    amount: Math.round(oldDuration - this.currentJourney.actualDuration)
                });
            }
        } else {
            if (navigationCheck.critical) {
                // Critical failure increases journey time significantly
                this.currentJourney.actualDuration *= 1.5;
                this.navigationDifficulty = WARP_RULES.NAVIGATION_DIFFICULTY.TEMPESTUOUS;
                this.currentJourney.durationChanges.push({
                    event: 'Critical Navigation Failure',
                    change: 'increase',
                    amount: Math.round(this.currentJourney.actualDuration - oldDuration)
                });
            } else {
                // Normal failure increases journey time slightly
                this.currentJourney.actualDuration *= 1.1;
                this.currentJourney.durationChanges.push({
                    event: 'Navigation Failure',
                    change: 'increase',
                    amount: Math.round(this.currentJourney.actualDuration - oldDuration)
                });
            }
        }
    }

    /**
     * Handle crew casualties
     * @param {string} severity Severity of the event causing casualties
     */
    handleCrewCasualties(severity) {
        const baseCasualties = {
            minor: 0.001, // 0.1%
            moderate: 0.005, // 0.5%
            major: 0.02, // 2%
            catastrophic: 0.05 // 5%
        }[severity];

        const casualties = Math.floor(this.ship.crew.current * baseCasualties);
        this.ship.crew.current = Math.max(0, this.ship.crew.current - casualties);
        this.ship.crew.casualties += casualties;
        this.currentJourney.crewLosses += casualties;
    }

    /**
     * Get current Gellar Field strength
     * @returns {number} Current Gellar Field strength
     */
    getGellarFieldStrength() {
        const baseStrength = this.ship.status.gellarField;
        const warpEngines = this.ship.components.essential.find(c => c.id === 'warp_engine');
        return baseStrength * (warpEngines ? warpEngines.stats.gellarFieldStrength / 100 : 1);
    }

    /**
     * Check if journey should end
     * @returns {boolean} Whether the journey should end
     */
    shouldEndJourney() {
        return this.currentJourney.currentDay >= Math.ceil(this.currentJourney.actualDuration) ||
               this.ship.crew.current <= 0 ||
               this.ship.status.gellarField <= 0;
    }

    /**
     * Complete the current journey
     */
    completeJourney() {
        this.currentJourney.status = 'completed';
        
        // Generate duration summary
        const durationDiff = this.currentJourney.currentDay - this.currentJourney.estimatedDuration;
        const durationSummary = this.currentJourney.durationChanges.map(change => 
            `${change.event}: ${change.change === 'increase' ? 'Added' : 'Reduced'} ${change.amount} days`
        ).join('\n');

        this.logEvent('journey_complete', {
            destination: this.currentJourney.destination,
            estimatedDuration: this.currentJourney.estimatedDuration,
            actualDuration: this.currentJourney.currentDay,
            durationDifference: durationDiff,
            durationSummary,
            crewLosses: this.currentJourney.crewLosses,
            gellarFieldFluctuations: this.currentJourney.gellarFieldFluctuations
        });
    }

    /**
     * Log a warp travel event
     * @param {string} type Event type
     * @param {Object} data Event data
     */
    logEvent(type, data) {
        const event = {
            timestamp: new Date().toISOString(),
            type,
            ...data
        };
        this.eventLog.push(event);
        if (this.currentJourney) {
            this.currentJourney.events.push(event);
        }
    }

    /**
     * Get current journey state
     * @returns {Object} Current journey state
     */
    getJourneyState() {
        const journeyState = {
            ...this.currentJourney,
            shipStatus: this.ship.getStatus(),
            gellarFieldStatus: {
                status: this.gellarFieldStatus.status || 'STABLE',
                effect: this.gellarFieldStatus.effect || WARP_RULES.GELLAR_FIELD_STATUS.STABLE.effect
            },
            navigationDifficulty: this.navigationDifficulty
        };

        // Add duration change explanation if different from estimated
        if (this.currentJourney && this.currentJourney.actualDuration !== this.currentJourney.estimatedDuration) {
            const durationDiff = this.currentJourney.actualDuration - this.currentJourney.estimatedDuration;
            journeyState.durationChangeReason = durationDiff > 0 
                ? `Journey extended by ${Math.round(durationDiff)} days due to warp anomalies and navigation challenges.`
                : `Journey shortened by ${Math.abs(Math.round(durationDiff))} days due to favorable conditions and skilled navigation.`;
        }

        return journeyState;
    }
}
