# BasketballViz TODO

## Completed

- [x] Remove debug console logs from gameSimulator.js
- [x] Add mobile CSS media queries for image scaling
- [x] Implement localStorage game history persistence
- [x] Add fatigue system to game simulation
- [x] Add momentum/hot streak tracking
- [x] Add turnover mechanics
- [x] Add rebounding mechanics
- [x] Set up Vitest test framework with unit tests

---

## Phase 3: Draft Modes

- [ ] **Turn-Based Draft**
  - Alternating picks between two captains
  - Display pick history/order
  - Store draft state in localStorage
  - Files: `team.html`

- [ ] **Snake Draft Variant**
  - After each round, pick order reverses
  - Toggle option in selection controls
  - Files: `team.html`

- [ ] **Draft History Export**
  - Export draft results as JSON
  - Import to replay/share with league
  - Files: `team.html`

---

## Phase 4: Stats & Analytics

- [ ] **Per-Player Statistics**
  - Track per player: games played, points, FG%
  - Aggregate across all simulations
  - Display on player hover or in modal
  - Files: `team.html`, new `stats.js`

- [ ] **Head-to-Head Records**
  - Track wins when same players face off
  - Display matchup history
  - Files: `team.html`

- [ ] **Stats Dashboard Page**
  - Leaderboards (PPG, win%)
  - Team compositions with highest win rates
  - Pull from localStorage
  - Files: new `stats.html`

- [ ] **CSV Export**
  - Export game history + player stats as CSV
  - Share with league for external analysis
  - Files: `team.html` or `stats.html`

---

## Phase 5: UI/UX Polish

- [ ] **Player Tooltips**
  - Hover popup showing full stats
  - shooting2, shooting3, playmaking, etc.
  - Files: `team.html`

- [ ] **Keyboard Navigation**
  - Add tabindex to slots and player list
  - Arrow keys to navigate, Space to select
  - ARIA labels for screen readers
  - Files: `team.html`

- [ ] **Game Pause/Resume**
  - "Simulate" button becomes "Pause" mid-game
  - Resume or restart options
  - Files: `team.html`, `gameSimulator.js`

- [ ] **Confirmation Dialogs**
  - Confirm before clearing teams or resetting records
  - Files: `team.html`

---

## Future Considerations (Large Effort)

- [ ] Firebase Backend - Cloud sync, leaderboards, cross-device access
- [ ] Auction Draft - Budget-based player bidding
- [ ] Drag-and-Drop - Replace click selection with HTML5 drag API
- [ ] Service Worker - Offline support
