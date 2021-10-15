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
import { StudioComponent, StudioTheme } from '@amzn/amplify-ui-codegen-schema';
import { ModuleKind, ScriptTarget, ScriptKind, ReactRenderConfig } from '@amzn/studio-ui-codegen-react';
import log from 'loglevel';
import * as ComponentSchemas from '../components';
import * as ThemeSchemas from '../themes';

const DEFAULT_RENDER_CONFIG = {
  module: ModuleKind.CommonJS,
  target: ScriptTarget.ES2015,
  script: ScriptKind.TSX,
};

log.setLevel('info');

export type TestGeneratorParams = {
  writeToLogger: boolean;
  writeToDisk: boolean;
  renderConfigOverride?: ReactRenderConfig;
  disabledSchemas?: string[];
};

export abstract class TestGenerator {
  protected readonly params: TestGeneratorParams;

  protected readonly renderConfig: ReactRenderConfig;

  constructor(params: TestGeneratorParams) {
    this.params = params;
    this.renderConfig = { ...DEFAULT_RENDER_CONFIG, ...params.renderConfigOverride };
  }

  generate = () => {
    const renderErrors: { [key: string]: any } = {};

    Object.entries(ComponentSchemas).forEach(([name, schema]) => {
      if (this.params.disabledSchemas && this.params.disabledSchemas.includes(name)) {
        return;
      }
      try {
        if (this.params.writeToDisk) {
          this.writeComponentToDisk(schema as StudioComponent);
        }

        if (this.params.writeToLogger) {
          const { renderedComponent, appSample } = this.renderComponent(schema as StudioComponent);
          log.info(`# ${name}`);
          log.info('## Component Only Output');
          log.info('### componentImports');
          log.info(this.decorateTypescriptWithMarkdown(renderedComponent.importsText));
          log.info('### componentText');
          log.info(this.decorateTypescriptWithMarkdown(renderedComponent.compText));
          log.info('## Code Snippet Output');
          log.info('### componentImports');
          log.info(this.decorateTypescriptWithMarkdown(appSample.importsText));
          log.info('### componentText');
          log.info(this.decorateTypescriptWithMarkdown(appSample.compText));
        }
      } catch (err) {
        renderErrors[name] = err;
      }
    });

    Object.entries(ThemeSchemas).forEach(([name, schema]) => {
      if (this.params.disabledSchemas && this.params.disabledSchemas.includes(name)) {
        return;
      }
      try {
        if (this.params.writeToDisk) {
          this.writeThemeToDisk(schema as StudioTheme);
        }

        if (this.params.writeToLogger) {
          const theme = this.renderTheme(schema as StudioTheme);
          log.info(`# ${name}`);
          log.info('## Theme Output');
          log.info(this.decorateTypescriptWithMarkdown(theme.componentText));
        }
      } catch (err) {
        renderErrors[name] = err;
      }
    });

    if (Object.keys(renderErrors).length > 0) {
      log.error('Caught exceptions while rendering templates');
      Object.entries(renderErrors).forEach(([name, error]) => {
        log.error(`Schema: ${name}`);
        log.error(error);
      });
      throw new Error('Not all tests rendered successfully');
    }
  };

  private decorateTypescriptWithMarkdown = (typescriptSource: string): string => {
    return `\`\`\`typescript jsx\n${typescriptSource}\n\`\`\``;
  };

  abstract writeComponentToDisk(component: StudioComponent): void;

  abstract writeThemeToDisk(theme: StudioTheme): void;

  abstract renderComponent(component: StudioComponent): {
    renderedComponent: { compText: string; importsText: string };
    appSample: { compText: string; importsText: string };
  };

  abstract renderTheme(theme: StudioTheme): { componentText: string };
}
