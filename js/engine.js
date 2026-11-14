'use strict';
/* ==========================================================
   VÍA MORTA · motor de aventura gráfica (point & click)
   Estilo LucasArts / Broken Sword, sen dependencias.
   - Lenzo lóxico de 960×540 escalado á pantalla.
   - Escenas declarativas en js/data.js e js/acto*.js.
   - Clic esquerdo / toque: acción por defecto (ir, coller, usar, falar).
   - Clic dereito / manter premido: mirar.
   - Inventario: clic nun obxecto para collelo co cursor; despois clic
     nun hotspot, NPC ou noutro obxecto para usar / dar / combinar.
   - Os scripts son funcións async: await say(), await walkTo(), etc.
   M1 (motor completo):
   - camiño con A* sobre varios polígonos de chan e obstáculos (holes);
   - capas dianteiras con recorte por profundidade (front);
   - ollo de maquinista (Q / botón OLLO) e hotspots só visibles co ollo;
   - bocadillos sobre a cabeza (bark) e animación de falar de Martín;
   - menú con opcións, selector de acto e créditos; son sintetizado.
   ========================================================== */
const W = 960, H = 540;
const E = {
  cv: null, ctx: null, scene: null, sceneId: null,
  actor: { x: 480, y: 500, tx: 480, ty: 500, path: [], dir: 1, face: 'F', walking: false, t: 0, visible: true, pose: null, stepT: 0 },
  inv: [], flags: {}, held: null, hover: null, hoverUntil: 0, mouse: { x: 0, y: 0 },
  busy: 0, dlg: null, imgs: {}, fade: 0, fadeTo: 0, t: 0, barks: [], olloT: 0, paused: true, act: null,
  opts: { fast: false, music: 0.35, sfx: 0.8 },
};
/* ---------- utilidades ---------- */
const $ = id => document.getElementById(id);
const sleep = ms => new Promise(r => setTimeout(r, ms));
/* no HTML único (tools/html-unico.py) as imaxes van en IMG_INLINE; se non, cárganse do cartafol img/ */
const res = s => (window.IMG_INLINE && window.IMG_INLINE[s]) || s;
function img(src) { if (!E.imgs[src]) { const i = new Image(); i.src = res(src); E.imgs[src] = i; } const i = E.imgs[src]; return i.complete && i.naturalWidth ? i : null; }
function inRect(x, y, r) { return x >= r[0] && y >= r[1] && x <= r[0] + r[2] && y <= r[1] + r[3]; }
function inPoly(x, y, P) { let c = false; for (let i = 0, j = P.length - 1; i < P.length; j = i++) { const [xi, yi] = P[i], [xj, yj] = P[j]; if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c; } return c; }
function nearestOnSeg(x, y, a, b) { const dx = b[0] - a[0], dy = b[1] - a[1], L = dx * dx + dy * dy || 1, t = Math.max(0, Math.min(1, ((x - a[0]) * dx + (y - a[1]) * dy) / L)); return [a[0] + dx * t, a[1] + dy * t]; }
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
function hasItem(id) { return E.inv.includes(id); }
function flag(k) { return !!E.flags[k]; }
const pickLine = a => a[Math.floor(Math.random() * a.length)];

/* ---------- chan camiñable e camiños (A*) ----------
   walk: un polígono [[x,y]...] ou varios [[[x,y]...], [[x,y]...]] (a unión).
   holes: obstáculos dentro do chan (bancos, quiosco...).
   O camiño calcúlase cun grafo de visibilidade sobre os vértices. */
function prepWalk(S) {
  if (S._walk !== undefined) return;
  const w = S.walk; S._walk = !w ? null : (typeof w[0][0] === 'number' ? [w] : w);
  S._holes = S.holes || [];
  S._nodes = [];
  if (!S._walk) return;
  const dirs = []; for (let k = 0; k < 16; k++) dirs.push([Math.cos(k * Math.PI / 8), Math.sin(k * Math.PI / 8)]);
  for (const P of [...S._walk, ...S._holes]) for (const v of P) {
    let ax = 0, ay = 0, n = 0;
    for (const [dx, dy] of dirs) if (walkableIn(S, v[0] + dx * 5, v[1] + dy * 5)) { ax += dx; ay += dy; n++; }
    if (!n || n === dirs.length) continue; // vértice illado ou interior (non serve de esquina)
    const L = Math.hypot(ax, ay) || 1, p = [v[0] + ax / L * 6, v[1] + ay / L * 6];
    if (walkableIn(S, p[0], p[1])) S._nodes.push(p);
  }
  S._vis = new Map();
}
function walkableIn(S, x, y) {
  const P = S._walk; if (!P) return true;
  if (x < 0 || x > W || y < 0 || y > H) return false;
  return P.some(p => inPoly(x, y, p)) && !S._holes.some(h => inPoly(x, y, h));
}
const walkable = (x, y) => walkableIn(E.scene, x, y);
function clampWalk(x, y) {
  const S = E.scene; prepWalk(S); if (!S._walk || walkable(x, y)) return [x, y];
  let best = null, bd = 1e9;
  for (const P of [...S._walk, ...S._holes]) for (let i = 0; i < P.length; i++) {
    const p = nearestOnSeg(x, y, P[i], P[(i + 1) % P.length]);
    for (const r of [2, 4, 7]) for (const [ox, oy] of [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, 1], [1, -1], [-1, -1]]) {
      const q = [p[0] + ox * r, p[1] + oy * r];
      if (walkable(q[0], q[1])) { const d = dist(q, [x, y]); if (d < bd) { bd = d; best = q; } }
    }
  }
  return best || [E.actor.x, E.actor.y];
}
function lineWalkable(a, b) {
  const n = Math.ceil(dist(a, b) / 4);
  for (let i = 1; i < n; i++) { const t = i / n; if (!walkable(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t)) return false; }
  return true;
}
function findPath(from, to) {
  const S = E.scene; prepWalk(S);
  if (!S._walk || lineWalkable(from, to)) return [to];
  const N = S._nodes, start = N.length, goal = N.length + 1, pts = [...N, from, to];
  const vis = (i, j) => {
    if (i < start && j < start) { const k = i < j ? i + ',' + j : j + ',' + i; if (!S._vis.has(k)) S._vis.set(k, lineWalkable(N[i], N[j])); return S._vis.get(k); }
    return lineWalkable(pts[i], pts[j]);
  };
  // Dijkstra / A* (heurística: distancia en liña recta)
  const g = new Array(pts.length).fill(Infinity), prev = new Array(pts.length).fill(-1), done = new Array(pts.length).fill(false);
  g[start] = 0;
  for (;;) {
    let u = -1, best = Infinity;
    for (let i = 0; i < pts.length; i++) if (!done[i] && g[i] < Infinity) { const f = g[i] + dist(pts[i], to); if (f < best) { best = f; u = i; } }
    if (u < 0 || u === goal) break;
    done[u] = true;
    for (let v = 0; v < pts.length; v++) if (!done[v] && v !== u && vis(u, v)) { const nd = g[u] + dist(pts[u], pts[v]); if (nd < g[v]) { g[v] = nd; prev[v] = u; } }
  }
  let end = goal;
  if (g[goal] === Infinity) { // inalcanzable: imos ao punto alcanzado máis próximo
    let bd = Infinity; end = -1;
    for (let i = 0; i < pts.length; i++) if (g[i] < Infinity && i !== goal) { const d = dist(pts[i], to); if (d < bd) { bd = d; end = i; } }
    if (end < 0 || end === start) return [];
  }
  const path = []; for (let i = end; i !== start && i >= 0; i = prev[i]) path.unshift(pts[i]);
  return path;
}

