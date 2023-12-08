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
import { ComponentMetadata, InvalidInputError, reservedWords } from '@aws-amplify/codegen-ui';
import { ImportMapping, ImportValue, ImportSource } from './import-mapping';
import { isPrimitive } from '../primitive';
import { createUniqueName } from '../helpers';
import { ReactRenderConfig } from '../react-render-config';

type ImportCollectionConfig = {
  rendererConfig?: ReactRenderConfig;
};

export class ImportCollection {
  constructor(importConfig?: ImportCollectionConfig) {
    this.importedNames = new Set(reservedWords);
    this.rendererConfig = importConfig?.rendererConfig;
  }

  rendererConfig: ReactRenderConfig | undefined;

  importedNames: Set<string>;

  #collection: Map<string, Set<string>> = new Map();

  importAlias: Map<string, Map<string, string>> = new Map();

  ingestComponentMetadata(componentMetadata: ComponentMetadata) {
    Object.values(componentMetadata?.componentNameToTypeMap || {}).forEach((value) => this.importedNames.add(value));

    // Add form fields so we dont reuse the identifier
    if (componentMetadata?.formMetadata) {
      Object.keys(componentMetadata.formMetadata.fieldConfigs).forEach((value) => this.importedNames.add(value));
    }
  }

  private getOperationsPath(operation: 'mutation' | 'query' | 'subscription' | 'fragment') {
    if (this.rendererConfig?.apiConfiguration?.dataApi === 'GraphQL') {
      switch (operation) {
        case 'mutation':
          return this.rendererConfig.apiConfiguration.mutationsFilePath;
        case 'query':
          return this.rendererConfig.apiConfiguration.queriesFilePath;
        case 'subscription':
          return this.rendererConfig.apiConfiguration.subscriptionsFilePath;
        case 'fragment':
          return this.rendererConfig.apiConfiguration.fragmentsFilePath;
        default:
          throw new InvalidInputError(`Unexpected GraphQL operation encountered: ${operation}`);
      }
    }
    throw new InvalidInputError('Render is not configured to utilize GraphQL operations');
  }

  addMappedImport(...importValue: ImportValue[]) {
    importValue.forEach((value) => {
      const importPackage = ImportMapping[value];
      this.addImport(importPackage, value);
    });
  }

  addGraphqlMutationImport(importName: string) {
    return this.addImport(this.getOperationsPath('mutation'), importName);
  }

  addGraphqlQueryImport(importName: string) {
    return this.addImport(this.getOperationsPath('query'), importName);
  }

  addGraphqlSubscriptionImport(importName: string) {
    return this.addImport(this.getOperationsPath('subscription'), importName);
  }

  addModelImport(importName: string) {
    if (this.rendererConfig?.apiConfiguration?.dataApi === 'GraphQL') {
      return this.addImport(`${this.rendererConfig.apiConfiguration.typesFilePath}`, importName);
    }
    return this.addImport(ImportSource.LOCAL_MODELS, importName);
  }

  addImport(packageName: string, importName: string) {
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

    if (packageName === ImportSource.LOCAL_MODELS) {
      const existingPackageAlias = this.importAlias.get(packageName);
      const existingAlias = existingPackageAlias?.get(importName);
      if (existingAlias) return existingAlias;
      const modelAlias = createUniqueName(
        importName,
        (input) =>
          // Testing if the name is not unique.
          // Props is for testing the primitive types e.g. "TextProps".
          // And test for a matching primitive name value e.g. "Text"
          this.importedNames.has(input) ||
          (input.endsWith('Props') && isPrimitive(input.replace(/Props/g, ''))) ||
          isPrimitive(input),
      );
      if (existingPackageAlias) {
        existingPackageAlias.set(importName, modelAlias);
      } else {
        const aliasMap = new Map();
        aliasMap.set(importName, modelAlias);
        this.importAlias.set(packageName, aliasMap);
      }
      this.importedNames.add(modelAlias);
      return modelAlias;
    }
    return importName;
  }

  removeImportSource(packageImport: ImportSource) {
    this.#collection.delete(packageImport);
  }

  hasPackage(packageName: string) {
    return this.#collection.has(packageName);
  }

  getMappedAlias(packageName: string, importName: string) {
    return this.importAlias.get(packageName)?.get(importName) || importName;
  }

  getMappedModelAlias(importName: string) {
    if (this.rendererConfig?.apiConfiguration?.dataApi === 'GraphQL') {
      return this.getMappedAlias(this.rendererConfig.apiConfiguration?.typesFilePath || '', importName);
    }
    return this.getMappedAlias(ImportSource.LOCAL_MODELS, importName);
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

  getAliasMap(): { model: { [modelName: string]: string } } {
    const modelMap: { [modelName: string]: string } = {};
    const modelSet = this.#collection.get(ImportSource.LOCAL_MODELS);
    const modelAliases = this.importAlias.get(ImportSource.LOCAL_MODELS);
    if (modelSet) {
      [...modelSet].forEach((item) => {
        const alias = modelAliases?.get(item);
        if (alias) modelMap[item] = alias;
      });
    }
    return { model: modelMap };
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
        Array.from(this.#collection)
          .filter(([moduleName]) => moduleName)
          .map(([moduleName, imports]) => {
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
