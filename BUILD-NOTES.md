# Gobble Run — The Great Turkey Escape

An offline Canvas 2D runner through a sunset farm to Freedom Forest, 1,200 m away. The farmer gains ground on hits and falls back during clean runs and corn pickups. Jump over bales and fences, slide beneath thrown knives, and choose either route around the oven. Golden corn gives a larger score and speed bonus. Keyboard and pointer controls, synthesized sound, and both restartable endings are built in.

The harvest-poster art pairs parchment display lettering with a persimmon sky, amber fields, and deep teal woods. Parallax scenery, running poses, and the chase HUD carry the action. The seeded play frame was staged by hand using the game's shared renderer.

## Verification

- Ran the requested headless Chrome binary with local ES module access after this sandbox denied the localhost bind for `node serve.ts`. Captured the game's complete canvas frames in Chrome and visually inspected the four 1280×800 PNG previews. The four final JPEGs are direct Chrome canvas captures under 256 KiB each.
- Exercised deterministic named and numeric shots, the `end` alias, seed variation, keyboard start and jump, pointer jump, mute, a live catch, a live 1,200 m escape, and restart in Chrome. The page loaded only local resources and reported no JavaScript errors.
- Ran `node --check` on every game module and `MAKEFUN_OUTPUT_DIR=out node main.ts`. Compared the copied files with their sources and confirmed that the vendored dossier builder matches the starter byte for byte.
