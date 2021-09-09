import { ViewProps as CustomComponentProps } from '@amzn/amplify-ui-react-types';

import { StudioComponentChild } from '@amzn/amplify-ui-codegen-schema';

import { factory, JsxChild, JsxElement } from 'typescript';
import { ReactComponentWithChildrenRenderer } from '../react-component-with-children-renderer';

export default class CustomComponentRenderer extends ReactComponentWithChildrenRenderer<CustomComponentProps> {
  renderElement(renderChildren: (children: StudioComponentChild[]) => JsxChild[]): JsxElement {
    const tagName = this.component.componentType;

    const childrenJsx = this.component.children ? renderChildren(this.component.children ?? []) : [];
    const element = factory.createJsxElement(
      this.renderCustomCompOpeningElement(factory, this.component.properties, tagName),
      childrenJsx,
      factory.createJsxClosingElement(factory.createIdentifier(tagName)),
    );

    this.importCollection.addImport('@aws-amplify/ui-react', tagName);

    return element;
  }
}
