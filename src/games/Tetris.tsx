import e from "../assets/main";
import * as types from "../assets/types";

type matrix = 1 | 2 | 3 | 4 | 5 | 6 | 7;

interface textEffect {
  text: string;
  x: number;
  y: number;
  opacity: number;
  size: number;
}

const matrixDict: {
  1: string;
  2: string;
  3: string;
  4: string;
  5: string;
  6: string;
  7: string;
} = {1: "#01F0F1", 2: "#0101F0", 3: "#EFA000", 4: "#F0F100", 5: "#00F200", 6: "#A000F2", 7: "#F00100"};
const dropScoreDict: {
  0: number;
  1: number;
  2: number;
  3: number;
  4: number;
} = {0: 0, 1: 40, 2: 100, 3: 300, 4: 1200};
const clearTypeDict: {
  1: string;
  2: string;
  3: string;
  4: string;
} = {1: "Single", 2: "Double", 3: "Triple", 4: "Tetris"};

const rotate = (matrix: matrix[][]) => {
  const rows: number = matrix.length;
  const cols: number = matrix[0].length;
  const oldMatrix: matrix[][] = matrix;
  const newMatrix: matrix[][] = Array(cols)
    .fill(0)
    .map(() => Array(rows).fill(0));
  for (let r: number = 0, cc = rows - 1; r < rows; r++, cc--) {
    for (let c: number = 0, rr = 0; c < cols; c++, rr++) newMatrix[rr][cc] = matrix[r][c];
  }
  e.games.current.data.piece.matrix = newMatrix;

  e.games.current.data.piece.matrix.forEach((row: matrix[], y: number): void => {
    row.forEach((_cell: number, x: number): void => {
      if (e.games.current.data.game.droppedMatrix[y + e.games.current.data.piece.y - 1]) {
        let rotationCheck: number = e.games.current.data.game.droppedMatrix[y + e.games.current.data.piece.y - 1][x + e.games.current.data.piece.x - 1];
        if (rotationCheck !== 0) {
          e.games.current.data.piece.matrix = oldMatrix;
          if (!rotationCheck) {
            e.games.current.data.piece.x--;
            rotate(e.games.current.data.piece.matrix);
          }
        }
      } else if (e.games.current.data.game.droppedMatrix[1][x + e.games.current.data.piece.x - 1] === undefined) {
        e.games.current.data.piece.matrix = oldMatrix;
        e.games.current.data.piece.x--;
        rotate(e.games.current.data.piece.matrix);
      }
      if (!e.games.current.data.game.droppedMatrix[y + e.games.current.data.piece.y - 1] && e.games.current.data.piece.y > 5) e.games.current.data.piece.matrix = oldMatrix;
    });
  });

  if (e.games.current.data.player.isDropLocking) {
    if (e.games.current.data.piece.y + e.games.current.data.piece.matrix.length - 1 < 20) {
      e.games.current.data.player.isDropLocking = false;
      e.games.current.data.player.dropLockTimer = 0;
    } else if (e.games.current.data.piece.y + e.games.current.data.piece.matrix.length - 1 > 20) {
      e.games.current.data.piece.y--;
      checkEnvironment();
    }
  }
};

const endGame: (message: string) => void = (message: string) => {
  if (e.games.current.data.player.score > e.stats.get("tetris-high-score")) e.stats.set("tetris-high-score", e.games.current.data.player.score);
  if (e.games.current.data.player.level > e.stats.get("tetris-highest-level")) e.stats.set("tetris-highest-level", e.games.current.data.player.level);
  if (e.games.current.data.player.rowsCleared > e.stats.get("tetris-rows-cleared")) e.stats.set("tetris-rows-cleared", e.games.current.data.player.rowsCleared);
  e.games.end({
    message: message,
    score: {
      Score: e.games.current.data.player.score,
      Level: e.games.current.data.player.level,
      "Rows Cleared": e.games.current.data.player.rowsCleared,
      Gamemode: e.storage.get("tetris-mode") as string,
    },
  });
};

