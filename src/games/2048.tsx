import e from "../assets/main";
import * as types from "../assets/types";

type tile = 2 | 4 | 8 | 16 | 32 | 64 | 128 | 256 | 512 | 1024 | 2048 | 4096 | 8192 | 16384 | 32768 | 65536;

const colors: {[key: string]: {[key: number]: string}} = {
  dark: {
    2: "#302e2c",
    4: "#39303d",
    8: "#44254c",
    16: "#400c49",
    32: "#55125b",
    64: "#650668",
    128: "#790796",
    256: "#81319e",
    512: "#8719a0",
    1024: "#790284",
    2048: "#90179b",
    4096: "#90179b",
    8192: "#90179b",
    16384: "#90179b",
    32768: "#90179b",
    65536: "#90179b",
  },
  light: {
    2: "#ccc6c1",
    4: "#adb1d8",
    8: "#6567d3",
    16: "#1b32c6",
    32: "#1b2bd6",
    64: "#2038a3",
    128: "#5614d1",
    256: "#5a26c1",
    512: "#6733ce",
    1024: "#6634af",
    2048: "#26a5bf",
    4096: "#26a5bf",
    8192: "#26a5bf",
    16384: "#26a5bf",
    32768: "#26a5bf",
    65536: "#26a5bf",
  },
};

interface tweenTile {
  value: tile;
  startx: number;
  starty: number;
  endx: number;
  endy: number;
  duration: number;
  elapsed: number;
  completed: boolean;
}

const roundRect: (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => CanvasRenderingContext2D = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): CanvasRenderingContext2D => {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;

  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
  return ctx;
};

