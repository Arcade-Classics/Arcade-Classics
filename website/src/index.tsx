import Footer from "./Footer";
import "./main.css";
import NotFound from "./pages/404";
import Changelog from "./pages/Changelog";
import Credits from "./pages/Credits";
import Home from "./pages/Home";
import Privacy from "./pages/Privacy";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import React, {useState} from "react";
import {render} from "react-dom";

declare module "@mui/material/styles" {
  interface Theme {
    status: {
      danger: React.CSSProperties["color"];
    };
  }

  interface Palette {
    neutral: Palette["primary"];
  }
  interface PaletteOptions {
    neutral: PaletteOptions["primary"];
  }

  interface PaletteColor {
    darker?: string;
  }
  interface SimplePaletteColorOptions {
    darker?: string;
  }
  interface ThemeOptions {
    status: {
      danger: React.CSSProperties["color"];
    };
  }
}

const theme = createTheme({
  status: {
    danger: "#e53e3e",
  },
  palette: {
    primary: {
      main: "#BB86FC",
      darker: "#053e85",
    },
    neutral: {
      main: "#64748B",
      contrastText: "#fff",
    },
  },
});

const App: () => JSX.Element = (): JSX.Element => {
  const [page] = useState<string>(window.location.pathname.substr(1));

  switch (page) {
    case "":
      return <Home />;
    case "support":
    case "support.html":
      document.title = "Redirecting...";
      window.location.href = "mailto:thearcadeclassics@gmail.com?subject=Arcade Classics 2.0 Support Request";
      return <></>;
    case "privacy":
    case "privacy.html":
      document.title = "Privacy";
      return <Privacy />;
    case "credits":
    case "credits.html":
      document.title = "Credits";
      return <Credits />;
    case "changelog":
    case "changelog.html":
      document.title = "Changelog";
      return <Changelog />;
    case "install":
    case "install.html":
      document.title = "Redirecting...";
      window.location.href = "https://chrome.google.com/webstore/detail/arcade-classics/gokcmhknbfbkchaljcbjloaebnoblcnd";
      return <></>;
    default:
      document.title = "Page Not Found";
      return <NotFound />;
  }
};

const UI: () => JSX.Element = (): JSX.Element => {
  return (
    <>
      <ThemeProvider theme={theme}>
        <img className="absolute opacity-40 z-0 bottom-0 object-cover w-screen z-back" src="././background.png" alt="Background" />
        <div className="panel-1 -right-4 z-10 bg-opacity-90 m-0 h-auto w-screen h-screen">
          <App />
        </div>
      </ThemeProvider>
    </>
  );
};

render(
  <React.StrictMode>
    <UI />
    <Footer />
  </React.StrictMode>,
  document.getElementById("root"),
);
