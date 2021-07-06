import {
  ComponentWithChildrenRendererBase,
} from "@amzn/studio-ui-codegen";
import {
  StudioComponent,
  StudioComponentProperties,
  StudioComponentProperty,
} from "@amzn/amplify-ui-codegen-schema";
import { JsxElement, JsxChild, factory, JsxAttribute } from "typescript";
import { ImportCollection } from "./import-collection";

export abstract class ReactComponentWithChildrenRenderer<
  TPropIn,
  TPropOut
> extends ComponentWithChildrenRendererBase<
  TPropIn,
  TPropOut,
  JsxElement,
  JsxChild
> {
  constructor(
    component: StudioComponent,
    protected importCollection: ImportCollection
  ) {
    super(component);
  }

  protected convertPropsToJsxAttributes(props: StudioComponentProperties) {
    const propsArray: JsxAttribute[] = [];

    const convertedProps = this.convertPropsFromJsonSchema(props);

    for (let prop of convertedProps) {
      let value;

      value = factory.createStringLiteral(prop[1]);

      if (value) {
        const attr = factory.createJsxAttribute(
          factory.createIdentifier(prop[0]),
          value
        );

        if (prop[0] && prop[1]) {
          propsArray.push(attr);
        } else {
          console.warn(`Prop ${prop[0]} is not set`);
        }
      } else {
        console.log("Skipping ", prop);
      }
    }

    return propsArray;
  }
}
