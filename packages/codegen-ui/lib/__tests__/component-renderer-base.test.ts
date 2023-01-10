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
/* eslint-disable max-classes-per-file */
import { ComponentRendererBase } from '../component-renderer-base';
import { StudioComponentChild } from '../types';

type ComponentProps = {};

class MockComponentRenderer extends ComponentRendererBase<ComponentProps, string, undefined> {
  renderElement(): string {
    return this.component.name || '';
  }
}

class MockComponentRendererWithChildren extends ComponentRendererBase<ComponentProps, string, string> {
  renderElement(renderChildren: (children: StudioComponentChild[], component?: string) => string[]): string {
    return `${this.component.name},${renderChildren(this.component.children || []).join(',')}`;
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

  test('renderElement with children', () => {
    console.log('yup');
    expect(
      new MockComponentRendererWithChildren({
        componentType: 'Button',
        name: 'MyButton',
        properties: {},
        children: [
          {
            componentType: 'Text',
            name: 'MyText',
            properties: {},
          },
        ],
      }).renderElement((children) => children.map((child) => child.name)),
    ).toEqual('MyButton,MyText');
  });
});
