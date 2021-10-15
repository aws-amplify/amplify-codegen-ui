import { StudioComponent, StudioTheme } from '@amzn/amplify-ui-codegen-schema';
import { StudioTemplateRendererManager, StudioTemplateRendererFactory } from '@amzn/studio-ui-codegen';
import {
  AmplifyRenderer,
  ReactOutputConfig,
  ModuleKind,
  ScriptTarget,
  ScriptKind,
  ReactThemeStudioTemplateRenderer,
  ReactRenderConfig,
} from '@amzn/studio-ui-codegen-react';
import path from 'path';
import log from 'loglevel';
import { ComponentSchemas, ThemeSchemas } from '../index';

const DEFAULT_RENDER_CONFIG = {
  module: ModuleKind.CommonJS,
  target: ScriptTarget.ES2015,
  script: ScriptKind.TSX,
};

Error.stackTraceLimit = Infinity;

log.setLevel('info');

export type TestGeneratorParams = {
  writeToLogger: boolean;
  writeToDisk: boolean;
  renderConfigOverride?: ReactRenderConfig;
  disabledSchemas?: string[];
};

export class TestGenerator {
  private readonly params: TestGeneratorParams;

  private readonly componentRendererFactory: any;

  private readonly themeRendererFactory: any;

  private readonly rendererManager: any;

  private readonly themeRendererManager: any;

  constructor(params: TestGeneratorParams) {
    this.params = params;
    const mergedRenderConfig = { ...DEFAULT_RENDER_CONFIG, ...params.renderConfigOverride };
    this.componentRendererFactory = new StudioTemplateRendererFactory(
      (component: StudioComponent) => new AmplifyRenderer(component, mergedRenderConfig),
    );
    this.themeRendererFactory = new StudioTemplateRendererFactory(
      (theme: StudioTheme) => new ReactThemeStudioTemplateRenderer(theme, mergedRenderConfig),
    );
    const outputPathDir = path.resolve(
      path.join(__dirname, '..', '..', '..', 'test-app-templates', 'src', 'ui-components'),
    );
    const outputConfig: ReactOutputConfig = { outputPathDir };
    this.rendererManager = new StudioTemplateRendererManager(this.componentRendererFactory, outputConfig);
    this.themeRendererManager = new StudioTemplateRendererManager(this.themeRendererFactory, outputConfig);
  }

  private decorateTypescriptWithMarkdown = (typescriptSource: string): string => {
    return `\`\`\`typescript jsx\n${typescriptSource}\n\`\`\``;
  };

  generate = () => {
    const renderErrors: { [key: string]: any } = {};

    Object.entries(ComponentSchemas).forEach(([name, schema]) => {
      if (this.params.disabledSchemas && this.params.disabledSchemas.includes(name)) {
        return;
      }
      try {
        if (this.params.writeToDisk) {
          this.rendererManager.renderSchemaToTemplate(schema as any);
        }

        if (this.params.writeToLogger) {
          const buildRenderer = this.componentRendererFactory.buildRenderer(schema as any);
          const compOnly = buildRenderer.renderComponentOnly();
          const compOnlyAppSample = buildRenderer.renderSampleCodeSnippet();
          log.info(`# ${name}`);
          log.info('## Component Only Output');
          log.info('### componentImports');
          log.info(this.decorateTypescriptWithMarkdown(compOnly.importsText));
          log.info('### componentText');
          log.info(this.decorateTypescriptWithMarkdown(compOnly.compText));
          log.info('## Code Snippet Output');
          log.info('### componentImports');
          log.info(this.decorateTypescriptWithMarkdown(compOnlyAppSample.importsText));
          log.info('### componentText');
          log.info(this.decorateTypescriptWithMarkdown(compOnlyAppSample.compText));
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
          this.themeRendererManager.renderSchemaToTemplate(schema as any);
        }

        if (this.params.writeToLogger) {
          const buildRenderer = this.themeRendererFactory.buildRenderer(schema as any);
          const component = buildRenderer.renderComponent();
          log.info(`# ${name}`);
          log.info('## Theme Output');
          log.info(this.decorateTypescriptWithMarkdown(component.componentText));
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
}
