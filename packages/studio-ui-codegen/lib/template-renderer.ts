import fs from 'fs';
import { FrameworkOutputManager } from './framework-output-manager';
import { StudioTemplateRenderer } from './studio-template-renderer';
import { StudioTemplateRendererFactory } from './template-renderer-factory';

import { FrameworkOutputConfig } from './framework-output-config';
import { RenderTextComponentResponse } from './render-component-response';

/**
 * This is a class for genercially rendering Studio templates.
 * The output is determined by the renderer passed into the constructor.
 */
export class StudioTemplateRendererManager<
  TSource,
  TStudioType,
  TOutputManager extends FrameworkOutputManager<TSource>,
  TRenderOutput extends RenderTextComponentResponse,
  TRenderer extends StudioTemplateRenderer<TSource, TStudioType, TOutputManager, TRenderOutput>,
> {
  constructor(
    private renderer: StudioTemplateRendererFactory<TSource, TStudioType, TOutputManager, TRenderOutput, TRenderer>,
    private outputConfig: FrameworkOutputConfig,
  ) {
    const renderPath = this.outputConfig.outputPathDir;
    if (!fs.existsSync(renderPath)) {
      fs.mkdirSync(renderPath);
    }
  }

  renderSchemaToTemplate(component: TStudioType | undefined): TRenderOutput {
    if (!component) {
      throw new Error('Please ensure you have passed in a valid component schema');
    }
    const componentRenderer = this.renderer.buildRenderer(component);
    const result = componentRenderer.renderComponent();
    result.renderComponentToFilesystem(this.outputConfig.outputPathDir);
    return result;
  }

  renderSchemaToTemplates(jsonSchema: TStudioType[] | undefined) {
    if (!jsonSchema) {
      throw new Error('Please ensure you have passed in a valid schema');
    }

    for (const component of jsonSchema) {
      this.renderer.buildRenderer(component).renderComponent();
    }
  }
}
