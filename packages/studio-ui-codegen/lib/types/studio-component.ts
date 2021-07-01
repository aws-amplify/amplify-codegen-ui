import { StudioPrimitives } from "./primitives";
import { StudioComponentPropertyType } from "./studio-component-property-type";

export type FirstOrderStudioComponent = {
  name: string;
} & StudioComponent;

export type StudioComponent = {
  /**
   * This is the unique global identifier for each component
   */
  id: string;

  /**
   * These are the nested components in a composite
   */
  children: StudioComponent[];

  /**
   * This should map to the components available
   */
  componentType: StudioPrimitives;

  /**
   * These are the customized properties
   */
  props: StudioComponentProperties;
};

export type StudioComponentProperties = {
  /**
   * Each key maps to an available component property
   */
  [key: string]: StudioComponentProperty;
};

export type StudioComponentProperty = {
  /**
   * This is the primitive value type
   */
  type: StudioComponentPropertyType;

  /**
   * This is the value pass when code generating
   */
  value: string;

  /**
   * This is set to true when the value is data bound
   */
  bind?: boolean;

  /**
   * This is the exposed property that will propogate down to this value
   */
  hook?: string;
};
