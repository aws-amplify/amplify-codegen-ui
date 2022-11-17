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
import { StudioView } from '@aws-amplify/codegen-ui/lib/types';
import { factory, JsxChild, JsxElement, SyntaxKind } from 'typescript';
import { ImportCollection, ImportSource } from './imports';
import { Primitive } from './primitive';

export class ReactExpanderRenderer {
  private requiredUIReactImports = [Primitive.Expander, Primitive.ExpanderItem];

  protected expander: StudioView;

  constructor(expander: StudioView, private imports: ImportCollection) {
    this.expander = expander;

    this.requiredUIReactImports.forEach((importName) => {
      imports.addImport(ImportSource.UI_REACT, importName);
    });
  }

  renderElement(): JsxElement {
    return factory.createJsxElement(
      this.createOpeningExpanderElement(),
      [this.createExpanderChildren()],
      factory.createJsxClosingElement(factory.createIdentifier(Primitive.Expander)),
    );
  }

  createExpanderChildren() {
    const itemParam = factory.createParameterDeclaration(
      undefined,
      undefined,
      undefined,
      factory.createIdentifier('item'),
      undefined,
      undefined,
      undefined,
    );
    return factory.createJsxExpression(
      undefined,
      factory.createCallExpression(
        factory.createPropertyAccessExpression(factory.createIdentifier('items'), factory.createIdentifier('map')),
        undefined,
        [
          factory.createArrowFunction(
            undefined,
            undefined,
            [itemParam],
            undefined,
            factory.createToken(SyntaxKind.EqualsGreaterThanToken),
            factory.createParenthesizedExpression(this.createExpanderItemRow()),
          ),
        ],
      ),
    );
  }

  createExpanderItemRow() {
    const child = this.createExpanderItemChild();
    if (!child) throw new Error('could not determine ExpanderItem child to render');
    return factory.createJsxElement(
      factory.createJsxOpeningElement(
        factory.createIdentifier(Primitive.ExpanderItem),
        undefined,
        this.createExpanderItemAttributes(),
      ),
      [child],
      factory.createJsxClosingElement(factory.createIdentifier(Primitive.ExpanderItem)),
    );
  }

  createExpanderItemChild(): JsxChild | undefined {
    const { viewConfiguration } = this.expander;
    if (viewConfiguration.type !== 'Collection') {
      throw new Error(`Cannot create ExpanderItem child for view type: ${viewConfiguration.type}`);
    }
    switch (viewConfiguration.collection.body.type) {
      case 'Amplify.ComponentSlot': {
        if (!viewConfiguration.collection.body.content.componentSlot.componentName) {
          throw new Error('componentName must be defined');
        }
        const { componentSlot } = viewConfiguration.collection.body.content;
        this.imports.addImport(ImportSource.UI_REACT, componentSlot.componentName);

        const attributes = Object.entries(componentSlot.bindingProperties).map(([key, value]) => {
          const attributeValue = value.field
            ? factory.createPropertyAccessExpression(
                factory.createIdentifier(value.property),
                factory.createIdentifier(value.field),
              )
            : factory.createIdentifier(value.property);

          return factory.createJsxAttribute(
            factory.createIdentifier(key),
            factory.createJsxExpression(undefined, attributeValue),
          );
        });

        return factory.createJsxSelfClosingElement(
          factory.createIdentifier(viewConfiguration.collection.body.content.componentSlot.componentName),
          undefined,
          factory.createJsxAttributes(attributes),
        );
      }
      case 'Amplify.Binding': {
        if (!viewConfiguration.collection.body.content.bindingProperty) {
          throw new Error('bindingProperty must be defined');
        }
        const { property, field } = viewConfiguration.collection.body.content.bindingProperty;
        if (!(property && field)) {
          throw new Error('property and field must be defined');
        }
        return factory.createJsxExpression(
          undefined,
          factory.createPropertyAccessExpression(factory.createIdentifier(property), factory.createIdentifier(field)),
        );
      }
      default: {
        // "viewConfiguration.collection.body.type" should be a "never" TS type here, so we can't reference it.
        throw new Error(`Unrecognized value for field type in viewConfiguration.collection.body`);
      }
    }
  }

  createExpanderItemAttributes() {
    const { viewConfiguration } = this.expander;
    if (viewConfiguration.type === 'Collection') {
      switch (viewConfiguration.collection.title?.type) {
        case 'Amplify.Binding':
          return factory.createJsxAttributes([
            factory.createJsxAttribute(
              factory.createIdentifier('title'),
              factory.createJsxExpression(
                undefined,
                factory.createPropertyAccessExpression(
                  /**
                   * leaving "item" hard coded since it's controlled by the code in this package
                   * and it should never be something else in this context,
                   * but the user can still set this in the schema.
                   */
                  factory.createIdentifier('item'),
                  factory.createIdentifier(viewConfiguration.collection.title.content.bindingProperty.field),
                ),
              ),
            ),
            /**
             * Value is needed for the expander item to expand,
             * the user doesn't need it
             */
            factory.createJsxAttribute(
              factory.createIdentifier('value'),
              factory.createJsxExpression(
                undefined,
                factory.createPropertyAccessExpression(
                  factory.createIdentifier('item'),
                  factory.createIdentifier('id'),
                ),
              ),
            ),
            /**
             * Key here is for React to render a list of items
             */
            factory.createJsxAttribute(
              factory.createIdentifier('key'),
              factory.createJsxExpression(
                undefined,
                factory.createPropertyAccessExpression(
                  factory.createIdentifier('item'),
                  factory.createIdentifier('id'),
                ),
              ),
            ),
          ]);
        default:
          throw new Error(`Unsupported Expander title type, ${viewConfiguration.collection.title.type}`);
      }
    }
    return factory.createJsxAttributes([]);
  }

  createOpeningExpanderElement() {
    return factory.createJsxOpeningElement(
      factory.createIdentifier(Primitive.Expander),
      undefined,
      // TODO: updating "type" here is handled in a future task
      factory.createJsxAttributes([
        factory.createJsxAttribute(factory.createIdentifier('type'), factory.createStringLiteral('multiple')),
      ]),
    );
  }
}
