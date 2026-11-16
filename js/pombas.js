/* ============================================================================
   Vía morta · As pombas do taller e a tapa do 7.º soporte (Acto 4, idea de Oscar do 16-11-2026)
   ----------------------------------------------------------------------------
   Substitúe ao puzzle vello da piqueta de Remedios. Cadea:
     1. A tapa do 7.º soporte ten os catro parafusos soldados e Martín, colgado do eixo, non ten forza para darlle un bo golpe.
     2. No niño das vigas hai unha pomba. Millo da Panadería Estación (cambiazo polos sacos de serrín do taller, noutro fío).
     3. Tirar millo no chan do taller: baixa a pomba do niño. Máis millo: máis pombas polo burato do tellado (1 → 3 → 6 → 10).
     4. Co taller cheo, un ruído de verdade: o preservativo da máquina azul de Calvo Sotelo (forzada coa navalla, fío da farmacia)
        inflado coma un globo e picado coa navalla. ¡PAM!
     5. As pombas saen disparadas cara arriba, tres pétanse contra a tapa e a tapa cae ao chan. Dentro: a lata (→ parte de 1958).
   Sen atascos: o saco de millo non se acaba, a máquina dá outro preservativo, o globo non se pica se o taller non está cheo.
   A cadea só se activa co flag `a4Soporte` (Martín decide abrir o soporte). De momento pono o comezo provisional do Acto 4
   ao final do Acto 3; o Acto 4 definitivo só ten que poñer ese flag onde Martín o entenda.
   Sprites: folla de Oscar → tools/sprite-paloma.py → img/paloma-sprite.png (240×160, 8 columnas):
     0 quieto · 1-3 andar · 4-6 correr · 7-9 voar · 10-12 atacar · 13 tumbada · 14-16 mareada
   ============================================================================ */

const POMBA = {
  sheet: 'img/paloma-sprite.png', spec: { cw: 240, ch: 160, cols: 8 },
  anims: { quieto: { f: [0] }, andar: { f: [1, 2, 3], fps: 8 }, correr: { f: [4, 5, 6], fps: 12 }, voar: { f: [7, 8, 9], fps: 12 },
    atacar: { f: [10, 11, 12], fps: 10 }, tumbada: { f: [13] }, marea: { f: [14, 15, 16], fps: 3 } },
  voar: [7, 8, 9],
};
const POMBA_ONDAS = [1, 3, 6, 10];           // pombas no chan despois de cada puñado de millo
const POMBA_CHEO = 10;
// sitios no chan do taller (fóra do piar e do caixón) e de onde chegan voando
const POMBA_SITIOS = [[700, 470], [330, 476], [420, 508], [800, 500], [640, 520], [880, 456], [262, 518], [740, 440], [880, 526], [360, 444]];
const POMBA_ORIXE = [[930, -40], [120, -40], [260, -60], [60, -30], [180, -50], [330, -70], [90, -40], [220, -60], [150, -30], [300, -50]];
const nPombas = () => E.flags.pombas || 0;
const A4 = () => flag('a4Soporte');

/* ---------- obxectos ---------- */
Object.assign(ico, {
  millo(c) { c.fillStyle = '#c9a66b'; c.beginPath(); c.moveTo(12, 14); c.lineTo(36, 14); c.lineTo(40, 42); c.lineTo(8, 42); c.closePath(); c.fill(); c.strokeStyle = '#7a5a2a'; c.lineWidth = 2; c.stroke();
    c.fillStyle = '#f2c230'; for (const [x, y] of [[16, 14], [22, 11], [28, 13], [34, 12], [19, 9], [27, 8]]) { c.beginPath(); c.ellipse(x, y, 3, 2.4, 0, 0, 7); c.fill(); } },
  globo(c) { c.fillStyle = '#f3ecd8'; c.beginPath(); c.ellipse(24, 20, 12, 16, 0, 0, 7); c.fill(); c.strokeStyle = '#b8ae94'; c.lineWidth = 2; c.stroke(); c.fillStyle = '#fff'; c.beginPath(); c.ellipse(19, 13, 3, 5, -0.4, 0, 7); c.fill();
    c.strokeStyle = '#8a7a5a'; c.beginPath(); c.moveTo(24, 36); c.quadraticCurveTo(20, 42, 26, 46); c.stroke(); },
});
Object.assign(ITEMS, {
  millo: { name: 'Saco de millo', icon: ico.millo,
    look: () => MA('Un saco de maíz en grano, de la panadería de Genaro. Para la broa. Pesa como si no se acabase nunca. Y para lo que quiero, no se va a acabar.', 'sonriente') },
  preservativo: { name: 'Preservativo', icon: ico.preservativo,
    look: () => MA('Un preservativo de la máquina azul, en su sobrecito. En el instituto los inflábamos como globos en clase de Física. Reventaban como un petardo. El profesor no se reía.', 'avergonzado'),
    combine: { navalla: () => MA('¿Pinchar un preservativo sin inflar? Eso no suena a nada. Primero, globo. Luego, ruido.', 'esceptico') } },
  globo: { name: 'Globo de farmacia', icon: ico.globo,
    look: () => MA('El preservativo, inflado. Un globo de farmacia. Si lo pincho, suena como un petardo de San Lucas. No lo pienso enseñar por la calle.', 'avergonzado'),
    combine: { navalla: () => estoupar() } },
});
// a navalla tamén pica o globo (a combinación funciona nas dúas ordes)
ITEMS.navalla.combine = { ...(ITEMS.navalla.combine || {}), globo: () => estoupar() };

