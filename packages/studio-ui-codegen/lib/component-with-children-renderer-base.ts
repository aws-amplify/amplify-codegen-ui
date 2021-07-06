//import { BadgeProps, BoxProps } from "@amzn/amplify-ui";

import { CommonComponentRenderer } from "./common-component-renderer";
import { StudioComponent } from "@amzn/amplify-ui-codegen-schema";

//type SourceProp = BoxProps | BadgeProps;

export abstract class ComponentWithChildrenRendererBase<
  TPropIn,  //extends SourceProp,
  TPropOut,
  TElementOut,
  TElementChild
> extends CommonComponentRenderer<TPropIn, TPropOut> {
  abstract renderElement(
    renderChildren: (
      children: StudioComponent[],
      component?: TElementOut
    ) => TElementChild[]
  ): TElementOut;
}
