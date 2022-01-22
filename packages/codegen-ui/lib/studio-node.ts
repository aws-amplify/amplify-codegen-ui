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
import { StudioComponent, StudioComponentChild } from './types';

export class StudioNode {
  component: StudioComponent | StudioComponentChild;

  parent?: StudioNode;

  constructor(component: StudioComponent | StudioComponentChild, parent?: StudioNode) {
    this.component = component;
    this.parent = parent;
  }

  isRoot(): boolean {
    return this.parent === undefined;
  }

  getComponentPathToRoot(): StudioNode[] {
    if (this.parent !== undefined) {
      return [this as StudioNode].concat(this.parent.getComponentPathToRoot());
    }
    return [this];
  }

  /**
   * Return true if any ancestor node of the current node has type `componentType`.
   */
  hasAncestorOfType(componentType: string): boolean {
    const ancestorComponentTypes = this.getComponentPathToRoot().map((node) => node.component.componentType);
    // We don't want to check if the current node has type, so shift that element out.
    ancestorComponentTypes.shift();
    return ancestorComponentTypes.some((ancestorComponentType) => ancestorComponentType === componentType);
  }
}
