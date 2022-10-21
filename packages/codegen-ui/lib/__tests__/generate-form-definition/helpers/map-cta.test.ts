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
import { mapButtons } from '../../../generate-form-definition/helpers/map-cta';

describe('mapButtons', () => {
  it('correctly excludes from matrix but returns all configs', () => {
    const buttonConfigs = mapButtons('create', { submit: { excluded: true } });

    expect(buttonConfigs.buttonMatrix).toStrictEqual([['clear'], []]);
    expect(buttonConfigs.buttonConfigs.submit).toBeDefined();
    expect(buttonConfigs.buttonConfigs.cancel).toBeDefined();
    expect(buttonConfigs.buttonConfigs.clear).toBeDefined();
  });

  it('should add cancel if object is defined and still exclude submit', () => {
    const buttonConfigs = mapButtons('create', { submit: { excluded: true }, cancel: {} });

    expect(buttonConfigs.buttonMatrix).toStrictEqual([['clear'], ['cancel']]);
    expect(buttonConfigs.buttonConfigs.submit).toBeDefined();
    expect(buttonConfigs.buttonConfigs.cancel).toBeDefined();
    expect(buttonConfigs.buttonConfigs.clear).toBeDefined();
  });

  it('by default should only include clear and submit', () => {
    const buttonConfigs = mapButtons('create', {});

    expect(buttonConfigs.buttonMatrix).toStrictEqual([['clear'], ['submit']]);
    expect(buttonConfigs.buttonConfigs.submit).toBeDefined();
    expect(buttonConfigs.buttonConfigs.cancel).toBeDefined();
    expect(buttonConfigs.buttonConfigs.clear).toBeDefined();
  });
});
