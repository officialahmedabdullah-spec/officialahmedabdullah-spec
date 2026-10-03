/* Tiny UI sounds synthesised with Web Audio — no audio files to load.
   Nothing plays until the visitor turns sound on. */

let context = null;

const SOUNDS = {
  tick: { freq: 640, to: 900, dur: 0.045, type: "sine", vol: 0.04 },
  pop: { freq: 420, to: 760, dur: 0.08, type: "triangle", vol: 0.05 },
  press: { freq: 300, to: 220, dur: 0.06, type: "triangle", vol: 0.05 },
  release: { freq: 260, to: 520, dur: 0.09, type: "sine", vol: 0.04 },
  toggle: { freq: 520, to: 780, dur: 0.07, type: "sine", vol: 0.045 },
  swoosh: { freq: 180, to: 900, dur: 0.28, type: "sine", vol: 0.025 },
  copy: { freq: 880, to: 1320, dur: 0.07, type: "sine", vol: 0.04 },
  nope: { freq: 200, to: 140, dur: 0.12, type: "square", vol: 0.025 },
};

// a wet splash: a burst of low-passed noise plus a falling "bloop"
function splash(ctx, size) {
  const t = ctx.currentTime;
  const dur = 0.25 + size * 0.35;
  const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur), ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length) ** 2;
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(2200, t);
  filter.frequency.exponentialRampToValueAtTime(300, t + dur);
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.05 + size * 0.06, t);
  noise.connect(filter).connect(gain).connect(ctx.destination);
  noise.start(t);

  const bloop = ctx.createOscillator();
  const bloopGain = ctx.createGain();
  bloop.frequency.setValueAtTime(520, t);
  bloop.frequency.exponentialRampToValueAtTime(110, t + 0.18);
  bloopGain.gain.setValueAtTime(0.06, t);
  bloopGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.2);
  bloop.connect(bloopGain).connect(ctx.destination);
  bloop.start(t);
  bloop.stop(t + 0.22);
}

export function playSound(name, pitch = 1) {
  context = context || new (window.AudioContext || window.webkitAudioContext)();
  if (context.state === "suspended") context.resume();
  if (name === "splash") {
    splash(context, pitch);
    return;
  }
  const s = SOUNDS[name];
  if (!s) return;

  const t = context.currentTime;
  const osc = context.createOscillator();
  const gain = context.createGain();
  osc.type = s.type;
  osc.frequency.setValueAtTime(s.freq * pitch, t);
  osc.frequency.exponentialRampToValueAtTime(s.to * pitch, t + s.dur);
  gain.gain.setValueAtTime(s.vol, t);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + s.dur);
  osc.connect(gain).connect(context.destination);
  osc.start(t);
  osc.stop(t + s.dur + 0.02);
}
