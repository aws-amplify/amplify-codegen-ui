import { IconProps } from "../amplify-ui-props/amplify-icon-props";
import { AmplifyIconProps } from "../amplify-ui-props/amplify-icon-props";

import {
  StudioComponent,
  StudioComponentProperties,
} from "@amzn/amplify-ui-codegen-schema";

import { ReactComponentRenderer } from "../react-component-renderer"

import ts, { factory, JsxElement } from "typescript";

export default class IconRenderer extends ReactComponentRenderer<
  IconProps,
  AmplifyIconProps
> {
  renderElement(): ts.JsxElement {
    const tagName = "Icon";

    const element = factory.createJsxElement(
      this.renderOpeningElement(factory, this.component.properties, tagName),
      [],
      factory.createJsxClosingElement(factory.createIdentifier(tagName))
    );

    this.importCollection.addImport("@amzn-amplify/amplify-ui", tagName);
    return element;
  }

  mapProps(props: IconProps): AmplifyIconProps {
    return {
      w: props.width,
      h: props.height,
      color: props.color,
    };
  }
}
