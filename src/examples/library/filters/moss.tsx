export const Moss = () => {
  return (
    <filter id="moss">
      <feTurbulence
        id="SvgjsFeTurbulence2264"
        baseFrequency=".02 .02"
        filtername="feTurbulence"
        numOctaves="4"
        type="fractalNoise"
        result="6y1RzQ"
        animation='{"numOctaves":"{\"attributeName\":\"numOctaves\",\"dur\":\"0.5\",\"values\":\"4;6;7\"}"}'
      >
        <animate attributeName="numOctaves" dur="0.5" values="4;6;7" attributeType="XML" repeatCount="indefinite" />
      </feTurbulence>
      <feMorphology id="SvgjsFeMorphology2266" filtername="feMorphology" operator="dilate" radius="1" result="3r78Th" />
      <feConvolveMatrix
        id="SvgjsFeConvolveMatrix2267"
        filtername="feConvolveMatrix"
        kernelMatrix="1 1 1 1 2 1 1 -9 1"
        preserveAlpha="true"
        result="amY5ki"
      />
      <feColorMatrix
        id="SvgjsFeColorMatrix2268"
        filtername="feColorMatrix"
        values=".4 .8 .6 0 0 1 1 1 0 0 .1 .2 .3 0 0 0 0 0 0 1"
        result="SVASmj"
      />
      <feComposite
        id="SvgjsFeComposite2269"
        filtername="feComposite"
        in2="SourceGraphic"
        operator="in"
        result="N5yE6y"
      />
    </filter>
  );
};
