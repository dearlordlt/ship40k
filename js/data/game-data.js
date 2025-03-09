export const predefinedShips = [
    {
        id: 1,
        name: "Dauntless Light Cruiser",
        class: "Light Cruiser",
        hull: {
            integrity: 60,
            current: 60,
            armor: 18
        },
        speed: 7,
        maneuverability: 35,
        crew: {
            rating: 30,
            morale: 80,
            population: 35000
        },
        detection: 30,
        weapons: {
            prow: "Lance Battery",
            dorsal: "Weapons Battery",
            port: "Weapons Battery",
            starboard: "Weapons Battery"
        },
        components: [
            { name: "Bridge", status: "operational" },
            { name: "Engines", status: "operational" },
            { name: "Life Support", status: "operational" },
            { name: "Void Shields", status: "operational" },
            { name: "Weapon Systems", status: "operational" },
            { name: "Sensors", status: "operational" }
        ],
        description: "A versatile ship with balanced characteristics. Popular among Rogue Traders for its combination of firepower and speed."
    },
    {
        id: 2,
        name: "Lunar Class Cruiser",
        class: "Cruiser",
        hull: {
            integrity: 70,
            current: 70,
            armor: 20
        },
        speed: 5,
        maneuverability: 25,
        crew: {
            rating: 35,
            morale: 85,
            population: 95000
        },
        detection: 25,
        weapons: {
            prow: "Torpedo Tubes",
            dorsal: "Weapons Battery",
            port: "Weapons Battery",
            starboard: "Weapons Battery"
        },
        components: [
            { name: "Bridge", status: "operational" },
            { name: "Engines", status: "operational" },
            { name: "Life Support", status: "operational" },
            { name: "Void Shields", status: "operational" },
            { name: "Weapon Systems", status: "operational" },
            { name: "Sensors", status: "operational" }
        ],
        description: "A reliable mainstay of Imperial Navy battlegroups. Its torpedo tubes pack a punch that enemy vessels learn to fear."
    },
    {
        id: 3,
        name: "Sword Class Frigate",
        class: "Frigate",
        hull: {
            integrity: 35,
            current: 35,
            armor: 15
        },
        speed: 9,
        maneuverability: 45,
        crew: {
            rating: 30,
            morale: 75,
            population: 20000
        },
        detection: 40,
        weapons: {
            prow: "",
            dorsal: "Weapons Battery",
            port: "",
            starboard: ""
        },
        components: [
            { name: "Bridge", status: "operational" },
            { name: "Engines", status: "operational" },
            { name: "Life Support", status: "operational" },
            { name: "Void Shields", status: "operational" },
            { name: "Weapon Systems", status: "operational" },
            { name: "Sensors", status: "operational" }
        ],
        description: "Fast and agile escort vessel. What it lacks in armor and firepower it makes up for in maneuverability."
    },
    {
        id: 4,
        name: "Retribution Class Battleship",
        class: "Battleship",
        hull: {
            integrity: 100,
            current: 100,
            armor: 22
        },
        speed: 3,
        maneuverability: 15,
        crew: {
            rating: 40,
            morale: 90,
            population: 150000
        },
        detection: 20,
        weapons: {
            prow: "Lance Battery",
            dorsal: "Macro Cannon",
            port: "Weapons Battery",
            starboard: "Weapons Battery"
        },
        components: [
            { name: "Bridge", status: "operational" },
            { name: "Engines", status: "operational" },
            { name: "Life Support", status: "operational" },
            { name: "Void Shields", status: "operational" },
            { name: "Weapon Systems", status: "operational" },
            { name: "Sensors", status: "operational" }
        ],
        description: "The Emperor's wrath made manifest. This behemoth carries enough firepower to level a small continent."
    },
    {
        id: 5,
        name: "Cobra Class Destroyer",
        class: "Raider",
        hull: {
            integrity: 30,
            current: 30,
            armor: 14
        },
        speed: 10,
        maneuverability: 50,
        crew: {
            rating: 25,
            morale: 70,
            population: 15000
        },
        detection: 35,
        weapons: {
            prow: "Torpedo Tubes",
            dorsal: "",
            port: "",
            starboard: ""
        },
        components: [
            { name: "Bridge", status: "operational" },
            { name: "Engines", status: "operational" },
            { name: "Life Support", status: "operational" },
            { name: "Void Shields", status: "operational" },
            { name: "Weapon Systems", status: "operational" },
            { name: "Sensors", status: "operational" }
        ],
        description: "Built for speed and surprise attacks. Its torpedo tubes can deliver a devastating first strike."
    },
    {
        id: 6,
        name: "Gothic Class Cruiser",
        class: "Cruiser",
        hull: {
            integrity: 65,
            current: 65,
            armor: 19
        },
        speed: 6,
        maneuverability: 30,
        crew: {
            rating: 35,
            morale: 80,
            population: 90000
        },
        detection: 30,
        weapons: {
            prow: "",
            dorsal: "Lance Battery",
            port: "Lance Battery",
            starboard: "Lance Battery"
        },
        components: [
            { name: "Bridge", status: "operational" },
            { name: "Engines", status: "operational" },
            { name: "Life Support", status: "operational" },
            { name: "Void Shields", status: "operational" },
            { name: "Weapon Systems", status: "operational" },
            { name: "Sensors", status: "operational" }
        ],
        description: "Specializes in lance batteries that can penetrate even the strongest armor. A nightmare for heavily armored targets."
    }
];

