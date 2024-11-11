import { createEffect, createSignal, For, type Component } from "solid-js";

import logo from "./logo.svg";
import styles from "./App.module.css";

const scaleFactor = 10;

export type Space<Domain extends number[] = [number, number]> = {
  transform: (domain: Domain) => { x: number; y: number };
  // ensures that the bounds are an array of tuples with the same length as the domain
  bounds: { [K in keyof Domain]: [number, number] };
};

const polar: Space = {
  transform: ([r, theta]) => ({ x: r * Math.cos(theta), y: r * Math.sin(theta) }),
  bounds: [
    [0, 50],
    [0, 2 * Math.PI],
  ],
};

const equilateralTriangleBasisVectors = [
  [-0.5, 0],
  [0.5, 0],
  [0, -Math.sqrt(3) / 2],
];

const barycentric: Space<[number, number, number]> = {
  /* normalize the sum of the values to 1, then lerp basis vectors*/
  transform: ([x, y, z]) => {
    const sum = x + y + z;
    const normalized = [x / sum, y / sum, z / sum];
    const result = { x: 0, y: 0 };
    for (const [i, [x, y]] of equilateralTriangleBasisVectors.entries()) {
      result.x += x * normalized[i] * 100;
      result.y += y * normalized[i] * 100;
    }
    return result;
  },
  bounds: [
    [0, 1],
    [0, 1],
    [0, 1],
  ],
};

const wavy: Space = {
  transform: ([x, y]) => ({
    // Add sine waves to both x and y coordinates
    x: x + 5 * Math.sin(y / 10), // Wave in x direction based on y
    y: y + 5 * Math.sin(x / 10), // Wave in y direction based on x
  }),
  bounds: [
    [-50, 50], // x bounds
    [-50, 50], // y bounds
  ],
};

const timeVaryingWavy: (time: number) => Space = (time) => ({
  transform: ([x, y]) => ({
    x: x + 5 * Math.sin(y / 10 + time),
    y: y + 5 * Math.sin(x / 10 + time),
  }),
  bounds: [
    [-50, 50],
    [-50, 50],
  ],
});

const linear: Space = {
  transform: ([x, y]) => ({ x, y }),
  bounds: [
    [-50, 50],
    [-50, 50],
  ],
};

const randomPoint = <Domain extends number[]>(
  space: Space<Domain>,
  densityTransform: (dim: number, t: number) => number = (_, t) => t
) => {
  const point: Domain = space.bounds.map(([min, max], dim) => {
    const t = densityTransform(dim, Math.random());
    return t * (max - min) + min;
  }) as Domain;
  return space.transform(point);
};

const randomPolarPoint = () => randomPoint(polar, (dim, t) => (dim === 0 ? Math.sqrt(t) : t));

// const randomPolarPoint = (space: Space<[number, number]>) => {
//   // For uniform sampling in polar coordinates, we need to account for the sqrt change in density
//   // r should be sqrt of uniform random to compensate for increasing area with radius
//   const r = Math.sqrt(Math.random()) * (space.bounds[0][1] - space.bounds[0][0]) + space.bounds[0][0];
//   // theta can be uniform random
//   const theta = Math.random() * (space.bounds[1][1] - space.bounds[1][0]) + space.bounds[1][0];
//   const point: [number, number] = [r, theta];
//   return space.transform(point);
// };

const lerp = (min: number, max: number, t: number) => t * (max - min) + min;

// optional constrain parameter is used if there are more than 2 dimensions to constrain the line.
// otherwise the line is undetermined
const coordinateLine = <Domain extends number[]>(
  space: Space<Domain>,
  dim: number,
  loc: number,
  constrain: (dim: number, t: number) => number = (dim, t) => lerp(space.bounds[dim][0], space.bounds[dim][1], t)
) => {
  // sample the space at dim=value and generate a path
  const points = [];
  const SAMPLES = 100;

  for (let i = 0; i < SAMPLES; i++) {
    const t = i / (SAMPLES - 1);
    const domainPoint: Domain = Array(space.bounds.length).fill(0) as Domain;
    for (let i = 0; i < space.bounds.length; i++) {
      if (i === dim) {
        domainPoint[i] = lerp(space.bounds[dim][0], space.bounds[dim][1], loc);
      } else {
        domainPoint[i] = constrain(i, t);
      }
    }
    points.push(space.transform(domainPoint));
  }
  return points;
};

