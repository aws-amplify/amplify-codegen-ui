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

/* Test Generator to be used in the Node environment */
import { StudioComponent, StudioTheme } from '@amzn/amplify-ui-codegen-schema';
import { StudioTemplateRendererManager, StudioTemplateRendererFactory } from '@amzn/studio-ui-codegen';
import { AmplifyRenderer, ReactOutputConfig, ReactThemeStudioTemplateRenderer } from '@amzn/studio-ui-codegen-react';
import path from 'path';
import { TestGenerator, TestGeneratorParams } from './TestGenerator';

export class NodeTestGenerator extends TestGenerator {
  private readonly componentRendererFactory: any;

  private readonly themeRendererFactory: any;

  private readonly rendererManager: any;

  private readonly themeRendererManager: any;

  constructor(params: TestGeneratorParams) {
    super(params);
    this.componentRendererFactory = new StudioTemplateRendererFactory(
      (component: StudioComponent) => new AmplifyRenderer(component, this.renderConfig),
    );
    this.themeRendererFactory = new StudioTemplateRendererFactory(
      (theme: StudioTheme) => new ReactThemeStudioTemplateRenderer(theme, this.renderConfig),
    );
    const outputPathDir = path.resolve(path.join(__dirname, '..', '..', 'test-app-templates', 'src', 'ui-components'));
    const outputConfig: ReactOutputConfig = { outputPathDir };
    this.rendererManager = new StudioTemplateRendererManager(this.componentRendererFactory, outputConfig);
    this.themeRendererManager = new StudioTemplateRendererManager(this.themeRendererFactory, outputConfig);
  }

  writeComponentToDisk(component: StudioComponent) {
    this.rendererManager.renderSchemaToTemplate(component);
  }

  renderComponent(component: StudioComponent) {
    const buildRenderer = this.componentRendererFactory.buildRenderer(component);
    const renderedComponent = buildRenderer.renderComponentOnly();
    const appSample = buildRenderer.renderSampleCodeSnippet();
    return { renderedComponent, appSample };
  }

  writeThemeToDisk(theme: StudioTheme) {
    this.themeRendererManager.renderSchemaToTemplate(theme);
  }

  renderTheme(theme: StudioTheme) {
    const buildRenderer = this.themeRendererFactory.buildRenderer(theme);
    return buildRenderer.renderComponent();
  }
}
