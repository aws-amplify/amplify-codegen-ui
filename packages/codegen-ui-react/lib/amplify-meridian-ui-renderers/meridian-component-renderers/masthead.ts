import { StudioComponent, StudioComponentChild } from '@aws-amplify/codegen-ui/lib/types';
import { JsxAttribute, JsxChild, JsxElement, factory } from 'typescript';
import { getAttributes, getComplexPrimitivesChildren } from '../helpers';

function createMastheadChildren(component: StudioComponent | StudioComponentChild) {
    const mastHeadLinks = getComplexPrimitivesChildren(component.children ?? [], "Navigation items");

    const mastheadLinksJsx: JsxChild[] = mastHeadLinks.map((mastHeadLinkText) => {
    return factory.createJsxElement(
        factory.createJsxOpeningElement(
        factory.createIdentifier('MastheadLink'),
        undefined,
        factory.createJsxAttributes([
            factory.createJsxAttribute(
            factory.createIdentifier('children'),
            factory.createStringLiteral(mastHeadLinkText),
            ),
        ]),
        ),
        [],
        factory.createJsxClosingElement(factory.createIdentifier('MastheadLink')),
    );
    });
    return mastheadLinksJsx;
}

export function createMasthead(
    component: StudioComponent | StudioComponentChild,
    propTypes: Set<string>,
): JsxElement {
    let props: any = {};
    let jsxAttributes: JsxAttribute[] = [];

    jsxAttributes = [...getAttributes(props), ...jsxAttributes];

    return factory.createJsxElement(
    factory.createJsxOpeningElement(
        factory.createIdentifier('Masthead'),
        undefined,
        factory.createJsxAttributes(jsxAttributes),
    ),
    createMastheadChildren(component),
    factory.createJsxClosingElement(factory.createIdentifier('Masthead')),
    );
}
