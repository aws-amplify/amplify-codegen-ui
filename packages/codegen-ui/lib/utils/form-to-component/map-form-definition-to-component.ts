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
  StudioComponentProperties,
} from '../../types';
import { mapElementChildren } from './helpers/map-element-children';
import { ctaButtonMapper, addCTAPosition } from './helpers/map-cta-buttons';

const mapFormElementProps = (element: FormDefinitionElement) => {
  const props: StudioComponentProperties = {};
  Object.entries(element.props).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      props[key] = { value: JSON.stringify(value), type: 'object' };
    } else {
      props[key] = { value: `${value}`, type: `${typeof value}` };
    }
  });
  return props;
};

/**
 * will wrap the studio component children in a row grid
 */
export const wrapInRowGrid = (
  idx: number,
  rowLength: number,
  children: StudioComponentChild[],
): StudioComponentChild[] => {
  return [
    {
      name: `RowGrid${idx}`,
      componentType: 'Grid',
      properties: {
        columnGap: { value: 'inherit' },
        rowGap: { value: 'inherit' },
        templateColumns: { value: `repeat(${rowLength}, auto)` },
      },
      children,
    },
  ];
};

const getFormElementChildren = (formDefinition: FormDefinition): StudioComponentChild[] =>
  formDefinition.elementMatrix.reduce<StudioComponentChild[]>(
    (acc: StudioComponentChild[], row: string[], rowIdx: number) => {
      const children = row.map<StudioComponentChild>((column) => {
        const element: FormDefinitionElement = formDefinition.elements[column];
        return {
          name: column,
          componentType: element.componentType,
          properties: mapFormElementProps(element),
          children: mapElementChildren(column, element).children,
        };
      });
      // if we have more than one element in a row we create a rowGrid to display the columns for those children
      acc.push(...(row.length > 1 ? wrapInRowGrid(rowIdx, row.length, children) : children));
      return acc;
    },
    [],
  );

export const mapFormDefinitionToComponent = (name: string, formDefinition: FormDefinition) => {
  const ctaComponent = ctaButtonMapper(formDefinition);

  const formChildren = addCTAPosition(
    getFormElementChildren(formDefinition),
    formDefinition.buttons.position,
    ctaComponent,
  );

  const component: StudioComponent = {
    name,
    componentType: 'Grid',
    properties: {
      as: { value: 'form' },
    },
    bindingProperties: {
      onCancel: { type: 'Event' },
    },
    events: {},
    children: formChildren,
  };

  return component;
};
