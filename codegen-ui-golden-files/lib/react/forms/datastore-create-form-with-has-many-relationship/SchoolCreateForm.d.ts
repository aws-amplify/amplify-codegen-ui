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
export declare type SchoolCreateFormInputValues = {
  name?: string;
};
export declare type SchoolCreateFormValidationValues = {
  name?: ValidationFunction<string>;
};
export declare type FormProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type SchoolCreateFormOverridesProps = {
  SchoolCreateFormGrid?: FormProps<GridProps>;
  name?: FormProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type SchoolCreateFormProps = React.PropsWithChildren<
  {
    overrides?: SchoolCreateFormOverridesProps | undefined | null;
  } & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: SchoolCreateFormInputValues) => SchoolCreateFormInputValues;
    onSuccess?: (fields: SchoolCreateFormInputValues) => void;
    onError?: (fields: SchoolCreateFormInputValues, errorMessage: string) => void;
    onCancel?: () => void;
    onChange?: (fields: SchoolCreateFormInputValues) => SchoolCreateFormInputValues;
    onValidate?: SchoolCreateFormValidationValues;
  }
>;
export default function SchoolCreateForm(props: SchoolCreateFormProps): React.ReactElement;
