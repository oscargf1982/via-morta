'use strict';
/* ==========================================================
   VÍA MORTA · Acto 5 «O descubrimento» (sábado e domingo) · 21-11-2026
   · Rotonda, sábado 20:30 (fondo provisional: a rotonda de noite): media cidade mirando. Puzzle 0: a plataforma xiratoria
     xírase á man entre dous (Martín e Andrés) → a Mikado mira á vía de saída.
   · Cabina (debuxada por código, provisional): procedemento en orde. Sen morte nin volta atrás: as ordes malas só dan broma.
     1 abrir o fogar + pedirlle lume a Andrés → manómetro a 9 kg · 2 inxector · 3 soltar o freo ·
     4 asubío de saída: só hai un tapón → chega Xoán coa mochila e o asubío orixinal (1A) · 5 regulador.
   · A Barreira, 21:40 (fondo provisional: img/cine-mikado.jpg, coa chuvia «coma no 58»): a agulla vella, a chave de guardagullas
     de Pepe (Eladio: «Sorte, rapaz»), o asubío «dous longos e un curto» e a revelación (Xoán, o parte, Anxo, Andrés, Concha).
   · A chamada de Valencia (VALENCIA, js/acto4.js) · Domingo 6:00, o mural con Xoán · Vilatán: caldo e a elección · epílogo (a placa).
   Fichas: docs/05_FICHAS_ESCENARIOS.md, sección «Acto 5». Martín fala en castelán; os NPC, en galego; a interface, en galego.
   ========================================================== */
const NA = t => say('Nai', t);
PORTRAIT_COLORS['Nai'] = '#ffd0b0';
const A5ON = () => flag('a5Inicio') && !flag('fimXogo');

/* ---------- figuras por código ata ter as follas de Oscar ---------- */
// Mega Andrés de pé (a súa folla só o ten deitado na tumbona): camisa de flores, gafas de sol na cabeza e, se leva, a pa
function pintarAndres(c, x, y, h, t, talking, pa) {
  figura(c, x, y, h, { roupa: '#2a4a9a', pernas: '#3a3a44', zapatos: '#e8e8e8', pel: '#d89060', pelo: '#c8903a' }, t, talking);
  const u = h / 100;
  c.save(); c.translate(x, y); c.scale(u, u);
  c.fillStyle = '#e8eef8'; for (const [fx, fy] of [[-7, -74], [5, -70], [-2, -62], [8, -56], [-8, -52], [2, -48]]) { c.beginPath(); c.arc(fx, fy, 1.3, 0, 7); c.fill(); }   // flores brancas, coma o bañador da súa folla
  c.fillStyle = '#111'; c.fillRect(-7, -99, 14, 3);                                                                                                         // gafas na fronte
  if (pa) {
    const sw = E.palaT0 != null && t - E.palaT0 < 2.4 ? Math.sin((t - E.palaT0) * 7) * 0.5 : 0;
    c.save(); c.translate(16, -46); c.rotate(-0.5 + sw); c.strokeStyle = '#6a4a2a'; c.lineWidth = 2.6; c.beginPath(); c.moveTo(0, 0); c.lineTo(0, 46); c.stroke();
    c.fillStyle = '#555'; c.strokeStyle = '#141010'; c.lineWidth = 1.2; c.beginPath(); c.moveTo(-6, 44); c.lineTo(6, 44); c.lineTo(5, 56); c.lineTo(-5, 56); c.closePath(); c.fill(); c.stroke();
    if (sw) { c.fillStyle = '#18181a'; c.beginPath(); c.ellipse(0, 50, 4, 2, 0, 0, 7); c.fill(); }
    c.restore();
  }
  c.restore();
}
const ELADIO_FIG = { roupa: '#5a5e66', pernas: '#3a3e46', zapatos: '#141414', pel: '#e8c0a0', pelo: '#cfcfcf', botons: true };
const andresNpc = (o) => ({ id: 'andres5', name: 'Mega Andrés', key: true, w: 52, h: 340, shadow: true, ...o,
  draw(c, t, talking, s) { pintarAndres(c, this.x, this.y, this.h * s, t, talking, true); } });

/* ---------- obxectos ---------- */
Object.assign(ico, {
  chaveAgulla(c) { c.strokeStyle = '#8a7a5a'; c.lineWidth = 4; c.beginPath(); c.arc(14, 24, 7, 0, 7); c.stroke(); c.fillStyle = '#8a7a5a'; c.fillRect(20, 22, 22, 4); c.fillRect(36, 26, 3, 8); c.fillRect(30, 26, 3, 6);
    c.fillStyle = '#b0201a'; c.fillRect(8, 34, 10, 6); },
});
Object.assign(ITEMS, {
  chaveAgulla: { name: 'Chave de guardagullas', icon: ico.chaveAgulla,
    look: () => MA('Una llave de guardagujas, de hierro, con una chapa roja: «Monforte. Agulla 7». La de Pepe. Eladio la ha guardado cuarenta años en un cajón del Concello.', 'pensativo') },
});

/* ---------- apertura do acto ---------- */
async function inicioActo5() {
  E.act = 'acto5';
  setFlag('a5Inicio');
  await showDoc('<h4>ACTO 5 · «O descubrimento»</h4><p>Sábado, 20:30.</p><p>Media cidade na rotonda do museo. Unha Mikado con lume. E un maquinista que leva unha semana en Monforte.</p><p class="sub">Obxectivo: levar a Mikado ata A Barreira.</p>');
  await goScene('rotondaSabado', [480, 528]);
  await MA('Sábado, ocho y media. Y la rotonda... llena. Concha, Valerio, Genaro, Eladio con su carpeta... Medio Monforte con abrigo y el móvil en la mano.', 'sorprendido');
  await RE('Maquinista! Á cabina non se sobe ata que a máquina mire cara á vía de saída. A plataforma xírase á man. E iso é cousa de dous.');
  toast('Novo obxectivo: xirar a plataforma (a manivela, entre dous)');
}

