import { StudioComponentChild, StudioComponentProperties } from '@aws-amplify/codegen-ui/lib/types';
import { JsxAttribute, factory } from 'typescript';

export function getAttributes(props: Object): JsxAttribute[] {
  function buildExpression(value: string | boolean) {
    switch (typeof value) {
      case "boolean":
        return factory.createJsxExpression(undefined, value ? factory.createTrue() : factory.createFalse());
      default:
        return factory.createStringLiteral(value);
    }
  }
  const attributes = Object.entries(props).map(([key, value]) => {
    const expr = buildExpression(value);
    return factory.createJsxAttribute(factory.createIdentifier(key), expr);
  });

  return attributes;
}

export function getUniquePropIdentifier(propTypes: Set<string>, propName: string): string {
  propTypes.add(propName)
  return 'props.' + propName;
}

export function isProp(
  componentProperties: StudioComponentProperties,
  prop: string,
  whitelistedProps: string[],
): boolean {
  return 'isProp' in componentProperties && whitelistedProps.includes(prop);
}

export function camelCase(inputString: string) {
  return inputString
    .trim()
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => (index === 0 ? word.toLowerCase() : word.toUpperCase()))
    .replace(/\s+/g, '');
}

export function getTextType(textProperties: StudioComponentProperties): string | undefined {
  const bType: { [key: string]: string } = {
    '12px': 'b100',
    '14px': 'b200',
    '16px': 'b300',
    '18px': 'b400',
    '20px': 'b500',
  };

  const hType: { [key: string]: string } = {
    '16px': 'h100',
    '18px': 'h200',
    '20px': 'h300',
    '24px': 'h400',
    '28px': 'h500',
    '36px': 'h600',
  };

  const dType: { [key: string]: string } = {
    '36px': 'd50',
    '48px': 'd100',
    '54px': 'd200',
    '76px': 'd300',
  };

  if ('fontWeight' in textProperties && 'fontSize' in textProperties) {
    const fontWeight = JSON.parse(JSON.stringify(textProperties.fontWeight)).value;
    const fontSize = JSON.parse(JSON.stringify(textProperties.fontSize)).value;

    switch (fontWeight) {
      case '200':
      case '300':
        return dType[fontSize];

      case '400':
        return bType[fontSize];

      case '600':
      case '700':
        return hType[fontSize];
    }
  }

  return undefined;
}

export function getComplexPrimitivesChildren(children: StudioComponentChild[], childName: string) {
  const sideMenuTextValues: string[] = [];
  const traverseChildren = (children: StudioComponentChild[]) => {
    for (let child of children) {
      if (child.componentType === 'Text') {
        sideMenuTextValues.push(JSON.parse(JSON.stringify(child.properties)).children.value);
        continue;
      }

      if ('children' in child) {
        traverseChildren(child.children ?? []);
      }
    }
  };

  const traverseNodeForChildName = (children: StudioComponentChild[]) => {
      for(let child of children) {
          if(child.name.includes(childName)) {
              traverseChildren(child.children ?? []);
              continue;
          }

          if ('children' in child) {
            traverseNodeForChildName(child.children ?? []);
          }
      }
  }

  traverseNodeForChildName(children);
  return sideMenuTextValues;
}

export function getSpacingInset(padding: string) {
  const paddingArr = padding.split(" ");
  const spacingArr = paddingArr.map(gap => {
    return getSpacing(gap);
  });

  return spacingArr.join(" ");
}

export function getSpacing(gap: string): string {
  if (gap === '0') {
    gap = '0px';
  }

  const spacing = parseInt(gap.slice(0, -2));

  let currentMinimum: [number, number] = [spacing, 0];
  const allowedSpacingValues = [
    [2, 100],
    [4, 200],
    [8, 300],
    [16, 400],
    [24, 450],
    [32, 500],
    [64, 600]
  ];

  for(let value of allowedSpacingValues) {
    const diff = Math.abs(value[0] - spacing);
    if(diff < currentMinimum[0]) {
      currentMinimum = [diff, value[1]];
    }
  }

  if (currentMinimum[1] === 0) {
    return 'none';
  }

  return currentMinimum[1].toString();
}
