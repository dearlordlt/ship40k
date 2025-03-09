import { Ship } from '../models/ship.js';
import { CombatSimulator } from '../simulators/combatSimulator.js';
import { WarpTravelSimulator } from '../simulators/warpTravelSimulator.js';
import { DiceRoller } from '../utils/diceRoller.js';
import { SHIP_CLASSES, CREW_PHRASES } from '../config/constants.js';
import { COMPONENTS } from '../config/gameRules.js';

export class SimulationMode {
    constructor(ship, parentElement) {
        this.ship = ship;
        this.parentElement = parentElement;
        this.combatSimulator = null;
        this.warpSimulator = null;
        this.currentMode = null; // 'combat' or 'warp'
        this.simulationLog = [];
        this.initialize();
    }

    initialize() {
        this.render();
        this.setupEventListeners();
    }

    render() {
        const html = `
            <div class="simulation-container p-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Ship Status Panel -->
                    <div class="bg-gray-900 p-6 rounded-lg border border-imperial-red">
                        <h2 class="text-2xl font-gothic text-imperial-red mb-4">Ship Status</h2>
                        <div id="shipStatusPanel" class="space-y-4">
                            ${this.renderShipStatus()}
                        </div>
                    </div>

                    <!-- Simulation Controls -->
                    <div class="bg-gray-900 p-6 rounded-lg border border-imperial-red">
                        <h2 class="text-2xl font-gothic text-imperial-red mb-4">Simulation Controls</h2>
                        <div class="space-y-4">
                            <div class="simulation-type-selector">
                                <button id="combatModeBtn" 
                                        class="w-1/2 py-2 px-4 font-gothic bg-gray-800 hover:bg-imperial-red transition-colors">
                                    Combat
                                </button>
                                <button id="warpModeBtn" 
                                        class="w-1/2 py-2 px-4 font-gothic bg-gray-800 hover:bg-imperial-red transition-colors">
                                    Warp Travel
                                </button>
                            </div>
                            
                            <!-- Combat Controls (hidden by default) -->
                            <div id="combatControls" class="hidden">
                                <div class="mb-4">
                                    <label class="block text-gothic-gold mb-2">Enemy Type</label>
                                    <select id="enemyTypeSelect" class="gothic-input w-full">
                                        ${Object.entries(SHIP_CLASSES).map(([key, ship]) => `
                                            <option value="${key}">${ship.name}</option>
                                        `).join('')}
                                    </select>
                                </div>
                                <button id="startCombatBtn" 
                                        class="w-full py-2 px-4 bg-imperial-red hover:bg-red-700 font-gothic rounded">
                                    Start Combat
                                </button>
                            </div>

                            <!-- Warp Travel Controls (hidden by default) -->
                            <div id="warpControls" class="hidden">
                                <div class="mb-4">
                                    <label class="block text-gothic-gold mb-2">Destination</label>
                                    <input type="text" id="warpDestination" 
                                           class="gothic-input w-full" 
                                           placeholder="Enter destination">
                                </div>
                                <div class="mb-4">
                                    <label class="block text-gothic-gold mb-2">Estimated Duration (days)</label>
                                    <input type="number" id="warpDuration" 
                                           class="gothic-input w-full" 
                                           min="1" value="30">
                                </div>
                                <button id="startWarpBtn" 
                                        class="w-full py-2 px-4 bg-imperial-red hover:bg-red-700 font-gothic rounded">
                                    Enter the Warp
                                </button>
                            </div>

                            <!-- Active Simulation Controls (hidden by default) -->
                            <div id="activeControls" class="hidden">
                                <button id="nextTurnBtn" 
                                        class="w-full py-2 px-4 bg-imperial-red hover:bg-red-700 font-gothic rounded mb-2">
                                    Next Turn
                                </button>
                                <button id="endSimulationBtn" 
                                        class="w-full py-2 px-4 bg-gray-700 hover:bg-gray-600 font-gothic rounded">
                                    End Simulation
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Simulation Log -->
                <div class="mt-6 bg-gray-900 p-6 rounded-lg border border-imperial-red">
                    <h2 class="text-2xl font-gothic text-imperial-red mb-4">Simulation Log</h2>
                    <div id="simulationLog" class="h-64 overflow-y-auto space-y-2 font-mono text-sm">
                        <!-- Log entries will be added here -->
                    </div>
                </div>
            </div>
        `;

        this.parentElement.innerHTML = html;
    }

