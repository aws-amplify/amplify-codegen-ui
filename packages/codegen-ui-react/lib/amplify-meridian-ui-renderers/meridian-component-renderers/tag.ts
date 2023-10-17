import { StudioComponent, StudioComponentChild } from '@aws-amplify/codegen-ui/lib/types';
import { JsxAttribute, factory } from 'typescript';
import { getAttributes, getUniquePropIdentifier, isProp } from '../helpers';

const whitelistedProps = ['type'];

export function createTag(component: StudioComponent | StudioComponentChild, propTypes: Set<string>) {
  let props: any = {};
  let jsxAttributes: JsxAttribute[] = [];

  if ('type' in component.properties) {
    const type = JSON.parse(JSON.stringify(component.properties.type)).value.toLowerCase();
    if (isProp(component.properties, 'type', whitelistedProps)) {
      const propName = JSON.parse(JSON.stringify(component.properties.isProp)).value;
      const identifier = getUniquePropIdentifier(propTypes, propName + '_type');
      jsxAttributes.push(
        factory.createJsxAttribute(
          factory.createIdentifier('type'),
          factory.createJsxExpression(undefined, factory.createIdentifier(identifier)),
        ),
      );
    } else {
      props.type = type;
    }
  }

  if ('children' in component.properties) {
    const children = JSON.parse(JSON.stringify(component.properties.children)).value;
    if (isProp(component.properties, 'children', whitelistedProps)) {
      const propName = JSON.parse(JSON.stringify(component.properties.isProp)).value;
      const identifier = getUniquePropIdentifier(propTypes, propName + '_children');
      jsxAttributes.push(
        factory.createJsxAttribute(
          factory.createIdentifier('children'),
          factory.createJsxExpression(undefined, factory.createIdentifier(identifier)),
        ),
      );
    } else {
      props.children = children;
    }
  }

  jsxAttributes = [...getAttributes(props), ...jsxAttributes];

  //Generate JSX Element
  return factory.createJsxElement(
    factory.createJsxOpeningElement(
      factory.createIdentifier('Tag'),
      undefined,
      factory.createJsxAttributes(jsxAttributes),
    ),
    [],
    factory.createJsxClosingElement(factory.createIdentifier('Tag')),
  );
}
