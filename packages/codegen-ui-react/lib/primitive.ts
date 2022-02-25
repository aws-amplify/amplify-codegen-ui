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
import { factory, SyntaxKind, TypeParameterDeclaration, TypeNode } from 'typescript';
import iconset from './iconset';

enum Primitive {
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
  TextField = 'TextField',
  ToggleButton = 'ToggleButton',
  ToggleButtonGroup = 'ToggleButtonGroup',
  View = 'View',
  VisuallyHidden = 'VisuallyHidden',
}

export default Primitive;

export function isPrimitive(componentType: string): boolean {
  return Object.values(Primitive).includes(componentType as Primitive);
}

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

export function isBuiltInIcon(componentType: string): boolean {
  return iconset.has(componentType);
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
  Primitive.TextField,
]);
