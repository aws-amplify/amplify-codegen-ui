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
import { GenericDataSchema, GenericDataField } from '@aws-amplify/codegen-ui';
import { FieldConfigMetadata } from '@aws-amplify/codegen-ui/lib/types';
import { factory, NodeFlags, SyntaxKind, ThrowStatement } from 'typescript';
import { lowerCaseFirst } from '../../helpers';
import { ImportCollection } from '../../imports';
import { isModelDataType } from './render-checkers';
import { getRecordName } from './form-state';
import { DataApiKind } from '../../react-render-config';
import { ActionType, getGraphqlCallExpression } from '../../utils/graphql';

function getFieldBiDirectionalWith({
  modelName,
  dataSchema,
  fieldConfig,
}: {
  modelName: string;
  dataSchema: GenericDataSchema;
  fieldConfig: [string, FieldConfigMetadata];
}):
  | {
      relatedModelName: string;
      fieldBiDirectionalWithName: string;
      fieldBiDirectionalWith: GenericDataField;
      associatedFieldsBiDirectionalWith: string[];
      fieldBiDirectionalWithPrimaryKeys: string[];
    }
  | undefined {
  const [, fieldConfigMetaData] = fieldConfig;

  if (
    isModelDataType(fieldConfigMetaData) &&
    fieldConfigMetaData.relationship &&
    (fieldConfigMetaData.relationship.type === 'HAS_ONE' || fieldConfigMetaData.relationship.type === 'BELONGS_TO')
  ) {
    const { relatedModelName } = fieldConfigMetaData.relationship;
    const fieldBiDirectionalWith = Object.entries(dataSchema.models[relatedModelName]?.fields ?? {}).find(
      ([, fieldInfo]) => {
        if (
          typeof fieldInfo.dataType === 'object' &&
          'model' in fieldInfo.dataType &&
          fieldInfo.dataType.model === modelName &&
          fieldConfigMetaData.relationship &&
          (fieldConfigMetaData.relationship.type === 'HAS_ONE' ||
            fieldConfigMetaData.relationship.type === 'BELONGS_TO')
        ) {
          return true;
        }
        return false;
      },
    );
    if (!fieldBiDirectionalWith) {
      return undefined;
    }
    const [name, field] = fieldBiDirectionalWith;
    if (field.relationship?.type === 'HAS_ONE' || field.relationship?.type === 'BELONGS_TO') {
      return {
        relatedModelName,
        fieldBiDirectionalWithName: name,
        fieldBiDirectionalWith: field,
        fieldBiDirectionalWithPrimaryKeys: dataSchema.models[relatedModelName].primaryKeys,
        associatedFieldsBiDirectionalWith: field.relationship.associatedFields
          ? field.relationship.associatedFields
          : [],
      };
    }
  }

  return undefined;
}

