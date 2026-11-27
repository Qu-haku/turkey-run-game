import { STEP } from './config.js';
import { createRun, jump, stepRun, totalScore } from './world.js';
import { render } from './render.js';
import { stageShot } from './shots.js';
import { createSound } from './audio.js';
import { bindInput } from './input.js';

const canvas = document.querySelector('#game');
const context = canvas.getContext('2d', { alpha: false });
const frame = document.querySelector('#frame');
const status = document.querySelector('#status');
const go = document.querySelector('#go');
const mute = document.querySelector('#mute');
const params = new URLSearchParams(location.search);
const requestedShot = params.get('shot');
const shotAliases = { 1: 'start', 2: 'play', 3: 'caught', 4: 'escaped' };
const normalizedShot = Object.hasOwn(shotAliases, requestedShot) ? shotAliases[requestedShot] : requestedShot;
const shot = ['start','play','end','caught','escaped'].includes(normalizedShot) ? normalizedShot : 'start';
const seedParam = params.get('seed');
const seed = seedParam !== null && Number.isFinite(Number(seedParam)) ? Number(seedParam) | 0 :
  requestedShot ? 1 : Date.now() | 0;
const sound = createSound();
let { screen, run } = requestedShot ? stageShot(shot, seed) : { screen: 'title', run: createRun(seed) };
let frozen = Boolean(requestedShot);
let previous = 0;
let elapsed = 0;
let endDelay = 0;
let muted = false;
let hover = "";
const animateTitle = !matchMedia('(prefers-reduced-motion: reduce)').matches;

function updateScreen() {
  frame.dataset.screen = screen;
  go.setAttribute('aria-label', screen === 'title' ? 'Run for it' : 'Run again');
  hover = '';
  status.textContent = screen === 'title' ? 'Gobble Run. Press space or click to run.' :
    screen === 'play' ? 'Run started. Jump with space or click. Slide with down.' :
      `${screen === 'escaped' ? 'Escaped' : 'Caught'}. Score ${totalScore(run)}. Distance ${Math.floor(run.distance)} metres.`;
}

function startRun() {
  frozen = false;
  run = createRun(seed);
  screen = 'play';
  elapsed = 0;
  input.clear();
  updateScreen();
  go.blur();
  sound.play('gobble');
  previous = 0;
  schedule();
}

function activate() {
  if (screen !== 'play' || frozen) {
    if (performance.now() >= endDelay) startRun();
  } else if (jump(run)) {
    sound.play('jump');
  }
}

const input = bindInput(canvas, activate, sound.unlock);
go.addEventListener('click', () => { sound.unlock(); activate(); });
mute.addEventListener('click', () => {
  sound.unlock();
  muted = sound.toggle();
  schedule();
  mute.setAttribute('aria-pressed', String(muted));
  mute.setAttribute('aria-label', muted ? 'Unmute sound' : 'Mute sound');
  mute.blur();
});

for (const button of frame.querySelectorAll('button')) {
  button.addEventListener('pointerenter', () => {
    hover = button.id || button.dataset.hold;
    schedule();
  });
  button.addEventListener('pointerleave', () => {
    hover = '';
    schedule();
  });
}

let pending = 0;
function schedule() {
  if (!pending) pending = requestAnimationFrame(tick);
}

function tick(now) {
  pending = 0;
  const dt = previous ? Math.min(.065, (now - previous) / 1000) : 0;
  previous = now;
  if (!frozen && screen === 'play') {
    elapsed += dt;
    const controls = input.read();
    while (elapsed >= STEP && !run.outcome) {
      stepRun(run, STEP, controls, sound.play);
      elapsed -= STEP;
    }
    if (run.outcome) {
      screen = run.outcome;
      endDelay = now + 375;
      updateScreen();
    }
  } else if (!frozen && screen === 'title' && animateTitle) run.time += dt;
  render(context, screen, run, { muted, hover });
  if (!frozen && (screen === 'play' || (screen === 'title' && animateTitle))) schedule();
}

updateScreen();
render(context, screen, run, { muted, hover });
window.__shotReady = true;
if (!frozen && animateTitle) schedule();
