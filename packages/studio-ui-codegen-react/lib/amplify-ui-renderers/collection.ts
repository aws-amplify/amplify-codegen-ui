import { BaseComponentProps } from '@amzn/amplify-ui-react-types';
import { StudioComponentChild } from '@amzn/amplify-ui-codegen-schema';
import { isDataPropertyBinding } from '@amzn/studio-ui-codegen';
import { ReactComponentWithChildrenRenderer } from '../react-component-with-children-renderer';
import { factory, JsxChild, JsxElement, JsxExpression, SyntaxKind } from 'typescript';
export default class CollectionRenderer extends ReactComponentWithChildrenRenderer<BaseComponentProps> {
  renderElement(renderChildren: (children: StudioComponentChild[]) => JsxChild[]): JsxElement {
    const tagName = this.component.componentType;
    const childrenJsx = this.component.children ? renderChildren(this.component.children ?? []) : [];

    const arrowFuncExpr = this.renderItemArrowFunctionExpr(childrenJsx);
    const itemsVariableName = this.findItemsVariableName();
    const element = factory.createJsxElement(
      this.renderCollectionOpeningElement(factory, this.component.properties, tagName, itemsVariableName),
      [arrowFuncExpr],
      factory.createJsxClosingElement(factory.createIdentifier(tagName)),
    );

    this.importCollection.addImport('@aws-amplify/ui-react', tagName);

    return element;
  }

  private findItemsVariableName(): string {
    const collectionProps = Object.entries(this.component.collectionProperties ?? {});
    const dataProps = collectionProps.filter((value) => isDataPropertyBinding(value[1]));
    const modelName = dataProps.length > 0 ? dataProps[0][0] : 'items';
    return modelName;
  }

  private renderItemArrowFunctionExpr(childreanJsx: JsxChild[]): JsxExpression {
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
        factory.createParenthesizedExpression(childreanJsx[0] as JsxExpression),
      ),
    );
  }
}
