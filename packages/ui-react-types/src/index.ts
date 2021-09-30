import { Property } from "csstype";

interface BaseComponentProps {
  /**
   * Unique identifier
   */
  id?: string;

  /**
   * Additional CSS class name for component
   */
  className?: string;

  /**
   * Used to provide a `data-testid` attribute for testing purposes
   */
  testId?: string;

  /**
   * Any arbitrary props will be passed to the underlying element.
   */
  [key: string]: any;
}

interface BaseStyleProps {
  alignSelf?: Property.AlignSelf;
  backgroundColor?: Property.BackgroundColor;
  border?: Property.Border;
  borderRadius?: Property.BorderRadius;
  boxShadow?: Property.BoxShadow;
  color?: Property.Color;
  fontFamily?: Property.FontFamily;
  fontSize?: Property.FontSize;
  fontStyle?: Property.FontStyle;
  fontWeight?: Property.FontWeight;
  height?: Property.Height;
  letterSpacing?: Property.LetterSpacing;
  lineHeight?: Property.LineHeight;
  maxHeight?: Property.MaxHeight;
  maxWidth?: Property.MaxWidth;
  minHeight?: Property.MinHeight;
  minWidth?: Property.MinWidth;
  opacity?: Property.Opacity;
  padding?: Property.Padding;
  textDecoration?: Property.TextDecoration;
  width?: Property.Width;
}

export interface CardProps extends BaseComponentProps, BaseStyleProps {}

export type TextVariant = 'primary' | 'secondary' | 'tertiary' | 'error' | 'warning' | 'info' | 'success';

export interface TextProps extends BaseComponentProps, BaseStyleProps {
  /**
   * HTML allowed tags
   */
  as?: 'p' | 'span' | 'strong' | 'em';

  /**
   * This should be the primary way to handle different styles of text. Lower-level
   * text styling attributes like color can be set directly, that should be more of an
   * escape hatch.
   */
  variant?: TextVariant;

  /**
   * This attribute will be used to indicate if the text component should truncate text
   * that exceeds the width of the text element.  Truncated text will render an ellipsis.
   */
  isTruncated?: boolean;
}
