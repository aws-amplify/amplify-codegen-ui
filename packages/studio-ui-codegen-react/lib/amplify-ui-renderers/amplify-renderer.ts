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
import { ReactStudioTemplateRenderer } from '../react-studio-template-renderer';

import BadgeRenderer from './badge';
import ButtonRenderer from './button';
import ViewRenderer from './view';
import CardRenderer from './card';
import DividerRenderer from './divider';
import FlexRenderer from './flex';
import ImageRenderer from './image';
import TextRenderer from './text';
import renderString from './string';
import CustomComponentRenderer from './customComponent';
import CollectionRenderer from './collection';

export class AmplifyRenderer extends ReactStudioTemplateRenderer {
  renderJsx(component: StudioComponent | StudioComponentChild, parent?: StudioNode): JsxElement | JsxFragment {
    const node = new StudioNode(component, parent);
    switch (component.componentType) {
      case 'Collection':
        return new CollectionRenderer(component, this.importCollection, parent).renderElement((children) =>
          children.map((child) => this.renderJsx(child, node)),
        );
      case 'Badge':
        return new BadgeRenderer(component, this.importCollection, parent).renderElement((children) =>
          children.map((child) => this.renderJsx(child, node)),
        );

      case 'Button':
        return new ButtonRenderer(component, this.importCollection, parent).renderElement((children) =>
          children.map((child) => this.renderJsx(child, node)),
        );

      case 'View':
        return new ViewRenderer(component, this.importCollection, parent).renderElement((children) =>
          children.map((child) => this.renderJsx(child, node)),
        );

      case 'Card':
        return new CardRenderer(component, this.importCollection, parent).renderElement((children) =>
          children.map((child) => this.renderJsx(child, node)),
        );

      case 'Divider':
        return new DividerRenderer(component, this.importCollection, parent).renderElement();

      case 'Flex':
        return new FlexRenderer(component, this.importCollection, parent).renderElement((children) =>
          children.map((child) => this.renderJsx(child, node)),
        );

      case 'Image':
        return new ImageRenderer(component, this.importCollection, parent).renderElement();

      case 'String':
        return renderString(component as StudioComponentChild);

      case 'Text':
        return new TextRenderer(component, this.importCollection, parent).renderElement();

      default:
        return new CustomComponentRenderer(component, this.importCollection).renderElement((children) =>
          children.map((child) => this.renderJsx(child, node)),
        );
    }
  }
}
