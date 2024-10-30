import { JSX } from "solid-js/jsx-runtime";
import { BBox, createLinSysBBox, DIMS } from "./_bbox";
import { createEffect, splitProps } from "solid-js";
import { PointMarkProps } from "./_point";

export type EllipseProps = PointMarkProps<Omit<JSX.EllipseSVGAttributes<SVGEllipseElement>, "rx" | "ry">>;

export const Ellipse = (props: EllipseProps) => {
  const [_, rest] = splitProps(props, DIMS);

  const bbox = createLinSysBBox();

  createEffect(() => {
    for (const dim of DIMS) {
      bbox[dim] = props[dim];
    }
  });

  return <ellipse cx={bbox.cx} cy={bbox.cy} rx={bbox.w ? bbox.w / 2 : 0} ry={bbox.h ? bbox.h / 2 : 0} {...rest} />;
};
