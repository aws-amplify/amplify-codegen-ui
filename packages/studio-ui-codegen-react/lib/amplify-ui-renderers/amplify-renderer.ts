import { StudioComponent, StudioComponentChild } from '@amzn/amplify-ui-codegen-schema';
import { StudioNode } from '@amzn/studio-ui-codegen';
import { factory, JsxElement, JsxFragment } from 'typescript';
import { ReactStudioTemplateRenderer } from '../react-studio-template-renderer';
import { ReactRenderConfig } from '../react-render-config';

import BadgeRenderer from './badge';
import ButtonRenderer from './button';
import BoxRenderer from './box';
import CardRenderer from './card';
import DividerRenderer from './divider';
import FlexRenderer from './flex';
import ImageRenderer from './image';
import TextRenderer from './text';
import renderString from './string';
import CustomComponentRenderer from './customComponent';
import CollectionRenderer from './collection';

export class AmplifyRenderer extends ReactStudioTemplateRenderer {
  constructor(component: StudioComponent, renderConfig: ReactRenderConfig) {
    super(component, renderConfig);
  }

  renderJsx(component: StudioComponent | StudioComponentChild, parent?: StudioNode): JsxElement | JsxFragment {
    console.log(parent);
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

      case 'Box':
        return new BoxRenderer(component, this.importCollection, parent).renderElement((children) =>
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
        return renderString(component);

      case 'Text':
        return new TextRenderer(component, this.importCollection, parent).renderElement();
    }

    console.warn(`${component.componentType} is not one of the primitives - assuming CustomComponent`);

    return new CustomComponentRenderer(component, this.importCollection).renderElement((children) =>
      children.map((child) => this.renderJsx(child, node)),
    );
  }
}
