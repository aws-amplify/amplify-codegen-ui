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
import { FORM_DEFINITION_DEFAULTS } from './defaults';
import { StudioFormCTAConfig } from '../../types';

export function mapButtons(buttons: StudioFormCTAConfig): StudioFormCTAConfig {
  const defaults = FORM_DEFINITION_DEFAULTS.ctaConfig;
  return {
    position: buttons.position ? buttons.position : defaults.position,
    clear: {
      visible: typeof buttons.clear?.visible === 'boolean' ? buttons.clear?.visible : defaults.clear.visible,
      label: buttons.clear?.label ? buttons.clear.label : defaults.clear.label,
    },
    cancel: {
      visible: typeof buttons.cancel?.visible === 'boolean' ? buttons.cancel.visible : defaults.cancel.visible,
      label: buttons.cancel?.label ? buttons.cancel.label : defaults.cancel.label,
    },
    submit: {
      visible: typeof buttons.submit?.visible === 'boolean' ? buttons.submit.visible : defaults.submit.visible,
      label: buttons.submit?.label ? buttons.submit.label : defaults.submit.label,
    },
  };
}
