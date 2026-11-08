'use strict';
/* ==========================================================
   VÍA MORTA · motor de aventura gráfica (point & click)
   Estilo LucasArts / Broken Sword, sen dependencias.
   - Lenzo lóxico de 960×540 escalado á pantalla.
   - Escenas declarativas en js/data.js (fondo, chan camiñable, hotspots, NPCs).
   - Clic esquerdo / toque: acción por defecto (ir, coller, usar, falar).
   - Clic dereito / manter premido: mirar.
   - Inventario: clic nun obxecto para collelo co cursor; despois clic
     nun hotspot, NPC ou noutro obxecto para usar / dar / combinar.
   - Os scripts son funcións async: await say(), await walkTo(), etc.
   ========================================================== */
const W = 960, H = 540;
const E = {
  cv: null, ctx: null, scene: null, sceneId: null,
  actor: { x: 480, y: 500, tx: 480, ty: 500, path: [], dir: 1, face: 'F', walking: false, t: 0, visible: true },
  inv: [], flags: {}, held: null, hover: null, mouse: { x: 0, y: 0 },
  busy: 0, dlg: null, imgs: {}, fade: 0, fadeTo: 0, overlay: null, t: 0,
};
/* ---------- utilidades ---------- */
const $ = id => document.getElementById(id);
const sleep = ms => new Promise(r => setTimeout(r, ms));
function img(src) { if (!E.imgs[src]) { const i = new Image(); i.src = src; E.imgs[src] = i; } const i = E.imgs[src]; return i.complete && i.naturalWidth ? i : null; }
function inRect(x, y, r) { return x >= r[0] && y >= r[1] && x <= r[0] + r[2] && y <= r[1] + r[3]; }
function inPoly(x, y, P) { let c = false; for (let i = 0, j = P.length - 1; i < P.length; j = i++) { const [xi, yi] = P[i], [xj, yj] = P[j]; if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c; } return c; }
function nearestOnPoly(x, y, P) {
  let best = null, bd = 1e9;
  for (let i = 0; i < P.length; i++) { const [ax, ay] = P[i], [bx, by] = P[(i + 1) % P.length], dx = bx - ax, dy = by - ay, L = dx * dx + dy * dy || 1;
    const t = Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / L)), px = ax + dx * t, py = ay + dy * t, d = (px - x) ** 2 + (py - y) ** 2; if (d < bd) { bd = d; best = [px, py]; } }
  // métese un chisco cara a dentro
  return best;
}
function clampWalk(x, y) { const P = E.scene.walk; if (!P) return [x, y]; return inPoly(x, y, P) ? [x, y] : nearestOnPoly(x, y, P); }
function hasItem(id) { return E.inv.includes(id); }
function flag(k) { return !!E.flags[k]; }
/* ---------- gardar ---------- */
const SAVE_KEY = 'viaMortaAventura';
function saveGame() { try { localStorage.setItem(SAVE_KEY, JSON.stringify({ scene: E.sceneId, x: E.actor.x, y: E.actor.y, inv: E.inv, flags: E.flags })); } catch (e) { } }
function loadGame() { try { return JSON.parse(localStorage.getItem(SAVE_KEY) || 'null'); } catch (e) { return null; } }
/* ---------- API para os scripts (usada en data.js) ---------- */
async function say(who, text, mood) {
  E.dlg = { who, text, mood, shown: 0, choices: null };
  await new Promise(r => { E.dlg.done = r; });
}
async function choose(options) {
  E.dlg = { who: 'Martín', text: '', choices: options, shown: 1 };
  return await new Promise(r => { E.dlg.pick = r; });
}
function walkTo(x, y) {
  const [tx, ty] = clampWalk(x, y), A = E.actor; A.tx = tx; A.ty = ty; A.walking = true;
  return new Promise(r => { A.arrive = r; });
}
function face(d) { E.actor.face = d; if (d === 'L') E.actor.dir = -1; if (d === 'R') E.actor.dir = 1; }
function give(id) { if (!hasItem(id)) E.inv.push(id); toast(`Colles: ${ITEMS[id].name}`); saveGame(); drawInv(); }
function take(id) { E.inv = E.inv.filter(i => i !== id); if (E.held === id) E.held = null; saveGame(); drawInv(); }
function setFlag(k, v = true) { E.flags[k] = v; saveGame(); }
async function goScene(id, at) {
  E.fadeTo = 1; await sleep(320); enterScene(id, at); E.fadeTo = 0; await sleep(320);
}
function showDoc(html) { const el = $('doc'); el.innerHTML = html + '<p class="doc-x">(toca para pechar)</p>'; el.hidden = false; return new Promise(r => { el.onclick = () => { el.hidden = true; r(); }; }); }
async function cine(src, lines) {
  const el = $('cine'); el.style.backgroundImage = `url(${src})`; el.hidden = false; el.classList.remove('on'); void el.offsetWidth; el.classList.add('on');
  for (const l of lines) { $('cineTxt').textContent = l; await new Promise(r => { el.onclick = r; }); }
  el.hidden = true;
}
function toast(t) { const el = $('toast'); el.textContent = t; el.classList.add('on'); clearTimeout(el._t); el._t = setTimeout(() => el.classList.remove('on'), 2200); }
/* executa un script bloqueando a entrada mentres dura */
async function run(fn) { if (!fn) return; E.busy++; try { await fn(); } catch (e) { console.error(e); } finally { E.busy--; E.held = null; drawInv(); } }

