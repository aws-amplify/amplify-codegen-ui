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
import { factory } from 'typescript';
import { GenericDataRelationshipType } from '@aws-amplify/codegen-ui';
import { ImportCollection, ImportValue } from '../../imports';
import { getRecordsName } from './form-state';
import { buildBaseCollectionVariableStatement } from '../../react-studio-template-renderer-helper';

export const buildRelationshipQuery = (
  relationship: GenericDataRelationshipType,
  importCollection: ImportCollection,
) => {
  const { relatedModelName } = relationship;
  importCollection.addMappedImport(ImportValue.USE_DATA_STORE_BINDING);
  const itemsName = getRecordsName(relatedModelName);
  const objectProperties = [
    factory.createPropertyAssignment(factory.createIdentifier('type'), factory.createStringLiteral('collection')),
    factory.createPropertyAssignment(factory.createIdentifier('model'), factory.createIdentifier(relatedModelName)),
  ];
  return buildBaseCollectionVariableStatement(
    itemsName,
    factory.createCallExpression(factory.createIdentifier('useDataStoreBinding'), undefined, [
      factory.createObjectLiteralExpression(objectProperties, true),
    ]),
  );
};
