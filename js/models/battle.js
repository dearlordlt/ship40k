import { getRandomInt, getRandomElement } from '../utils/game-utils.js';
import { generateContextualRPMessage } from '../utils/rp-utils.js';

class Battle {
    constructor(playerShip, enemyShip) {
        this.playerShip = playerShip;
        this.enemyShip = enemyShip;
        this.turn = 1;
        this.phase = 'inactive';
        this.log = [];
        this.turnEvents = {
            hits: 0,
            hullDamage: false,
            componentDamage: null,
            casualties: false,
            morale: 100
        };
        this.criticalHits = {
            hull: [
                "Minor hull breach! Crew rushing to seal affected areas.",
                "Hull breach on multiple decks! Crew casualties mounting as compartments decompress.",
                "Catastrophic hull failure! Massive decompression across multiple decks.",
                "Structural integrity compromised! The ship is beginning to break apart!"
            ],
            propulsion: [
                "Engine fluctuations! Speed reduced temporarily.",
                "Engine coolant leak! Reduced speed until repaired.",
                "Major engine damage! Engines operating at minimal capacity.",
                "Catastrophic engine failure! The ship is dead in the void!"
            ],
            weapons: [
                "Power fluctuations in weapon systems! Reduced accuracy on next salvo.",
                "Weapons capacitors damaged! One weapon system offline.",
                "Ammunition explosion! Multiple weapon systems disabled.",
                "Catastrophic weapons failure! All weapon systems offline!"
            ],
            bridge: [
                "Bridge systems damaged! Command and control impaired.",
                "Major damage to bridge! Several bridge crew casualties.",
                "Bridge severely damaged! Captain injured and multiple crew killed.",
                "Bridge destroyed! Leadership decapitated and ship in disarray!"
            ],
            voidShields: [
                "Void shield fluctuations! Shield effectiveness reduced.",
                "Void shield generator damaged! Shields operating at reduced capacity.",
                "Major damage to shield systems! Void shields offline.",
                "Void shield generators destroyed! The ship is completely unprotected!"
            ]
        };
    }

    start() {
        this.phase = 'active';
        this.log = [];
        this.addLogEntry(`Battle commencing between ${this.playerShip.name} and ${this.enemyShip.name}`);
        this.addLogEntry(`Turn ${this.turn} - Prepare for combat!`);
        this.addLogEntry(generateContextualRPMessage({}), 'rp', true);
    }

    addLogEntry(message, type = 'system', isRP = false) {
        const logEntry = {
            message,
            type: isRP ? 'rp' : type,
            turn: this.turn,
            timestamp: new Date().toISOString(),
            isRP
        };
        this.log.push(logEntry);
        return logEntry;
    }

    processTurn() {
        if (this.phase !== 'active') {
            throw new Error('Battle must be active to process turn');
        }

        // Reset turn events
        this.turnEvents = {
            hits: 0,
            hullDamage: false,
            componentDamage: null,
            casualties: false,
            morale: this.playerShip._crewStats.morale
        };

        this.addLogEntry(`Turn ${this.turn} - Combat Phase Initiated`);

        // Process ship attacks
        this.processShipAttack(this.playerShip, this.enemyShip, 'player');
        this.processShipAttack(this.enemyShip, this.playerShip, 'enemy');

        // Generate single RP message based on most significant event
        this.addLogEntry(this.generateTurnRPMessage(), 'rp', true);

        // Check battle status
        if (!this.playerShip.isOperational() || !this.enemyShip.isOperational()) {
            this.phase = 'completed';
            this.addBattleEndLog();
            return false;
        }

        this.turn++;
        this.addLogEntry(`Turn ${this.turn} - Prepare for next exchange`);
        return true;
    }

