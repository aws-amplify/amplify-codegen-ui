import {
  StudioComponentDataPropertyBinding,
  StudioComponentAuthPropertyBinding,
  StudioComponentStoragePropertyBinding,
  StudioComponentEventPropertyBinding,
  StudioComponentSimplePropertyBinding,
} from '@amzn/amplify-ui-codegen-schema';
import {
  isStudioComponentWithBinding,
  isDataPropertyBinding,
  isAuthPropertyBinding,
  isStoragePropertyBinding,
  isSimplePropertyBinding,
} from '../renderer-helper';

describe('render-helper', () => {
  const bindingProperties: {
    data: StudioComponentDataPropertyBinding;
    auth: StudioComponentAuthPropertyBinding;
    storage: StudioComponentStoragePropertyBinding;
    boolean: StudioComponentSimplePropertyBinding;
    string: StudioComponentSimplePropertyBinding;
    number: StudioComponentSimplePropertyBinding;
    date: StudioComponentSimplePropertyBinding;
  } = {
    data: {
      type: 'Data',
      bindingProperties: {
        model: 'User',
      },
    },
    auth: {
      type: 'Authentication',
      bindingProperties: {
        userAttribute: 'username',
      },
    },
    storage: {
      type: 'Storage',
      bindingProperties: {
        bucket: 'test-bucket',
      },
    },
    boolean: {
      type: 'Boolean',
    },
    string: {
      type: 'String',
    },
    number: {
      type: 'Number',
    },
    date: {
      type: 'Date',
    },
  };

  describe('isStudioComponentWithBinding', () => {
    test('object has bindingProperties', () => {
      expect(
        isStudioComponentWithBinding({
          componentType: 'View',
          name: 'MyBindingView',
          properties: {},
          bindingProperties: {},
        }),
      ).toBeTruthy();
      expect(
        isStudioComponentWithBinding({
          componentType: 'View',
          name: 'MyNonBindingView',
          properties: {},
        }),
      ).toBeFalsy();
    });
  });

  describe('isDataPropertyBinding', () => {
    test('property has type Data', () => {
      expect(isDataPropertyBinding(bindingProperties.data)).toBeTruthy();
      const { data, ...otherTypes } = bindingProperties;
      Object.values(otherTypes).forEach((otherType) => expect(isDataPropertyBinding(otherType)).toBeFalsy());
    });
  });

  describe('isAuthPropertyBinding', () => {
    test('property has type Authentication', () => {
      expect(isAuthPropertyBinding(bindingProperties.auth)).toBeTruthy();
      const { auth, ...otherTypes } = bindingProperties;
      Object.values(otherTypes).forEach((otherType) => expect(isAuthPropertyBinding(otherType)).toBeFalsy());
    });
  });

  describe('isStoragePropertyBinding', () => {
    test('property has type Storage', () => {
      expect(isStoragePropertyBinding(bindingProperties.storage)).toBeTruthy();
      const { storage, ...otherTypes } = bindingProperties;
      Object.values(otherTypes).forEach((otherType) => expect(isStoragePropertyBinding(otherType)).toBeFalsy());
    });
  });

  describe('isSimplePropertyBinding', () => {
    test('property has type Boolean, String, Number, or Date', () => {
      expect(isSimplePropertyBinding(bindingProperties.boolean)).toBeTruthy();
      expect(isSimplePropertyBinding(bindingProperties.string)).toBeTruthy();
      expect(isSimplePropertyBinding(bindingProperties.number)).toBeTruthy();
      expect(isSimplePropertyBinding(bindingProperties.date)).toBeTruthy();
      const { boolean, string, number, date, ...otherTypes } = bindingProperties;
      Object.values(otherTypes).forEach((otherType) => expect(isSimplePropertyBinding(otherType)).toBeFalsy());
    });
  });
});
