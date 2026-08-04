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

import { factory, Identifier, StringLiteral } from 'typescript';
import { InvalidInputError } from '@aws-amplify/codegen-ui';

/**
 * Matches a simple JS identifier -- no dot-paths, no computed access.
 *
 * SECURITY: values that fail this test must not be passed to
 * factory.createIdentifier(), which emits its argument verbatim as source and
 * would otherwise allow code injection into generated output
 * (CVE-2025-4318 class).
 */
export const SIMPLE_JS_IDENTIFIER_RE = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/;

/**
 * Matches a simple JS identifier or a dot-notation path of them (e.g. `user.name`).
 */
export const IDENTIFIER_PATH_RE = /^[a-zA-Z_$][a-zA-Z0-9_$]*(\.[a-zA-Z_$][a-zA-Z0-9_$]*)*$/;

/**
 * Allowlists a schema-supplied identifier or dot-notation property path,
 * returning '' for anything else.
 *
 * SECURITY: this is the allowlist behind escapePropertyValue(), factored out so
 * that other emit sites needing the same check can reuse it without importing
 * from react-component-render-helper.
 */
export const escapeIdentifierPath = (value: string): string => (IDENTIFIER_PATH_RE.test(value) ? value : '');

/**
 * Validates a schema-supplied identifier or dot-notation path that is about to be
 * emitted in a position with no literal form (a bare identifier, or the member
 * name of a property access).
 *
 * Prefer this over escapeIdentifierPath() at emit sites. The '' returned by
 * escapeIdentifierPath() is safe -- it cannot execute -- but it produces an empty
 * identifier such as `user?.`, which is not parseable, so codegen fails much
 * later inside prettier with an opaque SyntaxError. Failing here instead names
 * the offending schema field and value.
 *
 * The dot-path allowance is inherited from escapePropertyValue() rather than
 * newly introduced: existing schemas legitimately bind to paths like
 * `user.address.city`.
 */
export const assertIdentifierPath = (value: string, context: string): string => {
  if (!IDENTIFIER_PATH_RE.test(value)) {
    throw new InvalidInputError(`${context} is not a valid identifier: ${JSON.stringify(value)}`);
  }
  return value;
};

/**
 * Enumerates a schema-supplied record whose keys are emitted as generated
 * variable, parameter, or prop identifiers, dropping keys that are not valid JS
 * identifiers.
 *
 * SECURITY: component `bindingProperties` and `collectionProperties` keys become
 * declaration names in the generated component (e.g. `const <key> = ...`) via
 * factory.createIdentifier(), which emits its argument verbatim as source
 * A key that is not a valid identifier cannot be a usable
 * prop or variable, so dropping it fails closed without affecting valid schemas.
 */
export const safeIdentifierEntries = <T>(record: Record<string, T> | undefined): [string, T][] =>
  Object.entries(record ?? {}).filter(([name]) => SIMPLE_JS_IDENTIFIER_RE.test(name));

/**
 * Matches a name that is legal in JSX attribute-name position.
 *
 * JSX attribute names follow the JSXIdentifier grammar, which -- unlike a plain
 * JS identifier -- also permits `-`. That allowance is load bearing: legitimate
 * schemas use `data-testid` and `aria-label`, so validating attribute names with
 * SIMPLE_JS_IDENTIFIER_RE would reject valid input.
 *
 * SECURITY: names failing this test must not reach factory.createIdentifier().
 * There is no literal form for a JSX attribute name (TypeScript <= 4.5 types
 * JsxAttribute.name as Identifier), so callers fail closed by omitting the
 * attribute entirely -- a name outside this grammar is not expressible in JSX,
 * so no legitimate output is lost.
 *
 * Namespaced names (`xlink:href`) are deliberately excluded: they are legal JSX
 * but the Studio schema has no way to produce them, and admitting ':' would
 * widen the grammar for no benefit.
 */
export const JSX_ATTRIBUTE_NAME_RE = /^[a-zA-Z_$][a-zA-Z0-9_$]*(-[a-zA-Z0-9_$]+)*$/;

export const isSafeJsxAttributeName = (name: string): boolean =>
  typeof name === 'string' && JSX_ATTRIBUTE_NAME_RE.test(name);

/**
 * Builds a name node for positions that accept either an identifier or a string
 * literal (object-literal keys, property signatures, property assignments).
 *
 * SECURITY: factory.createIdentifier() emits its argument verbatim as source, so
 * only valid identifiers are emitted as identifiers. Anything else is emitted as
 * a properly escaped string-literal key, which preserves the caller's intent
 * without allowing code injection.
 */
export const buildIdentifierOrStringLiteral = (name: string): Identifier | StringLiteral =>
  SIMPLE_JS_IDENTIFIER_RE.test(name) ? factory.createIdentifier(name) : factory.createStringLiteral(name);
