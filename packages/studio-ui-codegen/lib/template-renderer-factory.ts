import { FrameworkOutputManager } from './framework-output-manager';
import { StudioTemplateRenderer } from './studio-template-renderer';

import { RenderTextComponentResponse } from './render-component-response';

/**
 * This class is used to wrap the created of renderers due to each renderer
 * only being used for one component.
 */
export class StudioTemplateRendererFactory<
  TSource,
  TStudioType,
  TOutputManager extends FrameworkOutputManager<TSource>,
  TRenderOutput extends RenderTextComponentResponse,
  TRenderer extends StudioTemplateRenderer<TSource, TStudioType, TOutputManager, TRenderOutput>,
> {
  constructor(private renderer: (component: TStudioType) => TRenderer) {}

  buildRenderer(component: TStudioType): TRenderer {
    return this.renderer(component);
  }
}
