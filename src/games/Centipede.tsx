import e from "../assets/main";
import * as types from "../assets/types";

interface Mushroom {
  x: number;
  y: number;
  hp: number;
}

interface Player {
  x: number;
  y: number;
  score: number;
  lives: number;
}

interface Shot {
  x: number;
  y: number;
}

interface Flea {
  x: number;
  y: number;
  dir: "left" | "right";
}

const shrooms = [
  [
    ["-", "-", "X", "X", "X", "X", "-", "-"],
    ["-", "X", "O", "O", "O", "O", "X", "-"],
    ["-", "O", "-", "O", "O", "-", "O", "-"],
    ["-", "-", "-", "O", "-", "-", "O", "-"],
    ["-", "-", "-", "-", "-", "-", "-", "-"],
    ["-", "-", "-", "-", "-", "-", "-", "-"],
    ["-", "-", "-", "-", "-", "-", "-", "-"],
    ["-", "-", "-", "-", "-", "-", "-", "-"],
  ],
  [
    ["-", "-", "X", "X", "X", "X", "-", "-"],
    ["-", "X", "O", "O", "O", "O", "X", "-"],
    ["X", "O", "O", "O", "O", "O", "O", "X"],
    ["X", "O", "-", "O", "-", "-", "O", "X"],
    ["X", "-", "X", "-", "X", "-", "-", "X"],
    ["-", "-", "-", "-", "-", "X", "-", "-"],
    ["-", "-", "-", "-", "-", "-", "-", "-"],
    ["-", "-", "-", "-", "-", "-", "-", "-"],
  ],
  [
    ["-", "-", "X", "X", "X", "X", "-", "-"],
    ["-", "X", "O", "O", "O", "O", "X", "-"],
    ["X", "O", "O", "O", "O", "O", "O", "X"],
    ["X", "O", "O", "O", "O", "O", "O", "X"],
    ["X", "X", "X", "X", "X", "X", "X", "X"],
    ["-", "-", "X", "O", "-", "X", "-", "-"],
    ["-", "-", "X", "-", "O", "-", "-", "-"],
    ["-", "-", "-", "-", "-", "-", "-", "-"],
  ],
  [
    ["-", "-", "X", "X", "X", "X", "-", "-"],
    ["-", "X", "O", "O", "O", "O", "X", "-"],
    ["X", "O", "O", "O", "O", "O", "O", "X"],
    ["X", "O", "O", "O", "O", "O", "O", "X"],
    ["X", "X", "X", "X", "X", "X", "X", "X"],
    ["-", "-", "X", "O", "O", "X", "-", "-"],
    ["-", "-", "X", "O", "O", "X", "-", "-"],
    ["-", "-", "X", "X", "X", "X", "-", "-"],
  ],
];

const playerTexture = [
  ["-", "-", "-", "X", "-", "-", "-"],
  ["-", "-", "-", "X", "-", "-", "-"],
  ["-", "-", "-", "O", "-", "-", "-"],
  ["-", "-", "O", "O", "O", "-", "-"],
  ["-", "X", "X", "O", "X", "X", "-"],
  ["O", "X", "X", "O", "X", "X", "O"],
  ["O", "O", "O", "O", "O", "O", "O"],
  ["-", "O", "O", "O", "O", "O", "-"],
  ["-", "-", "O", "O", "O", "-", "-"],
  ["-", "-", "O", "O", "O", "-", "-"],
];

