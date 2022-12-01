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
import { ImportDeclaration, factory } from 'typescript';
import path from 'path';
import { ComponentMetadata, reservedWords } from '@aws-amplify/codegen-ui';
import { ImportMapping, ImportValue, ImportSource } from './import-mapping';
import { isPrimitive } from '../primitive';
import { createUniqueName } from '../helpers';

export class ImportCollection {
  constructor(componentMetadata?: ComponentMetadata) {
    this.importedNames = new Set(Object.values(componentMetadata?.componentNameToTypeMap || {}).concat(reservedWords));
    // Add form fields so we dont reuse the identifier
    if (componentMetadata?.formMetadata) {
      Object.keys(componentMetadata.formMetadata.fieldConfigs).forEach((key) => this.importedNames.add(key));
    }
  }

  importedNames: Set<string>;

  #collection: Map<string, Set<string>> = new Map();

  importAlias: Map<string, Map<string, string>> = new Map();

  addMappedImport(importValue: ImportValue) {
    const importPackage = ImportMapping[importValue];
    this.addImport(importPackage, importValue);
  }

  addImport(packageName: string, importName: string): { importName: string; importAlias: string | undefined } {
    if (!this.#collection.has(packageName)) {
      this.#collection.set(packageName, new Set());
    }

    const existingPackage = this.#collection.get(packageName);

    if (!existingPackage?.has(importName)) {
      existingPackage?.add(importName);
      if (packageName !== ImportSource.LOCAL_MODELS) {
        this.importedNames.add(importName);
      }
    }

    let modelAlias: string | undefined;

    if (packageName === ImportSource.LOCAL_MODELS) {
      const existingPackageAlias = this.importAlias.get(packageName);
      const existingAlias = existingPackageAlias?.get(importName);
      if (existingAlias) return { importName, importAlias: existingAlias };
      modelAlias = createUniqueName(
        importName,
        (input) =>
          this.importedNames.has(input) || (input.endsWith('Props') && isPrimitive(input.replace(/Props/g, ''))),
      );
      if (existingPackageAlias) {
        existingPackageAlias.set(importName, modelAlias);
      } else {
        const aliasMap = new Map();
        aliasMap.set(importName, modelAlias);
        this.importAlias.set(packageName, aliasMap);
      }
      this.importedNames.add(modelAlias);
      return { importName, importAlias: modelAlias };
    }
    return { importName, importAlias: modelAlias };
  }

  removeImportSource(packageImport: ImportSource) {
    this.#collection.delete(packageImport);
  }

  getMappedAlias(packageName: string, importName: string) {
    return this.importAlias.get(packageName)?.get(importName) || importName;
  }

  mergeCollections(otherCollection: ImportCollection) {
    otherCollection.#collection.forEach((value, key) => {
      [...value].forEach((singlePackage) => {
        this.addImport(key, singlePackage);
      });
    });
  }

  buildSampleSnippetImports(topComponentName: string): ImportDeclaration[] {
    return [
      factory.createImportDeclaration(
        undefined,
        undefined,
        factory.createImportClause(
          false,
          undefined,
          factory.createNamedImports([
            factory.createImportSpecifier(undefined, factory.createIdentifier(topComponentName)),
          ]),
        ),
        factory.createStringLiteral('./ui-components'),
      ),
    ];
  }

  buildImportStatements(skipReactImport?: boolean): ImportDeclaration[] {
    const importDeclarations = ([] as ImportDeclaration[])
      .concat(
        skipReactImport
          ? []
          : [
              factory.createImportDeclaration(
                undefined,
                undefined,
                factory.createImportClause(
                  false,
                  undefined,
                  factory.createNamespaceImport(factory.createIdentifier('React')),
                ),
                factory.createStringLiteral('react'),
              ),
            ],
      )
      .concat(
        Array.from(this.#collection).map(([moduleName, imports]) => {
          const namedImports = [...imports].filter((namedImport) => namedImport !== 'default').sort();
          const aliasMap = this.importAlias.get(moduleName);
          if (aliasMap) {
            const importClause = factory.createImportClause(
              false,
              undefined,
              factory.createNamedImports(
                [...imports].map((item) => {
                  const alias = aliasMap.get(item);
                  return factory.createImportSpecifier(
                    alias && alias !== item ? factory.createIdentifier(item) : undefined,
                    factory.createIdentifier(alias ?? item),
                  );
                }),
              ),
            );
            return factory.createImportDeclaration(
              undefined,
              undefined,
              importClause,
              factory.createStringLiteral(moduleName),
            );
          }
          return factory.createImportDeclaration(
            undefined,
            undefined,
            factory.createImportClause(
              false,
              // use module name as default import name
              [...imports].indexOf('default') >= 0 ? factory.createIdentifier(path.basename(moduleName)) : undefined,
              factory.createNamedImports(
                namedImports.map((item) => {
                  return factory.createImportSpecifier(undefined, factory.createIdentifier(item));
                }),
              ),
            ),
            factory.createStringLiteral(moduleName),
          );
        }),
      );

    return importDeclarations;
  }
}
