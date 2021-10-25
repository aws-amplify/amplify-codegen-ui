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
import { ComponentWithChildrenRendererBase, StudioNode } from '@amzn/studio-ui-codegen';
import { StudioComponent, StudioComponentChild } from '@amzn/amplify-ui-codegen-schema';
import { JsxAttributeLike, JsxElement, JsxChild, JsxOpeningElement, SyntaxKind, Expression, factory } from 'typescript';
import { ImportCollection } from './import-collection';
import {
  addBindingPropertiesImports,
  buildOpeningElementAttributes,
  buildOpeningElementActions,
} from './react-component-render-helper';

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

  protected renderCustomCompOpeningElement(): JsxOpeningElement {
    const attributes = Object.entries(this.component.properties).map(([key, value]) =>
      buildOpeningElementAttributes(value, key),
    );

    if ('events' in this.component && this.component.events !== undefined) {
      attributes.push(
        ...Object.entries(this.component.events).map(([key, value]) => buildOpeningElementActions(key, value)),
      );
    }

    this.addFindChildOverrideAttribute(attributes, this.component.componentType);

    return factory.createJsxOpeningElement(
      factory.createIdentifier(this.component.componentType),
      undefined,
      factory.createJsxAttributes(attributes),
    );
  }

  protected renderOpeningElement(): JsxOpeningElement {
    const attributes = Object.entries(this.component.properties).map(([key, value]) =>
      buildOpeningElementAttributes(value, key),
    );

    if ('events' in this.component && this.component.events !== undefined) {
      attributes.push(
        ...Object.entries(this.component.events).map(([key, value]) => buildOpeningElementActions(key, value)),
      );
    }

    this.addPropsSpreadAttributes(attributes);

    return factory.createJsxOpeningElement(
      factory.createIdentifier(this.component.componentType),
      undefined,
      factory.createJsxAttributes(attributes),
    );
  }

  protected renderCollectionOpeningElement(itemsVariableName?: string): JsxOpeningElement {
    const propsArray = Object.entries(this.component.properties).map(([key, value]) =>
      buildOpeningElementAttributes(value, key),
    );

    const itemsAttribute = factory.createJsxAttribute(
      factory.createIdentifier('items'),
      factory.createJsxExpression(
        undefined,
        factory.createBinaryExpression(
          factory.createIdentifier(itemsVariableName || 'items'),
          factory.createToken(SyntaxKind.BarBarToken),
          factory.createArrayLiteralExpression([], false),
        ),
      ),
    );
    propsArray.push(itemsAttribute);

    this.addPropsSpreadAttributes(propsArray);

    return factory.createJsxOpeningElement(
      factory.createIdentifier(this.component.componentType),
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
        factory.createIdentifier('overrides'),
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

  private addFindChildOverrideAttribute(attributes: JsxAttributeLike[], tagName: string) {
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
