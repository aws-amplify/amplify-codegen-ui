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
import {
  JsxAttributeLike,
  JsxElement,
  JsxChild,
  JsxOpeningElement,
  SyntaxKind,
  Expression,
  factory,
  JsxSpreadAttribute,
} from 'typescript';
import { ImportCollection, ImportSource, ImportValue } from './imports';
import {
  addBindingPropertiesImports,
  buildOpeningElementAttributes,
  buildOpeningElementActions,
} from './react-component-render-helper';
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
    const attributes = Object.entries(this.component.properties).map(([key, value]) =>
      buildOpeningElementAttributes(value, key),
    );

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

  protected addPropsSpreadAttributes(attributes: JsxAttributeLike[]) {
    if (this.node.isRoot()) {
      const propsAttr = factory.createJsxSpreadAttribute(factory.createIdentifier('rest'));
      attributes.push(propsAttr);
    }

    const overrideAttr = this.node.hasAncestorOfType('Collection')
      ? this.buildCollectionOverridePropsAttribute()
      : this.buildGetOverridePropsAttribute();
    attributes.push(overrideAttr);
  }

  private buildGetOverridePropsAttribute(): JsxSpreadAttribute {
    this.importCollection.addMappedImport(ImportValue.GET_OVERRIDE_PROPS);
    return factory.createJsxSpreadAttribute(
      factory.createCallExpression(factory.createIdentifier('getOverrideProps'), undefined, [
        factory.createIdentifier('overrides'),
        factory.createStringLiteral(this.node.getOverrideKey()),
      ]),
    );
  }

  private buildCollectionOverridePropsAttribute(): JsxSpreadAttribute {
    return factory.createJsxSpreadAttribute(
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