/* ---------- A7b · Rotonda do sábado (fondo provisional) ---------- */
async function xirarPlataforma() {
  await MA('Andrés, la manivela de la plataforma. Tú de un lado y yo del otro.', 'convencido');
  await AN('Por fin unha cousa que se fai con brazos e sen preguntas.');
  SFX.noise(1.6, 260, 0.4, 0.3, 0, 'lowpass');
  E.xiroT0 = E.t;
  await MA('A la de tres... ¡una... dos... TRES!', 'convencido');
  await sleep(1200);
  await MA('Cruje. Se mueve. La plataforma gira despacio, con ochenta toneladas encima, como un tocadiscos viejo...', 'entusiasmado');
  await sleep(800);
  await MA('...y la Mikado mira a la vía de salida. Como en las fotos de antes.', 'orgulloso');
  setFlag('a5Xirada'); E.xiroT0 = null;
  await say('Xubilada', 'Aplausos, que xirou! Aplausos!');
  await RE('Agora si. Á cabina, maquinista. E ti, Andrés, coa pa.');
  toast('Novo obxectivo: subir á cabina da Mikado');
}
async function andresRotonda() {
  if (flag('a5Xirada')) return AN('Á cabina, Martín. O carbón non se pon só. Ben: ponse, pero non no sitio.');
  const opts = [
    { t: 'Andrés, ayúdame con la manivela de la plataforma.', k: 'xira' },
    { t: '¿Listo para palear?', k: 'pa' },
  ];
  const k = opts[await choose(opts)].k;
  if (k === 'xira') return xirarPlataforma();
  await AN('Listo? Levo toda a vida listo. O que non sabía era para que.');
}
const MANIVELA = [826, 364, 70, 64];
function pintarManivela(c, t) {
  const [x, y] = [MANIVELA[0] + 34, MANIVELA[1] + 40], a = E.xiroT0 != null ? (t - E.xiroT0) * 4 : flag('a5Xirada') ? 1.2 : 0;
  c.save(); c.strokeStyle = '#141010'; c.lineWidth = 2; c.fillStyle = '#3a3a3a'; c.fillRect(x - 10, y - 8, 20, 30); c.strokeRect(x - 10, y - 8, 20, 30);
  c.translate(x, y - 4); c.rotate(a); c.strokeStyle = '#8a8a8a'; c.lineWidth = 4; c.beginPath(); c.moveTo(0, 0); c.lineTo(22, 0); c.stroke(); c.fillStyle = '#a0201a'; c.fillRect(18, -3, 10, 6); c.restore();
}
function pintarChuvia(c, t, n = 90, a = 0.35) {
  c.save(); c.strokeStyle = `rgba(200,210,240,${a})`; c.lineWidth = 1;
  for (let i = 0; i < n; i++) { const x = (i * 97.3 + t * 60) % 980 - 10, y = (i * 53.7 + t * 620) % 560 - 20; c.beginPath(); c.moveTo(x, y); c.lineTo(x - 4, y + 14); c.stroke(); }
  c.restore();
}
SCENES.rotondaSabado = {
  ...SCENES.rotonda, name: 'Rotonda do museo · sábado', bg: 'img/noite-rotonda.jpg', crop: null, music: null,
  draw(c, t) {
    // a Mikado: fume, lume na cabina; ao xirar, a plataforma treme
    c.save(); c.fillStyle = '#c8c8d4';
    for (let i = 0; i < 6; i++) { const k = (t * 0.3 + i / 6) % 1; c.globalAlpha = 0.36 * (1 - k); c.beginPath(); c.arc(760 + Math.sin(t * 0.8 + i) * 14 * k, 118 - k * 110, 10 + k * 34, 0, 7); c.fill(); }
    c.globalCompositeOperation = 'lighter'; c.globalAlpha = 0.14 + 0.07 * Math.sin(t * 9); c.fillStyle = '#ff8a30'; c.beginPath(); c.ellipse(520, 232, 30, 22, 0, 0, 7); c.fill();
    c.restore();
    // farolas de man e móbiles da xente ao fondo
    c.save(); c.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 14; i++) { const x = 120 + i * 56 + Math.sin(i * 3.1) * 14, y = 404 + (i % 3) * 6; c.globalAlpha = 0.25 + 0.2 * Math.sin(t * 2 + i); c.fillStyle = i % 4 ? '#bcd8ff' : '#ffc070'; c.fillRect(x, y, 3, 5); }
    c.restore();
    pintarManivela(c, t);
    if (E.xiroT0 != null) { c.save(); c.fillStyle = 'rgba(255,240,200,.05)'; c.fillRect(0, 0, W, H); c.restore(); }
  },
  onEnter: null,
  hotspots: [
    { name: 'Saír', r: [300, 512, 360, 28], at: [480, 530], face: 'F',
      act: () => MA('¿Irme? ¿Hoy? Hoy no se va nadie de esta rotonda. Ni Concha, que tiene el quiosco abierto con el cartel de «Volvo nun momento». Plagio de Eladio.', 'risueno') },
    { name: 'Manivela da plataforma', key: true, done: () => flag('a5Xirada'), r: MANIVELA, at: [800, 452], face: 'R',
      look: () => MA('La manivela de la plataforma giratoria: un engranaje que mueve ochenta toneladas a mano. Bueno, a dos manos. O a cuatro.', 'pensativo'),
      act: async () => {
        if (flag('a5Xirada')) return MA('Ya está girada. Si la vuelvo a girar, salimos hacia el museo de Lugo. Y no.', 'risueno');
        setFlag('a5ManivelaSo');
        await MA('Empujo... ¡nngh!... Nada. Ni con nueve kilos de presión en los brazos.', 'avergonzado');
        await RE('Xa cho dixen: cousa de dous. E ti estás só. De momento.');
        await MA('(Hace falta alguien con brazos de remar contra el Cabe. Y en esta rotonda solo hay uno así.)', 'pensativo');
      } },
    { name: 'Mikado', key: true, r: [250, 130, 610, 210], at: [540, 432], face: 'B', done: () => false,
      look: () => MA('La Mikado, encendida, con el farol puesto. Ochenta toneladas de hierro negro esperando su turno desde 1958. Hoy le toca.', 'entusiasmado'),
      act: async () => {
        if (!flag('a5Xirada')) return MA('Mira hacia las cocheras, no hacia la vía. Si arranco así, aparcamos en el museo. Primero, girar la plataforma.', 'pensativo');
        await MA('Subo por la escalerilla. Las manos en el pasamanos, frío y negro. Como hace veinte años, la primera vez.', 'pensativo');
        await goScene('cabina', [520, 506]);
      } },
    { name: 'Plataforma xiratoria', r: [120, 340, 700, 70], look: () => MA(flag('a5Xirada') ? 'La plataforma, girada. La vía de salida, delante de la chimenea. Nada se interpone ya. Bueno, Adif. Pero el lunes.' : 'La plataforma giratoria, con la Mikado mirando a las cocheras. Hay que darle media vuelta para que mire a la vía.', 'pensativo') },
    { name: 'Xente', r: [0, 380, 960, 50], look: () => MA('Linternas, móviles, abrigos, termos de café. Medio Monforte. Y nadie sabe exactamente qué ha venido a ver. Solo que hay que estar.', 'sonriente') },
  ],
  npcs: [
    { id: 'remedios5', name: 'Remedios', key: true, sheet: 'img/remedios-sprite.png', spec: { cw: 160, ch: 280, cols: 8 }, idle: 0, talkFrames: [1, 0],
      x: 250, y: 506, w: 60, h: 330, at: [330, 512], face: 'L', done: () => true,
      look: () => MA('Remedios, con el mono planchado. Planchado. Es la primera vez que la veo nerviosa.', 'sonriente'),
      talk: () => RE(flag('a5Xirada') ? 'Á cabina! Que a presión non espera polos maquinistas que conversan.' : 'A plataforma, Martín. Entre dous. Mira arredor: hai un que leva toda a tarde buscando algo que facer coas mans.') },
    { id: 'anxo5', name: 'Don Anxo', key: true, sheet: 'img/anxo-sprite.png', spec: { cw: 160, ch: 280, cols: 8 }, idle: 0, talkFrames: [1, 0], flip: true,
      x: 720, y: 508, w: 60, h: 310, at: [640, 514], face: 'R', done: () => true,
      look: () => MA('Don Anxo, con la gorra de los domingos. Mira la cabina sin parpadear.', 'pensativo'),
      talk: () => AX('Hoxe falarei, maquinista. Na vía. Agora, á túa máquina.') },
    andresNpc({ x: 150, y: 470, at: [220, 480], face: 'L', h: 290, done: () => flag('a5Xirada'),
      look: () => MA('Andrés, de pie. Sin tumbona, sin gafas puestas y con una pala al hombro. Si lo ve el del Fluvial, le da un infarto. Bueno, el del Fluvial es él.', 'risueno'),
      talk: () => andresRotonda() }),
    { id: 'concha5', name: 'Dona Concha', sheet: 'img/concha-sprite.png', spec: { cw: 160, ch: 280, cols: 8 }, idle: 0, talkFrames: [6, 4],
      x: 410, y: 524, w: 70, h: 290, at: [470, 530], face: 'L',
      look: () => MA('Concha, con un termo y la libreta de los crucigramas. Esta noche no apunta palabras: apunta quién ha venido.', 'sonriente'),
      talk: () => CO('Cento doce sinaturas, e viñeron douscentos. En Monforte, para un enterro ou para un tren, non falta ninguén.') },
    { id: 'valerio5', name: 'Valerio', sheet: 'img/valerio-sprite.png', spec: { cw: 160, ch: 280, cols: 8 }, idle: 0, talkFrames: [1, 0], flip: true,
      x: 570, y: 526, w: 70, h: 300, at: [630, 530], face: 'L',
      look: () => MA('Valerio, sin bata. Por primera vez en veinte años lo veo sin bata un sábado. Parece otro. Parece Valerio.', 'sorprendido'),
      talk: async () => { await VA('Pechei a farmacia. Por primeira vez nun sábado. Co cartel vello do avó: «Pechado por asuntos de familia».'); await VA('Hoxe isto é familia, Martín.'); } },
    { id: 'genaro5', name: 'Genaro', sheet: 'img/genaro-sprite.png', spec: { cw: 160, ch: 280, cols: 8 }, idle: 0, talkFrames: [1, 0], flip: true,
      x: 880, y: 492, w: 60, h: 300, at: [820, 500], face: 'R',
      look: () => MA('Genaro, con una bandeja de empanada y el gorro de panadero. Repartiendo como si fuera San Lucas.', 'risueno'),
      talk: () => GE('Isto é o final dunha aventura gráfica, rapaz. Sabíao dende o primeiro día: estas cousas sempre acaban nun tren. E o panadeiro sempre está mirando.', 'guino') },
  ],
};

