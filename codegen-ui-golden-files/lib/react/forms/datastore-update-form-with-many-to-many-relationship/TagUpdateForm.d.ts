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
import { AsyncCollection, AsyncItem } from '@aws-amplify/datastore';

type Tag = {
  readonly id: string;
  readonly label?: string | null;
  readonly Posts: AsyncCollection<TagPost>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
};

type Post = {
  readonly id: string;
  readonly title?: string | null;
  readonly content?: string | null;
  readonly Tags: AsyncCollection<TagPost>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
};

type TagPost = {
  readonly id: string;
  readonly tag: AsyncItem<Tag>;
  readonly post: AsyncItem<Post>;
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
export declare type TagUpdateFormInputValues = {
  label?: string;
};
export declare type TagUpdateFormValidationValues = {
  label?: ValidationFunction<string>;
};
export declare type FormProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type TagUpdateFormOverridesProps = {
  TagUpdateFormGrid?: FormProps<GridProps>;
  label?: FormProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type TagUpdateFormProps = React.PropsWithChildren<
  {
    overrides?: TagUpdateFormOverridesProps | undefined | null;
  } & {
    id?: string;
    tag?: Tag;
    onSubmit?: (fields: TagUpdateFormInputValues) => TagUpdateFormInputValues;
    onSuccess?: (fields: TagUpdateFormInputValues) => void;
    onError?: (fields: TagUpdateFormInputValues, errorMessage: string) => void;
    onCancel?: () => void;
    onChange?: (fields: TagUpdateFormInputValues) => TagUpdateFormInputValues;
    onValidate?: TagUpdateFormValidationValues;
  }
>;
export default function TagUpdateForm(props: TagUpdateFormProps): React.ReactElement;
