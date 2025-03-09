import { CREW_RANKS, CREW_PHRASES, SHIP_NAME_PARTS } from '../config/constants.js';

export class NameGenerator {
    constructor() {
        // Additional Gothic-style name parts
        this.nameParts = {
            adjectives: [
                "Adamant", "Bellicose", "Dauntless", "Eternal", "Fervent",
                "Glorious", "Hallowed", "Inexorable", "Judgmental", "Luminous",
                "Majestic", "Omnipotent", "Pious", "Resolute", "Sanctified",
                "Triumphant", "Unyielding", "Vigilant", "Wrathful", "Zealous"
            ],
            nouns: [
                "Absolution", "Benediction", "Crusader", "Dominion", "Executor",
                "Fortitude", "Guardian", "Harbinger", "Inquisitor", "Justicar",
                "Liberator", "Martyr", "Nemesis", "Oracle", "Paladin",
                "Redeemer", "Sovereign", "Templar", "Vindicator", "Warden"
            ],
            titles: [
                "of His Divine Light",
                "of the Emperor's Wrath",
                "of Righteous Fury",
                "of Sacred Duty",
                "of the Imperial Truth",
                "of Divine Vengeance",
                "of Eternal Vigilance",
                "of Holy Purpose",
                "of Blessed Victory",
                "of the Golden Throne"
            ]
        };

        // First names for crew members
        this.firstNames = [
            "Alaric", "Brutus", "Caspian", "Darius", "Ezra",
            "Felix", "Gaius", "Hadrian", "Ignatius", "Julius",
            "Lucius", "Magnus", "Nero", "Octavius", "Pontius",
            "Quintus", "Rufus", "Septimus", "Titus", "Valerius"
        ];

        // Last names for crew members
        this.lastNames = [
            "Aquila", "Blackheart", "Cruxis", "Drakken", "Eternus",
            "Ferrum", "Grimm", "Helbrecht", "Ironside", "Justinian",
            "Kaine", "Lupus", "Mortis", "Noctis", "Omnius",
            "Pious", "Questor", "Rex", "Stern", "Thorne"
        ];

        // Personality traits for crew members
        this.personalityTraits = [
            "zealous", "stoic", "determined", "faithful", "stern",
            "vigilant", "resolute", "unwavering", "disciplined", "devoted",
            "fearless", "honorable", "dutiful", "steadfast", "valiant"
        ];
    }

    generateShipName() {
        const usePattern = Math.random() < 0.7; // 70% chance to use prefix-suffix pattern

        if (usePattern) {
            const prefix = this.getRandomElement(SHIP_NAME_PARTS.PREFIXES);
            const suffix = this.getRandomElement(SHIP_NAME_PARTS.SUFFIXES);
            return `${prefix} ${suffix}`;
        } else {
            // Generate a more complex name
            const pattern = Math.floor(Math.random() * 3);
            switch (pattern) {
                case 0:
                    return `${this.getRandomElement(this.nameParts.adjectives)} ${this.getRandomElement(this.nameParts.nouns)}`;
                case 1:
                    return `${this.getRandomElement(this.nameParts.nouns)} ${this.getRandomElement(this.nameParts.titles)}`;
                case 2:
                    return `${this.getRandomElement(this.nameParts.adjectives)} ${this.getRandomElement(this.nameParts.nouns)} ${this.getRandomElement(this.nameParts.titles)}`;
            }
        }
    }

    generateCrewMember(rank = null) {
        const firstName = this.getRandomElement(this.firstNames);
        const lastName = this.getRandomElement(this.lastNames);
        const trait = this.getRandomElement(this.personalityTraits);
        const assignedRank = rank || this.getRandomElement(CREW_RANKS);

        // Generate catchphrases based on rank and personality
        const catchphrases = this.generateCatchphrases(assignedRank, trait);

        return {
            id: `crew_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name: `${firstName} ${lastName}`,
            rank: assignedRank,
            trait: trait,
            catchphrases: catchphrases,
            experience: Math.floor(Math.random() * 30) + 5, // 5-35 years
            age: Math.floor(Math.random() * 40) + 30, // 30-70 years
            status: 'active'
        };
    }

    generateCatchphrases(rank, trait) {
        const catchphrases = [];
        
        // Add general Imperial phrases
        catchphrases.push(this.getRandomElement(CREW_PHRASES.GENERAL));

        // Add role-specific phrases
        switch (rank) {
            case 'Captain':
                catchphrases.push(
                    "By the Emperor's will, we sail!",
                    "This vessel is our sacred duty!",
                    "For the glory of the Imperium!"
                );
                break;
            case 'Navigator':
                catchphrases.push(
                    "The warp whispers to me...",
                    "I see the golden path!",
                    "Through the immaterium, we travel."
                );
                break;
            case 'Chief Engineer':
                catchphrases.push(
                    "The machine spirit is appeased!",
                    "Praise the Omnissiah!",
                    "These engines sing with holy power!"
                );
                break;
            default:
                // Add combat and warp-related phrases for other ranks
                catchphrases.push(
                    this.getRandomElement(CREW_PHRASES.COMBAT),
                    this.getRandomElement(CREW_PHRASES.WARP)
                );
        }

        // Add personality-based phrases
        switch (trait) {
            case 'zealous':
                catchphrases.push(
                    "Death to the heretics!",
                    "For the Emperor's glory!"
                );
                break;
            case 'stoic':
                catchphrases.push(
                    "We endure.",
                    "Duty is its own reward."
                );
                break;
            case 'faithful':
                catchphrases.push(
                    "The Emperor protects.",
                    "Faith is our shield."
                );
                break;
        }

        // Shuffle and return unique phrases
        return [...new Set(this.shuffleArray(catchphrases))].slice(0, 4);
    }

    generateShipHistory() {
        const events = [
            "Participated in the purging of heretics in the Gothic Sector",
            "Survived a devastating encounter with Ork pirates",
            "Successfully defended an Imperial shrine world",
            "Carried out a perilous mission into the Maelstrom",
            "Engaged in combat with Eldar corsairs",
            "Weathered a terrible Warp storm",
            "Recovered a precious STC fragment",
            "Transported vital supplies through enemy territory",
            "Assisted in putting down a planetary rebellion",
            "Survived an encounter with a Tyranid splinter fleet"
        ];

        const years = Math.floor(Math.random() * 100) + 50; // 50-150 years old
        const numEvents = Math.floor(Math.random() * 3) + 2; // 2-4 events
        const selectedEvents = this.shuffleArray(events).slice(0, numEvents);

        return {
            age: years,
            events: selectedEvents,
            previousCommanders: this.generatePreviousCommanders(Math.floor(years / 30))
        };
    }

    generatePreviousCommanders(count) {
        const commanders = [];
        for (let i = 0; i < count; i++) {
            const commander = this.generateCrewMember('Captain');
            commander.fate = this.getRandomElement([
                "Died gloriously in battle",
                "Promoted to Admiral",
                "Lost to the Warp",
                "Martyred defending the Imperium",
                "Retired to an Imperial shrine world",
                "Status unknown"
            ]);
            commanders.push(commander);
        }
        return commanders;
    }

    // Utility methods
    getRandomElement(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
}
