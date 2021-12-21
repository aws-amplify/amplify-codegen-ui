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
  ConcatenatedStudioComponentProperty,
  ConditionalStudioComponentProperty,
  FixedStudioComponentProperty,
  BoundStudioComponentProperty,
  CollectionStudioComponentProperty,
  RelationalOperator,
  WorkflowStudioComponentProperty,
  FormStudioComponentProperty,
  StudioComponent,
  StudioComponentChild,
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
} from 'typescript';

import { ImportCollection, ImportSource } from './imports';
import { jsonToLiteral } from './react-studio-template-renderer-helper';

export function getFixedComponentPropValueExpression(prop: FixedStudioComponentProperty): StringLiteral {
  return factory.createStringLiteral(prop.value.toString(), true);
}

export function getComponentPropName(componentName?: string): string {
  if (componentName !== undefined) {
    return `${componentName}Props`;
  }
  return 'ComponentWithoutNameProps';
}

export type ComponentPropertyValueTypes =
  | ConcatenatedStudioComponentProperty
  | ConditionalStudioComponentProperty
  | FixedStudioComponentProperty
  | BoundStudioComponentProperty
  | CollectionStudioComponentProperty
  | WorkflowStudioComponentProperty
  | FormStudioComponentProperty;

export function isFixedPropertyWithValue(prop: ComponentPropertyValueTypes): prop is FixedStudioComponentProperty {
  return 'value' in prop;
}

export function isBoundProperty(prop: ComponentPropertyValueTypes): prop is BoundStudioComponentProperty {
  return 'bindingProperties' in prop;
}

export function isCollectionItemBoundProperty(
  prop: ComponentPropertyValueTypes,
): prop is CollectionStudioComponentProperty {
  return 'collectionBindingProperties' in prop;
}

export function isConcatenatedProperty(prop: ComponentPropertyValueTypes): prop is ConcatenatedStudioComponentProperty {
  return 'concat' in prop;
}

export function isConditionalProperty(prop: ComponentPropertyValueTypes): prop is ConditionalStudioComponentProperty {
  return 'condition' in prop;
}

export function isDefaultValueOnly(
  prop: ComponentPropertyValueTypes,
): prop is CollectionStudioComponentProperty | BoundStudioComponentProperty {
  return 'defaultValue' in prop && !(isCollectionItemBoundProperty(prop) || isBoundProperty(prop));
}

/**
 * case: has field => <prop.bindingProperties.property>?.<prop.bindingProperties.field>
 * case: no field =>  <prop.bindingProperties.property>
 */
export function buildBindingExpression(prop: BoundStudioComponentProperty): Expression {
  return prop.bindingProperties.field === undefined
    ? factory.createIdentifier(prop.bindingProperties.property)
    : factory.createPropertyAccessChain(
        factory.createIdentifier(prop.bindingProperties.property),
        factory.createToken(SyntaxKind.QuestionDotToken),
        prop.bindingProperties.field,
      );
}

