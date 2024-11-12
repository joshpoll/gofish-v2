export type Space<Domain extends number[] = [number, number]> = {
  transform: (domain: Domain) => { x: number; y: number };
  // ensures that the bounds are an array of tuples with the same length as the domain
  bounds: { [K in keyof Domain]: [number, number] };
};
