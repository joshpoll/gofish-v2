export const Pencil = () => {
  return (
    <filter id="pencil">
      <feTurbulence
        id="SvgjsFeTurbulence2293"
        baseFrequency="1.2 1.2"
        filtername="feTurbulence"
        in="SourceGraphic"
        numOctaves="1"
        result="f1"
        seed="0"
        stitchTiles="noStitch"
        type="fractalNoise"
      />
      <feColorMatrix
        id="SvgjsFeColorMatrix2294"
        filtername="feColorMatrix"
        in="SourceGraphic"
        result="f2"
        type="matrix"
        values="0 0 0 0 0, 0 0 0 0 0, 0 0 0 0 0, 0 0 0 -1.5 2.8"
      />
      <feComposite
        id="SvgjsFeComposite2295"
        filtername="feComposite"
        in="SourceGraphic"
        in2="f2"
        operator="in"
        result="f3"
      />
      <feTurbulence
        id="SvgjsFeTurbulence2296"
        baseFrequency="1.8 1.8"
        filtername="feTurbulence"
        in="SourceGraphic"
        numOctaves="3"
        result="noise"
        seed="0"
        stitchTiles="noStitch"
        type="fractalNoise"
      />
      <feDisplacementMap
        id="SvgjsFeDisplacementMap2297"
        filtername="feDisplacementMap"
        in="SourceGraphic"
        result="f4"
        scale="4"
      />
    </filter>
  );
};
