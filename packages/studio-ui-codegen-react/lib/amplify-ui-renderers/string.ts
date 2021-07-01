import { StudioComponent } from "@amzn/studio-ui-codegen";
import ts, { JsxFragment } from "typescript";

export default function renderString(component: StudioComponent): JsxFragment {
  const factory = ts.factory;

  const value = component.props["value"].value;
  console.log(value);
  const element = factory.createJsxFragment(
    factory.createJsxOpeningFragment(),
    [factory.createJsxText(value)],
    factory.createJsxJsxClosingFragment()
  );

  return element;
}
