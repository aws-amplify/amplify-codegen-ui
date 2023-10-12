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
import type { EscapeHatchProps } from '../override-types';
import { mergeVariantsAndOverrides } from '../mergeVariantsAndOverrides';

describe('mergeVariantsAndOverrides', () => {
  const expected: EscapeHatchProps = {
    'Flex.Button[0]': {
      color: 'red',
      size: 'large',
    },
    'Flex.CheckBox[1]': {
      isEnabled: 'false',
      size: 'large',
    },
  };
  it('should return merged variants after applying overrides', () => {
    const variants: EscapeHatchProps = {
      'Flex.Button[0]': {
        color: 'red',
      },
      'Flex.CheckBox[1]': {
        isEnabled: 'false',
        size: 'small',
      },
    };

    const overrides: EscapeHatchProps = {
      'Flex.Button[0]': {
        size: 'large',
      },
      'Flex.CheckBox[1]': {
        size: 'large',
      },
    };

    expect(mergeVariantsAndOverrides(variants, overrides)).toEqual(expected);
  });

  it('should return merged variants when override includes new control', () => {
    const variants: EscapeHatchProps = {
      'Flex.Button[0]': {
        color: 'red',
        size: 'large',
      },
    };

    const overrides: EscapeHatchProps = {
      'Flex.CheckBox[1]': {
        isEnabled: 'false',
        size: 'large',
      },
    };

    expect(mergeVariantsAndOverrides(variants, overrides)).toEqual(expected);
  });

  it('should return merged variants when all variants overridden', () => {
    const variants: EscapeHatchProps = {
      'Flex.Button[0]': {
        color: 'green',
        size: 'small',
      },
      'Flex.CheckBox[1]': {
        isEnabled: 'true',
        size: 'small',
      },
    };

    const overrides: EscapeHatchProps = {
      ...expected,
    };

    expect(mergeVariantsAndOverrides(variants, overrides)).toEqual(expected);
  });

  it('should return original variants when override is empty', () => {
    const variants: EscapeHatchProps = {
      ...expected,
    };

    const overrides: EscapeHatchProps = {};

    expect(mergeVariantsAndOverrides(variants, overrides)).toEqual(expected);
  });

  it('should return original variants when override is null', () => {
    const variants: EscapeHatchProps = {
      ...expected,
    };

    // cast null as EscapeHatchProps for exhaustive test case
    expect(mergeVariantsAndOverrides(variants, null as unknown as EscapeHatchProps)).toEqual(expected);
  });

  it('should return overrides when variant is null', () => {
    const overrides: EscapeHatchProps = {
      ...expected,
    };

    // cast null as EscapeHatchProps for exhaustive test case
    expect(mergeVariantsAndOverrides(null as unknown as EscapeHatchProps, overrides)).toEqual(expected);
  });

  it('should return null when both variant & override are null', () => {
    expect(
      // cast null as EscapeHatchProps for exhaustive test case
      mergeVariantsAndOverrides(null as unknown as EscapeHatchProps, null as unknown as EscapeHatchProps),
    ).toEqual(null);
  });
});