    processShipAttack(attackerShip, defenderShip, attackerType) {
        const attackerName = attackerType === 'player' ? 'Your ship' : 'Enemy ship';
        const defenderName = attackerType === 'player' ? 'Enemy ship' : 'Your ship';

        // Check weapon systems status
        if (!attackerShip.isComponentOperational("Weapon Systems")) {
            this.addLogEntry(`${attackerName} weapon systems completely offline. Unable to fire.`, 'system');
            this.addLogEntry(generateContextualRPMessage({ 
                damageType: 'component',
                componentType: 'Weapon Systems'
            }), 'rp', true);
            return;
        }

        // Process each operational weapon
        const weapons = attackerShip.getOperationalWeapons();
        weapons.forEach(weapon => {
            const hitChance = attackerShip.calculateHitChance(defenderShip, weapon.type);
            const rollToHit = getRandomInt(1, 100);

            if (rollToHit <= hitChance) {
                // Calculate and apply damage
                const damage = this.calculateWeaponDamage(weapon.type, attackerType);
                const damageResult = defenderShip.takeDamage(damage);

                // Combat log entry
                this.addLogEntry(
                    `${attackerName} ${weapon.location} ${weapon.type} hits! ` +
                    `Deals ${damageResult} damage to ${defenderName}.`,
                    'action'
                );

                // Record events
                this.turnEvents.hits++;
                if (damageResult > 5) {
                    this.turnEvents.hullDamage = true;
                }

                // Check for component damage
                this.processComponentDamage(defenderShip, defenderName);

                // Check for critical hits
                this.processCriticalHit(defenderShip, defenderName);
            } else {
                this.addLogEntry(
                    `${attackerName} ${weapon.location} ${weapon.type} fires but misses.`,
                    'system'
                );
            }
        });
    }

    calculateWeaponDamage(weaponType, attackerType) {
        let baseDamage = 0;
        
        // Base damage by weapon type
        switch (weaponType) {
            case "Weapons Battery":
                baseDamage = getRandomInt(3, 8);
                break;
            case "Lance Battery":
                baseDamage = getRandomInt(5, 12);
                break;
            case "Macro Cannon":
                baseDamage = getRandomInt(8, 15);
                break;
            case "Torpedo Tubes":
                baseDamage = getRandomInt(10, 20);
                break;
            case "Mega Laser":
                baseDamage = getRandomInt(12, 18);
                break;
            case "Bombardment Cannon":
                baseDamage = getRandomInt(6, 14);
                break;
            default:
                baseDamage = getRandomInt(2, 6);
        }

        // Apply gunner skill modifier if present
        const ship = attackerType === 'player' ? this.playerShip : this.enemyShip;
        if (ship.crew) {
            const gunner = ship.crew.getMember("Master Gunner");
            if (gunner) {
                baseDamage += Math.floor(gunner.getEffectiveSkill() / 10);
            }
        }

        return baseDamage;
    }

    processComponentDamage(ship, shipName) {
        if (getRandomInt(1, 100) <= 30) {
            const operationalComponents = ship.components.filter(c => c.status === "operational");
            if (operationalComponents.length > 0) {
                const randomComponent = getRandomElement(operationalComponents);
                ship.damageComponent(randomComponent.name);
                this.addLogEntry(`${shipName} ${randomComponent.name} has been damaged!`, 'damage');
                this.turnEvents.componentDamage = randomComponent.name;
            }
        }
    }

    processCriticalHit(ship, shipName) {
        const hullPercentage = ship.getHullPercentage();
        let criticalChance = 0;

        if (hullPercentage <= 25) {
            criticalChance = 40;
        } else if (hullPercentage <= 50) {
            criticalChance = 20;
        } else if (hullPercentage <= 75) {
            criticalChance = 10;
        }

        if (getRandomInt(1, 100) <= criticalChance) {
            const critTypes = ["hull", "propulsion", "weapons", "bridge", "voidShields"];
            const critType = getRandomElement(critTypes);
            const severity = hullPercentage <= 25 ? getRandomInt(1, 3) :
                           hullPercentage <= 50 ? getRandomInt(0, 2) :
                           getRandomInt(0, 1);

            const critMessage = this.criticalHits[critType][severity];
            this.addLogEntry(`CRITICAL HIT on ${shipName}! ${critMessage}`, 'critical');
            this.applyCriticalEffect(ship, critType, severity);
        }
    }

