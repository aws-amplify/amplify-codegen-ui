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
import { FrontendManagerComponent, FrontendManagerComponentChild } from './types';

export class FrontendManagerNode {
  component: FrontendManagerComponent | FrontendManagerComponentChild;

  parent?: FrontendManagerNode;

  constructor(component: FrontendManagerComponent | FrontendManagerComponentChild, parent?: FrontendManagerNode) {
    this.component = component;
    this.parent = parent;
  }

  isRoot(): boolean {
    return this.parent === undefined;
  }

  getComponentPathToRoot(): FrontendManagerNode[] {
    if (this.parent !== undefined) {
      return [this as FrontendManagerNode].concat(this.parent.getComponentPathToRoot());
    }
    return [this];
  }

  getOverrideIndex(): number {
    if (this.parent === undefined || this.parent.component.children === undefined) {
      return -1;
    }

    return this.parent.component.children
      .filter((child: FrontendManagerComponentChild) => child.componentType === this.component.componentType)
      .findIndex((child: FrontendManagerComponentChild) => child === this.component);
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
    const childPath = childElements.map((node) => `${node.component.componentType}[${node.getOverrideIndex()}]`);
    return [parentElement.component.componentType, ...childPath].join('.');
  }
}
