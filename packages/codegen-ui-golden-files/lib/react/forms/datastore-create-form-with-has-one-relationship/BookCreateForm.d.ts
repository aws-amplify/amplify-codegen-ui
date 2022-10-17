/** *************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 ************************************************************************* */
/* eslint-disable */

import * as React from 'react';
import { EscapeHatchProps } from '@aws-amplify/ui-react/internal';
import { Author } from '../models';
import { GridProps, AutocompleteProps, TextFieldProps } from '@aws-amplify/ui-react';
export declare type ValidationResponse = {
  hasError: boolean;
  errorMessage?: string;
};
export declare type ValidationFunction<T> = (
  value: T,
  validationResponse: ValidationResponse,
) => ValidationResponse | Promise<ValidationResponse>;
export declare type BookCreateFormInputValues = {
  name?: string;
  primaryAuthor?: Author;
};
export declare type BookCreateFormValidationValues = {
  name?: ValidationFunction<string>;
  primaryAuthor?: ValidationFunction<string>; // validate against display value
};
export declare type FormProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type BookCreateFormOverridesProps = {
  BookCreateFormGrid?: FormProps<GridProps>;
  name?: FormProps<TextFieldProps>;
  primaryAuthor?: FormProps<AutocompleteProps>;
} & EscapeHatchProps;
export declare type BookCreateFormProps = React.PropsWithChildren<
  {
    overrides?: BookCreateFormOverridesProps | undefined | null;
  } & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: BookCreateFormInputValues) => BookCreateFormInputValues;
    onSuccess?: (fields: BookCreateFormInputValues) => void;
    onError?: (fields: BookCreateFormInputValues, errorMessage: string) => void;
    onCancel?: () => void;
    onChange?: (fields: BookCreateFormInputValues) => BookCreateFormInputValues;
    onValidate?: BookCreateFormValidationValues;
  }
>;
export default function BookCreateForm(props: BookCreateFormProps): React.ReactElement;
