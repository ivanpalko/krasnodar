// ============================================================
//  game.js — основной цикл, физика, столкновения, HUD, ввод
// ============================================================

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const W = canvas.width;
const H = canvas.height;

const GROUND_Y = 390;
const GRAVITY  = 0.8;
const JUMP_V   = -15;
const BASE_SPEED = 4;
const START_LIVES = 8;
const FLY_SPEED = 3.5;

// ---------- Состояние ----------
let cameraX = 0;
let runTime = 0;
let gameOver = false;
let scoreKrasnodar = 0;
let scoreVeggies = 0;
let lives = START_LIVES;
let manatMessage = 0;

const hero = {
  x: 140,
  y: GROUND_Y - 48,
  w: 32,
  h: 48,
  vy: 0,
  onGround: true
};

// ---------- Фоновые декорации ----------
const clouds = [
  { x: 100, y: 60,  s: 40 },
  { x: 400, y: 100, s: 30 },
  { x: 700, y: 50,  s: 50 },
  { x: 1000, y: 90, s: 35 },
];

const houses = [
  { x: 0,    h: 100, w: 80, color: '#d2b48c' },
  { x: 350,  h: 90,  w: 70, color: '#e6c9a8' },
  { x: 700,  h: 110, w: 90, color: '#c9a97a' },
  { x: 1100, h: 95,  w: 75, color: '#d2b48c' },
  { x: 1500, h: 105, w: 85, color: '#e0b890' },
];

const bushes = [
  { x: 200, s: 30 },
  { x: 600, s: 40 },
  { x: 950, s: 25 },
];

// ---------- Динамика ----------
let groundObstacles = [];
let flyingItems = [];
let spawnGroundTimer = 0;
let spawnGroundInterval = 90;
let spawnFlyingTimer = 0;
let spawnFlyingInterval = 70;

// ---------- Ввод ----------
const keys = {};
addEventListener('keydown', e => {
  keys[e.code] = true;
  if (e.code === 'Space' || e.code === 'ArrowUp') {
    e.preventDefault();
    tryJump();
  }
});
addEventListener('keyup', e => keys[e.code] = false);

function tryJump() {
  if (gameOver) return;
  if (hero.onGround) {
    hero.vy = JUMP_V;
    hero.onGround = false;
  }
}

// ---------- Спавн ----------
function spawnGround() {
  const r = Math.random();
  let o;
  if (r < 0.30)      o = { x: W + 20, y: GROUND_Y - 55, w: 75, h: 55, type: 'tractor' };
  else if (r < 0.55) o = { x: W + 20, y: GROUND_Y - 38, w: 85, h: 38, type: 'car' };
  else if (r < 0.78) o = { x: W + 20, y: GROUND_Y - 48, w: 34, h: 48, type: 'auntie' };
  else               o = { x: W + 20, y: GROUND_Y - 48, w: 34, h: 48, type: 'uncle' };
  groundObstacles.push(o);
}

function spawnFlying() {
  const r = Math.random();
  let kind;
  if (r < 0.18)      kind = 'krasnodar';
  else if (r < 0.45) kind = 'turnip';
  else if (r < 0.72) kind = 'cabbage';
  else               kind = 'tomato';

  const y = 220 + Math.random() * 120;
  flyingItems.push({
    x: W + 20,
    y,
    w: 26,
    h: 30,
    kind,
    phase: Math.random() * Math.PI * 2
  });
}

// ---------- Столкновения ----------
function rectsOverlap(a, b) {
  return a.x < b.x + b.w &&
         a.x + a.w > b.x &&
         a.y < b.y + b.h &&
         a.y + a.h > b.y;
}

function heroBox() {
  return { x: hero.x + 4, y: hero.y + 8, w: hero.w - 8, h: hero.h - 8 };
}

function onHitObstacle(o) {
  if (o.hit) return;
  o.hit = true;
  lives--;
  manatMessage = 70;
  sfxCollision();
  updateHud();
  if (lives <= 0) {
    gameOver = true;
    document.getElementById('restart-btn').style.display = 'inline-block';
  }
}

// ---------- Логика ----------
function update() {
  if (gameOver) return;

  // физика героя
  hero.vy += GRAVITY;
  hero.y  += hero.vy;
  if (hero.y + hero.h >= GROUND_Y) {
    hero.y = GROUND_Y - hero.h;
    hero.vy = 0;
    hero.onGround = true;
  }

  // движение мира
  cameraX += BASE_SPEED;
  runTime += 1;

  // спавн
  spawnGroundTimer++;
  if (spawnGroundTimer >= spawnGroundInterval) {
    spawnGroundTimer = 0;
    spawnGroundInterval = 70 + Math.random() * 70;
    spawnGround();
  }
  spawnFlyingTimer++;
  if (spawnFlyingTimer >= spawnFlyingInterval) {
    spawnFlyingTimer = 0;
    spawnFlyingInterval = 50 + Math.random() * 60;
    spawnFlying();
  }

  // движение объектов
  for (const o of groundObstacles) o.x -= BASE_SPEED;
  groundObstacles = groundObstacles.filter(o => o.x + o.w > -60);

  for (const it of flyingItems) it.x -= FLY_SPEED;
  flyingItems = flyingItems.filter(it => it.x + it.w > -60);

  // столкновения с землёй
  const hb = heroBox();
  for (const o of groundObstacles) {
    if (o.hit) continue;
    if (rectsOverlap(hb, o)) onHitObstacle(o);
  }

  // сбор летящих
  for (let i = flyingItems.length - 1; i >= 0; i--) {
    const it = flyingItems[i];
    const y = it.y + Math.sin(runTime * 0.05 + it.phase) * 4;
    const box = { x: it.x - it.w / 2, y: y - it.h / 2, w: it.w, h: it.h };
    if (rectsOverlap(hb, box)) {
      if (it.kind === 'krasnodar') {
        scoreKrasnodar++;
        sfxKrasnodar();
      } else {
        scoreVeggies++;
        sfxVeggies();
      }
      updateHud();
      flyingItems.splice(i, 1);
    }
  }

  if (manatMessage > 0) manatMessage--;
}

