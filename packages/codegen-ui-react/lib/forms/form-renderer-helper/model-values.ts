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
  FieldConfigMetadata,
  StudioFormValueMappings,
  InternalError,
  ConcatenatedStudioComponentProperty,
  HasManyRelationshipType,
} from '@aws-amplify/codegen-ui';
import { StudioFormInputFieldProperty } from '@aws-amplify/codegen-ui/lib/types/form/input-config';
import {
  Expression,
  factory,
  JsxAttribute,
  PropertyAssignment,
  SyntaxKind,
  NodeFlags,
  CallExpression,
  VariableStatement,
  Statement,
  TemplateSpan,
} from 'typescript';

import {
  buildBindingExpression,
  buildConcatExpression,
  getFixedComponentPropValueExpression,
  isBoundProperty,
  isConcatenatedProperty,
  isFixedPropertyWithValue,
} from '../../react-component-render-helper';
import { buildAccessChain, getRecordsName } from './form-state';
import { getElementAccessExpression, getValidProperty } from './invalid-variable-helpers';
import { isEnumDataType, isModelDataType } from './render-checkers';
import { DataApiKind } from '../../react-render-config';
import { capitalizeFirstLetter } from '../../helpers';

export const getDisplayValueObjectName = 'getDisplayValue';

export const getIDValueObjectName = 'getIDValue';

export const getIDValueCallChain = ({ fieldName, recordString }: { fieldName: string; recordString: string }) => {
  return factory.createCallChain(
    getElementAccessExpression(getIDValueObjectName, fieldName),
    factory.createToken(SyntaxKind.QuestionDotToken),
    undefined,
    [factory.createIdentifier(recordString)],
  );
};

const getDisplayValueCallChain = ({ fieldName, recordString }: { fieldName: string; recordString: string }) => {
  return factory.createCallChain(
    getElementAccessExpression(getDisplayValueObjectName, fieldName),
    factory.createToken(SyntaxKind.QuestionDotToken),
    undefined,
    [factory.createIdentifier(recordString)],
  );
};

/**
  getDisplayValue.compositeDogCompositeToysDescription(
    compositeDogRecords.find((r) => r.description === value)
  )
 */
export function getDisplayValueScalar(fieldName: string, model: string, key: string, dataApi?: DataApiKind) {
  const recordString = 'r';

  return factory.createConditionalExpression(
    factory.createIdentifier('value'),
    factory.createToken(SyntaxKind.QuestionToken),
    factory.createCallExpression(
      factory.createPropertyAccessExpression(
        factory.createIdentifier(getDisplayValueObjectName),
        factory.createIdentifier(fieldName),
      ),
      undefined,
      [
        dataApi === 'GraphQL'
          ? factory.createBinaryExpression(
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
                        factory.createIdentifier(recordString),
                        undefined,
                        undefined,
                      ),
                    ],
                    undefined,
                    factory.createToken(SyntaxKind.EqualsGreaterThanToken),
                    factory.createBinaryExpression(
                      factory.createPropertyAccessExpression(
                        factory.createIdentifier(recordString),
                        factory.createIdentifier(key),
                      ),
                      factory.createToken(SyntaxKind.EqualsEqualsEqualsToken),
                      factory.createIdentifier('value'),
                    ),
                  ),
                ],
              ),
              factory.createToken(SyntaxKind.QuestionQuestionToken),
              factory.createCallExpression(
                factory.createPropertyAccessExpression(
                  factory.createIdentifier(`selected${capitalizeFirstLetter(fieldName)}Records`),
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
                        factory.createIdentifier(recordString),
                        undefined,
                        undefined,
                        undefined,
                      ),
                    ],
                    undefined,
                    factory.createToken(SyntaxKind.EqualsGreaterThanToken),
                    factory.createBinaryExpression(
                      factory.createPropertyAccessExpression(
                        factory.createIdentifier(recordString),
                        factory.createIdentifier('id'),
                      ),
                      factory.createToken(SyntaxKind.EqualsEqualsEqualsToken),
                      factory.createIdentifier('value'),
                    ),
                  ),
                ],
              ),
            )
          : factory.createCallExpression(
              factory.createPropertyAccessExpression(
                // DataStore needs a value to the model instead of the field
                // because the value of field may be different where this variable was defined.
                factory.createIdentifier(getRecordsName(model)),
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
                      factory.createIdentifier(recordString),
                      undefined,
                      undefined,
                    ),
                  ],
                  undefined,
                  factory.createToken(SyntaxKind.EqualsGreaterThanToken),
                  factory.createBinaryExpression(
                    factory.createPropertyAccessExpression(
                      factory.createIdentifier(recordString),
                      factory.createIdentifier(key),
                    ),
                    factory.createToken(SyntaxKind.EqualsEqualsEqualsToken),
                    factory.createIdentifier('value'),
                  ),
                ),
              ],
            ),
      ],
    ),
    factory.createToken(SyntaxKind.ColonToken),
    factory.createStringLiteral(''),
  );
}

