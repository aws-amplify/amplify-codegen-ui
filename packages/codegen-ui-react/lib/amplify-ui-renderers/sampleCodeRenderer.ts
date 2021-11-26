/*
  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.

  Licensed under the Apache License, Version 2.0 (the "License").
  You may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
 */
import { BaseComponentProps } from '@aws-amplify/ui-react';

import { factory, JsxAttribute, JsxAttributeLike, JsxSelfClosingElement } from 'typescript';
import { FrontendManagerRendererConstants } from '@aws-amplify/codegen-ui';
import { ReactComponentRenderer } from '../react-component-renderer';

export default class SampleCodeRenderer extends ReactComponentRenderer<BaseComponentProps> {
  renderElement(): JsxSelfClosingElement {
    const tagName = this.component.name ?? FrontendManagerRendererConstants.unknownName;
    // const prop = new Map<string, BoundFrontendManagerComponentProperty>();
    // this.collectExposedProps(this.component, prop);

    const propsArray: JsxAttribute[] = [];
    /*  TODO:  move over to boundProperties
    const defaultValue = 'defaultValue';
    const defaultValueExpr = factory.createJsxExpression(undefined, factory.createIdentifier(defaultValue));
    props?.forEach((value, key) => {
      if (value.exposedAs) {
        const displayExpr =
          value.value !== undefined ? factory.createStringLiteral(value.value.toString()) : defaultValueExpr;
        const attr = factory.createJsxAttribute(factory.createIdentifier(key), displayExpr);
        propsArray.push(attr);
      }
    });
    */

    return factory.createJsxSelfClosingElement(
      factory.createIdentifier(tagName),
      undefined,
      factory.createJsxAttributes(propsArray),
    );
  }

  /*
  private collectExposedProps(
    component: FrontendManagerComponent,
    collected: Map<string, FrontendManagerComponentProperty>,
  ) {
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
  */

  private addExposedPropAttributes(attributes: JsxAttributeLike[], tagName: string) {
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
