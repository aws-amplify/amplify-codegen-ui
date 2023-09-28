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
import { BaseComponentProps } from '@aws-amplify/ui-react';
import {
  CollectionStudioComponentProperty,
  ComponentMetadata,
  isStudioComponentWithCollectionProperties,
  StudioComponent,
  StudioComponentChild,
  StudioNode,
} from '@aws-amplify/codegen-ui';
import ts, {
  factory,
  JsxAttribute,
  JsxChild,
  JsxElement,
  JsxExpression,
  JsxOpeningElement,
  SyntaxKind,
} from 'typescript';
import { ReactComponentRenderer } from '../react-component-renderer';
import { buildOpeningElementProperties } from '../react-component-render-helper';
import { ImportCollection, ImportValue } from '../imports';
import { DataApiKind, ReactRenderConfig } from '../react-render-config';
import { defaultRenderConfig } from '../react-studio-template-renderer-helper';
import { getAmplifyJSAPIImport } from '../helpers/amplify-js-versioning';

export default class CollectionRenderer extends ReactComponentRenderer<BaseComponentProps> {
  constructor(
    component: StudioComponent | StudioComponentChild,
    protected componentMetadata: ComponentMetadata,
    protected importCollection: ImportCollection,
    protected renderConfig: ReactRenderConfig & typeof defaultRenderConfig,
    protected parent?: StudioNode,
  ) {
    super(component, componentMetadata, importCollection, parent);
  }

  renderElement(renderChildren: (children: StudioComponentChild[]) => JsxChild[]): JsxElement {
    this.addKeyPropertyToChildren(this.component.children ?? []);
    const childrenJsx = this.component.children ? renderChildren(this.component.children ?? []) : [];

    const element = this.getCollectionElement(childrenJsx, this.renderConfig.apiConfiguration?.dataApi);

    this.importCollection.addImport('@aws-amplify/ui-react', this.component.componentType);

    if (this.renderConfig.apiConfiguration?.dataApi === 'GraphQL') {
      const mappedImport = getAmplifyJSAPIImport(this.renderConfig.dependencies);
      this.importCollection.addMappedImport(mappedImport);
      this.importCollection.addMappedImport(ImportValue.PAGINATION, ImportValue.PLACEHOLDER);
    }

    return element;
  }

  private renderCollectionOpeningElement(itemsVariableName?: string): JsxOpeningElement {
    const propsArray = Object.entries(this.component.properties).reduce((acc: JsxAttribute[], [key, value]) => {
      if (this.renderConfig.apiConfiguration?.dataApi === 'GraphQL') {
        if (key === 'isPaginated' || key === 'itemsPerPage') {
          return acc;
        }
      }
      return [...acc, buildOpeningElementProperties(this.componentMetadata, value, key)];
    }, []);

    let itemsAttribute: JsxAttribute;

    if (this.renderConfig.apiConfiguration?.dataApi === 'GraphQL') {
      propsArray.push(
        factory.createJsxAttribute(
          factory.createIdentifier('itemsPerPage'),
          factory.createJsxExpression(undefined, factory.createIdentifier('pageSize')),
        ),
        factory.createJsxAttribute(
          factory.createIdentifier('isPaginated'),
          factory.createJsxExpression(
            undefined,
            factory.createBinaryExpression(
              factory.createPrefixUnaryExpression(
                ts.SyntaxKind.ExclamationToken,
                factory.createIdentifier('isApiPagination'),
              ),
              factory.createToken(ts.SyntaxKind.AmpersandAmpersandToken),
              factory.createIdentifier('isPaginated'),
            ),
          ),
        ),
      );

      itemsAttribute = factory.createJsxAttribute(
        factory.createIdentifier('items'),
        factory.createJsxExpression(
          undefined,
          factory.createBinaryExpression(
            factory.createIdentifier('itemsProp'),
            factory.createToken(ts.SyntaxKind.BarBarToken),
            factory.createParenthesizedExpression(
              factory.createConditionalExpression(
                factory.createIdentifier('loading'),
                factory.createToken(ts.SyntaxKind.QuestionToken),
                factory.createCallExpression(
                  factory.createPropertyAccessExpression(
                    factory.createNewExpression(factory.createIdentifier('Array'), undefined, [
                      factory.createIdentifier('pageSize'),
                    ]),
                    factory.createIdentifier('fill'),
                  ),
                  undefined,
                  [factory.createObjectLiteralExpression([], false)],
                ),
                factory.createToken(ts.SyntaxKind.ColonToken),
                factory.createIdentifier('items'),
              ),
            ),
          ),
        ),
      );
    } else {
      itemsAttribute = factory.createJsxAttribute(
        factory.createIdentifier('items'),
        factory.createJsxExpression(
          undefined,
          factory.createBinaryExpression(
            factory.createIdentifier(itemsVariableName || 'items'),
            factory.createToken(SyntaxKind.BarBarToken),
            factory.createArrayLiteralExpression([], false),
          ),
        ),
      );
    }

    propsArray.push(itemsAttribute);

    this.addPropsSpreadAttributes(propsArray);

    return factory.createJsxOpeningElement(
      factory.createIdentifier(this.component.componentType),
      undefined,
      factory.createJsxAttributes(propsArray),
    );
  }

