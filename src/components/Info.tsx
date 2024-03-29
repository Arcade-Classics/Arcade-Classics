const Info: () => JSX.Element = (): JSX.Element => {
  return (
    <div className="info">
      <a href="https://arcade-classics.github.io/changelog" target="_blank" rel="noreferrer">
        Version {chrome.runtime.getManifest().version}
      </a>
      <br />
      <a href="mailto:thearcadeclassics@gmail.com?subject=Arcade Classics Support Request" target="_blank" rel="noreferrer">
        Support
      </a>
      <br />
      <a href="https://arcade-classics.github.io/credits" target="_blank" rel="noreferrer">
        Credits
      </a>
      <br />
      <a href="https://github.com/Arcade-Classics/Arcade-Classics" target="_blank" rel="noreferrer">
        Github
      </a>
    </div>
  );
};

export default Info;
