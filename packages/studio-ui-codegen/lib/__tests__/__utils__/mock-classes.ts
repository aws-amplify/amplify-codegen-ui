/* eslint-disable max-classes-per-file */
import { StudioComponent } from '@amzn/amplify-ui-codegen-schema';
import { StudioTemplateRenderer } from '../../studio-template-renderer';
import { FrameworkOutputManager } from '../../framework-output-manager';

export class MockOutputManager extends FrameworkOutputManager<string> {
  writeComponent(): Promise<void> {
    return new Promise((resolve) => {
      resolve();
    });
  }
}

export class MockTemplateRenderer extends StudioTemplateRenderer<
  string,
  StudioComponent,
  MockOutputManager,
  { componentText: string; renderComponentToFilesystem: (outputPath: string) => Promise<void> }
> {
  renderComponent() {
    return {
      componentText: this.component.name || '',
      renderComponentToFilesystem: jest.fn(),
    };
  }
}
