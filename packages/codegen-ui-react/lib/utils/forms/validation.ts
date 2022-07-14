/* eslint-disable */
import {
  FieldValidationConfiguration,
  ValidationResponse,
  ValidationTypes,
} from '@aws-amplify/codegen-ui/lib/types/form/form-validation';

export const validateField = (value: any, validations: FieldValidationConfiguration[]): ValidationResponse => {
  for (const validation of validations) {
    switch (validation.type) {
      case ValidationTypes.REQUIRED:
        return {
          hasError: value === undefined || value === '',
          errorMessage: validation.validationMessage || 'The value is required',
        };
      case ValidationTypes.START_WITH:
        return {
          hasError: !validation.values.some((el) => value.startsWith(el)),
          errorMessage: validation.validationMessage || `The value must start with ${validation.values.join(', ')}`,
        };
      case ValidationTypes.END_WITH:
        return {
          hasError: !validation.values.some((el) => value.endsWith(el)),
          errorMessage: validation.validationMessage || `The value must end with ${validation.values.join(', ')}`,
        };
      case ValidationTypes.CONTAINS:
        return {
          hasError: !validation.values.some((el) => value.includes(el)),
          errorMessage: validation.validationMessage || `The value must contain ${validation.values.join(', ')}`,
        };
      case ValidationTypes.NOT_CONTAINS:
        return {
          hasError: !validation.values.every((el) => !value.includes(el)),
          errorMessage: validation.validationMessage || `The value must not contain ${validation.values.join(', ')}`,
        };
      case ValidationTypes.LESS_THAN_CHAR_LENGTH:
        return {
          hasError: !(value.length < validation.values),
          errorMessage: validation.validationMessage || `The value must be shorter than ${validation.values}`,
        };
      case ValidationTypes.GREATER_THAN_CHAR_LENGTH:
        return {
          hasError: !(value.length > validation.values),
          errorMessage: validation.validationMessage || `The value must be longer than ${validation.values}`,
        };
      case ValidationTypes.LESS_THAN_NUM:
        return {
          hasError: !(value < validation.values),
          errorMessage: validation.validationMessage || `The value must be less than ${validation.values}`,
        };
      case ValidationTypes.GREATER_THAN_NUM:
        return {
          hasError: !(value > validation.values),
          errorMessage: validation.validationMessage || `The value must be greater than ${validation.values}`,
        };
      case ValidationTypes.EQUAL_TO_NUM:
        if (Array.isArray(validation.values)) {
          return {
            hasError: !validation.values.some((el) => el === value),
            errorMessage:
              validation.validationMessage || `The value must be equal to ${validation.values.join(' or ')}`,
          };
        }
        return {
          hasError: !(value === validation.values),
          errorMessage: validation.validationMessage || `The value must be equal to ${validation.values}`,
        };
      case ValidationTypes.BE_AFTER:
        return {
          hasError: !(new Date(value) > new Date(validation.values)),
          errorMessage: validation.validationMessage || `The value must be after ${validation.values}`,
        };
      case ValidationTypes.BE_BEFORE:
        return {
          hasError: !(new Date(value) < new Date(validation.values)),
          errorMessage: validation.validationMessage || `The value must be before ${validation.values}`,
        };
      case ValidationTypes.EMAIL:
        const EMAIL_ADDRESS_REGEX =
          /^[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
        return {
          hasError: !EMAIL_ADDRESS_REGEX.test(value),
          errorMessage: validation.validationMessage || 'The value must be a valid email address',
        };
      case ValidationTypes.JSON:
        let isInvalidJSON = false;
        try {
          JSON.parse(value);
        } catch (e) {
          isInvalidJSON = true;
        }
        return {
          hasError: isInvalidJSON,
          errorMessage: validation.validationMessage || 'The value must be in a correct JSON format',
        };
      case ValidationTypes.IP_ADDRESS:
        const IPV_4 = /^(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}$/;
        const IPV_6 =
          /^(?:(?:[a-fA-F\d]{1,4}:){7}(?:[a-fA-F\d]{1,4}|:)|(?:[a-fA-F\d]{1,4}:){6}(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|:[a-fA-F\d]{1,4}|:)|(?:[a-fA-F\d]{1,4}:){5}(?::(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,2}|:)|(?:[a-fA-F\d]{1,4}:){4}(?:(?::[a-fA-F\d]{1,4}){0,1}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,3}|:)|(?:[a-fA-F\d]{1,4}:){3}(?:(?::[a-fA-F\d]{1,4}){0,2}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,4}|:)|(?:[a-fA-F\d]{1,4}:){2}(?:(?::[a-fA-F\d]{1,4}){0,3}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,5}|:)|(?:[a-fA-F\d]{1,4}:){1}(?:(?::[a-fA-F\d]{1,4}){0,4}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,6}|:)|(?::(?:(?::[a-fA-F\d]{1,4}){0,5}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,7}|:)))(?:%[0-9a-zA-Z]{1,})?$/;
        return {
          hasError: !(IPV_4.test(value) || IPV_6.test(value)),
          errorMessage: validation.validationMessage || 'The value must be an IPv4 or IPv6 address',
        };
      case ValidationTypes.URL:
        let isInvalidUrl = false;
        try {
          new URL(value);
        } catch (e) {
          isInvalidUrl = true;
        }
        return {
          hasError: isInvalidUrl,
          errorMessage:
            validation.validationMessage ||
            'The value must be a valid URL that begins with a schema (i.e. http:// or mailto:)',
        };
      default:
    }
  }
  return { hasError: false };
};
