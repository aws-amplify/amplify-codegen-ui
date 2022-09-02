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
import { StudioFormStyle, FormDefinition } from '../../types';
import { FORM_DEFINITION_DEFAULTS } from './defaults';

function hasValue(
  config: { tokenReference?: string; value?: string } | undefined,
): config is { tokenReference: string } | { value: string } {
  return !!(config && (config.tokenReference || config.value));
}

export function mapStyles(styles: StudioFormStyle): FormDefinition['form']['layoutStyle'] {
  const defaults = FORM_DEFINITION_DEFAULTS.styles;
  return {
    horizontalGap: hasValue(styles.horizontalGap) ? styles.horizontalGap : defaults.horizontalGap,
    verticalGap: hasValue(styles.verticalGap) ? styles.verticalGap : defaults.verticalGap,
    outerPadding: hasValue(styles.outerPadding) ? styles.outerPadding : defaults.outerPadding,
  };
}
