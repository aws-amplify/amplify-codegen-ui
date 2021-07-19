import { TextProps } from '@aws-amplify/ui-react-types';

import { StudioComponent, StudioComponentProperties } from '@amzn/amplify-ui-codegen-schema';

import { ReactComponentRenderer } from '../react-component-renderer';

import ts, { factory, JsxElement } from 'typescript';

export default class TextRenderer extends ReactComponentRenderer<TextProps, TextProps> {
  renderElement(): ts.JsxElement {
    const tagName = 'Text';
    const textValue = this.component.properties.value ? this.component.properties.value.value ?? '' : '';
    const element = factory.createJsxElement(
      this.renderOpeningElement(factory, this.component.properties, tagName),
      [factory.createJsxText(textValue)],
      factory.createJsxClosingElement(factory.createIdentifier(tagName)),
    );

    this.importCollection.addImport('@amzn-amplify/amplify-ui', tagName);
    return element;
  }

  mapProps(props: TextProps): TextProps {
    return {};
  }
}