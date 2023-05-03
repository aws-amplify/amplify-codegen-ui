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
  BoundStudioComponentProperty,
  CollectionStudioComponentProperty,
  ConcatenatedStudioComponentProperty,
  ConditionalStudioComponentProperty,
  FixedStudioComponentProperty,
  StateStudioComponentProperty,
  isAuthProperty,
  RelationalOperator,
  StudioComponent,
  StudioComponentAuthProperty,
  StudioComponentChild,
  StudioComponentProperty,
  StudioComponentEvent,
  BoundStudioComponentEvent,
  ActionStudioComponentEvent,
  MutationActionSetStateParameter,
  ComponentMetadata,
  StudioComponentProperties,
} from '@aws-amplify/codegen-ui';

import {
  Expression,
  factory,
  JsxAttribute,
  TemplateSpan,
  StringLiteral,
  SyntaxKind,
  JsxExpression,
  BinaryOperatorToken,
  JsxChild,
  PrimaryExpression,
  ObjectLiteralExpression,
  NumericLiteral,
  BooleanLiteral,
  NullLiteral,
  ArrayLiteralExpression,
} from 'typescript';

import {
  DataFieldDataType,
  FormMetadata,
  FormStyleConfig,
  GenericDataField,
  StudioFormInputFieldProperty,
} from '@aws-amplify/codegen-ui/lib/types';
import { ImportCollection } from './imports';
import { json, jsonToLiteral } from './react-studio-template-renderer-helper';
import { getChildPropMappingForComponentName } from './workflow/utils';
import nameReplacements from './name-replacements';
import keywords from './keywords';
import { buildAccessChain } from './forms/form-renderer-helper/form-state';

export function getFixedComponentPropValueExpression(prop: FixedStudioComponentProperty): StringLiteral {
  return factory.createStringLiteral(prop.value.toString(), true);
}

export function getComponentPropName(componentName?: string): string {
  if (componentName !== undefined) {
    return `${componentName}Props`;
  }
  return 'ComponentWithoutNameProps';
}

export function isFixedPropertyWithValue(
  prop: StudioComponentProperty | StudioFormInputFieldProperty,
): prop is FixedStudioComponentProperty {
  return typeof prop === 'object' && 'value' in prop;
}

export function isBoundProperty(prop: StudioComponentProperty): prop is BoundStudioComponentProperty {
  return typeof prop === 'object' && 'bindingProperties' in prop;
}

export function isCollectionItemBoundProperty(
  prop: StudioComponentProperty,
): prop is CollectionStudioComponentProperty {
  return typeof prop === 'object' && 'collectionBindingProperties' in prop;
}

export function isConcatenatedProperty(prop: StudioComponentProperty): prop is ConcatenatedStudioComponentProperty {
  return typeof prop === 'object' && 'concat' in prop;
}

export function isConditionalProperty(prop: StudioComponentProperty): prop is ConditionalStudioComponentProperty {
  return typeof prop === 'object' && 'condition' in prop;
}

export function isStateProperty(property: StudioComponentProperty): property is StateStudioComponentProperty {
  return typeof property === 'object' && 'componentName' in property && 'property' in property;
}

export function isSetStateParameter(parameter: StudioComponentProperty): parameter is MutationActionSetStateParameter {
  return typeof parameter === 'object' && 'componentName' in parameter && 'property' in parameter && 'set' in parameter;
}

export function isDefaultValueOnly(
  prop: StudioComponentProperty,
): prop is CollectionStudioComponentProperty | BoundStudioComponentProperty {
  return (
    typeof prop === 'object' &&
    'defaultValue' in prop &&
    !(isCollectionItemBoundProperty(prop) || isBoundProperty(prop))
  );
}

export function isBoundEvent(event: StudioComponentEvent): event is BoundStudioComponentEvent {
  return typeof event === 'object' && 'bindingEvent' in event;
}

export function isActionEvent(event: StudioComponentEvent): event is ActionStudioComponentEvent {
  return typeof event === 'object' && 'action' in event;
}

/**
 * case: has field => <prop.bindingProperties.property>?.<prop.bindingProperties.field>
 * case: no field =>  <prop.bindingProperties.property>
 */