/* ---------- opcións e gardar ---------- */
const SAVE_KEY = 'viaMortaAventura', OPT_KEY = 'viaMortaOpcions';
function saveGame() { if (!E.scene || E.scene.noSave) return; try { localStorage.setItem(SAVE_KEY, JSON.stringify({ v: 2, act: E.act, scene: E.sceneId, x: E.actor.x, y: E.actor.y, inv: E.inv, flags: E.flags })); } catch (e) { } }
function loadGame() { try { const s = JSON.parse(localStorage.getItem(SAVE_KEY) || 'null'); return s && SCENES[s.scene] ? s : null; } catch (e) { return null; } }
function saveOpts() { try { localStorage.setItem(OPT_KEY, JSON.stringify(E.opts)); } catch (e) { } }
function loadOpts() { try { Object.assign(E.opts, JSON.parse(localStorage.getItem(OPT_KEY) || '{}')); } catch (e) { } }

/* ---------- API para os scripts (usada en data.js) ---------- */
async function say(who, text, mood) {
  E.barks = E.barks.filter(b => b.who !== who);
  E.dlg = { who, text, mood, shown: 0, choices: null };
  await new Promise(r => { E.dlg.done = r; });
}
async function choose(options) {
  E.dlg = { who: 'Martín', text: '', choices: options, shown: 1 };
  return await new Promise(r => { E.dlg.pick = r; });
}
/* bocadillo curto sobre a cabeza, sen panel de diálogo (non bloquea se non se espera) */
function bark(text, who = 'Martín', ms) {
  ms = ms || Math.max(1600, text.length * 55);
  E.barks = E.barks.filter(b => b.who !== who);
  const b = { who, text, until: E.t + ms / 1000 };
  E.barks.push(b);
  return sleep(ms);
}
function walkTo(x, y) {
  const A = E.actor, [tx, ty] = clampWalk(x, y);
  if (A.arrive) { const r = A.arrive; A.arrive = null; r(); }
  A.path = findPath([A.x, A.y], [tx, ty]);
  if (!A.path.length) return Promise.resolve();
  [A.tx, A.ty] = A.path.shift(); A.walking = true;
  return new Promise(r => { A.arrive = r; });
}
function face(d) { E.actor.face = d; if (d === 'L') E.actor.dir = -1; if (d === 'R') E.actor.dir = 1; }
function pose(idx, s = 0.5) { E.actor.pose = { idx, until: E.t + s }; }
function give(id) { if (!hasItem(id)) E.inv.push(id); pose(MARTIN.pick, 0.45); SFX.pick(); toast(`Colles: ${ITEMS[id].name}`); saveGame(); drawInv(); }
function take(id) { E.inv = E.inv.filter(i => i !== id); if (E.held === id) E.held = null; saveGame(); drawInv(); }
function setFlag(k, v = true) { E.flags[k] = v; saveGame(); }
async function goScene(id, at) {
  E.fadeTo = 1; await sleep(320); enterScene(id, at); E.fadeTo = 0; await sleep(320);
}
function showDoc(html) { SFX.paper(); const el = $('doc'); el.innerHTML = html.replace(/img\/[\w-]+\.(png|jpg)/g, res) + '<p class="doc-x">(toca para pechar)</p>'; el.hidden = false; return new Promise(r => { el.onclick = () => { el.hidden = true; r(); }; }); }
async function cine(src, lines) {
  const el = $('cine'); el.style.backgroundImage = `url(${res(src)})`; el.hidden = false; el.classList.remove('on'); void el.offsetWidth; el.classList.add('on');
  for (const l of lines) { $('cineTxt').textContent = l; await new Promise(r => { el.onclick = r; }); }
  el.hidden = true;
}
function toast(t) { const el = $('toast'); el.textContent = t; el.classList.add('on'); clearTimeout(el._t); el._t = setTimeout(() => el.classList.remove('on'), 2200); }
/* executa un script bloqueando a entrada mentres dura */
async function run(fn) { if (!fn) return; E.busy++; try { await fn(); } catch (e) { console.error(e); } finally { E.busy--; E.held = null; drawInv(); } }