/* ---------- a pomba como NPC animado (mecánica xeral do engine: anims + npcMove) ---------- */
function pombaNpc(i) {
  const [sx, sy] = POMBA_SITIOS[i];
  return {
    id: 'pomba' + i, name: 'Pombas', sheet: POMBA.sheet, spec: POMBA.spec, anims: POMBA.anims, idle: 0, shadow: false,
    x: sx, y: sy, w: 64, h: 84, at: () => [Math.max(120, Math.min(900, sx + (sx > 480 ? -90 : 90))), Math.min(536, sy + 10)], face: () => (sx > 480 ? 'R' : 'L'),
    when: () => nPombas() > i && !flag('estoupido'),
    patrol: { pts: [[sx, sy], [sx + 34, sy + 6], [sx - 26, sy - 4], [sx + 8, sy + 2]], speed: 34, pause: [0.6, 2.8], startWait: Math.random() * 2,
      walk: { R: [1, 2, 3], FR: [1, 2, 3], BR: [1, 2, 3], F: [1, 2, 3], B: [1, 2, 3] }, idle: { R: 0 }, fps: 9 },
    look: () => pombasMirar(), talk: () => pombasEspantar(),
    give: { millo: () => tirarMillo(), preservativo: () => inflar(), globo: () => estoupar(), navalla: () => hasItem('globo') ? estoupar() : MA('¿A una paloma? Ni loco. Yo pincho globos, no palomas.', 'enfadado') },
  };
}
// tres pombas mareadas no chan despois do golpe (ata que Martín abre a lata)
const MAREADAS = [[612, 512, 'marea', false], [700, 488, 'tumbada', true], [560, 528, 'marea', true]];
function mareadaNpc(i) {
  const [x, y, a, fl] = MAREADAS[i];
  return { id: 'mareada' + i, name: 'Pombas mareadas', sheet: POMBA.sheet, spec: POMBA.spec, anims: POMBA.anims, anim: a, flip: fl, shadow: false,
    x, y, w: 64, h: 84, at: [x + 80, Math.min(536, y + 8)], face: 'L', when: () => flag('estoupido') && !flag('pombasFora'),
    look: () => MA(a === 'tumbada' ? 'Esta está tumbada con la lengua fuera. Respira. Mañana lo contará en la plaza y nadie la creerá.' : 'Ve estrellitas. Literalmente. Se le pasará antes que a mí el susto.', 'avergonzado'),
    talk: () => MA('Lo siento, compañeras. Era por una buena causa. Cuando os recuperéis, el maíz es vuestro.', 'avergonzado'),
    give: { millo: () => MA('Ahora mismo no están para comer. Están para que alguien les cuente cuántos dedos tengo.', 'avergonzado') } };
}

