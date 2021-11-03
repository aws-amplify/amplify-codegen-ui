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
      const rootComponent = new StudioNode(createSimpleComponentForType('Flex'));
      new StudioNode(createSimpleComponentForType('Button'), rootComponent);

      expect(rootComponent.getOverrideKey()).toEqual('Flex');
    });

    test('returns only one child', () => {
      const rootComponent = new StudioNode(createSimpleComponentForType('Flex'));
      const childComponent = new StudioNode(createSimpleComponentForType('Button'), rootComponent);

      expect(childComponent.getOverrideKey()).toEqual('Flex.Button[0]');
    });

    test('returns index 0 for first of multiple elements', () => {
      const rootComponent = new StudioNode(createSimpleComponentForType('Flex'));
      const firstChildComponent = new StudioNode(createSimpleComponentForType('Button'), rootComponent);
      new StudioNode(createSimpleComponentForType('Button'), rootComponent);
      new StudioNode(createSimpleComponentForType('Tooltip'), rootComponent);

      expect(firstChildComponent.getOverrideKey()).toEqual('Flex.Button[0]');
    });

    test('returns index 0 for first of element of type', () => {
      const rootComponent = new StudioNode(createSimpleComponentForType('Flex'));
      new StudioNode(createSimpleComponentForType('Button'), rootComponent);
      new StudioNode(createSimpleComponentForType('Button'), rootComponent);
      const firstTooltipChildComponent = new StudioNode(createSimpleComponentForType('Tooltip'), rootComponent);

      expect(firstTooltipChildComponent.getOverrideKey()).toEqual('Flex.Tooltip[0]');
    });

    test('returns index 1 for second of element of type', () => {
      const rootComponent = new StudioNode(createSimpleComponentForType('Flex'));
      new StudioNode(createSimpleComponentForType('Button'), rootComponent);
      const secondChildComponent = new StudioNode(createSimpleComponentForType('Button'), rootComponent);
      new StudioNode(createSimpleComponentForType('Tooltip'), rootComponent);

      expect(secondChildComponent.getOverrideKey()).toEqual('Flex.Button[1]');
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
      const rootComponent = new StudioNode(createSimpleComponentForType('Flex'));
      new StudioNode(createSimpleComponentForType('Flex'), rootComponent);
      new StudioNode(createSimpleComponentForType('Flex'), rootComponent);
      const thirdChildComponentOfType = new StudioNode(createSimpleComponentForType('Flex'), rootComponent);
      new StudioNode(createSimpleComponentForType('Tooltip'), rootComponent);
      new StudioNode(createSimpleComponentForType('Button'), rootComponent);
      new StudioNode(createSimpleComponentForType('Button'), thirdChildComponentOfType);
      const secondSubChildOfType = new StudioNode(createSimpleComponentForType('Button'), thirdChildComponentOfType);
      const firstSubSubChild = new StudioNode(createSimpleComponentForType('Tooltip'), secondSubChildOfType);

      expect(thirdChildComponentOfType.getOverrideKey()).toEqual('Flex.Flex[2]');
      expect(secondSubChildOfType.getOverrideKey()).toEqual('Flex.Flex[2].Button[1]');
      expect(firstSubSubChild.getOverrideKey()).toEqual('Flex.Flex[2].Button[1].Tooltip[0]');
    });
  });
});

const createSimpleComponentForType = (type: string): StudioComponentChild => {
  return {
    componentType: type,
    name: type,
    properties: {},
  };
};
