import { FixedStudioComponentProperty, StudioComponentChild } from "@amzn/amplify-ui-codegen-schema";
import ts, { JsxFragment } from "typescript";

export default function renderString(component: StudioComponentChild): JsxFragment {
  const factory = ts.factory;

  if ("value" in component.properties) {
    if ("value" in component.properties["value"]) {
      const stringProp = component.properties["value"]
      const value = stringProp.value;
      console.log(value);

      const element = factory.createJsxFragment(
        factory.createJsxOpeningFragment(),
        [factory.createJsxText(value.toString())],
        factory.createJsxJsxClosingFragment()
      );
      return element;
    }
  }
  
  throw new Error("Failed to render String - Unexpected component structure");
}
