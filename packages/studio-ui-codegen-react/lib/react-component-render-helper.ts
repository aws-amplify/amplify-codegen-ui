import {
  FixedStudioComponentProperty,
  BoundStudioComponentProperty,
  CollectionStudioComponentProperty,
  WorkflowStudioComponentProperty,
  FormStudioComponentProperty,
} from '@amzn/amplify-ui-codegen-schema';

import { factory, JsxAttribute, JsxExpression, StringLiteral, SyntaxKind } from 'typescript';

export function getFixedComponentPropValueExpression(prop: FixedStudioComponentProperty): StringLiteral {
  return factory.createStringLiteral(prop.value.toString(), true);
}

export function getComponentPropName(componentName?: string): string {
  if (componentName !== undefined) {
    return componentName + 'Props';
  }
  return 'ComponentWithoutName' + 'Props';
}

export function isFixedPropertyWithValue(
  prop:
    | FixedStudioComponentProperty
    | BoundStudioComponentProperty
    | CollectionStudioComponentProperty
    | WorkflowStudioComponentProperty
    | FormStudioComponentProperty,
): prop is FixedStudioComponentProperty {
  return 'value' in prop;
}

export function isBoundProperty(
  prop:
    | FixedStudioComponentProperty
    | BoundStudioComponentProperty
    | CollectionStudioComponentProperty
    | WorkflowStudioComponentProperty
    | FormStudioComponentProperty,
): prop is BoundStudioComponentProperty {
  return 'bindingProperties' in prop;
}

export function isCollectionItemBoundProperty(
  prop:
    | FixedStudioComponentProperty
    | BoundStudioComponentProperty
    | CollectionStudioComponentProperty
    | WorkflowStudioComponentProperty
    | FormStudioComponentProperty,
): prop is CollectionStudioComponentProperty {
  return 'collectionBindingProperties' in prop;
}

export function isDefaultValueOnly(
  prop:
    | FixedStudioComponentProperty
    | BoundStudioComponentProperty
    | CollectionStudioComponentProperty
    | WorkflowStudioComponentProperty
    | FormStudioComponentProperty,
): prop is CollectionStudioComponentProperty | BoundStudioComponentProperty {
  return 'defaultValue' in prop && !(isCollectionItemBoundProperty(prop) || isBoundProperty(prop));
}

export function buildBindingAttr(prop: BoundStudioComponentProperty, propName: string): JsxAttribute {
  const expr =
    prop.bindingProperties.field === undefined
      ? factory.createIdentifier(prop.bindingProperties.property)
      : factory.createPropertyAccessExpression(
          factory.createIdentifier(prop.bindingProperties.property),
          prop.bindingProperties.field,
        );

  const attr = factory.createJsxAttribute(
    factory.createIdentifier(propName),
    factory.createJsxExpression(undefined, expr),
  );
  return attr;
}

export function buildBindingAttrWithDefault(
  prop: BoundStudioComponentProperty,
  propName: string,
  defaultValue: string,
): JsxAttribute {
  const rightExpr = factory.createStringLiteral(defaultValue);
  const leftExpr =
    prop.bindingProperties.field === undefined
      ? factory.createIdentifier(prop.bindingProperties.property)
      : factory.createPropertyAccessExpression(
          factory.createIdentifier(prop.bindingProperties.property),
          prop.bindingProperties.field,
        );

  const binaryExpr = factory.createBinaryExpression(leftExpr, factory.createToken(SyntaxKind.BarBarToken), rightExpr);
  const attr = factory.createJsxAttribute(
    factory.createIdentifier(propName),
    factory.createJsxExpression(undefined, binaryExpr),
  );
  return attr;
}

export function buildFixedAttr(prop: FixedStudioComponentProperty, propName: string): JsxAttribute {
  const currentPropValue = prop.value;
  var propValueExpr: StringLiteral | JsxExpression = factory.createStringLiteral(currentPropValue.toString());
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
  return factory.createJsxAttribute(factory.createIdentifier(propName), propValueExpr);
}

export function buildOpeningElementAttributes(
  prop:
    | FixedStudioComponentProperty
    | BoundStudioComponentProperty
    | CollectionStudioComponentProperty
    | WorkflowStudioComponentProperty
    | FormStudioComponentProperty,
  propName: string,
): JsxAttribute {
  if (isFixedPropertyWithValue(prop)) {
    return buildFixedAttr(prop, propName);
  } else if (isBoundProperty(prop)) {
    const attr =
      prop.defaultValue === undefined
        ? buildBindingAttr(prop, propName)
        : buildBindingAttrWithDefault(prop, propName, prop.defaultValue);
    return attr;
  } else if (isCollectionItemBoundProperty(prop)) {
    const attr =
      prop.defaultValue === undefined
        ? buildCollectionBindingAttr(prop, propName)
        : buildCollectionBindingAttrWithDefault(prop, propName, prop.defaultValue);
  }
  return factory.createJsxAttribute(factory.createIdentifier(propName), undefined);
}

export function buildCollectionBindingAttr(prop: CollectionStudioComponentProperty, propName: string): JsxAttribute {
  const expr =
    prop.collectionBindingProperties.field === undefined
      ? factory.createIdentifier(prop.collectionBindingProperties.property)
      : factory.createPropertyAccessExpression(
          factory.createIdentifier(prop.collectionBindingProperties.property),
          prop.collectionBindingProperties.field,
        );

  const attr = factory.createJsxAttribute(
    factory.createIdentifier(propName),
    factory.createJsxExpression(undefined, expr),
  );
  return attr;
}

export function buildCollectionBindingAttrWithDefault(
  prop: CollectionStudioComponentProperty,
  propName: string,
  defaultValue: string,
): JsxAttribute {
  const rightExpr = factory.createStringLiteral(defaultValue);
  const leftExpr =
    prop.collectionBindingProperties.field === undefined
      ? factory.createIdentifier(prop.collectionBindingProperties.property)
      : factory.createPropertyAccessExpression(
          factory.createIdentifier(prop.collectionBindingProperties.property),
          prop.collectionBindingProperties.field,
        );

  const binaryExpr = factory.createBinaryExpression(leftExpr, factory.createToken(SyntaxKind.BarBarToken), rightExpr);
  const attr = factory.createJsxAttribute(
    factory.createIdentifier(propName),
    factory.createJsxExpression(undefined, binaryExpr),
  );
  return attr;
}
