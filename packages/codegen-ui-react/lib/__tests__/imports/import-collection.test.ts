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
import { ImportCollection, ImportSource } from '../../imports';
import { assertASTMatchesSnapshot, rendererConfigWithGraphQL } from '../__utils__';

function assertImportCollectionMatchesSnapshot(importCollection: ImportCollection) {
  assertASTMatchesSnapshot(importCollection.buildImportStatements());
}

describe('ImportCollection', () => {
  describe('buildImportStatements', () => {
    test('no imports', () => {
      const importCollection = new ImportCollection();
      assertImportCollectionMatchesSnapshot(importCollection);
    });

    test('multiple imports', () => {
      const importCollection = new ImportCollection();
      importCollection.addImport('@aws-amplify/ui-react', 'Button');
      importCollection.addImport('@aws-amplify/ui-react', 'getOverrideProps');
      importCollection.addImport('../models', 'User');
      assertImportCollectionMatchesSnapshot(importCollection);
    });
  });

  describe('addImport', () => {
    test('one import', () => {
      const importCollection = new ImportCollection();
      importCollection.addImport('@aws-amplify/ui-react', 'Text');
      assertImportCollectionMatchesSnapshot(importCollection);
    });

    test('one relative import', () => {
      const importCollection = new ImportCollection();
      importCollection.addImport('../models', 'User');
      assertImportCollectionMatchesSnapshot(importCollection);
    });

    test('multiple imports', () => {
      const importCollection = new ImportCollection();
      importCollection.addImport('@aws-amplify/ui-react', 'Text');
      importCollection.addImport('../models', 'User');
      assertImportCollectionMatchesSnapshot(importCollection);
    });

    test('multiple identical imports', () => {
      const importCollection = new ImportCollection();
      importCollection.addImport('@aws-amplify/ui-react', 'Text');
      importCollection.addImport('@aws-amplify/ui-react', 'Text');
      assertImportCollectionMatchesSnapshot(importCollection);
    });

    test('multiple imports from the same package', () => {
      const importCollection = new ImportCollection();
      importCollection.addImport('@aws-amplify/ui-react', 'Text');
      importCollection.addImport('@aws-amplify/ui-react', 'getOverrideProps');
      assertImportCollectionMatchesSnapshot(importCollection);
    });
    test('model imports colliding with exisiting imports', () => {
      const importCollection = new ImportCollection();
      importCollection.ingestComponentMetadata({
        componentNameToTypeMap: { TextInput: 'TextField' },
        hasAuthBindings: false,
        requiredDataModels: [],
        stateReferences: [],
      });
      importCollection.addImport(ImportSource.LOCAL_MODELS, 'TextField0');
      importCollection.addImport(ImportSource.LOCAL_MODELS, 'TextField');
      importCollection.addImport(ImportSource.LOCAL_MODELS, 'TestModel');
      importCollection.addImport(ImportSource.LOCAL_MODELS, 'ButtonProps');
      importCollection.addImport(ImportSource.LOCAL_MODELS, 'React');
      expect(importCollection.getMappedAlias(ImportSource.LOCAL_MODELS, 'TextField')).toEqual('TextField1');
      expect(importCollection.getMappedAlias(ImportSource.LOCAL_MODELS, 'TextField0')).toEqual('TextField0');
      expect(importCollection.getMappedAlias(ImportSource.LOCAL_MODELS, 'TestModel')).toEqual('TestModel');
      expect(importCollection.getMappedAlias(ImportSource.LOCAL_MODELS, 'ButtonProps')).toEqual('ButtonProps0');
      expect(importCollection.getMappedAlias(ImportSource.LOCAL_MODELS, 'React')).toEqual('React0');
    });
  });

  test('mergeCollections', () => {
    const collectionA = new ImportCollection();
    const collectionB = new ImportCollection();

    collectionA.addImport('@aws-amplify/ui-react', 'Text');
    collectionA.addImport('@aws-amplify/ui-react', 'getOverrideProps');
    collectionA.addImport('../models', 'User');

    collectionB.addImport('@aws-amplify/ui-react', 'Button');
    collectionB.addImport('../models', 'User');

    collectionA.mergeCollections(collectionB);

    assertImportCollectionMatchesSnapshot(collectionA);
  });

  describe('addGraphqlMutationImport', () => {
    it('should import mutation correctly', () => {
      const importCollection = new ImportCollection({ rendererConfig: rendererConfigWithGraphQL });
      importCollection.addGraphqlMutationImport('createPost');
      assertImportCollectionMatchesSnapshot(importCollection);
    });
  });

  describe('addGraphqlQueryImport', () => {
    it('should import query correctly', () => {
      const importCollection = new ImportCollection({ rendererConfig: rendererConfigWithGraphQL });
      importCollection.addGraphqlQueryImport('listPosts');
      assertImportCollectionMatchesSnapshot(importCollection);
    });
  });

  describe('addGraphqlSubscriptionImport', () => {
    it('should import subscription correctly', () => {
      const importCollection = new ImportCollection({ rendererConfig: rendererConfigWithGraphQL });
      importCollection.addGraphqlSubscriptionImport('onCreatePost');
      assertImportCollectionMatchesSnapshot(importCollection);
    });
  });

  describe('addModelImport', () => {
    it('should use path from rendererConfig if using GraphQL', () => {
      const importCollection = new ImportCollection({ rendererConfig: rendererConfigWithGraphQL });
      importCollection.addModelImport('Post');
      assertImportCollectionMatchesSnapshot(importCollection);
    });

    it('should use local models constant if using DataStore', () => {
      const importCollection = new ImportCollection();
      importCollection.addModelImport('Post');
      assertImportCollectionMatchesSnapshot(importCollection);
    });
  });

  describe('getMappedModelAlias', () => {
    it('should successfully retrieve model alias when using DataStore', () => {
      const importCollection = new ImportCollection();
      importCollection.ingestComponentMetadata({
        componentNameToTypeMap: { TextInput: 'TextField' },
        hasAuthBindings: false,
        requiredDataModels: [],
        stateReferences: [],
      });
      importCollection.addModelImport('TextField0');
      importCollection.addModelImport('TextField');
      importCollection.addModelImport('TestModel');
      importCollection.addModelImport('ButtonProps');
      importCollection.addModelImport('React');
      expect(importCollection.getMappedModelAlias('TextField')).toEqual('TextField1');
      expect(importCollection.getMappedModelAlias('TestModel')).toEqual('TestModel');
      expect(importCollection.getMappedModelAlias('TextField0')).toEqual('TextField0');
      expect(importCollection.getMappedModelAlias('ButtonProps')).toEqual('ButtonProps0');
      expect(importCollection.getMappedModelAlias('React')).toEqual('React0');
    });

    // TODO: import collection currently does not alias import collisions
    //   unless it's explicitly for the ImportSource.LOCAL_MODELS package
    it('should successfully retrieve model alias when using GraphQL', () => {
      const importCollection = new ImportCollection({ rendererConfig: rendererConfigWithGraphQL });
      // importCollection.ingestComponentMetadata({
      //   componentNameToTypeMap: { TextInput: 'TextField' },
      //   hasAuthBindings: false,
      //   requiredDataModels: [],
      //   stateReferences: [],
      // });
      // importCollection.addModelImport('TextField0');
      // importCollection.addModelImport('TextField');
      importCollection.addModelImport('TestModel');
      // importCollection.addModelImport('ButtonProps');
      // importCollection.addModelImport('React');
      // expect(importCollection.getMappedModelAlias('TextField')).toEqual('TextField1');
      expect(importCollection.getMappedModelAlias('TestModel')).toEqual('TestModel');
      // expect(importCollection.getMappedModelAlias('TextField0')).toEqual('TextField0');
      // expect(importCollection.getMappedModelAlias('ButtonProps')).toEqual('ButtonProps0');
      // expect(importCollection.getMappedModelAlias('React')).toEqual('React0');
    });
  });

  test('buildSampleSnippetImports', () => {
    const importCollection = new ImportCollection();
    assertASTMatchesSnapshot(importCollection.buildSampleSnippetImports('MyButton'));
  });
});
