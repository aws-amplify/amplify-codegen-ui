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
import { NonLocaleDateTimeFormat, DATE, TIME } from '../types/string-format';
import { formatter } from '../utils/string-formatter';

describe('string-formatter tests', () => {
  describe('Date and/or time formatting', () => {
    test('Date formats', () => {
      const awsDate = '2020-02-29';

      expect(formatter(awsDate, { type: 'DateFormat', format: { dateFormat: 'locale' } })).toBe(
        new Date('2020-02-29').toLocaleDateString(),
      );
      expect(formatter(awsDate, { type: 'DateFormat', format: { dateFormat: 'YYYY.MM.DD' } })).toBe('2020.02.29');
      expect(formatter(awsDate, { type: 'DateFormat', format: { dateFormat: 'DD.MM.YYYY' } })).toBe('29.02.2020');
      expect(formatter(awsDate, { type: 'DateFormat', format: { dateFormat: 'MM/DD/YYYY' } })).toBe('02/29/2020');
      expect(formatter(awsDate, { type: 'DateFormat', format: { dateFormat: 'Mmm DD, YYYY' } })).toBe('Feb 29, 2020');

      const invalidDate = 'Not a date';
      expect(formatter(invalidDate, { type: 'DateFormat', format: { dateFormat: 'Mmm DD, YYYY' } })).toBe(invalidDate);

      const nullish = undefined;
      expect(formatter(nullish as any, { type: 'DateFormat', format: { dateFormat: DATE.DMY } })).toBe(nullish);
    });

    test('Time formats', () => {
      const awsTime = '15:45:23.222';

      const date = new Date();
      date.setHours(15);
      date.setMinutes(45);
      date.setSeconds(23, 222);

      expect(formatter(awsTime, { type: 'TimeFormat', format: { timeFormat: 'locale' } })).toBe(
        date.toLocaleTimeString(),
      );
      expect(formatter(awsTime, { type: 'TimeFormat', format: { timeFormat: 'hours12' } })).toBe('3:45:23 PM');
      expect(formatter(awsTime, { type: 'TimeFormat', format: { timeFormat: 'hours24' } })).toBe('15:45:23');

      const invalidTime = 'Not:time:';
      expect(formatter(invalidTime, { type: 'TimeFormat', format: { timeFormat: 'locale' } })).toBe(invalidTime);

      const nullish = undefined;
      expect(formatter(nullish as any, { type: 'TimeFormat', format: { timeFormat: TIME.HOURS_24 } })).toBe(nullish);
    });

    test('Datetime formats', () => {
      const awsDateTime = '2020-02-29T15:45:23.222Z';

      const localDateStr = new Date(Date.parse(awsDateTime));

      const mixedFormatting: NonLocaleDateTimeFormat = {
        nonLocaleDateTimeFormat: {
          dateFormat: DATE.DMY,
          timeFormat: TIME.HOURS_12,
        },
      };

      expect(formatter(awsDateTime, { type: 'LocaleDateTimeFormat', format: { localeDateTimeFormat: 'locale' } })).toBe(
        localDateStr.toLocaleString(),
      );
      expect(
        formatter(awsDateTime, {
          type: 'NonLocaleDateTimeFormat',
          format: { nonLocaleDateTimeFormat: mixedFormatting.nonLocaleDateTimeFormat },
        }),
      ).toBe('29.02.2020 - 3:45:23 PM');

      const invalidDateTime = 'Not a valid datetime';
      expect(
        formatter(invalidDateTime, { type: 'LocaleDateTimeFormat', format: { localeDateTimeFormat: 'locale' } }),
      ).toBe(invalidDateTime);

      const awsTimeStamp = '1582991123222';
      expect(
        formatter(awsTimeStamp, {
          type: 'NonLocaleDateTimeFormat',
          format: { nonLocaleDateTimeFormat: mixedFormatting.nonLocaleDateTimeFormat },
        }),
      ).toBe('29.02.2020 - 3:45:23 PM');

      const nullish = undefined;
      expect(
        formatter(nullish as any, {
          type: 'NonLocaleDateTimeFormat',
          format: { nonLocaleDateTimeFormat: mixedFormatting.nonLocaleDateTimeFormat },
        }),
      ).toBe(nullish);
    });

    test('format returns undefined', () => {
      const awsDateTime = '2020-02-29T15:45:23.222Z';
      const mixedFormatting: NonLocaleDateTimeFormat = {
        nonLocaleDateTimeFormat: {
          dateFormat: DATE.DMY,
          timeFormat: TIME.HOURS_12,
        },
      };
      expect(
        formatter(awsDateTime, { type: 'UnknownFormat' as any, format: mixedFormatting.nonLocaleDateTimeFormat }),
      ).toBe(awsDateTime);
    });
  });
});
