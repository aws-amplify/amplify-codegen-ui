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
import { LabelDecorator, StudioComponentProperty } from '@aws-amplify/codegen-ui/lib/types';
import { factory } from 'typescript';

/**
 <span style={{ display: \\"inline-flex\\" }}>
  <span>City</span>
  <span style={{ whiteSpace: \\"pre\\", fontStyle: \\"italic\\" }}>
    {\\" \\"}
    - optional
  </span>
</span>
 */

export const getDecoratedLabel = (attribute: string, value: string, labelDecorator: LabelDecorator) =>
  factory.createJsxAttribute(
    factory.createIdentifier(attribute),
    factory.createJsxExpression(
      undefined,
      factory.createJsxElement(
        factory.createJsxOpeningElement(
          factory.createIdentifier('span'),
          undefined,
          factory.createJsxAttributes([
            factory.createJsxAttribute(
              factory.createIdentifier('style'),
              factory.createJsxExpression(
                undefined,
                factory.createObjectLiteralExpression(
                  [
                    factory.createPropertyAssignment(
                      factory.createIdentifier('display'),
                      factory.createStringLiteral('inline-flex'),
                    ),
                  ],
                  false,
                ),
              ),
            ),
          ]),
        ),
        [
          factory.createJsxElement(
            factory.createJsxOpeningElement(
              factory.createIdentifier('span'),
              undefined,
              factory.createJsxAttributes([]),
            ),
            [factory.createJsxText(value, false)],
            factory.createJsxClosingElement(factory.createIdentifier('span')),
          ),
          generateLabelDecorator(labelDecorator),
        ],
        factory.createJsxClosingElement(factory.createIdentifier('span')),
      ),
    ),
  );

const generateLabelDecorator = (labelDecorator: LabelDecorator) => {
  let styles = [
    factory.createPropertyAssignment(factory.createIdentifier('whiteSpace'), factory.createStringLiteral('pre')),
    factory.createPropertyAssignment(factory.createIdentifier('fontStyle'), factory.createStringLiteral('italic')),
  ];
  let decoratorText = ' - optional';

  if (labelDecorator === 'required') {
    styles = [factory.createPropertyAssignment(factory.createIdentifier('color'), factory.createStringLiteral('red'))];
    decoratorText = '*';
  }

  return factory.createJsxElement(
    factory.createJsxOpeningElement(
      factory.createIdentifier('span'),
      undefined,
      factory.createJsxAttributes([
        factory.createJsxAttribute(
          factory.createIdentifier('style'),
          factory.createJsxExpression(undefined, factory.createObjectLiteralExpression(styles, false)),
        ),
      ]),
    ),
    [factory.createJsxText(decoratorText, false)],
    factory.createJsxClosingElement(factory.createIdentifier('span')),
  );
};

export const getIsRequiredValue = (isRequiredProperty: StudioComponentProperty) => {
  let isRequired = false;
  if (isRequiredProperty && 'value' in isRequiredProperty) {
    const isRequiredValue = isRequiredProperty.value;
    if (typeof isRequiredValue === 'string') {
      isRequired = isRequiredProperty.value === 'true';
    }
  }
  return isRequired;
};
