import { createEffect, createSignal, For, onCleanup } from "solid-js";
import { coordinateLine } from "./library/spaces/coordinateLine";
import { linear } from "./library/spaces/linear";
import { randomPoint } from "./library/spaces/randomPoint";
import { subdivideLine, transformLine } from "./library/geometry/line";
import { timeVaryingWavy } from "./library/spaces/wavy";
import { createTime } from "./library/animation/time";
import { lerp } from "./library/util";

export type WavyProps = {
  SVG_PADDING: number;
  scaleFactor: number;
  GRID_COLOR: string;
  GRID_STROKE_WIDTH: number;
  POINT_COLOR: string;
  animate?: boolean;
};

export const Wavy = (props: WavyProps) => {
  const points = Array.from({ length: 100 }).map(() => randomPoint(linear));
  const { time, setActive } = createTime();

  createEffect(() => {
    setActive(props.animate ?? true);
  });

  const rect = subdivideLine(
    {
      points: [
        [-30, -20],
        [30, -20],
        [30, 20],
        [-30, 20],
      ] as const,
      closed: true,
    },
    100
  );

  const wavySpace = () => timeVaryingWavy(time());
  const axisTicks = [0, 0.2, 0.4, 0.6, 0.8, 1];
  const axisValues = () => axisTicks.map((x) => lerp(wavySpace().bounds[0][0], wavySpace().bounds[0][1], x));

  return (
    <>
      <g
        transform={`translate(${props.SVG_PADDING / 2 + (100 * props.scaleFactor) / 2 / 2}, ${
          props.SVG_PADDING / 2 + (100 * props.scaleFactor) / 2 / 2
        }) scale(${props.scaleFactor / 2})`}
      >
        <For each={[0, 0.2, 0.4, 0.6, 0.8, 1]}>
          {(loc) => (
            <path
              d={coordinateLine(linear, 0, loc)
                .map((p, i) => (i === 0 ? `M ${p.x},${p.y}` : `L ${p.x},${p.y}`))
                .join(" ")}
              stroke={props.GRID_COLOR}
              stroke-width={props.GRID_STROKE_WIDTH}
              fill="none"
              stroke-linecap="round"
            />
          )}
        </For>
        <For each={[0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]}>
          {(loc) => (
            <path
              d={coordinateLine(linear, 1, loc)
                .map((p, i) => (i === 0 ? `M ${p.x},${p.y}` : `L ${p.x},${p.y}`))
                .join(" ")}
              stroke={props.GRID_COLOR}
              stroke-width={props.GRID_STROKE_WIDTH}
              fill="none"
              stroke-linecap="round"
            />
          )}
        </For>
        <For each={points}>
          {(p) => <circle cx={p.x} cy={p.y} r={1} fill={props.POINT_COLOR} stroke="white" stroke-width={0.25} />}
        </For>
        <path
          d={transformLine(rect, linear)
            .map((p, i) => (i === 0 ? `M ${p.x},${p.y}` : `L ${p.x},${p.y}`))
            .concat("Z")
            .join(" ")}
          fill={props.POINT_COLOR}
        />
      </g>
      <g
        transform={`translate(${props.SVG_PADDING / 2 + (100 * props.scaleFactor) / 2 / 2 + 70 * props.scaleFactor}, ${
          props.SVG_PADDING / 2 + (100 * props.scaleFactor) / 2 / 2
        }) scale(${props.scaleFactor / 2})`}
      >
        <For each={[0, 0.2, 0.4, 0.6, 0.8, 1]}>
          {(loc) => (
            <path
              d={coordinateLine(timeVaryingWavy(time()), 0, loc)
                .map((p, i) => (i === 0 ? `M ${p.x},${p.y}` : `L ${p.x},${p.y}`))
                .join(" ")}
              stroke={props.GRID_COLOR}
              stroke-width={props.GRID_STROKE_WIDTH}
              fill="none"
              stroke-linecap="round"
            />
          )}
        </For>
        <For each={[0]}>
          {(loc) => (
            <g transform={`translate(-5,0)`}>
              <path
                d={coordinateLine(timeVaryingWavy(time()), 0, loc)
                  .map((p, i) => (i === 0 ? `M ${p.x},${p.y}` : `L ${p.x},${p.y}`))
                  .join(" ")}
                stroke={props.GRID_COLOR}
                stroke-width={props.GRID_STROKE_WIDTH * 2}
                fill="none"
                stroke-linecap="round"
              />
            </g>
          )}
        </For>
        <For each={[0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]}>
          {(loc) => (
            <path
              d={coordinateLine(timeVaryingWavy(time()), 1, loc)
                .map((p, i) => (i === 0 ? `M ${p.x},${p.y}` : `L ${p.x},${p.y}`))
                .join(" ")}
              stroke={props.GRID_COLOR}
              stroke-width={props.GRID_STROKE_WIDTH}
              fill="none"
              stroke-linecap="round"
            />
          )}
        </For>
        <For each={[1]}>
          {(loc) => (
            <g transform={`translate(0,5)`}>
              <path
                d={coordinateLine(timeVaryingWavy(time()), 1, loc)
                  .map((p, i) => (i === 0 ? `M ${p.x},${p.y}` : `L ${p.x},${p.y}`))
                  .join(" ")}
                stroke={props.GRID_COLOR}
                stroke-width={props.GRID_STROKE_WIDTH * 2}
                fill="none"
                stroke-linecap="round"
              />
            </g>
          )}
        </For>
        <For each={axisValues()}>
          {(x) => {
            const p = () => wavySpace().transform([x, wavySpace().bounds[1][1]]);

            return (
              <text x={p().x} y={p().y + 10} text-anchor="middle" font-size="4" fill={"black"}>
                {x.toFixed(1)}
              </text>
            );
          }}
        </For>
        <For each={axisValues()}>
          {(y) => {
            const p = () => wavySpace().transform([wavySpace().bounds[0][0], y]);

            return (
              <text x={p().x - 10} y={p().y} text-anchor="middle" font-size="4" fill={"black"}>
                {y.toFixed(1)}
              </text>
            );
          }}
        </For>
        <For each={points.map((p) => timeVaryingWavy(time()).transform([p.x, p.y]))}>
          {(p) => <circle cx={p.x} cy={p.y} r={1} fill={props.POINT_COLOR} stroke="white" stroke-width={0.25} />}
        </For>
        <path
          d={transformLine(rect, timeVaryingWavy(time()))
            .map((p, i) => (i === 0 ? `M ${p.x},${p.y}` : `L ${p.x},${p.y}`))
            .concat("Z")
            .join(" ")}
          fill={props.POINT_COLOR}
        />
      </g>
    </>
  );
};
