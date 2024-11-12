import { Space } from "./spaceType";

export const polar: Space = {
  transform: ([r, theta]) => ({ x: r * Math.cos(theta), y: r * Math.sin(theta) }),
  bounds: [
    [0, 50],
    [0, 2 * Math.PI],
  ],
};
