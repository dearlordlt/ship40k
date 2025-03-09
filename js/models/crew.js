class CrewMember {
    constructor(config) {
        this.name = config.name;
        this.role = config.role;
        this.skill = config.skill;
        this.quirk = config.quirk;
        this.health = config.health || 100;
    }

    isAlive() {
        return this.health > 0;
    }

    takeDamage(amount) {
        this.health = Math.max(0, this.health - amount);
        return !this.isAlive();
    }

    heal(amount) {
        this.health = Math.min(100, this.health + amount);
        return this.health;
    }

    // Get skill modifier based on health and quirk
    getEffectiveSkill() {
        let effectiveSkill = this.skill;
        
        // Health affects performance
        if (this.health < 25) {
            effectiveSkill *= 0.5; // Severely wounded
        } else if (this.health < 50) {
            effectiveSkill *= 0.75; // Wounded
        } else if (this.health < 75) {
            effectiveSkill *= 0.9; // Injured
        }

        // Quirk modifiers
        switch (this.quirk) {
            case "Zealous":
                effectiveSkill *= 1.1; // More effective when motivated
                break;
            case "Paranoid":
                effectiveSkill *= 0.9; // Less effective due to overthinking
                break;
            case "Reckless":
                effectiveSkill *= Math.random() > 0.5 ? 1.2 : 0.8; // Unpredictable performance
                break;
            case "Cowardly":
                effectiveSkill *= this.health < 50 ? 0.7 : 1; // Worse when under pressure
                break;
            // Add more quirk effects as needed
        }

        return Math.round(effectiveSkill);
    }

    // Role-specific abilities
    performDuty() {
        const effectiveSkill = this.getEffectiveSkill();
        
        switch (this.role) {
            case "Captain":
                return {
                    type: "leadership",
                    value: Math.round(effectiveSkill * 1.2),
                    description: "Provides leadership bonus to crew performance"
                };
            case "Navigator":
                return {
                    type: "navigation",
                    value: effectiveSkill,
                    description: "Affects ship maneuverability and warp travel"
                };
            case "Master Gunner":
                return {
                    type: "gunnery",
                    value: effectiveSkill,
                    description: "Improves weapon accuracy and damage"
                };
            case "Chief Engineer":
                return {
                    type: "engineering",
                    value: effectiveSkill,
                    description: "Affects repair efficiency and system stability"
                };
            case "Helmsman":
                return {
                    type: "piloting",
                    value: effectiveSkill,
                    description: "Improves ship handling and evasion"
                };
            default:
                return {
                    type: "standard",
                    value: effectiveSkill,
                    description: "Standard crew performance"
                };
        }
    }

    // Utility methods
    toJSON() {
        return {
            name: this.name,
            role: this.role,
            skill: this.skill,
            quirk: this.quirk,
            health: this.health
        };
    }

    static fromJSON(json) {
        return new CrewMember(json);
    }

    clone() {
        return CrewMember.fromJSON(this.toJSON());
    }
}

class CrewRoster {
    constructor(members = []) {
        this.members = members.map(member => 
            member instanceof CrewMember ? member : new CrewMember(member)
        );
    }

    addMember(member) {
        const crewMember = member instanceof CrewMember ? member : new CrewMember(member);
        // Replace existing crew member with same role if exists
        const existingIndex = this.members.findIndex(m => m.role === crewMember.role);
        if (existingIndex !== -1) {
            this.members[existingIndex] = crewMember;
        } else {
            this.members.push(crewMember);
        }
    }

    removeMember(role) {
        this.members = this.members.filter(member => member.role !== role);
    }

    getMember(role) {
        return this.members.find(member => member.role === role);
    }

    getEffectiveCrew() {
        return this.members.filter(member => member.isAlive());
    }

    // Calculate overall crew effectiveness
    getCrewEffectiveness() {
        const livingCrew = this.getEffectiveCrew();
        if (livingCrew.length === 0) return 0;

        const totalSkill = livingCrew.reduce((sum, member) => sum + member.getEffectiveSkill(), 0);
        return Math.round(totalSkill / livingCrew.length);
    }

    // Apply damage to random crew members
    takeCasualties(amount, count) {
        const livingCrew = this.getEffectiveCrew();
        const casualties = [];

        for (let i = 0; i < count && livingCrew.length > 0; i++) {
            const randomIndex = Math.floor(Math.random() * livingCrew.length);
            const casualty = livingCrew[randomIndex];
            casualty.takeDamage(amount);
            casualties.push({
                name: casualty.name,
                role: casualty.role,
                survived: casualty.isAlive()
            });
            if (!casualty.isAlive()) {
                livingCrew.splice(randomIndex, 1);
            }
        }

        return casualties;
    }

    // Utility methods
    toJSON() {
        return this.members.map(member => member.toJSON());
    }

    static fromJSON(json) {
        return new CrewRoster(json.map(member => CrewMember.fromJSON(member)));
    }

    clone() {
        return CrewRoster.fromJSON(this.toJSON());
    }
}

export { CrewMember, CrewRoster };
