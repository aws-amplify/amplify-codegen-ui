import { TextProps } from '@amzn/amplify-ui-react-types';

import { StudioComponent, StudioComponentProperties } from '@amzn/amplify-ui-codegen-schema';

import { ReactComponentWithChildrenRenderer } from '../react-component-with-children-renderer';

import ts, { factory, JsxChild, JsxElement } from "typescript";

export default class TextRenderer extends ReactComponentWithChildrenRenderer<TextProps, TextProps> {
  renderElement(
    renderChildren: (children: StudioComponent[]) => JsxChild[]
  ): JsxElement {
    const tagName = 'Text';

    const element = factory.createJsxElement(
      this.renderOpeningElement(factory, this.component.properties, tagName),
      renderChildren(this.component.children),
      factory.createJsxClosingElement(factory.createIdentifier(tagName)),
    );

    this.importCollection.addImport('@aws-amplify/ui-react', tagName);
    return element;
  }

  mapProps(props: TextProps): TextProps {
    return props;
  }
}