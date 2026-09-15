import { PUZZLES } from './puzzles';
import { Position, ProbeColor, GameState } from './types';

const MAX_PROBES = 3;
const HINT_STEPS = 3;
const EMOJI: Record<string, string> = {
  green: "🟩",
  gold: "🟨",
  gray: "⬜",
  theme: "🔵",
  span: "🟡",
  hint: "💡"
};

let state: GameState;
let puzzleIndex: number;

const $ = (id: string) => document.getElementById(id)!;
const gridEl = $('grid') as HTMLDivElement;
const traceEl = $('trace') as unknown as SVGSVGElement;
const probesEl = $('probes') as HTMLDivElement;
const form = $('form') as HTMLFormElement;
const guessEl = $('guess') as HTMLInputElement;
const msgEl = $('msg') as HTMLDivElement;
const foundEl = $('found') as HTMLDivElement;
const modeLabel = $('modeLabel') as HTMLSpanElement;
const scoreLabel = $('scoreLabel') as HTMLSpanElement;
const submitBtn = $('submitBtn') as HTMLButtonElement;
const hintBtn = $('hintBtn') as HTMLButtonElement;
const strandBtn = $('strandBtn') as HTMLButtonElement;
const hintMeter = $('hintMeter') as HTMLDivElement;
const hintMeterLabel = $('hintMeterLabel') as HTMLSpanElement;
const hintPips = $('hintPips') as HTMLSpanElement;
const dateLabel = $('dateLabel') as HTMLSpanElement;
const helpOverlay = $('helpOverlay') as HTMLDivElement;
const shareOverlay = $('shareOverlay') as HTMLDivElement;

function dayIndex(): number {
  const now = new Date();
  const startDate = new Date(2026, 8, 13);
  const diff = Math.floor((now.getTime() - startDate.getTime()) / 86400000);
  return ((diff % PUZZLES.length) + PUZZLES.length) % PUZZLES.length;
}

function closeHelp() {
  helpOverlay.classList.remove("open");
  helpOverlay.style.display = "none";
}

$('helpBtn').addEventListener("click", () => {
  helpOverlay.style.display = "";
  helpOverlay.classList.add("open");
});
$('helpClose').addEventListener("click", closeHelp);
$('helpClose').addEventListener("pointerup", closeHelp);
helpOverlay.addEventListener("click", (e) => {
  if (e.target === helpOverlay) closeHelp();
});

$('shareClose').addEventListener("click", () => shareOverlay.classList.remove("open"));
($('copyShare') as HTMLButtonElement).onclick = async () => {
  try {
    const preview = $('sharePreview').textContent || '';
    await navigator.clipboard.writeText(preview);
    $('copyShare').textContent = "Copied!";
  } catch {
    $('copyShare').textContent = "Copy failed";
  }
};

function start() {
  puzzleIndex = dayIndex();
  const p = PUZZLES[puzzleIndex];
  const pos: Record<string, number[]> = {};
  Object.values(p.paths).forEach(path => path.forEach(([r, c], idx) => {
    const k = r + "," + c;
    (pos[k] ??= []).push(idx);
  }));
  state = {
    p,
    paints: Array.from({ length: 6 }, () => Array(6).fill(null)),
    probes: [],
    found: new Set(),
    events: [],
    score: 0,
    mode: "probe",
    path: [],
    pos,
    hintProgress: 0,
    hints: 0,
    won: false,
    foundPaths: []
  };
  guessEl.disabled = false;
  submitBtn.textContent = "Probe";
  strandBtn.style.display = "";
  strandBtn.textContent = "Start tracing";
  hintBtn.textContent = "Hint";
  hintBtn.disabled = true;
  msgEl.textContent = "Probe letters, or start tracing whenever you are ready.";
  renderAll();
}

function owner(r: number, c: number): string | null {
  for (const [w, path] of Object.entries(state.p.paths)) {
    if (state.found.has(w) && path.some(([pr, pc]) => pr === r && pc === c)) {
      return w;
    }
  }
  return null;
}

function renderGrid() {
  gridEl.innerHTML = "";
  const selected = new Set(state.path.map(([r, c]) => r + "," + c));
  for (let r = 0; r < 6; r++) {
    for (let c = 0; c < 6; c++) {
      const d = document.createElement("div");
      d.className = "cell";
      d.textContent = state.p.grid[r][c];
      d.dataset.r = String(r);
      d.dataset.c = String(c);
      const w = owner(r, c);
      if (w) d.classList.add(w === state.p.spangram ? "found-span" : "found-theme");
      else if (state.paints[r][c]) d.classList.add(state.paints[r][c]!);
      if (selected.has(r + "," + c)) d.classList.add("selected");
      gridEl.appendChild(d);
    }
  }
  renderTrace();
}

