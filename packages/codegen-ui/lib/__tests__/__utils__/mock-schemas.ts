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
import type { Schema } from '@aws-amplify/datastore';

export const postSchema: Schema = {
  models: {
    Post: {
      name: 'Post',
      fields: {
        id: {
          name: 'id',
          isArray: false,
          type: 'ID',
          isRequired: true,
          attributes: [],
        },
        caption: {
          name: 'caption',
          isArray: false,
          type: 'String',
          isRequired: false,
          attributes: [],
        },
        username: {
          name: 'username',
          isArray: false,
          type: 'String',
          isRequired: false,
          attributes: [],
        },
        post_url: {
          name: 'post_url',
          isArray: false,
          type: 'AWSURL',
          isRequired: false,
          attributes: [],
        },
        profile_url: {
          name: 'profile_url',
          isArray: false,
          type: 'AWSURL',
          isRequired: false,
          attributes: [],
        },
        status: {
          name: 'status',
          isArray: false,
          type: {
            enum: 'PostStatus',
          },
          isRequired: false,
          attributes: [],
        },
        createdAt: {
          name: 'createdAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
        updatedAt: {
          name: 'updatedAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
      },
      syncable: true,
      pluralName: 'Posts',
      attributes: [
        {
          type: 'model',
          properties: {},
        },
        {
          type: 'auth',
          properties: {
            rules: [
              {
                allow: 'private',
                provider: 'iam',
                operations: ['create', 'update', 'delete', 'read'],
              },
            ],
          },
        },
      ],
    },
  },
  enums: {
    PostStatus: {
      name: 'PostStatus',
      values: ['PENDING', 'POSTED', 'IN_REVIEW'],
    },
  },
  nonModels: {},
  version: '000000',
  codegenVersion: '000000',
};

export const schemaWithRelationships: Schema = {
  models: {
    PrimaryCareGiver: {
      name: 'PrimaryCareGiver',
      fields: {
        id: {
          name: 'id',
          isArray: false,
          type: 'ID',
          isRequired: true,
          attributes: [],
        },
        name: {
          name: 'name',
          isArray: false,
          type: 'String',
          isRequired: false,
          attributes: [],
        },
        Child: {
          name: 'Child',
          isArray: false,
          type: {
            model: 'Child',
          },
          isRequired: false,
          attributes: [],
          association: {
            connectionType: 'HAS_ONE',
            associatedWith: 'id',
            targetName: 'primaryCareGiverChildId',
          },
        },
        createdAt: {
          name: 'createdAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
        updatedAt: {
          name: 'updatedAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
        primaryCareGiverChildId: {
          name: 'primaryCareGiverChildId',
          isArray: false,
          type: 'ID',
          isRequired: false,
          attributes: [],
        },
      },
      syncable: true,
      pluralName: 'PrimaryCareGivers',
      attributes: [
        {
          type: 'model',
          properties: {},
        },
        {
          type: 'auth',
          properties: {
            rules: [
              {
                allow: 'public',
                operations: ['create', 'update', 'delete', 'read'],
              },
            ],
          },
        },
      ],
    },
    Child: {
      name: 'Child',
      fields: {
        id: {
          name: 'id',
          isArray: false,
          type: 'ID',
          isRequired: true,
          attributes: [],
        },
        name: {
          name: 'name',
          isArray: false,
          type: 'String',
          isRequired: false,
          attributes: [],
        },
        createdAt: {
          name: 'createdAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
        updatedAt: {
          name: 'updatedAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
      },
      syncable: true,
      pluralName: 'Children',
      attributes: [
        {
          type: 'model',
          properties: {},
        },
        {
          type: 'auth',
          properties: {
            rules: [
              {
                allow: 'public',
                operations: ['create', 'update', 'delete', 'read'],
              },
            ],
          },
        },
      ],
    },
    Student: {
      name: 'Student',
      fields: {
        id: {
          name: 'id',
          isArray: false,
          type: 'ID',
          isRequired: true,
          attributes: [],
        },
        name: {
          name: 'name',
          isArray: false,
          type: 'String',
          isRequired: false,
          attributes: [],
        },
        Teachers: {
          name: 'Teachers',
          isArray: true,
          type: {
            model: 'StudentTeacher',
          },
          isRequired: false,
          attributes: [],
          isArrayNullable: true,
          association: {
            connectionType: 'HAS_MANY',
            associatedWith: 'student',
          },
        },
        createdAt: {
          name: 'createdAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
        updatedAt: {
          name: 'updatedAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
      },
      syncable: true,
      pluralName: 'Students',
      attributes: [
        {
          type: 'model',
          properties: {},
        },
        {
          type: 'auth',
          properties: {
            rules: [
              {
                allow: 'public',
                operations: ['create', 'update', 'delete', 'read'],
              },
            ],
          },
        },
      ],
    },
    Teacher: {
      name: 'Teacher',
      fields: {
        id: {
          name: 'id',
          isArray: false,
          type: 'ID',
          isRequired: true,
          attributes: [],
        },
        name: {
          name: 'name',
          isArray: false,
          type: 'String',
          isRequired: false,
          attributes: [],
        },
        students: {
          name: 'students',
          isArray: true,
          type: {
            model: 'StudentTeacher',
          },
          isRequired: false,
          attributes: [],
          isArrayNullable: true,
          association: {
            connectionType: 'HAS_MANY',
            associatedWith: 'teacher',
          },
        },
        createdAt: {
          name: 'createdAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
        updatedAt: {
          name: 'updatedAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
      },
      syncable: true,
      pluralName: 'Teachers',
      attributes: [
        {
          type: 'model',
          properties: {},
        },
        {
          type: 'auth',
          properties: {
            rules: [
              {
                allow: 'public',
                operations: ['create', 'update', 'delete', 'read'],
              },
            ],
          },
        },
      ],
    },
    Lock: {
      name: 'Lock',
      fields: {
        id: {
          name: 'id',
          isArray: false,
          type: 'ID',
          isRequired: true,
          attributes: [],
        },
        Key: {
          name: 'Key',
          isArray: false,
          type: {
            model: 'Key',
          },
          isRequired: false,
          attributes: [],
          association: {
            connectionType: 'HAS_ONE',
            associatedWith: 'Lock',
            targetName: 'lockKeyId',
          },
        },
        createdAt: {
          name: 'createdAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
        updatedAt: {
          name: 'updatedAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
        lockKeyId: {
          name: 'lockKeyId',
          isArray: false,
          type: 'ID',
          isRequired: false,
          attributes: [],
        },
      },
      syncable: true,
      pluralName: 'Locks',
      attributes: [
        {
          type: 'model',
          properties: {},
        },
        {
          type: 'auth',
          properties: {
            rules: [
              {
                allow: 'public',
                operations: ['create', 'update', 'delete', 'read'],
              },
            ],
          },
        },
      ],
    },
    Key: {
      name: 'Key',
      fields: {
        id: {
          name: 'id',
          isArray: false,
          type: 'ID',
          isRequired: true,
          attributes: [],
        },
        name: {
          name: 'name',
          isArray: false,
          type: 'String',
          isRequired: false,
          attributes: [],
        },
        Lock: {
          name: 'Lock',
          isArray: false,
          type: {
            model: 'Lock',
          },
          isRequired: false,
          attributes: [],
          association: {
            connectionType: 'BELONGS_TO',
            targetName: 'keyLockId',
          },
        },
        createdAt: {
          name: 'createdAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
        updatedAt: {
          name: 'updatedAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
      },
      syncable: true,
      pluralName: 'Keys',
      attributes: [
        {
          type: 'model',
          properties: {},
        },
        {
          type: 'auth',
          properties: {
            rules: [
              {
                allow: 'public',
                operations: ['create', 'update', 'delete', 'read'],
              },
            ],
          },
        },
      ],
    },
    Owner: {
      name: 'Owner',
      fields: {
        id: {
          name: 'id',
          isArray: false,
          type: 'ID',
          isRequired: true,
          attributes: [],
        },
        name: {
          name: 'name',
          isArray: false,
          type: 'String',
          isRequired: false,
          attributes: [],
        },
        Dog: {
          name: 'Dog',
          isArray: true,
          type: {
            model: 'Dog',
          },
          isRequired: false,
          attributes: [],
          isArrayNullable: true,
          association: {
            connectionType: 'HAS_MANY',
            associatedWith: 'ownerID',
          },
        },
        createdAt: {
          name: 'createdAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
        updatedAt: {
          name: 'updatedAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
      },
      syncable: true,
      pluralName: 'Owners',
      attributes: [
        {
          type: 'model',
          properties: {},
        },
        {
          type: 'auth',
          properties: {
            rules: [
              {
                allow: 'public',
                operations: ['create', 'update', 'delete', 'read'],
              },
            ],
          },
        },
      ],
    },
    Dog: {
      name: 'Dog',
      fields: {
        id: {
          name: 'id',
          isArray: false,
          type: 'ID',
          isRequired: true,
          attributes: [],
        },
        name: {
          name: 'name',
          isArray: false,
          type: 'String',
          isRequired: false,
          attributes: [],
        },
        ownerID: {
          name: 'ownerID',
          isArray: false,
          type: 'ID',
          isRequired: false,
          attributes: [],
        },
        createdAt: {
          name: 'createdAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
        updatedAt: {
          name: 'updatedAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
      },
      syncable: true,
      pluralName: 'Dogs',
      attributes: [
        {
          type: 'model',
          properties: {},
        },
        {
          type: 'key',
          properties: {
            name: 'byOwner',
            fields: ['ownerID'],
          },
        },
        {
          type: 'auth',
          properties: {
            rules: [
              {
                allow: 'public',
                operations: ['create', 'update', 'delete', 'read'],
              },
            ],
          },
        },
      ],
    },
    StudentTeacher: {
      name: 'StudentTeacher',
      fields: {
        id: {
          name: 'id',
          isArray: false,
          type: 'ID',
          isRequired: true,
          attributes: [],
        },
        student: {
          name: 'student',
          isArray: false,
          type: {
            model: 'Student',
          },
          isRequired: true,
          attributes: [],
          association: {
            connectionType: 'BELONGS_TO',
            targetName: 'studentID',
          },
        },
        teacher: {
          name: 'teacher',
          isArray: false,
          type: {
            model: 'Teacher',
          },
          isRequired: true,
          attributes: [],
          association: {
            connectionType: 'BELONGS_TO',
            targetName: 'teacherID',
          },
        },
        createdAt: {
          name: 'createdAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
        updatedAt: {
          name: 'updatedAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
      },
      syncable: true,
      pluralName: 'StudentTeachers',
      attributes: [
        {
          type: 'model',
          properties: {},
        },
        {
          type: 'key',
          properties: {
            name: 'byStudent',
            fields: ['studentID'],
          },
        },
        {
          type: 'key',
          properties: {
            name: 'byTeacher',
            fields: ['teacherID'],
          },
        },
      ],
    },
  },
  enums: {},
  nonModels: {},
  version: '3ea7de9ef8e765b48c0a53e3e45735a3',
  codegenVersion: '000000',
};

export const schemaWithEnums: Schema = {
  models: {},
  enums: {
    City: {
      name: 'City',
      values: ['SAN_FRANCISCO', 'NEW_YORK'],
    },
  },
  nonModels: {},
  version: '3ea7de9ef8e765b48c0a53e3e45735a3',
  codegenVersion: '000000',
};

export const schemaWithNonModels: Schema = {
  models: {},
  enums: {},
  nonModels: {
    Reactions: {
      name: 'Reactions',
      fields: {
        ball: {
          name: 'ball',
          isArray: false,
          type: 'String',
          isRequired: false,
          attributes: [],
        },
        fireworks: {
          name: 'fireworks',
          isArray: false,
          type: 'String',
          isRequired: false,
          attributes: [],
        },
      },
    },
    Misc: {
      name: 'Misc',
      fields: {
        quotes: {
          name: 'quotes',
          isArray: true,
          type: 'String',
          isRequired: false,
          attributes: [],
        },
      },
    },
  },
  version: '38a1a46479c6cd75d21439d7f3122c1d',
  codegenVersion: '000000',
};

export const schemaWithRelationshipsV2: any = {
  models: {
    PrimaryCareGiver: {
      name: 'PrimaryCareGiver',
      fields: {
        id: {
          name: 'id',
          isArray: false,
          type: 'ID',
          isRequired: true,
          attributes: [],
        },
        name: {
          name: 'name',
          isArray: false,
          type: 'String',
          isRequired: false,
          attributes: [],
        },
        Child: {
          name: 'Child',
          isArray: false,
          type: {
            model: 'Child',
          },
          isRequired: false,
          attributes: [],
          association: {
            connectionType: 'HAS_ONE',
            associatedWith: ['id'],
            targetNames: ['primaryCareGiverChildId'],
          },
        },
        createdAt: {
          name: 'createdAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
        updatedAt: {
          name: 'updatedAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
        primaryCareGiverChildId: {
          name: 'primaryCareGiverChildId',
          isArray: false,
          type: 'ID',
          isRequired: false,
          attributes: [],
        },
      },
      syncable: true,
      pluralName: 'PrimaryCareGivers',
      attributes: [
        {
          type: 'model',
          properties: {},
        },
        {
          type: 'auth',
          properties: {
            rules: [
              {
                allow: 'public',
                operations: ['create', 'update', 'delete', 'read'],
              },
            ],
          },
        },
      ],
    },
    Child: {
      name: 'Child',
      fields: {
        id: {
          name: 'id',
          isArray: false,
          type: 'ID',
          isRequired: true,
          attributes: [],
        },
        name: {
          name: 'name',
          isArray: false,
          type: 'String',
          isRequired: false,
          attributes: [],
        },
        createdAt: {
          name: 'createdAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
        updatedAt: {
          name: 'updatedAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
      },
      syncable: true,
      pluralName: 'Children',
      attributes: [
        {
          type: 'model',
          properties: {},
        },
        {
          type: 'auth',
          properties: {
            rules: [
              {
                allow: 'public',
                operations: ['create', 'update', 'delete', 'read'],
              },
            ],
          },
        },
      ],
    },
    Student: {
      name: 'Student',
      fields: {
        id: {
          name: 'id',
          isArray: false,
          type: 'ID',
          isRequired: true,
          attributes: [],
        },
        name: {
          name: 'name',
          isArray: false,
          type: 'String',
          isRequired: false,
          attributes: [],
        },
        Teachers: {
          name: 'Teachers',
          isArray: true,
          type: {
            model: 'StudentTeacher',
          },
          isRequired: false,
          attributes: [],
          isArrayNullable: true,
          association: {
            connectionType: 'HAS_MANY',
            associatedWith: ['student'],
          },
        },
        createdAt: {
          name: 'createdAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
        updatedAt: {
          name: 'updatedAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
      },
      syncable: true,
      pluralName: 'Students',
      attributes: [
        {
          type: 'model',
          properties: {},
        },
        {
          type: 'auth',
          properties: {
            rules: [
              {
                allow: 'public',
                operations: ['create', 'update', 'delete', 'read'],
              },
            ],
          },
        },
      ],
    },
    Teacher: {
      name: 'Teacher',
      fields: {
        id: {
          name: 'id',
          isArray: false,
          type: 'ID',
          isRequired: true,
          attributes: [],
        },
        name: {
          name: 'name',
          isArray: false,
          type: 'String',
          isRequired: false,
          attributes: [],
        },
        students: {
          name: 'students',
          isArray: true,
          type: {
            model: 'StudentTeacher',
          },
          isRequired: false,
          attributes: [],
          isArrayNullable: true,
          association: {
            connectionType: 'HAS_MANY',
            associatedWith: ['teacher'],
          },
        },
        createdAt: {
          name: 'createdAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
        updatedAt: {
          name: 'updatedAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
      },
      syncable: true,
      pluralName: 'Teachers',
      attributes: [
        {
          type: 'model',
          properties: {},
        },
        {
          type: 'auth',
          properties: {
            rules: [
              {
                allow: 'public',
                operations: ['create', 'update', 'delete', 'read'],
              },
            ],
          },
        },
      ],
    },
    Lock: {
      name: 'Lock',
      fields: {
        id: {
          name: 'id',
          isArray: false,
          type: 'ID',
          isRequired: true,
          attributes: [],
        },
        Key: {
          name: 'Key',
          isArray: false,
          type: {
            model: 'Key',
          },
          isRequired: false,
          attributes: [],
          association: {
            connectionType: 'HAS_ONE',
            associatedWith: ['Lock'],
            targetNames: ['lockKeyId'],
          },
        },
        createdAt: {
          name: 'createdAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
        updatedAt: {
          name: 'updatedAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
        lockKeyId: {
          name: 'lockKeyId',
          isArray: false,
          type: 'ID',
          isRequired: false,
          attributes: [],
        },
      },
      syncable: true,
      pluralName: 'Locks',
      attributes: [
        {
          type: 'model',
          properties: {},
        },
        {
          type: 'auth',
          properties: {
            rules: [
              {
                allow: 'public',
                operations: ['create', 'update', 'delete', 'read'],
              },
            ],
          },
        },
      ],
    },
    Key: {
      name: 'Key',
      fields: {
        id: {
          name: 'id',
          isArray: false,
          type: 'ID',
          isRequired: true,
          attributes: [],
        },
        name: {
          name: 'name',
          isArray: false,
          type: 'String',
          isRequired: false,
          attributes: [],
        },
        Lock: {
          name: 'Lock',
          isArray: false,
          type: {
            model: 'Lock',
          },
          isRequired: false,
          attributes: [],
          association: {
            connectionType: 'BELONGS_TO',
            targetNames: ['keyLockId'],
          },
        },
        createdAt: {
          name: 'createdAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
        updatedAt: {
          name: 'updatedAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
      },
      syncable: true,
      pluralName: 'Keys',
      attributes: [
        {
          type: 'model',
          properties: {},
        },
        {
          type: 'auth',
          properties: {
            rules: [
              {
                allow: 'public',
                operations: ['create', 'update', 'delete', 'read'],
              },
            ],
          },
        },
      ],
    },
    Owner: {
      name: 'Owner',
      fields: {
        id: {
          name: 'id',
          isArray: false,
          type: 'ID',
          isRequired: true,
          attributes: [],
        },
        name: {
          name: 'name',
          isArray: false,
          type: 'String',
          isRequired: false,
          attributes: [],
        },
        Dog: {
          name: 'Dog',
          isArray: true,
          type: {
            model: 'Dog',
          },
          isRequired: false,
          attributes: [],
          isArrayNullable: true,
          association: {
            connectionType: 'HAS_MANY',
            associatedWith: ['ownerID'],
          },
        },
        createdAt: {
          name: 'createdAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
        updatedAt: {
          name: 'updatedAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
      },
      syncable: true,
      pluralName: 'Owners',
      attributes: [
        {
          type: 'model',
          properties: {},
        },
        {
          type: 'auth',
          properties: {
            rules: [
              {
                allow: 'public',
                operations: ['create', 'update', 'delete', 'read'],
              },
            ],
          },
        },
      ],
    },
    Dog: {
      name: 'Dog',
      fields: {
        id: {
          name: 'id',
          isArray: false,
          type: 'ID',
          isRequired: true,
          attributes: [],
        },
        name: {
          name: 'name',
          isArray: false,
          type: 'String',
          isRequired: false,
          attributes: [],
        },
        ownerID: {
          name: 'ownerID',
          isArray: false,
          type: 'ID',
          isRequired: false,
          attributes: [],
        },
        createdAt: {
          name: 'createdAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
        updatedAt: {
          name: 'updatedAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
      },
      syncable: true,
      pluralName: 'Dogs',
      attributes: [
        {
          type: 'model',
          properties: {},
        },
        {
          type: 'key',
          properties: {
            name: 'byOwner',
            fields: ['ownerID'],
          },
        },
        {
          type: 'auth',
          properties: {
            rules: [
              {
                allow: 'public',
                operations: ['create', 'update', 'delete', 'read'],
              },
            ],
          },
        },
      ],
    },
    StudentTeacher: {
      name: 'StudentTeacher',
      fields: {
        id: {
          name: 'id',
          isArray: false,
          type: 'ID',
          isRequired: true,
          attributes: [],
        },
        student: {
          name: 'student',
          isArray: false,
          type: {
            model: 'Student',
          },
          isRequired: true,
          attributes: [],
          association: {
            connectionType: 'BELONGS_TO',
            targetNames: ['studentID'],
          },
        },
        teacher: {
          name: 'teacher',
          isArray: false,
          type: {
            model: 'Teacher',
          },
          isRequired: true,
          attributes: [],
          association: {
            connectionType: 'BELONGS_TO',
            targetNames: ['teacherID'],
          },
        },
        createdAt: {
          name: 'createdAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
        updatedAt: {
          name: 'updatedAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
      },
      syncable: true,
      pluralName: 'StudentTeachers',
      attributes: [
        {
          type: 'model',
          properties: {},
        },
        {
          type: 'key',
          properties: {
            name: 'byStudent',
            fields: ['studentID'],
          },
        },
        {
          type: 'key',
          properties: {
            name: 'byTeacher',
            fields: ['teacherID'],
          },
        },
      ],
    },
  },
  enums: {},
  nonModels: {},
  version: '3ea7de9ef8e765b48c0a53e3e45735a3',
  codegenVersion: '000000',
};

export const schemaWithAssumptions: Schema = {
  models: {
    User: {
      name: 'User',
      fields: {
        friends: {
          name: 'friends',
          isArray: true,
          type: {
            model: 'Friend',
          },
          isRequired: false,
          attributes: [],
          isArrayNullable: true,
          association: {
            connectionType: 'HAS_MANY',
            associatedWith: 'friendId',
          },
        },
        posts: {
          name: 'posts',
          isArray: true,
          type: {
            model: 'Post',
          },
          isRequired: false,
          attributes: [],
          isArrayNullable: true,
          association: {
            connectionType: 'HAS_MANY',
            associatedWith: 'userPostsId',
          },
        },
        badges: {
          name: 'badges',
          isArray: true,
          type: 'String',
          isRequired: false,
          attributes: [],
          isArrayNullable: true,
        },
      },
      syncable: true,
      pluralName: 'Users',
      attributes: [
        {
          type: 'model',
          properties: {},
        },
        {
          type: 'key',
          properties: {
            fields: ['id'],
          },
        },
      ],
    },
    Event: {
      name: 'Post',
      fields: {
        name: {
          name: 'name',
          isArray: false,
          type: 'String',
          isRequired: false,
          attributes: [],
        },
      },
      syncable: true,
      pluralName: 'Posts',
      attributes: [
        {
          type: 'model',
          properties: {},
        },
        {
          type: 'key',
          properties: {
            fields: ['id'],
          },
        },
      ],
    },
  },
  enums: {},
  nonModels: {},
  version: 'version',
  codegenVersion: '000000',
};

/**
  type Student @model {
    specialStudentId: ID! @primaryKey(sortKeyFields: ["grade", "age"])
    grade: Int!
    age: Int!
  }

  type Teacher @model {
    specialTeacherId: ID! @primaryKey
    Student: Student @hasOne
  }

  type Dog @model {
    id: ID!
    name: String
  }
*/

export const schemaWithCPK: Schema = {
  models: {
    CPKStudent: {
      name: 'CPKStudent',
      fields: {
        specialStudentId: {
          name: 'specialStudentId',
          isArray: false,
          type: 'ID',
          isRequired: true,
          attributes: [],
        },
        createdAt: {
          name: 'createdAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
        updatedAt: {
          name: 'updatedAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
      },
      syncable: true,
      pluralName: 'CPKStudents',
      attributes: [
        {
          type: 'model',
          properties: {},
        },
        {
          type: 'key',
          properties: {
            fields: ['specialStudentId'],
          },
        },
      ],
    },
    CPKTeacher: {
      name: 'CPKTeacher',
      fields: {
        specialTeacherId: {
          name: 'specialTeacherId',
          isArray: false,
          type: 'ID',
          isRequired: true,
          attributes: [],
        },
        CPKStudent: {
          name: 'CPKStudent',
          isArray: false,
          type: {
            model: 'CPKStudent',
          },
          isRequired: false,
          attributes: [],
          association: {
            connectionType: 'HAS_ONE',
            associatedWith: ['specialStudentId'],
            targetNames: ['cPKTeacherCPKStudentSpecialStudentId'],
          },
        },
        CPKClasses: {
          name: 'CPKClasses',
          isArray: true,
          type: {
            model: 'CPKTeacherCPKClass',
          },
          isRequired: false,
          attributes: [],
          isArrayNullable: true,
          association: {
            connectionType: 'HAS_MANY',
            associatedWith: ['cpkTeacher'],
          },
        },
        CPKProjects: {
          name: 'CPKProjects',
          isArray: true,
          type: {
            model: 'CPKProject',
          },
          isRequired: false,
          attributes: [],
          isArrayNullable: true,
          association: {
            connectionType: 'HAS_MANY',
            associatedWith: ['cPKTeacherID'],
          },
        },
        createdAt: {
          name: 'createdAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
        updatedAt: {
          name: 'updatedAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
        cPKTeacherCPKStudentSpecialStudentId: {
          name: 'cPKTeacherCPKStudentSpecialStudentId',
          isArray: false,
          type: 'ID',
          isRequired: false,
          attributes: [],
        },
      },
      syncable: true,
      pluralName: 'CPKTeachers',
      attributes: [
        {
          type: 'model',
          properties: {},
        },
        {
          type: 'key',
          properties: {
            fields: ['specialTeacherId'],
          },
        },
      ],
    },
    CPKClass: {
      name: 'CPKClass',
      fields: {
        specialClassId: {
          name: 'specialClassId',
          isArray: false,
          type: 'ID',
          isRequired: true,
          attributes: [],
        },
        CPKTeachers: {
          name: 'CPKTeachers',
          isArray: true,
          type: {
            model: 'CPKTeacherCPKClass',
          },
          isRequired: false,
          attributes: [],
          isArrayNullable: true,
          association: {
            connectionType: 'HAS_MANY',
            associatedWith: ['cpkClass'],
          },
        },
        createdAt: {
          name: 'createdAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
        updatedAt: {
          name: 'updatedAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
      },
      syncable: true,
      pluralName: 'CPKClasses',
      attributes: [
        {
          type: 'model',
          properties: {},
        },
        {
          type: 'key',
          properties: {
            fields: ['specialClassId'],
          },
        },
      ],
    },
    CPKProject: {
      name: 'CPKProject',
      fields: {
        specialProjectId: {
          name: 'specialProjectId',
          isArray: false,
          type: 'ID',
          isRequired: true,
          attributes: [],
        },
        cPKTeacherID: {
          name: 'cPKTeacherID',
          isArray: false,
          type: 'ID',
          isRequired: false,
          attributes: [],
        },
        createdAt: {
          name: 'createdAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
        updatedAt: {
          name: 'updatedAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
      },
      syncable: true,
      pluralName: 'CPKProjects',
      attributes: [
        {
          type: 'model',
          properties: {},
        },
        {
          type: 'key',
          properties: {
            fields: ['specialProjectId'],
          },
        },
        {
          type: 'key',
          properties: {
            name: 'byCPKTeacher',
            fields: ['cPKTeacherID'],
          },
        },
      ],
    },
    CPKTeacherCPKClass: {
      name: 'CPKTeacherCPKClass',
      fields: {
        id: {
          name: 'id',
          isArray: false,
          type: 'ID',
          isRequired: true,
          attributes: [],
        },
        cPKTeacherSpecialTeacherId: {
          name: 'cPKTeacherSpecialTeacherId',
          isArray: false,
          type: 'ID',
          isRequired: false,
          attributes: [],
        },
        cPKClassSpecialClassId: {
          name: 'cPKClassSpecialClassId',
          isArray: false,
          type: 'ID',
          isRequired: false,
          attributes: [],
        },
        cpkTeacher: {
          name: 'cpkTeacher',
          isArray: false,
          type: {
            model: 'CPKTeacher',
          },
          isRequired: true,
          attributes: [],
          association: {
            connectionType: 'BELONGS_TO',
            targetNames: ['cPKTeacherSpecialTeacherId'],
          },
        },
        cpkClass: {
          name: 'cpkClass',
          isArray: false,
          type: {
            model: 'CPKClass',
          },
          isRequired: true,
          attributes: [],
          association: {
            connectionType: 'BELONGS_TO',
            targetNames: ['cPKClassSpecialClassId'],
          },
        },
        createdAt: {
          name: 'createdAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
        updatedAt: {
          name: 'updatedAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
      },
      syncable: true,
      pluralName: 'CPKTeacherCPKClasses',
      attributes: [
        {
          type: 'model',
          properties: {},
        },
        {
          type: 'key',
          properties: {
            name: 'byCPKTeacher',
            fields: ['cPKTeacherSpecialTeacherId'],
          },
        },
        {
          type: 'key',
          properties: {
            name: 'byCPKClass',
            fields: ['cPKClassSpecialClassId'],
          },
        },
      ],
    },
  },
  enums: {},
  nonModels: {},
  codegenVersion: '3.3.2',
  version: '6cdebeac40c17b1a27a64848aafdc86a',
};

export const schemaWithCompositeKeys: Schema = {
  models: {
    CompositeDog: {
      name: 'CompositeDog',
      fields: {
        name: {
          name: 'name',
          isArray: false,
          type: 'ID',
          isRequired: true,
          attributes: [],
        },
        description: {
          name: 'description',
          isArray: false,
          type: 'String',
          isRequired: true,
          attributes: [],
        },
        CompositeBowl: {
          name: 'CompositeBowl',
          isArray: false,
          type: {
            model: 'CompositeBowl',
          },
          isRequired: false,
          attributes: [],
          association: {
            connectionType: 'HAS_ONE',
            associatedWith: ['shape', 'size'],
            targetNames: ['compositeDogCompositeBowlShape', 'compositeDogCompositeBowlSize'],
          },
        },
        CompositeOwner: {
          name: 'CompositeOwner',
          isArray: false,
          type: {
            model: 'CompositeOwner',
          },
          isRequired: false,
          attributes: [],
          association: {
            connectionType: 'BELONGS_TO',
            targetNames: ['compositeDogCompositeOwnerLastName', 'compositeDogCompositeOwnerFirstName'],
          },
        },
        CompositeToys: {
          name: 'CompositeToys',
          isArray: true,
          type: {
            model: 'CompositeToy',
          },
          isRequired: false,
          attributes: [],
          isArrayNullable: true,
          association: {
            connectionType: 'HAS_MANY',
            associatedWith: ['compositeDogCompositeToysName', 'compositeDogCompositeToysDescription'],
          },
        },
        CompositeVets: {
          name: 'CompositeVets',
          isArray: true,
          type: {
            model: 'CompositeDogCompositeVet',
          },
          isRequired: false,
          attributes: [],
          isArrayNullable: true,
          association: {
            connectionType: 'HAS_MANY',
            associatedWith: ['compositeDog'],
          },
        },
        createdAt: {
          name: 'createdAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
        updatedAt: {
          name: 'updatedAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
        compositeDogCompositeBowlShape: {
          name: 'compositeDogCompositeBowlShape',
          isArray: false,
          type: 'ID',
          isRequired: false,
          attributes: [],
        },
        compositeDogCompositeBowlSize: {
          name: 'compositeDogCompositeBowlSize',
          isArray: false,
          type: 'String',
          isRequired: false,
          attributes: [],
        },
        compositeDogCompositeOwnerLastName: {
          name: 'compositeDogCompositeOwnerLastName',
          isArray: false,
          type: 'ID',
          isRequired: false,
          attributes: [],
        },
        compositeDogCompositeOwnerFirstName: {
          name: 'compositeDogCompositeOwnerFirstName',
          isArray: false,
          type: 'String',
          isRequired: false,
          attributes: [],
        },
      },
      syncable: true,
      pluralName: 'CompositeDogs',
      attributes: [
        {
          type: 'model',
          properties: {},
        },
        {
          type: 'key',
          properties: {
            fields: ['name', 'description'],
          },
        },
      ],
    },
    CompositeBowl: {
      name: 'CompositeBowl',
      fields: {
        shape: {
          name: 'shape',
          isArray: false,
          type: 'ID',
          isRequired: true,
          attributes: [],
        },
        size: {
          name: 'size',
          isArray: false,
          type: 'String',
          isRequired: true,
          attributes: [],
        },
        createdAt: {
          name: 'createdAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
        updatedAt: {
          name: 'updatedAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
      },
      syncable: true,
      pluralName: 'CompositeBowls',
      attributes: [
        {
          type: 'model',
          properties: {},
        },
        {
          type: 'key',
          properties: {
            fields: ['shape', 'size'],
          },
        },
      ],
    },
    CompositeOwner: {
      name: 'CompositeOwner',
      fields: {
        lastName: {
          name: 'lastName',
          isArray: false,
          type: 'ID',
          isRequired: true,
          attributes: [],
        },
        firstName: {
          name: 'firstName',
          isArray: false,
          type: 'String',
          isRequired: true,
          attributes: [],
        },
        CompositeDog: {
          name: 'CompositeDog',
          isArray: false,
          type: {
            model: 'CompositeDog',
          },
          isRequired: false,
          attributes: [],
          association: {
            connectionType: 'HAS_ONE',
            associatedWith: ['CompositeOwner'],
            targetNames: ['compositeOwnerCompositeDogName', 'compositeOwnerCompositeDogDescription'],
          },
        },
        createdAt: {
          name: 'createdAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
        updatedAt: {
          name: 'updatedAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
        compositeOwnerCompositeDogName: {
          name: 'compositeOwnerCompositeDogName',
          isArray: false,
          type: 'ID',
          isRequired: false,
          attributes: [],
        },
        compositeOwnerCompositeDogDescription: {
          name: 'compositeOwnerCompositeDogDescription',
          isArray: false,
          type: 'String',
          isRequired: false,
          attributes: [],
        },
      },
      syncable: true,
      pluralName: 'CompositeOwners',
      attributes: [
        {
          type: 'model',
          properties: {},
        },
        {
          type: 'key',
          properties: {
            fields: ['lastName', 'firstName'],
          },
        },
      ],
    },
    CompositeToy: {
      name: 'CompositeToy',
      fields: {
        kind: {
          name: 'kind',
          isArray: false,
          type: 'ID',
          isRequired: true,
          attributes: [],
        },
        color: {
          name: 'color',
          isArray: false,
          type: 'String',
          isRequired: true,
          attributes: [],
        },
        createdAt: {
          name: 'createdAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
        updatedAt: {
          name: 'updatedAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
        compositeDogCompositeToysName: {
          name: 'compositeDogCompositeToysName',
          isArray: false,
          type: 'ID',
          isRequired: false,
          attributes: [],
        },
        compositeDogCompositeToysDescription: {
          name: 'compositeDogCompositeToysDescription',
          isArray: false,
          type: 'String',
          isRequired: false,
          attributes: [],
        },
      },
      syncable: true,
      pluralName: 'CompositeToys',
      attributes: [
        {
          type: 'model',
          properties: {},
        },
        {
          type: 'key',
          properties: {
            fields: ['kind', 'color'],
          },
        },
        {
          type: 'key',
          properties: {
            name: 'gsi-CompositeDog.CompositeToys',
            fields: ['compositeDogCompositeToysName', 'compositeDogCompositeToysDescription'],
          },
        },
      ],
    },
    CompositeVet: {
      name: 'CompositeVet',
      fields: {
        specialty: {
          name: 'specialty',
          isArray: false,
          type: 'ID',
          isRequired: true,
          attributes: [],
        },
        city: {
          name: 'city',
          isArray: false,
          type: 'String',
          isRequired: true,
          attributes: [],
        },
        CompositeDogs: {
          name: 'CompositeDogs',
          isArray: true,
          type: {
            model: 'CompositeDogCompositeVet',
          },
          isRequired: false,
          attributes: [],
          isArrayNullable: true,
          association: {
            connectionType: 'HAS_MANY',
            associatedWith: ['compositeVet'],
          },
        },
        createdAt: {
          name: 'createdAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
        updatedAt: {
          name: 'updatedAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
      },
      syncable: true,
      pluralName: 'CompositeVets',
      attributes: [
        {
          type: 'model',
          properties: {},
        },
        {
          type: 'key',
          properties: {
            fields: ['specialty', 'city'],
          },
        },
      ],
    },
    CompositeDogCompositeVet: {
      name: 'CompositeDogCompositeVet',
      fields: {
        id: {
          name: 'id',
          isArray: false,
          type: 'ID',
          isRequired: true,
          attributes: [],
        },
        compositeDogName: {
          name: 'compositeDogName',
          isArray: false,
          type: 'ID',
          isRequired: false,
          attributes: [],
        },
        compositeDogdescription: {
          name: 'compositeDogdescription',
          isArray: false,
          type: 'String',
          isRequired: false,
          attributes: [],
        },
        compositeVetSpecialty: {
          name: 'compositeVetSpecialty',
          isArray: false,
          type: 'ID',
          isRequired: false,
          attributes: [],
        },
        compositeVetcity: {
          name: 'compositeVetcity',
          isArray: false,
          type: 'String',
          isRequired: false,
          attributes: [],
        },
        compositeDog: {
          name: 'compositeDog',
          isArray: false,
          type: {
            model: 'CompositeDog',
          },
          isRequired: true,
          attributes: [],
          association: {
            connectionType: 'BELONGS_TO',
            targetNames: ['compositeDogName', 'compositeDogdescription'],
          },
        },
        compositeVet: {
          name: 'compositeVet',
          isArray: false,
          type: {
            model: 'CompositeVet',
          },
          isRequired: true,
          attributes: [],
          association: {
            connectionType: 'BELONGS_TO',
            targetNames: ['compositeVetSpecialty', 'compositeVetcity'],
          },
        },
        createdAt: {
          name: 'createdAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
        updatedAt: {
          name: 'updatedAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
      },
      syncable: true,
      pluralName: 'CompositeDogCompositeVets',
      attributes: [
        {
          type: 'model',
          properties: {},
        },
        {
          type: 'key',
          properties: {
            name: 'byCompositeDog',
            fields: ['compositeDogName', 'compositeDogdescription'],
          },
        },
        {
          type: 'key',
          properties: {
            name: 'byCompositeVet',
            fields: ['compositeVetSpecialty', 'compositeVetcity'],
          },
        },
      ],
    },
  },
  enums: {},
  nonModels: {},
  codegenVersion: '3.3.2',
  version: '8f8e59ee8fb2e3ca4efda3aa25b0211f',
};
