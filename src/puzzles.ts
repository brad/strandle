import { Puzzle } from './types';

export const PUZZLES: Puzzle[] = [
  {
    spangram: "HARBOR",
    words: ["HARBOR", "WHARF", "KAYAK", "DOCK", "PIER", "BUOY", "TIDE", "SLIP"],
    grid: ["AHYDOC", "WRIOUK", "FPLSRB", "EKAYPE", "DITKAI", "HARBOR"],
    paths: {
      HARBOR: [[5, 0], [5, 1], [5, 2], [5, 3], [5, 4], [5, 5]],
      WHARF: [[0, 3], [1, 2], [2, 3], [3, 4], [4, 5]],
      KAYAK: [[3, 2], [3, 3], [4, 2], [4, 3], [4, 4]],
      DOCK: [[0, 4], [0, 5], [1, 5], [2, 5]],
      PIER: [[1, 0], [2, 1], [3, 1], [4, 1]],
      BUOY: [[2, 0], [3, 0], [4, 0], [5, 0]],
      TIDE: [[5, 5], [4, 5], [3, 5], [2, 4]],
      SLIP: [[0, 0], [1, 1], [2, 2], [3, 3]]
    }
  },
  {
    spangram: "GALAXY",
    words: ["GALAXY", "ORBIT", "COMET", "STAR", "MOON", "NOVA", "DUST", "MARS"],
    grid: ["OCARAM", "MNVSBR", "ETOTIO", "YXALAG", "STDMON", "RAUSTO"],
    paths: {
      GALAXY: [[3, 5], [3, 4], [3, 3], [3, 2], [3, 1], [3, 0]],
      ORBIT: [[2, 5], [1, 5], [1, 4], [2, 4], [2, 3]],
      COMET: [[0, 1], [0, 0], [1, 0], [2, 0], [2, 1]],
      STAR: [[4, 0], [4, 1], [5, 1], [5, 0]],
      MOON: [[4, 3], [4, 4], [5, 5], [4, 5]],
      NOVA: [[1, 1], [2, 2], [1, 2], [0, 2]],
      DUST: [[4, 2], [5, 2], [5, 3], [5, 4]],
      MARS: [[0, 5], [0, 4], [0, 3], [1, 3]]
    }
  },
  {
    spangram: "CAMPING",
    words: ["CAMPING", "TRAIL", "STOVE", "TENT", "FIRE", "PACK", "HIKE", "MAP"],
    grid: ["TERFAC", "KRAIHM", "CPITIP", "ASELIK", "TOMNNE", "PAVETG"],
    paths: {
      CAMPING: [[0, 5], [0, 4], [1, 5], [2, 5], [3, 4], [4, 4], [5, 5]],
      TRAIL: [[0, 0], [1, 1], [1, 2], [2, 2], [3, 3]],
      STOVE: [[3, 1], [4, 0], [4, 1], [5, 2], [5, 3]],
      TENT: [[2, 3], [3, 2], [4, 3], [5, 4]],
      FIRE: [[0, 3], [1, 3], [0, 2], [0, 1]],
      PACK: [[2, 1], [3, 0], [2, 0], [1, 0]],
      HIKE: [[1, 4], [2, 4], [3, 5], [4, 5]],
      MAP: [[4, 2], [5, 1], [5, 0]]
    }
  }
];
