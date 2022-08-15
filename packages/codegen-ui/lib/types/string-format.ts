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

export enum DATE {
  LOCALE = 'locale',
  MDY = 'MM/DD/YYYY',
  DMY = 'DD.MM.YYYY',
  YMD = 'YYYY.MM.DD',
  MmmDY = 'Mmm DD, YYYY',
  test = 'test',
}

export enum TIME {
  LOCALE = 'locale',
  HOURS_12 = 'hours12',
  HOURS_24 = 'hours24',
}

export type DateFormat = {
  type?: 'DateFormat';
  dateFormat: 'locale' | 'MM/DD/YYYY' | 'DD.MM.YYYY' | 'YYYY.MM.DD' | 'Mmm DD, YYYY';
};

export type TimeFormat = {
  type?: 'TimeFormat';
  timeFormat: 'locale' | 'hours12' | 'hours24';
};

export type NonLocaleDateTimeFormat = {
  type?: 'NonLocaleDateTimeFormat';
  nonLocaleDateTimeFormat: {
    dateFormat: DateFormat['dateFormat'];
    timeFormat: TimeFormat['timeFormat'];
  };
};

export type LocaleDateTimeFormat = {
  type?: 'LocaleDateTimeFormat';
  localeDateTimeFormat: 'locale';
};

export type StringFormat = DateFormat | TimeFormat | NonLocaleDateTimeFormat | LocaleDateTimeFormat;
