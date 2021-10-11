import ts, {
  createPrinter,
  createSourceFile,
  NewLineKind,
  transpileModule,
  factory,
  StringLiteral,
  NumericLiteral,
  BooleanLiteral,
  NullLiteral,
  ArrayLiteralExpression,
  ObjectLiteralExpression,
  createProgram,
} from 'typescript';
import prettier from 'prettier';
import parserBabel from 'prettier/parser-babel';
import tmp, { FileResult, DirResult } from 'tmp';
import fs from 'fs';
import path from 'path';
import { ReactRenderConfig, ScriptKind, ScriptTarget, ModuleKind } from './react-render-config';

export const defaultRenderConfig = {
  script: ScriptKind.TSX,
  target: ScriptTarget.ES2015,
  module: ModuleKind.ESNext,
};

export function transpile(
  code: string,
  renderConfig: ReactRenderConfig,
): { componentText: string; declaration?: string } {
  const { target, module, script, renderTypeDeclarations } = renderConfig;
  if (script === ScriptKind.JS || script === ScriptKind.JSX) {
    const transpiledCode = transpileModule(code, {
      compilerOptions: {
        target,
        module,
        jsx: script === ScriptKind.JS ? ts.JsxEmit.React : ts.JsxEmit.Preserve,
        esModuleInterop: true,
      },
    }).outputText;

    const componentText = prettier.format(transpiledCode, { parser: 'babel', plugins: [parserBabel] });

    /* createProgram is less performant than traspileModule and should only be used when necessary.
     * createProgram is used here becuase transpileModule cannot produce type declarations.
     */
    if (renderTypeDeclarations) {
      let tmpFile: FileResult | undefined;
      let tmpDir: DirResult | undefined;
      try {
        tmpFile = tmp.fileSync({ postfix: '.tsx' });
        tmpDir = tmp.dirSync({ unsafeCleanup: true });

        fs.writeFileSync(tmpFile.name, code);

        createProgram([tmpFile.name], {
          target,
          module,
          declaration: true,
          emitDeclarationOnly: true,
          outDir: tmpDir.name,
          skipLibCheck: true,
        }).emit();

        const declaration = fs.readFileSync(path.join(tmpDir.name, getDeclarationFilename(tmpFile.name)), 'utf8');

        return { componentText, declaration };
      } finally {
        if (tmpFile !== undefined) {
          tmpFile.removeCallback();
        }
        if (tmpDir !== undefined) {
          tmpDir.removeCallback();
        }
      }
    }

    return {
      componentText,
    };
  }

  return { componentText: prettier.format(code, { parser: 'babel', plugins: [parserBabel] }) };
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

export function getDeclarationFilename(filename: string): string {
  return `${path.basename(filename, '.tsx')}.d.ts`;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export type json = string | number | boolean | null | json[] | { [key: string]: json };

// eslint-disable-next-line consistent-return
export function jsonToLiteral(
  jsonObject: json,
): ObjectLiteralExpression | StringLiteral | NumericLiteral | BooleanLiteral | NullLiteral | ArrayLiteralExpression {
  if (jsonObject === null) {
    return factory.createNull();
  }
  // eslint-disable-next-line default-case
  switch (typeof jsonObject) {
    case 'string':
      return factory.createStringLiteral(jsonObject);
    case 'number':
      return factory.createNumericLiteral(jsonObject);
    case 'boolean': {
      if (jsonObject) {
        return factory.createTrue();
      }
      return factory.createFalse();
    }
    case 'object': {
      if (jsonObject instanceof Array) {
        return factory.createArrayLiteralExpression(jsonObject.map(jsonToLiteral), false);
      }
      // else object
      return factory.createObjectLiteralExpression(
        Object.entries(jsonObject).map(([key, value]) =>
          factory.createPropertyAssignment(factory.createIdentifier(key), jsonToLiteral(value)),
        ),
        false,
      );
    }
  }
}
