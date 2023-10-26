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
import { FieldConfigMetadata, LabelDecorator } from '@aws-amplify/codegen-ui';
import { Expression, factory, Identifier, JsxAttribute, JsxChild, NodeFlags, Statement, SyntaxKind } from 'typescript';
import {
  buildAccessChain,
  getArrayChildRefName,
  getCurrentDisplayValueName,
  getCurrentValueIdentifier,
  getCurrentValueName,
  getDefaultValueExpression,
  getRecordsName,
  setFieldState,
} from './form-state';
import { buildOverrideOnChangeStatement } from './event-handler-props';
import { isModelDataType, shouldImplementDisplayValueFunction } from './render-checkers';
import { extractModelAndKeys, getDisplayValueObjectName, getDisplayValueScalar } from './model-values';
import { getElementAccessExpression } from './invalid-variable-helpers';
import { getSetNameIdentifier, capitalizeFirstLetter } from '../../helpers';
import { getDecoratedLabel } from './label-decorator';
import { DataApiKind } from '../../react-render-config';

function getOnChangeAttribute({
  setStateName,
  fieldName,
  renderedFieldName,
  fieldConfigs,
  isLimitedToOneValue,
}: {
  setStateName: Identifier;
  fieldName: string;
  renderedFieldName: string;
  fieldConfigs: Record<string, FieldConfigMetadata>;
  isLimitedToOneValue?: boolean;
}): JsxAttribute {
  const fieldConfig = fieldConfigs[fieldName];
  const { dataType, componentType } = fieldConfig;

  let valueName = factory.createIdentifier('values');
  const onChangeArgName = factory.createIdentifier('items');
  let argToValue: Expression = onChangeArgName;

  if (isLimitedToOneValue) {
    argToValue = factory.createElementAccessExpression(onChangeArgName, factory.createNumericLiteral('0'));
    valueName = factory.createIdentifier('value');
  }

  const setStateStatements = [
    factory.createExpressionStatement(setFieldState(renderedFieldName, valueName)),
    factory.createExpressionStatement(
      factory.createCallExpression(setStateName, undefined, [
        getDefaultValueExpression(fieldName, componentType, dataType),
      ]),
    ),
  ];

  if (isModelDataType(fieldConfig)) {
    setStateStatements.push(
      factory.createExpressionStatement(
        factory.createCallExpression(
          factory.createIdentifier(`set${capitalizeFirstLetter(getCurrentDisplayValueName(renderedFieldName))}`),
          undefined,
          [getDefaultValueExpression(fieldName, componentType, dataType, false, true)],
        ),
      ),
    );
  }

  return factory.createJsxAttribute(
    factory.createIdentifier('onChange'),
    factory.createJsxExpression(
      undefined,
      factory.createArrowFunction(
        [factory.createModifier(SyntaxKind.AsyncKeyword)],
        undefined,
        [factory.createParameterDeclaration(undefined, undefined, undefined, onChangeArgName, undefined, undefined)],
        undefined,
        factory.createToken(SyntaxKind.EqualsGreaterThanToken),
        factory.createBlock(
          [
            factory.createVariableStatement(
              undefined,
              factory.createVariableDeclarationList(
                [factory.createVariableDeclaration(valueName, undefined, undefined, argToValue)],
                NodeFlags.Let,
              ),
            ),
            buildOverrideOnChangeStatement(fieldName, fieldConfigs, valueName),
            ...setStateStatements,
          ],
          true,
        ),
      ),
    ),
  );
}

/*
  <ArrayField
    onChange = { async(items) => {
      setBreeds(items);
      setCurrentBreedsValue('');
    }}
    currentBreedsValue = { currentBreedsValue }
    hasError = { errors.breeds?.hasError }
    setFieldValue = { setCurrentBreedsValue }
    inputFieldRef={ breedsRef }
    >
    <ExampleInputField />
  </ArrayField>

  wraps input field component with array field component
 */

