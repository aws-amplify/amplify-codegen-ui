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
import { StudioComponent, StudioComponentChild, WrappedComponentProperties } from './types';
import { StudioNode } from './studio-node';
import { validateComponentSchema } from './validation-helper';

/**
 * Shared class for rendering components.
 * Mostly contains helper functions for mapping the Studio schema to actual props.
 */
export abstract class CommonComponentRenderer<TPropIn> {
  protected inputProps: WrappedComponentProperties<TPropIn>;

  protected node: StudioNode;

  constructor(protected component: StudioComponent | StudioComponentChild, protected parent?: StudioNode) {
    // Run schema validation on the top-level component.
    if (this.parent === undefined) {
      validateComponentSchema(this.component as StudioComponent);
    }
    const flattenedProps = Object.entries(component.properties).map((prop) => {
      return [prop[0], prop[1]];
    });
    this.inputProps = Object.fromEntries(flattenedProps);
    this.node = new StudioNode(component, parent);
  }
}
