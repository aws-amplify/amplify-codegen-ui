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
    for (let [key, value] of otherCollection.#collection) {
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

    for (let [key, value] of this.#collection) {
      importDeclarations.push(
        createImportDeclaration(
          undefined,
          undefined,
          factory.createImportClause(
            undefined,
            factory.createNamedImports(
              [...value].map((item) => {
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
