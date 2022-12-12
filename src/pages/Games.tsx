import e from "../assets/main";
import * as types from "../assets/types";
import Tooltip from "../components/Tooltip";

const Games: () => JSX.Element = (): JSX.Element => {
  return (
    <div className="games">
      {e.games.data.map(
        (game: types.game, index: number): JSX.Element => (
          <Tooltip text={game.name} dir={index !== 0 ? "up" : "down"} onClick={(): void => e.games.set(game.id)} className="button" style={{gridArea: game.id}}>
            <img src={"./assets/images/" + game.id + (["minesweeper", "t048"].includes(game.id) ? (e.storage.get("dark-mode") ? "-dark" : "-light") : "") + ".png"} alt={game.name} />
          </Tooltip>
        ),
      )}
    </div>
  );
};

export default Games;