  private addKeyPropertyToChildren(children: StudioComponentChild[]) {
    children.forEach((child: StudioComponentChild) => {
      if ('key' in child.properties) {
        return;
      }
      let keys = ['id'];
      if (isStudioComponentWithCollectionProperties(this.component)) {
        const firstCollectionProp = Object.entries(this.component.collectionProperties ?? {})[0];
        if (firstCollectionProp) {
          const [, { model }] = firstCollectionProp;
          const primaryKeys = this.componentMetadata.dataSchemaMetadata?.models[model]?.primaryKeys;
          if (primaryKeys) {
            keys = primaryKeys;
          }
        }
      }
      const bindingProperties: CollectionStudioComponentProperty[] = keys.map((key) => ({
        collectionBindingProperties: {
          property: '',
          field: key,
        },
      }));

      // eslint-disable-next-line no-param-reassign
      child.properties.key = bindingProperties.length === 1 ? bindingProperties[0] : { concat: bindingProperties };
    });
  }

  private findItemsVariableName(): string | undefined {
    if (isStudioComponentWithCollectionProperties(this.component)) {
      const collectionProps = Object.entries(this.component.collectionProperties ?? {});
      return collectionProps.length > 0 ? collectionProps[0][0] : undefined;
    }
    return undefined;
  }

  private renderItemArrowFunctionExpr(childrenJsx: JsxChild[]): JsxExpression {
    if (this.renderConfig.apiConfiguration?.dataApi === 'GraphQL') {
      return factory.createJsxExpression(
        undefined,
        factory.createArrowFunction(
          undefined,
          undefined,
          [
            factory.createParameterDeclaration(
              undefined,
              undefined,
              undefined,
              factory.createIdentifier('item'),
              undefined,
              undefined,
              undefined,
            ),
            factory.createParameterDeclaration(
              undefined,
              undefined,
              undefined,

              factory.createIdentifier('index'),
              undefined,
              undefined,
              undefined,
            ),
          ],
          undefined,
          factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
          factory.createBlock(
            [
              factory.createIfStatement(
                factory.createIdentifier('loading'),
                factory.createBlock(
                  [
                    factory.createReturnStatement(
                      factory.createParenthesizedExpression(
                        factory.createJsxSelfClosingElement(
                          factory.createIdentifier('Placeholder'),
                          undefined,
                          factory.createJsxAttributes([
                            factory.createJsxAttribute(
                              factory.createIdentifier('key'),
                              factory.createJsxExpression(undefined, factory.createIdentifier('index')),
                            ),
                            factory.createJsxAttribute(
                              factory.createIdentifier('size'),
                              factory.createStringLiteral('large'),
                            ),
                          ]),
                        ),
                      ),
                    ),
                  ],
                  true,
                ),
                undefined,
              ),
              factory.createReturnStatement(factory.createParenthesizedExpression(childrenJsx[0] as JsxExpression)),
            ],
            true,
          ),
        ),
      );
    }

    return factory.createJsxExpression(
      undefined,
      factory.createArrowFunction(
        undefined,
        undefined,
        [
          factory.createParameterDeclaration(
            undefined,
            undefined,
            undefined,
            factory.createIdentifier('item'),
            undefined,
            undefined,
            undefined,
          ),
          factory.createParameterDeclaration(
            undefined,
            undefined,
            undefined,
            factory.createIdentifier('index'),
            undefined,
            undefined,
            undefined,
          ),
        ],
        undefined,
        factory.createToken(SyntaxKind.EqualsGreaterThanToken),
        factory.createParenthesizedExpression(childrenJsx[0] as JsxExpression),
      ),
    );
  }

  private getCollectionElement(childrenJsx: JsxChild[], dataApi: DataApiKind = 'DataStore'): JsxElement {
    const arrowFuncExpr = this.renderItemArrowFunctionExpr(childrenJsx);
    const itemsVariableName = this.findItemsVariableName();

    if (dataApi === 'GraphQL') {
      const attributesObj: { name: string; initialValue: string }[] = [
        { name: 'currentPage', initialValue: 'pageIndex' },
        { name: 'totalPages', initialValue: 'maxViewed' },
        { name: 'hasMorePages', initialValue: 'hasMorePages' },
        { name: 'onNext', initialValue: 'handleNextPage' },
        { name: 'onPrevious', initialValue: 'handlePreviousPage' },
        { name: 'onChange', initialValue: 'jumpToPage' },
      ];

      const attributes: JsxAttribute[] = [];

      attributesObj.forEach((attribute) => {
        attributes.push(
          factory.createJsxAttribute(
            factory.createIdentifier(attribute.name),
            factory.createJsxExpression(undefined, factory.createIdentifier(attribute.initialValue)),
          ),
        );
      });

      return factory.createJsxElement(
        factory.createJsxOpeningElement(factory.createIdentifier('div'), undefined, factory.createJsxAttributes([])),
        [
          factory.createJsxElement(
            this.renderCollectionOpeningElement(itemsVariableName),
            [arrowFuncExpr],
            factory.createJsxClosingElement(factory.createIdentifier(this.component.componentType)),
          ),
          factory.createJsxExpression(
            undefined,
            factory.createBinaryExpression(
              factory.createBinaryExpression(
                factory.createIdentifier('isApiPagination'),
                factory.createToken(ts.SyntaxKind.AmpersandAmpersandToken),
                factory.createIdentifier('isPaginated'),
              ),
              factory.createToken(ts.SyntaxKind.AmpersandAmpersandToken),
              factory.createJsxSelfClosingElement(
                factory.createIdentifier('Pagination'),
                undefined,
                factory.createJsxAttributes(attributes),
              ),
            ),
          ),
        ],
        factory.createJsxClosingElement(factory.createIdentifier('div')),
      );
    }

    return factory.createJsxElement(
      this.renderCollectionOpeningElement(itemsVariableName),
      [arrowFuncExpr],
      factory.createJsxClosingElement(factory.createIdentifier(this.component.componentType)),
    );
  }
}
