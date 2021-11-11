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
/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const AmplifyUI = require('@aws-amplify/ui-react');
const pascalcase = require('pascalcase');

const iconset = Object.keys(AmplifyUI)
  .filter((name) => name.match(/^Icon\w/))
  .map(pascalcase);

const icons = {
  componentType: 'View',
  name: 'Icons',
  properties: {},
  children: iconset.map((icon) => ({
    componentType: icon,
    properties: {},
  })),
};

fs.writeFileSync('lib/components/icons.json', JSON.stringify(icons, null, 2));
