export type Space<T> = {
  transform: (domain: T) => { x: number; y: number };
  inverse?: (point: { x: number; y: number }) => T;
};

export type Space2 = {
  bounds: [number, number][];
  transform: (domain: number[]) => { x: number; y: number };
  inverse?: (point: { x: number; y: number }) => number[];
  coordinateLine: (dim: number, percent: number) => { x: number; y: number }[];
};

// inspired by mafs.dev
export type Space3 = {
  // should this go on the grid instead of the space? well... it's probably necessary for the
  // transform or something... maybe? or like how does the grid know what bounds to use?
  bounds: [number, number][];
  transform: (domain: number[]) => { x: number; y: number };
  inverse?: (point: { x: number; y: number }) => number[];
  coordinateLine: (dim: number, value: number) => { x: number; y: number }[];
};

// interval taken from observable plot
// observable plot uses ticks, tickSpacing, and interval jointly to specify line spacing
/* 
By default, the data for an axis mark are tick values sampled from the associated scale’s domain. If desired, you can specify the data explicitly (e.g. as an array of numbers), or use one of the following options:

ticks - the approximate number of ticks to generate, or interval, or array of values
tickSpacing - the approximate number of pixels between ticks (if ticks is not specified) (spacing in pixels)
interval - an interval or time interval (spacing in data units)
*/
export const grid3 = (space: Space3, interval: number /* , subdivisions: number */) => {
  const grid = [];
  for (let dim = 0; dim < space.bounds.length; dim++) {
    // TODO: should this be line spacing or something??? should it just be an array of lines? should
    // it be each axis individually instead of the whole grid?
    for (let i = 0; i < interval; i++) {
      const value = space.bounds[dim][0] + ((space.bounds[dim][1] - space.bounds[dim][0]) * i) / (interval - 1);
      grid.push(...space.coordinateLine(dim, value));
    }
  }
  return grid;
};

/* observation: I'm trying to get everything right up front rather than rendering shit to the screen
until it works!!! How do I keep track of the slop so that I can correct/improve it later? */
