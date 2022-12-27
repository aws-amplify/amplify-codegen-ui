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
import { StudioForm } from '../../types';
import { shouldIncludeCancel } from '../../utils/form-utils';

describe('should include cancel button check', () => {
  const form: StudioForm = {
    name: 'mySampleForm',
    formActionType: 'create',
    dataType: { dataSourceType: 'Custom', dataTypeName: 'Custom' },
    style: {},
    sectionalElements: {},
    fields: {},
    cta: {},
  };
  it('should not include cancel by default', () => {
    expect(shouldIncludeCancel(form)).toBe(false);
  });

  it('should include cancel if there is an empty object for cancel', () => {
    const formOverride: StudioForm = {
      ...form,
      cta: { cancel: {} },
    };
    expect(shouldIncludeCancel(formOverride)).toBe(true);
  });

  it('should remove cancel button if explicitly excluded', () => {
    const formOverride: StudioForm = {
      ...form,
      cta: { cancel: { excluded: true } },
    };
    expect(shouldIncludeCancel(formOverride)).toBe(false);
  });

  it('should not render cancel button even if cta is undefined', () => {
    const { cta, ...rest } = form;
    // overriding to any in case cta is not defined when pulling from the api
    expect(shouldIncludeCancel(rest as any)).toBe(false);
  });
});
