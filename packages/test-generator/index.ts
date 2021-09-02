import { StudioComponent } from '@amzn/amplify-ui-codegen-schema';
import { StudioTemplateRendererManager, StudioTemplateRendererFactory } from '@amzn/studio-ui-codegen';
import {
  AmplifyRenderer,
  ReactOutputConfig,
  JSModuleEnum,
  CompileTargetEnum,
  JSOutputFormatEnum,
} from '@amzn/studio-ui-codegen-react';
import path from 'path';

import * as schemas from './lib';

Error.stackTraceLimit = Infinity;

const rendererFactory = new StudioTemplateRendererFactory(
  (component: StudioComponent) => new AmplifyRenderer(component),
);

const outputPathDir = path.resolve(path.join(__dirname, '..', 'ui-components'));
const outputConfig: ReactOutputConfig = {
  outputPathDir,
  module: JSModuleEnum.CommonJS,
  compileTarget: CompileTargetEnum.ES6,
  outputFormat: JSOutputFormatEnum.tsx,
};
const rendererManager = new StudioTemplateRendererManager(rendererFactory, outputConfig);
Object.entries(schemas).forEach(([name, schema]) => {
  console.log(name);
  try {
    rendererManager.renderSchemaToTemplate(schema as any);
    const buildRenderer = rendererFactory.buildRenderer(schema as any);

    const compOnly = buildRenderer.renderComponentOnly();
    console.log('Component Only Output');
    console.log('componentImports ');
    console.log(compOnly.importsText);
    console.log('componentText ');
    console.log(compOnly.compText);

    const compOnlyAppSample = buildRenderer.renderSampleCodeSnippet();
    console.log('Code Snippet Output');
    console.log('componentImports ');
    console.log(compOnlyAppSample.importsText);
    console.log('componentText ');
    console.log(compOnlyAppSample.compText);
  } catch (err) {
    console.log(`${name} failed with error:`);
    console.log(err);
  }
});
