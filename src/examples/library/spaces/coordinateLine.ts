import { lerp } from "../util";
import { Space } from "./spaceType";

// optional constrain parameter is used if there are more than 2 dimensions to constrain the line.
// otherwise the line is undetermined
export const coordinateLine = <Domain extends number[]>(
  space: Space<Domain>,
  dim: number,
  loc: number,
  constrain: (dim: number, t: number) => number = (dim, t) => lerp(space.bounds[dim][0], space.bounds[dim][1], t),
  SAMPLES: number = 100
) => {
  // sample the space at dim=value and generate a path
  const points = [];

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
