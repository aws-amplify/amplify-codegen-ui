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
      return new ReactComponentWithChildrenRenderer<IconProps>(
        {
          ...component,
          componentType: iconsetPascalNameMapping.get(component.componentType) || component.componentType,
        },
        this.importCollection,
        parent,
      ).renderElement(renderChildren);
    }

    // add Primitive in alphabetical order
    switch (component.componentType) {
      case Primitive.Alert:
        return new ReactComponentWithChildrenRenderer<AlertProps>(
          component,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.Badge:
        return new ReactComponentWithChildrenRenderer<BadgeProps>(
          component,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.Button:
        return new ReactComponentWithChildrenRenderer<ButtonProps>(
          component,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.ButtonGroup:
        return new ReactComponentWithChildrenRenderer<ButtonGroupProps>(
          component,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.Card:
        return new ReactComponentWithChildrenRenderer<CardProps>(
          component,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.CheckboxField:
        return new ReactComponentWithChildrenRenderer<CheckboxFieldProps>(
          component,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.Collection:
        return new CollectionRenderer(component, this.importCollection, parent).renderElement(renderChildren);

      case Primitive.Divider:
        return new ReactComponentRenderer<DividerProps>(component, this.importCollection, parent).renderElement();

      case Primitive.Expander:
        return new ReactComponentWithChildrenRenderer<ExpanderProps>(
          component,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.ExpanderItem:
        return new ReactComponentWithChildrenRenderer<ExpanderItemProps>(
          component,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.Flex:
        return new ReactComponentWithChildrenRenderer<FlexProps>(
          component,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.Grid:
        return new ReactComponentWithChildrenRenderer<GridProps>(
          component,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.Heading:
        return new ReactComponentWithChildrenRenderer<HeadingProps>(
          component,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.Icon:
        return new ReactComponentWithChildrenRenderer<IconProps>(
          component,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.Image:
        return new ReactComponentRenderer<ImageProps>(component, this.importCollection, parent).renderElement();

      case Primitive.Link:
        return new ReactComponentWithChildrenRenderer<LinkProps>(
          component,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.Loader:
        return new ReactComponentWithChildrenRenderer<LoaderProps>(
          component,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.Pagination:
        return new ReactComponentWithChildrenRenderer<PaginationProps>(
          component,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.PasswordField:
        return new ReactComponentWithChildrenRenderer<PasswordFieldProps>(
          component,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.PhoneNumberField:
        return new ReactComponentWithChildrenRenderer<PhoneNumberFieldProps>(
          component,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.Placeholder:
        return new ReactComponentWithChildrenRenderer<PlaceholderProps>(
          component,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.Radio:
        return new ReactComponentWithChildrenRenderer<RadioProps>(
          component,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.RadioGroupField:
        return new ReactComponentWithChildrenRenderer<RadioGroupFieldProps>(
          component,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.Rating:
        return new ReactComponentWithChildrenRenderer<RatingProps>(
          component,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.ScrollView:
        return new ReactComponentWithChildrenRenderer<ScrollViewProps>(
          component,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.SearchField:
        return new ReactComponentWithChildrenRenderer<SearchFieldProps>(
          component,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.SelectField:
        return new ReactComponentWithChildrenRenderer<SelectFieldProps>(
          component,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.SliderField:
        return new ReactComponentRenderer<SliderFieldProps>(component, this.importCollection, parent).renderElement();

      case Primitive.StepperField:
        return new ReactComponentWithChildrenRenderer<StepperFieldProps>(
          component,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.SwitchField:
        return new ReactComponentWithChildrenRenderer<SwitchFieldProps>(
          component,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.TabItem:
        return new ReactComponentWithChildrenRenderer<TabItemProps>(
          component,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.Tabs:
        return new ReactComponentWithChildrenRenderer<TabsProps>(
          component,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.Text:
        return new ReactComponentWithChildrenRenderer<TextProps>(
          component,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.TextField:
        return new ReactComponentWithChildrenRenderer<TextFieldProps<boolean>>(
          component,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.ToggleButton:
        return new ReactComponentWithChildrenRenderer<ToggleButtonProps>(
          component,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.ToggleButtonGroup:
        return new ReactComponentWithChildrenRenderer<ToggleButtonGroupProps>(
          component,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.View:
        return new ReactComponentWithChildrenRenderer<ViewProps>(
          component,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitive.VisuallyHidden:
        return new ReactComponentWithChildrenRenderer<VisuallyHiddenProps>(
          component,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      default:
        return new CustomComponentRenderer(component, this.importCollection, parent).renderElement(renderChildren);
    }
  }
}
