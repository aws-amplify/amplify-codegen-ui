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
  getFormFieldStateName,
  StudioComponent,
  StudioComponentChild,
  StudioForm,
  StudioNode,
} from '@aws-amplify/codegen-ui';
import { factory, JsxAttribute, JsxChild, JsxElement, JsxOpeningElement, SyntaxKind } from 'typescript';
import { ReactComponentRenderer } from '../react-component-renderer';
import { buildOpeningElementProperties, getStateName } from '../react-component-render-helper';
import { ImportCollection } from '../imports';
import { getActionIdentifier } from '../workflow';
import { FieldStateVariable } from '../forms/form-renderer-helper';

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
    const {
      name,
      dataType: { dataSourceType },
    } = this.form;
    return factory.createJsxAttribute(
      factory.createIdentifier('onSubmit'),
      factory.createJsxExpression(
        undefined,
        factory.createArrowFunction(
          [factory.createModifier(SyntaxKind.AsyncKeyword)],
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
              factory.createIfStatement(
                factory.createIdentifier('onSubmitBefore'),
                factory.createBlock(
                  [
                    factory.createExpressionStatement(
                      factory.createCallExpression(factory.createIdentifier('onSubmitBefore'), undefined, [
                        factory.createObjectLiteralExpression(
                          [
                            factory.createPropertyAssignment(
                              factory.createIdentifier('fields'),
                              factory.createIdentifier(getStateName(FieldStateVariable(name))),
                            ),
                          ],
                          false,
                        ),
                      ]),
                    ),
                  ],
                  true,
                ),
                undefined,
              ),
              factory.createTryStatement(
                factory.createBlock(
                  [
                    factory.createExpressionStatement(
                      factory.createAwaitExpression(
                        factory.createCallExpression(
                          factory.createIdentifier(getActionIdentifier(name, 'onSubmit')),
                          undefined,
                          dataSourceType === 'DataStore' ? [] : [factory.createIdentifier(getFormFieldStateName(name))],
                        ),
                      ),
                    ),
                    factory.createIfStatement(
                      factory.createIdentifier('onSubmitComplete'),
                      factory.createBlock(
                        [
                          factory.createExpressionStatement(
                            factory.createCallExpression(factory.createIdentifier('onSubmitComplete'), undefined, [
                              factory.createObjectLiteralExpression(
                                [
                                  factory.createPropertyAssignment(
                                    factory.createIdentifier('saveSuccessful'),
                                    factory.createTrue(),
                                  ),
                                ],
                                false,
                              ),
                            ]),
                          ),
                        ],
                        true,
                      ),
                      undefined,
                    ),
                  ],
                  true,
                ),
                factory.createCatchClause(
                  factory.createVariableDeclaration(factory.createIdentifier('err'), undefined, undefined, undefined),
                  factory.createBlock(
                    [
                      factory.createIfStatement(
                        factory.createIdentifier('onSubmitComplete'),
                        factory.createBlock(
                          [
                            factory.createExpressionStatement(
                              factory.createCallExpression(factory.createIdentifier('onSubmitComplete'), undefined, [
                                factory.createObjectLiteralExpression(
                                  [
                                    factory.createPropertyAssignment(
                                      factory.createIdentifier('saveSuccessful'),
                                      factory.createFalse(),
                                    ),
                                    factory.createPropertyAssignment(
                                      factory.createIdentifier('errorMessage'),
                                      factory.createPropertyAccessExpression(
                                        factory.createIdentifier('err'),
                                        factory.createIdentifier('message'),
                                      ),
                                    ),
                                  ],
                                  false,
                                ),
                              ]),
                            ),
                          ],
                          true,
                        ),
                        undefined,
                      ),
                    ],
                    true,
                  ),
                ),
                undefined,
              ),
            ],
            false,
          ),
        ),
      ),
    );
  }
}
