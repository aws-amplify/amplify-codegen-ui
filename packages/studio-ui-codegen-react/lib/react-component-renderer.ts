import { StudioComponent, StudioComponentChild } from '@amzn/amplify-ui-codegen-schema';
import { ComponentRendererBase, StudioNode } from '@amzn/studio-ui-codegen';
import { JsxAttributeLike, JsxElement, JsxOpeningElement, factory } from 'typescript';

import { addBindingPropertiesImports, buildOpeningElementAttributes } from './react-component-render-helper';
import { ImportCollection } from './import-collection';

export abstract class ReactComponentRenderer<TPropIn> extends ComponentRendererBase<TPropIn, JsxElement> {
  constructor(
    component: StudioComponent | StudioComponentChild,
    protected importCollection: ImportCollection,
    protected parent?: StudioNode,
  ) {
    super(component, parent);
    addBindingPropertiesImports(component, importCollection);
  }

  protected renderOpeningElement(tagName: string): JsxOpeningElement {
    const propsArray = Object.entries(this.component.properties)
      // value should be child of Text, not a prop
      .filter(([key]) => !(this.component.componentType === 'Text' && key === 'value'))
      .map(([key, value]) => buildOpeningElementAttributes(value, key));

    this.addPropsSpreadAttributes(propsArray);

    return factory.createJsxOpeningElement(
      factory.createIdentifier(tagName),
      undefined,
      factory.createJsxAttributes(propsArray),
    );
  }

  private addPropsSpreadAttributes(attributes: JsxAttributeLike[]) {
    if (this.node.isRoot()) {
      const propsAttr = factory.createJsxSpreadAttribute(factory.createIdentifier('props'));
      attributes.push(propsAttr);
    }

    const overrideAttr = factory.createJsxSpreadAttribute(
      factory.createCallExpression(factory.createIdentifier('getOverrideProps'), undefined, [
        factory.createPropertyAccessExpression(
          factory.createIdentifier('props'),
          factory.createIdentifier('overrides'),
        ),
        factory.createStringLiteral(
          this.node
            .getComponentPathToRoot()
            .reverse()
            .map((component) => component.componentType)
            .join('.'),
        ),
      ]),
    );
    this.importCollection.addImport('@aws-amplify/ui-react', 'getOverrideProps');
    attributes.push(overrideAttr);
  }
}
