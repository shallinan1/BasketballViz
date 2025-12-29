# BasketballViz

An interactive web-based basketball team picker and game simulator for recreational leagues. Build fantasy teams from a custom player roster, visualize team compositions, and run simulated games to compare team strength.

## Overview

BasketballViz is designed for the IMA (intramural) basketball league, featuring 42 players with detailed attributes, performance metrics, and personality-driven descriptions. The app provides two main views:

- **Player Rankings** (`index.html`) - Browse all players with their stats, descriptions, and ranking history
- **Team Builder & Simulator** (`team.html`) - Build teams and simulate games

## Features

### Team Building
- **Manual Selection**: Click players to add them to team slots (PG, SG, SF, PF, C positions)
- **10-Player Mode**: Select 10 players and auto-assign them to balanced teams
  - Random split or optimized balanced split (tests all 252 possible combinations)
- **Unique Players Toggle**: Enforce no duplicate players across teams
- **Randomize/Clear**: Quick actions to fill or empty team slots

### Game Simulation
- **Single Game**: Watch a possession-by-possession simulation with adjustable speed
- **Multi-Game**: Simulate 1-1000 games with live progress tracking
- **Win Records**: Tracks session win/loss history for both teams
- **Overtime**: Games must be won by 2+ points, triggering overtime when close

### Team Statistics
Real-time team ratings displayed when rosters are complete:
- **Offense Rating** - Combined offensive ability
- **Defense Rating** - Combined defensive ability
- **Balance Rating** - Team chemistry based on aggression distribution

Ratings are color-coded: Abysmal → Poor → Average → Good → Excellent

### Player Data
Each player includes:
- Position, height, weight, age, and season count
- Offensive and defensive ratings (0-1 scale)
- Detailed sub-stats: shooting (2pt/3pt), playmaking, perimeter/interior defense, rebounding
- Trait icons (Clutch Gene, Speed Demon, Shot Blocking, etc.)
- NBA player comparisons ("Shades of...")
- Narrative descriptions

## Project Structure

```
BasketballViz/
├── index.html          # Player rankings display
├── team.html           # Team builder & game simulator
├── players.js          # Player database (42 players)
├── gameSimulator.js    # Game simulation engine
├── images/             # Player profile photos
└── icons/              # Trait/attribute icons
```

## How It Works

### Game Simulation Engine

The simulator runs discrete possessions with probabilistic outcomes:

1. Each possession has a 40% chance of a 2-pointer attempt, 60% for 1-pointer
2. Shot success uses Gaussian distribution weighted by offense-defense differential
3. Team balance provides a ±10% boost to shot success rates
4. First to 15 points wins (must win by 2+)

### Team Balancing Algorithm

When using 10-player mode with "Balanced" assignment:
1. Calculates team vectors (offense, defense, balance) for all 252 possible splits
2. Minimizes cost function: `(Δoffense² + Δdefense² + Δbalance²)`
3. Assigns players to create the most evenly matched teams

## Usage

1. Open `team.html` in a browser
2. Build teams by clicking players and then clicking empty slots
3. Or enable "10-Player Selection" to bulk-select and auto-assign
4. Click "Simulate Game" to run a single game, or use multi-game simulation
5. View team statistics and track win records

For player rankings, open `index.html`.

## Technologies

- Vanilla JavaScript (ES6 Modules)
- CSS Grid/Flexbox with glassmorphism effects
- localStorage for theme and record persistence
- Google Fonts (Orbitron, Righteous)

## Theme

Toggle between dark and light mode using the theme button. Preference is saved across sessions.