const T048: types.game = {
  name: "2048",
  id: "t048",
  info: "Use <kbd>[UP]</kbd>, <kbd>[DOWN]</kbd>, <kbd>[LEFT]</kbd> and <kbd>[RIGHT]</kbd> to rearrange the tiles, merge them together to reach 2048!",
  functions: {
    start: (): void => {
      e.games.current.data = {
        score: 0,
        loseTimer: 0,
        grid: [
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
        ],
        tweenTiles: [],
        keys: {Up: false, Down: false, Left: false, Right: false},
      };
      e.games.current.data.grid[Math.floor(Math.random() * 4)][Math.floor(Math.random() * 4)] = Math.random() > 0.9 ? 4 : 2;
    },
    render: (_frame: number, delta: number): void => {
      if (!e.games.ctx) return;

      const ctx: CanvasRenderingContext2D = e.games.ctx;
      const tweenTiles: tweenTile[] = e.games.current.data.tweenTiles;

      ctx.fillStyle = e.storage.get("dark-mode") ? "#171717" : "#f2f2f2";
      for (let i: number = 0; i <= 3; i++) {
        for (let j: number = 0; j <= 3; j++) {
          ctx.fillStyle = e.storage.get("dark-mode") ? "#171717" : "#f2f2f2";
          roundRect(ctx, 50 + i * (120 - 50 / 3), 50 + j * (120 - 50 / 3), 90, 90, 10).fill();
        }
      }

      if (tweenTiles.length === 0) {
        for (let i: number = 0; i <= 3; i++) {
          for (let j: number = 0; j <= 3; j++) {
            if (e.games.current.data.grid[j][i] !== 0) {
              ctx.fillStyle = (e.storage.get("dark-mode") ? colors.dark : colors.light)[e.games.current.data.grid[j][i]];
              roundRect(ctx, 50 + i * (120 - 50 / 3), 50 + j * (120 - 50 / 3), 90, 90, 10).fill();
              ctx.font = "40px Roboto";
              ctx.textAlign = "center";
              ctx.fillStyle = e.storage.get("dark-mode") ? "white" : "black";
              ctx.fillText(e.games.current.data.grid[j][i], 95 + i * (120 - 50 / 3), 90 + 56 / 3 + j * (120 - 50 / 3), 85);
            }
          }
        }
      } else {
        tweenTiles.forEach((tweenTile: tweenTile): void => {
          ctx.fillStyle = (e.storage.get("dark-mode") ? colors.dark : colors.light)[tweenTile.value];
          tweenTile.elapsed += delta / 60;
          if (tweenTile.elapsed >= tweenTile.duration) {
            tweenTile.elapsed = tweenTile.duration;
            tweenTile.completed = true;
          }
          let completion: number = tweenTile.elapsed / tweenTile.duration;
          if (tweenTile.duration === 0) completion = 1;
          completion = completion * completion;
          let currentX: number = tweenTile.startx * (1 - completion) + tweenTile.endx * completion;
          let currentY: number = tweenTile.starty * (1 - completion) + tweenTile.endy * completion;
          if (tweenTile.elapsed >= 0) {
            roundRect(ctx, 50 + currentX * (120 - 50 / 3), 50 + currentY * (120 - 50 / 3), 90, 90, 10).fill();
            ctx.font = "40px Roboto";
            ctx.textAlign = "center";
            ctx.fillStyle = e.storage.get("dark-mode") ? "white" : "black";
            ctx.fillText(String(tweenTile.value), 95 + currentX * (120 - 50 / 3), 90 + 56 / 3 + currentY * (120 - 50 / 3), 85);
          }
        });
        if (tweenTiles.every((tweenTile: tweenTile) => tweenTile.completed)) e.games.current.data.tweenTiles = [];
      }
      ctx.fillStyle = e.storage.get("dark-mode") ? "#121212" : "white";
      let loseFadeAlpha: number = e.games.current.data.loseTimer / 0.625;
      ctx.globalAlpha = loseFadeAlpha;
      ctx.fillRect(0, 0, 500, 500);
      ctx.globalAlpha = 1.0;
      ctx.fillStyle = e.storage.get("dark-mode") ? "white" : "black";
    },
    update: (_time: number, delta: number): void => {
      const data: {[key: string]: any} = e.games.current.data;
      const grid: number[][] = data.grid;
      let alive: boolean = false;

      const tweenSpeed: number = 0.075;
      for (let i: number = 0; i <= 3; i++) {
        if (alive) break;
        for (let j: number = 0; j <= 3; j++) {
          if (alive) break;
          if (grid[j]?.[i - 1] === 0 || grid[j]?.[i - 1] === grid[j][i]) {
            alive = true;
            break;
          }
          if (grid[j]?.[i + 1] === 0 || grid[j]?.[i + 1] === grid[j][i]) {
            alive = true;
            break;
          }
          if (grid[j - 1]?.[i] === 0 || grid[j - 1]?.[i] === grid[j][i]) {
            alive = true;
            break;
          }
          if (grid[j + 1]?.[i] === 0 || grid[j + 1]?.[i] === grid[j][i]) {
            alive = true;
            break;
          }
        }
      }
      if (!alive) {
        data.loseTimer += delta / 60;
        if (data.loseTimer >= 0.625) {
          if (e.stats.get("2048-high-score") < data.score) e.stats.set("2048-high-score", data.score);
          let highest: number = Math.max(...grid.flat());
          if (e.stats.get("2048-high-tile") < highest) e.stats.set("2048-high-tile", highest);
          e.games.end({message: "Game Over", score: {Score: data.score, "Highest Tile": highest}});
        }
      }
      let highest: number = Math.max(...grid.flat());
      if (highest >= 512) e.achievements.set("2048-512");
      else if (highest >= 1024) e.achievements.set("2048-1024");
      else if (highest >= 2048) e.achievements.set("2048-2048");
      else if (highest >= 4096) e.achievements.set("2048-4096");
      if (data.score >= 10000) e.achievements.set("2048-10k-points");
      if (e.games.keys.Up) {
        if (!data.keys.Up) {
          let hasMoved: boolean = false;
          e.games.current.data.tweenTiles = [];
          for (let i: number = 0; i <= 3; i++) {
            for (let j: number = 0; j <= 3; j++) {
              if (grid[j][i] !== 0) {
                let hasPushed: boolean = false;
                for (let k = j - 1; k >= -1; k--) {
                  if (k === -1) {
                    if (0 !== j) hasMoved = true;
                    let tempTile: number = grid[j][i];
                    hasPushed = true;
                    e.games.current.data.tweenTiles.push({
                      value: tempTile,
                      startx: i,
                      starty: j,
                      endx: i,
                      endy: 0,
                      duration: j * tweenSpeed,
                      elapsed: 0,
                      completed: false,
                    });
                    grid[j][i] = 0;
                    grid[0][i] = tempTile;
                    break;
                  } else if (grid[k][i] === grid[j][i]) {
                    if (k !== j) hasMoved = true;
                    hasPushed = true;
                    let tempTile: number = grid[j][i];
                    e.games.current.data.tweenTiles.push({
                      value: tempTile,
                      startx: i,
                      starty: j,
                      endx: i,
                      endy: k,
                      duration: (j - k) * tweenSpeed,
                      elapsed: 0,
                      completed: false,
                    });
                    e.games.current.data.tweenTiles.push({
                      value: tempTile * 2,
                      startx: i,
                      starty: k,
                      endx: i,
                      endy: k,
                      duration: 0,
                      elapsed: -(j - k) * tweenSpeed,
                      completed: false,
                    });
                    grid[j][i] = 0;
                    grid[k][i] = tempTile * 6;
                    data.score += tempTile * 2;
                    break;
                  } else if (grid[k][i] !== 0) {
                    if (k + 1 !== j) hasMoved = true;
                    hasPushed = true;
                    let tempTile: number = grid[j][i];
                    e.games.current.data.tweenTiles.push({
                      value: tempTile,
                      startx: i,
                      starty: j,
                      endx: i,
                      endy: k + 1,
                      duration: (j - k - 1) * tweenSpeed,
                      elapsed: 0,
                      completed: false,
                    });
                    grid[j][i] = 0;
                    grid[k + 1][i] = tempTile;
                    break;
                  }
                }
                if (!hasPushed) {
                  e.games.current.data.tweenTiles.push({
                    value: grid[j][i],
                    startx: i,
                    starty: j,
                    endx: i,
                    endy: j,
                    duration: 0,
                    elapsed: 0,
                    completed: false,
                  });
                }
              }
            }
          }
          if (hasMoved) {
            let possSpots: number[][] = [];
            for (let i = 0; i <= 3; i++) {
              for (let j = 0; j <= 3; j++) {
                if (grid[j][i] === 0) {
                  possSpots.push([j, i]);
                }
              }
            }
            if (possSpots.length > 0) {
              let spot = possSpots[Math.floor(Math.random() * possSpots.length)];
              e.games.current.data.grid[spot[0]][spot[1]] = Math.random() > 0.9 ? 4 : 2;
            }
          }
        }
        data.keys.Up = true;
      } else data.keys.Up = false;
      for (let row of grid) {
        for (let tile in row) {
          if (row[tile] % 3 === 0) row[tile] /= 3;
        }
      }
      if (e.games.keys.Down) {
        if (!data.keys.Down) {
          e.games.current.data.tweenTiles = [];
          let hasMoved: boolean = false;
          for (let i: number = 0; i <= 3; i++) {
            for (let j: number = 3; j >= 0; j--) {
              if (grid[j][i] !== 0) {
                let hasPushed = false;
                for (let k: number = j + 1; k <= 4; k++) {
                  if (k === 4) {
                    if (3 !== j) hasMoved = true;
                    let tempTile: number = grid[j][i];
                    hasPushed = true;
                    e.games.current.data.tweenTiles.push({
                      value: tempTile,
                      startx: i,
                      starty: j,
                      endx: i,
                      endy: 3,
                      duration: (3 - j) * tweenSpeed,
                      elapsed: 0,
                      completed: false,
                    });
                    grid[j][i] = 0;
                    grid[3][i] = tempTile;
                    break;
                  } else if (grid[k][i] === grid[j][i]) {
                    if (k !== j) hasMoved = true;
                    let tempTile: number = grid[j][i];
                    hasPushed = true;
                    e.games.current.data.tweenTiles.push({
                      value: tempTile,
                      startx: i,
                      starty: j,
                      endx: i,
                      endy: k,
                      duration: (k - j) * tweenSpeed,
                      elapsed: 0,
                      completed: false,
                    });
                    e.games.current.data.tweenTiles.push({
                      value: tempTile * 2,
                      startx: i,
                      starty: k,
                      endx: i,
                      endy: k,
                      duration: 0,
                      elapsed: -(k - j) * tweenSpeed,
                      completed: false,
                    });
                    grid[j][i] = 0;
                    grid[k][i] = tempTile * 6;
                    data.score += tempTile * 2;
                    break;
                  } else if (grid[k][i] !== 0) {
                    if (k - 1 !== j) hasMoved = true;
                    let tempTile: number = grid[j][i];
                    hasPushed = true;
                    e.games.current.data.tweenTiles.push({
                      value: tempTile,
                      startx: i,
                      starty: j,
                      endx: i,
                      endy: k - 1,
                      duration: (k - j - 1) * tweenSpeed,
                      elapsed: 0,
                      completed: false,
                    });
                    grid[j][i] = 0;
                    grid[k - 1][i] = tempTile;
                    break;
                  }
                }
                if (!hasPushed) {
                  e.games.current.data.tweenTiles.push({
                    value: grid[j][i],
                    startx: i,
                    starty: j,
                    endx: i,
                    endy: j,
                    duration: 0,
                    elapsed: 0,
                    completed: false,
                  });
                }
              }
            }
          }
          if (hasMoved) {
            let possSpots = [];
            for (let i: number = 0; i <= 3; i++) {
              for (let j: number = 0; j <= 3; j++) {
                if (grid[j][i] === 0) possSpots.push([j, i]);
              }
            }
            if (possSpots.length > 0) {
              let spot: number[] = possSpots[Math.floor(Math.random() * possSpots.length)];
              e.games.current.data.grid[spot[0]][spot[1]] = Math.random() > 0.9 ? 4 : 2;
            }
          }
        }
        data.keys.Down = true;
      } else data.keys.Down = false;
      for (let row of grid) {
        for (let tile in row) {
          if (row[tile] % 3 === 0) row[tile] /= 3;
        }
      }
      if (e.games.keys.Left) {
        if (!data.keys.Left) {
          e.games.current.data.tweenTiles = [];
          let hasMoved: boolean = false;
          for (let j: number = 0; j <= 3; j++) {
            for (let i: number = 0; i <= 3; i++) {
              if (grid[j][i] !== 0) {
                let hasPushed: boolean = false;
                for (let k: number = i - 1; k >= -1; k--) {
                  if (k === -1) {
                    if (0 !== i) hasMoved = true;
                    let tempTile: number = grid[j][i];
                    hasPushed = true;
                    e.games.current.data.tweenTiles.push({
                      value: tempTile,
                      startx: i,
                      starty: j,
                      endx: 0,
                      endy: j,
                      duration: i * tweenSpeed,
                      elapsed: 0,
                      completed: false,
                    });
                    grid[j][i] = 0;
                    grid[j][0] = tempTile;
                    break;
                  } else if (grid[j][k] === grid[j][i]) {
                    if (k !== i) hasMoved = true;
                    let tempTile: number = grid[j][i];
                    hasPushed = true;
                    e.games.current.data.tweenTiles.push({
                      value: tempTile,
                      startx: i,
                      starty: j,
                      endx: k,
                      endy: j,
                      duration: (i - k) * tweenSpeed,
                      elapsed: 0,
                      completed: false,
                    });
                    e.games.current.data.tweenTiles.push({
                      value: tempTile * 2,
                      startx: k,
                      starty: j,
                      endx: k,
                      endy: j,
                      duration: 0,
                      elapsed: -(i - k) * tweenSpeed,
                      completed: false,
                    });
                    grid[j][i] = 0;
                    grid[j][k] = tempTile * 6;
                    data.score += tempTile * 2;
                    break;
                  } else if (grid[j][k] !== 0) {
                    if (k + 1 !== i) hasMoved = true;
                    let tempTile: number = grid[j][i];
                    hasPushed = true;
                    e.games.current.data.tweenTiles.push({
                      value: tempTile,
                      startx: i,
                      starty: j,
                      endx: k + 1,
                      endy: j,
                      duration: (i - k - 1) * tweenSpeed,
                      elapsed: 0,
                      completed: false,
                    });
                    grid[j][i] = 0;
                    grid[j][k + 1] = tempTile;
                    break;
                  }
                }
                if (!hasPushed) {
                  e.games.current.data.tweenTiles.push({
                    value: grid[j][i],
                    startx: i,
                    starty: j,
                    endx: i,
                    endy: j,
                    duration: 0,
                    elapsed: 0,
                    completed: false,
                  });
                }
              }
            }
          }
          if (hasMoved) {
            let possSpots: number[][] = [];
            for (let i: number = 0; i <= 3; i++) {
              for (let j: number = 0; j <= 3; j++) {
                if (grid[j][i] === 0) possSpots.push([j, i]);
              }
            }
            if (possSpots.length > 0) {
              let spot: number[] = possSpots[Math.floor(Math.random() * possSpots.length)];
              e.games.current.data.grid[spot[0]][spot[1]] = Math.random() > 0.9 ? 4 : 2;
            }
          }
        }
        data.keys.Left = true;
      } else data.keys.Left = false;
      for (let row of grid) {
        for (let tile in row) {
          if (row[tile] % 3 === 0) row[tile] /= 3;
        }
      }
      if (e.games.keys.Right) {
        if (!data.keys.Right) {
          let hasMoved: boolean = false;
          e.games.current.data.tweenTiles = [];
          for (let j: number = 0; j <= 3; j++) {
            for (let i: number = 3; i >= 0; i--) {
              if (grid[j][i] !== 0) {
                let hasPushed = false;
                for (let k: number = i + 1; k <= 4; k++) {
                  if (k === 4) {
                    if (3 !== i) hasMoved = true;
                    let tempTile: number = grid[j][i];
                    hasPushed = true;
                    e.games.current.data.tweenTiles.push({
                      value: tempTile,
                      startx: i,
                      starty: j,
                      endx: 3,
                      endy: j,
                      duration: (3 - i) * tweenSpeed,
                      elapsed: 0,
                      completed: false,
                    });
                    grid[j][i] = 0;
                    grid[j][3] = tempTile;
                    break;
                  } else if (grid[j][k] === grid[j][i]) {
                    if (k !== i) hasMoved = true;
                    let tempTile: number = grid[j][i];
                    hasPushed = true;
                    e.games.current.data.tweenTiles.push({
                      value: tempTile,
                      startx: i,
                      starty: j,
                      endx: k,
                      endy: j,
                      duration: (k - i) * tweenSpeed,
                      elapsed: 0,
                      completed: false,
                    });
                    e.games.current.data.tweenTiles.push({
                      value: tempTile * 2,
                      startx: k,
                      starty: j,
                      endx: k,
                      endy: j,
                      duration: 0,
                      elapsed: -(k - i) * tweenSpeed,
                      completed: false,
                    });
                    grid[j][i] = 0;
                    grid[j][k] = tempTile * 6;
                    data.score += tempTile * 2;
                    break;
                  } else if (grid[j][k] !== 0) {
                    if (k - 1 !== i) hasMoved = true;
                    let tempTile: number = grid[j][i];
                    hasPushed = true;
                    e.games.current.data.tweenTiles.push({
                      value: tempTile,
                      startx: i,
                      starty: j,
                      endx: k - 1,
                      endy: j,
                      duration: (k - i - 1) * tweenSpeed,
                      elapsed: 0,
                      completed: false,
                    });
                    grid[j][i] = 0;
                    grid[j][k - 1] = tempTile;
                    break;
                  }
                }
                if (!hasPushed) {
                  e.games.current.data.tweenTiles.push({
                    value: grid[j][i],
                    startx: i,
                    starty: j,
                    endx: i,
                    endy: j,
                    duration: 0,
                    elapsed: 0,
                    completed: false,
                  });
                }
              }
            }
          }
          if (hasMoved) {
            let possSpots: number[][] = [];
            for (let i: number = 0; i <= 3; i++) {
              for (let j: number = 0; j <= 3; j++) {
                if (grid[j][i] === 0) possSpots.push([j, i]);
              }
            }
            if (possSpots.length > 0) {
              let spot: number[] = possSpots[Math.floor(Math.random() * possSpots.length)];
              e.games.current.data.grid[spot[0]][spot[1]] = Math.random() > 0.9 ? 4 : 2;
            }
          }
        }
        data.keys.Right = true;
      } else data.keys.Right = false;
      for (let row of grid) {
        for (let tile in row) {
          if (row[tile] % 3 === 0) row[tile] /= 3;
        }
      }
      e.games.setScoreboard({Score: data.score});
    },
  },
  page: {
    width: 500,
    height: 500,
  },
};

export default T048;
