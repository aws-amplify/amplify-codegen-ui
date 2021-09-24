import { TextProps } from '@amzn/amplify-ui-react-types';

import { FixedStudioComponentProperty } from '@amzn/amplify-ui-codegen-schema';

import { factory, JsxElement, JsxChild } from 'typescript';
import { ReactComponentRenderer } from '../react-component-renderer';
import { isBoundProperty } from '../react-component-render-helper';

export default class TextRenderer extends ReactComponentRenderer<TextProps> {
  renderElement(): JsxElement {
    const tagName = 'Text';

    // value should be child of Text, not a prop
    const { value, ...properties } = this.component.properties;

    const element = factory.createJsxElement(
      this.renderOpeningElement(factory, properties, tagName),
      this.getChildren(),
      factory.createJsxClosingElement(factory.createIdentifier(tagName)),
    );

    this.importCollection.addImport('@aws-amplify/ui-react', tagName);
    return element;
  }

  getChildren(): JsxChild[] {
    const { value } = this.component.properties;
    if (isBoundProperty(value)) {
      const {
        bindingProperties: { property },
      } = value;
      return [factory.createJsxExpression(undefined, factory.createIdentifier(property))];
    }
    return [
      factory.createJsxText(
        (value ? (this.component.properties.value as FixedStudioComponentProperty).value ?? '' : '').toString(),
      ),
    ];
  }
}
