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

export const schema: Schema = {
  codegenVersion: '3.4',
  models: {
    Home: {
      name: 'Home',
      fields: {
        id: {
          name: 'id',
          isArray: false,
          type: 'ID',
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
        image_url: {
          name: 'image_url',
          isArray: false,
          type: 'String',
          isRequired: false,
          attributes: [],
        },
        price: {
          name: 'price',
          isArray: false,
          type: 'Float',
          isRequired: false,
          attributes: [],
        },
        Rating: {
          name: 'Rating',
          isArray: false,
          type: 'Int',
          isRequired: false,
          attributes: [],
        },
        isAvailable: {
          name: 'isAvailable',
          isArray: false,
          type: 'Boolean',
          isRequired: false,
          attributes: [],
        },
        availabilityDateTime: {
          name: 'availabilityDateTime',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
        },
        availabilityDate: {
          name: 'availabilityDate',
          isArray: false,
          type: 'AWSDate',
          isRequired: false,
          attributes: [],
        },
        availabliltyTime: {
          name: 'availabliltyTime',
          isArray: false,
          type: 'AWSTime',
          isRequired: false,
          attributes: [],
        },
        randomJSON: {
          name: 'randomJSON',
          isArray: false,
          type: 'AWSJSON',
          isRequired: false,
          attributes: [],
        },
        timestamp: {
          name: 'timestamp',
          isArray: false,
          type: 'AWSTimestamp',
          isRequired: false,
          attributes: [],
        },
        phone: {
          name: 'phone',
          isArray: false,
          type: 'AWSPhone',
          isRequired: false,
          attributes: [],
        },
        ipAddress: {
          name: 'ipAddress',
          isArray: false,
          type: 'AWSIPAddress',
          isRequired: false,
          attributes: [],
        },
        email: {
          name: 'email',
          isArray: false,
          type: 'AWSEmail',
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
      pluralName: 'Homes',
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
  version: '0b8fa51057a3db3a3632f6951db2c1f2',
};
