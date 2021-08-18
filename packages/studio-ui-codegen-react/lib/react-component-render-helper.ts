import { FixedStudioComponentProperty, BoundStudioComponentProperty } from '@amzn/amplify-ui-codegen-schema';

import { factory, Expression } from 'typescript';

export function getFixedComponentPropValueExpression(prop: FixedStudioComponentProperty): Expression {
  return factory.createStringLiteral(prop.value.toString(), true);
}

export function getComponentPropName(componentName?: string): string {
  if (componentName !== undefined) {
    return componentName + 'Props';
  }
  return 'ComponentWithoutName' + 'Props';
}

export function isFixedPropertyWithValue(
  prop: FixedStudioComponentProperty | BoundStudioComponentProperty,
): prop is FixedStudioComponentProperty {
  return 'value' in prop;
}

export function isBoundProperty(
  prop: FixedStudioComponentProperty | BoundStudioComponentProperty,
): prop is BoundStudioComponentProperty {
  return 'bindingProperties' in prop || 'defaultValue' in prop;
}
