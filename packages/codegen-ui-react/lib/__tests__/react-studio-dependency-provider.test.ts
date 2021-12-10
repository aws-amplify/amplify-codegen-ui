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
import semver from 'semver';
import { ReactRequiredDependencyProvider } from '..';

describe('ReactStudioDependencyProvider', () => {
  const requiredDependencies = new ReactRequiredDependencyProvider().getRequiredDependencies();

  describe('getRequiredDependencies', () => {
    it('has required dependencies', () => {
      expect(requiredDependencies.length).toBeGreaterThan(0);
    });

    it('includes ui-react', () => {
      expect(requiredDependencies.filter((dep) => dep.dependencyName === '@aws-amplify/ui-react')).toBeTruthy();
    });

    it('includes all valid semver values', () => {
      requiredDependencies.forEach((dep) => {
        expect(semver.valid(dep.supportedSemVerPattern)).toBeDefined();
      });
    });

    it('includes reasons on all dependencies', () => {
      requiredDependencies.forEach((dep) => {
        expect(dep.reason.length).toBeGreaterThan(0);
      });
    });
  });
});
