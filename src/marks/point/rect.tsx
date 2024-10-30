import { JSX } from "solid-js/jsx-runtime";
import { BBox, createLinSysBBox, DIMS } from "./_bbox";
import { createEffect, splitProps } from "solid-js";
import { PointMarkProps } from "./_point";

export type RectProps = PointMarkProps<JSX.RectSVGAttributes<SVGRectElement>>;

export const Rect = (props: RectProps) => {
  const [_, rest] = splitProps(props, DIMS);

  const bbox = createLinSysBBox();

  createEffect(() => {
    for (const dim of DIMS) {
      bbox[dim] = props[dim];
    }
    console.log(JSON.stringify(bbox));
  });

  return <rect {...rest} x={bbox.x} y={bbox.y} width={bbox.w} height={bbox.h} />;
};
