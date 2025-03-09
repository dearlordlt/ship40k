// Ship Classes from Rogue Trader Core Rulebook
export const SHIP_CLASSES = {
    RAIDER: {
        name: "Raider",
        description: "Swift and lightly armed vessels designed for reconnaissance and commerce raiding.",
        baseHullSpace: 25,
        basePower: 30,
        baseShipPoints: 25,
        crewRequirement: 15000,
        baseSpeed: 10,
        maneuverability: 35,
        detection: 25,
        hull: 35,
        armor: 15,
        turningRadius: 2,
        maxComponents: {
            weapons: 2,
            essential: 3,
            supplemental: 2,
            augmentations: 1
        }
    },
    SWORD: {
        name: "Sword Class Frigate",
        description: "Versatile escort vessels that form the backbone of many Imperial Navy patrol groups.",
        baseHullSpace: 35,
        basePower: 40,
        baseShipPoints: 30,
        crewRequirement: 20000,
        baseSpeed: 8,
        maneuverability: 30,
        detection: 30,
        hull: 40,
        armor: 18,
        turningRadius: 2,
        maxComponents: {
            weapons: 3,
            essential: 4,
            supplemental: 3,
            augmentations: 2
        }
    },
    FIRESTORM: {
        name: "Firestorm Class Frigate",
        description: "Heavy escort vessels specializing in anti-fighter defense.",
        baseHullSpace: 40,
        basePower: 45,
        baseShipPoints: 35,
        crewRequirement: 25000,
        baseSpeed: 7,
        maneuverability: 25,
        detection: 35,
        hull: 45,
        armor: 20,
        turningRadius: 3,
        maxComponents: {
            weapons: 4,
            essential: 4,
            supplemental: 3,
            augmentations: 2
        }
    },
    DAUNTLESS: {
        name: "Dauntless Light Cruiser",
        description: "Light cruisers known for their speed and versatility.",
        baseHullSpace: 50,
        basePower: 55,
        baseShipPoints: 45,
        crewRequirement: 65000,
        baseSpeed: 6,
        maneuverability: 20,
        detection: 40,
        hull: 55,
        armor: 25,
        turningRadius: 3,
        maxComponents: {
            weapons: 5,
            essential: 5,
            supplemental: 4,
            augmentations: 3
        }
    },
    LUNAR: {
        name: "Lunar Class Cruiser",
        description: "Standard Imperial cruiser, well-balanced and reliable.",
        baseHullSpace: 60,
        basePower: 65,
        baseShipPoints: 55,
        crewRequirement: 95000,
        baseSpeed: 5,
        maneuverability: 15,
        detection: 45,
        hull: 65,
        armor: 30,
        turningRadius: 4,
        maxComponents: {
            weapons: 6,
            essential: 6,
            supplemental: 5,
            augmentations: 3
        }
    },
    GOTHIC: {
        name: "Gothic Class Cruiser",
        description: "Heavy cruiser specializing in long-range combat.",
        baseHullSpace: 65,
        basePower: 70,
        baseShipPoints: 60,
        crewRequirement: 100000,
        baseSpeed: 4,
        maneuverability: 15,
        detection: 45,
        hull: 70,
        armor: 35,
        turningRadius: 4,
        maxComponents: {
            weapons: 7,
            essential: 6,
            supplemental: 5,
            augmentations: 3
        }
    }
};

// Component Categories
export const COMPONENT_CATEGORIES = {
    WEAPONS: "weapons",
    ESSENTIAL: "essential",
    SUPPLEMENTAL: "supplemental",
    AUGMENTATIONS: "augmentations"
};

// Resource Types
export const RESOURCE_TYPES = {
    HULL_SPACE: "hullSpace",
    POWER: "power",
    SHIP_POINTS: "shipPoints"
};

// Crew Ranks
export const CREW_RANKS = [
    "Captain",
    "First Officer",
    "Master of the Vox",
    "Chief Engineer",
    "Navigator",
    "Master of Arms",
    "Ship's Confessor",
    "Chief Medicae",
    "Master of the Plasma",
    "Void Master"
];

// Crew Phrases (Warhammer 40k style)
export const CREW_PHRASES = {
    GENERAL: [
        "For the Emperor!",
        "The Machine Spirit is willing!",
        "By the Golden Throne!",
        "The Emperor protects!",
        "Praise the Omnissiah!",
        "In His name, we sail the void!",
        "The warp guides us!",
        "Machine spirit, hear our prayer!"
    ],
    COMBAT: [
        "Fire the macro-cannons!",
        "Shields to full power!",
        "Brace for impact!",
        "Launch the torpedoes!",
        "The enemy shall know His wrath!",
        "All batteries, open fire!",
        "For the glory of the Imperium!"
    ],
    WARP: [
        "The Gellar Field holds!",
        "Emperor protect us in the immaterium!",
        "The Navigator sees true!",
        "The warp churns with His light!",
        "Keep faith in the Emperor's guidance!"
    ]
};

// Ship Name Prefixes and Suffixes
export const SHIP_NAME_PARTS = {
    PREFIXES: [
        "Divine",
        "Imperial",
        "Righteous",
        "Eternal",
        "Blessed",
        "Sacred",
        "Vengeful",
        "Glorious",
        "Indomitable",
        "Relentless"
    ],
    SUFFIXES: [
        "Fury",
        "Vengeance",
        "Light",
        "Redemption",
        "Glory",
        "Triumph",
        "Crusader",
        "Defender",
        "Guardian",
        "Retribution"
    ]
};

// Combat Status Effects
export const COMBAT_EFFECTS = {
    SHIELDS_DOWN: "shields_down",
    HULL_BREACH: "hull_breach",
    POWER_LOSS: "power_loss",
    WEAPON_DAMAGE: "weapon_damage",
    CREW_CASUALTIES: "crew_casualties",
    FIRE: "fire",
    TARGETING_MALFUNCTION: "targeting_malfunction"
};

// Warp Travel Events
export const WARP_EVENTS = {
    CALM: {
        name: "Calm Warp",
        description: "The immaterium is unusually peaceful.",
        probability: 40,
        effect: "Reduce travel time by 10%"
    },
    STORM: {
        name: "Warp Storm",
        description: "Turbulent warp energies buffet the ship.",
        probability: 25,
        effect: "Increase travel time by 20%, chance of Gellar Field strain"
    },
    VOICES: {
        name: "Whispers in the Void",
        description: "Crew reports hearing strange whispers.",
        probability: 15,
        effect: "Slight decrease in crew morale"
    },
    SIGHTING: {
        name: "Shadow Sighting",
        description: "Unknown entities spotted in the warp.",
        probability: 10,
        effect: "Navigator must make a challenging roll"
    },
    BREACH: {
        name: "Minor Breach",
        description: "Brief fluctuation in the Gellar Field.",
        probability: 10,
        effect: "Small chance of crew casualties"
    }
};
