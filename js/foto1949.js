/* =====================================================================
   A foto de 1949 (ilustración e reverso de Oscar, 16-11-2026). Ficción do xogo.
   · Frente: o señor Alfredo cos tres aprendices. Reverso: «O señor Alfredo cos aprendices, 1949.
     Pepe, Manolo, Xosé N.» (a lapis) e «Xosé entra en Renfe. Sorte, rapaz.» (bolígrafo azul, letra de Pepe).
   · Quen é quen (decidido por Oscar): Xosé Nogal = o moreno dos brazos cruzados;
     Manolo = Don Anxo Castiñeira de rapaz (Manuel Anxo), o louro sentado;
     Pepe = o pai de Don Eladio, logo guardagullas, o roxo das pecas.
   · Mecánica: vela en grande (mirala ou usala con Martín) e virala; ensinarlla aos NPC.
     Concha dá a Pepe, Valerio dá a Manolo e Martín deduce a Xosé. Todo opcional.
   · Do señor Alfredo (persoa real) só se din feitos de 04_HECHOS.
   ===================================================================== */

/* notas a lapis que Martín vai apuntando sobre o frente (posicións en % da imaxe) */
function fotoMarcas() {
  return [
    flag('fotoAlfredo') && { x: 46, y: 45, t: 'Sr. Alfredo' },
    flag('fotoXose') && { x: 33, y: 86, t: 'Xosé N.' },
    flag('fotoManolo') && { x: 57, y: 92, t: 'Manolo (Anxo)' },
    flag('fotoPepe') && { x: 76, y: 84, t: 'Pepe' },
  ].filter(Boolean);
}
async function verFoto() {
  const primeira = !flag('fotoVista');
  setFlag('fotoVista');
  await showPhoto('img/foto1949.jpg', 'img/foto1949-reverso.jpg', fotoMarcas());
  if (flag('fotoXose')) {
    await MA('Xosé, Manolo y Pepe. Tres chavales con mono delante de una sierra.', 'pensativo');
    await MA('Uno acabó de maquinista, otro de fogonero y otro de guardagujas. De la madera al tren, los tres.', 'pensativo');
    return;
  }
  if (primeira) {
    await MA('Xosé N., aprendiz de carpintero en esta casa... y luego, ferroviario. Como yo, pero al revés: él llegó al tren desde la madera.', 'pensativo');
    await MA('Pepe, Manolo y Xosé N. Tres nombres, tres caras, y ni una pista de quién es quién. Alguien en Monforte tiene que conocerlos.', 'dudoso');
    return;
  }
  if (flag('fotoPepe')) await MA('El pelirrojo es Pepe, «Pepe da agulla». Me faltan el rubio sentado y el moreno.', 'dudoso');
  else if (flag('fotoManolo')) await MA('El rubio sentado es Manolo: Don Anxo de chaval. Me faltan el pelirrojo y el moreno.', 'dudoso');
  else await MA('Pepe, Manolo y Xosé N. Las caras ya me las sé de memoria. Los nombres, todavía no. Concha conoce a todo Monforte.', 'dudoso');
}
ITEMS.foto1949.look = verFoto;
ITEMS.foto1949.self = verFoto;

/* con dous nomes, o terceiro sae só */
async function fotoDeducir() {
  if (flag('fotoXose') || !flag('fotoPepe') || !flag('fotoManolo')) return;
  setFlag('fotoXose');
  await MA('Un momento. Si el pelirrojo es Pepe y el rubio sentado es Manolo...', 'pensativo');
  await MA('...el de los brazos cruzados, con la mano de Alfredo en el hombro, es Xosé N. Le acabo de poner cara.', 'convencido');
  toast('Na foto: Xosé N. é o moreno dos brazos cruzados');
}

/* busca un NPC por id en calquera escena */
function npcPorId(id) {
  for (const k in SCENES) { const n = (SCENES[k].npcs || []).find(o => o.id === id); if (n) return n; }
  return null;
}
function ensinarFoto(id, fn) {
  const n = npcPorId(id); if (!n) return;
  n.give = n.give || {};
  const prev = n.give.foto1949;
  n.give.foto1949 = () => fn(prev);
}

/* ---------- Concha: o señor Alfredo, Pepe da agulla e a nai que falaba do aprendiz que saudaba ---------- */
ensinarFoto('conchaQ', async () => {
  if (flag('fotoPepe')) {
    await CO('Xa cho dixen: o roxo é Pepe da agulla. E o moreno... aínda non me sae. Cando me saia, es o primeiro en sabelo.');
    if (!flag('fotoManolo')) await CO('E o louro sentado... pregúntalle a Valerio. Ese coñece a toda a xente vella de Monforte pola receita.');
    return;
  }
  await CO('A ver, que sen lentes non vexo nin o xornal...');
  await CO('O do bigote é o señor Alfredo, o da túa casa. Iso sábeo ata o can.');
  setFlag('fotoAlfredo');
  await CO('O roxo das pecas... ese era dos da agulla, dos que andaban de noite coa lanterna pola vía. Pepe, si. Pepe da agulla.');
  await MA('¿«Da agulla»? ¿Guardagujas?', 'sorprendido');
  await CO('Guardagullas. De quen era fillo ou pai, iso xa non mo pidas: a miña memoria é coma o quiosco, ten de todo e non atopo nada.');
  setFlag('fotoPepe');
  await CO('O moreno... ese non o coñecín. Pero miña nai falaba dun aprendiz de Alfredo que se fixo maquinista e saudaba ao pasar.');
  await MA('¿Saludaba? ¿Cómo?', 'dudoso');
  await CO('Iso xa non mo sei. Miña nai contaba moi ben os principios e moi mal os finais. Cando me saia o nome, es o primeiro en sabelo. Bueno, o segundo.');
  await CO('E o louro sentado... ese sorriso de non romper un prato... Non, non me sae. Hoxe non é o meu día.');
  if (!flag('fotoManolo')) await CO('Pregúntalle a Valerio. Ese coñece a toda a xente vella de Monforte pola receita.');
  await fotoDeducir();
});

