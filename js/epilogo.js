/* «Vía morta» · Epílogo: a visita de Adrián Amancio Nogeroles, presidente de Renfe (personaxe de ficción de Oscar, 21-11-2026).
   Despois da placa, nos dous finais: chaman á porta da Casa Juana e o presidente ofrécelle a Martín un contrato
   no «Servizo de Vías Mortas». Ficha E2 en docs/05_FICHAS_ESCENARIOS.md. Sprite: tools/sprite-presidente.py. */

const PRES = 'Adrián Nogeroles';
const PR = (t, m) => say(PRES, t, m);
PORTRAITS[PRES] = 'img/presidente-face.png';
PORTRAIT_COLORS[PRES] = '#9fb4ff';
PORTRAIT_MOODS[PRES] = Object.fromEntries(['neutro', 'sonriente', 'serio', 'sorprendido', 'esceptico', 'triste', 'hablando', 'pensativo'].map(e => [e, `img/presidente/${e}.webp`]));

/* celas da folla: 0 parado, 1 falando, 2-4 andar, 5 man no peto, 6 sinalando, 7 brazos abertos,
   8 cruzado, 9 pensando, 10 puño, 11 explicando, 12 sentado, 13 costas */
const PRES_POSE = { peto: 5, sinala: 6, abertos: 7, cruzado: 8, pensando: 9, puno: 10, explica: 11, costas: 13 };
const presNpc = () => E.scene && E.scene.npcs && E.scene.npcs.find(n => n.id === 'presidente');
function presPose(nome) {                       // xesto fixo mentres fala; sen nome, volve a parado/falando
  const n = presNpc(); if (!n) return;
  if (!nome) { n.anim = null; return; }
  n.anims[nome] = { f: [PRES_POSE[nome]] }; npcAnim(n, nome);
}
const PRES_ANDAR = [2, 3, 4, 3];

function pintarSobre(c) {                         // o sobre do Expediente n.º 2, enriba da mesa
  c.save(); c.translate(604, 262); c.rotate(-0.08); c.scale(0.8, 0.55);
  c.fillStyle = '#e9dcb8'; c.fillRect(-30, -18, 60, 36); c.strokeStyle = '#7a6a48'; c.lineWidth = 1.5; c.strokeRect(-30, -18, 60, 36);
  c.beginPath(); c.moveTo(-30, -18); c.lineTo(0, 4); c.lineTo(30, -18); c.stroke();
  c.fillStyle = '#9a1a1a'; c.beginPath(); c.arc(0, 4, 5, 0, 7); c.fill();
  c.restore();
}

SCENES.salonEpilogo = {
  ...SCENES.salon, name: 'Casa Juana · salón', onEnter: null,
  draw(c, t) {
    if (flag('finalValencia')) {                  // caixas da mudanza
      c.save(); for (const [x, y, w, h] of [[170, 470, 90, 64], [190, 420, 70, 50], [800, 520, 100, 70]]) {
        c.fillStyle = '#b8894e'; c.fillRect(x, y - h, w, h); c.strokeStyle = '#6e4e26'; c.lineWidth = 2; c.strokeRect(x, y - h, w, h);
        c.fillStyle = '#d8c79a'; c.fillRect(x, y - h + h * 0.42, w, 7);
      } c.restore();
    }
    if (flag('presSobre')) pintarSobre(c);
  },
  hotspots: [
    ...SCENES.salon.hotspots.filter(h => !h.exit && !h.use),
    { name: 'Sobre', key: true, when: () => flag('presSobre'), r: [570, 244, 70, 38], at: [600, 470], face: 'B',
      look: () => MA('«Expediente n.º 2. Confidencial.» Lacrado. Con el logo de Renfe y una vía que se acaba.', 'pensativo'),
      act: () => MA(flag('presAcepta') ? 'Lo abro en el tren. Como los maquinistas de verdad: con un café de máquina y sin prisa.' : 'Aún no. Si lo abro, ya he dicho que sí. Y lo sé. Y él lo sabe.', 'risueno') },
  ],
  npcs: [
    { id: 'presidente', name: PRES, key: true, sheet: 'img/presidente-sprite.png', spec: { cw: 160, ch: 280, cols: 8 }, idle: 0, talkFrames: [1, 0], anims: {},
      x: 110, y: 470, w: 64, h: 316, at: [560, 480], face: 'L', when: () => flag('presVisita'),
      look: () => MA('Traje azul marino, corbata granate y la insignia de Renfe en la solapa. Barba de quien duerme poco y viaja mucho.', 'pensativo'),
      talk: async () => {
        if (!flag('fimXogo')) return;
        presPose('peto'); await PR('O expediente non ten présa, Martín. Os trens esquecidos levan anos agardando. Uns días máis non lles fan nada.', 'sonriente'); presPose();
      },
      give: { parte: async () => { await PR('Gárdao ti. É de Xosé, e despois de todo isto, un pouco teu.', 'sonriente'); } } },
  ],
};

