import { SHIP_CLASSES, COMPONENT_CATEGORIES, RESOURCE_TYPES } from '../config/constants.js';
import { COMPONENTS } from '../config/gameRules.js';

export class Ship {
    constructor(name, shipClass) {
        if (!SHIP_CLASSES[shipClass]) {
            throw new Error(`Invalid ship class: ${shipClass}`);
        }

        // Basic ship information
        this.name = name;
        this.shipClass = shipClass;
        this.classData = SHIP_CLASSES[shipClass];

        // Components storage
        this.components = {
            [COMPONENT_CATEGORIES.WEAPONS]: [],
            [COMPONENT_CATEGORIES.ESSENTIAL]: [],
            [COMPONENT_CATEGORIES.SUPPLEMENTAL]: [],
            [COMPONENT_CATEGORIES.AUGMENTATIONS]: []
        };

        // Resource tracking
        this.resources = {
            [RESOURCE_TYPES.HULL_SPACE]: this.classData.baseHullSpace,
            [RESOURCE_TYPES.POWER]: this.classData.basePower,
            [RESOURCE_TYPES.SHIP_POINTS]: this.classData.baseShipPoints
        };

        // Current resource usage
        this.resourcesUsed = {
            [RESOURCE_TYPES.HULL_SPACE]: 0,
            [RESOURCE_TYPES.POWER]: 0,
            [RESOURCE_TYPES.SHIP_POINTS]: 0
        };

        // Ship status
        this.status = {
            hullIntegrity: 100,
            shields: 100,
            crewMorale: 100,
            gellarField: 100
        };

        // Crew information
        this.crew = {
            total: this.classData.crewRequirement,
            current: this.classData.crewRequirement,
            casualties: 0
        };
    }

    // Component Management
    canAddComponent(componentId) {
        const component = COMPONENTS[componentId];
        if (!component) {
            throw new Error(`Invalid component: ${componentId}`);
        }

        // Check if we've reached the maximum components for this category
        const categoryComponents = this.components[component.category];
        if (categoryComponents.length >= this.classData.maxComponents[component.category]) {
            return {
                allowed: false,
                reason: `Maximum ${component.category} components reached`
            };
        }

        // Check resources
        const resourcesAvailable = {
            [RESOURCE_TYPES.HULL_SPACE]: this.resources[RESOURCE_TYPES.HULL_SPACE] - this.resourcesUsed[RESOURCE_TYPES.HULL_SPACE],
            [RESOURCE_TYPES.POWER]: this.resources[RESOURCE_TYPES.POWER] - this.resourcesUsed[RESOURCE_TYPES.POWER],
            [RESOURCE_TYPES.SHIP_POINTS]: this.resources[RESOURCE_TYPES.SHIP_POINTS] - this.resourcesUsed[RESOURCE_TYPES.SHIP_POINTS]
        };

        if (component.hullSpaceRequired > resourcesAvailable[RESOURCE_TYPES.HULL_SPACE]) {
            return {
                allowed: false,
                reason: 'Insufficient hull space'
            };
        }

        if (component.powerRequired > resourcesAvailable[RESOURCE_TYPES.POWER]) {
            return {
                allowed: false,
                reason: 'Insufficient power'
            };
        }

        if (component.shipPoints > resourcesAvailable[RESOURCE_TYPES.SHIP_POINTS]) {
            return {
                allowed: false,
                reason: 'Insufficient ship points'
            };
        }

        return {
            allowed: true
        };
    }

    addComponent(componentId) {
        const validationResult = this.canAddComponent(componentId);
        if (!validationResult.allowed) {
            throw new Error(validationResult.reason);
        }

        const component = COMPONENTS[componentId];
        
        // Add component to the appropriate category
        this.components[component.category].push({
            ...component,
            status: 100, // Component health/status
            installed: new Date().toISOString()
        });

        // Update resource usage
        this.resourcesUsed[RESOURCE_TYPES.HULL_SPACE] += component.hullSpaceRequired;
        this.resourcesUsed[RESOURCE_TYPES.POWER] += component.powerRequired;
        this.resourcesUsed[RESOURCE_TYPES.SHIP_POINTS] += component.shipPoints;

        return true;
    }

    removeComponent(componentId, categoryId) {
        const category = this.components[categoryId];
        const componentIndex = category.findIndex(comp => comp.id === componentId);

        if (componentIndex === -1) {
            throw new Error(`Component ${componentId} not found in category ${categoryId}`);
        }

        const component = category[componentIndex];

        // Remove component and restore resources
        category.splice(componentIndex, 1);
        this.resourcesUsed[RESOURCE_TYPES.HULL_SPACE] -= component.hullSpaceRequired;
        this.resourcesUsed[RESOURCE_TYPES.POWER] -= component.powerRequired;
        this.resourcesUsed[RESOURCE_TYPES.SHIP_POINTS] -= component.shipPoints;

        return true;
    }

    // Resource Management
    getResourceUsage() {
        return {
            hullSpace: {
                total: this.resources[RESOURCE_TYPES.HULL_SPACE],
                used: this.resourcesUsed[RESOURCE_TYPES.HULL_SPACE],
                available: this.resources[RESOURCE_TYPES.HULL_SPACE] - this.resourcesUsed[RESOURCE_TYPES.HULL_SPACE]
            },
            power: {
                total: this.resources[RESOURCE_TYPES.POWER],
                used: this.resourcesUsed[RESOURCE_TYPES.POWER],
                available: this.resources[RESOURCE_TYPES.POWER] - this.resourcesUsed[RESOURCE_TYPES.POWER]
            },
            shipPoints: {
                total: this.resources[RESOURCE_TYPES.SHIP_POINTS],
                used: this.resourcesUsed[RESOURCE_TYPES.SHIP_POINTS],
                available: this.resources[RESOURCE_TYPES.SHIP_POINTS] - this.resourcesUsed[RESOURCE_TYPES.SHIP_POINTS]
            }
        };
    }

    // Combat Methods
    takeDamage(amount, type = 'normal') {
        if (this.status.shields > 0) {
            // Shields absorb some damage
            const shieldAbsorption = 0.5;
            const absorbedDamage = amount * shieldAbsorption;
            const remainingDamage = amount - absorbedDamage;

            this.status.shields = Math.max(0, this.status.shields - absorbedDamage);
            amount = remainingDamage;
        }

        this.status.hullIntegrity = Math.max(0, this.status.hullIntegrity - amount);

        // Calculate crew casualties based on damage
        const casualtyRate = 0.01; // 1% of crew per point of hull damage
        const casualties = Math.floor(this.crew.current * (amount * casualtyRate));
        this.crew.casualties += casualties;
        this.crew.current = Math.max(0, this.crew.current - casualties);

        return {
            hullDamage: amount,
            casualties: casualties,
            status: this.getStatus()
        };
    }

    // Status Methods
    getStatus() {
        return {
            ...this.status,
            crew: this.crew,
            components: this.components,
            resources: this.getResourceUsage()
        };
    }

    // Serialization
    toJSON() {
        return {
            name: this.name,
            shipClass: this.shipClass,
            components: this.components,
            resources: this.resources,
            resourcesUsed: this.resourcesUsed,
            status: this.status,
            crew: this.crew
        };
    }

    static fromJSON(data) {
        const ship = new Ship(data.name, data.shipClass);
        ship.components = data.components;
        ship.resources = data.resources;
        ship.resourcesUsed = data.resourcesUsed;
        ship.status = data.status;
        ship.crew = data.crew;
        return ship;
    }
}
