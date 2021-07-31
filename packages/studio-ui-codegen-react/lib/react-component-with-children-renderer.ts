import {
  ComponentWithChildrenRendererBase,
} from "@amzn/studio-ui-codegen";
import {
  StudioComponent,
  StudioComponentProperties,
  StudioComponentProperty,
  StudioComponentPropertyType,
} from "@amzn/amplify-ui-codegen-schema";

import { factory, JsxAttribute, JsxAttributeLike, JsxElement, JsxChild, JsxOpeningElement, NodeFactory, SyntaxKind, Expression } from "typescript";
import { ImportCollection } from "./import-collection";
import { getComponentPropValueExpression } from "./react-component-render-helper";

export abstract class ReactComponentWithChildrenRenderer<
  TPropIn,
  TPropOut
> extends ComponentWithChildrenRendererBase<
  TPropIn,
  TPropOut,
  JsxElement,
  JsxChild
> {
  constructor(
    component: StudioComponent,
    protected importCollection: ImportCollection
  ) {
    super(component);
  }

  protected convertPropsToJsxAttributes(props: StudioComponentProperties) {
    const propsArray: JsxAttribute[] = [];

    const convertedProps = this.convertPropsFromJsonSchema(props);

    for (let prop of convertedProps) {
      let value;

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

  protected renderCustomCompOpeningElement(
    factory: NodeFactory,
    props: StudioComponentProperties,
    tagName: string
  ): JsxOpeningElement {
    const propsArray: JsxAttribute[] = [];
    for (let propKey of Object.keys(props)) {
      const currentProp = props[propKey];
      if (currentProp.value !== undefined) {
        const currentPropValue = getComponentPropValueExpression(currentProp);
        const propName = currentProp.exposedAs ?? propKey;
        const attr = factory.createJsxAttribute(
          factory.createIdentifier(propKey),
          factory.createJsxExpression(undefined, currentPropValue),
        );

        propsArray.push(attr);
      }
    }

    this.addFindChildOverrideAttribute(factory, propsArray, tagName);

    return factory.createJsxOpeningElement(
      factory.createIdentifier(tagName),
      undefined,
      factory.createJsxAttributes(propsArray)
    );
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
        const propValue = getComponentPropValueExpression(currentProp);
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
              propValue,
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

  private addFindChildOverrideAttribute(
    factory: NodeFactory,
    attributes: JsxAttributeLike[],
    tagName: string
  ) {

    const findChildOverrideAttr = factory.createJsxSpreadAttribute(
      factory.createCallExpression(
        factory.createIdentifier("findChildOverrides"), 
        undefined, 
        [factory.createPropertyAccessExpression(
          factory.createIdentifier("props"), 
          factory.createIdentifier("overrides")
          ), 
          factory.createStringLiteral(tagName)
        ]
      )
    );
    attributes.push(findChildOverrideAttr);
  }
}
