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
import { StudioTemplateRendererFactory, StudioComponent, StudioTheme } from '@amzn/studio-ui-codegen';
import fs from 'fs';
import { join } from 'path';
import { ModuleKind, ScriptTarget, ScriptKind, ReactRenderConfig } from '..';
import { AmplifyRenderer } from '../amplify-ui-renderers/amplify-renderer';
import { ReactThemeStudioTemplateRenderer } from '../react-theme-studio-template-renderer';

function loadSchemaFromJSONFile(jsonSchemaFile: string): StudioComponent {
  return JSON.parse(
    fs.readFileSync(join(__dirname, 'studio-ui-json', `${jsonSchemaFile}.json`), 'utf-8'),
  ) as StudioComponent;
}

function loadThemeFromJSONFile(jsonThemeFile: string): StudioTheme {
  return JSON.parse(
    fs.readFileSync(join(__dirname, 'studio-ui-json', `${jsonThemeFile}.json`), 'utf-8'),
  ) as StudioTheme;
}

function generateWithAmplifyRenderer(
  jsonSchemaFile: string,
  renderConfig: ReactRenderConfig = {},
  isSampleCodeSnippet = false,
): { componentText: string; declaration?: string } {
  const schema = loadSchemaFromJSONFile(jsonSchemaFile);
  const rendererFactory = new StudioTemplateRendererFactory(
    (component: StudioComponent) => new AmplifyRenderer(component, renderConfig),
  );
  if (isSampleCodeSnippet) {
    return { componentText: rendererFactory.buildRenderer(schema).renderSampleCodeSnippet().compText };
  }
  return rendererFactory.buildRenderer(schema).renderComponent();
}

function generateWithThemeRenderer(jsonFile: string, renderConfig: ReactRenderConfig = {}): string {
  const theme = loadThemeFromJSONFile(jsonFile);
  const rendererFactory = new StudioTemplateRendererFactory(
    (theme: StudioTheme) => new ReactThemeStudioTemplateRenderer(theme, renderConfig),
  );
  return rendererFactory.buildRenderer(theme).renderComponent().componentText;
}

