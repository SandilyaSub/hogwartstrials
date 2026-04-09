// Web Audio API music engine - multiple song support
let audioCtx: AudioContext | null = null;
let isPlaying = false;
let currentTimeout: number | null = null;
let gainNode: GainNode | null = null;
let currentSongId = "default";

// Notes as [frequency, duration in beats]
type Note = [number, number];

const SONGS: Record<string, { melody: Note[]; bpm: number; waveform: OscillatorType; harmonicMul: number; label: string }> = {
  default: {
    label: "Hedwig's Theme",
    bpm: 140,
    waveform: "sine",
    harmonicMul: 3,
    melody: [
      [493.88, 1], [659.25, 1.5], [698.46, 0.5], [659.25, 1], [783.99, 1], [739.99, 2], [659.25, 1],
      [493.88, 1], [659.25, 1.5], [698.46, 0.5], [622.25, 1], [523.25, 1], [587.33, 2],
      [493.88, 1], [659.25, 1.5], [783.99, 0.5], [880.00, 1], [783.99, 1], [659.25, 1], [698.46, 1], [493.88, 2],
      [523.25, 1], [493.88, 0.5], [440.00, 0.5], [493.88, 1], [392.00, 1], [329.63, 2],
      [0, 2],
    ],
  },
  song_adventure: {
    label: "The Quidditch Pitch",
    bpm: 170,
    waveform: "triangle",
    harmonicMul: 2,
    melody: [
      [523.25, 0.5], [659.25, 0.5], [783.99, 0.5], [1046.50, 1], [987.77, 0.5], [880.00, 0.5], [783.99, 1],
      [659.25, 0.5], [783.99, 0.5], [880.00, 1], [783.99, 0.5], [659.25, 0.5], [523.25, 1.5],
      [587.33, 0.5], [698.46, 0.5], [880.00, 1], [783.99, 0.5], [698.46, 0.5], [659.25, 1], [587.33, 0.5], [523.25, 1.5],
      [440.00, 0.5], [523.25, 0.5], [659.25, 1], [587.33, 1], [523.25, 2],
      [0, 1.5],
    ],
  },
  song_dark: {
    label: "The Dark Forest",
    bpm: 90,
    waveform: "sine",
    harmonicMul: 5,
    melody: [
      [220.00, 2], [233.08, 1], [220.00, 1], [196.00, 2], [185.00, 1], [196.00, 1],
      [261.63, 1.5], [246.94, 0.5], [220.00, 2], [196.00, 1], [174.61, 1], [164.81, 2],
      [196.00, 1], [220.00, 1], [246.94, 1.5], [261.63, 0.5], [246.94, 1], [220.00, 3],
      [0, 2],
    ],
  },
  song_triumphant: {
    label: "Victory at Hogwarts",
    bpm: 150,
    waveform: "triangle",
    harmonicMul: 2,
    melody: [
      [523.25, 1], [523.25, 0.5], [523.25, 0.5], [659.25, 1.5], [587.33, 0.5], [659.25, 1], [783.99, 2],
      [659.25, 1], [783.99, 1], [880.00, 1], [1046.50, 2], [880.00, 0.5], [783.99, 0.5], [659.25, 2],
      [523.25, 1], [587.33, 1], [659.25, 1], [783.99, 1.5], [880.00, 0.5], [783.99, 1], [659.25, 1], [523.25, 2],
      [0, 2],
    ],
  },
  song_peaceful: {
    label: "The Great Lake",
    bpm: 80,
    waveform: "sine",
    harmonicMul: 4,
    melody: [
      [329.63, 2], [392.00, 1], [440.00, 2], [392.00, 1], [329.63, 2],
      [293.66, 1], [329.63, 1.5], [392.00, 0.5], [440.00, 2], [392.00, 2],
      [329.63, 1], [293.66, 1], [261.63, 2], [293.66, 1], [329.63, 3],
      [0, 2],
    ],
  },
  song_battle: {
    label: "Battle of Hogwarts",
    bpm: 180,
    waveform: "sawtooth",
    harmonicMul: 2,
    melody: [
      [220.00, 0.5], [261.63, 0.5], [329.63, 0.5], [440.00, 1], [392.00, 0.5], [329.63, 0.5], [261.63, 0.5],
      [293.66, 0.5], [349.23, 0.5], [440.00, 1], [523.25, 0.5], [440.00, 0.5], [349.23, 0.5], [293.66, 0.5],
      [329.63, 1], [440.00, 0.5], [523.25, 0.5], [659.25, 1], [523.25, 0.5], [440.00, 0.5],
      [329.63, 0.5], [261.63, 0.5], [220.00, 1.5],
      [0, 1],
    ],
  },
  song_lush_life: {
    label: "Lush Life",
    bpm: 120,
    waveform: "triangle",
    harmonicMul: 2,
    melody: [
      [392.00, 0.5], [440.00, 0.5], [523.25, 1], [493.88, 0.5], [440.00, 0.5], [392.00, 1],
      [349.23, 0.5], [392.00, 0.5], [440.00, 1.5], [392.00, 0.5], [349.23, 1],
      [329.63, 0.5], [392.00, 0.5], [440.00, 1], [523.25, 0.5], [493.88, 0.5], [440.00, 1.5],
      [392.00, 0.5], [349.23, 0.5], [329.63, 0.5], [349.23, 1], [392.00, 2],
      [0, 1],
    ],
  },
  song_touch: {
    label: "Touch",
    bpm: 130,
    waveform: "sine",
    harmonicMul: 3,
    melody: [
      [523.25, 0.5], [587.33, 0.5], [659.25, 1], [587.33, 0.5], [523.25, 0.5], [493.88, 1],
      [440.00, 0.5], [493.88, 0.5], [523.25, 1.5], [493.88, 0.5], [440.00, 1],
      [523.25, 0.5], [659.25, 0.5], [783.99, 1], [659.25, 0.5], [587.33, 0.5], [523.25, 1],
      [493.88, 0.5], [523.25, 0.5], [587.33, 1], [523.25, 1.5],
      [0, 1],
    ],
  },
  song_passo_bem_solto: {
    label: "Passo Bem Solto",
    bpm: 105,
    waveform: "triangle",
    harmonicMul: 2,
    melody: [
      [329.63, 0.5], [349.23, 0.5], [392.00, 1], [440.00, 0.5], [392.00, 0.5], [349.23, 0.5], [329.63, 0.5],
      [293.66, 1], [329.63, 0.5], [349.23, 0.5], [392.00, 1.5], [349.23, 0.5],
      [329.63, 0.5], [293.66, 0.5], [261.63, 1], [293.66, 0.5], [329.63, 0.5], [349.23, 1],
      [392.00, 0.5], [440.00, 0.5], [392.00, 1], [349.23, 0.5], [329.63, 1.5],
      [0, 1],
    ],
  },
  song_levitating: {
    label: "Levitating",
    bpm: 103,
    waveform: "triangle",
    harmonicMul: 2,
    melody: [
      [440.00, 0.5], [493.88, 0.5], [523.25, 0.5], [587.33, 1], [523.25, 0.5], [493.88, 0.5], [440.00, 0.5],
      [392.00, 1], [440.00, 0.5], [493.88, 0.5], [523.25, 1.5],
      [587.33, 0.5], [523.25, 0.5], [493.88, 0.5], [440.00, 1], [493.88, 0.5], [523.25, 0.5],
      [587.33, 1], [523.25, 0.5], [493.88, 0.5], [440.00, 1.5],
      [0, 1],
    ],
  },
  song_blinding_lights: {
    label: "Blinding Lights",
    bpm: 171,
    waveform: "sawtooth",
    harmonicMul: 2,
    melody: [
      [493.88, 0.5], [587.33, 0.5], [659.25, 1], [587.33, 0.5], [493.88, 0.5], [440.00, 1],
      [493.88, 0.5], [587.33, 0.5], [659.25, 0.5], [783.99, 1], [659.25, 0.5], [587.33, 1],
      [493.88, 0.5], [440.00, 0.5], [392.00, 1], [440.00, 0.5], [493.88, 0.5], [587.33, 1.5],
      [493.88, 0.5], [440.00, 0.5], [392.00, 1.5],
      [0, 1],
    ],
  },
  song_dancin: {
    label: "Dancin",
    bpm: 118,
    waveform: "sine",
    harmonicMul: 3,
    melody: [
      [523.25, 1], [493.88, 0.5], [440.00, 0.5], [392.00, 1], [440.00, 0.5], [493.88, 0.5],
      [523.25, 1], [587.33, 0.5], [523.25, 0.5], [493.88, 1.5],
      [440.00, 0.5], [392.00, 0.5], [349.23, 1], [392.00, 0.5], [440.00, 0.5], [493.88, 1],
      [523.25, 0.5], [587.33, 0.5], [523.25, 1], [493.88, 1.5],
      [0, 1],
    ],
  },
  song_super_shy: {
    label: "Super Shy",
    bpm: 150,
    waveform: "triangle",
    harmonicMul: 2,
    melody: [
      [659.25, 0.5], [587.33, 0.5], [523.25, 0.5], [493.88, 1], [523.25, 0.5], [587.33, 0.5], [659.25, 1],
      [783.99, 0.5], [659.25, 0.5], [587.33, 1], [523.25, 0.5], [493.88, 0.5],
      [440.00, 1], [493.88, 0.5], [523.25, 0.5], [587.33, 1], [659.25, 0.5], [587.33, 0.5],
      [523.25, 1], [493.88, 0.5], [440.00, 1.5],
      [0, 1],
    ],
  },
};

