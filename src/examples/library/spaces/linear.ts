import { Space } from "./spaceType";

export const linear: Space = {
  transform: ([x, y]) => ({ x, y }),
  bounds: [
    [-50, 50],
    [-50, 50],
  ],
};
