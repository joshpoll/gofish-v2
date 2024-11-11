// @ts-nocheck

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
      <For each={planetData}>
        {(planet) => <Rect name={planet.name} height={planet.radius} /* color={planet.avgColor} */ />}
      </For>
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

const chartJS = () => {
  const bars = StackH(ForEach(planetData, (planet) => Rect({ height: planet.radius }).name(planet.name)));
  const labels = ForEach(labelData, (label) => Label({ label: Text(label.label), on: Ref(planetData[label.name]) }));
  return [bars, labels];
};

const chartJS2 = () => {
  const bars = StackH(ForEach(planetData, (planet) => Rect({ height: planet.radius }).name(planet.name)));
  const labels = ForEach(labelData, (label) => Label({ label: Text(label.label), on: bars[label.name] }));
};

const chartJS3 = Plot(() => {
  const bars = StackH(ForEach(planetData, (planet) => Rect({ height: planet.radius }).name(planet.name)));
  const labels = ForEach(labelData, (label) => Label({ label: Text(label.label), on: bars[label.name] }));
});

const chartJS4 = Plot(() => {
  const bars = StackH(
    ForEach(planetData, (planet) =>
      Rect({ height: planet.radius }).name(planet.name).label(labelData[planet.name].label)
    )
  );
});

const chartJS5 = Plot(() => {
  const bars = StackH(
    ForEach(planetData, (planet) =>
      Rect({ height: planet.radius })
        .name(planet.name)
        .join(labelData, (label) => label(labelData[planet.name].label))
    )
  );
});

const chartJS6 = Plot(() => {
  const bars = StackH(
    ForEach(planetData, (planet) => Rect({ height: planet.radius }).name(planet.name)).join(labelData, (label) =>
      label(labelData[planet.name].label)
    )
  );
});

const chartJS7 = Plot(() => {
  const bars = StackH(
    ForEach(planetData, (planet) => Rect({ height: planet.radius })).join(labelData, (planet, label) =>
      label(labelData[planet.name].label)
    )
  );
});

const chartJS8 = Plot(() => ({
  planetData: StackH(ForEach(Rect({ height: "radius" }))),
  labelData: ForEach(labelData, (label) => Label({ label: Text(label.label), on: Ref(planetData[label.name]) })),
}));

const chartJS9 = Plot(() => ({
  planetData: StackH(ForEach(Rect({ height: "radius" }))),
  labelData: ForEach(labelData, (label) => Label({ label: Text(label.label), on: select(planetData[label.name]) })),
}));
