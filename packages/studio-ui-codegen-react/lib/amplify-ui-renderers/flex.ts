import { FlexProps } from '@aws-amplify/ui-react';

import { StudioComponentChild } from '@amzn/amplify-ui-codegen-schema';

import { factory, JsxChild, JsxElement } from 'typescript';
import { ReactComponentWithChildrenRenderer } from '../react-component-with-children-renderer';

export default class FlexRenderer extends ReactComponentWithChildrenRenderer<FlexProps> {
  renderElement(renderChildren: (children: StudioComponentChild[]) => JsxChild[]): JsxElement {
    const tagName = 'Flex';

    const element = factory.createJsxElement(
      this.renderOpeningElement(factory, this.component.properties, tagName),
      renderChildren(this.component.children ?? []),
      factory.createJsxClosingElement(factory.createIdentifier(tagName)),
    );

    this.importCollection.addImport('@aws-amplify/ui-react', tagName);

    return element;
  }
}
