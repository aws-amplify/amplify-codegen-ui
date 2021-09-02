export abstract class FrameworkOutputManager<TSource> {
  abstract writeComponent(input: TSource, outputPath: string, componentName: string): Promise<void>;
}
