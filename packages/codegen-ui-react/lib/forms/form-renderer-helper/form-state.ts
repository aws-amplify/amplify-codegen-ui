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
  DataFieldDataType,
  isValidVariableName,
  isNonModelDataType,
  StudioForm,
  StudioFormActionType,
} from '@aws-amplify/codegen-ui';
import {
  factory,
  Statement,
  Expression,
  NodeFlags,
  Identifier,
  ExpressionStatement,
  SyntaxKind,
  ObjectLiteralExpression,
  CallExpression,
  ElementAccessChain,
  PropertyAccessChain,
  PropertyAssignment,
  PropertyName,
  PropertyAccessExpression,
  ElementAccessExpression,
  ConditionalExpression,
  CallChain,
} from 'typescript';
import {
  capitalizeFirstLetter,
  lowerCaseFirst,
  getSetNameIdentifier,
  buildUseStateExpression,
  getControlledComponentDefaultValue,
  buildInitConstVariableExpression,
} from '../../helpers';
import { getElementAccessExpression } from './invalid-variable-helpers';
import { isModelDataType, shouldWrapInArrayField } from './render-checkers';
import { DataApiKind } from '../../react-render-config';

// used just to sanitize nested array field names
// when rendering currentValue state and ref
const getVariableName = (input: string[]) =>
  input.length > 1 ? input.join('').replace(/[^a-zA-Z0-9_$]/g, '') : input.join('');

export const getArrayChildRefName = (fieldName: string) => {
  const paths = fieldName.split('.').map((path, i) => (i === 0 ? path : capitalizeFirstLetter(path)));
  return `${getVariableName(paths)}Ref`;
};

// value of the child of an ArrayField
export const getCurrentValueName = (fieldName: string) => {
  const paths = fieldName.split('.').map((path) => capitalizeFirstLetter(path));
  return `current${getVariableName(paths)}Value`;
};

export const getCurrentDisplayValueName = (fieldName: string) =>
  `current${capitalizeFirstLetter(fieldName)}DisplayValue`;

export const getRecordsName = (name: string, capitalized = false) =>
  `${(capitalized ? capitalizeFirstLetter : lowerCaseFirst)(name)}Records`;

export const getRecordName = (modelName: string, capitalized = false) =>
  `${(capitalized ? capitalizeFirstLetter : lowerCaseFirst)(modelName)}Record`;

export const getLinkedDataName = (modelName: string) => `linked${capitalizeFirstLetter(modelName)}`;

export const getCanUnlinkModelName = (modelName: string) => `canUnlink${capitalizeFirstLetter(modelName)}`;

export const getCurrentValueIdentifier = (fieldName: string) =>
  factory.createIdentifier(getCurrentValueName(fieldName));

// in update form, there will be conflict if field `id` is editable.
// so the prop `id` should be destructured as `idProp`
export const getPropName = (propName: string) => `${propName}Prop`;

export const resetValuesName = factory.createIdentifier('resetStateValues');

export const setStateExpression = (fieldName: string, value: Expression) => {
  return factory.createExpressionStatement(
    factory.createCallExpression(getSetNameIdentifier(fieldName), undefined, [value]),
  );
};

/**
 * setErrors((errors) => ({ ...errors, [key]: value }));
 *
 * shorthand function to set error key/value
 * @param key ts expression to use as key ex. string literal or ts identifier
 * @param value ts expression to resolve to the value could be a prop access chain or identifier
 * @returns expression statement
 */
export const setErrorState = (key: string | PropertyName, value: Expression) => {
  return factory.createExpressionStatement(
    factory.createCallExpression(factory.createIdentifier('setErrors'), undefined, [
      factory.createArrowFunction(
        undefined,
        undefined,
        [
          factory.createParameterDeclaration(
            undefined,
            undefined,
            undefined,
            factory.createIdentifier('errors'),
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
              factory.createSpreadAssignment(factory.createIdentifier('errors')),
              factory.createPropertyAssignment(key, value),
            ],
            false,
          ),
        ),
      ),
    ]),
  );
};

/**
 * Note this is not for handling arrays.
 * If you need a default array value (e.g. []). Pass in an empty array at a higher level.
 */