export function buildBindingExpression(prop: BoundStudioComponentProperty): Expression {
  const {
    bindingProperties: { property },
  } = prop;
  const identifier = factory.createIdentifier(keywords.has(property) ? `${property}Prop` : property);
  return prop.bindingProperties.field === undefined
    ? identifier
    : factory.createPropertyAccessChain(
        identifier,
        factory.createToken(SyntaxKind.QuestionDotToken),
        prop.bindingProperties.field,
      );
}

export function buildBindingAttr(prop: BoundStudioComponentProperty, propName: string): JsxAttribute {
  const expr = buildBindingExpression(prop);
  return factory.createJsxAttribute(factory.createIdentifier(propName), factory.createJsxExpression(undefined, expr));
}

function buildAuthExpression(prop: StudioComponentAuthProperty): Expression {
  return factory.createElementAccessExpression(
    factory.createIdentifier('authAttributes'),
    factory.createStringLiteral(prop.userAttribute),
  );
}

export function buildUserAuthAttr(prop: StudioComponentAuthProperty, propName: string): JsxAttribute {
  return factory.createJsxAttribute(
    factory.createIdentifier(propName),
    factory.createJsxExpression(undefined, buildAuthExpression(prop)),
  );
}

export function buildBindingWithDefaultExpression(
  prop: BoundStudioComponentProperty,
  defaultValue: string,
): Expression {
  const rightExpr = factory.createStringLiteral(defaultValue);
  const leftExpr =
    prop.bindingProperties.field === undefined
      ? factory.createIdentifier(prop.bindingProperties.property)
      : factory.createPropertyAccessChain(
          factory.createIdentifier(prop.bindingProperties.property),
          factory.createToken(SyntaxKind.QuestionDotToken),
          prop.bindingProperties.field,
        );

  return factory.createBinaryExpression(leftExpr, factory.createToken(SyntaxKind.BarBarToken), rightExpr);
}

export function buildBindingAttrWithDefault(
  prop: BoundStudioComponentProperty,
  propName: string,
  defaultValue: string,
): JsxAttribute {
  const binaryExpr = buildBindingWithDefaultExpression(prop, defaultValue);
  return factory.createJsxAttribute(
    factory.createIdentifier(propName),
    factory.createJsxExpression(undefined, binaryExpr),
  );
}

export function buildFixedLiteralExpression(
  prop: FixedStudioComponentProperty,
): ObjectLiteralExpression | StringLiteral | NumericLiteral | BooleanLiteral | NullLiteral | ArrayLiteralExpression {
  const { value, type } = prop;
  switch (typeof value) {
    case 'number':
      return factory.createNumericLiteral(value, undefined);
    case 'boolean':
      return value ? factory.createTrue() : factory.createFalse();
    case 'string':
      return fixedPropertyWithTypeToLiteral(value, type);
    case 'object':
      if (value instanceof Date) {
        throw new Error('Date object is not currently supported for fixed literal expression.');
      }
      return jsonToLiteral(value as json);
    default:
      throw new Error(`Invalid type ${typeof value} for "${value}"`);
  }
}

export function buildFixedJsxExpression(prop: FixedStudioComponentProperty): StringLiteral | JsxExpression {
  const expression = buildFixedLiteralExpression(prop);

  // do not wrap strings with brackets
  if (expression.kind === SyntaxKind.StringLiteral) {
    return expression;
  }
  return factory.createJsxExpression(undefined, buildFixedLiteralExpression(prop));
}

function fixedPropertyWithTypeToLiteral(strValue: string, type?: string) {
  switch (type) {
    case undefined:
    case 'String':
    case 'string':
      return factory.createStringLiteral(strValue);
    default:
      try {
        const parsedValue = JSON.parse(strValue);
        if (type && typeof parsedValue !== type.toLowerCase()) {
          throw new Error(`Parsed value type "${typeof parsedValue}" and specified type "${type}" mismatch`);
        }

        switch (typeof parsedValue) {
          case 'number':
            return factory.createNumericLiteral(parsedValue, undefined);
          case 'boolean':
            return parsedValue ? factory.createTrue() : factory.createFalse();
          // object, array, and null
          default:
            return jsonToLiteral(parsedValue);
        }
      } catch (e) {
        if (e instanceof SyntaxError) {
          throw new Error(`Failed to parse value "${strValue}"`);
        } else {
          throw e;
        }
      }
  }
}

