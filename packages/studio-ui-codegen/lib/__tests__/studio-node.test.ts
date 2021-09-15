import { StudioNode } from '../studio-node';

describe('StudioNone', () => {
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

      expect(componentPathToRoot.map(({ name }) => name)).toEqual([componentName, parentComponentName]);
    });
  });
});
