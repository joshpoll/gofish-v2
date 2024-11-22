export const Fisheye = () => {
  return (
    <filter id="trilight" x="-50%" y="-50%" width="200%" height="200%">
      <feImage
        xlink:href="http://tavmjong.free.fr/INKSCAPE/MANUAL/images/FILTERS/bubble.png"
        result="lightMap"
        x="30"
        y="0"
        width="600"
        height="600"
      />

      <feDisplacementMap
        in2="lightMap"
        in="SourceGraphic"
        xChannelSelector="R"
        yChannelSelector="G"
        scale="10"
      ></feDisplacementMap>
    </filter>
  );
};