/* ---------- a cadea ---------- */
async function pombasMirar() {
  const n = nPombas();
  if (n >= POMBA_CHEO) return MA('El taller entero es palomas. Si ahora se asustan todas a la vez, salen disparadas hacia arriba... hacia el tejado. Y hacia el soporte.', 'pensativo');
  if (n === 1) return MA('La paloma del nido, comiendo como si no hubiese probado bocado desde 1958. Me mira de lado. Quiere más.', 'risueno');
  return MA(`${n} palomas picoteando. Por el agujero del tejado siguen llegando. En Monforte, las noticias vuelan. Literalmente.`, 'sonriente');
}
async function pombasEspantar() {
  const n = nPombas();
  if (n < POMBA_CHEO) { SFX.coo(); return MA('¡Shhh! ...Ni caso. Siguen comiendo. Para asustar a una paloma de Monforte hace falta algo más que un maquinista.', 'esceptico'); }
  SFX.coo();
  await MA('¡UH! ¡FUERA!', 'enfadado');
  await MA('...Ni se inmutan. Una me ha mirado con pena.', 'avergonzado');
  await MA('Necesito un ruido de verdad. Un petardo de San Lucas. O uno de aquellos globos del instituto, que reventaban como un petardo.', 'pensativo');
  setFlag('pombasRuido');
}
async function tirarMillo() {
  if (!hasItem('millo')) return;
  if (E.sceneId !== 'tallerA2') {
    if (E.sceneId === 'vigasA2') { await MA('Desde aquí no: el maíz, al suelo. Las palomas no comen en el techo.', 'risueno'); return goScene('tallerA2', [560, 520]); }
    return MA('¿Aquí? Medio Monforte de palomas detrás de mí por la calle. No: en mi taller.', 'esceptico');
  }
  const n = nPombas(), w = POMBA_ONDAS.findIndex(v => v > n);
  if (!A4()) return MA('¿Echar maíz en mi taller? No hay ninguna razón para llenar esto de palomas. Todavía.', 'dudoso');
  if (w < 0) return MA('No cabe ni una más. Esto parece la plaza de San Marcos, pero con menos turistas y más olor a serrín.', 'risueno');
  pose(MARTIN.pick, 0.6); SFX.noise(0.4, 4200, 0.6, 0.1, 0, 'highpass');
  const nova = POMBA_ONDAS[w];
  if (n === 0) await MA('Un puñado de maíz al suelo, como quien no quiere la cosa...', 'pensativo');
  else await MA('Otro puñado. A ver si tiene primas.', 'sonriente');
  await chegan(n, nova);
  setFlag('pombas', nova);
  if (nova === 1) {
    await MA('¡La del nido! Ha bajado en picado. Picotea como si no hubiese comido desde 1958.', 'sorprendido');
    await MA('¿Y si echo más? ¿Vendrán las primas?', 'dudoso');
  } else if (nova === 3) await MA('¡Dos más! Han entrado por el agujero del tejado. Han corrido la voz.', 'sorprendido');
  else if (nova === 6) await MA('Seis. Esto ya es una asamblea vecinal. Falta Concha tomando nota.', 'risueno');
  else {
    await MA('Diez palomas. El taller está lleno. Hay más palomas que en la plaza de la estación un domingo.', 'entusiasmado');
    await MA('Y ahora, si se asustasen todas a la vez... saldrían disparadas hacia arriba. Hacia el tejado. Y hacia el séptimo soporte.', 'pensativo');
  }
}
/* as pombas novas chegan voando dende arriba (o niño ou o burato do tellado) ata o seu sitio */
async function chegan(de, ata) {
  const S = SCENES.tallerA2, moves = [];
  E.flags.pombas = ata;                        // xa visibles; aínda fóra da pantalla
  for (let i = de; i < ata; i++) {
    const p = S.npcs.find(n => n.id === 'pomba' + i), [ox, oy] = POMBA_ORIXE[i], [sx, sy] = POMBA_SITIOS[i];
    p.x = ox; p.y = oy; p._p = null;
    moves.push(sleep((i - de) * 260).then(() => { SFX.flap(5, 0.1); return npcMove(p, sx, sy, { frames: POMBA.voar, fps: 12, speed: 520, flip: sx < ox }); }));
  }
  await Promise.all(moves);
  SFX.coo();
}
async function inflar() {
  if (!hasItem('preservativo')) return;
  if (E.sceneId !== 'tallerA2' && E.sceneId !== 'vigasA2') return MA('¿Inflar un preservativo aquí, en público? Mi madre se entera en Vilatán antes de que acabe de soplar.', 'avergonzado');
  if (!A4()) return MA('¿Inflarlo para qué? Si alguien entra ahora en el taller, no tengo explicación. Ni la busco.', 'avergonzado');
  take('preservativo'); give('globo');
  await MA('Fuuuu... fuuuu... Ya está. Un globo de farmacia, como en el instituto. Menos mal que en este taller no entra nadie.', 'avergonzado');
  await MA('Bueno. Nadie con llave.', 'esceptico');
  if (nPombas() < POMBA_CHEO) await MA('Lo guardo para cuando el público esté completo.', 'pensativo');
}
async function estoupar() {
  if (!hasItem('globo')) return;
  if (!hasItem('navalla')) return MA('Necesito algo que pinche. La navaja de la cocina, por ejemplo.', 'pensativo');
  if (E.sceneId !== 'tallerA2') return MA(E.sceneId === 'vigasA2' ? 'Desde aquí abajo mirando arriba no veo cuántas palomas hay. Mejor bajo la mirada.' : '¿Reventarlo aquí? Me llevo un susto yo, otro la vecina y ninguno sirve para nada.', 'esceptico');
  const n = nPombas();
  if (n < POMBA_CHEO) return MA(n ? `Con ${n === 1 ? 'una paloma' : n + ' palomas'}, el susto se queda corto. Quiero el taller lleno. Más maíz.` : 'Sin palomas, solo asusto a la humedad. Primero, público.', 'pensativo');
  await cadeaEstoupido();
}

