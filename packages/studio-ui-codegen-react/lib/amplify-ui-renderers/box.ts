import { BoxProps } from "../amplify-ui-props/amplify-box-props";
import { AmplifyBoxProps } from "../amplify-ui-props/amplify-box-props";

import {
  StudioComponent,
  StudioComponentProperties,
} from "@amzn/amplify-ui-codegen-schema";

import { ReactComponentWithChildrenRenderer } from "../react-component-with-children-renderer"

import ts, { factory, JsxChild, JsxElement } from "typescript";
export default class BoxRenderer extends ReactComponentWithChildrenRenderer<
  BoxProps,
  AmplifyBoxProps
> {
  renderElement(
    renderChildren: (children: StudioComponent[]) => JsxChild[]
  ): JsxElement {
    const tagName = "Box";

    const childrenJsx = this.component.children ? renderChildren(this.component.children) : [];
    const element = factory.createJsxElement(
      this.renderOpeningElement(factory, this.component.properties, tagName),
      childrenJsx,
      factory.createJsxClosingElement(factory.createIdentifier(tagName))
    );

    this.importCollection.addImport("@amzn/amplify-ui", tagName);

    return element;
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