/* ---------- escenas ---------- */
function enterScene(id, at) {
  const S = SCENES[id]; if (!S) { console.error('Escena descoñecida', id); return; }
  E.scene = S; E.sceneId = id; prepWalk(S); (S.zones || []).forEach(z => { z._in = false; }); const A = E.actor;
  const p = at || S.start || [480, 500]; A.x = A.tx = p[0]; A.y = A.ty = p[1]; A.walking = false; A.path = []; A.visible = !S.noActor; A.pose = null; A.lift = 0;
  E.barks = []; E.olloT = 0; E.hover = null;
  SFX.music(S.music || null);
  if (S.onEnter) run(S.onEnter);
  $('sceneName').textContent = S.hideName ? '' : S.name; saveGame();
}
function olloOn() { return E.olloT > 0; }
function visibleHots() { return (E.scene.hotspots || []).filter(h => (!h.when || h.when()) && (!h.olloOnly || olloOn() || flag(h.olloOnly))); }
function visibleNpcs() { return (E.scene.npcs || []).filter(n => !n.when || n.when()); }
function npcBox(n) { const s = npcScale(n), w = n.w * s, h = n.h * s; return [n.x - w / 2, n.y - h, w, h]; }
function hitTest(x, y) {
  for (const n of visibleNpcs()) if (inRect(x, y, npcBox(n))) return { kind: 'npc', o: n };
  const hots = visibleHots(), exact = hots.filter(h => h.poly ? inPoly(x, y, h.poly) : inRect(x, y, h.r));
  // prioridade: saída ou obxecto clave tocados de cheo > zona ampliada dunha saída real > decorado > zona ampliada dunha rúa pechada
  const strong = exact.find(h => h.exit || h.key); if (strong) return { kind: 'hot', o: strong };
  const near = (list) => { let best = null, bd = Infinity; for (const h of list) { const b = exitBox(h); if (inRect(x, y, b)) { const d = Math.hypot(x - (b[0] + b[2] / 2), y - (b[1] + b[3] / 2)); if (d < bd) { bd = d; best = h; } } } return best; };
  const realExits = hots.filter(h => h.exit && h.exit[0] !== '__rua'), closed = hots.filter(h => h.exit && h.exit[0] === '__rua');
  const e = near(realExits) || exact[0] || near(closed);
  return e ? { kind: 'hot', o: e } : null;
}
// caixa de clic ampliada dunha saída: mínimo 140×140, marxe de 30 e, se toca case o bordo, chega ata el
function exitBox(h) {
  let [x, y, w, hh] = boxOf(h);
  // saída pintada sobre o chan e lonxe dos bordos laterais (p. ex. o bordo inferior): só un pouco de marxe, para non roubarlle os clics ao camiñar
  if (E.scene._walk && x > 20 && x + w < W - 20 && walkableIn(E.scene, x + w / 2, y + hh / 2)) { const m = 12; return [Math.max(0, x - m), Math.max(0, y - m), w + 2 * m, hh + 2 * m]; }
  const M = 30, MIN = 140;
  if (w < MIN) { x -= (MIN - w) / 2; w = MIN; } if (hh < MIN) { y -= (MIN - hh) / 2; hh = MIN; }
  x -= M; y -= M; w += 2 * M; hh += 2 * M;
  if (x < 70) { w += x; x = 0; } if (y < 70) { hh += y; y = 0; } if (x + w > W - 70) w = W - x; if (y + hh > H - 70) hh = H - y;
  x = Math.max(0, x); y = Math.max(0, y); return [x, y, Math.min(w, W - x), Math.min(hh, H - y)];
}
// frecha suave en cada saída real (as rúas pechadas, exit '__rua', non a levan), para saber sempre por onde se marcha
function drawExitHints() {
  const c = E.ctx, a = 0.75 + 0.25 * Math.sin(E.t * 3);
  for (const h of visibleHots()) {
    if (!h.exit || h.exit[0] === '__rua' || h.noHint) continue;
    const [x, y, w, hh] = boxOf(h), cx = x + w / 2, cy = y + hh / 2;
    const dir = h.hint || (cx < W * 0.12 ? 'L' : cx > W * 0.88 ? 'R' : cy > H * 0.82 ? 'D' : 'U');
    const ang = { R: 0, D: Math.PI / 2, L: Math.PI, U: -Math.PI / 2 }[dir];
    const px = Math.max(26, Math.min(W - 26, cx)), py = Math.max(26, Math.min(H - 26, cy));
    c.save(); c.translate(px, py); c.rotate(ang); c.globalAlpha = a; c.lineJoin = 'round'; c.lineCap = 'round';
    c.beginPath(); c.moveTo(-11, -19); c.lineTo(11, 0); c.lineTo(-11, 19);
    c.lineWidth = 13; c.strokeStyle = '#0b0c0e'; c.stroke(); c.lineWidth = 6; c.strokeStyle = '#9fe0ff'; c.stroke(); c.restore();
  }
}
function scaleAt(y) { const s = E.scene.scale || [300, 0.6, 540, 1]; const k = Math.max(0, Math.min(1, (y - s[0]) / (s[2] - s[0]))); return s[1] + (s[3] - s[1]) * k; }
function npcScale(n) { return n.fixedScale || scaleAt(n.y); }

/* acción por defecto / mirar / usar obxecto */
const NOPE_LINES = ['Eso no funciona así. Ni en Renfe ni en ningún sitio.', 'No. Y mira que lo he intentado con convicción.', 'Mi madre diría que eso no tiene ni pies ni cabeza.', 'No pega. Como un Dépor-Celta en el mismo sofá.', 'Ni con el manual de Renfe delante.'];
/* `at` e `face` poden ser valores ou funcións (para NPC que se moven) */
const val = (v, o) => typeof v === 'function' ? v.call(o) : v;
async function interact(hit, look) {
  const o = hit.o;
  if (!o.patrol) return interact0(hit, look);
  o._hold = (o._hold || 0) + 1;            // un NPC que pasea párase mentres Martín vai falar con el
  try { await interact0(hit, look); } finally { o._hold--; }
}
async function interact0(hit, look) {
  const o = hit.o, held = E.held;
  if (o.olloOnly) setFlag(o.olloOnly);
  const goNear = async () => { const at = val(o.at, o); if (at && E.actor.visible) { await walkTo(at[0], at[1]); const f = val(o.face, o); if (f) face(f); } };
  if (look) { await run(async () => { const f = val(o.face, o); if (f && E.actor.visible) face(f); await (o.look ? o.look() : say('Martín', 'Lo miro bien... y no me dice nada. Será tímido.')); }); return; }
  if (held) {
    await run(async () => {
      await goNear();
      const fn = (o.use && o.use[held]) || (hit.kind === 'npc' && o.give && o.give[held]);
      if (fn) await fn(); else await bark(pickLine(NOPE_LINES));
    });
    return;
  }
  await run(async () => {
    if (o.exit) E.rushExit = o;            // segundo clic/toque na mesma saída mentres camiña: chega ao instante
    try { await goNear(); } finally { E.rushExit = null; }
    if (hit.kind === 'npc' && o.talk) { await o.talk(); return; }
    if (o.act) { await o.act(); return; }
    if (o.exit) { if (o.door) SFX.door(); await goScene(o.exit[0], o.exit[1]); return; }
    await (o.look ? o.look() : bark('No sé qué hacer con eso.'));
  });
}
/* ollo de maquinista: a escena pasa a gris e márcase o importante */
function ollo() {
  if (!E.scene || E.paused || E.dlg || !$('cine').hidden || !$('doc').hidden) return;
  E.olloT = 4.5; SFX.ollo();
}

