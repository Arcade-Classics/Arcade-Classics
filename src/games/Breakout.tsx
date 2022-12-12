import e from "../assets/main";
import * as types from "../assets/types";

const cubicEase: (currentProgress: number, start: number, distance: number, steps: number) => number = (currentProgress, start, distance, steps): number => {
  currentProgress /= steps / 2;
  if (currentProgress < 1) return (distance / 2) * Math.pow(currentProgress, 3) + start;
  currentProgress -= 2;
  return (distance / 2) * (Math.pow(currentProgress, 3) + 2) + start;
};

const makeLevel: (level: string[]) => void = (level: string[]): void => {
  for (let i in level) {
    let row: string = level[i];
    for (let j: number = 0; j < row.length; j++) {
      let tile: number = Number(row.charAt(j));
      if (tile !== 0) {
        e.games.current.data.bricks.push({
          x: ballSize * 2 * j,
          y: (i as unknown as number) * ballSize,
          width: ballSize * 2,
          height: ballSize,
          hits: tile,
        });
      }
    }
  }
};

interface Brick {
  x: number;
  y: number;
  width: number;
  height: number;
  hits: number;
}
interface AABB {
  x: number;
  y: number;
  dx: number;
  dy: number;
  width: number;
  height: number;
}
interface Particle {
  x: number;
  y: number;
  width: number;
  height: number;
  alpha: number;
}

const updateParticles: (particles: Particle[], ball: AABB) => void = (particles: Particle[], ball: AABB): void => {
  particles.forEach((particle: Particle, index: number): void => {
    particle.alpha -= 10 / (60 + Math.sqrt(ball.dx ** 2 + ball.dy ** 2));
    if (particle.alpha > 0) return;

    particles.splice(index, 1);
    index--;
  });
};

const AABBCollide: (a: AABB | Brick, b: AABB | Brick) => boolean = (a: AABB | Brick, b: AABB | Brick): boolean => {
  return a.x + a.width > b.x && a.x < b.x + b.width && a.y + a.height > b.y && a.y < b.y + b.height;
};

const ballSize = 15.625;

