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
};