export const renderArrayFieldComponent = (
  fieldName: string,
  fieldLabel: string,
  fieldConfigs: Record<string, FieldConfigMetadata>,
  inputField: JsxChild,
  labelDecorator?: LabelDecorator,
  isRequired?: boolean,
  dataApi: DataApiKind = 'DataStore',
) => {
  const fieldConfig = fieldConfigs[fieldName];
  const { sanitizedFieldName, dataType, componentType } = fieldConfig;

  const isLimitedToOneValue =
    fieldConfig.relationship &&
    (fieldConfig.relationship.type === 'HAS_ONE' || fieldConfig.relationship.type === 'BELONGS_TO');
  const renderedFieldName = sanitizedFieldName || fieldName;
  const stateName = getCurrentValueIdentifier(renderedFieldName);
  const setStateName = getSetNameIdentifier(getCurrentValueName(renderedFieldName));

  const props: JsxAttribute[] = [];

  // render `?? []` if nested.
  let itemsExpression: Expression = renderedFieldName.includes('.')
    ? factory.createBinaryExpression(
        factory.createIdentifier(renderedFieldName),
        factory.createToken(SyntaxKind.QuestionQuestionToken),
        factory.createArrayLiteralExpression([], false),
      )
    : factory.createIdentifier(renderedFieldName);

  if (isLimitedToOneValue) {
    // "book ? [book] : []"
    itemsExpression = factory.createConditionalExpression(
      factory.createIdentifier(renderedFieldName),
      factory.createToken(SyntaxKind.QuestionToken),
      factory.createArrayLiteralExpression([factory.createIdentifier(renderedFieldName)], false),
      factory.createToken(SyntaxKind.ColonToken),
      factory.createArrayLiteralExpression([], false),
    );

    props.push(
      factory.createJsxAttribute(
        factory.createIdentifier('lengthLimit'),
        factory.createJsxExpression(undefined, factory.createNumericLiteral('1')),
      ),
    );
  }

  props.push(getOnChangeAttribute({ fieldName, isLimitedToOneValue, fieldConfigs, renderedFieldName, setStateName }));
  let labelAttribute = factory.createJsxAttribute(
    factory.createIdentifier('label'),
    factory.createJsxExpression(undefined, factory.createStringLiteral(fieldLabel)),
  );

  if ((labelDecorator === 'required' && isRequired) || (labelDecorator === 'optional' && !isRequired)) {
    labelAttribute = getDecoratedLabel('label', fieldLabel, labelDecorator);
  }
  props.push(
    factory.createJsxAttribute(
      factory.createIdentifier('currentFieldValue'),
      factory.createJsxExpression(undefined, stateName),
    ),
    labelAttribute,
  );

  props.push(
    factory.createJsxAttribute(
      factory.createIdentifier('items'),
      factory.createJsxExpression(undefined, itemsExpression),
    ),
  );

  props.push(
    factory.createJsxAttribute(
      factory.createIdentifier('hasError'),
      factory.createJsxExpression(undefined, buildAccessChain(['errors', fieldName, 'hasError'])),
    ),
  );

  props.push(
    factory.createJsxAttribute(
      factory.createIdentifier('runValidationTasks'),
      factory.createJsxExpression(
        undefined,
        factory.createArrowFunction(
          [factory.createToken(SyntaxKind.AsyncKeyword)],
          undefined,
          [],
          undefined,
          factory.createToken(SyntaxKind.EqualsGreaterThanToken),
          factory.createAwaitExpression(
            factory.createCallExpression(factory.createIdentifier('runValidationTasks'), undefined, [
              factory.createStringLiteral(fieldName),
              stateName,
            ]),
          ),
        ),
      ),
    ),
  );

  props.push(
    factory.createJsxAttribute(
      factory.createIdentifier('errorMessage'),
      factory.createJsxExpression(undefined, buildAccessChain(['errors', fieldName, 'errorMessage'])),
    ),
  );

  let setFieldValueIdentifier = setStateName;

  let scalarModel: string | undefined;
  let scalarKey: string | undefined;

  if (fieldConfig.relationship && !isModelDataType(fieldConfig)) {
    const { valueMappings } = fieldConfig;
    const { model, keys } = extractModelAndKeys(valueMappings);
    if (model && keys) {
      [scalarModel, scalarKey] = [model, keys[0]];
    }
  }

  let getBadgeTextFunction: Expression = getElementAccessExpression(getDisplayValueObjectName, fieldName);

  if (scalarModel && scalarKey) {
    getBadgeTextFunction = factory.createArrowFunction(
      undefined,
      undefined,
      [
        factory.createParameterDeclaration(
          undefined,
          undefined,
          undefined,
          factory.createIdentifier('value'),
          undefined,
          undefined,
        ),
      ],
      undefined,
      factory.createToken(SyntaxKind.EqualsGreaterThanToken),
      getDisplayValueScalar(fieldName, scalarModel, scalarKey, dataApi),
    );
  }

  if (shouldImplementDisplayValueFunction(fieldConfig)) {
    setFieldValueIdentifier = getSetNameIdentifier(getCurrentDisplayValueName(renderedFieldName));
    props.push(
      factory.createJsxAttribute(
        factory.createIdentifier('getBadgeText'),
        factory.createJsxExpression(undefined, getBadgeTextFunction),
      ),
    );
  }

  /**
  // model
  setFieldValue={(model) => {
    setCurrentHasOneUserDisplayValue(getDisplayValue.HasOneUser(model))
    setCurrentHasOneUserValue(model)
  }

  // scalar
  setFieldValue={(value) => {
    setCurrentCompositeDogCompositeToysNameDisplayValue(
      getDisplayValue.compositeDogCompositeToysName(
        compositeDogRecords.find((r) => r.name === value)
      )
    );
    setCurrentCompositeDogCompositeToysNameValue(value);
  }}
  */
  if (fieldConfig.relationship) {
    if (isModelDataType(fieldConfig)) {
      const valueArgument = 'model';
      props.push(
        factory.createJsxAttribute(
          factory.createIdentifier('setFieldValue'),
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
                  factory.createIdentifier(valueArgument),
                  undefined,
                  undefined,
                  undefined,
                ),
              ],
              undefined,
              factory.createToken(SyntaxKind.EqualsGreaterThanToken),
              factory.createBlock(
                [
                  factory.createExpressionStatement(
                    factory.createCallExpression(setFieldValueIdentifier, undefined, [
                      factory.createConditionalExpression(
                        factory.createIdentifier(valueArgument),
                        factory.createToken(SyntaxKind.QuestionToken),
                        factory.createCallExpression(
                          getElementAccessExpression(getDisplayValueObjectName, fieldName),
                          undefined,
                          [factory.createIdentifier(valueArgument)],
                        ),
                        factory.createToken(SyntaxKind.ColonToken),
                        factory.createStringLiteral(''),
                      ),
                    ]),
                  ),
                  factory.createExpressionStatement(
                    factory.createCallExpression(setStateName, undefined, [factory.createIdentifier(valueArgument)]),
                  ),
                ],
                true,
              ),
            ),
          ),
        ),
      );
    } else if (scalarModel && scalarKey) {
      const setStateStatements: Statement[] = [];
      const valueArgument = 'value';

      setStateStatements.push(
        factory.createExpressionStatement(
          factory.createCallExpression(setStateName, undefined, [factory.createIdentifier(valueArgument)]),
        ),
      );

      if (dataApi === 'GraphQL') {
        const selectedRecordName = 'selectedRecord';

        setStateStatements.push(
          factory.createVariableStatement(
            undefined,
            factory.createVariableDeclarationList(
              [
                factory.createVariableDeclaration(
                  factory.createIdentifier(selectedRecordName),
                  undefined,
                  undefined,
                  factory.createCallExpression(
                    factory.createPropertyAccessExpression(
                      factory.createIdentifier(getRecordsName(fieldName)),
                      factory.createIdentifier('find'),
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
                            factory.createIdentifier('r'),
                            undefined,
                            undefined,
                            undefined,
                          ),
                        ],
                        undefined,
                        factory.createToken(SyntaxKind.EqualsGreaterThanToken),
                        factory.createBinaryExpression(
                          factory.createPropertyAccessExpression(
                            factory.createIdentifier('r'),
                            factory.createIdentifier(scalarKey),
                          ),
                          factory.createToken(SyntaxKind.EqualsEqualsEqualsToken),
                          factory.createIdentifier('value'),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
              NodeFlags.Const,
            ),
          ),
        );
        setStateStatements.push(
          factory.createIfStatement(
            factory.createIdentifier(selectedRecordName),
            factory.createBlock([
              factory.createExpressionStatement(
                factory.createCallExpression(
                  getSetNameIdentifier(`selected${capitalizeFirstLetter(fieldName)}Records`),
                  undefined,
                  [factory.createArrayLiteralExpression([factory.createIdentifier(selectedRecordName)])],
                ),
              ),
            ]),
          ),
        );
      }

      props.push(
        factory.createJsxAttribute(
          factory.createIdentifier('setFieldValue'),
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
                  factory.createIdentifier(valueArgument),
                  undefined,
                  undefined,
                  undefined,
                ),
              ],
              undefined,
              factory.createToken(SyntaxKind.EqualsGreaterThanToken),
              factory.createBlock(
                [
                  factory.createExpressionStatement(
                    factory.createCallExpression(setFieldValueIdentifier, undefined, [
                      getDisplayValueScalar(fieldName, scalarModel, scalarKey, dataApi),
                    ]),
                  ),
                  ...setStateStatements,
                ],
                true,
              ),
            ),
          ),
        ),
      );
    }
  } else {
    props.push(
      factory.createJsxAttribute(
        factory.createIdentifier('setFieldValue'),
        factory.createJsxExpression(undefined, setStateName),
      ),
    );
  }

  props.push(
    factory.createJsxAttribute(
      factory.createIdentifier('inputFieldRef'),
      factory.createJsxExpression(undefined, factory.createIdentifier(getArrayChildRefName(renderedFieldName))),
    ),
    factory.createJsxAttribute(
      factory.createIdentifier('defaultFieldValue'),
      factory.createJsxExpression(
        undefined,
        getDefaultValueExpression(fieldName, componentType, dataType, false, true),
      ),
    ),
  );

  return factory.createJsxElement(
    factory.createJsxOpeningElement(
      factory.createIdentifier('ArrayField'),
      undefined,
      factory.createJsxAttributes(props),
    ),
    [inputField],
    factory.createJsxClosingElement(factory.createIdentifier('ArrayField')),
  );
};
