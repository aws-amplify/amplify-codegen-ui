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
} from '@aws-amplify/codegen-ui';
import { JsxAttributeLike, JsxElement, JsxChild, JsxOpeningElement, SyntaxKind, Expression, factory } from 'typescript';
import { ImportCollection, ImportSource, ImportValue } from './imports';
import { addBindingPropertiesImports, buildOpeningElementProperties } from './react-component-render-helper';
import { buildOpeningElementEvents } from './workflow';
import Primitive, { PrimitiveChildrenPropMapping } from './primitive';

export class ReactComponentWithChildrenRenderer<TPropIn> extends ComponentWithChildrenRendererBase<
  TPropIn,
  JsxElement,
  JsxChild
> {
  constructor(
    component: StudioComponent | StudioComponentChild,
    protected importCollection: ImportCollection,
    protected parent?: StudioNode,
  ) {
    super(component, parent);
    this.mapSyntheticProps();
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
    const propertyAttributes = Object.entries(this.component.properties).map(([key, value]) =>
      buildOpeningElementProperties(value, key),
    );
    const eventAttributes = Object.entries(this.component.events || {}).map(([key, value]) =>
      buildOpeningElementEvents(value, key, this.component.name),
    );
    const attributes = propertyAttributes.concat(eventAttributes);

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

  /* Some additional props are added to Amplify primitives in Studio. These "sythetic" props are mapped to real props
   * on the primitives.
   *
   * Example: Text prop label is mapped to to Text prop Children
   *
   * This is done so that nonadvanced users of Studio do not need to interact with props that might confuse them.
   */
  private mapSyntheticProps() {
    // properties.children will take precedent over mapped children prop
    if (this.component.properties.children === undefined) {
      const childrenPropMapping = PrimitiveChildrenPropMapping[Primitive[this.component.componentType as Primitive]];

      if (childrenPropMapping !== undefined) {
        const mappedChildrenProp = this.component.properties[childrenPropMapping];
        if (mappedChildrenProp !== undefined) {
          this.component.properties.children = mappedChildrenProp;
          delete this.component.properties[childrenPropMapping];
        }
      }
    }
  }
}
