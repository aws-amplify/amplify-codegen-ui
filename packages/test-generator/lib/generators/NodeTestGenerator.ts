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
  StudioForm,
  getGenericFromDataStore,
  StudioSchema,
  StudioView,
} from '@aws-amplify/codegen-ui';
import {
  AmplifyRenderer,
  ReactThemeStudioTemplateRenderer,
  ReactIndexStudioTemplateRenderer,
  ReactUtilsStudioTemplateRenderer,
  AmplifyFormRenderer,
  UtilTemplateType,
  AmplifyViewRenderer,
} from '@aws-amplify/codegen-ui-react';
import schema from '../models/schema';
import { TestGenerator, TestGeneratorParams } from './TestGenerator';

export class NodeTestGenerator extends TestGenerator {
  private readonly componentRendererFactory: any;

  private readonly themeRendererFactory: any;

  private readonly formRendererFactory: any;

  private readonly viewRendererFactory: any;

  private readonly indexRendererFactory: any;

  private readonly utilsRendererFactory: any;

  private readonly componentRendererManager: any;

  private readonly formRendererManager: any;

  private readonly viewRendererManager: any;

  private readonly themeRendererManager: any;

  private readonly indexRendererManager: any;

  private readonly utilsRendererManager: any;

  constructor(params: TestGeneratorParams) {
    super(params);
    this.componentRendererFactory = new StudioTemplateRendererFactory(
      (component: StudioComponent) =>
        new AmplifyRenderer(component, this.renderConfig, getGenericFromDataStore(schema)),
    );
    this.themeRendererFactory = new StudioTemplateRendererFactory(
      (theme: StudioTheme) => new ReactThemeStudioTemplateRenderer(theme, this.renderConfig),
    );

    this.formRendererFactory = new StudioTemplateRendererFactory(
      (form: StudioForm) =>
        new AmplifyFormRenderer(form, getGenericFromDataStore(schema), this.renderConfig, {
          isNonModelSupported: true,
          isRelationshipSupported: true,
        }),
    );
    this.viewRendererFactory = new StudioTemplateRendererFactory(
      (view: StudioView) => new AmplifyViewRenderer(view, getGenericFromDataStore(schema), this.renderConfig),
    );
    this.indexRendererFactory = new StudioTemplateRendererFactory(
      (schemas: StudioSchema[]) => new ReactIndexStudioTemplateRenderer(schemas, this.renderConfig),
    );
    this.utilsRendererFactory = new StudioTemplateRendererFactory(
      (utils: UtilTemplateType[]) => new ReactUtilsStudioTemplateRenderer(utils, this.renderConfig),
    );
    this.componentRendererManager = new StudioTemplateRendererManager(this.componentRendererFactory, this.outputConfig);
    this.formRendererManager = new StudioTemplateRendererManager(this.formRendererFactory, this.outputConfig);
    this.viewRendererManager = new StudioTemplateRendererManager(this.viewRendererFactory, this.outputConfig);
    this.themeRendererManager = new StudioTemplateRendererManager(this.themeRendererFactory, this.outputConfig);
    this.indexRendererManager = new StudioTemplateRendererManager(this.indexRendererFactory, this.outputConfig);
    this.utilsRendererManager = new StudioTemplateRendererManager(this.utilsRendererFactory, this.outputConfig);
  }

  writeComponentToDisk(component: StudioComponent) {
    this.componentRendererManager.renderSchemaToTemplate(component);
  }

  renderComponent(component: StudioComponent) {
    const buildRenderer = this.componentRendererFactory.buildRenderer(component);
    return buildRenderer.renderComponentOnly();
  }

  writeFormToDisk(form: StudioForm) {
    return this.formRendererManager.renderSchemaToTemplate(form);
  }

  writeViewToDisk(view: StudioView) {
    return this.viewRendererManager.renderSchemaToTemplate(view);
  }

  renderForm(form: StudioForm) {
    const buildRenderer = this.formRendererFactory.buildRenderer(form);
    return buildRenderer.renderComponentOnly();
  }

  renderView(view: StudioView) {
    const buildRenderer = this.viewRendererFactory.buildRenderer(view);
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

  writeIndexFileToDisk(schemas: (StudioComponent | StudioTheme | StudioForm)[]) {
    this.indexRendererManager.renderSchemaToTemplate(schemas);
  }

  renderIndexFile(schemas: (StudioComponent | StudioTheme | StudioForm)[]) {
    const indexRenderer = this.indexRendererFactory.buildRenderer(schemas);
    return indexRenderer.renderComponent();
  }

  writeUtilsFileToDisk(utils: UtilTemplateType[]) {
    this.utilsRendererManager.renderSchemaToTemplate(utils);
  }

  renderUtilsFile(utils: UtilTemplateType[]) {
    const utilsRenderer = this.utilsRendererFactory.buildRenderer(utils);
    return utilsRenderer.renderComponent();
  }
}