const levels: string[][] = [
  ["0000000000000000", "0000000000000000", "0000000000000000", "0000000000000000", "0000000000000000", "1111111111111111", "1111111111111111", "1111111111111111"],
  [
    "0000000000000000",
    "0000000000000000",
    "0000000000000000",
    "0000000000000000",
    "0000000000000000",
    "1100110011001100",
    "1100110011001100",
    "0011001100110011",
    "0011001100110011",
    "1100110011001100",
    "1100110011001100",
  ],
  [
    "0000000000000000",
    "0000000000000000",
    "0000000000000000",
    "0000000000000000",
    "0000000000000000",
    "0000001111000000",
    "0000011111100000",
    "0000011111100000",
    "0000011111100000",
    "0000011111100000",
    "0000011111100000",
    "0000001111000000",
  ],
  [
    "0000000000000000",
    "0000000000000000",
    "0000000000000000",
    "0000000000000000",
    "0000000000000000",
    "1111111111111111",
    "1000000000000001",
    "1000001111000001",
    "1001000000000001",
    "1011101111000001",
    "1001000000010101",
    "1000001111000001",
    "1111111111111111",
  ],
  [
    "0000000000000000",
    "0000000000000000",
    "0000000000000000",
    "0000000000000000",
    "0000000000000000",
    "1111111111111111",
    "0000000000000000",
    "1111111111111111",
    "0000000000000000",
    "1111111111111111",
    "0000000000000000",
    "1111111111111111",
  ],
  [
    "0000000000000000",
    "0000000000000000",
    "0000000000000000",
    "0000000000000000",
    "0000000000000000",
    "1111111111111111",
    "1000000000010001",
    "1011111111010111",
    "1000100001010001",
    "1010111101011101",
    "1010100001000001",
    "1010101100011101",
    "1110101111111111",
  ],
  [
    "0000000000000000",
    "0000000000000000",
    "0000000000000000",
    "0000000000000000",
    "0000000000000000",
    "0111000111001110",
    "1000101000010001",
    "1111101000000010",
    "1000101000000100",
    "1000101000001000",
    "1000100111011111",
  ],
  [
    "0000000000000000",
    "0000000000000000",
    "0000000000000000",
    "0000000000000000",
    "0000000000000000",
    "0000011111100000",
    "0000111111110000",
    "0001100000011000",
    "0001101001011000",
    "0001100000011000",
    "0001101001011000",
    "0001101111011000",
    "0001100000011000",
    "0000111111110000",
    "0000011111100000",
  ],
  [
    "0000000000000000",
    "0000000000000000",
    "0000000000000000",
    "0000000000000000",
    "0000000000000000",
    "1111000011110000",
    "1111000011110000",
    "1111000011110000",
    "1111000011110000",
    "0000111100001111",
    "0000111100001111",
    "0000111100001111",
    "0000111100001111",
  ],
  [
    "0000000000000000",
    "0000000000000000",
    "0000000000000000",
    "0000000000000000",
    "0000000000000000",
    "0000000000011100",
    "0000000000100010",
    "0222201010000100",
    "0222200100001000",
    "0222201010010000",
    "0000000000111110",
  ],
  [
    "0000000000000000",
    "0000000000000000",
    "0000000000000000",
    "0000000000000000",
    "0000000000000000",
    "2120212021202120",
    "1202120212021202",
    "2021202120212021",
    "0212021202120212",
    "2120212021202120",
    "1202120212021202",
  ],
  [
    "0000000000000000",
    "0000000000000000",
    "0000000220000000",
    "0000002222000000",
    "0000022002200000",
    "0000220000220000",
    "0002200000022000",
    "0002220000222000",
    "0002222002222000",
    "0002202222022000",
    "0002200220022000",
    "0002200220022000",
    "0000220220220000",
    "0000022222200000",
    "0000002222000000",
    "0000000220000000",
  ],
  [
    "0000000000000000",
    "0000000000000000",
    "0000000000000000",
    "0000000000000000",
    "0000000000000000",
    "0000002222000000",
    "0000022222200000",
    "0000222222220000",
    "0002222222000000",
    "0002222200000000",
    "0002222200000000",
    "0002222222000000",
    "0000222222220000",
    "0000022222200000",
    "0000002222000000",
  ],
  [
    "0000000000000000",
    "0000000000000000",
    "0000000000000000",
    "0000000000000000",
    "0000000000000000",
    "0000200000020000",
    "0000020000200000",
    "0000222222220000",
    "0002202222022000",
    "0022222222222200",
    "0020222222220200",
    "0020200000020200",
    "0000022002200000",
  ],
  [
    "0000000000000000",
    "0000000000000000",
    "0000000000000000",
    "0000000000000000",
    "0000000000000000",
    "2222222222222222",
    "2222222222222222",
    "2222222222222222",
    "2222222222222222",
    "2222222222222222",
    "2222222222222222",
  ],
  [
    "0000000000000000",
    "0000000000000000",
    "0000000000000000",
    "0000000000000000",
    "0000000000000000",
    "0000000000000000",
    "0000330000000000",
    "0000003003030000",
    "0000330000300000",
    "0000003003030000",
    "0000330000000000",
    "0000000000000000",
  ],
  [
    "0000000000000000",
    "0000000000000000",
    "0000000000000000",
    "0000000000000000",
    "0000000000000000",
    "3030303030303030",
    "0000000000000000",
    "3030303030303030",
    "0000000000000000",
    "3030303030303030",
    "0000000000000000",
    "3030303030303030",
  ],
  [
    "0000000000000000",
    "0000000000000000",
    "0000000000000000",
    "0000000000000000",
    "0000000000000000",
    "3030303030303030",
    "0303030303030303",
    "3030303030303030",
    "0303030303030303",
    "3030303030303030",
    "0303030303030303",
    "3030303030303030",
  ],
  [
    "0000000000000000",
    "0000000000000000",
    "0000000000000000",
    "0000000000000000",
    "0000000000000000",
    "3012210233100222",
    "3311232203321212",
    "2022332311131201",
    "1333123201020203",
    "1300002211131201",
  ],
  [
    "0000000000000000",
    "0000000000000000",
    "0000000000000000",
    "0000000000000000",
    "0000000000000000",
    "3333333333333333",
    "3333333333333333",
    "3333333333333333",
    "3333333333333333",
    "3333333333333333",
    "3333333333333333",
    "3333333333333333",
    "3333333333333333",
  ],
];
const colors: {[key: string]: {[key: number]: string}} = {
  normal: ["#ff0000", "#ff6100", "#ffbf00", "#ddff00", "#7fff00", "#1dff00", "#00ff3f", "#00ffa1", "#00ffff", "#009dff", "#003fff", "#2200ff", "#7f00ff", "#e100ff", "#ff0094", "#ff0000"],
  dark: ["#cf0000", "#cf3100", "#cf8f00", "#adcf00", "#4fcf00", "#00cf00", "#00cf0f", "#00cf71", "#00cfcf", "#004dcf", "#000fcf", "#0000cf", "#4f00cf", "#b100cf", "#cf0064", "#cf0000"],
};

