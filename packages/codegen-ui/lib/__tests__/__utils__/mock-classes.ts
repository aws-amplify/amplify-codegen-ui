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
/* eslint-disable max-classes-per-file */

import { FrontendManagerComponent } from '../../types';
import { FrontendManagerTemplateRenderer } from '../../frontend-manager-template-renderer';
import { FrameworkOutputManager } from '../../framework-output-manager';

export class MockOutputManager extends FrameworkOutputManager<string> {
  writeComponent(): Promise<void> {
    return new Promise((resolve) => {
      resolve();
    });
  }
}

export class MockTemplateRenderer extends FrontendManagerTemplateRenderer<
  string,
  FrontendManagerComponent,
  MockOutputManager,
  { componentText: string; renderComponentToFilesystem: (outputPath: string) => Promise<void> }
> {
  renderComponentInternal() {
    return {
      componentText: this.component.name || '',
      renderComponentToFilesystem: jest.fn(),
    };
  }
}