/* ---------- o estoupido ---------- */
async function cadeaEstoupido() {
  const S = SCENES.tallerA2;
  await MA('Globo en una mano, navaja en la otra. Tres, dos, uno...', 'convencido');
  take('globo'); E.flashT0 = E.t; SFX.bang(); SFX.flap(14, 0.16);
  setFlag('estoupido');                              // as do chan pasan a ser as que voan
  const voan = [];
  for (let i = 0; i < POMBA_CHEO; i++) {
    const p = S.npcs.find(n => n.id === 'pomba' + i);
    voan.push({ ...p, id: 'voa' + i, when: () => true, patrol: null, _p: null, x: p.x, y: p.y });
  }
  S.npcs.push(...voan);
  await Promise.all(voan.map((p, i) => sleep(i * 50).then(() => npcMove(p, p.x + (p.x < 480 ? -120 : 60) + Math.random() * 80, -80, { frames: POMBA.voar, fps: 14, speed: 900, flip: p.x < 480 }))));
  S.npcs = S.npcs.filter(n => !voan.includes(n));
  await sleep(300);
  E.vooT0 = null; await goScene('vigasA2');
  E.vooT0 = E.t; SFX.flap(16, 0.14);
  for (const [k, ms] of [[0, 900], [1, 1300], [2, 1700]]) setTimeout(() => SFX.noise(0.18, 600, 0.9, 0.5, 0, 'lowpass'), ms);   // tres golpes contra o ferro
  setTimeout(() => { SFX.tone(140, 0.6, 'square', 0.18); SFX.noise(0.4, 1800, 0.6, 0.3); }, 1900);                         // a tapa sóltase
  await sleep(3300);
  setFlag('tapaCaida'); setFlag('soporteAberto'); E.vooT0 = null;
  await MA('...', 'sorprendido');
  await MA('Tres palomas contra la tapa, una detrás de otra. Y los cuatro puntos de soldadura, que aguantaron setenta años... han saltado.', 'sorprendido');
  await MA('La tapa ha caído al suelo. Y el soporte está abierto.', 'entusiasmado');
  await MA('A ver cómo le explico yo a quien soldase esto que se lo ha abierto una paloma. Bueno, tres.', 'risueno');
  toast('Novo obxectivo: ver que hai dentro do 7.º soporte');
}
// a tapa recortada do propio debuxo de Oscar (bg-taller-arriba.jpg, 1600×900 → 960×540: ×0.6)
const TAPA_SRC = [1108, 218, 220, 266], TAPA_DST = [665, 131, 132, 160];
function pintarTapa(c, x, y, w, h, rot) {
  const im = img('img/bg-taller-arriba.jpg'); if (!im) return;
  c.save(); c.translate(x, y); c.rotate(rot); c.drawImage(im, ...TAPA_SRC, -w / 2, -h / 2, w, h); c.restore();
}
function pintarSoporteAberto(c) {
  const g = c.createLinearGradient(0, 140, 0, 282); g.addColorStop(0, '#0e0b09'); g.addColorStop(1, '#2a211a');
  c.fillStyle = g; c.fillRect(676, 142, 104, 136); c.strokeStyle = '#4a3a2c'; c.lineWidth = 3; c.strokeRect(676, 142, 104, 136);
  c.fillStyle = '#5a5550'; for (const [x, y] of [[687, 150], [766, 160], [694, 260], [775, 269]]) { c.beginPath(); c.arc(x, y, 3.5, 0, 7); c.fill(); }   // os buratos dos parafusos
  if (!flag('lataCollida')) {                                                                  // a lata, deitada no fondo da caixa
    c.fillStyle = '#7a5a2a'; c.fillRect(694, 236, 66, 30); c.fillStyle = '#9a7a3a'; c.fillRect(694, 232, 66, 7);
    c.fillStyle = '#b8322a'; c.fillRect(712, 244, 30, 14); c.strokeStyle = '#2a1a0a'; c.lineWidth = 2; c.strokeRect(694, 232, 66, 34);
  } else { c.fillStyle = 'rgba(160,120,70,.25)'; c.fillRect(690, 250, 76, 22); }
}
/* o voo visto dende abaixo: sete pombas cruzan as vigas; tres pétanse contra a tapa e caen mareadas; a tapa cae */
const VOO = [
  { x0: 300, y0: 600, x1: 708, y1: 200, t0: 0.15, t1: 0.9, golpe: true },
  { x0: 520, y0: 620, x1: 742, y1: 236, t0: 0.6, t1: 1.3, golpe: true },
  { x0: 180, y0: 620, x1: 700, y1: 168, t0: 0.95, t1: 1.7, golpe: true },
  { x0: 420, y0: 640, x1: 160, y1: 180, t0: 0.0, t1: 1.0 },
  { x0: 640, y0: 640, x1: 230, y1: 120, t0: 0.3, t1: 1.4 },
  { x0: 80, y0: 600, x1: 110, y1: 250, t0: 0.5, t1: 1.3 },
  { x0: 860, y0: 640, x1: 260, y1: 230, t0: 0.8, t1: 2.0 },
];
function pintarVoo(c, t) {
  const k = t - E.vooT0;
  // a tapa: treme cos golpes e cae ao 1,9 s
  const [x, y, w, h] = TAPA_DST, cx = x + w / 2, cy = y + h / 2;
  if (k < 1.9) { const sh = VOO.some(v => v.golpe && k > v.t1 && k < v.t1 + 0.2) ? 3 : 0; pintarSoporteAberto(c); pintarTapa(c, cx + (Math.random() - 0.5) * sh, cy, w, h, 0); }
  else { pintarSoporteAberto(c); const f = k - 1.9; pintarTapa(c, cx + f * 60, cy + f * f * 700, w, h, f * 2.4); }
  for (const v of VOO) {
    if (k < v.t0) continue;
    const u = Math.min(1, (k - v.t0) / (v.t1 - v.t0));
    if (u < 1) {                                                   // voando cara ao destino
      const x = v.x0 + (v.x1 - v.x0) * u, y = v.y0 + (v.y1 - v.y0) * u - Math.sin(u * Math.PI) * 40;
      drawSprite(POMBA.sheet, v.golpe && u > 0.7 ? 10 + Math.floor(k * 10) % 3 : POMBA.voar[Math.floor(k * 14) % 3], x, y + 50, 150, v.x1 < v.x0, POMBA.spec);
    } else if (v.golpe) {                                          // golpe: estrelas e caída mareada
      const f = k - v.t1, y = v.y1 + f * f * 900;
      if (y < 620) {
        if (f < 0.35) { c.save(); c.fillStyle = '#ffd23a'; for (let i = 0; i < 5; i++) { const a = i * 1.26 + f * 8; c.beginPath(); c.arc(v.x1 + Math.cos(a) * 30, v.y1 - 20 + Math.sin(a) * 16, 4, 0, 7); c.fill(); } c.restore(); }
        c.save(); c.translate(v.x1, y + 40); c.rotate(f * 5); drawSprite(POMBA.sheet, 14 + Math.floor(f * 6) % 3, 0, 0, 150, false, POMBA.spec); c.restore();
      }
    }
  }

}

