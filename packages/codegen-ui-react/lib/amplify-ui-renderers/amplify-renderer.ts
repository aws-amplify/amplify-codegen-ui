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
import { StudioNode, StudioComponent, StudioComponentChild } from '@aws-amplify/codegen-ui';
import { JsxElement, JsxFragment, JsxSelfClosingElement } from 'typescript';
// add primitives in alphabetical order
import {
  AlertProps,
  BadgeProps,
  ButtonProps,
  ButtonGroupProps,
  CardProps,
  CheckboxFieldProps,
  DividerProps,
  ExpanderProps,
  ExpanderItemProps,
  FlexProps,
  GridProps,
  HeadingProps,
  IconProps,
  ImageProps,
  LinkProps,
  LoaderProps,
  MenuItemProps,
  MenuProps,
  PaginationProps,
  PasswordFieldProps,
  PhoneNumberFieldProps,
  PlaceholderProps,
  RadioProps,
  RadioGroupFieldProps,
  RatingProps,
  ScrollViewProps,
  SearchFieldProps,
  SelectFieldProps,
  SliderFieldProps,
  StepperFieldProps,
  SwitchFieldProps,
  TabItemProps,
  TabsProps,
  TableCellProps,
  TableBodyProps,
  TableFootProps,
  TableHeadProps,
  TableProps,
  TableRowProps,
  TextAreaFieldProps,
  TextFieldProps,
  ToggleButtonProps,
  ToggleButtonGroupProps,
  ViewProps,
  VisuallyHiddenProps,
  TextProps,
} from '@aws-amplify/ui-react';
import { Primitive } from '../primitive';
import { ReactStudioTemplateRenderer } from '../react-studio-template-renderer';
import CustomComponentRenderer from './customComponent';
import CollectionRenderer from './collection';
import { ReactComponentRenderer } from '../react-component-renderer';

