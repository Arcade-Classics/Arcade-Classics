const Footer: () => JSX.Element = (): JSX.Element => {
  return (
    <>
      <img
        src="./icon.png"
        alt="Icon"
        className="icon"
        onClick={(): void => {
          window.location.href = "../";
        }}
      />
      <a className="changelog hvr-float" href="./changelog">
        Changelog
      </a>
      <a className="credits hvr-float" href="./credits">
        Credits
      </a>
      <a className="privacy hvr-float" href="./privacy">
        Privacy Policy
      </a>
      <a className="contact hvr-float" href="mailto:thearcadeclassics@gmail.com?subject=Arcade Classics 2.0 Support Request" rel="noreferrer" target="_blank">
        Contact us
      </a>
    </>
  );
};

export default Footer;
