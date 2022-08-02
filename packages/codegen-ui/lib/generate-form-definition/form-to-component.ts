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
  StudioComponent,
  StudioComponentChild,
  FormDefinition,
  FormDefinitionElement,
  FormStyleConfig,
  StudioComponentProperties,
  StudioFormStyle,
} from '../types';
import { FORM_DEFINITION_DEFAULTS } from './helpers/defaults';

const getStyleResolvedValue = (config?: FormStyleConfig): string | undefined => {
  return config?.value ?? config?.tokenReference;
};

export const resolveStyles = (
  style: StudioFormStyle,
): Record<keyof Omit<StudioFormStyle, 'alignment'>, string | undefined> => {
  return {
    verticalGap: getStyleResolvedValue(style.verticalGap),
    horizontalGap: getStyleResolvedValue(style.horizontalGap),
    outerPadding: getStyleResolvedValue(style.outerPadding),
  };
};

export const parentGrid = (
  name: string,
  style: StudioFormStyle,
  children: StudioComponentChild[],
): StudioComponentChild => {
  const { verticalGap, horizontalGap } = resolveStyles(style);
  return {
    name,
    componentType: 'Grid',
    properties: {
      ...(horizontalGap && { columnGap: { value: horizontalGap } }),
      ...(verticalGap && { rowGap: { value: verticalGap } }),
    },
    children,
  };
};

const mapFieldElementProps = (element: FormDefinitionElement) => {
  const props: StudioComponentProperties = {};
  Object.entries(element.props).forEach(([key, value]) => {
    props[key] = { value: `${value}`, type: `${typeof value}` };
  });
  return props;
};

export const fieldComponentMapper = (name: string, formDefinition: FormDefinition): StudioComponentChild => {
  // will accept a field matrix from a defnition and map
  const fieldChildren = formDefinition.elementMatrix.map<StudioComponentChild>((row: string[], rowIdx: number) => {
    return {
      name: `RowGrid${rowIdx}`,
      componentType: 'Grid',
      properties: {
        columnGap: { value: 'inherit' },
        rowGap: { value: 'inherit' },
        ...(row.length > 0 && {
          templateColumns: { value: `repeat(${row.length}, auto)` },
        }),
      },
      children: row.map<StudioComponentChild>((column) => {
        const element: FormDefinitionElement = formDefinition.elements[column];
        return {
          name: column,
          componentType: element.componentType,
          properties: mapFieldElementProps(element),
        };
      }),
    };
  });
  return parentGrid(`${name}Grid`, formDefinition.form.layoutStyle, fieldChildren);
};

const resolveCtaLabels = (
  formDefinition: FormDefinition,
): { cancelLabel: string; clearLabel: string; submitLabel: string } => {
  const cancelLabel = formDefinition.buttons?.cancel?.label || FORM_DEFINITION_DEFAULTS.ctaConfig.cancel.label;
  const clearLabel = formDefinition.buttons?.clear?.label || FORM_DEFINITION_DEFAULTS.ctaConfig.clear.label;
  const submitLabel = formDefinition.buttons?.submit?.label || FORM_DEFINITION_DEFAULTS.ctaConfig.submit.label;

  return { cancelLabel, clearLabel, submitLabel };
};

export const ctaButtonConfig = (formDefinition: FormDefinition): StudioComponentChild => {
  const { cancelLabel, clearLabel, submitLabel } = resolveCtaLabels(formDefinition);

  return {
    name: 'CTAFlex',
    componentType: 'Flex',
    properties: {
      justifyContent: {
        value: 'space-between',
      },
      marginTop: {
        value: '1rem',
      },
    },
    children: [
      {
        componentType: 'Button',
        name: 'CancelButton',
        properties: {
          label: {
            value: cancelLabel,
          },
          type: {
            value: 'button',
          },
        },
      },
      {
        componentType: 'Flex',
        name: 'SubmitAndResetFlex',
        properties: {},
        children: [
          {
            componentType: 'Button',
            name: 'ClearButton',
            properties: {
              label: {
                value: clearLabel,
              },
              type: {
                value: 'reset',
              },
            },
          },
          {
            componentType: 'Button',
            name: 'SubmitButton',
            properties: {
              label: {
                value: submitLabel,
              },
              type: {
                value: 'submit',
              },
              variation: {
                value: 'primary',
              },
            },
          },
        ],
      },
    ],
  };
};

export const mapFormDefinitionToComponent = (name: string, formDefinition: FormDefinition) => {
  const component: StudioComponent = {
    name,
    componentType: 'form',
    properties: {},
    bindingProperties: {
      onCancel: { type: 'Event' },
    },
    events: {},
    children: [fieldComponentMapper(name, formDefinition), ctaButtonConfig(formDefinition)],
  };
  return component;
};
