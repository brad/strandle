# Strandle Puzzle Generator Guide

This document tells a future agent how to generate new daily puzzles and integrate them into the Strandle game.

## Goals

- Produce a 6×±6 letter grid filled entirely by:
  - One **spangram** (6 letters) that spans opposite sides of the board (full row or full column).
  - 7 other **theme words** (lengths 3–6) that together use every remaining cell exactly once.
- Ensure each word has **exactly one cell-path pattern** (ignoring forward/reverse).
- Ensure **no two word paths cross or share cells**.
- Export the puzzle in the exact format the game expects.

## Required properties

1. **Grid size**: 6×±6.
2. **Letter coverage**: Every cell belongs to exactly one word; no blanks.
3. **Spangram**:
   - Length 6.
   - Must span opposite sides:
     - Full row left→right or right→left, or
     - Full column top→bottom or bottom→top.
4. **Theme words**:
   - 7 words, lengths 3–6.
   - Each word’s letters must form a single contiguous path via king moves (8-directional adjacency).
   - Each word must have **only one valid path pattern** in the final grid (forward and reverse count as the same pattern).
5. **No crossing paths**:
   - Paths may not share cells (by construction, since each cell has one letter).
   - Paths should not visually “cross” in a way that creates ambiguity; in practice, enforcing unique paths plus clean placement is enough.

## Data format

The game uses a JavaScript array `PUZZLES` with entries like:

```js
{
  spangram: "HARBOR",
  words: ["HARBOR","WHARF","KAYAK","DOCK","PIER","BUOY","TIDE","SLIP"],
  grid: ["AHYDOC","WRIOUK","FPLSRB","EKAYPE","DITKAI","HARBOR"],
  paths: {
    HARBOR: [[5,0],[5,1],[5,2],[5,3],[5,4],[5,5]],
    WHARF:  [[0,3],[1,2],[2,3],[3,4],[4,5]],
    KAYAK:  [[3,2],[3,3],[4,2],[4,3],[4,4]],
    DOCK:   [[0,4],[0,5],[1,5],[2,5]],
    PIER:   [[1,0],[2,1],[3,1],[4,1]],
    BUOY:   [[2,0],[3,0],[4,0],[5,0]],
    TIDE:   [[5,5],[4,5],[3,5],[2,4]],
    SLIP:   [[0,0],[1,1],[2,2],[3,3]]
  }
}
```

Notes:

- `grid` is an array of 6 strings, each length 6.
- `paths` maps each word to an array of `[row, col]` coordinates in order.
- `words` includes the spangram plus the 7 theme words.
- Coordinates are 0-based, `[row, col]`.

## Generation algorithm (recommended)

Use Python with `random` and backtracking.

### Step 1: Choose a theme and word list

1. Pick a clear theme (e.g., “harbor”, “space”, “camping”).
2. Choose:
   - 1 spangram (6 letters) that names the theme.
   - 7 theme-related words, lengths 3–6, such that total letters = 36.

Check:

```python
assert len(spangram) == 6
assert len(words) == 8  # including spangram
assert sum(len(w) for w in words) == 36
```

### Step 2: Place the spangram

Place the spangram as a straight line across a full row or column:

- Row example (left→right):

  ```python
  row = random.randint(0, 5)
  path = [(row, c) for c in range(6)]
  ```

- Column example (top→bottom):

  ```python
  col = random.randint(0, 5)
  path = [(r, col) for r in range(6)]
  ```

Mark those cells as occupied and assign letters to the grid.

### Step 3: Place other words

For each remaining word (sorted longest→shortest):

1. List all empty cells as possible starts.
2. For each start, run a DFS/backtracking search to find a path:
   - Move in 8 directions.
   - Do not reuse occupied cells or cells already in the current path.
   - Match letters exactly.
3. When a full placement is found for all words, proceed to validation.

### Step 4: Validate unique paths

For each word `w`:

1. Run a path-finder that collects all possible paths for `w` in the completed grid (limit to ~10–12 paths for performance).
2. Normalize each path by treating forward and reverse as identical:

   ```python
   def normalize(path):
       t = tuple(path)
       r = tuple(reversed(path))
       return min(t, r)
   ```

3. Build a set of normalized paths. The word is valid iff `len(set) == 1`.

If any word has more than one normalized path, reject the board and retry.

### Step 5: Ensure no crossing ambiguity

Given unique-path enforcement and one-letter-per-cell, physical crossings are usually fine. If you want extra safety:

- Visually inspect or add a heuristic that discourages paths that “jump over” each other in tight spaces.
- In practice, the unique-path constraint plus human review is enough.

### Step 6: Export the puzzle

Once validated:

1. Build `grid` as 6 strings.
2. Build `paths` dict with each word’s coordinate list.
3. Construct the puzzle object:

   ```python
   puzzle = {
       "spangram": spangram,
       "words": words,
       "grid": ["".join(row) for row in grid],
       "paths": {w: path_list for w, path_list in paths.items()}
   }
   ```