/* ---------- escenas ---------- */
function enterScene(id, at) {
  const S = SCENES[id]; if (!S) { console.error('Escena descoñecida', id); return; }
  E.scene = S; E.sceneId = id; const A = E.actor;
  const p = at || S.start || [480, 500]; A.x = A.tx = p[0]; A.y = A.ty = p[1]; A.walking = false; A.visible = !S.noActor;
  if (S.onEnter) run(S.onEnter);
  $('sceneName').textContent = S.name; saveGame();
}
function visibleHots() { return (E.scene.hotspots || []).filter(h => !h.when || h.when()); }
function visibleNpcs() { return (E.scene.npcs || []).filter(n => !n.when || n.when()); }
function hitTest(x, y) {
  for (const n of visibleNpcs()) { const s = npcScale(n), w = n.w * s, h = n.h * s; if (inRect(x, y, [n.x - w / 2, n.y - h, w, h])) return { kind: 'npc', o: n }; }
  for (const h of visibleHots()) { if (h.poly ? inPoly(x, y, h.poly) : inRect(x, y, h.r)) return { kind: 'hot', o: h }; }
  return null;
}
function scaleAt(y) { const s = E.scene.scale || [300, 0.6, 540, 1]; const k = Math.max(0, Math.min(1, (y - s[0]) / (s[2] - s[0]))); return s[1] + (s[3] - s[1]) * k; }
function npcScale(n) { return scaleAt(n.y); }

/* acción por defecto / mirar / usar obxecto */
async function interact(hit, look) {
  const o = hit.o, held = E.held;
  const goNear = async () => { if (o.at && E.actor.visible) { await walkTo(o.at[0], o.at[1]); if (o.face) face(o.face); } };
  if (look) { await run(async () => { if (o.face && E.actor.visible) face(o.face); await (o.look ? o.look() : say('Martín', 'Nada especial. Como el horario de verano de Renfe.')); }); return; }
  if (held) {
    await run(async () => {
      await goNear();
      const fn = (o.use && o.use[held]) || (hit.kind === 'npc' && o.give && o.give[held]);
      if (fn) await fn(); else await say('Martín', pickLine(NOPE_LINES));
    });
    return;
  }
  await run(async () => {
    await goNear();
    if (o.exit) { await goScene(o.exit[0], o.exit[1]); return; }
    if (hit.kind === 'npc' && o.talk) { await o.talk(); return; }
    if (o.act) { await o.act(); return; }
    await (o.look ? o.look() : say('Martín', 'No sé qué hacer con eso.'));
  });
}
const NOPE_LINES = ['Eso no funciona así. Ni en Renfe ni en ningún sitio.', 'No. Y mira que lo he intentado con convicción.', 'Mi madre diría que eso no tiene ni pies ni cabeza. Y tendría razón.', 'No pega. Como un Dépor-Celta en el mismo sofá.'];
const pickLine = a => a[Math.floor(Math.random() * a.length)];

