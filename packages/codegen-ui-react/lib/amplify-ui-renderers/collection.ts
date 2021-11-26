/*
  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.

  Licensed under the Apache License, Version 2.0 (the "License").
  You may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
 */
import { BaseComponentProps } from '@aws-amplify/ui-react';
import {
  isFrontendManagerComponentWithCollectionProperties,
  FrontendManagerComponentChild,
} from '@aws-amplify/codegen-ui';
import { factory, JsxChild, JsxElement, JsxExpression, SyntaxKind } from 'typescript';
import { ReactComponentWithChildrenRenderer } from '../react-component-with-children-renderer';

export default class CollectionRenderer extends ReactComponentWithChildrenRenderer<BaseComponentProps> {
  renderElement(renderChildren: (children: FrontendManagerComponentChild[]) => JsxChild[]): JsxElement {
    this.addKeyPropertyToChildren(this.component.children ?? []);
    const childrenJsx = this.component.children ? renderChildren(this.component.children ?? []) : [];

    const arrowFuncExpr = this.renderItemArrowFunctionExpr(childrenJsx);
    const itemsVariableName = this.findItemsVariableName();
    const element = factory.createJsxElement(
      this.renderCollectionOpeningElement(itemsVariableName),
      [arrowFuncExpr],
      factory.createJsxClosingElement(factory.createIdentifier(this.component.componentType)),
    );

    this.importCollection.addImport('@aws-amplify/ui-react', this.component.componentType);

    return element;
  }

  private addKeyPropertyToChildren(children: FrontendManagerComponentChild[]) {
    children.forEach((child: FrontendManagerComponentChild) => {
      if ('key' in child.properties) {
        return;
      }
      // eslint-disable-next-line no-param-reassign
      child.properties.key = {
        collectionBindingProperties: {
          property: '',
          field: 'id',
        },
      };
    });
  }

  private findItemsVariableName(): string | undefined {
    if (isFrontendManagerComponentWithCollectionProperties(this.component)) {
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
