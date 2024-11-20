export const SquigglyAnimated = () => {
  return (
    <filter id="squiggly-animated">
      <feTurbulence
        id="SvgjsFeTurbulence2154"
        baseFrequency="0.02 0.02"
        filtername="feTurbulence"
        numOctaves="3"
        result="noise"
        seed="0"
        animation='{"seed":"{\"attributeName\":\"seed\",\"dur\":\"0.25\",\"values\":\"0;1;2;4\"}"}'
      >
        <animate attributeName="seed" dur="0.25" values="0;1;2;4" attributeType="XML" repeatCount="indefinite" />
      </feTurbulence>
      <feDisplacementMap
        id="SvgjsFeDisplacementMap2156"
        filtername="feDisplacementMap"
        in="SourceGraphic"
        in2="noise"
        scale="6"
        result="z6l5dq"
        animation='{"scale":"{\"attributeName\":\"scale\",\"dur\":\"0.25\",\"values\":\"6;9;12;15\"}"}'
      >
        <animate attributeName="scale" dur="0.25" values="6;9;12;15" attributeType="XML" repeatCount="indefinite" />
      </feDisplacementMap>
    </filter>
  );
};
