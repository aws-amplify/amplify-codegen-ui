import { StudioComponent, StudioComponentChild } from '@aws-amplify/codegen-ui/lib/types';
import { JsxAttribute, factory } from 'typescript';
import { getAttributes, getUniquePropIdentifier, isProp } from '../helpers';

export function createDatePicker(component: StudioComponent | StudioComponentChild, propTypes: Set<string>) {
  let props: any = {};
  let jsxAttributes: JsxAttribute[] = [];

  if ('label' in component.properties) {
    const label = JSON.parse(JSON.stringify(component.properties.label)).value;
    props.label = label;
  }

  if ('placeholder' in component.properties) {
    const placeholder = JSON.parse(JSON.stringify(component.properties.placeholder)).value;
    props.placeholder = placeholder;
  }

  if ('size' in component.properties) {
    const size = JSON.parse(JSON.stringify(component.properties.size)).value.toLowerCase();
    props.size = size;
  }

  if ('disabled' in component.properties) {
    const disabled = JSON.parse(JSON.stringify(component.properties.disabled)).value.toLowerCase();
    props.disabled = disabled === "true" ? true : false;
  }

  jsxAttributes = [...getAttributes(props), ...jsxAttributes];

  //Generate JSX Element
  return factory.createJsxElement(
    factory.createJsxOpeningElement(
      factory.createIdentifier('DatePicker'),
      undefined,
      factory.createJsxAttributes(jsxAttributes),
    ),
    [],
    factory.createJsxClosingElement(factory.createIdentifier('DatePicker')),
  );
}
