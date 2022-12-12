import e from "../assets/main";
import * as types from "../assets/types";

interface collide {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface star {
  x: number;
  y: number;
  radius: number;
}

interface explosion {
  x: number;
  y: number;
  cooldown: number;
}

interface laser {
  x: number;
  y: number;
}

const resetAliens: () => void = (): void => {
  const dir: "right" | "left" = Math.floor(Math.random() * 2) === 0 ? "right" : "left";
  let aliens: boolean[][] = [[], [], [], [], []];

  for (let i: number = 0; i < 5; i++) {
    for (let e: number = 0; e < 11; e++) {
      switch (i) {
        case 0:
          aliens[i].push(true);
          break;
        case 1:
        case 2:
          aliens[i].push(true);
          break;
        case 3:
        case 4:
          aliens[i].push(true);
          break;
      }
    }
  }

  e.games.current.data.aliens = {
    x: dir === "left" ? 117 : 0,
    y: 25 + e.games.current.data.game.wave * 10,
    dir: dir,
    lastDir: dir === "left" ? "right" : "left",
    data: aliens,
  };

  delete e.games.current.data.game.waveCooldown;
};

const SpaceInvaders: types.game = {
  name: "Space Invaders",
  id: "spaceinvaders",
  info: "Use <kbd>[LEFT]</kbd> and <kbd>[RIGHT]</kbd> to move your turret, press <kbd>[PRIMARY]</kbd> to fire. Fend off the invaders!",
  functions: {
    start: (): void => {
      let stars: star[] = [];
      for (let i: number = 0; i < 500 + Math.random() * 100; i++) stars.push({x: Math.random() * 500, y: Math.random() * 430, radius: Math.random() * 2});

      let shields: number[][][] = [];
      for (let i: number = 0; i < 4; i++) {
        shields.push([
          [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
          [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
          [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
          [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
          [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
          [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
          [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
          [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
          [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
          [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
          [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
          [1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1],
          [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1],
          [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1],
          [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1],
        ]);
      }

      e.games.current.data = {
        game: {
          lives: 5,
          score: 0,
          wave: 1,
          x: 225,
          dead: false,
          laser: {
            cooldown: 0,
            data: [],
          },
        },
        explosions: [],
        stars: stars,
        shields: shields,
        aliens: {},
        alienLasers: [],
      };

      resetAliens();
    },
    render: (frame: number): void => {
      if (!e.games.ctx) return;

      const ctx: CanvasRenderingContext2D = e.games.ctx;
      const data: {[key: string]: any} = e.games.current.data;

      const laserRender: (laser: laser) => void = (laser: laser): void => {
        if (!e.games.ctx) return;

        ctx.fillStyle = "#ff0000";
        ctx.fillRect(laser.x, laser.y, 4, 10);
      };

      ctx.fillStyle = "#121212";
      ctx.fillRect(0, 0, 500, 450);

      data.stars.forEach((star: star): void => {
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.closePath();
      });

      data.shields.forEach((shield: number[][], shieldNum: number): void => {
        shield.forEach((row: number[], y: number): void => {
          row.forEach((block: number, x: number): void => {
            if (block !== 1) return;

            ctx.fillStyle = "#00ff00";
            ctx.fillRect(52 + shieldNum * 112 + x * 3, 300 + y * 3, 3, 3);
          });
        });
      });

      data.explosions.forEach((explosion: explosion): void => {
        let texture: number[][] = [
          [0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0],
          [0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0],
          [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
          [0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0],
          [0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0],
        ];
        ctx.fillStyle = "#ff0000";
        ctx.fillRect(data.game.x, data.game.y, 2, 2);
        texture.forEach((row: number[], y: number): void => {
          row.forEach((block: number, x: number): void => {
            if (block !== 1) return;

            ctx.fillRect(Math.round(explosion.x) + x * 2, Math.round(explosion.y) + y * 2, 2, 2);
          });
        });
      });

      if (data.ufo) {
        ctx.fillStyle = "#ff0000";

        data.ufo.data.forEach((row: number[], y: number): void => {
          row.forEach((block: number, x: number): void => {
            if (block !== 1) return;

            ctx.fillRect(Math.round(data.ufo.x) + x * 2, 7 + y * 2, 2, 2);
          });
        });
      }

      data.aliens.data.forEach((row: boolean[], rowNum: number): void => {
        row.forEach((alien: boolean, alienNum: number): void => {
          if (!alien) return;

          let texture: number[][][] = [];
          switch (rowNum) {
            case 0:
              texture = [
                [
                  [0, 0, 0, 1, 1, 0, 0, 0],
                  [0, 0, 1, 1, 1, 1, 0, 0],
                  [0, 1, 1, 1, 1, 1, 1, 0],
                  [1, 1, 0, 1, 1, 0, 1, 1],
                  [1, 1, 1, 1, 1, 1, 1, 1],
                  [0, 0, 1, 0, 0, 1, 0, 0],
                  [0, 1, 0, 1, 1, 0, 1, 0],
                  [1, 0, 1, 0, 0, 1, 0, 1],
                ],
                [
                  [0, 0, 0, 1, 1, 0, 0, 0],
                  [0, 0, 1, 1, 1, 1, 0, 0],
                  [0, 1, 1, 1, 1, 1, 1, 0],
                  [1, 1, 0, 1, 1, 0, 1, 1],
                  [1, 1, 1, 1, 1, 1, 1, 1],
                  [0, 1, 0, 1, 1, 0, 1, 0],
                  [1, 0, 0, 0, 0, 0, 0, 1],
                  [0, 1, 0, 0, 0, 0, 1, 0],
                ],
              ];
              break;
            case 1:
            case 2:
              texture = [
                [
                  [0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0],
                  [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
                  [0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0],
                  [0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0],
                  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                  [1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1],
                  [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1],
                  [0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0],
                ],
                [
                  [0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0],
                  [1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1],
                  [1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1],
                  [1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1],
                  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                  [0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0],
                  [0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0],
                ],
              ];
              break;
            case 3:
            case 4:
              texture = [
                [
                  [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
                  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                  [1, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1],
                  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                  [0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0],
                  [0, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 0],
                  [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
                ],
                [
                  [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
                  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                  [1, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1],
                  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                  [0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0],
                  [0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0],
                  [0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0],
                ],
              ];
              break;
          }

          texture[frame % 30 >= 15 ? 0 : 1].forEach((row: number[], y: number): void => {
            row.forEach((block: number, x: number): void => {
              if (block !== 1) return;

              switch (rowNum) {
                case 0:
                  ctx.fillStyle = "#ff0000";
                  break;
                case 1:
                case 2:
                  ctx.fillStyle = "#00ff00";
                  break;
                case 3:
                case 4:
                  ctx.fillStyle = "#0000ff";
                  break;
              }

              ctx.fillRect(Math.round(data.aliens.x) + (rowNum === 0 ? 4 : rowNum < 3 ? 1 : 0) + alienNum * 36 + x * 2, Math.round(data.aliens.y) + rowNum * 24 + y * 2, 2, 2);
            });
          });
        });
      });

      data.alienLasers.forEach(laserRender);

      data.game.laser.data.forEach(laserRender);

      ctx.fillStyle = "#00ff00";
      ctx.fillRect(0, 428, 500, 22);
      if (!data.game.dead) {
        ctx.fillRect(data.game.x, 411, 50, 17);
        ctx.fillRect(22 + data.game.x, 405, 6, 6);
      }
    },
    update: (time: number, delta: number): void => {
      delta *= 1.5;

      const data: {[key: string]: any} = e.games.current.data;

      const collide: (a: collide, b: collide) => boolean = (a: collide, b: collide): boolean => a.x + a.width > b.x && a.x < b.x + b.width && a.y + a.height > b.y && a.y < b.y + b.height;
      const explosion: (x: number, y: number) => void = (x: number, y: number): void => {
        data.explosions.push({
          x: x,
          y: y,
          cooldown: 15,
        });
      };

      if (data.game.lives <= 0) {
        if (e.stats.get("spaceinvaders-highest-wave") < data.game.wave) e.stats.set("spaceinvaders-highest-wave", data.game.wave);
        if (e.stats.get("spaceinvaders-high-score") < data.game.score) e.stats.set("spaceinvaders-high-score", data.game.score);
        e.games.end({message: "Game Over!", score: {Score: data.game.score, Wave: data.game.wave}});
      }

      if (data.game.laser.cooldown > 0) data.game.laser.cooldown--;
      if (data.game.waveCooldown) data.game.waveCooldown--;
      if (data.game.deathCooldown) data.game.deathCooldown--;

      if (data.game.waveCooldown <= 0) resetAliens();
      if (data.game.deathCooldown <= 0) {
        delete data.game.deathCooldown;
        data.game.dead = false;
        data.game.x = 225;
        data.alienLasers = [];
      }

      if (e.games.keys.Left && data.game.x >= 5 && !data.game.dead) data.game.x -= 5 * delta;
      if (e.games.keys.Right && data.game.x <= 445 && !data.game.dead) data.game.x += 5 * delta;
      if (e.games.keys.Primary && data.game.laser.cooldown <= 0 && !data.game.dead) {
        data.game.laser.data.push({x: data.game.x + 23, y: 411});
        data.game.laser.cooldown = 20;
        e.games.sfx("spaceinvaders/shoot");
      }

      if (data.aliens.data.filter((row: boolean[]): boolean => row.filter((alien: boolean): boolean => alien).length > 0).length === 0 && !data.game.waveCooldown) {
        data.game.waveCooldown = 60;
        data.game.wave++;

        if (data.game.wave >= 10) e.achievements.set("spaceinvaders-wave-10");
        e.achievements.set("spaceinvaders-wave");
      }

      switch (data.aliens.dir) {
        case "right":
          data.aliens.x += delta / 2;
          break;
        case "left":
          data.aliens.x -= delta / 2;
          break;
        case "down":
          if ((Math.round(data.aliens.y) + (25 + data.game.wave * 10)) % 25 === 0) data.aliens.dir = data.aliens.lastDir === "right" ? "left" : "right";
          else data.aliens.y += delta / 2;
          break;
      }

      if (data.ufo) {
        if (data.ufo.dir === "left") {
          data.ufo.x -= delta;
          if (data.ufo.x > 500) delete data.ufo;
        } else {
          data.ufo.x += delta;
          if (data.ufo.x > 500) delete data.ufo;
        }
      } else if (Math.floor(Math.random() * (500 / delta)) === 0) {
        const dir = Math.floor(Math.random() * 2) === 0 ? "right" : "left";
        data.ufo = {
          dir: dir,
          x: dir === "right" ? -32 : 500,
          data: [
            [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
            [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
            [0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [0, 0, 1, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 0],
            [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
          ],
        };

        e.games.sfx("spaceinvaders/ufo");
      }

      data.alienLasers = data.alienLasers.map((laser: laser): laser => ({...laser, y: laser.y + 5 * delta})).filter((laser: laser): boolean => laser.y < 438);
      data.game.laser.data = data.game.laser.data.map((laser: laser): laser => ({...laser, y: laser.y - 5 * delta})).filter((laser: laser): boolean => laser.y > -10);

      data.explosions = data.explosions
        .filter((explosion: explosion): boolean => explosion.cooldown > 0)
        .map((explosion: explosion): explosion => ({...explosion, cooldown: explosion.cooldown - delta}));

      data.aliens.data.forEach((row: boolean[], rowNum: number): void => {
        row.forEach((alien: boolean, alienNum: number): void => {
          if (rowNum === 0 && alien && Math.floor(Math.random() * (120 / delta)) === 0 && !data.game.dead) {
            data.alienLasers.push({x: alienNum * 36 + data.aliens.x + 10, y: rowNum * 24 + data.aliens.y + 16});
          }

          data.alienLasers.forEach((laser: laser): void => {
            if (collide({x: laser.x, y: laser.y, width: 4, height: 10}, {x: data.game.x, y: 411, width: 50, height: 22}) && !data.game.dead) {
              data.alienLasers = data.alienLasers.filter((childLaser: laser): boolean => childLaser !== laser);
              data.game.deathCooldown = 30;
              data.game.dead = true;
              data.game.lives--;

              e.games.sfx("spaceinvaders/playerDie");
              explosion(data.game.x + 9, 410);
              if (data.aliens.data.filter((row: boolean[]): boolean => row.filter((alien: boolean): boolean => alien).length > 0).length === 1) {
                e.achievements.set("scpaceinvaders-1-alien");
              }
            }
          });

          if (data.aliens.dir !== "down") {
            if (
              alien &&
              ((collide(
                {
                  x: data.aliens.x + (rowNum === 0 ? 4 : rowNum < 3 ? 1 : 0) + alienNum * 36,
                  y: data.aliens.y + rowNum * 24,
                  width: rowNum === 0 ? 16 : rowNum < 3 ? 22 : 24,
                  height: 16,
                },
                {x: 500, y: 0, width: 1, height: 450},
              ) &&
                data.aliens.dir === "right") ||
                (collide(
                  {
                    x: data.aliens.x + (rowNum === 0 ? 4 : rowNum < 3 ? 1 : 0) + alienNum * 36,
                    y: data.aliens.y + rowNum * 24,
                    width: rowNum === 0 ? 16 : rowNum < 3 ? 22 : 24,
                    height: 16,
                  },
                  {x: 0, y: 0, width: 1, height: 450},
                ) &&
                  data.aliens.dir === "left"))
            ) {
              data.aliens.lastDir = data.aliens.dir;
              data.aliens.dir = "down";
              data.aliens.y += 1;
            }
          }
        });
      });

      data.shields.forEach((shield: number[][], shieldNum: number): void => {
        shield.forEach((row: number[], y: number): void => {
          row.forEach((block: number, x: number): void => {
            const lasercollide: (laser: laser, type: "player" | "alien") => void = (laser: laser, type: "player" | "alien"): void => {
              if (!collide({x: laser.x, y: laser.y, width: 4, height: 10}, {x: 52 + shieldNum * 112 + x * 3, y: 300 + y * 3, width: 3, height: 3}) || block !== 1) return;

              shield[y][x] = 0;

              if (type === "player") {
                data.game.laser.data = data.game.laser.data.filter((childLaser: laser): boolean => childLaser !== laser);
              } else {
                data.alienLasers = data.alienLasers.filter((childLaser: laser): boolean => childLaser !== laser);
              }

              if (y < 14 && Math.floor(Math.random() * 3) === 1) shield[y + 1][x] = 0;
              if (x > 0 && Math.floor(Math.random() * 3) === 1) shield[y][x - 1] = 0;
              if (x < 19 && Math.floor(Math.random() * 3) === 1) shield[y][x + 1] = 0;
              if (y > 0 && Math.floor(Math.random() * 3) === 1) shield[y - 1][x] = 0;
              if (y > 0 && x > 0 && Math.floor(Math.random() * 3) === 1) shield[y - 1][x - 1] = 0;
              if (y < 14 && x > 0 && Math.floor(Math.random() * 3) === 1) shield[y + 1][x - 1] = 0;
              if (y < 14 && x < 19 && Math.floor(Math.random() * 3) === 1) shield[y + 1][x + 1] = 0;
              if (y > 0 && x < 19 && Math.floor(Math.random() * 3) === 1) shield[y - 1][x + 1] = 0;
            };

            data.game.laser.data.forEach((laser: laser): void => lasercollide(laser, "player"));
            data.alienLasers.forEach((laser: laser): void => lasercollide(laser, "alien"));

            data.aliens.data.forEach((row: boolean[], rowNum: number): void => {
              row.forEach((alien: boolean, alienNum: number): void => {
                if (!alien || data.game.waveCooldown) return;

                if (
                  (block !== 1 &&
                    (collide(
                      {
                        x: data.aliens.x + (rowNum === 0 ? 4 : rowNum < 3 ? 1 : 0) + alienNum * 36,
                        y: data.aliens.y + rowNum * 24,
                        width: rowNum === 0 ? 16 : rowNum < 3 ? 22 : 24,
                        height: 16,
                      },
                      {x: 52 + shieldNum * 112 + x * 3, y: 300 + y * 3, width: 3, height: 3},
                    ) ||
                      collide(
                        {
                          x: data.aliens.x + (rowNum === 0 ? 4 : rowNum < 3 ? 1 : 0) + alienNum * 36,
                          y: data.aliens.y + rowNum * 24,
                          width: rowNum === 0 ? 16 : rowNum < 3 ? 22 : 24,
                          height: 16,
                        },
                        {x: data.game.x, y: 405, width: 50, height: 28},
                      ))) ||
                  (data.aliens.y + rowNum * 24 >= 412 && !data.game.dead)
                ) {
                  data.game.deathCooldown = 30;
                  data.game.dead = true;
                  data.game.lives--;

                  data.aliens.data = [[], [], [], [], []];
                  data.game.waveCooldown = 60;

                  explosion(data.game.x + 9, 410);
                  if (data.aliens.data.filter((row: boolean[]): boolean => row.filter((alien: boolean): boolean => alien).length > 0).length === 1) {
                    e.achievements.set("scpaceinvaders-1-alien");
                  }
                }
              });
            });
          });
        });
      });

      data.game.laser.data.forEach((laser: laser): void => {
        data.aliens.data.forEach((row: boolean[], rowNum: number): void => {
          row.forEach((alien: boolean, alienNum: number): void => {
            if (!alien) return;

            if (
              !collide(
                {x: laser.x, y: laser.y, width: 4, height: 10},
                {
                  x: data.aliens.x + (rowNum === 0 ? 4 : rowNum < 3 ? 1 : 0) + alienNum * 36,
                  y: data.aliens.y + rowNum * 24,
                  width: rowNum === 0 ? 16 : rowNum < 3 ? 22 : 24,
                  height: 16,
                },
              )
            )
              return;

            data.game.laser.data = data.game.laser.data.filter((childLaser: laser): boolean => childLaser !== laser);
            data.game.score += rowNum === 0 ? 30 : rowNum < 3 ? 20 : 10;
            row[alienNum] = false;

            e.games.sfx("spaceinvaders/alienDie");
            explosion(data.aliens.x - (rowNum === 0 ? 8 : rowNum < 3 ? 5 : 4) + alienNum * 36, data.aliens.y - 1 + rowNum * 24);
          });
        });

        if (!data.ufo) return;
        if (
          !collide(
            {x: laser.x, y: laser.y, width: 4, height: 10},
            {
              x: data.ufo.x,
              y: 7,
              width: 32,
              height: 14,
            },
          )
        )
          return;

        data.game.laser.data = data.game.laser.data.filter((childLaser: laser): boolean => childLaser !== laser);
        data.game.score += Math.floor(Math.random() * 3) * 50;

        explosion(data.ufo.x, 5);
        e.achievements.set("spaceinvaders-ufo");
        if (data.game.score >= 10000) e.achievements.set("spaceinvaders-10000");

        delete data.ufo;
      });

      e.games.setScoreboard({Lives: data.game.lives, Score: data.game.score, Wave: data.game.wave});
    },
  },
  page: {
    width: 500,
    height: 450,
  },
  music: "spaceinvaders/music",
};

export default SpaceInvaders;
