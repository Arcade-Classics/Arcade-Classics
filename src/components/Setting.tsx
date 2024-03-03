import e from "../assets/main";
import * as types from "../assets/types";
import {useEffect, useState} from "react";

const Setting: (props: types.setting) => JSX.Element = (props: types.setting): JSX.Element => {
  const [value, setValue] = useState<number | string>(0);

  useEffect((): void => {
    if (e.storage.get(props.id) === undefined) e.storage.set(props.id, props.default);
    setValue(e.storage.get(props.id) as number | string);
  }, [props]);

  switch (props.type) {
    case "checkbox":
      return (
        <div className="setting checkbox">
          <details>
            <summary>{props.name}:</summary>
            <p>{props.info}</p>
          </details>
          <div></div>
          <input
            disabled={props.id === "sync-storage" && navigator.userAgent.toLowerCase().indexOf("firefox") > -1}
            type="checkbox"
            key={props.id}
            defaultChecked={Boolean(e.storage.get(props.id))}
            onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
              if (props.id === "sync-storage" && navigator.userAgent.toLowerCase().indexOf("firefox") > -1) return;
              e.storage.set(props.id, event.currentTarget.checked);
              if (props.function) props.function(event.currentTarget.checked);
            }}></input>
        </div>
      );

    case "dropdown":
      return (
        <div className="setting dropdown">
          <details>
            <summary>{props.name}:</summary>
            <p>{props.info}</p>
          </details>
          <div></div>
          <select
            defaultValue={String(e.storage.get(props.id))}
            onChange={(event: React.ChangeEvent<HTMLSelectElement>): void => {
              e.storage.set(props.id, event.currentTarget.value);
              if (props.function) props.function(event.currentTarget.value);
            }}>
            {props.options?.map((option: {name: string; id: string | number}): JSX.Element => <option value={option.id}>{option.name}</option>)}
          </select>
        </div>
      );

    case "slider":
      return (
        <div className="setting slider">
          <details>
            <summary>
              {props.name}: {value}
            </summary>
            <p>{props.info}</p>
          </details>
          <input
            key={props.id}
            type="range"
            min={0}
            max={100}
            defaultValue={Number(e.storage.get(props.id))}
            onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
              e.storage.set(props.id, event.currentTarget.value);
              setValue(Number(event.currentTarget.value));
              if (props.function) props.function(event.currentTarget.value);
            }}></input>
        </div>
      );

    case "keybind":
      return (
        <div className="setting keybind">
          <details>
            <summary>
              {props.name}: <kbd>{value}</kbd>
            </summary>
            <p>{props.info}</p>
          </details>
          <div></div>
          <div
            className="button"
            onClick={(event: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
              const element: HTMLDivElement = event.target as HTMLDivElement;
              element.innerText = "Recording";
              window.addEventListener(
                "keydown",
                (event: KeyboardEvent): void => {
                  if (e.pages.get() !== "settings") return;
                  e.storage.set(props.id, event.code);
                  setValue(event.code);
                  element.innerText = "Record";
                },
                {once: true},
              );
            }}>
            Record
          </div>
        </div>
      );
  }
};

export default Setting;
