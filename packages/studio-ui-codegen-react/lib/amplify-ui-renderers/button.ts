import { ButtonProps } from "@amzn/amplify-ui-react-types";

import {
  StudioComponent,
  StudioComponentProperties,
} from "@amzn/amplify-ui-codegen-schema";

import { ReactComponentWithChildrenRenderer } from "../react-component-with-children-renderer";

import { factory, JsxChild, JsxElement } from "typescript";

export default class ButtonRenderer extends ReactComponentWithChildrenRenderer<ButtonProps, ButtonProps> {
  renderElement(
    renderChildren: (children: StudioComponent[]) => JsxChild[]
  ): JsxElement {
    const tagName = "Button";
    const element = factory.createJsxElement(
      this.renderOpeningElement(factory, this.component.properties, tagName),
      this.component.children ? renderChildren(this.component.children) : [],
      factory.createJsxClosingElement(factory.createIdentifier(tagName))
    );

    this.importCollection.addImport("@aws-amplify/ui-react", tagName);

    return element;
  }

  mapProps(props: ButtonProps): ButtonProps {
    return props;
  }
}
