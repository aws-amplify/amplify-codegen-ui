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
import { FormDefinition, FormMetadata, StudioForm } from '../types';
import { FieldValidationConfiguration } from '../types/form/form-validation';

export const getFormFieldStateName = (formName: string) => {
  return [formName.charAt(0).toLowerCase() + formName.slice(1), 'Fields'].join('');
};

export const mapFormMetadata = (form: StudioForm, formDefinition: FormDefinition): FormMetadata => {
  return {
    id: form.id,
    name: form.name,
    fieldState: getFormFieldStateName(form.name),
    onChangeFields: Object.entries(formDefinition.elements).reduce<string[]>((fields, [key, value]) => {
      if ('props' in value && 'label' in value.props) {
        fields.push(key);
      }
      return fields;
    }, []),
    onValidationFields: Object.entries(formDefinition.elements).reduce<{
      [field: string]: FieldValidationConfiguration[];
    }>((validationFields, [elementName, elementConfig]) => {
      const updatedValidationFields = validationFields;

      if ('validations' in elementConfig && elementConfig.validations) {
        updatedValidationFields[elementName] = elementConfig.validations.map((validation) => {
          const updatedValidation = validation;
          delete updatedValidation.immutable;
          return updatedValidation;
        });
      }

      return updatedValidationFields;
    }, {}),
    errorStateFields: [],
  };
};
