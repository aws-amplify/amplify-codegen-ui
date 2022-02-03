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
import { StudioComponent, StudioComponentChild } from '../types';

/**
 * Helper to recurse through the component tree and build the name to type mapping.
 */
export const buildComponentNameToTypeMap = (
  component: StudioComponent | StudioComponentChild,
): Record<string, string> => {
  const localMap: Record<string, string> = {};
  if (component.name) {
    localMap[component.name] = component.componentType;
  }
  if (component.children) {
    Object.entries(
      component.children
        .map((child) => buildComponentNameToTypeMap(child))
        .reduce((previous, next) => {
          return { ...previous, ...next };
        }, {}),
    ).forEach(([name, componentType]) => {
      localMap[name] = componentType;
    });
  }
  return localMap;
};
