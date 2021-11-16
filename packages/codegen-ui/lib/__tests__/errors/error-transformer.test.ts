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
import { transformCodegenError, handleCodegenErrors, InternalError, InvalidInputError } from '../../errors';

export class TestInvalidInputError extends InvalidInputError {}

describe('transformCodegenError', () => {
  it('transforms generic errors into Internal Error', () => {
    expect(transformCodegenError(new Error(''))).toBeInstanceOf(InternalError);
  });

  it('passes through Internal Error', () => {
    expect(transformCodegenError(new InternalError(''))).toBeInstanceOf(InternalError);
  });

  it('passes up instance of Invalid Input Error', () => {
    expect(transformCodegenError(new TestInvalidInputError(''))).toBeInstanceOf(InvalidInputError);
  });
});

describe('handleCodegenErrors', () => {
  // Type decorators complain in this context, wrapping in a class.
  class TestFns {
    @handleCodegenErrors
    functionWithoutError() {
      return 'DONE';
    }

    @handleCodegenErrors
    functionWithError() {
      throw new Error();
    }
  }
  const testFns = new TestFns();

  it('executes underlying method', () => {
    expect(testFns.functionWithoutError()).toEqual('DONE');
  });

  it('catches and transforms unknown errors into InternalError', () => {
    try {
      testFns.functionWithError();
    } catch (error) {
      if (error instanceof InternalError) {
        return;
      }
    }
    throw new Error('Should have finished in caught');
  });
});
