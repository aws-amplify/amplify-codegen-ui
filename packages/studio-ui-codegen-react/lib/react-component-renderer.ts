import { StudioComponent, StudioComponentChild, StudioComponentProperties } from '@amzn/amplify-ui-codegen-schema';
import { ComponentRendererBase } from '@amzn/studio-ui-codegen';
import { JsxAttribute, JsxAttributeLike, JsxElement, JsxOpeningElement, NodeFactory } from 'typescript';

import { ImportCollection } from './import-collection';
import { buildOpeningElementAttributes } from './react-component-render-helper';

export abstract class ReactComponentRenderer<TPropIn> extends ComponentRendererBase<TPropIn, JsxElement> {
  constructor(component: StudioComponent | StudioComponentChild, protected importCollection: ImportCollection) {
    super(component);
  }

  protected renderOpeningElement(
    factory: NodeFactory,
    props: StudioComponentProperties,
    tagName: string,
  ): JsxOpeningElement {
    const propsArray: JsxAttribute[] = [];
    for (let propKey of Object.keys(props)) {
      const currentProp = props[propKey];
      propsArray.push(buildOpeningElementAttributes(currentProp, propKey));
    }

    this.addPropsSpreadAttributes(factory, propsArray, tagName);

    return factory.createJsxOpeningElement(
      factory.createIdentifier(tagName),
      undefined,
      factory.createJsxAttributes(propsArray),
    );
  }

  private addPropsSpreadAttributes(factory: NodeFactory, attributes: JsxAttributeLike[], tagName: string) {
    const propsAttr = factory.createJsxSpreadAttribute(factory.createIdentifier('props'));
    attributes.push(propsAttr);

    const overrideAttr = factory.createJsxSpreadAttribute(
      factory.createCallExpression(factory.createIdentifier('getOverrideProps'), undefined, [
        factory.createPropertyAccessExpression(
          factory.createIdentifier('props'),
          factory.createIdentifier('overrides'),
        ),
        factory.createStringLiteral(tagName),
      ]),
    );
    attributes.push(overrideAttr);
  }
}
