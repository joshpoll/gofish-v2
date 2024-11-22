import { Space } from "./spaceType";

/**
 * Transforms polar-like coordinates to squircle coordinates.
 * @param radius - Distance from center (0 to 1)
 * @param angle - Angle in radians (0 to 2π)
 * @param roundness - Controls the shape (0 = square/rectangle, 1 = circle)
 * @param aspectRatio - Width/height ratio (1 for square base, other values for rectangle)
 * @returns Transformed coordinates as {x, y}
 */
export const squircle: ({ roundness, aspectRatio }: { roundness: number; aspectRatio?: number }) => Space = ({
  roundness,
  aspectRatio = 1,
}) => ({
  transform: ([radius, angle]) => {
    // Clamp roundness between 0 and 1
    roundness = Math.max(0, Math.min(1, roundness));

    // Normalize angle to [0, 2π)
    angle = ((angle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);

    // Get base circular coordinates
    const circleX = radius * Math.cos(angle);
    const circleY = radius * Math.sin(angle);

    const squareFactor = Math.min(1 / Math.abs(Math.cos(angle)), 1 / Math.abs(Math.sin(angle)));
    const squareRadius = radius * squareFactor;

    const squareX = squareRadius * Math.cos(angle);
    const squareY = squareRadius * Math.sin(angle);

    const lerpRadius = radius * roundness + squareRadius * (1 - roundness);

    const lerpX = lerpRadius * Math.cos(angle);
    const lerpY = lerpRadius * Math.sin(angle) * aspectRatio;

    // // Calculate square coordinates
    // let squareX, squareY;

    // // Get the quadrant-adjusted angle between 0 and π/2
    // const adjustedAngle = angle % (Math.PI / 2);

    // // Handle exact 90-degree angles to avoid division by zero
    // if (Math.abs(adjustedAngle) < 0.001) {
    //   squareX = Math.sign(circleX) * radius * aspectRatio;
    //   squareY = Math.sign(circleY) * radius;
    // }
    // // For angles closer to horizontal edges
    // else if (adjustedAngle <= Math.PI / 4) {
    //   squareX = Math.sign(circleX) * radius * aspectRatio;
    //   squareY = radius * Math.tan(angle);
    // }
    // // For angles closer to vertical edges
    // else {
    //   squareX = (radius * aspectRatio) / Math.tan(angle);
    //   squareY = Math.sign(circleY) * radius;
    // }

    // Interpolate between circle and square/rectangle based on roundness
    return {
      x: lerpX,
      y: lerpY,
    };
  },
  bounds: [
    [0, 50],
    [0, 2 * Math.PI],
  ],
});
