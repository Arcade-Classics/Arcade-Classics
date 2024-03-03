import e from "./assets/main";
import "./assets/main.css";
import "@fontsource/roboto/latin-400.css";
import "@material-design-icons/font/filled.css";
import * as types from "./assets/types";
import Card from "./components/Card";
import Game from "./pages/Game";
import Games from "./pages/Games";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import {Unsubscribe} from "firebase/auth";
import {DataSnapshot, getDatabase, onValue, push, ref} from "firebase/database";
import React, {useState, useEffect} from "react";
import {render} from "react-dom";

const Page: () => JSX.Element = (): JSX.Element => {
  const [page, setPage] = useState<string>(e.pages.get());

  useEffect((): void => {
    e.stats.data.forEach((stat: types.stat, index: number): number => (e.stats.data[index].val = e.stats.get(stat.id)));

    const init: (data: {[key: string]: string | number | boolean}) => void = (data: {[key: string]: string | number | boolean}) => {
      e.storage.data = data;

      Object.values(e.settings).forEach((val: types.setting[]): void =>
        val.forEach((setting: types.setting): void => {
          if (e.storage.get(setting.id) !== undefined) return;

          e.storage.set(setting.id, setting.default);
        }),
      );

      if (e.storage.get("user-name") === undefined) {
        const array: Uint32Array = new Uint32Array(1);
        window.crypto.getRandomValues(array);
        e.storage.set("user-id", array[0].toString(36));
        const usernames: string[] = ["Avid Arcade Classics User", "Snake Player", "Brick Breaker", "Ping Ponger", "Tetris Enjoyer", "Asteroid Shooter", "Fruit Eater", "Mine Sweeper", "Space Invader"];
        e.storage.set("user-name", usernames[Math.floor(Math.random() * usernames.length)] + " " + Math.floor(Math.random() * 1000));
      }

      e.stats.data.forEach((stat: types.stat, index: number): number => (e.stats.data[index].val = e.stats.get(stat.id)));

      if (!e.storage.get("dark-mode")) {
        e.setCSSVar("background", "#ffffff");
        e.setCSSVar("accent", "#f5f5f5");
        e.setCSSVar("text", "#000000");
        e.setCSSVar("primary", "#0d6efd");
      }

      if (e.storage.get("open-last-page")) e.pages.set(localStorage.getItem("last-page") || "");

      if (!e.storage.get("save-game")) e.games.data.forEach((game: types.game): void => localStorage.removeItem("save-" + game.id));

      window.oncontextmenu = (event: MouseEvent): void => {
        e.eventListeners.data.click?.forEach((val: (event: any) => void): void => val({button: "right", x: event.clientX - 50, y: event.clientY}));

        if (!e.storage.get("context-menu")) event.preventDefault();
      };

      e.eventListeners.add("click", e.games.data.find((game: types.game): boolean => game.id === "minesweeper")?.functions.click || ((): void => {}));

      const keyPress: (key: KeyboardEvent, state: boolean) => void = (key: KeyboardEvent, state: boolean): void => {
        e.games.keys[key.code] = state;

        if (state) e.eventListeners.data.keyDown?.forEach((val: (event: string) => void): void => val(key.code));
        else e.eventListeners.data.keyUp?.forEach((val: (event: string) => void): void => val(key.code));

        if (e.storage.get("control-mode") === "wasd") {
          switch (key.code) {
            case "KeyW":
              e.games.keys.Up = state;
              break;
            case "KeyA":
              e.games.keys.Left = state;
              break;
            case "KeyS":
              e.games.keys.Down = state;
              break;
            case "KeyD":
              e.games.keys.Right = state;
              break;
          }
        } else {
          switch (key.code) {
            case "ArrowUp":
              e.games.keys.Up = state;
              break;
            case "ArrowLeft":
              e.games.keys.Left = state;
              break;
            case "ArrowDown":
              e.games.keys.Down = state;
              break;
            case "ArrowRight":
              e.games.keys.Right = state;
              break;
          }
        }

        switch (key.code) {
          case "KeyW":
            e.games.keys.UpP1 = state;
            break;
          case "KeyA":
            e.games.keys.LeftP1 = state;
            break;
          case "KeyS":
            e.games.keys.DownP1 = state;
            break;
          case "KeyD":
            e.games.keys.RightP1 = state;
            break;
          case "ArrowUp":
            e.games.keys.UpP2 = state;
            break;
          case "ArrowLeft":
            e.games.keys.LeftP2 = state;
            break;
          case "ArrowDown":
            e.games.keys.DownP2 = state;
            break;
          case "ArrowRight":
            e.games.keys.RightP2 = state;
            break;
        }

        switch (key.code) {
          case e.storage.get("primary-key"):
            e.games.keys.Primary = state;
            break;
          case e.storage.get("secondary-key"):
            e.games.keys.Secondary = state;
            break;
        }
      };

      window.onkeydown = (key: KeyboardEvent): void => keyPress(key, true);

      window.onkeyup = (key: KeyboardEvent): void => keyPress(key, false);

      onValue(ref(getDatabase(), "Notifications"), (data: DataSnapshot) => {
        if (!data.val()) return;
        Object.values(data.val()).forEach((val: unknown): void => e.notification(val as types.notification));
      });

      setInterval(
        (): Unsubscribe => onValue(ref(getDatabase(), "Notifications"), (data: DataSnapshot) => Object.values(data.val()).forEach((val: unknown): void => e.notification(val as types.notification))),
        60000,
      );
    };

    e.eventListeners.add("pageChange", (page: string): void => setPage(page));

    if (!localStorage.getItem("storage")) {
      if (e.storage.get("sync-storage")) {
        chrome.storage.sync.get(null, (val: {[key: string]: string | number | boolean}): void => {
          if (val) init(val);
          else init({});
        });
      } else init({});
    } else init(JSON.parse(localStorage.getItem("storage") || "{}"));

    window.onerror = (msg: string | Event, url?: string, line?: number, column?: number, error?: Error): void => {
      if (!e.storage.get("report-errors")) return;
      push(ref(getDatabase(), "Errors"), {Message: msg, URL: url, Line: line, Column: column, Error: JSON.stringify(error), Version: e.version});
    };
  }, []);

  switch (page.toLowerCase()) {
    case "games":
      return <Games />;
    case "settings":
      return <Settings />;
    case "profile":
      return <Profile />;
    case "game":
      return <Game />;
    default:
      return <Home />;
  }
};

