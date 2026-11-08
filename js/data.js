'use strict';
/* ==========================================================
   VÍA MORTA · datos da DEMO TÉCNICA (vertical slice)
   Catro escenas da Casa Juana para probar todas as mecánicas:
   camiñar, mirar, coller, usar obxecto en escenario, dar a un NPC,
   combinar obxectos, árbore de diálogo, cambio de escena e cinemática.
   A trama completa está en docs/03_HISTORIA_Y_PUZZLES.md.
   Martín fala en castelán; os NPC, en galego; a interface, en galego.
   ========================================================== */
const PORTRAITS = { 'Martín': 'img/martin-face.png', 'Dona Concha': 'img/concha-face.png', 'Xoán Carballeira': 'img/xoan.png' };
// cor dos bocadillos de cada personaxe
const PORTRAIT_COLORS = { 'Dona Concha': '#e6a8ff', 'Xoán Carballeira': '#d8ec2a' };
const MA = (t, mood) => say('Martín', t, mood);
const CO = t => say('Dona Concha', t);

/* ---------- obxectos do inventario ---------- */
// cada icona debúxase nun lenzo de 48×48 (substituír por PNG cando haxa arte)
const ico = {
  bolsa(c) { c.fillStyle = '#e8463a'; c.fillRect(12, 8, 24, 34); c.fillStyle = '#fff'; c.fillRect(12, 8, 24, 5); c.fillStyle = '#ffd23a'; for (const [x, y] of [[18, 22], [28, 26], [20, 33]]) { c.beginPath(); c.arc(x, y, 4, 0, 7); c.fill(); } },
  chave(c) { c.strokeStyle = '#d9b44a'; c.lineWidth = 4; c.beginPath(); c.arc(16, 24, 8, 0, 7); c.stroke(); c.fillStyle = '#d9b44a'; c.fillRect(23, 22, 20, 4); c.fillRect(36, 26, 4, 6); c.fillRect(30, 26, 3, 5); },
  navalla(c) { c.fillStyle = '#6b4a2a'; c.fillRect(6, 26, 22, 8); c.fillStyle = '#cfd4da'; c.beginPath(); c.moveTo(26, 26); c.lineTo(44, 22); c.lineTo(26, 31); c.fill(); },
  escritura(c) { c.fillStyle = '#efe4c8'; c.fillRect(10, 6, 28, 36); c.fillStyle = '#7a6a4a'; for (let i = 0; i < 6; i++) c.fillRect(14, 12 + i * 5, 20 - (i % 2) * 6, 2); },
  lata(c) { c.fillStyle = '#7a5a2a'; c.fillRect(8, 16, 32, 20); c.fillStyle = '#9a7a3a'; c.fillRect(8, 14, 32, 5); c.fillStyle = '#c33'; c.fillRect(16, 22, 16, 8); },
  parte(c) { c.fillStyle = '#e6d6a8'; c.save(); c.translate(24, 24); c.rotate(-0.15); c.fillRect(-14, -18, 28, 36); c.fillStyle = '#3a2a1a'; for (let i = 0; i < 6; i++) c.fillRect(-10, -12 + i * 5, 18, 1.5); c.restore(); },
};
const ITEMS = {
  ositos: { name: 'Bolsa de ositos', icon: ico.bolsa, look: () => MA('Ositos de goma del quiosco de Concha. Por los viejos tiempos. Quedan cuatro. Bueno, tres.', 'risueno') },
  chave: { name: 'Chave do taller', icon: ico.chave, look: () => MA('Una llave de hierro, grande, de las de antes. Pesa como una promesa.', 'pensativo') },
  navalla: { name: 'Navalla', icon: ico.navalla, look: () => MA('Una navaja de cocina vieja. Corta poco, pero hace palanca de maravilla.', 'neutro'),
    combine: { lata: async () => { take('lata'); give('parte'); await MA('Hago palanca... ¡crac! Dentro de la lata, un papel doblado, amarillo. «Parte de incidencia. 14 de xaneiro de 1958».', 'sorprendido'); await ITEMS.parte.look(); } } },
  escritura: { name: 'Copia da escritura', icon: ico.escritura, look: () => showDoc(DOC_ESCRITURA) },
  lata: { name: 'Lata de tabaco', icon: ico.lata, look: () => MA('Una lata de tabaco oxidada, cerrada a conciencia. Algo se mueve dentro. Papel, por el ruido.', 'dudoso') },
  parte: { name: 'Parte de 1958', icon: ico.parte, look: () => showDoc(DOC_PARTE) },
};
const DOC_ESCRITURA = `<h4>ESCRITURA N.º 375 · 2 de xuño de 1952</h4><p class="sub">Inventario da carpintaría de D. Alfredo Fernández Gutiérrez (Casa Juana)</p>
<table><tr><td>Serra de cinta</td><td>1</td></tr><tr><td>Serra circular</td><td>1</td></tr><tr><td>Cepilladora/regruesadora</td><td>1</td></tr><tr><td>Torno para madeira</td><td>1</td></tr><tr><td>Máquina de espigar</td><td>1</td></tr><tr><td>Pulidora</td><td>1</td></tr><tr><td>Taladros</td><td>sen precisar</td></tr><tr><td>Prensas</td><td>4</td></tr><tr><td>Bancos de traballo</td><td>3</td></tr><tr><td>Motores eléctricos Siemens</td><td>varios</td></tr><tr><td>Transmisións con poleas</td><td>2</td></tr></table><p class="pr">Prezo: 30.000 pesetas</p>`;
const DOC_PARTE = `<h4>PARTE DE INCIDENCIA · 14 de xaneiro de 1958</h4><p class="sub">Depósito de Monforte · Máquina Mikado</p>
<p>Freo automático dos vagóns do mercancías: <b>3 kg</b> (mínimo regulamentario: 5 kg). Medido ás 18:10, 19:30 e 20:45.</p><p>Solicito reparación antes da saída.</p><p class="pr">Reparación denegada. — O xefe de depósito</p><p class="sub">Nota á parte: «Para quen veña buscar. X. N.»</p><p class="sub">(Documento de ficción do xogo)</p>`;

