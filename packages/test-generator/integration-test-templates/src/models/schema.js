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
          isRequired: false,
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
      pluralName: 'Classes',
      attributes: [
        {
          type: 'model',
          properties: {},
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
            associatedWith: ['tag'],
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
          isArrayNullable: true,
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
        nonModelField: {
          name: 'nonModelField',
          isArray: false,
          type: {
            nonModel: 'CustomType',
          },
          isRequired: false,
          attributes: [],
        },
        nonModelFieldArray: {
          name: 'nonModelFieldArray',
          isArray: true,
          type: {
            nonModel: 'CustomType',
          },
          isRequired: false,
          attributes: [],
          isArrayNullable: true,
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
            associatedWith: ['id'],
            targetNames: ['allSupportedFormFieldsHasOneUserId'],
          },
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
            targetNames: ['allSupportedFormFieldsBelongsToOwnerId'],
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
            associatedWith: ['allSupportedFormFieldsID'],
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
            associatedWith: ['allSupportedFormFields'],
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
        allSupportedFormFieldsHasOneUserId: {
          name: 'allSupportedFormFieldsHasOneUserId',
          isArray: false,
          type: 'ID',
          isRequired: false,
          attributes: [],
        },
        allSupportedFormFieldsBelongsToOwnerId: {
          name: 'allSupportedFormFieldsBelongsToOwnerId',
          isArray: false,
          type: 'ID',
          isRequired: false,
          attributes: [],
        },
      },
      syncable: true,
      pluralName: 'AllSupportedFormFields',
      attributes: [
        {
          type: 'model',
          properties: {},
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
            associatedWith: ['id'],
            targetNames: ['ownerAllSupportedFormFieldsId'],
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
      ],
    },
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
          isRequired: true,
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
          isRequired: true,
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
            associatedWith: ['name', 'description'],
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
    BiDirectionalDog: {
      name: 'BiDirectionalDog',
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
        BiDirectionalOwner: {
          name: 'BiDirectionalOwner',
          isArray: false,
          type: {
            model: 'BiDirectionalOwner',
          },
          isRequired: false,
          attributes: [],
          association: {
            connectionType: 'BELONGS_TO',
            targetNames: ['biDirectionalDogBiDirectionalOwnerId'],
          },
        },
        BiDirectionalToys: {
          name: 'BiDirectionalToys',
          isArray: true,
          type: {
            model: 'BiDirectionalToy',
          },
          isRequired: false,
          attributes: [],
          isArrayNullable: true,
          association: {
            connectionType: 'HAS_MANY',
            associatedWith: ['biDirectionalDogBiDirectionalToysId'],
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
        biDirectionalDogBiDirectionalOwnerId: {
          name: 'biDirectionalDogBiDirectionalOwnerId',
          isArray: false,
          type: 'ID',
          isRequired: false,
          attributes: [],
        },
      },
      syncable: true,
      pluralName: 'BiDirectionalDogs',
      attributes: [
        {
          type: 'model',
          properties: {},
        },
      ],
    },
    BiDirectionalOwner: {
      name: 'BiDirectionalOwner',
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
        biDirectionalDogID: {
          name: 'biDirectionalDogID',
          isArray: false,
          type: 'ID',
          isRequired: true,
          attributes: [],
        },
        BiDirectionalDog: {
          name: 'BiDirectionalDog',
          isArray: false,
          type: {
            model: 'BiDirectionalDog',
          },
          isRequired: true,
          attributes: [],
          association: {
            connectionType: 'HAS_ONE',
            associatedWith: ['id'],
            targetNames: ['biDirectionalDogID'],
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
      pluralName: 'BiDirectionalOwners',
      attributes: [
        {
          type: 'model',
          properties: {},
        },
      ],
    },
    BiDirectionalToy: {
      name: 'BiDirectionalToy',
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
        biDirectionalDogID: {
          name: 'biDirectionalDogID',
          isArray: false,
          type: 'ID',
          isRequired: true,
          attributes: [],
        },
        BiDirectionalDog: {
          name: 'BiDirectionalDog',
          isArray: false,
          type: {
            model: 'BiDirectionalDog',
          },
          isRequired: true,
          attributes: [],
          association: {
            connectionType: 'BELONGS_TO',
            targetNames: ['biDirectionalDogID'],
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
        biDirectionalDogBiDirectionalToysId: {
          name: 'biDirectionalDogBiDirectionalToysId',
          isArray: false,
          type: 'ID',
          isRequired: false,
          attributes: [],
        },
      },
      syncable: true,
      pluralName: 'BiDirectionalToys',
      attributes: [
        {
          type: 'model',
          properties: {},
        },
      ],
    },
    ModelWithVariableCollisions: {
      name: 'ModelWithVariableCollisions',
      fields: {
        id: {
          name: 'id',
          isArray: false,
          type: 'ID',
          isRequired: true,
          attributes: [],
        },
        modelWithVariableCollisions: {
          name: 'modelWithVariableCollisions',
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
      pluralName: 'ModelWithVariableCollisions',
      attributes: [
        {
          type: 'model',
          properties: {},
        },
      ],
    },
    Dealership: {
      name: 'Dealership',
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
          isRequired: true,
          attributes: [],
        },
        cars: {
          name: 'cars',
          isArray: true,
          type: {
            model: 'Car',
          },
          isRequired: false,
          attributes: [],
          isArrayNullable: true,
          association: {
            connectionType: 'HAS_MANY',
            associatedWith: ['dealership'],
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
      pluralName: 'Dealerships',
      attributes: [
        {
          type: 'model',
          properties: {},
        },
      ],
    },
    Car: {
      name: 'Car',
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
          isRequired: true,
          attributes: [],
        },
        dealershipId: {
          name: 'dealershipId',
          isArray: false,
          type: 'ID',
          isRequired: false,
          attributes: [],
        },
        dealership: {
          name: 'dealership',
          isArray: false,
          type: {
            model: 'Dealership',
          },
          isRequired: false,
          attributes: [],
          association: {
            connectionType: 'BELONGS_TO',
            targetNames: ['dealershipId'],
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
      pluralName: 'Cars',
      attributes: [
        {
          type: 'model',
          properties: {},
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
        tagId: {
          name: 'tagId',
          isArray: false,
          type: 'ID',
          isRequired: false,
          attributes: [],
        },
        allSupportedFormFieldsId: {
          name: 'allSupportedFormFieldsId',
          isArray: false,
          type: 'ID',
          isRequired: false,
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
            targetNames: ['tagId'],
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
            targetNames: ['allSupportedFormFieldsId'],
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
            fields: ['tagId'],
          },
        },
        {
          type: 'key',
          properties: {
            name: 'byAllSupportedFormFields',
            fields: ['allSupportedFormFieldsId'],
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
  codegenVersion: '3.3.6',
  version: '832519d29b9b70a1444d1c99127dbd59',
};
