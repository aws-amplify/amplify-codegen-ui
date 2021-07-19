import { CardProps } from "@amzn/amplify-ui-react-types";

import {
  StudioComponent,
  StudioComponentProperties,
} from "@amzn/amplify-ui-codegen-schema";

import { ReactComponentWithChildrenRenderer } from "../react-component-with-children-renderer";

import ts, { factory, JsxChild, JsxElement } from "typescript";

export default class CardRenderer extends ReactComponentWithChildrenRenderer<CardProps, CardProps> {
  renderElement(
    renderChildren: (children: StudioComponent[]) => JsxChild[]
  ): JsxElement {
    const tagName = "Card";

    const element = factory.createJsxElement(
      this.renderOpeningElement(factory, this.component.properties, tagName),
      renderChildren(this.component.children),
      factory.createJsxClosingElement(factory.createIdentifier(tagName))
    );

    this.importCollection.addImport("@aws-amplify/ui-react", tagName);
    return element;
  }

  mapProps(props: CardProps): CardProps {
    return props;
  }
}