const setupLock: () => void = (): void => {
  let time: number = 30 - e.games.current.data.player.level * 5 + 5;
  time >= 10 ? (e.games.current.data.player.dropLockTimer = time) : (e.games.current.data.player.dropLockTimer = 10);
  e.games.current.data.player.dropLockAggregate += e.games.current.data.player.dropLockTimer;
  if (e.games.current.data.player.dropLockAggregate > 250) playerReset();
  e.games.current.data.player.isDropLocking = true;
  e.games.sfx("tetris/softHit");
};

const checkEnvironment: (recursive?: boolean, recursivePiece?: []) => void = (recursive?: boolean, recursivePiece?: []) => {
  e.games.current.data.game.matrix = Array(20)
    .fill(0)
    .map(() => Array(10).fill(0));

  e.games.current.data.piece.matrix.forEach((row: matrix[], y: number): void => {
    row.map((cell: number, x: number) =>
      e.games.current.data.game.matrix[y + e.games.current.data.piece.y - 1]
        ? (e.games.current.data.game.matrix[y + e.games.current.data.piece.y - 1][x + e.games.current.data.piece.x - 1] = cell)
        : cell,
    );
  });

  let collided: boolean = false;
  e.games.current.data.piece.matrix.forEach((row: matrix[], y: number): void => {
    row.forEach((cell: number, x: number): void => {
      if (e.games.current.data.piece.y + e.games.current.data.piece.matrix.length - 1 < 20 && e.games.current.data.game.droppedMatrix[y + e.games.current.data.piece.y]) {
        if (e.games.current.data.game.droppedMatrix[y + e.games.current.data.piece.y][x + e.games.current.data.piece.x - 1] && cell !== 0) {
          if (e.games.current.data.piece.y <= 0) endGame("Block Out!");
          if (e.games.current.data.player.dropLockTimer === 0 && !recursive) setupLock();
          if (recursive) playerReset();
          collided = true;
        }
      }
    });
  });
  if (!collided && e.games.current.data.piece.y + e.games.current.data.piece.matrix.length - 1 < 20) {
    e.games.current.data.player.dropLockTimer = 0;
    e.games.current.data.player.isDropLocking = false;
  }

  let rowsCleared: number = 0;
  e.games.current.data.game.droppedMatrix.forEach((row: matrix[], y: number): void => {
    if (row.filter((cell: number): boolean => cell === 0).length === 0) {
      rowsCleared++;
      e.games.current.data.game.droppedMatrix.splice(y, 1);
      e.games.current.data.game.droppedMatrix.unshift(Array(10).fill(0));
    }
  });
  if (rowsCleared > 0) {
    e.games.current.data.game.comboedThisRound = true;
    e.games.current.data.combo++;
    if (e.games.current.data.combo > 1) {
      if (e.games.current.data.combo === 4) e.achievements.set("3x-combo-tetris");
      e.games.current.data.effects.push({
        text: "Combo x" + (e.games.current.data.combo - 1),
        x: 85,
        y: 275,
        opacity: 1,
        size: 22,
      });
    }
    e.games.current.data.effects.push({
      text: clearTypeDict[rowsCleared as 1 | 2 | 3 | 4],
      x: 85,
      y: 250,
      opacity: 1,
      size: 32,
    });
    checkEnvironment();
  }
  e.games.current.data.player.score += dropScoreDict[rowsCleared as 0 | 1 | 2 | 3 | 4] * (e.games.current.data.player.level + 1);
  e.games.current.data.player.rowsCleared += rowsCleared;

  if (recursive) {
    e.games.current.data.piece.y++;
    e.games.current.data.player.score++;
    if (e.games.current.data.piece.y + e.games.current.data.piece.matrix.length - 1 < 20 && recursivePiece === e.games.current.data.piece.matrix) checkEnvironment(true, recursivePiece);
    else if (e.games.current.data.piece.y + e.games.current.data.piece.matrix.length - 1 >= 20) {
      if (e.games.current.data.player.dropLockTimer === 0) playerReset();
      checkEnvironment();
    }
  }
};

const updateMatrix: (matrix: number[][]) => void = (matrix: number[][]): void => {
  e.games.current.data.piece.matrix.forEach((row: matrix[], y: number): void => {
    row.map((cell: number, x: number) =>
      cell !== 0 && matrix[y + e.games.current.data.piece.y - 1] ? (matrix[y + e.games.current.data.piece.y - 1][x + e.games.current.data.piece.x - 1] = cell) : cell,
    );
  });
};

