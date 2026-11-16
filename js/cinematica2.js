'use strict';
/* ==========================================================
   VÍA MORTA · cinemática de inicio do Acto 2 «Primeira quenda» (guion A)
   Ficha: docs/05_FICHAS_ESCENARIOS.md (C2). Guion: docs/07_CINEMATICA_ACTO2_GUION.md.
   - Usa o reprodutor e as ferramentas de js/cinematica.js (CINE.kit): lenzo de 960×540,
     cada plano é unha función pura do tempo e CINE2.frame(t) debuxa o fotograma do segundo t.
   - Ilustracións de Oscar animadas por riba: a rotonda (img/portada-rotonda.jpg, pasada a amencer)
     e a fachada das cocheras (img/bg-cocheras.jpg). Martín e Xoán son os sprites do xogo.
   - PROVISIONAL ata que Oscar o debuxe: o plano do chan (carril engraxado e pegadas), feito por código,
     e o primeiro plano do candado, que é unha ampliación da fachada.
   - Non se di de que tipo é o candado (no debuxo é de chave; o Acto 3 decidirá).
   Martín fala en castelán; Xoán, en galego; os rótulos, en galego.
   ========================================================== */
const CINE2 = (() => {
  const { W, H, OUT, MONO, TAU, clamp, lerp, ss, ease, R, poly, rrect, disc, line, glow, puff, fogBand, vignette, cam, typed, load, bakeNight, WHP } = CINE.kit;
  const K = 1.15;
  const DUR = [4.6, 7.5, 8.5, 7.5, 8, 9.2, 7, 7.4];
  const T = {}; { let a = 0; DUR.forEach((d, i) => { T['s' + (i + 1)] = a; a += d * K; }); T.end = a; }
  const IW = 1779, IH = 884;                       // bg-cocheras.jpg
  const DOOR = { x: 1362, top: 478, bot: 697 }, LOCK = { x: 1362, y: 586 }, CLOCK = { x: 1362, y: 203 };
  const MSPEC = { cw: 150, ch: 203, cols: 8 }, XSPEC = { cw: 160, ch: 280, cols: 8 };
  let IM = {}, DAWN = null, ready = null;

  function prepare() {
    if (ready) return ready;
    ready = (async () => {
      const [ro, co, ma, xo] = await Promise.all(['img/portada-rotonda.jpg', 'img/bg-cocheras.jpg', 'img/martin-sprite.png', 'img/xoan-sprite.png'].map(load));
      IM = { rotonda: ro, cocheras: co, martin: ma, xoan: xo };
      // a rotonda ao amencer: azul frío e o primeiro sol entrando pola dereita
      if (ro) DAWN = bakeNight(ro, '#5d5a92', l => { glow(l, 1500, 120, 1100, '255,190,140', 0.8); glow(l, 1250, 420, 520, '255,170,120', 0.45); });
    })();
    return ready;
  }

  /* ---------- utilidades ---------- */
  function spr(c, im, sp, idx, x, y, h, flip) {
    if (!im) return;
    const w = h * sp.cw / sp.ch, sx = (idx % sp.cols) * sp.cw, sy = Math.floor(idx / sp.cols) * sp.ch;
    c.save(); c.fillStyle = 'rgba(20,16,30,.28)'; c.beginPath(); c.ellipse(x, y - 2, w * 0.3, h * 0.035, 0, 0, TAU); c.fill();
    c.translate(x, y); if (flip) c.scale(-1, 1); c.imageSmoothingEnabled = true; c.drawImage(im, sx, sy, sp.cw, sp.ch, -w / 2, -h, w, h); c.restore();
  }
  /* a fachada das cocheras, coa cámara sen saírse da imaxe */
  function facade(c, cx, cy, z) {
    const s = W / IW * z, hw = W / 2 / s, hh = (H / 2 - 34) / s;
    cx = clamp(cx, hw, IW - hw); cy = clamp(cy, hh, IH - hh);
    cam(c, IW, cx, cy, z);
    if (IM.cocheras) c.drawImage(IM.cocheras, 0, 0); else { c.fillStyle = '#e9a93a'; c.fillRect(0, 0, IW, IH); }
  }
  /* o reloxo do frontón marca a hora que lle digan (tápanse as agullas pintadas) */
  function clock(c, hours) {
    c.save(); c.translate(CLOCK.x, CLOCK.y); disc(c, 0, 0, 13.5, '#f1ead8');
    const hand = (v, len, lw) => { const a = v * TAU - Math.PI / 2; line(c, 0, 0, Math.cos(a) * len, Math.sin(a) * len, '#1d1a16', lw); };
    hand((hours % 12) / 12, 7.5, 2.6); hand(hours % 1, 11.5, 1.7); disc(c, 0, 0, 1.6, '#1d1a16'); c.restore();
  }
  const hhmm = h => { const m = Math.round(h * 60); return String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0'); };
  function tint(c, r, g, b) { c.save(); c.globalCompositeOperation = 'multiply'; c.fillStyle = `rgb(${r | 0},${g | 0},${b | 0})`; c.fillRect(0, 0, W, H); c.restore(); }
  /* estrela de brillo */
  function glint(c, x, y, r, a, rot = 0) {
    if (a <= 0) return;
    c.save(); c.globalCompositeOperation = 'lighter'; c.translate(x, y); c.rotate(rot); c.fillStyle = `rgba(255,252,230,${a})`;
    for (let i = 0; i < 4; i++) { c.rotate(Math.PI / 2); c.beginPath(); c.moveTo(0, -r); c.quadraticCurveTo(r * 0.08, -r * 0.08, r * 0.16, 0); c.quadraticCurveTo(r * 0.08, r * 0.08, 0, 0); c.quadraticCurveTo(-r * 0.08, -r * 0.08, -r * 0.16, 0); c.closePath(); c.fill(); }
    c.restore(); glow(c, x, y, r * 0.8, '255,244,200', a * 0.6);
  }

  /* ================= PLANOS ================= */
  /* 1 · negro que clarea e a hora a máquina */
  const L1 = 'Martes, 6:40', L2 = 'Primeira quenda no depósito';
  function s1(c, u, t) {
    const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#060914'); g.addColorStop(1, `rgb(${lerp(8, 70, ss(0, 4.6, u)) | 0},${lerp(10, 52, ss(0, 4.6, u)) | 0},${lerp(22, 78, ss(0, 4.6, u)) | 0})`);
    c.fillStyle = g; c.fillRect(0, 0, W, H);
    glow(c, W / 2, H + 60, 620, '255,170,110', 0.4 * ss(0.5, 4.6, u), 0.5);
    for (let i = 0; i < 40; i++) disc(c, R(i) * W, 40 + R(i + 50) * 300, 0.7 + R(i + 9), `rgba(230,236,255,${(0.2 + R(i + 20) * 0.5) * (1 - ss(1, 4.4, u))})`);
    const n1 = Math.floor(clamp((u - 0.6) / 0.085, 0, L1.length)), n2 = Math.floor(clamp((u - 1.9) / 0.06, 0, L2.length));
    typed(c, L1, n1, W / 2, 250, 50, '#f2ead8', 3); typed(c, L2, n2, W / 2, 310, 30, '#f2a33a', 40);
  }
  /* 2 · a Mikado na rotonda, ao amencer: a néboa levanta e a cámara achégase */
  function s2(c, u, t) {
    const k = ease(clamp(u / 7.5)), sun = ss(0.5, 7, u);
    c.fillStyle = '#0b0d1c'; c.fillRect(0, 0, W, H);
    c.save(); cam(c, 1536, lerp(790, 900, k), lerp(520, 500, k), lerp(1.06, 1.6, k));
    if (IM.rotonda) c.drawImage(IM.rotonda, 0, 0);
    if (DAWN) { c.globalAlpha = 1 - 0.8 * sun; c.drawImage(DAWN, 0, 0); c.globalAlpha = 1; }
    // o sol rabuña o lombo da caldeira e as ventás da cabina
    glow(c, lerp(1300, 1050, k), 430, 170, '255,214,150', 0.3 * sun, 0.3); glow(c, 840, 475, 46, '255,220,160', 0.35 * sun * (0.8 + 0.2 * Math.sin(t * 2)));
    c.restore();
    glow(c, W + 40, 60, 700, '255,196,130', 0.3 * sun);
    const fa = 1 - 0.75 * sun;
    fogBand(c, t, 60, 240, 10, 0.55 * fa, 21); fogBand(c, t, 260, 260, -15, 0.6 * fa, 22); fogBand(c, t, 380, 200, 22, 0.45 * fa, 23);
    vignette(c, 0.6);
  }
  /* 3 · a xornada pasa por diante das cocheras: o reloxo corre, as sombras varren a fachada e Martín vai e vén */
  const PASS = [[0.9, 1.25, 1], [2.5, 1.2, -1], [3.9, 1.15, 1], [5.3, 1.2, -1]];   // inicio, duración, sentido
  const dayP = u => ss(0.4, 7.4, u), dayH = u => lerp(6 + 40 / 60, 15 + 10 / 60, dayP(u));
  function s3(c, u, t) {
    const p = dayP(u), k = ease(clamp(u / 8.5));
    c.save(); facade(c, lerp(640, 1040, k), 500, 1.2);
    clock(c, dayH(u));
    // farois da fachada acesos ata que hai luz
    const la = 1 - ss(0.05, 0.22, p); for (const [x, y] of [[433, 432], [640, 430], [857, 426], [1359, 418]]) { glow(c, x, y + 8, 70, '255,206,120', 0.5 * la); glow(c, x, y + 6, 14, '255,246,214', 0.8 * la); }
    // sombras de nubes a toda velocidade
    c.save(); c.globalCompositeOperation = 'multiply';
    for (let i = 0; i < 5; i++) { const x = ((R(i + 3) * 2600 + u * (520 + R(i) * 380)) % 2600) - 420, y = 380 + R(i + 7) * 380, r = 200 + R(i + 11) * 170; const g = c.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, 'rgba(96,104,150,.5)'); g.addColorStop(1, 'rgba(255,255,255,0)'); c.save(); c.translate(0, y); c.scale(1, 0.5); c.translate(0, -y); c.fillStyle = g; c.fillRect(x - r, y - r, r * 2, r * 2); c.restore(); }
    c.restore();
    // Martín, á présa, coma en todas as primeiras xornadas
    for (const [a, d, dir] of PASS) { const q = (u - a) / d; if (q <= 0 || q >= 1) continue; const x = dir > 0 ? lerp(120, 1820, q) : lerp(1820, 120, q); spr(c, IM.martin, MSPEC, 4 + Math.floor(t * 17) % 6, x, 800, 178, dir < 0); }
    const q = (u - 6.7) / 1.3; if (q > 0) { const x = lerp(700, 1215, ease(clamp(q))); spr(c, IM.martin, MSPEC, q < 1 ? 4 + Math.floor(t * 11) % 6 : 2, x, 800, 178, false); }
    c.restore();
    // a cor do día: do rosa frío do amencer ao sol de mediodía
    const d = 1 - ss(0, 0.4, p); tint(c, lerp(255, 196, d), lerp(255, 160, d), lerp(255, 190, d));
    glow(c, lerp(-60, W + 60, p), lerp(150, 40, Math.sin(p * Math.PI)), 520, '255,214,150', 0.22);
    // o reloxo de fichar, nunha esquina
    c.save(); rrect(c, 40, 52, 156, 54, 8, 'rgba(10,12,18,.82)', '#f2a33a', 2.5); c.fillStyle = '#f2a33a'; c.font = `700 36px ${MONO}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(hhmm(dayH(u)), 118, 81); c.restore();
    vignette(c, 0.45);
  }
  /* 4 · PROVISIONAL (por código): o chan diante da porta dereita. O carril brilla de graxa fresca e hai pegadas */
  const PRINTS = [[742, 492, 0], [690, 432, 1], [706, 366, 0], [654, 312, 1], [668, 254, 0], [622, 214, 1]];
  function boot(c, x, y, left, a, sc) {
    c.save(); c.translate(x, y); c.rotate(-0.32 + (left ? -0.12 : 0.1)); c.scale(sc, sc); c.fillStyle = `rgba(34,26,22,${a})`;
    c.beginPath(); c.ellipse(0, -10, 13, 22, 0, 0, TAU); c.fill(); c.beginPath(); c.ellipse(0, 26, 10.5, 11, 0, 0, TAU); c.fill();
    c.strokeStyle = `rgba(190,170,140,${a * 0.5})`; c.lineWidth = 2; for (let i = -3; i < 3; i++) { c.beginPath(); c.moveTo(-10, -12 + i * 7); c.lineTo(10, -15 + i * 7); c.stroke(); }
    c.restore();
  }
  function s4(c, u, t) {
    const k = ease(clamp(u / 7.5)), z = lerp(1, 1.13, k);
    c.fillStyle = '#8a7558'; c.fillRect(0, 0, W, H);
    c.save(); c.translate(W / 2, 300); c.scale(z, z); c.translate(-W / 2 - lerp(-20, 26, k), -300 + lerp(0, 24, k));
    // parede, zócolo de pedra e persiana
    c.fillStyle = '#e9a93a'; c.fillRect(-80, -40, W + 160, 150);
    rrect(c, -80, 96, W + 160, 100, 0, '#b79a6d', OUT, 4);
    for (let i = 0; i < 30; i++) { const x = -70 + (i % 15) * 74 + (i > 14 ? 34 : 0) + R(i) * 10, y = 102 + (i > 14 ? 46 : 0); rrect(c, x, y, 56 + R(i + 5) * 14, 38, 12, ['#c9ab7a', '#a98c62', '#d6ba8b', '#b3976a'][i % 4], '#5a4630', 2.5); }
    rrect(c, 226, -40, 508, 238, 0, '#a8392b', OUT, 4);
    rrect(c, 252, -40, 456, 232, 0, '#8d919c', OUT, 4);
    for (let y = -30; y < 190; y += 15) { line(c, 254, y, 706, y, '#6d717c', 2.5); line(c, 254, y + 3, 706, y + 3, '#a9adb8', 1.5); }
    c.fillStyle = '#17151a'; c.fillRect(252, 190, 456, 9);
    // pavimento con xuntas en perspectiva
    const pg = c.createLinearGradient(0, 198, 0, 560); pg.addColorStop(0, '#a48c69'); pg.addColorStop(1, '#c7b08a'); c.fillStyle = pg; c.fillRect(-80, 198, W + 160, 380);
    for (let i = 0; i < 6; i++) { const y = 198 + Math.pow(i / 6, 1.7) * 360 + 30; line(c, -80, y, W + 80, y, 'rgba(90,70,48,.4)', 2); }
    for (let i = -6; i < 12; i++) line(c, 480 + (i - 2.5) * 60, 198, 480 + (i - 2.5) * 190, 580, 'rgba(90,70,48,.3)', 2);
    // sombra do alpendre
    const sg = c.createLinearGradient(0, 198, 0, 300); sg.addColorStop(0, 'rgba(40,30,40,.42)'); sg.addColorStop(1, 'rgba(40,30,40,0)'); c.fillStyle = sg; c.fillRect(-80, 198, W + 160, 110);
    // pegadas: van aparecendo cara á porta
    PRINTS.forEach(([x, y, l], i) => { const a = ss(3.3 + i * 0.3, 3.7 + i * 0.3, u); if (a > 0) boot(c, x, y, l, 0.62 * a * (1 - i * 0.07), 0.7 + (y - 200) / 600); });
    // os dous carrís saen de debaixo da persiana
    for (const [xt, xb, sd] of [[402, 250, -1], [558, 710, 1]]) {
      poly(c, [[xt - 9, 196], [xt + 9, 196], [xb + 26, 580], [xb - 26, 580]], '#3a3230', OUT, 3);          // gorxa
      poly(c, [[xt - 5, 196], [xt + 5, 196], [xb + 15, 580], [xb - 15, 580]], '#7d828e');                  // cabeza do carril
      poly(c, [[xt - 1.5, 196], [xt + 2, 196], [xb + 6, 580], [xb - 4, 580]], '#c3c8d4');
      // graxa fresca: película escura e un brillo que escorrega
      poly(c, [[xt - 4, 196], [xt + 1, 196], [xb + 2, 580], [xb - 13, 580]], 'rgba(28,22,16,.5)');
      for (let j = 0; j < 2; j++) { const ph = ((t * 0.22 + j * 0.5 + (sd > 0 ? 0.3 : 0)) % 1), y = lerp(200, 570, ph), x = lerp(xt, xb, (y - 196) / 384), w = 4 + ph * 9; glow(c, x, y, 26 + ph * 40, '255,246,214', 0.5 * Math.sin(ph * Math.PI)); c.save(); c.globalCompositeOperation = 'lighter'; c.fillStyle = `rgba(255,250,230,${0.75 * Math.sin(ph * Math.PI)})`; c.beginPath(); c.ellipse(x, y, w, 22 + ph * 30, sd * -0.38, 0, TAU); c.fill(); c.restore(); }
    }
    // pingas de graxa ao pé do carril esquerdo
    for (const [x, y, r] of [[330, 372, 13], [352, 398, 7], [296, 452, 17], [318, 300, 8], [274, 500, 9]]) { c.fillStyle = 'rgba(30,22,16,.78)'; c.beginPath(); c.ellipse(x, y, r * 1.5, r * 0.62, 0, 0, TAU); c.fill(); c.fillStyle = 'rgba(255,240,200,.5)'; c.beginPath(); c.ellipse(x - r * 0.4, y - r * 0.18, r * 0.42, r * 0.14, 0, 0, TAU); c.fill(); }
    // unha pinga que cae da persiana
    { const ph = (t * 0.55) % 1; if (ph < 0.5) disc(c, 404, 200 + ph * ph * 150, 3.2, '#1c1612'); else { c.strokeStyle = `rgba(28,22,16,${1 - (ph - 0.5) * 2})`; c.lineWidth = 2; c.beginPath(); c.ellipse(404, 240, (ph - 0.5) * 34, (ph - 0.5) * 12, 0, 0, TAU); c.stroke(); } }
    c.restore();
    vignette(c, 0.6);
  }
  /* 5 · a cámara sobe pola persiana ata o candado novo (ampliación da ilustración; provisional) */
  function s5(c, u, t) {
    const k = ease(clamp(u / 3.6)), hit = u - 3.7, j = hit > 0 ? Math.exp(-hit * 7) : 0;
    c.fillStyle = '#0b0d1c'; c.fillRect(0, 0, W, H);
    c.save(); c.translate(Math.sin(t * 80) * 3 * j, Math.cos(t * 67) * 3 * j); c.imageSmoothingQuality = 'high';
    facade(c, LOCK.x, lerp(700, LOCK.y - 4, k), lerp(2.3, 3.7 + 0.15 * ss(3.6, 8, u), k) + 0.12 * j);
    // o sol escorrega pola chapa, e o candado brilla
    glow(c, LOCK.x - 4, LOCK.y + 8, 44, '255,236,170', 0.22 + 0.1 * Math.sin(t * 2.2));
    const g1 = ss(3.6, 3.8, u) * (1 - ss(4.3, 5.2, u)), g2 = 0.5 + 0.5 * Math.sin(t * 2.6);
    glint(c, LOCK.x - 9, LOCK.y - 2, 30 + 18 * g1, 0.95 * g1, t * 0.6); glint(c, LOCK.x + 8, LOCK.y + 14, 9, 0.5 * g2 * ss(4.6, 5.4, u), 0.4);
    c.restore();
    vignette(c, 0.55 + 0.25 * k);
  }
  /* 6 · Xoán pasa, Martín pregunta, Xoán bótalle terra ao asunto e marcha */
  function s6(c, u, t) {
    const k = ease(clamp(u / 9.2));
    c.fillStyle = '#0b0d1c'; c.fillRect(0, 0, W, H);
    c.save(); facade(c, lerp(1300, 1345, k), 640, lerp(1.95, 2.08, k));
    clock(c, 14.9);
    const tm = u > 1.9 && u < 3.3 || u > 7.3 && u < 9;                                // Martín fala
    spr(c, IM.martin, MSPEC, 2, 1172, 806, 186, false);
    if (tm) { c.fillStyle = 'rgba(255,255,255,.9)'; for (let i = 0; i < 3; i++) disc(c, 1196 + i * 9, 606 - Math.abs(Math.sin(t * 7 + i)) * 6, 2.6, 'rgba(255,255,255,.9)'); }
    // Xoán: entra pola dereita, para, e volve por onde veu
    let xx, fr, flip;
    if (u < 1.7) { xx = lerp(1800, 1500, u / 1.7); fr = XW[Math.floor(t * 7) % XW.length]; flip = true; }
    else if (u < 6.1) { xx = 1500; fr = XI; flip = XIF; }
    else { xx = lerp(1500, 1830, clamp((u - 6.1) / 2.3)); fr = XW[Math.floor(t * 8) % XW.length]; flip = false; }
    spr(c, IM.xoan, XSPEC, fr, xx, 808, 196, flip);
    c.restore();
    tint(c, 255, 240, 222); vignette(c, 0.5);
  }
  const XW = [24, 25, 26, 27, 28], XI = 2, XIF = true;     // Xoán: paso cara á dereita e parado de perfil
  /* 7 · fin da quenda: a tarde, a fachada enteira e Martín que marcha */
  function s7(c, u, t) {
    const k = ease(clamp(u / 7));
    c.fillStyle = '#0b0d1c'; c.fillRect(0, 0, W, H);
    c.save(); facade(c, lerp(1300, 890, k), lerp(600, 480, k), lerp(1.9, 1.14, k));
    clock(c, 15 + 10 / 60 + u / 600);
    const q = clamp((u - 0.6) / 6); spr(c, IM.martin, MSPEC, 4 + Math.floor(t * 8) % 6, lerp(1172, 420, q), 812, 178, true);
    c.restore();
    tint(c, 255, 226, 196); glow(c, -40, 120, 640, '255,190,120', 0.3);
    vignette(c, 0.55);
  }
  /* 8 · o rótulo do acto */
  function s8(c, u, t) {
    c.fillStyle = '#030408'; c.fillRect(0, 0, W, H);
    glow(c, W / 2, 240, 520, '120,80,40', 0.3 * ss(0, 2, u));
    const out = 1 - ss(6.6, 7.3, u);
    c.textAlign = 'center'; c.textBaseline = 'alphabetic';
    c.globalAlpha = ss(0.4, 1.2, u) * out; c.fillStyle = '#f2ead8'; c.font = `700 30px ${MONO}`; c.fillText('A C T O   2', W / 2, 190);
    c.globalAlpha = ss(1.0, 2.2, u) * out; c.fillStyle = '#f2a33a'; c.font = '900 86px Georgia, serif'; c.fillText('O REENCONTRO', W / 2, 282);
    const rw = 330 * ss(1.4, 3, u); c.fillStyle = '#f2ead8'; c.fillRect(W / 2 - rw, 310, rw * 2, 3); c.fillRect(W / 2 - rw, 322, rw * 2, 3);
    for (let x = W / 2 - rw + 8; x < W / 2 + rw - 4; x += 22) c.fillRect(x, 306, 5, 23);
    c.font = 'italic 27px Georgia, serif'; c.fillStyle = '#f2ead8';
    c.globalAlpha = ss(3.0, 3.8, u) * out; c.fillText('Os de sempre seguen onde estaban.', W / 2, 388);
    c.globalAlpha = ss(4.2, 5.0, u) * out; c.fillStyle = '#f2a33a'; c.font = 'italic 700 30px Georgia, serif'; c.fillText('E algún sabe quen asubía de noite.', W / 2, 432);
    c.globalAlpha = 1;
    for (let i = 0; i < 26; i++) { const q = clamp((u - R(i + 5) * 0.6) / 3.6), dx = (R(i) - 0.5) * 2; puff(c, W / 2 + dx * (180 + q * 400), 250 + (R(i + 20) - 0.5) * 150 - q * 90, 80 + R(i + 9) * 100 + q * 80, '214,222,244', 0.34 * (1 - q) * ss(0, 0.6, u)); }
  }

  const SHOTS = [[T.s1, s1, 0.6, 0.6], [T.s2, s2, 0.8, 0.6], [T.s3, s3, 0.6, 0.4], [T.s4, s4, 0.4, 0], [T.s5, s5, 0, 0.5], [T.s6, s6, 0.5, 0.5], [T.s7, s7, 0.5, 1], [T.s8, s8, 0, 0]];

  /* ---------- subtítulos: [plano, inicio, fin (segundos de guion), quen, texto] ---------- */
  const SUBS = [
    ['s2', 1.2, 4.0, 'Martín', 'Buenos días, vieja. Anoche alguien silbó igualito que tú.'],
    ['s2', 4.3, 7.3, 'Martín', 'No me mires así. Yo solo vengo a trabajar.'],
    ['s3', 1.0, 4.4, 'Martín', 'Ocho horas de engrasar, apretar y barrer.'],
    ['s3', 4.7, 8.3, 'Martín', 'Y un compañero que no dice ni mu hasta las diez.'],
    ['s4', 0.7, 3.5, 'Martín', 'Por este carril no pasa un tren desde hace años... y está recién engrasado.'],
    ['s4', 4.2, 7.3, 'Martín', 'Y esas pisadas no son mías. Yo calzo menos.'],
    ['s5', 0.8, 3.5, 'Martín', 'La puerta del taller. Dicen que lleva años sin abrirse.'],
    ['s5', 4.0, 7.8, 'Martín', 'Pues hoy tiene candado nuevo. Ni una mota de polvo.'],
    ['s6', 1.9, 3.3, 'Martín', 'Xoán, ¿y ese candado?'],
    ['s6', 3.6, 6.1, 'Xoán', 'Iso? Cousas do museo. Ti ao teu, rapaz, que é o primeiro día.'],
    ['s6', 7.3, 9.0, 'Martín', '«Cosas del museo». Ya. Y yo soy el AVE.'],
    ['s7', 0.5, 3.3, 'Martín', 'Nadie le pone un candado a una puerta que no se abre.'],
    ['s7', 3.6, 6.7, 'Martín', 'Hoy toca ver a los de siempre. Alguno sabrá quién silba de noche.'],
  ];
  const WHO = { 'Martín': '#ffe08a', 'Xoán': '#9fd2ff' };
  function wrap(c, txt, max) { const out = []; let ln = ''; for (const w of txt.split(' ')) { const tr = ln ? ln + ' ' + w : w; if (c.measureText(tr).width > max && ln) { out.push(ln); ln = w; } else ln = tr; } out.push(ln); return out; }
  function overlay(c, t) {
    for (const [sh, a, b, who, txt] of SUBS) {
      const t0 = T[sh] + a * K, t1 = T[sh] + b * K; if (t < t0 || t > t1) continue;
      const al = Math.min(clamp((t - t0) / 0.2), clamp((t1 - t) / 0.2));
      c.globalAlpha = al; c.textAlign = 'center'; c.textBaseline = 'alphabetic'; c.font = '700 27px "Trebuchet MS", Verdana, sans-serif';
      const ls = wrap(c, txt, 820), lh = 34, y0 = H - 52 - (ls.length - 1) * lh;
      let bw = 0; for (const l of ls) bw = Math.max(bw, c.measureText(l).width);
      rrect(c, W / 2 - bw / 2 - 22, y0 - 62, bw + 44, ls.length * lh + 46, 12, 'rgba(8,10,16,.72)');
      c.font = '700 17px "Trebuchet MS", Verdana, sans-serif'; c.fillStyle = WHO[who]; c.fillText(who.toUpperCase(), W / 2, y0 - 38);
      c.font = '700 27px "Trebuchet MS", Verdana, sans-serif'; c.lineJoin = 'round'; c.lineWidth = 5; c.strokeStyle = 'rgba(0,0,0,.85)'; c.fillStyle = '#fff';
      ls.forEach((l, i) => { c.strokeText(l, W / 2, y0 - 6 + i * lh); c.fillText(l, W / 2, y0 - 6 + i * lh); });
      c.globalAlpha = 1;
    }
  }

  /* ================= SON ================= */
  function score({ nz, tone, whistle, bus, master }) {
    const chirp = (at, f, v = 0.05) => { tone(at, [[0.02, v], [0.09, 0]], f, 'sine', f * 1.35); tone(at + 0.12, [[0.02, v * 0.8], [0.08, 0]], f * 1.2, 'sine', f * 0.9); };
    // amencer: brisa e paxaros
    nz(0, [[1.5, 0.03], [T.s3, 0.03], [T.s3 + 2, 0.012], [T.s8, 0.012], [T.s8 + 1, 0]], 'bandpass', 520, 0.7);
    for (let i = 0; i < 26; i++) chirp(0.4 + i * 0.52 + R(i) * 0.4, 2300 + R(i + 9) * 1900, 0.03 + R(i + 4) * 0.03);
    // a hora, a máquina
    for (let i = 0; i < L1.length; i++) if (L1[i] !== ' ') nz(K * (0.6 + i * 0.085), [[0.003, 0.2], [0.04, 0]], 'bandpass', 2600 + R(i) * 900, 2);
    for (let i = 0; i < L2.length; i++) if (L2[i] !== ' ') nz(K * (1.9 + i * 0.06), [[0.003, 0.18], [0.04, 0]], 'bandpass', 2600 + R(i + 9) * 900, 2);
    // a Mikado: un acorde quedo, coma se respirase
    for (const [f, v] of [[98, 0.08], [146.8, 0.06], [196, 0.04]]) tone(T.s2 + 0.5, [[2, v], [7.5 * K - 1.5, v * 0.8], [7.5 * K, 0]], f, 'triangle');
    // a xornada: o reloxo que corre e o taller (martelo, chave, vasoira)
    for (let i = 0; i < 44; i++) { const at = T.s3 + 0.5 * K + i * 0.19; nz(at, [[0.003, 0.09], [0.03, 0]], 'bandpass', i % 2 ? 2100 : 2700, 6); }
    for (const dt of [1.1, 1.45, 1.8, 4.1, 4.45]) { tone(T.s3 + dt * K, [[0.004, 0.16], [0.25, 0]], 1320, 'triangle', 1250); nz(T.s3 + dt * K, [[0.003, 0.2], [0.05, 0]], 'bandpass', 1800, 2); }
    for (const dt of [2.7, 3.2, 5.6, 6.1]) nz(T.s3 + dt * K, [[0.12, 0.07], [0.4, 0]], 'highpass', 3200);
    for (const [f, dt] of [[392, 0.6], [494, 2.3], [587, 4], [494, 5.7], [392, 7.2]]) tone(T.s3 + dt * K, [[0.03, 0.05], [1.2, 0]], f, 'triangle');
    // o chan: silencio, un zunido grave e a pinga de graxa
    tone(T.s4, [[1.2, 0.07], [(7.5 + 8) * K - 1, 0.09], [(7.5 + 8) * K, 0]], 55, 'sine'); tone(T.s4, [[2, 0.03], [(7.5 + 8) * K, 0]], 82.4, 'triangle');
    for (let i = 0; i < 7; i++) tone(T.s4 + 0.9 + i * 1.82, [[0.004, 0.12], [0.12, 0]], 620, 'sine', 240);
    for (let i = 0; i < PRINTS.length; i++) { const at = T.s4 + (3.3 + i * 0.3) * K; tone(at, [[0.01, 0.1], [0.1, 0]], 90, 'sine', 60); }
    // o candado: brillo e golpe
    { const at = T.s5 + 3.7 * K; for (const f of [1568, 2349, 3136]) tone(at, [[0.004, 0.09], [1.3, 0]], f); nz(at, [[0.003, 0.3], [0.06, 0]], 'bandpass', 2400, 1.5); tone(at, [[0.01, 0.6], [0.9, 0]], 73.4, 'sine', 50);
      for (const [f, v] of [[146.8, 0.08], [174.6, 0.06], [220, 0.05]]) tone(at + 0.1, [[0.4, v], [4 * K, 0]], f, 'triangle'); }
    // Xoán: pasos que chegan e pasos que marchan
    for (let i = 0; i < 5; i++) { const at = T.s6 + (0.2 + i * 0.33) * K; tone(at, [[0.01, 0.13], [0.1, 0]], 100, 'sine', 64); nz(at, [[0.01, 0.04], [0.08, 0]], 'bandpass', 1400, 1); }
    for (let i = 0; i < 7; i++) { const at = T.s6 + (6.2 + i * 0.31) * K; tone(at, [[0.01, 0.13 - i * 0.012], [0.1, 0]], 100, 'sine', 64); nz(at, [[0.01, 0.04], [0.08, 0]], 'bandpass', 1400, 1); }
    // fin da quenda: a serea e a bucina dun rexional ao lonxe
    { const b = bus(1500, true); for (const f of [311, 370]) tone(T.s7 + 0.3, [[0.08, 0.06], [0.9, 0.06], [1.1, 0]], f, 'sawtooth', null, b.lp); }
    for (const [f, v] of [[110, 0.09], [164.8, 0.07], [220, 0.05], [277.2, 0.04]]) tone(T.s7 + 1.5, [[1.5, v], [7 * K - 2.5, v], [7 * K - 1.5, 0]], f, 'triangle');
    // rótulo: golpe grave, acorde, e o asubío moi lonxe (dous longos e un curto)
    tone(T.s8 + 0.4 * K, [[0.02, 0.7], [3, 0]], 55, 'sine', 36); nz(T.s8 + 0.4 * K, [[0.02, 0.3], [1.1, 0]], 'lowpass', 160);
    for (const [f, v] of [[73.4, 0.18], [110, 0.12], [146.8, 0.09], [220, 0.05]]) tone(T.s8 + 0.4 * K, [[1.2, v], [5 * K, v * 0.7], [7.4 * K - 0.5, 0]], f, 'triangle');
    whistle(T.s8 + 3.2 * K, 0.12, bus(1100, true));
  }

  const FILM = { T, SHOTS, K, prepare, score, overlay, day: 'Martes, 15:10 · Fin da quenda' };
  return { film: FILM, T, play: (o = {}) => CINE.play({ ...o, film: FILM }), frame: t => CINE.frame(t, FILM) };
})();
