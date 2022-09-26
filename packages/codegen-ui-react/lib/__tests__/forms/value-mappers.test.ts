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

import { convertTimeStampToDate, convertToLocal } from '../../utils/forms/value-mappers';

describe('timestamp to date value mapper', () => {
  it('should get datetime value for timestamp in seconds', () => {
    // will return the millisecond value though it will not be populated
    const date = convertTimeStampToDate(1664221323);
    expect(date).toBeDefined();
    expect(date.toISOString()).toStrictEqual('2022-09-26T19:42:03.000Z');
  });

  it('should get datetime for value for timestamp in milliseconds', () => {
    const date = convertTimeStampToDate(1664221323190);
    expect(date).toBeDefined();
    expect(date.toISOString()).toStrictEqual('2022-09-26T19:42:03.190Z');
  });
});

describe('convert date object to datetime local format', () => {
  it('should convert date object to datetime format', () => {
    const dateString = convertToLocal(convertTimeStampToDate(1664221323190));
    expect(dateString).toBeDefined();
    // the format we expect is yyyy-mm-ddThh:mm:ss.SSS
    expect(dateString).toMatch(/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}).(\d{3})/);
  });
});
