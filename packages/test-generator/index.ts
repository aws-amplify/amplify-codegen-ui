import {
  FirstOrderStudioComponent,
} from "@amzn/amplify-ui-codegen-schema"
import {
  StudioTemplateRendererManager,
  StudioTemplateRendererFactory,
} from "@amzn/studio-ui-codegen";
import { AmplifyRenderer } from "@amzn/studio-ui-codegen-react";

import * as schema from "./lib/boxGolden.json";

Error.stackTraceLimit = Infinity;

const rendererFactory = new StudioTemplateRendererFactory(
  (component: FirstOrderStudioComponent) => new AmplifyRenderer(component)
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
