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
  GenericDataSchema,
  StudioNode,
  StudioView,
  StudioTemplateRenderer,
  TableDefinition,
  generateTableDefinition,
  ViewMetadata,
} from '@aws-amplify/codegen-ui';
import { JsxElement, JsxFragment, JsxSelfClosingElement } from 'typescript';
import { ImportCollection } from '../imports';
import { ReactOutputManager } from '../react-output-manager';
import { ReactRenderConfig, scriptKindToFileExtension } from '../react-render-config';
import { defaultRenderConfig } from '../react-studio-template-renderer-helper';
import { RequiredKeys } from '../utils/type-utils';

export abstract class ReactViewTemplateRenderer extends StudioTemplateRenderer<
  string,
  StudioView,
  ReactOutputManager,
  {
    componentText: string;
    renderComponentToFilesystem: (outputPath: string) => Promise<void>;
  }
> {
  protected importCollection = new ImportCollection();

  protected renderConfig: RequiredKeys<ReactRenderConfig, keyof typeof defaultRenderConfig>;

  protected viewDefinition: TableDefinition | undefined;

  protected viewComponent: StudioView;

  protected viewMetadata: ViewMetadata;

  public fileName: string;

  abstract renderJsx(view: StudioView, parent?: StudioNode): JsxElement | JsxFragment | JsxSelfClosingElement;

  constructor(component: StudioView, dataSchema: GenericDataSchema | undefined, renderConfig: ReactRenderConfig) {
    super(component, new ReactOutputManager(), renderConfig);
    this.renderConfig = {
      ...defaultRenderConfig,
      ...renderConfig,
    };
    // the super class creates a component aka form which is what we pass in this extended implmentation
    this.fileName = `${this.component.name}.${scriptKindToFileExtension(this.renderConfig.script)}`;

    switch (component.viewConfiguration.type) {
      case 'Table':
        this.viewDefinition = generateTableDefinition(component, dataSchema);
        break;
      default:
        this.viewDefinition = undefined;
    }

    this.viewComponent = component;

    this.viewMetadata = {
      id: component.id,
      name: component.name,
    };
  }

  renderComponentInternal(): {
    componentText: string;
    renderComponentToFilesystem: (outputPath: string) => Promise<void>;
  } {
    throw new Error('Method not implemented.');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  validateSchema(component: StudioView): void {
    throw new Error('Method not implemented.');
  }
}
