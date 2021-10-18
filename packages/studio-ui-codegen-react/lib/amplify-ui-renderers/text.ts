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
import { TextProps } from '@aws-amplify/ui-react';

import { FixedStudioComponentProperty } from '@amzn/amplify-ui-codegen-schema';

import { factory, JsxElement, JsxChild } from 'typescript';
import { ReactComponentRenderer } from '../react-component-renderer';
import { isBoundProperty } from '../react-component-render-helper';

export default class TextRenderer extends ReactComponentRenderer<TextProps> {
  renderElement(): JsxElement {
    const tagName = 'Text';

    const element = factory.createJsxElement(
      this.renderOpeningElement(tagName),
      this.getChildren(),
      factory.createJsxClosingElement(factory.createIdentifier(tagName)),
    );

    this.importCollection.addImport('@aws-amplify/ui-react', tagName);
    return element;
  }

  getChildren(): JsxChild[] {
    const { value } = this.component.properties;
    if (isBoundProperty(value)) {
      const {
        bindingProperties: { property },
      } = value;
      return [factory.createJsxExpression(undefined, factory.createIdentifier(property))];
    }
    return [
      factory.createJsxText(
        (value ? (this.component.properties.value as FixedStudioComponentProperty).value ?? '' : '').toString(),
      ),
    ];
  }
}
