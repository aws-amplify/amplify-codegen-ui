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
import { GenericDataSchema, getGenericFromDataStore } from '@aws-amplify/codegen-ui';

/**
  type Author @model {
    name: String
    profileImageSrc: AWSURL
    description: String
    Books: [Book] @hasMany
    Publisher: Publisher @hasOne
    Sponsors: [Sponsor] @manyToMany(relationName: "AuthorSponsor")
  }
  
  type Book @model {
    name: String
    bookImageSrc: AWSURL
    description: String
  }
  
  type Publisher @model {
    name: String
  }
  
  type Sponsor @model {
    Authors: [Author] @manyToMany(relationName: "AuthorSponsor")
  }
   */
export const authorHasManySchema: GenericDataSchema = getGenericFromDataStore({
  models: {
    Author: {
      name: 'Author',
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
        profileImageSrc: {
          name: 'profileImageSrc',
          isArray: false,
          type: 'AWSURL',
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
        Books: {
          name: 'Books',
          isArray: true,
          type: {
            model: 'Book',
          },
          isRequired: false,
          attributes: [],
          isArrayNullable: true,
          association: {
            connectionType: 'HAS_MANY',
            associatedWith: 'authorBooksId',
          },
        },
        Publisher: {
          name: 'Publisher',
          isArray: false,
          type: {
            model: 'Publisher',
          },
          isRequired: false,
          attributes: [],
          association: {
            connectionType: 'HAS_ONE',
            associatedWith: 'id',
            targetName: 'authorPublisherId',
          },
        },
        Sponsors: {
          name: 'Sponsors',
          isArray: true,
          type: {
            model: 'AuthorSponsor',
          },
          isRequired: false,
          attributes: [],
          isArrayNullable: true,
          association: {
            connectionType: 'HAS_MANY',
            associatedWith: 'author',
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
        authorPublisherId: {
          name: 'authorPublisherId',
          isArray: false,
          type: 'ID',
          isRequired: false,
          attributes: [],
        },
      },
      syncable: true,
      pluralName: 'Authors',
      attributes: [
        {
          type: 'model',
          properties: {},
        },
      ],
    },
    Book: {
      name: 'Book',
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
        bookImageSrc: {
          name: 'bookImageSrc',
          isArray: false,
          type: 'AWSURL',
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
        authorBooksId: {
          name: 'authorBooksId',
          isArray: false,
          type: 'ID',
          isRequired: false,
          attributes: [],
        },
      },
      syncable: true,
      pluralName: 'Books',
      attributes: [
        {
          type: 'model',
          properties: {},
        },
        {
          type: 'key',
          properties: {
            name: 'gsi-Author.Books',
            fields: ['authorBooksId'],
          },
        },
      ],
    },
    Publisher: {
      name: 'Publisher',
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
      pluralName: 'Publishers',
      attributes: [
        {
          type: 'model',
          properties: {},
        },
      ],
    },
    Sponsor: {
      name: 'Sponsor',
      fields: {
        id: {
          name: 'id',
          isArray: false,
          type: 'ID',
          isRequired: true,
          attributes: [],
        },
        Authors: {
          name: 'Authors',
          isArray: true,
          type: {
            model: 'AuthorSponsor',
          },
          isRequired: false,
          attributes: [],
          isArrayNullable: true,
          association: {
            connectionType: 'HAS_MANY',
            associatedWith: 'sponsor',
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
      pluralName: 'Sponsors',
      attributes: [
        {
          type: 'model',
          properties: {},
        },
      ],
    },
    AuthorSponsor: {
      name: 'AuthorSponsor',
      fields: {
        id: {
          name: 'id',
          isArray: false,
          type: 'ID',
          isRequired: true,
          attributes: [],
        },
        authorId: {
          name: 'authorId',
          isArray: false,
          type: 'ID',
          isRequired: false,
          attributes: [],
        },
        sponsorId: {
          name: 'sponsorId',
          isArray: false,
          type: 'ID',
          isRequired: false,
          attributes: [],
        },
        author: {
          name: 'author',
          isArray: false,
          type: {
            model: 'Author',
          },
          isRequired: true,
          attributes: [],
          association: {
            connectionType: 'BELONGS_TO',
            targetName: 'authorId',
          },
        },
        sponsor: {
          name: 'sponsor',
          isArray: false,
          type: {
            model: 'Sponsor',
          },
          isRequired: true,
          attributes: [],
          association: {
            connectionType: 'BELONGS_TO',
            targetName: 'sponsorId',
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
      pluralName: 'AuthorSponsors',
      attributes: [
        {
          type: 'model',
          properties: {},
        },
        {
          type: 'key',
          properties: {
            name: 'byAuthor',
            fields: ['authorId'],
          },
        },
        {
          type: 'key',
          properties: {
            name: 'bySponsor',
            fields: ['sponsorId'],
          },
        },
      ],
    },
  },
  enums: {},
  nonModels: {},
  codegenVersion: '3.3.1',
  version: '448accd13d4335db7822f28a44b0972a',
});

/**
  type CompositePerson @model {
    name: ID! @primaryKey(sortKeyFields: ["description"])
    description: String!
    address: String
  }
 */

export const compositePersonSchema: GenericDataSchema = getGenericFromDataStore({
  models: {
    CompositePerson: {
      name: 'CompositePerson',
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
        address: {
          name: 'address',
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
      pluralName: 'CompositePeople',
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
  },
  enums: {},
  nonModels: {},
  codegenVersion: '3.3.2',
  version: 'accea0d7a2f24829740c710ceb3264a8',
});

export const userSchema: GenericDataSchema = getGenericFromDataStore({
  models: {
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
  },
  enums: {},
  nonModels: {},
  codegenVersion: '3.3.2',
  version: 'accea0d7a2f24829740c710ceb3264a8',
});
