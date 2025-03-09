class Ship {
    constructor(config) {
        this.id = config.id;
        this.name = config.name;
        this.class = config.class;
        this.hull = {
            integrity: config.hull.integrity,
            current: config.hull.integrity,
            armor: config.hull.armor
        };
        this.speed = config.speed;
        this.maneuverability = config.maneuverability;
        this.crew = null; // Will be set by CrewRoster instance
        this._crewStats = {
            rating: config.crew.rating,
            morale: config.crew.morale,
            population: config.crew.population
        };
        this.detection = config.detection;
        this.weapons = {
            prow: config.weapons.prow,
            dorsal: config.weapons.dorsal,
            port: config.weapons.port,
            starboard: config.weapons.starboard
        };
        this.components = config.components.map(comp => ({...comp}));
        this.description = config.description;
    }

    get crewStats() {
        return this._crewStats;
    }

    isComponentOperational(name) {
        const component = this.components.find(c => c.name === name);
        return component && component.status === "operational";
    }

    damageComponent(name) {
        const component = this.components.find(c => c.name === name);
        if (component && component.status === "operational") {
            component.status = "damaged";
            return true;
        }
        return false;
    }

    destroyComponent(name) {
        const component = this.components.find(c => c.name === name);
        if (component && component.status !== "destroyed") {
            component.status = "destroyed";
            return true;
        }
        return false;
    }

    getOperationalWeapons() {
        if (!this.isComponentOperational("Weapon Systems")) {
            return [];
        }

        return Object.entries(this.weapons)
            .filter(([_, weapon]) => weapon)
            .map(([location, type]) => ({
                location,
                type
            }));
    }

    // Ship status methods
    getHullPercentage() {
        return (this.hull.current / this.hull.integrity) * 100;
    }

    isOperational() {
        return this.hull.current > 0;
    }

    // Component management
    getComponent(name) {
        return this.components.find(comp => comp.name === name);
    }

    isComponentOperational(name) {
        const component = this.getComponent(name);
        return component && component.status === "operational";
    }

    damageComponent(name) {
        const component = this.getComponent(name);
        if (component && component.status === "operational") {
            component.status = "damaged";
            return true;
        }
        return false;
    }

    destroyComponent(name) {
        const component = this.getComponent(name);
        if (component && component.status !== "destroyed") {
            component.status = "destroyed";
            return true;
        }
        return false;
    }

    // Weapon systems
    getOperationalWeapons() {
        if (!this.isComponentOperational("Weapon Systems")) {
            return [];
        }
        return Object.entries(this.weapons)
            .filter(([_, weapon]) => weapon)
            .map(([location, weapon]) => ({
                location,
                type: weapon
            }));
    }

    // Combat methods
    takeDamage(amount) {
        const reducedDamage = Math.max(1, amount - this.hull.armor / 2);
        this.hull.current = Math.max(0, this.hull.current - reducedDamage);
        return reducedDamage;
    }

    calculateHitChance(targetShip, weaponType) {
        let baseHitChance = this._crewStats.rating;
        
        // Get gunner bonus if available
        if (this.crew) {
            const gunner = this.crew.getMember("Master Gunner");
            if (gunner) {
                baseHitChance += Math.floor(gunner.getEffectiveSkill() / 10);
            }
        }
        
        // Adjust based on ship maneuverability difference
        const maneuverDiff = this.maneuverability - targetShip.maneuverability;
        baseHitChance += maneuverDiff / 2;
        
        // Adjust based on weapon type
        if (weaponType === "Lance Battery") {
            baseHitChance += 5;
        } else if (weaponType === "Torpedo Tubes") {
            baseHitChance -= 10;
        }
        
        // Adjust based on sensor status
        if (!this.isComponentOperational("Sensors")) {
            baseHitChance -= 15;
        }
        
        return Math.min(Math.max(baseHitChance, 10), 95);
    }

    // Utility methods
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            class: this.class,
            hull: {...this.hull},
            speed: this.speed,
            maneuverability: this.maneuverability,
            crew: {...this.crew},
            detection: this.detection,
            weapons: {...this.weapons},
            components: this.components.map(comp => ({...comp})),
            description: this.description
        };
    }

    static fromJSON(json) {
        return new Ship(json);
    }

    clone() {
        return Ship.fromJSON(this.toJSON());
    }
}

export default Ship;
