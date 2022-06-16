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
  dateFormat: 'locale' | 'MM/DD/YYYY' | 'DD.MM.YYYY' | 'YYYY.MM.DD' | 'Mmm DD, YYYY';
};

export type TimeFormat = {
  timeFormat: 'locale' | '12hr' | '24hr';
};

export type DateTimeFormat = {
  timeFormat:
    | 'locale'
    | {
        dateFormat: DateFormat;
        timeFormat: TimeFormat;
      };
};

export type StringFormat = DateFormat | TimeFormat | DateTimeFormat;
