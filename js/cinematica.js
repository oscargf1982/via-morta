'use strict';
/* ==========================================================
   VÍA MORTA · cinemática de inicio «Dous longos e un curto»
   Ficha: docs/05_FICHAS_ESCENARIOS.md (C0). Guion: docs/06_CINEMATICA_INICIO_GUION.md.
   - Todo se debuxa por código nun lenzo propio de 960×540 (sen vídeo).
   - O andén de 1958 é unha ilustración de Oscar (img/cine-anden-1958.jpg)
     con movemento por riba (cámara, luces, fume, chuvia, reloxo ás 21:38).
     A rotonda pásase a noite cun mapa de luces; as rodas, a panca, a Mikado,
     a máquina de escribir e a pinga de graxa son debuxo por código.
   - Cada plano é unha función pura do tempo: CINE.frame(t) debuxa o
     fotograma do segundo t (sérvenos para probar con capturas).
   - Son sintetizado con WebAudio, coma o resto do xogo.
   Todo o que se conta aquí é ficción do xogo (a noite do 14-I-1958).
   ========================================================== */
const CINE = (() => {
  const W = 960, H = 540, OUT = '#060a14';
  const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  const lerp = (a, b, u) => a + (b - a) * u;
  const ss = (a, b, x) => { x = clamp((x - a) / (b - a)); return x * x * (3 - 2 * x); };
  const ease = u => (u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2);
  const R = i => { const s = Math.sin(i * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  const TAU = Math.PI * 2;
  const MONO = '"Courier New", Courier, "Cutive Mono", monospace';

  /* ---------- planos (segundos) ---------- */
  const T = { s1: 0, s2: 4.6, s3: 11.6, s4: 16.6, s5: 19.6, s6: 22.6, s7: 26.9, s8: 29.6, s9: 35.6, s10: 38.6, s11: 44.6, s12: 47.8, s13: 52.8, end: 61.2 };
  const WH = T.s6 + 0.6, WH2 = T.s12 + 0.5;            // comezo dos dous asubíos
  const WHP = [[0, 1.05], [1.27, 1.05], [2.54, 0.35]];  // dous longos e un curto

  let IM = {}, NIGHT = {}, FOG = null, ready = null;

  /* ---------- utilidades de debuxo ---------- */
  function poly(c, pts, fill, stroke, lw) {
    c.beginPath(); pts.forEach((p, i) => (i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]))); c.closePath();
    if (fill) { c.fillStyle = fill; c.fill(); }
    if (stroke) { c.strokeStyle = stroke; c.lineWidth = lw || 3; c.lineJoin = 'round'; c.stroke(); }
  }
  function rrect(c, x, y, w, h, r, fill, stroke, lw) {
    c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath();
    if (fill) { c.fillStyle = fill; c.fill(); }
    if (stroke) { c.strokeStyle = stroke; c.lineWidth = lw || 3; c.lineJoin = 'round'; c.stroke(); }
  }
  function disc(c, x, y, r, fill, stroke, lw) {
    c.beginPath(); c.arc(x, y, r, 0, TAU);
    if (fill) { c.fillStyle = fill; c.fill(); }
    if (stroke) { c.strokeStyle = stroke; c.lineWidth = lw || 3; c.stroke(); }
  }
  function line(c, x1, y1, x2, y2, col, lw) { c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.strokeStyle = col; c.lineWidth = lw; c.lineCap = 'round'; c.stroke(); }
  /* halo de luz aditivo */
  function glow(c, x, y, r, rgb, a, sy = 1) {
    if (a <= 0 || r <= 0) return;
    c.save(); c.globalCompositeOperation = 'lighter'; c.translate(x, y); c.scale(1, sy);
    const g = c.createRadialGradient(0, 0, 0, 0, 0, r);
    g.addColorStop(0, `rgba(${rgb},${a})`); g.addColorStop(0.35, `rgba(${rgb},${a * 0.42})`); g.addColorStop(1, `rgba(${rgb},0)`);
    c.fillStyle = g; c.fillRect(-r, -r, r * 2, r * 2); c.restore();
  }
  /* nube branda (vapor, néboa próxima) */
  function puff(c, x, y, r, rgb, a) {
    if (a <= 0 || r <= 0) return;
    const g = c.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, `rgba(${rgb},${a})`); g.addColorStop(0.55, `rgba(${rgb},${a * 0.55})`); g.addColorStop(1, `rgba(${rgb},0)`);
    c.fillStyle = g; c.fillRect(x - r, y - r, r * 2, r * 2);
  }
  function makeFog() {
    const f = document.createElement('canvas'); f.width = 1024; f.height = 256; const c = f.getContext('2d');
    for (let i = 0; i < 70; i++) {
      const x = R(i) * 1024, y = 60 + R(i + 40) * 150, r = 50 + R(i + 80) * 90, a = 0.05 + R(i + 120) * 0.07;
      for (const dx of [-1024, 0, 1024]) puff(c, x + dx, y, r, '205,215,240', a);
    }
    return f;
  }
  /* banda de néboa que se despraza (en coordenadas do lenzo) */
  function fogBand(c, t, y, h, speed, a, seed = 0) {
    if (a <= 0) return;
    const w = h * 4; let off = ((t * speed + seed * 331) % w + w) % w;
    c.save(); c.globalAlpha = a;
    for (let x = -off; x < W; x += w) c.drawImage(FOG, x, y, w + 1, h);
    c.restore();
  }
  function rain(c, t, a, n = 110, seed = 0) {
    if (a <= 0) return;
    c.save(); c.lineCap = 'round';
    for (let i = 0; i < n; i++) {
      const k = i + seed, sp = 1.5 + R(k + 900) * 1.1, ph = (R(k + 500) + t * sp) % 1;
      const x = ((R(k) * 1.25 * W - ph * 110) % (W * 1.25)), y = ph * (H + 60) - 30, l = 12 + R(k + 300) * 16;
      c.strokeStyle = `rgba(170,190,225,${a * (0.25 + R(k + 700) * 0.5)})`; c.lineWidth = 1 + R(k + 100);
      c.beginPath(); c.moveTo(x, y); c.lineTo(x - l * 0.2, y + l); c.stroke();
    }
    c.restore();
  }
  function vignette(c, a = 0.75) {
    const g = c.createRadialGradient(W / 2, H / 2, H * 0.35, W / 2, H / 2, H * 1.05);
    g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(0,0,0,${a})`); c.fillStyle = g; c.fillRect(0, 0, W, H);
  }
  /* cámara sobre unha imaxe: centra (cx, cy) con zoom z (z=1: a imaxe enche o ancho) */
  function cam(c, iw, cx, cy, z) { const s = W / iw * z; c.translate(W / 2 - cx * s, H / 2 - cy * s); c.scale(s, s); }
  /* texto a máquina: cada letra co seu ancho fixo e un chisco de tremor */
  function typed(c, txt, n, cx, y, size, col, seed = 0) {
    const cw = size * 0.6, x0 = cx - txt.length * cw / 2 + cw / 2;
    c.font = `700 ${size}px ${MONO}`; c.textAlign = 'center'; c.textBaseline = 'alphabetic';
    for (let i = 0; i < Math.min(n, txt.length); i++) {
      c.globalAlpha = 0.78 + R(i + seed) * 0.22; c.fillStyle = col;
      c.fillText(txt[i], x0 + i * cw, y + (R(i + seed + 50) - 0.5) * size * 0.07);
    }
    c.globalAlpha = 1;
  }

  /* ---------- imaxes do xogo pasadas a noite ---------- */
  function load(src) { return new Promise(r => { const i = new Image(); i.onload = () => r(i); i.onerror = () => r(null); i.src = res(src); }); }
  function bakeNight(im, ambient, lights, post) {
    const cv = document.createElement('canvas'); cv.width = im.naturalWidth; cv.height = im.naturalHeight; const c = cv.getContext('2d');
    c.drawImage(im, 0, 0);
    const lm = document.createElement('canvas'); lm.width = cv.width >> 1; lm.height = cv.height >> 1; const l = lm.getContext('2d');
    l.fillStyle = ambient; l.fillRect(0, 0, lm.width, lm.height); l.scale(0.5, 0.5); lights(l);
    c.globalCompositeOperation = 'multiply'; c.drawImage(lm, 0, 0, cv.width, cv.height); c.globalCompositeOperation = 'source-over';
    if (post) post(c);
    return cv;
  }
  function prepare() {
    if (ready) return ready;
    ready = (async () => {
      FOG = makeFog();
      const [a, r, v] = await Promise.all([load('img/cine-anden-1958.jpg'), load('img/portada-rotonda.jpg'), load('img/noite-vista.jpg')]);
      IM = { anden: a, rotonda: r, vista: v };
      if (r) NIGHT.rotonda = bakeNight(r, '#16204a', l => {
        glow(l, 830, 500, 620, '150,175,255', 0.62);             // lúa sobre a Mikado
        glow(l, 250, 330, 330, '255,186,105', 0.85); glow(l, 250, 420, 300, '255,186,105', 0.5, 0.4);
        glow(l, 1330, 300, 240, '255,186,105', 0.6);
      }, c => {
        const g = c.createLinearGradient(0, 0, 0, 200); g.addColorStop(0, 'rgba(4,7,16,.92)'); g.addColorStop(1, 'rgba(4,7,16,0)'); c.fillStyle = g; c.fillRect(0, 0, 1536, 200);
      });
    })();
    return ready;
  }

  /* ---------- o andén 1 en 1958: ilustración de Oscar (img/cine-anden-1958.jpg) con movemento por riba ---------- */
  const LAMPS = [[373, 116, 1], [795, 318, 0.55], [883, 388, 0.34], [925, 424, 0.2]];   // x, y, escala
  const LX = 1006, LY = 489;                                                              // fondo da vía, onde aparece a luz
  function anden1958(c, t, cx, cy, z, light) {
    c.save(); cam(c, 1672, cx, cy, z);
    if (IM.anden) c.drawImage(IM.anden, 0, 0); else { c.fillStyle = '#0a1024'; c.fillRect(0, 0, 1672, 941); }
    const fk = 0.85 + 0.15 * Math.sin(t * 31) * Math.sin(t * 13);
    if (light > 0) glow(c, LX, LY, 26 + 260 * light, '255,226,160', 0.5 * light * fk + 0.1);
    // o reloxo da estación marca as 21:38 (tápanse as agullas pintadas) e o segundeiro anda
    c.save(); c.translate(455, 356);
    c.beginPath(); c.ellipse(0, 0, 13.5, 17, 0, 0, TAU); c.fillStyle = '#cdbf9f'; c.fill();
    const hand = (v, len, col, lw) => { const a = v * TAU - Math.PI / 2; line(c, 0, 0, Math.cos(a) * len * 0.82, Math.sin(a) * len, col, lw); };
    hand((9 + 38 / 60) / 12, 11, '#1d1a16', 2.6); hand(38 / 60, 17, '#1d1a16', 1.8); hand(Math.floor(t) % 60 / 60, 17, '#8e2a20', 0.8); disc(c, 0, 0, 1.8, '#1d1a16');
    c.restore();
    // lámpadas que tremen, ventás e pilotos de cola
    for (const [x, y, k] of LAMPS) { const fl = 0.55 + 0.45 * Math.sin(t * 9 + x) * Math.sin(t * 2.3 + x * 0.1); glow(c, x, y, 210 * k, '255,196,110', 0.2 * fl + 0.08); glow(c, x, y, 46 * k, '255,244,210', 0.35 * fl); }
    glow(c, 1137, 440, 150, '255,180,90', 0.1 + 0.05 * Math.sin(t * 3.1)); glow(c, 1420, 430, 120, '255,180,90', 0.1 + 0.05 * Math.sin(t * 4.3 + 1));
    const p = 0.6 + 0.4 * Math.sin(t * 2.2);
    for (const x of [1314, 1541]) { glow(c, x, 558, 78, '255,50,40', 0.5 * p); glow(c, x, 558, 15, '255,210,190', 0.55 * p); }
    // reflexos que latexan no chan mollado
    for (let i = 0; i < 14; i++) { const x = 60 + R(i) * 1150, y = 640 + R(i + 20) * 280, a = 0.05 + 0.05 * Math.sin(t * (1.5 + R(i + 5) * 2) + i * 2.4); glow(c, x, y, 26 + R(i + 9) * 30, '255,200,120', a, 2.6); }
    // fume da cheminea e vapor baixo o vagón
    for (let i = 0; i < 14; i++) { const ph = (t * 0.1 + i / 14) % 1; puff(c, 1186 + ph * 60 + Math.sin(ph * 9 + i) * 16 + ph * ph * 120, 352 - ph * 330, 14 + ph * 90, '176,178,204', 0.34 * Math.sin(ph * Math.PI) * (1 - ph * 0.5)); }
    for (let i = 0; i < 10; i++) { const ph = (t * 0.2 + R(i + 5)) % 1, bx = 1290 + R(i) * 250, by = 712; puff(c, bx + ph * 60, by - ph * 90 * (0.6 + R(i + 9)), 24 + ph * 80, '205,212,235', 0.16 * Math.sin(ph * Math.PI)); }
    // chuvia só fóra da marquesiña
    c.save(); c.beginPath(); for (const [x, y] of [[1178, 0], [1672, 0], [1672, 941], [1440, 941], [1032, 522], [1004, 440]]) c.lineTo(x, y); c.closePath(); c.clip();
    c.lineCap = 'round';
    for (let i = 0; i < 150; i++) { const sp = 1.3 + R(i + 900), ph = (R(i + 500) + t * sp) % 1, x = 980 + R(i) * 760 - ph * 70, y = ph * 1000 - 30, l = 16 + R(i + 300) * 22; c.strokeStyle = `rgba(175,195,235,${0.14 + R(i + 700) * 0.3})`; c.lineWidth = 1.2 + R(i + 100) * 1.2; c.beginPath(); c.moveTo(x, y); c.lineTo(x - l * 0.2, y + l); c.stroke(); }
    c.restore();
    // a luz que vén polo fondo da vía
    if (light > 0) {
      glow(c, LX, LY, 8 + 62 * light, '255,250,235', (0.55 + 0.45 * light) * fk);
      c.save(); c.globalCompositeOperation = 'lighter'; c.fillStyle = `rgba(255,236,190,${0.5 * light * fk})`; c.beginPath(); c.ellipse(LX, LY, 30 + 210 * light, 1.2 + 3 * light, 0, 0, TAU); c.fill();
      c.restore();
    }
    c.restore();
  }

  /* ================= PLANOS ================= */
  /* 1 · negro, chuvia e a data a máquina */
  const L1 = 'Monforte de Lemos', L2 = '14 de xaneiro de 1958 · 21:38';
  function s1(c, u, t) {
    c.fillStyle = '#04060c'; c.fillRect(0, 0, W, H);
    glow(c, W / 2, 250, 420, '40,60,120', 0.35 * ss(0, 2, u));
    rain(c, t, 0.75 * ss(0, 1.4, u), 130);
    const n1 = Math.floor(clamp((u - 0.7) / 0.075, 0, L1.length)), n2 = Math.floor(clamp((u - 2.15) / 0.062, 0, L2.length));
    typed(c, L1, n1, W / 2, 252, 46, '#f2ead8', 3); typed(c, L2, n2, W / 2, 312, 34, '#f2a33a', 40);
    if (u > 0.7 && u < 4.2 && Math.floor(u * 2.6) % 2 === 0) { const two = n1 >= L1.length && u > 2.1, n = two ? n2 : n1, L = two ? L2 : L1, sz = two ? 34 : 46; c.fillStyle = two ? '#f2a33a' : '#f2ead8'; c.fillRect(W / 2 - L.length * sz * 0.3 + n * sz * 0.6 + 2, (two ? 312 : 252) - sz * 0.72, sz * 0.5, sz * 0.82); }
    c.globalAlpha = 0.5 * ss(2.6, 3.4, u); c.fillStyle = '#b9c2d6'; c.font = 'italic 17px Georgia, serif'; c.textAlign = 'center'; c.fillText('Unha ficción inspirada en lugares reais de Monforte', W / 2, 498); c.globalAlpha = 1;
  }
  /* 2 · o andén 1 en 1958: paneo lento sobre a ilustración */
  function s2(c, u, t) {
    const k = ease(clamp(u / 7.2));
    anden1958(c, t, lerp(585, 1060, k), lerp(455, 505, k), lerp(1.42, 1.36, k), 0);
    fogBand(c, t, 230, 210, 14, 0.3, 1); fogBand(c, t, 390, 230, -24, 0.26, 2);
    vignette(c, 0.7);
  }
  /* 3 · a luz que medra ao fondo da vía */
  function s3(c, u, t) {
    const k = ease(clamp(u / 5)), li = Math.pow(clamp(u / 5), 1.7);
    c.save(); const sh = li * 2.2; c.translate(Math.sin(t * 43) * sh, Math.sin(t * 57 + 1) * sh);
    anden1958(c, t, lerp(1060, 1030, k), lerp(505, 492, k), lerp(1.36, 2.3, k), li);
    c.restore();
    fogBand(c, t, 230, 240, 14, 0.3, 1); fogBand(c, t, 390, 230, -24, 0.26, 2);
    vignette(c, 0.7 + 0.2 * k);
  }
  /* 4 · as rodas do mercadorías, sen freos */
  function wheel(c, x, y, r, a) {
    disc(c, x, y, r + 9, '#141925', OUT, 5);                       // pestana
    disc(c, x, y, r, '#2b3345', OUT, 5); disc(c, x, y, r - 16, '#0c1019', OUT, 4);
    c.save(); c.translate(x, y);
    for (let g = 0; g < 3; g++) { c.save(); c.rotate(a - g * 0.16); c.globalAlpha = [0.9, 0.4, 0.2][g]; for (let i = 0; i < 8; i++) { c.rotate(TAU / 8); c.fillStyle = '#273044'; c.fillRect(-7, 20, 14, r - 38); } c.restore(); }
    c.globalAlpha = 1; c.restore();
    disc(c, x, y, 30, '#39435a', OUT, 5); disc(c, x, y, 11, '#161b28', OUT, 3);
    c.beginPath(); c.arc(x, y, r - 7, Math.PI * 1.08, Math.PI * 1.62); c.strokeStyle = '#7f95c4'; c.lineWidth = 5; c.lineCap = 'round'; c.stroke();
  }
  function sparks(c, t, ox, oy, n, seed, dirx = 1, pow = 1) {
    c.save(); c.globalCompositeOperation = 'lighter'; c.lineCap = 'round';
    for (let i = 0; i < n; i++) {
      const k = i + seed, life = 0.28 + R(k) * 0.4, age = ((t + R(k + 7) * 3) % life), q = age / life;
      const vx = dirx * (380 + R(k + 1) * 620) * pow, vy = -(60 + R(k + 2) * 330) * pow + (R(k + 5) > 0.7 ? 260 : 0), g = 900;
      const x = ox + vx * age, y = Math.min(oy + vy * age + g * age * age / 2, 500 - R(k + 3) * 6), dx = vx * 0.022, dy = (vy + g * age) * 0.022;
      c.strokeStyle = q < 0.25 ? `rgba(255,250,215,${1 - q})` : q < 0.6 ? `rgba(255,196,70,${1 - q})` : `rgba(255,96,30,${(1 - q) * 0.9})`;
      c.lineWidth = 3.2 * (1 - q) + 0.8; c.beginPath(); c.moveTo(x, y); c.lineTo(x - dx, y - dy); c.stroke();
    }
    c.restore();
  }
  function s4(c, u, t) {
    const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#060912'); g.addColorStop(1, '#131d3a'); c.fillStyle = g; c.fillRect(0, 0, W, H);
    c.save(); c.translate(W / 2, H / 2); c.rotate(Math.sin(t * 23) * 0.006); c.scale(1.06 + 0.03 * ss(0, 3, u), 1.06 + 0.03 * ss(0, 3, u)); c.translate(-W / 2 + Math.sin(t * 47) * 6, -H / 2 + Math.sin(t * 61 + 1) * 5);
    // fondo: liñas de velocidade na néboa
    for (let i = 0; i < 26; i++) { const y = 250 + R(i) * 200, x = ((R(i + 30) * 1400 + t * (900 + R(i + 60) * 900)) % 1400) - 220, l = 120 + R(i + 90) * 260; line(c, x, y, x + l, y, `rgba(120,140,190,${0.05 + R(i + 9) * 0.1})`, 2 + R(i + 4) * 5); }
    // caixa do vagón: táboas, ferraxes e longueiro
    c.fillStyle = '#34191a'; c.fillRect(-40, -40, W + 80, 262);
    for (let x = -30; x < W + 40; x += 48) line(c, x, -40, x, 222, '#1f0e10', 3);
    for (const x of [86, 480, 874]) { c.fillStyle = '#171b25'; c.fillRect(x - 11, -40, 22, 262); for (let y = 10; y < 220; y += 42) disc(c, x, y, 3.5, '#39435a'); }
    c.fillStyle = 'rgba(255,255,255,.07)'; c.font = '700 44px Georgia, serif'; c.textAlign = 'left'; c.textBaseline = 'alphabetic'; c.fillText('Mf  20 t', 150, 150);
    line(c, -40, 222, W + 40, 222, OUT, 6);
    c.fillStyle = '#12151d'; c.fillRect(-40, 222, W + 80, 40); line(c, -40, 262, W + 40, 262, OUT, 5); line(c, -40, 228, W + 40, 228, '#3a4664', 2);
    for (let x = 20; x < W; x += 60) disc(c, x, 244, 3.5, '#39435a');
    // carril e travesas que pasan
    for (let i = 0; i < 9; i++) { const x = ((i * 150 + t * 1500) % 1350) - 200; c.fillStyle = 'rgba(46,36,30,.85)'; c.fillRect(x, 500, 90, 26); c.fillStyle = 'rgba(46,36,30,.35)'; c.fillRect(x - 70, 500, 70, 26); }
    for (let i = 0; i < 40; i++) { const x = ((R(i) * 1300 + t * 1500) % 1300) - 170, y = 520 + R(i + 20) * 30; line(c, x, y, x + 46, y, `rgba(96,104,126,${0.25 + R(i + 3) * 0.3})`, 3); }
    // suspensión: gardas, caixas de graxa e ballestas
    for (const wx of [262, 700]) {
      poly(c, [[wx - 74, 262], [wx - 20, 262], [wx - 30, 372], [wx - 46, 372]], '#1a2030', OUT, 4); poly(c, [[wx + 20, 262], [wx + 74, 262], [wx + 46, 372], [wx + 30, 372]], '#1a2030', OUT, 4);
      wheel(c, wx, 372, 110, -t * 27);
      for (let i = 0; i < 5; i++) { c.beginPath(); c.moveTo(wx - 150 + i * 14, 300 + i * 7); c.quadraticCurveTo(wx, 322 + i * 7, wx + 150 - i * 14, 300 + i * 7); c.strokeStyle = OUT; c.lineWidth = 9; c.stroke(); c.strokeStyle = '#3a4560'; c.lineWidth = 4.5; c.stroke(); }
      rrect(c, wx - 34, 334, 68, 62, 8, '#262e42', OUT, 5); rrect(c, wx - 22, 346, 44, 22, 4, '#39435a', OUT, 3);
      // zapata do freo, ao roxo
      const hot = 0.75 + 0.25 * Math.sin(t * 38 + wx);
      c.save(); c.translate(wx, 372); c.rotate(-0.18);
      c.beginPath(); c.arc(0, 0, 124, -0.26, 0.26); c.arc(0, 0, 150, 0.22, -0.22, true); c.closePath(); c.fillStyle = '#ff7a2a'; c.fill(); c.strokeStyle = OUT; c.lineWidth = 5; c.stroke();
      c.beginPath(); c.arc(0, 0, 127, -0.2, 0.2); c.strokeStyle = '#fff0b0'; c.lineWidth = 5; c.stroke(); c.restore();
      line(c, wx + 150, 350, wx + 196, 262, OUT, 12); line(c, wx + 150, 350, wx + 196, 262, '#262e42', 6);
      glow(c, wx + 130, 360, 150, '255,120,40', 0.5 * hot); glow(c, wx + 6, 484, 120, '255,170,70', 0.5 * hot);
    }
    c.fillStyle = '#39445e'; c.fillRect(-40, 482, W + 80, 18); line(c, -40, 482, W + 40, 482, OUT, 4); line(c, -40, 500, W + 40, 500, OUT, 4); line(c, -40, 487, W + 40, 487, '#a9bbe4', 3);
    for (const wx of [262, 700]) { sparks(c, t, wx + 122, 352, 60, wx, 1, 0.9); sparks(c, t, wx + 8, 480, 80, wx + 500, 1, 1.1); glow(c, wx + 8, 480, 34, '255,245,210', 0.9); }
    c.restore();
    fogBand(c, t, 330, 260, 900, 0.22, 4);
    vignette(c, 0.85);
  }
  /* 5 · a man enluvada e a panca da agulla */
  function s5(c, u, t) {
    const swing = ss(1.2, 1.52, u), hit = u - 1.52, bounce = hit > 0 ? Math.exp(-hit * 7) * Math.sin(hit * 34) * 0.07 : 0;
    const strain = u > 0.45 && u < 1.2 ? Math.sin(t * 60) * 0.012 * ss(0.45, 1.1, u) : 0;
    const ang = lerp(0.62, -0.62, swing * swing) + bounce + strain;         // ángulo desde a vertical
    const jolt = hit > 0 ? Math.exp(-hit * 9) : 0;
    let g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#05080f'); g.addColorStop(0.7, '#101a34'); g.addColorStop(1, '#0a1022'); c.fillStyle = g; c.fillRect(0, 0, W, H);
    c.save(); c.translate(W / 2, H / 2); c.scale(1.02 + 0.05 * ss(0, 3, u), 1.02 + 0.05 * ss(0, 3, u)); c.translate(-W / 2 + Math.sin(t * 90) * 7 * jolt, -H / 2 + 9 * jolt);
    // luz do tren que se achega pola esquerda
    const inc = ss(1.4, 3, u); glow(c, -60, 300, 520, '255,222,160', 0.14 + 0.35 * inc);
    fogBand(c, t, 180, 260, 30, 0.45, 5);
    // chan: balastro, travesas e carrís en fuga
    c.fillStyle = '#0c1120'; c.fillRect(-40, 418, W + 80, 160);
    for (let i = 0; i < 60; i++) disc(c, R(i) * 1040 - 40, 430 + R(i + 9) * 110, 5 + R(i + 5) * 9, R(i + 2) > 0.5 ? '#161d33' : '#101628');
    for (let i = 0; i < 7; i++) poly(c, [[i * 150 - 60, 440], [i * 150 + 20, 440], [i * 150 + 4, 470], [i * 150 - 82, 470]], '#221a16', OUT, 3);
    const bl = 14 * swing * swing + bounce * 30;                                // a agulla que se despraza
    for (const [y, lw] of [[436, 8], [464, 10]]) { line(c, -40, y, W + 40, y, OUT, lw + 5); line(c, -40, y, W + 40, y, '#4b5878', lw); line(c, -40, y - lw / 2 + 1.5, W + 40, y - lw / 2 + 1.5, '#b7c6ea', 2); }
    poly(c, [[560, 441 + bl], [1010, 449 + bl * 0.4], [1010, 456 + bl * 0.4], [560, 446 + bl]], '#5a6990', OUT, 3);
    line(c, 470, 452, 640 + bl, 452 + bl * 0.5, OUT, 10); line(c, 470, 452, 640 + bl, 452 + bl * 0.5, '#39445e', 5);
    // farol de man no chan
    const fx = 742, fy = 430, fl = 0.86 + 0.14 * Math.sin(t * 11) * Math.sin(t * 3.7);
    glow(c, fx, fy - 40, 330, '255,176,80', 0.5 * fl); glow(c, fx, fy + 4, 250, '255,176,80', 0.35 * fl, 0.25);
    rrect(c, fx - 26, fy - 12, 52, 14, 3, '#1b2030', OUT, 4); rrect(c, fx - 20, fy - 66, 40, 56, 5, '#ffd27a', OUT, 4); disc(c, fx, fy - 38, 10, '#fff6d8');
    line(c, fx - 20, fy - 38, fx + 20, fy - 38, OUT, 3); line(c, fx, fy - 66, fx, fy - 12, OUT, 3);
    poly(c, [[fx - 24, fy - 66], [fx + 24, fy - 66], [fx + 12, fy - 86], [fx - 12, fy - 86]], '#1b2030', OUT, 4);
    c.beginPath(); c.arc(fx, fy - 88, 22, Math.PI * 1.05, Math.PI * 1.95); c.strokeStyle = OUT; c.lineWidth = 5; c.stroke();
    glow(c, fx, fy - 38, 60, '255,240,200', 0.8 * fl);
    // pé da panca
    const px = 430, py = 428;
    poly(c, [[px - 86, 452], [px + 86, 452], [px + 52, 396], [px - 52, 396]], '#232b3f', OUT, 5); rrect(c, px - 108, 448, 216, 24, 4, '#1a2031', OUT, 5);
    line(c, px - 40, 404, px + 44, 404, '#55668f', 3);
    for (const x of [-84, 84]) disc(c, px + x, 460, 6, '#55668f', OUT, 2.5);
    // panca, contrapeso e empuñadura
    c.save(); c.translate(px, py); c.rotate(ang);
    line(c, 0, 0, 96, -44, OUT, 22); line(c, 0, 0, 96, -44, '#2c3550', 13);
    c.save(); c.translate(108, -50); disc(c, 0, 0, 50, '#e8e2cf', OUT, 5); c.beginPath(); c.moveTo(0, 0); c.arc(0, 0, 50, -Math.PI / 2 - ang, Math.PI / 2 - ang); c.closePath(); c.fillStyle = '#b3261d'; c.fill(); disc(c, 0, 0, 50, null, OUT, 5); disc(c, 0, 0, 9, '#2c3550', OUT, 3); c.restore();
    rrect(c, -10, -318, 20, 324, 8, '#33405e', OUT, 5); line(c, -3.5, -306, -3.5, -10, '#8ea2d0', 3);
    rrect(c, -13, -372, 26, 68, 11, '#17110c', OUT, 5); line(c, -5, -362, -5, -314, '#5a4634', 3);
    c.restore();
    disc(c, px, py, 20, '#3a4664', OUT, 5); disc(c, px, py, 7, '#151a28');
    // man e manga (veñen de arriba á dereita)
    const hx = px + Math.sin(ang) * 338, hy = py - Math.cos(ang) * 338, arr = 1 - ss(0, 0.45, u);
    c.save(); c.translate(hx + arr * 260, hy - arr * 190); c.rotate(-0.5 + ang * 0.25);
    poly(c, [[70, -62], [520, -150], [520, 150], [84, 60]], '#16223f', OUT, 6);                                 // manga
    c.strokeStyle = '#0c1428'; c.lineWidth = 5; c.beginPath(); c.moveTo(150, -66); c.quadraticCurveTo(170, 0, 150, 62); c.moveTo(250, -90); c.quadraticCurveTo(280, -10, 262, 86); c.stroke();
    line(c, 96, -62, 500, -140, '#31467a', 4);
    poly(c, [[48, -50], [96, -70], [104, 68], [52, 46]], '#7a4f24', OUT, 6); line(c, 62, -48, 90, -60, '#c08a4a', 4);       // puño da luva
    rrect(c, -22, -44, 84, 86, 22, '#99672f', OUT, 6);                                                                   // dorso
    c.strokeStyle = '#6e4720'; c.lineWidth = 3.5; c.beginPath(); c.moveTo(16, -30); c.lineTo(46, -26); c.moveTo(16, -8); c.lineTo(46, -5); c.moveTo(16, 14); c.lineTo(46, 16); c.stroke();
    for (let i = 0; i < 4; i++) rrect(c, -46, -46 + i * 22.5, 50, 22, 10, i % 2 ? '#a06c32' : '#aa7436', OUT, 5);       // dedos sobre a empuñadura
    for (let i = 0; i < 4; i++) line(c, -36, -40 + i * 22.5, -12, -40 + i * 22.5, '#d09a56', 3);
    rrect(c, -30, 38, 62, 26, 13, '#99672f', OUT, 5);                                                                    // polgar
    c.restore();
    // golpe: raios curtos arredor do pé
    if (hit > 0 && hit < 0.3) { const q = hit / 0.3; c.save(); c.globalAlpha = 1 - q; for (let i = 0; i < 11; i++) { const a = Math.PI + i / 10 * Math.PI, r1 = 104 + q * 50, r2 = r1 + 30 + R(i) * 44; line(c, px + Math.cos(a) * r1, 440 + Math.sin(a) * r1 * 0.75, px + Math.cos(a) * r2, 440 + Math.sin(a) * r2 * 0.75, '#fff3c8', 5); } c.restore(); }
    c.restore();
    rain(c, t, 0.7, 120, 7);
    fogBand(c, t, 360, 220, -40, 0.3, 6);
    vignette(c, 0.8);
  }
  /* 6 · o faro da Mikado */
  function mikado(c) {
    const B = '#0b0e16', B2 = '#141927', RIM = '#4f6aa8';
    // vía
    poly(c, [[384, 430], [576, 430], [760, 560], [200, 560]], '#0c1020');
    for (let i = 0; i < 6; i++) { const y = 440 + i * i * 4.2 + i * 6, w = 120 + (y - 430) * 2.1; poly(c, [[480 - w, y], [480 + w, y], [480 + w + 8, y + 9 + i * 2], [480 - w - 8, y + 9 + i * 2]], '#1c1612'); }
    line(c, 420, 428, 268, 560, OUT, 12); line(c, 540, 428, 692, 560, OUT, 12); line(c, 420, 428, 268, 560, '#7386b5', 5); line(c, 540, 428, 692, 560, '#7386b5', 5);
    // cheminea, domo e cabina por detrás
    rrect(c, 392, 150, 176, 60, 10, B, OUT, 5);
    poly(c, [[452, 64], [508, 64], [502, 126], [458, 126]], B2, OUT, 5); rrect(c, 444, 52, 72, 18, 6, B2, OUT, 5); line(c, 452, 62, 508, 62, RIM, 2.5);
    // cilindros e pasarela
    for (const s of [-1, 1]) { rrect(c, 480 + s * 196 - 34, 318, 68, 78, 10, B2, OUT, 5); disc(c, 480 + s * 196, 357, 22, B, OUT, 4); line(c, 480 + s * 170, 322, 480 + s * 222, 322, RIM, 2.5); }
    // caldeira e caixa de fumes
    disc(c, 480, 262, 128, B2, OUT, 6); disc(c, 480, 262, 110, B, OUT, 5); disc(c, 480, 262, 110, null, '#232c44', 2);
    c.beginPath(); c.arc(480, 262, 124, Math.PI * 1.12, Math.PI * 1.45); c.strokeStyle = RIM; c.lineWidth = 3.5; c.lineCap = 'round'; c.stroke();
    for (const y of [222, 302]) { line(c, 374, y, 462, y, OUT, 9); line(c, 374, y, 462, y, '#262f48', 4); }
    disc(c, 480, 262, 17, B2, OUT, 4); line(c, 480, 262, 520, 238, OUT, 8); line(c, 480, 262, 520, 238, '#3a4664', 3.5); line(c, 480, 262, 456, 300, OUT, 8); line(c, 480, 262, 456, 300, '#3a4664', 3.5);
    for (let i = 0; i < 16; i++) { const a = i / 16 * TAU; disc(c, 480 + Math.cos(a) * 119, 262 + Math.sin(a) * 119, 2.6, '#2c3653'); }
    rrect(c, 452, 326, 56, 20, 3, '#5b1418', OUT, 3);
    // pantallas levantafumes
    for (const s of [-1, 1]) { poly(c, [[480 + s * 150, 96], [480 + s * 186, 108], [480 + s * 186, 372], [480 + s * 150, 372]], B2, OUT, 5); line(c, 480 + s * 152, 104, 480 + s * 152, 366, RIM, 2.5); for (const y of [150, 240, 330]) disc(c, 480 + s * 168, y, 3, '#2c3653'); }
    // traveseiro, topes e gancho
    rrect(c, 272, 372, 416, 52, 5, '#6d1318', OUT, 6); line(c, 278, 378, 682, 378, '#b3303a', 3);
    for (const s of [-1, 1]) { rrect(c, 480 + s * 150 - 15, 384, 30, 34, 3, B2, OUT, 4); disc(c, 480 + s * 150, 400, 31, '#20273a', OUT, 5); disc(c, 480 + s * 150, 400, 20, '#141927'); c.beginPath(); c.arc(480 + s * 150, 400, 27, Math.PI * 1.1, Math.PI * 1.6); c.strokeStyle = RIM; c.lineWidth = 3; c.stroke(); }
    poly(c, [[468, 398], [492, 398], [488, 440], [472, 440]], B2, OUT, 4);
    for (const s of [-1, 1]) { rrect(c, 480 + s * 84 - 11, 350, 22, 24, 4, B2, OUT, 4); }
    // faro
    rrect(c, 446, 118, 68, 34, 6, B2, OUT, 5); disc(c, 480, 128, 34, B2, OUT, 6);
  }
  function s6(c, u, t) {
    const on = u < 0.5 ? 0 : u < 0.62 ? 0.7 : u < 0.72 ? 0.12 : u < 0.8 ? 0.85 : u < 0.86 ? 0.3 : 1, grow = ss(0.5, 4.2, u), li = on * (0.35 + 0.65 * grow);
    const z = 1 + 0.26 * Math.pow(clamp(u / 4.3), 1.4);
    let g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#080d1c'); g.addColorStop(0.75, '#1a2748'); g.addColorStop(1, '#0c1226'); c.fillStyle = g; c.fillRect(0, 0, W, H);
    c.save(); c.translate(480, 200); c.scale(z, z); c.translate(-480 + Math.sin(t * 51) * 2.5 * grow, -200 + Math.sin(t * 67) * 2 * grow);
    fogBand(c, t, 60, 320, 12, 0.6, 7);
    glow(c, 480, 128, 380 + 300 * grow, '255,228,170', 0.3 * li);
    // vapor nos cilindros
    for (let i = 0; i < 12; i++) { const s = i % 2 ? 1 : -1, ph = (t * 0.35 + R(i)) % 1; puff(c, 480 + s * (230 + ph * 170), 372 - ph * 70 * R(i + 3), 30 + ph * 80, '200,212,240', 0.24 * Math.sin(ph * Math.PI)); }
    mikado(c);
    // o asubío: chorro de vapor branco
    for (const [w0, wd] of WHP) {
      const wu = (T.s6 + u) - (WH + w0);
      for (let i = 0; i < 16; i++) { const b = i / 16 * wd, age = wu - b; if (age < 0 || age > 1.3) continue; const q = age / 1.3; puff(c, 560 + q * 150 + R(i) * 18, 150 - q * 190 - R(i + 4) * 30, 12 + q * 64, '236,242,255', 0.6 * (1 - q)); }
      if (wu > 0 && wu < wd) { line(c, 556, 152, 574, 110, 'rgba(240,246,255,.9)', 5); }
    }
    rrect(c, 548, 150, 14, 26, 4, '#b08a3a', OUT, 3);
    // luz do faro
    if (li > 0) {
      c.save(); c.globalCompositeOperation = 'lighter'; c.translate(480, 128);
      for (let i = 0; i < 14; i++) { const a = i / 14 * TAU + t * 0.12, w = 0.05 + R(i) * 0.07, r = 300 + 500 * grow; const rg = c.createRadialGradient(0, 0, 20, 0, 0, r); rg.addColorStop(0, `rgba(255,236,190,${0.2 * li})`); rg.addColorStop(1, 'rgba(255,236,190,0)'); c.fillStyle = rg; c.beginPath(); c.moveTo(0, 0); c.arc(0, 0, r, a - w, a + w); c.closePath(); c.fill(); }
      c.restore();
      disc(c, 480, 128, 26, `rgba(255,246,214,${on})`);
      glow(c, 480, 128, 110 + 420 * grow, '255,232,180', 0.85 * li); glow(c, 480, 128, 40 + 160 * grow, '255,255,245', li);
      c.save(); c.globalCompositeOperation = 'lighter'; c.fillStyle = `rgba(255,240,200,${0.55 * li})`; c.beginPath(); c.ellipse(480, 128, 260 + 520 * grow, 4 + 10 * grow, 0, 0, TAU); c.fill(); c.restore();
    }
    fogBand(c, t, 300, 240, -30, 0.35 + 0.25 * grow, 8);
    c.restore();
    rain(c, t, 0.6, 100, 9);
    vignette(c, 0.8 * (1 - grow));
    const wo = ss(3.15, 4.25, u); if (wo > 0) { c.fillStyle = `rgba(255,250,236,${wo})`; c.fillRect(0, 0, W, H); }
  }
  /* 7 · negro: só chuvia */
  function s7(c, u, t) {
    c.fillStyle = '#020306'; c.fillRect(0, 0, W, H);
    const th = u - 0.75, j = th > 0 ? Math.exp(-th * 5) * Math.sin(th * 40) * 5 : 0;
    c.save(); c.translate(0, j); rain(c, t, 0.4 * ss(0.5, 1.6, u), 110, 11); c.restore();
  }
  /* 8 · o parte, a máquina de escribir */
  const P1 = 'Causa do incidente:', P2 = 'erro do maquinista.';
  const KEYS = (() => { const k = []; let t = 0.55; for (let i = 0; i < P1.length; i++) { k.push(t); t += 0.06 + R(i + 11) * 0.045 + (P1[i] === ' ' ? 0.04 : 0); } const bell = t + 0.05; t += 0.75; const ret = [bell + 0.1, t - 0.1]; for (let i = 0; i < P2.length; i++) { k.push(t); t += 0.062 + R(i + 71) * 0.045 + (P2[i] === ' ' ? 0.04 : 0); } return { k, bell, ret, end: t, stamp: t + 0.45 }; })();
  function s8(c, u, t) {
    const CWD = 30, n = KEYS.k.filter(x => x <= u).length, n1 = Math.min(n, P1.length), n2 = Math.max(0, n - P1.length);
    const rt = ss(KEYS.ret[0], KEYS.ret[1], u), last = n ? u - KEYS.k[n - 1] : 9;
    // o carro: o papel móvese, o punto de impresión queda no centro
    const col = n <= P1.length && rt < 1 ? lerp(n1, 0, rt) : n2;
    const px = 480 + (P1.length / 2 - col - 0.5) * CWD, feed = 58 * rt, by = 352;
    c.fillStyle = '#0d0b0a'; c.fillRect(0, 0, W, H);
    c.save(); c.translate(W / 2, H / 2); c.scale(1.03 + 0.04 * ss(0, 6, u), 1.03 + 0.04 * ss(0, 6, u)); c.translate(-W / 2, -H / 2 - 36 + (last < 0.04 ? 1.5 : 0));
    // papel
    c.save(); c.translate(px, 0);
    rrect(c, -350, -60, 700, 520, 3, '#eadfc4', OUT, 4);
    const pg = c.createLinearGradient(0, 300, 0, 430); pg.addColorStop(0, 'rgba(120,90,50,0)'); pg.addColorStop(1, 'rgba(120,90,50,.28)'); c.fillStyle = pg; c.fillRect(-348, 300, 696, 130);
    c.save(); c.translate(0, -feed);
    c.fillStyle = '#3a2f24'; c.textAlign = 'center'; c.textBaseline = 'alphabetic'; c.font = '700 30px Georgia, serif'; c.fillText('PARTE DE INCIDENCIA', 0, 92);
    c.fillRect(-250, 108, 500, 3); c.fillRect(-250, 114, 500, 1.2);
    typed(c, 'Monforte de Lemos, 14-I-1958', 99, -40, 172, 26, '#2a2420', 200);
    typed(c, 'Hora: 21:40.  Vía: 1.', 99, -124, 220, 26, '#2a2420', 240);
    for (const y of [258, 262]) { c.fillStyle = 'rgba(58,47,36,.5)'; c.fillRect(-300, y, 600, 1); }
    // liñas tecleadas (aliñadas á esquerda dende a marxe)
    const x0 = -P1.length * CWD / 2 + CWD / 2; c.font = `700 46px ${MONO}`; c.textAlign = 'center';
    for (let i = 0; i < n1; i++) { c.globalAlpha = 0.8 + R(i + 300) * 0.2; c.fillStyle = '#1c1714'; c.fillText(P1[i], x0 + i * CWD, by + (R(i + 320) - 0.5) * 3); }
    for (let i = 0; i < n2; i++) { c.globalAlpha = 0.8 + R(i + 400) * 0.2; c.fillStyle = '#1c1714'; c.fillText(P2[i], x0 + i * CWD, by + 58 + (R(i + 420) - 0.5) * 3); }
    c.globalAlpha = 1;
    // selo
    const st = u - KEYS.stamp; if (st > 0) { const q = clamp(st / 0.12), sc = lerp(1.9, 1, q); c.save(); c.translate(196, 208); c.rotate(-0.16); c.scale(sc, sc); c.globalAlpha = 0.85 * q; rrect(c, -128, -34, 256, 68, 6, null, '#a3261c', 6); c.fillStyle = '#a3261c'; c.font = '700 44px Georgia, serif'; c.textBaseline = 'middle'; c.fillText('ARQUIVADO', 0, 2); c.restore(); }
    c.restore(); c.restore();
    // guía do tipo, cinta e barra que golpea
    c.fillStyle = '#7d1712'; c.fillRect(436, by + 10, 88, 9); c.fillStyle = '#15110f'; c.fillRect(436, by + 19, 88, 9); line(c, 436, by + 10, 524, by + 10, OUT, 2); line(c, 436, by + 28, 524, by + 28, OUT, 2);
    if (last < 0.05) { poly(c, [[472, by + 6], [488, by + 6], [500, 560], [460, 560]], '#3c4252', OUT, 3); }
    poly(c, [[450, by + 44], [462, by - 34], [470, by - 34], [470, by + 6], [490, by + 6], [490, by - 34], [498, by - 34], [510, by + 44]], '#9aa3b8', OUT, 3);
    // rodete, regra e pezas da máquina
    c.save(); c.translate((px - 480) * 1, 0);
    const rg = c.createLinearGradient(0, 392, 0, 478); rg.addColorStop(0, '#2a2c33'); rg.addColorStop(0.25, '#4a4d58'); rg.addColorStop(0.5, '#17181d'); rg.addColorStop(1, '#08080a');
    rrect(c, -160, 392, 1280, 86, 10, '#111', OUT, 5); c.fillStyle = rg; c.fillRect(-156, 395, 1272, 80);
    for (const x of [-190, 1090]) { rrect(c, x, 384, 60, 102, 12, '#1c1d22', OUT, 5); for (let i = 0; i < 6; i++) line(c, x + 8 + i * 9, 392, x + 8 + i * 9, 478, '#3a3d48', 2); }
    rrect(c, -150, 380, 1260, 14, 4, '#b9c0cf', OUT, 3.5);
    for (let i = 0; i < 84; i++) line(c, -140 + i * 15, 382, -140 + i * 15, i % 5 ? 387 : 391, '#2a2c33', 1.5);
    for (const x of [200, 760]) rrect(c, x - 16, 372, 32, 28, 6, '#2a2c33', OUT, 3.5);
    c.restore();
    // corpo da máquina
    const bg = c.createLinearGradient(0, 478, 0, 560); bg.addColorStop(0, '#1b2420'); bg.addColorStop(1, '#0b100e'); poly(c, [[-40, 482], [W + 40, 482], [W + 40, 580], [-40, 580]], bg, OUT, 5);
    line(c, -40, 489, W + 40, 489, '#3d5247', 3);
    c.beginPath(); c.ellipse(480, 590, 250, 86, 0, Math.PI, TAU); c.fillStyle = '#060807'; c.fill(); c.strokeStyle = OUT; c.lineWidth = 4; c.stroke();
    for (let i = 0; i < 23; i++) { const a = Math.PI + (i + 0.5) / 23 * Math.PI; line(c, 480 + Math.cos(a) * 110, 590 + Math.sin(a) * 38, 480 + Math.cos(a) * 240, 590 + Math.sin(a) * 82, '#59606f', 2.5); }
    c.restore();
    // luz de flexo
    glow(c, 520, 250, 620, '255,214,150', 0.16);
    const v = c.createRadialGradient(480, 290, 190, 480, 290, 640); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.86)'); c.fillStyle = v; c.fillRect(0, 0, W, H);
  }
  /* 9 · 68 anos despois */
  function s9(c, u) {
    c.fillStyle = '#020306'; c.fillRect(0, 0, W, H);
    const a = ss(0.4, 1.1, u) * (1 - ss(2.3, 2.9, u));
    c.globalAlpha = a; c.fillStyle = '#f2ead8'; c.textAlign = 'center'; c.textBaseline = 'alphabetic'; c.font = 'italic 52px Georgia, serif'; c.fillText('68 anos despois', W / 2, 284);
    const w = 150 * ss(0.5, 1.6, u); c.fillStyle = '#f2a33a'; c.fillRect(W / 2 - w, 312, w * 2, 2.5); c.globalAlpha = 1;
  }
  /* 10 · a rotonda do museo, de noite */
  function s10(c, u, t) {
    const k = ease(clamp(u / 6));
    c.fillStyle = '#04060c'; c.fillRect(0, 0, W, H);
    c.save(); cam(c, 1536, lerp(768, 850, k), lerp(540, 525, k), lerp(1, 1.5, k));
    if (NIGHT.rotonda) c.drawImage(NIGHT.rotonda, 0, 0);
    const fl = 0.8 + 0.2 * Math.sin(t * 13) * Math.sin(t * 3.1) - (Math.sin(t * 1.7) > 0.97 ? 0.5 : 0);
    glow(c, 250, 318, 120, '255,190,110', 0.5 * fl); glow(c, 250, 318, 26, '255,240,200', 0.9 * fl); glow(c, 1330, 292, 90, '255,190,110', 0.4);
    c.restore();
    fogBand(c, t, 60, 230, 10, 0.4, 9); fogBand(c, t, 300, 260, -16, 0.5, 10); fogBand(c, t, 390, 220, 26, 0.4, 11);
    vignette(c, 0.85);
  }
  /* 11 · a pinga de graxa fresca */
  function s11(c, u, t) {
    let g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#070b18'); g.addColorStop(1, '#131d3c'); c.fillStyle = g; c.fillRect(0, 0, W, H);
    const z = 1 + 0.12 * ease(clamp(u / 3.2));
    c.save(); c.translate(600, 380); c.scale(z, z); c.translate(-600, -380);
    fogBand(c, t, 120, 300, 8, 0.4, 12);
    // balastro e travesas
    c.fillStyle = '#0b1020'; c.fillRect(-60, 500, W + 120, 80);
    for (let i = 0; i < 50; i++) disc(c, R(i + 60) * 1060 - 50, 522 + R(i + 70) * 40, 7 + R(i + 80) * 10, R(i) > 0.5 ? '#171f38' : '#111830', OUT, 2);
    for (const x of [40, 400, 760]) rrect(c, x, 492, 170, 34, 4, '#2a2019', OUT, 4);
    // rodas (dúas, enormes) e pestana
    for (const wx of [250, 1010]) {
      disc(c, wx, -52, 498, '#101522', OUT, 6); disc(c, wx, -52, 480, '#252d42', OUT, 6); disc(c, wx, -52, 430, '#0b0f1a', OUT, 5);
      c.save(); c.translate(wx, -52); for (let i = 0; i < 14; i++) { c.rotate(TAU / 14); c.fillStyle = '#1a2133'; c.fillRect(-13, 60, 26, 372); c.strokeStyle = OUT; c.lineWidth = 3; c.strokeRect(-13, 60, 26, 372); } c.restore();
      c.beginPath(); c.arc(wx, -52, 470, Math.PI * 0.3, Math.PI * 0.62); c.strokeStyle = '#8aa0d2'; c.lineWidth = 6; c.lineCap = 'round'; c.stroke();
    }
    // carril
    c.fillStyle = '#3b4763'; c.fillRect(-60, 428, W + 120, 30); c.fillStyle = '#27304a'; c.fillRect(-60, 458, W + 120, 26); c.fillStyle = '#323c58'; c.fillRect(-60, 484, W + 120, 12);
    for (const y of [428, 458, 484, 496]) line(c, -60, y, W + 60, y, OUT, 4);
    line(c, -60, 433, W + 60, 433, '#c9d6f5', 3.5);
    // biela vermella e a súa cabeza
    rrect(c, 250, 196, 780, 46, 8, '#8f1d22', OUT, 6); line(c, 262, 204, 1020, 204, '#d2474a', 3.5); line(c, 262, 234, 1020, 234, '#5b1014', 3);
    disc(c, 600, 219, 72, '#9c2227', OUT, 6); disc(c, 600, 219, 46, '#c9a254', OUT, 5); disc(c, 600, 219, 28, '#39435a', OUT, 4); disc(c, 600, 219, 9, '#141927');
    c.beginPath(); c.arc(600, 219, 64, Math.PI * 1.1, Math.PI * 1.55); c.strokeStyle = '#e0676a'; c.lineWidth = 4; c.stroke();
    // graxa fresca que rebordou
    const AM = '#e09a28', AMD = '#8a5510';
    c.beginPath(); c.moveTo(566, 262); c.quadraticCurveTo(584, 300, 600, 290); c.quadraticCurveTo(618, 300, 634, 262); c.quadraticCurveTo(600, 280, 566, 262); c.fillStyle = AM; c.fill(); c.strokeStyle = AMD; c.lineWidth = 3; c.stroke();
    line(c, 582, 272, 592, 282, '#ffe2a0', 3);
    // a pinga
    const fall = 1.5, hitT = 1.9, dx = 600, y0 = 292;
    if (u < fall) { const q = clamp(u / fall), len = 6 + 34 * q * q, r = 5 + 9 * q; c.beginPath(); c.moveTo(dx - 5, y0 - 4); c.quadraticCurveTo(dx - 2, y0 + len * 0.6, dx - r, y0 + len); c.arc(dx, y0 + len, r, Math.PI, 0, true); c.quadraticCurveTo(dx + 2, y0 + len * 0.6, dx + 5, y0 - 4); c.closePath(); c.fillStyle = AM; c.fill(); c.strokeStyle = AMD; c.lineWidth = 3; c.stroke(); disc(c, dx - r * 0.35, y0 + len - r * 0.2, r * 0.3, '#fff0c4'); glow(c, dx, y0 + len, 46, '255,190,90', 0.35 * q); }
    else if (u < hitT) { const q = (u - fall) / (hitT - fall), y = lerp(y0 + 40, 418, q * q); c.beginPath(); c.moveTo(dx, y - 26); c.quadraticCurveTo(dx + 14, y, dx, y + 13); c.quadraticCurveTo(dx - 14, y, dx, y - 26); c.fillStyle = AM; c.fill(); c.strokeStyle = AMD; c.lineWidth = 3; c.stroke(); disc(c, dx - 4, y + 2, 3.5, '#fff0c4'); glow(c, dx, y, 50, '255,190,90', 0.4); }
    else {
      const q = u - hitT;
      c.beginPath(); c.ellipse(dx, 428, 22, 6.5, 0, 0, TAU); c.fillStyle = AM; c.fill(); c.strokeStyle = AMD; c.lineWidth = 3; c.stroke(); line(c, dx - 10, 426, dx + 2, 425, '#fff0c4', 2.5);
      if (q < 0.5) { const e = q / 0.5; for (let i = 0; i < 7; i++) { const a = Math.PI * (1.12 + i * 0.127), r = 14 + e * 44; disc(c, dx + Math.cos(a) * r, 428 + Math.sin(a) * r * 0.9 + e * e * 26, 3.4 * (1 - e) + 0.6, AM); } c.beginPath(); c.ellipse(dx, 428, 22 + e * 46, 6 + e * 9, 0, 0, TAU); c.strokeStyle = `rgba(255,226,160,${1 - e})`; c.lineWidth = 2.5; c.stroke(); }
      // brillo en estrela
      const sp = Math.sin(clamp(q / 1.2) * Math.PI); if (sp > 0) { c.save(); c.translate(dx + 4, 424); c.rotate(q * 0.6); c.globalCompositeOperation = 'lighter'; c.fillStyle = `rgba(255,244,214,${sp})`; for (let i = 0; i < 4; i++) { c.rotate(Math.PI / 2); c.beginPath(); c.moveTo(0, -3); c.lineTo(46 * sp + 8, 0); c.lineTo(0, 3); c.closePath(); c.fill(); } c.restore(); glow(c, dx + 4, 424, 80, '255,200,110', 0.6 * sp); }
    }
    c.restore();
    fogBand(c, t, 400, 180, 20, 0.3, 13);
    vignette(c, 0.85);
  }
  /* 12 · o balcón sobre Doutor Casares */
  function s12(c, u, t) {
    const k = clamp(u / 5);
    c.fillStyle = '#04060c'; c.fillRect(0, 0, W, H);
    c.save(); cam(c, 1672, lerp(990, 1020, k), lerp(400, 380, k), lerp(1.3, 1.38, k));
    if (IM.vista) c.drawImage(IM.vista, 0, 0);
    const on = u < 2.5 ? 1 : u < 2.56 ? 0.25 : 0;
    if (on) { c.fillStyle = `rgba(255,205,120,${0.85 * on})`; c.fillRect(1257, 197, 62, 42); c.strokeStyle = OUT; c.lineWidth = 2; c.strokeRect(1257, 197, 62, 42); line(c, 1288, 197, 1288, 239, OUT, 2); glow(c, 1288, 218, 120, '255,190,100', 0.4 * on); }
    glow(c, 1050, 420, 60, '255,190,110', 0.25);
    c.restore();
    fogBand(c, t, 90, 220, 9, 0.35, 14); fogBand(c, t, 260, 240, -12, 0.3, 15);
    vignette(c, 0.8);
  }
  /* 13 · o título sae do vapor */
  function s13(c, u, t) {
    c.fillStyle = '#030408'; c.fillRect(0, 0, W, H);
    glow(c, W / 2, 230, 520, '60,80,150', 0.3 * ss(0, 2, u));
    const out = 1 - ss(7.5, 8.3, u), a = ss(0.7, 2.4, u) * out, sc = lerp(1.06, 1, ss(0.5, 4, u));
    c.save(); c.translate(W / 2, 228); c.scale(sc, sc); c.globalAlpha = a;
    c.fillStyle = '#f2a33a'; c.textAlign = 'center'; c.textBaseline = 'alphabetic'; c.font = '900 118px Georgia, serif';
    const txt = 'VÍA MORTA'; let tw = 0; const ws = [...txt].map(ch => { const w = c.measureText(ch).width + 9; tw += w; return w; }); let x = -tw / 2;
    c.textAlign = 'left'; [...txt].forEach((ch, i) => { c.fillText(ch, x, 34); x += ws[i]; });
    // a vía que remata nun tope
    const rw = lerp(0, tw / 2 + 6, ss(1.2, 3, u));
    c.fillStyle = '#f2ead8'; c.fillRect(-rw, 62, rw * 2, 3); c.fillRect(-rw, 74, rw * 2, 3);
    for (let sx = -rw + 8; sx < rw - 4; sx += 22) c.fillRect(sx, 58, 5, 23);
    if (rw > 100) { c.fillStyle = '#f2a33a'; c.fillRect(rw - 2, 50, 7, 36); c.fillRect(rw - 16, 50, 20, 6); }
    c.restore();
    // vapor que se disipa
    for (let i = 0; i < 38; i++) { const q = clamp((u - R(i + 5) * 0.8) / 4.2), dirx = (R(i) - 0.5) * 2; puff(c, W / 2 + dirx * (200 + q * 430) + Math.sin(t * 0.4 + i) * 12, 230 + (R(i + 20) - 0.5) * 170 - q * 110, 90 + R(i + 9) * 110 + q * 90, '214,222,244', 0.42 * (1 - q) * ss(0, 0.6, u)); }
    // peche (mestura elixida por Oscar): tres golpes curtos baixo o título
    c.textAlign = 'center'; c.fillStyle = '#f2ead8'; c.font = 'italic 28px Georgia, serif';
    c.globalAlpha = ss(3.0, 3.8, u) * out; c.fillText('68 anos de silencio.', W / 2, 372);
    c.globalAlpha = ss(4.1, 4.9, u) * out; c.fillText('Dous longos e un curto.', W / 2, 410);
    c.globalAlpha = ss(5.3, 6.0, u) * out; c.fillStyle = '#f2a33a'; c.font = 'italic 700 34px Georgia, serif'; c.fillText('Alguén segue a chamar.', W / 2, 462);
    c.globalAlpha = 1;
  }

  /* [inicio, función, fundido de entrada, fundido de saída] */
  const SHOTS = [[T.s1, s1, 0.6, 0.5], [T.s2, s2, 0.9, 0], [T.s3, s3, 0, 0], [T.s4, s4, 0, 0], [T.s5, s5, 0, 0], [T.s6, s6, 0, 0], [T.s7, s7, 0, 0.4], [T.s8, s8, 0.5, 0.7], [T.s9, s9, 0, 0], [T.s10, s10, 1, 0.25], [T.s11, s11, 0.2, 0.25], [T.s12, s12, 0.35, 1], [T.s13, s13, 0, 0]];
  function render(c, t) {
    t = clamp(t, 0, T.end - 0.001);
    let i = SHOTS.length - 1; while (i > 0 && SHOTS[i][0] > t) i--;
    const [st, fn, fi, fo] = SHOTS[i], en = i + 1 < SHOTS.length ? SHOTS[i + 1][0] : T.end, u = t - st;
    c.save(); fn(c, u, t); c.restore();
    const a = Math.min(fi ? clamp(u / fi) : 1, fo ? clamp((en - t) / fo) : 1);
    if (a < 1) { c.fillStyle = `rgba(2,3,6,${1 - a})`; c.fillRect(0, 0, W, H); }
    // bandas de cine
    c.fillStyle = '#000'; c.fillRect(0, 0, W, 34); c.fillRect(0, H - 34, W, 34);
  }

  /* ================= SON ================= */
  let AU = null;
  function audioStart() {
    SFX.init(); const ac = SFX.ctx; if (!ac) return null;
    const master = ac.createGain(); master.gain.value = E.opts.sfx; master.connect(ac.destination);
    const t0 = ac.currentTime + 0.12, nodes = [];
    const nb = ac.createBuffer(1, ac.sampleRate * 2, ac.sampleRate), d = nb.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const envOf = (g, at, pts) => { g.gain.setValueAtTime(0.0001, t0 + at); for (const [dt, v] of pts) g.gain.linearRampToValueAtTime(Math.max(v, 0.0001), t0 + at + dt); };
    /* ruído filtrado: pts = [[dt, volume], ...] */
    const nz = (at, pts, type, freq, q = 1, dest = master, fTo) => {
      const s = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain(), end = pts[pts.length - 1][0];
      s.buffer = nb; s.loop = true; f.type = type; f.frequency.setValueAtTime(freq, t0 + at); if (fTo) f.frequency.exponentialRampToValueAtTime(fTo, t0 + at + end); f.Q.value = q;
      s.connect(f); f.connect(g); g.connect(dest); envOf(g, at, pts); s.start(t0 + at, Math.random()); s.stop(t0 + at + end + 0.05); nodes.push(s); return f;
    };
    const tone = (at, pts, f0, type = 'sine', fTo, dest = master) => {
      const o = ac.createOscillator(), g = ac.createGain(), end = pts[pts.length - 1][0];
      o.type = type; o.frequency.setValueAtTime(f0, t0 + at); if (fTo) o.frequency.exponentialRampToValueAtTime(fTo, t0 + at + end);
      o.connect(g); g.connect(dest); envOf(g, at, pts); o.start(t0 + at); o.stop(t0 + at + end + 0.05); nodes.push(o); return o;
    };
    const whistle = (at, v, dest) => { for (const [w0, dur] of WHP) { for (const f of [440, 523, 659]) { const o = tone(at + w0, [[0.07, v / 3], [dur - 0.1, v / 3], [dur, 0]], f * 0.93, 'sawtooth', null, dest.lp); o.frequency.exponentialRampToValueAtTime(f, t0 + at + w0 + 0.09); } nz(at + w0, [[0.05, v * 0.35], [dur - 0.08, v * 0.3], [dur, 0]], 'bandpass', 2400, 0.6, dest.lp); } };
    const bus = (cut, echo) => { const lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = cut; lp.connect(master); if (echo) { const dl = ac.createDelay(1), fb = ac.createGain(), wet = ac.createGain(); dl.delayTime.value = 0.36; fb.gain.value = 0.45; wet.gain.value = 0.6; lp.connect(dl); dl.connect(fb); fb.connect(dl); dl.connect(wet); wet.connect(master); } return { lp }; };

    // chuvia de 1958 (ata o parte) e vento
    nz(0, [[1.5, 0.05], [T.s2, 0.05], [T.s2 + 1, 0.028], [T.s6, 0.03], [T.s7, 0.03], [T.s7 + 0.6, 0.075], [T.s8, 0.06], [T.s8 + 1, 0.02], [T.s9 - 0.6, 0.02], [T.s9, 0]], 'highpass', 4200, 0.5);
    nz(0, [[2, 0.05], [T.s2, 0.04], [T.s3, 0.02], [T.s6, 0.03], [T.s8, 0.035], [T.s8 + 0.8, 0]], 'bandpass', 900, 0.4);
    nz(0, [[1, 0.08], [2.4, 0.03], [3.6, 0.09], [T.s2 + 0.5, 0.02], [T.s2 + 2, 0]], 'bandpass', 320, 2.5, master, 520);
    // tic-tac do reloxo da estación
    for (let i = 0; i < 9; i++) { const at = 0.5 + i; nz(at, [[0.004, i < 4 ? 0.16 : 0.07], [0.05, 0]], 'bandpass', i % 2 ? 2100 : 2600, 6); }
    // máquina de escribir da data
    for (let i = 0; i < L1.length; i++) if (L1[i] !== ' ') nz(0.7 + i * 0.075, [[0.003, 0.2], [0.04, 0]], 'bandpass', 2600 + R(i) * 900, 2);
    for (let i = 0; i < L2.length; i++) if (L2[i] !== ' ') nz(2.15 + i * 0.062, [[0.003, 0.2], [0.04, 0]], 'bandpass', 2600 + R(i + 9) * 900, 2);
    // andén: murmurio, unha tose, porta de vagón, vapor
    nz(T.s2, [[1, 0.1], [6, 0.1], [9.5, 0.02], [11, 0]], 'bandpass', 420, 1.6); nz(T.s2, [[1.2, 0.05], [6, 0.05], [9, 0]], 'bandpass', 950, 2.2);
    for (let i = 0; i < 16; i++) { const at = T.s2 + 0.4 + i * 0.42 + R(i) * 0.3; tone(at, [[0.05, 0.022], [0.22 + R(i + 3) * 0.2, 0]], 170 + R(i + 5) * 190, 'triangle', 150 + R(i + 8) * 160); }
    for (const dt of [2.6, 2.84]) nz(T.s2 + dt, [[0.01, 0.12], [0.13, 0]], 'bandpass', 700, 1.5);
    tone(T.s2 + 4.6, [[0.01, 0.3], [0.3, 0]], 95, 'sine', 55); nz(T.s2 + 4.6, [[0.005, 0.18], [0.16, 0]], 'lowpass', 500);
    for (const dt of [0.6, 3.4, 5.9]) nz(T.s2 + dt, [[0.25, 0.05], [1.3, 0]], 'highpass', 3000);
    // chirrido e trono do mercadorías: medra dende o plano 3 ata o corte a negro
    const sq = [[0.5, 0.004], [5, 0.035], [8, 0.055], [8.1, 0.022], [11, 0.03], [T.s7 - T.s3 - 0.05, 0.06], [T.s7 - T.s3, 0]];
    tone(T.s3, sq, 2850, 'sawtooth', 3150); tone(T.s3, sq.map(([a, b]) => [a, b * 0.7]), 3420, 'square', 3300); nz(T.s3, sq.map(([a, b]) => [a, b * 2]), 'bandpass', 3000, 9);
    nz(T.s3, [[1, 0.02], [5, 0.3], [8, 0.5], [8.1, 0.25], [T.s7 - T.s3 - 0.05, 0.5], [T.s7 - T.s3, 0]], 'lowpass', 110);
    for (let k = 0; k < 9; k++) for (const dd of [0, 0.11]) { const at = T.s4 + 0.1 + k * 0.33 + dd; tone(at, [[0.005, 0.5], [0.09, 0]], 82, 'sine', 48); nz(at, [[0.004, 0.2], [0.06, 0]], 'bandpass', 900, 1.2); }
    nz(T.s4, [[0.1, 0.09], [2.9, 0.09], [3, 0]], 'highpass', 5200);
    // a panca: esforzo e clac
    tone(T.s5 + 0.5, [[0.1, 0.05], [0.7, 0.05], [0.75, 0]], 210, 'sawtooth', 150);
    { const at = T.s5 + 1.52; nz(at, [[0.003, 0.7], [0.07, 0]], 'bandpass', 1900, 1); tone(at, [[0.004, 0.6], [0.14, 0]], 150, 'square', 70); for (const f of [1230, 1790, 2470]) tone(at, [[0.004, 0.09], [0.9, 0]], f); tone(at + 0.16, [[0.004, 0.2], [0.1, 0]], 120, 'square', 80); }
    // a Mikado: asubío, dous longos e un curto
    whistle(WH - 0, 0.3, bus(2200, false));
    nz(T.s6, [[0.4, 0.04], [4, 0.12], [T.s7 - T.s6, 0]], 'highpass', 2500);
    // golpe xordo e lonxano
    tone(T.s7 + 0.75, [[0.02, 0.9], [1.5, 0]], 62, 'sine', 30); nz(T.s7 + 0.75, [[0.02, 0.5], [0.9, 0]], 'lowpass', 140); nz(T.s7 + 0.95, [[0.3, 0.05], [1.8, 0]], 'bandpass', 500, 0.8);
    // máquina de escribir do parte, campá e retorno do carro
    [...P1, ...P2].forEach((ch, i) => { const at = T.s8 + KEYS.k[i]; if (ch === ' ') { tone(at, [[0.004, 0.2], [0.05, 0]], 140, 'sine', 90); return; } nz(at, [[0.002, 0.45], [0.035, 0]], 'bandpass', 2300 + R(i + 40) * 1000, 1.6); tone(at, [[0.003, 0.3], [0.05, 0]], 170, 'square', 90); });
    for (const f of [2093, 4186]) tone(T.s8 + KEYS.bell, [[0.004, f < 3000 ? 0.16 : 0.05], [1.1, 0]], f);
    nz(T.s8 + KEYS.ret[0], [[0.05, 0.16], [KEYS.ret[1] - KEYS.ret[0], 0.12], [KEYS.ret[1] - KEYS.ret[0] + 0.05, 0]], 'bandpass', 1200, 3, master, 2600); tone(T.s8 + KEYS.ret[1], [[0.004, 0.4], [0.08, 0]], 130, 'square', 70);
    tone(T.s8 + KEYS.stamp, [[0.005, 0.9], [0.22, 0]], 105, 'sine', 45); nz(T.s8 + KEYS.stamp, [[0.004, 0.4], [0.1, 0]], 'lowpass', 600);
    // hoxe: vento, farola, can ao lonxe
    nz(T.s10 - 0.3, [[1.5, 0.11], [3, 0.05], [5, 0.12], [7.5, 0.06], [9.5, 0.1], [13.6, 0.06], [16.5, 0.02], [T.end - T.s10, 0]], 'bandpass', 300, 2.2, master, 460);
    for (const f of [100, 200, 300]) tone(T.s10, [[1, 0.012], [5.6, 0.012], [6, 0]], f, 'sawtooth');
    { const b = bus(1100, true); for (const dt of [2.1, 2.38, 3.9]) { tone(T.s10 + dt, [[0.02, 0.07], [0.13, 0]], 520, 'sawtooth', 300, b.lp); nz(T.s10 + dt, [[0.02, 0.07], [0.12, 0]], 'bandpass', 900, 2, b.lp); } }
    // plic
    tone(T.s11 + 1.9, [[0.003, 0.4], [0.09, 0]], 2100, 'sine', 900); tone(T.s11 + 1.93, [[0.003, 0.12], [0.3, 0]], 3300, 'sine', 2900);
    // o asubío outra vez, lonxe e con eco
    whistle(WH2, 0.2, bus(1300, true));
    tone(T.s12 + 2.5, [[0.003, 0.12], [0.05, 0]], 900, 'square', 300);
    // golpe grave do título e acorde (re menor)
    tone(T.s13 + 0.5, [[0.02, 0.8], [3.5, 0]], 55, 'sine', 36); nz(T.s13 + 0.5, [[0.02, 0.35], [1.2, 0]], 'lowpass', 160);
    for (const [f, v] of [[73.4, 0.2], [110, 0.13], [146.8, 0.1], [174.6, 0.07], [220, 0.05]]) tone(T.s13 + 0.5, [[1.2, v], [5.3, v * 0.7], [8.2, 0]], f, 'triangle');
    tone(T.s13 + 5.3, [[0.6, 0.06], [2.8, 0]], 293.7, 'sine'); tone(T.s13 + 5.3, [[0.6, 0.04], [2.8, 0]], 440, 'sine');
    return { ac, master, t0, nodes };
  }
  function audioStop(fast) {
    if (!AU) return; const { ac, master, nodes } = AU; AU = null;
    try { master.gain.cancelScheduledValues(ac.currentTime); master.gain.setValueAtTime(master.gain.value, ac.currentTime); master.gain.linearRampToValueAtTime(0, ac.currentTime + (fast ? 0.25 : 0.6)); } catch (e) { }
    setTimeout(() => { for (const n of nodes) try { n.stop(); } catch (e) { } try { master.disconnect(); } catch (e) { } }, 800);
  }

  /* ================= REPRODUCIÓN ================= */
  let el = null, cv = null, playing = false;
  function mount() {
    if (el) return;
    const st = document.createElement('style');
    st.textContent = '#cineIntro{position:fixed;inset:0;z-index:35;background:#000;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:opacity 1.3s;touch-action:manipulation}#cineIntro[hidden]{display:none}#cineIntro canvas{width:min(100vw,calc(100dvh * 16 / 9));aspect-ratio:16/9;display:block}#cineSkip{position:absolute;right:max(14px,env(safe-area-inset-right));bottom:max(14px,env(safe-area-inset-bottom));font:700 17px "Trebuchet MS",sans-serif;padding:12px 20px;min-height:48px;border-radius:8px;border:2px solid #f2a33a;background:rgba(14,16,20,.88);color:#f2a33a;cursor:pointer;opacity:0;pointer-events:none;transition:opacity .25s}#cineSkip.on{opacity:1;pointer-events:auto}#cineDay{position:absolute;left:0;right:0;bottom:18%;text-align:center;font:italic 700 clamp(22px,4.5vw,40px) Georgia,serif;color:#f2ead8;text-shadow:0 2px 10px #000;opacity:0;transition:opacity .6s;pointer-events:none}#cineDay.on{opacity:1}';
    document.head.appendChild(st);
    el = document.createElement('div'); el.id = 'cineIntro'; el.hidden = true;
    el.innerHTML = '<canvas></canvas><div id="cineDay">Luns, 7:52</div><button id="cineSkip" type="button">Saltar ▸</button>';
    document.body.appendChild(el); cv = el.querySelector('canvas');
  }
  function fit() {
    const r = cv.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, 2.5), w = Math.round(clamp(r.width * dpr, 480, 1920));
    if (cv.width !== w) { cv.width = w; cv.height = Math.round(w * 9 / 16); }
    return cv.width / W;
  }
  function drawFrame(t) { const c = cv.getContext('2d'), s = fit(); c.setTransform(s, 0, 0, s, 0, 0); render(c, t); }
  /* Reproduce a cinemática. A promesa resólvese cando remata ou cando se salta
     (coa pantalla aínda en negro); despois o fundido descobre o xogo. */
  async function play(opts = {}) {
    if (playing) return; playing = true; mount();
    el.style.transition = 'none'; el.style.opacity = 1; el.hidden = false; void el.offsetWidth; el.style.transition = '';
    const skipB = el.querySelector('#cineSkip'), day = el.querySelector('#cineDay'); skipB.classList.remove('on'); day.classList.remove('on');
    { const c = cv.getContext('2d'); fit(); c.setTransform(1, 0, 0, 1, 0, 0); c.fillStyle = '#000'; c.fillRect(0, 0, cv.width, cv.height); }
    await prepare();
    AU = audioStart();
    const p0 = performance.now(), au = AU; let skipped = false, raf = 0, hideT = 0;
    const now = () => (au && au.ac.state === 'running' ? Math.max(0, au.ac.currentTime - au.t0) : (performance.now() - p0) / 1000);
    await new Promise(done => {
      const finish = sk => { if (!playing) return; skipped = sk; cancelAnimationFrame(raf); clearTimeout(hideT); el.onclick = null; skipB.onclick = null; window.removeEventListener('keydown', key, true); done(); };
      const ask = () => { skipB.classList.add('on'); clearTimeout(hideT); hideT = setTimeout(() => skipB.classList.remove('on'), 3500); };
      const key = ev => { ev.stopPropagation(); if (ev.key === 'Escape' || ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); if (skipB.classList.contains('on')) finish(true); else ask(); } };
      el.onclick = ev => { if (ev.target === skipB) return; ask(); };
      skipB.onclick = ev => { ev.stopPropagation(); finish(true); };
      window.addEventListener('keydown', key, true);
      const loop = () => { const t = now(); if (t >= T.end) return finish(false); drawFrame(t); raf = requestAnimationFrame(loop); };
      loop();
    });
    audioStop(skipped);
    { const c = cv.getContext('2d'); c.setTransform(1, 0, 0, 1, 0, 0); c.fillStyle = '#000'; c.fillRect(0, 0, cv.width, cv.height); }
    skipB.classList.remove('on');
    if (opts.day !== false) day.classList.add('on');
    setTimeout(() => { el.style.opacity = 0; }, opts.day !== false ? 500 : 0);
    setTimeout(() => { day.classList.remove('on'); }, 1500);
    setTimeout(() => { el.hidden = true; playing = false; }, opts.day !== false ? 1900 : 1400);
  }
  /* para probas: debuxa o fotograma do segundo t, sen son */
  async function frame(t) { mount(); el.style.opacity = 1; el.hidden = false; await prepare(); drawFrame(t); }
  return { play, frame, T, get playing() { return playing; } };
})();
