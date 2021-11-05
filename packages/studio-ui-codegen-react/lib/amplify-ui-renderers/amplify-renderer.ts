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
import { StudioNode, StudioComponent, StudioComponentChild } from '@amzn/studio-ui-codegen';
import { JsxElement, JsxFragment } from 'typescript';
// add primitives in alphabetical order
import {
  AlertProps,
  BadgeProps,
  ButtonProps,
  ButtonGroupProps,
  CardProps,
  CheckboxFieldProps,
  DividerProps,
  FieldGroupIconProps,
  FieldGroupIconButtonProps,
  FlexProps,
  GridProps,
  HeadingProps,
  IconProps,
  ImageProps,
  InputProps,
  LabelProps,
  LinkProps,
  LoaderProps,
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
  StepperFieldProps,
  SwitchFieldProps,
  TabsProps,
  ToggleButtonProps,
  ToggleButtonGroupProps,
  ViewProps,
  VisuallyHiddenProps,
} from '@aws-amplify/ui-react';
import Primitives from '../primitives';
import { ReactStudioTemplateRenderer } from '../react-studio-template-renderer';
import TextRenderer from './text';
import renderString from './string';
import CustomComponentRenderer from './customComponent';
import CollectionRenderer from './collection';
import { ReactComponentWithChildrenRenderer } from '../react-component-with-children-renderer';
import { ReactComponentRenderer } from '../react-component-renderer';

export class AmplifyRenderer extends ReactStudioTemplateRenderer {
  renderJsx(component: StudioComponent | StudioComponentChild, parent?: StudioNode): JsxElement | JsxFragment {
    const node = new StudioNode(component, parent);
    const renderChildren = (children: StudioComponentChild[]) => children.map((child) => this.renderJsx(child, node));

    // add primitives in alphabetical order
    switch (component.componentType) {
      case Primitives.Alert:
        return new ReactComponentWithChildrenRenderer<AlertProps>(
          component,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitives.Badge:
        return new ReactComponentWithChildrenRenderer<BadgeProps>(
          component,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitives.Button:
        return new ReactComponentWithChildrenRenderer<ButtonProps>(
          component,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitives.ButtonGroup:
        return new ReactComponentWithChildrenRenderer<ButtonGroupProps>(
          component,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitives.Card:
        return new ReactComponentWithChildrenRenderer<CardProps>(
          component,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitives.CheckboxField:
        return new ReactComponentWithChildrenRenderer<CheckboxFieldProps>(
          component,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitives.Collection:
        return new CollectionRenderer(component, this.importCollection, parent).renderElement(renderChildren);

      case Primitives.Divider:
        return new ReactComponentRenderer<DividerProps>(component, this.importCollection, parent).renderElement();

      case Primitives.FieldGroup:
        // TODO: Use correct prop type
        return new ReactComponentWithChildrenRenderer<ViewProps>(
          component,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitives.FieldGroupIcon:
        return new ReactComponentWithChildrenRenderer<FieldGroupIconProps>(
          component,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitives.FieldGroupIconButton:
        return new ReactComponentWithChildrenRenderer<FieldGroupIconButtonProps>(
          component,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitives.Flex:
        return new ReactComponentWithChildrenRenderer<FlexProps>(
          component,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitives.Grid:
        return new ReactComponentWithChildrenRenderer<GridProps>(
          component,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitives.Heading:
        return new ReactComponentWithChildrenRenderer<HeadingProps>(
          component,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitives.Icon:
        return new ReactComponentWithChildrenRenderer<IconProps>(
          component,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitives.Image:
        return new ReactComponentRenderer<ImageProps>(component, this.importCollection, parent).renderElement();

      case Primitives.Input:
        return new ReactComponentWithChildrenRenderer<InputProps>(
          component,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitives.Label:
        return new ReactComponentWithChildrenRenderer<LabelProps>(
          component,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitives.Link:
        return new ReactComponentWithChildrenRenderer<LinkProps>(
          component,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitives.Loader:
        return new ReactComponentWithChildrenRenderer<LoaderProps>(
          component,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitives.Pagination:
        return new ReactComponentWithChildrenRenderer<PaginationProps>(
          component,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitives.PasswordField:
        return new ReactComponentWithChildrenRenderer<PasswordFieldProps>(
          component,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitives.PhoneNumberField:
        return new ReactComponentWithChildrenRenderer<PhoneNumberFieldProps>(
          component,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitives.Placeholder:
        return new ReactComponentWithChildrenRenderer<PlaceholderProps>(
          component,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitives.Radio:
        return new ReactComponentWithChildrenRenderer<RadioProps>(
          component,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitives.RadioGroupField:
        return new ReactComponentWithChildrenRenderer<RadioGroupFieldProps>(
          component,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitives.Rating:
        return new ReactComponentWithChildrenRenderer<RatingProps>(
          component,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitives.ScrollView:
        return new ReactComponentWithChildrenRenderer<ScrollViewProps>(
          component,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitives.SearchField:
        return new ReactComponentWithChildrenRenderer<SearchFieldProps>(
          component,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitives.SelectField:
        return new ReactComponentWithChildrenRenderer<SelectFieldProps>(
          component,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitives.StepperField:
        return new ReactComponentWithChildrenRenderer<StepperFieldProps>(
          component,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitives.SwitchField:
        return new ReactComponentWithChildrenRenderer<SwitchFieldProps>(
          component,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitives.Tabs:
        return new ReactComponentWithChildrenRenderer<TabsProps>(
          component,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitives.Text:
        return new TextRenderer(component, this.importCollection, parent).renderElement();

      case Primitives.TextField:
        // unofficial support to retain functionality
        // TODO: add official support
        return new ReactComponentWithChildrenRenderer<ViewProps>(
          component,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitives.ToggleButton:
        return new ReactComponentWithChildrenRenderer<ToggleButtonProps>(
          component,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitives.ToggleButtonGroup:
        return new ReactComponentWithChildrenRenderer<ToggleButtonGroupProps>(
          component,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitives.View:
        return new ReactComponentWithChildrenRenderer<ViewProps>(
          component,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitives.VisuallyHidden:
        return new ReactComponentWithChildrenRenderer<VisuallyHiddenProps>(
          component,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      // to be removed
      case 'String':
        return renderString(component as StudioComponentChild);

      default:
        return new CustomComponentRenderer(component, this.importCollection, parent).renderElement(renderChildren);
    }
  }
}
