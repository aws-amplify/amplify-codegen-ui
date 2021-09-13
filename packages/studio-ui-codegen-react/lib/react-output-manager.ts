import { FrameworkOutputManager } from '@amzn/studio-ui-codegen';
import { existsSync, mkdirSync, promises as fs } from 'fs';
import path from 'path';

export class ReactOutputManager extends FrameworkOutputManager<string> {
  async writeComponent(input: string, outputPath: string, componentName: string): Promise<void> {
    console.log('Writing file ', outputPath);

    const { dir } = path.parse(outputPath);

    if (!existsSync(dir)) {
      mkdirSync(dir);
    }

    if (!input) {
      throw new Error('You must call renderComponent before you can save the file.');
    }

    const generatedNotice = `\
/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

`;
    const generatedOutput = `${generatedNotice}${input}`;

    await fs.writeFile(outputPath, generatedOutput);
  }
}
