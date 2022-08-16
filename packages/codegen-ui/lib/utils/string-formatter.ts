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
import { DateFormat, NonLocaleDateTimeFormat, LocaleDateTimeFormat, TimeFormat } from '../types/string-format';

const monthToShortMon: { [mon: string]: string } = {
  '1': 'Jan',
  '2': 'Feb',
  '3': 'Mar',
  '4': 'Apr',
  '5': 'May',
  '6': 'Jun',
  '7': 'Jul',
  '8': 'Aug',
  '9': 'Sep',
  '10': 'Oct',
  '11': 'Nov',
  '12': 'Dec',
};

const invalidDateStr = 'Invalid Date';

type DateFormatInput = {
  type: 'DateFormat';
  format: DateFormat;
};

type LocaleDateTimeFormatInput = {
  type: 'LocaleDateTimeFormat';
  format: LocaleDateTimeFormat;
};

type NonLocaleDateTimeFormatInput = {
  type: 'NonLocaleDateTimeFormat';
  format: NonLocaleDateTimeFormat;
};

type TimeFormatInput = {
  type: 'TimeFormat';
  format: TimeFormat;
};

type FormatInput = DateFormatInput | TimeFormatInput | NonLocaleDateTimeFormatInput | LocaleDateTimeFormatInput;

export function formatDate(date: string, dateFormat: DateFormat['dateFormat']): string {
  if (date === undefined || date === null) {
    return date;
  }

  // AWSDate: YYYY-MM-DD (ISO 8601)
  const validDate = new Date(Date.parse(date));
  if (validDate.toString() === invalidDateStr) {
    return date;
  }

  const splitDate = date.split(/-|\+|Z/);

  const year = splitDate[0];
  const month = splitDate[1];
  const day = splitDate[2];

  // Remove leading zeroes
  const truncatedMonth = month.replace(/^0+/, '');

  switch (dateFormat) {
    case 'locale':
      return validDate.toLocaleDateString();
    case 'YYYY.MM.DD':
      return `${year}.${month}.${day}`;
    case 'DD.MM.YYYY':
      return `${day}.${month}.${year}`;
    case 'MM/DD/YYYY':
      return `${month}/${day}/${year}`;
    case 'Mmm DD, YYYY':
      return `${monthToShortMon[truncatedMonth]} ${day}, ${year}`;
    default:
      return date;
  }
}

export function formatTime(time: string, timeFormat: TimeFormat['timeFormat']): string {
  if (time === undefined || time === null) {
    return time;
  }

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

  switch (timeFormat) {
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

export function formatDateTime(
  dateTimeStr: string,
  dateTimeFormat: NonLocaleDateTimeFormat['nonLocaleDateTimeFormat'] | LocaleDateTimeFormat['localeDateTimeFormat'],
): string {
  if (dateTimeStr === undefined || dateTimeStr === null) {
    return dateTimeStr;
  }

  // AWSTimestamp: millis before or after 1970-01-01-T00:00*Z*
  // AWSDateTime: hh:mm:ss.sss (24hr format - ISO 8601)
  const dateTime = /^\d+$/.test(dateTimeStr)
    ? new Date(Number.parseInt(dateTimeStr, 10))
    : new Date(Date.parse(dateTimeStr));

  if (dateTime.toString() === invalidDateStr) {
    return dateTimeStr;
  }

  if (dateTimeFormat === 'locale') {
    return dateTime.toLocaleString();
  }
  const dateAndTime = dateTime.toISOString().split('T');
  const date = formatDate(dateAndTime[0], dateTimeFormat.dateFormat);
  const time = formatTime(dateAndTime[1], dateTimeFormat.timeFormat);

  return `${date} - ${time}`;
}

export function formatter(value: string, formatterInput: FormatInput) {
  switch (formatterInput.type) {
    case 'DateFormat':
      return formatDate(value, formatterInput.format.dateFormat);
    case 'TimeFormat':
      return formatTime(value, formatterInput.format.timeFormat);
    case 'LocaleDateTimeFormat':
      return formatDateTime(value, formatterInput.format.localeDateTimeFormat);
    case 'NonLocaleDateTimeFormat':
      return formatDateTime(value, formatterInput.format.nonLocaleDateTimeFormat);
    default:
      return value;
  }
}
