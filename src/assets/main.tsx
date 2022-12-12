import T048 from "../games/2048";
import Asteroids from "../games/Asteroids";
import Breakout from "../games/Breakout";
import Minesweeper from "../games/Minesweeper";
import Pacman from "../games/Pacman";
import Pong from "../games/Pong";
import Snake from "../games/Snake";
import SpaceInvaders from "../games/SpaceInvaders";
import Tetris from "../games/Tetris";
import * as types from "./types";
import {initializeApp} from "firebase/app";
import {getDatabase, update, ref} from "firebase/database";

const e: types.e = {
  achievements: {
    data: [
      {game: "Tetris", name: "Block Placer", description: "Get to Level 10", id: "tetris-level-10", secret: false},
      {game: "Tetris", name: "Block Master", description: "Get to Level 25", id: "tetris-level-25", secret: false},
      {game: "Tetris", name: "Almost Impossible", description: "Level 15 on Ghost", id: "tetris-level-15-ghost", secret: false},
      {game: "Tetris", name: "Board Master", description: "Clear the Entire Board", id: "tetris-board-clear", secret: false},
      {game: "Tetris", name: "Combo Master", description: "Get a 3x combo", id: "3x-combo-tetris", secret: true},
      {game: "Space Invaders", name: "Invader Attacker", description: "Clear a Wave", id: "spaceinvaders-wave", secret: false},
      {game: "Space Invaders", name: "Invader Destroyer", description: "Reach wave 10", id: "spaceinvaders-wave-10", secret: false},
      {game: "Space Invaders", name: "Invader Deleter", description: "10000 score", id: "spaceinvaders-10000", secret: false},
      {game: "Space Invaders", name: "UFO Destroyer", description: "Kill the UFO", id: "spaceinvaders-ufo", secret: false},
      {game: "Space Invaders", name: "Failure", description: "Die with 1 invader left", id: "spaceinvaders-1-alien", secret: false},
      {game: "Pacman", name: "Level up!", description: "Reach level 2", id: "pacman-level", secret: false},
      {game: "Pacman", name: "Pro", description: "Reach Level 10", id: "pacman-level-10", secret: false},
      {game: "Pacman", name: "Master", description: "10000 score", id: "pacman-10000", secret: false},
      {game: "Pacman", name: "Teleporter", description: "Use one of the portals", id: "pacman-portal", secret: false},
      {game: "Pacman", name: "Ghostbuster", description: "Eat 4 ghosts with 1 power pellet", id: "pacman-4-combo", secret: true},
      {game: "Snake", name: "Little Snake", description: "Get to 10 length", id: "snake-10", secret: false},
      {game: "Snake", name: "Big Snake", description: "Get to 50 length", id: "snake-50", secret: false},
      {game: "Snake", name: "Speedy Snake", description: "10 length on impossible", id: "snake-impossible-10", secret: false},
      {game: "Snake", name: "Old Snake", description: "Survive for 5 minutes", id: "snake-5-mins", secret: false},
      {game: "Snake", name: "Good luck!", description: "Get an apple in the corner", id: "snake-corner", secret: true},
      {game: "Pong", name: "Qualifier", description: "Beat any AI", id: "pong-win-game", secret: false},
      {game: "Pong", name: "Semi-Finals", description: "Beat Very Hard AI", id: "pong-win-very-hard", secret: false},
      {game: "Pong", name: "I am speed", description: "Get the ball to 50x speed", id: "pong-50x-speed", secret: false},
      {game: "Pong", name: "Stalling Expert", description: "Get 100 points", id: "pong-get-100-points", secret: false},
      {game: "Pong", name: "Finals", description: "Beat Impossible AI", id: "pong-win-impossible", secret: true},
      {game: "2048", name: "Learned to Count", description: "Get to 512", id: "2048-512", secret: false},
      {game: "2048", name: "Addition Expert", description: "Get to 1024", id: "2048-1024", secret: false},
      {game: "2048", name: "Graduation", description: "Get to 10k points", id: "2048-10k-points", secret: false},
      {game: "2048", name: "Mathematician", description: "Get to 2048", id: "2048-2048", secret: false},
      {game: "2048", name: "Calculator", description: "Get to 4096", id: "2048-4096", secret: true},
      {game: "Breakout", name: "Driller", description: "Beat a level", id: "breakout-beat-level", secret: false},
      {game: "Breakout", name: "Dynamite", description: "Get to 10k points", id: "breakout-10k-points", secret: false},
      {game: "Breakout", name: "Demolitionist", description: "Get to level 10", id: "breakout-level-10", secret: false},
      {game: "Breakout", name: "Bulldozer", description: "Get to 100k points", id: "breakout-100k-points", secret: false},
      {game: "Breakout", name: "Oddly Satisfying", description: "Hit the corner", id: "breakout-hit-the-corner", secret: true},
      {game: "Asteroids", name: "Asteroid Attacker", description: "Get to 100", id: "asteroids-score-100", secret: false},
      {game: "Asteroids", name: "Asteroid Remover", description: "100 on impossible", id: "asteroids-score-100-impossible", secret: false},
      {game: "Asteroids", name: "Asteroid Exploder", description: "Get to 2500 points", id: "asteroids-score-2500", secret: false},
      {game: "Asteroids", name: "Asteroid Deleter", description: "Get to 10k points", id: "asteroids-score-10k", secret: false},
      {game: "Asteroids", name: "Full Throttle", description: "Accelerate for 10 seconds", id: "asteroids-accelerate-10", secret: true},
      {game: "Minesweeper", name: "Shoveller", description: "Beat Easy", id: "minesweeper-easy", secret: false},
      {game: "Minesweeper", name: "Mine Mole", description: "Intermediate", id: "minesweeper-intermediate", secret: false},
      {game: "Minesweeper", name: "Metal Detector", description: "Beat Expert", id: "minesweeper-expert", secret: false},
      {game: "Minesweeper", name: "Super Sweeper", description: "Beat Impossible", id: "minesweeper-impossible", secret: false},
      {game: "Minesweeper", name: "Speed Sweeper", description: "Win in 15s or less", id: "minesweeper-15s", secret: true},
    ],
    get: (id: string): boolean => Boolean(e.storage.get("achievement-" + id) || false),
    set: (id: string): void => {
      if (e.achievements.get(id)) return;
      e.storage.set("achievement-" + id, true);
      e.notification({
        title: (
          <div>
            <b>Achievement Unlocked: </b> {e.achievements.data.find((achievement: types.achievement): boolean => achievement.id === id)?.name}
          </div>
        ),
        message: e.achievements.data.find((achievement: types.achievement): boolean => achievement.id === id)?.description || "",
        id: "achievement-" + id,
        achievement: true,
      });
    },
  },
  eventListeners: {
    add: (type: string, callback: (event: any) => void): void => {
      if (!e.eventListeners.data[type]) e.eventListeners.data[type] = [];
      e.eventListeners.data[type].push(callback);
    },
    data: {},
  },
  firebase: {
    app: initializeApp({
      apiKey: "AIzaSyAmKXMv-rDeSMNRd_t1Kv3rjMizEs6QlC0",
      authDomain: "arcade--classics.firebaseapp.com",
      databaseURL: "https://arcade--classics-default-rtdb.asia-southeast1.firebasedatabase.app/",
      projectId: "arcade--classics",
      storageBucket: "arcade--classics.appspot.com",
      messagingSenderId: "1052885361959",
      appId: "1:1052885361959:web:78bee538b2d1c77f0e3502",
    }),
    database: getDatabase(),
  },
  games: {
    set: (game: string): void => {
      e.pages.set("game");
      e.storage.set("game", game);
    },
    setScoreboard: (_scoreboard: types.scoreboard): void => {},
    end: (_end: types.end): void => {},
    sfx: (sfx: string): HTMLAudioElement => {
      let audio = new Audio("./assets/sounds/" + sfx + ".mp3");
      audio.volume = Number(e.storage.get("sfx-volume") || 0.5) / 100;
      audio.play();
      return audio;
    },
    current: {
      data: {},
    },
    keys: {},
    data: [Tetris, T048, SpaceInvaders, Pacman, Snake, Pong, Asteroids, Breakout, Minesweeper],
  },
  notification(_notification: types.notification): void {},
  pages: {
    get: (): string => window.location.hash.split("#")[1] || "",
    reload: (): void => {
      let page: string = e.pages.get();
      setTimeout((): void => e.pages.set(page), 1);
      e.pages.set("home", false);
    },
    set: (page: string, updatePage: boolean = true): void => {
      window.location.hash = "#" + page;
      localStorage.setItem("last-page", page);
      if (updatePage) {
        e.setCSSVar("width", "250px");
        e.setCSSVar("height", "450px");
      }
      e.setShadow(false);
      e.games.current.music?.pause();
      e.eventListeners.data.pageChange?.forEach((val: (event: any) => void): void => val(page));
    },
  },
  setCSSVar: (key: string, value: string): void => document.documentElement.style.setProperty("--" + key, value),
  setShadow: (_enabled: boolean): void => {},
  settings: {
    general: [
      {
        name: "Dark Mode",
        info: "Toggle dark theme.",
        id: "dark-mode",
        type: "checkbox",
        default: true,
        function: (val: string | number | boolean): void => {
          e.setCSSVar("transition", "0s");
          if (val) {
            e.setCSSVar("background", "#121212");
            e.setCSSVar("accent", "#222222");
            e.setCSSVar("text", "#ffffff");
            e.setCSSVar("primary", "#bb86fc");
          } else {
            e.setCSSVar("background", "#ffffff");
            e.setCSSVar("accent", "#f5f5f5");
            e.setCSSVar("text", "#000000");
            e.setCSSVar("primary", "#0d6efd");
          }
          e.setCSSVar("transition", "0.5s");
        },
      },
      {
        name: "Open on last closed page",
        info: "Open the extension on the last used page.",
        id: "open-last-page",
        type: "checkbox",
        default: true,
      },
      {
        name: "Use Chrome Storage Sync",
        info: "Saves your settings and statistics (but not game saves) to your browser profile (or google account if you are signed in), unavailable on firefox.",
        id: "sync-storage",
        type: "checkbox",
        default: !(navigator.userAgent.toLowerCase().indexOf("firefox") > -1),
        function: (val: string | number | boolean): void => {
          if (val) {
            chrome.storage.sync.set(e.storage.data);
            localStorage.removeItem("storage");
          } else {
            localStorage.setItem("storage", JSON.stringify(e.storage.data));
            chrome.storage.sync.clear();
          }
        },
      },
      {
        name: "Report Errors",
        info: "Report various errors to the developer.",
        id: "report-errors",
        type: "checkbox",
        default: false,
      },
    ],
    games: [
      {
        name: "Save Game",
        info: "Save the state of games when you close the extension.",
        id: "save-game",
        type: "checkbox",
        default: true,
      },
      {
        name: "Visual Effects",
        info: "Enable visual effects, can impact performance.",
        id: "visual-effects",
        type: "checkbox",
        default: true,
      },
      {
        name: "Music Volume",
        info: "Set the music volume.",
        id: "music-volume",
        type: "slider",
        default: 50,
      },
      {
        name: "SFX Volume",
        info: "Set the SFX volume.",
        id: "sfx-volume",
        type: "slider",
        default: 50,
      },
      {
        name: "Control Mode",
        info: "Choose which buttons to use as controls in games.",
        id: "control-mode",
        type: "dropdown",
        default: "arrows",
        options: [
          {name: "Arrow Keys", id: "arrows"},
          {name: "WASD", id: "wasd"},
        ],
      },
      {
        name: "Pause",
        info: "Pause the game.",
        id: "pause-key",
        type: "keybind",
        default: "KeyP",
      },
      {
        name: "Primary",
        info: "The primary action button in games. Eg: serve, shoot, hard drop.",
        id: "primary-key",
        type: "keybind",
        default: "Space",
      },
      {
        name: "Secondary",
        info: "The secondary action in games. Eg: hold piece.",
        id: "secondary-key",
        type: "keybind",
        default: "KeyC",
      },
    ],
    dev: [
      {
        name: "FPS Counter",
        info: "In-Game FPS counter.",
        id: "fps-counter",
        type: "checkbox",
        default: false,
      },
      {
        name: "Context Menu",
        info: "Enable Context Menu.",
        id: "context-menu",
        type: "checkbox",
        default: false,
      },
    ],
  },
  stats: {
    sync: (): void => {
      e.stats.data.forEach((stat: types.stat, index: number): void => {
        e.stats.data[index].val = e.stats.get(stat.id);
      });
      update(ref(getDatabase(), "Users/" + e.storage.get("user-id")), {
        stats: e.stats.data,
      });
    },
    set: (stat: string, value: number): void => {
      e.storage.set("stat-" + stat, value);
      e.eventListeners.data.statChange?.forEach((val: (event: string) => void): void => val(stat));
      e.stats.sync();
    },
    increase: (stat: string, amount: number = 1): void => {
      e.storage.set("stat-" + stat, Number(e.storage.get("stat-" + stat) || 0) + amount);
      e.eventListeners.data.statChange?.forEach((val: (event: string) => void): void => val(stat));
      e.stats.sync();
    },
    get: (stat: string): number => Number(e.storage.get("stat-" + stat) || 0),
    data: [
      {game: "Tetris", name: "High Score", id: "tetris-high-score", val: 0},
      {game: "Tetris", name: "Highest Level", id: "tetris-highest-level", val: 0},
      {game: "Tetris", name: "Most Rows Cleared", id: "tetris-rows-cleared", val: 0},
      {game: "Space Invaders", name: "High Score", id: "spaceinvaders-high-score", val: 0},
      {game: "Space Invaders", name: "Highest Wave", id: "spaceinvaders-highest-wave", val: 0},
      {game: "Pacman", name: "High Score", id: "pacman-high-score", val: 0},
      {game: "Pacman", name: "Highest Level", id: "pacman-highest-level", val: 0},
      {game: "Snake", name: "Longest Snake", id: "snake-high-score", val: 0},
      {game: "Pong", name: "Wins", id: "pong-wins", val: 0},
      {game: "Asteroids", name: "High Score", id: "asteroids-high-score", val: 0},
      {game: "Breakout", name: "High Score", id: "breakout-high-score", val: 0},
      {game: "Breakout", name: "Highest Level", id: "breakout-highest-level", val: 0},
      {game: "Minesweeper", name: "Wins", id: "minesweeper-wins", val: 0},
      {game: "Minesweeper", name: "Fastest Game", id: "minesweeper-fastest-game", val: 0},
      {game: "2048", name: "High Score", id: "2048-high-score", val: 0},
      {game: "2048", name: "Highest Tile", id: "2048-high-tile", val: 0},
    ],
  },
  storage: {
    get: (key: string): string | boolean | number | undefined => e.storage.data[key],
    set: (key: string, value: string | boolean | number): void => {
      e.storage.data[key] = value;
      if (e.storage.get("sync-storage")) chrome.storage.sync.set(e.storage.data);
      else localStorage.setItem("storage", JSON.stringify(e.storage.data));
    },
    remove(key: string): void {
      delete e.storage.data[key];
      if (e.storage.get("sync-storage")) chrome.storage.sync.set(e.storage.data);
      else localStorage.setItem("storage", JSON.stringify(e.storage.data));
    },
    data: {},
  },
  version: "2.1.0",
};

export default e;