export function buildFixedAttr(prop: FixedStudioComponentProperty, propName: string): JsxAttribute {
  const expr = buildFixedJsxExpression(prop);
  return factory.createJsxAttribute(factory.createIdentifier(propName), expr);
}

export function buildCollectionBindingExpression(prop: CollectionStudioComponentProperty): Expression {
  return prop.collectionBindingProperties.field === undefined
    ? factory.createIdentifier('item')
    : factory.createPropertyAccessExpression(factory.createIdentifier('item'), prop.collectionBindingProperties.field);
}

export function buildCollectionBindingAttr(prop: CollectionStudioComponentProperty, propName: string): JsxAttribute {
  const expr = buildCollectionBindingExpression(prop);
  const attr = factory.createJsxAttribute(
    factory.createIdentifier(propName),
    factory.createJsxExpression(undefined, expr),
  );
  return attr;
}

export function buildCollectionBindingWithDefaultExpression(
  prop: CollectionStudioComponentProperty,
  defaultValue: string,
): Expression {
  const rightExpr = factory.createStringLiteral(defaultValue);
  const leftExpr =
    prop.collectionBindingProperties.field === undefined
      ? factory.createIdentifier('item')
      : factory.createPropertyAccessExpression(
          factory.createIdentifier('item'),
          prop.collectionBindingProperties.field,
        );

  return factory.createBinaryExpression(leftExpr, factory.createToken(SyntaxKind.BarBarToken), rightExpr);
}

export function buildCollectionBindingAttrWithDefault(
  prop: CollectionStudioComponentProperty,
  propName: string,
  defaultValue: string,
): JsxAttribute {
  const binaryExpr = buildCollectionBindingWithDefaultExpression(prop, defaultValue);
  const attr = factory.createJsxAttribute(
    factory.createIdentifier(propName),
    factory.createJsxExpression(undefined, binaryExpr),
  );
  return attr;
}

export function buildConcatExpression(prop: ConcatenatedStudioComponentProperty): Expression {
  const expressions: Expression[] = [];
  prop.concat.forEach((propItem) => {
    if (isFixedPropertyWithValue(propItem)) {
      expressions.push(buildFixedJsxExpression(propItem));
    } else if (isBoundProperty(propItem)) {
      const expr =
        propItem.defaultValue === undefined
          ? buildBindingExpression(propItem)
          : buildBindingWithDefaultExpression(propItem, propItem.defaultValue);
      expressions.push(expr);
    } else if (isAuthProperty(propItem)) {
      expressions.push(buildAuthExpression(propItem));
    } else if (isCollectionItemBoundProperty(propItem)) {
      const expr =
        propItem.defaultValue === undefined
          ? buildCollectionBindingExpression(propItem)
          : buildCollectionBindingWithDefaultExpression(propItem, propItem.defaultValue);
      expressions.push(expr);
    } else if (isConcatenatedProperty(propItem)) {
      expressions.push(buildConcatExpression(propItem));
    }
  });
  const templateSpans: TemplateSpan[] = [];
  expressions.forEach((expr, index) => {
    const span =
      index === expressions.length - 1
        ? factory.createTemplateSpan(expr, factory.createTemplateTail('', ''))
        : factory.createTemplateSpan(expr, factory.createTemplateMiddle('', ''));
    templateSpans.push(span);
  });
  return factory.createTemplateExpression(factory.createTemplateHead('', ''), templateSpans);
}

export function buildConcatAttr(prop: ConcatenatedStudioComponentProperty, propName: string): JsxAttribute {
  const expr = buildConcatExpression(prop);
  return factory.createJsxAttribute(factory.createIdentifier(propName), factory.createJsxExpression(undefined, expr));
}