export const getDefaultValueExpression = (
  name: string,
  componentType: string,
  dataType?: DataFieldDataType,
  isArray?: boolean,
  isDisplayValue?: boolean,
  defaultValue?: string | null,
): Expression => {
  const componentTypeToDefaultValueMap: { [key: string]: Expression } = {
    Autocomplete: isDisplayValue ? factory.createStringLiteral('') : factory.createIdentifier('undefined'),
    ToggleButton: factory.createFalse(),
    SwitchField: factory.createFalse(),
    StepperField: factory.createNumericLiteral(0),
    SliderField: factory.createNumericLiteral(0),
    CheckboxField: factory.createFalse(),
    TextField: factory.createStringLiteral(''),
    TextAreaField: factory.createStringLiteral(''),
    SelectField: factory.createStringLiteral(''),
  };

  if (defaultValue) {
    return isArray
      ? factory.createArrayLiteralExpression([factory.createStringLiteral(defaultValue)], false)
      : factory.createStringLiteral(defaultValue);
  }

  if (isArray) {
    return factory.createArrayLiteralExpression([], false);
  }

  if (componentType in componentTypeToDefaultValueMap) {
    return componentTypeToDefaultValueMap[componentType];
  }
  return factory.createIdentifier('undefined');
};
/* ex. const initialValues = {
  name: undefined,
  isChecked: false
}
*/
export const getInitialValues = (
  fieldConfigs: Record<string, FieldConfigMetadata>,
  component: StudioForm,
): Statement => {
  const stateNames = new Set<string>();
  const propertyAssignments = Object.entries(fieldConfigs).reduce<PropertyAssignment[]>(
    (acc, [name, { dataType, componentType, isArray }]) => {
      const isNested = name.includes('.');
      // we are only setting top-level keys
      const stateName = name.split('.')[0];
      const defaultValue = getControlledComponentDefaultValue(component.fields, componentType, name);
      let initialValue = getDefaultValueExpression(name, componentType, dataType, isArray, false, defaultValue);
      if (isNested) {
        // if nested, just set up an empty object for the top-level key
        initialValue = factory.createObjectLiteralExpression();
      }
      if (!stateNames.has(stateName)) {
        acc.push(
          factory.createPropertyAssignment(
            isValidVariableName(stateName)
              ? factory.createIdentifier(stateName)
              : factory.createStringLiteral(stateName),
            initialValue,
          ),
        );
        stateNames.add(stateName);
      }
      return acc;
    },
    [],
  );

  return factory.createVariableStatement(
    undefined,
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          factory.createIdentifier('initialValues'),
          undefined,
          undefined,
          factory.createObjectLiteralExpression(propertyAssignments, true),
        ),
      ],
      NodeFlags.Const,
    ),
  );
};

/**
 * iterates field configs to create useState hooks for each field
 * @param fieldConfigs
 * @param dataApi
 * @returns
 */
export const getUseStateHooks = (
  fieldConfigs: Record<string, FieldConfigMetadata>,
  formActionType: StudioFormActionType,
  dataApi?: DataApiKind,
  hasAutoComplete?: boolean,
): Statement[] => {
  const stateNames = new Set();
  return Object.entries(fieldConfigs).reduce<Statement[]>((acc, fieldConfig) => {
    const [name, { sanitizedFieldName, relationship }] = fieldConfig;
    const fieldName = name.split('.')[0];
    const renderedFieldName = sanitizedFieldName || fieldName;

    function determinePropertyName() {
      return isValidVariableName(fieldName)
        ? factory.createPropertyAccessExpression(
            factory.createIdentifier('initialValues'),
            factory.createIdentifier(fieldName),
          )
        : factory.createElementAccessExpression(
            factory.createIdentifier('initialValues'),
            factory.createStringLiteral(fieldName),
          );
    }

    function renderCorrectUseStateValue() {
      return determinePropertyName();
    }

    if (!stateNames.has(renderedFieldName)) {
      acc.push(buildUseStateExpression(renderedFieldName, renderCorrectUseStateValue()));
      stateNames.add(renderedFieldName);
    }

    if (dataApi === 'GraphQL' && relationship) {
      acc.push(buildUseStateExpression(`${renderedFieldName}Loading`, factory.createFalse()));
      acc.push(
        buildUseStateExpression(getRecordsName(renderedFieldName), factory.createArrayLiteralExpression([], false)),
      );
      if (hasAutoComplete && !isModelDataType(fieldConfig[1])) {
        acc.push(
          buildUseStateExpression(
            `selected${capitalizeFirstLetter(renderedFieldName)}Records`,
            factory.createArrayLiteralExpression([], false),
          ),
        );
      }
    }
    return acc;
  }, []);
};

