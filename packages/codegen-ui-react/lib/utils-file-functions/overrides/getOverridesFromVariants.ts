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
import { Variant, VariantValues } from './override-types';

export function getOverridesFromVariants<T>(
  variants: Variant[],
  props: { [key: string]: T },
): { [key: string]: Variant } {
  // Get unique keys from the provided variants
  const variantValueKeys = [...new Set(variants.flatMap((variant) => Object.keys(variant.variantValues)))];

  const variantValuesFromProps: VariantValues = Object.keys(props)
    .filter((i) => variantValueKeys.includes(i) && props[i])
    .reduce((acc, key) => {
      return {
        ...acc,
        [key]: props[key],
      };
    }, {});

  const matchedVariants = variants.filter(({ variantValues }) => {
    return (
      Object.keys(variantValues).length === Object.keys(variantValuesFromProps).length &&
      Object.entries(variantValues).every(([key, value]) => variantValuesFromProps[key] === value)
    );
  });

  return matchedVariants.reduce((overrides, variant) => {
    return { ...overrides, ...variant.overrides };
  }, {});
}
export const getOverridesFromVariantsString = `export function getOverridesFromVariants<T>(
  variants: Variant[],
  props: { [key: string]: T }
): { [key: string]: Variant } {
  const variantValueKeys = [
    ...new Set(
      variants.flatMap((variant) => Object.keys(variant.variantValues))
    ),
  ];
  const variantValuesFromProps: VariantValues = Object.keys(props)
    .filter((i) => variantValueKeys.includes(i) && props[i])
    .reduce((acc, key) => {
      return {
        ...acc,
        [key]: props[key],
      };
    }, {});
  const matchedVariants = variants.filter(({ variantValues }) => {
    return (
      Object.keys(variantValues).length ===
        Object.keys(variantValuesFromProps).length &&
      Object.entries(variantValues).every(
        ([key, value]) => variantValuesFromProps[key] === value
      )
    );
  });
  return matchedVariants.reduce((overrides, variant) => {
    return { ...overrides, ...variant.overrides };
  }, {});
}`;
