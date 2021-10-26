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
import { StudioComponent, StudioComponentChild } from '@amzn/amplify-ui-codegen-schema';
import { StudioNode } from '@amzn/studio-ui-codegen';
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
    switch (component.componentType) {
      case 'Collection':
        return new CollectionRenderer(component, this.importCollection, parent).renderElement(renderChildren);
      case 'Badge':
        return new ReactComponentWithChildrenRenderer<BadgeProps>(
          component,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case 'Button':
        return new ReactComponentWithChildrenRenderer<ButtonProps>(
          component,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case 'View':
        return new ReactComponentWithChildrenRenderer<ViewProps>(
          component,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case 'Card':
        return new ReactComponentWithChildrenRenderer<CardProps>(
          component,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case 'Divider':
        return new ReactComponentRenderer<DividerProps>(component, this.importCollection, parent).renderElement();

      case 'Flex':
        return new ReactComponentWithChildrenRenderer<FlexProps>(
          component,
          this.importCollection,
          parent,
        ).renderElement(renderChildren);

      case 'Image':
        return new ReactComponentRenderer<ImageProps>(component, this.importCollection, parent).renderElement();

      case 'String':
        return renderString(component as StudioComponentChild);

      case 'Text':
        return new TextRenderer(component, this.importCollection, parent).renderElement();

      default:
        return new CustomComponentRenderer(component, this.importCollection).renderElement(renderChildren);
    }
  }
}
