import { createEffect, createSignal, For, type Component } from "solid-js";

import logo from "./logo.svg";
import styles from "./App.module.css";
import balloon from "./assets/balloon.png";
import { Balloons } from "./examples/balloon";
import { Space } from "./examples/library/spaces/spaceType";
import { lerp } from "./examples/library/util";
import { linear } from "./examples/library/spaces/linear";
import { randomPoint, randomPolarPoint } from "./examples/library/spaces/randomPoint";
import { barycentric, barycentricConstrain } from "./examples/library/spaces/barycentric";
import { subdivideLine, transformLine } from "./examples/library/geometry/line";
import { Wavy } from "./examples/wavy";
import { coordinateLine } from "./examples/library/spaces/coordinateLine";
import { Barycentric } from "./examples/barycentric";
import { polar } from "./examples/library/spaces/polar";
import { Polar } from "./examples/polar";
import { PieChart } from "./examples/pieChart";
import { Button } from "./examples/library/inputs/button";
import { SplotchyFlickering } from "./examples/library/filters/splotchyFlickering";
import { Moss } from "./examples/library/filters/moss";
import { Canvas } from "./examples/library/filters/canvas";

const scaleFactor = 10;

/* to make a pie chart from scratch, you must first invent transform the areas */

const SVG_PADDING = 500;
const POINT_COLOR = "#0369A1";
const GRID_COLOR = "#CBD5E1";
const GRID_STROKE_WIDTH = 0.25;

const App: Component = () => {
  const [animate, setAnimate] = createSignal(true);

  return (
    <div>
      <svg width={100 * scaleFactor + SVG_PADDING} height={100 * scaleFactor + SVG_PADDING}>
        <defs>
          {/* <filter id="screentone-fine-pulsing">
            <feImage
              id="SvgjsFeImage1785"
              cellheight="4"
              cellwidth="4"
              dx="10"
              dy="10"
              filtername="feImage"
              href="#1bGD2van"
              patterntype="grid"
              result="BcGV3I"
              rotation="0"
              sx="20"
              sy="20"
              type="turbulence"
              unitrot="0"
              unittype="circle"
              animation='{"cellwidth":"{\"attributeName\":\"cellwidth\",\"dur\":\"2.2\",\"values\":\"3;1;3\"}","cellheight":"{\"attributeName\":\"cellheight\",\"dur\":\"2.2\",\"values\":\"3;1;3\"}"}'
            >
              <animate
                attributeName="cellwidth"
                dur="2.2"
                values="3;1;3"
                attributeType="XML"
                repeatCount="indefinite"
              />
              <animate
                attributeName="cellheight"
                dur="2.2"
                values="3;1;3"
                attributeType="XML"
                repeatCount="indefinite"
              />
            </feImage>
            <feImage
              id="SvgjsFeImage1788"
              cellheight="4"
              cellwidth="4"
              dx="10"
              dy="10"
              filtername="feImage"
              href="#mEb90HXk"
              patterntype="grid"
              result="pe2jcK"
              rotation="0"
              sx="5"
              sy="5"
              type="turbulence"
              unitrot="0"
              unittype="circle"
              animation='{"cellwidth":"{\"attributeName\":\"cellwidth\",\"dur\":\"2.2\",\"values\":\"1;3;1\"}","cellheight":"{\"attributeName\":\"cellheight\",\"dur\":\"2.2\",\"values\":\"1;3;1\"}"}'
            >
              <animate
                attributeName="cellwidth"
                dur="2.2"
                values="1;3;1"
                attributeType="XML"
                repeatCount="indefinite"
              />
              <animate
                attributeName="cellheight"
                dur="2.2"
                values="1;3;1"
                attributeType="XML"
                repeatCount="indefinite"
              />
            </feImage>
            <feComposite
              id="SvgjsFeComposite1791"
              filtername="feComposite"
              in="pe2jcK"
              in2="BcGV3I"
              operator="over"
              result="1iiEfs"
            />
            <feComposite
              id="SvgjsFeComposite1792"
              filtername="feComposite"
              in="SourceGraphic"
              in2="1iiEfs"
              operator="in"
              result="yezH8r"
            />
          </filter> */}
          <SplotchyFlickering />
          <Moss />
          <Canvas />
        </defs>
        <g transform={`translate(10, ${100 * scaleFactor - 10})`}>
          <For each={[0.3, 0.5, 0.8, 0.4, 0.6, 0.2, 0.7]}>
            {(height, i) => (
              <rect
                x={i() * 30}
                y={-height * 50 * scaleFactor}
                width={25}
                height={height * 50 * scaleFactor}
                fill="red"
                // filter="url(#splotchy-flickering)"
                // filter="url(#moss)"
                filter="url(#canvas)"
                // clip-path={`url(#rect-clip-${i()})`}
              />
            )}
          </For>
        </g>
      </svg>
      <br />
      <Button bind={[animate, setAnimate]}>{animate() ? "Stop" : "Start"}</Button>
      <br />
      <svg width={100 * scaleFactor + SVG_PADDING} height={100 * scaleFactor + SVG_PADDING}>
        {/* bar chart */}
        <Balloons />
        {/* linear and timeVaryingWavy */}
        <Wavy
          SVG_PADDING={SVG_PADDING}
          scaleFactor={scaleFactor}
          GRID_COLOR={GRID_COLOR}
          GRID_STROKE_WIDTH={GRID_STROKE_WIDTH}
          POINT_COLOR={POINT_COLOR}
          animate={animate()}
        />
        {/* barycentric */}
        {/* <Barycentric
          SVG_PADDING={SVG_PADDING}
          scaleFactor={scaleFactor}
          GRID_COLOR={GRID_COLOR}
          GRID_STROKE_WIDTH={GRID_STROKE_WIDTH}
          POINT_COLOR={POINT_COLOR}
        /> */}
        {/* polar */}
        {/* <Polar
          SVG_PADDING={SVG_PADDING}
          scaleFactor={scaleFactor}
          GRID_COLOR={GRID_COLOR}
          GRID_STROKE_WIDTH={GRID_STROKE_WIDTH}
          POINT_COLOR={POINT_COLOR}
        /> */}
        {/*   <PieChart
          SVG_PADDING={SVG_PADDING}
          scaleFactor={scaleFactor}
          GRID_COLOR={GRID_COLOR}
          GRID_STROKE_WIDTH={GRID_STROKE_WIDTH}
          POINT_COLOR={POINT_COLOR}
        /> */}
        {/* <g
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
          <For each={polarPoints}>
            {(p) => <circle cx={p.x} cy={p.y} r={1} fill={POINT_COLOR} stroke="white" stroke-width={0.25} />}
          </For>
          <path
            d={transformLine(polarRect, polar)
              .map((p, i) => (i === 0 ? `M ${p.x},${p.y}` : `L ${p.x},${p.y}`))
              .join(" ")}
            fill={POINT_COLOR}
          />
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
        </g> */}
      </svg>
    </div>
  );
};

export default App;
