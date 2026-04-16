// MP3-based music engine with cloud-hosted tracks
let audio: HTMLAudioElement | null = null;
let isPlaying = false;
let currentSongId = "default";
let currentVolume = 0.5;

const STORAGE_BASE = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/game-music`;

const SONG_FILES: Record<string, { file: string; label: string }> = {
  default:              { file: "default.mp3",          label: "Hedwig's Theme" },
  song_default:         { file: "default.mp3",          label: "Hedwig's Theme" },
  song_adventure:       { file: "adventure.mp3",        label: "The Quidditch Pitch" },
  song_dark:            { file: "dark_forest.mp3",      label: "The Dark Forest" },
  song_triumphant:      { file: "victory.mp3",          label: "Victory at Hogwarts" },
  song_peaceful:        { file: "peaceful.mp3",         label: "The Great Lake" },
  song_battle:          { file: "battle.mp3",            label: "Battle of Hogwarts" },
  song_lush_life:       { file: "lush_life.mp3",        label: "Lush Life" },
  song_touch:           { file: "touch.mp3",            label: "Touch" },
  song_passo_bem_solto: { file: "passo_bem_solto.mp3",  label: "Passo Bem Solto" },
  song_levitating:      { file: "levitating.mp3",       label: "Levitating" },
  song_blinding_lights: { file: "blinding_lights.mp3",  label: "Blinding Lights" },
  song_dancin:          { file: "dancin.mp3",            label: "Dancin" },
  song_super_shy:       { file: "super_shy.mp3",        label: "Super Shy" },
};

function getUrl(songId: string): string {
  const entry = SONG_FILES[songId] || SONG_FILES.default;
  return `${STORAGE_BASE}/${entry.file}`;
}

export function startMusic() {
  if (isPlaying && audio) return;

  const url = getUrl(currentSongId);
  audio = new Audio(url);
  audio.loop = true;
  audio.volume = currentVolume;
  audio.play().catch((err) => console.warn("Music autoplay blocked:", err));
  isPlaying = true;
}

export function stopMusic() {
  if (audio) {
    audio.pause();
    audio.src = "";
    audio = null;
  }
  isPlaying = false;
}

export function setSong(songId: string) {
  const id = songId || "default";
  if (id === currentSongId) return;
  currentSongId = id;
  if (isPlaying) {
    stopMusic();
    startMusic();
  }
}

export function setVolume(vol: number) {
  currentVolume = Math.max(0, Math.min(1, vol));
  if (audio) audio.volume = currentVolume;
}

export function isMusicPlaying() {
  return isPlaying;
}

export function toggleMusic() {
  if (isPlaying) stopMusic();
  else startMusic();
}
