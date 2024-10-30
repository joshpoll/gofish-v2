import { createMemo, untrack } from "solid-js";
import { maybeAdd, maybeDiv, maybeMax, maybeMin, maybeSub } from "./maybe";
import { createStore, produce } from "solid-js/store";

export const HORIZONTAL_DIMS = ["x", "cx", "x2", "w"] as const;
export const VERTICAL_DIMS = ["y", "cy", "y2", "h"] as const;

export const DIMS = [...HORIZONTAL_DIMS, ...VERTICAL_DIMS] as const;
export type Dim = (typeof DIMS)[number];

export type Axis = "vertical" | "horizontal";

export const axisMap: { [key in Dim]: Axis } = {
  x: "horizontal",
  cx: "horizontal",
  x2: "horizontal",
  y: "vertical",
  cy: "vertical",
  y2: "vertical",
  w: "horizontal",
  h: "vertical",
};

export type BBox<T = number> = { [key in Dim]?: T };

export const from = (bboxes: BBox[]): BBox => {
  if (bboxes.length === 0)
    return {
      cx: 0,
      cy: 0,
      w: 0,
      h: 0,
    };

  const bboxesStructOfArray = {
    x: bboxes.map((bbox) => bbox.x),
    y: bboxes.map((bbox) => bbox.y),
    w: bboxes.map((bbox) => bbox.w),
    h: bboxes.map((bbox) => bbox.h),
  };

  const x = maybeMin(bboxesStructOfArray.x);

  const x2 = maybeMax(bboxesStructOfArray.x.map((x, i) => maybeAdd(x, bboxesStructOfArray.w[i])));

  const y = maybeMin(bboxesStructOfArray.y);

  const y2 = maybeMax(bboxesStructOfArray.y.map((y, i) => maybeAdd(y, bboxesStructOfArray.h[i])));

  const w = maybeSub(x2, x);
  const h = maybeSub(y2, y);

  const cx = maybeAdd(x, maybeDiv(w, 2));
  const cy = maybeAdd(y, maybeDiv(h, 2));

  return { cx, cy, w, h };
};

// The coefficients for the linear equations that define the bounding box dimensions in terms of
// center and size.
// For example, left = 1 * centerX - 0.5 * width, so its entry is [1, -0.5].
export const dimVecs = {
  horizontal: {
    x: [1, -0.5],
    x2: [1, 0.5],
    cx: [1, 0],
    w: [0, 1],
  },
  vertical: {
    y: [1, -0.5],
    y2: [1, 0.5],
    cy: [1, 0],
    h: [0, 1],
  },
} as const satisfies { [key in Axis]: { [key in Dim]?: [number, number] } };

// solve 2x2 system given two equations e1 and e2
export const solveSystem = (
  e1: [readonly [number, number], number],
  e2: [readonly [number, number], number]
): [number, number] => {
  const a = e1[0][0];
  const b = e1[0][1];
  const c = e1[1];
  const d = e2[0][0];
  const e = e2[0][1];
  const f = e2[1];

  const det = a * e - b * d;

  if (det === 0) {
    throw new Error("system is not solvable");
  }

  const center = (e * c - b * f) / det;
  const size = (a * f - c * d) / det;

  return [center, size];
};

// If eq = [[a, b], c] and vec = [x, y], then this function checks: a * x + b * y = c
export const checkLinearEq = (
  eq: [readonly [number, number], number],
  vec: readonly [number, number],
  tolerance = 1e-6
): boolean => {
  const [a, b] = eq[0];
  const c = eq[1];
  return Math.abs(a * vec[0] + b * vec[1] - c) < tolerance;
};

// If eq = [a, b] and vec = [x, y], then this function computes: a * x + b * y
export const computeLinearExpr = (eq: readonly [number, number], vec: readonly [number, number]) =>
  eq[0] * vec[0] + eq[1] * vec[1];

