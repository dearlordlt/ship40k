import Ship from '../models/ship.js';
import { CrewRoster } from '../models/crew.js';
import { predefinedShips, shipClasses, weaponTypes, componentTypes, crewTemplates } from '../data/game-data.js';
import { showNotification, createShipCard, updateButton, clearElement, activateTab } from '../utils/ui-utils.js';
import { generateId, generateShipName } from '../utils/game-utils.js';

class ShipController {
    constructor() {
        this.selectedShip = null;
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Ship selection
        document.getElementById('select-ship-btn')?.addEventListener('click', () => this.confirmShipSelection());
        
        // Ship creation form
        document.getElementById('create-ship-btn')?.addEventListener('click', () => this.createShip());
        
        // Ship class selection (for updating crew population range)
        document.getElementById('ship-class')?.addEventListener('change', (e) => this.updateCrewPopulationRange(e.target.value));
        
        // Generate random name button (if exists)
        document.getElementById('generate-name-btn')?.addEventListener('click', () => {
            const nameInput = document.getElementById('ship-name');
            if (nameInput) {
                nameInput.value = generateShipName();
            }
        });
    }

    populateShipSelection(container = document.querySelector('.ship-selection')) {
        if (!container) return;

        clearElement(container);
        
        predefinedShips.forEach(shipData => {
            const shipCard = createShipCard(shipData, (ship) => this.selectShip(ship));
            container.appendChild(shipCard);
        });
    }

    selectShip(ship) {
        // Remove selection from all cards
        document.querySelectorAll('.ship-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        // Add selection to clicked card
        const selectedCard = document.querySelector(`.ship-card[data-ship-id="${ship.id}"]`);
        if (selectedCard) {
            selectedCard.classList.add('selected');
        }
        
        this.selectedShip = ship;
        updateButton('select-ship-btn', true);
    }

    confirmShipSelection() {
        if (!this.selectedShip) {
            showNotification('Please select a ship first');
            return;
        }

        // Create new Ship instance from selected ship data
        const newShip = new Ship(this.selectedShip);
        
        // Create crew roster and initialize with default crew
        const crewRoster = new CrewRoster(crewTemplates.defaultCrew);
        
        // Emit ship selected event
        const event = new CustomEvent('shipSelected', {
            detail: {
                ship: newShip,
                crew: crewRoster
            }
        });
        document.dispatchEvent(event);
        
        showNotification(`You have selected the ${this.selectedShip.name}`);

        // Navigate to Battle Simulator tab
        activateTab('battle-simulator');
    }

    createShip() {
        const nameInput = document.getElementById('ship-name');
        const classSelect = document.getElementById('ship-class');
        
        if (!nameInput?.value || !classSelect?.value) {
            showNotification('Please provide a ship name and class');
            return;
        }

        const newShipData = {
            id: generateId(),
            name: nameInput.value.trim(),
            class: classSelect.value,
            hull: {
                integrity: parseInt(document.getElementById('ship-hull').value),
                current: parseInt(document.getElementById('ship-hull').value),
                armor: parseInt(document.getElementById('ship-armor').value)
            },
            speed: parseInt(document.getElementById('ship-speed').value),
            maneuverability: parseInt(document.getElementById('ship-maneuverability').value),
            crew: {
                rating: parseInt(document.getElementById('ship-crew').value),
                morale: parseInt(document.getElementById('ship-morale').value),
                population: this.calculateCrewPopulation(classSelect.value)
            },
            detection: parseInt(document.getElementById('ship-detection').value),
            weapons: {
                prow: document.getElementById('weapon-prow').value,
                dorsal: document.getElementById('weapon-dorsal').value,
                port: document.getElementById('weapon-port').value,
                starboard: document.getElementById('weapon-starboard').value
            },
            components: componentTypes.map(name => ({
                name,
                status: "operational"
            })),
            description: `A custom ${classSelect.value} class vessel constructed according to the whims of its Rogue Trader.`
        };

        // Create new Ship instance
        const newShip = new Ship(newShipData);
        
        // Create crew roster
        const crewRoster = new CrewRoster();

        // Add to predefined ships for future selection
        predefinedShips.push(newShipData);
        
        // Emit ship created event
        const event = new CustomEvent('shipCreated', {
            detail: {
                ship: newShip,
                crew: crewRoster
            }
        });
        document.dispatchEvent(event);

        showNotification(`Ship "${newShipData.name}" created successfully!`);
        
        // Repopulate ship selection
        this.populateShipSelection();
        
        // Reset form
        this.resetShipCreationForm();
    }

    calculateCrewPopulation(shipClass) {
        const classData = shipClasses.find(c => c.value === shipClass);
        if (!classData) return 20000;
        
        return Math.floor(Math.random() * (classData.maxCrew - classData.minCrew + 1)) + classData.minCrew;
    }

    updateCrewPopulationRange(shipClass) {
        const classData = shipClasses.find(c => c.value === shipClass);
        if (!classData) return;
        
        const populationDisplay = document.getElementById('crew-population-display');
        if (populationDisplay) {
            populationDisplay.textContent = `${classData.minCrew.toLocaleString()} - ${classData.maxCrew.toLocaleString()}`;
        }
    }

    resetShipCreationForm() {
        const form = document.getElementById('ship-creator-form');
        if (form) {
            form.reset();
        }
    }

    populateWeaponSelections() {
        // Populate prow weapons
        const prowSelect = document.getElementById('weapon-prow');
        if (prowSelect) {
            clearElement(prowSelect);
            weaponTypes.prow.forEach(weapon => {
                const option = document.createElement('option');
                option.value = weapon.value;
                option.textContent = weapon.label;
                prowSelect.appendChild(option);
            });
        }

        // Populate dorsal weapons
        const dorsalSelect = document.getElementById('weapon-dorsal');
        if (dorsalSelect) {
            clearElement(dorsalSelect);
            weaponTypes.dorsal.forEach(weapon => {
                const option = document.createElement('option');
                option.value = weapon.value;
                option.textContent = weapon.label;
                dorsalSelect.appendChild(option);
            });
        }

        // Populate broadside weapons (port and starboard)
        ['port', 'starboard'].forEach(side => {
            const select = document.getElementById(`weapon-${side}`);
            if (select) {
                clearElement(select);
                weaponTypes.broadside.forEach(weapon => {
                    const option = document.createElement('option');
                    option.value = weapon.value;
                    option.textContent = weapon.label;
                    select.appendChild(option);
                });
            }
        });
    }
}

export default ShipController;
