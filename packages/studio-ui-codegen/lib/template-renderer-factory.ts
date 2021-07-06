import { FrameworkOutputManager } from "./framework-output-manager";
import { StudioTemplateRenderer } from "./studio-template-renderer";
import { FirstOrderStudioComponent } from "@amzn/amplify-ui-codegen-schema";

/**
 * This class is used to wrap the created of renderers due to each renderer
 * only being used for one component.
 */
export class StudioTemplateRendererFactory<
  TSource,
  TOutputManager extends FrameworkOutputManager<TSource>,
  TRenderOutput,
  TRenderer extends StudioTemplateRenderer<
    TSource,
    TOutputManager,
    TRenderOutput
  >
> {
  constructor(
    private renderer: (component: FirstOrderStudioComponent) => TRenderer
  ) {}

  buildRenderer(component: FirstOrderStudioComponent): TRenderer {
    return this.renderer(component);
  }
}
