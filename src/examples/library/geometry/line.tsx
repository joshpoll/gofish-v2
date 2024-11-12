import { Space } from "../spaces/spaceType";
import { lerp } from "../util";

// polyline, optionally closed
export type Line<Domain extends number[] = [number, number]> = {
  // COMBAK: this representation might be better than Domain[]...
  // points: { [K in keyof Domain]: number }[];
  points: Domain[];
  closed: boolean;
};

export const transformLine = <Domain extends number[]>(line: Line<Domain>, space: Space<Domain>) => {
  return line.points.map((p) => space.transform(p));
};

export const subdivideLine = <Domain extends number[]>(line: Line<Domain>, n: number): Line<Domain> => {
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
