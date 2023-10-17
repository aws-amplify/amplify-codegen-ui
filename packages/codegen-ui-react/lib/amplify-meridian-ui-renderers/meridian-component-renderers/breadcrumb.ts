import { StudioComponent, StudioComponentChild } from '@aws-amplify/codegen-ui/lib/types';
import { JsxAttribute, JsxChild, JsxElement, factory } from 'typescript';
import { getAttributes } from '../helpers';

function getTextValues(children: StudioComponentChild[]) {
  const textContents: string[] = [];

  const traverseChildren = (children: readonly StudioComponentChild[]) => {
    for (let child of children) {
      if (child.componentType === 'Text') {
        textContents.push(JSON.parse(JSON.stringify(child.properties)).children.value);
        continue;
      }

      if ('children' in child) {
        traverseChildren(child.children ?? []);
      }
    }
  };

  traverseChildren(children);
  return textContents;
}

function createBreadcrumbs(textValues: string[]): JsxChild[] {
  const breadCrumbsJsx: JsxChild[] = textValues.map((textValue) => {
    return factory.createJsxElement(
      factory.createJsxOpeningElement(
        factory.createIdentifier('Breadcrumb'),
        undefined,
        factory.createJsxAttributes([
          factory.createJsxAttribute(factory.createIdentifier('children'), factory.createStringLiteral(textValue)),
        ]),
      ),
      [],
      factory.createJsxClosingElement(factory.createIdentifier('Breadcrumb')),
    );
  });
  return breadCrumbsJsx;
}

export function createBreadcrumbGroup(
  component: StudioComponent | StudioComponentChild,
  propTypes: Set<string>,
): JsxElement {
  const textValues = getTextValues(component.children ?? []);

  const breadCrumbs = createBreadcrumbs(textValues);

  let props: any = {};
  let jsxAttributes: JsxAttribute[] = [];

  jsxAttributes = [...getAttributes(props), ...jsxAttributes];

  return factory.createJsxElement(
    factory.createJsxOpeningElement(
      factory.createIdentifier('BreadcrumbGroup'),
      undefined,
      factory.createJsxAttributes(jsxAttributes),
    ),
    breadCrumbs,
    factory.createJsxClosingElement(factory.createIdentifier('BreadcrumbGroup')),
  );
}
