import {useState} from "react";

interface props extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  text: string;
  children?: any;
  dir: "up" | "down" | "left" | "right";
}

const Tooltip: (props: props) => JSX.Element = (props: props): JSX.Element => {
  const [active, setActive] = useState<boolean>(false);

  return (
    <div {...props} title="" className={"tooltip " + props.className} onMouseEnter={(): void => setActive(true)} onMouseLeave={(): void => setActive(false)}>
      {props.children}
      {active ? <span className={"tooltiptext " + props.dir}>{props.text}</span> : null}
    </div>
  );
};

export default Tooltip;
