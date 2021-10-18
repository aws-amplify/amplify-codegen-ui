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
import { FrameworkRenderConfig } from '@amzn/studio-ui-codegen';
import { ScriptKind, ScriptTarget, ModuleKind } from 'typescript';

export { ScriptKind, ScriptTarget, ModuleKind } from 'typescript';

export type ReactRenderConfig = FrameworkRenderConfig & {
  script?: ScriptKind;
  target?: ScriptTarget;
  module?: ModuleKind;
  renderTypeDeclarations?: boolean;
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
      throw new Error(`Invalid script kind: ${ScriptKind[scriptKind]}`);
  }
}
