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
  TextFieldProps,
  ToggleButtonProps,
  ToggleButtonGroupProps,
  ViewProps,
  VisuallyHiddenProps,
  TextProps,
} from '@aws-amplify/ui-react';
import Primitive, { isBuiltInIcon } from '../primitive';
import { iconsetPascalNameMapping } from '../iconset';
import { ReactStudioTemplateRenderer } from '../react-studio-template-renderer';
import CustomComponentRenderer from './customComponent';
import CollectionRenderer from './collection';
import { ReactComponentWithChildrenRenderer } from '../react-component-with-children-renderer';
import { ReactComponentRenderer } from '../react-component-renderer';

export class AmplifyRenderer extends ReactStudioTemplateRenderer {
  renderJsx(
    component: StudioComponent | StudioComponentChild,
    parent?: StudioNode,
  ): JsxElement | JsxFragment | JsxSelfClosingElement {
    const node = new StudioNode(component, parent);
    const renderChildren = (children: StudioComponentChild[]) => children.map((child) => this.renderJsx(child, node));

    if (isBuiltInIcon(component.componentType)) {
      const { componentType } = component;

      // need to reassign param so object equality comparison works when finding override index
      // eslint-disable-next-line no-param-reassign
      component.componentType = iconsetPascalNameMapping.get(component.componentType) || component.componentType;

      const renderedComponent = new ReactComponentWithChildrenRenderer<IconProps>(
        component,
        this.stateReferences,
        this.importCollection,
        parent,
      ).renderElement(renderChildren);

      // return componentType to original value
      // eslint-disable-next-line no-param-reassign
      component.componentType = componentType;

      return renderedComponent;
    }

    // add Primitive in alphabetical order
    switch (component.componentType) {
      case Primitive.Alert:
        return new ReactComponentWithChildrenRenderer<AlertProps>(
          component,
          this.stateReferences,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.Badge:
        return new ReactComponentWithChildrenRenderer<BadgeProps>(
          component,
          this.stateReferences,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.Button:
        return new ReactComponentWithChildrenRenderer<ButtonProps>(
          component,
          this.stateReferences,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.ButtonGroup:
        return new ReactComponentWithChildrenRenderer<ButtonGroupProps>(
          component,
          this.stateReferences,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.Card:
        return new ReactComponentWithChildrenRenderer<CardProps>(
          component,
          this.stateReferences,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.CheckboxField:
        return new ReactComponentWithChildrenRenderer<CheckboxFieldProps>(
          component,
          this.stateReferences,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.Collection:
        return new CollectionRenderer(component, this.stateReferences, this.importCollection, parent).renderElement(
          renderChildren,
        );

      case Primitive.Divider:
        return new ReactComponentRenderer<DividerProps>(
          component,
          this.stateReferences,
          this.importCollection,
          parent,
        ).renderElement();

      case Primitive.Expander:
        return new ReactComponentWithChildrenRenderer<ExpanderProps>(
          component,
          this.stateReferences,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.ExpanderItem:
        return new ReactComponentWithChildrenRenderer<ExpanderItemProps>(
          component,
          this.stateReferences,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.Flex:
        return new ReactComponentWithChildrenRenderer<FlexProps>(
          component,
          this.stateReferences,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.Grid:
        return new ReactComponentWithChildrenRenderer<GridProps>(
          component,
          this.stateReferences,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.Heading:
        return new ReactComponentWithChildrenRenderer<HeadingProps>(
          component,
          this.stateReferences,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.Icon:
        return new ReactComponentWithChildrenRenderer<IconProps>(
          component,
          this.stateReferences,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.Image:
        return new ReactComponentRenderer<ImageProps>(
          component,
          this.stateReferences,
          this.importCollection,
          parent,
        ).renderElement();

      case Primitive.Link:
        return new ReactComponentWithChildrenRenderer<LinkProps>(
          component,
          this.stateReferences,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.Loader:
        return new ReactComponentWithChildrenRenderer<LoaderProps>(
          component,
          this.stateReferences,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.MenuButton:
        return new ReactComponentWithChildrenRenderer<ButtonProps>(
          component,
          this.stateReferences,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.MenuItem:
        return new ReactComponentWithChildrenRenderer<MenuItemProps>(
          component,
          this.stateReferences,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.Menu:
        return new ReactComponentWithChildrenRenderer<MenuProps>(
          component,
          this.stateReferences,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.Pagination:
        return new ReactComponentWithChildrenRenderer<PaginationProps>(
          component,
          this.stateReferences,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.PasswordField:
        return new ReactComponentWithChildrenRenderer<PasswordFieldProps>(
          component,
          this.stateReferences,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.PhoneNumberField:
        return new ReactComponentWithChildrenRenderer<PhoneNumberFieldProps>(
          component,
          this.stateReferences,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.Placeholder:
        return new ReactComponentWithChildrenRenderer<PlaceholderProps>(
          component,
          this.stateReferences,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.Radio:
        return new ReactComponentWithChildrenRenderer<RadioProps>(
          component,
          this.stateReferences,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.RadioGroupField:
        return new ReactComponentWithChildrenRenderer<RadioGroupFieldProps>(
          component,
          this.stateReferences,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.Rating:
        return new ReactComponentWithChildrenRenderer<RatingProps>(
          component,
          this.stateReferences,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.ScrollView:
        return new ReactComponentWithChildrenRenderer<ScrollViewProps>(
          component,
          this.stateReferences,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.SearchField:
        return new ReactComponentWithChildrenRenderer<SearchFieldProps>(
          component,
          this.stateReferences,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.SelectField:
        return new ReactComponentWithChildrenRenderer<SelectFieldProps>(
          component,
          this.stateReferences,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.SliderField:
        return new ReactComponentRenderer<SliderFieldProps>(
          component,
          this.stateReferences,
          this.importCollection,
          parent,
        ).renderElement();

      case Primitive.StepperField:
        return new ReactComponentWithChildrenRenderer<StepperFieldProps>(
          component,
          this.stateReferences,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.SwitchField:
        return new ReactComponentWithChildrenRenderer<SwitchFieldProps>(
          component,
          this.stateReferences,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.TabItem:
        return new ReactComponentWithChildrenRenderer<TabItemProps>(
          component,
          this.stateReferences,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.Tabs:
        return new ReactComponentWithChildrenRenderer<TabsProps>(
          component,
          this.stateReferences,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.Table:
        return new ReactComponentWithChildrenRenderer<TableProps>(
          component,
          this.stateReferences,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.TableBody:
        return new ReactComponentWithChildrenRenderer<TableBodyProps>(
          component,
          this.stateReferences,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.TableCell:
        return new ReactComponentWithChildrenRenderer<TableCellProps>(
          component,
          this.stateReferences,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.TableFoot:
        return new ReactComponentWithChildrenRenderer<TableFootProps>(
          component,
          this.stateReferences,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.TableHead:
        return new ReactComponentWithChildrenRenderer<TableHeadProps>(
          component,
          this.stateReferences,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.TableRow:
        return new ReactComponentWithChildrenRenderer<TableRowProps>(
          component,
          this.stateReferences,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.Text:
        return new ReactComponentWithChildrenRenderer<TextProps>(
          component,
          this.stateReferences,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.TextField:
        return new ReactComponentWithChildrenRenderer<TextFieldProps<boolean>>(
          component,
          this.stateReferences,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.ToggleButton:
        return new ReactComponentWithChildrenRenderer<ToggleButtonProps>(
          component,
          this.stateReferences,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.ToggleButtonGroup:
        return new ReactComponentWithChildrenRenderer<ToggleButtonGroupProps>(
          component,
          this.stateReferences,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.View:
        return new ReactComponentWithChildrenRenderer<ViewProps>(
          component,
          this.stateReferences,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.VisuallyHidden:
        return new ReactComponentWithChildrenRenderer<VisuallyHiddenProps>(
          component,
          this.stateReferences,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      default:
        return new CustomComponentRenderer(
          component,
          this.stateReferences,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);
    }
  }
}
