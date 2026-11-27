import { createRun } from './world.js';
import { GROUND } from './config.js';

export function stageShot(name, seed) {
  const run = createRun(seed);
  if (name === 'start') return { screen: 'title', run: { ...run, time: 1.15 } };
  const variant = Math.floor(run.random() * 9);
  if (name === 'play') {
    Object.assign(run, {
      time: 18.52, distance: 684, travel: 684 * 14, lives: 2,
      speed: 447, gap: 120, rise: 71, jumps: 1, score: 900,
      items: [
        { kind: 'knife', x: 501, origin: 1230 },
        { kind: 'hay', x: 479 }, { kind: 'oven', x: 863 }, { kind: 'fence', x: 1162 },
        { kind: 'corn', x: 580, y: GROUND - 110 - variant },
        { kind: 'corn', x: 649, y: GROUND - 139 - variant },
        { kind: 'gold', x: 718, y: GROUND - 137 - variant },
        { kind: 'corn', x: 786, y: GROUND - 111 - variant },
      ],
    });
    return { screen: 'play', run };
  }
  const escaped = name === 'escaped';
  const distance = escaped ? 1200 : 684;
  Object.assign(run, { outcome: escaped ? 'escaped' : 'caught', distance, travel: distance * 14,
    score: escaped ? 2240 : 900, lives: escaped ? 2 : 0, time: 4.16 });
  return { screen: run.outcome, run };
}
