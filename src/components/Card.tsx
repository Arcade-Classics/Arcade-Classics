import {useState} from "react";

interface props extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  title?: any;
  children?: any;
  type: "title" | "box" | "title-collapsible" | "custom";
  default?: boolean;
  icon?: string;
  onClick?: () => void;
}

const Card: (props: props) => JSX.Element = (props: props): JSX.Element => {
  const [open, setOpen] = useState<boolean>(props.default === undefined ? true : props.default);

  return (
    <div {...props} title="" onClick={(): void => {}} className={"card " + props.className}>
      {props.type !== "box" ? (
        <div className="header">
          {props.title}
          <div></div>
          {props.type !== "title" ? (
            <span className="button material-icons" onClick={props.type === "custom" ? props.onClick : (): void => setOpen(!open)}>
              {props.type === "custom" ? props.icon : open ? "expand_less" : "expand_more"}
            </span>
          ) : null}
        </div>
      ) : null}
      {open ? <div className="body">{props.children}</div> : null}
    </div>
  );
};

export default Card;