/**
  examples:
  for model -
  authorRecords
  .filter(
    (r, i, arr) => arr.findIndex(member => member.shape === r.shape) === i
    )
  .map((r) => ({
    id: r?.id,
    label: getDisplayValue['fieldName']?.(r),
  }))
  // For use in AutoComplete options prop only
 */
function getSuggestionsForRelationshipScalar(
  valueRefForBuildingSuggestions: string,
  key: string,
  fieldName: string,
): CallExpression {
  const recordString = 'r';

  const labelExpression = getDisplayValueCallChain({ fieldName, recordString });

  return factory.createCallExpression(
    factory.createPropertyAccessExpression(
      factory.createCallExpression(
        factory.createPropertyAccessExpression(
          factory.createIdentifier(getRecordsName(valueRefForBuildingSuggestions)),
          factory.createIdentifier('filter'),
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
                factory.createIdentifier(recordString),
                undefined,
                undefined,
                undefined,
              ),
              factory.createParameterDeclaration(
                undefined,
                undefined,
                undefined,
                factory.createIdentifier('i'),
                undefined,
                undefined,
                undefined,
              ),
              factory.createParameterDeclaration(
                undefined,
                undefined,
                undefined,
                factory.createIdentifier('arr'),
                undefined,
                undefined,
                undefined,
              ),
            ],
            undefined,
            factory.createToken(SyntaxKind.EqualsGreaterThanToken),
            factory.createBinaryExpression(
              factory.createCallExpression(
                factory.createPropertyAccessExpression(
                  factory.createIdentifier('arr'),
                  factory.createIdentifier('findIndex'),
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
                        factory.createIdentifier('member'),
                        undefined,
                        undefined,
                        undefined,
                      ),
                    ],
                    undefined,
                    factory.createToken(SyntaxKind.EqualsGreaterThanToken),
                    factory.createBinaryExpression(
                      buildAccessChain(['member', key]),
                      factory.createToken(SyntaxKind.EqualsEqualsEqualsToken),
                      buildAccessChain([recordString, key]),
                    ),
                  ),
                ],
              ),
              factory.createToken(SyntaxKind.EqualsEqualsEqualsToken),
              factory.createIdentifier('i'),
            ),
          ),
        ],
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
            factory.createIdentifier(recordString),
            undefined,
            undefined,
            undefined,
          ),
        ],
        undefined,
        factory.createToken(SyntaxKind.EqualsGreaterThanToken),
        factory.createParenthesizedExpression(
          factory.createObjectLiteralExpression(
            [
              factory.createPropertyAssignment(factory.createIdentifier('id'), buildAccessChain([recordString, key])),
              factory.createPropertyAssignment(factory.createIdentifier('label'), labelExpression),
            ],
            true,
          ),
        ),
      ),
    ],
  );
}

/**
  example:
  for model -
  authorRecords
  .filter(r => !primaryAuthorSet.has(getIDValue.primaryAuthor?.(r))
  .map((r) => ({
    id: getIDValue['primaryAuthor]?.(r),
    label: getDisplayValue['primaryAuthor']?.(r),
  }))
  For AutoComplete field only
 */
