import { FrameworkOutputManager } from "./framework-output-manager";
import { StudioTemplateRenderer } from "./studio-template-renderer";
import { StudioTemplateRendererFactory } from "./template-renderer-factory";
import { StudioComponent } from "@amzn/amplify-ui-codegen-schema";
import { StudioRendererConstants } from "./renderer-helper";

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

  renderSchemaToTemplate(component: StudioComponent | undefined) {
    if (!component) {
      throw new Error("Please ensure you have passed in a valid component schema");
    }
    console.log("Rendering a component ", component.componentType);
    this.renderer.buildRenderer(component).renderComponent();
  }

  renderSchemaToTemplates(jsonSchema: StudioComponent[] | undefined) {
    if (!jsonSchema) {
      throw new Error("Please ensure you have passed in a valid schema");
    }

    console.log("Rendering multiple components ", jsonSchema.length);

    for (let component of jsonSchema) {
      const componentPath = path.join(this.renderPath, component.name ?? StudioRendererConstants.unknownName);

      this.renderer.buildRenderer(component).renderComponent();
    }
  }
}
