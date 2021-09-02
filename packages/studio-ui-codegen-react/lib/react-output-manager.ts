import { FrameworkOutputManager } from '@amzn/studio-ui-codegen';
import { existsSync, mkdirSync, promises as fs } from 'fs';
import path from 'path';

export class ReactOutputManager extends FrameworkOutputManager<string> {
  async writeComponent(input: string, outputPath: string, componentName: string): Promise<void> {
    console.log('Writing file ', outputPath);

    const dir = path.parse(outputPath).base;

    if (!existsSync(dir)) {
      mkdirSync(dir);
    }

    if (!input) {
      throw new Error('You must call renderComponent before you can save the file.');
    }

    await fs.writeFile(outputPath, '/* eslint-disable */');
    await fs.writeFile(outputPath, input);
  }
}
