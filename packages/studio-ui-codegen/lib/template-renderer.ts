import { StudioComponent } from '@amzn/amplify-ui-codegen-schema';
import fs from 'fs';
import path from 'path';
import { FrameworkOutputManager } from './framework-output-manager';
import { StudioTemplateRenderer } from './studio-template-renderer';
import { StudioTemplateRendererFactory } from './template-renderer-factory';

import { StudioRendererConstants } from './renderer-helper';
import { FrameworkOutputConfig } from './framework-output-config';
import { RenderTextComponentResponse } from './render-component-response';

/**
 * This is a class for genercially rendering Studio templates.
 * The output is determined by the renderer passed into the constructor.
 */
export class StudioTemplateRendererManager<
  TSource,
  TOutputManager extends FrameworkOutputManager<TSource>,
  TRenderOutput extends RenderTextComponentResponse,
  TRenderer extends StudioTemplateRenderer<TSource, TOutputManager, TRenderOutput>,
> {
  constructor(
    private renderer: StudioTemplateRendererFactory<TSource, TOutputManager, TRenderOutput, TRenderer>,
    private outputConfig: FrameworkOutputConfig,
  ) {
    const renderPath = this.outputConfig.outputPathDir;
    if (!fs.existsSync(renderPath)) {
      fs.mkdirSync(renderPath);
    }
  }

  renderSchemaToTemplate(component: StudioComponent | undefined): TRenderOutput {
    if (!component) {
      throw new Error('Please ensure you have passed in a valid component schema');
    }
    const componentRenderer = this.renderer.buildRenderer(component);
    const result = componentRenderer.renderComponent();
    result.renderComponentToFilesystem(this.outputConfig.outputPathDir);
    return result;
  }

  renderSchemaToTemplates(jsonSchema: StudioComponent[] | undefined) {
    if (!jsonSchema) {
      throw new Error('Please ensure you have passed in a valid schema');
    }

    for (const component of jsonSchema) {
      const componentPath = path.join(
        this.outputConfig.outputPathDir,
        component.name ?? StudioRendererConstants.unknownName,
      );
      this.renderer.buildRenderer(component).renderComponent();
    }
  }
}
