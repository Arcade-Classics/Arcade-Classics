import e from "../assets/main";
import * as types from "../assets/types";

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

const AABBCollide: (a: AABB, b: AABB) => boolean = (a: AABB, b: AABB): boolean => a.x + a.width > b.x && a.x < b.x + b.width && a.y + a.height > b.y && a.y < b.y + b.height;

const pongAI: (ball: AABB, paddle: AABB, aiSpeed: number, ballVelEffect: number) => void = (ball: AABB, paddle: AABB, aiSpeed: number, ballVelEffect: number): void => {
  let yDiff: number = ball.y - paddle.y - paddle.height / 2;

  if (ball.y < -100) yDiff = 230 - paddle.y - paddle.height / 2;
  if (yDiff < -aiSpeed) {
    paddle.y -= aiSpeed;
    paddle.dy = -aiSpeed * ballVelEffect;
  } else if (yDiff >= -aiSpeed && yDiff < aiSpeed) {
    paddle.y += yDiff;
    paddle.dy = yDiff * ballVelEffect;
  } else {
    paddle.y += aiSpeed;
    paddle.dy = aiSpeed * ballVelEffect;
  }
};

const updateParticles: (particles: Particle[], ball: AABB) => void = (particles: Particle[], ball: AABB): void => {
  particles.forEach((particle: Particle, index: number): void => {
    particle.alpha -= 10 / (60 + Math.sqrt(ball.dx ** 2 + ball.dy ** 2));
    if (particle.alpha > 0) return;

    particles.splice(index, 1);
    index--;
  });
};

