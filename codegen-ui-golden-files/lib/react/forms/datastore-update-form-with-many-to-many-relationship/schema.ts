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

export const tagUpdateForm: StudioForm = {
  name: 'TagUpdateForm',
  dataType: { dataSourceType: 'DataStore', dataTypeName: 'Tag' },
  formActionType: 'update',
  fields: {
    Posts: {
      inputType: {
        type: 'Autocomplete',
        valueMappings: {
          values: [
            {
              value: {
                bindingProperties: {
                  property: 'Post',
                  field: 'id',
                },
              },
              displayValue: {
                bindingProperties: {
                  property: 'Post',
                  field: 'title',
                },
              },
            },
          ],
          bindingProperties: {
            Post: { type: 'Data', bindingProperties: { model: 'Post' } },
          },
        },
      },
    },
  },
  sectionalElements: {},
  style: {},
  cta: {},
};

export const tagSchema: Schema = {
  models: {
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
        Posts: {
          name: 'Posts',
          isArray: true,
          type: {
            model: 'TagPost',
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
        title: {
          name: 'title',
          isArray: false,
          type: 'String',
          isRequired: false,
          attributes: [],
        },
        content: {
          name: 'content',
          isArray: false,
          type: 'String',
          isRequired: false,
          attributes: [],
        },
        Tags: {
          name: 'Tags',
          isArray: true,
          type: {
            model: 'TagPost',
          },
          isRequired: false,
          attributes: [],
          isArrayNullable: true,
          association: {
            connectionType: 'HAS_MANY',
            associatedWith: 'post',
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
                allow: 'public',
                operations: ['create', 'update', 'delete', 'read'],
              },
            ],
          },
        },
      ],
    },
    TagPost: {
      name: 'TagPost',
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
        post: {
          name: 'post',
          isArray: false,
          type: {
            model: 'Post',
          },
          isRequired: true,
          attributes: [],
          association: {
            connectionType: 'BELONGS_TO',
            targetName: 'postID',
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
      pluralName: 'TagPosts',
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
            name: 'byPost',
            fields: ['postID'],
          },
        },
      ],
    },
  },
  enums: {},
  nonModels: {},
  version: '6661fbcb644d38cea3d27e2933e70457',
};
