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

import { StorageManagerProps } from '@aws-amplify/ui-react-storage';
import { STORAGE_FILE_ALGO_TYPE } from '../utils/constants';

/* istanbul ignore next */
export const processFile = async ({ file }: Parameters<NonNullable<StorageManagerProps['processFile']>>[0]) => {
  const fileExtension = file.name.split('.').pop();
  return file
    .arrayBuffer()
    .then((filebuffer) => window.crypto.subtle.digest(STORAGE_FILE_ALGO_TYPE, filebuffer))
    .then((hashBuffer) => {
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map((a) => a.toString(16).padStart(2, '0')).join('');
      return { file, key: `${hashHex}.${fileExtension}` };
    });
};

export const processFileString = `export const processFile = async ({ file }) => {
  const fileExtension = file.name.split('.').pop();
  return file
    .arrayBuffer()
    .then((filebuffer) => window.crypto.subtle.digest("SHA-1", filebuffer))
    .then((hashBuffer) => {
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map((a) => a.toString(16).padStart(2, '0')).join('');
      return { file, key: \`\${hashHex}.\${fileExtension}\` };
    });
};`;
