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
import {
  ComponentRendererBase,
  StudioNode,
  StudioComponent,
  StudioComponentChild,
  StudioGenericEvent,
} from '@aws-amplify/codegen-ui';
import { JsxAttributeLike, JsxElement, JsxOpeningElement, factory, JsxSelfClosingElement } from 'typescript';

import {
  addBindingPropertiesImports,
  buildOpeningElementAttributes,
  buildOpeningElementActions,
  mapGenericEventToReact,
} from './react-component-render-helper';
import { ImportCollection, ImportSource, ImportValue } from './imports';

export class ReactComponentRenderer<TPropIn> extends ComponentRendererBase<
  TPropIn,
  JsxElement | JsxSelfClosingElement
> {
  constructor(
    component: StudioComponent | StudioComponentChild,
    protected importCollection: ImportCollection,
    protected parent?: StudioNode,
  ) {
    super(component, parent);
    addBindingPropertiesImports(component, importCollection);
  }

  renderElement(): JsxElement | JsxSelfClosingElement {
    const element = factory.createJsxElement(
      this.renderOpeningElement(),
      [],
      factory.createJsxClosingElement(factory.createIdentifier(this.component.componentType)),
    );

    this.importCollection.addImport(ImportSource.UI_REACT, this.component.componentType);

    return element;
  }

  protected renderOpeningElement(): JsxOpeningElement {
    const propertyAttributes = Object.entries(this.component.properties).map(([key, value]) =>
      buildOpeningElementAttributes(value, key),
    );
    const eventPropertyAttributes = Object.entries(this.component.eventProperties || {}).map(([key, value]) =>
      // pass as bindingProperties to reuse logic
      buildOpeningElementAttributes(
        { bindingProperties: { property: value } },
        mapGenericEventToReact(key as StudioGenericEvent),
      ),
    );
    const eventAttributes =
      'events' in this.component && this.component.events !== undefined
        ? Object.entries(this.component.events).map(([key, value]) =>
            buildOpeningElementActions(key as StudioGenericEvent, value),
          )
        : [];
    const attributes = propertyAttributes.concat(eventPropertyAttributes).concat(eventAttributes);

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
        factory.createStringLiteral(this.node.getOverrideKey()),
      ]),
    );
    this.importCollection.addMappedImport(ImportValue.GET_OVERRIDE_PROPS);
    attributes.push(overrideAttr);
  }
}
