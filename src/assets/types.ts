import firebase from "firebase/app";
import {Database} from "firebase/database";

interface achievement {
  game: string;
  name: string;
  description: string;
  id: string;
  secret: boolean;
}
interface item {
  name: string;
  id: string;
  price: number;
  description: string;
  isMap: boolean;
  type: string;
  matrix: number[][];
  levelUnlockable?: number;
  fullAchievements?: boolean;
}
interface e {
  achievements: {
    data: achievement[];
    get: (id: string) => boolean;
    set: (id: string) => void;
  };
  eventListeners: {
    add: (type: string, callback: (event: any) => void) => void;
    data: {
      [key: string]: ((event: any) => void)[];
    };
  };
  firebase: {
    app: firebase.FirebaseApp;
    database: Database;
  };
  games: {
    canvas?: HTMLCanvasElement;
    ctx?: CanvasRenderingContext2D;
    current: {
      data: {[key: string]: any};
      music?: HTMLAudioElement;
    };
    data: game[];
    keys: {
      [key: string]: boolean;
    };
    end: (_end: end) => void;
    sfx: (sfx: string) => void;
    set: (game: string) => void;
    setScoreboard: (_scoreboard: scoreboard) => void;
  };
  notification: (_notification: notification) => void;
  pages: {
    get: () => string;
    reload: () => void;
    set: (page: string, updatePage?: boolean) => void;
  };
  setCSSVar: (key: string, value: string) => void;
  setShadow: (_enabled: boolean) => void;
  settings: {[key: string]: setting[]};
  stats: {
    data: stat[];
    get: (stat: string) => number;
    increase: (stat: string, amount?: number) => void;
    set: (stat: string, value: number) => void;
    sync: () => void;
  };
  storage: {
    data: {
      [key: string]: string | boolean | number;
    };
    get: (key: string) => string | number | boolean | undefined;
    remove: (key: string) => void;
    set: (key: string, value: string | number | boolean) => void;
  };
  version: string;
}
interface end {
  message: string;
  score: {
    [key: string]: string | number;
  };
}
interface game {
  name: string;
  id: string;
  info: string;
  functions: {
    render: (frame: number, delta: number) => void;
    update: (time: number, delta: number) => void;
    start: () => void;
    [key: string]: (event: any, event2?: any) => void;
  };
  page: {
    width: number;
    height: number;
  };
  options?: setting[];
  music?: string;
}
interface leaderboard {
  id: string;
  name: string;
  stat: number;
}
interface notification {
  title: string | JSX.Element;
  message: string | JSX.Element;
  id: string;
  achievement: boolean;
  time?: number;
}
interface scoreboard {
  [key: string]: string | number;
}
interface setting {
  name: string;
  info: string;
  id: string;
  type: "checkbox" | "dropdown" | "slider" | "keybind";
  default: string | number | boolean;
  options?: {name: string; id: string | number}[];
  game?: string;
  function?: (val: string | number | boolean) => void;
}
interface stat {
  game: string;
  name: string;
  id: string;
  val: number;
}
interface user {
  name: string;
  email: string;
  id: string;
  photoURL: string;
  classicscore: number;
  badges: string[];
  stats: {
    [key: string]: number;
  };
}

export type {e, setting, game, user, item, leaderboard, achievement, scoreboard, end, notification, stat};