const Breakout: types.game = {
  name: "Breakout",
  id: "breakout",
  info: "Use <kbd>[LEFT]</kbd> and <kbd>[RIGHT]</kbd> to move the paddle into the ball, aim for the fortress and don't let it fall! Press <kbd>[PRIMARY]</kbd> to serve the ball.",
  functions: {
    start: (): void => {
      e.games.current.data = {
        game: {
          score: 0,
          lives: 5,
          level: 1,
          serveTimer: 0,
        },
        bricks: [],
        particles: [],
        ball: {
          x: 203.125 + 93.75 / 2 - 15.625 / 2,
          y: 327.375 - (15.625 * 5) / 4,
          dx: 0,
          dy: 0,
          width: ballSize,
          height: ballSize,
          lastHit: -1,
        },
        paddle: {
          x: 203.125,
          y: 327.375,
          dx: 0,
          width: ballSize * 6,
          height: ballSize,
        },
      };
      makeLevel(levels[0]);
    },
    render: (_frame: number): void => {
      if (!e.games.ctx) return;

      const bricks: Brick[] = e.games.current.data.bricks;
      const ctx: CanvasRenderingContext2D = e.games.ctx;
      const data: {[key: string]: any} = e.games.current.data;

      ctx.fillStyle = e.storage.get("dark-mode") ? "white" : "black";

      ctx.fillRect(data.ball.x, data.ball.y, data.ball.width, data.ball.height);
      ctx.fillRect(data.paddle.x, data.paddle.y, data.paddle.width, data.paddle.height);

      bricks.forEach((b: Brick): void => {
        switch (b.hits) {
          case 1:
            ctx.fillStyle = colors.normal[Math.round(b.x / (ballSize * 2))];
            ctx.fillRect(b.x, b.y, b.width, b.height);
            break;
          case 2:
            ctx.fillStyle = colors.normal[Math.round(b.x / (ballSize * 2))];
            ctx.fillRect(b.x, b.y, b.width, b.height);
            ctx.fillStyle = colors.dark[Math.round(b.x / (ballSize * 2))];
            ctx.fillRect(b.x + b.height / 8, b.y + b.height / 8, b.width - (b.height * 1) / 4, (b.height * 3) / 4);
            break;
          case 3:
            ctx.fillStyle = colors.normal[Math.round(b.x / (ballSize * 2))];
            ctx.fillRect(b.x, b.y, b.width, b.height);
            ctx.fillStyle = colors.dark[Math.round(b.x / (ballSize * 2))];
            ctx.fillRect(b.x + b.height / 8, b.y + b.height / 8, b.width - (b.height * 1) / 4, (b.height * 3) / 4);
            ctx.fillStyle = colors.normal[Math.round(b.x / (ballSize * 2))];
            ctx.fillRect(b.x + b.height / 4, b.y + b.height / 4, b.width - (b.height * 1) / 2, (b.height * 1) / 2);
            break;
        }
      });

      ctx.fillStyle = e.storage.get("dark-mode") ? "white" : "black";

      if (e.storage.get("visual-effects")) {
        let oldAlpha: number = ctx.globalAlpha;
        data.particles.forEach((particle: Particle): void => {
          ctx.globalAlpha = particle.alpha;
          ctx.fillRect(particle.x, particle.y, particle.width, particle.height);
        });

        ctx.globalAlpha = oldAlpha;
      }
    },
    update: (time: number, delta: number): void => {
      const data: {[key: string]: any} = e.games.current.data;
      const ball: {
        x: number;
        y: number;
        dx: number;
        dy: number;
        width: number;
        height: number;
        lastHit: number;
        lastX: number;
        lastY: number;
      } = data.ball;
      const paddle: AABB = data.paddle;

      paddle.dx = 0;

      if (data.game.score >= 10000) e.achievements.set("breakout-10k-points");
      if (data.game.score >= 100000) e.achievements.set("breakout-100k-points");
      if (data.game.level >= 2) e.achievements.set("breakout-beat-level");
      if (data.game.level >= 10) e.achievements.set("breakout-level-10");

      if (e.games.keys.Left) {
        paddle.x -= 9 * delta;
        paddle.dx -= 9 * delta;
        if (paddle.x <= 0) paddle.x = 0;
      }
      if (e.games.keys.Right) {
        paddle.x += 9 * delta;
        paddle.dx += 9 * delta;
        if (paddle.x >= 500 - paddle.width) paddle.x = 500 - paddle.width;
      }

      if (data.game.serveTimer > 0) {
        if (data.game.lives !== 0) {
          const targetX: number = paddle.x + 93.75 / 2 - 15.625 / 2;
          const targetY: number = 327.375 - (15.625 * 5) / 4;
          ball.x = cubicEase(0.5 - data.game.serveTimer, ball.lastX, targetX - ball.lastX, 0.5);
          ball.y = cubicEase(0.5 - data.game.serveTimer, ball.lastY, targetY - ball.lastY, 0.5);
          ball.dx = 0;
          ball.dy = 0;
          if (data.game.serveTimer > 0 && data.bricks.length <= 0) {
            data.game.score += 17;
            if (time % 3 === 0) {
              data.game.score--;
              e.games.sfx("pong/hit");
            }
          }
        }
        data.game.serveTimer -= delta / 60;
      } else if (data.game.serveTimer <= 0 && Math.round(data.game.serveTimer) !== -1) {
        if (data.bricks.length <= 0) {
          if (data.game.level >= levels.length) makeLevel(levels[Math.floor(Math.random() * levels.length)]);
          else makeLevel(levels[data.game.level]);

          data.game.level++;
          data.game.lives++;
        }
        if (data.game.lives <= 0) {
          if (e.stats.get("breakout-high-score") < data.game.score) e.stats.set("breakout-high-score", data.game.score);
          if (e.stats.get("breakout-highest-level") < data.game.level) e.stats.set("breakout-highest-level", data.game.level);
          e.games.end({message: "Game Over", score: {Score: data.game.score, Level: data.game.level}});
        }
        ball.x = paddle.x + 93.75 / 2 - 15.625 / 2;
        ball.y = paddle.y - (15.625 * 5) / 4;
        ball.dx = 0;
        ball.dy = 0;
        data.game.serveTimer = 0;
        if (e.games.keys.Primary) {
          data.game.serveTimer = -1;
          ball.dx = (paddle.dx * 2) / 3;
          if (ball.dx === 0) ball.dx = Math.random() < 0.5 ? -6 : 6;
          ball.dy = -3;
        }
      } else {
        ball.x += ball.dx * delta;
        ball.y += ball.dy * delta;

        const bricks: Brick[] = data.bricks;

        if (bricks.length <= 0) {
          data.game.serveTimer = 0.5;
          ball.lastX = ball.x;
          ball.lastY = ball.y;
        }
        let cornerProgress: number = 0;
        if (ball.y < 0 && ball.dy < 0) {
          ball.y = -ball.y;
          ball.dy = -ball.dy;
          e.games.sfx("pong/hit");
          cornerProgress++;
        } else if (AABBCollide(ball, paddle)) {
          if (ball.y - ball.dy > paddle.y - 15.625 && Math.abs(ball.dx) < paddle.width) {
            ball.dx *= Math.sign(ball.dx);
            ball.dx *= ball.x < paddle.x + 93.75 / 2 ? -1 : 1;
            ball.x = paddle.x + (ball.x < paddle.x + 93.75 / 2 ? -15.625 : 93.75);
            ball.dx += (1 * paddle.dx) / 4;
          } else {
            ball.y = paddle.y - 15.625;
            ball.dy *= -1;
            ball.dx += (1 * paddle.dx) / 4;
          }

          e.games.sfx("pong/hit");
        } else if (ball.y > 375 && ball.dy > 0) {
          data.game.serveTimer = 0.5;
          ball.lastX = ball.x;
          ball.lastY = ball.y;
          data.game.lives = data.game.lives - 1;
          e.games.sfx("pong/win");
        }
        if (ball.x < 0 && ball.dx < 0) {
          ball.x = -ball.x;
          ball.dx = -ball.dx;
          e.games.sfx("pong/hit");
          cornerProgress++;
        } else if (ball.x > 500 - ball.width && ball.dx > 0) {
          ball.x -= 500 - ball.width;
          ball.x = -ball.x;
          ball.x += 500 - ball.width;
          ball.dx = -ball.dx;
          e.games.sfx("pong/hit");
          cornerProgress++;
        }
        if (cornerProgress >= 2) e.achievements.set("breakout-hit-the-corner");
      }

      if (e.storage.get("visual-effects")) {
        updateParticles(e.games.current.data.particles, ball);

        if (Math.sqrt(ball.dx ** 2 + ball.dy ** 2) >= 3.5 * 3) {
          let divfactor: number = Math.sqrt(ball.dx ** 2 + ball.dy ** 2) / 15.625;
          for (let i: number = 0; i < divfactor; i += 0.25) {
            let tempYPos: number = ball.y - (ball.dy * i) / divfactor;
            if (tempYPos < -15.625) {
              tempYPos += 15.625;
              tempYPos = -tempYPos;
              tempYPos -= 15.625;
            }
            e.games.current.data.particles.push({
              x: ball.x - (ball.dx * i) / divfactor,
              y: tempYPos,
              width: 15.625,
              height: 15.625,
              alpha: 0.5,
            });
          }
        }
      }

      let oldLastHit: number = ball.lastHit;
      ball.lastHit = -1;

      const bricks: Brick[] = data.bricks;
      for (let brick of bricks) {
        let xPart: number = ball.x - ball.dx + ball.width / 2 - brick.x - brick.width / 2;
        let yPart: number = ball.y - ball.dy + ball.height / 2 - brick.y - brick.height / 2;

        let length: number = Math.sqrt(xPart ** 2 + yPart ** 2);
        xPart /= length;
        yPart /= length;

        let angle: number = (Math.acos(yPart) / Math.PI) * 180;

        if (ball.x + 16 > brick.x && ball.x < brick.x + brick.width && ball.y + 16 > brick.y && ball.y < brick.y + brick.height) {
          e.games.sfx("pong/hit");

          if (((angle >= 60 && angle <= 120) || (angle >= 240 && angle <= 300)) && (oldLastHit === 1 || oldLastHit === -1)) {
            ball.dx *= -1;
            ball.lastHit = 0;
          } else {
            ball.dy *= -1;
            ball.lastHit = 1;
          }
          brick.hits--;
          if (brick.hits === 0) bricks.splice(bricks.indexOf(brick), 1);
          data.game.score += 9 + data.game.level;
          break;
        }
      }
      e.games.setScoreboard({
        Score: Math.round(data.game.score),
        Level: data.game.level,
        Lives: data.game.lives,
      });
    },
  },
  page: {
    width: 500,
    height: 375,
  },
};

export default Breakout;
