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
import { ComponentRendererBase, StudioNode, StudioComponent, StudioComponentChild } from '@amzn/studio-ui-codegen';
import { JsxAttributeLike, JsxElement, JsxOpeningElement, factory } from 'typescript';

import {
  addBindingPropertiesImports,
  buildOpeningElementAttributes,
  buildOpeningElementActions,
} from './react-component-render-helper';
import { ImportCollection } from './import-collection';

export class ReactComponentRenderer<TPropIn> extends ComponentRendererBase<TPropIn, JsxElement> {
  constructor(
    component: StudioComponent | StudioComponentChild,
    protected importCollection: ImportCollection,
    protected parent?: StudioNode,
  ) {
    super(component, parent);
    addBindingPropertiesImports(component, importCollection);
  }

  renderElement(): JsxElement {
    const element = factory.createJsxElement(
      this.renderOpeningElement(),
      [],
      factory.createJsxClosingElement(factory.createIdentifier(this.component.componentType)),
    );

    this.importCollection.addImport('@aws-amplify/ui-react', this.component.componentType);

    return element;
  }

  protected renderOpeningElement(): JsxOpeningElement {
    const attributes = Object.entries(this.component.properties)
      // value should be child of Text, not a prop
      .filter(([key]) => !(this.component.componentType === 'Text' && key === 'value'))
      .map(([key, value]) => buildOpeningElementAttributes(value, key));

    if ('events' in this.component && this.component.events !== undefined) {
      attributes.push(
        ...Object.entries(this.component.events).map(([key, value]) => buildOpeningElementActions(key, value)),
      );
    }

    this.addPropsSpreadAttributes(attributes);

    return factory.createJsxOpeningElement(
      factory.createIdentifier(this.component.componentType),
      undefined,
      factory.createJsxAttributes(attributes),
    );
  }

  private addPropsSpreadAttributes(attributes: JsxAttributeLike[]) {
    if (this.node.isRoot()) {
      const propsAttr = factory.createJsxSpreadAttribute(factory.createIdentifier('rest'));
      attributes.push(propsAttr);
    }

    const overrideAttr = factory.createJsxSpreadAttribute(
      factory.createCallExpression(factory.createIdentifier('getOverrideProps'), undefined, [
        factory.createIdentifier('overrides'),
        factory.createStringLiteral(
          this.node
            .getComponentPathToRoot()
            .reverse()
            .map((component) => component.componentType)
            .join('.'),
        ),
      ]),
    );
    this.importCollection.addImport('@aws-amplify/ui-react', 'getOverrideProps');
    attributes.push(overrideAttr);
  }
}
