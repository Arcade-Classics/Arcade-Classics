import e from "../assets/main";
import * as types from "../assets/types";

interface coordinate {
  x: number;
  y: number;
}

const apple: () => void = (): void => {
  let random: coordinate = {x: Math.floor(Math.random() * 49), y: Math.floor(Math.random() * 49)};
  let clear: boolean = true;

  e.games.current.data.snake.forEach((snake: {x: number; y: number}): void => {
    if (snake.x === random.x && snake.y === random.y) clear = false;
  });

  if (clear) e.games.current.data.apple = random;
  else apple();
};

const Snake: types.game = {
  name: "Snake",
  id: "snake",
  info: "Use <kbd>[UP]</kbd>, <kbd>[DOWN]</kbd>, <kbd>[LEFT]</kbd> and <kbd>[RIGHT]</kbd> to control your snake - eat apples, but not yourself!",
  functions: {
    start: (): void => {
      let dir: "up" | "down" | "left" | "right";
      let snake: coordinate[];

      switch (Math.floor(Math.random() * 3)) {
        case 0:
          dir = "up";
          snake = [
            {x: 25, y: 25},
            {x: 25, y: 26},
            {x: 25, y: 27},
          ];
          break;
        case 1:
          dir = "down";
          snake = [
            {x: 25, y: 25},
            {x: 25, y: 24},
            {x: 25, y: 23},
          ];
          break;
        case 2:
          dir = "left";
          snake = [
            {x: 25, y: 25},
            {x: 26, y: 25},
            {x: 27, y: 25},
          ];
          break;
        default:
          dir = "right";
          snake = [
            {x: 25, y: 25},
            {x: 24, y: 25},
            {x: 23, y: 25},
          ];
      }

      e.games.current.data = {
        dirQueue: [dir],
        snake: snake,
        keys: {Up: false, Down: false, Left: false, Right: false},
      };

      apple();
    },
    render: (_frame: number): void => {
      if (!e.games.ctx) return;

      const ctx: CanvasRenderingContext2D = e.games.ctx;
      const data: {[key: string]: any} = e.games.current.data;

      ctx.fillStyle = "#ff0000";
      ctx.fillRect(data.apple.x * 10, data.apple.y * 10, 10, 10);

      data.snake.forEach((snake: {x: number; y: number}): void => {
        ctx.fillStyle = "#00ff00";
        ctx.fillRect(snake.x * 10, snake.y * 10, 10, 10);
      });
    },
    update: (time: number): void => {
      const data: {[key: string]: any} = e.games.current.data;
      const dirQueue = data.dirQueue;

      const increase: () => void = (): void => {
        switch (dirQueue[0]) {
          case "up":
            data.snake.unshift({x: data.snake[0].x, y: data.snake[0].y - 1});
            break;
          case "down":
            data.snake.unshift({x: data.snake[0].x, y: data.snake[0].y + 1});
            break;
          case "left":
            data.snake.unshift({x: data.snake[0].x - 1, y: data.snake[0].y});
            break;
          case "right":
            data.snake.unshift({x: data.snake[0].x + 1, y: data.snake[0].y});
            break;
        }
      };

      if (time >= 18000) e.achievements.set("snake-5-mins");

      if (time % Number(e.storage.get("snake-difficulty")) === 0) {
        if (dirQueue.length > 1) dirQueue.shift();
        increase();
        data.snake.pop();
      }

      if (data.snake[0].x === data.apple.x && data.snake[0].y === data.apple.y) {
        data.snake.push(data.snake[data.snake.length - 1]);

        if (data.snake.length >= 10) e.achievements.set("snake-10");
        if (data.snake.length >= 50) e.achievements.set("snake-50");
        if (data.snake.length >= 10 && Number(e.storage.get("snake-difficulty")) === 1) e.achievements.set("snake-impossible-10");

        if ((data.apple.x === 0 && data.apple.y === 0) || (data.apple.x === 49 && data.apple.y === 0) || (data.apple.x === 0 && data.apple.y === 49) || (data.apple.x === 49 && data.apple.y === 49))
          e.achievements.set("snake-corner");

        if (data.snake.length >= 2500) {
          e.stats.set("snake-high-score", 2500);
          e.games.end({message: "Game Complete!", score: {Length: data.snake.length}});
        } else apple();
      }

      if (data.snake[0].x < 0 || data.snake[0].x > 49 || data.snake[0].y < 0 || data.snake[0].y > 49) {
        e.games.sfx("snake/bonk");
        if (e.stats.get("snake-high-score") < data.snake.length) e.stats.set("snake-high-score", data.snake.length);
        e.games.end({message: "Game Over", score: {Length: data.snake.length}});
      }

      data.snake.forEach((snake: {x: number; y: number}, index: number): void => {
        if (index !== 0 && snake.x === data.snake[0].x && snake.y === data.snake[0].y) {
          e.games.sfx("snake/bonk");
          if (e.stats.get("snake-high-score") < data.snake.length) e.stats.set("snake-high-score", data.snake.length);
          e.games.end({message: "Game Over", score: {Length: data.snake.length}});
        }
      });

      if (e.games.keys.Up) {
        if (!data.keys.Up) {
          if (dirQueue.indexOf("up") === -1 && dirQueue.indexOf("down") === -1 && dirQueue.length <= 3) {
            dirQueue.push("up");
            data.keys.Up = true;
          }
        }
      } else data.keys.Up = false;

      if (e.games.keys.Down) {
        if (!data.keys.Down) {
          if (dirQueue.indexOf("up") === -1 && dirQueue.indexOf("down") === -1 && dirQueue.length <= 3) {
            dirQueue.push("down");
            data.keys.Down = true;
          }
        }
      } else data.keys.Down = false;

      if (e.games.keys.Left) {
        if (!data.keys.Left) {
          if (dirQueue.indexOf("left") === -1 && dirQueue.indexOf("right") === -1 && dirQueue.length <= 3) {
            dirQueue.push("left");
            data.keys.Left = true;
          }
        }
      } else data.keys.Left = false;

      if (e.games.keys.Right) {
        if (!data.keys.Right) {
          if (dirQueue.indexOf("left") === -1 && dirQueue.indexOf("right") === -1 && dirQueue.length <= 3) {
            dirQueue.push("right");
            data.keys.Right = true;
          }
        }
      } else data.keys.Right = false;

      e.games.setScoreboard({Length: data.snake.length});
    },
  },
  options: [
    {
      name: "Difficulty",
      info: "Choose the difficulty",
      id: "snake-difficulty",
      type: "dropdown",
      default: 5,
      options: [
        {name: "Easy", id: 7},
        {name: "Normal", id: 5},
        {name: "Hard", id: 3},
        {name: "Very Hard", id: 2},
        {name: "Impossible", id: 1},
      ],
    },
  ],
  page: {
    width: 500,
    height: 500,
  },
  music: "snake/music",
};

export default Snake;