function getModelTypeSuggestions({
  modelName,
  fieldName,
  fieldConfig,
  dataApi,
}: {
  modelName: string;
  fieldName: string;
  fieldConfig: FieldConfigMetadata;
  dataApi?: DataApiKind;
}): CallExpression {
  const recordString = 'r';
  const labelExpression = getDisplayValueCallChain({ fieldName, recordString });
  // Autocomplete is special and needs a ref to the model for DataStore because the
  // fieldName will not be the same as when the reference was created.
  const optionsRecords = getRecordsName(dataApi === 'GraphQL' ? fieldName : modelName);

  const mappingFunction = factory.createArrowFunction(
    undefined,
    undefined,
    [
      factory.createParameterDeclaration(
        undefined,
        undefined,
        undefined,
        factory.createIdentifier(recordString),
        undefined,
        undefined,
        undefined,
      ),
    ],
    undefined,
    factory.createToken(SyntaxKind.EqualsGreaterThanToken),
    factory.createParenthesizedExpression(
      factory.createObjectLiteralExpression(
        [
          factory.createPropertyAssignment(
            factory.createIdentifier('id'),
            getIDValueCallChain({ fieldName, recordString }),
          ),
          factory.createPropertyAssignment(factory.createIdentifier('label'), labelExpression),
        ],
        true,
      ),
    ),
  );

  if (
    dataApi === 'GraphQL' &&
    fieldConfig.relationship?.type === 'HAS_MANY' &&
    (fieldConfig.relationship as HasManyRelationshipType).belongsToFieldOnRelatedModel
  ) {
    return factory.createCallExpression(
      factory.createPropertyAccessExpression(factory.createIdentifier(optionsRecords), factory.createIdentifier('map')),
      undefined,
      [mappingFunction],
    );
  }

  const filterOptionsExpression = factory.createCallExpression(
    factory.createPropertyAccessExpression(
      factory.createIdentifier(optionsRecords),
      factory.createIdentifier('filter'),
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
            factory.createIdentifier(recordString),
            undefined,
            undefined,
            undefined,
          ),
        ],
        undefined,
        factory.createToken(SyntaxKind.EqualsGreaterThanToken),
        factory.createPrefixUnaryExpression(
          SyntaxKind.ExclamationToken,
          factory.createCallExpression(
            factory.createPropertyAccessExpression(
              factory.createIdentifier(`${fieldName}IdSet`),
              factory.createIdentifier('has'),
            ),
            undefined,
            [getIDValueCallChain({ fieldName, recordString })],
          ),
        ),
      ),
    ],
  );
  return factory.createCallExpression(
    factory.createPropertyAccessExpression(filterOptionsExpression, factory.createIdentifier('map')),
    undefined,
    [mappingFunction],
  );
}

export function extractModelAndKeys(valueMappings?: StudioFormValueMappings): { model?: string; keys?: string[] } {
  let model: undefined | string;
  let keys: undefined | string[];
  const bindingProperty = valueMappings?.bindingProperties && Object.values(valueMappings.bindingProperties)[0];
  if (bindingProperty && bindingProperty.type === 'Data') {
    model = bindingProperty.bindingProperties.model;
    const { values } = valueMappings;
    values.forEach((v) => {
      const { value } = v;
      if (isBoundProperty(value) && value.bindingProperties.field) {
        if (!keys) {
          keys = [];
        }
        keys.push(value.bindingProperties.field);
      }
    });
  }
  return { model, keys };
}
/*
 *  [{ id: 'value', label: 'valuelabel' }, { id: 'value', label: 'label' }]
 */