async function visitaPresidente() {
  setFlag('presVisita');
  const n = presNpc(); n.x = 90; n.y = 470;
  SFX.tone(660, 0.35, 'sine', 0.25); SFX.tone(523, 0.6, 'sine', 0.25, 0.4);      // din-don
  await sleep(900);
  await MA(flag('finalValencia') ? '¿Ahora? Si ya está todo en cajas.' : '¿Quién llama a la puerta? Concha no llama: entra.', 'dudoso');
  await npcMove(n, 380, 480, { frames: PRES_ANDAR, fps: 8, speed: 90 });
  await PR('Bos días. Martín, non si? Adrián Amancio Nogeroles. Presidente de Renfe.', 'sonriente');
  await MA('¿El presidente... de Renfe? ¿Aquí? ¿En la Casa Juana?', 'sorprendido');
  presPose('peto');
  await PR('Tranquilo, que non veño multarte. Aínda que unha Mikado de 1950 saíndo un sábado pola noite por un ramal sen servizo...', 'esceptico');
  await MA('Con permiso. Sellado por Eladio. Y ciento doce firmas.', 'orgulloso');
  presPose('explica');
  await PR('Xa o sei. O T-14 chegou á miña mesa. En Madrid ninguén vira nunca un formulario asinado por medio pobo.', 'hablando');
  presPose('pensando');
  await PR('Despois lin o parte do catorce de xaneiro do cincuenta e oito. Freo a tres quilos. «Reparación denegada».', 'serio');
  await PR('Sesenta e oito anos dentro dun soporte. E ti sacáchelo cunha bandada de pombas.', 'pensativo');
  await MA('Las palomas hicieron la mitad. Y Remedios, Andrés, Concha, Eladio, Xoán, Don Anxo... Yo solo pasaba por aquí.', 'risueno');
  presPose();
  await PR('Iso é o que din sempre os bos.', 'sonriente');
  presPose('abertos');
  await PR('Renfe ten un servizo que non sae no organigrama. Trens esquecidos, vías mortas, papeis que alguén escondeu para que outro os atopase.', 'hablando');
  await PR('Chamámoslle o Servizo de Vías Mortas.', 'hablando');
  presPose('sinala');
  await PR('E fáltame un maquinista que saiba escoitar un asubío.', 'sonriente');
  presPose();
  if (flag('finalValencia')) {
    await MA('Me esperan en Valencia. Jefe de maquinistas.', 'pensativo');
    await PR('Valencia xa está avisada. O servizo ten a sede onde faga falta: hoxe Valencia, mañá quen sabe.', 'sonriente');
  } else {
    await MA('Acabo de decirle a mi madre que me quedo en Monforte.', 'pensativo');
    await PR('Mellor aínda. Monforte foi nó ferroviario cen anos. A sede pode estar aquí, na Casa Juana, se ma alugas.', 'sonriente');
  }
  const k = await choose([
    { t: 'Acepto. ¿Cuál es la primera misión?' },
    { t: '¿Y si digo que no?' },
    { t: 'Déjeme pensarlo. Con un caldo delante.' },
  ]);
  if (k === 0) {
    setFlag('presAcepta');
    await PR('Sabía que dirías iso. Está todo neste sobre.', 'sonriente');
  } else if (k === 1) {
    presPose('cruzado');
    await PR('Entón deixareiche isto enriba da mesa. Por se cambias de idea.', 'esceptico');
    await MA('(No voy a cambiar de idea.) (Ya he cambiado de idea.)', 'avergonzado');
    presPose();
  } else {
    await PR('O caldo de Vilatán? Ese tamén chegou ao meu despacho. Pensa canto queiras: o sobre queda aquí.', 'sonriente');
  }
  setFlag('presSobre'); SFX.tone(220, 0.08, 'triangle', 0.15);
  await PR('Expediente número dous. Confidencial.', 'serio');
  presPose('costas');
  await npcMove(n, 120, 470, { frames: PRES_ANDAR, fps: 8, speed: 90, flip: true });
  presPose();
  await PR('Ah, Martín. O silbato da Mikado... soa ben.', 'sonriente');
  await MA('Dos largos y uno corto.', 'sonriente');
  await PR('Iso mesmo. Ata pronto, maquinista.', 'neutro');
}

