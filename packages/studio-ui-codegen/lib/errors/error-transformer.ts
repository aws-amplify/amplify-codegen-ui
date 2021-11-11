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
import { InternalError, InvalidInputError } from './error-types';

export const transformCodegenError = (error: any | unknown): InternalError | InvalidInputError => {
  if (error instanceof InternalError || error instanceof InvalidInputError) {
    return error;
  }

  return new InternalError('Unhandled internal error occurred - see stack trace.');
};

export const handleCodegenErrors = (target: Object, propertyKey: string, descriptor: PropertyDescriptor) => {
  const originalMethod = descriptor.value;

  // eslint-disable-next-line no-param-reassign, func-names
  descriptor.value = function (...args: any[]) {
    try {
      return originalMethod.apply(this, args);
    } catch (error) {
      throw transformCodegenError(error);
    }
  };

  return descriptor;
};
