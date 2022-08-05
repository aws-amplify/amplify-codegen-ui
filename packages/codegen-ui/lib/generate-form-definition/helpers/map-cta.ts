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
      children: buttons.clear?.children ? buttons.clear.children : defaults.clear.children,
    },
    cancel: {
      visible: typeof buttons.cancel?.visible === 'boolean' ? buttons.cancel.visible : defaults.cancel.visible,
      children: buttons.cancel?.children ? buttons.cancel.children : defaults.cancel.children,
    },
    submit: {
      visible: typeof buttons.submit?.visible === 'boolean' ? buttons.submit.visible : defaults.submit.visible,
      children: buttons.submit?.children ? buttons.submit.children : defaults.submit.children,
    },
  };
}