/* ---------- escenas: taller (chan) e vigas ---------- */
{
  const T = SCENES.tallerA2;
  T.npcs = [...(T.npcs || []), ...POMBA_SITIOS.map((_, i) => pombaNpc(i)), ...MAREADAS.map((_, i) => mareadaNpc(i))];
  T.use = { millo: () => tirarMillo(), preservativo: () => inflar(), globo: () => estoupar() };
  const dT = T.draw;
  T.draw = function (c, t) {
    if (dT) dT.call(this, c, t);
    const n = flag('estoupido') ? 0 : nPombas();
    if (n) { c.fillStyle = '#f2c230'; for (let i = 0; i < n * 7; i++) { const [sx, sy] = POMBA_SITIOS[i % n], a = i * 2.39; c.fillRect(sx + Math.cos(a) * (12 + i % 5 * 7), sy + 2 + Math.sin(a) * 5, 3, 2); } }   // grans de millo
    if (flag('tapaCaida')) pintarTapa(c, 664, 506, 60, 72, 1.25);   // a tapa, no chan ao pé do piar
  };
  const dF = T.drawFront;
  T.drawFront = function (c, t) {
    if (dF) dF.call(this, c, t);
    if (E.flashT0 == null) return;
    const k = (t - E.flashT0) / 0.9; if (k > 1) { E.flashT0 = null; return; }
    c.save(); c.fillStyle = `rgba(255,250,230,${0.85 * (1 - k)})`; c.fillRect(0, 0, W, H);
    c.globalAlpha = 1 - k; c.translate(480, 230); c.scale(1 + k * 0.6, 1 + k * 0.6); c.rotate(-0.12);
    c.font = '900 92px "Trebuchet MS", sans-serif'; c.textAlign = 'center'; c.lineWidth = 12; c.lineJoin = 'round'; c.strokeStyle = '#1a1210'; c.strokeText('¡PAM!', 0, 0); c.fillStyle = '#ffd23a'; c.fillText('¡PAM!', 0, 0);
    c.restore();
  };
  T.hotspots.push({ name: 'Tapa no chan', when: () => flag('tapaCaida'), r: [626, 476, 78, 56],
    look: () => MA('La tapa del séptimo soporte, en el suelo. Con cuatro puntos de soldadura partidos y una marca de pico en el centro. Remedios, si lo ves, no preguntes.', 'risueno'),
    act: () => MA('Pesa como un yunque pequeño. Que se quede ahí: es el trofeo de las palomas.', 'sonriente') });
  const oE = T.onEnter;
  T.onEnter = async function () {
    if (A4() && nPombas() && !flag('estoupido') && !flag('pombasVolta')) { setFlag('pombasVolta'); await MA('Siguen aquí. El maíz de Genaro engancha.', 'risueno'); return; }
    if (oE) return oE.call(this);
  };
}
{
  const V = SCENES.vigasA2, dV = V.draw;
  V.draw = function (c, t) {
    if (E.vooT0 != null) { pintarVoo(c, t); return; }
    if (flag('tapaCaida')) {
      pintarSoporteAberto(c);
      // a mesma frecha de «Baixar a mirada» que pinta a escena orixinal
      if (!E.dlg && !E.busy && !(E.olloT > 0)) { c.save(); c.translate(480, 512); c.rotate(Math.PI / 2); c.globalAlpha = 0.75 + 0.25 * Math.sin(t * 3); c.lineJoin = c.lineCap = 'round';
        c.beginPath(); c.moveTo(-11, -19); c.lineTo(11, 0); c.lineTo(-11, 19); c.lineWidth = 13; c.strokeStyle = '#0b0c0e'; c.stroke(); c.lineWidth = 6; c.strokeStyle = '#9fe0ff'; c.stroke(); c.restore(); }
    } else dV.call(this, c, t);
    // a pomba no niño (Acto 4, antes do primeiro puñado de millo)
    if (A4() && !nPombas()) drawSprite(POMBA.sheet, 0, 826 + Math.sin(t * 0.7) * 2, 142, 120, true, POMBA.spec);
  };
  const H = n => V.hotspots.find(h => h.name === n);
  const tapa = H('Tapa do sétimo soporte'), parafusos = H('Parafusos da tapa'), caixa = H('Caixa do soporte'), nino = H('Niño'), burato = H('Burato do tellado');
  tapa.done = () => flag('soporteAberto') || (flag('pistaSoporte') && !A4());
  tapa.when = () => !flag('tapaCaida');
  parafusos.when = () => !flag('soporteAberto');
  delete tapa.use.piqueta; delete parafusos.use.piqueta;   // a piqueta de Remedios xa non abre o soporte (16-11-2026)
  const tapaAct = tapa.act;
  tapa.act = async () => {
    await tapaAct();
    if (!A4() || flag('soporteAberto')) return;
    await MA('Sin herramientas de soldador, esto no lo abro yo. Haría falta darle un buen golpe a la tapa... y yo, colgado del eje, no tengo fuerza ni para un estornudo.', 'pensativo');
    if (!flag('pombaVista')) await MA('(Y esa paloma del nido me mira como si se riera de mí.)', 'esceptico');
    setFlag('tapaGolpe');
  };
  nino.look = async () => {
    if (!A4()) return MA('Un nido de paja en la viga, bien hecho, redondo. Ahora está vacío. Alguien tiene aquí mejor casa que yo en Valencia.', 'sonriente');
    if (nPombas() || flag('estoupido')) return MA('El nido, vacío. La dueña ha bajado a comer. O se ha ido a contarlo a la plaza.', 'risueno');
    setFlag('pombaVista'); SFX.coo();
    await MA('Ha vuelto la dueña: una paloma gorda, gris, con cara de revisora. Me mira de lado, como si me fuese a pedir el billete.', 'sonriente');
    await MA('En la plaza de la estación, las palomas solo se mueven por una cosa: las migas. Y las mejores migas de la calle son las de la panadería de Genaro.', 'pensativo');
  };
  nino.act = () => A4() && !nPombas() && !flag('estoupido') ? MA('Si subo a por ella, me pica, se va y no vuelve. No: a esta hay que convencerla de que baje sola.', 'pensativo') : MA('No toco. Si vuelve la dueña y lo encuentra revuelto, me denuncia en el Concello. Y Eladio le da cita.', 'risueno');
  burato.look = () => MA(A4() ? 'El tejado está roto y entra la luz a chorros. Y por ahí entran y salen las palomas de media estación, como Pedro por su casa.' : 'El tejado está roto y entra la luz a chorros. Cielo azul entre las tablas. Bonito para una foto. Peligroso para una siesta.', 'esceptico');
  const cxLook = caixa.look;
  caixa.look = () => flag('tapaCaida') ? MA(flag('lataCollida') ? 'El soporte abierto. Por dentro, ni grasa: solo el hueco cuadrado de una lata.' : 'El soporte, abierto de par en par. Dentro no hay grasa. Hay una lata.', 'pensativo') : cxLook();
  V.hotspots.unshift({ name: 'Lata', key: true, when: () => flag('tapaCaida') && !flag('lataCollida'), done: () => flag('lataCollida'), r: [684, 216, 92, 66],
    look: () => MA('Una lata de tabaco, al fondo de la caja. Setenta años esperando a que alguien llegase. Ha llegado una paloma. Y luego yo.', 'sorprendido'),
    act: async () => {
      await MA('Subo por los agujeros del ladrillo, me agarro al eje y meto la mano en la caja...', 'convencido');
      setFlag('lataCollida'); give('lata');
      await MA('Una lata de tabaco. Escondida encima de un pilar, debajo de cuatro tornillos soldados. Xosé, eres un artista.', 'sorprendido');
      await MA('Está cerrada a conciencia. Habrá que hacer palanca.', 'pensativo');
    } });
  V.use = { millo: () => tirarMillo(), preservativo: () => inflar(), globo: () => estoupar() };
}