export const getAutocompleteOptions = (
  fieldConfigs: Record<string, FieldConfigMetadata>,
  hasAutoCompleteField: boolean,
  dataApi?: DataApiKind,
): Statement[] => {
  if (
    dataApi === 'GraphQL' &&
    hasAutoCompleteField &&
    Object.values(fieldConfigs).some(({ relationship }) => !!relationship)
  ) {
    return [buildInitConstVariableExpression('autocompleteLength', factory.createNumericLiteral('10'))];
  }

  return [];
};

/**
 * function used by the Clear/ Reset button
 * it's a reset type but we also need to clear the state of the input fields as well
 *
 * ex.
 * const resetStateValues = () => {
 *  setName(initialValues.name)
 *  setLastName(initialValues.lastName)
 *   ....
 * };
 */
export const resetStateFunction = (fieldConfigs: Record<string, FieldConfigMetadata>, recordName?: string) => {
  const recordOrInitialValues = recordName ? 'cleanValues' : 'initialValues';

  const stateNames = new Set<string>();
  const expressions = Object.entries(fieldConfigs).reduce<Statement[]>((acc, [name, fieldConfig]) => {
    const { isArray, sanitizedFieldName, componentType, dataType } = fieldConfig;
    const stateName = name.split('.')[0];
    const renderedName = sanitizedFieldName || stateName;
    if (!stateNames.has(stateName)) {
      const accessExpression = getElementAccessExpression(recordOrInitialValues, stateName);
      const isNonModelField = isNonModelDataType(dataType);

      // Initial values should have the correct values and not need a modifier
      if ((dataType === 'AWSJSON' || isNonModelField) && !isArray && recordOrInitialValues !== 'initialValues') {
        const awsJSONAccessModifier = stringifyAWSJSONFieldValue(accessExpression);
        acc.push(setStateExpression(renderedName, awsJSONAccessModifier));
      } else {
        const stringifiedOrAccessExpression = isNonModelField
          ? stringifyAWSJSONFieldArrayValues(accessExpression)
          : accessExpression;
        acc.push(
          setStateExpression(
            renderedName,
            isArray && recordOrInitialValues === 'cleanValues'
              ? factory.createBinaryExpression(
                  stringifiedOrAccessExpression,
                  factory.createToken(SyntaxKind.QuestionQuestionToken),
                  factory.createArrayLiteralExpression([], false),
                )
              : accessExpression,
          ),
        );
      }
      // We don't need to reset the current array value if it's nested
      // because we're already clearing out the entire nested value
      // adding this on a nested value will add a setState function
      // that was never created to begin with
      if (shouldWrapInArrayField(fieldConfig) && !name.includes('.')) {
        acc.push(
          setStateExpression(
            getCurrentValueName(renderedName),
            getDefaultValueExpression(name, componentType, dataType),
          ),
        );
      }

      if (fieldConfig.relationship) {
        acc.push(
          setStateExpression(
            getCurrentDisplayValueName(renderedName),
            getDefaultValueExpression(name, componentType, dataType, false, true),
          ),
        );

        stateNames.add(stateName);
      }
      stateNames.add(stateName);
    }
    return acc;
  }, []);

  const linkedDataPropertyAssignments: any[] = [];
  if (fieldConfigs) {
    Object.entries(fieldConfigs).forEach(([fieldName, fieldConfig]) => {
      if (fieldConfig.relationship?.type === 'HAS_MANY') {
        linkedDataPropertyAssignments.push(
          factory.createPropertyAssignment(
            factory.createIdentifier(fieldConfig.sanitizedFieldName || fieldName),
            factory.createIdentifier(getLinkedDataName(fieldName)),
          ),
        );
      } else if (fieldConfig.relationship?.type === 'BELONGS_TO' || fieldConfig.relationship?.type === 'HAS_ONE') {
        linkedDataPropertyAssignments.push(factory.createIdentifier(fieldConfig.sanitizedFieldName || fieldName));
      }
    });
  }

  // ex. const cleanValues = {...initialValues, ...bookRecord}
  if (recordName) {
    expressions.unshift(
      factory.createVariableStatement(
        undefined,
        factory.createVariableDeclarationList(
          [
            factory.createVariableDeclaration(
              factory.createIdentifier('cleanValues'),
              undefined,
              undefined,
              factory.createConditionalExpression(
                factory.createIdentifier(recordName),
                factory.createToken(SyntaxKind.QuestionToken),
                factory.createObjectLiteralExpression(
                  [
                    factory.createSpreadAssignment(factory.createIdentifier('initialValues')),
                    factory.createSpreadAssignment(factory.createIdentifier(recordName)),
                    ...linkedDataPropertyAssignments,
                  ],
                  false,
                ),
                factory.createToken(SyntaxKind.ColonToken),
                factory.createIdentifier('initialValues'),
              ),
            ),
          ],
          NodeFlags.Const,
        ),
      ),
    );
  }

  // also reset the state of the errors
  expressions.push(setStateExpression('errors', factory.createObjectLiteralExpression()));

  return factory.createVariableStatement(
    undefined,
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          resetValuesName,
          undefined,
          undefined,
          factory.createArrowFunction(
            undefined,
            undefined,
            [],
            undefined,
            factory.createToken(SyntaxKind.EqualsGreaterThanToken),
            factory.createBlock(expressions, true),
          ),
        ),
      ],
      NodeFlags.Const,
    ),
  );
};

