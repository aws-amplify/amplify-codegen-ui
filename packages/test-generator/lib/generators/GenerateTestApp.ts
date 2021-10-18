import { TestGenerator } from './TestGenerator';

new TestGenerator({
  writeToLogger: false,
  writeToDisk: true,
  disabledSchemas: [
    'ComponentWithConcatenation', // TODO: Support Concatenation E2E Tests
    'ComponentWithConditional', // TODO: Support Conditional E2E Tests
    'ComponentWithDataBinding', // TODO: Support Data Binding E2E Tests
    'ComponentWithExposedAs', // TODO: Support Custom Props E2E Tests
    'CollectionBasic', // TODO: Support Collection E2E Tests
    'CollectionWithBinding', // TODO: Support Collection Binding E2E Tests
    'CollectionWithSort', // TODO: Support Collection Sorting E2E Tests
    'ComponentWithVariant', // TODO: Support Variant E2E Tests
    'ComponentWithActionSignOut', // TODO: Support Auth Action E2E Tests
    'ComponentWithActionNavigation', // TODO: Support Navigation Action E2E Tests
    'ExampleTheme', // TODO: Support Theme E2E Tests
  ],
}).generate();
