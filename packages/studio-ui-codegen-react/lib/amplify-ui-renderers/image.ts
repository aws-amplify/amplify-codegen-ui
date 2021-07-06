import { ImageProps } from "../amplify-ui-props/amplify-image-props";
import { AmplifyImageProps } from "../amplify-ui-props/amplify-image-props";

import {
  StudioComponent,
  StudioComponentProperties,
} from "@amzn/amplify-ui-codegen-schema";
import { ReactComponentRenderer } from "../react-component-renderer"

import ts, { factory, JsxElement } from "typescript";

export default class ImageRenderer extends ReactComponentRenderer<
  ImageProps,
  AmplifyImageProps
> {
  renderElement(): ts.JsxElement {
    const element = factory.createJsxElement(
      this.renderOpeningElement(factory, this.component.props),
      [],
      factory.createJsxClosingElement(factory.createIdentifier("Image"))
    );

    this.importCollection.addImport("@amzn/amplify-ui", "Image");
    return element;
  }

  mapProps(props: ImageProps): AmplifyImageProps {
    return {
      htmlHeight: props.height,
      htmlWidth: props.width,
      source: props.source,
      alt: props.alt,
    };
  }

  private renderOpeningElement(
    factory: ts.NodeFactory,
    props: StudioComponentProperties
  ): ts.JsxOpeningElement {
    return factory.createJsxOpeningElement(
      factory.createIdentifier("Image"),
      undefined,
      factory.createJsxAttributes(this.convertPropsToJsxAttributes(props))
    );
  }
}
