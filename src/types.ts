export type Position = [number, number];

export interface Puzzle {
  spangram: string;
  words: string[];
  grid: string[];
  paths: Record<string, Position[]>;
}

export type ProbeColor = 'green' | 'gold' | 'gray';

export interface Probe {
  word: string;
  colors: ProbeColor[];
}

export interface GameState {
  p: Puzzle;
  paints: (ProbeColor | null)[][];
  probes: Probe[];
  found: Set<string>;
  events: string[];
  score: number;
  mode: 'probe' | 'strand';
  path: Position[];
  pos: Record<string, number[]>;
  hintProgress: number;
  hints: number;
  won: boolean;
  foundPaths: Position[][];
}