export const crewTemplates = {
    defaultCrew: [
        {
            name: "Captain Augustus Remington",
            role: "Captain",
            skill: 45,
            quirk: "Zealous",
            health: 100
        },
        {
            name: "Navigator Marius Void-Eye",
            role: "Navigator",
            skill: 40,
            quirk: "Superstitious",
            health: 100
        },
        {
            name: "Master Helmsman Darius Tiller",
            role: "Helmsman",
            skill: 35,
            quirk: "Reckless",
            health: 100
        },
        {
            name: "Weapons Master Tarkus Boom",
            role: "Master Gunner",
            skill: 40,
            quirk: "Pyromaniac",
            health: 100
        },
        {
            name: "Tech-Priest Dominus Gammax",
            role: "Chief Engineer",
            skill: 40,
            quirk: "Paranoid",
            health: 100
        }
    ],
    enemyCrew: [
        {
            name: "Captain Drakken Bloodfist",
            role: "Captain",
            skill: 45,
            quirk: "Reckless",
            health: 100
        },
        {
            name: "Navigator Sybil Darkeye",
            role: "Navigator",
            skill: 40,
            quirk: "Paranoid",
            health: 100
        },
        {
            name: "Helmsman Grix 'Lucky' Voidrunner",
            role: "Helmsman",
            skill: 35,
            quirk: "Superstitious",
            health: 100
        },
        {
            name: "Gunner Sergeant Thorne",
            role: "Master Gunner",
            skill: 40,
            quirk: "Zealous",
            health: 100
        },
        {
            name: "Tech-Priest Logis Kron",
            role: "Chief Engineer",
            skill: 40,
            quirk: "Narcissistic",
            health: 100
        }
    ]
};

export const shipClasses = [
    { value: "Transport", minCrew: 15000, maxCrew: 30000 },
    { value: "Raider", minCrew: 15000, maxCrew: 25000 },
    { value: "Frigate", minCrew: 20000, maxCrew: 35000 },
    { value: "Light Cruiser", minCrew: 35000, maxCrew: 50000 },
    { value: "Cruiser", minCrew: 85000, maxCrew: 100000 },
    { value: "Grand Cruiser", minCrew: 95000, maxCrew: 120000 },
    { value: "Battlecruiser", minCrew: 100000, maxCrew: 135000 },
    { value: "Battleship", minCrew: 130000, maxCrew: 150000 }
];

export const weaponTypes = {
    prow: [
        { value: "", label: "-- None --" },
        { value: "Lance Battery", label: "Lance Battery" },
        { value: "Mega Laser", label: "Mega Laser" },
        { value: "Bombardment Cannon", label: "Bombardment Cannon" },
        { value: "Torpedo Tubes", label: "Torpedo Tubes" }
    ],
    dorsal: [
        { value: "", label: "-- None --" },
        { value: "Weapons Battery", label: "Weapons Battery" },
        { value: "Lance Battery", label: "Lance Battery" },
        { value: "Macro Cannon", label: "Macro Cannon" }
    ],
    broadside: [
        { value: "", label: "-- None --" },
        { value: "Weapons Battery", label: "Weapons Battery" },
        { value: "Lance Battery", label: "Lance Battery" },
        { value: "Macro Cannon", label: "Macro Cannon" }
    ]
};

export const crewRoles = [
    { value: "Captain", label: "Captain", unique: true },
    { value: "Navigator", label: "Navigator", unique: true },
    { value: "Helmsman", label: "Helmsman", unique: true },
    { value: "Master Gunner", label: "Master Gunner", unique: true },
    { value: "Chief Engineer", label: "Chief Engineer", unique: true },
    { value: "Commissar", label: "Commissar", unique: false },
    { value: "Astropath", label: "Astropath", unique: false },
    { value: "Arch-militant", label: "Arch-militant", unique: false },
    { value: "Explorator", label: "Explorator", unique: false },
    { value: "Seneschal", label: "Seneschal", unique: false }
];

export const crewQuirks = [
    { value: "Paranoid", label: "Paranoid", effect: "Less effective due to overthinking" },
    { value: "Zealous", label: "Zealous", effect: "More effective when motivated" },
    { value: "Drunkard", label: "Drunkard", effect: "Variable performance" },
    { value: "Narcissistic", label: "Narcissistic", effect: "Improved performance when praised" },
    { value: "Pyromaniac", label: "Pyromaniac", effect: "Bonus to weapon damage" },
    { value: "Superstitious", label: "Superstitious", effect: "Penalties near warp anomalies" },
    { value: "Insubordinate", label: "Insubordinate", effect: "Ignores some orders" },
    { value: "Cowardly", label: "Cowardly", effect: "Worse when under pressure" },
    { value: "Reckless", label: "Reckless", effect: "Unpredictable performance" },
    { value: "Optimistic", label: "Optimistic", effect: "Improved morale recovery" }
];

export const componentTypes = [
    "Bridge",
    "Engines",
    "Life Support",
    "Void Shields",
    "Weapon Systems",
    "Sensors"
];

export const componentStatus = {
    operational: "operational",
    damaged: "damaged",
    destroyed: "destroyed"
};
