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

import { StudioComponent } from '../types';

export const breakpointSizes = ['base', 'small', 'medium', 'large', 'xl', 'xxl'] as const;
export type BreakpointSizeType = typeof breakpointSizes[number];
export const bpWeights: Record<BreakpointSizeType, number> = {
  base: 0,
  small: 1,
  medium: 2,
  large: 3,
  xl: 4,
  xxl: 5,
};

/**
 * sorts the breakpoints to the following order
 *
 * ['base', 'small', 'medium', 'large', 'xl', 'xxl']
 */
export const sortBreakpoints = (bs: BreakpointSizeType[]): BreakpointSizeType[] => {
  return bs.sort((lhs, rhs) => {
    return bpWeights[lhs] - bpWeights[rhs];
  });
};

export const getBreakpoints = (component: StudioComponent & Required<Pick<StudioComponent, 'variants'>>) => {
  const breakpoints = component.variants.reduce<BreakpointSizeType[]>((acc, variant) => {
    if (variant.variantValues?.breakpoint) {
      acc.push(variant.variantValues.breakpoint as BreakpointSizeType);
    }
    return acc;
  }, []);
  return sortBreakpoints(breakpoints);
};
