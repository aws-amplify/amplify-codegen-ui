import { StudioComponent, StudioComponentChild } from '@aws-amplify/codegen-ui/lib/types';
import { JsxAttribute, JsxChild, JsxElement, factory } from 'typescript';
import { getAttributes, getComplexPrimitivesChildren } from '../helpers';

function getSideMenuChild(component: StudioComponent | StudioComponentChild) {
  const sideMenuLinks = getComplexPrimitivesChildren(component.children ?? [], "Side menu items");
  const sideMenuTitle = getComplexPrimitivesChildren(component.children ?? [], "Header");

  const sideMenuTitleJsx: JsxChild[] = sideMenuTitle.map((sideMenuTitleText) => {
    return factory.createJsxElement(
      factory.createJsxOpeningElement(
        factory.createIdentifier('SideMenuTitle'),
        undefined,
        factory.createJsxAttributes([
          factory.createJsxAttribute(
            factory.createIdentifier('children'),
            factory.createStringLiteral(sideMenuTitleText),
          ),
        ]),
      ),
      [],
      factory.createJsxClosingElement(factory.createIdentifier('SideMenuTitle')),
    );
  });

  const sideMenuLinksJsx: JsxChild[] = sideMenuLinks.map((sideMenuLinkText) => {
    return factory.createJsxElement(
      factory.createJsxOpeningElement(
        factory.createIdentifier('SideMenuLink'),
        undefined,
        factory.createJsxAttributes([
          factory.createJsxAttribute(
            factory.createIdentifier('children'),
            factory.createStringLiteral(sideMenuLinkText),
          ),
        ]),
      ),
      [],
      factory.createJsxClosingElement(factory.createIdentifier('SideMenuLink')),
    );
  });
  return [...sideMenuTitleJsx, ...sideMenuLinksJsx];
}

export function createSideMenu(
  component: StudioComponent | StudioComponentChild,
  propTypes: Set<string>,
): JsxElement {
  let props: any = {};
  let jsxAttributes: JsxAttribute[] = [];

  jsxAttributes = [...getAttributes(props), ...jsxAttributes];

  return factory.createJsxElement(
    factory.createJsxOpeningElement(
      factory.createIdentifier('SideMenu'),
      undefined,
      factory.createJsxAttributes(jsxAttributes),
    ),
    getSideMenuChild(component),
    factory.createJsxClosingElement(factory.createIdentifier('SideMenu')),
  );
}
