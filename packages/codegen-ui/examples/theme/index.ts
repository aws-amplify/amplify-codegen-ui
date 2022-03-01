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
import { ThemeExample } from '../example';

export const Theme: ThemeExample = {
  schemaType: 'Theme',
  schema: {
    id: '1234-5678-9010',
    name: 'MyTheme',
    values: [
      {
        key: 'tokens',
        value: {
          children: [
            {
              key: 'components',
              value: {
                children: [
                  {
                    key: 'alert',
                    value: {
                      children: [
                        {
                          key: 'backgroundColor',
                          value: {
                            value: 'hsl(210, 5%, 90%)',
                          },
                        },
                        {
                          key: 'padding',
                          value: {
                            value: '0.75rem 1rem',
                          },
                        },
                        {
                          key: 'info',
                          value: {
                            children: [
                              {
                                key: 'backgroundColor',
                                value: {
                                  value: 'hsl(220, 85%, 85%)',
                                },
                              },
                            ],
                          },
                        },
                        {
                          key: 'error',
                          value: {
                            children: [
                              {
                                key: 'backgroundColor',
                                value: {
                                  value: 'hsl(0, 75%, 85%)',
                                },
                              },
                            ],
                          },
                        },
                        {
                          key: 'warning',
                          value: {
                            children: [
                              {
                                key: 'backgroundColor',
                                value: {
                                  value: 'hsl(30, 75%, 85%)',
                                },
                              },
                            ],
                          },
                        },
                        {
                          key: 'success',
                          value: {
                            children: [
                              {
                                key: 'backgroundColor',
                                value: {
                                  value: 'hsl(130, 75%, 85%)',
                                },
                              },
                            ],
                          },
                        },
                      ],
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    ],
    overrides: [
      {
        key: 'colorMode',
        value: {
          value: 'dark',
        },
      },
      {
        key: 'tokens',
        value: {
          children: [
            {
              key: 'colors',
              value: {
                children: [
                  {
                    key: 'black',
                    value: {
                      children: [
                        {
                          key: 'value',
                          value: {
                            value: '#fff',
                          },
                        },
                      ],
                    },
                  },
                  {
                    key: 'white',
                    value: {
                      children: [
                        {
                          key: 'value',
                          value: {
                            value: '#000',
                          },
                        },
                      ],
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    ],
  },
  platformImplementations: {
    react: fs.readFileSync(join(__dirname, 'react.ts.snapshot'), 'utf-8'),
  },
};
