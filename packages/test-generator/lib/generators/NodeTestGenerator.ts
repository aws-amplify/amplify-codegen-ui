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
import {
  FrontendManagerTemplateRendererManager,
  FrontendManagerTemplateRendererFactory,
  FrontendManagerComponent,
  FrontendManagerTheme,
} from '@aws-amplify/codegen-ui';
import {
  AmplifyRenderer,
  ReactThemeFrontendManagerTemplateRenderer,
  ReactIndexFrontendManagerTemplateRenderer,
} from '@aws-amplify/codegen-ui-react';
import { TestGenerator, TestGeneratorParams } from './TestGenerator';

export class NodeTestGenerator extends TestGenerator {
  private readonly componentRendererFactory: any;

  private readonly themeRendererFactory: any;

  private readonly indexRendererFactory: any;

  private readonly rendererManager: any;

  private readonly themeRendererManager: any;

  private readonly indexRendererManager: any;

  constructor(params: TestGeneratorParams) {
    super(params);
    this.componentRendererFactory = new FrontendManagerTemplateRendererFactory(
      (component: FrontendManagerComponent) => new AmplifyRenderer(component, this.renderConfig),
    );
    this.themeRendererFactory = new FrontendManagerTemplateRendererFactory(
      (theme: FrontendManagerTheme) => new ReactThemeFrontendManagerTemplateRenderer(theme, this.renderConfig),
    );
    this.indexRendererFactory = new FrontendManagerTemplateRendererFactory(
      (schemas: (FrontendManagerComponent | FrontendManagerTheme)[]) =>
        new ReactIndexFrontendManagerTemplateRenderer(schemas, this.renderConfig),
    );
    this.rendererManager = new FrontendManagerTemplateRendererManager(this.componentRendererFactory, this.outputConfig);
    this.themeRendererManager = new FrontendManagerTemplateRendererManager(
      this.themeRendererFactory,
      this.outputConfig,
    );
    this.indexRendererManager = new FrontendManagerTemplateRendererManager(
      this.indexRendererFactory,
      this.outputConfig,
    );
  }

  writeComponentToDisk(component: FrontendManagerComponent) {
    this.rendererManager.renderSchemaToTemplate(component);
  }

  renderComponent(component: FrontendManagerComponent) {
    const buildRenderer = this.componentRendererFactory.buildRenderer(component);
    const renderedComponent = buildRenderer.renderComponentOnly();
    const appSample = buildRenderer.renderSampleCodeSnippet();
    return { renderedComponent, appSample };
  }

  writeThemeToDisk(theme: FrontendManagerTheme) {
    this.themeRendererManager.renderSchemaToTemplate(theme);
  }

  renderTheme(theme: FrontendManagerTheme) {
    const buildRenderer = this.themeRendererFactory.buildRenderer(theme);
    return buildRenderer.renderComponent();
  }

  writeIndexFileToDisk(schemas: (FrontendManagerComponent | FrontendManagerTheme)[]) {
    this.indexRendererManager.renderSchemaToTemplate(schemas);
  }

  renderIndexFile(schemas: (FrontendManagerComponent | FrontendManagerTheme)[]) {
    const indexRenderer = this.indexRendererFactory.buildRenderer(schemas);
    return indexRenderer.renderComponent();
  }
}
