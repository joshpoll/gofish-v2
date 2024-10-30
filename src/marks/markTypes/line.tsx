import { PointMarkProps } from "./point";

// TODO: I'm not totally sure this is right... the 1D grid part seems unnecessary?
export type LineMarkProps<T> =
  /* sampling */
  | PointMarkProps<T>[]
  | /* 1D grid (ie graph?) (ie discrete thing?) */ {
      y: number;
      cy: number;
      y2: number;
      h: number;
    }[]
  | {
      x: number;
      xy: number;
      x2: number;
      w: number;
    }[];
