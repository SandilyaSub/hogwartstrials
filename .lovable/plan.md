## Phase 1: Install 3D Dependencies & Create Core Engine
- Install `@react-three/fiber@^8.18`, `@react-three/drei@^9.122.0`, `three@^0.133`
- Create `src/lib/engine3d/` with:
  - `Player.tsx` — 3D character (box/capsule) with gravity, jump, WASD movement
  - `Platform.tsx` — Reusable 3D platform component
  - `ThirdPersonCamera.tsx` — Camera following behind player
  - `Physics.tsx` — Simple collision detection & gravity system
  - `GameWorld3D.tsx` — Main Three.js canvas wrapper

## Phase 2: Create Tutorial System
- Create `src/components/game/Tutorial.tsx` — Full guided walkthrough with steps:
  1. **Welcome to Hogwarts** — Narrative intro, press any key
  2. **Movement** — WASD/Arrow keys to move, practice on flat ground
  3. **Jumping** — Space to jump, cross a gap
  4. **Camera** — Mouse to look around
  5. **Coins** — Collect floating coins
  6. **Spells** — Cast spells (Lumos, Stupefy)
  7. **Pets** — Show pet abilities (revive, detect paths)
  8. **Shop Preview** — Show what coins can buy (upgrades, themes, music)
  9. **Boss Preview** — Show spell-shooting combat basics
  10. **Themes & Music** — Show how purchased themes change the world
  11. **Ready!** — Tutorial complete, proceed to World Map

## Phase 3: Rebuild Level Generator for 3D
- Update `src/lib/levelGenerator.ts` to output 3D platform layouts
- Convert existing obstacle concepts (moving stairs, trolls, chess pieces, flying car) into 3D equivalents
- Each level generates: platform positions (x,y,z), obstacle types, coin placements, boss arenas

## Phase 4: Replace GameCanvas with 3D Version
- Replace `src/components/game/GameCanvas.tsx` with the new 3D engine
- Wire into existing `useGameState` (coins, lives, completion, boosts)
- Keep all existing screens (title, world map, shop, settings) unchanged

## Phase 5: Integration & Polish
- Add tutorial flag to game profile (completed_tutorial)
- Tutorial auto-triggers before World 1 for new players
- Ensure shop boosts (speed, jump, double coins) work in 3D
- Ensure theme colors apply to 3D world lighting/fog