/* ---------- entrada ---------- */
function toLogic(e) { const r = E.cv.getBoundingClientRect(); return [(e.clientX - r.left) / r.width * W, (e.clientY - r.top) / r.height * H]; }
/* dobre clic nunha saída: Martín salta o paseo e chega xa ao punto de saída */
function skipWalk() {
  const A = E.actor; if (!A.walking) return;
  const end = A.path.length ? A.path[A.path.length - 1] : [A.tx, A.ty];
  A.x = A.tx = end[0]; A.y = A.ty = end[1]; A.path = []; A.walking = false;
  if (A.arrive) { const r = A.arrive; A.arrive = null; r(); }
}
function onPointer(e, look) {
  if (E.dlg) { advanceDlg(); return; }
  if (E.rushExit && !look && !E.paused) { const [x, y] = toLogic(e), h = hitTest(x, y); if (h && h.o === E.rushExit) { skipWalk(); return; } }
  if (E.busy || E.paused) return;
  const [x, y] = toLogic(e), hit = hitTest(x, y);
  if (e.pointerType === 'touch') { E.mouse.x = x; E.mouse.y = y; E.hover = hit; E.hoverUntil = E.t + 1.3; }
  if (hit) { interact(hit, look); return; }
  if (E.held) { E.held = null; drawInv(); return; }
  if (E.actor.visible && !look) walkTo(x, y);
}
function wireInput() {
  const cv = E.cv; let lp = null;
  cv.addEventListener('contextmenu', e => e.preventDefault());
  cv.addEventListener('pointermove', e => { if (e.pointerType === 'touch') return; const [x, y] = toLogic(e); E.mouse.x = x; E.mouse.y = y; E.hover = E.busy || E.dlg ? null : hitTest(x, y); });
  cv.addEventListener('pointerdown', e => {
    SFX.init();
    if (e.button === 2) { onPointer(e, true); return; }
    if (e.pointerType === 'touch') { const ev = e; lp = setTimeout(() => { lp = 'done'; onPointer(ev, true); }, 450); return; }
    onPointer(e, false);
  });
  cv.addEventListener('pointerup', e => { if (e.pointerType === 'touch') { if (lp && lp !== 'done') { clearTimeout(lp); onPointer(e, false); } lp = null; } });
  cv.addEventListener('pointercancel', () => { if (lp && lp !== 'done') clearTimeout(lp); lp = null; });
  $('dlg').addEventListener('click', e => { if (!e.target.closest('.opt')) advanceDlg(); });
  window.addEventListener('keydown', e => {
    if (e.code === 'Space' || e.code === 'Enter') advanceDlg();
    if (e.code === 'KeyQ') ollo();
    if (e.code === 'Escape') { if (E.held) { E.held = null; drawInv(); } else if (!E.paused && !E.busy && !E.dlg) openMenu(); }
  });
  $('bOllo').onclick = () => { SFX.init(); ollo(); };
  $('bMenu').onclick = () => { if (!E.busy && !E.dlg) openMenu(); };
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
    let lp = null;
    b.onclick = () => { if (lp === 'x') { lp = null; return; } onItem(id); };
    b.oncontextmenu = ev => { ev.preventDefault(); if (!E.busy && !E.dlg) run(it.look); };
    b.onpointerdown = ev => { SFX.init(); if (ev.pointerType === 'touch') lp = setTimeout(() => { lp = 'x'; if (!E.busy && !E.dlg) run(it.look); }, 450); };
    b.onpointerup = () => { if (lp && lp !== 'x') { clearTimeout(lp); lp = null; } };
    bar.appendChild(b);
  }
  if (!E.inv.length) { const p = document.createElement('div'); p.className = 'empty'; p.textContent = 'Petos baleiros'; bar.appendChild(p); }
}
function onItem(id) {
  if (E.busy || E.dlg || E.paused) return;
  const held = E.held;
  if (!held) { E.held = id; drawInv(); return; }
  if (held === id) { E.held = null; drawInv(); return; }
  // combinar dous obxectos (a orde non importa)
  const a = ITEMS[held], b = ITEMS[id], fn = (a.combine && a.combine[id]) || (b.combine && b.combine[held]);
  run(async () => { if (fn) await fn(); else await bark(pickLine(NOPE_LINES)); });
}

/* ---------- debuxo ---------- */
/* top: primeira fila con píxeles de cada cela que non mide coma o parado (para igualar alturas) */
const MARTIN = { sheet: 'img/martin-sprite.png', cw: 150, ch: 203, cols: 8, idleF: 0, idleB: 1, idleR: 2, walkR: [4, 5, 6, 7, 8, 9], talkF: [0, 35, 0, 34], pick: 32,
  top: { 34: 36, 35: 36, 36: 35, 37: 35 } };