/* ---------- escenas ---------- */
const SCENES = {
  salon: {
    name: 'Casa Juana · salón', bg: 'img/bg-salon.jpg', music: 'casa', floor: 'madeira',
    walk: [[540, 388], [935, 372], [955, 538], [100, 538], [110, 458], [520, 458]],
    scale: [372, 0.62, 540, 1], actorH: 300, start: [300, 500],
    hotspots: [
      { name: 'Balcón', key: true, r: [769, 52, 184, 292], at: [860, 400], face: 'R',
        look: async () => { await MA('Desde el balcón se ve el depósito, la estación y medio Monforte.', 'pensativo'); await MA('Quien eligió esta casa sabía lo que hacía. O lo que miraba.', 'dudoso'); } },
      { name: 'Fiestra', r: [141, 49, 135, 186], look: () => MA('La torre del castillo de San Vicente asomando por encima de los tejados. Postal gratis.', 'sonriente') },
      { name: 'Cadros', r: [385, 118, 115, 78], look: () => MA('Paisajes de la Ribeira Sacra. Decoración de piso turístico: bonita, neutra y sin ninguna historia. Lo contrario que esta casa.', 'esceptico') },
      { name: 'Mesa', r: [530, 240, 260, 140], look: () => MA('Una mesa para seis. Yo como de pie en la cocina. Pero queda elegante.', 'risueno') },
      { name: 'Cociña', r: [0, 60, 80, 480], at: [120, 500], exit: ['cocina', [800, 500]] },
      { name: 'Porta do patio', key: true, done: () => flag('patioAberto'), r: [900, 380, 60, 160], at: [915, 470], face: 'R',
        act: async () => { if (flag('patioAberto')) return goScene('taller', [120, 505]); await MA('La puerta del patio de atrás. Cerrada con llave. Al otro lado está la nave vieja: la carpintería del señor Alfredo.', 'pensativo'); },
        use: { chave: async () => { setFlag('patioAberto'); await MA('Gira dura, pero gira. Setenta años de óxido diciendo que no... y luego que sí.', 'aliviado'); await goScene('taller', [120, 505]); } } },
    ],
    npcs: [
      { id: 'concha', name: 'Dona Concha', sheet: 'img/concha-sprite.png', spec: { cw: 160, ch: 280, cols: 8 }, idle: 4, talkFrames: [6, 4], flip: true, x: 650, y: 470, w: 110, h: 264, at: [565, 485], face: 'R',
        when: () => !flag('fin'),
        look: () => MA('Doña Concha, la del quiosco de la estación. Sabe más de Monforte que el Concello y el catastro juntos.', 'sonriente'),
        talk: () => conchaTalk(),
        give: {
          ositos: async () => { take('ositos'); await CO('Ositos! Do meu quiosco! Ai, rapaz, que me collestes polo corazón.'); await CO('Anda, toma. A chave do taller. Pero non lle digas á Amparo que cha dei eu.'); give('chave'); setFlag('conchaChave'); },
          parte: async () => {
            await CO('A ver... (pon as lentes) Catorce de xaneiro do cincuenta e oito. X. N....'); await CO('Xosé Nogal. O rapaz que aprendeu o oficio con Alfredo. Cando xa era maquinista, asubiaba ao pasar por diante desta casa: dous longos e un curto. Para saudar o taller.');
            await MA('Dos largos y uno corto. Eso es lo que oigo cada noche, Concha.', 'sorprendido');
            await CO('... Entón alguén se lembra aínda. Leva isto a Xoán, o da estación. Faime caso.');
            setFlag('fin'); await cine('img/cine-mural.jpg', ['Á mañá seguinte, no vestíbulo da estación...', 'Xoán Carballeira mirou o papel moito tempo sen dicir nada.', '— Esa letra... — dixo por fin.', 'FIN DA DEMO · «Vía morta», aventura gráfica']);
          },
        } },
    ],
    onEnter: null,
  },
  cocina: {
    name: 'Casa Juana · cociña', bg: 'img/bg-cocina.jpg', music: 'casa', floor: 'pedra',
    walk: [[360, 388], [690, 388], [820, 430], [840, 538], [330, 538]],
    scale: [388, 0.7, 540, 1], actorH: 300, start: [800, 500],
    hotspots: [
      { name: 'Caixón', key: true, done: () => flag('navallaCollida'), r: [479, 255, 80, 66], at: [520, 410], face: 'B',
        act: async () => { if (hasItem('navalla') || flag('navallaCollida')) return MA('Cubiertos, un abrebotellas del Dépor y propaganda de una pizzería cerrada.', 'neutro'); setFlag('navallaCollida'); give('navalla'); await MA('Una navaja vieja. Me la quedo: en esta casa todo parece tener una cerradura.', 'sonriente'); },
        look: () => MA('Un cajón. En los cajones de cocina vive el caos ordenado de cada casa.', 'pensativo') },
      { name: 'Fiestra', r: [190, 35, 160, 330], at: [380, 420], face: 'L',
        look: async () => { await MA('Desde aquí se ve el patio y la nave de atrás. Tejado roto, ventanas altas... y argollas en el techo.', 'pensativo'); await MA('Argollas para colgar transmisiones. Ahí dentro hubo máquinas de verdad.', 'sorprendido'); } },
      { name: 'Microondas', r: [486, 92, 88, 65], look: () => MA('Un microondas. Tecnología punta comparada con lo que hay en el patio.', 'risueno') },
      { name: 'Forno', r: [403, 250, 75, 105], look: () => MA('Un horno limpísimo. Nadie ha hecho una empanada aquí. Todavía.', 'neutro') },
      { name: 'Salón', r: [905, 60, 55, 480], at: [830, 500], exit: ['salon', [140, 500]] },
    ],
  },
  taller: {
    name: 'O taller vello', bg: 'img/bg-taller.jpg', crop: [0, 420, 1186, 667], floor: 'grava',
    walk: [[60, 470], [930, 470], [950, 538], [40, 538]],
    scale: [470, 0.5, 540, 0.62], actorH: 300, start: [120, 505],
    onEnter: async () => { if (flag('tallerVisto')) return; setFlag('tallerVisto'); await MA('La nave de atrás. Huele a serrín de hace setenta años y a humedad. Si el silbato apunta a esta casa, la respuesta está aquí dentro.', 'pensativo'); },
    draw(c) {
      // atrezo do xogo sobre a foto real
      c.fillStyle = '#5a3f26'; c.fillRect(76, 452, 132, 64); c.fillStyle = '#6e4e30'; c.fillRect(76, 444, 132, 14); c.fillStyle = '#3a281a'; for (let i = 0; i < 3; i++) c.fillRect(80, 470 + i * 16, 124, 2);
      c.fillStyle = '#2a2018'; c.fillRect(492, 198, 66, 62); c.fillStyle = '#b9ae94'; c.fillRect(497, 203, 56, 44); c.fillStyle = '#5a5246'; for (let i = 0; i < 4; i++) c.fillRect(503 + i * 12, 220, 7, 24);
      for (let i = 0; i < 8; i++) { c.fillStyle = 'rgba(25,20,16,.55)'; c.beginPath(); c.ellipse(276 + i * 23, 524 - i * 6 - (i % 2) * 8, 5, 9, 0.9, 0, 7); c.fill(); }
    },
    hotspots: [
      { name: 'Viga da transmisión', key: true, r: [10, 4, 940, 128], at: [600, 490], face: 'B', exit: ['vigas'],
        look: () => MA('La viga de la transmisión. Diez metros, siete soportes para siete poleas. Desde aquí abajo no se ve bien el último.', 'pensativo') },
      { name: 'Foto vella', key: true, r: [484, 192, 82, 76], at: [525, 480], face: 'B',
        look: async () => { await MA('Una foto clavada al pilar, comida por la humedad. Un señor con bigote y tres chavales con mono delante de una sierra enorme.', 'pensativo'); await MA('Detrás, a lápiz: «O señor Alfredo cos aprendices, 1949. Pepe, Manolo, Xosé N.». Xosé N.... ¿N. de qué?', 'dudoso'); } },
      { name: 'Caixón de madeira', key: true, done: () => hasItem('escritura'), r: [70, 436, 144, 86], at: [230, 500], face: 'L',
        act: async () => { if (!hasItem('escritura')) { give('escritura'); await MA('Entre clavos oxidados, una copia amarillenta de una escritura. 1952.', 'sorprendido'); } await ITEMS.escritura.look(); await MA('Todo, por treinta mil pesetas. A un ingeniero de Caminos y a un contratista. ¿Para qué quiere un ingeniero de Caminos una carpintería entera?', 'dudoso'); },
        look: () => MA('Un cajón de madera con herrajes. Parece de la época de las máquinas.', 'neutro') },
      { name: 'Pegadas no po', key: true, r: [262, 456, 190, 74],
        look: () => MA('Huellas recientes en el polvo. Alguien ha estado aquí hace poco, y ha mirado hacia arriba. Hacia la viga.', 'sorprendido') },
      { name: 'Marcas no chan', key: true, r: [640, 452, 260, 78],
        look: () => MA('Agujeros de pernos en grupos de cuatro. Aquí estuvieron atornilladas las máquinas. Sierra, cepilladora, torno...', 'pensativo') },
      { name: 'Casa', r: [0, 150, 48, 320], at: [70, 505], exit: ['salon', [880, 470]] },
    ],
  },
  vigas: {
    name: 'O taller vello · as vigas', bg: 'img/bg-taller-vigas.jpg', crop: [0, 120, 1186, 667], noActor: true,
    draw(c) { if (flag('lataCollida')) return; c.fillStyle = '#3d3d42'; c.fillRect(708, 168, 40, 52); c.fillStyle = '#25252a'; c.beginPath(); c.arc(728, 228, 16, 0, 7); c.fill(); c.fillStyle = '#a08850'; c.fillRect(704, 192, 48, 4); },
    hotspots: [
      { name: 'Sétimo soporte', key: true, done: () => flag('lataCollida'), r: [660, 140, 160, 110],
        look: () => flag('lataCollida') ? MA('El soporte, abierto. Ya no guarda nada.', 'neutro') : MA('El séptimo soporte, encima del pilar. Los otros seis se abren con la mano. Este tiene la tapa soldada. ¿Quién suelda la tapa de una polea?', 'dudoso'),
        act: () => flag('lataCollida') ? MA('Ya está abierto.', 'neutro') : MA('Con las manos no puedo. Necesito algo para hacer palanca en la soldadura.', 'frustrado'),
        use: { navalla: async () => { if (flag('lataCollida')) return MA('Ya está abierto.'); setFlag('lataCollida'); await MA('Meto la navaja por la soldadura, hago palanca... cede. Dentro, una lata de tabaco.', 'sorprendido'); give('lata'); } } },
      { name: 'Luz do tellado', r: [60, 40, 500, 300], look: () => MA('El tejado está roto y entra la luz a chorros. Bonito para una foto. Peligroso para una siesta.', 'esceptico') },
      { name: 'Baixar a mirada', r: [0, 470, 960, 70], exit: ['taller', [620, 500]] },
    ],
  },
};