export function buildFixedAutocompleteOptions(fieldName: string, valueMappings?: StudioFormValueMappings) {
  return factory.createArrayLiteralExpression(
    valueMappings?.values.map(({ displayValue, value }) => {
      let idStringLiteral: Expression | undefined;
      let labelStringLiteral: Expression | undefined;
      if (isFixedPropertyWithValue(value)) {
        idStringLiteral = getFixedComponentPropValueExpression(value);
        labelStringLiteral = getFixedComponentPropValueExpression(value);
      }
      if (displayValue && isFixedPropertyWithValue(displayValue)) {
        labelStringLiteral = getFixedComponentPropValueExpression(displayValue);
      }
      if (!idStringLiteral) {
        throw new InternalError(`Unable to render value for ${fieldName} Autocomplete option`);
      }
      if (!labelStringLiteral) {
        throw new InternalError(`Unable to render display value for ${fieldName} Autocomplete option`);
      }
      return factory.createObjectLiteralExpression(
        [
          factory.createPropertyAssignment(factory.createIdentifier('id'), idStringLiteral),
          factory.createPropertyAssignment(factory.createIdentifier('label'), labelStringLiteral),
        ],
        true,
      );
    }),
    false,
  );
}

/**
    example:
    options={authorRecords.map(r) => ({
        id: getIDValue['primaryAuthor]?.(r),
        label: getDisplayValue['primaryAuthor']?.(r),
    }))}
 */
export function getAutocompleteOptionsProp({
  fieldName,
  fieldConfig,
  dataApi,
}: {
  fieldName: string;
  fieldConfig: FieldConfigMetadata;
  dataApi?: DataApiKind;
}): JsxAttribute {
  let options: Expression | undefined;

  const { valueMappings } = fieldConfig;

  const { model, keys } = extractModelAndKeys(valueMappings);
  if (model) {
    if (isModelDataType(fieldConfig)) {
      options = getModelTypeSuggestions({
        modelName: model,
        fieldName,
        fieldConfig,
        dataApi,
      });
    } else if (keys) {
      options = getSuggestionsForRelationshipScalar(dataApi === 'GraphQL' ? fieldName : model, keys[0], fieldName);
    }
  } else {
    options = buildFixedAutocompleteOptions(fieldName, valueMappings);
  }

  return factory.createJsxAttribute(
    factory.createIdentifier('options'),
    factory.createJsxExpression(undefined, options),
  );
}

// impure helper
/* eslint-disable no-param-reassign */
function replaceProperty(prop: StudioFormInputFieldProperty, toReplace: string, replaceWith: string): void {
  if (isBoundProperty(prop) && prop.bindingProperties.property === toReplace) {
    prop.bindingProperties.property = replaceWith;
  }
  if (isConcatenatedProperty(prop)) {
    prop.concat.forEach((subProp) => replaceProperty(subProp as StudioFormInputFieldProperty, toReplace, replaceWith));
  }
}
/* eslint-enable no-param-reassign */

export function getDisplayValueObject(displayValueFunctions: PropertyAssignment[]) {
  return factory.createVariableStatement(
    undefined,
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          factory.createIdentifier(getDisplayValueObjectName),
          undefined,
          undefined,
          factory.createObjectLiteralExpression(displayValueFunctions, true),
        ),
      ],
      NodeFlags.Const,
    ),
  );
}

