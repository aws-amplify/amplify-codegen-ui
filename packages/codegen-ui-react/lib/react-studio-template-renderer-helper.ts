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
  isDataPropertyBinding,
  StudioComponentDataPropertyBinding,
  StudioComponentSimplePropertyBinding,
  StudioComponentEventPropertyBinding,
  InternalError,
  InvalidInputError,
  StudioComponentSlotBinding,
  StudioComponentSort,
} from '@aws-amplify/codegen-ui';
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
  BindingName,
  Expression,
  ArrowFunction,
  CallExpression,
  Identifier,
} from 'typescript';
import { createDefaultMapFromNodeModules, createSystem, createVirtualCompilerHost } from '@typescript/vfs';
import path from 'path';
import { ReactRenderConfig, ScriptKind, ScriptTarget, ModuleKind } from './react-render-config';

export const defaultRenderConfig = {
  script: ScriptKind.TSX,
  target: ScriptTarget.ES2015,
  module: ModuleKind.ESNext,
  includeUseClientDirective: false,
};

const supportedTranspilationTargets = [
  ScriptTarget.ES3,
  ScriptTarget.ES5,
  ScriptTarget.ES2015,
  ScriptTarget.ES2016,
  ScriptTarget.ES2017,
  ScriptTarget.ES2018,
  ScriptTarget.ES2019,
  ScriptTarget.ES2020,
  ScriptTarget.ES2021,
];

export function transpile(
  code: string,
  renderConfig: ReactRenderConfig,
  shouldFormatCode = true,
): { componentText: string; declaration?: string } {
  const { target, module, script, renderTypeDeclarations, inlineSourceMap } = renderConfig;
  if (script === ScriptKind.JS || script === ScriptKind.JSX) {
    const transpiledCode = transpileModule(code, {
      compilerOptions: {
        target,
        module,
        jsx: script === ScriptKind.JS ? ts.JsxEmit.React : ts.JsxEmit.Preserve,
        esModuleInterop: true,
        inlineSourceMap,
        inlineSources: inlineSourceMap,
      },
    }).outputText;
    const componentText = shouldFormatCode ? formatCode(transpiledCode) : transpiledCode;

    /*
     * createProgram is less performant than traspileModule and should only be used when necessary.
     * createProgram is used here becuase transpileModule cannot produce type declarations.
     * We execute in a virtual filesystem to ensure we have no dependencies on platform fs in this stage.
     */
    if (renderTypeDeclarations) {
      if (target && !new Set(supportedTranspilationTargets).has(target)) {
        throw new InvalidInputError(
          `ScriptTarget ${target} not supported with type declarations enabled, expected one of ${JSON.stringify(
            supportedTranspilationTargets,
          )}`,
        );
      }

      const compilerOptions = {
        target,
        module,
        declaration: true,
        emitDeclarationOnly: true,
        skipLibCheck: true,
      };

      const fsMap = createDefaultMapFromNodeModules(compilerOptions, ts);
      fsMap.set('index.tsx', code);

      const host = createVirtualCompilerHost(createSystem(fsMap), compilerOptions, ts);
      createProgram({
        rootNames: [...fsMap.keys()],
        options: compilerOptions,
        host: host.compilerHost,
      }).emit();

      const declaration = fsMap.get('index.d.ts');

      if (!declaration) {
        throw new InternalError('Component declaration file not generated');
      }

      return { componentText, declaration };
    }

    return {
      componentText,
    };
  }

  return { componentText: formatCode(code) };
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

/**
 * (s: SortPredicate<User>) => s.firstName('ASCENDING').lastName('DESCENDING')
 */
export const buildSortFunction = (model: string, sort: StudioComponentSort[]): ArrowFunction => {
  const ascendingSortDirection = factory.createPropertyAccessExpression(
    factory.createIdentifier('SortDirection'),
    factory.createIdentifier('ASCENDING'),
  );
  const descendingSortDirection = factory.createPropertyAccessExpression(
    factory.createIdentifier('SortDirection'),
    factory.createIdentifier('DESCENDING'),
  );

  let expr: Identifier | CallExpression = factory.createIdentifier('s');
  sort.forEach((sortPredicate) => {
    expr = factory.createCallExpression(
      factory.createPropertyAccessExpression(expr, factory.createIdentifier(sortPredicate.field)),
      undefined,
      [sortPredicate.direction === 'ASC' ? ascendingSortDirection : descendingSortDirection],
    );
  });

  return factory.createArrowFunction(
    undefined,
    undefined,
    [
      factory.createParameterDeclaration(
        undefined,
        undefined,
        undefined,
        factory.createIdentifier('s'),
        undefined,
        factory.createTypeReferenceNode(factory.createIdentifier('SortPredicate'), [
          factory.createTypeReferenceNode(factory.createIdentifier(model), undefined),
        ]),
        undefined,
      ),
    ],
    undefined,
    factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
    expr,
  );
};

export function getDeclarationFilename(filename: string): string {
  return `${path.basename(filename, filename.includes('.tsx') ? '.tsx' : '.jsx')}.d.ts`;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export type json = string | number | boolean | null | json[] | { [key: string]: json };

// eslint-disable-next-line consistent-return
export function jsonToLiteral(
  jsonObject: json,
  tryAndMarshallStringsToObjects?: boolean,
): ObjectLiteralExpression | StringLiteral | NumericLiteral | BooleanLiteral | NullLiteral | ArrayLiteralExpression {
  if (jsonObject === null) {
    return factory.createNull();
  }
  // eslint-disable-next-line default-case
  switch (typeof jsonObject) {
    case 'string':
      if (tryAndMarshallStringsToObjects) {
        try {
          const parsedObject = JSON.parse(jsonObject);
          if (typeof parsedObject === 'object') {
            return jsonToLiteral(parsedObject, tryAndMarshallStringsToObjects);
          }
        } catch (e) {} // eslint-disable-line no-empty
      }
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
        return factory.createArrayLiteralExpression(
          jsonObject.map((obj) => jsonToLiteral(obj, tryAndMarshallStringsToObjects)),
          false,
        );
      }
      // else object
      return factory.createObjectLiteralExpression(
        Object.entries(jsonObject).map(([key, value]) =>
          factory.createPropertyAssignment(
            factory.createStringLiteral(key),
            jsonToLiteral(value, tryAndMarshallStringsToObjects),
          ),
        ),
        false,
      );
    }
  }
}

