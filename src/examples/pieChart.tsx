import { For } from "solid-js";
import { coordinateLine } from "./library/spaces/coordinateLine";
import { polar } from "./library/spaces/polar";
import { subdivideLine, transformLine } from "./library/geometry/line";
import { randomPolarPoint } from "./library/spaces/randomPoint";

export type PieChartProps = {
  SVG_PADDING: number;
  scaleFactor: number;
  GRID_COLOR: string;
  GRID_STROKE_WIDTH: number;
  POINT_COLOR: string;
};

const DISCRETE_COLOR_PALETTE = ["#0369A1", "#0284C7", "#0EA5E9", "#34D399", "#A3E635", "#FBBF24"];

export const PieChart = (props: PieChartProps) => {
  // a disjoint union of theta with some arbitrary angles that covers the entire circle
  const polarSet = [
    [-Math.PI / 3, Math.PI / 3],
    [Math.PI / 3, (Math.PI * 2) / 3],
    [(Math.PI * 2) / 3, Math.PI],
    [Math.PI, (Math.PI * 4) / 3],
    [(Math.PI * 4) / 3, (Math.PI * 5) / 3],
  ].map(([start, end]) =>
    subdivideLine(
      {
        points: [
          /* [15, start], */
          /* [30, start], */
          /* [30, end], */
          /* [15, end], */
          [20 /* 290 gives a fun result! */, start],
          [30, start],
          [30, end],
          [20, end],
        ] as const,
        closed: true,
      },
      100
    )
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
                  d={coordinateLine(polar, dim, loc)
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
        <For each={polarSet}>
          {(area, i) => (
            <path
              d={transformLine(area, polar)
                .map((p, i) => (i === 0 ? `M ${p.x},${p.y}` : `L ${p.x},${p.y}`))
                .join(" ")}
              fill={DISCRETE_COLOR_PALETTE[i() % DISCRETE_COLOR_PALETTE.length]}
              // shape-rendering="crispEdges"
            />
          )}
        </For>
      </g>
    </>
  );
};
