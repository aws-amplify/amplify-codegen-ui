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

import { addDataStoreModelField } from '../../../generate-form-definition/helpers';
import { FormDefinition } from '../../../types';

describe('addDataStoreModelField', () => {
  it('should map the component type, data type and props to the form definition', () => {
    const formDefinition: FormDefinition = {
      form: { props: { layoutStyle: {} } },
      elements: {},
      buttons: {},
      elementMatrix: [],
    };

    const dataStoreModelField = { name: 'name', type: 'String', isReadOnly: false, isRequired: false, isArray: false };

    addDataStoreModelField(formDefinition, dataStoreModelField);

    expect(formDefinition.elements.name.componentType).toBe('TextField');
    expect(formDefinition.elements.name.dataType).toBe('String');
    expect(formDefinition.elements.name.props).toStrictEqual({ label: 'name', isRequired: false, isReadOnly: false });
  });

  it('should throw if field is an array', () => {
    const formDefinition: FormDefinition = {
      form: { props: { layoutStyle: {} } },
      elements: {},
      buttons: {},
      elementMatrix: [],
    };

    const dataStoreModelField = { name: 'name', type: 'String', isReadOnly: false, isRequired: false, isArray: true };

    expect(() => addDataStoreModelField(formDefinition, dataStoreModelField)).toThrow();
  });

  it('should throw if there is no default component', () => {
    const formDefinition: FormDefinition = {
      form: { props: { layoutStyle: {} } },
      elements: {},
      buttons: {},
      elementMatrix: [],
    };

    const dataStoreModelField = {
      name: 'name',
      type: 'ErrantType',
      isReadOnly: false,
      isRequired: false,
      isArray: false,
    };

    expect(() => addDataStoreModelField(formDefinition, dataStoreModelField)).toThrow();
  });
});
