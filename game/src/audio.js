const cues = {
  gobble: [380, 290, 400, 265], jump: [350, 560], hit: [164, 92],
  pickup: [680, 960], gold: [520, 659, 880, 1175],
  escaped: [392, 523, 659, 784, 1047], caught: [330, 294, 220, 147],
};

export function createSound() {
  let audio;
  let volume;
  let muted = false;
  return {
    unlock() {
      if (!window.AudioContext) return;
      if (!audio) {
        audio = new AudioContext();
        volume = audio.createGain();
        volume.gain.value = Number(!muted);
        volume.connect(audio.destination);
      }
      if (audio.state === 'suspended') audio.resume().catch(() => {});
    },
    toggle() {
      muted = !muted;
      if (volume) volume.gain.setTargetAtTime(Number(!muted), audio.currentTime, .012);
      return muted;
    },
    play(name) {
      if (muted || !audio) return;
      const rough = ['gobble', 'hit', 'caught'].includes(name);
      const spacing = name === 'escaped' || name === 'caught' ? .115 : .061;
      cues[name].forEach((frequency, i) => {
        const start = audio.currentTime + i * spacing;
        const oscillator = audio.createOscillator();
        const envelope = audio.createGain();
        oscillator.type = rough ? 'triangle' : 'sine';
        oscillator.frequency.setValueAtTime(frequency, start);
        oscillator.frequency.exponentialRampToValueAtTime(frequency * (rough ? .73 : 1.08), start + .09);
        envelope.gain.setValueAtTime(.001, start);
        envelope.gain.exponentialRampToValueAtTime(.13, start + .012);
        envelope.gain.exponentialRampToValueAtTime(.001, start + .14);
        oscillator.connect(envelope).connect(volume);
        oscillator.start(start);
        oscillator.stop(start + .145);
      });
    },
  };
}
