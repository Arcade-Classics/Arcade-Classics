import e from "../assets/main";
import * as types from "../assets/types";
import Card from "../components/Card";
import Info from "../components/Info";
import Setting from "../components/Setting";
import {getAuth} from "@firebase/auth";
import {useState} from "react";

const Settings: () => JSX.Element = (): JSX.Element => {
  const [clear, setClear] = useState<boolean>(false);

  return (
    <div className="settings">
      <Card title="General" type="title">
        {e.settings.general.map(
          (setting: types.setting): JSX.Element => (
            <Setting {...setting} />
          ),
        )}
      </Card>
      <Card title="Games" type="title">
        {e.settings.games.map(
          (setting: types.setting): JSX.Element => (
            <Setting {...setting} />
          ),
        )}
      </Card>
      <Card title="Developer Settings" type="title" style={{display: "none"}}>
        {e.settings.dev.map(
          (setting: types.setting): JSX.Element => (
            <Setting {...setting} />
          ),
        )}
      </Card>
      <Card type="box" className="clear">
        {clear ? (
          <div
            className="button"
            onClick={(): void => {
              e.storage.data = {};
              localStorage.clear();
              if (!(navigator.userAgent.toLowerCase().indexOf("firefox") > -1)) chrome.storage.sync.clear();
              window.location.href = "";
            }}>
            Click again to Confirm
          </div>
        ) : (
          <div
            className="button"
            onClick={(): void => {
              setClear(true);
            }}>
            Clear Data
          </div>
        )}
      </Card>
      <Info />
    </div>
  );
};

export default Settings;
