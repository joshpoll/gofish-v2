/* planets example turned into data vis  */

const planetData = [
  { name: "mercury", radius: 15, avgColor: "#EBE3CF" },
  { name: "venus", radius: 36, avgColor: "#DC933C" },
  { name: "earth", radius: 38, avgColor: "#179DD7" },
  { name: "mars", radius: 21, avgColor: "#F1CF8E" },
];

const labelData = [
  { name: "mercury", label: "Mercury" },
  { name: "venus", label: "Venus" },
  { name: "earth", label: "Earth" },
  { name: "mars", label: "Mars" },
];

const chart = (
  <>
    <StackH>
      <For each={planetData}>{(planet) => <Rect height={planet.radius} /* color={planet.avgColor} */ />}</For>
    </StackH>
    <For each={labelData}>
      {(label) => (
        <Label distributeFrom={planets}>
          <Text>{label.label}</Text>
          <Ref select={planetData[label.name]} />
        </Label>
      )}
    </For>
  </>
);

const chartJS = [
  StackH(For(planetData, (planet) => Rect({ height: planet.radius }))),
  For(labelData, (label) => Label([Text(label.label), Ref(planetData[label.name])])),
];

const chartJS2 = () => {
  const bars = StackH(For(planetData, (planet) => Rect({ height: planet.radius })));
  const labels = For(labelData, (label) => Label([Text(label.label), Ref(bars[label.name])]));
  return [bars, labels];
};

const chartJS3 = () => {
  const bars = StackH({ data: planetData }, (planet) => Rect({ height: planet.radius }));
  const labels = For(labelData, (label) => Label([Text(label.label), Ref(bars[label.name])]));
  return [bars, labels];
};

const chartJS4 = () => {
  const bars = StackH({ data: planetData }, (planet) => Rect({ height: planet.radius }));
  const labels = GroupBy({ data: labelData, key: "name" }, (label, key) => Label([Text(label.label), Ref(bars[key])]));
  return [bars, labels];
};

const chartJS5 = () => {
  // One way of thinking about Rect here compared to the previous one is we have lifted Rect from a
  // Bertin mark to a Wilkinson mark... maybe? Because the previous one was a visual object/element and this one is a function.
  const bars = StackH({ data: planetData }, Rect({ height: "radius" }));
  const labels = GroupBy({ data: labelData, key: "name" }, (label, key) => Label([Text(label.label), Ref(bars[key])]));
  return [bars, labels];
};

const chartJS6 = () => {
  const bars = StackH({ data: planetData }, Rect({ height: "radius" }));
  const labels = GroupBy({ data: labelData, key: "name" }, Label([Text("label"), Ref(bars["key"])]));
  return [bars, labels];
};

const chartJS7 = () => {
  const bars = StackH({ data: planetData }, Rect({ height: "radius" }));
  const labels = Label({ data: labelData }, [Text("label"), Ref(bars["key"])]);
  return [bars, labels];
};

const chartJS8 = () => {
  const bars = StackH({ data: planetData }, Rect({ height: "radius" }));
  const labels = Label({ data: labelData }, [Text("label"), bars["key"]]);
  return [bars, labels];
};

const chartJS9 = () => {
  const bars = StackH({ data: planetData }, Rect({ height: "radius" }));
  /* the label arg implicitly "runs" in labelData context */
  const labels = Label(
    { data: labelData, label: Text("label") },
    bars["key"]
  ); /* weird inconsistency w/ using bars["key"] but implicit dataset elsewhere. I guess it's ok... but we can't really drop-in replace bars["key"] with like "label" or something. to be fair, bars["key"] actually represents marks, not data... which is arguably weird as well */
  return [bars, labels];
};
