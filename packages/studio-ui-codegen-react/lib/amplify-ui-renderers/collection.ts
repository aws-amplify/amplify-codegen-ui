import { BaseComponentProps } from '@aws-amplify/ui-react';
import { StudioComponentChild } from '@amzn/amplify-ui-codegen-schema';
import { isStudioComponentWithCollectionProperties } from '@amzn/studio-ui-codegen';
import { factory, JsxChild, JsxElement, JsxExpression, SyntaxKind } from 'typescript';
import { ReactComponentWithChildrenRenderer } from '../react-component-with-children-renderer';

export default class CollectionRenderer extends ReactComponentWithChildrenRenderer<BaseComponentProps> {
  renderElement(renderChildren: (children: StudioComponentChild[]) => JsxChild[]): JsxElement {
    const tagName = this.component.componentType;
    const childrenJsx = this.component.children ? renderChildren(this.component.children ?? []) : [];

    const arrowFuncExpr = this.renderItemArrowFunctionExpr(childrenJsx);
    const itemsVariableName = this.findItemsVariableName();
    const element = factory.createJsxElement(
      this.renderCollectionOpeningElement(tagName, itemsVariableName),
      [arrowFuncExpr],
      factory.createJsxClosingElement(factory.createIdentifier(tagName)),
    );

    this.importCollection.addImport('@aws-amplify/ui-react', tagName);

    return element;
  }

  private findItemsVariableName(): string | undefined {
    if (isStudioComponentWithCollectionProperties(this.component)) {
      const collectionProps = Object.entries(this.component.collectionProperties ?? {});
      return collectionProps.length > 0 ? collectionProps[0][0] : undefined;
    }
    return undefined;
  }

  private renderItemArrowFunctionExpr(childrenJsx: JsxChild[]): JsxExpression {
    return factory.createJsxExpression(
      undefined,
      factory.createArrowFunction(
        undefined,
        undefined,
        [
          factory.createParameterDeclaration(
            undefined,
            undefined,
            undefined,
            factory.createIdentifier('item'),
            undefined,
            undefined,
            undefined,
          ),
          factory.createParameterDeclaration(
            undefined,
            undefined,
            undefined,
            factory.createIdentifier('index'),
            undefined,
            undefined,
            undefined,
          ),
        ],
        undefined,
        factory.createToken(SyntaxKind.EqualsGreaterThanToken),
        factory.createParenthesizedExpression(childrenJsx[0] as JsxExpression),
      ),
    );
  }
}