/* ---------- Valerio: Manolo é Anxo (polas orellas) e as mans de Xosé ---------- */
ensinarFoto('valerio', async () => {
  if (!flag('fimActo2') || !flag('libro1958')) {
    await VA('Serrín e rapaces con mono... iso é antes do meu pai. Pero se algún destes se cortou cunha serra, está nos libros.');
    return;
  }
  if (!flag('fotoManolo')) {
    await VA('A ver... «Pepe, Manolo, Xosé N.».');
    await VA('Manolo? O louro sentado... Mira as orellas. As orellas non envellecen: só medran.');
    await VA('Ese é Anxo Castiñeira. Manuel Anxo Castiñeira. Meu pai contaba que de rapaz lle chamaban Manolo, e que despois do 58 só quixo ser Anxo. Nunca soubemos por que.');
    await MA('Don Anxo. El fogonero... de aprendiz en mi taller. Con Xosé N.', 'sorprendido');
    setFlag('fotoManolo');
    await fotoDeducir();
  }
  if (flag('fotoXose')) {
    await VA('E se o moreno é o teu Xosé Nogal, mírao: as mans enteiras.');
    await VA('Nove anos despois, meu pai curáballe esas mesmas mans.');
    await MA('(Y Anxo, a su lado, en el taburete. Luego, fogonero. ¿Fogonero de quién?)', 'preocupado');
  } else await VA('O roxo e o moreno non sei quen son. A Concha, pregúntalle a Concha: ela coñece a xente polo andar.');
});

/* ---------- Xoán: o desliz dos brazos cruzados ---------- */
ensinarFoto('xoan', async prev => {
  if (!flag('fimActo2') || !flag('fotoXose')) return prev();
  if (flag('fotoXoan')) { await XO('Os horarios, Martín. Eu sei de horarios.'); return; }
  await MA('El de los brazos cruzados es Xosé N.', 'convencido');
  await XO('Sempre cos brazos cruzados. Ata na...');
  await XO('...');
  await XO('Digo. Iso fano todos os que non saben que facer coas mans nunha foto.');
  await MA('(¿«Ata na» qué? ¿En la máquina? ¿Y cómo sabe él cómo se ponía Xosé?)', 'dudoso');
  setFlag('fotoXoan');
});

/* ---------- Mega Andrés: na foto está o seu avó, e el sábeo ---------- */
ensinarFoto('andres', async () => {
  await AN('Carpinteiros? Eu de madeira só entendo de tumboas.');
  await AN('...Agarda, que esa tumboa estaba torta.');
  await MA(flag('fotoManolo') ? '(No estaba torta. Y ha mirado al rubio sentado dos segundos de más. Es su abuelo. Y él lo sabe.)' : '(No estaba torta. Y ha mirado al rubio sentado dos segundos de más.)', 'pensativo');
});

/* ---------- Don Anxo: «Ese era outro» ---------- */
ensinarFoto('anxo', async prev => {
  if (!flag('fotoManolo')) return prev();
  await MA('El que está sentado es usted, ¿verdad? Manolo.', 'dudoso');
  await AX('...');
  await AX('Hai sesenta e oito anos que ninguén me chama así.');
  await AX('Ese era outro. Ese aínda durmía ben.');
  await MA('(No dice más. No hace falta.)', 'preocupado');
});

/* ---------- Don Eladio: nin a mira... e dálle a volta dúas veces (sementa o Acto 4) ---------- */
const eladioFoto = async () => {
  await EL('Isto é unha fotografía, non un T-14. Seguinte.');
  await MA('(Para no mirarla, le ha dado la vuelta dos veces.)', 'dudoso');
};
ensinarFoto('eladioV', eladioFoto);
ensinarFoto('eladioC', eladioFoto);

/* ---------- os que non saben, pero mandan a alguén ---------- */
ensinarFoto('rosario', async () => {
  await RO('O señor Alfredo! E mira a serra de cinta: a mesma da escritura do 52, a que se vendeu con todo o demais.');
  setFlag('fotoAlfredo');
  await RO('Dos rapaces non sei nada: eu sei o que poñen os papeis, e nos papeis non saen aprendices. Ensínalla a meu curmán Xoán, que é o das datas.');
});
const demetrioFoto = async () => {
  await DA('1949? Eu aínda nin xogaba. Pero o louro sentado ten pinta de dianteiro: mira como abre as pernas, listo para o contraataque.');
  await DA('Cinco euros a que Concha che di quen son. Esa coñece a xente polo andar, e iso que aí están quietos.');
};
ensinarFoto('david', demetrioFoto);
ensinarFoto('davidN', demetrioFoto);
ensinarFoto('genaro', async () => {
  await GE('Obxecto clave, iso.', 'explicando');
  await GE('Cando nunha aventura che dan unha foto vella con nomes detrás, é que media vila sae nela. Ensínalla a todos: o peor que pode pasar é un «non sei» con retranca.', 'guino');
});

/* ---------- caderno ---------- */
CADERNO.push({ when: () => flag('fimActo2') && !flag('fimActo3') && hasItem('foto1949') && !flag('fotoXose'),
  t: () => `(Opcional) Averiguar quién es quién en la foto de 1949: Pepe, Manolo y Xosé N. ${flag('fotoPepe') ? 'Pepe ya lo sé.' : 'Concha conoce a todo Monforte.'}${flag('fotoManolo') ? ' Manolo ya lo sé.' : ''}` });
