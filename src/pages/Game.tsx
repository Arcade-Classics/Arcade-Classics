import e from "../assets/main";
import * as types from "../assets/types";
import Card from "../components/Card";
import Setting from "../components/Setting";
import {useState, useEffect} from "react";

type time = {time: number; delta: number};

const formatKey = (key: string) => {
  switch (key) {
    case "Up":
      return e.storage.get("control-mode") === "wasd" ? "W" : "Up Arrow";
    case "Down":
      return e.storage.get("control-mode") === "wasd" ? "S" : "Down Arrow";
    case "Left":
      return e.storage.get("control-mode") === "wasd" ? "A" : "Left Arrow";
    case "Right":
      return e.storage.get("control-mode") === "wasd" ? "D" : "Right Arrow";
    case "Primary":
      return ((e.storage.get("primary-key") as string) || "Null").split("Key").pop();
    case "Secondary":
      return ((e.storage.get("secondary-key") as string) || "Null").split("Key").pop();
    default:
      return "Null";
  }
};

const Game: () => JSX.Element = (): JSX.Element => {
  const [game, setGame] = useState<types.game | undefined>(undefined);
  const [state, setState] = useState<"start" | "ingame" | "paused" | "end">("start");
  const [scoreboard, setScoreboard] = useState<types.scoreboard>({} as types.scoreboard);
  const [end, setEnd] = useState<types.end>({} as types.end);
  const [time, setTime] = useState<time>({time: 0, delta: 0});
  const [fps, setFps] = useState<number>(0);

  useEffect((): void => {
    e.games.setScoreboard = setScoreboard;
    e.games.end = (end: types.end): void => {
      setState("end");
      setEnd(end);
      localStorage.removeItem("save-" + game?.id);
      e.games.current.music?.pause();
    };

    let game: types.game | undefined = e.games.data.find((val: types.game): boolean => val.id === e.storage.get("game"));

    if (!game) {
      e.storage.remove("game");
      e.pages.set("home");
      return;
    }

    setGame(game);

    e.setCSSVar("width", game.page.width + 50 + "px");
    e.setCSSVar("height", game.page.height + "px");
    e.setShadow(true);

    if (localStorage.getItem("save-" + game.id)) {
      setState("paused");
      e.games.current.data = JSON.parse(localStorage.getItem("save-" + game.id) || "{}").data;
      setTime(JSON.parse(localStorage.getItem("save-" + game.id) || "{}").time);
    }

    if (game.music) {
      e.games.current.music = new Audio("./assets/sounds/" + game.music + ".mp3");
      e.games.current.music.volume = Number(e.storage.get("music-volume") || 0.5) / 100;
      e.games.current.music.loop = true;
    } else delete e.games.current.music;
  }, []);

  useEffect((): void => {
    if (e.pages.get() !== "game" || state === "end") return;
    if (e.games.keys[e.storage.get("pause-key") as string]) {
      setState("paused");
      e.setShadow(true);
      e.games.current.music?.pause();
    }
    if (state === "ingame" && game) {
      if (e.storage.get("save-game")) localStorage.setItem("save-" + game.id, JSON.stringify({data: e.games.current.data, time: time}));

      e.games.ctx?.clearRect(0, 0, game.page.width || 0, game.page.height || 0);

      try {
        game.functions.render(Math.round(time.time), time.delta);
      } catch (err) {
        console.warn("Error in game render function: " + err);
      }
      try {
        game.functions.update(Math.round(time.time), time.delta);
      } catch (err) {
        console.warn("Error in game update function: " + err);
      }

      let start: number = performance.now();

      requestAnimationFrame((): void => {
        let fps: number = 1000 / (performance.now() - start);
        let delta: number = 60 / fps;

        setFps(fps);
        setTime((time: time): time => ({time: time.time + delta, delta: delta}));
      });
    }
  }, [time, state, game]);

  if (!game) return <></>;

  switch (state) {
    case "start":
      return (
        <div className="game">
          <Card type="title" title={game.name} className="start">
            <div className="info">
              <b>How to Play:</b>
              <br />
              <div
                dangerouslySetInnerHTML={{
                  __html: game.info
                    .split("[UP]")
                    .join(formatKey("Up"))
                    .split("[DOWN]")
                    .join(formatKey("Down"))
                    .split("[LEFT]")
                    .join(formatKey("Left"))
                    .split("[RIGHT]")
                    .join(formatKey("Right"))
                    .split("[PRIMARY]")
                    .join(formatKey("Primary"))
                    .split("[SECONDARY]")
                    .join(formatKey("Secondary")),
                }}></div>
            </div>
            {!game.options ? (
              <></>
            ) : (
              <>
                <br />
                <div className="options">
                  <b>Options:</b>
                  <br />
                  {game.options?.map(
                    (val: types.setting): JSX.Element => (
                      <Setting {...val} />
                    ),
                  )}
                </div>
              </>
            )}
            <br />
            <div className="play">
              <div></div>
              <div
                className="button"
                onClick={(): void => {
                  setState("ingame");
                  e.setShadow(false);
                  e.games.current.data = {};
                  game.functions.start();
                  e.games.current.music?.play();
                }}>
                Play
              </div>
            </div>
          </Card>
        </div>
      );

    case "ingame":
      return (
        <div className="game">
          {e.storage.get("fps-counter") ? <div className="fps">{Math.round(fps)} fps</div> : null}
          <canvas
            className="canvas"
            width={Number(getComputedStyle(document.documentElement).getPropertyValue("--width").split("px")[0]) - 50}
            height={getComputedStyle(document.documentElement).getPropertyValue("--height")}
            ref={(element: HTMLCanvasElement | null): void => {
              if (!element) return;

              e.games.canvas = element;
              e.games.ctx = element.getContext("2d") as CanvasRenderingContext2D;
            }}
            onClick={(event: React.MouseEvent<HTMLCanvasElement, MouseEvent>): void => {
              e.eventListeners.data.click?.forEach((val: (event: any) => void): void => val({button: "left", x: event.clientX - 50, y: event.clientY}));
            }}></canvas>
          {Object.entries(scoreboard).length > 0 ? (
            <Card type="box" className="scoreboard">
              {Object.keys(scoreboard).map(
                (val: string | number): JSX.Element => (
                  <div className="item" style={{userSelect: "none"}}>
                    <div className="name">
                      {val === "Lives" && scoreboard[val] === 1 ? (
                        "Last Life!"
                      ) : (
                        <>
                          {val}
                          {scoreboard[val] !== "" ? ":" : null}
                        </>
                      )}
                    </div>
                    {scoreboard[val] !== "" && !(val === "Lives" && scoreboard[val] === 1) ? (
                      <>
                        <div></div>
                        <div className="score">{scoreboard[val]}</div>
                      </>
                    ) : null}
                  </div>
                ),
              )}
            </Card>
          ) : null}
          <div
            className="button pause material-icons"
            onClick={(): void => {
              setState("paused");
              e.setShadow(true);
              e.games.current.music?.pause();
            }}>
            pause
          </div>
        </div>
      );

    case "paused":
      return (
        <div className="game">
          <Card type="title" title="Paused" className="pause-menu">
            <div className="info">
              <b>How to Play:</b>
              <br />
              <div
                dangerouslySetInnerHTML={{
                  __html: game.info
                    .split("[UP]")
                    .join(formatKey("Up"))
                    .split("[DOWN]")
                    .join(formatKey("Down"))
                    .split("[LEFT]")
                    .join(formatKey("Left"))
                    .split("[RIGHT]")
                    .join(formatKey("Right"))
                    .split("[PRIMARY]")
                    .join(formatKey("Primary"))
                    .split("[SECONDARY]")
                    .join(formatKey("Secondary")),
                }}></div>
            </div>
            <br />
            <div className="buttons">
              <div></div>
              <div
                className="button"
                onClick={(): void => {
                  setState("ingame");
                  e.setShadow(false);
                  e.games.current.music?.play();
                }}>
                Resume
              </div>
              <div></div>
              <div
                className="button"
                onClick={(): void => {
                  localStorage.removeItem("save-" + game.id);
                  e.games.current.music?.pause();
                  e.pages.reload();
                }}>
                Restart
              </div>
            </div>
          </Card>
        </div>
      );

    case "end":
      return (
        <div className="game">
          <Card type="title" title={end.message} className="end">
            <div className="scores">
              {end.score ? (
                <>
                  {Object.keys(end.score).map(
                    (val: string | number): JSX.Element => (
                      <div className="item">
                        <div className="name">
                          {val}
                          {end.score[val] !== "" ? ":" : null}
                        </div>
                        {end.score[val] !== "" ? (
                          <>
                            <div></div>
                            <div className="score">{end.score[val]}</div>
                          </>
                        ) : null}
                      </div>
                    ),
                  )}
                </>
              ) : null}
            </div>
            <br />
            <div className="restart">
              <div></div>
              <div
                className="button"
                onClick={(): void => {
                  localStorage.removeItem("save-" + game.id);
                  e.games.current.music?.pause();
                  e.games.current.data = {};
                  e.pages.reload();
                }}>
                Restart
              </div>
            </div>
          </Card>
        </div>
      );
  }
};

export default Game;
