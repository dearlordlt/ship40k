import { COMPONENT_CATEGORIES } from './constants.js';

// Component Definitions
export const COMPONENTS = {
    // Weapons
    LANCE_BATTERY: {
        id: 'lance_battery',
        name: 'Lance Battery',
        category: COMPONENT_CATEGORIES.WEAPONS,
        description: 'High-powered energy weapon effective against armored targets.',
        hullSpaceRequired: 4,
        powerRequired: 5,
        shipPoints: 6,
        stats: {
            damage: 2,
            range: 3,
            accuracy: 85,
            criticalChance: 15
        }
    },
    MACRO_CANNON: {
        id: 'macro_cannon',
        name: 'Macro Cannon Battery',
        category: COMPONENT_CATEGORIES.WEAPONS,
        description: 'Traditional ship-to-ship weapon battery firing massive shells.',
        hullSpaceRequired: 5,
        powerRequired: 4,
        shipPoints: 5,
        stats: {
            damage: 3,
            range: 2,
            accuracy: 75,
            criticalChance: 20
        }
    },
    TORPEDO_TUBES: {
        id: 'torpedo_tubes',
        name: 'Torpedo Tubes',
        category: COMPONENT_CATEGORIES.WEAPONS,
        description: 'Launch devastating torpedoes at enemy vessels.',
        hullSpaceRequired: 3,
        powerRequired: 3,
        shipPoints: 4,
        stats: {
            damage: 4,
            range: 4,
            accuracy: 65,
            criticalChance: 25
        }
    },

    // Essential Components
    WARP_ENGINE: {
        id: 'warp_engine',
        name: 'Warp Engine',
        category: COMPONENT_CATEGORIES.ESSENTIAL,
        description: 'Allows travel through the immaterium.',
        hullSpaceRequired: 8,
        powerRequired: 10,
        shipPoints: 10,
        stats: {
            warpSpeed: 3,
            reliability: 90,
            gellarFieldStrength: 85
        }
    },
    PLASMA_DRIVE: {
        id: 'plasma_drive',
        name: 'Plasma Drive',
        category: COMPONENT_CATEGORIES.ESSENTIAL,
        description: 'Main propulsion system for real-space travel.',
        hullSpaceRequired: 6,
        powerRequired: 8,
        shipPoints: 8,
        stats: {
            thrust: 4,
            efficiency: 85,
            reliability: 95
        }
    },
    VOID_SHIELD: {
        id: 'void_shield',
        name: 'Void Shield',
        category: COMPONENT_CATEGORIES.ESSENTIAL,
        description: 'Energy shield protecting against attacks.',
        hullSpaceRequired: 4,
        powerRequired: 6,
        shipPoints: 7,
        stats: {
            protection: 3,
            regeneration: 2,
            stability: 90
        }
    },

    // Supplemental Systems
    AUGUR_ARRAY: {
        id: 'augur_array',
        name: 'Augur Array',
        category: COMPONENT_CATEGORIES.SUPPLEMENTAL,
        description: 'Advanced scanning and detection systems.',
        hullSpaceRequired: 2,
        powerRequired: 3,
        shipPoints: 4,
        stats: {
            range: 5,
            accuracy: 90,
            interference: 75
        }
    },
    CARGO_HOLD: {
        id: 'cargo_hold',
        name: 'Cargo Hold',
        category: COMPONENT_CATEGORIES.SUPPLEMENTAL,
        description: 'Storage space for goods and materials.',
        hullSpaceRequired: 4,
        powerRequired: 1,
        shipPoints: 2,
        stats: {
            capacity: 1000,
            security: 70
        }
    },
    TELEPORTARIUM: {
        id: 'teleportarium',
        name: 'Teleportarium',
        category: COMPONENT_CATEGORIES.SUPPLEMENTAL,
        description: 'Allows teleportation of crew and materials.',
        hullSpaceRequired: 3,
        powerRequired: 5,
        shipPoints: 6,
        stats: {
            range: 2,
            accuracy: 85,
            capacity: 10
        }
    },

    // Hull Augmentations
    REINFORCED_HULL: {
        id: 'reinforced_hull',
        name: 'Reinforced Hull',
        category: COMPONENT_CATEGORIES.AUGMENTATIONS,
        description: 'Additional armor plating and structural reinforcement.',
        hullSpaceRequired: 3,
        powerRequired: 0,
        shipPoints: 5,
        stats: {
            armor: 2,
            integrity: 25
        }
    },
    LIFE_SUSTAINER: {
        id: 'life_sustainer',
        name: 'Life Sustainer',
        category: COMPONENT_CATEGORIES.AUGMENTATIONS,
        description: 'Enhanced life support and crew quarters.',
        hullSpaceRequired: 2,
        powerRequired: 2,
        shipPoints: 3,
        stats: {
            crewEfficiency: 15,
            morale: 10
        }
    }
};

