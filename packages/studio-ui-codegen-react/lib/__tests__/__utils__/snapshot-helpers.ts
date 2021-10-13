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
