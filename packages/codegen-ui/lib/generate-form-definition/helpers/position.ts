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
import { InvalidInputError } from '../../errors';
import { FormDefinition, StudioFieldPosition } from '../../types';

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

// helper that throws if every element traversed but none mapped
function throwIfUnmappable(originalQueue: unknown[], requeued: unknown[]) {
  if (originalQueue.length === requeued.length) {
    throw new InvalidInputError('Unmappable element positions in form');
  }
}

/* eslint-disable no-param-reassign */

/**
 * Impure function that maps the element matrix of form definition
 * from a queue of sectional and input elements.
 */
export function mapElementMatrix({
  elementQueue,
  formDefinition,
}: {
  formDefinition: FormDefinition;
  elementQueue: { name: string; position?: StudioFieldPosition; excluded?: boolean }[];
}): void {
  let belowElementQueue: typeof elementQueue = [...elementQueue];
  let rightOfElementQueue: typeof elementQueue = [];

  // map elements with no position; position below; position fixed to first
  while (belowElementQueue.length) {
    const requeued: typeof elementQueue = [];
    const tempRightOf: typeof elementQueue = [];

    belowElementQueue.forEach((element) => {
      if (element.excluded) {
        const previousIndices = findIndices(element.name, formDefinition.elementMatrix);

        if (previousIndices) {
          removeFromMatrix(previousIndices, formDefinition);
        }
      } else if (element.position && 'rightOf' in element.position && element.position.rightOf) {
        tempRightOf.push(element);
      } else if (element.position && 'below' in element.position && element.position.below) {
        const relationIndices = findIndices(element.position.below, formDefinition.elementMatrix);
        if (!relationIndices) {
          requeued.push(element);
        } else {
          const previousIndices = findIndices(element.name, formDefinition.elementMatrix);
          if (previousIndices) {
            removeFromMatrix(previousIndices, formDefinition);
          }
          formDefinition.elementMatrix.splice(relationIndices[0] + 1, 0, [element.name]);
        }
      } else if (element.position && 'fixed' in element.position && element.position.fixed === 'first') {
        const previousIndices = findIndices(element.name, formDefinition.elementMatrix);
        if (previousIndices) {
          removeFromMatrix(previousIndices, formDefinition);
        }
        formDefinition.elementMatrix.unshift([element.name]);
      } else {
        const previousIndices = findIndices(element.name, formDefinition.elementMatrix);
        if (!previousIndices) {
          formDefinition.elementMatrix.push([element.name]);
        }
      }
    });

    throwIfUnmappable(belowElementQueue, requeued);

    belowElementQueue = requeued;
    rightOfElementQueue.push(...tempRightOf);
  }

  // map elements with rightOf position
  while (rightOfElementQueue.length) {
    const requeued: typeof elementQueue = [];

    rightOfElementQueue.forEach((element) => {
      if (element.position && 'rightOf' in element.position && element.position.rightOf) {
        const relationIndices = findIndices(element.position.rightOf, formDefinition.elementMatrix);
        if (!relationIndices) {
          requeued.push(element);
        } else {
          const previousIndices = findIndices(element.name, formDefinition.elementMatrix);
          if (previousIndices) {
            const removedItems = removeAndReturnItemOnward(previousIndices, formDefinition);
            formDefinition.elementMatrix[relationIndices[0]].splice(relationIndices[1] + 1, 0, ...removedItems);
          } else {
            formDefinition.elementMatrix[relationIndices[0]].splice(relationIndices[1] + 1, 0, element.name);
          }
        }
      }
    });

    throwIfUnmappable(rightOfElementQueue, requeued);

    rightOfElementQueue = requeued;
  }

  // filter out empty rows
  formDefinition.elementMatrix = formDefinition.elementMatrix.filter((row) => row.length);
}
/* eslint-enable no-param-reassign */
