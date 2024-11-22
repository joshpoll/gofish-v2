import { Accessor, JSX, Setter } from "solid-js";

export type SliderProps = Omit<JSX.InputHTMLAttributes<HTMLInputElement>, "onInput"> & {
  bind: [Accessor<number>, Setter<number>];
};
export const Slider = (props: SliderProps) => {
  const [value, setValue] = props.bind;
  return <input type="range" {...props} value={value()} onInput={(e) => setValue(e.target.valueAsNumber)} />;
};