/* ---------- a lata aberta: o parte (e, de momento, o final do tramo xogable) ---------- */
{
  const abrir = ITEMS.navalla.combine.lata;
  ITEMS.navalla.combine.lata = async () => {
    await abrir();
    if (!A4() || flag('a4Parte')) return;
    setFlag('a4Parte'); setFlag('pombasFora');
    await MA('Para quien venga a buscar. Pues aquí estoy, Xosé. Setenta años tarde, pero aquí.', 'pensativo');
    await MA('(Abajo, las palomas mareadas se recuperan y se van por el tejado. Ofendidas.)', 'risueno');
    await showDoc('<h4>ACTO 4 · A implicación</h4><p>Ata aquí chega, de momento, o Acto 4: a tapa do sétimo soporte e o parte de 1958.</p><p>O resto (a válvula de Pepe, o carbón de Andrés e o permiso de Eladio) chegará nun próximo hito.</p>');
  };
  // en calquera orde: a lata tamén se abre se se escolle primeiro e despois a navalla
  ITEMS.lata.combine = { ...(ITEMS.lata.combine || {}), navalla: () => ITEMS.navalla.combine.lata() };
}

/* O millo conséguese na Panadería Estación (cambiazo de sacos de serrín por millo, fío «Montar nuevo exterior de la farmacia»):
   aquí só se usa o obxecto 'millo'. */

