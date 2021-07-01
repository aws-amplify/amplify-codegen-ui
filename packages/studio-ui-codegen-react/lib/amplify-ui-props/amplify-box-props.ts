export type BoxProps = {
  width?: string;
  maxWidth?: string;
  maxHeight?: string;
  height?: string;
  borderWidth?: string;
  borderRadius?: string;
  overflow?: string;
  fontWeight?: string;
  fontSize?: string;
  color?: string;
  display?: string;
  padding?: string;
  flow: "horizontal" | "vertical";
  horizontalAlign: "top" | "bottom" | "center";
  childPadding?: string;
  paddingTop: string;
  paddingBottom: string;
};

export type AmplifyBoxProps = {
  "flex-direction"?: string | undefined;
  width?: string | undefined;
  maxWidth?: string | undefined;
  height?: string | undefined;
  maxHeight?: string | undefined;
  borderWidth?: string | undefined;
  borderRadius?: string | undefined;
  overflow?: string | undefined;
  fontWeight?: string | undefined;
  fontSize?: string | undefined;
  color?: string | undefined;
  display?: string | undefined;
  padding?: string | undefined;
};
