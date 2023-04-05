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
  FieldConfigMetadata,
  FormDefinitionStorageFieldElement,
  LabelDecorator,
  StudioComponent,
  StudioComponentChild,
  ComponentMetadata,
  isValidVariableName,
} from '@aws-amplify/codegen-ui';
import { factory, JsxAttribute, JsxAttributeLike, JsxElement, JsxExpression, SyntaxKind } from 'typescript';
import { getDecoratedLabel } from '../../forms/form-renderer-helper';
import { buildOnChangeStatement } from '../../forms/form-renderer-helper/event-handler-props';
import { propertyToExpression } from '../../react-component-render-helper';

const fieldKeys = new Set<keyof FormDefinitionStorageFieldElement['props']>(['label', 'isRequired', 'isReadOnly']);

const storageManagerKeys = new Set<keyof FormDefinitionStorageFieldElement['props']>([
  'accessLevel',
  'acceptedFileTypes',
  'showThumbnails',
  'isResumable',
  'maxFileCount',
  'maxSize',
]);

function isFieldKey(key: string) {
  return fieldKeys.has(key as any);
}

function isStorageManagerKey(key: string) {
  return storageManagerKeys.has(key as any);
}

export const renderStorageFieldComponent = (
  component: StudioComponent | StudioComponentChild,
  componentMetadata: ComponentMetadata,
  fieldLabel: string,
  fieldConfigs: Record<string, FieldConfigMetadata>,
  labelDecorator?: LabelDecorator,
  isRequired?: boolean,
): JsxElement => {
  const { name: componentName } = component;
  const storageManagerComponentName = factory.createIdentifier('StorageManager');
  const storageManagerAttributes: JsxAttribute[] = [];
  const fieldAttributes: JsxAttribute[] = [];

  storageManagerAttributes.push(
    factory.createJsxAttribute(
      factory.createIdentifier('ref'),
      factory.createJsxExpression(undefined, factory.createIdentifier(`${component.name}Ref`)),
    ),
  );

  if (componentMetadata.formMetadata) {
    const errorKey =
      componentName.split('.').length > 1 || !isValidVariableName(componentName)
        ? factory.createElementAccessExpression(
            factory.createIdentifier('errors'),
            factory.createStringLiteral(componentName),
          )
        : factory.createPropertyAccessExpression(
            factory.createIdentifier('errors'),
            factory.createIdentifier(componentName),
          );

    if (componentMetadata.formMetadata.formActionType === 'update') {
      const defaultFileExpression: JsxExpression = fieldConfigs[component.name].isArray
        ? factory.createJsxExpression(
            undefined,
            factory.createCallExpression(
              factory.createPropertyAccessExpression(
                factory.createIdentifier('imgKeys'),
                factory.createIdentifier('map'),
              ),
              undefined,
              [
                factory.createParenthesizedExpression(
                  factory.createArrowFunction(
                    undefined,
                    undefined,
                    [
                      factory.createParameterDeclaration(
                        undefined,
                        undefined,
                        undefined,
                        factory.createIdentifier('s3Key'),
                        undefined,
                        undefined,
                        undefined,
                      ),
                    ],
                    undefined,
                    factory.createToken(SyntaxKind.EqualsGreaterThanToken),
                    factory.createParenthesizedExpression(
                      factory.createObjectLiteralExpression(
                        [factory.createShorthandPropertyAssignment(factory.createIdentifier('s3Key'), undefined)],
                        false,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          )
        : factory.createJsxExpression(
            undefined,
            factory.createArrayLiteralExpression(
              [
                factory.createObjectLiteralExpression(
                  [
                    factory.createPropertyAssignment(
                      factory.createIdentifier('s3Key'),
                      factory.createIdentifier('singleImgKey'),
                    ),
                  ],
                  false,
                ),
              ],
              false,
            ),
          );

      storageManagerAttributes.push(
        factory.createJsxAttribute(factory.createIdentifier('defaultFiles'), defaultFileExpression),
      );
    }

    storageManagerAttributes.push(buildOnChangeStatement(component, fieldConfigs));
    fieldAttributes.push(
      factory.createJsxAttribute(
        factory.createIdentifier('errorMessage'),
        factory.createJsxExpression(
          undefined,
          factory.createPropertyAccessChain(
            errorKey,
            factory.createToken(SyntaxKind.QuestionDotToken),
            factory.createIdentifier('errorMessage'),
          ),
        ),
      ),
      factory.createJsxAttribute(
        factory.createIdentifier('hasError'),
        factory.createJsxExpression(
          undefined,
          factory.createPropertyAccessChain(
            errorKey,
            factory.createToken(SyntaxKind.QuestionDotToken),
            factory.createIdentifier('hasError'),
          ),
        ),
      ),
    );
  }

  Object.entries(component.properties).forEach(([key, value]) => {
    if (isFieldKey(key)) {
      if (
        (key === 'label' && labelDecorator && labelDecorator === 'required' && isRequired) ||
        (labelDecorator === 'optional' && !isRequired && 'value' in value)
      ) {
        fieldAttributes.push(getDecoratedLabel('label', fieldLabel, labelDecorator));
      } else {
        fieldAttributes.push(
          factory.createJsxAttribute(
            factory.createIdentifier(key),
            factory.createJsxExpression(undefined, propertyToExpression(componentMetadata, value)),
          ),
        );
      }
    }
    if (isStorageManagerKey(key)) {
      let storageManagerValue = value;

      if (key === 'acceptedFileTypes') {
        storageManagerValue = { ...value, value: (value as any).value.split(',') };
      }
      if (key === 'maxFileCount' && !fieldConfigs[componentName].isArray) {
        storageManagerValue = { ...value, value: 1 };
      }

      storageManagerAttributes.push(
        factory.createJsxAttribute(
          factory.createIdentifier(key),
          factory.createJsxExpression(undefined, propertyToExpression(componentMetadata, storageManagerValue)),
        ),
      );
    }
  });

  const storageManager = factory.createJsxElement(
    factory.createJsxOpeningElement(
      storageManagerComponentName,
      undefined,
      factory.createJsxAttributes(storageManagerAttributes),
    ),
    [],
    factory.createJsxClosingElement(storageManagerComponentName),
  );

  return renderFieldWrapper(fieldAttributes, storageManager);
};

export const renderFieldWrapper = (attributes: JsxAttributeLike[], storageManagerComponent: JsxElement): JsxElement => {
  const storageManagerComponentName = factory.createIdentifier('Field');

  return factory.createJsxElement(
    factory.createJsxOpeningElement(storageManagerComponentName, undefined, factory.createJsxAttributes(attributes)),
    [storageManagerComponent],
    factory.createJsxClosingElement(storageManagerComponentName),
  );
};
