import { StudioComponent, StudioComponentChild } from '@amzn/amplify-ui-codegen-schema';

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

  getComponentPathToRoot(): (StudioComponent | StudioComponentChild)[] {
    if (this.parent !== undefined) {
      return [this.component].concat(this.parent.getComponentPathToRoot());
    }
    return [this.component];
  }
}