function renderTrace() {
  traceEl.innerHTML = "";
  const all = [...state.foundPaths, ...(state.path.length ? [state.path] : [])];
  if (!all.length) return;
  const board = gridEl.getBoundingClientRect();
  traceEl.setAttribute("viewBox", `0 0 ${board.width} ${board.height}`);
  all.forEach(path => {
    if (path.length < 2) return;
    const pts = path.map(([r, c]) => {
      const el = gridEl.querySelector(`[data-r="${r}"][data-c="${c}"]`)!.getBoundingClientRect();
      return `${el.left - board.left + el.width / 2},${el.top - board.top + el.height / 2}`;
    }).join(" ");
    const p = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
    p.setAttribute("points", pts);
    p.setAttribute("class", "trace-line");
    traceEl.appendChild(p);
  });
}

function renderProbes() {
  probesEl.innerHTML = "";
  for (let i = 0; i < MAX_PROBES; i++) {
    const row = document.createElement("div");
    row.className = "probe-row";
    const p = state.probes[i];
    const len = p ? p.word.length : 6;
    for (let j = 0; j < len; j++) {
      const t = document.createElement("div");
      t.className = "ptile";
      if (p) {
        t.textContent = p.word[j];
        t.classList.add(p.colors[j]);
      }
      row.appendChild(t);
    }
    probesEl.appendChild(row);
  }
}

function renderFound() {
  foundEl.innerHTML = "";
  state.p.words.forEach(w => {
    if (!state.found.has(w)) return;
    const x = document.createElement("span");
    x.className = "chip " + (w === state.p.spangram ? "span" : "theme");
    x.textContent = w;
    foundEl.appendChild(x);
  });
}

function renderMeter() {
  const tracing = state.mode === "strand" && !state.won;
  hintMeter.classList.toggle("show", tracing);
  if (!tracing) return;
  hintMeterLabel.textContent = state.hintProgress >= HINT_STEPS ? "Hint ready" : "Hint in " + (HINT_STEPS - state.hintProgress);
  hintPips.innerHTML = "";
  for (let i = 0; i < HINT_STEPS; i++) {
    const p = document.createElement("span");
    p.className = "pip" + (i < state.hintProgress ? " on" : "");
    hintPips.appendChild(p);
  }
  hintBtn.disabled = state.hintProgress < HINT_STEPS;
}

function renderAll() {
  renderGrid();
  renderProbes();
  renderFound();
  renderMeter();
  const left = state.p.words.length - state.found.size;
  modeLabel.textContent = state.won ? "Board complete" : state.mode === "probe" ? `Probe ${state.probes.length}/${MAX_PROBES}` : `Strand mode · ${left} words left`;
  scoreLabel.textContent = "Score " + state.score;
  const now = new Date();
  dateLabel.textContent = now.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric", year: "numeric" });
}

function scoreProbe(word: string): ProbeColor[] {
  return [...word].map((ch, i) => {
    let green = false, on = false;
    for (let r = 0; r < 6; r++) {
      for (let c = 0; c < 6; c++) {
        if (state.p.grid[r][c] === ch) {
          on = true;
          if ((state.pos[r + "," + c] || []).includes(i)) green = true;
        }
      }
    }
    return green ? "green" : on ? "gold" : "gray";
  });
}

function paintBoard(word: string) {
  for (let r = 0; r < 6; r++) {
    for (let c = 0; c < 6; c++) {
      const ch = state.p.grid[r][c];
      if (!word.includes(ch)) continue;
      const green = [...word].some((l, i) => l === ch && (state.pos[r + "," + c] || []).includes(i));
      if (state.paints[r][c] !== "green") state.paints[r][c] = green ? "green" : "gold";
    }
  }
}

function enterStrand() {
  if (state.mode !== "probe") return;
  state.mode = "strand";
  submitBtn.textContent = "Clear path";
  guessEl.disabled = true;
  strandBtn.style.display = "none";
  const unused = MAX_PROBES - state.probes.length;
  if (unused) {
    state.score += unused * 5;
    msgEl.textContent = `Tracing now. +${unused * 5} for ${unused} unused probe${unused === 1 ? "" : "s"}.`;
  } else msgEl.textContent = "Trace adjacent letters to submit theme words.";
  renderAll();
}

function shareText(): string {
  const now = new Date();
  const d = now.toISOString().slice(0, 10);
  const lines = [`Strandle ${d} #${puzzleIndex + 1}  ${state.probes.length}/${MAX_PROBES}`, `Score ${state.score}`, ""];
  if (!state.probes.length) lines.push("🎯 no probes");
  state.probes.forEach(p => lines.push(p.colors.map(c => EMOJI[c]).join("")));
  lines.push("");
  const timeline = state.events.map(e => e === "hint" ? EMOJI.hint : e === state.p.spangram ? EMOJI.span : EMOJI.theme).join("");
  if (timeline) lines.push(timeline);
  lines.push(`${state.found.size}/${state.p.words.length} words`);
  return lines.join("\n");
}