export function getIDValueObject(idValueFunctions: PropertyAssignment[]) {
  return factory.createVariableStatement(
    undefined,
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          factory.createIdentifier(getIDValueObjectName),
          undefined,
          undefined,
          factory.createObjectLiteralExpression(idValueFunctions, true),
        ),
      ],
      NodeFlags.Const,
    ),
  );
}
// this is a measure to not show `undefined` the way `bquildConcatExpression` would if the first field is undefined
// `${r?.humanReadable ? r?.humanReadable + ' - ' : ""}${r?.key}-${r?.anotherKey}`
function buildDefaultModelDisplayValue({ displayValue }: { displayValue: ConcatenatedStudioComponentProperty }) {
  const { concat: concatArray } = displayValue;
  const humanReadableFieldExists =
    concatArray[1] && isFixedPropertyWithValue(concatArray[1]) && concatArray[1].value === ' - ';
  if (humanReadableFieldExists) {
    const [humanReadableField, ...primaryKeys] = concatArray;
    if (!isBoundProperty(humanReadableField) || !humanReadableField.bindingProperties.field) {
      throw new InternalError(`Wrong default value mapping shape for human-readable field`);
    }

    const { property: propertyName } = humanReadableField.bindingProperties;

    const templateSpans: TemplateSpan[] = [];

    templateSpans.push(
      factory.createTemplateSpan(
        factory.createConditionalExpression(
          factory.createPropertyAccessChain(
            factory.createIdentifier(propertyName),
            factory.createToken(SyntaxKind.QuestionDotToken),
            factory.createIdentifier(humanReadableField.bindingProperties.field),
          ),
          factory.createToken(SyntaxKind.QuestionToken),
          factory.createBinaryExpression(
            factory.createPropertyAccessChain(
              factory.createIdentifier(propertyName),
              factory.createToken(SyntaxKind.QuestionDotToken),
              factory.createIdentifier(humanReadableField.bindingProperties.field),
            ),
            factory.createToken(SyntaxKind.PlusToken),
            factory.createStringLiteral(' - '),
          ),
          factory.createToken(SyntaxKind.ColonToken),
          factory.createStringLiteral(''),
        ),
        factory.createTemplateMiddle('', ''),
      ),
    );

    const filteredPrimaryKeys = primaryKeys.filter((key) => isBoundProperty(key) && key.bindingProperties.field);

    filteredPrimaryKeys.forEach((key, index) => {
      if (!isBoundProperty(key) || !key.bindingProperties.field) {
        return;
      }
      templateSpans.push(
        factory.createTemplateSpan(
          factory.createPropertyAccessChain(
            factory.createIdentifier(propertyName),
            factory.createToken(SyntaxKind.QuestionDotToken),
            factory.createIdentifier(key.bindingProperties.field),
          ),
          index === filteredPrimaryKeys.length - 1
            ? factory.createTemplateTail('', '')
            : factory.createTemplateMiddle('-', '-'),
        ),
      );
    });
    return factory.createTemplateExpression(factory.createTemplateHead('', ''), templateSpans);
  }

  return buildConcatExpression(displayValue);
}

// CompositeBowl: (r) => JSON.stringify({ shape: r?.shape, size: r?.size })
export function buildIDValueFunction(fieldName: string, fieldConfig: FieldConfigMetadata): PropertyAssignment {
  const recordString = 'r';

  const { keys } = extractModelAndKeys(fieldConfig.valueMappings);
  if (!keys || !keys.length) {
    throw new InternalError(`Unable to render IDValue function for ${fieldName}`);
  }

  const idObjectProperties = keys.map((key) =>
    factory.createPropertyAssignment(getValidProperty(key), buildAccessChain([recordString, key])),
  );

  return factory.createPropertyAssignment(
    getValidProperty(fieldName),
    factory.createArrowFunction(
      undefined,
      undefined,
      [
        factory.createParameterDeclaration(
          undefined,
          undefined,
          undefined,
          factory.createIdentifier(recordString),
          undefined,
          undefined,
          undefined,
        ),
      ],
      undefined,
      factory.createToken(SyntaxKind.EqualsGreaterThanToken),
      factory.createCallExpression(
        factory.createPropertyAccessExpression(factory.createIdentifier('JSON'), factory.createIdentifier('stringify')),
        undefined,
        [factory.createObjectLiteralExpression(idObjectProperties, false)],
      ),
    ),
  );
}

