import { DiceRoller } from '../utils/diceRoller.js';
import { COMBAT_EFFECTS } from '../config/constants.js';
import { COMBAT_RULES } from '../config/gameRules.js';

export class CombatSimulator {
    constructor(playerShip, enemyShip) {
        this.playerShip = playerShip;
        this.enemyShip = enemyShip;
        this.turn = 1;
        this.combatLog = [];
        this.currentPhase = 0;
        this.ranges = COMBAT_RULES.RANGE_BRACKETS;
        this.currentRange = 'MEDIUM';
    }

    /**
     * Initialize a new combat encounter
     * @returns {Object} Initial combat state
     */
    initializeCombat() {
        this.logEvent('combat_start', {
            message: `Combat initiated between ${this.playerShip.name} and ${this.enemyShip.name}`,
            playerShip: this.playerShip.name,
            enemyShip: this.enemyShip.name
        });

        return {
            turn: this.turn,
            range: this.currentRange,
            playerStatus: this.playerShip.getStatus(),
            enemyStatus: this.enemyShip.getStatus(),
            log: this.combatLog
        };
    }

    /**
     * Execute a full combat turn
     * @returns {Object} Results of the turn
     */
    executeTurn() {
        const turnResults = {
            turn: this.turn,
            phases: [],
            criticalEffects: [],
            casualties: {
                player: 0,
                enemy: 0
            }
        };

        // Execute each phase in order
        for (const phase of COMBAT_RULES.COMBAT_PHASES) {
            const phaseResult = this.executePhase(phase);
            turnResults.phases.push(phaseResult);

            // Check for critical effects
            if (phaseResult.criticalEffects) {
                turnResults.criticalEffects.push(...phaseResult.criticalEffects);
            }

            // Track casualties
            if (phaseResult.casualties) {
                turnResults.casualties.player += phaseResult.casualties.player || 0;
                turnResults.casualties.enemy += phaseResult.casualties.enemy || 0;
            }

            // Check if combat should end
            if (this.checkCombatEnd()) {
                turnResults.combatEnded = true;
                break;
            }
        }

        this.turn++;
        return turnResults;
    }

    /**
     * Execute a specific combat phase
     * @param {string} phase - The phase to execute
     * @returns {Object} Results of the phase
     */
    executePhase(phase) {
        switch (phase) {
            case 'Movement':
                return this.executeMovementPhase();
            case 'Shooting':
                return this.executeShootingPhase();
            case 'Damage Resolution':
                return this.executeDamageResolutionPhase();
            case 'Critical Effects':
                return this.executeCriticalEffectsPhase();
            case 'Morale Check':
                return this.executeMoraleCheckPhase();
            default:
                throw new Error(`Unknown combat phase: ${phase}`);
        }
    }

    /**
     * Execute the movement phase
     * @returns {Object} Movement phase results
     */
    executeMovementPhase() {
        const playerSpeed = this.playerShip.classData.baseSpeed;
        const enemySpeed = this.enemyShip.classData.baseSpeed;
        
        // Determine range changes based on speed differences
        const speedDifference = playerSpeed - enemySpeed;
        const rangeChange = this.determineRangeChange(speedDifference);

        this.updateRange(rangeChange);

        return {
            phase: 'Movement',
            rangeChange,
            newRange: this.currentRange,
            playerSpeed,
            enemySpeed
        };
    }

    /**
     * Execute the shooting phase
     * @returns {Object} Shooting phase results
     */
    executeShootingPhase() {
        const results = {
            phase: 'Shooting',
            playerAttacks: [],
            enemyAttacks: [],
            criticalEffects: []
        };

        // Player ship attacks
        this.playerShip.components.weapons.forEach(weapon => {
            if (this.isWeaponInRange(weapon)) {
                const attackResult = this.resolveAttack(weapon, this.enemyShip, true);
                results.playerAttacks.push(attackResult);
            }
        });

        // Enemy ship attacks
        this.enemyShip.components.weapons.forEach(weapon => {
            if (this.isWeaponInRange(weapon)) {
                const attackResult = this.resolveAttack(weapon, this.playerShip, false);
                results.enemyAttacks.push(attackResult);
            }
        });

        return results;
    }

    /**
     * Execute the damage resolution phase
     * @returns {Object} Damage resolution results
     */
    executeDamageResolutionPhase() {
        const results = {
            phase: 'Damage Resolution',
            playerDamage: 0,
            enemyDamage: 0,
            casualties: {
                player: 0,
                enemy: 0
            }
        };

        // Apply accumulated damage
        if (results.playerDamage > 0) {
            const playerDamageResult = this.playerShip.takeDamage(results.playerDamage);
            results.casualties.player = playerDamageResult.casualties;
        }

        if (results.enemyDamage > 0) {
            const enemyDamageResult = this.enemyShip.takeDamage(results.enemyDamage);
            results.casualties.enemy = enemyDamageResult.casualties;
        }

        return results;
    }

    /**
     * Execute the critical effects phase
     * @returns {Object} Critical effects results
     */
    executeCriticalEffectsPhase() {
        const results = {
            phase: 'Critical Effects',
            playerEffects: [],
            enemyEffects: []
        };

        // Check for critical damage on components
        this.checkCriticalEffects(this.playerShip, results.playerEffects);
        this.checkCriticalEffects(this.enemyShip, results.enemyEffects);

        return results;
    }

