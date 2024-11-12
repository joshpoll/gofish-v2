import { Accessor, JSX, Setter } from "solid-js";

export type ButtonProps = Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> & {
  bind: [Accessor<boolean>, Setter<boolean>];
};
export const Button = (props: ButtonProps) => {
  const [value, setValue] = props.bind;
  return (
    <button {...props} onClick={() => setValue(!value())}>
      {props.children}
    </button>
  );
};
