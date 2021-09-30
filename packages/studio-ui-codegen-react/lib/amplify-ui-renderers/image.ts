import { ImageProps } from '@aws-amplify/ui-react';

import { factory, JsxElement } from 'typescript';
import { ReactComponentRenderer } from '../react-component-renderer';

export default class ImageRenderer extends ReactComponentRenderer<ImageProps> {
  renderElement(): JsxElement {
    const tagName = 'Image';

    const element = factory.createJsxElement(
      this.renderOpeningElement(factory, this.component.properties, tagName),
      [],
      factory.createJsxClosingElement(factory.createIdentifier(tagName)),
    );

    this.importCollection.addImport('@aws-amplify/ui-react', tagName);
    return element;
  }
}
