import { StudioComponentProperty, StudioComponentPropertyType } from '@amzn/amplify-ui-codegen-schema';

import { factory, Expression } from 'typescript';

export function getComponentPropValueExpression(prop: StudioComponentProperty): Expression {
  if (prop.value && typeof prop.value === 'number') {
    return factory.createNumericLiteral(prop.value);
  }
  return factory.createStringLiteral(prop.value.toString(), true);
}
