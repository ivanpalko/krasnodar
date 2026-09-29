// ============================================================
//  audio.js — конфиг звуков и Web Audio API
//  Если URL не задан — используются системные (генерируемые) звуки.
// ============================================================

const SOUND_CONFIG = {
  melody:    null,
  collision: null,
  krasnodar: null,
  veggies:   null
};

let audioCtx = null;

function getAudio() {
  if (!audioCtx) {
    try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); }
    catch (e) { return null; }
  }
  return audioCtx;
}

function playTone(freq, duration, type = 'sine', volume = 0.15, delay = 0) {
  const ctx = getAudio();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  const t = ctx.currentTime + delay;
  osc.frequency.setValueAtTime(freq, t);
  gain.gain.setValueAtTime(volume, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(t);
  osc.stop(t + duration);
}

function playUrl(url, fallback) {
  if (url) {
    try {
      const a = new Audio(url);
      a.volume = 0.7;
      a.play().catch(() => fallback());
      return;
    } catch (e) { /* ignore */ }
  }
  fallback();
}

// ---------- Системные звуки ----------

function sysCollision() {
  playTone(160, 0.22, 'sawtooth', 0.22);
  playTone(90,  0.32, 'square',   0.18, 0.06);
}

function sysKrasnodar() {
  playTone(660,  0.09, 'square', 0.16);
  playTone(880,  0.13, 'square', 0.16, 0.09);
  playTone(1320, 0.16, 'square', 0.14, 0.2);
}

function sysVeggies() {
  playTone(520, 0.11, 'triangle', 0.2);
  playTone(700, 0.11, 'triangle', 0.18, 0.08);
}

// ---------- Фоновая мелодия ----------

let melodyTimer = null;
let melodyPlaying = false;
let melodyAudio = null;

function sysMelody() {
  if (melodyTimer) return;
  const notes = [
    [523, 0.18], [659, 0.18], [784, 0.18], [659, 0.18],
    [523, 0.18], [587, 0.18], [659, 0.36],
    [587, 0.18], [523, 0.18], [440, 0.36],
    [523, 0.18], [587, 0.18], [659, 0.18], [523, 0.36]
  ];
  let i = 0;
  const play = () => {
    if (!melodyPlaying) return;
    const [f, d] = notes[i % notes.length];
    playTone(f, d, 'triangle', 0.05);
    i++;
    melodyTimer = setTimeout(play, d * 1000);
  };
  play();
}

function startMelody() {
  stopMelody();
  melodyPlaying = true;
  if (SOUND_CONFIG.melody) {
    melodyAudio = new Audio(SOUND_CONFIG.melody);
    melodyAudio.loop = true;
    melodyAudio.volume = 0.4;
    melodyAudio.play().catch(() => sysMelody());
  } else {
    sysMelody();
  }
}

function stopMelody() {
  melodyPlaying = false;
  if (melodyTimer) { clearTimeout(melodyTimer); melodyTimer = null; }
  if (melodyAudio) { melodyAudio.pause(); melodyAudio = null; }
}

function restartMelody() {
  const was = melodyPlaying;
  stopMelody();
  if (was) startMelody();
}

// ---------- Публичные sfx ----------

function sfxCollision() { playUrl(SOUND_CONFIG.collision, sysCollision); }
function sfxKrasnodar() { playUrl(SOUND_CONFIG.krasnodar, sysKrasnodar); }
function sfxVeggies()   { playUrl(SOUND_CONFIG.veggies,   sysVeggies); }

// ---------- Инициализация полей конфига ----------

function initSoundConfig() {
  const inputs = {
    melody:    document.getElementById('snd-melody'),
    collision: document.getElementById('snd-collision'),
    krasnodar: document.getElementById('snd-krasnodar'),
    veggies:   document.getElementById('snd-veggies')
  };
  for (const key in inputs) {
    inputs[key].addEventListener('input', e => {
      SOUND_CONFIG[key] = e.target.value.trim() || null;
      if (key === 'melody') restartMelody();
    });
  }
}