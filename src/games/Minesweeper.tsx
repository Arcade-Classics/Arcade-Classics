import e from "../assets/main";
import * as types from "../assets/types";

interface cell {
  isMine: boolean;
  flagged: boolean;
  opened: boolean;
  adjacentMines: number;
}

const shuffleArray: (arr: number[][]) => void = (arr: number[][]): void => {
  for (let i: number = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
};

const tileColours: {[key: number]: string} = {
  1: "#0100FE",
  2: "#017F01",
  3: "#FE0000",
  4: "#010080",
  5: "#810102",
  6: "#008081",
  7: "#000000",
  8: "#808080",
};
const tileBacks: {[key: number]: string} = {
  0: "#373737",
  1: "#3F3F7F",
  2: "#3B7F3B",
  3: "#7F1919",
  4: "#0C0C7F",
  5: "#4C0707",
  6: "#197F7F",
  7: "#303030",
  8: "#000000",
};

const click: (x: number, y: number, playSounds: boolean) => number = (x: number, y: number, playSounds: boolean): number => {
  const data: {[key: string]: any} = e.games.current.data;

  if (data.grid[y][x].opened) {
    let seenMines: number = 0;
    for (let i: number = -1; i <= 1; i++) {
      for (let j: number = -1; j <= 1; j++) if (data.grid[y + i] && data.grid[y + i][x + j] && data.grid[y + i][x + j].flagged) seenMines++;
    }
    if (seenMines === data.grid[y][x].adjacentMines) {
      let recursiveCount: number = 0;
      for (let i: number = -1; i <= 1; i++) {
        for (let j: number = -1; j <= 1; j++) {
          if (data.grid[y + i] && data.grid[y + i][x + j] && !data.grid[y + i][x + j].opened && !data.grid[y + i][x + j].flagged) {
            recursiveCount += click(x + j, y + i, false);
          }
        }
      }
      if (playSounds && recursiveCount) {
        if (recursiveCount >= 4) e.games.sfx("minesweeper/digMany");
        else e.games.sfx("minesweeper/dig" + recursiveCount);
      }
      return recursiveCount;
    } else return 0;
  } else if (data.grid[y][x].isMine && !data.grid[y][x].flagged) {
    e.games.sfx("minesweeper/boom");
    data.hasLost = true;
    return 0;
  } else if (!data.grid[y][x].flagged) {
    data.grid[y][x].opened = true;
    let recursiveCount: number = 0;
    if (data.grid[y][x].adjacentMines === 0) {
      for (let i: number = -1; i <= 1; i++) {
        for (let j: number = -1; j <= 1; j++) {
          if (data.grid[y + i] && data.grid[y + i][x + j] && !data.grid[y + i][x + j].opened && !data.grid[y + i][x + j].flagged) {
            recursiveCount += click(x + j, y + i, false);
          }
        }
      }
    }
    if (playSounds && recursiveCount) {
      if (recursiveCount > 0) e.games.sfx("minesweeper/digMany");
      else if (data.grid[y][x].adjacentMines > 4) e.games.sfx("minesweeper/digMany");
      else e.games.sfx("minesweeper/dig" + data.grid[y][x].adjacentMines);
    }
    return recursiveCount + 1;
  }
  return 0;
};

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

const generateMines: (x: number, y: number) => void = (x: number, y: number): void => {
  const data: {[key: string]: any} = e.games.current.data;

  const difficulty: number = (e.storage.get("minesweeper-difficulty") as number) || 1;
  const mines: number = difficulty ** 2 * 10;
  const gridSize: number = difficulty * 8;
  const allMineSpots: number[][] = [];
  for (let pX: number = 0; pX < gridSize; pX++) {
    for (let pY: number = 0; pY < gridSize; pY++) {
      if (Math.abs(pX - x) <= Math.ceil(difficulty / 2 + 0.5) && Math.abs(pY - y) <= Math.ceil(difficulty / 2 + 0.5)) continue;
      allMineSpots.push([pX, pY]);
    }
  }
  shuffleArray(allMineSpots);
  let chosenMineSpots: number[][] = allMineSpots.slice(0, mines);
  chosenMineSpots.forEach((cell: number[]): boolean => (data.grid[cell[1]][cell[0]].isMine = true));
  data.grid.forEach((row: cell[], rowIndex: number): void => {
    row.forEach((cell: cell, columnIndex: number): void => {
      for (let i: number = -1; i <= 1; i++) {
        for (let j: number = -1; j <= 1; j++) {
          if (data.grid?.[rowIndex + j]?.[columnIndex + i]?.isMine && !(i === 0 && j === 0)) cell.adjacentMines++;
        }
      }
    });
  });
  data.hasGenerated = true;
  click(x, y, true);
};

const Minesweeper: types.game = {
  name: "Minesweeper",
  id: "minesweeper",
  info: "Use <kbd>Left Click</kbd> to dig up a cell, and <kbd>Right Click</kbd> to flag a cell as a mine. The numbers represent how many mines are adjacent to that cell, locate all mines to win!",
  functions: {
    start: (): void => {
      const difficulty: number = (e.storage.get("minesweeper-difficulty") as number) || 1;
      e.games.current.data = {
        grid: JSON.parse(
          JSON.stringify(
            Array(difficulty * 8).fill(
              Array(difficulty * 8).fill({
                isMine: false,
                flagged: false,
                opened: false,
                adjacentMines: 0,
              }),
            ),
          ),
        ),
        totalMines: difficulty * difficulty * 10,
        hasGenerated: false,
        time: 0,
        hasDied: false,
        hasWon: false,
        endTimer: 0,
      };
    },
    render: (_frame: number): void => {
      if (!e.games.ctx) return;

      const ctx: CanvasRenderingContext2D = e.games.ctx;
      const data: {[key: string]: any} = e.games.current.data;

      let scaling: number = 1 / (e.storage.get("minesweeper-difficulty") as number) || 1;
      data.grid.forEach((row: cell[], rowIndex: number): void => {
        row.forEach((cell: cell, columnIndex: number): void => {
          ctx.fillStyle = e.storage.get("dark-mode") ? "#272727" : "#e2e2e2";
          roundRect(ctx, 50 + (50 * columnIndex + 5) * scaling, 50 + (50 * rowIndex + 5) * scaling, 40 * scaling, 40 * scaling, 5 * scaling).fill();
          if (cell.opened || data.hasWon || data.hasLost) {
            ctx.fillStyle = e.storage.get("dark-mode") ? tileBacks[cell.adjacentMines] : "#d2d2d2";
            roundRect(ctx, 50 + (50 * columnIndex + 5) * scaling, 50 + (50 * rowIndex + 5) * scaling, 40 * scaling, 40 * scaling, 5 * scaling).fill();

            if (cell.isMine) {
              ctx.fillStyle = e.storage.get("dark-mode") ? "#571717" : "#f2a2a2";
              roundRect(ctx, 50 + (50 * columnIndex + 5) * scaling, 50 + (50 * rowIndex + 5) * scaling, 40 * scaling, 40 * scaling, 5 * scaling).fill();
              ctx.font = 30 * scaling + "px Roboto";
              ctx.textAlign = "center";
              ctx.fillStyle = e.storage.get("dark-mode") ? "white" : "black";
              ctx.fillText("💣", 50 + (50 * columnIndex + 25) * scaling, 50 + (50 * rowIndex + 35) * scaling, 40 * scaling);
            } else if (cell.adjacentMines !== 0) {
              ctx.font = 40 * scaling + "px Roboto";
              ctx.textAlign = "center";
              ctx.fillStyle = e.storage.get("dark-mode") ? "white" : tileColours[cell.adjacentMines];
              ctx.fillText(String(cell.adjacentMines), 50 + (50 * columnIndex + 25) * scaling, 50 + (50 * rowIndex + 40) * scaling, 40 * scaling);
            }
          }
          if (cell.flagged) {
            ctx.font = 30 * scaling + "px Roboto";
            ctx.textAlign = "center";
            ctx.fillStyle = e.storage.get("dark-mode") ? "white" : "black";
            ctx.fillText("🚩", 50 + (50 * columnIndex + 25) * scaling, 50 + (50 * rowIndex + 35) * scaling, 30 * scaling);
          }
        });
      });
    },
    update: (_time: number, delta: number): void => {
      const data: {[key: string]: any} = e.games.current.data;

      if (!data.hasWon && !data.hasLost) {
        e.games.setScoreboard({
          "Mines Left":
            data.totalMines -
            data.grid
              .flat()
              .map((c: cell) => c.flagged)
              .reduce((acc: number, cur: boolean): number => acc + (cur ? 1 : 0)),
          Time: Math.round(data.time * 10) / 10,
        });
        if (
          data.grid
            .flat()
            .map((c: cell) => c.flagged || c.opened)
            .reduce((acc: number, cur: boolean): number => acc + (cur ? 1 : 0)) ===
            data.grid.length ** 2 &&
          data.grid
            .flat()
            .map((c: cell): number => (c.flagged && c.isMine ? 1 : 0) - (c.flagged && !c.isMine ? -1 : 0))
            .reduce((acc: number, cur: number) => acc + cur) ===
            ((e.storage.get("minesweeper-difficulty") as number) || 1) ** 2 * 10
        ) {
          data.hasWon = true;
          e.games.sfx("minesweeper/win");
        }
      }

      if (data.hasWon || data.hasLost) data.endTimer += delta / 60;
      else data.time += delta / 60;
      if (data.endTimer >= 1) {
        if (data.hasLost) {
          e.games.end({
            message: "Boom!",
            score: {
              Time: Math.round(data.time * 100) / 100,
              Difficulty: ["", "Easy", "Intermediate", "Expert", "", "Impossible"][(e.storage.get("minesweeper-difficulty") as number) || 1],
            },
          });
        } else {
          e.stats.increase("minesweeper-wins");
          if (e.stats.get("minesweeper-fastest-game") > data.time || e.stats.get("minesweeper-fastest-game") === 0) e.stats.set("minesweeper-fastest-game", Math.round(data.time * 100) / 100);
          e.achievements.set("minesweeper-" + ["", "easy", "intermediate", "expert", "", "impossible"][(e.storage.get("minesweeper-difficulty") as number) || 1]);
          if (data.time <= 15) e.achievements.set("minesweeper-15s");
          e.games.end({
            message: "You win!",
            score: {
              Time: Math.round(data.time * 100) / 100,
              Difficulty: ["", "Easy", "Intermediate", "Expert", "", "Impossible"][(e.storage.get("minesweeper-difficulty") as number) || 1],
            },
          });
        }
      }
    },
    click: (event: {button: "left" | "right"; x: number; y: number}): void => {
      if (e.pages.get() !== "game" || e.storage.get("game") !== "minesweeper") return;
      const data: {[key: string]: any} = e.games.current.data;

      if (data.hasWon || data.hasLost) return;
      let scaling: number = 1 / (e.storage.get("minesweeper-difficulty") as number) || 1;
      let size: number = data.grid.length;
      if (!(event.x < 50 + 5 * scaling || event.y < 50 + 5 * scaling || event.x >= 50 + (50 * size + 5) || event.y >= 50 + (50 * size + 5))) {
        let gridX: number = Math.floor((event.x - (45 + 5 * scaling)) / (50 * scaling));
        let gridY: number = Math.floor((event.y - (45 + 5 * scaling)) / (50 * scaling));
        if (event.button === "right") {
          if (!data.grid[gridY][gridX].opened) {
            data.grid[gridY][gridX].flagged = !data.grid[gridY][gridX].flagged;
            if (data.grid[gridY][gridX].flagged) e.games.sfx("minesweeper/flag");
            else e.games.sfx("minesweeper/unflag");
          } else {
            let seenFlaggables: number = 0;
            for (let i: number = -1; i <= 1; i++) {
              for (let j: number = -1; j <= 1; j++)
                if (data.grid[gridY + i] && data.grid[gridY + i][gridX + j] && (data.grid[gridY + i][gridX + j].flagged || !data.grid[gridY + i][gridX + j].opened)) seenFlaggables++;
            }
            if (seenFlaggables === data.grid[gridY][gridX].adjacentMines) {
              let recursiveCount: number = 0;
              for (let i: number = -1; i <= 1; i++) {
                for (let j: number = -1; j <= 1; j++) {
                  if (data.grid[gridY + i] && data.grid[gridY + i][gridX + j] && !data.grid[gridY + i][gridX + j].opened && !data.grid[gridY + i][gridX + j].flagged) {
                    recursiveCount++;
                    data.grid[gridY + i][gridX + j].flagged = true;
                  }
                }
              }
              if (recursiveCount) {
                e.games.sfx("minesweeper/flag");
              }
            }
          }
        } else if (event.button === "left") {
          if (!data.hasGenerated) generateMines(gridX, gridY);
          else click(gridX, gridY, true);
        }
      }
    },
  },
  page: {
    width: 500,
    height: 500,
  },
  options: [
    {
      name: "Game Difficulty",
      info: "Choose the game difficulty",
      id: "minesweeper-difficulty",
      type: "dropdown",
      default: 2,
      options: [
        {name: "Easy", id: 1},
        {name: "Intermediate", id: 2},
        {name: "Expert", id: 3},
        {name: "Impossible", id: 5},
      ],
    },
  ],
};

export default Minesweeper;