/* ---------- diálogo con árbore de opcións (estilo Broken Sword) ---------- */
async function conchaTalk() {
  await CO('Ai, Martiño! Xa te instalaches? Eu viña deixarche as chaves da casa, que a Amparo tiña que ir ao médico.');
  for (;;) {
    const opts = [
      { t: '¿Quién era Juana?', k: 'juana' },
      { t: '¿Qué hay en la nave de atrás?', k: 'nave' },
      ...(flag('naveChave') && !flag('conchaChave') ? [{ t: '¿Y la llave de la nave?', k: 'chave' }] : []),
      { t: 'Nada, Concha. Gracias por las llaves.', k: 'adeus' },
    ];
    const k = opts[await choose(opts)].k;
    if (k === 'juana') { await MA('¿Casa Juana? ¿Quién es Juana?', 'dudoso'); await CO('A muller do señor Alfredo, o carpinteiro e industrial. Ela deulle o nome á casa. Aquí atrás tiña unha carpintaría que daba gusto: motores, correas... Dende o quiosco oíase o serrón.'); }
    if (k === 'nave') { await MA('¿Y la nave de atrás? Desde la cocina se ven argollas en el techo.', 'pensativo'); await CO('A carpintaría. Vendeuno todo no cincuenta e dous, toda a maquinaria. Dende entón está pechada. A chave... ben, a chave téñoa eu, pero esa non se lle dá a calquera.'); setFlag('naveChave'); }
    if (k === 'chave') { await MA('Concha, soy yo. El de los cromos del Dépor. ¿De verdad soy «cualquiera»?', 'avergonzado'); await CO('Ti es o que nunca me trouxo nada en vinte anos. Un detalle, rapaz, un detalle. Que eu son de costumes.'); }
    if (k === 'adeus') { await CO('Vai, vai. E pecha ben de noite, que din que anda por aí o tren pantasma.'); return; }
  }
}