// Combat Rules
export const COMBAT_RULES = {
    RANGE_BRACKETS: {
        CLOSE: {
            name: 'Close Range',
            distance: 1,
            accuracyMod: 10,
            damageMod: 0
        },
        MEDIUM: {
            name: 'Medium Range',
            distance: 2,
            accuracyMod: 0,
            damageMod: 0
        },
        LONG: {
            name: 'Long Range',
            distance: 3,
            accuracyMod: -10,
            damageMod: -1
        },
        EXTREME: {
            name: 'Extreme Range',
            distance: 4,
            accuracyMod: -20,
            damageMod: -2
        }
    },
    CRITICAL_EFFECTS: {
        MINOR: {
            threshold: 10,
            effects: ['Minor system damage', 'Crew casualties']
        },
        MAJOR: {
            threshold: 20,
            effects: ['Major system failure', 'Hull breach']
        },
        CATASTROPHIC: {
            threshold: 30,
            effects: ['Catastrophic damage', 'Component destruction']
        }
    },
    COMBAT_PHASES: [
        'Movement',
        'Shooting',
        'Damage Resolution',
        'Critical Effects',
        'Morale Check'
    ]
};

// Warp Travel Rules
export const WARP_RULES = {
    NAVIGATION_DIFFICULTY: {
        CALM: {
            difficulty: 0,
            timeMultiplier: 1
        },
        TROUBLED: {
            difficulty: 10,
            timeMultiplier: 1.2
        },
        STORMY: {
            difficulty: 20,
            timeMultiplier: 1.5
        },
        TEMPESTUOUS: {
            difficulty: 30,
            timeMultiplier: 2
        }
    },
    GELLAR_FIELD_STATUS: {
        STABLE: {
            status: 'Stable',
            effect: 'Normal operation'
        },
        FLUCTUATING: {
            status: 'Fluctuating',
            effect: 'Minor warp intrusion risk'
        },
        FAILING: {
            status: 'Failing',
            effect: 'Major warp intrusion risk'
        }
    }
};

// Resource Management Rules
export const RESOURCE_RULES = {
    POWER_MANAGEMENT: {
        OPTIMAL: {
            threshold: 90,
            effect: 'All systems at full efficiency'
        },
        STRAINED: {
            threshold: 75,
            effect: 'Minor performance degradation'
        },
        CRITICAL: {
            threshold: 50,
            effect: 'Major performance degradation'
        },
        FAILING: {
            threshold: 25,
            effect: 'System failures imminent'
        }
    },
    CREW_EFFICIENCY: {
        HIGH: {
            threshold: 90,
            effect: 'Enhanced performance'
        },
        NORMAL: {
            threshold: 75,
            effect: 'Standard performance'
        },
        LOW: {
            threshold: 50,
            effect: 'Reduced performance'
        },
        CRITICAL: {
            threshold: 25,
            effect: 'Severe performance degradation'
        }
    }
};
