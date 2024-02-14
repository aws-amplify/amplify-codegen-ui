/** *************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 ************************************************************************* */
/* eslint-disable */
import * as React from 'react';
import { Team } from '../models';
import { EscapeHatchProps } from '@aws-amplify/ui-react/internal';
import { AutocompleteProps, GridProps, TextFieldProps } from '@aws-amplify/ui-react';
export declare type ValidationResponse = {
  hasError: boolean;
  errorMessage?: string;
};
export declare type ValidationFunction<T> = (
  value: T,
  validationResponse: ValidationResponse,
) => ValidationResponse | Promise<ValidationResponse>;
export declare type MyMemberFormInputValues = {
  name?: string;
  team?: Team;
};
export declare type MyMemberFormValidationValues = {
  name?: ValidationFunction<string>;
  team?: ValidationFunction<Team>;
};
export declare type FormProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type MyMemberFormOverridesProps = {
  MyMemberFormGrid?: FormProps<GridProps>;
  name?: FormProps<TextFieldProps>;
  team?: FormProps<AutocompleteProps>;
} & EscapeHatchProps;
export declare type MyMemberFormProps = React.PropsWithChildren<
  {
    overrides?: MyMemberFormOverridesProps | undefined | null;
  } & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: MyMemberFormInputValues) => MyMemberFormInputValues;
    onSuccess?: (fields: MyMemberFormInputValues) => void;
    onError?: (fields: MyMemberFormInputValues, errorMessage: string) => void;
    onCancel?: () => void;
    onChange?: (fields: MyMemberFormInputValues) => MyMemberFormInputValues;
    onValidate?: MyMemberFormValidationValues;
  }
>;
export default function MyMemberForm(props: MyMemberFormProps): React.ReactElement;
