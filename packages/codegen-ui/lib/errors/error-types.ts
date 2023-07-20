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
/* eslint-disable max-classes-per-file */

/**
 * Internal error to the codegen library.
 * Something went wrong that we didn't expect while executing code generation for input that
 * passed input verification.
 */
export class InternalError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, InternalError.prototype);
  }
}

/**
 * Unexpected input was provided to the codegen library, and we don't expect retrying will help in resolving.
 */
export class InvalidInputError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, InvalidInputError.prototype);
  }
}

/**
 * Entity requires a working data API to produce a working component but no valid API configuration was provided.
 */
export class NoApiError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, NoApiError.prototype);
  }
}
