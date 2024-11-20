export const Canvas = () => {
  return (
    <filter id="canvas">
      <feTurbulence
        id="SvgjsFeTurbulence1604"
        baseFrequency="0.0621216354661451 0.7"
        filtername="feTurbulence"
        numOctaves="3"
        result="n"
        seed="20"
      />
      <feTurbulence
        id="SvgjsFeTurbulence1605"
        baseFrequency="0.7 0.06389500910048855"
        filtername="feTurbulence"
        numOctaves="3"
        seed="20"
        result="WEjo50"
      />
      <feBlend id="SvgjsFeBlend1606" filtername="feBlend" in="n" result="noise" />
      <feDiffuseLighting
        id="SvgjsFeDiffuseLighting1607"
        filtername="feDiffuseLighting"
        in="noise"
        surfaceScale="2"
        result="EmCI4I"
        child='{"filterName":"feDistantLight","id":"SvgjsFeDistantLight1608","azimuth":"45","elevation":"60","filtername":"feDistantLight"}'
        lighting-color="white"
      >
        <feDistantLight id="SvgjsFeDistantLight1608" azimuth="45" elevation="60" filtername="feDistantLight" />
      </feDiffuseLighting>
    </filter>
  );
};
