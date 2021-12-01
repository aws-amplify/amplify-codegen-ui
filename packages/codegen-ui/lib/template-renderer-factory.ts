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
import { FrameworkOutputManager } from './framework-output-manager';
import { StudioTemplateRenderer } from './studio-template-renderer';

import { RenderTextComponentResponse } from './render-component-response';

/**
 * This class is used to wrap the created of renderers due to each renderer
 * only being used for one component.
 */
export class StudioTemplateRendererFactory<
  TSource,
  TStudioType,
  TOutputManager extends FrameworkOutputManager<TSource>,
  TRenderOutput extends RenderTextComponentResponse,
  TRenderer extends StudioTemplateRenderer<TSource, TStudioType, TOutputManager, TRenderOutput>,
> {
  constructor(private renderer: (component: TStudioType) => TRenderer) {}

  buildRenderer(component: TStudioType): TRenderer {
    return this.renderer(component);
  }
}
