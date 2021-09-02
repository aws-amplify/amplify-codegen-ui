import { BadgeProps, ButtonProps, CardProps, FlexProps, ViewProps as BoxProps } from '@amzn/amplify-ui-react-types';

import { CommonComponentRenderer } from './common-component-renderer';
import { StudioComponent, StudioComponentChild } from '@amzn/amplify-ui-codegen-schema';

type SourceProp = BoxProps | BadgeProps | ButtonProps | CardProps | FlexProps;

export abstract class ComponentWithChildrenRendererBase<
  TPropIn extends SourceProp,
  TElementOut,
  TElementChild,
> extends CommonComponentRenderer<TPropIn> {
  abstract renderElement(
    renderChildren: (children: StudioComponentChild[], component?: TElementOut) => TElementChild[],
  ): TElementOut;
}