export function buildBindingAttr(prop: BoundStudioComponentProperty, propName: string): JsxAttribute {
  const expr = buildBindingExpression(prop);
  return factory.createJsxAttribute(factory.createIdentifier(propName), factory.createJsxExpression(undefined, expr));
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

export function buildFixedJsxExpression(prop: FixedStudioComponentProperty): StringLiteral | JsxExpression {
  const { value, type } = prop;
  switch (typeof value) {
    case 'number':
      return factory.createJsxExpression(undefined, factory.createNumericLiteral(value, undefined));
    case 'boolean':
      return factory.createJsxExpression(undefined, value ? factory.createTrue() : factory.createFalse());
    case 'string':
      return stringToJsxExpression(value as string, type);
    default:
      throw new Error(`Invalid type ${typeof value} for "${value}"`);
  }
}

function stringToJsxExpression(strValue: string, type: string | undefined) {
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
            return factory.createJsxExpression(undefined, factory.createNumericLiteral(parsedValue, undefined));
          case 'boolean':
            return factory.createJsxExpression(undefined, parsedValue ? factory.createTrue() : factory.createFalse());
          // object, array, and null
          default:
            return factory.createJsxExpression(undefined, jsonToLiteral(parsedValue));
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

export function resolvePropToExpression(prop: ComponentPropertyValueTypes): Expression {
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
    return buildConditionalExpression(prop);
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
    default:
      return undefined;
  }
}

export function getConditionalOperandExpression(operand: string | number | boolean): Expression {
  switch (typeof operand) {
    case 'number':
      return factory.createNumericLiteral(operand);
    case 'boolean':
      return operand ? factory.createTrue() : factory.createFalse();
    default:
      return factory.createStringLiteral(operand);
  }
}

export function buildConditionalExpression(prop: ConditionalStudioComponentProperty): JsxExpression {
  const { property, field, operand, operator, then } = prop.condition;
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

  return factory.createJsxExpression(
    undefined,
    factory.createConditionalExpression(
      factory.createParenthesizedExpression(
        factory.createBinaryExpression(
          propertyAccess,
          factory.createToken(SyntaxKind.AmpersandAmpersandToken),
          factory.createBinaryExpression(propertyAccess, operatorToken, getConditionalOperandExpression(operand)),
        ),
      ),
      factory.createToken(SyntaxKind.QuestionToken),
      resolvePropToExpression(then),
      factory.createToken(SyntaxKind.ColonToken),
      resolvePropToExpression(elseBlock),
    ),
  );
}

export function buildConditionalAttr(prop: ConditionalStudioComponentProperty, propName: string): JsxAttribute {
  const expr = buildConditionalExpression(prop);
  return factory.createJsxAttribute(factory.createIdentifier(propName), expr);
}

export function buildChildElement(prop?: ComponentPropertyValueTypes): JsxChild | undefined {
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
    expression = buildConditionalExpression(prop);
  }
  return expression && factory.createJsxExpression(undefined, expression);
}

export function buildOpeningElementAttributes(prop: ComponentPropertyValueTypes, propName: string): JsxAttribute {
  if (isFixedPropertyWithValue(prop)) {
    return buildFixedAttr(prop, propName);
  }
  if (isBoundProperty(prop)) {
    return prop.defaultValue === undefined
      ? buildBindingAttr(prop, propName)
      : buildBindingAttrWithDefault(prop, propName, prop.defaultValue);
  }
  if (isCollectionItemBoundProperty(prop)) {
    return prop.defaultValue === undefined
      ? buildCollectionBindingAttr(prop, propName)
      : buildCollectionBindingAttrWithDefault(prop, propName, prop.defaultValue);
  }
  if (isConcatenatedProperty(prop)) {
    return buildConcatAttr(prop, propName);
  }
  if (isConditionalProperty(prop)) {
    return buildConditionalAttr(prop, propName);
  }
  return factory.createJsxAttribute(factory.createIdentifier(propName), undefined);
}

/* Tempory stub function to map from generic event name to React event name. Final implementation will be included in
 * amplify-ui.
 */
function mapGenericEventToReact(genericEventBinding: string): string {
  switch (genericEventBinding) {
    case 'click':
      return 'onClick';
    default:
      throw new Error(`${genericEventBinding} is not a possible event.`);
  }
}

/* Build React attribute for actions
 *
 * Example: onClick={invokeAction("signOutAction")}
 */
export function buildOpeningElementActions(genericEventBinding: string, action: string): JsxAttribute {
  // TODO: map from generic to platform
  const reactActionBinding = mapGenericEventToReact(genericEventBinding);
  return factory.createJsxAttribute(
    factory.createIdentifier(reactActionBinding),
    factory.createJsxExpression(
      undefined,
      factory.createCallExpression(factory.createIdentifier('invokeAction'), undefined, [
        factory.createStringLiteral(action),
      ]),
    ),
  );
}

export function addBindingPropertiesImports(
  component: StudioComponent | StudioComponentChild,
  importCollection: ImportCollection,
) {
  if ('bindingProperties' in component) {
    Object.entries(component.bindingProperties).forEach(([, binding]) => {
      if ('bindingProperties' in binding && 'model' in binding.bindingProperties) {
        importCollection.addImport(ImportSource.LOCAL_MODELS, binding.bindingProperties.model);
      }
    });
  }
}
