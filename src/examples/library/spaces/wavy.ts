import { Space } from "./spaceType";

export const wavy: Space = {
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

export const timeVaryingWavy: (time: number) => Space = (time) => ({
  transform: ([x, y]) => ({
    x: x + 5 * Math.sin(y / 10 + time),
    y: y + 5 * Math.sin(x / 10 + time),
  }),
  bounds: [
    [-50, 50],
    [-50, 50],
  ],
});
