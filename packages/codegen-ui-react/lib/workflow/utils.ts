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

import { ComponentMetadata, InvalidInputError } from '@aws-amplify/codegen-ui';
import Primitive, { PrimitiveChildrenPropMapping } from '../primitive';

export const getChildPropMappingForComponentName = (
  componentMetadata: ComponentMetadata,
  componentName: string,
): string | undefined => {
  const referencedComponentType = componentMetadata.componentNameToTypeMap[componentName];
  if (!referencedComponentType) {
    throw new InvalidInputError(
      `Invalid definition, found reference to component name ${componentName} which wasn't found in the schema.`,
    );
  }
  return PrimitiveChildrenPropMapping[Primitive[referencedComponentType as Primitive]];
};