export function buildStateExpression(
  componentMetadata: ComponentMetadata,
  { componentName, property }: StateStudioComponentProperty,
): Expression {
  const childrenPropMapping = getChildPropMappingForComponentName(componentMetadata, componentName);
  const mappedSyntheticProperty = property === childrenPropMapping ? 'children' : property;
  return factory.createIdentifier(getStateName({ componentName, property: mappedSyntheticProperty }));
}

export function buildStateAttr(
  componentMetadata: ComponentMetadata,
  prop: StateStudioComponentProperty,
  propName: string,
): JsxAttribute {
  const expr = buildStateExpression(componentMetadata, prop);
  return factory.createJsxAttribute(factory.createIdentifier(propName), factory.createJsxExpression(undefined, expr));
}

export function propertyToExpression(
  componentMetadata: ComponentMetadata,
  property: StudioComponentProperty | undefined,
): Expression {
  if (property === undefined) {
    return factory.createIdentifier('undefined');
  }

  if (isFixedPropertyWithValue(property)) {
    return buildFixedLiteralExpression(property);
  }

  if (isBoundProperty(property)) {
    return property.defaultValue === undefined
      ? buildBindingExpression(property)
      : buildBindingWithDefaultExpression(property, property.defaultValue);
  }

  if (isConcatenatedProperty(property)) {
    return buildConcatExpression(property);
  }

  if (isConditionalProperty(property)) {
    return buildConditionalExpression(componentMetadata, property);
  }

  if (isStateProperty(property)) {
    return buildStateExpression(componentMetadata, property);
  }

  if (isAuthProperty(property)) {
    return buildAuthExpression(property);
  }

  throw new Error(`Invalid property: ${JSON.stringify(property)}.`);
}

export function resolvePropToExpression(
  componentMetadata: ComponentMetadata,
  prop: StudioComponentProperty,
): Expression {
  if (isFixedPropertyWithValue(prop)) {
    const propValue = prop.value;
    switch (typeof propValue) {
      case 'number':
        return factory.createNumericLiteral(propValue, undefined);
      case 'boolean':
        return propValue ? factory.createTrue() : factory.createFalse();
      default:
        return factory.createStringLiteral(propValue.toString(), undefined);
    }
  }
  if (isBoundProperty(prop)) {
    const expr =
      prop.defaultValue === undefined
        ? buildBindingExpression(prop)
        : buildBindingWithDefaultExpression(prop, prop.defaultValue);
    return expr;
  }

  if (isAuthProperty(prop)) {
    return buildAuthExpression(prop);
  }
  if (isCollectionItemBoundProperty(prop)) {
    const expr =
      prop.defaultValue === undefined
        ? buildCollectionBindingExpression(prop)
        : buildCollectionBindingWithDefaultExpression(prop, prop.defaultValue);
    return expr;
  }
  if (isConcatenatedProperty(prop)) {
    return buildConcatExpression(prop);
  }
  if (isConditionalProperty(prop)) {
    return buildConditionalExpression(componentMetadata, prop);
  }
  if (isStateProperty(prop)) {
    return buildStateExpression(componentMetadata, prop);
  }
  return factory.createVoidZero();
}

export function getSyntaxKindToken(operator: RelationalOperator): BinaryOperatorToken | undefined {
  switch (operator) {
    case 'eq':
      return factory.createToken(SyntaxKind.EqualsEqualsToken);
    case 'ne':
      return factory.createToken(SyntaxKind.ExclamationEqualsToken);
    case 'le':
      return factory.createToken(SyntaxKind.LessThanEqualsToken);
    case 'lt':
      return factory.createToken(SyntaxKind.LessThanToken);
    case 'ge':
      return factory.createToken(SyntaxKind.GreaterThanEqualsToken);
    case 'gt':
      return factory.createToken(SyntaxKind.GreaterThanToken);
    /* istanbul ignore next */
    default:
      return undefined;
  }
}

export function parseNumberOperand(operand: string | number | boolean, dataField: GenericDataField | undefined) {
  if (dataField) {
    const numberOperandType: DataFieldDataType[] = ['Int', 'Float'];
    if (numberOperandType.includes(dataField.dataType)) {
      const parsedOperand = parseFloat(`${operand}`);
      if (!Number.isNaN(parsedOperand) && Number.isFinite(parsedOperand)) {
        return parsedOperand;
      }
    }
  }
  return operand;
}

