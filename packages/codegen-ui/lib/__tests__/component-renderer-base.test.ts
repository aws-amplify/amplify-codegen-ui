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
import { TextProps } from '@aws-amplify/ui-react';
import { ComponentRendererBase } from '../component-renderer-base';

class MockComponentRenderer extends ComponentRendererBase<TextProps, string> {
  renderElement(): string {
    return this.component.name || '';
  }
}

describe('ComponentRendererBase', () => {
  test('renderElement', () => {
    const name = 'MyText';
    expect(
      new MockComponentRenderer({
        componentType: 'Text',
        name,
        properties: {},
      }).renderElement(),
    ).toEqual(name);
  });
});
