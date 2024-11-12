import { For } from "solid-js";
import { coordinateLine } from "./library/spaces/coordinateLine";
import { barycentric, barycentricConstrain } from "./library/spaces/barycentric";
import { randomPoint } from "./library/spaces/randomPoint";

export type BarycentricProps = {
  SVG_PADDING: number;
  scaleFactor: number;
  GRID_COLOR: string;
  GRID_STROKE_WIDTH: number;
  POINT_COLOR: string;
};

export const Barycentric = (props: BarycentricProps) => {
  const barycentricPoints = Array.from({ length: 100 }).map(() => randomPoint(barycentric));

  return (
    <>
      <g
        transform={`translate(${props.SVG_PADDING / 2 + (100 * props.scaleFactor) / 2 / 2}, ${
          props.SVG_PADDING / 2 + (100 * props.scaleFactor) / 2 / 2
        }) scale(${props.scaleFactor / 2})`}
      >
        <For each={[0, 1, 2]}>
          {(dim) => (
            <For each={[0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]}>
              {(loc) => (
                <path
                  d={coordinateLine(barycentric, dim, loc, barycentricConstrain(barycentric, dim, loc))
                    .map((p, i) => (i === 0 ? `M ${p.x},${p.y}` : `L ${p.x},${p.y}`))
                    .join(" ")}
                  stroke={props.GRID_COLOR}
                  stroke-width={props.GRID_STROKE_WIDTH}
                  fill="none"
                  stroke-linecap="round"
                />
              )}
            </For>
          )}
        </For>
        <For each={barycentricPoints}>
          {(p) => <circle cx={p.x} cy={p.y} r={1} fill={props.POINT_COLOR} stroke="white" stroke-width={0.25} />}
        </For>
      </g>
    </>
  );
};
