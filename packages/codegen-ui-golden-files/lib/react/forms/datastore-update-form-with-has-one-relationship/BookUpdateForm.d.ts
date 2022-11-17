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
export declare type BookUpdateFormInputValues = {
  name?: string;
  primaryAuthor?: Author;
};
export declare type BookUpdateFormValidationValues = {
  name?: ValidationFunction<string>;
  primaryAuthor?: ValidationFunction<string>; // validate against display value
};
export declare type FormProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type BookUpdateFormOverridesProps = {
  BookUpdateFormGrid?: FormProps<GridProps>;
  name?: FormProps<TextFieldProps>;
  primaryAuthor?: FormProps<AutocompleteProps>;
} & EscapeHatchProps;
export declare type BookUpdateFormProps = React.PropsWithChildren<
  {
    overrides?: BookUpdateFormOverridesProps | undefined | null;
  } & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: BookUpdateFormInputValues) => BookUpdateFormInputValues;
    onSuccess?: (fields: BookUpdateFormInputValues) => void;
    onError?: (fields: BookUpdateFormInputValues, errorMessage: string) => void;
    onCancel?: () => void;
    onChange?: (fields: BookUpdateFormInputValues) => BookUpdateFormInputValues;
    onValidate?: BookUpdateFormValidationValues;
  }
>;
export default function BookUpdateForm(props: BookUpdateFormProps): React.ReactElement;
