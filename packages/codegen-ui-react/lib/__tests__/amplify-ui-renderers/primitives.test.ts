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
import { StudioComponent } from '@aws-amplify/codegen-ui';
import { assertASTMatchesSnapshot } from '../__utils__';
import { AmplifyRenderer } from '../../amplify-ui-renderers/amplify-renderer';
import { Primitive } from '../../primitive';

function testPrimitive(component: StudioComponent) {
  const renderedComponent = new AmplifyRenderer(component, {}).renderJsx(component);
  assertASTMatchesSnapshot(renderedComponent);
}

describe('Primitives', () => {
  Object.values(Primitive).forEach((primitive) => {
    test(primitive, () => {
      testPrimitive({
        componentType: primitive,
        name: `My${primitive}`,
        properties: {},
        bindingProperties: {},
      });
    });
  });
});
