import { Ship } from './models/ship.js';
import { StorageService } from './services/storageService.js';
import { NameGenerator } from './services/nameGenerator.js';
import { SHIP_CLASSES, COMPONENT_CATEGORIES } from './config/constants.js';
import { COMPONENTS } from './config/gameRules.js';
import { SimulationMode } from './components/simulationMode.js';

class Ship40kApp {
    constructor() {
        // Initialize services
        this.storageService = new StorageService();
        this.nameGenerator = new NameGenerator();
        this.currentShip = null;
        this.currentMode = 'design';
        this.simulationMode = null;

        // Initialize UI elements
        this.designModeTab = document.getElementById('designModeTab');
        this.simulationModeTab = document.getElementById('simulationModeTab');
        this.designMode = document.getElementById('designMode');
        this.simulationModePanel = document.getElementById('simulationModePanel');
        this.shipClassSelector = document.getElementById('shipClassSelector');
        this.resourceTracker = document.getElementById('resourceTracker');
        this.componentSelector = document.getElementById('componentSelector');
        this.shipNameInput = document.getElementById('shipName');
        this.finalizeDesignBtn = document.getElementById('finalizeDesignBtn');

        // Initialize finalize button state
        if (this.finalizeDesignBtn) {
            this.finalizeDesignBtn.classList.add('opacity-50', 'cursor-not-allowed');
            this.finalizeDesignBtn.disabled = true;
        }

        this.init();
    }

    async init() {
        try {
            // Initialize storage
            await this.storageService.init();

            // Set up event listeners
            this.setupEventListeners();

            // Initialize ship class selection
            this.initializeShipClasses();

            // Load last used ship if available
            const savedShips = await this.storageService.getAllShips();
            if (savedShips.length > 0) {
                this.loadShip(savedShips[savedShips.length - 1]);
            } else {
                // Ensure finalize button is disabled if no ship is loaded
                this.finalizeDesignBtn.classList.add('opacity-50', 'cursor-not-allowed');
                this.finalizeDesignBtn.disabled = true;
            }
        } catch (error) {
            console.error('Initialization error:', error);
            this.showError('Failed to initialize application');
        }
    }

    setupEventListeners() {
        // Mode switching
        this.designModeTab.addEventListener('click', () => this.switchMode('design'));
        this.simulationModeTab.addEventListener('click', () => this.switchMode('simulation'));

        // Finalize design
        this.finalizeDesignBtn.addEventListener('click', () => this.finalizeDesign());

        // Ship class selection
        this.shipClassSelector.addEventListener('change', (e) => {
            if (e.target.matches('.ship-class-option')) {
                this.handleShipClassSelection(e.target.value);
            }
        });

        // Component selection
        this.componentSelector.addEventListener('click', (e) => {
            if (e.target.matches('.component-button')) {
                this.handleComponentSelection(e.target.dataset.componentId);
            }
        });
    }

    initializeShipClasses() {
        const shipClassHtml = Object.entries(SHIP_CLASSES).map(([key, shipClass]) => `
            <div class="ship-class-option mb-4 p-4 bg-gray-800 rounded-lg hover:bg-gray-700 cursor-pointer"
                 data-ship-class="${key}">
                <h3 class="text-xl font-gothic text-imperial-red">${shipClass.name}</h3>
                <p class="text-gothic-gold mt-2">${shipClass.description}</p>
                <div class="mt-3 grid grid-cols-2 gap-2 text-sm">
                    <div>Hull Space: ${shipClass.baseHullSpace}</div>
                    <div>Power: ${shipClass.basePower}</div>
                    <div>Ship Points: ${shipClass.baseShipPoints}</div>
                    <div>Crew: ${shipClass.crewRequirement.toLocaleString()}</div>
                </div>
            </div>
        `).join('');

        this.shipClassSelector.innerHTML = shipClassHtml;

        // Add click event listeners
        this.shipClassSelector.querySelectorAll('.ship-class-option').forEach(option => {
            option.addEventListener('click', () => {
                this.handleShipClassSelection(option.dataset.shipClass);
            });
        });
    }

    async handleShipClassSelection(shipClass) {
        try {
            // Generate a new ship name
            const shipName = this.nameGenerator.generateShipName();
            
            // Create new ship
            this.currentShip = new Ship(shipName, shipClass);
            
            // Update UI
            this.updateResourceDisplay();
            this.initializeComponentSelection();
            
            // Update ship name input and enable finalize button
            this.shipNameInput.value = shipName;
            this.finalizeDesignBtn.classList.remove('opacity-50', 'cursor-not-allowed');
            this.finalizeDesignBtn.disabled = false;
            
            // Save to storage
            await this.storageService.saveShip(this.currentShip.toJSON());
            
            // Show success message
            this.showNotification(`Created new ship: ${shipName}`);
        } catch (error) {
            console.error('Error creating ship:', error);
            this.showError('Failed to create new ship');
        }
    }

