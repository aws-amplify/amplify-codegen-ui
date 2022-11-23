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
import { FixedStudioComponentProperty } from '@aws-amplify/codegen-ui';
import { factory, SyntaxKind, TypeParameterDeclaration, TypeNode } from 'typescript';

export type PrimitiveLevelPropConfiguration<ConfigType> = {
  [componentType: string]: { [eventType: string]: ConfigType };
};

export enum Primitive {
  Alert = 'Alert',
  Badge = 'Badge',
  Button = 'Button',
  ButtonGroup = 'ButtonGroup',
  Card = 'Card',
  CheckboxField = 'CheckboxField',
  Collection = 'Collection',
  Divider = 'Divider',
  Expander = 'Expander',
  ExpanderItem = 'ExpanderItem',
  Flex = 'Flex',
  Grid = 'Grid',
  Heading = 'Heading',
  Icon = 'Icon',
  Image = 'Image',
  Link = 'Link',
  Loader = 'Loader',
  Menu = 'Menu',
  MenuButton = 'MenuButton',
  MenuItem = 'MenuItem',
  Pagination = 'Pagination',
  PasswordField = 'PasswordField',
  PhoneNumberField = 'PhoneNumberField',
  Placeholder = 'Placeholder',
  Radio = 'Radio',
  RadioGroupField = 'RadioGroupField',
  Rating = 'Rating',
  ScrollView = 'ScrollView',
  SearchField = 'SearchField',
  SelectField = 'SelectField',
  SliderField = 'SliderField',
  StepperField = 'StepperField',
  SwitchField = 'SwitchField',
  Table = 'Table',
  TableBody = 'TableBody',
  TableCell = 'TableCell',
  TableFoot = 'TableFoot',
  TableHead = 'TableHead',
  TableRow = 'TableRow',
  Tabs = 'Tabs',
  TabItem = 'TabItem',
  Text = 'Text',
  TextAreaField = 'TextAreaField',
  TextField = 'TextField',
  ToggleButton = 'ToggleButton',
  ToggleButtonGroup = 'ToggleButtonGroup',
  View = 'View',
  VisuallyHidden = 'VisuallyHidden',
  Autocomplete = 'Autocomplete',
}

/*
 * temporary list of Primitives with a change event. Final implementation will pull from amplify UI
 */
export const PrimitivesWithChangeEvent: Set<Primitive> = new Set([
  Primitive.CheckboxField,
  Primitive.PasswordField,
  Primitive.PhoneNumberField,
  Primitive.RadioGroupField,
  Primitive.SearchField,
  Primitive.SelectField,
  Primitive.SliderField,
  Primitive.StepperField,
  Primitive.SwitchField,
  Primitive.TextAreaField,
  Primitive.TextField,
]);

export const PrimitiveChildrenPropMapping: Partial<Record<Primitive, string>> = {
  [Primitive.Alert]: 'label',
  [Primitive.Badge]: 'label',
  [Primitive.Button]: 'label',
  [Primitive.Heading]: 'label',
  [Primitive.Link]: 'label',
  [Primitive.MenuButton]: 'label',
  [Primitive.MenuItem]: 'label',
  [Primitive.Radio]: 'label',
  [Primitive.TableCell]: 'label',
  [Primitive.Text]: 'label',
  [Primitive.ToggleButton]: 'label',
};

export const PrimitiveDefaultPropertyValue: PrimitiveLevelPropConfiguration<FixedStudioComponentProperty> = {
  [Primitive.CheckboxField]: {
    checked: { value: false, type: 'boolean' },
  },
  [Primitive.PasswordField]: {
    value: { value: '', type: 'string' },
  },
  [Primitive.PhoneNumberField]: {
    value: { value: '', type: 'string' },
  },
  [Primitive.RadioGroupField]: {
    value: { value: '', type: 'string' },
  },
  [Primitive.SearchField]: {
    value: { value: '', type: 'string' },
  },
  [Primitive.SwitchField]: {
    isChecked: { value: false, type: 'boolean' },
  },
  [Primitive.TextAreaField]: {
    value: { value: '', type: 'string' },
  },
  [Primitive.TextField]: {
    value: { value: '', type: 'string' },
  },
};

export function isPrimitive(componentType: string): boolean {
  return Object.values(Primitive).includes(componentType as Primitive);
}

export const PrimitiveTypeParameter: Partial<
  Record<Primitive, { declaration: () => TypeParameterDeclaration[] | undefined; reference: () => TypeNode[] }>
> = {
  [Primitive.TextField]: {
    declaration: () => [
      factory.createTypeParameterDeclaration(
        factory.createIdentifier('Multiline'),
        factory.createKeywordTypeNode(SyntaxKind.BooleanKeyword),
        undefined,
      ),
    ],
    reference: () => [factory.createTypeReferenceNode(factory.createIdentifier('Multiline'), undefined)],
  },
  [Primitive.Collection]: {
    declaration: () => undefined,
    reference: () => [factory.createKeywordTypeNode(SyntaxKind.AnyKeyword)],
  },
};

export const PRIMITIVE_OVERRIDE_PROPS = 'PrimitiveOverrideProps';
/**
 * export declare type PrimitiveOverrideProp<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
 */
export const primitiveOverrideProp = factory.createTypeAliasDeclaration(
  undefined,
  [factory.createModifier(SyntaxKind.ExportKeyword), factory.createModifier(SyntaxKind.DeclareKeyword)],
  factory.createIdentifier(PRIMITIVE_OVERRIDE_PROPS),
  [factory.createTypeParameterDeclaration(factory.createIdentifier('T'), undefined, undefined)],
  factory.createIntersectionTypeNode([
    factory.createTypeReferenceNode(factory.createIdentifier('Partial'), [
      factory.createTypeReferenceNode(factory.createIdentifier('T'), undefined),
    ]),
    factory.createTypeReferenceNode(
      factory.createQualifiedName(factory.createIdentifier('React'), factory.createIdentifier('DOMAttributes')),
      [factory.createTypeReferenceNode(factory.createIdentifier('HTMLDivElement'), undefined)],
    ),
  ]),
);