/* ---------- entrada ---------- */
function toLogic(e) { const r = E.cv.getBoundingClientRect(); return [(e.clientX - r.left) / r.width * W, (e.clientY - r.top) / r.height * H]; }
function onPointer(e, look) {
  if (E.dlg) { advanceDlg(); return; }
  if (E.busy) return;
  const [x, y] = toLogic(e), hit = hitTest(x, y);
  if (hit) { interact(hit, look); return; }
  if (E.held) { E.held = null; drawInv(); return; }
  if (E.actor.visible && !look) walkTo(x, y);
}
function wireInput() {
  const cv = E.cv; let lp = null;
  cv.addEventListener('contextmenu', e => e.preventDefault());
  cv.addEventListener('pointermove', e => { const [x, y] = toLogic(e); E.mouse.x = x; E.mouse.y = y; E.hover = E.busy || E.dlg ? null : hitTest(x, y); });
  cv.addEventListener('pointerdown', e => {
    if (e.button === 2) { onPointer(e, true); return; }
    if (e.pointerType === 'touch') { const ev = e; lp = setTimeout(() => { lp = 'done'; onPointer(ev, true); }, 450); return; }
    onPointer(e, false);
  });
  cv.addEventListener('pointerup', e => { if (e.pointerType === 'touch') { if (lp && lp !== 'done') { clearTimeout(lp); onPointer(e, false); } lp = null; } });
  $('dlg').addEventListener('click', e => { if (!e.target.closest('.opt')) advanceDlg(); });
  window.addEventListener('keydown', e => { if (e.code === 'Space' || e.code === 'Enter') advanceDlg(); if (e.code === 'Escape') { E.held = null; drawInv(); } });
}
function advanceDlg() {
  const D = E.dlg; if (!D || D.choices) return;
  if (D.shown < D.text.length) { D.shown = D.text.length; return; }
  E.dlg = null; $('dlg').hidden = true; D.done && D.done();
}

/* ---------- inventario ---------- */
function drawInv() {
  const bar = $('inv'); bar.innerHTML = '';
  for (const id of E.inv) {
    const it = ITEMS[id], b = document.createElement('button'); b.type = 'button'; b.className = 'it' + (E.held === id ? ' held' : ''); b.title = it.name;
    const c = document.createElement('canvas'); c.width = c.height = 48; it.icon(c.getContext('2d')); b.appendChild(c);
    const lab = document.createElement('span'); lab.textContent = it.name; b.appendChild(lab);
    b.onclick = () => onItem(id); b.oncontextmenu = ev => { ev.preventDefault(); if (!E.busy && !E.dlg) run(it.look); };
    let lp; b.onpointerdown = ev => { if (ev.pointerType === 'touch') lp = setTimeout(() => { lp = 'x'; if (!E.busy && !E.dlg) run(it.look); }, 450); };
    b.onpointerup = () => { if (lp !== 'x') clearTimeout(lp); };
    bar.appendChild(b);
  }
}
function onItem(id) {
  if (E.busy || E.dlg) return;
  const held = E.held;
  if (!held) { E.held = id; drawInv(); return; }
  if (held === id) { E.held = null; drawInv(); return; }
  // combinar dous obxectos (a orde non importa)
  const a = ITEMS[held], b = ITEMS[id], fn = (a.combine && a.combine[id]) || (b.combine && b.combine[held]);
  run(async () => { if (fn) await fn(); else await say('Martín', pickLine(NOPE_LINES)); });
}

