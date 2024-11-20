export const SplotchyFlickering = () => {
  return (
    <filter id="splotchy-flickering">
      <feTurbulence
        id="SvgjsFeTurbulence1856"
        baseFrequency="0.25 0.209"
        filtername="feTurbulence"
        numOctaves="8"
        result="nTLuQM"
        seed="0"
        stitchTiles="noStitch"
        type="fractalNoise"
      />
      <feComponentTransfer
        id="SvgjsFeComponentTransfer1857"
        filtername="feComponentTransfer"
        in="nTLuQM"
        result="irk8Sm"
        child='{"filterName":"feFuncR","id":"SvgjsFeFuncR1858","filtername":"feFuncR","intercept":"0.1","slope":"0.1","type":"linear"},{"filterName":"feFuncG","id":"SvgjsFeFuncG1859","filtername":"feFuncG","intercept":"0.1","slope":"0.1","type":"linear"},{"filterName":"feFuncB","id":"SvgjsFeFuncB1860","filtername":"feFuncB","intercept":"0.1","slope":"0.1","type":"linear"}'
      >
        <feFuncR id="SvgjsFeFuncR1858" filtername="feFuncR" intercept="0.1" slope="0.1" type="linear" />
        <feFuncG id="SvgjsFeFuncG1859" filtername="feFuncG" intercept="0.1" slope="0.1" type="linear" />
        <feFuncB id="SvgjsFeFuncB1860" filtername="feFuncB" intercept="0.1" slope="0.1" type="linear" />
      </feComponentTransfer>
      <feMorphology
        id="SvgjsFeMorphology1861"
        filtername="feMorphology"
        in="irk8Sm"
        operator="erode"
        radius="6"
        result="HyN6vt"
        animation='{"radius":"{\"attributeName\":\"radius\",\"dur\":\"0.5\",\"values\":\"4;5;4\"}"}'
      >
        <animate attributeName="radius" dur="0.5" values="4;5;4" attributeType="XML" repeatCount="indefinite" />
      </feMorphology>
      <feConvolveMatrix
        id="SvgjsFeConvolveMatrix1863"
        filtername="feConvolveMatrix"
        in="HyN6vt"
        kernelMatrix="0 -1 0 -1 5 -1 0 -1 0"
        result="tTZHfY"
      />
      <feComposite
        id="SvgjsFeComposite1864"
        filtername="feComposite"
        in="SourceGraphic"
        in2="tTZHfY"
        operator="in"
        result="gAuK3e"
      />
      <feComposite
        id="SvgjsFeComposite1865"
        filtername="feComposite"
        in="gAuK3e"
        in2="gAuK3e"
        operator="over"
        result="CvTrwW"
      />
    </filter>
  );
};