4. Output as JSON or directly as a JavaScript object literal.

## Integrating into the game

1. Open `strandle.html`.
2. Locate the `PUZZLES` array near the top of the `<script>` block.
3. Add your new puzzle object as the next element, e.g.:

   ```js
   const PUZZLES = [
     { /* puzzle 0 */ },
     { /* puzzle 1 */ },
     { /* puzzle 2 */ },
     { /* your new puzzle 3 */ }
   ];
   ```

4. The daily rotation uses:

   ```js
   function dayIndex() {
     const now = new Date();
     const startDate = new Date(2026, 8, 13); // 2026-09-13
     return Math.floor((now - startDate) / 86400000) % PUZZLES.length;
   }
   ```

   - Adding puzzles at the end automatically extends the cycle.
   - Day N uses `PUZZLES[dayIndex()]`.

5. Save and reload the page. The new puzzle will appear on its assigned day.

## Reference Python skeleton

Use this as a starting point (adapt as needed):

```python
import random

DIRS = [(-1,-1),(-1,0),(-1,1),(0,-1),(0,1),(1,-1),(1,0),(1,1)]
N = 6

def inb(r,c): return 0<=r<N and 0<=c<N
def neigh(r,c):
    for dr,dc in DIRS:
        nr,nc = r+dr, c+dc
        if inb(nr,nc): yield nr,nc

def find_all_paths(grid, word, max_paths=12):
    found = []
    def dfs(i,r,c,used,path):
        if len(found) >= max_paths: return
        if i == len(word):
            found.append(path[:])
            return
        for nr,nc in neigh(r,c):
            if (nr,nc) in used or grid[nr][nc] != word[i]: continue
            used.add((nr,nc)); path.append((nr,nc))
            dfs(i+1,nr,nc,used,path)
            path.pop(); used.remove((nr,nc))
    for r in range(N):
        for c in range(N):
            if grid[r][c] != word[0]: continue
            dfs(1,r,c,{(r,c)},[(r,c)])
            if len(found) >= max_paths: return found
    return found

def unique_pattern(paths):
    norms = set()
    for p in paths:
        t = tuple(p)
        r = tuple(reversed(p))
        norms.add(t if t <= r else r)
    return len(norms) == 1

def dfs_word(w,i,path,occupied):
    if i == len(w): return True
    r,c = path[-1]
    opts = list(neigh(r,c))
    random.shuffle(opts)
    for nr,nc in opts:
        if occupied[nr][nc] or (nr,nc) in path: continue
        path.append((nr,nc))
        if dfs_word(w,i+1,path,occupied): return True
        path.pop()
    return False

def try_place(words, spangram, attempts=5000):
    others = [w for w in words if w != spangram]
    others.sort(key=len, reverse=True)
    for _ in range(attempts):
        grid = [[None]*N for _ in range(N)]
        occupied = [[False]*N for _ in range(N)]
        paths = {}

        # place spangram as a full row
        row = random.randint(0, N-1)
        path = [(row, c) for c in range(N)]
        for i,(r,c) in enumerate(path):
            occupied[r][c] = True
            grid[r][c] = spangram[i]
        paths[spangram] = path

        ok = True
        for w in others:
            placed = False
            cand = [(r,c) for r in range(N) for c in range(N) if not occupied[r][c]]
            random.shuffle(cand)
            for sr,sc in cand:
                p = [(sr,sc)]
                if dfs_word(w,1,p,occupied):
                    for i,(r,c) in enumerate(p):
                        occupied[r][c] = True
                        grid[r][c] = w[i]
                    paths[w] = p
                    placed = True
                    break
            if not placed:
                ok = False
                break
        if not ok: continue

        g = ["".join(ch for ch in row) for row in grid]
        if all(unique_pattern(find_all_paths(g,w)) for w in words):
            return {
                "grid": g,
                "paths": {w: [[r,c] for r,c in p] for w,p in paths.items()}
            }
    return None
```

Usage:

```python
random.seed(SEED)
words = ["SPANGRAM","WORD2","WORD3","WORD4","WORD5","WORD6","WORD7","WORD8"]
spangram = "SPANGRAM"
result = try_place(words, spangram)
if result:
    print(result["grid"])
    print(result["paths"])
```

## Checklist before committing a puzzle

- [ ] 6×±6 grid, 36 letters total.
- [ ] One 6-letter spangram spanning opposite sides.
- [ ] 7 other theme words, all lengths 3–6.
- [ ] Every cell used exactly once.
- [ ] Each word has exactly one normalized path.
- [ ] No obvious path-crossing ambiguities.
- [ ] `grid` and `paths` match the letters and coordinates.
- [ ] Puzzle object inserted correctly into `PUZZLES` in `strandle.html`.

Follow this process and the generated puzzles will drop cleanly into the existing daily-rotation system with no further code changes.