import { TextProps } from '@amzn/amplify-ui-react-types';

import { StudioComponent, StudioComponentProperties } from '@amzn/amplify-ui-codegen-schema';

import { ReactComponentRenderer } from '../react-component-renderer';

import { factory, JsxElement } from 'typescript';

export default class TextRenderer extends ReactComponentRenderer<TextProps, TextProps> {
  renderElement(): JsxElement {
    const tagName = 'Text';
    const textValue = this.component.properties.value ? this.component.properties.value.value ?? '' : '';
    const element = factory.createJsxElement(
      this.renderOpeningElement(factory, this.component.properties, tagName),
      [factory.createJsxText(textValue)],
      factory.createJsxClosingElement(factory.createIdentifier(tagName)),
    );

    this.importCollection.addImport('@aws-amplify/ui-react', tagName);
    return element;
  }

  mapProps(props: TextProps): TextProps {
    return props;
  }
}