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
import { schemaWithEnums, schemaWithNonModels, schemaWithRelationships } from './__utils__/mock-schemas';

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
    });

    expect(genericSchema.models.PrimaryCareGiver.fields.primaryCareGiverChildId.relationship).toStrictEqual({
      type: 'HAS_ONE',
      relatedModelName: 'Child',
    });

    expect(genericSchema.models.Student.fields.Teachers.relationship).toStrictEqual<HasManyRelationshipType>({
      type: 'HAS_MANY',
      relatedModelName: 'Teacher',
      relatedModelField: 'student',
    });

    expect(genericSchema.models.Teacher.fields.students.relationship).toStrictEqual<HasManyRelationshipType>({
      type: 'HAS_MANY',
      relatedModelName: 'Student',
      relatedModelField: 'teacher',
    });

    expect(genericSchema.models.Lock.fields.Key.relationship).toStrictEqual({
      type: 'HAS_ONE',
      relatedModelName: 'Key',
    });

    expect(genericSchema.models.Lock.fields.lockKeyId.relationship).toStrictEqual({
      type: 'HAS_ONE',
      relatedModelName: 'Key',
    });

    expect(genericSchema.models.Key.fields.Lock.relationship).toStrictEqual({
      type: 'BELONGS_TO',
      relatedModelName: 'Lock',
    });

    expect(genericSchema.models.Owner.fields.Dog.relationship).toStrictEqual<HasManyRelationshipType>({
      type: 'HAS_MANY',
      relatedModelName: 'Dog',
      relatedModelField: 'ownerID',
    });

    expect(genericSchema.models.Dog.fields.ownerID.relationship).toStrictEqual({
      type: 'HAS_ONE',
      relatedModelName: 'Owner',
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
});