/* ---------- A7d · Cabina da Mikado (debuxada por código, provisional) ---------- */
const presion = t => !flag('a5Lume') ? 5 : E.presT0 == null ? 9 : Math.min(9, 5 + (t - E.presT0) * 1.4);
function pintarCabina(c, t) {
  // ceo de noite polas fiestras laterais e o teito
  c.fillStyle = '#0c1018'; c.fillRect(0, 0, W, H);
  c.fillStyle = '#16233a'; c.fillRect(20, 60, 150, 200); c.fillRect(790, 60, 150, 200);
  c.fillStyle = '#e8ecf4'; for (const [x, y] of [[50, 90], [120, 140], [840, 100], [900, 180], [80, 210]]) c.fillRect(x, y, 2, 2);
  c.strokeStyle = '#2a2a2a'; c.lineWidth = 10; c.strokeRect(20, 60, 150, 200); c.strokeRect(790, 60, 150, 200);
  c.fillStyle = '#1a1614'; c.fillRect(0, 0, W, 40);
  // frontal da caldeira
  const g = c.createRadialGradient(480, 260, 40, 480, 280, 360); g.addColorStop(0, '#3a3634'); g.addColorStop(1, '#141210');
  c.fillStyle = g; c.beginPath(); c.moveTo(200, 540); c.lineTo(200, 160); c.quadraticCurveTo(480, 20, 760, 160); c.lineTo(760, 540); c.closePath(); c.fill();
  c.strokeStyle = '#4a4440'; c.lineWidth = 3; c.stroke();
  c.fillStyle = '#6a625a'; for (let x = 220; x < 750; x += 34) { c.beginPath(); c.arc(x, 178 - Math.sin((x - 200) / 560 * Math.PI) * 60, 3, 0, 7); c.fill(); }   // remaches
  // fogar
  const aberta = flag('a5Fornalla');
  c.fillStyle = '#26201c'; c.fillRect(400, 372, 160, 110); c.strokeStyle = '#7a6a5a'; c.lineWidth = 4; c.strokeRect(400, 372, 160, 110);
  if (aberta) {
    const k = flag('a5Lume') ? 1 : 0.4, fl = 0.75 + 0.25 * Math.sin(t * 11) * Math.sin(t * 4.3);
    const gf = c.createRadialGradient(480, 440, 6, 480, 430, 80); gf.addColorStop(0, `rgba(255,230,120,${fl * k})`); gf.addColorStop(0.5, `rgba(255,120,30,${0.8 * fl * k})`); gf.addColorStop(1, 'rgba(120,20,0,.6)');
    c.fillStyle = gf; c.fillRect(408, 380, 144, 94);
    c.save(); c.globalCompositeOperation = 'lighter'; c.globalAlpha = 0.18 * fl * k; c.fillStyle = '#ff8a30'; c.beginPath(); c.ellipse(480, 520, 300, 80, 0, 0, 7); c.fill(); c.restore();
    c.fillStyle = '#4a4038'; c.fillRect(562, 372, 30, 110); c.strokeRect(562, 372, 30, 110);   // porta aberta
  } else { c.fillStyle = '#4a4038'; c.fillRect(408, 380, 144, 94); c.fillStyle = '#8a7a6a'; c.fillRect(540, 420, 10, 18); }
  // manómetro
  const p = presion(t);
  c.fillStyle = '#efe8d8'; c.beginPath(); c.arc(480, 120, 40, 0, 7); c.fill(); c.strokeStyle = '#b8902e'; c.lineWidth = 6; c.stroke();
  c.strokeStyle = '#2a2a2a'; c.lineWidth = 1.5; c.font = '10px Georgia'; c.fillStyle = '#2a2a2a'; c.textAlign = 'center';
  for (let v = 0; v <= 12; v += 3) { const a = Math.PI * 0.75 + v / 12 * Math.PI * 1.5; c.beginPath(); c.moveTo(480 + Math.cos(a) * 30, 120 + Math.sin(a) * 30); c.lineTo(480 + Math.cos(a) * 36, 120 + Math.sin(a) * 36); c.stroke(); c.fillText(v, 480 + Math.cos(a) * 22, 124 + Math.sin(a) * 22); }
  c.fillStyle = '#b0201a'; { const a = Math.PI * 0.75 + 9 / 12 * Math.PI * 1.5; c.beginPath(); c.arc(480 + Math.cos(a) * 34, 120 + Math.sin(a) * 34, 3, 0, 7); c.fill(); }
  const an = Math.PI * 0.75 + p / 12 * Math.PI * 1.5 + (flag('a5Lume') ? Math.sin(t * 13) * 0.01 : 0);
  c.strokeStyle = '#141010'; c.lineWidth = 3; c.beginPath(); c.moveTo(480, 120); c.lineTo(480 + Math.cos(an) * 30, 120 + Math.sin(an) * 30); c.stroke(); c.textAlign = 'left';
  // nivel de auga
  c.fillStyle = '#9ab8c8'; c.fillRect(370, 180, 14, 80); c.fillStyle = '#2a5a8a'; const nv = flag('a5Inxector') ? 52 : 30 + Math.sin(t) * 1; c.fillRect(370, 260 - nv, 14, nv); c.strokeStyle = '#b8902e'; c.lineWidth = 3; c.strokeRect(370, 180, 14, 80);
  // inxector (volante á esquerda, con tubo)
  c.strokeStyle = '#8a6a2a'; c.lineWidth = 9; c.beginPath(); c.moveTo(300, 260); c.lineTo(300, 340); c.lineTo(380, 340); c.stroke();
  c.save(); c.translate(300, 250); c.rotate(flag('a5Inxector') ? 1.2 : 0); c.strokeStyle = '#c8962e'; c.lineWidth = 5; c.beginPath(); c.arc(0, 0, 24, 0, 7); c.stroke(); c.beginPath(); c.moveTo(-24, 0); c.lineTo(24, 0); c.moveTo(0, -24); c.lineTo(0, 24); c.stroke(); c.restore();
  if (flag('a5Inxector')) { c.save(); c.globalAlpha = 0.25 + 0.1 * Math.sin(t * 9); c.fillStyle = '#e8eef8'; c.beginPath(); c.arc(330 + Math.sin(t * 5) * 3, 360, 8, 0, 7); c.fill(); c.restore(); }
  // regulador (panca grande arriba á dereita)
  const ra = flag('a5Saida') ? -0.6 : 0;
  c.save(); c.translate(560, 200); c.fillStyle = '#5a5a5a'; c.fillRect(-12, -12, 24, 24); c.rotate(ra); c.strokeStyle = '#9a9a9a'; c.lineWidth = 8; c.beginPath(); c.moveTo(0, 0); c.lineTo(150, 30); c.stroke(); c.fillStyle = '#2a2a2a'; c.beginPath(); c.arc(150, 30, 10, 0, 7); c.fill(); c.restore();
  // freo (panca á dereita, vertical)
  c.save(); c.translate(700, 470); c.fillStyle = '#3a3a3a'; c.fillRect(-16, -6, 32, 40); c.rotate(flag('a5Freo') ? 0.5 : -0.1); c.strokeStyle = '#b0201a'; c.lineWidth = 8; c.beginPath(); c.moveTo(0, 0); c.lineTo(0, -120); c.stroke(); c.fillStyle = '#e8e8e8'; c.beginPath(); c.arc(0, -124, 9, 0, 7); c.fill(); c.restore();
  // cordón do asubío, do teito
  const tir = E.asubioT0 != null && t - E.asubioT0 < 1.2 ? 16 : 0;
  c.strokeStyle = '#d8c8a0'; c.lineWidth = 3; c.beginPath(); c.moveTo(640, 40); c.lineTo(640, 150 + tir); c.stroke(); c.fillStyle = '#d8c8a0'; c.beginPath(); c.arc(640, 156 + tir, 7, 0, 7); c.fill();
  if (flag('a5AsubioMontado')) { c.fillStyle = '#c8962e'; c.fillRect(630, 28, 20, 14); }
  // chan da cabina e bocas do ténder á esquerda (carbón)
  c.fillStyle = '#2a2420'; c.fillRect(0, 470, W, 70);
  c.fillStyle = '#18181a'; c.beginPath(); c.moveTo(0, 540); c.lineTo(0, 420); c.quadraticCurveTo(60, 380, 130, 440); c.lineTo(150, 540); c.closePath(); c.fill();
  c.fillStyle = '#2c2c30'; for (let i = 0; i < 22; i++) { c.beginPath(); c.arc(10 + (i * 37) % 130, 440 + (i * 23) % 90, 6 + i % 3 * 2, 0, 7); c.fill(); }
  // vapor ao saír
  if (flag('a5Saida') || E.asubioT0 != null && t - E.asubioT0 < 3) { c.save(); c.fillStyle = '#d8d8e0'; for (let i = 0; i < 5; i++) { const k = (t * 0.6 + i / 5) % 1; c.globalAlpha = 0.25 * (1 - k); c.beginPath(); c.arc(860 + k * 60, 140 - k * 80, 14 + k * 30, 0, 7); c.fill(); } c.restore(); }
}
SCENES.cabina = {
  name: 'Cabina da Mikado', bg: null, music: null, floor: 'metal',
  walk: [[250, 488], [740, 488], [740, 540], [250, 540]],
  scale: [488, 0.92, 540, 1], actorH: 330, start: [520, 506], minSpeed: 0.5,
  draw(c, t) { pintarCabina(c, t); },
  hotspots: [
    { name: 'Baixar', r: [880, 300, 80, 170], at: [730, 510], face: 'R',
      act: () => MA(flag('a5Saida') ? 'Ni loco me bajo ahora.' : 'Bajar ahora sería como cantar el himno hasta la mitad. Remedios me sube de una oreja.', 'convencido') },
    { name: 'Porta do fogar', key: true, done: () => flag('a5Fornalla'), r: [400, 372, 194, 110], at: [480, 500], face: 'B',
      look: () => MA(flag('a5Fornalla') ? (flag('a5Lume') ? 'El hogar, al rojo blanco. El carbón de Andrés arde como si tuviera prisa. La tiene.' : 'El hogar abierto. Brasas de la prueba, poca cosa. Hace falta carbón, y alguien que sepa echarlo.') : 'La puerta del hogar, cerrada. Detrás, las brasas de la prueba de la tarde.', 'pensativo'),
      act: async () => {
        if (flag('a5Fornalla')) return MA('Abierta se queda. Cerrarla ahora sería como cerrar la boca de un cantante a mitad de nota.', 'risueno');
        SFX.door(); setFlag('a5Fornalla');
        await MA('Abro el hogar. Una bocanada de calor en la cara. Brasas rojas, pocas. Hace falta carbón.', 'convencido');
      } },
    { name: 'Manómetro', key: true, done: () => flag('a5Presion9'), r: [436, 76, 88, 88], at: [480, 500], face: 'B',
      look: async () => {
        const p = presion(E.t);
        if (!flag('a5Lume')) return MA('Cinco kilos. Las brasas de la prueba. Con esto no sale ni el humo de la chimenea.', 'esceptico');
        if (p < 8.9) return MA(`${p.toFixed(1).replace('.', ',')} kilos y subiendo. Paciencia: la presión no entiende de prisas.`, 'pensativo');
        if (!flag('a5Presion9')) { setFlag('a5Presion9'); return MA('Nueve kilos. Lo que ponía la pizarra de las cocheras con letra de soldadora. Ni uno más, ni uno menos.', 'orgulloso'); }
        return MA('Nueve kilos, clavados. Y la válvula de Suso, callada. Buena señal.', 'orgulloso');
      } },
    { name: 'Inxector', key: true, done: () => flag('a5Inxector'), r: [266, 216, 70, 70], at: [330, 500], face: 'B',
      look: () => MA(flag('a5Inxector') ? 'El inyector, cantando. Mete agua en la caldera. Mientras cante, hay viaje.' : 'El inyector, el mismo que cebamos el jueves. Agua del ténder primero, vapor después, despacio.', 'pensativo'),
      act: async () => {
        if (flag('a5Inxector')) return MA('Sigue cantando. No lo toco, que se ofende.', 'sonriente');
        if (!flag('a5Presion9')) { await MA('Lo abro y... escupe por el rebose. Sin presión no tira.', 'avergonzado'); return RE('Primeiro presión, maquinista. Mira o reloxo grande, o do medio.'); }
        await MA('Agua del ténder... vapor, poco a poco... escupe, escupe... y...', 'pensativo');
        SFX.tone(660, 0.25, 'sine', 0.06); await sleep(260); SFX.tone(880, 0.6, 'sine', 0.05);
        setFlag('a5Inxector');
        await MA('...canta. El nivel del agua sube en el cristal.', 'orgulloso');
        await AX('Canta. Coma no 58.');
      } },
    { name: 'Nivel de auga', r: [362, 176, 30, 90], look: () => MA(flag('a5Inxector') ? 'El nivel, en su sitio. Agua de sobra para llegar a A Barreira y volver dos veces.' : 'El nivel del agua, bajo. Sin agua en la caldera no se va a ningún sitio. Se va al periódico.', 'pensativo') },
    { name: 'Freo', key: true, done: () => flag('a5Freo'), r: [670, 330, 60, 150], at: [690, 506], face: 'R',
      look: () => MA(flag('a5Freo') ? 'El freno, suelto. La Mikado ya no está atada: solo espera.' : 'La palanca del freno, apretada. Lleva así desde que la pusieron de adorno.', 'pensativo'),
      act: async () => {
        if (flag('a5Freo')) return MA('Suelto está. Si lo vuelvo a apretar ahora, Remedios me aprieta a mí.', 'risueno');
        if (!flag('a5Inxector')) { await MA('Suelto el fr...', 'convencido'); return RE('Quieto! Sen auga na caldeira ti non soltas nada. Primeiro o inxector. Iso aprendíao un aprendiz en 1958.'); }
        SFX.noise(0.7, 1400, 0.3, 0.2); setFlag('a5Freo');
        await MA('Aflojo el freno. Un suspiro largo de aire. La Mikado se queda quieta... pero ya no atada.', 'convencido');
      } },
    { name: 'Regulador', key: true, done: () => flag('a5Saida'), r: [540, 180, 190, 70], at: [600, 500], face: 'B',
      look: () => MA('El regulador. La palanca que lo decide todo. La de los sueños de cualquier crío de Vilatán.', 'entusiasmado'),
      act: async () => {
        if (!flag('a5Presion9')) return MA('¿Abrir el regulador sin presión? Saldría un suspiro por la chimenea y medio Monforte se reiría. El otro medio, también.', 'esceptico');
        if (!flag('a5Inxector')) return RE('Sen auga non hai viaxe, rapaz. Hai unha bomba. O inxector!');
        if (!flag('a5Freo')) { SFX.noise(0.8, 600, 0.5, 0.2); await MA('Abro un poco... la Mikado tira contra el freno, resopla... y no se mueve. Ochenta toneladas haciendo fuerza contra sí mismas.', 'avergonzado'); return RE('O freo, maquinista! Que é unha locomotora, non un tractor de Vilatán.'); }
        if (!flag('a5AsubioMontado')) return MA('Sin aviso no se sale. Lo dice el reglamento. Antes de moverse, el silbato. Y aquí el silbato... es un cordón.', 'pensativo');
        await saidaMikado();
      } },
    { name: 'Cordón do asubío', key: true, done: () => flag('a5AsubioMontado'), r: [620, 40, 40, 130], at: [640, 500], face: 'B',
      look: () => MA(flag('a5AsubioMontado') ? 'El cordón del silbato. Y arriba, por fin, el silbato. El de verdad.' : 'El cordón del silbato. Arriba, en vez de silbato... un tapón de hierro.', 'pensativo'),
      act: async () => {
        if (flag('a5AsubioMontado')) { E.asubioT0 = E.t; SFX.whistle('L'); return MA('Un pitido largo, para que se aparten. Aunque nadie se aparta: se acercan.', 'risueno'); }
        if (!flag('a5Freo')) return MA('Silbar sin poder salir es presumir. Primero, que la máquina esté lista.', 'pensativo');
        await asubioXoan();
      } },
    { name: 'Carbón do ténder', r: [0, 400, 150, 140], look: () => MA('El carbón de Andrés, en la boca del ténder. Diez sacos de churrasco convertidos en historia.', 'risueno') },
    { name: 'Fiestra', r: [790, 60, 150, 200], look: () => MA('Por la ventanilla: la rotonda llena, linternas, móviles en alto. Y Concha llorando y diciendo que es el humo.', 'sonriente') },
    { name: 'Fiestra', r: [20, 60, 150, 200], look: () => MA('Al otro lado, las cocheras a oscuras. Las otras máquinas miran. Con envidia, juraría.', 'pensativo') },
  ],
  npcs: [
    andresNpc({ x: 120, y: 530, at: [260, 520], face: 'L', h: 320, done: () => flag('a5Lume'),
      look: () => MA('Andrés, en la boca del ténder, con la pala y las mangas remangadas. Y Don Anxo mirándolo sin decir nada. Como quien ve una foto vieja moverse.', 'pensativo'),
      talk: () => andresCabina(), give: { chaveAgulla: () => AN('Iso non vai no fogar, Martín.') } }),
    { id: 'anxoC', name: 'Don Anxo', key: true, sheet: 'img/anxo-sprite.png', spec: { cw: 160, ch: 280, cols: 8 }, idle: 0, talkFrames: [1, 0], flip: true,
      x: 820, y: 532, w: 60, h: 330, at: [720, 520], face: 'R', done: () => true,
      look: () => MA('Don Anxo, en su esquina de la cabina. La misma esquina, imagino, que en 1958. Mira a su nieto palear y no parpadea.', 'pensativo'),
      talk: () => AX(flag('a5Lume') ? 'Escoita o carbón, rapaz. Iso é do bo.' : 'Eu xa non teño brazos para a pa. Pero teño ollos. Mira o teu nieto... o teu fogoneiro.') },
    { id: 'xoanC', name: 'Xoán Carballeira', key: true, sheet: 'img/xoan-sprite.png', spec: { cw: 160, ch: 280, cols: 8 }, idle: 3, talkFrames: [7, 0],
      x: 900, y: 534, w: 70, h: 330, at: [740, 520], face: 'R', when: () => flag('a5Xoan'), done: () => true,
      look: () => MA('Xoán, con la mochila a la espalda y el chaleco de Renfe. El silbato de la Mikado ya está en su sitio. Y él, también.', 'pensativo'),
      talk: () => XO('Á vía, Martín. Que eu xa asubiei bastante.') },
  ],
};
async function andresCabina() {
  if (flag('a5Lume')) return AN('Xa abonda. Se lle boto máis, chegamos a Lugo. E en Lugo non nos esperan.');
  if (!flag('a5Fornalla')) { await MA('Andrés, ¡fuego!', 'convencido'); return AN('Polo burato da cheminea? Abre a porta do fogar, maquinista, que eu son forte pero non mago.'); }
  await MA('Andrés: carga. Sin miedo.', 'convencido');
  E.palaT0 = E.t; SFX.noise(0.5, 400, 0.6, 0.2, 0, 'lowpass'); setTimeout(() => SFX.noise(0.5, 400, 0.6, 0.2, 0, 'lowpass'), 900);
  await AN('O avó dicía que o carbón bo se coñece polo son.');
  await AN('Escoita, Martín: este é do bo.');
  await MA('(Andrés palea con un ritmo que no se aprende en un chiringuito. Y Don Anxo lo mira desde su esquina, con la boca apretada.)', 'pensativo');
  setFlag('a5Lume'); E.presT0 = E.t;
  await MA('La presión sube. Habrá que vigilar el manómetro.', 'convencido');
}
async function asubioXoan() {
  E.asubioT0 = E.t; SFX.noise(0.4, 1800, 0.5, 0.15);
  await MA('Tiro del cordón... ¡Fssss! Sale un soplido triste por el tapón. Ni silbato ni nada.', 'avergonzado');
  await RE('O asubío ten dono, maquinista. E esta noite si veu.');
  setFlag('a5Xoan'); SFX.door();
  await XO('Permiso. Boas noites. Perdoade o atraso: o de Ourense veu puntual e eu non.');
  await MA('(Xoán, subiendo a la cabina con su mochila. Y de la mochila saca... un silbato de bronce, viejo, pulido como un trofeo.)', 'sorprendido');
  await XO('O asubío orixinal da Mikado. Desmonteino hai un ano para que non o levasen a ningún museo. E para chamar a quen fixese falta.');
  await MA('Las noches. El patio. Dos largos y uno corto. Eras tú.', 'convencido');
  await XO('Era eu. Mañá... hoxe, na vía, cóntoche o resto. Agora, axúdame a montalo, que está quente.');
  SFX.tone(220, 0.15, 'square', 0.08); await sleep(200); SFX.tone(260, 0.15, 'square', 0.08);
  setFlag('a5AsubioMontado'); E.asubioT0 = E.t; SFX.whistle('L');
  await MA('Un pitido largo, limpio, que retumba en toda la rotonda. Medio Monforte aplaude. El otro medio llora.', 'entusiasmado');
  toast('Novo obxectivo: o regulador. A saída');
}
async function saidaMikado() {
  setFlag('a5Saida');
  SFX.noise(1.4, 500, 0.5, 0.4, 0, 'lowpass');
  await MA('Regulador. Despacio. Un resoplido... otro... y la Mikado se mueve.', 'entusiasmado');
  await cine('img/noite-rotonda.jpg', ['A Mikado sae da rotonda. Primeiro un resoplido, despois outro, e despois as rodas.', 'Media cidade aplaude. Concha chora e di que é o fume.', 'Valerio, sen bata, corre detrás coma un neno.']);
  await cine('img/cine-mikado.jpg', ['21:30. Polo ramal vello de A Barreira, a paso de home.', 'No paso a nivel, Eladio, co seu permiso e o seu selo, para os coches cunha man.', 'E comeza a chispear. Coma no 58.'], { x: 0.5, y: 0.35, z: 1.25 });
  await goScene('barreira', [480, 500]);
}

