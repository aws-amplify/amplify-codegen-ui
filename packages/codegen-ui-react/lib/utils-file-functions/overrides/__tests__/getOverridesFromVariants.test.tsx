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
import type { Variant } from '../override-types';
import { getOverridesFromVariants } from '../getOverridesFromVariants';

describe('getOverridesFromVariants', () => {
  const variants: Variant[] = [
    {
      variantValues: {
        variant: 'primary',
      },
      overrides: {
        Button: {
          fontSize: '12px',
        },
      },
    },
    {
      variantValues: {
        variant: 'secondary',
      },
      overrides: {
        Button: {
          fontSize: '40px',
        },
      },
    },
    {
      variantValues: {
        variant: 'primary',
        size: 'large',
      },
      overrides: {
        Button: {
          width: '500',
        },
      },
    },
  ];

  it('should return overrides for primary variant, without optional', () => {
    const selectedVariantValue = { variant: 'primary' };
    const expected = {
      Button: {
        fontSize: '12px',
      },
    };
    expect(getOverridesFromVariants(variants, selectedVariantValue)).toEqual(expected);
  });

  it('should return overrides for alternative', () => {
    const selectedVariantValue = { variant: 'secondary' };
    const expected = {
      Button: {
        fontSize: '40px',
      },
    };
    expect(getOverridesFromVariants(variants, selectedVariantValue)).toEqual(expected);
  });

  it('should return overrides for multiple values, including optional', () => {
    const selectedVariantValue = { variant: 'primary', size: 'large' };
    const expected = {
      Button: {
        width: '500',
      },
    };
    expect(getOverridesFromVariants(variants, selectedVariantValue)).toEqual(expected);
  });

  it('should return no overrides invalid combo', () => {
    const selectedVariantValue = { variant: 'secondary', size: 'large' };
    const expected = {};
    expect(getOverridesFromVariants(variants, selectedVariantValue)).toEqual(expected);
  });

  it('should return no overrides on unexpected variant parameter', () => {
    const selectedVariantValue = { unexpected: 'yes' };
    const expected = {};
    expect(getOverridesFromVariants(variants, selectedVariantValue)).toEqual(expected);
  });

  it('should match on expected variants even with additional props', () => {
    const selectedVariantValue = { variant: 'primary', unexpected: 'yes' };
    const expected = {
      Button: {
        fontSize: '12px',
      },
    };
    expect(getOverridesFromVariants(variants, selectedVariantValue)).toEqual(expected);
  });

  it('should match on expected variants with optional even with additional props', () => {
    const selectedVariantValue = {
      variant: 'primary',
      size: 'large',
      unexpected: 'yes',
    };
    const expected = {
      Button: {
        width: '500',
      },
    };
    expect(getOverridesFromVariants(variants, selectedVariantValue)).toEqual(expected);
  });

  it('should match on expected variants with undefined for optional', () => {
    const selectedVariantValue = {
      variant: 'primary',
      size: undefined,
      unexpected: 'yes',
    };
    const expected = {
      Button: {
        fontSize: '12px',
      },
    };
    expect(getOverridesFromVariants(variants, selectedVariantValue)).toEqual(expected);
  });
});
