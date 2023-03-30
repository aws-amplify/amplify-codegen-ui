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

import {
  FixedStudioComponentProperty,
  ConcatenatedStudioComponentProperty,
  ConditionalStudioComponentProperty,
  BoundStudioComponentProperty,
} from '../properties';
import { StudioComponentPropertyBinding } from '../bindings';

export type StudioFormInputFieldProperty =
  | FixedStudioComponentProperty
  | ConcatenatedStudioComponentProperty
  | ConditionalStudioComponentProperty
  | BoundStudioComponentProperty;

export type StudioFormValueMappings = {
  values: {
    displayValue?: StudioFormInputFieldProperty & { isDefault?: boolean };
    value: StudioFormInputFieldProperty;
  }[];

  bindingProperties?: { [propertyName: string]: StudioComponentPropertyBinding };
};

// represents API shape after type casting
export type StudioFieldInputConfig = {
  type?: string;

  required?: boolean;

  readOnly?: boolean;

  placeholder?: string;

  defaultValue?: string | number;

  descriptiveText?: string;

  defaultChecked?: boolean;

  defaultCountryCode?: string;

  valueMappings?: StudioFormValueMappings;

  name?: string;

  minValue?: number;

  maxValue?: number;

  step?: number;

  value?: string;

  isArray?: boolean;

  fileUploaderConfig?: {
    accessLevel: StorageAccessLevel;

    acceptedFileTypes: string[];

    showThumbnails?: boolean;

    isResumable?: boolean;

    maxFileCount?: number;

    maxSize?: number;
  };
};

export type StorageAccessLevel = 'public' | 'protected' | 'private';
