import { Dim } from "../../util/bbox";
export type PointMarkProps<T> = {
  [key in Dim]?: number;
} & Omit<T, Dim>;
