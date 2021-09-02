import { TextProps } from '@amzn/amplify-ui-react-types';

import {
  FixedStudioComponentProperty,
  StudioComponent,
  StudioComponentProperties,
} from '@amzn/amplify-ui-codegen-schema';

import { factory, JsxElement } from 'typescript';
import { ReactComponentRenderer } from '../react-component-renderer';

export default class TextRenderer extends ReactComponentRenderer<TextProps> {
  renderElement(): JsxElement {
    const tagName = 'Text';
    const textValue = this.component.properties.value
      ? (this.component.properties.value as FixedStudioComponentProperty).value ?? ''
      : '';
    const element = factory.createJsxElement(
      this.renderOpeningElement(factory, this.component.properties, tagName),
      [factory.createJsxText(textValue.toString())],
      factory.createJsxClosingElement(factory.createIdentifier(tagName)),
    );

    this.importCollection.addImport('@aws-amplify/ui-react', tagName);
    return element;
  }
}
