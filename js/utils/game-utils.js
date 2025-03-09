/**
 * Generate a random integer between min and max (inclusive)
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Random integer between min and max
 */
export function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Get a random element from an array
 * @param {Array} array - Array to select from
 * @returns {*} Random element from the array
 */
export function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

/**
 * Deep clone an object
 * @param {Object} obj - Object to clone
 * @returns {Object} Deep cloned object
 */
export function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

/**
 * Format a number with commas for thousands
 * @param {number} number - Number to format
 * @returns {string} Formatted number string
 */
export function formatNumber(number) {
    return number.toLocaleString();
}

/**
 * Calculate percentage and ensure it's between 0 and 100
 * @param {number} current - Current value
 * @param {number} total - Total value
 * @returns {number} Percentage between 0 and 100
 */
export function calculatePercentage(current, total) {
    return Math.min(100, Math.max(0, (current / total) * 100));
}

/**
 * Generate a unique ID
 * @returns {string} Unique ID
 */
export function generateId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * Delay execution for a specified time
 * @param {number} ms - Milliseconds to delay
 * @returns {Promise} Promise that resolves after the delay
 */
export function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Check if a value is between two numbers (inclusive)
 * @param {number} value - Value to check
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {boolean} Whether the value is between min and max
 */
export function isBetween(value, min, max) {
    return value >= min && value <= max;
}

/**
 * Capitalize the first letter of each word in a string
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
export function capitalizeWords(str) {
    return str.replace(/\b\w/g, l => l.toUpperCase());
}

/**
 * Shuffle an array using Fisher-Yates algorithm
 * @param {Array} array - Array to shuffle
 * @returns {Array} New shuffled array
 */
export function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

/**
 * Generate a random ship name using predefined patterns
 * @returns {string} Generated ship name
 */
export function generateShipName() {
    const prefixes = [
        "Emperor's", "Imperial", "Divine", "Righteous", "Vengeful",
        "Eternal", "Sacred", "Blessed", "Adamant", "Indomitable"
    ];
    
    const nouns = [
        "Fury", "Vengeance", "Justice", "Glory", "Light",
        "Hammer", "Sword", "Shield", "Fist", "Wrath"
    ];
    
    return `${getRandomElement(prefixes)} ${getRandomElement(nouns)}`;
}

/**
 * Format battle log timestamp
 * @param {Date} date - Date to format
 * @returns {string} Formatted timestamp
 */
export function formatBattleTime(date) {
    return new Date(date).toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

/**
 * Calculate damage reduction from armor
 * @param {number} damage - Raw damage amount
 * @param {number} armor - Armor value
 * @returns {number} Reduced damage amount
 */
export function calculateArmorReduction(damage, armor) {
    return Math.max(1, damage - Math.floor(armor / 2));
}

/**
 * Generate a quirky battle quote
 * @returns {string} Random battle quote
 */
export function getRandomBattleQuote() {
    const quotes = [
        "The ship's Tech-Priest is patting a console and whispering sweet nothings to the machine spirit.",
        "The ship's resident Ogryn just tried to fix the targeting array with a hammer. Surprisingly, it worked.",
        "A nervous ensign reports that the Gellar field is flickering. Turns out someone just plugged in a toaster.",
        "Warning: Several crew members have been caught trying to worship the coffee machine as a manifestation of the Emperor.",
        "Ship's astropath reports receiving messages from beyond. Probably warp entities, but could just be the Imperial Navy's terrible hold music.",
        "Navigator reports that the warp looks extra spooky today. Technical term, apparently.",
        "Ship's Commissar shot someone for poor morale. Morale has improved significantly.",
        "Hull breach in deck 47. Maintenance crews fixing it with prayer, duct tape, and the occasional ritual sacrifice."
    ];
    return getRandomElement(quotes);
}
