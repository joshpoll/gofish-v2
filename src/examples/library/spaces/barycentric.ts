import { lerp } from "../util";
import { Space } from "./spaceType";

const equilateralTriangleBasisVectors = [
  [-0.5, 0],
  [0.5, 0],
  [0, -Math.sqrt(3) / 2],
];

export const barycentric: Space<[number, number, number]> = {
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

/* TODO: maybe fold into Space type?? */
export const barycentricConstrain =
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