    updateResourceDisplay() {
        if (!this.currentShip) return;

        const resources = this.currentShip.getResourceUsage();
        const resourceHtml = `
            <div class="space-y-4">
                <div class="resource-bar-container">
                    <div class="flex justify-between mb-1">
                        <span>Hull Space</span>
                        <span>${resources.hullSpace.used}/${resources.hullSpace.total}</span>
                    </div>
                    <div class="bg-gray-700 rounded-full h-2">
                        <div class="bg-imperial-red rounded-full h-2 transition-all"
                             style="width: ${(resources.hullSpace.used / resources.hullSpace.total) * 100}%">
                        </div>
                    </div>
                </div>

                <div class="resource-bar-container">
                    <div class="flex justify-between mb-1">
                        <span>Power</span>
                        <span>${resources.power.used}/${resources.power.total}</span>
                    </div>
                    <div class="bg-gray-700 rounded-full h-2">
                        <div class="bg-gothic-gold rounded-full h-2 transition-all"
                             style="width: ${(resources.power.used / resources.power.total) * 100}%">
                        </div>
                    </div>
                </div>

                <div class="resource-bar-container">
                    <div class="flex justify-between mb-1">
                        <span>Ship Points</span>
                        <span>${resources.shipPoints.used}/${resources.shipPoints.total}</span>
                    </div>
                    <div class="bg-gray-700 rounded-full h-2">
                        <div class="bg-blue-500 rounded-full h-2 transition-all"
                             style="width: ${(resources.shipPoints.used / resources.shipPoints.total) * 100}%">
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.resourceTracker.innerHTML = resourceHtml;
    }

    initializeComponentSelection() {
        const componentHtml = Object.entries(COMPONENT_CATEGORIES).map(([category, categoryId]) => `
            <div class="component-category mb-6">
                <h3 class="text-xl font-gothic text-imperial-red mb-3">${category}</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                    ${Object.entries(COMPONENTS)
                        .filter(([_, component]) => component.category === categoryId)
                        .map(([id, component]) => this.createComponentCard(id, component))
                        .join('')}
                </div>
            </div>
        `).join('');

        this.componentSelector.innerHTML = componentHtml;
    }

    createComponentCard(id, component) {
        const canAdd = this.currentShip ? this.currentShip.canAddComponent(id).allowed : false;
        
        return `
            <div class="component-card bg-gray-800 p-4 rounded-lg ${canAdd ? 'hover:bg-gray-700' : 'opacity-50'}">
                <h4 class="font-gothic text-gothic-gold">${component.name}</h4>
                <p class="text-sm mt-1">${component.description}</p>
                <div class="mt-2 grid grid-cols-2 gap-1 text-sm">
                    <div>Space: ${component.hullSpaceRequired}</div>
                    <div>Power: ${component.powerRequired}</div>
                    <div>Points: ${component.shipPoints}</div>
                </div>
                <button class="component-button mt-3 w-full py-2 px-4 rounded
                             ${canAdd ? 'bg-imperial-red hover:bg-red-700' : 'bg-gray-600'}"
                        data-component-id="${id}"
                        ${!canAdd ? 'disabled' : ''}>
                    Install Component
                </button>
            </div>
        `;
    }

    async handleComponentSelection(componentId) {
        if (!this.currentShip) {
            this.showError('Please select a ship class first');
            return;
        }

        try {
            await this.currentShip.addComponent(componentId);
            this.updateResourceDisplay();
            this.initializeComponentSelection(); // Refresh component display
            await this.storageService.saveShip(this.currentShip.toJSON());
            this.showNotification('Component installed successfully');
        } catch (error) {
            this.showError(error.message);
        }
    }

    async finalizeDesign() {
        if (!this.currentShip) {
            this.showError('Please select a ship class first');
            return;
        }

        // Check if at least one component is installed
        const hasComponents = Object.values(this.currentShip.components)
            .some(category => category.length > 0);
        
        if (!hasComponents) {
            this.showError('Please install at least one component');
            return;
        }

        // Update ship name if provided
        const customName = this.shipNameInput.value.trim();
        if (customName) {
            this.currentShip.name = customName;
            await this.storageService.saveShip(this.currentShip.toJSON());
        }

        // Switch to simulation mode
        this.switchMode('simulation');
    }

    switchMode(mode) {
        if (mode === 'simulation' && !this.currentShip) {
            this.showError('Please design a ship first');
            return;
        }

        this.currentMode = mode;
        
        // Update UI
        if (mode === 'design') {
            this.designMode.classList.remove('hidden');
            this.simulationModePanel.classList.add('hidden');
            this.designModeTab.classList.add('active');
            this.simulationModeTab.classList.remove('active');
            
            // Clear simulation mode if it exists
            if (this.simulationMode) {
                this.simulationMode = null;
            }
        } else {
            this.designMode.classList.add('hidden');
            this.simulationModePanel.classList.remove('hidden');
            this.designModeTab.classList.remove('active');
            this.simulationModeTab.classList.add('active');

            // Initialize simulation mode if not already done
            if (!this.simulationMode) {
                this.simulationMode = new SimulationMode(this.currentShip, this.simulationModePanel);
            }
        }

        // Update tab styling
        this.designModeTab.style.backgroundColor = mode === 'design' ? '#1a1a1a' : '#000000';
        this.simulationModeTab.style.backgroundColor = mode === 'simulation' ? '#1a1a1a' : '#000000';
    }

    async loadShip(shipData) {
        try {
            this.currentShip = Ship.fromJSON(shipData);
            this.updateResourceDisplay();
            this.initializeComponentSelection();
            
            // Update ship name input and enable finalize button
            this.shipNameInput.value = this.currentShip.name;
            this.finalizeDesignBtn.classList.remove('opacity-50', 'cursor-not-allowed');
            this.finalizeDesignBtn.disabled = false;
            
            this.showNotification(`Loaded ship: ${this.currentShip.name}`);
        } catch (error) {
            console.error('Error loading ship:', error);
            this.showError('Failed to load ship');
        }
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-green-800 text-white px-6 py-3 rounded shadow-lg z-50 animate-fade-in';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('animate-fade-out');
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }

    showError(message) {
        const error = document.createElement('div');
        error.className = 'fixed top-4 right-4 bg-imperial-red text-white px-6 py-3 rounded shadow-lg z-50 animate-fade-in';
        error.textContent = message;
        document.body.appendChild(error);

        setTimeout(() => {
            error.classList.add('animate-fade-out');
            setTimeout(() => error.remove(), 500);
        }, 3000);
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.ship40kApp = new Ship40kApp();
});
