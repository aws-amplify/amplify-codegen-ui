/* eslint-disable no-console */
import { StudioComponent, StudioTheme } from '@amzn/amplify-ui-codegen-schema';
import { StudioTemplateRendererManager, StudioTemplateRendererFactory } from '@amzn/studio-ui-codegen';
import {
  AmplifyRenderer,
  ReactOutputConfig,
  ReactRenderConfig,
  ReactThemeStudioTemplateRenderer,
  ModuleKind,
  ScriptTarget,
  ScriptKind,
} from '@amzn/studio-ui-codegen-react';
import path from 'path';
import log from 'loglevel';

import * as schemas from './lib';

Error.stackTraceLimit = Infinity;

log.setLevel('info');

const renderConfig: ReactRenderConfig = {
  module: ModuleKind.CommonJS,
  target: ScriptTarget.ES2015,
  script: ScriptKind.TSX,
};

const rendererFactory = new StudioTemplateRendererFactory(
  (component: StudioComponent) => new AmplifyRenderer(component, renderConfig),
);

const outputPathDir = path.resolve(path.join(__dirname, '..', 'ui-components'));
const outputConfig: ReactOutputConfig = {
  outputPathDir,
};

const rendererManager = new StudioTemplateRendererManager(rendererFactory, outputConfig);

const themeRendererManager = new StudioTemplateRendererManager(
  new StudioTemplateRendererFactory((theme: StudioTheme) => new ReactThemeStudioTemplateRenderer(theme, renderConfig)),
  outputConfig,
);

const theme: StudioTheme = {
  components: {
    alert: {
      backgroundColor: 'hsl(210, 5%, 90%)',
      padding: '0.75rem 1rem',
      info: {
        backgroundColor: 'hsl(220, 85%, 85%)',
      },
      error: {
        backgroundColor: 'hsl(0, 75%, 85%)',
      },
      warning: {
        backgroundColor: 'hsl(30, 75%, 85%)',
      },
      success: {
        backgroundColor: 'hsl(130, 75%, 85%)',
      },
    },
  },
};

const decorateTypescriptWithMarkdown = (typescriptSource: string): string => {
  return `\`\`\`typescript jsx\n${typescriptSource}\n\`\`\``;
};

themeRendererManager.renderSchemaToTemplate(theme);

Object.entries(schemas).forEach(([name, schema]) => {
  log.info(`# ${name}`);
  try {
    rendererManager.renderSchemaToTemplate(schema as any);
    const buildRenderer = rendererFactory.buildRenderer(schema as any);

    const compOnly = buildRenderer.renderComponentOnly();
    log.info('## Component Only Output');
    log.info('### componentImports');
    log.info(decorateTypescriptWithMarkdown(compOnly.importsText));
    log.info('### componentText');
    log.info(decorateTypescriptWithMarkdown(compOnly.compText));

    const compOnlyAppSample = buildRenderer.renderSampleCodeSnippet();
    log.info('## Code Snippet Output');
    log.info('### componentImports');
    log.info(decorateTypescriptWithMarkdown(compOnlyAppSample.importsText));
    log.info('### componentText');
    log.info(decorateTypescriptWithMarkdown(compOnlyAppSample.compText));
  } catch (err) {
    log.error(`${name} failed with error:`);
    log.error(err);
  }
});
