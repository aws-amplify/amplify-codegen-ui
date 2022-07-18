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
      children: row.map<StudioComponentChild>((column, colIdx) => {
        const element: FormDefinitionElement = formDefinition.elements[column];
        return {
          name: `${element.componentType}${colIdx}`,
          componentType: element.componentType,
          properties: mapFieldElementProps(element),
        };
      }),
    };
  });
  return parentGrid(`${name}Grid`, formDefinition.form.layoutStyle, fieldChildren);
};

export const ctaButtonConfig = (): StudioComponentChild => {
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
            value: 'Cancel',
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
                value: 'Clear',
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
                value: 'Submit',
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
    // TODO: change cta button config based on formDefinition cta layout
    children: [fieldComponentMapper(name, formDefinition), ctaButtonConfig()],
  };
  return component;
};
