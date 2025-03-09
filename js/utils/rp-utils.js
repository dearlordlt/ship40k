/**
 * Generate contextual RP messages based on battle events
 */

const rpMessages = {
    // Hull damage messages
    hullDamage: [
        "The deck plates buck beneath the crew as another impact sends tremors through the ship's superstructure.",
        "Warning klaxons blare as damage reports flood in from multiple decks.",
        "The ship groans in protest as its ancient hull absorbs another punishing blow.",
        "Emergency bulkheads slam shut as compartments decompress from the latest hit.",
        "Tech-priests frantically chant prayers of protection as the hull integrity continues to deteriorate."
    ],

    // Component damage messages
    componentDamage: {
        "Bridge": [
            "Sparks shower from overhead consoles as bridge systems short out.",
            "The command throne's augur arrays flicker ominously.",
            "Bridge crew dive for cover as a power conduit explodes.",
            "The captain's tactical display dissolves into static."
        ],
        "Engines": [
            "The plasma drives stutter and whine as power fluctuates.",
            "Engine deck reports critical coolant leaks in reactor chambers.",
            "The ship's machine spirit howls in binary as propulsion systems fail.",
            "Enginseers scramble to appease the increasingly angry engine spirits."
        ],
        "Weapon Systems": [
            "Acrid smoke billows from the weapons console as fuses blow out.",
            "The gunnery crews report massive power fluctuations in the weapon capacitors.",
            "Loading mechanisms jam as the ammunition feeds malfunction.",
            "Weapon servitors screech in binary as targeting systems go dark."
        ],
        "Sensors": [
            "The auspex officer frantically recalibrates as readings become garbled.",
            "Static fills the sensor displays as detection systems fail.",
            "Long-range augur arrays go dark one by one.",
            "The ship's eyes grow dim as sensor spirits lose power."
        ],
        "Void Shields": [
            "The void shield generators whine in protest as power levels drop.",
            "Shield technicians report critical fluctuations in the gellar field.",
            "The ship's protective barriers flicker and fade.",
            "Warning runes indicate imminent shield generator failure."
        ],
        "Life Support": [
            "Environmental systems struggle to maintain atmosphere in damaged sections.",
            "Life support warns of dropping oxygen levels on multiple decks.",
            "The recyclers labor to filter out the smoke of battle.",
            "Crew quarters report failing gravity generators and air scrubbers."
        ]
    },

    // Successful weapon hits
    successfulHit: [
        "The gunnery crew erupts in cheers as their shot strikes true.",
        "Machine spirits sing hymns of destruction as weapons find their mark.",
        "The enemy vessel's hull buckles under the devastating impact.",
        "Pict-screens show satisfying explosions across the target's surface."
    ],

    // Crew casualties
    crewCasualties: [
        "Medicae teams rush through the corridors with stretchers bearing wounded crew.",
        "The ship's chaplain leads prayers for the souls of the fallen.",
        "Reports of mounting casualties flood in from damaged compartments.",
        "The ship's death toll rises as another compartment is breached."
    ],

    // Morale effects
    moraleLow: [
        "Whispers of mutiny spread through the lower decks.",
        "The commissar's bolt pistol barks as he maintains order.",
        "Crew efficiency drops as fear takes hold.",
        "Prayers to the Emperor become increasingly desperate."
    ],

    // Battle progress
    battleProgress: [
        "Gun crews work like men possessed, pushing weapons to their limits.",
        "The ship's spirit rises to the challenge, ancient engines thundering.",
        "Tactical officers plot new attack vectors through the debris field.",
        "The void fills with the light of exchanged fire and burning debris."
    ]
};

/**
 * Generate a contextual RP message based on battle state
 * @param {Object} context - Battle context object
 * @returns {string} RP message
 */
export function generateContextualRPMessage(context) {
    const { 
        damageType = null,
        componentType = null,
        hitSuccess = false,
        casualties = false,
        morale = 100
    } = context;

    if (damageType === 'hull') {
        return getRandomMessage(rpMessages.hullDamage);
    }

    if (damageType === 'component' && componentType) {
        return getRandomMessage(rpMessages.componentDamage[componentType]);
    }

    if (hitSuccess) {
        return getRandomMessage(rpMessages.successfulHit);
    }

    if (casualties) {
        return getRandomMessage(rpMessages.crewCasualties);
    }

    if (morale < 50) {
        return getRandomMessage(rpMessages.moraleLow);
    }

    return getRandomMessage(rpMessages.battleProgress);
}

/**
 * Get a random message from an array
 * @param {Array} messages - Array of possible messages
 * @returns {string} Random message
 */
function getRandomMessage(messages) {
    return messages[Math.floor(Math.random() * messages.length)];
}
