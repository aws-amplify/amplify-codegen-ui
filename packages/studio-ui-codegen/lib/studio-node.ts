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

  children: StudioNode[];

  elementIndex?: number;

  constructor(component: StudioComponent | StudioComponentChild, parent?: StudioNode) {
    this.component = component;
    this.parent = parent;
    this.children = [];
    if (this.parent) {
      this.elementIndex = this.parent.children.filter(
        (childNode) => this.component.componentType === childNode.component.componentType,
      ).length;
      this.parent.children.push(this);
    }
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
   * Build the override path for a given element walking from the node to tree root, providing an index
   * for all but the top-level components.
   * Example:
   * <Flex> <-- returns 'Flex'
   *     <Button> <-- returns 'Flex.Button[0]'
   *     <Button> <-- returns 'Flex.Button[1]'
   *     <Flex> <-- returns 'Flex.Flex[0]'
   *         </Button> <-- returns 'Flex.Flex[0].Button[0]'
   *     </Flex>
   * </Flex>
   */
  getOverrideKey(): string {
    const [parentElement, ...childElements] = this.getComponentPathToRoot().reverse();
    const childPath = childElements.map((node) => `${node.component.componentType}[${node.elementIndex}]`);
    return [parentElement.component.componentType, ...childPath].join('.');
  }
}