/* should be able to generate these lines in the end:

// Horizontal lines (constant b)
lines.push({
  // when b is fixedDim...
  // a lerps from 1-ratio to 0
  // c lerps from 0 to 1-ratio
  start: toCartesian({ a: 1 - ratio, b: ratio, c: 0 }),
  end: toCartesian({ a: 0, b: ratio, c: 1 - ratio })
});

// Left diagonal lines (constant c)
lines.push({
  // when c is fixedDim...
  // a lerps from 1-ratio to 0
  // b lerps from 0 to 1-ratio
  start: toCartesian({ a: 1 - ratio, b: 0, c: ratio }),
  end: toCartesian({ a: 0, b: 1 - ratio, c: ratio })
});

// Right diagonal lines (constant a)
lines.push({
  // when a is fixedDim...
  // b lerps from 0 to 1-ratio
  // c lerps from 1-ratio to 0
  start: toCartesian({ a: ratio, b: 0, c: 1 - ratio }),
  end: toCartesian({ a: ratio, b: 1 - ratio, c: 0 })
});

*/
const barycentricConstrain =
  (space: Space<[number, number, number]>, fixedDim: number, loc: number) => (dim: number, t: number) => {
    // COMBAK: there's a little bit of repeated work here that is already covered by the
    //         coordinateLine function, but it's not a big deal
    const ratio = lerp(space.bounds[fixedDim][0], space.bounds[fixedDim][1], loc);
    // if dim === fixedDim + 1 mod 3, then lerp from 0 to 1-ratio
    // if dim === fixedDim + 2 mod 3, then lerp from 1-ratio to 0
    if ((dim - fixedDim + 3) % 3 === 1) {
      return lerp(space.bounds[dim][0], space.bounds[dim][1] - ratio, t);
    } else if ((dim - fixedDim + 3) % 3 === 2) {
      return lerp(space.bounds[dim][1] - ratio, space.bounds[dim][0], t);
    }
    throw new Error("fixedDim === dim");
  };

/* to make a pie chart from scratch, you must first invent transform the areas */

// polyline, optionally closed
export type Line<Domain extends number[] = [number, number]> = {
  // COMBAK: this representation might be better than Domain[]...
  // points: { [K in keyof Domain]: number }[];
  points: Domain[];
  closed: boolean;
};

const transformLine = <Domain extends number[]>(line: Line<Domain>, space: Space<Domain>) => {
  return line.points.map((p) => space.transform(p));
};

const subdivideLine = <Domain extends number[]>(line: Line<Domain>, n: number): Line<Domain> => {
  const points = [];
  for (let i = 0; i < line.points.length - 1; i++) {
    const start = line.points[i];
    const end = line.points[i + 1];
    console.log("start, end", start, end);
    // subdivide n times
    for (let j = 0; j <= n; j++) {
      points.push(Array(start.length).fill(0) as Domain);
      for (let dim = 0; dim < start.length; dim++) {
        points[points.length - 1][dim] = lerp(start[dim], end[dim], j / (n + 1));
      }
    }
  }

  if (line.closed) {
    const last = line.points[line.points.length - 1];
    const first = line.points[0];
    console.log("last, first", last, first);
    // subdivide the last point
    for (let i = 0; i <= n; i++) {
      points.push(Array(last.length).fill(0) as Domain);
      for (let dim = 0; dim < last.length; dim++) {
        points[points.length - 1][dim] = lerp(last[dim], first[dim], i / (n + 1));
      }
    }
  }

  return { points, closed: line.closed };
};

const SVG_PADDING = 500;
const POINT_COLOR = "#0369A1";
const GRID_COLOR = "#CBD5E1";
const GRID_STROKE_WIDTH = 0.25;

const DISCRETE_COLOR_PALETTE = ["#0369A1", "#0284C7", "#0EA5E9", "#34D399", "#A3E635", "#FBBF24"];