export function getConditionalOperandExpression(
  operand: string | number | boolean,
  operandType: string | undefined,
): Expression {
  if (typeof operand === 'string' && operandType && operandType !== 'string') {
    return stringValueToTypedLiteral(operand, operandType);
  }
  return typedValueToJsxLiteral(operand);
}

function stringValueToTypedLiteral(value: any, valueType: string): PrimaryExpression {
  try {
    const typedVal = JSON.parse(value);
    if (valueType === typeof typedVal) {
      return typedValueToJsxLiteral(typedVal);
    }
    throw Error(`Parsed value ${value} and type ${valueType} mismatch`);
  } catch (err) {
    if (err instanceof SyntaxError) {
      return factory.createStringLiteral(value);
    }
    throw err;
  }
}

function typedValueToJsxLiteral(value: any): PrimaryExpression {
  switch (typeof value) {
    case 'number':
      return factory.createNumericLiteral(value);
    case 'boolean':
      return value ? factory.createTrue() : factory.createFalse();
    default:
      return factory.createStringLiteral(value);
  }
}

export function buildConditionalExpression(
  componentMetadata: ComponentMetadata,
  prop: ConditionalStudioComponentProperty,
): Expression {
  const { property, field, operand, operandType, operator, then } = prop.condition;
  const elseBlock = prop.condition.else;
  const operatorToken = getSyntaxKindToken(operator);

  if (operatorToken === undefined) {
    return factory.createJsxExpression(undefined, undefined);
  }

  const propertyAccess =
    field !== undefined
      ? factory.createPropertyAccessChain(
          factory.createIdentifier(property),
          factory.createToken(SyntaxKind.QuestionDotToken),
          factory.createIdentifier(field),
        )
      : factory.createIdentifier(property);

  return factory.createConditionalExpression(
    factory.createBinaryExpression(
      propertyAccess,
      operatorToken,
      getConditionalOperandExpression(operand, operandType),
    ),
    factory.createToken(SyntaxKind.QuestionToken),
    resolvePropToExpression(componentMetadata, then),
    factory.createToken(SyntaxKind.ColonToken),
    resolvePropToExpression(componentMetadata, elseBlock),
  );
}

export function buildConditionalAttr(
  componentMetadata: ComponentMetadata,
  prop: ConditionalStudioComponentProperty,
  propName: string,
): JsxAttribute {
  const expr = buildConditionalExpression(componentMetadata, prop);
  return factory.createJsxAttribute(factory.createIdentifier(propName), factory.createJsxExpression(undefined, expr));
}

export function buildChildElement(
  componentMetadata: ComponentMetadata,
  prop?: StudioComponentProperty,
): JsxChild | undefined {
  if (!prop) {
    return undefined;
  }
  let expression: Expression | undefined;
  if (isFixedPropertyWithValue(prop)) {
    expression = buildFixedJsxExpression(prop);
  }
  if (isBoundProperty(prop)) {
    expression =
      prop.defaultValue === undefined
        ? buildBindingExpression(prop)
        : buildBindingWithDefaultExpression(prop, prop.defaultValue);
  }
  if (isCollectionItemBoundProperty(prop)) {
    expression =
      prop.defaultValue === undefined
        ? buildCollectionBindingExpression(prop)
        : buildCollectionBindingWithDefaultExpression(prop, prop.defaultValue);
  }
  if (isConcatenatedProperty(prop)) {
    expression = buildConcatExpression(prop);
  }
  if (isConditionalProperty(prop)) {
    expression = buildConditionalExpression(componentMetadata, prop);
  }
  return expression && factory.createJsxExpression(undefined, expression);
}