describe('amplify render tests', () => {
  describe('basic component tests', () => {
    it('should generate a simple view component', () => {
      const generatedCode = generateWithAmplifyRenderer('viewTest');
      expect(generatedCode.componentText).toMatchSnapshot();
    });

    it('should generate a simple button component', () => {
      const generatedCode = generateWithAmplifyRenderer('buttonGolden');
      expect(generatedCode.componentText).toMatchSnapshot();
    });

    it('should generate a simple text component', () => {
      const generatedCode = generateWithAmplifyRenderer('textGolden');
      expect(generatedCode.componentText).toMatchSnapshot();
    });

    it('should generate a simple badge component', () => {});

    it('should generate a simple card component', () => {});

    it('should generate a simple divider component', () => {});

    it('should generate a simple flex component', () => {});

    it('should generate a simple image component', () => {});

    it('should generate a simple string component', () => {});
  });

  describe('complex component tests', () => {
    it('should generate a button within a view component', () => {
      const generatedCode = generateWithAmplifyRenderer('viewGolden');
      expect(generatedCode.componentText).toMatchSnapshot();
    });

    it('should generate a component with custom child', () => {
      const generatedCode = generateWithAmplifyRenderer('customChild');
      expect(generatedCode.componentText).toMatchSnapshot();
    });

    it('should generate a component with exposeAs prop', () => {
      const generatedCode = generateWithAmplifyRenderer('exposedAsTest');
      expect(generatedCode.componentText).toMatchSnapshot();
    });
  });

  describe('sample code snippet tests', () => {
    it('should generate a sample code snippet for components', () => {
      const generatedCode = generateWithAmplifyRenderer('sampleCodeSnippet');
      expect(generatedCode.componentText).toMatchSnapshot();
    });
  });

  describe('component with data binding', () => {
    it('should add model imports', () => {
      const generatedCode = generateWithAmplifyRenderer('componentWithDataBinding');
      expect(generatedCode.componentText).toMatchSnapshot();
    });

    it('should not have useDataStoreBinding when there is no predicate', () => {
      const generatedCode = generateWithAmplifyRenderer('dataBindingWithoutPredicate');
      expect(generatedCode.componentText).toMatchSnapshot();
    });

    it('should render with data binding in child elements', () => {
      const generatedCode = generateWithAmplifyRenderer('childComponentWithDataBinding');
      expect(generatedCode.componentText).toMatchSnapshot();
    });
  });

  describe('collection', () => {
    it('should render collection with data binding', () => {
      const generatedCode = generateWithAmplifyRenderer('collectionWithBinding');
      expect(generatedCode.componentText).toMatchSnapshot();
    });

    it('should render collection without data binding', () => {
      const generatedCode = generateWithAmplifyRenderer('collectionWithoutBinding');
      expect(generatedCode.componentText).toMatchSnapshot();
    });

    it('should render collection with data binding with no predicate', () => {
      const generatedCode = generateWithAmplifyRenderer('collectionWithBindingWithoutPredicate');
      expect(generatedCode.componentText).toMatchSnapshot();
    });

    it('should render collection with data binding and sort', () => {
      const generatedCode = generateWithAmplifyRenderer('collectionWithBindingAndSort');
      expect(generatedCode).toMatchSnapshot();
    });

    it('should render collection with data binding if binding name is items', () => {
      const generatedCode = generateWithAmplifyRenderer('collectionWithBindingItemsName');
      expect(generatedCode.componentText).toMatchSnapshot();
    });
  });

  describe('complex examples', () => {
    it('should render complex sample 1', () => {
      const generatedCode = generateWithAmplifyRenderer('complexTest1');
      expect(generatedCode.componentText).toMatchSnapshot();
    });

    it('should render complex sample 2', () => {
      const generatedCode = generateWithAmplifyRenderer('complexTest2');
      expect(generatedCode.componentText).toMatchSnapshot();
    });

    it('should render complex sample 3', () => {
      const generatedCode = generateWithAmplifyRenderer('complexTest3');
      expect(generatedCode.componentText).toMatchSnapshot();
    });
    it('should render complex sample 4', () => {
      const generatedCode = generateWithAmplifyRenderer('complexTest4');
      expect(generatedCode.componentText).toMatchSnapshot();
    });
    it('should render complex sample 5', () => {
      const generatedCode = generateWithAmplifyRenderer('complexTest5');
      expect(generatedCode.componentText).toMatchSnapshot();
    });
    it('should render complex sample 6', () => {
      const generatedCode = generateWithAmplifyRenderer('complexTest6');
      expect(generatedCode.componentText).toMatchSnapshot();
    });
    it('should render complex sample 7', () => {
      const generatedCode = generateWithAmplifyRenderer('complexTest7');
      expect(generatedCode.componentText).toMatchSnapshot();
    });
    it('should render complex sample 8', () => {
      const generatedCode = generateWithAmplifyRenderer('complexTest8');
      expect(generatedCode.componentText).toMatchSnapshot();
    });
  });

  describe('concat and conditional transform', () => {
    it('should render component with concatenation prop', () => {
      const generatedCode = generateWithAmplifyRenderer('concatTest');
      expect(generatedCode.componentText).toMatchSnapshot();
    });

    it('should render child component with static concatenation', () => {
      const generatedCode = generateWithAmplifyRenderer('childComponentWithStaticConcatenation');
      expect(generatedCode.componentText).toMatchSnapshot();
    });

    it('should render child component with data bound concatenation', () => {
      const generatedCode = generateWithAmplifyRenderer('childComponentWithDataBoundConcatenation');
      expect(generatedCode.componentText).toMatchSnapshot();
    });

    it('should render component with conditional prop', () => {
      const generatedCode = generateWithAmplifyRenderer('conditionalTest');
      expect(generatedCode.componentText).toMatchSnapshot();
    });
  });

  describe('component with binding', () => {
    it('should render build property on Text', () => {
      const generatedCode = generateWithAmplifyRenderer('textWithDataBinding');
      expect(generatedCode.componentText).toMatchSnapshot();
    });
  });

  describe('component with variants', () => {
    it('should render variants with options provided', () => {
      const generatedCode = generateWithAmplifyRenderer('componentWithVariants');
      expect(generatedCode).toMatchSnapshot();
    });
  });

  describe('custom render config', () => {
    it('should render ES5', () => {
      expect(
        generateWithAmplifyRenderer('viewGolden', { target: ScriptTarget.ES5, script: ScriptKind.JS }).componentText,
      ).toMatchSnapshot();
    });

    it('should render JSX', () => {
      expect(generateWithAmplifyRenderer('viewGolden', { script: ScriptKind.JSX }).componentText).toMatchSnapshot();
    });

    it('should render common JS', () => {
      expect(
        generateWithAmplifyRenderer('viewGolden', { module: ModuleKind.CommonJS, script: ScriptKind.JS }).componentText,
      ).toMatchSnapshot();
    });
  });

  describe('user specific attributes', () => {
    it('should render user specific attributes', () => {
      expect(generateWithAmplifyRenderer('componentWithUserSpecificAttributes').componentText).toMatchSnapshot();
    });
  });

  describe('declarations', () => {
    it('should render declarations', () => {
      expect(
        generateWithAmplifyRenderer('componentWithUserSpecificAttributes', {
          script: ScriptKind.JS,
          renderTypeDeclarations: true,
        }).declaration,
      ).toMatchSnapshot();
    });
  });

  describe('theme', () => {
    it('should render the theme', () => {
      expect(generateWithThemeRenderer('theme')).toMatchSnapshot();
    });

    it('should render the theme with TSX', () => {
      expect(generateWithThemeRenderer('theme', { script: ScriptKind.TSX })).toMatchSnapshot();
    });

    it('should render the theme with ES5', () => {
      expect(generateWithThemeRenderer('theme', { target: ScriptTarget.ES5, script: ScriptKind.JS })).toMatchSnapshot();
    });
  });

  describe('actions', () => {
    it('should render sign out action', () => {
      expect(generateWithAmplifyRenderer('componentWithActionSignOut')).toMatchSnapshot();
    });
  });

  it('should render navigation actions', () => {
    expect(generateWithAmplifyRenderer('componentWithActionNavigation')).toMatchSnapshot();
  });

  describe('default value', () => {
    it('should render bound default value', () => {
      expect(generateWithAmplifyRenderer('default-value-components/boundDefaultValue')).toMatchSnapshot();
    });

    it('should render simple and bound default value', () => {
      expect(generateWithAmplifyRenderer('default-value-components/simpleAndBoundDefaultValue')).toMatchSnapshot();
    });

    it('should render simple default value', () => {
      expect(
        generateWithAmplifyRenderer('default-value-components/simplePropertyBindingDefaultValue'),
      ).toMatchSnapshot();
    });

    it('should render collection default value', () => {
      expect(generateWithAmplifyRenderer('default-value-components/collectionDefaultValue')).toMatchSnapshot();
    });
  });

  it('should render parsed fixed values', () => {
    expect(generateWithAmplifyRenderer('parsedFixedValues')).toMatchSnapshot();
  });

  describe('custom components', () => {
    describe('custom children', () => {
      it('should render component with custom children', () => {
        expect(generateWithAmplifyRenderer('custom/customChildren').componentText).toMatchSnapshot();
      });

      it('should render component with custom children with ES5', () => {
        expect(
          generateWithAmplifyRenderer('custom/customChildren', {
            target: ScriptTarget.ES5,
            script: ScriptKind.JS,
          }).componentText,
        ).toMatchSnapshot();
      });

      it('should render declarations', () => {
        expect(
          generateWithAmplifyRenderer('custom/customChildren', {
            script: ScriptKind.JS,
            renderTypeDeclarations: true,
          }).declaration,
        ).toMatchSnapshot();
      });
    });

    describe('custom parent', () => {
      it('should render component', () => {
        expect(generateWithAmplifyRenderer('custom/customParent').componentText).toMatchSnapshot();
      });

      it('should render component with ES5', () => {
        expect(
          generateWithAmplifyRenderer('custom/customParent', {
            target: ScriptTarget.ES5,
            script: ScriptKind.JS,
          }).componentText,
        ).toMatchSnapshot();
      });

      it('should render declarations', () => {
        expect(
          generateWithAmplifyRenderer('custom/customParent', {
            script: ScriptKind.JS,
            renderTypeDeclarations: true,
          }).declaration,
        ).toMatchSnapshot();
      });
    });

    describe('custom parent and children', () => {
      it('should render component with custom parent and children', () => {
        expect(generateWithAmplifyRenderer('custom/customParentAndChildren').componentText).toMatchSnapshot();
      });

      it('should render component with custom parent and children with ES5', () => {
        expect(
          generateWithAmplifyRenderer('custom/customParentAndChildren', {
            target: ScriptTarget.ES5,
            script: ScriptKind.JS,
          }).componentText,
        ).toMatchSnapshot();
      });

      it('should render declarations', () => {
        expect(
          generateWithAmplifyRenderer('custom/customParentAndChildren', {
            script: ScriptKind.JS,
            renderTypeDeclarations: true,
          }).declaration,
        ).toMatchSnapshot();
      });
    });
  });
});
