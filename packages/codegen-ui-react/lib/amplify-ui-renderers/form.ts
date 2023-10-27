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
  InternalError,
  StudioComponent,
  StudioComponentChild,
  StudioForm,
  StudioNode,
} from '@aws-amplify/codegen-ui';
import {
  factory,
  JsxAttribute,
  JsxChild,
  JsxElement,
  JsxOpeningElement,
  NodeFlags,
  Statement,
  SyntaxKind,
} from 'typescript';
import { ReactComponentRenderer } from '../react-component-renderer';
import { buildFormLayoutProperties, buildOpeningElementProperties } from '../react-component-render-helper';
import { ImportCollection, ImportSource, ImportValue } from '../imports';
import { buildExpression } from '../forms';
import { onSubmitValidationRun, buildModelFieldObject } from '../forms/form-renderer-helper';
import { hasTokenReference } from '../utils/forms/layout-helpers';
import { resetFunctionCheck } from '../forms/form-renderer-helper/value-props';
import { isModelDataType } from '../forms/form-renderer-helper/render-checkers';
import { replaceEmptyStringStatement } from '../forms/form-renderer-helper/cta-props';
import { ReactRenderConfig } from '../react-render-config';
import { defaultRenderConfig } from '../react-studio-template-renderer-helper';
import { getAmplifyJSAPIImport, getAmplifyJSVersionToRender } from '../helpers/amplify-js-versioning';
import { AMPLIFY_JS_V6 } from '../utils/constants';

export default class FormRenderer extends ReactComponentRenderer<BaseComponentProps> {
  constructor(
    component: StudioComponent | StudioComponentChild,
    protected form: StudioForm, // we are passing in form here as it's the top level component
    protected componentMetadata: ComponentMetadata,
    protected importCollection: ImportCollection,
    protected renderConfig: ReactRenderConfig & typeof defaultRenderConfig,
    protected parent?: StudioNode,
  ) {
    super(component, componentMetadata, importCollection, parent);
  }

  protected isRenderingGraphQL = () => {
    return this.renderConfig.apiConfiguration?.dataApi === 'GraphQL';
  };

  renderElement(renderChildren: (children: StudioComponentChild[]) => JsxChild[]): JsxElement {
    const children = this.component.children ?? [];

    const element = factory.createJsxElement(
      this.renderCollectionOpeningElement(),
      renderChildren ? renderChildren(children) : [],
      factory.createJsxClosingElement(factory.createIdentifier(this.component.componentType)),
    );

    this.importCollection.addImport('@aws-amplify/ui-react', this.component.componentType);
    if (this.form.dataType.dataSourceType === 'DataStore' && this.isRenderingGraphQL()) {
      const mappedImport = getAmplifyJSAPIImport();
      this.importCollection.addMappedImport(mappedImport);
    } else if (this.form.dataType.dataSourceType === 'DataStore') {
      if (getAmplifyJSVersionToRender(this.renderConfig.dependencies) === AMPLIFY_JS_V6) {
        this.importCollection.addImport(ImportSource.AMPLIFY_DATASTORE_V6, ImportValue.DATASTORE);
      } else {
        this.importCollection.addImport(ImportSource.AMPLIFY, ImportValue.DATASTORE);
      }
    }

    if (hasTokenReference(this.componentMetadata)) {
      this.importCollection.addImport(ImportSource.UI_REACT, 'useTheme');
    }

    return element;
  }

  private renderCollectionOpeningElement(): JsxOpeningElement {
    const propsArray = Object.entries(this.component.properties).map(([key, value]) =>
      buildOpeningElementProperties(this.componentMetadata, value, key),
    );

    propsArray.push(...buildFormLayoutProperties(this.componentMetadata.formMetadata));

    const submitAttribute = this.getFormOnSubmitAttribute();
    propsArray.push(submitAttribute);

    this.addPropsSpreadAttributes(propsArray);

    return factory.createJsxOpeningElement(
      factory.createIdentifier(this.component.componentType),
      undefined,
      factory.createJsxAttributes(propsArray),
    );
  }

