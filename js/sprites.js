// ============================================================
//  sprites.js — отрисовка всех игровых объектов (простая векторная графика)
//  Каждая функция принимает ctx и нужные параметры.
// ============================================================

const Sprites = {

  // ---------- Фон ----------

  cloud(ctx, x, y, s) {
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(x, y, s, 0, Math.PI * 2);
    ctx.arc(x + s * 0.8, y - s * 0.2, s * 0.8, 0, Math.PI * 2);
    ctx.arc(x + s * 1.5, y, s * 0.9, 0, Math.PI * 2);
    ctx.fill();
  },

  bush(ctx, x, y, s) {
    ctx.fillStyle = '#2e8b57';
    ctx.beginPath();
    ctx.arc(x, y, s, 0, Math.PI * 2);
    ctx.arc(x + s * 0.7, y - s * 0.2, s * 0.8, 0, Math.PI * 2);
    ctx.arc(x + s * 1.4, y, s * 0.9, 0, Math.PI * 2);
    ctx.fill();
  },

  house(ctx, x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);

    ctx.fillStyle = '#8B0000';
    ctx.beginPath();
    ctx.moveTo(x - 6, y);
    ctx.lineTo(x + w / 2, y - 30);
    ctx.lineTo(x + w + 6, y);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#FFE4B5';
    ctx.fillRect(x + w / 2 - 12, y + 25, 24, 24);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.strokeRect(x + w / 2 - 12, y + 25, 24, 24);

    ctx.fillStyle = '#5b3a1a';
    ctx.fillRect(x + w / 2 - 8, y + h - 35, 16, 35);
  },

  // ---------- Герой ----------

  hero(ctx, hero, runTime) {
    const bob = Math.sin(runTime * 0.02) * 2;
    const legSwing = Math.sin(runTime * 0.03) * 8;

    ctx.strokeStyle = '#333';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(hero.x + 10, hero.y + hero.h - 16 + bob);
    ctx.lineTo(hero.x + 10 + legSwing, hero.y + hero.h + bob);
    ctx.moveTo(hero.x + 22, hero.y + hero.h - 16 + bob);
    ctx.lineTo(hero.x + 22 - legSwing, hero.y + hero.h + bob);
    ctx.stroke();

    ctx.fillStyle = '#e52521';
    ctx.fillRect(hero.x, hero.y + 12 + bob, hero.w, hero.h - 28);

    ctx.fillStyle = '#ffcc99';
    ctx.beginPath();
    ctx.arc(hero.x + hero.w / 2, hero.y + 8 + bob, 14, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#e52521';
    ctx.beginPath();
    ctx.arc(hero.x + hero.w / 2, hero.y + 2 + bob, 14, Math.PI, 0);
    ctx.fill();
    ctx.fillRect(hero.x + hero.w / 2, hero.y + 2 + bob, 16, 4);
  },

  // ---------- Препятствия на земле ----------

  tractor(ctx, o) {
    const { x, y, w, h } = o;
    ctx.fillStyle = '#1f6b3f';
    ctx.fillRect(x + 15, y - 5, 30, 28);
    ctx.fillStyle = '#add8e6';
    ctx.fillRect(x + 20, y, 20, 16);
    ctx.fillStyle = '#2e8b57';
    ctx.fillRect(x + 10, y + 20, w - 15, h - 30);

    ctx.fillStyle = '#333';
    ctx.beginPath(); ctx.arc(x + 22, y + h - 12, 15, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#888';
    ctx.beginPath(); ctx.arc(x + 22, y + h - 12, 6, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = '#333';
    ctx.beginPath(); ctx.arc(x + w - 15, y + h - 8, 11, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#888';
    ctx.beginPath(); ctx.arc(x + w - 15, y + h - 8, 4, 0, Math.PI * 2); ctx.fill();
  },

  car(ctx, o) {
    const { x, y, w, h } = o;
    ctx.fillStyle = '#e52521';
    ctx.fillRect(x, y + 15, w, h - 15);
    ctx.fillStyle = '#b71c1c';
    ctx.fillRect(x + 20, y, w - 40, 20);
    ctx.fillStyle = '#add8e6';
    ctx.fillRect(x + 25, y + 5, w - 50, 12);
    ctx.fillStyle = '#ffe082';
    ctx.fillRect(x - 2, y + 22, 4, 8);

    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.arc(x + 18, y + h - 5, 10, 0, Math.PI * 2);
    ctx.arc(x + w - 18, y + h - 5, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#888';
    ctx.beginPath();
    ctx.arc(x + 18, y + h - 5, 4, 0, Math.PI * 2);
    ctx.arc(x + w - 18, y + h - 5, 4, 0, Math.PI * 2);
    ctx.fill();
  },

  auntie(ctx, o, runTime) {
    const { x, y, w, h } = o;
    const swing = Math.sin(runTime * 0.05) * 4;

    ctx.strokeStyle = '#333';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(x + 10, y + h - 15);
    ctx.lineTo(x + 10 + swing, y + h);
    ctx.moveTo(x + 20, y + h - 15);
    ctx.lineTo(x + 20 - swing, y + h);
    ctx.stroke();

    ctx.fillStyle = '#c71585';
    ctx.beginPath();
    ctx.moveTo(x + 4,  y + h - 8);
    ctx.lineTo(x + 26, y + h - 8);
    ctx.lineTo(x + 22, y + 12);
    ctx.lineTo(x + 8,  y + 12);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#ffcc99';
    ctx.beginPath(); ctx.arc(x + 15, y + 4, 10, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = '#ff4500';
    ctx.beginPath(); ctx.arc(x + 15, y + 2, 10, Math.PI, 0); ctx.fill();

    ctx.fillStyle = '#8B4513';
    ctx.fillRect(x + 24, y + 18, 10, 10);
  },

  uncle(ctx, o, runTime) {
    const { x, y, w, h } = o;
    const swing = Math.sin(runTime * 0.05 + 1) * 4;

    ctx.strokeStyle = '#333';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(x + 10, y + h - 15);
    ctx.lineTo(x + 10 + swing, y + h);
    ctx.moveTo(x + 20, y + h - 15);
    ctx.lineTo(x + 20 - swing, y + h);
    ctx.stroke();

    ctx.fillStyle = '#4169e1';
    ctx.fillRect(x + 6, y + 10, 18, h - 22);

    ctx.fillStyle = '#ffcc99';
    ctx.beginPath(); ctx.arc(x + 15, y + 4, 10, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = '#333';
    ctx.beginPath(); ctx.arc(x + 15, y + 2, 10, Math.PI, 0); ctx.fill();
    ctx.fillRect(x + 15, y + 2, 12, 3);

    ctx.fillStyle = '#eee';
    ctx.fillRect(x + 24, y + 16, 10, 12);
  },

  // ---------- Летящие предметы ----------

  turnip(ctx, x, y) {
    ctx.fillStyle = '#f5deb3';
    ctx.beginPath(); ctx.arc(x, y, 11, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#9acd32';
    ctx.beginPath();
    ctx.moveTo(x, y - 11);
    ctx.lineTo(x - 6, y - 22);
    ctx.lineTo(x + 6, y - 22);
    ctx.closePath();
    ctx.fill();
  },

  cabbage(ctx, x, y) {
    ctx.fillStyle = '#7cba3d';
    ctx.beginPath(); ctx.arc(x, y, 13, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#4a7c1e';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(x, y, 9, 0, Math.PI * 2);
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.stroke();
  },

  tomato(ctx, x, y) {
    ctx.fillStyle = '#e52521';
    ctx.beginPath(); ctx.arc(x, y, 12, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#2e8b57';
    ctx.beginPath();
    ctx.arc(x - 4, y - 11, 3, 0, Math.PI * 2);
    ctx.arc(x + 4, y - 11, 3, 0, Math.PI * 2);
    ctx.arc(x,     y - 13, 3, 0, Math.PI * 2);
    ctx.fill();
  },

  krasnodar(ctx, x, y) {
    ctx.fillStyle = '#a52a2a';
    ctx.fillRect(x - 11, y - 15, 22, 30);
    ctx.fillStyle = '#d4d4d4';
    ctx.fillRect(x - 11, y - 17, 22, 4);
    ctx.fillRect(x - 11, y + 13, 22, 4);

    ctx.fillStyle = '#fff';
    ctx.fillRect(x - 10, y - 7, 20, 16);
    ctx.fillStyle = '#c00';
    ctx.font = 'bold 8px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('КРД', x, y + 4);
    ctx.textAlign = 'left';
  },

  flyingItem(ctx, item, runTime) {
    const x = item.x;
    const y = item.y + Math.sin(runTime * 0.05 + item.phase) * 4;
    switch (item.kind) {
      case 'turnip':    Sprites.turnip(ctx, x, y);    break;
      case 'cabbage':   Sprites.cabbage(ctx, x, y);   break;
      case 'tomato':    Sprites.tomato(ctx, x, y);    break;
      case 'krasnodar': Sprites.krasnodar(ctx, x, y); break;
    }
  }
};