// examples:
// primaryAuthor: (r) => r?.name,
// compositePrimaryAuthor: (r) => r?.name + ' - ' + r?.birthYear
export function buildDisplayValueFunction(fieldName: string, fieldConfig: FieldConfigMetadata): PropertyAssignment {
  const recordString = 'r';

  let additionalStatements: VariableStatement[] = [];

  let renderedDisplayValue: Expression | undefined;

  if (fieldConfig.relationship && fieldConfig.valueMappings) {
    const valueConfig = fieldConfig.valueMappings.values[0];
    if (valueConfig) {
      const { model: modelName } = extractModelAndKeys(fieldConfig.valueMappings);
      if (!modelName) {
        throw new InternalError(`Could not find model name for ${fieldName}`);
      }
      const displayValueIsDefault = valueConfig.displayValue?.isDefault;
      const displayValueProperty = valueConfig.displayValue || valueConfig.value;
      replaceProperty(displayValueProperty, modelName, recordString);
      if (isConcatenatedProperty(displayValueProperty)) {
        if (displayValueIsDefault) {
          renderedDisplayValue = buildDefaultModelDisplayValue({ displayValue: displayValueProperty });
        } else {
          renderedDisplayValue = buildConcatExpression(displayValueProperty);
        }
      } else if (isBoundProperty(displayValueProperty)) {
        renderedDisplayValue = buildBindingExpression(displayValueProperty);
      }
    }
  }

  if (isEnumDataType(fieldConfig) && fieldConfig.valueMappings && fieldConfig.isArray) {
    const displayValueMapName = `enumDisplayValueMap`;
    additionalStatements = [
      factory.createVariableStatement(
        undefined,
        factory.createVariableDeclarationList(
          [
            factory.createVariableDeclaration(
              factory.createIdentifier(displayValueMapName),
              undefined,
              undefined,
              factory.createObjectLiteralExpression(
                fieldConfig.valueMappings.values.map((v) => {
                  let value = '';
                  let displayValue = '';
                  if (isFixedPropertyWithValue(v.value)) {
                    value = v.value.value.toString();
                  }
                  if (v.displayValue && isFixedPropertyWithValue(v.displayValue)) {
                    displayValue = v.displayValue.value.toString();
                  }
                  if (value === '') {
                    throw Error('Enum cannot have an empty value');
                  }
                  return factory.createPropertyAssignment(
                    factory.createStringLiteral(value),
                    factory.createStringLiteral(displayValue ?? value),
                  );
                }),

                true,
              ),
            ),
          ],
          NodeFlags.Const,
        ),
      ),
    ];
    renderedDisplayValue = factory.createElementAccessExpression(
      factory.createIdentifier(displayValueMapName),
      factory.createIdentifier(recordString),
    );
  }

  if (!renderedDisplayValue) {
    throw new InternalError(`Unable to render display value for ${fieldName}`);
  }

  return factory.createPropertyAssignment(
    getValidProperty(fieldName),
    factory.createArrowFunction(
      undefined,
      undefined,
      [
        factory.createParameterDeclaration(
          undefined,
          undefined,
          undefined,
          factory.createIdentifier(recordString),
          undefined,
          undefined,
          undefined,
        ),
      ],
      undefined,
      factory.createToken(SyntaxKind.EqualsGreaterThanToken),
      additionalStatements.length
        ? factory.createBlock([...additionalStatements, factory.createReturnStatement(renderedDisplayValue)], false)
        : renderedDisplayValue,
    ),
  );
}

export function getModelsToImport(fieldConfig: FieldConfigMetadata): string[] {
  const modelDependencies: string[] = [];
  if (fieldConfig.valueMappings && fieldConfig.valueMappings.bindingProperties) {
    Object.values(fieldConfig.valueMappings.bindingProperties).forEach((prop) => {
      if (prop.type === 'Data' && prop.bindingProperties.model) {
        modelDependencies.push(prop.bindingProperties.model);
      }
    });
  }

  // Import join table model
  if (fieldConfig.relationship?.type === 'HAS_MANY' && fieldConfig.relationship.relatedJoinTableName) {
    modelDependencies.push(fieldConfig.relationship.relatedJoinTableName);
  }

  return modelDependencies;
}

/**
  compositeVetRecords.find((r) =>
    Object.entries(JSON.parse(id)).every(([key, value]) => r[key] === value)
  );
 */
