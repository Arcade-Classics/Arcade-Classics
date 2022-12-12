import e from "../assets/main";
import * as types from "../assets/types";
import {useState, useEffect} from "react";

const Home: () => JSX.Element = (): JSX.Element => {
  const [slide, setSlide] = useState<types.game>(e.games.data[Math.floor(Math.random() * e.games.data.length)]);

  useEffect((): void => void setTimeout((): void => setSlide(e.games.data[Math.floor(Math.random() * e.games.data.length)]), 3500), [slide]);

  return (
    <div className="home">
      <div className="slideshow button" onClick={(): void => e.games.set(slide.id)} style={{gridArea: "slideshow"}}>
        {e.games.data.map(
          (val: types.game): JSX.Element => (
            <img
              className={val === slide ? "opaque" : ""}
              src={"./assets/images/" + val.id + (["minesweeper", "t048"].includes(val.id) ? (e.storage.get("dark-mode") ? "-dark" : "-light") : "") + ".png"}
              alt={val.name}
            />
          ),
        )}
      </div>
      <div onClick={(): void => e.pages.set("games")} className="play button" style={{gridArea: "play"}}>
        Play
      </div>
      <div onClick={(): void => e.pages.set("profile")} className="profile button material-icons" style={{gridArea: "stats"}}>
        emoji_events
      </div>
      <div onClick={(): void => e.pages.set("settings")} className="settings button material-icons" style={{gridArea: "settings"}}>
        settings
      </div>
    </div>
  );
};

export default Home;
