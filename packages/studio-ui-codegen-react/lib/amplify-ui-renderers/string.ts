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
import { StudioComponentChild } from '@amzn/amplify-ui-codegen-schema';
import ts, { JsxFragment } from 'typescript';

export default function renderString(component: StudioComponentChild): JsxFragment {
  const { factory } = ts;

  if ('value' in component.properties) {
    if ('value' in component.properties.value) {
      const stringProp = component.properties.value;
      const { value } = stringProp;

      const element = factory.createJsxFragment(
        factory.createJsxOpeningFragment(),
        [factory.createJsxText(value.toString())],
        factory.createJsxJsxClosingFragment(),
      );
      return element;
    }
  }

  throw new Error('Failed to render String - Unexpected component structure');
}
