export abstract class MapperBase<A extends object, B extends object> {
  abstract map(source: A): Partial<B>;

  abstract reverseMap(source: B): Partial<A>;
}
