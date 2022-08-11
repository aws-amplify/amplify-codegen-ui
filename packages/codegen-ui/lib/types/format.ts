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

export type DateFormat = {
  type?: 'DateFormat';
  dateFormat: 'locale' | 'MM/DD/YYYY' | 'DD.MM.YYYY' | 'YYYY.MM.DD' | 'Mmm DD, YYYY';
};

export type TimeFormat = {
  type?: 'TimeFormat';
  timeFormat: 'locale' | 'hours12' | 'hours24';
};

export type DateTimeFormat = {
  type?: 'DateTimeFormat';
  dateTimeFormat:
    | 'locale'
    | {
        dateFormat: DateFormat['dateFormat'];
        timeFormat: TimeFormat['timeFormat'];
      };
};

export type StringFormat = DateFormat | TimeFormat | DateTimeFormat;