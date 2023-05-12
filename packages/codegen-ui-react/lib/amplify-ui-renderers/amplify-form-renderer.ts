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
import { StorageManagerProps } from '@aws-amplify/ui-react-storage';
import { HTMLProps } from 'react';
import { Primitive } from '../primitive';
import CustomComponentRenderer from './customComponent';
import FormRenderer from './form';
import { ReactComponentRenderer } from '../react-component-renderer';
import { ReactFormTemplateRenderer } from '../forms';

export class AmplifyFormRenderer extends ReactFormTemplateRenderer {
  renderJsx(
    formComponent: StudioComponent | StudioComponentChild,
    parent?: StudioNode,
  ): JsxElement | JsxFragment | JsxSelfClosingElement {
    const node = new StudioNode(formComponent, parent);
    const renderChildren = (children: StudioComponentChild[]) => children.map((child) => this.renderJsx(child, node));

    // add Primitive in alphabetical order
    switch (formComponent.componentType) {
      case Primitive.Alert:
        return new ReactComponentRenderer<AlertProps>(
          formComponent,
          this.componentMetadata,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.Badge:
        return new ReactComponentRenderer<BadgeProps>(
          formComponent,
          this.componentMetadata,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.Button:
        return new ReactComponentRenderer<ButtonProps>(
          formComponent,
          this.componentMetadata,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.ButtonGroup:
        return new ReactComponentRenderer<ButtonGroupProps>(
          formComponent,
          this.componentMetadata,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.Card:
        return new ReactComponentRenderer<CardProps>(
          formComponent,
          this.componentMetadata,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.CheckboxField:
        return new ReactComponentRenderer<CheckboxFieldProps>(
          formComponent,
          this.componentMetadata,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case 'form':
        return new FormRenderer(
          formComponent,
          // this component is the current form
          this.component,
          this.componentMetadata,
          this.importCollection,
          this.renderConfig,
          parent,
        ).renderElement(renderChildren);

      case 'option':
        return new ReactComponentRenderer<HTMLProps<HTMLOptionElement>>(
          formComponent,
          this.componentMetadata,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.Divider:
        return new ReactComponentRenderer<DividerProps>(
          formComponent,
          this.componentMetadata,
          this.importCollection,
          parent,
        ).renderElement();

      case Primitive.Expander:
        return new ReactComponentRenderer<ExpanderProps>(
          formComponent,
          this.componentMetadata,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.ExpanderItem:
        return new ReactComponentRenderer<ExpanderItemProps>(
          formComponent,
          this.componentMetadata,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.Flex:
        return new ReactComponentRenderer<FlexProps>(
          formComponent,
          this.componentMetadata,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.Grid:
        if (!parent) {
          return new FormRenderer(
            formComponent,
            // this component is the current form
            this.component,
            this.componentMetadata,
            this.importCollection,
            this.renderConfig,
            parent,
          ).renderElement(renderChildren);
        }
        return new ReactComponentRenderer<GridProps>(
          formComponent,
          this.componentMetadata,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.Heading:
        return new ReactComponentRenderer<HeadingProps>(
          formComponent,
          this.componentMetadata,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.Icon:
        return new ReactComponentRenderer<IconProps>(
          formComponent,
          this.componentMetadata,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.Image:
        return new ReactComponentRenderer<ImageProps>(
          formComponent,
          this.componentMetadata,
          this.importCollection,
          parent,
        ).renderElement();

      case Primitive.Link:
        return new ReactComponentRenderer<LinkProps>(
          formComponent,
          this.componentMetadata,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.Loader:
        return new ReactComponentRenderer<LoaderProps>(
          formComponent,
          this.componentMetadata,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.MenuButton:
        return new ReactComponentRenderer<ButtonProps>(
          formComponent,
          this.componentMetadata,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.MenuItem:
        return new ReactComponentRenderer<MenuItemProps>(
          formComponent,
          this.componentMetadata,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.Menu:
        return new ReactComponentRenderer<MenuProps>(
          formComponent,
          this.componentMetadata,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.Pagination:
        return new ReactComponentRenderer<PaginationProps>(
          formComponent,
          this.componentMetadata,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.PasswordField:
        return new ReactComponentRenderer<PasswordFieldProps>(
          formComponent,
          this.componentMetadata,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.PhoneNumberField:
        return new ReactComponentRenderer<PhoneNumberFieldProps>(
          formComponent,
          this.componentMetadata,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.Placeholder:
        return new ReactComponentRenderer<PlaceholderProps>(
          formComponent,
          this.componentMetadata,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.Radio:
        return new ReactComponentRenderer<RadioProps>(
          formComponent,
          this.componentMetadata,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.RadioGroupField:
        return new ReactComponentRenderer<RadioGroupFieldProps>(
          formComponent,
          this.componentMetadata,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.Rating:
        return new ReactComponentRenderer<RatingProps>(
          formComponent,
          this.componentMetadata,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.ScrollView:
        return new ReactComponentRenderer<ScrollViewProps>(
          formComponent,
          this.componentMetadata,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.SearchField:
        return new ReactComponentRenderer<SearchFieldProps>(
          formComponent,
          this.componentMetadata,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.SelectField:
        return new ReactComponentRenderer<SelectFieldProps>(
          formComponent,
          this.componentMetadata,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.SliderField:
        return new ReactComponentRenderer<SliderFieldProps>(
          formComponent,
          this.componentMetadata,
          this.importCollection,
          parent,
        ).renderElement();

      case Primitive.StepperField:
        return new ReactComponentRenderer<StepperFieldProps>(
          formComponent,
          this.componentMetadata,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.SwitchField:
        return new ReactComponentRenderer<SwitchFieldProps>(
          formComponent,
          this.componentMetadata,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case 'StorageField':
        return new ReactComponentRenderer<StorageManagerProps>(
          formComponent,
          this.componentMetadata,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.TabItem:
        return new ReactComponentRenderer<TabItemProps>(
          formComponent,
          this.componentMetadata,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.Tabs:
        return new ReactComponentRenderer<TabsProps>(
          formComponent,
          this.componentMetadata,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.Table:
        return new ReactComponentRenderer<TableProps>(
          formComponent,
          this.componentMetadata,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.TableBody:
        return new ReactComponentRenderer<TableBodyProps>(
          formComponent,
          this.componentMetadata,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.TableCell:
        return new ReactComponentRenderer<TableCellProps>(
          formComponent,
          this.componentMetadata,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.TableFoot:
        return new ReactComponentRenderer<TableFootProps>(
          formComponent,
          this.componentMetadata,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.TableHead:
        return new ReactComponentRenderer<TableHeadProps>(
          formComponent,
          this.componentMetadata,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.TableRow:
        return new ReactComponentRenderer<TableRowProps>(
          formComponent,
          this.componentMetadata,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.Text:
        return new ReactComponentRenderer<TextProps>(
          formComponent,
          this.componentMetadata,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.TextAreaField:
        return new ReactComponentRenderer<TextAreaFieldProps>(
          formComponent,
          this.componentMetadata,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.TextField:
        return new ReactComponentRenderer<TextFieldProps>(
          formComponent,
          this.componentMetadata,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.ToggleButton:
        return new ReactComponentRenderer<ToggleButtonProps>(
          formComponent,
          this.componentMetadata,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.ToggleButtonGroup:
        return new ReactComponentRenderer<ToggleButtonGroupProps>(
          formComponent,
          this.componentMetadata,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.View:
        return new ReactComponentRenderer<ViewProps>(
          formComponent,
          this.componentMetadata,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.VisuallyHidden:
        return new ReactComponentRenderer<VisuallyHiddenProps>(
          formComponent,
          this.componentMetadata,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.Autocomplete:
        // TODO: after AmplifyUI implements Autocomplete, import Props type
        return new ReactComponentRenderer<any>(
          formComponent,
          this.componentMetadata,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      default:
        return new CustomComponentRenderer(
          formComponent,
          this.componentMetadata,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);
    }
  }
}
