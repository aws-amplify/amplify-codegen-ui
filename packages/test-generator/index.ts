import {
  StudioComponent,
} from "@amzn/amplify-ui-codegen-schema"
import {
  StudioTemplateRendererManager,
  StudioTemplateRendererFactory,
} from "@amzn/studio-ui-codegen";
import { 
  AmplifyRenderer, 
  ReactOutputConfig,
  JSModuleEnum,
  CompileTargetEnum,
  JSOutputFormatEnum
} from "@amzn/studio-ui-codegen-react";
import path from 'path';

import * as schema from "./lib/dataBindingWithDataStore.json";

Error.stackTraceLimit = Infinity;

const rendererFactory = new StudioTemplateRendererFactory(
  (component: StudioComponent) => new AmplifyRenderer(component)
);

const outputPathDir = path.resolve(path.join(__dirname, '..', 'ui-components'));
const outputConfig: ReactOutputConfig = {
  outputPathDir,
  module: JSModuleEnum.CommonJS,
  compileTarget: CompileTargetEnum.ES6,
  outputFormat: JSOutputFormatEnum.tsx
};
const rendererManager = new StudioTemplateRendererManager(rendererFactory, outputConfig);

console.log(rendererManager);

rendererManager.renderSchemaToTemplate(schema as any);

const compOnly = rendererFactory.buildRenderer(schema as any).renderComponentOnly();
console.log("Component Only Output");
console.log("componentText ");
console.log(compOnly.compText);
console.log("componentImports ");
console.log(compOnly.importsText);

const compOnlyAppSample = rendererFactory.buildRenderer(schema as any).renderSampleCodeSnippet();
console.log("Code Snippet Output");
console.log("componentText ");
console.log(compOnlyAppSample.compText);
console.log("componentImports ");
console.log(compOnlyAppSample.importsText);
