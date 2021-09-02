import { BadgeProps } from '@amzn/amplify-ui-react-types';

import { StudioComponentChild, StudioComponentProperties } from '@amzn/amplify-ui-codegen-schema';

import { ReactComponentWithChildrenRenderer } from '../react-component-with-children-renderer';

import { factory, JsxChild, JsxElement } from 'typescript';

export default class BadgeRenderer extends ReactComponentWithChildrenRenderer<BadgeProps> {
  renderElement(renderChildren: (children: StudioComponentChild[]) => JsxChild[]): JsxElement {
    const tagName = 'Badge';
    const children = this.component.children ?? [];

    const element = factory.createJsxElement(
      this.renderOpeningElement(factory, this.component.properties, tagName),
      renderChildren(children),
      factory.createJsxClosingElement(factory.createIdentifier(tagName)),
    );

    this.importCollection.addImport('@aws-amplify/ui-react', tagName);

    return element;
  }
}
