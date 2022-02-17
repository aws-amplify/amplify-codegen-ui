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
  ComponentWithChildrenRendererBase,
  StudioNode,
  StudioComponent,
  StudioComponentChild,
  ComponentMetadata,
} from '@aws-amplify/codegen-ui';
import { JsxAttributeLike, JsxElement, JsxChild, JsxOpeningElement, SyntaxKind, Expression, factory } from 'typescript';
import { ImportCollection, ImportSource, ImportValue } from './imports';
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

export class ReactComponentWithChildrenRenderer<TPropIn> extends ComponentWithChildrenRendererBase<
  TPropIn,
  JsxElement,
  JsxChild
> {
  constructor(
    component: StudioComponent | StudioComponentChild,
    protected componentMetadata: ComponentMetadata,
    protected importCollection: ImportCollection,
    protected parent?: StudioNode,
  ) {
    super(component, parent);
    addBindingPropertiesImports(component, importCollection);
  }

  renderElement(renderChildren: (children: StudioComponentChild[]) => JsxChild[]): JsxElement {
    const children = this.component.children ?? [];

    const element = factory.createJsxElement(
      this.renderOpeningElement(),
      renderChildren(children),
      factory.createJsxClosingElement(factory.createIdentifier(this.component.componentType)),
    );

    this.importCollection.addImport(ImportSource.UI_REACT, this.component.componentType);

    return element;
  }

  protected renderOpeningElement(): JsxOpeningElement {
    const localStateReferences = filterStateReferencesForComponent(
      this.component,
      this.componentMetadata.stateReferences,
    );

    const propertyAttributes = Object.entries(this.component.properties).map(([key, value]) => {
      if (key in localStateReferences) {
        const stateName = getStateName({ componentName: this.component.name, property: key });
        return buildOpeningElementProperties(
          this.componentMetadata,
          { bindingProperties: { property: stateName } },
          key,
        );
      }
      return buildOpeningElementProperties(this.componentMetadata, value, key);
    });

    // Reverse, and create element properties for localStateReferences which are not yet defined props
    const unmodeledPropertyAttributes = Object.entries(localStateReferences)
      .filter(([referencedProperty]) => !(referencedProperty in this.component.properties))
      .map(([referencedProperty]) => {
        const stateName = getStateName({ componentName: this.component.name, property: referencedProperty });
        return buildOpeningElementProperties(
          this.componentMetadata,
          { bindingProperties: { property: stateName } },
          referencedProperty,
        );
      });

    const eventAttributes = Object.entries(this.component.events || {}).map(([key, value]) =>
      buildOpeningElementEvents(this.component.componentType, value, key, this.component.name),
    );

    // TODO: Should we always control form elements?
    const controlEventAttributes = Object.entries(localStateReferences)
      .filter(([, references]) => references.some(({ addControlEvent }) => addControlEvent))
      .map(([key]) =>
        buildOpeningElementControlEvents(
          this.component.componentType,
          getSetStateName({ componentName: this.component.name, property: key }),
          getStateName({ componentName: this.component.name, property: key }),
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

  private addBoundExpressionAttributes(
    attributes: JsxAttributeLike[],
    propKey: string,
    propName: string,
    propValue: Expression,
  ) {
    const attr = factory.createJsxAttribute(
      factory.createIdentifier(propKey),
      factory.createJsxExpression(
        undefined,
        factory.createBinaryExpression(
          factory.createPropertyAccessExpression(factory.createIdentifier('props'), propName),
          SyntaxKind.QuestionQuestionToken,
          propValue,
        ),
      ),
    );

    attributes.push(attr);
  }
}