const fleaTexture = [
  [
    ["-", "-", "-", "X", "X", "X", "-", "-", "-"],
    ["-", "-", "B", "X", "X", "X", "X", "-", "-"],
    ["-", "B", "B", "X", "X", "X", "X", "X", "-"],
    ["X", "X", "X", "X", "X", "X", "X", "X", "X"],
    ["X", "X", "X", "R", "-", "R", "X", "X", "X"],
    ["-", "-", "-", "R", "-", "R", "-", "X", "X"],
    ["-", "-", "-", "R", "-", "R", "-", "R", "-"],
    ["-", "-", "R", "-", "R", "-", "-", "-", "R"],
  ],
  [
    ["-", "-", "-", "X", "X", "X", "-", "-", "-"],
    ["-", "-", "B", "X", "X", "X", "X", "-", "-"],
    ["-", "B", "B", "X", "X", "X", "X", "X", "-"],
    ["X", "X", "X", "X", "X", "X", "X", "X", "X"],
    ["X", "X", "X", "-", "R", "-", "X", "X", "X"],
    ["-", "-", "-", "R", "-", "R", "-", "X", "X"],
    ["-", "-", "-", "R", "-", "-", "R", "-", "R"],
    ["-", "-", "-", "-", "R", "-", "-", "R", "-"],
  ],
];

