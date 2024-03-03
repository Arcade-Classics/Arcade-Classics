import e from "../assets/main";
import * as types from "../assets/types";

interface player {
  x: number;
  y: number;
  map: number;
  lives: number;
  level: number;
  score: number;
  fruit?: number;
  dir: "up" | "down" | "left" | "right";
  dirn?: "up" | "down" | "left" | "right";
  offset: {x: number; y: number};
}
interface turn {
  distance: number;
  dir: "up" | "down" | "left" | "right";
}
interface ghost {
  name: string;
  x: number;
  y: number;
  left: boolean;
  dir: "up" | "down" | "left" | "right";
  mode: "vulnerable" | "scatter" | "chase";
  spawn: {x: number; y: number};
  target: {x: number; y: number};
  offset: {x: number; y: number};
}
interface ghosts {
  killCombo: number;
  vulnerable: boolean;
  mode: "scatter" | "chase";
  data: ghost[];
  timers: {
    modeTimer: 0;
    vulnerable: {
      vulnerableTimer: number;
      levelTimers: number[];
    };
  };
}

const Pacman: types.game = {
  name: "Pacman",
  id: "pacman",
  info: "The ghosts of the dead have risen! Use <kbd>[UP]</kbd>, <kbd>[DOWN]</kbd>, <kbd>[LEFT]</kbd> and <kbd>[RIGHT]</kbd> to collect pellets. Collect them all to escape. Obtain a power pellet to fight back!",
  functions: {
    start: (): void => {
      e.games.current.data = {
        maps: [
          [
            [
              [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
              [1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
              [1, 3, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 3, 1],
              [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
              [1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1],
              [1, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 1],
              [1, 1, 1, 1, 2, 1, 1, 1, 0, 1, 0, 1, 1, 1, 2, 1, 1, 1, 1],
              [0, 0, 0, 1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1, 0, 0, 0],
              [1, 1, 1, 1, 2, 1, 0, 1, 1, 1, 1, 1, 0, 1, 2, 1, 1, 1, 1],
              [0, 0, 0, 0, 2, 0, 0, 1, 0, 0, 0, 1, 0, 0, 2, 0, 0, 0, 0],
              [1, 1, 1, 1, 2, 1, 0, 1, 1, 1, 1, 1, 0, 1, 2, 1, 1, 1, 1],
              [0, 0, 0, 1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1, 0, 0, 0],
              [1, 1, 1, 1, 2, 1, 0, 1, 1, 1, 1, 1, 0, 1, 2, 1, 1, 1, 1],
              [1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
              [1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1],
              [1, 3, 2, 1, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 1, 2, 3, 1],
              [1, 1, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 1, 1],
              [1, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 1],
              [1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1],
              [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
              [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            ],
            [
              [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
              [1, 5, 2, 2, 4, 2, 2, 2, 5, 1, 5, 2, 2, 2, 4, 2, 2, 5, 1],
              [1, 3, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 3, 1],
              [1, 4, 2, 2, 4, 2, 4, 2, 4, 2, 4, 2, 4, 2, 4, 2, 2, 4, 1],
              [1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1],
              [1, 5, 2, 2, 4, 1, 5, 2, 5, 1, 5, 2, 5, 1, 4, 2, 2, 5, 1],
              [1, 1, 1, 1, 2, 1, 1, 1, 0, 1, 0, 1, 1, 1, 2, 1, 1, 1, 1],
              [0, 0, 0, 1, 2, 1, 5, 0, 7, 7, 7, 0, 5, 1, 2, 1, 0, 0, 0],
              [1, 1, 1, 1, 2, 1, 0, 1, 1, 8, 1, 1, 0, 1, 2, 1, 1, 1, 1],
              [0, 0, 0, 0, 4, 0, 4, 1, 6, 6, 6, 1, 4, 0, 4, 0, 0, 0, 0],
              [1, 1, 1, 1, 2, 1, 0, 1, 1, 1, 1, 1, 0, 1, 2, 1, 1, 1, 1],
              [0, 0, 0, 1, 2, 1, 4, 0, 0, 0, 0, 0, 4, 1, 2, 1, 0, 0, 0],
              [1, 1, 1, 1, 2, 1, 0, 1, 1, 1, 1, 1, 0, 1, 2, 1, 1, 1, 1],
              [1, 5, 2, 2, 4, 2, 4, 2, 5, 1, 5, 2, 4, 2, 4, 2, 2, 5, 1],
              [1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1],
              [1, 5, 5, 1, 4, 2, 4, 2, 7, 0, 7, 2, 4, 2, 4, 1, 5, 5, 1],
              [1, 1, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 1, 1],
              [1, 5, 4, 2, 5, 1, 5, 2, 5, 1, 5, 2, 5, 1, 5, 2, 4, 5, 1],
              [1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1],
              [1, 5, 2, 2, 2, 2, 2, 2, 4, 2, 4, 2, 2, 2, 2, 2, 2, 5, 1],
              [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            ],
          ],
        ],
        player: {
          x: 9,
          y: 15,
          map: 0,
          lives: 5,
          level: 1,
          score: 0,
          dir: "up",
          offset: {x: 0, y: 0},
        },
        ghosts: {
          data: [
            {
              name: "clyde",
              x: 8,
              y: 9,
              left: false,
              dir: "up",
              mode: "scatter",
              spawn: {x: 8, y: 9},
              target: {x: 0, y: 0},
              offset: {x: 0, y: 0},
            },
            {
              name: "blinky",
              x: 9,
              y: 7,
              left: false,
              dir: "up",
              mode: "scatter",
              spawn: {x: 9, y: 7},
              target: {x: 0, y: 0},
              offset: {x: 0, y: 0},
            },
            {
              name: "pinky",
              x: 9,
              y: 9,
              left: false,
              dir: "up",
              mode: "scatter",
              spawn: {x: 9, y: 9},
              target: {x: 0, y: 0},
              offset: {x: 0, y: 0},
            },
            {
              name: "inky",
              x: 10,
              y: 9,
              left: false,
              dir: "up",
              mode: "scatter",
              spawn: {x: 10, y: 9},
              target: {x: 0, y: 0},
              offset: {x: 0, y: 0},
            },
          ],
          timers: {
            modeTimer: 0,
            vulnerable: {
              vulnerableTimer: 0,
              levelTimers: [4, 3, 2, 1, 0, 3, 0, 0, 0, 3, 0, 0, 0, 1, 0, 0, 0, 0, 0],
            },
          },
          killCombo: 200,
          vulnerable: false,
          mode: "scatter",
        },
      };
    },
    render: (frame: number): void => {
      if (!e.games.ctx) return;

      const player: player = e.games.current.data.player;
      const maps: number[][][][] = e.games.current.data.maps;
      const ghosts: ghosts = e.games.current.data.ghosts;
      const ctx: CanvasRenderingContext2D = e.games.ctx;

      maps[player.map][0].forEach((row: number[], y: number): void => {
        row.forEach((_col: number, x: number): void => {
          if (maps[player.map][0][y][x] === 1) {
            ctx.strokeStyle = "#2121de";
            ctx.lineWidth = 3;
            if (y !== 0 && y !== maps[player.map][0].length - 1) {
              if (maps[player.map][0][y + 1][x] === 1 && maps[player.map][0][y - 1][x] !== 1 && maps[player.map][0][y][x + 1] !== 1 && maps[player.map][0][y][x - 1] !== 1) {
                ctx.beginPath();
                ctx.moveTo(25 * x + 20, 25 * y + 25);
                ctx.lineTo(25 * x + 20, 25 * y + 12.5);
                ctx.arc(25 * x + 12.5, 25 * y + 12.5, 7.5, 0, Math.PI, true);
                ctx.lineTo(25 * x + 5, 25 * y + 25);
                ctx.stroke();
              } else if (maps[player.map][0][y + 1][x] !== 1 && maps[player.map][0][y - 1][x] === 1 && maps[player.map][0][y][x + 1] !== 1 && maps[player.map][0][y][x - 1] !== 1) {
                ctx.beginPath();
                ctx.moveTo(25 * x + 20, 25 * y);
                ctx.lineTo(25 * x + 20, 25 * y + 12.5);
                ctx.arc(25 * x + 12.5, 25 * y + 12.5, 7.5, 0, Math.PI, false);
                ctx.lineTo(25 * x + 5, 25 * y);
                ctx.stroke();
              } else if (maps[player.map][0][y + 1][x] !== 1 && maps[player.map][0][y - 1][x] !== 1 && maps[player.map][0][y][x + 1] === 1 && maps[player.map][0][y][x - 1] !== 1) {
                ctx.beginPath();
                ctx.moveTo(25 * x + 25, 25 * y + 20);
                ctx.lineTo(25 * x + 12.5, 25 * y + 20);
                ctx.arc(25 * x + 12.5, 25 * y + 12.5, 7.5, Math.PI / 2, Math.PI * 1.5, false);
                ctx.lineTo(25 * x + 25, 25 * y + 5);
                ctx.stroke();
              } else if (maps[player.map][0][y + 1][x] !== 1 && maps[player.map][0][y - 1][x] !== 1 && maps[player.map][0][y][x + 1] !== 1 && maps[player.map][0][y][x - 1] === 1) {
                ctx.beginPath();
                ctx.moveTo(25 * x, 25 * y + 20);
                ctx.lineTo(25 * x + 12.5, 25 * y + 20);
                ctx.arc(25 * x + 12.5, 25 * y + 12.5, 7.5, Math.PI / 2, Math.PI * 1.5, true);
                ctx.lineTo(25 * x, 25 * y + 5);
                ctx.stroke();
              } else if (maps[player.map][0][y + 1][x] === 1 && maps[player.map][0][y - 1][x] === 1 && maps[player.map][0][y][x + 1] !== 1 && maps[player.map][0][y][x - 1] !== 1) {
                ctx.beginPath();
                ctx.moveTo(25 * x + 5, 25 * y);
                ctx.lineTo(25 * x + 5, 25 * y + 25);
                ctx.moveTo(25 * x + 20, 25 * y);
                ctx.lineTo(25 * x + 20, 25 * y + 25);
                ctx.stroke();
              } else if (maps[player.map][0][y + 1][x] === 1 && maps[player.map][0][y - 1][x] !== 1 && maps[player.map][0][y][x + 1] === 1 && maps[player.map][0][y][x - 1] !== 1) {
                ctx.beginPath();
                ctx.arc(25 * x + 25, 25 * y + 25, 5, Math.PI * 1.5, Math.PI, true);
                ctx.moveTo(25 * x + 25, 25 * y + 5);
                ctx.lineTo(25 * x + 12.5, 25 * y + 5);
                ctx.arc(25 * x + 12.5, 25 * y + 12.5, 7.5, Math.PI * 1.5, Math.PI, true);
                ctx.lineTo(25 * x + 5, 25 * y + 25);
                ctx.stroke();
              } else if (maps[player.map][0][y + 1][x] === 1 && maps[player.map][0][y - 1][x] !== 1 && maps[player.map][0][y][x + 1] !== 1 && maps[player.map][0][y][x - 1] === 1) {
                ctx.beginPath();
                ctx.arc(25 * x, 25 * y + 25, 5, 0, Math.PI * 1.5, true);
                ctx.moveTo(25 * x, 25 * y + 5);
                ctx.lineTo(25 * x + 12.5, 25 * y + 5);
                ctx.arc(25 * x + 12.5, 25 * y + 12.5, 7.5, Math.PI * 1.5, 0, false);
                ctx.lineTo(25 * x + 20, 25 * y + 25);
                ctx.stroke();
              } else if (maps[player.map][0][y + 1][x] !== 1 && maps[player.map][0][y - 1][x] === 1 && maps[player.map][0][y][x + 1] === 1 && maps[player.map][0][y][x - 1] !== 1) {
                ctx.beginPath();
                ctx.arc(25 * x + 25, 25 * y, 5, Math.PI / 2, Math.PI, false);
                ctx.moveTo(25 * x + 5, 25 * y);
                ctx.lineTo(25 * x + 5, 25 * y + 12.5);
                ctx.arc(25 * x + 12.5, 25 * y + 12.5, 7.5, Math.PI, Math.PI / 2, true);
                ctx.lineTo(25 * x + 25, 25 * y + 20);
                ctx.stroke();
              } else if (maps[player.map][0][y + 1][x] !== 1 && maps[player.map][0][y - 1][x] === 1 && maps[player.map][0][y][x + 1] !== 1 && maps[player.map][0][y][x - 1] === 1) {
                ctx.beginPath();
                ctx.arc(25 * x, 25 * y, 5, 0, Math.PI / 2, false);
                ctx.moveTo(25 * x + 20, 25 * y);
                ctx.lineTo(25 * x + 20, 25 * y + 12.5);
                ctx.arc(25 * x + 12.5, 25 * y + 12.5, 7.5, 0, Math.PI / 2, false);
                ctx.lineTo(25 * x, 25 * y + 20);
                ctx.stroke();
              } else if (maps[player.map][0][y + 1][x] !== 1 && maps[player.map][0][y - 1][x] !== 1 && maps[player.map][0][y][x + 1] === 1 && maps[player.map][0][y][x - 1] === 1) {
                ctx.beginPath();
                ctx.moveTo(25 * x, 25 * y + 5);
                ctx.lineTo(25 * x + 25, 25 * y + 5);
                ctx.moveTo(25 * x, 25 * y + 20);
                ctx.lineTo(25 * x + 25, 25 * y + 20);
                ctx.stroke();
              } else if (maps[player.map][0][y + 1][x] !== 1 && maps[player.map][0][y - 1][x] === 1 && maps[player.map][0][y][x + 1] === 1 && maps[player.map][0][y][x - 1] === 1) {
                ctx.beginPath();
                ctx.arc(25 * x, 25 * y, 5, 0, Math.PI / 2, false);
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(25 * x + 25, 25 * y, 5, Math.PI, Math.PI / 2, true);
                ctx.moveTo(25 * x, 25 * y + 20);
                ctx.lineTo(25 * x + 25, 25 * y + 20);
                ctx.stroke();
              } else if (maps[player.map][0][y + 1][x] === 1 && maps[player.map][0][y - 1][x] !== 1 && maps[player.map][0][y][x + 1] === 1 && maps[player.map][0][y][x - 1] === 1) {
                ctx.beginPath();
                ctx.arc(25 * x, 25 * y + 25, 5, Math.PI * 1.5, 0, false);
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(25 * x + 25, 25 * y + 25, 5, Math.PI, Math.PI * 1.5, false);
                ctx.moveTo(25 * x, 25 * y + 5);
                ctx.lineTo(25 * x + 25, 25 * y + 5);
                ctx.stroke();
              } else if (maps[player.map][0][y + 1][x] === 1 && maps[player.map][0][y - 1][x] === 1 && maps[player.map][0][y][x + 1] !== 1 && maps[player.map][0][y][x - 1] === 1) {
                ctx.beginPath();
                ctx.arc(25 * x, 25 * y + 25, 5, Math.PI * 1.5, 0, false);
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(25 * x, 25 * y, 5, 0, Math.PI / 2, false);
                ctx.moveTo(25 * x + 20, 25 * y);
                ctx.lineTo(25 * x + 20, 25 * y + 25);
                ctx.stroke();
              } else if (maps[player.map][0][y + 1][x] === 1 && maps[player.map][0][y - 1][x] === 1 && maps[player.map][0][y][x + 1] === 1 && maps[player.map][0][y][x - 1] !== 1) {
                ctx.beginPath();
                ctx.arc(25 * x + 25, 25 * y + 25, 5, Math.PI, Math.PI * 1.5, false);
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(25 * x + 25, 25 * y, 5, Math.PI, Math.PI / 2, true);
                ctx.moveTo(25 * x + 5, 25 * y);
                ctx.lineTo(25 * x + 5, 25 * y + 25);
                ctx.stroke();
              } else if (maps[player.map][0][y + 1][x] === 1 && maps[player.map][0][y - 1][x] === 1 && maps[player.map][0][y][x + 1] === 1 && maps[player.map][0][y][x - 1] === 1) {
                ctx.beginPath();
                ctx.arc(25 * x + 25, 25 * y + 25, 5, Math.PI, Math.PI * 1.5, false);
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(25 * x + 25, 25 * y, 5, Math.PI, Math.PI / 2, true);
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(25 * x, 25 * y + 25, 5, Math.PI * 1.5, Math.PI / 2, false);
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(25 * x, 25 * y, 5, Math.PI / 2, 0, true);
                ctx.stroke();
              } else if (maps[player.map][0][y + 1][x] !== 1 && maps[player.map][0][y - 1][x] !== 1 && maps[player.map][0][y][x + 1] !== 1 && maps[player.map][0][y][x - 1] !== 1) {
                ctx.beginPath();
                ctx.arc(25 * x + 12.5, 25 * y + 12.5, 7.5, 0, Math.PI * 2, true);
                ctx.stroke();
              }
            } else if (y === 0) {
              if (maps[player.map][0][y + 1][x] === 1 && maps[player.map][0][y][x + 1] === 1 && maps[player.map][0][y][x - 1] !== 1) {
                ctx.beginPath();
                ctx.arc(25 * x + 25, 25 * y + 25, 5, Math.PI, Math.PI * 1.5, false);
                ctx.moveTo(25 * x + 25, 25 * y + 5);
                ctx.lineTo(25 * x + 12.5, 25 * y + 5);
                ctx.arc(25 * x + 12.5, 25 * y + 12.5, 7.5, Math.PI * 1.5, Math.PI, true);
                ctx.lineTo(25 * x + 5, 25 * y + 25);
                ctx.stroke();
              } else if (maps[player.map][0][y + 1][x] === 1 && maps[player.map][0][y][x + 1] !== 1 && maps[player.map][0][y][x - 1] === 1) {
                ctx.beginPath();
                ctx.arc(25 * x, 25 * y + 25, 5, 0, Math.PI * 1.5, true);
                ctx.moveTo(25 * x, 25 * y + 5);
                ctx.lineTo(25 * x + 12.5, 25 * y + 5);
                ctx.arc(25 * x + 12.5, 25 * y + 12.5, 7.5, Math.PI * 1.5, 0, false);
                ctx.lineTo(25 * x + 20, 25 * y + 25);
                ctx.stroke();
              } else if (maps[player.map][0][y + 1][x] !== 1 && maps[player.map][0][y][x + 1] === 1 && maps[player.map][0][y][x - 1] === 1) {
                ctx.beginPath();
                ctx.moveTo(25 * x, 25 * y + 5);
                ctx.lineTo(25 * x + 25, 25 * y + 5);
                ctx.moveTo(25 * x, 25 * y + 20);
                ctx.lineTo(25 * x + 25, 25 * y + 20);
                ctx.stroke();
              } else if (maps[player.map][0][y + 1][x] === 1 && maps[player.map][0][y][x + 1] === 1 && maps[player.map][0][y][x - 1] === 1) {
                ctx.beginPath();
                ctx.arc(25 * x, 25 * y + 25, 5, Math.PI * 1.5, 0, false);
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(25 * x + 25, 25 * y + 25, 5, Math.PI, Math.PI * 1.5, false);
                ctx.moveTo(25 * x, 25 * y + 5);
                ctx.lineTo(25 * x + 25, 25 * y + 5);
                ctx.stroke();
              }
            } else {
              if (maps[player.map][0][y - 1][x] === 1 && maps[player.map][0][y][x + 1] === 1 && maps[player.map][0][y][x - 1] !== 1) {
                ctx.beginPath();
                ctx.arc(25 * x + 25, 25 * y, 5, Math.PI, Math.PI / 2, true);
                ctx.moveTo(25 * x + 5, 25 * y);
                ctx.lineTo(25 * x + 5, 25 * y + 12.5);
                ctx.arc(25 * x + 12.5, 25 * y + 12.5, 7.5, Math.PI, Math.PI / 2, true);
                ctx.lineTo(25 * x + 25, 25 * y + 20);
                ctx.stroke();
              } else if (maps[player.map][0][y - 1][x] === 1 && maps[player.map][0][y][x + 1] !== 1 && maps[player.map][0][y][x - 1] === 1) {
                ctx.beginPath();
                ctx.arc(25 * x, 25 * y, 5, 0, Math.PI / 2, false);
                ctx.moveTo(25 * x + 20, 25 * y);
                ctx.lineTo(25 * x + 20, 25 * y + 12.5);
                ctx.arc(25 * x + 12.5, 25 * y + 12.5, 7.5, 0, Math.PI / 2, false);
                ctx.lineTo(25 * x, 25 * y + 20);
                ctx.stroke();
              } else if (maps[player.map][0][y - 1][x] !== 1 && maps[player.map][0][y][x + 1] === 1 && maps[player.map][0][y][x - 1] === 1) {
                ctx.beginPath();
                ctx.moveTo(25 * x, 25 * y + 5);
                ctx.lineTo(25 * x + 25, 25 * y + 5);
                ctx.moveTo(25 * x, 25 * y + 20);
                ctx.lineTo(25 * x + 25, 25 * y + 20);
                ctx.stroke();
              } else if (maps[player.map][0][y - 1][x] === 1 && maps[player.map][0][y][x + 1] === 1 && maps[player.map][0][y][x - 1] === 1) {
                ctx.beginPath();
                ctx.arc(25 * x, 25 * y, 5, 0, Math.PI / 2, false);
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(25 * x + 25, 25 * y, 5, Math.PI, Math.PI / 2, true);
                ctx.moveTo(25 * x, 25 * y + 20);
                ctx.lineTo(25 * x + 25, 25 * y + 20);
                ctx.stroke();
              }
            }
          } else if (maps[player.map][0][y][x] === 2) {
            ctx.beginPath();
            ctx.arc(25 * x + 13, 25 * y + 13, 2, 0, Math.PI * 2, false);
            ctx.fillStyle = e.storage.get("dark-mode") ? "#ffffff" : "#000000";
            ctx.fill();
            ctx.closePath();
          } else if (maps[player.map][0][y][x] === 3) {
            ctx.beginPath();
            ctx.arc(25 * x + 13, 25 * y + 13, 7, 0, Math.PI * 2, false);
            ctx.fillStyle = e.storage.get("dark-mode") ? "#ffffff" : "#000000";
            ctx.fill();
            ctx.closePath();
          }
        });
      });

      ctx.fillStyle = "#808080";
      ctx.fillRect(225, 204, 25, 17);

      if (player.fruit) {
        const texture: number[][] = [
          [
            [0, 0, 0, 0, 0, 0, 2, 2],
            [0, 0, 0, 0, 0, 2, 2, 0],
            [0, 0, 0, 0, 2, 2, 0, 0],
            [0, 0, 0, 2, 0, 2, 0, 0],
            [0, 1, 1, 0, 0, 2, 0, 0],
            [1, 1, 1, 1, 0, 1, 1, 0],
            [1, 1, 1, 1, 1, 1, 1, 1],
            [0, 1, 1, 0, 1, 1, 1, 1],
            [0, 0, 0, 0, 0, 1, 1, 0],
          ],
          [
            [0, 0, 0, 0, 2, 0, 0, 0, 0],
            [0, 0, 2, 2, 2, 2, 2, 0, 0],
            [0, 2, 2, 2, 2, 2, 2, 2, 0],
            [1, 1, 2, 1, 2, 1, 2, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 5, 1, 5, 1, 5, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1],
            [0, 1, 1, 5, 1, 5, 1, 1, 0],
            [0, 0, 1, 1, 1, 1, 1, 0, 0],
            [0, 0, 0, 1, 1, 1, 0, 0, 0],
          ],
          [
            [0, 0, 0, 0, 0, 2, 2, 0, 0],
            [0, 0, 0, 0, 2, 2, 0, 0, 0],
            [0, 0, 4, 4, 4, 4, 4, 0, 0],
            [0, 4, 4, 4, 4, 4, 4, 4, 0],
            [4, 4, 4, 4, 4, 4, 4, 4, 4],
            [4, 4, 4, 4, 4, 4, 4, 4, 4],
            [4, 4, 4, 4, 4, 4, 4, 4, 4],
            [4, 4, 4, 4, 4, 4, 4, 4, 4],
            [0, 4, 4, 4, 4, 4, 4, 4, 0],
            [0, 0, 4, 4, 4, 4, 4, 0, 0],
          ],
          [
            [0, 0, 0, 0, 0, 2, 2, 0, 0],
            [0, 0, 0, 0, 2, 2, 0, 0, 0],
            [0, 1, 1, 1, 1, 1, 1, 1, 0],
            [1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1],
            [0, 1, 1, 1, 1, 1, 1, 1, 0],
            [0, 0, 1, 1, 0, 1, 1, 0, 0],
          ],
          [
            [0, 0, 0, 0, 2, 2, 0, 0],
            [0, 0, 0, 2, 2, 0, 0, 0],
            [0, 0, 0, 3, 3, 0, 0, 0],
            [0, 0, 3, 3, 3, 3, 0, 0],
            [0, 0, 3, 3, 3, 3, 0, 0],
            [0, 3, 3, 3, 3, 3, 3, 0],
            [3, 3, 3, 3, 3, 3, 3, 3],
            [3, 3, 3, 3, 3, 3, 3, 3],
            [0, 3, 3, 3, 3, 3, 3, 0],
            [0, 0, 3, 3, 3, 3, 0, 0],
          ],
        ][player.fruit - 1];

        texture.forEach((row: number[], y: number): void => {
          row.forEach((block: number, x: number): void => {
            if (block === 1) ctx.fillStyle = "#ff0000";
            else if (block === 2) ctx.fillStyle = "#37b34a";
            else if (block === 3) ctx.fillStyle = "#8bc53f";
            else if (block === 4) ctx.fillStyle = "#f6921e";
            else if (block === 5) ctx.fillStyle = "#000000";
            else return;

            ctx.fillRect(225 + x * 2 + (player.fruit === 1 || player.fruit === 5 ? 5 : 4), 375 + y * 2 + (player.fruit === 1 ? 4 : 3), 2, 2);
          });
        });
      }

      const playerTexture: number[][] = [
        [
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
          [0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0],
          [0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0],
          [0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0],
          [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1],
          [1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1],
          [1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1],
          [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1],
          [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1],
          [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
          [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
          [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
          [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
          [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
          [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
          [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
        ],
        [
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
          [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
          [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
          [1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
          [1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
          [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1],
          [1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1],
          [0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0],
          [0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
          [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
          [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
          [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
        ],
        [
          [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
          [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
          [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
          [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
          [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
          [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
          [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
          [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
          [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
          [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
          [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
          [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
          [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
          [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
          [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
          [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
          [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
        ],
      ][frame % 30 > 15 ? 0 : 1];

      playerTexture.forEach((row: number[], y: number): void => {
        row.forEach((block: number, x: number): void => {
          if (block !== 1) return;

          ctx.fillStyle = "#ffff00";
          switch (player.dir) {
            case "up":
              ctx.fillRect(player.x * 25 + x + 3 + Math.round(player.offset.x), player.y * 25 + y + 3 + Math.round(player.offset.y), 1, 1);
              break;
            case "down":
              ctx.fillRect(player.x * 25 - x + 21 + Math.round(player.offset.x), player.y * 25 - y + 21 + Math.round(player.offset.y), 1, 1);
              break;
            case "left":
              ctx.fillRect(player.x * 25 + y + 3 + Math.round(player.offset.x), player.y * 25 + x + 3 + Math.round(player.offset.y), 1, 1);
              break;
            case "right":
              ctx.fillRect(player.x * 25 - y + 21 + Math.round(player.offset.x), player.y * 25 - x + 21 + Math.round(player.offset.y), 1, 1);
              break;
          }
        });
      });

      ghosts.data.forEach((ghost: ghost): void => {
        const texture: number[][][] = [
          [
            [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
            [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
            [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
            [0, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 0],
            [0, 1, 3, 3, 3, 1, 1, 1, 1, 1, 1, 3, 3, 3, 1, 1, 1, 1, 0],
            [0, 2, 2, 3, 3, 3, 1, 1, 1, 1, 2, 2, 3, 3, 3, 1, 1, 1, 0],
            [2, 2, 2, 2, 3, 3, 1, 1, 1, 2, 2, 2, 2, 3, 3, 1, 1, 1, 1],
            [2, 2, 2, 2, 3, 3, 1, 1, 1, 2, 2, 2, 2, 3, 3, 1, 1, 1, 1],
            [1, 2, 2, 3, 3, 3, 1, 1, 1, 1, 2, 2, 3, 3, 3, 1, 1, 1, 1],
            [1, 1, 3, 3, 3, 1, 1, 1, 1, 1, 1, 3, 3, 3, 1, 1, 1, 1, 1],
            [1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1],
            [1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1],
            [0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0],
          ],
          [
            [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
            [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
            [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
            [0, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 0],
            [0, 1, 1, 2, 2, 2, 2, 1, 1, 1, 1, 1, 2, 2, 2, 2, 1, 1, 0],
            [0, 1, 3, 2, 2, 2, 2, 3, 1, 1, 1, 3, 2, 2, 2, 2, 3, 1, 0],
            [1, 1, 3, 3, 2, 2, 3, 3, 1, 1, 1, 3, 3, 2, 2, 3, 3, 1, 1],
            [1, 1, 3, 3, 3, 3, 3, 3, 1, 1, 1, 3, 3, 3, 3, 3, 3, 1, 1],
            [1, 1, 1, 3, 3, 3, 3, 1, 1, 1, 1, 1, 3, 3, 3, 3, 1, 1, 1],
            [1, 1, 1, 1, 3, 3, 1, 1, 1, 1, 1, 1, 1, 3, 3, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1],
            [1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1],
            [0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0],
          ],
          [
            [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
            [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
            [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
            [0, 1, 1, 1, 3, 3, 1, 1, 1, 1, 1, 1, 1, 3, 3, 1, 1, 1, 0],
            [0, 1, 1, 3, 3, 3, 3, 1, 1, 1, 1, 1, 3, 3, 3, 3, 1, 1, 0],
            [0, 1, 3, 3, 3, 3, 3, 3, 1, 1, 1, 3, 3, 3, 3, 3, 3, 1, 0],
            [1, 1, 3, 3, 2, 2, 3, 3, 1, 1, 1, 3, 3, 2, 2, 3, 3, 1, 1],
            [1, 1, 3, 2, 2, 2, 2, 3, 1, 1, 1, 3, 2, 2, 2, 2, 3, 1, 1],
            [1, 1, 1, 2, 2, 2, 2, 1, 1, 1, 1, 1, 2, 2, 2, 2, 1, 1, 1],
            [1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1],
            [1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1],
            [0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0],
          ],
          [
            [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
            [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
            [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
            [0, 1, 1, 1, 1, 4, 4, 4, 1, 1, 1, 4, 4, 4, 1, 1, 1, 1, 0],
            [0, 1, 1, 1, 1, 4, 4, 4, 1, 1, 1, 4, 4, 4, 1, 1, 1, 1, 0],
            [1, 1, 1, 1, 1, 4, 4, 4, 1, 1, 1, 4, 4, 4, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 4, 4, 1, 1, 4, 4, 4, 1, 1, 4, 4, 1, 1, 1, 1],
            [1, 1, 1, 1, 4, 4, 1, 1, 4, 4, 4, 1, 1, 4, 4, 1, 1, 1, 1],
            [1, 1, 1, 4, 1, 1, 4, 4, 1, 1, 1, 4, 4, 1, 1, 4, 1, 1, 1],
            [1, 1, 1, 4, 1, 1, 4, 4, 1, 1, 1, 4, 4, 1, 1, 4, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1],
            [1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1],
            [0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0],
          ],
        ];
        let mode: number = 0;

        if (ghost.mode !== "vulnerable") {
          switch (ghost.dir) {
            case "left":
            case "right":
              mode = 0;
              break;
            case "up":
              mode = 1;
              break;
            case "down":
              mode = 2;
              break;
          }
        } else mode = 3;

        texture[mode].forEach((row: number[], y: number): void => {
          row.forEach((block: number, x: number): void => {
            if (block === 1) {
              if (ghost.mode === "vulnerable") ctx.fillStyle = frame % 30 < 15 ? "#0000ff" : "#ffffff";
              else if (ghost.name === "blinky") ctx.fillStyle = "#ff0000";
              else if (ghost.name === "pinky") ctx.fillStyle = "#ff00ff";
              else if (ghost.name === "inky") ctx.fillStyle = "#00ffff";
              else if (ghost.name === "clyde") ctx.fillStyle = "#ffff00";
            } else if (block === 2) ctx.fillStyle = "#0000ff";
            else if (block === 3) ctx.fillStyle = "#ffffff";
            else if (block === 4) ctx.fillStyle = frame % 30 < 15 ? "#fab9b0" : "#ff0000";
            else return;

            if (ghost.dir === "right") ctx.fillRect(25 * ghost.x - x + Math.round(ghost.offset.x) + 21, 25 * ghost.y + y + Math.round(ghost.offset.y) + 3, 1, 1);
            else ctx.fillRect(25 * ghost.x + x + Math.round(ghost.offset.x) + 3, 25 * ghost.y + y + Math.round(ghost.offset.y) + 3, 1, 1);
          });
        });
      });
    },
    update: (_time: number, delta: number): void => {
      delta *= 1.4;

      const calcDistance: (x1: number, y1: number, x2: number, y2: number) => number = (x1: number, y1: number, x2: number, y2: number): number =>
        Math.sqrt(Math.pow(y2 - y1, 2) + Math.pow(x2 - x1, 2));
      const moveGhost: (ghost: ghost) => void = (ghost: ghost): void => {
        switch (ghost.dir) {
          case "up":
            if (maps[player.map][1][ghost.y - 1][ghost.x] !== 1) {
              ghost.offset.x = 0;
              if (ghost.mode !== "vulnerable") ghost.offset.y -= delta;
              else ghost.offset.y -= delta / 2;
              if (ghost.offset.y <= -12) {
                ghost.offset.y = 13;
                ghost.y--;
              }
            } else {
              if (Math.round(ghost.offset.y) !== 0) {
                if (Math.round(ghost.offset.y) > 0) {
                  if (ghost.mode !== "vulnerable") ghost.offset.y -= delta;
                  else ghost.offset.y -= delta / 2;
                } else {
                  if (ghost.mode !== "vulnerable") ghost.offset.y += delta;
                  else ghost.offset.y += delta / 2;
                }
              }
            }
            break;
          case "down":
            if (maps[player.map][1][ghost.y + 1][ghost.x] !== 1) {
              ghost.offset.x = 0;
              if (ghost.mode !== "vulnerable") ghost.offset.y += delta;
              else ghost.offset.y += delta / 2;
              if (ghost.offset.y >= 12) {
                ghost.offset.y = -13;
                ghost.y++;
              }
            } else {
              if (Math.round(ghost.offset.y) !== 0) {
                if (Math.round(ghost.offset.y) > 0) {
                  if (ghost.mode !== "vulnerable") ghost.offset.y -= delta;
                  else ghost.offset.y -= delta / 2;
                } else {
                  if (ghost.mode !== "vulnerable") ghost.offset.y += delta;
                  else ghost.offset.y += delta / 2;
                }
              }
            }
            break;
          case "left":
            if (maps[player.map][1][ghost.y][ghost.x - 1] !== 1) {
              ghost.offset.y = 0;
              if (ghost.mode !== "vulnerable") ghost.offset.x -= delta;
              else ghost.offset.x -= delta / 2;
              if (ghost.offset.x <= -12) {
                ghost.offset.x = 13;
                ghost.x--;
              }
            } else {
              if (Math.round(ghost.offset.x) !== 0) {
                if (Math.round(ghost.offset.x) > 0) {
                  if (ghost.mode !== "vulnerable") ghost.offset.x -= delta;
                  else ghost.offset.x -= delta / 2;
                } else {
                  if (ghost.mode !== "vulnerable") ghost.offset.x += delta;
                  else ghost.offset.x += delta / 2;
                }
              }
            }
            break;
          case "right":
            if (maps[player.map][1][ghost.y][ghost.x + 1] !== 1) {
              ghost.offset.y = 0;
              if (ghost.mode !== "vulnerable") ghost.offset.x += delta;
              else ghost.offset.x += delta / 2;
              if (ghost.offset.x >= 12) {
                ghost.offset.x = -13;
                ghost.x++;
              }
            } else {
              if (Math.round(ghost.offset.x) !== 0) {
                if (Math.round(ghost.offset.x) > 0) {
                  if (ghost.mode !== "vulnerable") ghost.offset.x -= delta;
                  else ghost.offset.x -= delta / 2;
                } else {
                  if (ghost.mode !== "vulnerable") ghost.offset.x += delta;
                  else ghost.offset.x += delta / 2;
                }
              }
            }
            break;
        }
        if (ghost.y === 9 && ghost.x <= -1 && Math.floor(ghost.offset.x) === 0) ghost.x = 19;
        else if (ghost.y === 9 && ghost.x >= 19 && Math.floor(ghost.offset.x) === 0) ghost.x = -1;
      };
      const killGhost: (ghost: ghost) => void = (ghost: ghost): void => {
        player.score += ghosts.killCombo;
        ghosts.killCombo *= 2;

        ghost.target = {x: 0, y: 0};
        ghost.x = ghost.spawn.x;
        ghost.y = ghost.spawn.y;
        ghost.left = false;
        reset(ghost);

        e.games.sfx("pacman/eatGhost");
        if (player.score % 10000 === 0) {
          player.lives++;
          e.games.sfx("pacman/extraLife");
        }
        if (player.score >= 10000) e.achievements.set("pacman-10000");
        if (ghosts.killCombo >= 1600) e.achievements.set("pacman-4-combo");
      };
      const reset: (ghost: ghost) => void = (ghost: ghost): void => {
        ghost.offset = {x: 0, y: 0};
        ghost.mode = ghosts.mode;
        ghost.left = false;
        ghost.dir = "up";
      };

      const player: player = e.games.current.data.player;
      const maps: number[][][][] = e.games.current.data.maps;
      const ghosts: ghosts = e.games.current.data.ghosts;

      if (e.games.keys.Up) player.dirn = "up";
      else if (e.games.keys.Down) player.dirn = "down";
      else if (e.games.keys.Left) player.dirn = "left";
      else if (e.games.keys.Right) player.dirn = "right";

      switch (player.dir) {
        case "up":
          if (maps[player.map][0][player.y - 1][player.x] !== 1) {
            player.offset.x = 0;
            player.offset.y -= delta;
            if (player.offset.y <= -12) {
              player.offset.y = 13;
              player.y--;
            }
          } else {
            if (Math.round(player.offset.y) !== 0) {
              if (player.offset.y > 0) player.offset.y -= delta;
              else player.offset.y += delta;
            }
          }
          break;
        case "down":
          if (maps[player.map][0][player.y + 1][player.x] !== 1) {
            player.offset.x = 0;
            player.offset.y += delta;
            if (player.offset.y >= 12) {
              player.offset.y = -13;
              player.y++;
            }
          } else {
            if (Math.round(player.offset.y) !== 0) {
              if (player.offset.y > 0) player.offset.y -= delta;
              else player.offset.y += delta;
            }
          }
          break;
        case "left":
          if (maps[player.map][0][player.y][player.x - 1] !== 1) {
            player.offset.y = 0;
            player.offset.x -= delta;
            if (player.offset.x <= -12) {
              player.offset.x = 13;
              player.x--;
            }
          } else {
            if (Math.round(player.offset.x) !== 0) {
              if (player.offset.x > 0) player.offset.x -= delta;
              else player.offset.x += delta;
            }
          }
          break;
        case "right":
          if (maps[player.map][0][player.y][player.x + 1] !== 1) {
            player.offset.y = 0;
            player.offset.x += delta;
            if (player.offset.x >= 12) {
              player.offset.x = -13;
              player.x++;
            }
          } else {
            if (Math.round(player.offset.x) !== 0) {
              if (player.offset.x > 0) player.offset.x -= delta;
              else player.offset.x += delta;
            }
          }
          break;
      }

      switch (player.dirn) {
        case "up":
          if (maps[player.map][0][player.y - 1][player.x] !== 1 && Math.round(player.offset.x) === 0) {
            player.dir = "up";
            delete player.dirn;
          }
          break;
        case "down":
          if (maps[player.map][0][player.y + 1][player.x] !== 1 && Math.round(player.offset.x) === 0) {
            player.dir = "down";
            delete player.dirn;
          }
          break;
        case "left":
          if (maps[player.map][0][player.y][player.x - 1] !== 1 && Math.round(player.offset.y) === 0) {
            player.dir = "left";
            delete player.dirn;
          }
          break;
        case "right":
          if (maps[player.map][0][player.y][player.x + 1] !== 1 && Math.round(player.offset.y) === 0) {
            player.dir = "right";
            delete player.dirn;
          }
          break;
      }

      if (player.y === 15 && player.x === 9 && player.fruit) {
        player.score += player.fruit * 100;
        delete player.fruit;
        e.games.sfx("pacman/eatFruit");
      }

      if (player.y === 9 && player.x === -1) {
        player.x = 19;
        e.achievements.set("pacman-portal");
      } else if (player.y === 9 && player.x === 19) {
        player.x = -1;
        e.achievements.set("pacman-portal");
      }
      if (player.x < -1) player.x = 19;
      if (player.x > 19) player.x = -1;
      if (player.x <= -1 && (player.y > 9 || player.y < 9)) {
        player.x = 19;
        player.y = 9;
        player.dir = "left";
      }
      if (player.x >= 19 && (player.y > 9 || player.y < 9)) {
        player.x = -1;
        player.y = 9;
        player.dir = "right";
      }

      if (maps[player.map][0][player.y][player.x] === 2) {
        maps[player.map][0][player.y][player.x] = 4;
        player.score += 10;

        if (player.score % 10000 === 0) {
          player.lives++;
          e.games.sfx("pacman/extraLife");
        }
        if (Math.floor(Math.random() * 75) === 0 && !player.fruit) player.fruit = 1 + Math.floor(Math.random() * 5);
        if (player.score >= 10000) e.achievements.set("pacman-10000");
      } else if (maps[player.map][0][player.y][player.x] === 3) {
        maps[player.map][0][player.y][player.x] = 5;
        ghosts.data.forEach((ghost: ghost): string => (ghost.mode = "vulnerable"));
        ghosts.vulnerable = true;
        player.score += 50;

        if (player.score % 10000 === 0) {
          player.lives++;
          e.games.sfx("pacman/extraLife");
        }
        if (player.score >= 10000) e.achievements.set("pacman-10000");
      }

      if (player.level === 1) {
        if (ghosts.timers.modeTimer >= 5240) ghosts.mode = "chase";
        else if (ghosts.timers.modeTimer >= 4940) ghosts.mode = "scatter";
        else if (ghosts.timers.modeTimer >= 3740) ghosts.mode = "chase";
        else if (ghosts.timers.modeTimer >= 3440) ghosts.mode = "scatter";
        else if (ghosts.timers.modeTimer >= 2240) ghosts.mode = "chase";
        else if (ghosts.timers.modeTimer >= 1620) ghosts.mode = "scatter";
        else if (ghosts.timers.modeTimer >= 420) ghosts.mode = "chase";
        else ghosts.mode = "scatter";
      } else if (player.level > 1 && player.level < 5) {
        if (ghosts.timers.modeTimer >= 64521) ghosts.mode = "chase";
        else if (ghosts.timers.modeTimer >= 64520) ghosts.mode = "scatter";
        else if (ghosts.timers.modeTimer >= 2540) ghosts.mode = "chase";
        else if (ghosts.timers.modeTimer >= 2240) ghosts.mode = "scatter";
        else if (ghosts.timers.modeTimer >= 1040) ghosts.mode = "chase";
        else if (ghosts.timers.modeTimer >= 1620) ghosts.mode = "scatter";
        else if (ghosts.timers.modeTimer >= 420) ghosts.mode = "chase";
        else ghosts.mode = "scatter";
      } else {
        if (ghosts.timers.modeTimer >= 65521) ghosts.mode = "chase";
        else if (ghosts.timers.modeTimer >= 65520) ghosts.mode = "scatter";
        else if (ghosts.timers.modeTimer >= 3300) ghosts.mode = "chase";
        else if (ghosts.timers.modeTimer >= 3000) ghosts.mode = "scatter";
        else if (ghosts.timers.modeTimer >= 1800) ghosts.mode = "chase";
        else if (ghosts.timers.modeTimer >= 1500) ghosts.mode = "scatter";
        else if (ghosts.timers.modeTimer >= 300) ghosts.mode = "chase";
        else ghosts.mode = "scatter";
      }

      if (ghosts.vulnerable) {
        if (player.level < 19) {
          if (ghosts.timers.vulnerable.vulnerableTimer <= ghosts.timers.vulnerable.levelTimers[player.level] * 60) ghosts.timers.vulnerable.vulnerableTimer += delta;
          else {
            ghosts.timers.vulnerable.vulnerableTimer = 0;
            ghosts.vulnerable = false;
            ghosts.killCombo = 200;
            ghosts.data.forEach((ghost: ghost): "scatter" | "chase" => (ghost.mode = ghosts.mode));
          }
        } else ghosts.data.forEach((ghost: ghost): "scatter" | "chase" => (ghost.mode = ghosts.mode));
      }

      ghosts.data.forEach((ghost: ghost): void => {
        if (ghost.mode !== "vulnerable") ghost.mode = ghosts.mode;

        let dots: number = 0;
        maps[player.map][0].forEach((row: number[]): void => {
          row.forEach((cell: number): void => {
            if (cell === 4) dots++;
          });
        });

        switch (ghost.name) {
          case "blinky":
            if (ghost.mode === "chase") ghost.target = {x: player.x, y: player.y};
            else if (ghost.mode === "scatter") ghost.target = {x: 19, y: 0};
            break;
          case "pinky":
            if (ghost.mode === "chase") {
              if (player.dir === "up") ghost.target = {x: player.x, y: player.y - 4};
              else if (player.dir === "down") ghost.target = {x: player.x, y: player.y + 4};
              else if (player.dir === "left") ghost.target = {x: player.x - 4, y: player.y};
              else if (player.dir === "right") ghost.target = {x: player.x + 4, y: player.y};
            } else if (ghost.mode === "scatter") ghost.target = {x: 1, y: 0};
            break;
          case "inky":
            if (dots >= 35) {
              if (ghost.mode === "chase") {
                ghost.target.x = ghosts.data[0].x;
                ghost.target.y = player.y;
              } else if (ghost.mode === "scatter") ghost.target = {x: 19, y: 19};
            }
            break;
          case "clyde":
            if (dots >= 125) {
              if (ghost.mode === "chase") {
                if (calcDistance(player.x, player.y, ghost.x, ghost.y) > 8) ghost.target = {x: player.x, y: player.y};
                else ghost.target = {x: 0, y: 19};
              } else if (ghost.mode === "scatter") ghost.target = {x: 0, y: 19};
            }
            break;
        }

        if (Math.round(ghost.offset.x) === 0 && Math.round(ghost.offset.y) === 0 && maps[player.map][1][ghost.y][ghost.x] === 5) {
          if (maps[player.map][1][ghost.y][ghost.x - 1] !== 1 && ghost.dir !== "right") ghost.dir = "left";
          else if (maps[player.map][1][ghost.y][ghost.x + 1] !== 1 && ghost.dir !== "left") ghost.dir = "right";
          else if (maps[player.map][1][ghost.y + 1][ghost.x] !== 1 && ghost.dir !== "up") ghost.dir = "down";
          else if (maps[player.map][1][ghost.y - 1][ghost.x] !== 1 && ghost.dir !== "down") ghost.dir = "up";
        } else if (Math.round(ghost.offset.x) === 0 && Math.round(ghost.offset.y) === 0 && maps[player.map][1][ghost.y][ghost.x] === 4) {
          const turnsTemp: turn[] = [];

          if (maps[player.map][1][ghost.y - 1][ghost.x] !== 1 && ghost.dir !== "down") {
            turnsTemp.push({distance: calcDistance(ghost.target.x, ghost.target.y, ghost.x, ghost.y - 1), dir: "up"});
          }
          if (maps[player.map][1][ghost.y + 1][ghost.x] !== 1 && ghost.dir !== "up") {
            turnsTemp.push({distance: calcDistance(ghost.target.x, ghost.target.y, ghost.x, ghost.y + 1), dir: "down"});
          }
          if (maps[player.map][1][ghost.y][ghost.x - 1] !== 1 && ghost.dir !== "right") {
            turnsTemp.push({distance: calcDistance(ghost.target.x, ghost.target.y, ghost.x - 1, ghost.y), dir: "left"});
          }
          if (maps[player.map][1][ghost.y][ghost.x + 1] !== 1 && ghost.dir !== "left") {
            turnsTemp.push({distance: calcDistance(ghost.target.x, ghost.target.y, ghost.x + 1, ghost.y), dir: "right"});
          }
          turnsTemp.sort((a: {distance: number; dir: "up" | "down" | "left" | "right"}, b: {distance: number; dir: "up" | "down" | "left" | "right"}): number => a.distance - b.distance);

          if (ghost.mode !== "vulnerable") {
            if (turnsTemp[0] === turnsTemp[1]) {
              if (maps[player.map][1][ghost.y - 1][ghost.x] !== 1 && ghost.dir !== "down") ghost.dir = "up";
              else if (maps[player.map][1][ghost.y][ghost.x - 1] !== 1 && ghost.dir !== "right") ghost.dir = "left";
              else if (maps[player.map][1][ghost.y + 1][ghost.x] !== 1 && ghost.dir !== "up") ghost.dir = "down";
            } else ghost.dir = turnsTemp[0].dir;
          } else ghost.dir = turnsTemp[Math.floor(Math.random() * turnsTemp.length)].dir;
        } else if (Math.round(ghost.offset.x) === 0 && Math.round(ghost.offset.y) === 0 && maps[player.map][1][ghost.y][ghost.x] === 7 && (ghost.dir === "up" || ghost.dir === "down")) {
          const turnsTemp: turn[] = [];

          if (maps[player.map][1][ghost.y - 1][ghost.x] !== 1 && ghost.dir !== "down") {
            turnsTemp.push({distance: calcDistance(ghost.target.x, ghost.target.y, ghost.x, ghost.y - 1), dir: "up"});
          }
          if (maps[player.map][1][ghost.y + 1][ghost.x] !== 1 && ghost.dir !== "up") {
            turnsTemp.push({distance: calcDistance(ghost.target.x, ghost.target.y, ghost.x, ghost.y + 1), dir: "down"});
          }
          if (maps[player.map][1][ghost.y][ghost.x - 1] !== 1) {
            turnsTemp.push({distance: calcDistance(ghost.target.x, ghost.target.y, ghost.x - 1, ghost.y), dir: "left"});
          }
          if (maps[player.map][1][ghost.y][ghost.x + 1] !== 1) {
            turnsTemp.push({distance: calcDistance(ghost.target.x, ghost.target.y, ghost.x + 1, ghost.y), dir: "right"});
          }
          turnsTemp.sort((a: {distance: number; dir: string}, b: {distance: number; dir: string}): number => a.distance - b.distance);
          if (ghost.mode !== "vulnerable") {
            if (turnsTemp[0] === turnsTemp[1]) {
              if (maps[player.map][1][ghost.y - 1][ghost.x] !== 1 && ghost.dir !== "down") ghost.dir = "up";
              else if (maps[player.map][1][ghost.y][ghost.x - 1] !== 1) ghost.dir = "left";
              else if (maps[player.map][1][ghost.y + 1][ghost.x] !== 1 && ghost.dir !== "up") ghost.dir = "down";
            } else ghost.dir = turnsTemp[0].dir;
          } else ghost.dir = turnsTemp[Math.floor(Math.random() * turnsTemp.length)].dir;
        }

        if (maps[player.map][1][ghost.y][ghost.x] !== 6) moveGhost(ghost);
        else {
          if (ghost.target.x === 0 && ghost.target.y === 0) {
            switch (ghost.dir) {
              case "up":
                ghost.offset.y -= delta / 3;
                if (Math.round(ghost.offset.y) === -3) ghost.dir = "down";
                break;
              case "down":
                ghost.offset.y += delta / 3;
                if (Math.round(ghost.offset.y) === 3) ghost.dir = "up";
                break;
            }
          } else {
            if (!ghost.left) {
              if (Math.round(ghost.offset.y) !== 0 && !ghost.left) {
                if (Math.round(ghost.offset.y) > 0) {
                  ghost.offset.y -= delta;
                  ghost.dir = "up";
                } else {
                  ghost.offset.y += delta;
                  ghost.dir = "down";
                }
              } else if (ghost.x !== 9) {
                if (ghost.x > 9) ghost.dir = "left";
                else if (ghost.x < 9) ghost.dir = "right";
                moveGhost(ghost);
              } else if (Math.round(ghost.offset.x) !== 0) {
                if (ghost.offset.x > 0) {
                  ghost.dir = "left";
                  ghost.offset.x -= delta;
                } else {
                  ghost.dir = "right";
                  ghost.offset.x += delta;
                }
              } else ghost.left = true;
            } else {
              ghost.dir = "up";
              moveGhost(ghost);
            }
          }
        }
        if (player.x === ghost.x && player.y === ghost.y && ghost.mode !== "vulnerable") {
          player.lives--;
          if (player.lives >= 1) {
            ghosts.data.forEach((ghost: ghost): void => {
              ghost.x = ghost.spawn.x;
              ghost.y = ghost.spawn.y;
              reset(ghost);
            });
            player.offset = {x: 0, y: 0};
            ghosts.timers.modeTimer = 0;
            player.dir = "up";
            player.y = 15;
            player.x = 9;
            e.games.sfx("pacman/die");
          } else {
            if (e.stats.get("pacman-high-score") < player.score) e.stats.set("pacman-high-score", player.score);
            if (e.stats.get("pacman-highest-level") < player.score) e.stats.set("pacman-highest-level", player.level);

            e.games.end({message: "Game Over!", score: {Score: player.score, Level: player.level}});
          }
        } else if (player.x === ghost.x && player.y === ghost.y && ghost.mode === "vulnerable") killGhost(ghost);
      });

      ghosts.timers.modeTimer += delta;

      if (
        maps[player.map][0].filter((row: number[]): boolean => row.filter((cell: number): boolean => cell === 2).length !== 0).length === 0 &&
        maps[player.map][0].filter((row: number[]): boolean => row.filter((cell: number): boolean => cell === 3).length !== 0).length === 0
      ) {
        maps[player.map][0].forEach((row: number[], y: number): void => {
          row.forEach((cell: number, x: number): void => {
            if (cell === 4) maps[player.map][0][y][x] = 2;
            else if (cell === 5) maps[player.map][0][y][x] = 3;
          });
        });

        ghosts.data.forEach((ghost: ghost): void => {
          reset(ghost);
          ghost.x = ghost.spawn.x;
          ghost.y = ghost.spawn.y;
        });
        player.offset = {x: 0, y: 0};
        ghosts.timers.modeTimer = 0;
        player.dir = "up";
        player.level++;
        player.y = 15;
        player.x = 9;

        e.achievements.set("pacman-level");
        if (player.level >= 10) e.achievements.set("pacman-level-10");
      }

      e.games.setScoreboard({Score: player.score, Level: player.level, Lives: player.lives});
    },
  },
  page: {
    width: 475,
    height: 525,
  },
};

export default Pacman;
