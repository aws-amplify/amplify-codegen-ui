import {
  FirstOrderStudioComponent,
  StudioComponent,
} from "@amzn/amplify-ui-codegen-schema";
import ts, { factory, JsxElement, JsxFragment } from "typescript";
import { ReactStudioTemplateRenderer } from "../react-studio-template-renderer";

import BadgeRenderer from "./badge";
import ButtonRenderer from "./button";
import BoxRenderer from "./box";
import CardRenderer from "./card";
import DividerRenderer from "./divider";
import FlexRenderer from "./flex";
import ImageRenderer from "./image";
import TextRenderer from "./text";
import renderString from "./string";

export class AmplifyRenderer extends ReactStudioTemplateRenderer {
  constructor(component: FirstOrderStudioComponent) {
    super(component);
  }

  renderJsx(component: StudioComponent): JsxElement | JsxFragment {
    switch (component.componentType) {
      case "Badge":
        return new BadgeRenderer(component, this.importCollection).renderElement(
          (children) => children.map((child) => this.renderJsx(child))
        );

      case "Button":
        return new ButtonRenderer(component, this.importCollection).renderElement(
          (children) => children.map((child) => this.renderJsx(child))
        );

      case "Box":
        return new BoxRenderer(component, this.importCollection).renderElement(
          (children) => children.map((child) => this.renderJsx(child))
        );

      case "Card":
        return new CardRenderer(component, this.importCollection).renderElement(
          (children) => children.map((child) => this.renderJsx(child))
        );

      case "Divider":
        return new DividerRenderer(
          component,
          this.importCollection
        ).renderElement();

      case "Flex":
        return new FlexRenderer(component, this.importCollection).renderElement(
          (children) => children.map((child) => this.renderJsx(child))
        );

      case "Image":
        return new ImageRenderer(
          component,
          this.importCollection
        ).renderElement();

      case "String":
        return renderString(component);

      case "Text":
        return new TextRenderer(component, this.importCollection).renderElement(
          (children) => children.map((child) => this.renderJsx(child))
        );
    }

    console.warn(`${component.componentType} is not mapped!`);
    const element = factory.createJsxElement(
      factory.createJsxOpeningElement(
        factory.createIdentifier("div"),
        undefined,
        factory.createJsxAttributes([])
      ),
      [],
      factory.createJsxClosingElement(factory.createIdentifier("div"))
    );

    return element;
  }
}
