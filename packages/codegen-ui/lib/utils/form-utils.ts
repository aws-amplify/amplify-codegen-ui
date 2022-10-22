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

import { StudioForm } from '../types';

export const shouldIncludeCancel = ({ cta }: StudioForm): boolean => {
  // first check if excluded is added in explicitly
  if (cta?.cancel && 'excluded' in cta.cancel && cta.cancel.excluded) {
    return false;
  }
  // if we find that cta has cancel defined (ex. an empty object)
  // we include the cancel button
  if (cta && cta.cancel) {
    return true;
  }

  // otherwise we return false
  return false;
};
