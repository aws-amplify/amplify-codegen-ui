import {
  FirstOrderStudioComponent,
} from "@amzn/amplify-ui-codegen-schema"
import {
  StudioTemplateRendererManager,
  StudioTemplateRendererFactory,
} from "@amzn/studio-ui-codegen";
import { AmplifyRenderer } from "@amzn/studio-ui-codegen-react";

import * as schema from "./lib/buttonGolden.json";

Error.stackTraceLimit = Infinity;

const rendererFactory = new StudioTemplateRendererFactory(
  // If you want to use the Chakra Renderer, Swap AmplifyRendererOut
  (component: FirstOrderStudioComponent) => new AmplifyRenderer(component)
);

const rendererManager = new StudioTemplateRendererManager(rendererFactory, '.');

console.log(rendererManager);

rendererManager.renderSchemaToTemplates(schema as any);
