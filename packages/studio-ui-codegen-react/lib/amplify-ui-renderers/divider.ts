import { DividerProps } from '@aws-amplify/ui-react';

import { factory, JsxElement } from 'typescript';
import { ReactComponentRenderer } from '../react-component-renderer';

export default class DividerRenderer extends ReactComponentRenderer<DividerProps> {
  renderElement(): JsxElement {
    const tagName = 'Divider';

    const element = factory.createJsxElement(
      this.renderOpeningElement(this.component.properties, tagName),
      [],
      factory.createJsxClosingElement(factory.createIdentifier(tagName)),
    );

    this.importCollection.addImport('@aws-amplify/ui-react', tagName);

    return element;
  }
}
