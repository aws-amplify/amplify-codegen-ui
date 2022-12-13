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
import { GenericDataSchema } from '@aws-amplify/codegen-ui';

export const authorHasManySchema: GenericDataSchema = {
  dataSourceType: 'DataStore',
  models: {
    Book: {
      primaryKeys: ['id'],
      fields: {
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
        bookImageSrc: {
          dataType: 'AWSURL',
          required: false,
          readOnly: false,
          isArray: false,
        },
        description: {
          dataType: 'String',
          required: false,
          readOnly: false,
          isArray: false,
        },
        authorID: {
          dataType: 'ID',
          required: true,
          readOnly: false,
          isArray: false,
          relationship: {
            type: 'HAS_ONE',
            relatedModelName: 'Author',
          },
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
      },
    },
    Author: {
      primaryKeys: ['id'],
      fields: {
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
        profileImageSrc: {
          dataType: 'AWSURL',
          required: false,
          readOnly: false,
          isArray: false,
        },
        description: {
          dataType: 'String',
          required: false,
          readOnly: false,
          isArray: false,
        },
        books: {
          dataType: {
            model: 'Book',
          },
          required: false,
          readOnly: false,
          isArray: true,
          relationship: {
            type: 'HAS_MANY',
            relatedModelName: 'Book',
            relatedModelFields: ['authorID'],
          },
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
      },
    },
  },
  enums: {},
  nonModels: {},
};
