import { Space } from "../spaceType";
import { coordinateLine } from "../coordinateLine";
import { For, JSX } from "solid-js";
import { lerp } from "../../util";
export type AxisProps = {
  space: Space<any>;
  dim: number;
  loc: number;
  color: string;
  "stroke-width": number;
  ticks?: boolean | number[];
};

// TODO: change this so that the labels are aligned to the axes AND THEN the space transform is
// applied
// TODO: no that's not what I want! I want a _continuous_ version of Bluefish's discrete ref API to
// index into the axis's space!!!

export type Mark<Domain extends number[]> = {
  jsx: JSX.Element;
  space: Space<Domain>;
};

export const select = <Domain extends number[]>(mark: Mark<Domain>, p: Domain) => mark.space.transform(p);

export const Axis = (props: AxisProps) => {
  const axisTicks = () =>
    props.ticks === undefined || typeof props.ticks === "boolean" ? [0, 0.2, 0.4, 0.6, 0.8, 1] : props.ticks;

  const axisValues = () =>
    axisTicks().map((x) => lerp(props.space.bounds[props.dim][0], props.space.bounds[props.dim][1], x));

  const axisLine = {
    get jsx() {
      return (
        <path
          d={coordinateLine(props.space, props.dim, props.loc)
            .map((p, i) => (i === 0 ? `M ${p.x},${p.y}` : `L ${p.x},${p.y}`))
            .join(" ")}
          stroke={props.color}
          stroke-width={props["stroke-width"]}
          fill="none"
          stroke-linecap="round"
        />
      );
    },
    get space() {
      return props.space;
    },
  };

  return (
    <>
      {axisLine.jsx}
      {props.ticks && (
        <For each={axisValues()}>
          {(x) => {
            const p = () => {
              const coords = Array(props.space.bounds.length).fill(0);
              coords[props.dim] = x;
              coords[1 - props.dim] = props.space.bounds[1 - props.dim][props.loc];
              return select(axisLine, coords);
            };

            return (
              <text
                x={props.dim === 0 ? p().x : p().x - 10}
                y={props.dim === 0 ? p().y + 10 : p().y}
                text-anchor="middle"
                font-size="4"
                fill={"black"}
              >
                {x.toFixed(1)}
              </text>
            );
          }}
        </For>
      )}
    </>
  );
};