/* ---------- presets do selector de acto ----------
   O primeiro é o que usa «Nova partida». Os actos sen facer saen desactivados. */
const ACTS = [
  { id: 'acto1', name: 'Acto 1 · O regreso', desc: 'Luns. Martín chega no rexional (tramo M1: andén, vestíbulo e praza da estación)', scene: 'anden', at: [600, 450], inv: [],
    intro: () => introAnden() },
  { id: 'acto2', name: 'Acto 2 · O reencontro', desc: 'En construción (M3)', disabled: true },
  { id: 'acto3', name: 'Acto 3 · A curiosidade', desc: 'En construción (M4)', disabled: true },
  { id: 'acto4', name: 'Acto 4 · A implicación', desc: 'En construción (M5)', disabled: true },
  { id: 'acto5', name: 'Acto 5 · O descubrimento', desc: 'En construción (M6)', disabled: true },
  { id: 'demo', name: 'Demo técnica (M0) · Casa Juana', desc: 'As catro escenas da casa e o taller. Non canónica: o parte aparece antes de tempo', scene: 'salon', at: [300, 500], inv: ['ositos'],
    intro: async () => { await MA('Casa Juana. Doctor Casares, 211. Más de cien años, varios dueños y un taller atrás que nadie abre desde hace décadas.', 'pensativo'); await MA('Y anoche, un silbato de vapor. Dos largos y uno corto. Hacia esta casa.', 'dudoso'); } },
];

