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
import { FormDefinition } from '../../types';

/**
 * Helper that returns the row and column indices of a string in a two-dimensional array
 */
export const findIndices = (name: string, matrix: string[][]): [number, number] | undefined => {
  for (let rowIndex = 0; rowIndex < matrix.length; rowIndex += 1) {
    const columnIndex = matrix[rowIndex].indexOf(name);

    if (columnIndex !== -1) {
      return [rowIndex, columnIndex];
    }
  }
  return undefined;
};

export function removeFromMatrix(indices: [number, number], formDefinition: FormDefinition) {
  formDefinition.elementMatrix[indices[0]].splice(indices[1], 1);
}

export function removeAndReturnItemOnward(indices: [number, number], formDefinition: FormDefinition): string[] {
  const row = formDefinition.elementMatrix[indices[0]];
  return row.splice(indices[1], row.length - indices[1]);
}
