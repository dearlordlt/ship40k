import ShipController from './controllers/ship-controller.js';
import CrewController from './controllers/crew-controller.js';
import BattleController from './controllers/battle-controller.js';
import { activateTab } from './utils/ui-utils.js';
import * as gameData from './data/game-data.js';

class App {
    constructor() {
        // Make game data globally available
        window.gameData = gameData;

        // Initialize controllers
        this.shipController = new ShipController();
        this.crewController = new CrewController();
        this.battleController = new BattleController();

        // Initialize UI
        this.initializeUI();
    }

    initializeUI() {
        // Initialize tab navigation
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', () => {
                activateTab(tab.dataset.tab);
            });
        });

        // Populate initial ship selection
        this.shipController.populateShipSelection();

        // Populate weapon selections in ship creator
        this.shipController.populateWeaponSelections();

        // Populate crew quirks in crew manager
        this.crewController.populateCrewQuirks();

        // Initialize tooltips or other UI enhancements
        this.initializeTooltips();

        // Handle keyboard shortcuts
        this.initializeKeyboardShortcuts();
    }

    initializeTooltips() {
        // Add tooltip functionality to elements with data-tooltip attribute
        document.querySelectorAll('[data-tooltip]').forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                const tooltip = document.createElement('div');
                tooltip.className = 'tooltip';
                tooltip.textContent = e.target.dataset.tooltip;
                document.body.appendChild(tooltip);

                // Position tooltip
                const rect = e.target.getBoundingClientRect();
                // Position tooltip above the element
                tooltip.style.position = 'fixed';
                tooltip.style.top = `${rect.top - tooltip.offsetHeight - 5}px`;
                tooltip.style.left = `${rect.left + (rect.width / 2)}px`;
                tooltip.style.transform = 'translateX(-50%)';

                // Store tooltip reference
                e.target.tooltip = tooltip;
            });

            element.addEventListener('mouseleave', (e) => {
                if (e.target.tooltip) {
                    e.target.tooltip.remove();
                    e.target.tooltip = null;
                }
            });
        });
    }

    initializeKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Only handle shortcuts if not in an input/textarea
            if (e.target.matches('input, textarea')) return;

            switch (e.key.toLowerCase()) {
                case 'n':
                    // Next turn in battle
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        document.getElementById('next-turn-btn')?.click();
                    }
                    break;

                case 'b':
                    // Toggle auto-battle
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        document.getElementById('auto-battle-btn')?.click();
                    }
                    break;

                case '1':
                case '2':
                case '3':
                case '4':
                    // Switch tabs
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        const tabs = document.querySelectorAll('.tab');
                        const index = parseInt(e.key) - 1;
                        if (tabs[index]) {
                            tabs[index].click();
                        }
                    }
                    break;
            }
        });
    }

    // Error handling
    handleError(error, context = '') {
        console.error(`Error in ${context}:`, error);
        
        // Show user-friendly error message
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.innerHTML = `
            <h3>An Error Occurred</h3>
            <p>The Machine Spirit is displeased. Technical details have been logged.</p>
            <p>Context: ${context}</p>
            <button onclick="this.parentElement.remove()">Dismiss</button>
        `;
        document.body.appendChild(errorMessage);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            errorMessage.remove();
        }, 5000);
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    try {
        window.app = new App();
    } catch (error) {
        console.error('Failed to initialize application:', error);
        
        // Show critical error message
        document.body.innerHTML = `
            <div class="critical-error">
                <h1>Critical Error</h1>
                <p>The application failed to initialize. Please reload the page.</p>
                <p>If the problem persists, check the console for technical details.</p>
                <button onclick="location.reload()">Reload Page</button>
            </div>
        `;
    }
});