function unlinkModelRecordExpression({
  modelName,
  primaryKeys,
  recordNameToUnlink,
  fieldName,
  associatedFields,
  importCollection,
  dataApi,
  renderConfigDependencies,
}: {
  modelName: string;
  primaryKeys: string[];
  recordNameToUnlink: string;
  fieldName: string;
  associatedFields: string[];
  importCollection: ImportCollection;
  dataApi?: DataApiKind;
  renderConfigDependencies?: { [key: string]: string };
}) {
  if (dataApi === 'GraphQL') {
    const inputs = [
      ...primaryKeys.map((primaryKey) =>
        factory.createPropertyAssignment(
          factory.createIdentifier(primaryKey),
          factory.createPropertyAccessChain(factory.createIdentifier(recordNameToUnlink), undefined, primaryKey),
        ),
      ),
      ...associatedFields.map((field) =>
        factory.createPropertyAssignment(factory.createIdentifier(field), factory.createNull()),
      ),
    ];

    return factory.createExpressionStatement(
      factory.createCallExpression(
        factory.createPropertyAccessExpression(factory.createIdentifier('promises'), factory.createIdentifier('push')),
        undefined,
        [
          getGraphqlCallExpression(
            ActionType.UPDATE,
            modelName,
            importCollection,
            { inputs },
            undefined,
            renderConfigDependencies,
          ),
        ],
      ),
    );
  }

  return factory.createExpressionStatement(
    factory.createCallExpression(
      factory.createPropertyAccessExpression(factory.createIdentifier('promises'), factory.createIdentifier('push')),
      undefined,
      [
        factory.createCallExpression(
          factory.createPropertyAccessExpression(
            factory.createIdentifier('DataStore'),
            factory.createIdentifier('save'),
          ),
          undefined,
          [
            factory.createCallExpression(
              factory.createPropertyAccessExpression(
                factory.createIdentifier(modelName),
                factory.createIdentifier('copyOf'),
              ),
              undefined,
              [
                factory.createIdentifier(recordNameToUnlink),
                factory.createArrowFunction(
                  undefined,
                  undefined,
                  [
                    factory.createParameterDeclaration(
                      undefined,
                      undefined,
                      undefined,
                      factory.createIdentifier('updated'),
                      undefined,
                      undefined,
                      undefined,
                    ),
                  ],
                  undefined,
                  factory.createToken(SyntaxKind.EqualsGreaterThanToken),
                  factory.createBlock(
                    [
                      factory.createExpressionStatement(
                        factory.createBinaryExpression(
                          factory.createPropertyAccessExpression(
                            factory.createIdentifier('updated'),
                            factory.createIdentifier(fieldName),
                          ),
                          factory.createToken(SyntaxKind.EqualsToken),
                          factory.createIdentifier('undefined'),
                        ),
                      ),
                      ...associatedFields.map((field) =>
                        factory.createExpressionStatement(
                          factory.createBinaryExpression(
                            factory.createPropertyAccessExpression(
                              factory.createIdentifier('updated'),
                              factory.createIdentifier(field),
                            ),
                            factory.createToken(SyntaxKind.EqualsToken),
                            factory.createIdentifier('undefined'),
                          ),
                        ),
                      ),
                    ],
                    true,
                  ),
                ),
              ],
            ),
          ],
        ),
      ],
    ),
  );
}

function unlinkModelThrowErrorExpression(
  relatedModelName: string,
  relatedRecordToLink: string,
  modelName: string,
  primaryKey: string,
  isFieldRequired: boolean,
) {
  // Dog dkflj423dfl cannot be unlinked because Dog requires an Owner.
  // "Image 398038 cannot be linked to FakeModel because it is already linked to another FakeModel"
  return factory.createThrowStatement(
    factory.createCallExpression(factory.createIdentifier('Error'), undefined, [
      factory.createTemplateExpression(factory.createTemplateHead(`${relatedModelName} `), [
        factory.createTemplateSpan(
          factory.createPropertyAccessExpression(
            factory.createIdentifier(relatedRecordToLink),
            factory.createIdentifier(primaryKey),
          ),
          factory.createTemplateTail(
            isFieldRequired
              ? ` cannot be unlinked because ${relatedModelName} requires ${modelName}.`
              : ` cannot be linked to ${modelName} because it is already linked to another ${modelName}.`,
          ),
        ),
      ]),
    ]),
  );
}

/*
 if (JSON.stringify(imageToUnlink) !== JSON.stringify(imageRecord)) {
        //throwExpression
    }
 */
function wrapThrowInIfStatement({
  thisModelRecordToUnlink,
  currentRecord,
  throwExpression,
}: {
  thisModelRecordToUnlink: string;
  currentRecord: string;
  throwExpression: ThrowStatement;
}) {
  return factory.createIfStatement(
    factory.createBinaryExpression(
      factory.createCallExpression(
        factory.createPropertyAccessExpression(factory.createIdentifier('JSON'), factory.createIdentifier('stringify')),
        undefined,
        [factory.createIdentifier(thisModelRecordToUnlink)],
      ),
      factory.createToken(SyntaxKind.ExclamationEqualsEqualsToken),
      factory.createCallExpression(
        factory.createPropertyAccessExpression(factory.createIdentifier('JSON'), factory.createIdentifier('stringify')),
        undefined,
        [factory.createIdentifier(currentRecord)],
      ),
    ),
    factory.createBlock([throwExpression], true),
    undefined,
  );
}

