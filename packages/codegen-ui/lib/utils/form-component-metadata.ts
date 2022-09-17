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
import {
  FormDefinition,
  FormMetadata,
  FieldConfigMetadata,
  StudioForm,
  FieldValidationConfiguration,
  FormDefinitionElement,
  FormDefinitionInputElement,
  StudioFieldInputConfig,
  GenericDataSchema,
} from '../types';

export const getFormFieldStateName = (formName: string) => {
  return [formName.charAt(0).toLowerCase() + formName.slice(1), 'Fields'].join('');
};

function elementIsInput(element: FormDefinitionElement): element is FormDefinitionInputElement {
  return element.componentType !== 'Text' && element.componentType !== 'Divider' && element.componentType !== 'Heading';
}

export const mapFormMetadata = (
  form: StudioForm,
  formDefinition: FormDefinition,
  dataSchema?: GenericDataSchema | undefined,
): FormMetadata => {
  const inputElementEntries = Object.entries(formDefinition.elements).filter(([, element]) => elementIsInput(element));
  return {
    id: form.id,
    name: form.name,
    formActionType: form.formActionType,
    layoutConfigs: {
      ...formDefinition.form.layoutStyle,
    },
    fieldConfigs: inputElementEntries.reduce<Record<string, FieldConfigMetadata>>((configs, [name, config]) => {
      const updatedConfigs = configs;
      const metadata: FieldConfigMetadata = {
        validationRules: [],
        componentType: config.componentType,
      };
      if ('validations' in config && config.validations) {
        metadata.validationRules = config.validations.map<FieldValidationConfiguration>((validation) => {
          const updatedValidation = validation;
          delete updatedValidation.immutable;
          return updatedValidation;
        });
      }
      if ('dataType' in config && config.dataType) {
        metadata.dataType = config.dataType;
      }
      if (form.dataType.dataSourceType === 'DataStore' && dataSchema) {
        const modelFields = dataSchema.models[form.dataType.dataTypeName].fields;
        metadata.isArray = modelFields[name]?.isArray;
      }
      if (form.fields[name] && 'inputType' in form.fields[name]) {
        const { inputType } = form.fields[name] as { inputType: StudioFieldInputConfig };
        if (inputType.isArray) {
          metadata.isArray = inputType.isArray;
        }
      }
      updatedConfigs[name] = metadata;
      return updatedConfigs;
    }, {}),
  };
};