export function bindingPropertyUsesHook(
  binding:
    | StudioComponentDataPropertyBinding
    | StudioComponentSimplePropertyBinding
    | StudioComponentEventPropertyBinding
    | StudioComponentSlotBinding,
): boolean {
  return isDataPropertyBinding(binding) && 'predicate' in binding.bindingProperties;
}

// optional import prettier
export function formatCode(code: string): string {
  let prettier = null;
  let parserTypescript = null;

  try {
    // eslint-disable-next-line global-require, import/no-extraneous-dependencies, @typescript-eslint/no-var-requires
    prettier = require('prettier');
    // eslint-disable-next-line global-require, import/no-extraneous-dependencies, @typescript-eslint/no-var-requires
    parserTypescript = require('prettier/parser-typescript');
  } catch {} // eslint-disable-line no-empty

  if (prettier && parserTypescript) {
    return prettier.format(code, { parser: 'typescript', plugins: [parserTypescript] });
  }

  return code;
}

/*
base collection variable statement
const {identifier} = {propertyAccessExpression}.items
*/
export const buildBaseCollectionVariableStatement = (identifier: string | BindingName, expression: Expression) => {
  return factory.createVariableStatement(
    undefined,
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          identifier,
          undefined,
          undefined,
          factory.createPropertyAccessExpression(expression, factory.createIdentifier('items')),
        ),
      ],
      ts.NodeFlags.Const,
    ),
  );
};

export const createHookStatement = (variableName: string, methodName: string, props: ObjectLiteralExpression) => {
  return factory.createVariableStatement(
    undefined,
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          factory.createIdentifier(variableName),
          undefined,
          undefined,
          factory.createCallExpression(factory.createIdentifier(methodName), undefined, [props]),
        ),
      ],
      ts.NodeFlags.Const,
    ),
  );
};

// const client = generateClient();
export const getAmplifyJSClientGenerator = () => {
  return factory.createVariableStatement(
    undefined,
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          factory.createIdentifier('client'),
          undefined,
          undefined,
          factory.createCallExpression(factory.createIdentifier('generateClient'), undefined, []),
        ),
      ],
      ts.NodeFlags.Const,
    ),
  );
};