/* ---------- A9 · A Barreira, 21:40 (fondo provisional: img/cine-mikado.jpg) ---------- */
const AGULLA = [90, 380, 130, 110];
function pintarAgulla(c, t) {
  const [x, y] = [150, 480], a = flag('a5Agulla') ? 0.6 : -0.35;
  c.save(); c.strokeStyle = '#141010'; c.lineWidth = 2;
  c.fillStyle = '#3a3430'; c.fillRect(x - 40, y - 26, 80, 30); c.strokeRect(x - 40, y - 26, 80, 30);
  c.translate(x - 10, y - 24); c.rotate(a); c.strokeStyle = '#2a2622'; c.lineWidth = 7; c.beginPath(); c.moveTo(0, 0); c.lineTo(0, -80); c.stroke();
  c.fillStyle = '#d8d0c0'; c.beginPath(); c.arc(0, -64, 13, 0, 7); c.fill(); c.strokeStyle = '#141010'; c.lineWidth = 2; c.stroke(); c.fillStyle = '#141010'; c.fillRect(-10, -66, 20, 4);
  c.restore();
  if (!flag('a5Agulla')) { c.save(); c.fillStyle = '#7a5a2a'; c.fillRect(x + 12, y - 18, 16, 14); c.strokeStyle = '#3a2a10'; c.lineWidth = 3; c.beginPath(); c.arc(x + 20, y - 18, 6, Math.PI, 0); c.stroke(); c.restore(); }
}
SCENES.barreira = {
  name: 'A Barreira · vía morta', bg: 'img/cine-mikado.jpg', music: null, floor: 'pedra',
  walk: [[0, 452], [960, 452], [960, 540], [0, 540]],
  holes: [[[100, 452], [210, 452], [210, 486], [100, 486]]],
  scale: [452, 0.78, 540, 0.95], actorH: 330, start: [480, 500], minSpeed: 0.5,
  draw(c, t) {
    c.save(); c.fillStyle = 'rgba(8,10,20,.25)'; c.fillRect(0, 0, W, H); c.restore();
    pintarAgulla(c, t);
    pintarChuvia(c, t);
  },
  onEnter: async () => {
    if (flag('a5Barreira')) return;
    setFlag('a5Barreira');
    await MA('A Barreira. El final del ramal. Una vía muerta, un tope de hierro... y empieza a llover. Como en el 58.', 'pensativo');
    await AX('A agulla. Hai que pasala á vía morta. Leva pechada dende aquela noite.');
    toast('Novo obxectivo: mover a agulla vella');
  },
  hotspots: [
    { name: 'Agulla vella', key: true, done: () => flag('a5Agulla'), r: AGULLA, at: [250, 500], face: 'L',
      look: () => MA(flag('a5Agulla') ? 'La aguja, en la vía muerta. Como en 1958. Esta vez, sin mercancías sin frenos detrás.' : 'Una palanca de aguja vieja, con un candado oxidado. No se mueve desde 1958. La llave la tendría el guardagujas... y el guardagujas era Pepe.', 'pensativo'),
      act: async () => {
        if (flag('a5Agulla')) return MA('Ya está en su sitio. No la toco más, que esta aguja ya ha decidido bastantes cosas.', 'pensativo');
        setFlag('a5AgullaVista');
        await MA('Tiro de la palanca... nada. Un candado de los de antes, oxidado. Y yo sin llave de guardagujas.', 'frustrado');
        await AX('A chave tíñaa Pepe. O guardagullas. O pai de...');
        await MA('(...de Eladio. Que está en el paso a nivel, con su sello.)', 'convencido');
      },
      use: { chaveAgulla: () => moverAgulla(), navalla: () => MA('¿Abrir un candado de Renfe de 1958 con una navaja de cocina? Esto no es el cajón de la cocina, Martín.', 'esceptico') } },
    { name: 'Mikado', key: true, r: [380, 40, 240, 380], at: [480, 470], face: 'B',
      look: () => MA(flag('a5Agulla') ? 'La Mikado, quieta en la vía muerta, con el farol encendido y la lluvia brillando delante. Como en las fotos que no existen.' : 'La Mikado, parada delante de la aguja, resoplando. Esperando que alguien le abra el camino.', 'entusiasmado'),
      act: async () => {
        if (!flag('a5Agulla')) return MA('Primero la aguja. Si sigo de frente, acabo en el río. Y el agua me trae malos recuerdos esta semana.', 'esceptico');
        if (flag('a5Asubiado')) return MA('Ya ha silbado. Lo que tenía que decir, ya lo ha dicho.', 'pensativo');
        await asubioFinal();
      } },
    { name: 'Chuvia', r: [0, 0, 300, 300], look: () => MA('Lluvia fina. De la que no moja pero empapa. Como en el 58, me dicen los que estaban.', 'pensativo') },
  ],
  npcs: [
    { id: 'eladioB', name: 'Don Eladio', key: true, x: 880, y: 492, w: 44, h: 300, at: [800, 500], face: 'R', done: () => hasItem('chaveAgulla') || flag('a5Agulla'),
      draw(c, t, talking, s) { const h = this.h * s, u = h / 100; figura(c, this.x, this.y, h, ELADIO_FIG, t, talking); c.save(); c.fillStyle = 'rgba(232,192,32,.9)'; c.fillRect(this.x - 12 * u, this.y - 80 * u, 24 * u, 26 * u); c.fillStyle = '#e8e8e8'; c.fillRect(this.x - 12 * u, this.y - 66 * u, 24 * u, 2.5 * u); c.restore(); },
      look: () => MA('Eladio, con un chaleco reflectante encima del traje y la carpeta del permiso bajo el brazo. El paso a nivel, cortado. Ni un coche. Ni la Policía Local, que está mirando como todos.', 'sonriente'),
      talk: () => eladioBarreira(), give: { permiso: () => EL('Xa está, Martín. Iso xa fixo o seu traballo. Agora fai ti o teu.') } },
    { id: 'xoanB', name: 'Xoán Carballeira', key: true, sheet: 'img/xoan-sprite.png', spec: { cw: 160, ch: 280, cols: 8 }, idle: 3, talkFrames: [7, 0],
      x: 690, y: 500, w: 70, h: 300, at: [610, 506], face: 'R', done: () => true,
      look: () => MA('Xoán, con la mochila vacía y el chaleco empapado. Mira la Mikado como quien mira a un abuelo.', 'pensativo'),
      talk: () => XO(flag('a5Agulla') ? 'Martín... Toca ti. Dous longos e un curto.' : 'A agulla, Martín. A agulla de Pepe.') },
    { id: 'anxoB', name: 'Don Anxo', key: true, sheet: 'img/anxo-sprite.png', spec: { cw: 160, ch: 280, cols: 8 }, idle: 0, talkFrames: [1, 0],
      x: 300, y: 510, w: 60, h: 310, at: [380, 512], face: 'L', done: () => true,
      look: () => MA('Don Anxo, bajo la lluvia, con el bastón clavado en la grava. Sesenta y ocho años después, en el mismo sitio.', 'pensativo'),
      talk: () => AX(flag('a5Agulla') ? 'Asubía, rapaz. Despois falo eu.' : 'A chave tíñaa Pepe. O guardagullas.') },
    andresNpc({ x: 560, y: 470, at: [520, 486], face: 'R', h: 300, done: () => true,
      look: () => MA('Andrés, con la cara negra de carbón y la pala apoyada. Sonríe. No le había visto sonreír sin gafas de sol.', 'sonriente'),
      talk: () => AN('O carbón bo, polo son. E hoxe soou ben.') }),
    { id: 'remediosB', name: 'Remedios', sheet: 'img/remedios-sprite.png', spec: { cw: 160, ch: 280, cols: 8 }, idle: 0, talkFrames: [1, 0],
      x: 40, y: 520, w: 60, h: 330, at: [110, 520], face: 'L',
      look: () => MA('Remedios, con un paraguas que no abre. Dice que la lluvia de hoy no le moja.', 'sonriente'),
      talk: () => RE(flag('a5Asubiado') ? 'Ben. Agora alguén me axuda a baixar a presión antes de que a Mikado chore tamén.' : 'A min non me mires. Esta noite o xefe es ti.') },
    { id: 'conchaB', name: 'Dona Concha', sheet: 'img/concha-sprite.png', spec: { cw: 160, ch: 280, cols: 8 }, idle: 0, talkFrames: [6, 4], flip: true,
      x: 940, y: 530, w: 70, h: 290, at: [880, 530], face: 'R', when: () => flag('a5Agulla'),
      look: () => MA('Concha, que ha llegado andando detrás de la Mikado con el termo. Con setenta años y zapatillas. No se lo pierde nadie.', 'risueno'),
      talk: () => CO(flag('a5Asubiado') ? 'Era el. Era Xosé.' : 'Asubía, rapaz. Que eu xa sei como soa.') },
  ],
};
async function eladioBarreira() {
  if (flag('a5Agulla') || hasItem('chaveAgulla')) return EL('Sorte, rapaz.');
  if (!flag('a5AgullaVista')) return EL('Corte da rúa feito, Martín. Nin un coche. Nin a Policía Local, que está mirando coma todos. O meu selo, funcionando.');
  await MA('Eladio. La aguja vieja tiene candado. Y la llave la tenía...', 'dudoso');
  await EL('...o meu pai.');
  await EL('Gardeina corenta anos nun caixón do Concello, coma un expediente sen resolver. Hoxe tróuxena no peto. Non sei por que. Ou si.');
  give('chaveAgulla');
  await EL('Sorte, rapaz.');
  await MA('(«Sorte, rapaz». La letra de Pepe en el reverso de la foto de 1949. Y ahora, la voz de su hijo.)', 'pensativo');
}
async function moverAgulla() {
  if (flag('a5Agulla')) return;
  take('chaveAgulla');
  SFX.tone(180, 0.2, 'square', 0.1); await sleep(220); SFX.noise(0.6, 900, 0.5, 0.3);
  await cine('img/cine-agulla.jpg', ['Clac. O candado de Pepe cede. A panca vella move, dura, coma no 58.', 'A Mikado entra na vía morta de A Barreira, amodo, ata o topo de ferro.', '21:40.']);
  setFlag('a5Agulla');
  await XO('Martín...');
  await XO('Toca ti. Dous longos e un curto.');
  toast('Novo obxectivo: o asubío (na Mikado)');
}
async function asubioFinal() {
  setFlag('a5Asubiado');
  await MA('Subo a la cabina. Agarro el cordón. Xoán asiente.', 'pensativo');
  SFX.whistle('LLS');
  await sleep(3600);
  await MA('Dos largos... y uno corto.', 'pensativo');
  await MA('(El eco rebota en las casas de A Barreira. Se encienden ventanas. Una, otra, otra.)', 'sorprendido');
  await revelacion();
}
async function revelacion() {
  await XO('Chámome Xoán Carballeira Nogal. Carballeira polo meu pai. Nogal pola miña nai, a filla de Xosé.');
  await XO('Meu avó non foi culpable de nada. Levaba sesenta e oito anos esperando que alguén llo dixese a Monforte. E eu levaba un ano asubiando á noite, para que alguén escoitase.');
  await MA('Y alguien escuchó. Te costó una casa entera y un maquinista de Valencia.', 'sonriente');
  await MA('Escuchad. Esto lo escribió Xosé Nogal el 14 de enero de 1958.', 'convencido');
  await showDoc(DOC_PARTE);
  await MA('Freno automático a tres kilos, cuando el mínimo son cinco. Lo avisó a las seis y diez, a las siete y media y a las nueve menos cuarto. «Reparación denegada».', 'convencido');
  await MA('Xosé Nogal no se equivocó. Llevaba un mercancías sin frenos y lo paró aquí, a contravapor, con las manos. Y el tren de emigrantes del andén 1 salió a su hora.', 'orgulloso');
  await AX('...');
  await AX('Eu era o seu fogoneiro.');
  await AX('Asinei o informe que dicía «erro do maquinista». Para non perder o traballo. Contra o meu compañeiro de aprendiz. Contra Xosé.');
  await AX('E sabía onde estaba o parte. Xosé díxomo antes de marchar: «para quen veña buscar». Eu non tiven valor de sacalo. E fixen que o soldasen para non ter que pensar nel.');
  await RE('E eu soldeino.');
  await AX('E ti soldáchelo, Remedios. Sen saber. A culpa é miña, non túa.');
  await AN('Avó.');
  await AX('...Andrés?');
  await AN('Xa o sabía, avó. Contoumo a avoa hai moitos anos. E calei, coma ti. Calar tamén é coidar.');
  await AX('...');
  await AX('Pois agora segue paleando, rapaz. O carbón bo, polo son.');
  await MA('(Andrés vuelve a coger la pala. No hay carbón que echar. Le da igual.)', 'pensativo');
  await CO('Ese asubío... Dous longos e un curto.');
  await CO('A miña nai asubiábamo de pequena, contándome dun maquinista que saudaba a unha casa cando pasaba co tren. Á carpintaría de Alfredo.');
  await CO('Era el. Era Xosé.');
  await EL('Meu pai quitaba a gorra cando pasaba un tren de vapor. Agora sei a quen lla quitaba.');
  await RE('Ben. E agora que xa chorou todo o mundo, alguén me axuda a baixar a presión antes de que a Mikado chore tamén?');
  if (VALENCIA === 'chamada') {
    SFX.tone(880, 0.15, 'sine', 0.08); await sleep(220); SFX.tone(880, 0.15, 'sine', 0.08); await sleep(600); SFX.tone(880, 0.15, 'sine', 0.08); await sleep(220); SFX.tone(880, 0.15, 'sine', 0.08);
    await MA('(El móvil. En el bolsillo, vibrando. «Ferrer · Valencia».)', 'dudoso');
    await MA('No contesto. El lunes, Ferrer. El lunes.', 'pensativo');
  }
  await domingoMural();
}