/* ---------- comezo provisional do Acto 4 (só o soporte) ---------- */
async function inicioActo4Pombas() {
  E.act = 'acto4';
  await showDoc('<h4>ACTO 4 · «A implicación»</h4><p>Venres.</p><p>Un motor con parafusos novos nas cocheras, alguén que busca algo dentro... e no meu taller, unha caixa que ninguén abriu en setenta anos.</p><p class="sub">Obxectivo: abrir a tapa do sétimo soporte. (Tramo en obras: de momento só esta parte do Acto 4.)</p>');
  await goScene('casaSalon', [600, 480]);
  await MA('Viernes. Anoche, en las cocheras, el motor de Xosé tenía los tornillos de la tapa nuevos. Alguien lo abre buscando algo.', 'pensativo');
  await MA('Pero si Xosé escondió algo, no lo dejó en un motor que se podía vender. Lo dejó donde no se mueve nada: en el séptimo soporte de mi taller. Con los tornillos soldados.', 'convencido');
  setFlag('a4Soporte');
  toast('Novo obxectivo: abrir a tapa do 7.º soporte (taller, mirando ás vigas)');
}
{
  const f3 = fimActo3;
  fimActo3 = async () => { await f3(); if (!flag('a4Soporte')) await inicioActo4Pombas(); };
}

