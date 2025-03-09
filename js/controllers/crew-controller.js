import { CrewMember, CrewRoster } from '../models/crew.js';
import { crewTemplates, crewRoles, crewQuirks } from '../data/game-data.js';
import { showNotification, createCrewMemberElement, clearElement } from '../utils/ui-utils.js';
import { getRandomElement } from '../utils/game-utils.js';

class CrewController {
    constructor() {
        this.currentShip = null;
        this.crewRoster = null;
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Add crew member button
        document.getElementById('add-crew-btn')?.addEventListener('click', () => this.addCrewMember());

        // Listen for ship selection
        document.addEventListener('shipSelected', (event) => {
            this.handleShipSelected(event.detail.ship, event.detail.crew);
        });

        // Listen for ship creation
        document.addEventListener('shipCreated', (event) => {
            this.handleShipSelected(event.detail.ship, event.detail.crew);
        });

        // Role selection change (for updating available positions)
        document.getElementById('crew-role')?.addEventListener('change', (e) => 
            this.updateAvailablePositions(e.target.value)
        );
    }

    handleShipSelected(ship, crew) {
        this.currentShip = ship;
        this.crewRoster = crew;

        // Initialize with default crew
        this.initializeDefaultCrew();
        
        // Update displays
        this.updateCrewDisplay();
        this.updateAvailablePositions();
    }

    initializeDefaultCrew() {
        if (!this.crewRoster || !this.currentShip) return;

        // Add default crew members
        crewTemplates.defaultCrew.forEach(crewData => {
            const crewMember = new CrewMember({
                ...crewData,
                name: this.generateCrewName(crewData.role)
            });
            this.crewRoster.addMember(crewMember);
        });
    }

    generateCrewName(role) {
        if (role === "Captain" && this.currentShip) {
            return `Captain ${this.currentShip.name.split(' ')[0]}`;
        }
        return crewTemplates.defaultCrew.find(c => c.role === role)?.name || "Unknown";
    }

    updateCrewDisplay() {
        if (!this.currentShip || !this.crewRoster) return;

        // Update crew overview
        const crewOverview = document.getElementById('crew-overview');
        if (crewOverview) {
            crewOverview.innerHTML = `
                <div class="ship-stat">
                    <span class="ship-stat-label">Ship:</span>
                    <span>${this.currentShip.name}</span>
                </div>
                <div class="ship-stat">
                    <span class="ship-stat-label">Crew Rating:</span>
                    <span>${this.currentShip._crewStats.rating}</span>
                </div>
                <div class="ship-stat">
                    <span class="ship-stat-label">Crew Morale:</span>
                    <span>${this.currentShip._crewStats.morale}%</span>
                </div>
                <div class="ship-stat">
                    <span class="ship-stat-label">Population:</span>
                    <span>${this.currentShip._crewStats.population.toLocaleString()} souls</span>
                </div>
            `;
        }

        // Update crew list
        const keyCrewList = document.getElementById('key-crew-list');
        if (keyCrewList) {
            clearElement(keyCrewList);
            this.crewRoster.members.forEach(crewMember => {
                const crewElement = createCrewMemberElement(crewMember);
                keyCrewList.appendChild(crewElement);
            });
        }
    }

    addCrewMember() {
        if (!this.currentShip) {
            showNotification('Please select or create a ship first');
            return;
        }

        const nameInput = document.getElementById('crew-name');
        const roleSelect = document.getElementById('crew-role');
        const skillSelect = document.getElementById('crew-skill');
        const quirkSelect = document.getElementById('crew-quirk');

        if (!nameInput?.value || !roleSelect?.value) {
            showNotification('Please provide a name and role for the crew member');
            return;
        }

        const newCrewMember = new CrewMember({
            name: nameInput.value.trim(),
            role: roleSelect.value,
            skill: parseInt(skillSelect?.value || '30'),
            quirk: quirkSelect?.value || this.getRandomQuirk(),
            health: 100
        });

        // Check if role is unique and already exists
        const roleData = crewRoles.find(r => r.value === newCrewMember.role);
        if (roleData?.unique && this.crewRoster.getMember(newCrewMember.role)) {
            showNotification(`${roleData.label} position is unique and already filled`);
            return;
        }

        // Add to roster
        this.crewRoster.addMember(newCrewMember);
        
        showNotification(`${newCrewMember.name} has joined your crew`);
        
        // Update displays
        this.updateCrewDisplay();
        this.updateAvailablePositions();
        
        // Reset form
        this.resetCrewForm();
    }

    getRandomQuirk() {
        return getRandomElement(crewQuirks).value;
    }

    updateAvailablePositions(selectedRole = null) {
        const roleSelect = document.getElementById('crew-role');
        if (!roleSelect) return;

        const currentSelection = selectedRole || roleSelect.value;
        
        clearElement(roleSelect);

        crewRoles.forEach(role => {
            // Skip if role is unique and already taken (unless it's the current selection)
            if (role.unique && 
                this.crewRoster?.getMember(role.value) && 
                role.value !== currentSelection) {
                return;
            }

            const option = document.createElement('option');
            option.value = role.value;
            option.textContent = role.label;
            roleSelect.appendChild(option);
        });

        // Restore selection if possible
        if (currentSelection) {
            roleSelect.value = currentSelection;
        }
    }

    populateCrewQuirks() {
        const quirkSelect = document.getElementById('crew-quirk');
        if (!quirkSelect) return;

        clearElement(quirkSelect);

        // Add "random" option
        const randomOption = document.createElement('option');
        randomOption.value = "";
        randomOption.textContent = "-- Random Quirk --";
        quirkSelect.appendChild(randomOption);

        // Add all quirks
        crewQuirks.forEach(quirk => {
            const option = document.createElement('option');
            option.value = quirk.value;
            option.textContent = `${quirk.label} (${quirk.effect})`;
            quirkSelect.appendChild(option);
        });
    }

    resetCrewForm() {
        const form = document.getElementById('crew-form');
        if (form) {
            form.reset();
        }
    }

    // Utility method to get crew effectiveness for ship systems
    getCrewEffectiveness(system) {
        if (!this.crewRoster) return 0;

        let effectiveness = this.crewRoster.getCrewEffectiveness();
        const relevantCrew = this.getRelevantCrewForSystem(system);

        if (relevantCrew) {
            effectiveness = Math.round((effectiveness + relevantCrew.getEffectiveSkill()) / 2);
        }

        return effectiveness;
    }

    getRelevantCrewForSystem(system) {
        if (!this.crewRoster) return null;

        switch (system) {
            case 'weapons':
                return this.crewRoster.getMember('Master Gunner');
            case 'navigation':
                return this.crewRoster.getMember('Navigator');
            case 'engineering':
                return this.crewRoster.getMember('Chief Engineer');
            case 'command':
                return this.crewRoster.getMember('Captain');
            case 'helm':
                return this.crewRoster.getMember('Helmsman');
            default:
                return null;
        }
    }
}

export default CrewController;