/* ---------- debuxo ---------- */
function drawSprite(sheet, idx, x, y, h, flip, spec) {
  const im = img(sheet); if (!im) return;
  const sx = (idx % spec.cols) * spec.cw, sy = Math.floor(idx / spec.cols) * spec.ch, w = h * spec.cw / spec.ch, c = E.ctx;
  c.save(); c.translate(x, y); if (flip) c.scale(-1, 1); c.drawImage(im, sx, sy, spec.cw, spec.ch, -w / 2, -h, w, h); c.restore();
}
function drawShadow(x, y, w) { const c = E.ctx; c.fillStyle = 'rgba(0,0,0,.28)'; c.beginPath(); c.ellipse(x, y, w, w * 0.22, 0, 0, 7); c.fill(); }
function frame(now) {
  const dt = Math.min(0.05, (now - (E.last || now)) / 1000); E.last = now; E.t += dt;
  update(dt); render(); requestAnimationFrame(frame);
}
function update(dt) {
  const A = E.actor;
  if (A.walking) {
    const dx = A.tx - A.x, dy = A.ty - A.y, d = Math.hypot(dx, dy), sp = 190 * scaleAt(A.y) * dt;
    if (d <= sp) { A.x = A.tx; A.y = A.ty; A.walking = false; const r = A.arrive; A.arrive = null; r && r(); }
    else { A.x += dx / d * sp; A.y += dy / d * sp; if (Math.abs(dx) > 2) A.dir = dx < 0 ? -1 : 1; A.face = Math.abs(dx) > Math.abs(dy) * 0.6 ? (dx < 0 ? 'L' : 'R') : (dy < 0 ? 'B' : 'F'); A.t += dt; }
  }
  E.fade += (E.fadeTo - E.fade) * Math.min(1, dt * 10);
  if (E.dlg && E.dlg.shown < E.dlg.text.length) E.dlg.shown = Math.min(E.dlg.text.length, E.dlg.shown + dt * 55);
  renderDlg();
}
function render() {
  const c = E.ctx, S = E.scene; if (!S) return;
  c.clearRect(0, 0, W, H);
  const bg = img(S.bg);
  if (bg) { const cr = S.crop || [0, 0, bg.naturalWidth, bg.naturalWidth * 9 / 16]; c.drawImage(bg, cr[0], cr[1], cr[2], cr[3], 0, 0, W, H); } else { c.fillStyle = '#222'; c.fillRect(0, 0, W, H); }
  if (S.draw) S.draw(c, E.t);
  // ordénanse actor e NPCs por profundidade (y)
  const list = visibleNpcs().map(n => ({ y: n.y, f: () => drawNpc(n) }));
  if (E.actor.visible) list.push({ y: E.actor.y, f: drawActor });
  list.sort((a, b) => a.y - b.y).forEach(o => o.f());
  if (S.drawFront) S.drawFront(c, E.t);
  // etiqueta do cursor
  const hv = E.hover; let label = '';
  if (hv) { const n = hv.o.name; label = E.held ? `${hv.kind === 'npc' ? 'Dar' : 'Usar'} ${ITEMS[E.held].name} ${hv.kind === 'npc' ? 'a' : 'con'} ${n}` : (hv.o.exit ? `→ ${n}` : n); }
  else if (E.held) label = `Usar ${ITEMS[E.held].name} con...`;
  if (label && !E.dlg) { c.font = '700 20px "Trebuchet MS", sans-serif'; c.textAlign = 'center'; c.lineWidth = 4; c.strokeStyle = '#000'; const ly = Math.max(28, E.mouse.y - 22); c.strokeText(label, E.mouse.x, ly); c.fillStyle = hv && hv.o.exit ? '#9fe0ff' : '#ffe38a'; c.fillText(label, E.mouse.x, ly); c.textAlign = 'left'; }
  if (E.fade > 0.01) { c.fillStyle = `rgba(0,0,0,${E.fade})`; c.fillRect(0, 0, W, H); }
}
const MARTIN = { sheet: 'img/martin-sprite.png', cw: 150, ch: 203, cols: 8, idleF: 0, idleB: 1, idleR: 2, walkR: [4, 5, 6, 7, 8, 9], height: 1 };
function drawActor() {
  const A = E.actor, s = scaleAt(A.y), h = (E.scene.actorH || 330) * s;
  drawShadow(A.x, A.y, 34 * s);
  let idx, flip = false, bob = 0;
  if (A.walking) {
    if (A.face === 'L' || A.face === 'R') { idx = MARTIN.walkR[Math.floor(A.t * 10) % 6]; flip = A.face === 'L'; }
    else { idx = A.face === 'B' ? MARTIN.idleB : MARTIN.idleF; bob = Math.abs(Math.sin(A.t * 10)) * 4 * s; }
  } else idx = A.face === 'B' ? MARTIN.idleB : A.face === 'F' ? MARTIN.idleF : MARTIN.idleR, flip = A.face === 'L';
  drawSprite(MARTIN.sheet, idx, A.x, A.y - bob, h, flip, MARTIN);
}
function drawNpc(n) {
  const s = npcScale(n), talking = E.dlg && E.dlg.who === n.name && E.dlg.shown < E.dlg.text.length;
  drawShadow(n.x, n.y, 30 * s);
  const idx = talking && n.talkFrames ? n.talkFrames[Math.floor(E.t * 6) % n.talkFrames.length] : n.idle;
  drawSprite(n.sheet, idx, n.x, n.y, n.h * s, n.flip, n.spec);
}
/* caixa de diálogo con retrato (as caras de Martín cambian segundo o humor) */
function renderDlg() {
  const D = E.dlg, el = $('dlg');
  if (!D) { el.hidden = true; return; }
  el.hidden = false;
  const who = D.choices ? 'Martín' : D.who, por = PORTRAITS[who] ? (who === 'Martín' ? `img/mf-${D.mood || 'neutro'}.png` : PORTRAITS[who]) : null;
  const key = who + '|' + (D.mood || '') + '|' + (D.choices ? 'C' : '') + '|' + Math.floor(D.shown) + '|' + D.text.length;
  if (el._k === key) return; el._k = key;
  $('dlgPor').style.backgroundImage = por ? `url(${por})` : 'none';
  $('dlgName').textContent = D.choices ? 'Martín' : who;
  if (D.choices) {
    $('dlgText').innerHTML = '';
    D.choices.forEach((o, i) => { const b = document.createElement('button'); b.className = 'opt'; b.textContent = '▸ ' + o.t; b.onclick = ev => { ev.stopPropagation(); E.dlg = null; el.hidden = true; D.pick(i); }; $('dlgText').appendChild(b); });
  } else $('dlgText').textContent = D.text.slice(0, Math.floor(D.shown));
  $('dlgMore').hidden = !!D.choices || D.shown < D.text.length;
}

/* ---------- arranque ---------- */
function startGame(fresh) {
  const s = !fresh && loadGame();
  if (s) { E.inv = s.inv || []; E.flags = s.flags || {}; enterScene(s.scene, [s.x, s.y]); }
  else { E.inv = [...START.inv]; E.flags = {}; enterScene(START.scene, START.at); if (START.intro) run(START.intro); }
  drawInv(); $('menu').hidden = true;
}
window.addEventListener('load', () => {
  E.cv = $('game'); E.ctx = E.cv.getContext('2d'); E.ctx.imageSmoothingEnabled = true;
  wireInput();
  // precarga
  for (const S of Object.values(SCENES)) img(S.bg); img(MARTIN.sheet);
  $('btnCont').hidden = !loadGame();
  $('btnCont').onclick = () => startGame(false);
  $('btnNew').onclick = () => startGame(true);
  requestAnimationFrame(frame);
});