const refill: () => void = (): void => {
  e.games.current.data.game.bag = [
    [
      [1, 1, 0],
      [0, 1, 1],
    ],
    [
      [0, 2, 2],
      [2, 2, 0],
    ],
    [
      [3, 3],
      [3, 3],
    ],
    [
      [0, 4, 0],
      [4, 4, 4],
    ],
    [[5, 5, 5, 5]],
    [
      [6, 0],
      [6, 0],
      [6, 6],
    ],
    [
      [0, 7],
      [0, 7],
      [7, 7],
    ],
  ];
};

const gridDrawer: (direction: number, x: number, y: number) => void = (direction: number, x: number, y: number): void => {
  if (!e.games.ctx) return;

  const ctx: CanvasRenderingContext2D = e.games.ctx;
  ctx.beginPath();
  ctx.moveTo(x * 25 + direction, y * 25 + direction);
  ctx.lineTo(x * 25 + direction, y * 25 + 3 + direction);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x * 25 + direction, y * 25 + direction);
  ctx.lineTo(x * 25 + 3 + direction, y * 25 + direction);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x * 25 + direction, y * 25 + direction);
  ctx.lineTo(x * 25 - 3 + direction, y * 25 + direction);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x * 25 + direction, y * 25 + direction);
  ctx.lineTo(x * 25 + direction, y * 25 - 3 + direction);
  ctx.stroke();
};

const renderAssist: (variable: matrix[][], board?: boolean) => void = (variable: matrix[][], board?: boolean): void => {
  variable.forEach((row: matrix[], y: number): void => {
    row.forEach((cell: number, x: number): void => {
      if (!e.games.ctx) return;

      if (cell !== 0) {
        e.games.ctx.fillStyle = matrixDict[cell as 1 | 2 | 3 | 4 | 5 | 6 | 7];
        e.games.ctx.fillRect(x * 25, y * 25, 25, 25);
      } else if (board && e.storage.get("visual-effects")) {
        e.games.ctx.strokeStyle = e.storage.get("dark-mode") ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)";
        gridDrawer(25, x, y);
        gridDrawer(-25, x, y);
      }
    });
  });
};

const playerReset: (start?: boolean) => void = (start?: boolean): void => {
  e.games.current.data.player.dropLockAggregate = 0;
  if (!start) updateMatrix(e.games.current.data.game.droppedMatrix);
  if (!e.games.current.data.game.comboedThisRound) e.games.current.data.combo = 0;
  e.games.current.data.game.comboedThisRound = false;
  e.games.current.data.piece = {x: 5, y: -e.games.current.data.game.nextPiece.length + 1, matrix: e.games.current.data.game.nextPiece, heldThisPlay: false};
  nextPieceAssist();
  updateMatrix(e.games.current.data.game.matrix);

  if (start) return;
  let cleared: boolean = true;
  e.games.current.data.game.droppedMatrix.forEach((row: matrix[]): void => {
    row.map((cell: number) => (cell !== 0 ? (cleared = false) : cell));
  });
  if (cleared) {
    e.achievements.set("tetris-board-clear");
    e.games.current.data.effects.push({
      text: "Perfect Clear!",
      x: 85,
      y: 250,
      opacity: 1,
      size: 32,
    });
  }
};

const nextPieceAssist: () => void = (): void => {
  if (e.games.current.data.game.bag.length > 0) e.games.current.data.game.nextPiece = e.games.current.data.game.bag.splice((e.games.current.data.game.bag.length * Math.random()) | 0, 1)[0];
  else {
    refill();
    e.games.current.data.game.nextPiece = e.games.current.data.game.bag.splice((e.games.current.data.game.bag.length * Math.random()) | 0, 1)[0];
  }
};

