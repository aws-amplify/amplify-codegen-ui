import { ButtonProps } from '@aws-amplify/ui-react';

import { StudioComponentChild } from '@amzn/amplify-ui-codegen-schema';

import { factory, JsxChild, JsxElement } from 'typescript';
import { ReactComponentWithChildrenRenderer } from '../react-component-with-children-renderer';

export default class ButtonRenderer extends ReactComponentWithChildrenRenderer<ButtonProps> {
  renderElement(renderChildren: (children: StudioComponentChild[]) => JsxChild[]): JsxElement {
    const tagName = 'Button';
    const element = factory.createJsxElement(
      this.renderOpeningElement(this.component.properties, tagName),
      this.component.children ? renderChildren(this.component.children) : [],
      factory.createJsxClosingElement(factory.createIdentifier(tagName)),
    );

    this.importCollection.addImport('@aws-amplify/ui-react', tagName);

    return element;
  }
}
