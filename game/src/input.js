const jumps = new Set(['Space', 'ArrowUp', 'KeyW']);
const movement = new Map([
  ['ArrowDown','duck'], ['KeyS','duck'], ['ArrowLeft','slow'], ['KeyA','slow'],
  ['ArrowRight','fast'], ['KeyD','fast'],
]);

export function bindInput(canvas, activate, unlock) {
  const held = new Map();
  window.addEventListener('keydown', event => {
    if (event.code === 'Space' && event.target instanceof HTMLButtonElement) return;
    if (!jumps.has(event.code) && !movement.has(event.code)) return;
    event.preventDefault();
    unlock();
    if (jumps.has(event.code)) {
      if (!event.repeat) activate();
    } else held.set(event.code,movement.get(event.code));
  });
  window.addEventListener('keyup', event => held.delete(event.code));
  window.addEventListener('blur', () => held.clear());
  canvas.addEventListener('pointerdown', event => {
    if (event.button !== 0) return;
    unlock();
    activate();
  });
  for (const button of document.querySelectorAll('[data-hold]')) {
    const token = button.dataset.hold;
    button.addEventListener('pointerdown', event => {
      if (event.button !== 0) return;
      event.preventDefault();
      unlock();
      button.setPointerCapture(event.pointerId);
      held.set(token, token);
    });
    button.addEventListener('lostpointercapture', () => held.delete(token));
    button.addEventListener('keydown', event => {
      if (event.code !== 'Space' && event.code !== 'Enter') return;
      event.preventDefault();
      unlock();
      held.set(token, token);
    });
    button.addEventListener('keyup', event => {
      if (event.code === 'Space' || event.code === 'Enter') held.delete(token);
    });
    button.addEventListener('blur', () => held.delete(token));
  }
  return {
    read() {
      const actions = new Set(held.values());
      return { duck: actions.has('duck'), speed: Number(actions.has('fast')) - Number(actions.has('slow')) };
    },
    clear() { held.clear(); },
  };
}
