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
import { FrameworkRenderConfig, InvalidInputError } from '@aws-amplify/codegen-ui';
import { ScriptKind, ScriptTarget, ModuleKind } from 'typescript';

export { ScriptKind, ScriptTarget, ModuleKind } from 'typescript';

export type DataApiKind = 'DataStore' | 'GraphQL' | 'NoApi';

export type ReactRenderConfig = FrameworkRenderConfig & {
  script?: ScriptKind;
  target?: ScriptTarget;
  module?: ModuleKind;
  renderTypeDeclarations?: boolean;
  inlineSourceMap?: boolean;
  apiConfiguration?: GraphqlRenderConfig | DataStoreRenderConfig | NoApiRenderConfig;
  dependencies?: { [key: string]: string };
  includeUseClientDirective?: boolean;
};

export type GraphqlRenderConfig = {
  dataApi: 'GraphQL';
  typesFilePath: string | undefined;
  queriesFilePath: string;
  mutationsFilePath: string;
  subscriptionsFilePath: string;
  fragmentsFilePath: string;
};

export type DataStoreRenderConfig = {
  dataApi: 'DataStore';
};

export type NoApiRenderConfig = {
  dataApi: 'NoApi';
};

export function scriptKindToFileExtension(scriptKind: ScriptKind): string {
  switch (scriptKind) {
    case ScriptKind.TSX:
      return 'tsx';
    case ScriptKind.JS:
      return 'js';
    case ScriptKind.JSX:
      return 'jsx';
    default:
      throw new InvalidInputError(`Invalid script kind: ${ScriptKind[scriptKind]}`);
  }
}

export function scriptKindToFileExtensionNonReact(scriptKind: ScriptKind): string {
  switch (scriptKind) {
    case ScriptKind.TSX:
      return 'ts';
    case ScriptKind.JS:
    case ScriptKind.JSX:
      return 'js';
    default:
      throw new InvalidInputError(`Invalid script kind: ${ScriptKind[scriptKind]}`);
  }
}