// ---------- HUD ----------
function updateHud() {
  document.getElementById('score-k').textContent = scoreKrasnodar;
  document.getElementById('score-v').textContent = scoreVeggies;

  const livesEl = document.getElementById('score-l');
  livesEl.textContent = lives;
  livesEl.parentElement.classList.toggle('lives-low', lives <= 3);
}

// ---------- Сброс ----------
function reset() {
  gameOver = false;
  groundObstacles = [];
  flyingItems = [];
  spawnGroundTimer = 0;
  spawnFlyingTimer = 0;
  cameraX = 0;
  runTime = 0;
  scoreKrasnodar = 0;
  scoreVeggies = 0;
  lives = START_LIVES;
  manatMessage = 0;
  hero.y = GROUND_Y - hero.h;
  hero.vy = 0;
  hero.onGround = true;
  document.getElementById('restart-btn').style.display = 'none';
  updateHud();
}

// ---------- Отрисовка ----------
function draw() {
  // небо
  ctx.fillStyle = '#87CEEB';
  ctx.fillRect(0, 0, W, H);

  // облака (дальний план)
  clouds.forEach(c => {
    const x = ((c.x - cameraX * 0.3) % 1400 + 1400) % 1400 - 200;
    Sprites.cloud(ctx, x, c.y, c.s);
  });

  // земля
  ctx.fillStyle = '#8B4513';
  ctx.fillRect(0, GROUND_Y + 10, W, H - GROUND_Y);
  ctx.fillStyle = '#3cb371';
  ctx.fillRect(0, GROUND_Y, W, 15);

  // дома (средний план)
  houses.forEach(h => {
    const x = ((h.x - cameraX * 0.5) % 1800 + 1800) % 1800 - 200;
    Sprites.house(ctx, x, GROUND_Y - h.h, h.w, h.h, h.color);
  });

  // кусты (ближний план)
  bushes.forEach(b => {
    const x = ((b.x - cameraX * 0.8) % 1400 + 1400) % 1400 - 200;
    Sprites.bush(ctx, x, GROUND_Y - 5, b.s);
  });

  // препятствия
  for (const o of groundObstacles) {
    if (o.type === 'tractor')      Sprites.tractor(ctx, o);
    else if (o.type === 'car')     Sprites.car(ctx, o);
    else if (o.type === 'auntie')  Sprites.auntie(ctx, o, runTime);
    else if (o.type === 'uncle')   Sprites.uncle(ctx, o, runTime);
  }

  // летящие предметы
  for (const it of flyingItems) Sprites.flyingItem(ctx, it, runTime);

  // герой
  Sprites.hero(ctx, hero, runTime);

  // надпись "МАНАТЬ!"
  if (manatMessage > 0) {
    const alpha = Math.min(1, manatMessage / 20);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.textAlign = 'center';
    ctx.font = 'bold 96px Arial';
    ctx.lineWidth = 8;
    ctx.strokeStyle = '#fff';
    ctx.fillStyle = '#ff1744';
    ctx.strokeText('МАНАТЬ!', W / 2, 170);
    ctx.fillText('МАНАТЬ!', W / 2, 170);
    ctx.restore();
    ctx.textAlign = 'left';
  }

  // экран проигрыша
  if (gameOver) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.62)';
    ctx.fillRect(0, 0, W, H);
    ctx.textAlign = 'center';

    ctx.fillStyle = '#ffcc00';
    ctx.font = 'bold 52px Arial';
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#000';
    ctx.strokeText('Офигеть ты влетел, Вась!', W / 2, H / 2 - 20);
    ctx.fillText('Офигеть ты влетел, Вась!', W / 2, H / 2 - 20);

    ctx.fillStyle = 'white';
    ctx.font = '22px Arial';
    ctx.fillText(
      `Краснодара собрано: ${scoreKrasnodar} · Овощей: ${scoreVeggies}`,
      W / 2, H / 2 + 40
    );
    ctx.font = '18px Arial';
    ctx.fillStyle = '#aaa';
    ctx.fillText('Нажми «Начать заново» сверху', W / 2, H / 2 + 75);

    ctx.textAlign = 'left';
  }
}

// ---------- Цикл ----------
function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

// ---------- Инициализация ----------
initSoundConfig();

document.getElementById('restart-btn').addEventListener('click', reset);

// Автозапуск мелодии только после первого взаимодействия
// (браузеры блокируют autoplay без жеста пользователя)
let userStarted = false;
function userStart() {
  if (userStarted) return;
  userStarted = true;
  const c = getAudio();
  if (c && c.state === 'suspended') c.resume();
  startMelody();
}
document.addEventListener('click',   userStart);
document.addEventListener('keydown', userStart);

updateHud();
loop();