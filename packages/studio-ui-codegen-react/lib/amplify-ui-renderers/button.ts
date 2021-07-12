import { ButtonProps } from "@amzn/amplify-ui-react-types";

import {
  StudioComponent,
  StudioComponentProperties,
} from "@amzn/amplify-ui-codegen-schema";

import { ReactComponentRenderer } from "../react-component-renderer"

import ts, { factory, JsxElement } from "typescript";

export default class ButtonRenderer extends ReactComponentRenderer<ButtonProps, ButtonProps> {
  renderElement(): ts.JsxElement {
    const tagName = "Button";

    const element = factory.createJsxElement(
      this.renderOpeningElement(factory, this.component.properties, tagName),
      [],
      factory.createJsxClosingElement(factory.createIdentifier(tagName))
    );

    this.importCollection.addImport("@amzn-amplify/amplify-ui", tagName);
    return element;
  }

  mapProps(props: ButtonProps): ButtonProps {
    return {
    };
  }
}