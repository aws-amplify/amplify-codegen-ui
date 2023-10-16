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

import { EscapeHatchProps } from './override-types';

/**
 * This helper method is used to merge
 * variants with overrides
 * @internal
 * @param variants
 * @param overrides
 * @returns merged variants with overrides
 */
export const mergeVariantsAndOverrides = (
  variants: EscapeHatchProps,
  overrides: EscapeHatchProps,
): EscapeHatchProps => {
  if (!variants && !overrides) {
    return null;
  }
  if (!overrides) {
    return variants;
  }
  if (!variants) {
    return overrides;
  }
  const overrideKeys = new Set(Object.keys(overrides));
  const sharedKeys = Object.keys(variants).filter((variantKey) => overrideKeys.has(variantKey));
  const merged = Object.fromEntries(
    sharedKeys.map((sharedKey) => [sharedKey, { ...variants[sharedKey], ...overrides[sharedKey] }]),
  );
  return {
    ...variants,
    ...overrides,
    ...merged,
  };
};
export const mergeVariantsAndOverridesString = `export const mergeVariantsAndOverrides = (
  variants: EscapeHatchProps,
  overrides: EscapeHatchProps
): EscapeHatchProps => {
  if (!variants && !overrides) {
    return null;
  }
  if (!overrides) {
    return variants;
  }
  if (!variants) {
    return overrides;
  }
  const overrideKeys = new Set(Object.keys(overrides));
  const sharedKeys = Object.keys(variants).filter((variantKey) =>
    overrideKeys.has(variantKey)
  );
  const merged = Object.fromEntries(
    sharedKeys.map((sharedKey) => [
      sharedKey,
      { ...variants[sharedKey], ...overrides[sharedKey] },
    ])
  );
  return {
    ...variants,
    ...overrides,
    ...merged,
  };
};`;