function drawSprite(sheet, idx, x, y, h, flip, spec) {
  const im = img(sheet); if (!im) return;
  const top = spec.top && spec.top[idx], k = top ? (spec.ch - 6) / (spec.ch - 3 - top) : 1;
  const sx = (idx % spec.cols) * spec.cw, sy = Math.floor(idx / spec.cols) * spec.ch, hh = h * k, w = hh * spec.cw / spec.ch, c = E.ctx;
  c.save(); c.translate(x, y); if (flip) c.scale(-1, 1); c.drawImage(im, sx, sy, spec.cw, spec.ch, -w / 2, -hh, w, hh); c.restore();
}
function drawShadow(x, y, w) { const c = E.ctx; c.fillStyle = 'rgba(0,0,0,.28)'; c.beginPath(); c.ellipse(x, y, w, w * 0.22, 0, 0, 7); c.fill(); }
function frame(now) {
  const dt = Math.min(0.05, (now - (E.last || now)) / 1000); E.last = now;
  if (!E.paused) { E.t += dt; update(dt); }
  render(); requestAnimationFrame(frame);
}
function update(dt) {
  const A = E.actor;
  if (A.walking) {
    const dx = A.tx - A.x, dy = A.ty - A.y, d = Math.hypot(dx, dy), sp = 190 * Math.max(E.scene.minSpeed || 0, scaleAt(A.y)) * dt;
    if (d <= sp) {
      A.x = A.tx; A.y = A.ty;
      if (A.path.length) [A.tx, A.ty] = A.path.shift();
      else { A.walking = false; const r = A.arrive; A.arrive = null; r && r(); }
    } else {
      A.x += dx / d * sp; A.y += dy / d * sp; if (Math.abs(dx) > 2) A.dir = dx < 0 ? -1 : 1;
      A.face = Math.abs(dx) > Math.abs(dy) * 0.6 ? (dx < 0 ? 'L' : 'R') : (dy < 0 ? 'B' : 'F'); A.t += dt;
      A.stepT += dt; if (A.stepT > 0.3) { A.stepT = 0; SFX.step(E.scene.floor); }
    }
  }
  for (const n of visibleNpcs()) { if (n._mv) moveStep(n, dt); else if (n.patrol) patrolStep(n, dt); }
  // zonas de proximidade (scene.zones): ao entrar nunha zona do chan execútase z.enter() unha vez,
  // e volve poder executarse cando Martín sae dela. Para comentarios de paso (bark), sen parar o xogo.
  if (E.scene.zones && !E.scene.noActor && !E.busy) for (const z of E.scene.zones) {
    const inside = z.poly ? inPoly(A.x, A.y, z.poly) : inRect(A.x, A.y, z.r);
    if (inside && !z._in && (!z.when || z.when())) { z._in = true; z.enter(); } else if (!inside) z._in = false;
  }
  E.fade += (E.fadeTo - E.fade) * Math.min(1, dt * 10);
  if (E.olloT > 0) E.olloT = Math.max(0, E.olloT - dt);
  if (E.dlg && E.dlg.shown < E.dlg.text.length) E.dlg.shown = Math.min(E.dlg.text.length, E.dlg.shown + dt * (E.opts.fast ? 150 : 55));
  E.barks = E.barks.filter(b => b.until > E.t);
  if (E.hover && E.hoverUntil && E.t > E.hoverUntil) { E.hover = null; E.hoverUntil = 0; }
  renderDlg();
}
function drawBg() {
  const c = E.ctx, S = E.scene, bg = S.bg && img(S.bg);
  if (bg) { const cr = S.crop || [0, 0, bg.naturalWidth, bg.naturalWidth * 9 / 16]; c.drawImage(bg, cr[0], cr[1], cr[2], cr[3], 0, 0, W, H); }
  else { c.fillStyle = S.bgColor || '#222'; c.fillRect(0, 0, W, H); }
}
/* capa dianteira: volve pintar un anaco do fondo (ou un debuxo) por riba de quen estea detrás.
   { y, r:[x,y,w,h] | poly, draw?, withDraw? } → tapa o que teña a súa y menor ca L.y */
function drawLayer(L) {
  const c = E.ctx;
  if (L.draw) { L.draw(c, E.t); return; }
  c.save(); c.beginPath();
  if (L.poly) { L.poly.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.closePath(); } else c.rect(...L.r);
  c.clip(); drawBg(); if (L.withDraw && E.scene.draw) E.scene.draw(c, E.t); c.restore();
}
function render() {
  const c = E.ctx, S = E.scene; if (!S) return;
  c.clearRect(0, 0, W, H);
  drawBg();
  if (S.draw) S.draw(c, E.t);
  // actor, NPCs e capas dianteiras ordénanse por profundidade (y)
  const list = visibleNpcs().map(n => ({ y: n.y, f: () => drawNpc(n) }));
  for (const L of S.front || []) if (!L.when || L.when()) list.push({ y: L.y, f: () => drawLayer(L) });
  if (E.actor.visible) list.push({ y: E.actor.y + 0.01, f: drawActor });
  list.sort((a, b) => a.y - b.y).forEach(o => o.f());
  if (S.drawFront) S.drawFront(c, E.t);
  if (E.olloT > 0) drawOllo(); else if (!E.dlg && !E.busy && !S.noActor) drawExitHints();
  drawBarks();
  // etiqueta do cursor
  const hv = E.hover; let label = '';
  if (hv && (!hv.o.when || hv.o.when())) { const n = hv.o.name; label = E.held ? `${hv.kind === 'npc' ? 'Dar' : 'Usar'} ${ITEMS[E.held].name} ${hv.kind === 'npc' ? 'a' : 'con'} ${n}` : (hv.o.exit ? `→ ${n}` : n); }
  else if (E.held) label = `Usar ${ITEMS[E.held].name} con...`;
  if (label && !E.dlg) { c.font = '700 22px "Trebuchet MS", sans-serif'; c.textAlign = 'center'; c.lineWidth = 5; c.lineJoin = 'round'; c.strokeStyle = '#000'; const lx = Math.max(120, Math.min(W - 120, E.mouse.x)), ly = Math.max(30, E.mouse.y - 26); c.strokeText(label, lx, ly); c.fillStyle = hv && hv.o.exit && !E.held ? '#9fe0ff' : '#ffe38a'; c.fillText(label, lx, ly); c.textAlign = 'left'; }
  if (E.fade > 0.01) { c.fillStyle = `rgba(0,0,0,${E.fade})`; c.fillRect(0, 0, W, H); }
}
function boxOf(o) {
  if (o.sheet || o.draw || o.talk) return npcBox(o);
  if (o.r) return o.r;
  const xs = o.poly.map(p => p[0]), ys = o.poly.map(p => p[1]), x = Math.min(...xs), y = Math.min(...ys);
  return [x, y, Math.max(...xs) - x, Math.max(...ys) - y];
}
function drawOllo() {
  const c = E.ctx, a = Math.min(1, E.olloT / 0.4, (4.5 - E.olloT) / 0.25);
  c.save(); c.globalAlpha = a;
  c.globalCompositeOperation = 'saturation'; c.fillStyle = 'hsl(0,0%,50%)'; c.fillRect(0, 0, W, H);
  c.globalCompositeOperation = 'source-over'; c.fillStyle = 'rgba(10,10,12,.28)'; c.fillRect(0, 0, W, H);
  c.font = '700 15px "Trebuchet MS", sans-serif'; c.lineJoin = 'round';
  const items = [...visibleNpcs().filter(n => n.key !== false).map(n => ({ o: n, npc: true })), ...visibleHots().filter(h => h.key || h.exit || h.olloOnly).map(h => ({ o: h }))];
  for (const { o } of items) {
    const [x, y, w, h] = boxOf(o), done = o.done && o.done(), col = o.exit && !o.key ? '#7fd4ff' : done ? '#5fe08a' : '#ffd23a';
    c.setLineDash([9, 6]); c.lineDashOffset = -E.t * 30; c.lineWidth = 3; c.strokeStyle = col; c.strokeRect(x + 2, y + 2, w - 4, h - 4); c.setLineDash([]);
    const t = (o.exit && !o.key ? '→ ' : '') + o.name, tx = Math.max(8, Math.min(W - 8 - c.measureText(t).width, x + 6)), ty = y > 26 ? y - 8 : y + h + 18;
    c.lineWidth = 4; c.strokeStyle = '#000'; c.strokeText(t, tx, ty); c.fillStyle = col; c.fillText(t, tx, ty);
  }
  c.font = '800 18px "Trebuchet MS", sans-serif'; c.fillStyle = '#ffd23a'; c.textAlign = 'right'; c.lineWidth = 4; c.strokeStyle = '#000'; c.strokeText('OLLO DE MAQUINISTA', W - 14, H - 14); c.fillText('OLLO DE MAQUINISTA', W - 14, H - 14); c.textAlign = 'left';
  c.restore();
}
/* bocadillos sobre a cabeza */
function wrap(c, text, maxW) { const words = text.split(' '), lines = []; let cur = ''; for (const w of words) { const t = cur ? cur + ' ' + w : w; if (c.measureText(t).width > maxW && cur) { lines.push(cur); cur = w; } else cur = t; } if (cur) lines.push(cur); return lines; }
function drawBarks() {
  const c = E.ctx;
  for (const b of E.barks) {
    let x, y;
    if (b.who === 'Martín') { const A = E.actor, s = scaleAt(A.y); x = A.x; y = A.y - (E.scene.actorH || 330) * s - 12; }
    else { const n = visibleNpcs().find(n => n.name === b.who); if (!n) continue; const bx = npcBox(n); x = n.x; y = bx[1] - 10; }
    c.font = '700 21px "Trebuchet MS", sans-serif'; c.textAlign = 'center'; c.lineJoin = 'round';
    const lines = wrap(c, b.text, 330), lh = 25; y = Math.max(16 + lines.length * lh, y); x = Math.max(175, Math.min(W - 175, x));
    lines.forEach((l, i) => { const ly = y - (lines.length - 1 - i) * lh; c.lineWidth = 5; c.strokeStyle = '#000'; c.strokeText(l, x, ly); c.fillStyle = b.who === 'Martín' ? '#ffffff' : (PORTRAIT_COLORS[b.who] || '#ffe38a'); c.fillText(l, x, ly); });
    c.textAlign = 'left';
  }
}
/* ---------- NPC que pasean ----------
  patrol: { pts: [[x, y, dirAoChegar?], ...], speed, pause: [min, max], fps, when?: () => bool,
            walk: { dir: [celas] }, idle: { dir: cela }, talk: { dir: [celas] } }
  dir: F (cara á cámara), B (de costas), L, R, FL, FR, BL, BR. Se falta unha dirección úsase
  a contraria en espello (L↔R). Párase mentres Martín interactúa con el e mira cara a Martín. */
