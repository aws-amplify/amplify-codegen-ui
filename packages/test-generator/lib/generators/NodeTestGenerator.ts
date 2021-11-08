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
import fs from 'fs';
import path from 'path';
import {
  StudioTemplateRendererManager,
  StudioTemplateRendererFactory,
  StudioComponent,
  StudioTheme,
} from '@aws-amplify/codegen-ui';
import {
  AmplifyRenderer,
  ReactThemeStudioTemplateRenderer,
  ReactIndexStudioTemplateRenderer,
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
    this.componentRendererFactory = new StudioTemplateRendererFactory(
      (component: StudioComponent) => new AmplifyRenderer(component, this.renderConfig),
    );
    this.themeRendererFactory = new StudioTemplateRendererFactory(
      (theme: StudioTheme) => new ReactThemeStudioTemplateRenderer(theme, this.renderConfig),
    );
    this.indexRendererFactory = new StudioTemplateRendererFactory(
      (schemas: (StudioComponent | StudioTheme)[]) => new ReactIndexStudioTemplateRenderer(schemas, this.renderConfig),
    );
    this.rendererManager = new StudioTemplateRendererManager(this.componentRendererFactory, this.outputConfig);
    this.themeRendererManager = new StudioTemplateRendererManager(this.themeRendererFactory, this.outputConfig);
    this.indexRendererManager = new StudioTemplateRendererManager(this.indexRendererFactory, this.outputConfig);
  }

  writeComponentToDisk(component: StudioComponent) {
    this.rendererManager.renderSchemaToTemplate(component);
  }

  renderComponent(component: StudioComponent) {
    const buildRenderer = this.componentRendererFactory.buildRenderer(component);
    return buildRenderer.renderComponentOnly();
  }

  writeSnippetToDisk(components: StudioComponent[]) {
    const { importsText, compText } = this.renderSnippet(components);
    fs.writeFileSync(path.join(this.outputConfig.outputPathDir, '..', 'SnippetTests.jsx'), importsText + compText);
  }

  renderSnippet(components: StudioComponent[]): { importsText: string; compText: string } {
    const snippet = components
      .map((component) => {
        const buildRenderer = this.componentRendererFactory.buildRenderer(component);
        return buildRenderer.renderSampleCodeSnippet();
      })
      .reduce(
        (prev, curr): { importsText: string; compText: string } => ({
          importsText: prev.importsText + curr.importsText,
          compText: `${prev.compText}\n${curr.compText}`,
        }),
        { importsText: '', compText: 'export default function SnippetTests() {\nreturn (\n<>\n' },
      );

    return { ...snippet, compText: `${snippet.compText}\n</>\n);\n}` };
  }

  writeThemeToDisk(theme: StudioTheme) {
    this.themeRendererManager.renderSchemaToTemplate(theme);
  }

  renderTheme(theme: StudioTheme) {
    const buildRenderer = this.themeRendererFactory.buildRenderer(theme);
    return buildRenderer.renderComponent();
  }

  writeIndexFileToDisk(schemas: (StudioComponent | StudioTheme)[]) {
    this.indexRendererManager.renderSchemaToTemplate(schemas);
  }

  renderIndexFile(schemas: (StudioComponent | StudioTheme)[]) {
    const indexRenderer = this.indexRendererFactory.buildRenderer(schemas);
    return indexRenderer.renderComponent();
  }
}
