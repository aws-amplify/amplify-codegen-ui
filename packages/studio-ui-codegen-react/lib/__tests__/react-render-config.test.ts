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
import { ScriptKind } from 'typescript';
import { scriptKindToFileExtension } from '../react-render-config';

describe('ReactRenderConfig', () => {
  describe('scriptKindToFileExtension', () => {
    test('JS', () => {
      expect(scriptKindToFileExtension(ScriptKind.JS)).toEqual('js');
    });

    test('JSX', () => {
      expect(scriptKindToFileExtension(ScriptKind.JSX)).toEqual('jsx');
    });

    test('TSX', () => {
      expect(scriptKindToFileExtension(ScriptKind.TSX)).toEqual('tsx');
    });

    test('TS (not supported)', () => {
      expect(() => scriptKindToFileExtension(ScriptKind.TS)).toThrow(new Error('Invalid script kind: TS'));
    });
  });
});