/* ---------- domingo, 6:00 · o mural ---------- */
async function domingoMural() {
  await showDoc('<h4>Domingo, 6:00</h4><p>Vestíbulo da estación. Aínda non abriu a cafetería.</p>');
  await cine('img/cine-mural.jpg', [
    'Xoán: «Meu avó saíu de aquí cara a Xenebra un mércores, cunha maleta de cartón. Sempre pensei que o emigrante do mural era el».',
    'Martín: «Pues ya ha vuelto. Por la puerta grande. Y con silbato».',
    'Xoán: «O luns poñen unha placa. Pequena. Eladio di que o trámite leva un mes».',
    'Martín: «Concha lo consigue en media hora».',
    'Os dous rin. Fóra, o primeiro rexional do domingo asubía. Un só asubío, longo. Normal.',
  ]);
  await goScene('vilatan', [420, 500]);
}

/* ---------- E1 · Vilatán, cociña da nai (fondo provisional: a cociña da demo técnica) ---------- */
SCENES.vilatan = {
  name: 'Vilatán · cociña da nai', bg: 'img/bg-cocina.jpg', music: 'casa', floor: 'madeira',
  walk: [[180, 470], [880, 470], [930, 540], [140, 540]],
  scale: [470, 0.85, 540, 1], actorH: 320, start: [420, 500], minSpeed: 0.5,
  draw(c, t) {
    // a pota do caldo no lume, con vapor
    c.save(); c.fillStyle = '#3a3a3e'; c.beginPath(); c.ellipse(442, 208, 30, 9, 0, 0, 7); c.fill(); c.fillRect(412, 208, 60, 36); c.fillStyle = '#2a2a2e'; c.beginPath(); c.ellipse(442, 244, 30, 8, 0, 0, Math.PI); c.fill();
    c.fillStyle = '#e8e8ee'; for (let i = 0; i < 4; i++) { const k = (t * 0.4 + i / 4) % 1; c.globalAlpha = 0.35 * (1 - k); c.beginPath(); c.arc(442 + Math.sin(t + i) * 8, 198 - k * 70, 8 + k * 16, 0, 7); c.fill(); }
    c.restore();
  },
  onEnter: async () => { if (!flag('a5Vilatan')) { setFlag('a5Vilatan'); await caldoNai(); } },
  hotspots: [
    { name: 'Pota do caldo', key: true, r: [396, 180, 92, 70], at: [440, 480], face: 'B',
      look: () => MA('El caldo de los domingos. Grelos, patata, unto. Lo único en el mundo que no ha cambiado en veinte años. Ni falta que hace.', 'sonriente'),
      act: () => flag('fimXogo') ? NA('Outro prato? Senta, que cho poño eu. Os maquinistas, sentados, que de pé xa estades toda a semana.') : caldoNai() },
    { name: 'Fiestra', r: [190, 20, 150, 340], look: () => MA('Por la ventana, Vilatán: cuatro casas, un hórreo y la carretera de Monforte. Desde aquí se oye el tren de las once. Siempre se oyó.', 'pensativo') },
  ],
};
async function caldoNai() {
  await NA('Come, que estás nos ósos. E conta. Que medio Vilatán xa sabe o do tren e eu, que son túa nai, son a última.');
  await MA('Mamá, ha sido... una semana. Una casa sin agua, un silbato de noche, una paloma con cara de revisora, una Mikado y un hombre que ha esperado sesenta y ocho años para decir una frase.', 'sonriente');
  await NA('E Valencia?');
  await MA(VALENCIA === 'chamada' ? 'Me ofrecen jefe de maquinistas. Tengo que contestar mañana.' : 'La comisión de servicio se acaba mañana. O pido la plaza fija en Monforte, o vuelvo a Valencia.', 'pensativo');
  await NA('E que lle vas dicir?');
  const k = await choose([
    { t: 'Que sí. Me voy a Valencia.' },
    { t: 'Que no. Me quedo en Monforte.' },
  ]);
  if (k === 0) {
    setFlag('finalValencia');
    await MA('Que sí. Es lo que he querido siempre, mamá. Y ahora me voy sabiendo de dónde soy.', 'convencido');
    await NA('Pois entón vai tranquilo, fillo.');
    await NA('As raíces non son para quedar quieto: son para saber onde volver.');
    await MA('Y el domingo que viene, caldo. Aunque sea en el regional de las siete.', 'sonriente');
  } else {
    setFlag('finalMonforte');
    await MA('Que no. Monforte está viejo y medio vacío, mamá...', 'pensativo');
    await MA('...pero esta semana he visto media ciudad en un andén.', 'convencido');
    await NA('Pois entón xa está. Monforte non estaba tan baleiro: faltabas ti.');
    await MA('Y los domingos, caldo. A veinte minutos.', 'sonriente');
  }
  await epilogo();
}
async function epilogo() {
  setFlag('fimXogo');
  await showDoc('<h4>Epílogo</h4><p>Un luns calquera, no vestíbulo da estación de Monforte, xunto ao mural de 1954, alguén puxo unha placa pequena.</p><p style="font-size:20px;text-align:center"><b>Xosé Nogal, maquinista.<br>14 de xaneiro de 1958.</b></p><p class="sub">Dicía Concha que, aquela mañá, o primeiro rexional asubiou dúas veces longas e unha curta. Ninguén o puido demostrar.</p>');
  await showDoc(`<h4>FIN · «Vía morta»</h4><p>${flag('finalValencia') ? 'Martín volveu a Valencia, xefe de maquinistas. Todos os domingos, caldo en Vilatán.' : 'Martín quedou en Monforte, na Casa Juana. O taller segue baleiro. Polo de agora.'}</p><p>Grazas por xogar.</p><p class="sub">Unha obra de ficción inspirada en lugares reais de Monforte de Lemos. Os créditos e as fontes están no menú.</p>`);
  toast('Fin do xogo. Grazas por xogar!');
}