const Sidebar: () => JSX.Element = (): JSX.Element => {
  const [page, setPage] = useState<string>(e.pages.get());

  useEffect((): void => {
    e.eventListeners.add("pageChange", setPage);
  }, []);

  return (
    <>
      <div className={"button material-icons" + (page === "" || page === "home" ? " active" : "")} onClick={(): void => e.pages.set("home")}>
        home
      </div>
      <div className={"button material-icons" + (page === "games" ? " active" : "")} onClick={(): void => e.pages.set("games")}>
        videogame_asset
      </div>
      <div className={"button material-icons" + (page === "settings" ? " active" : "")} onClick={(): void => e.pages.set("settings")}>
        settings
      </div>
      <div></div>
      <div className={"button profile material-icons" + (page === "profile" ? " active" : "")} onClick={(): void => e.pages.set("profile")}>
        account_circle
      </div>
    </>
  );
};

const Shadow: () => JSX.Element = (): JSX.Element => {
  const [shadow, setShadow] = useState<boolean>(false);

  useEffect((): void => {
    e.setShadow = setShadow;
  }, []);

  return <>{shadow ? <div className="shadow"></div> : null}</>;
};

const Notification: () => JSX.Element = (): JSX.Element => {
  const [notifications, setNotifications] = useState<types.notification[]>([]);

  useEffect((): void => {
    e.notification = (notification: types.notification): void => {
      if (e.storage.get("notification-" + notification.id)) return;
      if (notification.achievement) notification.time = 5;

      setNotifications((notifications: types.notification[]): types.notification[] => notifications.concat([notification]));
    };

    setInterval((): void => {
      setNotifications((notifications: types.notification[]): types.notification[] =>
        notifications.filter((notification: types.notification): boolean => {
          if (!notification.achievement) return true;
          if (notification.time === 0) e.storage.set("notification-" + notification.id, true);

          return (notification.time || 1) >= 0;
        }),
      );

      setNotifications((notifications: types.notification[]): types.notification[] =>
        notifications.map(
          (notification: types.notification): types.notification => ({...notification, time: notification.time !== undefined && notification.achievement ? notification.time - 1 : undefined}),
        ),
      );
    }, 1000);
  }, []);

  return (
    <div className="notifications">
      {notifications.map(
        (notification: types.notification): JSX.Element => (
          <Card
            type={notification.achievement ? "title" : "custom"}
            title={notification.title}
            className="notification"
            icon="close"
            onClick={(): void => {
              setNotifications((notifications: types.notification[]): types.notification[] =>
                notifications.filter((childNotification: types.notification): boolean => childNotification.id !== notification.id),
              );
              e.storage.set("notification-" + notification.id, true);
            }}>
            {notification.message}
          </Card>
        ),
      )}
    </div>
  );
};

render(
  <React.StrictMode>
    <Notification />
    <Shadow />
    <div className="ui">
      <div className="sidebar">
        <Sidebar />
      </div>
      <div className="page">
        <Page />
      </div>
    </div>
  </React.StrictMode>,
  document.getElementById("root"),
);
