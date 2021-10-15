import { TestGenerator } from './lib/generators/TestGenerator';

new TestGenerator({
  writeToLogger: true,
  writeToDisk: false,
}).generate();
