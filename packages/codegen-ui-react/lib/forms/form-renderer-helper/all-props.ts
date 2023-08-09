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
import {
  StudioComponent,
  StudioComponentChild,
  FormMetadata,
  isValidVariableName,
  GenericDataSchema,
} from '@aws-amplify/codegen-ui';
import { factory, SyntaxKind, JsxAttribute } from 'typescript';
import { buildComponentSpecificAttributes } from './static-props';
import { renderValueAttribute, renderDefaultValueAttribute, isControlledComponent } from './value-props';
import {
  buildOnChangeStatement,
  buildOnClearStatement,
  buildOnBlurStatement,
  buildOnSelect,
} from './event-handler-props';
import { getArrayChildRefName, resetValuesName, getPropName } from './form-state';
import { shouldWrapInArrayField } from './render-checkers';
import { getAutocompleteOptionsProp } from './model-values';
import { buildCtaLayoutProperties } from '../../react-component-render-helper';
import { getModelNameProp, lowerCaseFirst } from '../../helpers';
import { COMPOSITE_PRIMARY_KEY_PROP_NAME } from '../../utils/constants';
import { DataApiKind } from '../../react-render-config';

export const addFormAttributes = (
  component: StudioComponent | StudioComponentChild,
  formMetadata: FormMetadata,
  dataSchema?: GenericDataSchema,
  dataApi?: DataApiKind,
) => {
  const { name: componentName, componentType } = component;
  const {
    dataType: { dataTypeName },
  } = formMetadata;
  const attributes: JsxAttribute[] = [];
  /*
        boolean => RadioGroupField
        const value = e.target.value.toLowerCase() === 'yes';
        boolean => selectfield
        const value = ....
    
    
        componentType => SelectField && boolean
        const value = Boolean(e.target.checked)
  
      */

  if (componentName in formMetadata.fieldConfigs) {
    const fieldConfig = formMetadata.fieldConfigs[componentName];
    const renderedVariableName = fieldConfig.sanitizedFieldName || componentName;
    /*
      if the componetName is a dotPath we need to change the access expression to the following
       - bio.user.favorites.Quote => errors['bio.user.favorites.Quote']?.errorMessage
      if it's a regular componetName it will use the following expression
       - bio => errors.bio?.errorMessage
      */
    const errorKey =
      componentName.split('.').length > 1 || !isValidVariableName(componentName)
        ? factory.createElementAccessExpression(
            factory.createIdentifier('errors'),
            factory.createStringLiteral(componentName),
          )
        : factory.createPropertyAccessExpression(
            factory.createIdentifier('errors'),
            factory.createIdentifier(componentName),
          );
    attributes.push(
      ...buildComponentSpecificAttributes({
        componentType: fieldConfig.studioFormComponentType ?? fieldConfig.componentType,
      }),
    );

    const valueAttribute = renderValueAttribute({
      componentName: renderedVariableName,
      fieldConfig,
    });

    if (valueAttribute) {
      attributes.push(valueAttribute);
    }

    if (fieldConfig.componentType === 'Autocomplete') {
      attributes.push(getAutocompleteOptionsProp({ fieldName: renderedVariableName, fieldConfig, dataApi }));
      if (fieldConfig.relationship && dataApi === 'GraphQL') {
        attributes.push(
          factory.createJsxAttribute(
            factory.createIdentifier('isLoading'),
            factory.createJsxExpression(undefined, factory.createIdentifier(`${renderedVariableName}Loading`)),
          ),
        );
      }
      attributes.push(
        buildOnSelect({ sanitizedFieldName: renderedVariableName, fieldConfig, fieldName: componentName, dataApi }),
      );
      attributes.push(buildOnClearStatement(componentName, fieldConfig));
    }

    if (formMetadata.formActionType === 'update' && !fieldConfig.isArray && !isControlledComponent(componentType)) {
      attributes.push(renderDefaultValueAttribute(renderedVariableName, fieldConfig, componentType));
    }
    attributes.push(buildOnChangeStatement(component, formMetadata.fieldConfigs, dataApi));
    attributes.push(buildOnBlurStatement(componentName, fieldConfig));
    attributes.push(
      factory.createJsxAttribute(
        factory.createIdentifier('errorMessage'),
        factory.createJsxExpression(
          undefined,
          factory.createPropertyAccessChain(
            errorKey,
            factory.createToken(SyntaxKind.QuestionDotToken),
            factory.createIdentifier('errorMessage'),
          ),
        ),
      ),
      factory.createJsxAttribute(
        factory.createIdentifier('hasError'),
        factory.createJsxExpression(
          undefined,
          factory.createPropertyAccessChain(
            errorKey,
            factory.createToken(SyntaxKind.QuestionDotToken),
            factory.createIdentifier('hasError'),
          ),
        ),
      ),
    );
    if (shouldWrapInArrayField(fieldConfig)) {
      attributes.push(
        factory.createJsxAttribute(
          factory.createIdentifier('ref'),
          factory.createJsxExpression(undefined, factory.createIdentifier(getArrayChildRefName(renderedVariableName))),
        ),
      );

      // labelHidden={true}. Label rendered on ArrayField instead
      attributes.push(
        factory.createJsxAttribute(
          factory.createIdentifier('labelHidden'),
          factory.createJsxExpression(undefined, factory.createTrue()),
        ),
      );
    } else if (fieldConfig.componentType === 'Autocomplete') {
      attributes.push(
        factory.createJsxAttribute(
          factory.createIdentifier('labelHidden'),
          factory.createJsxExpression(undefined, factory.createFalse()),
        ),
      );
    }
  }

  if (componentName === 'RightAlignCTASubFlex') {
    const flexGapAttribute = buildCtaLayoutProperties(formMetadata);
    if (flexGapAttribute) {
      attributes.push(flexGapAttribute);
    }
  }
  /*
    onClick={(event) => {
      event.preventDefault();
      resetStateValues();
    }}
  */
  // multiple primary keys means it is a composite key
  const primaryKeys = dataSchema?.models[dataTypeName]?.primaryKeys?.length
    ? dataSchema.models[dataTypeName].primaryKeys
    : [''];
  const idProp = primaryKeys.length > 1 ? getPropName(COMPOSITE_PRIMARY_KEY_PROP_NAME) : getPropName(primaryKeys[0]);
  if (componentName === 'ClearButton' || componentName === 'ResetButton') {
    attributes.push(
      factory.createJsxAttribute(
        factory.createIdentifier('onClick'),
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
                factory.createExpressionStatement(factory.createCallExpression(resetValuesName, undefined, [])),
              ],
              true,
            ),
          ),
        ),
      ),
    );
    if (formMetadata.formActionType === 'update' && formMetadata.dataType.dataSourceType === 'DataStore') {
      attributes.push(
        factory.createJsxAttribute(
          factory.createIdentifier('isDisabled'),
          factory.createJsxExpression(
            undefined,
            factory.createPrefixUnaryExpression(
              SyntaxKind.ExclamationToken,
              factory.createParenthesizedExpression(
                factory.createBinaryExpression(
                  factory.createIdentifier(idProp),
                  factory.createToken(SyntaxKind.BarBarToken),
                  factory.createIdentifier(getModelNameProp(lowerCaseFirst(dataTypeName))),
                ),
              ),
            ),
          ),
        ),
      );
    }
  }
  if (componentName === 'SubmitButton') {
    if (formMetadata.formActionType === 'update' && formMetadata.dataType.dataSourceType === 'DataStore') {
      attributes.push(
        factory.createJsxAttribute(
          factory.createIdentifier('isDisabled'),
          factory.createJsxExpression(
            undefined,
            factory.createBinaryExpression(
              factory.createPrefixUnaryExpression(
                SyntaxKind.ExclamationToken,
                factory.createParenthesizedExpression(
                  factory.createBinaryExpression(
                    factory.createIdentifier(idProp),
                    factory.createToken(SyntaxKind.BarBarToken),
                    factory.createIdentifier(getModelNameProp(lowerCaseFirst(dataTypeName))),
                  ),
                ),
              ),
              SyntaxKind.BarBarToken,
              factory.createCallExpression(
                factory.createPropertyAccessExpression(
                  factory.createCallExpression(
                    factory.createPropertyAccessExpression(
                      factory.createIdentifier('Object'),
                      factory.createIdentifier('values'),
                    ),
                    undefined,
                    [factory.createIdentifier('errors')],
                  ),
                  factory.createIdentifier('some'),
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
                    factory.createPropertyAccessChain(
                      factory.createIdentifier('e'),
                      factory.createToken(SyntaxKind.QuestionDotToken),
                      factory.createIdentifier('hasError'),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      );
    } else {
      attributes.push(
        factory.createJsxAttribute(
          factory.createIdentifier('isDisabled'),
          factory.createJsxExpression(
            undefined,
            factory.createCallExpression(
              factory.createPropertyAccessExpression(
                factory.createCallExpression(
                  factory.createPropertyAccessExpression(
                    factory.createIdentifier('Object'),
                    factory.createIdentifier('values'),
                  ),
                  undefined,
                  [factory.createIdentifier('errors')],
                ),
                factory.createIdentifier('some'),
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
                  factory.createPropertyAccessChain(
                    factory.createIdentifier('e'),
                    factory.createToken(SyntaxKind.QuestionDotToken),
                    factory.createIdentifier('hasError'),
                  ),
                ),
              ],
            ),
          ),
        ),
      );
    }
  }
  if (componentName === 'CancelButton') {
    attributes.push(
      factory.createJsxAttribute(
        factory.createIdentifier('onClick'),
        factory.createJsxExpression(
          undefined,
          factory.createArrowFunction(
            undefined,
            undefined,
            [],
            undefined,
            factory.createToken(SyntaxKind.EqualsGreaterThanToken),
            factory.createBlock(
              [
                factory.createExpressionStatement(
                  factory.createBinaryExpression(
                    factory.createIdentifier('onCancel'),
                    factory.createToken(SyntaxKind.AmpersandAmpersandToken),
                    factory.createCallExpression(factory.createIdentifier('onCancel'), undefined, []),
                  ),
                ),
              ],
              false,
            ),
          ),
        ),
      ),
    );
  }
  return attributes;
};
