import {
  StudioComponent,
  StudioComponentProperties,
} from "@amzn/amplify-ui-codegen-schema";
import { ComponentRendererBase } from "@amzn/studio-ui-codegen";
import { factory, JsxAttribute, JsxAttributeLike, JsxElement, JsxOpeningElement, NodeFactory, SyntaxKind } from "typescript";

import { ImportCollection } from "./import-collection";

export abstract class ReactComponentRenderer<
  TPropIn,
  TPropOut
> extends ComponentRendererBase<TPropIn, TPropOut, JsxElement> {
  constructor(
    component: StudioComponent,
    protected importCollection: ImportCollection
  ) {
    super(component);
  }

  protected convertPropsToJsxAttributes(props: StudioComponentProperties) {
    const propsArray: JsxAttribute[] = [];

    for (let prop of this.convertPropsFromJsonSchema(props)) {
      let value;
      console.log(prop);

      value = factory.createStringLiteral(prop[1]);

      if (value) {
        const attr = factory.createJsxAttribute(
          factory.createIdentifier(prop[0]),
          value
        );

        if (prop[0] && prop[1]) {
          propsArray.push(attr);
        } else {
          console.warn(`Prop ${prop[0]} is not set`);
        }
      } else {
        console.log("Skipping ", prop);
      }
    }

    return propsArray;
  }

  protected renderOpeningElement(
    factory: NodeFactory,
    props: StudioComponentProperties,
    tagName: string
  ): JsxOpeningElement {
    const propsArray: JsxAttribute[] = [];
    for (let propKey of Object.keys(props)) {
      const currentProp = props[propKey];

      if (currentProp.value) {
        const propName = currentProp.exposedAs ?? propKey;
        const attr = factory.createJsxAttribute(
          factory.createIdentifier(propKey),
          factory.createJsxExpression(
            undefined,
            factory.createBinaryExpression(
              factory.createPropertyAccessExpression(
                factory.createIdentifier("props"),
                propName
              ),
              SyntaxKind.QuestionQuestionToken,
              factory.createStringLiteral(currentProp.value, true),
            )
          )
        );

        propsArray.push(attr);
      }
    }

    this.addPropsSpreadAttributes(factory, propsArray, tagName);

    return factory.createJsxOpeningElement(
      factory.createIdentifier(tagName),
      undefined,
      factory.createJsxAttributes(propsArray)
    );
  }

  private addPropsSpreadAttributes(
    factory: NodeFactory,
    attributes: JsxAttributeLike[],
    tagName: string
  ) {
    const propsAttr = factory.createJsxSpreadAttribute(factory.createIdentifier("props"));
    attributes.push(propsAttr);

    const overrideAttr = factory.createJsxSpreadAttribute(
      factory.createCallExpression(
        factory.createIdentifier("getOverrideProps"), 
        undefined, 
        [factory.createPropertyAccessExpression(
          factory.createIdentifier("props"), 
          factory.createIdentifier("overrides")
          ), 
          factory.createStringLiteral(tagName)
        ]
      )
    );
    attributes.push(overrideAttr);
  }
}
