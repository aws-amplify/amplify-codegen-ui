import {
  BadgeProps,
  ButtonProps,
  CardProps,
  DividerProps,
  FlexProps,
  ImageProps,
  TextProps,
  ViewProps
} from "@amzn/amplify-ui-react-types";

import { CommonComponentRenderer } from "./common-component-renderer";

type SourceProp = DividerProps | ImageProps;

/**
 * This is a base class for a renderer that renders components with no children.
 */
export abstract class ComponentRendererBase<
  TPropIn extends SourceProp,
  TPropOut,
  TElementOut
> extends CommonComponentRenderer<TPropIn, TPropOut> {
  abstract renderElement(): TElementOut;
}
