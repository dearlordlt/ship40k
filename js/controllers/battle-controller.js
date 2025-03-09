import Battle from '../models/battle.js';
import Ship from '../models/ship.js';
import { CrewRoster } from '../models/crew.js';
import { showNotification, addLogEntry, updateHullDisplay, updateComponentDisplay, togglePopup, createShipCard, updateButton } from '../utils/ui-utils.js';
import { getRandomBattleQuote } from '../utils/game-utils.js';
import { crewTemplates } from '../data/game-data.js';

class BattleController {
    constructor() {
        this.battle = null;
        this.playerShip = null;
        this.enemyShip = null;
        this.autoBattleInterval = null;
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Battle control buttons
        document.getElementById('select-enemy-btn')?.addEventListener('click', () => this.showEnemySelection());
        document.getElementById('start-battle-btn')?.addEventListener('click', () => this.startBattle());
        document.getElementById('next-turn-btn')?.addEventListener('click', () => this.processTurn());
        document.getElementById('auto-battle-btn')?.addEventListener('click', () => this.toggleAutoBattle());

        // Enemy selection popup
        document.getElementById('confirm-enemy-btn')?.addEventListener('click', () => this.confirmEnemySelection());
        document.getElementById('close-enemy-popup')?.addEventListener('click', () => this.closeEnemySelection());

        // Listen for ship selection/creation
        document.addEventListener('shipSelected', (event) => {
            this.handlePlayerShipSelected(event.detail.ship, event.detail.crew);
        });
        document.addEventListener('shipCreated', (event) => {
            this.handlePlayerShipSelected(event.detail.ship, event.detail.crew);
        });
    }

    handlePlayerShipSelected(ship, crew) {
        this.playerShip = ship;
        this.playerShip.crew = crew;
        this.updateBattleDisplay();
        updateButton('select-enemy-btn', true);
    }

    showEnemySelection() {
        if (!this.playerShip) {
            showNotification('Please select or create a ship first');
            return;
        }

        const enemyShipSelection = document.getElementById('enemy-ship-selection');
        if (enemyShipSelection) {
            // Clear previous selection
            enemyShipSelection.innerHTML = '';

            // Get available ships excluding player's ship
            const availableShips = window.gameData.predefinedShips.filter(
                ship => ship.id !== this.playerShip.id
            );

            // Create ship cards for selection
            availableShips.forEach(shipData => {
                const shipCard = createShipCard(shipData, (ship) => this.selectEnemyShip(ship));
                enemyShipSelection.appendChild(shipCard);
            });
        }

        togglePopup('enemy-select-popup', true);
    }

    selectEnemyShip(ship) {
        // Update selection visual
        document.querySelectorAll('#enemy-ship-selection .ship-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        const selectedCard = document.querySelector(`#enemy-ship-selection .ship-card[data-ship-id="${ship.id}"]`);
        if (selectedCard) {
            selectedCard.classList.add('selected');
        }

        updateButton('confirm-enemy-btn', true);
    }

    confirmEnemySelection() {
        const selectedCard = document.querySelector('#enemy-ship-selection .ship-card.selected');
        if (!selectedCard) return;

        const shipId = parseInt(selectedCard.dataset.shipId);
        const selectedShipData = window.gameData.predefinedShips.find(ship => ship.id === shipId);
        
        if (selectedShipData) {
            // Create proper Ship instance
            this.enemyShip = new Ship(selectedShipData);
            // Create and assign enemy crew
            this.enemyShip.crew = new CrewRoster(crewTemplates.enemyCrew);
            this.updateBattleDisplay();
            togglePopup('enemy-select-popup', false);
            updateButton('start-battle-btn', true);
            showNotification(`Enemy ship ${selectedShipData.name} selected`);
        }
    }

    closeEnemySelection() {
        togglePopup('enemy-select-popup', false);
    }

    startBattle() {
        if (!this.playerShip || !this.enemyShip) {
            showNotification('Both player and enemy ships must be selected');
            return;
        }

        // Create new battle instance
        this.battle = new Battle(this.playerShip, this.enemyShip);
        this.battle.start();

        // Clear battle log
        const battleLog = document.getElementById('battle-log');
        if (battleLog) {
            battleLog.innerHTML = '';
        }

        // Display initial battle log entries
        this.updateBattleLog();
        // Add a humorous quote
        addLogEntry(getRandomBattleQuote(), 'humor');

        // Update UI
        this.updateBattleDisplay();
        updateButton('next-turn-btn', true);
        updateButton('auto-battle-btn', true);
        updateButton('start-battle-btn', false);
    }

    processTurn() {
        if (!this.battle || this.battle.phase !== 'active') {
            showNotification('Start a battle first');
            return;
        }

        // Save current log length to determine new entries
        const currentLogLength = this.battle.log.length;

        const battleContinues = this.battle.processTurn();
        this.updateBattleDisplay();
        
        // Display new log entries
        this.updateBattleLog(currentLogLength);

        if (!battleContinues) {
            this.endBattle();
        }
    }

    updateBattleLog(fromIndex = 0) {
        // Display all new log entries since fromIndex
        for (let i = fromIndex; i < this.battle.log.length; i++) {
            const entry = this.battle.log[i];
            addLogEntry(
                entry.message,
                entry.type,
                entry.turn,
                entry.isRP
            );
        }
    }

    toggleAutoBattle() {
        if (this.autoBattleInterval) {
            // Stop auto-battle
            clearInterval(this.autoBattleInterval);
            this.autoBattleInterval = null;
            updateButton('next-turn-btn', true);
            updateButton('auto-battle-btn', true);
        } else {
            // Start auto-battle
            updateButton('next-turn-btn', false);
            updateButton('auto-battle-btn', false);
            
            this.autoBattleInterval = setInterval(() => {
                this.processTurn();
                
                // Check if battle is over
                if (this.battle.phase !== 'active') {
                    clearInterval(this.autoBattleInterval);
                    this.autoBattleInterval = null;
                    updateButton('start-battle-btn', true);
                }
            }, 1500);
        }
    }

    endBattle() {
        // Stop auto-battle if running
        if (this.autoBattleInterval) {
            clearInterval(this.autoBattleInterval);
            this.autoBattleInterval = null;
        }

        // Update UI
        updateButton('next-turn-btn', false);
        updateButton('auto-battle-btn', false);
        updateButton('start-battle-btn', true);

        // Show battle result notification
        if (!this.playerShip.isOperational() && !this.enemyShip.isOperational()) {
            showNotification('Battle ends in mutual destruction!');
        } else if (!this.playerShip.isOperational()) {
            showNotification('Defeat! Your ship has been destroyed!');
        } else {
            showNotification('Victory! Enemy ship destroyed!');
        }
    }

    updateBattleDisplay() {
        // Update player ship display
        if (this.playerShip) {
            document.getElementById('player-ship-name').textContent = this.playerShip.name;
            updateHullDisplay('player', this.playerShip.hull);
            updateComponentDisplay('player', this.playerShip.components);
        }

        // Update enemy ship display
        if (this.enemyShip) {
            document.getElementById('enemy-ship-name').textContent = this.enemyShip.name;
            updateHullDisplay('enemy', this.enemyShip.hull);
            updateComponentDisplay('enemy', this.enemyShip.components);
        }

        // Update battle controls
        const battleActive = this.battle?.phase === 'active';
        updateButton('next-turn-btn', battleActive);
        updateButton('auto-battle-btn', battleActive);
    }
}

export default BattleController;
