import {
  ComponentWithChildrenRendererBase,
} from "@amzn/studio-ui-codegen";
import {
  FixedStudioComponentProperty,
  StudioComponent,
  StudioComponentChild,
  StudioComponentProperties,
} from "@amzn/amplify-ui-codegen-schema";

import { factory, JsxAttribute, JsxAttributeLike, JsxElement, JsxChild, JsxOpeningElement, NodeFactory, SyntaxKind, Expression } from "typescript";
import { ImportCollection } from "./import-collection";
import { getFixedComponentPropValueExpression, isFixedPropertyWithValue } from "./react-component-render-helper";

export abstract class ReactComponentWithChildrenRenderer<
  TPropIn
> extends ComponentWithChildrenRendererBase<
  TPropIn,
  JsxElement,
  JsxChild
> {
  constructor(
    component: StudioComponent | StudioComponentChild,
    protected importCollection: ImportCollection
  ) {
    super(component);
  }

  protected renderCustomCompOpeningElement(
    factory: NodeFactory,
    props: StudioComponentProperties,
    tagName: string
  ): JsxOpeningElement {
    const propsArray: JsxAttribute[] = [];
    for (let propKey of Object.keys(props)) {
      const currentProp = props[propKey];
      if (isFixedPropertyWithValue(currentProp)) {
        const currentPropValue = currentProp.value;
        const propName = propKey;
        if (typeof currentPropValue == "string") {
          const attr = factory.createJsxAttribute(
            factory.createIdentifier(propKey),
            factory.createStringLiteral(currentPropValue),
          );
          propsArray.push(attr);
        } else {
          const propValueExpr = getFixedComponentPropValueExpression(currentProp);
          const attr = factory.createJsxAttribute(
            factory.createIdentifier(propKey),
            factory.createJsxExpression(undefined, propValueExpr)
          );
          propsArray.push(attr);
        }
        
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

      if (isFixedPropertyWithValue(currentProp)) {
        const propName = propKey;
        const propValue = getFixedComponentPropValueExpression(currentProp);
        const attr = factory.createJsxAttribute(
          factory.createIdentifier(propKey),
          factory.createJsxExpression(undefined, propValue)
        );
        propsArray.push(attr);
      }

      //TODO:  handle BoundStudioComponentProperty
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

  private addBoundExpressionAttributes(
    factory: NodeFactory,
    attributes: JsxAttributeLike[],
    propKey: string,
    propName: string,
    propValue: Expression  
  ) {
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

    attributes.push(attr);  
  }
}
