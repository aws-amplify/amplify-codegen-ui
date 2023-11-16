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
import semverGte from 'semver/functions/gte';
import semverValid from 'semver/functions/valid';
import semverCoerce from 'semver/functions/coerce';
import { AMPLIFY_JS_V5, AMPLIFY_JS_V6 } from '../utils/constants';
import { ImportValue } from '../imports';

export function isAmplifyJSV6RenderingEnabled(): boolean {
  return true;
}

export function getLatestAmplifyJSV6RenderingEnabled(
  isAmplifyJSV6Enabled: boolean = isAmplifyJSV6RenderingEnabled(),
): string {
  if (isAmplifyJSV6Enabled) {
    return AMPLIFY_JS_V6;
  }
  return AMPLIFY_JS_V5;
}

export function getAmplifyJSVersionToRender(
  dependencies: { [key: string]: string } = {},
  { isAmplifyJSV6Enabled }: { isAmplifyJSV6Enabled: boolean } = {
    isAmplifyJSV6Enabled: isAmplifyJSV6RenderingEnabled(),
  },
) {
  const awsAmplifyVersion = dependencies['aws-amplify'];
  // semver will error on a 'latest' value so do this first
  if (awsAmplifyVersion === 'latest') {
    return getLatestAmplifyJSV6RenderingEnabled(isAmplifyJSV6Enabled);
  }
  // Allows to use tagged releases
  // e.g. semver.valid(semver.coerce('42.6.7.9.3-alpha')) // '42.6.7'
  const sanitizedVersion = semverValid(semverCoerce(awsAmplifyVersion));

  if (sanitizedVersion) {
    // check if >= 6
    if (semverGte(sanitizedVersion, AMPLIFY_JS_V6)) {
      return AMPLIFY_JS_V6;
    }
  }
  // If there isn't a version for aws-amplify in the project
  // then this is an older version of the project not running latest
  // cli, so default to 5
  // If there is a version and it's 5 return 5
  // If the version is 6 but v6 isn't enabled yet, return 5
  return AMPLIFY_JS_V5;
}

export function getAmplifyJSAPIImport(renderConfigDependencies: { [key: string]: string } = {}) {
  if (getAmplifyJSVersionToRender(renderConfigDependencies) === AMPLIFY_JS_V6) {
    return ImportValue.GENERATE_CLIENT;
  }
  return ImportValue.API;
}
