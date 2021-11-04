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
import path from 'path';
import { handleCodegenErrors } from './errors';
import { FrameworkOutputManager } from './framework-output-manager';
import { FrameworkRenderConfig } from './framework-render-config';
import { RenderTextComponentResponse } from './render-component-response';

export abstract class StudioTemplateRenderer<
  TSource,
  TStudioType,
  TOutputManager extends FrameworkOutputManager<TSource>,
  TRenderOutput extends RenderTextComponentResponse,
> {
  /**
   *
   * @param component The first order component to be rendered.
   */
  constructor(
    protected component: TStudioType,
    protected outputManager: TOutputManager,
    protected renderConfig: FrameworkRenderConfig,
  ) {}

  /**
   * Renders the entire first order component. It returns the
   * component text and a method for saving the component to the filesystem.
   */
  @handleCodegenErrors
  renderComponent(): TRenderOutput {
    return this.renderComponentInternal();
  }

  protected abstract renderComponentInternal(): TRenderOutput;

  renderComponentToFilesystem(componentContent: TSource) {
    return (fileName: string) => (outputPath: string) =>
      this.outputManager.writeComponent(componentContent, path.join(outputPath, fileName));
  }
}
