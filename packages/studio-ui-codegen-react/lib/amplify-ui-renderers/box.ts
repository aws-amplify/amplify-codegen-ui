import { ViewProps as BoxProps } from '@aws-amplify/ui-react';

import { StudioComponentChild } from '@amzn/amplify-ui-codegen-schema';

import { factory, JsxChild, JsxElement } from 'typescript';
import { ReactComponentWithChildrenRenderer } from '../react-component-with-children-renderer';

export default class BoxRenderer extends ReactComponentWithChildrenRenderer<BoxProps> {
  renderElement(renderChildren: (children: StudioComponentChild[]) => JsxChild[]): JsxElement {
    const tagName = 'View';

    const childrenJsx = this.component.children ? renderChildren(this.component.children) : [];
    const element = factory.createJsxElement(
      this.renderOpeningElement(tagName),
      childrenJsx,
      factory.createJsxClosingElement(factory.createIdentifier(tagName)),
    );

    this.importCollection.addImport('@aws-amplify/ui-react', tagName);

    return element;
  }
}
