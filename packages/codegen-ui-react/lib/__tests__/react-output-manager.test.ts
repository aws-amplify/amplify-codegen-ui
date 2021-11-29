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
import { mocked } from 'ts-jest/utils'; // eslint-disable-line import/no-extraneous-dependencies
import { existsSync, mkdirSync, promises as fs } from 'fs';
import { ReactOutputManager } from '../react-output-manager';

jest.mock('fs', () => ({
  promises: {
    writeFile: jest.fn(),
  },
  existsSync: jest.fn().mockReturnValue(true),
  mkdirSync: jest.fn(),
}));

describe('react-output-manager', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('writeComponent', () => {
    const outputPath = 'output/MyComponent.js';
    const input = 'My Component Text';

    test('writes component', async () => {
      await new ReactOutputManager().writeComponent(input, outputPath);

      expect(mocked(fs.writeFile).mock.calls).toMatchSnapshot();
    });

    test('writes component if dir does not exist', async () => {
      mocked(existsSync).mockReturnValue(false);

      await new ReactOutputManager().writeComponent(input, outputPath);

      expect(mocked(mkdirSync)).toHaveBeenCalledWith('output');
      expect(mocked(fs.writeFile)).toHaveBeenCalled();
    });

    test('throws error if component text is not set', async () => {
      expect.assertions(1);
      await expect(new ReactOutputManager().writeComponent('', outputPath)).rejects.toThrowErrorMatchingSnapshot();
    });
  });
});
