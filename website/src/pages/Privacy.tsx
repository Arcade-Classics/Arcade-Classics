const Privacy: () => JSX.Element = (): JSX.Element => {
  return (
    <>
      <div>
        <h1 className="text-center text-7xl pt-12 tracking-tight pb-3">Privacy</h1>
      </div>
      <div className="mt-12 flex justify-center">
        <div className="m-2">
          <b className="text-2xl">User Data Collection</b>
          <p>User Statistics and profile data is only collected by Arcade Classics if the User opts to sign in.</p>
          <p>Using the Leaderboards feature means that local gameplay stats (High Scores and Game times) will be collected and shared with Arcade Classics.</p>
          <p>
            Google account passwords and other sensitive information is <b>not</b> accessible to Arcade Classics.
          </p>
        </div>
        <div className="m-2">
          <b className="text-2xl">Data handling and storage</b>
          <p>When signing in, user name, email and profile picture will be stored on Arcade Classic's database.</p>
          <p>Local data such as stats are stored locally on the user device through Chrome Storage Sync</p>
        </div>
        <div className="m-2">
          <b className="text-2xl">Data Sharing</b>
          <p>All information on stats (High Scores, Total Games) will be accessible to other users, if the user is signed in to Arcade Classics</p>
          <p>Email and Profile Picture, although stored on our servers, are not accessible to other users</p>
          <p>Google account details, with the exception of name, are not shared with other users</p>
        </div>
      </div>
    </>
  );
};

export default Privacy;
