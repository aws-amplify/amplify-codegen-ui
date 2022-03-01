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
import { StudioTemplateRendererFactory, StudioComponent, StudioTheme } from '@aws-amplify/codegen-ui';
import { Example, examples } from '@aws-amplify/codegen-ui/examples';
import { EOL } from 'os';
import { AmplifyRenderer, ReactThemeStudioTemplateRenderer } from '..';

const generateWithComponentRenderer = (componentSchema: StudioComponent): string => {
  const rendererFactory = new StudioTemplateRendererFactory(
    (component: StudioComponent) => new AmplifyRenderer(component, {}),
  );
  return rendererFactory.buildRenderer(componentSchema).renderComponent().componentText;
};

const generateWithThemeRenderer = (themeSchema: StudioTheme): string => {
  const rendererFactory = new StudioTemplateRendererFactory(
    (theme: StudioTheme) => new ReactThemeStudioTemplateRenderer(theme, {}),
  );
  return rendererFactory.buildRenderer(themeSchema).renderComponent().componentText;
};

const generateSchema = (example: Example): string => {
  const { schemaType, schema } = example;
  switch (schemaType) {
    case 'Component':
      return generateWithComponentRenderer(schema as StudioComponent);
    case 'Theme':
      return generateWithThemeRenderer(schema as StudioTheme);
    default:
      throw Error('Expected to either get a Component or Theme');
  }
};

// This method may need to evolve if there are more odd escape characters, etc.
const snapshotifySourceCode = (sourceCode: string): string => {
  const standardizedSource = sourceCode.replaceAll('"', '\\"').trim().concat(EOL);
  return `${EOL}"${standardizedSource}"${EOL}`;
};

describe('example schema tests', () => {
  examples.forEach((example: Example) => {
    const testName = `generates for schema ${example.schema.name}`;
    const platformImplementation = example.platformImplementations.react;
    if (platformImplementation === undefined) {
      return it.skip(testName);
    }
    return it(testName, () => {
      const generatedCode = generateSchema(example);
      expect(generatedCode).toMatchInlineSnapshot(snapshotifySourceCode(platformImplementation));
    });
  });

  it('enforces all examples have react implementations', () => {
    const examplesWithReactImplementation = examples.filter((example) => 'react' in example.platformImplementations);
    expect(examplesWithReactImplementation.length).toEqual(examples.length);
  });
});