/* ---------- preset do Acto 5 en «Escoller acto» ---------- */
{
  const F = { ...(ACTS.find(a => a.id === 'acto4').flags || {}) };
  for (const k of ['a4Inicio', 'a4Valencia', 'a4Encargos', 'a4Carta', 'a4Soporte', 'pombaVista', 'tapaGolpe', 'milloVisto', 'milloTrocado', 'serrinColleito', 'preservativoColleito',
    'estoupido', 'tapaCaida', 'soporteAberto', 'lataCollida', 'a4Parte', 'pombasFora', 'a4Soldadura', 'a4SusoSauda', 'a4SusoPeso', 'a4ValvulaColleita', 'a4Valvula',
    'a4Carbon', 'a4Carretilla', 'a4T14', 'a4XoanNogal', 'a4Sinaturas', 'a4PermisoColleito', 'a4Permiso', 'a4XoanPraza', 'a4Anxo', 'fimActo4']) F[k] = true;
  F.pombas = 10;
  const i = ACTS.findIndex(a => a.id === 'acto5');
  ACTS[i] = { id: 'acto5', name: 'Acto 5 · O descubrimento', desc: 'Sábado e domingo: a plataforma xiratoria, a cabina da Mikado, A Barreira, o mural e Vilatán (dous finais)',
    scene: 'rotondaSabado', at: [480, 528], inv: ['chavesCasa', 'navalla', 'chave', 'foto1949', 'parte'], flags: F,
    intro: () => inicioActo5() };
}

