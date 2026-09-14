import { Puzzle } from './types';

export const PUZZLES: Puzzle[] = [
  {
    spangram: "HARBOR",
    words: ["HARBOR", "WHARF", "KAYAK", "DOCK", "BUOY", "SLIP", "TIDE", "PIER"],
    grid: [
      "AHYDOC",
      "WRIOUK",
      "FPLSRB",
      "EKAYPE",
      "DITKAI",
      "HARBOR"
    ],
    paths: {
      HARBOR: [[5, 0], [5, 1], [5, 2], [5, 3], [5, 4], [5, 5]],
      WHARF: [[1, 0], [0, 1], [0, 0], [1, 1], [2, 0]],
      KAYAK: [[3, 1], [3, 2], [3, 3], [4, 4], [4, 3]],
      DOCK: [[0, 3], [0, 4], [0, 5], [1, 5]],
      BUOY: [[2, 5], [1, 4], [1, 3], [0, 2]],
      SLIP: [[2, 3], [2, 2], [1, 2], [2, 1]],
      TIDE: [[4, 2], [4, 1], [4, 0], [3, 0]],
      PIER: [[3, 4], [4, 5], [3, 5], [2, 4]]
    }
  },
  {
    spangram: "GALAXY",
    words: ["GALAXY", "ORBIT", "COMET", "STAR", "MOON", "NOVA", "DUST", "MARS"],
    grid: [
      "OCARAM",
      "MNVSBR",
      "ETOTIO",
      "YXALAG",
      "STDMON",
      "RAUSTO"
    ],
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
    grid: [
      "TERFAC",
      "KRAIHM",
      "CPITIP",
      "ASELIK",
      "TOMNNE",
      "PAVETG"
    ],
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
  },
  {
    spangram: "DESSERTS",
    words: ["DESSERTS", "CUPCAKE", "PASTRY", "FUDGE", "DONUT", "CREPE"],
    grid: [
      "CCAKPY",
      "UPEEAR",
      "FUDGST",
      "DESSER",
      "DTCRET",
      "ONUEPS"
    ],
    paths: {
      DESSERTS: [[3, 0], [3, 1], [3, 2], [3, 3], [3, 4], [3, 5], [4, 5], [5, 5]],
      CUPCAKE: [[0, 0], [1, 0], [1, 1], [0, 1], [0, 2], [0, 3], [1, 2]],
      PASTRY: [[0, 4], [1, 4], [2, 4], [2, 5], [1, 5], [0, 5]],
      FUDGE: [[2, 0], [2, 1], [2, 2], [2, 3], [1, 3]],
      DONUT: [[4, 0], [5, 0], [5, 1], [5, 2], [4, 1]],
      CREPE: [[4, 2], [4, 3], [4, 4], [5, 4], [5, 3]]
    }
  },
  {
    spangram: "GARDENING",
    words: ["GARDENING", "FLOWER", "SHOVEL", "SHEARS", "WEEDS", "SOIL"],
    grid: [
      "FLGSHE",
      "WOASRA",
      "ERRWEE",
      "SLDESD",
      "HEINSO",
      "OVNGLI"
    ],
    paths: {
      GARDENING: [[0, 2], [1, 2], [2, 2], [3, 2], [3, 3], [4, 3], [4, 2], [5, 2], [5, 3]],
      FLOWER: [[0, 0], [0, 1], [1, 1], [1, 0], [2, 0], [2, 1]],
      SHOVEL: [[3, 0], [4, 0], [5, 0], [5, 1], [4, 1], [3, 1]],
      SHEARS: [[0, 3], [0, 4], [0, 5], [1, 5], [1, 4], [1, 3]],
      WEEDS: [[2, 3], [2, 4], [2, 5], [3, 5], [3, 4]],
      SOIL: [[4, 4], [4, 5], [5, 5], [5, 4]]
    }
  },
  {
    spangram: "WINTERTIME",
    words: ["WINTERTIME", "SLED", "BLIZZARD", "FROST", "ICE", "ICICLE"],
    grid: [
      "WSDBLI",
      "ILEAZZ",
      "NEFRDI",
      "TMRICE",
      "EIOCEL",
      "RTSTIC"
    ],
    paths: {
      WINTERTIME: [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [5, 1], [4, 1], [3, 1], [2, 1]],
      SLED: [[0, 1], [1, 1], [1, 2], [0, 2]],
      BLIZZARD: [[0, 3], [0, 4], [0, 5], [1, 5], [1, 4], [1, 3], [2, 3], [2, 4]],
      FROST: [[2, 2], [3, 2], [4, 2], [5, 2], [5, 3]],
      ICE: [[2, 5], [3, 4], [3, 5]],
      ICICLE: [[3, 3], [4, 3], [5, 4], [5, 5], [4, 5], [4, 4]]
    }
  },
  {
    spangram: "ORCHESTRA",
    words: ["ORCHESTRA", "VIOLIN", "CYMBAL", "CELLO", "BRASS", "FLUTE"],
    grid: [
      "VIOCYM",
      "NILLAB",
      "ORCHAR",
      "CELEST",
      "BOLSFL",
      "RASETU"
    ],
    paths: {
      ORCHESTRA: [[2, 0], [2, 1], [2, 2], [2, 3], [3, 3], [3, 4], [3, 5], [2, 5], [2, 4]],
      VIOLIN: [[0, 0], [0, 1], [0, 2], [1, 2], [1, 1], [1, 0]],
      CYMBAL: [[0, 3], [0, 4], [0, 5], [1, 5], [1, 4], [1, 3]],
      CELLO: [[3, 0], [3, 1], [3, 2], [4, 2], [4, 1]],
      BRASS: [[4, 0], [5, 0], [5, 1], [5, 2], [4, 3]],
      FLUTE: [[4, 4], [4, 5], [5, 5], [5, 4], [5, 3]]
    }
  },
  {
    spangram: "COOKWARE",
    words: ["COOKWARE", "OVEN", "FRIDGE", "WHISK", "STOVE", "TOAST", "PAN"],
    grid: [
      "OCFRID",
      "VOHWEG",
      "EOISKS",
      "NKEVOT",
      "EWTOAS",
      "RANAPT"
    ],
    paths: {
      COOKWARE: [[0, 1], [1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [5, 0], [4, 0]],
      OVEN: [[0, 0], [1, 0], [2, 0], [3, 0]],
      FRIDGE: [[0, 2], [0, 3], [0, 4], [0, 5], [1, 5], [1, 4]],
      WHISK: [[1, 3], [1, 2], [2, 2], [2, 3], [2, 4]],
      STOVE: [[2, 5], [3, 5], [3, 4], [3, 3], [3, 2]],
      TOAST: [[4, 2], [4, 3], [4, 4], [4, 5], [5, 5]],
      PAN: [[5, 4], [5, 3], [5, 2]]
    }
  }
];
