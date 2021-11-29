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
/* eslint-disable no-new */
import { StudioNode } from '../studio-node';
import { StudioComponentChild } from '../types';

describe('StudioNode', () => {
  describe('isRoot', () => {
    test('true when parent is undefined', () => {
      const component = {
        componentType: 'View',
        name: 'MyView',
        properties: {},
      };
      expect(new StudioNode(component).isRoot()).toBeTruthy();
    });
    test('false when parent is defined', () => {
      const parent = new StudioNode({
        componentType: 'View',
        name: 'MyParentView',
        properties: {},
      });
      const component = {
        componentType: 'View',
        name: 'MyView',
        properties: {},
      };
      expect(new StudioNode(component, parent).isRoot()).toBeFalsy();
    });
  });

  describe('getComponentPathToRoot', () => {
    test('get component path', () => {
      const parentComponentName = 'MyParentView';
      const componentName = 'MyView';
      const parent = new StudioNode({
        componentType: 'View',
        name: parentComponentName,
        properties: {},
      });
      const component = {
        componentType: 'View',
        name: componentName,
        properties: {},
      };
      const componentPathToRoot = new StudioNode(component, parent).getComponentPathToRoot();

      expect(componentPathToRoot.map(({ component: { name } }) => name)).toEqual([componentName, parentComponentName]);
    });
  });

  describe('getOverrideKey', () => {
    test('returns for parent', () => {
      const rootComponent = createStudioNodeOfType('Flex', createStudioNodeOfType('Button'));

      expect(rootComponent.getOverrideKey()).toEqual('Flex');
    });

    test('returns only one child', () => {
      const button1 = createStudioNodeOfType('Button');
      createStudioNodeOfType('Flex', button1);

      expect(button1.getOverrideKey()).toEqual('Flex.Button[0]');
    });

    test('returns index 0 for first of multiple elements', () => {
      const button1 = createStudioNodeOfType('Button');
      createStudioNodeOfType('Flex', button1, createStudioNodeOfType('Button'), createStudioNodeOfType('Tooltip'));

      expect(button1.getOverrideKey()).toEqual('Flex.Button[0]');
    });

    test('returns index 0 for first of element of type', () => {
      const button1 = createStudioNodeOfType('Button');
      const button2 = createStudioNodeOfType('Button');
      const tooltip1 = createStudioNodeOfType('Tooltip');
      createStudioNodeOfType('Flex', button1, button2, tooltip1);

      expect(tooltip1.getOverrideKey()).toEqual('Flex.Tooltip[0]');
    });

    test('returns index 1 for second of element of type', () => {
      const button1 = createStudioNodeOfType('Button');
      const button2 = createStudioNodeOfType('Button');
      const tooltip1 = createStudioNodeOfType('Tooltip');
      createStudioNodeOfType('Flex', button1, button2, tooltip1);

      expect(button2.getOverrideKey()).toEqual('Flex.Button[1]');
    });

    /**
     * <Flex> <-- rootComponent: 'Flex'
     *     <Flex />
     *     <Flex />
     *     <Flex> <-- thirdComponentOfType: 'Flex.Flex[2]'
     *         <Button />
     *         <Button> <-- secondSubChildOfType: 'Flex.Flex[2].Button[1]'
     *             <Tooltip /> <-- firstSubSubChild: 'Flex.Flex[2].Button[1].Tooltip[0]'
     *         </Button>
     *     </Flex>
     *     <Tooltip />
     *     <Button />
     * </Flex>
     */
    test('returns for deeply nested elements', () => {
      const firstSubSubChild = createStudioNodeOfType('Tooltip');

      const firstSubChildOfType = createStudioNodeOfType('Button');
      const secondSubChildOfType = createStudioNodeOfType('Button', firstSubSubChild);

      const flex1 = createStudioNodeOfType('Flex');
      const flex2 = createStudioNodeOfType('Flex');
      const flex3 = createStudioNodeOfType('Flex', firstSubChildOfType, secondSubChildOfType);
      const flex4 = createStudioNodeOfType('Flex');
      const tooltip1 = createStudioNodeOfType('Tooltip');
      const button1 = createStudioNodeOfType('Button');

      createStudioNodeOfType('Flex', flex1, flex2, flex3, flex4, tooltip1, button1);

      expect(flex3.getOverrideKey()).toEqual('Flex.Flex[2]');
      expect(secondSubChildOfType.getOverrideKey()).toEqual('Flex.Flex[2].Button[1]');
      expect(firstSubSubChild.getOverrideKey()).toEqual('Flex.Flex[2].Button[1].Tooltip[0]');
    });
  });
});

const createStudioNodeOfType = (type: string, ...children: StudioNode[]): StudioNode => {
  const node = new StudioNode({
    componentType: type,
    name: type,
    properties: {},
    children: children.map((child) => child.component as StudioComponentChild),
  });
  // eslint-disable-next-line no-return-assign, no-param-reassign
  children.forEach((child) => (child.parent = node));
  return node;
};
