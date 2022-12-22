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

import * as React from 'react';
import { EscapeHatchProps } from '@aws-amplify/ui-react/internal';
import { GridProps, TextFieldProps } from '@aws-amplify/ui-react';

export declare type ValidationResponse = {
  hasError: boolean;
  errorMessage?: string;
};
export declare type ValidationFunction<T> = (
  value: T,
  validationResponse: ValidationResponse,
) => ValidationResponse | Promise<ValidationResponse>;
export declare type TagCreateFormInputValues = {
  label?: string;
};
export declare type TagCreateFormValidationValues = {
  label?: ValidationFunction<string>;
};
export declare type FormProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type TagCreateFormOverridesProps = {
  TagCreateFormGrid?: FormProps<GridProps>;
  label?: FormProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type TagCreateFormProps = React.PropsWithChildren<
  {
    overrides?: TagCreateFormOverridesProps | undefined | null;
  } & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: TagCreateFormInputValues) => TagCreateFormInputValues;
    onSuccess?: (fields: TagCreateFormInputValues) => void;
    onError?: (fields: TagCreateFormInputValues, errorMessage: string) => void;
    onCancel?: () => void;
    onChange?: (fields: TagCreateFormInputValues) => TagCreateFormInputValues;
    onValidate?: TagCreateFormValidationValues;
  }
>;
export default function TagCreateForm(props: TagCreateFormProps): React.ReactElement;
