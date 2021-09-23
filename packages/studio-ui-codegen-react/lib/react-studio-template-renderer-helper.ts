import ts, { createPrinter, createSourceFile, NewLineKind, transpileModule } from 'typescript';
import prettier from 'prettier';
import parserBabel from 'prettier/parser-babel';
import { ReactRenderConfig, ScriptKind, ScriptTarget, ModuleKind } from './react-render-config';

export const defaultRenderConfig = {
  script: ScriptKind.TSX,
  target: ScriptTarget.ES2015,
  module: ModuleKind.ESNext,
};

export function transpile(code: string, renderConfig: ReactRenderConfig): string {
  const { target, module, script } = renderConfig;
  if (script === ScriptKind.JS || script === ScriptKind.JSX) {
    const transpiledCode = transpileModule(code, {
      compilerOptions: {
        target,
        module,
        jsx: script === ScriptKind.JS ? ts.JsxEmit.React : ts.JsxEmit.Preserve,
        esModuleInterop: true,
      },
    }).outputText;

    return prettier.format(transpiledCode, { parser: 'babel', plugins: [parserBabel] });
  }

  return prettier.format(code, { parser: 'babel', plugins: [parserBabel] });
}

export function buildPrinter(fileName: string, renderConfig: ReactRenderConfig) {
  const { target, script } = renderConfig;
  const file = createSourceFile(
    fileName,
    '',
    target || defaultRenderConfig.target,
    false,
    script || defaultRenderConfig.script,
  );

  const printer = createPrinter({
    newLine: NewLineKind.LineFeed,
  });
  return { printer, file };
}
