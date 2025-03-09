# Warhammer 40k Ship Designer and Simulator

A web-based application for designing and simulating ships from the Warhammer 40,000 universe, based on Rogue Trader rules. Design your own Imperial vessels, outfit them with weapons and components, and test them in combat or warp travel simulations.

## Features

### Ship Design
- Choose from 6 different ship classes, from Raiders to Gothic Cruisers
- Install various components across multiple categories:
  - Weapons (Lance Batteries, Macro-Cannons, Torpedo Tubes)
  - Essential Components (Warp Engines, Void Shields, Bridge)
  - Supplemental Systems (Augur Arrays, Cargo Holds, Teleportariums)
  - Hull Augmentations and Armor
- Real-time resource management:
  - Hull Space tracking
  - Power management
  - Ship Points allocation
- Automatic ship name generation with Warhammer 40k theming
- Save and load ship designs

### Simulation
- Combat Simulation:
  - Turn-based ship-to-ship combat
  - Range-based weapon effectiveness
  - Critical hit system
  - Component damage and ship status tracking
  - Detailed combat log
- Warp Travel:
  - Day-by-day warp journey simulation
  - Random events and encounters
  - Gellar Field stability monitoring
  - Crew morale and casualties tracking
  - Navigation challenges

### Technical Features
- Built with vanilla JavaScript (ES6 modules)
- Tailwind CSS for styling
- IndexedDB for persistent storage (with localStorage fallback)
- Modular architecture following SOLID principles
- Comprehensive dice rolling system for game mechanics
- Detailed logging and status tracking

## Getting Started

1. Open `index.html` in a modern web browser
2. Start in Design Mode:
   - Select a ship class
   - Add components while managing resources
   - Save your design
3. Switch to Simulation Mode:
   - Choose between Combat or Warp Travel
   - Test your ship's capabilities
   - Monitor ship and crew status

## Ship Classes

- **Raider**: Swift and lightly armed vessels for reconnaissance
- **Sword Class Frigate**: Versatile escort vessels
- **Firestorm Class Frigate**: Heavy escort with anti-fighter focus
- **Dauntless Light Cruiser**: Fast and versatile cruiser
- **Lunar Class Cruiser**: Well-balanced Imperial cruiser
- **Gothic Class Cruiser**: Heavy cruiser for long-range combat

## Components

### Weapons
- Lance Battery: High-powered energy weapon
- Macro Cannon Battery: Traditional ship-to-ship weapon
- Torpedo Tubes: Long-range heavy damage

### Essential Components
- Warp Engine: Enables warp travel
- Plasma Drive: Main propulsion
- Void Shield: Energy shielding

### Supplemental Systems
- Augur Array: Enhanced detection
- Cargo Hold: Storage capacity
- Teleportarium: Crew/cargo teleportation

### Hull Augmentations
- Reinforced Hull: Additional armor
- Life Sustainer: Improved crew quarters

## Combat System

The combat system simulates ship-to-ship warfare with:
- Multiple range brackets affecting accuracy and damage
- Component targeting and critical effects
- Shield management
- Crew casualties and morale
- Detailed combat logs

## Warp Travel System

Warp travel simulation includes:
- Random event generation
- Gellar Field stability checks
- Navigation challenges
- Crew management
- Journey duration variations

## Technical Requirements

- Modern web browser with JavaScript enabled
- Support for ES6 modules
- IndexedDB support (falls back to localStorage)
- Minimum resolution: 1024x768

## Development

### Project Structure
```
ship40k/
├── index.html
├── css/
│   └── custom.css
├── js/
│   ├── app.js
│   ├── config/
│   │   ├── constants.js
│   │   └── gameRules.js
│   ├── models/
│   │   └── ship.js
│   ├── services/
│   │   ├── storageService.js
│   │   └── nameGenerator.js
│   ├── simulators/
│   │   ├── combatSimulator.js
│   │   └── warpTravelSimulator.js
│   ├── components/
│   │   └── simulationMode.js
│   └── utils/
│       └── diceRoller.js
```

### Key Technologies
- HTML5
- JavaScript (ES6+)
- Tailwind CSS
- IndexedDB
- Local Storage

## Credits

Built with love for the Warhammer 40,000 universe. Based on the Rogue Trader RPG ruleset.

## License

MIT License - See LICENSE file for details