export class AmplifyRenderer extends ReactStudioTemplateRenderer {
  renderJsx(
    component: StudioComponent | StudioComponentChild,
    parent?: StudioNode,
  ): JsxElement | JsxFragment | JsxSelfClosingElement {
    const node = new StudioNode(component, parent);
    const renderChildren = (children: StudioComponentChild[]) => children.map((child) => this.renderJsx(child, node));

    // add Primitive in alphabetical order
    switch (component.componentType) {
      case Primitive.Alert:
        return new ReactComponentRenderer<AlertProps>(
          component,
          this.componentMetadata,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.Badge:
        return new ReactComponentRenderer<BadgeProps>(
          component,
          this.componentMetadata,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.Button:
        return new ReactComponentRenderer<ButtonProps>(
          component,
          this.componentMetadata,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.ButtonGroup:
        return new ReactComponentRenderer<ButtonGroupProps>(
          component,
          this.componentMetadata,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.Card:
        return new ReactComponentRenderer<CardProps>(
          component,
          this.componentMetadata,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.CheckboxField:
        return new ReactComponentRenderer<CheckboxFieldProps>(
          component,
          this.componentMetadata,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.Collection:
        return new CollectionRenderer(
          component,
          this.componentMetadata,
          this.importCollection,
          this.renderConfig,
          parent,
        ).renderElement(renderChildren);

      case Primitive.Divider:
        return new ReactComponentRenderer<DividerProps>(
          component,
          this.componentMetadata,
          this.importCollection,
          parent,
        ).renderElement();

      case Primitive.Expander:
        return new ReactComponentRenderer<ExpanderProps>(
          component,
          this.componentMetadata,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.ExpanderItem:
        return new ReactComponentRenderer<ExpanderItemProps>(
          component,
          this.componentMetadata,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.Flex:
        return new ReactComponentRenderer<FlexProps>(
          component,
          this.componentMetadata,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.Grid:
        return new ReactComponentRenderer<GridProps>(
          component,
          this.componentMetadata,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.Heading:
        return new ReactComponentRenderer<HeadingProps>(
          component,
          this.componentMetadata,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.Icon:
        return new ReactComponentRenderer<IconProps>(
          component,
          this.componentMetadata,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.Image:
        return new ReactComponentRenderer<ImageProps>(
          component,
          this.componentMetadata,
          this.importCollection,
          parent,
        ).renderElement();

      case Primitive.Link:
        return new ReactComponentRenderer<LinkProps>(
          component,
          this.componentMetadata,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.Loader:
        return new ReactComponentRenderer<LoaderProps>(
          component,
          this.componentMetadata,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.MenuButton:
        return new ReactComponentRenderer<ButtonProps>(
          component,
          this.componentMetadata,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.MenuItem:
        return new ReactComponentRenderer<MenuItemProps>(
          component,
          this.componentMetadata,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.Menu:
        return new ReactComponentRenderer<MenuProps>(
          component,
          this.componentMetadata,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.Pagination:
        return new ReactComponentRenderer<PaginationProps>(
          component,
          this.componentMetadata,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.PasswordField:
        return new ReactComponentRenderer<PasswordFieldProps>(
          component,
          this.componentMetadata,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.PhoneNumberField:
        return new ReactComponentRenderer<PhoneNumberFieldProps>(
          component,
          this.componentMetadata,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.Placeholder:
        return new ReactComponentRenderer<PlaceholderProps>(
          component,
          this.componentMetadata,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.Radio:
        return new ReactComponentRenderer<RadioProps>(
          component,
          this.componentMetadata,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.RadioGroupField:
        return new ReactComponentRenderer<RadioGroupFieldProps>(
          component,
          this.componentMetadata,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.Rating:
        return new ReactComponentRenderer<RatingProps>(
          component,
          this.componentMetadata,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.ScrollView:
        return new ReactComponentRenderer<ScrollViewProps>(
          component,
          this.componentMetadata,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.SearchField:
        return new ReactComponentRenderer<SearchFieldProps>(
          component,
          this.componentMetadata,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.SelectField:
        return new ReactComponentRenderer<SelectFieldProps>(
          component,
          this.componentMetadata,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.SliderField:
        return new ReactComponentRenderer<SliderFieldProps>(
          component,
          this.componentMetadata,
          this.importCollection,
          parent,
        ).renderElement();

      case Primitive.StepperField:
        return new ReactComponentRenderer<StepperFieldProps>(
          component,
          this.componentMetadata,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.SwitchField:
        return new ReactComponentRenderer<SwitchFieldProps>(
          component,
          this.componentMetadata,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.TabItem:
        return new ReactComponentRenderer<TabItemProps>(
          component,
          this.componentMetadata,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.Tabs:
        return new ReactComponentRenderer<TabsProps>(
          component,
          this.componentMetadata,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.Table:
        return new ReactComponentRenderer<TableProps>(
          component,
          this.componentMetadata,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.TableBody:
        return new ReactComponentRenderer<TableBodyProps>(
          component,
          this.componentMetadata,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.TableCell:
        return new ReactComponentRenderer<TableCellProps>(
          component,
          this.componentMetadata,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.TableFoot:
        return new ReactComponentRenderer<TableFootProps>(
          component,
          this.componentMetadata,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.TableHead:
        return new ReactComponentRenderer<TableHeadProps>(
          component,
          this.componentMetadata,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.TableRow:
        return new ReactComponentRenderer<TableRowProps>(
          component,
          this.componentMetadata,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.Text:
        return new ReactComponentRenderer<TextProps>(
          component,
          this.componentMetadata,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.TextAreaField:
        return new ReactComponentRenderer<TextAreaFieldProps>(
          component,
          this.componentMetadata,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.TextField:
        return new ReactComponentRenderer<TextFieldProps>(
          component,
          this.componentMetadata,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.ToggleButton:
        return new ReactComponentRenderer<ToggleButtonProps>(
          component,
          this.componentMetadata,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.ToggleButtonGroup:
        return new ReactComponentRenderer<ToggleButtonGroupProps>(
          component,
          this.componentMetadata,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.View:
        return new ReactComponentRenderer<ViewProps>(
          component,
          this.componentMetadata,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.VisuallyHidden:
        return new ReactComponentRenderer<VisuallyHiddenProps>(
          component,
          this.componentMetadata,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      default:
        return new CustomComponentRenderer(
          component,
          this.componentMetadata,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);
    }
  }
}