    applyCriticalEffect(ship, type, severity) {
        switch (type) {
            case "hull":
                // Reduce crew morale
                ship._crewStats.morale = Math.max(20, ship._crewStats.morale - 10 * (severity + 1));
                this.addLogEntry(generateContextualRPMessage({ 
                    damageType: 'hull',
                    morale: ship._crewStats.morale 
                }), 'rp', true);
                break;
            case "propulsion":
                ship.speed = Math.max(1, ship.speed - (severity + 1));
                if (severity >= 2) {
                    ship.destroyComponent("Engines");
                } else {
                    ship.damageComponent("Engines");
                }
                this.addLogEntry(generateContextualRPMessage({
                    damageType: 'component',
                    componentType: 'Engines'
                }), 'rp', true);
                break;
            case "weapons":
                if (severity >= 2) {
                    ship.destroyComponent("Weapon Systems");
                } else {
                    ship.damageComponent("Weapon Systems");
                }
                this.addLogEntry(generateContextualRPMessage({
                    damageType: 'component',
                    componentType: 'Weapon Systems'
                }), 'rp', true);
                break;
            case "bridge":
                if (severity >= 2) {
                    ship.destroyComponent("Bridge");
                } else {
                    ship.damageComponent("Bridge");
                }
                // Process crew casualties
                if (severity >= 1 && ship.crew) {
                    const casualties = ship.crew.takeCasualties(
                        severity >= 2 ? getRandomInt(30, 50) : getRandomInt(10, 25),
                        getRandomInt(1, 3)
                    );
                    casualties.forEach(casualty => {
                        this.addLogEntry(
                            `${casualty.role} ${casualty.name} has been ${casualty.survived ? 'wounded' : 'killed'}!`,
                            'critical'
                        );
                    });
                    this.turnEvents.casualties = true;
                }
                break;
            case "voidShields":
                if (severity >= 2) {
                    ship.destroyComponent("Void Shields");
                } else {
                    ship.damageComponent("Void Shields");
                }
                this.addLogEntry(generateContextualRPMessage({
                    damageType: 'component',
                    componentType: 'Void Shields'
                }), 'rp', true);
                break;
        }
    }

    addBattleEndLog() {
        if (!this.playerShip.isOperational() && !this.enemyShip.isOperational()) {
            this.addLogEntry(
                "Both ships have been destroyed! The battle ends in mutual annihilation!",
                'critical'
            );
        } else if (!this.playerShip.isOperational()) {
            this.addLogEntry(
                `The ${this.playerShip.name} has been destroyed! The enemy is victorious.`,
                'critical'
            );
        } else {
            this.addLogEntry(
                `The ${this.enemyShip.name} has been destroyed! You are victorious!`,
                'success'
            );
        }
    }

    getStatus() {
        return {
            turn: this.turn,
            phase: this.phase,
            playerShip: {
                hull: this.playerShip.hull,
                components: this.playerShip.components
            },
            enemyShip: {
                hull: this.enemyShip.hull,
                components: this.enemyShip.components
            }
        };
    }

    generateTurnRPMessage() {
        // Prioritize events by significance
        if (this.turnEvents.casualties) {
            return generateContextualRPMessage({ casualties: true });
        }
        
        if (this.turnEvents.componentDamage) {
            return generateContextualRPMessage({
                damageType: 'component',
                componentType: this.turnEvents.componentDamage
            });
        }
        
        if (this.turnEvents.hullDamage) {
            return generateContextualRPMessage({ damageType: 'hull' });
        }
        
        if (this.turnEvents.hits > 0) {
            return generateContextualRPMessage({ hitSuccess: true });
        }
        
        if (this.turnEvents.morale < 50) {
            return generateContextualRPMessage({ morale: this.turnEvents.morale });
        }
        
        // Default battle progress message
        return generateContextualRPMessage({});
    }

    toJSON() {
        return {
            turn: this.turn,
            phase: this.phase,
            log: this.log,
            playerShip: this.playerShip.toJSON(),
            enemyShip: this.enemyShip.toJSON()
        };
    }
}

export default Battle;
