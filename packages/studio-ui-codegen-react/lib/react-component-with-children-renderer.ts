import { ComponentWithChildrenRendererBase, StudioNode } from '@amzn/studio-ui-codegen';
import { StudioComponent, StudioComponentChild, StudioComponentProperties } from '@amzn/amplify-ui-codegen-schema';

import {
  JsxAttribute,
  JsxAttributeLike,
  JsxElement,
  JsxChild,
  JsxOpeningElement,
  NodeFactory,
  SyntaxKind,
  Expression,
} from 'typescript';
import { ImportCollection } from './import-collection';
import { addBindingPropertiesImports, buildOpeningElementAttributes } from './react-component-render-helper';

export abstract class ReactComponentWithChildrenRenderer<TPropIn> extends ComponentWithChildrenRendererBase<
  TPropIn,
  JsxElement,
  JsxChild
> {
  constructor(
    component: StudioComponent | StudioComponentChild,
    protected importCollection: ImportCollection,
    protected parent?: StudioNode,
  ) {
    super(component, parent);
    addBindingPropertiesImports(component, importCollection);
  }

  protected renderCustomCompOpeningElement(
    factory: NodeFactory,
    props: StudioComponentProperties,
    tagName: string,
  ): JsxOpeningElement {
    const propsArray: JsxAttribute[] = [];
    for (const propKey of Object.keys(props)) {
      const currentProp = props[propKey];
      propsArray.push(buildOpeningElementAttributes(currentProp, propKey));
    }

    this.addFindChildOverrideAttribute(factory, propsArray, tagName);

    return factory.createJsxOpeningElement(
      factory.createIdentifier(tagName),
      undefined,
      factory.createJsxAttributes(propsArray),
    );
  }

  protected renderOpeningElement(
    factory: NodeFactory,
    props: StudioComponentProperties,
    tagName: string,
  ): JsxOpeningElement {
    const propsArray: JsxAttribute[] = [];
    for (const propKey of Object.keys(props)) {
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

  protected renderCollectionOpeningElement(
    factory: NodeFactory,
    props: StudioComponentProperties,
    tagName: string,
    itemsVariableName: string,
  ): JsxOpeningElement {
    const propsArray: JsxAttribute[] = [];
    for (const propKey of Object.keys(props)) {
      const currentProp = props[propKey];
      propsArray.push(buildOpeningElementAttributes(currentProp, propKey));
    }

    const itemsAttribute = factory.createJsxAttribute(
      factory.createIdentifier('items'),
      factory.createJsxExpression(undefined, factory.createIdentifier(itemsVariableName)),
    );
    propsArray.push(itemsAttribute);

    this.addPropsSpreadAttributes(factory, propsArray, tagName);

    return factory.createJsxOpeningElement(
      factory.createIdentifier(tagName),
      undefined,
      factory.createJsxAttributes(propsArray),
    );
  }

  private addPropsSpreadAttributes(factory: NodeFactory, attributes: JsxAttributeLike[], tagName: string) {
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

  private addFindChildOverrideAttribute(factory: NodeFactory, attributes: JsxAttributeLike[], tagName: string) {
    const findChildOverrideAttr = factory.createJsxSpreadAttribute(
      factory.createCallExpression(factory.createIdentifier('findChildOverrides'), undefined, [
        factory.createPropertyAccessExpression(
          factory.createIdentifier('props'),
          factory.createIdentifier('overrides'),
        ),
        factory.createStringLiteral(tagName),
      ]),
    );
    this.importCollection.addImport('@aws-amplify/ui-react', 'findChildOverrides');
    attributes.push(findChildOverrideAttr);
  }

  private addBoundExpressionAttributes(
    factory: NodeFactory,
    attributes: JsxAttributeLike[],
    propKey: string,
    propName: string,
    propValue: Expression,
  ) {
    const attr = factory.createJsxAttribute(
      factory.createIdentifier(propKey),
      factory.createJsxExpression(
        undefined,
        factory.createBinaryExpression(
          factory.createPropertyAccessExpression(factory.createIdentifier('props'), propName),
          SyntaxKind.QuestionQuestionToken,
          propValue,
        ),
      ),
    );

    attributes.push(attr);
  }
}
