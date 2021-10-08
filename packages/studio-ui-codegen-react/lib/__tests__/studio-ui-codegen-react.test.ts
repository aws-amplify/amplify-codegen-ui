import { StudioComponent } from '@amzn/amplify-ui-codegen-schema';
import { StudioTemplateRendererFactory } from '@amzn/studio-ui-codegen';
import fs from 'fs';
import { join } from 'path';
import { ModuleKind, ScriptTarget, ScriptKind, ReactRenderConfig } from '..';
import { AmplifyRenderer } from '../amplify-ui-renderers/amplify-renderer';

function loadSchemaFromJSONFile(jsonSchemaFile: string): StudioComponent {
  return JSON.parse(
    fs.readFileSync(join(__dirname, 'studio-ui-json', `${jsonSchemaFile}.json`), 'utf-8'),
  ) as StudioComponent;
}

function generateWithAmplifyRenderer(
  jsonSchemaFile: string,
  renderConfig: ReactRenderConfig = {},
  isSampleCodeSnippet = false,
): string {
  const schema = loadSchemaFromJSONFile(jsonSchemaFile);
  const rendererFactory = new StudioTemplateRendererFactory(
    (component: StudioComponent) => new AmplifyRenderer(component, renderConfig),
  );
  if (isSampleCodeSnippet) {
    return rendererFactory.buildRenderer(schema).renderSampleCodeSnippet().compText;
  }
  return rendererFactory.buildRenderer(schema).renderComponent().componentText;
}

describe('amplify render tests', () => {
  describe('basic component tests', () => {
    it('should generate a simple box component', () => {
      const generatedCode = generateWithAmplifyRenderer('boxTest');
      expect(generatedCode).toMatchSnapshot();
    });

    it('should generate a simple button component', () => {
      const generatedCode = generateWithAmplifyRenderer('buttonGolden');
      expect(generatedCode).toMatchSnapshot();
    });

    it('should generate a simple text component', () => {
      const generatedCode = generateWithAmplifyRenderer('textGolden');
      expect(generatedCode).toMatchSnapshot();
    });

    it('should generate a simple badge component', () => {});

    it('should generate a simple card component', () => {});

    it('should generate a simple divider component', () => {});

    it('should generate a simple flex component', () => {});

    it('should generate a simple image component', () => {});

    it('should generate a simple string component', () => {});
  });

  describe('complex component tests', () => {
    it('should generate a button within a box component', () => {
      const generatedCode = generateWithAmplifyRenderer('boxGolden');
      expect(generatedCode).toMatchSnapshot();
    });

    it('should generate a component with custom child', () => {
      const generatedCode = generateWithAmplifyRenderer('customChild');
      expect(generatedCode).toMatchSnapshot();
    });

    it('should generate a component with exposeAs prop', () => {
      const generatedCode = generateWithAmplifyRenderer('exposedAsTest');
      expect(generatedCode).toMatchSnapshot();
    });
  });

  describe('sample code snippet tests', () => {
    it('should generate a sample code snippet for components', () => {
      const generatedCode = generateWithAmplifyRenderer('sampleCodeSnippet');
      expect(generatedCode).toMatchSnapshot();
    });
  });

  describe('component with data binding', () => {
    it('should add model imports', () => {
      const generatedCode = generateWithAmplifyRenderer('componentWithDataBinding');
      expect(generatedCode).toMatchSnapshot();
    });

    it('should not have useDataStoreBinding when there is no predicate', () => {
      const generatedCode = generateWithAmplifyRenderer('dataBindingWithoutPredicate');
      expect(generatedCode).toMatchSnapshot();
    });
  });

  describe('collection', () => {
    it('should render collection with data binding', () => {
      const generatedCode = generateWithAmplifyRenderer('collectionWithBinding');
      expect(generatedCode).toMatchSnapshot();
    });

    it('should render collection without data binding', () => {
      const generatedCode = generateWithAmplifyRenderer('collectionWithoutBinding');
      expect(generatedCode).toMatchSnapshot();
    });

    it('should render collection with data binding with no predicate', () => {
      const generatedCode = generateWithAmplifyRenderer('collectionWithBindingWithoutPredicate');
      expect(generatedCode).toMatchSnapshot();
    });

    it('should render collection with data binding and sort', () => {
      const generatedCode = generateWithAmplifyRenderer('collectionWithBindingAndSort');
      expect(generatedCode).toMatchSnapshot();
    });
  });

  describe('concat and conditional transform', () => {
    it('should render component with concatenation prop', () => {
      const generatedCode = generateWithAmplifyRenderer('concatTest');
      expect(generatedCode).toMatchSnapshot();
    });

    it('should render component with conditional prop', () => {
      const generatedCode = generateWithAmplifyRenderer('conditionalTest');
      expect(generatedCode).toMatchSnapshot();
    });
  });

  describe('component with binding', () => {
    it('should render build property on Text', () => {
      const generatedCode = generateWithAmplifyRenderer('textWithDataBinding');
      expect(generatedCode).toMatchSnapshot();
    });
  });

  describe('custom render config', () => {
    it('should render ES5', () => {
      expect(
        generateWithAmplifyRenderer('boxGolden', { target: ScriptTarget.ES5, script: ScriptKind.JS }),
      ).toMatchSnapshot();
    });

    it('should render JSX', () => {
      expect(generateWithAmplifyRenderer('boxGolden', { script: ScriptKind.JSX })).toMatchSnapshot();
    });

    it('should render common JS', () => {
      expect(
        generateWithAmplifyRenderer('boxGolden', { module: ModuleKind.CommonJS, script: ScriptKind.JS }),
      ).toMatchSnapshot();
    });
  });

  describe('user specific attributes', () => {
    it('should render user specific attributes', () => {
      expect(generateWithAmplifyRenderer('componentWithUserSpecificAttributes')).toMatchSnapshot();
    });
  });
});
