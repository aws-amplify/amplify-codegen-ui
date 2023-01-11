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
import { factory } from 'typescript';
import {
  buildNestedStateSet,
  setFieldState,
  getDefaultValueExpression,
} from '../../forms/form-renderer-helper/form-state';
import { genericPrinter } from '../__utils__';

describe('nested state', () => {
  it('should generate state structure for nested keyPath', () => {
    const state = buildNestedStateSet(
      ['bio', 'favoriteAnimal', 'animalMeta', 'family', 'genus'],
      ['bio'],
      factory.createIdentifier('value'),
    );
    const response = genericPrinter(state);
    expect(response).toMatchSnapshot();
  });

  it('should generate value for 2nd level deep object', () => {
    const state = buildNestedStateSet(['bio', 'firstName'], ['bio'], factory.createStringLiteral('John C'));
    const response = genericPrinter(state);
    expect(response).toMatchSnapshot();
  });

  it('should throw error for 1 level deep path', () => {
    expect(() => buildNestedStateSet(['firstName'], ['firstName'], factory.createStringLiteral('John C'))).toThrowError(
      'keyPath needs a length larger than 1 to build nested state object',
    );
  });
});

describe('set field state', () => {
  it('should generate state call for nested object', () => {
    const fieldStateSetter = setFieldState(
      'bio.favoriteAnimal.animalMeta.family.genus',
      factory.createStringLiteral('hello World'),
    );
    const response = genericPrinter(fieldStateSetter);
    expect(response).toMatchSnapshot();
  });

  it('should generate state call for non-nested objects', () => {
    const fieldStateSetter = setFieldState('firstName', factory.createStringLiteral('john c'));
    const response = genericPrinter(fieldStateSetter);
    expect(response).toMatchSnapshot();
  });
});

describe('get default values', () => {
  it('should generate the proper default value for an empty TextField', () => {
    const expression = getDefaultValueExpression('name', 'TextField');
    expect(expression).toMatchObject({ text: '' });
  });

  it('should generate the proper default value for a SliderField', () => {
    const expression = getDefaultValueExpression('name', 'SliderField');
    expect(expression).toMatchObject({ text: '0' });
  });

  it('should generate the proper default value for non-empty TextField', () => {
    const expression = getDefaultValueExpression('name', 'TextField', undefined, false, false, 'Don Corleone');
    expect(expression).toMatchObject({ text: 'Don Corleone' });
  });

  it('should generate the proper default value for non-empty TextField array', () => {
    const expression = getDefaultValueExpression('name', 'TextField', undefined, true, false, 'mobster');
    expect(expression).toEqual(
      expect.objectContaining({
        elements: expect.arrayContaining([expect.objectContaining({ text: 'mobster' })]),
      }),
    );
  });
});
