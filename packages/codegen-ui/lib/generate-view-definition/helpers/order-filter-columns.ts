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

import { ColumnInfo, ColumnsMap, DataStoreModelField } from '../../types';

type ColumnNode = {
  value: ColumnInfo;
  next: ColumnNode | null;
};

type NodeMap = { [id: string]: ColumnNode };

const generateNodeMap = (columns: ColumnsMap, fields: DataStoreModelField[]): NodeMap => {
  const map: NodeMap = {};

  fields.forEach((field) => {
    map[field.name] = { value: { header: field.name }, next: null };
  });

  Object.entries(columns).forEach(([id, config]) => {
    const current = {
      value: {
        ...map[id].value,
        ...config,
      },
      next: null,
    };

    map[id] = current;
  });
  return map;
};

const applyDefaultOrdering = (fields: DataStoreModelField[], map: NodeMap) => {
  const nodeMap = map;
  for (let i = 1; i < fields.length; i += 1) {
    const prev = fields[i - 1].name;
    const next = fields[i].name;
    nodeMap[prev].next = nodeMap[next];
  }
};

const applyOrderOverride = (map: NodeMap & { headOfMap$: ColumnNode }, defaultFirst: ColumnNode) => {
  let newFirst = defaultFirst;

  const nodeMap = map;

  Object.values(nodeMap).forEach((node) => {
    const current = node;
    if (current.next?.value.position?.fixed) {
      // extract first
      newFirst = current.next;
      current.next = current.next.next;

      // push first to front of linked list
      newFirst.next = nodeMap.headOfMap$.next;
      nodeMap.headOfMap$.next = newFirst;
    }
  });

  Object.values(nodeMap).forEach((node) => {
    const current = node;
    const prev = current.next?.value.position?.rightOf;
    if (prev && current.next) {
      const toMove = current.next;
      current.next = toMove.next;

      toMove.next = nodeMap[prev].next;
      nodeMap[prev].next = toMove;
    }
  });
};

const traverseAndCollectVisible = (first: ColumnNode): ColumnInfo[] => {
  const ordered: ColumnInfo[] = [];

  let current: ColumnNode | null = first;

  while (current) {
    if (!current.value.excluded) {
      ordered.push(current.value);
    }
    current = current.next;
  }

  return ordered;
};

export const orderAndFilterVisibleColumns = (columns: ColumnsMap, fields?: DataStoreModelField[]): ColumnInfo[] => {
  let ordered: ColumnInfo[] = [];

  if (fields && fields.length > 0) {
    const map = generateNodeMap(columns, fields);

    applyDefaultOrdering(fields, map);

    const defaultFirst = map[fields[0].name];

    const mapWithHead: NodeMap & { headOfMap$: ColumnNode } = {
      headOfMap$: {
        value: { header: '' },
        next: defaultFirst,
      },
      ...map,
    };

    applyOrderOverride(mapWithHead, defaultFirst);

    ordered = traverseAndCollectVisible(mapWithHead.headOfMap$.next!);
  }

  // Spec for custom table generated from JSON is not defined yet.
  // Thus, said table shape is currently unhandled
  // TODO: Handle JSON-generated table after the spec is defined

  return ordered;
};
