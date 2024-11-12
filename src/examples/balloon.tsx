import { For } from "solid-js";
import balloon from "../assets/balloon.png";

const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

// TODO: this is not really accurate...
// Calculate sepia, brightness and hue-rotate values
const calculateFilters = (hex: string) => {
  const rgb = hexToRgb(hex);
  if (!rgb) return "";

  // Convert RGB to HSL to get brightness
  const max = Math.max(rgb.r, rgb.g, rgb.b) / 255;
  const min = Math.min(rgb.r, rgb.g, rgb.b) / 255;
  const brightness = (max + min) / 2;

  // Calculate hue rotation
  let hue = 0;
  if (max !== min) {
    const d = max - min;
    if (max === rgb.r / 255) {
      hue = (rgb.g / 255 - rgb.b / 255) / d + (rgb.g / 255 < rgb.b / 255 ? 6 : 0);
    } else if (max === rgb.g / 255) {
      hue = (rgb.b / 255 - rgb.r / 255) / d + 2;
    } else {
      hue = (rgb.r / 255 - rgb.g / 255) / d + 4;
    }
    hue *= 60;
  }

  return `sepia(1) brightness(${brightness + 0.5}) hue-rotate(${hue}deg)`;
};

const width = 8;
const padding = 2;

const barChartData = [
  { x: 0, width: 10, height: 10 + 10, color: "#0369A1" },
  { x: 10, width: 20, height: 20 + 10, color: "#0284C7" },
  { x: 30, width: 30, height: 30 + 10, color: "#0EA5E9" },
  { x: 60, width: 40, height: 40 + 10, color: "#34D399" },
  { x: 100, width: 50, height: 50 + 10, color: "#A3E635" },
  { x: 150, width: 60, height: 60 + 10, color: "#FBBF24" },
];

export const Balloons = () => {
  return (
    <>
      <For each={barChartData}>
        {(data, i) => (
          // <rect
          //   x={20 + i() * (width + padding)}
          //   y={100 - data.height}
          //   width={width}
          //   height={data.height}
          //   fill={data.color}
          // />
          <>
            <image
              x={20 + i() * (width + padding)}
              y={100 - data.height}
              href={balloon}
              width={width}
              style={{
                filter: `drop-shadow(0px ${data.height}px 4px ${data.color}) ${calculateFilters(data.color)}`,
              }}
            />
            <path
              d={`M ${20 + i() * (width + padding) + width / 2} ${100 - data.height + width * 1.4}
                   C ${20 + i() * (width + padding) + width / 2 - data.height / 10} ${
                100 - data.height + width * 1.4 + data.height / 3
              }
                     ${20 + i() * (width + padding) + width / 2 + data.height / 10} ${
                100 - data.height + width * 1.4 + (data.height * 2) / 3
              }
                     ${20 + i() * (width + padding) + width / 2} ${100}`}
              stroke={data.color}
              stroke-width="0.25"
              fill="none"
            />
          </>
        )}
      </For>
    </>
  );
};
