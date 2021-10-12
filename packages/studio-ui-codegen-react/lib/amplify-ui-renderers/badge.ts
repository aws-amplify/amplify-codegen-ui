import { BadgeProps } from '@aws-amplify/ui-react';

import { StudioComponentChild } from '@amzn/amplify-ui-codegen-schema';

import { factory, JsxChild, JsxElement } from 'typescript';
import { ReactComponentWithChildrenRenderer } from '../react-component-with-children-renderer';

export default class BadgeRenderer extends ReactComponentWithChildrenRenderer<BadgeProps> {
  renderElement(renderChildren: (children: StudioComponentChild[]) => JsxChild[]): JsxElement {
    const tagName = 'Badge';
    const children = this.component.children ?? [];

    const element = factory.createJsxElement(
      this.renderOpeningElement(tagName),
      renderChildren(children),
      factory.createJsxClosingElement(factory.createIdentifier(tagName)),
    );

    this.importCollection.addImport('@aws-amplify/ui-react', tagName);

    return element;
  }
}
