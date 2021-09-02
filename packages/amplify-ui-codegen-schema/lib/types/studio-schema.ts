import { StudioComponent, FixedStudioComponentProperty, BoundStudioComponentProperty } from './index';

export type FixedOrBoundProps = {
  [propertyName: string]: FixedStudioComponentProperty | BoundStudioComponentProperty;
};

export type WrappedComponentProperties<TPropIn> = {
  [key in keyof TPropIn]: FixedStudioComponentProperty | BoundStudioComponentProperty;
};
