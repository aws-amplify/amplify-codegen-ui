import { BadgeProps, ButtonProps, FlexProps, ViewProps as BoxProps } from '@aws-amplify/ui-react';
import { CardProps } from '@amzn/amplify-ui-react-types';

import { StudioComponentChild } from '@amzn/amplify-ui-codegen-schema';
import { CommonComponentRenderer } from './common-component-renderer';

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
