import {
  ConcatenatedStudioComponentProperty,
  ConditionalStudioComponentProperty,
  FixedStudioComponentProperty,
  BoundStudioComponentProperty,
  CollectionStudioComponentProperty,
  WorkflowStudioComponentProperty,
  FormStudioComponentProperty,
  StudioComponent,
  StudioComponentChild,
} from '@amzn/amplify-ui-codegen-schema';

import {
  Expression,
  factory,
  JsxAttribute,
  TemplateSpan,
  StringLiteral,
  SyntaxKind,
  JsxExpression,
  BinaryOperatorToken,
} from 'typescript';

import { ImportCollection } from './import-collection';

export function getFixedComponentPropValueExpression(prop: FixedStudioComponentProperty): StringLiteral {
  return factory.createStringLiteral(prop.value.toString(), true);
}

export function getComponentPropName(componentName?: string): string {
  if (componentName !== undefined) {
    return `${componentName}Props`;
  }
  return 'ComponentWithoutNameProps';
}

type ComponentPropertyValueTypes =
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

export function buildBindingExpression(prop: BoundStudioComponentProperty): Expression {
  return prop.bindingProperties.field === undefined
    ? factory.createIdentifier(prop.bindingProperties.property)
    : factory.createPropertyAccessExpression(
        factory.createIdentifier(prop.bindingProperties.property),
        prop.bindingProperties.field,
      );
}

export function buildBindingAttr(prop: BoundStudioComponentProperty, propName: string): JsxAttribute {
  const expr = buildBindingExpression(prop);

  const attr = factory.createJsxAttribute(
    factory.createIdentifier(propName),
    factory.createJsxExpression(undefined, expr),
  );
  return attr;
}

export function buildBindingWithDefaultExpression(
  prop: BoundStudioComponentProperty,
  defaultValue: string,
): Expression {
  const rightExpr = factory.createStringLiteral(defaultValue);
  const leftExpr =
    prop.bindingProperties.field === undefined
      ? factory.createIdentifier(prop.bindingProperties.property)
      : factory.createPropertyAccessExpression(
          factory.createIdentifier(prop.bindingProperties.property),
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
  const attr = factory.createJsxAttribute(
    factory.createIdentifier(propName),
    factory.createJsxExpression(undefined, binaryExpr),
  );
  return attr;
}

export function buildFixedJsxExpression(prop: FixedStudioComponentProperty): StringLiteral | JsxExpression {
  const currentPropValue = prop.value;
  let propValueExpr: StringLiteral | JsxExpression = factory.createStringLiteral(currentPropValue.toString());
  switch (typeof currentPropValue) {
    case 'number':
      propValueExpr = factory.createJsxExpression(undefined, factory.createNumericLiteral(currentPropValue, undefined));
      break;
    case 'boolean':
      propValueExpr = factory.createJsxExpression(
        undefined,
        currentPropValue ? factory.createTrue() : factory.createFalse(),
      );
      break;
    default:
      break;
  }
  return propValueExpr;
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

export function getSyntaxKindToken(operator: string): BinaryOperatorToken | undefined {
  switch (operator) {
    case 'eq':
      return factory.createToken(SyntaxKind.EqualsEqualsEqualsToken);
    case 'ne':
      return factory.createToken(SyntaxKind.ExclamationEqualsEqualsToken);
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

  if (operatorToken !== undefined) {
    const expr = factory.createJsxExpression(
      undefined,
      factory.createConditionalExpression(
        factory.createBinaryExpression(
          factory.createPropertyAccessExpression(factory.createIdentifier(property), factory.createIdentifier(field)),
          operatorToken,
          getConditionalOperandExpression(operand),
        ),
        factory.createToken(SyntaxKind.QuestionToken),
        resolvePropToExpression(then),
        factory.createToken(SyntaxKind.ColonToken),
        resolvePropToExpression(elseBlock),
      ),
    );
    return expr;
  }
  return factory.createJsxExpression(undefined, undefined);
}

export function buildConditionalAttr(prop: ConditionalStudioComponentProperty, propName: string): JsxAttribute {
  const expr = buildConditionalExpression(prop);
  return factory.createJsxAttribute(factory.createIdentifier(propName), expr);
}

export function buildOpeningElementAttributes(prop: ComponentPropertyValueTypes, propName: string): JsxAttribute {
  if (isFixedPropertyWithValue(prop)) {
    return buildFixedAttr(prop, propName);
  }
  if (isBoundProperty(prop)) {
    const attr =
      prop.defaultValue === undefined
        ? buildBindingAttr(prop, propName)
        : buildBindingAttrWithDefault(prop, propName, prop.defaultValue);
    return attr;
  }
  if (isCollectionItemBoundProperty(prop)) {
    const attr =
      prop.defaultValue === undefined
        ? buildCollectionBindingAttr(prop, propName)
        : buildCollectionBindingAttrWithDefault(prop, propName, prop.defaultValue);
    return attr;
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
        importCollection.addImport('../models', binding.bindingProperties.model);
      }
    });
  }
}
