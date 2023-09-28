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
import { getAmplifyJSVersionToRender } from '../../helpers/amplify-js-versioning';
import { AMPLIFY_JS_V5, AMPLIFY_JS_V6 } from '../../utils/constants';

let isAmplifyJSV6Enabled = false;

describe('Helpers', () => {
  beforeEach(() => {
    isAmplifyJSV6Enabled = false;
  });

  it('should return v5 if aws-amplify dependency is undefined', () => {
    expect(getAmplifyJSVersionToRender({}, { isAmplifyJSV6Enabled })).toBe(AMPLIFY_JS_V5);
  });

  it('should return v6 if aws-amplify dependency is v6 but v6 is disabled', () => {
    expect(getAmplifyJSVersionToRender({ 'aws-amplify': '^6.0.0' }, { isAmplifyJSV6Enabled })).toBe(AMPLIFY_JS_V6);
  });

  it('should return v5 if aws-amplify dependency is v5 and v6 is enabled', () => {
    expect(getAmplifyJSVersionToRender({ 'aws-amplify': '^5.0.0' }, { isAmplifyJSV6Enabled: true })).toBe(
      AMPLIFY_JS_V5,
    );
  });

  it('should return v5 if aws-amplify dependency is v5', () => {
    expect(getAmplifyJSVersionToRender({ 'aws-amplify': '^5.0.2' }, { isAmplifyJSV6Enabled })).toBe(AMPLIFY_JS_V5);
  });

  it('should return v5 if aws-amplify dependency is latest but v6 is disabled', () => {
    expect(getAmplifyJSVersionToRender({ 'aws-amplify': 'latest' }, { isAmplifyJSV6Enabled })).toBe(AMPLIFY_JS_V5);
  });

  it('should return v6 if aws-amplify dependency is latest and v6 is enabled', () => {
    expect(getAmplifyJSVersionToRender({ 'aws-amplify': 'latest' }, { isAmplifyJSV6Enabled: true })).toBe(
      AMPLIFY_JS_V6,
    );
  });

  it('should return v6 if aws-amplify dependency is v6 and v6 is enabled', () => {
    expect(getAmplifyJSVersionToRender({ 'aws-amplify': '^6.0.2' }, { isAmplifyJSV6Enabled: true })).toBe(
      AMPLIFY_JS_V6,
    );
  });

  it('should return v5 if aws-amplify dependency is a v5 tagged release', () => {
    expect(getAmplifyJSVersionToRender({ 'aws-amplify': '^5.0.2-beta' }, { isAmplifyJSV6Enabled: true })).toBe(
      AMPLIFY_JS_V5,
    );
  });

  it('should return v6 if aws-amplify dependency is a v6 tagged release and v6 is enabled', () => {
    expect(getAmplifyJSVersionToRender({ 'aws-amplify': '^6.0.2-beta' }, { isAmplifyJSV6Enabled: true })).toBe(
      AMPLIFY_JS_V6,
    );
  });
});