/* ---------- créditos e fontes (sempre no menú) ---------- */
const CREDITS = `<p><b>«Vía morta»</b> é unha obra de ficción inspirada en lugares reais de Monforte de Lemos. <b>Non é información oficial</b>, nin catastral, nin rexistral, nin histórica.</p>
<h3>Autoría</h3><ul><li>Idea, historia e personaxes: Oscar.</li><li>Programación e textos de apoio: Oscar con Claude.</li></ul>
<h3>Imaxes</h3><ul><li>Fotos do taller da Casa Juana: Oscar.</li><li>Mural da estación de Monforte (1954): Cándido Fernández Inchaurbe, delineante de Renfe. Restaurado por Adif a petición de Apatrigal.</li><li>Fondos do andén, do vestíbulo e das dúas pantallas da praza da estación e primeiro plano do mural: Oscar.</li><li>Follas de personaxe de Xoán Carballeira e Dona Concha (sprites e retratos): Oscar.</li><li>Mapa de Monforte: bosquexo provisional, pendente de arte definitiva.</li></ul>
<h3>Fontes</h3><ul><li>Datos da Casa Juana (escritura n.º 375, 2 de xuño de 1952): recompilados por Oscar. Pendente de cotexar coa escritura orixinal.</li><li>Sobre o mural: <a href="https://www.elprogreso.es/articulo/ribeira-sacra/mapa-gallego-ferrocarril-cobra-vida/202309051715141689694.html" target="_blank" rel="noopener">El Progreso, «El mapa gallego del ferrocarril cobra vida»</a>.</li></ul>
<h3>Que é ficción</h3><ul><li>Todos os personaxes (Martín, Xoán Carballeira, Xosé Nogal, Concha, Amparo...) e os feitos do 14 de xaneiro de 1958.</li><li>A vía morta de A Barreira, a restauración secreta da Mikado e o parte escondido.</li><li>O destino real da maquinaria vendida en 1952 non está demostrado: no xogo é só unha hipótese de Martín.</li><li>O mapa de Monforte do xogo é ilustrado e non está a escala.</li></ul>`;
