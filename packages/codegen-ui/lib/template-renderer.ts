/*
  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.

  Licensed under the Apache License, Version 2.0 (the "License").
  You may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
 */
import fs from 'fs';
import { FrameworkOutputManager } from './framework-output-manager';
import { FrontendManagerTemplateRenderer } from './frontend-manager-template-renderer';
import { FrontendManagerTemplateRendererFactory } from './template-renderer-factory';

import { FrameworkOutputConfig } from './framework-output-config';
import { RenderTextComponentResponse } from './render-component-response';
import { handleCodegenErrors, InvalidInputError } from './errors';

/**
 * This is a class for genercially rendering FrontendManager templates.
 * The output is determined by the renderer passed into the constructor.
 */
export class FrontendManagerTemplateRendererManager<
  TSource,
  TFrontendManagerType,
  TOutputManager extends FrameworkOutputManager<TSource>,
  TRenderOutput extends RenderTextComponentResponse,
  TRenderer extends FrontendManagerTemplateRenderer<TSource, TFrontendManagerType, TOutputManager, TRenderOutput>,
> {
  constructor(
    private renderer: FrontendManagerTemplateRendererFactory<
      TSource,
      TFrontendManagerType,
      TOutputManager,
      TRenderOutput,
      TRenderer
    >,
    private outputConfig: FrameworkOutputConfig,
  ) {
    const renderPath = this.outputConfig.outputPathDir;
    if (!fs.existsSync(renderPath)) {
      fs.mkdirSync(renderPath);
    }
  }

  @handleCodegenErrors
  renderSchemaToTemplate(component: TFrontendManagerType | undefined): TRenderOutput {
    if (!component) {
      throw new InvalidInputError('Please ensure you have passed in a valid component schema');
    }
    const componentRenderer = this.renderer.buildRenderer(component);
    const result = componentRenderer.renderComponent();
    result.renderComponentToFilesystem(this.outputConfig.outputPathDir);
    return result;
  }

  @handleCodegenErrors
  renderSchemaToTemplates(jsonSchema: TFrontendManagerType[] | undefined) {
    if (!jsonSchema) {
      throw new InvalidInputError('Please ensure you have passed in a valid schema');
    }

    for (const component of jsonSchema) {
      this.renderer.buildRenderer(component).renderComponent();
    }
  }
}