const MIRROR = { L: 'R', R: 'L', FL: 'FR', FR: 'FL', BL: 'BR', BR: 'BL', F: 'F', B: 'B' };
function dir8(dx, dy) {
  if (Math.abs(dy) < Math.abs(dx) * 0.4) return dx < 0 ? 'L' : 'R';
  if (Math.abs(dx) < Math.abs(dy) * 0.4) return dy < 0 ? 'B' : 'F';
  return (dy < 0 ? 'B' : 'F') + (dx < 0 ? 'L' : 'R');
}
function patrolStep(n, dt) {
  const P = n.patrol, st = n._p || (n._p = { i: 0, wait: P.startWait ?? 0.8, dir: n.dir || 'F', moving: false, t: 0 });
  st.moving = false;
  if (n._hold || (E.dlg && E.dlg.who === n.name)) { const A = E.actor; if (A.visible && Math.abs(A.x - n.x) > 4) st.dir = A.x < n.x ? 'FL' : 'FR'; return; }
  if (P.when && !P.when()) return;
  if (st.wait > 0) { st.wait -= dt; return; }
  const pt = P.pts[st.i], dx = pt[0] - n.x, dy = pt[1] - n.y, d = Math.hypot(dx, dy), sp = (P.speed || 80) * npcScale(n) * dt;
  if (d <= sp) {
    n.x = pt[0]; n.y = pt[1]; if (pt[2]) st.dir = pt[2];
    const [a, b] = P.pause || [1, 3]; st.wait = a + Math.random() * (b - a); st.i = (st.i + 1) % P.pts.length;
  } else { n.x += dx / d * sp; n.y += dy / d * sp; st.dir = dir8(dx, dy); st.moving = true; st.t += dt; }
}
/* movemento dun NPC guiado por un script (p. ex. saír correndo): await npcMove(n, x, y, { frames, fps, speed, flip }) */
function npcMove(n, x, y, o = {}) { return new Promise(r => { n._mv = { x, y, speed: o.speed || 120, frames: o.frames, fps: o.fps || 10, flip: !!o.flip, t: 0, done: r }; }); }
function moveStep(n, dt) {
  const M = n._mv, dx = M.x - n.x, dy = M.y - n.y, d = Math.hypot(dx, dy), sp = M.speed * npcScale(n) * dt; M.t += dt;
  if (d <= sp) { n.x = M.x; n.y = M.y; n._mv = null; M.done(); } else { n.x += dx / d * sp; n.y += dy / d * sp; }
}
function patrolFrame(n, talking) {
  const P = n.patrol, st = n._p || { dir: n.dir || 'F', moving: false, t: 0 };
  const pick = tbl => tbl && (tbl[st.dir] !== undefined ? [tbl[st.dir], false] : tbl[MIRROR[st.dir]] !== undefined ? [tbl[MIRROR[st.dir]], true] : null);
  let r = st.moving && pick(P.walk);
  if (r) return [r[0][Math.floor(st.t * (P.fps || 8)) % r[0].length], r[1]];
  r = talking && pick(P.talk);
  if (r) return [r[0][Math.floor(E.t * 6) % r[0].length], r[1]];
  r = pick(P.idle) || [n.idle, false];
  return r;
}
function drawActor() {
  const A = E.actor, s = scaleAt(A.y), h = (E.scene.actorH || 330) * s;
  drawShadow(A.x, A.y, 34 * s);
  let idx, flip = false, bob = 0;
  const talking = (E.dlg && E.dlg.who === 'Martín' && E.dlg.shown < E.dlg.text.length) || E.barks.some(b => b.who === 'Martín');
  if (A.pose && A.pose.until > E.t) idx = A.pose.idx;
  else if (A.walking) {
    if (A.face === 'L' || A.face === 'R') { idx = MARTIN.walkR[Math.floor(A.t * 10) % 6]; flip = A.face === 'L'; }
    else { idx = A.face === 'B' ? MARTIN.idleB : MARTIN.idleF; bob = Math.abs(Math.sin(A.t * 10)) * 4 * s; }
  } else {
    idx = A.face === 'B' ? MARTIN.idleB : A.face === 'F' ? MARTIN.idleF : MARTIN.idleR; flip = A.face === 'L';
    if (talking) { if (A.face === 'F') idx = MARTIN.talkF[Math.floor(E.t * 4) % 4]; else bob = (Math.floor(E.t * 7) % 2) * 2 * s; }
  }
  drawSprite(MARTIN.sheet, idx, A.x, A.y - bob - (A.lift || 0) * s, h, flip, MARTIN);
}
/* eleva a Martín sobre o chan (subir a unha cadeira, a un banco...): `to` en píxeles a escala 1, a sombra queda no chan */
async function actorLift(to, ms = 450) {
  const A = E.actor, from = A.lift || 0, t0 = performance.now();
  for (;;) { const k = Math.min(1, (performance.now() - t0) / ms), e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2; A.lift = from + (to - from) * e; if (k >= 1) break; await sleep(16); }
}
function drawNpc(n) {
  const s = npcScale(n), talking = (E.dlg && E.dlg.who === n.name && E.dlg.shown < E.dlg.text.length) || E.barks.some(b => b.who === n.name);
  if (n.shadow !== false) drawShadow(n.x, n.y, 30 * s);
  if (n.draw) { n.draw(E.ctx, E.t, talking, s); return; }
  if (n._mv && n._mv.frames) { const M = n._mv; drawSprite(n.sheet, M.frames[Math.floor(M.t * M.fps) % M.frames.length], n.x, n.y, n.h * s, M.flip, n.spec); return; }
  if (n.patrol) { const [idx, flip] = patrolFrame(n, talking); drawSprite(n.sheet, idx, n.x, n.y, n.h * s, flip, n.spec); return; }
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
  $('dlgPor').style.backgroundImage = por ? `url(${res(por)})` : 'none';
  $('dlgName').textContent = D.choices ? 'Martín' : who;
  if (D.choices) {
    $('dlgText').innerHTML = '';
    D.choices.forEach((o, i) => { const b = document.createElement('button'); b.className = 'opt'; b.textContent = '▸ ' + o.t; b.onclick = ev => { ev.stopPropagation(); E.dlg = null; el.hidden = true; D.pick(i); }; $('dlgText').appendChild(b); });
  } else $('dlgText').textContent = D.text.slice(0, Math.floor(D.shown));
  $('dlgMore').hidden = !!D.choices || D.shown < D.text.length;
}

