import { PointMarkProps } from "./point";

// TODO: might also need gluing of line marks for eg contour plots
// TODO: is width and height necessary?
export type AreaMarkProps<T> =
  /* sampling (eg voronoi) */
  PointMarkProps<T>[][] | /* grid (eg raster) */ { w: number; h: number; data: T[][] };
