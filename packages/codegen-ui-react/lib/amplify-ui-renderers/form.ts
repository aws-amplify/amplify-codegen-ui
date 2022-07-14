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
  ComponentMetadata,
  StudioComponent,
  StudioComponentChild,
  StudioForm,
  StudioNode,
} from '@aws-amplify/codegen-ui';
import { factory, JsxAttribute, JsxChild, JsxElement, JsxOpeningElement, SyntaxKind } from 'typescript';
import { ReactComponentRenderer } from '../react-component-renderer';
import { buildOpeningElementProperties } from '../react-component-render-helper';
import { ImportCollection } from '../imports';
import { getActionIdentifier } from '../workflow';

export default class FormRenderer extends ReactComponentRenderer<BaseComponentProps> {
  constructor(
    component: StudioComponent | StudioComponentChild,
    protected form: StudioForm, // we are passing in form here as it's the top level component
    protected componentMetadata: ComponentMetadata,
    protected importCollection: ImportCollection,
    protected parent?: StudioNode,
  ) {
    super(component, componentMetadata, importCollection, parent);
  }

  renderElement(renderChildren: (children: StudioComponentChild[]) => JsxChild[]): JsxElement {
    const children = this.component.children ?? [];

    const element = factory.createJsxElement(
      this.renderCollectionOpeningElement(),
      renderChildren ? renderChildren(children) : [],
      factory.createJsxClosingElement(factory.createIdentifier(this.component.componentType)),
    );

    this.importCollection.addImport('@aws-amplify/ui-react', this.component.componentType);

    return element;
  }

  private renderCollectionOpeningElement(): JsxOpeningElement {
    const propsArray = Object.entries(this.component.properties).map(([key, value]) =>
      buildOpeningElementProperties(this.componentMetadata, value, key),
    );

    const submitAttribute = this.getFormOnSubmitAttribute();
    propsArray.push(submitAttribute);

    this.addPropsSpreadAttributes(propsArray);

    return factory.createJsxOpeningElement(
      factory.createIdentifier(this.component.componentType),
      undefined,
      factory.createJsxAttributes(propsArray),
    );
  }

  private getFormOnSubmitAttribute(): JsxAttribute {
    return factory.createJsxAttribute(
      factory.createIdentifier('onSubmit'),
      factory.createJsxExpression(
        undefined,
        factory.createArrowFunction(
          undefined,
          undefined,
          [
            factory.createParameterDeclaration(
              undefined,
              undefined,
              undefined,
              factory.createIdentifier('event'),
              undefined,
              factory.createTypeReferenceNode(factory.createIdentifier('SyntheticEvent'), undefined),
              undefined,
            ),
          ],
          undefined,
          factory.createToken(SyntaxKind.EqualsGreaterThanToken),
          factory.createBlock(
            [
              factory.createExpressionStatement(
                factory.createCallExpression(
                  factory.createPropertyAccessExpression(
                    factory.createIdentifier('event'),
                    factory.createIdentifier('preventDefault'),
                  ),
                  undefined,
                  [],
                ),
              ),
              factory.createExpressionStatement(
                /**
                 * TODO: pass in props from functional argument
                 * for datastore it will be onSubmitBefore & onSubmitComplete
                 * for byod it will only be onSubmit override function
                 */
                factory.createCallExpression(
                  factory.createIdentifier(getActionIdentifier(this.form.name, 'onSubmit')),
                  undefined,
                  [],
                ),
              ),
            ],
            false,
          ),
        ),
      ),
    );
  }
}
