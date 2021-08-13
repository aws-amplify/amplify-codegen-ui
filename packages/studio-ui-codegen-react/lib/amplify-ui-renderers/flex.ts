import { FlexProps } from "@amzn/amplify-ui-react-types";

import {
  StudioComponentChild,
} from "@amzn/amplify-ui-codegen-schema";

import { ReactComponentWithChildrenRenderer } from "../react-component-with-children-renderer";

import { factory, JsxChild, JsxElement } from "typescript";

export default class FlexRenderer extends ReactComponentWithChildrenRenderer<FlexProps> {
  renderElement(
    renderChildren: (children: StudioComponentChild[]) => JsxChild[]
  ): JsxElement {
    const tagName = "Flex";

    const element = factory.createJsxElement(
      this.renderOpeningElement(factory, this.component.properties, tagName),
      renderChildren(this.component.children ?? []),
      factory.createJsxClosingElement(factory.createIdentifier(tagName))
    );

    this.importCollection.addImport("@aws-amplify/ui-react", tagName);
    
    return element;
  }
}
