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
  StateReference,
} from '@aws-amplify/codegen-ui';
import {
  JsxAttributeLike,
  JsxElement,
  JsxOpeningElement,
  factory,
  JsxSelfClosingElement,
  SyntaxKind,
} from 'typescript';
import {
  addBindingPropertiesImports,
  buildOpeningElementProperties,
  getStateName,
  getSetStateName,
} from './react-component-render-helper';
import {
  buildOpeningElementControlEvents,
  buildOpeningElementEvents,
  filterStateReferencesForComponent,
} from './workflow';
import { ImportCollection, ImportSource, ImportValue } from './imports';

export class ReactComponentRenderer<TPropIn> extends ComponentRendererBase<
  TPropIn,
  JsxElement | JsxSelfClosingElement
> {
  constructor(
    component: StudioComponent | StudioComponentChild,
    protected stateReferences: StateReference[],
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
    const localStateReferences = filterStateReferencesForComponent(this.component, this.stateReferences);

    const propertyAttributes = Object.entries(this.component.properties).map(([key, value]) => {
      if (key in localStateReferences) {
        const stateName = getStateName({ componentName: this.component.name || '', property: key });
        return buildOpeningElementProperties({ bindingProperties: { property: stateName } }, key);
      }
      return buildOpeningElementProperties(value, key);
    });

    // Reverse, and create element properties for localStateReferences which are not yet defined props
    const unmodeledPropertyAttributes = Object.entries(localStateReferences)
      .filter(([referencedProperty]) => !(referencedProperty in this.component.properties))
      .map(([referencedProperty]) => {
        const stateName = getStateName({ componentName: this.component.name || '', property: referencedProperty });
        return buildOpeningElementProperties({ bindingProperties: { property: stateName } }, referencedProperty);
      });

    const eventAttributes = Object.entries(this.component.events || {}).map(([key, value]) =>
      buildOpeningElementEvents(this.component.componentType, value, key, this.component.name),
    );

    const controlEventAttributes = Object.entries(localStateReferences)
      .filter(([, references]) => references.some(({ addControlEvent }) => addControlEvent))
      .map(([key]) =>
        buildOpeningElementControlEvents(
          this.component.componentType,
          getSetStateName({ componentName: this.component.name || '', property: key }),
          getStateName({ componentName: this.component.name || '', property: key }),
          'change',
        ),
      );

    const attributes = [
      ...propertyAttributes,
      ...unmodeledPropertyAttributes,
      ...eventAttributes,
      ...controlEventAttributes,
    ];

    this.addPropsSpreadAttributes(attributes);

    return factory.createJsxOpeningElement(
      factory.createIdentifier(this.component.componentType),
      undefined,
      factory.createJsxAttributes(attributes),
    );
  }

  protected addPropsSpreadAttributes(attributes: JsxAttributeLike[]) {
    if (this.node.isRoot()) {
      const propsAttr = factory.createJsxSpreadAttribute(factory.createIdentifier('rest'));
      attributes.push(propsAttr);
    }

    if (this.node.hasAncestorOfType('Collection')) {
      this.addCollectionOverridePropsAttribute(attributes);
    } else {
      this.addGetOverridePropsAttribute(attributes);
    }
  }

  private addGetOverridePropsAttribute(attributes: JsxAttributeLike[]) {
    if (this.node.component.name) {
      const overrideAttr = factory.createJsxSpreadAttribute(
        factory.createCallExpression(factory.createIdentifier('getOverrideProps'), undefined, [
          factory.createIdentifier('overrides'),
          factory.createStringLiteral(this.node.component.name),
        ]),
      );
      this.importCollection.addMappedImport(ImportValue.GET_OVERRIDE_PROPS);
      attributes.push(overrideAttr);
    }
  }

  private addCollectionOverridePropsAttribute(attributes: JsxAttributeLike[]) {
    const overrideAttr = factory.createJsxSpreadAttribute(
      factory.createParenthesizedExpression(
        factory.createBinaryExpression(
          factory.createIdentifier('overrideItems'),
          factory.createToken(SyntaxKind.AmpersandAmpersandToken),
          factory.createCallExpression(factory.createIdentifier('overrideItems'), undefined, [
            factory.createObjectLiteralExpression(
              [
                factory.createShorthandPropertyAssignment(factory.createIdentifier('item'), undefined),
                factory.createShorthandPropertyAssignment(factory.createIdentifier('index'), undefined),
              ],
              false,
            ),
          ]),
        ),
      ),
    );
    attributes.push(overrideAttr);
  }
}