/**
 * Datastore allows JSON strings and normal JSON so check for a string
 * before stringifying or else the string will return with escaped quotes.
 * Also do not stringify null.
 *
 * Example output:
 * typeof cleanValues.metadata === 'string' || cleanValues.metadata === null ?
 * cleanValues.metadata : JSON.stringify(cleanValues.metadata)
 */
const stringifyAWSJSONFieldValue = (
  value: PropertyAccessExpression | ElementAccessExpression,
): ConditionalExpression => {
  return factory.createConditionalExpression(
    factory.createBinaryExpression(
      factory.createBinaryExpression(
        factory.createTypeOfExpression(value),
        factory.createToken(SyntaxKind.EqualsEqualsEqualsToken),
        factory.createStringLiteral('string'),
      ),
      factory.createToken(SyntaxKind.BarBarToken),
      factory.createBinaryExpression(
        value,
        factory.createToken(SyntaxKind.EqualsEqualsEqualsToken),
        factory.createNull(),
      ),
    ),
    factory.createToken(SyntaxKind.QuestionToken),
    value,
    factory.createToken(SyntaxKind.ColonToken),
    factory.createCallExpression(
      factory.createPropertyAccessExpression(factory.createIdentifier('JSON'), factory.createIdentifier('stringify')),
      undefined,
      [value],
    ),
  );
};

/**
 * Datastore allows JSON strings and normal JSON so make sure items in array are string type
 *
 * Example output:
 * cleanValues.nonModelFieldArray?.map(item => typeof item === "string" ? item : JSON.stringify(item))
 */
const stringifyAWSJSONFieldArrayValues = (value: PropertyAccessExpression | ElementAccessExpression): CallChain => {
  return factory.createCallChain(
    factory.createPropertyAccessChain(
      value,
      factory.createToken(SyntaxKind.QuestionDotToken),
      factory.createIdentifier('map'),
    ),
    undefined,
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
            factory.createIdentifier('item'),
            undefined,
            undefined,
            undefined,
          ),
        ],
        undefined,
        factory.createToken(SyntaxKind.EqualsGreaterThanToken),
        factory.createConditionalExpression(
          factory.createBinaryExpression(
            factory.createTypeOfExpression(factory.createIdentifier('item')),
            factory.createToken(SyntaxKind.EqualsEqualsEqualsToken),
            factory.createStringLiteral('string'),
          ),
          factory.createToken(SyntaxKind.QuestionToken),
          factory.createIdentifier('item'),
          factory.createToken(SyntaxKind.ColonToken),
          factory.createCallExpression(
            factory.createPropertyAccessExpression(
              factory.createIdentifier('JSON'),
              factory.createIdentifier('stringify'),
            ),
            undefined,
            [factory.createIdentifier('item')],
          ),
        ),
      ),
    ],
  );
};

/**
 * turns ['myNestedObject', 'value', 'nestedValue', 'leaf']
 *
 * into myNestedObject?.value?.nestedValue?.leaf
 *
 * @param values
 * @returns
 */
