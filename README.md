# BasketballViz

An interactive web-based basketball team picker and game simulator for recreational leagues. Build fantasy teams from a custom player roster, visualize team compositions, and run simulated games to compare team strength.

## Overview

BasketballViz is designed for the IMA (intramural) basketball league, featuring 42 players with detailed attributes, performance metrics, and personality-driven descriptions. The app provides two main views:

- **Player Rankings** (`index.html`) - Browse all players with their stats, descriptions, and ranking history
- **Team Builder & Simulator** (`team.html`) - Build teams and simulate games
- **Stats Spreadsheet** (`spreadsheet.html`) - Excel-like view of all player stats with formulas

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
- **Team Overall** - Average of position-adjusted player ratings (shown next to team name)
- **Offense Rating** - Combined offensive ability
- **Defense Rating** - Combined defensive ability
- **Balance Rating** - Team chemistry based on aggression distribution

Ratings are color-coded: Abysmal → Poor → Average → Good → Excellent

### Position Fit System
Players have position-specific ratings (PG, SG, SF, PF, C) that affect their effectiveness:
- **Green badge** - Player is at their natural/best position
- **Yellow badge** - Player is slightly out of position
- **Red badge + "Out of Pos"** - Player is significantly out of position

The player selection list shows each player's acceptable positions and best rating at a glance.

### Stats Spreadsheet
A full Excel-like spreadsheet view (`spreadsheet.html`) with:
- **All player stats** displayed in a sortable, filterable table
- **Computed columns** - Category totals (Shooting, Inside Scoring, etc.) calculated using formulas
- **Position ratings** - PG/SG/SF/PF/C ratings computed dynamically
- **Editable cells** - Modify stats to see how changes affect computed ratings
- **Password-protected export** - Save changes with authorization

### Player Data
Each player includes:
- Position, height, weight, age, and season count
- Offensive and defensive ratings (0-1 scale)
- Detailed stats across categories:
  - **Shooting**: Close/Mid/3pt shot, Shot IQ, Free Throw, Offensive Consistency
  - **Inside Scoring**: Layups, Dunks, Post Moves, Draw Foul
  - **Athleticism**: Speed, Acceleration, Vertical, Strength, Stamina, Hustle
  - **Playmaking**: Ball Handle, Pass Accuracy/Vision/IQ, Speed with Ball
  - **Defense**: Interior/Perimeter Defense, Steal, Block, Help Defense IQ
  - **Rebounding**: Offensive and Defensive Rebounding
  - **Position Ratings**: PG/SG/SF/PF/C ratings computed dynamically from stats
- Trait icons (Clutch Gene, Speed Demon, Shot Blocking, etc.)
- NBA player comparisons ("Shades of...")
- Narrative descriptions

## Project Structure

```
BasketballViz/
├── index.html          # Player rankings display
├── team.html           # Team builder & game simulator
├── spreadsheet.html    # Excel-like stats editor
├── players.js          # Player database with stat formulas
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

### Dynamic Rating System

All aggregate stats and position ratings are computed dynamically using formulas:

**Category Totals:**
- **Shooting**: Weighted combination of shot types with offensive consistency multiplier
- **Inside Scoring**: Top moves weighted heavily, plus hands and draw foul
- **Athleticism**: Speed, acceleration, vertical, strength (21% each) + stamina, hustle (8% each)
- **Playmaking**: Ball handling and passing attributes equally weighted
- **Defense**: Interior/perimeter defense weighted by consistency multiplier
- **Rebounding**: Average of offensive and defensive rebounding

**Position Ratings** (weighted combinations of category totals):
- **PG**: 36% Playmaking, 28% Shooting, 16% Athleticism
- **SG**: 34% Shooting, 19% Athleticism, 16% Playmaking
- **SF**: 21% Shooting, 20% Athleticism, 20% Defense, 17% Inside
- **PF**: 24% Athleticism, 21% Inside, 20% Defense, 19% Rebounding
- **C**: 25% Defense, 25% Rebounding, 24% Inside, 20% Athleticism

**Position Display**: Shows primary position (max rating) plus co-positions within 1 point (e.g., "PG/SG", "SF/PF").

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
