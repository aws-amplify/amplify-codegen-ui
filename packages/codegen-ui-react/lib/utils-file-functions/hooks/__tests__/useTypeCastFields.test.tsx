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
import { renderHook } from '@testing-library/react-hooks';
import { useTypeCastFields } from '../useTypeCastFields';
import { Home } from './test-models/models';
import { schema } from './test-models/schema';

jest.mock('aws-amplify');

const stringFields = {
  address: '1234 Main St',
  image_url: 'https://images.unsplash.com/photo',
  price: '1.99',
  Rating: '5',
  isAvailable: 'true',
  availabilityDateTime: '2202-03-01T13:00:00.253Z',
  availabilityDate: '2048-01-01',
  availabliltyTime: '13:00:00.253',
  randomJSON: '{"some":"key"}',
  timestamp: '31556926',
  phone: '444-555-6666',
  ipAddress: '192.1.1.1',
  email: 'janeDoe@gmail.com',
  createdAt: '2202-03-01T13:00:00.253Z',
  updatedAt: '2202-03-01T13:00:00.253Z',
};

const fields = {
  ...stringFields,
  price: 1.99,
  Rating: 5,
  isAvailable: true,
  timestamp: 31556926,
};

describe('useTypeCastFields', () => {
  describe('when using fields with schema', () => {
    const {
      result: { current: convertedFields },
    } = renderHook(() =>
      useTypeCastFields<Home>({
        fields: stringFields,
        modelName: 'Home',
        schema,
      }),
    );
    it('should convert string with Int types to Number', () => {
      expect(convertedFields.Rating).toEqual(5);
    });

    it('should convert string with Float types to Number', () => {
      expect(convertedFields.price).toEqual(1.99);
    });

    it('should convert string with AWSTimestamp types to Number', () => {
      expect(convertedFields.timestamp).toEqual(31556926);
    });

    // Note this would only apply if users put a Boolean datastore
    // type on Field that returns string, such an TextField (input)
    it('should convert string with Boolean types to Boolean', () => {
      expect(convertedFields.isAvailable).toEqual(true);
    });

    // this test is mean to catch any unexpected conversions
    it('should convert everything together correctly', () => {
      expect(convertedFields).toEqual(fields);
    });
  });

  describe('when using strongly typed fields (no schema)', () => {
    const {
      result: { current },
    } = renderHook(() =>
      useTypeCastFields<Home>({
        fields,
        modelName: 'Home',
        schema: undefined,
      }),
    );
    it('should just return fields directly', () => {
      expect(current).toBe(fields);
    });
  });
});
