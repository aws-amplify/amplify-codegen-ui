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
import { getOverrideProps } from '../getOverrideProps';

describe('getOverrideProps', () => {
  const overrides = {
    View: {
      width: '436px',
      padding: '0px 0px 0px 0px',
      backgroundColor: 'rgba(50.36245197057724,0,251.81250303983688,1)',
      overflow: 'hidden',
      position: 'relative',
      height: '98px',
    },
    'View.Text[0]': {
      fontSize: '12px',
      color: 'red',
    },
  };

  it('returns the correct overrides when path matches', () => {
    const result = getOverrideProps(overrides, 'View');
    expect(result).toEqual({
      width: '436px',
      padding: '0px 0px 0px 0px',
      backgroundColor: 'rgba(50.36245197057724,0,251.81250303983688,1)',
      overflow: 'hidden',
      position: 'relative',
      height: '98px',
    });
  });

  it('returns the correct overrides when path matches complex', () => {
    const result = getOverrideProps(overrides, 'View.Text[0]');
    expect(result).toEqual({
      fontSize: '12px',
      color: 'red',
    });
  });

  it('returns an empty object when nothing matches', () => {
    const result = getOverrideProps(overrides, 'Flex');
    expect(result).toEqual({});
  });
});
