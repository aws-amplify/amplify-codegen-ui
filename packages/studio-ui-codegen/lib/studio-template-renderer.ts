import { FrameworkOutputManager } from "./framework-output-manager";
import { RenderTextComponentResponse } from "./render-component-response";
import { FirstOrderStudioComponent } from "./types/studio-component";

export abstract class StudioTemplateRenderer<
  TSource,
  TOutputManager extends FrameworkOutputManager<TSource>,
  TRenderOutput
> {
  /**
   *
   * @param component The first order component to be rendered.
   */
  constructor(
    protected component: FirstOrderStudioComponent,
    protected outputManager: TOutputManager
  ) {}

  /**
   * Renders the entire first order component. It returns the
   * component text and a method for saving the component to the filesystem.
   */
  abstract renderComponent(): TRenderOutput;

  protected renderComponentToFilesystem(componentContent: TSource) {
    return (outputPath: string) =>
      this.outputManager.writeComponent(
        componentContent,
        outputPath,
        this.component.name
      );
  }
}
