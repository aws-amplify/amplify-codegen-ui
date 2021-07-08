import { BoxProps } from "../amplify-ui-props/amplify-box-props";
import {
  StudioComponent,
  StudioComponentProperties,
} from "@amzn/amplify-ui-codegen-schema";

import { ReactComponentWithChildrenRenderer } from "../react-component-with-children-renderer"

import ts, { factory, JsxChild, JsxElement } from "typescript";

import { AmplifyBoxProps } from "../amplify-ui-props/amplify-box-props";

export default class BoxRenderer extends ReactComponentWithChildrenRenderer<
  BoxProps,
  AmplifyBoxProps
> {
  renderElement(
    renderChildren: (children: StudioComponent[]) => JsxChild[]
  ): JsxElement {
    const element = factory.createJsxElement(
      this.renderOpeningElement(factory, this.component.properties),
      renderChildren(this.component.children),
      factory.createJsxClosingElement(factory.createIdentifier("Box"))
    );

    this.importCollection.addImport("@amzn/amplify-ui", "Box");

    return element;
  }

  private renderOpeningElement(
    factory: ts.NodeFactory,
    props: StudioComponentProperties
  ): ts.JsxOpeningElement {
    return factory.createJsxOpeningElement(
      factory.createIdentifier("Box"),
      undefined,
      factory.createJsxAttributes(this.convertPropsToJsxAttributes(props))
    );
  }

  mapProps(props: BoxProps): AmplifyBoxProps {
    const newProps: AmplifyBoxProps = {
      width: props.width,
      maxHeight: props.maxHeight,
      maxWidth: props.maxWidth,
      height: props.height,
      borderRadius: props.borderRadius,
      borderWidth: props.borderWidth,
      overflow: props.overflow,
      fontWeight: props.fontWeight,
      fontSize: props.fontSize,
      color: props.color,
      display: props.display,
      padding: props.padding,
    };

    if (props.flow) {
      newProps.display = "flex";

      if (props.flow === "horizontal") {
        newProps["flex-direction"] = "row";
      } else {
        newProps["flex-direction"] = "column";
      }
    }

    return newProps;
  }
}