function linkModelRecordExpression({
  importedRelatedModelName,
  relatedRecordToLink,
  fieldBiDirectionalWithName,
  fieldName,
  currentRecord,
  importCollection,
  primaryKeys,
  associatedPrimaryKeys,
  associatedFieldsBiDirectionalWith,
  dataApi,
  renderConfigDependencies,
}: {
  importedRelatedModelName: string;
  relatedRecordToLink: string;
  fieldBiDirectionalWithName: string;
  fieldName: string;
  currentRecord: string;
  importCollection: ImportCollection;
  primaryKeys: string[];
  associatedPrimaryKeys: string[];
  associatedFieldsBiDirectionalWith: string[];
  dataApi?: DataApiKind;
  renderConfigDependencies?: { [key: string]: string };
}) {
  if (dataApi === 'GraphQL') {
    const inputs = [
      ...associatedPrimaryKeys.map((associatedPrimaryKey) =>
        factory.createPropertyAssignment(
          factory.createIdentifier(associatedPrimaryKey),
          factory.createPropertyAccessChain(factory.createIdentifier(fieldName), undefined, associatedPrimaryKey),
        ),
      ),
      ...associatedFieldsBiDirectionalWith.map((associatedField, index) =>
        factory.createPropertyAssignment(
          factory.createIdentifier(associatedField),
          factory.createPropertyAccessChain(factory.createIdentifier(currentRecord), undefined, primaryKeys[index]),
        ),
      ),
    ];

    return factory.createExpressionStatement(
      factory.createCallExpression(
        factory.createPropertyAccessExpression(factory.createIdentifier('promises'), factory.createIdentifier('push')),
        undefined,
        [
          getGraphqlCallExpression(
            ActionType.UPDATE,
            importedRelatedModelName,
            importCollection,
            { inputs },
            undefined,
            renderConfigDependencies,
          ),
        ],
      ),
    );
  }

  return factory.createExpressionStatement(
    factory.createCallExpression(
      factory.createPropertyAccessExpression(factory.createIdentifier('promises'), factory.createIdentifier('push')),
      undefined,
      [
        factory.createCallExpression(
          factory.createPropertyAccessExpression(
            factory.createIdentifier('DataStore'),
            factory.createIdentifier('save'),
          ),
          undefined,
          [
            factory.createCallExpression(
              factory.createPropertyAccessExpression(
                factory.createIdentifier(importedRelatedModelName),
                factory.createIdentifier('copyOf'),
              ),
              undefined,
              [
                factory.createIdentifier(relatedRecordToLink),
                factory.createArrowFunction(
                  undefined,
                  undefined,
                  [
                    factory.createParameterDeclaration(
                      undefined,
                      undefined,
                      undefined,
                      factory.createIdentifier('updated'),
                      undefined,
                      undefined,
                      undefined,
                    ),
                  ],
                  undefined,
                  factory.createToken(SyntaxKind.EqualsGreaterThanToken),
                  factory.createBlock(
                    [
                      factory.createExpressionStatement(
                        factory.createBinaryExpression(
                          factory.createPropertyAccessExpression(
                            factory.createIdentifier('updated'),
                            factory.createIdentifier(fieldBiDirectionalWithName),
                          ),
                          factory.createToken(SyntaxKind.EqualsToken),
                          factory.createIdentifier(currentRecord),
                        ),
                      ),
                    ],
                    true,
                  ),
                ),
              ],
            ),
          ],
        ),
      ],
    ),
  );
}

