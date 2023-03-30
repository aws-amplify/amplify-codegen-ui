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

export const FORM_DEFINITION_DEFAULTS = {
  styles: {
    horizontalGap: {
      value: '15px',
    },
    verticalGap: {
      value: '15px',
    },
    outerPadding: {
      value: '20px',
    },
  },

  field: {
    inputType: {
      label: 'Label',
      defaultCountryCode: '+1',
      value: 'fieldName',
      name: 'fieldName',
      valueMappings: { values: [{ value: { value: 'Option' } }] },
      fileUploaderConfig: {
        accessLevel: 'private',
        acceptedFileTypes: [],
        isResumable: false,
        showThumbnails: true,
      },
    },
    radioGroupFieldBooleanDisplayValue: { true: 'Yes', false: 'No' },
  },

  sectionalElement: {
    text: 'text',
  },

  cta: {
    position: 'bottom',
    buttonMatrix: [['clear'], ['cancel', 'submit']],
    cancel: {
      label: 'Cancel',
    },
    clear: {
      label: 'Clear',
    },
    submit: {
      label: 'Submit',
    },
  },
};
