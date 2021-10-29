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
import {
  BadgeProps,
  ButtonProps,
  CardProps,
  DividerProps,
  FlexProps,
  ImageProps,
  ViewProps,
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
        // unofficial support to retain functionality
        // TODO: add official support
        return new ReactComponentWithChildrenRenderer<ViewProps>(
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
        // unofficial support to retain functionality
        // TODO: add official support
        return new ReactComponentWithChildrenRenderer<ViewProps>(
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
        // unofficial support to retain functionality
        // TODO: add official support
        return new ReactComponentWithChildrenRenderer<ViewProps>(
          component,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitives.Collection:
        return new CollectionRenderer(component, this.importCollection, parent).renderElement(renderChildren);

      case Primitives.Divider:
        return new ReactComponentRenderer<DividerProps>(component, this.importCollection, parent).renderElement();

      case Primitives.Field:
        // unofficial support to retain functionality
        // TODO: add official support
        return new ReactComponentWithChildrenRenderer<ViewProps>(
          component,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitives.FieldClearButton:
        // unofficial support to retain functionality
        // TODO: add official support
        return new ReactComponentWithChildrenRenderer<ViewProps>(
          component,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitives.FieldDescription:
        // unofficial support to retain functionality
        // TODO: add official support
        return new ReactComponentWithChildrenRenderer<ViewProps>(
          component,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitives.FieldErrorMessage:
        // unofficial support to retain functionality
        // TODO: add official support
        return new ReactComponentWithChildrenRenderer<ViewProps>(
          component,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitives.FieldGroup:
        // unofficial support to retain functionality
        // TODO: add official support
        return new ReactComponentWithChildrenRenderer<ViewProps>(
          component,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitives.FieldGroupIcon:
        // unofficial support to retain functionality
        // TODO: add official support
        return new ReactComponentWithChildrenRenderer<ViewProps>(
          component,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitives.FieldGroupIconButton:
        // unofficial support to retain functionality
        // TODO: add official support
        return new ReactComponentWithChildrenRenderer<ViewProps>(
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
        // unofficial support to retain functionality
        // TODO: add official support
        return new ReactComponentWithChildrenRenderer<ViewProps>(
          component,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitives.Heading:
        // unofficial support to retain functionality
        // TODO: add official support
        return new ReactComponentWithChildrenRenderer<ViewProps>(
          component,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitives.Icon:
        // unofficial support to retain functionality
        // TODO: add official support
        return new ReactComponentWithChildrenRenderer<ViewProps>(
          component,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitives.Image:
        return new ReactComponentRenderer<ImageProps>(component, this.importCollection, parent).renderElement();

      case Primitives.Input:
        // unofficial support to retain functionality
        // TODO: add official support
        return new ReactComponentWithChildrenRenderer<ViewProps>(
          component,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitives.Label:
        // unofficial support to retain functionality
        // TODO: add official support
        return new ReactComponentWithChildrenRenderer<ViewProps>(
          component,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitives.Link:
        // unofficial support to retain functionality
        // TODO: add official support
        return new ReactComponentWithChildrenRenderer<ViewProps>(
          component,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitives.Loader:
        // unofficial support to retain functionality
        // TODO: add official support
        return new ReactComponentWithChildrenRenderer<ViewProps>(
          component,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitives.Pagination:
        // unofficial support to retain functionality
        // TODO: add official support
        return new ReactComponentWithChildrenRenderer<ViewProps>(
          component,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitives.PasswordField:
        // unofficial support to retain functionality
        // TODO: add official support
        return new ReactComponentWithChildrenRenderer<ViewProps>(
          component,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitives.PhoneNumberField:
        // unofficial support to retain functionality
        // TODO: add official support
        return new ReactComponentWithChildrenRenderer<ViewProps>(
          component,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitives.Placeholder:
        // unofficial support to retain functionality
        // TODO: add official support
        return new ReactComponentWithChildrenRenderer<ViewProps>(
          component,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitives.Radio:
        // unofficial support to retain functionality
        // TODO: add official support
        return new ReactComponentWithChildrenRenderer<ViewProps>(
          component,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitives.RadioGroupField:
        // unofficial support to retain functionality
        // TODO: add official support
        return new ReactComponentWithChildrenRenderer<ViewProps>(
          component,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitives.Rating:
        // unofficial support to retain functionality
        // TODO: add official support
        return new ReactComponentWithChildrenRenderer<ViewProps>(
          component,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitives.ScrollView:
        // unofficial support to retain functionality
        // TODO: add official support
        return new ReactComponentWithChildrenRenderer<ViewProps>(
          component,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitives.SearchField:
        // unofficial support to retain functionality
        // TODO: add official support
        return new ReactComponentWithChildrenRenderer<ViewProps>(
          component,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitives.SelectField:
        // unofficial support to retain functionality
        // TODO: add official support
        return new ReactComponentWithChildrenRenderer<ViewProps>(
          component,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitives.StepperField:
        // unofficial support to retain functionality
        // TODO: add official support
        return new ReactComponentWithChildrenRenderer<ViewProps>(
          component,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitives.SwitchField:
        // unofficial support to retain functionality
        // TODO: add official support
        return new ReactComponentWithChildrenRenderer<ViewProps>(
          component,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitives.Tabs:
        // unofficial support to retain functionality
        // TODO: add official support
        return new ReactComponentWithChildrenRenderer<ViewProps>(
          component,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitives.Text:
        return new TextRenderer(component, this.importCollection, parent).renderElement();

      case Primitives.TextArea:
        // unofficial support to retain functionality
        // TODO: add official support
        return new ReactComponentWithChildrenRenderer<ViewProps>(
          component,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitives.TextField:
        // unofficial support to retain functionality
        // TODO: add official support
        return new ReactComponentWithChildrenRenderer<ViewProps>(
          component,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitives.ToggleButton:
        // unofficial support to retain functionality
        // TODO: add official support
        return new ReactComponentWithChildrenRenderer<ViewProps>(
          component,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case Primitives.ToggleButtonGroup:
        // unofficial support to retain functionality
        // TODO: add official support
        return new ReactComponentWithChildrenRenderer<ViewProps>(
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
        // unofficial support to retain functionality
        // TODO: add official support
        return new ReactComponentWithChildrenRenderer<ViewProps>(
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
