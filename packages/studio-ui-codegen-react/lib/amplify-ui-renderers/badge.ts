import { BadgeProps as AmplifyBadgeProps, BadgeProps } from "../amplify-ui-props/amplify-badge-props";
import {
  StudioComponent,
  StudioComponentProperties,
} from "@amzn/amplify-ui-codegen-schema";

import { ReactComponentWithChildrenRenderer } from "../react-component-with-children-renderer"

import ts, { factory, JsxChild, JsxElement } from "typescript";

export default class BadgeRenderer extends ReactComponentWithChildrenRenderer<
  BadgeProps,
  AmplifyBadgeProps
> {
  renderElement(
    renderChildren: (children: StudioComponent[]) => JsxChild[]
  ): ts.JsxElement {
    const element = factory.createJsxElement(
      this.renderOpeningElement(factory, this.component.props),
      renderChildren(this.component.children),
      factory.createJsxClosingElement(factory.createIdentifier("Badge"))
    );

    this.importCollection.addImport("@amzn/amplify-ui", "Badge");
    return element;
  }

  mapProps(props: BadgeProps): AmplifyBadgeProps {
    return {
      color: props.color,
    };
  }

  private renderOpeningElement(
    factory: ts.NodeFactory,
    props: StudioComponentProperties
  ): ts.JsxOpeningElement {
    return factory.createJsxOpeningElement(
      factory.createIdentifier("Badge"),
      undefined,
      factory.createJsxAttributes(this.convertPropsToJsxAttributes(props))
    );
  }
}
