export interface BaseProps {
  id?: string;
  className?: string;
}

export interface AriaProps {
  ariaLabel?: string;
}

export interface StyleProps {
  backgroundColor?: string;
  color?: string;

  boxShadow?: string;

  padding?: string;

  border?: string;
  borderRadius?: string;

  height?: string;
  maxHeight?: string;
  minHeight?: string;

  width?: string;
  maxWidth?: string;
  minWidth?: string;

  opacity?: string;

  fontFamily?: string;
  fontStyle?: string;
  fontWeight?: string;
  letterSpacing?: string;
  lineHeight?: string;
  textDecoration?: string;
}
