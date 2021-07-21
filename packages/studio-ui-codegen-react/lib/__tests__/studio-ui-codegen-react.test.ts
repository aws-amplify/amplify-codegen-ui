import { FirstOrderStudioComponent } from '@amzn/amplify-ui-codegen-schema';
import { StudioTemplateRendererFactory } from '../../../studio-ui-codegen/dist';
import { AmplifyRenderer } from '../amplify-ui-renderers/amplify-renderer';
import * as schema from './studio-ui-json/boxGolden.json';

const rendererFactory = new StudioTemplateRendererFactory(
  (component: FirstOrderStudioComponent) => new AmplifyRenderer(component),
);

describe('amplify render tests', () => {
  it('should generate a simple button component', () => {
    const { componentText } = rendererFactory.buildRenderer(schema as any).renderComponent();
    expect(componentText).toMatchSnapshot();
  });
});