/* o epílogo de acto5.js: placa → visita do presidente → FIN («Continuará») */
epilogo = async function () {
  setFlag('fimXogo');
  await showDoc('<h4>Epílogo</h4><p>Un luns calquera, no vestíbulo da estación de Monforte, xunto ao mural de 1954, alguén puxo unha placa pequena.</p><p style="font-size:20px;text-align:center"><b>Xosé Nogal, maquinista.<br>14 de xaneiro de 1958.</b></p><p class="sub">Dicía Concha que, aquela mañá, o primeiro rexional asubiou dúas veces longas e unha curta. Ninguén o puido demostrar.</p>');
  await showDoc(flag('finalValencia') ? '<h4>Martes, 9:00</h4><p>Casa Juana. O último día. Todo en caixas.</p>' : '<h4>Unha semana despois</h4><p>Casa Juana. Martín aínda non colgou ningún cadro.</p>');
  await goScene('salonEpilogo', [640, 500]);
  E.actor.face = 'L';
  await visitaPresidente();
  await showDoc(`<h4>FIN · «Vía morta»</h4><p>${flag('finalValencia') ? 'Martín volveu a Valencia, xefe de maquinistas. Todos os domingos, caldo en Vilatán.' : 'Martín quedou en Monforte, na Casa Juana. O taller segue baleiro. Polo de agora.'}</p><p>Enriba da mesa, un sobre lacrado: <b>Expediente n.º 2</b>.</p><p style="text-align:center"><b>Continuará...</b></p><p>Grazas por xogar.</p><p class="sub">Unha obra de ficción inspirada en lugares reais de Monforte de Lemos. Os créditos e as fontes están no menú.</p>`);
  toast('Fin do xogo. Grazas por xogar!');
};

/* «Escoller acto»: o epílogo do presidente para probalo directo */
{
  const A5 = ACTS.find(a => a.id === 'acto5');
  if (A5) ACTS.push({ id: 'epilogo', name: 'Epílogo · O presidente', desc: 'A visita de Adrián Amancio Nogeroles, presidente de Renfe, despois do final',
    scene: 'vilatan', at: [420, 500], inv: A5.inv, flags: { ...A5.flags, a5Inicio: true, a5Xirada: true, a5Saida: true, a5Agulla: true, a5Asubiado: true, a5Vilatan: true, finalMonforte: true },
    intro: () => epilogo() });
}