/* ---------- son (sintetizado con WebAudio, sen ficheiros) ---------- */
const SFX = {
  ctx: null, fx: null, mus: null, cur: null, timer: null,
  init() {
    if (this.ctx) { if (this.ctx.state === 'suspended') this.ctx.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
    try { this.ctx = new AC(); } catch (e) { return; }
    this.fx = this.ctx.createGain(); this.fx.connect(this.ctx.destination);
    this.mus = this.ctx.createGain(); this.mus.connect(this.ctx.destination);
    this.volume();
    if (this.want) this.music(this.want, true);
  },
  volume() { if (!this.ctx) return; this.fx.gain.value = E.opts.sfx; this.mus.gain.value = E.opts.music * 0.5; },
  env(g, t0, a, d, v) { g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(v, t0 + a); g.gain.exponentialRampToValueAtTime(0.0001, t0 + a + d); },
  tone(f, dur, type = 'sine', v = 0.2, when = 0, dest) {
    if (!this.ctx) return; const t0 = this.ctx.currentTime + when, o = this.ctx.createOscillator(), g = this.ctx.createGain();
    o.type = type; o.frequency.setValueAtTime(f, t0); o.connect(g); g.connect(dest || this.fx); this.env(g, t0, 0.01, dur, v); o.start(t0); o.stop(t0 + dur + 0.05);
  },
  noise(dur, freq, q = 1, v = 0.2, when = 0, type = 'bandpass') {
    if (!this.ctx) return; const t0 = this.ctx.currentTime + when, n = Math.ceil(this.ctx.sampleRate * dur), b = this.ctx.createBuffer(1, n, this.ctx.sampleRate), d = b.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
    const s = this.ctx.createBufferSource(), f = this.ctx.createBiquadFilter(), g = this.ctx.createGain(); s.buffer = b; f.type = type; f.frequency.value = freq; f.Q.value = q;
    s.connect(f); f.connect(g); g.connect(this.fx); this.env(g, t0, 0.005, dur, v); s.start(t0);
  },
  step(floor) { const f = { madeira: 520, grava: 2600, pedra: 1500 }[floor] || 1100; this.noise(0.07, f * (0.9 + Math.random() * 0.2), 1.4, 0.12); },
  pick() { this.tone(660, 0.09, 'triangle', 0.18); this.tone(990, 0.14, 'triangle', 0.16, 0.08); },
  door() { this.tone(80, 0.3, 'sine', 0.35); this.noise(0.25, 300, 0.8, 0.15, 0, 'lowpass'); },
  paper() { this.noise(0.28, 3500, 0.7, 0.12, 0, 'highpass'); },
  ollo() { [523, 659, 784].forEach((f, i) => this.tone(f, 0.25, 'sine', 0.1, i * 0.07)); },
  /* o leitmotiv: asubío de vapor «dous longos e un curto» */
  whistle(pattern = 'LLS', v = 0.22) {
    this.init(); if (!this.ctx) return 0;
    let t = this.ctx.currentTime + 0.05;
    for (const ch of pattern) {
      const dur = ch === 'L' ? 1.05 : 0.35;
      for (const f of [440, 523, 659]) {
        const o = this.ctx.createOscillator(), g = this.ctx.createGain(), lp = this.ctx.createBiquadFilter();
        o.type = 'sawtooth'; o.frequency.setValueAtTime(f * 0.93, t); o.frequency.exponentialRampToValueAtTime(f, t + 0.09); lp.type = 'lowpass'; lp.frequency.value = 1800;
        o.connect(lp); lp.connect(g); g.connect(this.fx);
        g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(v / 3, t + 0.07); g.gain.setValueAtTime(v / 3, t + dur - 0.1); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        o.start(t); o.stop(t + dur + 0.05);
      }
      this.noise(dur, 2400, 0.6, v * 0.35, t - this.ctx.currentTime);
      t += dur + 0.22;
    }
    return (t - this.ctx.currentTime) * 1000;
  },
  /* música mínima por zona: un arpexio en bucle que se programa por adiantado */
  music(name, force) {
    this.want = name;
    if (!this.ctx) return; if (this.cur === name && !force) return;
    this.cur = name; clearInterval(this.timer); this.timer = null;
    const M = name && MUSIC[name]; if (!M) return;
    const beat = 60 / M.bpm; let next = this.ctx.currentTime + 0.3, i = 0;
    const tick = () => {
      while (next < this.ctx.currentTime + 0.6) {
        const n = M.notes[i % M.notes.length], b = M.bass && M.bass[Math.floor(i / 4) % M.bass.length];
        if (n) this.tone(n, beat * 1.6, M.wave || 'triangle', 0.12, next - this.ctx.currentTime, this.mus);
        if (b && i % 4 === 0) this.tone(b, beat * 3.6, 'sine', 0.16, next - this.ctx.currentTime, this.mus);
        next += beat; i++;
      }
    };
    tick(); this.timer = setInterval(tick, 150);
  },
};
const nt = s => s.split(' ').map(x => x === '-' ? 0 : 440 * Math.pow(2, ({ C: -9, D: -7, E: -5, F: -4, G: -2, A: 0, B: 2 }[x[0]] + (x[1] === '#' ? 1 : x[1] === 'b' ? -1 : 0) + 12 * (+x.slice(-1) - 4)) / 12));
const MUSIC = {
  // re dórico, lento: estación e andén
  estacion: { bpm: 84, notes: nt('D4 A4 F4 A4 C5 A4 G4 E4 D4 A4 F4 A4 G4 E4 C4 E4'), bass: nt('D2 C2 Bb1 C2') },
  // máis cálido para a casa
  casa: { bpm: 72, notes: nt('G4 B4 D5 B4 A4 C5 E5 C5 F#4 A4 D5 A4 G4 B4 D5 -'), bass: nt('G2 A2 D2 G2'), wave: 'sine' },
  // mapa: aire de muiñeira moi suave
  mapa: { bpm: 132, notes: nt('A4 B4 C#5 D5 E5 - D5 C#5 B4 - A4 B4 C#5 - E4 -'), bass: nt('A2 E2 A2 E2') },
};

/* ---------- menú, opcións, actos e créditos ---------- */
function showPane(id) { for (const p of document.querySelectorAll('#menu .pane')) p.hidden = p.id !== id; }
function openMenu() { E.paused = true; $('menu').hidden = false; $('btnCont').hidden = !(E.scene || loadGame()); showPane('mMain'); }
function closeMenu() { $('menu').hidden = true; E.paused = false; }
function startPreset(P) {
  E.act = P.id; E.inv = [...(P.inv || [])]; E.flags = { ...(P.flags || {}) }; E.held = null; E.dlg = null; $('dlg').hidden = true;
  closeMenu(); enterScene(P.scene, P.at); drawInv(); if (P.intro) run(P.intro);
}
/* un acto pode levar unha cinemática de apertura (P.cine): vese en «Nova partida», antes de entrar na escena */
async function startGame(fresh) {
  SFX.init();
  if (!fresh && E.scene) { closeMenu(); return; }
  const s = !fresh && loadGame();
  if (s) { E.act = s.act; E.inv = s.inv || []; E.flags = s.flags || {}; closeMenu(); enterScene(s.scene, [s.x, s.y]); drawInv(); }
  else { const P = ACTS[0]; if (P.cine) { $('menu').hidden = true; SFX.music(null); await P.cine(); } startPreset(P); }
}
function buildMenu() {
  const list = $('actList'); list.innerHTML = '';
  for (const A of ACTS) {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'act' + (A.disabled ? ' off' : '');
    b.innerHTML = `<b>${A.name}</b><small>${A.desc || ''}</small>`; b.disabled = !!A.disabled;
    b.onclick = () => { SFX.init(); startPreset(A); };
    list.appendChild(b);
  }
  $('credText').innerHTML = CREDITS;
  const o = E.opts;
  $('optFast').checked = o.fast; $('optMus').value = o.music; $('optSfx').value = o.sfx;
  $('optFast').onchange = e => { o.fast = e.target.checked; saveOpts(); };
  $('optMus').oninput = e => { o.music = +e.target.value; SFX.volume(); saveOpts(); };
  $('optSfx').oninput = e => { o.sfx = +e.target.value; SFX.volume(); saveOpts(); };
  $('optTest').onclick = () => SFX.whistle();
  const oc = $('optCine'); if (oc) { oc.hidden = !ACTS[0].cine; oc.onclick = async () => { SFX.init(); const m = SFX.want; $('menu').hidden = true; SFX.music(null); await ACTS[0].cine({ day: false }); $('menu').hidden = false; SFX.music(m); }; }
  $('btnCont').onclick = () => startGame(false);
  $('btnNew').onclick = () => startGame(true);
  $('btnActs').onclick = () => showPane('mActs');
  $('btnOpts').onclick = () => showPane('mOpts');
  $('btnCred').onclick = () => showPane('mCred');
  for (const b of document.querySelectorAll('#menu .back:not([id])')) b.onclick = () => showPane('mMain');
  const fs = $('btnFull');
  if (document.fullscreenEnabled && matchMedia('(pointer:coarse)').matches) {
    fs.hidden = false;
    fs.onclick = async () => { try { await document.documentElement.requestFullscreen(); await screen.orientation.lock('landscape'); } catch (e) { } };
  }
  $('btnVert').onclick = () => { document.body.classList.add('vertOk'); try { localStorage.setItem('viaMortaVertical', '1'); } catch (e) { } };
  try { if (localStorage.getItem('viaMortaVertical')) document.body.classList.add('vertOk'); } catch (e) { }
}

/* ---------- arranque ---------- */
window.addEventListener('load', () => {
  E.cv = $('game'); E.ctx = E.cv.getContext('2d'); E.ctx.imageSmoothingEnabled = true;
  loadOpts(); wireInput(); buildMenu(); drawInv();
  // precarga
  for (const S of Object.values(SCENES)) if (S.bg) img(S.bg); img(MARTIN.sheet);
  for (const S of Object.values(SCENES)) for (const n of S.npcs || []) if (n.sheet) img(n.sheet);
  openMenu();
  requestAnimationFrame(frame);
});