/* 
Creates a linear system of equations representing the bounding box dimensions.

Dimensions along the x- and y-axes are defined using a 2x2 linear system for each axis. Two linear
equations are sufficient to define all the dimensions along a single axis. For example, once left
and right are specified, width and centerX can be inferred. The bounding box dimensions have three
behaviors depending on the number of equations specified:
- (<2): When fewer than two equations are specified, only the property set directly for that axis can be
        read.
- (=2): Once there are at least two equations, all the properties can be read. Properties that were
  not set directly are marked as "inferred," because they are not directly owned.
- (>2): If a user adds more equations, the system checks that the new equations are consistent with the
        existing ones.
*/
export const createLinSysBBox = (): BBox => {
  const [equations, setEquations] = createStore<{
    [key in Axis]: { [key in Dim]?: [readonly [number, number], number] };
  }>({
    horizontal: {},
    vertical: {},
  });

  const centerXAndWidth = createMemo(() => {
    const xEqs = Object.values(equations.horizontal);
    if (xEqs.length < 2) return undefined;
    else {
      const [centerX, width] = solveSystem(xEqs[0], xEqs[1]);
      if (xEqs.length > 2) {
        // check the other equations
        for (const eq of xEqs.slice(2)) {
          if (!checkLinearEq(eq, [centerX, width])) {
            throw new Error(`System is not solvable. Equations: ${JSON.stringify(xEqs)}`);
          }
        }
      }
      return [centerX, width] satisfies [number, number];
    }
  });

  const centerYAndHeight = createMemo(() => {
    const yEqs = Object.values(equations.vertical);
    if (yEqs.length < 2) return undefined;
    else {
      const [centerY, height] = solveSystem(yEqs[0], yEqs[1]);
      if (yEqs.length > 2) {
        // check the other equations
        for (const eq of yEqs.slice(2)) {
          if (!checkLinearEq(eq, [centerY, height])) {
            throw new Error(`System is not solvable. Equations: ${JSON.stringify(yEqs)}`);
          }
        }
      }
      return [centerY, height] satisfies [number, number];
    }
  });

  return {
    get x() {
      if ("x" in equations.horizontal) {
        return equations.horizontal.x![1];
      }
      const cw = centerXAndWidth();
      return cw ? computeLinearExpr(cw, dimVecs.horizontal.x) : undefined;
    },
    set x(x: number | undefined) {
      if (x === undefined) {
        setEquations(
          "horizontal",
          produce((dims) => {
            delete dims.x;
          })
        );
      } else {
        setEquations("horizontal", "x", [dimVecs.horizontal.x, x]);
      }
    },
    get cx() {
      if ("cx" in equations.horizontal) {
        return equations.horizontal.cx![1];
      }
      const cw = centerXAndWidth();
      return cw ? computeLinearExpr(cw, dimVecs.horizontal.cx) : undefined;
    },
    set cx(cx: number | undefined) {
      if (cx === undefined) {
        setEquations(
          "horizontal",
          produce((dims) => {
            delete dims.cx;
          })
        );
      } else {
        setEquations("horizontal", "cx", [dimVecs.horizontal.cx, cx]);
      }
    },
    get x2() {
      if ("x2" in equations.horizontal) {
        return equations.horizontal.x2![1];
      }
      const cw = centerXAndWidth();
      return cw ? computeLinearExpr(cw, dimVecs.horizontal.x2) : undefined;
    },
    set x2(x2: number | undefined) {
      if (x2 === undefined) {
        setEquations(
          "horizontal",
          produce((dims) => {
            delete dims.x2;
          })
        );
      } else {
        setEquations("horizontal", "x2", [dimVecs.horizontal.x2, x2]);
      }
    },
    get w() {
      if ("w" in equations.horizontal) {
        return equations.horizontal.w![1];
      }
      const cw = centerXAndWidth();
      return cw ? computeLinearExpr(cw, dimVecs.horizontal.w) : undefined;
    },
    set w(w: number | undefined) {
      if (w === undefined) {
        setEquations(
          "horizontal",
          produce((dims) => {
            delete dims.w;
          })
        );
      } else {
        setEquations("horizontal", "w", [dimVecs.horizontal.w, w]);
      }
    },
    get y() {
      if ("y" in equations.vertical) {
        return equations.vertical.y![1];
      }
      const ch = centerYAndHeight();
      return ch ? computeLinearExpr(ch, dimVecs.vertical.y) : undefined;
    },
    set y(y: number | undefined) {
      if (y === undefined) {
        setEquations(
          "vertical",
          produce((dims) => {
            delete dims.y;
          })
        );
      } else {
        setEquations("vertical", "y", [dimVecs.vertical.y, y]);
      }
    },
    get cy() {
      if ("cy" in equations.vertical) {
        return equations.vertical.cy![1];
      }
      const ch = centerYAndHeight();
      return ch ? computeLinearExpr(ch, dimVecs.vertical.cy) : undefined;
    },
    set cy(cy: number | undefined) {
      if (cy === undefined) {
        setEquations(
          "vertical",
          produce((dims) => {
            delete dims.cy;
          })
        );
      } else {
        setEquations("vertical", "cy", [dimVecs.vertical.cy, cy]);
      }
    },
    get y2() {
      if ("y2" in equations.vertical) {
        return equations.vertical.y2![1];
      }
      const ch = centerYAndHeight();
      return ch ? computeLinearExpr(ch, dimVecs.vertical.y2) : undefined;
    },
    set y2(y2: number | undefined) {
      if (y2 === undefined) {
        setEquations(
          "vertical",
          produce((dims) => {
            delete dims.y2;
          })
        );
      } else {
        setEquations("vertical", "y2", [dimVecs.vertical.y2, y2]);
      }
    },
    get h() {
      if ("h" in equations.vertical) {
        return equations.vertical.h![1];
      }
      const ch = centerYAndHeight();
      return ch ? computeLinearExpr(ch, dimVecs.vertical.h) : undefined;
    },
    set h(h: number | undefined) {
      if (h === undefined) {
        setEquations(
          "vertical",
          produce((dims) => {
            delete dims.h;
          })
        );
      } else {
        setEquations("vertical", "h", [dimVecs.vertical.h, h]);
      }
    },
  };
};
