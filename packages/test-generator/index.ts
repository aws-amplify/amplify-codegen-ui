import { StudioComponent } from '@amzn/amplify-ui-codegen-schema';
import { StudioTemplateRendererManager, StudioTemplateRendererFactory } from '@amzn/studio-ui-codegen';
import {
  AmplifyRenderer,
  ReactOutputConfig,
  ReactRenderConfig,
  ModuleKind,
  ScriptTarget,
  ScriptKind,
} from '@amzn/studio-ui-codegen-react';
import path from 'path';
import log from 'loglevel';
import { ComponentSchemas } from './lib';

Error.stackTraceLimit = Infinity;

log.setLevel('info');

const renderConfig: ReactRenderConfig = {
  module: ModuleKind.CommonJS,
  target: ScriptTarget.ES2015,
  script: ScriptKind.TSX,
};

const componentRendererFactory = new StudioTemplateRendererFactory(
  (component: StudioComponent) => new AmplifyRenderer(component, renderConfig),
);

// const themeRendererFactory = new StudioTemplateRendererFactory(
//   (theme: StudioTheme) => new ReactThemeStudioTemplateRenderer(theme, renderConfig),
// );

const outputPathDir = path.resolve(path.join(__dirname, '..', 'test-app-templates', 'src', 'ui-components'));
const outputConfig: ReactOutputConfig = {
  outputPathDir,
};

const rendererManager = new StudioTemplateRendererManager(componentRendererFactory, outputConfig);
// const themeRendererManager = new StudioTemplateRendererManager(themeRendererFactory, outputConfig);

const decorateTypescriptWithMarkdown = (typescriptSource: string): string => {
  return `\`\`\`typescript jsx\n${typescriptSource}\n\`\`\``;
};

Object.entries(ComponentSchemas).forEach(([name, schema]) => {
  log.info(`# ${name}`);
  try {
    rendererManager.renderSchemaToTemplate(schema as any);
    const buildRenderer = componentRendererFactory.buildRenderer(schema as any);

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
//
// Object.entries(ThemeSchemas).forEach(([name, schema]) => {
//   log.info(`# ${name}`);
//   try {
//     themeRendererManager.renderSchemaToTemplate(schema as any);
//     const buildRenderer = themeRendererFactory.buildRenderer(schema as any);
//
//     const component = buildRenderer.renderComponent();
//     log.info('## Theme Output');
//     log.info(decorateTypescriptWithMarkdown(component.componentText));
//   } catch (err) {
//     log.error(`${name} failed with error:`);
//     log.error(err);
//   }
// });
