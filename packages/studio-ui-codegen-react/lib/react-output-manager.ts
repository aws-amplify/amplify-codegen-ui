import { FrameworkOutputManager } from '@amzn/studio-ui-codegen';
import { existsSync, mkdirSync } from 'fs';
import { promises as fs } from 'fs';
import path from 'path';

export default class ReactOutputManager extends FrameworkOutputManager<string> {
  async writeComponent(input: string, outputPath: string, componentName: string): Promise<void> {
    console.log('Writing file ', outputPath);

    const componentFileName = `${componentName}.tsx`;

    if (!existsSync(outputPath)) {
      mkdirSync(outputPath);
    }

    const pathWithComponent = path.join(outputPath, componentName);

    if (!existsSync(pathWithComponent)) {
      mkdirSync(pathWithComponent);
    }

    if (!input) {
      throw new Error('You must call renderComponent before you can save the file.');
    }

    const finalFileOutputPath = path.join(outputPath, componentFileName);
    await fs.writeFile(finalFileOutputPath, '/* eslint-disable */');
    await fs.writeFile(finalFileOutputPath, input);
  }
}
