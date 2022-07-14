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
import { DateTimeFormat, DATE, TIME } from '../types';
import { formatDate, formatTime, formatDateTime } from '../utils/string-formatter';

describe('string-formatter tests', () => {
  describe('Date and/or time formatting', () => {
    test('Date formats', () => {
      const awsDate = '2020-02-29';

      expect(formatDate(awsDate, 'locale')).toBe(new Date('2020-02-29').toLocaleDateString());
      expect(formatDate(awsDate, 'YYYY.MM.DD')).toBe('2020.02.29');
      expect(formatDate(awsDate, 'DD.MM.YYYY')).toBe('29.02.2020');
      expect(formatDate(awsDate, 'MM/DD/YYYY')).toBe('02/29/2020');
      expect(formatDate(awsDate, 'Mmm DD, YYYY')).toBe('Feb 29, 2020');

      const invalidDate = 'Not a date';
      expect(formatDate(invalidDate, 'Mmm DD, YYYY')).toBe(invalidDate);

      const nullish = undefined;
      expect(formatDate(nullish as any, DATE.DMY)).toBe(nullish);
    });

    test('Time formats', () => {
      const awsTime = '15:45:23.222';

      const date = new Date();
      date.setHours(15);
      date.setMinutes(45);
      date.setSeconds(23, 222);

      expect(formatTime(awsTime, 'locale')).toBe(date.toLocaleTimeString());
      expect(formatTime(awsTime, 'hours12')).toBe('3:45:23 PM');
      expect(formatTime(awsTime, 'hours24')).toBe('15:45:23');

      const invalidTime = 'Not:time:';
      expect(formatTime(invalidTime, 'locale')).toBe(invalidTime);

      const nullish = undefined;
      expect(formatTime(nullish as any, TIME.HOURS_24)).toBe(nullish);
    });

    test('Datetime formats', () => {
      const awsDateTime = '2020-02-29T15:45:23.222Z';

      const localDateStr = new Date(Date.parse(awsDateTime));

      const mixedFormatting: DateTimeFormat = {
        dateTimeFormat: {
          dateFormat: DATE.DMY,
          timeFormat: TIME.HOURS_12,
        },
      };

      expect(formatDateTime(awsDateTime, 'locale')).toBe(localDateStr.toLocaleString());
      expect(formatDateTime(awsDateTime, mixedFormatting.dateTimeFormat)).toBe('29.02.2020 - 3:45:23 PM');

      const invalidDateTime = 'Not a valid datetime';
      expect(formatDateTime(invalidDateTime, 'locale')).toBe(invalidDateTime);

      const awsTimeStamp = '1582991123222';
      expect(formatDateTime(awsTimeStamp, mixedFormatting.dateTimeFormat)).toBe('29.02.2020 - 3:45:23 PM');

      const nullish = undefined;
      expect(formatDateTime(nullish as any, mixedFormatting.dateTimeFormat)).toBe(nullish);
    });
  });
});