export const buildAccessChain = (values: string[], isOptional = true): Expression => {
  if (values.length <= 0) {
    throw new Error('Need at least one value in the values array');
  }
  const optional = isOptional ? factory.createToken(SyntaxKind.QuestionDotToken) : undefined;
  if (values.length > 1) {
    const [parent, child, ...rest] = values;
    let propChain: PropertyAccessChain | ElementAccessChain = factory.createPropertyAccessChain(
      factory.createIdentifier(parent),
      optional,
      factory.createIdentifier(child),
    );
    if (!isValidVariableName(child)) {
      propChain = factory.createElementAccessChain(
        factory.createIdentifier(parent),
        optional,
        factory.createStringLiteral(child),
      );
    }
    if (rest.length) {
      rest.forEach((value) => {
        if (isValidVariableName(value)) {
          propChain = factory.createPropertyAccessChain(propChain, optional, factory.createIdentifier(value));
        } else {
          propChain = factory.createElementAccessChain(propChain, optional, factory.createStringLiteral(value));
        }
      });
    }
    return propChain;
  }
  return factory.createIdentifier(values[0]);
};

export const buildNestedStateSet = (
  keyPath: string[],
  currentKeyPath: string[],
  value: Expression,
  index = 1,
): ObjectLiteralExpression => {
  if (keyPath.length <= 1) {
    throw new Error('keyPath needs a length larger than 1 to build nested state object');
  }
  const currentKey = keyPath[index];
  // the value of the index is what decides if we have reached the leaf property of the nested object
  if (keyPath.length - 1 === index) {
    return factory.createObjectLiteralExpression([
      factory.createSpreadAssignment(buildAccessChain(currentKeyPath)),
      factory.createPropertyAssignment(
        isValidVariableName(currentKey)
          ? factory.createIdentifier(currentKey)
          : factory.createComputedPropertyName(factory.createStringLiteral(currentKey)),
        value,
      ),
    ]);
  }
  const currentSpreadAssignment = buildAccessChain(currentKeyPath);
  currentKeyPath.push(currentKey);
  return factory.createObjectLiteralExpression([
    factory.createSpreadAssignment(currentSpreadAssignment),
    factory.createPropertyAssignment(
      factory.createIdentifier(currentKey),
      buildNestedStateSet(keyPath, currentKeyPath, value, index + 1),
    ),
  ]);
};

// updating state
export const setFieldState = (name: string, value: Expression): CallExpression => {
  if (name.split('.').length > 1) {
    const keyPath = name.split('.');
    return factory.createCallExpression(getSetNameIdentifier(keyPath[0]), undefined, [
      buildNestedStateSet(keyPath, [keyPath[0]], value),
    ]);
  }
  return factory.createCallExpression(getSetNameIdentifier(name), undefined, [value]);
};

export const buildSetStateFunction = (fieldConfigs: Record<string, FieldConfigMetadata>) => {
  const fieldSet = new Set<string>();
  const expression = Object.keys(fieldConfigs).reduce<ExpressionStatement[]>((acc, field) => {
    const fieldName = field.split('.')[0];
    const renderedFieldName = fieldConfigs[field].sanitizedFieldName || fieldName;
    if (!fieldSet.has(renderedFieldName)) {
      acc.push(
        factory.createExpressionStatement(
          factory.createCallExpression(
            factory.createIdentifier(`set${capitalizeFirstLetter(renderedFieldName)}`),
            undefined,
            [
              isValidVariableName(fieldName)
                ? factory.createPropertyAccessExpression(
                    factory.createIdentifier('initialData'),
                    factory.createIdentifier(fieldName),
                  )
                : factory.createElementAccessExpression(
                    factory.createIdentifier('initialData'),
                    factory.createStringLiteral(fieldName),
                  ),
            ],
          ),
        ),
      );
      fieldSet.add(renderedFieldName);
    }
    return acc;
  }, []);
  return factory.createIfStatement(factory.createIdentifier('initialData'), factory.createBlock(expression, true));
};

// ex. React.useEffect(resetStateValues, [bookRecord])
export const buildResetValuesOnRecordUpdate = (recordName: string, linkedDataNames: string[]) => {
  const linkedDataIdentifiers: Identifier[] = [];
  linkedDataNames.forEach((linkedDataName) => {
    linkedDataIdentifiers.push(factory.createIdentifier(linkedDataName));
  });
  return factory.createExpressionStatement(
    factory.createCallExpression(
      factory.createPropertyAccessExpression(factory.createIdentifier('React'), factory.createIdentifier('useEffect')),
      undefined,
      [
        resetValuesName,
        factory.createArrayLiteralExpression([factory.createIdentifier(recordName), ...linkedDataIdentifiers], false),
      ],
    ),
  );
};
