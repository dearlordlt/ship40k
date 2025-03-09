/**
 * Show a notification message
 * @param {string} message - Message to display
 * @param {number} duration - Duration in milliseconds
 */
export function showNotification(message, duration = 3000) {
    const notification = document.getElementById('notification');
    if (!notification) return;

    notification.textContent = message;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, duration);
}

/**
 * Create an element with classes and attributes
 * @param {string} tag - HTML tag name
 * @param {Object} options - Element options
 * @returns {HTMLElement} Created element
 */
export function createElement(tag, options = {}) {
    const element = document.createElement(tag);
    
    if (options.classes) {
        element.className = Array.isArray(options.classes) ? options.classes.join(' ') : options.classes;
    }
    
    if (options.attributes) {
        Object.entries(options.attributes).forEach(([key, value]) => {
            element.setAttribute(key, value);
        });
    }
    
    if (options.text) {
        element.textContent = options.text;
    }
    
    if (options.html) {
        element.innerHTML = options.html;
    }
    
    return element;
}

/**
 * Clear all children of an element
 * @param {HTMLElement} element - Element to clear
 */
export function clearElement(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

/**
 * Add a battle log entry
 * @param {string} message - Log message
 * @param {string} type - Log entry type
 */
export function addLogEntry(message, type = 'system') {
    const battleLog = document.getElementById('battle-log');
    if (!battleLog) return;

    const logEntry = createElement('div', {
        classes: ['log-entry', type],
        text: message
    });
    
    battleLog.appendChild(logEntry);
    battleLog.scrollTop = battleLog.scrollHeight;
}

/**
 * Update hull display
 * @param {string} shipId - Ship identifier (player/enemy)
 * @param {Object} hullData - Hull data object
 */
export function updateHullDisplay(shipId, hullData) {
    const hullBar = document.getElementById(`${shipId}-hull-bar`);
    const hullValue = document.getElementById(`${shipId}-ship-hull-value`);
    if (!hullBar || !hullValue) return;

    const percentage = (hullData.current / hullData.integrity) * 100;
    hullBar.style.width = `${percentage}%`;
    hullValue.textContent = `${hullData.current}/${hullData.integrity}`;
}

/**
 * Update component display
 * @param {string} shipId - Ship identifier (player/enemy)
 * @param {Array} components - Array of component objects
 */
export function updateComponentDisplay(shipId, components) {
    const componentList = document.getElementById(`${shipId}-ship-components`);
    if (!componentList) return;

    clearElement(componentList);
    
    components.forEach(component => {
        const componentEl = createElement('div', {
            classes: ['component', component.status !== 'operational' ? component.status : ''],
            html: `<span>${component.name}: ${component.status}</span>`
        });
        componentList.appendChild(componentEl);
    });
}

/**
 * Toggle tab content
 * @param {string} tabId - ID of tab to activate
 */
/**
 * Toggle tab content and update active state
 * @param {string} tabId - ID of tab to activate
 */
export function activateTab(tabId) {
    // Remove active class from all tabs and content
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    // Add active class to selected tab and content
    const selectedTab = document.querySelector(`.tab[data-tab="${tabId}"]`);
    const selectedContent = document.getElementById(tabId);
    
    if (selectedTab && selectedContent) {
        selectedTab.classList.add('active');
        selectedContent.classList.add('active');
    }
}

/**
 * Show/hide popup
 * @param {string} popupId - Popup element ID
 * @param {boolean} show - Whether to show or hide
 */
export function togglePopup(popupId, show) {
    const popup = document.getElementById(popupId);
    if (!popup) return;

    if (show) {
        popup.classList.add('show');
    } else {
        popup.classList.remove('show');
    }
}

/**
 * Create a ship card element
 * @param {Object} ship - Ship data
 * @param {Function} onClick - Click handler
 * @returns {HTMLElement} Ship card element
 */
export function createShipCard(ship, onClick) {
    const card = createElement('div', {
        classes: ['ship-card'],
        attributes: { 'data-ship-id': ship.id }
    });
    
    card.innerHTML = `
        <h3>${ship.name}</h3>
        <p>${ship.class} Class</p>
        <div class="ship-stats">
            <div class="ship-stat">
                <span class="ship-stat-label">Hull:</span>
                <span>${ship.hull.integrity}</span>
            </div>
            <div class="ship-stat">
                <span class="ship-stat-label">Armor:</span>
                <span>${ship.hull.armor}</span>
            </div>
            <div class="ship-stat">
                <span class="ship-stat-label">Speed:</span>
                <span>${ship.speed}</span>
            </div>
            <div class="ship-stat">
                <span class="ship-stat-label">Maneuverability:</span>
                <span>${ship.maneuverability}</span>
            </div>
        </div>
        <p>${ship.description}</p>
    `;
    
    if (onClick) {
        card.addEventListener('click', () => onClick(ship));
    }
    
    return card;
}

/**
 * Create a crew member element
 * @param {Object} crewMember - Crew member data
 * @returns {HTMLElement} Crew member element
 */
export function createCrewMemberElement(crewMember) {
    return createElement('div', {
        classes: ['crew-member'],
        html: `
            <h4>
                ${crewMember.name}
                <span>${crewMember.role}</span>
            </h4>
            <div class="crew-stats">
                <span class="crew-stat">Skill: ${crewMember.skill}</span>
                <span class="crew-stat">Quirk: ${crewMember.quirk}</span>
                <span class="crew-stat">Health: ${crewMember.health}%</span>
            </div>
        `
    });
}

/**
 * Update button state
 * @param {string} buttonId - Button element ID
 * @param {boolean} enabled - Whether button should be enabled
 * @param {string} text - Optional new button text
 */
export function updateButton(buttonId, enabled, text = null) {
    const button = document.getElementById(buttonId);
    if (!button) return;

    button.disabled = !enabled;
    if (text !== null) {
        button.textContent = text;
    }
}
