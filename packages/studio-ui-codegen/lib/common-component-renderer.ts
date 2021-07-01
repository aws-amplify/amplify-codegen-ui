import {
  StudioComponent,
  StudioComponentProperties,
} from "./types/studio-component";

/**
 * Shared class for rendering components.
 * Mostly contains helper functions for mapping the Studio schema to actual props.
 */
export abstract class CommonComponentRenderer<TPropIn, TPropOut> {
  inputProps: TPropIn;

  abstract mapProps(props: TPropIn): TPropOut;

  constructor(protected component: StudioComponent) {
    const flattenedProps = Object.entries(component.props).map((prop) => {
      return [prop[0], prop[1]?.value];
    });

    this.inputProps = Object.fromEntries(flattenedProps);
  }

  protected convertPropsFromJsonSchema(
    props: StudioComponentProperties
  ): [string, string][] {
    const mapped = this.mapProps(this.inputProps);
    return Object.entries(mapped).filter((m) => m[1] !== undefined);
  }
}
