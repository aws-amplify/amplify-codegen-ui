import { StudioComponentProperty, StudioComponentPropertyType } from '@amzn/amplify-ui-codegen-schema';

import { factory, Expression } from 'typescript';

export function getComponentPropValueExpression(prop: StudioComponentProperty): Expression {
  if (prop.type) {
    switch (prop.type) {
      case StudioComponentPropertyType.Number:
        return factory.createNumericLiteral(prop.value);
    }
  }

  return factory.createStringLiteral(prop.value.toString(), true);
}
