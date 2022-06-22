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

import { DateFormat, DateTimeFormat, TimeFormat } from '../types';

const invalidDateStr = 'Invalid Date';

export function formatDate(date: string, format: DateFormat['dateFormat']): string {
  // AWSDate: YYYY-MM-DD (ISO 8601)
  const validDate = new Date(Date.parse(date));
  if (validDate.toString() === invalidDateStr) {
    return date;
  }

  const splitDate = date.split(/-|\+|Z/);

  const year = splitDate[0];
  const month = splitDate[1];
  const day = validDate.toLocaleString('en-us', { day: '2-digit' });

  switch (format) {
    case 'locale':
      return validDate.toLocaleDateString();
    case 'YYYY.MM.DD':
      return `${year}.${month}.${day}`;
    case 'DD.MM.YYYY':
      return `${day}.${month}.${year}`;
    case 'MM/DD/YYYY':
      return `${month}/${day}/${year}`;
    case 'Mmm DD, YYYY':
      return `${validDate.toLocaleString('en-us', { month: 'short' })} ${day}, ${year}`;
    default:
      return date;
  }
}

export function formatTime(time: string, format: TimeFormat['timeFormat']): string {
  // AWSTime: hh:mm:ss.sss (24hr format - ISO 8601)
  const splitTime = time.split(/:|Z/);

  if (splitTime.length < 3) {
    return time;
  }

  const validTime = new Date();
  validTime.setHours(Number.parseInt(splitTime[0], 10));
  validTime.setMinutes(Number.parseInt(splitTime[1], 10));

  const splitSeconds = splitTime[2].split('.');
  validTime.setSeconds(Number.parseInt(splitSeconds[0], 10), Number.parseInt(splitSeconds[1], 10));

  if (validTime.toString() === invalidDateStr) {
    return time;
  }

  switch (format) {
    case 'locale':
      return validTime.toLocaleTimeString();
    case 'hours24':
      return validTime.toLocaleTimeString('en-gb');
    case 'hours12':
      return validTime.toLocaleTimeString('en-us');
    default:
      return time;
  }
}

export function formatDateTime(dateTimeStr: string, format: DateTimeFormat['dateTimeFormat']): string {
  // AWSTimestamp: millis before or after 1970-01-01-T00:00*Z*
  // AWSDateTime: hh:mm:ss.sss (24hr format - ISO 8601)
  const dateTime = /^\d+$/.test(dateTimeStr)
    ? new Date(Number.parseInt(dateTimeStr, 10))
    : new Date(Date.parse(dateTimeStr));

  if (dateTime.toString() === invalidDateStr) {
    return dateTimeStr;
  }

  if (format === 'locale') {
    return dateTime.toLocaleString();
  }
  const dateAndTime = dateTime.toISOString().split('T');
  const date = formatDate(dateAndTime[0], format.dateFormat);
  const time = formatTime(dateAndTime[1], format.timeFormat);

  return `${date} - ${time}`;
}