    setupEventListeners() {
        // Mode selection
        document.getElementById('combatModeBtn').addEventListener('click', () => this.switchMode('combat'));
        document.getElementById('warpModeBtn').addEventListener('click', () => this.switchMode('warp'));

        // Combat controls
        document.getElementById('startCombatBtn').addEventListener('click', () => this.startCombat());
        
        // Warp controls
        document.getElementById('startWarpBtn').addEventListener('click', () => this.startWarpTravel());

        // Active simulation controls
        document.getElementById('nextTurnBtn').addEventListener('click', () => this.executeTurn());
        document.getElementById('endSimulationBtn').addEventListener('click', () => this.endSimulation());
    }

    switchMode(mode) {
        this.currentMode = mode;
        
        // Update UI
        document.getElementById('combatControls').classList.toggle('hidden', mode !== 'combat');
        document.getElementById('warpControls').classList.toggle('hidden', mode !== 'warp');
        document.getElementById('activeControls').classList.add('hidden');

        // Update mode buttons
        document.getElementById('combatModeBtn').classList.toggle('active', mode === 'combat');
        document.getElementById('warpModeBtn').classList.toggle('active', mode === 'warp');

        // Reset simulators
        this.combatSimulator = null;
        this.warpSimulator = null;

        // Clear log
        this.clearLog();
    }

    startCombat() {
        const enemyType = document.getElementById('enemyTypeSelect').value;
        const enemyShip = this.createEnemyShip(enemyType);
        
        this.combatSimulator = new CombatSimulator(this.ship, enemyShip);
        const initialState = this.combatSimulator.initializeCombat();
        
        this.logSimulation('combat_start', `Combat initiated between ${this.ship.name} and ${enemyShip.name}`);
        this.updateControls('active');
        this.updateShipStatus();
    }

    startWarpTravel() {
        const destination = document.getElementById('warpDestination').value;
        const duration = parseInt(document.getElementById('warpDuration').value);

        if (!destination || !duration) {
            this.logSimulation('error', 'Please enter both destination and duration');
            return;
        }

        this.warpSimulator = new WarpTravelSimulator(this.ship);
        const initialState = this.warpSimulator.initializeJourney({
            destination,
            estimatedDuration: duration
        });

        this.logSimulation('warp_start', `Entering the Warp. Destination: ${destination}. Estimated duration: ${duration} days`);
        this.updateControls('active');
        this.updateShipStatus();
    }

    executeTurn() {
        if (this.currentMode === 'combat' && this.combatSimulator) {
            const turnResults = this.combatSimulator.executeTurn();
            this.handleCombatTurnResults(turnResults);
        } else if (this.currentMode === 'warp' && this.warpSimulator) {
            const dayResults = this.warpSimulator.simulateDay();
            this.handleWarpDayResults(dayResults);
        }
    }

    handleCombatTurnResults(results) {
        // Log combat phases
        results.phases.forEach(phase => {
            switch (phase.phase) {
                case 'Movement':
                    this.logSimulation('combat_movement', 
                        `Range changed to ${phase.newRange}`);
                    break;
                case 'Shooting':
                    phase.playerAttacks.forEach(attack => {
                        this.logSimulation('combat_attack',
                            `${attack.weapon} ${attack.hit ? 'hits' : 'misses'} ` +
                            `${attack.hit ? `(Damage: ${attack.damage})` : ''}`);
                    });
                    break;
                case 'Critical Effects':
                    phase.playerEffects.forEach(effect => {
                        this.logSimulation('combat_critical',
                            `Critical effect: ${effect.description}`);
                    });
                    break;
            }
        });

        // Update UI
        this.updateShipStatus();

        // Check for combat end
        if (results.combatEnded) {
            this.endSimulation();
        }
    }

