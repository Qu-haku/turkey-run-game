import { createRandom } from './random.js';
import { clamp, GOAL, GROUND, TURKEY_X } from './config.js';

export function createRun(seed) {
  return {
    random: createRandom(seed), time: 0, travel: 0, distance: 0, speed: 330,
    rise: 0, velocity: 0, jumps: 0, slide: false, lives: 3, gap: 258,
    hurt: 0, boost: 0, score: 0, outcome: '', items: [], effects: [],
    next: 700, pattern: 0, feedback: '', feedbackTime: 0,
  };
}

export function knifeHeight(item) {
  const progress = clamp((item.origin - item.x) / 1130, 0, 1);
  return 32 + 181 * 4 * progress * (1 - progress);
}

function spawnEncounter(run) {
  const kinds = ['hay', 'knife', 'fence', 'oven'];
  const kind = run.pattern < 4 ? kinds[run.pattern] : kinds[Math.floor(run.random() * 4)];
  const x = run.next - run.travel + TURKEY_X;
  run.items.push({ kind, x, origin: x });
  const height = { hay: 108, fence: 143, oven: 143, knife: 23 }[kind];
  for (let i = 0; i < 4; i++) {
    run.items.push({ kind: i === 3 && (run.pattern === 3 || run.random() < .19) ? 'gold' : 'corn',
      x: x - 100 + i * 66, y: GROUND - height - (i === 1 || i === 2 ? 17 : 0) });
  }
  run.pattern++;
  run.next += 790 - 270 * (run.distance / GOAL) + run.random() * 135;
}

function overlaps(run, item) {
  const heights = { hay: 66, fence: 100, oven: 117 };
  const widths = { hay: 82, fence: 85, oven: 108 };
  const dx = item.x - TURKEY_X;
  const bottom = GROUND - run.rise - 7;
  const top = bottom - (run.slide ? 29 : 63);
  if (item.kind === 'knife') {
    const y = GROUND - knifeHeight(item);
    return Math.abs(dx) < 40 && top < y + 12 && bottom > y - 12;
  }
  if (item.kind === 'corn' || item.kind === 'gold') {
    return Math.abs(dx) < 41 && top - 12 < item.y && bottom + 12 > item.y;
  }
  const obstacleTop = GROUND - heights[item.kind];
  const obstacleBottom = GROUND - (item.kind === 'oven' ? 40 : 0);
  return Math.abs(dx) < widths[item.kind] / 2 + 19 && top < obstacleBottom && bottom > obstacleTop;
}

export function jump(run) {
  if (run.jumps >= 2) return false;
  run.velocity = run.jumps ? 480 : 488;
  run.jumps++;
  run.slide = false;
  return true;
}

export function stepRun(run, dt, input, sound) {
  if (run.outcome) return;
  run.time += dt;
  run.hurt = Math.max(0, run.hurt - dt);
  run.boost = Math.max(0, run.boost - dt);
  run.feedbackTime = Math.max(0, run.feedbackTime - dt);
  run.slide = input.duck && run.rise === 0;
  if (run.jumps) {
    run.velocity -= (input.duck ? 2070 : 1180) * dt;
    run.rise += run.velocity * dt;
    if (run.rise <= 0) {
      run.rise = 0;
      run.velocity = 0;
      run.jumps = 0;
    }
  }

  const targetSpeed = 335 + run.distance * .124 + input.speed * 83 + (run.boost ? 64 : 0);
  run.speed += (targetSpeed - run.speed) * Math.min(1, dt * 4.2);
  const move = run.speed * dt;
  run.travel += move;
  run.distance = Math.min(GOAL, run.travel / 14);
  run.gap = clamp(run.gap + dt * (run.hurt ? -5 : 9 + input.speed * 6), 0, 280);
  while (run.next - run.travel < 1050 && run.next / 14 < GOAL - 31) spawnEncounter(run);

  for (const item of run.items) {
    item.x -= move + (item.kind === 'knife' ? 120 * dt : 0);
    if (item.used || !overlaps(run, item)) continue;
    if (item.kind === 'corn' || item.kind === 'gold') {
      const golden = item.kind === 'gold';
      run.score += golden ? 250 : 50;
      run.boost = golden ? 1.9 : 1.1;
      run.gap = Math.min(280, run.gap + (golden ? 30 : 12));
      run.feedback = golden ? '+250  GOLDEN CORN' : '+50';
      run.feedbackTime = .85;
      run.effects.push({ x: item.x, y: item.y, age: 0, gold: golden });
      item.used = true;
      sound(golden ? 'gold' : 'pickup');
    } else if (!run.hurt) {
      run.lives--;
      run.gap -= 101;
      run.speed *= .57;
      run.hurt = 1.28;
      run.boost = 0;
      run.feedback = 'HE’S GAINING!';
      run.feedbackTime = 1;
      sound('hit');
    }
  }
  for (const effect of run.effects) effect.age += dt;
  run.effects = run.effects.filter(effect => effect.age < .45);
  run.items = run.items.filter(item => !item.used && item.x > -120);
  if (!run.lives || run.gap <= 0) run.outcome = 'caught';
  else if (run.distance >= GOAL) {
    run.outcome = 'escaped';
    run.score += 500;
  }
  if (run.outcome) sound(run.outcome);
}

export function totalScore(run) {
  return Math.floor(run.distance) + run.score;
}
