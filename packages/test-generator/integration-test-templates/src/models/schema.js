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
export const schema = {
  models: {
    UserPreference: {
      name: 'UserPreference',
      fields: {
        id: {
          name: 'id',
          isArray: false,
          type: 'ID',
          isRequired: true,
          attributes: [],
        },
        favoriteColor: {
          name: 'favoriteColor',
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
      pluralName: 'UserPreferences',
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
    User: {
      name: 'User',
      fields: {
        id: {
          name: 'id',
          isArray: false,
          type: 'ID',
          isRequired: true,
          attributes: [],
        },
        firstName: {
          name: 'firstName',
          isArray: false,
          type: 'String',
          isRequired: false,
          attributes: [],
        },
        lastName: {
          name: 'lastName',
          isArray: false,
          type: 'String',
          isRequired: false,
          attributes: [],
        },
        age: {
          name: 'age',
          isArray: false,
          type: 'Int',
          isRequired: false,
          attributes: [],
        },
        isLoggedIn: {
          name: 'isLoggedIn',
          isArray: false,
          type: 'Boolean',
          isRequired: false,
          attributes: [],
        },
        loggedInColor: {
          name: 'loggedInColor',
          isArray: false,
          type: 'String',
          isRequired: false,
          attributes: [],
        },
        loggedOutColor: {
          name: 'loggedOutColor',
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
      pluralName: 'Users',
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
    Listing: {
      name: 'Listing',
      fields: {
        id: {
          name: 'id',
          isArray: false,
          type: 'ID',
          isRequired: true,
          attributes: [],
        },
        title: {
          name: 'title',
          isArray: false,
          type: 'String',
          isRequired: false,
          attributes: [],
        },
        priceUSD: {
          name: 'priceUSD',
          isArray: false,
          type: 'Int',
          isRequired: false,
          attributes: [],
        },
        description: {
          name: 'description',
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
      pluralName: 'Listings',
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
    ComplexModel: {
      name: 'ComplexModel',
      fields: {
        id: {
          name: 'id',
          isArray: false,
          type: 'ID',
          isRequired: true,
          attributes: [],
        },
        listElement: {
          name: 'listElement',
          isArray: true,
          type: 'String',
          isRequired: true,
          attributes: [],
          isArrayNullable: false,
        },
        myCustomField: {
          name: 'myCustomField',
          isArray: false,
          type: {
            nonModel: 'CustomType',
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
      pluralName: 'ComplexModels',
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
    Class: {
      name: 'Class',
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
      },
      syncable: true,
      pluralName: 'Classes',
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
    Tag: {
      name: 'Tag',
      fields: {
        id: {
          name: 'id',
          isArray: false,
          type: 'ID',
          isRequired: true,
          attributes: [],
        },
        label: {
          name: 'label',
          isArray: false,
          type: 'String',
          isRequired: false,
          attributes: [],
        },
        AllSupportedFormFields: {
          name: 'AllSupportedFormFields',
          isArray: true,
          type: {
            model: 'AllSupportedFormFieldsTag',
          },
          isRequired: false,
          attributes: [],
          isArrayNullable: true,
          association: {
            connectionType: 'HAS_MANY',
            associatedWith: 'tag',
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
      pluralName: 'Tags',
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
    AllSupportedFormFieldsTag: {
      name: 'AllSupportedFormFieldsTag',
      fields: {
        id: {
          name: 'id',
          isArray: false,
          type: 'ID',
          isRequired: true,
          attributes: [],
        },
        tag: {
          name: 'tag',
          isArray: false,
          type: {
            model: 'Tag',
          },
          isRequired: true,
          attributes: [],
          association: {
            connectionType: 'BELONGS_TO',
            targetName: 'tagID',
          },
        },
        allSupportedFormFields: {
          name: 'allSupportedFormFields',
          isArray: false,
          type: {
            model: 'AllSupportedFormFields',
          },
          isRequired: true,
          attributes: [],
          association: {
            connectionType: 'BELONGS_TO',
            targetName: 'allSupportedFormFieldsID',
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
      pluralName: 'AllSupportedFormFieldsTags',
      attributes: [
        {
          type: 'model',
          properties: {},
        },
        {
          type: 'key',
          properties: {
            name: 'byTag',
            fields: ['tagID'],
          },
        },
        {
          type: 'key',
          properties: {
            name: 'byAllSupportedFormFields',
            fields: ['allSupportedFormFieldsID'],
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
        AllSupportedFormFields: {
          name: 'AllSupportedFormFields',
          isArray: false,
          type: {
            model: 'AllSupportedFormFields',
          },
          isRequired: false,
          attributes: [],
          association: {
            connectionType: 'HAS_ONE',
            associatedWith: 'BelongsToOwner',
            targetName: 'ownerAllSupportedFormFieldsId',
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
        ownerAllSupportedFormFieldsId: {
          name: 'ownerAllSupportedFormFieldsId',
          isArray: false,
          type: 'ID',
          isRequired: false,
          attributes: [],
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
        allSupportedFormFieldsID: {
          name: 'allSupportedFormFieldsID',
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
      pluralName: 'Students',
      attributes: [
        {
          type: 'model',
          properties: {},
        },
        {
          type: 'key',
          properties: {
            name: 'byAllSupportedFormFields',
            fields: ['allSupportedFormFieldsID'],
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
    AllSupportedFormFields: {
      name: 'AllSupportedFormFields',
      fields: {
        id: {
          name: 'id',
          isArray: false,
          type: 'ID',
          isRequired: true,
          attributes: [],
        },
        string: {
          name: 'string',
          isArray: false,
          type: 'String',
          isRequired: false,
          attributes: [],
        },
        stringArray: {
          name: 'stringArray',
          isArray: true,
          type: 'String',
          isRequired: false,
          attributes: [],
        },
        int: {
          name: 'int',
          isArray: false,
          type: 'Int',
          isRequired: false,
          attributes: [],
        },
        float: {
          name: 'float',
          isArray: false,
          type: 'Float',
          isRequired: false,
          attributes: [],
        },
        awsDate: {
          name: 'awsDate',
          isArray: false,
          type: 'AWSDate',
          isRequired: false,
          attributes: [],
        },
        awsTime: {
          name: 'awsTime',
          isArray: false,
          type: 'AWSTime',
          isRequired: false,
          attributes: [],
        },
        awsDateTime: {
          name: 'awsDateTime',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
        },
        awsTimestamp: {
          name: 'awsTimestamp',
          isArray: false,
          type: 'AWSTimestamp',
          isRequired: false,
          attributes: [],
        },
        awsEmail: {
          name: 'awsEmail',
          isArray: false,
          type: 'AWSEmail',
          isRequired: false,
          attributes: [],
        },
        awsUrl: {
          name: 'awsUrl',
          isArray: false,
          type: 'AWSURL',
          isRequired: false,
          attributes: [],
        },
        awsIPAddress: {
          name: 'awsIPAddress',
          isArray: false,
          type: 'AWSIPAddress',
          isRequired: false,
          attributes: [],
        },
        boolean: {
          name: 'boolean',
          isArray: false,
          type: 'Boolean',
          isRequired: false,
          attributes: [],
        },
        awsJson: {
          name: 'awsJson',
          isArray: false,
          type: 'AWSJSON',
          isRequired: false,
          attributes: [],
        },
        awsPhone: {
          name: 'awsPhone',
          isArray: false,
          type: 'AWSPhone',
          isRequired: false,
          attributes: [],
        },
        enum: {
          name: 'enum',
          isArray: false,
          type: {
            enum: 'City',
          },
          isRequired: false,
          attributes: [],
        },
        HasOneUser: {
          name: 'HasOneUser',
          isArray: false,
          type: {
            model: 'User',
          },
          isRequired: false,
          attributes: [],
          association: {
            connectionType: 'HAS_ONE',
            associatedWith: 'id',
            targetName: 'allSupportedFormFieldsHasOneUserId',
          },
        },
        allSupportedFormFieldsHasOneUserId: {
          name: 'allSupportedFormFieldsHasOneUserId',
          isArray: false,
          type: 'ID',
          isRequired: false,
          attributes: [],
        },
        BelongsToOwner: {
          name: 'BelongsToOwner',
          isArray: false,
          type: {
            model: 'Owner',
          },
          isRequired: false,
          attributes: [],
          association: {
            connectionType: 'BELONGS_TO',
            targetName: 'allSupportedFormFieldsOwnerId',
          },
        },
        HasManyStudents: {
          name: 'HasManyStudents',
          isArray: true,
          type: {
            model: 'Student',
          },
          isRequired: false,
          attributes: [],
          isArrayNullable: true,
          association: {
            connectionType: 'HAS_MANY',
            associatedWith: 'allSupportedFormFieldsID',
          },
        },
        ManyToManyTags: {
          name: 'ManyToManyTags',
          isArray: true,
          type: {
            model: 'AllSupportedFormFieldsTag',
          },
          isRequired: false,
          attributes: [],
          isArrayNullable: true,
          association: {
            connectionType: 'HAS_MANY',
            associatedWith: 'allSupportedFormFields',
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
      pluralName: 'AllSupportedFormFields',
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
  },
  enums: {
    City: {
      name: 'City',
      values: [
        'SAN_FRANCISCO',
        'NEW_YORK',
        'HOUSTON',
        'AUSTIN',
        'LOS_ANGELES',
        'CHICAGO',
        'SAN_DIEGO',
        'NEW_HAVEN',
        'PORTLAND',
        'SEATTLE',
      ],
    },
  },
  nonModels: {
    CustomType: {
      name: 'CustomType',
      fields: {
        StringVal: {
          name: 'StringVal',
          isArray: false,
          type: 'String',
          isRequired: false,
          attributes: [],
        },
        NumVal: {
          name: 'NumVal',
          isArray: false,
          type: 'Int',
          isRequired: false,
          attributes: [],
        },
        BoolVal: {
          name: 'BoolVal',
          isArray: false,
          type: 'Boolean',
          isRequired: false,
          attributes: [],
        },
      },
    },
  },
  version: 'f6252c821249b6b1abda9fb24481c5a4',
  codegenVersion: '3.2.0',
};
