import {
  FixedStudioComponentProperty,
  StudioComponent,
  StudioComponentChild,
  StudioComponentProperties,
  WrappedComponentProperties
} from "@amzn/amplify-ui-codegen-schema";

/**
 * Shared class for rendering components.
 * Mostly contains helper functions for mapping the Studio schema to actual props.
 */
export abstract class CommonComponentRenderer<TPropIn> {
  protected inputProps: WrappedComponentProperties<TPropIn>;

  constructor(protected component: StudioComponent | StudioComponentChild) {
    const flattenedProps = Object.entries(component.properties).map((prop) => {
      return [prop[0], prop[1]];
    });
    this.inputProps = Object.fromEntries(flattenedProps);
  }
}