export function buildOpeningElementProperties(
  componentMetadata: ComponentMetadata,
  prop: StudioComponentProperty,
  name: string,
): JsxAttribute {
  if (isFixedPropertyWithValue(prop)) {
    return buildFixedAttr(prop, name);
  }
  if (isBoundProperty(prop)) {
    return prop.defaultValue === undefined
      ? buildBindingAttr(prop, name)
      : buildBindingAttrWithDefault(prop, name, prop.defaultValue);
  }
  if (isAuthProperty(prop)) {
    return buildUserAuthAttr(prop, name);
  }
  if (isCollectionItemBoundProperty(prop)) {
    return prop.defaultValue === undefined
      ? buildCollectionBindingAttr(prop, name)
      : buildCollectionBindingAttrWithDefault(prop, name, prop.defaultValue);
  }
  if (isConcatenatedProperty(prop)) {
    return buildConcatAttr(prop, name);
  }
  if (isConditionalProperty(prop)) {
    return buildConditionalAttr(componentMetadata, prop, name);
  }
  if (isStateProperty(prop)) {
    return buildStateAttr(componentMetadata, prop, name);
  }
  return factory.createJsxAttribute(factory.createIdentifier(name), undefined);
}

function buildFixedOrTokenRefAttribute(styleConfig: FormStyleConfig, propName: string): JsxAttribute | undefined {
  if (styleConfig.value) {
    return buildFixedAttr({ value: styleConfig.value }, propName);
  }
  if (styleConfig.tokenReference) {
    const tokenReference = ['tokens', ...styleConfig.tokenReference.split('.')];

    return factory.createJsxAttribute(
      factory.createIdentifier(propName),
      factory.createJsxExpression(
        undefined,
        factory.createPropertyAccessExpression(buildAccessChain(tokenReference, false), 'value'),
      ),
    );
  }
  return undefined;
}

export function buildFormLayoutProperties(formMetadata: FormMetadata | undefined): JsxAttribute[] {
  const propMap: Record<string, string> = {
    horizontalGap: 'rowGap',
    verticalGap: 'columnGap',
    outerPadding: 'padding',
  };

  return Object.entries(formMetadata?.layoutConfigs ?? {}).reduce<JsxAttribute[]>((acc, value) => {
    const mappedProp = propMap[value[0]];

    if (!mappedProp) {
      return acc;
    }

    const mappedAttribute = buildFixedOrTokenRefAttribute(value[1], mappedProp);
    if (mappedAttribute) {
      acc.push(mappedAttribute);
    }

    return acc;
  }, []);
}

export function buildCtaLayoutProperties(formMetadata: FormMetadata): JsxAttribute | undefined {
  return buildFixedOrTokenRefAttribute(formMetadata.layoutConfigs.verticalGap, 'gap');
}

export function addBindingPropertiesImports(
  component: StudioComponent | StudioComponentChild,
  importCollection: ImportCollection,
) {
  if (typeof component === 'object' && 'bindingProperties' in component) {
    Object.entries(component.bindingProperties).forEach(([, binding]) => {
      if (typeof binding === 'object' && 'bindingProperties' in binding && 'model' in binding.bindingProperties) {
        importCollection.addModelImport(binding.bindingProperties.model);
      }
    });
  }
}

// Scrub all non-alphanum characters, and any leading numbers so we can generate a legal
// variable name.
export function sanitizeName(componentName: string): string {
  return nameReplacements
    .reduce((name, [character, replacement]) => name.replace(character, replacement), componentName)
    .replace(/[^a-zA-Z]/g, ''); // remove any stray non alpha characters
}

export function getStateName(stateReference: StateStudioComponentProperty): string {
  const { componentName, property } = stateReference;
  const rawStateName = [
    componentName.charAt(0).toLowerCase() + componentName.slice(1),
    property.charAt(0).toUpperCase() + property.slice(1),
  ].join('');
  return sanitizeName(rawStateName);
}

export function getSetStateName(stateReference: StateStudioComponentProperty): string {
  const stateName = getStateName(stateReference);
  return ['set', stateName.charAt(0).toUpperCase() + stateName.slice(1)].join('');
}

export function hasChildrenProp(componentProperties: StudioComponentProperties): boolean {
  return !!(
    typeof componentProperties === 'object' &&
    'children' in componentProperties &&
    componentProperties.children
  );
}
