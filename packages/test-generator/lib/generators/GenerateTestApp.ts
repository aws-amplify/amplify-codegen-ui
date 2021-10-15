import { TestGenerator } from './TestGenerator';

new TestGenerator({
  writeToLogger: false,
  writeToDisk: true,
  disabledSchemas: [
    'ButtonWithConditionalState', // TODO: Fix Conditional
    'ButtonWithConcatenatedText', // TODO: Fix Concatenation
    'ExampleTheme', // TODO: Fix Themes
  ],
}).generate();
