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
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { AsyncCollection } from '@aws-amplify/datastore';

type Student = {
  readonly id: string;
  readonly name?: string | null;
  readonly schoolID?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
};

type School = {
  readonly id: string;
  readonly name?: string | null;
  readonly Students: AsyncCollection<Student>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
};

export declare type ValidationResponse = {
  hasError: boolean;
  errorMessage?: string;
};
export declare type ValidationFunction<T> = (
  value: T,
  validationResponse: ValidationResponse,
) => ValidationResponse | Promise<ValidationResponse>;
export declare type SchoolUpdateFormInputValues = {
  name?: string;
};
export declare type SchoolUpdateFormValidationValues = {
  name?: ValidationFunction<string>;
};
export declare type FormProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type SchoolUpdateFormOverridesProps = {
  SchoolUpdateFormGrid?: FormProps<GridProps>;
  name?: FormProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type SchoolUpdateFormProps = React.PropsWithChildren<
  {
    overrides?: SchoolUpdateFormOverridesProps | undefined | null;
  } & {
    id?: string;
    school?: School;
    onSubmit?: (fields: SchoolUpdateFormInputValues) => SchoolUpdateFormInputValues;
    onSuccess?: (fields: SchoolUpdateFormInputValues) => void;
    onError?: (fields: SchoolUpdateFormInputValues, errorMessage: string) => void;
    onCancel?: () => void;
    onChange?: (fields: SchoolUpdateFormInputValues) => SchoolUpdateFormInputValues;
    onValidate?: SchoolUpdateFormValidationValues;
  }
>;
export default function SchoolUpdateForm(props: SchoolUpdateFormProps): React.ReactElement;
