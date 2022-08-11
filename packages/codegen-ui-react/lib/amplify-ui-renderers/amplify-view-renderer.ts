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

import { JsxElement, factory, JsxFragment } from 'typescript';
import { ReactViewTemplateRenderer } from '../views/react-view-renderer';
import { Primitive } from '../primitive';
import { ReactTableRenderer } from '../react-table-renderer';

export class AmplifyViewRenderer extends ReactViewTemplateRenderer {
  renderJsx(): JsxElement | JsxFragment {
    switch (this.viewComponent.viewConfiguration.type) {
      case Primitive.Table:
        return new ReactTableRenderer(
          this.viewComponent,
          this.viewDefinition!,
          this.viewMetadata,
          this.importCollection,
        ).renderElement();
      default:
        return factory.createJsxFragment(factory.createJsxOpeningFragment(), [], factory.createJsxJsxClosingFragment());
    }
  }
}
