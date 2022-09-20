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

import { StudioComponent } from '../../types';
import { getBreakpoints } from '../../utils';

type ComponentWithVariant = StudioComponent & Required<Pick<StudioComponent, 'variants'>>;

describe('breakpoint utils', () => {
  it('should sort breakpoints correctly', () => {
    const component: ComponentWithVariant = {
      name: 'sample',
      componentType: '',
      properties: {},
      bindingProperties: {},
      variants: [
        {
          variantValues: {
            breakpoint: 'xxl',
          },
          overrides: {},
        },
        {
          variantValues: {
            breakpoint: 'small',
          },
          overrides: {},
        },
        {
          variantValues: {
            breakpoint: 'base',
          },
          overrides: {},
        },
      ],
    };

    const breakpoints = getBreakpoints(component);
    expect(breakpoints).toStrictEqual(['base', 'small', 'xxl']);
  });
  it('should remove invalid breakpoint sizes', () => {
    const component: ComponentWithVariant = {
      name: 'sample',
      componentType: '',
      properties: {},
      bindingProperties: {},
      variants: [
        {
          variantValues: {
            breakpoint: 'xxs',
          },
          overrides: {},
        },
        {
          variantValues: {
            breakpoint: 'base',
          },
          overrides: {},
        },
        {
          variantValues: {
            breakpoint: 'small',
          },
          overrides: {},
        },
      ],
    };

    const breakpoints = getBreakpoints(component);
    expect(breakpoints).toStrictEqual(['base', 'small']);
  });
});