/* ---------- caderno de Martín · Acto 5 ---------- */
CADERNO.push(
  { when: () => A5ON() && !flag('a5Xirada'), t: () => flag('a5ManivelaSo') ? 'La plataforma giratoria se mueve entre dos. Andrés tiene brazos de remar contra el Cabe.' : 'Girar la plataforma para que la Mikado mire a la vía de salida (la manivela, a la derecha).' },
  { when: () => A5ON() && flag('a5Xirada') && !flag('a5Saida') && E.sceneId !== 'cabina', t: 'Subir a la cabina de la Mikado.' },
  { when: () => A5ON() && E.sceneId === 'cabina' && !flag('a5Lume'), t: 'Fuego: abrir el hogar y pedirle carbón a Andrés.' },
  { when: () => A5ON() && flag('a5Lume') && !flag('a5Presion9'), t: 'Vigilar el manómetro hasta los 9 kilos de la pizarra.' },
  { when: () => A5ON() && flag('a5Presion9') && !flag('a5Inxector'), t: 'Agua en la caldera: el inyector.' },
  { when: () => A5ON() && flag('a5Inxector') && !flag('a5Freo'), t: 'Aflojar el freno.' },
  { when: () => A5ON() && flag('a5Freo') && !flag('a5AsubioMontado'), t: 'Antes de salir, el silbato (el cordón del techo).' },
  { when: () => A5ON() && flag('a5AsubioMontado') && !flag('a5Saida'), t: 'El regulador. La salida.' },
  { when: () => A5ON() && flag('a5Barreira') && !flag('a5Agulla'), t: () => flag('a5AgullaVista') ? 'La aguja vieja tiene candado. La llave era de Pepe, el guardagujas, el padre de Eladio (en el paso a nivel).' : 'Pasar la aguja vieja a la vía muerta (a la izquierda).' },
  { when: () => A5ON() && flag('a5Agulla') && !flag('a5Asubiado'), t: 'Dos largos y uno corto. El silbato de la Mikado.' },
);
