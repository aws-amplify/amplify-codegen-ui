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
import { Schema } from '@aws-amplify/datastore';

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
