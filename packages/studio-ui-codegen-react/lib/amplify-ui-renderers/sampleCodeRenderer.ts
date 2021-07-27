import { BaseComponentProps } from '@amzn/amplify-ui-react-types';
import { ReactComponentRenderer } from '../react-component-renderer';

import { factory, JsxAttribute, JsxAttributeLike, JsxElement, JsxOpeningElement, NodeFactory } from 'typescript';
import {
  StudioComponent,
  FirstOrderStudioComponent,
  StudioComponentProperty,
} from '../../../amplify-ui-codegen-schema/dist';

export default class SampleCodeRenderer extends ReactComponentRenderer<BaseComponentProps, BaseComponentProps> {
  renderElement(): JsxElement {
    const tagName = (<FirstOrderStudioComponent>this.component).name;
    var exposedProps = new Map<string, StudioComponentProperty>();
    this.collectExposedProps(this.component, exposedProps);

    const element = factory.createJsxElement(
      this.renderSampleCodeOpeningElement(factory, exposedProps, tagName),
      [],
      factory.createJsxClosingElement(factory.createIdentifier(tagName)),
    );

    return element;
  }

  private collectExposedProps(component: StudioComponent, collected: Map<string, StudioComponentProperty>) {
    const moreItems = Object.entries(component.properties).filter((m) => !(m[1].exposedAs == null));
    moreItems?.forEach((value, index) => {
      if (!collected.has(value[0])) {
        collected.set(value[0], value[1]);
      }
    });

    component.children?.forEach((child) => {
      this.collectExposedProps(child, collected);
    });
  }

  private renderSampleCodeOpeningElement(
    factory: NodeFactory,
    props: Map<string, StudioComponentProperty>,
    tagName: string,
  ): JsxOpeningElement {
    const defaultValue = 'defaultValue';
    const defaultValueExpr = factory.createJsxExpression(undefined, factory.createIdentifier(defaultValue));
    const propsArray: JsxAttribute[] = [];
    props?.forEach((value, key) => {
      if (value.exposedAs) {
        const displayExpr = value.value ? factory.createStringLiteral(value.value) : defaultValueExpr;
        const attr = factory.createJsxAttribute(
          factory.createIdentifier(key),
          displayExpr,
        );
        propsArray.push(attr);
      }
    });

    return factory.createJsxOpeningElement(
      factory.createIdentifier(tagName),
      undefined,
      factory.createJsxAttributes(propsArray),
    );
  }

  private addExposedPropAttributes(factory: NodeFactory, attributes: JsxAttributeLike[], tagName: string) {
    const propsAttr = factory.createJsxSpreadAttribute(factory.createIdentifier('props'));
    attributes.push(propsAttr);

    const overrideAttr = factory.createJsxSpreadAttribute(
      factory.createCallExpression(factory.createIdentifier('getOverrideProps'), undefined, [
        factory.createPropertyAccessExpression(
          factory.createIdentifier('props'),
          factory.createIdentifier('overrides'),
        ),
        factory.createStringLiteral(tagName),
      ]),
    );
    attributes.push(overrideAttr);
  }

  mapProps(props: BaseComponentProps): BaseComponentProps {
    return props;
  }
}
