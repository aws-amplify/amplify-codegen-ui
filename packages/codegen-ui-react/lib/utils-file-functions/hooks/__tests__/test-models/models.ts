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
import { ModelInit, MutableModel } from '@aws-amplify/datastore';

type HomeMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
};

export declare class Home {
  readonly id: string;

  readonly address?: string | null;

  readonly image_url?: string | null;

  readonly price?: number | null;

  readonly Rating?: number | null;

  readonly isAvailable?: boolean | null;

  readonly availabilityDateTime?: string | null;

  readonly availabilityDate?: string | null;

  readonly availabliltyTime?: string | null;

  readonly randomJSON?: string | null;

  readonly timestamp?: number | null;

  readonly phone?: string | null;

  readonly ipAddress?: string | null;

  readonly email?: string | null;

  readonly createdAt?: string | null;

  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Home, HomeMetaData>);
  static copyOf(
    source: Home,
    mutator: (draft: MutableModel<Home, HomeMetaData>) => MutableModel<Home, HomeMetaData> | void,
  ): Home;
}

export type TodoMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
};

export class Todo {
  readonly id!: string;

  readonly name: string;

  readonly description?: string;

  readonly createdAt?: string;

  readonly updatedAt?: string;

  constructor(init: ModelInit<Todo, TodoMetaData>) {
    this.name = init.name;
  }

  static copyOf(
    source: Todo,
    mutator: (draft: MutableModel<Todo, TodoMetaData>) => MutableModel<Todo, TodoMetaData> | void,
  ): Todo {
    const copy = { ...source };
    mutator(copy);
    return copy;
  }
}
