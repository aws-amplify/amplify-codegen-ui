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
import { getGenericFromDataStore } from '../generic-from-datastore';
import { HasManyRelationshipType } from '../types';
import {
  schemaWithEnums,
  schemaWithNonModels,
  schemaWithRelationships,
  schemaWithRelationshipsV2,
  schemaWithAssumptions,
  schemaWithCPK,
  schemaWithCompositeKeys,
} from './__utils__/mock-schemas';

describe('getGenericFromDataStore', () => {
  it('should map fields', () => {
    const genericSchema = getGenericFromDataStore(schemaWithRelationships);
    expect(genericSchema.models.Child.fields).toStrictEqual({
      id: {
        dataType: 'ID',
        required: true,
        readOnly: false,
        isArray: false,
      },
      name: {
        dataType: 'String',
        required: false,
        readOnly: false,
        isArray: false,
      },
      createdAt: {
        dataType: 'AWSDateTime',
        required: false,
        readOnly: true,
        isArray: false,
      },
      updatedAt: {
        dataType: 'AWSDateTime',
        required: false,
        readOnly: true,
        isArray: false,
      },
    });
  });

  it('should map relationships', () => {
    const genericSchema = getGenericFromDataStore(schemaWithRelationships);

    expect(genericSchema.models.PrimaryCareGiver.fields.Child.relationship).toStrictEqual({
      type: 'HAS_ONE',
      relatedModelName: 'Child',
      associatedFields: ['primaryCareGiverChildId'],
    });

    expect(genericSchema.models.PrimaryCareGiver.fields.primaryCareGiverChildId.relationship).toStrictEqual({
      type: 'HAS_ONE',
      relatedModelName: 'Child',
    });

    expect(genericSchema.models.Student.fields.Teachers.relationship).toStrictEqual<HasManyRelationshipType>({
      type: 'HAS_MANY',
      relatedModelName: 'Teacher',
      relatedModelFields: ['student'],
      canUnlinkAssociatedModel: false,
      relatedJoinFieldName: 'teacher',
      relatedJoinTableName: 'StudentTeacher',
    });

    expect(genericSchema.models.Teacher.fields.students.relationship).toStrictEqual<HasManyRelationshipType>({
      type: 'HAS_MANY',
      relatedModelName: 'Student',
      relatedModelFields: ['teacher'],
      canUnlinkAssociatedModel: false,
      relatedJoinFieldName: 'student',
      relatedJoinTableName: 'StudentTeacher',
    });

    expect(genericSchema.models.Lock.fields.Key.relationship).toStrictEqual({
      type: 'HAS_ONE',
      relatedModelName: 'Key',
      associatedFields: ['lockKeyId'],
    });

    expect(genericSchema.models.Lock.fields.lockKeyId.relationship).toStrictEqual({
      type: 'HAS_ONE',
      relatedModelName: 'Key',
    });

    expect(genericSchema.models.Key.fields.Lock.relationship).toStrictEqual({
      type: 'BELONGS_TO',
      relatedModelName: 'Lock',
      associatedFields: ['keyLockId'],
    });

    expect(genericSchema.models.Owner.fields.Dog.relationship).toStrictEqual<HasManyRelationshipType>({
      type: 'HAS_MANY',
      relatedModelName: 'Dog',
      relatedModelFields: ['ownerID'],
      canUnlinkAssociatedModel: true,
      relatedJoinFieldName: undefined,
      relatedJoinTableName: undefined,
    });

    expect(genericSchema.models.Dog.fields.ownerID.relationship).toStrictEqual({
      type: 'HAS_ONE',
      relatedModelName: 'Owner',
      isHasManyIndex: true,
    });
  });

  it('should map v2 relationships', () => {
    const genericSchema = getGenericFromDataStore(schemaWithRelationshipsV2);

    expect(genericSchema.models.PrimaryCareGiver.fields.Child.relationship).toStrictEqual({
      type: 'HAS_ONE',
      relatedModelName: 'Child',
      associatedFields: ['primaryCareGiverChildId'],
    });

    expect(genericSchema.models.PrimaryCareGiver.fields.primaryCareGiverChildId.relationship).toStrictEqual({
      type: 'HAS_ONE',
      relatedModelName: 'Child',
    });

    expect(genericSchema.models.Student.fields.Teachers.relationship).toStrictEqual<HasManyRelationshipType>({
      type: 'HAS_MANY',
      relatedModelName: 'Teacher',
      relatedModelFields: ['student'],
      canUnlinkAssociatedModel: false,
      relatedJoinFieldName: 'teacher',
      relatedJoinTableName: 'StudentTeacher',
    });

    expect(genericSchema.models.Teacher.fields.students.relationship).toStrictEqual<HasManyRelationshipType>({
      type: 'HAS_MANY',
      relatedModelName: 'Student',
      relatedModelFields: ['teacher'],
      canUnlinkAssociatedModel: false,
      relatedJoinFieldName: 'student',
      relatedJoinTableName: 'StudentTeacher',
    });

    expect(genericSchema.models.Lock.fields.Key.relationship).toStrictEqual({
      type: 'HAS_ONE',
      relatedModelName: 'Key',
      associatedFields: ['lockKeyId'],
    });

    expect(genericSchema.models.Lock.fields.lockKeyId.relationship).toStrictEqual({
      type: 'HAS_ONE',
      relatedModelName: 'Key',
    });

    expect(genericSchema.models.Key.fields.Lock.relationship).toStrictEqual({
      type: 'BELONGS_TO',
      relatedModelName: 'Lock',
      associatedFields: ['keyLockId'],
    });

    expect(genericSchema.models.Owner.fields.Dog.relationship).toStrictEqual<HasManyRelationshipType>({
      type: 'HAS_MANY',
      relatedModelName: 'Dog',
      relatedModelFields: ['ownerID'],
      canUnlinkAssociatedModel: true,
      relatedJoinFieldName: undefined,
      relatedJoinTableName: undefined,
    });

    expect(genericSchema.models.Dog.fields.ownerID.relationship).toStrictEqual({
      type: 'HAS_ONE',
      relatedModelName: 'Owner',
      isHasManyIndex: true,
    });
  });

  it('should map enums', () => {
    const genericSchema = getGenericFromDataStore(schemaWithEnums);

    expect(genericSchema.enums).toStrictEqual(schemaWithEnums.enums);
  });

  it('should map nonModels', () => {
    const genericSchema = getGenericFromDataStore(schemaWithNonModels);
    expect(genericSchema.nonModels).toStrictEqual({
      Reactions: {
        fields: {
          ball: { dataType: 'String', required: false, readOnly: false, isArray: false },
          fireworks: { dataType: 'String', required: false, readOnly: false, isArray: false },
        },
      },
      Misc: { fields: { quotes: { dataType: 'String', required: false, readOnly: false, isArray: true } } },
    });
  });

  it('should handle schema with assumed associated fields and models', () => {
    const genericSchema = getGenericFromDataStore(schemaWithAssumptions);
    const userFields = genericSchema.models.User.fields;

    expect(userFields.friends.relationship).toStrictEqual<HasManyRelationshipType>({
      type: 'HAS_MANY',
      relatedModelName: 'Friend',
      relatedModelFields: ['friendId'],
      canUnlinkAssociatedModel: true,
      relatedJoinFieldName: undefined,
      relatedJoinTableName: undefined,
    });

    expect(userFields.posts.relationship).toStrictEqual<HasManyRelationshipType>({
      type: 'HAS_MANY',
      relatedModelName: 'Post',
      relatedModelFields: ['userPostsId'],
      canUnlinkAssociatedModel: true,
      relatedJoinFieldName: undefined,
      relatedJoinTableName: undefined,
    });
  });

  it('should correctly identify join tables', () => {
    const genericSchema = getGenericFromDataStore(schemaWithRelationships);
    const joinTables = Object.entries(genericSchema.models)
      .filter(([, model]) => model.isJoinTable)
      .map(([name]) => name);
    expect(joinTables).toHaveLength(1);
    expect(joinTables).toStrictEqual(['StudentTeacher']);
  });

  it('should correctly identify primary keys', () => {
    const genericSchema = getGenericFromDataStore(schemaWithCPK);
    const { models } = genericSchema;
    expect(models.CPKStudent.primaryKeys).toStrictEqual(['specialStudentId']);
    expect(models.CPKTeacher.primaryKeys).toStrictEqual(['specialTeacherId']);
  });

  it('should correctly map model with composite keys', () => {
    const genericSchema = getGenericFromDataStore(schemaWithCompositeKeys);
    const { CompositeDog } = genericSchema.models;
    expect(CompositeDog.primaryKeys).toStrictEqual(['name', 'description']);
    expect(CompositeDog.fields.CompositeBowl.relationship).toStrictEqual({
      type: 'HAS_ONE',
      relatedModelName: 'CompositeBowl',
      associatedFields: ['compositeDogCompositeBowlShape', 'compositeDogCompositeBowlSize'],
    });
    expect(CompositeDog.fields.CompositeOwner.relationship).toStrictEqual({
      type: 'BELONGS_TO',
      relatedModelName: 'CompositeOwner',
      associatedFields: ['compositeDogCompositeOwnerLastName', 'compositeDogCompositeOwnerFirstName'],
    });
  });
});
