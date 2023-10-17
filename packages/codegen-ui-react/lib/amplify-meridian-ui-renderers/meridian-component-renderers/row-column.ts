import { StudioComponent, StudioComponentChild } from '@aws-amplify/codegen-ui/lib/types';
import { JsxAttribute, JsxChild, JsxElement, PropertyAssignment, factory } from 'typescript';
import { 
  isProp, 
  getUniquePropIdentifier, 
  getAttributes, 
  getSpacingInset, 
  getSpacing 
} from '../helpers';
import { hasChildrenProp } from '../../react-component-render-helper';

const whitelistedProps: string[] = [];

export function createRowOrColumn(
  component: StudioComponent | StudioComponentChild,
  propTypes: Set<string>,
  parent: StudioComponent | StudioComponentChild | undefined,
  renderChildren: ((children: StudioComponentChild[]) => JsxChild[]) | undefined = undefined,
): JsxElement {
  let props: any = {};
  let jsxAttributes: JsxAttribute[] = [];
  const children = component.children ?? [];

  const xAxisAlignment = component.componentType === 'Row' ? 'justifyContent' : 'alignItems';
  const yAxisAlignment = component.componentType === 'Row' ? 'alignItems' : 'justifyContent';

  //alignmentHorizontal
  if (xAxisAlignment in component.properties) {
    const xAlignment = JSON.parse(JSON.stringify(component.properties[xAxisAlignment])).value.toLowerCase();
    if(component.name === "Frame 74211") {
      console.log("xAxisAlignment: " + xAlignment);
    }
    if (isProp(component.properties, 'alignmentHorizontal', whitelistedProps)) {
      const propName = JSON.parse(JSON.stringify(component.properties.isProp)).value;
      const identifier = getUniquePropIdentifier(propTypes, propName + '_alignmentHorizontal');
      jsxAttributes.push(
        factory.createJsxAttribute(
          factory.createIdentifier('alignmentHorizontal'),
          factory.createJsxExpression(undefined, factory.createIdentifier(identifier)),
        ),
      );
    } else {
      switch (xAlignment) {
        case 'flex-end':
          props.alignmentHorizontal = 'end';
          break;

        case 'flex-start':
          props.alignmentHorizontal = 'start';
          break;

        case 'space-between':
          props.alignmentHorizontal = 'justify';
          break;

        case 'center':
        default:
          props.alignmentHorizontal = 'center';
      }
    }
  }

  //alignmentVertical
  if (yAxisAlignment in component.properties) {
    const yAlignment = JSON.parse(JSON.stringify(component.properties[yAxisAlignment])).value.toLowerCase();
    if(component.name === "Frame 74211") {
      console.log("yAxisAlignment: " + yAlignment);
    }
    if (isProp(component.properties, 'alignmentVertical', whitelistedProps)) {
      const propName = JSON.parse(JSON.stringify(component.properties.isProp)).value;
      const identifier = getUniquePropIdentifier(propTypes, propName + '_alignmentVertical');
      jsxAttributes.push(
        factory.createJsxAttribute(
          factory.createIdentifier('alignmentVertical'),
          factory.createJsxExpression(undefined, factory.createIdentifier(identifier)),
        ),
      );
    } else {
      switch (yAlignment) {
        case 'flex-end':
          props.alignmentVertical = 'bottom';
          break;

        case 'flex-start':
          props.alignmentVertical = 'top';
          break;

        case 'space-between':
          props.alignmentVertical = 'justify';
          break;

        case 'center':
        default:
          props.alignmentVertical = 'center';
      }
    }
  }

  //backgroundColor
  if ('backgroundColor' in component.properties) {
    const backgroundColor = JSON.parse(JSON.stringify(component.properties.backgroundColor)).value.toLowerCase();
    if (isProp(component.properties, 'backgroundColor', whitelistedProps)) {
      const propName = JSON.parse(JSON.stringify(component.properties.isProp)).value;
      const identifier = getUniquePropIdentifier(propTypes, propName + '_backgroundColor');
      jsxAttributes.push(
        factory.createJsxAttribute(
          factory.createIdentifier('backgroundColor'),
          factory.createJsxExpression(undefined, factory.createIdentifier(identifier)),
        ),
      );
    } else {
      props.backgroundColor = backgroundColor;
    }
  }

  //height
  if ('height' in component.properties) {
    let height = JSON.parse(JSON.stringify(component.properties.height)).value.toLowerCase();

    if (isProp(component.properties, 'height', whitelistedProps)) {
      const propName = JSON.parse(JSON.stringify(component.properties.isProp)).value;
      const identifier = getUniquePropIdentifier(propTypes, propName + '_height');
      jsxAttributes.push(
        factory.createJsxAttribute(
          factory.createIdentifier('height'),
          factory.createJsxExpression(undefined, factory.createIdentifier(identifier)),
        ),
      );
    } else {
      props.height = height;
    }
  }

  //spacingInset
  if ('padding' in component.properties) {
    const padding = JSON.parse(JSON.stringify(component.properties.padding)).value.toLowerCase();
    const spacingInset = getSpacingInset(padding);
    if (isProp(component.properties, 'spacingInset', whitelistedProps)) {
      const propName = JSON.parse(JSON.stringify(component.properties.isProp)).value;
      const identifier = getUniquePropIdentifier(propTypes, propName + '_spacingInset');
      jsxAttributes.push(
        factory.createJsxAttribute(
          factory.createIdentifier('spacingInset'),
          factory.createJsxExpression(undefined, factory.createIdentifier(identifier)),
        ),
      );
    } else {
      props.spacingInset = spacingInset;
    }
  }

  //spacing
  if('gap' in component.properties) {
    const gap = JSON.parse(JSON.stringify(component.properties.gap)).value.toLowerCase();
    const spacing = getSpacing(gap);
    if (isProp(component.properties, 'spacing', whitelistedProps)) {
      const propName = JSON.parse(JSON.stringify(component.properties.isProp)).value;
      const identifier = getUniquePropIdentifier(propTypes, propName + '_spacing');
      jsxAttributes.push(
        factory.createJsxAttribute(
          factory.createIdentifier('spacing'),
          factory.createJsxExpression(undefined, factory.createIdentifier(identifier)),
        ),
      );
    } else {
      props.spacing = spacing;
    }
  }

  //width
  if ('width' in component.properties) {
    let width = JSON.parse(JSON.stringify(component.properties.width)).value.toLowerCase();

    if (isProp(component.properties, 'width', whitelistedProps)) {
      const propName = JSON.parse(JSON.stringify(component.properties.isProp)).value;
      const identifier = getUniquePropIdentifier(propTypes, propName + '_width');
      jsxAttributes.push(
        factory.createJsxAttribute(
          factory.createIdentifier('width'),
          factory.createJsxExpression(undefined, factory.createIdentifier(identifier)),
        ),
      );
    } else {
      props.width = width;
    }
  }

  // grow/align
  if(parent) {
    const parentDirection = parent.componentType;
    const growDimension = parentDirection == 'Row' ? 'width' : 'height';
    const stretchDimension = parentDirection == 'Row' ? 'height' : 'width';

    //grow - this property will be set if layout is stretch along parent's primary axis
    if ('grow' in component.properties) {
      const grow = JSON.parse(JSON.stringify(component.properties.grow)).value.toLowerCase();
      if(grow === "1") {
        props[growDimension] = "100%";
      }
    }

    //aligSelf - this property will be set if layout is stretch along parent's counter axis
    if ('alignSelf' in component.properties) {
      const alignSelf = JSON.parse(JSON.stringify(component.properties.alignSelf)).value.toLowerCase();
      if(alignSelf === "stretch") {
        props[stretchDimension] = "100%";
      }
    }
  }

  //custom props
  const allowedCustomProps = ["backgroundImage", "boxShadow", "borderRadius", "border"];
  let customProperties: PropertyAssignment[] = [];
  allowedCustomProps.forEach(propName => {
    if(propName in component.properties) {
      const propValue = JSON.parse(JSON.stringify(component.properties[propName])).value;
      customProperties.push(
        factory.createPropertyAssignment(propName, factory.createStringLiteral(propValue))
      )
    }
  })

  if(customProperties.length > 0) {
    jsxAttributes.push(
      factory.createJsxAttribute(
        factory.createIdentifier("className"),
        factory.createJsxExpression(undefined, factory.createCallExpression(
          factory.createIdentifier("css"), 
          undefined, 
          [factory.createObjectLiteralExpression(customProperties, undefined)]
        ))
      )
    )
  }

  jsxAttributes = [...getAttributes(props), ...jsxAttributes];

  //Generate JSXAttributes
  return factory.createJsxElement(
    factory.createJsxOpeningElement(
      factory.createIdentifier(component.componentType),
      undefined,
      factory.createJsxAttributes(jsxAttributes),
    ),
    renderChildren && !hasChildrenProp(component.properties) ? renderChildren(children) : [],
    factory.createJsxClosingElement(factory.createIdentifier(component.componentType)),
  );
}
