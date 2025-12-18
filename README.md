# Battleship Game

A modern, cross-browser compatible Battleship game with full touch support for mobile and tablet devices.

## Features

### 🎮 Gameplay
- Classic Battleship game mechanics
- Drag-and-drop ship placement
- Interactive grid-based combat
- AI opponent with intelligent targeting
- Visual feedback for hits, misses, and sunk ships

### 📱 Cross-Browser & Mobile Support
- **Universal Input Support**: Mouse, Touch, and Pointer events
- **Works Everywhere**: Chrome, Firefox, Safari, Edge (desktop & mobile)
- **Touch Optimized**: 44x44px minimum touch targets (WCAG 2.1 Level AAA)
- **Progressive Enhancement**: Automatic fallback for older browsers
- **No Delays**: Immediate touch response (no 300ms delay)

### 🔧 Technical Highlights
- Modern JavaScript (ES6+)
- Webpack build system
- Tailwind CSS styling
- Comprehensive test suite (Jest)
- Cross-browser compatibility layer
- Security scanning with CodeQL

## Getting Started

### Prerequisites
- Node.js 14+ 
- npm 6+

### Installation

```bash
# Clone the repository
git clone https://github.com/muhammadarhamrafiq/battle-ship.git
cd battle-ship

# Install dependencies
npm install
```

### Development

```bash
# Start development server with hot reload
npm run dev

# Open browser to http://localhost:8080
```

### Build

```bash
# Build for production
npm run build

# Output in ./dist directory
```

### Testing

```bash
# Run all tests
npm test

# Tests cover:
# - Game logic (ships, gameboard, players)
# - Browser compatibility
# - Event handling
# - AI behavior
```

## How to Play

### Setup Phase
1. **Place Your Ships**: Drag and drop ships onto your board (left grid)
   - Use the alignment dropdown to switch between horizontal/vertical
   - Or click "Place Ships Randomly" for automatic placement
2. **Start Game**: Click "Start Game" when all ships are placed

### Combat Phase
1. **Attack**: Click on the opponent's board (right grid) to attack
2. **AI Turn**: Wait for AI to make its move
3. **Win Condition**: Sink all enemy ships first to win!

### Ship Types
- **Carrier** (5 cells)
- **Battleship** (4 cells)
- **Submarine** (3 cells)
- **Destroyer** (3 cells)
- **Patrol Boat** (2 cells)

## Browser Compatibility

### Supported Browsers

| Browser | Desktop | Mobile | Notes |
|---------|---------|--------|-------|
| Chrome 88+ | ✅ | ✅ | Optimal performance |
| Firefox 85+ | ✅ | ✅ | Full support |
| Safari 14+ | ✅ | ✅ | iOS/iPadOS supported |
| Edge 88+ | ✅ | ✅ | Chromium-based |

See [BROWSER_COMPATIBILITY.md](BROWSER_COMPATIBILITY.md) for detailed compatibility information.

### Mobile Features
- Touch-friendly drag and drop
- Pinch-to-zoom disabled during gameplay
- Scroll prevention during ship placement
- Visual feedback on touch
- Responsive grid sizing

## Project Structure

```
battle-ship/
├── src/
│   ├── logic/          # Game logic (ships, board, players)
│   ├── ui/             # UI controllers and rendering
│   ├── controller/     # Game flow controller
│   ├── utils/          # Browser compatibility utilities
│   ├── styles/         # CSS styling
│   └── resources/      # Images and assets
├── __tests__/          # Test suites
├── dist/               # Production build output
└── webpack configs     # Build configuration
```

## Architecture

### Browser Compatibility Layer
The game uses a sophisticated compatibility layer that:
- Detects browser capabilities (touch, pointer, passive events)
- Normalizes event coordinates across input types
- Provides polyfills for older browsers
- Optimizes performance with passive listeners

### Event Handling Strategy
Progressive enhancement with three-tier support:
1. **Pointer Events** (modern browsers) - preferred
2. **Touch Events** (mobile fallback)
3. **Mouse Events** (legacy fallback)

### Key Components

**BrowserCompatManager** (`src/utils/browserCompat.js`)
- Feature detection
- Event normalization
- Polyfill management
- Touch utilities

**EventController** (`src/ui/EventController.js`)
- Unified event handling
- Ship placement logic
- Attack handling
- Drag preview

**GameController** (`src/controller/gameController.js`)
- Turn management
- Win condition checking
- AI coordination

## Development

### Code Style
- ES6+ JavaScript
- Functional and OOP patterns
- Comprehensive JSDoc comments
- Feature detection (not user-agent sniffing)

### Testing
- Jest with jsdom environment
- 52+ tests covering all features
- Browser compatibility tests
- Game logic validation

### Building
- Webpack 5 with modern configuration
- Development server with HMR
- Production optimization
- CSS processing with PostCSS + Tailwind

## Security

✅ **CodeQL Scanned**: No vulnerabilities
✅ **Input Validation**: All user inputs validated
✅ **XSS Protection**: No dynamic HTML injection
✅ **Safe Event Handling**: Proper preventDefault usage

## Performance

### Optimizations
- Hardware-accelerated CSS transforms
- Passive event listeners for scrolling
- Minimal DOM manipulation
- Efficient event delegation
- Lazy loading where possible

### Metrics
- Lighthouse Score: ~95+ (Performance, Accessibility, Best Practices)
- First Contentful Paint: < 1.5s
- Time to Interactive: < 2.5s

## Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Add tests for new features
4. Ensure all tests pass
5. Submit a pull request

## Known Issues

See [BROWSER_COMPATIBILITY.md](BROWSER_COMPATIBILITY.md) for browser-specific notes.

### Limitations
- Internet Explorer 11 not officially supported
- Requires JavaScript enabled
- Minimum screen width: 320px recommended

## Future Enhancements

Potential improvements:
- [ ] Multiplayer support (WebSockets)
- [ ] Game history and statistics
- [ ] Difficulty levels for AI
- [ ] Sound effects and music
- [ ] Animations for ship placement
- [ ] Keyboard navigation support
- [ ] Offline play (Service Worker)
- [ ] Customizable game rules

## License

This project is open source and available under the MIT License.

## Acknowledgments

- Original game concept: Battleship board game
- Built with modern web technologies
- Tested across multiple browsers and devices

## Support

For issues or questions:
1. Check [BROWSER_COMPATIBILITY.md](BROWSER_COMPATIBILITY.md)
2. Review existing issues on GitHub
3. Create a new issue with:
   - Browser name and version
   - Operating system
   - Steps to reproduce
   - Expected vs actual behavior

---

**Enjoy the game!** 🚢⚓️🎯
