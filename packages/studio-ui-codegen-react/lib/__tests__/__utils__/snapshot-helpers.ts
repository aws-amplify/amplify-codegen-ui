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
import { createPrinter, EmitHint, createSourceFile, ScriptTarget, ScriptKind, Node } from 'typescript';

// render typescript AST to typescript then expect to match snapshot
export function assertASTMatchesSnapshot(ast: Node | Node[]): void {
  const file = createSourceFile('test.ts', '', ScriptTarget.ES2015, true, ScriptKind.TS);
  const printer = createPrinter();
  if (Array.isArray(ast)) {
    expect(
      ast.map((singleAST) => printer.printNode(EmitHint.Unspecified, singleAST, file)).join('\n'),
    ).toMatchSnapshot();
  } else {
    expect(printer.printNode(EmitHint.Unspecified, ast, file)).toMatchSnapshot();
  }
}
