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
  ComponentMetadata,
  StudioGenericEvent,
} from '@aws-amplify/codegen-ui';
import {
  JsxAttributeLike,
  JsxElement,
  JsxOpeningElement,
  factory,
  JsxSelfClosingElement,
  SyntaxKind,
  JsxChild,
} from 'typescript';
import {
  addBindingPropertiesImports,
  buildOpeningElementProperties,
  getStateName,
  getSetStateName,
  hasChildrenProp,
} from './react-component-render-helper';
import {
  buildOpeningElementControlEvents,
  buildOpeningElementEvents,
  filterStateReferencesForComponent,
} from './workflow';
import { ImportCollection, ImportSource, ImportValue } from './imports';
import { addFormAttributes } from './forms';
import { shouldWrapInArrayField } from './forms/form-renderer-helper/render-checkers';
import { renderArrayFieldComponent } from './utils/forms/array-field-component';

export class ReactComponentRenderer<TPropIn> extends ComponentRendererBase<
  TPropIn,
  JsxElement | JsxSelfClosingElement,
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

  renderElement(
    renderChildren: ((children: StudioComponentChild[]) => JsxChild[]) | undefined = undefined,
  ): JsxElement | JsxSelfClosingElement {
    const children = this.component.children ?? [];

    const element = factory.createJsxElement(
      this.renderOpeningElement(),
      renderChildren && !hasChildrenProp(this.component.properties) ? renderChildren(children) : [],
      factory.createJsxClosingElement(factory.createIdentifier(this.component.componentType)),
    );

    this.importCollection.addImport(ImportSource.UI_REACT, this.component.componentType);

    const formFieldConfigs = this.componentMetadata.formMetadata?.fieldConfigs;

    // Add ArrayField wrapper to element if Array type
    if (
      formFieldConfigs &&
      formFieldConfigs[this.component.name] &&
      shouldWrapInArrayField(formFieldConfigs[this.component.name])
    ) {
      this.importCollection.addImport(ImportSource.UI_REACT, 'Icon');
      this.importCollection.addImport(ImportSource.UI_REACT, 'Badge');
      this.importCollection.addImport(ImportSource.UI_REACT, 'ScrollView');
      this.importCollection.addImport(ImportSource.UI_REACT, 'Divider');
      this.importCollection.addImport(ImportSource.UI_REACT, 'Text');
      this.importCollection.addImport(ImportSource.UI_REACT, 'useTheme');

      let label = '';
      if ('value' in this.component.properties.label) {
        label = this.component.properties.label.value.toString() ?? '';
      }
      return renderArrayFieldComponent(this.component.name, label, formFieldConfigs, element);
    }

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

    const controlEventAttributes = Object.entries(localStateReferences)
      .filter(([, references]) => references.some(({ addControlEvent }) => addControlEvent))
      .map(([key]) =>
        buildOpeningElementControlEvents(
          this.component.componentType,
          getSetStateName({ componentName: this.component.name, property: key }),
          getStateName({ componentName: this.component.name, property: key }),
          StudioGenericEvent.onChange,
        ),
      );

    const attributes = [
      ...propertyAttributes,
      ...unmodeledPropertyAttributes,
      ...eventAttributes,
      ...controlEventAttributes,
    ];

    if (this.componentMetadata.formMetadata) {
      attributes.push(...addFormAttributes(this.component, this.componentMetadata.formMetadata));
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