export function getMatchEveryModelFieldCallExpression({
  recordsArrayName,
  JSONName,
}: {
  recordsArrayName: string;
  JSONName: string;
}): CallExpression {
  const recordString = 'r';
  const keyString = 'key';
  const valueString = 'value';
  return factory.createCallExpression(
    factory.createPropertyAccessExpression(
      factory.createIdentifier(recordsArrayName),
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
            factory.createIdentifier(recordString),
            undefined,
            undefined,
            undefined,
          ),
        ],
        undefined,
        factory.createToken(SyntaxKind.EqualsGreaterThanToken),
        factory.createCallExpression(
          factory.createPropertyAccessExpression(
            factory.createCallExpression(
              factory.createPropertyAccessExpression(
                factory.createIdentifier('Object'),
                factory.createIdentifier('entries'),
              ),
              undefined,
              [
                factory.createCallExpression(
                  factory.createPropertyAccessExpression(
                    factory.createIdentifier('JSON'),
                    factory.createIdentifier('parse'),
                  ),
                  undefined,
                  [factory.createIdentifier(JSONName)],
                ),
              ],
            ),
            factory.createIdentifier('every'),
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
                  factory.createArrayBindingPattern([
                    factory.createBindingElement(undefined, undefined, factory.createIdentifier('key'), undefined),
                    factory.createBindingElement(undefined, undefined, factory.createIdentifier('value'), undefined),
                  ]),
                  undefined,
                  undefined,
                  undefined,
                ),
              ],
              undefined,
              factory.createToken(SyntaxKind.EqualsGreaterThanToken),
              factory.createBinaryExpression(
                factory.createElementAccessExpression(
                  factory.createIdentifier(recordString),
                  factory.createIdentifier(keyString),
                ),
                factory.createToken(SyntaxKind.EqualsEqualsEqualsToken),
                factory.createIdentifier(valueString),
              ),
            ),
          ],
        ),
      ),
    ],
  );
}

/**
  const CompositeBowlIdSet = new Set(
    Array.isArray(CompositeBowl)
      ? CompositeBowl.map((r) => getIDValue.CompositeBowl?.(r))
      : getIDValue.CompositeBowl?.(CompositeBowl)
  );
 */
export const buildSelectedRecordsIdSet = (fieldConfigs: Record<string, FieldConfigMetadata>): Statement[] => {
  const statements: Statement[] = [];
  Object.entries(fieldConfigs).forEach((fieldConfig) => {
    const [name, fieldConfigMetaData] = fieldConfig;
    const fieldName = fieldConfigMetaData.sanitizedFieldName || name;
    const recordString = 'r';
    if (fieldConfigMetaData.relationship && isModelDataType(fieldConfigMetaData)) {
      statements.push(
        factory.createVariableStatement(
          undefined,
          factory.createVariableDeclarationList(
            [
              factory.createVariableDeclaration(
                factory.createIdentifier(`${fieldName}IdSet`),
                undefined,
                undefined,
                factory.createNewExpression(factory.createIdentifier('Set'), undefined, [
                  factory.createConditionalExpression(
                    factory.createCallExpression(
                      factory.createPropertyAccessExpression(
                        factory.createIdentifier('Array'),
                        factory.createIdentifier('isArray'),
                      ),
                      undefined,
                      [factory.createIdentifier(fieldName)],
                    ),
                    factory.createToken(SyntaxKind.QuestionToken),
                    factory.createCallExpression(
                      factory.createPropertyAccessExpression(
                        factory.createIdentifier(fieldName),
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
                              factory.createIdentifier(recordString),
                              undefined,
                              undefined,
                              undefined,
                            ),
                          ],
                          undefined,
                          factory.createToken(SyntaxKind.EqualsGreaterThanToken),
                          getIDValueCallChain({ fieldName, recordString }),
                        ),
                      ],
                    ),
                    factory.createToken(SyntaxKind.ColonToken),
                    getIDValueCallChain({ fieldName, recordString: fieldName }),
                  ),
                ]),
              ),
            ],
            NodeFlags.Const,
          ),
        ),
      );
    }
  });
  return statements;
};
