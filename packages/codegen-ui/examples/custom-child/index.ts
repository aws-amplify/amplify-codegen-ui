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
import fs from 'fs';
import { join } from 'path';
import { ComponentExample } from '../example';

export const CustomChildExample: ComponentExample = {
  schemaType: 'Component',
  schema: {
    id: '1234-5678-9010',
    componentType: 'View',
    name: 'ViewWithCustomButton',
    properties: {},
    bindingProperties: {},
    children: [
      {
        componentType: 'CustomButton',
        name: 'MyCustomButton',
        properties: {
          color: {
            value: '#ff0000',
          },
          width: {
            value: '20px',
          },
        },
      },
    ],
    schemaVersion: '1.0',
  },
  platformImplementations: {
    react: fs.readFileSync(join(__dirname, 'react.tsx.snapshot'), 'utf-8'),
  },
};