  /**
   * generates the necessary function call if using
   * - datastore
   * - custom
   */
  private getOnSubmitDSCall(): Statement[] {
    const {
      dataType: { dataSourceType, dataTypeName },
      formActionType,
    } = this.form;
    const importedModelName = this.importCollection.getMappedModelAlias(dataTypeName);

    const { formMetadata } = this.componentMetadata;
    if (!formMetadata) {
      throw new Error(`Form Metadata is missing from form: ${this.component.name}`);
    }

    const onSubmitIdentifier = factory.createIdentifier('onSubmit');

    if (dataSourceType === 'Custom') {
      return [
        factory.createExpressionStatement(
          factory.createAwaitExpression(
            factory.createCallExpression(onSubmitIdentifier, undefined, [factory.createIdentifier('modelFields')]),
          ),
        ),
      ];
    }
    if (dataSourceType === 'DataStore') {
      const { dataSchemaMetadata } = this.componentMetadata;
      if (!dataSchemaMetadata) {
        throw new InternalError(`Could not find data schema for data-backed form`);
      }
      return [
        factory.createIfStatement(
          onSubmitIdentifier,
          factory.createBlock(
            [
              factory.createExpressionStatement(
                factory.createBinaryExpression(
                  factory.createIdentifier('modelFields'),
                  factory.createToken(SyntaxKind.EqualsToken),
                  factory.createCallExpression(onSubmitIdentifier, undefined, [
                    factory.createIdentifier('modelFields'),
                  ]),
                ),
              ),
            ],
            true,
          ),
          undefined,
        ),
        factory.createTryStatement(
          factory.createBlock(
            [
              replaceEmptyStringStatement,
              ...buildExpression(
                formActionType,
                dataTypeName,
                importedModelName,
                formMetadata.fieldConfigs,
                dataSchemaMetadata,
                this.importCollection,
                'apiConfiguration' in this.renderConfig ? this.renderConfig.apiConfiguration?.dataApi : undefined,
                this.renderConfig.dependencies,
              ),
              // call onSuccess hook if it exists
              factory.createIfStatement(
                factory.createIdentifier('onSuccess'),
                factory.createBlock(
                  [
                    factory.createExpressionStatement(
                      factory.createCallExpression(factory.createIdentifier('onSuccess'), undefined, [
                        factory.createIdentifier('modelFields'),
                      ]),
                    ),
                  ],
                  true,
                ),
                undefined,
              ),
              // call the reset function if clearOnSuccess is true
              ...resetFunctionCheck({ formActionType, dataSourceType }),
            ],
            true,
          ),
          factory.createCatchClause(
            factory.createVariableDeclaration(factory.createIdentifier('err'), undefined, undefined, undefined),
            factory.createBlock(
              [
                factory.createIfStatement(
                  factory.createIdentifier('onError'),
                  factory.createBlock(
                    this.isRenderingGraphQL()
                      ? [
                          factory.createVariableStatement(
                            undefined,
                            factory.createVariableDeclarationList(
                              [
                                factory.createVariableDeclaration(
                                  factory.createIdentifier('messages'),
                                  undefined,
                                  undefined,
                                  factory.createCallExpression(
                                    factory.createPropertyAccessExpression(
                                      factory.createCallExpression(
                                        factory.createPropertyAccessExpression(
                                          factory.createPropertyAccessExpression(
                                            factory.createIdentifier('err'),
                                            factory.createIdentifier('errors'),
                                          ),
                                          factory.createIdentifier('map'),
                                        ),
                                        undefined,
                                        [
                                          factory.createArrowFunction(
                                            undefined,
                                            undefined,
                                            [
                                              factory.createParameterDeclaration(
                                                undefined,
                                                undefined,
                                                undefined,
                                                factory.createIdentifier('e'),
                                                undefined,
                                                undefined,
                                                undefined,
                                              ),
                                            ],
                                            undefined,
                                            factory.createToken(SyntaxKind.EqualsGreaterThanToken),
                                            factory.createPropertyAccessExpression(
                                              factory.createIdentifier('e'),
                                              factory.createIdentifier('message'),
                                            ),
                                          ),
                                        ],
                                      ),
                                      factory.createIdentifier('join'),
                                    ),
                                    undefined,
                                    [factory.createStringLiteral('\n')],
                                  ),
                                ),
                              ],
                              NodeFlags.Const,
                            ),
                          ),
                          factory.createExpressionStatement(
                            factory.createCallExpression(factory.createIdentifier('onError'), undefined, [
                              factory.createIdentifier('modelFields'),
                              factory.createIdentifier('messages'),
                            ]),
                          ),
                        ]
                      : [
                          factory.createExpressionStatement(
                            factory.createCallExpression(factory.createIdentifier('onError'), undefined, [
                              factory.createIdentifier('modelFields'),
                              factory.createPropertyAccessExpression(
                                factory.createIdentifier('err'),
                                factory.createIdentifier('message'),
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
      ];
    }
    throw new Error(`${dataSourceType} is not supported in form:onSubmit`);
  }

  private getFormOnSubmitAttribute(): JsxAttribute {
    const {
      dataType: { dataSourceType },
    } = this.form;
    const { formMetadata } = this.componentMetadata;

    const hasModelField =
      formMetadata?.fieldConfigs && Object.values(formMetadata.fieldConfigs).some((config) => isModelDataType(config));

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
              buildModelFieldObject(
                dataSourceType !== 'DataStore',
                formMetadata?.fieldConfigs,
                undefined,
                this.renderConfig.apiConfiguration?.dataApi,
                formMetadata?.formActionType,
              ),
              ...onSubmitValidationRun(hasModelField),
              ...this.getOnSubmitDSCall(),
            ],
            false,
          ),
        ),
      ),
    );
  }
}
