import { ViewProps as CustomComponentProps } from '@amzn/amplify-ui-react-types';

import { StudioComponent, StudioComponentProperties } from '@amzn/amplify-ui-codegen-schema';

import { ReactComponentWithChildrenRenderer } from '../react-component-with-children-renderer';

import { factory, JsxChild, JsxElement } from 'typescript';

export default class CustomComponentRenderer extends ReactComponentWithChildrenRenderer<
  CustomComponentProps,
  CustomComponentProps
> {
  renderElement(renderChildren: (children: StudioComponent[]) => JsxChild[]): JsxElement {
    const tagName = this.component.componentType;

    const childrenJsx = this.component.children ? renderChildren(this.component.children) : [];
    const element = factory.createJsxElement(
      this.renderCustomCompOpeningElement(factory, this.component.properties, tagName),
      childrenJsx,
      factory.createJsxClosingElement(factory.createIdentifier(tagName)),
    );

    this.importCollection.addImport('@aws-amplify/ui-react', tagName);

    return element;
  }

  mapProps(props: CustomComponentProps): CustomComponentProps {
    return props;
  }
}