/* ---------- preset do Acto 4 en «Escoller acto» ---------- */
{
  const F = { ...(ACTS.find(a => a.id === 'acto3').flags || {}) };
  for (const k of ['a3XoseN', 'a3Graxa', 'libro1958', 'candadoAberto', 'pistaLousa', 'pistaMotor', 'pistaPeza', 'pistaPegadasC', 'pistaCarbon', 'a3Noite', 'a3NoiteEntrada',
    'anxoPastillas', 'inxectorFeito', 'fimActo3', 'vigasArribaVisto']) F[k] = true;
  const i = ACTS.findIndex(a => a.id === 'acto4');
  ACTS[i] = { id: 'acto4', name: 'Acto 4 · A implicación', desc: 'Venres (en obras): o sétimo soporte, as pombas do taller e o parte de 1958',
    scene: 'casaSalon', at: [600, 480], inv: ['chavesCasa', 'contrato', 'navalla', 'chave', 'foto1949', 'trapo'], flags: F,
    intro: async () => { E.act = 'acto4'; await MA('Viernes. Si Xosé escondió algo, lo dejó donde no se mueve nada: en el séptimo soporte de mi taller.', 'convencido'); setFlag('a4Soporte'); toast('Novo obxectivo: abrir a tapa do 7.º soporte (taller, mirando ás vigas)'); } };
}

/* ---------- caderno de Martín · Acto 4 (tramo das pombas) ---------- */
CADERNO.push(
  { when: () => A4() && !flag('soporteAberto') && !flag('tapaGolpe') && !flag('pombaVista'), t: 'Abrir la tapa del séptimo soporte: en el taller, mirando arriba a las vigas.' },
  { when: () => A4() && !flag('soporteAberto') && flag('tapaGolpe') && !flag('pombaVista') && !hasItem('millo'), t: 'La tapa tiene los tornillos soldados y yo, colgado del eje, no tengo fuerza para darle un buen golpe. ¿Qué más hay ahí arriba?' },
  { when: () => A4() && flag('pombaVista') && !hasItem('millo') && !nPombas(), t: 'En el nido del taller vive una paloma. En la plaza, las palomas van detrás de las migas de la panadería de Genaro.' },
  { when: () => A4() && hasItem('millo') && nPombas() < POMBA_CHEO && !flag('estoupido'), t: () => `Echar maíz en el suelo del taller (el saco en la mano y tocar el suelo). Palomas: ${nPombas()}. ¿Cuántas caben?` },
  { when: () => A4() && nPombas() >= POMBA_CHEO && !flag('estoupido'), t: () => 'El taller, lleno de palomas. Si se asustan todas a la vez, salen disparadas hacia arriba... hacia el soporte.' + (flag('pombasRuido') ? ' Hace falta un ruido de verdad, como un petardo o un globo que revienta.' : ' ¿Cómo se asusta a diez palomas?') },
  { when: () => A4() && flag('tapaCaida') && !flag('lataCollida'), t: 'La tapa ha caído. Mirar qué hay dentro del séptimo soporte (vigas del taller).' },
  { when: () => A4() && hasItem('lata'), t: 'Abrir la lata de tabaco. La navaja hace palanca.' },
  { when: () => flag('a4Parte'), t: 'Tengo el parte de 1958. (El resto del Acto 4, próximamente.)' },
);