    /**
     * Execute the morale check phase
     * @returns {Object} Morale check results
     */
    executeMoraleCheckPhase() {
        const results = {
            phase: 'Morale Check',
            playerMorale: this.checkMorale(this.playerShip),
            enemyMorale: this.checkMorale(this.enemyShip)
        };

        return results;
    }

    /**
     * Resolve an attack with a specific weapon
     * @param {Object} weapon - The weapon being used
     * @param {Object} target - The target ship
     * @param {boolean} isPlayerAttack - Whether this is a player attack
     * @returns {Object} Attack results
     */
    resolveAttack(weapon, target, isPlayerAttack) {
        const rangeMod = this.ranges[this.currentRange].accuracyMod;
        const baseAccuracy = weapon.stats.accuracy + rangeMod;

        const attackRoll = DiceRoller.checkRoll(baseAccuracy);
        
        let damage = 0;
        let critical = false;

        if (attackRoll.success) {
            damage = weapon.stats.damage;
            
            // Check for critical hit
            if (attackRoll.criticalSuccess) {
                critical = true;
                damage *= 2;
            }

            // Apply range damage modifier
            damage += this.ranges[this.currentRange].damageMod;
        }

        return {
            weapon: weapon.name,
            hit: attackRoll.success,
            damage,
            critical,
            roll: attackRoll.roll,
            target: attackRoll.target
        };
    }

    /**
     * Check for critical effects on ship components
     * @param {Object} ship - The ship to check
     * @param {Array} effectsArray - Array to store found effects
     */
    checkCriticalEffects(ship, effectsArray) {
        Object.values(ship.components).flat().forEach(component => {
            if (component.status < 50) {
                const effect = this.generateCriticalEffect(component);
                if (effect) {
                    effectsArray.push(effect);
                }
            }
        });
    }

    /**
     * Generate a critical effect for a damaged component
     * @param {Object} component - The damaged component
     * @returns {Object} Critical effect details
     */
    generateCriticalEffect(component) {
        const roll = DiceRoller.rollDie(100);
        
        if (roll <= 25) {
            return {
                component: component.name,
                effect: COMBAT_EFFECTS.MINOR,
                description: `Minor malfunction in ${component.name}`
            };
        } else if (roll <= 50) {
            return {
                component: component.name,
                effect: COMBAT_EFFECTS.MAJOR,
                description: `Major malfunction in ${component.name}`
            };
        }

        return null;
    }

    /**
     * Check ship morale based on damage and casualties
     * @param {Object} ship - The ship to check
     * @returns {Object} Morale check results
     */
    checkMorale(ship) {
        const moraleRoll = DiceRoller.rollDie(100);
        const hullPercentage = ship.status.hullIntegrity;
        const crewPercentage = (ship.crew.current / ship.crew.total) * 100;

        const moraleThreshold = (hullPercentage + crewPercentage) / 2;

        return {
            passed: moraleRoll <= moraleThreshold,
            roll: moraleRoll,
            threshold: moraleThreshold
        };
    }

    /**
     * Determine range change based on speed difference
     * @param {number} speedDifference - Difference in ship speeds
     * @returns {number} Range change value
     */
    determineRangeChange(speedDifference) {
        const baseChance = 50 + (speedDifference * 10);
        const roll = DiceRoller.rollDie(100);

        if (roll <= baseChance) {
            return speedDifference > 0 ? -1 : 1;
        }

        return 0;
    }

    /**
     * Update the current range based on change
     * @param {number} change - The range change value
     */
    updateRange(change) {
        const ranges = Object.keys(this.ranges);
        const currentIndex = ranges.indexOf(this.currentRange);
        const newIndex = Math.max(0, Math.min(ranges.length - 1, currentIndex + change));
        this.currentRange = ranges[newIndex];
    }

    /**
     * Check if a weapon is in range
     * @param {Object} weapon - The weapon to check
     * @returns {boolean} Whether the weapon is in range
     */
    isWeaponInRange(weapon) {
        return weapon.stats.range >= this.ranges[this.currentRange].distance;
    }

    /**
     * Check if combat should end
     * @returns {boolean} Whether combat should end
     */
    checkCombatEnd() {
        return this.playerShip.status.hullIntegrity <= 0 || 
               this.enemyShip.status.hullIntegrity <= 0 ||
               this.playerShip.crew.current <= 0 ||
               this.enemyShip.crew.current <= 0;
    }

    /**
     * Add an event to the combat log
     * @param {string} type - Type of event
     * @param {Object} data - Event data
     */
    logEvent(type, data) {
        this.combatLog.push({
            turn: this.turn,
            timestamp: new Date().toISOString(),
            type,
            ...data
        });
    }

    /**
     * Get the current combat state
     * @returns {Object} Current combat state
     */
    getCombatState() {
        return {
            turn: this.turn,
            range: this.currentRange,
            playerStatus: this.playerShip.getStatus(),
            enemyStatus: this.enemyShip.getStatus(),
            log: this.combatLog
        };
    }
}
