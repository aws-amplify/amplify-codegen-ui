import { StudioComponent } from '@amzn/amplify-ui-codegen-schema';
import { StudioTemplateRendererFactory } from '@amzn/studio-ui-codegen';
import { AmplifyRenderer } from '../amplify-ui-renderers/amplify-renderer';
import fs from 'fs';
import { join } from 'path';

function loadSchemaFromJSONFile(jsonSchemaFile: string): StudioComponent {
  return JSON.parse(
    fs.readFileSync(join(__dirname, 'studio-ui-json', `${jsonSchemaFile}.json`), 'utf-8'),
  ) as StudioComponent;
}

function generateWithAmplifyRenderer(jsonSchemaFile: string, isSampleCodeSnippet: boolean = false): string {
  const schema = loadSchemaFromJSONFile(jsonSchemaFile);
  const rendererFactory = new StudioTemplateRendererFactory(
    (component: StudioComponent) => new AmplifyRenderer(component),
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
  });
});