function openShare() {
  if (shareOverlay.classList.contains("open")) return;
  $('shareTitle').textContent = state.won ? "Board complete" : "Share progress";
  $('shareSub').textContent = "Probe colors and event order, with no board or word spoilers.";
  $('sharePreview').textContent = shareText();
  $('copyShare').textContent = "Copy result";
  shareOverlay.classList.add("open");
}

form.addEventListener("submit", e => {
  e.preventDefault();
  if (state.won) {
    openShare();
    return;
  }
  if (state.mode === "strand") {
    state.path = [];
    renderGrid();
    return;
  }
  const word = guessEl.value.trim().toUpperCase().replace(/[^A-Z]/g, "");
  guessEl.value = "";
  if (word.length < 4 || word.length > 8) {
    msgEl.textContent = "Use a 4–8 letter probe.";
    return;
  }
  const colors = scoreProbe(word);
  state.probes.push({ word, colors });
  paintBoard(word);
  msgEl.textContent = colors.includes("green") ? "A letter locked to a theme-word index." : colors.includes("gold") ? "Those letters live on the board." : "None of those letters are on the board.";
  if (state.probes.length >= MAX_PROBES) enterStrand();
  else renderAll();
});

strandBtn.onclick = () => {
  if (state.won) {
    openShare();
    return;
  }
  enterStrand();
};

hintBtn.onclick = () => {
  if (state.won) {
    openShare();
    return;
  }
  if (state.mode !== "strand" || state.hintProgress < HINT_STEPS) return;
  const un = state.p.words.filter(w => !state.found.has(w));
  if (!un.length) return;
  const w = un[Math.floor(Math.random() * un.length)];
  const [r, c] = state.p.paths[w][0];
  state.paints[r][c] = "green";
  state.score -= 8;
  state.hints++;
  state.events.push("hint");
  state.hintProgress = 0;
  msgEl.textContent = `Hint: a theme word starts at row ${r + 1}, column ${c + 1}.`;
  renderAll();
};

const adjacent = (a: Position, b: Position) => Math.max(Math.abs(a[0] - b[0]), Math.abs(a[1] - b[1])) === 1;

function pointCell(x: number, y: number): Position | null {
  const e = document.elementFromPoint(x, y) as HTMLElement | null;
  return e?.classList.contains("cell") ? [+e.dataset.r!, +e.dataset.c!] : null;
}

function addPath(rc: Position | null) {
  if (!rc) return;
  const last = state.path.at(-1);
  if (last && last[0] === rc[0] && last[1] === rc[1]) return;
  if (state.path.some(([r, c]) => r === rc[0] && c === rc[1])) {
    state.path = state.path.slice(0, state.path.findIndex(([r, c]) => r === rc[0] && c === rc[1]) + 1);
    renderGrid();
    return;
  }
  if (last && !adjacent(last, rc)) return;
  state.path.push(rc);
  renderGrid();
}

function submitPath() {
  if (state.mode !== "strand" || state.path.length < 3 || state.won) {
    state.path = [];
    renderGrid();
    return;
  }
  const traced = state.path.map(([r, c]) => state.p.grid[r][c]).join("");
  const match = Object.entries(state.p.paths).find(([w]) => !state.found.has(w) && (traced === w || traced === w.split("").reverse().join("")));
  if (match) {
    const w = match[0];
    state.found.add(w);
    state.events.push(w);
    state.score += w === state.p.spangram ? 25 : 10;
    state.foundPaths.push([...state.path]);
    msgEl.textContent = w === state.p.spangram ? "Spangram!" : "Theme word!";
    if (state.found.size === state.p.words.length) {
      state.won = true;
      submitBtn.textContent = "Share";
      hintBtn.disabled = false;
      hintBtn.textContent = "Share";
      strandBtn.style.display = "";
      strandBtn.textContent = "Share";
      msgEl.textContent = `Clear! Score ${state.score}.`;
      openShare();
    }
  } else {
    state.hintProgress = Math.min(HINT_STEPS, state.hintProgress + 1);
    msgEl.textContent = state.hintProgress >= HINT_STEPS ? "No match. Hint ready." : `No match. ${HINT_STEPS - state.hintProgress} more miss${HINT_STEPS - state.hintProgress === 1 ? "" : "es"} for a hint.`;
  }
  state.path = [];
  renderAll();
}

let drawing = false;
gridEl.addEventListener("pointerdown", e => {
  if (state.mode !== "strand" || state.won) return;
  drawing = true;
  gridEl.setPointerCapture(e.pointerId);
  state.path = [];
  addPath(pointCell(e.clientX, e.clientY));
});
gridEl.addEventListener("pointermove", e => {
  if (drawing) addPath(pointCell(e.clientX, e.clientY));
});
gridEl.addEventListener("pointerup", () => {
  if (drawing) {
    drawing = false;
    submitPath();
  }
});
window.addEventListener("resize", renderTrace);

start();
