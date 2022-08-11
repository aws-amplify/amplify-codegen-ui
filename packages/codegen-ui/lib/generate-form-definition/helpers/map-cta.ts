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
import { StudioFormCTA } from '../../types';

export function mapButtons(buttons: StudioFormCTA): {} {
  const defaults = FORM_DEFINITION_DEFAULTS.cta;
  return {
    position: buttons.position ? buttons.position : defaults.position,
    clear: {
      visible: typeof buttons.clear?.visible === 'boolean' ? buttons.clear?.visible : defaults.clear.visible,
      label: buttons.clear?.children ? buttons.clear.children : defaults.clear.label,
      variants: buttons.clear?.variants ? buttons.clear.variants : defaults.clear.variants,
    },
    cancel: {
      visible: typeof buttons.cancel?.visible === 'boolean' ? buttons.cancel.visible : defaults.cancel.visible,
      label: buttons.cancel?.children ? buttons.cancel.children : defaults.cancel.label,
      variants: buttons.cancel?.variants ? buttons.cancel.variants : defaults.cancel.variants,
    },
    submit: {
      visible: typeof buttons.submit?.visible === 'boolean' ? buttons.submit.visible : defaults.submit.visible,
      label: buttons.submit?.children ? buttons.submit.children : defaults.submit.label,
      variants: buttons.submit?.variants ? buttons.submit.variants : defaults.submit.variants,
    },
  };
}
