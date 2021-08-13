import { FixedStudioComponentProperty, BoundStudioComponentProperty } from '@amzn/amplify-ui-codegen-schema';

import { factory, Expression } from 'typescript';

export function getFixedComponentPropValueExpression(prop: FixedStudioComponentProperty): Expression {
  return factory.createStringLiteral(prop.value.toString(), true);
}

export function isFixedPropertyWithValue(
  prop: FixedStudioComponentProperty | BoundStudioComponentProperty,
): prop is FixedStudioComponentProperty {
  return 'value' in prop;
}
