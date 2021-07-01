/*
import {
  BadgeProps,
  ButtonProps,
  CardProps,
  CollectionProps,
  IconProps,
  ImageProps,
  SelectProps,
} from "@amzn/amplify-ui";
*/

import { CommonComponentRenderer } from "./common-component-renderer";

/*
type SourceProp =
  | ButtonProps
  | CardProps
  | CollectionProps
  | SelectProps
  | IconProps
  | BadgeProps
  | ImageProps;
  */

/**
 * This is a base class for a renderer that renders components with no children.
 */
export abstract class ComponentRendererBase<
  TPropIn,  //extends SourceProp,
  TPropOut,
  TElementOut
> extends CommonComponentRenderer<TPropIn, TPropOut> {
  abstract renderElement(): TElementOut;
}
