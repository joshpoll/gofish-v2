type Point = {
  x: number;
  y: number;
};

// Coordinate types for each patch
type PolarCoord = {
  r: number;
  theta: number;
};

type StripCoord = {
  s: number; // position along strip
  t: number; // position across strip width
};

type FanCoord = {
  u: number; // radial position
  v: number; // angular position in fan
};

// Main class to handle the transformations
export class PeriodicManifold {
  // Configuration parameters
  private readonly CORE_RADIUS = 1.0;
  private readonly SPIRAL_TIGHTNESS = 0.2;
  private readonly FAN_START_ANGLE = Math.PI / 4;
  private readonly FAN_END_ANGLE = (3 * Math.PI) / 4;
  private readonly STRIP_CURVE_RADIUS = 2.5;
  private readonly STRIP_WIDTH = 0.3;

  // Smooth bump function for transitions
  private bump(t: number): number {
    if (t <= 0 || t >= 1) return 0;
    return Math.exp(-1 / (t * (1 - t)));
  }

  // Core polar coordinate patch
  private polarToCartesian(coord: PolarCoord): Point {
    return {
      x: coord.r * Math.cos(coord.theta),
      y: coord.r * Math.sin(coord.theta),
    };
  }

  // Fan coordinate patch for transition metals
  private fanToCartesian(coord: FanCoord): Point {
    const angle = this.FAN_START_ANGLE + coord.v * (this.FAN_END_ANGLE - this.FAN_START_ANGLE);
    const radius = this.CORE_RADIUS * (1 + coord.u);

    return {
      x: radius * Math.cos(angle),
      y: radius * Math.sin(angle),
    };
  }

  // Strip coordinate patch for lanthanides/actinides
  private stripToCartesian(coord: StripCoord): Point {
    // Base curve of the strip
    const baseAngle = this.FAN_END_ANGLE + coord.s * (Math.PI / 2);
    const baseX = this.STRIP_CURVE_RADIUS * Math.cos(baseAngle);
    const baseY = this.STRIP_CURVE_RADIUS * Math.sin(baseAngle);

    // Normal vector for strip width
    const normalX = -Math.sin(baseAngle);
    const normalY = Math.cos(baseAngle);

    return {
      x: baseX + this.STRIP_WIDTH * coord.t * normalX,
      y: baseY + this.STRIP_WIDTH * coord.t * normalY,
    };
  }

  // Transition maps between coordinate patches
  private polarToFan(polar: PolarCoord): FanCoord {
    return {
      u: (polar.r - this.CORE_RADIUS) / this.CORE_RADIUS,
      v: (polar.theta - this.FAN_START_ANGLE) / (this.FAN_END_ANGLE - this.FAN_START_ANGLE),
    };
  }

  private fanToStrip(fan: FanCoord): StripCoord {
    return {
      s: fan.v,
      t: fan.u,
    };
  }

  // Transition functions with smooth interpolation
  private transitionPolarToFan(p: Point, weight: number): Point {
    const polar: PolarCoord = {
      r: Math.sqrt(p.x * p.x + p.y * p.y),
      theta: Math.atan2(p.y, p.x),
    };

    const fan = this.polarToFan(polar);
    const fanPoint = this.fanToCartesian(fan);

    return {
      x: (1 - weight) * p.x + weight * fanPoint.x,
      y: (1 - weight) * p.y + weight * fanPoint.y,
    };
  }

  private transitionFanToStrip(p: Point, weight: number): Point {
    // Convert current point to fan coordinates
    const fan: FanCoord = {
      u: Math.sqrt(p.x * p.x + p.y * p.y) / this.CORE_RADIUS - 1,
      v: (Math.atan2(p.y, p.x) - this.FAN_START_ANGLE) / (this.FAN_END_ANGLE - this.FAN_START_ANGLE),
    };

    const strip = this.fanToStrip(fan);
    const stripPoint = this.stripToCartesian(strip);

    return {
      x: (1 - weight) * p.x + weight * stripPoint.x,
      y: (1 - weight) * p.y + weight * stripPoint.y,
    };
  }

  // Main function to get position for any element
  public getElementPosition(atomicNumber: number): Point {
    // Determine which region the element belongs to
    if (atomicNumber <= 20) {
      // Main spiral (s/p blocks start)
      const period = Math.floor(atomicNumber / 8);
      const position = atomicNumber % 8;

      const polar: PolarCoord = {
        r: this.CORE_RADIUS + this.SPIRAL_TIGHTNESS * period,
        theta: (2 * Math.PI * position) / 8 + (period * Math.PI) / 4,
      };

      return this.polarToCartesian(polar);
    } else if ((atomicNumber >= 57 && atomicNumber <= 71) || (atomicNumber >= 89 && atomicNumber <= 103)) {
      // Lanthanides/Actinides
      const position = atomicNumber >= 89 ? atomicNumber - 89 : atomicNumber - 57;

      const strip: StripCoord = {
        s: position / 14, // Normalize to [0,1]
        t: atomicNumber >= 89 ? 0.7 : 0.3, // Different rows for La/Ac series
      };

      return this.stripToCartesian(strip);
    } else {
      // Transition metals
      const row = Math.floor(atomicNumber / 18) - 1;
      const col = atomicNumber % 18;

      const fan: FanCoord = {
        u: row / 3, // Normalize rows to [0,1]
        v: col / 17, // Normalize columns to [0,1]
      };

      return this.fanToCartesian(fan);
    }
  }

  // Helper function to determine if a point is in a transition region
  public isInTransitionRegion(p: Point): boolean {
    const r = Math.sqrt(p.x * p.x + p.y * p.y);
    const theta = Math.atan2(p.y, p.x);

    // Check if near fan transition
    const isFanTransition =
      r > this.CORE_RADIUS * 1.8 &&
      r < this.CORE_RADIUS * 2.2 &&
      theta > this.FAN_START_ANGLE &&
      theta < this.FAN_END_ANGLE;

    // Check if near strip transition
    const isStripTransition =
      r > this.STRIP_CURVE_RADIUS * 0.9 &&
      r < this.STRIP_CURVE_RADIUS * 1.1 &&
      theta > this.FAN_END_ANGLE &&
      theta < this.FAN_END_ANGLE + Math.PI / 2;

    return isFanTransition || isStripTransition;
  }
}