    handleWarpDayResults(results) {
        // Log day events
        results.events.forEach(event => {
            this.logSimulation('warp_event', 
                `Day ${results.day}: ${event.name} - ${event.description}`);
            
            // Log duration changes from events
            if (event.name === 'Calm Warp') {
                this.logSimulation('warp_navigation', 'Favorable warp conditions reduce journey time by 10%');
            } else if (event.name === 'Warp Storm') {
                this.logSimulation('warp_navigation', 'Warp storm increases journey time by 20%');
            }
        });

        // Log navigation results if available
        if (results.navigationCheck) {
            const navCheck = results.navigationCheck;
            const message = navCheck.success 
                ? (navCheck.critical ? 'Excellent navigation reduces journey time by 10%!' : 'Successful navigation.')
                : (navCheck.critical ? 'Critical navigation failure increases journey time by 50%!' : 'Navigation check failed, journey time increased by 10%.');
            this.logSimulation('navigation', message);
        }

        // Log Gellar Field status
        const gellarStatus = results.gellarFieldStatus;
        if (gellarStatus && gellarStatus.status) {
            this.logSimulation('gellar_field',
                `Gellar Field ${gellarStatus.status}: ${gellarStatus.effect}`);
        }

        // Update UI
        this.updateShipStatus();

        // Check for journey completion
        if (results.journeyCompleted) {
            this.endSimulation();
        }
    }

    endSimulation() {
        this.updateControls('inactive');
        
        if (this.currentMode === 'combat') {
            const state = this.combatSimulator.getCombatState();
            this.logSimulation('combat_end',
                `Combat ended. Hull integrity: ${state.playerStatus.hullIntegrity}%`);
        } else if (this.currentMode === 'warp') {
            const state = this.warpSimulator.getJourneyState();
            this.logSimulation('warp_end',
                `Warp journey completed. Crew casualties: ${state.crewLosses}`);
        }

        this.combatSimulator = null;
        this.warpSimulator = null;
    }

    createEnemyShip(shipClass) {
        const enemyShip = new Ship(
            `Enemy ${SHIP_CLASSES[shipClass].name}`,
            shipClass
        );

        // Add some random components
        Object.values(COMPONENTS).forEach(component => {
            try {
                if (DiceRoller.rollDie(100) <= 50) { // 50% chance to add each component
                    enemyShip.addComponent(component.id);
                }
            } catch (error) {
                // Skip if component can't be added
            }
        });

        return enemyShip;
    }

    updateControls(state) {
        document.getElementById('combatControls').classList.add('hidden');
        document.getElementById('warpControls').classList.add('hidden');
        document.getElementById('activeControls').classList.toggle('hidden', state !== 'active');
    }

    updateShipStatus() {
        const statusPanel = document.getElementById('shipStatusPanel');
        statusPanel.innerHTML = this.renderShipStatus();
    }

    renderShipStatus() {
        const status = this.ship.getStatus();
        return `
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <div class="text-gothic-gold">Hull Integrity</div>
                    <div class="progress-bar" style="width: ${status.hullIntegrity}%"></div>
                    <div>${status.hullIntegrity}%</div>
                </div>
                <div>
                    <div class="text-gothic-gold">Shields</div>
                    <div class="progress-bar" style="width: ${status.shields}%"></div>
                    <div>${status.shields}%</div>
                </div>
                <div>
                    <div class="text-gothic-gold">Crew</div>
                    <div>${status.crew.current.toLocaleString()} / ${status.crew.total.toLocaleString()}</div>
                </div>
                <div>
                    <div class="text-gothic-gold">Morale</div>
                    <div>${status.crewMorale}%</div>
                </div>
            </div>
            <div class="mt-4">
                <div class="text-gothic-gold">Active Components</div>
                <div class="grid grid-cols-2 gap-2 mt-2">
                    ${Object.entries(status.components)
                        .flatMap(([category, components]) =>
                            components.map(component => `
                                <div class="text-sm">
                                    ${component.name} (${component.status}%)
                                </div>
                            `)
                        ).join('')}
                </div>
            </div>
        `;
    }

    logSimulation(type, message) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            type,
            message
        };

        this.simulationLog.push(logEntry);

        const logElement = document.getElementById('simulationLog');
        const entryElement = document.createElement('div');
        entryElement.className = `log-entry ${type}`;
        entryElement.innerHTML = `
            <span class="text-gothic-gold">[${new Date().toLocaleTimeString()}]</span>
            <span class="text-gray-200">${message}</span>
        `;

        logElement.appendChild(entryElement);
        logElement.scrollTop = logElement.scrollHeight;
    }

    clearLog() {
        this.simulationLog = [];
        document.getElementById('simulationLog').innerHTML = '';
    }
}
