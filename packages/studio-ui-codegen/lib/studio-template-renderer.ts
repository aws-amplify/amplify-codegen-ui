import path from 'path';
import { FrameworkOutputManager } from './framework-output-manager';
import { FrameworkRenderConfig } from './framework-render-config';
import { RenderTextComponentResponse } from './render-component-response';

export abstract class StudioTemplateRenderer<
  TSource,
  TStudioType,
  TOutputManager extends FrameworkOutputManager<TSource>,
  TRenderOutput extends RenderTextComponentResponse,
> {
  /**
   *
   * @param component The first order component to be rendered.
   */
  constructor(
    protected component: TStudioType,
    protected outputManager: TOutputManager,
    protected renderConfig: FrameworkRenderConfig,
  ) {}

  /**
   * Renders the entire first order component. It returns the
   * component text and a method for saving the component to the filesystem.
   */
  abstract renderComponent(): TRenderOutput;

  renderComponentToFilesystem(componentContent: TSource) {
    return (fileName: string) => (outputPath: string) =>
      this.outputManager.writeComponent(componentContent, path.join(outputPath, fileName));
  }
}
