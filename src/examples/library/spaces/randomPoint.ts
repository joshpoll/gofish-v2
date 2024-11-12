import { polar } from "./polar";
import { Space } from "./spaceType";

export const randomPoint = <Domain extends number[]>(
  space: Space<Domain>,
  densityTransform: (dim: number, t: number) => number = (_, t) => t
) => {
  const point: Domain = space.bounds.map(([min, max], dim) => {
    const t = densityTransform(dim, Math.random());
    return t * (max - min) + min;
  }) as Domain;
  return space.transform(point);
};

export const randomPolarPoint = () => randomPoint(polar, (dim, t) => (dim === 0 ? Math.sqrt(t) : t));