export function getBiDirectionalRelationshipStatements({
  formActionType,
  dataSchema,
  importCollection,
  fieldConfig,
  modelName,
  savedRecordName,
  thisModelPrimaryKeys,
  dataApi,
  renderConfigDependencies,
}: {
  formActionType: 'create' | 'update';
  dataSchema: GenericDataSchema;
  importCollection: ImportCollection;
  fieldConfig: [string, FieldConfigMetadata];
  modelName: string;
  savedRecordName: string;
  thisModelPrimaryKeys: string[];
  dataApi?: DataApiKind;
  renderConfigDependencies?: { [key: string]: string };
}) {
  const getFieldBiDirectionalWithReturnValue = getFieldBiDirectionalWith({
    modelName,
    dataSchema,
    fieldConfig,
  });

  if (!getFieldBiDirectionalWithReturnValue) {
    return [];
  }

  const currentRecord = formActionType === 'update' ? getRecordName(modelName) : savedRecordName;

  const {
    relatedModelName,
    fieldBiDirectionalWithName,
    associatedFieldsBiDirectionalWith,
    fieldBiDirectionalWith,
    fieldBiDirectionalWithPrimaryKeys,
  } = getFieldBiDirectionalWithReturnValue;
  const [fieldName, { relationship }] = fieldConfig;
  const importedRelatedModelName = importCollection.getMappedModelAlias(relatedModelName);
  const importedThisModelName = importCollection.getMappedModelAlias(modelName);
  // TODO: setting associated fields to `undefined` is a workaround.
  // remove after DataStore addresses issue: https://github.com/aws-amplify/amplify-js/issues/10750
  const associatedFields =
    (relationship?.type === 'HAS_ONE' || relationship?.type === 'BELONGS_TO') && relationship.associatedFields
      ? relationship.associatedFields
      : [];

  const isFieldRequired = dataSchema.models[modelName].fields[fieldName].required;
  const isFieldBiDirectionalWithRequired = fieldBiDirectionalWith.required;
  const statements: any[] = [];

  if (formActionType === 'update') {
    const relatedRecordToUnlink = `${lowerCaseFirst(relatedModelName)}ToUnlink`;
    /**
          const compositeOwnerToUnlink = await compositeDogRecord.CompositeOwner;
          if(compositeOwnerToUnlink) {
           promises.push( DataStore.save(CompositeOwner0.copyOf(compositeOwnerToUnlink, (updated) => {
              updated.compositeOwnerCompositeDogName = undefined;
              updated.compositeOwnerCompositeDogDescription = undefined;
              updated.CompositeDog = undefined;
            })))
          }
         */
    statements.push(
      ...[
        factory.createVariableStatement(
          undefined,
          factory.createVariableDeclarationList(
            [
              factory.createVariableDeclaration(
                factory.createIdentifier(relatedRecordToUnlink),
                undefined,
                undefined,
                factory.createAwaitExpression(
                  factory.createPropertyAccessExpression(
                    factory.createIdentifier(currentRecord),
                    factory.createIdentifier(fieldName),
                  ),
                ),
              ),
            ],
            NodeFlags.Const,
          ),
        ),
        factory.createIfStatement(
          factory.createIdentifier(relatedRecordToUnlink),
          factory.createBlock(
            [
              isFieldBiDirectionalWithRequired
                ? wrapThrowInIfStatement({
                    currentRecord: `modelFields.${fieldName}`,
                    thisModelRecordToUnlink: relatedRecordToUnlink,
                    throwExpression: unlinkModelThrowErrorExpression(
                      relatedModelName,
                      relatedRecordToUnlink,
                      modelName,
                      fieldBiDirectionalWithPrimaryKeys[0],
                      isFieldBiDirectionalWithRequired,
                    ),
                  })
                : unlinkModelRecordExpression({
                    modelName: importedRelatedModelName,
                    primaryKeys: thisModelPrimaryKeys,
                    recordNameToUnlink: relatedRecordToUnlink,
                    fieldName: fieldBiDirectionalWithName,
                    associatedFields: associatedFieldsBiDirectionalWith,
                    importCollection,
                    dataApi,
                    renderConfigDependencies,
                  }),
            ],
            true,
          ),
          undefined,
        ),
      ],
    );
  }

  /** GraphQL:
          const compositeOwnerToLink = modelFields.CompositeOwner;
          if (compositeOwnerToLink) {
            promises.push(API.graphql({
              query: updateCompositeOwner0,
              variables: { input: { ...ownerToLink, Dog: dog }},
            }))
  
            const compositeDogToUnlink = await compositeOwnerToLink.CompositeDog;
            if (compositeDogToUnlink) {
              promises.push(API.graphql({
                query: updateCompositeDog,
                variables: { input: {
                  ...compositeDogToUnlink,
                  compositeDogCompositeOwnerLastName: undefined,
                  compositeDogCompositeOwnerFirstName: undefined,
                  CompositeOwner: undefined,
                }}
              }))
            }
          }
   */

  /** Datatstore:
          const compositeOwnerToLink = modelFields.CompositeOwner;
          if (compositeOwnerToLink) {
            promises.push(DataStore.save(CompositeOwner0.copyOf(compositeOwnerToLink, (updated) => {
              updated.CompositeDog = compositeDogRecord;
            })))
  
            const compositeDogToUnlink = await compositeOwnerToLink.CompositeDog;
            if (compositeDogToUnlink) {
              promises.push(DataStore.save(CompositeDog.copyOf(compositeDogToUnlink, (updated) => {
                updated.compositeDogCompositeOwnerLastName = undefined;
                updated.compositeDogCompositeOwnerFirstName = undefined;
                updated.CompositeOwner = undefined;
              })))
            }
          }
     */
  const relatedRecordToLink = `${lowerCaseFirst(relatedModelName)}ToLink`;
  const thisModelRecordToUnlink = `${lowerCaseFirst(modelName)}ToUnlink`;

  statements.push(
    ...[
      factory.createVariableStatement(
        undefined,
        factory.createVariableDeclarationList(
          [
            factory.createVariableDeclaration(
              factory.createIdentifier(relatedRecordToLink),
              undefined,
              undefined,
              factory.createPropertyAccessExpression(
                factory.createIdentifier('modelFields'),
                factory.createIdentifier(fieldName),
              ),
            ),
          ],
          NodeFlags.Const,
        ),
      ),
      factory.createIfStatement(
        factory.createIdentifier(relatedRecordToLink),
        factory.createBlock(
          [
            linkModelRecordExpression({
              importedRelatedModelName,
              relatedRecordToLink,
              fieldBiDirectionalWithName,
              fieldName,
              currentRecord,
              importCollection,
              primaryKeys: thisModelPrimaryKeys,
              associatedPrimaryKeys: fieldBiDirectionalWithPrimaryKeys,
              associatedFieldsBiDirectionalWith,
              dataApi,
              renderConfigDependencies,
            }),
            factory.createVariableStatement(
              undefined,
              factory.createVariableDeclarationList(
                [
                  factory.createVariableDeclaration(
                    factory.createIdentifier(thisModelRecordToUnlink),
                    undefined,
                    undefined,
                    factory.createAwaitExpression(
                      factory.createPropertyAccessExpression(
                        factory.createIdentifier(relatedRecordToLink),
                        factory.createIdentifier(fieldBiDirectionalWithName),
                      ),
                    ),
                  ),
                ],
                NodeFlags.Const,
              ),
            ),
            factory.createIfStatement(
              factory.createIdentifier(thisModelRecordToUnlink),
              factory.createBlock(
                [
                  isFieldRequired
                    ? wrapThrowInIfStatement({
                        thisModelRecordToUnlink,
                        currentRecord,
                        throwExpression: unlinkModelThrowErrorExpression(
                          relatedModelName,
                          relatedRecordToLink,
                          modelName,
                          fieldBiDirectionalWithPrimaryKeys[0],
                          isFieldBiDirectionalWithRequired,
                        ),
                      })
                    : unlinkModelRecordExpression({
                        modelName: importedThisModelName,
                        primaryKeys: thisModelPrimaryKeys,
                        recordNameToUnlink: thisModelRecordToUnlink,
                        fieldName,
                        associatedFields,
                        importCollection,
                        dataApi,
                        renderConfigDependencies,
                      }),
                ],
                true,
              ),
              undefined,
            ),
          ],
          true,
        ),
        undefined,
      ),
    ],
  );

  return statements;
}
