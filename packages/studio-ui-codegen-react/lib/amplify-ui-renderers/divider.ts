import { DividerProps } from '@amzn/amplify-ui-react-types';

import { StudioComponent, StudioComponentProperties } from '@amzn/amplify-ui-codegen-schema';

import { ReactComponentRenderer } from '../react-component-renderer';

import { factory, JsxElement } from 'typescript';

export default class DividerRenderer extends ReactComponentRenderer<DividerProps> {
  renderElement(): JsxElement {
    const tagName = 'Divider';

    const element = factory.createJsxElement(
      this.renderOpeningElement(factory, this.component.properties, tagName),
      [],
      factory.createJsxClosingElement(factory.createIdentifier(tagName)),
    );

    this.importCollection.addImport('@aws-amplify/ui-react', tagName);

    return element;
  }
}
