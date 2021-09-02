import { DividerProps, ImageProps, TextProps } from '@amzn/amplify-ui-react-types';

import { CommonComponentRenderer } from './common-component-renderer';

type SourceProp = DividerProps | ImageProps | TextProps;

/**
 * This is a base class for a renderer that renders components with no children.
 */
export abstract class ComponentRendererBase<
  TPropIn extends SourceProp,
  TElementOut,
> extends CommonComponentRenderer<TPropIn> {
  abstract renderElement(): TElementOut;
}
