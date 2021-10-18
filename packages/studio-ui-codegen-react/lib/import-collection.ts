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
import factory, { createImportDeclaration, ImportDeclaration } from 'typescript';

export class ImportCollection {
  #collection: Map<string, Set<string>> = new Map();

  addImport(packageName: string, importName: string) {
    if (!this.#collection.has(packageName)) {
      this.#collection.set(packageName, new Set());
    }

    const existingPackage = this.#collection.get(packageName);

    if (!existingPackage?.has(importName)) {
      existingPackage?.add(importName);
    }
  }

  mergeCollections(otherCollection: ImportCollection) {
    for (const [key, value] of otherCollection.#collection) {
      [...value].forEach((singlePackage) => {
        this.addImport(key, singlePackage);
      });
    }
  }

  buildSampleSnippetImports(topComponentName: string): ImportDeclaration[] {
    const importDeclarations: ImportDeclaration[] = [];
    const sampleStudioPath = './studio-ui';
    const namedImports = factory.createNamedImports([
      factory.createImportSpecifier(undefined, factory.createIdentifier(topComponentName)),
    ]);

    importDeclarations.push(
      createImportDeclaration(
        undefined,
        undefined,
        factory.createImportClause(undefined, namedImports),
        factory.createStringLiteral(sampleStudioPath),
      ),
    );
    return importDeclarations;
  }

  buildImportStatements(): ImportDeclaration[] {
    const importDeclarations: ImportDeclaration[] = [];

    importDeclarations.push(
      factory.createImportDeclaration(
        undefined,
        undefined,
        factory.createImportClause(factory.createIdentifier('React'), undefined),
        factory.createStringLiteral('react'),
      ),
    );

    for (const [key, value] of this.#collection) {
      importDeclarations.push(
        createImportDeclaration(
          undefined,
          undefined,
          factory.createImportClause(
            undefined,
            factory.createNamedImports(
              [...value].sort().map((item) => {
                return factory.createImportSpecifier(undefined, factory.createIdentifier(item));
              }),
            ),
          ),
          factory.createStringLiteral(key),
        ),
      );
    }

    return importDeclarations;
  }
}
