---
name: Festival Quest Structure
description: Each festival quest is a 15-level mini-campaign with progressive difficulty; reward unlocks after final level
type: feature
---
Each of the festival side-quests is a 15-level sequential campaign (`LEVELS_PER_QUEST = 15` in `src/lib/festivalQuests.ts`).

- Chapters cycle through the quest's chapter pool: `chapterIndex = (yearlyIndex + levelIndex) % chapters.length`.
- Difficulty scales with `t = levelIndex / 14`: +0..8 platforms, +0..6 targets, -0..15s time (min 45s).
- Per-level seed: `getQuestSeed(quest, levelIndex)` so every level has a unique layout.
- Player progress lives in `profile.festivalProgress[questId]` (stored in localStorage alongside equipment).
- The exclusive cosmetic pet is granted **only** after clearing level 15.
- Replaying a fully-completed quest restarts at level 1 (progress is not reset; reward stays unlocked).

Reward access:
- `🎁 Festival Rewards` gallery (button on World Map → `FestivalRewardsGallery.tsx`) lists every festival pet, with progress bars for locked ones and an Equip button for unlocked ones.
- Festival pets also appear in the regular Pet Store after unlock.
- Final completion screen offers a "🎁 View Reward" shortcut to the gallery.
