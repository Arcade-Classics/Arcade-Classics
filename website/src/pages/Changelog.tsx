const Changelog: () => JSX.Element = (): JSX.Element => {
  return (
    <>
      <div>
        <h1 className="text-center text-7xl pt-12 tracking-tight pb-3">Changelog</h1>
        <h1 className="text-center text-2xl tracking-tight">v2.1.0</h1>
      </div>
      <div className="mt-6 flex justify-center">
        <div className="m-2 changelog-item">
          <b className="text-2xl">2.0.0</b>
          <p>Introduced AC-2.0: Anniversary Update</p>
          <p>Added 2048, reworked and modernised games</p>
          <p>Fixed major bugs and performance issues</p>
          <p>Reworked and modernised games</p>
          <p>Reworked rendering engine</p>
          <p>Reworked stats and leaderboards</p>
          <p>Reworked game engine</p>
          <p>Reworked achievements</p>
          <b className="text-1xl">2.0.1</b>
          <p>Minor bug fixes</p>
          <b className="text-1xl">2.0.2</b>
          <p>Leaderboards Fixed</p>
          <p>Minor bug fixes</p>
          <b className="text-1xl">2.0.3</b>
          <p>Massive performance improvements + support for high and low refresh rate displays</p>
          <p>Added a close button to notifications</p>
          <p>Added keybind customization</p>
          <p>Minor bug fixes</p>
          <b className="text-1xl">2.0.4</b>
          <p>Emergency bug fix</p>
          <b className="text-1xl">2.0.5</b>
          <p>Fixed an issue with Asteroids</p>
          <b className="text-1xl">2.0.6</b>
          <p>Fixed Space Invaders Progression</p>
          <p>Minor fixes to Snake and Tetris</p>
          <p>Fixed Leaderboards Issues</p>
          <b className="text-1xl">2.0.7</b>
          <p>Minor Bug Fixes</p>
          <p>Fixed issues with leaderboards</p>
        </div>
        <div className="m-2 changelog-item">
          <b className="text-2xl">2.1.0</b>
          <p>Updated to the new MV3 standard</p>
          <p>Removed Google accounts and replaced them with simple usernames (we know it is less secure)</p>
          <p>Made the project open source on github!</p>
          <p>Added two new settings:</p>
          <p>- Added a toggle to switch between using localstorage and chromestorage (we know it is less secure)</p>
          <p>- Added a toggle to opt into error reporting</p>
          <p>Added a confirmation to clearing data</p>
          <p>Fixed major bugs and performance issues</p>
        </div>
      </div>
    </>
  );
};

export default Changelog;
