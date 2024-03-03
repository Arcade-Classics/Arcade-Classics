// @ts-nocheck
import e from "../assets/main";
import * as types from "../assets/types";

interface asteroid {
  x: number;
  y: number;
  a: number;
  r: number;
  s: number;
  vx: number;
  vy: number;
  va: number;
}

interface bullet {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface particle {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  t: number;
}

interface ship {
  x: number;
  y: number;
}

const spawnEdgeAsteroid: () => void = (): void => {
  if (!e.games.canvas) return;

  const r: number = Math.random() * 20 + 25;
  const cornerVar: number = Math.floor(Math.random() * 3);
  e.games.current.data.asteroids?.push({
    x: cornerVar % 2 === 0 ? Math.random() * e.games.canvas.width : (-(cornerVar - 3) / 2) * e.games.canvas.width - (cornerVar - 2) * r,
    y: cornerVar % 2 === 1 ? Math.random() * e.games.canvas.height : (cornerVar / 2) * e.games.canvas.height + (cornerVar - 1) * r,
    r: r,
    s: Math.round(r / 10) + 5,
    a: Math.random() * Math.PI * 2,
    va: ((Math.random() / 2 + 0.5) * Math.PI * 2 - Math.PI) / 45,
    vx: cornerVar % 2 === 0 ? (Math.random() / 2 + 0.5) * 2 - 1 : (cornerVar - 2) * (Math.random() / 2 + 0.5),
    vy: cornerVar % 2 === 1 ? (Math.random() / 2 + 0.5) * 2 - 1 : -(cornerVar - 1) * (Math.random() / 2 + 0.5),
  });
};

const asteroidExplode: (asteroidIndex: number, bulletIndex: number) => void = (asteroidIndex: number, bulletIndex: number): void => {
  if (!e.games.ctx) return;

  e.games.current.data.score = e.games.current.data.score + 1;
  const asteroid: asteroid = e.games.current.data.asteroids[asteroidIndex];
  const bullet: bullet = e.games.current.data.asteroids[bulletIndex];
  e.games.sfx("asteroids/explosion" + String(1 + Math.floor(Math.random() * 2)));
  e.games.current.data.bullets.splice(bulletIndex, 1);
  e.games.current.data.asteroids.splice(asteroidIndex, 1);
  for (let i: number = 0; i < Math.floor(Math.random() * 15 + 10); i++) {
    e.games.current.data.ship.particles.push({
      x: asteroid.x,
      y: asteroid.y,
      r: Math.floor(Math.random() * 7) + 1,
      vx: Math.random() * 11 - 5,
      vy: Math.random() * 11 - 5,
      t: Math.floor(Math.random() * 6),
    });
  }
  if (asteroid.r < 30 || asteroid.s < 7) {
    if (Math.random() * 100 < (e.storage.get("asteroids-difficulty") || 1)) spawnEdgeAsteroid();
    return;
  }
  for (let i: number = 0; i < 2 + Math.round((Math.random() * 2) / 3); i++) {
    e.games.current.data.asteroids.push({
      x: asteroid.x + (Math.random() * 2 - 1) * asteroid.r,
      y: asteroid.y + (Math.random() * 2 - 1) * asteroid.r,
      r: asteroid.r - 6,
      s: (asteroid.s || 4) - 1,
      a: asteroid.a + Math.random() * Math.PI * 2 - Math.PI,
      va: ((Math.random() / 2 + 0.5) * Math.PI * 2 - Math.PI) / 45,
      vx: -bullet.vx / 3 + Math.random() / 2 - 1,
      vy: -bullet.vy / 3 + Math.random() / 2 - 1,
    });
  }
};

const Asteroids: types.game = {
  name: "Asteroids",
  id: "asteroids",
  info: "Control a Spaceship and destroy oncoming Asteroids! Use <kbd>[LEFT]</kbd> and <kbd>[RIGHT]</kbd> to steer, <kbd>[UP]</kbd> to accelerate and <kbd>[PRIMARY]</kbd> to shoot! Don't collide with the asteroids!",
  functions: {
    start: (): void => {
      const asteroids: asteroid[] = [];
      for (let i: number = 0; i < (e.storage.get("asteroids-difficulty") || 0); i++) {
        spawnEdgeAsteroid();
      }
      e.games.current.data = {
        ship: {
          x: 250,
          y: 250,
          angle: Math.random() * Math.PI * 2,
          speed: 0,
          cacheAngle: 0,
          maxSpeed: 6,
          shotCooldown: 0,
          particles: [],
          thrustingTime: 0,
        },
        asteroids: asteroids,
        bullets: [],
        score: 0,
        lives: 5,
        lifeCooldown: -1,
        lastThrustSoundEffect: null,
        thrustSfxCooldown: -1,
      };
    },
    render: (_frame: number): void => {
      if (!e.games.canvas || !e.games.ctx) return;

      const ctx: CanvasRenderingContext2D = e.games.ctx;
      const canvas: HTMLCanvasElement = e.games.canvas;
      const data: {[key: string]: any} = e.games.current.data;

      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "white";
      ctx.moveTo(data.ship.x - 5 + Math.cos(data.ship.cacheAngle) * 10, data.ship.y - 5 + Math.sin(data.ship.cacheAngle) * 10);
      ctx.lineTo(data.ship.x - 5 + Math.cos(data.ship.cacheAngle + (Math.PI * 3) / 4) * 10, data.ship.y - 5 + Math.sin(data.ship.cacheAngle + (Math.PI * 3) / 4) * 10);
      ctx.lineTo(data.ship.x - 5 + Math.cos(data.ship.cacheAngle + Math.PI) * 4, data.ship.y - 5 + Math.sin(data.ship.cacheAngle + Math.PI) * 4);
      ctx.lineTo(data.ship.x - 5 + Math.cos(data.ship.cacheAngle + (Math.PI * 5) / 4) * 10, data.ship.y - 5 + Math.sin(data.ship.cacheAngle + (Math.PI * 5) / 4) * 10);
      ctx.lineTo(data.ship.x - 5 + Math.cos(data.ship.cacheAngle) * 10, data.ship.y - 5 + Math.sin(data.ship.cacheAngle) * 10);
      ctx.stroke();

      data.bullets.forEach((bullet: bullet): void => {
        ctx.lineWidth = 2;
        ctx.strokeStyle = "white";
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, 2, 0, 2 * Math.PI, false);
        ctx.stroke();
      });

      data.asteroids.forEach((asteroid: asteroid): void => {
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "white";
        ctx.moveTo(asteroid.x + Math.cos(asteroid.a) * asteroid.r, asteroid.y - 5 + Math.sin(asteroid.a) * asteroid.r);
        for (let i: number = 0; i < asteroid.s; i++) {
          ctx.lineTo(asteroid.x + Math.cos(asteroid.a + (Math.PI * 2 * i) / asteroid.s) * asteroid.r, asteroid.y - 5 + Math.sin(asteroid.a + (Math.PI * 2 * i) / asteroid.s) * asteroid.r);
        }
        ctx.lineTo(asteroid.x + Math.cos(asteroid.a) * asteroid.r, asteroid.y - 5 + Math.sin(asteroid.a) * asteroid.r);
        ctx.stroke();
      });
      if (e.storage.get("visual-effects")) {
        data.ship.particles.forEach((particle: particle): void => {
          ctx.lineWidth = 2;
          ctx.strokeStyle = "white";
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.r, 0, 2 * Math.PI, false);
          ctx.stroke();
        });
      }
    },
    update: (_time: number, delta: number): void => {
      if (!e.games.canvas) return;

      const canvas: HTMLCanvasElement = e.games.canvas;
      const data: {[key: string]: any} = e.games.current.data;

      data.ship.particles.forEach((particle: particle, index: number): void => {
        particle.x += particle.vx * delta;
        particle.y += particle.vy * delta;
        particle.t -= delta / 10;
        if (particle.t <= 0) data.ship.particles.splice(index, 1);
      });

      if (data.lifeCooldown === -1) {
        if (e.games.keys.Left) data.ship.cacheAngle -= delta / 10;
        if (e.games.keys.Right) data.ship.cacheAngle += delta / 10;
        if (e.games.keys.Up) {
          data.ship.thrustingTime += delta;
          if (data.ship.thrustingTime >= 600) e.achievements.set("asteroids-accelerate-10");
          data.ship.angle = data.ship.cacheAngle;
          data.ship.particles.push({
            x: data.ship.x - 5 + (Math.random() * 4 - 2) - Math.cos(data.ship.angle),
            y: data.ship.y - 5 + (Math.random() * 4 - 2) - Math.sin(data.ship.angle),
            r: Math.random() * 2 + 1,
            vx: Math.sin(data.ship.angle) * (Math.random() * 2 - 2) - Math.cos(data.ship.angle),
            vy: Math.cos(data.ship.angle) * (Math.random() * 2 - 2) - Math.sin(data.ship.angle),
            t: Math.random() * 5 + 2,
          });
          if (data.ship.speed <= 1.5) data.ship.speed = 1.5;
          data.ship.speed += delta / 5;
          if (data.ship.speed >= data.ship.maxSpeed) data.ship.speed = data.ship.maxSpeed;
          if (data.thrustSfxCooldown <= 0 || data.thrustSfxCooldown === -1) {
            data.lastThrustSoundEffect = e.games.sfx("asteroids/thrust");
            data.thrustSfxCooldown = 16 / 60;
          } else data.thrustSfxCooldown -= delta / 60;
        } else {
          data.ship.thrustingTime = 0;
          data.ship.speed -= delta / 10;
          if (data.ship.speed <= 0) data.ship.speed = 0;
          if (data.thrustSfxCooldown !== -1 && data.lastThrustSoundEffect !== null) {
            if (data.lastThrustSoundEffect) data.lastThrustSoundEffect?.pause();
            data.lastThrustSoundEffect = null;
            data.thrustSfxCooldown = -1;
          }
        }
        data.ship.x += Math.cos(data.ship.angle) * data.ship.speed * delta;
        data.ship.y += Math.sin(data.ship.angle) * data.ship.speed * delta;

        if (e.games.keys.Primary && data.ship.shotCooldown <= 0) {
          data.bullets.push({
            x: data.ship.x - 5,
            y: data.ship.y - 5,
            vx: Math.cos(data.ship.cacheAngle) * 10,
            vy: Math.sin(data.ship.cacheAngle) * 10,
          });
          data.ship.shotCooldown = 10;
          e.games.sfx("asteroids/shoot");
        } else {
          data.ship.shotCooldown -= delta;
          if (!e.games.keys.Primary) data.ship.shotCooldown -= delta * 9;
        }

        data.bullets.forEach((bullet: bullet, index: number): void => {
          bullet.x += bullet.vx * delta;
          bullet.y += bullet.vy * delta;
          if (bullet.x < 0 || bullet.x > canvas.width || bullet.y < 0 || bullet.y > canvas.height) data.bullets.splice(index, 1);
        });

        data.asteroids.forEach((asteroid: asteroid, index: number): void => {
          asteroid.x += asteroid.vx;
          asteroid.y += asteroid.vy;
          asteroid.a += asteroid.va;
          asteroid.a = asteroid.a % (Math.PI * 2);

          data.bullets.forEach((bullet: bullet, bulletIndex: number): void => {
            if (bullet.x > asteroid.x - asteroid.r && bullet.x < asteroid.x + asteroid.r && bullet.y > asteroid.y - asteroid.r && bullet.y < asteroid.y + asteroid.r) {
              asteroidExplode(index, bulletIndex);
            }
          });

          const ship: ship = data.ship;
          if (Math.sqrt((asteroid.x - ship.x) ** 2 + (asteroid.y - ship.y) ** 2) <= asteroid.r) {
            data.ship.particles = [];
            data.asteroids.forEach((element: asteroid) => {
              for (let i: number = 0; i < Math.floor(Math.random() * 3 + 2); i++) {
                e.games.current.data.ship.particles.push({
                  x: element.x,
                  y: element.y,
                  r: Math.floor(Math.random() * 7) + 1,
                  vx: Math.random() * 11 - 5,
                  vy: Math.random() * 11 - 5,
                  t: Math.floor(Math.random() * 6),
                });
              }
            });
            data.asteroids = [];
            data.bullets = [];
            data.lives--;
            data.lifeCooldown = 1;
            for (let i: number = 0; i < Math.floor(Math.random() * 3 + 2); i++) {
              e.games.current.data.ship.particles.push({
                x: ship.x,
                y: ship.y,
                r: Math.floor(Math.random() * 7) + 1,
                vx: Math.random() * 11 - 5,
                vy: Math.random() * 11 - 5,
                t: Math.floor(Math.random() * 6),
              });
            }
            data.ship.x = -999;
            data.ship.y = -999;
            data.lastThrustSoundEffect?.pause();
            data.lastThrustSoundEffect = null;
            data.thrustSfxCooldown = -1;
          }

          if (asteroid.x < -asteroid.r || asteroid.x > canvas.width + asteroid.r || asteroid.y < -asteroid.r || asteroid.y > canvas.height + asteroid.r) {
            data.asteroids.splice(index, 1);
          }
        });

        if (data.ship.x < -10) data.ship.x = e.games.canvas.width + 10;
        if (data.ship.x > e.games.canvas.width + 10) data.ship.x = -10;
        if (data.ship.y < -10) data.ship.y = e.games.canvas.height + 10;
        if (data.ship.y > e.games.canvas.height + 10) data.ship.y = -10;
        if (data.asteroids.length < (e.storage.get("asteroids-difficulty") || 0) && data.lifeCooldown === -1) spawnEdgeAsteroid();
      } else if (data.lifeCooldown > 0) {
        data.lifeCooldown -= delta / 60;
        data.ship.x = -999;
        data.ship.y = -999;
      } else if (data.lifeCooldown <= 0) {
        if (data.lives === 0) {
          if (e.stats.get("asteroids-high-score") < data.score) e.stats.set("asteroids-high-score", data.score);
          e.games.end({message: "You died!", score: {Score: data.score, Lives: data.lives}});
        } else {
          for (let i: number = 0; i < (e.storage.get("asteroids-difficulty") || 0); i++) spawnEdgeAsteroid();
          data.ship.x = 250;
          data.ship.y = 250;
          data.ship.angle = Math.random() * Math.PI * 2;
          data.ship.speed = 0;
          data.ship.shotCooldown = 0;
          data.lifeCooldown = -1;
        }
      }
      if (data.score >= 100) e.achievements.set("asteroids-score-100");
      if (data.score >= 100 && (e.storage.get("asteroids-difficulty") || 0) >= 50) e.achievements.set("asteroids-score-100-impossible");
      if (data.score >= 10000) e.achievements.set("asteroids-score-10k");
      e.games.setScoreboard({Score: data.score, Lives: data.lives});
    },
  },
  page: {
    width: 500,
    height: 500,
  },
  options: [
    {
      name: "Difficulty",
      info: "Choose the Intensity of Asteroids",
      id: "asteroids-difficulty",
      type: "dropdown",
      default: 5,
      options: [
        {name: "Easy", id: 4},
        {name: "Normal", id: 7},
        {name: "Hard", id: 15},
        {name: "Impossible", id: 50},
      ],
    },
  ],
};

export default Asteroids;
