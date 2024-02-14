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

import { StudioForm } from '@aws-amplify/codegen-ui';
import { Schema } from '@aws-amplify/datastore';

export const bookUpdateForm: StudioForm = {
  name: 'BookUpdateForm',
  dataType: { dataSourceType: 'DataStore', dataTypeName: 'Book' },
  formActionType: 'update',
  fields: {
    primaryAuthor: {
      inputType: {
        type: 'Autocomplete',
        valueMappings: {
          values: [
            {
              value: {
                bindingProperties: {
                  property: 'Author',
                  field: 'id',
                },
              },
              displayValue: {
                bindingProperties: {
                  property: 'Author',
                  field: 'name',
                },
              },
            },
          ],
          bindingProperties: {
            Author: { type: 'Data', bindingProperties: { model: 'Author' } },
          },
        },
      },
    },
  },
  sectionalElements: {},
  style: {},
  cta: {},
};

export const BookSchema: Schema = {
  models: {
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
        primaryAuthor: {
          name: 'primaryAuthor',
          isArray: false,
          type: {
            model: 'Author',
          },
          isRequired: false,
          attributes: [],
          association: {
            connectionType: 'HAS_ONE',
            associatedWith: 'id',
            targetName: 'authorId',
          },
        },
        authorId: {
          // note that associated field does not get auto-mapped
          name: 'authorId',
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
      pluralName: 'Books',
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
      pluralName: 'Authors',
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
  enums: {},
  nonModels: {},
  version: '8141cf0016cc7cbbce0082e7a757a4ed',
};
