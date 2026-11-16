'use strict';
/* ==========================================================
   VÍA MORTA · cinemática do final do Acto 1 «O asubío ten enderezo» (guion D)
   Ficha: docs/05_FICHAS_ESCENARIOS.md (C1). Guion: docs/08_CINEMATICA_FIN_ACTO1_GUION.md.
   - Usa o reprodutor e as ferramentas de js/cinematica.js (CINE.kit): lenzo de 960×540,
     cada plano é unha función pura do tempo e CINEF1.frame(t) debuxa o fotograma do segundo t.
   - Ilustracións de Oscar pasadas a noite e animadas por riba: a rotonda da Mikado, a praza co quiosco,
     Concepción Arenal coa Fraternal, Doutor Casares, o dormitorio, o salón, a vista do balcón e a Casa Roja.
   - PROVISIONAL ata que Oscar o debuxe: Martín na cama (un vulto baixo a colcha) e Martín de costas
     no balcón (a silueta do sprite).
   - Non se ve quen asubía nin o interior das cocheras. Martín só fala unha vez, e en castelán.
   ========================================================== */
const CINEF1 = (() => {
  const { W, H, OUT, MONO, TAU, clamp, lerp, ss, ease, R, poly, rrect, disc, line, glow, puff, fogBand, vignette, cam, typed, load, bakeNight, WHP, subtitles } = CINE.kit;
  const K = 1;
  const DUR = [4.2, 7, 8.4, 8.6, 6.6, 10.5, 7.6, 5.6, 7.4];
  const T = {}; { let a = 0; DUR.forEach((d, i) => { T['s' + (i + 1)] = a; a += d * K; }); T.end = a; }
  const WH1 = 1.5, WH2 = 3.0;                       // comezo dos asubíos dentro dos planos 2 e 6 (segundos de guion)
  const MSPEC = { cw: 150, ch: 203, cols: 8 };
  let IM = {}, N = {}, SIL = null, ready = null;

  function prepare() {
    if (ready) return ready;
    ready = (async () => {
      const [ro, pr, ar, ca, d0, d1, sa, vi, ma] = await Promise.all(['img/portada-rotonda.jpg', 'img/bg-praza-estacion-2.jpg', 'img/bg-concepcion-arenal.jpg', 'img/bg-doutor-casares.jpg',
        'img/noite-dormitorio.jpg', 'img/noite-dormitorio-lampada.jpg', 'img/noite-salon.jpg', 'img/noite-vista.jpg', 'img/martin-sprite.png'].map(load));
      IM = { dorm: d0, lamp: d1, salon: sa, vista: vi, martin: ma };
      const sky = (h, w) => c => { const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, 'rgba(4,7,16,.92)'); g.addColorStop(1, 'rgba(4,7,16,0)'); c.fillStyle = g; c.fillRect(0, 0, w, h); };
      // a rotonda de noite (a mesma receita ca na cinemática de inicio)
      if (ro) N.rotonda = bakeNight(ro, '#141c44', l => { glow(l, 830, 500, 620, '150,175,255', 0.6); glow(l, 250, 330, 330, '255,186,105', 0.8); glow(l, 1330, 300, 240, '255,186,105', 0.5); }, sky(200, 1536));
      // cada rúa, dúas veces: cos farois acesos e sen eles (para que poidan tremer e apagarse)
      const two = (im, w, lights) => im && [bakeNight(im, '#141b40', l => { glow(l, w * 0.6, 200, w * 0.5, '150,175,255', 0.4); lights(l); }, sky(240, w)), bakeNight(im, '#0d1230', l => { glow(l, w * 0.6, 200, w * 0.5, '150,175,255', 0.34); }, sky(240, w))];
      const pool = (l, x, y, r) => { glow(l, x, y, r, '255,186,105', 0.85); glow(l, x, y + r * 0.9, r * 1.2, '255,186,105', 0.5, 0.4); };
      N.praza = two(pr, 1422, l => { pool(l, 35, 340, 300); pool(l, 735, 372, 260); pool(l, 1360, 356, 280); pool(l, 450, 360, 200); });
      N.arenal = two(ar, 1461, l => { pool(l, 300, 330, 300); pool(l, 880, 250, 340); pool(l, 120, 480, 200); });
      N.casares = two(ca, 1672, l => { pool(l, 618, 200, 420); glow(l, 660, 640, 420, '255,186,105', 0.55, 0.4); pool(l, 200, 520, 260); });
      // a Casa Roja sen ningunha luz na rúa: só a lúa
      if (ca) N.casa = bakeNight(ca, '#0b102c', l => { glow(l, 1100, 300, 620, '150,175,255', 0.42); }, sky(280, 1672));
      // Martín en silueta (o sprite escurecido), para o salón e o balcón
      if (ma) { SIL = document.createElement('canvas'); SIL.width = 1200; SIL.height = 406; const c = SIL.getContext('2d'); c.drawImage(ma, 0, 0); c.globalCompositeOperation = 'source-atop'; c.fillStyle = 'rgba(4,6,16,.955)'; c.fillRect(0, 0, 1200, 406); }
    })();
    return ready;
  }

  /* ---------- utilidades ---------- */
  function spr(c, im, idx, x, y, h, flip, shadow) {
    if (!im) return;
    const sp = MSPEC, w = h * sp.cw / sp.ch, sx = (idx % sp.cols) * sp.cw, sy = Math.floor(idx / sp.cols) * sp.ch;
    c.save(); if (shadow) { c.fillStyle = 'rgba(0,0,8,.4)'; c.beginPath(); c.ellipse(x, y - 2, w * 0.3, h * 0.035, 0, 0, TAU); c.fill(); }
    c.translate(x, y); if (flip) c.scale(-1, 1); c.imageSmoothingEnabled = true; c.drawImage(im, sx, sy, sp.cw, sp.ch, -w / 2, -h, w, h); c.restore();
  }
  /* o asubío debuxado: dous aros anchos e un fino (dous longos e un curto) */
  function rings(c, x, y, r, a, sy = 1, gap = 46) {
    if (a <= 0) return;
    c.save(); c.globalCompositeOperation = 'lighter'; c.translate(x, y); c.scale(1, sy);
    [[0, 9], [gap, 9], [gap * 1.8, 3.5]].forEach(([d, lw]) => { const rr = r - d; if (rr <= 4) return; c.strokeStyle = `rgba(190,208,255,${a})`; c.lineWidth = lw; c.beginPath(); c.arc(0, 0, rr, 0, TAU); c.stroke(); c.strokeStyle = `rgba(190,208,255,${a * 0.35})`; c.lineWidth = lw * 3; c.beginPath(); c.arc(0, 0, rr, 0, TAU); c.stroke(); });
    c.restore();
  }
  /* canto soa o asubío no segundo q desde que empeza (0..1) */
  function blast(q) { let w = 0; for (const [w0, wd] of WHP) { const d = q - w0; if (d > 0 && d < wd + 0.4) w = Math.max(w, ss(0, 0.1, d) * (1 - ss(wd, wd + 0.4, d))); } return w; }
  function dark(c, a) { if (a > 0) { c.fillStyle = `rgba(2,3,8,${a})`; c.fillRect(0, 0, W, H); } }
  function bulb(c, x, y, r, a) { glow(c, x, y, r * 4, '255,190,110', 0.42 * a); glow(c, x, y, r, '255,244,210', 0.95 * a); }

  /* ================= PLANOS ================= */
  /* 1 · negro e a hora, a máquina */
  const L1 = 'Luns, 23:47';
  function s1(c, u, t) {
    c.fillStyle = '#030408'; c.fillRect(0, 0, W, H);
    for (let i = 0; i < 46; i++) disc(c, R(i) * W, 44 + R(i + 50) * 330, 0.7 + R(i + 9), `rgba(230,236,255,${(0.15 + R(i + 20) * 0.45) * ss(0, 1.5, u) * (0.7 + 0.3 * Math.sin(t * 2 + i))})`);
    typed(c, L1, Math.floor(clamp((u - 0.7) / 0.11, 0, L1.length)), W / 2, 285, 52, '#f2ead8', 5);
  }
  /* 2 · a Mikado na rotonda: quieta, sen luz nin fume. Soa o asubío e non se ve a ninguén */
  function rotonda(c, t, cx, cy, z) {
    c.fillStyle = '#04060c'; c.fillRect(0, 0, W, H);
    c.save(); cam(c, 1536, cx, cy, z); if (N.rotonda) c.drawImage(N.rotonda, 0, 0);
    const fl = 0.8 + 0.2 * Math.sin(t * 13) * Math.sin(t * 3.1);
    bulb(c, 250, 318, 26, fl); glow(c, 1330, 292, 90, '255,190,110', 0.4);
  }
  function s2(c, u, t) {
    const k = ease(clamp(u / 7)), w = blast(u - WH1), j = w * 2.2;
    c.save(); c.translate(Math.sin(t * 61) * j, Math.cos(t * 53) * j);
    rotonda(c, t, lerp(700, 960, k), lerp(520, 480, k), lerp(1.3, 1.62, k));
    glow(c, lerp(700, 1200, k), 400, 150, '170,195,255', 0.22, 0.35);       // a lúa escorrega pola caldeira
    c.restore(); c.restore();
    // a néboa estremécese co son
    fogBand(c, t + w * 0.6, 40, 230, 10, 0.4 + 0.14 * w, 9); fogBand(c, t - w * 0.5, 300, 260, -16, 0.5 + 0.12 * w, 10); fogBand(c, t, 390, 220, 26, 0.4, 11);
    vignette(c, 0.85);
  }
  /* 3 · o asubío cruza Monforte durmido: a praza co quiosco pechado, a Fraternal ás escuras e Doutor Casares */
  const TOWN = [
    { key: 'praza', iw: 1422, a: [560, 410, 1.2], b: [660, 400, 1.3], lamps: [[35, 322, 9], [735, 362, 7], [1360, 346, 8], [450, 348, 7]], win: [209, 100, 46, 56] },
    { key: 'arenal', iw: 1461, a: [640, 420, 1.2], b: [560, 410, 1.3], lamps: [[300, 318, 8], [880, 236, 9]], win: null },
    { key: 'casares', iw: 1672, a: [720, 500, 1.12], b: [860, 470, 1.28], lamps: [[604, 172, 11]], win: null },
  ];
  const SEG = 2.8;
  function s3(c, u, t) {
    const i = Math.min(2, Math.floor(u / SEG)), v = u - i * SEG, S = TOWN[i], k = v / SEG, P = N[S.key];
    const pass = clamp((v - 0.5) / 1.6), on = pass > 0 && pass < 1;                 // a onda pasa por diante
    // os farois treman ao paso do son; en cada rúa quedan un chisco máis mortos
    let li = on ? 0.3 + 0.7 * Math.abs(Math.sin(t * 29) * Math.sin(t * 7.3)) : pass >= 1 ? [0.9, 0.55, 0.3][i] * (0.92 + 0.08 * Math.sin(t * 17)) : 1;
    c.fillStyle = '#04060c'; c.fillRect(0, 0, W, H);
    c.save(); cam(c, S.iw, lerp(S.a[0], S.b[0], k), lerp(S.a[1], S.b[1], k), lerp(S.a[2], S.b[2], k));
    if (P) { c.drawImage(P[0], 0, 0); c.globalAlpha = 1 - li; c.drawImage(P[1], 0, 0); c.globalAlpha = 1; }
    if (i === 0) { // o quiosco de Concha, coa persiana baixada
      rrect(c, 166, 382, 186, 116, 0, '#1b2030', OUT, 3); for (let y = 390; y < 496; y += 9) line(c, 169, y, 349, y, 'rgba(120,130,160,.35)', 1.5);
      disc(c, 259, 488, 4, '#6f7896');
    }
    for (const [x, y, r] of S.lamps) bulb(c, x, y, r, li);
    if (S.win && v > 1.9) { const a = ss(1.9, 2.0, v); const [x, y, w, h] = S.win; c.save(); c.globalCompositeOperation = 'lighter'; c.fillStyle = `rgba(255,206,130,${0.75 * a})`; c.fillRect(x, y, w, h); c.restore(); glow(c, x + w / 2, y + h / 2, 90, '255,196,120', 0.35 * a); }
    c.restore();
    rings(c, -260, 300, lerp(120, 1700, pass), on ? 0.2 * Math.sin(pass * Math.PI) + 0.06 : 0, 1, 70);
    fogBand(c, t, 300, 240, 14, 0.22, 30 + i);
    dark(c, 1 - Math.min(clamp(v / 0.3), clamp((SEG - v) / 0.3)));
    vignette(c, 0.82);
  }
  /* 4 · o dormitorio: o cristal treme, Martín abre os ollos e acende a lámpada. Non di nada. (Martín: vulto PROVISIONAL) */
  const LON = 5.6;
  function s4(c, u, t) {
    const k = ease(clamp(u / 8.6)), w = blast(u - 0.9), flick = u - LON;
    const li = flick < 0 ? 0 : flick < 0.07 ? 0.8 : flick < 0.16 ? 0.15 : flick < 0.24 ? 0.9 : flick < 0.3 ? 0.4 : 1;
    const awake = ss(2.9, 3.05, u), up = ss(4.3, 5.2, u);
    c.fillStyle = '#04060c'; c.fillRect(0, 0, W, H);
    c.save(); cam(c, 1280, lerp(640, 600, k), lerp(366, 350, k), lerp(1.0, 1.2, k));
    if (IM.dorm) c.drawImage(IM.dorm, 0, 0);
    if (IM.lamp && li > 0) { c.globalAlpha = li; c.drawImage(IM.lamp, 0, 0); c.globalAlpha = 1; }
    // o cristal da fiestra: a lúa, e o tremor do asubío
    glow(c, 690, 170, 150, '150,176,255', 0.16 + 0.2 * w);
    if (w > 0) { c.save(); c.globalCompositeOperation = 'lighter'; c.fillStyle = `rgba(190,210,255,${0.16 * w * (0.6 + 0.4 * Math.sin(t * 46))})`; c.fillRect(642, 58, 96, 216); c.restore();
      for (let i = 0; i < 4; i++) { const dx = Math.sin(t * 50 + i * 2) * 2.5 * w; line(c, 640 + dx - 5 - i * 5, 80 + i * 44, 640 + dx - 14 - i * 5, 96 + i * 44, `rgba(210,224,255,${0.5 * w})`, 2); line(c, 742 - dx + 5 + i * 5, 80 + i * 44, 742 - dx + 14 + i * 5, 96 + i * 44, `rgba(210,224,255,${0.5 * w})`, 2); } }
    // Martín baixo a colcha: respira; despois, os ollos; despois, incorpórase
    const br = Math.sin(t * (awake ? 2.6 : 1.5)) * (awake ? 1.2 : 3), hy = -16 * up;
    const col = (a, b, m = 1) => `rgb(${a.map((v, i) => lerp(v, b[i], li * 0.75) * m | 0).join(',')})`;
    c.save(); c.lineJoin = 'round'; c.lineCap = 'round';
    // os ombreiros, baixo a saba
    c.beginPath(); c.moveTo(586, 404); c.bezierCurveTo(610, 380 - br + hy * 0.5, 668, 384 - br, 700, 418); c.lineTo(640, 440); c.closePath(); c.fillStyle = col([70, 70, 84], [150, 140, 130]); c.fill();
    c.beginPath(); c.moveTo(586, 404); c.bezierCurveTo(610, 380 - br + hy * 0.5, 668, 384 - br, 700, 418); c.strokeStyle = OUT; c.lineWidth = 3; c.stroke();
    // o corpo, baixo a colcha: un lombo que sobe e baixa
    c.beginPath(); c.moveTo(636, 440); c.bezierCurveTo(690, 400 - br, 780, 420 - br, 850, 462 - br * 0.6); c.bezierCurveTo(900, 480, 936, 474 - br * 0.3, 950, 520); c.bezierCurveTo(900, 560, 760, 520, 636, 440); c.closePath();
    c.fillStyle = col([17, 16, 37], [26, 21, 44]); c.fill();
    c.beginPath(); c.moveTo(640, 436); c.bezierCurveTo(690, 400 - br, 780, 420 - br, 850, 462 - br * 0.6); c.bezierCurveTo(900, 480, 936, 474 - br * 0.3, 950, 518); c.strokeStyle = `rgba(120,132,196,${0.4 + 0.2 * li})`; c.lineWidth = 3; c.stroke();
    // a cabeza na almofada
    c.translate(574, 372 + hy);
    c.beginPath(); c.ellipse(0, 4, 25, 21, -0.2, 0, TAU); c.fillStyle = col([62, 52, 62], [232, 180, 140]); c.fill(); c.strokeStyle = OUT; c.lineWidth = 3; c.stroke();
    c.beginPath(); c.moveTo(-27, 4); c.bezierCurveTo(-32, -24, -8, -34, 14, -24); c.bezierCurveTo(30, -18, 28, -4, 22, -2); c.bezierCurveTo(8, -12, -10, -10, -20, 6); c.closePath(); c.fillStyle = col([72, 62, 50], [226, 168, 70]); c.fill(); c.stroke();
    if (awake > 0) { const bl = Math.sin(t * 0.9) > 0.985 ? 0.15 : 1; for (const ex of [-3, 13]) { c.beginPath(); c.ellipse(ex, 5, 3.6, 4.4 * awake * bl, 0, 0, TAU); c.fillStyle = '#f4f2ea'; c.fill(); disc(c, ex + 1, 5.6, 1.7, '#10131c'); } }
    else { line(c, -8, 6, 1, 7, OUT, 2.4); line(c, 9, 7, 18, 6, OUT, 2.4); }
    c.restore();
    // «zzz» ata que soa
    for (let i = 0; i < 3; i++) { const ph = ((t * 0.45 + i / 3) % 1), a = Math.sin(ph * Math.PI) * (1 - ss(0.8, 1.2, u)); if (a > 0.02) { c.globalAlpha = a * 0.8; c.fillStyle = '#c8d4ff'; c.font = `italic 700 ${20 + ph * 22}px Georgia, serif`; c.fillText('z', 610 + ph * 60 + Math.sin(ph * 9) * 8, 340 - ph * 110); c.globalAlpha = 1; } }
    c.restore();
    rings(c, 600, -80, lerp(60, 1100, clamp((u - 0.7) / 3.4)), 0.13 * w, 1, 60);
    vignette(c, 0.8 - 0.15 * li);
  }
  /* 5 · o salón ás escuras: a silueta de Martín cruza e abre o balcón. Entra unha raia de lúa */
  const OPEN = 5.0;
  function s5(c, u, t) {
    const k = ease(clamp(u / 6.6)), q = clamp((u - 0.3) / 4.3), op = ss(OPEN, OPEN + 0.9, u);
    c.fillStyle = '#04060c'; c.fillRect(0, 0, W, H);
    c.save(); cam(c, 1672, lerp(760, 1180, k), lerp(480, 470, k), lerp(1.12, 1.36, k));
    if (IM.salon) c.drawImage(IM.salon, 0, 0);
    c.fillStyle = 'rgba(3,5,14,.38)'; c.fillRect(0, 0, 1672, 941);
    glow(c, 1425, 360, 300, '150,176,255', 0.14 + 0.2 * op);
    // a raia de lúa no chan
    if (op > 0) { c.save(); c.globalCompositeOperation = 'lighter'; const g = c.createLinearGradient(1420, 590, 1150, 900); g.addColorStop(0, `rgba(150,176,255,${0.3 * op})`); g.addColorStop(1, 'rgba(150,176,255,0)'); c.fillStyle = g;
      poly(c, [[1350, 590], [1350 + 150 * op, 590], [1350 + 40 * op, 900], [1350 - 420 * op, 900]], g); c.fillStyle = `rgba(190,208,255,${0.22 * op})`; c.fillRect(1348, 150, 8 + 40 * op, 440); c.restore(); }
    const x = lerp(170, 1440, q), y = lerp(712, 650, q), h = lerp(440, 410, q);
    if (q < 1) spr(c, SIL, 4 + Math.floor(t * 7.5) % 6, x, y, h, false, true); else spr(c, SIL, 1, x, y, h, false, true);
    if (op > 0 && IM.martin) { c.globalAlpha = 0.22 * op; spr(c, IM.martin, 1, x, y, h, false); c.globalAlpha = 1; }
    c.restore();
    vignette(c, 0.84);
  }
  /* 6 · Martín no balcón, de costas (PROVISIONAL: silueta). A cámara achégase á Mikado; o segundo asubío vén
     cara a el e os farois vanse apagando un a un, da rotonda ata a súa rúa */
  const VL = [[930, 322], [1048, 300], [700, 268], [610, 300], [1046, 430], [760, 390], [1260, 520], [640, 470], [1000, 610], [1420, 640], [300, 600], [720, 660], [1180, 760], [420, 800]];
  const VC = [812, 232], VSY = 0.42;
  function s6(c, u, t) {
    const k = ease(clamp((u - 0.6) / 8)), z = lerp(1, 1.85, k), w = blast(u - WH2);
    const cx = lerp(836, 800, k), cy = lerp(470, 345, k), rr = Math.max(0, (u - WH2 - 0.3) * 250);
    c.fillStyle = '#04060c'; c.fillRect(0, 0, W, H);
    c.save(); c.imageSmoothingQuality = 'high'; cam(c, 1672, cx, cy, z);
    if (IM.vista) c.drawImage(IM.vista, 0, 0);
    glow(c, 787, 256, 150, '160,186,255', 0.2 + 0.2 * k);
    let alive = 0;
    for (let i = 0; i < VL.length; i++) { const [x, y] = VL[i], d = Math.hypot(x - VC[0], (y - VC[1]) / VSY), dt = (rr - d) / 250;      // segundos desde que lle pasou a onda
      const a = dt < 0 ? 0.85 + 0.15 * Math.sin(t * 11 + i) : dt < 0.25 ? (Math.sin(t * 60 + i) > 0 ? 0.9 : 0.15) : 0; alive += a;
      const s = 0.5 + (y - 260) / 420; bulb(c, x, y, 5 * s, a); glow(c, x, y + 26 * s, 60 * s, '255,186,105', 0.22 * a, 0.4); }
    // as ondas, deitadas sobre o chan, saen do lado do museo
    for (let n = 0; n < 2; n++) { const r = rr - n * 330; if (r > 0) rings(c, VC[0], VC[1], r, 0.34 * clamp(1.2 - r / 1500) * (n ? 0.6 : 1), VSY, 70); }
    c.restore();
    dark(c, 0.3 * (1 - alive / VL.length) * ss(WH2, WH2 + 1, u));
    fogBand(c, t, 90, 220, 9, 0.26, 14);
    // Martín, de costas, no primeiro termo
    const bob = Math.sin(t * 1.3) * 3, sc = lerp(1, 1.12, k);
    spr(c, SIL, 1, lerp(250, 205, k), H + lerp(270, 330, k) + bob, 640 * sc, false);
    if (IM.martin) { c.globalAlpha = 0.13; spr(c, IM.martin, 1, lerp(250, 205, k), H + lerp(270, 330, k) + bob, 640 * sc, false); c.globalAlpha = 1; }
    glow(c, lerp(250, 205, k) + 20, 190, 120, '150,176,255', 0.06 + 0.12 * w);
    vignette(c, 0.8);
  }
  /* 7 · a Casa Roja desde a rúa: todo negro agás o seu balcón. «Llama a mi casa.» */
  const RAIL = [[836, 346], [1268, 232]], MX = 1096;
  function s7(c, u, t) {
    const k = ease(clamp(u / 7.6));
    c.fillStyle = '#03040a'; c.fillRect(0, 0, W, H);
    c.save(); cam(c, 1672, lerp(1040, 1096, k), lerp(380, 300, k), lerp(1.2, 2.1, k));
    if (N.casa) c.drawImage(N.casa, 0, 0);
    // a fiestra do dormitorio, acesa
    const fl = 0.94 + 0.06 * Math.sin(t * 9);
    c.save(); c.globalCompositeOperation = 'lighter'; poly(c, [[1146, 172], [1230, 152], [1233, 296], [1149, 310]], `rgba(255,200,120,${0.6 * fl})`); c.restore();
    glow(c, 1188, 232, 190, '255,190,110', 0.4 * fl); glow(c, 1150, 330, 150, '255,186,105', 0.2 * fl, 0.4);
    // Martín, detrás da varanda: só asoma de ombreiros arriba
    c.save(); c.beginPath(); c.moveTo(RAIL[0][0], RAIL[0][1]); c.lineTo(RAIL[1][0], RAIL[1][1]); c.lineTo(RAIL[1][0], 0); c.lineTo(RAIL[0][0], 0); c.closePath(); c.clip();
    spr(c, SIL, 0, MX, 356, 118, false); c.globalAlpha = 0.5; spr(c, IM.martin, 0, MX, 356, 118, false); c.globalAlpha = 1; c.restore();
    glow(c, MX, 262, 30, '255,200,130', 0.18);
    // as ondas péchanse sobre o balcón
    for (let n = 0; n < 3; n++) { const p = (u - 0.6 - n * 1.25) / 2.2; if (p > 0 && p < 1) rings(c, MX, 270, lerp(520, 26, p), 0.3 * Math.sin(p * Math.PI), 1, 34); }
    c.restore();
    fogBand(c, t, 330, 220, 12, 0.2, 41);
    vignette(c, 0.9);
  }
  /* 8 · de volta á rotonda. Cando xa ninguén mira, da cheminea da Mikado sobe un fío de vapor */
  const CH = [1218, 350];
  function s8(c, u, t) {
    const k = ease(clamp(u / 5.6));
    rotonda(c, t, lerp(1080, 1180, k), lerp(450, 400, k), lerp(1.7, 2.35, k));
    for (let i = 0; i < 20; i++) { const ph = ((t * 0.22 + i / 20) % 1), born = ss(1.1 + i * 0.05, 2.2 + i * 0.05, u); if (!born) continue;
      const x = CH[0] - ph * ph * 70 + Math.sin(ph * 7 + i) * (2 + ph * 12), y = CH[1] - ph * 190; puff(c, x, y, 6 + ph * 26, '214,222,244', 0.42 * born * ss(0, 0.06, ph) * Math.pow(1 - ph, 1.3)); }
    glow(c, CH[0], CH[1] - 8, 26, '190,208,255', 0.16 * ss(1.4, 3, u));
    c.restore();
    fogBand(c, t, 40, 230, 10, 0.34, 9); fogBand(c, t, 320, 240, -16, 0.42, 10);
    vignette(c, 0.86 + 0.1 * k);
  }
  /* 9 · o rótulo */
  function s9(c, u, t) {
    c.fillStyle = '#030408'; c.fillRect(0, 0, W, H);
    glow(c, W / 2, 240, 520, '60,80,140', 0.3 * ss(0, 2, u));
    const out = 1 - ss(6.6, 7.3, u);
    c.textAlign = 'center'; c.textBaseline = 'alphabetic';
    c.globalAlpha = ss(0.4, 1.2, u) * out; c.fillStyle = '#f2ead8'; c.font = `700 30px ${MONO}`; c.fillText('F I N   D O   A C T O   1', W / 2, 190);
    c.globalAlpha = ss(1.0, 2.2, u) * out; c.fillStyle = '#f2a33a'; c.font = '900 92px Georgia, serif'; c.fillText('O REGRESO', W / 2, 284);
    const rw = 300 * ss(1.4, 3, u); c.fillStyle = '#f2ead8'; c.fillRect(W / 2 - rw, 312, rw * 2, 3); c.fillRect(W / 2 - rw, 324, rw * 2, 3);
    for (let x = W / 2 - rw + 8; x < W / 2 + rw - 4; x += 22) c.fillRect(x, 308, 5, 23);
    c.font = 'italic 27px Georgia, serif'; c.fillStyle = '#f2ead8';
    c.globalAlpha = ss(3.0, 3.8, u) * out; c.fillText('O asubío ten enderezo: a Casa Juana.', W / 2, 390);
    c.globalAlpha = ss(4.2, 5.0, u) * out; c.fillStyle = '#f2a33a'; c.font = 'italic 700 30px Georgia, serif'; c.fillText('Mañá, primeira quenda no depósito.', W / 2, 434);
    c.globalAlpha = 1;
    for (let i = 0; i < 26; i++) { const q = clamp((u - R(i + 5) * 0.6) / 3.6), dx = (R(i) - 0.5) * 2; puff(c, W / 2 + dx * (180 + q * 400), 250 + (R(i + 20) - 0.5) * 150 - q * 90, 80 + R(i + 9) * 100 + q * 80, '214,222,244', 0.3 * (1 - q) * ss(0, 0.6, u)); }
  }

  const SHOTS = [[T.s1, s1, 0.6, 0.5], [T.s2, s2, 0.9, 0.5], [T.s3, s3, 0, 0], [T.s4, s4, 0.5, 0.4], [T.s5, s5, 0.4, 0.5], [T.s6, s6, 0.6, 0.6], [T.s7, s7, 0.6, 0.7], [T.s8, s8, 0.8, 0], [T.s9, s9, 0, 0]];
  const SUBS = [
    ['s7', 2.2, 4.4, 'Martín', 'No pasa por delante de mi casa.'],
    ['s7', 5.0, 7.3, 'Martín', 'Llama a mi casa.'],
  ];
  const overlay = subtitles(SUBS, T, K, { 'Martín': '#ffe08a' });

  /* ================= SON ================= */
  function score({ nz, tone, whistle, bus, master }) {
    // a noite: vento baixo de principio a fin, e grilos ata que soa o asubío
    nz(0, [[2, 0.022], [T.s9, 0.022], [T.s9 + 1.5, 0]], 'bandpass', 380, 0.6);
    for (let i = 0; i < 22; i++) { const at = 0.5 + i * 0.24 + R(i) * 0.05; tone(at, [[0.01, 0.018], [0.05, 0]], 4300 + R(i) * 300, 'sine'); }
    for (let i = 0; i < L1.length; i++) if (L1[i] !== ' ') nz(0.7 + i * 0.11, [[0.003, 0.2], [0.04, 0]], 'bandpass', 2600 + R(i) * 900, 2);
    // a rotonda: un zunido grave, e o primeiro asubío, que non sae de ningures
    tone(T.s2, [[2, 0.07], [7, 0.07], [9, 0]], 55, 'sine'); tone(T.s2, [[2, 0.03], [8, 0]], 82.4, 'triangle');
    whistle(T.s2 + WH1, 0.26, bus(1700, true));
    // o asubío cruza a vila: en cada rúa un eco máis apagado, o zunido dos farois e un can
    for (let i = 0; i < 3; i++) { const at = T.s3 + i * SEG; whistle(at + 0.25, [0.08, 0.06, 0.07][i], bus([900, 750, 900][i], true));
      nz(at + 0.5, [[0.8, 0.07], [1.6, 0]], 'bandpass', 300, 0.8, master, 1200);
      for (let j = 0; j < 9; j++) nz(at + 0.6 + j * 0.16 + R(i * 9 + j) * 0.05, [[0.004, 0.07], [0.05, 0]], 'bandpass', 5200, 8); }
    for (const dt of [0, 0.3, 0.75]) { const at = T.s3 + SEG + 1.7 + dt; tone(at, [[0.015, 0.09], [0.13, 0]], 520, 'sawtooth', 300, bus(1200, true).lp); }
    // o dormitorio: o cristal que treme, o corazón, o interruptor
    whistle(T.s4 + 0.9, 0.13, bus(1100, true));
    for (let i = 0; i < 26; i++) nz(T.s4 + 1.0 + i * 0.1, [[0.004, 0.06], [0.04, 0]], 'bandpass', 1900 + R(i) * 500, 9);
    for (let i = 0; i < 6; i++) { const at = T.s4 + 3.0 + i * 0.5; tone(at, [[0.01, 0.3], [0.14, 0]], 62, 'sine', 44); tone(at + 0.17, [[0.01, 0.2], [0.12, 0]], 56, 'sine', 40); }
    nz(T.s4 + LON, [[0.003, 0.3], [0.03, 0]], 'bandpass', 2200, 3); for (const f of [220, 277.2]) tone(T.s4 + LON + 0.1, [[0.6, 0.035], [2.6, 0]], f, 'triangle');
    // o salón: pasos descalzos na madeira, e o peche do balcón
    for (let i = 0; i < 8; i++) { const at = T.s5 + 0.5 + i * 0.52; tone(at, [[0.01, 0.12], [0.1, 0]], 86, 'sine', 58); if (i % 3 === 1) tone(at + 0.03, [[0.03, 0.03], [0.22, 0]], 380 + R(i) * 120, 'sawtooth', 300, bus(900, false).lp); }
    nz(T.s5 + OPEN - 0.1, [[0.003, 0.3], [0.04, 0]], 'bandpass', 1500, 3); tone(T.s5 + OPEN, [[0.05, 0.03], [0.6, 0]], 240, 'sawtooth', 330, bus(800, false).lp);
    nz(T.s5 + OPEN, [[0.8, 0.06], [T.s8 - T.s5 - OPEN, 0.05], [T.s8 - T.s5 - OPEN + 1, 0]], 'bandpass', 620, 0.5);
    // o balcón: o segundo asubío, máis preto, e os farois que se apagan un a un
    tone(T.s6, [[2, 0.06], [9, 0.11], [10.5, 0.05]], 49, 'sine'); tone(T.s6 + 2, [[3, 0.03], [8.5, 0]], 73.4, 'triangle');
    whistle(T.s6 + WH2, 0.32, bus(2100, true));
    VL.map(([x, y]) => Math.hypot(x - VC[0], (y - VC[1]) / VSY)).forEach((d, i) => { const at = T.s6 + WH2 + 0.3 + d / 250 + 0.25; if (at < T.s7) { nz(at, [[0.003, 0.14], [0.04, 0]], 'bandpass', 3000, 6); tone(at, [[0.01, 0.05], [0.5, 0]], 880 - i * 34, 'sine', 500 - i * 20); } });
    // a Casa Roja: as ondas que se pechan e, cando o di, un acorde menor
    tone(T.s7, [[1, 0.08], [7.6, 0.08], [9, 0]], 55, 'sine');
    for (let n = 0; n < 3; n++) nz(T.s7 + 0.6 + n * 1.25, [[1.8, 0.05], [2.2, 0]], 'bandpass', 1400, 1.2, master, 260);
    whistle(T.s7 + 0.4, 0.05, bus(700, true));
    for (const [f, v] of [[73.4, 0.14], [110, 0.1], [146.8, 0.08], [174.6, 0.06]]) tone(T.s7 + 5.0, [[0.8, v], [2.2, v * 0.8], [3.4, 0]], f, 'triangle');
    // a Mikado: o vapor, moi quedo, e un golpe ao cortar
    nz(T.s8 + 1.2, [[1.5, 0.05], [4.2, 0.07], [4.4, 0]], 'highpass', 4200, 0.7);
    tone(T.s8 + 1.2, [[2, 0.05], [4.3, 0.07], [4.4, 0]], 41, 'sine');
    // rótulo: golpe grave, acorde, e o asubío moi lonxe
    tone(T.s9, [[0.02, 0.7], [3, 0]], 55, 'sine', 36); nz(T.s9, [[0.02, 0.3], [1.1, 0]], 'lowpass', 160);
    for (const [f, v] of [[73.4, 0.16], [110, 0.11], [146.8, 0.08], [220, 0.05]]) tone(T.s9 + 0.4, [[1.2, v], [5, v * 0.7], [6.9, 0]], f, 'triangle');
    whistle(T.s9 + 3.4, 0.1, bus(1000, true));
  }

  const FILM = { T, SHOTS, K, prepare, score, overlay, day: '' };
  return { film: FILM, T, play: (o = {}) => CINE.play({ day: false, ...o, film: FILM }), frame: t => CINE.frame(t, FILM) };
})();