const CLRCollision: (direction: number) => void = (direction: number): void => {
  let mayCollide: boolean = false;
  e.games.current.data.piece.matrix.forEach((row: matrix[], y: number): void => {
    row.forEach((cell: number, x: number): void => {
      if (e.games.current.data.game.droppedMatrix[y + e.games.current.data.piece.y - 1]) {
        let droppedCell: number = 0;
        direction !== 1
          ? (droppedCell = e.games.current.data.game.droppedMatrix[y + e.games.current.data.piece.y - 1][e.games.current.data.piece.x - 2 + x])
          : (droppedCell = e.games.current.data.game.droppedMatrix[y + e.games.current.data.piece.y - 1][e.games.current.data.piece.x + x]);
        if (cell !== 0 && droppedCell !== 0) mayCollide = true;
      }
    });
  });
  if (!mayCollide) {
    direction === 1 ? e.games.current.data.piece.x++ : e.games.current.data.piece.x--;
    checkEnvironment();
    e.games.current.data.cooldowns.move = Math.floor(5 / (e.games.current.data.player.timeMoving === 0 ? 0.7 : e.games.current.data.player.timeMoving * 0.5));
    e.games.current.data.player.timeMoving++;
  }
};

const Tetris: types.game = {
  name: "Tetris",
  id: "tetris",
  info: "Use the <kbd>[UP]</kbd>, <kbd>[DOWN]</kbd>, <kbd>[LEFT]</kbd> and <kbd>[RIGHT]</kbd> keys to move blocks, making them fit together neatly on the board. Save a piece for later with <kbd>[SECONDARY]</kbd>, fill up an entire row to destroy it!",
  functions: {
    start: (): void => {
      let matrix,
        droppedMatrix: matrix[][] = [];
      matrix = Array(20)
        .fill(0)
        .map((): matrix[] => Array(10).fill(0));
      droppedMatrix = Array(20)
        .fill(0)
        .map((): matrix[] => Array(10).fill(0));

      e.games.current.data = {
        game: {
          matrix: matrix,
          nextPiece: [],
          bag: [],
          droppedMatrix: droppedMatrix,
          comboedThisRound: false,
          frameCounter: 0,
        },
        piece: {
          x: 5,
          y: 1,
          matrix: [],
          heldThisPlay: false,
        },
        ghostPiece: {
          x: 5,
          y: 1,
        },
        player: {
          level: 1,
          score: 0,
          rowsCleared: 0,
          timeMoving: 0,
          isDropLocking: false,
          dropLockTimer: 0,
          dropLockAggregate: 0,
        },
        cooldowns: {
          move: 0,
          softDrop: 0,
          hardDrop: 0,
          rotate: 0,
        },
        effects: [],
        combo: 0,
      };

      if (e.storage.get("tetris-mode") === "Sprint") e.games.current.data.sprintTime = 10800;
      if (e.storage.get("tetris-mode") === "Ghost") {
        e.games.current.data.flashesLeft = 5;
        e.games.current.data.flashingTime = 0;
        e.games.current.data.cooldowns.flash = 0;
      }
      refill();
      e.games.current.data.game.nextPiece = e.games.current.data.game.bag.splice((e.games.current.data.game.bag.length * Math.random()) | 0, 1)[0];
      playerReset(true);
    },

    render: (_frame: number): void => {
      if (!e.games.ctx) return;

      const ctx: CanvasRenderingContext2D = e.games.ctx;
      const data: {[key: string]: any} = e.games.current.data;

      if (e.storage.get("tetris-mode") !== "Ghost" || data.flashingTime > 0) renderAssist(data.game.droppedMatrix, true);
      renderAssist(data.game.matrix);

      ctx.globalAlpha = 0.5;
      data.piece.matrix.forEach((row: matrix[], y: number): void => {
        row.forEach((cell: number, x: number): void => {
          if (cell !== 0) {
            ctx.fillStyle = matrixDict[cell as 1 | 2 | 3 | 4 | 5 | 6 | 7];
            if ((e.storage.get("tetris-mode") !== "Ghost" || data.flashingTime > 0) && !data.player.isDropLocking) {
              ctx.fillRect((x + data.ghostPiece.x - 1) * 25, (y + data.ghostPiece.y - 1) * 25, 25, 25);
            }
          }
        });
      });

      ctx.globalAlpha = 1;
      ctx.fillStyle = e.storage.get("dark-mode") ? "#222222" : "#f5f5f5";
      if (data.player.isDropLocking) {
        ctx.fillRect(10, 10, 230, 7);
        ctx.fillStyle = e.storage.get("dark-mode") ? "#ffffff" : "#000000";
        let lengthDivisor: number = 30 - data.player.level * 5 + 5;
        if (lengthDivisor < 0) lengthDivisor = 10;
        let length: number = 230 / (lengthDivisor / data.player.dropLockTimer);
        if (data.player.dropLockAggregate > 240) {
          ctx.fillStyle = "red";
          length = 230;
        }
        ctx.fillRect(10, 10, length, 7);
      }
      ctx.fillStyle = e.storage.get("dark-mode") ? "#222222" : "#f5f5f5";
      ctx.fillRect(250, 0, 125, 500);
      ctx.fillStyle = e.storage.get("dark-mode") ? "#ffffff" : "#000000";
      ctx.font = "16px roboto";
      ctx.fillText("Next Piece", 255, 70);
      data.game.nextPiece.forEach((row: matrix[], y: number): void => {
        row.forEach((cell: number, x: number): void => {
          if (cell !== 0) {
            ctx.fillStyle = matrixDict[cell as 1 | 2 | 3 | 4 | 5 | 6 | 7];
            ctx.fillRect(260 + x * 25, 80 + y * 25, 25, 25);
          }
        });
      });

      ctx.fillStyle = e.storage.get("dark-mode") ? "#ffffff" : "#000000";
      ctx.fillText("Held Piece: ", 255, 200);
      data.game.heldPiece
        ? data.game.heldPiece.forEach((row: matrix[], y: number): void => {
            row.forEach((cell: number, x: number): void => {
              if (cell !== 0) {
                ctx.fillStyle = matrixDict[cell as 1 | 2 | 3 | 4 | 5 | 6 | 7];
                ctx.fillRect(260 + x * 25, 210 + y * 25, 25, 25);
              }
            });
          })
        : ctx.fillText("None", 255, 218);
      ctx.fillStyle = e.storage.get("dark-mode") ? "#ffffff" : "#000000";
      ctx.fillText("Score: " + data.player.score, 255, 330);
      ctx.fillText("Level " + data.player.level, 255, 348);
      ctx.fillText("Rows: " + data.player.rowsCleared, 255, 366);
      if (data.sprintTime) ctx.fillText(Math.ceil(data.sprintTime / 60) + " seconds left", 255, 384);
      if (data.flashesLeft) ctx.fillText(data.flashesLeft + " flashes left", 255, 384);

      data.effects.forEach((effect: textEffect): void => {
        ctx.globalAlpha = effect.opacity;
        ctx.font = effect.size.toString() + "px roboto";
        ctx.fillText(effect.text, effect.x, effect.y);
      });
      ctx.globalAlpha = 1;
      e.games.current.data = data;
    },

    update: (time: number, delta: number): void => {
      const data: {[key: string]: any} = e.games.current.data;

      if (data.game.frameCounter > 0) data.game.frameCounter -= delta;
      data.ghostPiece = {x: data.piece.x, y: data.piece.y};
      let collided: boolean = false;
      for (let topY: number = 0; topY < 20; topY++) {
        if (!collided) data.ghostPiece.y++;
        for (let y: number = 0; y < data.piece.matrix.length; y++) {
          for (let x: number = 0; x < data.piece.matrix[y].length; x++) {
            if (data.game.droppedMatrix[data.ghostPiece.y + y] && data.piece.matrix[y][x] !== 0) {
              if (data.game.droppedMatrix[data.ghostPiece.y + y][data.ghostPiece.x + x - 1] !== 0) collided = true;
            } else if (!data.game.droppedMatrix[data.ghostPiece.y + y]) {
              if (data.ghostPiece.y === 20 - data.piece.matrix.length + 1) collided = true;
            }
          }
        }
      }

      let lastLevel: number = data.player.level;
      data.player.level = Math.floor(data.player.rowsCleared / 10) + 1;
      if (lastLevel !== data.player.level && e.storage.get("tetris-mode") === "Ghost") data.flashesLeft++;
      if (data.player.level === 10) e.achievements.set("tetris-level-10");
      if (data.player.level === 25) e.achievements.set("tetris-level-25");

      if (data.player.level === 15 && e.storage.get("tetris-mode") === "Ghost") e.achievements.set("tetris-level-15-ghost");
      if (data.flashingTime > 0 && e.storage.get("tetris-mode") === "Ghost") data.flashingTime--;

      if (data.player.dropLockTimer > 0) data.player.dropLockTimer--;
      if (data.player.dropLockTimer === 0 && data.player.isDropLocking) {
        data.player.isDropLocking = false;
        playerReset();
      }

      data.effects.forEach((effect: textEffect, index: number): void => {
        effect.opacity -= 0.01;
        effect.y -= delta;
        if (effect.opacity <= 0) data.effects.splice(index, 1);
      });

      if (data.sprintTime) data.sprintTime -= delta;
      if (data.sprintTime <= 0) endGame("Sprint Over!");

      for (const cooldown in data.cooldowns) {
        data.cooldowns[cooldown] > 0 ? (data.cooldowns[cooldown] -= delta) : (data.cooldowns[cooldown] = 0);
      }
      while (Math.round(data.game.frameCounter) <= 0 && !data.player.isDropLocking) {
        checkEnvironment();
        data.piece.y++;
        checkEnvironment();
        data.game.frameCounter += Math.ceil(65 / data.player.level);
      }

      if (e.games.keys.Down && data.piece.y + data.piece.matrix.length - 1 < 20 && data.cooldowns.softDrop === 0 && !data.player.isDropLocking) {
        data.piece.y++;
        checkEnvironment();
        data.cooldowns.softDrop = 2.5;
        data.player.score = data.player.score + 1;
        e.games.sfx("tetris/whoosh");
      }

      if (e.games.keys.Primary && data.cooldowns.hardDrop <= 0 && !data.player.isDropLocking) {
        checkEnvironment(true, data.piece.matrix);
        data.cooldowns.hardDrop = 20;
        e.games.sfx("tetris/hardDrop");
      } else if (e.games.keys.Primary && data.player.isDropLocking) {
        data.player.dropLockTimer = 0;
        data.player.isDropLocking = false;
        playerReset();
        data.cooldowns.hardDrop = 20;
      }

      if (e.games.keys["KeyF"] && e.storage.get("tetris-mode") === "Ghost" && data.flashesLeft > 0 && data.cooldowns.flash <= 0) {
        data.flashesLeft--;
        data.flashingTime = 300;
        data.cooldowns.flash = 50;
      }

      if (data.cooldowns.move <= 0) {
        if (e.games.keys.Left && data.piece.x > 1) CLRCollision(-1);
        else if (e.games.keys.Right && data.piece.x + data.piece.matrix[0].length - 1 < 10) CLRCollision(1);
        else data.player.timeMoving = 0;
      }
      if (e.games.keys.Up && data.cooldowns.rotate <= 0) {
        rotate(data.piece.matrix);
        data.cooldowns.rotate = 10;
        e.games.sfx("tetris/rotate");
        checkEnvironment();
      }

      if (e.games.keys.Secondary && !data.piece.heldThisPlay) {
        data.piece.heldThisPlay = true;
        if (data.game.heldPiece) {
          let tempHeldPiece: number = data.game.heldPiece;
          data.game.heldPiece = data.piece.matrix;
          data.piece.matrix = tempHeldPiece;
        } else {
          data.game.heldPiece = data.piece.matrix;
          data.piece.matrix = data.game.nextPiece;
          nextPieceAssist();
        }
        data.piece.x = 5;
        data.piece.y = 1;
        checkEnvironment();
      }

      if (data.piece.y + data.piece.matrix.length - 1 === 20) {
        checkEnvironment();
        if (data.player.dropLockTimer === 0) setupLock();
      }
      e.games.current.data = data;
    },
  },
  page: {
    width: 375,
    height: 500,
  },
  music: "tetris/music",
  options: [
    {
      name: "Mode",
      info: "Choose the Game Mode",
      id: "tetris-mode",
      type: "dropdown",
      default: "Normal",
      options: [
        {name: "Normal", id: "Normal"},
        {name: "Sprint", id: "Sprint"},
        {name: "Ghost", id: "Ghost"},
      ],
    },
  ],
};

export default Tetris;
