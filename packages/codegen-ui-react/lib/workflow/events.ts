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
import {
  StudioGenericEvent,
  StudioComponentEvent,
  BoundStudioComponentEvent,
  ActionStudioComponentEvent,
} from '@aws-amplify/codegen-ui';

import { factory, JsxAttribute, SyntaxKind } from 'typescript';

import { getActionIdentifier } from './action';
import { isBoundEvent, isActionEvent } from '../react-component-render-helper';

export function buildOpeningElementEvents(
  event: StudioComponentEvent,
  name: string,
  componentName: string | undefined,
): JsxAttribute {
  if (isBoundEvent(event)) {
    return buildBindingEvent(event, name);
  }
  if (isActionEvent(event)) {
    return buildActionEvent(event, name, componentName);
  }

  return factory.createJsxAttribute(factory.createIdentifier(name), undefined);
}

export function buildBindingEvent(event: BoundStudioComponentEvent, eventName: string): JsxAttribute {
  const expr = factory.createIdentifier(event.bindingEvent);
  return factory.createJsxAttribute(
    factory.createIdentifier(mapGenericEventToReact(eventName as StudioGenericEvent)),
    factory.createJsxExpression(undefined, expr),
  );
}

export function buildActionEvent(
  event: ActionStudioComponentEvent,
  eventName: string,
  componentName: string | undefined,
): JsxAttribute {
  return factory.createJsxAttribute(
    factory.createIdentifier(mapGenericEventToReact(eventName as StudioGenericEvent)),
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

export function mapGenericEventToReact(genericEventBinding: StudioGenericEvent): string {
  const reactEventMapping = genericEventToReactEventMapping[genericEventBinding];
  if (!reactEventMapping) {
    throw new Error(`${genericEventBinding} is not a possible event.`);
  }
  return reactEventMapping;
}