const Pong: types.game = {
  name: "Pong",
  id: "pong",
  info: "Use <kbd>[UP]</kbd> and <kbd>[DOWN]</kbd> to move the paddle to hit the ball past your opponent.",
  functions: {
    start: (): void => {
      e.games.current.data = {
        game: {
          lScore: 0,
          rScore: 0,
          serveTimer: 0,
        },
        ball: {
          x: 0,
          y: 0,
          dx: 0,
          dy: 0,
          width: 15.625,
          height: 15.625,
        },
        lPaddle: {
          x: 31.25,
          y: 140.625,
          dy: 0,
          width: 15.625,
          height: 93.75,
        },
        rPaddle: {
          x: 453.125,
          y: 140.625,
          dy: 0,
          width: 15.625,
          height: 93.75,
        },
        particles: [],
      };
    },
    render: (_frame: number): void => {
      if (!e.games.ctx) return;

      const data: {[key: string]: any} = e.games.current.data;
      const ball: {x: number; y: number; dx: number; dy: number; width: number; height: number} = data.ball;
      const ctx: CanvasRenderingContext2D = e.games.ctx;

      ctx.fillStyle = e.storage.get("dark-mode") ? "white" : "black";

      if (e.storage.get("visual-effects")) {
        const oldAlpha: number = ctx.globalAlpha;
        data.particles.forEach((particle: Particle): void => {
          if (!ctx) return;

          ctx.globalAlpha = particle.alpha;
          ctx.fillRect(particle.x, particle.y, particle.width, particle.height);
        });

        ctx.globalAlpha = oldAlpha;
      }

      ctx.fillRect(ball.x, ball.y, 15.625, 15.625);
      ctx.fillRect(31.25, data.lPaddle.y, 15.625, 93.75);
      ctx.fillRect(453.125, data.rPaddle.y, 15.625, 93.75);
      ctx.globalAlpha = 0.5;

      for (let i: number = 17.5; i < 375; i += 40) ctx.fillRect(240, i, 20, 20);

      ctx.globalAlpha = 1;
    },
    update: (_time: number, delta: number): void => {
      const data: {[key: string]: any} = e.games.current.data;
      const ball: {x: number; y: number; dx: number; dy: number; width: number; height: number} = data.ball;
      const lPaddle: {x: number; y: number; dx: number; dy: number; width: number; height: number} = data.lPaddle;
      const rPaddle: {x: number; y: number; dx: number; dy: number; width: number; height: number} = data.rPaddle;
      const aiDifficulty: string = String(e.storage.get("pong-ai-difficulty"));

      if (data.game.serveTimer > 0) {
        ball.x = -999;
        ball.y = -999;
        data.game.serveTimer -= delta / 60;
      } else if (Math.round(data.game.serveTimer) <= 0 && Math.round(data.game.serveTimer) !== -1) {
        ball.x = 250 - 15.625 / 2;
        ball.y = (375 - 15.625) / 2;
        ball.dx = (Math.floor(Math.random()) - 0.5) * 7;
        ball.dy = (Math.floor(Math.random()) - 0.5) * 7;
        data.game.serveTimer -= delta;
        if (e.storage.get("pong-game-type") === "11-points") {
          if (aiDifficulty === "2-player") {
            if (data.game.lScore >= 11) e.games.end({message: "Player 1 wins!", score: {"Left Score": data.game.lScore, "Right Score": data.game.rScore}});
            else if (data.game.rScore >= 11) e.games.end({message: "Player 2 wins!", score: {"Left Score": data.game.lScore, "Right Score": data.game.rScore}});
          } else {
            if (data.game.lScore >= 11) {
              e.stats.increase("pong-wins");
              e.achievements.set("pong-win-game");

              if (aiDifficulty === "veryHard") e.achievements.set("pong-win-very-hard");
              if (aiDifficulty === "impossible") e.achievements.set("pong-win-impossible");
              e.games.end({message: "You win!", score: {"Left Score": data.game.lScore, "Right Score": data.game.rScore}});
            } else if (data.game.rScore >= 11) e.games.end({message: "You lose...", score: {"Left Score": data.game.lScore, "Right Score": data.game.rScore}});
          }
        } else if (data.game.lScore >= 100) e.achievements.set("pong-get-100-points");
      } else {
        ball.x += ball.dx * delta;
        ball.y += ball.dy * delta;
        if ((ball.y <= 0 && ball.dy < 0) || (ball.y + 15.625 >= 375 && ball.dy >= 0)) {
          ball.dy = -ball.dy;
          e.games.sfx("pong/hit");
        }

        if (Math.sqrt(ball.dx ** 2 + ball.dy ** 2) >= 3.5 * 50) e.achievements.set("pong-50x-speed");

        if (ball.x <= -15.625 && ball.y >= -100) {
          e.games.sfx("pong/win");
          data.game.rScore++;
          data.game.serveTimer = 1;
        } else if (ball.x >= 500) {
          e.games.sfx("pong/win");
          data.game.lScore++;
          data.game.serveTimer = 1;
        }
      }

      lPaddle.dy = 0;
      if (aiDifficulty === "2-player" ? e.games.keys.UpP1 : e.games.keys.Up) {
        lPaddle.y -= 9 * delta;
        lPaddle.dy -= 9 * delta;
        if (lPaddle.y <= 0) lPaddle.y = 0;
      }
      if (aiDifficulty === "2-player" ? e.games.keys.DownP1 : e.games.keys.Down) {
        lPaddle.y += 9 * delta;
        lPaddle.dy += 9 * delta;
        if (lPaddle.y >= 281.25) lPaddle.y = 281.25;
      }

      switch (aiDifficulty) {
        case "2-player":
          rPaddle.dy = 0;
          if (e.games.keys.UpP2) {
            rPaddle.y -= 9 * delta;
            rPaddle.dy -= 9 * delta;
            if (rPaddle.y < 0) rPaddle.y = 0;
          }
          if (e.games.keys.DownP2) {
            rPaddle.y += 9 * delta;
            rPaddle.dy += 9 * delta;
            if (rPaddle.y >= 281.25) rPaddle.y = 281.25;
          }
          break;
        case "easy":
          pongAI(ball, rPaddle, 2, 3 / 8);
          break;
        case "normal":
          pongAI(ball, rPaddle, 5, 3 / 8);
          break;
        case "hard":
          pongAI(ball, rPaddle, 8, 1 / 2);
          break;
        case "veryHard":
          pongAI(ball, rPaddle, 12, 1);
          break;
        case "impossible":
          pongAI(ball, rPaddle, 999, 2);
          if (Math.abs(ball.dy) > 240) {
            rPaddle.y = Math.random() * 360 * delta;
            rPaddle.dy = (Math.random() * Math.abs(ball.dy) - Math.abs(ball.dy / 2)) * delta;
          }
          break;
      }

      if (rPaddle.y < 0) rPaddle.y = 0;
      if (rPaddle.y + 93.75 >= 375) rPaddle.y = 375 - 93.75;

      if (AABBCollide(ball, lPaddle)) {
        if (ball.x - ball.dx < lPaddle.x + 15.625 && Math.abs(ball.dy) < lPaddle.height) {
          ball.dy *= Math.sign(ball.dy);
          ball.dy *= ball.y < lPaddle.y + 93.75 / 2 ? -1 : 1;
          ball.y = lPaddle.y + (ball.y < lPaddle.y + 93.75 / 2 ? -15.625 : 93.75);
          ball.dx *= 1.05;
          ball.dy += (2 * lPaddle.dy) / 3;
        } else {
          ball.x = lPaddle.x + 15.625;
          ball.dx *= -1.05;
          ball.dy *= 1.05;
          ball.dy += (2 * lPaddle.dy) / 3;
        }

        e.games.sfx("pong/hit");
      } else if (AABBCollide(ball, rPaddle)) {
        if (ball.x - ball.dx > rPaddle.x - 15.625 && Math.abs(ball.dy) < rPaddle.height) {
          ball.dy *= Math.sign(ball.dy);
          ball.dy *= ball.y < rPaddle.y + 93.75 / 2 ? -1 : 1;
          ball.y = rPaddle.y + (ball.y < rPaddle.y + 93.75 / 2 ? -15.625 : 93.75);
          ball.dx *= 1.05;
          ball.dy += (2 * rPaddle.dy) / 3;
        } else {
          ball.x = rPaddle.x - 15.625;
          ball.dx *= -1.05;
          ball.dy *= 1.05;
          ball.dy += (2 * rPaddle.dy) / 3;
        }

        e.games.sfx("pong/hit");
      }

      if (e.storage.get("visual-effects")) {
        updateParticles(data.particles, ball);

        if (Math.sqrt(ball.dx ** 2 + ball.dy ** 2) >= 3.5 * 3) {
          const divfactor: number = Math.sqrt(ball.dx ** 2 + ball.dy ** 2) / 15.625;
          for (let i: number = 0; i < divfactor; i += 0.25) {
            let tempYPos: number = ball.y - (ball.dy * i) / divfactor;
            if (tempYPos < -15.625) {
              tempYPos += 15.625;
              tempYPos = -tempYPos;
              tempYPos -= 15.625;
            } else if (tempYPos > 375) {
              tempYPos -= 375;
              tempYPos = -tempYPos;
              tempYPos += 375;
            }
            data.particles.push({
              x: ball.x - (ball.dx * i) / divfactor,
              y: tempYPos,
              width: 15.625,
              height: 15.625,
              alpha: 0.5,
            });
          }
        }
      }

      e.games.setScoreboard({
        Left: data.game.lScore,
        Right: data.game.rScore,
      });
    },
  },
  page: {
    width: 500,
    height: 375,
  },
  options: [
    {
      name: "AI Difficulty",
      info: "Choose the AI difficulty",
      id: "pong-ai-difficulty",
      type: "dropdown",
      default: "normal",
      options: [
        {name: "2 Player", id: "2-player"},
        {name: "Easy", id: "easy"},
        {name: "Normal", id: "normal"},
        {name: "Hard", id: "hard"},
        {name: "Very Hard", id: "veryHard"},
        {name: "Impossible", id: "impossible"},
      ],
    },
    {
      name: "Game Type",
      info: "Choose the type of game.",
      id: "pong-game-type",
      type: "dropdown",
      default: "11-points",
      options: [
        {name: "First to 11", id: "11-points"},
        {name: "Endless", id: "endless"},
      ],
    },
  ],
};

export default Pong;