const Centipede: types.game = {
  name: "Centipede",
  id: "centipede",
  info: "Beware the killer centipede and his minions, use <kbd>[UP]</kbd>, <kbd>[DOWN]</kbd>, <kbd>[LEFT]</kbd> and <kbd>[RIGHT]</kbd> to fly your spaceship. Fire with <kbd>[SPACE]</kbd> and be careful - it has a trick up it's sleeve!",
  functions: {
    start: (): void => {
      e.games.current.data = {
        mushrooms: [],
        player: {
          x: 250 - 21 / 2,
          y: 420,
          score: 0,
          lives: 5,
        },
        shots: [],
        shotCooldown: 10,
        fleas: [],
      };
      for (let i: number = 32; i <= 416; i += 64) {
        for (let j: number = 0; j <= 4; j++) {
          e.games.current.data.mushrooms.push({
            x: ((Math.random() + j) * (500 - 16)) / 5,
            y: i + Math.random() * 64,
            hp: 3,
          });
        }
      }
    },
    render: (frame: number): void => {
      if (!e.games.ctx) return;
      e.games.ctx.fillStyle = "#1a1a1a";
      e.games.ctx.fillRect(0, 350, 500, 150);
      e.games.current.data.mushrooms.forEach((mushroom: Mushroom): void => {
        if (!e.games.ctx) return;
        const texture: string[][] = shrooms[mushroom.hp];
        texture.forEach((row: string[], y: number): void => {
          row.forEach((cell: string, x: number): void => {
            if (!e.games.ctx || cell === "-") return;
            e.games.ctx.fillStyle = cell === "X" ? "#FF0000" : "#00FF00";
            e.games.ctx.fillRect(Math.round(mushroom.x + x * 2), Math.round(mushroom.y + y * 2), 2, 2);
          });
        });
      });
      const player = e.games.current.data.player;
      playerTexture.forEach((row: string[], y: number): void => {
        row.forEach((cell: string, x: number): void => {
          if (!e.games.ctx || cell === "-") return;
          e.games.ctx.fillStyle = cell === "X" ? "#FF0000" : "#FFFFFF";
          e.games.ctx.fillRect(Math.round(player.x + x * 3), Math.round(player.y + y * 3), 3, 3);
        });
      });
      e.games.current.data.shots.forEach((shot: Shot): void => {
        if (!e.games.ctx) return;
        e.games.ctx.fillStyle = "#FF0000";
        e.games.ctx.fillRect(Math.round(shot.x), Math.round(shot.y), 4, 8);
      });
      e.games.current.data.fleas.forEach((flea: Flea): void => {
        if (!e.games.ctx) return;
        fleaTexture[Math.round(frame / 30) % 2].forEach((row: string[], y: number): void => {
          (flea.dir === "right" ? row.reverse() : row).forEach((cell: string, x: number): void => {
            if (!e.games.ctx || cell === "-") return;
            e.games.ctx.fillStyle = cell === "X" ? "#FFFF00" : cell === "B" ? "#0000FF" : "#FF0000";
            e.games.ctx.fillRect(Math.round(flea.x + x * 2), Math.round(flea.y + y * 2), 2, 2);
          });
        });
      });
    },
    update: (_time: number): void => {
      let totalMoveX: number = 0;
      let totalMoveY: number = 0;
      if (e.games.keys.Left) totalMoveX -= 6;
      if (e.games.keys.Right) totalMoveX += 4;
      if (e.games.keys.Up) totalMoveY -= 4;
      if (e.games.keys.Down) totalMoveY += 4;
      e.games.current.data.player.x += totalMoveX;
      if (
        !e.games.current.data.mushrooms
          .map(
            (mushroom: Mushroom) =>
              e.games.current.data.player.x < mushroom.x + 16 &&
              e.games.current.data.player.x + 21 > mushroom.x &&
              e.games.current.data.player.y < mushroom.y + 16 &&
              e.games.current.data.player.y + 21 > mushroom.y,
          )
          .every((isColliding: boolean) => !isColliding)
      ) {
        e.games.current.data.player.x -= totalMoveX;
      }
      e.games.current.data.player.y += totalMoveY;
      if (
        !e.games.current.data.mushrooms
          .map(
            (mushroom: Mushroom) =>
              e.games.current.data.player.x < mushroom.x + 16 &&
              e.games.current.data.player.x + 21 > mushroom.x &&
              e.games.current.data.player.y < mushroom.y + 16 &&
              e.games.current.data.player.y + 30 > mushroom.y,
          )
          .every((isColliding: boolean) => !isColliding)
      ) {
        e.games.current.data.player.y -= totalMoveY;
      }
      if (e.games.current.data.player.x <= 0) {
        e.games.current.data.player.x = 0;
      }
      if (e.games.current.data.player.x >= 500 - 21) {
        e.games.current.data.player.x = 500 - 21;
      }
      if (e.games.current.data.player.y <= 350) {
        e.games.current.data.player.y = 350;
      }
      if (e.games.current.data.player.y >= 500 - 30) {
        e.games.current.data.player.y = 500 - 30;
      }

      e.games.current.data.shots.forEach((shot: Shot, index: number): void => {
        if (!e.games.ctx) return;
        shot.y -= 4;
        if (shot.y <= -4) e.games.current.data.shots.splice(index, 1);
        e.games.current.data.mushrooms.forEach((shroom: Mushroom, shroomIndex: number): void => {
          if (shot.x < shroom.x + 16 && shot.x + 4 > shroom.x && shot.y < shroom.y + 16 && shot.y + 8 > shroom.y) {
            e.games.current.data.shots.splice(index, 1);
            shroom.hp--;
            if (shroom.hp < 0) e.games.current.data.mushrooms.splice(shroomIndex, 1);
          }
        });
      });

      if (e.games.keys.Primary && e.games.current.data.shotCooldown <= 0) {
        e.games.current.data.shots.push({
          x: e.games.current.data.player.x + 21 / 2 - 2,
          y: e.games.current.data.player.y + 4,
        });
        e.games.current.data.shotCooldown = 21;
        e.games.sfx("asteroids/shoot"); // sfx is temp lol
      } else {
        e.games.current.data.shotCooldown--;
        if (!e.games.keys.Primary) e.games.current.data.shotCooldown -= 9;
      }

      if (Math.floor(Math.random() * 420) <= 4) {
        e.games.current.data.fleas.push({
          x: Math.random() * (500 - 16),
          y: -16,
        });
      }
      e.games.current.data.fleas.forEach((flea: Flea, index: number): void => {
        flea.y += 3;
        if (flea.y >= 500) {
          e.games.current.data.fleas.splice(index, 1);
        }
        if (Math.floor(Math.random() * 420) <= 3) {
          e.games.current.data.mushrooms.push({
            ...flea,
            hp: 3,
          });
        }
        e.games.current.data.shots.forEach((shot: Shot, shotIndex: number): void => {
          if (shot.x < flea.x + 16 && shot.x + 4 > flea.x && shot.y < flea.y + 16 && shot.y + 8 > flea.y) {
            e.games.current.data.shots.splice(shotIndex, 1);
            e.games.current.data.fleas.splice(index, 1);
          }
        });
      });
      e.games.setScoreboard({Score: e.games.current.data.player.score, Lives: e.games.current.data.player.lives});
    },
  },
  page: {
    width: 500,
    height: 500,
  },
};

export default Centipede;
