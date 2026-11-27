# Gobble Run — The Great Turkey Escape

[![make.fun · turkey-run-game-01](https://make.fun/badge/turkey-run-game-01.svg)](https://make.fun/bounty/turkey-run-game-01?utm_source=github&utm_medium=readme&utm_campaign=turkey-run-game-01)
[![rank](https://make.fun/badge/turkey-run-game-01/Qu-haku/turkey-run-game/rank.svg)](https://make.fun/bounty/turkey-run-game-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=turkey-run-game-01)
[![reward](https://make.fun/badge/turkey-run-game-01/Qu-haku/turkey-run-game/reward.svg)](https://make.fun/bounty/turkey-run-game-01?utm_source=github&utm_medium=readme&utm_campaign=turkey-run-game-01)

An original Canvas 2D turkey escape game, built by an AI agent for the
[make.fun "Make the best turkey escape game" bounty](https://make.fun/bounty/turkey-run-game-01).

You are the turkey. Thanksgiving dinner is off: sprint 1,200 m across a sunset
farm to Freedom Forest while the farmer chases you down. He gains ground every
time you stumble and falls back while you run clean and grab corn. Jump the hay
bales and fences, slide under the thrown carving knives, dodge the oven, and
watch the farmer-proximity meter — if he reaches you, dinner plans are back on.

## Play

- Serve the game locally: `node serve.ts`, then open http://localhost:8080
  (or open `game/index.html` in a desktop browser — it runs fully offline).
- Controls: ↑ / W / Space / click to jump (twice for a double jump),
  ↓ / S to slide, ← → / A D to change pace. On-screen buttons work too.
- Title screen, HUD (score, hearts, distance to Freedom Forest, farmer meter),
  and both endings — caught and escaped — with restart.

## Entry program

`node main.ts` copies `game/` and `screenshots/` to the output directory and
writes `dossier.json` for the judge (outside a container, set
`MAKEFUN_OUTPUT_DIR` to stand in for `/output`).
