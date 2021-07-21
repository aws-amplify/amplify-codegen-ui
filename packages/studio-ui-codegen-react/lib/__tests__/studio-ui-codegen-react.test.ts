import { FirstOrderStudioComponent } from '@amzn/amplify-ui-codegen-schema';
import { StudioTemplateRendererFactory } from '../../../studio-ui-codegen/dist';
import { AmplifyRenderer } from '../amplify-ui-renderers/amplify-renderer';
import * as schema from './studio-ui-json/boxGolden.json';
import fs from 'fs';
import { join } from 'path';

function generateWithAmplifyRenderer(jsonSchemaFile: string): string {
  const schema = JSON.parse(
    fs.readFileSync(join(__dirname, 'studio-ui-json', `${jsonSchemaFile}.json`), 'utf-8')
    ) as FirstOrderStudioComponent;
  const rendererFactory = new StudioTemplateRendererFactory(
    (component: FirstOrderStudioComponent) => new AmplifyRenderer(component),
  );
  return rendererFactory.buildRenderer(schema).renderComponent().componentText;
}

describe('amplify render tests', () => {
  it('should generate a simple box component', () => {
    const generatedCode = generateWithAmplifyRenderer('boxTest')
    expect(generatedCode).toMatchSnapshot();
  });

  it('should generate a simple button component', () => {
    const generatedCode = generateWithAmplifyRenderer('buttonGolden')
    expect(generatedCode).toMatchSnapshot();
  });

  it('should generate a simple text component', () => {
    const generatedCode = generateWithAmplifyRenderer('textGolden')
    expect(generatedCode).toMatchSnapshot();
  });

  it('should generate a button within a box component', () => {
    const generatedCode = generateWithAmplifyRenderer('boxGolden')
    expect(generatedCode).toMatchSnapshot();
  });

  it('should generate a component with custom child', () => {
    const generatedCode = generateWithAmplifyRenderer('customChild')
    expect(generatedCode).toMatchSnapshot();
  });

  it('should generate a component with exposeAs prop', () => {
    const generatedCode = generateWithAmplifyRenderer('exposedAsTest')
    expect(generatedCode).toMatchSnapshot();
  });
});
