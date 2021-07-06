import {
  StudioComponent,
  StudioComponentProperties,
} from "@amzn/amplify-ui-codegen-schema";
import { ComponentRendererBase } from "@amzn/studio-ui-codegen";
import { factory, JsxAttribute, JsxElement } from "typescript";

import { ImportCollection } from "./import-collection";

export abstract class ReactComponentRenderer<
  TPropIn,
  TPropOut
> extends ComponentRendererBase<TPropIn, TPropOut, JsxElement> {
  constructor(
    component: StudioComponent,
    protected importCollection: ImportCollection
  ) {
    super(component);
  }

  protected convertPropsToJsxAttributes(props: StudioComponentProperties) {
    const propsArray: JsxAttribute[] = [];

    for (let prop of this.convertPropsFromJsonSchema(props)) {
      let value;
      console.log(prop);

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