function createMagicalTone(ctx: AudioContext, freq: number, startTime: number, duration: number, gain: GainNode, song: typeof SONGS[string]) {
  if (freq === 0) return;
  const beatTime = 60 / song.bpm;

  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const oscGain1 = ctx.createGain();
  const oscGain2 = ctx.createGain();

  osc1.type = song.waveform;
  osc1.frequency.value = freq;
  osc2.type = "sine";
  osc2.frequency.value = freq * song.harmonicMul;

  oscGain1.gain.setValueAtTime(0.15, startTime);
  oscGain1.gain.exponentialRampToValueAtTime(0.001, startTime + duration * beatTime * 0.95);

  oscGain2.gain.setValueAtTime(0.04, startTime);
  oscGain2.gain.exponentialRampToValueAtTime(0.001, startTime + duration * beatTime * 0.6);

  osc1.connect(oscGain1).connect(gain);
  osc2.connect(oscGain2).connect(gain);

  osc1.start(startTime);
  osc1.stop(startTime + duration * beatTime);
  osc2.start(startTime);
  osc2.stop(startTime + duration * beatTime);
}

function scheduleLoop() {
  if (!audioCtx || !gainNode || !isPlaying) return;

  const song = SONGS[currentSongId] || SONGS.default;
  const beatTime = 60 / song.bpm;

  let time = audioCtx.currentTime + 0.1;
  for (const [freq, dur] of song.melody) {
    createMagicalTone(audioCtx, freq, time, dur, gainNode, song);
    time += dur * beatTime;
  }

  const loopDuration = song.melody.reduce((sum, [, d]) => sum + d * beatTime, 0);
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

export function setSong(songId: string) {
  const id = songId === "default" ? "default" : songId;
  if (id === currentSongId) return;
  currentSongId = id;
  if (isPlaying) {
    stopMusic();
    startMusic();
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
