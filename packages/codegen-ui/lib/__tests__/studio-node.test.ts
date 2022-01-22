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

  describe('hasAncestorOfType', () => {
    test('it returns false with no parent', () => {
      const node = new StudioNode({
        componentType: 'View',
        name: 'Node',
        properties: {},
      });
      expect(node.hasAncestorOfType('Collection')).toBeFalsy();
    });

    test('it returns false with node is of type, but not parent', () => {
      const parent = new StudioNode({
        componentType: 'View',
        name: 'Parent Node',
        properties: {},
      });
      const node = new StudioNode(
        {
          componentType: 'Collection',
          name: 'Node',
          properties: {},
        },
        parent,
      );
      expect(node.hasAncestorOfType('Collection')).toBeFalsy();
    });

    test('it returns true if immediate parent is of type', () => {
      const parent = new StudioNode({
        componentType: 'Collection',
        name: 'Parent Node',
        properties: {},
      });
      const node = new StudioNode(
        {
          componentType: 'View',
          name: 'Node',
          properties: {},
        },
        parent,
      );
      expect(node.hasAncestorOfType('Collection')).toBeTruthy();
    });

    test('it returns true if ancestor is of type', () => {
      const greatGrandParent = new StudioNode({
        componentType: 'View',
        name: 'Great GrandParent Node',
        properties: {},
      });
      const grandParent = new StudioNode(
        {
          componentType: 'Collection',
          name: 'GrandParent Node',
          properties: {},
        },
        greatGrandParent,
      );
      const parent = new StudioNode(
        {
          componentType: 'View',
          name: 'Parent Node',
          properties: {},
        },
        grandParent,
      );
      const node = new StudioNode(
        {
          componentType: 'View',
          name: 'Node',
          properties: {},
        },
        parent,
      );
      expect(node.hasAncestorOfType('Collection')).toBeTruthy();
    });

    test('it returns true if top-level ancestor is of type', () => {
      const grandParent = new StudioNode({
        componentType: 'Collection',
        name: 'GrandParent Node',
        properties: {},
      });
      const parent = new StudioNode(
        {
          componentType: 'View',
          name: 'Parent Node',
          properties: {},
        },
        grandParent,
      );
      const node = new StudioNode(
        {
          componentType: 'View',
          name: 'Node',
          properties: {},
        },
        parent,
      );
      expect(node.hasAncestorOfType('Collection')).toBeTruthy();
    });

    test('it false if no ancestor of type exists', () => {
      const grandParent = new StudioNode({
        componentType: 'view',
        name: 'GrandParent Node',
        properties: {},
      });
      const parent = new StudioNode(
        {
          componentType: 'View',
          name: 'Parent Node',
          properties: {},
        },
        grandParent,
      );
      const node = new StudioNode(
        {
          componentType: 'View',
          name: 'Node',
          properties: {},
        },
        parent,
      );
      expect(node.hasAncestorOfType('Collection')).toBeFalsy();
    });
  });
});
