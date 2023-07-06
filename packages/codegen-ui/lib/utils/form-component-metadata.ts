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
import { camelCase } from 'change-case';

import {
  FormDefinition,
  FormMetadata,
  FieldConfigMetadata,
  StudioForm,
  FieldValidationConfiguration,
  FormDefinitionElement,
  FormDefinitionInputElement,
} from '../types';
import { reservedWords } from './reserved-words';

export const getFormFieldStateName = (formName: string) => {
  return [formName.charAt(0).toLowerCase() + formName.slice(1), 'Fields'].join('');
};

/**
 * @returns true if string contains special characters except for "." , "_" and 0-9
 * and not a member of the resveredName set
 */
export const isValidVariableName = (input: string, reservedNames?: Set<string>): boolean => {
  const preCheck = reservedNames ? !reservedNames.has(input) : true;
  return /^[a-zA-Z_$][a-zA-Z_$0-9]*$/g.test(input) && preCheck;
};

export const formatFieldName = (input: string): string => camelCase(input.split('.')[0].replace(/[^a-zA-Z_$]/g, '-'));

function elementIsInput(element: FormDefinitionElement): element is FormDefinitionInputElement {
  return element.componentType !== 'Text' && element.componentType !== 'Divider' && element.componentType !== 'Heading';
}

// create mapping for field name collisions
export function generateUniqueFieldName(name: string, sanitizedFieldNames: Set<string>) {
  let sanitizedFieldName = isValidVariableName(name, sanitizedFieldNames) ? name : formatFieldName(name);
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
  const sanitizedFieldNames = new Set<string>(reservedWords);
  return {
    id: form.id,
    name: form.name,
    formActionType: form.formActionType,
    dataType: form.dataType,
    layoutConfigs: formDefinition.form.layoutStyle,
    labelDecorator: formDefinition.form.labelDecorator,
    fieldConfigs: Object.entries(formDefinition.elements).reduce<Record<string, FieldConfigMetadata>>(
      (configs, [name, element]) => {
        if (!elementIsInput(element)) {
          return configs;
        }

        const updatedConfigs = configs;
        const metadata: FieldConfigMetadata = {
          validationRules: [],
          componentType: element.componentType,
          studioFormComponentType: 'studioFormComponentType' in element ? element.studioFormComponentType : undefined,
          isArray: element.isArray,
          dataType: element.dataType,
          relationship: element.relationship,
        };
        if ('validations' in element && element.validations) {
          metadata.validationRules = element.validations.map<FieldValidationConfiguration>((validation) => {
            const updatedValidation = validation;
            delete updatedValidation.immutable;
            return updatedValidation;
          });
        }

        if ('valueMappings' in element) {
          metadata.valueMappings = element.valueMappings;
        }

        // we add the name of the model as a resvered word
        if (form.dataType.dataSourceType === 'DataStore') {
          sanitizedFieldNames.add(form.dataType.dataTypeName);
        }
        const sanitizedFieldName = generateUniqueFieldName(name, sanitizedFieldNames);
        if (sanitizedFieldName) {
          metadata.sanitizedFieldName = sanitizedFieldName;
        }

        updatedConfigs[name] = metadata;
        return updatedConfigs;
      },
      {},
    ),
  };
};
