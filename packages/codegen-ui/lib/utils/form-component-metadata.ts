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
} from '../types';

export const getFormFieldStateName = (formName: string) => {
  return [formName.charAt(0).toLowerCase() + formName.slice(1), 'Fields'].join('');
};

/**
 * @returns true if string contains special characters except for "." , "_" and 0-9
 */
export const isValidVariableName = (input: string): boolean => /^[a-zA-Z_$][a-zA-Z_$0-9]*$/g.test(input);

export const filterFieldName = (input: string): string => input.split('.')[0].replaceAll(/[^a-zA-Z_$]/g, '');

function elementIsInput(element: FormDefinitionElement): element is FormDefinitionInputElement {
  return element.componentType !== 'Text' && element.componentType !== 'Divider' && element.componentType !== 'Heading';
}

// create mapping for field name collisions
export function generateUniqueFieldName(name: string, sanitizedFieldNames: Set<string>) {
  let sanitizedFieldName = isValidVariableName(name) ? name : filterFieldName(name);
  let count = 1;
  if (sanitizedFieldNames.has(sanitizedFieldName.toLowerCase()) && !name.includes('.')) {
    let prospectiveNewName = sanitizedFieldName + count;
    while (sanitizedFieldNames.has(prospectiveNewName.toLowerCase())) {
      count += 1;
      prospectiveNewName = sanitizedFieldName + count;
    }
    sanitizedFieldName = prospectiveNewName;
  }
  sanitizedFieldNames.add(sanitizedFieldName.toLowerCase());
  return sanitizedFieldName !== name.split('.')[0] && sanitizedFieldName;
}

export const mapFormMetadata = (form: StudioForm, formDefinition: FormDefinition): FormMetadata => {
  const inputElementEntries = Object.entries(formDefinition.elements).filter(([, element]) => elementIsInput(element));
  const sanitizedFieldNames = new Set<string>();
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
        isArray: 'isArray' in config && config.isArray,
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

      const sanitizedFieldName = generateUniqueFieldName(name, sanitizedFieldNames);
      if (sanitizedFieldName) {
        metadata.sanitizedFieldName = sanitizedFieldName;
      }

      updatedConfigs[name] = metadata;
      return updatedConfigs;
    }, {}),
  };
};
