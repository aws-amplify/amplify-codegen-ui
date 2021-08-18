import {
  StudioComponent,
} from "@amzn/amplify-ui-codegen-schema"
import {
  StudioTemplateRendererManager,
  StudioTemplateRendererFactory,
} from "@amzn/studio-ui-codegen";
import { AmplifyRenderer } from "@amzn/studio-ui-codegen-react";

import * as schema from "./lib/dataBindingWithDataStore.json";

Error.stackTraceLimit = Infinity;

const rendererFactory = new StudioTemplateRendererFactory(
  (component: StudioComponent) => new AmplifyRenderer(component)
);

const rendererManager = new StudioTemplateRendererManager(rendererFactory, '.');

console.log(rendererManager);

rendererManager.renderSchemaToTemplate(schema as any);

const compOnly = rendererFactory.buildRenderer(schema as any).renderComponentOnly();
console.log("Component Only Output");
console.log("componentText ");
console.log(compOnly.compText);
console.log("componentImports ");
console.log(compOnly.importsText);

/*
const compOnlyAppSample = rendererFactory.buildRenderer(schema as any).renderSampleCodeSnippet();
console.log("Code Snippet Output");
console.log("componentText ");
console.log(compOnlyAppSample.compText);
console.log("componentImports ");
console.log(compOnlyAppSample.importsText);
*/
