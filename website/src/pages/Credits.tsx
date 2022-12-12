const Credits: () => JSX.Element = (): JSX.Element => {
  return (
    <>
      <div>
        <h1 className="text-center text-7xl pt-12 tracking-tight pb-3">Credits</h1>
      </div>
      <div className="mt-12 flex justify-center">
        <div className="m-2">
          <b className="text-2xl">mnit</b>
          <p>Game Icons</p>
        </div>
        <div className="m-2">
          <b className="text-2xl">Not Mario</b>
          <p>Pong</p>
          <p>Breakout</p>
          <p>Minesweeper</p>
          <p>2048</p>
          <p>Asteroids</p>
        </div>
        <div className="m-2">
          <b className="text-2xl">HuggyDaBuggy</b>
          <p>Page design</p>
          <p>Systems</p>
          <p>Pacman</p>
          <p>Space Invaders</p>
          <p>Snake</p>
        </div>
        <div className="m-2">
          <b className="text-2xl">StilltheSmartie</b>
          <p>Profile system</p>
          <p>Leaderboards</p>
          <p>Tetris</p>
          <p>Asteroids</p>
        </div>
        <div className="m-2">
          <b className="text-2xl">Not Tacoz</b>
          <p>Graphic design</p>
        </div>
      </div>
    </>
  );
};

export default Credits;
