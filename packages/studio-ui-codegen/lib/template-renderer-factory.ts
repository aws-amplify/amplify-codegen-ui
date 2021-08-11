import { FrameworkOutputManager } from "./framework-output-manager";
import { StudioTemplateRenderer } from "./studio-template-renderer";

import { StudioComponent } from "@amzn/amplify-ui-codegen-schema";
import { RenderTextComponentResponse } from "./render-component-response";

/**
 * This class is used to wrap the created of renderers due to each renderer
 * only being used for one component.
 */
export class StudioTemplateRendererFactory<
  TSource,
  TOutputManager extends FrameworkOutputManager<TSource>,
  TRenderOutput extends RenderTextComponentResponse,
  TRenderer extends StudioTemplateRenderer<
    TSource,
    TOutputManager,
    TRenderOutput
  >
> {
  constructor(
    private renderer: (component: StudioComponent) => TRenderer
  ) {}

  buildRenderer(component: StudioComponent): TRenderer {
    return this.renderer(component);
  }
}
