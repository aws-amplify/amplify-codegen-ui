import { FrameworkOutputManager } from "./framework-output-manager";
import { StudioTemplateRenderer } from "./studio-template-renderer";
import { StudioTemplateRendererFactory } from "./template-renderer-factory";
import { StudioApp } from "@amzn/amplify-ui-codegen-schema";

var fs = require("fs");
var path = require("path");

/**
 * This is a class for genercially rendering Studio templates.
 * The output is determined by the renderer passed into the constructor.
 */
export class StudioTemplateRendererManager<
  TSource,
  TOutputManager extends FrameworkOutputManager<TSource>,
  TRenderOutput,
  TRenderer extends StudioTemplateRenderer<
    TSource,
    TOutputManager,
    TRenderOutput
  >
> {
  constructor(
    private renderer: StudioTemplateRendererFactory<
      TSource,
      TOutputManager,
      TRenderOutput,
      TRenderer
    >,
    private renderPath: string = "components"
  ) {
    if (!fs.existsSync(renderPath)) {
      fs.mkdirSync(renderPath);
    }
  }

  renderSchemaToTemplates(jsonSchema: StudioApp | undefined) {
    if (!jsonSchema) {
      throw new Error("Please ensure you have passed in a valid schema");
    }

    console.log("Rendering App ", jsonSchema.studioConfig.name);

    for (let component of jsonSchema.studioConfig?.components) {
      const componentPath = path.join(this.renderPath, component.name);

      this.renderer.buildRenderer(component).renderComponent();
    }
  }
}
