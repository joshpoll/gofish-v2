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

const coordinateLine = (space: Space, dim: number, value: number) => {
  // sample the space at dim=value and generate a path
  const points = [];
  const SAMPLES = 100;
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

const SVG_PADDING = 10;

const App: Component = () => {
  return (
    <div>
      <svg width={100 * scaleFactor + SVG_PADDING} height={100 * scaleFactor + SVG_PADDING}>
        <g
          transform={`translate(${SVG_PADDING / 2 + (100 * scaleFactor) / 2}, ${
            SVG_PADDING / 2 + (100 * scaleFactor) / 2
          }) scale(${scaleFactor})`}
        >
          {/* some grid lines */}
          <For each={[0, 10, 20, 30, 40, 50]}>
            {(loc) => (
              <path
                d={coordinateLine(polar, 0, loc)
                  .map((p, i) => (i === 0 ? `M ${p.x},${p.y}` : `L ${p.x},${p.y}`))
                  .join(" ")}
                stroke="black"
                stroke-width={0.5}
                fill="none"
              />
            )}
          </For>
          <For each={[0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]}>
            {(loc) => (
              <path
                d={coordinateLine(polar, 1, 2 * Math.PI * loc)
                  .map((p, i) => (i === 0 ? `M ${p.x},${p.y}` : `L ${p.x},${p.y}`))
                  .join(" ")}
                stroke="black"
                stroke-width={0.5}
                fill="none"
              />
            )}
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
