// Web Audio API music engine - magical melody loop
let audioCtx: AudioContext | null = null;
let isPlaying = false;
let currentTimeout: number | null = null;
let gainNode: GainNode | null = null;

// A magical, whimsical melody (original composition, celesta-like tone)
// Notes as [frequency, duration in beats]
const MELODY: [number, number][] = [
  // Phrase 1 - mysterious ascending
  [493.88, 1],   // B4
  [659.25, 1.5], // E5
  [698.46, 0.5], // F5
  [659.25, 1],   // E5
  [783.99, 1],   // G5
  [739.99, 2],   // F#5
  [659.25, 1],   // E5

  // Phrase 2 - descending with wonder
  [493.88, 1],   // B4
  [659.25, 1.5], // E5
  [698.46, 0.5], // F5
  [622.25, 1],   // Eb5
  [523.25, 1],   // C5
  [587.33, 2],   // D5

  // Phrase 3 - rising tension
  [493.88, 1],   // B4
  [659.25, 1.5], // E5
  [783.99, 0.5], // G5
  [880.00, 1],   // A5
  [783.99, 1],   // G5
  [659.25, 1],   // E5
  [698.46, 1],   // F5
  [493.88, 2],   // B4

  // Phrase 4 - resolution
  [523.25, 1],   // C5
  [493.88, 0.5], // B4
  [440.00, 0.5], // A4
  [493.88, 1],   // B4
  [392.00, 1],   // G4
  [329.63, 2],   // E4

  // Rest
  [0, 2],
];

const BPM = 140;
const BEAT_TIME = 60 / BPM;

function createMagicalTone(ctx: AudioContext, freq: number, startTime: number, duration: number, gain: GainNode) {
  if (freq === 0) return;

  // Celesta-like sound: sine + soft harmonics
  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const oscGain1 = ctx.createGain();
  const oscGain2 = ctx.createGain();

  osc1.type = "sine";
  osc1.frequency.value = freq;
  osc2.type = "sine";
  osc2.frequency.value = freq * 3; // 3rd harmonic for bell quality

  oscGain1.gain.setValueAtTime(0.15, startTime);
  oscGain1.gain.exponentialRampToValueAtTime(0.001, startTime + duration * BEAT_TIME * 0.95);

  oscGain2.gain.setValueAtTime(0.04, startTime);
  oscGain2.gain.exponentialRampToValueAtTime(0.001, startTime + duration * BEAT_TIME * 0.6);

  osc1.connect(oscGain1).connect(gain);
  osc2.connect(oscGain2).connect(gain);

  osc1.start(startTime);
  osc1.stop(startTime + duration * BEAT_TIME);
  osc2.start(startTime);
  osc2.stop(startTime + duration * BEAT_TIME);
}

function scheduleLoop() {
  if (!audioCtx || !gainNode || !isPlaying) return;

  let time = audioCtx.currentTime + 0.1;
  for (const [freq, dur] of MELODY) {
    createMagicalTone(audioCtx, freq, time, dur, gainNode);
    time += dur * BEAT_TIME;
  }

  const loopDuration = MELODY.reduce((sum, [, d]) => sum + d * BEAT_TIME, 0);
  currentTimeout = window.setTimeout(() => {
    if (isPlaying) scheduleLoop();
  }, loopDuration * 1000 - 500);
}

export function startMusic() {
  if (isPlaying) return;

  audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  gainNode = audioCtx.createGain();
  gainNode.gain.value = 0.5;
  gainNode.connect(audioCtx.destination);

  isPlaying = true;
  scheduleLoop();
}

export function stopMusic() {
  isPlaying = false;
  if (currentTimeout) clearTimeout(currentTimeout);
  if (audioCtx) {
    audioCtx.close();
    audioCtx = null;
  }
}

export function setVolume(vol: number) {
  if (gainNode) gainNode.gain.value = Math.max(0, Math.min(1, vol));
}

export function isMusicPlaying() {
  return isPlaying;
}

export function toggleMusic() {
  if (isPlaying) stopMusic();
  else startMusic();
}
