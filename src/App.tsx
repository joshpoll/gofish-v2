import { For, type Component } from "solid-js";

import logo from "./logo.svg";
import styles from "./App.module.css";

const scaleFactor = 10;

export type Space = {
  transform: (domain: [number, number]) => { x: number; y: number };
  bounds: [number, number][];
};

const polar: Space = {
  transform: ([r, theta]: [number, number]) => ({ x: r * Math.cos(theta), y: r * Math.sin(theta) }),
  bounds: [
    [0, 50],
    [0, 2 * Math.PI],
  ],
};

const wavy: Space = {
  transform: ([x, y]: [number, number]) => ({
    // Add sine waves to both x and y coordinates
    x: x + 5 * Math.sin(y / 10), // Wave in x direction based on y
    y: y + 5 * Math.sin(x / 10), // Wave in y direction based on x
  }),
  bounds: [
    [-50, 50], // x bounds
    [-50, 50], // y bounds
  ],
};

const linear: Space = {
  transform: ([x, y]: [number, number]) => ({ x, y }),
  bounds: [
    [-50, 50],
    [-50, 50],
  ],
};

const randomPoint = (space: Space) => {
  const point: [number, number] = space.bounds.map(([min, max]) => Math.random() * (max - min) + min) as [
    number,
    number
  ];
  return space.transform(point);
};

const coordinateLine = (space: Space, dim: number, loc: number) => {
  // sample the space at dim=value and generate a path
  const points = [];
  const SAMPLES = 100;
  // Calculate the lerped value for the fixed dimension
  const value = (space.bounds[dim][1] - space.bounds[dim][0]) * loc + space.bounds[dim][0];

  for (let i = 0; i < SAMPLES; i++) {
    const t = i / (SAMPLES - 1);
    const domainPoint: [number, number] = [0, 0];
    for (let i = 0; i < space.bounds.length; i++) {
      if (i === dim) {
        domainPoint[i] = value;
      } else {
        domainPoint[i] = t * (space.bounds[i][1] - space.bounds[i][0]) + space.bounds[i][0];
      }
    }
    points.push(space.transform(domainPoint));
  }
  return points;
};

const SVG_PADDING = 500;
const POINT_COLOR = "#0369A1";
const GRID_COLOR = "#CBD5E1";
const GRID_STROKE_WIDTH = 0.25;

const App: Component = () => {
  const points = Array.from({ length: 100 }).map(() => randomPoint(linear));

  return (
    <div>
      <svg width={100 * scaleFactor + SVG_PADDING} height={100 * scaleFactor + SVG_PADDING}>
        <g
          transform={`translate(${SVG_PADDING / 2 + (100 * scaleFactor) / 2 / 2}, ${
            SVG_PADDING / 2 + (100 * scaleFactor) / 2 / 2
          }) scale(${scaleFactor / 2})`}
        >
          {/* some grid lines */}
          <For each={[0, 0.2, 0.4, 0.6, 0.8, 1]}>
            {(loc) => (
              <path
                d={coordinateLine(linear, 0, loc)
                  .map((p, i) => (i === 0 ? `M ${p.x},${p.y}` : `L ${p.x},${p.y}`))
                  .join(" ")}
                stroke={GRID_COLOR}
                stroke-width={GRID_STROKE_WIDTH}
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
                stroke={GRID_COLOR}
                stroke-width={GRID_STROKE_WIDTH}
                fill="none"
                stroke-linecap="round"
              />
            )}
          </For>
          <For each={points}>
            {(p) => <circle cx={p.x} cy={p.y} r={1} fill={POINT_COLOR} stroke="white" stroke-width={0.25} />}
          </For>
        </g>
        <g
          transform={`translate(${SVG_PADDING / 2 + (100 * scaleFactor) / 2 / 2 + 70 * scaleFactor}, ${
            SVG_PADDING / 2 + (100 * scaleFactor) / 2 / 2
          }) scale(${scaleFactor / 2})`}
        >
          {/* some grid lines */}
          <For each={[0, 0.2, 0.4, 0.6, 0.8, 1]}>
            {(loc) => (
              <path
                d={coordinateLine(wavy, 0, loc)
                  .map((p, i) => (i === 0 ? `M ${p.x},${p.y}` : `L ${p.x},${p.y}`))
                  .join(" ")}
                stroke={GRID_COLOR}
                stroke-width={GRID_STROKE_WIDTH}
                fill="none"
                stroke-linecap="round"
              />
            )}
          </For>
          <For each={[0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]}>
            {(loc) => (
              <path
                d={coordinateLine(wavy, 1, loc)
                  .map((p, i) => (i === 0 ? `M ${p.x},${p.y}` : `L ${p.x},${p.y}`))
                  .join(" ")}
                stroke={GRID_COLOR}
                stroke-width={GRID_STROKE_WIDTH}
                fill="none"
                stroke-linecap="round"
              />
            )}
          </For>
          <For each={points.map((p) => wavy.transform([p.x, p.y]))}>
            {(p) => <circle cx={p.x} cy={p.y} r={1} fill={POINT_COLOR} stroke="white" stroke-width={0.25} />}
          </For>
        </g>
        {/* <For each={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}>
          {(loc, i) => (
            <line x1={0} y1={loc * scaleFactor} x2={100 * scaleFactor} y2={loc * scaleFactor} stroke="black" />
          )}
        </For>
        <For each={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}>
          {(loc, i) => (
            <line x1={loc * scaleFactor} y1={0} x2={loc * scaleFactor} y2={100 * scaleFactor} stroke="black" />
          )}
        </For> */}
      </svg>
    </div>
  );
};

export default App;
