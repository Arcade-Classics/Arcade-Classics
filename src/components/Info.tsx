const Info: () => JSX.Element = (): JSX.Element => {
  return (
    <div className="info">
      <a href="https://arcade-classics.github.io/changelog" target="_blank" rel="noreferrer">
        Version 2.1.4
      </a>
      <br />
      <a href="mailto:thearcadeclassics@gmail.com?subject=Arcade Classics Support Request" target="_blank" rel="noreferrer">
        Support
      </a>
      <br />
      <a href="https://arcade-classics.github.io/credits" target="_blank" rel="noreferrer">
        Credits
      </a>
    </div>
  );
};

export default Info;
