import { For } from "solid-js";
import { coordinateLine } from "./library/spaces/coordinateLine";
import { squircle } from "./library/spaces/squircle";
import { subdivideLine, transformLine } from "./library/geometry/line";
import { randomPoint } from "./library/spaces/randomPoint";
import { lerp } from "./library/util";

export type SquircleProps = {
  SVG_PADDING: number;
  scaleFactor: number;
  GRID_COLOR: string;
  GRID_STROKE_WIDTH: number;
  POINT_COLOR: string;
  roundness?: number;
  aspectRatio?: number;
};

export const Squircle = (props: SquircleProps) => {
  const squircleSpace = () => squircle({ roundness: props.roundness ?? 0.5, aspectRatio: props.aspectRatio ?? 1 });

  const squirclePoints = Array.from({ length: 1000 }).map(() => randomPoint(squircleSpace()));

  const squircleRect = subdivideLine(
    {
      points: [
        [15, -Math.PI / 3],
        [30, -Math.PI / 3],
        [30, Math.PI / 3],
        [15, Math.PI / 3],
      ] as const,
      closed: true,
    },
    100
  );

  return (
    <>
      <g
        transform={`translate(${props.SVG_PADDING / 2 + (100 * props.scaleFactor) / 2 / 2}, ${
          props.SVG_PADDING / 2 + (100 * props.scaleFactor) / 2 / 2
        }) scale(${props.scaleFactor / 2})`}
      >
        <For each={[0, 1]}>
          {(dim) => (
            <For each={[0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]}>
              {(loc) => (
                <path
                  d={coordinateLine(
                    squircleSpace(),
                    dim,
                    loc,
                    (dim, t) => lerp(squircleSpace().bounds[dim][0], squircleSpace().bounds[dim][1], t),
                    1000
                  )
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
        {/* <For each={squirclePoints}>
          {(p) => <circle cx={p.x} cy={p.y} r={1} fill={props.POINT_COLOR} stroke="white" stroke-width={0.25} />}
        </For> */}
        <path
          d={transformLine(squircleRect, squircleSpace())
            .map((p, i) => (i === 0 ? `M ${p.x},${p.y}` : `L ${p.x},${p.y}`))
            .join(" ")}
          fill={props.POINT_COLOR}
        />
      </g>
    </>
  );
};