const App: Component = () => {
  const points = Array.from({ length: 100 }).map(() => randomPoint(linear));
  const polarPoints = Array.from({ length: 1000 }).map(() => randomPolarPoint());
  const barycentricPoints = Array.from({ length: 100 }).map(() => randomPoint(barycentric));

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

  const polarRect = subdivideLine(
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

  const [time, setTime] = createSignal(0);

  setInterval(() => {
    setTime(time() + 0.01);
  }, 1000 / 60);

  return (
    <div>
      <svg width={100 * scaleFactor + SVG_PADDING} height={100 * scaleFactor + SVG_PADDING}>
        {/* linear and timeVaryingWavy */}
        {/* <g
          transform={`translate(${SVG_PADDING / 2 + (100 * scaleFactor) / 2 / 2}, ${
            SVG_PADDING / 2 + (100 * scaleFactor) / 2 / 2
          }) scale(${scaleFactor / 2})`}
        >
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
          <path
            d={transformLine(rect, linear)
              .map((p, i) => (i === 0 ? `M ${p.x},${p.y}` : `L ${p.x},${p.y}`))
              .concat("Z")
              .join(" ")}
            fill={POINT_COLOR}
          />
        </g>
        <g
          transform={`translate(${SVG_PADDING / 2 + (100 * scaleFactor) / 2 / 2 + 70 * scaleFactor}, ${
            SVG_PADDING / 2 + (100 * scaleFactor) / 2 / 2
          }) scale(${scaleFactor / 2})`}
        >
          <For each={[0, 0.2, 0.4, 0.6, 0.8, 1]}>
            {(loc) => (
              <path
                d={coordinateLine(timeVaryingWavy(time()), 0, loc)
                  .map((p, i) => (i === 0 ? `M ${p.x},${p.y}` : `L ${p.x},${p.y}`))
                  .join(" ")}
                stroke={GRID_COLOR}
                stroke-width={GRID_STROKE_WIDTH}
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
                  stroke={GRID_COLOR}
                  stroke-width={GRID_STROKE_WIDTH * 2}
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
                stroke={GRID_COLOR}
                stroke-width={GRID_STROKE_WIDTH}
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
                  stroke={GRID_COLOR}
                  stroke-width={GRID_STROKE_WIDTH * 2}
                  fill="none"
                  stroke-linecap="round"
                />
              </g>
            )}
          </For>
          <For each={points.map((p) => timeVaryingWavy(time()).transform([p.x, p.y]))}>
            {(p) => <circle cx={p.x} cy={p.y} r={1} fill={POINT_COLOR} stroke="white" stroke-width={0.25} />}
          </For>
          <path
            d={transformLine(rect, timeVaryingWavy(time()))
              .map((p, i) => (i === 0 ? `M ${p.x},${p.y}` : `L ${p.x},${p.y}`))
              .concat("Z")
              .join(" ")}
            fill={POINT_COLOR}
          />
        </g> */}
        {/* barycentric */}
        {/* <g
          transform={`translate(${SVG_PADDING / 2 + (100 * scaleFactor) / 2 / 2}, ${
            SVG_PADDING / 2 + (100 * scaleFactor) / 2 / 2
          }) scale(${scaleFactor / 2})`}
        >
          <For each={[0, 1, 2]}>
            {(dim) => (
              <For each={[0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]}>
                {(loc) => (
                  <path
                    d={coordinateLine(barycentric, dim, loc, barycentricConstrain(barycentric, dim, loc))
                      .map((p, i) => (i === 0 ? `M ${p.x},${p.y}` : `L ${p.x},${p.y}`))
                      .join(" ")}
                    stroke={GRID_COLOR}
                    stroke-width={GRID_STROKE_WIDTH}
                    fill="none"
                    stroke-linecap="round"
                  />
                )}
              </For>
            )}
          </For>
          <For each={barycentricPoints}>
            {(p) => <circle cx={p.x} cy={p.y} r={1} fill={POINT_COLOR} stroke="white" stroke-width={0.25} />}
          </For>
        </g> */}
        {/* polar */}
        <g
          transform={`translate(${SVG_PADDING / 2 + (100 * scaleFactor) / 2 / 2}, ${
            SVG_PADDING / 2 + (100 * scaleFactor) / 2 / 2
          }) scale(${scaleFactor / 2})`}
        >
          <For each={[0, 1]}>
            {(dim) => (
              <For each={[0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]}>
                {(loc) => (
                  <path
                    d={coordinateLine(polar, dim, loc)
                      .map((p, i) => (i === 0 ? `M ${p.x},${p.y}` : `L ${p.x},${p.y}`))
                      .join(" ")}
                    stroke={GRID_COLOR}
                    stroke-width={GRID_STROKE_WIDTH}
                    fill="none"
                    stroke-linecap="round"
                  />
                )}
              </For>
            )}
          </For>
          {/* <For each={polarPoints}>
            {(p) => <circle cx={p.x} cy={p.y} r={1} fill={POINT_COLOR} stroke="white" stroke-width={0.25} />}
          </For> */}
          {/* <path
            d={transformLine(polarRect, polar)
              .map((p, i) => (i === 0 ? `M ${p.x},${p.y}` : `L ${p.x},${p.y}`))
              .join(" ")}
            fill={POINT_COLOR}
          /> */}
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
      </svg>
    </div>
  );
};

export default App;
