import { StudioComponent, StudioComponentChild } from '@aws-amplify/codegen-ui/lib/types';
import { JsxAttribute, JsxElement, factory } from 'typescript';
import { camelCase, getAttributes, getTextType, getUniquePropIdentifier, isProp } from '../helpers';

const whitelistedProps = ['children', 'type'];

export function createText(
  component: StudioComponent | StudioComponentChild,
  propTypes: Set<string>,
): JsxElement {
  let props: any = {};
  let jsxAttributes: JsxAttribute[] = [];

  if ('textAlign' in component.properties) {
    const alignment = JSON.parse(JSON.stringify(component.properties.textAlign)).value.toLowerCase();
    if (isProp(component.properties, 'alignment', whitelistedProps)) {
      const propName = JSON.parse(JSON.stringify(component.properties.isProp)).value;
      const identifier = getUniquePropIdentifier(propTypes, propName + '_alignment');
      jsxAttributes.push(
        factory.createJsxAttribute(
          factory.createIdentifier('alignment'),
          factory.createJsxExpression(undefined, factory.createIdentifier(identifier)),
        ),
      );
    } else {
      props.alignment = alignment;
    }
  }

  if ('fontFamily' in component.properties) {
    const fontFamily: any = camelCase(JSON.parse(JSON.stringify(component.properties.fontFamily)).value.toLowerCase());
    if (isProp(component.properties, 'fontFamily', whitelistedProps)) {
      const propName = JSON.parse(JSON.stringify(component.properties.isProp)).value;
      const identifier = getUniquePropIdentifier(propTypes, propName + '_fontFamily');
      jsxAttributes.push(
        factory.createJsxAttribute(
          factory.createIdentifier('fontFamily'),
          factory.createJsxExpression(undefined, factory.createIdentifier(identifier)),
        ),
      );
    } else {
      props.fontFamily = fontFamily;
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

  const type = getTextType(component.properties);
  if (type) {
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

  jsxAttributes = [...getAttributes(props), ...jsxAttributes];

  //Generate JSX Element
  return factory.createJsxElement(
    factory.createJsxOpeningElement(
      factory.createIdentifier('Text'),
      undefined,
      factory.createJsxAttributes(jsxAttributes),
    ),
    [],
    factory.createJsxClosingElement(factory.createIdentifier('Text')),
  );
}
