import { FrameworkOutputManager } from "./framework-output-manager";
import { StudioComponent } from "@amzn/amplify-ui-codegen-schema";
import { StudioRendererConstants } from "./renderer-helper";

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
    protected component: StudioComponent,
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
        this.component.name ?? StudioRendererConstants.unknownName
      );
  }
}
