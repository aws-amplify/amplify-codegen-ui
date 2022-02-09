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
import { StudioGenericEvent, StudioComponentEvent, BoundStudioComponentEvent } from '@aws-amplify/codegen-ui';
import { factory, JsxAttribute, SyntaxKind } from 'typescript';
import { getActionIdentifier } from './action';
import { isBoundEvent, isActionEvent } from '../react-component-render-helper';
import Primitive, { PrimitiveLevelPropConfiguration } from '../primitive';

/*
 * Temporary hardcoded mapping of generic to react events, long-term this will be exported by amplify-ui.
 */
const genericEventToReactEventMapping = {
  [StudioGenericEvent.click]: 'onClick',
  [StudioGenericEvent.doubleclick]: 'onDoubleClick',
  [StudioGenericEvent.mousedown]: 'onMouseDown',
  [StudioGenericEvent.mouseenter]: 'onMouseEnter',
  [StudioGenericEvent.mouseleave]: 'onMouseLeave',
  [StudioGenericEvent.mousemove]: 'onMouseMove',
  [StudioGenericEvent.mouseout]: 'onMouseOut',
  [StudioGenericEvent.mouseover]: 'onMouseOver',
  [StudioGenericEvent.mouseup]: 'onMouseUp',
  [StudioGenericEvent.change]: 'onChange',
  [StudioGenericEvent.input]: 'onInput',
  [StudioGenericEvent.focus]: 'onFocus',
  [StudioGenericEvent.blur]: 'onBlur',
  [StudioGenericEvent.keydown]: 'onKeyDown',
  [StudioGenericEvent.keypress]: 'onKeyPress',
  [StudioGenericEvent.keyup]: 'onKeyUp',
};

const genericEventToReactEventMappingOverrides: PrimitiveLevelPropConfiguration<string> = {
  [Primitive.StepperField]: {
    [StudioGenericEvent.change]: 'onStepChange',
  },
};

export function buildOpeningElementEvents(
  componentType: string,
  event: StudioComponentEvent,
  name: string,
  componentName: string | undefined,
): JsxAttribute {
  if (isBoundEvent(event)) {
    return buildBindingEvent(componentType, event, name);
  }
  if (isActionEvent(event)) {
    return buildActionEvent(componentType, name, componentName);
  }

  return factory.createJsxAttribute(factory.createIdentifier(name), undefined);
}

export function buildBindingEvent(
  componentType: string,
  event: BoundStudioComponentEvent,
  eventName: string,
): JsxAttribute {
  const expr = factory.createIdentifier(event.bindingEvent);
  return factory.createJsxAttribute(
    factory.createIdentifier(mapGenericEventToReact(componentType as Primitive, eventName as StudioGenericEvent)),
    factory.createJsxExpression(undefined, expr),
  );
}

export function buildActionEvent(
  componentType: string,
  eventName: string,
  componentName: string | undefined,
): JsxAttribute {
  return factory.createJsxAttribute(
    factory.createIdentifier(mapGenericEventToReact(componentType as Primitive, eventName as StudioGenericEvent)),
    factory.createJsxExpression(
      undefined,
      factory.createArrowFunction(
        undefined,
        undefined,
        [],
        undefined,
        factory.createToken(SyntaxKind.EqualsGreaterThanToken),
        factory.createBlock(
          [
            factory.createExpressionStatement(
              factory.createCallExpression(
                factory.createIdentifier(getActionIdentifier(componentName, eventName)),
                undefined,
                [],
              ),
            ),
          ],
          false,
        ),
      ),
    ),
  );
}

export function mapGenericEventToReact(componentType: Primitive, genericEventBinding: StudioGenericEvent): string {
  const componentOverrides = genericEventToReactEventMappingOverrides[componentType];
  if (componentOverrides && componentOverrides[genericEventBinding]) {
    return componentOverrides[genericEventBinding];
  }
  const reactEventMapping = genericEventToReactEventMapping[genericEventBinding];
  if (!reactEventMapping) {
    throw new Error(`${genericEventBinding} is not a possible event.`);
  }
  return reactEventMapping;
}
